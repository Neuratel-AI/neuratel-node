# Changelog

## 0.1.0 (2026-04-11)

Initial release.

- Zero runtime dependencies — native `fetch` (Node 18+)
- 10 resource groups: `agents`, `calls`, `phoneNumbers`, `campaigns`, `callLists`, `knowledgeBase`, `webhooks`, `billing`, `apiKeys`, `integrations`
- Automatic retries with exponential backoff on `429`, `408`, `5xx`
- Async pagination with `Page<T>` and `for await` support
- Typed exception hierarchy (`AuthenticationError`, `NotFoundError`, `RateLimitError`, etc.)
- Dual ESM/CJS output
