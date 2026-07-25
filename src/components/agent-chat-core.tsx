import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatThread } from "@/components/chat/chat-thread";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { ChatThreadSkeleton, PageSkeleton } from "@/components/ui/page-skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ArrowLeft,
  Bot,
  Loader2,
  MessageSquarePlus,
  Archive,
  ArrowUpRight,
  User,
  Wrench,
  X,
} from "lucide-react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { deriveChatPhase, type ChatDeliveryStatus } from "@/lib/chatPhase";
import { chatDraftKey, loadChatDraft, saveChatDraft, clearChatDraft } from "@/lib/chatDrafts";
import { useStickyChatScroll } from "@/hooks/useStickyChatScroll";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { formatDateTime, formatMessageStamp, formatRelative } from "@/lib/datetime";
import { motionTokens } from "@/lib/motion";
import { useAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import {
  useConversationMessages,
  useSendConversationMessage,
  useCreateConversation,
  useUpdateConversationStatus,
  useCloseConversation,
  useEscalateConversation,
  type ChatMessageResponse,
} from "@/api/hooks/useConversations";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatMessageActions } from "@/components/chat/chat-message-actions";
import { ConversationRagSummary } from "@/components/chat/chat-message-insights";
import {
  ChatProcessingIndicator,
  MessageActivityTrail,
  type LiveStreamStep,
} from "@/components/chat/chat-processing";
import {
  MessageInsightSheet,
  MessageInspectButton,
  type InsightMessage,
} from "@/components/chat/message-insight-sheet";
import {
  useUnifiedConversations,
  type UnifiedConversation,
} from "@/api/hooks/useUnifiedConversations";
import { streamConversationChat } from "@/api/chat-stream";
import {
  ChatSkillCommand,
  getSlashSkillQuery,
  removeSlashQuery,
  type SkillCommandOption,
} from "@/components/chat/chat-skill-command";
import { ChatAgentPicker } from "@/components/chat/chat-agent-picker";
import { AgentChatHistorySheet } from "@/components/chat/agent-chat-history-sheet";
import {
  extractPolicyTrace,
  inferPolicyTraceFromConfig,
  policyTraceSignalCount,
} from "@/lib/policyTrace";
import { formatSkillInvocation, getSkillRequiredFreeParams } from "@/lib/chatSkillParams";
import type { Agent } from "@/api/hooks/useAgents";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUserId,
  makeChatId,
  normalizeAgentChatMessages,
  previewText,
  roleLabel,
  type AgentChatMessage as ChatMessage,
  type AgentChatReplyTarget as ReplyTarget,
} from "@/lib/agentChatMessages";

type AttachedSkill = {
  id: string;
  name: string;
  slug: string;
  params: Record<string, string>;
};

type PendingSkillParams = {
  skill: SkillCommandOption;
  fields: Array<{ key: string; label: string; description?: string; type?: string }>;
  values: Record<string, string>;
};

interface AgentChatCoreProps {
  agentId: string;
  showBackLink?: boolean;
  backTo?: string;
  /** Cuando el core vive dentro de /chat (ya hay header de agente). */
  fillParent?: boolean;
  /** Sustituye el nombre estático por el picker de agentes (drawer). */
  agentSwitcher?: {
    agents: Agent[];
    onChange: (agentId: string) => void;
  };
  /** Extra a la derecha del picker (ej. filtro de sucursal). */
  headerExtra?: React.ReactNode;
  /**
   * @deprecated Ya no cambia el comportamiento: siempre se muestra el skeleton de chat
   * (nunca un spinner). Se mantiene por compatibilidad con /chat.
   */
  skipInitialSkeleton?: boolean;
}

