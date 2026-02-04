import { NextRequest, NextResponse } from "next/server";
import type { OutputAIGrezzo } from "@/types";
import { CATEGORIE_LABELS, SOTTO_LAVORAZIONI, getRangePerCategoria } from "@/lib/tassonomia";
import type { CategoriaIntervento } from "@/types";

/**
 * API per classificazione richiesta e produzione output AI (struttura JSON).
 * MVP: risposta mock basata su tassonomia. In produzione: chiamata LLM vincolata
 * a categorie/sotto-lavorazioni chiuse + estrazione structured output.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { descrizione = "" } = body as { descrizione?: string };

    // TODO: chiamata a LLM con prompt che:
    // - mappa descrizione su CategoriaIntervento[] e SottoLavorazione[]
    // - restituisce solo codici dalla tassonomia (no invenzioni)
    // Per ora: euristica semplice su parole chiave
    const categorie = inferCategorie(descrizione);
    const rangeCostoPerMacroArea = categorie.map((cat) => ({
      etichetta: CATEGORIE_LABELS[cat],
      categoria: cat,
      rangeCosto: getRangePerCategoria(cat),
      sottoLavorazioni: SOTTO_LAVORAZIONI[cat] ?? [],
    }));

    const sottoLavorazioni = categorie.flatMap(
      (cat) => SOTTO_LAVORAZIONI[cat] ?? []
    );
    const ordineLavori = sottoLavorazioni
      .sort((a, b) => a.ordine - b.ordine)
      .map((s) => s.codice);

    const output: OutputAIGrezzo = {
      categoriaIntervento: categorie,
      sottoLavorazioni,
      ordineLavori,
      rangeCostoPerMacroArea,
      noteTecniche: ["Stima preliminare. Potrebbe richiedere sopralluogo."],
    };

    return NextResponse.json({ success: true, output });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Classificazione non disponibile" },
      { status: 500 }
    );
  }
}

/** Euristica semplice: in produzione sostituire con LLM + structured output. */
function inferCategorie(descrizione: string): CategoriaIntervento[] {
  const t = descrizione.toLowerCase();
  const out: CategoriaIntervento[] = [];
  if (/\b(pareti|tinteggiat|pittur|pitturare|colore)\b/.test(t)) out.push("tinteggiatura");
  if (/\b(paviment|pavimento|pavimenti|ceramica|laminato)\b/.test(t)) out.push("pavimentazione");
  if (/\b(bagno|bagni)\b/.test(t)) out.push("bagno");
  if (/\b(cucina)\b/.test(t)) out.push("cucina");
  if (/\b(demolir|sgomber|rimuover)\b/.test(t)) out.push("demolizione");
  if (out.length === 0) out.push("altro");
  return [...new Set(out)];
}
