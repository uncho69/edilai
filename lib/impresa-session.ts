/**
 * Sessione impresa (MVP: cookie lato client).
 * Solo le imprese con stato "attiva" possono accedere al pannello.
 */

const COOKIE_NAME = "edil_impresa";
const COOKIE_MAX_AGE_DAYS = 30;

export function setImpresaSession(impresaId: string) {
  if (typeof document === "undefined") return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(impresaId)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getImpresaSession(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match?.[1];
  return value ? decodeURIComponent(value) : null;
}

export function clearImpresaSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
