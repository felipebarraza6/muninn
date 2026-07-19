import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Code2,
  FlaskConical,
  Loader2,
  Plug,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAgentFunction, type SkillScope } from "@/api/hooks/useAgentFunctions";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useAgents } from "@/api/hooks/useAgents";
import { useMyBranchesSelect } from "@/api/hooks/useBranches";
import { getActiveBranchId, setActiveBranchId } from "@/lib/branchStorage";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { FormulaWorkbench } from "@/components/skills/formula-workbench";
import { PythonWorkbench } from "@/components/skills/python-workbench";
import {
  buildFormulaSchemaFromParams,
  extractPlaceholders,
  getDuplicateFormulaVarIndexes,
  IMPLEMENTATION_TYPE_HINT,
  normalizeFormulaVarName,
  SKILL_SCOPE_HINT,
  SKILL_SCOPE_LABEL,
  slugify,
  type FormulaParamDraft,
} from "@/lib/skills";

type CreateMode = "api" | "formula" | "python";
type MathTab = "configuracion" | "trabajar";

const FORMULA_DRAFT_KEY = "muninn:skill-draft:formula";

type FormulaDraft = {
  branchId: string;
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  responseInstructions: string;
  expression: string;
  formulaParams: FormulaParamDraft[];
  testValues: Record<string, string>;
  formulaTab: MathTab;
  skillScope?: SkillScope;
  agentId?: string;
  appId?: string;
};

const DEFAULT_PARAMS: FormulaParamDraft[] = [
  { name: "a", type: "number", description: "", required: true },
  { name: "b", type: "number", description: "", required: true },
];

