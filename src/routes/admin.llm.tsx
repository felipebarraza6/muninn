import { useMemo, useState } from "react";
import { Loader2, Plus, Cpu, FlaskConical, RefreshCw, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  useDeleteLlmModel,
  useDeleteLlmProvider,
  useLlmModels,
  useLlmProviders,
  useSyncLlmModels,
  useTestLlmProvider,
  useUpdateLlmModel,
  useUpdateLlmProvider,
  type LlmModel,
  type LlmProvider,
} from "@/api/hooks/useLlm";
import { useAdminBranches } from "@/api/hooks/useBranches";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { toast } from "sonner";

export default function AdminLlmPage() {
  const { data: providers = [], isLoading, refetch } = useLlmProviders();
  const { data: branches = [] } = useAdminBranches();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => providers.find((p) => String(p.id) === selectedId) ?? null,
    [providers, selectedId],
  );
  const { data: models = [], isLoading: modelsLoading } = useLlmModels(selectedId);

  const createProvider = useCreateLlmProvider();
  const updateProvider = useUpdateLlmProvider();
  const deleteProvider = useDeleteLlmProvider();
  const testProvider = useTestLlmProvider();
  const syncModels = useSyncLlmModels();
  const createModel = useCreateLlmModel();
  const updateModel = useUpdateLlmModel();
  const deleteModel = useDeleteLlmModel();

  const [providerOpen, setProviderOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<LlmProvider | null>(null);
  const [pName, setPName] = useState("");
  const [pType, setPType] = useState("openai");
  const [pDescription, setPDescription] = useState("");
  const [pBaseUrl, setPBaseUrl] = useState("");
  const [pApiKey, setPApiKey] = useState("");
  const [pActive, setPActive] = useState(true);
  const [pBranches, setPBranches] = useState<string[]>([]);

  const [modelOpen, setModelOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<LlmModel | null>(null);
  const [mName, setMName] = useState("");
  const [mModelId, setMModelId] = useState("");
  const [mDescription, setMDescription] = useState("");
  const [mMaxTokens, setMMaxTokens] = useState("");
  const [mContextWindow, setMContextWindow] = useState("");
  const [mActive, setMActive] = useState(true);
  const [mRecommended, setMRecommended] = useState(false);

  const openCreateProvider = () => {
    setEditingProvider(null);
    setPName("");
    setPType("openai");
    setPDescription("");
    setPBaseUrl("");
    setPApiKey("");
    setPActive(true);
    setPBranches([]);
    setProviderOpen(true);
  };

  const openEditProvider = (p: LlmProvider) => {
    setEditingProvider(p);
    setPName(p.name);
    setPType(p.provider_type || "openai");
    setPDescription(p.description || "");
    setPBaseUrl(p.base_url || "");
    setPApiKey("");
    setPActive(p.is_active !== false);
    setPBranches((p.branches ?? []).map(String));
    setProviderOpen(true);
  };

  const toggleBranch = (id: string) => {
    setPBranches((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const saveProvider = () => {
    if (!pName.trim()) {
      toast.error("Nombre requerido");
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
            setProviderOpen(false);
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al guardar"),
        },
      );
    } else {
      createProvider.mutate(payload, {
        onSuccess: (created) => {
          toast.success("Proveedor creado");
          setProviderOpen(false);
          setSelectedId(String(created.id));
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
      <AdminMotionItem>
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">LLM</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Proveedores y modelos. Los agentes eligen desde este catálogo.
            </p>
          </div>
          <Button size="sm" onClick={openCreateProvider}>
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo provider
          </Button>
        </header>
      </AdminMotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminMotionItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Proveedores</CardTitle>
              <CardDescription>{providers.length} configurados</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMotionList className="space-y-2">
                {providers.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">Sin providers.</p>
                )}
                {providers.map((p) => (
                  <AdminMotionItem key={String(p.id)}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(String(p.id))}
                      className={`w-full flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors ${
                        selectedId === String(p.id)
                          ? "border-primary bg-sidebar-accent"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{p.name}</span>
                            <Badge
                              variant={p.is_active !== false ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {p.is_active !== false ? "Activo" : "Off"}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {p.provider_type} ·{" "}
                            {p.api_key_configured ? "API key ok" : "Sin API key"}
                            {p.branches?.length ? ` · ${p.branches.length} suc.` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditProvider(p);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </button>
                  </AdminMotionItem>
                ))}
              </AdminMotionList>
            </CardContent>
          </Card>
        </AdminMotionItem>

        <AdminMotionItem>
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Modelos</CardTitle>
                <CardDescription>
                  {selected ? selected.name : "Selecciona un provider"}
                </CardDescription>
              </div>
              {selected && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={testProvider.isPending}
                    onClick={() =>
                      testProvider.mutate(selected.id, {
                        onSuccess: () => toast.success("Conexión OK"),
                        onError: (e) =>
                          toast.error(
                            (e as { friendlyMessage?: string }).friendlyMessage || "Falló el test",
                          ),
                      })
                    }
                  >
                    <FlaskConical className="h-3.5 w-3.5 mr-1" /> Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={syncModels.isPending}
                    onClick={() =>
                      syncModels.mutate(selected.id, {
                        onSuccess: () => toast.success("Sync lanzado"),
                        onError: (e) =>
                          toast.error(
                            (e as { friendlyMessage?: string }).friendlyMessage || "Falló sync",
                          ),
                      })
                    }
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync
                  </Button>
                  <Button size="sm" onClick={openCreateModel}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Modelo
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <AdminMotionList className="space-y-2">
                {!selected && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Elige un provider a la izquierda.
                  </p>
                )}
                {selected && modelsLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {selected &&
                  !modelsLoading &&
                  models.map((m) => (
                    <AdminMotionItem key={String(m.id)}>
                      <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
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
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => openEditModel(m)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              deleteModel.mutate(m.id, {
                                onSuccess: () => toast.success("Modelo eliminado"),
                                onError: (e) =>
                                  toast.error(
                                    (e as { friendlyMessage?: string }).friendlyMessage || "Error",
                                  ),
                              })
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </AdminMotionItem>
                  ))}
                {selected && !modelsLoading && models.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">Sin modelos.</p>
                )}
                {selected && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2"
                    disabled={deleteProvider.isPending}
                    onClick={() => {
                      if (!confirm(`¿Eliminar provider ${selected.name}?`)) return;
                      deleteProvider.mutate(selected.id, {
                        onSuccess: () => {
                          toast.success("Eliminado");
                          setSelectedId(null);
                        },
                        onError: (e) =>
                          toast.error(
                            (e as { friendlyMessage?: string }).friendlyMessage ||
                              "No se pudo eliminar",
                          ),
                      });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Eliminar provider
                  </Button>
                )}
              </AdminMotionList>
            </CardContent>
          </Card>
        </AdminMotionItem>
      </div>

      <Dialog open={providerOpen} onOpenChange={setProviderOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProvider ? "Editar provider" : "Nuevo provider"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
              <Label>API Key {editingProvider ? "(dejar vacío para no cambiar)" : ""}</Label>
              <Input
                type="password"
                value={pApiKey}
                onChange={(e) => setPApiKey(e.target.value)}
                autoComplete="off"
              />
            </div>
            {branches.length > 0 && (
              <div>
                <Label className="mb-2 block">Sucursales (opcional)</Label>
                <div className="max-h-36 overflow-y-auto rounded-md border border-border p-2 space-y-1.5">
                  {branches.map((b) => {
                    const id = String(b.id);
                    return (
                      <label key={id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={pBranches.includes(id)}
                          onChange={() => toggleBranch(id)}
                        />
                        <span className="truncate">{b.business_name || id}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Vacío = disponible globalmente (según reglas del API).
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
            <Button
              className="w-full"
              onClick={saveProvider}
              disabled={createProvider.isPending || updateProvider.isPending}
            >
              Guardar
            </Button>
          </div>
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
