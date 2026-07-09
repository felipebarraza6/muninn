import { useState } from "react";
import { Loader2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useKnowledge, type KnowledgeType, type AgentKnowledge } from "@/api/hooks/useKnowledge";

interface KnowledgeContentViewerProps {
  knowledgeId: string;
  title: string;
  knowledgeType: KnowledgeType;
}

const KNOWLEDGE_TYPE_LABEL: Record<KnowledgeType, string> = {
  DOCUMENT: "Documento",
  FAQ: "Preguntas frecuentes",
  DATA: "Tabla de datos",
  FUNCTION: "Función",
  PROCEDURE: "Procedimiento",
  POLICY: "Política",
  API_DOC: "Documento API",
  CODE: "Código",
  CUSTOM: "Personalizado",
};

interface QAPair {
  question: string;
  answer: string;
}

function parseQAContent(content?: string): QAPair[] {
  if (!content) return [];
  const blocks = content.split(/^\s*---\s*$/gm);
  const pairs: QAPair[] = [];
  const regex = /P:\s*(.*?)\s*R:\s*(.*)/is;

  blocks.forEach((block) => {
    const match = block.match(regex);
    if (match) {
      pairs.push({ question: match[1].trim(), answer: match[2].trim() });
    }
  });

  return pairs;
}

function parseDataContent(content?: string): Record<string, unknown>[] {
  if (!content) return [];
  try {
    let parsed = JSON.parse(content.trim() || "[]");
    if (!Array.isArray(parsed)) parsed = [parsed];
    return parsed.filter((row) => row && typeof row === "object");
  } catch {
    return [];
  }
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
  const rows = parseDataContent(content);

  if (rows.length === 0) {
    return <ParagraphViewer content={content} />;
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="text-xs whitespace-nowrap">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((header) => (
                <TableCell key={header} className="text-xs whitespace-nowrap">
                  {String(row[header] ?? "—")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

function ContentRenderer({ doc }: { doc: AgentKnowledge }) {
  switch (doc.knowledge_type) {
    case "FAQ":
      return <FAQViewer content={doc.content} />;
    case "DATA":
      return <DataViewer content={doc.content} />;
    case "FUNCTION":
      return <FunctionViewer content={doc.content} />;
    case "DOCUMENT":
    case "PROCEDURE":
    case "POLICY":
    case "API_DOC":
    case "CODE":
    case "CUSTOM":
    default:
      return <ParagraphViewer content={doc.content} />;
  }
}

export function KnowledgeContentViewer({
  knowledgeId,
  title,
  knowledgeType,
}: KnowledgeContentViewerProps) {
  const [open, setOpen] = useState(false);
  const { data: doc, isLoading, error } = useKnowledge(open ? knowledgeId : undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl max-h-[85vh] p-0 gap-0 rounded-lg">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-base">{title}</DialogTitle>
            <Badge variant="outline" className="text-[10px]">
              {KNOWLEDGE_TYPE_LABEL[knowledgeType]}
            </Badge>
          </div>
          <DialogDescription>Contenido con el que está entrenado el agente.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 max-h-[calc(85vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cargando contenido...</span>
            </div>
          ) : error || !doc ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-destructive">
              <FileText className="h-8 w-8 opacity-50" />
              <span className="text-sm">No se pudo cargar el contenido.</span>
            </div>
          ) : (
            <div className="pr-4">
              <ContentRenderer doc={doc} />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
