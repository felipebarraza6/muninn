import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Globe, Plus, FlaskConical, ArrowUpRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useExternalAPIs,
  useCreateExternalAPI,
  useTestExternalAPI,
  type ExternalAPI,
  type ExternalAPIAuthType,
} from "@/api/hooks/useExternalAPIs";
import { toast } from "sonner";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { canManageExternalApis } from "@/lib/authGuards";
import { AUTH_TYPE_LABEL, formatTestResultToast } from "@/lib/external-api";
import { cn } from "@/lib/utils";

function endpointCount(api: ExternalAPI): number {
  return api.endpoints ? Object.keys(api.endpoints).length : 0;
}

function hostFromUrl(url?: string): string {
  if (!url) return "Sin URL";
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || url;
  }
}

function ApiIdentityCard({
  api,
  canManage,
  testPending,
  onTest,
}: {
  api: ExternalAPI;
  canManage: boolean;
  testPending: boolean;
  onTest: () => void;
}) {
  const count = endpointCount(api);
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card/60 p-4 transition-colors",
        "hover:border-primary/35 hover:bg-card",
        api.is_active ? "border-border" : "border-border/60 opacity-80",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20">
          <Globe className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-sm leading-snug truncate">{api.name}</h3>
            <Badge
              variant={api.is_active ? "default" : "secondary"}
              className="text-[10px] font-normal"
            >
              {api.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground truncate">
            {hostFromUrl(api.base_url)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type}
            </span>
            <span className="inline-flex items-center rounded-md border border-border/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {count} endpoint{count === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {api.description ? (
        <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
          {api.description}
        </p>
      ) : (
        <p className="mt-3 text-[12px] text-muted-foreground/70 italic">Sin descripción</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
        <Button variant="ghost" size="sm" className="h-8" asChild>
          <Link to={`/apis/${api.id}`}>
            Configurar
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
        {canManage && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            disabled={testPending}
            onClick={onTest}
            title="GET rápido a la URL base"
          >
            {testPending ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <FlaskConical className="h-3.5 w-3.5 mr-1" />
            )}
            Test
          </Button>
        )}
      </div>
    </article>
  );
}

export default function APIs() {
  const navigate = useNavigate();
  const canManage = canManageExternalApis();
  const [includeInactive, setIncludeInactive] = useState(false);
  const { data: apis = [], isLoading, refetch } = useExternalAPIs({ includeInactive });
  const create = useCreateExternalAPI();
  const test = useTestExternalAPI();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [authType, setAuthType] = useState<ExternalAPIAuthType>("none");
  const [apiKey, setApiKey] = useState("");
  const [testingId, setTestingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return apis;
    return apis.filter(
      (api) =>
        api.name.toLowerCase().includes(term) ||
        (api.base_url ?? "").toLowerCase().includes(term) ||
        (api.description ?? "").toLowerCase().includes(term) ||
        (AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? "").toLowerCase().includes(term),
    );
  }, [apis, search]);

  const resetCreate = () => {
    setName("");
    setDescription("");
    setBaseUrl("");
    setAuthType("none");
    setApiKey("");
  };

  if (isLoading) {
    return (
      <AdminPageMotion className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground max-w-xl">
            Conexiones a servicios de terceros: crear, configurar endpoints y probar.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
          <Input
            placeholder="Buscar por nombre, host o auth…"
            disabled
            className="h-9 flex-1 min-w-0"
          />
          <StudioBranchFilter />
        </div>
        <div className="flex items-center justify-center min-h-[240px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminPageMotion>
    );
  }

  return (
    <AdminPageMotion className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Conexiones a servicios de terceros: crear, configurar endpoints y probar.
          {!canManage && (
            <span className="inline-flex items-center gap-1 ml-1.5 text-muted-foreground">
              <Lock className="h-3 w-3" /> Solo lectura
            </span>
          )}
        </p>
        <div className="flex gap-2 items-center flex-wrap justify-end shrink-0">
          {canManage && (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nueva
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:max-w-2xl">
        <Input
          placeholder="Buscar por nombre, host o auth…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
        <label className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 h-9">
          <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} />
          Inactivas
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-14 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Globe className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? "Sin resultados para esa búsqueda."
              : canManage
                ? "No hay APIs en esta sucursal. Crea la primera."
                : "No hay APIs externas en esta sucursal."}
          </p>
          {canManage && !search.trim() && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nueva API
            </Button>
          )}
        </div>
      ) : (
        <AdminMotionList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((api) => (
            <AdminMotionItem key={api.id}>
              <ApiIdentityCard
                api={api}
                canManage={canManage}
                testPending={testingId === String(api.id) && test.isPending}
                onTest={() => {
                  setTestingId(String(api.id));
                  test.mutate(
                    { id: String(api.id), body: {} },
                    {
                      onSuccess: (r) => {
                        const msg = formatTestResultToast(r);
                        if (msg.ok) toast.success(msg.message);
                        else toast.error(msg.message);
                        setTestingId(null);
                      },
                      onError: () => {
                        toast.error("Test falló");
                        setTestingId(null);
                      },
                    },
                  );
                }}
              />
            </AdminMotionItem>
          ))}
        </AdminMotionList>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetCreate();
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva API externa</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canManage) return;
              create.mutate(
                {
                  name: name.trim(),
                  description: description.trim() || undefined,
                  base_url: baseUrl.trim(),
                  auth_type: authType,
                  is_active: true,
                  ...(apiKey.trim() ? { api_key: apiKey.trim() } : {}),
                },
                {
                  onSuccess: (created) => {
                    toast.success("API creada. Configura endpoints en el detalle.");
                    setOpen(false);
                    resetCreate();
                    refetch();
                    if (created?.id) navigate(`/apis/${created.id}`);
                  },
                  onError: () => toast.error("No se pudo crear"),
                },
              );
            }}
          >
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Base URL</Label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
                required
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
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
            {(authType === "api_key" || authType === "bearer" || authType === "oauth2") && (
              <div className="space-y-2">
                <Label>{authType === "api_key" ? "API Key" : "Token"}</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Tras crear, configura endpoints, headers y prueba la conexión en el detalle.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
