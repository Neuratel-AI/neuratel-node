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
  brain: { provider: "groq", model: "meta-llama/llama-4-scout-17b-16e-instruct", instructions: "You are a helpful support agent." },
  voice: { provider: "cartesia", voice_id: "8d8ce8c9-44a4-46c4-b10f-9a927b99a853", model: "sonic-3" },
  transcriber: { provider: "deepgram", model: "nova-3" },
});
console.log(agent.id);

// Place an outbound call
const call = await client.voiceSessions.outbound({
  agent_id: agent.id,
  to_number: "+14155551234",
  number_id: "your-number-uuid",
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
| `agents` | `create`, `list`, `get`, `update`, `delete`, `duplicate`, `webCall`, `listVersions`, `getVersion`, `restoreVersion`, `templates`, `requiredVariables` |
| `analytics` | `dashboard` |
| `apiKeys` | `create`, `list`, `revoke`, `rotate`, `scopes` |
| `billing` | `balance`, `usage`, `balanceHistory` |
| `callLists` | `create`, `list`, `get`, `update`, `delete`, `bulkImport`, `addContact`, `listContacts`, `updateContact`, `deleteContact` |
| `campaigns` | `create`, `list`, `get`, `update`, `delete`, `start`, `pause`, `stop`, `listCalls`, `getCall` |
| `conversations` | `list`, `get`, `listMessages`, `sendMessage`, `markRead`, `timeline`, `updateDynamicVariables`, `analyticsDashboard` |
| `dnc` | `check`, `listEntries`, `addEntry`, `deleteEntry`, `getSettings`, `updateSettings` |
| `integrations` | `list`, `create`, `update`, `delete`, `listTools`, `refreshTools`, `listConnections`, `createConnection`, `updateConnection`, `deleteConnection` |
| `knowledgeBase` | `list`, `get`, `update`, `delete`, `fromFile`, `fromUrl`, `fromText`, `query`, `listForAgent`, `assignToAgent` |
| `phoneNumbers` | `list`, `get`, `update`, `assign`, `unassign` |
| `voiceSessions` | `list`, `get`, `update`, `delete`, `outbound`, `listActive`, `concurrency`, `hangup`, `listen`, `whisper`, `barge` |
| `webhooks` | `events`, `create`, `list`, `get`, `update`, `delete`, `test`, `rotateSecret`, `logs` |
| `whatsapp` | `listAccounts`, `importAccount`, `importAccountManual`, `getAccount`, `updateAccount`, `deleteAccount`, `listTemplates`, `checkCallPermission`, `getCallStatus`, `verifyAccount`, `outboundCall`, `outboundMessage`, `outboundText`, `outboundVoice`, `batchCall`, `getMessageMedia` |
| `workflows` | `create`, `list`, `get`, `update`, `delete`, `saveGraph`, `publish` |

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

## Links

- [Documentation](https://docs.neuratel.ai/sdk/overview) · [API Reference](https://docs.neuratel.ai/api) · [Changelog](https://github.com/Neuratel-AI/neuratel-node/releases)
- [Contributing](https://github.com/Neuratel-AI/neuratel-node/blob/main/CONTRIBUTING.md) · [Security](https://github.com/Neuratel-AI/neuratel-node/blob/main/SECURITY.md) · [Code of Conduct](https://github.com/Neuratel-AI/neuratel-node/blob/main/CODE_OF_CONDUCT.md)

## Requirements

Node.js 18+
