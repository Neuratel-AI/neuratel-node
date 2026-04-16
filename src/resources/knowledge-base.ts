import type { APIClient } from "../core.js";
import type { Page } from "../pagination.js";

export class KnowledgeBaseResource {
  constructor(private readonly _client: APIClient) {}

  list(params: Record<string, unknown> = {}): Promise<Page<Record<string, unknown>>> {
    return this._client.paginate("/knowledge-base", { limit: 20, ...params });
  }

  get(kbId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/knowledge-base/${kbId}`);
  }

  update(kbId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/knowledge-base/${kbId}`, body);
  }

  delete(kbId: string): Promise<void> {
    return this._client.delete(`/knowledge-base/${kbId}`);
  }

  /** Upload a file (PDF, DOCX, TXT) as a knowledge base source. Pass a Blob or File. */
  async fromFile(file: Blob | File, name?: string): Promise<Record<string, unknown>> {
    const filename = name ?? (file instanceof File ? file.name : "upload");
    const form = new FormData();
    form.append("file", file, filename);
    form.append("name", filename);
    return this._client.request<Record<string, unknown>>("POST", "/knowledge-base/from-file", { body: form });
  }

  fromUrl(url: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/from-url", { url, ...body });
  }

  fromText(text: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/from-text", { content: text, ...body });
  }

  query(query: string, body: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    return this._client.post("/knowledge-base/query", { query, ...body });
  }

  listForAgent(agentId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/knowledge-base/agent/${agentId}`);
  }

  assignToAgent(agentId: string, knowledgeBaseIds: string[]): Promise<Record<string, unknown>> {
    return this._client.put(`/knowledge-base/agent/${agentId}`, { knowledge_base_ids: knowledgeBaseIds });
  }
}
