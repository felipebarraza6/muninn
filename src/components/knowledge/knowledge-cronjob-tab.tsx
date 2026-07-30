import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FlaskConical,
  Globe,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Terminal,
  Trash2,
  Variable,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import { useKnowledge, useKnowledgeCatalog } from "@/api/hooks/useKnowledge";
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
  { id: 1, icon: Globe, label: "Aplicacion", desc: "App y endpoint" },
  { id: 2, icon: Variable, label: "Variables", desc: "Asignar valores" },
  { id: 3, icon: Terminal, label: "Contenido", desc: "Mapeo y serializacion" },
  { id: 4, icon: Layers, label: "Configuracion", desc: "Fechas, frecuencia y estrategia" },
] as const;

const SYS_VAR_OPTIONS = [
  { value: "", label: "Constante", desc: "Valor digitado manualmente" },
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

/* Placeholders de credenciales */
const CREDENTIAL_KEYS = [
  "auth_token",
  "token",
  "api_key",
  "access_token",
  "bearer_token",
  "key",
  "secret",
];

function isCredentialPlaceholder(key: string, api: { auth_type?: string } | undefined): boolean {
  if (!api || !api.auth_type || api.auth_type === "none") return false;
  return CREDENTIAL_KEYS.includes(key);
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

/* ---- Cache global de discover (sobrevive remounts del componente) ---- */

interface DiscoverCacheEntry {
  fields: string[];
  raw: Record<string, unknown> | null;
  parsed: Record<string, unknown> | null;
}

const discoverCache = new Map<string, DiscoverCacheEntry>();

/* ---- Props ---- */

interface Props {
  value: ApiRefreshConfig | null;
  onChange: (next: ApiRefreshConfig | null) => void;
  disabled?: boolean;
  branch?: string | number | null;
  knowledgeId?: string;
  /** Tipo de conocimiento (DATA, FAQ, DOCUMENT, etc.) para auto-seleccionar el mapping. */
  knowledgeType?: string;
}

/* ---- Componente ---- */

export function KnowledgeCronJobTab({
  value,
  onChange,
  disabled = false,
  branch,
  knowledgeId,
  knowledgeType = "DOCUMENT",
}: Props) {
  const enabled = value != null;
  const cached = knowledgeId ? discoverCache.get(knowledgeId) : undefined;
  const [step, setStep] = useState(1);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [discoveredFields, setDiscoveredFields] = useState<string[]>(cached?.fields ?? []);
  const [discoveredData, setDiscoveredData] = useState<Record<string, unknown> | null>(
    cached?.raw ?? null,
  );
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(
    cached?.parsed ?? null,
  );

  const [pendingVars, setPendingVars] = useState<Record<string, string>>({});
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [dataPickerOpen, setDataPickerOpen] = useState<string | null>(null);
  const [dataPickerStep, setDataPickerStep] = useState<"list" | "table">("list");
  const [dataPickerItem, setDataPickerItem] = useState<AgentKnowledge | null>(null);
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs({ branch });
  const { data: catalog = [] } = useKnowledgeCatalog({ branch, page_size: 200 });
  const dataKnowledge = useMemo(
    () => catalog.filter((k: AgentKnowledge) => k.knowledge_type === "DATA"),
    [catalog],
  );
  const parseDataItem = (item: AgentKnowledge) => {
    try {
      const raw = JSON.parse(item.content || "[]") as Record<string, string>[];
      if (!Array.isArray(raw) || raw.length === 0)
        return { cols: [] as string[], rows: [] as Record<string, string>[] };
      const cols = Object.keys(raw[0]);
      return { cols, rows: raw };
    } catch {
      return { cols: [] as string[], rows: [] as Record<string, string>[] };
    }
  };

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

  const userPlaceholders = useMemo(
    () => endpointPlaceholders.filter((k) => !isCredentialPlaceholder(k, selectedApi)),
    [endpointPlaceholders, selectedApi],
  );

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
      if (!knowledgeId) {
        toast.error("No se pudo identificar el documento");
        return;
      }
      const res = await POST(ENDPOINTS.knowledge.refresh(knowledgeId!) + "?preview=true");
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

  /* Discover handler */
  const extractResponseFields = (data: unknown, prefix = ""): string[] => {
    const result: string[] = [];
    if (!data || typeof data !== "object") return result;
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === "object") {
        for (const k of Object.keys(data[0] as Record<string, unknown>)) {
          result.push(prefix ? `${prefix}.*.${k}` : k);
        }
      } else {
        result.push(prefix || "items");
      }
      return result;
    }
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      result.push(path);
      if (val && typeof val === "object" && !Array.isArray(val)) {
        for (const sub of extractResponseFields(val, path)) {
          if (!result.includes(sub)) result.push(sub);
        }
      }
    }
    return result;
  };

  const handleDiscover = async () => {
    if (!value || !hasConfig) {
      toast.error("Selecciona aplicacion y endpoint primero");
      return;
    }
    setDiscovering(true);
    setDiscoveredFields([]);
    setDiscoveredData(null);
    try {
      const res = (await POST(
        ENDPOINTS.knowledge.refresh(knowledgeId!) + "?preview=true",
      )) as Record<string, unknown>;
      const raw =
        (res as Record<string, unknown>)?.raw_response_preview ??
        (res as Record<string, unknown>)?.data ??
        res;
      setDiscoveredData(raw as Record<string, unknown>);
      const parsed =
        ((res as Record<string, unknown>)?.parsed_data as Record<string, unknown> | null) ??
        ((res as Record<string, unknown>)?.parsed_content_preview as Record<
          string,
          unknown
        > | null) ??
        null;
      setParsedData(parsed);
      const fields = extractResponseFields(raw);
      setDiscoveredFields(fields);
      if (knowledgeId) {
        discoverCache.set(knowledgeId, { fields, raw: raw as Record<string, unknown>, parsed });
      }
      toast.info(
        fields.length > 0
          ? `${fields.length} campo(s) descubierto(s)`
          : "Respuesta recibida, pero no se extrajeron campos automaticamente. Configura path/tipo manualmente.",
      );
    } catch (err) {
      toast.error("Error al consultar el endpoint");
      setDiscoveredFields([]);
      setDiscoveredData(null);
    } finally {
      setDiscovering(false);
    }
  };

  const [syncing, setSyncing] = useState(false);

  const handleSyncSave = async () => {
    if (!value || !hasConfig) {
      toast.error("Selecciona aplicacion y endpoint primero");
      return;
    }
    if (!knowledgeId) {
      toast.error("No se pudo identificar el documento");
      return;
    }
    setSyncing(true);
    try {
      // Primero aseguramos que la config este guardada (tested_ok en false)
      patch({ tested_ok: false });
      // Luego ejecutamos el refresh SIN preview para que genere y guarde contenido
      const res = (await POST(ENDPOINTS.knowledge.refresh(knowledgeId))) as Record<string, unknown>;
      // El refresh ya guardo el contenido en backend, marcamos tested_ok
      onChange({ ...value, tested_ok: true });
      toast.success("Contenido generado correctamente");
    } catch (err) {
      const msg =
        (err as { friendlyMessage?: string })?.friendlyMessage ||
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Error al sincronizar con el endpoint";
      toast.error(msg);
    } finally {
      setSyncing(false);
    }
  };
  /* ---- Sin configuracion ---- */
  if (!enabled) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] p-8">
        <div className="rounded-full bg-primary/10 p-3.5">
          <RefreshCw className="h-7 w-7 text-primary" />
        </div>
        <div className="text-center max-w-sm space-y-1.5">
          <h3 className="text-sm font-semibold">Sin CronJob</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Un CronJob actualiza este conocimiento automáticamente consultando una aplicación
            externa.
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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

  /* ---- Validacion por paso ---- */
  const stepValid = (id: number): boolean => {
    if (!value) return false;
    switch (id) {
      case 1:
        return !!(value.external_api_id && value.endpoint);
      case 2: {
        if (userPlaceholders.length === 0) return true;
        const dateParam = value.content_mapping.date_range?.param_name;
        return userPlaceholders.every(
          (k) => k === dateParam || (value.payload_variables?.[k] ?? "").trim() !== "",
        );
      }
      case 3:
        return stepValid(2) && !!value.content_mapping.type;
      case 4:
        return stepValid(3) && !!(value.cron && value.cron.trim());
      default:
        return false;
    }
  };

  const canAccessStep = (id: number): boolean => {
    if (!value) return false;
    switch (id) {
      case 1:
        return true;
      case 2:
        return stepValid(1);
      case 3:
        return stepValid(1) && stepValid(2);
      case 4:
        return stepValid(1) && stepValid(2) && stepValid(3);
      default:
        return false;
    }
  };

  const stepCount = (id: number): string | null => {
    if (!value) return null;
    switch (id) {
      case 2: {
        if (userPlaceholders.length === 0) return "\u2014";
        const dateParam = value.content_mapping.date_range?.param_name;
        const done = userPlaceholders.filter(
          (k) => k === dateParam || (value.payload_variables?.[k] ?? "").trim() !== "",
        ).length;
        return `${done}/${userPlaceholders.length}`;
      }
      default:
        return null;
    }
  };

  /* ---- Flow cliqueable ---- */
  const renderFlow = () => (
    <div className="flex items-center justify-between gap-0 px-1 sm:px-2">
      {STEPS.map((s, i) => {
        const valid = stepValid(s.id);
        const isActive = step === s.id;
        const count = stepCount(s.id);
        const canAccess = canAccessStep(s.id);
        return (
          <div key={s.id} className="flex items-center gap-0 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => canAccess && setStep(s.id)}
              disabled={!canAccess}
              className={[
                "flex items-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg transition-all duration-150",
                "text-left min-w-0 w-full",
                !canAccess ? "opacity-30 cursor-not-allowed" : "",
                isActive ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "",
                valid && !isActive && canAccess ? "text-emerald-600 hover:bg-muted/50" : "",
                !valid && !isActive && canAccess
                  ? "text-muted-foreground/60 hover:bg-muted/30"
                  : "",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "",
                  valid && !isActive ? "bg-emerald-500 text-white" : "",
                  !valid && s.id === 3 ? "bg-amber-500/20 text-amber-600" : "",
                  !valid && !isActive && s.id !== 3 ? "bg-muted text-muted-foreground/60" : "",
                ].join(" ")}
              >
                {valid ? (
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                ) : s.id === 3 ? (
                  <Pencil className="h-3 w-3" />
                ) : (
                  s.id
                )}
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium leading-tight">{s.label}</p>
                  {count && (
                    <span
                      className={[
                        "text-[9px] font-mono px-1 py-0 rounded",
                        valid
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight truncate">{s.desc}</p>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-px flex-1 mx-1 hidden sm:block",
                  valid ? "bg-emerald-300" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  /* ---- Navigation ---- */
  const renderNav = () => (
    <div className="flex items-center justify-between pt-4 border-t">
      <div>
        {stepValid(step) && step < 4 && (
          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
            <Check className="h-3 w-3 mr-1" /> Completado
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {step < 4 && (
          <Button
            type="button"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            disabled={!canAccessStep(step + 1)}
            onClick={() => {
              let next = step + 1;
              while (next <= 4 && !canAccessStep(next)) next++;
              if (next <= 4) setStep(next);
            }}
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
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
              <h3 className="text-sm font-medium mb-1">Aplicación y endpoint</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Selecciona qué aplicación consultar y el endpoint que devuelve los datos
                actualizados.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Aplicación</Label>
                <Select
                  value={value.external_api_id || undefined}
                  onValueChange={(v) => patch({ external_api_id: v, endpoint: "" })}
                  disabled={disabled || apisLoading}
                >
                  <SelectTrigger className="h-9 border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder={apisLoading ? "Cargando..." : "Elige una app..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {apis.length === 0 && !apisLoading ? (
                      <div className="px-2 py-3 text-center text-[10px] text-muted-foreground">
                        No hay aplicaciones disponibles
                      </div>
                    ) : (
                      apis.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)} className="gap-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-primary/60 shrink-0" />
                            <span>{a.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
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
                  <SelectTrigger className="h-9 border-primary/20 focus:ring-primary/30">
                    <SelectValue placeholder={!selectedApi ? "Elige app primero" : "Selecciona"} />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointKeys.length === 0 ? (
                      <div className="px-2 py-3 text-center text-[10px] text-muted-foreground">
                        Esta app no expone endpoints
                      </div>
                    ) : (
                      endpointKeys.map((key) => {
                        const ep = selectedApi?.endpoints?.[key];
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                              <span>{key}</span>
                              {ep?.method || ep?.path ? (
                                <span className="ml-auto text-[9px] font-mono text-muted-foreground">
                                  {ep?.method ?? "GET"}
                                </span>
                              ) : null}
                            </div>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview del endpoint seleccionado */}
            {selectedApi && value?.endpoint && currentEndpointConfig && (
              <div className="rounded-lg border border-primary/10 bg-primary/[0.02] p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-[10px] font-medium text-primary uppercase tracking-wider">
                    Endpoint
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary font-medium">
                    {((currentEndpointConfig as Record<string, unknown>)?.method as string) ??
                      "GET"}
                  </code>
                  <code className="text-xs font-mono text-foreground">
                    {((currentEndpointConfig as Record<string, unknown>)?.path as string) ?? "—"}
                  </code>
                </div>
                {selectedApi?.name && (
                  <p className="text-[10px] text-muted-foreground">
                    vía <span className="font-medium text-foreground/80">{selectedApi.name}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case 2: {
        const endpointDesc = (currentEndpointConfig as Record<string, unknown>)?.description as
          | string
          | undefined;
        const credPlaceholders = endpointPlaceholders.filter((k) =>
          isCredentialPlaceholder(k, selectedApi),
        );
        const dateParam_step2 = value?.content_mapping.date_range?.param_name;
        const done = userPlaceholders.filter(
          (k) => k === dateParam_step2 || (value?.payload_variables?.[k] ?? "").trim() !== "",
        ).length;
        return (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-1">Variables del endpoint</h3>
              {endpointDesc ? (
                <p className="text-xs text-muted-foreground leading-relaxed">{endpointDesc}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Configura el valor necesario para cada placeholder del endpoint.
                </p>
              )}
              {userPlaceholders.length > 0 && (
                <div className="mt-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {done} de{" "}
                    {userPlaceholders.length}
                  </span>
                </div>
              )}
            </div>

            {credPlaceholders.length > 0 && (
              <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-2.5 space-y-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-medium text-primary">Credenciales</span>
                  <span className="text-muted-foreground/70">resuelto por la instalacion</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {credPlaceholders.map((k) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="text-[9px] font-mono border-primary/30 text-primary bg-primary/5 h-4 px-1.5"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {userPlaceholders.length === 0 && credPlaceholders.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 text-center">
                <Check className="h-5 w-5 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-medium">Sin variables</p>
                <p className="text-xs text-muted-foreground mt-1">
                  El endpoint no necesita placeholders.
                </p>
              </div>
            ) : userPlaceholders.length === 0 && credPlaceholders.length > 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 text-center">
                <Check className="h-5 w-5 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-medium">Todo listo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Las credenciales se resuelven automaticamente. Continua al paso 3.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userPlaceholders.map((key) => {
                  const currentVal = (value?.payload_variables?.[key] ?? "") as string;
                  const isSysVar = SYS_VAR_OPTIONS.find(
                    (o) => o.value === currentVal && o.value !== "",
                  );
                  const dateRangeParam = value?.content_mapping.date_range?.param_name;
                  const isAutoByDateRange = dateRangeParam && key === dateRangeParam;
                  const done = currentVal.trim() !== "" || isAutoByDateRange;
                  return (
                    <div
                      key={key}
                      className={[
                        "rounded-lg border p-2.5 space-y-2 transition-colors",
                        done
                          ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                          : "border-amber-500/20 bg-amber-500/[0.02]",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className={[
                            "h-2 w-2 rounded-full shrink-0",
                            done ? "bg-emerald-500" : "bg-amber-500",
                          ].join(" ")}
                        />
                        <code className="text-[11px] font-mono font-semibold">{key}</code>
                        {!done && !isAutoByDateRange && (
                          <span className="text-[8px] text-amber-600 font-medium ml-0.5">
                            requerido
                          </span>
                        )}
                        {isAutoByDateRange && (
                          <Badge
                            variant="outline"
                            className="text-[8px] h-3.5 px-1 ml-auto text-primary border-primary/30"
                          >
                            date_range
                          </Badge>
                        )}
                        {done && !isAutoByDateRange && (
                          <Badge
                            variant="outline"
                            className={[
                              "text-[8px] h-3.5 px-1 ml-auto",
                              isSysVar
                                ? "text-primary border-primary/30"
                                : "text-emerald-600 border-emerald-500/30",
                            ].join(" ")}
                          >
                            {isSysVar ? "auto" : "const"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { v: "", l: "Constante", Icon: "Pencil" },
                          { v: "{{today}}", l: "Fecha", Icon: "Calendar" },
                          { v: "{{now}}", l: "Hora", Icon: "Clock" },
                        ].map((opt) => {
                          const isActive = currentVal === opt.v;
                          return (
                            <button
                              key={opt.v}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                const n = { ...value?.payload_variables };
                                n[key] = opt.v;
                                patchPayloadVariables(n);
                              }}
                              className={[
                                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium transition-all",
                                isActive
                                  ? "bg-primary/10 text-primary border border-primary/30"
                                  : "bg-muted/40 text-muted-foreground border border-transparent hover:border-border",
                              ].join(" ")}
                            >
                              {opt.l}
                            </button>
                          );
                        })}
                      </div>
                      {!isSysVar || currentVal === "" ? (
                        <>
                          <div className="flex items-center rounded border border-border/60 bg-muted/20 overflow-hidden text-[11px] font-mono">
                            <span className="shrink-0 px-1.5 py-1 text-[9px] text-muted-foreground border-r border-border/60 bg-muted/30">
                              {key}=
                            </span>
                            <input
                              value={pendingVars[key] ?? currentVal}
                              onChange={(e) =>
                                setPendingVars((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              onBlur={() => {
                                const pending = pendingVars[key];
                                if (pending !== undefined && pending !== currentVal) {
                                  const n = { ...value?.payload_variables };
                                  n[key] = pending;
                                  patchPayloadVariables(n);
                                }
                                setPendingVars((prev) => {
                                  const next = { ...prev };
                                  delete next[key];
                                  return next;
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                              }}
                              placeholder="valor..."
                              disabled={disabled}
                              className="flex-1 min-w-0 px-1.5 py-1 bg-transparent outline-none placeholder:text-muted-foreground/40"
                            />
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setDataPickerOpen(dataPickerOpen === key ? null : key);
                                setDataPickerStep("list");
                                setDataPickerItem(null);
                              }}
                              className="shrink-0 px-1.5 text-[9px] text-muted-foreground/50 hover:text-primary transition-colors"
                              title="Buscar en conocimiento"
                            >
                              Buscar
                            </button>
                          </div>
                          {dataPickerOpen === key && (
                            <div className="rounded border border-border/60 bg-card shadow-lg p-2 space-y-1.5 max-h-[200px] overflow-auto">
                              {dataPickerStep === "list" ? (
                                dataKnowledge.length === 0 ? (
                                  <p className="text-[9px] text-muted-foreground text-center py-2">
                                    Sin conocimientos DATA
                                  </p>
                                ) : (
                                  dataKnowledge.slice(0, 20).map((dk) => (
                                    <button
                                      key={dk.id}
                                      type="button"
                                      onClick={() => {
                                        setDataPickerItem(dk);
                                        setDataPickerStep("table");
                                      }}
                                      className="w-full text-left px-2 py-1 rounded text-[10px] hover:bg-muted transition-colors"
                                    >
                                      {dk.title || `#${dk.id}`}
                                    </button>
                                  ))
                                )
                              ) : dataPickerItem ? (
                                (() => {
                                  const { cols, rows } = parseDataItem(dataPickerItem);
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 text-[9px]">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDataPickerStep("list");
                                            setDataPickerItem(null);
                                          }}
                                          className="text-muted-foreground hover:text-foreground"
                                        >
                                          ← volver
                                        </button>
                                        <span className="font-medium truncate">
                                          {dataPickerItem.title}
                                        </span>
                                      </div>
                                      <div className="overflow-auto max-h-[160px]">
                                        <table className="w-full text-[9px] border-collapse">
                                          <thead>
                                            <tr className="bg-muted/40">
                                              {cols.map((c) => (
                                                <th
                                                  key={c}
                                                  className="text-left px-1.5 py-0.5 font-medium border-b"
                                                >
                                                  {c}
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rows.slice(0, 10).map((row, ri) => (
                                              <tr key={ri} className="hover:bg-muted/30">
                                                {cols.map((c) => (
                                                  <td
                                                    key={c}
                                                    className="px-1.5 py-0.5 border-b border-border/30"
                                                  >
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const val = row[c] ?? "";
                                                        const n = { ...value?.payload_variables };
                                                        n[key] = val;
                                                        patchPayloadVariables(n);
                                                        setDataPickerOpen(null);
                                                      }}
                                                      className="hover:text-primary hover:underline text-left"
                                                      title={`Usar "${row[c]}"`}
                                                    >
                                                      {String(row[c] ?? "").slice(0, 30)}
                                                    </button>
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </>
                                  );
                                })()
                              ) : null}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">
                          = <span>{isSysVar.desc}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 3:
        return (() => {
          const showFullConfig = true;
          return (
            <div className="space-y-3">
              {/* Variables editables */}
              {userPlaceholders.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {userPlaceholders.map((k) => {
                    const val = (value?.payload_variables?.[k] ?? "") as string;
                    return (
                      <div
                        key={k}
                        className="flex items-center rounded border border-border/60 bg-card/40 overflow-hidden text-[11px] font-mono"
                      >
                        <span className="shrink-0 px-1.5 py-1 text-[9px] text-muted-foreground border-r border-border/60 bg-muted/30">
                          {k}=
                        </span>
                        <input
                          value={val}
                          onChange={(e) => {
                            const n = { ...value?.payload_variables };
                            n[k] = e.target.value;
                            patchPayloadVariables(n);
                          }}
                          placeholder="valor..."
                          disabled={disabled}
                          className="w-24 min-w-0 px-1.5 py-1 bg-transparent outline-none placeholder:text-muted-foreground/40"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {discovering ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p className="text-xs text-muted-foreground">Consultando endpoint...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6">
                  <Button
                    size="sm"
                    disabled={disabled || discovering}
                    onClick={handleDiscover}
                    className="gap-1.5"
                  >
                    {discovering ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Sincronizar
                  </Button>
                </div>
              )}

              {showFullConfig && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Panel 1: Respuesta cruda */}
                  {discoveredData ? (
                    <div className="rounded-lg border border-border/60 bg-card/50 overflow-hidden flex flex-col min-h-[300px]">
                      <div className="px-3 py-1.5 bg-muted/40 border-b text-[10px] font-medium text-muted-foreground shrink-0">
                        <span>Respuesta del endpoint</span>
                      </div>
                      <pre className="p-3 text-[10px] font-mono overflow-auto flex-1 leading-relaxed whitespace-pre-wrap break-all max-h-[400px]">
                        {JSON.stringify(discoveredData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/60 bg-card/30 flex flex-col items-center justify-center min-h-[300px] text-center p-4 space-y-2">
                      <Globe className="h-6 w-6 text-muted-foreground/40" />
                      <p className="text-[10px] text-muted-foreground">
                        Presiona Sincronizar para ver la respuesta del endpoint
                      </p>
                    </div>
                  )}

                  <div className="rounded-lg border border-primary/20 bg-card/60 p-3 space-y-3 flex flex-col min-h-[300px]">
                    <div className="flex items-center justify-between shrink-0">
                      <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider">
                        Configurar mapeo
                      </p>
                    </div>

                    <div className="space-y-1 shrink-0">
                      <Label className="text-[10px]">Ruta (path)</Label>
                      {discoveredFields.length > 0 ? (
                        <Select
                          value={value?.content_mapping.path || undefined}
                          onValueChange={(v) => {
                            if (!value) return;
                            onChange({
                              ...value,
                              content_mapping: { ...value.content_mapping, path: v },
                            });
                          }}
                          disabled={disabled}
                        >
                          <SelectTrigger className="h-7 text-[10px] font-mono">
                            <SelectValue placeholder="Elige una ruta..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const prefixes = new Set<string>();
                              for (const f of discoveredFields) {
                                const parts = f.split(".");
                                for (let i = 1; i <= parts.length; i++) {
                                  const prefix = parts.slice(0, i).join(".");
                                  if (!prefix.includes("*")) prefixes.add(prefix);
                                }
                                for (let i = 0; i < parts.length; i++) {
                                  const part = parts[i];
                                  const looksDynamic =
                                    /^\d{4}-\d{2}-\d{2}/.test(part) ||
                                    /^[0-9a-f]{8}-[0-9a-f]{4}/.test(part) ||
                                    /^\d{10,}$/.test(part);
                                  if (looksDynamic) {
                                    const wildcard = [
                                      ...parts.slice(0, i),
                                      "*",
                                      ...parts.slice(i + 1),
                                    ].join(".");
                                    prefixes.add(wildcard);
                                  }
                                }
                              }
                              return Array.from(prefixes)
                                .sort()
                                .map((p) => (
                                  <SelectItem key={p} value={p} className="text-[10px] font-mono">
                                    {p}
                                  </SelectItem>
                                ));
                            })()}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={value?.content_mapping.path ?? ""}
                          onChange={(e) => patchMapping({ path: e.target.value })}
                          placeholder="Ej: data, results.items"
                          disabled={disabled}
                          className="h-7 font-mono text-[10px]"
                        />
                      )}
                    </div>

                    <div className="space-y-1 shrink-0">
                      <Label className="text-[10px]">Tipo</Label>
                      <Select
                        value={value?.content_mapping.type ?? "json_path"}
                        onValueChange={(v) => {
                          if (!value) return;
                          onChange({
                            ...value,
                            content_mapping: {
                              ...value.content_mapping,
                              type: v as ApiRefreshMappingType,
                            },
                          });
                        }}
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-7 text-[10px]">
                          <SelectValue placeholder="Elige tipo...">
                            {(() => {
                              const t = value?.content_mapping.type;
                              if (t === "json_to_table") return "Tabla";
                              if (t === "json_path") return "JSON";
                              if (t === "raw_string") return "Texto plano";
                              if (t === "title_and_body") return "Título + Cuerpo";
                              return null;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json_to_table" className="text-[10px]">
                            <span className="flex flex-col text-left">
                              <span>Tabla</span>
                              <span className="text-[8px] text-muted-foreground font-normal">
                                Array de objetos → tabla Markdown/JSON/CSV
                              </span>
                            </span>
                          </SelectItem>
                          <SelectItem value="json_path" className="text-[10px]">
                            <span className="flex flex-col text-left">
                              <span>JSON</span>
                              <span className="text-[8px] text-muted-foreground font-normal">
                                Guarda el fragmento JSON tal cual como texto
                              </span>
                            </span>
                          </SelectItem>
                          <SelectItem value="raw_string" className="text-[10px]">
                            <span className="flex flex-col text-left">
                              <span>Texto plano</span>
                              <span className="text-[8px] text-muted-foreground font-normal">
                                str(valor) — para strings, números, booleanos
                              </span>
                            </span>
                          </SelectItem>
                          <SelectItem value="title_and_body" className="text-[10px]">
                            <span className="flex flex-col text-left">
                              <span>Título + Cuerpo</span>
                              <span className="text-[8px] text-muted-foreground font-normal">
                                # título\n\ncuerpo desde 2 rutas JSON distintas
                              </span>
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {value?.content_mapping.type === "title_and_body" && (
                      <div className="space-y-1 shrink-0">
                        <Label className="text-[10px]">Ruta del título</Label>
                        <Input
                          value={value.content_mapping.title_path ?? ""}
                          onChange={(e) => patchMapping({ title_path: e.target.value })}
                          placeholder="Ej: title, name"
                          disabled={disabled}
                          className="h-7 font-mono text-[10px]"
                        />
                      </div>
                    )}
                    {value?.content_mapping.type === "title_and_body" && (
                      <div className="space-y-1 shrink-0">
                        <Label className="text-[10px]">Ruta del cuerpo</Label>
                        <Input
                          value={value.content_mapping.body_path ?? ""}
                          onChange={(e) => patchMapping({ body_path: e.target.value })}
                          placeholder="Ej: body, content"
                          disabled={disabled}
                          className="h-7 font-mono text-[10px]"
                        />
                      </div>
                    )}
                    {value?.content_mapping.type === "json_to_table" && (
                      <>
                        <div className="flex gap-3 shrink-0">
                          <div className="space-y-1 flex-1">
                            <Label className="text-[10px]">Formato</Label>
                            <Select
                              value={value.content_mapping.format ?? "markdown"}
                              onValueChange={(v) =>
                                patchMapping({ format: v as "markdown" | "json" | "csv" })
                              }
                              disabled={disabled}
                            >
                              <SelectTrigger className="h-7 text-[10px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="markdown" className="text-[10px]">
                                  Markdown (tabla)
                                </SelectItem>
                                <SelectItem value="json" className="text-[10px]">
                                  JSON (array)
                                </SelectItem>
                                <SelectItem value="csv" className="text-[10px]">
                                  CSV
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end pb-0.5">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value.content_mapping.unpack_keys ?? false}
                                onChange={(e) => patchMapping({ unpack_keys: e.target.checked })}
                                disabled={disabled}
                                className="h-3.5 w-3.5 rounded border-border accent-primary"
                              />
                              <span className="text-[10px]">Dict → filas</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Panel 3: Resultado mapeado — solo si hay parsed_data del backend */}
                  {parsedData ? (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.02] overflow-hidden flex flex-col min-h-[300px]">
                      <div className="px-3 py-1.5 bg-emerald-500/[0.06] border-b border-emerald-500/10 shrink-0">
                        <span className="text-[10px] font-medium text-emerald-600">
                          Resultado mapeado
                        </span>
                      </div>
                      <pre className="p-3 text-[10px] font-mono overflow-auto flex-1 leading-relaxed whitespace-pre-wrap break-all max-h-[400px]">
                        {JSON.stringify(parsedData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-emerald-500/20 bg-emerald-500/[0.01] flex flex-col items-center justify-center min-h-[300px] text-center p-4 space-y-2">
                      <Layers className="h-6 w-6 text-emerald-500/30" />
                      <p className="text-[10px] text-muted-foreground">
                        Configura el mapeo y presiona Descubrir para ver el resultado
                      </p>
                    </div>
                  )}
                </div>
              )}

              {discoveredData && (
                <div className="flex items-center justify-center pt-2">
                  <Button
                    size="sm"
                    disabled={disabled || syncing}
                    onClick={handleSyncSave}
                    className="gap-1.5"
                  >
                    {syncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Actualizar ahora
                  </Button>
                </div>
              )}
            </div>
          );
        })();
      case 4:
        return (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h3 className="text-sm font-medium mb-1">Configuración</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Rango de fechas, frecuencia y como se combina el contenido.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sincronización por fechas</Label>
              <p className="text-[11px] text-muted-foreground">
                Itera sobre un rango de fechas llamando al endpoint N veces.
              </p>
              {value?.content_mapping.date_range ? (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-amber-700">Rango activo</span>
                    <button
                      type="button"
                      onClick={() => patchMapping({ date_range: undefined })}
                      className="text-[9px] text-muted-foreground/60 hover:text-destructive"
                    >
                      Desactivar
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] text-muted-foreground">desde hoy</span>
                    <Input
                      type="number"
                      value={value.content_mapping.date_range.start}
                      onChange={(e) =>
                        patchMapping({
                          date_range: {
                            ...value.content_mapping.date_range!,
                            start: Number(e.target.value),
                          },
                        })
                      }
                      disabled={disabled}
                      className="h-7 w-14 font-mono text-[10px] text-center"
                    />
                    <span className="text-[9px] text-muted-foreground">hasta +</span>
                    <Input
                      type="number"
                      value={value.content_mapping.date_range.end}
                      onChange={(e) =>
                        patchMapping({
                          date_range: {
                            ...value.content_mapping.date_range!,
                            end: Number(e.target.value),
                          },
                        })
                      }
                      disabled={disabled}
                      className="h-7 w-14 font-mono text-[10px] text-center"
                    />
                    <span className="text-[9px] text-muted-foreground">días</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-muted-foreground">variable:</span>
                      <Select
                        value={value.content_mapping.date_range.param_name || undefined}
                        onValueChange={(v) =>
                          patchMapping({
                            date_range: {
                              ...value.content_mapping.date_range!,
                              param_name: v,
                            },
                          })
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-7 w-28 text-[10px] font-mono">
                          <SelectValue placeholder="Elige..." />
                        </SelectTrigger>
                        <SelectContent>
                          {userPlaceholders.map((k) => (
                            <SelectItem key={k} value={k} className="text-[10px] font-mono">
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground">
                    El backend itera día por día y acumula resultados.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => patchMapping({ date_range: { start: 0, end: 7, param_name: "" } })}
                  disabled={disabled}
                  className="h-8 w-full rounded-md border border-dashed border-amber-500/30 bg-amber-500/[0.02] flex items-center justify-center gap-1.5 text-[10px] text-amber-600/70 hover:text-amber-600 hover:border-amber-500/50 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" /> Activar por rango de fechas
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-w-xs">
              <Label className="text-xs font-medium">Frecuencia (cron)</Label>
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
              <Label className="text-xs font-medium">Estrategia de integracion</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {STRATEGY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={[
                      "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                      strategyMode === opt.value
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/60 hover:border-border",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="strategy"
                      value={opt.value}
                      checked={strategyMode === opt.value}
                      onChange={() => patchIntegration({ mode: opt.value })}
                      className="mt-0.5 accent-primary"
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

            {knowledgeType !== "DATA" && (
              <div className="space-y-1.5 border-t border-border/60 pt-4">
                <Label className="text-xs font-medium">
                  Template de contenido{" "}
                  <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Para DATA la tabla serializada se guarda directamente. Usa template solo si
                  necesitas formato personalizado.
                </p>
                <textarea
                  value={pendingTemplate ?? value.content_template ?? ""}
                  onChange={(e) => setPendingTemplate(e.target.value)}
                  onBlur={() => {
                    if (
                      pendingTemplate !== null &&
                      pendingTemplate !== (value.content_template ?? "")
                    ) {
                      patch({ content_template: pendingTemplate });
                    }
                    setPendingTemplate(null);
                  }}
                  placeholder={`Ej: {{json_to_table}}\n\nUltima actualizacion: {{now}}`}
                  disabled={disabled}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono ring-offset-background placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    "{{title}}",
                    "{{data}}",
                    "{{timestamp}}",
                    "{{raw_json}}",
                    ...(value.content_mapping.type === "json_to_table"
                      ? ["{{json_to_table}}"]
                      : []),
                    ...columns.map((c) => `{{${c}}}`),
                    "{{today}}",
                    "{{now}}",
                    "{{yesterday}}",
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        const base = pendingTemplate ?? value.content_template ?? "";
                        const next = base + (base && !base.endsWith(" ") ? " " : "") + v;
                        patch({ content_template: next });
                        setPendingTemplate(null);
                      }}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                      title={`Insertar ${v}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border/60 pt-4 flex items-center justify-between">
              <div>
                {stepValid(4) ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-600 border-emerald-500/30"
                  >
                    <Check className="h-3 w-3 mr-1" /> Configuracion completa
                  </Badge>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    Completa todos los pasos anteriores para activar
                  </p>
                )}
              </div>
              <Button
                size="sm"
                disabled={!stepValid(4) || disabled}
                onClick={() => {
                  patch({ tested_ok: true });
                  toast.success("CronJob activado — se ejecutara segun la frecuencia configurada");
                }}
                className="gap-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                Activar CronJob
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[60vh]">
      {/* Flow navegable + Desactivar */}
      <div className="rounded-xl border bg-card/60 p-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">{renderFlow()}</div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            disabled={disabled || syncing || !hasConfig}
            onClick={handleSyncSave}
            className="gap-1.5 h-8"
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Actualizar ahora
          </Button>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                disabled={disabled}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desactivar CronJob?</AlertDialogTitle>
                <AlertDialogDescription>
                  El CronJob se detendra y se eliminara la configuracion actual. Puedes volver a
                  configurarlo despues.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    setConfirmOpen(false);
                    onChange(null);
                  }}
                >
                  Desactivar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* Step content */}
      <div className="flex-1 rounded-xl border bg-card/60 p-5">{renderStep()}</div>
      {/* Navigation */}
      <div className="rounded-xl border bg-card/60 px-5 py-3">{renderNav()}</div>
    </div>
  );
}
