/**
 * Contrato de realtime para cuando el API exponga un hub WS/SSE por sucursal.
 *
 * Hoy: polling TanStack Query + SSE de tokens en chat (`chat-stream.ts`).
 * Meta: un canal push invalida Query keys (no duplicar estado).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

/** Eventos esperados del hub (contrato front ↔ back). */
export type RealtimeEventType =
  | "conversation.updated"
  | "conversation.message"
  | "work_plan.status"
  | "work_item.status"
  | "workflow_execution.progress"
  | "ping";

export type RealtimeEvent = {
  type: RealtimeEventType;
  branch_id?: string | number;
  payload?: Record<string, unknown>;
  ts?: string;
};

export const REALTIME_QUERY_KEYS = {
  unifiedConversations: ["unified-conversations"] as const,
  conversations: ["conversations"] as const,
  workPlans: ["work-plans"] as const,
  workflowExecutions: ["workflow-executions"] as const,
} as const;

/**
 * URL del hub. Vacío = desactivado (comportamiento actual).
 * Cuando el back exista: `VITE_REALTIME_URL=wss://…/ws` o path relativo.
 */
export function resolveRealtimeUrl(branchId?: string | number | null): string | null {
  const raw = (import.meta.env.VITE_REALTIME_URL as string | undefined)?.trim();
  if (!raw) return null;
  if (!branchId && branchId !== 0) return null;
  try {
    const u = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://local");
    u.searchParams.set("branch", String(branchId));
    // WS needs ws(s) scheme if given as http(s)
    if (u.protocol === "https:") u.protocol = "wss:";
    if (u.protocol === "http:") u.protocol = "ws:";
    return u.toString();
  } catch {
    return null;
  }
}

function invalidateForEvent(
  qc: ReturnType<typeof useQueryClient>,
  event: RealtimeEvent,
) {
  switch (event.type) {
    case "conversation.updated":
    case "conversation.message":
      void qc.invalidateQueries({ queryKey: [...REALTIME_QUERY_KEYS.unifiedConversations] });
      void qc.invalidateQueries({ queryKey: [...REALTIME_QUERY_KEYS.conversations] });
      break;
    case "work_plan.status":
    case "work_item.status":
      void qc.invalidateQueries({ queryKey: [...REALTIME_QUERY_KEYS.workPlans] });
      break;
    case "workflow_execution.progress":
      void qc.invalidateQueries({ queryKey: [...REALTIME_QUERY_KEYS.workflowExecutions] });
      break;
    default:
      break;
  }
}

type RealtimeCtx = {
  /** true si hay URL configurada (aunque aún no conecte). */
  enabled: boolean;
  status: "off" | "connecting" | "open" | "closed" | "error";
  lastEventAt: string | null;
};

const RealtimeContext = createContext<RealtimeCtx>({
  enabled: false,
  status: "off",
  lastEventAt: null,
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

/**
 * Provider no-op hasta que exista `VITE_REALTIME_URL`.
 * Montar dentro de QueryClientProvider (p.ej. App autenticada).
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const branchId = useActiveBranchId();
  const url = useMemo(() => resolveRealtimeUrl(branchId), [branchId]);
  const [status, setStatus] = useState<RealtimeCtx["status"]>(url ? "connecting" : "off");
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleEvent = useCallback(
    (event: RealtimeEvent) => {
      setLastEventAt(event.ts || new Date().toISOString());
      invalidateForEvent(qc, event);
    },
    [qc],
  );

  useEffect(() => {
    if (!url) {
      setStatus("off");
      return;
    }

    let cancelled = false;
    setStatus("connecting");

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!cancelled) setStatus("open");
      };
      ws.onclose = () => {
        if (!cancelled) setStatus("closed");
      };
      ws.onerror = () => {
        if (!cancelled) setStatus("error");
      };
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(String(msg.data)) as RealtimeEvent;
          if (data && typeof data.type === "string") handleEvent(data);
        } catch {
          // ignore malformed
        }
      };

      return () => {
        cancelled = true;
        ws.close();
        wsRef.current = null;
      };
    } catch {
      setStatus("error");
      return;
    }
  }, [url, handleEvent]);

  const value = useMemo<RealtimeCtx>(
    () => ({
      enabled: Boolean(url),
      status,
      lastEventAt,
    }),
    [url, status, lastEventAt],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
