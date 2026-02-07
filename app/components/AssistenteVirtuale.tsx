"use client";

import { useState, useRef, useEffect } from "react";
import { rispostaEdilio } from "@/lib/edilio-risposte";

interface Messaggio {
  id: string;
  ruolo: "utente" | "assistente";
  testo: string;
  at: Date;
}

export default function AssistenteVirtuale() {
  const [aperto, setAperto] = useState(false);
  const [messaggi, setMessaggi] = useState<Messaggio[]>([
    {
      id: "0",
      ruolo: "assistente",
      testo: "Ciao! Sono Edilio. Hai bisogno d'aiuto?",
      at: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [inInvio, setInInvio] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aperto && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [aperto, messaggi]);

  const invia = async () => {
    const testo = input.trim();
    if (!testo || inInvio) return;

    setInput("");
    const userMsg: Messaggio = {
      id: `u-${Date.now()}`,
      ruolo: "utente",
      testo,
      at: new Date(),
    };
    setMessaggi((prev) => [...prev, userMsg]);
    setInInvio(true);

    // MVP: risposta locale basata su contesto Edilia (no API)
    await new Promise((r) => setTimeout(r, 400));
    const risposta = rispostaEdilio(testo);
    const botMsg: Messaggio = {
      id: `b-${Date.now()}`,
      ruolo: "assistente",
      testo: risposta,
      at: new Date(),
    };
    setMessaggi((prev) => [...prev, botMsg]);
    setInInvio(false);
  };

  return (
    <>
      {/* Pulsante floating in basso a destra */}
      <button
        type="button"
        onClick={() => setAperto((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-zinc-900 shadow-lg shadow-black/30 transition hover:border-amber-500/60 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label={aperto ? "Chiudi assistente" : "Apri assistente virtuale"}
      >
        {aperto ? (
          <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Pannello chat */}
      {aperto && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl sm:bottom-24 sm:right-6"
          style={{ height: "min(420px, 70vh)" }}
        >
          <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800/80 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20">
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">Edilio</p>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messaggi.map((m) =>
              m.ruolo === "utente" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-amber-500/20 px-4 py-2.5 text-sm text-zinc-100">
                    {m.testo}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200">
                    {m.testo}
                  </div>
                </div>
              )
            )}
            {inInvio && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-500">
                  ...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              invia();
            }}
            className="border-t border-zinc-700 p-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Fai una domanda a Edilio"
                className="flex-1 rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                disabled={inInvio}
              />
              <button
                type="submit"
                disabled={!input.trim() || inInvio}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-amber-400 disabled:opacity-50"
              >
                Invia
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
