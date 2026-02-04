import { NextResponse } from "next/server";
import { getImprese } from "@/lib/store";

export async function GET() {
  const imprese = getImprese();
  return NextResponse.json(imprese);
}
