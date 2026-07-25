import { useMemo, useState } from "react";
import { Braces, Download, FileDown, FileText, List, Type } from "lucide-react";
import { toast } from "sonner";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { prettyJson } from "@/lib/json";
import { cn } from "@/lib/utils";
import {
  downloadArtifact,
  downloadTextFile,
  extractResultArtifacts,
} from "@/lib/workResultArtifacts";

export type ResultViewMode = "format" | "raw" | "list";

type WorkResultViewerProps = {
  text: string;
  /** Objeto completo del result (para descargar .json y detectar archivos). */
  rawResult?: unknown;
  error?: string | null;
  emptyHint?: string;
  className?: string;
  filenameBase?: string;
};

function toBulletList(text: string): string {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return "";
  return lines
    .map((line) => {
      if (/^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line)) return line;
      return `- ${line.replace(/^\*\*(.+)\*\*:?\s*/, "$1: ")}`;
    })
    .join("\n");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function safeBase(name: string) {
  return name.replace(/[^\w.-]+/g, "-").slice(0, 60) || "resultado";
}

export function WorkResultViewer({
  text,
  rawResult,
  error,
  emptyHint = "Este ítem aún no generó nada. Ejecútalo o revisa Insumos.",
  className,
  filenameBase = "resultado-trabajador",
}: WorkResultViewerProps) {
  const [mode, setMode] = useState<ResultViewMode>("format");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const artifacts = useMemo(
    () => extractResultArtifacts(rawResult, text),
    [rawResult, text],
  );

  const objectEntries = useMemo(() => {
    if (!isPlainObject(rawResult)) return null;
    if (text.trim()) return null;
    const skip = new Set([
      "content",
      "ok",
      "tool_calls",
      "nodes",
      "files",
      "attachments",
      "artifacts",
      "downloads",
    ]);
    const entries = Object.entries(rawResult).filter(
      ([k, v]) => !skip.has(k) && v != null && v !== "",
    );
    return entries.length ? entries : null;
  }, [rawResult, text]);

  const listText = useMemo(() => toBulletList(text), [text]);
  const displayText = mode === "list" ? listText : text;
  const base = safeBase(filenameBase);

  const handleDownload = (kind: "md" | "txt" | "json" | "csv") => {
    try {
      if (kind === "json") {
        const payload = rawResult != null ? rawResult : { content: text };
        downloadTextFile(`${base}.json`, prettyJson(payload), "application/json");
      } else if (kind === "md") {
        downloadTextFile(`${base}.md`, text || listText, "text/markdown");
      } else if (kind === "csv") {
        downloadTextFile(`${base}.csv`, text || listText, "text/csv");
      } else {
        downloadTextFile(`${base}.txt`, text || listText, "text/plain");
      }
      toast.success("Descarga lista");
    } catch {
      toast.error("No se pudo descargar");
    }
  };

  const handleArtifact = async (id: string) => {
    const art = artifacts.find((a) => a.id === id);
    if (!art) return;
    setDownloadingId(id);
    try {
      await downloadArtifact(art);
      toast.success(`Descargado: ${art.name}`);
    } catch {
      toast.error("No se pudo descargar el archivo");
    } finally {
      setDownloadingId(null);
    }
  };

  const empty = !text.trim() && !objectEntries && artifacts.length === 0;

  return (
    <div className={cn("space-y-2", className)}>
      {error ? <ErrorBanner variant="inline" message={error} /> : null}

      {artifacts.length > 0 ? (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-2.5 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5">
            Archivos del resultado
          </p>
          <ul className="space-y-1.5">
            {artifacts.map((art) => (
              <li
                key={art.id}
                className="flex items-center gap-2 rounded-lg border bg-card/70 px-2.5 py-2"
              >
                <FileDown className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{art.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {art.mime}
                    {art.sizeHint ? ` · ${art.sizeHint}` : ""}
                    {art.kind === "url" ? " · enlace" : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 shrink-0 gap-1"
                  disabled={downloadingId === art.id}
                  onClick={() => void handleArtifact(art.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Bajar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {empty ? (
        <EmptyState className="py-6 px-3" title={emptyHint} />
      ) : text.trim() || objectEntries ? (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-muted/20 overflow-hidden flex flex-col min-h-0">
          <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border/50 bg-card/40">
            <div className="flex rounded-md border border-border/60 p-0.5 gap-0.5">
              {(
                [
                  { id: "format", label: "Formato", icon: Type },
                  { id: "raw", label: "Raw", icon: FileText },
                  { id: "list", label: "Lista", icon: List },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  title={opt.label}
                  onClick={() => setMode(opt.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors",
                    mode === opt.id
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <opt.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-0.5">
              <ChatCopyButton text={displayText || prettyJson(rawResult)} alwaysVisible />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-[11px] px-2"
                onClick={() => handleDownload("md")}
                title="Descargar resultado"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Descargar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title="Más formatos"
                  >
                    <Braces className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[11rem]">
                  <DropdownMenuItem onClick={() => handleDownload("md")}>
                    Markdown (.md)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("txt")}>
                    Texto (.txt)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("csv")}>
                    CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("json")}>
                    JSON (.json)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto px-3 py-3 max-h-[min(52vh,520px)]">
            {objectEntries ? (
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  Resultado estructurado (skill / JSON)
                </p>
                <div className="rounded-lg border bg-background/50 divide-y divide-border/50">
                  {objectEntries.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-[7rem_1fr] gap-2 px-2.5 py-2 text-xs">
                      <span className="font-medium text-muted-foreground truncate">{key}</span>
                      <pre className="whitespace-pre-wrap break-words font-sans text-foreground/90">
                        {typeof val === "string" ? val : prettyJson(val)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : mode === "format" ? (
              <ChatMarkdown content={text} className="text-[13px] sm:text-sm" />
            ) : mode === "list" ? (
              <ChatMarkdown content={listText} className="text-[13px] sm:text-sm" />
            ) : (
              <pre className="text-xs whitespace-pre-wrap break-words font-mono text-foreground/90 leading-relaxed">
                {text}
              </pre>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
