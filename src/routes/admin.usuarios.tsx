import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  KeyRound,
  Loader2,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useAssignUserToBranch,
  useChangeUserRole,
  useCreateAndAssignUser,
  useAdminUsers,
  useDeleteAdminUser,
  useGenerateUserPassword,
  useToggleUserGlobalStatus,
  useUpdateAdminUser,
  type AdminUser,
  type GeneratePasswordResponse,
} from "@/api/hooks/useUsers";
import {
  FALLBACK_BRANCH_ROLES,
  type BranchRole,
  useAdminBranches,
  useBranchRoles,
  useBranchUsers,
  useDeleteBranchUser,
  useMyBranchesSelect,
  useOrganizations,
} from "@/api/hooks/useBranches";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { copyToClipboard, generateSecurePassword } from "@/lib/password";
import {
  canManageBranchUsers,
  canMutateUsersAdmin,
  getManagedBranchIds,
  getOwnerBranchIds,
  isOrganizationOwner,
  isSuperAdmin,
  showBranchFilterUI,
} from "@/lib/authGuards";
import { GLOBAL_BRANCH_ID } from "@/lib/branchStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALL = GLOBAL_BRANCH_ID;
const PAGE_SIZE = 10;

type PanelMode = "edit" | "assign";

/** Borrador de asignación sucursal+rol en el panel de editar/crear. */
type DraftAssignment = {
  key: string;
  assignmentId: string | null;
  branchId: string;
  roleCode: string;
};

type ConfirmAction =
  | { type: "delete"; user: AdminUser }
  | { type: "toggle"; user: AdminUser }
  | { type: "unassign"; assignmentId: string | number; label: string }
  | { type: "regenPassword"; user: AdminUser };

let draftKeySeq = 0;
function nextDraftKey() {
  draftKeySeq += 1;
  return `draft-${draftKeySeq}`;
}

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

/** Local-part del correo limpio (solo a-z0-9), para preview / paridad con el API. */
function usernameBaseFromEmail(emailValue: string): string {
  const local = emailValue.trim().split("@")[0] || "";
  return local.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
}

