import Link from "next/link";
import { PageShell, titleClass, subtitleClass, btnSecondaryClass } from "@/app/components/PageShell";

export default function LoginPage() {
  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Login
      </h1>
      <p className={subtitleClass}>
        Area riservata a chi si è già registrato. (In costruzione: auth non ancora implementata.)
      </p>
      <Link href="/" className={`mt-6 inline-block ${btnSecondaryClass}`}>
        Torna alla home
      </Link>
    </PageShell>
  );
}
