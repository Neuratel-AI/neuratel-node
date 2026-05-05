import { APIClient, type ClientOptions } from "./core.js";
import { AgentsResource } from "./resources/agents.js";
import { AnalyticsResource } from "./resources/analytics.js";
import { VoiceSessionsResource } from "./resources/voice-sessions.js";
import { ConversationsResource } from "./resources/conversations.js";
import { PhoneNumbersResource } from "./resources/phone-numbers.js";
import { CampaignsResource } from "./resources/campaigns.js";
import { CallListsResource } from "./resources/call-lists.js";
import { KnowledgeBaseResource } from "./resources/knowledge-base.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { BillingResource } from "./resources/billing.js";
import { APIKeysResource } from "./resources/api-keys.js";
import { IntegrationsResource } from "./resources/integrations.js";
import { DNCResource } from "./resources/dnc.js";

export type { ClientOptions };

/**
 * Official Neuratel API client for Node.js and the browser.
 *
 * ```typescript
 * import { NeuratelAI } from '@neuratelai/sdk';
 *
 * const client = new NeuratelAI(); // reads NEURATEL_API_KEY from env
 *
 * const agent = await client.agents.create({ name: 'Support Bot', brain: { ... } });
 *
 * for await (const agent of await client.agents.list()) {
 *   console.log(agent.name);
 * }
 * ```
 */
export class NeuratelAI {
  readonly agents: AgentsResource;
  /** Unified voice surface: phone, web, and WhatsApp voice. */
  readonly voiceSessions: VoiceSessionsResource;
  /** Unified chat inbox: SMS, WhatsApp, and other text channels. */
  readonly conversations: ConversationsResource;
  readonly phoneNumbers: PhoneNumbersResource;
  readonly campaigns: CampaignsResource;
  readonly callLists: CallListsResource;
  readonly knowledgeBase: KnowledgeBaseResource;
  readonly webhooks: WebhooksResource;
  readonly billing: BillingResource;
  readonly apiKeys: APIKeysResource;
  readonly integrations: IntegrationsResource;
  /** Do Not Call directory — check, manage entries, toggle protection. */
  readonly dnc: DNCResource;
  /** Combined voice + chat KPI dashboard. */
  readonly analytics: AnalyticsResource;

  private readonly _client: APIClient;

  constructor(options: ClientOptions = {}) {
    this._client = new APIClient(options);
    this.agents = new AgentsResource(this._client);
    this.voiceSessions = new VoiceSessionsResource(this._client);
    this.conversations = new ConversationsResource(this._client);
    this.phoneNumbers = new PhoneNumbersResource(this._client);
    this.campaigns = new CampaignsResource(this._client);
    this.callLists = new CallListsResource(this._client);
    this.knowledgeBase = new KnowledgeBaseResource(this._client);
    this.webhooks = new WebhooksResource(this._client);
    this.billing = new BillingResource(this._client);
    this.apiKeys = new APIKeysResource(this._client);
    this.integrations = new IntegrationsResource(this._client);
    this.dnc = new DNCResource(this._client);
    this.analytics = new AnalyticsResource(this._client);
  }

  toString(): string {
    return `NeuratelAI(baseUrl=${this._client.baseUrl})`;
  }
}
