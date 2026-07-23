import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type AdminOwnerTab = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

type SharedProps = {
  title: string;
  subtitle?: ReactNode;
  tabs: AdminOwnerTab[];
  tab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

type OwnerExtras = {
  meta?: ReactNode;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  accentColor?: string | null;
  initial?: string;
  active?: boolean | null;
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** Owner: franja compacta (logo + nombre + badge) + tabs. Sin banner ni subtítulos. */
export function AdminOwnerSettingsShell({
  title,
  logoUrl,
  accentColor,
  initial,
  active,
  tabs,
  tab,
  onTabChange,
  children,
  footer,
  onRefresh,
  refreshing,
  className,
}: SharedProps & OwnerExtras) {
  const letter = (initial || title || "?").trim().charAt(0).toUpperCase() || "?";
  const accent = accentColor?.trim() || "#2dd4bf";

  return (
    <div className={cn("w-full max-w-5xl mx-auto space-y-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40 text-sm font-semibold text-muted-foreground"
            style={{ boxShadow: `inset 0 0 0 1.5px ${accent}66` }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <span aria-hidden>{letter}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h1>
            {active != null ? (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  active
                    ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {active ? "Activa" : "Inactiva"}
              </Badge>
            ) : null}
          </div>
        </div>
        {onRefresh ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0"
            onClick={onRefresh}
            disabled={refreshing}
            title="Actualizar"
            aria-label="Actualizar"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        ) : null}
      </div>

      <Tabs value={tab} onValueChange={onTabChange} className="space-y-5">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="gap-1.5 px-3 py-1.5">
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden /> : null}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div
          className={cn(
            "min-w-0 space-y-6 pb-4",
            "[&_h3]:text-sm [&_h3]:font-medium [&_h3]:normal-case [&_h3]:tracking-normal [&_h3]:text-foreground",
            "[&_section]:space-y-3",
          )}
        >
          {children}
        </div>
      </Tabs>

      <div className="sticky bottom-0 z-10 border-t border-border/70 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-wrap items-center justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}

/** Tabs compactos para el panel lateral (modo lista + edición). */
export function AdminPanelTabs({
  tabs,
  value,
  onValueChange,
  className,
}: {
  tabs: AdminOwnerTab[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-0.5 bg-muted/40 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <TabsTrigger key={id} value={id} className="gap-1 px-2.5 py-1.5 text-xs">
            {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden /> : null}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

/** Admin multi: formulario a pantalla completa (lista XOR form), con Volver (+ tabs opcionales). */
export function AdminMultiEditShell({
  tabs,
  tab,
  onTabChange,
  children,
  footer,
  onBack,
  hint,
  className,
}: {
  tabs?: AdminOwnerTab[];
  tab?: string;
  onTabChange?: (id: string) => void;
  children: ReactNode;
  footer: ReactNode;
  onBack: () => void;
  hint?: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const showTabs = Boolean(tabs?.length && tab != null && onTabChange);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-4xl space-y-5", className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 h-8 gap-1 text-muted-foreground"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Button>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>

      {showTabs ? <AdminPanelTabs tabs={tabs!} value={tab!} onValueChange={onTabChange!} /> : null}

      <div className="space-y-5 min-w-0">{children}</div>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap gap-2 border-t border-border/70 bg-background/95 px-1 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {footer}
      </div>
    </motion.div>
  );
}

/**
 * Chrome unificado: settings (owner) o formulario full-page (admin multi).
 * El formulario se pasa como children una sola vez.
 */
export function AdminEntityEditChrome({
  mode,
  panelKey: _panelKey,
  title,
  subtitle,
  meta,
  tabs,
  tab,
  onTabChange,
  children,
  footer,
  onClose,
  logoUrl,
  bannerUrl,
  accentColor,
  initial,
  active,
  onRefresh,
  refreshing,
  formHint,
}: SharedProps &
  OwnerExtras & {
    mode: "owner" | "form";
    panelKey: string;
    onClose?: () => void;
    formHint?: ReactNode;
  }) {
  if (mode === "owner") {
    return (
      <AdminOwnerSettingsShell
        title={title}
        subtitle={subtitle}
        meta={meta}
        tabs={tabs}
        tab={tab}
        onTabChange={onTabChange}
        footer={footer}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        accentColor={accentColor}
        initial={initial}
        active={active}
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        {children}
      </AdminOwnerSettingsShell>
    );
  }

  return (
    <AdminMultiEditShell
      tabs={tabs}
      tab={tab}
      onTabChange={onTabChange}
      footer={footer}
      onBack={onClose ?? (() => undefined)}
      hint={formHint ?? subtitle}
    >
      {children}
    </AdminMultiEditShell>
  );
}

export function AdminSaveButton({
  onClick,
  disabled,
  pending,
  label = "Guardar",
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  pending?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <Button className={className} onClick={onClick} disabled={disabled || pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {label}
    </Button>
  );
}
