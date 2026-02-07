/**
 * Risposte di Edilio — unica fonte per tutto ciò che riguarda la piattaforma.
 * Allineato a: Come funziona (landing), registrazione cliente/impresa, supporto, trattamento dati.
 * Aggiorna qui quando cambi testi o flussi sulla piattaforma.
 */

export interface VoceEdilio {
  /** Etichetta per debug / manutenzione */
  argomento: string;
  /** Pattern (regex) o parole chiave che attivano questa risposta */
  match: RegExp | string[];
  risposta: string;
}

function toMatch(m: VoceEdilio["match"]): (t: string) => boolean {
  if (Array.isArray(m)) {
    const words = m.map((w) => w.toLowerCase());
    return (t) => words.some((w) => t.includes(w));
  }
  return (t) => m.test(t);
}

/** Tutte le risposte: ordine = priorità (prima corrispondenza vince) */
export const VOCI_EDILIO: (Omit<VoceEdilio, "match"> & { match: RegExp | string[] })[] = [
  {
    argomento: "Cos'è Edilia",
    match: /cos'?è|che cos'?è|cos e|edilia|piattaforma|servizio|di cosa si occupa|di cosa vi occupate/i,
    risposta:
      "Edilia è una piattaforma che ti aiuta a trasformare la tua idea di lavori in una richiesta chiara. Descrivi cosa vuoi fare, rispondi a poche domande (ambienti, metratura, stato: partire da zero o ristrutturazione), e ricevi una scheda lavori con una stima di costo. La richiesta viene inviata alle imprese della tua zona. È gratuito e in pochi minuti.",
  },
  {
    argomento: "Come funziona (cliente e impresa)",
    match: [
      "come funziona",
      "come si usa",
      "come si fa",
      "passi",
      "procedura",
      "cosa devo fare",
      "cosa fare",
      "flusso",
    ],
    risposta:
      "Per i clienti: 1) Descrivi il tuo progetto in \"Fai la tua richiesta\". 2) Inserisci email e consenso al trattamento dati (obbligatori). 3) Rispondi a poche domande: ambienti coinvolti, metratura approssimativa, stato (partire da zero o ristrutturazione). 4) Ricevi la scheda lavori e il range di costo stimato. 5) Invia la richiesta: arriverà alle imprese della tua zona. Per le imprese: registrati con nome, email, telefono, localizzazione e raggio (min 30 km); scegli le categorie (ristrutturazioni interne/esterne, nuove costruzioni, idraulica, elettricistica). Step 2: documentazione (opzionale), numero dipendenti, filiali, classificazione piccola/media. Solo le imprese accettate accedono al pannello e vedono le richieste.",
  },
  {
    argomento: "Costi",
    match: ["costo", "gratis", "gratuito", "pagare", "prezzo", "a pagamento", "quanto costa"],
    risposta:
      "Per i clienti è gratuito: puoi fare la richiesta, ricevere la scheda lavori e la stima di costo, e inviarla alle imprese senza costi. Edilia non gestisce pagamenti o contratti: eventuali accordi economici sono tra te e l'impresa.",
  },
  {
    argomento: "Imprese e registrazione",
    match: [
      "impresa",
      "imprese",
      "professionist",
      "registrarsi come impresa",
      "registrazione impresa",
      "categorie",
      "raggio",
      "pannello impresa",
    ],
    risposta:
      "Le imprese si registrano con nome, email, telefono, localizzazione e raggio di intervento (minimo 30 km). Categorie disponibili: Ristrutturazioni interne, Ristrutturazioni esterne, Nuove costruzioni, Idraulica, Elettricistica. Secondo step: documentazione (più carichi, più il profilo è affidabile), numero dipendenti, numero filiali, classificazione piccola/media impresa. Solo le imprese accettate dalla piattaforma possono accedere al pannello e vedere le richieste.",
  },
  {
    argomento: "Email, dati, privacy, newsletter",
    match: ["email", "dati", "privacy", "consenso", "newsletter", "trattamento dati", "personali"],
    risposta:
      "Per inviare una richiesta come cliente servono obbligatoriamente la tua email e il consenso al trattamento dei dati personali (per gestire la richiesta e farti contattare dalle imprese). Puoi anche scegliere di iscriverti alla newsletter. I tuoi dati restano tuoi e vengono usati solo per questo scopo.",
  },
  {
    argomento: "Supporto e contatti",
    match: ["contatt", "supporto", "aiuto", "email di", "scrivere", "assistenza"],
    risposta: "Per domande o assistenza puoi scrivere a supporto@edilia.it. Siamo qui per aiutarti.",
  },
  {
    argomento: "Tempi e risposte",
    match: ["tempo", "quanto tempo", "quando", "risposta", "rispondono", "quanto ci mette"],
    risposta:
      "La compilazione della richiesta richiede pochi minuti. Dopo l'invio, le imprese della tua zona ricevono la richiesta e possono rispondere (interessato, richiesta sopralluogo, ecc.). I tempi di risposta dipendono dalle imprese.",
  },
  {
    argomento: "Richiesta lavori (cliente)",
    match: ["richiesta", "fare richiesta", "cliente", "descrizione", "domande", "ambienti", "metratura"],
    risposta:
      "Per fare una richiesta: vai su \"Fai la tua richiesta\", descrivi il progetto, inserisci email e consenso dati, poi rispondi a poche domande (ambienti coinvolti, metratura approssimativa, stato: partire da zero o ristrutturazione). Riceverai la scheda lavori e il range di costo stimato; poi puoi inviare la richiesta alle imprese della tua zona.",
  },
];

const defaultRisposta =
  "Grazie per la domanda. Puoi chiedermi come funziona Edilia, come fare una richiesta, come registrare un'impresa, costi, trattamento dati o supporto. Per assistenza diretta: supporto@edilia.it.";

const emptyRisposta = "Fai una domanda a Edilio e ti rispondo!";

/**
 * Restituisce la risposta di Edilio in base al messaggio dell'utente.
 * Usa le voci in lib/edilio-risposte.ts (allineate alla piattaforma).
 */
export function rispostaEdilio(messaggio: string): string {
  const t = messaggio.trim().toLowerCase();
  if (!t) return emptyRisposta;

  for (const voce of VOCI_EDILIO) {
    const match = toMatch(voce.match);
    if (match(t)) return voce.risposta;
  }

  return defaultRisposta;
}
