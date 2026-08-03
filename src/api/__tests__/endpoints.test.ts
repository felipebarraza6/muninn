import { describe, it, expect } from "vitest";
import { ENDPOINTS } from "../endpoints/index";

/**
 * Verifica que todos los endpoints definidos en el frontend
 * coinciden con el namespace `/ai-agents/` del OpenAPI schema.
 */
describe("API Endpoints", () => {
  const AGENT_BASE = "/ai-agents";

  describe("agents namespace", () => {
    it("agents CRUD endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.agents.list).toBe(`${AGENT_BASE}/agents/`);
      expect(ENDPOINTS.agents.default).toBe(`${AGENT_BASE}/agents/default/`);
      expect(ENDPOINTS.agents.byApp).toBe(`${AGENT_BASE}/agents/by_app/`);
      expect(ENDPOINTS.agents.planLimits).toBe(`${AGENT_BASE}/agents/plan_limits/`);
      expect(ENDPOINTS.agents.opsHealth).toBe(`${AGENT_BASE}/agents/ops-health/`);
      expect(ENDPOINTS.agents.dashboardStats).toBe(`${AGENT_BASE}/agents/dashboard-stats/`);
      expect(ENDPOINTS.agents.onboardingStatus).toBe(`${AGENT_BASE}/agents/onboarding-status/`);
    });

    it("agents parameterized endpoints generate correct URLs", () => {
      expect(ENDPOINTS.agents.detail("42")).toBe(`${AGENT_BASE}/agents/42/`);
      expect(ENDPOINTS.agents.testLLM("42")).toBe(`${AGENT_BASE}/agents/42/test_llm/`);
      expect(ENDPOINTS.agents.skillConfigs("42")).toBe(`${AGENT_BASE}/agents/42/skill-configs/`);
      expect(ENDPOINTS.agents.skillConfig("42", "skill-1")).toBe(
        `${AGENT_BASE}/agents/42/skill-config/skill-1/`,
      );
    });
  });

  describe("conversations namespace", () => {
    it("conversation endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.conversations.list).toBe(`${AGENT_BASE}/conversations/`);
      expect(ENDPOINTS.conversations.closeConversation("1")).toBe(
        `${AGENT_BASE}/conversations/1/close-conversation/`,
      );
      expect(ENDPOINTS.conversations.chat("1")).toBe(`${AGENT_BASE}/conversations/1/chat/`);
    });
  });

  describe("knowledge namespace", () => {
    it("knowledge endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.knowledge.list).toBe(`${AGENT_BASE}/knowledge/`);
      expect(ENDPOINTS.knowledge.search).toBe(`${AGENT_BASE}/knowledge/search/`);
      expect(ENDPOINTS.knowledge.index("1")).toBe(`${AGENT_BASE}/knowledge/1/index/`);
      expect(ENDPOINTS.knowledge.categories).toBe(`${AGENT_BASE}/knowledge/categories/`);
    });
  });

  describe("functions / skills namespace", () => {
    it("skill endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.functions.list).toBe(`${AGENT_BASE}/agent-functions/`);
      expect(ENDPOINTS.functions.execute("1")).toBe(`${AGENT_BASE}/agent-functions/1/execute/`);
    });
  });

  describe("channels namespace", () => {
    it("channel endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.channels.list).toBe(`${AGENT_BASE}/channels/`);
      expect(ENDPOINTS.channels.catalog).toBe(`${AGENT_BASE}/channels/catalog/`);
    });
  });

  describe("llm namespace", () => {
    it("LLM endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.llm.providers).toBe(`${AGENT_BASE}/llm-providers/`);
      expect(ENDPOINTS.llm.models).toBe(`${AGENT_BASE}/llm-models/`);
    });
  });

  describe("chatbot sessions namespace", () => {
    it("chatbot session endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.chatbotSessions.list).toBe(`${AGENT_BASE}/chatbot-sessions/`);
      expect(ENDPOINTS.chatbotSessions.detail("1")).toBe(`${AGENT_BASE}/chatbot-sessions/1/`);
      expect(ENDPOINTS.chatbotSessions.close("1")).toBe(`${AGENT_BASE}/chatbot-sessions/1/close/`);
    });
  });

  describe("data volumes namespace", () => {
    it("data volume endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.dataVolumes.list).toBe(`${AGENT_BASE}/data-volumes/`);
    });
  });

  describe("workflows namespace", () => {
    it("workflow endpoints start with /ai-agents/", () => {
      expect(ENDPOINTS.workflows.list).toBe(`${AGENT_BASE}/workflows/`);
      expect(ENDPOINTS.workPlans.list).toBe(`${AGENT_BASE}/work-plans/`);
      expect(ENDPOINTS.workItems.list).toBe(`${AGENT_BASE}/work-items/`);
    });
  });
});
