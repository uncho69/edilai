# EDIL-AI — Specifica MVP

## Messaggio chiave per il programmatore

**Questa app non è un marketplace nell’MVP. È uno strumento di strutturazione del bisogno.**

- Se questa parte funziona → tutto il resto si può costruire.
- Se non funziona → nessuna feature aggiuntiva la salverà.

---

## Ruolo dell’AI

L’AI **non** fa edilizia né sostituisce tecnico o impresa. Il suo ruolo è:

- **Tradurre** input umano disordinato in una **struttura tecnica** comprensibile e utilizzabile.
- Esempio input: *"voglio rifare le pareti di questa stanza in rosso e cambiare il pavimento"* → oggi genera telefonate, sopralluoghi a vuoto, preventivi non confrontabili. L’AI interviene in questo punto morto.

**Fase 1 (fondazione):** base di conoscenza strutturata: categorie di intervento, sotto-lavorazioni, dipendenze, materiali standard, range di costo. Senza questa struttura, l’LLM darebbe risposte plausibili ma inaffidabili. In questa fase l’AI è **guidata, vincolata**, non creativa: riconosce pattern e mappa il linguaggio naturale su una **tassonomia tecnica chiusa**.

**MVP:** l’AI entra sull’input. L’utente descrive il bisogno in modo libero → il sistema classifica il tipo di intervento e attiva un’**intervista tecnica guidata** (domande mirate da decision tree, LLM per linguaggio naturale). Le domande riducono l’ambiguità (metrature approssimative, contesto, livello di finitura, criticità). In pochi minuti: da idea vaga a quadro chiaro.

---

## Attori

| Attore | Ruolo nell’MVP |
|--------|-----------------|
| **Cliente finale** | Core. Crea richiesta, flow guidato, vede scheda lavori e range costi, invia a imprese. |
| **Impresa / professionista** | Light. Profilo base, area + categorie, riceve richieste, accetta/rifiuta/richiede sopralluogo. |
| **Admin** | Indispensabile ma minimale. Vede tutto, corregge output AI, gestisce imprese e assegnazione richieste. |

---

## PARTE 1 — Cliente finale (MVP reale)

Flusso **lineare**.

### Prerequisiti cliente

1. **Account**: email + password **oppure** magic link.
2. **Localizzazione immobile**: CAP o città (non indirizzo preciso).
3. **Nuova richiesta lavori**.

### La richiesta lavori (core)

L’utente può:

- Scrivere **liberamente** cosa vuole fare (textarea).
- Caricare **1–3 foto** opzionali (ambiente, pavimento, pareti).
- Indicare un **budget massimo stimato** (slider o input numerico).

Da qui parte il **flow AI guidato**.

### Comportamento del sistema

1. **Classifica** automaticamente il tipo di intervento (es. tinteggiatura + pavimento).
2. **Attiva** una sequenza di domande dinamiche (hard-coded + AI).
3. **Raccoglie**:
   - ambiente/i coinvolti;
   - metratura approssimativa (range, non precisione);
   - stato attuale (nuovo, vecchio, da demolire);
   - livello di finitura desiderato (base / medio / alto).

Obiettivo: il cliente non si sente interrogato come da un tecnico, ma non resta vago.

### Output per il cliente

- Riepilogo chiaro della richiesta.
- Elenco lavorazioni previste.
- **Range di costo stimato**.
- **Disclaimer ben visibile**: “stima preliminare, non preventivo”.

Azioni cliente:

- **Confermare e inviare** la richiesta.
- **Tornare indietro** e modificarla.

---

## PARTE 2 — Output AI (cosa deve produrre il sistema)

### L’AI NON deve

- Inventare prezzi precisi.
- Prendere decisioni normative.
- Promettere fattibilità.

### L’AI DEVE produrre

Una **struttura JSON interna** con:

- categoria intervento;
- sotto-lavorazioni;
- ordine logico dei lavori;
- range di costo per macro-area;
- note tecniche (es. “potrebbe richiedere sopralluogo”).

Questa struttura:

- viene **salvata a database**;
- è **leggibile e correggibile dall’admin**;
- è **presentata in forma semplice** all’utente;
- è **inviata alle imprese**.

**Fondamentale:** ispezionabile e correggibile dall’admin.

---

## PARTE 3 — Imprese / professionisti (versione ridotta)

Nell’MVP le imprese **non** hanno un’app complessa.

Devono poter:

- Creare un **profilo base**.
- Indicare:
  - **area geografica** (raggio km);
  - **categorie di lavoro** accettate.
- **Ricevere** richieste compatibili.

Per ogni richiesta:

- Vedere: descrizione lavori strutturata, range di budget, localizzazione approssimativa.
- Azioni: **accettare (interessato)**, **rifiutare**, **richiedere sopralluogo**.

Niente chat avanzata: messaggi testuali base o notifiche email.

---

## PARTE 4 — Admin panel (obbligatorio)

L’admin deve poter:

- Vedere **tutte le richieste** create.
- Vedere **output AI grezzo** + **output mostrato all’utente**.
- **Correggere manualmente**: categorie, range di costo, note.
- **Gestire imprese** (attive / sospese).
- **Decidere quali imprese** ricevono una richiesta.

Scopo: evitare errori grossi dell’AI, raccogliere feedback, migliorare il sistema senza retraining complesso.

---

## PARTE 5 — Cosa NON fare nell’MVP

**Nell’MVP non vanno sviluppati:**

- Pagamenti
- Rating / recensioni
- Contratti
- Firma digitale
- Comparazione automatica preventivi
- Gestione avanzata di più imprese per lo stesso lavoro
- AI che “sceglie” l’impresa
- Misurazioni precise o rendering

**Se il dev propone queste cose → scope creep.**

---

## PARTE 6 — Metriche tecniche minime da tracciare

Tracciare **fin da subito**:

1. Tempo medio per completare una richiesta.
2. Tasso di abbandono durante il flow AI.
3. Quante richieste arrivano a output completo.
4. Quante vengono accettate dalle imprese.
5. Quante richiedono sopralluogo.

Questi numeri valgono più di mille slide.

---

## Visione funzionale generale

1. L’utente entra, descrive in linguaggio naturale cosa vuole fare.
2. Viene guidato passo passo con domande intelligenti.
3. Alla fine ottiene una **scheda lavori strutturata** (capitolato preliminare + range costi + note).
4. La scheda viene **inviata a imprese selezionate localmente**, che possono accettare, rifiutare o chiedere sopralluogo.

**Nessun pagamento, nessun contratto, nessuna automazione complessa nell’MVP.**
