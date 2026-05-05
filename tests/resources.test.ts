/**
 * HTTP-level tests for resource methods.
 *
 * Mocks `globalThis.fetch` via vitest spies — proves each method targets
 * the right path / method, sends the right body shape, and parses the
 * response correctly. Errors map to the typed exception hierarchy.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  APIError,
  AuthenticationError,
  NeuratelAI,
  NotFoundError,
  RateLimitError,
} from "../src/index.js";

const BASE = "https://api.test/v1";

function client(opts: { maxRetries?: number } = {}): NeuratelAI {
  return new NeuratelAI({
    apiKey: "nk_test_123",
    baseUrl: BASE,
    maxRetries: opts.maxRetries ?? 0,
  });
}

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

let fetchSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
});

function mockOnce(body: unknown, status = 200, headers: Record<string, string> = {}): void {
  fetchSpy.mockResolvedValueOnce(jsonResponse(body, status, headers));
}

function lastRequest(): { url: string; init: RequestInit } {
  const last = fetchSpy.mock.calls.at(-1);
  if (!last) throw new Error("No fetch call captured");
  const [input, init] = last as [string | URL | Request, RequestInit];
  const url = typeof input === "string" ? input : input.toString();
  return { url, init: init ?? {} };
}

// ── Agents ────────────────────────────────────────────────────────────────

describe("agents resource", () => {
  it("get hits /agents/{id}", async () => {
    mockOnce({ id: "ag_1", name: "Aisha", status: "ready" });
    const out = await client().agents.get("ag_1");
    expect(out.id).toBe("ag_1");
    expect(lastRequest().url).toBe(`${BASE}/agents/ag_1`);
  });

  it("create posts the body", async () => {
    mockOnce({ id: "ag_new" });
    await client().agents.create({ name: "Salma", brain: { provider: "groq" } });
    const { url, init } = lastRequest();
    expect(url).toBe(`${BASE}/agents`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Salma",
      brain: { provider: "groq" },
    });
  });

  it("templates() hits /agents/templates", async () => {
    mockOnce({ templates: [{ id: "tpl_lead_qual" }] });
    const out = await client().agents.templates();
    expect(lastRequest().url).toBe(`${BASE}/agents/templates`);
    expect(out.templates).toBeDefined();
  });

  it("requiredVariables(id) hits /agents/{id}/required-variables", async () => {
    mockOnce({ variables: ["customer_name"] });
    const out = await client().agents.requiredVariables("ag_1");
    expect(lastRequest().url).toBe(`${BASE}/agents/ag_1/required-variables`);
    expect(out.variables).toBeDefined();
  });
});

// ── Voice sessions ────────────────────────────────────────────────────────

describe("voiceSessions resource", () => {
  it("outbound posts with the right body", async () => {
    mockOnce({ call_id: "vs_1", success: true, to_number: "+12125551234" });
    await client().voiceSessions.outbound({
      agent_id: "ag_1",
      to_number: "+12125551234",
      number_id: "num_1",
    });
    const { url, init } = lastRequest();
    expect(url).toBe(`${BASE}/voice-sessions/outbound`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      agent_id: "ag_1",
      to_number: "+12125551234",
      number_id: "num_1",
    });
  });

  it("get returns analysis_status / user_sentiment / call_successful", async () => {
    mockOnce({
      id: "vs_1",
      analysis_status: "completed",
      user_sentiment: "positive",
      user_sentiment_score: 0.87,
      call_successful: "yes",
    });
    const session = await client().voiceSessions.get("vs_1");
    expect(session.analysis_status).toBe("completed");
    expect(session.user_sentiment).toBe("positive");
    expect(session.call_successful).toBe("yes");
  });
});

// ── Conversations (new in 1C) ─────────────────────────────────────────────

describe("conversations resource", () => {
  it("list passes channel filter as query", async () => {
    mockOnce({ results: [], metadata: {} });
    await client().conversations.list({ channel: "whatsapp", limit: 10 });
    expect(lastRequest().url).toContain("channel=whatsapp");
    expect(lastRequest().url).toContain("limit=10");
  });

  it("sendMessage uses 'body' field (not 'text')", async () => {
    mockOnce({ id: "msg_1", body: "hello" });
    await client().conversations.sendMessage("conv_1", { body: "hello" });
    const { url, init } = lastRequest();
    expect(url).toBe(`${BASE}/conversations/conv_1/messages`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ body: "hello" });
  });

  it("updateDynamicVariables sends replace flag", async () => {
    mockOnce({ id: "conv_1" });
    await client().conversations.updateDynamicVariables("conv_1", {
      dynamic_variables: { name: "Alice" },
      replace: false,
    });
    const { init } = lastRequest();
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      dynamic_variables: { name: "Alice" },
      replace: false,
    });
  });
});

// ── DNC (new in 1C) ───────────────────────────────────────────────────────

describe("dnc resource", () => {
  it("check sends phone as query param", async () => {
    mockOnce({ phone: "+12125551234", blocked: true, source: "platform" });
    const out = await client().dnc.check("+12125551234");
    expect(lastRequest().url).toContain("phone=%2B12125551234");
    expect(out.blocked).toBe(true);
  });

  it("addEntry posts phone + reason", async () => {
    mockOnce({ id: "dnc_1" });
    await client().dnc.addEntry({ phone: "+12125551234", reason: "customer requested" });
    const { url, init } = lastRequest();
    expect(url).toBe(`${BASE}/dnc/entries`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      phone: "+12125551234",
      reason: "customer requested",
    });
  });

  it("updateSettings uses canonical field names", async () => {
    mockOnce({ protection_enabled: true });
    await client().dnc.updateSettings({
      protection_enabled: true,
      auto_add_inbound_optouts: true,
    });
    const { init } = lastRequest();
    expect(init.method).toBe("PATCH");
    expect(JSON.parse(init.body as string)).toEqual({
      protection_enabled: true,
      auto_add_inbound_optouts: true,
    });
  });
});

// ── Analytics (new in 1C) ─────────────────────────────────────────────────

describe("analytics resource", () => {
  it("dashboard passes channel filter", async () => {
    mockOnce({ voice: {}, chat: {} });
    await client().analytics.dashboard({ channel: "phone" });
    expect(lastRequest().url).toContain("channel=phone");
  });
});

// ── Error mapping ─────────────────────────────────────────────────────────

describe("error hierarchy", () => {
  it("404 → NotFoundError", async () => {
    mockOnce({ error: { message: "Not found" } }, 404);
    await expect(client().agents.get("ag_missing")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("401 → AuthenticationError", async () => {
    mockOnce({ error: { message: "bad key" } }, 401);
    await expect(client().billing.balance()).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("429 → RateLimitError", async () => {
    mockOnce({ error: { message: "slow down" } }, 429, { "retry-after": "1" });
    await expect(client().agents.list()).rejects.toBeInstanceOf(RateLimitError);
  });

  it("500 → APIError", async () => {
    mockOnce({ error: { message: "internal" } }, 500);
    await expect(client().billing.balance()).rejects.toBeInstanceOf(APIError);
  });
});
