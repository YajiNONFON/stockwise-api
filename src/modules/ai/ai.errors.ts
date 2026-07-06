// src/modules/ai/ai.errors.ts

// Exceptions spécifiques au module IA
// Étendent la classe Error native pour rester compatibles
// avec le error handler global Express du projet V1

/**
 * Erreur générique du service IA — OpenAI inaccessible,
 * rate limit, clé invalide, etc.
 */
export class AiServiceException extends Error {
  // Message WhatsApp original — pour le logging et la réponse fallback
  public readonly originalMessage: string;

  constructor(reason: string, originalMessage: string) {
    super(`[AiServiceException] ${reason}`);
    this.name = "AiServiceException";
    this.originalMessage = originalMessage;
  }
}

/**
 * Timeout — OpenAI n'a pas répondu dans les 15 secondes.
 * Le client WhatsApp reçoit un message de réessai.
 */
/*export class AiTimeoutException extends AiServiceException {
  constructor(originalMessage: string) {
    super(
      "Timeout — OpenAI n'a pas répondu dans le délai imparti",
      originalMessage,
    );
    this.name = "AiTimeoutException";
  }
}*/

export class AiTimeoutException extends AiServiceException {
  constructor(originalMessage: string) {
    super("Timeout — connexion à OpenAI expirée", originalMessage);
    this.name = "AiTimeoutException";
  }
}

/**
 * Réponse reçue mais invalide — JSON malformé ou structure
 * non conforme au schéma Zod attendu.
 */
export class AiInvalidResponseException extends AiServiceException {
  constructor(reason: string, originalMessage: string) {
    super(`Réponse invalide — ${reason}`, originalMessage);
    this.name = "AiInvalidResponseException";
  }
}
