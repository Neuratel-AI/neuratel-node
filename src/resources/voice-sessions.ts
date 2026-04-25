import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class VoiceSessionsResource {
  constructor(private readonly _client: APIClient) {}

  list(
    params: Record<string, unknown> = {},
  ): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/voice-sessions", { limit: 20, ...params });
  }

  get(
    callId: string,
    params?: { include?: string },
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      `/voice-sessions/${callId}`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Merge keys into the row's `call_metadata` JSONB column.
   *
   * Only `call_metadata` is mutable on this endpoint — operators attach CRM
   * IDs, ticket numbers, post-call notes after the call ends. Status,
   * timing, and other fields are auto-managed by the platform.
   */
  update(
    callId: string,
    body: { call_metadata: Record<string, unknown> },
  ): Promise<Record<string, unknown>> {
    return this._client.patch(`/voice-sessions/${callId}`, body);
  }

  delete(
    callId: string,
    params?: { delete_recording?: boolean; delete_transcript?: boolean },
  ): Promise<void> {
    return this._client.delete(
      `/voice-sessions/${callId}`,
      params as Record<string, unknown>,
    );
  }

  /** Place a single outbound call. POST /v1/voice-sessions/outbound */
  outbound(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/voice-sessions/outbound", body);
  }

  active(): Promise<Record<string, unknown>> {
    return this._client.get("/voice-sessions/active");
  }

  concurrency(): Promise<Record<string, unknown>> {
    return this._client.get("/voice-sessions/concurrency");
  }

  hangup(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/hangup`);
  }

  listen(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/listen`);
  }

  whisper(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/whisper`);
  }

  barge(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/barge`);
  }
}
