// src/modules/whatsapp/whatsapp.controller.ts

import { Request, Response } from "express";
import { WebhookVerifyDto } from "./whatsapp.dto";

export const whatsappController = {
  /**
   * Vérification du webhook — appelé une seule fois par Meta
   * lors de la configuration dans le Meta Developer Portal.
   * Meta envoie un GET avec hub.challenge, on le renvoie tel quel
   * pour prouver qu'on contrôle cette URL.
   */
  verifyWebhook(req: Request, res: Response): void {
    // Validation des query params
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

    // Vérification du mode et du token secret
    if (
      mode === "subscribe" &&
      verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
    ) {
      // On renvoie le challenge — Meta confirme que le webhook est valide
      res.status(200).send(challenge);
      return;
    }

    // Token invalide — on refuse
    res.sendStatus(403);
  },
};
