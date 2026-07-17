import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  FileText,
  Eye,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Boxes,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useKnowledge,
  useKnowledgeChunks,
  useUpdateKnowledge,
  useReindexKnowledge,
  isKnowledgeIndexed,
  type KnowledgeType,
  type AgentKnowledge,
  type KnowledgeChunk,
} from "@/api/hooks/useKnowledge";
import { KNOWLEDGE_TYPE_LABEL, parseFaqPairs, serializeFaqPairs } from "@/lib/knowledge-types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KnowledgeContentViewerProps {
  knowledgeId: string;
  title: string;
  knowledgeType: KnowledgeType;
}

interface QAPair {
  question: string;
  answer: string;
}

type GridRow = Record<string, string>;

function parseQAContent(content?: string): QAPair[] {
  return parseFaqPairs(content).filter((p) => p.question || p.answer);
}

function parseDataContent(content?: string): Record<string, unknown>[] {
  if (!content) return [];
  try {
    let parsed = JSON.parse(content.trim() || "[]");
    if (!Array.isArray(parsed)) parsed = [parsed];
    return parsed.filter(
      (row: unknown): row is Record<string, unknown> => Boolean(row) && typeof row === "object",
    );
  } catch {
    return [];
  }
}

function collectHeaders(rows: Record<string, unknown>[]): string[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  const seen = new Set(headers);
  for (let i = 1; i < rows.length; i++) {
    for (const key of Object.keys(rows[i])) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  return headers;
}

function rowsToGrid(raw: Record<string, unknown>[]): { columns: string[]; rows: GridRow[] } {
  const columns = collectHeaders(raw);
  const rows = raw.map((r) => {
    const row: GridRow = {};
    for (const c of columns) row[c] = r[c] == null ? "" : String(r[c]);
    return row;
  });
  return { columns, rows };
}

interface FunctionContent {
  function_id?: string;
  function_slug?: string;
  slug?: string;
  function_name?: string;
  name?: string;
  when_to_use?: string;
  examples?: string[];
}

function parseFunctionContent(content?: string): FunctionContent | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as FunctionContent;
  } catch {
    return null;
  }
}

function ParagraphViewer({ content }: { content?: string }) {
  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
      {content || "Sin contenido."}
    </div>
  );
}

