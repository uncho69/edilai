"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell, cardClass, titleClass, subtitleClass } from "@/app/components/PageShell";

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

interface Impresa {
  id: string;
  nome: string;
  email: string;
  localizzazione: string;
  stato: string;
  documenti?: { name: string; path: string }[];
  createdAt: string;
}

export default function AdminPage() {
  const [richieste, setRichieste] = useState<Richiesta[]>([]);
  const [impreseInRevisione, setImpreseInRevisione] = useState<Impresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvando, setApprovando] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/richieste").then((r) => r.json()),
      fetch("/api/imprese").then((r) => r.json()),
    ])
      .then(([richiesteData, impreseData]: [Richiesta[], Impresa[]]) => {
        setRichieste(richiesteData);
        setImpreseInRevisione(impreseData.filter((i) => i.stato === "in_revisione"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approva = async (id: string) => {
    setApprovando(id);
    try {
      const r = await fetch(`/api/imprese/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stato: "attiva" }),
      });
      if (r.ok) load();
    } finally {
      setApprovando(null);
    }
  };

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Admin
      </h1>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-200">
          Imprese in revisione
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Verifica documenti e dati, poi approva per dare accesso al pannello.
        </p>
        {loading ? (
          <p className="mt-4 text-zinc-500">Caricamento...</p>
        ) : impreseInRevisione.length === 0 ? (
          <p className="mt-4 text-zinc-500">Nessuna impresa in revisione.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {impreseInRevisione.map((i) => (
              <li
                key={i.id}
                className={`flex flex-wrap items-center justify-between gap-4 ${cardClass}`}
              >
                <div>
                  <p className="font-medium text-zinc-100">{i.nome}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {i.email} · {i.localizzazione}
                  </p>
                  {i.documenti && i.documenti.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-600">
                      Documenti: {i.documenti.map((d) => d.name).join(", ")}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-zinc-600">
                    {new Date(i.createdAt).toLocaleString("it-IT")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => approva(i.id)}
                  disabled={!!approvando}
                  className="shrink-0 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {approvando === i.id ? "..." : "Approva"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-200">
          Richieste clienti
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Tutte le richieste create. Clicca per vedere output e dettagli.
        </p>
        {loading ? (
          <p className="mt-4 text-zinc-500">Caricamento...</p>
        ) : richieste.length === 0 ? (
          <p className="mt-4 text-zinc-500">Nessuna richiesta ancora.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {richieste.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/richieste/${r.id}`}
                  className={`block ${cardClass} transition hover:border-zinc-700`}
                >
                  <p className="font-medium text-zinc-100 line-clamp-2">{r.descrizioneIniziale}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {r.localizzazione}
                    {r.budgetMassimo != null && ` · € ${r.budgetMassimo.toLocaleString("it-IT")}`}
                    {" · "}
                    {r.stato}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {new Date(r.createdAt).toLocaleString("it-IT")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
