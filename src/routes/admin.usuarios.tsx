import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Copy, KeyRound, Loader2, Pencil, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAssignUserToBranch,
  useCreateAndAssignUser,
  useAdminUsers,
  useDeleteAdminUser,
  useGenerateUserPassword,
  useUpdateAdminUser,
  type AdminUser,
} from "@/api/hooks/useUsers";
import {
  FALLBACK_BRANCH_ROLES,
  useAdminBranches,
  useBranchRoles,
  useBranchUsers,
  useDeleteBranchUser,
  useMyBranchesSelect,
  useOrganizations,
} from "@/api/hooks/useBranches";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { isSuperAdmin } from "@/lib/authGuards";
import { copyToClipboard, generateMemorablePassword } from "@/lib/password";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALL = "all";

const tableBodyVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.028, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" as const },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.18, ease: "easeOut" as const },
  },
};

function displayName(u: AdminUser) {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name || u.username || u.email;
}

export default function AdminUsuariosPage() {
  const canCreateRoot = isSuperAdmin();
  const reduceMotion = useReducedMotion();
  const { data: myBranches = [] } = useMyBranchesSelect();
  const { data: adminBranches = [] } = useAdminBranches();
  const { data: organizations = [] } = useOrganizations();
  const { data: assignments = [] } = useBranchUsers();

  const [branchFilter, setBranchFilter] = useState(ALL);
  const [orgFilter, setOrgFilter] = useState(ALL);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const searchPending = search !== deferredSearch;

  const { data: users = [], isLoading: usersLoading } = useAdminUsers();

  const createUser = useCreateAndAssignUser();
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();
  const assignUser = useAssignUserToBranch();
  const deleteAssignment = useDeleteBranchUser();
  const generatePassword = useGenerateUserPassword();

  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [active, setActive] = useState(true);
  const [isRoot, setIsRoot] = useState(false);
  const [createBranchId, setCreateBranchId] = useState("");
  const [createRoleCode, setCreateRoleCode] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignBranchId, setAssignBranchId] = useState("");
  const [assignRoleCode, setAssignRoleCode] = useState("");

  const roleBranchId = open && !editing ? createBranchId : assignBranchId;
  const { data: roles = FALLBACK_BRANCH_ROLES } = useBranchRoles(roleBranchId || null);

  const [revealOpen, setRevealOpen] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState("");
  const [revealedUserLabel, setRevealedUserLabel] = useState("");

  /** Sucursales visibles: switcher (multi-branch) + admin list (Root). */
  const branchOptions = useMemo(() => {
    const map = new Map<string, { id: string; label: string; orgId?: string; orgName?: string }>();

    for (const b of myBranches) {
      map.set(String(b.value), {
        id: String(b.value),
        label: b.label,
      });
    }

    for (const b of adminBranches) {
      const id = String(b.id);
      const prev = map.get(id);
      map.set(id, {
        id,
        label: prev?.label || b.business_name || b.fantasy_name || `Sucursal ${id}`,
        orgId: b.organization != null ? String(b.organization) : prev?.orgId,
        orgName: b.organization_name || prev?.orgName,
      });
    }

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [myBranches, adminBranches]);

  const branchMeta = useMemo(() => {
    const map = new Map(branchOptions.map((b) => [b.id, b]));
    return map;
  }, [branchOptions]);

  const assignmentsByUser = useMemo(() => {
    const map = new Map<string, typeof assignments>();
    for (const a of assignments) {
      if (a.is_active === false) continue;
      const key = String(a.user);
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [assignments]);

  const filteredUsers = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();

    return users.filter((u) => {
      if (q) {
        const haystack = [u.email, u.username, u.first_name, u.last_name, u.dni]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      const userAssignments = assignmentsByUser.get(String(u.id)) ?? [];

      if (branchFilter !== ALL) {
        const inBranch = userAssignments.some((a) => String(a.branch) === branchFilter);
        if (!inBranch) return false;
      }

      if (orgFilter !== ALL) {
        const inOrg = userAssignments.some(
          (a) => branchMeta.get(String(a.branch))?.orgId === orgFilter,
        );
        if (!inOrg) return false;
      }

      return true;
    });
  }, [users, deferredSearch, branchFilter, orgFilter, assignmentsByUser, branchMeta]);

  const tableContentKey = `${branchFilter}|${orgFilter}|${deferredSearch.trim().toLowerCase()}`;

  const openCreate = () => {
    setEditing(null);
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setDni("");
    setPassword(generateMemorablePassword());
    setShowPassword(true);
    setActive(true);
    setIsRoot(false);
    setCreateBranchId(branchFilter !== ALL ? branchFilter : "");
    setCreateRoleCode("");
    setOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setEmail(u.email || "");
    setUsername(u.username || "");
    setFirstName(u.first_name || "");
    setLastName(u.last_name || "");
    setDni(u.dni || "");
    setPassword("");
    setShowPassword(false);
    setActive(u.is_active !== false);
    setIsRoot(Boolean(u.is_superuser));
    setCreateBranchId("");
    setCreateRoleCode("");
    setOpen(true);
  };

  const handleCopyPassword = async (value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) toast.success("Contraseña copiada");
    else toast.error("No se pudo copiar");
  };

  const handleResetPassword = (u: AdminUser) => {
    setResettingId(String(u.id));
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
      onSettled: () => setResettingId(null),
    });
  };

  const handleDelete = (u: AdminUser) => {
    if (
      !window.confirm(
        `¿Desactivar a ${displayName(u)}?\nQuedará inactivo (soft delete); no se borra de la base.`,
      )
    ) {
      return;
    }
    setDeletingId(String(u.id));
    deleteUser.mutate(u.id, {
      onSuccess: () => toast.success("Usuario desactivado"),
      onError: (e) =>
        toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo desactivar"),
      onSettled: () => setDeletingId(null),
    });
  };

  const saveUser = () => {
    if (!email.trim()) {
      toast.error("Email requerido");
      return;
    }
    if (!dni.trim()) {
      toast.error("RUT / DNI requerido (formato 12.345.678-9)");
      return;
    }

    if (editing) {
      updateUser.mutate(
        {
          id: editing.id,
          data: {
            email: email.trim(),
            username: username.trim() || email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            dni: dni.trim(),
            is_active: active,
            ...(password.trim() ? { password: password.trim() } : {}),
          },
        },
        {
          onSuccess: () => {
            toast.success("Usuario actualizado");
            setOpen(false);
          },
          onError: (e) =>
            toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error"),
        },
      );
      return;
    }

    if (!password.trim()) {
      toast.error("Contraseña requerida");
      return;
    }
    if (!isRoot && (!createBranchId || !createRoleCode)) {
      toast.error("Elige sucursal y rol (o marca Root)");
      return;
    }

    createUser.mutate(
      {
        user_data: {
          email: email.trim(),
          username: username.trim() || undefined,
          password: password.trim(),
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          dni: dni.trim(),
          is_superuser: canCreateRoot && isRoot,
        },
        branch_assignment: isRoot
          ? null
          : {
              branch_id: createBranchId,
              role: createRoleCode,
              is_active: true,
            },
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Usuario creado — guarda la contraseña");
          setOpen(false);
          if (createBranchId) setBranchFilter(String(createBranchId));
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      },
    );
  };

  const saveAssign = () => {
    if (!assignUserId || !assignBranchId || !assignRoleCode) {
      toast.error("Usuario, sucursal y rol son requeridos");
      return;
    }
    assignUser.mutate(
      {
        user_id: assignUserId,
        branch_id: assignBranchId,
        role: assignRoleCode,
        is_active: true,
      },
      {
        onSuccess: () => {
          toast.success("Usuario asignado a la sucursal");
          setAssignOpen(false);
          setBranchFilter(String(assignBranchId));
        },
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage ||
              "No se pudo asignar (revisa permisos / rol)",
          ),
      },
    );
  };

  const removeAssignment = (assignmentId: string | number, label: string) => {
    if (!window.confirm(`¿Quitar acceso a ${label}?`)) return;
    deleteAssignment.mutate(assignmentId, {
      onSuccess: () => toast.success("Acceso removido"),
      onError: (e) =>
        toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo remover"),
    });
  };

  if (usersLoading) {
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
              Cuentas con acceso a sucursales{organizations.length > 0 ? " y organizaciones" : ""}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAssignUserId("");
                setAssignBranchId(branchFilter !== ALL ? branchFilter : "");
                setAssignRoleCode("");
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

      <AdminMotionItem>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Buscar</Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Email, nombre…"
              className="w-[200px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Sucursal</Label>
            <Select
              value={branchFilter}
              onValueChange={(v) => startTransition(() => setBranchFilter(v))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {branchOptions.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {organizations.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Organización</Label>
              <Select
                value={orgFilter}
                onValueChange={(v) => startTransition(() => setOrgFilter(v))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {organizations.map((o) => (
                    <SelectItem key={String(o.id)} value={String(o.id)}>
                      {o.name || o.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <span className="text-xs text-muted-foreground pb-2">
            {filteredUsers.length} usuario{filteredUsers.length === 1 ? "" : "s"}
          </span>
        </div>
      </AdminMotionItem>

      <AdminMotionItem>
        <div
          className={cn(
            "rounded-lg border border-border overflow-hidden transition-opacity duration-150",
            searchPending && "opacity-70",
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden md:table-cell">RUT</TableHead>
                <TableHead>Sucursales</TableHead>
                <TableHead className="hidden lg:table-cell">Organización</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right w-[140px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <AnimatePresence mode="wait" initial={false}>
              <motion.tbody
                key={tableContentKey}
                className="[&_tr:last-child]:border-0"
                variants={reduceMotion ? undefined : tableBodyVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                exit={reduceMotion ? undefined : "exit"}
              >
                {filteredUsers.length === 0 ? (
                  <motion.tr
                    variants={reduceMotion ? undefined : tableRowVariants}
                    className="border-b transition-colors"
                  >
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No hay usuarios con esos filtros.
                    </TableCell>
                  </motion.tr>
                ) : (
                  filteredUsers.map((u) => {
                    const userAssignments = assignmentsByUser.get(String(u.id)) ?? [];
                    const orgs = [
                      ...new Set(
                        userAssignments
                          .map((a) => branchMeta.get(String(a.branch))?.orgName)
                          .filter(Boolean),
                      ),
                    ] as string[];

                    return (
                      <motion.tr
                        key={String(u.id)}
                        variants={reduceMotion ? undefined : tableRowVariants}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium truncate">{displayName(u)}</span>
                              {u.is_superuser && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Root
                                </Badge>
                              )}
                              {u.is_multi_branch && (
                                <Badge variant="outline" className="text-[10px]">
                                  Multi
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                          {u.dni || "—"}
                        </TableCell>
                        <TableCell>
                          {userAssignments.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {u.is_superuser ? "Global" : "Sin asignación"}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-w-[280px]">
                              {userAssignments.map((a) => {
                                const label = `${a.branch_name || branchMeta.get(String(a.branch))?.label || a.branch}${
                                  a.role_name || a.role_code
                                    ? ` · ${a.role_name || a.role_code}`
                                    : ""
                                }`;
                                return (
                                  <button
                                    key={String(a.id)}
                                    type="button"
                                    title="Quitar acceso"
                                    onClick={() => removeAssignment(a.id, label)}
                                    className="text-[11px] text-muted-foreground border border-border/80 rounded px-1.5 py-0.5 hover:border-destructive/50 hover:text-destructive transition-colors"
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {orgs.length > 0 ? orgs.join(", ") : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.is_active !== false ? "default" : "outline"}
                            className="text-[10px]"
                          >
                            {u.is_active !== false ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              title="Reiniciar contraseña"
                              disabled={resettingId === String(u.id)}
                              onClick={() => handleResetPassword(u)}
                            >
                              {resettingId === String(u.id) ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <KeyRound className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              title="Editar"
                              onClick={() => openEdit(u)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              title="Desactivar"
                              disabled={deletingId === String(u.id)}
                              onClick={() => handleDelete(u)}
                            >
                              {deletingId === String(u.id) ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </motion.tbody>
            </AnimatePresence>
          </Table>
        </div>
      </AdminMotionItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <Label>Username (opcional)</Label>
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
              <Label>RUT / DNI</Label>
              <Input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12.345.678-9"
                className="font-mono"
              />
            </div>
            {!editing && (
              <div>
                <Label>Password</Label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="font-mono text-sm"
                  />
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
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Contraseña generada automáticamente — guárdala ahora.
                </p>
              </div>
            )}
            {editing && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Activo
              </label>
            )}
            {!editing && canCreateRoot && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isRoot}
                  onChange={(e) => {
                    setIsRoot(e.target.checked);
                    if (e.target.checked) {
                      setCreateBranchId("");
                      setCreateRoleCode("");
                    }
                  }}
                />
                Root (acceso global, sin sucursal)
              </label>
            )}
            {!editing && !isRoot && (
              <>
                <div>
                  <Label>Sucursal</Label>
                  <Select
                    value={createBranchId}
                    onValueChange={(v) => {
                      setCreateBranchId(v);
                      setCreateRoleCode("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          branchOptions.length === 0
                            ? "Sin sucursales disponibles"
                            : "Selecciona sucursal"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                          {b.orgName ? ` · ${b.orgName}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {branchOptions.length === 0 && (
                    <p className="text-[11px] text-destructive mt-1">
                      No hay sucursales en tu contexto. Revisa permisos o el selector del header.
                    </p>
                  )}
                </div>
                <div>
                  <Label>Rol en la sucursal</Label>
                  <Select
                    value={createRoleCode}
                    onValueChange={setCreateRoleCode}
                    disabled={!createBranchId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={createBranchId ? "Selecciona rol" : "Primero sucursal"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles.length ? roles : FALLBACK_BRANCH_ROLES).map((r) => {
                        const code = r.code || String(r.id);
                        return (
                          <SelectItem key={code} value={code}>
                            {r.name || code}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button
              className="w-full"
              onClick={saveUser}
              disabled={createUser.isPending || updateUser.isPending}
            >
              {createUser.isPending || updateUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
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
            <p className="text-sm text-muted-foreground">
              Define en qué sucursal puede trabajar el usuario y con qué rol.
            </p>
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
                  setAssignRoleCode("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label}
                      {b.orgName ? ` · ${b.orgName}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rol</Label>
              <Select
                value={assignRoleCode}
                onValueChange={setAssignRoleCode}
                disabled={!assignBranchId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={assignBranchId ? "Selecciona rol" : "Primero sucursal"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(roles.length ? roles : FALLBACK_BRANCH_ROLES).map((r) => {
                    const code = r.code || String(r.id);
                    return (
                      <SelectItem key={code} value={code}>
                        {r.name || code}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={saveAssign} disabled={assignUser.isPending}>
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
