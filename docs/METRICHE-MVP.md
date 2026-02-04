# Metriche tecniche minime da tracciare (MVP)

Chiedere al dev di **tracciare fin da subito** le seguenti metriche. Questi numeri valgono più di mille slide.

| Metrica | Descrizione | Dove tracciare |
|--------|-------------|----------------|
| **Tempo medio per completare una richiesta** | Da inizio compilazione a “conferma e invio”. | Evento `request_completed` con timestamp inizio/fine. |
| **Tasso di abbandono durante il flow AI** | Utenti che iniziano ma non arrivano alla fine. | Step raggiunto vs. step totale; sessione abbandonata dopo N min senza azione. |
| **Richieste con output completo** | Quante richieste arrivano a scheda lavori completa. | Conteggio richieste in stato `completed` (o equivalente). |
| **Richieste accettate dalle imprese** | Quante risposte “interessato” / accetta. | Conteggio risposte impresa = `accepted`. |
| **Richieste con richiesta di sopralluogo** | Quante volte l’impresa chiede sopralluogo. | Conteggio risposte impresa = `site_visit_requested`. |

Implementazione suggerita:

- Tabella `request_events` o `analytics_events` con: `event_type`, `request_id`, `payload` (JSON), `created_at`.
- Oppure campi dedicati sulla richiesta: `started_at`, `completed_at`, e sulla risposta impresa: `response_type` (accepted | rejected | site_visit_requested).

Aggregazioni (report per admin) possono essere calcolate in un secondo momento; l’importante è **registrare i dati grezzi** da subito.
