import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class KnowledgeBaseResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * List knowledge bases visible to the current org, paginated.
   *
   * @param params - Optional filters (skip, limit, search, etc.). `limit` defaults to 20.
   * @returns A `Page` of knowledge bases; iterate with `for await` or call `getNextPage()`.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/knowledge-base", { limit: 20, ...params });
  }

  /**
   * Fetch a single knowledge base by id.
   *
   * @param kbId - The knowledge base id.
   * @returns The knowledge base record (name, sources, metadata, etc.).
   * @throws {APIError} (including `NotFoundError`) if the KB does not exist.
   */
  get(kbId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/knowledge-base/${kbId}`);
  }

  /**
   * Replace a knowledge base (full update).
   *
   * @param kbId - The knowledge base id.
   * @param body - The full updated knowledge base payload.
   * @returns The updated knowledge base record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(kbId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/knowledge-base/${kbId}`, body);
  }

  /**
   * Delete a knowledge base.
   *
   * @param kbId - The knowledge base id.
   * @throws {APIError} (including `NotFoundError`) if the KB does not exist.
   */
  delete(kbId: string): Promise<void> {
    return this._client.delete(`/knowledge-base/${kbId}`);
  }

  /**
   * Upload a file (PDF, DOCX, TXT) as a knowledge base source.
   *
   * Sends `multipart/form-data`. The platform extracts text, chunks it, and
   * embeds it for retrieval. If `file` is a `File` and `name` is not provided,
   * the file's own `name` is reused.
   *
   * @param file - Source document (`Blob` or `File`).
   * @param name - Display name for the resulting KB. Falls back to the file's
   *   own name (or `"upload"` if `file` is a `Blob`).
   * @returns The created knowledge base record.
   * @throws {APIError} If the platform rejects the request or the file is unreadable.
   */
  async fromFile(file: Blob | File, name?: string): Promise<Record<string, unknown>> {
    const filename = name ?? (file instanceof File ? file.name : "upload");
    const form = new FormData();
    form.append("file", file, filename);
    form.append("name", filename);
    return this._client.request<Record<string, unknown>>("POST", "/knowledge-base/from-file", { body: form });
  }

  /**
   * Create a knowledge base from a public URL. The platform fetches and indexes the content.
   *
   * @param url - The source URL (http/https).
   * @param body - Optional KB metadata (name, refresh interval, etc.).
   * @returns The created knowledge base record.
   * @throws {APIError} If the platform rejects the request or the URL is unreachable.
   */
  fromUrl(url: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/from-url", { url, ...body });
  }

  /**
   * Create a knowledge base from raw text.
   *
   * @param text - The text content to index.
   * @param body - Optional KB metadata (name, etc.).
   * @returns The created knowledge base record.
   * @throws {APIError} If the platform rejects the request.
   */
  fromText(text: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/from-text", { content: text, ...body });
  }

  /**
   * Run a semantic search across one or more knowledge bases.
   *
   * @param query - The natural-language query.
   * @param body - Optional query parameters (`knowledge_base_ids`, `top_k`, filters, etc.).
   * @returns Search results (chunks, scores, sources).
   * @throws {APIError} If the platform rejects the request.
   */
  query(query: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/query", { query, ...body });
  }

  /**
   * List the knowledge bases currently assigned to an agent.
   *
   * @param agentId - The agent id.
   * @returns A response with the assigned knowledge bases.
   * @throws {APIError} If the platform rejects the request.
   */
  listForAgent(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/knowledge-base/agent/${agentId}`);
  }

  /**
   * Replace the set of knowledge bases assigned to an agent.
   *
   * @param agentId - The agent id.
   * @param knowledgeBaseIds - The full list of KB ids the agent should have
   *   access to. Pass `[]` to unassign all.
   * @returns The updated assignment record.
   * @throws {APIError} If the platform rejects the request.
   */
  assignToAgent(agentId: string, knowledgeBaseIds: string[]): Promise<Record<string, unknown>> {
    return this._client.put(`/knowledge-base/agent/${agentId}`, { knowledge_base_ids: knowledgeBaseIds });
  }
}
