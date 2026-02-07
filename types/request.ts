/**
 * Tipi per richiesta lavori e output AI.
 * Allineati a SPEC-MVP Parte 2: struttura JSON interna.
 */

/** Livello di finitura desiderato */
export type LivelloFinitura = "base" | "medio" | "alto";

/** Stato attuale dell'ambiente/lavorazione */
export type StatoAttuale = "nuovo" | "vecchio" | "da_demolire" | "da_rifare";

/** Categoria macro di intervento (tassonomia chiusa - fondazione) */
export type CategoriaIntervento =
  | "tinteggiatura"
  | "pavimentazione"
  | "bagno"
  | "cucina"
  | "impianti"
  | "infissi"
  | "demolizione"
  | "altro";

/** Singola sotto-lavorazione nell'ambito di una categoria */
export interface SottoLavorazione {
  codice: string;
  descrizione: string;
  ordine: number;
  /** range costo [min, max] in euro */
  rangeCosto?: [number, number];
  note?: string;
}

/** Macro-area con range di costo (per output utente) */
export interface MacroAreaCosto {
  etichetta: string;
  categoria: CategoriaIntervento;
  rangeCosto: [number, number];
  sottoLavorazioni: SottoLavorazione[];
}

/** Output AI grezzo (salvato a DB, ispezionabile/correggibile da admin) */
export interface OutputAIGrezzo {
  categoriaIntervento: CategoriaIntervento[];
  sottoLavorazioni: SottoLavorazione[];
  ordineLavori: string[];
  rangeCostoPerMacroArea: MacroAreaCosto[];
  noteTecniche: string[];
  /** es. "potrebbe richiedere sopralluogo" */
  rawPayload?: Record<string, unknown>;
}

/** Dati raccolti durante il flow guidato (intervista) */
export interface DatiIntervista {
  ambienti: string[];
  metraturaRange?: { min: number; max: number };
  statoAttuale: StatoAttuale;
  livelloFinitura: LivelloFinitura;
  criticità?: string;
}

/** Stato della richiesta nel flusso */
export type StatoRichiesta =
  | "bozza"
  | "in_compilazione"
  | "output_pronto"
  | "inviata"
  | "annullata";

/** Richiesta lavori (entità principale cliente) */
export interface RichiestaLavori {
  id: string;
  userId: string;
  /** Email richiedente (obbligatoria per invio) */
  email?: string;
  /** Consenso newsletter */
  newsletterConsent?: boolean;
  /** CAP o città */
  localizzazione: string;
  /** Testo libero iniziale */
  descrizioneIniziale: string;
  /** 1-3 foto (URL o path) */
  fotoUrls?: string[];
  /** Budget massimo stimato (euro) */
  budgetMassimo?: number;
  /** Dati del flow guidato */
  datiIntervista?: DatiIntervista;
  /** Output AI (grezzo, correggibile da admin) */
  outputAIGrezzo?: OutputAIGrezzo;
  /** Output presentato all'utente (può essere uguale o “ripulito”) */
  outputPerUtente?: OutputAIGrezzo;
  stato: StatoRichiesta;
  /** Per metriche: inizio compilazione */
  startedAt: string;
  /** Per metriche: completamento */
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
