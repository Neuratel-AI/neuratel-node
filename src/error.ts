export class NeuratelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NeuratelError";
  }
}

export class APIError extends NeuratelError {
  readonly status: number | undefined;
  readonly headers: Headers | undefined;
  readonly requestId: string | null;

  constructor(
    message: string,
    status?: number,
    headers?: Headers,
  ) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.headers = headers;
    this.requestId = headers?.get("x-request-id") ?? null;
  }

  static fromResponse(status: number, body: unknown, headers: Headers): APIError {
    const message = extractMessage(body);

    if (status === 401) return new AuthenticationError(message, status, headers);
    if (status === 403) return new PermissionDeniedError(message, status, headers);
    if (status === 404) return new NotFoundError(message, status, headers);
    if (status === 409) return new ConflictError(message, status, headers);
    if (status === 422) return new UnprocessableEntityError(message, status, headers);
    if (status === 429) return new RateLimitError(message, status, headers);
    if (status >= 500) return new InternalServerError(message, status, headers);
    return new APIError(message, status, headers);
  }
}

function extractMessage(body: unknown): string {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const detail = b.detail ?? b.message ?? b.error;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((e) => {
          if (typeof e === "object" && e !== null) {
            const err = e as Record<string, unknown>;
            const loc = Array.isArray(err.loc) ? err.loc.join(".") : "";
            return loc ? `${loc}: ${err.msg}` : String(err.msg);
          }
          return String(e);
        })
        .join("; ");
    }
    if (detail !== undefined) return String(detail);
  }
  return "Unknown error";
}

export class AuthenticationError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "AuthenticationError";
  }
}

export class PermissionDeniedError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "PermissionDeniedError";
  }
}

export class NotFoundError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "ConflictError";
  }
}

export class UnprocessableEntityError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "UnprocessableEntityError";
  }
}

export class RateLimitError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends APIError {
  constructor(message: string, status?: number, headers?: Headers) {
    super(message, status, headers);
    this.name = "InternalServerError";
  }
}

export class APIConnectionError extends NeuratelError {
  constructor(message: string) {
    super(message);
    this.name = "APIConnectionError";
  }
}

export class APITimeoutError extends APIConnectionError {
  constructor() {
    super("Request timed out");
    this.name = "APITimeoutError";
  }
}
