import { describe, it, expect, beforeEach } from "vitest";
import {
  canAccessAgents,
  canAccessChannels,
  canSeeBilling,
  isSuperAdmin,
  isOrganizationOwner,
} from "../authGuards";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

function setUser(overrides: Record<string, unknown> = {}) {
  const user = { id: 1, is_superuser: false, is_admin: false, ...overrides };
  localStorage.setItem("user", JSON.stringify(user));
}

function setBranches(branches: Array<Record<string, unknown>> = []) {
  localStorage.setItem("branches", JSON.stringify(branches));
}

describe("authGuards", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("canAccessAgents", () => {
    it("returns false when no user is stored", () => {
      expect(canAccessAgents()).toBe(false);
    });

    it("returns true for superadmin", () => {
      setUser({ is_superuser: true });
      expect(canAccessAgents()).toBe(true);
    });

    it("returns true for org owner", () => {
      setUser({ is_organization_owner: true });
      setBranches([{ branch_id: 1, is_active: true }]);
      expect(canAccessAgents()).toBe(true);
    });

    it("returns true for user with active branch", () => {
      setUser({});
      setBranches([{ branch_id: 1, is_active: true }]);
      expect(canAccessAgents()).toBe(true);
    });

    it("returns false for user with no branches", () => {
      setUser({});
      setBranches([]);
      expect(canAccessAgents()).toBe(false);
    });

    it("returns false for user with only inactive branches", () => {
      setUser({});
      setBranches([{ branch_id: 1, is_active: false }]);
      expect(canAccessAgents()).toBe(false);
    });
  });

  describe("canAccessChannels", () => {
    it("hides channels from an OWNER without the ai_agents module", () => {
      setUser({});
      setBranches([{ branch_id: 1, role: "OWNER", is_active: true }]);
      localStorage.setItem("permissions", JSON.stringify({ enabled_apps: ["dashboard"] }));
      expect(canAccessChannels()).toBe(false);
    });

    it("shows channels to an OWNER when the login enabled ai_agents", () => {
      setUser({});
      setBranches([{ branch_id: 1, role: "OWNER", is_active: true }]);
      localStorage.setItem("permissions", JSON.stringify({ enabled_apps: ["ai_agents"] }));
      expect(canAccessChannels()).toBe(true);
    });

    it("shows channels to superadmin and org owner without that list", () => {
      setUser({ is_superuser: true });
      expect(canAccessChannels()).toBe(true);
      localStorage.clear();
      setUser({ is_organization_owner: true });
      expect(canAccessChannels()).toBe(true);
    });
  });

  describe("canSeeBilling", () => {
    it("shows billing to an OWNER and hides it from a staff role", () => {
      setUser({});
      setBranches([{ branch_id: 1, role: "OWNER", is_active: true }]);
      expect(canSeeBilling()).toBe(true);
      localStorage.clear();
      setUser({});
      setBranches([{ branch_id: 1, role: "EMPLOYEE", is_active: true }]);
      expect(canSeeBilling()).toBe(false);
    });

    it("shows billing to superadmin without branch ownership", () => {
      setUser({ is_superuser: true });
      expect(canSeeBilling()).toBe(true);
    });
  });
});
