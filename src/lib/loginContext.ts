/**
 * Contexto del portal de login (branch / organization) para post-login
 * y preferencia de X-Branch-ID.
 */

import type { PublicLoginThemeResponse, PublicStoreSummary } from "@/lib/publicLoginTheme";

const KEY = "muninn-login-context";

export type LoginPortalContext = {
  scope: "branch" | "organization" | "app";
  branchId: string | null;
  organizationId: string | null;
  organizationName?: string | null;
  stores: PublicStoreSummary[];
  fallbackFromBranchSlug?: string | null;
  host?: string;
  slug?: string | null;
};

export function clearLoginPortalContext(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function persistLoginPortalContext(ctx: LoginPortalContext): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    // ignore
  }
}

export function getLoginPortalContext(): LoginPortalContext | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LoginPortalContext;
  } catch {
    return null;
  }
}

export function loginContextFromPublicTheme(
  theme: PublicLoginThemeResponse | null,
  meta?: { host?: string; slug?: string | null },
): LoginPortalContext {
  if (!theme) {
    return {
      scope: "app",
      branchId: null,
      organizationId: null,
      stores: [],
      host: meta?.host,
      slug: meta?.slug ?? null,
    };
  }

  return {
    scope: theme.scope,
    branchId: theme.branch_id != null ? String(theme.branch_id) : null,
    organizationId: theme.organization_id != null ? String(theme.organization_id) : null,
    organizationName: theme.organization_name ?? null,
    stores: theme.stores ?? [],
    fallbackFromBranchSlug: theme.fallback_from_branch_slug ?? null,
    host: meta?.host,
    slug: meta?.slug ?? theme.login_slug ?? null,
  };
}
