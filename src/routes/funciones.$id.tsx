import { useEffect, useMemo, useState } from "react";
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
  Sparkles,
  Pencil,
  Trash2,
  Settings2,
  ListTree,
  FlaskConical,
  History,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  useAgentFunction,
  useUpdateAgentFunction,
  useDeleteAgentFunction,
  type ImplementationType,
  type JsonSchema,
  type ParameterSource,
} from "@/api/hooks/useAgentFunctions";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useKnowledgeCatalog } from "@/api/hooks/useKnowledge";
import { SkillTestPanel } from "@/components/skills/skill-test-panel";
import { SkillExecutionHistory } from "@/components/skills/skill-execution-history";
import {
  guessSearchColumn,
  guessValueColumn,
  IMPLEMENTATION_TYPE_LABEL,
  isRequiredParam,
  PARAMETER_SOURCE_HINT,
  PARAMETER_SOURCE_LABEL,
  parseJsonObject,
  prettyJson,
  schemaPropertyEntries,
} from "@/lib/skills";
import { toast } from "sonner";

type SkillTab = "configuracion" | "parametros" | "probar" | "historial";

export default function FunctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: fn, isLoading, error, refetch } = useAgentFunction(id);
  const update = useUpdateAgentFunction();
  const remove = useDeleteAgentFunction();
  const { data: apps = [] } = useExternalAPIs({ includeInactive: false });
  const { data: knowledgeDocs = [], isLoading: knowledgeLoading } = useKnowledgeCatalog({
    page_size: 200,
  });

  const tabParam = searchParams.get("tab");
  const tab: SkillTab =
    tabParam === "parametros" || tabParam === "probar" || tabParam === "historial"
      ? tabParam
      : "configuracion";
  const setTab = (next: SkillTab) => {
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
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [responseInstructions, setResponseInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [implType, setImplType] = useState<ImplementationType>("api");
  const [appId, setAppId] = useState("");
  const [endpointType, setEndpointType] = useState("");
  const [configJson, setConfigJson] = useState("{}");
  const [schemaJson, setSchemaJson] = useState("{}");
  const [expression, setExpression] = useState("");
  const [sourcesDraft, setSourcesDraft] = useState<Record<string, ParameterSource>>({});
  const [newParamName, setNewParamName] = useState("");
  const [newParamType, setNewParamType] = useState<"string" | "number" | "integer" | "boolean">(
    "string",
  );
  const [newParamDesc, setNewParamDesc] = useState("");
  const [newParamRequired, setNewParamRequired] = useState(true);
  const [showAddParam, setShowAddParam] = useState(false);

  useEffect(() => {
    if (!fn) return;
    setName(fn.name);
    setSlug(fn.slug || "");
    setDescription(fn.description || "");
    setResponseInstructions(fn.response_instructions || "");
    setIsActive(fn.is_active !== false);
    setImplType((fn.implementation_type as ImplementationType) || "api");
    setAppId(fn.external_api ? String(fn.external_api) : "");
    setEndpointType(fn.config?.endpoint_type || "");
    setExpression(fn.config?.expression || "");
    setConfigJson(prettyJson(fn.config ?? {}));
    setSchemaJson(prettyJson(fn.parameters_schema ?? { type: "object", properties: {} }));
    setSourcesDraft((fn.config?.parameter_sources as Record<string, ParameterSource>) ?? {});
    setEditing(false);
  }, [fn]);

  const selectedApp = useMemo(
    () =>
      apps.find((a) => String(a.id) === appId) ||
      apps.find((a) => String(a.id) === String(fn?.external_api)),
    [apps, appId, fn?.external_api],
  );
  const endpointKeys = useMemo(() => Object.keys(selectedApp?.endpoints ?? {}), [selectedApp]);
  const paramEntries = useMemo(
    () => schemaPropertyEntries(fn?.parameters_schema),
    [fn?.parameters_schema],
  );

  /** Documentos DATA de la sucursal de la skill (o de la activa). */
  const dataDocuments = useMemo(() => {
    const skillBranch = fn?.branch != null ? String(fn.branch) : null;
    return knowledgeDocs.filter((d) => {
      if (d.knowledge_type !== "DATA" || d.is_active === false) return false;
      if (!skillBranch || d.branch == null) return true;
      return String(d.branch) === skillBranch;
    });
  }, [knowledgeDocs, fn?.branch]);

  const dataDocByTitle = useMemo(() => {
    const map = new Map<string, (typeof dataDocuments)[number]>();
    for (const d of dataDocuments) map.set(d.title, d);
    return map;
  }, [dataDocuments]);

  const applyDataDocument = (paramKey: string, title: string) => {
    const doc = dataDocByTitle.get(title);
    const columns = doc?.columns ?? [];
    const valueCol = guessValueColumn(columns);
    const searchCol = guessSearchColumn(columns, valueCol);
    setSourcesDraft((prev) => ({
      ...prev,
      [paramKey]: {
        source: "data_document",
        document_title: title,
        value_column: valueCol,
        user_input_column: searchCol || undefined,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !fn) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive text-sm">
          Error al cargar la skill. Verifica permisos y que la API esté disponible.
        </div>
      </div>
    );
  }

  const saveConfig = () => {
    if (!id) return;
    if (!name.trim() || !slug.trim() || !description.trim()) {
      toast.error("Nombre, slug y descripción son obligatorios");
      return;
    }

    if (implType === "api") {
      if (!appId) {
        toast.error("Selecciona una Aplicación");
        return;
      }
      if (!endpointType) {
        toast.error("Selecciona un endpoint");
        return;
      }
      const prevConfig = (fn.config && typeof fn.config === "object" ? fn.config : {}) as Record<
        string,
        unknown
      >;
      update.mutate(
        {
          id,
          data: {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            response_instructions: responseInstructions.trim(),
            is_active: isActive,
            implementation_type: "api",
            external_api: appId,
            config: {
              ...prevConfig,
              endpoint_type: endpointType,
              parameter_sources: sourcesDraft,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("Skill actualizada");
            setEditing(false);
            void refetch();
          },
          onError: (err) =>
            toast.error(
              (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo guardar",
            ),
        },
      );
      return;
    }

    if (implType === "formula") {
      if (!expression.trim()) {
        toast.error("La expresión de la fórmula es obligatoria");
        return;
      }
      const prevConfig = (fn.config && typeof fn.config === "object" ? fn.config : {}) as Record<
        string,
        unknown
      >;
      update.mutate(
        {
          id,
          data: {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            response_instructions: responseInstructions.trim(),
            is_active: isActive,
            implementation_type: "formula",
            external_api: null,
            config: {
              ...prevConfig,
              expression: expression.trim(),
              parameter_sources: sourcesDraft,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("Skill actualizada");
            setEditing(false);
            void refetch();
          },
          onError: (err) =>
            toast.error(
              (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo guardar",
            ),
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
    update.mutate(
      {
        id,
        data: {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          response_instructions: responseInstructions.trim(),
          is_active: isActive,
          implementation_type: implType,
          external_api: null,
          config: config.value,
          parameters_schema: schema.value,
        },
      },
      {
        onSuccess: () => {
          toast.success("Skill actualizada");
          setEditing(false);
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo guardar",
          ),
      },
    );
  };

  const regenerateSchemaFromEndpoint = () => {
    if (!id || fn.implementation_type !== "api") return;
    const prevConfig = (fn.config && typeof fn.config === "object" ? fn.config : {}) as Record<
      string,
      unknown
    >;
    update.mutate(
      {
        id,
        data: {
          implementation_type: "api",
          external_api: fn.external_api ?? (appId || null),
          config: {
            ...prevConfig,
            endpoint_type: fn.config?.endpoint_type || endpointType,
            // Fuentes viejas pueden apuntar a keys que ya no existen.
            parameter_sources: {},
          },
          // Schema vacío fuerza inferencia en el serializer del backend.
          parameters_schema: { type: "object", properties: {} },
        },
      },
      {
        onSuccess: () => {
          toast.success("Parámetros regenerados desde el endpoint");
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage ||
              "No se pudo regenerar el schema",
          ),
      },
    );
  };

  const addManualParam = () => {
    if (!id) return;
    const key = newParamName.trim().replace(/\s+/g, "_");
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      toast.error("Nombre inválido. Usá letras, números y _ (sin empezar con número).");
      return;
    }
    const credentialKeys = new Set([
      "email",
      "password",
      "passwd",
      "username",
      "user",
      "login",
      "clave",
      "usuario",
      "api_key",
      "client_id",
      "client_secret",
    ]);
    if (fn.uses_personal_connection && credentialKeys.has(key.toLowerCase())) {
      toast.error(
        "Esta skill usa la cuenta del owner. No agregues usuario/clave como parámetros; conectalos en Mi cuenta de la Aplicación.",
      );
      return;
    }
    const current = (fn.parameters_schema ?? {
      type: "object",
      properties: {},
    }) as JsonSchema;
    const properties = { ...(current.properties ?? {}) };
    if (properties[key]) {
      toast.error(`Ya existe el parámetro «${key}»`);
      return;
    }
    properties[key] = {
      type: newParamType,
      ...(newParamDesc.trim() ? { description: newParamDesc.trim() } : {}),
    };
    const required = Array.isArray(current.required) ? [...current.required] : [];
    if (newParamRequired && !required.includes(key)) required.push(key);
    const nextSchema: JsonSchema = {
      ...current,
      type: "object",
      properties,
      required,
    };
    update.mutate(
      {
        id,
        data: { parameters_schema: nextSchema },
      },
      {
        onSuccess: () => {
          toast.success(`Parámetro «${key}» agregado`);
          setNewParamName("");
          setNewParamDesc("");
          setNewParamType("string");
          setNewParamRequired(true);
          setShowAddParam(false);
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo agregar",
          ),
      },
    );
  };

  const saveSources = () => {
    if (!id) return;
    const prevConfig = (fn.config && typeof fn.config === "object" ? fn.config : {}) as Record<
      string,
      unknown
    >;
    // Quitar fuentes "free" (default implícito)
    const cleaned: Record<string, ParameterSource> = {};
    for (const [k, v] of Object.entries(sourcesDraft)) {
      if (!v || v.source === "free") continue;
      cleaned[k] = v;
    }
    update.mutate(
      {
        id,
        data: {
          config: {
            ...prevConfig,
            endpoint_type:
              (typeof prevConfig.endpoint_type === "string"
                ? prevConfig.endpoint_type
                : undefined) || fn.config?.endpoint_type,
            parameter_sources: cleaned,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Fuentes de parámetros guardadas");
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo guardar",
          ),
      },
    );
  };

  const setSourceType = (paramKey: string, source: ParameterSource["source"]) => {
    setSourcesDraft((prev) => {
      if (source === "free") {
        const next = { ...prev };
        delete next[paramKey];
        return next;
      }
      if (source === "static") {
        return { ...prev, [paramKey]: { source: "static", value: "" } };
      }
      // Prefill con el único doc DATA si hay uno solo.
      const only = dataDocuments.length === 1 ? dataDocuments[0] : null;
      if (only) {
        const columns = only.columns ?? [];
        const valueCol = guessValueColumn(columns);
        return {
          ...prev,
          [paramKey]: {
            source: "data_document",
            document_title: only.title,
            value_column: valueCol,
            user_input_column: guessSearchColumn(columns, valueCol) || undefined,
          },
        };
      }
      return {
        ...prev,
        [paramKey]: {
          source: "data_document",
          document_title: "",
          value_column: "",
        },
      };
    });
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-start gap-3">
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to="/skills">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Skills
          </Link>
        </Button>
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Sparkles className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
                {fn.name}
              </h1>
              <Badge variant={fn.is_active ? "default" : "secondary"} className="text-[10px]">
                {fn.is_active ? "Activa" : "Inactiva"}
              </Badge>
              {fn.implementation_type && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {IMPLEMENTATION_TYPE_LABEL[fn.implementation_type] || fn.implementation_type}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {fn.slug ?? "Sin slug"}
              {fn.external_api_name ? ` · ${fn.external_api_name}` : ""}
              {fn.config?.endpoint_type ? ` · ${fn.config.endpoint_type}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          {tab === "configuracion" && (
            <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="h-4 w-4 mr-1.5" />
              {editing ? "Cancelar" : "Editar"}
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
                <AlertDialogTitle>Eliminar skill</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Eliminar «{fn.name}»? Los agentes que la tengan asignada dejarán de poder usarla.
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
                        toast.success("Skill eliminada");
                        navigate("/skills");
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
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as SkillTab)} className="space-y-4">
        <TabsList className="w-full sm:w-auto justify-start flex-wrap h-auto gap-1">
          <TabsTrigger value="configuracion" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="parametros" className="gap-1.5">
            <ListTree className="h-3.5 w-3.5" />
            Parámetros
            {paramEntries.length > 0 && (
              <span className="text-[10px] text-muted-foreground tabular-nums">
                ({paramEntries.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="probar" className="gap-1.5">
            <FlaskConical className="h-3.5 w-3.5" />
            Probar
          </TabsTrigger>
          <TabsTrigger value="historial" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracion" className="mt-0">
          <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
            <div>
              <h2 className="text-sm font-medium">Configuración</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cómo se implementa la skill y a qué Aplicación/endpoint se conecta.
              </p>
            </div>

            {fn.uses_personal_connection && (
              <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">
                  Esta skill usa la cuenta del owner en {fn.external_api_name || "la Aplicación"}.
                </p>
                <p>
                  No agregues usuario ni clave como parámetros. Conectá la cuenta en{" "}
                  {fn.external_api ? (
                    <Link
                      to={`/aplicaciones/${fn.external_api}?tab=cuenta`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Mi cuenta
                    </Link>
                  ) : (
                    "Aplicaciones → Mi cuenta"
                  )}
                  .
                </p>
              </div>
            )}

            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción (LLM)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Instrucciones de respuesta</Label>
                  <Textarea
                    value={responseInstructions}
                    onChange={(e) => setResponseInstructions(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={implType}
                    onValueChange={(v) => setImplType(v as ImplementationType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(IMPLEMENTATION_TYPE_LABEL) as ImplementationType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {IMPLEMENTATION_TYPE_LABEL[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 text-sm self-end pb-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  Activa
                </label>

                {implType === "api" ? (
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
                    </div>
                    <div className="space-y-2">
                      <Label>Endpoint</Label>
                      <Select
                        value={endpointType || "__none__"}
                        onValueChange={(v) => setEndpointType(v === "__none__" ? "" : v)}
                        disabled={!appId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
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
                    </div>
                  </>
                ) : implType === "formula" ? (
                  <div className="space-y-2 md:col-span-2">
                    <Label>Expresión</Label>
                    <Input
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      className="font-mono text-sm"
                      placeholder="flow_l_s * hours * 3.6"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Los parámetros del schema se usan como variables. Editá parámetros en la
                      pestaña correspondiente.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 md:col-span-2">
                      <Label>config (JSON)</Label>
                      <Textarea
                        value={configJson}
                        onChange={(e) => setConfigJson(e.target.value)}
                        rows={5}
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>parameters_schema (JSON)</Label>
                      <Textarea
                        value={schemaJson}
                        onChange={(e) => setSchemaJson(e.target.value)}
                        rows={6}
                        className="font-mono text-xs"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <Button onClick={saveConfig} disabled={update.isPending}>
                    {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar cambios
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Nombre</span>
                  <p className="font-medium">{fn.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Slug</span>
                  <p className="font-medium font-mono text-xs">{fn.slug ?? "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Implementación</span>
                  <p className="font-medium">
                    {fn.implementation_type
                      ? IMPLEMENTATION_TYPE_LABEL[fn.implementation_type] || fn.implementation_type
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Aplicación</span>
                  <p className="font-medium">{fn.external_api_name ?? fn.external_api ?? "—"}</p>
                </div>
                {fn.config?.endpoint_type && (
                  <div>
                    <span className="text-muted-foreground text-xs">Endpoint</span>
                    <p className="font-medium font-mono text-xs">{fn.config.endpoint_type}</p>
                  </div>
                )}
                {fn.implementation_type === "formula" && fn.config?.expression && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground text-xs">Expresión</span>
                    <p className="font-medium font-mono text-xs break-all">
                      {fn.config.expression}
                    </p>
                  </div>
                )}
                {fn.description && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground text-xs">Descripción</span>
                    <p className="font-medium">{fn.description}</p>
                  </div>
                )}
                {fn.response_instructions && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground text-xs">
                      Instrucciones de respuesta
                    </span>
                    <p className="font-medium whitespace-pre-wrap">{fn.response_instructions}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="parametros" className="mt-0 space-y-4">
          <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">Parámetros ({paramEntries.length})</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Schema que ve el LLM. Las fuentes definen cómo se resuelve cada valor antes de
                  ejecutar la skill.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {fn.implementation_type === "api" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={update.isPending}
                    onClick={regenerateSchemaFromEndpoint}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Regenerar desde endpoint
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddParam((v) => !v)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Agregar parámetro
                </Button>
              </div>
            </div>

            {showAddParam && (
              <div className="rounded-lg border border-dashed p-3 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Útil cuando el endpoint no tiene placeholders o para skills fórmula.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Nombre</Label>
                    <Input
                      className="h-8 font-mono text-xs"
                      value={newParamName}
                      onChange={(e) => setNewParamName(e.target.value)}
                      placeholder="well_id"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Tipo</Label>
                    <Select
                      value={newParamType}
                      onValueChange={(v) =>
                        setNewParamType(v as "string" | "number" | "integer" | "boolean")
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="number">number</SelectItem>
                        <SelectItem value="integer">integer</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Descripción</Label>
                    <Input
                      className="h-8"
                      value={newParamDesc}
                      onChange={(e) => setNewParamDesc(e.target.value)}
                      placeholder="ID numérico del pozo"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs sm:col-span-2">
                    <Switch checked={newParamRequired} onCheckedChange={setNewParamRequired} />
                    Requerido
                  </label>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={update.isPending || !newParamName.trim()}
                  onClick={addManualParam}
                >
                  {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar parámetro
                </Button>
              </div>
            )}

            {paramEntries.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-8 text-center space-y-2">
                <p className="text-sm text-muted-foreground">No hay parámetros definidos.</p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  {fn.implementation_type === "api"
                    ? "Si el endpoint usa placeholders {{key}}, regenerá desde el endpoint. Si no, agregá parámetros a mano."
                    : "Agregá parámetros a mano (para fórmulas, serán las variables de la expresión)."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paramEntries.map(([key, prop]) => {
                  const src = sourcesDraft[key]?.source ?? "free";
                  const srcCfg = sourcesDraft[key];
                  return (
                    <div key={key} className="rounded-lg border p-3 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm font-mono">{key}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {prop.type ?? "string"}
                          {prop.format ? ` · ${prop.format}` : ""}
                        </Badge>
                        {isRequiredParam(fn.parameters_schema, key) && (
                          <Badge variant="default" className="text-[10px]">
                            Requerido
                          </Badge>
                        )}
                      </div>
                      {prop.description && (
                        <p className="text-xs text-muted-foreground">{prop.description}</p>
                      )}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-[11px]">Fuente</Label>
                          <Select
                            value={src}
                            onValueChange={(v) =>
                              setSourceType(key, v as ParameterSource["source"])
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">{PARAMETER_SOURCE_LABEL.free}</SelectItem>
                              <SelectItem value="static">
                                {PARAMETER_SOURCE_LABEL.static}
                              </SelectItem>
                              <SelectItem value="data_document">
                                {PARAMETER_SOURCE_LABEL.data_document}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground">
                            {PARAMETER_SOURCE_HINT[src]}
                          </p>
                        </div>
                        {src === "static" && srcCfg?.source === "static" && (
                          <div className="space-y-1">
                            <Label className="text-[11px]">Valor</Label>
                            <Input
                              className="h-8"
                              value={String(srcCfg.value ?? "")}
                              onChange={(e) =>
                                setSourcesDraft((prev) => ({
                                  ...prev,
                                  [key]: { source: "static", value: e.target.value },
                                }))
                              }
                            />
                          </div>
                        )}
                        {src === "data_document" && srcCfg?.source === "data_document" && (
                          <>
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-[11px]">Documento DATA</Label>
                              <Select
                                value={srcCfg.document_title || "__none__"}
                                onValueChange={(v) => {
                                  if (v === "__none__") {
                                    setSourcesDraft((prev) => ({
                                      ...prev,
                                      [key]: {
                                        source: "data_document",
                                        document_title: "",
                                        value_column: "",
                                      },
                                    }));
                                    return;
                                  }
                                  applyDataDocument(key, v);
                                }}
                                disabled={knowledgeLoading}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue
                                    placeholder={
                                      knowledgeLoading
                                        ? "Cargando documentos…"
                                        : "Selecciona un documento"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none__">—</SelectItem>
                                  {srcCfg.document_title &&
                                    !dataDocByTitle.has(srcCfg.document_title) && (
                                      <SelectItem value={srcCfg.document_title}>
                                        {srcCfg.document_title} (guardado)
                                      </SelectItem>
                                    )}
                                  {dataDocuments.map((d) => (
                                    <SelectItem key={d.id} value={d.title}>
                                      {d.title}
                                      {(d.columns?.length ?? 0) > 0
                                        ? ` (${d.columns!.length} cols)`
                                        : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {dataDocuments.length === 0 && !knowledgeLoading && (
                                <p className="text-[10px] text-muted-foreground">
                                  No hay documentos tipo DATA en esta sucursal.{" "}
                                  <Link
                                    to="/conocimiento"
                                    className="text-primary underline-offset-2 hover:underline"
                                  >
                                    Creá uno en Conocimiento
                                  </Link>
                                  .
                                </p>
                              )}
                            </div>
                            {(() => {
                              const cols = dataDocByTitle.get(srcCfg.document_title)?.columns ?? [];
                              const hasCols = cols.length > 0;
                              return (
                                <>
                                  <div className="space-y-1">
                                    <Label className="text-[11px]">Columna valor (ID)</Label>
                                    {hasCols ? (
                                      <Select
                                        value={srcCfg.value_column || "__none__"}
                                        onValueChange={(v) =>
                                          setSourcesDraft((prev) => ({
                                            ...prev,
                                            [key]: {
                                              ...srcCfg,
                                              value_column: v === "__none__" ? "" : v,
                                            },
                                          }))
                                        }
                                      >
                                        <SelectTrigger className="h-8">
                                          <SelectValue placeholder="Columna ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__">—</SelectItem>
                                          {cols.map((c) => (
                                            <SelectItem key={c} value={c}>
                                              {c}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        className="h-8"
                                        value={srcCfg.value_column}
                                        onChange={(e) =>
                                          setSourcesDraft((prev) => ({
                                            ...prev,
                                            [key]: {
                                              ...srcCfg,
                                              value_column: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="id"
                                        disabled={!srcCfg.document_title}
                                      />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[11px]">
                                      Columna de búsqueda (nombre)
                                    </Label>
                                    {hasCols ? (
                                      <Select
                                        value={srcCfg.user_input_column || "__none__"}
                                        onValueChange={(v) =>
                                          setSourcesDraft((prev) => ({
                                            ...prev,
                                            [key]: {
                                              ...srcCfg,
                                              user_input_column: v === "__none__" ? undefined : v,
                                            },
                                          }))
                                        }
                                      >
                                        <SelectTrigger className="h-8">
                                          <SelectValue placeholder="Columna nombre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="__none__">—</SelectItem>
                                          {cols.map((c) => (
                                            <SelectItem key={c} value={c}>
                                              {c}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        className="h-8"
                                        value={srcCfg.user_input_column ?? ""}
                                        onChange={(e) =>
                                          setSourcesDraft((prev) => ({
                                            ...prev,
                                            [key]: {
                                              ...srcCfg,
                                              user_input_column: e.target.value || undefined,
                                            },
                                          }))
                                        }
                                        placeholder="nombre"
                                        disabled={!srcCfg.document_title}
                                      />
                                    )}
                                  </div>
                                  {hasCols && (
                                    <p className="text-[10px] text-muted-foreground sm:col-span-2">
                                      Columnas detectadas:{" "}
                                      <code className="text-[10px]">{cols.join(", ")}</code>
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Button onClick={saveSources} disabled={update.isPending}>
                  {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar fuentes
                </Button>
              </div>
            )}
          </section>

          {fn.parameters_schema && (
            <details className="rounded-xl border bg-card/40 px-4 py-3 text-xs">
              <summary className="cursor-pointer text-muted-foreground">
                Ver parameters_schema raw
              </summary>
              <pre className="mt-2 max-h-56 overflow-auto font-mono text-[11px] whitespace-pre-wrap">
                {prettyJson(fn.parameters_schema)}
              </pre>
            </details>
          )}
        </TabsContent>

        <TabsContent value="probar" className="mt-0">
          <SkillTestPanel skill={fn} />
        </TabsContent>

        <TabsContent value="historial" className="mt-0">
          <SkillExecutionHistory skillId={String(fn.id)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
