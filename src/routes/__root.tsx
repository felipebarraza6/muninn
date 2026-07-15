import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
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
import { getStoredUser } from "@/lib/authSession";

type PageMeta = {
  breadcrumb: { label: string; to?: string }[];
};

function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/") {
    return { breadcrumb: [{ label: "Inicio" }] };
  }
  if (pathname.startsWith("/agentes")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Agentes" }] };
  }
  if (pathname.startsWith("/canales")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Canales" }] };
  }
  if (pathname.startsWith("/conocimiento")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Conocimiento" }] };
  }
  if (pathname.startsWith("/apis")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "APIs" }] };
  }
  if (pathname.startsWith("/funciones")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Funciones" }] };
  }
  if (pathname.startsWith("/chat")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Chat" }] };
  }
  if (pathname.startsWith("/admin/llm")) {
    return {
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Admin" }, { label: "LLM" }],
    };
  }
  if (pathname.startsWith("/admin/sucursales")) {
    return {
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Admin" }, { label: "Sucursales" }],
    };
  }
  if (pathname.startsWith("/admin/usuarios")) {
    return {
      breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Admin" }, { label: "Usuarios" }],
    };
  }
  if (pathname.startsWith("/configuracion")) {
    return { breadcrumb: [{ label: "Inicio", to: "/" }, { label: "Configuración" }] };
  }
  return { breadcrumb: [] };
}

function PageHeader() {
  const { pathname } = useLocation();
  const meta = getPageMeta(pathname);
  const user = getStoredUser();

  return (
    <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b bg-card px-3 py-2 sm:gap-3 md:px-5 supports-[padding:max(0px)]:pt-[max(0.5rem,env(safe-area-inset-top))]">
      <SidebarTrigger className="h-9 w-9 shrink-0" />

      {meta.breadcrumb.length > 0 && (
        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground min-w-0 flex-1">
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

      {/* Móvil: sucursal en el centro del espacio libre */}
      <div className="flex flex-1 min-w-0 items-center justify-center sm:hidden">
        <BranchSwitcher compact />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="hidden sm:block">
          <BranchSwitcher />
        </div>

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
  useBranchTheme();

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
