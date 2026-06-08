#!/usr/bin/env npx tsx
/**
 * Read-only smoke test against live Neuratel API.
 *
 * Exercises every SDK list/get method that hits a GET endpoint.
 * Never creates, updates, or deletes data.
 *
 * Usage:
 *     NEURATEL_API_KEY=nk_live_xxx npx tsx scripts/smoke_prod.ts
 */

import { NeuratelAI } from "../src/index.js";

const API_KEY = process.env.NEURATEL_API_KEY;
if (!API_KEY) {
  console.error("NEURATEL_API_KEY env var required");
  process.exit(1);
}

const PASS: string[] = [];
const FAIL: { label: string; status: number; detail: string }[] = [];

function ok(label: string) {
  PASS.push(label);
  console.log(`  ✓ ${label}`);
}

function fail(label: string, status: number, detail: string) {
  FAIL.push({ label, status, detail });
  console.log(`  ✗ ${label}  [${status}] ${detail.slice(0, 120)}`);
}

async function tryRead(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
    ok(label);
  } catch (e: unknown) {
    const err = e as { status?: number; statusCode?: number; message?: string };
    const status = err.status ?? err.statusCode ?? 0;
    fail(label, status, err.message ?? String(e));
  }
}

async function main() {
  const client = new NeuratelAI({ apiKey: API_KEY });

  console.log("neuratel-node smoke — read-only prod endpoints\n");

  let firstAgentId: string | undefined;

  // ── Agents ──
  await tryRead("agents.list()", async () => {
    const res = await client.agents.list({ limit: 1 });
    const items = (res as Record<string, unknown>)?.results ?? res;
    if (Array.isArray(items) && items.length > 0) {
      firstAgentId = (items[0] as Record<string, unknown>).id as string;
    }
  });

  if (firstAgentId) {
    await tryRead(`agents.get('${firstAgentId.slice(0, 12)}…')`, () =>
      client.agents.get(firstAgentId!),
    );
    await tryRead("agents.requiredVariables()", () =>
      client.agents.requiredVariables(firstAgentId!),
    );
  } else {
    ok("agents.get() — SKIPPED (no agents)");
  }

  await tryRead("agents.templates()", () => client.agents.templates());

  // ── Voice Sessions ──
  await tryRead("voiceSessions.list()", () => client.voiceSessions.list({ limit: 1 }));
  await tryRead("voiceSessions.listActive()", () => client.voiceSessions.listActive());

  // ── Conversations ──
  await tryRead("conversations.list()", () => client.conversations.list({ limit: 1 }));

  // ── Phone Numbers ──
  await tryRead("phoneNumbers.list()", () => client.phoneNumbers.list());

  // ── Campaigns ──
  await tryRead("campaigns.list()", () => client.campaigns.list({ limit: 1 }));

  // ── Call Lists ──
  await tryRead("callLists.list()", () => client.callLists.list({ limit: 1 }));

  // ── Knowledge Base ──
  let firstKbId: string | undefined;
  await tryRead("knowledgeBase.list()", async () => {
    const res = await client.knowledgeBase.list({ limit: 1 });
    const page = res as Record<string, unknown>;
    const items = (page?.results ?? page) as Record<string, unknown>[] | undefined;
    if (Array.isArray(items) && items.length > 0) {
      firstKbId = items[0]?.id as string;
    }
  });

  if (firstKbId) {
    await tryRead(`knowledgeBase.get()`, () => client.knowledgeBase.get(firstKbId!));
  }

  // ── Webhooks ──
  await tryRead("webhooks.list()", () => client.webhooks.list());

  // ── Billing ──
  await tryRead("billing.balance()", () => client.billing.balance());
  await tryRead("billing.usage()", () => client.billing.usage());

  // ── API Keys ──
  await tryRead("apiKeys.list()", () => client.apiKeys.list());

  // ── Integrations (now includes auth-connections) ──
  await tryRead("integrations.list()", () => client.integrations.list());
  await tryRead("integrations.listConnections()", () => client.integrations.listConnections());

  // ── DNC ──
  await tryRead("dnc.listEntries()", () => client.dnc.listEntries({ limit: 1 }));
  await tryRead("dnc.getSettings()", () => client.dnc.getSettings());
  await tryRead("dnc.check()", () => client.dnc.check("+12125551234"));

  // ── Analytics ──
  await tryRead("analytics.dashboard()", () => client.analytics.dashboard());

  // ── WhatsApp ──
  await tryRead("whatsapp.listAccounts()", () => client.whatsapp.listAccounts());

  // ── Workflows ──
  await tryRead("workflows.list()", () => client.workflows.list({ limit: 1 }));

  // ── Summary ──
  console.log(`\n${"=".repeat(50)}`);
  const total = PASS.length + FAIL.length;
  console.log(`  ${PASS.length}/${total} passed, ${FAIL.length} failed`);
  if (FAIL.length > 0) {
    console.log("\n  FAILURES:");
    for (const { label, status, detail } of FAIL) {
      console.log(`    [${status}] ${label}: ${detail.slice(0, 80)}`);
    }
    process.exit(1);
  } else {
    console.log("  ALL GREEN ✓");
  }
}

main().catch((e) => {
  console.error("Smoke test crashed:", e);
  process.exit(2);
});
