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
  RotateCcw,
} from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  useAgentFunction,
  useUpdateAgentFunction,
  useDeleteAgentFunction,
  useRestoreAgentFunction,
  type ImplementationType,
  type JsonSchema,
} from "@/api/hooks/useAgentFunctions";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { SkillTestPanel } from "@/components/skills/skill-test-panel";
import { SkillExecutionHistory } from "@/components/skills/skill-execution-history";
import { SkillStatsPanel } from "@/components/skills/skill-stats-panel";
import {
  DATE_WIRE_FORMATS,
  formatSchemaType,
  getDateWireFormat,
  IMPLEMENTATION_TYPE_LABEL,
  isRequiredParam,
  kindFromProperty,
  normalizeSkillScope,
  propertyFromKind,
  SCHEMA_KIND_HINT,
  SCHEMA_KIND_LABEL,
  type DateWireFormat,
  type SchemaParamKind,
  parseJsonObject,
  prettyJson,
  schemaPropertyEntries,
  SKILL_CREATE_TYPES,
  SKILL_SCOPE_LABEL,
} from "@/lib/skills";
import { toast } from "sonner";
import { FormulaExpressionEditor } from "@/components/skills/formula-expression-editor";
import { canEditOwnedSkill, canHardDeleteSkills } from "@/lib/authGuards";

