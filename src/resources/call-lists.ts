import type { APIClient } from "../core.js";

export class CallListsResource {
  constructor(private readonly _client: APIClient) {}

  /**
   * Create a new call list.
   *
   * @param body - List definition (name, description, metadata, etc.).
   * @returns The created call list record.
   * @throws {APIError} If the platform rejects the request.
   */
  create(body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post("/lists", body);
  }

  /**
   * List call lists, with optional filters.
   *
   * @param params - Optional filters (skip, limit, search, etc.).
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  list(params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get("/lists", params);
  }

  /**
   * Fetch a single call list by id.
   *
   * @param callListId - The call list id.
   * @returns The call list record.
   * @throws {APIError} (including `NotFoundError`) if the list does not exist.
   */
  get(callListId: string): Promise<Record<string, unknown>> {
    return this._client.get(`/lists/${callListId}`);
  }

  /**
   * Replace a call list (full update).
   *
   * @param callListId - The call list id.
   * @param body - The full updated call list payload.
   * @returns The updated call list record.
   * @throws {APIError} If the platform rejects the request.
   */
  update(callListId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/lists/${callListId}`, body);
  }

  /**
   * Delete a call list and all of its contacts.
   *
   * @param callListId - The call list id.
   * @throws {APIError} (including `NotFoundError`) if the list does not exist.
   */
  delete(callListId: string): Promise<void> {
    return this._client.delete(`/lists/${callListId}`);
  }

  /**
   * Upload a CSV file (as a `Blob` or `File`) to bulk import contacts.
   *
   * Sends `multipart/form-data` rather than JSON. If `file` is a `File`, its
   * `name` is used unless `filename` is supplied; otherwise `filename` is sent
   * as the part name.
   *
   * @param callListId - The target call list id.
   * @param file - CSV payload (`Blob` or `File`).
   * @param filename - Fallback filename if `file` is not a `File`. Defaults to `"contacts.csv"`.
   * @returns Import summary (counts, errors, etc.).
   * @throws {APIError} If the platform rejects the request.
   */
  async bulkImport(callListId: string, file: Blob | File, filename = "contacts.csv"): Promise<Record<string, unknown>> {
    const form = new FormData();
    form.append("file", file, file instanceof File ? file.name : filename);
    return this._client.request<Record<string, unknown>>("POST", `/lists/${callListId}/bulk-import`, { body: form });
  }

  /**
   * Add a single contact to a call list.
   *
   * @param callListId - The target call list id.
   * @param body - Contact fields (phone, name, custom variables, etc.).
   * @returns The created contact record.
   * @throws {APIError} If the platform rejects the request.
   */
  addContact(callListId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.post(`/lists/${callListId}/contacts`, body);
  }

  /**
   * List contacts in a call list, with optional filters.
   *
   * @param callListId - The call list id.
   * @param params - Optional filters (skip, limit, status, search, etc.).
   * @returns A response with a `results` array and pagination metadata.
   * @throws {APIError} If the platform rejects the request.
   */
  listContacts(callListId: string, params?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.get(`/lists/${callListId}/contacts`, params);
  }

  /**
   * Update a single contact (full replace).
   *
   * @param callListId - The call list id.
   * @param contactId - The contact id.
   * @param body - The full updated contact payload.
   * @returns The updated contact record.
   * @throws {APIError} If the platform rejects the request.
   */
  updateContact(callListId: string, contactId: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this._client.put(`/lists/${callListId}/contacts/${contactId}`, body);
  }

  /**
   * Delete a single contact from a call list.
   *
   * @param callListId - The call list id.
   * @param contactId - The contact id.
   * @throws {APIError} (including `NotFoundError`) if the contact does not exist.
   */
  deleteContact(callListId: string, contactId: string): Promise<void> {
    return this._client.delete(`/lists/${callListId}/contacts/${contactId}`);
  }
}
