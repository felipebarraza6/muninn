import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ExternalLink,
  Globe2,
  Handshake,
  ImageIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Share2,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useBranchThemeConfig,
  useCreateBranch,
  useOrganizations,
  useRefreshBranches,
  useUpdateBranch,
  useUpdateBranchThemeConfig,
  type AdminBranch,
} from "@/api/hooks/useBranches";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { AdminEntityEditChrome } from "@/components/admin/AdminOwnerSettingsShell";
import { AdminPageLoader } from "@/components/admin/AdminPageLoader";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminMobileFab } from "@/components/admin/AdminMobileFab";
import { EmptyState, ErrorBanner } from "@/components/ui/empty-state";
import {
  canCreateBranchesAdmin,
  canMutateBranch,
  getBranchesAdminNavLabel,
  getOwnedOrganizationIds,
  getOwnerBranchIds,
  getPrimaryOrganizationName,
  isMultiBranchUser,
  isOrganizationOwner,
  isStoreOwnerScope,
  isSuperAdmin,
} from "@/lib/authGuards";
import {
  CHILE_REGIONS,
  canonicalizeChileGeo,
  getChileCommunes,
  getChileProvinces,
  resolveChileRegion,
} from "@/lib/chileGeo";
import { toCssColorHex, isCssColorHex } from "@/lib/colorHex";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { resolveEffectiveTheme } from "@/lib/branchThemeDefaults";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PortalAccessLinkField } from "@/components/brand/PortalAccessLinkField";
import { buildPortalAccessUrl } from "@/lib/portalAccessUrl";

type PanelTab = "datos" | "apariencia" | "redes" | "acceso" | "patrocinadores";

const PANEL_TABS: Array<{
  id: PanelTab;
  label: string;
  icon: typeof UserRound;
}> = [
  { id: "datos", label: "Datos", icon: UserRound },
  { id: "apariencia", label: "Apariencia", icon: ImageIcon },
  { id: "redes", label: "Redes", icon: Share2 },
  { id: "acceso", label: "Acceso", icon: Globe2 },
  { id: "patrocinadores", label: "Patrocinadores", icon: Handshake },
];

const PANEL_SUBTITLES: Record<PanelTab, { edit: string; create: string }> = {
  datos: {
    edit: "Identidad, contacto y operación.",
    create: "Completa los datos generales de la sucursal.",
  },
  apariencia: {
    edit: "Colores, marca e imágenes.",
    create: "Define la marca visual de la sucursal.",
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
};

type SponsorItem = {
  key: string;
  name: string;
  logo_url: string;
  website_url: string;
  enabled: boolean;
  order: number;
};

type SocialLinkItem = {
  key: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
};

const SOCIAL_ICON_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "web", label: "Web" },
  { value: "other", label: "Otro" },
] as const;

type BranchForm = {
  business_name: string;
  fantasy_name: string;
  commercial_business: string;
  dni: string;
  phone: string;
  email: string;
  region: string;
  province: string;
  commune: string;
  address: string;
  custom_domain: string;
  from_email: string;
  organization: string;
  is_active: boolean;
  allow_multi_branch_access: boolean;
  // Marca
  app_name: string;
  primary_color: string;
  secondary_color: string;
  tagline: string;
  brand_description: string;
  website_url: string;
  social_links: SocialLinkItem[];
  // Estilo UI
  font_size: number;
  border_radius: number;
  compact: boolean;
  motion: boolean;
  // Login
  login_slug: string;
  login_welcome_message: string;
  login_subtitle: string;
  show_sponsor_logos: boolean;
  sponsors: SponsorItem[];
  // Assets (URLs actuales + archivos pendientes)
  logo_url: string;
  favicon_url: string;
  banner_url: string;
  logo_file: File | null;
  favicon_file: File | null;
  banner_file: File | null;
};

function newSponsor(partial?: Partial<SponsorItem>): SponsorItem {
  return {
    key: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    logo_url: "",
    website_url: "",
    enabled: true,
    order: 1,
    ...partial,
  };
}

function newSocialLink(partial?: Partial<SocialLinkItem>): SocialLinkItem {
  return {
    key: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    url: "",
    icon: "web",
    enabled: true,
    order: 1,
    ...partial,
  };
}

function normalizeSponsors(
  raw:
    | Array<{
        name?: string;
        logo_url?: string;
        website_url?: string;
        enabled?: boolean;
        order?: number;
      }>
    | null
    | undefined,
): SponsorItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .map((s, i) =>
      newSponsor({
        name: s.name || "",
        logo_url: s.logo_url || "",
        website_url: s.website_url || "",
        enabled: s.enabled !== false,
        order: typeof s.order === "number" ? s.order : i + 1,
      }),
    )
    .sort((a, b) => a.order - b.order);
}

function normalizeSocialLinks(
  raw:
    | Array<{
        name?: string;
        url?: string;
        icon?: string | null;
        enabled?: boolean;
        order?: number;
      }>
    | null
    | undefined,
): SocialLinkItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .map((s, i) =>
      newSocialLink({
        name: s.name || "",
        url: s.url || "",
        icon: (s.icon || "web").toLowerCase(),
        enabled: s.enabled !== false,
        order: typeof s.order === "number" ? s.order : i + 1,
      }),
    )
    .sort((a, b) => a.order - b.order);
}

type ColumnFilters = {
  name: string;
  dni: string;
  org: string;
  domain: string;
  email: string;
};

type ConfirmAction = {
  branch: AdminBranch;
  nextActive: boolean;
};

const REQUIRED_LABELS: Record<string, string> = {
  business_name: "Nombre comercial",
  commercial_business: "Giro",
  phone: "Teléfono",
  email: "Email",
  region: "Región",
  province: "Provincia",
  commune: "Comuna",
  address: "Dirección",
};

