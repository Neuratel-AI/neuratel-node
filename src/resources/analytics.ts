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

  /**
   * Fetch the combined voice + chat analytics dashboard.
   *
   * @param params - Date range and dimension filters.
   * @param params.start_date - ISO-8601 lower bound (inclusive).
   * @param params.end_date - ISO-8601 upper bound (inclusive).
   * @param params.agent_id - Restrict metrics to a single agent.
   * @param params.channel - `voice` | `sms` | `whatsapp` (or omit for union).
   * @param params.direction - `inbound` | `outbound` (or omit for both).
   * @param params.interval - Bucket size: `hour` | `day` | `week` | `month`.
   * @returns Dashboard payload (totals, time series, breakdowns).
   * @throws {APIError} If the platform rejects the request.
   */
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
