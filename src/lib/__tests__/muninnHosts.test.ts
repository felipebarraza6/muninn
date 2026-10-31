import { afterEach, describe, expect, it, vi } from "vitest";
import { isMuninnOwnHost, normalizeHostname } from "../muninnHosts";

describe("muninn own hosts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes port, scheme and path", () => {
    expect(normalizeHostname("localhost:3001")).toBe("localhost");
    expect(normalizeHostname("https://Muninn.Yggdra.cl/ruta")).toBe("muninn.yggdra.cl");
    expect(normalizeHostname("[::1]:4173")).toBe("::1");
  });

  it("treats Muninn hosts as the default brand, including a port", () => {
    expect(isMuninnOwnHost("muninn.yggdra.cl")).toBe(true);
    expect(isMuninnOwnHost("felipebarraza6.github.io")).toBe(true);
    expect(isMuninnOwnHost("localhost:4173")).toBe(true);
    expect(isMuninnOwnHost("127.0.0.1")).toBe(true);
  });

  it("does not treat a customer domain as Muninn", () => {
    expect(isMuninnOwnHost("frig.cl")).toBe(false);
    expect(isMuninnOwnHost("app.cliente.cl")).toBe(false);
    expect(isMuninnOwnHost("")).toBe(false);
    expect(isMuninnOwnHost(null)).toBe(false);
  });

  it("adds hosts from VITE_MUNINN_HOSTS without dropping the builtins", () => {
    vi.stubEnv("VITE_MUNINN_HOSTS", "preview.example.com, muninn.yggdra.cl");
    expect(isMuninnOwnHost("preview.example.com")).toBe(true);
    expect(isMuninnOwnHost("localhost")).toBe(true);
  });
});
