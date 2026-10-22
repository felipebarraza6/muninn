import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Store, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApproveCatalogAgent, useRejectCatalogAgent } from "@/api/hooks/usePublicAgentCatalog";
import { apiErrorMessage } from "@/lib/apiError";
import {
  listPendingCatalogReviews,
  removePendingCatalogReview,
  updatePendingCatalogReviewStatus,
  type PendingCatalogReview,
} from "@/lib/agentCatalogPending";
import { AGENT_CATALOG_CATEGORY_DEFS } from "@/lib/agentCatalog";

function categoryLabel(slug: string): string {
  return AGENT_CATALOG_CATEGORY_DEFS.find((c) => c.slug === slug)?.name || slug;
}

export default function AdminTiendaPage() {
  const [pending, setPending] = useState<PendingCatalogReview[]>(() => listPendingCatalogReviews());
  const [slugInput, setSlugInput] = useState("");
  const [notes, setNotes] = useState("");
  const approve = useApproveCatalogAgent();
  const reject = useRejectCatalogAgent();

  const refresh = () => setPending(listPendingCatalogReviews());

  const busy = approve.isPending || reject.isPending;

  const pendingOnly = useMemo(
    () => pending.filter((row) => row.review_status === "pending"),
    [pending],
  );

  const runReview = (slug: string, action: "approve" | "reject") => {
    const trimmed = slug.trim();
    if (!trimmed) {
      toast.error("Indica el slug de la plantilla.");
      return;
    }
    const mutation = action === "approve" ? approve : reject;
    mutation.mutate(
      { slug: trimmed, notes: notes.trim() || undefined },
      {
        onSuccess: (result) => {
          updatePendingCatalogReviewStatus(trimmed, result.review_status);
          if (result.review_status !== "pending") {
            removePendingCatalogReview(trimmed);
          }
          refresh();
          setNotes("");
          toast.success(
            action === "approve"
              ? `«${trimmed}» aprobada y ya puede aparecer en la tienda.`
              : `«${trimmed}» rechazada.`,
          );
        },
        onError: (error) => {
          toast.error(
            apiErrorMessage(
              error,
              action === "approve" ? "No se pudo aprobar" : "No se pudo rechazar",
            ),
          );
        },
      },
    );
  };

  return (
    <AdminPageMotion>
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-lg font-semibold tracking-tight">Revisión de la tienda</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Aprueba o rechaza plantillas publicadas. El API no lista pendientes: aquí ves las enviadas
          desde este navegador y también puedes revisar por slug.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revisar por slug</CardTitle>
          <CardDescription>
            Útil si conoces el slug desde otra publicación o desde el admin de Django.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="review-slug">Slug</Label>
            <Input
              id="review-slug"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="ej. huginn-acme-ventas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-notes">Notas (opcional)</Label>
            <Textarea
              id="review-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Motivo de aprobación o rechazo"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={busy} onClick={() => runReview(slugInput, "approve")}>
              {approve.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1.5 h-4 w-4" />
              )}
              Aprobar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={busy}
              onClick={() => runReview(slugInput, "reject")}
            >
              {reject.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-1.5 h-4 w-4" />
              )}
              Rechazar
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/agentes">Ver tienda pública</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Cola local pendiente ({pendingOnly.length})</h2>
        {pendingOnly.length === 0 ? (
          <EmptyState
            title="Nada en revisión en este navegador"
            description="Cuando alguien publique un agente desde Studio, la plantilla queda aquí hasta que la apruebes o rechaces. También puedes usar el formulario por slug."
          />
        ) : (
          <ul className="space-y-3">
            {pendingOnly.map((row) => (
              <li
                key={row.slug}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.name}</p>
                    <Badge variant="secondary">{row.slug}</Badge>
                    <Badge variant="outline">{categoryLabel(row.category)}</Badge>
                  </div>
                  {row.tagline ? (
                    <p className="text-sm text-muted-foreground">{row.tagline}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Enviado {new Date(row.published_at).toLocaleString("es-CL")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy}
                    onClick={() => runReview(row.slug, "approve")}
                  >
                    Aprobar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    disabled={busy}
                    onClick={() => runReview(row.slug, "reject")}
                  >
                    Rechazar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminPageMotion>
  );
}
