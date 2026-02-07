/** Chiave sessionStorage per la bozza richiesta (flusso cliente) */
export const DRAFT_KEY = "edil-draft";

export interface DraftRichiesta {
  descrizioneIniziale: string;
  localizzazione: string;
  /** Email obbligatoria per inviare la richiesta */
  email?: string;
  /** Consenso trattamento dati (obbligatorio per invio) */
  privacyConsent?: boolean;
  /** Iscrizione newsletter (opzionale) */
  newsletterConsent?: boolean;
  budgetMassimo?: number;
  fotoNote?: string;
  /** URL delle foto (data URL base64 o URL dopo upload) */
  photoUrls?: string[];
  startedAt: string;
  /** Risposte flow: ambienti, metratura_min, metratura_max, stato */
  answers: Record<string, string>;
}

export function getDraft(): DraftRichiesta | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(DRAFT_KEY);
    return s ? (JSON.parse(s) as DraftRichiesta) : null;
  } catch {
    return null;
  }
}

export function setDraft(d: Partial<DraftRichiesta>) {
  if (typeof window === "undefined") return;
  const current = getDraft();
  const merged = { ...current, ...d } as DraftRichiesta;
  if (!merged.startedAt && d.descrizioneIniziale) {
    merged.startedAt = new Date().toISOString();
  }
  if (!merged.answers) merged.answers = {};
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
}
