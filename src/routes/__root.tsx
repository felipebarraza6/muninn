import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChevronRight, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/api/hooks/useAuth";
import { BranchSwitcher } from "@/components/branch/BranchSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useBranchTheme } from "@/api/hooks/useBranchTheme";
import { getStoredBranches, getStoredUser } from "@/lib/authSession";
import {
  getBranchesAdminNavLabel,
  getOrganizationsAdminNavLabel,
  isOrganizationOwner,
  showHeaderBranchSwitcher,
} from "@/lib/authGuards";
import { getActiveBranchId, getBranchMode, setActiveBranchId } from "@/lib/branchStorage";
import { isImmersiveWorkspacePath } from "@/lib/immersiveWorkspace";
import { cn } from "@/lib/utils";

type PageMeta = {
  breadcrumb: { label: string; to?: string }[];
};

function getPageMeta(pathname: string, search = ""): PageMeta {
  if (pathname === "/") {
    return { breadcrumb: [] };
  }
  if (pathname.startsWith("/agentes")) {
    if (pathname === "/agentes/nuevo") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Agentes", to: "/agentes" },
          { label: "Nuevo" },
        ],
      };
    }
    if (pathname !== "/agentes") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Agentes", to: "/agentes" },
        ],
      };
    }
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Agentes" }] };
  }
  if (pathname.startsWith("/conversaciones")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Conversaciones" }] };
  }
  if (pathname.startsWith("/canales")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Canales" }] };
  }
  if (pathname.startsWith("/conocimiento")) {
    if (pathname === "/conocimiento/datos") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Conocimiento", to: "/conocimiento" },
          { label: "Datos" },
        ],
      };
    }
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Conocimiento" }] };
  }
  if (pathname.startsWith("/aplicaciones") || pathname.startsWith("/apis")) {
    if (pathname !== "/aplicaciones" && pathname !== "/apis") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Aplicaciones", to: "/aplicaciones" },
        ],
      };
    }
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Aplicaciones" }] };
  }
  if (pathname.startsWith("/skills") || pathname.startsWith("/funciones")) {
    if (pathname === "/skills/nuevo" || pathname === "/funciones/nuevo") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Skills", to: "/skills" },
          { label: "Nueva" },
        ],
      };
    }
    if (pathname !== "/skills" && pathname !== "/funciones") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Skills", to: "/skills" },
        ],
      };
    }
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Skills" }] };
  }
  if (pathname.startsWith("/chat")) {
    return {
      breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Studio" }, { label: "Chat" }],
    };
  }
  if (pathname.startsWith("/planes")) {
    return {
      breadcrumb: [
        { label: "Resumen", to: "/" },
        { label: "Studio" },
        { label: "Ops" },
      ],
    };
  }
  if (pathname.startsWith("/workflows")) {
    if (pathname !== "/workflows") {
      return {
        breadcrumb: [
          { label: "Resumen", to: "/" },
          { label: "Studio" },
          { label: "Workflows", to: "/workflows" },
          { label: "Canvas" },
        ],
      };
    }
    return {
      breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Studio" }, { label: "Workflows" }],
    };
  }
  if (pathname.startsWith("/admin/organizaciones")) {
    const view = new URLSearchParams(search).get("view");
    const label = getOrganizationsAdminNavLabel();
    const crumbs: PageMeta["breadcrumb"] = [
      { label: "Resumen", to: "/" },
      { label: "Admin" },
      { label, to: view ? "/admin/organizaciones" : undefined },
    ];
    if (view === "nuevo") crumbs.push({ label: "Nueva organización" });
    else if (view === "editar") crumbs.push({ label: "Editar organización" });
    return { breadcrumb: crumbs };
  }
  if (pathname.startsWith("/admin/llm")) {
    return {
      breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Admin" }, { label: "LLM" }],
    };
  }
  if (pathname.startsWith("/admin/sucursales")) {
    const view = new URLSearchParams(search).get("view");
    const label = getBranchesAdminNavLabel();
    const crumbs: PageMeta["breadcrumb"] = [
      { label: "Resumen", to: "/" },
      { label: "Admin" },
      { label, to: view ? "/admin/sucursales" : undefined },
    ];
    if (view === "nuevo") crumbs.push({ label: "Nueva sucursal" });
    else if (view === "editar") crumbs.push({ label: "Editar sucursal" });
    return { breadcrumb: crumbs };
  }
  if (pathname.startsWith("/admin/usuarios")) {
    const view = new URLSearchParams(search).get("view");
    const crumbs: PageMeta["breadcrumb"] = [
      { label: "Resumen", to: "/" },
      { label: "Admin" },
      { label: "Usuarios", to: view ? "/admin/usuarios" : undefined },
    ];
    if (view === "nuevo") crumbs.push({ label: "Nuevo usuario" });
    else if (view === "asignar") crumbs.push({ label: "Asignar a sucursal" });
    else if (view === "editar") crumbs.push({ label: "Editar usuario" });
    return { breadcrumb: crumbs };
  }
  if (pathname.startsWith("/configuracion")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Configuración" }] };
  }
  if (pathname.startsWith("/perfil")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Mi perfil" }] };
  }
  if (pathname.startsWith("/campanas")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Campañas" }] };
  }
  if (pathname.startsWith("/oportunidades")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Oportunidades" }] };
  }
  if (pathname.startsWith("/reportes")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Reportes" }] };
  }
  if (pathname.startsWith("/metricas")) {
    return { breadcrumb: [{ label: "Resumen", to: "/" }, { label: "Métricas" }] };
  }
  return { breadcrumb: [] };
}

