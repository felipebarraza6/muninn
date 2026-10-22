import { describe, expect, it } from "vitest";
import { selectStudioSummaryCounts, type PlatformStudioSummary } from "../platformStudioSummary";

const summary: PlatformStudioSummary = {
  generated_at: "2026-01-01T00:00:00Z",
  totals: {
    agents: 12,
    channels: 4,
    external_apis: 7,
    agent_functions: 30,
    knowledge_docs: 99,
  },
  by_branch: [
    {
      branch_id: 10,
      branch_name: "Clínica A",
      counts: {
        agents: 5,
        channels: 2,
        external_apis: 3,
        agent_functions: 8,
      },
    },
    {
      branch_id: 20,
      branch_name: "Clínica B",
      counts: {
        agents: 7,
        channels: 2,
        external_apis: 4,
        agent_functions: 22,
      },
    },
  ],
};

describe("selectStudioSummaryCounts", () => {
  it("returns null when there is no summary yet (avoid deceptive zeros)", () => {
    expect(selectStudioSummaryCounts(undefined, null)).toBeNull();
    expect(selectStudioSummaryCounts(null, "10")).toBeNull();
  });

  it("uses global totals when branch filter is Todas (null)", () => {
    expect(selectStudioSummaryCounts(summary, null)).toEqual({
      agents: 12,
      channels: 4,
      applications: 7,
      skills: 30,
    });
  });

  it("uses the branch breakdown when a sucursal is selected", () => {
    expect(selectStudioSummaryCounts(summary, "10")).toEqual({
      agents: 5,
      channels: 2,
      applications: 3,
      skills: 8,
    });
  });

  it("returns null for an unknown branch instead of inventing zeros", () => {
    expect(selectStudioSummaryCounts(summary, "999")).toBeNull();
  });
});
