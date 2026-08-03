import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { chatDraftKey, loadChatDraft, saveChatDraft } from "@/lib/chatDrafts";
import {
  getSlashSkillQuery,
  removeSlashQuery,
  type SkillCommandOption,
} from "@/components/chat/chat-skill-command";
import { getSkillRequiredFreeParams } from "@/lib/chatSkillParams";
import { previewText, type AgentChatMessage as ChatMessage, type AgentChatReplyTarget as ReplyTarget } from "@/lib/agentChatMessages";
import type { AgentFunction } from "@/api/hooks/useAgentFunctions";

export type AttachedSkill = {
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

type Options = {
  agentId: string;
  conversationId: string | null;
  isDraftNew: boolean;
  allFunctions: AgentFunction[];
  agentSkillOptions: SkillCommandOption[];
};

export function useAgentChatComposer({
  agentId,
  conversationId,
  isDraftNew,
  allFunctions,
  agentSkillOptions,
}: Options) {
  const [input, setInput] = useState("");
  const [inputCursor, setInputCursor] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachedSkills, setAttachedSkills] = useState<AttachedSkill[]>([]);
  const [pendingSkill, setPendingSkill] = useState<PendingSkillParams | null>(null);
  const [skillMenuOpen, setSkillMenuOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);

  // Draft hydration
  const draftHydratingRef = useRef(false);

  useEffect(() => {
    draftHydratingRef.current = true;
    const key = chatDraftKey("studio", conversationId);
    setInput(loadChatDraft(key));
    const id = requestAnimationFrame(() => {
      draftHydratingRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [conversationId, isDraftNew]);

  useEffect(() => {
    if (draftHydratingRef.current) return;
    const key = chatDraftKey("studio", conversationId);
    const t = window.setTimeout(() => saveChatDraft(key, input), 300);
    return () => clearTimeout(t);
  }, [input, conversationId]);

  // Slash query
  const slashQuery = useMemo(() => getSlashSkillQuery(input, inputCursor), [input, inputCursor]);

  useEffect(() => {
    if (!agentSkillOptions.length) {
      setSkillMenuOpen(false);
      return;
    }
    setSkillMenuOpen(Boolean(slashQuery));
  }, [slashQuery, agentSkillOptions.length]);

  // Reset on agent change
  useEffect(() => {
    setAttachedSkills([]);
    setPendingSkill(null);
    setSkillMenuOpen(false);
  }, [agentId]);

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

  const startReply = useCallback((msg: ChatMessage) => {
    setReplyTo({
      id: msg.id,
      role: msg.role,
      preview: previewText(msg.content),
    });
  }, []);

  const clearComposer = useCallback(() => {
    setInput("");
    setInputCursor(0);
    setSkillMenuOpen(false);
    setAttachedSkills([]);
    setReplyTo(null);
  }, []);

  return {
    input,
    setInput,
    inputCursor,
    setInputCursor,
    textareaRef,
    attachedSkills,
    setAttachedSkills,
    pendingSkill,
    setPendingSkill,
    skillMenuOpen,
    setSkillMenuOpen,
    slashQuery,
    selectSkillCommand,
    confirmPendingSkill,
    replyTo,
    setReplyTo,
    startReply,
    clearComposer,
  };
}
