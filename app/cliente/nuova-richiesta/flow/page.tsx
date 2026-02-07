"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDraft, setDraft } from "@/lib/draft";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
} from "@/app/components/PageShell";

const STEPS = [
  { id: "ambienti", title: "Quali ambienti sono coinvolti?", type: "text", placeholder: "Es. soggiorno, bagno, camera..." },
  { id: "metratura", title: "Metratura approssimativa (mq)?", type: "range", hint: "Indica un range, non serve precisione." },
  {
    id: "stato",
    title: "Stato attuale",
    type: "select",
    options: [
      { value: "nuovo", label: "Partire da zero (nuova costruzione)" },
      { value: "vecchio", label: "Ristrutturazione" },
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
    <PageShell backHref="/cliente/nuova-richiesta" backLabel="← Torna alla descrizione">
      <span className="text-sm text-zinc-500">
        Domanda {stepIndex + 1} di {STEPS.length}
      </span>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100" style={{ fontFamily: "var(--font-syne)" }}>
        {step.title}
      </h2>

      <div className="mt-6">
        {step.type === "text" && (
          <input
            type="text"
            className={inputClass}
            placeholder={step.placeholder}
            value={answers[step.id] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [step.id]: e.target.value }))}
          />
        )}
        {step.type === "select" && (
          <select
            className={inputClass}
            value={answers[step.id] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [step.id]: e.target.value }))}
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
                className={inputClass}
                value={answers[`${step.id}_min`] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [`${step.id}_min`]: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max mq"
                className={inputClass}
                value={answers[`${step.id}_max`] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [`${step.id}_max`]: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        {stepIndex > 0 && (
          <button type="button" onClick={handleBack} className={btnSecondaryClass}>
            Indietro
          </button>
        )}
        <button type="button" onClick={handleNext} className={btnPrimaryClass}>
          {isLast ? "Vedi riepilogo" : "Avanti"}
        </button>
      </div>
    </PageShell>
  );
}
