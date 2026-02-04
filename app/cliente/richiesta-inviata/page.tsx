import Link from "next/link";
import { PageShell, titleClass, subtitleClass, btnPrimaryClass } from "@/app/components/PageShell";

export default function RichiestaInviataPage() {
  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Richiesta inviata
      </h1>
      <p className={`mt-4 ${subtitleClass}`}>
        La tua richiesta è stata inviata alle imprese della zona. Riceverai risposte (interesse, rifiuto o richiesta di sopralluogo) quando le imprese la esamineranno.
      </p>
      <Link href="/" className={`mt-8 inline-block ${btnPrimaryClass}`}>
        Torna alla home
      </Link>
    </PageShell>
  );
}
