import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTestExternalAPI,
  type ExternalAPI,
  type ExternalAPIEndpoint,
  type ExternalAPITestResult,
} from "@/api/hooks/useExternalAPIs";
import {
  formatTestResultToast,
  HTTP_METHODS,
  parseJsonObject,
  prettyJson,
} from "@/lib/external-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "endpoint" | "adhoc" | "base";

const PLACEHOLDER_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function storageKey(apiId: string) {
  return `muninn:external-api-test:${apiId}`;
}

type PersistedTestState = {
  credentials?: Record<string, string>;
  paramsByEndpoint?: Record<string, string>;
  authenticateFirst?: boolean;
  endpointType?: string;
  mode?: Mode;
};

function loadPersisted(apiId: string): PersistedTestState {
  try {
    const raw = localStorage.getItem(storageKey(apiId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedTestState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePersisted(apiId: string, state: PersistedTestState) {
  try {
    localStorage.setItem(storageKey(apiId), JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

function collectPlaceholders(endpoint?: ExternalAPIEndpoint): string[] {
  if (!endpoint) return [];
  const blobs = [
    endpoint.path,
    prettyJson(endpoint.query_params ?? {}),
    prettyJson(endpoint.headers ?? {}),
    prettyJson(endpoint.body ?? {}),
  ];
  const keys = new Set<string>();
  for (const blob of blobs) {
    if (!blob) continue;
    for (const m of String(blob).matchAll(PLACEHOLDER_RE)) {
      if (m[1] && m[1] !== "auth_token") keys.add(m[1]);
    }
  }
  return [...keys].sort();
}

function buildParamsTemplate(keys: string[]): string {
  if (!keys.length) return "{}";
  const obj: Record<string, string> = {};
  for (const k of keys) obj[k] = "";
  return prettyJson(obj);
}

function previewUrlWithParams(
  baseUrl: string | undefined,
  endpoint: ExternalAPIEndpoint | undefined,
  paramsRaw: string,
): string | null {
  if (!endpoint?.path) return null;
  const parsed = parseJsonObject(paramsRaw, "params");
  const values = parsed.ok ? parsed.value : {};
  const replace = (s: string) =>
    s.replace(PLACEHOLDER_RE, (_, key: string) => {
      const v = values[key];
      return v == null || v === "" ? `{{${key}}}` : String(v);
    });
  const path = replace(endpoint.path);
  const qp = endpoint.query_params ?? {};
  const pairs: string[] = [];
  if (qp && typeof qp === "object") {
    for (const [k, v] of Object.entries(qp)) {
      pairs.push(`${k}=${replace(String(v))}`);
    }
  }
  const qs = pairs.length ? `?${pairs.join("&")}` : "";
  return `${(baseUrl || "").replace(/\/$/, "")}${path}${qs}`;
}

function ResultBlock({
  title,
  value,
  tone = "muted",
}: {
  title: string;
  value: unknown;
  tone?: "muted" | "ok" | "err";
}) {
  if (value == null) return null;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
    return null;
  }
  return (
    <div className="space-y-1">
      <p
        className={cn(
          "text-[11px] font-medium",
          tone === "ok" && "text-primary",
          tone === "err" && "text-destructive",
          tone === "muted" && "text-muted-foreground",
        )}
      >
        {title}
      </p>
      <pre className="max-h-56 overflow-auto rounded bg-background/60 p-2 font-mono text-[11px] whitespace-pre-wrap break-all">
        {prettyJson(value)}
      </pre>
    </div>
  );
}

const SENSITIVE_CRED_KEYS = new Set([
  "password",
  "pass",
  "passwd",
  "secret",
  "api_key",
  "apikey",
  "token",
]);

function isSensitiveCredKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_CRED_KEYS.has(lower) || lower.includes("password") || lower.includes("secret");
}

export interface ExternalApiTestPanelProps {
  api: ExternalAPI;
  /** Volver a Configuración / Endpoints */
  onExit?: () => void;
}

export function ExternalApiTestPanel({ api, onExit }: ExternalApiTestPanelProps) {
  const test = useTestExternalAPI();
  const apiId = String(api.id);
  const endpointKeys = useMemo(() => Object.keys(api.endpoints ?? {}), [api.endpoints]);
  const isLoginAuth = api.auth_type === "endpoint_auth" || Boolean(api.auth_endpoint_key);
  const authEndpoint = api.auth_endpoint_key ? api.endpoints?.[api.auth_endpoint_key] : undefined;
  const loginCredentialKeys = useMemo(
    () => (isLoginAuth ? collectPlaceholders(authEndpoint) : []),
    [isLoginAuth, authEndpoint],
  );

  const persisted = useMemo(() => loadPersisted(apiId), [apiId]);
  const authKey = api.auth_endpoint_key || "";
  const preferredEndpoint =
    persisted.endpointType && endpointKeys.includes(persisted.endpointType)
      ? persisted.endpointType
      : endpointKeys.find((k) => k !== authKey) || endpointKeys[0] || "";

  const [mode, setMode] = useState<Mode>(
    persisted.mode && (persisted.mode !== "endpoint" || endpointKeys.length)
      ? persisted.mode
      : endpointKeys.length
        ? "endpoint"
        : "base",
  );
  const [endpointType, setEndpointType] = useState(preferredEndpoint);
  const [paramsJson, setParamsJson] = useState(() => {
    if (preferredEndpoint && persisted.paramsByEndpoint?.[preferredEndpoint]) {
      return persisted.paramsByEndpoint[preferredEndpoint];
    }
    return "{}";
  });
  const [paramsByEndpoint, setParamsByEndpoint] = useState<Record<string, string>>(
    () => persisted.paramsByEndpoint ?? {},
  );
  const [authenticateFirst, setAuthenticateFirst] = useState(
    persisted.authenticateFirst ?? isLoginAuth,
  );
  const [credentials, setCredentials] = useState<Record<string, string>>(
    () => persisted.credentials ?? {},
  );
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/");
  const [headersJson, setHeadersJson] = useState("{}");
  const [bodyJson, setBodyJson] = useState("{}");
  const [lastResult, setLastResult] = useState<ExternalAPITestResult | null>(null);

  const selectedEndpoint = endpointType ? api.endpoints?.[endpointType] : undefined;
  const placeholderKeys = useMemo(() => collectPlaceholders(selectedEndpoint), [selectedEndpoint]);

  // Persistir credenciales + params de prueba (solo este navegador; no van a la skill).
  useEffect(() => {
    savePersisted(apiId, {
      credentials,
      paramsByEndpoint,
      authenticateFirst,
      endpointType,
      mode,
    });
  }, [apiId, credentials, paramsByEndpoint, authenticateFirst, endpointType, mode]);

  useEffect(() => {
    if (mode !== "endpoint" || !endpointType) return;
    const stored = paramsByEndpoint[endpointType];
    if (stored != null) {
      setParamsJson(stored);
      return;
    }
    const ep = api.endpoints?.[endpointType];
    const template = buildParamsTemplate(collectPlaceholders(ep));
    setParamsJson(template);
    setParamsByEndpoint((prev) => ({ ...prev, [endpointType]: template }));
  }, [mode, endpointType, api.endpoints]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al cambiar endpoint

  const endpointPreview = useMemo(() => {
    if (!selectedEndpoint) return null;
    const methodLabel = (selectedEndpoint.method || "GET").toUpperCase();
    const pathLabel = selectedEndpoint.path || "/";
    const qp = selectedEndpoint.query_params ?? {};
    const qpStr =
      qp && typeof qp === "object" && Object.keys(qp).length
        ? "?" +
          Object.entries(qp)
            .map(([k, v]) => `${k}=${String(v)}`)
            .join("&")
        : "";
    return {
      method: methodLabel,
      url: `${api.base_url?.replace(/\/$/, "") ?? ""}${pathLabel}${qpStr}`,
      isLogin: endpointType === (api.auth_endpoint_key || ""),
    };
  }, [selectedEndpoint, api.base_url, api.auth_endpoint_key, endpointType]);

  const applyResult = (r: ExternalAPITestResult) => {
    setLastResult(r);
    const msg = formatTestResultToast(r);
    if (msg.ok) toast.success(msg.message);
    else toast.error(msg.message);
  };

  const isTestingLoginEndpoint =
    mode === "endpoint" && endpointType === (api.auth_endpoint_key || "");

  const buildCredentialsPayload = (): Record<string, string> | undefined => {
    if (!authenticateFirst || !loginCredentialKeys.length) return undefined;
    const filled: Record<string, string> = {};
    for (const key of loginCredentialKeys) {
      const v = credentials[key]?.trim();
      if (v) filled[key] = v;
    }
    return Object.keys(filled).length ? filled : undefined;
  };

  const authTestFields = () => {
    // No autenticar antes si el endpoint bajo prueba ES el login.
    const doAuth = authenticateFirst && !isTestingLoginEndpoint;
    const creds = doAuth ? buildCredentialsPayload() : undefined;
    return {
      authenticate_first: doAuth,
      force_auth: true as const,
      ...(creds ? { credentials: creds } : {}),
    };
  };

  const ensureLoginCredentials = (): boolean => {
    // Probar el endpoint login usa «valores de prueba», no hace falta auth-first.
    if (isTestingLoginEndpoint) return true;
    if (!authenticateFirst || !loginCredentialKeys.length) return true;
    const missing = loginCredentialKeys.filter((k) => !credentials[k]?.trim());
    if (missing.length) {
      toast.error(`Completa las credenciales de login: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const onParamsChange = (raw: string) => {
    setParamsJson(raw);
    if (mode === "endpoint" && endpointType) {
      setParamsByEndpoint((prev) => ({ ...prev, [endpointType]: raw }));
    }
  };

  const run = () => {
    if (!ensureLoginCredentials()) return;

    if (mode === "endpoint") {
      if (!endpointType) {
        toast.error("Selecciona un endpoint");
        return;
      }
      const params = parseJsonObject(paramsJson, "parámetros");
      if (!params.ok) {
        toast.error(params.error);
        return;
      }
      test.mutate(
        {
          id: apiId,
          body: {
            endpoint_type: endpointType,
            body: params.value,
            ...authTestFields(),
          },
        },
        { onSuccess: applyResult, onError: () => toast.error("Test falló") },
      );
      return;
    }

    if (mode === "adhoc") {
      const headers = parseJsonObject(headersJson, "headers");
      if (!headers.ok) {
        toast.error(headers.error);
        return;
      }
      const params = parseJsonObject(paramsJson, "query");
      if (!params.ok) {
        toast.error(params.error);
        return;
      }
      const body = parseJsonObject(bodyJson, "body");
      if (!body.ok) {
        toast.error(body.error);
        return;
      }
      if (!path.startsWith("/")) {
        toast.error("El path debe empezar con /");
        return;
      }
      test.mutate(
        {
          id: apiId,
          body: {
            method,
            path,
            headers: headers.value,
            params: params.value,
            body: body.value,
            ...authTestFields(),
          },
        },
        { onSuccess: applyResult, onError: () => toast.error("Test falló") },
      );
      return;
    }

    test.mutate(
      { id: apiId, body: { ...authTestFields() } },
      { onSuccess: applyResult, onError: () => toast.error("Test falló") },
    );
  };

  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Modo prueba</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Espacio completo para probar endpoints. Las credenciales de prueba se guardan en este
            navegador (por aplicación). En cada skill/agente irán las suyas — no se comparten.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {onExit && (
            <Button type="button" variant="outline" size="sm" onClick={onExit}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Volver
            </Button>
          )}
          <Button type="button" size="sm" disabled={test.isPending} onClick={run}>
            {test.isPending ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <FlaskConical className="h-4 w-4 mr-1.5" />
            )}
            Ejecutar test
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 min-w-0">
          <div className="space-y-2">
            <Label>Modo</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endpoint" disabled={endpointKeys.length === 0}>
                  Endpoint configurado
                </SelectItem>
                <SelectItem value="adhoc">Request ad-hoc</SelectItem>
                <SelectItem value="base">GET a base_url</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "endpoint" && (
            <>
              <div className="space-y-2">
                <Label>Endpoint</Label>
                <Select value={endpointType} onValueChange={setEndpointType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointKeys.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {endpointPreview && (
                <div className="rounded-lg border bg-muted/30 px-3 py-2 space-y-1 text-[11px]">
                  <p className="font-medium text-foreground">Request del endpoint</p>
                  <p className="font-mono break-all">
                    <span className="text-primary">{endpointPreview.method}</span>{" "}
                    {endpointPreview.url}
                  </p>
                  {endpointPreview.isLogin ? (
                    <p className="text-muted-foreground">
                      Endpoint de login: usa las credenciales de prueba de abajo.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Los valores rellenan <code className="text-[10px]">{"{{placeholders}}"}</code>{" "}
                      del path, query y body.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  Valores de prueba
                  {placeholderKeys.length > 0 ? ` (${placeholderKeys.join(", ")})` : ""}
                </Label>
                <Textarea
                  value={paramsJson}
                  onChange={(e) => onParamsChange(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                  disabled={placeholderKeys.length === 0}
                />
                {placeholderKeys.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Sin placeholders. Puedes probarlo directo.
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground break-all">
                    Vista previa:{" "}
                    <code className="text-[10px]">
                      {previewUrlWithParams(api.base_url, selectedEndpoint, paramsJson) ?? "—"}
                    </code>
                  </p>
                )}
              </div>
            </>
          )}

          {mode === "adhoc" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Método</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
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
                </div>
                <div className="space-y-2">
                  <Label>Path</Label>
                  <Input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="/v1/recursos/"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Query (JSON)</Label>
                <Textarea
                  value={paramsJson}
                  onChange={(e) => setParamsJson(e.target.value)}
                  rows={3}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Headers (JSON)</Label>
                <Textarea
                  value={headersJson}
                  onChange={(e) => setHeadersJson(e.target.value)}
                  rows={3}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Body (JSON)</Label>
                <Textarea
                  value={bodyJson}
                  onChange={(e) => setBodyJson(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                />
              </div>
            </>
          )}

          {mode === "base" && (
            <p className="text-xs text-muted-foreground">
              GET a la URL base. Preferí un endpoint configurado con «Autenticar primero».
            </p>
          )}

          {isLoginAuth && !isTestingLoginEndpoint && (
            <div className="space-y-3 rounded-lg border bg-muted/20 px-3 py-3">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={authenticateFirst} onCheckedChange={setAuthenticateFirst} />
                Autenticar primero
                {api.auth_endpoint_key ? ` (${api.auth_endpoint_key})` : ""}
              </label>
              {authenticateFirst && (
                <>
                  {loginCredentialKeys.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-muted-foreground">
                        Credenciales del login (obligatorias para endpoints protegidos). Se
                        recuerdan en este navegador. Dentidesk: el token es de un solo uso — cada
                        test hace login fresco.
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {loginCredentialKeys.map((key) => (
                          <div key={key} className="space-y-1">
                            <Label className="text-xs font-mono">{key}</Label>
                            <Input
                              type={isSensitiveCredKey(key) ? "password" : "text"}
                              autoComplete="off"
                              value={credentials[key] ?? ""}
                              onChange={(e) =>
                                setCredentials((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              placeholder={`{{${key}}}`}
                              className="h-8 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      El endpoint de login no define placeholders{" "}
                      <code className="text-[10px]">{"{{…}}"}</code>.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Resultado</p>
          {!lastResult ? (
            <div className="rounded-lg border border-dashed px-4 py-10 text-center text-xs text-muted-foreground">
              Ejecuta un test para ver request, auth y respuesta aquí.
            </div>
          ) : (
            <div
              className={cn(
                "rounded-lg border p-3 space-y-3 text-xs",
                lastResult.success
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5",
              )}
            >
              <div className="flex flex-wrap gap-2 font-medium">
                <span>{lastResult.success ? "Éxito" : "Error"}</span>
                {lastResult.status_code != null && <span>HTTP {lastResult.status_code}</span>}
                {lastResult.latency_ms != null && <span>{lastResult.latency_ms} ms</span>}
              </div>
              {lastResult.auth && (
                <p
                  className={cn(
                    "font-mono text-[11px]",
                    lastResult.auth.success ? "text-primary" : "text-destructive",
                  )}
                >
                  Login:{" "}
                  {lastResult.auth.success
                    ? `OK${lastResult.auth.token_preview ? ` · ${lastResult.auth.token_preview}` : ""}`
                    : lastResult.auth.error || "falló"}
                  {lastResult.auth.success && !lastResult.success
                    ? " · el error es del endpoint, no del login"
                    : ""}
                </p>
              )}
              <ResultBlock title="Request enviada" value={lastResult.request} />
              <ResultBlock
                title="Respuesta"
                value={lastResult.data ?? lastResult.raw_response ?? lastResult.error}
                tone={lastResult.success ? "ok" : "err"}
              />
              <ResultBlock title="Respuesta mapeada" value={lastResult.mapped_data} tone="ok" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
