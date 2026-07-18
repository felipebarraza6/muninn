import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  useExecuteAgentFunction,
  type AgentFunction,
  type ExecuteResult,
  type ParameterSource,
} from "@/api/hooks/useAgentFunctions";
import {
  coerceParamsFromForm,
  defaultsFromSchema,
  isRequiredParam,
  PARAMETER_SOURCE_LABEL,
  prettyJson,
  schemaPropertyEntries,
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

function sourceOf(
  sources: Record<string, ParameterSource> | undefined,
  key: string,
): ParameterSource["source"] {
  return sources?.[key]?.source ?? "free";
}

export function SkillTestPanel({ skill }: { skill: AgentFunction }) {
  const execute = useExecuteAgentFunction();
  const skillId = String(skill.id);
  const sources = skill.config?.parameter_sources;
  const allEntries = useMemo(
    () => schemaPropertyEntries(skill.parameters_schema),
    [skill.parameters_schema],
  );
  const freeEntries = useMemo(
    () => allEntries.filter(([key]) => sourceOf(sources, key) === "free"),
    [allEntries, sources],
  );
  const resolvedEntries = useMemo(
    () => allEntries.filter(([key]) => sourceOf(sources, key) !== "free"),
    [allEntries, sources],
  );
  const requiredFree = useMemo(
    () => (skill.parameters_schema?.required ?? []).filter((k) => sourceOf(sources, k) === "free"),
    [skill.parameters_schema?.required, sources],
  );

  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...defaultsFromSchema(skill.parameters_schema),
    ...loadValues(skillId),
  }));
  const [result, setResult] = useState<ExecuteResult | null>(null);

  useEffect(() => {
    setValues({
      ...defaultsFromSchema(skill.parameters_schema),
      ...loadValues(skillId),
    });
    setResult(null);
  }, [skillId, skill.parameters_schema]);

  useEffect(() => {
    saveValues(skillId, values);
  }, [skillId, values]);

  const run = () => {
    const missing = requiredFree.filter((k) => !values[k]?.trim());
    if (missing.length) {
      toast.error(`Completa los parámetros libres: ${missing.join(", ")}`);
      return;
    }
    // Solo enviamos los libres; static/data_document los resuelve el backend.
    const freeOnly: Record<string, string> = {};
    for (const [key] of freeEntries) {
      if (values[key] != null) freeOnly[key] = values[key];
    }
    const parameters = coerceParamsFromForm(freeOnly, skill.parameters_schema);
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
    <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Probar skill</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Solo pedimos parámetros libres (los que entregaría el LLM). Los estáticos y de documento
            se resuelven en el servidor.
            {skill.uses_personal_connection
              ? " La autenticación usa tu cuenta de la Aplicación (Mis conexiones)."
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
          {allEntries.length === 0 ? (
            <p className="text-xs text-muted-foreground rounded-lg border border-dashed px-3 py-6 text-center">
              {skill.uses_personal_connection
                ? "Sin parámetros de negocio. Se autenticará con tu cuenta de la Aplicación."
                : "Esta skill no define parámetros. Puedes ejecutarla directo."}
            </p>
          ) : (
            <>
              {freeEntries.length === 0 && (
                <p className="text-xs text-muted-foreground rounded-lg border border-dashed px-3 py-4 text-center">
                  Todos los parámetros se resuelven automáticamente. Podés ejecutar sin inputs.
                </p>
              )}
              {freeEntries.map(([key, prop]) => {
                const req = isRequiredParam(skill.parameters_schema, key);
                const inputType =
                  prop.format === "password" || key.toLowerCase().includes("password")
                    ? "password"
                    : prop.format === "date"
                      ? "date"
                      : "text";
                return (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-xs font-mono flex items-center gap-1.5">
                      {key}
                      {req && <span className="text-destructive">*</span>}
                      {prop.type && (
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {prop.type}
                          {prop.format ? ` · ${prop.format}` : ""}
                        </span>
                      )}
                    </Label>
                    <Input
                      type={inputType}
                      autoComplete="off"
                      value={values[key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={prop.description || key}
                      className="h-9 text-sm"
                    />
                    {prop.description && (
                      <p className="text-[11px] text-muted-foreground">{prop.description}</p>
                    )}
                  </div>
                );
              })}
              {resolvedEntries.length > 0 && (
                <div className="rounded-lg border bg-muted/30 px-3 py-2 space-y-1.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Resueltos automáticamente
                  </p>
                  {resolvedEntries.map(([key]) => {
                    const src = sourceOf(sources, key);
                    const cfg = sources?.[key];
                    let detail = PARAMETER_SOURCE_LABEL[src];
                    if (cfg?.source === "static") {
                      detail = `Estático: ${String(cfg.value ?? "")}`;
                    } else if (cfg?.source === "data_document") {
                      detail = `Documento: ${cfg.document_title}`;
                    }
                    return (
                      <div key={key} className="flex flex-wrap items-center gap-2 text-xs">
                        <code className="font-mono">{key}</code>
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {detail}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
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
                "rounded-lg border p-3 space-y-2 text-xs",
                result.success
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5",
              )}
            >
              <p className="font-medium">{result.success ? "Éxito" : "Error"}</p>
              {result.error && (
                <p className="text-destructive whitespace-pre-wrap">{result.error}</p>
              )}
              {result.result != null && (
                <pre className="max-h-72 overflow-auto rounded bg-background/60 p-2 font-mono text-[11px] whitespace-pre-wrap break-all">
                  {prettyJson(result.result)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
