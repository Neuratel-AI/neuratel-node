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

  /**
   * Check whether a phone number appears in the platform DNC directory.
   *
   * Use this as a pre-dial gate before placing outbound calls.
   *
   * @param phone - The phone number in E.164 format.
   * @returns A response with `on_dnc`, `source`, and any matched entry details.
   * @throws {APIError} If the platform rejects the request.
   */
  check(phone: string): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/check", { phone });
  }

  /**
   * List DNC entries visible to the current org.
   *
   * @param params - Optional filters.
   * @param params.source - Restrict to a specific source (e.g. `global`, `org`).
   * @param params.limit - Max records to return (default 100).
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  listEntries(
    params: { source?: string; limit?: number } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/entries", { limit: 100, ...params });
  }

  /**
   * Add a phone number to the org's DNC list.
   *
   * @param body - Entry payload.
   * @param body.phone - Phone number in E.164 format.
   * @param body.reason - Optional human-readable reason.
   * @returns The created DNC entry record.
   * @throws {APIError} If the platform rejects the request.
   */
  addEntry(
    body: { phone: string; reason?: string } & Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._client.post("/dnc/entries", body);
  }

  /**
   * Remove a DNC entry by id.
   *
   * @param entryId - The DNC entry id.
   * @throws {APIError} (including `NotFoundError`) if the entry does not exist.
   */
  deleteEntry(entryId: string): Promise<void> {
    return this._client.delete(`/dnc/entries/${entryId}`);
  }

  /**
   * Get the current org's DNC protection settings.
   *
   * @returns Settings record (`protection_enabled`, `auto_add_inbound_optouts`, ...).
   * @throws {APIError} If the platform rejects the request.
   */
  getSettings(): Promise<Record<string, unknown>> {
    return this._client.get("/dnc/settings");
  }

  /**
   * Update the current org's DNC protection settings.
   *
   * @param body - Settings to merge.
   * @param body.protection_enabled - When `true`, the platform blocks outbound
   *   calls to numbers on the DNC directory.
   * @param body.auto_add_inbound_optouts - When `true`, STOP-keyword replies
   *   from inbound SMS/WhatsApp are added to the DNC list automatically.
   * @returns The updated settings record.
   * @throws {APIError} If the platform rejects the request.
   */
  updateSettings(
    body: { protection_enabled?: boolean; auto_add_inbound_optouts?: boolean },
  ): Promise<Record<string, unknown>> {
    return this._client.patch("/dnc/settings", body);
  }
}
