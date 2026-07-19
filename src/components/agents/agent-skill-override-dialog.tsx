import { useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SkillParameterSourcesEditor } from "@/components/skills/skill-parameter-sources-editor";
import {
  useAgent,
  useAgentSkillConfig,
  useResetAgentSkillConfig,
  useUpsertAgentSkillConfig,
} from "@/api/hooks/useAgents";
import type { AgentFunction, ParameterSource } from "@/api/hooks/useAgentFunctions";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  skill: AgentFunction | null;
}

export function AgentSkillOverrideDialog({ open, onOpenChange, agentId, skill }: Props) {
  const skillId = skill ? String(skill.id) : undefined;
  const { data: agent } = useAgent(agentId);
  const { data, isLoading, refetch } = useAgentSkillConfig(agentId, open ? skillId : undefined);
  const upsert = useUpsertAgentSkillConfig();
  const reset = useResetAgentSkillConfig();

  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState("");
  const [responseInstructions, setResponseInstructions] = useState("");
  const [customizeDescription, setCustomizeDescription] = useState(false);
  const [customizeInstructions, setCustomizeInstructions] = useState(false);
  const [sourcesDraft, setSourcesDraft] = useState<Record<string, ParameterSource>>({});

  const allowedKnowledgeIds = useMemo(
    () => (agent?.knowledge_documents ?? []).map((id) => String(id)),
    [agent?.knowledge_documents],
  );

  useEffect(() => {
    if (!data || !skill) return;
    setEnabled(data.enabled !== false);
    setCustomizeDescription(data.description != null);
    setCustomizeInstructions(data.response_instructions != null);
    setDescription(data.description ?? data.effective_description ?? skill.description ?? "");
    setResponseInstructions(
      data.response_instructions ??
        data.effective_response_instructions ??
        skill.response_instructions ??
        "",
    );
    setSourcesDraft(
      (data.parameter_sources ??
        data.effective_parameter_sources ??
        skill.config?.parameter_sources ??
        {}) as Record<string, ParameterSource>,
    );
  }, [data, skill]);

  if (!skill) return null;

  const hasParams = Object.keys(skill.parameters_schema?.properties ?? {}).length > 0;

  const save = () => {
    const cleanedSources: Record<string, ParameterSource> = {};
    for (const [k, v] of Object.entries(sourcesDraft)) {
      if (!v || v.source === "free") continue;
      cleanedSources[k] = v;
    }
    upsert.mutate(
      {
        agentId,
        skillId: String(skill.id),
        data: {
          enabled,
          description: customizeDescription ? description : null,
          response_instructions: customizeInstructions ? responseInstructions : null,
          parameter_sources: hasParams ? cleanedSources : null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Configuración del agente guardada");
          void refetch();
          onOpenChange(false);
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage ||
              "No se pudo guardar el override",
          ),
      },
    );
  };

  const restoreDefault = () => {
    reset.mutate(
      { agentId, skillId: String(skill.id) },
      {
        onSuccess: () => {
          toast.success("Volviste al default de la skill");
          void refetch();
          onOpenChange(false);
        },
        onError: () => toast.error("No se pudo restaurar"),
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col gap-0"
      >
        <SheetHeader className="px-5 py-4 border-b border-border/60 space-y-1 text-left">
          <SheetTitle className="flex flex-wrap items-center gap-2 pr-8">
            Configurar en este agente
            <span className="text-sm font-normal text-muted-foreground truncate">{skill.name}</span>
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Fuentes de parámetros, descripción e instrucciones solo para este agente.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-xl border px-4 py-3 bg-muted/20">
                <div>
                  <p className="text-sm font-medium">Habilitada para el LLM</p>
                  <p className="text-[11px] text-muted-foreground">
                    Si está off, el agente no ve esta skill.
                  </p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>

              <Badge
                variant={data?.is_customized ? "default" : "secondary"}
                className="text-[10px]"
              >
                {data?.is_customized ? "Personalizado" : "Usando default de la skill"}
              </Badge>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 rounded-xl border p-4 bg-card/40">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Descripción (cuándo invocar)</Label>
                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={customizeDescription}
                        onChange={(e) => setCustomizeDescription(e.target.checked)}
                      />
                      Personalizar
                    </label>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!customizeDescription}
                    rows={4}
                    className="text-sm min-h-[96px]"
                  />
                </div>

                <div className="space-y-2 rounded-xl border p-4 bg-card/40">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Instrucciones de respuesta</Label>
                    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={customizeInstructions}
                        onChange={(e) => setCustomizeInstructions(e.target.checked)}
                      />
                      Personalizar
                    </label>
                  </div>
                  <Textarea
                    value={responseInstructions}
                    onChange={(e) => setResponseInstructions(e.target.value)}
                    disabled={!customizeInstructions}
                    rows={4}
                    className="text-sm min-h-[96px]"
                  />
                </div>
              </div>

              {hasParams && (
                <div className="space-y-3 rounded-xl border p-4 bg-card/40">
                  <div>
                    <Label className="text-sm">Fuentes de parámetros</Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Solo documentos DATA ya asignados a este agente.
                    </p>
                  </div>
                  <SkillParameterSourcesEditor
                    parametersSchema={skill.parameters_schema}
                    sources={sourcesDraft}
                    onChange={setSourcesDraft}
                    branch={skill.branch}
                    allowedKnowledgeIds={allowedKnowledgeIds}
                    agentId={agentId}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <SheetFooter className="px-5 py-4 border-t border-border/60 flex-row flex-wrap gap-2 sm:justify-between">
          <div>
            {data?.is_customized && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={reset.isPending}
                onClick={restoreDefault}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Volver al default
              </Button>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="button" disabled={upsert.isPending || isLoading} onClick={save}>
              {upsert.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
              Guardar
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
