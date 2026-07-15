import { useMemo, useState } from "react";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AgentToolsPanel({ agentId }: { agentId: string }) {
  const { data: agent, isLoading: agentLoading } = useAgent(agentId);
  const { data: functions = [], isLoading: fnLoading } = useAgentFunctions();
  const update = useUpdateAgent();
  const assigned = useMemo(
    () => new Set((agent?.functions ?? []).map((id) => String(id))),
    [agent?.functions],
  );
  const [draft, setDraft] = useState<Set<string> | null>(null);
  const selected = draft ?? assigned;

  if (agentLoading || fnLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Herramientas del agente</CardTitle>
          <CardDescription>
            Selecciona funciones que el agente podrá llamar durante el chat.
          </CardDescription>
        </div>
        <Button
          size="sm"
          disabled={update.isPending || !draft}
          onClick={() => {
            update.mutate(
              { id: agentId, data: { functions: Array.from(selected) } },
              {
                onSuccess: () => {
                  toast.success("Funciones actualizadas");
                  setDraft(null);
                },
                onError: () => toast.error("No se pudo guardar"),
              },
            );
          }}
        >
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {functions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay funciones. Créalas en /funciones primero.
          </p>
        ) : (
          functions.map((fn) => {
            const id = String(fn.id);
            const checked = selected.has(id);
            return (
              <label
                key={id}
                className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:border-primary/40"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    const next = new Set(selected);
                    if (v) next.add(id);
                    else next.delete(id);
                    setDraft(next);
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{fn.name}</span>
                    <Badge variant={fn.is_active ? "default" : "secondary"} className="text-[10px]">
                      {fn.is_active ? "Activa" : "Off"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {fn.description || fn.slug || "Sin descripción"}
                  </p>
                </div>
              </label>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
