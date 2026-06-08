import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class VoiceSessionsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List voice sessions (calls) for the current org, paginated.
   *
   * @param params - Optional filters (skip, limit, status, agent_id, etc.). `limit` defaults to 20.
   * @returns A `Page` of voice sessions; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(
    params: Record<string, unknown> = {},
  ): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/voice-sessions", { limit: 20, ...params });
  }

  /**
   * Fetch a single voice session by call id.
   *
   * @param callId - The voice session (call) id.
   * @param params - Optional includes.
   * @param params.include - Comma-separated list of related resources to
   *   embed (e.g. `transcript`, `recording`, `messages`).
   * @returns The voice session record.
   * @throws {APIError} (including `NotFoundError`) if the call does not exist.
   */
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
   *
   * @param callId - The voice session id.
   * @param body - Update payload.
   * @param body.call_metadata - Key/value pairs to merge into the metadata map.
   * @returns The updated voice session record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(
    callId: string,
    body: { call_metadata: Record<string, unknown> },
  ): Promise<Record<string, unknown>> {
    return this._client.patch(`/voice-sessions/${callId}`, body);
  }

  /**
   * Delete a voice session record. Optionally cascade-delete the recording
   * and/or transcript.
   *
   * @param callId - The voice session id.
   * @param params - Optional delete options.
   * @param params.delete_recording - If `true`, also delete the audio recording.
   * @param params.delete_transcript - If `true`, also delete the transcript.
   * @throws {APIError} (including `NotFoundError`) if the call does not exist.
   */
  delete(
    callId: string,
    params?: { delete_recording?: boolean; delete_transcript?: boolean },
  ): Promise<void> {
    return this._client.delete(
      `/voice-sessions/${callId}`,
      params as Record<string, unknown>,
    );
  }

  /**
   * Place a single outbound call. POST `/v1/voice-sessions/outbound`.
   *
   * @param body - Outbound call payload (`agent_id`, `to`, `from`, `dynamic_variables`, ...).
   * @returns The newly created voice session record.
   * @throws {APIError} If the platform rejects the request (DNC hit, no agent, bad number, etc.).
   */
  outbound(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/voice-sessions/outbound", body);
  }

  /**
   * List currently-active voice sessions (calls in progress right now).
   *
   * @returns A response with the active voice sessions.
   * @throws {APIError} If the platform rejects the request.
   */
  listActive(): Promise<Record<string, unknown>> {
    return this._client.get("/voice-sessions/active");
  }

  /**
   * Get the org's current concurrency usage (active calls vs. plan limit).
   *
   * @returns Concurrency record (`active`, `limit`, `available`, ...).
   * @throws {APIError} If the platform rejects the request.
   */
  concurrency(): Promise<Record<string, unknown>> {
    return this._client.get("/voice-sessions/concurrency");
  }

  /**
   * Force-hangup an in-progress call.
   *
   * @param callId - The voice session id.
   * @returns The updated voice session record with terminal `status`.
   * @throws {APIError} If the platform rejects the request.
   */
  hangup(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/hangup`);
  }

  /**
   * Start a supervisor listen-only session on an in-progress call.
   *
   * @param callId - The voice session id.
   * @returns A handle/credentials for the supervisor's listen stream.
   * @throws {APIError} If the platform rejects the request.
   */
  listen(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/listen`);
  }

  /**
   * Start a supervisor whisper session (only the agent hears the supervisor).
   *
   * @param callId - The voice session id.
   * @returns A handle/credentials for the supervisor's whisper stream.
   * @throws {APIError} If the platform rejects the request.
   */
  whisper(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/whisper`);
  }

  /**
   * Start a supervisor barge session (both the agent and customer hear the supervisor).
   *
   * @param callId - The voice session id.
   * @returns A handle/credentials for the supervisor's barge stream.
   * @throws {APIError} If the platform rejects the request.
   */
  barge(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/voice-sessions/${callId}/barge`);
  }
}
