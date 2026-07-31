import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  Loader2,
  Network,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  type BranchAssignment,
} from "@/api/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getStoredBranches, getStoredUser } from "@/lib/authSession";
import { motionTokens } from "@/lib/motion";
import {
  canAccessBranchesAdmin,
  canAccessLlmAdmin,
  canAccessOrganizationsAdmin,
  canAccessUsersAdmin,
  getBranchesAdminNavLabel,
  getOrganizationsAdminNavLabel,
  getPrimaryOrganizationName,
  isMultiBranchUser,
  isOrganizationOwner,
  isSuperAdmin,
} from "@/lib/authGuards";
import { toast } from "sonner";

function roleLabel(assignment: BranchAssignment): string {
  const code = String(assignment.role_code || assignment.role || "").toUpperCase();
  if (code === "ORG_OWNER") return "Organizador";
  if (code === "OWNER") return "Propietario";
  if (code === "ADMIN_LOCAL") return "Administrador local";
  return assignment.role_name || assignment.role_display || code || "Miembro";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}

export default function PerfilPage() {
  const storedUser = getStoredUser();
  const storedBranches = getStoredBranches().filter((b) => b.is_active !== false);
  const { data: apiProfile, isLoading } = useProfile();
  const profile = apiProfile ?? storedUser;
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dni, setDni] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setEmail(profile.email || "");
    setUsername(profile.username || "");
    setDni(profile.dni || "");
  }, [profile]);

  const assignments = useMemo(() => {
    const fromApi = apiProfile?.branch_assignments ?? [];
    return fromApi.length > 0 ? fromApi : storedBranches;
  }, [apiProfile?.branch_assignments, storedBranches]);

  const globalAdmin = isSuperAdmin();
  const organizationOwner = isOrganizationOwner();
  const multiBranch = isMultiBranchUser();
  const orgName = getPrimaryOrganizationName();
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    profile?.username ||
    profile?.email ||
    "Usuario";
  const initials =
    `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase() ||
    profile?.username?.[0]?.toUpperCase() ||
    "U";

  const accountRole = globalAdmin
    ? "Administrador global"
    : organizationOwner
      ? "Organizador"
      : assignments.length > 0
        ? roleLabel(assignments[0])
        : "Usuario";

  const quickLinks = [
    canAccessOrganizationsAdmin()
      ? {
          to: "/app/admin/organizaciones",
          label: getOrganizationsAdminNavLabel(),
          icon: Network,
        }
      : null,
    canAccessBranchesAdmin()
      ? {
          to: "/app/admin/sucursales",
          label: getBranchesAdminNavLabel(),
          icon: Building2,
        }
      : null,
    canAccessUsersAdmin() ? { to: "/app/admin/usuarios", label: "Usuarios", icon: Users } : null,
    canAccessLlmAdmin() ? { to: "/app/admin/llm", label: "LLM", icon: ShieldCheck } : null,
  ].filter(Boolean) as Array<{
    to: string;
    label: string;
    icon: typeof Building2;
  }>;

  const saveProfile = () => {
    if (!email.trim() || !username.trim()) {
      toast.error("Correo y usuario son requeridos");
      return;
    }
    updateProfile.mutate(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        dni: dni.trim(),
      },
      {
        onSuccess: () => toast.success("Perfil actualizado"),
        onError: (error) =>
          toast.error(
            (error as { friendlyMessage?: string }).friendlyMessage ||
              "No se pudo actualizar el perfil",
          ),
      },
    );
  };

  const savePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa los tres campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    changePassword.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: (data) => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast.success(data.message || "Contraseña actualizada");
        },
        onError: (error) =>
          toast.error(
            (error as { friendlyMessage?: string }).friendlyMessage ||
              "No se pudo cambiar la contraseña",
          ),
      },
    );
  };

  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isLoading && !profile ? (
        <motion.div
          key="skeleton"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.base }}
        >
          <PageSkeleton variant="profile" />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.base, ease: motionTokens.easePage }}
          className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 md:px-6 lg:px-8"
        >
          <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-14 w-14 border border-border">
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight">{displayName}</h1>
                <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{accountRole}</Badge>
                  {multiBranch && !globalAdmin && <Badge variant="outline">Multi-sucursal</Badge>}
                  {profile?.is_active !== false && (
                    <Badge variant="outline" className="gap-1 text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" /> Activo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {orgName && !globalAdmin && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <Network className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Holding
                  </p>
                  <p className="font-medium">{orgName}</p>
                </div>
              </div>
            )}
          </section>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserRound className="h-4 w-4 text-primary" /> Datos personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Nombre</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Apellido</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Correo</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Usuario</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>RUT / DNI</Label>
                    <Input value={dni} onChange={(e) => setDni(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Button onClick={saveProfile} disabled={updateProfile.isPending}>
                      {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="h-4 w-4 text-primary" /> Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Cambia tu contraseña ingresando primero la contraseña actual.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Contraseña actual</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Nueva contraseña</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Confirmar</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={savePassword}
                    disabled={changePassword.isPending}
                  >
                    {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Actualizar contraseña
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Acceso y rol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo de cuenta</p>
                    <p className="text-sm font-medium">{accountRole}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Último acceso</p>
                    <p className="text-sm">{formatDate(profile?.last_login)}</p>
                  </div>
                  {quickLinks.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        {quickLinks.map(({ to, label, icon: Icon }) => (
                          <Button key={to} variant="ghost" className="w-full justify-start" asChild>
                            <Link to={to}>
                              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {label}
                              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {!globalAdmin && assignments.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {multiBranch ? "Mis sucursales" : "Mi sucursal"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {assignments.map((assignment) => (
                      <div
                        key={`${assignment.branch_id}-${assignment.role_code || assignment.role}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {assignment.branch_name ||
                              assignment.business_name ||
                              `Sucursal ${assignment.branch_id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{roleLabel(assignment)}</p>
                        </div>
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
