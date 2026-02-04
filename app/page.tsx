import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0c0c] text-zinc-100">
      {/* Subtle gradient + noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <h1
          className="text-[2.75rem] font-extrabold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          EDILIA
        </h1>
        <p className="mt-4 max-w-md text-xl font-medium leading-relaxed text-zinc-200 sm:text-2xl">
          Trasformiamo quello che vuoi fare in una richiesta che le imprese capiscono.
        </p>
        <p className="mt-2 text-base text-zinc-500">
          Gratuito. In pochi minuti.
        </p>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          <Link
            href="/cliente/nuova-richiesta"
            className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Sei un cliente?
            </span>
            <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-400">
              Fai la tua richiesta
            </span>
            <span className="mt-2 text-sm leading-relaxed text-zinc-500">
              Descrivi cosa vuoi fare, completa il questionario e invia alle imprese.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber-400">
              Inizia
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>

          <Link
            href="/impresa/registrati"
            className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.25)]"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Sei un&apos;impresa?
            </span>
            <span className="mt-3 text-xl font-semibold tracking-tight text-zinc-100 transition group-hover:text-amber-400">
              Registrati
            </span>
            <span className="mt-2 text-sm leading-relaxed text-zinc-500">
              Crea il tuo profilo, indica zona e categorie, ricevi richieste compatibili.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber-400">
              Registrati
              <span className="transition group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>

        <p className="mt-14 text-xs text-zinc-600">
          Stima preliminare, non preventivo. Nessun pagamento o contratto nell&apos;MVP.
        </p>

        <Link
          href="/admin"
          className="mt-4 inline-block text-xs text-zinc-600 underline underline-offset-2 transition hover:text-zinc-500"
        >
          Admin
        </Link>
      </div>
    </main>
  );
}
