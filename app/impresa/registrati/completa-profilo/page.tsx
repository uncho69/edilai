"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

const CATEGORIE_IMPRESA = [
  { id: "ristrutturazioni_interne", label: "Ristrutturazioni interne" },
  { id: "ristrutturazioni_esterne", label: "Ristrutturazioni esterne" },
  { id: "nuove_costruzioni", label: "Nuove costruzioni" },
  { id: "idraulica", label: "Idraulica" },
  { id: "elettricistica", label: "Elettricistica" },
] as const;

const RAGGIO_MIN = 30;

export default function CompletaProfiloImpresaPage() {
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [inInvio, setInInvio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [localizzazione, setLocalizzazione] = useState("");
  const [raggioKm, setRaggioKm] = useState(String(RAGGIO_MIN));
  const [categorie, setCategorie] = useState<string[]>([]);
  const [documenti, setDocumenti] = useState<File[]>([]);
  const [numDipendenti, setNumDipendenti] = useState("");
  const [numFiliali, setNumFiliali] = useState("");
  const [tipoImpresa, setTipoImpresa] = useState<"piccola" | "media" | "">("");

  const toggleCategoria = (id: string) => {
    setCategorie((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setDocumenti((prev) => [...prev, ...Array.from(files)].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDoc = (i: number) => {
    setDocumenti((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    setInInvio(true);

    const formData = new FormData();
    formData.set("nome", nome);
    if (telefono) formData.set("telefono", telefono);
    formData.set("localizzazione", localizzazione);
    formData.set("raggioKm", String(Math.max(RAGGIO_MIN, parseInt(raggioKm, 10) || RAGGIO_MIN)));
    formData.set("categorieLavoro", JSON.stringify(categorie));
    if (numDipendenti) formData.set("numDipendenti", numDipendenti);
    if (numFiliali) formData.set("numFiliali", numFiliali);
    if (tipoImpresa) formData.set("tipoImpresa", tipoImpresa);
    documenti.forEach((f) => formData.append("documenti", f));

    const res = await fetch("/api/imprese", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setErrore(data?.error || "Errore durante il salvataggio del profilo.");
      setInInvio(false);
      return;
    }
    if (data.alreadyExists) {
      setInviato(true);
      setInInvio(false);
      return;
    }
    setInviato(true);
    setInInvio(false);
  };

  if (inviato) {
    return (
      <PageShell backHref="/impresa/dashboard" backLabel="← Pannello">
        <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
          Registrazione completata
        </h1>
        <p className={`mt-4 ${subtitleClass}`}>
          Il tuo profilo è in revisione: verificheremo i documenti e ti avviseremo quando avrai il via libera per accedere al pannello richieste. Puoi già accedere con email e password per vedere lo stato.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/impresa/dashboard" className={btnPrimaryClass}>
            Accedi al pannello
          </Link>
          <Link href="/" className={btnSecondaryClass}>
            Torna alla home
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell backHref="/impresa/registrati" backLabel="← Indietro">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Completa il profilo impresa
      </h1>
      <p className={subtitleClass}>
        Step 2 — Inserisci i dati della tua impresa e carica i documenti. Il profilo sarà in revisione fino al via libera.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {errore && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errore}
          </div>
        )}

        <div>
          <label htmlFor="nome" className={labelClass}>Nome o ragione sociale</label>
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
          <label htmlFor="telefono" className={labelClass}>Telefono</label>
          <input
            id="telefono"
            type="tel"
            className={`mt-2 ${inputClass}`}
            placeholder="Es. +39 06 1234567"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="localizzazione" className={labelClass}>Localizzazione (CAP o città)</label>
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
          <label htmlFor="raggio" className={labelClass}>Raggio di intervento (km)</label>
          <input
            id="raggio"
            type="number"
            min={RAGGIO_MIN}
            max={200}
            className={`mt-2 ${inputClass}`}
            value={raggioKm}
            onChange={(e) => setRaggioKm(e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-500">Minimo {RAGGIO_MIN} km.</p>
        </div>

        <div>
          <span className={labelClass}>Categorie di lavoro che offri</span>
          <p className="mt-1 text-xs text-zinc-500">Seleziona almeno una categoria.</p>
          <div className="mt-3 flex flex-col gap-2">
            {CATEGORIE_IMPRESA.map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 transition hover:bg-zinc-900/50"
              >
                <input
                  type="checkbox"
                  checked={categorie.includes(cat.id)}
                  onChange={() => toggleCategoria(cat.id)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500/50"
                />
                <span className="text-sm text-zinc-200">{cat.label}</span>
              </label>
            ))}
          </div>
          {categorie.length === 0 && (
            <p className="mt-2 text-xs text-amber-400/90">Seleziona almeno una categoria.</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Documentazione</label>
          <p className="mt-1 text-xs text-zinc-500">
            Carica documenti (P.IVA, certificazioni, ecc.). Servono per verificare l&apos;affidabilità dell&apos;impresa.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-4 file:py-2 file:text-amber-200"
            onChange={handleDocChange}
            accept=".pdf,.doc,.docx,image/*"
          />
          {documenti.length > 0 && (
            <ul className="mt-2 space-y-1">
              {documenti.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm text-zinc-400">
                  <span>{f.name}</span>
                  <button type="button" onClick={() => removeDoc(i)} className="text-amber-400 hover:underline">
                    Rimuovi
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="dipendenti" className={labelClass}>Numero dipendenti</label>
          <input
            id="dipendenti"
            type="number"
            min={0}
            className={`mt-2 ${inputClass}`}
            placeholder="Es. 5"
            value={numDipendenti}
            onChange={(e) => setNumDipendenti(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="filiali" className={labelClass}>Numero filiali / sedi</label>
          <input
            id="filiali"
            type="number"
            min={0}
            className={`mt-2 ${inputClass}`}
            placeholder="Es. 1"
            value={numFiliali}
            onChange={(e) => setNumFiliali(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="tipoImpresa" className={labelClass}>Classificazione impresa</label>
          <select
            id="tipoImpresa"
            className={`mt-2 ${inputClass}`}
            value={tipoImpresa}
            onChange={(e) => setTipoImpresa(e.target.value as "piccola" | "media" | "")}
          >
            <option value="">Seleziona...</option>
            <option value="piccola">Piccola impresa</option>
            <option value="media">Media impresa</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/impresa/registrati" className={btnSecondaryClass}>
            Indietro
          </Link>
          <button type="submit" className={btnPrimaryClass} disabled={inInvio || categorie.length === 0}>
            {inInvio ? "Salvataggio..." : "Completa profilo"}
          </button>
        </div>
      </form>
    </PageShell>
  );
}
