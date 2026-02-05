import { NextRequest, NextResponse } from "next/server";
import { getImpresaById } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const impresa = getImpresaById(id);
  if (!impresa) {
    return NextResponse.json({ error: "Impresa non trovata" }, { status: 404 });
  }
  return NextResponse.json(impresa);
}
