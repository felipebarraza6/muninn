import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Globe,
  Layers,
  Play,
  Plus,
  RefreshCw,
  Terminal,
  Trash2,
  Variable,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { POST } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ApiRefreshConfig,
  ApiRefreshMappingType,
  ApiRefreshPayloadVariables,
  ApiRefreshIntegrationStrategy,
  ApiRefreshIntegrationMode,
} from "@/api/hooks/useKnowledge";
import { useKnowledge } from "@/api/hooks/useKnowledge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

/* ---- Constantes ---- */

const CRON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "0 * * * *", label: "Cada 1 hora" },
  { value: "0 */6 * * *", label: "Cada 6 horas" },
  { value: "0 */12 * * *", label: "Cada 12 horas" },
  { value: "0 0 * * *", label: "Cada 24 horas" },
  { value: "custom", label: "Personalizado" },
];

const STRATEGY_OPTIONS: Array<{ value: ApiRefreshIntegrationMode; label: string }> = [
  { value: "append", label: "Incremental" },
  { value: "replace", label: "Reemplazar" },
];

const SYSTEM_VARS = ["today", "yesterday", "now"];

const STEPS = [
  { id: 1, icon: Globe, label: "Endpoint", desc: "API y endpoint" },
  { id: 2, icon: Variable, label: "Variables", desc: "Asignar valores" },
  { id: 3, icon: Terminal, label: "Contenido", desc: "Campos disponibles" },
  { id: 4, icon: Layers, label: "Integrar", desc: "Estrategia + template" },
  { id: 5, icon: FlaskConical, label: "Test", desc: "Probar y ver logs" },
] as const;

const SYS_VAR_OPTIONS = [
  { value: "", label: "Valor fijo", desc: "Escribes el valor manualmente" },
  { value: "{{today}}", label: "Fecha del cron", desc: "Se asigna la fecha de ejecución" },
  { value: "{{now}}", label: "Fecha y hora", desc: "Se asigna fecha+hora de ejecución" },
  { value: "{{yesterday}}", label: "Día anterior", desc: "Se asigna el día anterior" },
] as const;

/* ---- Util ---- */

function extractPlaceholders(cfg: Record<string, unknown> | undefined): string[] {
  if (!cfg) return [];
  const s = new Set<string>();
  const r = /\{\{(\w+)\}\}/g;
  const scan = (v: unknown) => {
    if (typeof v === "string") {
      let m;
      while ((m = r.exec(v)) !== null) s.add(m[1]);
    } else if (typeof v === "object" && v !== null) {
      for (const x of Object.values(v)) scan(x);
    }
  };
  scan(cfg);
  return Array.from(s).sort();
}

/* ---- Mapping default por tipo de conocimiento ---- */

const MAPPING_BY_KNOWLEDGE_TYPE: Record<string, ApiRefreshMappingType> = {
  DATA: "json_to_table",
  FAQ: "raw_string",
  DOCUMENT: "raw_string",
  POLICY: "raw_string",
  PROCEDURE: "raw_string",
  API_DOC: "json_path",
  CODE: "raw_string",
  CUSTOM: "raw_string",
};

/* ---- Props ---- */

interface Props {
  value: ApiRefreshConfig | null;
  onChange: (next: ApiRefreshConfig | null) => void;
  disabled?: boolean;
  branch?: string | number | null;
  /** Tipo de conocimiento (DATA, FAQ, DOCUMENT, etc.) para auto-seleccionar el mapping. */
  knowledgeType?: string;
}

/* ---- Componente ---- */

