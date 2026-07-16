import { z } from "zod";

// Webhook verification DTO — GET

export const WebhookVerifyDto = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});

export type WebhookVerifyInput = z.infer<typeof WebhookVerifyDto>;

// Incoming message DTO — POST payload received from Meta

const WhatsappProfileDto = z.object({
  name: z.string().optional(),
});

const WhatsappContactDto = z.object({
  profile: WhatsappProfileDto,
  wa_id: z.string(),
});

const WhatsappTextDto = z.object({
  body: z.string(),
});

const WhatsappMessageDto = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.string(),
  text: WhatsappTextDto.optional(), // absent if type !== "text"
});

const WhatsappMetadataDto = z.object({
  display_phone_number: z.string(),
  phone_number_id: z.string(),
});

const WhatsappValueDto = z.object({
  messaging_product: z.string(),
  metadata: WhatsappMetadataDto,
  contacts: z.array(WhatsappContactDto).optional(),
  messages: z.array(WhatsappMessageDto).optional(),
});

const WhatsappChangeDto = z.object({
  value: WhatsappValueDto,
  field: z.string(),
});

const WhatsappEntryDto = z.object({
  id: z.string(),
  changes: z.array(WhatsappChangeDto),
});

export const WebhookPayloadDto = z.object({
  object: z.string(),
  entry: z.array(WhatsappEntryDto),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadDto>;
export type WhatsappIncomingMessage = z.infer<typeof WhatsappMessageDto>;
export type WhatsappContact = z.infer<typeof WhatsappContactDto>;
