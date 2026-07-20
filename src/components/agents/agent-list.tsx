import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Bot,
  Brain,
  Cpu,
  Database,
  Loader2,
  MessageSquarePlus,
  Plus,
  Sparkles,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAgents, type Agent } from "@/api/hooks/useAgents";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { canViewInactiveStudioResources, isOrganizationOwner } from "@/lib/authGuards";
import { cn } from "@/lib/utils";

const ACCENTS = [
  {
    bar: "from-primary/70 via-primary/40 to-transparent",
    avatar: "bg-primary/15 text-primary ring-primary/25",
    glow: "group-hover:shadow-primary/10",
  },
  {
    bar: "from-info/70 via-info/35 to-transparent",
    avatar: "bg-info-soft text-info ring-info/25",
    glow: "group-hover:shadow-info/10",
  },
  {
    bar: "from-warning/70 via-warning/35 to-transparent",
    avatar: "bg-warning-soft text-warning ring-warning/25",
    glow: "group-hover:shadow-warning/10",
  },
  {
    bar: "from-success/70 via-success/35 to-transparent",
    avatar: "bg-success-soft text-success ring-success/25",
    glow: "group-hover:shadow-success/10",
  },
  {
    bar: "from-chart-2/70 via-chart-2/35 to-transparent",
    avatar: "bg-muted text-foreground ring-border",
    glow: "group-hover:shadow-foreground/5",
  },
] as const;

function accentFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

