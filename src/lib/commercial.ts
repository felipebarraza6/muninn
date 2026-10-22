/**
 * Contrato comercial de Muninn, alineado al backend que se está agregando.
 *
 * Público (sin sesión):
 * - POST /accounts/users/muninn_signup/
 *   { organization_name, email, password, first_name?, last_name? }
 *   → { email, verification_required, detail? }
 * - POST /accounts/users/muninn_verify_email/
 *   { token }
 *   → { email, verified, detail? }
 *
 * Con sesión:
 * - GET /ai-agents/billing/summary/
 * - GET /ai-agents/billing/ledger/
 * - GET /ai-agents/billing/packs/
 * - POST /ai-agents/billing/packs/:id/checkout/ → { payment_url, commerce_order? }
 *
 * Los montos viajan como string decimal. `mock: true` solo lo pone el cliente
 * de ejemplo (VITE_COMMERCIAL_API=mock), nunca un saldo inventado en producción.
 */

export const AGENT_MONTHLY_UF = "0.5";
export const RUNA_MARGIN_RATE = "0.20";
export const RUNE_MARK = "ᚱ";

export const COMMERCIAL_PATHS = {
  signup: "/accounts/users/muninn_signup/",
  verifyEmail: "/accounts/users/muninn_verify_email/",
  summary: "/ai-agents/billing/summary/",
  ledger: "/ai-agents/billing/ledger/",
  packs: "/ai-agents/billing/packs/",
  checkout: (packId: string) => `/ai-agents/billing/packs/${encodeURIComponent(packId)}/checkout/`,
} as const;

export type SignupPayload = {
  organization_name: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
};

export type SignupResult = {
  email: string;
  verificationRequired: boolean;
  detail: string;
  /** Solo el mock. No viene del servidor. */
  mock: boolean;
  mockToken?: string;
};

export type VerifyEmailResult = {
  email: string;
  verified: boolean;
  detail: string;
  mock: boolean;
};

export type BillingSummary = {
  balanceRunas: string;
  lowBalance: boolean;
  depleted: boolean;
  lowBalanceThresholdRunas: string;
  activeAgents: number;
  monthlyUfPerAgent: string;
  monthlyUf: string;
  ufClp: string | null;
  monthlyClp: string | null;
  ufSource: string | null;
  ufAsOf: string | null;
  marginRate: string;
  mock: boolean;
};

export type LedgerKind = "purchase" | "consumption" | "adjustment";

export type LedgerEntry = {
  id: string;
  kind: LedgerKind;
  runas: string;
  description: string;
  createdAt: string;
  clpCost: string | null;
};

export type RunePack = {
  id: string;
  name: string;
  runas: string;
  priceClp: string;
};

export type CheckoutResult = {
  paymentUrl: string | null;
  commerceOrder: string | null;
  mock: boolean;
};

export class CommercialUnavailableError extends Error {
  readonly unavailable = true;
  constructor(message = "El servicio comercial todavía no está publicado.") {
    super(message);
    this.name = "CommercialUnavailableError";
  }
}

export function isCommercialUnavailable(error: unknown): boolean {
  return Boolean(
    error && typeof error === "object" && (error as { unavailable?: boolean }).unavailable,
  );
}

/** 404 o 501: el endpoint aún no existe. Otro status es un error real. */
export function isMissingCommercialEndpoint(status: number | null): boolean {
  return status === 404 || status === 501;
}

