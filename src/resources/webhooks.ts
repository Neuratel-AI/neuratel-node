import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class WebhooksResource {
  constructor(private readonly _client: APIClient) {}

  /** List all available webhook event types. */
  events(): Promise<Record<string, unknown>> {
    return this._client.get("/webhooks/events");
  }

  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/webhooks", body);
  }

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/webhooks", { limit: 20, ...params });
  }

  get(webhookId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/webhooks/${webhookId}`);
  }

  update(webhookId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.patch(`/webhooks/${webhookId}`, body);
  }

  delete(webhookId: string): Promise<void> {
    return this._client.delete(`/webhooks/${webhookId}`);
  }

  test(webhookId: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post(`/webhooks/${webhookId}/test`, body);
  }

  rotateSecret(webhookId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/webhooks/${webhookId}/secret/rotate`);
  }

  logs(webhookId: string, params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get(`/webhooks/${webhookId}/logs`, params);
  }
}
