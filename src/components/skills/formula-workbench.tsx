import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  History,
  Loader2,
  Play,
  Plus,
  Redo2,
  Save,
  Settings,
  Terminal,
  Trash2,
  Undo2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreviewFormula, type ExecuteResult } from "@/api/hooks/useAgentFunctions";
import { FormulaExpressionEditor } from "@/components/skills/formula-expression-editor";
import {
  buildFormulaSchemaFromParams,
  coerceParamsFromForm,
  formulaVarNamesFromParams,
  getDuplicateFormulaVarIndexes,
  JSON_SCHEMA_TYPE_HINT,
  JSON_SCHEMA_TYPE_LABEL,
  normalizeFormulaVarName,
  prettyJson,
  substituteFormulaExpression,
  type FormulaParamDraft,
} from "@/lib/skills";
import {
  loadMathVersions,
  pushMathVersion,
  type MathVersionSnapshot,
} from "@/lib/skill-math-versions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormulaWorkbenchProps = {
  expression: string;
  onExpressionChange: (next: string) => void;
  params: FormulaParamDraft[];
  onParamsChange: (next: FormulaParamDraft[]) => void;
  testValues: Record<string, string>;
  onTestValuesChange: (next: Record<string, string>) => void;
  /** Clave de borrador para persistir biblioteca de versiones */
  draftKey?: string;
};

const MAX_UNDO = 50;

