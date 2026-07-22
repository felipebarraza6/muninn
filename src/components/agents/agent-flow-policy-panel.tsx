import { useEffect, useMemo, useState } from "react";
import {
  GitBranch,
  Loader2,
  Save,
  Trash2,
  RotateCcw,
  Plus,
  X,
  MessageCircleQuestion,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgent, useAgentSkillConfigs, useUpdateAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import {
  emptyFlowPolicy,
  flowPolicyIsActive,
  normalizeFlowPolicy,
  type FlowPolicy,
  type FlowPolicySkillRule,
  type FlowPolicySlot,
} from "@/lib/flowPolicy";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = { agentId: string };

type SlotDraft = {
  id: string;
  ask: string;
  defaultValue: string;
};

type SkillRuleDraft = {
  slug: string;
  name: string;
  enabled: boolean;
  requires: string[];
  capture: string[];
  prerequisites: string[];
};

function slugifyId(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

function policyToSlotDrafts(policy: FlowPolicy): SlotDraft[] {
  return Object.entries(policy.slots ?? {}).map(([id, slot]) => ({
    id,
    ask: String(slot?.ask ?? ""),
    defaultValue: slot?.default != null ? String(slot.default) : "",
  }));
}

function policyToSkillDrafts(
  policy: FlowPolicy,
  assigned: { slug: string; name: string }[],
): SkillRuleDraft[] {
  const bySlug = new Map(assigned.map((a) => [a.slug, a]));
  const slugs = new Set([
    ...assigned.map((a) => a.slug),
    ...Object.keys(policy.skills ?? {}),
  ]);
  return Array.from(slugs)
    .sort()
    .map((slug) => {
      const rule = policy.skills?.[slug];
      const hasRule = Boolean(rule);
      return {
        slug,
        name: bySlug.get(slug)?.name || slug,
        enabled: hasRule,
        requires: [...(rule?.requires ?? [])],
        capture: [...(rule?.capture ?? [])],
        prerequisites: [...(rule?.prerequisites ?? [])],
      };
    });
}

function draftsToPolicy(slots: SlotDraft[], skills: SkillRuleDraft[]): FlowPolicy {
  const slotMap: Record<string, FlowPolicySlot> = {};
  for (const s of slots) {
    const id = slugifyId(s.id);
    if (!id) continue;
    const slot: FlowPolicySlot = {
      aliases: [id, id.charAt(0).toUpperCase() + id.slice(1)],
      ask: s.ask.trim() || `¿Podés indicar ${id}?`,
    };
    if (s.defaultValue.trim()) slot.default = s.defaultValue.trim();
    slotMap[id] = slot;
  }

  const skillMap: Record<string, FlowPolicySkillRule> = {};
  for (const sk of skills) {
    if (!sk.enabled) continue;
    const rule: FlowPolicySkillRule = {};
    if (sk.requires.length) rule.requires = sk.requires;
    if (sk.capture.length) rule.capture = sk.capture;
    if (sk.prerequisites.length) rule.prerequisites = sk.prerequisites;
    skillMap[sk.slug] = rule;
  }

  return { version: 1, slots: slotMap, skills: skillMap };
}

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

export function AgentFlowPolicyPanel({ agentId }: Props) {
  const { data: agent, isLoading, refetch } = useAgent(agentId);
  const agentBranchId = agent?.branch ?? null;
  const { data: catalog = [] } = useAgentFunctions({ branch: agentBranchId });
  const { data: skillConfigs = [] } = useAgentSkillConfigs(agentId);
  const updateAgent = useUpdateAgent();

  const savedPolicy = useMemo(
    () => normalizeFlowPolicy(agent?.flow_policy),
    [agent?.flow_policy],
  );

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

  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [skills, setSkills] = useState<SkillRuleDraft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [newSlotAsk, setNewSlotAsk] = useState("");
  const [newSlotId, setNewSlotId] = useState("");

  useEffect(() => {
    if (dirty) return;
    setSlots(policyToSlotDrafts(savedPolicy));
    setSkills(policyToSkillDrafts(savedPolicy, assignedSkills));
  }, [savedPolicy, assignedSkills, dirty]);

  const slotIds = useMemo(
    () => slots.map((s) => slugifyId(s.id)).filter(Boolean),
    [slots],
  );
  const draftPolicy = useMemo(() => draftsToPolicy(slots, skills), [slots, skills]);
  const active = flowPolicyIsActive(draftPolicy);

  const markDirty = () => setDirty(true);

  const save = (next: FlowPolicy) => {
    updateAgent.mutate(
      { id: agentId, data: { flow_policy: next } },
      {
        onSuccess: () => {
          toast.success("Flujo conversacional guardado");
          setDirty(false);
          refetch();
        },
        onError: () => toast.error("No se pudo guardar el flujo"),
      },
    );
  };

  const handleSave = () => {
    if (slots.some((s) => !slugifyId(s.id))) {
      toast.error("Cada dato debe tener un identificador (ej. fecha, profesional).");
      return;
    }
    const ids = slots.map((s) => slugifyId(s.id));
    if (new Set(ids).size !== ids.length) {
      toast.error("Hay datos con el mismo identificador.");
      return;
    }
    save(draftsToPolicy(slots, skills));
  };

  const handleClear = () => {
    setSlots([]);
    setSkills((prev) =>
      prev.map((s) => ({ ...s, enabled: false, requires: [], capture: [], prerequisites: [] })),
    );
    setDirty(true);
    save(emptyFlowPolicy());
  };

  const handleReset = () => {
    setSlots(policyToSlotDrafts(savedPolicy));
    setSkills(policyToSkillDrafts(savedPolicy, assignedSkills));
    setDirty(false);
  };

  const addSlot = () => {
    const ask = newSlotAsk.trim();
    const id = slugifyId(newSlotId || ask);
    if (!id) {
      toast.error("Escribí una pregunta o un nombre corto para el dato.");
      return;
    }
    if (slots.some((s) => slugifyId(s.id) === id)) {
      toast.error("Ese dato ya existe.");
      return;
    }
    setSlots((prev) => [...prev, { id, ask: ask || `¿Podés indicar ${id}?`, defaultValue: "" }]);
    setNewSlotAsk("");
    setNewSlotId("");
    markDirty();
  };

  const toggleListValue = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  if (isLoading || !agent) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 max-w-2xl">
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                Flujo de la conversación
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Acá definís <strong className="text-foreground/90 font-medium">qué datos</strong>{" "}
                debe reunir el agente antes de ejecutar una skill. Si falta algo, el agente{" "}
                <strong className="text-foreground/90 font-medium">pregunta al usuario</strong>{" "}
                en lugar de llamar la herramienta a medias.
              </CardDescription>
            </div>
            <Badge variant={active ? "default" : "secondary"} className="font-normal">
              {active ? "Activo" : "Sin reglas"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-3 sm:grid-cols-3 text-sm">
            <li className="rounded-xl border border-border/70 bg-muted/15 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-primary">
                <MessageCircleQuestion className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">1. Datos</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-snug">
                Creá los datos que necesitás (fecha, profesional, RUT…). Cada uno tiene una
                pregunta clara para el usuario.
              </p>
            </li>
            <li className="rounded-xl border border-border/70 bg-muted/15 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-primary">
                <ListChecks className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">2. Skills</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-snug">
                Por cada skill, marcá qué datos son obligatorios antes de ejecutarla y cuáles
                conviene recordar para después.
              </p>
            </li>
            <li className="rounded-xl border border-border/70 bg-muted/15 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">3. En chat</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-snug">
                Si el usuario pide agendar sin fecha, el agente pregunta la fecha y recién
                entonces llama la skill.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Datos que pedimos</CardTitle>
          <CardDescription>
            Son las piezas de información del flujo (slots). Ejemplo: profesional, fecha, RUT.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border/70 px-3 py-6 text-center">
              Todavía no hay datos. Agregá el primero abajo (ej. pregunta: «¿Para qué día?»).
            </p>
          ) : (
            <ul className="space-y-2">
              {slots.map((slot, idx) => (
                <li
                  key={`${slot.id}-${idx}`}
                  className="rounded-xl border border-border/70 bg-card/40 p-3 space-y-2"
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="grid flex-1 gap-2 sm:grid-cols-2 min-w-[12rem]">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Identificador
                        </Label>
                        <Input
                          value={slot.id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSlots((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, id: v } : s)),
                            );
                            markDirty();
                          }}
                          placeholder="fecha"
                          className="h-8 font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Valor por defecto (opcional)
                        </Label>
                        <Input
                          value={slot.defaultValue}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSlots((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, defaultValue: v } : s)),
                            );
                            markDirty();
                          }}
                          placeholder="Consulta general"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        const removed = slugifyId(slot.id);
                        setSlots((prev) => prev.filter((_, i) => i !== idx));
                        setSkills((prev) =>
                          prev.map((sk) => ({
                            ...sk,
                            requires: sk.requires.filter((r) => r !== removed),
                            capture: sk.capture.filter((r) => r !== removed),
                          })),
                        );
                        markDirty();
                      }}
                      aria-label="Quitar dato"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">
                      Pregunta al usuario
                    </Label>
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
                      className="text-sm min-h-[60px]"
                      placeholder="¿Para qué día necesitás la hora?"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-xl border border-dashed border-border/80 p-3 space-y-2">
            <p className="text-xs font-medium text-foreground">Agregar dato</p>
            <div className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]">
              <Input
                value={newSlotAsk}
                onChange={(e) => setNewSlotAsk(e.target.value)}
                placeholder="Pregunta: ¿Con qué profesional?"
                className="h-9"
              />
              <Input
                value={newSlotId}
                onChange={(e) => setNewSlotId(e.target.value)}
                placeholder="id: profesional"
                className="h-9 font-mono text-xs"
              />
              <Button type="button" size="sm" className="h-9" onClick={addSlot}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Si no ponés identificador, se genera desde la pregunta (ej. «profesional»).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Reglas por skill</CardTitle>
          <CardDescription>
            Activá una skill y marcá qué datos exige.{" "}
            <span className="text-amber-300/90">Obligatorios</span> = debe tenerlos antes de
            ejecutar. <span className="text-primary/90">Recordar</span> = guardar para el resto
            del chat. <span className="text-sky-300/90">Antes</span> = otra skill que debió
            correr primero.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border/70 px-3 py-6 text-center">
              Este agente no tiene skills asignadas. Andá a la pestaña{" "}
              <strong className="text-foreground/80 font-medium">Skills</strong> y agregá
              alguna.
            </p>
          ) : (
            <ul className="space-y-2">
              {skills.map((sk) => (
                <li
                  key={sk.slug}
                  className={cn(
                    "rounded-xl border p-3 space-y-3 transition-colors",
                    sk.enabled
                      ? "border-primary/25 bg-primary/[0.04]"
                      : "border-border/60 bg-card/30",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{sk.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{sk.slug}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={sk.enabled ? "default" : "outline"}
                      className="h-8"
                      onClick={() => {
                        setSkills((prev) =>
                          prev.map((s) =>
                            s.slug === sk.slug ? { ...s, enabled: !s.enabled } : s,
                          ),
                        );
                        markDirty();
                      }}
                    >
                      {sk.enabled ? "Con reglas" : "Sin reglas"}
                    </Button>
                  </div>

                  {sk.enabled && (
                    <div className="space-y-3">
                      {slotIds.length === 0 ? (
                        <p className="text-[12px] text-muted-foreground">
                          Primero creá al menos un dato arriba.
                        </p>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-amber-200/90">
                              Obligatorios antes de ejecutar
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slotIds.map((id) => (
                                <ToggleChip
                                  key={`req-${sk.slug}-${id}`}
                                  label={id}
                                  tone="amber"
                                  active={sk.requires.includes(id)}
                                  onToggle={() => {
                                    setSkills((prev) =>
                                      prev.map((s) =>
                                        s.slug === sk.slug
                                          ? {
                                              ...s,
                                              requires: toggleListValue(s.requires, id),
                                            }
                                          : s,
                                      ),
                                    );
                                    markDirty();
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-primary/90">
                              Recordar en la conversación
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {slotIds.map((id) => (
                                <ToggleChip
                                  key={`cap-${sk.slug}-${id}`}
                                  label={id}
                                  tone="mint"
                                  active={sk.capture.includes(id)}
                                  onToggle={() => {
                                    setSkills((prev) =>
                                      prev.map((s) =>
                                        s.slug === sk.slug
                                          ? {
                                              ...s,
                                              capture: toggleListValue(s.capture, id),
                                            }
                                          : s,
                                      ),
                                    );
                                    markDirty();
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {skills.filter((s) => s.slug !== sk.slug).length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-medium text-sky-200/90">
                            Debe ejecutarse antes (opcional)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {skills
                              .filter((s) => s.slug !== sk.slug)
                              .map((other) => (
                                <ToggleChip
                                  key={`pre-${sk.slug}-${other.slug}`}
                                  label={other.name}
                                  tone="sky"
                                  active={sk.prerequisites.includes(other.slug)}
                                  onToggle={() => {
                                    setSkills((prev) =>
                                      prev.map((s) =>
                                        s.slug === sk.slug
                                          ? {
                                              ...s,
                                              prerequisites: toggleListValue(
                                                s.prerequisites,
                                                other.slug,
                                              ),
                                            }
                                          : s,
                                      ),
                                    );
                                    markDirty();
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-background/95 p-2.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Button size="sm" disabled={updateAgent.isPending || !dirty} onClick={handleSave}>
          {updateAgent.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
          ) : (
            <Save className="h-3.5 w-3.5 mr-1.5" />
          )}
          Guardar flujo
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
          Quitar todas las reglas
        </Button>
        {dirty && (
          <span className="text-[11px] text-muted-foreground ml-auto">Cambios sin guardar</span>
        )}
      </div>
    </div>
  );
}
