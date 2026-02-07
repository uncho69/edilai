import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getImprese, addImpresa, setDocumentiImpresa, getImpresaByEmail } from "@/lib/store";
import type { DocumentoCaricato } from "@/types/impresa";

const RAGGIO_MIN = 30;

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100) || "documento";
}

export async function GET() {
  const imprese = getImprese();
  return NextResponse.json(imprese);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nome = formData.get("nome") as string;
    const telefono = (formData.get("telefono") as string)?.trim() || undefined;
    const localizzazione = (formData.get("localizzazione") as string)?.trim();
    const raggioKm = Math.max(RAGGIO_MIN, parseInt(String(formData.get("raggioKm") || RAGGIO_MIN), 10) || RAGGIO_MIN);
    const categorieRaw = formData.get("categorieLavoro");
    const categorieLavoro: string[] = Array.isArray(categorieRaw)
      ? (categorieRaw as string[])
      : typeof categorieRaw === "string"
        ? (() => {
            try {
              return JSON.parse(categorieRaw) as string[];
            } catch {
              return categorieRaw ? [categorieRaw] : [];
            }
          })()
        : [];
    const numDipendenti = formData.get("numDipendenti");
    const numFiliali = formData.get("numFiliali");
    const tipoImpresa = formData.get("tipoImpresa") as "" | "piccola" | "media" | null;

    // Email: da sessione Clerk (flusso "completa profilo") o dal form (retrocompatibilità)
    const { userId } = await auth();
    let email: string | null = (formData.get("email") as string)?.trim() || null;
    if (userId && !email) {
      const user = await currentUser();
      email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;
    }
    if (!email) {
      return NextResponse.json(
        { error: "Devi essere registrato e aver effettuato l'accesso per creare un profilo impresa. Vai su Registrati come impresa e crea l'account, poi completa il profilo." },
        { status: 401 }
      );
    }

    if (!nome?.trim() || !localizzazione?.trim() || categorieLavoro.length === 0) {
      return NextResponse.json(
        { error: "Dati mancanti: nome, localizzazione e almeno una categoria richiesti." },
        { status: 400 }
      );
    }

    const esistente = getImpresaByEmail(email);
    if (esistente) {
      return NextResponse.json(
        { ok: true, alreadyExists: true, message: "Profilo già presente. Accedi al pannello con la password che hai appena scelto." },
        { status: 200 }
      );
    }

    const impresa = addImpresa({
      nome: nome.trim(),
      email,
      telefono,
      localizzazione: localizzazione.trim(),
      raggioKm,
      categorieLavoro,
      stato: "in_revisione",
      numDipendenti: numDipendenti != null && numDipendenti !== "" ? parseInt(String(numDipendenti), 10) : undefined,
      numFiliali: numFiliali != null && numFiliali !== "" ? parseInt(String(numFiliali), 10) : undefined,
      tipoImpresa: tipoImpresa === "piccola" || tipoImpresa === "media" ? tipoImpresa : undefined,
    });

    const files = formData.getAll("documenti") as File[];
    const documenti: DocumentoCaricato[] = [];

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "uploads", impresa.id);
      await mkdir(uploadDir, { recursive: true });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(file instanceof File) || !file.size) continue;
        const base = sanitizeFileName(file.name) || `doc-${i}`;
        const ext = path.extname(file.name) || "";
        const fileName = `${base}${ext}`;
        const filePath = path.join(uploadDir, fileName);
        const buf = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buf);
        documenti.push({ name: file.name, path: `uploads/${impresa.id}/${fileName}` });
      }

      if (documenti.length > 0) {
        setDocumentiImpresa(impresa.id, documenti);
      }
    }

    return NextResponse.json({ ...impresa, documenti: documenti.length > 0 ? documenti : impresa.documenti });
  } catch (e) {
    console.error("POST /api/imprese", e);
    return NextResponse.json({ error: "Errore durante la registrazione." }, { status: 500 });
  }
}
