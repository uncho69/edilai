/**
 * Eventi per metriche MVP (PARTE 6).
 * Tracciare fin da subito per analisi successiva.
 */

export type EventType =
  | "request_started"
  | "request_step_completed"
  | "request_abandoned"
  | "request_completed"
  | "request_sent"
  | "impresa_accepted"
  | "impresa_rejected"
  | "impresa_site_visit";

export interface MetricEvent {
  id: string;
  eventType: EventType;
  requestId?: string;
  userId?: string;
  impresaId?: string;
  /** Step index per flow (0-based) */
  step?: number;
  payload?: Record<string, unknown>;
  createdAt: string;
}