function loadFormulaDraft(): Partial<FormulaDraft> | null {
  try {
    const raw = localStorage.getItem(FORMULA_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FormulaDraft>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function saveFormulaDraft(draft: FormulaDraft) {
  try {
    localStorage.setItem(FORMULA_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

function clearFormulaDraft() {
  try {
    localStorage.removeItem(FORMULA_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export default function FuncionesNuevoPage() {
  const navigate = useNavigate();
  const { data: apps = [] } = useExternalAPIs({ includeInactive: false });
  const { data: branchOptions = [] } = useMyBranchesSelect();
  const { data: agents = [] } = useAgents({ is_active: true });
  const create = useCreateAgentFunction();
  const draft = useMemo(() => loadFormulaDraft(), []);
  const hasDraft = Boolean(
    draft &&
    (draft.name ||
      draft.expression ||
      (Array.isArray(draft.formulaParams) && draft.formulaParams.length > 0)),
  );

  const [mode, setMode] = useState<CreateMode>(() => (hasDraft ? "formula" : "api"));
  const [mathTab, setMathTab] = useState<MathTab>(() => {
    const loaded = draft?.formulaTab;
    if ((loaded as string) === "parametros" || (loaded as string) === "trabajar") return "trabajar";
    return "configuracion";
  });
  const [skillScope, setSkillScope] = useState<SkillScope>(() => draft?.skillScope || "branch");
  const [agentId, setAgentId] = useState(() => draft?.agentId || "");
  const [branchId, setBranchId] = useState(() => draft?.branchId || getActiveBranchId() || "");
  const [name, setName] = useState(() => draft?.name || "");
  const [slug, setSlug] = useState(() => draft?.slug || "");
  const [slugTouched, setSlugTouched] = useState(() => Boolean(draft?.slugTouched));
  const [description, setDescription] = useState(() => draft?.description || "");
  const [responseInstructions, setResponseInstructions] = useState(
    () => draft?.responseInstructions || "",
  );
  const [appId, setAppId] = useState(() => draft?.appId || "");
  const [endpointType, setEndpointType] = useState("");
  const [expression, setExpression] = useState(() => draft?.expression || "");
  const [pythonCode, setPythonCode] = useState("");
  const [formulaParams, setFormulaParams] = useState<FormulaParamDraft[]>(() =>
    Array.isArray(draft?.formulaParams) && draft!.formulaParams!.length
      ? draft!.formulaParams!
      : DEFAULT_PARAMS,
  );
  const [testValues, setTestValues] = useState<Record<string, string>>(
    () => draft?.testValues || {},
  );

  const duplicateVarIndexes = useMemo(
    () => getDuplicateFormulaVarIndexes(formulaParams),
    [formulaParams],
  );

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
    const active = getActiveBranchId() ?? "";
    if (active && branchOptions.some((b) => String(b.value) === String(active))) {
      setBranchId((prev) => prev || String(active));
    } else if (branchOptions.length === 1) {
      setBranchId(String(branchOptions[0].value));
    } else if (!branchId && branchOptions[0]) {
      setBranchId(String(branchOptions[0].value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchOptions]);

  useEffect(() => {
    if (mode !== "formula") return;
    saveFormulaDraft({
      branchId,
      name,
      slug,
      slugTouched,
      description,
      responseInstructions,
      expression,
      formulaParams,
      testValues,
      formulaTab: mathTab,
      skillScope,
      agentId,
      appId,
    });
  }, [
    mode,
    branchId,
    name,
    slug,
    slugTouched,
    description,
    responseInstructions,
    expression,
    formulaParams,
    testValues,
    mathTab,
    skillScope,
    agentId,
    appId,
  ]);

  const resolveBranchPayload = (): string | number | undefined => {
    const id = branchId.trim();
    if (!id) return undefined;
    const asNum = Number(id);
    return Number.isFinite(asNum) && String(asNum) === id ? asNum : id;
  };

  const validateConfigBase = (): boolean => {
    const finalSlug = slug.trim() || slugify(name);
    if (!name.trim() || !finalSlug) {
      toast.error("Nombre y slug son obligatorios");
      return false;
    }
    if (!description.trim()) {
      toast.error("La descripción es obligatoria");
      return false;
    }
    if (!branchId.trim()) {
      toast.error("Selecciona una sucursal");
      return false;
    }
    if (skillScope === "agent" && !agentId) {
      toast.error("Seleccioná el agente para el ámbito Agente");
      return false;
    }
    return true;
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateConfigBase()) return;

    const finalSlug = slug.trim() || slugify(name);
    setActiveBranchId(branchId.trim(), true, false);

    const branch = resolveBranchPayload();
    const base = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      response_instructions: responseInstructions.trim() || undefined,
      is_active: true,
      branch,
      scope: skillScope,
      ...(skillScope === "agent" && agentId ? { agent_id: agentId } : {}),
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
            toast.success("Skill API creada");
            if (created?.id) navigate(`/skills/${created.id}`);
            else navigate("/skills");
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
      if (duplicateVarIndexes.size > 0) {
        toast.error("Hay variables con nombres duplicados");
        setMathTab("trabajar");
        return;
      }
      const names = formulaParams.map((p) => normalizeFormulaVarName(p.name)).filter(Boolean);
      if (!names.length) {
        toast.error("Definí al menos una variable en el workspace");
        setMathTab("trabajar");
        return;
      }
      if (!expression.trim()) {
        toast.error("Escribí la expresión matemática");
        setMathTab("trabajar");
        return;
      }
      create.mutate(
        {
          ...base,
          implementation_type: "formula",
          external_api: appId || null,
          config: { expression: expression.trim() },
          parameters_schema: buildFormulaSchemaFromParams(formulaParams),
        },
        {
          onSuccess: (created) => {
            clearFormulaDraft();
            toast.success("Skill Matemática creada");
            if (created?.id) navigate(`/skills/${created.id}`);
            else navigate("/skills");
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

    // python
    if (!pythonCode.trim()) {
      toast.error("Escribí el código Python");
      return;
    }
    if (duplicateVarIndexes.size > 0) {
      toast.error("Hay variables con nombres duplicados");
      return;
    }
    create.mutate(
      {
        ...base,
        implementation_type: "python_code",
        external_api: appId || null,
        config: { code: pythonCode.trim(), entry: "main" },
        parameters_schema: buildFormulaSchemaFromParams(formulaParams),
      },
      {
        onSuccess: (created) => {
          toast.success("Skill Python creada");
          if (created?.id) navigate(`/skills/${created.id}`);
          else navigate("/skills");
        },
        onError: (err) => {
          toast.error((err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo crear");
        },
      },
    );
  };

  const scopeAndMetaFields = (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/80">ÁMBITO</Label>
        <Select value={skillScope} onValueChange={(v) => setSkillScope(v as SkillScope)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">{SKILL_SCOPE_LABEL.global}</SelectItem>
            <SelectItem value="branch">{SKILL_SCOPE_LABEL.branch}</SelectItem>
            <SelectItem value="agent">{SKILL_SCOPE_LABEL.agent}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground">{SKILL_SCOPE_HINT[skillScope]}</p>
      </div>
      {skillScope === "agent" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground/80">AGENTE</Label>
          <Select
            value={agentId || "__none__"}
            onValueChange={(v) => setAgentId(v === "__none__" ? "" : v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecciona agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">—</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/80">SUCURSAL</Label>
        <Select
          value={branchId || "__none__"}
          onValueChange={(v) => setBranchId(v === "__none__" ? "" : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Selecciona" />
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
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/80">NOMBRE</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={
            mode === "formula"
              ? "Calcular volumen extraído"
              : mode === "python"
                ? "Normalizar medición"
                : "Horas disponibles"
          }
          className="h-9"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground/80">SLUG</Label>
        <Input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
          className="font-mono text-sm h-9"
          placeholder="mi-skill"
        />
      </div>
    </>
  );

  const appField = (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground/80">
        APLICACIÓN {mode === "api" ? "" : "(OPCIONAL)"}
      </Label>
      <Select
        value={appId || "__none__"}
        onValueChange={(v) => {
          setAppId(v === "__none__" ? "" : v);
          setEndpointType("");
        }}
      >
        <SelectTrigger className="h-9">
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
      {mode !== "api" && (
        <p className="text-[10px] text-muted-foreground">
          Asociá esta función auxiliar a una app si aplica.
        </p>
      )}
    </div>
  );

  return (
    <AdminPageMotion>
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/80 to-card px-5 py-5 md:px-6 shadow-sm">
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md hover:bg-primary/10"
                asChild
              >
                <Link to="/skills">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                Creación
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Nueva skill</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              {mode === "formula"
                ? "Diseñá una función matemática: variables → expresión → resultado."
                : mode === "python"
                  ? "Escribí código Python a medida y probalo antes de crear."
                  : "Conectá un endpoint de una Aplicación instalada."}
            </p>
          </div>
        </div>

        <form
          className="rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-5"
          onSubmit={submitCreate}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-muted/20 rounded-xl p-4 border border-border/40">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground/80">TIPO</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as CreateMode)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">
                    <span className="inline-flex items-center gap-1.5">
                      <Plug className="h-3.5 w-3.5" /> API
                    </span>
                  </SelectItem>
                  <SelectItem value="formula">
                    <span className="inline-flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5" /> Matemática
                    </span>
                  </SelectItem>
                  <SelectItem value="python">
                    <span className="inline-flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5" /> Python
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {mode === "api"
                  ? IMPLEMENTATION_TYPE_HINT.api
                  : mode === "formula"
                    ? IMPLEMENTATION_TYPE_HINT.formula
                    : IMPLEMENTATION_TYPE_HINT.python_code}
              </p>
            </div>
            {scopeAndMetaFields}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 bg-muted/10 rounded-xl p-4 border border-border/30">
              <Label className="text-xs font-semibold text-muted-foreground/80">
                DESCRIPCIÓN (PARA EL AGENTE)
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Cuándo debe el agente invocar esta skill…"
                className="resize-none min-h-[80px] text-sm"
              />
            </div>
            <div className="space-y-1.5 bg-muted/10 rounded-xl p-4 border border-border/30">
              <Label className="text-xs font-semibold text-muted-foreground/80">
                INSTRUCCIONES DE RESPUESTA (OPCIONAL)
              </Label>
              <Textarea
                value={responseInstructions}
                onChange={(e) => setResponseInstructions(e.target.value)}
                rows={3}
                placeholder="Cómo presentar el resultado al usuario…"
                className="resize-none min-h-[80px] text-sm"
              />
            </div>
          </div>

          {mode === "api" && (
            <div className="grid gap-4 md:grid-cols-2 border-t border-border/40 pt-5">
              {appField}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground/80">ENDPOINT</Label>
                <Select
                  value={endpointType || "__none__"}
                  onValueChange={(v) => setEndpointType(v === "__none__" ? "" : v)}
                  disabled={!appId}
                >
                  <SelectTrigger className="h-9">
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
                  <p className="text-[11px] font-mono text-muted-foreground break-all bg-muted/30 p-2 rounded border">
                    {(selectedEndpoint.method || "GET").toUpperCase()} {selectedEndpoint.path}
                  </p>
                )}
                {inferredParams.length > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    Params: <code className="text-[10px]">{inferredParams.join(", ")}</code>
                  </p>
                )}
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
            </div>
          )}

          {mode === "formula" && (
            <Tabs
              value={mathTab}
              onValueChange={(v) => setMathTab(v as MathTab)}
              className="space-y-4 border-t border-border/40 pt-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsList className="bg-muted/40 border border-border/60 p-1 h-10 rounded-xl">
                  <TabsTrigger
                    value="configuracion"
                    className="gap-1.5 px-3 text-xs font-semibold rounded-lg"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    1. Asociación
                  </TabsTrigger>
                  <TabsTrigger
                    value="trabajar"
                    className="gap-1.5 px-3 text-xs font-semibold rounded-lg"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    2. Workspace Matemática
                  </TabsTrigger>
                </TabsList>
                {mathTab === "configuracion" && (
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setMathTab("trabajar")}
                  >
                    Ir al workspace
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <TabsContent value="configuracion" className="mt-0 space-y-3">
                {appField}
                <p className="text-xs text-muted-foreground">
                  En el workspace definís variables, armás la expresión y probás la función antes de
                  crear.
                </p>
              </TabsContent>
              <TabsContent value="trabajar" className="mt-0">
                <FormulaWorkbench
                  expression={expression}
                  onExpressionChange={setExpression}
                  params={formulaParams}
                  onParamsChange={setFormulaParams}
                  testValues={testValues}
                  onTestValuesChange={setTestValues}
                  draftKey={slug || "new"}
                />
              </TabsContent>
            </Tabs>
          )}

          {mode === "python" && (
            <div className="border-t border-border/40 pt-5 space-y-4">
              {appField}
              <PythonWorkbench
                code={pythonCode}
                onCodeChange={setPythonCode}
                params={formulaParams}
                onParamsChange={setFormulaParams}
                testValues={testValues}
                onTestValuesChange={setTestValues}
              />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2 border-t border-border/50 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/skills")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending} className="font-semibold px-5">
              {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear skill
            </Button>
          </div>
        </form>
      </div>
    </AdminPageMotion>
  );
}
