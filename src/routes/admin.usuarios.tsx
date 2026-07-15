import { useState } from "react";
import { Copy, KeyRound, Loader2, Pencil, Plus, RefreshCw, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  useCreateAdminUser,
  useAdminUsers,
  useGenerateUserPassword,
  useUpdateAdminUser,
  type AdminUser,
} from "@/api/hooks/useUsers";
import {
  useAdminBranches,
  useBranchRoles,
  useBranchUsers,
  useCreateBranchUser,
} from "@/api/hooks/useBranches";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { copyToClipboard, generateMemorablePassword } from "@/lib/password";
import { toast } from "sonner";

export default function AdminUsuariosPage() {
  const { data: users = [], isLoading } = useAdminUsers();
  const { data: assignments = [] } = useBranchUsers();
  const { data: branches = [] } = useAdminBranches();
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();
  const createAssignment = useCreateBranchUser();
  const generatePassword = useGenerateUserPassword();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [active, setActive] = useState(true);
  const [superuser, setSuperuser] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState<string>("");
  const [assignBranchId, setAssignBranchId] = useState<string>("");
  const { data: roles = [] } = useBranchRoles(assignBranchId || null);
  const [assignRoleId, setAssignRoleId] = useState<string>("");

  const [revealOpen, setRevealOpen] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState("");
  const [revealedUserLabel, setRevealedUserLabel] = useState("");

  const openCreate = () => {
    setEditing(null);
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword(generateMemorablePassword());
    setShowPassword(true);
    setActive(true);
    setSuperuser(false);
    setOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setEmail(u.email || "");
    setUsername(u.username || "");
    setFirstName(u.first_name || "");
    setLastName(u.last_name || "");
    setPassword("");
    setShowPassword(false);
    setActive(u.is_active !== false);
    setSuperuser(Boolean(u.is_superuser));
    setOpen(true);
  };

  const handleCopyPassword = async (value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) toast.success("Contraseña copiada");
    else toast.error("No se pudo copiar");
  };

  const handleResetPassword = (u: AdminUser) => {
    generatePassword.mutate(u.id, {
      onSuccess: (data) => {
        setRevealedPassword(data.new_password);
        setRevealedUserLabel(u.email || u.username || String(u.id));
        setRevealOpen(true);
        toast.success("Contraseña reiniciada");
      },
      onError: (e) =>
        toast.error(
          (e as { friendlyMessage?: string }).friendlyMessage || "No se pudo generar la contraseña",
        ),
    });
  };

  const saveUser = () => {
    if (!email.trim()) {
      toast.error("Email requerido");
      return;
    }
    const payload: Partial<AdminUser> & { password?: string } = {
      email: email.trim(),
      username: username.trim() || email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      is_active: active,
      is_superuser: superuser,
    };
    if (password.trim()) payload.password = password.trim();

    if (editing) {
      updateUser.mutate(
        { id: editing.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Usuario actualizado");
            setOpen(false);
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error"),
        },
      );
    } else {
      if (!password.trim()) {
        toast.error("Password requerido al crear");
        return;
      }
      createUser.mutate(payload, {
        onSuccess: () => {
          toast.success("Usuario creado — guarda la contraseña");
          setOpen(false);
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      });
    }
  };

  const saveAssign = () => {
    if (!assignUserId || !assignBranchId || !assignRoleId) {
      toast.error("Usuario, sucursal y rol son requeridos");
      return;
    }
    createAssignment.mutate(
      {
        user: assignUserId,
        branch: assignBranchId,
        role_definition: assignRoleId,
        is_active: true,
      },
      {
        onSuccess: () => {
          toast.success("Asignación creada");
          setAssignOpen(false);
        },
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage ||
              "No se pudo asignar (revisa permisos / rol)",
          ),
      },
    );
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
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Usuarios</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestión de cuentas y asignaciones a sucursales.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAssignUserId("");
                setAssignBranchId("");
                setAssignRoleId("");
                setAssignOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-1.5" /> Asignar a sucursal
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo
            </Button>
          </div>
        </header>
      </AdminMotionItem>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminMotionItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cuentas</CardTitle>
              <CardDescription>{users.length} usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMotionList className="space-y-2">
                {users.map((u) => (
                  <AdminMotionItem key={String(u.id)}>
                    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm truncate">
                              {u.first_name || u.username || u.email}
                            </span>
                            {u.is_superuser && <Badge className="text-[10px]">Superadmin</Badge>}
                            <Badge
                              variant={u.is_active !== false ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {u.is_active !== false ? "Activo" : "Off"}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {u.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title="Reiniciar contraseña"
                          disabled={generatePassword.isPending}
                          onClick={() => handleResetPassword(u)}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </AdminMotionItem>
                ))}
              </AdminMotionList>
            </CardContent>
          </Card>
        </AdminMotionItem>

        <AdminMotionItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Asignaciones</CardTitle>
              <CardDescription>
                BranchUser activos (filtrados por branch del header si aplica).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMotionList className="space-y-2">
                {assignments.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Sin asignaciones.
                  </p>
                )}
                {assignments.map((a) => (
                  <AdminMotionItem key={String(a.id)}>
                    <div className="rounded-lg border p-3 text-sm">
                      <div className="font-medium truncate">
                        {a.user_name || a.user_email || a.user}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {a.branch_name || a.branch} · {a.role_name || a.role_code || "rol"}
                      </div>
                    </div>
                  </AdminMotionItem>
                ))}
              </AdminMotionList>
            </CardContent>
          </Card>
        </AdminMotionItem>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Nombre</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>{editing ? "Password (opcional)" : "Password"}</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="font-mono text-sm"
                />
                {!editing && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      title="Generar"
                      onClick={() => {
                        setPassword(generateMemorablePassword());
                        setShowPassword(true);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      title="Copiar"
                      disabled={!password}
                      onClick={() => handleCopyPassword(password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {!editing && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  Contraseña generada automáticamente — guárdala ahora.
                </p>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={superuser}
                onChange={(e) => setSuperuser(e.target.checked)}
              />
              Superadmin
            </label>
            <Button
              className="w-full"
              onClick={saveUser}
              disabled={createUser.isPending || updateUser.isPending}
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar a sucursal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Usuario</Label>
              <Select value={assignUserId} onValueChange={setAssignUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={String(u.id)} value={String(u.id)}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sucursal</Label>
              <Select
                value={assignBranchId}
                onValueChange={(v) => {
                  setAssignBranchId(v);
                  setAssignRoleId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={String(b.id)} value={String(b.id)}>
                      {b.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rol</Label>
              <Select
                value={assignRoleId}
                onValueChange={setAssignRoleId}
                disabled={!assignBranchId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={assignBranchId ? "Selecciona rol" : "Primero sucursal"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={String(r.id)} value={String(r.id)}>
                      {r.name || r.code || String(r.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={saveAssign} disabled={createAssignment.isPending}>
              Asignar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={revealOpen}
        onOpenChange={(v) => {
          setRevealOpen(v);
          if (!v) setRevealedPassword("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva contraseña</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Contraseña para{" "}
              <span className="text-foreground font-medium">{revealedUserLabel}</span>. Solo se
              muestra una vez.
            </p>
            <div className="flex gap-2">
              <Input value={revealedPassword} readOnly className="font-mono text-sm" />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => handleCopyPassword(revealedPassword)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full" onClick={() => setRevealOpen(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMotion>
  );
}
