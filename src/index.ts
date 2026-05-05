export { NeuratelAI } from "./client.js";
export type { ClientOptions } from "./client.js";

// Typed interfaces auto-generated from the OpenAPI spec. Available as a
// namespace so resource result casts read cleanly:
//   import { type Types } from "@neuratelai/sdk";
//   const session = (await client.voiceSessions.get(id)) as Types.VoiceSession;
export type * as Types from "./types/index.js";

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
