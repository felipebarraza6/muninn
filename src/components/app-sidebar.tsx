import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home,
  MessageCircle,
  Bot,
  Share2,
  Globe,
  FunctionSquare,
  BookOpen,
  Cpu,
  Building2,
  Users,
} from "lucide-react";
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
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { isSuperAdmin } from "@/lib/authGuards";

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type MenuItem = {
  title: string;
  url: string;
  icon: IconComponent;
  exact?: boolean;
};

const baseItems: MenuItem[] = [
  { title: "Inicio", url: "/", icon: Home, exact: true },
  { title: "Agentes", url: "/agentes", icon: Bot },
  { title: "Canales", url: "/canales", icon: Share2 },
  { title: "Conocimiento", url: "/conocimiento", icon: BookOpen },
  { title: "APIs externas", url: "/apis", icon: Globe },
  { title: "Funciones", url: "/funciones", icon: FunctionSquare },
  { title: "Chat", url: "/chat", icon: MessageCircle },
];

const adminItems: MenuItem[] = [
  { title: "LLM", url: "/admin/llm", icon: Cpu },
  { title: "Sucursales", url: "/admin/sucursales", icon: Building2 },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: theme } = useBranchTheme();
  const branchLogo = resolveThemeLogo(theme);
  const showAdmin = isSuperAdmin();
  const reduceMotion = useReducedMotion();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const listVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
      };

  const itemVariants = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, x: -6 },
        show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
      };

  const renderItems = (items: MenuItem[], groupKey: string) =>
    items.map((item) => {
      const active = isActive(item.url, item.exact);
      return (
        <SidebarMenuItem key={item.url}>
          <motion.div className="relative w-full" variants={itemVariants}>
            {active && !reduceMotion && (
              <motion.span
                layoutId={`nav-active-${groupKey}`}
                className="absolute inset-0 rounded-md bg-sidebar-accent"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {active && reduceMotion && (
              <span className="absolute inset-0 rounded-md bg-sidebar-accent" />
            )}
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={item.title}
              className="relative z-[1] data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-muted rounded-md"
            >
              <Link to={item.url} className="flex items-center gap-2.5" onClick={handleNavClick}>
                <item.icon
                  className={`h-4 w-4 ${active ? "text-primary" : ""}`}
                  strokeWidth={1.75}
                />
                <span className="flex-1">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </motion.div>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-2">
        <MuninnBrand
          to="/"
          onClick={handleNavClick}
          branchLabel={theme?.app_name}
          tagline={theme?.tagline}
          branchLogoUrl={branchLogo}
          className="px-2 py-2.5 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-2"
        />
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
            Studio
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                className="flex w-full min-w-0 flex-col gap-1"
                variants={listVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
              >
                {renderItems(baseItems, "studio")}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div
                  className="flex w-full min-w-0 flex-col gap-1"
                  variants={listVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                >
                  {renderItems(adminItems, "admin")}
                </motion.div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
