import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatThread } from "@/components/chat/chat-thread";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { ChatThreadSkeleton, PageSkeleton } from "@/components/ui/page-skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ArrowLeft, Bot, Loader2, MessageSquarePlus, Archive, ArrowUpRight, Wrench, X } from "lucide-react";
import { ChatComposer } from "@/components/chat/chat-composer";
import { deriveChatPhase } from "@/lib/chatPhase";
import { useStickyChatScroll } from "@/hooks/useStickyChatScroll";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { formatDateTime, formatRelative } from "@/lib/datetime";
import { useAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { useConversationMessages, useSendConversationMessage } from "@/api/hooks/useConversations";
import { clearTypingSeen, hasActiveTyping, markAllTyped, useAnyTyping } from "@/components/chat/typewriter-text";
import { ConversationRagSummary } from "@/components/chat/chat-message-insights";
import { MessageInsightSheet, type InsightMessage } from "@/components/chat/message-insight-sheet";
import { useUnifiedConversations, type UnifiedConversation } from "@/api/hooks/useUnifiedConversations";
import { ChatSkillCommand, type SkillCommandOption } from "@/components/chat/chat-skill-command";
import { ChatAgentPicker } from "@/components/chat/chat-agent-picker";
import { AgentChatHistorySheet } from "@/components/chat/agent-chat-history-sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { normalizeAgentChatMessages, type AgentChatMessage as ChatMessage } from "@/lib/agentChatMessages";
import type { LiveStreamStep } from "@/components/chat/chat-processing";

import { AgentChatMessage } from "./AgentChatMessage";
import { useAgentChatComposer } from "./useAgentChatComposer";
import { useAgentChatStreaming } from "./useAgentChatStreaming";

const EMPTY_LIVE_STEPS: LiveStreamStep[] = [];

interface AgentChatCoreProps {
  agentId: string;
  showBackLink?: boolean;
  backTo?: string;
  fillParent?: boolean;
  agentSwitcher?: { agents: import("@/api/hooks/useAgents").Agent[]; onChange: (agentId: string) => void };
  headerExtra?: React.ReactNode;
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
  const newConversationFromUrl = searchParams.get("new") === "1";
  const queryClient = useQueryClient();
  const reduceMotion = useMotionPrefs();

  // Escape
  useEffect(() => {
    if (!showBackLink) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target as HTMLElement)?.closest("input,textarea,[contenteditable]")) navigate(backTo);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBackLink, backTo, navigate]);

  // Data
  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(agentId);
  const { data: allFunctions = [] } = useAgentFunctions();
  const { data: allConversations = [], isLoading: conversationsLoading } = useUnifiedConversations();
  const sendMessage = useSendConversationMessage();

  const agentBranchId = agent?.branch != null && String(agent.branch).trim() !== "" ? String(agent.branch) : null;

  const agentSkillOptions = useMemo((): SkillCommandOption[] => {
    const ids = new Set((agent?.functions ?? []).map((id) => String(id)));
    if (!ids.size) return [];
    return allFunctions.filter((f) => ids.has(String(f.id)) && f.is_active !== false).map((f) => {
      const slug = (f.slug && String(f.slug).trim()) || (f.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || String(f.id);
      return { id: String(f.id), name: f.name || slug, slug };
    }).filter((s) => s.slug);
  }, [agent?.functions, allFunctions]);

  const activeAgentConversations = useMemo(() =>
    allConversations.filter((c: UnifiedConversation) => String(c.agent) === agentId && c.source === "internal" && (c.status || "").toLowerCase().trim() === "active")
      .sort((a, b) => new Date(b.modified ?? 0).getTime() - new Date(a.modified ?? 0).getTime()),
    [allConversations, agentId],
  );

  // URL sync
  const mergeSearchParams = useCallback((updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (agentIdFromUrl || agentId) next.set("agent", agentIdFromUrl || agentId);
      for (const [k, v] of Object.entries(updates)) { v == null || v === "" ? next.delete(k) : next.set(k, v); }
      return next;
    }, { replace: true });
  }, [agentId, agentIdFromUrl, setSearchParams]);

  // Local state
  const [conversationId, setConversationId] = useState<string | null>(conversationIdFromUrl);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isDraftNew, setIsDraftNew] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [inspectMessage, setInspectMessage] = useState<InsightMessage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<"active" | "archived">("active");

  // Sync existing messages as "typed" before TypewriterText renders them.
  // This runs during render (safe: only mutates a module-level Set, no state/UI side effects).
  const lastMarkedConvRef = useRef<string | null>(null);
  if (messages.length > 0 && lastMarkedConvRef.current !== conversationId) {
    lastMarkedConvRef.current = conversationId;
    markAllTyped(messages.filter((m) => m.role === "agent").map((m) => String(m.id)));
  }

  // Composer
  const composer = useAgentChatComposer({ agentId, conversationId, isDraftNew, allFunctions, agentSkillOptions });

  // Streaming + conversation ops (combined hook)
  const streaming = useAgentChatStreaming({
    agentId, agent, agentBranchId, conversationId, setConversationId, setMessages, setIsDraftNew,
    mergeSearchParams, navigate, activeAgentConversations,
    attachedSkills: composer.attachedSkills, replyTo: composer.replyTo, setReplyTo: composer.setReplyTo,
    clearComposer: composer.clearComposer, queryClient,
  });

  // Sync conversationIdRef
  useEffect(() => { streaming.conversationIdRef.current = conversationId; }, [conversationId]);

  const isBusy = sendMessage.isPending || streaming.isStreaming;
  const typingActive = useAnyTyping();

  // Scroll
  const { endRef: messagesEndRef, bindViewport, showJump, scrollToBottom } = useStickyChatScroll([messages, isBusy, streaming.isStreaming], { behavior: streaming.isStreaming ? "auto" : "smooth" });

  const typingPinRef = useRef(true);
  const viewportElRef = useRef<HTMLElement | null>(null);
  const bindViewportCapture = useCallback((node: HTMLElement | null) => { viewportElRef.current = node; bindViewport(node); }, [bindViewport]);

  useEffect(() => {
    const el = viewportElRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => { if (e.deltaY < 0) typingPinRef.current = false; else if (e.deltaY > 0 && (el.scrollHeight - el.scrollTop - el.clientHeight) <= 96) typingPinRef.current = true; };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [bindViewportCapture]);

  useEffect(() => {
    if (!(streaming.isStreaming || streaming.liveSteps.length > 0 || typingActive)) { typingPinRef.current = true; return; }
    let rafId: number;
    const loop = () => { if (typingPinRef.current && (streaming.isStreaming || streaming.liveSteps.length > 0 || hasActiveTyping())) { scrollToBottom("auto"); rafId = requestAnimationFrame(loop); } };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [streaming.isStreaming, streaming.liveSteps.length, typingActive, scrollToBottom]);

  // Remote messages
  const { data: remoteMessages, isLoading: messagesLoading } = useConversationMessages(conversationId ?? undefined, { refetchInterval: false });

  const prevConversationIdRef = useRef(conversationId);
  const initialScrollDoneRef = useRef(false);
  useEffect(() => { if (prevConversationIdRef.current !== conversationId) { initialScrollDoneRef.current = false; prevConversationIdRef.current = conversationId; } }, [conversationId]);
  useEffect(() => { if (!initialScrollDoneRef.current && messages.length > 0 && !streaming.isStreaming) { const t = setTimeout(() => { scrollToBottom(); initialScrollDoneRef.current = true; }, 150); return () => clearTimeout(t); } }, [messages.length, streaming.isStreaming, scrollToBottom]);

  // Reset on conversation change
  useEffect(() => {
    composer.setReplyTo(null);
    streaming.streamedIdsRef.current.clear();
    clearTypingSeen();
    lastMarkedConvRef.current = null;
    requestAnimationFrame(() => scrollToBottom());
  }, [conversationId, scrollToBottom]);

  useEffect(() => {
    streaming.streamAbortRef.current?.abort();
    streaming.streamAbortRef.current = null;
    streaming.streamGenerationRef.current += 1;
  }, [conversationId]);

  // URL sync effects
  useEffect(() => {
    if (newConversationFromUrl) { streaming.skipAutoSelectRef.current = true; setIsDraftNew(true); setConversationId(null); setMessages([]); return; }
    if (conversationIdFromUrl && !streaming.skipAutoSelectRef.current) { setIsDraftNew(false); setConversationId(conversationIdFromUrl); return; }
    if (!conversationIdFromUrl && streaming.skipAutoSelectRef.current) setConversationId(null);
  }, [conversationIdFromUrl, newConversationFromUrl]);

  useEffect(() => {
    if (streaming.creatingConversationRef.current) { streaming.creatingConversationRef.current = false; streaming.lastRemoteMessagesRef.current = ""; return; }
    streaming.lastRemoteMessagesRef.current = "";
    streaming.streamAbortRef.current?.abort();
    streaming.streamAbortRef.current = null;
    streaming.streamGenerationRef.current += 1;
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || isDraftNew || !remoteMessages || streaming.isStreaming) return;
    const next = normalizeAgentChatMessages(remoteMessages);
    if (!next.length && streaming.welcomeOnlyConversationRef.current === conversationId) return;
    streaming.welcomeOnlyConversationRef.current = null;
    const key = JSON.stringify(next.map((m) => ({ id: m.id, content: m.content })));
    if (key === streaming.lastRemoteMessagesRef.current) return;
    streaming.lastRemoteMessagesRef.current = key;
    for (const m of next) streaming.historyIdsRef.current.add(String(m.id));
    setMessages(next);
  }, [remoteMessages, conversationId, isDraftNew, streaming.isStreaming]);

  useEffect(() => () => { streaming.streamAbortRef.current?.abort(); }, []);

  // Reset on agent change
  useEffect(() => {
    streaming.streamedIdsRef.current.clear();
    streaming.historyIdsRef.current.clear();
    setMessages([]);
    setInitialized(false);
    streaming.skipAutoSelectRef.current = false;
    setIsDraftNew(false);
    setConversationId(conversationIdFromUrl);
    streaming.lastRemoteMessagesRef.current = "";
    streaming.creatingConversationRef.current = false;
    streaming.creatingPromiseRef.current = null;
    streaming.welcomeOnlyConversationRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // Auto-select conversation
  useEffect(() => {
    if (agentLoading || !agent || initialized || conversationsLoading) return;
    if (streaming.newConversationModeRef.current) return;
    setInitialized(true);
    if (streaming.skipAutoSelectRef.current || newConversationFromUrl) {
      if (newConversationFromUrl) { streaming.skipAutoSelectRef.current = true; setIsDraftNew(true); setConversationId(null); setMessages([]); }
      return;
    }
    if (conversationIdFromUrl) { setConversationId(conversationIdFromUrl); return; }
    const lastActive = activeAgentConversations[0];
    if (lastActive) { setConversationId(String(lastActive.id)); mergeSearchParams({ conversation: String(lastActive.id), new: null }); return; }
    streaming.skipAutoSelectRef.current = true;
    setIsDraftNew(true);
    setConversationId(null);
    setMessages([]);
  }, [agentLoading, agent, initialized, conversationsLoading, conversationIdFromUrl, newConversationFromUrl, activeAgentConversations, mergeSearchParams]);

  // Derived
  const chatPhase = deriveChatPhase({ agentLoading, conversationsLoading, initialized, messagesLoading, hasMessages: messages.length > 0, conversationId, isDraftNew, isCreating: streaming.isCreating, isStreaming: streaming.isStreaming, sendPending: sendMessage.isPending, error: streaming.createError });

  const currentConversation = useMemo(() => {
    if (!conversationId) return null;
    return allConversations.find((c) => String(c.id) === conversationId && String(c.agent) === agentId) ?? null;
  }, [allConversations, conversationId, agentId]);

  const conversationStartedAt = useMemo(() => currentConversation?.created ?? messages.find((m) => m.created)?.created ?? null, [currentConversation?.created, messages]);
  const conversationLastActivity = useMemo(() => {
    if (currentConversation?.modified) return currentConversation.modified;
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i]?.created) return messages[i].created ?? null;
    return conversationStartedAt;
  }, [currentConversation?.modified, messages, conversationStartedAt]);

  const lastAgentIndex = useMemo(() => messages.map((m, i) => (m.role === "agent" ? i : -1)).filter((i) => i !== -1).pop() ?? -1, [messages]);
  const isReady = Boolean(agent?.is_active && (agent?.llm_model || agent?.llm_model_name));

  const filteredAgentConversations = useMemo(() =>
    allConversations.filter((c: UnifiedConversation) => {
      if (String(c.agent) !== agentId || c.source !== "internal") return false;
      const s = (c.status || "").toLowerCase().trim();
      return historyTab === "active" ? s === "active" : s === "archived" || s === "closed" || s === "inactive";
    }).sort((a, b) => new Date(b.modified ?? 0).getTime() - new Date(a.modified ?? 0).getTime()).slice(0, 50),
    [allConversations, agentId, historyTab],
  );

  const shellClass = fillParent ? "h-full w-full bg-background text-foreground flex flex-col overflow-hidden" : "h-[calc(100dvh-3.5rem)] w-full bg-background text-foreground flex flex-col overflow-hidden";

  if (agentLoading) return <div className={`${fillParent ? "h-full" : "h-[calc(100dvh-3.5rem)]"} w-full bg-background`}><PageSkeleton variant="chat" className="h-full max-w-none" padded={false} /></div>;
  if (agentError || !agent) return <div className={`${fillParent ? "h-full" : "h-[calc(100dvh-3.5rem)]"} w-full bg-background flex flex-col items-center justify-center gap-4 px-6`}><p className="text-destructive text-center">No se pudo cargar el agente.</p><Button asChild variant="outline"><Link to={backTo}><ArrowLeft className="h-4 w-4 mr-2" /> Volver</Link></Button></div>;

  return (
    <div className={shellClass}>
      <header className="flex shrink-0 flex-col gap-2 border-b border-border/50 bg-card/50 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:gap-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {showBackLink && <Button variant="ghost" size="sm" className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground" asChild><Link to={backTo} title="Volver (Esc)"><ArrowLeft className="h-4 w-4" /><span className="hidden text-xs font-medium sm:inline">Volver</span></Link></Button>}
          {agentSwitcher ? <ChatAgentPicker agents={agentSwitcher.agents} value={agentId} onChange={agentSwitcher.onChange} className="min-w-0 flex-1 justify-start" /> : (
            <><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10"><Bot className="h-4 w-4 text-primary" /></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{agent.name}</div><div className="truncate text-xs text-muted-foreground">{!isReady ? agent?.is_active ? "Sin modelo de lenguaje configurado" : "Agente inactivo" : agent.use_rag ? `RAG top ${agent.rag_top_k ?? "—"} · ${agent.embedding_model || "embedding default"}` : "RAG desactivado"}</div></div></>
          )}
          {!conversationId && <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:hidden"><Button variant="outline" size="sm" className="h-8 shrink-0 cursor-pointer px-2" onClick={() => void streaming.handleNewConversation()} disabled={streaming.isCreating} title="Nueva conversación">{streaming.isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquarePlus className="h-3.5 w-3.5" />}</Button></div>}
        </div>
        <div className="flex items-center gap-1.5 sm:ml-auto sm:gap-2">
          {headerExtra && <div className="min-w-0 flex-1 sm:flex-none">{headerExtra}</div>}
          {!conversationId && <Button variant="outline" size="sm" className="hidden shrink-0 cursor-pointer gap-1.5 sm:inline-flex" onClick={() => void streaming.handleNewConversation()} disabled={streaming.isCreating} title="Nueva conversación">{streaming.isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquarePlus className="h-3.5 w-3.5" />}<span>Nueva</span></Button>}
          {conversationId && (<>
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5 cursor-pointer" onClick={() => streaming.setEscalateOpen(true)} disabled={streaming.escalateConversation.isPending} title="Escalar a humano"><ArrowUpRight className="h-3.5 w-3.5" /><span className="hidden sm:inline">Escalar</span></Button>
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5 cursor-pointer" onClick={() => streaming.setConfirmCloseOpen(true)} disabled={streaming.closeConversation.isPending || streaming.updateStatus.isPending} title="Archivar conversación"><Archive className="h-3.5 w-3.5" /><span className="hidden sm:inline">Archivar</span></Button>
          </>)}
          <AgentChatHistorySheet open={sidebarOpen} onOpenChange={setSidebarOpen} historyTab={historyTab} onHistoryTabChange={setHistoryTab} conversations={filteredAgentConversations} conversationsLoading={conversationsLoading} conversationId={conversationId} updatePending={streaming.updateStatus.isPending} onSelect={streaming.handleSelectConversation} onArchive={streaming.handleArchiveConversation} onRestore={streaming.handleRestoreConversation} />
        </div>
      </header>

      {(conversationId || isDraftNew) && (
        <div className="border-b border-border/40 bg-muted/20 px-4 py-2 shrink-0">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {conversationId ? (<>
              <span className="font-medium text-foreground/80 tabular-nums">Conv. #{conversationId}</span>
              <span title={formatDateTime(conversationStartedAt) ?? undefined}>Inicio: <span className="text-foreground/70">{formatDateTime(conversationStartedAt) ?? "—"}</span></span>
              <span title={formatDateTime(conversationLastActivity) ?? undefined}>Última act.: <span className="text-foreground/70">{formatRelative(conversationLastActivity) ?? "—"}</span></span>
              <span>Mensajes: <span className="text-foreground/70 tabular-nums">{currentConversation?.message_count ?? messages.length}</span></span>
              {currentConversation?.status && <span className="capitalize">Estado: <span className="text-foreground/70">{(currentConversation.display_status || currentConversation.status).toLowerCase()}</span></span>}
            </>) : <span>Conversación nueva · se creará al enviar el primer mensaje</span>}
          </div>
        </div>
      )}

      <ChatThread viewportRef={bindViewportCapture} endRef={messagesEndRef} showJump={showJump} onJump={scrollToBottom} contentClassName="py-6 space-y-5">
        {messages.length > 0 && agent.use_rag && <ConversationRagSummary messages={messages} embeddingModel={agent.embedding_model} topK={agent.rag_top_k} />}
        {chatPhase === "resolving_thread" || chatPhase === "loading_history" ? <ChatThreadSkeleton className="min-h-[40vh] justify-start py-2" /> : messages.length === 0 && !isBusy ? (
          <EmptyState icon={<Bot className="h-5 w-5" />} title={streaming.isCreating ? "Iniciando conversación…" : `Chatea con ${agent.name}`} description={streaming.isCreating ? "Creando un chat nuevo…" : isDraftNew ? "Escribe el primer mensaje para abrir una conversación nueva." : `Escribe tu consulta y ${agent.name} te ayudará con lo que necesites.`} className="mt-8" action={!streaming.isCreating ? <div className="flex flex-wrap justify-center gap-2">{["¿Qué puedes hacer?", "Resume tu conocimiento", "Prueba una skill con /"].map((p) => <Button key={p} variant="outline" size="sm" className="text-xs" onClick={() => void streaming.handleSend(undefined, { text: p })}>{p}</Button>)}</div> : undefined} />
        ) : (
          messages.map((msg, idx) => {
            const isStreamingBubble = streaming.isStreaming && streaming.streamingMessageId != null && String(msg.id) === streaming.streamingMessageId;
            return <AgentChatMessage key={msg.id} msg={msg} isLastAgent={idx === lastAgentIndex} isStreamingBubble={isStreamingBubble} reduceMotion={reduceMotion} isBusy={isBusy} agent={agent} liveSteps={isStreamingBubble ? streaming.liveSteps : EMPTY_LIVE_STEPS} skipEntrance={streaming.historyIdsRef.current.has(String(msg.id))} onReply={composer.startReply} onResend={streaming.resendMessage} onInspect={setInspectMessage} />;
          })
        )}
      </ChatThread>

      {streaming.createError && <ErrorBanner variant="bar" message={streaming.createError} onRetry={() => void streaming.handleNewConversation()} />}

      <MessageInsightSheet open={Boolean(inspectMessage)} onOpenChange={(o) => { if (!o) setInspectMessage(null); }} message={inspectMessage} embeddingModel={agent.embedding_model} topK={agent.rag_top_k} flowPolicy={agent.flow_policy} />

      <div className="border-t border-border/50 bg-card/50 backdrop-blur px-4 py-3 sm:px-5 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatSkillCommand open={composer.skillMenuOpen && agentSkillOptions.length > 0} onOpenChange={composer.setSkillMenuOpen} skills={agentSkillOptions} query={composer.slashQuery?.query ?? ""} onSelect={composer.selectSkillCommand}>
            <ChatComposer ref={composer.textareaRef} value={composer.input} onChange={composer.setInput} onCursorChange={composer.setInputCursor} onSubmit={() => void streaming.handleSend(undefined, { text: composer.input })} placeholder={streaming.isCreating ? "Creando conversación..." : isBusy ? "El agente está respondiendo..." : composer.replyTo ? "Escribe tu respuesta…" : composer.attachedSkills.length > 0 ? "Añade un mensaje o envía la skill…" : isDraftNew || !conversationId ? "Escribe para iniciar… (/ para skills)" : "Escribe tu mensaje… (/ para skills)"} busy={isBusy} canStop={streaming.isStreaming} onStop={streaming.stopStreaming} canSubmit={composer.attachedSkills.length > 0} leading={composer.replyTo || composer.attachedSkills.length > 0 ? (
              <div className="space-y-2">
                {composer.replyTo && <div className="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2"><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold text-primary">Respondiendo a {composer.replyTo.role === "user" ? "ti" : "agente"}</p><p className="truncate text-xs text-muted-foreground">{composer.replyTo.preview}</p></div><button type="button" onClick={() => composer.setReplyTo(null)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" title="Cancelar respuesta"><X className="h-3.5 w-3.5" /></button></div>}
                {composer.attachedSkills.length > 0 && <div className="flex flex-wrap gap-1.5 px-0.5">{composer.attachedSkills.map((s) => { const p = Object.entries(s.params).filter(([, v]) => v.trim()).map(([k, v]) => `${k}=${v}`); return <span key={s.id} className="inline-flex items-center gap-1.5 max-w-full rounded-full border border-primary/35 bg-primary/10 pl-2.5 pr-1 py-1 text-[11px] font-medium text-primary" title={p.length ? `${s.name}: ${p.join(", ")}` : s.name}><Wrench className="h-3 w-3 shrink-0 opacity-80" /><span className="truncate">/{s.slug}{p.length > 0 && <span className="text-primary/70 font-normal"> · {p.slice(0, 2).join(", ")}{p.length > 2 ? "…" : ""}</span>}</span><button type="button" onClick={() => composer.setAttachedSkills((prev) => prev.filter((x) => x.id !== s.id))} className="shrink-0 rounded-full p-0.5 hover:bg-primary/20" aria-label={`Quitar ${s.name}`}><X className="h-3 w-3" /></button></span>; })}</div>}
              </div>
            ) : undefined} />
          </ChatSkillCommand>
        </div>
      </div>

      <Dialog open={Boolean(composer.pendingSkill)} onOpenChange={(o) => { if (!o) composer.setPendingSkill(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-base"><Wrench className="h-4 w-4 text-primary" />Parámetros de {composer.pendingSkill?.skill.name ?? "skill"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-1"><p className="text-xs text-muted-foreground">Esta skill necesita datos antes de ejecutarla.</p>{composer.pendingSkill?.fields.map((f) => <div key={f.key} className="space-y-1.5"><Label htmlFor={`skill-param-${f.key}`} className="text-xs capitalize">{f.label}</Label><Input id={`skill-param-${f.key}`} value={composer.pendingSkill?.values[f.key] ?? ""} onChange={(e) => composer.setPendingSkill((prev) => prev ? { ...prev, values: { ...prev.values, [f.key]: e.target.value } } : prev)} placeholder={f.description || f.key} className="h-9" autoFocus={f.key === composer.pendingSkill?.fields[0]?.key} /></div>)}</div>
          <DialogFooter className="gap-2 sm:gap-0"><Button type="button" variant="ghost" onClick={() => composer.setPendingSkill(null)}>Cancelar</Button><Button type="button" onClick={composer.confirmPendingSkill}>Añadir skill</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={streaming.escalateOpen} onOpenChange={(o) => { streaming.setEscalateOpen(o); if (!o) streaming.setEscalateReason(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-base">Escalar conversación</DialogTitle></DialogHeader>
          <div className="space-y-2 py-1"><Label htmlFor="escalate-reason" className="text-xs">Motivo</Label><Input id="escalate-reason" value={streaming.escalateReason} onChange={(e) => streaming.setEscalateReason(e.target.value)} placeholder="Ej. el usuario pide un humano" className="h-9" autoFocus onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); streaming.handleEscalateCurrent(); } }} /></div>
          <DialogFooter className="gap-2 sm:gap-0"><Button type="button" variant="ghost" onClick={() => streaming.setEscalateOpen(false)}>Cancelar</Button><Button type="button" disabled={!streaming.escalateReason.trim() || streaming.escalateConversation.isPending} onClick={streaming.handleEscalateCurrent}>{streaming.escalateConversation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}Escalar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={streaming.confirmCloseOpen} onOpenChange={streaming.setConfirmCloseOpen} title="¿Archivar esta conversación?" description="La conversación se archivará y saldrá del hilo activo. Podrás consultarla desde el historial." confirmLabel="Archivar conversación" busy={streaming.closeConversation.isPending || streaming.updateStatus.isPending} onConfirm={streaming.handleCloseCurrentConversation} />
    </div>
  );
}
