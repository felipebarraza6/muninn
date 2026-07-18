import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Eye, Plus, ArrowUpRight } from "lucide-react";
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
  useAgentFunctions,
  useCreateAgentFunction,
  type ImplementationType,
  type JsonSchema,
} from "@/api/hooks/useAgentFunctions";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useMyBranchesSelect } from "@/api/hooks/useBranches";
import { getActiveBranchId, setActiveBranchId } from "@/lib/branchStorage";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { canViewInactiveStudioResources } from "@/lib/authGuards";
import {
  extractPlaceholders,
  IMPLEMENTATION_TYPE_HINT,
  IMPLEMENTATION_TYPE_LABEL,
  parseJsonObject,
  prettyJson,
  slugify,
} from "@/lib/skills";
import { cn } from "@/lib/utils";

type CreateMode = "api" | "formula" | "advanced";

type FormulaParamDraft = {
  name: string;
  type: "number" | "integer" | "string";
  description: string;
  required: boolean;
};

function buildFormulaSchema(params: FormulaParamDraft[]): JsonSchema {
  const properties: Record<string, { type: string; description?: string }> = {};
  const required: string[] = [];
  for (const p of params) {
    const key = p.name.trim();
    if (!key) continue;
    properties[key] = {
      type: p.type,
      ...(p.description.trim() ? { description: p.description.trim() } : {}),
    };
    if (p.required) required.push(key);
  }
  return { type: "object", properties, required };
}

