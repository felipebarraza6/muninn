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
import { usePlatformStudioSummary } from "@/api/hooks/useAgents";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { SummaryKpiGrid, type SummaryKpi } from "@/components/dashboard/summary-kpi-grid";
import { ErrorBanner } from "@/components/ui/error-banner";
import { apiErrorMessage } from "@/lib/apiError";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import { selectStudioSummaryCounts } from "@/lib/platformStudioSummary";

const QUICK_LINKS = [
  { href: "/app/admin/organizaciones", label: "Organizaciones", icon: Building2 },
  { href: "/app/admin/sucursales", label: "Sucursales", icon: Store },
  { href: "/app/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/app/admin/llm", label: "LLM", icon: Cpu },
] as const;

/** Resumen de plataforma — superadmin. Sin contacto ni conversaciones. */
export function PlatformHome() {
  const { data: orgs = [], isLoading: orgsLoading, error: orgsError } = useOrganizations();
  const {
    data: branches = [],
    isLoading: branchesLoading,
    error: branchesError,
  } = useAdminBranches();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAdminUsers();
  const {
    data: studioSummary,
    isLoading: studioLoading,
    error: studioError,
  } = usePlatformStudioSummary();
  const studioBranchId = useActiveBranchId();
  const studioCounts = selectStudioSummaryCounts(studioSummary, studioBranchId);

  const isLoading = orgsLoading || branchesLoading || usersLoading;

  const platformKpis: SummaryKpi[] = [
    {
      key: "orgs",
      label: "Organizaciones",
      count: orgs.filter((o) => o.is_active !== false).length,
      icon: Building2,
      href: "/app/admin/organizaciones",
      tone: "primary",
    },
    {
      key: "branches",
      label: "Sucursales",
      count: branches.filter((b) => b.is_active !== false).length,
      icon: Store,
      href: "/app/admin/sucursales",
      tone: "success",
    },
    {
      key: "users",
      label: "Usuarios",
      count: users.length,
      icon: Users,
      href: "/app/admin/usuarios",
      tone: "info",
    },
  ];

  const studioKpis: SummaryKpi[] = [
    {
      key: "agents",
      label: studioBranchId ? "Agentes activos (sucursal)" : "Agentes activos (todas)",
      count: studioCounts?.agents ?? null,
      icon: Bot,
      href: "/app/agentes",
      tone: "primary",
    },
    {
      key: "channels",
      label: studioBranchId ? "Canales activos (sucursal)" : "Canales activos (todas)",
      count: studioCounts?.channels ?? null,
      icon: Share2,
      href: "/app/canales",
      tone: "success",
    },
    {
      key: "apis",
      label: studioBranchId ? "Aplicaciones (sucursal)" : "Aplicaciones (todas)",
      count: studioCounts?.applications ?? null,
      icon: LayoutGrid,
      href: "/app/aplicaciones",
      tone: "info",
    },
    {
      key: "skills",
      label: studioBranchId ? "Skills (sucursal)" : "Skills (todas)",
      count: studioCounts?.skills ?? null,
      icon: Sparkles,
      href: "/app/skills",
      tone: "warning",
    },
  ];

  const firstError = orgsError || branchesError || usersError;

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (firstError) {
    return (
      <div className="p-6">
        <ErrorBanner
          message={apiErrorMessage(firstError, "No se pudieron cargar los datos de plataforma")}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <AdminPageMotion>
      <AdminMotionItem>
        <PageHeader
          description="Vista global de tenants, infraestructura y catálogo Studio. Sin operación de clientes."
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Studio (filtro de sucursal)
            </h2>
            <StudioBranchFilter />
          </div>
          {studioError ? (
            <ErrorBanner
              message={apiErrorMessage(
                studioError,
                "No se pudo cargar el resumen Studio. Requiere GET /ai-agents/summary/ (superadmin).",
              )}
              onRetry={() => window.location.reload()}
            />
          ) : studioLoading && !studioSummary ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[108px] rounded-xl border border-border/60 bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <SummaryKpiGrid items={studioKpis} />
          )}
          {!studioError && !studioLoading && studioBranchId && studioCounts == null ? (
            <p className="text-xs text-muted-foreground">
              Esta sucursal no aparece en el resumen todavía (sin recursos activos). Elige «Todas
              las sucursales» para ver los totales globales.
            </p>
          ) : null}
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
              <Link to="/app/conversaciones">
                Abrir conversaciones <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AdminMotionItem>
    </AdminPageMotion>
  );
}
