"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type ComeFunzionaRuolo = "cliente" | "impresa";

/** 3 step per Come funziona (layout a card orizzontali) */
const COME_FUNZIONA_CLIENTE_STEPS = [
  {
    title: "Cerca un'impresa adatta a te",
    desc: "Seleziona il servizio desiderato e compila un breve form o rispondi alle domande inerenti.",
  },
  {
    title: "Ricevi scheda e preventivo stimato",
    desc: "La tua richiesta viene strutturata in una scheda lavori e un range di costo. La inviamo alle imprese della tua zona.",
  },
  {
    title: "Scegli l'impresa",
    desc: "Ricevi le risposte (interessato, sopralluogo, ecc.) e contatta in autonomia l'impresa che preferisci.",
  },
];

const COME_FUNZIONA_IMPRESA_STEPS = [
  {
    title: "Registrati",
    desc: "Compila il profilo con zona, raggio e categorie di lavoro che offri.",
  },
  {
    title: "Ricevi le richieste",
    desc: "Le richieste compatibili con il tuo profilo arrivano nella tua area riservata, con scheda e budget.",
  },
  {
    title: "Rispondi e contatta",
    desc: "Interessato, richiedi sopralluogo o rifiuta. Contatta i clienti in autonomia.",
  },
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

  const scrollToComeFunziona = () => {
    document.getElementById("come-funziona")?.scrollIntoView({ behavior: "smooth" });
  };

  const noiseStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header globale */}
      <header className="flex w-full shrink-0 items-center justify-between border-b border-zinc-800/50 bg-[#0c0c0c] px-6 py-4 lg:absolute lg:left-0 lg:right-0 lg:z-20 lg:border-0 lg:bg-transparent">
        <div className="relative -ml-2 h-[2.5rem] w-auto sm:h-[3rem] sm:-ml-4">
          <Image
            src="/ed-logo.png"
            alt="Edilia"
            width={200}
            height={64}
            className="h-full w-auto object-contain object-left"
            priority
          />
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={scrollToComeFunziona}
            className="text-sm font-medium text-[#E0B420] underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Come funziona
          </button>
          <Link
            href="/impresa/login"
            className="text-sm font-medium text-[#E0B420] underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Sezione 1: Hero full-screen — BG = banner a tutta pagina, due card CENTRALI sopra (stile WeTransfer) */}
      <section className="relative min-h-screen w-full pt-0 lg:pt-16">
        {/* Background: banner a tutta larghezza (spazio ad/bg visibile ovunque) */}
        {BANNER_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === bannerIndex ? 1 : 0,
              zIndex: 0,
            }}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              role="presentation"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        {/* Contenuto centrale: slogan più in alto, stile Linear (pulito, sicuro, calmo) + modali */}
        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 pt-4 lg:min-h-[100vh] lg:justify-center">
          <div className="-mt-20 flex flex-col items-center lg:-mt-28">
            <p className="max-w-2xl text-center text-2xl font-semibold leading-snug text-white drop-shadow-md sm:text-3xl sm:leading-normal lg:text-4xl lg:tracking-tight xl:text-5xl" style={{ fontFamily: "var(--font-syne)" }}>
              Da te all&apos;impresa giusta<br className="hidden sm:block" />
              <span className="sm:ml-0">in pochi minuti.</span>
            </p>
            <p className="mt-5 text-center text-base font-medium tracking-wide text-white/95 sm:text-lg">
              Semplice. Gratuito.
            </p>

            {/* Due card centrali — modali: glass, accento amber, ombra e hover premium */}
            <div className="mx-auto mt-10 grid w-full max-w-md grid-cols-1 gap-4 sm:max-w-xl sm:grid-cols-2 sm:gap-6">
            <Link
              href="/cliente/nuova-richiesta"
              className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-white/25 bg-zinc-900/85 p-5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 sm:min-h-[200px] sm:p-6"
            >
              <span className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                Sei un cliente?
              </span>
              <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-300 sm:text-2xl">
                Fai la tua richiesta
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                Descrivi cosa vuoi fare, completa il questionario e invia alle imprese.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#E0B420] transition group-hover:gap-3">
                Inizia
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>

            <Link
              href="/impresa/registrati"
              className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-2xl border border-white/25 bg-zinc-900/85 p-5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 sm:min-h-[200px] sm:p-6"
            >
              <span className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                Sei un&apos;impresa?
              </span>
              <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-300 sm:text-2xl">
                Registrati
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                Crea il tuo profilo, indica zona e categorie, ricevi richieste compatibili.
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#E0B420] transition group-hover:gap-3">
                Registrati
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          </div>
          </div>

          {/* Freccia scroll in basso — Come funziona (stile WeTransfer, ben visibile) */}
          <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-2 lg:bottom-20">
            <button
              type="button"
              onClick={scrollToComeFunziona}
              className="flex flex-col items-center gap-1 text-white/70 transition hover:text-[#E0B420]"
              aria-label="Scorri a Come funziona"
            >
              <span className="text-xs font-medium uppercase tracking-[0.2em]">Come funziona</span>
              <svg className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Sezione 2: Footer a tutta pagina — Come funziona (primo scroll = questa sezione) */}
      <section
        id="come-funziona"
        className="relative flex min-h-screen flex-col justify-center border-t border-zinc-800/50 bg-[#0c0c0c] px-6 py-16 sm:py-20"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={noiseStyle} />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl" style={{ fontFamily: "var(--font-syne)" }}>
            Come funziona
          </h2>
          <p className="mt-2 text-center text-zinc-500 font-sans">
            Scegli se sei un cliente o un&apos;impresa.
          </p>

          <div className="mt-8 flex justify-center gap-2">
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

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(comeFunzionaRuolo === "cliente" ? COME_FUNZIONA_CLIENTE_STEPS : COME_FUNZIONA_IMPRESA_STEPS).map(
              (step, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-amber-500/30"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E0B420]/20 text-lg font-semibold text-[#E0B420]">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight text-zinc-100 font-sans">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 font-sans">
                    {step.desc}
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setAiutoOpen(true)}
              className="text-sm text-[#E0B420] underline underline-offset-2 transition hover:text-amber-400"
            >
              Hai bisogno di aiuto?
            </button>
          </div>
        </div>
      </section>

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
