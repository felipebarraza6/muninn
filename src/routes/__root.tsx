import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ChevronRight, Download, ArrowRight, LogOut, User } from "lucide-react";
import huginnMark from "@/assets/huginn-mark.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/api/hooks/useAuth";

type PageMeta = {
  title: string;
  breadcrumb: { label: string; to?: string }[];
  action?: { label: string; to: string; icon?: React.ComponentType<{ className?: string }> };
};

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/") {
    return { title: "Inicio", breadcrumb: [{ label: "Inicio" }] };
  }
  if (pathname.startsWith("/conversaciones")) {
    return { title: "", breadcrumb: [] };
  }
  if (pathname.startsWith("/oportunidades")) {
    return {
      title: "Oportunidades",
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Oportunidades" }],
    };
  }
  if (pathname.startsWith("/campanas")) {
    return {
      title: "Campañas",
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Campañas" }],
    };
  }
  if (pathname.startsWith("/reportes")) {
    return {
      title: "Reportes",
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Reportes" }],
      action: { label: "Exportar", to: "/reportes", icon: Download },
    };
  }
  if (pathname.startsWith("/configuracion")) {
    return {
      title: "Configuración",
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Configuración" }],
    };
  }
  if (pathname.startsWith("/metricas")) {
    return {
      title: "Métricas",
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Métricas" }],
    };
  }
  return { title: "", breadcrumb: [] };
}

function PageHeader() {
  const { pathname } = useLocation();
  const meta = getPageMeta(pathname);
  const ActionIcon = meta.action?.icon;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/95 backdrop-blur px-3 md:px-5">
      <SidebarTrigger className="h-8 w-8" />

      <div className="hidden sm:flex flex-col min-w-0 gap-0.5">
        {meta.breadcrumb.length > 1 && (
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
            {meta.breadcrumb.map((b, i) => {
              const isLast = i === meta.breadcrumb.length - 1;
              return (
                <span key={i} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && (
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-60" strokeWidth={1.75} />
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
        {meta.title && (
          <h1 className="font-display text-[15px] font-semibold leading-none tracking-tight text-foreground">
            {meta.title}
          </h1>
        )}
      </div>

      <Link
        to="/"
        className="sm:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <img src={huginnMark} alt="Huginn" className="h-6 w-auto object-contain" />
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {meta.action && (
          <>
            <Button asChild size="sm" className="hidden sm:inline-flex group">
              <Link to={meta.action.to}>
                {ActionIcon && <ActionIcon className="h-3.5 w-3.5 mr-1.5" />}
                {meta.action.label}
                <ArrowRight
                  className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </Link>
            </Button>
            <Button
              asChild
              size="icon"
              className="h-8 w-8 sm:hidden"
              aria-label={meta.action.label}
            >
              <Link to={meta.action.to}>{ActionIcon && <ActionIcon className="h-4 w-4" />}</Link>
            </Button>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-deep text-primary-foreground text-[11px] font-semibold">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
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
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0">
          <PageHeader />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
