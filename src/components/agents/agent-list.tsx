import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Bot,
  Brain,
  Cpu,
  Database,
  MessageSquarePlus,
  Plus,
  Sparkles,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { canCreateAgents } from "@/lib/authGuards";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useAgents, type Agent } from "@/api/hooks/useAgents";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { canViewInactiveStudioResources, isOrganizationOwner } from "@/lib/authGuards";
import { cn } from "@/lib/utils";

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
      {/* Hero header — misma línea visual que Skills */}
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
              <Bot className="h-4 w-4" strokeWidth={1.75} />
              <span className="text-[11px] font-medium uppercase tracking-[0.14em]">Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Agentes</h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Cada agente tiene su voz, modelo y conocimiento. Abrí uno para configurar o probar.
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
            {canCreateAgents() && (
              <Button size="sm" asChild className="cursor-pointer">
                <Link to="/app/agentes/nuevo">
                  <Plus className="h-4 w-4 mr-1.5" /> Nuevo
                </Link>
              </Button>
            )}
          </div>
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
          >
            <EmptyState
              title={q.trim() ? "Sin agentes para esa búsqueda" : "No hay agentes aún"}
              description={
                q.trim() ? undefined : "Crea el primero para empezar a configurar y probar."
              }
              icon={<Bot className="h-5 w-5" />}
              action={
                !q.trim() && canCreateAgents() ? (
                  <Button size="sm" asChild className="cursor-pointer">
                    <Link to="/app/agentes/nuevo">
                      <Plus className="h-4 w-4 mr-1.5" /> Crear agente
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: {},
                    show: { transition: { staggerChildren: motionTokens.stagger } },
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: motionTokens.fast, // micro-exit rápido
                        staggerChildren: motionTokens.stagger,
                        staggerDirection: -1,
                      },
                    },
                  }
            }
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit="exit"
          >
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} reduceMotion={!!reduceMotion} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentCard({ agent, reduceMotion }: { agent: Agent; reduceMotion: boolean }) {
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
              show: { opacity: 1, y: 0, transition: { duration: motionTokens.card } },
              exit: {
                opacity: 0,
                y: -8,
                scale: 0.98,
                transition: { duration: motionTokens.base, ease: motionTokens.easeOut },
              },
            }
      }
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        isInactive
          ? "border-border/40 bg-muted/40 text-muted-foreground grayscale-[0.35] opacity-80 hover:opacity-95 hover:bg-muted/50"
          : "border-border/60 bg-card/50 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg hover:shadow-primary/10",
      )}
    >
      {!isInactive && (
        <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" />
      )}

      <Link
        to={`/app/agentes/${agent.id}`}
        className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5 pb-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
              isInactive
                ? "bg-muted text-muted-foreground ring-border/60"
                : "bg-primary/15 text-primary ring-primary/25",
            )}
          >
            <Bot className="h-5 w-5" strokeWidth={1.75} />
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
            {(agent.is_default || isInactive || agent.branch_name) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {agent.branch_name && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 max-w-[160px] truncate border-border text-muted-foreground"
                    title={agent.branch_name}
                  >
                    {agent.branch_name}
                  </Badge>
                )}
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

        <div className="space-y-2 text-[12px]">
          <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
            <Cpu className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">
              <span className={cn("font-medium", !isInactive && "text-foreground/90")}>
                {modelLabel}
              </span>
              {providerLabel ? ` · ${providerLabel}` : ""}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
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

      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
        <span className="text-[11px] text-muted-foreground truncate font-mono">
          {agent.slug ? `/${agent.slug}` : `#${agent.id}`}
        </span>
        <Link
          to={`/app/chat?agent=${agent.id}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
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
