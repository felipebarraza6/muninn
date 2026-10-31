import { describe, expect, it } from "vitest";
import { isPublicAppPath, resolveEntrarHref, stripAppBasePath } from "../authRedirect";

describe("authRedirect", () => {
  it("strips the Vite base path from location.pathname", () => {
    expect(stripAppBasePath("/muninn/app/agentes", "/muninn/")).toBe("/app/agentes");
    expect(stripAppBasePath("/app/agentes", "/")).toBe("/app/agentes");
    expect(stripAppBasePath("/muninn/entrar", "/muninn/")).toBe("/entrar");
  });

  it("treats /entrar and branded login as public under a base path", () => {
    expect(isPublicAppPath("/muninn/entrar", "/muninn/")).toBe(true);
    expect(isPublicAppPath("/muninn/app/agentes", "/muninn/")).toBe(false);
    expect(isPublicAppPath("/entrar", "/")).toBe(true);
    expect(isPublicAppPath("/agentes", "/")).toBe(true);
    expect(isPublicAppPath("/agentes/huginn", "/")).toBe(true);
    expect(isPublicAppPath("/muninn/agentes/huginn", "/muninn/")).toBe(true);
  });

  it("builds /entrar respecting the app base path (staging Pages)", () => {
    expect(resolveEntrarHref("/muninn/")).toBe("/muninn/entrar");
    expect(resolveEntrarHref("/")).toBe("/entrar");
    expect(resolveEntrarHref("")).toBe("/entrar");
  });
});
