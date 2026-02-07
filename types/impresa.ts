/**
 * Tipi per imprese / professionisti (MVP light).
 */

/** Stato del profilo impresa */
export type StatoImpresa = "attiva" | "in_revisione" | "sospesa";

/** Risposta impresa a una richiesta */
export type RispostaImpresa = "accetta" | "rifiuta" | "sopralluogo";

/** Documento caricato in registrazione */
export interface DocumentoCaricato {
  name: string;
  path: string;
}

/** Profilo base impresa */
export interface ProfiloImpresa {
  id: string;
  /** Nome o ragione sociale */
  nome: string;
  email: string;
  telefono?: string;
  /** CAP o città di riferimento */
  localizzazione: string;
  /** Raggio in km */
  raggioKm: number;
  /** Categorie di lavoro accettate (es. ristrutturazioni_interne, idraulica, ...) */
  categorieLavoro: string[];
  stato: StatoImpresa;
  /** Documenti caricati (P.IVA, certificazioni, ecc.) */
  documenti?: DocumentoCaricato[];
  /** Step 2 opzionali */
  numDipendenti?: number;
  numFiliali?: number;
  tipoImpresa?: "piccola" | "media";
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
