import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Calculator,
  Code2,
  Loader2,
  Plug,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAgentFunctions,
  useRestoreAgentFunction,
  type AgentFunction,
  type ImplementationType,
} from "@/api/hooks/useAgentFunctions";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import {
  canEditOwnedSkill,
  canManageSkills,
  canViewInactiveStudioResources,
} from "@/lib/authGuards";
import { IMPLEMENTATION_TYPE_LABEL, normalizeSkillScope, SKILL_SCOPE_LABEL } from "@/lib/skills";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ScopeFilter = "all" | "global" | "branch" | "agent";
type TypeFilter = "all" | "api" | "formula" | "python_code";

function skillScope(fn: AgentFunction): "global" | "branch" | "agent" {
  return normalizeSkillScope(fn.scope);
}

function TypeIcon({ type }: { type?: ImplementationType }) {
  const cls = "h-5 w-5";
  switch (type) {
    case "formula":
      return <Calculator className={cls} strokeWidth={1.75} />;
    case "api":
      return <Plug className={cls} strokeWidth={1.75} />;
    case "python_code":
      return <Code2 className={cls} strokeWidth={1.75} />;
    default:
      return <Sparkles className={cls} strokeWidth={1.75} />;
  }
}

function typeIconTone(type?: ImplementationType, active?: boolean) {
  if (!active) return "bg-muted text-muted-foreground ring-border/60";
  switch (type) {
    case "formula":
      return "bg-primary/15 text-primary ring-primary/25";
    case "api":
      return "bg-sky-500/15 text-sky-400 ring-sky-500/25";
    case "python_code":
      return "bg-amber-500/15 text-amber-400 ring-amber-500/25";
    default:
      return "bg-primary/15 text-primary ring-primary/25";
  }
}