export function FormulaWorkbench({
  expression,
  onExpressionChange,
  params,
  onParamsChange,
  testValues,
  onTestValuesChange,
  draftKey = "new",
}: FormulaWorkbenchProps) {
  const preview = usePreviewFormula();
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const [lastParams, setLastParams] = useState<Record<string, unknown> | null>(null);
  const [versions, setVersions] = useState<MathVersionSnapshot[]>(() => loadMathVersions(draftKey));
  const [versionNote, setVersionNote] = useState("");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const varNames = useMemo(() => formulaVarNamesFromParams(params), [params]);
  const schema = useMemo(() => buildFormulaSchemaFromParams(params), [params]);
  const duplicateIndexes = useMemo(() => getDuplicateFormulaVarIndexes(params), [params]);
  const requiredKeys = schema.required ?? [];

  useEffect(() => {
    setVersions(loadMathVersions(draftKey));
  }, [draftKey]);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const name of varNames) {
      next[name] = testValues[name] ?? "";
    }
    const same =
      Object.keys(next).length === Object.keys(testValues).length &&
      Object.keys(next).every((k) => k in testValues);
    if (!same) onTestValuesChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varNames.join("|")]);

  const processedExpression = useMemo(() => {
    if (!expression.trim() || !lastParams) return null;
    return substituteFormulaExpression(expression, lastParams);
  }, [expression, lastParams]);

  const setExpressionWithHistory = useCallback(
    (next: string) => {
      if (next === expression) return;
      setUndoStack((s) => [...s.slice(-(MAX_UNDO - 1)), expression]);
      setRedoStack([]);
      onExpressionChange(next);
    },
    [expression, onExpressionChange],
  );

  const undo = () => {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, expression]);
    onExpressionChange(prev);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, expression]);
    onExpressionChange(next);
  };

  const run = () => {
    if (duplicateIndexes.size > 0) {
      toast.error("Hay variables con nombres duplicados");
      return;
    }
    if (varNames.length === 0) {
      toast.error("Definí al menos una variable");
      return;
    }
    if (!expression.trim()) {
      toast.error("Escribe la expresión matemática");
      return;
    }
    const missing = requiredKeys.filter((k) => !testValues[k]?.trim());
    if (missing.length) {
      toast.error(`Completa el valor de prueba para: ${missing.join(", ")}`);
      return;
    }
    const parameters = coerceParamsFromForm(testValues, schema);
    setLastParams(parameters);
    preview.mutate(
      {
        expression: expression.trim(),
        parameters,
        parameters_schema: schema,
      },
      {
        onSuccess: (r) => {
          setResult(r);
          if (r.success) toast.success("Función evaluada");
          else toast.error(r.error || "La evaluación falló");
        },
        onError: (err) => {
          const msg =
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo evaluar";
          toast.error(msg);
          setResult({ success: false, error: msg });
        },
      },
    );
  };

  const saveVersion = () => {
    const list = pushMathVersion(draftKey, {
      note: versionNote.trim() || `Análisis ${new Date().toLocaleString()}`,
      expression,
      formulaParams: params,
      testValues,
      lastResult: result?.success ? result.result : result?.error,
    });
    setVersions(list);
    setVersionNote("");
    toast.success("Versión guardada en la biblioteca");
  };

  const restoreVersion = (v: MathVersionSnapshot) => {
    setUndoStack((s) => [...s, expression]);
    setRedoStack([]);
    onExpressionChange(v.expression);
    onParamsChange(v.formulaParams);
    onTestValuesChange(v.testValues);
    toast.success("Versión restaurada");
  };

  const addVariable = () => {
    onParamsChange([
      ...params,
      { name: `var_${params.length + 1}`, type: "number", description: "", required: true },
    ]);
  };

  const removeVariable = (idx: number) => {
    if (params.length <= 1) return;
    onParamsChange(params.filter((_, i) => i !== idx));
  };

  const updateVariable = (idx: number, updates: Partial<FormulaParamDraft>) => {
    onParamsChange(params.map((p, i) => (i === idx ? { ...p, ...updates } : p)));
  };

  return (
    <div className="grid gap-8 xl:grid-cols-12 items-start py-1">
      {/* Variables */}
      <div className="xl:col-span-4 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-primary" />
                Variables (entradas)
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Parámetros de la función matemática y valores de prueba.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={addVariable}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Nueva
            </Button>
          </div>

          <div className="divide-y divide-border/50 max-h-[420px] overflow-y-auto pr-1">
            {params.map((p, idx) => {
              const normalizedName = normalizeFormulaVarName(p.name);
              const isDuplicate = duplicateIndexes.has(idx);
              const isValidName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(normalizedName);
              return (
                <div
                  key={idx}
                  className={cn(
                    "py-3 first:pt-0 space-y-2.5 transition-colors",
                    isDuplicate && "bg-destructive/5 -mx-1 px-1 rounded-md",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      value={p.name}
                      onChange={(e) => updateVariable(idx, { name: e.target.value })}
                      placeholder="nombre"
                      className={cn(
                        "h-8 font-mono text-xs font-semibold flex-1 min-w-[100px]",
                        isDuplicate && "border-destructive",
                      )}
                    />
                    <Select
                      value={p.type}
                      onValueChange={(v) =>
                        updateVariable(idx, { type: v as FormulaParamDraft["type"] })
                      }
                    >
                      <SelectTrigger className="h-8 w-[6.5rem] text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">{JSON_SCHEMA_TYPE_LABEL.number}</SelectItem>
                        <SelectItem value="integer">{JSON_SCHEMA_TYPE_LABEL.integer}</SelectItem>
                        <SelectItem value="string">{JSON_SCHEMA_TYPE_LABEL.string}</SelectItem>
                      </SelectContent>
                    </Select>
                    <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Checkbox
                        checked={p.required}
                        onCheckedChange={(c) => updateVariable(idx, { required: !!c })}
                        className="h-3.5 w-3.5"
                      />
                      Req.
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      disabled={params.length <= 1}
                      onClick={() => removeVariable(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={p.description}
                      onChange={(e) => updateVariable(idx, { description: e.target.value })}
                      placeholder="Desc. para el agente"
                      className="h-7 text-[11px]"
                    />
                    <Input
                      value={testValues[normalizedName] ?? ""}
                      onChange={(e) =>
                        onTestValuesChange({ ...testValues, [normalizedName]: e.target.value })
                      }
                      placeholder={p.description || JSON_SCHEMA_TYPE_HINT[p.type]}
                      className="h-7 text-xs font-mono"
                      disabled={!isValidName}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Biblioteca de versiones */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 border-b border-border/60 pb-2">
            <History className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Biblioteca de análisis</h2>
          </div>
          <div className="flex gap-2">
            <Input
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="Nota (opcional)"
              className="h-8 text-xs"
            />
            <Button type="button" size="sm" className="h-8 shrink-0" onClick={saveVersion}>
              <Save className="h-3.5 w-3.5 mr-1" /> Guardar
            </Button>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-border/50">
            {versions.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic py-2">
                Guardá versiones mientras explorás la función antes de la final.
              </p>
            ) : (
              versions.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => restoreVersion(v)}
                  className="w-full text-left py-2 hover:bg-muted/35 -mx-1 px-1 rounded-md transition-colors"
                >
                  <p className="text-xs font-medium truncate">{v.note || "Sin nota"}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">
                    {v.expression || "(vacía)"}
                  </p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                    {new Date(v.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Editor + consola */}
      <div className="xl:col-span-8 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <Calculator className="h-4 w-4 text-primary" />
                Función matemática
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Armá la expresión línea a línea. Insertá variables y operadores desde la barra.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={!undoStack.length}
                onClick={undo}
                title="Deshacer"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={!redoStack.length}
                onClick={redo}
                title="Rehacer"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 font-semibold gap-1.5"
                disabled={preview.isPending}
                onClick={run}
              >
                {preview.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                Probar
              </Button>
            </div>
          </div>

          <FormulaExpressionEditor
            value={expression}
            onChange={setExpressionWithHistory}
            variables={varNames}
            emptyVariablesHint="Definí variables a la izquierda."
          />
        </div>

        <div className="rounded-lg border border-border/70 bg-zinc-950/90 overflow-hidden font-mono text-xs text-zinc-300">
          <div className="border-b border-border/50 px-3 py-2 flex items-center justify-between bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Consola de salida
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              {preview.isPending
                ? "Evaluating"
                : result?.success
                  ? "Success"
                  : result?.success === false
                    ? "Error"
                    : "Idle"}
            </span>
          </div>
          <div className="p-4 min-h-[140px] max-h-[280px] overflow-auto space-y-3">
            {!result && !preview.isPending ? (
              <div className="text-zinc-500 italic py-6 text-center text-[11px] flex flex-col items-center gap-2">
                <Info className="h-4 w-4 opacity-50" />
                Presioná Probar para evaluar la función con los valores de prueba.
              </div>
            ) : preview.isPending ? (
              <div className="text-sky-400 animate-pulse flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Evaluando…
              </div>
            ) : (
              <>
                <div className="space-y-1 text-zinc-400">
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-zinc-500">fórmula:</span>
                    <code className="text-sky-300 break-all">{expression.trim()}</code>
                  </div>
                  {processedExpression && (
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-zinc-500">con valores:</span>
                      <code className="text-amber-300 break-all">{processedExpression}</code>
                    </div>
                  )}
                </div>
                {result?.success ? (
                  <div className="flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
                    <pre className="text-sm font-bold text-emerald-400 break-all whitespace-pre-wrap">
                      {prettyJson(result.result)}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded border border-rose-900/40 text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                    <span className="break-all whitespace-pre-wrap">
                      {result?.error || "Error desconocido"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
