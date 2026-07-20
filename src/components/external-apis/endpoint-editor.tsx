import { useMemo, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExternalAPIEndpoint } from "@/api/hooks/useExternalAPIs";
import { HTTP_METHODS, parseJsonObject, prettyJson } from "@/lib/external-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function headersHaveAuthToken(headersJson: string): boolean {
  const parsed = parseJsonObject(headersJson, "headers");
  if (!parsed.ok) return false;
  return Object.entries(parsed.value).some(
    ([k, v]) => k.toLowerCase() === "authorization" && String(v).includes("{{auth_token}}"),
  );
}

function setAuthTokenInHeaders(headersJson: string, enabled: boolean): string {
  const parsed = parseJsonObject(headersJson || "{}", "headers");
  const base = parsed.ok ? { ...parsed.value } : {};
  const authKey =
    Object.keys(base).find((k) => k.toLowerCase() === "authorization") ?? "Authorization";
  if (enabled) {
    // El prefijo real (Bearer/Token) lo corrige el backend según auth_header_prefix.
    base[authKey] = "Bearer {{auth_token}}";
  } else {
    delete base[authKey];
  }
  return prettyJson(base);
}

const METHOD_STYLE: Record<string, string> = {
  GET: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  POST: "border-primary/40 text-primary bg-primary/10",
  PUT: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  PATCH: "border-sky-500/40 text-sky-400 bg-sky-500/10",
  DELETE: "border-destructive/40 text-destructive bg-destructive/10",
};

type Draft = {
  key: string;
  method: string;
  path: string;
  queryParams: string;
  headers: string;
  body: string;
  responseMapping: string;
};

const emptyDraft = (): Draft => ({
  key: "",
  method: "GET",
  path: "/",
  queryParams: "{}",
  headers: "{}",
  body: "{}",
  responseMapping: "{}",
});

function endpointToDraft(key: string, ep: ExternalAPIEndpoint): Draft {
  return {
    key,
    method: (ep.method || "GET").toUpperCase(),
    path: ep.path || "/",
    queryParams: prettyJson(ep.query_params ?? {}),
    headers: prettyJson(ep.headers ?? {}),
    body: prettyJson(ep.body ?? {}),
    responseMapping: prettyJson(ep.response_mapping ?? {}),
  };
}

function draftToEndpoint(draft: Draft): ExternalAPIEndpoint | null {
  if (!draft.key.trim()) {
    toast.error("La clave del endpoint es obligatoria");
    return null;
  }
  if (!/^[a-zA-Z0-9_\- ]+$/.test(draft.key.trim())) {
    toast.error("Clave inválida (letras, números, espacios, _ -)");
    return null;
  }
  const path = draft.path.trim();
  if (!path.startsWith("/")) {
    toast.error("El path debe empezar con /");
    return null;
  }
  if (path.includes("://")) {
    toast.error("Usa path relativo, no URL absoluta");
    return null;
  }
  const qp = parseJsonObject(draft.queryParams, "query_params");
  if (!qp.ok) {
    toast.error(qp.error);
    return null;
  }
  const headers = parseJsonObject(draft.headers, "headers");
  if (!headers.ok) {
    toast.error(headers.error);
    return null;
  }
  const body = parseJsonObject(draft.body, "body");
  if (!body.ok) {
    toast.error(body.error);
    return null;
  }
  const mapping = parseJsonObject(draft.responseMapping, "response_mapping");
  if (!mapping.ok) {
    toast.error(mapping.error);
    return null;
  }
  return {
    method: draft.method.toUpperCase(),
    path,
    query_params: qp.value,
    headers: headers.value,
    body: body.value,
    response_mapping: mapping.value,
  };
}

interface ExternalApiEndpointsPanelProps {
  endpoints: Record<string, ExternalAPIEndpoint>;
  canManage: boolean;
  saving: boolean;
  onSave: (next: Record<string, ExternalAPIEndpoint>) => void;
  /** Cuando va dentro de un tab, oculta el título de sección. */
  embedded?: boolean;
  /** Clave del endpoint de login (auth). Evita Bearer en ese endpoint. */
  authEndpointKey?: string;
}

