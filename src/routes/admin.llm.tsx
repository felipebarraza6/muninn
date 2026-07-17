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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PROVIDER_TYPES,
  useCreateLlmModel,
  useCreateLlmProvider,
  useDeleteLlmProvider,
  useLlmModels,
  useLlmProviders,
  useProviderModelCapabilities,
  useSyncLlmModels,
  useTestLlmEndpoint,
  useTestLlmProvider,
  useUpdateLlmModel,
  useUpdateLlmProvider,
  capabilityLabel,
  defaultEndpointTestConfig,
  LLM_CAPABILITY_FILTER_KEYS,
  PROVIDER_DEFAULT_ENDPOINTS,
  endpointTypeLabel,
  joinEndpointUrl,
  resolveProviderEndpoints,
  type LlmModel,
  type LlmProvider,
  type LlmTestConnectionResult,
  type LlmTestEndpointResult,
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
  const testEndpoint = useTestLlmEndpoint();
  const syncModels = useSyncLlmModels();
  const createModel = useCreateLlmModel();
  const updateModel = useUpdateLlmModel();

  /** true = panel derecho muestra formulario de LLM (en vez de modelos). */
  const [providerFormOpen, setProviderFormOpen] = useState(false);
  const [providerFormTab, setProviderFormTab] = useState("general");
  const [editingProvider, setEditingProvider] = useState<LlmProvider | null>(null);
  const [pName, setPName] = useState("");
  const [pType, setPType] = useState("openai");
  const [pDescription, setPDescription] = useState("");
  const [pBaseUrl, setPBaseUrl] = useState("");
  const [pApiKey, setPApiKey] = useState("");
  const [pActive, setPActive] = useState(true);
  const [pTestSystemPrompt, setPTestSystemPrompt] = useState("");
  const [pExtraHeadersJson, setPExtraHeadersJson] = useState("");
  const [pBranches, setPBranches] = useState<string[]>([]);
  const [branchSearch, setBranchSearch] = useState("");
  /** Overrides de path por tipo; vacío = usar default del provider_type. */
  const [pEndpointRows, setPEndpointRows] = useState<Array<{ key: string; type: string; path: string }>>(
    [],
  );
  /** Plantillas de body JSON por tipo de endpoint. */
  const [pPayloadTemplates, setPPayloadTemplates] = useState<Record<string, string>>({});
  const [selectedEndpointKey, setSelectedEndpointKey] = useState<string | null>(null);
  const [newEndpointType, setNewEndpointType] = useState("");
  const [newEndpointPath, setNewEndpointPath] = useState("");

  const [epTestType, setEpTestType] = useState("models");
  const [epTestMethod, setEpTestMethod] = useState<"GET" | "POST">("GET");
  const [epTestModelId, setEpTestModelId] = useState("");
  const [epTestBody, setEpTestBody] = useState("{}");
  const [epTestResult, setEpTestResult] = useState<LlmTestEndpointResult | null>(null);

  const defaultEndpointsForType = useMemo(
    () => PROVIDER_DEFAULT_ENDPOINTS[pType] || {},
    [pType],
  );

  const effectiveEndpoints = useMemo(() => {
    const overrides: Record<string, string> = {};
    for (const row of pEndpointRows) {
      const t = row.type.trim();
      const p = row.path.trim();
      if (t && p) overrides[t] = p.startsWith("/") ? p : `/${p}`;
    }
    return resolveProviderEndpoints(pType, overrides);
  }, [pType, pEndpointRows]);

  const selectedEndpointRow = useMemo(() => {
    if (!selectedEndpointKey) return pEndpointRows[0] ?? null;
    return pEndpointRows.find((r) => r.key === selectedEndpointKey) ?? pEndpointRows[0] ?? null;
  }, [pEndpointRows, selectedEndpointKey]);

  const buildEndpointRowsFromProvider = (p: LlmProvider | null, type: string) => {
    const defaults = PROVIDER_DEFAULT_ENDPOINTS[type] || {};
    const overrides = p?.endpoints && typeof p.endpoints === "object" ? p.endpoints : {};
    const keys = new Set([...Object.keys(defaults), ...Object.keys(overrides)]);
    return Array.from(keys)
      .sort((a, b) => a.localeCompare(b))
      .map((typeKey) => ({
        key: typeKey,
        type: typeKey,
        path: overrides[typeKey] || defaults[typeKey] || "",
      }));
  };

  const buildPayloadTemplatesFromProvider = (p: LlmProvider | null) => {
    const templates = p?.endpoints_payload_templates;
    if (!templates || typeof templates !== "object") return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(templates)) {
      try {
        out[key] = JSON.stringify(value ?? {}, null, 2);
      } catch {
        out[key] = "{}";
      }
    }
    return out;
  };

  const applyEndpointTestDefaults = (endpointType: string, templates?: Record<string, string>) => {
    const saved = templates?.[endpointType]?.trim();
    if (saved) {
      setEpTestBody(saved);
      setEpTestMethod(endpointType === "models" || endpointType === "embedding_models" ? "GET" : "POST");
      return;
    }
    const cfg = defaultEndpointTestConfig(endpointType);
    setEpTestMethod(cfg.method);
    setEpTestBody(JSON.stringify(cfg.payload, null, 2));
  };

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
    setPTestSystemPrompt("");
    setPExtraHeadersJson("");
    setBranchSearch("");
    setProviderFormTab("general");
    const rows = buildEndpointRowsFromProvider(null, "openai");
    setPEndpointRows(rows);
    setPPayloadTemplates({});
    setSelectedEndpointKey(rows[0]?.key ?? null);
    setNewEndpointType("");
    setNewEndpointPath("");
    setEpTestType("models");
    applyEndpointTestDefaults("models");
    setEpTestModelId("");
    setEpTestResult(null);
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
    setPTestSystemPrompt(p.test_system_prompt || "");
    setPExtraHeadersJson("");
    setBranchSearch("");
    setPBranches((p.branches ?? []).map(String));
    const rows = buildEndpointRowsFromProvider(p, p.provider_type || "openai");
    setPEndpointRows(rows);
    const templates = buildPayloadTemplatesFromProvider(p);
    setPPayloadTemplates(templates);
    setSelectedEndpointKey(rows[0]?.key ?? null);
    setNewEndpointType("");
    setNewEndpointPath("");
    setProviderFormTab("general");
    const firstType = rows.find((r) => r.type === "models")?.type || rows[0]?.type || "models";
    setEpTestType(firstType);
    applyEndpointTestDefaults(firstType, templates);
    setEpTestModelId("");
    setEpTestResult(null);
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

  const updateEndpointRow = (key: string, patch: Partial<{ type: string; path: string }>) => {
    setPEndpointRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const removeEndpointRow = (key: string) => {
    setPEndpointRows((prev) => {
      const next = prev.filter((r) => r.key !== key);
      setSelectedEndpointKey((cur) => {
        if (cur !== key) return cur;
        return next[0]?.key ?? null;
      });
      return next;
    });
  };

  const addEndpointRow = () => {
    const type = newEndpointType.trim().toLowerCase().replace(/\s+/g, "_");
    const pathRaw = newEndpointPath.trim();
    if (!type || !pathRaw) {
      toast.error("Tipo y ruta del endpoint requeridos");
      return;
    }
    if (pEndpointRows.some((r) => r.type === type)) {
      toast.error(`Ya existe el endpoint «${type}»`);
      return;
    }
    const path = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;
    setPEndpointRows((prev) => [...prev, { key: type, type, path }]);
    setSelectedEndpointKey(type);
    setNewEndpointType("");
    setNewEndpointPath("");
  };

  const resetEndpointsToDefaults = () => {
    const rows = buildEndpointRowsFromProvider(null, pType);
    setPEndpointRows(rows);
    setSelectedEndpointKey(rows[0]?.key ?? null);
  };

  /** Solo persiste overrides respecto al default del tipo. */
  const buildEndpointsPayload = (): Record<string, string> => {
    const defaults = defaultEndpointsForType;
    const out: Record<string, string> = {};
    for (const row of pEndpointRows) {
      const t = row.type.trim();
      let p = row.path.trim();
      if (!t || !p) continue;
      if (!p.startsWith("/")) p = `/${p}`;
      if (defaults[t] !== p) out[t] = p;
    }
    return out;
  };

  const buildPayloadTemplatesPayload = (): Record<string, unknown> | null => {
    const out: Record<string, unknown> = {};
    for (const [type, raw] of Object.entries(pPayloadTemplates)) {
      const text = raw.trim();
      if (!text) continue;
      try {
        const parsed = JSON.parse(text) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          out[type] = parsed;
        } else {
          toast.error(`Plantilla de «${type}» debe ser un objeto JSON`);
          return null;
        }
      } catch {
        toast.error(`JSON inválido en plantilla de «${type}»`);
        return null;
      }
    }
    return out;
  };

  const handleProviderTypeChange = (next: string) => {
    setPType(next);
    const rows = buildEndpointRowsFromProvider(null, next);
    setPEndpointRows(rows);
    setSelectedEndpointKey(rows[0]?.key ?? null);
  };

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

    const templates = buildPayloadTemplatesPayload();
    if (templates === null) return;

    const payload: Partial<LlmProvider> = {
      name: pName.trim(),
      provider_type: pType,
      description: pDescription.trim() || null,
      base_url: pBaseUrl.trim() || null,
      is_active: pActive,
      auth_type: "api_key",
      test_system_prompt: pTestSystemPrompt.trim() || "",
      branches: pBranches.map((id) => (Number.isNaN(Number(id)) ? id : Number(id))),
      endpoints: buildEndpointsPayload(),
      endpoints_payload_templates: templates,
    };
    if (pApiKey.trim()) payload.api_key = pApiKey.trim();

    const headersRaw = pExtraHeadersJson.trim();
    if (headersRaw) {
      try {
        const parsed = JSON.parse(headersRaw) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          toast.error("Headers extra deben ser un objeto JSON");
          return;
        }
        payload.auth_config = { extra_headers: parsed };
      } catch {
        toast.error("JSON inválido en headers extra");
        return;
      }
    }

    if (editingProvider) {
      updateProvider.mutate(
        { id: editingProvider.id, data: payload },
        {
          onSuccess: (updated) => {
            toast.success("LLM actualizado");
            setEditingProvider(updated);
            refetch();
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al guardar"),
        },
      );
    } else {
      createProvider.mutate(payload, {
        onSuccess: (created) => {
          toast.success("LLM creado");
          setSelectedId(String(created.id));
          setEditingProvider(created);
          setProviderFormTab("endpoints");
          refetch();
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      });
    }
  };

  const runEndpointProbe = () => {
    if (!editingProvider) {
      toast.error("Guarda el LLM antes de probar endpoints");
      return;
    }
    let payload: Record<string, unknown> = {};
    if (epTestMethod === "POST") {
      try {
        const parsed = JSON.parse(epTestBody || "{}") as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          payload = parsed as Record<string, unknown>;
        } else {
          toast.error("El body debe ser un objeto JSON");
          return;
        }
      } catch {
        toast.error("JSON inválido en el body");
        return;
      }
      if (epTestModelId.trim() && typeof payload.model === "string" && payload.model.includes("{{model_id}}")) {
        payload = { ...payload, model: epTestModelId.trim() };
      }
    }

    testEndpoint.mutate(
      {
        id: editingProvider.id,
        data: {
          endpoint_type: epTestType,
          method: epTestMethod,
          model_id: epTestModelId.trim() || undefined,
          payload: epTestMethod === "POST" ? payload : {},
        },
      },
      {
        onSuccess: (data) => {
          const ok = data.success !== false && !data.error;
          setEpTestResult({ ...data, success: ok });
          if (ok) toast.success("Endpoint OK");
          else toast.error(data.error || "Falló la prueba");
        },
        onError: (e) => {
          const err = e as AxiosError<LlmTestEndpointResult>;
          const body = err.response?.data;
          setEpTestResult({
            success: false,
            error:
              body?.error ||
              (e as { friendlyMessage?: string }).friendlyMessage ||
              err.message ||
              "Error",
            ...(body && typeof body === "object" ? body : {}),
          });
          toast.error("Falló la prueba");
        },
      },
    );
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
              {filteredProviders.length === 1 ? "LLM" : "LLMs"}
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
              <p className="text-sm text-muted-foreground py-6 text-center">Sin LLMs.</p>
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
                    {editingProvider ? "Configurar LLM" : "Nuevo LLM"}
                  </h2>
                </div>
              </div>

              <Tabs
                value={providerFormTab}
                onValueChange={setProviderFormTab}
                className="max-w-3xl"
              >
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  <TabsTrigger value="test" disabled={!editingProvider}>
                    Probar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-3 mt-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={pName} onChange={(e) => setPName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={pType} onValueChange={handleProviderTypeChange}>
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
                      placeholder="Notas del LLM"
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
                  <div>
                    <Label>Headers extra (JSON, opcional)</Label>
                    <Textarea
                      value={pExtraHeadersJson}
                      onChange={(e) => setPExtraHeadersJson(e.target.value)}
                      placeholder='{"HTTP-Referer":"https://mi-app.com","X-Title":"Mi App"}'
                      className="font-mono text-xs min-h-[72px]"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Se fusionan con Authorization / API key al llamar al LLM. Vacío = no
                      modificar.
                    </p>
                  </div>
                  <div>
                    <Label>System prompt de prueba (chat)</Label>
                    <Textarea
                      value={pTestSystemPrompt}
                      onChange={(e) => setPTestSystemPrompt(e.target.value)}
                      placeholder="Opcional · solo se usa al probar chat sin body custom"
                      className="min-h-[64px] text-sm"
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
                          : "El LLM quedará disponible solo en las sucursales marcadas."}
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
                </TabsContent>

                <TabsContent value="endpoints" className="space-y-3 mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-muted-foreground">
                      Rutas relativas a la Base URL. Elige un endpoint para editar su plantilla de
                      body.
                    </p>
                    <button
                      type="button"
                      className="text-[11px] text-muted-foreground hover:underline"
                      onClick={resetEndpointsToDefaults}
                    >
                      Restaurar defaults
                    </button>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    <div className="rounded-md border border-border p-3 space-y-2">
                      <Label className="mb-0">Rutas</Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {pEndpointRows.length === 0 && (
                          <p className="text-xs text-muted-foreground py-2 text-center">
                            Sin endpoints. Agrega al menos chat y models.
                          </p>
                        )}
                        {pEndpointRows.map((row) => {
                          const isCustom =
                            defaultEndpointsForType[row.type] !== undefined &&
                            defaultEndpointsForType[row.type] !== row.path.trim();
                          const isExtra = defaultEndpointsForType[row.type] === undefined;
                          const selected = selectedEndpointRow?.key === row.key;
                          return (
                            <button
                              key={row.key}
                              type="button"
                              onClick={() => setSelectedEndpointKey(row.key)}
                              className={`w-full text-left rounded-md border px-2 py-2 transition-colors ${
                                selected
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-border hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1 space-y-1">
                                  <Input
                                    value={row.type}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      updateEndpointRow(row.key, {
                                        type: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                                      })
                                    }
                                    className="h-7 font-mono text-xs"
                                    placeholder="chat"
                                  />
                                  <Input
                                    value={row.path}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      updateEndpointRow(row.key, { path: e.target.value })
                                    }
                                    className="h-7 font-mono text-xs"
                                    placeholder="/chat/completions"
                                  />
                                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                                    {endpointTypeLabel(row.type)}
                                    {isCustom ? " · override" : isExtra ? " · extra" : " · default"}
                                    {" · "}
                                    {joinEndpointUrl(pBaseUrl, row.path || "/")}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeEndpointRow(row.key);
                                    setPPayloadTemplates((prev) => {
                                      const next = { ...prev };
                                      delete next[row.type];
                                      return next;
                                    });
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr_auto] gap-1.5 pt-1 border-t border-border/60">
                        <Input
                          value={newEndpointType}
                          onChange={(e) => setNewEndpointType(e.target.value)}
                          className="h-8 font-mono text-xs"
                          placeholder="tipo"
                        />
                        <Input
                          value={newEndpointPath}
                          onChange={(e) => setNewEndpointPath(e.target.value)}
                          className="h-8 font-mono text-xs"
                          placeholder="/ruta"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={addEndpointRow}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md border border-border p-3 space-y-2">
                      <div>
                        <Label className="mb-0">
                          Plantilla de body
                          {selectedEndpointRow ? ` · ${selectedEndpointRow.type}` : ""}
                        </Label>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Se usa al probar / llamar si no envías un body distinto. Solo objetos
                          JSON.
                        </p>
                      </div>
                      {selectedEndpointRow ? (
                        <>
                          <Textarea
                            value={pPayloadTemplates[selectedEndpointRow.type] ?? ""}
                            onChange={(e) =>
                              setPPayloadTemplates((prev) => ({
                                ...prev,
                                [selectedEndpointRow.type]: e.target.value,
                              }))
                            }
                            placeholder={JSON.stringify(
                              defaultEndpointTestConfig(selectedEndpointRow.type).payload,
                              null,
                              2,
                            )}
                            className="font-mono text-xs min-h-[220px]"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const cfg = defaultEndpointTestConfig(selectedEndpointRow.type);
                                setPPayloadTemplates((prev) => ({
                                  ...prev,
                                  [selectedEndpointRow.type]: JSON.stringify(cfg.payload, null, 2),
                                }));
                              }}
                            >
                              Sugerir body
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setPPayloadTemplates((prev) => {
                                  const next = { ...prev };
                                  delete next[selectedEndpointRow.type];
                                  return next;
                                })
                              }
                            >
                              Limpiar
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground py-8 text-center">
                          Selecciona un endpoint a la izquierda.
                        </p>
                      )}
                    </div>
                  </div>

                  {Object.keys(effectiveEndpoints).length > 0 && (
                    <details className="text-[11px] text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Vista efectiva ({Object.keys(effectiveEndpoints).length})
                      </summary>
                      <ul className="mt-1 space-y-0.5 font-mono">
                        {Object.entries(effectiveEndpoints)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([type, path]) => (
                            <li key={type} className="truncate">
                              <span className="text-foreground/80">{type}</span> →{" "}
                              {joinEndpointUrl(pBaseUrl, path)}
                            </li>
                          ))}
                      </ul>
                    </details>
                  )}
                </TabsContent>

                <TabsContent value="test" className="space-y-3 mt-4">
                  {!editingProvider ? (
                    <p className="text-sm text-muted-foreground">
                      Guarda el LLM primero para poder probar endpoints.
                    </p>
                  ) : (
                    <>
                      <p className="text-[11px] text-muted-foreground">
                        Envía una petición real con el method, body y auth del LLM. La respuesta
                        muestra headers, payload enviado y body crudo.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Endpoint</Label>
                          <Select
                            value={epTestType}
                            onValueChange={(v) => {
                              setEpTestType(v);
                              applyEndpointTestDefaults(v, pPayloadTemplates);
                              setEpTestResult(null);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(effectiveEndpoints)
                                .sort((a, b) => a.localeCompare(b))
                                .map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {endpointTypeLabel(t)} ({t})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Method</Label>
                          <Select
                            value={epTestMethod}
                            onValueChange={(v) => setEpTestMethod(v as "GET" | "POST")}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>model_id (opcional)</Label>
                        <Input
                          value={epTestModelId}
                          onChange={(e) => setEpTestModelId(e.target.value)}
                          placeholder="openai/gpt-4o-mini"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="rounded-md border border-border/80 bg-muted/30 px-3 py-2 text-[11px] font-mono space-y-1">
                        <p>
                          <span className="text-muted-foreground">URL · </span>
                          {joinEndpointUrl(
                            pBaseUrl || editingProvider.base_url,
                            effectiveEndpoints[epTestType] || "/",
                          )}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Auth · </span>
                          {pType === "anthropic"
                            ? "x-api-key"
                            : pType === "google"
                              ? "x-goog-api-key"
                              : "Authorization: Bearer …"}
                          {pExtraHeadersJson.trim() ? " + extra_headers" : ""}
                        </p>
                      </div>
                      {epTestMethod === "POST" && (
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Label className="mb-0">Body (JSON)</Label>
                            <button
                              type="button"
                              className="text-[11px] text-muted-foreground hover:underline"
                              onClick={() => applyEndpointTestDefaults(epTestType, pPayloadTemplates)}
                            >
                              Usar plantilla / sugerencia
                            </button>
                          </div>
                          <Textarea
                            value={epTestBody}
                            onChange={(e) => setEpTestBody(e.target.value)}
                            className="font-mono text-xs min-h-[180px]"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={runEndpointProbe}
                          disabled={testEndpoint.isPending}
                        >
                          {testEndpoint.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <FlaskConical className="h-3.5 w-3.5 mr-1" />
                          )}
                          Ejecutar
                        </Button>
                        <Button
                          variant="outline"
                          disabled={testProvider.isPending}
                          onClick={() => {
                            testProvider.mutate(editingProvider.id, {
                              onSuccess: (data) => {
                                setTestResult(parseTestConnectionResult(data));
                                setTestResultOpen(true);
                              },
                              onError: (e) => {
                                const err = e as AxiosError<LlmTestConnectionResult>;
                                setTestResult(
                                  parseTestConnectionResult(
                                    err.response?.data,
                                    (e as { friendlyMessage?: string }).friendlyMessage ||
                                      err.message,
                                  ),
                                );
                                setTestResultOpen(true);
                              },
                            });
                          }}
                        >
                          {testProvider.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <FlaskConical className="h-3.5 w-3.5 mr-1" />
                          )}
                          Test conexión (models)
                        </Button>
                      </div>

                      {epTestResult && (
                        <div className="rounded-md border border-border space-y-3 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={epTestResult.success ? "default" : "destructive"}
                              className="text-[10px]"
                            >
                              {epTestResult.success ? "OK" : "Falló"}
                            </Badge>
                            {epTestResult.status_code != null && (
                              <span className="font-mono text-xs">
                                HTTP {epTestResult.status_code}
                              </span>
                            )}
                            {epTestResult.latency_ms != null && (
                              <span className="text-xs text-muted-foreground">
                                {epTestResult.latency_ms} ms
                              </span>
                            )}
                          </div>
                          {(epTestResult.endpoint || epTestResult.method) && (
                            <p className="font-mono text-[11px] break-all rounded-md bg-muted px-2 py-1.5">
                              {epTestResult.method ? `${epTestResult.method} ` : ""}
                              {epTestResult.endpoint}
                            </p>
                          )}
                          {epTestResult.error && (
                            <p className="text-xs text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                              {epTestResult.error}
                            </p>
                          )}
                          <div className="grid gap-3 sm:grid-cols-2">
                            {epTestResult.headers_sent &&
                              Object.keys(epTestResult.headers_sent).length > 0 && (
                                <div className="min-w-0">
                                  <span className="text-muted-foreground text-xs">Headers</span>
                                  <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono">
                                    {JSON.stringify(epTestResult.headers_sent, null, 2)}
                                  </pre>
                                </div>
                              )}
                            {epTestResult.payload_sent &&
                              Object.keys(epTestResult.payload_sent).length > 0 && (
                                <div className="min-w-0">
                                  <span className="text-muted-foreground text-xs">Body enviado</span>
                                  <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono">
                                    {JSON.stringify(epTestResult.payload_sent, null, 2)}
                                  </pre>
                                </div>
                              )}
                          </div>
                          {(epTestResult.raw_response != null || epTestResult.response) && (
                            <div className="min-w-0">
                              <span className="text-muted-foreground text-xs">Respuesta</span>
                              <pre className="mt-1 max-h-56 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono whitespace-pre-wrap break-all">
                                {typeof epTestResult.raw_response === "string"
                                  ? epTestResult.raw_response
                                  : epTestResult.raw_response != null
                                    ? JSON.stringify(epTestResult.raw_response, null, 2)
                                    : epTestResult.response}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap items-center gap-2 pt-4 max-w-3xl">
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
                      if (!confirm(`¿Eliminar LLM ${editingProvider.name}?`)) return;
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

              {selected && (
                <details className="mb-3 rounded-md border border-border/80 px-3 py-2 text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Endpoints del LLM
                    {selected.base_url ? (
                      <span className="font-mono text-[10px] ml-1.5 opacity-80">
                        · {selected.base_url}
                      </span>
                    ) : null}
                  </summary>
                  <ul className="mt-2 space-y-1 font-mono text-[11px]">
                    {Object.entries(
                      resolveProviderEndpoints(selected.provider_type, selected.endpoints),
                    )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([type, path]) => {
                        const overridden =
                          selected.endpoints &&
                          typeof selected.endpoints === "object" &&
                          type in selected.endpoints;
                        return (
                          <li key={type} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-foreground/90 min-w-[7rem]">
                              {endpointTypeLabel(type)}
                              <span className="text-muted-foreground"> ({type})</span>
                            </span>
                            <span className="truncate text-muted-foreground">
                              {selected.chat_url && type === "chat"
                                ? selected.chat_url
                                : selected.models_url && type === "models"
                                  ? selected.models_url
                                  : joinEndpointUrl(selected.base_url, path)}
                            </span>
                            {overridden && (
                              <Badge variant="outline" className="text-[9px] h-4 px-1">
                                override
                              </Badge>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                  {canManageProviders && (
                    <button
                      type="button"
                      className="mt-2 text-[11px] text-primary hover:underline"
                      onClick={() => {
                        openEditProvider(selected);
                        setProviderFormTab("endpoints");
                      }}
                    >
                      Editar endpoints…
                    </button>
                  )}
                </details>
              )}

              <AdminMotionList className="divide-y divide-border/60">
                {!selected && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Elige un LLM a la izquierda.
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
                    <span className="text-muted-foreground text-xs">LLM</span>
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
            Los modelos del LLM se importan como inactivos. Agrega los que quieras usar; pasan a
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
                  : "No hay modelos inactivos. Ejecuta Sync para importar el catálogo del LLM."}
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
