import { useMemo, useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Plus, FlaskConical, ArrowUpRight, Lock, LayoutGrid, X } from "lucide-react";
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
import { useAdminBranches, useMyBranchesSelect } from "@/api/hooks/useBranches";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import {
  canManageExternalApis,
  canViewExternalApiEndpoints,
  canViewExternalApiInstallations,
  isOrganizationOwner,
  isSuperAdmin,
  showBranchFilterUI,
} from "@/lib/authGuards";
import { GLOBAL_BRANCH_ID, getActiveBranchId } from "@/lib/branchStorage";
import { AUTH_TYPE_HINT, AUTH_TYPE_LABEL, formatTestResultToast } from "@/lib/external-api";
import { APP_STORE_PATH, hostFromUrl } from "@/lib/applications";
import { AppIcon } from "@/components/applications/app-icon";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = "__all__";

function endpointCount(api: ExternalAPI): number {
  return api.endpoints ? Object.keys(api.endpoints).length : 0;
}

function appEnabledInBranch(api: ExternalAPI, branchId: string): boolean {
  const ids = new Set([
    ...(api.branches ?? []).map(String),
    ...(api.branch != null ? [String(api.branch)] : []),
  ]);
  return ids.has(branchId);
}

function AppStoreCard({
  api,
  canManage,
  showEndpointCount,
  showBranchCount,
  testPending,
  onTest,
}: {
  api: ExternalAPI;
  canManage: boolean;
  showEndpointCount: boolean;
  showBranchCount: boolean;
  testPending: boolean;
  onTest: () => void;
}) {
  const count = endpointCount(api);
  const branchNames = api.branch_names ?? [];
  const branchCount = Math.max(branchNames.length, api.branches?.length ?? 0, api.branch ? 1 : 0);
  const tags = (api.tags ?? []).filter(Boolean);
  const visibleTags = tags.slice(0, 3);
  const extraTags = tags.length - visibleTags.length;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
        "hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]",
        api.is_active ? "border-border/80" : "border-border/50 opacity-75",
      )}
    >
      <div className="flex items-start gap-3.5">
        <AppIcon
          name={api.name}
          src={api.icon_display_url || api.icon_url || api.icon}
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm leading-snug truncate tracking-tight">
              {api.name}
            </h3>
            <Badge
              variant={api.is_active ? "default" : "secondary"}
              className="text-[10px] font-normal"
            >
              {api.is_active ? "Activa" : "Inactiva"}
            </Badge>
            {api.category ? (
              <Badge
                variant="outline"
                className="text-[10px] font-normal border-primary/30 text-primary"
              >
                {api.category}
              </Badge>
            ) : null}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{hostFromUrl(api.base_url)}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type}
            </span>
            {showEndpointCount && (
              <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {count} endpoint{count === 1 ? "" : "s"}
              </span>
            )}
            {showBranchCount && (
              <span
                className="inline-flex items-center rounded-md border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[10px] text-primary"
                title={branchNames.join(", ") || undefined}
              >
                {branchCount} sucursal{branchCount === 1 ? "" : "es"}
              </span>
            )}
          </div>
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {extraTags > 0 && (
                <span className="inline-flex items-center rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                  +{extraTags}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {api.description ? (
        <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
          {api.description}
        </p>
      ) : (
        <p className="mt-3 text-[12px] text-muted-foreground/60">Sin descripción</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-3 mt-4">
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
            title={
              api.health_endpoint_key
                ? `Prueba el endpoint «${api.health_endpoint_key}»`
                : api.auth_type === "endpoint_auth"
                  ? "Prueba el login (o configurá un endpoint de prueba en la app)"
                  : "GET a la URL base (o configurá un endpoint de prueba en la app)"
            }
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
  const reduceMotion = useReducedMotion();
  const canManage = canManageExternalApis();
  const showEndpointMeta = canViewExternalApiEndpoints();
  const showBranchMeta = canViewExternalApiInstallations();
  const showBranchFilter = showBranchFilterUI();
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const [branchFilter, setBranchFilter] = useState(GLOBAL_BRANCH_ID);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const {
    data: apisRaw = [],
    isLoading,
    refetch,
  } = useExternalAPIs({
    scope: "store",
    includeInactive: true,
  });
  const { data: adminBranches = [] } = useAdminBranches({
    enabled: showBranchFilter && (isGlobalAdmin || isOrgOwner),
  });
  const { data: myBranches = [] } = useMyBranchesSelect();
  const create = useCreateExternalAPI();
  const test = useTestExternalAPI();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [authType, setAuthType] = useState<ExternalAPIAuthType>("none");
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [createTags, setCreateTags] = useState<string[]>([]);
  const [testingId, setTestingId] = useState<string | null>(null);

  const branchOptions = useMemo(() => {
    const fromMy = myBranches.map((b) => ({
      id: String(b.value),
      label: b.label,
    }));
    if (isGlobalAdmin || isOrgOwner) {
      const fromAdmin = adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name || String(b.id),
      }));
      const byId = new Map<string, { id: string; label: string }>();
      for (const opt of [...fromAdmin, ...fromMy]) {
        if (!byId.has(opt.id)) byId.set(opt.id, opt);
      }
      return Array.from(byId.values()).sort((a, b) =>
        a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
      );
    }
    return fromMy;
  }, [adminBranches, isGlobalAdmin, isOrgOwner, myBranches]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const api of apisRaw) {
      const c = (api.category || "").trim();
      if (c) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [apisRaw]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const api of apisRaw) {
      for (const t of api.tags ?? []) {
        const tag = String(t || "").trim();
        if (tag) set.add(tag);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
  }, [apisRaw]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filteringByBranch = showBranchFilter && branchFilter !== GLOBAL_BRANCH_ID;

    return apisRaw
      .filter((api) => {
        if (filteringByBranch) {
          if (api.is_active === false) return false;
          if (!appEnabledInBranch(api, branchFilter)) return false;
        }
        if (categoryFilter !== ALL_CATEGORIES) {
          if ((api.category || "").trim() !== categoryFilter) return false;
        }
        if (selectedTags.length > 0) {
          const apiTags = new Set((api.tags ?? []).map((t) => String(t).toLowerCase()));
          if (!selectedTags.every((t) => apiTags.has(t.toLowerCase()))) return false;
        }
        if (!term) return true;
        return (
          api.name.toLowerCase().includes(term) ||
          (api.base_url ?? "").toLowerCase().includes(term) ||
          (api.description ?? "").toLowerCase().includes(term) ||
          (api.category ?? "").toLowerCase().includes(term) ||
          (AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? "").toLowerCase().includes(term) ||
          (api.branch_names ?? []).some((n) => n.toLowerCase().includes(term)) ||
          (api.tags ?? []).some((t) => String(t).toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.name || "").localeCompare(b.name || "", "es");
      });
  }, [apisRaw, search, showBranchFilter, branchFilter, categoryFilter, selectedTags]);

  const resetCreate = () => {
    setName("");
    setDescription("");
    setBaseUrl("");
    setAuthType("none");
    setApiKey("");
    setCategory("");
    setTagsInput("");
    setCreateTags([]);
  };

  const addCreateTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || createTags.length >= 8) return;
    if (createTags.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    setCreateTags((prev) => [...prev, tag.slice(0, 32)]);
    setTagsInput("");
  };

  const toggleFilterTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
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
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Store de apps</h1>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Catálogo de aplicaciones. Filtrá por sucursal, categoría o tags; en el detalle ves dónde
            está disponible.
            {!canManage && (
              <span className="inline-flex items-center gap-1 ml-1.5">
                <Lock className="h-3 w-3" /> Solo lectura
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canManage && (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Añadir aplicación
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const filteringByBranch = showBranchFilter && branchFilter !== GLOBAL_BRANCH_ID;
  const hasActiveFilter =
    Boolean(search.trim()) ||
    filteringByBranch ||
    categoryFilter !== ALL_CATEGORIES ||
    selectedTags.length > 0;

  const filterBar = (
    <div className="space-y-2.5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        <Input
          placeholder="Buscar por nombre, host, categoría o tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 min-w-0"
          disabled={isLoading}
        />
        {showBranchFilter && branchOptions.length > 0 && (
          <BranchFilterSelect
            className="space-y-0 shrink-0"
            label=""
            value={branchFilter}
            onValueChange={(v) => startTransition(() => setBranchFilter(v))}
            options={branchOptions}
            allLabel="Todas las sucursales"
            triggerClassName="h-9 w-full lg:w-[220px]"
            disabled={isLoading}
          />
        )}
        {categoryOptions.length > 0 && (
          <Select
            value={categoryFilter}
            onValueChange={(v) => startTransition(() => setCategoryFilter(v))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9 w-full lg:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Todas las categorías</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {tagOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagOptions.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => startTransition(() => toggleFilterTag(tag))}
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                  active
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/30",
                )}
              >
                {tag}
              </button>
            );
          })}
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => startTransition(() => setSelectedTags([]))}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> Limpiar tags
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <AdminPageMotion className="space-y-5">
        {storeHeader}
        {filterBar}
        <div className="flex items-center justify-center min-h-[240px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminPageMotion>
    );
  }

  return (
    <AdminPageMotion className="space-y-5">
      {storeHeader}
      {filterBar}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <LayoutGrid className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {hasActiveFilter ? "Sin resultados" : "Tu store está vacío"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {filteringByBranch
                ? "No hay apps activas en esta sucursal."
                : hasActiveFilter
                  ? "Probá otra búsqueda o limpiá los filtros."
                  : canManage
                    ? "Añadí la primera aplicación al catálogo y habilitala en las sucursales que correspondan."
                    : "No hay aplicaciones en el store."}
            </p>
          </div>
          {canManage && !hasActiveFilter && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Añadir aplicación
            </Button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((api) => (
              <motion.div
                key={api.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <AppStoreCard
                  api={api}
                  canManage={canManage}
                  showEndpointCount={showEndpointMeta}
                  showBranchCount={showBranchMeta}
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
                        onError: (err) => {
                          toast.error(
                            (err as { friendlyMessage?: string })?.friendlyMessage ||
                              "Prueba falló",
                          );
                          setTestingId(null);
                        },
                      },
                    );
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
              const homeBranch =
                (branchFilter !== GLOBAL_BRANCH_ID ? branchFilter : null) || getActiveBranchId();
              const branchPayload = homeBranch
                ? {
                    branches: [Number.isNaN(Number(homeBranch)) ? homeBranch : Number(homeBranch)],
                  }
                : {};
              create.mutate(
                {
                  name: name.trim(),
                  description: description.trim() || undefined,
                  base_url: baseUrl.trim(),
                  auth_type: authType,
                  is_active: true,
                  category: category.trim() || null,
                  tags: createTags,
                  ...(apiKey.trim() ? { api_key: apiKey.trim() } : {}),
                  ...branchPayload,
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
              <Label>Categoría</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="ej. Salud, ERP, Logística"
                list="store-category-suggestions"
              />
              <datalist id="store-category-suggestions">
                {categoryOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addCreateTag(tagsInput);
                  }
                }}
                placeholder="Enter para agregar (máx. 8)"
                list="store-tag-suggestions"
              />
              <datalist id="store-tag-suggestions">
                {tagOptions.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              {createTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {createTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCreateTags((prev) => prev.filter((t) => t !== tag))}
                      className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px]"
                    >
                      {tag}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}
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
              Solo info general. Los endpoints y sucursales se configuran después en el detalle.
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
