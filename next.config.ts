import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Root per Turbopack (evita warning con più lockfile in altre cartelle) */
  turbopack: { root: process.cwd() },
};

export default nextConfig;
