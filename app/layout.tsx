import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import AssistenteVirtuale from "./components/AssistenteVirtuale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Edilia — Struttura la tua richiesta di lavori",
  description:
    "Descrivi cosa vuoi fare in parole tue. Ti guidiamo passo passo fino a una scheda lavori chiara e a un range di costo stimato.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="it">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} font-sans antialiased`}
        >
          {children}
          <AssistenteVirtuale />
        </body>
      </html>
    </ClerkProvider>
  );
}
