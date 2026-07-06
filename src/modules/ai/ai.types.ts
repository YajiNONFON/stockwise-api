// src/modules/ai/ai.types.ts

// Types de base partagés entre plusieurs intentions

/** Statuts de commande disponibles dans le système V1 */
export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

/** Périodes de rapport disponibles dans dashboard.service.ts */
export type ReportPeriod = "today" | "week" | "month";

/** Rôle de l'expéditeur du message WhatsApp */
export type WhatsappRole = "COMMERCANT" | "CLIENT";

// Intentions — une interface par action

export interface IntentCreerCommande {
  action: "CREER_COMMANDE";
  produit: string;
  quantite: number;
  nom_livraison: string | null;
  adresse_livraison: string | null;
  note: string | null;
}

export interface IntentVoirCommandes {
  action: "VOIR_COMMANDES";
  filtre_statut: OrderStatus | null;
}

export interface IntentAnnulerCommande {
  action: "ANNULER_COMMANDE";
  reference_commande: string | null;
}

export interface IntentAjouterProduit {
  action: "AJOUTER_PRODUIT";
  nom: string;
  prix: number;
  stock: number;
  seuil_alerte: number | null;
  categorie: string | null;
}

export interface IntentModifierProduit {
  action: "MODIFIER_PRODUIT";
  produit: string; // nom actuel pour recherche
  nom: string | null;
  prix: number | null;
  stock: number | null;
  seuil_alerte: number | null;
  categorie: string | null;
}

export interface IntentVoirStock {
  action: "VOIR_STOCK";
  produit: string | null;
  stock_critique_seulement: boolean;
}

export interface IntentModifierStock {
  action: "MODIFIER_STOCK";
  produit: string;
  nouvelle_quantite: number | null; // "mets le stock à 50"
  ajustement: number | null; // "j'ai reçu 20" → +20 | "j'ai perdu 5" → -5
}

export interface IntentVoirCatalogue {
  action: "VOIR_CATALOGUE";
  produit: string | null; // null = tout le catalogue
}

export interface IntentVoirClients {
  action: "VOIR_CLIENTS";
  search: string | null;
}

export interface IntentRapportJournalier {
  action: "RAPPORT_JOURNALIER";
  period: ReportPeriod;
}

export interface IntentDemanderRapport {
  action: "DEMANDER_RAPPORT";
  period: ReportPeriod | null;
  status: OrderStatus | null;
  startDate: string | null; // ISO 8601 ex: "2024-06-01T00:00:00.000Z"
  endDate: string | null; // ISO 8601 ex: "2024-06-30T23:59:59.999Z"
}

export interface IntentInconnue {
  action: "INTENTION_INCONNUE";
  message_original: string;
}

// Union type — ce que l'IA retourne toujours

export type AiIntent =
  | IntentCreerCommande
  | IntentVoirCommandes
  | IntentAnnulerCommande
  | IntentAjouterProduit
  | IntentModifierProduit
  | IntentVoirStock
  | IntentModifierStock
  | IntentVoirClients
  | IntentRapportJournalier
  | IntentDemanderRapport
  | IntentInconnue
  | IntentVoirCatalogue;

// Type guard — pour narrowing dans les handlers

export function isIntent<T extends AiIntent>(
  intent: AiIntent,
  action: T["action"],
): intent is T {
  return intent.action === action;
}

// Constantes — actions par rôle (double sécurité côté handler)

export const ACTIONS_CLIENT = [
  "CREER_COMMANDE",
  "ANNULER_COMMANDE",
  "VOIR_CATALOGUE",
  "INTENTION_INCONNUE",
] as const;

export const AI_ACTIONS = [
  "CREER_COMMANDE",
  "VOIR_COMMANDES",
  "ANNULER_COMMANDE",
  "AJOUTER_PRODUIT",
  "MODIFIER_PRODUIT",
  "VOIR_CATALOGUE",
  "VOIR_STOCK",
  "MODIFIER_STOCK",
  "VOIR_CLIENTS",
  "RAPPORT_JOURNALIER",
  "DEMANDER_RAPPORT",
  "INTENTION_INCONNUE",
] as const;

export type AiAction = (typeof AI_ACTIONS)[number];
