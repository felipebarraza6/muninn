import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, FunctionSquare, Eye, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useAgentFunctions,
  useCreateAgentFunction,
  useExecuteAgentFunction,
} from "@/api/hooks/useAgentFunctions";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { cn } from "@/lib/utils";

export default function Funciones() {
  const { data: functions = [], isLoading, refetch } = useAgentFunctions();
  const create = useCreateAgentFunction();
  const execute = useExecuteAgentFunction();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schemaJson, setSchemaJson] = useState('{\n  "type": "object",\n  "properties": {}\n}');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return functions;
    return functions.filter(
      (fn) =>
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term),
    );
  }, [functions, search]);

  return (
    <AdminPageMotion className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Tools que el agente puede ejecutar (schema + execute).
        </p>
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Nueva
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, slug o API…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {search.trim()
              ? "Sin resultados para esa búsqueda."
              : "No hay funciones. Crea la primera."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((fn) => (
            <article
              key={fn.id}
              className={cn(
                "group flex flex-col rounded-xl border bg-card/60 p-4 transition-colors",
                "hover:border-primary/35 hover:bg-card",
                fn.is_active ? "border-border" : "border-border/60 opacity-80",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <FunctionSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-sm leading-snug truncate">{fn.name}</h3>
                    <Badge
                      variant={fn.is_active ? "default" : "secondary"}
                      className="text-[10px] font-normal"
                    >
                      {fn.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {fn.slug ?? "Sin slug"} · {fn.external_api_name ?? "Sin API"}
                  </p>
                </div>
              </div>

              {fn.description ? (
                <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                  {fn.description}
                </p>
              ) : (
                <p className="mt-3 text-[12px] text-muted-foreground/70 italic flex-1">
                  Sin descripción
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
                <Button variant="ghost" size="sm" className="h-8" asChild>
                  <Link to={`/funciones/${fn.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Ver
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  title="Execute"
                  disabled={execute.isPending}
                  onClick={() =>
                    execute.mutate(
                      { id: String(fn.id), args: {} },
                      {
                        onSuccess: (r) => toast.success(JSON.stringify(r).slice(0, 200)),
                        onError: () => toast.error("Execute falló"),
                      },
                    )
                  }
                >
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Execute
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva función</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              let parameters_schema: Record<string, unknown> = {};
              try {
                parameters_schema = JSON.parse(schemaJson);
              } catch {
                toast.error("JSON schema inválido");
                return;
              }
              create.mutate(
                {
                  name,
                  description,
                  parameters_schema,
                  is_active: true,
                  implementation_type: "api",
                },
                {
                  onSuccess: () => {
                    toast.success("Función creada");
                    setOpen(false);
                    setName("");
                    setDescription("");
                    refetch();
                  },
                  onError: () => toast.error("No se pudo crear"),
                },
              );
            }}
          >
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>parameters_schema (JSON)</Label>
              <Textarea
                value={schemaJson}
                onChange={(e) => setSchemaJson(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
