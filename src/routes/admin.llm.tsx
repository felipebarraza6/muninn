import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Cpu,
  FlaskConical,
  RefreshCw,
  Trash2,
  Pencil,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVIDER_TYPES,
  useCreateLlmModel,
  useCreateLlmProvider,
  useDeleteLlmProvider,
  useLlmModels,
  useLlmProviders,
  useProviderModelCapabilities,
  useSyncLlmModels,
  useTestLlmProvider,
  useUpdateLlmModel,
  useUpdateLlmProvider,
  capabilityLabel,
  LLM_CAPABILITY_FILTER_KEYS,
  type LlmModel,
  type LlmProvider,
  type LlmTestConnectionResult,
} from "@/api/hooks/useLlm";
import { useAdminBranches, useMyBranchesSelect } from "@/api/hooks/useBranches";
import {
  canManageLlmProviders,
  canMutateLlmModels,
  canSyncLlmProviders,
  isOrganizationOwner,
  isSuperAdmin,
  showBranchFilterUI,
} from "@/lib/authGuards";
import { GLOBAL_BRANCH_ID, getActiveBranchId } from "@/lib/branchStorage";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { toast } from "sonner";
import type { AxiosError } from "axios";

function parseTestConnectionResult(data: unknown, fallbackError?: string): LlmTestConnectionResult {
  if (data && typeof data === "object") {
    const d = data as LlmTestConnectionResult;
    if (typeof d.success === "boolean" || d.error || d.message) return d;
    const anyD = data as Record<string, unknown>;
    if (anyD.detail) return { success: false, error: String(anyD.detail) };
  }
  return { success: false, error: fallbackError || "Error desconocido" };
}

function formatTestTimestamp(ts?: string) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("es-CL");
  } catch {
    return ts;
  }
}

const ACTIVE_MODELS_PAGE_SIZE = 15;
const SYNC_CATALOG_PAGE_SIZE = 20;

