/**
 * Typed interfaces for the Neuratel API.
 *
 * Auto-generated from the canonical OpenAPI spec via
 * `npm run generate:types` (openapi-typescript). This module curates the
 * most commonly-needed type aliases; for the long tail of admin/internal
 * shapes, import directly from `./types/_generated`:
 *
 *   import type { components } from "@neuratelai/sdk/types/_generated";
 *   type AdminThing = components["schemas"]["AdminBillingOverridesRequest"];
 *
 * @example
 *   import { NeuratelAI } from "@neuratelai/sdk";
 *   import type { VoiceSession, Agent } from "@neuratelai/sdk/types";
 *
 *   const client = new NeuratelAI();
 *   const raw = await client.voiceSessions.get("vs_123");
 *   const session = raw as VoiceSession;
 *   console.log(session.analysis_status, session.user_sentiment);
 *
 * Resource methods still return `Record<string, unknown>` for v0.2.0;
 * customers cast to these types as needed. Future releases will retrofit
 * the resource method signatures to return them directly.
 */

import type { components, operations, paths } from "./_generated.js";

export type { components, operations, paths };

type Schemas = components["schemas"];

// ── Agents ────────────────────────────────────────────────────────────────
export type Agent = Schemas["AgentResponse"];
export type AgentCreate = Schemas["AgentCreate"];
export type AgentUpdate = Schemas["AgentUpdate"];
export type AgentList = Schemas["AgentListResponse"];
export type AgentVersion = Schemas["AgentVersionResponse"];
export type AgentVersionEntry = Schemas["AgentVersionEntry"];
export type AgentVersionList = Schemas["AgentVersionListResponse"];
export type AgentRestore = Schemas["AgentRestoreResponse"];
export type AgentRequiredVariables = Schemas["AgentRequiredVariablesResponse"];
export type AgentKnowledgeBaseAssignment = Schemas["AgentKnowledgeBaseAssignment"];
export type AgentKnowledgeBaseList = Schemas["AgentKnowledgeBaseListResponse"];
export type AgentMetricsSummary = Schemas["AgentMetricsSummary"];
export type AgentPerformance = Schemas["AgentPerformance"];

// ── Voice / Calls ─────────────────────────────────────────────────────────
export type VoiceSession = Schemas["VoiceSessionResponse"];
export type VoiceSessionList = Schemas["VoiceSessionListResponse"];
export type VoiceSessionUpdate = Schemas["VoiceSessionUpdate"];
export type AgentCallRequest = Schemas["AgentCallRequest"];
export type AgentCallResponse = Schemas["AgentCallResponse"];
export type ActiveCallInfo = Schemas["ActiveCallInfo"];
export type ActiveCallParticipant = Schemas["ActiveCallParticipant"];
export type ActiveCallsResponse = Schemas["ActiveCallsResponse"];

// ── Conversations / Messages ──────────────────────────────────────────────
export type Conversation = Schemas["ConversationResponse"];
export type ConversationList = Schemas["ConversationListResponse"];
export type ConversationSendRequest = Schemas["ConversationSendRequest"];
export type ConversationDynamicVariablesUpdateRequest = Schemas["ConversationDynamicVariablesUpdateRequest"];
export type ConversationLastMessage = Schemas["ConversationLastMessage"];
export type ConversationTurnSummary = Schemas["ConversationTurnSummary"];
export type Message = Schemas["MessageResponse"];
export type MessageList = Schemas["MessageListResponse"];

// ── Brain (LLM) configs ───────────────────────────────────────────────────
export type GroqModel = Schemas["GroqModel"];
export type OpenAIModel = Schemas["OpenAIModel"];

// ── Voice (TTS) configs ───────────────────────────────────────────────────
export type CartesiaVoiceConfig = Schemas["CartesiaVoiceConfig"];
export type CartesiaModel = Schemas["CartesiaModel"];
export type CartesiaEmotion = Schemas["CartesiaEmotion"];
export type CartesiaSpeed = Schemas["CartesiaSpeed"];
export type ElevenLabsVoiceConfig = Schemas["ElevenLabsVoiceConfig"];
export type ElevenLabsModel = Schemas["ElevenLabsModel"];
export type PhantomVoiceConfig = Schemas["PhantomVoiceConfig"];

// ── Transcriber (STT) configs ─────────────────────────────────────────────
export type DeepgramTranscriberConfig = Schemas["DeepgramTranscriberConfig"];
export type DeepgramNovaModel = Schemas["DeepgramNovaModel"];
export type DeepgramLanguage = Schemas["DeepgramLanguage"];
export type OpenAITranscriberConfig = Schemas["OpenAITranscriberConfig"];
export type OpenAIWhisperModel = Schemas["OpenAIWhisperModel"];
export type SonioxTranscriberConfig = Schemas["SonioxTranscriberConfig"];
export type SonioxModel = Schemas["SonioxModel"];
export type PhantomTranscriberConfig = Schemas["PhantomTranscriberConfig"];