export function AgentChatCore({
  agentId,
  showBackLink = true,
  backTo = "/agentes",
  fillParent = false,
  agentSwitcher,
  headerExtra,
  skipInitialSkeleton: _skipInitialSkeleton = false,
}: AgentChatCoreProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationIdFromUrl = searchParams.get("conversation");
  const agentIdFromUrl = searchParams.get("agent");

  useEffect(() => {
    if (!showBackLink) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      navigate(backTo);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBackLink, backTo, navigate]);

  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(agentId);
  const { data: allFunctions = [] } = useAgentFunctions();
  const { data: allConversations = [], isLoading: conversationsLoading } =
    useUnifiedConversations();
  const createConversation = useCreateConversation();
  const sendMessage = useSendConversationMessage();
  const updateStatus = useUpdateConversationStatus();
  const closeConversation = useCloseConversation();
  const escalateConversation = useEscalateConversation();
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const queryClient = useQueryClient();
  const reduceMotion = useMotionPrefs();

  const agentSkillNames = useMemo(() => {
    const ids = new Set((agent?.functions ?? []).map((id) => String(id)));
    if (!ids.size) return [] as string[];
    return allFunctions
      .filter((f) => ids.has(String(f.id)) && f.is_active !== false)
      .map((f) => f.name || f.slug || "")
      .filter(Boolean);
  }, [agent?.functions, allFunctions]);

  const agentSkillOptions = useMemo((): SkillCommandOption[] => {
    const ids = new Set((agent?.functions ?? []).map((id) => String(id)));
    if (!ids.size) return [];
    return allFunctions
      .filter((f) => ids.has(String(f.id)) && f.is_active !== false)
      .map((f) => {
        const slug =
          (f.slug && String(f.slug).trim()) ||
          (f.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "") ||
          String(f.id);
        return {
          id: String(f.id),
          name: f.name || slug,
          slug,
        };
      })
      .filter((s) => s.slug);
  }, [agent?.functions, allFunctions]);

  const agentBranchId =
    agent?.branch != null && String(agent.branch).trim() !== "" ? String(agent.branch) : null;

  const [conversationId, setConversationId] = useState<string | null>(conversationIdFromUrl);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [skillMenuOpen, setSkillMenuOpen] = useState(false);
  const [inputCursor, setInputCursor] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachedSkills, setAttachedSkills] = useState<AttachedSkill[]>([]);
  const [pendingSkill, setPendingSkill] = useState<PendingSkillParams | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  /** Tras «Nueva»: chat vacío listo para escribir; se crea al primer mensaje. */
  const [isDraftNew, setIsDraftNew] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<"active" | "archived">("active");
  const [inspectMessage, setInspectMessage] = useState<InsightMessage | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveSteps, setLiveSteps] = useState<LiveStreamStep[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const streamingMsgIdRef = useRef<string | null>(null);
  const streamingDraftRef = useRef("");
  const deltaRafRef = useRef<number | null>(null);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [initialized, setInitialized] = useState(false);
  const skipAutoSelectRef = useRef(false);
  const isCreatingRef = useRef(false);
  const lastRemoteMessagesRef = useRef<string>("");
  const conversationIdRef = useRef<string | null>(conversationIdFromUrl);
  const streamAbortRef = useRef<AbortController | null>(null);
  /** Evita que el finally de un stream abortado pise uno nuevo. */
  const streamGenerationRef = useRef(0);

  const isBusy = sendMessage.isPending || isStreaming;

  const {
    endRef: messagesEndRef,
    bindViewport,
    showJump,
    scrollToBottom,
  } = useStickyChatScroll([messages, isBusy, isStreaming], {
    behavior: isStreaming ? "auto" : "smooth",
  });

  useEffect(() => {
    setReplyTo(null);
  }, [conversationId]);

  useEffect(() => {
    setAttachedSkills([]);
    setPendingSkill(null);
    setSkillMenuOpen(false);
  }, [agentId]);

  const mergeSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (agentIdFromUrl || agentId) {
            next.set("agent", agentIdFromUrl || agentId);
          }
          for (const [key, value] of Object.entries(updates)) {
            if (value == null || value === "") next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [agentId, agentIdFromUrl, setSearchParams],
  );

  const agentConversations = useMemo(
    () =>
      allConversations
        .filter((c: UnifiedConversation) => {
          if (String(c.agent) !== agentId || c.source !== "internal") return false;
          const status = (c.status || "").toLowerCase().trim();
          if (historyTab === "active") return status === "active";
          return status === "archived" || status === "closed" || status === "inactive";
        })
        .sort((a, b) => {
          const da = new Date(b.modified ?? 0).getTime();
          const db = new Date(a.modified ?? 0).getTime();
          return da - db;
        })
        .slice(0, 50),
    [allConversations, agentId, historyTab],
  );

  const activeAgentConversations = useMemo(
    () =>
      allConversations
        .filter((c: UnifiedConversation) => {
          if (String(c.agent) !== agentId || c.source !== "internal") return false;
          return (c.status || "").toLowerCase().trim() === "active";
        })
        .sort((a, b) => {
          const da = new Date(b.modified ?? 0).getTime();
          const db = new Date(a.modified ?? 0).getTime();
          return da - db;
        }),
    [allConversations, agentId],
  );

  const { data: remoteMessages, isLoading: messagesLoading } = useConversationMessages(
    conversationId ?? undefined,
    { refetchInterval: false },
  );

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    streamGenerationRef.current += 1;
    setIsStreaming(false);
    setStreamingMessageId(null);
    streamingDraftRef.current = "";
    streamingMsgIdRef.current = null;
    setLiveSteps([]);

    setInitialized(false);
    skipAutoSelectRef.current = false;
    setIsDraftNew(false);
    setConversationId(conversationIdFromUrl);
    setMessages([]);
    setCreateError(null);
    lastRemoteMessagesRef.current = "";
    // Solo reset fuerte al cambiar de agente; conversation synca en otro effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- conversationIdFromUrl se aplica abajo
  }, [agentId]);

  useEffect(() => {
    if (conversationIdFromUrl) {
      setIsDraftNew(false);
      setConversationId(conversationIdFromUrl);
      return;
    }
    // URL sin conversation: solo limpiar si estamos en modo «nueva» (no reabrir la anterior)
    if (skipAutoSelectRef.current) {
      setConversationId(null);
    }
  }, [conversationIdFromUrl]);

  useEffect(() => {
    lastRemoteMessagesRef.current = "";
    // Abort stream al cambiar de hilo (evita deltas en conversación equivocada).
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    streamGenerationRef.current += 1;
    setIsStreaming(false);
    setStreamingMessageId(null);
    streamingDraftRef.current = "";
    streamingMsgIdRef.current = null;
    setLiveSteps([]);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || isDraftNew || !remoteMessages) return;
    // Don't overwrite live stream data while the model is responding.
    if (isStreaming) return;
    const next = normalizeAgentChatMessages(remoteMessages);
    const key = JSON.stringify(next.map((m) => ({ id: m.id, content: m.content })));
    if (key === lastRemoteMessagesRef.current) return;
    lastRemoteMessagesRef.current = key;
    setMessages(next);
  }, [remoteMessages, conversationId, isDraftNew, isStreaming]);

  // Abort stream on unmount.
  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  const draftHydratingRef = useRef(false);

  // Hidratar draft al cambiar de conversación (siempre, también limpia).
  useEffect(() => {
    draftHydratingRef.current = true;
    const key = chatDraftKey("studio", conversationId);
    setInput(loadChatDraft(key));
    const id = requestAnimationFrame(() => {
      draftHydratingRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [conversationId, isDraftNew]);

  // Guardar con debounce; no escribir durante hidratación.
  useEffect(() => {
    if (draftHydratingRef.current) return;
    const key = chatDraftKey("studio", conversationId);
    const t = window.setTimeout(() => saveChatDraft(key, input), 300);
    return () => clearTimeout(t);
  }, [input, conversationId]);

  const slashQuery = useMemo(() => getSlashSkillQuery(input, inputCursor), [input, inputCursor]);

  useEffect(() => {
    if (!agentSkillOptions.length) {
      setSkillMenuOpen(false);
      return;
    }
    setSkillMenuOpen(Boolean(slashQuery));
  }, [slashQuery, agentSkillOptions.length]);

  const selectSkillCommand = useCallback(
    (skill: SkillCommandOption) => {
      const start = slashQuery?.start ?? input.length;
      const cursor = inputCursor || input.length;
      const { next, cursor: nextCursor } = removeSlashQuery(input, start, cursor);
      setInput(next);
      setInputCursor(nextCursor);
      setSkillMenuOpen(false);

      const fn = allFunctions.find((f) => String(f.id) === skill.id);
      const fields = getSkillRequiredFreeParams(fn);
      if (fields.length > 0) {
        setPendingSkill({
          skill,
          fields,
          values: Object.fromEntries(fields.map((f) => [f.key, ""])),
        });
        return;
      }

      setAttachedSkills((prev) => {
        if (prev.some((s) => s.id === skill.id)) return prev;
        return [...prev, { id: skill.id, name: skill.name, slug: skill.slug, params: {} }];
      });
      requestAnimationFrame(() => textareaRef.current?.focus());
    },
    [allFunctions, input, inputCursor, slashQuery?.start],
  );

  const confirmPendingSkill = useCallback(() => {
    if (!pendingSkill) return;
    const missing = pendingSkill.fields.filter((f) => !pendingSkill.values[f.key]?.trim());
    if (missing.length) {
      toast.error(`Completa: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    setAttachedSkills((prev) => {
      if (prev.some((s) => s.id === pendingSkill.skill.id)) {
        return prev.map((s) =>
          s.id === pendingSkill.skill.id ? { ...s, params: { ...pendingSkill.values } } : s,
        );
      }
      return [
        ...prev,
        {
          id: pendingSkill.skill.id,
          name: pendingSkill.skill.name,
          slug: pendingSkill.skill.slug,
          params: { ...pendingSkill.values },
        },
      ];
    });
    setPendingSkill(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, [pendingSkill]);

  const ensureConversationId = useCallback(async (): Promise<string | null> => {
    if (conversationIdRef.current) return conversationIdRef.current;
    if (!agent || !agentId || isCreatingRef.current) return null;

    isCreatingRef.current = true;
    setIsCreating(true);
    setCreateError(null);

    try {
      const data = await createConversation.mutateAsync({
        agent: agentId,
        title: `Chat con ${agent.name}`,
        user: getCurrentUserId(),
        ...(agentBranchId ? { branch: agentBranchId } : {}),
      });
      const id = String(data.id);
      lastRemoteMessagesRef.current = "";
      conversationIdRef.current = id;
      setConversationId(id);
      setIsDraftNew(false);
      mergeSearchParams({ conversation: id });
      return id;
    } catch (err) {
      const msg = apiErrorMessage(err, "No se pudo iniciar la conversación");
      setCreateError(msg);
      toast.error(msg);
      return null;
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  }, [agent, agentBranchId, agentId, createConversation, mergeSearchParams]);

  const doCreateConversation = useCallback(() => {
    void ensureConversationId().then((id) => {
      if (!id || !agent) return;
      if (agent.welcome_message) {
        setMessages([
          {
            id: makeChatId("welcome"),
            role: "agent",
            content: agent.welcome_message,
            created: new Date().toISOString(),
          },
        ]);
      }
    });
  }, [agent, ensureConversationId]);

  useEffect(() => {
    if (agentLoading || !agent || initialized || conversationsLoading) return;
    setInitialized(true);

    if (skipAutoSelectRef.current) return;

    if (conversationIdFromUrl) {
      setConversationId(conversationIdFromUrl);
      return;
    }

    const lastActive = activeAgentConversations[0];
    if (lastActive) {
      setConversationId(String(lastActive.id));
      mergeSearchParams({ conversation: String(lastActive.id) });
      return;
    }

    // Sin conversación activa → draft vacío (se crea al primer mensaje)
    skipAutoSelectRef.current = true;
    setIsDraftNew(true);
    setConversationId(null);
    setMessages([]);
  }, [
    agentLoading,
    agent,
    initialized,
    conversationsLoading,
    conversationIdFromUrl,
    activeAgentConversations,
    mergeSearchParams,
  ]);

  const handleSend = async (
    e?: React.FormEvent,
    overrides?: { text?: string; reply?: ReplyTarget | null },
  ) => {
    e?.preventDefault();
    const freeText = (overrides?.text ?? input).trim();
    const skillPrefix =
      overrides?.text != null
        ? ""
        : attachedSkills.map((s) => formatSkillInvocation(s.slug, s.params)).join(" ");
    const text = [skillPrefix, freeText].filter(Boolean).join("\n").trim();
    if (!text || isBusy || isCreating) return;

    const activeReply = overrides && "reply" in overrides ? overrides.reply : replyTo;
    const replyToId = activeReply?.id ?? null;

    const activeId = conversationId ?? (await ensureConversationId());
    if (!activeId) return;

    const userMsgId = makeChatId("user");
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      created: new Date().toISOString(),
      replyToId: activeReply?.id,
      replyToRole: activeReply?.role,
      replyToPreview: activeReply?.preview,
      deliveryStatus: "pending",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    clearChatDraft(chatDraftKey("studio", activeId));
    setInputCursor(0);
    setSkillMenuOpen(false);
    setAttachedSkills([]);
    setReplyTo(null);
    setIsDraftNew(false);
    setLiveSteps([
      {
        key: "connected",
        label: "Conectado",
        detail: "Iniciando…",
        icon: "sparkles",
        status: "active",
      },
    ]);
    setIsStreaming(true);

    streamAbortRef.current?.abort();
    const abort = new AbortController();
    streamAbortRef.current = abort;
    const generation = ++streamGenerationRef.current;

    const upsertStep = (
      key: string,
      label: string,
      detail: string | undefined,
      icon: LiveStreamStep["icon"],
      opts?: { demoteActive?: "all" | "non-tools" | "none" },
    ) => {
      const demote = opts?.demoteActive ?? "all";
      setLiveSteps((prev) => {
        const next = prev.map((s) => {
          if (s.status !== "active") return s;
          if (demote === "none") return s;
          if (demote === "non-tools" && s.key.startsWith("tool-")) return s;
          return { ...s, status: "done" as const };
        });
        if (next.some((s) => s.key === key)) {
          return next.map((s) =>
            s.key === key ? { ...s, label, detail, icon, status: "active" as const } : s,
          );
        }
        return [...next, { key, label, detail, icon, status: "active" as const }];
      });
    };

    streamingDraftRef.current = "";
    streamingMsgIdRef.current = null;
    setStreamingMessageId(null);

    try {
      const data = await streamConversationChat(
        activeId,
        text,
        {
          onStatus: (ev) => {
            const stage = ev.stage || "status";
            const icon: LiveStreamStep["icon"] =
              stage === "rag" ? "database" : stage === "writing" ? "loader" : "sparkles";
            upsertStep(`status-${stage}`, ev.label || stage, ev.detail, icon, {
              demoteActive: "all",
            });
          },
          onToolStart: (ev) => {
            const key = `tool-${ev.id || ev.name || makeChatId("tool")}`;
            upsertStep(key, "Ejecutando skill", ev.label || ev.name || "skill", "wrench", {
              demoteActive: "non-tools",
            });
          },
          onToolEnd: (ev) => {
            const key = `tool-${ev.id || ev.name || ""}`;
            setLiveSteps((prev) =>
              prev.map((s) =>
                s.key === key || (ev.label && s.detail === ev.label)
                  ? {
                      ...s,
                      status: ev.ok === false ? ("error" as const) : ("done" as const),
                    }
                  : s,
              ),
            );
          },
          onDelta: (ev) => {
            const chunk = ev.text || "";
            if (!chunk) return;
            streamingDraftRef.current += chunk;
            if (deltaRafRef.current != null) return;
            deltaRafRef.current = requestAnimationFrame(() => {
              deltaRafRef.current = null;
              const textDraft = streamingDraftRef.current;
              setMessages((prev) => {
                const sid = streamingMsgIdRef.current;
                if (sid && prev.some((m) => m.id === sid)) {
                  return prev.map((m) => (m.id === sid ? { ...m, content: textDraft } : m));
                }
                const id = makeChatId("agent-stream");
                streamingMsgIdRef.current = id;
                setStreamingMessageId(id);
                return [
                  ...prev,
                  {
                    id,
                    role: "agent" as const,
                    content: textDraft,
                    created: new Date().toISOString(),
                  },
                ];
              });
            });
          },
        },
        { replyToId, signal: abort.signal, branchId: agentBranchId },
      );

      const finalContent = data.message ?? data.content ?? data.text ?? streamingDraftRef.current;
      const streamId = streamingMsgIdRef.current;
      const meta =
        data.metadata && typeof data.metadata === "object"
          ? (data.metadata as Record<string, unknown>)
          : null;
      setMessages((prev) => {
        // Conservar id del draft de stream → evita remount / salto visual al llegar final.
        const stableId = streamId ?? data.id ?? makeChatId("agent");
        const finalMsg: ChatMessage = {
          id: stableId,
          role: "agent",
          content: finalContent,
          created: data.created_at ?? data.created ?? data.timestamp ?? new Date().toISOString(),
          rag_sources: data.rag_sources ?? data.sources,
          tool_calls: data.tool_calls,
          tool_results: data.tool_results,
          policy_trace: data.policy_trace ?? meta?.policy_trace,
          flow_policy_trace: data.flow_policy_trace ?? meta?.flow_policy_trace,
          policies: data.policies ?? meta?.policies,
          metadata: meta,
        };
        if (streamId && prev.some((m) => m.id === streamId)) {
          return prev.map((m) => (m.id === streamId ? { ...m, ...finalMsg, id: streamId } : m));
        }
        return [...prev, finalMsg];
      });
      // Mark optimistic user message as delivered.
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "sent" as const } : m)),
      );
      // Lista sí; mensajes no (la UI local ya tiene el hilo — evita flash post-stream).
      void queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
      void queryClient.invalidateQueries({
        queryKey: ["conversations", activeId, "messages"],
      });
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      // Fallback al POST clásico si el stream no está disponible.
      const msg = (err as Error)?.message || "";
      if (/stream|SSE|event-stream|Failed to fetch|406|Not Acceptable|Accept header/i.test(msg)) {
        try {
          const data = await sendMessage.mutateAsync({
            id: activeId,
            message: text,
            replyToId,
            branchId: agentBranchId,
          });
          if (data?.message || data?.content || data?.text) {
            const fallbackMeta =
              data.metadata && typeof data.metadata === "object"
                ? (data.metadata as Record<string, unknown>)
                : null;
            setMessages((prev) => {
              const withSent = prev.map((m) =>
                m.id === userMsgId ? { ...m, deliveryStatus: "sent" as const } : m,
              );
              return [
                ...withSent,
                {
                  id: data.id ?? makeChatId("agent"),
                  role: data.sender?.toLowerCase() === "user" ? "user" : ("agent" as const),
                  content: data.message ?? data.content ?? data.text ?? "",
                  created:
                    data.created_at ?? data.created ?? data.timestamp ?? new Date().toISOString(),
                  rag_sources: data.rag_sources ?? data.sources,
                  tool_calls: data.tool_calls,
                  tool_results: data.tool_results,
                  policy_trace: data.policy_trace ?? fallbackMeta?.policy_trace,
                  flow_policy_trace: data.flow_policy_trace ?? fallbackMeta?.flow_policy_trace,
                  policies: data.policies ?? fallbackMeta?.policies,
                  metadata: fallbackMeta,
                },
              ];
            });
          }
        } catch (e) {
          toast.error(apiErrorMessage(e, "Error al enviar el mensaje"));
          setMessages((prev) =>
            prev.map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "failed" as const } : m)),
          );
          if (activeReply) setReplyTo(activeReply);
        }
      } else {
        toast.error(msg || "Error al enviar el mensaje");
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "failed" as const } : m)),
        );
        if (activeReply) setReplyTo(activeReply);
      }
    } finally {
      // Solo el stream vigente limpia estado (evita race con stop + reenvío).
      if (streamGenerationRef.current === generation) {
        setIsStreaming(false);
        streamingDraftRef.current = "";
        streamingMsgIdRef.current = null;
        setStreamingMessageId(null);
        if (streamAbortRef.current === abort) {
          streamAbortRef.current = null;
        }
        window.setTimeout(() => {
          if (streamGenerationRef.current === generation) setLiveSteps([]);
        }, 280);
      }
    }
  };

  const startReply = (msg: ChatMessage) => {
    setReplyTo({
      id: msg.id,
      role: msg.role,
      preview: previewText(msg.content),
    });
  };

  const resendMessage = (msg: ChatMessage) => {
    if (isBusy || isCreating) return;
    void handleSend(undefined, { text: msg.content, reply: null });
  };

  const stopStreaming = useCallback(() => {
    streamGenerationRef.current += 1;
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    setIsStreaming(false);
    streamingDraftRef.current = "";
    streamingMsgIdRef.current = null;
    setStreamingMessageId(null);
    window.setTimeout(() => setLiveSteps([]), 280);
  }, []);

  const handleNewConversation = () => {
    if (!agent || isCreating) return;
    skipAutoSelectRef.current = true;
    setInitialized(true);
    isCreatingRef.current = false;
    conversationIdRef.current = null;
    lastRemoteMessagesRef.current = "";
    setIsDraftNew(true);
    setConversationId(null);
    setMessages([]);
    setCreateError(null);
    setInput("");
    mergeSearchParams({ conversation: null });
  };

  const handleSelectConversation = (convId: string) => {
    skipAutoSelectRef.current = false;
    setIsDraftNew(false);
    lastRemoteMessagesRef.current = "";
    conversationIdRef.current = convId;
    setConversationId(convId);
    mergeSearchParams({ conversation: convId });
    setSidebarOpen(false);
  };

  const changeConversationStatus = (convId: string | number, nextStatus: "ARCHIVED" | "ACTIVE") => {
    const isArchiving = nextStatus === "ARCHIVED";
    updateStatus.mutate(
      { id: convId, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(isArchiving ? "Conversación archivada" : "Conversación restaurada");
          if (String(convId) === conversationId && isArchiving) {
            skipAutoSelectRef.current = true;
            conversationIdRef.current = null;
            lastRemoteMessagesRef.current = "";
            setIsDraftNew(true);
            setConversationId(null);
            setMessages([]);
            mergeSearchParams({ conversation: null });
          }
        },
        onError: (err) => {
          toast.error(
            apiErrorMessage(
              err,
              isArchiving
                ? "No se pudo archivar la conversación"
                : "No se pudo restaurar la conversación",
            ),
          );
        },
      },
    );
  };

  const handleArchiveConversation = (convId: string | number) => {
    changeConversationStatus(convId, "ARCHIVED");
  };

  const handleRestoreConversation = (convId: string | number) => {
    changeConversationStatus(convId, "ACTIVE");
  };

  const handleCloseCurrentConversation = () => {
    if (!conversationId) return;
    closeConversation.mutate(conversationId, {
      onSuccess: () => {
        toast.success("Conversación cerrada");
        setConfirmCloseOpen(false);
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        void queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
      },
      onError: () => {
        // Fallback si el endpoint canónico no está disponible en este entorno.
        updateStatus.mutate(
          { id: conversationId, status: "ARCHIVED" },
          {
            onSuccess: () => {
              toast.success("No se pudo cerrar — la conversación se archivó en su lugar");
              setConfirmCloseOpen(false);
            },
            onError: (e) => {
              toast.error(apiErrorMessage(e, "No se pudo cerrar"));
              setConfirmCloseOpen(false);
            },
          },
        );
      },
    });
  };

  const handleEscalateCurrent = () => {
    if (!conversationId || !escalateReason.trim()) return;
    escalateConversation.mutate(
      { id: conversationId, reason: escalateReason.trim() },
      {
        onSuccess: () => {
          toast.success("Conversación escalada");
          setEscalateOpen(false);
          setEscalateReason("");
          void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo escalar")),
      },
    );
  };

  const isReady = Boolean(agent?.is_active && (agent?.llm_model || agent?.llm_model_name));

  const chatPhase = deriveChatPhase({
    agentLoading,
    conversationsLoading,
    initialized,
    messagesLoading,
    hasMessages: messages.length > 0,
    conversationId,
    isDraftNew,
    isCreating,
    isStreaming,
    sendPending: sendMessage.isPending,
    error: createError,
  });

  const currentConversation = useMemo(() => {
    if (!conversationId) return null;
    return (
      allConversations.find(
        (c) => String(c.id) === conversationId && String(c.agent) === agentId,
      ) ?? null
    );
  }, [allConversations, conversationId, agentId]);

  const conversationStartedAt = useMemo(() => {
    if (currentConversation?.created) return currentConversation.created;
    const first = messages.find((m) => m.created)?.created;
    return first ?? null;
  }, [currentConversation?.created, messages]);

  const conversationLastActivity = useMemo(() => {
    if (currentConversation?.modified) return currentConversation.modified;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]?.created) return messages[i].created ?? null;
    }
    return conversationStartedAt;
  }, [currentConversation?.modified, messages, conversationStartedAt]);

  const shellClass = fillParent
    ? "h-full w-full bg-background text-foreground flex flex-col overflow-hidden"
    : "h-[calc(100dvh-3.5rem)] w-full bg-background text-foreground flex flex-col overflow-hidden";

  if (agentLoading) {
    return (
      <div className={`${fillParent ? "h-full" : "h-[calc(100dvh-3.5rem)]"} w-full bg-background`}>
        <PageSkeleton variant="chat" className="h-full max-w-none" padded={false} />
      </div>
    );
  }

  if (agentError || !agent) {
    return (
      <div
        className={`${fillParent ? "h-full" : "h-[calc(100dvh-3.5rem)]"} w-full bg-background flex flex-col items-center justify-center gap-4 px-6`}
      >
        <p className="text-destructive text-center">No se pudo cargar el agente.</p>
        <Button asChild variant="outline">
          <Link to={backTo}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <header className="flex shrink-0 flex-col gap-2 border-b border-border/50 bg-card/50 px-3 py-2 backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {showBackLink && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to={backTo} title="Volver (Esc)">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden text-xs font-medium sm:inline">Volver</span>
              </Link>
            </Button>
          )}

          {agentSwitcher ? (
            <ChatAgentPicker
              agents={agentSwitcher.agents}
              value={agentId}
              onChange={agentSwitcher.onChange}
              className="min-w-0 flex-1 justify-start"
            />
          ) : (
            <>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{agent.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {!isReady
                    ? agent?.is_active
                      ? "Sin modelo de lenguaje configurado"
                      : "Agente inactivo"
                    : agent.use_rag
                      ? `RAG top ${agent.rag_top_k ?? "—"} · ${agent.embedding_model || "embedding default"}`
                      : "RAG desactivado"}
                </div>
              </div>
            </>
          )}

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 cursor-pointer px-2"
              onClick={handleNewConversation}
              disabled={isCreating}
              title="Nueva conversación"
            >
              {isCreating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MessageSquarePlus className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:ml-auto sm:gap-2">
          {headerExtra ? <div className="min-w-0 flex-1 sm:flex-none">{headerExtra}</div> : null}
          <Button
            variant="outline"
            size="sm"
            className="hidden shrink-0 cursor-pointer gap-1.5 sm:inline-flex"
            onClick={handleNewConversation}
            disabled={isCreating}
            title="Nueva conversación"
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MessageSquarePlus className="h-3.5 w-3.5" />
            )}
            <span>Nueva</span>
          </Button>

          {conversationId && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 cursor-pointer"
                onClick={() => setEscalateOpen(true)}
                disabled={escalateConversation.isPending}
                title="Escalar a humano"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Escalar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 cursor-pointer"
                onClick={() => setConfirmCloseOpen(true)}
                disabled={closeConversation.isPending || updateStatus.isPending}
                title="Cerrar conversación"
              >
                <Archive className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cerrar</span>
              </Button>
            </>
          )}

          <AgentChatHistorySheet
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            historyTab={historyTab}
            onHistoryTabChange={setHistoryTab}
            conversations={agentConversations}
            conversationsLoading={conversationsLoading}
            conversationId={conversationId}
            updatePending={updateStatus.isPending}
            onSelect={handleSelectConversation}
            onArchive={handleArchiveConversation}
            onRestore={handleRestoreConversation}
          />
        </div>
      </header>

      {(conversationId || isDraftNew) && (
        <div className="border-b border-border/40 bg-muted/20 px-4 py-2 shrink-0">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {conversationId ? (
              <>
                <span className="font-medium text-foreground/80 tabular-nums">
                  Conv. #{conversationId}
                </span>
                <span title={formatDateTime(conversationStartedAt) ?? undefined}>
                  Inicio:{" "}
                  <span className="text-foreground/70">
                    {formatDateTime(conversationStartedAt) ?? "—"}
                  </span>
                </span>
                <span title={formatDateTime(conversationLastActivity) ?? undefined}>
                  Última act.:{" "}
                  <span className="text-foreground/70">
                    {formatRelative(conversationLastActivity) ?? "—"}
                  </span>
                </span>
                <span>
                  Mensajes:{" "}
                  <span className="text-foreground/70 tabular-nums">
                    {currentConversation?.message_count ?? messages.length}
                  </span>
                </span>
                {currentConversation?.status && (
                  <span className="capitalize">
                    Estado:{" "}
                    <span className="text-foreground/70">
                      {(
                        currentConversation.display_status || currentConversation.status
                      ).toLowerCase()}
                    </span>
                  </span>
                )}
              </>
            ) : (
              <span>Conversación nueva · se creará al enviar el primer mensaje</span>
            )}
          </div>
        </div>
      )}

      <ChatThread
        viewportRef={bindViewport}
        endRef={messagesEndRef}
        showJump={showJump}
        onJump={scrollToBottom}
        contentClassName="py-6 space-y-5"
        footer={
          <AnimatePresence>
            {isBusy && !streamingMessageId ? (
              <ChatProcessingIndicator liveSteps={liveSteps} compact={liveSteps.length === 0} />
            ) : null}
          </AnimatePresence>
        }
      >
        {messages.length > 0 && agent.use_rag && (
          <ConversationRagSummary
            messages={messages}
            embeddingModel={agent.embedding_model}
            topK={agent.rag_top_k}
          />
        )}
        {chatPhase === "resolving_thread" || chatPhase === "loading_history" ? (
          <ChatThreadSkeleton className="min-h-[40vh] justify-start py-2" />
        ) : !conversationId && !isCreating && !isDraftNew && !conversationsLoading ? (
          <EmptyState
            className="mt-8 border-0 bg-transparent"
            icon={<MessageSquarePlus className="h-5 w-5" />}
            title="Sin conversación"
            description={`Inicia un chat nuevo con ${agent.name} para empezar a escribir.`}
            action={
              <Button onClick={handleNewConversation} disabled={isCreating}>
                <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                Nueva conversación
              </Button>
            }
          />
        ) : messages.length === 0 && !isBusy ? (
          <EmptyState
            icon={<Bot className="h-5 w-5" />}
            title={isCreating ? "Iniciando conversación…" : `Chatea con ${agent.name}`}
            description={
              isCreating
                ? "Creando un chat nuevo…"
                : isDraftNew
                  ? `Escribe el primer mensaje para abrir una conversación nueva.`
                  : `Escribe tu consulta y ${agent.name} te ayudará con lo que necesites.`
            }
            className="mt-8"
            action={
              !isCreating ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {["¿Qué puedes hacer?", "Resume tu conocimiento", "Prueba una skill con /"].map(
                    (prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInput(prompt)}
                      >
                        {prompt}
                      </Button>
                    ),
                  )}
                </div>
              ) : undefined
            }
          />
        ) : (
          messages.map((msg) => {
            const ragCount = Array.isArray(msg.rag_sources) ? msg.rag_sources.length : 0;
            const toolCount = Array.isArray(msg.tool_calls) ? msg.tool_calls.length : 0;
            const msgPolicy =
              extractPolicyTrace(msg) ??
              (msg.role === "agent"
                ? inferPolicyTraceFromConfig(agent.flow_policy, msg.tool_calls)
                : null);
            const policyCount = policyTraceSignalCount(msgPolicy);
            const isStreamingBubble =
              isStreaming && streamingMessageId != null && String(msg.id) === streamingMessageId;
            return (
              <motion.div
                key={msg.id}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === "user" ? "bg-muted" : "bg-primary/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={`group max-w-[85%] sm:max-w-[75%] space-y-1 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : msg.role === "system"
                          ? "bg-destructive/10 text-destructive rounded-bl-md border border-destructive/20"
                          : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.replyToPreview && (
                      <div
                        className={`mb-2 rounded-md border-l-2 px-2 py-1 text-[11px] leading-snug ${
                          msg.role === "user"
                            ? "border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground/85"
                            : "border-primary/50 bg-background/60 text-muted-foreground"
                        }`}
                      >
                        <p className="font-semibold opacity-90">
                          Respondiendo a {roleLabel(msg.replyToRole)}
                        </p>
                        <p className="line-clamp-2 opacity-80">{msg.replyToPreview}</p>
                      </div>
                    )}
                    <ChatMarkdown content={msg.content} inverted={msg.role === "user"} />
                    {isStreamingBubble && !reduceMotion && (
                      <span
                        aria-hidden
                        className="inline-block w-[2px] h-[1em] ml-0.5 align-[-0.1em] bg-primary/80 animate-pulse rounded-sm"
                      />
                    )}
                    <div
                      className={`mt-1.5 flex items-center gap-1.5 text-[10px] tabular-nums font-medium ${
                        msg.role === "user"
                          ? "justify-end text-primary-foreground/70"
                          : "justify-end text-muted-foreground"
                      }`}
                    >
                      <span title={formatDateTime(msg.created) ?? undefined}>
                        {formatMessageStamp(msg.created) || "Sin fecha"}
                      </span>
                      {msg.role === "agent" && !isStreamingBubble && (
                        <MessageInspectButton
                          variant="icon"
                          chunkCount={ragCount}
                          toolCount={toolCount}
                          policyCount={policyCount}
                          onClick={() =>
                            setInspectMessage({
                              id: msg.id,
                              content: msg.content,
                              created: msg.created,
                              rag_sources: msg.rag_sources,
                              tool_calls: msg.tool_calls,
                              tool_results: msg.tool_results,
                              policy_trace: msg.policy_trace,
                              flow_policy_trace: msg.flow_policy_trace,
                              policies: msg.policies,
                              metadata: msg.metadata,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>
                  {msg.role === "agent" && (
                    <MessageActivityTrail
                      toolCalls={msg.tool_calls}
                      toolResults={msg.tool_results}
                      policyTrace={msgPolicy}
                    />
                  )}
                  <ChatMessageActions
                    text={msg.content}
                    align={msg.role === "user" ? "end" : "start"}
                    onReply={msg.role !== "system" && !isBusy ? () => startReply(msg) : undefined}
                    onResend={msg.role === "user" && !isBusy ? () => resendMessage(msg) : undefined}
                  />
                  {msg.role === "user" && msg.deliveryStatus === "failed" && (
                    <button
                      type="button"
                      onClick={() => resendMessage(msg)}
                      className="text-[11px] text-destructive underline self-end font-medium"
                    >
                      Reintentar
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </ChatThread>

      {createError ? (
        <ErrorBanner variant="bar" message={createError} onRetry={doCreateConversation} />
      ) : null}

      <MessageInsightSheet
        open={Boolean(inspectMessage)}
        onOpenChange={(open) => {
          if (!open) setInspectMessage(null);
        }}
        message={inspectMessage}
        embeddingModel={agent.embedding_model}
        topK={agent.rag_top_k}
        flowPolicy={agent.flow_policy}
      />

      <div className="border-t border-border/50 bg-card/50 backdrop-blur p-3 sm:p-4">
        <div className="max-w-3xl mx-auto">
          <ChatSkillCommand
            open={skillMenuOpen && agentSkillOptions.length > 0}
            onOpenChange={setSkillMenuOpen}
            skills={agentSkillOptions}
            query={slashQuery?.query ?? ""}
            onSelect={selectSkillCommand}
          >
            <ChatComposer
              ref={textareaRef}
              value={input}
              onChange={(v) => {
                setInput(v);
              }}
              onCursorChange={(cursor) => setInputCursor(cursor)}
              onSubmit={() => void handleSend()}
              placeholder={
                isCreating
                  ? "Creando conversación..."
                  : isBusy
                    ? "El agente está respondiendo..."
                    : replyTo
                      ? "Escribe tu respuesta…"
                      : attachedSkills.length > 0
                        ? "Añade un mensaje o envía la skill…"
                        : isDraftNew || !conversationId
                          ? "Escribe para iniciar… (/ para skills)"
                          : "Escribe tu mensaje… (/ para skills)"
              }
              disabled={isCreating || (!conversationId && !isDraftNew)}
              busy={isBusy}
              canStop={isStreaming}
              onStop={stopStreaming}
              canSubmit={attachedSkills.length > 0}
              leading={
                replyTo || attachedSkills.length > 0 ? (
                  <div className="space-y-2">
                    {replyTo && (
                      <div className="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-primary">
                            Respondiendo a {roleLabel(replyTo.role)}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {replyTo.preview}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Cancelar respuesta"
                          aria-label="Cancelar respuesta"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {attachedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 px-0.5">
                        {attachedSkills.map((skill) => {
                          const paramBits = Object.entries(skill.params)
                            .filter(([, v]) => v.trim())
                            .map(([k, v]) => `${k}=${v}`);
                          return (
                            <span
                              key={skill.id}
                              className="inline-flex items-center gap-1.5 max-w-full rounded-full border border-primary/35 bg-primary/10 pl-2.5 pr-1 py-1 text-[11px] font-medium text-primary"
                              title={
                                paramBits.length
                                  ? `${skill.name}: ${paramBits.join(", ")}`
                                  : skill.name
                              }
                            >
                              <Wrench className="h-3 w-3 shrink-0 opacity-80" />
                              <span className="truncate">
                                /{skill.slug}
                                {paramBits.length > 0 ? (
                                  <span className="text-primary/70 font-normal">
                                    {" "}
                                    · {paramBits.slice(0, 2).join(", ")}
                                    {paramBits.length > 2 ? "…" : ""}
                                  </span>
                                ) : null}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAttachedSkills((prev) => prev.filter((s) => s.id !== skill.id))
                                }
                                className="shrink-0 rounded-full p-0.5 hover:bg-primary/20"
                                aria-label={`Quitar ${skill.name}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : undefined
              }
            />
          </ChatSkillCommand>
        </div>
      </div>

      <Dialog
        open={Boolean(pendingSkill)}
        onOpenChange={(open) => {
          if (!open) setPendingSkill(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-primary" />
              Parámetros de {pendingSkill?.skill.name ?? "skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <p className="text-xs text-muted-foreground">
              Esta skill necesita datos antes de ejecutarla.
            </p>
            {pendingSkill?.fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`skill-param-${field.key}`} className="text-xs capitalize">
                  {field.label}
                </Label>
                <Input
                  id={`skill-param-${field.key}`}
                  value={pendingSkill.values[field.key] ?? ""}
                  onChange={(e) =>
                    setPendingSkill((prev) =>
                      prev
                        ? {
                            ...prev,
                            values: { ...prev.values, [field.key]: e.target.value },
                          }
                        : prev,
                    )
                  }
                  placeholder={field.description || field.key}
                  className="h-9"
                  autoFocus={field.key === pendingSkill.fields[0]?.key}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => setPendingSkill(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={confirmPendingSkill}>
              Añadir skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={escalateOpen}
        onOpenChange={(open) => {
          setEscalateOpen(open);
          if (!open) setEscalateReason("");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Escalar conversación</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label htmlFor="escalate-reason" className="text-xs">
              Motivo
            </Label>
            <Input
              id="escalate-reason"
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Ej. el usuario pide un humano"
              className="h-9"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEscalateCurrent();
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => setEscalateOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!escalateReason.trim() || escalateConversation.isPending}
              onClick={handleEscalateCurrent}
            >
              {escalateConversation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              Escalar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmCloseOpen}
        onOpenChange={setConfirmCloseOpen}
        title="¿Cerrar esta conversación?"
        description="La conversación se marcará como cerrada y saldrá del hilo activo. Podrás consultarla desde el historial."
        confirmLabel="Cerrar conversación"
        busy={closeConversation.isPending || updateStatus.isPending}
        onConfirm={handleCloseCurrentConversation}
      />
    </div>
  );
}
