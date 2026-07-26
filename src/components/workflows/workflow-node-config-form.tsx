import { useMemo, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkflowNodeType } from "@/api/hooks/useWorkflows";
import { useAgents } from "@/api/hooks/useAgents";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { useLlmModels } from "@/api/hooks/useLlm";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { cn } from "@/lib/utils";

type Props = {
  nodeType: WorkflowNodeType | string;
  config: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

function str(v: unknown, fallback = ""): string {
  if (v == null) return fallback;
  return String(v);
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-[10px] text-muted-foreground leading-snug">{hint}</p> : null}
    </div>
  );
}

const ACTION_OPTIONS = [
  { value: "noop", label: "Noop (no hace nada)" },
  { value: "log", label: "Log (mensaje de depuración)" },
  { value: "set_context", label: "Set context (mergear valores)" },
  { value: "fail", label: "Fail (forzar error)" },
] as const;

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export function WorkflowNodeConfigForm({ nodeType, config, onChange }: Props) {
  const { data: agents = [] } = useAgents({ is_active: true });
  const { data: functions = [] } = useAgentFunctions();
  const { data: modelsResult } = useLlmModels({ isActive: true, pageSize: 100 });
  const { data: externalApis = [] } = useExternalAPIs({ scope: "store" });

  const models = useMemo(() => {
    if (!modelsResult) return [];
    if (Array.isArray(modelsResult)) return modelsResult;
    return modelsResult.results ?? [];
  }, [modelsResult]);

  const patch = (partial: Record<string, unknown>) => onChange({ ...config, ...partial });

  const actionName = str(config.action_name || config.action, "noop");
  const delaySeconds = num(config.delay_seconds ?? config.seconds, 60);
  const selectedApiId = str(config.external_api_id || config.api_id);
  const selectedApi = externalApis.find((a) => String(a.id) === selectedApiId);
  const endpointKeys = useMemo(() => {
    const eps = selectedApi?.endpoints;
    if (!eps || typeof eps !== "object") return [] as string[];
    return Object.keys(eps);
  }, [selectedApi]);

  if (nodeType === "trigger") {
    return (
      <p className="text-[11px] text-muted-foreground rounded-md border border-dashed px-2.5 py-2 leading-relaxed">
        Punto de entrada del flujo. No necesita configuración extra: recibe el{" "}
        <code className="text-[10px]">trigger_data</code> al ejecutar.
      </p>
    );
  }

  if (nodeType === "agent") {
    return (
      <div className="space-y-2.5">
        <Field label="Agente" hint="Slug del agente de Studio">
          <Select
            value={str(config.agent_slug) || undefined}
            onValueChange={(v) => patch({ agent_slug: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Elige un agente" />
            </SelectTrigger>
            <SelectContent>
              {agents
                .filter((a) => a.slug)
                .map((a) => (
                  <SelectItem key={a.id} value={a.slug!}>
                    {a.name || a.slug}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Mensaje / tarea">
          <Textarea
            value={str(config.message)}
            onChange={(e) => patch({ message: e.target.value })}
            rows={3}
            className="text-xs min-h-[72px]"
            placeholder="Qué debe hacer el agente…"
          />
        </Field>
        <Field label="Max iteraciones">
          <Input
            type="number"
            min={1}
            max={20}
            value={num(config.max_iterations, 4)}
            onChange={(e) => patch({ max_iterations: Number(e.target.value) || 4 })}
            className="h-8 text-xs"
          />
        </Field>
      </div>
    );
  }

  if (nodeType === "llm") {
    return (
      <div className="space-y-2.5">
        <Field label="Modelo">
          <Select
            value={config.model_id != null ? String(config.model_id) : undefined}
            onValueChange={(v) => patch({ model_id: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Elige un modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={String(m.id)} value={String(m.id)}>
                  {m.name}
                  {m.provider_name ? ` · ${m.provider_name}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="System prompt">
          <Textarea
            value={str(config.system_prompt)}
            onChange={(e) => patch({ system_prompt: e.target.value })}
            rows={2}
            className="text-xs"
            placeholder="Instrucciones del sistema…"
          />
        </Field>
        <Field label="User message" hint="Podés usar {{variables}} del contexto">
          <Textarea
            value={str(config.user_message || config.prompt)}
            onChange={(e) => patch({ user_message: e.target.value, prompt: e.target.value })}
            rows={3}
            className="text-xs min-h-[72px]"
            placeholder="Prompt del usuario…"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Temperature">
            <Input
              type="number"
              step="0.1"
              min={0}
              max={2}
              value={num(config.temperature, 0.7)}
              onChange={(e) => patch({ temperature: Number(e.target.value) })}
              className="h-8 text-xs"
            />
          </Field>
          <Field label="Max tokens">
            <Input
              type="number"
              min={1}
              value={num(config.max_tokens, 2000)}
              onChange={(e) => patch({ max_tokens: Number(e.target.value) || 2000 })}
              className="h-8 text-xs"
            />
          </Field>
        </div>
      </div>
    );
  }

  if (nodeType === "function") {
    return (
      <div className="space-y-2.5">
        <Field label="Skill / función">
          <Select
            value={str(config.function_id) || undefined}
            onValueChange={(v) => {
              const fn = functions.find((f) => String(f.id) === v);
              patch({
                function_id: v,
                function_slug: fn?.slug || undefined,
              });
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Elige una skill" />
            </SelectTrigger>
            <SelectContent>
              {functions.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {f.name}
                  {f.slug ? ` · ${f.slug}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Parámetros (JSON)" hint="Se renderizan con el contexto del workflow">
          <Textarea
            value={
              typeof config.parameters === "string"
                ? config.parameters
                : JSON.stringify(config.parameters ?? {}, null, 2)
            }
            onChange={(e) => {
              try {
                patch({ parameters: JSON.parse(e.target.value || "{}") });
              } catch {
                patch({ parameters: e.target.value });
              }
            }}
            rows={4}
            className="font-mono text-[11px]"
          />
        </Field>
      </div>
    );
  }

  if (nodeType === "action") {
    return (
      <div className="space-y-2.5">
        <Field label="Acción">
          <Select value={actionName} onValueChange={(v) => patch({ action_name: v, action: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {(actionName === "log" || actionName === "fail") && (
          <Field label="Mensaje">
            <Textarea
              value={str(config.message)}
              onChange={(e) => patch({ message: e.target.value })}
              rows={2}
              className="text-xs"
            />
          </Field>
        )}
        {actionName === "set_context" && (
          <Field label="Values (JSON)" hint="Objeto a mergear en el contexto">
            <Textarea
              value={
                typeof config.values === "string"
                  ? config.values
                  : JSON.stringify(config.values ?? {}, null, 2)
              }
              onChange={(e) => {
                try {
                  patch({ values: JSON.parse(e.target.value || "{}") });
                } catch {
                  patch({ values: e.target.value });
                }
              }}
              rows={4}
              className="font-mono text-[11px]"
            />
          </Field>
        )}
      </div>
    );
  }

  if (nodeType === "condition") {
    return (
      <Field label="Expresión" hint="Ej: context.score > 0.5  ·  True">
        <Textarea
          value={str(config.expression, "True")}
          onChange={(e) => patch({ expression: e.target.value })}
          rows={3}
          className="font-mono text-xs"
          placeholder="True"
        />
      </Field>
    );
  }

  if (nodeType === "delay") {
    return (
      <Field label="Segundos de espera">
        <Input
          type="number"
          min={0}
          value={delaySeconds}
          onChange={(e) => {
            const s = Number(e.target.value) || 0;
            patch({ delay_seconds: s, seconds: s });
          }}
          className="h-8 text-xs"
        />
      </Field>
    );
  }

  if (nodeType === "api_call") {
    return (
      <div className="space-y-2.5">
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <Field label="Método">
            <Select value={str(config.method, "GET")} onValueChange={(v) => patch({ method: v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="URL / path">
            <Input
              value={str(config.url || config.path)}
              onChange={(e) => patch({ url: e.target.value, path: e.target.value })}
              className="h-8 text-xs"
              placeholder="https://…"
            />
          </Field>
        </div>
        <Field label="Body (JSON opcional)">
          <Textarea
            value={
              typeof config.body === "string"
                ? config.body
                : JSON.stringify(config.body ?? {}, null, 2)
            }
            onChange={(e) => {
              try {
                patch({ body: JSON.parse(e.target.value || "{}") });
              } catch {
                patch({ body: e.target.value });
              }
            }}
            rows={3}
            className="font-mono text-[11px]"
          />
        </Field>
      </div>
    );
  }

  if (nodeType === "external_api") {
    return (
      <div className="space-y-2.5">
        <Field label="App externa">
          <Select
            value={selectedApiId || undefined}
            onValueChange={(v) => patch({ external_api_id: v, api_id: v, endpoint_key: "" })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Elige una app" />
            </SelectTrigger>
            <SelectContent>
              {externalApis.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.name || a.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Endpoint">
          <Select
            value={str(config.endpoint_key || config.path) || undefined}
            onValueChange={(v) => patch({ endpoint_key: v, path: v })}
            disabled={!selectedApiId}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={selectedApiId ? "Endpoint" : "Elige la app primero"} />
            </SelectTrigger>
            <SelectContent>
              {endpointKeys.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Método">
          <Select value={str(config.method, "GET")} onValueChange={(v) => patch({ method: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    );
  }

  if (nodeType === "webhook") {
    return (
      <div className="space-y-2.5">
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <Field label="Método">
            <Select value={str(config.method, "POST")} onValueChange={(v) => patch({ method: v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="URL">
            <Input
              value={str(config.url)}
              onChange={(e) => patch({ url: e.target.value })}
              className="h-8 text-xs"
              placeholder="https://…"
            />
          </Field>
        </div>
        <Field label="Payload (JSON)">
          <Textarea
            value={
              typeof config.payload === "string"
                ? config.payload
                : JSON.stringify(config.payload ?? {}, null, 2)
            }
            onChange={(e) => {
              try {
                patch({ payload: JSON.parse(e.target.value || "{}") });
              } catch {
                patch({ payload: e.target.value });
              }
            }}
            rows={3}
            className="font-mono text-[11px]"
          />
        </Field>
      </div>
    );
  }

  if (nodeType === "message") {
    return (
      <div className="space-y-2.5">
        <Field label="Mensaje" hint="Soporta {{variables}} del contexto">
          <Textarea
            value={str(config.message || config.text)}
            onChange={(e) => patch({ message: e.target.value, text: e.target.value })}
            rows={3}
            className="text-xs min-h-[72px]"
          />
        </Field>
        <Field label="Channel ID (opcional)">
          <Input
            value={str(config.channel_id)}
            onChange={(e) => patch({ channel_id: e.target.value })}
            className="h-8 text-xs"
          />
        </Field>
        <Field label="External user ID (opcional)">
          <Input
            value={str(config.external_user_id)}
            onChange={(e) => patch({ external_user_id: e.target.value })}
            className="h-8 text-xs"
          />
        </Field>
      </div>
    );
  }

  if (nodeType === "database") {
    return (
      <div className="space-y-2.5">
        <Field label="Query type">
          <Select
            value={str(config.query_type, "orm")}
            onValueChange={(v) => patch({ query_type: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orm">ORM</SelectItem>
              <SelectItem value="raw">Raw SQL</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Model / query">
          <Textarea
            value={str(config.model || config.query)}
            onChange={(e) => patch({ model: e.target.value, query: e.target.value })}
            rows={3}
            className="font-mono text-xs"
            placeholder="app.Model o SELECT…"
          />
        </Field>
        <Field label="Limit">
          <Input
            type="number"
            min={1}
            value={num(config.limit, 100)}
            onChange={(e) => patch({ limit: Number(e.target.value) || 100 })}
            className="h-8 text-xs"
          />
        </Field>
      </div>
    );
  }

  return (
    <p className={cn("text-[11px] text-muted-foreground")}>
      Sin formulario tipado para «{nodeType}». Usa JSON avanzado abajo.
    </p>
  );
}
