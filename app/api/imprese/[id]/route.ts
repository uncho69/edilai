import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getImpresaById, getImpresaByEmail, setStatoImpresa } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "me") {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email non disponibile" }, { status: 400 });
    }
    const impresa = getImpresaByEmail(email);
    if (!impresa) {
      return NextResponse.json({ error: "Nessun profilo impresa associato a questo account." }, { status: 404 });
    }
    if (impresa.stato === "in_revisione") {
      return NextResponse.json(
        { code: "in_revisione", message: "Profilo in revisione.", impresa },
        { status: 403 }
      );
    }
    return NextResponse.json(impresa);
  }

  const impresa = getImpresaById(id);
  if (!impresa) {
    return NextResponse.json({ error: "Impresa non trovata" }, { status: 404 });
  }
  return NextResponse.json(impresa);
}

/** PATCH: aggiorna stato (admin – approva impresa in revisione) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (id === "me") {
    return NextResponse.json({ error: "Usa PATCH su un id impresa specifico." }, { status: 400 });
  }
  const body = await request.json().catch(() => ({}));
  const nuovoStato = body.stato as string | undefined;
  if (nuovoStato !== "attiva" && nuovoStato !== "sospesa" && nuovoStato !== "in_revisione") {
    return NextResponse.json({ error: "stato non valido (attiva | sospesa | in_revisione)" }, { status: 400 });
  }
  const updated = setStatoImpresa(id, nuovoStato as "attiva" | "sospesa" | "in_revisione");
  if (!updated) {
    return NextResponse.json({ error: "Impresa non trovata" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
