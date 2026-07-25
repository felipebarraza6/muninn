import { useEffect, useMemo, useState } from "react";
import { Braces, Download, Eye, FileDown, FileText, List, Type } from "lucide-react";
import { toast } from "sonner";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  artifactPreviewKind,
  downloadArtifact,
  downloadTextFile,
  extractResultArtifacts,
  humanFileKind,
  resolveArtifactHref,
  structuredResultRows,
  tryParseJsonValue,
  type ResultArtifact,
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

function safeBase(name: string) {
  return name.replace(/[^\w.-]+/g, "-").slice(0, 60) || "resultado";
}

function isPlainProse(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (tryParseJsonValue(t)) return false;
  return true;
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
  const [previewArt, setPreviewArt] = useState<ResultArtifact | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const artifacts = useMemo(
    () => extractResultArtifacts(rawResult, text),
    [rawResult, text],
  );

  const structuredRows = useMemo(
    () => structuredResultRows(rawResult, text),
    [rawResult, text],
  );

  const textIsJson = Boolean(tryParseJsonValue(text));
  const showProse = isPlainProse(text) && !structuredRows.length;
  const showStructured = structuredRows.length > 0;

  const listText = useMemo(() => toBulletList(text), [text]);
  const displayText = mode === "list" ? listText : text;
  const rawDisplay = useMemo(() => {
    if (rawResult != null) return prettyJson(rawResult);
    if (textIsJson) return prettyJson(text);
    return text;
  }, [rawResult, text, textIsJson]);
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
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "";
      toast.error(msg || "No se pudo descargar el archivo");
    } finally {
      setDownloadingId(null);
    }
  };

  const openPreview = async (id: string) => {
    const art = artifacts.find((a) => a.id === id);
    if (!art) return;
    setPreviewArt(art);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      if (art.kind === "text" && art.content != null) {
        setPreviewUrl(null);
        return;
      }
      const href = await resolveArtifactHref(art);
      setPreviewUrl(href);
    } catch (err) {
      setPreviewError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "No se pudo abrir la vista previa",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const empty =
    !showProse && !showStructured && artifacts.length === 0 && !text.trim();

  return (
    <div className={cn("space-y-2.5", className)}>
      {error ? <ErrorBanner variant="inline" message={error} /> : null}

      {artifacts.length > 0 ? (
        <div className="rounded-xl border border-primary/30 bg-primary/8 p-2.5 space-y-2 shadow-sm shadow-primary/5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5">
            Archivos del resultado
          </p>
          <ul className="space-y-1.5">
            {artifacts.map((art) => {
              const kind = humanFileKind(art.name, art.mime);
              const busy = downloadingId === art.id;
              return (
                <li
                  key={art.id}
                  className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2"
                >
                  <FileDown className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-medium break-all leading-snug">{art.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                        {kind}
                      </span>
                      {art.sizeHint ? <span className="ml-1.5">{art.sizeHint}</span> : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 self-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 cursor-pointer"
                      onClick={() => void openPreview(art.id)}
                      title="Vista previa"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ver
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 gap-1 cursor-pointer"
                      disabled={busy}
                      onClick={() => void handleArtifact(art.id)}
                      title="Descargar"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {busy ? "…" : "Bajar"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <Dialog
        open={!!previewArt}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewArt(null);
            setPreviewUrl(null);
            setPreviewError(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl w-[min(96vw,48rem)] h-[min(85vh,40rem)] flex flex-col gap-3">
          <DialogHeader>
            <DialogTitle className="text-sm truncate pr-6">
              {previewArt?.name || "Vista previa"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 rounded-lg border bg-muted/20 overflow-hidden flex flex-col">
            {previewLoading ? (
              <p className="p-4 text-xs text-muted-foreground">Cargando vista previa…</p>
            ) : previewError ? (
              <p className="p-4 text-xs text-destructive">{previewError}</p>
            ) : previewArt && artifactPreviewKind(previewArt) === "pdf" && previewUrl ? (
              <iframe title={previewArt.name} src={previewUrl} className="flex-1 w-full h-full min-h-[20rem] bg-background" />
            ) : previewArt && artifactPreviewKind(previewArt) === "image" && previewUrl ? (
              <div className="flex-1 overflow-auto p-3 flex items-center justify-center">
                <img src={previewUrl} alt={previewArt.name} className="max-w-full max-h-full object-contain" />
              </div>
            ) : previewArt &&
              (artifactPreviewKind(previewArt) === "text" || previewArt.kind === "text") ? (
              <pre className="flex-1 overflow-auto p-3 text-xs whitespace-pre-wrap break-words font-mono">
                {previewArt.content || "Sin contenido de texto"}
              </pre>
            ) : previewArt && artifactPreviewKind(previewArt) === "office" ? (
              <div className="p-4 space-y-3 text-sm">
                <p className="text-muted-foreground text-xs">
                  Excel no se previsualiza en el navegador. Podés bajarlo o abrirlo en otra pestaña.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => previewArt && void handleArtifact(previewArt.id)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Bajar
                  </Button>
                  {previewUrl ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                        Abrir
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : previewUrl ? (
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Este tipo de archivo no tiene vista previa embebida.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    Abrir en pestaña
                  </a>
                </Button>
              </div>
            ) : (
              <p className="p-4 text-xs text-muted-foreground">Sin vista previa</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {empty ? (
        <EmptyState className="py-6 px-3" title={emptyHint} />
      ) : showProse || showStructured || text.trim() ? (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-muted/20 overflow-hidden flex flex-col min-h-0">
          <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border/50 bg-card/40">
            <div className="flex rounded-md border border-border/60 p-0.5 gap-0.5 min-w-0">
              {(
                [
                  { id: "format", label: "Resumen", icon: Type },
                  { id: "raw", label: "JSON", icon: FileText },
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
                  <opt.icon className="h-3 w-3 shrink-0" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-0.5 shrink-0">
              <ChatCopyButton text={rawDisplay || displayText} alwaysVisible />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-[11px] px-2"
                onClick={() => handleDownload(showStructured || textIsJson ? "json" : "md")}
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
            {mode === "raw" ? (
              <pre className="text-[11px] whitespace-pre-wrap break-words font-mono text-foreground/90 leading-relaxed">
                {rawDisplay}
              </pre>
            ) : mode === "list" && showProse ? (
              <ChatMarkdown content={listText} className="text-[13px] sm:text-sm" />
            ) : showStructured ? (
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground">Resumen del resultado</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {structuredRows.map((row) => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className="rounded-lg border border-border/50 bg-background/60 px-2.5 py-2 min-w-0"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground break-words leading-snug">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
                {showProse ? (
                  <div className="pt-2 border-t border-border/40">
                    <ChatMarkdown content={text} className="text-[13px] sm:text-sm" />
                  </div>
                ) : null}
              </div>
            ) : showProse ? (
              <ChatMarkdown content={text} className="text-[13px] sm:text-sm" />
            ) : text.trim() ? (
              <pre className="text-[11px] whitespace-pre-wrap break-words font-mono text-foreground/90 leading-relaxed">
                {prettyJson(text)}
              </pre>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
