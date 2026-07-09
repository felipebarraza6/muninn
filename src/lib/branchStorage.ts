/**
 * Manejo centralizado del branch_id activo.
 * Adaptado de sindre a TypeScript; mantiene compatibilidad con la API.
 */

export const GLOBAL_BRANCH_ID = "all";

const SPECIAL_BRANCH_IDS = new Set([GLOBAL_BRANCH_ID, "global", "", null, undefined]);

let memoryCache: { activeBranchId: string | null; timestamp: number | null } = {
  activeBranchId: null,
  timestamp: null,
};

const CACHE_TTL = 5000;

export function isGlobalBranchId(id: unknown): boolean {
  if (!id) return false;
  return String(id).trim().toLowerCase() === GLOBAL_BRANCH_ID;
}

export function isValidBranchId(id: unknown): boolean {
  if (!id) return false;
  const strId = String(id).trim();
  if (strId === "" || SPECIAL_BRANCH_IDS.has(strId)) return false;
  const numericId = parseInt(strId, 10);
  return !isNaN(numericId);
}

export type BranchMode = "global" | "branch" | "none";

export function getBranchMode(): BranchMode {
  const raw = getRawBranchId();
  if (isGlobalBranchId(raw)) return "global";
  if (isValidBranchId(raw)) return "branch";
  return "none";
}

function getRawBranchId(): string | null {
  const now = Date.now();
  if (
    memoryCache.activeBranchId !== undefined &&
    memoryCache.timestamp &&
    now - memoryCache.timestamp < CACHE_TTL
  ) {
    return memoryCache.activeBranchId;
  }

  const fromSession = sessionStorage.getItem("activeBranchId");
  const fromLocal = localStorage.getItem("activeBranchId");
  const value = fromSession || fromLocal || null;

  memoryCache = { activeBranchId: value, timestamp: now };
  return value;
}

export function getActiveBranchId(): string | null {
  const raw = getRawBranchId();
  return isValidBranchId(raw) ? String(raw) : null;
}

export function getActiveBranchIdInt(): number | null {
  const id = getActiveBranchId();
  if (!id) return null;
  const numericId = parseInt(id, 10);
  return isNaN(numericId) ? null : numericId;
}

export function setActiveBranchId(
  id: string | number | null | undefined,
  persist = true,
  isSuperAdmin = false,
): void {
  let value: string | null = null;

  if (isGlobalBranchId(id)) {
    value = isSuperAdmin ? GLOBAL_BRANCH_ID : null;
  } else if (isValidBranchId(id)) {
    value = String(id);
  }

  if (value) {
    sessionStorage.setItem("activeBranchId", value);
  } else {
    sessionStorage.removeItem("activeBranchId");
  }

  if (persist && value && !isGlobalBranchId(value)) {
    localStorage.setItem("activeBranchId", value);
  } else {
    localStorage.removeItem("activeBranchId");
  }

  memoryCache = { activeBranchId: value, timestamp: Date.now() };

  window.dispatchEvent(
    new CustomEvent("branchChanged", {
      detail: { branchId: value, mode: getBranchMode(), persist },
    }),
  );
}

export function setGlobalBranchMode(persistInSession = true): void {
  setActiveBranchId(GLOBAL_BRANCH_ID, persistInSession, true);
}

export function clearActiveBranchId(): void {
  sessionStorage.removeItem("activeBranchId");
  localStorage.removeItem("activeBranchId");
  memoryCache = { activeBranchId: null, timestamp: null };

  window.dispatchEvent(
    new CustomEvent("branchChanged", {
      detail: { branchId: null, mode: "none", persist: false },
    }),
  );
}

export function hasActiveBranch(): boolean {
  return getBranchMode() === "branch";
}

export function syncBranchId(): string | null {
  const sessionId = sessionStorage.getItem("activeBranchId");
  const localId = localStorage.getItem("activeBranchId");

  if (sessionId && !localId) {
    localStorage.setItem("activeBranchId", sessionId);
  } else if (localId && !sessionId) {
    sessionStorage.setItem("activeBranchId", localId);
  }

  return getActiveBranchId();
}

export function onBranchChange(
  callback: (branchId: string | null, mode: BranchMode, persist: boolean) => void,
): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    callback(detail.branchId, detail.mode, detail.persist);
  };
  window.addEventListener("branchChanged", handler);
  return () => window.removeEventListener("branchChanged", handler);
}
