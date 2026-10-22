import { describe, expect, it } from "vitest";
import { buildPublicChatPayload, publicChatUsageLimitMessage } from "../usePublicChat";
import { parsePublicAgentCatalog } from "../usePublicAgentCatalog";
import { templateAvailability, WORK_PLAN_TEMPLATES } from "@/lib/workPlanTemplates";

describe("buildPublicChatPayload", () => {
  it("sends name and email only when they are present", () => {
    expect(
      buildPublicChatPayload("embed-1", {
        message: "hola",
        user_name: " Ana ",
        email: " ana@example.com ",
      }),
    ).toEqual({
      user_id: "embed-1",
      message: "hola",
      user_name: "Ana",
      email: "ana@example.com",
    });
  });

  it("omits empty identity fields", () => {
    expect(buildPublicChatPayload("embed-1", { message: "hola", user_name: "  " })).toEqual({
      user_id: "embed-1",
      message: "hola",
    });
  });
});

describe("publicChatUsageLimitMessage", () => {
  it("recognizes a 429 and a usage_limit body", () => {
    expect(publicChatUsageLimitMessage({ response: { status: 429, data: {} } })).toMatch(/límite/i);
    expect(
      publicChatUsageLimitMessage({
        response: { status: 403, data: { usage_limit: true, message: "Cupo diario agotado" } },
      }),
    ).toBe("Cupo diario agotado");
  });

  it("ignores unrelated errors", () => {
    expect(
      publicChatUsageLimitMessage({ response: { status: 400, data: { detail: "Mensaje vacío" } } }),
    ).toBeNull();
  });
});

describe("parsePublicAgentCatalog", () => {
  it("reads a results payload and skips incomplete rows", () => {
    expect(
      parsePublicAgentCatalog({
        results: [
          { id: "a1", name: "Recepción", description: "Saluda", channels: ["whatsapp"] },
          { id: "", name: "Sin id" },
        ],
      }),
    ).toEqual([{ id: "a1", name: "Recepción", summary: "Saluda", channels: ["whatsapp"] }]);
  });
});

describe("generic work plan templates", () => {
  it("does not name a specific customer", () => {
    const blob = JSON.stringify(WORK_PLAN_TEMPLATES.map((t) => [t.id, t.label, t.description]));
    expect(blob).not.toMatch(/dentidesk|smart\s*hydro|clínica wm|clinica wm/i);
  });

  it("enables the availability template for any agent", () => {
    const template = WORK_PLAN_TEMPLATES.find((item) => item.id === "availability");
    expect(template).toBeTruthy();
    expect(templateAvailability(template!, new Set(["cualquier-agente"]), [])).toEqual({
      available: true,
    });
    expect(templateAvailability(template!, new Set(), []).available).toBe(false);
  });
});
