"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PageShell,
  titleClass,
  subtitleClass,
  btnPrimaryClass,
  btnSecondaryClass,
} from "@/app/components/PageShell";

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

export default function ComeFunzionaPage() {
  const [ruolo, setRuolo] = useState<"cliente" | "impresa">("cliente");
  const steps = ruolo === "cliente" ? COME_FUNZIONA_CLIENTE_STEPS : COME_FUNZIONA_IMPRESA_STEPS;

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Come funziona
      </h1>
      <p className={subtitleClass}>
        Scegli se sei un cliente che cerca un&apos;impresa o un&apos;impresa che riceve richieste.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setRuolo("cliente")}
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            ruolo === "cliente"
              ? "border-[#E0B420] bg-[#E0B420]/10 text-[#E0B420]"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          Cliente
        </button>
        <button
          type="button"
          onClick={() => setRuolo("impresa")}
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            ruolo === "impresa"
              ? "border-[#E0B420] bg-[#E0B420]/10 text-[#E0B420]"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
          }`}
        >
          Impresa
        </button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E0B420]/20 text-xl font-semibold text-[#E0B420]">
              {i + 1}
            </span>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-zinc-100">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/cliente/nuova-richiesta" className={btnPrimaryClass}>
          Fai la tua richiesta (cliente)
        </Link>
        <Link href="/impresa/registrati" className={btnSecondaryClass}>
          Registrati (impresa)
        </Link>
        <Link href="/" className={btnSecondaryClass}>
          Torna alla home
        </Link>
      </div>
    </PageShell>
  );
}
