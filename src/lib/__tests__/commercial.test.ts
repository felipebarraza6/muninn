import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkoutRunePack,
  fetchBillingSummary,
  resetCommercialMockState,
  signupAccount,
} from "@/api/commercial";
import {
  AGENT_MONTHLY_UF,
  formatClp,
  formatUf,
  isCommercialMock,
  isMissingCommercialEndpoint,
  marginPercentLabel,
  parseBillingSummary,
  parseLedger,
  parseRunePacks,
  RUNA_MARGIN_RATE,
} from "@/lib/commercial";

describe("commercial contract", () => {
  it("publishes 0.5 UF and a 20 percent margin", () => {
    expect(AGENT_MONTHLY_UF).toBe("0.5");
    expect(RUNA_MARGIN_RATE).toBe("0.20");
    expect(marginPercentLabel(RUNA_MARGIN_RATE)).toBe("20 %");
    expect(formatUf("0.5")).toBe("0,5 UF");
    expect(formatClp("10000")).toContain("10");
  });

  it("treats 404 and 501 as a missing endpoint", () => {
    expect(isMissingCommercialEndpoint(404)).toBe(true);
    expect(isMissingCommercialEndpoint(501)).toBe(true);
    expect(isMissingCommercialEndpoint(403)).toBe(false);
    expect(isMissingCommercialEndpoint(null)).toBe(false);
  });

  it("parses summary, ledger and packs without inventing rows", () => {
    const summary = parseBillingSummary({
      balance_runas: "12.5",
      low_balance_threshold_runas: "20",
      active_agents: 2,
      uf_clp: "40000",
      margin_rate: "0.20",
    });
    expect(summary.lowBalance).toBe(true);
    expect(summary.depleted).toBe(false);
    expect(summary.monthlyUf).toBe("1");
    expect(summary.monthlyClp).toBe("40000");
    expect(summary.mock).toBe(false);

    expect(parseBillingSummary({ balance_runas: "0", active_agents: 0 }).depleted).toBe(true);
    expect(
      parseLedger({
        results: [
          {
            id: "1",
            kind: "consumption",
            runas: "-3",
            description: "Llamada",
            created_at: "2026-10-22",
          },
          { id: "", description: "sin id" },
        ],
      }),
    ).toEqual([
      {
        id: "1",
        kind: "consumption",
        runas: "-3",
        description: "Llamada",
        createdAt: "2026-10-22",
        clpCost: null,
      },
    ]);
    expect(parseRunePacks([{ name: "sin id" }])).toEqual([]);
  });

  it("keeps the live client as the default", () => {
    expect(isCommercialMock()).toBe(false);
  });
});

describe("commercial mock", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_COMMERCIAL_API", "mock");
    resetCommercialMockState();
  });

  it("marks signup and the balance as an example and does not open Flow", async () => {
    expect(isCommercialMock()).toBe(true);
    const signup = await signupAccount({
      organization_name: "Ejemplo",
      email: "a@b.cl",
      password: "secreto123",
    });
    expect(signup.mock).toBe(true);
    expect(signup.detail.toLowerCase()).toContain("no se envió");
    expect(signup.mockToken).toBe("demo-token");

    const before = await fetchBillingSummary();
    expect(before.mock).toBe(true);
    expect(before.ufSource).toBe("ejemplo");

    const checkout = await checkoutRunePack("pack-1k");
    expect(checkout.mock).toBe(true);
    expect(checkout.paymentUrl).toBeNull();
    const after = await fetchBillingSummary();
    expect(Number(after.balanceRunas)).toBeGreaterThan(Number(before.balanceRunas));
  });
});
