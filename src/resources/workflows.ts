import type { APIClient } from "../core.js";

/**
 * Workflows resource — visual call-flow editor.
 *
 * Each workflow has many revisions. `graph` saves a new draft revision and
 * `publish` promotes a revision to the live, callable version. The flow is:
 *   create → graph (drafts) → publish (live).
 */
export class WorkflowsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Create a new workflow.
   *
   * @param body - Workflow definition (name, description, agent_id, etc.).
   * @returns The created workflow record (initially without any revisions).
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/workflows", body);
  }

  /**
   * List workflows for the current org.
   *
   * @param params - Optional pagination.
   * @param params.skip - Number of records to skip.
   * @param params.limit - Max records to return.
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: { skip?: number; limit?: number } = {}): Promise<Record<string, unknown>> {
    return this._client.get("/workflows", params as Record<string, unknown>);
  }

  /**
   * Fetch a single workflow by id.
   *
   * @param workflowId - The workflow id.
   * @returns The workflow record (name, latest published revision, etc.).
   * @throws {APIError} (including `NotFoundError`) if the workflow does not exist.
   */
  get(workflowId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/workflows/${workflowId}`);
  }

  /**
   * Partially update a workflow's metadata (name, description, agent binding, ...).
   * Use `saveGraph` to update the actual call-flow graph.
   *
   * @param workflowId - The workflow id.
   * @param body - Fields to update.
   * @returns The updated workflow record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(
    workflowId: string,
    body: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._client.patch(`/workflows/${workflowId}`, body);
  }

  /**
   * Delete a workflow and all of its revisions.
   *
   * @param workflowId - The workflow id.
   * @throws {APIError} (including `NotFoundError`) if the workflow does not exist.
   */
  delete(workflowId: string): Promise<void> {
    return this._client.delete(`/workflows/${workflowId}`);
  }

  /**
   * Save a new graph revision (draft) on the workflow. The revision is not
   * live until `publish` is called.
   *
   * @param workflowId - The workflow id.
   * @param body - The new graph payload (nodes, edges, entry/exit points, ...).
   * @returns The created draft revision record.
   * @throws {APIError} If the graph fails validation.
   */
  saveGraph(
    workflowId: string,
    body: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this._client.post(`/workflows/${workflowId}/graph`, body);
  }

  /**
   * Publish a workflow revision to make it the live, callable version.
   *
   * @param workflowId - The workflow id.
   * @param body - Optional publish options (target revision id, notes, etc.).
   * @returns The published revision record.
   * @throws {APIError} If the platform rejects the request.
   */
  publish(
    workflowId: string,
    body: Record<string, unknown> = {},
  ): Promise<Record<string, unknown>> {
    return this._client.post(`/workflows/${workflowId}/publish`, body);
  }
}
