/**
 * Fase 1 fondazione: base di conoscenza tecnica strutturata.
 * Tassonomia chiusa: categorie, sotto-lavorazioni, range di costo.
 * L'AI mappa il linguaggio naturale su questi codici, non inventa.
 */

import type { CategoriaIntervento, SottoLavorazione } from "@/types";

/** Etichette per le categorie (UI e AI) */
export const CATEGORIE_LABELS: Record<CategoriaIntervento, string> = {
  tinteggiatura: "Tinteggiatura / Pittura",
  pavimentazione: "Pavimentazione",
  bagno: "Ristrutturazione bagno",
  cucina: "Ristrutturazione cucina",
  impianti: "Impianti (elettrico, idraulico, ecc.)",
  infissi: "Infissi (serramenti, porte)",
  demolizione: "Demolizione / Sgombero",
  altro: "Altro",
};

/** Sotto-lavorazioni per categoria (esempi; espandere con dati reali) */
export const SOTTO_LAVORAZIONI: Partial<Record<CategoriaIntervento, SottoLavorazione[]>> = {
  tinteggiatura: [
    { codice: "TINT-1", descrizione: "Rasatura e stuccatura pareti", ordine: 1, rangeCosto: [8, 18] },
    { codice: "TINT-2", descrizione: "Tinteggiatura pareti (2 mani)", ordine: 2, rangeCosto: [12, 25] },
    { codice: "TINT-3", descrizione: "Tinteggiatura soffitto", ordine: 3, rangeCosto: [10, 22] },
  ],
  pavimentazione: [
    { codice: "PAV-1", descrizione: "Rimozione pavimento esistente", ordine: 1, rangeCosto: [8, 20] },
    { codice: "PAV-2", descrizione: "Pavimentazione ceramica", ordine: 2, rangeCosto: [35, 80] },
    { codice: "PAV-3", descrizione: "Pavimentazione laminato", ordine: 2, rangeCosto: [25, 55] },
  ],
  bagno: [
    { codice: "BAG-1", descrizione: "Demolizione e sgombero", ordine: 1, rangeCosto: [15, 40] },
    { codice: "BAG-2", descrizione: "Impianti bagno", ordine: 2, rangeCosto: [800, 2500] },
    { codice: "BAG-3", descrizione: "Rivestimenti e pavimento", ordine: 3, rangeCosto: [45, 90] },
  ],
  altro: [],
};

/** Range di costo per mq o per intervento (orientativo; da allineare al mercato) */
export function getRangePerCategoria(cat: CategoriaIntervento): [number, number] {
  const ranges: Partial<Record<CategoriaIntervento, [number, number]>> = {
    tinteggiatura: [15, 35],
    pavimentazione: [30, 90],
    bagno: [5000, 25000],
    cucina: [8000, 35000],
    impianti: [500, 5000],
    infissi: [300, 1500],
    demolizione: [10, 30],
    altro: [0, 0],
  };
  return ranges[cat] ?? [0, 0];
}
