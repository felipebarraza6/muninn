import { forwardRef, type FormEvent, type KeyboardEvent, type ReactNode, useCallback } from "react";
import { Loader2, Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  busy?: boolean;
  /** Cuando hay stream activo, muestra Detener en lugar de enviar. */
  canStop?: boolean;
  onStop?: () => void;
  /** Permite enviar sin texto (p. ej. solo skills adjuntas). */
  canSubmit?: boolean;
  className?: string;
  /** Contenido encima del campo (reply chip, skills, etc.). */
  leading?: ReactNode;
  onCursorChange?: (cursor: number) => void;
  /** Extra class en el textarea. */
  textareaClassName?: string;
};

/** Composer multilínea compartido: Enter envía, Shift+Enter salto. */
export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(function ChatComposer(
  {
    value,
    onChange,
    onSubmit,
    placeholder = "Escribe un mensaje…",
    disabled = false,
    busy = false,
    canStop = false,
    onStop,
    canSubmit,
    className,
    leading,
    onCursorChange,
    textareaClassName,
  },
  ref,
) {
  const hasContent = Boolean(value.trim()) || canSubmit === true;
  const submit = useCallback(() => {
    if (disabled || busy || canStop) return;
    if (!hasContent) return;
    onSubmit();
  }, [busy, canStop, disabled, hasContent, onSubmit]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onForm = (e: FormEvent) => {
    e.preventDefault();
    if (canStop && onStop) {
      onStop();
      return;
    }
    submit();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {leading}
      <form
        onSubmit={onForm}
        className="flex items-end gap-2 rounded-2xl bg-muted/60 border border-border/50 px-2 py-2 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/25 focus-within:bg-muted"
      >
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onCursorChange?.(e.target.selectionStart ?? e.target.value.length);
          }}
          onSelect={(e) => {
            const t = e.currentTarget;
            onCursorChange?.(t.selectionStart ?? t.value.length);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled || (busy && !canStop)}
          rows={1}
          className={cn(
            "min-h-[40px] max-h-36 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-sm",
            textareaClassName,
          )}
        />
        {canStop && onStop ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shrink-0"
            onClick={onStop}
            title="Detener respuesta"
            aria-label="Detener respuesta"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            disabled={disabled || busy || !hasContent}
            aria-label="Enviar"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        )}
      </form>
    </div>
  );
});
