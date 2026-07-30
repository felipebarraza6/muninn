import { getActiveBranchId, getBranchMode } from "@/lib/branchStorage";
import { ENDPOINTS } from "@/api/endpoints/index";
import type { ChatMessageResponse } from "@/api/hooks/useConversations";
import { resolveApiBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = resolveApiBaseUrl();

export type ChatStreamStatusEvent = {
  stage?: string;
  label?: string;
  detail?: string;
  source_count?: number;
};

export type ChatStreamToolEvent = {
  id?: string;
  name?: string;
  label?: string;
  arguments?: unknown;
  ok?: boolean;
};

export type ChatStreamFinalEvent = ChatMessageResponse & {
  conversation_id?: string;
  sources?: unknown[];
  rag_sources?: unknown[];
  tokens_used?: number;
};

export type ChatStreamDeltaEvent = {
  text?: string;
};

export type ChatStreamHandlers = {
  onStatus?: (data: ChatStreamStatusEvent) => void;
  onToolStart?: (data: ChatStreamToolEvent) => void;
  onToolEnd?: (data: ChatStreamToolEvent) => void;
  onDelta?: (data: ChatStreamDeltaEvent) => void;
  onFinal?: (data: ChatStreamFinalEvent) => void;
  onError?: (data: { error?: string; detail?: string }) => void;
};

function parseSseChunk(buffer: string): {
  events: { event: string; data: string }[];
  rest: string;
} {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: { event: string; data: string }[] = [];
  for (const block of parts) {
    if (!block.trim()) continue;
    let event = "message";
    const dataLines: string[] = [];
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    }
    if (dataLines.length) events.push({ event, data: dataLines.join("\n") });
  }
  return { events, rest };
}

export type StreamChatOptions = {
  replyToId?: string | number | null;
  signal?: AbortSignal;
  /** Sucursal del agente; no muta el switcher global. */
  branchId?: string | null;
};

/** POST chat con stream=true (SSE). */
export async function streamConversationChat(
  conversationId: string,
  message: string,
  handlers: ChatStreamHandlers,
  options?: StreamChatOptions | AbortSignal,
): Promise<ChatStreamFinalEvent> {
  const opts: StreamChatOptions =
    options instanceof AbortSignal ? { signal: options } : (options ?? {});
  const token = localStorage.getItem("token");
  // DRF negocia Accept antes de la vista: no usar solo text/event-stream
  // (provoca 406 Not Acceptable). El body sigue siendo SSE.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (token) headers.Authorization = `Token ${token}`;

  const branchForRequest =
    (opts.branchId != null && String(opts.branchId).trim() !== "" ? String(opts.branchId) : null) ||
    getActiveBranchId();
  if (branchForRequest && (opts.branchId || getBranchMode() === "branch")) {
    headers["x-branch-id"] = branchForRequest;
  }

  const body: Record<string, unknown> = { message, stream: true };
  if (opts.replyToId != null && opts.replyToId !== "") {
    const n = Number(opts.replyToId);
    if (Number.isFinite(n)) body.reply_to_id = n;
  }

  const url = `${API_BASE_URL}${ENDPOINTS.conversations.chat(conversationId)}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const errJson = (await response.json()) as { error?: string; detail?: string };
      detail = errJson.error || errJson.detail || detail;
    } catch {
      /* ignore */
    }
    const err = new Error(detail);
    handlers.onError?.({ error: detail });
    throw err;
  }

  if (!response.body) {
    throw new Error("El servidor no devolvió un stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalPayload: ChatStreamFinalEvent | null = null;
  let streamError: { error?: string; detail?: string } | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parsed = parseSseChunk(buffer);
    buffer = parsed.rest;

    for (const { event, data } of parsed.events) {
      let payload: Record<string, unknown> = {};
      try {
        payload = JSON.parse(data) as Record<string, unknown>;
      } catch {
        continue;
      }

      if (event === "status") {
        handlers.onStatus?.(payload as ChatStreamStatusEvent);
      } else if (event === "tool_start") {
        handlers.onToolStart?.(payload as ChatStreamToolEvent);
      } else if (event === "tool_end") {
        handlers.onToolEnd?.(payload as ChatStreamToolEvent);
      } else if (event === "delta") {
        handlers.onDelta?.(payload as ChatStreamDeltaEvent);
      } else if (event === "final") {
        finalPayload = payload as unknown as ChatStreamFinalEvent;
        handlers.onFinal?.(finalPayload);
      } else if (event === "error") {
        streamError = payload as { error?: string; detail?: string };
        handlers.onError?.(streamError);
      }
    }
  }

  if (streamError) {
    throw new Error(streamError.error || streamError.detail || "Error en el stream");
  }
  if (!finalPayload) {
    throw new Error("El stream terminó sin respuesta final");
  }
  return finalPayload;
}
