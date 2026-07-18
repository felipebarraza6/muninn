import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ArrowLeft,
  Loader2,
  FlaskConical,
  Pencil,
  Trash2,
  Lock,
  Settings2,
  Route,
  KeyRound,
} from "lucide-react";
import {
  useExternalAPI,
  useUpdateExternalAPI,
  useDeleteExternalAPI,
  type ExternalAPIAuthType,
  type ExternalAPIEndpoint,
} from "@/api/hooks/useExternalAPIs";
import { canManageExternalApis } from "@/lib/authGuards";
import {
  AUTH_HEADER_PREFIX_OPTIONS,
  AUTH_TYPE_HINT,
  AUTH_TYPE_LABEL,
  parseJsonObject,
  prettyJson,
} from "@/lib/external-api";
import { APP_STORE_PATH } from "@/lib/applications";
import { AppIcon } from "@/components/applications/app-icon";
import { PersonalConnectionsPanel } from "@/components/applications/personal-connections-panel";
import { ExternalApiEndpointsPanel } from "@/components/external-apis/endpoint-editor";
import { ExternalApiTestPanel } from "@/components/external-apis/external-api-test-panel";
import { toast } from "sonner";

type ApiDetailTab = "configuracion" | "endpoints" | "cuenta" | "probar";

export default function APIDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const canManage = canManageExternalApis();
  const { data: api, isLoading, error, refetch } = useExternalAPI(id);
  const update = useUpdateExternalAPI();
  const remove = useDeleteExternalAPI();

  const tabParam = searchParams.get("tab");
  const tab: ApiDetailTab =
    tabParam === "endpoints" || tabParam === "probar" || tabParam === "cuenta"
      ? tabParam
      : "configuracion";
  const setTab = (next: ApiDetailTab) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === "configuracion") p.delete("tab");
        else p.set("tab", next);
        return p;
      },
      { replace: true },
    );
  };

  const [editing, setEditing] = useState(false);
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
  const [authTokenPath, setAuthTokenPath] = useState("access_token");
  const [authTokenTtl, setAuthTokenTtl] = useState("0");
  /** Prefijo Authorization tras login: Bearer (JWT) o Token (DRF). */
  const [authHeaderPrefix, setAuthHeaderPrefix] = useState<"Bearer" | "Token">("Bearer");
  const [authConfigTouched, setAuthConfigTouched] = useState(false);
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
    setAuthTokenPath(api.auth_token_path || "access_token");
    setAuthTokenTtl(String(api.auth_token_ttl_seconds ?? 0));
    setDefaultHeadersJson(prettyJson(api.default_headers ?? {}));
    setRetryPolicyJson(prettyJson(api.retry_policy ?? { max_retries: 3, backoff: 2 }));
    // auth_config es write-only: no vuelve del GET — no forzar vacío al guardar
    setAuthHeaderName("X-API-Key");
    setAuthUsername("");
    setAuthPassword("");
    setAuthAccessToken("");
    setAuthHeaderPrefix(api.auth_header_prefix === "Token" ? "Token" : "Bearer");
    setAuthConfigTouched(false);
  }, [api]);

  const handleAuthTypeChange = (v: ExternalAPIAuthType) => {
    setAuthType(v);
    if (v === "endpoint_auth") {
      // Solo sugerir defaults si el usuario aún no configuró nada.
      // No pisar Token / TTL=0 (APIs de un solo uso, ej. Dentidesk).
      if (!authTokenPath.trim()) {
        setAuthTokenPath("access_token");
      }
      if (authTokenTtl === "" || authTokenTtl == null) {
        setAuthTokenTtl("3500");
      }
    }
  };

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
          Error al cargar la aplicación. Verifica permisos y que el servicio esté disponible.
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
    if (authType === "endpoint_auth") {
      // Solo metadatos de flujo. Credenciales van en test/skill (placeholders del login).
      cfg.auth_header_prefix = authHeaderPrefix;
      cfg._clear_secrets = true;
    }
    return Object.keys(cfg).length ? cfg : undefined;
  };

  const save = () => {
    if (!id || !canManage) return;
    if (!name.trim() || !baseUrl.trim()) {
      toast.error("Nombre y URL base son obligatorios");
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
    if (
      authType === "endpoint_auth" &&
      authEndpointKey.trim() &&
      !endpointKeys.includes(authEndpointKey.trim())
    ) {
      toast.error(`El endpoint «${authEndpointKey}» no existe. Créalo en la pestaña Endpoints.`);
      setTab("endpoints");
      return;
    }

    const timeout = Number(timeoutSeconds);
    const ttl = Number(authTokenTtl);
    // Solo enviar auth_config si el usuario tocó credenciales / campos de auth
    // (auth_config es write-only; un PATCH vacío podría borrar secretos).
    const auth_config =
      authConfigTouched ||
      authType === "api_key" ||
      authType === "endpoint_auth" ||
      (authType === "basic" && (authUsername.trim() || authPassword.trim())) ||
      (authType === "oauth2" && authAccessToken.trim())
        ? buildAuthConfig()
        : undefined;

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
          auth_token_path:
            authType === "endpoint_auth" ? authTokenPath.trim() || "access_token" : "",
          auth_token_ttl_seconds: authType === "endpoint_auth" && Number.isFinite(ttl) ? ttl : 0,
          ...(apiKey.trim() ? { api_key: apiKey.trim() } : {}),
          ...(auth_config ? { auth_config } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success("Aplicación actualizada");
          setEditing(false);
          setApiKey("");
          setAuthPassword("");
          setAuthConfigTouched(false);
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

  const endpointCount = endpointKeys.length;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-start gap-3">
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to={APP_STORE_PATH}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Store
          </Link>
        </Button>
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <AppIcon name={api.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
                {api.name}
              </h1>
              <Badge variant={api.is_active ? "default" : "secondary"} className="text-[10px]">
                {api.is_active ? "Instalada" : "Inactiva"}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-normal">
                {endpointCount} endpoint{endpointCount === 1 ? "" : "s"}
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
            {tab !== "probar" && (
              <Button variant="outline" size="sm" onClick={() => setTab("probar")}>
                <FlaskConical className="h-4 w-4 mr-1.5" />
                Probar
              </Button>
            )}
            {tab === "configuracion" && (
              <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                <Pencil className="h-4 w-4 mr-1.5" />
                {editing ? "Cancelar edición" : "Editar"}
              </Button>
            )}
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
                  <AlertDialogTitle>Eliminar aplicación</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Eliminar «{api.name}»? Las skills que la usen pueden dejar de funcionar.
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
                          toast.success("Aplicación eliminada");
                          navigate(APP_STORE_PATH);
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as ApiDetailTab)} className="space-y-4">
        <TabsList className="w-full sm:w-auto justify-start">
          <TabsTrigger value="configuracion" className="gap-1.5 flex-1 sm:flex-none">
            <Settings2 className="h-3.5 w-3.5" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="gap-1.5 flex-1 sm:flex-none">
            <Route className="h-3.5 w-3.5" />
            Endpoints
            {endpointCount > 0 ? (
              <span className="text-[10px] text-muted-foreground tabular-nums">
                ({endpointCount})
              </span>
            ) : null}
          </TabsTrigger>
          {api.auth_type === "endpoint_auth" && (
            <TabsTrigger value="cuenta" className="gap-1.5 flex-1 sm:flex-none">
              <KeyRound className="h-3.5 w-3.5" />
              Mi cuenta
            </TabsTrigger>
          )}
          <TabsTrigger value="probar" className="gap-1.5 flex-1 sm:flex-none">
            <FlaskConical className="h-3.5 w-3.5" />
            Probar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracion" className="mt-0">
          <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
            <div>
              <h2 className="text-sm font-medium">Configuración general</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nombre, URL base, autenticación y conexión. Luego definí las rutas en Endpoints.
              </p>
            </div>

            {canManage && endpointCount === 0 && (
              <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <span>Siguiente paso: crea al menos un endpoint (login, listados, etc.).</span>
                <Button size="sm" variant="outline" onClick={() => setTab("endpoints")}>
                  Ir a Endpoints
                </Button>
              </div>
            )}

            {editing && canManage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Auth</Label>
                  <Select
                    value={authType}
                    onValueChange={(v) => handleAuthTypeChange(v as ExternalAPIAuthType)}
                  >
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
                  <p className="text-[11px] text-muted-foreground">
                    {AUTH_TYPE_HINT[authType] ?? ""}
                  </p>
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
                      {authType === "bearer" || authType === "oauth2"
                        ? "Token / API Key"
                        : "API Key"}{" "}
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
                    <div className="md:col-span-2 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5">
                      <p className="text-xs text-muted-foreground">
                        Aquí solo defines el <strong className="text-foreground">flujo</strong>: qué
                        endpoint hace login, de dónde sale el token y el prefijo del header. En el
                        endpoint de login usa placeholders (
                        <code className="text-[10px]">{"{{email}}"}</code>,{" "}
                        <code className="text-[10px]">{"{{password}}"}</code>, etc.). Cada owner
                        vincula su cuenta en la pestaña{" "}
                        <strong className="text-foreground">Mi cuenta</strong>; las skills
                        reutilizan esa sesión sin pedir usuario/clave como parámetros.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Endpoint de login</Label>
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
                          Crea primero el endpoint de login en la pestaña Endpoints.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Campo del token en la respuesta</Label>
                      <Input
                        value={authTokenPath}
                        onChange={(e) => setAuthTokenPath(e.target.value)}
                        placeholder="access_token"
                        className="font-mono text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Dot-path JSON, ej. access_token o data.Token
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Prefijo Authorization</Label>
                      <Select
                        value={authHeaderPrefix}
                        onValueChange={(v) => {
                          setAuthHeaderPrefix(v as "Bearer" | "Token");
                          setAuthConfigTouched(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTH_HEADER_PREFIX_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        Se envía como{" "}
                        <code className="text-[10px]">
                          Authorization: {authHeaderPrefix} &lt;token&gt;
                        </code>
                        . JWT → Bearer. Token DRF/hex (ej. SmartHydro) → Token.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>TTL del token (segundos)</Label>
                      <Input
                        type="number"
                        value={authTokenTtl}
                        onChange={(e) => setAuthTokenTtl(e.target.value)}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        0 = sin caché (login en cada llamada; obligatorio si el token es de un solo
                        uso). &gt;0 cachea el token (ej. 3500 ≈ 58 min para JWT reutilizable).
                      </p>
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
                      <p className="font-medium font-mono text-xs">
                        {api.auth_endpoint_key || "—"}
                      </p>
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
        </TabsContent>

        <TabsContent value="endpoints" className="mt-0">
          <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
            <div>
              <h2 className="text-sm font-medium">Endpoints</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Rutas de la aplicación que usan las skills. Si usás auth Login, creá primero el
                endpoint de login y seleccionálo en Configuración.
              </p>
            </div>
            <ExternalApiEndpointsPanel
              endpoints={api.endpoints ?? {}}
              canManage={canManage}
              saving={update.isPending}
              onSave={saveEndpoints}
              embedded
              authEndpointKey={
                authType === "endpoint_auth"
                  ? authEndpointKey.trim() || api.auth_endpoint_key || ""
                  : ""
              }
            />
          </section>
        </TabsContent>

        {api.auth_type === "endpoint_auth" && (
          <TabsContent value="cuenta" className="mt-0">
            <PersonalConnectionsPanel api={api} />
          </TabsContent>
        )}

        <TabsContent value="probar" className="mt-0">
          <ExternalApiTestPanel api={api} onExit={() => setTab("configuracion")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
