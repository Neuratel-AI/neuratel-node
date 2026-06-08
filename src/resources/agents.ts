import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class AgentsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Create a new agent.
   *
   * @param body - Agent definition (name, prompt, voice, tools, etc.).
   * @returns The created agent record.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/agents", body);
  }

  /**
   * List agents for the current organization, paginated.
   *
   * @param params - Optional filters (skip, limit, status, etc.). `limit` defaults to 20.
   * @returns A `Page` of agents; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/agents", { limit: 20, ...params });
  }

  /**
   * Fetch a single agent by id.
   *
   * @param agentId - The agent id.
   * @returns The agent record.
   * @throws {APIError} (including `NotFoundError`) if the agent does not exist.
   */
  get(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}`);
  }

  /**
   * Partially update an agent (JSON merge patch).
   *
   * @param agentId - The agent id.
   * @param body - Fields to update.
   * @returns The updated agent record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(agentId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.patch(`/agents/${agentId}`, body);
  }

  /**
   * Delete an agent.
   *
   * @param agentId - The agent id.
   * @throws {APIError} (including `NotFoundError`) if the agent does not exist.
   */
  delete(agentId: string): Promise<void> {
    return this._client.delete(`/agents/${agentId}`);
  }

  /**
   * Duplicate an existing agent, optionally renaming the copy.
   *
   * @param agentId - The source agent id.
   * @param params - Optional overrides; `new_name` sets the copy's display name.
   * @returns The newly created (cloned) agent record.
   * @throws {APIError} If the platform rejects the request.
   */
  duplicate(agentId: string, params?: { new_name?: string }): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/duplicate`, undefined, params as Record<string, unknown>);
  }

  /**
   * Start a WebRTC browser call against an agent.
   *
   * @param agentId - The agent id to call.
   * @param body - Optional call options (e.g. `dynamic_variables`).
   * @returns Token, `server_url`, and `session_id` for the WebRTC client.
   * @throws {APIError} If the platform rejects the request.
   */
  webCall(agentId: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/web-call`, body);
  }

  /**
   * List the saved versions (revisions) of an agent.
   *
   * @param agentId - The agent id.
   * @returns Array of version records (id, created_at, author, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  listVersions(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}/versions`);
  }

  /**
   * Fetch a specific saved version of an agent.
   *
   * @param agentId - The agent id.
   * @param version - The version number.
   * @returns The version record.
   * @throws {APIError} (including `NotFoundError`) if the version does not exist.
   */
  getVersion(agentId: string, version: number): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}/versions/${version}`);
  }

  /**
   * Restore an agent to a specific saved version.
   *
   * @param agentId - The agent id.
   * @param version - The version number to restore.
   * @returns The updated agent record (now pointing at the restored version).
   * @throws {APIError} If the platform rejects the request.
   */
  restoreVersion(agentId: string, version: number): Promise<Record<string, unknown>> {
    return this._client.post(`/agents/${agentId}/versions/${version}/restore`);
  }

  /**
   * List the platform's pre-built agent templates (read-only catalog).
   *
   * @returns Array of template descriptors.
   * @throws {APIError} If the platform rejects the request.
   */
  templates(): Promise<Record<string, unknown>> {
    return this._client.get("/agents/templates");
  }

  /**
   * List the `{{variable}}` placeholders an agent requires at call time.
   *
   * Use this to discover which `dynamic_variables` you must supply before
   * placing an outbound call or starting a WebRTC session.
   *
   * @param agentId - The agent id.
   * @returns The list of required variable names (and their types, if defined).
   * @throws {APIError} If the platform rejects the request.
   */
  requiredVariables(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/agents/${agentId}/required-variables`);
  }
}
