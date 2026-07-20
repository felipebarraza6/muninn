import type { KnowledgeType } from "@/api/hooks/useKnowledge";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Code2,
  Database,
  FileCode2,
  FileText,
  FunctionSquare,
  ListOrdered,
  MessageCircleQuestion,
  Scale,
  Sparkles,
} from "lucide-react";

export const KNOWLEDGE_TYPE_LABEL: Record<KnowledgeType, string> = {
  DOCUMENT: "Documento",
  FAQ: "Preguntas frecuentes",
  DATA: "Tabla de datos",
  FUNCTION: "Función",
  PROCEDURE: "Procedimiento",
  POLICY: "Política",
  API_DOC: "Doc. de API",
  CODE: "Código",
  CUSTOM: "Personalizado",
};

export const KNOWLEDGE_TYPE_ICON: Record<KnowledgeType, LucideIcon> = {
  DOCUMENT: FileText,
  FAQ: MessageCircleQuestion,
  DATA: Database,
  FUNCTION: FunctionSquare,
  PROCEDURE: ListOrdered,
  POLICY: Scale,
  API_DOC: FileCode2,
  CODE: Code2,
  CUSTOM: Sparkles,
};

/** Acento visual por tipo (borde, chip e icono). */
export const KNOWLEDGE_TYPE_STYLE: Record<
  KnowledgeType,
  { icon: string; soft: string; border: string; chip: string }
> = {
  DOCUMENT: {
    icon: "text-sky-400",
    soft: "bg-sky-500/10",
    border: "border-sky-500/25 hover:border-sky-500/45",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/25",
  },
  FAQ: {
    icon: "text-amber-400",
    soft: "bg-amber-500/10",
    border: "border-amber-500/25 hover:border-amber-500/45",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  },
  DATA: {
    icon: "text-primary",
    soft: "bg-primary/10",
    border: "border-primary/30 hover:border-primary/50",
    chip: "bg-primary/15 text-primary border-primary/30",
  },
  FUNCTION: {
    icon: "text-violet-400",
    soft: "bg-violet-500/10",
    border: "border-violet-500/25 hover:border-violet-500/45",
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  },
  PROCEDURE: {
    icon: "text-orange-400",
    soft: "bg-orange-500/10",
    border: "border-orange-500/25 hover:border-orange-500/45",
    chip: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  },
  POLICY: {
    icon: "text-rose-400",
    soft: "bg-rose-500/10",
    border: "border-rose-500/25 hover:border-rose-500/45",
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  },
  API_DOC: {
    icon: "text-cyan-400",
    soft: "bg-cyan-500/10",
    border: "border-cyan-500/25 hover:border-cyan-500/45",
    chip: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  },
  CODE: {
    icon: "text-emerald-400",
    soft: "bg-emerald-500/10",
    border: "border-emerald-500/25 hover:border-emerald-500/45",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  },
  CUSTOM: {
    icon: "text-fuchsia-400",
    soft: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/25 hover:border-fuchsia-500/45",
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  },
};

export const KNOWLEDGE_TYPE_DESCRIPTION: Record<KnowledgeType, string> = {
  DOCUMENT: "Texto libre: manuales, fichas de producto, guías. Se indexa completo para el RAG.",
  FAQ: "Pares pregunta/respuesta. Ideal para dudas recurrentes de clientes.",
  DATA: "Tablas (productos, precios, catálogos). Cárgalas desde Datos (pegar o subir archivo).",
  FUNCTION: "Instrucciones de cuándo usar una función del agente.",
  PROCEDURE: "Pasos ordenados: cómo hacer un proceso interno o de atención.",
  POLICY: "Normas, garantías, términos y condiciones.",
  API_DOC: "Referencia de endpoints o contratos de integración.",
  CODE: "Fragmentos de código o snippets técnicos.",
  CUSTOM: "Contenido libre cuando no encaja en los otros tipos.",
};

export const KNOWLEDGE_TYPE_PLACEHOLDER: Partial<Record<KnowledgeType, string>> = {
  DOCUMENT: "Escribe o pega el contenido del documento…",
  POLICY: "Describe la política (alcance, excepciones, vigencia)…",
  PROCEDURE: "Paso 1: …\nPaso 2: …",
  API_DOC: "Describe endpoints, parámetros y ejemplos de respuesta…",
  CUSTOM: "Contenido libre…",
  FAQ: "",
};

/** Tipos disponibles en el modal «Nuevo» (sin DATA: va por Excel/CSV). */
export const CREATE_KNOWLEDGE_TYPES: KnowledgeType[] = [
  "DOCUMENT",
  "FAQ",
  "POLICY",
  "PROCEDURE",
  "API_DOC",
  "CUSTOM",
];

export function knowledgeTypeLabel(type: KnowledgeType | string | undefined): string {
  if (!type) return "Sin tipo";
  return KNOWLEDGE_TYPE_LABEL[type as KnowledgeType] ?? String(type);
}

