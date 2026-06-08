import type { APIClient } from "../core.js";

/**
 * WhatsApp resource — WABA accounts, templates, calls, and outbound messaging.
 *
 * Two surfaces:
 *  - `accounts` (CRUD + import + verify + per-account call/template lookups)
 *  - platform-wide `outbound-*` (single call/message/text/voice + batch-call)
 *
 * The platform proxies inbound media via `getMessageMedia` so the client
 * can download attachments without exposing the upstream WABA token.
 */
export class WhatsappResource {
  constructor(private readonly _client: APIClient) {}

  // ── Accounts ────────────────────────────────────────────────────────────

  /**
   * List WhatsApp Business Accounts (WABAs) registered for the current org.
   *
   * @param params - Optional filters.
   * @param params.agent_id - Restrict to WABAs bound to a specific agent.
   * @returns A response with the account records.
   * @throws {APIError} If the platform rejects the request.
   */
  listAccounts(params?: { agent_id?: string }): Promise<Record<string, unknown>> {
    return this._client.get("/whatsapp/accounts", params as Record<string, unknown>);
  }

  /**
   * OAuth-style import flow for a WABA connected via Meta.
   *
   * @param body - OAuth callback payload (code, state, redirect_uri, etc.).
   * @returns The imported account record.
   * @throws {APIError} If the platform rejects the request.
   */
  importAccount(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/accounts/import", body);
  }

  /**
   * Manually register a WABA using raw Meta credentials (no OAuth).
   *
   * @param body - Raw Meta credentials (waba_id, phone_number_id, system_user_token, ...).
   * @returns The imported account record.
   * @throws {APIError} If the platform rejects the request or the credentials are invalid.
   */
  importAccountManual(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/accounts/import-manual", body);
  }

  /**
   * Fetch a single WABA by phone number id.
   *
   * @param phoneNumberId - The Meta phone number id.
   * @returns The account record.
   * @throws {APIError} (including `NotFoundError`) if the account does not exist.
   */
  getAccount(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/whatsapp/accounts/${phoneNumberId}`);
  }

  /**
   * Partially update a WABA (display name, webhooks, default agent, etc.).
   *
   * @param phoneNumberId - The Meta phone number id.
   * @param body - Fields to update.
   * @returns The updated account record.
   * @throws {APIError} If the platform rejects the request.
   */
  updateAccount(
    phoneNumberId: string,
    body: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._client.patch(`/whatsapp/accounts/${phoneNumberId}`, body);
  }

  /**
   * Delete (disconnect) a WABA from the platform.
   *
   * @param phoneNumberId - The Meta phone number id.
   * @throws {APIError} (including `NotFoundError`) if the account does not exist.
   */
  deleteAccount(phoneNumberId: string): Promise<void> {
    return this._client.delete(`/whatsapp/accounts/${phoneNumberId}`);
  }

  // ── Per-account lookups ─────────────────────────────────────────────────

  /**
   * Check whether a specific WhatsApp user can be called by this WABA.
   *
   * @param phoneNumberId - The Meta phone number id initiating the call.
   * @param params - Lookup parameters.
   * @param params.user_wa_id - The target user's WhatsApp id.
   * @returns Permission result (`can_call`, reason, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  checkCallPermission(
    phoneNumberId: string,
    params: { user_wa_id: string },
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/whatsapp/accounts/${phoneNumberId}/call-permissions`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Get the status of a previously-initiated WhatsApp call by intent id.
   *
   * @param phoneNumberId - The Meta phone number id that initiated the call.
   * @param intentId - The call intent id returned from the outbound call endpoint.
   * @returns The call status record.
   * @throws {APIError} (including `NotFoundError`) if the intent does not exist.
   */
  getCallStatus(phoneNumberId: string, intentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/whatsapp/accounts/${phoneNumberId}/calls/${intentId}`);
  }

  /**
   * List message templates registered for a WABA.
   *
   * @param phoneNumberId - The Meta phone number id.
   * @param params - Optional filters.
   * @param params.status - Filter by template status (`approved`, `pending`, `rejected`).
   * @returns A response with the template descriptors.
   * @throws {APIError} If the platform rejects the request.
   */
  listTemplates(
    phoneNumberId: string,
    params?: { status?: string },
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/whatsapp/accounts/${phoneNumberId}/templates`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Run a health check on a WABA. Returns the WABA's current status.
   *
   * @param phoneNumberId - The Meta phone number id.
   * @returns The verify response (status, quality rating, restrictions, ...).
   * @throws {APIError} If the platform rejects the request.
   */
  verifyAccount(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/whatsapp/accounts/${phoneNumberId}/verify`);
  }

  // ── Outbound ────────────────────────────────────────────────────────────

  /**
   * Place a single outbound WhatsApp call (the platform picks a WABA).
   *
   * @param body - Outbound call payload (`to`, `agent_id`, optional `phone_number_id`).
   * @returns The call intent record.
   * @throws {APIError} If the platform rejects the request.
   */
  outboundCall(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/outbound-call", body);
  }

  /**
   * Send a pre-approved template message (header + body + buttons/footer).
   *
   * @param body - Template send payload (`to`, `template_name`, `language`, `components`).
   * @returns The sent message record.
   * @throws {APIError} If the platform rejects the request.
   */
  outboundMessage(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/outbound-message", body);
  }

  /**
   * Send a freeform text message (within the 24h customer-service window).
   *
   * @param body - Freeform text payload (`to`, `text`).
   * @returns The sent message record.
   * @throws {APIError} If the platform rejects the request (e.g. outside the
   *   24h customer-service window — use `outboundMessage` for templates).
   */
  outboundText(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/outbound-text", body);
  }

  /**
   * Send a voice note via WhatsApp.
   *
   * @param body - Voice note payload (`to`, `media_url` or `media_id`).
   * @returns The sent message record.
   * @throws {APIError} If the platform rejects the request.
   */
  outboundVoice(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/outbound-voice", body);
  }

  /**
   * Place a batch of outbound WhatsApp calls in one request.
   *
   * @param body - Batch payload (array of `{ to, agent_id, dynamic_variables }`).
   * @returns A summary with the created call intents and any per-item errors.
   * @throws {APIError} If the platform rejects the batch request itself.
   */
  batchCall(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/whatsapp/batch-call", body);
  }

  // ── Media ───────────────────────────────────────────────────────────────

  /**
   * Proxy-download media for a WhatsApp message. The platform fetches the
   * attachment from Meta on the caller's behalf so the upstream WABA token
   * never has to leave the platform.
   *
   * @param messageId - The Meta message id of the attachment.
   * @returns A media descriptor (url, mime_type, sha256, file_size).
   * @throws {APIError} (including `NotFoundError`) if the message is missing
   *   or has no downloadable media.
   */
  getMessageMedia(messageId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/whatsapp/messages/${messageId}/media`);
  }
}
