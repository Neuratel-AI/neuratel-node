import type { APIClient } from "../core.js";

/**
 * Conversations resource — unified inbox for chat (SMS + WhatsApp) and voice.
 *
 * A conversation groups messages and voice sessions exchanged with one contact
 * through one channel. Use this for chat-style operations: listing threads,
 * sending replies, marking read, fetching messages, and the per-conversation
 * analytics dashboard. For real-time voice control use `voiceSessions` instead.
 */
export class ConversationsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List conversations for the current org, with optional filters.
   *
   * @param params - Optional filters.
   * @param params.channel - `sms` | `whatsapp` | `voice`.
   * @param params.status - Conversation status filter.
   * @param params.skip - Number of records to skip.
   * @param params.limit - Max records to return.
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  list(
    params: { channel?: string; status?: string; skip?: number; limit?: number } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get("/conversations", params as Record<string, unknown>);
  }

  /**
   * Fetch a single conversation by id.
   *
   * @param conversationId - The conversation id.
   * @returns The conversation record.
   * @throws {APIError} (including `NotFoundError`) if the conversation does not exist.
   */
  get(conversationId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/conversations/${conversationId}`);
  }

  /**
   * List messages inside a conversation.
   *
   * @param conversationId - The conversation id.
   * @param params - Optional windowing.
   * @param params.skip - Number of messages to skip.
   * @param params.limit - Max messages to return.
   * @param params.since - ISO-8601 lower bound (inclusive).
   * @param params.before - ISO-8601 upper bound (exclusive).
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  listMessages(
    conversationId: string,
    params: { skip?: number; limit?: number; since?: string; before?: string } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/conversations/${conversationId}/messages`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Send a message into a conversation. Works for chat channels (SMS / WhatsApp)
   * and for in-call voice injections depending on the conversation's `channel`.
   *
   * @param conversationId - The target conversation id.
   * @param body - The message payload.
   * @param body.body - Message text.
   * @param body.media_urls - Optional media attachments (chat only).
   * @param body.client_temp_id - Idempotency key; dedupes retries on the server.
   * @returns The persisted message record.
   * @throws {APIError} If the platform rejects the request (e.g. outside the
   *   24h WhatsApp customer-service window for freeform text).
   */
  sendMessage(
    conversationId: string,
    body: { body: string; media_urls?: string[]; client_temp_id?: string } & Record<
      string,
      unknown
    >,
  ): Promise<Record<string, unknown>> {
    return this._client.post(`/conversations/${conversationId}/messages`, body);
  }

  /**
   * Mark a conversation as read up to "now". Resets the unread counter.
   *
   * @param conversationId - The conversation id.
   * @returns The updated conversation record.
   * @throws {APIError} If the platform rejects the request.
   */
  markRead(conversationId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/conversations/${conversationId}/read`);
  }

  /**
   * Fetch the merged, chronologically-sorted timeline of messages and events
   * (e.g. handoffs, transfers, tool calls) for a conversation.
   *
   * @param conversationId - The conversation id.
   * @param params - Optional windowing.
   * @param params.limit - Max events to return.
   * @param params.since - ISO-8601 lower bound (inclusive).
   * @param params.before - ISO-8601 upper bound (exclusive).
   * @returns A response with a `results` array of events.
   * @throws {APIError} If the platform rejects the request.
   */
  timeline(
    conversationId: string,
    params: { limit?: number; since?: string; before?: string } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/conversations/${conversationId}/timeline`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Update the `dynamic_variables` for a live conversation. Lets operators
   * inject context (CRM record id, lookup results, etc.) into an in-flight call.
   *
   * @param conversationId - The conversation id.
   * @param body - Variable update payload.
   * @param body.dynamic_variables - Key/value pairs to merge (or replace).
   * @param body.replace - If `true`, replace the entire `dynamic_variables` map
   *   instead of merging. Defaults to `false` (merge).
   * @returns The updated conversation record.
   * @throws {APIError} If the platform rejects the request.
   */
  updateDynamicVariables(
    conversationId: string,
    body: { dynamic_variables?: Record<string, unknown>; replace?: boolean },
  ): Promise<Record<string, unknown>> {
    return this._client.patch(
      `/conversations/${conversationId}/dynamic_variables`,
      body,
    );
  }

  /**
   * Get the per-conversation analytics dashboard (chat + voice KPIs, time series).
   *
   * @param params - Date range and dimension filters.
   * @param params.start_date - ISO-8601 lower bound (inclusive).
   * @param params.end_date - ISO-8601 upper bound (inclusive).
   * @param params.channel - Restrict to a single channel (`sms` | `whatsapp` | `voice`).
   * @param params.agent_id - Restrict to a single agent.
   * @param params.interval - Bucket size: `hour` | `day` | `week` | `month`.
   * @returns Dashboard payload (totals, time series, breakdowns).
   * @throws {APIError} If the platform rejects the request.
   */
  analyticsDashboard(
    params: {
      start_date?: string;
      end_date?: string;
      channel?: string;
      agent_id?: string;
      interval?: string;
    } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      "/conversations/analytics/dashboard",
      params as Record<string, unknown>,
    );
  }
}
