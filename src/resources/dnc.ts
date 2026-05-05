import type { APIClient } from "../core.js";

/**
 * DNC (Do Not Call) resource — platform DNC directory and per-org settings.
 *
 * Check phone numbers against the global directory before dialing, manage
 * per-org additions, and toggle organisation-wide DNC protection or STOP
 * auto-opt-out detection.
 */
export class DNCResource {
  constructor(private readonly _client: APIClient) {}

  check(phone: string): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/check", { phone });
  }

  listEntries(
    params: { source?: string; limit?: number } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/entries", { limit: 100, ...params });
  }

  addEntry(
    body: { phone: string; reason?: string } & Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._client.post("/dnc/entries", body);
  }

  deleteEntry(entryId: string): Promise<void> {
    return this._client.delete(`/dnc/entries/${entryId}`);
  }

  getSettings(): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/settings");
  }

  updateSettings(
    body: { protection_enabled?: boolean; auto_add_inbound_optouts?: boolean },
  ): Promise<Record<string, unknown>> {
    return this._client.patch("/dnc/settings", body);
  }
}
