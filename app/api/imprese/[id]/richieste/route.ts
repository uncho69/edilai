import { NextRequest, NextResponse } from "next/server";
import { getAssegnazioniByImpresa, getRichiestaById } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: impresaId } = await params;
  const assegnazioni = getAssegnazioniByImpresa(impresaId);
  const richieste = assegnazioni.map((a) => {
    const r = getRichiestaById(a.richiestaLavoriId);
    return r ? { ...a, richiesta: r } : null;
  }).filter(Boolean);
  return NextResponse.json(richieste);
}
