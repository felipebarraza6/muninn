import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Building2,
  ExternalLink,
  Globe2,
  Handshake,
  ImageIcon,
  LayoutGrid,
  Link2,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  Trash2,
  Unlink2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useAdminBranches,
  useAttachStore,
  useCreateOrganization,
  useDeleteOrganization,
  useDetachStore,
  useOrganizationStores,
  useOrganizationSyncVersion,
  useOrganizationTheme,
  useOrganizationAllowedApps,
  useOrganizationRoleApps,
  useOrganizations,
  useRefreshOrganizations,
  useUpdateOrganization,
  useUpdateOrganizationAllowedApps,
  useUpdateOrganizationRoleApps,
  useUpdateOrganizationTheme,
  type Organization,
  type OrganizationRoleApps,
  type OrganizationTheme,
  type SocialLink,
  useBranchUsers,
  FALLBACK_BRANCH_ROLES,
  MUNINN_ASSIGNABLE_ROLE_CODES,
} from "@/api/hooks/useBranches";
import { OrganizationAppPicker } from "@/components/organizations/organization-app-picker";
import { useAdminUsers } from "@/api/hooks/useUsers";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { AdminEntityEditChrome } from "@/components/admin/AdminOwnerSettingsShell";
import { AdminPageLoader } from "@/components/admin/AdminPageLoader";
import { InlineSkeleton } from "@/components/ui/page-skeleton";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminMobileFab } from "@/components/admin/AdminMobileFab";
import { PortalAccessLinkField } from "@/components/brand/PortalAccessLinkField";
import { ThemeAssetField } from "@/components/brand/ThemeAssetField";
import { EmptyState, ErrorBanner } from "@/components/ui/empty-state";
import { toCssColorHex } from "@/lib/colorHex";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { buildPortalAccessUrl, normalizePortalHost } from "@/lib/portalAccessUrl";
import {
  normalizeThemeSocialLinks,
  normalizeThemeSponsors,
  newThemeSocialLink,
  newThemeSponsor,
  SOCIAL_ICON_OPTIONS,
  type ThemeSocialLinkItem,
  type ThemeSponsorItem,
} from "@/lib/themeFormItems";
import {
  canCreateOrganizationsAdmin,
  canDesignateOrganizationApps,
  canDesignateOrganizationRoleApps,
  getOrganizationsAdminNavLabel,
  getOwnedOrganizationIds,
  isOrganizationOwnerScope,
  isSingleOrganizationOwner,
  isSuperAdmin,
} from "@/lib/authGuards";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type PanelTab =
  | "datos"
  | "apariencia"
  | "redes"
  | "acceso"
  | "patrocinadores"
  | "apps"
  | "apps-roles";

const PANEL_TABS: Array<{
  id: PanelTab;
  label: string;
  icon: typeof UserRound;
  /** Solo al editar org existente (no en create). */
  editOnly?: boolean;
  /** Superadmin: designar apps a la org. */
  superadminOnly?: boolean;
  /** Superadmin u organizador: apps por rol. */
  roleApps?: boolean;
}> = [
  { id: "datos", label: "Datos", icon: UserRound },
  { id: "apariencia", label: "Apariencia", icon: ImageIcon },
  { id: "redes", label: "Redes", icon: Share2 },
  { id: "acceso", label: "Acceso", icon: Globe2 },
  { id: "patrocinadores", label: "Patrocinadores", icon: Handshake },
  { id: "apps", label: "Apps", icon: LayoutGrid, editOnly: true, superadminOnly: true },
  { id: "apps-roles", label: "Apps por rol", icon: Shield, editOnly: true, roleApps: true },
];

const PANEL_SUBTITLES: Record<PanelTab, { edit: string; create: string }> = {
  datos: {
    edit: "Identidad, propietario y sucursales.",
    create: "Datos generales de la organización.",
  },
  apariencia: {
    edit: "Colores, marca e imágenes.",
    create: "Define la marca visual (opcional).",
  },
  redes: {
    edit: "Sitio web y redes sociales.",
    create: "Opcional: web y perfiles sociales.",
  },
  acceso: {
    edit: "Cómo entran tus clientes al portal.",
    create: "Cómo entran tus clientes al portal.",
  },
  patrocinadores: {
    edit: "Partners que se muestran al ingresar.",
    create: "Partners opcionales al ingresar.",
  },
  apps: {
    edit: "Qué apps del store puede ver esta organización.",
    create: "",
  },
  "apps-roles": {
    edit: "Qué apps ve cada rol (OWNER → ADMIN_LOCAL → EMPLOYEE).",
    create: "",
  },
};

function assetUrl(...candidates: Array<string | null | undefined>): string {
  for (const c of candidates) {
    const resolved = resolveMediaUrl(c);
    if (resolved) return resolved;
  }
  return "";
}

type ColumnFilters = {
  name: string;
  dni: string;
  owner: string;
  domain: string;
  stores: string;
};

type ConfirmAction =
  | { type: "delete-org"; org: Organization }
  | {
      type: "detach-store";
      orgId: string | number;
      branchId: string | number;
      label: string;
    };

function friendlyOrgError(e: unknown): string {
  const raw = (e as { friendlyMessage?: string })?.friendlyMessage || "";
  if (!raw) return "No se pudo guardar";
  return raw
    .replace(/custom_domain:\s*/gi, "Dominio propio: ")
    .replace(/login_slug:\s*/gi, "Nombre corto del link: ")
    .replace(/dni:\s*/gi, "RUT: ")
    .replace(/name:\s*/gi, "Nombre: ");
}

