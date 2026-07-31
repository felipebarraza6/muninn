import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Loader2, Plus, Play, Radio, Bot } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useChannels, useTestChannel, type Channel } from "@/api/hooks/useChannels";
import { ChannelForm } from "@/components/channels/channel-form";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { channelAccent, channelIcon, channelLabel, formatChannelTestToast } from "@/lib/channels";
import { canManageChannels } from "@/lib/authGuards";
import { cn } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiError";
import { toast } from "sonner";

export function ChannelList() {
  const navigate = useNavigate();
  const { data: channels = [], isPending, isFetching, isPlaceholderData, refetch } = useChannels();
  const testConnection = useTestChannel();
  const [creating, setCreating] = useState(false);
  const [testingId, setTestingId] = useState<string | number | null>(null);
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);
  const canManage = canManageChannels();
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!isPending) setReady(true);
  }, [isPending]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = !term
      ? channels
      : channels.filter((c) => {
          const hay = [
            c.name,
            c.channel_type,
            c.provider,
            c.assigned_agent_name,
            channelLabel(c.channel_type),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(term);
        });
    return [...list].sort((a, b) => {
      const aActive = a.is_active !== false ? 0 : 1;
      const bActive = b.is_active !== false ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return (a.name || "").localeCompare(b.name || "", "es");
    });
  }, [channels, q]);

  const stats = useMemo(() => {
    const active = channels.filter((c) => c.is_active).length;
    const verified = channels.filter((c) => c.is_verified).length;
    return { total: channels.length, active, verified };
  }, [channels]);

  const handleTest = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    e.stopPropagation();
    setTestingId(channel.id);
    testConnection.mutate(
      { id: channel.id },
      {
        onSuccess: (result) => {
          const msg = formatChannelTestToast(result);
          if (result.ok) toast.success(msg.title, { description: msg.description });
          else toast.error(msg.title, { description: msg.description });
          refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "Error al probar conexión")),
        onSettled: () => setTestingId(null),
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            Conecta WhatsApp, Telegram, web y más a tus agentes. Un canal = un puente con clientes.
          </p>
          {!isPending && channels.length > 0 && (
            <p className="text-[11px] text-muted-foreground/80 tabular-nums">
              {stats.active} activos · {stats.verified} verificados · {stats.total} en total
            </p>
          )}
        </div>
        {canManage && (
          <Button
            size="sm"
            onClick={() => setCreating(true)}
            className="self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo canal
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por nombre, tipo, proveedor o agente…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      <AnimatePresence mode="wait">
        {isPending && !ready ? (
          <motion.div
            key="skeleton"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.base }}
          >
            <PageSkeleton variant="cards" padded={false} />
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.base }}
            className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Radio className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {q.trim()
                ? "Sin canales para esa búsqueda."
                : "No hay canales aún. Crea el primero para conectar un agente."}
            </p>
            {!q.trim() && canManage && (
              <Button size="sm" className="mt-4" onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Crear canal
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: {},
                    show: { transition: { staggerChildren: motionTokens.stagger } },
                  }
            }
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",
              (isFetching || isPlaceholderData) && "opacity-70",
            )}
          >
            {filtered.map((channel) => (
              <motion.div
                key={channel.id}
                variants={
                  reduceMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { duration: motionTokens.card } },
                      }
                }
              >
                <ChannelCard
                  channel={channel}
                  testing={testingId === channel.id}
                  onTest={(e) => handleTest(e, channel)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {canManage && (
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo canal</DialogTitle>
            </DialogHeader>
            <ChannelForm
              bare
              onCancel={() => setCreating(false)}
              onSaved={(created) => {
                setCreating(false);
                refetch();
                if (created?.id) navigate(`/app/canales/${created.id}`);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ChannelCard({
  channel,
  testing,
  onTest,
}: {
  channel: Channel;
  testing: boolean;
  onTest: (e: React.MouseEvent) => void;
}) {
  const accent = channelAccent(channel.channel_type);
  const Icon = channelIcon(channel.channel_type);
  const isInactive = channel.is_active === false;
  const typeLabel = channelLabel(channel.channel_type);

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
        isInactive
          ? "border-border/40 bg-muted/40 text-muted-foreground grayscale-[0.35] opacity-80 hover:opacity-95 hover:bg-muted/50"
          : cn(
              "border-border/60 bg-card/50",
              "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg",
              accent.glow,
            ),
      )}
    >
      {!isInactive && <div className={cn("h-1 w-full bg-gradient-to-r", accent.bar)} />}

      <Link
        to={`/app/canales/${channel.id}`}
        className="flex flex-1 flex-col gap-4 p-4 sm:p-5 pb-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
              isInactive ? "bg-muted text-muted-foreground ring-border/60" : accent.avatar,
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            {isInactive ? (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/45 ring-2 ring-muted" />
            ) : channel.is_verified ? (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-card" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-semibold text-[15px] leading-snug truncate transition-colors",
                  isInactive ? "text-muted-foreground" : "group-hover:text-primary",
                )}
              >
                {channel.name}
              </h3>
              <ArrowUpRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-all",
                  isInactive
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                )}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] h-5 font-normal">
                {typeLabel}
              </Badge>
              {isInactive && (
                <Badge variant="secondary" className="text-[10px] h-5">
                  Inactivo
                </Badge>
              )}
              {!isInactive && channel.is_verified && (
                <Badge className="text-[10px] h-5 gap-0.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15">
                  <CheckCircle2 className="h-3 w-3" />
                  Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-1 gap-2 text-[12px]">
          <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
            <Radio className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">{channel.provider?.trim() || "Sin proveedor"}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
            <Bot className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate">
              {channel.assigned_agent_name?.trim() || "Sin agente asignado"}
            </span>
          </div>
        </dl>
      </Link>

      <div className="flex items-center justify-end gap-1 border-t border-border/50 px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          disabled={testing}
          onClick={onTest}
        >
          {testing ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 mr-1.5" />
          )}
          Probar
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs" asChild>
          <Link to={`/app/canales/${channel.id}`}>Abrir</Link>
        </Button>
      </div>
    </div>
  );
}
