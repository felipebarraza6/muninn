import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Globe, Eye, Plus, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useExternalAPIs,
  useCreateExternalAPI,
  useTestExternalAPI,
} from "@/api/hooks/useExternalAPIs";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";

const AUTH_TYPE_LABEL: Record<string, string> = {
  none: "Sin autenticación",
  api_key: "API Key",
  bearer: "Bearer Token",
  oauth2: "OAuth 2.0",
  basic: "Basic Auth",
  endpoint_auth: "Auth por endpoint",
};

export default function APIs() {
  const { data: apis = [], isLoading, refetch } = useExternalAPIs();
  const create = useCreateExternalAPI();
  const test = useTestExternalAPI();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [authType, setAuthType] = useState("none");

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminPageMotion>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">APIs externas</CardTitle>
            <CardDescription>Conexiones que tus agentes usan vía funciones.</CardDescription>
          </div>
          <div className="flex items-start gap-2 shrink-0">
            <StudioBranchFilter />
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nueva
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apis.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay APIs. Crea la primera.
            </div>
          )}
          {apis.map((api) => (
            <div
              key={api.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{api.name}</span>
                    <Badge
                      variant={api.is_active ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {api.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type} ·{" "}
                    {api.base_url ?? "Sin URL"}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  title="Test connection"
                  disabled={test.isPending}
                  onClick={() =>
                    test.mutate(String(api.id), {
                      onSuccess: (r) => toast.success(JSON.stringify(r)),
                      onError: () => toast.error("Test falló"),
                    })
                  }
                >
                  <FlaskConical className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to={`/apis/${api.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva API externa</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate(
                {
                  name,
                  base_url: baseUrl,
                  auth_type: authType as "none",
                  is_active: true,
                },
                {
                  onSuccess: () => {
                    toast.success("API creada");
                    setOpen(false);
                    setName("");
                    setBaseUrl("");
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
              <Label>Base URL</Label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Auth</Label>
              <Select value={authType} onValueChange={setAuthType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AUTH_TYPE_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
