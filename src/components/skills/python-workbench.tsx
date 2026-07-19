import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  Loader2,
  Play,
  Plus,
  Terminal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePreviewPython, type ExecuteResult } from "@/api/hooks/useAgentFunctions";
import {
  buildFormulaSchemaFromParams,
  coerceParamsFromForm,
  formulaVarNamesFromParams,
  getDuplicateFormulaVarIndexes,
  JSON_SCHEMA_TYPE_HINT,
  JSON_SCHEMA_TYPE_LABEL,
  normalizeFormulaVarName,
  prettyJson,
  type FormulaParamDraft,
} from "@/lib/skills";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_PYTHON = `def main(a=0, b=0):
    """Función de entrada: recibe los parámetros de la skill."""
    return a + b
`;

type PythonWorkbenchProps = {
  code: string;
  onCodeChange: (next: string) => void;
  params: FormulaParamDraft[];
  onParamsChange: (next: FormulaParamDraft[]) => void;
  testValues: Record<string, string>;
  onTestValuesChange: (next: Record<string, string>) => void;
};

export function PythonWorkbench({
  code,
  onCodeChange,
  params,
  onParamsChange,
  testValues,
  onTestValuesChange,
}: PythonWorkbenchProps) {
  const preview = usePreviewPython();
  const [result, setResult] = useState<ExecuteResult | null>(null);

  const varNames = useMemo(() => formulaVarNamesFromParams(params), [params]);
  const schema = useMemo(() => buildFormulaSchemaFromParams(params), [params]);
  const duplicateIndexes = useMemo(() => getDuplicateFormulaVarIndexes(params), [params]);

  useEffect(() => {
    if (!code.trim()) onCodeChange(DEFAULT_PYTHON);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const name of varNames) next[name] = testValues[name] ?? "";
    const same =
      Object.keys(next).length === Object.keys(testValues).length &&
      Object.keys(next).every((k) => k in testValues);
    if (!same) onTestValuesChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [varNames.join("|")]);

  const run = () => {
    if (duplicateIndexes.size > 0) {
      toast.error("Hay variables con nombres duplicados");
      return;
    }
    if (!code.trim()) {
      toast.error("Escribí el código Python");
      return;
    }
    const parameters = coerceParamsFromForm(testValues, schema);
    preview.mutate(
      {
        code: code.trim(),
        entry: "main",
        parameters,
        parameters_schema: schema,
      },
      {
        onSuccess: (r) => {
          setResult(r);
          if (r.success) toast.success("Código ejecutado");
          else toast.error(r.error || "Falló la ejecución");
        },
        onError: (err) => {
          const msg =
            (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo ejecutar";
          toast.error(msg);
          setResult({ success: false, error: msg });
        },
      },
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start">
      <div className="lg:col-span-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div>
              <h2 className="text-sm font-semibold">Parámetros</h2>
              <p className="text-[11px] text-muted-foreground">Entradas de `main(...)`</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() =>
                onParamsChange([
                  ...params,
                  {
                    name: `arg_${params.length + 1}`,
                    type: "number",
                    description: "",
                    required: true,
                  },
                ])
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
            </Button>
          </div>
          <div className="divide-y divide-border/50 max-h-[360px] overflow-y-auto">
            {params.map((p, idx) => {
              const name = normalizeFormulaVarName(p.name);
              return (
                <div key={idx} className="py-2.5 first:pt-0 space-y-2">
                  <div className="flex gap-1.5">
                    <Input
                      value={p.name}
                      onChange={(e) =>
                        onParamsChange(
                          params.map((row, i) =>
                            i === idx ? { ...row, name: e.target.value } : row,
                          ),
                        )
                      }
                      className="h-8 font-mono text-xs"
                      placeholder="nombre"
                    />
                    <Select
                      value={p.type}
                      onValueChange={(v) =>
                        onParamsChange(
                          params.map((row, i) =>
                            i === idx ? { ...row, type: v as FormulaParamDraft["type"] } : row,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8 w-24 text-[11px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">{JSON_SCHEMA_TYPE_LABEL.number}</SelectItem>
                        <SelectItem value="integer">{JSON_SCHEMA_TYPE_LABEL.integer}</SelectItem>
                        <SelectItem value="string">{JSON_SCHEMA_TYPE_LABEL.string}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={params.length <= 1}
                      onClick={() => onParamsChange(params.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Valor de prueba</Label>
                    <Input
                      value={testValues[name] ?? ""}
                      onChange={(e) =>
                        onTestValuesChange({ ...testValues, [name]: e.target.value })
                      }
                      className="h-7 font-mono text-xs"
                      placeholder={JSON_SCHEMA_TYPE_HINT[p.type]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-primary" />
                Editor Python
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Definí <code className="text-[10px]">def main(...)</code> — se ejecuta de forma
                acotada.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5"
              disabled={preview.isPending}
              onClick={run}
            >
              {preview.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
              Probar código
            </Button>
          </div>
          <div className="rounded-md border border-border/70 overflow-hidden">
            <CodeMirror
              value={code}
              height="320px"
              theme={oneDark}
              extensions={[python()]}
              onChange={onCodeChange}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
                bracketMatching: true,
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-zinc-950/90 overflow-hidden font-mono text-xs text-zinc-300">
          <div className="border-b border-border/50 px-3 py-2 flex items-center gap-2 bg-zinc-900/80">
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Output
            </span>
          </div>
          <div className="p-4 min-h-[100px]">
            {!result ? (
              <p className="text-zinc-500 italic text-[11px]">Sin ejecución todavía.</p>
            ) : result.success ? (
              <div className="flex gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                <pre className="whitespace-pre-wrap break-all">{prettyJson(result.result)}</pre>
              </div>
            ) : (
              <div className={cn("flex gap-2 text-rose-400")}>
                <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                <span className="whitespace-pre-wrap break-all">{result.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