function SkillCard({
  fn,
  onRestore,
  restoring,
}: {
  fn: AgentFunction;
  onRestore: (id: string) => void;
  restoring: boolean;
}) {
  const scope = skillScope(fn);
  const active = fn.is_active !== false;
  const canEdit = canEditOwnedSkill(fn);
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
        "hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]",
        active ? "border-border/80" : "border-border/50 opacity-75",
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ring-1 shadow-sm",
            typeIconTone(fn.implementation_type, active),
          )}
        >
          <TypeIcon type={fn.implementation_type} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm leading-snug truncate tracking-tight">
              {fn.name}
            </h3>
            <Badge variant={active ? "default" : "secondary"} className="text-[10px] font-normal">
              {active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate font-mono">
            {fn.slug ?? "sin-slug"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {fn.implementation_type
                ? IMPLEMENTATION_TYPE_LABEL[fn.implementation_type] || fn.implementation_type
                : "—"}
            </span>
            <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {SKILL_SCOPE_LABEL[scope] || scope}
            </span>
            {fn.external_api_name && (
              <span className="inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground truncate max-w-[10rem]">
                {fn.external_api_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {fn.description ? (
        <p className="mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {fn.description}
        </p>
      ) : (
        <p className="mt-3 text-[12px] text-muted-foreground/60 flex-1">Sin descripción</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 border-t border-border/50 pt-3">
        <Button size="sm" className="h-8" asChild>
          <Link to={`/app/skills/${fn.id}`}>
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
        {!active && canEdit && (
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            disabled={restoring}
            onClick={() => onRestore(fn.id)}
          >
            {restoring ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
            )}
            Reactivar
          </Button>
        )}
      </div>
    </article>
  );
}

export default function Funciones() {
  const canSeeInactive = canViewInactiveStudioResources();
  const canManage = canManageSkills();
  const [includeInactive, setIncludeInactive] = useState(canSeeInactive);
  const { data: functionsRaw = [], isLoading } = useAgentFunctions({
    includeInactive: canSeeInactive && includeInactive,
  });
  const restore = useRestoreAgentFunction();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [appFilter, setAppFilter] = useState<string>("all");

  const functions = useMemo(() => {
    if (canSeeInactive && includeInactive) {
      return [...functionsRaw].sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.name || "").localeCompare(b.name || "", "es");
      });
    }
    return functionsRaw.filter((fn) => fn.is_active !== false);
  }, [functionsRaw, canSeeInactive, includeInactive]);

  const appsWithSkills = useMemo(() => {
    const map = new Map<string, string>();
    for (const fn of functions) {
      if (!fn.external_api) continue;
      const id = String(fn.external_api);
      if (!map.has(id)) map.set(id, fn.external_api_name || id);
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [functions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return functions.filter((fn) => {
      const scope = skillScope(fn);
      if (scopeFilter !== "all" && scope !== scopeFilter) return false;
      if (typeFilter !== "all" && fn.implementation_type !== typeFilter) return false;
      if (appFilter !== "all" && String(fn.external_api ?? "") !== appFilter) {
        return false;
      }
      if (!term) return true;
      return (
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term) ||
        (fn.implementation_type
          ? (IMPLEMENTATION_TYPE_LABEL[fn.implementation_type] || "").toLowerCase()
          : ""
        ).includes(term)
      );
    });
  }, [functions, search, scopeFilter, typeFilter, appFilter]);

  const handleRestore = (id: string) => {
    setRestoringId(id);
    restore.mutate(id, {
      onSuccess: (r) => {
        toast.success(r.message || "Skill reactivada");
        setRestoringId(null);
      },
      onError: (err) => {
        toast.error(
          (err as { friendlyMessage?: string })?.friendlyMessage || "No se pudo reactivar",
        );
        setRestoringId(null);
      },
    });
  };

  const storeHeader = (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/80 to-card px-5 py-5 md:px-6 md:py-6">
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em]">Catálogo</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Capacidades que los agentes ejecutan: API, Matemática y Python. Ámbito global, sucursal
            o agente.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canSeeInactive && (
            <Button
              size="sm"
              variant={includeInactive ? "secondary" : "outline"}
              onClick={() => setIncludeInactive((v) => !v)}
            >
              {includeInactive ? "Ocultar inactivos" : "Ver inactivos"}
            </Button>
          )}
          {canManage && (
            <Button size="sm" asChild>
              <Link to="/app/skills/nuevo">
                <Plus className="h-4 w-4 mr-1.5" />
                Nueva skill
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const filters = (
    <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
      <Input
        placeholder="Buscar por nombre, slug, tipo o aplicación…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={isLoading}
        className="h-9 flex-1 min-w-0 lg:max-w-sm"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={scopeFilter}
          onValueChange={(v) => setScopeFilter(v as ScopeFilter)}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Ámbito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Ámbito: todos</SelectItem>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="branch">Sucursal</SelectItem>
            <SelectItem value="agent">Agente</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as TypeFilter)}
          disabled={isLoading}
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tipo: todos</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="formula">Matemática</SelectItem>
            <SelectItem value="python_code">Python</SelectItem>
          </SelectContent>
        </Select>
        {appsWithSkills.length > 0 && (
          <Select value={appFilter} onValueChange={setAppFilter} disabled={isLoading}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="App" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">App: todas</SelectItem>
              {appsWithSkills.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <StudioBranchFilter />
      </div>
    </div>
  );

  const reduceMotion = useReducedMotion();
  const hasActiveFilters =
    Boolean(search.trim()) || scopeFilter !== "all" || typeFilter !== "all" || appFilter !== "all";

  return (
    <AdminPageMotion className="space-y-5">
      {storeHeader}
      {filters}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.base }}
          >
            <PageSkeleton variant="cards" padded={false} />
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.base }}
            className="rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Sparkles className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {hasActiveFilters ? "Sin resultados" : "No hay skills"}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Prueba otro filtro o búsqueda."
                  : "Crea la primera skill para que tus agentes puedan ejecutar acciones."}
              </p>
            </div>
            {!hasActiveFilters && canManage && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/app/skills/nuevo">
                  <Plus className="h-4 w-4 mr-1.5" /> Nueva skill
                </Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: {},
                    show: { transition: { staggerChildren: motionTokens.stagger } },
                  }
            }
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5"
          >
            {filtered.map((fn) => (
              <motion.div
                key={fn.id}
                variants={
                  reduceMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { duration: motionTokens.card } },
                      }
                }
              >
                <SkillCard fn={fn} onRestore={handleRestore} restoring={restoringId === fn.id} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AdminPageMotion>
  );
}
