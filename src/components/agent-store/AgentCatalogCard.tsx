import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  catalogAmbitoLabel,
  formatCloneCount,
  type AgentCatalogListItem,
} from "@/lib/agentCatalog";
import { cn } from "@/lib/utils";

export function AgentCatalogCard({
  agent,
  className,
}: {
  agent: AgentCatalogListItem;
  className?: string;
}) {
  return (
    <Link
      to={`/agentes/${encodeURIComponent(agent.slug)}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 transition-colors",
        "hover:border-primary/40 hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-2xl"
          aria-hidden
        >
          {agent.icon?.trim() || "🐦"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary">
              {agent.name}
            </h3>
            <Badge variant="secondary" className="text-[10px]">
              {catalogAmbitoLabel(String(agent.ambito))}
            </Badge>
          </div>
          {agent.category_label ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{agent.category_label}</p>
          ) : null}
        </div>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {agent.tagline || agent.description || "Plantilla lista para clonar."}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">{formatCloneCount(agent.clone_count)}</p>
    </Link>
  );
}