export default function AdminLlmPage() {
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const canManageProviders = canManageLlmProviders();
  const canEditModels = canMutateLlmModels();
  const canSync = canSyncLlmProviders();
  const showBranchFilter = showBranchFilterUI();
  const [branchFilter, setBranchFilter] = useState(GLOBAL_BRANCH_ID);
  const providerScope = branchFilter === GLOBAL_BRANCH_ID ? "all" : branchFilter;
  const { data: providers = [], isLoading, refetch } = useLlmProviders({ scope: providerScope });
  const { data: adminBranches = [] } = useAdminBranches({
    enabled: canManageProviders && isGlobalAdmin,
  });
  const { data: myBranches = [] } = useMyBranchesSelect();

  const branchOptions = useMemo(() => {
    if (isGlobalAdmin) {
      return adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name || String(b.id),
      }));
    }
    return myBranches.map((b) => ({
      id: String(b.value),
      label: b.label,
    }));
  }, [isGlobalAdmin, adminBranches, myBranches]);

  const filteredProviders = useMemo(() => {
    if (!showBranchFilter || branchFilter === GLOBAL_BRANCH_ID) return providers;
    return providers.filter((p) => (p.branches ?? []).some((id) => String(id) === branchFilter));
  }, [providers, showBranchFilter, branchFilter]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => filteredProviders.find((p) => String(p.id) === selectedId) ?? null,
    [filteredProviders, selectedId],
  );
  const { data: activeModelsPage, isLoading: modelsLoading } = useLlmModels({
    providerId: selectedId,
    isActive: true,
    enabled: Boolean(selectedId),
  });
  const activeModels = activeModelsPage?.results ?? [];

  const [activeSearch, setActiveSearch] = useState("");
  const deferredActiveSearch = useDeferredValue(activeSearch);
  const [activePage, setActivePage] = useState(1);

  const filteredActiveModels = useMemo(() => {
    const q = deferredActiveSearch.trim().toLowerCase();
    if (!q) return activeModels;
    return activeModels.filter((m) => {
      const haystack = [m.name, m.model_id, m.description].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [activeModels, deferredActiveSearch]);

  const activeTotalPages = Math.max(
    1,
    Math.ceil(filteredActiveModels.length / ACTIVE_MODELS_PAGE_SIZE),
  );
  const safeActivePage = Math.min(activePage, activeTotalPages);
  const pagedActiveModels = useMemo(() => {
    const start = (safeActivePage - 1) * ACTIVE_MODELS_PAGE_SIZE;
    return filteredActiveModels.slice(start, start + ACTIVE_MODELS_PAGE_SIZE);
  }, [filteredActiveModels, safeActivePage]);

  useEffect(() => {
    setActivePage(1);
  }, [selectedId, deferredActiveSearch]);

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncSearch, setSyncSearch] = useState("");
  const deferredSyncSearch = useDeferredValue(syncSearch);
  const [syncPage, setSyncPage] = useState(1);
  const [syncCaps, setSyncCaps] = useState<string[]>([]);
  const [syncFreeOnly, setSyncFreeOnly] = useState(false);
  const [activatingModelId, setActivatingModelId] = useState<string | null>(null);

  const { data: capabilityKeys = [] } = useProviderModelCapabilities(
    syncModalOpen ? selectedId : null,
  );
  const catalogCapKeys = useMemo(() => {
    const set = new Set<string>([...LLM_CAPABILITY_FILTER_KEYS, ...capabilityKeys]);
    const ordered: string[] = LLM_CAPABILITY_FILTER_KEYS.filter((k) => set.has(k));
    for (const k of capabilityKeys) {
      if (!ordered.includes(k)) ordered.push(k);
    }
    return ordered;
  }, [capabilityKeys]);

  const { data: inactiveModelsPage, isLoading: inactiveLoading, isFetching: inactiveFetching } =
    useLlmModels({
      providerId: selectedId,
      isActive: false,
      isFree: syncFreeOnly || undefined,
      capabilities: syncCaps.length ? syncCaps : undefined,
      search: deferredSyncSearch,
      page: syncPage,
      pageSize: SYNC_CATALOG_PAGE_SIZE,
      enabled: Boolean(selectedId) && syncModalOpen,
    });
  const inactiveModels = inactiveModelsPage?.results ?? [];
  const inactiveTotal = inactiveModelsPage?.count ?? 0;
  const inactiveTotalPages = Math.max(1, Math.ceil(inactiveTotal / SYNC_CATALOG_PAGE_SIZE));

  const toggleSyncCap = (key: string) => {
    setSyncPage(1);
    setSyncCaps((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
  };

  useEffect(() => {
    if (filteredProviders.length === 0) {
      if (selectedId) setSelectedId(null);
      return;
    }
    if (selectedId && filteredProviders.some((p) => String(p.id) === selectedId)) return;
    setSelectedId(String(filteredProviders[0].id));
    setProviderFormOpen(false);
  }, [filteredProviders, selectedId]);

  const createProvider = useCreateLlmProvider();
  const updateProvider = useUpdateLlmProvider();
  const deleteProvider = useDeleteLlmProvider();
  const testProvider = useTestLlmProvider();
  const syncModels = useSyncLlmModels();
  const createModel = useCreateLlmModel();
  const updateModel = useUpdateLlmModel();

  /** true = panel derecho muestra formulario de proveedor (en vez de modelos). */
  const [providerFormOpen, setProviderFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<LlmProvider | null>(null);
  const [pName, setPName] = useState("");
  const [pType, setPType] = useState("openai");
  const [pDescription, setPDescription] = useState("");
  const [pBaseUrl, setPBaseUrl] = useState("");
  const [pApiKey, setPApiKey] = useState("");
  const [pActive, setPActive] = useState(true);
  const [pBranches, setPBranches] = useState<string[]>([]);
  const [branchSearch, setBranchSearch] = useState("");

  const filteredBranchOptions = useMemo(() => {
    const q = branchSearch.trim().toLowerCase();
    if (!q) return branchOptions;
    return branchOptions.filter((b) => b.label.toLowerCase().includes(q));
  }, [branchOptions, branchSearch]);

  const [modelOpen, setModelOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LlmModel | null>(null);
  const [mName, setMName] = useState("");
  const [mModelId, setMModelId] = useState("");
  const [mDescription, setMDescription] = useState("");
  const [mMaxTokens, setMMaxTokens] = useState("");
  const [mContextWindow, setMContextWindow] = useState("");
  const [mActive, setMActive] = useState(true);
  const [mRecommended, setMRecommended] = useState(false);

  const [testResultOpen, setTestResultOpen] = useState(false);
  const [testResult, setTestResult] = useState<LlmTestConnectionResult | null>(null);

  const runSyncAndOpenCatalog = () => {
    if (!selected) return;
    syncModels.mutate(selected.id, {
      onSuccess: (data) => {
        const summary = data as { created?: number; updated?: number; remote_count?: number };
        const created = summary.created ?? 0;
        const updated = summary.updated ?? 0;
        toast.success(
          created || updated
            ? `Catálogo sincronizado · ${created} nuevos, ${updated} actualizados`
            : "Catálogo sincronizado",
        );
        setSyncSearch("");
        setSyncPage(1);
        setSyncCaps([]);
        setSyncFreeOnly(false);
        setSyncModalOpen(true);
      },
      onError: (e) =>
        toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Falló sync"),
    });
  };

  const openInactiveCatalog = () => {
    setSyncSearch("");
    setSyncPage(1);
    setSyncCaps([]);
    setSyncFreeOnly(false);
    setSyncModalOpen(true);
  };

  const activateModel = (m: LlmModel) => {
    setActivatingModelId(String(m.id));
    updateModel.mutate(
      { id: m.id, data: { is_active: true } },
      {
        onSuccess: () => {
          toast.success(`${m.name} activado`);
          setActivatingModelId(null);
        },
        onError: (e) => {
          setActivatingModelId(null);
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo activar");
        },
      },
    );
  };
  const runConnectionTest = () => {
    if (!selected) return;
    testProvider.mutate(selected.id, {
      onSuccess: (data) => {
        setTestResult(parseTestConnectionResult(data));
        setTestResultOpen(true);
      },
      onError: (e) => {
        const err = e as AxiosError<LlmTestConnectionResult>;
        const body = err.response?.data;
        setTestResult(
          parseTestConnectionResult(
            body,
            (e as { friendlyMessage?: string }).friendlyMessage || err.message,
          ),
        );
        setTestResultOpen(true);
      },
    });
  };

  const resetProviderForm = () => {
    setPName("");
    setPType("openai");
    setPDescription("");
    setPBaseUrl("");
    setPApiKey("");
    setPActive(true);
    setBranchSearch("");
    const fromFilter =
      branchFilter !== GLOBAL_BRANCH_ID && branchOptions.some((b) => b.id === branchFilter)
        ? [branchFilter]
        : null;
    const active = getActiveBranchId();
    const defaultBranches =
      fromFilter ??
      (active && branchOptions.some((b) => b.id === active)
        ? [active]
        : isOrgOwner || isGlobalAdmin
          ? []
          : branchOptions.length === 1
            ? [branchOptions[0].id]
            : []);
    setPBranches(defaultBranches);
  };

  const openCreateProvider = () => {
    setEditingProvider(null);
    resetProviderForm();
    setProviderFormOpen(true);
  };

  const openEditProvider = (p: LlmProvider) => {
    setSelectedId(String(p.id));
    setEditingProvider(p);
    setPName(p.name);
    setPType(p.provider_type || "openai");
    setPDescription(p.description || "");
    setPBaseUrl(p.base_url || "");
    setPApiKey("");
    setPActive(p.is_active !== false);
    setBranchSearch("");
    setPBranches((p.branches ?? []).map(String));
    setProviderFormOpen(true);
  };

  const closeProviderForm = () => {
    setProviderFormOpen(false);
    setEditingProvider(null);
  };

  const selectProvider = (id: string) => {
    setSelectedId(id);
    setProviderFormOpen(false);
    setEditingProvider(null);
  };

  const toggleBranch = (id: string) => {
    setPBranches((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAllBranches = () => setPBranches(branchOptions.map((b) => b.id));
  const clearBranches = () => setPBranches([]);

  const saveProvider = () => {
    if (!pName.trim()) {
      toast.error("Nombre requerido");
      return;
    }
    if (!isGlobalAdmin && pBranches.length === 0) {
      toast.error("Selecciona al menos una sucursal");
      return;
    }
    if (!editingProvider && !pApiKey.trim() && pType !== "ollama") {
      toast.error("API key requerida");
      return;
    }
    if (
      editingProvider &&
      !editingProvider.api_key_configured &&
      !pApiKey.trim() &&
      pType !== "ollama"
    ) {
      toast.error("API key requerida");
      return;
    }

    const payload: Partial<LlmProvider> = {
      name: pName.trim(),
      provider_type: pType,
      description: pDescription.trim() || null,
      base_url: pBaseUrl.trim() || null,
      is_active: pActive,
      auth_type: "api_key",
      branches: pBranches.map((id) => (Number.isNaN(Number(id)) ? id : Number(id))),
    };
    if (pApiKey.trim()) payload.api_key = pApiKey.trim();

    if (editingProvider) {
      updateProvider.mutate(
        { id: editingProvider.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Proveedor actualizado");
            closeProviderForm();
            refetch();
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al guardar"),
        },
      );
    } else {
      createProvider.mutate(payload, {
        onSuccess: (created) => {
          toast.success("Proveedor creado");
          setSelectedId(String(created.id));
          closeProviderForm();
          refetch();
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      });
    }
  };

  const openCreateModel = () => {
    if (!selectedId) return;
    setEditingModel(null);
    setMName("");
    setMModelId("");
    setMDescription("");
    setMMaxTokens("");
    setMContextWindow("");
    setMActive(true);
    setMRecommended(false);
    setModelOpen(true);
  };

  const openEditModel = (m: LlmModel) => {
    setEditingModel(m);
    setMName(m.name);
    setMModelId(m.model_id || "");
    setMDescription(m.description || "");
    setMMaxTokens(m.max_tokens != null ? String(m.max_tokens) : "");
    setMContextWindow(m.context_window != null ? String(m.context_window) : "");
    setMActive(m.is_active !== false);
    setMRecommended(Boolean(m.is_recommended));
    setModelOpen(true);
  };

  const saveModel = () => {
    if (!selectedId || !mName.trim() || !mModelId.trim()) {
      toast.error("Nombre y model_id requeridos");
      return;
    }
    const payload: Partial<LlmModel> = {
      name: mName.trim(),
      model_id: mModelId.trim(),
      provider: selectedId,
      description: mDescription.trim() || null,
      is_active: mActive,
      is_recommended: mRecommended,
      max_tokens: mMaxTokens.trim() ? Number(mMaxTokens) : null,
      context_window: mContextWindow.trim() ? Number(mContextWindow) : null,
    };
    if (editingModel) {
      updateModel.mutate(
        { id: editingModel.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Modelo actualizado");
            setModelOpen(false);
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error"),
        },
      );
    } else {
      createModel.mutate(payload, {
        onSuccess: () => {
          toast.success("Modelo creado");
          setModelOpen(false);
        },
        onError: (e) => toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 flex justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminPageMotion>
      {showBranchFilter && (
        <AdminMotionItem>
          <div className="mb-2">
            <BranchFilterSelect
              value={branchFilter}
              onValueChange={(v) => startTransition(() => setBranchFilter(v))}
              options={branchOptions}
            />
          </div>
        </AdminMotionItem>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] gap-6 lg:gap-8">
        <AdminMotionItem>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">
              {filteredProviders.length}{" "}
              {filteredProviders.length === 1 ? "proveedor" : "proveedores"}
              {!canManageProviders ? " · solo lectura" : ""}
            </span>
            {canManageProviders && (
              <Button size="sm" variant="ghost" onClick={openCreateProvider}>
                <Plus className="h-4 w-4 mr-1" /> Nuevo
              </Button>
            )}
          </div>
          <AdminMotionList className="space-y-1.5">
            {filteredProviders.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">Sin providers.</p>
            )}
            {filteredProviders.map((p) => (
              <AdminMotionItem key={String(p.id)}>
                <button
                  type="button"
                  onClick={() => selectProvider(String(p.id))}
                  className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    selectedId === String(p.id) && !providerFormOpen
                      ? "bg-sidebar-accent text-primary"
                      : selectedId === String(p.id) && providerFormOpen
                        ? "bg-muted"
                        : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Cpu
                      className={`h-4 w-4 shrink-0 ${
                        selectedId === String(p.id) ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{p.name}</span>
                        {p.is_active === false && (
                          <Badge variant="secondary" className="text-[10px]">
                            Off
                          </Badge>
                        )}
                      </div>
                      {canManageProviders && (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {p.provider_type} · {p.api_key_configured ? "API key ok" : "Sin API key"}
                          {p.branches?.length ? ` · ${p.branches.length} suc.` : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  {canManageProviders && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-7 w-7 shrink-0 ${
                        providerFormOpen &&
                        editingProvider &&
                        String(editingProvider.id) === String(p.id)
                          ? "text-primary"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditProvider(p);
                      }}
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </button>
              </AdminMotionItem>
            ))}
          </AdminMotionList>
        </AdminMotionItem>

        <AdminMotionItem>
          {providerFormOpen && canManageProviders ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    onClick={closeProviderForm}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Modelos
                  </Button>
                  <h2 className="text-sm font-medium">
                    {editingProvider ? "Configurar proveedor" : "Nuevo proveedor"}
                  </h2>
                </div>
              </div>

              <div className="space-y-3 max-w-xl">
                <div>
                  <Label>Nombre</Label>
                  <Input value={pName} onChange={(e) => setPName(e.target.value)} />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={pType} onValueChange={setPType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDER_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Input
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Notas del provider"
                  />
                </div>
                <div>
                  <Label>Base URL (opcional)</Label>
                  <Input
                    value={pBaseUrl}
                    onChange={(e) => setPBaseUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>
                    API Key{" "}
                    {editingProvider
                      ? editingProvider.api_key_configured
                        ? "(dejar vacío para no cambiar)"
                        : "(requerida)"
                      : pType === "ollama"
                        ? "(opcional)"
                        : "(requerida)"}
                  </Label>
                  <Input
                    type="password"
                    value={pApiKey}
                    onChange={(e) => setPApiKey(e.target.value)}
                    autoComplete="off"
                    placeholder={editingProvider?.api_key_configured ? "••••••••" : "sk-..."}
                  />
                </div>

                {branchOptions.length > 0 && (
                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Label className="mb-0">
                        Sucursales
                        {!isGlobalAdmin ? " *" : " (opcional)"}
                      </Label>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-muted-foreground">
                          {pBranches.length}/{branchOptions.length}
                        </span>
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={selectAllBranches}
                        >
                          Todas
                        </button>
                        <span className="text-muted-foreground">·</span>
                        <button
                          type="button"
                          className="text-muted-foreground hover:underline"
                          onClick={clearBranches}
                        >
                          Ninguna
                        </button>
                      </div>
                    </div>
                    {branchOptions.length > 6 && (
                      <Input
                        value={branchSearch}
                        onChange={(e) => setBranchSearch(e.target.value)}
                        placeholder="Buscar sucursal…"
                        className="mb-2 h-8 text-xs"
                      />
                    )}
                    <div className="max-h-44 overflow-y-auto rounded-md border border-border p-2 space-y-1">
                      {filteredBranchOptions.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                          Sin resultados
                        </p>
                      )}
                      {filteredBranchOptions.map((b) => (
                        <label
                          key={b.id}
                          className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted/60"
                        >
                          <input
                            type="checkbox"
                            checked={pBranches.includes(b.id)}
                            onChange={() => toggleBranch(b.id)}
                          />
                          <span className="truncate">{b.label}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {isGlobalAdmin
                        ? "Vacío = visible según reglas globales del API."
                        : "El proveedor quedará disponible solo en las sucursales marcadas."}
                    </p>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pActive}
                    onChange={(e) => setPActive(e.target.checked)}
                  />
                  Activo
                </label>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    onClick={saveProvider}
                    disabled={createProvider.isPending || updateProvider.isPending}
                  >
                    Guardar
                  </Button>
                  <Button variant="ghost" onClick={closeProviderForm}>
                    Cancelar
                  </Button>
                  {editingProvider && (
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive ml-auto"
                      disabled={deleteProvider.isPending}
                      onClick={() => {
                        if (!confirm(`¿Eliminar provider ${editingProvider.name}?`)) return;
                        deleteProvider.mutate(editingProvider.id, {
                          onSuccess: () => {
                            toast.success("Eliminado");
                            setSelectedId(null);
                            closeProviderForm();
                            refetch();
                          },
                          onError: (e) =>
                            toast.error(
                              (e as { friendlyMessage?: string }).friendlyMessage ||
                                "No se pudo eliminar",
                            ),
                        });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-medium">Modelos activos</h2>
                  {selected && (
                    <p className="text-[11px] text-muted-foreground">
                      {activeModels.length} activo{activeModels.length === 1 ? "" : "s"}
                      {filteredActiveModels.length > ACTIVE_MODELS_PAGE_SIZE
                        ? ` · pág. ${safeActivePage}/${activeTotalPages}`
                        : ""}
                    </p>
                  )}
                </div>
                {selected && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={testProvider.isPending}
                      onClick={runConnectionTest}
                    >
                      {testProvider.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      ) : (
                        <FlaskConical className="h-3.5 w-3.5 mr-1" />
                      )}
                      Test
                    </Button>
                    {canSync && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={syncModels.isPending}
                          onClick={runSyncAndOpenCatalog}
                        >
                          {syncModels.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          )}
                          Sync
                        </Button>
                        <Button size="sm" variant="outline" onClick={openInactiveCatalog}>
                          Catálogo
                        </Button>
                      </>
                    )}
                    {canEditModels && (
                      <Button size="sm" onClick={openCreateModel}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Modelo
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {selected && activeModels.length > 0 && (
                <div className="mb-3">
                  <Input
                    value={activeSearch}
                    onChange={(e) => setActiveSearch(e.target.value)}
                    placeholder="Buscar modelo activo…"
                    className="h-8 text-xs"
                  />
                </div>
              )}

              <AdminMotionList className="divide-y divide-border/60">
                {!selected && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Elige un proveedor a la izquierda.
                  </p>
                )}
                {selected && modelsLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {selected &&
                  !modelsLoading &&
                  pagedActiveModels.map((m) => (
                    <AdminMotionItem key={String(m.id)}>
                      <div className="flex items-center justify-between gap-2 px-1 py-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm truncate">{m.name}</span>
                            {m.is_recommended && (
                              <Badge variant="secondary" className="text-[10px]">
                                Rec.
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            {m.model_id}
                            {m.context_window != null ? ` · ctx ${m.context_window}` : ""}
                          </div>
                          {(() => {
                            const caps =
                              m.capabilities &&
                              typeof m.capabilities === "object" &&
                              !Array.isArray(m.capabilities)
                                ? Object.entries(m.capabilities as Record<string, unknown>)
                                    .filter(([, v]) => v === true)
                                    .map(([k]) => k)
                                : [];
                            if (!caps.length) return null;
                            return (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {caps.slice(0, 3).map((c) => (
                                  <Badge key={c} variant="outline" className="text-[10px]">
                                    {capabilityLabel(c)}
                                  </Badge>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {canEditModels && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => openEditModel(m)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {canManageProviders && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive"
                              onClick={() =>
                                updateModel.mutate(
                                  { id: m.id, data: { is_active: false } },
                                  {
                                    onSuccess: () => toast.success("Modelo desactivado"),
                                    onError: (e) =>
                                      toast.error(
                                        (e as { friendlyMessage?: string }).friendlyMessage ||
                                          "Error",
                                      ),
                                  },
                                )
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </AdminMotionItem>
                  ))}
                {selected && !modelsLoading && activeModels.length === 0 && (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Sin modelos activos.</p>
                    {canSync && (
                      <Button size="sm" variant="outline" onClick={runSyncAndOpenCatalog}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Sincronizar catálogo
                      </Button>
                    )}
                  </div>
                )}
                {selected && !modelsLoading && activeModels.length > 0 && filteredActiveModels.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    Sin resultados para esa búsqueda.
                  </p>
                )}
                {selected && !modelsLoading && filteredActiveModels.length > ACTIVE_MODELS_PAGE_SIZE && (
                  <div className="flex items-center justify-between gap-2 py-3 text-xs text-muted-foreground">
                    <span>
                      {(safeActivePage - 1) * ACTIVE_MODELS_PAGE_SIZE + 1}–
                      {Math.min(safeActivePage * ACTIVE_MODELS_PAGE_SIZE, filteredActiveModels.length)}{" "}
                      de {filteredActiveModels.length}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        disabled={safeActivePage <= 1}
                        onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                      >
                        Anterior
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        disabled={safeActivePage >= activeTotalPages}
                        onClick={() => setActivePage((p) => Math.min(activeTotalPages, p + 1))}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </AdminMotionList>
            </>
          )}
        </AdminMotionItem>
      </div>

      <Dialog open={testResultOpen} onOpenChange={setTestResultOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              Prueba de conexión
              {testResult && (
                <Badge
                  variant={testResult.success ? "default" : "destructive"}
                  className="text-[10px]"
                >
                  {testResult.success ? "OK" : "Falló"}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {testResult && (
            <div className="space-y-3 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {testResult.provider_name && (
                  <div className="min-w-0">
                    <span className="text-muted-foreground text-xs">Proveedor</span>
                    <p className="font-medium truncate">
                      {testResult.provider_name}
                      {testResult.provider ? (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          · {testResult.provider}
                        </span>
                      ) : null}
                    </p>
                  </div>
                )}
                {testResult.timestamp && (
                  <div className="min-w-0 sm:text-right">
                    <span className="text-muted-foreground text-xs">Fecha</span>
                    <p className="text-xs sm:text-sm">
                      {formatTestTimestamp(testResult.timestamp)}
                    </p>
                  </div>
                )}
              </div>

              {testResult.url_tested && (
                <div className="min-w-0">
                  <span className="text-muted-foreground text-xs">URL probada</span>
                  <p className="mt-0.5 font-mono text-[11px] break-all rounded-md bg-muted px-2 py-1.5 leading-snug">
                    {testResult.method ? `${testResult.method} ` : ""}
                    {testResult.url_tested}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {testResult.status_code != null && (
                  <div>
                    <span className="text-muted-foreground text-xs">HTTP</span>
                    <p className="font-mono font-medium">{testResult.status_code}</p>
                  </div>
                )}
                {testResult.latency_ms != null && (
                  <div>
                    <span className="text-muted-foreground text-xs">Latencia</span>
                    <p className="font-mono font-medium">{testResult.latency_ms} ms</p>
                  </div>
                )}
              </div>

              {(testResult.message || testResult.error) && (
                <div
                  className={`rounded-md border px-3 py-2 text-xs ${
                    testResult.success
                      ? "border-primary/30 bg-primary/5 text-foreground"
                      : "border-destructive/30 bg-destructive/5 text-destructive"
                  }`}
                >
                  {testResult.success ? testResult.message : testResult.error}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {testResult.headers_sent && Object.keys(testResult.headers_sent).length > 0 && (
                  <div className="min-w-0">
                    <span className="text-muted-foreground text-xs">Headers enviados</span>
                    <pre className="mt-1 max-h-24 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono leading-snug">
                      {JSON.stringify(testResult.headers_sent, null, 2)}
                    </pre>
                  </div>
                )}
                {testResult.response_preview && (
                  <div className="min-w-0">
                    <span className="text-muted-foreground text-xs">Vista previa de respuesta</span>
                    <pre className="mt-1 max-h-24 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono whitespace-pre-wrap break-all leading-snug">
                      {testResult.response_preview}
                    </pre>
                  </div>
                )}
              </div>

              <Button
                className="w-full sm:w-auto sm:min-w-[8rem]"
                onClick={() => setTestResultOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={syncModalOpen}
        onOpenChange={(open) => {
          setSyncModalOpen(open);
          if (!open) {
            setSyncSearch("");
            setSyncPage(1);
            setSyncCaps([]);
            setSyncFreeOnly(false);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Catálogo sincronizado — modelos inactivos</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">
            Los modelos del proveedor se importan como inactivos. Agrega los que quieras usar; pasan a
            la lista de activos.
          </p>
          <Input
            value={syncSearch}
            onChange={(e) => {
              setSyncSearch(e.target.value);
              setSyncPage(1);
            }}
            placeholder="Buscar por nombre o model_id…"
            className="h-8 text-xs"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSyncFreeOnly((v) => !v);
                setSyncPage(1);
              }}
              className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                syncFreeOnly
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              Gratis
            </button>
            {catalogCapKeys.map((key) => {
              const on = syncCaps.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSyncCap(key)}
                  className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                    on
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {capabilityLabel(key)}
                </button>
              );
            })}
            {(syncCaps.length > 0 || syncFreeOnly) && (
              <button
                type="button"
                className="text-[11px] text-muted-foreground hover:underline px-1"
                onClick={() => {
                  setSyncCaps([]);
                  setSyncFreeOnly(false);
                  setSyncPage(1);
                }}
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="max-h-[min(52vh,420px)] overflow-y-auto rounded-md border border-border divide-y divide-border/60">
            {inactiveLoading || (inactiveFetching && inactiveModels.length === 0) ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : inactiveModels.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {deferredSyncSearch.trim() || syncCaps.length || syncFreeOnly
                  ? "Sin resultados para esos filtros."
                  : "No hay modelos inactivos. Ejecuta Sync para importar el catálogo del proveedor."}
              </p>
            ) : (
              inactiveModels.map((m) => {
                const caps =
                  m.capabilities && typeof m.capabilities === "object" && !Array.isArray(m.capabilities)
                    ? Object.entries(m.capabilities as Record<string, unknown>)
                        .filter(([, v]) => v === true)
                        .map(([k]) => k)
                    : Array.isArray(m.capabilities)
                      ? (m.capabilities as string[])
                      : [];
                const isFree =
                  m.is_free === true ||
                  (m.cost_per_1k_input != null &&
                    m.cost_per_1k_output != null &&
                    Number(m.cost_per_1k_input) === 0 &&
                    Number(m.cost_per_1k_output) === 0);
                return (
                  <div
                    key={String(m.id)}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {m.model_id}
                        {m.context_window != null ? ` · ctx ${m.context_window}` : ""}
                      </p>
                      {(caps.length > 0 || isFree) && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {isFree && (
                            <Badge variant="secondary" className="text-[10px]">
                              Gratis
                            </Badge>
                          )}
                          {caps.slice(0, 4).map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px]">
                              {capabilityLabel(c)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {canEditModels && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 h-8"
                        disabled={activatingModelId === String(m.id)}
                        onClick={() => activateModel(m)}
                      >
                        {activatingModelId === String(m.id) ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
          {inactiveTotal > SYNC_CATALOG_PAGE_SIZE && (
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {(syncPage - 1) * SYNC_CATALOG_PAGE_SIZE + 1}–
                {Math.min(syncPage * SYNC_CATALOG_PAGE_SIZE, inactiveTotal)} de {inactiveTotal}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  disabled={syncPage <= 1 || inactiveFetching}
                  onClick={() => setSyncPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  disabled={syncPage >= inactiveTotalPages || inactiveFetching}
                  onClick={() => setSyncPage((p) => Math.min(inactiveTotalPages, p + 1))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={modelOpen} onOpenChange={setModelOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModel ? "Editar modelo" : "Nuevo modelo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nombre visible</Label>
              <Input value={mName} onChange={(e) => setMName(e.target.value)} />
            </div>
            <div>
              <Label>model_id</Label>
              <Input
                value={mModelId}
                onChange={(e) => setMModelId(e.target.value)}
                placeholder="gpt-4o-mini"
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={mDescription}
                onChange={(e) => setMDescription(e.target.value)}
                placeholder="Notas del modelo"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>max_tokens</Label>
                <Input
                  type="number"
                  value={mMaxTokens}
                  onChange={(e) => setMMaxTokens(e.target.value)}
                />
              </div>
              <div>
                <Label>context_window</Label>
                <Input
                  type="number"
                  value={mContextWindow}
                  onChange={(e) => setMContextWindow(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mActive}
                  onChange={(e) => setMActive(e.target.checked)}
                />
                Activo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={mRecommended}
                  onChange={(e) => setMRecommended(e.target.checked)}
                />
                Recomendado
              </label>
            </div>
            <Button
              className="w-full"
              onClick={saveModel}
              disabled={createModel.isPending || updateModel.isPending}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