const CREDENTIAL_PARAM_KEYS = new Set([
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

type SkillTab = "configuracion" | "parametros" | "probar" | "historial";

export default function FunctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const canHardDelete = canHardDeleteSkills();
  const { data: fn, isLoading, error, refetch } = useAgentFunction(id);
  const canManage = Boolean(fn && canEditOwnedSkill(fn));
  const update = useUpdateAgentFunction();
  const remove = useDeleteAgentFunction();
  const restore = useRestoreAgentFunction();
  const [confirmName, setConfirmName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: apps = [] } = useExternalAPIs({ includeInactive: false });

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
  const [paramFormOpen, setParamFormOpen] = useState(false);
  const [editingParamKey, setEditingParamKey] = useState<string | null>(null);
  const [paramName, setParamName] = useState("");
  const [paramKind, setParamKind] = useState<SchemaParamKind>("string");
  const [paramDateFormat, setParamDateFormat] = useState<DateWireFormat>("YYYY-MM-DD");
  const [paramDesc, setParamDesc] = useState("");
  const [paramRequired, setParamRequired] = useState(true);

  const resetParamForm = () => {
    setEditingParamKey(null);
    setParamName("");
    setParamKind("string");
    setParamDateFormat("YYYY-MM-DD");
    setParamDesc("");
    setParamRequired(true);
  };

  const openAddParam = () => {
    resetParamForm();
    setParamFormOpen(true);
  };

  const openEditParam = (
    key: string,
    prop: { type?: string; format?: string; description?: string; [k: string]: unknown },
  ) => {
    const kind = kindFromProperty(prop);
    setEditingParamKey(key);
    setParamName(key);
    setParamKind(kind);
    setParamDateFormat(getDateWireFormat(prop));
    setParamDesc(typeof prop.description === "string" ? prop.description : "");
    setParamRequired(isRequiredParam(fn?.parameters_schema, key));
    setParamFormOpen(true);
  };

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
  const formulaVarNames = useMemo(
    () => paramEntries.map(([key]) => key).filter(Boolean),
    [paramEntries],
  );

  if (isLoading) {
    return <PageSkeleton variant="studio" />;
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

  const saveParam = () => {
    if (!id || !fn) return;
    const key = paramName.trim().replace(/\s+/g, "_");
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      toast.error("Nombre inválido. Usá letras, números y _ (sin empezar con número).");
      return;
    }
    if (fn.uses_personal_connection && CREDENTIAL_PARAM_KEYS.has(key.toLowerCase())) {
      toast.error(
        "Esta skill usa la cuenta de la instalación. No agregues usuario/clave como parámetros; configurá la cuenta en Instalación de la Aplicación.",
      );
      return;
    }
    const current = (fn.parameters_schema ?? {
      type: "object",
      properties: {},
    }) as JsonSchema;
    const properties = { ...(current.properties ?? {}) };
    if (!editingParamKey && properties[key]) {
      toast.error(`Ya existe el parámetro «${key}»`);
      return;
    }
    if (editingParamKey && editingParamKey !== key && properties[key]) {
      toast.error(`Ya existe el parámetro «${key}»`);
      return;
    }
    if (editingParamKey && editingParamKey !== key) {
      delete properties[editingParamKey];
    }
    properties[key] = propertyFromKind({
      kind: paramKind,
      description: paramDesc,
      dateFormat: paramDateFormat,
    });
    let required = Array.isArray(current.required) ? [...current.required] : [];
    if (editingParamKey && editingParamKey !== key) {
      required = required.map((r) => (r === editingParamKey ? key : r));
    }
    if (paramRequired) {
      if (!required.includes(key)) required.push(key);
    } else {
      required = required.filter((r) => r !== key);
    }
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
          toast.success(
            editingParamKey ? `Parámetro «${key}» actualizado` : `Parámetro «${key}» agregado`,
          );
          resetParamForm();
          setParamFormOpen(false);
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo guardar",
          ),
      },
    );
  };

  const deleteParam = (key: string) => {
    if (!id || !fn) return;
    const current = (fn.parameters_schema ?? {
      type: "object",
      properties: {},
    }) as JsonSchema;
    const properties = { ...(current.properties ?? {}) };
    delete properties[key];
    const required = (Array.isArray(current.required) ? current.required : []).filter(
      (r) => r !== key,
    );
    update.mutate(
      {
        id,
        data: {
          parameters_schema: {
            ...current,
            type: "object",
            properties,
            required,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(`Parámetro «${key}» eliminado`);
          if (editingParamKey === key) {
            resetParamForm();
            setParamFormOpen(false);
          }
          void refetch();
        },
        onError: (err) =>
          toast.error(
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo eliminar",
          ),
      },
    );
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
              <Badge variant="outline" className="text-[10px] font-normal">
                {SKILL_SCOPE_LABEL[normalizeSkillScope(fn.scope)] || "—"}
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
          {canManage && tab === "configuracion" && (
            <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="h-4 w-4 mr-1.5" />
              {editing ? "Cancelar" : "Editar"}
            </Button>
          )}
          {canManage && fn.is_active === false && (
            <Button
              variant="outline"
              size="sm"
              disabled={restore.isPending}
              onClick={() => {
                if (!id) return;
                restore.mutate(id, {
                  onSuccess: (r) => {
                    toast.success(r.message || "Skill reactivada");
                    void refetch();
                  },
                  onError: (err) =>
                    toast.error(
                      (err as { friendlyMessage?: string })?.friendlyMessage ||
                        "No se pudo reactivar",
                    ),
                });
              }}
            >
              {restore.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-1.5" />
              )}
              Reactivar
            </Button>
          )}
          {canManage && (fn.is_active !== false || canHardDelete) && (
            <AlertDialog
              open={deleteOpen}
              onOpenChange={(open) => {
                setDeleteOpen(open);
                if (!open) setConfirmName("");
              }}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={remove.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {fn.is_active === false ? "Borrar definitivo" : "Desactivar"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {fn.is_active === false ? "Borrar skill definitivamente" : "Desactivar skill"}
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {fn.is_active === false ? (
                        <>
                          <p>
                            «{fn.name}» ya está desactivada. Esto la borra de forma permanente y no
                            se puede deshacer. Los agentes perderán la asignación.
                          </p>
                          <p>
                            Escribí el nombre exacto de la skill para confirmar:{" "}
                            <span className="font-medium text-foreground">{fn.name}</span>
                          </p>
                          <Input
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder={fn.name}
                            autoComplete="off"
                            className="mt-1"
                          />
                        </>
                      ) : (
                        <p>
                          «{fn.name}» se desactivará y dejará de estar disponible para los agentes.
                          Podés reactivarla después
                          {canHardDelete
                            ? ". Solo se borra del todo si confirmás una segunda vez."
                            : "."}
                        </p>
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={
                      remove.isPending ||
                      (fn.is_active === false && confirmName.trim() !== fn.name.trim())
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (!id) return;
                      const permanent = fn.is_active === false;
                      if (permanent && !canHardDelete) {
                        toast.error("Solo un super administrador puede borrar definitivamente");
                        return;
                      }
                      remove.mutate(
                        { id, permanent },
                        {
                          onSuccess: (r) => {
                            if (r.action === "deleted") {
                              toast.success(r.message || "Skill eliminada definitivamente");
                              setDeleteOpen(false);
                              navigate("/skills");
                              return;
                            }
                            toast.success(r.message || "Skill desactivada");
                            setDeleteOpen(false);
                            void refetch();
                          },
                          onError: (err) =>
                            toast.error(
                              (err as { friendlyMessage?: string })?.friendlyMessage ||
                                "No se pudo completar la acción",
                            ),
                        },
                      );
                    }}
                  >
                    {fn.is_active === false ? "Borrar definitivamente" : "Desactivar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </header>

      {!canManage && (
        <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
          Skill de plataforma / de otro autor:{" "}
          <span className="font-medium text-foreground">solo lectura</span>. Podés usarla en
          agentes; para cambios pedile al superadministrador o creá una skill propia.
        </div>
      )}

      {fn.is_active === false && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
          <p>
            Esta skill está <span className="font-medium text-foreground">desactivada</span>. Los
            agentes no la usan.
            {canManage
              ? canHardDelete
                ? " Podés reactivarla o borrarla definitivamente."
                : " Podés reactivarla si fue un error."
              : ""}
          </p>
          {canManage && (
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={restore.isPending}
                onClick={() => {
                  if (!id) return;
                  restore.mutate(id, {
                    onSuccess: (r) => {
                      toast.success(r.message || "Skill reactivada");
                      void refetch();
                    },
                    onError: (err) =>
                      toast.error(
                        (err as { friendlyMessage?: string })?.friendlyMessage ||
                          "No se pudo reactivar",
                      ),
                  });
                }}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reactivar
              </Button>
            </div>
          )}
        </div>
      )}

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
                  No agregues usuario ni clave como parámetros. Configurá la cuenta de la
                  instalación en{" "}
                  {fn.external_api ? (
                    <Link
                      to={`/aplicaciones/${fn.external_api}?tab=instalacion`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Instalación
                    </Link>
                  ) : (
                    "Aplicaciones → Instalación"
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
                <div className="space-y-2">
                  <Label>Descripción (LLM)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
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
                      {SKILL_CREATE_TYPES.map((t) => (
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
                  <FormulaExpressionEditor
                    className="md:col-span-2"
                    value={expression}
                    onChange={setExpression}
                    variables={formulaVarNames}
                    label="Expresión (fórmula)"
                    emptyVariablesHint="Agregá variables en la pestaña Parámetros para usarlas acá."
                  />
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
                  <div className="md:col-span-2 space-y-1.5">
                    <span className="text-muted-foreground text-xs">Expresión</span>
                    <p className="font-medium font-mono text-xs break-all">
                      {fn.config.expression}
                    </p>
                    {formulaVarNames.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Variables:</span>
                        {formulaVarNames.map((name) => (
                          <Badge key={name} variant="outline" className="text-[10px] font-mono">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    )}
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
                <h2 className="text-sm font-medium">
                  {fn.implementation_type === "formula" ? "Variables" : "Parámetros"} (
                  {paramEntries.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fn.implementation_type === "formula"
                    ? "Estos nombres son los que podés usar en la expresión. Las fuentes (estático / documento DATA) se configuran al asignar desde el agente."
                    : "Schema que ve el LLM. Las fuentes (estático / documento DATA) se configuran al asignar la skill desde el agente."}
                </p>
              </div>
              {canManage && (
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
                    onClick={() => {
                      if (paramFormOpen && !editingParamKey) {
                        setParamFormOpen(false);
                        resetParamForm();
                      } else {
                        openAddParam();
                      }
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Agregar parámetro
                  </Button>
                </div>
              )}
            </div>

            {canManage && paramFormOpen && (
              <div className="rounded-lg border border-dashed p-3 space-y-3">
                <p className="text-xs font-medium">
                  {editingParamKey ? `Editar «${editingParamKey}»` : "Nuevo parámetro"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fecha se guarda como texto con el formato que elijas (útil para apps como
                  Dentidesk).
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Nombre</Label>
                    <Input
                      className="h-8 font-mono text-xs"
                      value={paramName}
                      onChange={(e) => setParamName(e.target.value)}
                      placeholder="fecha_cita"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Tipo</Label>
                    <Select
                      value={paramKind}
                      onValueChange={(v) => setParamKind(v as SchemaParamKind)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            "string",
                            "number",
                            "integer",
                            "boolean",
                            "date",
                            "datetime",
                            "email",
                          ] as SchemaParamKind[]
                        ).map((k) => (
                          <SelectItem key={k} value={k}>
                            {SCHEMA_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">
                      {SCHEMA_KIND_HINT[paramKind]}
                    </p>
                  </div>
                  {paramKind === "date" && (
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-[11px]">Formato de envío</Label>
                      <Select
                        value={paramDateFormat}
                        onValueChange={(v) => setParamDateFormat(v as DateWireFormat)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DATE_WIRE_FORMATS.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label} · ej. {f.example}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">
                        Se envía como string con este formato (no como objeto fecha).
                      </p>
                    </div>
                  )}
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Descripción</Label>
                    <Input
                      className="h-8"
                      value={paramDesc}
                      onChange={(e) => setParamDesc(e.target.value)}
                      placeholder={
                        paramKind === "date"
                          ? `Fecha en formato ${paramDateFormat}`
                          : "Cómo debe interpretar el LLM este valor"
                      }
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs sm:col-span-2">
                    <Switch checked={paramRequired} onCheckedChange={setParamRequired} />
                    Requerido
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={update.isPending || !paramName.trim()}
                    onClick={saveParam}
                  >
                    {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingParamKey ? "Guardar cambios" : "Guardar parámetro"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      resetParamForm();
                      setParamFormOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
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
              <div className="space-y-2">
                {paramEntries.map(([key, prop]) => {
                  const kind = kindFromProperty(prop);
                  return (
                    <div key={key} className="rounded-lg border p-3 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm font-mono flex-1 min-w-0 truncate">
                          {key}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {formatSchemaType(prop.type, prop.format, prop)}
                        </Badge>
                        {isRequiredParam(fn.parameters_schema, key) && (
                          <Badge variant="default" className="text-[10px]">
                            Requerido
                          </Badge>
                        )}
                        {canManage && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => openEditParam(key, prop)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-destructive"
                              disabled={update.isPending}
                              onClick={() => deleteParam(key)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {SCHEMA_KIND_HINT[kind]}
                        {kind === "date" ? ` · envío ${getDateWireFormat(prop)}` : ""}
                      </p>
                      {prop.description && (
                        <p className="text-xs text-muted-foreground">{prop.description}</p>
                      )}
                    </div>
                  );
                })}
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

        <TabsContent value="historial" className="mt-0 space-y-4">
          <SkillStatsPanel skillId={String(fn.id)} />
          <SkillExecutionHistory skillId={String(fn.id)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
