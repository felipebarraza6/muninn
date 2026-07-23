import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GitBranch,
  Loader2,
  Save,
  Trash2,
  RotateCcw,
  Plus,
  X,
  MessageCircleQuestion,
  Sparkles,
  Link2,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAgent, useAgentSkillConfigs, useUpdateAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { FlowPolicyBoard } from "@/components/agents/flow-policy-board";
import {
  SLOT_EXAMPLES,
  draftsToPolicy,
  emptyFlowPolicy,
  flowPolicyIsActive,
  mergeSlotSuggestions,
  normalizeFlowPolicy,
  policyToSkillDrafts,
  policyToSlotDrafts,
  slugifySlotId,
  suggestSlotsFromSkillParams,
  FLOW_POLICY_PRESETS,
  countMissingSlotSuggestions,
  type FlowPolicy,
  type SkillRuleDraft,
  type SlotDraft,
} from "@/lib/flowPolicy";
import type { ParameterSource } from "@/api/hooks/useAgentFunctions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = { agentId: string };
type LinkMode = "requires" | "capture" | "prerequisites";

function ToggleChip({
  label,
  active,
  onToggle,
  tone = "default",
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  tone?: "default" | "amber" | "sky" | "mint";
}) {
  const activeCls =
    tone === "amber"
      ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
      : tone === "sky"
        ? "border-sky-500/40 bg-sky-500/15 text-sky-200"
        : tone === "mint"
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-primary/40 bg-primary/12 text-primary";
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-md border px-2 py-1 text-[11px] transition-colors",
        active
          ? activeCls
          : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function toggleList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function AgentFlowPolicyPanel({ agentId }: Props) {
  const { data: agent, isLoading, refetch } = useAgent(agentId);
  const agentBranchId = agent?.branch ?? null;
  const { data: catalog = [] } = useAgentFunctions({ branch: agentBranchId });
  const { data: skillConfigs = [] } = useAgentSkillConfigs(agentId);
  const updateAgent = useUpdateAgent();

  const savedPolicy = useMemo(() => normalizeFlowPolicy(agent?.flow_policy), [agent?.flow_policy]);

  const assignedSkills = useMemo(() => {
    const ids = new Set((agent?.functions ?? []).map(String));
    const fromCatalog = catalog
      .filter((fn) => ids.has(String(fn.id)) && fn.slug)
      .map((fn) => ({ slug: String(fn.slug), name: fn.name || String(fn.slug) }));
    const fromConfigs = skillConfigs
      .filter((c) => c.enabled !== false && c.agent_function_slug)
      .map((c) => ({
        slug: String(c.agent_function_slug),
        name: c.agent_function_name || String(c.agent_function_slug),
      }));
    const map = new Map<string, { slug: string; name: string }>();
    for (const s of [...fromCatalog, ...fromConfigs]) map.set(s.slug, s);
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [agent?.functions, catalog, skillConfigs]);

  /** Params de skills asignadas → candidatos a Datos (sin static). */
  const suggestedSlots = useMemo(() => {
    const ids = new Set((agent?.functions ?? []).map(String));
    const sourcesBySlug = new Map<string, Record<string, ParameterSource>>();
    for (const c of skillConfigs) {
      const slug = c.agent_function_slug ? String(c.agent_function_slug) : "";
      if (!slug) continue;
      const sources = c.effective_parameter_sources ?? c.parameter_sources ?? undefined;
      if (sources) sourcesBySlug.set(slug, sources);
    }
    const hints: { key: string; description?: string; source?: string }[] = [];
    for (const fn of catalog) {
      if (!ids.has(String(fn.id)) || !fn.slug) continue;
      const props = fn.parameters_schema?.properties ?? {};
      const sources =
        sourcesBySlug.get(String(fn.slug)) ??
        (fn.config?.parameter_sources as Record<string, ParameterSource> | undefined) ??
        {};
      for (const [key, prop] of Object.entries(props)) {
        const src = sources[key];
        hints.push({
          key,
          description: typeof prop?.description === "string" ? prop.description : undefined,
          source: src?.source,
        });
      }
    }
    return suggestSlotsFromSkillParams(hints);
  }, [agent?.functions, catalog, skillConfigs]);

  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [skills, setSkills] = useState<SkillRuleDraft[]>([]);
  const [layout, setLayout] = useState<Record<string, { x: number; y: number }>>({});
  const [dirty, setDirty] = useState(false);
  const [newSlotAsk, setNewSlotAsk] = useState("");
  const [newSlotId, setNewSlotId] = useState("");
  const [linkMode, setLinkMode] = useState<LinkMode>("requires");
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [datosOpen, setDatosOpen] = useState(true);
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const autosaveToastRef = useRef(false);
  const editEpochRef = useRef(0);

  const missingSuggestedCount = useMemo(
    () => countMissingSlotSuggestions(slots, suggestedSlots),
    [slots, suggestedSlots],
  );

  const agentSlug = agent?.slug ? String(agent.slug) : "";
  const knownPreset = agentSlug ? FLOW_POLICY_PRESETS[agentSlug] : undefined;

  useEffect(() => {
    if (dirty) return;
    setSlots(policyToSlotDrafts(savedPolicy));
    setSkills(policyToSkillDrafts(savedPolicy, assignedSkills));
    setLayout(savedPolicy.layout ?? {});
  }, [savedPolicy, assignedSkills, dirty]);

  useEffect(() => {
    if (!zenMode) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZenMode(false);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [zenMode]);

  const slotIds = useMemo(() => slots.map((s) => slugifySlotId(s.id)).filter(Boolean), [slots]);
  const draftPolicy = useMemo(
    () => draftsToPolicy(slots, skills, layout),
    [slots, skills, layout],
  );
  const active = flowPolicyIsActive(draftPolicy);
  const markDirty = useCallback(() => {
    editEpochRef.current += 1;
    setDirty(true);
  }, []);
  const enabledSkills = useMemo(() => skills.filter((s) => s.enabled), [skills]);
  const offSkills = useMemo(() => skills.filter((s) => !s.enabled), [skills]);
  const enabledRulesCount = enabledSkills.length;

  const enableSkill = useCallback(
    (slug: string) => {
      setSkills((prev) => {
        const cur = prev.find((s) => s.slug === slug);
        if (cur?.enabled) return prev;
        return prev.map((s) => (s.slug === slug ? { ...s, enabled: true } : s));
      });
      markDirty();
    },
    [markDirty],
  );

  const onToggleRequires = useCallback(
    (skill: string, slot: string) => {
      setSkills((prev) =>
        prev.map((s) => (s.slug === skill ? { ...s, requires: toggleList(s.requires, slot) } : s)),
      );
      markDirty();
    },
    [markDirty],
  );

  const onToggleCapture = useCallback(
    (skill: string, slot: string) => {
      setSkills((prev) =>
        prev.map((s) => (s.slug === skill ? { ...s, capture: toggleList(s.capture, slot) } : s)),
      );
      markDirty();
    },
    [markDirty],
  );

  const onTogglePrerequisite = useCallback(
    (skill: string, other: string) => {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.slug !== skill) return s;
          // Si ya usa prerequisites_any (flujo WM), togglamos ahí.
          if (s.prerequisitesAny.length > 0) {
            return { ...s, prerequisitesAny: toggleList(s.prerequisitesAny, other) };
          }
          return { ...s, prerequisites: toggleList(s.prerequisites, other) };
        }),
      );
      markDirty();
    },
    [markDirty],
  );

  const onLayoutChange = useCallback(
    (next: Record<string, { x: number; y: number }>) => {
      setLayout(next);
      markDirty();
    },
    [markDirty],
  );

  const save = useCallback(
    (next: FlowPolicy, opts?: { silent?: boolean }) => {
      const epoch = editEpochRef.current;
      updateAgent.mutate(
        { id: agentId, data: { flow_policy: next } },
        {
          onSuccess: () => {
            void refetch().then(() => {
              if (editEpochRef.current !== epoch) return;
              if (!opts?.silent) toast.success("DataRules guardado");
              else if (!autosaveToastRef.current) {
                autosaveToastRef.current = true;
                toast.message("Guardado automático", { duration: 1600 });
                window.setTimeout(() => {
                  autosaveToastRef.current = false;
                }, 2500);
              }
              setDirty(false);
            });
          },
          onError: () => toast.error("No se pudo guardar"),
        },
      );
    },
    [agentId, refetch, updateAgent],
  );

  // Autosave al menor cambio (debounce).
  useEffect(() => {
    if (!dirty) return;
    if (slots.some((s) => !slugifySlotId(s.id))) return;
    const ids = slots.map((s) => slugifySlotId(s.id));
    if (new Set(ids).size !== ids.length) return;
    const t = window.setTimeout(() => {
      save(draftsToPolicy(slots, skills, layout), { silent: true });
    }, 700);
    return () => window.clearTimeout(t);
  }, [dirty, slots, skills, layout, save]);

  const handleSave = () => {
    if (slots.some((s) => !slugifySlotId(s.id))) {
      toast.error("Cada dato necesita un identificador (ej. fecha).");
      return;
    }
    const ids = slots.map((s) => slugifySlotId(s.id));
    if (new Set(ids).size !== ids.length) {
      toast.error("Hay datos con el mismo identificador.");
      return;
    }
    save(draftsToPolicy(slots, skills, layout));
  };

  const handleClear = () => {
    setSlots([]);
    setSkills((prev) =>
      prev.map((s) => ({
        ...s,
        enabled: false,
        requires: [],
        capture: [],
        prerequisites: [],
        prerequisitesAny: [],
        optionalDefaults: {},
      })),
    );
    setLayout({});
    markDirty();
    save(emptyFlowPolicy());
  };

  const handleReset = () => {
    setSlots(policyToSlotDrafts(savedPolicy));
    setSkills(policyToSkillDrafts(savedPolicy, assignedSkills));
    setLayout(savedPolicy.layout ?? {});
    setDirty(false);
  };

  const restoreKnownPreset = () => {
    if (!knownPreset) return;
    setSlots(policyToSlotDrafts(knownPreset));
    setSkills(policyToSkillDrafts(knownPreset, assignedSkills));
    setLayout({});
    markDirty();
    setDatosOpen(true);
    setSkillsOpen(true);
    toast.message("Preset WM cargado", {
      description: "Revisá la pizarra y guardá si está bien.",
    });
  };

  const addSlot = (preset?: (typeof SLOT_EXAMPLES)[number]) => {
    const ask = (preset?.ask ?? newSlotAsk).trim();
    const id = slugifySlotId(preset?.id ?? (newSlotId || ask));
    if (!id) {
      toast.error("Escribí una pregunta o elegí un ejemplo.");
      return;
    }
    if (slots.some((s) => slugifySlotId(s.id) === id)) {
      toast.error("Ese dato ya existe.");
      return;
    }
    setSlots((prev) => [
      ...prev,
      {
        id,
        ask: ask || `¿Podés indicar ${id}?`,
        defaultValue: preset?.defaultValue ?? "",
      },
    ]);
    setNewSlotAsk("");
    setNewSlotId("");
    setCreatingSlot(false);
    setDatosOpen(true);
    markDirty();
  };

  const fillSlotsFromSkills = () => {
    if (suggestedSlots.length === 0) {
      toast.message("Tus skills no tienen params libres para sugerir.");
      return;
    }
    const merged = mergeSlotSuggestions(slots, suggestedSlots);
    const added = merged.length - slots.length;
    if (added === 0) {
      toast.message("Ya tenés cubiertos los params de tus skills.");
      return;
    }
    // Solo agrega al final; no toca ask/aliases/defaults existentes.
    setSlots(merged);
    setDatosOpen(true);
    markDirty();
    toast.success(`Se agregaron ${added} dato${added === 1 ? "" : "s"} que faltaban`);
  };

  const removeSlot = (idx: number) => {
    const removed = slugifySlotId(slots[idx]?.id ?? "");
    setSlots((prev) => prev.filter((_, i) => i !== idx));
    if (removed) {
      setSkills((prev) =>
        prev.map((sk) => ({
          ...sk,
          requires: sk.requires.filter((r) => r !== removed),
          capture: sk.capture.filter((r) => r !== removed),
        })),
      );
    }
    markDirty();
  };

  if (isLoading || !agent) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const workspace = (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-background",
        zenMode
          ? "h-full min-h-0"
          : "h-[calc(100dvh-13.5rem)] min-h-[520px] max-h-[860px] rounded-xl border border-border/70",
      )}
    >
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Repisa: solo ella scrollea */}
        <aside className="flex w-[min(100%,300px)] shrink-0 flex-col overflow-hidden border-r border-border/60 bg-muted/15 sm:w-[320px]">
          <div className="shrink-0 space-y-3 border-b border-border/50 px-3 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                  <GitBranch className="h-3.5 w-3.5 text-primary shrink-0" />
                  DataRules
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                  Datos y reglas en la repisa. La pizarra no se mueve.
                </p>
              </div>
              <Badge
                variant={active ? "default" : "secondary"}
                className="shrink-0 font-normal text-[10px]"
              >
                {active ? "Activo" : "Sin reglas"}
              </Badge>
            </div>

            <Button
              type="button"
              size="sm"
              className="w-full h-8"
              onClick={() => {
                setCreatingSlot(true);
                setDatosOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Nuevo dato
            </Button>
            {knownPreset && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full h-8"
                onClick={restoreKnownPreset}
                title="Restaura el flujo oficial de agendamiento Clínica WM"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Restaurar flujo WM
              </Button>
            )}
            {suggestedSlots.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full h-8"
                disabled={missingSuggestedCount === 0}
                onClick={fillSlotsFromSkills}
                title="Agrega params de tus skills (omite valores static de la config)"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {slots.length === 0
                  ? `Desde skills (${suggestedSlots.length})`
                  : missingSuggestedCount > 0
                    ? `Completar skills (${missingSuggestedCount})`
                    : "Skills al día"}
              </Button>
            )}
            <p className="px-0.5 text-[10px] text-muted-foreground leading-snug">
              {knownPreset
                ? "Flujo WM: horas/próxima → crear cita (con consentimiento). Estado es independiente."
                : "No pongas en Datos lo que ya es static en la skill (IDs fijos, sede…)."}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 space-y-2">
            {creatingSlot && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium">Nuevo dato</p>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setCreatingSlot(false)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={newSlotAsk}
                  onChange={(e) => setNewSlotAsk(e.target.value)}
                  placeholder="Pregunta al usuario"
                  className="h-8 text-xs"
                />
                <Input
                  value={newSlotId}
                  onChange={(e) => setNewSlotId(e.target.value)}
                  placeholder="id (ej. fecha)"
                  className="h-8 font-mono text-xs"
                />
                <div className="flex flex-wrap gap-1">
                  {SLOT_EXAMPLES.map((ex) => (
                    <Button
                      key={ex.id}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px] px-1.5"
                      disabled={slots.some((s) => slugifySlotId(s.id) === ex.id)}
                      onClick={() => addSlot(ex)}
                    >
                      {ex.id}
                    </Button>
                  ))}
                </div>
                <Button type="button" size="sm" className="w-full h-7" onClick={() => addSlot()}>
                  Agregar
                </Button>
              </div>
            )}

            <Collapsible open={datosOpen} onOpenChange={setDatosOpen}>
              <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted/40">
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    !datosOpen && "-rotate-90",
                  )}
                />
                <MessageCircleQuestion className="h-3.5 w-3.5 text-amber-400" />
                Datos
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px] font-normal">
                  {slots.length}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 px-1 pb-2 pt-1">
                {slots.length === 0 ? (
                  <div className="space-y-2 px-1 py-2 text-center">
                    <p className="text-[11px] text-muted-foreground">
                      Sin datos. Podés rellenar desde tus skills o crear uno.
                    </p>
                    {suggestedSlots.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-7 text-[11px]"
                        onClick={fillSlotsFromSkills}
                      >
                        Rellenar desde skills ({suggestedSlots.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  slots.map((slot, idx) => (
                    <div
                      key={`${slot.id}-${idx}`}
                      className="rounded-lg bg-muted/30 px-2.5 py-2 space-y-1.5"
                    >
                      <div className="flex items-start gap-1">
                        <Input
                          value={slot.id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSlots((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, id: v } : s)),
                            );
                            markDirty();
                          }}
                          placeholder="id"
                          className="h-7 font-mono text-[11px] flex-1"
                          title="Identificador"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeSlot(idx)}
                          aria-label="Quitar dato"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Textarea
                        value={slot.ask}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSlots((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, ask: v } : s)),
                          );
                          markDirty();
                        }}
                        rows={2}
                        className="text-[11px] min-h-[52px] resize-none"
                        placeholder="Pregunta al usuario"
                      />
                      <Input
                        value={slot.defaultValue}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSlots((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, defaultValue: v } : s)),
                          );
                          markDirty();
                        }}
                        placeholder="Default (opcional)"
                        className="h-7 text-[11px]"
                      />
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={skillsOpen} onOpenChange={setSkillsOpen}>
              <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted/40">
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    !skillsOpen && "-rotate-90",
                  )}
                />
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Skills
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px] font-normal">
                  {enabledRulesCount}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 px-1 pb-2 pt-1">
                <p className="px-1 text-[10px] text-muted-foreground leading-snug">
                  Solo skills activas en DataRules. Uní en la pizarra o tocá chips acá.
                </p>
                {skills.length === 0 ? (
                  <p className="px-1 py-3 text-[11px] text-muted-foreground text-center">
                    Sin skills asignadas. Andá al tab Skills.
                  </p>
                ) : enabledSkills.length === 0 ? (
                  <p className="px-1 py-3 text-[11px] text-muted-foreground text-center">
                    Ninguna skill activa. Activá una abajo o uní un dato en la pizarra.
                  </p>
                ) : (
                  enabledSkills.map((sk) => (
                    <div
                      key={sk.slug}
                      className="rounded-lg bg-primary/8 px-2.5 py-2 space-y-2 ring-1 ring-primary/20"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium truncate">{sk.name}</p>
                          <p className="font-mono text-[9px] text-muted-foreground truncate">
                            {sk.slug}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          className="h-6 text-[10px] px-2 shrink-0"
                          onClick={() => {
                            setSkills((prev) =>
                              prev.map((s) =>
                                s.slug === sk.slug
                                  ? {
                                      ...s,
                                      enabled: false,
                                      requires: [],
                                      capture: [],
                                      prerequisites: [],
                                      prerequisitesAny: [],
                                      optionalDefaults: {},
                                    }
                                  : s,
                              ),
                            );
                            markDirty();
                          }}
                        >
                          On
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {slotIds.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground">Creá datos primero.</p>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-amber-200/90">Obligatorios</Label>
                              <div className="flex flex-wrap gap-1">
                                {slotIds.map((id) => (
                                  <ToggleChip
                                    key={`req-${sk.slug}-${id}`}
                                    label={id}
                                    tone="amber"
                                    active={sk.requires.includes(id)}
                                    onToggle={() => onToggleRequires(sk.slug, id)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-primary/90">Recordar</Label>
                              <div className="flex flex-wrap gap-1">
                                {slotIds.map((id) => (
                                  <ToggleChip
                                    key={`cap-${sk.slug}-${id}`}
                                    label={id}
                                    tone="mint"
                                    active={sk.capture.includes(id)}
                                    onToggle={() => onToggleCapture(sk.slug, id)}
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        {enabledSkills.filter((s) => s.slug !== sk.slug).length > 0 && (
                          <div className="space-y-1">
                            <Label className="text-[10px] text-sky-200/90">
                              Antes
                              {sk.prerequisitesAny.length > 0 ? " (alguna)" : ""}
                            </Label>
                            <div className="flex flex-wrap gap-1">
                              {enabledSkills
                                .filter((s) => s.slug !== sk.slug)
                                .map((other) => {
                                  const active =
                                    sk.prerequisitesAny.includes(other.slug) ||
                                    sk.prerequisites.includes(other.slug);
                                  return (
                                    <ToggleChip
                                      key={`pre-${sk.slug}-${other.slug}`}
                                      label={other.name}
                                      tone="sky"
                                      active={active}
                                      onToggle={() => onTogglePrerequisite(sk.slug, other.slug)}
                                    />
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {offSkills.length > 0 && (
                  <div className="space-y-1.5 border-t border-border/40 pt-2">
                    <p className="px-1 text-[10px] text-muted-foreground">
                      Off · {offSkills.length} (asignadas, sin reglas)
                    </p>
                    <div className="flex flex-wrap gap-1 px-1">
                      {offSkills.map((sk) => (
                        <Button
                          key={sk.slug}
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 max-w-full truncate text-[10px] px-2"
                          title={`Activar ${sk.name}`}
                          onClick={() => enableSkill(sk.slug)}
                        >
                          {sk.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </aside>

        {/* Pizarra fija: no scrollea con la repisa */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border/50 bg-muted/10 px-3 py-2">
            <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-[11px] text-muted-foreground mr-0.5">Modo al arrastrar:</span>
            {(
              [
                ["requires", "Obligatorio", "amber"],
                ["capture", "Recordar", "mint"],
                ["prerequisites", "Antes", "sky"],
              ] as const
            ).map(([mode, label, tone]) => (
              <ToggleChip
                key={mode}
                label={label}
                tone={tone}
                active={linkMode === mode}
                onToggle={() => setLinkMode(mode)}
              />
            ))}
            <span className="text-[10px] text-muted-foreground hidden lg:inline max-w-[220px] leading-snug">
              {linkMode === "prerequisites"
                ? "Arrastrá skill → skill"
                : "Arrastrá dato → skill (no alcanza con el chip)"}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground hidden xl:inline mr-1">
                Clic en línea para quitar
              </span>
              <Button
                type="button"
                size="sm"
                variant={zenMode ? "secondary" : "outline"}
                className="h-7 gap-1.5 text-[11px]"
                onClick={() => setZenMode((v) => !v)}
                title={zenMode ? "Salir de pantalla completa (Esc)" : "Pantalla completa"}
              >
                {zenMode ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Salir</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Zen</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden p-2">
            <FlowPolicyBoard
              slots={slots}
              skills={skills}
              linkMode={linkMode}
              layout={layout}
              onLayoutChange={onLayoutChange}
              onEnableSkill={enableSkill}
              onToggleRequires={onToggleRequires}
              onToggleCapture={onToggleCapture}
              onTogglePrerequisite={onTogglePrerequisite}
              fillHeight
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 flex flex-wrap items-center gap-2 border-t border-border/60 bg-card/80 px-3 py-2">
        <Button size="sm" disabled={updateAgent.isPending || !dirty} onClick={handleSave}>
          {updateAgent.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <Save className="h-3.5 w-3.5 mr-1.5" />
          )}
          Guardar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!dirty || updateAgent.isPending}
          onClick={handleReset}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Descartar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={updateAgent.isPending}
          onClick={handleClear}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Vaciar
        </Button>
        {dirty && (
          <span className="text-[11px] text-muted-foreground ml-auto">Cambios sin guardar</span>
        )}
      </div>
    </div>
  );

  if (zenMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col h-dvh max-h-dvh overflow-hidden bg-background supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
        {workspace}
      </div>
    );
  }

  return workspace;
}
