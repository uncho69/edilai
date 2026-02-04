# EDIL-AI

Piattaforma per **strutturare** la richiesta di lavori edili: l’utente descrive in linguaggio naturale, il sistema lo guida con domande mirate e produce una scheda lavori chiara (capitolato preliminare + range costi).  
Nell’MVP non è un marketplace: niente pagamenti, contratti o rating. Solo strutturazione del bisogno e invio della richiesta a imprese selezionate.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS**
- App in `web/`

## Documentazione

- **[SPEC-MVP.md](docs/SPEC-MVP.md)** — Specifica completa: cliente, output AI, imprese, admin, visione.
- **[NON-FARE-MVP.md](docs/NON-FARE-MVP.md)** — Cosa non implementare (scope creep).
- **[METRICHE-MVP.md](docs/METRICHE-MVP.md)** — Metriche tecniche da tracciare da subito.

## Avvio

```bash
cd web
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Struttura progetto (web)

- `app/` — Route: home, `/cliente`, `/cliente/nuova-richiesta`, flow, riepilogo, `/impresa`, `/admin`.
- `app/api/classifica/` — API stub per classificazione richiesta (output AI); in produzione collegare LLM vincolato alla tassonomia.
- `types/` — Tipi per richiesta, output AI, imprese, metriche.
- `lib/tassonomia.ts` — Base di conoscenza: categorie, sotto-lavorazioni, range costi (fase fondazione).

## Prossimi passi (per il dev)

1. **Auth**: email+password o magic link (cliente; poi impresa e admin).
2. **DB**: persistenza richieste, utenti, imprese, assegnazioni, eventi metriche.
3. **Flow reale**: salvataggio step, chiamata API classifica al termine, riepilogo con dati da DB.
4. **Admin**: lista richieste, vista output AI grezzo, correzione manuale, gestione imprese.
5. **Imprese**: profilo, ricezione richieste, risposta (accetta/rifiuta/sopralluogo).
