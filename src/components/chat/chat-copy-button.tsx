import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ChatCopyButtonProps = {
  text: string;
  className?: string;
  /** Más visible (p. ej. siempre en móvil). */
  alwaysVisible?: boolean;
};

export function ChatCopyButton({ text, className, alwaysVisible = false }: ChatCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const handleCopy = async () => {
    const value = text.trim();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Mensaje copiado");
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copiado" : "Copiar mensaje"}
      aria-label={copied ? "Copiado" : "Copiar mensaje"}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-opacity transition-colors hover:bg-muted hover:text-foreground",
        !alwaysVisible &&
          "opacity-60 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100",
        copied && "opacity-100 text-primary",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