// ── Tools ────────────────────────────────────────────────────────────────
export type ToolsConfig = Schemas["ToolsConfig"];
export type HangupToolConfig = Schemas["HangupToolConfig"];
export type VoicemailToolConfig = Schemas["VoicemailToolConfig"];
export type VoicemailAction = Schemas["VoicemailAction"];

// ── Analysis / Analytics ─────────────────────────────────────────────────
export type AnalysisPlan = Schemas["AnalysisPlan"];
export type AnalyticsConfig = Schemas["AnalyticsConfig"];
export type AnalyticsDashboard = Schemas["AnalyticsDashboardResponse"];

// ── DNC ──────────────────────────────────────────────────────────────────
export type DNCCheck = Schemas["DNCCheckResponse"];
export type DNCEntry = Schemas["DNCEntryResponse"];
export type DNCEntryAddRequest = Schemas["DNCEntryAddRequest"];
export type DNCEntryList = Schemas["DNCEntryListResponse"];
export type DNCSettings = Schemas["DNCSettingsResponse"];
export type DNCSettingsRequest = Schemas["DNCSettingsRequest"];

// ── Webhooks ─────────────────────────────────────────────────────────────
export type WebhookCreateResponse = Schemas["WebhookCreateResponse"];
export type WebhookList = Schemas["WebhookListResponse"];
export type WebhookDeliveryLog = Schemas["WebhookDeliveryLogResponse"];

// ── Knowledge Base ───────────────────────────────────────────────────────
export type KnowledgeBaseCreateFromText = Schemas["KnowledgeBaseCreateFromText"];
export type KnowledgeBaseCreateFromURL = Schemas["KnowledgeBaseCreateFromURL"];
export type KnowledgeBaseUpdate = Schemas["KnowledgeBaseUpdate"];
export type KnowledgeBaseList = Schemas["KnowledgeBaseListResponse"];
export type KnowledgeBaseStatus = Schemas["KnowledgeBaseStatus"];
export type KnowledgeBaseType = Schemas["KnowledgeBaseType"];

// ── Phone Numbers ────────────────────────────────────────────────────────
export type PhoneNumber = Schemas["PhoneNumberResponse"];
export type PhoneNumberCreate = Schemas["PhoneNumberCreate"];
export type PhoneNumberUpdate = Schemas["PhoneNumberUpdate"];
export type PhoneNumberList = Schemas["PhoneNumberListResponse"];

// ── Campaigns ────────────────────────────────────────────────────────────
export type CampaignConfig = Schemas["CampaignConfig"];
export type CampaignList = Schemas["CampaignListResponse"];
export type CampaignPerformance = Schemas["CampaignPerformance"];

// ── Call Lists ───────────────────────────────────────────────────────────
export type CallListsList = Schemas["CallListsListResponse"];

// ── Billing ──────────────────────────────────────────────────────────────
export type Balance = Schemas["BalanceResponse"];
export type BalanceCheck = Schemas["BalanceCheckResponse"];
export type BalanceTransaction = Schemas["BalanceTransactionResponse"];
export type BillingSettings = Schemas["BillingSettingsResponse"];
export type BillingPortalRequest = Schemas["BillingPortalRequest"];
export type BillingPortalResponse = Schemas["BillingPortalResponse"];
export type AutoReloadSettings = Schemas["AutoReloadSettingsResponse"];
export type AutoReloadSettingsRequest = Schemas["AutoReloadSettingsRequest"];
export type InvoiceList = Schemas["InvoiceListResponse"];
export type PaymentMethodList = Schemas["PaymentMethodListResponse"];
export type SetupIntent = Schemas["SetupIntentResponse"];

// ── Organizations ────────────────────────────────────────────────────────
export type OrganizationCreate = Schemas["OrganizationCreate"];
export type OrganizationUpdate = Schemas["OrganizationUpdate"];
export type Organization = Schemas["OrganizationResponse"];
export type OrganizationCredentialsUpdate = Schemas["OrganizationCredentialsUpdate"];
// openapi-typescript inlines enums as string-literal unions inside containing
// schemas (no top-level Sku schema), so we extract from OrganizationResponse.
export type Sku = NonNullable<Organization["sku"]>;

// ── Voices catalog ───────────────────────────────────────────────────────
export type Voice = Schemas["VoiceResponse"];
export type VoiceList = Schemas["VoiceListResponse"];
export type VoiceFilterOptions = Schemas["VoiceFilterOptions"];

// ── Errors ───────────────────────────────────────────────────────────────
export type BadRequestError = Schemas["BadRequestError"];

// ── Notifications / Workflows / Templates / MCP ──────────────────────────
export type NotificationList = Schemas["NotificationListResponse"];
export type WorkflowList = Schemas["WorkflowListResponse"];
export type TemplateList = Schemas["TemplateListResponse"];
export type MCPIntegrationList = Schemas["MCPIntegrationListResponse"];
