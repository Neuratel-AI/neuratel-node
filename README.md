# Neuratel AI — TypeScript SDK

[![npm](https://img.shields.io/npm/v/@neuratelai/sdk)](https://www.npmjs.com/package/@neuratelai/sdk)
[![Node](https://img.shields.io/node/v/@neuratelai/sdk)](https://www.npmjs.com/package/@neuratelai/sdk)
[![Docs](https://img.shields.io/badge/docs-docs.neuratel.ai-black)](https://docs.neuratel.ai/sdk/overview)

Official TypeScript/JavaScript SDK for the [Neuratel](https://neuratel.ai) API. Zero runtime dependencies — uses the native `fetch` API built into Node 18+.

## Installation

```bash
npm install @neuratelai/sdk
```

## Quick Start

```typescript
import { NeuratelAI } from "@neuratelai/sdk";

const client = new NeuratelAI(); // reads NEURATEL_API_KEY from env

// Create an agent
const agent = await client.agents.create({
  name: "Support Bot",
  brain: { provider: "openai", model: "gpt-4.1", instructions: "You are a helpful support agent." },
  voice: { provider: "elevenlabs", voice_id: "gHu9GtaHOXcSqFTK06ux", model: "eleven_flash_v2_5" },
  transcriber: { provider: "deepgram", model: "nova-3" },
});
console.log(agent.id);

// Place an outbound call
const call = await client.calls.outbound({
  agent_id: agent.id,
  to_number: "+14155551234",
  number_id: "pn_your_number_id",
});
console.log(call.status);

// Iterate all agents (auto-paginates)
for await (const agent of await client.agents.list()) {
  console.log(agent.id, agent.name);
}
```

## Resources

| Resource | Methods |
|----------|---------|
| `agents` | `create`, `list`, `get`, `update`, `delete`, `duplicate`, `webCall`, `listVersions`, `getVersion`, `restoreVersion` |
| `calls` | `list`, `get`, `delete`, `outbound`, `active`, `concurrency`, `hangup`, `listen`, `whisper`, `barge` |
| `phoneNumbers` | `list`, `get`, `update`, `assign`, `unassign` |
| `campaigns` | `create`, `list`, `get`, `update`, `delete`, `start`, `pause`, `stop`, `listCalls`, `getCall` |
| `callLists` | `create`, `list`, `get`, `update`, `delete`, `bulkImport`, `addContact`, `listContacts`, `updateContact`, `deleteContact` |
| `knowledgeBase` | `list`, `get`, `update`, `delete`, `fromFile`, `fromUrl`, `fromText`, `query`, `listForAgent`, `assignToAgent` |
| `webhooks` | `events`, `create`, `list`, `get`, `update`, `delete`, `test`, `rotateSecret`, `logs` |
| `billing` | `balance`, `usage`, `balanceHistory` |
| `apiKeys` | `create`, `list`, `revoke`, `rotate`, `scopes` |
| `integrations` | `list`, `create`, `update`, `delete`, `listTools`, `refreshTools` |

## Error Handling

```typescript
import { APIError, AuthenticationError, NotFoundError, RateLimitError } from "@neuratelai/sdk";

try {
  const agent = await client.agents.get("ag_unknown");
} catch (e) {
  if (e instanceof AuthenticationError) console.log("Invalid API key");
  else if (e instanceof NotFoundError) console.log("Not found:", e.requestId);
  else if (e instanceof RateLimitError) console.log("Rate limited");
  else if (e instanceof APIError) console.log(`HTTP ${e.status}: ${e.message}`);
}
```

## Retries

Automatic retries with exponential backoff on `429`, `408`, and `5xx`. Configurable:

```typescript
const client = new NeuratelAI({ maxRetries: 3, timeoutMs: 15_000 });
```

## Requirements

Node.js 18+ · [docs.neuratel.ai](https://docs.neuratel.ai/sdk/overview)
