// src/modules/whatsapp/whatsapp.routes.ts

import { Router } from "express";
import { whatsappController } from "./whatsapp.controller";

export const whatsappRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: WhatsApp Business API webhook endpoints
 */

/**
 * @swagger
 * /webhook/whatsapp:
 *   get:
 *     summary: Webhook verification by Meta
 *     description: >
 *       Called once by Meta when configuring the webhook in the Meta Developer
 *       Portal. Meta sends a challenge that the server returns as-is to prove
 *       it controls the URL.
 *     tags: [Webhook]
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [subscribe]
 *         description: Verification mode sent by Meta
 *       - in: query
 *         name: hub.verify_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret token to match against WHATSAPP_VERIFY_TOKEN
 *       - in: query
 *         name: hub.challenge
 *         required: true
 *         schema:
 *           type: string
 *         description: Challenge returned as-is if verification succeeds
 *     responses:
 *       200:
 *         description: Verification successful — challenge returned to Meta
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ABC123XYZ"
 *       400:
 *         description: Missing or invalid parameters
 *       403:
 *         description: Incorrect verify token
 */
whatsappRouter.get("/", whatsappController.verifyWebhook);
