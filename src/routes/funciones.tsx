import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calculator, Code2, Loader2, Plug, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useAgentFunctions,
  type AgentFunction,
  type ImplementationType,
} from "@/api/hooks/useAgentFunctions";
import {
  AdminMotionItem,
  AdminMotionList,
  AdminPageMotion,
} from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { canViewInactiveStudioResources } from "@/lib/authGuards";
import { IMPLEMENTATION_TYPE_LABEL, normalizeSkillScope, SKILL_SCOPE_LABEL } from "@/lib/skills";
import { cn } from "@/lib/utils";

type ScopeFilter = "all" | "global" | "branch" | "agent";
type TypeFilter = "all" | "api" | "formula" | "python_code";

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "api", label: "API" },
  { value: "formula", label: "Matemática" },
  { value: "python_code", label: "Python" },
];

const SCOPE_FILTERS: { value: ScopeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "global", label: "Global" },
  { value: "branch", label: "Sucursal" },
  { value: "agent", label: "Agente" },
];

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

function SkillCard({ fn }: { fn: AgentFunction }) {
  const scope = skillScope(fn);
  const active = fn.is_active !== false;
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
          <Link to={`/skills/${fn.id}`}>
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
        {!active && (
          <span className="text-[10px] text-muted-foreground">Desactivada · ver detalle</span>
        )}
      </div>
    </article>
  );
}

export default function Funciones() {
  const showInactive = canViewInactiveStudioResources();
  const { data: functionsRaw = [], isLoading } = useAgentFunctions({
    includeInactive: showInactive,
  });
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [appFilter, setAppFilter] = useState<string>("all");

  const functions = useMemo(() => {
    if (showInactive) {
      return [...functionsRaw].sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.name || "").localeCompare(b.name || "", "es");
      });
    }
    return functionsRaw.filter((fn) => fn.is_active !== false);
  }, [functionsRaw, showInactive]);

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

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: functions.length };
    for (const fn of functions) {
      const t = fn.implementation_type || "unknown";
      counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
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
        <Button size="sm" className="shrink-0" asChild>
          <Link to="/skills/nuevo">
            <Plus className="h-4 w-4 mr-1.5" />
            Nueva skill
          </Link>
        </Button>
      </div>
    </div>
  );

  const filters = (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, slug, tipo o aplicación…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground w-12 shrink-0">Ámbito</span>
          {SCOPE_FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={scopeFilter === value ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setScopeFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground w-12 shrink-0">Tipo</span>
          {TYPE_FILTERS.map(({ value, label }) => {
            const count = typeCounts[value] ?? 0;
            const disabled = value !== "all" && count === 0;
            return (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={typeFilter === value ? "default" : "outline"}
                className="h-7 text-xs"
                disabled={disabled || isLoading}
                onClick={() => setTypeFilter(value)}
              >
                {label}
                {value !== "all" && count > 0 && <span className="ml-1 opacity-70">{count}</span>}
              </Button>
            );
          })}
        </div>

        {appsWithSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground w-12 shrink-0">App</span>
            <Button
              type="button"
              size="sm"
              variant={appFilter === "all" ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setAppFilter("all")}
            >
              Todas
            </Button>
            {appsWithSkills.map((app) => (
              <Button
                key={app.id}
                type="button"
                size="sm"
                variant={appFilter === app.id ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setAppFilter(app.id)}
              >
                {app.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminPageMotion className="space-y-5">
        {storeHeader}
        {filters}
        <div className="flex items-center justify-center min-h-[240px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminPageMotion>
    );
  }

  const hasActiveFilters =
    Boolean(search.trim()) || scopeFilter !== "all" || typeFilter !== "all" || appFilter !== "all";

  return (
    <AdminPageMotion className="space-y-5">
      {storeHeader}
      {filters}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {hasActiveFilters ? "Sin resultados" : "No hay skills"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? "Probá otro filtro o búsqueda."
                : "Creá la primera skill para que tus agentes puedan ejecutar acciones."}
            </p>
          </div>
          {!hasActiveFilters && (
            <Button size="sm" variant="outline" asChild>
              <Link to="/skills/nuevo">
                <Plus className="h-4 w-4 mr-1.5" /> Nueva skill
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <AdminMotionList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filtered.map((fn) => (
            <AdminMotionItem key={fn.id}>
              <SkillCard fn={fn} />
            </AdminMotionItem>
          ))}
        </AdminMotionList>
      )}
    </AdminPageMotion>
  );
}
