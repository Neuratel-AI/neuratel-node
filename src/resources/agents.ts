import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class AgentsResource {
  constructor(private readonly _client: APIClient) {}

  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/agents", body);
  }

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/agents", { limit: 20, ...params });
  }

  get(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}`);
  }

  update(agentId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.patch(`/agents/${agentId}`, body);
  }

  delete(agentId: string): Promise<void> {
    return this._client.delete(`/agents/${agentId}`);
  }

  duplicate(agentId: string, params?: { new_name?: string }): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/duplicate`, undefined, params as Record<string, unknown>);
  }

  /** Start a WebRTC browser call. Returns token + server_url + session_id. */
  webCall(agentId: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/web-call`, body);
  }

  listVersions(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}/versions`);
  }

  getVersion(agentId: string, version: number): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}/versions/${version}`);
  }

  restoreVersion(agentId: string, version: number): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/versions/${version}/restore`);
  }
}
