import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardPaste,
  Columns3,
  Copy,
  FileSpreadsheet,
  Loader2,
  Plus,
  Rows3,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useParseSpreadsheet,
  useBulkCreateKnowledge,
  type SpreadsheetParseRow,
} from "@/api/hooks/useKnowledge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";

type GridRow = Record<string, string>;

type CtxTarget =
  | { kind: "cell"; r: number; c: number }
  | { kind: "header"; c: number }
  | { kind: "row"; r: number }
  | null;

const DEFAULT_COLUMNS = ["A", "B", "C", "D", "E"];
const DEFAULT_ROW_COUNT = 20;

function makeEmptyRows(cols: string[], count: number): GridRow[] {
  return Array.from({ length: count }, () => {
    const row: GridRow = {};
    for (const c of cols) row[c] = "";
    return row;
  });
}

function uniqueColumnName(base: string, existing: string[]): string {
  const trimmed = base.trim() || "columna";
  if (!existing.includes(trimmed)) return trimmed;
  let i = 2;
  while (existing.includes(`${trimmed}_${i}`)) i += 1;
  return `${trimmed}_${i}`;
}

function parseKeyValueContent(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!content?.trim()) return out;
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "Campos adicionales:") continue;
    const idx = trimmed.indexOf(":");
    if (idx > 0 && idx < 80) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key) out[key] = val;
    }
  }
  return out;
}

function rowsFromApi(records: SpreadsheetParseRow[]): { columns: string[]; rows: GridRow[] } {
  const colSet: string[] = [];
  const ensure = (name: string) => {
    if (!colSet.includes(name)) colSet.push(name);
  };

  const rows: GridRow[] = records.map((r) => {
    const row: GridRow = {};
    if (r.title) {
      ensure("título");
      row["título"] = r.title;
    }
    const kv = parseKeyValueContent(r.content || "");
    if (Object.keys(kv).length > 0) {
      for (const [k, v] of Object.entries(kv)) {
        ensure(k);
        row[k] = v;
      }
    } else if (r.content) {
      ensure("contenido");
      row["contenido"] = r.content;
    }
    if (r.tags?.length) {
      ensure("etiquetas");
      row["etiquetas"] = r.tags.join(", ");
    }
    return row;
  });

  if (colSet.length === 0) colSet.push("título", "contenido");

  for (const row of rows) {
    for (const c of colSet) {
      if (!(c in row)) row[c] = "";
    }
  }

  return { columns: colSet, rows };
}

function parsePastedGrid(raw: string): { columns: string[]; rows: GridRow[] } {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!text) return { columns: [], rows: [] };

  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { columns: [], rows: [] };

  const delim = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
  const splitLine = (line: string) => line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));

  const firstCells = splitLine(lines[0]);
  const firstLower = firstCells.map((h) => h.toLowerCase());
  const headerHints = [
    "title",
    "titulo",
    "título",
    "content",
    "contenido",
    "question",
    "pregunta",
    "answer",
    "respuesta",
    "name",
    "nombre",
    "precio",
    "price",
    "sku",
    "id",
    "producto",
  ];
  const hasHeader =
    firstLower.some((h) => headerHints.includes(h)) ||
    firstCells.some((h) => h.length > 0 && h.length < 40 && !/^\d+([.,]\d+)?$/.test(h));

  let headers: string[];
  let dataLines: string[];
  if (hasHeader) {
    const seen: string[] = [];
    headers = firstCells.map((h, i) => {
      const name = uniqueColumnName(h || `columna_${i + 1}`, seen);
      seen.push(name);
      return name;
    });
    dataLines = lines.slice(1);
  } else {
    headers = firstCells.map((_, i) => `columna_${i + 1}`);
    dataLines = lines;
  }

  const rows: GridRow[] = dataLines.map((line) => {
    const cells = splitLine(line);
    const row: GridRow = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });

  return { columns: headers, rows };
}

type CellPos = { r: number; c: number };
type CellRange = { r0: number; c0: number; r1: number; c1: number };

