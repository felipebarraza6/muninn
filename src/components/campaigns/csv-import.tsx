import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CampaignAudienceMember } from "@/lib/mock-data";

export interface ParsedCsvResult {
  fileName: string;
  rows: CampaignAudienceMember[];
  invalidCount: number;
  duplicateCount: number;
}

interface Props {
  value: ParsedCsvResult | null;
  onChange: (result: ParsedCsvResult | null) => void;
}

const MAX_ROWS = 5000;

/** Parser CSV simple. Soporta comillas y comas dentro de campos. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cur);
        cur = "";
      } else if (ch === "\n" || ch === "\r") {
        if (cur.length > 0 || row.length > 0) {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = "";
        }
        if (ch === "\r" && text[i + 1] === "\n") i++;
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  // Aceptar 9XXXXXXXX o 569XXXXXXXX
  let local = digits;
  if (local.startsWith("56")) local = local.slice(2);
  if (local.length === 9 && local.startsWith("9")) {
    return `+56 9 ${local.slice(1, 5)} ${local.slice(5)}`;
  }
  // Fallback: devolver con +
  return `+${digits}`;
}

export function CsvImport({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("El archivo debe ser .csv");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Máximo 2 MB");
      return;
    }
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      setError("El archivo está vacío o solo tiene cabecera");
      return;
    }
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const idx = {
      nombre: header.indexOf("nombre"),
      telefono:
        header.indexOf("telefono") !== -1 ? header.indexOf("telefono") : header.indexOf("teléfono"),
      tratamiento: header.indexOf("tratamiento"),
      monto: header.indexOf("monto"),
      nota: header.indexOf("nota"),
    };
    if (idx.nombre === -1 || idx.telefono === -1) {
      setError("Faltan columnas requeridas: 'nombre' y 'teléfono'");
      return;
    }

    const seen = new Set<string>();
    const valid: CampaignAudienceMember[] = [];
    let invalid = 0;
    let duplicates = 0;
    const dataRows = rows.slice(1, MAX_ROWS + 1);
    dataRows.forEach((r, i) => {
      const nombre = (r[idx.nombre] ?? "").trim();
      const phoneRaw = (r[idx.telefono] ?? "").trim();
      const phone = normalizePhone(phoneRaw);
      if (!nombre || !phone) {
        invalid++;
        return;
      }
      if (seen.has(phone)) {
        duplicates++;
        return;
      }
      seen.add(phone);
      const montoStr = idx.monto !== -1 ? (r[idx.monto] ?? "").trim() : "";
      const monto = Number(montoStr.replace(/[^\d]/g, "")) || 0;
      valid.push({
        id: `csv-${i}`,
        patient: nombre,
        phone,
        treatment:
          idx.tratamiento !== -1 ? (r[idx.tratamiento] ?? "").trim() || undefined : undefined,
        note: idx.nota !== -1 ? (r[idx.nota] ?? "").trim() || undefined : undefined,
        value: monto,
        stage: "queued",
      });
    });

    if (valid.length === 0) {
      setError("No quedaron contactos válidos. Revisa nombres y teléfonos.");
      return;
    }

    onChange({
      fileName: file.name,
      rows: valid,
      invalidCount: invalid,
      duplicateCount: duplicates,
    });
  };

  const handleClear = () => {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border bg-success-soft/40 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{value.fileName}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{value.rows.length}</span> contactos
              válidos
              {value.invalidCount > 0 && (
                <>
                  {" "}
                  · <span className="text-warning-foreground">{value.invalidCount}</span> sin
                  teléfono válido
                </>
              )}
              {value.duplicateCount > 0 && (
                <>
                  {" "}
                  · <span className="text-warning-foreground">{value.duplicateCount}</span>{" "}
                  duplicados
                </>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Quitar archivo">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted/40 px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Vista previa (primeras 5)
          </div>
          <div className="divide-y text-sm">
            {value.rows.slice(0, 5).map((r) => (
              <div key={r.id} className="px-3 py-2 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.patient}</div>
                  <div className="text-xs text-muted-foreground">{r.phone}</div>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[140px]">
                  {r.treatment ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          dragOver
            ? "border-primary bg-primary-soft/30"
            : "border-input hover:border-primary/40 hover:bg-muted/30",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <div className="text-sm font-medium">Arrastra tu archivo CSV o haz clic</div>
        <div className="text-xs text-muted-foreground mt-1">
          Columnas requeridas: <code className="font-mono">nombre</code>,{" "}
          <code className="font-mono">teléfono</code>
        </div>
        <div className="text-xs text-muted-foreground">
          Opcionales: <code className="font-mono">tratamiento</code>,{" "}
          <code className="font-mono">monto</code>, <code className="font-mono">nota</code> · máx.{" "}
          {MAX_ROWS.toLocaleString("es-CL")} filas
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
      <a
        href="/audiencia-ejemplo.csv"
        download
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <Download className="h-3.5 w-3.5" />
        Descargar plantilla CSV
      </a>
    </div>
  );
}
