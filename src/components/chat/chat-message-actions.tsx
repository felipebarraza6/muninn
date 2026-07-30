import type { ReactNode } from "react";
import { CornerUpLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";

type ChatMessageActionsProps = {
  text: string;
  align?: "start" | "end";
  onReply?: () => void;
  onResend?: () => void;
  className?: string;
};

function ActionIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-opacity transition-colors hover:bg-muted hover:text-foreground",
        "opacity-60 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      {children}
    </button>
  );
}

/** Acciones bajo cada burbuja: copiar, responder, reenviar. */
export function ChatMessageActions({
  text,
  align = "start",
  onReply,
  onResend,
  className,
}: ChatMessageActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        align === "end" ? "justify-end" : "justify-start",
        className,
      )}
    >
      <ChatCopyButton text={text} />
      {onReply && (
        <ActionIconButton label="Responder" onClick={onReply}>
          <CornerUpLeft className="h-3 w-3" />
        </ActionIconButton>
      )}
      {onResend && (
        <ActionIconButton label="Reenviar" onClick={onResend}>
          <RotateCcw className="h-3 w-3" />
        </ActionIconButton>
      )}
    </div>
  );
}
