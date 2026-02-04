/**
 * Tipi per imprese / professionisti (MVP light).
 */

import type { CategoriaIntervento } from "./request";

/** Stato del profilo impresa */
export type StatoImpresa = "attiva" | "sospesa";

/** Risposta impresa a una richiesta */
export type RispostaImpresa = "accetta" | "rifiuta" | "sopralluogo";

/** Profilo base impresa */
export interface ProfiloImpresa {
  id: string;
  /** Nome o ragione sociale */
  nome: string;
  email: string;
  /** CAP o città di riferimento */
  localizzazione: string;
  /** Raggio in km */
  raggioKm: number;
  /** Categorie di lavoro accettate */
  categorieLavoro: CategoriaIntervento[];
  stato: StatoImpresa;
  createdAt: string;
  updatedAt: string;
}

/** Invio di una richiesta a un'impresa (assegnazione) */
export interface AssegnazioneRichiesta {
  id: string;
  richiestaLavoriId: string;
  impresaId: string;
  /** Deciso dall'admin */
  inviataAt: string;
  /** Risposta impresa */
  risposta?: RispostaImpresa;
  rispostaAt?: string;
  /** Messaggio testuale base (opzionale) */
  messaggio?: string;
}
