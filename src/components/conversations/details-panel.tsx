import { Sparkles, AlertTriangle, Phone, MapPin, Clock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/status-badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { Conversation } from "@/lib/conversation-types";
import { channelIcon, channelLabel } from "@/lib/channels";
import { initials, avatarColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  conversation: Conversation;
  onTakeControl: () => void;
  onResolve: () => void;
  onDerive?: () => void;
  /** Superadmin: sin acciones operativas. */
  analysisOnly?: boolean;
}

export function ConversationDetailsPanel({
  conversation,
  onTakeControl,
  onResolve,
  analysisOnly = false,
}: Props) {
  const isChannel = conversation.source === "channel";
  const ChannelIcon = channelIcon(conversation.channelType);

  return (
    <div className="text-sm">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={cn("font-semibold", avatarColor(conversation.patientName))}>
              {initials(conversation.patientName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold truncate">{conversation.patientName}</div>
            <div className="text-xs text-muted-foreground truncate">
              {conversation.phone || conversation.externalUserId || "—"}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <StatusBadge status={conversation.status} size="xs" />
          {conversation.isWaitingHuman && (
            <span className="text-[11px] font-medium text-destructive">Esperando humano</span>
          )}
          {conversation.controlledBy === "human" && !conversation.isWaitingHuman && (
            <span className="text-[11px] font-medium text-success">Tú controlas</span>
          )}
          {!analysisOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={onResolve}
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>

      {/* Review flag — solo si existe */}
      {conversation.reviewFlag && (
        <div className="mx-4 mt-4 rounded-md border border-warning/40 bg-warning-soft/50 p-3 flex gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
          <div className="text-[12px] leading-relaxed">
            <div className="font-semibold mb-0.5">Revisar respuesta de IA</div>
            <p className="text-foreground/75">{conversation.reviewFlag.note}</p>
          </div>
        </div>
      )}

      {/* Canal y agente */}
      <CollapsibleSection
        title="Canal"
        icon={<ChannelIcon className="h-3 w-3 text-primary" />}
        defaultOpen
      >
        <ul className="space-y-2 text-[12.5px]">
          <InfoRow icon={<ChannelIcon className="h-3 w-3" />} label="Canal">
            {channelLabel(conversation.channelType, conversation.channelName)}
          </InfoRow>
          <InfoRow icon={<MapPin className="h-3 w-3" />} label="Sucursal">
            {conversation.branch || "—"}
          </InfoRow>
          {conversation.agentName && (
            <InfoRow icon={<Bot className="h-3 w-3" />} label="Agente">
              {conversation.agentName}
            </InfoRow>
          )}
          <InfoRow icon={<Clock className="h-3 w-3" />} label="Último contacto">
            {conversation.lastContact}
          </InfoRow>
          {typeof conversation.messageCount === "number" && (
            <InfoRow icon={<Sparkles className="h-3 w-3" />} label="Mensajes">
              {conversation.messageCount}
            </InfoRow>
          )}
        </ul>
      </CollapsibleSection>

      {/* Datos cliente / usuario */}
      <CollapsibleSection title="Contacto">
        <ul className="space-y-2 text-[12.5px]">
          <InfoRow icon={<Phone className="h-3 w-3" />} label="Teléfono">
            {conversation.phone || "—"}
          </InfoRow>
          <InfoRow icon={<MapPin className="h-3 w-3" />} label="Sucursal">
            {conversation.branch || "—"}
          </InfoRow>
        </ul>
      </CollapsibleSection>

      {/* Acciones */}
      {!analysisOnly && (
        <div className="p-4 border-t space-y-2">
          {isChannel && conversation.controlledBy === "ai" && (
            <Button className="w-full" size="sm" onClick={onTakeControl}>
              Tomar control
            </Button>
          )}
          <Button className="w-full" variant="outline" size="sm" onClick={onResolve}>
            Cerrar conversación
          </Button>
        </div>
      )}
      {analysisOnly && (
        <div className="p-4 border-t text-xs text-muted-foreground leading-relaxed">
          Modo análisis: sin intervención. Usá el inspector de mensajes en el chat para revisar
          RAG y tools.
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b">
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0 flex justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right truncate">{children}</span>
      </div>
    </li>
  );
}
