import { useMemo, useState } from "react";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublishCatalogAgent } from "@/api/hooks/usePublicAgentCatalog";
import { apiErrorMessage } from "@/lib/apiError";
import { AGENT_CATALOG_CATEGORY_DEFS } from "@/lib/agentCatalog";
import { upsertPendingCatalogReview } from "@/lib/agentCatalogPending";

export function PublishToStoreDialog({
  agentId,
  agentName,
  agentIcon,
  disabled,
}: {
  agentId: string;
  agentName: string;
  agentIcon?: string | null;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("ventas");
  const [tagline, setTagline] = useState("");
  const publish = usePublishCatalogAgent();

  const numericId = useMemo(() => {
    const n = Number(agentId);
    return Number.isFinite(n) ? n : null;
  }, [agentId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (numericId == null) {
      toast.error("Este agente no tiene un ID numérico válido para publicar.");
      return;
    }
    publish.mutate(
      {
        agent_id: numericId,
        category,
        tagline: tagline.trim() || undefined,
        icon: agentIcon?.trim() || undefined,
        visibility: "public",
      },
      {
        onSuccess: (result) => {
          upsertPendingCatalogReview({
            id: result.id,
            slug: result.slug,
            name: agentName,
            category,
            tagline: tagline.trim(),
            review_status: result.review_status,
            visibility: result.visibility,
            published_at: new Date().toISOString(),
            agent_id: agentId,
          });
          toast.success(result.message || "Enviado a revisión. Un superadmin debe aprobarlo.");
          setOpen(false);
          setTagline("");
        },
        onError: (error) => {
          toast.error(apiErrorMessage(error, "No se pudo publicar en la tienda"));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          <Store className="mr-1.5 h-4 w-4" />
          Publicar en la tienda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Publicar en la tienda</DialogTitle>
            <DialogDescription>
              «{agentName}» quedará en revisión. Un superadmin debe aprobarlo antes de que aparezca
              en el catálogo público.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="publish-category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="publish-category">
                <SelectValue placeholder="Elige una categoría" />
              </SelectTrigger>
              <SelectContent>
                {AGENT_CATALOG_CATEGORY_DEFS.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name} ({cat.ambito === "trabajo" ? "Trabajo" : "Vida"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publish-tagline">Tagline (opcional)</Label>
            <Input
              id="publish-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={200}
              placeholder="Una frase corta que resuma al agente"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={publish.isPending || numericId == null}>
              {publish.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
              Enviar a revisión
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
