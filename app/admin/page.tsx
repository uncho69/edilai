"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Richiesta {
  id: string;
  userId: string;
  localizzazione: string;
  descrizioneIniziale: string;
  budgetMassimo?: number;
  stato: string;
  createdAt: string;
  completedAt?: string;
}

export default function AdminPage() {
  const [richieste, setRichieste] = useState<Richiesta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/richieste")
      .then((r) => r.json())
      .then(setRichieste)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Admin — Richieste</h1>
        <p className="mt-2 text-zinc-600">
          Tutte le richieste create. Clicca per vedere output AI e dettagli.
        </p>

        {loading ? (
          <p className="mt-6 text-zinc-500">Caricamento...</p>
        ) : richieste.length === 0 ? (
          <p className="mt-6 text-zinc-500">Nessuna richiesta ancora.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {richieste.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/richieste/${r.id}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-4 transition hover:bg-zinc-50"
                >
                  <p className="font-medium text-zinc-800 line-clamp-2">{r.descrizioneIniziale}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {r.localizzazione}
                    {r.budgetMassimo != null && ` · € ${r.budgetMassimo.toLocaleString("it-IT")}`}
                    {" · "}
                    {r.stato}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(r.createdAt).toLocaleString("it-IT")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