function normalizeRange(range: CellRange) {
  return {
    rMin: Math.min(range.r0, range.r1),
    rMax: Math.max(range.r0, range.r1),
    cMin: Math.min(range.c0, range.c1),
    cMax: Math.max(range.c0, range.c1),
  };
}

function isInRange(r: number, c: number, range: CellRange | null) {
  if (!range) return false;
  const { rMin, rMax, cMin, cMax } = normalizeRange(range);
  return r >= rMin && r <= rMax && c >= cMin && c <= cMax;
}

function rangeCellCount(range: CellRange | null) {
  if (!range) return 0;
  const { rMin, rMax, cMin, cMax } = normalizeRange(range);
  return (rMax - rMin + 1) * (cMax - cMin + 1);
}

function cellId(row: number, col: number) {
  return `sheet-cell-${row}-${col}`;
}

function focusCell(row: number, col: number) {
  const el = document.getElementById(cellId(row, col)) as HTMLInputElement | null;
  if (!el) return;
  el.focus();
  el.select();
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
}

/**
 * Página de carga de Datos: hoja de cálculo editable a pantalla completa con
 * navegación por teclado y menú de clic derecho.
 */
export default function ConocimientoDatos() {
  const navigate = useNavigate();
  const parse = useParseSpreadsheet();
  const bulk = useBulkCreateKnowledge();
  const inputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState<string[]>(() => [...DEFAULT_COLUMNS]);
  const [rows, setRows] = useState<GridRow[]>(() =>
    makeEmptyRows(DEFAULT_COLUMNS, DEFAULT_ROW_COUNT),
  );
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(Array.from({ length: DEFAULT_ROW_COUNT }, (_, i) => i)),
  );
  const [indexOnCreate, setIndexOnCreate] = useState(true);
  const [asDataBundle, setAsDataBundle] = useState(true);
  const [bundleTitle, setBundleTitle] = useState("");
  const [activeCell, setActiveCell] = useState<CellPos | null>({ r: 0, c: 0 });
  const [cellRange, setCellRange] = useState<CellRange | null>({
    r0: 0,
    c0: 0,
    r1: 0,
    c1: 0,
  });
  const [ctxTarget, setCtxTarget] = useState<CtxTarget>(null);
  const isSelectingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const selectionAnchorRef = useRef<CellPos>({ r: 0, c: 0 });

  useEffect(() => {
    const onUp = () => {
      if (!isSelectingRef.current) return;
      const moved = dragMovedRef.current;
      isSelectingRef.current = false;
      if (!moved) {
        const a = selectionAnchorRef.current;
        requestAnimationFrame(() => focusCell(a.r, a.c));
      } else {
        // Tras arrastrar, no dejar el input en modo edición: blur para que Delete limpie el rango
        const active = document.activeElement as HTMLElement | null;
        active?.blur?.();
      }
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  const applyGrid = (cols: string[], nextRows: GridRow[], sourceLabel: string) => {
    setColumns(cols);
    setRows(nextRows);
    setSelected(new Set(nextRows.map((_, i) => i)));
    setBundleTitle((prev) => prev || sourceLabel);
    setActiveCell({ r: 0, c: 0 });
    setCellRange({ r0: 0, c0: 0, r1: 0, c1: 0 });
    selectionAnchorRef.current = { r: 0, c: 0 };
    requestAnimationFrame(() => focusCell(0, 0));
    toast.success(`${nextRows.length} fila(s) listas · edita y guarda cuando quieras`);
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".csv") && !lower.endsWith(".xlsx") && !lower.endsWith(".xls")) {
      toast.error("Usa un archivo .csv, .xlsx o .xls");
      return;
    }
    setFileName(file.name);
    const label = file.name.replace(/\.(csv|xlsx|xls)$/i, "");
    setBundleTitle(label);
    parse.mutate(file, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        const { columns: cols, rows: next } = rowsFromApi(data.rows ?? []);
        applyGrid(cols, next, label);
      },
      onError: (err) => {
        const msg =
          (err as { friendlyMessage?: string; response?: { data?: { error?: string } } })?.response
            ?.data?.error ||
          (err as { friendlyMessage?: string }).friendlyMessage ||
          "No se pudo leer el archivo";
        toast.error(msg);
      },
    });
  };

  const handlePasteApply = (raw: string) => {
    const { columns: cols, rows: next } = parsePastedGrid(raw);
    if (next.length === 0) {
      toast.error("No se detectaron filas en el pegado");
      return;
    }
    setFileName("");
    applyGrid(cols, next, bundleTitle || "Tabla pegada");
  };

  /** Ctrl+V en la hoja: si viene tabla (tabs/saltos), rellena como Excel. */
  const handleGridPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData?.getData("text/plain") ?? "";
    const looksLikeTable =
      text.includes("\t") || (text.includes("\n") && text.trim().split("\n").length > 1);
    if (!looksLikeTable) return; // pegado simple en la celda activa
    e.preventDefault();
    handlePasteApply(text);
  };

  const renameColumn = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    const finalName =
      columns.includes(trimmed) && trimmed !== oldName
        ? uniqueColumnName(
            trimmed,
            columns.filter((c) => c !== oldName),
          )
        : trimmed;

    setColumns((prev) => prev.map((c) => (c === oldName ? finalName : c)));
    setRows((prev) =>
      prev.map((row) => {
        const next = { ...row };
        next[finalName] = next[oldName] ?? "";
        delete next[oldName];
        return next;
      }),
    );
  };

  const addColumn = (atIndex?: number) => {
    const name = uniqueColumnName("nueva_columna", columns);
    const idx = atIndex ?? columns.length;
    setColumns((prev) => {
      const next = [...prev];
      next.splice(idx, 0, name);
      return next;
    });
    setRows((prev) => prev.map((row) => ({ ...row, [name]: "" })));
  };

  const insertColumnRelative = (colIndex: number, side: "left" | "right") => {
    addColumn(side === "left" ? colIndex : colIndex + 1);
  };

  const removeColumn = (name: string) => {
    if (columns.length <= 1) {
      toast.error("Debe quedar al menos una columna");
      return;
    }
    setColumns((prev) => prev.filter((c) => c !== name));
    setRows((prev) =>
      prev.map((row) => {
        const next = { ...row };
        delete next[name];
        return next;
      }),
    );
  };

  const removeColumnAt = (colIndex: number) => {
    const name = columns[colIndex];
    if (name) removeColumn(name);
  };

  const updateCell = (rowIdx: number, col: string, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === rowIdx ? { ...row, [col]: value } : row)));
  };

  const clearCell = (r: number, c: number) => {
    const col = columns[c];
    if (!col) return;
    updateCell(r, col, "");
  };

  const clearRange = (range: CellRange | null = cellRange) => {
    if (!range) return;
    const { rMin, rMax, cMin, cMax } = normalizeRange(range);
    setRows((prev) =>
      prev.map((row, ri) => {
        if (ri < rMin || ri > rMax) return row;
        const next = { ...row };
        for (let ci = cMin; ci <= cMax; ci++) {
          const col = columns[ci];
          if (col) next[col] = "";
        }
        return next;
      }),
    );
  };

  const copyRange = async (range: CellRange | null = cellRange) => {
    if (!range) return;
    const { rMin, rMax, cMin, cMax } = normalizeRange(range);
    const lines: string[] = [];
    for (let ri = rMin; ri <= rMax; ri++) {
      const cells: string[] = [];
      for (let ci = cMin; ci <= cMax; ci++) {
        const col = columns[ci];
        cells.push(col ? (rows[ri]?.[col] ?? "") : "");
      }
      lines.push(cells.join("\t"));
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      const n = rangeCellCount(range);
      toast.message(n > 1 ? `${n} celdas copiadas` : "Celda copiada");
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const emptyRow = (): GridRow => {
    const empty: GridRow = {};
    for (const col of columns) empty[col] = "";
    return empty;
  };

  const addRow = (atIndex?: number) => {
    const idx = atIndex ?? rows.length;
    setRows((prev) => {
      const next = [...prev];
      next.splice(idx, 0, emptyRow());
      return next;
    });
    setSelected((prev) => {
      const next = new Set<number>();
      for (const i of prev) {
        next.add(i >= idx ? i + 1 : i);
      }
      next.add(idx);
      return next;
    });
  };

  const insertRowRelative = (rowIndex: number, side: "above" | "below") => {
    addRow(side === "above" ? rowIndex : rowIndex + 1);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) {
      toast.error("Debe quedar al menos una fila");
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
    setSelected((prev) => {
      const next = new Set<number>();
      for (const i of prev) {
        if (i === rowIndex) continue;
        next.add(i > rowIndex ? i - 1 : i);
      }
      return next;
    });
    if (activeCell?.r === rowIndex) setActiveCell(null);
    else if (activeCell && activeCell.r > rowIndex) {
      setActiveCell({ r: activeCell.r - 1, c: activeCell.c });
    }
  };

  const copyCell = async (r: number, c: number) => {
    await copyRange({ r0: r, c0: c, r1: r, c1: c });
  };

  const pasteCell = async (r: number, c: number) => {
    const col = columns[c];
    if (!col) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes("\t") || text.includes("\n")) {
        handlePasteApply(text);
        return;
      }
      updateCell(r, col, text);
    } catch {
      toast.error("No se pudo pegar (permiso del navegador)");
    }
  };

  const startCellSelect = (r: number, c: number, extend: boolean) => {
    if (extend && selectionAnchorRef.current) {
      const a = selectionAnchorRef.current;
      setCellRange({ r0: a.r, c0: a.c, r1: r, c1: c });
      setActiveCell({ r, c });
      return;
    }
    selectionAnchorRef.current = { r, c };
    setCellRange({ r0: r, c0: c, r1: r, c1: c });
    setActiveCell({ r, c });
  };

  const onCellMouseDown = (e: MouseEvent, r: number, c: number) => {
    if (e.button !== 0) return;
    // Evitar que el input capture el foco hasta soltar (si no hubo drag)
    e.preventDefault();
    isSelectingRef.current = true;
    dragMovedRef.current = false;
    startCellSelect(r, c, e.shiftKey);
  };

  const onCellMouseEnter = (r: number, c: number) => {
    if (!isSelectingRef.current) return;
    dragMovedRef.current = true;
    const a = selectionAnchorRef.current;
    setCellRange({ r0: a.r, c0: a.c, r1: r, c1: c });
    setActiveCell({ r, c });
  };

  const toggleRow = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const navigateCell = useCallback(
    (r: number, c: number, key: string, extend: boolean) => {
      const maxR = rows.length - 1;
      const maxC = columns.length - 1;
      if (maxR < 0 || maxC < 0) return;

      let nr = r;
      let nc = c;
      if (key === "ArrowUp") nr = Math.max(0, r - 1);
      else if (key === "ArrowDown" || key === "Enter") nr = Math.min(maxR, r + 1);
      else if (key === "ArrowLeft") nc = Math.max(0, c - 1);
      else if (key === "ArrowRight") nc = Math.min(maxC, c + 1);
      else if (key === "Tab") nc = c + 1;
      else if (key === "ShiftTab") nc = c - 1;
      else return;

      if (key === "Tab" || key === "ShiftTab") {
        if (nc > maxC) {
          nc = 0;
          nr = Math.min(maxR, r + 1);
        } else if (nc < 0) {
          nc = maxC;
          nr = Math.max(0, r - 1);
        }
      }

      if (extend) {
        const a = selectionAnchorRef.current;
        setCellRange({ r0: a.r, c0: a.c, r1: nr, c1: nc });
        setActiveCell({ r: nr, c: nc });
      } else {
        selectionAnchorRef.current = { r: nr, c: nc };
        setCellRange({ r0: nr, c0: nc, r1: nr, c1: nc });
        setActiveCell({ r: nr, c: nc });
        requestAnimationFrame(() => focusCell(nr, nc));
      }
    },
    [rows.length, columns.length],
  );

  const onCellKeyDown = (e: KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if ((e.key === "c" || e.key === "C") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void copyRange(cellRange ?? { r0: r, c0: c, r1: r, c1: c });
      return;
    }
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      rangeCellCount(cellRange) > 1 &&
      !e.metaKey &&
      !e.ctrlKey
    ) {
      // Si hay rango multi-celda, borrar todo el rango (estilo Excel)
      e.preventDefault();
      clearRange(cellRange);
      return;
    }

    const navKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
    if (navKeys.includes(e.key)) {
      const input = e.currentTarget;
      const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
      const atEnd =
        input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
      const allSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length;

      if (e.key === "ArrowLeft" && !atStart && !allSelected && !e.shiftKey) return;
      if (e.key === "ArrowRight" && !atEnd && !allSelected && !e.shiftKey) return;

      e.preventDefault();
      navigateCell(r, c, e.key, e.shiftKey);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      navigateCell(r, c, e.shiftKey ? "ShiftTab" : "Tab", false);
    }
  };

  /** Delete/Backspace / Ctrl+C cuando el foco no está en un input (tras arrastrar). */
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!cellRange) return;
      if ((e.key === "c" || e.key === "C") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void copyRange(cellRange);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        clearRange(cellRange);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellRange, columns, rows]);

  const handleImport = () => {
    const chosen = rows.filter(
      (_, i) => selected.has(i) && columns.some((c) => (rows[i][c] ?? "").trim().length > 0),
    );
    if (chosen.length === 0) {
      toast.error("Escribe o pega al menos una fila con datos");
      return;
    }
    if (columns.length === 0) {
      toast.error("Agrega al menos una columna");
      return;
    }

    const cleanRows = chosen.map((row) => {
      const obj: Record<string, string> = {};
      for (const col of columns) obj[col] = row[col] ?? "";
      return obj;
    });

    let items: Partial<{
      title: string;
      content: string;
      knowledge_type: "DATA" | "DOCUMENT";
      tags: string[];
      is_active: boolean;
    }>[];

    if (asDataBundle) {
      items = [
        {
          title: bundleTitle.trim() || fileName || "Tabla importada",
          content: JSON.stringify(cleanRows),
          knowledge_type: "DATA",
          is_active: true,
          tags: ["excel-import"],
        },
      ];
    } else {
      items = cleanRows.map((row, i) => {
        const title =
          row["título"] || row["title"] || row["nombre"] || row[columns[0]] || `Fila ${i + 1}`;
        const content = columns.map((col) => `${col}: ${row[col] ?? ""}`).join("\n");
        return {
          title: String(title).slice(0, 200),
          content,
          knowledge_type: "DOCUMENT" as const,
          is_active: true,
        };
      });
    }

    bulk.mutate(
      { items, index: indexOnCreate },
      {
        onSuccess: (res) => {
          const n = res.count ?? res.created?.length ?? items.length;
          toast.success(`${n} documento(s) importado(s)`);
          navigate("/conocimiento");
        },
        onError: (err) => {
          toast.error(
            (err as { friendlyMessage?: string }).friendlyMessage ||
              "Error al crear el conocimiento",
          );
        },
      },
    );
  };

  const selectedCount = useMemo(() => selected.size, [selected]);
  const hasData = rows.some((row) => columns.some((c) => (row[c] ?? "").trim()));

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 flex flex-col gap-3 h-[calc(100dvh-4rem)]">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/conocimiento")}
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Datos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pega con Ctrl+V · arrastra para seleccionar · Shift+flechas · clic derecho
            {fileName ? ` · ${fileName}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start flex-wrap justify-end">
          <StudioBranchFilter />
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={parse.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {parse.isPending ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-1.5" />
            )}
            Archivo
          </Button>
          <Button
            type="button"
            disabled={!hasData || selected.size === 0 || bulk.isPending}
            onClick={handleImport}
          >
            {bulk.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar e indexar
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-xs sm:text-sm">
            <Checkbox
              checked={indexOnCreate}
              onCheckedChange={(v) => setIndexOnCreate(Boolean(v))}
            />
            Indexar al crear
          </label>
          <label className="flex items-center gap-2 text-xs sm:text-sm">
            <Checkbox checked={asDataBundle} onCheckedChange={(v) => setAsDataBundle(Boolean(v))} />
            Una sola tabla
          </label>
          {asDataBundle && (
            <div className="flex items-center gap-2 min-w-[140px] flex-1 max-w-xs">
              <Label className="text-xs shrink-0">Título</Label>
              <Input
                value={bundleTitle}
                onChange={(e) => setBundleTitle(e.target.value)}
                className="h-8 text-xs"
                placeholder="Nombre de la tabla"
              />
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Button type="button" variant="outline" size="sm" onClick={() => addColumn()}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Columna
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addRow()}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Fila
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelected(
                  selected.size === rows.length ? new Set() : new Set(rows.map((_, i) => i)),
                )
              }
            >
              {selected.size === rows.length ? "Ninguna" : "Todas"}
            </Button>
          </div>
        </div>

        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              ref={gridScrollRef}
              onPaste={handleGridPaste}
              className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner"
            >
              <table className="border-collapse text-xs w-max min-w-full">
                <thead className="sticky top-0 z-20">
                  <tr>
                    <th className="sticky left-0 z-30 w-12 min-w-12 bg-muted border-b border-r border-border px-1 py-1.5 font-medium text-muted-foreground">
                      #
                    </th>
                    {columns.map((col, cIdx) => (
                      <th
                        key={col}
                        className="bg-muted border-b border-r border-border p-0 min-w-[140px] max-w-[240px]"
                        onContextMenu={() => setCtxTarget({ kind: "header", c: cIdx })}
                      >
                        <div className="flex items-center gap-0.5 px-1 py-1">
                          <Input
                            defaultValue={col}
                            key={`hdr-${col}`}
                            className="h-7 border-0 bg-transparent shadow-none focus-visible:ring-1 text-xs font-semibold px-1"
                            title="Renombrar columna"
                            onBlur={(e) => {
                              if (e.target.value.trim() !== col) {
                                renameColumn(col, e.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                            title="Eliminar columna"
                            onClick={() => removeColumn(col)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30">
                      <td
                        className="sticky left-0 z-10 w-12 min-w-12 bg-muted/80 border-b border-r border-border px-1 py-0 text-center align-middle"
                        onContextMenu={() => setCtxTarget({ kind: "row", r: rIdx })}
                      >
                        <div className="flex items-center justify-center gap-1 py-1">
                          <Checkbox
                            checked={selected.has(rIdx)}
                            onCheckedChange={() => toggleRow(rIdx)}
                            className="h-3.5 w-3.5"
                          />
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {rIdx + 1}
                          </span>
                        </div>
                      </td>
                      {columns.map((col, cIdx) => {
                        const isActive = activeCell?.r === rIdx && activeCell?.c === cIdx;
                        const inSelection = isInRange(rIdx, cIdx, cellRange);
                        return (
                          <td
                            key={col}
                            className={cn(
                              "border-b border-r border-border p-0 min-w-[140px] max-w-[240px] select-none",
                              inSelection && "bg-primary/15",
                              isActive && "ring-2 ring-inset ring-primary/70",
                            )}
                            onMouseDown={(e) => onCellMouseDown(e, rIdx, cIdx)}
                            onMouseEnter={() => onCellMouseEnter(rIdx, cIdx)}
                            onContextMenu={() => {
                              setCtxTarget({ kind: "cell", r: rIdx, c: cIdx });
                              if (!isInRange(rIdx, cIdx, cellRange)) {
                                startCellSelect(rIdx, cIdx, false);
                              }
                            }}
                            onDoubleClick={() => focusCell(rIdx, cIdx)}
                          >
                            <input
                              id={cellId(rIdx, cIdx)}
                              value={row[col] ?? ""}
                              onChange={(e) => updateCell(rIdx, col, e.target.value)}
                              onFocus={() => {
                                setActiveCell({ r: rIdx, c: cIdx });
                                if (!isSelectingRef.current) {
                                  selectionAnchorRef.current = { r: rIdx, c: cIdx };
                                  setCellRange({
                                    r0: rIdx,
                                    c0: cIdx,
                                    r1: rIdx,
                                    c1: cIdx,
                                  });
                                }
                              }}
                              onKeyDown={(e) => onCellKeyDown(e, rIdx, cIdx)}
                              className={cn(
                                "w-full h-8 bg-transparent px-2 text-xs outline-none caret-foreground",
                                "focus:bg-primary/5",
                              )}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-56 z-[100]">
            {ctxTarget?.kind === "cell" && (
              <>
                <ContextMenuLabel className="text-xs">
                  {rangeCellCount(cellRange) > 1
                    ? `${rangeCellCount(cellRange)} celdas`
                    : `Celda ${ctxTarget.r + 1}, ${columns[ctxTarget.c] || "…"}`}
                </ContextMenuLabel>
                <ContextMenuItem
                  onClick={() =>
                    void copyRange(
                      cellRange && isInRange(ctxTarget.r, ctxTarget.c, cellRange)
                        ? cellRange
                        : {
                            r0: ctxTarget.r,
                            c0: ctxTarget.c,
                            r1: ctxTarget.r,
                            c1: ctxTarget.c,
                          },
                    )
                  }
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copiar
                  <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => pasteCell(ctxTarget.r, ctxTarget.c)}>
                  <ClipboardPaste className="h-3.5 w-3.5 mr-2" />
                  Pegar
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    clearRange(
                      cellRange && isInRange(ctxTarget.r, ctxTarget.c, cellRange)
                        ? cellRange
                        : {
                            r0: ctxTarget.r,
                            c0: ctxTarget.c,
                            r1: ctxTarget.r,
                            c1: ctxTarget.c,
                          },
                    )
                  }
                >
                  Limpiar
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}

            {(ctxTarget?.kind === "cell" || ctxTarget?.kind === "row") && (
              <>
                <ContextMenuLabel className="text-xs">Fila</ContextMenuLabel>
                <ContextMenuItem onClick={() => insertRowRelative(ctxTarget.r, "above")}>
                  <Rows3 className="h-3.5 w-3.5 mr-2" />
                  Insertar fila arriba
                </ContextMenuItem>
                <ContextMenuItem onClick={() => insertRowRelative(ctxTarget.r, "below")}>
                  <Rows3 className="h-3.5 w-3.5 mr-2" />
                  Insertar fila abajo
                </ContextMenuItem>
                <ContextMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteRow(ctxTarget.r)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Eliminar fila
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}

            {(ctxTarget?.kind === "cell" || ctxTarget?.kind === "header") && (
              <>
                <ContextMenuLabel className="text-xs">Columna</ContextMenuLabel>
                <ContextMenuItem onClick={() => insertColumnRelative(ctxTarget.c, "left")}>
                  <Columns3 className="h-3.5 w-3.5 mr-2" />
                  Insertar columna a la izquierda
                </ContextMenuItem>
                <ContextMenuItem onClick={() => insertColumnRelative(ctxTarget.c, "right")}>
                  <Columns3 className="h-3.5 w-3.5 mr-2" />
                  Insertar columna a la derecha
                </ContextMenuItem>
                <ContextMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => removeColumnAt(ctxTarget.c)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Eliminar columna
                </ContextMenuItem>
              </>
            )}

            {ctxTarget?.kind === "row" && (
              <ContextMenuItem onClick={() => toggleRow(ctxTarget.r)}>
                {selected.has(ctxTarget.r) ? "Quitar de selección" : "Incluir en selección"}
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>

        <p className="shrink-0 text-[11px] text-muted-foreground">
          {selectedCount}/{rows.length} filas · {columns.length} columnas
          {rangeCellCount(cellRange) > 1
            ? ` · ${rangeCellCount(cellRange)} celdas seleccionadas`
            : ""}
          {" · "}
          arrastra o Shift+flechas · Ctrl+C / Supr
        </p>
      </div>
    </div>
  );
}
