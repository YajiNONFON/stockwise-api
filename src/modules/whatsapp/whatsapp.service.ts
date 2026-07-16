import { WhatsappContact, WhatsappIncomingMessage } from "./whatsapp.dto";

// Internal types

export interface ParsedWhatsappMessage {
  from: string; // sender's phone number
  senderName: string; // WhatsApp profile name
  messageId: string; // Meta unique message identifier
  body: string; // raw message text
  phoneNumberId: string; // Meta receiving phone number ID
}

// WhatsApp service — message parsing and sending

export const whatsappService = {
  /**
   * Extracts useful data from an incoming Meta message.
   * Returns null if the message is not of type text.
   */
  parseIncomingMessage(
    message: WhatsappIncomingMessage,
    contact: WhatsappContact,
    phoneNumberId: string,
  ): ParsedWhatsappMessage | null {
    // Only process text messages for now
    if (message.type !== "text" || !message.text?.body) {
      return null;
    }

    // WhatsApp profile name — fallback to last 4 digits if absent
    const senderName =
      contact.profile.name?.trim() || `Client ${message.from.slice(-4)}`;

    return {
      from: message.from,
      senderName,
      messageId: message.id,
      body: message.text.body,
      phoneNumberId,
    };
  },

  /**
   * Sends a text message via the WhatsApp Business API.
   * @param to - recipient phone number (international format without +)
   * @param text - message text to send
   * @param phoneNumberId - Meta sender phone number ID
   */
  async sendMessage(
    to: string,
    text: string,
    phoneNumberId: string,
  ): Promise<void> {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhatsApp send failed: ${JSON.stringify(error)}`);
    }
  },
};
