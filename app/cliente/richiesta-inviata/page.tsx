import Link from "next/link";

export default function RichiestaInviataPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Richiesta inviata</h1>
        <p className="mt-4 text-zinc-600">
          La tua richiesta è stata inviata alle imprese della zona. Riceverai risposte (interesse, rifiuto o richiesta di sopralluogo) quando le imprese la esamineranno.
        </p>
        <Link
          href="/cliente"
          className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
        >
          Torna all&apos;area cliente
        </Link>
      </div>
    </main>
  );
}
