"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDraft, setDraft } from "@/lib/draft";

/** Domande del flow guidato (hard-coded + in futuro AI). Step minimi per MVP. */
const STEPS = [
  {
    id: "ambienti",
    title: "Quali ambienti sono coinvolti?",
    type: "text",
    placeholder: "Es. soggiorno, bagno, camera...",
  },
  {
    id: "metratura",
    title: "Metratura approssimativa (mq)?",
    type: "range",
    hint: "Indica un range, non serve precisione.",
  },
  {
    id: "stato",
    title: "Stato attuale",
    type: "select",
    options: [
      { value: "nuovo", label: "Nuovo / da rifare da zero" },
      { value: "vecchio", label: "Vecchio, da rinnovare" },
      { value: "da_demolire", label: "Da demolire / sgomberare" },
    ],
  },
  {
    id: "finitura",
    title: "Livello di finitura desiderato",
    type: "select",
    options: [
      { value: "base", label: "Base (economico, funzionale)" },
      { value: "medio", label: "Medio" },
      { value: "alto", label: "Alto (premium)" },
    ],
  },
];

export default function FlowPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const d = getDraft();
    if (d?.answers) setAnswers(d.answers);
  }, []);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setDraft({ answers });
      window.location.href = "/cliente/nuova-richiesta/riepilogo";
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/cliente/nuova-richiesta"
          className="text-sm text-zinc-500 hover:underline"
        >
          ← Torna alla descrizione
        </Link>

        <div className="mt-6">
          <span className="text-sm text-zinc-500">
            Domanda {stepIndex + 1} di {STEPS.length}
          </span>
          <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>

          <div className="mt-6">
            {step.type === "text" && (
              <input
                type="text"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                placeholder={step.placeholder}
                value={answers[step.id] ?? ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [step.id]: e.target.value }))
                }
              />
            )}
            {step.type === "select" && (
              <select
                className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                value={answers[step.id] ?? ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [step.id]: e.target.value }))
                }
              >
                <option value="">Seleziona...</option>
                {step.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
            {step.type === "range" && (
              <div>
                <p className="text-sm text-zinc-500">{step.hint}</p>
                <div className="mt-2 flex gap-4">
                  <input
                    type="number"
                    placeholder="Min mq"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    value={answers[`${step.id}_min`] ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [`${step.id}_min`]: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max mq"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    value={answers[`${step.id}_max`] ?? ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [`${step.id}_max`]: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Indietro
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
            >
              {isLast ? "Vedi riepilogo" : "Avanti"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
