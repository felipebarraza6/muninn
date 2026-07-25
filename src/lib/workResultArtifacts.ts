/**
 * Extrae artefactos descargables desde `WorkItem.result` (URLs, base64, CSV, etc.).
 */

export type ResultArtifact = {
  id: string;
  name: string;
  kind: "url" | "base64" | "text";
  /** URL remota o data: */
  href?: string;
  /** Contenido de texto para blob local */
  content?: string;
  mime: string;
  sizeHint?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function guessMime(name: string, explicit?: string): string {
  if (explicit && explicit.includes("/")) return explicit;
  const lower = name.toLowerCase();
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "text/markdown";
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".xlsx"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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

function pushUnique(list: ResultArtifact[], item: ResultArtifact) {
  if (list.some((x) => x.id === item.id || (x.name === item.name && x.href === item.href))) return;
  list.push(item);
}

function artifactFromObject(obj: Record<string, unknown>, index: number): ResultArtifact | null {
  const name =
    asString(obj.name) ||
    asString(obj.filename) ||
    asString(obj.file_name) ||
    asString(obj.title) ||
    `archivo-${index + 1}`;
  const mime = guessMime(
    name,
    asString(obj.mime) || asString(obj.content_type) || asString(obj.mimetype),
  );
  const url =
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
      href: url,
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
  const content = asString(obj.content) || asString(obj.text) || asString(obj.body);
  if (content && content.length > 20) {
    return {
      id: `text-${index}-${name}`,
      name,
      kind: "text",
      content,
      mime: guessMime(name, mime),
      sizeHint: `${Math.round(content.length / 1024)} KB`,
    };
  }
  return null;
}

/** Escanea result del ítem y el texto principal. */
export function extractResultArtifacts(
  rawResult: unknown,
  replyText = "",
): ResultArtifact[] {
  const out: ResultArtifact[] = [];

  if (isRecord(rawResult)) {
    const nestedKeys = [
      "files",
      "attachments",
      "artifacts",
      "downloads",
      "outputs",
      "documents",
    ] as const;
    for (const key of nestedKeys) {
      const arr = rawResult[key];
      if (!Array.isArray(arr)) continue;
      arr.forEach((item, i) => {
        if (isRecord(item)) {
          const art = artifactFromObject(item, i);
          if (art) pushUnique(out, art);
        } else if (typeof item === "string" && /^https?:\/\//i.test(item)) {
          const name = item.split("/").pop()?.split("?")[0] || `archivo-${i + 1}`;
          pushUnique(out, {
            id: `url-str-${i}`,
            name,
            kind: "url",
            href: item,
            mime: guessMime(name),
          });
        }
      });
    }

    // Campos sueltos de un solo archivo
    const single = artifactFromObject(rawResult, 0);
    if (single && (single.kind === "url" || single.kind === "base64")) {
      pushUnique(out, { ...single, id: `single-${single.id}` });
    } else {
      const url =
        asString(rawResult.file_url) ||
        asString(rawResult.download_url) ||
        asString(rawResult.export_url);
      if (url) {
        const name =
          asString(rawResult.filename) ||
          asString(rawResult.file_name) ||
          url.split("/").pop()?.split("?")[0] ||
          "archivo";
        pushUnique(out, {
          id: "top-url",
          name,
          kind: "url",
          href: url,
          mime: guessMime(name, asString(rawResult.mime) || asString(rawResult.content_type)),
        });
      }
    }
  }

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

export async function downloadArtifact(artifact: ResultArtifact) {
  if (artifact.kind === "text" && artifact.content != null) {
    downloadTextFile(artifact.name, artifact.content, artifact.mime);
    return;
  }
  if (!artifact.href) throw new Error("Sin enlace");

  // data: o URL absoluta/relativa
  if (artifact.href.startsWith("data:")) {
    const a = document.createElement("a");
    a.href = artifact.href;
    a.download = artifact.name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  // Intentar fetch → blob (mismos origen / CORS); si falla, abrir en pestaña.
  try {
    const res = await fetch(artifact.href, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(artifact.href, "_blank", "noopener,noreferrer");
  }
}
