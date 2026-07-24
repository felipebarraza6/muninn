import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Store,
  Users,
  Bot,
  Share2,
  LayoutGrid,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useOrganizations, useAdminBranches } from "@/api/hooks/useBranches";
import { useAdminUsers } from "@/api/hooks/useUsers";
import { useAgents } from "@/api/hooks/useAgents";
import { useChannels } from "@/api/hooks/useChannels";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { SummaryKpiGrid, type SummaryKpi } from "@/components/dashboard/summary-kpi-grid";
import {
  getOrganizationsAdminNavLabel,
  getOwnedOrganizationIds,
  getPrimaryOrganizationName,
} from "@/lib/authGuards";

const QUICK_LINKS = [
  { href: "/admin/organizaciones", labelKey: "org", icon: Building2 },
  { href: "/admin/sucursales", label: "Sucursales", icon: Store },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/aplicaciones", label: "Aplicaciones", icon: LayoutGrid },
  { href: "/conversaciones", label: "Conversaciones", icon: MessageSquare },
] as const;

/** Resumen de holding — organizador. Sin contacto ni conversaciones. */
export function OrganizationHome() {
  const orgLabel = getOrganizationsAdminNavLabel();
  const primaryName = getPrimaryOrganizationName();
  const ownedIds = useMemo(() => new Set(getOwnedOrganizationIds()), []);

  const { data: orgsRaw = [], isLoading: orgsLoading } = useOrganizations();
  const { data: branches = [], isLoading: branchesLoading } = useAdminBranches();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs({
    scope: "store",
    includeInactive: true,
  });

  const orgs = useMemo(
    () => orgsRaw.filter((o) => ownedIds.has(String(o.id))),
    [orgsRaw, ownedIds],
  );

  const holdingBranches = useMemo(() => {
    if (ownedIds.size === 0) return branches;
    return branches.filter((b) => b.organization != null && ownedIds.has(String(b.organization)));
  }, [branches, ownedIds]);

  const isLoading =
    orgsLoading ||
    branchesLoading ||
    usersLoading ||
    agentsLoading ||
    channelsLoading ||
    apisLoading;

  const kpis: SummaryKpi[] = [
    {
      key: "stores",
      label: "Sucursales del holding",
      count: holdingBranches.filter((b) => b.is_active !== false).length,
      icon: Store,
      href: "/admin/sucursales",
      tone: "primary",
    },
    {
      key: "users",
      label: "Usuarios",
      count: users.length,
      icon: Users,
      href: "/admin/usuarios",
      tone: "info",
    },
    {
      key: "apps",
      label: "Aplicaciones visibles",
      count: apis.filter((a) => a.is_active).length,
      icon: LayoutGrid,
      href: "/aplicaciones",
      tone: "success",
    },
    {
      key: "agents",
      label: "Agentes activos",
      count: agents.filter((a) => a.is_active).length,
      icon: Bot,
      href: "/agentes",
      tone: "warning",
    },
    {
      key: "channels",
      label: "Canales activos",
      count: channels.filter((c) => c.is_active).length,
      icon: Share2,
      href: "/canales",
      tone: "info",
    },
  ];

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <AdminPageMotion>
      <AdminMotionItem>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Resumen{primaryName ? ` · ${primaryName}` : " del holding"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Stores, equipo y Studio de tu organización. Conversaciones solo de tus sucursales
              (filtra con búsqueda).
            </p>
          </div>
          <StudioBranchFilter />
        </div>
      </AdminMotionItem>

      <AdminMotionItem>
        <SummaryKpiGrid items={kpis} columnsClass="grid-cols-2 md:grid-cols-3 xl:grid-cols-5" />
      </AdminMotionItem>

      <AdminMotionItem>
        <section className="mt-6 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {QUICK_LINKS.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="h-auto py-3 justify-start gap-2"
              >
                <Link to={link.href}>
                  <link.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{"label" in link ? link.label : orgLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-50" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </AdminMotionItem>

      {orgs.length > 0 && (
        <AdminMotionItem>
          <Card className="mt-6 border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tu organización</CardTitle>
              <CardDescription>
                {orgs.length === 1
                  ? "Holding activo bajo tu cuenta."
                  : `${orgs.length} holdings asociados a tu cuenta.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {orgs.map((o) => (
                <div
                  key={String(o.id)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{o.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {o.stores_count ?? "—"} sucursales ·{" "}
                      {o.is_active === false ? "Inactiva" : "Activa"}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/admin/organizaciones">Abrir</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </AdminMotionItem>
      )}
    </AdminPageMotion>
  );
}
