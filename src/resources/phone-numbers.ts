import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class PhoneNumbersResource {
  constructor(private readonly _client: APIClient) {}

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/numbers", { limit: 20, ...params });
  }

  get(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/numbers/${phoneNumberId}`);
  }

  update(phoneNumberId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/numbers/${phoneNumberId}`, body);
  }

  assign(phoneNumberId: string, agentId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/numbers/${phoneNumberId}/assign`, { agent_id: agentId });
  }

  unassign(phoneNumberId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/numbers/${phoneNumberId}/unassign`);
  }
}
