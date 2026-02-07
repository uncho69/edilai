"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

const TIMEOUT_MS = 25000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms)
    ),
  ]);
}

export default function RegistratiImpresaPage() {
  const router = useRouter();
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [codice, setCodice] = useState("");
  const [step, setStep] = useState<"account" | "verifica">("account");
  const [errore, setErrore] = useState<string | null>(null);
  const [inInvio, setInInvio] = useState(false);

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    if (password.length < 8) {
      setErrore("La password deve avere almeno 8 caratteri.");
      return;
    }
    if (password !== confermaPassword) {
      setErrore("Le password non coincidono.");
      return;
    }
    if (!signUp) {
      setErrore("Sistema di accesso in caricamento. Attendi un attimo e riprova.");
      return;
    }

    setInInvio(true);
    try {
      await withTimeout(
        signUp.create({ emailAddress: email.trim(), password }),
        TIMEOUT_MS
      );
      await withTimeout(
        signUp.prepareEmailAddressVerification({ strategy: "email_code" }),
        TIMEOUT_MS
      );
      setStep("verifica");
    } catch (err: unknown) {
      const raw =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message?: string }[] }).errors?.map((e) => e.message).join(" ") || "Errore"
          : err instanceof Error ? err.message : "Errore durante la registrazione.";
      const msg = String(raw);
      if (msg === "TIMEOUT") {
        setErrore(
          "Tempo scaduto: Clerk non ha risposto. Verifica le chiavi in .env.local (da dashboard.clerk.com) e in Clerk Dashboard disattiva temporaneamente «Attack protection» per sviluppo, poi riavvia il server e riprova."
        );
      } else if (msg.toLowerCase().includes("data breach") || msg.toLowerCase().includes("online data breach")) {
        setErrore("Questa password è risultata in un elenco di password violate. Usa una password diversa e non usata su altri siti.");
      } else if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("identifier")) {
        setErrore("Un account con questa email esiste già. Accedi al pannello o recupera la password.");
      } else {
        setErrore(msg);
      }
    } finally {
      setInInvio(false);
    }
  };

  const handleSubmitVerifica = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    if (!signUp || !codice.trim()) {
      setErrore("Inserisci il codice che abbiamo inviato alla tua email.");
      return;
    }

    setInInvio(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: codice.trim() });
      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.push("/impresa/registrati/completa-profilo");
        return;
      }
      setErrore("Verifica non completata. Controlla il codice e riprova.");
    } catch (err: unknown) {
      const raw =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message?: string }[] }).errors?.map((e) => e.message).join(" ") || "Errore"
          : err instanceof Error ? err.message : "Codice non valido o scaduto.";
      setErrore(String(raw));
    } finally {
      setInInvio(false);
    }
  };

  if (step === "verifica") {
    return (
      <PageShell backHref="/" backLabel="← Home">
        <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
          Verifica la tua email
        </h1>
        <p className={subtitleClass}>
          Abbiamo inviato un codice a <strong className="text-zinc-300">{email}</strong>. Inseriscilo qui sotto per completare la registrazione.
        </p>

        <form onSubmit={handleSubmitVerifica} className="mt-8 max-w-md space-y-5">
          {errore && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {errore}
            </div>
          )}

          <div>
            <label htmlFor="codice" className={labelClass}>
              Codice di verifica
            </label>
            <input
              id="codice"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`mt-2 ${inputClass}`}
              placeholder="Es. 123456"
              value={codice}
              onChange={(e) => setCodice(e.target.value.replace(/\D/g, "").slice(0, 8))}
              required
            />
            <p className="mt-1 text-xs text-zinc-500">
              Controlla anche la cartella spam se non trovi l&apos;email.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button type="submit" className={btnPrimaryClass} disabled={inInvio}>
              {inInvio ? "Verifica in corso..." : "Verifica e continua"}
            </button>
            <button
              type="button"
              onClick={() => setStep("account")}
              className={btnSecondaryClass}
              disabled={inInvio}
            >
              Indietro
            </button>
          </div>
        </form>
      </PageShell>
    );
  }

  return (
    <PageShell backHref="/" backLabel="← Home">
      <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
        Registrati come impresa
      </h1>
      <p className={subtitleClass}>
        Step 1 — Crea il tuo account con email e password. Ti invieremo un codice per verificare l&apos;email; poi potrai completare il profilo impresa.
      </p>

      <form onSubmit={handleSubmitAccount} className="mt-8 max-w-md space-y-5">
        {/* Clerk bot protection: deve essere nel DOM e avere dimensioni (non sr-only) */}
        <div id="clerk-captcha" className="min-h-[40px] w-full" aria-hidden="true" />

        {errore && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errore}
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`mt-2 ${inputClass}`}
            placeholder="es. contatto@impresa.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={`mt-2 ${inputClass}`}
            placeholder="Almeno 8 caratteri"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Minimo 8 caratteri. Usa una password robusta e non riutilizzata su altri siti.
          </p>
        </div>

        <div>
          <label htmlFor="confermaPassword" className={labelClass}>Conferma password</label>
          <input
            id="confermaPassword"
            type="password"
            autoComplete="new-password"
            className={`mt-2 ${inputClass}`}
            placeholder="Ripeti la password"
            value={confermaPassword}
            onChange={(e) => setConfermaPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button type="submit" className={btnPrimaryClass} disabled={inInvio}>
            {inInvio ? "Invio codice in corso..." : "Crea account e invia codice"}
          </button>
          <Link href="/" className={btnSecondaryClass}>
            Annulla
          </Link>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-zinc-500">
        Hai già un account?{" "}
        <Link href="/impresa/login" className="font-medium text-amber-400 hover:text-amber-300">
          Accedi al pannello
        </Link>
      </p>
    </PageShell>
  );
}
