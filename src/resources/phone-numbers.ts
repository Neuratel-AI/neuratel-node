import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class PhoneNumbersResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List phone numbers owned by the current org, paginated.
   *
   * @param params - Optional filters (skip, limit, status, country, etc.). `limit` defaults to 20.
   * @returns A `Page` of phone numbers; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/numbers", { limit: 20, ...params });
  }

  /**
   * Fetch a single phone number by id.
   *
   * @param phoneNumberId - The phone number id.
   * @returns The phone number record (number, capabilities, routing, etc.).
   * @throws {APIError} (including `NotFoundError`) if the number does not exist.
   */
  get(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/numbers/${phoneNumberId}`);
  }

  /**
   * Update phone number settings (friendly name, routing, webhook overrides, etc.).
   *
   * @param phoneNumberId - The phone number id.
   * @param body - The fields to update.
   * @returns The updated phone number record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(phoneNumberId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/numbers/${phoneNumberId}`, body);
  }

  /**
   * Assign a phone number to an agent. Inbound calls to this number route to the agent.
   *
   * @param phoneNumberId - The phone number id.
   * @param agentId - The agent id to route inbound calls to.
   * @returns The updated phone number record.
   * @throws {APIError} If the platform rejects the request.
   */
  assign(phoneNumberId: string, agentId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/numbers/${phoneNumberId}/assign`, { agent_id: agentId });
  }

  /**
   * Remove the agent assignment from a phone number. Inbound calls will
   * fall through to the org's default routing (typically a 404 / hangup).
   *
   * @param phoneNumberId - The phone number id.
   * @returns The updated phone number record.
   * @throws {APIError} If the platform rejects the request.
   */
  unassign(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/numbers/${phoneNumberId}/unassign`);
  }
}
