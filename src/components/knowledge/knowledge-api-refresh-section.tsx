import { useMemo, useState } from "react";
import { ChevronDown, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import type { ApiRefreshConfig, ApiRefreshMappingType } from "@/api/hooks/useKnowledge";
import { cn } from "@/lib/utils";

/** Frecuencias soportadas (metadata; el backend ejecuta cada 1h). */
const CRON_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "0 * * * *", label: "Cada 1 hora" },
  { value: "0 */6 * * *", label: "Cada 6 horas" },
  { value: "0 */12 * * *", label: "Cada 12 horas" },
  { value: "0 0 * * *", label: "Cada 24 horas" },
];

const MAPPING_OPTIONS: Array<{ value: ApiRefreshMappingType; label: string; hint: string }> = [
  {
    value: "json_to_table",
    label: "JSON → tabla",
    hint: "Extrae filas y las muestra como tabla DATA.",
  },
  { value: "raw_string", label: "Texto crudo", hint: "Guarda el response como texto plano." },
  {
    value: "title_and_body",
    label: "Título + cuerpo",
    hint: "Separa el contenido en título y cuerpo.",
  },
  { value: "json_path", label: "Ruta JSON", hint: "Extrae solo el valor de una ruta del JSON." },
];

export const DEFAULT_CRON = "0 */6 * * *";

export function cronLabel(cron?: string): string {
  return CRON_OPTIONS.find((o) => o.value === cron)?.label ?? cron ?? "";
}

export function mappingLabel(type?: ApiRefreshMappingType | string): string {
  return MAPPING_OPTIONS.find((o) => o.value === type)?.label ?? type ?? "";
}

interface KnowledgeApiRefreshSectionProps {
  /** Config actual; null = sin auto-refresh. */
  value: ApiRefreshConfig | null;
  onChange: (next: ApiRefreshConfig | null) => void;
  disabled?: boolean;
  /** Sucursal para listar ExternalAPIs habilitadas. */
  branch?: string | number | null;
}

/**
 * Sección colapsable "Auto-refresh desde API".
 * El backend (Celery, cada 1h) consulta el endpoint, mapea el response
 * y actualiza `content` + re-indexa si cambió.
 */
