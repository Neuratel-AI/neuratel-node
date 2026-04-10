export { NeuratelAI } from "./client.js";
export type { ClientOptions } from "./client.js";

export {
  NeuratelError,
  APIError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
  APIConnectionError,
  APITimeoutError,
} from "./error.js";

export { Page } from "./pagination.js";
export type { PaginationMetadata, PageResponse } from "./pagination.js";

export type { PlatformEvent } from "./streaming.js";

export { VERSION } from "./version.js";
