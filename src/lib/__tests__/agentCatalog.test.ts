import { describe, expect, it } from "vitest";
import {
  isAgentCatalogMockEnabled,
  parseAgentCatalogCloneResult,
  parseAgentCatalogDetail,
  parseAgentCatalogListResponse,
  parseAgentCatalogPublishResult,
  pickFeaturedCatalogAgents,
  type AgentCatalogListItem,
} from "../agentCatalog";
import { resolveSafeNextPath, withNextParam } from "../safeNextPath";
import { parsePublicAgentCatalog } from "@/api/hooks/usePublicAgentCatalog";

const sampleListItem = {
  id: "11",
  slug: "huginn",
  name: "Huginn",
  tagline: "Outbound con calidez",
  description: "Agente de ventas",
  category: "ventas",
  category_label: "Ventas",
  ambito: "trabajo",
  icon: "🤝",
  version: "1.0.0",
  visibility: "public",
  author: "Muninn",
  author_type: "platform",
  clone_count: 12,
  requires_professional_disclaimer: false,
  recommended_channels: ["whatsapp", "web_embed"],
  required_integrations: [],
  suggested_skills: ["native-create-document"],
};

describe("parseAgentCatalogListResponse", () => {
  it("lee count + results y omite filas incompletas", () => {
    const parsed = parseAgentCatalogListResponse({
      count: 2,
      results: [sampleListItem, { id: "x", name: "Sin slug" }],
    });
    expect(parsed.count).toBe(2);
    expect(parsed.results).toHaveLength(1);
    expect(parsed.results[0]).toMatchObject({
      slug: "huginn",
      name: "Huginn",
      clone_count: 12,
      recommended_channels: ["whatsapp", "web_embed"],
    });
  });
});

describe("parseAgentCatalogDetail", () => {
  it("incluye ejemplos y disclaimer", () => {
    const detail = parseAgentCatalogDetail({
      ...sampleListItem,
      system_instructions: "Eres Huginn",
      conversation_examples: [{ user: "Hola", agent: "¿En qué te ayudo?" }],
      welcome_message: "Hola",
      agent_type: "ASSISTANT",
      target_app: "general",
      professional_disclaimer: "Aviso profesional",
      review_status: "approved",
      created: "2026-01-01T00:00:00Z",
      modified: "2026-01-02T00:00:00Z",
    });
    expect(detail?.conversation_examples).toHaveLength(1);
    expect(detail?.professional_disclaimer).toBe("Aviso profesional");
    expect(detail?.review_status).toBe("approved");
  });
});

describe("parse clone/publish", () => {
  it("parsea el resultado de clone", () => {
    expect(
      parseAgentCatalogCloneResult({
        agent_id: 99,
        slug: "huginn-copia",
        name: "Huginn",
        branch_id: 3,
        template_slug: "huginn",
        clone_count: 13,
      }),
    ).toEqual({
      agent_id: "99",
      slug: "huginn-copia",
      name: "Huginn",
      branch_id: "3",
      template_slug: "huginn",
      clone_count: 13,
    });
  });

  it("parsea el resultado de publish", () => {
    expect(
      parseAgentCatalogPublishResult({
        id: 7,
        slug: "mi-agente",
        review_status: "pending",
        visibility: "public",
        message: "En revisión",
      }),
    ).toEqual({
      id: "7",
      slug: "mi-agente",
      review_status: "pending",
      visibility: "public",
      message: "En revisión",
    });
  });
});

describe("pickFeaturedCatalogAgents", () => {
  it("ordena por clones y limita", () => {
    const agents = [
      { ...sampleListItem, id: "1", slug: "a", name: "A", clone_count: 1 },
      { ...sampleListItem, id: "2", slug: "b", name: "B", clone_count: 9 },
      { ...sampleListItem, id: "3", slug: "c", name: "C", clone_count: 5 },
    ] as AgentCatalogListItem[];
    expect(pickFeaturedCatalogAgents(agents, 2).map((a) => a.slug)).toEqual(["b", "c"]);
  });
});

describe("isAgentCatalogMockEnabled", () => {
  it("solo en DEV con flag", () => {
    expect(isAgentCatalogMockEnabled({ DEV: true, VITE_AGENT_CATALOG_MOCK: "1" })).toBe(true);
    expect(isAgentCatalogMockEnabled({ DEV: false, VITE_AGENT_CATALOG_MOCK: "1" })).toBe(false);
    expect(isAgentCatalogMockEnabled({ DEV: true, VITE_AGENT_CATALOG_MOCK: "" })).toBe(false);
  });
});

describe("parsePublicAgentCatalog (compat)", () => {
  it("mapea a la forma legacy de la landing", () => {
    expect(
      parsePublicAgentCatalog({
        results: [sampleListItem],
      }),
    ).toEqual([
      {
        id: "huginn",
        name: "Huginn",
        summary: "Outbound con calidez",
        channels: ["whatsapp", "web_embed"],
      },
    ]);
  });
});

describe("safeNextPath", () => {
  it("acepta solo paths relativos seguros", () => {
    expect(resolveSafeNextPath("/agentes/huginn")).toBe("/agentes/huginn");
    expect(resolveSafeNextPath("//evil.com")).toBeNull();
    expect(resolveSafeNextPath("https://evil.com")).toBeNull();
    expect(resolveSafeNextPath("/entrar")).toBeNull();
    expect(withNextParam("/registro", "/agentes/huginn")).toBe(
      "/registro?next=%2Fagentes%2Fhuginn",
    );
  });
});
