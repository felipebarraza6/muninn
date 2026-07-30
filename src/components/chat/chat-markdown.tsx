import { memo, useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Normaliza markdown típico de LLMs para que listas anidadas se vean bien.
 * Ej.: `1. **Título**: - ítem` → título + sublista en líneas separadas.
 */
export function normalizeChatMarkdown(raw: string): string {
  if (!raw) return "";
  let text = raw.replace(/\r\n/g, "\n");

  // Ítems numerados pegados al párrafo: "...texto. 1. **Foo**"
  text = text.replace(/([^\n])\s+(\d+\.\s+\*\*)/g, "$1\n$2");

  // Tras negrita con ":", forzar bullet en nueva línea
  text = text.replace(/(\*\*[^*]+\*\*\s*:)\s*([-*+])\s+/g, "$1\n   $2 ");

  // Cualquier ": - " restante
  text = text.replace(/:\s+-\s+/g, ":\n   - ");

  // Bullets hermanos en la misma línea: "control. - Promover"
  text = text.replace(/([.!?…])\s+-\s+/g, "$1\n   - ");

  return text.trim();
}

type ChatMarkdownProps = {
  content: string;
  className?: string;
  /** Burbuja con fondo primary / alto contraste (usuario). */
  inverted?: boolean;
};

function safeMarkdownHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (!trimmed) return undefined;
  // Bloquear javascript:/data: y esquemas raros; permitir http(s), mailto, anclas y relative.
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return undefined;
  }
  return trimmed;
}

function ChatMarkdownInner({ content, className, inverted = false }: ChatMarkdownProps) {
  const source = useMemo(() => normalizeChatMarkdown(content), [content]);

  if (!source) return null;

  return (
    <div
      className={cn(
        "chat-md break-words text-sm leading-relaxed",
        inverted ? "chat-md--inverted" : "chat-md--default",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="chat-md__p">{children}</p>,
          ul: ({ children }) => <ul className="chat-md__ul">{children}</ul>,
          ol: ({ children }) => <ol className="chat-md__ol">{children}</ol>,
          li: ({ children }) => <li className="chat-md__li">{children}</li>,
          strong: ({ children }) => <strong className="chat-md__strong">{children}</strong>,
          em: ({ children }) => <em className="chat-md__em">{children}</em>,
          a: ({ href, children }) => {
            const safeHref = safeMarkdownHref(href);
            if (!safeHref) {
              return <span className="chat-md__a">{children}</span>;
            }
            return (
              <a href={safeHref} target="_blank" rel="noopener noreferrer" className="chat-md__a">
                {children}
              </a>
            );
          },
          code: ({ className: codeClass, children, ...props }) => {
            const isBlock = Boolean(codeClass?.includes("language-"));
            if (isBlock) {
              return (
                <code className={cn("chat-md__code-block", codeClass)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="chat-md__code" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="chat-md__pre">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="chat-md__blockquote">{children}</blockquote>
          ),
          h1: ({ children }) => <p className="chat-md__heading">{children}</p>,
          h2: ({ children }) => <p className="chat-md__heading">{children}</p>,
          h3: ({ children }) => <p className="chat-md__heading">{children}</p>,
          h4: ({ children }) => <p className="chat-md__heading">{children}</p>,
          hr: () => <hr className="chat-md__hr" />,
          table: ({ children }) => (
            <div className="chat-md__table-wrap">
              <table className="chat-md__table">{children}</table>
            </div>
          ),
          th: (props: ComponentPropsWithoutRef<"th">) => <th className="chat-md__th" {...props} />,
          td: (props: ComponentPropsWithoutRef<"td">) => <td className="chat-md__td" {...props} />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

export const ChatMarkdown = memo(ChatMarkdownInner);
