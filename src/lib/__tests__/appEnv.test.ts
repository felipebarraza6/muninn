import { describe, it, expect } from "vitest";
import { isStagingApp, resolveAppEnv } from "../appEnv";

describe("resolveAppEnv", () => {
  it("returns development when Vite DEV is true", () => {
    expect(resolveAppEnv({ DEV: true, VITE_APP_ENV: "staging" })).toBe("development");
  });

  it("returns staging when VITE_APP_ENV is staging in a production build", () => {
    expect(resolveAppEnv({ DEV: false, VITE_APP_ENV: "staging" })).toBe("staging");
  });

  it("treats staging as case-insensitive and trimmed", () => {
    expect(resolveAppEnv({ DEV: false, VITE_APP_ENV: "  Staging " })).toBe("staging");
  });

  it("returns production when VITE_APP_ENV is unset in a production build", () => {
    expect(resolveAppEnv({ DEV: false })).toBe("production");
  });

  it("returns production for any non-staging value", () => {
    expect(resolveAppEnv({ DEV: false, VITE_APP_ENV: "prod" })).toBe("production");
  });
});

describe("isStagingApp", () => {
  it("is true only for staging production builds", () => {
    expect(isStagingApp({ DEV: false, VITE_APP_ENV: "staging" })).toBe(true);
    expect(isStagingApp({ DEV: true, VITE_APP_ENV: "staging" })).toBe(false);
    expect(isStagingApp({ DEV: false })).toBe(false);
  });
});