export function AgentList() {
  const canSeeInactive = canViewInactiveStudioResources();
  const isOrgOwner = isOrganizationOwner();
  /**
   * Organizador: por defecto ve activos + inactivos de sus sucursales (para reactivar).
   * Resto con permiso: toggle; por defecto solo activos.
   */
  const [includeInactive, setIncludeInactive] = useState(isOrgOwner);
  const { data: agentsRaw = [], isLoading } = useAgents(
    canSeeInactive && includeInactive ? { includeInactive: true } : { is_active: true },
  );
  const [q, setQ] = useState("");
  const reduceMotion = useReducedMotion();

  const agents = useMemo(() => {
    if (canSeeInactive && includeInactive) return agentsRaw;
    return agentsRaw.filter((a) => a.is_active !== false);
  }, [agentsRaw, canSeeInactive, includeInactive]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = !term
      ? agents
      : agents.filter((a) => {
          const hay = [
            a.name,
            a.description,
            a.welcome_message,
            a.llm_provider_name,
            a.llm_model_name,
            a.slug,
            a.agent_type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(term);
        });
    // Activos primero, inactivos al final.
    return [...list].sort((a, b) => {
      const aActive = a.is_active !== false ? 0 : 1;
      const bActive = b.is_active !== false ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return (a.name || "").localeCompare(b.name || "", "es");
    });
  }, [agents, q]);

  const stats = useMemo(() => {
    const active = agents.filter((a) => a.is_active).length;
    const inactive = agents.filter((a) => a.is_active === false).length;
    const withRag = agents.filter((a) => a.use_rag).length;
    return { total: agents.length, active, inactive, withRag };
  }, [agents]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            Cada agente tiene su voz, modelo y conocimiento. Elige uno para configurar o probar.
          </p>
          {!isLoading && agents.length > 0 && (
            <p className="text-[11px] text-muted-foreground/80 tabular-nums">
              {stats.active} activos
              {includeInactive && stats.inactive > 0 ? ` · ${stats.inactive} inactivos` : ""}
              {" · "}
              {stats.withRag} con RAG · {stats.total} en total
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {canSeeInactive && (
            <Button
              size="sm"
              variant={includeInactive ? "secondary" : "outline"}
              onClick={() => setIncludeInactive((v) => !v)}
            >
              {includeInactive ? "Ocultar inactivos" : "Ver inactivos"}
            </Button>
          )}
          <Button size="sm" asChild className="cursor-pointer">
            <Link to="/agentes/nuevo">
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, modelo o descripción…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[220px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            {q.trim()
              ? "Sin agentes para esa búsqueda."
              : "No hay agentes aún. Crea el primero para empezar."}
          </p>
          {!q.trim() && (
            <Button size="sm" asChild className="mt-4 cursor-pointer">
              <Link to="/agentes/nuevo">
                <Plus className="h-4 w-4 mr-1.5" /> Crear agente
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={
            reduceMotion
              ? undefined
              : {
                  hidden: {},
                  show: { transition: { staggerChildren: 0.045 } },
                }
          }
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} reduceMotion={!!reduceMotion} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function AgentCard({ agent, reduceMotion }: { agent: Agent; reduceMotion: boolean }) {
  const accent = accentFor(String(agent.id) + (agent.name || ""));
  const isInactive = agent.is_active === false;
  const modelLabel = agent.llm_model_name || agent.model_name || agent.llm_model_id || "Sin modelo";
  const providerLabel = agent.llm_provider_name || agent.llm_provider_type || null;
  const knowledgeCount = Array.isArray(agent.knowledge_documents)
    ? agent.knowledge_documents.length
    : null;
  const skillsCount = Array.isArray(agent.functions) ? agent.functions.length : null;
  const temp =
    typeof agent.temperature === "number" && !Number.isNaN(agent.temperature)
      ? agent.temperature
      : null;

  return (
    <motion.div
      variants={
        reduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
            }
      }
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        isInactive
          ? "border-border/40 bg-muted/40 text-muted-foreground grayscale-[0.35] opacity-80 hover:opacity-95 hover:bg-muted/50"
          : cn(
              "border-border/60 bg-card/50",
              "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg",
              accent.glow,
            ),
      )}
    >
      {!isInactive && <div className={cn("h-1 w-full bg-gradient-to-r", accent.bar)} />}

      <Link
        to={`/agentes/${agent.id}`}
        className="flex flex-1 flex-col gap-4 p-4 sm:p-5 pb-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
              isInactive ? "bg-muted text-muted-foreground ring-border/60" : accent.avatar,
            )}
          >
            <Bot className="h-6 w-6" strokeWidth={1.75} />
            {isInactive ? (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/45 ring-2 ring-muted" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-semibold text-[15px] leading-snug truncate transition-colors",
                  isInactive ? "text-muted-foreground" : "group-hover:text-primary",
                )}
              >
                {agent.name}
              </h3>
              <ArrowUpRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-all",
                  isInactive
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                )}
              />
            </div>
            {(agent.is_default || isInactive) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {agent.is_default && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] h-5 gap-1",
                      isInactive
                        ? "border-border text-muted-foreground"
                        : "border-primary/30 text-primary",
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    Default
                  </Badge>
                )}
                {isInactive && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    Inactivo
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl border px-3 py-2.5 space-y-2",
            isInactive ? "border-border/40 bg-muted/30" : "border-border/50 bg-muted/25",
          )}
        >
          <div className="flex items-start gap-2 min-w-0">
            <Cpu
              className={cn(
                "h-3.5 w-3.5 mt-0.5 shrink-0",
                isInactive ? "text-muted-foreground" : "text-primary",
              )}
            />
            <div className="min-w-0">
              <div
                className={cn(
                  "text-[12px] font-medium truncate",
                  isInactive && "text-muted-foreground",
                )}
              >
                {modelLabel}
              </div>
              {providerLabel && (
                <div className="text-[10px] text-muted-foreground truncate">{providerLabel}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5 border-t border-border/40">
            <MetaChip
              icon={Database}
              label={agent.use_rag ? `RAG · top ${agent.rag_top_k ?? "—"}` : "Sin RAG"}
              muted={!agent.use_rag || isInactive}
            />
            <MetaChip
              icon={Thermometer}
              label={temp != null ? `Temp ${temp}` : "Temp —"}
              muted={temp == null || isInactive}
            />
            {knowledgeCount != null && (
              <MetaChip
                icon={Brain}
                label={knowledgeCount === 1 ? "1 documento" : `${knowledgeCount} docs`}
                muted={knowledgeCount === 0 || isInactive}
              />
            )}
            {skillsCount != null && (
              <MetaChip
                icon={Wrench}
                label={skillsCount === 1 ? "1 skill" : `${skillsCount} skills`}
                muted={skillsCount === 0 || isInactive}
              />
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <span className="text-[11px] text-muted-foreground truncate font-mono">
          {agent.slug ? `/${agent.slug}` : `#${agent.id}`}
        </span>
        <Link
          to={`/chat?agent=${agent.id}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
            isInactive
              ? "text-muted-foreground hover:bg-muted"
              : "text-primary hover:bg-primary/10",
          )}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          Probar
        </Link>
      </div>
    </motion.div>
  );
}

function MetaChip({
  icon: Icon,
  label,
  muted,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[11px] min-w-0",
        muted ? "text-muted-foreground/70" : "text-foreground/80",
      )}
    >
      <Icon className="h-3 w-3 shrink-0 opacity-70" />
      <span className="truncate">{label}</span>
    </div>
  );
}
