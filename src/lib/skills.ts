import type {
  FunctionExecutionLog,
  ImplementationType,
  JsonSchema,
  JsonSchemaProperty,
} from "@/api/hooks/useAgentFunctions";

export const IMPLEMENTATION_TYPE_LABEL: Record<ImplementationType, string> = {
  api: "API",
  formula: "Matemática",
  db_query: "Consulta DB",
  python_code: "Python",
  webhook: "Webhook",
};

/** Tipos ofrecidos al crear / filtrar skills en la UI. */
export const SKILL_CREATE_TYPES: ImplementationType[] = ["api", "formula", "python_code"];

export const IMPLEMENTATION_TYPE_HINT: Record<ImplementationType, string> = {
  api: "Skill multipropósito que llama a un endpoint de una Aplicación instalada.",
  formula:
    "Función matemática: definí variables de entrada, armá la expresión y obtené un resultado procesado.",
  db_query: "Consulta modelos internos del ERP (whitelist).",
  python_code:
    "Código Python a medida en un editor interactivo (snippet seguro o función registrada).",
  webhook: "Envía un HTTP saliente a una URL externa (usar en Canales).",
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

export const SKILL_SCOPE_LABEL: Record<string, string> = {
  global: "Global",
  branch: "Sucursal",
  agent: "Agente",
  /** Compat datos viejos */
  application: "Sucursal",
};

export const SKILL_SCOPE_HINT: Record<"global" | "branch" | "agent", string> = {
  global: "Disponible para asignar en todo el holding.",
  branch: "Solo para agentes de esta sucursal.",
  agent: "Se asigna automáticamente al agente que indiques.",
};

/** Normaliza scope legacy (application → branch). */
export function normalizeSkillScope(scope?: string | null): "global" | "branch" | "agent" {
  if (scope === "global" || scope === "agent") return scope;
  return "branch";
}

/** Tipos JSON Schema base usados en parámetros de skills. */
export type SchemaParamType = "string" | "number" | "integer" | "boolean";

/**
 * Kind de UI (más rico que type JSON Schema).
 * Fecha/Fecha-hora/Email se persisten como type:string + format (+ x_date_format).
 */
export type SchemaParamKind =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "datetime"
  | "email";

/** Formato de envío (wire) para fechas: se manda como string al API externo. */
export type DateWireFormat = "YYYY-MM-DD" | "DD/MM/YYYY" | "DD-MM-YYYY" | "MM/DD/YYYY";

export const DATE_WIRE_FORMATS: Array<{
  value: DateWireFormat;
  label: string;
  example: string;
}> = [
  { value: "YYYY-MM-DD", label: "ISO (YYYY-MM-DD)", example: "2026-07-18" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY", example: "18/07/2026" },
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY", example: "18-07-2026" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY", example: "07/18/2026" },
];

/** Labels humanos para kinds de parámetro (UI). */
export const SCHEMA_KIND_LABEL: Record<SchemaParamKind, string> = {
  number: "Decimal",
  integer: "Entero",
  string: "Texto",
  boolean: "Sí/No",
  date: "Fecha",
  datetime: "Fecha y hora",
  email: "Email",
};

/** Hints cortos por kind. */
export const SCHEMA_KIND_HINT: Record<SchemaParamKind, string> = {
  number: "Permite decimales (ej. 10.5)",
  integer: "Solo números enteros (ej. 3)",
  string: "Texto libre, nombres o códigos",
  boolean: "Verdadero o falso",
  date: "Fecha enviada como texto; elige el formato que pide la app (ej. Dentidesk)",
  datetime: "Fecha y hora en ISO 8601",
  email: "Correo electrónico válido",
};

/** Placeholders de ejemplo al probar / editar. */
export const SCHEMA_KIND_PLACEHOLDER: Record<SchemaParamKind, string> = {
  number: "ej. 10.5",
  integer: "ej. 3",
  string: "ej. texto",
  boolean: "true / false",
  date: "ej. 2026-07-18",
  datetime: "ej. 2026-07-18T14:30:00",
  email: "ej. user@mail.com",
};

/** @deprecated Usar SCHEMA_KIND_*; se mantiene por compat. */
export const JSON_SCHEMA_TYPE_LABEL: Record<SchemaParamType, string> = {
  number: SCHEMA_KIND_LABEL.number,
  integer: SCHEMA_KIND_LABEL.integer,
  string: SCHEMA_KIND_LABEL.string,
  boolean: SCHEMA_KIND_LABEL.boolean,
};

/** @deprecated Usar SCHEMA_KIND_HINT */
export const JSON_SCHEMA_TYPE_HINT: Record<SchemaParamType, string> = {
  number: SCHEMA_KIND_HINT.number,
  integer: SCHEMA_KIND_HINT.integer,
  string: SCHEMA_KIND_HINT.string,
  boolean: SCHEMA_KIND_HINT.boolean,
};

/** @deprecated Usar SCHEMA_KIND_PLACEHOLDER */
export const JSON_SCHEMA_TYPE_PLACEHOLDER: Record<SchemaParamType, string> = {
  number: SCHEMA_KIND_PLACEHOLDER.number,
  integer: SCHEMA_KIND_PLACEHOLDER.integer,
  string: SCHEMA_KIND_PLACEHOLDER.string,
  boolean: SCHEMA_KIND_PLACEHOLDER.boolean,
};

/** Operadores y funciones permitidas en skills fórmula (ayuda compacta). */
export const FORMULA_OPERATORS_HELP = "+  −  ×  ÷  **  ( )  ? :";
export const FORMULA_FUNCTIONS_HELP = "abs, round, min, max, len, int, float, sum";

/** Tokens insertables en el editor de expresión. */
export const FORMULA_OPERATOR_TOKENS = [
  { label: "+", insert: " + " },
  { label: "−", insert: " - " },
  { label: "×", insert: " * " },
  { label: "÷", insert: " / " },
  { label: "**", insert: "**" },
  { label: "( )", insert: "()", cursorOffset: 1 },
  { label: "? :", insert: " ? : ", cursorOffset: 3 },
] as const;

export const FORMULA_FUNCTION_TOKENS = [
  { label: "abs", insert: "abs()", cursorOffset: 4 },
  { label: "round", insert: "round()", cursorOffset: 6 },
  { label: "min", insert: "min()", cursorOffset: 4 },
  { label: "max", insert: "max()", cursorOffset: 4 },
  { label: "sum", insert: "sum()", cursorOffset: 4 },
  { label: "int", insert: "int()", cursorOffset: 4 },
  { label: "float", insert: "float()", cursorOffset: 6 },
  { label: "len", insert: "len()", cursorOffset: 4 },
] as const;

/** True si `varName` ya aparece como identificador en la expresión. */
export function formulaExpressionHasVar(expression: string, varName: string): boolean {
  const name = varName.trim();
  if (!name || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return false;
  const re = new RegExp(`(?:^|[^a-zA-Z0-9_])${name}(?:[^a-zA-Z0-9_]|$)`);
  return re.test(expression);
}

/** Reemplaza variables de la expresión por sus valores (solo para mostrar el proceso). */
export function substituteFormulaExpression(
  expression: string,
  params: Record<string, unknown>,
): string {
  const expr = expression.trim();
  if (!expr) return "";
  const keys = Object.keys(params)
    .filter((k) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k))
    .sort((a, b) => b.length - a.length);
  let out = expr;
  for (const key of keys) {
    const re = new RegExp(`(?<![A-Za-z0-9_])${key}(?![A-Za-z0-9_])`, "g");
    const val = params[key];
    let display: string;
    if (typeof val === "string") display = JSON.stringify(val);
    else if (val === null || val === undefined) display = "null";
    else display = String(val);
    out = out.replace(re, display);
  }
  return out;
}

/** Borrador de variable para skills fórmula (creación / workspace). */
export type FormulaParamDraft = {
  name: string;
  type: "number" | "integer" | "string";
  description: string;
  required: boolean;
};

export function normalizeFormulaVarName(raw: string): string {
  return raw.trim().replace(/\s+/g, "_");
}

export function getDuplicateFormulaVarIndexes(params: FormulaParamDraft[]): Set<number> {
  const counts = new Map<string, number[]>();
  params.forEach((p, idx) => {
    const n = normalizeFormulaVarName(p.name);
    if (!n) return;
    const key = n.toLowerCase();
    const list = counts.get(key) ?? [];
    list.push(idx);
    counts.set(key, list);
  });
  const dups = new Set<number>();
  for (const idxs of counts.values()) {
    if (idxs.length > 1) idxs.forEach((i) => dups.add(i));
  }
  return dups;
}

export function formulaVarNamesFromParams(params: FormulaParamDraft[]): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const p of params) {
    const n = normalizeFormulaVarName(p.name);
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n)) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(n);
  }
  return names;
}

