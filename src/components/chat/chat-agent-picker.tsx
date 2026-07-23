import { useMemo, useState } from "react";
import {
  Bot,
  Building2,
  Check,
  ChevronDown,
  Database,
  LayoutGrid,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Agent } from "@/api/hooks/useAgents";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppIcon } from "@/components/applications/app-icon";
import { cn } from "@/lib/utils";

const ALL = "__all__";

const ACCENTS = [
  {
    bar: "from-primary/70 via-primary/40 to-transparent",
    avatar: "bg-primary/15 text-primary ring-primary/25",
  },
  {
    bar: "from-info/70 via-info/35 to-transparent",
    avatar: "bg-info-soft text-info ring-info/25",
  },
  {
    bar: "from-warning/70 via-warning/35 to-transparent",
    avatar: "bg-warning-soft text-warning ring-warning/25",
  },
  {
    bar: "from-success/70 via-success/35 to-transparent",
    avatar: "bg-success-soft text-success ring-success/25",
  },
  {
    bar: "from-chart-2/70 via-chart-2/35 to-transparent",
    avatar: "bg-muted text-foreground ring-border",
  },
] as const;

function accentFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

type ChatAgentPickerProps = {
  agents: Agent[];
  value: string | null;
  onChange: (agentId: string) => void;
  className?: string;
};

export function ChatAgentPicker({ agents, value, onChange, className }: ChatAgentPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState(ALL);
  const { data: storeApps = [] } = useExternalAPIs({ scope: "store", includeInactive: true });

  const appsById = useMemo(() => {
    const map = new Map<string, { name: string; icon?: string | null }>();
    for (const app of storeApps) {
      map.set(String(app.id), {
        name: app.name,
        icon: app.icon_display_url ?? app.icon_url ?? null,
      });
    }
    return map;
  }, [storeApps]);

  const selected = useMemo(
    () => agents.find((a) => String(a.id) === String(value)) ?? null,
    [agents, value],
  );

  const selectedSkills = Array.isArray(selected?.functions) ? selected!.functions.length : 0;
  const selectedApps = (selected?.external_apis ?? [])
    .map((id) => appsById.get(String(id)))
    .filter(Boolean);

  const branchOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of agents) {
      const n = (a.branch_name || "").trim();
      if (n) set.add(n);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [agents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((a) => {
      if (branchFilter !== ALL && (a.branch_name || "").trim() !== branchFilter) return false;
      if (!q) return true;
      const appNames = (a.external_apis ?? [])
        .map((id) => appsById.get(String(id))?.name)
        .filter(Boolean)
        .join(" ");
      const hay = [a.name, a.description, a.branch_name, a.slug, appNames]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [agents, search, branchFilter, appsById]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const triggerSubtitle = (() => {
    const bits: string[] = [];
    if (selected?.branch_name) bits.push(selected.branch_name);
    if (selectedSkills > 0) bits.push(`${selectedSkills} skill${selectedSkills === 1 ? "" : "s"}`);
    if (selectedApps.length > 0) {
      bits.push(selectedApps.length === 1 ? selectedApps[0]!.name : `${selectedApps.length} apps`);
    }
    return bits.join(" · ");
  })();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          "h-auto min-w-0 max-w-[min(100%,22rem)] gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/80",
          className,
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
          <Bot className="h-4 w-4 text-primary" />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium">
            {selected?.name ?? "Elegir agente"}
          </span>
          {triggerSubtitle ? (
            <span className="block truncate text-[11px] text-muted-foreground font-normal">
              {triggerSubtitle}
            </span>
          ) : null}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </Button>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setSearch("");
            setBranchFilter(ALL);
          }
        }}
      >
        <SheetContent
          side="right"
          className={cn(
            "w-full p-0 flex flex-col gap-0 bg-background overflow-hidden",
            "sm:max-w-xl md:max-w-2xl lg:max-w-3xl",
          )}
        >
          <SheetHeader className="px-5 pt-5 pb-3 space-y-1 text-left border-b border-border/60 shrink-0">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Elige un agente
            </SheetTitle>
            <SheetDescription>
              Galería amplia. Filtra por nombre o sucursal y elige una tarjeta.
            </SheetDescription>
          </SheetHeader>

          <div className="px-5 py-3 space-y-2.5 border-b border-border/50 bg-muted/20 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, sucursal o aplicación…"
                className="h-9 pl-8"
                autoFocus
              />
            </div>
            {branchOptions.length > 0 && (
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[220px]">
                  <SelectValue placeholder="Sucursal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas las sucursales</SelectItem>
                  {branchOptions.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 sm:p-5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <Bot className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Ningún agente coincide con el filtro.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map((agent) => {
                    const id = String(agent.id);
                    const isSelected = id === String(value);
                    const accent = accentFor(id + (agent.name || ""));
                    const skillsCount = Array.isArray(agent.functions) ? agent.functions.length : 0;
                    const linkedApps = (agent.external_apis ?? [])
                      .map((appId) => {
                        const meta = appsById.get(String(appId));
                        return meta
                          ? { id: String(appId), name: meta.name, icon: meta.icon }
                          : { id: String(appId), name: `App #${appId}`, icon: null };
                      })
                      .slice(0, 3);
                    const extraApps = Math.max(
                      0,
                      (agent.external_apis ?? []).length - linkedApps.length,
                    );

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => pick(id)}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all",
                          "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                          isSelected
                            ? "border-primary/50 bg-primary/8 ring-1 ring-primary/25 shadow-sm"
                            : "border-border/60 bg-card/60",
                        )}
                      >
                        <div className={cn("h-1 w-full bg-gradient-to-r", accent.bar)} />
                        <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
                                accent.avatar,
                              )}
                            >
                              <Bot className="h-5 w-5" strokeWidth={1.75} />
                              {isSelected && (
                                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                </span>
                              )}
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="text-sm font-semibold leading-snug line-clamp-2">
                                {agent.name}
                              </p>
                              {agent.branch_name && (
                                <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Building2 className="h-3 w-3 shrink-0 opacity-70" />
                                  <span className="truncate">{agent.branch_name}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {agent.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {agent.description}
                            </p>
                          )}

                          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-0.5">
                            <Badge
                              variant="outline"
                              className="gap-1 text-[10px] font-medium border-primary/25 bg-primary/5 text-primary"
                            >
                              <Wrench className="h-2.5 w-2.5" />
                              {skillsCount} skill{skillsCount === 1 ? "" : "s"}
                            </Badge>
                            {agent.use_rag && (
                              <Badge
                                variant="outline"
                                className="gap-1 text-[10px] font-normal border-info/30 text-info"
                              >
                                <Database className="h-2.5 w-2.5" />
                                RAG
                              </Badge>
                            )}
                            {linkedApps.length === 0 ? null : linkedApps.length === 1 ? (
                              <Badge
                                variant="outline"
                                className="gap-1.5 text-[10px] font-normal max-w-[11rem] border-border/80"
                              >
                                <AppIcon
                                  name={linkedApps[0].name}
                                  src={linkedApps[0].icon}
                                  size="sm"
                                  className="!h-3.5 !w-3.5 !rounded-sm !text-[7px]"
                                />
                                <span className="truncate">{linkedApps[0].name}</span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="gap-1 text-[10px] font-normal border-border/80"
                                title={linkedApps.map((a) => a.name).join(", ")}
                              >
                                <LayoutGrid className="h-2.5 w-2.5" />
                                {linkedApps.length + extraApps} apps
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
