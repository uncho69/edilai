"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { PageShell, titleClass, subtitleClass, btnSecondaryClass } from "@/app/components/PageShell";

export default function InRevisionePage() {
  return (
    <PageShell backHref="/impresa/dashboard" backLabel="← Pannello">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Profilo in revisione
      </h1>
      <p className={`mt-4 ${subtitleClass}`}>
        Stiamo verificando i documenti e i dati della tua impresa. Quando avrai il via libera potrai accedere al pannello e vedere le richieste di lavori. Ti avviseremo.
      </p>
      <p className="mt-4 text-zinc-500">
        Per domande: supporto@edilia.it
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <SignOutButton>
          <button className={btnSecondaryClass}>
            Esci
          </button>
        </SignOutButton>
        <Link href="/" className={btnSecondaryClass}>
          Torna alla home
        </Link>
      </div>
    </PageShell>
  );
}
