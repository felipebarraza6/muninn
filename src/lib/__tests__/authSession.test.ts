import { beforeEach, describe, expect, it } from "vitest";
import { resolveAuthMode } from "../authMode";
import {
  clearSession,
  getToken,
  isAuthenticated,
  persistSession,
  resetAuthSessionStateForTests,
} from "../authSession";
import { resetCsrfForTests, csrfHeaderRecord, readCsrfToken, rememberCsrfToken } from "../csrf";

const user = {
  id: 1,
  username: "ada",
  email: "ada@example.com",
  first_name: "Ada",
  last_name: "Lovelace",
  full_name: "Ada Lovelace",
  type_user: "CLIENT",
  is_superuser: false,
  is_admin: false,
  is_client: true,
  branch_assignments: [],
};

describe("resolveAuthMode", () => {
  it("defaults to token", () => {
    expect(resolveAuthMode(undefined)).toBe("token");
    expect(resolveAuthMode("")).toBe("token");
    expect(resolveAuthMode("cookie")).toBe("cookie");
    expect(resolveAuthMode("  COOKIE ")).toBe("cookie");
  });
});

describe("auth session token memory", () => {
  beforeEach(() => {
    localStorage.clear();
    resetAuthSessionStateForTests();
    resetCsrfForTests();
  });

  it("keeps the token in memory and removes it from localStorage", () => {
    persistSession({ token: "secreto", user });
    expect(getToken()).toBe("secreto");
    expect(localStorage.getItem("token")).toBeNull();
    expect(isAuthenticated()).toBe(true);
    expect(JSON.parse(localStorage.getItem("user") || "{}").email).toBe("ada@example.com");
  });

  it("adopts a legacy localStorage token once and then deletes it", () => {
    localStorage.setItem("token", "legado");
    expect(getToken()).toBe("legado");
    expect(localStorage.getItem("token")).toBeNull();
    resetAuthSessionStateForTests();
    expect(getToken()).toBeNull();
  });

  it("clears the memory token", () => {
    persistSession({ token: "secreto", user });
    clearSession();
    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});

describe("csrf header", () => {
  beforeEach(() => {
    resetCsrfForTests();
  });

  it("does not attach a header in the default token mode", () => {
    rememberCsrfToken("abc");
    expect(csrfHeaderRecord("post")).toEqual({});
    expect(readCsrfToken()).toBe("abc");
  });
});
