import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class CallsResource {
  constructor(private readonly _client: APIClient) {}

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/calls", { limit: 20, ...params });
  }

  get(callId: string, params?: { include?: string }): Promise<Record<string, unknown>> {
    return this._client.get(`/calls/${callId}`, params as Record<string, unknown>);
  }

  delete(callId: string, params?: { delete_recording?: boolean; delete_transcript?: boolean }): Promise<void> {
    return this._client.delete(`/calls/${callId}`, params as Record<string, unknown>);
  }

  /** Place a single outbound call. POST /v1/calls/outbound */
  outbound(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/calls/outbound", body);
  }

  active(): Promise<Record<string, unknown>> {
    return this._client.get("/calls/active");
  }

  concurrency(): Promise<Record<string, unknown>> {
    return this._client.get("/calls/concurrency");
  }

  hangup(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/calls/${callId}/hangup`);
  }

  listen(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/calls/${callId}/listen`);
  }

  whisper(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/calls/${callId}/whisper`);
  }

  barge(callId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/calls/${callId}/barge`);
  }

}
