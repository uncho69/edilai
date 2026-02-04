import { NextRequest, NextResponse } from "next/server";
import { getRichiestaById } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const richiesta = getRichiestaById(id);
  if (!richiesta) {
    return NextResponse.json({ error: "Richiesta non trovata" }, { status: 404 });
  }
  return NextResponse.json(richiesta);
}
