import { NextRequest, NextResponse } from "next/server";
import {
  getRichieste,
  addRichiesta,
  getImprese,
  addAssegnazione,
} from "@/lib/store";
import type { DatiIntervista, OutputAIGrezzo } from "@/types";

export async function GET() {
  const richieste = getRichieste();
  return NextResponse.json(richieste);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "demo-user",
      email,
      newsletterConsent,
      localizzazione,
      descrizioneIniziale,
      budgetMassimo,
      fotoUrls,
      datiIntervista,
      outputAIGrezzo,
      startedAt,
    } = body as {
      userId?: string;
      email?: string;
      newsletterConsent?: boolean;
      localizzazione: string;
      descrizioneIniziale: string;
      budgetMassimo?: number;
      fotoUrls?: string[];
      datiIntervista?: DatiIntervista;
      outputAIGrezzo?: OutputAIGrezzo;
      startedAt?: string;
    };

    if (!localizzazione || !descrizioneIniziale) {
      return NextResponse.json(
        { error: "localizzazione e descrizioneIniziale richiesti" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const richiesta = addRichiesta({
      userId,
      email: email?.trim() || undefined,
      newsletterConsent: newsletterConsent ?? false,
      localizzazione: localizzazione || "Non indicata",
      descrizioneIniziale,
      budgetMassimo,
      fotoUrls: fotoUrls?.length ? fotoUrls : undefined,
      datiIntervista,
      outputAIGrezzo: outputAIGrezzo ?? undefined,
      outputPerUtente: outputAIGrezzo ?? undefined,
      stato: "inviata",
      startedAt: startedAt ?? now,
      completedAt: now,
    });

    // Auto-assegna a tutte le imprese attive (per test)
    const impreseAttive = getImprese().filter((i) => i.stato === "attiva");
    for (const impresa of impreseAttive) {
      addAssegnazione(richiesta.id, impresa.id);
    }

    return NextResponse.json(richiesta);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Errore creazione richiesta" }, { status: 500 });
  }
}
