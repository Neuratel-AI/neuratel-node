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
import { WorkflowsResource } from "./resources/workflows.js";
import { WhatsappResource } from "./resources/whatsapp.js";

export type { ClientOptions };

export class NeuratelAI {
  readonly agents: AgentsResource;
  readonly voiceSessions: VoiceSessionsResource;
  readonly conversations: ConversationsResource;
  readonly phoneNumbers: PhoneNumbersResource;
  readonly campaigns: CampaignsResource;
  readonly callLists: CallListsResource;
  readonly knowledgeBase: KnowledgeBaseResource;
  readonly webhooks: WebhooksResource;
  readonly billing: BillingResource;
  readonly apiKeys: APIKeysResource;
  readonly integrations: IntegrationsResource;
  readonly dnc: DNCResource;
  readonly analytics: AnalyticsResource;
  readonly workflows: WorkflowsResource;
  readonly whatsapp: WhatsappResource;

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
    this.workflows = new WorkflowsResource(this._client);
    this.whatsapp = new WhatsappResource(this._client);
  }

  toString(): string {
    return `NeuratelAI(baseUrl=${this._client.baseUrl})`;
  }
}
