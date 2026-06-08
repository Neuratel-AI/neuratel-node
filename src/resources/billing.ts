import type { APIClient } from "../core.js";

export class BillingResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Get the current prepaid balance and credit info for the org.
   *
   * @returns The balance record (`balance`, `currency`, `low_balance`, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  balance(): Promise<Record<string, unknown>> {
    return this._client.get("/billing/balance");
  }

  /**
   * Get usage summary for the current org over a recent window.
   *
   * @param params - Optional window config.
   * @param params.days - Lookback window in days (server-default if omitted).
   * @returns Usage breakdown (minutes, calls, sms, whatsapp, cost, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  usage(params?: { days?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/billing/usage", params as Record<string, unknown>);
  }

  /**
   * Get the historical balance ledger (top-ups and deductions).
   *
   * @param params - Optional pagination overrides.
   * @param params.skip - Number of records to skip.
   * @param params.limit - Max records to return.
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  balanceHistory(params?: { skip?: number; limit?: number }): Promise<Record<string, unknown>> {
    return this._client.get("/billing/balance/history", params as Record<string, unknown>);
  }
}
