import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChannelConfigField } from "@/api/hooks/useChannels";

type Props = {
  fields: ChannelConfigField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  disabled?: boolean;
};

export function ChannelConfigFields({ fields, values, onChange, disabled }: Props) {
  if (!fields.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Este canal no requiere campos de configuración adicionales.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const value = values[field.key];
        const id = `cfg-${field.key}`;

        if (field.type === "switch") {
          return (
            <div
              key={field.key}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-0.5 pr-3">
                <Label htmlFor={id}>{field.label}</Label>
                {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
              </div>
              <Switch
                id={id}
                checked={Boolean(value ?? field.default ?? false)}
                onCheckedChange={(checked) => onChange(field.key, checked)}
                disabled={disabled}
              />
            </div>
          );
        }

        if (field.type === "select" && field.options?.length) {
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={id}>
                {field.label}
                {field.required ? " *" : ""}
              </Label>
              <Select
                value={String(value ?? field.default ?? "")}
                onValueChange={(v) => onChange(field.key, v)}
                disabled={disabled}
              >
                <SelectTrigger id={id}>
                  <SelectValue placeholder={`Selecciona ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            </div>
          );
        }

        const inputType =
          field.type === "password"
            ? "password"
            : field.type === "number"
              ? "number"
              : field.type === "url"
                ? "url"
                : field.type === "email"
                  ? "email"
                  : "text";

        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={id}>
              {field.label}
              {field.required ? " *" : ""}
            </Label>
            <Input
              id={id}
              type={inputType}
              value={value === undefined || value === null ? "" : String(value)}
              onChange={(e) =>
                onChange(
                  field.key,
                  field.type === "number"
                    ? e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                    : e.target.value,
                )
              }
              placeholder={
                field.secret && value ? "Dejar vacío para conservar el valor actual" : undefined
              }
              autoComplete={field.secret ? "new-password" : undefined}
              disabled={disabled}
            />
            {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

/** Filtra secrets enmascarados antes de enviar PATCH (no reenviar "ab12...wxyz"). */
export function configPayloadForSave(
  values: Record<string, unknown>,
  fields: ChannelConfigField[],
): Record<string, unknown> {
  const secretKeys = new Set(fields.filter((f) => f.secret).map((f) => f.key));
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (secretKeys.has(key)) {
      if (value === undefined || value === null || value === "") continue;
      if (typeof value === "string" && (value === "****" || value.includes("..."))) {
        continue;
      }
    }
    out[key] = value;
  }
  return out;
}
