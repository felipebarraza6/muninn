/**
 * Cola local de plantillas en revisión.
 * El API no lista pendientes: guardamos lo que devolvemos al publicar
 * para la bandeja del superadmin en este navegador.
 */

export type PendingCatalogReview = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  review_status: string;
  visibility: string;
  published_at: string;
  agent_id?: string;
};

const STORAGE_KEY = "muninn:agent-catalog:pending-reviews";

function readAll(): PendingCatalogReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is PendingCatalogReview =>
        !!row &&
        typeof row === "object" &&
        typeof (row as PendingCatalogReview).slug === "string" &&
        typeof (row as PendingCatalogReview).id === "string",
    );
  } catch {
    return [];
  }
}

function writeAll(rows: PendingCatalogReview[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function listPendingCatalogReviews(): PendingCatalogReview[] {
  return readAll().sort((a, b) => b.published_at.localeCompare(a.published_at));
}

export function upsertPendingCatalogReview(entry: PendingCatalogReview) {
  const rows = readAll().filter((row) => row.slug !== entry.slug);
  rows.unshift(entry);
  writeAll(rows);
}

export function removePendingCatalogReview(slug: string) {
  writeAll(readAll().filter((row) => row.slug !== slug));
}

export function updatePendingCatalogReviewStatus(slug: string, review_status: string) {
  const rows = readAll().map((row) => (row.slug === slug ? { ...row, review_status } : row));
  writeAll(rows);
}