export default function AdminUsuariosPage() {
  const reduceMotion = useReducedMotion();
  const qc = useQueryClient();
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const canMutate = canMutateUsersAdmin();
  const managedBranchIdSet = useMemo(() => {
    if (isGlobalAdmin) return null;
    const ids = getManagedBranchIds();
    // Organizador sin IDs en sesión: no filtrar con Set vacío (borra todas las opciones).
    if (isOrgOwner && ids.length === 0) return null;
    return new Set(ids);
  }, [isGlobalAdmin, isOrgOwner]);
  const ownerBranchIdSet = useMemo(() => {
    if (isGlobalAdmin) return null;
    const ids = getOwnerBranchIds();
    if (isOrgOwner && ids.length === 0) return null;
    return new Set(ids);
  }, [isGlobalAdmin, isOrgOwner]);

  const showBranchFilter = showBranchFilterUI();
  const { data: myBranches = [] } = useMyBranchesSelect();
  const { data: adminBranches = [] } = useAdminBranches({
    enabled: isGlobalAdmin,
    refetchOnMount: isGlobalAdmin ? "always" : false,
  });
  const { data: organizations = [] } = useOrganizations({
    enabled: isGlobalAdmin,
    refetchOnMount: isGlobalAdmin ? "always" : false,
  });
  const { data: assignments = [] } = useBranchUsers({ allBranches: true });

  const [branchFilter, setBranchFilter] = useState(ALL);
  const [orgFilter, setOrgFilter] = useState(ALL);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const searchPending = search !== deferredSearch;
  const [page, setPage] = useState(1);
  const [fabOpen, setFabOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sin multi-sucursal: fijar filtro a la única sucursal gestionable (sin UI de filtro).
  useEffect(() => {
    if (showBranchFilter) return;
    if (!managedBranchIdSet || managedBranchIdSet.size === 0) {
      setBranchFilter(ALL);
      return;
    }
    const only = Array.from(managedBranchIdSet)[0];
    setBranchFilter(only);
  }, [showBranchFilter, managedBranchIdSet]);

  const { data: users = [], isLoading: usersLoading, isFetching: usersFetching } = useAdminUsers();

  const createUser = useCreateAndAssignUser();
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();
  const toggleGlobalStatus = useToggleUserGlobalStatus();
  const assignUser = useAssignUserToBranch();
  const changeUserRole = useChangeUserRole();
  const deleteAssignment = useDeleteBranchUser();
  const generatePassword = useGenerateUserPassword();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["accounts", "users"] }),
        qc.invalidateQueries({ queryKey: ["branches", "users"] }),
        qc.invalidateQueries({ queryKey: ["branches", "roles"] }),
        qc.invalidateQueries({ queryKey: ["branches", "organizations"] }),
      ]);
    } finally {
      setRefreshing(false);
      setFabOpen(false);
    }
  };

  const [resettingId, setResettingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("edit");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isMultiBranch, setIsMultiBranch] = useState(false);
  const [createBranchId, setCreateBranchId] = useState("");
  const [createRoleCode, setCreateRoleCode] = useState("");
  /** Asignaciones en el panel (1 si no multi; varias si multi). */
  const [draftAssignments, setDraftAssignments] = useState<DraftAssignment[]>([]);
  /** Snapshot al abrir editar (para sync al guardar). */
  const [initialAssignments, setInitialAssignments] = useState<DraftAssignment[]>([]);

  const [assignUserId, setAssignUserId] = useState("");
  const [assignBranchId, setAssignBranchId] = useState("");
  const [assignRoleCode, setAssignRoleCode] = useState("");

  const roleBranchId =
    panelOpen && panelMode === "edit"
      ? draftAssignments[0]?.branchId || createBranchId
      : panelOpen && panelMode === "assign"
        ? assignBranchId
        : "";
  const { data: roles = [], isFetching: rolesLoading } = useBranchRoles(roleBranchId || null);

  const muninnRoles = useMemo((): BranchRole[] => {
    const base = roles.length ? roles : FALLBACK_BRANCH_ROLES;
    return base.length ? base : FALLBACK_BRANCH_ROLES;
  }, [roles]);

  const [revealOpen, setRevealOpen] = useState(false);
  const [revealed, setRevealed] = useState<GeneratePasswordResponse | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  /** Sucursales visibles: switcher (multi-branch) + admin list (Root). */
  const assignmentsByUser = useMemo(() => {
    const map = new Map<string, typeof assignments>();
    for (const a of assignments) {
      if (a.is_active === false) continue;
      if (managedBranchIdSet && !managedBranchIdSet.has(String(a.branch))) continue;
      const key = String(a.user);
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [assignments, managedBranchIdSet]);

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

    // Asegurar que las sucursales del borrador existan en el select.
    if (editing) {
      for (const d of draftAssignments) {
        if (!d.branchId || map.has(d.branchId)) continue;
        const fromAssign = (assignmentsByUser.get(String(editing.id)) ?? []).find(
          (a) => String(a.branch) === d.branchId,
        );
        map.set(d.branchId, {
          id: d.branchId,
          label: fromAssign?.branch_name || `Sucursal ${d.branchId}`,
        });
      }
    }

    return Array.from(map.values())
      .filter((b) => !managedBranchIdSet || managedBranchIdSet.has(b.id))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [myBranches, adminBranches, editing, draftAssignments, assignmentsByUser, managedBranchIdSet]);

  /** Sucursales donde el usuario actual puede crear/editar (OWNER). */
  const editableBranchOptions = useMemo(() => {
    if (!ownerBranchIdSet) return branchOptions;
    return branchOptions.filter((b) => ownerBranchIdSet.has(b.id));
  }, [branchOptions, ownerBranchIdSet]);

  /** Bloquear select solo si ya tiene sucursal y no es multi. Sin sucursal → siempre editable. */
  const primaryDraft = draftAssignments[0];

  const currentBranchLabel = useMemo(() => {
    const id = primaryDraft?.branchId || "";
    if (!id) return "Sin sucursal";
    const fromOptions = branchOptions.find((b) => b.id === id);
    if (fromOptions) {
      return fromOptions.orgName
        ? `${fromOptions.label} · ${fromOptions.orgName}`
        : fromOptions.label;
    }
    if (editing) {
      const fromAssign = (assignmentsByUser.get(String(editing.id)) ?? []).find(
        (a) => String(a.branch) === id,
      );
      if (fromAssign?.branch_name) return fromAssign.branch_name;
    }
    return `Sucursal ${id}`;
  }, [primaryDraft?.branchId, branchOptions, editing, assignmentsByUser]);

  const branchMeta = useMemo(() => {
    const map = new Map(branchOptions.map((b) => [b.id, b]));
    return map;
  }, [branchOptions]);

  /** Organizaciones cuyo owner es el usuario (por id o email). */
  const ownedOrgsByUser = useMemo(() => {
    const byId = new Map<string, typeof organizations>();
    const byEmail = new Map<string, typeof organizations>();
    for (const org of organizations) {
      if (org.owner != null && org.owner !== "") {
        const key = String(org.owner);
        const list = byId.get(key) ?? [];
        list.push(org);
        byId.set(key, list);
      }
      const email = org.owner_email?.trim().toLowerCase();
      if (email) {
        const list = byEmail.get(email) ?? [];
        list.push(org);
        byEmail.set(email, list);
      }
    }
    return { byId, byEmail };
  }, [organizations]);

  const getOwnedOrgs = (u: AdminUser) => {
    const byId = ownedOrgsByUser.byId.get(String(u.id));
    if (byId?.length) return byId;
    const email = u.email?.trim().toLowerCase();
    if (email) return ownedOrgsByUser.byEmail.get(email) ?? [];
    return [];
  };

  const updateDraft = (key: string, patch: Partial<DraftAssignment>) => {
    setDraftAssignments((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };

  const addDraftRow = () => {
    setDraftAssignments((prev) => [
      ...prev,
      { key: nextDraftKey(), assignmentId: null, branchId: "", roleCode: "" },
    ]);
  };

  const removeDraftRow = (key: string) => {
    setDraftAssignments((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.key !== key);
    });
  };

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

      // Owner/admin local: solo usuarios con asignación en sus sucursales.
      if (managedBranchIdSet && userAssignments.length === 0) return false;

      if (branchFilter !== ALL) {
        const inBranch = userAssignments.some((a) => String(a.branch) === branchFilter);
        if (!inBranch) return false;
      }

      if (isGlobalAdmin && orgFilter !== ALL) {
        const inOrgViaBranch = userAssignments.some(
          (a) => branchMeta.get(String(a.branch))?.orgId === orgFilter,
        );
        const ownsFilteredOrg = getOwnedOrgs(u).some((o) => String(o.id) === orgFilter);
        if (!inOrgViaBranch && !ownsFilteredOrg) return false;
      }

      return true;
    });
  }, [
    users,
    deferredSearch,
    branchFilter,
    orgFilter,
    assignmentsByUser,
    branchMeta,
    managedBranchIdSet,
    isGlobalAdmin,
    ownedOrgsByUser,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, safePage]);

  useEffect(() => {
    setPage(1);
  }, [branchFilter, orgFilter, deferredSearch]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const tableContentKey = `${branchFilter}|${orgFilter}|${deferredSearch.trim().toLowerCase()}|${safePage}`;

  const pageFrom = filteredUsers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const pageTo = Math.min(safePage * PAGE_SIZE, filteredUsers.length);

  const closePanel = () => {
    setPanelOpen(false);
    setEditing(null);
    setFabOpen(false);
  };

  const openCreate = () => {
    if (!canMutate) {
      toast.error("Solo el propietario puede crear usuarios");
      return;
    }
    setPanelMode("edit");
    setEditing(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setDni("");
    setPassword(generateSecurePassword());
    setShowPassword(true);
    setIsMultiBranch(false);
    const defaultBranch =
      branchFilter !== ALL && canManageBranchUsers(branchFilter)
        ? branchFilter
        : editableBranchOptions[0]?.id || "";
    const draft: DraftAssignment = {
      key: nextDraftKey(),
      assignmentId: null,
      branchId: defaultBranch,
      roleCode: "",
    };
    setDraftAssignments([draft]);
    setInitialAssignments([]);
    setCreateBranchId(defaultBranch);
    setCreateRoleCode("");
    setPanelOpen(true);
    setFabOpen(false);
  };

  const openEdit = (u: AdminUser) => {
    if (!canMutate) {
      toast.error("Solo el propietario puede editar usuarios");
      return;
    }
    setPanelMode("edit");
    setEditing(u);
    setEmail(u.email || "");
    setFirstName(u.first_name || "");
    setLastName(u.last_name || "");
    setDni(u.dni || "");
    setPassword("");
    setShowPassword(false);
    const multi = Boolean(u.is_multi_branch);
    setIsMultiBranch(multi);

    const list = assignmentsByUser.get(String(u.id)) ?? [];
    const drafts: DraftAssignment[] =
      list.length > 0
        ? list.map((a) => ({
            key: nextDraftKey(),
            assignmentId: String(a.id),
            branchId: String(a.branch),
            roleCode: (a.role_code || "").trim(),
          }))
        : [{ key: nextDraftKey(), assignmentId: null, branchId: "", roleCode: "" }];

    // Si no es multi, solo la del filtro o la primera.
    const visible = multi
      ? drafts
      : [
          branchFilter !== ALL
            ? (drafts.find((d) => d.branchId === branchFilter) ?? drafts[0])
            : drafts[0],
        ];

    setDraftAssignments(visible);
    setInitialAssignments(
      list.map((a) => ({
        key: String(a.id),
        assignmentId: String(a.id),
        branchId: String(a.branch),
        roleCode: (a.role_code || "").trim(),
      })),
    );
    setCreateBranchId(visible[0]?.branchId || "");
    setCreateRoleCode(visible[0]?.roleCode || "");

    setPanelOpen(true);
    setFabOpen(false);
  };

  const openAssignDialog = () => {
    if (!canMutate) {
      toast.error("Solo el propietario puede asignar usuarios");
      return;
    }
    setPanelMode("assign");
    setAssignUserId("");
    setAssignBranchId(
      branchFilter !== ALL && canManageBranchUsers(branchFilter)
        ? branchFilter
        : editableBranchOptions[0]?.id || "",
    );
    setAssignRoleCode("");
    setPanelOpen(true);
    setFabOpen(false);
  };

  const handleCopyPassword = async (value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) toast.success("Contraseña copiada");
    else toast.error("No se pudo copiar");
  };

  const handleCopyEmail = async (value: string) => {
    const emailValue = value.trim();
    if (!emailValue) return;
    const ok = await copyToClipboard(emailValue);
    if (ok) toast.success("Correo copiado");
    else toast.error("No se pudo copiar");
  };

  const handleResetPassword = (u: AdminUser) =>
    setConfirmAction({ type: "regenPassword", user: u });

  const handleDelete = (u: AdminUser) => setConfirmAction({ type: "delete", user: u });

  const handleToggleStatus = (u: AdminUser) => setConfirmAction({ type: "toggle", user: u });

  const removeAssignment = (assignmentId: string | number, label: string) =>
    setConfirmAction({ type: "unassign", assignmentId, label });

  const runConfirmAction = () => {
    if (!confirmAction) return;
    const action = confirmAction;
    setConfirmAction(null);

    if (action.type === "regenPassword") {
      setResettingId(String(action.user.id));
      generatePassword.mutate(action.user.id, {
        onSuccess: (data) => {
          setRevealed(data);
          setRevealOpen(true);
          toast.success(data.message || "Contraseña generada y asignada");
        },
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage ||
              "No se pudo generar la contraseña",
          ),
        onSettled: () => setResettingId(null),
      });
      return;
    }

    if (action.type === "delete") {
      setDeletingId(String(action.user.id));
      deleteUser.mutate(action.user.id, {
        onSuccess: () => toast.success("Usuario desactivado"),
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage || "No se pudo desactivar",
          ),
        onSettled: () => setDeletingId(null),
      });
      return;
    }

    if (action.type === "toggle") {
      setTogglingId(String(action.user.id));
      toggleGlobalStatus.mutate(action.user.id, {
        onSuccess: (res) =>
          toast.success(
            res.message || (res.is_active !== false ? "Usuario activado" : "Usuario desactivado"),
          ),
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage || "No se pudo cambiar el estado",
          ),
        onSettled: () => setTogglingId(null),
      });
      return;
    }

    deleteAssignment.mutate(action.assignmentId, {
      onSuccess: () => toast.success("Acceso removido"),
      onError: (e) =>
        toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo remover"),
    });
  };

  const saveUser = async () => {
    if (!email.trim()) {
      toast.error("Email requerido");
      return;
    }
    if (!dni.trim()) {
      toast.error("RUT / DNI requerido (formato 12.345.678-9)");
      return;
    }

    if (editing) {
      if (!canMutate) {
        toast.error("Solo el propietario puede editar usuarios");
        return;
      }

      const rows = isMultiBranch ? draftAssignments : draftAssignments.slice(0, 1);
      if (rows.some((r) => !r.branchId || !r.roleCode)) {
        toast.error("Elige sucursal y rol en cada fila");
        return;
      }

      const branchIds = rows.map((r) => r.branchId);
      if (new Set(branchIds).size !== branchIds.length) {
        toast.error("No puedes repetir la misma sucursal");
        return;
      }

      for (const r of rows) {
        if (!canManageBranchUsers(r.branchId)) {
          toast.error("Solo puedes gestionar usuarios en sucursales donde eres propietario");
          return;
        }
      }

      try {
        await updateUser.mutateAsync({
          id: editing.id,
          data: {
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            dni: dni.trim(),
            is_multi_branch: isMultiBranch,
            ...(password.trim() ? { password: password.trim() } : {}),
          },
        });

        const keptIds = new Set(
          rows.map((r) => r.assignmentId).filter((id): id is string => Boolean(id)),
        );

        // Quitar asignaciones iniciales que ya no están en el borrador (solo multi).
        if (isMultiBranch) {
          for (const init of initialAssignments) {
            if (init.assignmentId && !keptIds.has(init.assignmentId)) {
              await deleteAssignment.mutateAsync(init.assignmentId);
            }
          }
        }

        for (const row of rows) {
          if (row.assignmentId) {
            const init = initialAssignments.find((i) => i.assignmentId === row.assignmentId);
            if (init && init.branchId === row.branchId && init.roleCode !== row.roleCode) {
              await changeUserRole.mutateAsync({
                user_id: editing.id,
                branch_id: row.branchId,
                role: row.roleCode,
              });
            } else if (init && init.branchId !== row.branchId) {
              await deleteAssignment.mutateAsync(row.assignmentId);
              await assignUser.mutateAsync({
                user_id: editing.id,
                branch_id: row.branchId,
                role: row.roleCode,
                is_active: true,
              });
            }
          } else {
            await assignUser.mutateAsync({
              user_id: editing.id,
              branch_id: row.branchId,
              role: row.roleCode,
              is_active: true,
            });
          }
        }

        // Sin multi: si tenía otra asignación distinta y cambió de sucursal, ya se manejó arriba.
        // Si no era multi y tenía assignmentId y solo cambió rol/sucursal — cubierto.
        // Si no era multi y había más asignaciones en initial pero solo editamos una: no las tocamos.

        toast.success("Usuario actualizado");
        closePanel();
      } catch (e) {
        toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error");
      }
      return;
    }

    if (!password.trim()) {
      toast.error("Contraseña requerida");
      return;
    }
    if (!canMutate) {
      toast.error("Solo el propietario puede crear usuarios");
      return;
    }

    const createRows = isMultiBranch ? draftAssignments : draftAssignments.slice(0, 1);
    const primary = createRows[0];
    if (!primary?.branchId || !primary?.roleCode) {
      toast.error("Elige sucursal y rol");
      return;
    }
    if (!canManageBranchUsers(primary.branchId)) {
      toast.error("Solo puedes crear usuarios en sucursales donde eres propietario");
      return;
    }

    createUser.mutate(
      {
        user_data: {
          email: email.trim(),
          password: password.trim(),
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          dni: dni.trim(),
          is_multi_branch: isMultiBranch,
        },
        branch_assignment: {
          branch_id: primary.branchId,
          role: primary.roleCode,
          is_active: true,
        },
      },
      {
        onSuccess: async (res) => {
          const userId = res.user?.id;
          // Extra asignaciones si multi y hay más filas.
          if (userId && isMultiBranch && createRows.length > 1) {
            try {
              for (const row of createRows.slice(1)) {
                if (!row.branchId || !row.roleCode) continue;
                await assignUser.mutateAsync({
                  user_id: userId,
                  branch_id: row.branchId,
                  role: row.roleCode,
                  is_active: true,
                });
              }
            } catch (e) {
              toast.error(
                (e as { friendlyMessage?: string }).friendlyMessage ||
                  "Usuario creado, pero falló una asignación extra",
              );
              closePanel();
              return;
            }
          }
          toast.success(res.message || "Usuario creado — guarda la contraseña");
          closePanel();
          if (primary.branchId) setBranchFilter(String(primary.branchId));
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al crear"),
      },
    );
  };

  const saveAssign = () => {
    if (!canMutate) {
      toast.error("Solo el propietario puede asignar usuarios");
      return;
    }
    if (!assignUserId || !assignBranchId || !assignRoleCode) {
      toast.error("Usuario, sucursal y rol son requeridos");
      return;
    }
    if (!canManageBranchUsers(assignBranchId)) {
      toast.error("Solo puedes asignar en sucursales donde eres propietario");
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
          closePanel();
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
        <div className="flex flex-wrap items-end justify-between gap-3">
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
            {showBranchFilter && (
              <BranchFilterSelect
                value={branchFilter}
                onValueChange={(v) => startTransition(() => setBranchFilter(v))}
                options={branchOptions.map((b) => ({ id: b.id, label: b.label }))}
              />
            )}
            {isGlobalAdmin && organizations.length > 0 && (
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
            {!canMutate && (
              <p className="text-xs text-muted-foreground pb-2 self-end">
                Solo lectura — el propietario puede crear y editar.
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground pb-2 tabular-nums">
            {filteredUsers.length} usuario{filteredUsers.length === 1 ? "" : "s"}
            {filteredUsers.length > PAGE_SIZE ? ` · pág. ${safePage}/${totalPages}` : ""}
          </span>
        </div>
      </AdminMotionItem>

      <AdminMotionItem>
        <div
          className={cn(
            "grid gap-4 items-start",
            panelOpen
              ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"
              : "grid-cols-1",
          )}
        >
          <div className={cn("min-w-0 space-y-3", panelOpen && "hidden lg:block")}>
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
                    {pagedUsers.length === 0 ? (
                      <motion.tr
                        variants={reduceMotion ? undefined : tableRowVariants}
                        className="border-b transition-colors"
                      >
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No hay usuarios con esos filtros.
                        </TableCell>
                      </motion.tr>
                    ) : (
                      pagedUsers.map((u) => {
                        const userAssignments = assignmentsByUser.get(String(u.id)) ?? [];
                        const ownedOrgs = getOwnedOrgs(u);
                        const isOrganizer = ownedOrgs.length > 0;

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
                                  {isOrganizer && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] bg-teal-500/15 text-teal-400 border-teal-500/30"
                                      title={ownedOrgs.map((o) => o.name).join(", ")}
                                    >
                                      Organizador
                                    </Badge>
                                  )}
                                  {u.is_multi_branch && (
                                    <Badge variant="outline" className="text-[10px]">
                                      Multi
                                    </Badge>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className="block max-w-full text-left text-xs text-muted-foreground truncate hover:text-primary hover:underline underline-offset-2"
                                  title="Clic para copiar"
                                  onClick={() => handleCopyEmail(u.email || "")}
                                >
                                  {u.email}
                                </button>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                              {u.dni || "—"}
                            </TableCell>
                            <TableCell>
                              {userAssignments.length === 0 ? (
                                <span className="text-xs text-muted-foreground">
                                  {u.is_superuser
                                    ? "Global"
                                    : isOrganizer
                                      ? ownedOrgs.map((o) => o.name).join(", ") || "Organizador"
                                      : "Sin asignación"}
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1 max-w-[280px]">
                                  {userAssignments.map((a) => {
                                    const label = `${a.branch_name || branchMeta.get(String(a.branch))?.label || a.branch}${
                                      a.role_name || a.role_code
                                        ? ` · ${a.role_name || a.role_code}`
                                        : ""
                                    }`;
                                    const canRemove = canMutate && canManageBranchUsers(a.branch);
                                    if (!canRemove) {
                                      return (
                                        <span
                                          key={String(a.id)}
                                          className="text-[11px] text-muted-foreground border border-border/80 rounded px-1.5 py-0.5"
                                        >
                                          {label}
                                        </span>
                                      );
                                    }
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
                            <TableCell>
                              {canMutate ? (
                                <button
                                  type="button"
                                  title="Cambiar estado (toggle API)"
                                  disabled={togglingId === String(u.id)}
                                  onClick={() => handleToggleStatus(u)}
                                  className="disabled:opacity-50"
                                >
                                  <Badge
                                    variant={u.is_active !== false ? "default" : "outline"}
                                    className="text-[10px] cursor-pointer"
                                  >
                                    {togglingId === String(u.id)
                                      ? "…"
                                      : u.is_active !== false
                                        ? "Activo"
                                        : "Inactivo"}
                                  </Badge>
                                </button>
                              ) : (
                                <Badge
                                  variant={u.is_active !== false ? "default" : "outline"}
                                  className="text-[10px]"
                                >
                                  {u.is_active !== false ? "Activo" : "Inactivo"}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {canMutate ? (
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
                              ) : (
                                <span className="text-[11px] text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </motion.tr>
                        );
                      })
                    )}
                  </motion.tbody>
                </AnimatePresence>
              </Table>
            </div>
            {filteredUsers.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {pageFrom}–{pageTo} de {filteredUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="px-2 text-xs text-muted-foreground tabular-nums">
                    {safePage} / {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {panelOpen && (
              <motion.aside
                key={panelMode === "edit" ? (editing ? String(editing.id) : "new") : "assign"}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "rounded-lg border border-border bg-background flex flex-col overflow-hidden min-w-0 self-start",
                  "h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)]",
                  "lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)]",
                )}
              >
                <div className="shrink-0 flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-border/70">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold tracking-tight truncate">
                      {panelMode === "assign"
                        ? "Asignar a sucursal"
                        : editing
                          ? "Editar usuario"
                          : "Nuevo usuario"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {panelMode === "assign"
                        ? "Define sucursal y rol del usuario."
                        : editing
                          ? "Datos de la cuenta."
                          : "Crea la cuenta y asígnala a una sucursal."}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={closePanel}
                    title="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
                  {panelMode === "assign" ? (
                    <>
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
                            {editableBranchOptions.map((b) => (
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
                            {rolesLoading && assignBranchId ? (
                              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                Cargando roles…
                              </div>
                            ) : (
                              muninnRoles.map((r) => {
                                const code = r.code || r.value || String(r.id);
                                return (
                                  <SelectItem key={code} value={code}>
                                    {r.name || r.label || code}
                                  </SelectItem>
                                );
                              })
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                        />
                      </div>
                      <div>
                        <Label>Username</Label>
                        <Input
                          value={
                            editing
                              ? editing.username ||
                                `${usernameBaseFromEmail(editing.email || email)}${editing.id}`
                              : email.trim()
                                ? `${usernameBaseFromEmail(email)}…`
                                : ""
                          }
                          readOnly
                          disabled
                          className="font-mono text-sm bg-muted/40"
                          placeholder="se genera al guardar (correo + id)"
                        />
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Automático: parte del correo limpia + ID (único, no editable).
                        </p>
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
                                setPassword(generateSecurePassword());
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
                            Contraseña segura: 14 caracteres (mayúsculas, minúsculas, números y
                            símbolo).
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isMultiBranch}
                            onChange={(e) => {
                              const next = e.target.checked;
                              setIsMultiBranch(next);
                              if (!next) {
                                // Una sola fila: la primera con asignación, o la primera.
                                setDraftAssignments((prev) => {
                                  const keep = prev.find((d) => d.assignmentId) ??
                                    prev[0] ?? {
                                      key: nextDraftKey(),
                                      assignmentId: null,
                                      branchId: "",
                                      roleCode: "",
                                    };
                                  return [{ ...keep, key: keep.key || nextDraftKey() }];
                                });
                              } else if (draftAssignments.length === 0) {
                                setDraftAssignments([
                                  {
                                    key: nextDraftKey(),
                                    assignmentId: null,
                                    branchId: "",
                                    roleCode: "",
                                  },
                                ]);
                              }
                            }}
                          />
                          Multi sucursal
                        </label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Label>{isMultiBranch ? "Sucursales y roles" : "Sucursal"}</Label>
                          {isMultiBranch && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={addDraftRow}
                              disabled={editableBranchOptions.length === 0}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Agregar
                            </Button>
                          )}
                        </div>

                        {(isMultiBranch ? draftAssignments : draftAssignments.slice(0, 1)).map(
                          (row) => {
                            const usedElsewhere = new Set(
                              draftAssignments
                                .filter((d) => d.key !== row.key && d.branchId)
                                .map((d) => d.branchId),
                            );
                            const branchChoices = editableBranchOptions.filter(
                              (b) => !usedElsewhere.has(b.id) || b.id === row.branchId,
                            );
                            const locked =
                              Boolean(editing) && !isMultiBranch && Boolean(row.assignmentId);

                            return (
                              <div
                                key={row.key}
                                className="rounded-md border border-border/70 bg-muted/20 p-2.5 space-y-2"
                              >
                                <div>
                                  <Label className="text-[11px] text-muted-foreground">
                                    Sucursal
                                  </Label>
                                  {locked ? (
                                    <p className="mt-1 rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-sm">
                                      {currentBranchLabel}
                                    </p>
                                  ) : (
                                    <Select
                                      value={row.branchId || undefined}
                                      onValueChange={(v) => {
                                        updateDraft(row.key, { branchId: v, roleCode: "" });
                                        if (!isMultiBranch) {
                                          setCreateBranchId(v);
                                          setCreateRoleCode("");
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue
                                          placeholder={
                                            editableBranchOptions.length === 0
                                              ? "Sin sucursales disponibles"
                                              : "Selecciona sucursal"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {branchChoices.map((b) => (
                                          <SelectItem key={b.id} value={b.id}>
                                            {b.label}
                                            {b.orgName ? ` · ${b.orgName}` : ""}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-[11px] text-muted-foreground">Rol</Label>
                                  <Select
                                    value={row.roleCode || undefined}
                                    onValueChange={(v) => {
                                      updateDraft(row.key, { roleCode: v });
                                      if (!isMultiBranch) setCreateRoleCode(v);
                                    }}
                                    disabled={!row.branchId}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue
                                        placeholder={
                                          row.branchId ? "Selecciona rol" : "Primero sucursal"
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {rolesLoading && row.branchId === roleBranchId ? (
                                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                          Cargando roles…
                                        </div>
                                      ) : (
                                        muninnRoles.map((r) => {
                                          const code = r.code || r.value || String(r.id);
                                          return (
                                            <SelectItem key={code} value={code}>
                                              {r.name || r.label || code}
                                            </SelectItem>
                                          );
                                        })
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {isMultiBranch && draftAssignments.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-destructive hover:text-destructive"
                                    onClick={() => removeDraftRow(row.key)}
                                  >
                                    Quitar
                                  </Button>
                                )}
                              </div>
                            );
                          },
                        )}

                        {editableBranchOptions.length === 0 && (
                          <p className="text-[11px] text-destructive">
                            No hay sucursales donde seas propietario.
                          </p>
                        )}
                        {!isMultiBranch && editing && !primaryDraft?.assignmentId && (
                          <p className="text-[11px] text-muted-foreground">
                            Este usuario no tiene sucursal: elige una y un rol para asignarlo.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="shrink-0 border-t border-border/70 p-4">
                  {panelMode === "assign" ? (
                    <Button className="w-full" onClick={saveAssign} disabled={assignUser.isPending}>
                      {assignUser.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Asignando…
                        </>
                      ) : (
                        "Asignar"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={saveUser}
                      disabled={
                        createUser.isPending ||
                        updateUser.isPending ||
                        changeUserRole.isPending ||
                        assignUser.isPending ||
                        deleteAssignment.isPending
                      }
                    >
                      {createUser.isPending ||
                      updateUser.isPending ||
                      changeUserRole.isPending ||
                      assignUser.isPending ||
                      deleteAssignment.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Guardar
                    </Button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </AdminMotionItem>

      <Dialog
        open={revealOpen}
        onOpenChange={(v) => {
          setRevealOpen(v);
          if (!v) setRevealed(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contraseña generada</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {revealed?.message || "Contraseña generada y asignada exitosamente"}. Solo se muestra
              una vez — guárdala ahora.
            </p>
            {revealed?.username && (
              <div>
                <Label className="text-xs text-muted-foreground">Usuario</Label>
                <p className="text-sm font-medium">{revealed.username}</p>
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground">Nueva contraseña</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={revealed?.new_password || ""}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={!revealed?.new_password}
                  onClick={() => handleCopyPassword(revealed?.new_password || "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {revealed?.password_info && (
              <p className="text-[11px] text-muted-foreground">{revealed.password_info}</p>
            )}
            {revealed?.generated_at && (
              <p className="text-[11px] text-muted-foreground tabular-nums">
                Generada: {revealed.generated_at}
              </p>
            )}
            <Button className="w-full" onClick={() => setRevealOpen(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirmAction)} onOpenChange={(v) => !v && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "delete"
                ? "Desactivar usuario"
                : confirmAction?.type === "toggle"
                  ? confirmAction.user.is_active === false
                    ? "Activar usuario"
                    : "Desactivar usuario"
                  : confirmAction?.type === "regenPassword"
                    ? "Regenerar contraseña"
                    : "Quitar acceso"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "delete"
                ? `¿Desactivar a ${displayName(confirmAction.user)}? Quedará inactivo; no se borra de la base.`
                : confirmAction?.type === "toggle"
                  ? `¿${confirmAction.user.is_active === false ? "Activar" : "Desactivar"} a ${displayName(confirmAction.user)}?`
                  : confirmAction?.type === "regenPassword"
                    ? `Se generará una contraseña segura de 14 caracteres para ${displayName(confirmAction.user)} y se asignará de inmediato. La anterior dejará de funcionar.`
                    : confirmAction?.type === "unassign"
                      ? `¿Quitar acceso a ${confirmAction.label}?`
                      : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={runConfirmAction}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TooltipProvider delayDuration={200}>
        <AnimatePresence>
          {!panelOpen && (
            <motion.div
              className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            >
              <AnimatePresence>
                {fabOpen && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.96 }}
                    className="flex flex-col items-end gap-2 mb-1"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-10 w-10 rounded-full shadow-md"
                          onClick={handleRefresh}
                          disabled={refreshing || usersFetching}
                          aria-label="Actualizar"
                        >
                          <RefreshCw
                            className={cn(
                              "h-4 w-4",
                              (refreshing || usersFetching) && "animate-spin",
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Actualizar</TooltipContent>
                    </Tooltip>
                    {canMutate && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-10 w-10 rounded-full shadow-md"
                              onClick={openAssignDialog}
                              aria-label="Asignar a sucursal"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Asignar a sucursal</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              className="h-10 w-10 rounded-full shadow-md"
                              onClick={openCreate}
                              aria-label="Nuevo usuario"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Nuevo</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg"
                    onClick={() => setFabOpen((v) => !v)}
                    aria-expanded={fabOpen}
                    aria-label={fabOpen ? "Cerrar menú" : "Menú"}
                  >
                    {fabOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{fabOpen ? "Cerrar" : "Menú"}</TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </AdminPageMotion>
  );
}
