import { useCallback, useRef, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import { apiErrorMessage } from "@/lib/apiError";
import { makeChatId, type AgentChatMessage as ChatMessage, type AgentChatReplyTarget as ReplyTarget } from "@/lib/agentChatMessages";
import { streamConversationChat } from "@/api/chat-stream";
import {
  useCreateConversation,
  useSendConversationMessage,
  useUpdateConversationStatus,
  useCloseConversation,
  useEscalateConversation,
} from "@/api/hooks/useConversations";
import { clearChatDraft, chatDraftKey } from "@/lib/chatDrafts";
import { formatSkillInvocation } from "@/lib/chatSkillParams";
import type { LiveStreamStep } from "@/components/chat/chat-processing";
import type { AttachedSkill } from "./useAgentChatComposer";
import type { Agent } from "@/api/hooks/useAgents";
import type { UnifiedConversation } from "@/api/hooks/useUnifiedConversations";

type Options = {
  agentId: string;
  agent: Agent | undefined;
  agentBranchId: string | null;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsDraftNew: (v: boolean) => void;
  mergeSearchParams: (updates: Record<string, string | null>) => void;
  navigate: NavigateFunction;
  activeAgentConversations: UnifiedConversation[];
  // Composer
  attachedSkills: AttachedSkill[];
  replyTo: ReplyTarget | null;
  setReplyTo: (v: ReplyTarget | null) => void;
  clearComposer: () => void;
  queryClient: QueryClient;
};

export function useAgentChatStreaming({
  agentId,
  agent,
  agentBranchId,
  conversationId,
  setConversationId,
  setMessages,
  setIsDraftNew,
  mergeSearchParams,
  navigate,
  activeAgentConversations,
  attachedSkills,
  replyTo,
  setReplyTo,
  clearComposer,
  queryClient,
}: Options) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveSteps, setLiveSteps] = useState<LiveStreamStep[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");

  // Mutations
  const createConversation = useCreateConversation();
  const sendMessage = useSendConversationMessage();
  const updateStatus = useUpdateConversationStatus();
  const closeConversation = useCloseConversation();
  const escalateConversation = useEscalateConversation();

  // Refs
  const conversationIdRef = useRef<string | null>(null);
  const streamingMsgIdRef = useRef<string | null>(null);
  const streamingDraftRef = useRef("");
  const deltaRafRef = useRef<number | null>(null);
  const streamedIdsRef = useRef<Set<string | number>>(new Set());
  const historyIdsRef = useRef<Set<string>>(new Set());
  const streamAbortRef = useRef<AbortController | null>(null);
  const streamGenerationRef = useRef(0);
  const creatingConversationRef = useRef(false);
  const creatingPromiseRef = useRef<Promise<string | null> | null>(null);
  const welcomeOnlyConversationRef = useRef<string | null>(null);
  const lastRemoteMessagesRef = useRef<string>("");
  const skipAutoSelectRef = useRef(false);
  const newConversationModeRef = useRef(false);

  const upsertStep = useCallback(
    (key: string, label: string, detail: string | undefined, icon: LiveStreamStep["icon"], opts?: { demoteActive?: "all" | "non-tools" | "none" }) => {
      const demote = opts?.demoteActive ?? "all";
      setLiveSteps((prev) => {
        const next = prev.map((s) => {
          if (s.status !== "active") return s;
          if (demote === "none") return s;
          if (demote === "non-tools" && s.key.startsWith("tool-")) return s;
          return { ...s, status: "done" as const };
        });
        if (next.some((s) => s.key === key)) {
          return next.map((s) => s.key === key ? { ...s, label, detail, icon, status: "active" as const } : s);
        }
        return [...next, { key, label, detail, icon, status: "active" as const }];
      });
    },
    [],
  );

  const ensureConversationId = useCallback(
    async (forceNew = false): Promise<string | null> => {
      if (!forceNew && conversationIdRef.current) return conversationIdRef.current;
      if (!forceNew && creatingPromiseRef.current) return creatingPromiseRef.current;
      if (!agent || !agentId) return null;

      setIsCreating(true);
      setCreateError(null);

      const pending = (async (): Promise<string | null> => {
        try {
          const data = await createConversation.mutateAsync({
            agent: agentId,
            title: `Chat con ${agent.name}`,
            ...(agentBranchId ? { branch: agentBranchId } : {}),
          });
          const id = String(data.id);
          conversationIdRef.current = id;
          creatingConversationRef.current = true;
          welcomeOnlyConversationRef.current = id;
          setConversationId(id);
          setIsDraftNew(false);
          mergeSearchParams({ conversation: id, new: null });
          return id;
        } catch (err) {
          const msg = apiErrorMessage(err, "No se pudo iniciar la conversación");
          setCreateError(msg);
          toast.error(msg);
          return null;
        } finally {
          creatingPromiseRef.current = null;
          setIsCreating(false);
        }
      })();

      creatingPromiseRef.current = pending;
      return pending;
    },
    [agent, agentBranchId, agentId],
  );

  const moveAfterClose = useCallback(
    (closedId: string) => {
      const next = activeAgentConversations.find((c) => String(c.id) !== closedId);
      if (!next) {
        // No hay más conversaciones — crear nueva
        void handleNewConversation();
        return;
      }
      const nextId = String(next.id);
      newConversationModeRef.current = false;
      skipAutoSelectRef.current = false;
      conversationIdRef.current = nextId;
      lastRemoteMessagesRef.current = "";
      setIsDraftNew(false);
      setConversationId(nextId);
      setMessages([]);
      mergeSearchParams({ conversation: nextId, new: null });
    },
    [activeAgentConversations],
  );

  const handleNewConversation = useCallback(async () => {
    if (!agent || isCreating) return;
    setMessages([]);
    setConversationId(null);
    setIsCreating(true);

    try {
      if (conversationIdRef.current) {
        await closeConversation.mutateAsync(String(conversationIdRef.current));
      }
      const data = await createConversation.mutateAsync({
        agent: agentId,
        title: `Chat con ${agent.name}`,
        ...(agentBranchId ? { branch: agentBranchId } : {}),
      });
      const newId = String(data.id);
      conversationIdRef.current = newId;
      welcomeOnlyConversationRef.current = newId;
      creatingConversationRef.current = true;
      skipAutoSelectRef.current = true;
      setConversationId(newId);
      setIsDraftNew(false);
      navigate(`?agent=${agentId}&conversation=${newId}`, { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, "No se pudo crear la conversación"));
    } finally {
      setIsCreating(false);
    }
  }, [agent, agentId, agentBranchId, isCreating]);

  const handleSelectConversation = useCallback((convId: string) => {
    newConversationModeRef.current = false;
    skipAutoSelectRef.current = false;
    setIsDraftNew(false);
    lastRemoteMessagesRef.current = "";
    conversationIdRef.current = convId;
    setConversationId(convId);
    mergeSearchParams({ conversation: convId, new: null });
  }, []);

  const changeConversationStatus = useCallback((convId: string | number, nextStatus: "ARCHIVED" | "ACTIVE") => {
    const isArchiving = nextStatus === "ARCHIVED";
    updateStatus.mutate({ id: convId, status: nextStatus }, {
      onSuccess: () => {
        toast.success(isArchiving ? "Conversación archivada" : "Conversación restaurada");
        if (String(convId) === conversationId && isArchiving) {
          skipAutoSelectRef.current = true;
          conversationIdRef.current = null;
          lastRemoteMessagesRef.current = "";
          setIsDraftNew(true);
          setConversationId(null);
          setMessages([]);
          mergeSearchParams({ conversation: null, new: null });
        }
      },
      onError: (err) => {
        toast.error(apiErrorMessage(err, isArchiving ? "No se pudo archivar la conversación" : "No se pudo restaurar la conversación"));
      },
    });
  }, [conversationId]);

  const handleArchiveConversation = useCallback((convId: string | number) => {
    closeConversation.mutate(String(convId), {
      onSuccess: () => {
        toast.success("Conversación archivada");
        if (String(convId) === conversationId) moveAfterClose(String(convId));
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        void queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
      },
      onError: (err) => toast.error(apiErrorMessage(err, "No se pudo archivar la conversación")),
    });
  }, [conversationId, moveAfterClose]);

  const handleRestoreConversation = useCallback((convId: string | number) => {
    changeConversationStatus(convId, "ACTIVE");
  }, [changeConversationStatus]);

  const handleCloseCurrentConversation = useCallback(() => {
    if (!conversationId) return;
    const closedId = conversationId;
    closeConversation.mutate(conversationId, {
      onSuccess: () => {
        toast.success("Conversación cerrada");
        setConfirmCloseOpen(false);
        moveAfterClose(closedId);
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        void queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
      },
      onError: () => {
        updateStatus.mutate({ id: conversationId, status: "ARCHIVED" }, {
          onSuccess: () => {
            toast.success("No se pudo cerrar — la conversación se archivó en su lugar");
            setConfirmCloseOpen(false);
            moveAfterClose(closedId);
          },
          onError: (e) => {
            toast.error(apiErrorMessage(e, "No se pudo cerrar"));
            setConfirmCloseOpen(false);
          },
        });
      },
    });
  }, [conversationId, moveAfterClose]);

  const handleEscalateCurrent = useCallback(() => {
    if (!conversationId || !escalateReason.trim()) return;
    escalateConversation.mutate({ id: conversationId, reason: escalateReason.trim() }, {
      onSuccess: () => {
        toast.success("Conversación escalada");
        setEscalateOpen(false);
        setEscalateReason("");
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
      onError: (e) => toast.error(apiErrorMessage(e, "No se pudo escalar")),
    });
  }, [conversationId, escalateReason]);

  // Streaming send
  const handleSend = useCallback(
    async (e?: React.FormEvent, overrides?: { text?: string; reply?: ReplyTarget | null }) => {
      e?.preventDefault();
      const freeText = (overrides?.text ?? "").trim();
      const skillPrefix = overrides?.text != null ? "" : attachedSkills.map((s) => formatSkillInvocation(s.slug, s.params)).join(" ");
      const text = [skillPrefix, freeText].filter(Boolean).join("\n").trim();
      if (!text) return;

      const activeReply = overrides && "reply" in overrides ? overrides.reply : replyTo;
      const replyToId = activeReply?.id ?? null;

      const activeId = conversationIdRef.current ?? (await ensureConversationId());
      if (!activeId) return;
      if (streamAbortRef.current) return;

      const userMsgId = makeChatId("user");
      const placeholderId = makeChatId("agent-stream");
      const userMsg: ChatMessage = {
        id: userMsgId, role: "user", content: text, created: new Date().toISOString(),
        replyToId: activeReply?.id, replyToRole: activeReply?.role, replyToPreview: activeReply?.preview,
        deliveryStatus: "pending",
      };

      setMessages((prev) => [...prev, userMsg, { id: placeholderId, role: "agent" as const, content: "", created: new Date().toISOString() }]);
      streamingMsgIdRef.current = placeholderId;
      streamedIdsRef.current.add(placeholderId);
      setStreamingMessageId(placeholderId);
      clearComposer();
      clearChatDraft(chatDraftKey("studio", activeId));
      setIsDraftNew(false);
      setLiveSteps([{ key: "connected", label: "Pensando...", detail: "Iniciando…", icon: "sparkles", status: "active" }]);
      setIsStreaming(true);

      const abort = new AbortController();
      streamAbortRef.current = abort;
      const generation = ++streamGenerationRef.current;
      streamingDraftRef.current = "";

      try {
        const data = await streamConversationChat(activeId, text, {
          onStatus: (ev) => {
            const stage = ev.stage || "status";
            const icon: LiveStreamStep["icon"] = stage === "rag" ? "database" : stage === "writing" ? "loader" : "sparkles";
            upsertStep(`status-${stage}`, ev.label || stage, ev.detail, icon, { demoteActive: "all" });
          },
          onToolStart: (ev) => {
            upsertStep(`tool-${ev.id || ev.name || makeChatId("tool")}`, "Ejecutando skill", ev.label || ev.name || "skill", "wrench", { demoteActive: "non-tools" });
          },
          onToolEnd: (ev) => {
            const key = `tool-${ev.id || ev.name || ""}`;
            setLiveSteps((prev) => prev.map((s) => s.key === key || (ev.label && s.detail === ev.label) ? { ...s, status: ev.ok === false ? ("error" as const) : ("done" as const) } : s));
          },
          onDelta: (ev) => {
            const chunk = ev.text || "";
            if (!chunk) return;
            streamingDraftRef.current += chunk;
            if (deltaRafRef.current != null) return;
            deltaRafRef.current = requestAnimationFrame(() => {
              deltaRafRef.current = null;
              if (streamGenerationRef.current !== generation) return;
              const textDraft = streamingDraftRef.current;
              setMessages((prev) => {
                const sid = streamingMsgIdRef.current;
                if (sid && prev.some((m) => m.id === sid)) return prev.map((m) => (m.id === sid ? { ...m, content: textDraft } : m));
                const id = makeChatId("agent-stream");
                streamingMsgIdRef.current = id;
                streamedIdsRef.current.add(id);
                setStreamingMessageId(id);
                return [...prev, { id, role: "agent" as const, content: textDraft, created: new Date().toISOString() }];
              });
            });
          },
        }, { replyToId, signal: abort.signal, branchId: agentBranchId });

        const finalContent = data.message ?? data.content ?? data.text ?? streamingDraftRef.current;
        const streamId = streamingMsgIdRef.current;
        const meta = data.metadata && typeof data.metadata === "object" ? (data.metadata as Record<string, unknown>) : null;
        setMessages((prev) => {
          const stableId = streamId ?? data.id ?? makeChatId("agent");
          const finalMsg: ChatMessage = {
            id: stableId, role: "agent", content: finalContent,
            created: data.created_at ?? data.created ?? data.timestamp ?? new Date().toISOString(),
            rag_sources: data.rag_sources ?? data.sources, tool_calls: data.tool_calls, tool_results: data.tool_results,
            policy_trace: data.policy_trace ?? meta?.policy_trace, flow_policy_trace: data.flow_policy_trace ?? meta?.flow_policy_trace,
            policies: data.policies ?? meta?.policies, metadata: meta,
          };
          if (streamId && prev.some((m) => m.id === streamId)) return prev.map((m) => (m.id === streamId ? { ...m, ...finalMsg, id: streamId } : m));
          return [...prev, finalMsg];
        });
        setMessages((prev) => prev.map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "sent" as const } : m)));
        void queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        const msg = (err as Error)?.message || "";
        if (/stream|SSE|event-stream|Failed to fetch|406|Not Acceptable|Accept header/i.test(msg)) {
          try {
            const data = await sendMessage.mutateAsync({ id: activeId, message: text, replyToId, branchId: agentBranchId });
            if (data?.message || data?.content || data?.text) {
              const fallbackMeta = data.metadata && typeof data.metadata === "object" ? (data.metadata as Record<string, unknown>) : null;
              setMessages((prev) => {
                const withSent = prev.map((m) => m.id === userMsgId ? { ...m, deliveryStatus: "sent" as const } : m);
                const finalMsg: ChatMessage = {
                  id: placeholderId, role: data.sender?.toLowerCase() === "user" ? "user" : ("agent" as const),
                  content: data.message ?? data.content ?? data.text ?? "",
                  created: data.created_at ?? data.created ?? data.timestamp ?? new Date().toISOString(),
                  rag_sources: data.rag_sources ?? data.sources, tool_calls: data.tool_calls, tool_results: data.tool_results,
                  policy_trace: data.policy_trace ?? fallbackMeta?.policy_trace, flow_policy_trace: data.flow_policy_trace ?? fallbackMeta?.flow_policy_trace,
                  policies: data.policies ?? fallbackMeta?.policies, metadata: fallbackMeta,
                };
                if (withSent.some((m) => m.id === placeholderId)) return withSent.map((m) => (m.id === placeholderId ? finalMsg : m));
                return [...withSent, finalMsg];
              });
            }
          } catch (e) {
            toast.error(apiErrorMessage(e, "Error al enviar el mensaje"));
            setMessages((prev) => prev.filter((m) => m.id !== placeholderId).map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "failed" as const } : m)));
            if (activeReply) setReplyTo(activeReply);
          }
        } else {
          toast.error(msg || "Error al enviar el mensaje");
          setMessages((prev) => prev.filter((m) => m.id !== placeholderId).map((m) => (m.id === userMsgId ? { ...m, deliveryStatus: "failed" as const } : m)));
          if (activeReply) setReplyTo(activeReply);
        }
      } finally {
        if (streamGenerationRef.current === generation) {
          if (deltaRafRef.current != null) { cancelAnimationFrame(deltaRafRef.current); deltaRafRef.current = null; }
          setIsStreaming(false);
          streamingDraftRef.current = "";
          streamingMsgIdRef.current = null;
          setStreamingMessageId(null);
          if (streamAbortRef.current === abort) streamAbortRef.current = null;
          window.setTimeout(() => { if (streamGenerationRef.current === generation) setLiveSteps([]); }, 280);
        }
      }
    },
    [attachedSkills, replyTo, agentBranchId],
  );

  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  const stopStreaming = useCallback(() => {
    streamGenerationRef.current += 1;
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    const sid = streamingMsgIdRef.current;
    if (sid) setMessages((prev) => prev.filter((m) => m.id !== sid || (m.content?.length ?? 0) > 0));
    setIsStreaming(false);
    streamingDraftRef.current = "";
    streamingMsgIdRef.current = null;
    setStreamingMessageId(null);
    window.setTimeout(() => setLiveSteps([]), 280);
  }, []);

  const resendMessage = useCallback((msg: ChatMessage) => {
    void handleSendRef.current(undefined, { text: msg.content, reply: null });
  }, []);

  return {
    // Streaming state
    isStreaming, streamingMessageId, liveSteps,
    // Refs (exposed for orchestrator effects)
    streamedIdsRef, historyIdsRef, streamAbortRef, streamGenerationRef,
    creatingConversationRef, creatingPromiseRef, welcomeOnlyConversationRef,
    conversationIdRef, lastRemoteMessagesRef, skipAutoSelectRef, newConversationModeRef,
    // Streaming actions
    handleSend, stopStreaming, resendMessage, ensureConversationId, upsertStep,
    // Conversation ops
    isCreating, setIsCreating, createError, setCreateError,
    confirmCloseOpen, setConfirmCloseOpen,
    escalateOpen, setEscalateOpen, escalateReason, setEscalateReason,
    handleNewConversation, handleSelectConversation,
    handleArchiveConversation, handleRestoreConversation,
    handleCloseCurrentConversation, handleEscalateCurrent,
    moveAfterClose, changeConversationStatus,
    // Expose mutations for dialog busy states
    createConversation, closeConversation, updateStatus, escalateConversation,
  };
}
