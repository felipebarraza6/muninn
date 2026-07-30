/**
 * Extrae artefactos descargables desde `WorkItem.result`
 * (URLs, base64, CSV, y documentos nativos con document_id → PDF/XLSX).
 */

import { GET } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { getActiveBranchId, getBranchMode } from "@/lib/branchStorage";
import { resolveMediaUrl } from "@/lib/mediaUrl";

export type ResultArtifact = {
  id: string;
  name: string;
  kind: "url" | "base64" | "text" | "document";
  /** URL remota, /media/… o data: */
  href?: string;
  /** ID en /documents/ (PDF/XLSX generados por skills) */
  documentId?: string;
  /** Contenido de texto para blob local */
  content?: string;
  mime: string;
  sizeHint?: string;
};

type DocumentDetail = {
  id?: string;
  title?: string;
  file_url?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_extension?: string | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Parsea JSON string o devuelve el objeto si ya lo es. */
export function tryParseJsonValue(value: unknown): unknown | null {
  if (value != null && typeof value === "object") return value;
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!(t.startsWith("{") || t.startsWith("["))) return null;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return null;
  }
}

/** Etiqueta corta para UI (evita MIME largos cortados). */
export function humanFileKind(name: string, mime = ""): string {
  const n = name.toLowerCase();
  const m = mime.toLowerCase();
  if (n.endsWith(".pdf") || m.includes("pdf")) return "PDF";
  if (n.endsWith(".xlsx") || m.includes("spreadsheet")) return "Excel";
  if (n.endsWith(".xls") || m.includes("ms-excel")) return "Excel";
  if (n.endsWith(".csv") || m.includes("csv")) return "CSV";
  if (n.endsWith(".json") || m.includes("json")) return "JSON";
  if (n.endsWith(".md") || m.includes("markdown")) return "Markdown";
  if (n.endsWith(".html") || m.includes("html")) return "HTML";
  if (n.endsWith(".zip") || m.includes("zip")) return "ZIP";
  if (m.startsWith("image/")) return "Imagen";
  if (m.startsWith("text/")) return "Texto";
  return "Archivo";
}

function formatScalar(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "string") return v;
  return prettyInline(v);
}

function prettyInline(v: unknown): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/** Prefiere el payload de skill (metrics/xlsx) aunque venga dentro de content/result. */
function resolveSkillPayload(rawResult: unknown, replyText = ""): Record<string, unknown> | null {
  const candidates: unknown[] = [
    isRecord(rawResult) ? rawResult.content : null,
    isRecord(rawResult) ? rawResult.result : null,
    replyText,
    rawResult,
  ];
  for (const c of candidates) {
    const parsed = tryParseJsonValue(c);
    if (!isRecord(parsed)) continue;
    if (
      parsed.metrics ||
      parsed.xlsx ||
      parsed.report ||
      parsed.period ||
      parsed.document_id ||
      typeof parsed.tickets_count === "number"
    ) {
      return parsed;
    }
  }
  const fallback = tryParseJsonValue(replyText) ?? tryParseJsonValue(rawResult);
  return isRecord(fallback) ? fallback : null;
}

/**
 * Resumen corto para cards del flujo (sin volcar JSON).
 * Ej: "Excel + PDF · 40 tickets · 2026-06"
 */
