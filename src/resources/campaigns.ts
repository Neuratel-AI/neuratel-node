import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class CampaignsResource {
  constructor(private readonly _client: APIClient) {}

  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/campaigns", body);
  }

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/campaigns", { limit: 20, ...params });
  }

  get(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/campaigns/${campaignId}`);
  }

  update(campaignId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/campaigns/${campaignId}`, body);
  }

  delete(campaignId: string): Promise<void> {
    return this._client.delete(`/campaigns/${campaignId}`);
  }

  start(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/start`);
  }

  pause(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/pause`);
  }

  stop(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/stop`);
  }

  /** List outbound call records for campaigns. Filter by campaignId for a specific campaign. */
  listCalls(params?: { campaign_id?: string; status?: string; skip?: number; limit?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/campaigns/calls", params as Record<string, unknown>);
  }

  /** Get a specific campaign outbound call record. */
  getCall(callId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/campaigns/calls/${callId}`);
  }
}
