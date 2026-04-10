import type { APIClient } from "../core.js";

export class IntegrationsResource {
  constructor(private readonly _client: APIClient) {}

  /** List all MCP integrations for your organization. */
  list(): Promise<Record<string, unknown>> {
    return this._client.get("/integrations/mcp");
  }

  /** Create a new MCP integration. */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/integrations/mcp", body);
  }

  /** Update an MCP integration. */
  update(integrationId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/integrations/mcp/${integrationId}`, body);
  }

  /** Delete an MCP integration. */
  delete(integrationId: string): Promise<void> {
    return this._client.delete(`/integrations/mcp/${integrationId}`);
  }

  /** List available tools for an MCP integration. */
  listTools(integrationId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/integrations/mcp/${integrationId}/tools`);
  }

  /** Refresh the tool list for an MCP integration. */
  refreshTools(integrationId: string): Promise<Record<string, unknown>> {
    return this._client.post(`/integrations/mcp/${integrationId}/tools`);
  }
}
