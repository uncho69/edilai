"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDraft, setDraft } from "@/lib/draft";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

export default function NuovaRichiestaPage() {
  const router = useRouter();
  const [descrizione, setDescrizione] = useState("");
  const [localizzazione, setLocalizzazione] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [fotoNote, setFotoNote] = useState("");

  useEffect(() => {
    const d = getDraft();
    if (d) {
      setDescrizione(d.descrizioneIniziale ?? "");
      setLocalizzazione(d.localizzazione ?? "");
      setBudget(d.budgetMassimo ?? "");
      setFotoNote(d.fotoNote ?? "");
    }
  }, []);

  const handleAvvia = () => {
    setDraft({
      descrizioneIniziale: descrizione,
      localizzazione: localizzazione || "Non indicata",
      budgetMassimo: budget === "" ? undefined : Number(budget),
      fotoNote: fotoNote || undefined,
      startedAt: new Date().toISOString(),
      answers: {},
    });
    router.push("/cliente/nuova-richiesta/flow");
  };

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Nuova richiesta lavori
      </h1>
      <p className={subtitleClass}>
        Descrivi in libertà cosa vuoi fare. Poi ti faremo alcune domande per chiarire il quadro.
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAvvia();
        }}
      >
        <div>
          <label htmlFor="descrizione" className={labelClass}>
            Cosa vuoi fare?
          </label>
          <textarea
            id="descrizione"
            rows={5}
            className={`mt-2 ${inputClass}`}
            placeholder="Es: voglio rifare le pareti di questa stanza in rosso e cambiare il pavimento..."
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="foto" className={labelClass}>
            Foto (opzionale, max 3)
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Ambiente, pavimento, pareti. [MVP: upload non ancora implementato]
          </p>
          <input
            id="foto"
            type="text"
            className={`mt-2 ${inputClass} py-2 text-sm`}
            placeholder="Note per le foto..."
            value={fotoNote}
            onChange={(e) => setFotoNote(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="localizzazione" className={labelClass}>
            Localizzazione immobile (CAP o città)
          </label>
          <input
            id="localizzazione"
            type="text"
            className={`mt-2 ${inputClass}`}
            placeholder="Es. Roma, 00100"
            value={localizzazione}
            onChange={(e) => setLocalizzazione(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget massimo stimato (€)
          </label>
          <input
            id="budget"
            type="number"
            min={0}
            step={500}
            className={`mt-2 ${inputClass}`}
            placeholder="Es. 5000"
            value={budget === "" ? "" : budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="submit" className={btnPrimaryClass}>
            Avvia e rispondi alle domande
          </button>
          <Link href="/" className={btnSecondaryClass}>
            Annulla
          </Link>
        </div>
      </form>
    </PageShell>
  );
}
