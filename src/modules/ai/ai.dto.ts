import { z } from "zod";

// ===========================================================

export const AiIntentDto = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("CREER_COMMANDE"),
    produit: z.string(),
    quantite: z.number().int().positive(),
    nom_livraison: z.string().nullable(),
    adresse_livraison: z.string().nullable(),
    note: z.string().nullable(),
  }),
  z.object({
    action: z.literal("VOIR_COMMANDES"),
    filtre_statut: z.enum(["PENDING", "DELIVERED", "CANCELLED"]).nullable(),
  }),
  z.object({
    action: z.literal("ANNULER_COMMANDE"),
    reference_commande: z.string().nullable(),
  }),
  z.object({
    action: z.literal("AJOUTER_PRODUIT"),
    nom: z.string(),
    prix: z.number().int().nonnegative(),
    stock: z.number().int().nonnegative(),
    seuil_alerte: z.number().int().nonnegative().nullable(),
    categorie: z.string().nullable(),
  }),
  z.object({
    action: z.literal("MODIFIER_PRODUIT"),
    produit: z.string(),
    nom: z.string().nullable(),
    prix: z.number().int().nonnegative().nullable(),
    stock: z.number().int().nonnegative().nullable(),
    seuil_alerte: z.number().int().nonnegative().nullable(),
    categorie: z.string().nullable(),
  }),
  z.object({
    action: z.literal("VOIR_CATALOGUE"),
    produit: z.string().nullable(),
  }),
  z.object({
    action: z.literal("VOIR_STOCK"),
    produit: z.string().nullable(),
    stock_critique_seulement: z.boolean(),
  }),
  z.object({
    action: z.literal("MODIFIER_STOCK"),
    produit: z.string(),
    nouvelle_quantite: z.number().int().nonnegative().nullable(),
    ajustement: z.number().int().nullable(),
  }),
  z.object({
    action: z.literal("VOIR_CLIENTS"),
    search: z.string().nullable(),
  }),
  z.object({
    action: z.literal("RAPPORT_JOURNALIER"),
    period: z.enum(["today", "week", "month"]),
  }),
  z.object({
    action: z.literal("DEMANDER_RAPPORT"),
    period: z.enum(["today", "week", "month"]).nullable(),
    status: z.enum(["PENDING", "DELIVERED", "CANCELLED"]).nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
  }),
  z.object({
    action: z.literal("INTENTION_INCONNUE"),
    message_original: z.string(),
  }),
]);

// JSON Schema transmis à OpenAI (structured outputs)
// Doit rester synchronisé avec AiIntentDto ci-dessus

export const OPENAI_JSON_SCHEMA = {
  name: "stockwise_intent",
  strict: true,
  schema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: [
          "CREER_COMMANDE",
          "VOIR_COMMANDES",
          "ANNULER_COMMANDE",
          "AJOUTER_PRODUIT",
          "MODIFIER_PRODUIT",
          "VOIR_STOCK",
          "MODIFIER_STOCK",
          "VOIR_CLIENTS",
          "RAPPORT_JOURNALIER",
          "DEMANDER_RAPPORT",
          "INTENTION_INCONNUE",
        ],
      },
      // CREER_COMMANDE
      produit: { type: ["string", "null"] },
      quantite: { type: ["number", "null"] },
      nom_livraison: { type: ["string", "null"] },
      adresse_livraison: { type: ["string", "null"] },
      note: { type: ["string", "null"] },
      // VOIR_COMMANDES / DEMANDER_RAPPORT
      filtre_statut: { type: ["string", "null"] },
      status: { type: ["string", "null"] },
      // ANNULER_COMMANDE
      reference_commande: { type: ["string", "null"] },
      // AJOUTER_PRODUIT / MODIFIER_PRODUIT
      nom: { type: ["string", "null"] },
      prix: { type: ["number", "null"] },
      stock: { type: ["number", "null"] },
      seuil_alerte: { type: ["number", "null"] },
      categorie: { type: ["string", "null"] },
      // VOIR_STOCK
      stock_critique_seulement: { type: ["boolean", "null"] },
      // MODIFIER_STOCK
      nouvelle_quantite: { type: ["number", "null"] },
      ajustement: { type: ["number", "null"] },
      // VOIR_CLIENTS
      search: { type: ["string", "null"] },
      // RAPPORT_JOURNALIER / DEMANDER_RAPPORT
      period: { type: ["string", "null"] },
      startDate: { type: ["string", "null"] },
      endDate: { type: ["string", "null"] },
      // INTENTION_INCONNUE
      message_original: { type: ["string", "null"] },
    },
    required: ["action"],
    additionalProperties: false,
  },
} as const;
