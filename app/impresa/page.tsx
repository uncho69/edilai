"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PageShell,
  inputClass,
  cardClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

interface AssegnazioneConRichiesta {
  id: string;
  richiestaLavoriId: string;
  impresaId: string;
  inviataAt: string;
  risposta?: string;
  rispostaAt?: string;
  richiesta: {
    id: string;
    localizzazione: string;
    descrizioneIniziale: string;
    budgetMassimo?: number;
    outputPerUtente?: {
      sottoLavorazioni: { descrizione: string }[];
      rangeCostoPerMacroArea: { rangeCosto: [number, number]; etichetta: string }[];
      noteTecniche: string[];
    };
  };
}

interface Impresa {
  id: string;
  nome: string;
  email: string;
  localizzazione: string;
  raggioKm: number;
  categorieLavoro: string[];
  stato: string;
}

export default function ImpresaPage() {
  const [imprese, setImprese] = useState<Impresa[]>([]);
  const [impresaSelezionata, setImpresaSelezionata] = useState<string>("");
  const [richieste, setRichieste] = useState<AssegnazioneConRichiesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [rispostaInvio, setRispostaInvio] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/imprese")
      .then((r) => r.json())
      .then((list: Impresa[]) => {
        setImprese(list);
        if (list.length && !impresaSelezionata) setImpresaSelezionata(list[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!impresaSelezionata) return;
    setLoading(true);
    fetch(`/api/imprese/${impresaSelezionata}/richieste`)
      .then((r) => r.json())
      .then(setRichieste)
      .finally(() => setLoading(false));
  }, [impresaSelezionata]);

  const inviaRisposta = async (assegnazioneId: string, risposta: "accetta" | "rifiuta" | "sopralluogo") => {
    setRispostaInvio((s) => ({ ...s, [assegnazioneId]: true }));
    try {
      await fetch(`/api/assegnazioni/${assegnazioneId}/risposta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ risposta }),
      });
      setRichieste((prev) =>
        prev.map((r) =>
          r.id === assegnazioneId ? { ...r, risposta, rispostaAt: new Date().toISOString() } : r
        )
      );
    } finally {
      setRispostaInvio((s) => ({ ...s, [assegnazioneId]: false }));
    }
  };

  const rangeTotale = (r: AssegnazioneConRichiesta) => {
    const arr = r.richiesta?.outputPerUtente?.rangeCostoPerMacroArea ?? [];
    if (!arr.length) return null;
    const [min, max] = arr.reduce(
      (acc, m) => [acc[0] + m.rangeCosto[0], acc[1] + m.rangeCosto[1]],
      [0, 0]
    );
    return { min, max };
  };

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Area impresa
      </h1>
      <p className={subtitleClass}>
        Seleziona il tuo profilo e visualizza le richieste inviate.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Non hai un profilo?{" "}
        <Link href="/impresa/registrati" className="text-amber-400 hover:underline">
          Registrati
        </Link>
      </p>

      {imprese.length > 0 && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-zinc-400">Profilo impresa</label>
          <select
            className={inputClass}
            value={impresaSelezionata}
            onChange={(e) => setImpresaSelezionata(e.target.value)}
          >
            {imprese.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nome} — {i.localizzazione}
              </option>
            ))}
          </select>
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold tracking-tight text-zinc-200">
        Richieste ricevute
      </h2>
      {loading ? (
        <p className="mt-4 text-zinc-500">Caricamento...</p>
      ) : richieste.length === 0 ? (
        <p className="mt-4 text-zinc-500">Nessuna richiesta al momento.</p>
      ) : (
        <ul className="mt-4 space-y-5">
          {richieste.map((a) => {
            const r = a.richiesta;
            const range = rangeTotale(a);
            return (
              <li key={a.id} className={cardClass}>
                <p className="font-medium text-zinc-100">{r.descrizioneIniziale}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Localizzazione: {r.localizzazione}
                  {r.budgetMassimo != null && ` · Budget indicato: € ${r.budgetMassimo.toLocaleString("it-IT")}`}
                </p>
                {range && (
                  <p className="mt-1 text-sm text-amber-400/90">
                    Range stimato: € {range.min.toLocaleString("it-IT")} — € {range.max.toLocaleString("it-IT")}
                  </p>
                )}
                {(r.outputPerUtente?.sottoLavorazioni?.length ?? 0) > 0 && (
                  <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
                    {(r.outputPerUtente?.sottoLavorazioni ?? []).map((s, i) => (
                      <li key={i}>{s.descrizione}</li>
                    ))}
                  </ul>
                )}
                {a.risposta ? (
                  <p className="mt-3 text-sm font-medium text-zinc-400">
                    Hai risposto: {a.risposta === "accetta" ? "Interessato" : a.risposta === "sopralluogo" ? "Richiesta sopralluogo" : "Rifiutato"}
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => inviaRisposta(a.id, "accetta")}
                      disabled={!!rispostaInvio[a.id]}
                      className="rounded-xl bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Interessato
                    </button>
                    <button
                      type="button"
                      onClick={() => inviaRisposta(a.id, "sopralluogo")}
                      disabled={!!rispostaInvio[a.id]}
                      className={btnSecondaryClass + " py-2 text-sm"}
                    >
                      Richiedi sopralluogo
                    </button>
                    <button
                      type="button"
                      onClick={() => inviaRisposta(a.id, "rifiuta")}
                      disabled={!!rispostaInvio[a.id]}
                      className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-50"
                    >
                      Rifiuta
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