export function KnowledgeApiRefreshSection({
  value,
  onChange,
  disabled = false,
  branch,
}: KnowledgeApiRefreshSectionProps) {
  const enabled = value != null;
  const [open, setOpen] = useState(enabled);
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs({ branch });

  const selectedApi = useMemo(
    () => apis.find((a) => String(a.id) === String(value?.external_api_id)),
    [apis, value?.external_api_id],
  );
  const endpointKeys = useMemo(() => Object.keys(selectedApi?.endpoints ?? {}), [selectedApi]);

  const enable = () => {
    setOpen(true);
    onChange({
      external_api_id: "",
      endpoint: "",
      cron: DEFAULT_CRON,
      content_mapping: { type: "json_to_table", path: "", columns: [] },
    });
  };

  const patch = (p: Partial<ApiRefreshConfig>) => {
    if (!value) return;
    onChange({ ...value, ...p });
  };

  const patchMapping = (p: Partial<ApiRefreshConfig["content_mapping"]>) => {
    if (!value) return;
    onChange({ ...value, content_mapping: { ...value.content_mapping, ...p } });
  };

  const mappingType = value?.content_mapping.type;
  const showPath = mappingType === "json_path" || mappingType === "json_to_table";
  const showColumns = mappingType === "json_to_table";
  const columns = value?.content_mapping.columns ?? [];

  return (
    <Collapsible
      open={open || enabled}
      onOpenChange={(v) => {
        // Si está habilitado, no se puede colapsar sin desactivar.
        if (!enabled) setOpen(v);
      }}
      className="rounded-lg border border-border/70 bg-muted/20"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <CollapsibleTrigger
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          disabled={disabled}
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              enabled ? "text-primary" : "text-muted-foreground",
            )}
          />
          <div className="min-w-0">
            <p className="text-xs font-medium">Auto-refresh desde API</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {enabled
                ? "Activo: el contenido se actualiza solo desde la API."
                : "Opcional: actualiza el contenido periódicamente."}
            </p>
          </div>
          {!enabled && (
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          )}
        </CollapsibleTrigger>
        {enabled ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 text-destructive hover:text-destructive"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Quitar
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 shrink-0"
            disabled={disabled}
            onClick={enable}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Activar
          </Button>
        )}
      </div>

      <CollapsibleContent>
        {enabled && value ? (
          <div className="space-y-3 border-t border-border/60 px-3 pb-3 pt-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">External API</Label>
                <Select
                  value={value.external_api_id || undefined}
                  onValueChange={(v) => patch({ external_api_id: v, endpoint: "" })}
                  disabled={disabled || apisLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={apisLoading ? "Cargando APIs…" : "Selecciona una API"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {apis.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Endpoint</Label>
                <Select
                  value={value.endpoint || undefined}
                  onValueChange={(v) => patch({ endpoint: v })}
                  disabled={disabled || !selectedApi}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={
                        !selectedApi
                          ? "Elige una API primero"
                          : endpointKeys.length === 0
                            ? "Esta API no tiene endpoints"
                            : "Selecciona endpoint"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {endpointKeys.map((key) => {
                      const ep = selectedApi?.endpoints?.[key];
                      return (
                        <SelectItem key={key} value={key}>
                          {key}
                          {ep?.method || ep?.path ? (
                            <span className="ml-1.5 text-muted-foreground">
                              {[ep?.method, ep?.path].filter(Boolean).join(" ")}
                            </span>
                          ) : null}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Cada cuánto</Label>
                <Select
                  value={value.cron}
                  onValueChange={(v) => patch({ cron: v })}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Mapping type</Label>
                <Select
                  value={mappingType}
                  onValueChange={(v) => {
                    const type = v as ApiRefreshMappingType;
                    patchMapping({
                      type,
                      ...(type !== "json_to_table" ? { columns: [] } : {}),
                      ...(type !== "json_path" && type !== "json_to_table" ? { path: "" } : {}),
                    });
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAPPING_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  {MAPPING_OPTIONS.find((o) => o.value === mappingType)?.hint}
                </p>
              </div>
            </div>

            {showPath && (
              <div className="space-y-1.5">
                <Label className="text-xs">Path en JSON</Label>
                <Input
                  value={value.content_mapping.path ?? ""}
                  onChange={(e) => patchMapping({ path: e.target.value })}
                  placeholder="Ej: data.products"
                  disabled={disabled}
                  className="h-9 font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Ruta para extraer los datos del response (usa puntos para anidar).
                </p>
              </div>
            )}

            {showColumns && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Columnas</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7"
                    disabled={disabled}
                    onClick={() => patchMapping({ columns: [...columns, ""] })}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Añadir
                  </Button>
                </div>
                {columns.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">
                    Sin columnas: se usan todas las keys del primer objeto.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {columns.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Input
                          value={col}
                          onChange={(e) =>
                            patchMapping({
                              columns: columns.map((c, i) => (i === idx ? e.target.value : c)),
                            })
                          }
                          placeholder={`columna_${idx + 1}`}
                          disabled={disabled}
                          className="h-8 font-mono text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={disabled}
                          onClick={() =>
                            patchMapping({ columns: columns.filter((_, i) => i !== idx) })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="flex items-start gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-2 text-[11px] text-muted-foreground">
              <Loader2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
              El backend refresca cada 1 h (el selector es metadata). Si el contenido no cambió, no
              se re-indexa. Con auto-refresh activo, evita editar el contenido a mano.
            </p>
          </div>
        ) : (
          <div className="border-t border-border/60 px-3 pb-3 pt-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Un proceso (cron) consultará el endpoint elegido, mapeará el response y actualizará el
              contenido + vectores automáticamente cuando haya cambios.
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
