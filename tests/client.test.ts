import { describe, it, expect } from "vitest";
import { NeuratelAI, APIError, AuthenticationError, NotFoundError, RateLimitError } from "../src/index.js";

describe("NeuratelAI client", () => {
  it("instantiates with all 10 resources", () => {
    const client = new NeuratelAI({ apiKey: "nk_test_key" });
    expect(client.agents).toBeDefined();
    expect(client.calls).toBeDefined();
    expect(client.phoneNumbers).toBeDefined();
    expect(client.campaigns).toBeDefined();
    expect(client.callLists).toBeDefined();
    expect(client.knowledgeBase).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.billing).toBeDefined();
    expect(client.apiKeys).toBeDefined();
    expect(client.integrations).toBeDefined();
  });

  it("uses default base URL", () => {
    const client = new NeuratelAI({ apiKey: "nk_test" });
    expect(client.toString()).toContain("api.neuratel.ai");
  });

  it("accepts custom base URL", () => {
    const client = new NeuratelAI({ apiKey: "nk_test", baseUrl: "http://localhost:4000/v1" });
    expect(client.toString()).toContain("localhost:4000");
  });
});

describe("Error hierarchy", () => {
  it("all errors extend APIError", () => {
    expect(new AuthenticationError("msg")).toBeInstanceOf(APIError);
    expect(new NotFoundError("msg")).toBeInstanceOf(APIError);
    expect(new RateLimitError("msg")).toBeInstanceOf(APIError);
  });

  it("APIError.fromResponse maps status codes correctly", () => {
    const headers = new Headers();
    expect(APIError.fromResponse(401, "Unauthorized", headers)).toBeInstanceOf(AuthenticationError);
    expect(APIError.fromResponse(404, "Not Found", headers)).toBeInstanceOf(NotFoundError);
    expect(APIError.fromResponse(429, "Rate Limited", headers)).toBeInstanceOf(RateLimitError);
  });

  it("extracts requestId from headers", () => {
    const headers = new Headers({ "x-request-id": "req_abc123" });
    const err = APIError.fromResponse(404, "Not Found", headers);
    expect(err.requestId).toBe("req_abc123");
  });

  it("stringifies FastAPI 422 validation errors", () => {
    const headers = new Headers();
    const body = { detail: [{ loc: ["body", "name"], msg: "field required", type: "missing" }] };
    const err = APIError.fromResponse(422, body, headers);
    expect(err.message).toContain("body.name");
    expect(err.message).toContain("field required");
  });
});

describe("Environment variable support", () => {
  it("reads NEURATEL_API_KEY from env when apiKey is not passed", () => {
    process.env.NEURATEL_API_KEY = "nk_from_env";
    const client = new NeuratelAI();
    expect(client.agents).toBeDefined();
    delete process.env.NEURATEL_API_KEY;
  });

  it("throws when no key is available", () => {
    delete process.env.NEURATEL_API_KEY;
    expect(() => new NeuratelAI()).toThrow("No API key provided");
  });

  it("explicit apiKey takes precedence over env", () => {
    process.env.NEURATEL_API_KEY = "nk_env";
    const client = new NeuratelAI({ apiKey: "nk_explicit" });
    expect(client.toString()).toContain("api.neuratel.ai");
    delete process.env.NEURATEL_API_KEY;
  });
});
