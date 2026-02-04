import Link from "next/link";

export default function ClientePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold">Area cliente</h1>
        <p className="mt-2 text-zinc-600">
          Accedi o registrati per avviare una nuova richiesta lavori.
        </p>

        {/* TODO: auth (email+password o magic link) */}
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          [MVP] Auth non ancora implementata. Per il flusso completo: login → localizzazione → nuova richiesta.
        </div>

        <Link
          href="/cliente/nuova-richiesta"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-800"
        >
          Avvia nuova richiesta (demo)
        </Link>
      </div>
    </main>
  );
}
