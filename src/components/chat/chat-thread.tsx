import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Ref callback for sticky-scroll viewport binding. */
  viewportRef?: (node: HTMLElement | null) => void;
  endRef?: React.RefObject<HTMLDivElement | null>;
  showJump?: boolean;
  onJump?: () => void;
  /** Contenido al pie del hilo (processing indicator, etc.). */
  footer?: ReactNode;
};

/**
 * Contenedor compartido de hilo de mensajes (Studio / Inbox).
 * No impone modelo de mensaje — solo scroll + jump.
 */
export function ChatThread({
  children,
  className,
  contentClassName,
  viewportRef,
  endRef,
  showJump,
  onJump,
  footer,
}: Props) {
  return (
    <div className={cn("relative flex-1 min-h-0", className)}>
      <ScrollArea className="h-full" viewportRef={viewportRef}>
        <div className={cn("px-4 py-4 space-y-3 max-w-3xl mx-auto", contentClassName)}>
          {children}
          {footer}
          <div ref={endRef} />
        </div>
      </ScrollArea>
      {showJump && onJump ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 h-8 gap-1 shadow-md z-10"
          onClick={onJump}
        >
          <ChevronDown className="h-3.5 w-3.5" />
          Bajar
        </Button>
      ) : null}
    </div>
  );
}