export function buildFormulaSchemaFromParams(params: FormulaParamDraft[]): JsonSchema {
  const properties: Record<string, { type: string; description?: string }> = {};
  const required: string[] = [];
  for (const p of params) {
    const key = normalizeFormulaVarName(p.name);
    if (!key) continue;
    properties[key] = {
      type: p.type,
      ...(p.description.trim() ? { description: p.description.trim() } : {}),
    };
    if (p.required) required.push(key);
  }
  return { type: "object", properties, required };
}

/** Lee x_date_format / x-date-format del property. */
export function getDateWireFormat(prop?: JsonSchemaProperty | null): DateWireFormat {
  if (!prop) return "YYYY-MM-DD";
  const raw = (prop.x_date_format ?? prop["x-date-format"] ?? "YYYY-MM-DD") as string;
  if (
    raw === "DD/MM/YYYY" ||
    raw === "DD-MM-YYYY" ||
    raw === "MM/DD/YYYY" ||
    raw === "YYYY-MM-DD"
  ) {
    return raw;
  }
  return "YYYY-MM-DD";
}

/** Normaliza un type del schema a uno conocido. */
export function normalizeSchemaType(type?: string | null): SchemaParamType {
  if (type === "integer" || type === "number" || type === "boolean" || type === "string") {
    return type;
  }
  return "string";
}