function PageHeader() {
  const { pathname, search } = useLocation();
  const meta = getPageMeta(pathname, search);
  const [user, setUser] = useState(() => getStoredUser());
  const showBranchSwitcher = showHeaderBranchSwitcher();

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener("authUserChanged", syncUser);
    return () => window.removeEventListener("authUserChanged", syncUser);
  }, []);

  // Si una sesión previa dejó al organizador en modo "all" o con un branch
  // stale (no pertenece a sus stores), restaurar una store válida para
  // tema/logo/favicon (el switcher del header sigue oculto).
  useEffect(() => {
    if (!isOrganizationOwner()) return;
    const stored = getStoredBranches().filter((b) => b.is_active !== false);
    const active = getActiveBranchId();
    const activeOk =
      Boolean(active) &&
      getBranchMode() === "branch" &&
      stored.some((b) => String(b.branch_id) === String(active));
    if (activeOk) return;
    const first = stored[0];
    if (first?.branch_id != null) {
      setActiveBranchId(first.branch_id, true, false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b bg-card px-3 py-2 sm:gap-3 md:px-5 supports-[padding:max(0px)]:pt-[max(0.5rem,env(safe-area-inset-top))]">
      <SidebarTrigger className="h-9 w-9 shrink-0" />

      {meta.breadcrumb.length > 0 && (
        <nav
          className={cn(
            "flex items-center gap-1.5 text-sm text-muted-foreground min-w-0",
            showBranchSwitcher ? "hidden sm:flex flex-1" : "flex-1",
          )}
          aria-label="Miga de pan"
        >
          {meta.breadcrumb.map((b, i) => {
            const isLast = i === meta.breadcrumb.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={1.75} />
                )}
                {b.to && !isLast ? (
                  <Link to={b.to} className="hover:text-primary transition-colors truncate">
                    {b.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground font-medium truncate" : "truncate"}>
                    {b.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {/* Móvil: sucursal en el centro; si no hay switcher, mostrar título truncado. */}
      {showBranchSwitcher ? (
        <div className="flex flex-1 min-w-0 items-center justify-center sm:hidden">
          <BranchSwitcher compact />
        </div>
      ) : meta.breadcrumb.length > 0 ? (
        <div className="flex flex-1 min-w-0 sm:hidden">
          <span className="truncate text-sm font-medium text-foreground">
            {meta.breadcrumb[meta.breadcrumb.length - 1]?.label}
          </span>
        </div>
      ) : (
        <div className="flex-1 min-w-0 sm:hidden" />
      )}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
        {showBranchSwitcher && (
          <div className="hidden sm:block">
            <BranchSwitcher />
          </div>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-deep text-primary-foreground text-[11px] font-semibold">
                  {user?.first_name?.[0] || user?.username?.[0] || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                {user.full_name || user.email}
              </div>
            )}
            <DropdownMenuItem asChild>
              <Link to="/perfil">
                <User className="h-3.5 w-3.5 mr-2" /> Mi perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-3.5 w-3.5 mr-2" /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function RootLayout() {
  // Aplica theme de la sucursal activa en toda la shell
  const { brandPending } = useBranchTheme();
  const { pathname } = useLocation();
  const immersive = isImmersiveWorkspacePath(pathname);

  if (immersive) {
    return (
      <div
        className={cn(
          "flex h-dvh w-full overflow-hidden bg-background transition-opacity duration-300",
          brandPending && "opacity-[0.97]",
        )}
      >
        <main className="flex-1 min-w-0 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div
        className={cn(
          "flex min-h-screen w-full bg-background transition-opacity duration-300",
          brandPending && "opacity-[0.97]",
        )}
      >
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0">
          <PageHeader />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
