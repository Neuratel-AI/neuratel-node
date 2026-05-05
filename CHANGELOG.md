# Changelog

## 0.2.0 (2026-05-05)

### Important: prior published artifact was broken

The npm-published `0.1.0` was built before the 2026-04-26 backend rename of `/v1/calls/*` → `/v1/voice-sessions/*`. The `dist/` shipped to npm contains `this.calls = new CallsResource(...)` and calls deleted endpoints. `0.1.1` was bumped in source but **never published**. This `0.2.0` release is the first npm artifact that actually works against the current backend.

### New resources

- `client.conversations` — wraps `/v1/conversations/*` (the unified SMS / WhatsApp / voice inbox). Methods: `list`, `get`, `listMessages`, `sendMessage`, `markRead`, `timeline`, `updateDynamicVariables`, `analyticsDashboard`. Body shapes match `ConversationSendRequest` (`body` / `media_urls` / `client_temp_id`) and `ConversationDynamicVariablesUpdateRequest` (`dynamic_variables` / `replace`).
- `client.dnc` — wraps the platform DNC directory. Methods: `check`, `listEntries`, `addEntry`, `deleteEntry`, `getSettings`, `updateSettings`. Settings uses canonical `protection_enabled` / `auto_add_inbound_optouts` field names.
- `client.analytics` — wraps `GET /v1/analytics/dashboard`.
- `client.agents.templates()` and `client.agents.requiredVariables(agentId)`.

### Typed interfaces

- New `Types` namespace exporting TypeScript interfaces auto-generated from `openapi.json` via `openapi-typescript`. Same pattern adopted by OpenAI / Anthropic SDKs.
- `npm run generate:types` regenerates `src/types/_generated.ts` from the in-tree Platform spec (~17,900 lines, 297 schemas).
- Curated aliases in `src/types/index.ts`: `Agent`, `VoiceSession`, `Conversation`, all four `*TranscriberConfig` discriminants including new `SonioxTranscriberConfig`, `Balance`, `Organization`, `Sku`, etc. Long-tail admin/internal types reachable via `import type { components } from "@neuratelai/sdk/types/_generated"`.
- Resource methods still return `Record<string, unknown>` for v0.2.0 — customers cast via `(raw) as Types.VoiceSession`. Future release will retrofit method signatures.

### Tests

- `tests/resources.test.ts` — 17 HTTP-level tests mocking `globalThis.fetch` via vitest spies. Covers each new resource's path / method / body shape plus error mapping.
- Test count: 11 → 28; typecheck still clean; build still zero-runtime-deps.

## 0.1.1 (~2026-04-15) — never published to npm

- `chore`: read `VERSION` from `package.json`.
- `fix`: `fromText` field name (was sending `text`, backend expects `content`).
- `fix`: `fromFile` `name` parameter forwarded correctly.
- `feat`: read `NEURATEL_API_KEY` from environment if `apiKey` not passed.
- `feat`: retarget calls SDK at `/v1/voice-sessions`; drop `client.calls` alias; add `client.voiceSessions.update()`. **Source-only — no published dist.**
- `docs`: README quickstart + resource table use `voiceSessions`.

## 0.1.0 (2026-04-11)

Initial release.

- Zero runtime dependencies — native `fetch` (Node 18+)
- 10 resource groups: `agents`, `voiceSessions`, `phoneNumbers`, `campaigns`, `callLists`, `knowledgeBase`, `webhooks`, `billing`, `apiKeys`, `integrations`
- Automatic retries with exponential backoff on `429`, `408`, `5xx`
- Async pagination with `Page<T>` and `for await` support
- Typed exception hierarchy (`AuthenticationError`, `NotFoundError`, `RateLimitError`, etc.)
- Dual ESM/CJS output
