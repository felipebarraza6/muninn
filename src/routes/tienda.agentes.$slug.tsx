import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AgentStoreShell } from "@/components/agent-store/AgentStoreShell";
import {
  AgentStoreEmpty,
  AgentStoreError,
  AgentStoreLoading,
} from "@/components/agent-store/AgentStoreStates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  catalogUnavailable,
  useAgentCatalogDetail,
  useCloneCatalogAgent,
} from "@/api/hooks/usePublicAgentCatalog";
import { apiErrorMessage, apiErrorStatus } from "@/lib/apiError";
import { catalogAmbitoLabel, formatCloneCount } from "@/lib/agentCatalog";
import { isAuthenticated } from "@/lib/authSession";
import { withNextParam } from "@/lib/safeNextPath";
import { getActiveBranchId } from "@/lib/branchStorage";

export default function TiendaAgenteDetallePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const detail = useAgentCatalogDetail(slug);
  const clone = useCloneCatalogAgent();
  const agent = detail.data;
  const missing = detail.isError && catalogUnavailable(detail.error);
  const signedIn = isAuthenticated();
  const returnPath = slug ? `/agentes/${encodeURIComponent(slug)}` : "/agentes";

  const handleClone = () => {
    if (!slug) return;
    if (!signedIn) {
      navigate(withNextParam("/registro", returnPath));
      return;
    }
    const branchId = getActiveBranchId();
    const branchNum = branchId ? Number(branchId) : undefined;
    clone.mutate(
      {
        slug,
        payload:
          branchNum != null && Number.isFinite(branchNum) ? { branch: branchNum } : undefined,
      },
      {
        onSuccess: (result) => {
          toast.success(`«${result.name || agent?.name || "Agente"}» clonado en tu organización`);
          navigate(`/app/agentes/${encodeURIComponent(result.agent_id)}`);
        },
        onError: (error) => {
          if (apiErrorStatus(error) === 401) {
            navigate(withNextParam("/registro", returnPath));
            return;
          }
          toast.error(apiErrorMessage(error, "No se pudo clonar el agente"));
        },
      },
    );
  };

  return (
    <AgentStoreShell
      title={agent ? `${agent.name} — Muninn` : "Agente — Muninn"}
      description={agent?.tagline || "Ficha pública de plantilla de agente."}
    >
      <div className="space-y-8">
        <Button asChild variant="outline" size="sm">
          <Link to="/agentes">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Volver a la tienda
          </Link>
        </Button>

        {detail.isPending ? (
          <AgentStoreLoading label="Cargando la ficha…" />
        ) : detail.isError && !missing ? (
          <AgentStoreError
            message={apiErrorMessage(detail.error, "No se pudo cargar esta ficha.")}
            onRetry={() => void detail.refetch()}
          />
        ) : !agent || missing ? (
          <AgentStoreEmpty
            title={missing ? "Catálogo no disponible" : "No encontramos este agente"}
            description={
              missing
                ? "El endpoint del catálogo todavía no responde. Cuando esté activo, esta ficha aparecerá aquí."
                : "Puede que el enlace esté mal o que la plantilla ya no sea pública."
            }
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/agentes">Ver la tienda</Link>
              </Button>
            }
          />
        ) : (
          <article className="space-y-8">
            <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-4xl"
                aria-hidden
              >
                {agent.icon?.trim() || "🐦"}
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-semibold tracking-tight">
                    {agent.name}
                  </h1>
                  <Badge variant="secondary">{catalogAmbitoLabel(String(agent.ambito))}</Badge>
                  {agent.category_label ? (
                    <Badge variant="outline">{agent.category_label}</Badge>
                  ) : null}
                </div>
                <p className="text-base text-muted-foreground">{agent.tagline}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCloneCount(agent.clone_count)}
                  {agent.author ? ` · ${agent.author}` : ""}
                  {agent.version ? ` · v${agent.version}` : ""}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    type="button"
                    onClick={handleClone}
                    disabled={clone.isPending}
                    className="gap-1.5"
                  >
                    {clone.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Clonar a mi organización
                  </Button>
                  {!signedIn ? (
                    <p className="self-center text-xs text-muted-foreground">
                      Sin sesión te llevamos a crear cuenta y volvemos a esta ficha.
                    </p>
                  ) : null}
                </div>
              </div>
            </header>

            {agent.professional_disclaimer ? (
              <aside className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90">
                {agent.professional_disclaimer}
              </aside>
            ) : null}

            <section className="space-y-2">
              <h2 className="font-display text-lg font-semibold">Descripción</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {agent.description || "Sin descripción."}
              </p>
              {agent.welcome_message ? (
                <p className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Bienvenida: </span>
                  {agent.welcome_message}
                </p>
              ) : null}
            </section>

            {agent.conversation_examples.length > 0 ? (
              <section className="space-y-3">
                <h2 className="font-display text-lg font-semibold">Ejemplos de conversación</h2>
                <ul className="space-y-3">
                  {agent.conversation_examples.map((ex, idx) => (
                    <li
                      key={idx}
                      className="rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed"
                    >
                      {ex.user ? (
                        <p>
                          <span className="font-medium text-foreground">Usuario: </span>
                          <span className="text-muted-foreground">{String(ex.user)}</span>
                        </p>
                      ) : null}
                      {ex.agent ? (
                        <p className="mt-2">
                          <span className="font-medium text-primary">{agent.name}: </span>
                          <span className="text-muted-foreground">{String(ex.agent)}</span>
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="grid gap-6 md:grid-cols-3">
              <ChipBlock
                title="Skills sugeridas"
                items={agent.suggested_skills}
                empty="Ninguna listada"
              />
              <ChipBlock
                title="Canales recomendados"
                items={agent.recommended_channels}
                empty="Ninguno listado"
              />
              <ChipBlock
                title="Integraciones"
                items={agent.required_integrations}
                empty="Ninguna requerida"
              />
            </div>
          </article>
        )}
      </div>
    </AgentStoreShell>
  );
}

function ChipBlock({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <section className="space-y-2 rounded-2xl border border-border/70 bg-card p-4">
      <h2 className="font-display text-sm font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li key={item}>
              <Badge variant="secondary" className="font-normal">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
