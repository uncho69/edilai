import { NextRequest, NextResponse } from "next/server";
import { setRispostaAssegnazione } from "@/lib/store";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: assegnazioneId } = await params;
  const body = await _request.json().catch(() => ({}));
  const { risposta } = body as { risposta?: string };

  if (!["accetta", "rifiuta", "sopralluogo"].includes(risposta ?? "")) {
    return NextResponse.json(
      { error: "risposta deve essere: accetta, rifiuta o sopralluogo" },
      { status: 400 }
    );
  }

  const a = setRispostaAssegnazione(assegnazioneId, risposta as "accetta" | "rifiuta" | "sopralluogo");
  if (!a) {
    return NextResponse.json({ error: "Assegnazione non trovata" }, { status: 404 });
  }
  return NextResponse.json(a);
}