const emptyForm = (): BranchForm => ({
  business_name: "",
  fantasy_name: "",
  commercial_business: "",
  dni: "",
  phone: "",
  email: "",
  region: "",
  province: "",
  commune: "",
  address: "",
  custom_domain: "",
  from_email: "",
  organization: "",
  is_active: true,
  allow_multi_branch_access: false,
  app_name: "",
  primary_color: "#2dd4bf",
  secondary_color: "#0d9488",
  tagline: "",
  brand_description: "",
  website_url: "",
  social_links: [],
  font_size: 14,
  border_radius: 6,
  compact: false,
  motion: true,
  login_slug: "",
  login_welcome_message: "",
  login_subtitle: "",
  show_sponsor_logos: true,
  sponsors: [],
  logo_url: "",
  favicon_url: "",
  banner_url: "",
  logo_file: null,
  favicon_file: null,
  banner_file: null,
});

function assetUrl(...candidates: Array<string | null | undefined>): string {
  for (const c of candidates) {
    const resolved = resolveMediaUrl(c);
    if (resolved) return resolved;
  }
  return "";
}

function fromBranch(b: AdminBranch): BranchForm {
  const geo = canonicalizeChileGeo({
    region: b.region || "",
    province: b.province || "",
    commune: b.commune || "",
  });
  const tc = b.theme_config;
  const login = b.login_config;
  const branding = tc?.branding;
  const label = b.fantasy_name || b.business_name;
  const theme = resolveEffectiveTheme(
    {
      primary_color: b.primary_color ?? tc?.primary_color ?? null,
      secondary_color: b.secondary_color ?? tc?.secondary_color ?? null,
      logo: b.logo ?? tc?.logo ?? branding?.logo_url ?? null,
      favicon: b.favicon ?? tc?.favicon ?? branding?.favicon_url ?? null,
      tagline: b.tagline ?? tc?.tagline ?? null,
      algorithm: b.algorithm ?? tc?.algorithm ?? null,
      app_name: tc?.app_name || null,
    },
    label,
  );

  return {
    business_name: b.business_name || "",
    fantasy_name: b.fantasy_name || "",
    commercial_business: b.commercial_business || "",
    dni: b.dni || "",
    phone: b.phone || "",
    email: b.email || "",
    region: geo.region,
    province: geo.province,
    commune: geo.commune,
    address: b.address || "",
    custom_domain: b.custom_domain || "",
    from_email: b.from_email || "",
    organization: b.organization != null ? String(b.organization) : "",
    is_active: b.is_active !== false,
    allow_multi_branch_access: Boolean(b.allow_multi_branch_access),
    app_name: tc?.app_name || "",
    primary_color: theme.primary_color || "#2dd4bf",
    secondary_color: theme.secondary_color || "#0d9488",
    tagline: b.tagline || tc?.tagline || "",
    brand_description: tc?.brand_description || b.brand_description || "",
    website_url: b.website_url || tc?.website_url || "",
    social_links: normalizeSocialLinks(
      tc?.social_links ?? branding?.social_links ?? b.social_links,
    ),
    font_size: typeof tc?.font_size === "number" ? tc.font_size : 14,
    border_radius: typeof tc?.borderRadius === "number" ? tc.borderRadius : 6,
    compact: Boolean(tc?.compact),
    motion: tc?.motion !== false,
    login_slug: b.login_slug || login?.login_slug || tc?.login_slug || "",
    login_welcome_message:
      b.login_welcome_message || login?.login_welcome_message || tc?.login_welcome_message || "",
    login_subtitle: b.login_subtitle || login?.login_subtitle || tc?.login_subtitle || "",
    show_sponsor_logos: Boolean(login?.show_sponsor_logos ?? tc?.show_sponsor_logos ?? true),
    sponsors: normalizeSponsors(login?.sponsor_logos ?? tc?.sponsor_logos),
    logo_url: assetUrl(branding?.logo_url, tc?.logo, b.logo),
    favicon_url: assetUrl(branding?.favicon_url, tc?.favicon, b.favicon),
    banner_url: assetUrl(branding?.banner_image_url, tc?.banner_image, b.banner_image),
    logo_file: null,
    favicon_file: null,
    banner_file: null,
  };
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const raw = value.trim();
  const pickerHex = toCssColorHex(raw, "#808080");
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerHex}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          title={label}
          aria-label={label}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            if (isCssColorHex(raw)) onChange(toCssColorHex(raw));
          }}
          placeholder="#0284c7"
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

