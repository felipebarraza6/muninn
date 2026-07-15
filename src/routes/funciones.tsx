import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, FunctionSquare, Eye, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function Funciones() {
  const { data: functions = [], isLoading, refetch } = useAgentFunctions();
  const create = useCreateAgentFunction();
  const execute = useExecuteAgentFunction();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schemaJson, setSchemaJson] = useState('{\n  "type": "object",\n  "properties": {}\n}');

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Funciones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tools que el agente puede ejecutar (schema + execute).
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funciones configuradas</CardTitle>
          <CardDescription>Vincúlalas al agente desde el Agent Studio.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {functions.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay funciones. Crea la primera.
            </div>
          )}
          {functions.map((fn) => (
            <div
              key={fn.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <FunctionSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{fn.name}</span>
                    <Badge variant={fn.is_active ? "default" : "secondary"} className="text-[10px]">
                      {fn.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {fn.slug ?? "Sin slug"} · {fn.external_api_name ?? "Sin API"}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
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
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to={`/funciones/${fn.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
    </div>
  );
}
