"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Richiesta {
  id: string;
  userId: string;
  localizzazione: string;
  descrizioneIniziale: string;
  budgetMassimo?: number;
  datiIntervista?: unknown;
  outputAIGrezzo?: {
    categoriaIntervento: string[];
    sottoLavorazioni: { codice: string; descrizione: string; ordine: number; rangeCosto?: [number, number] }[];
    ordineLavori: string[];
    rangeCostoPerMacroArea: { etichetta: string; categoria: string; rangeCosto: [number, number]; sottoLavorazioni: unknown[] }[];
    noteTecniche: string[];
  };
  outputPerUtente?: unknown;
  stato: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export default function AdminRichiestaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [richiesta, setRichiesta] = useState<Richiesta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/richieste/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setRichiesta)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="min-h-screen bg-zinc-50 p-6"><p>Caricamento...</p></main>;
  if (!richiesta) return <main className="min-h-screen bg-zinc-50 p-6"><p>Richiesta non trovata.</p><Link href="/admin" className="text-blue-600 underline">Torna all&apos;admin</Link></main>;

  const out = richiesta.outputAIGrezzo;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/admin" className="text-sm text-zinc-500 hover:underline">
          ← Elenco richieste
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Richiesta {richiesta.id}</h1>
        <p className="mt-2 text-zinc-600">Output AI grezzo + dati inviati all&apos;utente.</p>

        <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-500">Dati base</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-zinc-500">Descrizione</dt><dd className="text-zinc-800">{richiesta.descrizioneIniziale}</dd></div>
            <div><dt className="text-zinc-500">Localizzazione</dt><dd className="text-zinc-800">{richiesta.localizzazione}</dd></div>
            <div><dt className="text-zinc-500">Budget max</dt><dd className="text-zinc-800">{richiesta.budgetMassimo != null ? `€ ${richiesta.budgetMassimo}` : "—"}</dd></div>
            <div><dt className="text-zinc-500">Stato</dt><dd className="text-zinc-800">{richiesta.stato}</dd></div>
            <div><dt className="text-zinc-500">Intervista</dt><dd className="text-zinc-800"><pre className="mt-1 overflow-auto rounded bg-zinc-100 p-2 text-xs">{JSON.stringify(richiesta.datiIntervista ?? {}, null, 2)}</pre></dd></div>
          </dl>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-medium text-zinc-500">Output AI grezzo (salvato a DB, correggibile)</h2>
          {out ? (
            <div className="mt-3 space-y-4 text-sm">
              <div>
                <span className="text-zinc-500">Categorie: </span>
                <span className="text-zinc-800">{out.categoriaIntervento?.join(", ") ?? "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500">Sotto-lavorazioni</span>
                <ul className="mt-1 list-inside list-disc text-zinc-800">
                  {out.sottoLavorazioni?.map((s) => (
                    <li key={s.codice}>{s.codice} — {s.descrizione} {s.rangeCosto && `(€ ${s.rangeCosto[0]}-${s.rangeCosto[1]})`}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-zinc-500">Ordine lavori</span>
                <p className="mt-1 text-zinc-800">{out.ordineLavori?.join(" → ") ?? "—"}</p>
              </div>
              <div>
                <span className="text-zinc-500">Range per macro-area</span>
                <ul className="mt-1 list-inside list-disc text-zinc-800">
                  {out.rangeCostoPerMacroArea?.map((m) => (
                    <li key={m.etichetta}>{m.etichetta}: € {m.rangeCosto[0]} — € {m.rangeCosto[1]}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-zinc-500">Note tecniche</span>
                <ul className="mt-1 list-inside list-disc text-zinc-800">
                  {out.noteTecniche?.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-zinc-500">JSON grezzo</summary>
                <pre className="mt-2 overflow-auto rounded bg-zinc-100 p-3 text-xs">{JSON.stringify(out, null, 2)}</pre>
              </details>
            </div>
          ) : (
            <p className="mt-3 text-zinc-500">Nessun output AI salvato.</p>
          )}
        </section>

        <p className="mt-6 text-xs text-zinc-400">
          Creata: {new Date(richiesta.createdAt).toLocaleString("it-IT")}
          {richiesta.completedAt && ` · Completata: ${new Date(richiesta.completedAt).toLocaleString("it-IT")}`}
        </p>
      </div>
    </main>
  );
}
