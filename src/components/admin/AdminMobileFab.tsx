import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type AdminMobileFabAction = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
  spinning?: boolean;
};

type AdminMobileFabProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visible?: boolean;
  actions: AdminMobileFabAction[];
  className?: string;
};

/** FAB móvil (md:hidden) con menú de acciones. */
export function AdminMobileFab({
  open,
  onOpenChange,
  visible = true,
  actions,
  className,
}: AdminMobileFabProps) {
  const reduceMotion = useReducedMotion();

  return (
    <TooltipProvider delayDuration={200}>
      <AnimatePresence>
        {visible ? (
          <motion.div
            className={cn(
              "fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 md:hidden",
              className,
            )}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: motionTokens.fast }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: motionTokens.fast }}
                  className="mb-1 flex flex-col items-end gap-2"
                >
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Tooltip key={action.label}>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant={action.variant ?? "secondary"}
                            className={cn("h-10 w-10 rounded-full shadow-md", action.className)}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            aria-label={action.label}
                          >
                            <Icon className={cn("h-4 w-4", action.spinning && "animate-spin")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">{action.label}</TooltipContent>
                      </Tooltip>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={() => onOpenChange(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </TooltipProvider>
  );
}
