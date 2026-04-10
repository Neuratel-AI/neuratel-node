import { APIClient, type ClientOptions } from "./core.js";
import { AgentsResource } from "./resources/agents.js";
import { CallsResource } from "./resources/calls.js";
import { PhoneNumbersResource } from "./resources/phone-numbers.js";
import { CampaignsResource } from "./resources/campaigns.js";
import { CallListsResource } from "./resources/call-lists.js";
import { KnowledgeBaseResource } from "./resources/knowledge-base.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { BillingResource } from "./resources/billing.js";
import { APIKeysResource } from "./resources/api-keys.js";
import { IntegrationsResource } from "./resources/integrations.js";

export type { ClientOptions };

/**
 * Official Neuratel API client for Node.js and the browser.
 *
 * ```typescript
 * import { NeuratelAI } from '@neuratel/sdk';
 *
 * const client = new NeuratelAI({ apiKey: process.env.NEURATEL_API_KEY });
 *
 * const agent = await client.agents.create({ name: 'Support Bot', brain: { ... } });
 *
 * for await (const agent of client.agents.list()) {
 *   console.log(agent.name);
 * }
 * ```
 */
export class NeuratelAI {
  readonly agents: AgentsResource;
  readonly calls: CallsResource;
  readonly phoneNumbers: PhoneNumbersResource;
  readonly campaigns: CampaignsResource;
  readonly callLists: CallListsResource;
  readonly knowledgeBase: KnowledgeBaseResource;
  readonly webhooks: WebhooksResource;
  readonly billing: BillingResource;
  readonly apiKeys: APIKeysResource;
  readonly integrations: IntegrationsResource;

  private readonly _client: APIClient;

  constructor(options: ClientOptions) {
    this._client = new APIClient(options);
    this.agents = new AgentsResource(this._client);
    this.calls = new CallsResource(this._client);
    this.phoneNumbers = new PhoneNumbersResource(this._client);
    this.campaigns = new CampaignsResource(this._client);
    this.callLists = new CallListsResource(this._client);
    this.knowledgeBase = new KnowledgeBaseResource(this._client);
    this.webhooks = new WebhooksResource(this._client);
    this.billing = new BillingResource(this._client);
    this.apiKeys = new APIKeysResource(this._client);
    this.integrations = new IntegrationsResource(this._client);
  }

  toString(): string {
    return `NeuratelAI(baseUrl=${this._client.baseUrl})`;
  }
}
