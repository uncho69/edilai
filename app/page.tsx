"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type ComeFunzionaRuolo = "cliente" | "impresa";

const COME_FUNZIONA_CLIENTE = [
  "Descrivi in parole tue cosa vuoi fare (es. rifare il bagno, tinteggiare).",
  "Rispondi a poche domande su ambienti, metrature e livello di finitura.",
  "Ricevi una scheda lavori chiara e un range di costo stimato.",
  "Invia la richiesta alle imprese della tua zona.",
];

const COME_FUNZIONA_IMPRESA = [
  "Registrati e indica zona di intervento e categorie di lavoro.",
  "Ricevi le richieste compatibili con il tuo profilo.",
  "Per ogni richiesta: vedi scheda, budget e localizzazione.",
  "Rispondi: interessato, richiedi sopralluogo o rifiuta.",
];

export default function HomePage() {
  const [aiutoOpen, setAiutoOpen] = useState(false);
  const [comeFunzionaRuolo, setComeFunzionaRuolo] = useState<ComeFunzionaRuolo>("cliente");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0c0c] text-zinc-100">
      {/* Subtle gradient + noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <div className="max-w-md">
          <div className="relative -ml-4 h-[3.25rem] w-full sm:h-[5rem] sm:-ml-5">
            <Image
              src="/ed-logo.png"
              alt="EDILIA"
              width={280}
              height={96}
              className="h-full w-auto max-w-full object-contain object-left"
              priority
            />
          </div>
          <p className="mt-4 text-xl font-medium leading-relaxed text-zinc-200 sm:text-2xl">
            Trasformiamo quello che vuoi fare in una richiesta che le imprese capiscono.
          </p>
          <p className="mt-2 text-base text-zinc-500">
            Gratuito. In pochi minuti.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 sm:items-stretch">
          <Link
            href="/cliente/nuova-richiesta"
            className="group relative flex min-h-[220px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Sei un cliente?
            </span>
            <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-400">
              Fai la tua richiesta
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
              Descrivi cosa vuoi fare, completa il questionario e invia alle imprese.
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#E0B420] transition group-hover:gap-3">
              Inizia
              <span className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>

          <Link
            href="/impresa/registrati"
            className="group relative flex min-h-[220px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Sei un&apos;impresa?
            </span>
            <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-400">
              Registrati
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
              Crea il tuo profilo, indica zona e categorie, ricevi richieste compatibili e trova nuovi clienti.
            </span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#E0B420] transition group-hover:gap-3">
              Registrati
              <span className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </div>

        {/* Come funziona */}
        <section className="mt-20 max-w-md">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-200">
            Come funziona
          </h2>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setComeFunzionaRuolo("cliente")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                comeFunzionaRuolo === "cliente"
                  ? "border-[#E0B420] bg-[#E0B420]/10 text-[#E0B420]"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setComeFunzionaRuolo("impresa")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                comeFunzionaRuolo === "impresa"
                  ? "border-[#E0B420] bg-[#E0B420]/10 text-[#E0B420]"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              Impresa
            </button>
          </div>
          <ol className="mt-6 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            {(comeFunzionaRuolo === "cliente" ? COME_FUNZIONA_CLIENTE : COME_FUNZIONA_IMPRESA).map(
              (step, i) => (
                <li key={i} className="flex gap-4 text-sm text-zinc-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E0B420]/20 text-xs font-semibold text-[#E0B420]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              )
            )}
          </ol>
        </section>

        <button
          type="button"
          onClick={() => setAiutoOpen(true)}
          className="mt-14 inline-block text-sm text-[#E0B420] underline underline-offset-2 transition hover:text-amber-400"
        >
          Hai bisogno di aiuto?
        </button>
      </div>

      {/* Modale Aiuto */}
      {aiutoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setAiutoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Contatti"
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAiutoOpen(false)}
              className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300"
              aria-label="Chiudi"
            >
              ✕
            </button>
            <p className="text-lg font-medium text-zinc-200">
              Hai domande o ti serve una mano?
            </p>
            <p className="mt-3 text-zinc-400">
              Scrivici pure: siamo qui per aiutarti.
            </p>
            <p className="mt-6">
              <a
                href="mailto:supporto@edilia.it"
                className="font-medium text-[#E0B420] hover:underline"
              >
                supporto@edilia.it
              </a>
            </p>
            <button
              type="button"
              onClick={() => setAiutoOpen(false)}
              className="mt-8 w-full rounded-xl border border-zinc-600 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