export function summarizeWorkResult(rawResult: unknown, replyText = ""): string {
  const artifacts = extractResultArtifacts(rawResult, replyText);
  const fileBits = artifacts
    .filter((a) => a.kind === "document" || a.kind === "url" || a.kind === "base64")
    .map((a) => humanFileKind(a.name, a.mime));
  const uniqueFiles = [...new Set(fileBits)];

  const parsed = resolveSkillPayload(rawResult, replyText);

  const bits: string[] = [];
  if (uniqueFiles.length) bits.push(uniqueFiles.join(" + "));

  if (parsed) {
    const period = isRecord(parsed.period)
      ? asString(parsed.period.label) ||
        asString(parsed.period.period) ||
        asString(parsed.period.month)
      : asString(parsed.period);
    const tickets =
      typeof parsed.tickets_count === "number"
        ? parsed.tickets_count
        : isRecord(parsed.metrics) && typeof parsed.metrics.total === "number"
          ? parsed.metrics.total
          : undefined;
    if (typeof tickets === "number") bits.push(`${tickets} tickets`);
    if (period) bits.push(period);
    if (parsed.success === false && asString(parsed.error)) {
      return asString(parsed.error) || "Error";
    }
    if (!bits.length && parsed.success === true) bits.push("OK");
  }

  if (bits.length) return bits.join(" · ");

  const text = replyText.trim();
  if (!text) return "";
  if (tryParseJsonValue(text)) return "Resultado JSON";
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

/** Filas planas para mostrar métricas / campos útiles (sin anidar archivos). */
export function structuredResultRows(
  rawResult: unknown,
  replyText = "",
): Array<{ label: string; value: string }> {
  const skip = new Set([
    "content",
    "ok",
    "tool_calls",
    "nodes",
    "files",
    "attachments",
    "artifacts",
    "downloads",
    "xlsx",
    "report",
    "pdf",
    "document",
    "documents",
    "file",
    "result",
    "output",
  ]);

  const data = resolveSkillPayload(rawResult, replyText);
  if (!data) return [];

  const rows: Array<{ label: string; value: string }> = [];

  if (typeof data.success === "boolean") {
    rows.push({ label: "Estado", value: data.success ? "OK" : "Error" });
  }
  if (asString(data.error)) rows.push({ label: "Error", value: asString(data.error)! });

  const period = data.period;
  if (isRecord(period)) {
    const label =
      asString(period.label) ||
      asString(period.period) ||
      asString(period.month) ||
      prettyInline(period);
    rows.push({ label: "Periodo", value: label });
  } else if (asString(period)) {
    rows.push({ label: "Periodo", value: asString(period)! });
  }

  if (typeof data.tickets_count === "number") {
    rows.push({ label: "Tickets", value: String(data.tickets_count) });
  }
  if (asString(data.source)) rows.push({ label: "Fuente", value: asString(data.source)! });

  const metrics = data.metrics;
  if (isRecord(metrics)) {
    for (const [k, v] of Object.entries(metrics)) {
      if (v == null || typeof v === "object") continue;
      rows.push({
        label: k === "total" ? "Total" : k.replace(/_/g, " "),
        value: formatScalar(v),
      });
    }
  }

  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || k === "success" || k === "error" || k === "period" || k === "metrics") {
      continue;
    }
    if (k === "tickets_count" || k === "source" || k === "api_error") {
      if (k === "api_error" && v) rows.push({ label: "API", value: formatScalar(v) });
      continue;
    }
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      rows.push({ label: k.replace(/_/g, " "), value: formatScalar(v) });
    }
  }

  return rows;
}

function basename(path: string): string {
  const clean = path.split("?")[0] || path;
  const parts = clean.split(/[/\\]/).filter(Boolean);
  return parts[parts.length - 1] || clean;
}

