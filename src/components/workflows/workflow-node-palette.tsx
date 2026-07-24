import { PanelLeftClose, PanelLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkflowNodeType } from "@/api/hooks/useWorkflows";
import { WORKFLOW_NODE_CATALOG } from "@/lib/workflowCatalog";
import { cn } from "@/lib/utils";

export const WF_PALETTE_MIME = "application/x-muninn-wf-node";

type Props = {
  onAdd: (type: WorkflowNodeType) => void;
  disabled?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function WorkflowNodePalette({
  onAdd,
  disabled,
  collapsed = false,
  onCollapsedChange,
}: Props) {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORKFLOW_NODE_CATALOG;
    return WORKFLOW_NODE_CATALOG.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q),
    );
  }, [query]);

  if (collapsed) {
    return (
      <div className="w-10 shrink-0 border-r bg-card/80 flex flex-col items-center py-2 gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          title="Mostrar nodos"
          onClick={() => onCollapsedChange?.(false)}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-[200px] xl:w-[220px] shrink-0 border-r bg-card/90 backdrop-blur flex flex-col min-h-0">
      <div className="shrink-0 flex items-center gap-1 border-b px-2 py-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">
          Nodos
        </p>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          title="Ocultar"
          onClick={() => onCollapsedChange?.(true)}
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="shrink-0 px-2 py-1.5 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className="h-7 pl-7 text-[11px]"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <ul className="p-1.5 space-y-0.5">
          {items.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                disabled={disabled}
                draggable={!disabled}
                onDragStart={(e) => {
                  e.dataTransfer.setData(WF_PALETTE_MIME, item.type);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => onAdd(item.type)}
                className={cn(
                  "w-full text-left rounded-lg border border-transparent px-2 py-1.5 transition-colors",
                  "hover:bg-muted/60 hover:border-border/60",
                  "active:scale-[0.98] disabled:opacity-50",
                  "cursor-grab active:cursor-grabbing",
                )}
              >
                <p className={cn("text-[11px] font-semibold", item.accent)}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                  {item.hint}
                </p>
              </button>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="px-2 py-6 text-center text-[11px] text-muted-foreground">Sin resultados</li>
          ) : null}
        </ul>
      </ScrollArea>
      <p className="shrink-0 border-t px-2 py-1.5 text-[10px] text-muted-foreground leading-snug">
        Clic o arrastrá al canvas
      </p>
    </aside>
  );
}