function AssetField({
  label,
  hint,
  previewUrl,
  file,
  onFile,
}: {
  label: string;
  hint?: string;
  previewUrl: string;
  file: File | null;
  onFile: (file: File | null) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [previewUrl, file]);
  useEffect(() => {
    if (!file) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const src = localPreview || (!broken ? previewUrl : "") || null;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
          {src ? (
            <img
              src={src}
              alt=""
              className="h-full w-full object-contain"
              onError={() => setBroken(true)}
            />
          ) : (
            <span className="text-[10px] text-muted-foreground text-center px-1">
              {broken ? "No carga" : "Sin imagen"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/x-icon,.ico"
            className="cursor-pointer text-xs file:mr-2"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
          {file && (
            <button
              type="button"
              className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => onFile(null)}
            >
              Quitar selección ({file.name})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSucursalesPage() {
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const storeOwnerScope = isStoreOwnerScope();
  const canCreate = canCreateBranchesAdmin();
  const storeOwnerShell = storeOwnerScope && !isMultiBranchUser();
  const pageLabel = getBranchesAdminNavLabel();
  const ownedOrgIds = useMemo(
    () => (isOrgOwner && !isGlobalAdmin ? getOwnedOrganizationIds() : []),
    [isOrgOwner, isGlobalAdmin],
  );
  const singleOrgId = ownedOrgIds.length === 1 ? ownedOrgIds[0] : null;
  const primaryOrgName = isOrgOwner && !isGlobalAdmin ? getPrimaryOrganizationName() : null;
  const ownerBranchIdSet = useMemo(() => {
    if (isGlobalAdmin) return null;
    const ids = getOwnerBranchIds();
    // Organizador sin IDs en sesión: confiar en el API (ya filtra por holding).
    if (isOrgOwner && ids.length === 0) return null;
    return new Set(ids);
  }, [isGlobalAdmin, isOrgOwner]);

  const {
    data: branchesRaw = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useAdminBranches({
    enabled: true,
    refetchOnMount: "always",
  });
  const branches = useMemo(() => {
    if (!ownerBranchIdSet) return branchesRaw;
    return branchesRaw.filter((b) => ownerBranchIdSet.has(String(b.id)));
  }, [branchesRaw, ownerBranchIdSet]);
  /** Owner de una sola tienda: shell settings. Si hay 0 o >1, lista (evita UI vacía). */
  const singleStoreMode = storeOwnerShell && branches.length === 1;

  const { data: orgs = [] } = useOrganizations({
    enabled: isGlobalAdmin || isOrgOwner,
    refetchOnMount: isGlobalAdmin || isOrgOwner ? "always" : false,
  });
  const refreshBranches = useRefreshBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const updateThemeConfig = useUpdateBranchThemeConfig();

  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>("datos");
  const [editing, setEditing] = useState<AdminBranch | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyForm);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [filters, setFilters] = useState<ColumnFilters>({
    name: "",
    dni: "",
    org: "",
    domain: "",
    email: "",
  });
  const [openFilters, setOpenFilters] = useState<Partial<Record<keyof ColumnFilters, boolean>>>({});

  const editingId = editing?.id ?? null;
  const canEditCurrent = editingId != null ? canMutateBranch(editingId) : canCreate;
  const themeConfigQuery = useBranchThemeConfig(panelOpen && editingId != null ? editingId : null);
  const themeHydratedForId = useRef<string | null>(null);

  // theme-config: hidratar una sola vez por sucursal abierta (no pisar ediciones al refetch).
  useEffect(() => {
    if (!panelOpen || editingId == null) {
      themeHydratedForId.current = null;
      return;
    }
    if (!themeConfigQuery.data) return;
    const id = String(editingId);
    if (themeHydratedForId.current === id) return;
    themeHydratedForId.current = id;
    const tc = themeConfigQuery.data;
    const branding = tc.branding;
    setForm((prev) => ({
      ...prev,
      app_name: tc.app_name || prev.app_name,
      logo_url: assetUrl(branding?.logo_url, tc.logo, prev.logo_url),
      favicon_url: assetUrl(branding?.favicon_url, tc.favicon, prev.favicon_url),
      banner_url: assetUrl(branding?.banner_image_url, tc.banner_image, prev.banner_url),
      font_size: typeof tc.font_size === "number" ? tc.font_size : prev.font_size,
      border_radius: typeof tc.borderRadius === "number" ? tc.borderRadius : prev.border_radius,
      compact: typeof tc.compact === "boolean" ? tc.compact : prev.compact,
      motion: typeof tc.motion === "boolean" ? tc.motion : prev.motion,
    }));
  }, [panelOpen, editingId, themeConfigQuery.data]);

  const deferredFilters = useDeferredValue(filters);

  const provinceOptions = useMemo(() => getChileProvinces(form.region), [form.region]);
  const communeOptions = useMemo(
    () => getChileCommunes(form.region, form.province),
    [form.region, form.province],
  );
  const regionInCatalog = Boolean(resolveChileRegion(form.region));
  const provinceInCatalog = provinceOptions.some((p) => p.name === form.province);
  const communeInCatalog = communeOptions.includes(form.commune);

  const set = <K extends keyof BranchForm>(key: K, value: BranchForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setRegion = (region: string) => {
    setForm((prev) => ({ ...prev, region, province: "", commune: "" }));
  };

  const setProvince = (province: string) => {
    setForm((prev) => ({ ...prev, province, commune: "" }));
  };

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

  const filteredBranches = useMemo(() => {
    const nameQ = deferredFilters.name.trim().toLowerCase();
    const dniQ = deferredFilters.dni.trim().toLowerCase();
    const orgQ = deferredFilters.org.trim().toLowerCase();
    const domainQ = deferredFilters.domain.trim().toLowerCase();
    const emailQ = deferredFilters.email.trim().toLowerCase();

    return branches.filter((b) => {
      if (nameQ) {
        const hay = `${b.business_name || ""} ${b.fantasy_name || ""}`.toLowerCase();
        if (!hay.includes(nameQ)) return false;
      }
      if (dniQ && !(b.dni || "").toLowerCase().includes(dniQ)) return false;
      if (orgQ) {
        const hay = `${b.organization_name || ""} ${b.organization ?? ""}`.toLowerCase();
        if (!hay.includes(orgQ)) return false;
      }
      if (domainQ) {
        const hay = `${b.custom_domain || ""} ${b.login_slug || ""}`.toLowerCase();
        if (!hay.includes(domainQ)) return false;
      }
      if (emailQ && !(b.email || "").toLowerCase().includes(emailQ)) return false;
      return true;
    });
  }, [branches, deferredFilters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setFabOpen(false);
    try {
      await refreshBranches();
      toast.success("Lista actualizada");
    } catch {
      toast.error("No se pudo actualizar");
    } finally {
      setRefreshing(false);
    }
  };

  const closePanel = () => {
    // Mi Sucursal: no hay lista detrás — el editor permanece abierto.
    if (singleStoreMode) {
      setPanelTab("datos");
      return;
    }
    setPanelOpen(false);
    setEditing(null);
    setFocusedId(null);
    setPanelTab("datos");
    if (searchParams.get("view")) {
      setSearchParams({}, { replace: true });
    }
  };

  const openCreate = () => {
    if (!canCreate) {
      toast.error("No puedes crear sucursales");
      return;
    }
    setFabOpen(false);
    setEditing(null);
    setFocusedId(null);
    const base = emptyForm();
    // Organizador: la nueva sucursal nace ya vinculada a su holding.
    if (singleOrgId) {
      base.organization = singleOrgId;
    }
    setForm(base);
    setPanelTab("datos");
    setPanelOpen(true);
    setSearchParams({ view: "nuevo" }, { replace: true });
  };

  const openEdit = (b: AdminBranch, tab: PanelTab = "datos") => {
    setFabOpen(false);
    setEditing(b);
    setFocusedId(String(b.id));
    setForm(fromBranch(b));
    setPanelTab(tab);
    setPanelOpen(true);
    if (!singleStoreMode) {
      setSearchParams({ view: "editar", id: String(b.id) }, { replace: true });
    }
  };

  // OWNER de una sola tienda: siempre el editor (nunca lista).
  useEffect(() => {
    if (!singleStoreMode || isLoading) return;
    if (branches.length !== 1) return;
    if (!panelOpen || !editing || String(editing.id) !== String(branches[0].id)) {
      openEdit(branches[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- openEdit/fromBranch estables para este flujo
  }, [singleStoreMode, branches, isLoading, panelOpen, editing?.id]);

  // Breadcrumb limpia ?view=… → cerrar formulario (solo admin multi).
  useEffect(() => {
    if (singleStoreMode) return;
    if (!searchParams.get("view") && panelOpen) {
      setPanelOpen(false);
      setEditing(null);
      setFocusedId(null);
      setFabOpen(false);
    }
  }, [searchParams, panelOpen, singleStoreMode]);

  // Deep-link / refresh: hidratar formulario desde ?view=
  useEffect(() => {
    if (singleStoreMode || isLoading || panelOpen) return;
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
      const b = branches.find((x) => String(x.id) === id);
      if (b) openEdit(b);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isLoading, branches, panelOpen, singleStoreMode, canCreate]);

  const buildGeneralPayload = (): Record<string, unknown> => {
    const geo = canonicalizeChileGeo({
      region: form.region,
      province: form.province,
      commune: form.commune,
    });
    return {
      business_name: form.business_name.trim(),
      fantasy_name: form.fantasy_name.trim() || null,
      commercial_business: form.commercial_business.trim(),
      dni: form.dni.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim(),
      region: geo.region.trim(),
      province: geo.province.trim(),
      commune: geo.commune.trim(),
      address: form.address.trim(),
      custom_domain: form.custom_domain.trim() || null,
      from_email: form.from_email.trim() || null,
      organization: storeOwnerScope
        ? editing?.organization != null
          ? Number(editing.organization)
          : null
        : isOrgOwner && !isGlobalAdmin
          ? Number(singleOrgId || form.organization) || null
          : form.organization
            ? Number(form.organization)
            : null,
      is_active: form.is_active,
      allow_multi_branch_access: form.allow_multi_branch_access,
    };
  };

  const buildThemePayload = (): Record<string, unknown> => {
    return {
      primary_color: form.primary_color.trim() ? toCssColorHex(form.primary_color) : null,
      secondary_color: form.secondary_color.trim() ? toCssColorHex(form.secondary_color) : null,
      tagline: form.tagline.trim() || "",
      brand_description: form.brand_description.trim() || "",
      website_url: form.website_url.trim() || "",
      social_links: form.social_links
        .filter((s) => s.name.trim() && s.url.trim())
        .map((s, i) => ({
          name: s.name.trim(),
          url: s.url.trim(),
          icon: s.icon.trim() || "web",
          enabled: s.enabled,
          order: i + 1,
        })),
      login_slug: form.login_slug.trim() || null,
      login_welcome_message: form.login_welcome_message.trim() || "",
      login_subtitle: form.login_subtitle.trim() || "",
      show_sponsor_logos: form.show_sponsor_logos,
      sponsor_logos: form.sponsors
        .filter((s) => s.name.trim())
        .map((s, i) => ({
          name: s.name.trim(),
          logo_url: s.logo_url.trim() || "",
          website_url: s.website_url.trim() || "",
          enabled: s.enabled,
          order: i + 1,
        })),
      // Solo el campo "Nombre en la app" — no copiar fantasy/business
      app_name: form.app_name.trim() || "",
      font_size: form.font_size,
      borderRadius: form.border_radius,
      compact: form.compact,
      motion: form.motion,
    };
  };

  const updateSponsor = (key: string, patch: Partial<SponsorItem>) => {
    setForm((prev) => ({
      ...prev,
      sponsors: prev.sponsors.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));
  };

  const addSponsor = () => {
    setForm((prev) => ({
      ...prev,
      sponsors: [...prev.sponsors, newSponsor({ order: prev.sponsors.length + 1 })],
    }));
  };

  const removeSponsor = (key: string) => {
    setForm((prev) => ({
      ...prev,
      sponsors: prev.sponsors.filter((s) => s.key !== key),
    }));
  };

  const updateSocialLink = (key: string, patch: Partial<SocialLinkItem>) => {
    setForm((prev) => ({
      ...prev,
      social_links: prev.social_links.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      social_links: [...prev.social_links, newSocialLink({ order: prev.social_links.length + 1 })],
    }));
  };

  const removeSocialLink = (key: string) => {
    setForm((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((s) => s.key !== key),
    }));
  };

  const save = async () => {
    if (editing && !canMutateBranch(editing.id)) {
      toast.error("Solo lectura — no puedes editar esta sucursal");
      return;
    }
    if (!editing && !canCreate) {
      toast.error("No puedes crear sucursales");
      return;
    }
    for (const key of Object.keys(REQUIRED_LABELS) as (keyof typeof REQUIRED_LABELS)[]) {
      if (!String(form[key as keyof BranchForm]).trim()) {
        toast.error(`Campo requerido: ${REQUIRED_LABELS[key]}`);
        setPanelTab("datos");
        return;
      }
    }

    const general = buildGeneralPayload();
    const { app_name: themeAppNameRaw, ...theme } = buildThemePayload();
    const themeAppName = typeof themeAppNameRaw === "string" ? themeAppNameRaw.trim() : "";

    for (const link of form.social_links) {
      if (!link.name.trim() && !link.url.trim()) continue;
      if (!link.name.trim() || !link.url.trim()) {
        toast.error("Cada red necesita nombre y URL");
        setPanelTab("redes");
        return;
      }
      const url = link.url.trim();
      if (
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("mailto:") &&
        !url.startsWith("tel:")
      ) {
        toast.error(`URL inválida en «${link.name || "red"}» (http(s)://, mailto: o tel:)`);
        setPanelTab("redes");
        return;
      }
    }

    const hasAssetFiles = Boolean(form.logo_file || form.favicon_file || form.banner_file);

    try {
      let branchId: string | number | null = editing?.id ?? null;

      // 1) Datos + theme textual en JSON
      if (editing) {
        await updateBranch.mutateAsync({
          id: editing.id,
          data: { ...general, ...theme } as Partial<AdminBranch>,
        });
      } else {
        const created = await createBranch.mutateAsync({
          ...general,
          ...theme,
        } as Partial<AdminBranch>);
        branchId = created.id;
      }

      if (branchId == null) throw new Error("Sin id de sucursal");

      // 2) Imágenes:
      // - Branch.logo → PATCH branch multipart (campo del modelo Branch)
      // - theme.logo / favicon / banner_image → PATCH theme-config
      //   (favicon y banner NO existen en Branch; solo en theme_config)
      if (hasAssetFiles) {
        if (form.logo_file) {
          const branchFd = new FormData();
          branchFd.append("logo", form.logo_file);
          await updateBranch.mutateAsync({ id: branchId, data: branchFd });
        }

        const themeFd = new FormData();
        if (themeAppName) themeFd.append("app_name", themeAppName);
        // Branding de la app usa theme.logo (no Branch.logo)
        if (form.logo_file) themeFd.append("logo", form.logo_file);
        if (form.favicon_file) themeFd.append("favicon", form.favicon_file);
        if (form.banner_file) themeFd.append("banner_image", form.banner_file);

        const themeRes = await updateThemeConfig.mutateAsync({
          id: branchId,
          data: themeFd,
        });

        setForm((prev) => ({
          ...prev,
          logo_url: assetUrl(themeRes?.branding?.logo_url, themeRes?.logo, prev.logo_url),
          favicon_url: assetUrl(
            themeRes?.branding?.favicon_url,
            themeRes?.favicon,
            prev.favicon_url,
          ),
          banner_url: assetUrl(
            themeRes?.branding?.banner_image_url,
            themeRes?.banner_image,
            prev.banner_url,
          ),
          logo_file: null,
          favicon_file: null,
          banner_file: null,
        }));
      } else if (themeAppName) {
        await updateThemeConfig.mutateAsync({
          id: branchId,
          data: { app_name: themeAppName },
        });
      }

      toast.success(editing ? "Sucursal actualizada" : "Sucursal creada");
      if (!editing) {
        closePanel();
      } else {
        void refreshBranches();
      }
    } catch (e) {
      toast.error((e as { friendlyMessage?: string }).friendlyMessage || "Error al guardar");
    }
  };

  const askToggleActive = (b: AdminBranch) => {
    setConfirmAction({ branch: b, nextActive: b.is_active === false });
  };

  const runConfirmAction = () => {
    if (!confirmAction) return;
    const { branch, nextActive } = confirmAction;
    updateBranch.mutate(
      { id: branch.id, data: { is_active: nextActive } },
      {
        onSuccess: () => {
          toast.success(nextActive ? "Sucursal activada" : "Sucursal desactivada");
          if (focusedId === String(branch.id)) {
            setForm((prev) => ({ ...prev, is_active: nextActive }));
            setEditing((prev) => (prev ? { ...prev, is_active: nextActive } : prev));
          }
        },
        onError: (e) =>
          toast.error(
            (e as { friendlyMessage?: string }).friendlyMessage || "No se pudo cambiar el estado",
          ),
      },
    );
    setConfirmAction(null);
  };

  const panelTitle = editing
    ? singleStoreMode
      ? pageLabel
      : editing.business_name || pageLabel
    : "Nueva sucursal";
  const panelSubtitle = editing
    ? singleStoreMode
      ? editing.business_name || PANEL_SUBTITLES[panelTab].edit
      : PANEL_SUBTITLES[panelTab].edit
    : PANEL_SUBTITLES[panelTab].create;

  const saving = createBranch.isPending || updateBranch.isPending || updateThemeConfig.isPending;
  const showOrgColumn = isGlobalAdmin || isOrgOwner;
  const formReadOnly = Boolean(editing) && !canEditCurrent;

  if (isLoading) {
    return <AdminPageLoader variant="table" />;
  }

  return (
    <AdminPageMotion className={panelOpen || singleStoreMode ? "pt-3 pb-6 space-y-4" : undefined}>
      {isError && (
        <AdminMotionItem>
          <ErrorBanner
            message={`No se pudieron cargar las sucursales. ${(error as { friendlyMessage?: string })?.friendlyMessage || ""}`.trim()}
            onRetry={handleRefresh}
          />
        </AdminMotionItem>
      )}

      {storeOwnerShell && branches.length === 0 && (
        <AdminMotionItem>
          <EmptyState
            title="Sin sucursal"
            description="No tienes una sucursal asignada como propietario."
          />
        </AdminMotionItem>
      )}

      {!singleStoreMode && !panelOpen && (
        <AdminMotionItem>
          <AdminListToolbar
            countLabel={`${filteredBranches.length} sucursal${filteredBranches.length === 1 ? "" : "es"}`}
            actions={[
              {
                label: "Actualizar",
                icon: RefreshCw,
                onClick: handleRefresh,
                disabled: refreshing || isFetching,
                spinning: refreshing || isFetching,
              },
              ...(canCreate
                ? [{ label: "Nueva", icon: Plus, onClick: openCreate, variant: "default" as const }]
                : []),
            ]}
          />
          <div className="min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  {(
                    [
                      { key: "name" as const, label: "Sucursal", className: undefined },
                      {
                        key: "dni" as const,
                        label: "RUT",
                        className: "hidden sm:table-cell",
                      },
                      ...(showOrgColumn
                        ? [
                            {
                              key: "org" as const,
                              label: "Organización",
                              className: "hidden md:table-cell",
                            },
                          ]
                        : []),
                      {
                        key: "domain" as const,
                        label: "Acceso",
                        className: "hidden lg:table-cell",
                      },
                      {
                        key: "email" as const,
                        label: "Email",
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
                          isFilterVisible(col.key) ? "Cerrar filtro" : `Filtrar por ${col.label}`
                        }
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
                    {showOrgColumn && (
                      <TableHead className="pt-0 pb-3 font-normal align-top hidden md:table-cell">
                        {isFilterVisible("org") ? (
                          <Input
                            autoFocus={Boolean(openFilters.org)}
                            value={filters.org}
                            onChange={(e) => setFilter("org", e.target.value)}
                            placeholder="Nombre de organización…"
                            className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                          />
                        ) : null}
                      </TableHead>
                    )}
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
                      {isFilterVisible("email") ? (
                        <Input
                          autoFocus={Boolean(openFilters.email)}
                          value={filters.email}
                          onChange={(e) => setFilter("email", e.target.value)}
                          placeholder="correo@empresa.com"
                          className="h-8 text-xs font-normal bg-muted/30 border-border/60"
                        />
                      ) : null}
                    </TableHead>
                    <TableHead className="pt-0 pb-3" />
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {filteredBranches.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={showOrgColumn ? 6 : 5} className="p-4">
                      <EmptyState
                        title={branches.length === 0 ? "Sin sucursales" : "Sin coincidencias"}
                        description={
                          branches.length === 0
                            ? canCreate
                              ? "Crea la primera sucursal para empezar."
                              : "No tienes sucursales asignadas como propietario."
                            : "Ninguna sucursal coincide con los filtros."
                        }
                        action={
                          branches.length === 0 && canCreate ? (
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
                {filteredBranches.map((b) => {
                  const selected = focusedId === String(b.id);
                  return (
                    <TableRow
                      key={String(b.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selected && "bg-sidebar-accent/60",
                      )}
                      onClick={() => openEdit(b)}
                    >
                      <TableCell className="min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              b.is_active !== false ? "bg-emerald-500" : "bg-muted-foreground/40",
                            )}
                            title={b.is_active !== false ? "Activa" : "Inactiva"}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{b.business_name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {b.commune || b.email || "—"}
                              <span className="sm:hidden font-mono">
                                {b.dni ? ` · ${b.dni}` : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs whitespace-nowrap">
                        {b.dni || "—"}
                      </TableCell>
                      {showOrgColumn && (
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[10rem] hidden md:table-cell">
                          {b.organization_name ||
                            (b.organization != null ? `#${b.organization}` : "—")}
                        </TableCell>
                      )}
                      <TableCell
                        className="text-xs truncate max-w-[12rem] hidden lg:table-cell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(() => {
                          const orgDomain = orgs.find(
                            (o) => String(o.id) === String(b.organization),
                          )?.custom_domain;
                          const access = buildPortalAccessUrl({
                            customDomain: b.custom_domain,
                            organizationDomain: orgDomain,
                            loginSlug: b.login_slug,
                          });
                          const hasOwn =
                            Boolean(b.custom_domain?.trim()) ||
                            Boolean(orgDomain?.trim()) ||
                            Boolean(b.login_slug?.trim());
                          if (!hasOwn && access.source === "app") {
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
                                {b.custom_domain?.trim() ||
                                  orgDomain?.trim() ||
                                  b.login_slug ||
                                  "Abrir"}
                              </span>
                              <ExternalLink className="h-3 w-3 shrink-0 opacity-80" />
                            </a>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[12rem] hidden xl:table-cell">
                        {b.email || "—"}
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
                          <DropdownMenuContent align="end" className="min-w-[12rem]">
                            {PANEL_TABS.map(({ id, label, icon: Icon }) => (
                              <DropdownMenuItem key={id} onClick={() => openEdit(b, id)}>
                                <Icon className="h-3.5 w-3.5 mr-2 opacity-80" />
                                {label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            {canMutateBranch(b.id) && (
                              <DropdownMenuItem onClick={() => askToggleActive(b)}>
                                {b.is_active === false ? (
                                  <>
                                    <Power className="h-3.5 w-3.5 mr-2" /> Activar
                                  </>
                                ) : (
                                  <>
                                    <PowerOff className="h-3.5 w-3.5 mr-2" /> Desactivar
                                  </>
                                )}
                              </DropdownMenuItem>
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
            mode={singleStoreMode ? "owner" : "form"}
            panelKey={focusedId ?? "new"}
            title={
              singleStoreMode
                ? form.fantasy_name.trim() || form.business_name || panelTitle
                : panelTitle
            }
            meta={
              singleStoreMode
                ? form.commercial_business.trim() || form.email.trim() || undefined
                : undefined
            }
            subtitle={singleStoreMode ? PANEL_SUBTITLES[panelTab].edit : panelSubtitle}
            formHint={!singleStoreMode ? panelSubtitle : undefined}
            tabs={PANEL_TABS}
            tab={panelTab}
            onTabChange={(id) => setPanelTab(id as PanelTab)}
            onClose={singleStoreMode ? undefined : closePanel}
            logoUrl={form.logo_url || null}
            bannerUrl={form.banner_url || null}
            accentColor={form.primary_color || null}
            initial={(form.fantasy_name || form.business_name || "S").charAt(0)}
            active={form.is_active}
            onRefresh={singleStoreMode ? handleRefresh : undefined}
            refreshing={refreshing || isFetching}
            footer={
              <>
                {canEditCurrent ? (
                  <Button
                    className={singleStoreMode ? undefined : "min-w-[8rem]"}
                    onClick={() => void save()}
                    disabled={saving}
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Guardar
                  </Button>
                ) : (
                  <p className="self-center text-xs text-muted-foreground">Solo lectura</p>
                )}
                {!singleStoreMode && (
                  <Button variant="outline" onClick={closePanel}>
                    Cancelar
                  </Button>
                )}
              </>
            }
          >
            <fieldset
              disabled={formReadOnly}
              className="space-y-5 min-w-0 border-0 p-0 m-0 disabled:opacity-80"
            >
              {formReadOnly && (
                <p className="text-xs text-muted-foreground rounded-md border border-border/70 bg-muted/40 px-3 py-2">
                  Solo lectura — no eres propietario de esta sucursal.
                </p>
              )}
              {panelTab === "datos" && (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Identidad
                    </h3>
                    <div>
                      <Label>Nombre comercial *</Label>
                      <Input
                        value={form.business_name}
                        onChange={(e) => set("business_name", e.target.value)}
                        placeholder="ej. Café del Sur SpA"
                      />
                    </div>
                    <div>
                      <Label>Giro *</Label>
                      <Input
                        value={form.commercial_business}
                        onChange={(e) => set("commercial_business", e.target.value)}
                        placeholder="ej. Cafetería y pastelería"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Nombre fantasía</Label>
                        <Input
                          value={form.fantasy_name}
                          onChange={(e) => set("fantasy_name", e.target.value)}
                          placeholder="ej. Café del Sur"
                        />
                      </div>
                      <div>
                        <Label>RUT</Label>
                        <Input
                          value={form.dni}
                          onChange={(e) => set("dni", e.target.value)}
                          className="font-mono"
                          placeholder="76.111.222-3"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Contacto / geo *
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="contacto@empresa.cl"
                        />
                      </div>
                      <div>
                        <Label>Teléfono *</Label>
                        <Input
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div>
                        <Label>Región *</Label>
                        <Select value={form.region || undefined} onValueChange={setRegion}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {form.region && !regionInCatalog && (
                              <SelectItem value={form.region}>{form.region} (actual)</SelectItem>
                            )}
                            {CHILE_REGIONS.map((r) => (
                              <SelectItem key={r.name} value={r.name}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Provincia *</Label>
                        <Select
                          value={form.province || undefined}
                          onValueChange={setProvince}
                          disabled={!form.region}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={form.region ? "Selecciona" : "Región primero"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {form.province && !provinceInCatalog && (
                              <SelectItem value={form.province}>
                                {form.province} (actual)
                              </SelectItem>
                            )}
                            {provinceOptions.map((p) => (
                              <SelectItem key={p.name} value={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Comuna *</Label>
                        <Select
                          value={form.commune || undefined}
                          onValueChange={(v) => set("commune", v)}
                          disabled={!form.province}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={form.province ? "Selecciona" : "Provincia primero"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {form.commune && !communeInCatalog && (
                              <SelectItem value={form.commune}>{form.commune} (actual)</SelectItem>
                            )}
                            {communeOptions.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Dirección *</Label>
                      <Input
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="ej. Av. Providencia 1234, local 5"
                      />
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Operación
                    </h3>
                    <div>
                      <Label>Organización</Label>
                      {isGlobalAdmin ? (
                        <>
                          <Select
                            value={form.organization || "none"}
                            onValueChange={(v) => set("organization", v === "none" ? "" : v)}
                            disabled={formReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ninguna" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Ninguna</SelectItem>
                              {orgs.map((o) => (
                                <SelectItem key={String(o.id)} value={String(o.id)}>
                                  {o.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Solo super admin vincula o desvincula sucursales a una organización.
                          </p>
                        </>
                      ) : isOrgOwner ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {primaryOrgName ||
                            orgs.find((o) => String(o.id) === String(form.organization))?.name ||
                            editing?.organization_name ||
                            "Tu organización"}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {editing?.organization_name ||
                            (form.organization ? `#${form.organization}` : "—")}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Email de envío</Label>
                        <Input
                          value={form.from_email}
                          onChange={(e) => set("from_email", e.target.value)}
                          placeholder="noreply@empresa.cl"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={form.is_active}
                          onCheckedChange={(v) => set("is_active", v === true)}
                        />
                        Sucursal activa
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={form.allow_multi_branch_access}
                          onCheckedChange={(v) => set("allow_multi_branch_access", v === true)}
                        />
                        Permitir multi-sucursal
                      </label>
                    </div>
                  </section>
                </>
              )}

              {panelTab === "apariencia" && (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Marca
                    </h3>
                    <div>
                      <Label>Nombre en el menú</Label>
                      <Input
                        value={form.app_name}
                        onChange={(e) => set("app_name", e.target.value)}
                        placeholder="Ej. Smart Hydro"
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Aparece debajo del nombre de fantasía en el menú.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <ColorField
                        label="Color principal"
                        value={form.primary_color}
                        onChange={(v) => set("primary_color", v)}
                      />
                      <ColorField
                        label="Color secundario"
                        value={form.secondary_color}
                        onChange={(v) => set("secondary_color", v)}
                      />
                    </div>
                    <div>
                      <Label>Eslogan</Label>
                      <Input
                        value={form.tagline}
                        onChange={(e) => set("tagline", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Descripción de marca</Label>
                      <Textarea
                        value={form.brand_description}
                        onChange={(e) => set("brand_description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Imágenes
                    </h3>
                    <AssetField
                      label="Logo"
                      hint="PNG, JPG, WebP o GIF. Máximo 2 MB."
                      previewUrl={form.logo_url}
                      file={form.logo_file}
                      onFile={(f) => set("logo_file", f)}
                    />
                    <AssetField
                      label="Ícono de pestaña"
                      hint="El ícono chico del navegador. PNG, ICO o WebP. Máximo 2 MB."
                      previewUrl={form.favicon_url}
                      file={form.favicon_file}
                      onFile={(f) => set("favicon_file", f)}
                    />
                    <AssetField
                      label="Imagen de portada"
                      hint="Se muestra en la pantalla de ingreso. PNG, JPG o WebP. Máximo 2 MB."
                      previewUrl={form.banner_url}
                      file={form.banner_file}
                      onFile={(f) => set("banner_file", f)}
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
                          value={form.font_size}
                          onChange={(e) => set("font_size", Number(e.target.value) || 14)}
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">12–20 px</p>
                      </div>
                      <div>
                        <Label>Redondeo de bordes</Label>
                        <Input
                          type="number"
                          min={0}
                          max={24}
                          value={form.border_radius}
                          onChange={(e) => set("border_radius", Number(e.target.value) || 0)}
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">0–24 px</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={form.compact}
                        onCheckedChange={(v) => set("compact", v === true)}
                      />
                      Interfaz compacta
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={form.motion}
                        onCheckedChange={(v) => set("motion", v === true)}
                      />
                      Animaciones
                    </label>
                  </section>
                </>
              )}

              {panelTab === "redes" && (
                <section className="space-y-3">
                  <div>
                    <Label>Sitio web</Label>
                    <Input
                      value={form.website_url}
                      onChange={(e) => set("website_url", e.target.value)}
                      placeholder="https://…"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Redes sociales
                    </h3>
                    <Button type="button" size="sm" variant="outline" onClick={addSocialLink}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Instagram, WhatsApp, TikTok u otras redes de la sucursal.
                  </p>

                  {form.social_links.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Sin links. Agrega las redes que quieras mostrar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {form.social_links.map((link, index) => (
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
                              onClick={() => removeSocialLink(link.key)}
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
                                  updateSocialLink(link.key, { name: e.target.value })
                                }
                                placeholder="Instagram"
                              />
                            </div>
                            <div>
                              <Label>Ícono</Label>
                              <Select
                                value={link.icon || "web"}
                                onValueChange={(v) => updateSocialLink(link.key, { icon: v })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Ícono" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SOCIAL_ICON_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                  {!SOCIAL_ICON_OPTIONS.some((o) => o.value === link.icon) &&
                                    link.icon && (
                                      <SelectItem value={link.icon}>{link.icon}</SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Enlace *</Label>
                            <Input
                              value={link.url}
                              onChange={(e) => updateSocialLink(link.key, { url: e.target.value })}
                              placeholder="https://instagram.com/…"
                              className="font-mono text-sm"
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={link.enabled}
                              onCheckedChange={(v) =>
                                updateSocialLink(link.key, { enabled: v === true })
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

              {panelTab === "acceso" && (
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ingreso al portal
                  </h3>
                  <div>
                    <Label>Dominio propio</Label>
                    <Input
                      value={form.custom_domain}
                      onChange={(e) => set("custom_domain", e.target.value)}
                      placeholder="portal.cliente.com"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Opcional. Si lo tienes, tus clientes entran por ese dominio.
                    </p>
                  </div>
                  <div>
                    <Label>Nombre corto del link</Label>
                    <Input
                      value={form.login_slug}
                      onChange={(e) => set("login_slug", e.target.value)}
                      placeholder="mi-tienda"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Se usa cuando no hay dominio propio (ni de la organización).
                    </p>
                  </div>
                  <PortalAccessLinkField
                    customDomain={form.custom_domain}
                    organizationDomain={
                      orgs.find((o) => String(o.id) === String(form.organization))?.custom_domain
                    }
                    loginSlug={form.login_slug}
                  />
                  <div>
                    <Label>Mensaje de bienvenida</Label>
                    <Input
                      value={form.login_welcome_message}
                      onChange={(e) => set("login_welcome_message", e.target.value)}
                      placeholder="¡Bienvenido!"
                    />
                  </div>
                  <div>
                    <Label>Texto de apoyo</Label>
                    <Input
                      value={form.login_subtitle}
                      onChange={(e) => set("login_subtitle", e.target.value)}
                      placeholder="Ingresá con tu cuenta"
                    />
                  </div>
                </section>
              )}

              {panelTab === "patrocinadores" && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Patrocinadores
                    </h3>
                    <Button type="button" size="sm" variant="outline" onClick={addSponsor}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.show_sponsor_logos}
                      onCheckedChange={(v) => set("show_sponsor_logos", v === true)}
                    />
                    Mostrar patrocinadores al ingresar
                  </label>
                  {form.sponsors.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      Sin patrocinadores. Agrega partners con nombre, imagen y sitio web.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {form.sponsors.map((s, index) => (
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
                              onClick={() => removeSponsor(s.key)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div>
                            <Label>Nombre *</Label>
                            <Input
                              value={s.name}
                              onChange={(e) => updateSponsor(s.key, { name: e.target.value })}
                              placeholder="Sercotec"
                            />
                          </div>
                          <div>
                            <Label>Imagen</Label>
                            <Input
                              value={s.logo_url}
                              onChange={(e) => updateSponsor(s.key, { logo_url: e.target.value })}
                              placeholder="https://…/imagen.png"
                            />
                          </div>
                          <div>
                            <Label>Sitio web</Label>
                            <Input
                              value={s.website_url}
                              onChange={(e) =>
                                updateSponsor(s.key, { website_url: e.target.value })
                              }
                              placeholder="https://…"
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={s.enabled}
                              onCheckedChange={(v) => updateSponsor(s.key, { enabled: v === true })}
                            />
                            Habilitado
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </fieldset>
          </AdminEntityEditChrome>
        </AdminMotionItem>
      )}

      <AlertDialog
        open={confirmAction != null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.nextActive ? "Activar sucursal" : "Desactivar sucursal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.nextActive
                ? `¿Activar «${confirmAction.branch.business_name}»? Volverá a estar disponible en el sistema.`
                : `¿Desactivar «${confirmAction?.branch.business_name}»? Soft delete: no se borra, solo queda inactiva.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmAction?.nextActive
                  ? undefined
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }
              onClick={runConfirmAction}
            >
              {confirmAction?.nextActive ? "Activar" : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminMobileFab
        open={fabOpen}
        onOpenChange={setFabOpen}
        visible={!panelOpen && !singleStoreMode}
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
  );
}
