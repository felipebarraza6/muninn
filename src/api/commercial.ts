import { GET, POST } from "@/api/client";
import { apiErrorStatus } from "@/lib/apiError";
import {
  AGENT_MONTHLY_UF,
  COMMERCIAL_PATHS,
  CommercialUnavailableError,
  RUNA_MARGIN_RATE,
  isCommercialMock,
  isMissingCommercialEndpoint,
  parseBillingSummary,
  parseCheckout,
  parseLedger,
  parseRunePacks,
  parseSignupResult,
  parseVerifyResult,
  type BillingSummary,
  type CheckoutResult,
  type LedgerEntry,
  type RunePack,
  type SignupPayload,
  type SignupResult,
  type VerifyEmailResult,
} from "@/lib/commercial";

/**
 * Cliente de ejemplo. Solo corre con VITE_COMMERCIAL_API=mock.
 * Las cifras son inventadas y la UI tiene que decirlo.
 */
const MOCK_TOKEN = "demo-token";

type MockLedger = LedgerEntry;

const INITIAL_LEDGER: MockLedger[] = [
  {
    id: "mock-buy",
    kind: "purchase",
    runas: "1000",
    description: "Pack de ejemplo (no es un pago)",
    createdAt: "2026-10-01T15:00:00.000Z",
    clpCost: null,
  },
  {
    id: "mock-use",
    kind: "consumption",
    runas: "-820",
    description: "Uso de IA de ejemplo, costo real más 20 %",
    createdAt: "2026-10-18T12:30:00.000Z",
    clpCost: "6833",
  },
];

let mockBalance = 180;
let mockLedger: MockLedger[] = INITIAL_LEDGER.map((row) => ({ ...row }));

export function resetCommercialMockState(): void {
  mockBalance = 180;
  mockLedger = INITIAL_LEDGER.map((row) => ({ ...row }));
}

function missingOrThrow(error: unknown): never {
  if (isMissingCommercialEndpoint(apiErrorStatus(error))) {
    throw new CommercialUnavailableError();
  }
  throw error;
}

function mockSummary(): BillingSummary {
  const activeAgents = 2;
  const ufClp = "40000";
  const monthlyUf = String(Number(AGENT_MONTHLY_UF) * activeAgents);
  return parseBillingSummary(
    {
      balance_runas: String(mockBalance),
      low_balance_threshold_runas: "200",
      active_agents: activeAgents,
      monthly_uf_per_agent: AGENT_MONTHLY_UF,
      monthly_uf: monthlyUf,
      uf_clp: ufClp,
      uf_source: "ejemplo",
      uf_as_of: "2026-10-22",
      margin_rate: RUNA_MARGIN_RATE,
      mock: true,
    },
    true,
  );
}

export async function signupAccount(payload: SignupPayload): Promise<SignupResult> {
  if (isCommercialMock()) {
    return parseSignupResult(
      {
        email: payload.email.trim(),
        verification_required: true,
        detail:
          "Ejemplo local: no se envió un correo. Usa el token de ejemplo para ver el paso siguiente.",
        mock_token: MOCK_TOKEN,
      },
      true,
    );
  }
  try {
    const data = await POST<unknown>(COMMERCIAL_PATHS.signup, payload, { skipAuth: true });
    return parseSignupResult(data, false);
  } catch (error) {
    missingOrThrow(error);
  }
}

export async function verifySignupEmail(token: string): Promise<VerifyEmailResult> {
  if (isCommercialMock()) {
    if (token.trim() !== MOCK_TOKEN) {
      throw new Error("El token de ejemplo no coincide. Usa demo-token.");
    }
    return parseVerifyResult(
      {
        email: "cuenta@ejemplo.cl",
        verified: true,
        detail: "Correo de ejemplo verificado. No se creó una cuenta.",
      },
      true,
    );
  }
  try {
    const data = await POST<unknown>(COMMERCIAL_PATHS.verifyEmail, { token }, { skipAuth: true });
    return parseVerifyResult(data, false);
  } catch (error) {
    missingOrThrow(error);
  }
}

export async function fetchBillingSummary(): Promise<BillingSummary> {
  if (isCommercialMock()) return mockSummary();
  try {
    const data = await GET<unknown>(COMMERCIAL_PATHS.summary);
    return parseBillingSummary(data, false);
  } catch (error) {
    missingOrThrow(error);
  }
}

export async function fetchRuneLedger(): Promise<LedgerEntry[]> {
  if (isCommercialMock()) return mockLedger.map((row) => ({ ...row }));
  try {
    const data = await GET<unknown>(COMMERCIAL_PATHS.ledger);
    return parseLedger(data);
  } catch (error) {
    missingOrThrow(error);
  }
}

export async function fetchRunePacks(): Promise<RunePack[]> {
  if (isCommercialMock()) {
    return parseRunePacks({
      results: [
        { id: "pack-1k", name: "Pack 1.000", runas: "1000", price_clp: "10000" },
        { id: "pack-5k", name: "Pack 5.000", runas: "5000", price_clp: "45000" },
      ],
    });
  }
  try {
    const data = await GET<unknown>(COMMERCIAL_PATHS.packs);
    return parseRunePacks(data);
  } catch (error) {
    missingOrThrow(error);
  }
}

export async function checkoutRunePack(packId: string): Promise<CheckoutResult> {
  if (isCommercialMock()) {
    const pack = (await fetchRunePacks()).find((item) => item.id === packId);
    const credited = Number(pack?.runas ?? "0");
    if (credited > 0) {
      mockBalance += credited;
      mockLedger = [
        {
          id: `mock-buy-${Date.now()}`,
          kind: "purchase",
          runas: String(credited),
          description: "Compra de ejemplo. Flow no se abrió.",
          createdAt: new Date().toISOString(),
          clpCost: null,
        },
        ...mockLedger,
      ];
    }
    return { paymentUrl: null, commerceOrder: null, mock: true };
  }
  try {
    const data = await POST<unknown>(COMMERCIAL_PATHS.checkout(packId), {});
    return parseCheckout(data, false);
  } catch (error) {
    missingOrThrow(error);
  }
}
