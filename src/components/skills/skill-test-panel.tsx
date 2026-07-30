import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useExecuteAgentFunction,
  type AgentFunction,
  type ExecuteResult,
} from "@/api/hooks/useAgentFunctions";
import {
  coerceParamsFromForm,
  DATE_WIRE_FORMATS,
  defaultsFromSchema,
  formatSchemaType,
  getDateWireFormat,
  isRequiredParam,
  kindFromProperty,
  SCHEMA_KIND_HINT,
  SCHEMA_KIND_PLACEHOLDER,
  prettyJson,
  schemaPropertyEntries,
  substituteFormulaExpression,
  wireDateToIso,
} from "@/lib/skills";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function storageKey(skillId: string) {
  return `muninn:skill-test:${skillId}`;
}

function loadValues(skillId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(storageKey(skillId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveValues(skillId: string, values: Record<string, string>) {
  try {
    localStorage.setItem(storageKey(skillId), JSON.stringify(values));
  } catch {
    /* ignore */
  }
}

/**
 * Probar skill: siempre input libre para todos los parámetros.
 * Las fuentes (estático / DATA) se configuran por agente al asignar;
 * aquí se simula pasar valores como lo haría el LLM/usuario.
 */
export function SkillTestPanel({ skill }: { skill: AgentFunction }) {
  const execute = useExecuteAgentFunction();
  const skillId = String(skill.id);
  const isFormula = skill.implementation_type === "formula";
  const formulaExpression = (skill.config?.expression || "").trim();
  const entries = useMemo(
    () => schemaPropertyEntries(skill.parameters_schema),
    [skill.parameters_schema],
  );
  const requiredKeys = useMemo(
    () => skill.parameters_schema?.required ?? [],
    [skill.parameters_schema?.required],
  );

  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...defaultsFromSchema(skill.parameters_schema),
    ...loadValues(skillId),
  }));
  const [result, setResult] = useState<ExecuteResult | null>(null);
  const [lastParams, setLastParams] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    setValues({
      ...defaultsFromSchema(skill.parameters_schema),
      ...loadValues(skillId),
    });
    setResult(null);
    setLastParams(null);
  }, [skillId, skill.parameters_schema]);

  useEffect(() => {
    saveValues(skillId, values);
  }, [skillId, values]);

  const processedExpression = useMemo(() => {
    if (!isFormula || !formulaExpression || !lastParams) return null;
    return substituteFormulaExpression(formulaExpression, lastParams);
  }, [isFormula, formulaExpression, lastParams]);

  const run = () => {
    const missing = requiredKeys.filter((k) => !values[k]?.trim());
    if (missing.length) {
      toast.error(`Completa los parámetros requeridos: ${missing.join(", ")}`);
      return;
    }
    const parameters = coerceParamsFromForm(values, skill.parameters_schema);
    setLastParams(parameters);
    execute.mutate(
      { id: skillId, parameters },
      {
        onSuccess: (r) => {
          setResult(r);
          if (r.success) toast.success("Skill ejecutada");
          else toast.error(r.error || "La skill falló");
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
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h2 className="text-sm font-medium">Probar skill</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isFormula
              ? "Ingresá valores de prueba para cada variable y ejecutá la fórmula."
              : "Ingresá los valores a mano (como si los entregara el LLM). En el agente, las fuentes (documento DATA / estático) se configuran al asignar."}
            {skill.uses_personal_connection
              ? " En prueba se usa tu cuenta de prueba o la cuenta de la instalación; en el agente, solo la de la instalación."
              : ""}
          </p>
        </div>
        <Button type="button" size="sm" disabled={execute.isPending} onClick={run}>
          {execute.isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <FlaskConical className="h-4 w-4 mr-1.5" />
          )}
          Ejecutar
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 min-w-0">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground rounded-lg border border-dashed px-3 py-6 text-center">
              {skill.uses_personal_connection
                ? "Sin parámetros de negocio. Se autenticará con tu cuenta de la Aplicación."
                : "Esta skill no define parámetros. Puedes ejecutarla directo."}
            </p>
          ) : (
            entries.map(([key, prop]) => {
              const req = isRequiredParam(skill.parameters_schema, key);
              const kind = kindFromProperty(prop);
              const wire = getDateWireFormat(prop);
              const wireMeta = DATE_WIRE_FORMATS.find((f) => f.value === wire);
              const inputType =
                prop.format === "password" || key.toLowerCase().includes("password")
                  ? "password"
                  : kind === "date"
                    ? "date"
                    : kind === "datetime"
                      ? "datetime-local"
                      : "text";
              const inputMode =
                kind === "integer" ? "numeric" : kind === "number" ? "decimal" : undefined;
              const stored = values[key] ?? "";
              // date picker usa ISO; si el valor guardado está en wire, convertimos para mostrar.
              const displayValue =
                kind === "date" && wire !== "YYYY-MM-DD"
                  ? wireDateToIso(stored, wire) ||
                    (/^\d{4}-\d{2}-\d{2}$/.test(stored) ? stored : "")
                  : stored;
              const placeholder =
                prop.description ||
                (kind === "date" ? wireMeta?.example : SCHEMA_KIND_PLACEHOLDER[kind]) ||
                key;
              return (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-mono flex flex-wrap items-center gap-1.5">
                    {key}
                    {req && <span className="text-destructive">*</span>}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {formatSchemaType(prop.type, prop.format, prop)}
                    </span>
                  </Label>
                  <Input
                    type={inputType}
                    inputMode={inputMode}
                    autoComplete="off"
                    value={displayValue}
                    onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {prop.description || SCHEMA_KIND_HINT[kind]}
                    {kind === "date" && wire !== "YYYY-MM-DD" ? ` Se enviará como ${wire}.` : ""}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Resultado</p>
          {!result ? (
            <div className="rounded-lg border border-dashed px-4 py-10 text-center text-xs text-muted-foreground">
              Ejecuta la skill para ver el resultado aquí.
            </div>
          ) : (
            <div
              className={cn(
                "rounded-lg border p-3 space-y-3 text-xs",
                result.success
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5",
              )}
            >
              <p className="font-medium">{result.success ? "Éxito" : "Error"}</p>

              {isFormula && formulaExpression && (
                <div className="space-y-2 rounded-md border bg-background/60 p-2.5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Fórmula
                    </p>
                    <p className="font-mono text-[11px] break-all">{formulaExpression}</p>
                  </div>
                  {processedExpression && (
                    <div className="space-y-1 border-t border-border/50 pt-2">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Con valores
                      </p>
                      <p className="font-mono text-[11px] break-all text-primary">
                        {processedExpression}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.error && (
                <p className="text-destructive whitespace-pre-wrap">{result.error}</p>
              )}
              {result.result != null && (
                <div className="space-y-1">
                  {isFormula && (
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Resultado
                    </p>
                  )}
                  <pre className="max-h-72 overflow-auto rounded bg-background/60 p-2 font-mono text-[11px] whitespace-pre-wrap break-all">
                    {prettyJson(result.result)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