/** Django FileField.name → URL servida en /media/… */
export function mediaUrlFromStoragePath(filename: string | undefined): string | undefined {
  const raw = (filename || "").trim();
  if (!raw || raw.startsWith("data:") || /^https?:\/\//i.test(raw)) return undefined;
  if (raw.startsWith("/media/")) return resolveMediaUrl(raw) || raw;
  if (raw.startsWith("media/")) {
    const path = `/${raw}`;
    return resolveMediaUrl(path) || path;
  }
  // Path relativo de storage (documents/<branch>/…/archivo.xlsx)
  if (raw.includes("/")) {
    const path = `/media/${raw.replace(/^\/+/, "")}`;
    return resolveMediaUrl(path) || path;
  }
  return undefined;
}

function errorMessage(err: unknown, fallback: string): string {
  if (!err || typeof err !== "object") return fallback;
  const e = err as {
    friendlyMessage?: string;
    message?: string;
    response?: { status?: number; data?: { detail?: unknown } };
  };
  if (e.friendlyMessage) return e.friendlyMessage;
  const status = e.response?.status;
  if (status === 403) return "Sin permiso para leer Documents (módulo config).";
  if (status === 404) return "Documento no encontrado en esta sucursal.";
  const detail = e.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (typeof e.message === "string" && e.message.trim() && e.message !== "Error") {
    return e.message;
  }
  return fallback;
}

function guessMime(name: string, explicit?: string): string {
  if (explicit && explicit.includes("/")) return explicit;
  const lower = name.toLowerCase();
  const fmt = (explicit || "").toLowerCase();
  if (fmt === "pdf" || lower.endsWith(".pdf")) return "application/pdf";
  if (fmt === "xlsx" || lower.endsWith(".xlsx"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (fmt === "xls" || lower.endsWith(".xls")) return "application/vnd.ms-excel";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "text/markdown";
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".zip")) return "application/zip";
  return explicit || "application/octet-stream";
}

function looksLikeCsv(text: string): boolean {
  const sample = text.trim().slice(0, 800);
  if (!sample.includes("\n") && !sample.includes(",")) return false;
  const lines = sample.split("\n").filter(Boolean);
  if (lines.length < 2) return false;
  const commas = lines.slice(0, 5).map((l) => (l.match(/,/g) || []).length);
  return commas.every((c) => c >= 1) && Math.max(...commas) - Math.min(...commas) <= 2;
}

function looksLikeHtml(text: string): boolean {
  const t = text.trim().slice(0, 200).toLowerCase();
  return t.startsWith("<!doctype html") || t.startsWith("<html") || /^<[a-z]+[\s>]/.test(t);
}

function ensureExtension(name: string, mimeOrFormat: string): string {
  if (/\.[a-z0-9]{2,5}$/i.test(name)) return name;
  const fmt = mimeOrFormat.toLowerCase();
  if (fmt.includes("pdf") || fmt === "pdf") return `${name}.pdf`;
  if (fmt.includes("spreadsheet") || fmt.includes("xlsx") || fmt === "xlsx") return `${name}.xlsx`;
  if (fmt.includes("ms-excel") || fmt === "xls") return `${name}.xls`;
  if (fmt.includes("csv") || fmt === "csv") return `${name}.csv`;
  return name;
}

function pushUnique(list: ResultArtifact[], item: ResultArtifact) {
  if (
    list.some(
      (x) =>
        x.id === item.id ||
        (item.documentId && x.documentId === item.documentId) ||
        (x.name === item.name && x.href === item.href && x.kind === item.kind),
    )
  ) {
    return;
  }
  list.push(item);
}

function resolveUrl(raw: string): string {
  return resolveMediaUrl(raw) || raw;
}

function artifactFromObject(
  obj: Record<string, unknown>,
  index: number,
  hintKey = "",
): ResultArtifact | null {
  const formatHint =
    asString(obj.format) ||
    asString(obj.ext) ||
    asString(obj.extension) ||
    (hintKey === "xlsx" || hintKey === "excel" || hintKey === "spreadsheet"
      ? "xlsx"
      : hintKey === "report" || hintKey === "pdf"
        ? "pdf"
        : undefined);

  const storagePath =
    asString(obj.filename) || asString(obj.file_name) || asString(obj.file) || asString(obj.path);
  const rawName =
    storagePath ||
    asString(obj.name) ||
    asString(obj.title) ||
    (hintKey ? `${hintKey}-${index + 1}` : `archivo-${index + 1}`);
  const nameBase = basename(rawName);
  const mime = guessMime(
    nameBase,
    asString(obj.mime) ||
      asString(obj.mime_type) ||
      asString(obj.content_type) ||
      asString(obj.mimetype) ||
      formatHint,
  );
  const name = ensureExtension(nameBase, formatHint || mime);
  const mediaHref = mediaUrlFromStoragePath(storagePath);

  const documentId = asString(obj.document_id) || asString(obj.documentId);

  if (documentId && /^[0-9a-f-]{16,}$/i.test(documentId)) {
    return {
      id: `doc-${documentId}`,
      name,
      kind: "document",
      documentId,
      href: mediaHref,
      mime,
      sizeHint: typeof obj.bytes === "number" ? `${Math.round(obj.bytes / 1024)} KB` : undefined,
    };
  }

  const url =
    mediaHref ||
    asString(obj.url) ||
    asString(obj.href) ||
    asString(obj.download_url) ||
    asString(obj.file_url) ||
    asString(obj.media_url) ||
    asString(obj.path);
  const b64 =
    asString(obj.base64) ||
    asString(obj.content_base64) ||
    asString(obj.data_base64) ||
    (asString(obj.data)?.startsWith("data:") ? asString(obj.data) : undefined);

  if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
    return {
      id: `url-${index}-${name}`,
      name,
      kind: "url",
      href: resolveUrl(url),
      mime,
    };
  }
  if (b64) {
    const href = b64.startsWith("data:")
      ? b64
      : `data:${mime};base64,${b64.replace(/^base64,/, "")}`;
    return {
      id: `b64-${index}-${name}`,
      name,
      kind: "base64",
      href,
      mime,
    };
  }
  return null;
}

const NESTED_FILE_KEYS = new Set([
  "files",
  "attachments",
  "artifacts",
  "downloads",
  "outputs",
  "documents",
  "xlsx",
  "xls",
  "excel",
  "spreadsheet",
  "report",
  "pdf",
  "document",
  "file",
  "output",
  "result",
  "nodes",
]);

