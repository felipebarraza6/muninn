import type {
  FunctionExecutionLog,
  ImplementationType,
  JsonSchema,
  JsonSchemaProperty,
} from "@/api/hooks/useAgentFunctions";

export const IMPLEMENTATION_TYPE_LABEL: Record<ImplementationType, string> = {
  api: "Aplicación (API)",
  formula: "Fórmula",
  db_query: "Consulta DB",
  python_code: "Python",
  webhook: "Webhook",
};

export const IMPLEMENTATION_TYPE_HINT: Record<ImplementationType, string> = {
  api: "Llama un endpoint de una Aplicación instalada. Ideal para Dentidesk, SmartHydro, etc.",
  formula:
    "Cálculo seguro con una expresión (ej. flow_l_s * hours * 3.6). Los parámetros son variables.",
  db_query: "Consulta modelos internos del ERP (whitelist).",
  python_code: "Función Python pre-registrada en el backend.",
  webhook: "Envía un HTTP saliente a una URL externa.",
};

export const PARAMETER_SOURCE_LABEL: Record<"free" | "static" | "data_document", string> = {
  free: "Libre (la entrega el LLM/usuario)",
  static: "Estático",
  data_document: "Documento de conocimiento (RAG)",
};

export const PARAMETER_SOURCE_HINT: Record<"free" | "static" | "data_document", string> = {
  free: "El agente o la prueba manual envían este valor. No se resuelve en el servidor.",
  static: "Siempre usa el valor fijo configurado; el LLM no lo elige.",
  data_document: "Busca en un documento DATA de la sucursal (ej. nombre → ID) antes de ejecutar.",
};

/** Sugiere columna de valor (ID) a partir de columnas detectadas en un doc DATA. */
export function guessValueColumn(columns: string[]): string {
  if (!columns.length) return "";
  const lower = columns.map((c) => ({ c, l: c.toLowerCase() }));
  const byId = lower.find(
    ({ l }) => l === "id" || l.endsWith("_id") || l.includes("id_") || l.endsWith("id"),
  );
  if (byId) return byId.c;
  return columns[0] ?? "";
}

/** Sugiere columna de búsqueda (nombre) a partir de columnas detectadas. */
export function guessSearchColumn(columns: string[], valueColumn?: string): string {
  if (!columns.length) return "";
  const prefer = [
    "nombre",
    "name",
    "titulo",
    "title",
    "motivo",
    "especialista",
    "doctor",
    "descripcion",
    "description",
  ];
  const lower = columns.map((c) => ({ c, l: c.toLowerCase() }));
  for (const p of prefer) {
    const hit = lower.find(({ l }) => l === p || l.includes(p));
    if (hit && hit.c !== valueColumn) return hit.c;
  }
  const other = columns.find((c) => c !== valueColumn);
  return other ?? columns[0] ?? "";
}

export const LOG_SOURCE_LABEL: Record<string, string> = {
  agent_chat: "Chat agente",
  channel: "Canal",
  webhook: "Webhook",
  workflow: "Workflow",
  manual_test: "Prueba manual",
  unknown: "Desconocido",
};

/** Genera un slug URL-safe a partir del nombre. */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/** Extrae placeholders {{key}} de un valor anidado. */
export function extractPlaceholders(value: unknown): string[] {
  const keys = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      for (const m of v.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)) {
        if (m[1] && m[1] !== "auth_token") keys.add(m[1]);
      }
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (v && typeof v === "object") {
      Object.values(v as Record<string, unknown>).forEach(walk);
    }
  };
  walk(value);
  return [...keys].sort();
}

/** Defaults vacíos para un formulario de prueba según parameters_schema. */
export function defaultsFromSchema(schema?: JsonSchema | null): Record<string, string> {
  const out: Record<string, string> = {};
  const props = schema?.properties ?? {};
  for (const key of Object.keys(props)) {
    out[key] = "";
  }
  return out;
}

export function schemaPropertyEntries(
  schema?: JsonSchema | null,
): Array<[string, JsonSchemaProperty]> {
  const props = schema?.properties ?? {};
  return Object.entries(props);
}

export function isRequiredParam(schema: JsonSchema | null | undefined, key: string): boolean {
  return Array.isArray(schema?.required) && schema!.required!.includes(key);
}

/** Convierte valores de form (string) a tipos del schema antes de enviar. */
export function coerceParamsFromForm(
  values: Record<string, string>,
  schema?: JsonSchema | null,
): Record<string, unknown> {
  const props = schema?.properties ?? {};
  const out: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(values)) {
    const trimmed = raw?.trim() ?? "";
    if (trimmed === "") continue;
    const prop = props[key];
    const t = prop?.type;
    if (t === "integer") {
      const n = Number(trimmed);
      out[key] = Number.isFinite(n) ? Math.trunc(n) : trimmed;
    } else if (t === "number") {
      const n = Number(trimmed);
      out[key] = Number.isFinite(n) ? n : trimmed;
    } else if (t === "boolean") {
      out[key] = ["true", "1", "yes", "si", "sí"].includes(trimmed.toLowerCase());
    } else {
      out[key] = trimmed;
    }
  }
  return out;
}

export function formatLogSource(source?: string | null): string {
  if (!source) return "—";
  return LOG_SOURCE_LABEL[source] ?? source;
}

export function formatLogLatency(ms?: number | null): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function formatLogWhen(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export function summarizeLogError(log: FunctionExecutionLog, max = 120): string {
  const err = (log.error || "").trim();
  if (!err) return "";
  return err.length > max ? `${err.slice(0, max)}…` : err;
}

export function prettyJson(value: unknown, fallback = "{}"): string {
  if (value == null) return fallback;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

export function parseJsonObject(
  raw: string,
  label = "JSON",
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: `${label} debe ser un objeto { … }` };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, error: `${label} inválido` };
  }
}