function FAQViewer({ content }: { content?: string }) {
  const pairs = parseQAContent(content);

  if (pairs.length === 0) {
    return <ParagraphViewer content={content} />;
  }

  return (
    <div className="space-y-6">
      {pairs.map((pair, idx) => (
        <div key={idx} className="space-y-2">
          <div className="font-medium text-sm text-foreground">{pair.question}</div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pl-3 border-l-2 border-primary/30">
            {pair.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

function DataViewer({ content }: { content?: string }) {
  const rows = useMemo(() => parseDataContent(content), [content]);
  const headers = useMemo(() => collectHeaders(rows), [rows]);

  if (rows.length === 0) {
    return <ParagraphViewer content={content} />;
  }

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      <p className="shrink-0 text-[11px] text-muted-foreground px-1">
        {rows.length} fila{rows.length === 1 ? "" : "s"} · {headers.length} columna
        {headers.length === 1 ? "" : "s"} · desplázate en cualquier dirección
      </p>
      <div className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner">
        <table className="border-collapse text-xs w-max min-w-full">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-10 min-w-10 bg-muted border-b border-r border-border px-1 py-1.5 font-medium text-muted-foreground text-center">
                #
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="bg-muted border-b border-r border-border px-3 py-1.5 text-left font-semibold whitespace-nowrap min-w-[120px] max-w-[280px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="sticky left-0 z-10 w-10 min-w-10 bg-muted/80 border-b border-r border-border px-1 py-1.5 text-center text-[10px] text-muted-foreground tabular-nums">
                  {idx + 1}
                </td>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="border-b border-r border-border px-3 py-1.5 whitespace-nowrap max-w-[280px] truncate"
                    title={String(row[header] ?? "")}
                  >
                    {row[header] == null || row[header] === "" ? "—" : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FunctionViewer({ content }: { content?: string }) {
  const data = parseFunctionContent(content);

  if (!data) {
    return <ParagraphViewer content={content} />;
  }

  const name = data.function_name || data.name || "Función";
  const slug = data.function_slug || data.slug || "—";
  const examples = (data.examples || []).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">{slug}</div>
      </div>
      {data.when_to_use && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Cuándo usar
          </div>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{data.when_to_use}</div>
        </div>
      )}
      {examples.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ejemplos de activación
          </div>
          <ul className="space-y-1.5">
            {examples.map((example, idx) => (
              <li key={idx} className="text-sm pl-3 border-l-2 border-primary/30">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmbeddingSparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  const max = Math.max(...values.map((v) => Math.abs(v)), 0.0001);
  return (
    <div className="flex items-end gap-px h-8 w-full max-w-md">
      {values.map((v, i) => {
        const h = Math.max(4, Math.round((Math.abs(v) / max) * 100));
        return (
          <span
            key={i}
            title={String(v)}
            className={cn(
              "flex-1 min-w-[2px] rounded-sm",
              v >= 0 ? "bg-primary/70" : "bg-amber-400/70",
            )}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

function ChunkCard({ chunk, total }: { chunk: KnowledgeChunk; total: number }) {
  return (
    <article className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-primary/15 px-1.5 text-[11px] font-semibold text-primary tabular-nums">
          #{chunk.order + 1}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Fragmento {chunk.order + 1} de {total}
        </span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          · {chunk.char_count} caracteres
        </span>
        <div className="ml-auto">
          {chunk.has_embedding ? (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500"
            >
              <Sparkles className="h-3 w-3" />
              Vector {chunk.dimensions}d
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Sin embedding
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-3 p-3 lg:grid-cols-2">
        <div className="space-y-1.5 min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Texto del fragmento
          </div>
          <div className="rounded-md border border-border/60 bg-background/70 p-2.5 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90 max-h-48 overflow-auto">
            {chunk.content || "—"}
          </div>
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Embedding generado
          </div>
          {chunk.has_embedding ? (
            <div className="rounded-md border border-border/60 bg-background/70 p-2.5 space-y-2.5">
              <p className="text-[11px] text-muted-foreground leading-snug">
                Este texto se pasó por el modelo de embeddings y quedó como un vector de{" "}
                <span className="text-foreground/80 tabular-nums font-medium">
                  {chunk.dimensions}
                </span>{" "}
                números. Así el agente puede comparar semánticamente tu pregunta con este fragmento.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                <span>
                  Dimensiones:{" "}
                  <span className="text-foreground/80 tabular-nums">{chunk.dimensions}</span>
                </span>
                {chunk.norm != null && (
                  <span>
                    Norma (magnitud):{" "}
                    <span className="text-foreground/80 tabular-nums">{chunk.norm}</span>
                  </span>
                )}
              </div>
              {chunk.preview.length > 0 && (
                <>
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground">
                      Vista del vector (primeros {chunk.preview.length} valores)
                    </div>
                    <EmbeddingSparkline values={chunk.preview} />
                  </div>
                  <div className="font-mono text-[10px] leading-relaxed text-muted-foreground break-all">
                    [{chunk.preview.join(", ")}
                    {chunk.dimensions > chunk.preview.length ? ", …" : ""}]
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-2.5 text-[11px] text-muted-foreground leading-snug">
              Este fragmento se creó, pero no tiene embedding. Puede faltar un proveedor de
              embeddings o falló la generación. Reindexa el documento.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function VectorsPanel({
  knowledgeId,
  enabled,
  indexed,
}: {
  knowledgeId: string;
  enabled: boolean;
  indexed: boolean;
}) {
  const { data, isLoading } = useKnowledgeChunks(knowledgeId, enabled && indexed);

  const chunks = data?.chunks ?? [];
  const count = data?.count ?? 0;
  const dimensions = data?.dimensions ?? 0;
  const withEmbedding = chunks.filter((c) => c.has_embedding).length;

  if (!indexed) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground px-4">
        <Boxes className="h-8 w-8 opacity-40" />
        <p className="text-sm">Este documento aún no está indexado.</p>
        <p className="text-xs max-w-sm">
          Indexalo desde Conocimiento para generar fragments y embeddings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando vectores…</span>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground px-4">
        <Boxes className="h-8 w-8 opacity-40" />
        <p className="text-sm">No hay fragmentos generados.</p>
        <p className="text-xs max-w-sm">Prueba reindexar el documento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Cómo se generaron estos vectores</p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Al indexar, el sistema cortó el documento en fragmentos (~512 tokens con solape) y
              convirtió cada uno en un embedding. Abajo ves <strong>todos</strong> los fragments
              creados y el vector asociado a cada uno.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              1. Dividir
            </div>
            <div className="text-xs font-medium mt-0.5">
              {count} fragmento{count === 1 ? "" : "s"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              El texto largo se parte en trozos manejables.
            </p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              2. Embeddings
            </div>
            <div className="text-xs font-medium mt-0.5">
              {withEmbedding}/{count} con vector
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              Cada trozo se transforma en números.
            </p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              3. Dimensiones
            </div>
            <div className="text-xs font-medium mt-0.5 tabular-nums">{dimensions || "—"}d</div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              Tamaño de cada vector (p. ej. 1536).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-foreground/90 px-0.5">
          Todos los vectores generados
        </h4>
        <p className="text-[11px] text-muted-foreground px-0.5 leading-snug">
          Izquierda: el texto que quedó en el índice. Derecha: cómo quedó convertido a vector.
        </p>
      </div>

      <div className="space-y-2.5">
        {chunks.map((chunk) => (
          <ChunkCard key={chunk.id} chunk={chunk} total={count} />
        ))}
      </div>
    </div>
  );
}

function ContentRenderer({ doc }: { doc: AgentKnowledge }) {
  switch (doc.knowledge_type) {
    case "FAQ":
      return <FAQViewer content={doc.content} />;
    case "DATA":
      return <DataViewer content={doc.content} />;
    case "FUNCTION":
      return <FunctionViewer content={doc.content} />;
    default:
      return <ParagraphViewer content={doc.content} />;
  }
}

/** Editor de tabla DATA (celdas + columnas renombrables + filas). */
function DataEditor({
  columns,
  rows,
  onColumnsChange,
  onRowsChange,
}: {
  columns: string[];
  rows: GridRow[];
  onColumnsChange: (cols: string[]) => void;
  onRowsChange: (rows: GridRow[]) => void;
}) {
  const renameColumn = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    let final = trimmed;
    if (columns.includes(final) && final !== oldName) {
      let i = 2;
      while (columns.includes(`${trimmed}_${i}`)) i += 1;
      final = `${trimmed}_${i}`;
    }
    onColumnsChange(columns.map((c) => (c === oldName ? final : c)));
    onRowsChange(
      rows.map((row) => {
        const next = { ...row };
        next[final] = next[oldName] ?? "";
        delete next[oldName];
        return next;
      }),
    );
  };

  const addColumn = () => {
    let name = "nueva_columna";
    let i = 2;
    while (columns.includes(name)) {
      name = `nueva_columna_${i}`;
      i += 1;
    }
    onColumnsChange([...columns, name]);
    onRowsChange(rows.map((r) => ({ ...r, [name]: "" })));
  };

  const removeColumn = (name: string) => {
    if (columns.length <= 1) {
      toast.error("Debe quedar al menos una columna");
      return;
    }
    onColumnsChange(columns.filter((c) => c !== name));
    onRowsChange(
      rows.map((row) => {
        const next = { ...row };
        delete next[name];
        return next;
      }),
    );
  };

  const addRow = () => {
    const empty: GridRow = {};
    for (const c of columns) empty[c] = "";
    onRowsChange([...rows, empty]);
  };

  const removeRow = (idx: number) => {
    if (rows.length <= 1) {
      toast.error("Debe quedar al menos una fila");
      return;
    }
    onRowsChange(rows.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      <div className="shrink-0 flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Columna
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Fila
        </Button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner">
        <table className="border-collapse text-xs w-max min-w-full">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-10 min-w-10 bg-muted border-b border-r border-border" />
              {columns.map((col) => (
                <th
                  key={col}
                  className="bg-muted border-b border-r border-border p-1 min-w-[140px]"
                >
                  <div className="flex items-center gap-0.5">
                    <Input
                      defaultValue={col}
                      key={`edit-hdr-${col}`}
                      className="h-7 text-xs font-semibold border-0 bg-transparent shadow-none focus-visible:ring-1"
                      onBlur={(e) => renameColumn(col, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeColumn(col)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="bg-muted border-b border-border w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="sticky left-0 z-10 bg-muted/80 border-b border-r border-border text-center text-[10px] text-muted-foreground tabular-nums px-1">
                  {rIdx + 1}
                </td>
                {columns.map((col) => (
                  <td key={col} className="border-b border-r border-border p-0">
                    <input
                      value={row[col] ?? ""}
                      onChange={(e) => {
                        const next = rows.map((r, i) =>
                          i === rIdx ? { ...r, [col]: e.target.value } : r,
                        );
                        onRowsChange(next);
                      }}
                      className="w-full h-8 bg-transparent px-2 text-xs outline-none focus:bg-primary/5"
                    />
                  </td>
                ))}
                <td className="border-b border-border p-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(rIdx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaqEditor({ pairs, onChange }: { pairs: QAPair[]; onChange: (pairs: QAPair[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...pairs, { question: "", answer: "" }])}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Añadir par
        </Button>
      </div>
      {pairs.map((pair, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Par {idx + 1}</span>
            {pairs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onChange(pairs.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Pregunta</Label>
            <Input
              value={pair.question}
              onChange={(e) =>
                onChange(pairs.map((p, i) => (i === idx ? { ...p, question: e.target.value } : p)))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Respuesta</Label>
            <Textarea
              rows={3}
              value={pair.answer}
              onChange={(e) =>
                onChange(pairs.map((p, i) => (i === idx ? { ...p, answer: e.target.value } : p)))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeContentViewer({
  knowledgeId,
  title,
  knowledgeType,
}: KnowledgeContentViewerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [viewTab, setViewTab] = useState<"documento" | "vectores">("documento");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [faqPairs, setFaqPairs] = useState<QAPair[]>([{ question: "", answer: "" }]);
  const [dataColumns, setDataColumns] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<GridRow[]>([]);

  const { data: doc, isLoading, error, refetch } = useKnowledge(open ? knowledgeId : undefined);
  const update = useUpdateKnowledge();
  const reindex = useReindexKnowledge();

  const type = doc?.knowledge_type ?? knowledgeType;
  const isData = type === "DATA";
  const isFaq = type === "FAQ";
  const saving = update.isPending || reindex.isPending;
  const indexed = doc ? isKnowledgeIndexed(doc) : false;

  const loadEditStateFromDoc = useCallback(
    (current: AgentKnowledge) => {
      const docType = current.knowledge_type ?? knowledgeType;
      setEditTitle(current.title || "");
      setEditContent(current.content || "");
      if (docType === "FAQ") {
        setFaqPairs(parseFaqPairs(current.content));
      }
      if (docType === "DATA") {
        const grid = rowsToGrid(parseDataContent(current.content));
        setDataColumns(grid.columns.length ? grid.columns : ["columna_1"]);
        setDataRows(grid.rows.length ? grid.rows : [{ columna_1: "" }]);
      }
    },
    [knowledgeType],
  );

  useEffect(() => {
    if (!doc || editing) return;
    if ((doc.knowledge_type ?? knowledgeType) === "FAQ") {
      setFaqPairs(parseFaqPairs(doc.content));
    }
  }, [doc, editing, knowledgeType]);

  const startEdit = () => {
    if (!doc) return;
    loadEditStateFromDoc(doc);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const buildContent = (): string | null => {
    if (isFaq) {
      const body = serializeFaqPairs(faqPairs);
      if (!body.trim()) {
        toast.error("Agrega al menos una pregunta y respuesta");
        return null;
      }
      return body;
    }
    if (isData) {
      const clean = dataRows.filter((row) => dataColumns.some((c) => (row[c] ?? "").trim()));
      if (clean.length === 0) {
        toast.error("La tabla no tiene filas con datos");
        return null;
      }
      return JSON.stringify(
        clean.map((row) => {
          const obj: Record<string, string> = {};
          for (const c of dataColumns) obj[c] = row[c] ?? "";
          return obj;
        }),
      );
    }
    if (!editContent.trim()) {
      toast.error("El contenido es obligatorio");
      return null;
    }
    return editContent;
  };

  const handleSave = () => {
    if (!doc) return;
    if (!editTitle.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    const content = buildContent();
    if (content == null) return;

    update.mutate(
      {
        id: String(doc.id),
        data: { title: editTitle.trim(), content },
      },
      {
        onSuccess: () => {
          // Obligatorio reindexar tras editar para que el RAG use el contenido nuevo
          reindex.mutate(String(doc.id), {
            onSuccess: () => {
              toast.success("Guardado y reindexado");
              setEditing(false);
              void refetch();
            },
            onError: () => {
              toast.error("Guardado, pero falló el reindexado. Usa «Reindexar» en la lista.");
              setEditing(false);
              void refetch();
            },
          });
        },
        onError: () => toast.error("No se pudo guardar"),
      },
    );
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setEditing(false);
      setViewTab("documento");
      setFaqPairs([{ question: "", answer: "" }]);
      setEditTitle("");
      setEditContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 gap-0 rounded-lg flex flex-col overflow-hidden",
          isData || editing || !isLoading
            ? "w-[min(96vw,1400px)] max-w-[min(96vw,1400px)] h-[85vh] max-h-[85vh]"
            : "w-full max-w-3xl max-h-[85vh]",
        )}
      >
        <DialogHeader className="p-5 pb-3 shrink-0 border-b">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base truncate">
                  {editing ? "Editar conocimiento" : title}
                </DialogTitle>
                <Badge variant="outline" className="text-[10px]">
                  {KNOWLEDGE_TYPE_LABEL[type]}
                </Badge>
              </div>
              <DialogDescription>
                {editing
                  ? "Al guardar se reindexa automáticamente para actualizar el RAG."
                  : viewTab === "vectores"
                    ? "Fragmentos y embeddings generados al indexar."
                    : isData
                      ? "Tabla de datos · desplázate en horizontal y vertical."
                      : "Contenido con el que está entrenado el agente."}
              </DialogDescription>
            </div>
            {!isLoading && doc && !error && (
              <div className="flex items-center gap-1.5 shrink-0">
                {editing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={saving}
                      onClick={cancelEdit}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancelar
                    </Button>
                    <Button type="button" size="sm" disabled={saving} onClick={handleSave}>
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5 mr-1" />
                      )}
                      Guardar y reindexar
                    </Button>
                  </>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={startEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 flex-1">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cargando contenido...</span>
          </div>
        ) : error || !doc ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-destructive flex-1">
            <FileText className="h-8 w-8 opacity-50" />
            <span className="text-sm">No se pudo cargar el contenido.</span>
          </div>
        ) : editing ? (
          <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-hidden">
            <div className="shrink-0 space-y-1.5">
              <Label className="text-xs">Título</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            {isFaq ? (
              <ScrollArea className="flex-1 min-h-0">
                <FaqEditor pairs={faqPairs} onChange={setFaqPairs} />
              </ScrollArea>
            ) : isData ? (
              <DataEditor
                columns={dataColumns}
                rows={dataRows}
                onColumnsChange={setDataColumns}
                onRowsChange={setDataRows}
              />
            ) : (
              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                <Label className="text-xs">Contenido</Label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 min-h-[280px] font-mono text-sm resize-none"
                />
              </div>
            )}
          </div>
        ) : (
          <Tabs
            value={viewTab}
            onValueChange={(v) => setViewTab(v as "documento" | "vectores")}
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
          >
            <div className="shrink-0 px-4 pt-3">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="documento" className="gap-1.5 flex-1 sm:flex-none">
                  <FileText className="h-3.5 w-3.5" />
                  Documento
                </TabsTrigger>
                <TabsTrigger value="vectores" className="gap-1.5 flex-1 sm:flex-none">
                  <Boxes className="h-3.5 w-3.5" />
                  Vectores
                  {indexed && doc.chunks_count != null && doc.chunks_count > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-5 px-1.5 text-[10px] tabular-nums"
                    >
                      {doc.chunks_count}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="documento"
              className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden"
            >
              {isData ? (
                <div className="h-full flex flex-col p-4 pt-3">
                  <DataViewer content={doc.content} />
                </div>
              ) : (
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="pr-4 pt-3">
                    <ContentRenderer doc={doc} />
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent
              value="vectores"
              className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full px-4 pb-4">
                <div className="pt-3">
                  <VectorsPanel
                    knowledgeId={String(doc.id)}
                    enabled={open && viewTab === "vectores"}
                    indexed={indexed}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
