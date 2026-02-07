"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDraft, clearDraft } from "@/lib/draft";
import type { OutputAIGrezzo, DatiIntervista } from "@/types";
import {
  PageShell,
  cardClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

export default function RiepilogoPage() {
  const router = useRouter();
  const [output, setOutput] = useState<OutputAIGrezzo | null>(null);
  const [draft, setDraftState] = useState<ReturnType<typeof getDraft>>(null);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    const d = getDraft();
    setDraftState(d);
    if (!d?.descrizioneIniziale) {
      router.replace("/cliente/nuova-richiesta");
      return;
    }
    fetch("/api/classifica", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descrizione: d.descrizioneIniziale }),
    })
      .then((res) => res.json())
      .then((data) => data.output && setOutput(data.output))
      .catch(() => setErrore("Impossibile generare il riepilogo."));
  }, [router]);

  const buildDatiIntervista = (): DatiIntervista | undefined => {
    if (!draft?.answers) return undefined;
    const a = draft.answers;
    const ambienti = (a.ambienti ?? "").split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    const min = a.metratura_min ? Number(a.metratura_min) : undefined;
    const max = a.metratura_max ? Number(a.metratura_max) : undefined;
    return {
      ambienti,
      metraturaRange: min != null || max != null ? { min: min ?? 0, max: max ?? 0 } : undefined,
      statoAttuale: (a.stato as DatiIntervista["statoAttuale"]) ?? "vecchio",
      livelloFinitura: (a.finitura as DatiIntervista["livelloFinitura"]) ?? "medio",
    };
  };

  const handleConfermaInvia = async () => {
    if (!draft || !output) return;
    if (!draft.email?.trim()) {
      setErrore("Inserisci la tua email nella pagina iniziale per inviare la richiesta.");
      return;
    }
    if (!draft.privacyConsent) {
      setErrore("È necessario acconsentire al trattamento dei dati per inviare la richiesta.");
      return;
    }
    setInvio(true);
    setErrore(null);
    try {
      const res = await fetch("/api/richieste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          email: draft.email.trim(),
          newsletterConsent: draft.newsletterConsent ?? false,
          localizzazione: draft.localizzazione || "Non indicata",
          descrizioneIniziale: draft.descrizioneIniziale,
          budgetMassimo: draft.budgetMassimo,
          fotoUrls: draft.photoUrls ?? [],
          datiIntervista: buildDatiIntervista(),
          outputAIGrezzo: output,
          startedAt: draft.startedAt,
        }),
      });
      if (!res.ok) throw new Error("Invio fallito");
      clearDraft();
      router.push("/cliente/richiesta-inviata");
    } catch {
      setErrore("Errore durante l'invio. Riprova.");
      setInvio(false);
    }
  };

  if (!draft) {
    return (
      <PageShell>
        <p className="text-zinc-500">Caricamento...</p>
      </PageShell>
    );
  }

  const displayOutput = output ?? {
    sottoLavorazioni: [],
    rangeCostoPerMacroArea: [],
    noteTecniche: ["Generazione in corso..."],
    categoriaIntervento: [],
    ordineLavori: [],
  };

  const rangeTotale = displayOutput.rangeCostoPerMacroArea?.length
    ? displayOutput.rangeCostoPerMacroArea.reduce(
        (acc, m) => [acc[0] + m.rangeCosto[0], acc[1] + m.rangeCosto[1]],
        [0, 0]
      )
    : [0, 0];

  return (
    <PageShell backHref="/cliente/nuova-richiesta/flow" backLabel="← Torna al questionario">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Riepilogo richiesta
      </h1>
      <p className={subtitleClass}>
        Controlla i dati prima di inviare alle imprese.
      </p>

      <div className={`mt-8 space-y-6 ${cardClass}`}>
        <section>
          <h2 className="text-sm font-medium text-zinc-500">La tua descrizione</h2>
          <p className="mt-2 text-zinc-200">{draft.descrizioneIniziale}</p>
          <p className="mt-1 text-xs text-zinc-500">Localizzazione: {draft.localizzazione}</p>
          {draft.email && <p className="mt-1 text-xs text-zinc-500">Email: {draft.email}</p>}
        </section>
        <section>
          <h2 className="text-sm font-medium text-zinc-500">Lavorazioni previste</h2>
          <ul className="mt-2 list-inside list-disc text-zinc-300">
            {displayOutput.sottoLavorazioni?.length
              ? displayOutput.sottoLavorazioni.map((s) => (
                  <li key={s.codice}>{s.descrizione}</li>
                ))
              : displayOutput.noteTecniche?.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </section>
        <section>
          <h2 className="text-sm font-medium text-zinc-500">Range di costo stimato</h2>
          <p className="mt-2 text-lg font-semibold text-amber-400">
            € {rangeTotale[0].toLocaleString("it-IT")} — € {rangeTotale[1].toLocaleString("it-IT")}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Per le macro-aree indicate</p>
        </section>
        <section>
          <h2 className="text-sm font-medium text-zinc-500">Note tecniche</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-zinc-400">
            {(displayOutput.noteTecniche ?? []).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200">
          <strong>Disclaimer:</strong> Questa è una stima preliminare, non un preventivo. I costi
          effettivi potranno essere definiti solo dopo un sopralluogo e una valutazione tecnica.
        </div>
      </div>

      {errore && (
        <div className="mt-4">
          <p className="text-sm text-amber-400">{errore}</p>
          {(!draft?.email?.trim() || !draft?.privacyConsent) && (
            <Link href="/cliente/nuova-richiesta" className="mt-2 inline-block text-sm text-[#E0B420] hover:underline">
              Torna alla pagina iniziale per inserire email e consensi →
            </Link>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleConfermaInvia}
          disabled={invio || !output}
          className={`${btnPrimaryClass}`}
        >
          {invio ? "Invio in corso..." : "Conferma e invia richiesta"}
        </button>
        <Link href="/cliente/nuova-richiesta/flow" className={btnSecondaryClass}>
          Torna indietro e modifica
        </Link>
      </div>
    </PageShell>
  );
}
