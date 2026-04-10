import type { APIClient } from "../core.js";

export class CallListsResource {
  constructor(private readonly _client: APIClient) {}

  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/lists", body);
  }

  list(params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get("/lists", params);
  }

  get(callListId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/lists/${callListId}`);
  }

  update(callListId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/lists/${callListId}`, body);
  }

  delete(callListId: string): Promise<void> {
    return this._client.delete(`/lists/${callListId}`);
  }

  /** Upload a CSV file (as a Blob or File) to bulk import contacts. */
  async bulkImport(callListId: string, file: Blob | File, filename = "contacts.csv"): Promise<Record<string, unknown>> {
    const form = new FormData();
    form.append("file", file, file instanceof File ? file.name : filename);
    return this._client.request<Record<string, unknown>>("POST", `/lists/${callListId}/bulk-import`, { body: form });
  }

  addContact(callListId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post(`/lists/${callListId}/contacts`, body);
  }

  listContacts(callListId: string, params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get(`/lists/${callListId}/contacts`, params);
  }

  updateContact(callListId: string, contactId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/lists/${callListId}/contacts/${contactId}`, body);
  }

  deleteContact(callListId: string, contactId: string): Promise<void> {
    return this._client.delete(`/lists/${callListId}/contacts/${contactId}`);
  }
}
