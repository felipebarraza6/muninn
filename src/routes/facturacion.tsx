import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useBillingSummary,
  useCheckoutRunePack,
  useRuneLedger,
  useRunePacks,
} from "@/api/hooks/useCommercial";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiErrorMessage } from "@/lib/apiError";
import { canPurchaseRunes } from "@/lib/authGuards";
import {
  RUNE_MARK,
  formatClp,
  formatRunas,
  formatUf,
  isCommercialUnavailable,
  marginPercentLabel,
} from "@/lib/commercial";

function kindLabel(kind: string): string {
  if (kind === "purchase") return "Compra";
  if (kind === "consumption") return "Consumo";
  return "Ajuste";
}

export default function FacturacionPage() {
  const summary = useBillingSummary();
  const ledger = useRuneLedger();
  const packs = useRunePacks();
  const checkout = useCheckoutRunePack();
  const allowed = canPurchaseRunes();
  const canBuy = allowed;
  const unavailable =
    isCommercialUnavailable(summary.error) ||
    isCommercialUnavailable(ledger.error) ||
    isCommercialUnavailable(packs.error);

  const buy = (packId: string) => {
    checkout.mutate(packId, {
      onSuccess: (result) => {
        if (result.mock || !result.paymentUrl) {
          toast.message(
            result.mock
              ? "Ejemplo: no se abrió Flow y no hubo un cobro."
              : "Flow no devolvió un enlace de pago.",
          );
          return;
        }
        window.location.assign(result.paymentUrl);
      },
      onError: (error) => {
        if (isCommercialUnavailable(error)) {
          toast.error("La compra por Flow todavía no está publicada en el servidor.");
          return;
        }
        toast.error(apiErrorMessage(error, "No se pudo iniciar el pago."));
      },
    });
  };

  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-sm text-muted-foreground">
        Esta cuenta no administra la facturación.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 md:px-6">
      <Helmet>
        <title>Facturación — Muninn</title>
      </Helmet>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Facturación</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Cada agente activo cuesta 0,5 UF al mes. Las runas ({RUNE_MARK}) pagan el uso de IA por
          adelantado: se descuenta el costo real de cada llamada más un {marginPercentLabel("0.20")}
          . Si el saldo llega a cero, la IA se detiene. Muninn no guarda la tarjeta: el pack se paga
          en Flow.
        </p>
      </div>

      {summary.isPending ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Cargando saldo…
        </p>
      ) : null}

      {unavailable ? (
        <Alert>
          <AlertDescription>
            El servidor todavía no publica la facturación. Cuando existan los endpoints de billing,
            aquí verás agentes activos, UF, pesos y el historial. No mostramos un saldo inventado.
          </AlertDescription>
        </Alert>
      ) : null}

      {summary.error && !isCommercialUnavailable(summary.error) ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            {apiErrorMessage(summary.error, "No se pudo leer la facturación.")}
          </AlertDescription>
        </Alert>
      ) : null}

      {summary.data ? (
        <>
          {summary.data.mock ? (
            <Alert>
              <AlertDescription>
                Modo de ejemplo (VITE_COMMERCIAL_API=mock). Estas cifras no salen del servidor y el
                botón de compra no abre Flow.
              </AlertDescription>
            </Alert>
          ) : null}
          {summary.data.depleted ? (
            <Alert variant="destructive" role="status">
              <AlertDescription>
                Saldo agotado. El uso de IA está detenido hasta que entre un pack de runas.
              </AlertDescription>
            </Alert>
          ) : summary.data.lowBalance ? (
            <Alert role="status">
              <AlertDescription>
                Saldo bajo: quedan {RUNE_MARK} {formatRunas(summary.data.balanceRunas)}. El aviso
                parte en {formatRunas(summary.data.lowBalanceThresholdRunas)}.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Runas</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tabular-nums">
                {RUNE_MARK} {formatRunas(summary.data.balanceRunas)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Agentes activos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tabular-nums">
                {summary.data.activeAgents}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mes en UF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatUf(summary.data.monthlyUf)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatUf(summary.data.monthlyUfPerAgent)} por agente activo
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mes en pesos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatClp(summary.data.monthlyClp)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {summary.data.ufClp
                    ? `UF ${formatClp(summary.data.ufClp)}${summary.data.ufSource ? ` · ${summary.data.ufSource}` : ""}${summary.data.ufAsOf ? ` · ${summary.data.ufAsOf}` : ""}`
                    : "Sin valor de UF del día."}
                  {summary.data.mock ? " Valor de ejemplo." : ""}
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            El margen de esta cuenta es {marginPercentLabel(summary.data.marginRate)} sobre el costo
            real del modelo. Una runa representa ese total. No hay cobro automático de runas: se
            compran packs.
          </p>
        </>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Packs de runas</h2>
        {packs.data && packs.data.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {packs.data.map((pack) => (
              <li key={pack.id} className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="font-medium">{pack.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {RUNE_MARK} {formatRunas(pack.runas)} · {formatClp(pack.priceClp)}
                </p>
                <Button
                  className="mt-4"
                  type="button"
                  disabled={!canBuy || checkout.isPending}
                  onClick={() => buy(pack.id)}
                >
                  {canBuy ? "Comprar con Flow" : "Solo el propietario puede comprar"}
                </Button>
              </li>
            ))}
          </ul>
        ) : packs.isPending ? (
          <p className="text-sm text-muted-foreground">Buscando packs…</p>
        ) : !unavailable ? (
          <p className="text-sm text-muted-foreground">
            No hay packs publicados. Cuando el servidor los entregue, aparecen aquí.
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Historial</h2>
        {ledger.data && ledger.data.length > 0 ? (
          <ul className="divide-y divide-border/70 rounded-2xl border border-border/70">
            {ledger.data.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {kindLabel(entry.kind)}
                    {entry.createdAt
                      ? ` · ${new Date(entry.createdAt).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })}`
                      : ""}
                  </p>
                </div>
                <p className="shrink-0 tabular-nums">
                  {RUNE_MARK} {formatRunas(entry.runas)}
                </p>
              </li>
            ))}
          </ul>
        ) : ledger.isPending ? (
          <p className="text-sm text-muted-foreground">Buscando movimientos…</p>
        ) : !unavailable ? (
          <p className="text-sm text-muted-foreground">Todavía no hay movimientos de runas.</p>
        ) : null}
      </section>
    </div>
  );
}
