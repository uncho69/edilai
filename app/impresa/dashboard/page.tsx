"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

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

const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30";

function rangeTotale(r: AssegnazioneConRichiesta) {
  const arr = r.richiesta?.outputPerUtente?.rangeCostoPerMacroArea ?? [];
  if (!arr.length) return null;
  const [min, max] = arr.reduce(
    (acc, m) => [acc[0] + m.rangeCosto[0], acc[1] + m.rangeCosto[1]],
    [0, 0]
  );
  return { min, max };
}

function formatData(data: string) {
  try {
    const d = new Date(data);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return data;
  }
}

export default function DashboardImpresaPage() {
  const router = useRouter();
  const [impresa, setImpresa] = useState<Impresa | null>(null);
  const [impresaSelezionata, setImpresaSelezionata] = useState<string>("");
  const [richieste, setRichieste] = useState<AssegnazioneConRichiesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [authOk, setAuthOk] = useState(false);
  const [rispostaInvio, setRispostaInvio] = useState<Record<string, boolean>>({});

  // Verifica accesso: /api/imprese/me restituisce l'impresa legata all'email Clerk
  useEffect(() => {
    fetch("/api/imprese/me")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/impresa/login");
          return null;
        }
        if (r.status === 403) {
          return r.json().then((body) => {
            if (body?.code === "in_revisione") {
              router.replace("/impresa/in-revisione");
              return null;
            }
            router.replace("/impresa/login");
            return null;
          });
        }
        if (!r.ok) {
          router.replace("/impresa/login");
          return null;
        }
        return r.json();
      })
      .then((data: Impresa | null) => {
        if (!data) return;
        setImpresa(data);
        setImpresaSelezionata(data.id);
        setAuthOk(true);
      })
      .catch(() => router.replace("/impresa/login"));
  }, [router]);

  useEffect(() => {
    if (!authOk || !impresaSelezionata) return;
    setLoading(true);
    fetch(`/api/imprese/${impresaSelezionata}/richieste`)
      .then((r) => r.json())
      .then(setRichieste)
      .finally(() => setLoading(false));
  }, [authOk, impresaSelezionata]);

  const inviaRisposta = async (
    assegnazioneId: string,
    risposta: "accetta" | "rifiuta" | "sopralluogo"
  ) => {
    setRispostaInvio((s) => ({ ...s, [assegnazioneId]: true }));
    try {
      await fetch(`/api/assegnazioni/${assegnazioneId}/risposta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ risposta }),
      });
      setRichieste((prev) =>
        prev.map((r) =>
          r.id === assegnazioneId
            ? { ...r, risposta, rispostaAt: new Date().toISOString() }
            : r
        )
      );
    } finally {
      setRispostaInvio((s) => ({ ...s, [assegnazioneId]: false }));
    }
  };

  const daRispondere = richieste.filter((r) => !r.risposta);
  const risposte = richieste.filter((r) => r.risposta);

  if (!authOk && !impresa) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Dashboard
          </p>
          <h2
            className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Gestisci le richieste
          </h2>
          <p className="mt-2 text-zinc-500">
            {impresa ? (
              <>
                Accesso come <span className="font-medium text-zinc-400">{impresa.nome}</span>
              </>
            ) : (
              "Rispondi alle richieste ricevute."
            )}
          </p>
        </div>
        <SignOutButton signOutCallback={() => router.push("/impresa/login")}>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-300"
          >
            Esci
          </button>
        </SignOutButton>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
          <span className="text-zinc-500">Caricamento richieste...</span>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Totale richieste
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100" style={{ fontFamily: "var(--font-syne)" }}>
                {richieste.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 transition-colors hover:border-amber-500/50">
              <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                Da rispondere
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-200" style={{ fontFamily: "var(--font-syne)" }}>
                {daRispondere.length}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Risposte inviate
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100" style={{ fontFamily: "var(--font-syne)" }}>
                {risposte.length}
              </p>
            </div>
          </div>

          <section>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-200">
              Richieste ricevute
            </h3>
            {richieste.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
                <p className="text-zinc-500">Nessuna richiesta al momento.</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Le nuove richieste compatibili con la tua zona e categorie appariranno qui.
                </p>
                <Link
                  href="/impresa/registrati"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#E0B420] transition hover:text-amber-400"
                >
                  Registra la tua impresa
                  <span>→</span>
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-5">
                {richieste.map((a) => {
                  const r = a.richiesta;
                  const range = rangeTotale(a);
                  const hasRisposta = !!a.risposta;
                  return (
                    <li
                      key={a.id}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.15)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug text-zinc-100">
                            {r.descrizioneIniziale}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                            <span>📍 {r.localizzazione}</span>
                            {r.budgetMassimo != null && (
                              <span>Budget indicato: € {r.budgetMassimo.toLocaleString("it-IT")}</span>
                            )}
                            <span>{formatData(a.inviataAt)}</span>
                          </div>
                          {range && (
                            <p className="mt-2 text-sm font-medium text-amber-400/90">
                              Range stimato: € {range.min.toLocaleString("it-IT")} — €{" "}
                              {range.max.toLocaleString("it-IT")}
                            </p>
                          )}
                          {(r.outputPerUtente?.sottoLavorazioni?.length ?? 0) > 0 && (
                            <ul className="mt-3 list-inside list-disc text-sm text-zinc-400">
                              {(r.outputPerUtente?.sottoLavorazioni ?? []).slice(0, 4).map((s, i) => (
                                <li key={i}>{s.descrizione}</li>
                              ))}
                              {(r.outputPerUtente?.sottoLavorazioni?.length ?? 0) > 4 && (
                                <li className="text-zinc-500">
                                  +{(r.outputPerUtente?.sottoLavorazioni?.length ?? 0) - 4} altre
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                        <div className="shrink-0">
                          {hasRisposta ? (
                            <span
                              className={`inline-flex rounded-xl border px-4 py-2.5 text-sm font-medium ${
                                a.risposta === "accetta"
                                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                                  : a.risposta === "sopralluogo"
                                    ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                                    : "border-zinc-600 bg-zinc-800/50 text-zinc-400"
                              }`}
                            >
                              {a.risposta === "accetta"
                                ? "Interessato"
                                : a.risposta === "sopralluogo"
                                  ? "Sopralluogo richiesto"
                                  : "Rifiutato"}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => inviaRisposta(a.id, "accetta")}
                                disabled={!!rispostaInvio[a.id]}
                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                              >
                                Interessato
                              </button>
                              <button
                                type="button"
                                onClick={() => inviaRisposta(a.id, "sopralluogo")}
                                disabled={!!rispostaInvio[a.id]}
                                className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
                              >
                                Sopralluogo
                              </button>
                              <button
                                type="button"
                                onClick={() => inviaRisposta(a.id, "rifiuta")}
                                disabled={!!rispostaInvio[a.id]}
                                className="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-50"
                              >
                                Rifiuta
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
