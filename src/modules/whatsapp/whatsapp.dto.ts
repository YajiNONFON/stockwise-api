// src/modules/whatsapp/whatsapp.dto.ts

import { z } from "zod";

export const WebhookVerifyDto = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});

export type WebhookVerifyInput = z.infer<typeof WebhookVerifyDto>;
