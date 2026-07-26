import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MousePointerClick } from "lucide-react";
import type { WorkItem } from "@/api/hooks/useWorkPlans";
import { StatusChip } from "@/components/ui/status-chip";
import {
  ItemKindChip,
  ItemStatusIcon,
  insumoPreview,
  itemArtifactChips,
  itemPreview,
  kindMeta,
} from "@/components/work-plans/work-plan-model";
import { itemStatusLabel, workPlanStatusTone } from "@/lib/workPlanStatus";
import { cn } from "@/lib/utils";

function SortableStep({
  item,
  idx,
  total,
  selected,
  isNext,
  isLast,
  disabled,
  onSelect,
}: {
  item: WorkItem;
  idx: number;
  total: number;
  selected: boolean;
  isNext: boolean;
  isLast: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const insumo = insumoPreview(item);
  const preview = itemPreview(item);
  const meta = kindMeta(item.kind);
  const KindIcon = meta.Icon;
  const fileChips = itemArtifactChips(item);
  const done = item.status === "done";

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn("relative flex gap-3", isDragging && "z-20 opacity-90")}
    >
      <div className="relative flex w-10 shrink-0 flex-col items-center self-stretch">
        {!isLast ? (
          <span
            aria-hidden
            className={cn(
              "absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2",
              done ? meta.rail : "bg-border/60",
            )}
          />
        ) : null}
        <button
          type="button"
          title={isNext ? `Siguiente a ejecutar · paso ${idx + 1}` : `Abrir paso ${idx + 1}`}
          onClick={onSelect}
          className={cn(
            "relative z-[1] mt-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110",
            meta.node,
            selected && "scale-110",
            isNext &&
              !selected &&
              "ring-2 ring-primary/70 ring-offset-2 ring-offset-background animate-pulse",
          )}
        >
          <KindIcon className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-background px-0.5 text-[9px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
            {idx + 1}
          </span>
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        title="Clic para ver detalle del paso"
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          "group min-w-0 flex-1 mb-4 rounded-2xl border px-3.5 py-3 transition-all cursor-pointer",
          "bg-background/55 backdrop-blur-sm",
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          selected
            ? cn(meta.selectedBg)
            : "border-border/40 hover:border-border/80 hover:bg-background/80",
          isDragging && "shadow-lg shadow-black/30 border-primary/40",
        )}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            className={cn(
              "mt-0.5 inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground",
              "hover:bg-muted/60 hover:text-foreground active:cursor-grabbing",
              disabled && "opacity-40 cursor-not-allowed",
            )}
            title="Arrastrar para reordenar"
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 space-y-1.5 text-left">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="text-sm font-semibold truncate max-w-[min(100%,18rem)]">
                {item.title}
              </span>
              {isNext ? (
                <span className="inline-flex items-center rounded-md border border-primary/35 bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  Siguiente
                </span>
              ) : null}
              <ItemKindChip kind={item.kind} />
              <ItemStatusIcon status={item.status} />
              <StatusChip
                label={itemStatusLabel(item.status)}
                tone={workPlanStatusTone(item.status)}
              />
            </div>
            {insumo ? (
              <p className="text-[11px] leading-snug">
                <span className="text-muted-foreground">Insumo · </span>
                <span className="text-foreground/85">{insumo}</span>
              </p>
            ) : null}
            {preview ? (
              <p
                className={cn(
                  "text-[11px] leading-snug line-clamp-2",
                  item.status === "failed" ? "text-destructive" : "text-muted-foreground",
                )}
              >
                <span className="text-muted-foreground/80">Resultado · </span>
                {preview}
              </p>
            ) : null}
            {fileChips.length > 0 ? (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {fileChips.map((label) => (
                  <span
                    key={label}
                    className={cn(
                      "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                      meta.chip,
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="flex items-center gap-1 text-[10px] text-primary/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <MousePointerClick className="h-3 w-3" />
              Clic para ver · arrastra el asa para reordenar
            </p>
          </div>
          <span className="text-[10px] tabular-nums text-muted-foreground/50 shrink-0 pt-1">
            {idx + 1}/{total}
          </span>
        </div>
      </div>
    </li>
  );
}

export function PlanFlowList({
  items,
  selectedItemId,
  disabled,
  onSelect,
  onReorder,
}: {
  items: WorkItem[];
  selectedItemId: string | null;
  disabled?: boolean;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const nextIdx = items.findIndex(
    (i) =>
      i.status === "pending" ||
      i.status === "queued" ||
      i.status === "running" ||
      i.status === "failed",
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    onReorder(next.map((i) => i.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ol className="relative m-0 list-none p-0">
          {items.map((item, idx) => (
            <SortableStep
              key={item.id}
              item={item}
              idx={idx}
              total={items.length}
              selected={selectedItemId === item.id}
              isNext={idx === nextIdx}
              isLast={idx === items.length - 1}
              disabled={disabled}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
