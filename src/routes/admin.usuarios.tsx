import { useSearchParams } from "react-router-dom";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  muninnRoleLabel,
  type BranchRole,
  useAdminBranches,
  useBranchRoles,
  useBranchUsers,
  useDeleteBranchUser,
  useMyBranchesSelect,
  useOrganizations,
} from "@/api/hooks/useBranches";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { AdminPageLoader } from "@/components/admin/AdminPageLoader";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminMobileFab } from "@/components/admin/AdminMobileFab";
import { AdminMultiEditShell } from "@/components/admin/AdminOwnerSettingsShell";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { EmptyState, ErrorBanner } from "@/components/ui/empty-state";
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
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const {
    data: users = [],
    isLoading: usersLoading,
    isFetching: usersFetching,
    isError: usersError,
  } = useAdminUsers();

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
  const { isFetching: rolesLoading } = useBranchRoles(roleBranchId || null);

  const muninnRoles = FALLBACK_BRANCH_ROLES;

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

  /** Sucursales donde el usuario actual puede crear/editar (OWNER / organizador). */
  const editableBranchOptions = useMemo(() => {
    if (!ownerBranchIdSet) return branchOptions;
    return branchOptions.filter((b) => ownerBranchIdSet.has(b.id));
  }, [branchOptions, ownerBranchIdSet]);

  const primaryDraft = draftAssignments[0];

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
      if (u.is_superuser) return false;

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

  const pageFrom = filteredUsers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const pageTo = Math.min(safePage * PAGE_SIZE, filteredUsers.length);

  const closePanel = () => {
    setPanelOpen(false);
    setEditing(null);
    setFabOpen(false);
    if (searchParams.get("view")) {
      setSearchParams({}, { replace: true });
    }
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
    setSearchParams({ view: "nuevo" }, { replace: true });
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
    setSearchParams({ view: "editar", id: String(u.id) }, { replace: true });
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
    setSearchParams({ view: "asignar" }, { replace: true });
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

        // Quitar asignaciones iniciales que ya no están en el borrador
        // (también al desactivar multi: solo se conserva la fila visible).
        for (const init of initialAssignments) {
          if (init.assignmentId && !keptIds.has(init.assignmentId)) {
            await deleteAssignment.mutateAsync(init.assignmentId);
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
    if (!isGlobalAdmin && (!primary?.branchId || !primary?.roleCode)) {
      toast.error("Elige sucursal y rol");
      return;
    }
    if (primary.branchId && !canManageBranchUsers(primary.branchId)) {
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
        ...(primary?.branchId && primary?.roleCode
          ? {
              branch_assignment: {
                branch_id: primary.branchId,
                role: primary.roleCode,
                is_active: true,
              },
            }
          : {}),
      },
      {
        onSuccess: async (res) => {
          const userId = res.user?.id;
          // Si el BE creó el user pero no devolvió asignación, reintentar assign.
          if (userId && primary.branchId && primary.roleCode && !res.branch_assignment) {
            try {
              await assignUser.mutateAsync({
                user_id: userId,
                branch_id: primary.branchId,
                role: primary.roleCode,
                is_active: true,
              });
            } catch (e) {
              toast.error(
                (e as { friendlyMessage?: string }).friendlyMessage ||
                  "Usuario creado, pero no se pudo asignar la sucursal",
              );
              closePanel();
              return;
            }
          }
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

  const formHint =
    panelMode === "assign"
      ? "Definí sucursal y rol del usuario."
      : editing
        ? "Datos de la cuenta y asignaciones."
        : "Crea la cuenta y asígnala a una sucursal.";

  // Breadcrumb (Usuarios) limpia ?view=… → cerrar formulario.
  useEffect(() => {
    if (!searchParams.get("view") && panelOpen) {
      setPanelOpen(false);
      setEditing(null);
      setFabOpen(false);
    }
  }, [searchParams, panelOpen]);

  // Deep-link / refresh: hidratar formulario desde ?view=
  useEffect(() => {
    if (usersLoading || panelOpen) return;
    const view = searchParams.get("view");
    if (!view) return;
    if (view === "nuevo") {
      if (!canMutate) return;
      openCreate();
      return;
    }
    if (view === "asignar") {
      if (!canMutate) return;
      openAssignDialog();
      return;
    }
    if (view === "editar") {
      const id = searchParams.get("id");
      if (!id) return;
      const u = users.find((x) => String(x.id) === id);
      if (u) openEdit(u);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open* leen estado fresco al montar/URL
  }, [searchParams, usersLoading, users, panelOpen, canMutate]);

  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {usersLoading ? (
        <motion.div
          key="skeleton"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.base }}
          className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto"
        >
          <AdminPageLoader variant="tableFilters" />
        </motion.div>
      ) : (
        <AdminPageMotion key="content" className={panelOpen ? "pt-3 pb-6 space-y-4" : undefined}>
          {usersError && (
            <AdminMotionItem>
              <ErrorBanner message="No se pudieron cargar los usuarios." onRetry={handleRefresh} />
            </AdminMotionItem>
          )}

          {!panelOpen && (
            <>
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
                  {showBranchFilter && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Sucursal</Label>
                      <BranchFilterSelect
                        value={branchFilter}
                        onValueChange={(v) => startTransition(() => setBranchFilter(v))}
                        options={branchOptions.map((b) => ({ id: b.id, label: b.label }))}
                        label={null}
                      />
                    </div>
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
                <AdminListToolbar
                  className="mb-0 mt-3"
                  countLabel={`${filteredUsers.length} usuario${filteredUsers.length === 1 ? "" : "s"}${filteredUsers.length > PAGE_SIZE ? ` · pág. ${safePage}/${totalPages}` : ""}`}
                  actions={[
                    {
                      label: "Actualizar",
                      icon: RefreshCw,
                      onClick: handleRefresh,
                      disabled: refreshing || usersFetching,
                      spinning: refreshing || usersFetching,
                    },
                    ...(canMutate
                      ? [
                          {
                            label: "Asignar a sucursal",
                            icon: UserPlus,
                            onClick: openAssignDialog,
                          },
                          {
                            label: "Nuevo",
                            icon: Plus,
                            onClick: openCreate,
                            variant: "default" as const,
                          },
                        ]
                      : []),
                  ]}
                />
              </AdminMotionItem>

              <AdminMotionItem>
                <div className="min-w-0 space-y-3">
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
                      <TableBody className="[&_tr:last-child]:border-0">
                        {pagedUsers.length === 0 ? (
                          <TableRow className="border-b transition-colors">
                            <TableCell colSpan={5} className="p-4">
                              <EmptyState
                                title="Sin usuarios"
                                description="No hay usuarios con esos filtros."
                                action={
                                  canMutate ? (
                                    <Button size="sm" onClick={openCreate}>
                                      <Plus className="h-4 w-4 mr-1.5" />
                                      Nuevo
                                    </Button>
                                  ) : undefined
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedUsers.map((u) => {
                            const userAssignments = assignmentsByUser.get(String(u.id)) ?? [];
                            const ownedOrgs = getOwnedOrgs(u);
                            const isOrganizer = ownedOrgs.length > 0;

                            return (
                              <TableRow
                                key={String(u.id)}
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
                                          a.role_code
                                            ? ` · ${muninnRoleLabel(a.role_code)}`
                                            : a.role_name
                                              ? ` · ${a.role_name}`
                                              : ""
                                        }`;
                                        const canRemove =
                                          canMutate && canManageBranchUsers(a.branch);
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
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
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
              </AdminMotionItem>
            </>
          )}

          {panelOpen && (
            <AdminMotionItem>
              <AdminMultiEditShell
                onBack={closePanel}
                hint={formHint}
                footer={
                  <>
                    <Button type="button" variant="outline" onClick={closePanel}>
                      Cancelar
                    </Button>
                    {panelMode === "assign" ? (
                      <Button onClick={saveAssign} disabled={assignUser.isPending}>
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
                  </>
                }
                className="max-w-2xl"
              >
                <div className="space-y-4">
                  {panelMode === "assign" ? (
                    <>
                      <div>
                        <Label>Usuario</Label>
                        <Select value={assignUserId} onValueChange={setAssignUserId}>
                          <SelectTrigger>
                            <SelectValue placeholder="ej. juan.perez@empresa.cl" />
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
                                    {muninnRoleLabel(code)}
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
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="juan.perez@empresa.cl"
                            autoComplete="email"
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
                            placeholder="ej. juanperez42 (auto)"
                          />
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Automático: parte del correo limpia + ID.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Juan"
                            autoComplete="given-name"
                          />
                        </div>
                        <div>
                          <Label>Apellido</Label>
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Pérez"
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                      <div
                        className={cn(
                          "grid grid-cols-1 items-start gap-4",
                          !editing ? "sm:grid-cols-2" : undefined,
                        )}
                      >
                        <div>
                          <Label>RUT / DNI</Label>
                          <Input
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            placeholder="12.345.678-9"
                            className="mt-1 font-mono"
                          />
                          {!editing ? (
                            <p
                              className="mt-1 text-[11px] text-transparent select-none"
                              aria-hidden
                            >
                              —
                            </p>
                          ) : null}
                        </div>
                        {!editing && (
                          <div>
                            <Label>Password</Label>
                            <div className="mt-1 flex gap-2">
                              <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className="font-mono text-sm"
                                placeholder="Ej. K9m!pQ2xYz4nRw"
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
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              14 caracteres: mayúsculas, minúsculas, números y símbolo.
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1">
                        Opcional para superadmin &mdash; dejar vac&iacute;o crea un usuario
                        organizador sin sucursal.
                      </p>
                      <div className="space-y-3">
                        {isMultiBranch && (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={addDraftRow}
                              disabled={editableBranchOptions.length === 0}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Agregar sucursal
                            </Button>
                          </div>
                        )}

                        {(isMultiBranch ? draftAssignments : draftAssignments.slice(0, 1)).map(
                          (row, rowIndex) => {
                            const usedElsewhere = new Set(
                              draftAssignments
                                .filter((d) => d.key !== row.key && d.branchId)
                                .map((d) => d.branchId),
                            );
                            const branchChoices = editableBranchOptions.filter(
                              (b) => !usedElsewhere.has(b.id) || b.id === row.branchId,
                            );

                            return (
                              <div key={row.key} className="space-y-2">
                                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                                  <div>
                                    <Label className="inline-flex h-5 items-center">Sucursal</Label>
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
                                              : "ej. Smart Hydro"
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
                                    {Boolean(editing) &&
                                      !isMultiBranch &&
                                      Boolean(row.assignmentId) && (
                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                          Si cambiás de sucursal, se mueve la asignación actual.
                                        </p>
                                      )}
                                  </div>
                                  <div>
                                    <div className="flex h-5 items-center justify-between gap-2">
                                      <Label>Rol</Label>
                                      {isMultiBranch && draftAssignments.length > 1 ? (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-5 px-1.5 text-[11px] text-destructive hover:text-destructive"
                                          onClick={() => removeDraftRow(row.key)}
                                        >
                                          Quitar
                                        </Button>
                                      ) : null}
                                    </div>
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
                                            row.branchId ? "ej. Empleado" : "Primero sucursal"
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
                                                {muninnRoleLabel(code)}
                                              </SelectItem>
                                            );
                                          })
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                {rowIndex === 0 && (
                                  <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none sm:max-w-[calc(50%-0.5rem)]">
                                    <input
                                      type="checkbox"
                                      className="rounded border-border"
                                      checked={isMultiBranch}
                                      onChange={(e) => {
                                        const next = e.target.checked;
                                        setIsMultiBranch(next);
                                        if (!next) {
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
                                )}
                              </div>
                            );
                          },
                        )}

                        {editableBranchOptions.length === 0 && (
                          <p className="text-[11px] text-destructive">
                            No hay sucursales disponibles para asignar. Si sos organizador, verificá
                            que el holding tenga stores activas.
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
              </AdminMultiEditShell>
            </AdminMotionItem>
          )}

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
                  {revealed?.message || "Contraseña generada y asignada exitosamente"}. Solo se
                  muestra una vez — guárdala ahora.
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

          <AlertDialog
            open={Boolean(confirmAction)}
            onOpenChange={(v) => !v && setConfirmAction(null)}
          >
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

          <AdminMobileFab
            open={fabOpen}
            onOpenChange={setFabOpen}
            visible={!panelOpen}
            actions={[
              {
                label: "Actualizar",
                icon: RefreshCw,
                onClick: handleRefresh,
                disabled: refreshing || usersFetching,
                spinning: refreshing || usersFetching,
              },
              ...(canMutate
                ? [
                    { label: "Asignar a sucursal", icon: UserPlus, onClick: openAssignDialog },
                    { label: "Nuevo", icon: Plus, onClick: openCreate },
                  ]
                : []),
            ]}
          />
        </AdminPageMotion>
      )}
    </AnimatePresence>
  );
}
