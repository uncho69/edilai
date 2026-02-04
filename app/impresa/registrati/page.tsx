"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell, inputClass, labelClass, btnPrimaryClass, btnSecondaryClass, titleClass, subtitleClass } from "@/app/components/PageShell";
import { CATEGORIE_LABELS } from "@/lib/tassonomia";
import type { CategoriaIntervento } from "@/types";

const CATEGORIE_IDS = Object.keys(CATEGORIE_LABELS) as CategoriaIntervento[];

export default function RegistratiImpresaPage() {
  const [inviato, setInviato] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [localizzazione, setLocalizzazione] = useState("");
  const [raggioKm, setRaggioKm] = useState<string>("30");
  const [categorie, setCategorie] = useState<CategoriaIntervento[]>([]);

  const toggleCategoria = (cat: CategoriaIntervento) => {
    setCategorie((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo UI: niente backend
    setInviato(true);
  };

  if (inviato) {
    return (
      <PageShell backHref="/" backLabel="← Home">
        <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
          Richiesta inviata
        </h1>
        <p className={`mt-4 ${subtitleClass}`}>
          Grazie per esserti registrato. Quando il backend sarà attivo riceverai una email di conferma e potrai accedere all&apos;area impresa per vedere le richieste.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/impresa" className={btnPrimaryClass}>
            Vai all&apos;area impresa (demo)
          </Link>
          <Link href="/" className={btnSecondaryClass}>
            Torna alla home
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Registrati come impresa
      </h1>
      <p className={subtitleClass}>
        Compila il profilo per ricevere richieste di lavori nella tua zona. (Solo demo: i dati non vengono salvati.)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="nome" className={labelClass}>
            Nome o ragione sociale
          </label>
          <input
            id="nome"
            type="text"
            className={`mt-2 ${inputClass}`}
            placeholder="Es. Edil Rossi Srl"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`mt-2 ${inputClass}`}
            placeholder="contatto@impresa.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="localizzazione" className={labelClass}>
            Localizzazione (CAP o città)
          </label>
          <input
            id="localizzazione"
            type="text"
            className={`mt-2 ${inputClass}`}
            placeholder="Es. Roma, 00100"
            value={localizzazione}
            onChange={(e) => setLocalizzazione(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="raggio" className={labelClass}>
            Raggio di intervento (km)
          </label>
          <input
            id="raggio"
            type="number"
            min={5}
            max={200}
            className={`mt-2 ${inputClass}`}
            value={raggioKm}
            onChange={(e) => setRaggioKm(e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-500">Indica entro quanti km accetti lavori.</p>
        </div>

        <div>
          <span className={labelClass}>Categorie di lavoro che offri</span>
          <p className="mt-1 text-xs text-zinc-500">Seleziona almeno una categoria.</p>
          <div className="mt-3 flex flex-col gap-2">
            {CATEGORIE_IDS.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 transition hover:bg-zinc-900/50"
              >
                <input
                  type="checkbox"
                  checked={categorie.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-zinc-200">{CATEGORIE_LABELS[cat]}</span>
              </label>
            ))}
          </div>
          {categorie.length === 0 && (
            <p className="mt-2 text-xs text-amber-400/90">Seleziona almeno una categoria.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            className={btnPrimaryClass}
            disabled={categorie.length === 0}
          >
            Invia richiesta di registrazione
          </button>
          <Link href="/" className={btnSecondaryClass}>
            Annulla
          </Link>
        </div>
      </form>
    </PageShell>
  );
}
