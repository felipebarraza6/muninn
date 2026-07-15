import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Bot, Share2, Globe, FunctionSquare, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBranchTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { HuginnBrand } from "@/components/brand/HuginnBrand";

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type MenuItem = {
  title: string;
  url: string;
  icon: IconComponent;
  exact?: boolean;
};

/** Scope Agent Studio: solo dominio agentes (sin ERP/campañas). */
const baseItems: MenuItem[] = [
  { title: "Inicio", url: "/", icon: Home, exact: true },
  { title: "Agentes", url: "/agentes", icon: Bot },
  { title: "Canales", url: "/canales", icon: Share2 },
  { title: "Conocimiento", url: "/conocimiento", icon: BookOpen },
  { title: "APIs externas", url: "/apis", icon: Globe },
  { title: "Funciones", url: "/funciones", icon: FunctionSquare },
  { title: "Chat", url: "/chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: theme } = useBranchTheme();
  const branchLogo = resolveThemeLogo(theme);

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <HuginnBrand
          to="/"
          onClick={handleNavClick}
          branchLabel={theme?.app_name}
          tagline={theme?.tagline}
          branchLogoUrl={branchLogo}
          className="px-2 py-2.5"
        />
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
            Studio
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseItems.map((item) => {
                const active = isActive(item.url, item.exact);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary-deep data-[active=true]:font-medium hover:bg-muted/60 rounded-md"
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-2.5"
                        onClick={handleNavClick}
                      >
                        <item.icon
                          className={`h-4 w-4 ${active ? "text-primary" : ""}`}
                          strokeWidth={1.75}
                        />
                        <span className="flex-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