function walkForArtifacts(value: unknown, out: ResultArtifact[], depth: number, hintKey = "") {
  if (value == null || depth > 8) return;

  if (typeof value === "string") {
    const t = value.trim();
    if (
      (t.startsWith("{") || t.startsWith("[")) &&
      t.length < 200_000 &&
      (t.includes("document_id") || t.includes(".pdf") || t.includes(".xlsx"))
    ) {
      try {
        walkForArtifacts(JSON.parse(t) as unknown, out, depth + 1, hintKey);
      } catch {
        /* ignore */
      }
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (typeof item === "string" && /^https?:\/\//i.test(item)) {
        const name = basename(item);
        pushUnique(out, {
          id: `url-str-${depth}-${i}-${name}`,
          name,
          kind: "url",
          href: resolveUrl(item),
          mime: guessMime(name),
        });
        return;
      }
      walkForArtifacts(item, out, depth + 1, hintKey);
    });
    return;
  }

  if (!isRecord(value)) return;

  const art = artifactFromObject(value, depth, hintKey);
  if (art) pushUnique(out, art);

  for (const [key, child] of Object.entries(value)) {
    const lower = key.toLowerCase();
    // Evitar recorrer ruido enorme / no-archivo
    if (
      lower === "tool_calls" ||
      lower === "rag_context" ||
      lower === "parameters" ||
      lower === "payload"
    ) {
      // Igual puede haber document_id en tool result — solo entra un nivel si es array/obj pequeño
      if (isRecord(child) || Array.isArray(child)) {
        walkForArtifacts(child, out, depth + 1, lower);
      }
      continue;
    }
    if (
      NESTED_FILE_KEYS.has(lower) ||
      lower === "content" ||
      lower === "context" ||
      lower.includes("document") ||
      lower.includes("file") ||
      lower.includes("xlsx") ||
      lower.includes("pdf") ||
      lower.includes("report") ||
      lower === "output" ||
      lower === "result" ||
      lower === "nodes"
    ) {
      walkForArtifacts(child, out, depth + 1, lower);
    } else if (isRecord(child) && (child.document_id || child.documentId || child.file_url)) {
      walkForArtifacts(child, out, depth + 1, lower);
    } else if (
      typeof child === "string" &&
      (child.includes("document_id") || child.includes(".pdf") || child.includes(".xlsx"))
    ) {
      walkForArtifacts(child, out, depth + 1, lower);
    }
  }
}

