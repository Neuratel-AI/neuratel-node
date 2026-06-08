import type { APIClient } from "../core.js";

export class APIKeysResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Create an org API key.
   *
   * @param body - Key definition (name, scopes, expires_at, etc.).
   * @returns The new key record. The `secret` is returned exactly once and cannot
   *   be retrieved later — store it immediately.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/api-keys", body);
  }

  /**
   * List API keys for the current organization.
   *
   * @param params - Optional filters.
   * @param params.include_revoked - If `true`, include revoked keys (default: false).
   * @returns A response containing the key list and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params?: { include_revoked?: boolean }): Promise<Record<string, unknown>> {
    return this._client.get("/api-keys", params as Record<string, unknown>);
  }

  /**
   * Immediately invalidate an API key. Any subsequent use of the key will fail.
   *
   * @param keyId - The key id to revoke.
   * @throws {APIError} (including `NotFoundError`) if the key does not exist.
   */
  revoke(keyId: string): Promise<void> {
    return this._client.delete(`/api-keys/${keyId}`);
  }

  /**
   * Replace a key — the old key stays valid for `grace_period_hours` (1-168) so
   * callers can roll credentials over without downtime.
   *
   * @param keyId - The key id to rotate.
   * @param params - Optional overrides.
   * @param params.grace_period_hours - Hours the old key remains valid (1-168).
   * @returns The new key record (with a fresh `secret`, shown once).
   * @throws {APIError} If the platform rejects the request.
   */
  rotate(keyId: string, params?: { grace_period_hours?: number }): Promise<Record<string, unknown>> {
    return this._client.post(`/api-keys/${keyId}/rotate`, undefined, params as Record<string, unknown>);
  }

  /**
   * List the permission scopes the platform supports for API keys.
   *
   * @returns Array of scope descriptors (`name`, `description`, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  scopes(): Promise<Record<string, unknown>> {
    return this._client.get("/api-keys/scopes");
  }
}
