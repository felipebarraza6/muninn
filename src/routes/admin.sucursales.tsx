import { useState } from "react";
import { Building2, Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useAdminBranches,
  useCreateBranch,
  useUpdateBranch,
  type AdminBranch,
} from "@/api/hooks/useBranches";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { toast } from "sonner";

export default function AdminSucursalesPage() {
  const { data: branches = [], isLoading } = useAdminBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBranch | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [fantasyName, setFantasyName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [active, setActive] = useState(true);

  const openCreate = () => {
    setEditing(null);
    setBusinessName("");
    setFantasyName("");
    setCustomDomain("");
    setActive(true);
    setOpen(true);
  };

  const openEdit = (b: AdminBranch) => {
    setEditing(b);
    setBusinessName(b.business_name || "");
    setFantasyName(b.fantasy_name || "");
    setCustomDomain(b.custom_domain || "");
    setActive(b.is_active !== false);
    setOpen(true);
  };

  const save = () => {
    if (!businessName.trim()) {
      toast.error("Nombre comercial requerido");
      return;
    }
    const payload: Partial<AdminBranch> = {
      business_name: businessName.trim(),
      fantasy_name: fantasyName.trim() || null,
      custom_domain: customDomain.trim() || null,
      is_active: active,
    };
    if (editing) {
      updateBranch.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Sucursal actualizada");
            setOpen(false);
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al guardar"),
        },
      );
    } else {
      createBranch.mutate(payload, {
        onSuccess: () => {
          toast.success(
            "Sucursal creada. Cambia la sucursal activa en el switcher para ver sus agentes.",
          );
          setOpen(false);
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 flex justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminPageMotion>
      <AdminMotionItem>
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sucursales</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Cada sucursal es independiente (agentes vía branch activa). El dominio es opcional y{" "}
              <strong className="font-medium text-foreground">no se hereda</strong> de otra sucursal
              — la API no tiene jerarquía padre/hijo.
            </p>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" /> Nueva
          </Button>
        </header>
      </AdminMotionItem>

      <AdminMotionItem>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Listado</CardTitle>
            <CardDescription>
              Tras crear, usa el selector de sucursal del header para operar en ella.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminMotionList className="space-y-2">
              {branches.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">Sin sucursales.</p>
              )}
              {branches.map((b) => (
                <AdminMotionItem key={String(b.id)}>
                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{b.business_name}</span>
                          <Badge
                            variant={b.is_active !== false ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {b.is_active !== false ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {b.fantasy_name ? `${b.fantasy_name} · ` : ""}
                          {b.custom_domain || "Sin custom_domain"}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEdit(b)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </AdminMotionItem>
              ))}
            </AdminMotionList>
          </CardContent>
        </Card>
      </AdminMotionItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar sucursal" : "Nueva sucursal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nombre comercial</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div>
              <Label>Nombre fantasía (opcional)</Label>
              <Input value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} />
            </div>
            <div>
              <Label>Dominio custom (opcional)</Label>
              <Input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="cliente.ejemplo.com"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Si queda vacío, no hereda de otra sucursal.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Activa
            </label>
            <Button
              className="w-full"
              onClick={save}
              disabled={createBranch.isPending || updateBranch.isPending}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
