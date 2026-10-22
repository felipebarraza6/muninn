import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { AgentStoreShell } from "@/components/agent-store/AgentStoreShell";
import { AgentCatalogCard } from "@/components/agent-store/AgentCatalogCard";
import {
  AgentStoreEmpty,
  AgentStoreError,
  AgentStoreLoading,
} from "@/components/agent-store/AgentStoreStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  catalogUnavailable,
  useAgentCatalogCategories,
  useAgentCatalogList,
} from "@/api/hooks/usePublicAgentCatalog";
import { apiErrorMessage } from "@/lib/apiError";
import type { AgentCatalogAmbito } from "@/lib/agentCatalog";
import { cn } from "@/lib/utils";

type AmbitoFilter = "" | AgentCatalogAmbito;

function useStoreFilters() {
  const [params, setParams] = useSearchParams();
  const ambito = (params.get("ambito") || "") as AmbitoFilter;
  const category = params.get("category") || "";
  const q = params.get("q") || "";

  const setFilter = (patch: { ambito?: AmbitoFilter; category?: string; q?: string }) => {
    const next = new URLSearchParams(params);
    const apply = (key: string, value: string | undefined) => {
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
    };
    if ("ambito" in patch) {
      apply("ambito", patch.ambito);
      // Al cambiar ámbito, limpia categoría si no aplica.
      if (patch.ambito !== undefined) next.delete("category");
    }
    if ("category" in patch) apply("category", patch.category);
    if ("q" in patch) apply("q", patch.q);
    setParams(next, { replace: true });
  };

  return { ambito, category, q, setFilter };
}

export default function TiendaAgentesPage() {
  const { ambito, category, q, setFilter } = useStoreFilters();
  const [draftQ, setDraftQ] = useState(q);

  const list = useAgentCatalogList({
    ambito: ambito || undefined,
    category: category || undefined,
    q: q || undefined,
  });
  const categoriesQuery = useAgentCatalogCategories();

  const categories = useMemo(() => {
    const all = categoriesQuery.data ?? [];
    if (!ambito) return all;
    return all.filter((c) => c.ambito === ambito);
  }, [categoriesQuery.data, ambito]);

  const agents = list.data?.results ?? [];
  const missing = list.isError && catalogUnavailable(list.error);

  return (
    <AgentStoreShell
      title="Tienda de agentes — Muninn"
      description="Explora plantillas públicas, filtra por Trabajo o Vida y clónalas a tu organización."
    >
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Catálogo público
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tienda de agentes
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Plantillas con nombres de cuervo listas para clonar. Elige ámbito, categoría o busca por
            nombre.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setFilter({ q: draftQ.trim() });
            }}
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
                placeholder="Buscar por nombre, tagline o descripción"
                className="pl-9"
                aria-label="Buscar agentes"
              />
            </div>
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </form>

          <div
            role="group"
            aria-label="Ámbito"
            className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/30 p-1"
          >
            {(
              [
                { value: "" as AmbitoFilter, label: "Todos" },
                { value: "trabajo" as AmbitoFilter, label: "Trabajo" },
                { value: "vida" as AmbitoFilter, label: "Vida" },
              ] as const
            ).map((opt) => {
              const active = ambito === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setFilter({ ambito: opt.value })}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2" aria-label="Categorías">
              <button
                type="button"
                onClick={() => setFilter({ category: "" })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  !category
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                Todas
              </button>
              {categories.map((cat) => {
                const active = category === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setFilter({ category: active ? "" : cat.slug })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {list.isPending ? (
          <AgentStoreLoading />
        ) : list.isError && !missing ? (
          <AgentStoreError
            message={apiErrorMessage(list.error, "No se pudo cargar el catálogo.")}
            onRetry={() => void list.refetch()}
          />
        ) : agents.length === 0 ? (
          <AgentStoreEmpty
            title={missing ? "El catálogo todavía no está disponible" : "No hay agentes aquí"}
            description={
              missing
                ? "Cuando la API publique el catálogo, verás las plantillas en esta grilla. Mientras tanto no inventamos datos."
                : q || category || ambito
                  ? "Prueba otra búsqueda, categoría o ámbito."
                  : "Aún no hay plantillas públicas aprobadas."
            }
            action={
              q || category || ambito ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDraftQ("");
                    setFilter({ q: "", category: "", ambito: "" });
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/">Volver a la landing</Link>
                </Button>
              )
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <li key={agent.id}>
                <AgentCatalogCard agent={agent} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AgentStoreShell>
  );
}
