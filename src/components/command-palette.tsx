import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  Building2,
  ClipboardList,
  Cpu,
  GitBranch,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageCircle,
  MessageSquarePlus,
  Network,
  Share2,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { logout } from "@/api/hooks/useAuth";
import {
  canAccessBranchesAdmin,
  canAccessConversations,
  canAccessKnowledgeCatalog,
  canAccessLlmAdmin,
  canAccessSkills,
  canAccessUsersAdmin,
  getBranchesAdminNavLabel,
  getOrganizationsAdminNavLabel,
  isOrganizationOwner,
  isSuperAdmin,
} from "@/lib/authGuards";

type PaletteItem = {
  id: string;
  label: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  run?: () => void;
  keywords?: string;
};

type PaletteGroup = {
  heading: string;
  items: PaletteItem[];
};

type CommandPaletteCtx = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandPaletteContext = createContext<CommandPaletteCtx | null>(null);

function buildPaletteGroups(): PaletteGroup[] {
  const showAdmin = isSuperAdmin();
  const isOrgOwner = !showAdmin && isOrganizationOwner();

  const studio: PaletteItem[] = [
    {
      id: "home",
      label: "Resumen",
      to: "/",
      icon: LayoutDashboard,
      keywords: "home inicio dashboard",
    },
    {
      id: "chat",
      label: "Chat Studio",
      to: "/chat",
      icon: MessageSquarePlus,
      keywords: "probar agente",
    },
    { id: "agentes", label: "Agentes", to: "/agentes", icon: Bot, keywords: "ai bots" },
  ];
  if (canAccessKnowledgeCatalog()) {
    studio.push({
      id: "conocimiento",
      label: "Conocimiento",
      to: "/conocimiento",
      icon: BookOpen,
      keywords: "rag docs biblioteca",
    });
  }
  if (canAccessSkills()) {
    studio.push({
      id: "skills",
      label: "Skills",
      to: "/skills",
      icon: Sparkles,
      keywords: "funciones tools",
    });
  }
  studio.push({
    id: "apps",
    label: "Aplicaciones",
    to: "/aplicaciones",
    icon: LayoutGrid,
    keywords: "apis integraciones",
  });

  const comunicacion: PaletteItem[] = [];
  if (canAccessConversations()) {
    comunicacion.push({
      id: "conversaciones",
      label: "Conversaciones",
      to: "/conversaciones",
      icon: MessageCircle,
      keywords: "inbox bandeja",
    });
  }
  comunicacion.push({
    id: "canales",
    label: "Canales",
    to: "/canales",
    icon: Share2,
    keywords: "whatsapp telegram",
  });

  const groups: PaletteGroup[] = [
    { heading: "Studio", items: studio },
    { heading: "Comunicación", items: comunicacion },
  ];

  if (showAdmin) {
    groups.push({
      heading: "OPS-agents",
      items: [
        {
          id: "planes",
          label: "Planes",
          to: "/planes",
          icon: ClipboardList,
          keywords: "ops work plans",
        },
        {
          id: "workflows",
          label: "Workflows",
          to: "/workflows",
          icon: GitBranch,
          keywords: "flujos canvas",
        },
      ],
    });
    groups.push({
      heading: "Admin",
      items: [
        {
          id: "admin-orgs",
          label: "Organizaciones",
          to: "/admin/organizaciones",
          icon: Network,
        },
        {
          id: "admin-branches",
          label: "Sucursales",
          to: "/admin/sucursales",
          icon: Building2,
        },
        { id: "admin-users", label: "Usuarios", to: "/admin/usuarios", icon: Users },
        { id: "admin-llm", label: "LLM", to: "/admin/llm", icon: Cpu, keywords: "modelos" },
      ],
    });
  } else if (isOrgOwner) {
    groups.push({
      heading: "Gestión",
      items: [
        {
          id: "org-orgs",
          label: getOrganizationsAdminNavLabel(),
          to: "/admin/organizaciones",
          icon: Network,
        },
        {
          id: "org-branches",
          label: getBranchesAdminNavLabel(),
          to: "/admin/sucursales",
          icon: Building2,
        },
        { id: "org-users", label: "Usuarios", to: "/admin/usuarios", icon: Users },
      ],
    });
  } else {
    const gestion: PaletteItem[] = [];
    if (canAccessBranchesAdmin()) {
      gestion.push({
        id: "role-branches",
        label: getBranchesAdminNavLabel(),
        to: "/admin/sucursales",
        icon: Building2,
      });
    }
    if (canAccessUsersAdmin()) {
      gestion.push({
        id: "role-users",
        label: "Usuarios",
        to: "/admin/usuarios",
        icon: Users,
      });
    }
    if (canAccessLlmAdmin()) {
      gestion.push({ id: "role-llm", label: "LLM", to: "/admin/llm", icon: Cpu });
    }
    if (gestion.length) groups.push({ heading: "Gestión", items: gestion });
  }

  groups.push({
    heading: "Cuenta",
    items: [
      { id: "perfil", label: "Mi perfil", to: "/perfil", icon: User },
      {
        id: "logout",
        label: "Cerrar sesión",
        icon: LogOut,
        keywords: "salir logout",
        run: () => logout(),
      },
    ],
  });

  return groups;
}

function CommandPaletteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const groups = useMemo(() => buildPaletteGroups(), [open]);

  const runItem = useCallback(
    (item: PaletteItem) => {
      onOpenChange(false);
      if (item.run) {
        item.run();
        return;
      }
      if (item.to) navigate(item.to);
    },
    [navigate, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ir a… agentes, planes, conocimiento" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        {groups.map((group, gi) => (
          <div key={group.heading}>
            {gi > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.label} ${item.keywords ?? ""} ${group.heading}`}
                    onSelect={() => runItem(item)}
                  >
                    <Icon className="text-muted-foreground" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k") return;
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPaletteDialog open={open} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    return {
      open: false,
      setOpen: (_: boolean) => {},
    };
  }
  return ctx;
}

/** Botón discreto para el header (muestra atajo). */
export function CommandPaletteTrigger() {
  const { setOpen } = useCommandPalette();
  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "");

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="hidden md:inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
      title="Buscar (⌘K)"
    >
      <span>Buscar</span>
      <CommandShortcut className="ml-0 tracking-normal text-[10px] opacity-80">
        {isMac ? "⌘K" : "Ctrl+K"}
      </CommandShortcut>
    </button>
  );
}
