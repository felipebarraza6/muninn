import { Link } from "react-router-dom";
import {
  Building2,
  Store,
  Users,
  Cpu,
  Bot,
  Share2,
  LayoutGrid,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useOrganizations, useAdminBranches } from "@/api/hooks/useBranches";
import { useAdminUsers } from "@/api/hooks/useUsers";
import { useAgents } from "@/api/hooks/useAgents";
import { useChannels } from "@/api/hooks/useChannels";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { SummaryKpiGrid, type SummaryKpi } from "@/components/dashboard/summary-kpi-grid";

const QUICK_LINKS = [
  { href: "/admin/organizaciones", label: "Organizaciones", icon: Building2 },
  { href: "/admin/sucursales", label: "Sucursales", icon: Store },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/llm", label: "LLM", icon: Cpu },
] as const;

/** Resumen de plataforma — superadmin. Sin contacto ni conversaciones. */
export function PlatformHome() {
  const { data: orgs = [], isLoading: orgsLoading } = useOrganizations();
  const { data: branches = [], isLoading: branchesLoading } = useAdminBranches();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs({
    scope: "store",
    includeInactive: true,
  });
  const { data: skills = [], isLoading: skillsLoading } = useAgentFunctions();

  const isLoading =
    orgsLoading ||
    branchesLoading ||
    usersLoading ||
    agentsLoading ||
    channelsLoading ||
    apisLoading ||
    skillsLoading;

  const platformKpis: SummaryKpi[] = [
    {
      key: "orgs",
      label: "Organizaciones",
      count: orgs.filter((o) => o.is_active !== false).length,
      icon: Building2,
      href: "/admin/organizaciones",
      tone: "primary",
    },
    {
      key: "branches",
      label: "Sucursales",
      count: branches.filter((b) => b.is_active !== false).length,
      icon: Store,
      href: "/admin/sucursales",
      tone: "success",
    },
    {
      key: "users",
      label: "Usuarios",
      count: users.length,
      icon: Users,
      href: "/admin/usuarios",
      tone: "info",
    },
  ];

  const studioKpis: SummaryKpi[] = [
    {
      key: "agents",
      label: "Agentes activos",
      count: agents.filter((a) => a.is_active).length,
      icon: Bot,
      href: "/agentes",
      tone: "primary",
    },
    {
      key: "channels",
      label: "Canales activos",
      count: channels.filter((c) => c.is_active).length,
      icon: Share2,
      href: "/canales",
      tone: "success",
    },
    {
      key: "apis",
      label: "Aplicaciones",
      count: apis.filter((a) => a.is_active).length,
      icon: LayoutGrid,
      href: "/aplicaciones",
      tone: "info",
    },
    {
      key: "skills",
      label: "Skills",
      count: skills.filter((f) => f.is_active).length,
      icon: Sparkles,
      href: "/skills",
      tone: "warning",
    },
  ];

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <AdminPageMotion>
      <AdminMotionItem>
        <PageHeader
          description="Vista global de tenants, infraestructura y catálogo Studio. Sin operación de clientes."
          actions={<StudioBranchFilter />}
          className="mb-3"
        />
      </AdminMotionItem>

      <AdminMotionItem>
        <SummaryKpiGrid items={platformKpis} columnsClass="grid-cols-2 md:grid-cols-3" />
      </AdminMotionItem>

      <AdminMotionItem>
        <section className="mt-6 space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Accesos de administración
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_LINKS.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="h-auto py-3 justify-start gap-2"
              >
                <Link to={link.href}>
                  <link.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-50" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </AdminMotionItem>

      <AdminMotionItem>
        <section className="mt-6 space-y-3">
          <div className="flex items-end justify-between gap-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Studio (filtro de sucursal)
            </h2>
          </div>
          <SummaryKpiGrid items={studioKpis} />
        </section>
      </AdminMotionItem>

      <AdminMotionItem>
        <Card className="mt-6 border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conversaciones (análisis)</CardTitle>
            <CardDescription>
              Puedes inspeccionar la bandeja de cualquier sucursal en modo lectura. Filtra por store
              (con búsqueda) y usa el inspector de mensajes. La atención operativa queda en el
              negocio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline">
              <Link to="/conversaciones">
                Abrir conversaciones <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AdminMotionItem>
    </AdminPageMotion>
  );
}
