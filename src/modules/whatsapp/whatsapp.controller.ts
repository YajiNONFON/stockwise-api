import { Request, Response } from "express";
import { WebhookPayloadDto, WebhookVerifyDto } from "./whatsapp.dto";
import { whatsappService } from "./whatsapp.service";

export const whatsappController = {
  // GET — Meta webhook verification
  verifyWebhook(req: Request, res: Response): void {
    const result = WebhookVerifyDto.safeParse(req.query);

    if (!result.success) {
      res.sendStatus(400);
      return;
    }

    const {
      "hub.mode": mode,
      "hub.verify_token": verifyToken,
      "hub.challenge": challenge,
    } = result.data;

    if (
      mode === "subscribe" &&
      verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
    ) {
      res.status(200).send(challenge);
      return;
    }

    res.sendStatus(403);
  },

  // POST — incoming message handler
  async receiveMessage(req: Request, res: Response): Promise<void> {
    // Acknowledge immediately — Meta retries if no 200 within 20s
    res.sendStatus(200);

    // Validate incoming payload
    const result = WebhookPayloadDto.safeParse(req.body);
    if (!result.success) return;

    const payload = result.data;

    // Only process WhatsApp Business Account events
    if (payload.object !== "whatsapp_business_account") return;

    // Loop through entries and changes
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== "messages") continue;

        const { value } = change;
        const messages = value.messages ?? [];
        const contacts = value.contacts ?? [];
        const phoneNumberId = value.metadata.phone_number_id;

        for (const message of messages) {
          // Match message to its contact
          const contact = contacts.find((c) => c.wa_id === message.from);
          if (!contact) continue;

          // Parse the message
          const parsed = whatsappService.parseIncomingMessage(
            message,
            contact,
            phoneNumberId,
          );

          if (!parsed) {
            // Non-text message — notify sender
            await whatsappService.sendMessage(
              message.from,
              "Sorry, I only process text messages for now.",
              phoneNumberId,
            );
            continue;
          }

          // Log received message — will be replaced by AI handler
          console.log(
            `[WhatsApp] Message from ${parsed.senderName} (${parsed.from}): ${parsed.body}`,
          );

          // Temporary reply — will be replaced by AI
          await whatsappService.sendMessage(
            parsed.from,
            `Hello ${parsed.senderName}! Your message was received: "${parsed.body}"`,
            parsed.phoneNumberId,
          );
        }
      }
    }
  },
};
