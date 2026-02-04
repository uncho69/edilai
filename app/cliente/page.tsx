import Link from "next/link";
import { PageShell, cardClass, btnPrimaryClass, titleClass, subtitleClass } from "@/app/components/PageShell";

export default function ClientePage() {
  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Area cliente
      </h1>
      <p className={subtitleClass}>
        Accedi o registrati per avviare una nuova richiesta lavori.
      </p>

      <div className={`mt-8 border-amber-500/30 bg-amber-950/20 ${cardClass} p-4 text-sm text-amber-200`}>
        [MVP] Auth non ancora implementata. Per il flusso completo: login → localizzazione → nuova richiesta.
      </div>

      <Link
        href="/cliente/nuova-richiesta"
        className={`mt-6 inline-block ${btnPrimaryClass}`}
      >
        Avvia nuova richiesta (demo)
      </Link>
    </PageShell>
  );
}
