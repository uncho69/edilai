"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type ComeFunzionaRuolo = "cliente" | "impresa";

const COME_FUNZIONA_CLIENTE = [
  "Descrivi in parole tue cosa vuoi fare (es. rifare il bagno, tinteggiare).",
  "Rispondi a poche domande su ambienti, metrature e stato dell'immobile.",
  "Ricevi una scheda lavori chiara e un range di costo stimato.",
  "Invia la richiesta alle imprese della tua zona.",
];

const COME_FUNZIONA_IMPRESA = [
  "Registrati e indica zona di intervento e categorie di lavoro.",
  "Ricevi le richieste compatibili con il tuo profilo.",
  "Per ogni richiesta: vedi scheda, budget e localizzazione.",
  "Rispondi: interessato, richiedi sopralluogo o rifiuta.",
];

/** Slide del banner destro: ogni slide ha sfondo + messaggio su come funziona */
const BANNER_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
    title: "Ristrutturare, senza il caos.",
    subtitle:
      "Descrivi il tuo progetto in libertà. Noi lo trasformiamo in una richiesta chiara e la inviamo alle imprese della tua zona.",
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    title: "Dal progetto al preventivo in pochi minuti.",
    subtitle:
      "Rispondi a poche domande su ambienti e metrature. Ricevi una scheda lavori e un range di costo stimato prima di contattare nessuno.",
  },
  {
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    title: "Noi troviamo. Tu scegli.",
    subtitle:
      "Le imprese ricevono richieste già strutturate. Tu ricevi le risposte e decidi con chi andare avanti, senza intermediazioni inutili.",
  },
];

const BANNER_DURATION_MS = 6000;

export default function HomePage() {
  const [aiutoOpen, setAiutoOpen] = useState(false);
  const [comeFunzionaRuolo, setComeFunzionaRuolo] = useState<ComeFunzionaRuolo>("cliente");
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNER_SLIDES.length);
    }, BANNER_DURATION_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header globale: logo a sinistra, Login a destra (visibile sopra le immagini su desktop) */}
      <header className="flex w-full shrink-0 items-center justify-between border-b border-zinc-800/50 bg-[#0c0c0c] px-6 py-4 lg:absolute lg:left-0 lg:right-0 lg:z-20 lg:border-0 lg:bg-transparent">
        <div className="relative -ml-2 h-[2.5rem] w-auto sm:h-[3rem] sm:-ml-4">
          <Image
            src="/ed-logo.png"
            alt="EDILIA"
            width={200}
            height={64}
            className="h-full w-auto object-contain object-left"
            priority
          />
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/come-funziona"
            className="text-sm font-medium text-[#E0B420] underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Come funziona
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[#E0B420] underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Contenuto: pannello sinistro + area banner */}
      <div className="flex flex-1 pt-0 lg:pt-16">
      {/* Pannello sinistro: contenuto (stile WeTransfer) */}
      <div className="relative flex w-full flex-col bg-[#0c0c0c] text-zinc-100 lg:max-w-[480px] lg:shrink-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />

        <div className="relative flex-1 overflow-y-auto px-6 py-8 sm:py-10">
          <div className="mx-auto max-w-md">
            <p className="text-xl font-medium leading-relaxed text-zinc-200 sm:text-2xl">
              Trasformiamo quello che vuoi fare in una richiesta che le imprese capiscono.
            </p>
            <p className="mt-2 text-base text-zinc-500">
              Gratuito. In pochi minuti.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md grid gap-5 sm:grid-cols-2 sm:items-stretch lg:grid-cols-1">
            <Link
              href="/cliente/nuova-richiesta"
              className="group relative flex min-h-[200px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
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
              className="group relative flex min-h-[200px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
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

          <section className="mx-auto mt-16 max-w-md">
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
            className="mx-auto mt-12 block text-sm text-[#E0B420] underline underline-offset-2 transition hover:text-amber-400"
          >
            Hai bisogno di aiuto?
          </button>
        </div>
      </div>

      {/* Area destra: banner rotanti con messaggi su come funziona */}
      <div className="relative hidden min-h-screen flex-1 lg:block">
        {BANNER_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === bannerIndex ? 1 : 0,
              zIndex: i === bannerIndex ? 1 : 0,
            }}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              role="presentation"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/50 via-[#0c0c0c]/40 to-[#0c0c0c]/50" />
            <div className="absolute inset-0 flex items-center justify-center px-8 lg:px-16">
              <div className="max-w-lg text-center">
                <h2
                  className="text-2xl font-semibold leading-tight text-white drop-shadow-lg lg:text-3xl"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {slide.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-zinc-300 drop-shadow-md lg:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
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
