import { useMemo, useRef, useState } from "react";
import { FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useParseSpreadsheet,
  useBulkCreateKnowledge,
  type SpreadsheetParseRow,
  type KnowledgeType,
} from "@/api/hooks/useKnowledge";
import { toast } from "sonner";

interface SpreadsheetImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si se pasa, los docs se asignan a ese agente al crear. */
  assignToAgentId?: string | number;
  onImported?: () => void;
}

/**
 * Flujo: subir CSV/Excel → preview filas parseadas → bulk_create (+ index + assign).
 * El backend convierte columnas flexibles (tablas) o FAQ (P/R) a filas de knowledge.
 */
export function SpreadsheetImportDialog({
  open,
  onOpenChange,
  assignToAgentId,
  onImported,
}: SpreadsheetImportDialogProps) {
  const parse = useParseSpreadsheet();
  const bulk = useBulkCreateKnowledge();
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<SpreadsheetParseRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [indexOnCreate, setIndexOnCreate] = useState(true);
  const [asDataBundle, setAsDataBundle] = useState(false);
  const [bundleTitle, setBundleTitle] = useState("");

  const reset = () => {
    setFileName("");
    setRows([]);
    setSelected(new Set());
    setAsDataBundle(false);
    setBundleTitle("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const previewCols = useMemo(() => {
    if (rows.length === 0) return ["title", "content", "knowledge_type"];
    return ["title", "content", "knowledge_type", "tags"];
  }, [rows]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".csv") && !lower.endsWith(".xlsx") && !lower.endsWith(".xls")) {
      toast.error("Usa un archivo .csv, .xlsx o .xls");
      return;
    }
    setFileName(file.name);
    setBundleTitle(file.name.replace(/\.(csv|xlsx|xls)$/i, ""));
    parse.mutate(file, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        const next = data.rows ?? [];
        setRows(next);
        setSelected(new Set(next.map((_, i) => i)));
        toast.success(`${data.count ?? next.length} filas listas para revisar`);
      },
      onError: (err) => {
        const msg =
          (err as { friendlyMessage?: string; response?: { data?: { error?: string } } })?.response
            ?.data?.error ||
          (err as { friendlyMessage?: string }).friendlyMessage ||
          "No se pudo parsear el archivo";
        toast.error(msg);
      },
    });
  };

  const toggleRow = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleImport = () => {
    const chosen = rows.filter((_, i) => selected.has(i));
    if (chosen.length === 0) {
      toast.error("Selecciona al menos una fila");
      return;
    }

    let items: Partial<{
      title: string;
      content: string;
      knowledge_type: KnowledgeType;
      tags: string[];
      is_active: boolean;
    }>[];

    if (asDataBundle) {
      // Una sola ficha DATA: tabla JSON que el viewer renderiza como grid
      const tableRows = chosen.map((r) => ({
        title: r.title,
        content: r.content,
        type: r.knowledge_type,
        tags: r.tags?.join(", ") ?? "",
      }));
      items = [
        {
          title: bundleTitle.trim() || fileName || "Tabla importada",
          content: JSON.stringify(tableRows),
          knowledge_type: "DATA",
          is_active: true,
          tags: ["excel-import"],
        },
      ];
    } else {
      items = chosen.map((r) => ({
        title: r.title,
        content: r.content,
        knowledge_type: (r.knowledge_type as KnowledgeType) || "DOCUMENT",
        tags: r.tags,
        is_active: true,
      }));
    }

    bulk.mutate(
      {
        items,
        index: indexOnCreate,
        assign_to_agent: assignToAgentId,
      },
      {
        onSuccess: (res) => {
          const n = res.count ?? res.created?.length ?? items.length;
          toast.success(`${n} documento(s) importado(s)`);
          reset();
          onOpenChange(false);
          onImported?.();
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

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importar Excel / CSV
          </DialogTitle>
          <DialogDescription>
            Sube una planilla (.xlsx / .csv). La API la convierte a filas editables; luego las
            guardas como conocimiento (documentos, FAQ o una sola tabla DATA).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary-soft/10 p-4 space-y-3">
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
              disabled={parse.isPending}
              onClick={() => inputRef.current?.click()}
            >
              {parse.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Elegir archivo
            </Button>
            {fileName && (
              <p className="text-xs text-muted-foreground truncate">Archivo: {fileName}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Columnas útiles: <code>title</code>, <code>content</code>, <code>question</code>/
              <code>answer</code> (FAQ), o cualquier tabla (modo flexible).
            </p>
          </div>

          {rows.length > 0 && (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={indexOnCreate}
                    onCheckedChange={(v) => setIndexOnCreate(Boolean(v))}
                  />
                  Indexar al crear
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={asDataBundle}
                    onCheckedChange={(v) => setAsDataBundle(Boolean(v))}
                  />
                  Guardar como una tabla DATA
                </label>
                {asDataBundle && (
                  <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                    <Label className="text-xs shrink-0">Título</Label>
                    <Input
                      value={bundleTitle}
                      onChange={(e) => setBundleTitle(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() =>
                    setSelected(
                      selected.size === rows.length ? new Set() : new Set(rows.map((_, i) => i)),
                    )
                  }
                >
                  {selected.size === rows.length ? "Deseleccionar" : "Seleccionar todo"}
                </Button>
              </div>

              <div className="rounded-md border overflow-auto max-h-[40vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10" />
                      {previewCols.map((c) => (
                        <TableHead key={c} className="text-xs whitespace-nowrap">
                          {c}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Checkbox
                            checked={selected.has(idx)}
                            onCheckedChange={() => toggleRow(idx)}
                          />
                        </TableCell>
                        <TableCell className="text-xs max-w-[140px] truncate">
                          {row.title}
                        </TableCell>
                        <TableCell className="text-xs max-w-[240px] truncate">
                          {row.content}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.knowledge_type || "DOCUMENT"}
                        </TableCell>
                        <TableCell className="text-xs">
                          {(row.tags || []).join(", ") || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selected.size} de {rows.length} filas seleccionadas
                {assignToAgentId ? " · se asignarán a este agente" : ""}
              </p>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={rows.length === 0 || selected.size === 0 || bulk.isPending}
            onClick={handleImport}
          >
            {bulk.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