export default function AdminOrganizacionesPage() {
  const isGlobalAdmin = isSuperAdmin();
  const orgOwnerScope = isOrganizationOwnerScope();
  const canCreate = canCreateOrganizationsAdmin();
  const orgOwnerShell = isSingleOrganizationOwner();
  const pageLabel = getOrganizationsAdminNavLabel();
  const ownedOrgIdSet = useMemo(() => {
    if (isGlobalAdmin) return null;
    if (!orgOwnerScope) return new Set<string>();
    const ids = getOwnedOrganizationIds();
    // Sin IDs en sesión: confiar en el API (ya filtra por holding).
    if (ids.length === 0) return null;
    return new Set(ids);
  }, [isGlobalAdmin, orgOwnerScope]);

  const { data: orgsRaw = [], isLoading, isFetching, isError, error } = useOrganizations();
  const orgs = useMemo(() => {
    if (!ownedOrgIdSet) return orgsRaw;
    return orgsRaw.filter((o) => ownedOrgIdSet.has(String(o.id)));
  }, [orgsRaw, ownedOrgIdSet]);
  /** Owner de un solo holding: shell settings. Si hay 0 o >1, lista. */
  const singleOrgMode = orgOwnerShell && orgs.length === 1;

  useOrganizationSyncVersion(true);
  const refreshOrganizations = useRefreshOrganizations();
  const { data: branches = [] } = useAdminBranches();
  const { data: users = [] } = useAdminUsers();
  const { data: allAssignments = [] } = useBranchUsers({ allBranches: true });
  const assignedUserIds = useMemo(() => {
    const set = new Set<string>();
    for (const a of allAssignments) {
      if (a.is_active !== false) set.add(String(a.user));
    }
    return set;
  }, [allAssignments]);
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();
  const attachStore = useAttachStore();
  const detachStore = useDetachStore();
  const updateTheme = useUpdateOrganizationTheme();

  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>("datos");
  const [editing, setEditing] = useState<Organization | null>(null);
  const [focusedOrgId, setFocusedOrgId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ColumnFilters>({
    name: "",
    dni: "",
    owner: "",
    domain: "",
    stores: "",
  });
  const [openFilters, setOpenFilters] = useState<Partial<Record<keyof ColumnFilters, boolean>>>({});
  const deferredFilters = useDeferredValue(filters);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [dni, setDni] = useState("");
  const [owner, setOwner] = useState("");
  const [maxBranches, setMaxBranches] = useState("5");
  const [customDomain, setCustomDomain] = useState("");
  const [active, setActive] = useState(true);

  const [attachBranchId, setAttachBranchId] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachOrg, setAttachOrg] = useState<Organization | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [themeForm, setThemeForm] = useState<Partial<OrganizationTheme>>({});
  const [socialLinks, setSocialLinks] = useState<ThemeSocialLinkItem[]>([]);
  const [sponsors, setSponsors] = useState<ThemeSponsorItem[]>([]);
  const [showSponsors, setShowSponsors] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [borderRadius, setBorderRadius] = useState(6);
  const [compact, setCompact] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const panelOrgId = focusedOrgId;
  const storesOrgId =
    attachOpen && attachOrg ? String(attachOrg.id) : panelOpen && panelOrgId ? panelOrgId : null;
  const { data: orgTheme, isLoading: themeLoading } = useOrganizationTheme(
    panelOpen && panelOrgId ? panelOrgId : null,
  );
  const { data: stores = [], isLoading: storesLoading } = useOrganizationStores(storesOrgId);

  const canDesignateApps = canDesignateOrganizationApps();
  const canDesignateRoleApps = canDesignateOrganizationRoleApps();
  const updateAllowedApps = useUpdateOrganizationAllowedApps();
  const updateRoleApps = useUpdateOrganizationRoleApps();

  const { data: allowedAppsData, isLoading: allowedAppsLoading } = useOrganizationAllowedApps(
    panelOpen && panelOrgId && (canDesignateApps || canDesignateRoleApps) ? panelOrgId : null,
  );
  const { data: roleAppsData, isLoading: roleAppsLoading } = useOrganizationRoleApps(
    panelOpen && panelOrgId && canDesignateRoleApps ? panelOrgId : null,
  );

  const [draftAllowedAppIds, setDraftAllowedAppIds] = useState<string[]>([]);
  const [draftRoleApps, setDraftRoleApps] = useState<OrganizationRoleApps["roles"]>({
    OWNER: [],
    ADMIN_LOCAL: [],
    EMPLOYEE: [],
  });
  const [activeRoleCode, setActiveRoleCode] =
    useState<(typeof MUNINN_ASSIGNABLE_ROLE_CODES)[number]>("OWNER");
  const appsHydratedForId = useRef<string | null>(null);
  const themeHydratedForId = useRef<string | null>(null);

  useEffect(() => {
    if (!panelOpen || !panelOrgId) {
      appsHydratedForId.current = null;
      return;
    }
    if (!allowedAppsData && !roleAppsData) return;
    const id = String(panelOrgId);
    if (appsHydratedForId.current === id) return;
    // Esperar ambos si hacen falta, para no parcializar.
    if (canDesignateApps && !allowedAppsData) return;
    if (canDesignateRoleApps && !roleAppsData) return;
    appsHydratedForId.current = id;
    if (allowedAppsData) {
      setDraftAllowedAppIds(allowedAppsData.external_api_ids.map(String));
    }
    if (roleAppsData) {
      setDraftRoleApps({
        OWNER: (roleAppsData.roles.OWNER ?? []).map(String),
        ADMIN_LOCAL: (roleAppsData.roles.ADMIN_LOCAL ?? []).map(String),
        EMPLOYEE: (roleAppsData.roles.EMPLOYEE ?? []).map(String),
      });
    }
  }, [
    panelOpen,
    panelOrgId,
    allowedAppsData,
    roleAppsData,
    canDesignateApps,
    canDesignateRoleApps,
  ]);

  const visiblePanelTabs = useMemo(() => {
    const editingExisting = Boolean(editing);
    return PANEL_TABS.filter((tab) => {
      if (tab.editOnly && !editingExisting) return false;
      if (tab.superadminOnly && !canDesignateApps) return false;
      if (tab.roleApps && !canDesignateRoleApps) return false;
      return true;
    });
  }, [editing, canDesignateApps, canDesignateRoleApps]);

  const roleLabel = (code: string) =>
    FALLBACK_BRANCH_ROLES.find((r) => r.code === code)?.name ?? code;

  // Hidratar theme una sola vez por org abierta (no pisar ediciones al refetch).
  useEffect(() => {
    if (!panelOpen || !panelOrgId) {
      themeHydratedForId.current = null;
      return;
    }
    if (!orgTheme) return;
    const id = String(panelOrgId);
    if (themeHydratedForId.current === id) return;
    themeHydratedForId.current = id;
    const branding = orgTheme.branding;
    setLogoUrl(assetUrl(branding?.logo_url, orgTheme.logo_url, orgTheme.logo));
    setFaviconUrl(assetUrl(branding?.favicon_url, orgTheme.favicon_url, orgTheme.favicon));
    setBannerUrl(
      assetUrl(branding?.banner_image_url, orgTheme.banner_image_url, orgTheme.banner_image),
    );
    setSocialLinks(
      normalizeThemeSocialLinks(orgTheme.social_links ?? branding?.social_links ?? null),
    );
    setSponsors(normalizeThemeSponsors(orgTheme.sponsor_logos));
    setShowSponsors(orgTheme.show_sponsor_logos !== false);
    setFontSize(typeof orgTheme.font_size === "number" ? orgTheme.font_size : 14);
    setBorderRadius(typeof orgTheme.borderRadius === "number" ? orgTheme.borderRadius : 6);
    setCompact(Boolean(orgTheme.compact));
    setMotionEnabled(orgTheme.motion !== false);
  }, [panelOpen, panelOrgId, orgTheme]);

  const resetThemeExtras = () => {
    setThemeForm({});
    setSocialLinks([]);
    setSponsors([]);
    setShowSponsors(true);
    setFontSize(14);
    setBorderRadius(6);
    setCompact(false);
    setMotionEnabled(true);
    setLogoUrl("");
    setFaviconUrl("");
    setBannerUrl("");
    setLogoFile(null);
    setFaviconFile(null);
    setBannerFile(null);
  };

  const unattachedBranches = useMemo(
    () => branches.filter((b) => b.organization == null || b.organization === ""),
    [branches],
  );

  const filteredOrgs = useMemo(() => {
    const nameQ = deferredFilters.name.trim().toLowerCase();
    const dniQ = deferredFilters.dni.trim().toLowerCase();
    const ownerQ = deferredFilters.owner.trim().toLowerCase();
    const domainQ = deferredFilters.domain.trim().toLowerCase();
    const storesQ = deferredFilters.stores.trim().toLowerCase();

    return orgs.filter((o) => {
      if (nameQ) {
        const hay = `${o.name || ""} ${o.business_name || ""}`.toLowerCase();
        if (!hay.includes(nameQ)) return false;
      }
      if (dniQ && !(o.dni || "").toLowerCase().includes(dniQ)) return false;
      if (ownerQ && !(o.owner_email || "").toLowerCase().includes(ownerQ)) return false;
      if (domainQ) {
        const hay = `${o.custom_domain || ""} ${o.login_slug || ""}`.toLowerCase();
        if (!hay.includes(domainQ)) return false;
      }
      if (storesQ) {
        const storesCount = o.stores_count ?? 0;
        const max = o.max_branches;
        const label =
          max != null ? `${storesCount} / ${max}`.toLowerCase() : String(storesCount).toLowerCase();
        if (!label.includes(storesQ) && !String(storesCount).includes(storesQ)) return false;
      }
      return true;
    });
  }, [orgs, deferredFilters]);

  const setFilter = (key: keyof ColumnFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleFilter = (key: keyof ColumnFilters) => {
    const willOpen = !openFilters[key];
    setOpenFilters((prev) => ({ ...prev, [key]: willOpen }));
    if (!willOpen) setFilter(key, "");
  };

  const isFilterVisible = (key: keyof ColumnFilters) =>
    Boolean(openFilters[key] || filters[key].trim());

  const showFilterRow = (Object.keys(filters) as (keyof ColumnFilters)[]).some(isFilterVisible);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFabOpen(false);
    try {
      await refreshOrganizations();
      toast.success("Lista actualizada");
    } catch {
      toast.error("No se pudo actualizar");
    } finally {
      setRefreshing(false);
    }
  };

  const closePanel = () => {
    // Mi Organización: no hay lista detrás — el editor permanece abierto.
    if (singleOrgMode) {
      setPanelTab("datos");
      return;
    }
    setPanelOpen(false);
    setFocusedOrgId(null);
    setEditing(null);
    setPanelTab("datos");
    if (searchParams.get("view")) {
      setSearchParams({}, { replace: true });
    }
  };

  const openCreate = () => {
    if (!canCreate) {
      toast.error("No puedes crear organizaciones");
      return;
    }
    setFabOpen(false);
    setPanelTab("datos");
    setEditing(null);
    setFocusedOrgId(null);
    setName("");
    setBusinessName("");
    setDni("");
    setOwner("");
    setMaxBranches("5");
    setCustomDomain("");
    setActive(true);
    resetThemeExtras();
    setPanelOpen(true);
    setSearchParams({ view: "nuevo" }, { replace: true });
  };

  const openEdit = (o: Organization, tab: PanelTab = "datos") => {
    setFabOpen(false);
    setPanelTab(tab);
    setEditing(o);
    setFocusedOrgId(String(o.id));
    setName(o.name || "");
    setBusinessName(o.business_name || "");
    setDni(o.dni || "");
    setOwner(o.owner != null ? String(o.owner) : "");
    setMaxBranches(String(o.max_branches ?? 5));
    setCustomDomain(o.custom_domain || "");
    setActive(o.is_active !== false);
    resetThemeExtras();
    setPanelOpen(true);
    if (!singleOrgMode) {
      setSearchParams({ view: "editar", id: String(o.id) }, { replace: true });
    }
  };

  // Organizador con un solo holding: siempre el editor (nunca lista).
  useEffect(() => {
    if (!singleOrgMode || isLoading) return;
    if (orgs.length !== 1) return;
    if (!panelOpen || !editing || String(editing.id) !== String(orgs[0].id)) {
      openEdit(orgs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- openEdit estable para este flujo
  }, [singleOrgMode, orgs, isLoading, panelOpen, editing?.id]);

  // Breadcrumb limpia ?view=… → cerrar formulario (solo admin multi).
  useEffect(() => {
    if (singleOrgMode) return;
    if (!searchParams.get("view") && panelOpen) {
      setPanelOpen(false);
      setFocusedOrgId(null);
      setEditing(null);
      setFabOpen(false);
    }
  }, [searchParams, panelOpen, singleOrgMode]);

  // Deep-link / refresh: hidratar formulario desde ?view=
  useEffect(() => {
    if (singleOrgMode || isLoading || panelOpen) return;
    const view = searchParams.get("view");
    if (!view) return;
    if (view === "nuevo") {
      if (!canCreate) return;
      openCreate();
      return;
    }
    if (view === "editar") {
      const id = searchParams.get("id");
      if (!id) return;
      const o = orgs.find((x) => String(x.id) === id);
      if (o) openEdit(o);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isLoading, orgs, panelOpen, singleOrgMode, canCreate]);

  const openAttach = (o: Organization) => {
    if (!canCreate) {
      toast.error("Solo un administrador global puede vincular sucursales");
      return;
    }
    setFabOpen(false);
    setAttachOrg(o);
    setAttachBranchId("");
    setAttachOpen(true);
  };

  const closeAttach = () => {
    setAttachOpen(false);
    setAttachOrg(null);
    setAttachBranchId("");
  };

  const themeValues: Partial<OrganizationTheme> = {
    app_name: themeForm.app_name ?? orgTheme?.app_name ?? "",
    primary_color: themeForm.primary_color ?? orgTheme?.primary_color ?? "",
    secondary_color: themeForm.secondary_color ?? orgTheme?.secondary_color ?? "",
    tagline: themeForm.tagline ?? orgTheme?.tagline ?? "",
    brand_description: themeForm.brand_description ?? orgTheme?.brand_description ?? "",
    login_slug: themeForm.login_slug ?? orgTheme?.login_slug ?? "",
    login_welcome_message: themeForm.login_welcome_message ?? orgTheme?.login_welcome_message ?? "",
    login_subtitle: themeForm.login_subtitle ?? orgTheme?.login_subtitle ?? "",
    website_url: themeForm.website_url ?? orgTheme?.website_url ?? "",
  };

  const setThemeField = <K extends keyof OrganizationTheme>(
    key: K,
    value: OrganizationTheme[K],
  ) => {
    setThemeForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildOrgPayload = (): Partial<Organization> => {
    const domain = normalizePortalHost(customDomain) || null;
    const payload: Partial<Organization> = {
      name: name.trim(),
      business_name: businessName.trim() || null,
      dni: dni.trim(),
      custom_domain: domain,
      is_active: active,
    };
    // Solo superadmin: propietario y cupo de sucursales.
    if (canCreate) {
      payload.owner = owner ? Number(owner) : null;
      payload.max_branches = Number(maxBranches) || 5;
    }
    return payload;
  };

  const buildThemeJsonPayload = (): Partial<OrganizationTheme> => ({
    app_name: String(themeValues.app_name ?? "").trim() || null,
    primary_color: String(themeValues.primary_color ?? "").trim()
      ? toCssColorHex(String(themeValues.primary_color))
      : null,
    secondary_color: String(themeValues.secondary_color ?? "").trim()
      ? toCssColorHex(String(themeValues.secondary_color))
      : null,
    tagline: String(themeValues.tagline ?? "").trim() || "",
    brand_description: String(themeValues.brand_description ?? "").trim() || "",
    website_url: String(themeValues.website_url ?? "").trim() || "",
    login_slug: String(themeValues.login_slug ?? "").trim() || null,
    login_welcome_message: String(themeValues.login_welcome_message ?? "").trim() || "",
    login_subtitle: String(themeValues.login_subtitle ?? "").trim() || "",
    font_size: fontSize,
    borderRadius: borderRadius,
    compact,
    motion: motionEnabled,
    show_sponsor_logos: showSponsors,
    social_links: socialLinks
      .filter((s) => s.name.trim() && s.url.trim())
      .map((s, i) => ({
        name: s.name.trim(),
        url: s.url.trim(),
        icon: s.icon.trim() || "web",
        enabled: s.enabled,
        order: i + 1,
      })) as SocialLink[],
    sponsor_logos: sponsors
      .filter((s) => s.name.trim())
      .map((s, i) => ({
        name: s.name.trim(),
        logo_url: s.logo_url.trim() || "",
        website_url: s.website_url.trim() || "",
        enabled: s.enabled,
        order: i + 1,
      })),
  });

  const saveThemeForOrg = async (orgId: string | number) => {
    const themePayload = buildThemeJsonPayload();
    const hasFiles = Boolean(logoFile || faviconFile || bannerFile);
    await updateTheme.mutateAsync({ id: orgId, data: themePayload });
    if (!hasFiles) return;

    const fd = new FormData();
    // app_name ayuda a parsers multipart parciales del BE (mismo patrón que sucursales).
    const appName = String(themePayload.app_name ?? "").trim();
    if (appName) fd.append("app_name", appName);
    if (logoFile) fd.append("logo", logoFile);
    if (faviconFile) fd.append("favicon", faviconFile);
    if (bannerFile) fd.append("banner_image", bannerFile);

    const themeRes = await updateTheme.mutateAsync({ id: orgId, data: fd });
    setLogoUrl(assetUrl(themeRes?.branding?.logo_url, themeRes?.logo_url, themeRes?.logo, logoUrl));
    setFaviconUrl(
      assetUrl(
        themeRes?.branding?.favicon_url,
        themeRes?.favicon_url,
        themeRes?.favicon,
        faviconUrl,
      ),
    );
    setBannerUrl(
      assetUrl(
        themeRes?.branding?.banner_image_url,
        themeRes?.banner_image_url,
        themeRes?.banner_image,
        bannerUrl,
      ),
    );
    setLogoFile(null);
    setFaviconFile(null);
    setBannerFile(null);
  };

  const save = async () => {
    if (panelTab === "apps") {
      if (!editing || !canDesignateApps) {
        toast.error("No puedes designar apps de la organización");
        return;
      }
      setSaving(true);
      try {
        await updateAllowedApps.mutateAsync({
          orgId: editing.id,
          external_api_ids: draftAllowedAppIds,
        });
        toast.success(
          draftAllowedAppIds.length > 0
            ? "Apps de la organización actualizadas"
            : "Sin restricción: la org vuelve al filtro por sucursal",
        );
      } catch (e) {
        toast.error(friendlyOrgError(e));
      } finally {
        setSaving(false);
      }
      return;
    }

    if (panelTab === "apps-roles") {
      if (!editing || !canDesignateRoleApps) {
        toast.error("No puedes designar apps por rol");
        return;
      }
      setSaving(true);
      try {
        await updateRoleApps.mutateAsync({
          orgId: editing.id,
          roles: draftRoleApps,
        });
        toast.success("Apps por rol actualizadas");
      } catch (e) {
        toast.error(friendlyOrgError(e));
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!name.trim() || !dni.trim()) {
      toast.error("Nombre y RUT son requeridos");
      setPanelTab("datos");
      return;
    }

    const domain = normalizePortalHost(customDomain);
    if (customDomain.trim() && !domain) {
      toast.error("Dominio propio inválido. Usa solo el host, ej. portal.cliente.com");
      setPanelTab("acceso");
      return;
    }
    if (domain !== customDomain.trim().toLowerCase()) {
      setCustomDomain(domain);
    }

    if (!editing && !canCreate) {
      toast.error("No puedes crear organizaciones");
      return;
    }

    setSaving(true);
    try {
      const orgPayload = buildOrgPayload();

      if (editing) {
        await updateOrg.mutateAsync({ id: editing.id, data: orgPayload });
        await saveThemeForOrg(editing.id);
        toast.success("Organización actualizada");
        if (!singleOrgMode) {
          closePanel();
        } else {
          void refreshOrganizations();
        }
      } else {
        const created = await createOrg.mutateAsync(orgPayload);
        await saveThemeForOrg(created.id);
        toast.success("Organización creada");
        closePanel();
      }
    } catch (e) {
      toast.error(friendlyOrgError(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (o: Organization) => {
    setConfirmAction({ type: "delete-org", org: o });
  };

  const saveAttach = () => {
    if (!attachOrg || !attachBranchId) {
      toast.error("Elige una sucursal");
      return;
    }
    attachStore.mutate(
      { orgId: attachOrg.id, branchId: attachBranchId },
      {
        onSuccess: () => {
          toast.success("Sucursal vinculada");
          setAttachBranchId("");
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo vincular"),
      },
    );
  };

  const handleDetach = (branchId: string | number, label: string, orgId?: string | number) => {
    if (!canCreate) {
      toast.error("Solo un administrador global puede desvincular sucursales");
      return;
    }
    const targetOrgId = orgId ?? attachOrg?.id ?? editing?.id;
    if (!targetOrgId) return;
    setConfirmAction({
      type: "detach-store",
      orgId: targetOrgId,
      branchId,
      label,
    });
  };

  const runConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "delete-org") {
      const o = confirmAction.org;
      deleteOrg.mutate(o.id, {
        onSuccess: () => {
          toast.success("Organización eliminada");
          if (focusedOrgId === String(o.id)) closePanel();
        },
        onError: (e) =>
          toast.error((e as { friendlyMessage?: string }).friendlyMessage || "No se pudo eliminar"),
      });
    } else {
      detachStore.mutate(
        { orgId: confirmAction.orgId, branchId: confirmAction.branchId },
        {
          onSuccess: () => toast.success("Sucursal desvinculada"),
          onError: (e) =>
            toast.error(
              (e as { friendlyMessage?: string }).friendlyMessage || "No se pudo desvincular",
            ),
        },
      );
    }
    setConfirmAction(null);
  };

  const confirmCopy =
    confirmAction?.type === "delete-org"
      ? {
          title: "Eliminar organización",
          description: `¿Eliminar «${confirmAction.org.name}»? Esta acción no se puede deshacer fácilmente.`,
          action: "Eliminar",
        }
      : confirmAction?.type === "detach-store"
        ? {
            title: "Desvincular sucursal",
            description: `¿Desvincular «${confirmAction.label}» de la organización? Seguirá existiendo como sucursal independiente.`,
            action: "Desvincular",
          }
        : null;

  const panelTitle = editing
    ? singleOrgMode
      ? pageLabel
      : editing.name || pageLabel
    : "Nueva organización";

  const panelSubtitle = editing
    ? singleOrgMode
      ? editing.name || PANEL_SUBTITLES[panelTab].edit
      : PANEL_SUBTITLES[panelTab].edit
    : PANEL_SUBTITLES[panelTab].create;

  const storesList = (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="mb-0">Sucursales vinculadas</Label>
        {editing && canCreate && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => openAttach(editing)}
          >
            <Link2 className="h-3 w-3 mr-1" /> Vincular
          </Button>
        )}
      </div>
      {storesLoading ? (
        <InlineSkeleton lines={3} />
      ) : stores.length === 0 ? (
        <p className="text-xs text-muted-foreground rounded-md border border-dashed border-border px-3 py-4 text-center">
          {canCreate
            ? "Sin sucursales vinculadas."
            : "Sin sucursales. Créalas en Sucursales; quedan bajo tu organización."}
        </p>
      ) : (
        <ul className="rounded-md border border-border divide-y divide-border overflow-hidden">
          {stores.map((s) => {
            const label = s.business_name || `Sucursal ${s.id}`;
            return (
              <li key={String(s.id)} className="flex items-start gap-2 px-3 py-2.5 text-sm">
                <Building2 className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {[s.dni, s.commune || s.region, s.email].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0 mt-1.5",
                    s.is_active !== false ? "bg-emerald-500" : "bg-muted-foreground/40",
                  )}
                  title={s.is_active !== false ? "Activa" : "Inactiva"}
                />
                {canCreate && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                    title="Desvincular"
                    disabled={detachStore.isPending}
                    onClick={() => handleDetach(s.id, label, editing?.id)}
                  >
                    <Unlink2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto"
        >
          <AdminPageLoader variant="table" />
        </motion.div>
      ) : (
        <AdminPageMotion
          key="content"
          className={panelOpen || singleOrgMode ? "pt-3 pb-6 space-y-4" : undefined}
        >
          {isError && (
            <AdminMotionItem>
              <ErrorBanner
                message={`No se pudieron cargar las organizaciones. ${(error as { friendlyMessage?: string })?.friendlyMessage || ""}`.trim()}
                onRetry={handleRefresh}
              />
            </AdminMotionItem>
          )}

          {orgOwnerShell && orgs.length === 0 && (
            <AdminMotionItem>
              <EmptyState
                title="Sin organización"
                description="No tienes una organización asignada como propietario."
              />
            </AdminMotionItem>
          )}

          {!singleOrgMode && !panelOpen && (
            <AdminMotionItem>
              <AdminListToolbar
                countLabel={`${filteredOrgs.length} organizaci${filteredOrgs.length === 1 ? "ón" : "ones"}`}
                actions={[
                  {
                    label: "Actualizar",
                    icon: RefreshCw,
                    onClick: handleRefresh,
                    disabled: refreshing || isFetching,
                    spinning: refreshing || isFetching,
                  },
                  ...(canCreate
                    ? [
                        {
                          label: "Nueva",
                          icon: Plus,
                          onClick: openCreate,
                          variant: "default" as const,
                        },
                      ]
                    : []),
                ]}
              />
              <div className="min-w-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      {(
                        [
                          {
                            key: "name" as const,
                            label: "Organización",
                            className: undefined,
                          },
                          {
                            key: "dni" as const,
                            label: "RUT",
                            className: "hidden sm:table-cell",
                          },
                          {
                            key: "owner" as const,
                            label: "Propietario",
                            className: "hidden md:table-cell",
                          },
                          {
                            key: "domain" as const,
                            label: "Acceso",
                            className: "hidden lg:table-cell",
                          },
                          {
                            key: "stores" as const,
                            label: "Sucursales",
                            className: "hidden xl:table-cell",
                          },
                        ] as const
                      ).map((col) => (
                        <TableHead key={col.key} className={col.className}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilter(col.key);
                            }}
                            className={cn(
                              "inline-flex max-w-full items-center truncate rounded-sm text-left transition-colors cursor-pointer hover:underline underline-offset-4 hover:text-foreground",
                              isFilterVisible(col.key)
                                ? "text-primary hover:text-primary"
                                : "text-muted-foreground",
                            )}
                            title={
                              isFilterVisible(col.key)
                                ? "Cerrar filtro"
                                : `Filtrar por ${col.label}`
                            }
                            aria-label={`Filtrar por ${col.label}`}
                            aria-pressed={isFilterVisible(col.key)}
                          >
                            {col.label}
                          </button>
                        </TableHead>
                      ))}
                      <TableHead className="text-right w-[72px]">
                        <span className="sr-only">Acciones</span>
                      </TableHead>
                    </TableRow>
                    {showFilterRow && (
                      <TableRow className="hover:bg-transparent border-border/40">
                        <TableHead className="pt-0 pb-3 font-normal align-top">
                          {isFilterVisible("name") ? (
                            <Input
                              autoFocus={Boolean(openFilters.name)}
                              value={filters.name}
                              onChange={(e) => setFilter("name", e.target.value)}
                              placeholder="Buscar por nombre…"
                              className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                            />
                          ) : null}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell pt-0 pb-3 font-normal align-top">
                          {isFilterVisible("dni") ? (
                            <Input
                              autoFocus={Boolean(openFilters.dni)}
                              value={filters.dni}
                              onChange={(e) => setFilter("dni", e.target.value)}
                              placeholder="12.345.678-9"
                              className="h-8 text-xs font-normal font-mono bg-muted/30 border-border/60"
                            />
                          ) : null}
                        </TableHead>
                        <TableHead className="pt-0 pb-3 font-normal align-top hidden md:table-cell">
                          {isFilterVisible("owner") ? (
                            <Input
                              autoFocus={Boolean(openFilters.owner)}
                              value={filters.owner}
                              onChange={(e) => setFilter("owner", e.target.value)}
                              placeholder="correo@empresa.com"
                              className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                            />
                          ) : null}
                        </TableHead>
                        <TableHead className="pt-0 pb-3 font-normal align-top hidden lg:table-cell">
                          {isFilterVisible("domain") ? (
                            <Input
                              autoFocus={Boolean(openFilters.domain)}
                              value={filters.domain}
                              onChange={(e) => setFilter("domain", e.target.value)}
                              placeholder="dominio o nombre corto"
                              className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                            />
                          ) : null}
                        </TableHead>
                        <TableHead className="pt-0 pb-3 font-normal align-top hidden xl:table-cell">
                          {isFilterVisible("stores") ? (
                            <Input
                              autoFocus={Boolean(openFilters.stores)}
                              value={filters.stores}
                              onChange={(e) => setFilter("stores", e.target.value)}
                              placeholder="2 / 5"
                              className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                            />
                          ) : null}
                        </TableHead>
                        <TableHead className="pt-0 pb-3" />
                      </TableRow>
                    )}
                  </TableHeader>
                  <TableBody>
                    {filteredOrgs.length === 0 && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="p-4">
                          <EmptyState
                            title={orgs.length === 0 ? "Sin organizaciones" : "Sin coincidencias"}
                            description={
                              orgs.length === 0
                                ? canCreate
                                  ? "Crea la primera organización para empezar."
                                  : "Sin organizaciones asignadas."
                                : "Ninguna organización coincide con los filtros."
                            }
                            action={
                              orgs.length === 0 && canCreate ? (
                                <Button size="sm" onClick={openCreate}>
                                  <Plus className="h-4 w-4 mr-1.5" />
                                  Nueva
                                </Button>
                              ) : undefined
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredOrgs.map((o) => {
                      const selected = focusedOrgId === String(o.id);
                      const storesCount = o.stores_count ?? 0;
                      const max = o.max_branches;
                      return (
                        <TableRow
                          key={String(o.id)}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selected && "bg-sidebar-accent/60",
                          )}
                          onClick={() => openEdit(o)}
                        >
                          <TableCell className="min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full shrink-0",
                                  o.is_active !== false
                                    ? "bg-emerald-500"
                                    : "bg-muted-foreground/40",
                                )}
                                title={o.is_active !== false ? "Activa" : "Inactiva"}
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate">{o.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {max != null
                                    ? `${storesCount} / ${max} sucursales`
                                    : `${storesCount} sucursales`}
                                  <span className="sm:hidden font-mono">
                                    {o.dni ? ` · ${o.dni}` : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-xs whitespace-nowrap">
                            {o.dni || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[10rem] hidden md:table-cell">
                            {o.owner_email || "—"}
                          </TableCell>
                          <TableCell
                            className="text-xs truncate max-w-[12rem] hidden lg:table-cell"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(() => {
                              const access = buildPortalAccessUrl({
                                customDomain: o.custom_domain,
                                loginSlug: o.login_slug,
                              });
                              const hasOwn =
                                Boolean(o.custom_domain?.trim()) || Boolean(o.login_slug?.trim());
                              if (!hasOwn) {
                                return <span className="text-muted-foreground">—</span>;
                              }
                              return (
                                <a
                                  href={access.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 max-w-full"
                                  title={access.url}
                                >
                                  <span className="truncate">
                                    {o.custom_domain?.trim() || o.login_slug || "Abrir"}
                                  </span>
                                  <ExternalLink className="h-3 w-3 shrink-0 opacity-80" />
                                </a>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-xs tabular-nums hidden xl:table-cell">
                            {max != null ? `${storesCount} / ${max}` : storesCount}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  title="Más opciones"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[11rem]">
                                {canCreate && (
                                  <DropdownMenuItem onClick={() => openAttach(o)}>
                                    <Link2 className="h-3.5 w-3.5 mr-2" />
                                    Vincular sucursal
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => openEdit(o, "apariencia")}>
                                  <ImageIcon className="h-3.5 w-3.5 mr-2" />
                                  Apariencia
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(o, "redes")}>
                                  <Share2 className="h-3.5 w-3.5 mr-2" />
                                  Redes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(o, "acceso")}>
                                  <Globe2 className="h-3.5 w-3.5 mr-2" />
                                  Acceso
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(o, "patrocinadores")}>
                                  <Handshake className="h-3.5 w-3.5 mr-2" />
                                  Patrocinadores
                                </DropdownMenuItem>
                                {canCreate && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => handleDelete(o)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AdminMotionItem>
          )}

          {panelOpen && (
            <AdminMotionItem>
              <AdminEntityEditChrome
                mode={singleOrgMode ? "owner" : "form"}
                panelKey={focusedOrgId ?? "new"}
                title={singleOrgMode ? name.trim() || editing?.name || panelTitle : panelTitle}
                meta={
                  singleOrgMode
                    ? businessName.trim() || String(themeValues.tagline ?? "").trim() || undefined
                    : undefined
                }
                subtitle={singleOrgMode ? PANEL_SUBTITLES[panelTab].edit : panelSubtitle}
                formHint={!singleOrgMode ? panelSubtitle : undefined}
                tabs={visiblePanelTabs}
                tab={panelTab}
                onTabChange={(id) => setPanelTab(id as PanelTab)}
                onClose={singleOrgMode ? undefined : closePanel}
                logoUrl={logoUrl || null}
                bannerUrl={bannerUrl || null}
                accentColor={String(themeValues.primary_color ?? "").trim() || null}
                initial={(name || editing?.name || "O").charAt(0)}
                active={active}
                onRefresh={singleOrgMode ? handleRefresh : undefined}
                refreshing={refreshing || isFetching}
                footer={
                  <>
                    <Button
                      className={singleOrgMode ? undefined : "min-w-[8rem]"}
                      onClick={() => void save()}
                      disabled={
                        saving ||
                        createOrg.isPending ||
                        updateOrg.isPending ||
                        updateTheme.isPending ||
                        updateAllowedApps.isPending ||
                        updateRoleApps.isPending
                      }
                    >
                      {(saving ||
                        createOrg.isPending ||
                        updateOrg.isPending ||
                        updateTheme.isPending ||
                        updateAllowedApps.isPending ||
                        updateRoleApps.isPending) && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Guardar
                    </Button>
                    {!singleOrgMode && (
                      <Button variant="outline" onClick={closePanel}>
                        Cancelar
                      </Button>
                    )}
                  </>
                }
              >
                {panelTab === "datos" && (
                  <div className="space-y-3.5">
                    <section className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Identidad
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Nombre *</Label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ej. Grupo Patagon"
                          />
                        </div>
                        <div>
                          <Label>Razón social</Label>
                          <Input
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="ej. Patagon SpA"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>RUT *</Label>
                        <Input
                          value={dni}
                          onChange={(e) => setDni(e.target.value)}
                          className="font-mono max-w-xs"
                          placeholder="76.111.222-3"
                        />
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Operación
                      </h3>
                      {canCreate && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <Label>Propietario</Label>
                            <Select
                              value={owner || "none"}
                              onValueChange={(v) => setOwner(v === "none" ? "" : v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Opcional" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sin propietario</SelectItem>
                                {users
                                  .filter((u) => !assignedUserIds.has(String(u.id)))
                                  .map((u) => (
                                    <SelectItem key={String(u.id)} value={String(u.id)}>
                                      {u.email}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Máximo de sucursales</Label>
                            <Input
                              type="number"
                              min={1}
                              value={maxBranches}
                              onChange={(e) => setMaxBranches(e.target.value)}
                              placeholder="5"
                            />
                          </div>
                        </div>
                      )}
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
                        Organización activa
                      </label>
                    </section>

                    {editing && (
                      <section className="pt-1 border-t border-border/60">{storesList}</section>
                    )}
                  </div>
                )}

                {panelTab === "apariencia" && (
                  <div className="space-y-3.5">
                    {themeLoading && editing ? (
                      <InlineSkeleton lines={5} />
                    ) : (
                      <>
                        <section className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Marca
                          </h3>
                          <div>
                            <Label>Nombre en el menú</Label>
                            <Input
                              value={String(themeValues.app_name ?? "")}
                              onChange={(e) => setThemeField("app_name", e.target.value)}
                              placeholder="Ej. Grupo Patagon"
                            />
                          </div>
                          <div>
                            <Label>Eslogan</Label>
                            <Input
                              value={String(themeValues.tagline ?? "")}
                              onChange={(e) => setThemeField("tagline", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Descripción de marca</Label>
                            <Textarea
                              value={String(themeValues.brand_description ?? "")}
                              onChange={(e) => setThemeField("brand_description", e.target.value)}
                              rows={3}
                            />
                          </div>
                        </section>
                        <section className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Colores
                          </h3>
                          {(
                            [
                              ["primary_color", "Color principal"],
                              ["secondary_color", "Color secundario"],
                            ] as const
                          ).map(([key, label]) => {
                            const raw = String(themeValues[key] ?? "").trim();
                            const hex = toCssColorHex(raw, "#808080");
                            return (
                              <div key={key}>
                                <Label>{label}</Label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={hex}
                                    onChange={(e) =>
                                      setThemeField(key, e.target.value.toLowerCase())
                                    }
                                    className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
                                    title={label}
                                    aria-label={label}
                                  />
                                  <Input
                                    value={raw}
                                    onChange={(e) => setThemeField(key, e.target.value)}
                                    placeholder="#0284c7"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </section>
                        <section className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Imágenes
                          </h3>
                          <ThemeAssetField
                            label="Logo"
                            hint="PNG, JPG, WebP o GIF. Máximo 2 MB."
                            previewUrl={logoUrl}
                            file={logoFile}
                            onFile={setLogoFile}
                          />
                          <ThemeAssetField
                            label="Ícono de pestaña"
                            hint="Ícono chico del navegador. PNG, ICO o WebP. Máximo 2 MB."
                            previewUrl={faviconUrl}
                            file={faviconFile}
                            onFile={setFaviconFile}
                          />
                          <ThemeAssetField
                            label="Imagen de portada"
                            hint="Pantalla de ingreso. PNG, JPG o WebP. Máximo 2 MB."
                            previewUrl={bannerUrl}
                            file={bannerFile}
                            onFile={setBannerFile}
                          />
                        </section>
                        <section className="space-y-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Estilo
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Tamaño de texto</Label>
                              <Input
                                type="number"
                                min={12}
                                max={20}
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value) || 14)}
                              />
                              <p className="mt-1 text-[11px] text-muted-foreground">12–20 px</p>
                            </div>
                            <div>
                              <Label>Redondeo de bordes</Label>
                              <Input
                                type="number"
                                min={0}
                                max={24}
                                value={borderRadius}
                                onChange={(e) => setBorderRadius(Number(e.target.value) || 0)}
                              />
                              <p className="mt-1 text-[11px] text-muted-foreground">0–24 px</p>
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={compact}
                              onCheckedChange={(v) => setCompact(v === true)}
                            />
                            Interfaz compacta
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={motionEnabled}
                              onCheckedChange={(v) => setMotionEnabled(v === true)}
                            />
                            Animaciones
                          </label>
                        </section>
                      </>
                    )}
                  </div>
                )}

                {panelTab === "redes" && (
                  <section className="space-y-3">
                    <div>
                      <Label>Sitio web</Label>
                      <Input
                        value={String(themeValues.website_url ?? "")}
                        onChange={(e) => setThemeField("website_url", e.target.value)}
                        placeholder="https://…"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Redes sociales
                      </h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSocialLinks((prev) => [
                            ...prev,
                            newThemeSocialLink({ order: prev.length + 1 }),
                          ])
                        }
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    {socialLinks.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">
                        Sin links. Agrega las redes que quieras mostrar.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {socialLinks.map((link, index) => (
                          <div
                            key={link.key}
                            className="rounded-md border border-border/70 p-3 space-y-2 bg-muted/10"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                Link {index + 1}
                              </span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() =>
                                  setSocialLinks((prev) => prev.filter((s) => s.key !== link.key))
                                }
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Nombre *</Label>
                                <Input
                                  value={link.name}
                                  onChange={(e) =>
                                    setSocialLinks((prev) =>
                                      prev.map((s) =>
                                        s.key === link.key ? { ...s, name: e.target.value } : s,
                                      ),
                                    )
                                  }
                                  placeholder="Instagram"
                                />
                              </div>
                              <div>
                                <Label>Ícono</Label>
                                <Select
                                  value={link.icon}
                                  onValueChange={(v) =>
                                    setSocialLinks((prev) =>
                                      prev.map((s) => (s.key === link.key ? { ...s, icon: v } : s)),
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Ícono" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {SOCIAL_ICON_OPTIONS.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Enlace *</Label>
                              <Input
                                value={link.url}
                                onChange={(e) =>
                                  setSocialLinks((prev) =>
                                    prev.map((s) =>
                                      s.key === link.key ? { ...s, url: e.target.value } : s,
                                    ),
                                  )
                                }
                                placeholder="https://instagram.com/…"
                              />
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox
                                checked={link.enabled}
                                onCheckedChange={(v) =>
                                  setSocialLinks((prev) =>
                                    prev.map((s) =>
                                      s.key === link.key ? { ...s, enabled: v === true } : s,
                                    ),
                                  )
                                }
                              />
                              Visible
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {panelTab === "acceso" && (
                  <div className="space-y-3.5">
                    {themeLoading && editing ? (
                      <InlineSkeleton lines={4} />
                    ) : (
                      <section className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Ingreso al portal
                        </h3>
                        <div>
                          <Label>Dominio propio</Label>
                          <Input
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            onBlur={() => {
                              const normalized = normalizePortalHost(customDomain);
                              if (normalized) setCustomDomain(normalized);
                            }}
                            placeholder="portal.cliente.com"
                          />
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Opcional. Solo el dominio, sin https://
                          </p>
                        </div>
                        <div>
                          <Label>Nombre corto del link</Label>
                          <Input
                            value={String(themeValues.login_slug ?? "")}
                            onChange={(e) => setThemeField("login_slug", e.target.value)}
                            placeholder="mi-grupo"
                          />
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Se usa cuando no hay dominio propio.
                          </p>
                        </div>
                        <PortalAccessLinkField
                          customDomain={customDomain}
                          loginSlug={String(themeValues.login_slug ?? "")}
                        />
                        <div>
                          <Label>Mensaje de bienvenida</Label>
                          <Input
                            value={String(themeValues.login_welcome_message ?? "")}
                            onChange={(e) => setThemeField("login_welcome_message", e.target.value)}
                            placeholder="¡Bienvenido!"
                          />
                        </div>
                        <div>
                          <Label>Texto de apoyo</Label>
                          <Input
                            value={String(themeValues.login_subtitle ?? "")}
                            onChange={(e) => setThemeField("login_subtitle", e.target.value)}
                            placeholder="Ingresá con tu cuenta"
                          />
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {panelTab === "patrocinadores" && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Patrocinadores
                      </h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSponsors((prev) => [
                            ...prev,
                            newThemeSponsor({ order: prev.length + 1 }),
                          ])
                        }
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={showSponsors}
                        onCheckedChange={(v) => setShowSponsors(v === true)}
                      />
                      Mostrar patrocinadores al ingresar
                    </label>
                    {sponsors.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">
                        Sin patrocinadores. Agrega partners con nombre, imagen y sitio web.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {sponsors.map((s, index) => (
                          <div
                            key={s.key}
                            className="rounded-md border border-border/70 p-3 space-y-2 bg-muted/10"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                Patrocinador {index + 1}
                              </span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() =>
                                  setSponsors((prev) => prev.filter((x) => x.key !== s.key))
                                }
                                title="Eliminar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div>
                              <Label>Nombre *</Label>
                              <Input
                                value={s.name}
                                onChange={(e) =>
                                  setSponsors((prev) =>
                                    prev.map((x) =>
                                      x.key === s.key ? { ...x, name: e.target.value } : x,
                                    ),
                                  )
                                }
                                placeholder="Sercotec"
                              />
                            </div>
                            <div>
                              <Label>Imagen</Label>
                              <Input
                                value={s.logo_url}
                                onChange={(e) =>
                                  setSponsors((prev) =>
                                    prev.map((x) =>
                                      x.key === s.key ? { ...x, logo_url: e.target.value } : x,
                                    ),
                                  )
                                }
                                placeholder="https://…/imagen.png"
                              />
                            </div>
                            <div>
                              <Label>Sitio web</Label>
                              <Input
                                value={s.website_url}
                                onChange={(e) =>
                                  setSponsors((prev) =>
                                    prev.map((x) =>
                                      x.key === s.key ? { ...x, website_url: e.target.value } : x,
                                    ),
                                  )
                                }
                                placeholder="https://…"
                              />
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <Checkbox
                                checked={s.enabled}
                                onCheckedChange={(v) =>
                                  setSponsors((prev) =>
                                    prev.map((x) =>
                                      x.key === s.key ? { ...x, enabled: v === true } : x,
                                    ),
                                  )
                                }
                              />
                              Habilitado
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {panelTab === "apps" && editing && (
                  <section className="space-y-3">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Apps permitidas
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Elige qué apps del store puede ver esta organización. Vacío = sin
                        restricción (sigue el filtro por sucursal).
                      </p>
                    </div>
                    {allowedAppsLoading ? (
                      <InlineSkeleton lines={4} />
                    ) : (
                      <OrganizationAppPicker
                        selectedIds={draftAllowedAppIds}
                        onChange={setDraftAllowedAppIds}
                        disabled={!canDesignateApps || updateAllowedApps.isPending}
                      />
                    )}
                  </section>
                )}

                {panelTab === "apps-roles" && editing && (
                  <section className="space-y-3">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Apps por rol
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Solo dentro de las apps permitidas de la org. Lista vacía en un rol = hereda
                        todas las de la organización.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {MUNINN_ASSIGNABLE_ROLE_CODES.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setActiveRoleCode(code)}
                          className={cn(
                            "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                            activeRoleCode === code
                              ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                              : "text-muted-foreground hover:text-foreground border border-transparent",
                          )}
                        >
                          {roleLabel(code)}
                          <span className="ml-1 opacity-70">
                            ({draftRoleApps[code]?.length ?? 0})
                          </span>
                        </button>
                      ))}
                    </div>
                    {roleAppsLoading || allowedAppsLoading ? (
                      <InlineSkeleton lines={4} />
                    ) : (
                      <OrganizationAppPicker
                        selectedIds={draftRoleApps[activeRoleCode] ?? []}
                        onChange={(ids) =>
                          setDraftRoleApps((prev) => ({ ...prev, [activeRoleCode]: ids }))
                        }
                        catalogIds={allowedAppsData?.is_restricted ? draftAllowedAppIds : null}
                        disabled={!canDesignateRoleApps || updateRoleApps.isPending}
                        emptyHint="No hay apps disponibles para este rol."
                      />
                    )}
                  </section>
                )}
              </AdminEntityEditChrome>
            </AdminMotionItem>
          )}

          <Dialog
            open={attachOpen}
            onOpenChange={(open) => {
              if (!open) closeAttach();
              else setAttachOpen(true);
            }}
          >
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Vincular sucursal
                  {attachOrg?.name ? ` · ${attachOrg.name}` : ""}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {storesLoading ? (
                  <InlineSkeleton lines={4} />
                ) : (
                  <div className="space-y-2">
                    <Label className="mb-0">Ya vinculadas ({stores.length})</Label>
                    {stores.length === 0 ? (
                      <p className="text-xs text-muted-foreground rounded-md border border-dashed border-border px-3 py-3 text-center">
                        Sin sucursales aún.
                      </p>
                    ) : (
                      <ul className="rounded-md border border-border divide-y divide-border max-h-40 overflow-y-auto">
                        {stores.map((s) => {
                          const label = s.business_name || `Sucursal ${s.id}`;
                          return (
                            <li
                              key={String(s.id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm"
                            >
                              <span className="truncate flex-1 min-w-0">{label}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                title="Desvincular"
                                disabled={detachStore.isPending}
                                onClick={() => handleDetach(s.id, label, attachOrg?.id)}
                              >
                                <Unlink2 className="h-3.5 w-3.5" />
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
                <div>
                  <Label>Agregar sucursal</Label>
                  <Select value={attachBranchId} onValueChange={setAttachBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {unattachedBranches.map((b) => (
                        <SelectItem key={String(b.id)} value={String(b.id)}>
                          {b.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {unattachedBranches.length === 0 && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      No hay sucursales sin organización.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    className="flex-1"
                    onClick={saveAttach}
                    disabled={attachStore.isPending || !attachBranchId}
                  >
                    {attachStore.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Vincular
                  </Button>
                  <Button variant="outline" onClick={closeAttach}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={confirmAction != null}
            onOpenChange={(open) => {
              if (!open) setConfirmAction(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmCopy?.title}</AlertDialogTitle>
                <AlertDialogDescription>{confirmCopy?.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={runConfirmAction}
                >
                  {confirmCopy?.action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AdminMobileFab
            open={fabOpen}
            onOpenChange={setFabOpen}
            visible={!panelOpen && !singleOrgMode}
            actions={[
              {
                label: "Actualizar",
                icon: RefreshCw,
                onClick: handleRefresh,
                disabled: refreshing || isFetching,
                spinning: refreshing || isFetching,
              },
              ...(canCreate ? [{ label: "Nueva", icon: Plus, onClick: openCreate }] : []),
            ]}
          />
        </AdminPageMotion>
      )}
    </AnimatePresence>
  );
}
