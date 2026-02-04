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
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Admin — Richieste
      </h1>
      <p className={subtitleClass}>
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
    </PageShell>
  );
}