/** Default live. `mock` solo para desarrollo, marcado en la interfaz. */
export function isCommercialMock(): boolean {
  const raw = import.meta.env.VITE_COMMERCIAL_API;
  return (
    String(raw ?? "")
      .trim()
      .toLowerCase() === "mock"
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function str(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function dec(value: unknown, fallback = "0"): string {
  const raw = str(value).replace(",", ".");
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? raw : fallback;
}

function rowsOf(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const bag = asRecord(data);
  if (bag && Array.isArray(bag.results)) return bag.results;
  return [];
}

export function parseSignupResult(data: unknown, mock = false): SignupResult {
  const bag = asRecord(data);
  const email = str(bag?.email);
  const detail = str(bag?.detail) || str(bag?.message);
  return {
    email,
    verificationRequired: bag?.verification_required !== false,
    detail:
      detail ||
      (mock
        ? "Ejemplo local: no se envió un correo."
        : "Si el registro está activo, te llega un enlace para verificar el correo."),
    mock,
    mockToken: mock ? str(bag?.mock_token) || undefined : undefined,
  };
}

export function parseVerifyResult(data: unknown, mock = false): VerifyEmailResult {
  const bag = asRecord(data);
  return {
    email: str(bag?.email),
    verified: bag?.verified !== false,
    detail:
      str(bag?.detail) ||
      str(bag?.message) ||
      (mock ? "Correo de ejemplo verificado." : "Correo verificado."),
    mock,
  };
}

export function parseBillingSummary(data: unknown, mock = false): BillingSummary {
  const bag = asRecord(data) ?? {};
  const balance = dec(bag.balance_runas ?? bag.balance);
  const threshold = dec(bag.low_balance_threshold_runas ?? bag.low_balance_threshold, "0");
  const balanceN = Number(balance);
  const thresholdN = Number(threshold);
  const depleted = bag.depleted === true || (Number.isFinite(balanceN) && balanceN <= 0);
  const lowBalance =
    bag.low_balance === true ||
    (Number.isFinite(balanceN) &&
      Number.isFinite(thresholdN) &&
      thresholdN > 0 &&
      balanceN <= thresholdN);
  const active = Number(bag.active_agents);
  const perAgent = dec(bag.monthly_uf_per_agent, AGENT_MONTHLY_UF);
  const monthlyUf = str(bag.monthly_uf)
    ? dec(bag.monthly_uf)
    : (Number(perAgent) * (Number.isFinite(active) ? active : 0)).toString();
  const ufClp = str(bag.uf_clp) ? dec(bag.uf_clp) : null;
  const monthlyClp = str(bag.monthly_clp)
    ? dec(bag.monthly_clp)
    : ufClp
      ? (Number(monthlyUf) * Number(ufClp)).toFixed(0)
      : null;
  return {
    balanceRunas: balance,
    lowBalance: lowBalance && !depleted,
    depleted,
    lowBalanceThresholdRunas: threshold,
    activeAgents: Number.isFinite(active) && active > 0 ? Math.floor(active) : 0,
    monthlyUfPerAgent: perAgent,
    monthlyUf,
    ufClp,
    monthlyClp,
    ufSource: str(bag.uf_source) || null,
    ufAsOf: str(bag.uf_as_of) || null,
    marginRate: dec(bag.margin_rate, RUNA_MARGIN_RATE),
    mock: mock || bag.mock === true,
  };
}

function parseKind(value: unknown): LedgerKind {
  const raw = str(value);
  if (raw === "purchase" || raw === "consumption" || raw === "adjustment") return raw;
  return "adjustment";
}

export function parseLedger(data: unknown): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  for (const row of rowsOf(data)) {
    const bag = asRecord(row);
    if (!bag) continue;
    const id = str(bag.id);
    const description = str(bag.description);
    if (!id || !description) continue;
    entries.push({
      id,
      kind: parseKind(bag.kind),
      runas: dec(bag.runas),
      description,
      createdAt: str(bag.created_at),
      clpCost: str(bag.clp_cost) ? dec(bag.clp_cost) : null,
    });
  }
  return entries;
}

export function parseRunePacks(data: unknown): RunePack[] {
  const packs: RunePack[] = [];
  for (const row of rowsOf(data)) {
    const bag = asRecord(row);
    if (!bag) continue;
    const id = str(bag.id);
    const name = str(bag.name);
    if (!id || !name) continue;
    packs.push({
      id,
      name,
      runas: dec(bag.runas),
      priceClp: dec(bag.price_clp),
    });
  }
  return packs;
}

export function parseCheckout(data: unknown, mock = false): CheckoutResult {
  const bag = asRecord(data) ?? {};
  const url = str(bag.payment_url) || str(bag.url);
  return {
    paymentUrl: url || null,
    commerceOrder: str(bag.commerce_order) || null,
    mock: mock || bag.mock === true,
  };
}

export function formatRunas(value: string | number): string {
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 }).format(n);
}

export function formatClp(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatUf(value: string | number): string {
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  const text = new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(n);
  return `${text} UF`;
}

export function marginPercentLabel(rate: string): string {
  const n = Number(rate);
  if (!Number.isFinite(n)) return "20 %";
  return `${new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n * 100)} %`;
}