/** Deriva el kind de UI desde un property JSON Schema. */
export function kindFromProperty(prop?: JsonSchemaProperty | null): SchemaParamKind {
  if (!prop) return "string";
  const t = normalizeSchemaType(prop.type);
  const f = prop.format;
  if (t === "string" && f === "date") return "date";
  if (t === "string" && f === "date-time") return "datetime";
  if (t === "string" && f === "email") return "email";
  return t;
}

/** Construye el property JSON Schema desde kind + opciones UI. */
export function propertyFromKind(opts: {
  kind: SchemaParamKind;
  description?: string;
  dateFormat?: DateWireFormat;
}): JsonSchemaProperty {
  const description = opts.description?.trim() || undefined;
  if (opts.kind === "date") {
    const wire = opts.dateFormat || "YYYY-MM-DD";
    return {
      type: "string",
      format: "date",
      x_date_format: wire,
      ...(description
        ? { description }
        : { description: `Fecha en formato ${wire} (se envía como texto).` }),
    };
  }
  if (opts.kind === "datetime") {
    return {
      type: "string",
      format: "date-time",
      ...(description
        ? { description }
        : { description: "Fecha y hora en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)." }),
    };
  }
  if (opts.kind === "email") {
    return {
      type: "string",
      format: "email",
      ...(description ? { description } : { description: "Dirección de correo electrónico." }),
    };
  }
  return {
    type: opts.kind,
    ...(description ? { description } : {}),
  };
}

/** Label amigable para un property (incluye formato de fecha wire). */
export function formatSchemaType(
  type?: string | null,
  format?: string | null,
  prop?: JsonSchemaProperty | null,
): string {
  const kind = prop
    ? kindFromProperty(prop)
    : format === "date"
      ? "date"
      : format === "date-time"
        ? "datetime"
        : format === "email"
          ? "email"
          : normalizeSchemaType(type);
  const base = SCHEMA_KIND_LABEL[kind];
  if (kind === "date") {
    const wire = prop ? getDateWireFormat(prop) : "YYYY-MM-DD";
    return `${base} · ${wire}`;
  }
  if (kind === "datetime") return `${base} · ISO`;
  if (kind === "email") return base;
  return format && kind === "string" ? `${base} · ${format}` : base;
}

/** Convierte YYYY-MM-DD (input HTML date) al formato wire elegido. */
export function isoDateToWire(iso: string, wire: DateWireFormat): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso.trim();
  const [, y, mo, d] = m;
  switch (wire) {
    case "DD/MM/YYYY":
      return `${d}/${mo}/${y}`;
    case "DD-MM-YYYY":
      return `${d}-${mo}-${y}`;
    case "MM/DD/YYYY":
      return `${mo}/${d}/${y}`;
    default:
      return `${y}-${mo}-${d}`;
  }
}

/** Intenta convertir un valor wire a YYYY-MM-DD para el date picker. */
export function wireDateToIso(value: string, wire: DateWireFormat): string {
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  let m: RegExpMatchArray | null = null;
  if (wire === "DD/MM/YYYY") m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  else if (wire === "DD-MM-YYYY") m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(v);
  else if (wire === "MM/DD/YYYY") m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return "";
  if (wire === "MM/DD/YYYY") {
    const [, mo, d, y] = m;
    return `${y}-${mo}-${d}`;
  }
  const [, d, mo, y] = m;
  return `${y}-${mo}-${d}`;
}

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
  // Alineado con backend: {{key}} y {key}
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}|\{([a-zA-Z0-9_]+)\}/g;
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      for (const m of v.matchAll(re)) {
        const key = m[1] || m[2];
        if (key && key !== "auth_token") keys.add(key);
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
    const kind = kindFromProperty(prop);
    if (kind === "integer") {
      const n = Number(trimmed);
      out[key] = Number.isFinite(n) ? Math.trunc(n) : trimmed;
    } else if (kind === "number") {
      const n = Number(trimmed);
      out[key] = Number.isFinite(n) ? n : trimmed;
    } else if (kind === "boolean") {
      out[key] = ["true", "1", "yes", "si", "sí"].includes(trimmed.toLowerCase());
    } else if (kind === "date" && prop) {
      // El date picker entrega YYYY-MM-DD; convertimos al formato wire (sigue siendo string).
      const wire = getDateWireFormat(prop);
      out[key] = wire === "YYYY-MM-DD" ? trimmed : isoDateToWire(trimmed, wire);
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

export { prettyJson } from "@/lib/json";

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
