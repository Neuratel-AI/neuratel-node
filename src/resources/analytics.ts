import type { APIClient } from "../core.js";

/**
 * Analytics resource — combined voice + chat dashboard.
 *
 * For per-channel analytics use the channel-specific endpoints
 * (`voiceSessions` for voice, `conversations.analyticsDashboard` for chat).
 * This resource is the union view.
 */
export class AnalyticsResource {
  constructor(private readonly _client: APIClient) {}

  dashboard(
    params: {
      start_date?: string;
      end_date?: string;
      agent_id?: string;
      channel?: string;
      direction?: string;
      interval?: string;
    } = {},
  ): Promise<Record<string, unknown>> {
    return this._client.get(
      "/analytics/dashboard",
      params as Record<string, unknown>,
    );
  }
}