export default function Funciones() {
  const navigate = useNavigate();
  const showInactive = canViewInactiveStudioResources();
  const {
    data: functionsRaw = [],
    isLoading,
    refetch,
  } = useAgentFunctions({
    includeInactive: showInactive,
  });
  const { data: apps = [] } = useExternalAPIs({ includeInactive: false });
  const { data: branchOptions = [] } = useMyBranchesSelect();
  const create = useCreateAgentFunction();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Create wizard state
  const [mode, setMode] = useState<CreateMode>("api");
  const [branchId, setBranchId] = useState(() => getActiveBranchId() ?? "");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [responseInstructions, setResponseInstructions] = useState("");
  const [appId, setAppId] = useState("");
  const [endpointType, setEndpointType] = useState("");
  const [expression, setExpression] = useState("");
  const [formulaParams, setFormulaParams] = useState<FormulaParamDraft[]>([
    { name: "a", type: "number", description: "", required: true },
    { name: "b", type: "number", description: "", required: true },
  ]);
  const [implType, setImplType] = useState<ImplementationType>("python_code");
  const [configJson, setConfigJson] = useState("{}");
  const [schemaJson, setSchemaJson] = useState('{\n  "type": "object",\n  "properties": {}\n}');

  const functions = useMemo(() => {
    if (showInactive) {
      return [...functionsRaw].sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.name || "").localeCompare(b.name || "", "es");
      });
    }
    return functionsRaw.filter((fn) => fn.is_active !== false);
  }, [functionsRaw, showInactive]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return functions;
    return functions.filter(
      (fn) =>
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term),
    );
  }, [functions, search]);

  const selectedApp = useMemo(() => apps.find((a) => String(a.id) === appId), [apps, appId]);
  const endpointKeys = useMemo(() => Object.keys(selectedApp?.endpoints ?? {}), [selectedApp]);
  const selectedEndpoint = endpointType ? selectedApp?.endpoints?.[endpointType] : undefined;
  const inferredParams = useMemo(() => {
    if (!selectedEndpoint) return [];
    return extractPlaceholders({
      path: selectedEndpoint.path,
      query_params: selectedEndpoint.query_params,
      headers: selectedEndpoint.headers,
      body: selectedEndpoint.body,
    });
  }, [selectedEndpoint]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (appId && endpointKeys.length && !endpointKeys.includes(endpointType)) {
      const authKey = selectedApp?.auth_endpoint_key || "";
      setEndpointType(endpointKeys.find((k) => k !== authKey) || endpointKeys[0] || "");
    }
  }, [appId, endpointKeys, endpointType, selectedApp?.auth_endpoint_key]);

  useEffect(() => {
    if (!open) return;
    const active = getActiveBranchId() ?? "";
    if (active && branchOptions.some((b) => String(b.value) === String(active))) {
      setBranchId(String(active));
    } else if (branchOptions.length === 1) {
      setBranchId(String(branchOptions[0].value));
    } else if (!branchId && branchOptions[0]) {
      setBranchId(String(branchOptions[0].value));
    }
  }, [open, branchOptions, branchId]);

  const resetCreate = () => {
    setMode("api");
    setBranchId(getActiveBranchId() ?? "");
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setResponseInstructions("");
    setAppId("");
    setEndpointType("");
    setExpression("");
    setFormulaParams([
      { name: "a", type: "number", description: "", required: true },
      { name: "b", type: "number", description: "", required: true },
    ]);
    setImplType("python_code");
    setConfigJson("{}");
    setSchemaJson('{\n  "type": "object",\n  "properties": {}\n}');
  };

  const resolveBranchPayload = (): string | number | undefined => {
    const id = branchId.trim();
    if (!id) return undefined;
    const asNum = Number(id);
    return Number.isFinite(asNum) && String(asNum) === id ? asNum : id;
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || slugify(name);
    if (!name.trim() || !finalSlug) {
      toast.error("Nombre y slug son obligatorios");
      return;
    }
    if (!description.trim()) {
      toast.error("La descripción es obligatoria (la usa el LLM)");
      return;
    }
    if (!branchId.trim()) {
      toast.error("Selecciona una sucursal");
      return;
    }

    // Asegura x-branch-id (modo «todas» no envía header) + branch en payload (superadmin).
    setActiveBranchId(branchId.trim(), true, false);

    const branch = resolveBranchPayload();
    const base = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      response_instructions: responseInstructions.trim() || undefined,
      is_active: true,
      branch,
    };

    if (mode === "api") {
      if (!appId) {
        toast.error("Selecciona una Aplicación");
        return;
      }
      if (!endpointType) {
        toast.error("Selecciona un endpoint");
        return;
      }
      create.mutate(
        {
          ...base,
          implementation_type: "api",
          external_api: appId,
          config: { endpoint_type: endpointType },
        },
        {
          onSuccess: (created) => {
            toast.success("Skill creada. Completa parámetros si hace falta.");
            setOpen(false);
            resetCreate();
            void refetch();
            if (created?.id) navigate(`/skills/${created.id}`);
          },
          onError: (err) => {
            toast.error(
              (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo crear",
            );
          },
        },
      );
      return;
    }

    if (mode === "formula") {
      if (!expression.trim()) {
        toast.error("Escribí la expresión de la fórmula");
        return;
      }
      const schema = buildFormulaSchema(formulaParams);
      if (!Object.keys(schema.properties ?? {}).length) {
        toast.error("Definí al menos un parámetro para la fórmula");
        return;
      }
      create.mutate(
        {
          ...base,
          implementation_type: "formula",
          external_api: null,
          config: { expression: expression.trim() },
          parameters_schema: schema,
        },
        {
          onSuccess: (created) => {
            toast.success("Skill fórmula creada");
            setOpen(false);
            resetCreate();
            void refetch();
            if (created?.id) navigate(`/skills/${created.id}`);
          },
          onError: (err) => {
            toast.error(
              (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo crear",
            );
          },
        },
      );
      return;
    }

    const config = parseJsonObject(configJson, "config");
    if (!config.ok) {
      toast.error(config.error);
      return;
    }
    const schema = parseJsonObject(schemaJson, "parameters_schema");
    if (!schema.ok) {
      toast.error(schema.error);
      return;
    }
    create.mutate(
      {
        ...base,
        implementation_type: implType,
        config: config.value,
        parameters_schema: schema.value,
      },
      {
        onSuccess: (created) => {
          toast.success("Skill creada");
          setOpen(false);
          resetCreate();
          void refetch();
          if (created?.id) navigate(`/skills/${created.id}`);
        },
        onError: (err) => {
          toast.error((err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo crear");
        },
      },
    );
  };

  return (
    <AdminPageMotion className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground max-w-xl mt-0.5">
            Capacidades que los agentes ejecutan. Conectalas a Aplicaciones o usá fórmulas directas,
            y asígnalas desde el detalle de cada agente.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Nueva skill
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, slug o aplicación…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? "Sin resultados para esa búsqueda."
              : "No hay skills. Crea la primera."}
          </p>
          {!search.trim() && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nueva skill
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((fn) => (
            <article
              key={fn.id}
              className={cn(
                "group flex flex-col rounded-xl border bg-card/60 p-4 transition-colors",
                "hover:border-primary/35 hover:bg-card",
                fn.is_active ? "border-border" : "border-border/60 opacity-70 grayscale",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    fn.is_active
                      ? "bg-primary-soft text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-sm leading-snug truncate">{fn.name}</h3>
                    <Badge
                      variant={fn.is_active ? "default" : "secondary"}
                      className="text-[10px] font-normal"
                    >
                      {fn.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {fn.slug ?? "Sin slug"} ·{" "}
                    {fn.implementation_type
                      ? IMPLEMENTATION_TYPE_LABEL[fn.implementation_type] || fn.implementation_type
                      : "—"}
                    {fn.external_api_name ? ` · ${fn.external_api_name}` : ""}
                  </p>
                </div>
              </div>

              {fn.description ? (
                <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  {fn.description}
                </p>
              ) : (
                <p className="mt-3 text-[12px] text-muted-foreground/70 italic flex-1">
                  Sin descripción
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
                <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link to={`/skills/${fn.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Abrir
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetCreate();
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva skill</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={submitCreate}>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as CreateMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">Aplicación (API)</SelectItem>
                  <SelectItem value="formula">Fórmula / cálculo</SelectItem>
                  <SelectItem value="advanced">Avanzado (Python / DB / Webhook)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                {mode === "api"
                  ? IMPLEMENTATION_TYPE_HINT.api
                  : mode === "formula"
                    ? IMPLEMENTATION_TYPE_HINT.formula
                    : "Configuración JSON para tipos avanzados ya existentes."}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Sucursal</Label>
              <Select
                value={branchId || "__none__"}
                onValueChange={(v) => setBranchId(v === "__none__" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">—</SelectItem>
                  {branchOptions.map((b) => (
                    <SelectItem key={String(b.value)} value={String(b.value)}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Obligatoria. Si estás en modo «todas», elegí dónde crear la skill.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={
                  mode === "formula"
                    ? "ej. Calcular volumen extraído"
                    : "ej. Horas disponibles Dentidesk"
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
                className="font-mono text-sm"
                placeholder="calcular-volumen-extraido"
              />
              <p className="text-[11px] text-muted-foreground">
                Identificador que el LLM usa como nombre de tool.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Descripción (para el LLM)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
                placeholder="Cuándo debe el agente llamar esta skill…"
              />
            </div>

            {mode === "api" ? (
              <>
                <div className="space-y-2">
                  <Label>Aplicación</Label>
                  <Select
                    value={appId || "__none__"}
                    onValueChange={(v) => {
                      setAppId(v === "__none__" ? "" : v);
                      setEndpointType("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {apps.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {apps.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      No hay aplicaciones.{" "}
                      <Link
                        to="/aplicaciones"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        Instalá una primero
                      </Link>
                      .
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <Select
                    value={endpointType || "__none__"}
                    onValueChange={(v) => setEndpointType(v === "__none__" ? "" : v)}
                    disabled={!appId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona endpoint" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {endpointKeys.map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                          {k === selectedApp?.auth_endpoint_key ? " (login)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEndpoint && (
                    <p className="text-[11px] font-mono text-muted-foreground break-all">
                      {(selectedEndpoint.method || "GET").toUpperCase()} {selectedEndpoint.path}
                    </p>
                  )}
                  {inferredParams.length > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      Params inferidos:{" "}
                      <code className="text-[10px]">{inferredParams.join(", ")}</code>. El backend
                      completa el schema al crear.
                    </p>
                  )}
                </div>
              </>
            ) : mode === "formula" ? (
              <>
                <div className="space-y-2">
                  <Label>Expresión</Label>
                  <Input
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="flow_l_s * hours * 3.6"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Operadores +, -, *, /, **, comparaciones y ternarios. Funciones: abs, round,
                    min, max, len, int, float, sum.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label>Parámetros (variables)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        setFormulaParams((prev) => [
                          ...prev,
                          { name: "", type: "number", description: "", required: true },
                        ])
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" /> Agregar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formulaParams.map((p, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[1fr_auto_auto] gap-2 items-start rounded-lg border p-2"
                      >
                        <Input
                          value={p.name}
                          onChange={(e) =>
                            setFormulaParams((prev) =>
                              prev.map((row, i) =>
                                i === idx ? { ...row, name: e.target.value } : row,
                              ),
                            )
                          }
                          placeholder="nombre"
                          className="h-8 font-mono text-xs"
                        />
                        <Select
                          value={p.type}
                          onValueChange={(v) =>
                            setFormulaParams((prev) =>
                              prev.map((row, i) =>
                                i === idx ? { ...row, type: v as FormulaParamDraft["type"] } : row,
                              ),
                            )
                          }
                        >
                          <SelectTrigger className="h-8 w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">number</SelectItem>
                            <SelectItem value="integer">integer</SelectItem>
                            <SelectItem value="string">string</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive"
                          disabled={formulaParams.length <= 1}
                          onClick={() =>
                            setFormulaParams((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Implementación</Label>
                  <Select
                    value={implType}
                    onValueChange={(v) => setImplType(v as ImplementationType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["python_code", "db_query", "webhook"] as const).map((t) => (
                        <SelectItem key={t} value={t}>
                          {IMPLEMENTATION_TYPE_LABEL[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    {IMPLEMENTATION_TYPE_HINT[implType]}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>config (JSON)</Label>
                  <Textarea
                    value={configJson}
                    onChange={(e) => setConfigJson(e.target.value)}
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>parameters_schema (JSON)</Label>
                  <Textarea
                    value={schemaJson}
                    onChange={(e) => setSchemaJson(e.target.value)}
                    rows={6}
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Ejemplo:{" "}
                    <code className="text-[10px]">
                      {prettyJson({
                        type: "object",
                        properties: { date: { type: "string", format: "date" } },
                        required: ["date"],
                      }).replace(/\n/g, " ")}
                    </code>
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Instrucciones de respuesta (opcional)</Label>
              <Textarea
                value={responseInstructions}
                onChange={(e) => setResponseInstructions(e.target.value)}
                rows={2}
                placeholder="Cómo debe responder el agente tras ejecutar…"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
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
