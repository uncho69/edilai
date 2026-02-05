"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setImpresaSession } from "@/lib/impresa-session";

interface Impresa {
  id: string;
  nome: string;
  localizzazione: string;
  stato: string;
}

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30";

export default function LoginImpresaPage() {
  const router = useRouter();
  const [imprese, setImprese] = useState<Impresa[]>([]);
  const [impresaId, setImpresaId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/imprese")
      .then((r) => r.json())
      .then((list: Impresa[]) => {
        const attive = list.filter((i) => i.stato === "attiva");
        setImprese(attive);
        if (attive.length) setImpresaId(attive[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAccedi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impresaId) return;
    setImpresaSession(impresaId);
    router.replace("/impresa/dashboard");
  };

  return (
    <div className="relative mx-auto max-w-md px-6 py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Accesso riservato
      </p>
      <h2
        className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100"
        style={{ fontFamily: "var(--font-syne)" }}
      >
        Accedi al pannello impresa
      </h2>
      <p className="mt-2 text-zinc-500">
        L&apos;accesso è riservato alle imprese che lavorano con noi. Se la tua richiesta di
        registrazione è stata accettata, seleziona il tuo profilo qui sotto.
      </p>

      {loading ? (
        <div className="mt-10 flex items-center gap-3 text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
          Caricamento...
        </div>
      ) : imprese.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <p className="font-medium text-zinc-300">
            Nessuna impresa abilitata al momento
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Il pannello è accessibile solo alle imprese che hanno stipulato accordi con noi.
            Se hai inviato una richiesta di registrazione, attendi l&apos;email di conferma
            oppure contatta l&apos;amministrazione.
          </p>
          <Link
            href="/impresa/registrati"
            className="mt-6 inline-block text-sm font-medium text-[#E0B420] hover:text-amber-400"
          >
            Registrati come impresa →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleAccedi} className="mt-10 space-y-6">
          <div>
            <label htmlFor="impresa" className="mb-2 block text-sm font-medium text-zinc-400">
              Seleziona la tua impresa
            </label>
            <select
              id="impresa"
              className={inputClass}
              value={impresaId}
              onChange={(e) => setImpresaId(e.target.value)}
              required
            >
              {imprese.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} — {i.localizzazione}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 px-6 py-3 font-medium text-zinc-900 transition hover:bg-amber-400"
          >
            Accedi al pannello
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-sm text-zinc-600">
        <Link href="/" className="hover:text-zinc-500">
          ← Torna alla home
        </Link>
      </p>
    </div>
  );
}
