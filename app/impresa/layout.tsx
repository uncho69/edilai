"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
};

export default function ImpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegistrati = pathname === "/impresa/registrati";

  return (
    <div className="relative min-h-screen bg-[#0c0c0c] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={noiseStyle} />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-transparent to-transparent" />

      <header className="relative z-10 flex w-full items-center justify-between border-b border-zinc-800/50 bg-[#0c0c0c]/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            <span className="text-zinc-600">←</span>
            Home
          </Link>
          <span className="h-4 w-px bg-zinc-700" aria-hidden />
          <Link href="/impresa/dashboard" className="flex items-center gap-2">
            <Image
              src="/ed-logo.png"
              alt=""
              width={120}
              height={36}
              className="h-7 w-auto object-contain opacity-90"
            />
          </Link>
        </div>
        <h1
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold tracking-tight text-zinc-100"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {isRegistrati ? "Registrati come impresa" : "Pannello Impresa"}
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/impresa/dashboard"
            className="text-sm font-medium text-zinc-500 transition hover:text-[#E0B420]"
          >
            Dashboard
          </Link>
          <Link
            href="/impresa/registrati"
            className="text-sm font-medium text-[#E0B420] underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Registrati
          </Link>
        </div>
      </header>

      <div className="relative">{children}</div>
    </div>
  );
}
