import { describe, it, expect, beforeEach } from "vitest";
import { canAccessAgents, isSuperAdmin, isOrganizationOwner } from "../authGuards";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
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
});
