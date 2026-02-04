"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDraft, setDraft } from "@/lib/draft";

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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/cliente" className="text-sm text-zinc-500 hover:underline">
          ← Area cliente
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Nuova richiesta lavori</h1>
        <p className="mt-2 text-zinc-600">
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
            <label htmlFor="descrizione" className="block text-sm font-medium text-zinc-700">
              Cosa vuoi fare?
            </label>
            <textarea
              id="descrizione"
              rows={5}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Es: voglio rifare le pareti di questa stanza in rosso e cambiare il pavimento..."
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-zinc-700">
              Foto (opzionale, max 3)
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Ambiente, pavimento, pareti. [MVP: upload non ancora implementato]
            </p>
            <input
              id="foto"
              type="text"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm"
              placeholder="Note per le foto..."
              value={fotoNote}
              onChange={(e) => setFotoNote(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="localizzazione" className="block text-sm font-medium text-zinc-700">
              Localizzazione immobile (CAP o città)
            </label>
            <input
              id="localizzazione"
              type="text"
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900"
              placeholder="Es. Roma, 00100"
              value={localizzazione}
              onChange={(e) => setLocalizzazione(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-zinc-700">
              Budget massimo stimato (€)
            </label>
            <input
              id="budget"
              type="number"
              min={0}
              step={500}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900"
              placeholder="Es. 5000"
              value={budget === "" ? "" : budget}
              onChange={(e) =>
                setBudget(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-800"
            >
              Avvia e rispondi alle domande
            </button>
            <Link
              href="/cliente"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Annulla
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
