import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutDashboard,
  MessageCircle,
  MessageSquarePlus,
  Bot,
  Share2,
  LayoutGrid,
  Sparkles,
  BookOpen,
  Cpu,
  Building2,
  Network,
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
import { useActiveBranch } from "@/api/hooks/useBranches";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import {
  isSuperAdmin,
  canAccessUsersAdmin,
  canAccessLlmAdmin,
  canAccessBranchesAdmin,
  isOrganizationOwner,
  isMultiBranchUser,
  getPrimaryOrganizationName,
  getBranchesAdminNavLabel,
  getOrganizationsAdminNavLabel,
  canAccessKnowledgeCatalog,
} from "@/lib/authGuards";

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type MenuItem = {
  title: string;
  url: string;
  icon: IconComponent;
  exact?: boolean;
};

const resumenItem: MenuItem = {
  title: "Resumen",
  url: "/",
  icon: LayoutDashboard,
  exact: true,
};

const comunicacionItems: MenuItem[] = [
  { title: "Conversaciones", url: "/conversaciones", icon: MessageCircle },
  { title: "Canales", url: "/canales", icon: Share2 },
];

const baseStudioItems: MenuItem[] = [
  { title: "Chat", url: "/chat", icon: MessageSquarePlus },
  { title: "Agentes", url: "/agentes", icon: Bot },
  { title: "Aplicaciones", url: "/aplicaciones", icon: LayoutGrid },
];

function buildStudioItems(): MenuItem[] {
  const items = [...baseStudioItems];
  // Orden: Chat → Agentes → Conocimiento → Skills → Aplicaciones
  const agentesIdx = items.findIndex((i) => i.url === "/agentes");
  if (canAccessKnowledgeCatalog()) {
    items.splice(agentesIdx + 1, 0, {
      title: "Conocimiento",
      url: "/conocimiento",
      icon: BookOpen,
    });
  }
  const appsIdx = items.findIndex((i) => i.url === "/aplicaciones");
  items.splice(appsIdx >= 0 ? appsIdx : items.length, 0, {
    title: "Skills",
    url: "/skills",
    icon: Sparkles,
  });
  return items;
}

const adminItems: MenuItem[] = [
  { title: "Organizaciones", url: "/admin/organizaciones", icon: Network },
  { title: "Sucursales", url: "/admin/sucursales", icon: Building2 },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  { title: "LLM", url: "/admin/llm", icon: Cpu },
];

const usersOnlyItems: MenuItem[] = [{ title: "Usuarios", url: "/admin/usuarios", icon: Users }];

const llmOnlyItems: MenuItem[] = [{ title: "LLM", url: "/admin/llm", icon: Cpu }];

const orgGestionBaseItems: MenuItem[] = [
  { title: "Sucursales", url: "/admin/sucursales", icon: Building2 },
  { title: "Usuarios", url: "/admin/usuarios", icon: Users },
  { title: "LLM", url: "/admin/llm", icon: Cpu },
];

function buildOrgGestionItems(): MenuItem[] {
  return [
    {
      title: getOrganizationsAdminNavLabel(),
      url: "/admin/organizaciones",
      icon: Network,
    },
    ...orgGestionBaseItems,
  ];
}

function buildRoleGestionItems(): MenuItem[] {
  const items: MenuItem[] = [];
  if (canAccessBranchesAdmin()) {
    items.push({
      title: getBranchesAdminNavLabel(),
      url: "/admin/sucursales",
      icon: Building2,
    });
  }
  if (canAccessUsersAdmin()) {
    items.push(...usersOnlyItems);
  }
  if (canAccessLlmAdmin()) {
    items.push(...llmOnlyItems);
  }
  return items;
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: theme, rawTheme } = useBranchTheme();
  const { data: activeBranch } = useActiveBranch();
  const branchLogo = resolveThemeLogo(rawTheme ?? theme);
  // Título = fantasy_name | Subtítulo = app_name (como antes MUNINN / Agentes)
  const orgName = isOrganizationOwner()
    ? getPrimaryOrganizationName() || activeBranch?.organization_name?.trim() || null
    : null;
  const branchDisplayName =
    activeBranch?.fantasy_name?.trim() || activeBranch?.business_name?.trim() || null;
  // Organizador: título = nombre del holding, subtítulo = sucursal activa.
  const fantasyName = orgName ?? branchDisplayName;
  const appNameRaw = (rawTheme?.app_name || theme?.app_name || "").trim();
  const themeAppName =
    appNameRaw && appNameRaw.toLowerCase() !== "muninn" && appNameRaw.toLowerCase() !== "erp system"
      ? appNameRaw
      : null;
  // Sin multi-sucursal: no subtítulo (el título del branding ya basta).
  // Multi / organizador: subtítulo útil (sucursal activa o app_name).
  const appName = orgName
    ? (branchDisplayName ?? themeAppName)
    : isMultiBranchUser()
      ? themeAppName
      : null;
  const showAdmin = isSuperAdmin();
  const showOrgGestion = !showAdmin && isOrganizationOwner();
  const roleGestionItems = !showAdmin && !showOrgGestion ? buildRoleGestionItems() : [];
  const showRoleGestion = roleGestionItems.length > 0;
  const studioItems = buildStudioItems();
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
          branchLabel={fantasyName}
          appName={appName}
          branchLogoUrl={branchLogo}
          className="px-2 py-2.5 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-2"
        />
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                className="flex w-full min-w-0 flex-col gap-1"
                variants={listVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
              >
                {renderItems([resumenItem], "resumen")}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
            Comunicación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                className="flex w-full min-w-0 flex-col gap-1"
                variants={listVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
              >
                {renderItems(comunicacionItems, "comunicacion")}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
                {renderItems(studioItems, "studio")}
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

        {(showOrgGestion || showRoleGestion) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
              Gestión
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <motion.div
                  className="flex w-full min-w-0 flex-col gap-1"
                  variants={listVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                >
                  {renderItems(
                    showOrgGestion ? buildOrgGestionItems() : roleGestionItems,
                    "gestion",
                  )}
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
