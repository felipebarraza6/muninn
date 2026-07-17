import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Loader2, Globe, FlaskConical, Pencil, Trash2, Lock } from "lucide-react";
import {
  useExternalAPI,
  useUpdateExternalAPI,
  useDeleteExternalAPI,
  type ExternalAPIAuthType,
  type ExternalAPIEndpoint,
} from "@/api/hooks/useExternalAPIs";
import { canManageExternalApis } from "@/lib/authGuards";
import { AUTH_TYPE_LABEL, parseJsonObject, prettyJson } from "@/lib/external-api";
import { ExternalApiEndpointsPanel } from "@/components/external-apis/endpoint-editor";
import { TestConnectionDialog } from "@/components/external-apis/test-connection-dialog";
import { toast } from "sonner";

export default function APIDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canManage = canManageExternalApis();
  const { data: api, isLoading, error, refetch } = useExternalAPI(id);
  const update = useUpdateExternalAPI();
  const remove = useDeleteExternalAPI();

  const [editing, setEditing] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [authType, setAuthType] = useState<ExternalAPIAuthType>("none");
  const [timeoutSeconds, setTimeoutSeconds] = useState("30");
  const [isActive, setIsActive] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [authHeaderName, setAuthHeaderName] = useState("X-API-Key");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authAccessToken, setAuthAccessToken] = useState("");
  const [authEndpointKey, setAuthEndpointKey] = useState("");
  const [authTokenPath, setAuthTokenPath] = useState("Token");
  const [authTokenTtl, setAuthTokenTtl] = useState("0");
  const [defaultHeadersJson, setDefaultHeadersJson] = useState("{}");
  const [retryPolicyJson, setRetryPolicyJson] = useState(
    '{\n  "max_retries": 3,\n  "backoff": 2\n}',
  );

  useEffect(() => {
    if (!api) return;
    setName(api.name);
    setDescription(api.description || "");
    setBaseUrl(api.base_url || "");
    setAuthType((api.auth_type as ExternalAPIAuthType) || "none");
    setTimeoutSeconds(String(api.timeout_seconds ?? 30));
    setIsActive(api.is_active !== false);
    setApiKey("");
    setAuthEndpointKey(api.auth_endpoint_key || "");
    setAuthTokenPath(api.auth_token_path || "Token");
    setAuthTokenTtl(String(api.auth_token_ttl_seconds ?? 0));
    setDefaultHeadersJson(prettyJson(api.default_headers ?? {}));
    setRetryPolicyJson(prettyJson(api.retry_policy ?? { max_retries: 3, backoff: 2 }));
    // auth_config es write-only: no vuelve del GET
    setAuthHeaderName("X-API-Key");
    setAuthUsername("");
    setAuthPassword("");
    setAuthAccessToken("");
  }, [api]);

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !api) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive text-sm">
          Error al cargar la API externa. Verifica permisos y que el servicio esté disponible.
        </div>
      </div>
    );
  }

  const endpointKeys = Object.keys(api.endpoints ?? {});

  const buildAuthConfig = (): Record<string, unknown> | undefined => {
    const cfg: Record<string, unknown> = {};
    if (authType === "api_key" && authHeaderName.trim()) {
      cfg.header_name = authHeaderName.trim();
    }
    if (authType === "basic") {
      if (authUsername.trim()) cfg.username = authUsername.trim();
      if (authPassword.trim()) cfg.password = authPassword.trim();
    }
    if (authType === "oauth2" && authAccessToken.trim()) {
      cfg.access_token = authAccessToken.trim();
    }
    return Object.keys(cfg).length ? cfg : undefined;
  };

  const save = () => {
    if (!id || !canManage) return;
    if (!name.trim() || !baseUrl.trim()) {
      toast.error("Nombre y Base URL son obligatorios");
      return;
    }
    const headers = parseJsonObject(defaultHeadersJson, "default_headers");
    if (!headers.ok) {
      toast.error(headers.error);
      return;
    }
    const retry = parseJsonObject(retryPolicyJson, "retry_policy");
    if (!retry.ok) {
      toast.error(retry.error);
      return;
    }
    if (authType === "endpoint_auth") {
      if (!authEndpointKey.trim()) {
        toast.error("Selecciona el endpoint de autenticación");
        return;
      }
      if (!endpointKeys.includes(authEndpointKey.trim())) {
        toast.error(`El endpoint «${authEndpointKey}» no existe. Créalo primero.`);
        return;
      }
    }

    const timeout = Number(timeoutSeconds);
    const ttl = Number(authTokenTtl);
    const auth_config = buildAuthConfig();

    update.mutate(
      {
        id,
        data: {
          name: name.trim(),
          description: description.trim(),
          base_url: baseUrl.trim(),
          auth_type: authType,
          timeout_seconds: Number.isFinite(timeout) ? timeout : 30,
          is_active: isActive,
          default_headers: headers.value,
          retry_policy: retry.value,
          // Incluir endpoints actuales: el serializer valida auth_endpoint_key ∈ endpoints
          endpoints: api.endpoints ?? {},
          auth_endpoint_key: authType === "endpoint_auth" ? authEndpointKey.trim() : "",
          auth_token_path: authType === "endpoint_auth" ? authTokenPath.trim() || "Token" : "",
          auth_token_ttl_seconds: authType === "endpoint_auth" && Number.isFinite(ttl) ? ttl : 0,
          ...(apiKey.trim() ? { api_key: apiKey.trim() } : {}),
          ...(auth_config ? { auth_config } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success("API actualizada");
          setEditing(false);
          setApiKey("");
          refetch();
        },
        onError: () => toast.error("No se pudo guardar"),
      },
    );
  };

  const saveEndpoints = (next: Record<string, ExternalAPIEndpoint>) => {
    if (!id || !canManage) return;
    update.mutate(
      { id, data: { endpoints: next } },
      {
        onSuccess: () => {
          toast.success("Endpoints actualizados");
          refetch();
        },
        onError: () => toast.error("No se pudieron guardar los endpoints"),
      },
    );
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-start gap-3">
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to="/apis">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Globe className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
                {api.name}
              </h1>
              <Badge variant={api.is_active ? "default" : "secondary"} className="text-[10px]">
                {api.is_active ? "Activa" : "Inactiva"}
              </Badge>
              {!canManage && (
                <Badge variant="outline" className="text-[10px] gap-1 font-normal">
                  <Lock className="h-3 w-3" /> Solo lectura
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono truncate mt-0.5">
              {api.base_url ?? "Sin URL base"}
            </p>
          </div>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2 self-start">
            <Button variant="outline" size="sm" onClick={() => setTestOpen(true)}>
              <FlaskConical className="h-4 w-4 mr-1.5" />
              Probar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="h-4 w-4 mr-1.5" />
              {editing ? "Cancelar edición" : "Editar"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={remove.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar API</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Eliminar «{api.name}»? Las funciones que la usen pueden dejar de funcionar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (!id) return;
                      remove.mutate(id, {
                        onSuccess: () => {
                          toast.success("API eliminada");
                          navigate("/apis");
                        },
                        onError: () => toast.error("No se pudo eliminar"),
                      });
                    }}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </header>

      <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
        <div>
          <h2 className="text-sm font-medium">Configuración</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conexión, autenticación, headers y reintentos.
          </p>
        </div>

        {editing && canManage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Auth</Label>
              <Select value={authType} onValueChange={(v) => setAuthType(v as ExternalAPIAuthType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUTH_TYPE_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Base URL</Label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Timeout (s)</Label>
              <Input
                type="number"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(e.target.value)}
              />
            </div>
            {(authType === "api_key" || authType === "bearer" || authType === "oauth2") && (
              <div className="space-y-2">
                <Label>
                  {authType === "bearer" || authType === "oauth2" ? "Token / API Key" : "API Key"}{" "}
                  {api.api_key_masked ? (
                    <span className="text-muted-foreground font-normal">
                      (actual {api.api_key_masked})
                    </span>
                  ) : null}
                </Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                  autoComplete="off"
                />
              </div>
            )}
            {authType === "api_key" && (
              <div className="space-y-2">
                <Label>Header de API Key</Label>
                <Input
                  value={authHeaderName}
                  onChange={(e) => setAuthHeaderName(e.target.value)}
                  placeholder="X-API-Key"
                  className="font-mono text-sm"
                />
              </div>
            )}
            {authType === "basic" && (
              <>
                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <Input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </>
            )}
            {authType === "oauth2" && (
              <div className="space-y-2 md:col-span-2">
                <Label>Access token (auth_config)</Label>
                <Input
                  type="password"
                  value={authAccessToken}
                  onChange={(e) => setAuthAccessToken(e.target.value)}
                  placeholder="Opcional si ya guardaste api_key"
                  autoComplete="off"
                />
              </div>
            )}
            {authType === "endpoint_auth" && (
              <>
                <div className="space-y-2">
                  <Label>Endpoint de auth</Label>
                  <Select
                    value={authEndpointKey || "__none__"}
                    onValueChange={(v) => setAuthEndpointKey(v === "__none__" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {endpointKeys.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {endpointKeys.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Crea primero un endpoint de login abajo.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Ruta del token (auth_token_path)</Label>
                  <Input
                    value={authTokenPath}
                    onChange={(e) => setAuthTokenPath(e.target.value)}
                    placeholder="Token | data.access_token"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>TTL token (s)</Label>
                  <Input
                    type="number"
                    value={authTokenTtl}
                    onChange={(e) => setAuthTokenTtl(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label>default_headers (JSON)</Label>
              <Textarea
                value={defaultHeadersJson}
                onChange={(e) => setDefaultHeadersJson(e.target.value)}
                rows={3}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>retry_policy (JSON)</Label>
              <Textarea
                value={retryPolicyJson}
                onChange={(e) => setRetryPolicyJson(e.target.value)}
                rows={3}
                className="font-mono text-xs"
              />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              Activa
            </label>
            <div className="md:col-span-2">
              <Button onClick={save} disabled={update.isPending}>
                {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Nombre</span>
              <p className="font-medium">{api.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Autenticación</span>
              <p className="font-medium">
                {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground text-xs">URL base</span>
              <p className="font-medium font-mono text-xs break-all">{api.base_url ?? "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Timeout</span>
              <p className="font-medium">{api.timeout_seconds ?? "—"}s</p>
            </div>
            {api.api_key_masked && (
              <div>
                <span className="text-muted-foreground text-xs">API Key</span>
                <p className="font-medium font-mono text-xs">{api.api_key_masked}</p>
              </div>
            )}
            {api.auth_type === "endpoint_auth" && (
              <>
                <div>
                  <span className="text-muted-foreground text-xs">Endpoint auth</span>
                  <p className="font-medium font-mono text-xs">{api.auth_endpoint_key || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Token path</span>
                  <p className="font-medium font-mono text-xs">{api.auth_token_path || "—"}</p>
                </div>
              </>
            )}
            {api.description && (
              <div className="md:col-span-2">
                <span className="text-muted-foreground text-xs">Descripción</span>
                <p className="font-medium">{api.description}</p>
              </div>
            )}
            {api.default_headers && Object.keys(api.default_headers).length > 0 && (
              <div className="md:col-span-2">
                <span className="text-muted-foreground text-xs">Headers por defecto</span>
                <pre className="mt-1 text-[11px] font-mono rounded-md border bg-muted/30 p-2 overflow-auto">
                  {prettyJson(api.default_headers)}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>

      <ExternalApiEndpointsPanel
        endpoints={api.endpoints ?? {}}
        canManage={canManage}
        saving={update.isPending}
        onSave={saveEndpoints}
      />

      <TestConnectionDialog open={testOpen} onOpenChange={setTestOpen} api={api} />
    </div>
  );
}
