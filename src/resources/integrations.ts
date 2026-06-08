import type { APIClient } from "../core.js";

export class IntegrationsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List MCP server integrations visible to the current org.
   *
   * @returns A response with the integration descriptors.
   * @throws {APIError} If the platform rejects the request.
   */
  list(): Promise<Record<string, unknown>> {
    return this._client.get("/mcp-servers");
  }

  /**
   * Register a new MCP server integration.
   *
   * @param body - Integration definition (name, transport, url, headers, etc.).
   * @returns The created integration record.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/mcp-servers", body);
  }

  /**
   * Replace an MCP server integration (full update).
   *
   * @param integrationId - The integration id.
   * @param body - The full updated integration payload.
   * @returns The updated integration record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(integrationId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/mcp-servers/${integrationId}`, body);
  }

  /**
   * Delete an MCP server integration.
   *
   * @param integrationId - The integration id.
   * @throws {APIError} (including `NotFoundError`) if the integration does not exist.
   */
  delete(integrationId: string): Promise<void> {
    return this._client.delete(`/mcp-servers/${integrationId}`);
  }

  /**
   * List the tools exposed by an MCP server integration (cached catalog).
   *
   * @param integrationId - The integration id.
   * @returns Array of tool descriptors (`name`, `description`, `input_schema`, ...).
   * @throws {APIError} If the platform rejects the request.
   */
  listTools(integrationId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/mcp-servers/${integrationId}/tools`);
  }

  /**
   * Force a re-discovery of tools from the upstream MCP server and refresh the cache.
   *
   * @param integrationId - The integration id.
   * @returns The refreshed tool catalog.
   * @throws {APIError} If the platform rejects the request or the upstream is unreachable.
   */
  refreshTools(integrationId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/mcp-servers/${integrationId}/tools`);
  }

  /**
   * List auth-connection records (per-user / per-agent credentials bound to an integration).
   *
   * @returns A response with the auth-connection records.
   * @throws {APIError} If the platform rejects the request.
   */
  listConnections(): Promise<Record<string, unknown>> {
    return this._client.get("/auth-connections");
  }

  /**
   * Create a new auth-connection record.
   *
   * @param body - Connection payload (integration_id, owner, credentials, etc.).
   * @returns The created auth-connection record.
   * @throws {APIError} If the platform rejects the request.
   */
  createConnection(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/auth-connections", body);
  }

  /**
   * Replace an auth-connection (full update).
   *
   * @param authId - The auth-connection id.
   * @param body - The full updated connection payload.
   * @returns The updated auth-connection record.
   * @throws {APIError} If the platform rejects the request.
   */
  updateConnection(authId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/auth-connections/${authId}`, body);
  }

  /**
   * Delete an auth-connection.
   *
   * @param authId - The auth-connection id.
   * @throws {APIError} (including `NotFoundError`) if the connection does not exist.
   */
  deleteConnection(authId: string): Promise<void> {
    return this._client.delete(`/auth-connections/${authId}`);
  }
}
