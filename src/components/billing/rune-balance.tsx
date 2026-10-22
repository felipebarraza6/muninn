import { useState } from "react";
import { Link } from "react-router-dom";
import { useBillingSummary } from "@/api/hooks/useCommercial";
import { canSeeBilling } from "@/lib/authGuards";
import { RUNE_MARK, formatRunas, isCommercialUnavailable } from "@/lib/commercial";
import { cn } from "@/lib/utils";

const LOW_DISMISS_KEY = "muninn-rune-low-dismissed";

export function RuneBalanceChip() {
  const summary = useBillingSummary();
  const data = summary.data;
  if (!canSeeBilling() || !data || isCommercialUnavailable(summary.error)) return null;

  const tone = data.depleted
    ? "text-destructive"
    : data.lowBalance
      ? "text-warning"
      : "text-foreground";

  return (
    <Link
      to="/app/facturacion"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 text-xs font-medium tabular-nums hover:border-primary/40",
        tone,
      )}
      aria-label={`Saldo de runas: ${formatRunas(data.balanceRunas)}${data.mock ? ", ejemplo" : ""}`}
    >
      <span aria-hidden>{RUNE_MARK}</span>
      <span>{formatRunas(data.balanceRunas)}</span>
      {data.mock ? (
        <span className="text-[10px] uppercase tracking-wide text-warning">ej.</span>
      ) : null}
    </Link>
  );
}

export function RuneBalanceBanner() {
  const summary = useBillingSummary();
  const data = summary.data;
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(LOW_DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  if (!canSeeBilling() || !data) return null;

  if (data.depleted) {
    return (
      <div
        role="status"
        className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-foreground"
      >
        Saldo de runas agotado. El uso de IA se detiene hasta comprar otro pack.{" "}
        <Link to="/app/facturacion" className="font-medium underline underline-offset-2">
          Ver facturación
        </Link>
        {data.mock ? " Esto es un ejemplo, no un cobro." : null}
      </div>
    );
  }

  if (!data.lowBalance || dismissed) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-3 border-b border-warning/30 bg-warning/10 px-4 py-2 text-sm text-foreground"
    >
      <p>
        Quedan pocas runas ({RUNE_MARK} {formatRunas(data.balanceRunas)}). Cuando lleguen a cero, la
        IA se detiene.
        {data.mock ? " Cifra de ejemplo." : ""}
      </p>
      <button
        type="button"
        className="shrink-0 text-xs underline underline-offset-2"
        onClick={() => {
          try {
            sessionStorage.setItem(LOW_DISMISS_KEY, "1");
          } catch {
            /* storage bloqueado */
          }
          setDismissed(true);
        }}
      >
        Ocultar
      </button>
    </div>
  );
}