export function ExternalApiEndpointsPanel({
  endpoints,
  canManage,
  saving,
  onSave,
  embedded = false,
  authEndpointKey = "",
}: ExternalApiEndpointsPanelProps) {
  const entries = useMemo(() => Object.entries(endpoints), [endpoints]);
  const [open, setOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const isAuthEndpointDraft =
    Boolean(authEndpointKey) && draft.key.trim() === authEndpointKey.trim();

  const openCreate = () => {
    setEditingKey(null);
    setDraft(emptyDraft());
    setOpen(true);
  };

  const openEdit = (key: string) => {
    setEditingKey(key);
    setDraft(endpointToDraft(key, endpoints[key] ?? {}));
    setOpen(true);
  };

  const handleSaveDraft = () => {
    const ep = draftToEndpoint(draft);
    if (!ep) return;
    const nextKey = draft.key.trim();
    const next = { ...endpoints };

    if (editingKey && editingKey !== nextKey) {
      if (next[nextKey]) {
        toast.error(`Ya existe un endpoint «${nextKey}»`);
        return;
      }
      delete next[editingKey];
    } else if (!editingKey && next[nextKey]) {
      toast.error(`Ya existe un endpoint «${nextKey}»`);
      return;
    }

    next[nextKey] = ep;
    onSave(next);
    setOpen(false);
  };

  const handleDelete = (key: string) => {
    const next = { ...endpoints };
    delete next[key];
    onSave(next);
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          {!embedded && <h2 className="text-sm font-medium">Endpoints ({entries.length})</h2>}
          <p className={cn("text-xs text-muted-foreground", !embedded && "mt-0.5")}>
            Rutas de la aplicación para skills. Placeholders{" "}
            <code className="text-[10px]">{"{{nombre}}"}</code> se rellenan con args o credenciales
            de auth.
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo endpoint
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No hay endpoints.{" "}
          {canManage ? "Crea el primero para poder probarlo y usarlo en funciones." : ""}
        </p>
      ) : (
        <div className="divide-y divide-border/60">
          {entries.map(([type, endpoint]) => {
            const method = (endpoint.method || "GET").toUpperCase();
            return (
              <div key={type} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-mono font-medium",
                          METHOD_STYLE[method] || "text-muted-foreground",
                        )}
                      >
                        {method}
                      </Badge>
                      <span className="font-medium text-sm">{type}</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {endpoint.path ?? "—"}
                    </p>
                  </div>
                  {canManage && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(type)}
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        disabled={saving}
                        onClick={() => handleDelete(type)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingKey ? "Editar endpoint" : "Nuevo endpoint"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Clave</Label>
              <Input
                value={draft.key}
                onChange={(e) => setDraft((d) => ({ ...d, key: e.target.value }))}
                placeholder="ej: listar_items"
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Identificador usado por las skills (`config.endpoint_type`).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Método</Label>
                <Select
                  value={draft.method}
                  onValueChange={(v) => setDraft((d) => ({ ...d, method: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Path</Label>
                <Input
                  value={draft.path}
                  onChange={(e) => setDraft((d) => ({ ...d, path: e.target.value }))}
                  placeholder="/v1/recursos/"
                  className="font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Relativo a la Base URL. Variables:{" "}
                  <code className="text-[10px]">/v1/items/{"{{id}}"}/</code>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Parámetros query (JSON)</Label>
              <Textarea
                value={draft.queryParams}
                onChange={(e) => setDraft((d) => ({ ...d, queryParams: e.target.value }))}
                rows={3}
                className="font-mono text-xs"
                placeholder='{ "page": "{{page}}", "q": "{{q}}" }'
              />
              <p className="text-[11px] text-muted-foreground">
                Filtros en la URL (<code className="text-[10px]">?clave=valor</code>). Placeholders{" "}
                <code className="text-[10px]">{"{{nombre}}"}</code> los completa la skill o el test.
              </p>
            </div>
            {isAuthEndpointDraft ? (
              <p className="text-[11px] rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-muted-foreground">
                Endpoint de <strong className="text-foreground">login</strong>: no pongas
                Authorization aquí. En el body usa placeholders (
                <code className="text-[10px]">{"{{email}}"}</code>,{" "}
                <code className="text-[10px]">{"{{password}}"}</code>, …). Se rellenan al{" "}
                <strong className="text-foreground">probar</strong> o desde los args de la{" "}
                <strong className="text-foreground">skill</strong> — no se guardan en la API.
              </p>
            ) : (
              <label className="flex items-center gap-2 text-sm rounded-md border border-border/80 px-3 py-2">
                <Switch
                  checked={headersHaveAuthToken(draft.headers)}
                  onCheckedChange={(on) =>
                    setDraft((d) => ({ ...d, headers: setAuthTokenInHeaders(d.headers, on) }))
                  }
                />
                Incluir Authorization del login
                <span className="text-[11px] text-muted-foreground">
                  (prefijo Bearer/Token según Configuración)
                </span>
              </label>
            )}
            <div className="space-y-2">
              <Label>Headers (JSON)</Label>
              <Textarea
                value={draft.headers}
                onChange={(e) => setDraft((d) => ({ ...d, headers: e.target.value }))}
                rows={3}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Cabeceras HTTP (Accept, X-Custom, etc.). Con auth Login el Bearer se inyecta solo si
                falta (excepto en el endpoint de login).
              </p>
            </div>
            <div className="space-y-2">
              <Label>Body (JSON)</Label>
              <Textarea
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                rows={4}
                className="font-mono text-xs"
                placeholder='{ "email": "{{email}}", "password": "{{password}}" }'
              />
              <p className="text-[11px] text-muted-foreground">
                {isAuthEndpointDraft ? (
                  <>
                    Login: usa placeholders que coincidan con Configuración, ej.{" "}
                    <code className="text-[10px]">
                      {'{ "email": "{{email}}", "password": "{{password}}" }'}
                    </code>
                    .
                  </>
                ) : (
                  <>Cuerpo JSON (POST/PUT/PATCH). En GET no se envía.</>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Mapeo de respuesta (JSON)</Label>
              <Textarea
                value={draft.responseMapping}
                onChange={(e) => setDraft((d) => ({ ...d, responseMapping: e.target.value }))}
                rows={3}
                className="font-mono text-xs"
                placeholder="{}"
              />
              <p className="text-[11px] text-muted-foreground">
                Vacío = la skill recibe el JSON tal cual llega de la API. Con claves, solo extrae
                esos campos (ej. <code className="text-[10px]">{`{ "items": "results" }`}</code>).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-1.5" /> Cancelar
            </Button>
            <Button type="button" disabled={saving} onClick={handleSaveDraft}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
