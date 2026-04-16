import { VERSION } from "./version.js";
import { APIError, APIConnectionError, APITimeoutError } from "./error.js";
import { Page, type PageResponse } from "./pagination.js";
import type { PlatformEvent } from "./streaming.js";

const DEFAULT_BASE_URL = "https://api.neuratel.ai/v1";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY_MS = 500;
const MAX_RETRY_DELAY_MS = 8_000;
const JITTER_FACTOR = 0.2; // 20% — matches Vapi/industry standard

function parseRetryAfter(headers: Headers): number | null {
  // retry-after-ms takes priority (milliseconds precision)
  const retryAfterMs = headers.get("retry-after-ms");
  if (retryAfterMs !== null) {
    const ms = Number.parseInt(retryAfterMs, 10);
    if (!Number.isNaN(ms) && ms > 0) return ms;
  }

  const retryAfter = headers.get("retry-after");
  if (retryAfter === null) return null;

  // Numeric seconds
  const numeric = Number.parseFloat(retryAfter);
  if (!Number.isNaN(numeric)) return numeric * 1000;

  // RFC 2822 date string
  const date = new Date(retryAfter);
  if (!Number.isNaN(date.getTime())) {
    return Math.max(date.getTime() - Date.now(), 0);
  }

  return null;
}

function parseRateLimitReset(headers: Headers): number | null {
  const reset = headers.get("x-ratelimit-reset");
  if (reset === null) return null;
  const timestamp = Number.parseInt(reset, 10);
  if (Number.isNaN(timestamp)) return null;
  return Math.max(timestamp * 1000 - Date.now(), 0);
}

function retryDelay(attempt: number, response?: Response): number {
  if (response) {
    // 1. retry-after / retry-after-ms
    const retryAfterMs = parseRetryAfter(response.headers);
    if (retryAfterMs !== null) {
      return retryAfterMs * (1 + Math.random() * JITTER_FACTOR);
    }
    // 2. X-RateLimit-Reset
    const resetMs = parseRateLimitReset(response.headers);
    if (resetMs !== null) {
      return Math.min(resetMs, MAX_RETRY_DELAY_MS) * (1 + Math.random() * JITTER_FACTOR);
    }
  }
  // 3. Exponential backoff with symmetric jitter (±10%)
  const delay = Math.min(INITIAL_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
  return delay * (1 + (Math.random() - 0.5) * JITTER_FACTOR);
}

function shouldRetry(status: number): boolean {
  return status === 429 || status === 408 || status >= 500;
}

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  fetch?: typeof globalThis.fetch;
}

export class APIClient {
  private readonly _apiKey: string;
  readonly baseUrl: string;
  private readonly _timeoutMs: number;
  private readonly _maxRetries: number;
  private readonly _fetch: typeof globalThis.fetch;

  constructor(options: ClientOptions = {}) {
    const apiKey = options.apiKey ?? (typeof process !== "undefined" ? process.env?.NEURATEL_API_KEY : undefined);
    if (!apiKey) {
      throw new Error(
        "No API key provided. Pass apiKey in options or set the NEURATEL_API_KEY environment variable."
      );
    }
    this._apiKey = apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this._timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this._maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this._fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  private _headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this._apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": `@neuratelai/sdk/${VERSION}`,
    };
  }

  async request<T>(
    method: string,
    path: string,
    options: {
      params?: Record<string, unknown>;
      body?: unknown;
      attempt?: number;
    } = {},
  ): Promise<T> {
    const { params, body, attempt = 0 } = options;

    const url = new URL(this.baseUrl + path);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this._timeoutMs);

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const headers = isFormData
      ? Object.fromEntries(Object.entries(this._headers()).filter(([k]) => k !== "Content-Type"))
      : this._headers();

    let response: Response;
    try {
      response = await this._fetch(url.toString(), {
        method,
        headers,
        body: body !== undefined ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if ((err as Error).name === "AbortError") throw new APITimeoutError();
      throw new APIConnectionError(String((err as Error).message));
    }
    clearTimeout(timeout);

    if (!response.ok) {
      let responseBody: unknown;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = await response.text();
      }

      const error = APIError.fromResponse(response.status, responseBody, response.headers);

      if (attempt < this._maxRetries && shouldRetry(response.status)) {
        await new Promise((r) => setTimeout(r, retryDelay(attempt, response)));
        return this.request<T>(method, path, { params, body, attempt: attempt + 1 });
      }

      throw error;
    }

    if (response.status === 204) return undefined as unknown as T;
    return response.json() as Promise<T>;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  async post<T>(path: string, body?: unknown, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("POST", path, { body, params });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  async delete(path: string, params?: Record<string, unknown>): Promise<void> {
    await this.request<void>("DELETE", path, { params });
  }

  async paginate<T>(path: string, params: Record<string, unknown> = {}): Promise<Page<T>> {
    const data = await this.get<PageResponse<T>>(path, params);
    return new Page(data, (p) => this.get<PageResponse<T>>(path, p), params);
  }

  /**
   * Returns an AsyncIterable that connects to the SSE stream lazily (on first iteration).
   * The connection is not made until you start iterating.
   */
  streamEvents(path: string): AsyncIterable<PlatformEvent> {
    const url = this.baseUrl + path;
    const headers = {
      ...this._headers(),
      Accept: "text/event-stream", // override for SSE
    };
    const fetchFn = this._fetch;

    return {
      async *[Symbol.asyncIterator]() {
        const response = await fetchFn(url, { headers });
        if (!response.ok) {
          let body: unknown;
          try {
            body = await response.json();
          } catch {
            body = await response.text();
          }
          throw APIError.fromResponse(response.status, body, response.headers);
        }

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const raw = line.slice(6).trim();
                if (raw === "[DONE]") return;
                try {
                  yield JSON.parse(raw) as PlatformEvent;
                } catch {
                  // skip malformed events
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      },
    };
  }

  toString(): string {
    return `NeuratelAI(baseUrl=${this.baseUrl})`;
  }
}
