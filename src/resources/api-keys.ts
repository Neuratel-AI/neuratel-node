import type { APIClient } from "../core.js";

export class APIKeysResource {
  constructor(private readonly _client: APIClient) {}

  /** Create an org API key. Returns key + secret (shown once). */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/api-keys", body);
  }

  list(params?: { include_revoked?: boolean }): Promise<Record<string, unknown>> {
    return this._client.get("/api-keys", params as Record<string, unknown>);
  }

  /** Immediately invalidate an API key. */
  revoke(keyId: string): Promise<void> {
    return this._client.delete(`/api-keys/${keyId}`);
  }

  /** Replace a key — old key stays valid for gracePeriodHours (1-168). */
  rotate(keyId: string, params?: { grace_period_hours?: number }): Promise<Record<string, unknown>> {
    return this._client.post(`/api-keys/${keyId}/rotate`, undefined, params as Record<string, unknown>);
  }

  scopes(): Promise<Record<string, unknown>> {
    return this._client.get("/api-keys/scopes");
  }
}
