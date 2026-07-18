import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Plus, FlaskConical, ArrowUpRight, Lock, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { canManageExternalApis, canViewInactiveStudioResources } from "@/lib/authGuards";
import { AUTH_TYPE_HINT, AUTH_TYPE_LABEL, formatTestResultToast } from "@/lib/external-api";
import { APP_STORE_PATH, hostFromUrl } from "@/lib/applications";
import { AppIcon } from "@/components/applications/app-icon";
import { cn } from "@/lib/utils";

function endpointCount(api: ExternalAPI): number {
  return api.endpoints ? Object.keys(api.endpoints).length : 0;
}

function AppStoreCard({
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
        "group relative flex flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
        "hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]",
        api.is_active ? "border-border/80" : "border-border/50 opacity-75",
      )}
    >
      <div className="flex items-start gap-3.5">
        <AppIcon name={api.name} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm leading-snug truncate tracking-tight">
              {api.name}
            </h3>
            <Badge
              variant={api.is_active ? "default" : "secondary"}
              className="text-[10px] font-normal"
            >
              {api.is_active ? "Instalada" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{hostFromUrl(api.base_url)}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type}
            </span>
            <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
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
        <p className="mt-3 text-[12px] text-muted-foreground/60">Sin descripción</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-3">
        <Button size="sm" className="h-8" asChild>
          <Link to={`${APP_STORE_PATH}/${api.id}`}>
            Abrir
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
            Probar
          </Button>
        )}
      </div>
    </article>
  );
}

export default function APIs() {
  const navigate = useNavigate();
  const canManage = canManageExternalApis();
  const showInactive = canViewInactiveStudioResources();
  const {
    data: apisRaw = [],
    isLoading,
    refetch,
  } = useExternalAPIs({
    includeInactive: showInactive,
  });
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

  const apis = useMemo(() => {
    if (showInactive) {
      return [...apisRaw].sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.name || "").localeCompare(b.name || "", "es");
      });
    }
    return apisRaw.filter((a) => a.is_active !== false);
  }, [apisRaw, showInactive]);

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

  const storeHeader = (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/80 to-card px-5 py-5 md:px-6 md:py-6">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-primary">
            <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">Store</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Aplicaciones</h1>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Conectá servicios externos como apps instalables. Configurá endpoints y usalos desde
            skills.
            {!canManage && (
              <span className="inline-flex items-center gap-1 ml-1.5">
                <Lock className="h-3 w-3" /> Solo lectura
              </span>
            )}
          </p>
        </div>
        {canManage && (
          <Button size="sm" className="shrink-0" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Añadir aplicación
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminPageMotion className="space-y-5">
        {storeHeader}
        <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
          <Input placeholder="Buscar aplicaciones…" disabled className="h-9 flex-1 min-w-0" />
          <StudioBranchFilter />
        </div>
        <div className="flex items-center justify-center min-h-[240px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminPageMotion>
    );
  }

  return (
    <AdminPageMotion className="space-y-5">
      {storeHeader}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, host o auth…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <LayoutGrid className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {search.trim() ? "Sin resultados" : "Tu store está vacío"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {search.trim()
                ? "Probá con otro nombre o host."
                : canManage
                  ? "Añadí la primera aplicación para conectar un servicio y usarlo en skills."
                  : "No hay aplicaciones instaladas en esta sucursal."}
            </p>
          </div>
          {canManage && !search.trim() && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Añadir aplicación
            </Button>
          )}
        </div>
      ) : (
        <AdminMotionList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filtered.map((api) => (
            <AdminMotionItem key={api.id}>
              <AppStoreCard
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
                        toast.error("Prueba falló");
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
            <DialogTitle>Añadir aplicación</DialogTitle>
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
                    toast.success("Aplicación añadida. Completá la configuración y los endpoints.");
                    setOpen(false);
                    resetCreate();
                    refetch();
                    if (created?.id) navigate(`${APP_STORE_PATH}/${created.id}`);
                  },
                  onError: () => toast.error("No se pudo añadir"),
                },
              );
            }}
          >
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ej. Dentidesk, SmartHydro"
              />
            </div>
            <div className="space-y-2">
              <Label>URL base</Label>
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
                placeholder="Qué hace esta app en tu operación"
              />
            </div>
            <div className="space-y-2">
              <Label>Autenticación</Label>
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
              <p className="text-[11px] text-muted-foreground">{AUTH_TYPE_HINT[authType] ?? ""}</p>
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
              Solo info general. Los endpoints se configuran después en el detalle.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Añadir
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
