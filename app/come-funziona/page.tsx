import Link from "next/link";
import { PageShell, titleClass, subtitleClass, btnSecondaryClass } from "@/app/components/PageShell";

export default function ComeFunzionaPage() {
  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Come funziona
      </h1>
      <p className={subtitleClass}>
        Contenuto in arrivo.
      </p>
      <Link href="/" className={`mt-6 inline-block ${btnSecondaryClass}`}>
        Torna alla home
      </Link>
    </PageShell>
  );
}
