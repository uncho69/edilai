"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { EmailCodeFactor } from "@clerk/types";
import {
  PageShell,
  inputClass,
  labelClass,
  btnPrimaryClass,
  btnSecondaryClass,
  titleClass,
  subtitleClass,
} from "@/app/components/PageShell";

export default function LoginImpresaPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codice, setCodice] = useState("");
  const [step, setStep] = useState<"credenziali" | "codice">("credenziali");
  const [errore, setErrore] = useState<string | null>(null);
  const [inInvio, setInInvio] = useState(false);

  // Se sei già loggato, vai direttamente alla dashboard (evita "session already exists")
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/impresa/dashboard");
    }
  }, [isSignedIn, router]);

  const handleSubmitCredenziali = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    if (!signIn) {
      setErrore("Sistema di accesso in caricamento. Attendi e riprova.");
      return;
    }

    setInInvio(true);
    try {
      const attempt = await signIn.create({ identifier: email.trim(), password });
      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.push("/impresa/dashboard");
        return;
      }
      if (attempt.status === "needs_second_factor") {
        const emailCodeFactor = attempt.supportedSecondFactors?.find(
          (f): f is EmailCodeFactor => f.strategy === "email_code"
        );
        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setStep("codice");
        } else {
          setErrore("Questo account richiede un secondo fattore non supportato qui. Contatta il supporto.");
        }
      } else {
        setErrore("Accesso non completato. Riprova.");
      }
    } catch (err: unknown) {
      const raw =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message?: string }[] }).errors?.map((e) => e.message).join(" ") || "Errore"
          : err instanceof Error ? err.message : "Email o password non corretti.";
      setErrore(String(raw));
    } finally {
      setInInvio(false);
    }
  };

  const handleSubmitCodice = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);
    if (!signIn || !codice.trim()) {
      setErrore("Inserisci il codice che abbiamo inviato alla tua email.");
      return;
    }

    setInInvio(true);
    try {
      const attempt = await signIn.attemptSecondFactor({ strategy: "email_code", code: codice.trim() });
      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId });
        router.push("/impresa/dashboard");
        return;
      }
      setErrore("Codice non valido o scaduto. Riprova.");
    } catch (err: unknown) {
      const raw =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors: { message?: string }[] }).errors?.map((e) => e.message).join(" ") || "Errore"
          : err instanceof Error ? err.message : "Codice non valido.";
      setErrore(String(raw));
    } finally {
      setInInvio(false);
    }
  };

  if (isSignedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
      </div>
    );
  }

  if (step === "codice") {
    return (
      <PageShell backHref="/impresa/login" backLabel="← Login">
        <h1 className={titleClass} style={{ fontFamily: "var(--font-syne)" }}>
          Verifica la tua email
        </h1>
        <p className={subtitleClass}>
          Abbiamo inviato un codice a <strong className="text-zinc-300">{email}</strong>. Inseriscilo qui sotto.
        </p>

        <form onSubmit={handleSubmitCodice} className="mt-8 max-w-md space-y-5">
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
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <button type="submit" className={btnPrimaryClass} disabled={inInvio}>
              {inInvio ? "Verifica in corso..." : "Verifica e accedi"}
            </button>
            <button
              type="button"
              onClick={() => setStep("credenziali")}
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
        Accedi al pannello impresa
      </h1>
      <p className={subtitleClass}>
        Inserisci email e password con cui ti sei registrato. Se il profilo è ancora in revisione vedrai lo stato; quando avrai il via libera accederai al pannello richieste.
      </p>

      <form onSubmit={handleSubmitCredenziali} className="mt-8 max-w-md space-y-5">
        {errore && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
            {errore}
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
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
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`mt-2 ${inputClass}`}
            placeholder="La tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button type="submit" className={btnPrimaryClass} disabled={inInvio}>
            {inInvio ? "Accesso in corso..." : "Accedi"}
          </button>
          <Link href="/" className={btnSecondaryClass}>
            Annulla
          </Link>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-zinc-500">
        Non hai un account?{" "}
        <Link href="/impresa/registrati" className="font-medium text-amber-400 hover:text-amber-300">
          Registrati come impresa
        </Link>
      </p>
    </PageShell>
  );
}