export function KnowledgeCronJobTab({
  value,
  onChange,
  disabled = false,
  branch,
  knowledgeType = "DOCUMENT",
}: Props) {
  const enabled = value != null;
  const [step, setStep] = useState(1);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs({ branch });

  const selectedApi = useMemo(
    () => apis.find((a) => String(a.id) === String(value?.external_api_id)),
    [apis, value?.external_api_id],
  );
  const endpointKeys = useMemo(() => Object.keys(selectedApi?.endpoints ?? {}), [selectedApi]);
  const isCustomCron = enabled && !CRON_OPTIONS.some((o) => o.value === value.cron);

  const currentEndpointConfig = useMemo(
    () =>
      (selectedApi?.endpoints ?? {})[value?.endpoint ?? ""] as
        | (Record<string, unknown> & { response_mapping?: Record<string, unknown> })
        | undefined,
    [selectedApi, value?.endpoint],
  );
  const endpointPlaceholders = useMemo(
    () => extractPlaceholders(currentEndpointConfig),
    [currentEndpointConfig],
  );
  const endpointResponseMapping = useMemo(
    () => currentEndpointConfig?.response_mapping,
    [currentEndpointConfig],
  );
  const apiResponseMapping = useMemo(() => {
    const all = (selectedApi?.endpoints_response_mapping ?? {}) as Record<string, unknown>;
    return value?.endpoint
      ? (all[value.endpoint] as Record<string, unknown> | undefined)
      : undefined;
  }, [selectedApi, value?.endpoint]);

  /* Auto-descubrir variables + mapping al cambiar endpoint */
  useEffect(() => {
    if (!value?.endpoint || !currentEndpointConfig) return;

    /* Auto-poblar payload_variables */
    const cur = value.payload_variables || {};
    const changed = endpointPlaceholders.some((k) => !(k in cur));
    const nextPayload = changed ? { ...cur } : undefined;
    if (changed) {
      for (const k of endpointPlaceholders) {
        if (!(k in nextPayload!)) nextPayload![k] = "";
      }
    }

    /* Auto-poblar content_mapping desde response_mapping del endpoint */
    const rm = endpointResponseMapping || apiResponseMapping;
    let nextMapping = undefined as { path?: string; columns?: string[] } | undefined;

    if (rm && typeof rm === "object") {
      const entries = Object.entries(rm);
      if (entries.length > 0 && !value.content_mapping.path) {
        const firstPath = entries[0][1];
        if (typeof firstPath === "string" && firstPath.includes(".")) {
          const parts = firstPath.split(".");
          const suggestedPath = parts.slice(0, -1).join(".");
          if (suggestedPath) nextMapping = { path: suggestedPath };
        } else if (typeof firstPath === "string") {
          nextMapping = { path: firstPath };
        }
      }
    }

    if (nextPayload || nextMapping) {
      onChange({
        ...value,
        ...(nextPayload ? { payload_variables: nextPayload } : {}),
        ...(nextMapping
          ? {
              content_mapping: { ...value.content_mapping, ...nextMapping },
            }
          : {}),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.endpoint]);

  /* Helpers */
  const patch = (p: Partial<ApiRefreshConfig>) => {
    if (!value) return;
    onChange({ ...value, ...p });
  };
  const patchMapping = (p: Partial<ApiRefreshConfig["content_mapping"]>) => {
    if (!value) return;
    onChange({ ...value, content_mapping: { ...value.content_mapping, ...p } });
  };
  const patchIntegration = (p: Partial<ApiRefreshIntegrationStrategy>) => {
    if (!value) return;
    onChange({
      ...value,
      integration_strategy: { ...(value.integration_strategy || { mode: "replace" }), ...p },
    });
  };
  const patchPayloadVariables = (vars: ApiRefreshPayloadVariables) => {
    if (!value) return;
    onChange({ ...value, payload_variables: vars });
  };

  const mappingType = value?.content_mapping.type ?? "json_to_table";
  const strategyMode = value?.integration_strategy?.mode ?? "replace";
  const columns = value?.content_mapping.columns ?? [];
  const hasConfig = value?.external_api_id && value?.endpoint;

  /* Test handler */
  const handleTest = async () => {
    if (!value || !hasConfig) {
      toast.error("Completa los pasos 1-4 primero");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const knowledgeId = (value as unknown as { _id?: string })._id || "current";
      const res = await POST(ENDPOINTS.knowledge.refresh(knowledgeId), {});
      setTestResult(res as Record<string, unknown>);
      const ok = (res as Record<string, unknown>)?.success ?? false;
      toast.success(ok ? "CronJob ejecutado correctamente" : "El test reporto errores");
    } catch (err) {
      setTestResult({ success: false, error: String(err) });
      toast.error("Error al ejecutar test");
    } finally {
      setTesting(false);
    }
  };

  /* ---- Sin configuracion ---- */
  if (!enabled) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8">
        <div className="rounded-full bg-muted p-3">
          <RefreshCw className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center max-w-sm space-y-1">
          <h3 className="text-sm font-medium">Sin CronJob</h3>
          <p className="text-xs text-muted-foreground">
            Un CronJob actualiza este conocimiento automaticamente consultando un endpoint externo.
          </p>
        </div>
        <Button
          onClick={() =>
            onChange({
              external_api_id: "",
              endpoint: "",
              cron: "0 */6 * * *",
              content_mapping: {
                type: MAPPING_BY_KNOWLEDGE_TYPE[knowledgeType] || "raw_string",
                path: "",
                columns: [],
              },
            })
          }
        >
          <Plus className="h-4 w-4 mr-1.5" /> Configurar CronJob
        </Button>
      </div>
    );
  }

  /* ---- Flow cliqueable ---- */
  const renderFlow = () => (
    <div className="flex items-center justify-between gap-0 px-1 sm:px-2">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-0 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (s.id <= step + 1) setStep(s.id);
            }}
            className={[
              "flex items-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg transition-all duration-150",
              "text-left min-w-0 w-full",
              step === s.id ? "bg-primary/10 text-primary shadow-sm" : "",
              step > s.id ? "text-emerald-600 hover:bg-muted/50" : "",
              step < s.id ? "text-muted-foreground/40 cursor-not-allowed" : "hover:bg-muted/30",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                step === s.id ? "bg-primary text-primary-foreground" : "",
                step > s.id ? "bg-emerald-500 text-white" : "",
                step < s.id ? "bg-muted text-muted-foreground/40" : "",
              ].join(" ")}
            >
              {step > s.id ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : s.id}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className={["text-xs font-medium leading-tight", step < s.id ? "" : ""].join(" ")}>
                {s.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight truncate">{s.desc}</p>
            </div>
          </button>
          {i < STEPS.length - 1 && (
            <div
              className={[
                "h-px flex-1 mx-1 hidden sm:block",
                step > s.id ? "bg-emerald-300" : "bg-border",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );

  /* ---- Navigation ---- */
  const renderNav = () => (
    <div className="flex items-center justify-between pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={step <= 1}
        onClick={() => setStep((p) => p - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
      </Button>
      <div className="flex items-center gap-2">
        {step < STEPS.length ? (
          <Button type="button" size="sm" onClick={() => setStep((p) => p + 1)}>
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button type="button" size="sm" disabled={testing || !hasConfig} onClick={handleTest}>
            {testing ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1.5" />
            )}
            Ejecutar test
          </Button>
        )}
      </div>
    </div>
  );

  /* ---- Step Content ---- */
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Selecciona API y endpoint</h3>
              <p className="text-xs text-muted-foreground mb-4">
                El CronJob consultara este endpoint periodicamente para obtener datos actualizados.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">External API</Label>
                <Select
                  value={value.external_api_id || undefined}
                  onValueChange={(v) => patch({ external_api_id: v, endpoint: "" })}
                  disabled={disabled || apisLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={apisLoading ? "Cargando..." : "Selecciona API"} />
                  </SelectTrigger>
                  <SelectContent>
                    {apis.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Endpoint</Label>
                <Select
                  value={value.endpoint || undefined}
                  onValueChange={(v) => patch({ endpoint: v })}
                  disabled={disabled || !selectedApi}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={!selectedApi ? "Elige API primero" : "Selecciona"} />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointKeys.map((key) => {
                      const ep = selectedApi?.endpoints?.[key];
                      return (
                        <SelectItem key={key} value={key}>
                          {key}
                          {ep?.method || ep?.path ? (
                            <span className="ml-1.5 text-muted-foreground">
                              {[ep?.method, ep?.path].filter(Boolean).join(" ")}
                            </span>
                          ) : null}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview del endpoint seleccionado */}
            {selectedApi && value?.endpoint && currentEndpointConfig && (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Vista previa
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {((currentEndpointConfig as Record<string, unknown>)?.method as string) ??
                      "GET"}
                  </code>
                  <code className="text-xs font-mono text-foreground">
                    {((currentEndpointConfig as Record<string, unknown>)?.path as string) ?? "—"}
                  </code>
                </div>
                {endpointPlaceholders.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-muted-foreground">Placeholders:</span>
                    {endpointPlaceholders.map((p) => (
                      <code
                        key={p}
                        className="text-[10px] bg-muted px-1 rounded"
                      >{`{{${p}}}`}</code>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] text-muted-foreground">Responde con:</span>
                  {endpointResponseMapping || apiResponseMapping ? (
                    Object.keys(endpointResponseMapping || apiResponseMapping || {}).map((f) => (
                      <code key={f} className="text-[10px] bg-muted px-1 rounded">
                        {f}
                      </code>
                    ))
                  ) : ((value?.content_mapping as Record<string, unknown>)
                      ?.custom_fields as string) ? (
                    ((value?.content_mapping as Record<string, unknown>)?.custom_fields as string)
                      .split(",")
                      .map((f) => (
                        <code key={f.trim()} className="text-[10px] bg-muted px-1 rounded">
                          {f.trim()}
                        </code>
                      ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">
                      No definido — definelo en el paso 3
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Asignar variables</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {endpointPlaceholders.length > 0
                  ? `El endpoint necesita ${endpointPlaceholders.length} valor(es). Click en cada uno para elegir cómo se asigna:`
                  : "Este endpoint no necesita variables. Puedes continuar."}
              </p>
            </div>
            {endpointPlaceholders.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-xs text-muted-foreground">No se detectaron placeholders.</p>
              </div>
            ) : (
              <div className="space-y-2 max-w-lg">
                {endpointPlaceholders.map((key) => {
                  const currentVal = (value?.payload_variables?.[key] ?? "") as string;
                  const isSysVar = SYS_VAR_OPTIONS.find(
                    (o) => o.value === currentVal && o.value !== "",
                  );
                  return (
                    <div key={key} className="flex flex-col gap-1.5 rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono font-semibold">{`{{${key}}}`}</code>
                        <span className="text-[10px] text-muted-foreground">=</span>
                        <div className="flex gap-1 flex-wrap">
                          {SYS_VAR_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                const next = { ...value?.payload_variables };
                                next[key] = opt.value;
                                patchPayloadVariables(next);
                              }}
                              className={[
                                "px-2 py-1 rounded text-[10px] font-medium transition-all",
                                currentVal === opt.value && opt.value !== ""
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : currentVal === opt.value
                                    ? "bg-muted text-foreground border border-border"
                                    : "bg-muted/50 text-muted-foreground border border-transparent hover:border-border",
                              ].join(" ")}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(!isSysVar || currentVal === "") && (
                        <Input
                          value={currentVal}
                          onChange={(e) => {
                            const next = { ...value?.payload_variables };
                            next[key] = e.target.value;
                            patchPayloadVariables(next);
                          }}
                          placeholder="Escribe el valor..."
                          disabled={disabled}
                          className="h-8 font-mono text-xs"
                        />
                      )}
                      {isSysVar && (
                        <p className="text-[10px] text-muted-foreground">
                          Se asignará automáticamente:{" "}
                          <code className="text-[10px] bg-muted px-1 rounded">
                            {isSysVar.value}
                          </code>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Contenido disponible</h3>
              <p className="text-xs text-muted-foreground mb-4">
                El endpoint <strong>{value?.endpoint}</strong> devuelve estos campos.{" "}
                {knowledgeType === "DATA"
                  ? "Se guardaran como columnas en tu tabla de datos."
                  : "Estan disponibles como variables para usar en tu contenido."}
              </p>
            </div>

            {endpointResponseMapping || apiResponseMapping ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="text-xs font-medium text-primary">Campos de la respuesta</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(endpointResponseMapping || apiResponseMapping || {}).map(
                    ([key, path]) => (
                      <Badge
                        key={key}
                        variant="outline"
                        className="text-[10px] font-mono gap-1.5 px-2.5 py-1"
                      >
                        {key}
                        <span className="text-muted-foreground">→</span>
                        <span className="text-muted-foreground">{String(path)}</span>
                      </Badge>
                    ),
                  )}
                </div>
                {knowledgeType === "DATA" ? (
                  <p className="text-[11px] text-muted-foreground">
                    Estos campos seran las columnas de tu tabla. Se auto-detectan en cada ejecucion.
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Puedes usar{" "}
                    <code className="text-[10px] bg-muted px-1 rounded">{`{{data_table}}`}</code> en
                    tu template para insertar estos datos, o{" "}
                    <code className="text-[10px] bg-muted px-1 rounded">{`{{raw_json}}`}</code> para
                    el JSON completo.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                <p className="text-xs font-medium text-amber-600">
                  Campos de respuesta no definidos
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Para usar los datos en tu documento, define qué campos devuelve el endpoint.
                  Separalos con coma:
                </p>
                <Input
                  value={
                    ((value?.content_mapping as Record<string, unknown>)
                      ?.custom_fields as string) ?? ""
                  }
                  onChange={(e) => {
                    if (!value) return;
                    onChange({
                      ...value,
                      content_mapping: {
                        ...value.content_mapping,
                        custom_fields: e.target.value,
                      },
                    });
                  }}
                  placeholder="Ej: readings, total, status"
                  disabled={disabled}
                  className="h-8 font-mono text-xs max-w-md"
                />
                <p className="text-[11px] text-muted-foreground">
                  Estos campos los podras usar como variables en tu contenido.
                </p>
              </div>
            )}

            <div className="rounded-lg bg-muted/30 p-3 border">
              <p className="text-[11px] text-muted-foreground">
                <strong>Formato:</strong>{" "}
                {knowledgeType === "DATA" ? "Tabla de datos" : "Documento de texto"}
                {value.content_mapping.path ? (
                  <>
                    {" · "}
                    <strong>Ruta:</strong> {value.content_mapping.path}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-1">Estrategia y template</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Como se combina el nuevo contenido con el existente y cada cuanto se ejecuta.
              </p>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <Label className="text-xs">Frecuencia (cron)</Label>
              {isCustomCron ? (
                <Input
                  value={value.cron}
                  onChange={(e) => patch({ cron: e.target.value })}
                  placeholder="0 */6 * * *"
                  disabled={disabled}
                  className="h-9 font-mono text-xs"
                />
              ) : (
                <Select
                  value={value.cron}
                  onValueChange={(v) => {
                    if (v === "custom") patch({ cron: "*/15 * * * *" });
                    else patch({ cron: v });
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Estrategia de integracion</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {STRATEGY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={[
                      "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                      strategyMode === opt.value
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 hover:border-border",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="strategy"
                      value={opt.value}
                      checked={strategyMode === opt.value}
                      onChange={() => patchIntegration({ mode: opt.value })}
                      className="mt-0.5"
                      disabled={disabled}
                    />
                    <div>
                      <span className="text-xs font-medium">{opt.label}</span>
                      <p className="text-[11px] text-muted-foreground">
                        {opt.value === "append"
                          ? knowledgeType === "DATA"
                            ? "Agrega nuevas filas a la tabla."
                            : "Agrega el nuevo contenido al final del existente."
                          : knowledgeType === "DATA"
                            ? "Reemplaza todas las filas de la tabla."
                            : "Sobrescribe todo el contenido."}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {strategyMode === "append" && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-md">
                <div className="space-y-1.5">
                  <Label className="text-xs">Separador</Label>
                  <Input
                    value={value?.integration_strategy?.separator ?? "\n---\n"}
                    onChange={(e) => patchIntegration({ separator: e.target.value })}
                    disabled={disabled}
                    className="h-8 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Max. entradas</Label>
                  <Input
                    value={value?.integration_strategy?.max_history ?? ""}
                    onChange={(e) =>
                      patchIntegration({
                        max_history: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Sin limite"
                    disabled={disabled}
                    type="number"
                    min={1}
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Probar el CronJob</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Ejecuta el pipeline ahora mismo para ver el resultado. Asegurate de haber guardado
                antes.
              </p>
            </div>
            {!hasConfig ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-xs text-muted-foreground">Completa los pasos 1-4 primero.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" disabled={testing} onClick={handleTest}>
                    {testing ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-1.5" />
                    )}
                    Ejecutar ahora
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!testResult}
                    onClick={() => setTestResult(null)}
                  >
                    Limpiar
                  </Button>
                </div>
                {testing && (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <div>
                      <p className="text-xs font-medium">Ejecutando...</p>
                      <p className="text-[11px] text-muted-foreground">
                        Consultando endpoint y procesando respuesta
                      </p>
                    </div>
                  </div>
                )}
                {testResult && !testing && (
                  <div className="rounded-lg border overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
                      <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">Resultado</span>
                      {(testResult as Record<string, unknown>)?.success ? (
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] text-emerald-600 border-emerald-500/30"
                        >
                          OK
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] text-red-600 border-red-500/30"
                        >
                          Error
                        </Badge>
                      )}
                    </div>
                    <pre className="p-3 text-[11px] font-mono overflow-x-auto max-h-[300px] overflow-y-auto bg-card/30">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                )}
                {!testResult && !testing && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                    Presiona "Ejecutar ahora" para probar el pipeline completo.
                  </div>
                )}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[60vh]">
      {/* Flow navegable */}
      <div className="rounded-xl border bg-card/60 p-3">{renderFlow()}</div>
      {/* Step content */}
      <div className="flex-1 rounded-xl border bg-card/60 p-5">{renderStep()}</div>
      {/* Navigation */}
      <div className="rounded-xl border bg-card/60 px-5 py-3">{renderNav()}</div>
    </div>
  );
}