export function knowledgeTypeMeta(type: KnowledgeType | string | undefined) {
  const key = (type as KnowledgeType) || "CUSTOM";
  return {
    label: KNOWLEDGE_TYPE_LABEL[key] ?? String(type ?? "Sin tipo"),
    Icon: KNOWLEDGE_TYPE_ICON[key] ?? BookOpen,
    style: KNOWLEDGE_TYPE_STYLE[key] ?? KNOWLEDGE_TYPE_STYLE.CUSTOM,
  };
}

/** Serializa pares FAQ al formato que entiende el viewer (P:/R: separados por ---). */
export function serializeFaqPairs(pairs: { question: string; answer: string }[]): string {
  return pairs
    .filter((p) => p.question.trim() || p.answer.trim())
    .map((p) => `P: ${p.question.trim()}\nR: ${p.answer.trim()}`)
    .join("\n---\n");
}

export function parseFaqPairs(content?: string): { question: string; answer: string }[] {
  if (!content?.trim()) return [{ question: "", answer: "" }];

  const blocks = content
    .split(/^\s*---\s*$/gm)
    .map((b) => b.trim())
    .filter(Boolean);
  const pairs: { question: string; answer: string }[] = [];

  const parseBlock = (block: string) => {
    const lines = block.split(/\r?\n/);
    let question = "";
    let answerLines: string[] = [];
    let phase: "none" | "question" | "answer" = "none";

    const flush = () => {
      const q = question.trim();
      const a = answerLines.join("\n").trim();
      if (q || a) pairs.push({ question: q, answer: a });
      question = "";
      answerLines = [];
      phase = "none";
    };

    for (const line of lines) {
      const pMatch = line.match(/^P:\s*(.*)$/i);
      const rMatch = line.match(/^R:\s*(.*)$/i);

      if (pMatch) {
        if (phase === "answer") flush();
        else if (phase === "question" && question.trim()) flush();
        question = pMatch[1];
        phase = "question";
        continue;
      }
      if (rMatch) {
        phase = "answer";
        answerLines = [rMatch[1]];
        continue;
      }
      if (phase === "answer") answerLines.push(line);
      else if (phase === "question") question += (question ? "\n" : "") + line;
    }

    if (phase !== "none") flush();
  };

  if (blocks.length === 0) parseBlock(content.trim());
  else blocks.forEach(parseBlock);

  if (pairs.length === 0 && content.trim()) {
    return [{ question: "", answer: content.trim() }];
  }

  return pairs.length > 0 ? pairs : [{ question: "", answer: "" }];
}

/** Texto corto para cards del catálogo (sin JSON crudo en DATA). */
export function knowledgeCardPreview(doc: {
  knowledge_type: KnowledgeType;
  summary?: string | null;
  content?: string | null;
  columns?: string[] | null;
}): string {
  if (doc.summary?.trim()) return doc.summary.trim();

  if (doc.knowledge_type === "DATA") {
    const columns =
      Array.isArray(doc.columns) && doc.columns.length > 0
        ? doc.columns.map(String)
        : (() => {
            try {
              let parsed = JSON.parse((doc.content || "").trim() || "[]");
              if (!Array.isArray(parsed)) parsed = [parsed];
              const first = parsed.find((row: unknown) => row && typeof row === "object") as
                | Record<string, unknown>
                | undefined;
              return first ? Object.keys(first) : [];
            } catch {
              return [];
            }
          })();

    let rowCount = 0;
    try {
      let parsed = JSON.parse((doc.content || "").trim() || "[]");
      if (!Array.isArray(parsed)) parsed = [parsed];
      rowCount = parsed.filter((row: unknown) => row && typeof row === "object").length;
    } catch {
      rowCount = 0;
    }

    const colsLabel =
      columns.length > 0
        ? columns.slice(0, 4).join(", ") + (columns.length > 4 ? "…" : "")
        : "sin columnas";
    const rowsLabel = rowCount === 1 ? "1 fila" : `${rowCount || 0} filas`;
    return `${rowsLabel} · ${colsLabel}`;
  }

  if (doc.knowledge_type === "FAQ") {
    const pairs = parseFaqPairs(doc.content || undefined).filter(
      (p) => p.question.trim() || p.answer.trim(),
    );
    if (pairs.length === 0) return "Sin preguntas aún";
    const first = pairs[0].question.trim() || pairs[0].answer.trim();
    const more =
      pairs.length > 1 ? ` · +${pairs.length - 1} pregunta${pairs.length === 2 ? "" : "s"}` : "";
    return (first.slice(0, 100) + (first.length > 100 ? "…" : "") + more).trim();
  }

  const text = (doc.content || "").replace(/\s+/g, " ").trim();
  if (!text) return "Sin resumen";
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}