/** Escanea result del ítem y el texto principal. */
export function extractResultArtifacts(rawResult: unknown, replyText = ""): ResultArtifact[] {
  const out: ResultArtifact[] = [];
  walkForArtifacts(rawResult, out, 0);

  // Inferir CSV/HTML desde el texto de respuesta si no hay artefactos.
  if (!out.length && replyText.trim().length > 40) {
    if (looksLikeCsv(replyText)) {
      pushUnique(out, {
        id: "inferred-csv",
        name: "resultado.csv",
        kind: "text",
        content: replyText,
        mime: "text/csv",
      });
    } else if (looksLikeHtml(replyText)) {
      pushUnique(out, {
        id: "inferred-html",
        name: "resultado.html",
        kind: "text",
        content: replyText,
        mime: "text/html",
      });
    } else {
      walkForArtifacts(replyText, out, 0);
    }
  }

  return out;
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchBlobWithAuth(href: string): Promise<Blob> {
  // No usar apiClient: baseURL `/api` rompería paths `/media/...`.
  const resolved = resolveUrl(href);
  const headers: Record<string, string> = { Accept: "*/*" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Token ${token}`;
  const branchId = getActiveBranchId();
  if (branchId && getBranchMode() === "branch") {
    headers["x-branch-id"] = branchId;
  }
  const res = await fetch(resolved, { credentials: "include", headers });
  if (!res.ok) throw new Error(`No se pudo leer el archivo (HTTP ${res.status})`);
  return res.blob();
}

function triggerAnchorDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = resolveUrl(href);
  a.download = filename;
  a.rel = "noopener";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function downloadFromHref(href: string, filename: string) {
  const blob = await fetchBlobWithAuth(href);
  // Evitar “descargar” HTML de error 200 enmascarado
  if (blob.type.includes("text/html") && blob.size < 4096) {
    throw new Error("El archivo no está disponible en media");
  }
  triggerBlobDownload(blob, filename);
}

async function resolveDocumentFileUrl(documentId: string): Promise<{
  href: string;
  name?: string;
  mime?: string;
}> {
  const doc = await GET<DocumentDetail>(ENDPOINTS.documents.detail(documentId));
  const fileUrl = asString(doc.file_url) || mediaUrlFromStoragePath(asString(doc.file_name));
  // A veces `file` viene como path de storage en el JSON.
  const fileField = (doc as DocumentDetail & { file?: string }).file;
  const fromFile = mediaUrlFromStoragePath(asString(fileField));
  const href = fileUrl ? resolveUrl(fileUrl) : fromFile;
  if (!href) throw new Error("Documento sin archivo");
  return {
    href,
    name: asString(doc.file_name) || asString(doc.title),
    mime: asString(doc.mime_type) || asString(doc.file_extension),
  };
}

async function downloadDocumentArtifact(artifact: ResultArtifact) {
  const name = artifact.name || "documento";
  const errors: string[] = [];

  // 1) Path /media ya conocido (no requiere módulo config de Documents)
  if (artifact.href) {
    try {
      await downloadFromHref(artifact.href, name);
      return;
    } catch (err) {
      errors.push(errorMessage(err, "media"));
      // Último intento same-origin sin fetch
      try {
        triggerAnchorDownload(artifact.href, name);
        return;
      } catch {
        /* continue */
      }
    }
  }

  // 2) Metadatos vía API Documents (puede fallar sin permiso "config")
  if (artifact.documentId) {
    try {
      const resolved = await resolveDocumentFileUrl(artifact.documentId);
      const finalName = ensureExtension(
        basename(resolved.name || name),
        resolved.mime || artifact.mime,
      );
      await downloadFromHref(resolved.href, finalName);
      return;
    } catch (err) {
      errors.push(errorMessage(err, "documents"));
    }
  }

  throw new Error(errors.filter(Boolean).join(" · ") || "No se pudo descargar el archivo");
}

/** Resuelve URL de media/API para preview o descarga. */
export async function resolveArtifactHref(artifact: ResultArtifact): Promise<string> {
  if (artifact.href) return resolveUrl(artifact.href);
  if (artifact.kind === "text" && artifact.content != null) {
    const blob = new Blob([artifact.content], { type: `${artifact.mime};charset=utf-8` });
    return URL.createObjectURL(blob);
  }
  if (artifact.documentId) {
    const doc = await GET<DocumentDetail>(ENDPOINTS.documents.detail(artifact.documentId));
    const fileUrl =
      asString(doc.file_url) ||
      mediaUrlFromStoragePath(asString(doc.file_name)) ||
      mediaUrlFromStoragePath(asString((doc as DocumentDetail & { file?: string }).file));
    if (!fileUrl) throw new Error("Documento sin archivo");
    return resolveUrl(fileUrl);
  }
  throw new Error("Sin enlace de archivo");
}

export function artifactPreviewKind(
  artifact: ResultArtifact,
): "pdf" | "image" | "text" | "office" | "other" {
  const kind = humanFileKind(artifact.name, artifact.mime).toLowerCase();
  if (kind === "pdf" || artifact.mime.includes("pdf")) return "pdf";
  if (kind === "imagen" || artifact.mime.startsWith("image/")) return "image";
  if (
    kind === "csv" ||
    kind === "texto" ||
    kind === "markdown" ||
    kind === "json" ||
    kind === "html" ||
    artifact.mime.startsWith("text/") ||
    artifact.kind === "text"
  ) {
    return "text";
  }
  if (
    kind === "excel" ||
    artifact.mime.includes("spreadsheet") ||
    artifact.mime.includes("excel")
  ) {
    return "office";
  }
  return "other";
}

export async function downloadArtifact(artifact: ResultArtifact) {
  if (artifact.kind === "text" && artifact.content != null) {
    downloadTextFile(artifact.name, artifact.content, artifact.mime);
    return;
  }

  if (artifact.kind === "document" || artifact.documentId) {
    await downloadDocumentArtifact(artifact);
    return;
  }

  if (!artifact.href) throw new Error("Sin enlace");

  if (artifact.href.startsWith("data:")) {
    triggerAnchorDownload(artifact.href, artifact.name);
    return;
  }

  try {
    await downloadFromHref(artifact.href, artifact.name);
  } catch (err) {
    throw new Error(errorMessage(err, "No se pudo descargar el archivo"));
  }
}
