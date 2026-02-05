"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDraft, setDraft } from "@/lib/draft";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

const MAX_FOTO = 3;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Lettura file fallita"));
    r.readAsDataURL(file);
  });
}

export default function NuovaRichiestaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [descrizione, setDescrizione] = useState("");
  const [localizzazione, setLocalizzazione] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [fotoNote, setFotoNote] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const d = getDraft();
    if (d) {
      setDescrizione(d.descrizioneIniziale ?? "");
      setLocalizzazione(d.localizzazione ?? "");
      setBudget(d.budgetMassimo ?? "");
      setFotoNote(d.fotoNote ?? "");
      setPhotoUrls(d.photoUrls ?? []);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const toAdd = Math.min(files.length, MAX_FOTO - photoUrls.length);
    if (toAdd <= 0) return;
    const next: string[] = [...photoUrls];
    for (let i = 0; i < toAdd; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await fileToDataUrl(file);
        next.push(dataUrl);
        if (next.length >= MAX_FOTO) break;
      } catch {
        // skip file on error
      }
    }
    setPhotoUrls(next.slice(0, MAX_FOTO));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAvvia = () => {
    setDraft({
      descrizioneIniziale: descrizione,
      localizzazione: localizzazione || "Non indicata",
      budgetMassimo: budget === "" ? undefined : Number(budget),
      fotoNote: fotoNote || undefined,
      photoUrls: photoUrls.length ? photoUrls : undefined,
      startedAt: new Date().toISOString(),
      answers: {},
    });
    router.push("/cliente/nuova-richiesta/flow");
  };

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Nuova richiesta lavori
      </h1>
      <p className={subtitleClass}>
        Descrivi in libertà cosa vuoi fare. Poi ti faremo alcune domande per chiarire il quadro.
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAvvia();
        }}
      >
        <div>
          <label htmlFor="descrizione" className={labelClass}>
            Cosa vuoi fare?
          </label>
          <textarea
            id="descrizione"
            rows={5}
            className={`mt-2 ${inputClass}`}
            placeholder="Es: voglio rifare le pareti di questa stanza in rosso e cambiare il pavimento..."
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="foto" className={labelClass}>
            Foto (opzionale, max 3)
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Ambiente, pavimento, pareti. Formati: JPG, PNG.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <input
              ref={fileInputRef}
              id="foto"
              type="file"
              accept="image/*"
              multiple
              className="absolute h-0 w-0 overflow-hidden opacity-0"
              onChange={handleFileChange}
              aria-label="Carica foto"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border-0 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-200 outline-none hover:bg-amber-500/30"
            >
              Scegli file
            </button>
            <span className="text-sm text-zinc-400">
              {photoUrls.length > 0
                ? photoUrls.length === 1
                  ? "1 foto selezionata"
                  : `${photoUrls.length} foto selezionate`
                : "Nessun file selezionato"}
            </span>
          </div>
          {photoUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {photoUrls.map((url, i) => (
                <div key={i} className="relative">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-600 bg-zinc-800">
                    <Image
                      src={url}
                      alt={`Anteprima ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-500"
                    aria-label="Rimuovi foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <label htmlFor="fotoNote" className="mt-3 block text-xs text-zinc-500">
            Note per le foto (opzionale)
          </label>
          <input
            id="fotoNote"
            type="text"
            className={`mt-1 ${inputClass} py-2 text-sm`}
            placeholder="Note per le foto..."
            value={fotoNote}
            onChange={(e) => setFotoNote(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="localizzazione" className={labelClass}>
            Localizzazione immobile (CAP o città)
          </label>
          <input
            id="localizzazione"
            type="text"
            className={`mt-2 ${inputClass}`}
            placeholder="Es. Roma, 00100"
            value={localizzazione}
            onChange={(e) => setLocalizzazione(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Budget massimo stimato (€)
          </label>
          <input
            id="budget"
            type="number"
            min={0}
            step={500}
            className={`mt-2 ${inputClass}`}
            placeholder="Es. 5000"
            value={budget === "" ? "" : budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button type="submit" className={btnPrimaryClass}>
            Avvia e rispondi alle domande
          </button>
          <Link href="/" className={btnSecondaryClass}>
            Annulla
          </Link>
        </div>
      </form>
    </PageShell>
  );
}
