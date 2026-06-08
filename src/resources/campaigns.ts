import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class CampaignsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Create a new outbound campaign.
   *
   * @param body - Campaign definition (name, agent_id, schedule, etc.).
   * @returns The created campaign record.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/campaigns", body);
  }

  /**
   * List campaigns, paginated.
   *
   * @param params - Optional filters (skip, limit, status, etc.). `limit` defaults to 20.
   * @returns A `Page` of campaigns; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/campaigns", { limit: 20, ...params });
  }

  /**
   * Fetch a single campaign by id.
   *
   * @param campaignId - The campaign id.
   * @returns The campaign record.
   * @throws {APIError} (including `NotFoundError`) if the campaign does not exist.
   */
  get(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/campaigns/${campaignId}`);
  }

  /**
   * Replace a campaign (full update).
   *
   * @param campaignId - The campaign id.
   * @param body - The full updated campaign payload.
   * @returns The updated campaign record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(campaignId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/campaigns/${campaignId}`, body);
  }

  /**
   * Delete a campaign.
   *
   * @param campaignId - The campaign id.
   * @throws {APIError} (including `NotFoundError`) if the campaign does not exist.
   */
  delete(campaignId: string): Promise<void> {
    return this._client.delete(`/campaigns/${campaignId}`);
  }

  /**
   * Start a campaign that is currently `draft` or `paused`.
   *
   * @param campaignId - The campaign id.
   * @returns The updated campaign record with `status: "running"`.
   * @throws {APIError} If the campaign is in a state that cannot be started.
   */
  start(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/start`);
  }

  /**
   * Pause a running campaign. Remains restartable via `start`.
   *
   * @param campaignId - The campaign id.
   * @returns The updated campaign record with `status: "paused"`.
   * @throws {APIError} If the campaign is not currently running.
   */
  pause(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/pause`);
  }

  /**
   * Stop a campaign. Terminal — the campaign cannot be restarted.
   *
   * @param campaignId - The campaign id.
   * @returns The updated campaign record with `status: "stopped"`.
   * @throws {APIError} If the campaign is not currently running or paused.
   */
  stop(campaignId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/campaigns/${campaignId}/stop`);
  }

  /**
   * List outbound call records for campaigns.
   *
   * @param params - Optional filters.
   * @param params.campaign_id - Restrict to a specific campaign.
   * @param params.status - Filter by call status.
   * @param params.skip - Number of records to skip.
   * @param params.limit - Max records to return.
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  listCalls(params?: { campaign_id?: string; status?: string; skip?: number; limit?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/campaigns/calls", params as Record<string, unknown>);
  }

  /**
   * Fetch a single campaign outbound call record.
   *
   * @param callId - The call id.
   * @returns The call record.
   * @throws {APIError} (including `NotFoundError`) if the call does not exist.
   */
  getCall(callId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/campaigns/calls/${callId}`);
  }
}
