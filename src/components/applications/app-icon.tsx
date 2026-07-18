import { cn } from "@/lib/utils";
import { appIconPalette, appInitials } from "@/lib/applications";

export function AppIcon({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const palette = appIconPalette(name);
  const sizeCls =
    size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-9 w-9 text-[11px]" : "h-12 w-12 text-sm";

  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 font-semibold tracking-tight ring-1 shadow-sm",
        sizeCls,
        palette.from,
        palette.to,
        palette.text,
        palette.ring,
        className,
      )}
      aria-hidden
    >
      {appInitials(name)}
    </div>
  );
}
