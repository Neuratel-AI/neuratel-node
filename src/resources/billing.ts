import type { APIClient } from "../core.js";

export class BillingResource {
  constructor(private readonly _client: APIClient) {}

  balance(): Promise<Record<string, unknown>> {
    return this._client.get("/billing/balance");
  }

  usage(params?: { days?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/billing/usage", params as Record<string, unknown>);
  }

  balanceHistory(params?: { skip?: number; limit?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/billing/balance/history", params as Record<string, unknown>);
  }
}
