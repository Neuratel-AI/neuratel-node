import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class WebhooksResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List all available webhook event types the platform can emit.
   *
   * @returns Array of event descriptors (`name`, `description`, `payload_schema`).
   * @throws {APIError} If the platform rejects the request.
   */
  events(): Promise<Record<string, unknown>> {
    return this._client.get("/webhooks/events");
  }

  /**
   * Register a new webhook endpoint.
   *
   * @param body - Webhook definition (url, events, secret, headers, etc.).
   * @returns The created webhook record. The `secret` (if any) is returned
   *   only on this call — store it for signature verification.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/webhooks", body);
  }

  /**
   * List webhooks for the current org, paginated.
   *
   * @param params - Optional filters (skip, limit, etc.). `limit` defaults to 20.
   * @returns A `Page` of webhooks; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/webhooks", { limit: 20, ...params });
  }

  /**
   * Fetch a single webhook by id.
   *
   * @param webhookId - The webhook id.
   * @returns The webhook record.
   * @throws {APIError} (including `NotFoundError`) if the webhook does not exist.
   */
  get(webhookId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/webhooks/${webhookId}`);
  }

  /**
   * Partially update a webhook (url, events, active, headers, etc.).
   *
   * @param webhookId - The webhook id.
   * @param body - Fields to update.
   * @returns The updated webhook record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(webhookId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.patch(`/webhooks/${webhookId}`, body);
  }

  /**
   * Delete a webhook.
   *
   * @param webhookId - The webhook id.
   * @throws {APIError} (including `NotFoundError`) if the webhook does not exist.
   */
  delete(webhookId: string): Promise<void> {
    return this._client.delete(`/webhooks/${webhookId}`);
  }

  /**
   * Send a test event to a webhook endpoint. Useful for verifying URL
   * reachability and signature handling before going live.
   *
   * @param webhookId - The webhook id.
   * @param body - Optional test payload overrides (event type, sample data, etc.).
   * @returns The test delivery result (status code, latency, response).
   * @throws {APIError} If the platform rejects the request.
   */
  test(webhookId: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post(`/webhooks/${webhookId}/test`, body);
  }

  /**
   * Rotate the signing secret for a webhook. The new secret is returned
   * exactly once and the old secret stops signing future deliveries.
   *
   * @param webhookId - The webhook id.
   * @returns The new secret value.
   * @throws {APIError} If the platform rejects the request.
   */
  rotateSecret(webhookId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/webhooks/${webhookId}/secret/rotate`);
  }

  /**
   * Get recent delivery attempts for a webhook (request, response, status, latency).
   *
   * @param webhookId - The webhook id.
   * @param params - Optional filters (since, status, skip, limit, etc.).
   * @returns A response with a `results` array of delivery log entries.
   * @throws {APIError} If the platform rejects the request.
   */
  logs(webhookId: string, params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get(`/webhooks/${webhookId}/logs`, params);
  }
}
