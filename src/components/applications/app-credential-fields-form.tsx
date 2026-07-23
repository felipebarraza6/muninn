import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/password";
import {
  AUTH_TYPE_HINT,
  AUTH_TYPE_LABEL,
  resolveCredentialFields,
  type CredentialFieldDef,
} from "@/lib/external-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function CopyFieldNameButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/60"
      title={`Copiar «${value}»`}
      onClick={async () => {
        const ok = await copyToClipboard(value);
        if (ok) {
          setCopied(true);
          toast.success(label ? `Copiado: ${label}` : "Copiado");
        } else {
          toast.error("No se pudo copiar");
        }
      }}
    >
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

/** Formulario de credenciales reutilizable (instalación + cuenta de prueba). */
export function AppCredentialFieldsForm({
  authType,
  fieldsFromApi,
  apiHints,
  values,
  onChange,
  connected,
  className,
}: {
  authType?: string | null;
  fieldsFromApi?: CredentialFieldDef[] | null;
  apiHints?: { baseUrl?: string | null; name?: string | null };
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  connected?: boolean;
  className?: string;
}) {
  const fields = resolveCredentialFields(authType, fieldsFromApi, apiHints);
  const typeLabel = AUTH_TYPE_LABEL[authType || ""] || authType || "Auth";
  const looksNubox = /nubox/i.test(`${apiHints?.baseUrl || ""} ${apiHints?.name || ""}`);

  if (fields.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 px-3 py-4 text-xs text-muted-foreground text-center">
        Este tipo de auth no define campos de credenciales.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground space-y-0.5">
        <p>
          Auth: <span className="text-foreground font-medium">{typeLabel}</span>
        </p>
        <p className="leading-relaxed">{AUTH_TYPE_HINT[authType || ""] || ""}</p>
        {looksNubox && (
          <p className="leading-relaxed text-foreground/90">
            Nubox Pyme usa auth dual: <strong className="font-medium">Bearer del partner</strong> +{" "}
            <strong className="font-medium">X-Api-Key</strong> de la empresa. Si solo pegas una, la
            API responde 401 Unauthorized.
          </p>
        )}
        <p className="pt-0.5">
          Pega los valores del proveedor. Puedes copiar el nombre de cada campo con el ícono.
        </p>
      </div>
      <div className="grid gap-3">
        {fields.map((f) => {
          const inputType =
            f.format === "password" || /password|secret|token|key|api_key/i.test(f.name)
              ? "password"
              : f.format === "email" || /email/i.test(f.name)
                ? "email"
                : "text";
          const title = f.label || f.name.replace(/[_-]+/g, " ");
          return (
            <div key={f.name} className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs">
                  {title}
                  {f.required !== false && <span className="text-destructive"> *</span>}
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">({f.name})</span>
                <CopyFieldNameButton value={f.name} label={title} />
              </div>
              {f.hint && <p className="text-[10px] text-muted-foreground leading-snug">{f.hint}</p>}
              <Input
                type={inputType}
                autoComplete="off"
                className="h-9 font-mono text-sm"
                value={values[f.name] ?? ""}
                onChange={(e) => onChange(f.name, e.target.value)}
                placeholder={
                  connected && inputType === "password"
                    ? "•••••••• (vacío = no cambiar)"
                    : `Pega ${title.toLowerCase()}…`
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
