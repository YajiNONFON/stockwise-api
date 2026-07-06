// src/modules/ai/ai.service.ts

import OpenAI, { APIConnectionTimeoutError } from "openai";
import { buildUserMessage, STOCKWISE_SYSTEM_PROMPT } from "./ai.prompts";
import { AiIntentDto, OPENAI_JSON_SCHEMA } from "./ai.dto";
import { AiIntent, WhatsappRole } from "./ai.types";
import {
  AiInvalidResponseException,
  AiServiceException,
  AiTimeoutException,
} from "./ai.errors";

// Initialisation du client OpenAI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000, // 15s max — WhatsApp attend une réponse rapide
});

// Service IA — point d'entrée unique

export const aiService = {
  /**
   * Interprète un message WhatsApp en intention structurée JSON.
   * @param message - message brut reçu depuis WhatsApp
   * @param role - rôle de l'expéditeur (CLIENT ou COMMERCANT)
   * @returns AiIntent — intention validée et typée
   */
  async interpretMessage(
    message: string,
    role: WhatsappRole,
  ): Promise<AiIntent> {
    const userMessage = buildUserMessage(message, role);

    let rawContent: string | null = null;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Rapide et économique pour de la classification
        temperature: 0, // Zéro créativité — on veut du déterminisme total
        max_tokens: 300, // Une intention JSON ne dépasse jamais 300 tokens
        response_format: {
          type: "json_schema",
          json_schema: OPENAI_JSON_SCHEMA,
        },
        messages: [
          { role: "system", content: STOCKWISE_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      });

      rawContent = response.choices[0]?.message?.content ?? null;
    } catch (error) {
      if (error instanceof APIConnectionTimeoutError) {
        throw new AiTimeoutException(message);
      }
      throw new AiServiceException(
        `Erreur OpenAI : ${error instanceof Error ? error.message : "inconnue"}`,
        message,
      );
    }
    // Réponse vide — ne devrait pas arriver avec structured outputs
    if (!rawContent) {
      throw new AiInvalidResponseException("Réponse OpenAI vide", message);
    }

    // Parsing JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new AiInvalidResponseException(
        `JSON invalide reçu : ${rawContent}`,
        message,
      );
    }

    // Validation Zod — filet de sécurité final
    const result = AiIntentDto.safeParse(parsed);

    if (!result.success) {
      throw new AiInvalidResponseException(
        `Structure invalide : ${result.error.message}`,
        message,
      );
    }

    return result.data as AiIntent;
  },
};
