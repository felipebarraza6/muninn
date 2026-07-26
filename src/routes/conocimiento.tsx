import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useKnowledgeCatalog,
  useKnowledgeCategories,
  useKnowledgeList,
  useDeleteKnowledge,
  useDeleteKnowledgeCategory,
  useRenameKnowledgeCategory,
  useUpdateKnowledge,
  isKnowledgeIndexed,
  type AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import { useAgents } from "@/api/hooks/useAgents";
import { knowledgeCardPreview, knowledgeTypeLabel, knowledgeTypeMeta } from "@/lib/knowledge-types";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import {
  canHardDeleteKnowledge,
  canManageKnowledge,
  canRestoreKnowledge,
  canViewInactiveKnowledge,
} from "@/lib/authGuards";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cronLabel, mappingLabel } from "@/components/knowledge/knowledge-api-refresh-section";

const ALL_CATEGORIES = "__all__";

function AutoRefreshBadge({ doc }: { doc: AgentKnowledge }) {
  const cfg = doc.api_refresh_config;
  if (!cfg) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="text-[10px] gap-1 font-normal border-primary/35 text-primary"
          >
            <RefreshCw className="h-3 w-3" />
            Auto
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px]">
          <p className="font-medium">Auto-refresh desde API</p>
          <p className="text-[11px] opacity-90">
            {cfg.endpoint || "—"} · {cronLabel(cfg.cron) || cfg.cron}
          </p>
          {cfg.content_mapping?.type ? (
            <p className="text-[11px] opacity-75">
              Mapping: {mappingLabel(cfg.content_mapping.type)}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type PendingAction =
  | { type: "deactivate"; doc: AgentKnowledge }
  | { type: "hard"; doc: AgentKnowledge };

type CategoryDialog = { type: "rename"; name: string } | { type: "delete"; name: string } | null;

function KnowledgeCard({
  doc,
  agentCount,
  indexed,
  canManage,
  canRestore,
  canHardDelete,
  restoring,
  onDeactivate,
  onRestore,
  onHardDelete,
}: {
  doc: AgentKnowledge;
  agentCount: number;
  indexed: boolean;
  canManage: boolean;
  canRestore: boolean;
  canHardDelete: boolean;
  restoring: boolean;
  onDeactivate: () => void;
  onRestore: () => void;
  onHardDelete: () => void;
}) {
  const { label, Icon, style } = knowledgeTypeMeta(doc.knowledge_type);
  const preview = knowledgeCardPreview(doc);
  const inactive = doc.is_active === false;

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border bg-card/60 p-4 transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] hover:border-primary/25",
        inactive ? "border-border/60 opacity-70 grayscale" : style.border,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
            inactive ? "bg-muted text-muted-foreground" : style.soft,
          )}
        >
          <Icon className={cn("h-5 w-5", inactive ? "text-muted-foreground" : style.icon)} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="font-medium text-sm leading-snug line-clamp-2">{doc.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                style.chip,
              )}
            >
              {label}
            </span>
            {doc.category?.trim() ? (
              <Badge variant="outline" className="text-[10px] font-normal">
                {doc.category.trim()}
              </Badge>
            ) : null}
            {inactive && (
              <Badge variant="secondary" className="text-[10px] font-normal">
                Inactivo
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] gap-1 font-normal",
                agentCount > 0 ? "border-primary/30 text-primary" : "text-muted-foreground",
              )}
            >
              <Users className="h-3 w-3" />
              {agentCount > 0
                ? `${agentCount} agente${agentCount === 1 ? "" : "s"}`
                : "Sin asignar"}
            </Badge>
            {indexed && (
              <Badge
                variant="outline"
                className="text-[10px] gap-1 font-normal text-muted-foreground"
              >
                <CheckCircle2 className="h-3 w-3" />
                Indexado
              </Badge>
            )}
            <AutoRefreshBadge doc={doc} />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground line-clamp-3 leading-relaxed flex-1">
        {preview}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" asChild>
          <Link to={`/conocimiento/${doc.id}`}>
            <Eye className="h-3.5 w-3.5" />
            Ver
          </Link>
        </Button>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-1">
          {inactive && canRestore && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={restoring}
              onClick={onRestore}
              title="Reactivar"
            >
              {restoring ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
              )}
              Reactivar
            </Button>
          )}
          {!inactive && canManage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground"
              onClick={onDeactivate}
              title="Desactivar"
            >
              Desactivar
            </Button>
          )}
          {canHardDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-destructive hover:text-destructive"
              onClick={onHardDelete}
              title="Eliminar permanentemente"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Conocimiento() {
  const showInactive = canViewInactiveKnowledge();
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const selectedCategory = categoryFilter === ALL_CATEGORIES ? null : categoryFilter;
  const {
    data: docsRaw = [],
    isLoading,
    refetch,
  } = useKnowledgeCatalog({
    ...(showInactive ? { includeInactive: true } : {}),
    category: selectedCategory,
  });
  const { data: categories = [] } = useKnowledgeCategories();
  const { data: agents = [] } = useAgents(
    showInactive ? { includeInactive: true } : { is_active: true },
  );
  const remove = useDeleteKnowledge();
  const update = useUpdateKnowledge();
  const renameCategory = useRenameKnowledgeCategory();
  const deleteCategory = useDeleteKnowledgeCategory();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [categoryDialog, setCategoryDialog] = useState<CategoryDialog>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 280);
    return () => window.clearTimeout(t);
  }, [q]);

  const { data: searchPayload, isFetching: searching } = useKnowledgeList({
    q: debouncedQ,
    top_k: 40,
  });

  const docs = useMemo(() => {
    if (showInactive) {
      return [...docsRaw].sort((a, b) => {
        const aActive = a.is_active !== false ? 0 : 1;
        const bActive = b.is_active !== false ? 0 : 1;
        if (aActive !== bActive) return aActive - bActive;
        return (a.title || "").localeCompare(b.title || "", "es");
      });
    }
    return docsRaw.filter((d) => d.is_active !== false);
  }, [docsRaw, showInactive]);

  const agentCountByDoc = useMemo(() => {
    const map = new Map<string, number>();
    for (const agent of agents) {
      for (const raw of agent.knowledge_documents ?? []) {
        const id = String(raw);
        map.set(id, (map.get(id) ?? 0) + 1);
      }
    }
    return map;
  }, [agents]);

  const filtered = useMemo(() => {
    const term = debouncedQ.toLowerCase();
    const searchHits = searchPayload?.results ?? [];

    // Búsqueda semántica/API cuando hay ≥2 chars; fallback local si no hay hits.
    if (term.length >= 2 && searchHits.length > 0) {
      const byId = new Map(docs.map((d) => [String(d.id), d]));
      const ranked: AgentKnowledge[] = [];
      for (const hit of searchHits) {
        const doc = byId.get(String(hit.id));
        if (doc) ranked.push(doc);
      }
      // Incluir matches locales que el search no devolvió (título/categoría).
      const seen = new Set(ranked.map((d) => String(d.id)));
      for (const d of docs) {
        if (seen.has(String(d.id))) continue;
        const localHit =
          d.title.toLowerCase().includes(term) ||
          (d.summary || "").toLowerCase().includes(term) ||
          (d.category || "").toLowerCase().includes(term);
        if (localHit) ranked.push(d);
      }
      return ranked;
    }

    if (!term) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        (d.summary || "").toLowerCase().includes(term) ||
        (d.category || "").toLowerCase().includes(term) ||
        knowledgeTypeLabel(d.knowledge_type).toLowerCase().includes(term) ||
        d.knowledge_type.toLowerCase().includes(term),
    );
  }, [docs, debouncedQ, searchPayload?.results]);

  const openRenameCategory = (name: string) => {
    setRenameValue(name);
    setCategoryDialog({ type: "rename", name });
  };

  const openDeleteCategory = (name: string) => {
    setCategoryDialog({ type: "delete", name });
  };

  const submitRenameCategory = () => {
    if (!categoryDialog || categoryDialog.type !== "rename") return;
    const from = categoryDialog.name;
    const next = renameValue.trim();
    if (!next || next === from) {
      setCategoryDialog(null);
      return;
    }
    if (next.length > 80) {
      toast.error("La categoría admite máximo 80 caracteres");
      return;
    }
    renameCategory.mutate(
      { from, to: next },
      {
        onSuccess: (res) => {
          toast.success(`Categoría renombrada (${res.updated} docs)`);
          if (categoryFilter === from) setCategoryFilter(next);
          setCategoryDialog(null);
          void refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo renombrar")),
      },
    );
  };

  const submitDeleteCategory = () => {
    if (!categoryDialog || categoryDialog.type !== "delete") return;
    const name = categoryDialog.name;
    deleteCategory.mutate(
      { name },
      {
        onSuccess: (res) => {
          toast.success(`Categoría eliminada (${res.cleared} docs)`);
          if (categoryFilter === name) setCategoryFilter(ALL_CATEGORIES);
          setCategoryDialog(null);
          void refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo eliminar la categoría")),
      },
    );
  };

  return (
    <AdminPageMotion className="space-y-4 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Biblioteca de documentos. Se preparan para RAG al asignarlos a un agente.
        </p>
        <div className="flex gap-2 items-center flex-wrap justify-end shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link to="/conocimiento/datos">
              <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Datos
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/conocimiento/nuevo">
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1 min-w-0 sm:max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar en la biblioteca (título, RAG…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 pl-8"
          />
          {searching ? (
            <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : null}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory && canManageKnowledge() ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                title="Gestionar categoría"
                disabled={renameCategory.isPending || deleteCategory.isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openRenameCategory(selectedCategory)}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Renombrar categoría
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => openDeleteCategory(selectedCategory)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Quitar categoría
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <StudioBranchFilter />
      </div>

      {debouncedQ.length >= 2 && (searchPayload?.results?.length ?? 0) > 0 ? (
        <p className="text-[11px] text-muted-foreground -mt-1">
          Ordenado por relevancia del índice ({searchPayload?.count ?? filtered.length}{" "}
          coincidencias).
        </p>
      ) : null}

      {isLoading ? (
        <PageSkeleton variant="list" padded={false} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={q.trim() ? "Sin resultados" : "Biblioteca vacía"}
          description={
            q.trim()
              ? "Prueba otro término o limpia el filtro de categoría."
              : "Crea el primer documento para usarlo en agentes con RAG."
          }
          action={
            !q.trim() ? (
              <Button size="sm" asChild>
                <Link to="/conocimiento/nuevo">
                  <Plus className="h-4 w-4 mr-1.5" /> Nuevo
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((doc) => {
            const canManage = canManageKnowledge(doc.branch);
            const canHardDelete = canHardDeleteKnowledge(doc.branch);
            return (
              <KnowledgeCard
                key={doc.id}
                doc={doc}
                agentCount={agentCountByDoc.get(String(doc.id)) ?? 0}
                indexed={isKnowledgeIndexed(doc)}
                canManage={canManage}
                canRestore={canRestoreKnowledge(doc.branch)}
                canHardDelete={canHardDelete}
                restoring={restoringId === String(doc.id)}
                onDeactivate={() => setPending({ type: "deactivate", doc })}
                onHardDelete={() => setPending({ type: "hard", doc })}
                onRestore={() => {
                  const id = String(doc.id);
                  setRestoringId(id);
                  update.mutate(
                    { id, data: { is_active: true }, branch: doc.branch },
                    {
                      onSuccess: () => {
                        toast.success("Conocimiento reactivado");
                        setRestoringId(null);
                        void refetch();
                      },
                      onError: (e) => {
                        toast.error(apiErrorMessage(e, "No se pudo reactivar"));
                        setRestoringId(null);
                      },
                    },
                  );
                }}
              />
            );
          })}
        </div>
      )}

      <Dialog
        open={categoryDialog?.type === "rename"}
        onOpenChange={(open) => {
          if (!open) setCategoryDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renombrar categoría</DialogTitle>
            <DialogDescription>
              Se actualiza en todos los documentos con «{categoryDialog?.name}».
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-category">Nuevo nombre</Label>
            <Input
              id="rename-category"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value.slice(0, 80))}
              maxLength={80}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitRenameCategory();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryDialog(null)}
              disabled={renameCategory.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitRenameCategory}
              disabled={renameCategory.isPending || !renameValue.trim()}
            >
              {renameCategory.isPending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={categoryDialog?.type === "delete"}
        onOpenChange={(open) => {
          if (!open) setCategoryDialog(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              «{categoryDialog?.name}» se eliminará de todos los documentos. Los docs se mantienen
              sin categoría.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategory.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteCategory.isPending}
              onClick={(e) => {
                e.preventDefault();
                submitDeleteCategory();
              }}
            >
              {deleteCategory.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Quitando…
                </>
              ) : (
                "Quitar categoría"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.type === "hard"
                ? "¿Eliminar permanentemente?"
                : "¿Desactivar conocimiento?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.type === "hard" ? (
                <>
                  «{pending.doc.title}» se borrará de forma permanente de esta sucursal. Pueden
                  hacerlo superadmin, organizador (sus stores) y owner (su sucursal). No se puede
                  deshacer.
                </>
              ) : (
                <>
                  «{pending?.doc.title}» se desactivará y dejará de estar disponible para los
                  agentes. Después puedes reactivarlo.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={remove.isPending || !pending}
              onClick={(e) => {
                e.preventDefault();
                if (!pending) return;
                const hard = pending.type === "hard";
                remove.mutate(
                  { id: String(pending.doc.id), branch: pending.doc.branch, hard },
                  {
                    onSuccess: () => {
                      toast.success(hard ? "Conocimiento eliminado" : "Conocimiento desactivado");
                      setPending(null);
                      void refetch();
                    },
                    onError: (err) =>
                      toast.error(
                        apiErrorMessage(
                          err,
                          hard ? "No se pudo eliminar" : "No se pudo desactivar",
                        ),
                      ),
                  },
                );
              }}
            >
              {remove.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  {pending?.type === "hard" ? "Eliminando…" : "Desactivando…"}
                </>
              ) : pending?.type === "hard" ? (
                "Eliminar"
              ) : (
                "Desactivar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageMotion>
  );
}
