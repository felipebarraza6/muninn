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

describe("auth session token persistence (token mode)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetAuthSessionStateForTests();
    resetCsrfForTests();
  });

  it("persists the token in localStorage so reload keeps the session", () => {
    persistSession({ token: "secreto", user });
    expect(getToken()).toBe("secreto");
    expect(localStorage.getItem("token")).toBe("secreto");
    expect(isAuthenticated()).toBe(true);
    expect(JSON.parse(localStorage.getItem("user") || "{}").email).toBe("ada@example.com");
  });

  it("still authenticates after resetting in-memory state (simulates reload)", () => {
    persistSession({ token: "sobrevive-reload", user });
    resetAuthSessionStateForTests();
    expect(getToken()).toBe("sobrevive-reload");
    expect(isAuthenticated()).toBe(true);
  });

  it("reads an existing localStorage token without wiping it", () => {
    localStorage.setItem("token", "legado");
    expect(getToken()).toBe("legado");
    expect(localStorage.getItem("token")).toBe("legado");
  });

  it("clears token and user from localStorage", () => {
    persistSession({ token: "secreto", user });
    clearSession();
    expect(getToken()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
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
