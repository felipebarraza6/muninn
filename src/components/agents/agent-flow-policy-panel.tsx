import { useCallback, useEffect, useMemo, useState } from "react";
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
  LayoutGrid,
  Sparkles,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgent, useAgentSkillConfigs, useUpdateAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { FlowPolicyBoard } from "@/components/agents/flow-policy-board";
import {
  SLOT_EXAMPLES,
  draftsToPolicy,
  emptyFlowPolicy,
  flowPolicyIsActive,
  normalizeFlowPolicy,
  policyToSkillDrafts,
  policyToSlotDrafts,
  slugifySlotId,
  type FlowPolicy,
  type SkillRuleDraft,
  type SlotDraft,
} from "@/lib/flowPolicy";
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

  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [skills, setSkills] = useState<SkillRuleDraft[]>([]);
  const [dirty, setDirty] = useState(false);
  const [newSlotAsk, setNewSlotAsk] = useState("");
  const [newSlotId, setNewSlotId] = useState("");
  const [linkMode, setLinkMode] = useState<LinkMode>("requires");
  const [tab, setTab] = useState("pizarra");

  useEffect(() => {
    if (dirty) return;
    setSlots(policyToSlotDrafts(savedPolicy));
    setSkills(policyToSkillDrafts(savedPolicy, assignedSkills));
  }, [savedPolicy, assignedSkills, dirty]);

  const slotIds = useMemo(() => slots.map((s) => slugifySlotId(s.id)).filter(Boolean), [slots]);
  const draftPolicy = useMemo(() => draftsToPolicy(slots, skills), [slots, skills]);
  const active = flowPolicyIsActive(draftPolicy);
  const markDirty = useCallback(() => setDirty(true), []);

  const enableSkill = useCallback((slug: string) => {
    setSkills((prev) => {
      const cur = prev.find((s) => s.slug === slug);
      if (cur?.enabled) return prev;
      return prev.map((s) => (s.slug === slug ? { ...s, enabled: true } : s));
    });
    setDirty(true);
  }, []);

  const onToggleRequires = useCallback((skill: string, slot: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.slug === skill ? { ...s, requires: toggleList(s.requires, slot) } : s)),
    );
    setDirty(true);
  }, []);

  const onToggleCapture = useCallback((skill: string, slot: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.slug === skill ? { ...s, capture: toggleList(s.capture, slot) } : s)),
    );
    setDirty(true);
  }, []);

  const onTogglePrerequisite = useCallback((skill: string, other: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.slug === skill ? { ...s, prerequisites: toggleList(s.prerequisites, other) } : s,
      ),
    );
    setDirty(true);
  }, []);

  const save = (next: FlowPolicy) => {
    updateAgent.mutate(
      { id: agentId, data: { flow_policy: next } },
      {
        onSuccess: () => {
          toast.success("Conversación guardada");
          setDirty(false);
          refetch();
        },
        onError: () => toast.error("No se pudo guardar"),
      },
    );
  };

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
    markDirty();
  };

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
                Conversación guiada
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                El agente reúne datos y recién ahí ejecuta skills. Sin JSON: datos, reglas o la
                pizarra para conectar cajas.
              </CardDescription>
            </div>
            <Badge variant={active ? "default" : "secondary"} className="font-normal">
              {active ? "Activo" : "Sin reglas"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3 text-[12px] text-muted-foreground">
          <div className="flex gap-2 rounded-lg border border-border/60 bg-muted/15 px-3 py-2">
            <MessageCircleQuestion className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong className="text-foreground/90">Datos</strong> = lo que preguntamos (fecha,
              profesional…).
            </span>
          </div>
          <div className="flex gap-2 rounded-lg border border-border/60 bg-muted/15 px-3 py-2">
            <ListChecks className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              <strong className="text-foreground/90">Reglas</strong> = qué pide cada skill antes de
              correr.
            </span>
          </div>
          <div className="flex gap-2 rounded-lg border border-border/60 bg-muted/15 px-3 py-2">
            <LayoutGrid className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
            <span>
              <strong className="text-foreground/90">Pizarra</strong> = unís cajas con el mouse.
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-3">
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="pizarra" className="gap-1.5 text-xs sm:text-sm">
            <LayoutGrid className="h-3.5 w-3.5" />
            Pizarra
          </TabsTrigger>
          <TabsTrigger value="datos" className="gap-1.5 text-xs sm:text-sm">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            Datos
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              {slots.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reglas" className="gap-1.5 text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Reglas
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
              {skills.filter((s) => s.enabled).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pizarra" className="space-y-3 mt-0">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-3 py-2">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">Al unir, crear:</span>
            {(
              [
                ["requires", "Obligatorio", "amber"],
                ["capture", "Recordar", "mint"],
                ["prerequisites", "Antes (skill→skill)", "sky"],
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
            <span className="text-[11px] text-muted-foreground ml-auto hidden sm:inline">
              Clic en una línea para quitarla
            </span>
          </div>
          <FlowPolicyBoard
            slots={slots}
            skills={skills}
            linkMode={linkMode}
            onEnableSkill={enableSkill}
            onToggleRequires={onToggleRequires}
            onToggleCapture={onToggleCapture}
            onTogglePrerequisite={onTogglePrerequisite}
          />
          {slots.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Tip: andá a{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => setTab("datos")}
              >
                Datos
              </button>{" "}
              y sumá un ejemplo en un clic.
            </p>
          )}
        </TabsContent>

        <TabsContent value="datos" className="space-y-3 mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">¿Qué es cada campo?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3 text-[12px]">
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 space-y-1">
                <p className="font-semibold text-amber-200">Identificador</p>
                <p className="text-muted-foreground leading-snug">
                  Nombre interno corto, sin espacios. Ej:{" "}
                  <code className="text-[10px] text-foreground/80">fecha</code>,{" "}
                  <code className="text-[10px] text-foreground/80">profesional</code>.
                </p>
              </div>
              <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 space-y-1">
                <p className="font-semibold text-primary">Pregunta al usuario</p>
                <p className="text-muted-foreground leading-snug">
                  Lo que dice el agente en el chat. Ej: «¿Para qué día necesitás la hora?»
                </p>
              </div>
              <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 p-3 space-y-1">
                <p className="font-semibold text-sky-200">Valor por defecto</p>
                <p className="text-muted-foreground leading-snug">
                  Opcional. Si el usuario no responde, se usa esto (ej. motivo = «Consulta
                  general»).
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-muted-foreground self-center mr-1">Ejemplos:</span>
            {SLOT_EXAMPLES.map((ex) => (
              <Button
                key={ex.id}
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                disabled={slots.some((s) => slugifySlotId(s.id) === ex.id)}
                onClick={() => addSlot(ex)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {ex.id}
              </Button>
            ))}
          </div>

          {slots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
              Todavía no hay datos. Tocá un ejemplo arriba o creá uno abajo.
            </div>
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
                        <Label className="text-[11px] text-muted-foreground">Identificador</Label>
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
                        const removed = slugifySlotId(slot.id);
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
                    <Label className="text-[11px] text-muted-foreground">Pregunta al usuario</Label>
                    <Textarea
                      value={slot.ask}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, ask: v } : s)));
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
            <p className="text-xs font-medium">Agregar dato a mano</p>
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
              <Button type="button" size="sm" className="h-9" onClick={() => addSlot()}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reglas" className="space-y-3 mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Leyenda</CardTitle>
              <CardDescription>
                Activá una skill y marcá chips.{" "}
                <span className="text-amber-300/90">Obligatorios</span> antes de ejecutar ·{" "}
                <span className="text-primary/90">Recordar</span> para el resto del chat ·{" "}
                <span className="text-sky-300/90">Antes</span> = otra skill previa.
              </CardDescription>
            </CardHeader>
          </Card>

          {skills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
              Este agente no tiene skills. Andá a la pestaña{" "}
              <strong className="text-foreground/80">Skills</strong> del agente y asigná alguna.
            </div>
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
                          prev.map((s) => (s.slug === sk.slug ? { ...s, enabled: !s.enabled } : s)),
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
                          Primero creá datos en la pestaña Datos.
                        </p>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-amber-200/90">
                              Obligatorios
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
                                          ? { ...s, requires: toggleList(s.requires, id) }
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
                            <p className="text-[11px] font-medium text-primary/90">Recordar</p>
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
                                          ? { ...s, capture: toggleList(s.capture, id) }
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
                            Debe ejecutarse antes
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
                                              prerequisites: toggleList(
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
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-background/95 p-2.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
}
