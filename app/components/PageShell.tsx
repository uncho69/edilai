import Link from "next/link";

const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
};

interface PageShellProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PageShell({ children, backHref, backLabel = "← Home", className = "" }: PageShellProps) {
  return (
    <main className={`relative min-h-screen overflow-hidden bg-[#0c0c0c] text-zinc-100 ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={noiseStyle} />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-2xl px-6 py-12 sm:py-16">
        {backHref && (
          <Link
            href={backHref}
            className="inline-block text-sm text-zinc-500 transition hover:text-zinc-400"
          >
            {backLabel}
          </Link>
        )}
        {children}
      </div>
    </main>
  );
}

/** Classi per input/select in tema dark (landing) */
export const inputClass =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30";
export const labelClass = "block text-sm font-medium text-zinc-400";
export const btnPrimaryClass =
  "rounded-xl bg-amber-500 px-6 py-3 font-medium text-zinc-900 transition hover:bg-amber-400 disabled:opacity-50";
export const btnSecondaryClass =
  "rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800";
export const cardClass = "rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6";
export const titleClass = "text-2xl font-semibold tracking-tight text-zinc-100";
export const subtitleClass = "mt-2 text-zinc-500";
