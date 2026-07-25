import { cn } from "@/lib/utils";

/** Clases compartidas del form de auth (login / forgot / reset). */
export const authLabelClass =
  "text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground";

export const authInputClass =
  "h-11 bg-secondary/80 border-border/40 text-foreground placeholder:text-muted-foreground/45 focus-visible:border-primary/40 focus-visible:ring-primary/35";

export const authPrimaryBtnClass =
  "h-11 w-full bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-deep hover:shadow-md hover:shadow-primary/25 active:scale-[0.99] disabled:active:scale-100";

export function authShellClass(className?: string) {
  return cn(
    "space-y-5 rounded-2xl border border-border/50 bg-card/75 p-5 shadow-lg shadow-primary/5 backdrop-blur-xl sm:p-6 dark:bg-card/65 dark:border-border/45",
    className,
  );
}
