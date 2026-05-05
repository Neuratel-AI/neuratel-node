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

  list(
    params: { channel?: string; status?: string; skip?: number; limit?: number } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get("/conversations", params as Record<string, unknown>);
  }

  get(conversationId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/conversations/${conversationId}`);
  }

  listMessages(
    conversationId: string,
    params: { skip?: number; limit?: number; since?: string; before?: string } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/conversations/${conversationId}/messages`,
      params as Record<string, unknown>,
    );
  }

  sendMessage(
    conversationId: string,
    body: { body: string; media_urls?: string[]; client_temp_id?: string } & Record<
      string,
      unknown
    >,
  ): Promise<Record<string, unknown>> {
    return this._client.post(`/conversations/${conversationId}/messages`, body);
  }

  markRead(conversationId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/conversations/${conversationId}/read`);
  }

  timeline(
    conversationId: string,
    params: { limit?: number; since?: string; before?: string } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/conversations/${conversationId}/timeline`,
      params as Record<string, unknown>,
    );
  }

  updateDynamicVariables(
    conversationId: string,
    body: { dynamic_variables?: Record<string, unknown>; replace?: boolean },
  ): Promise<Record<string, unknown>> {
    return this._client.patch(
      `/conversations/${conversationId}/dynamic_variables`,
      body,
    );
  }

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
