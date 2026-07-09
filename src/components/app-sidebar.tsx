import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Sparkles,
  MessageSquare,
  MessageCircle,
  Megaphone,
  Bot,
  Share2,
  Globe,
  FunctionSquare,
} from "lucide-react";
import huginnMark from "@/assets/huginn-mark.png";
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
import { Badge } from "@/components/ui/badge";
import { useUnifiedConversations } from "@/api/hooks/useUnifiedConversations";

function useConversationBadge(): { mine: number; ai: number } {
  const { data = [] } = useUnifiedConversations();
  let mine = 0;
  let ai = 0;
  for (const c of data) {
    const status = (c.status || "").toLowerCase();
    if (
      status === "closed" ||
      status === "inactive" ||
      status === "spam" ||
      c.source === "internal"
    ) {
      continue;
    }
    if (c.is_waiting_human || status === "waiting_human" || status === "requires_human") {
      mine++;
    } else {
      ai++;
    }
  }
  return { mine, ai };
}

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type MenuItem = {
  title: string;
  url: string;
  icon: IconComponent;
  exact?: boolean;
  comingSoon?: boolean;
  badge?: string;
};

const baseItems: MenuItem[] = [
  { title: "Inicio", url: "/", icon: Home, exact: true },
  { title: "Chat", url: "/chat", icon: MessageCircle },
  { title: "Oportunidades", url: "/oportunidades", icon: Sparkles, comingSoon: true },
  { title: "Conversaciones", url: "/conversaciones", icon: MessageSquare },
  { title: "Campañas", url: "/campanas", icon: Megaphone, comingSoon: true },
  { title: "Agentes", url: "/agentes", icon: Bot },
  { title: "Canales", url: "/canales", icon: Share2 },
  { title: "APIs externas", url: "/apis", icon: Globe },
  { title: "Funciones", url: "/funciones", icon: FunctionSquare },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { mine, ai } = useConversationBadge();

  const items = baseItems
    .filter((item) => !item.comingSoon)
    .map((item) => {
      if (item.title === "Conversaciones") {
        const badge = mine > 0 ? String(mine) : ai > 0 ? String(ai) : undefined;
        return { ...item, badge };
      }
      return item;
    });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2.5" onClick={handleNavClick}>
          <img
            src={huginnMark}
            alt="Huginn"
            className="h-8 w-8 shrink-0 object-contain rounded-md"
          />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden min-w-0">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">HUGINN</span>
            <span className="text-[9.5px] text-muted-foreground mt-0.5 tracking-[0.12em] uppercase">
              Agentes IA
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-[10px] rounded-full bg-destructive/10 text-destructive border-0 group-data-[collapsible=icon]:hidden"
                          >
                            {item.badge}
                          </Badge>
                        )}
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
