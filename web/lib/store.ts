/**
 * Store in-memory per test locale (nessun DB).
 * I dati si perdono al restart del server.
 */

import type { RichiestaLavori } from "@/types/request";
import type { ProfiloImpresa, AssegnazioneRichiesta } from "@/types/impresa";

const richieste: RichiestaLavori[] = [];
const imprese: ProfiloImpresa[] = [
  {
    id: "impresa-1",
    nome: "Edil Rossi",
    email: "rossi@edil.it",
    localizzazione: "Roma",
    raggioKm: 30,
    categorieLavoro: ["tinteggiatura", "pavimentazione", "bagno"],
    stato: "attiva",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "impresa-2",
    nome: "Ristrutturazioni Bianchi",
    email: "bianchi@ristrutturazioni.it",
    localizzazione: "Roma",
    raggioKm: 50,
    categorieLavoro: ["bagno", "cucina", "demolizione"],
    stato: "attiva",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
const assegnazioni: AssegnazioneRichiesta[] = [];

export function getRichieste(): RichiestaLavori[] {
  return [...richieste];
}

export function getRichiestaById(id: string): RichiestaLavori | undefined {
  return richieste.find((r) => r.id === id);
}

export function addRichiesta(r: Omit<RichiestaLavori, "id" | "createdAt" | "updatedAt">): RichiestaLavori {
  const id = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  const nuova: RichiestaLavori = {
    ...r,
    id,
    createdAt: now,
    updatedAt: now,
  };
  richieste.push(nuova);
  return nuova;
}

export function getImprese(): ProfiloImpresa[] {
  return [...imprese];
}

export function getImpresaById(id: string): ProfiloImpresa | undefined {
  return imprese.find((i) => i.id === id);
}

export function getAssegnazioni(): AssegnazioneRichiesta[] {
  return [...assegnazioni];
}

export function getAssegnazioniByImpresa(impresaId: string): AssegnazioneRichiesta[] {
  return assegnazioni.filter((a) => a.impresaId === impresaId);
}

export function addAssegnazione(richiestaLavoriId: string, impresaId: string): AssegnazioneRichiesta {
  const id = `ass-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  const a: AssegnazioneRichiesta = {
    id,
    richiestaLavoriId,
    impresaId,
    inviataAt: now,
  };
  assegnazioni.push(a);
  return a;
}

export function setRispostaAssegnazione(
  assegnazioneId: string,
  risposta: "accetta" | "rifiuta" | "sopralluogo"
): AssegnazioneRichiesta | undefined {
  const a = assegnazioni.find((x) => x.id === assegnazioneId);
  if (!a) return undefined;
  a.risposta = risposta;
  a.rispostaAt = new Date().toISOString();
  return a;
}
