import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { appIconPalette, appInitials } from "@/lib/applications";
import { resolveMediaUrl } from "@/lib/mediaUrl";

function faviconFallback(src: string): string | null {
  try {
    const u = new URL(src);
    if (!/^https?:$/i.test(u.protocol)) return null;
    // Favicons rotos / hotlink bloqueado → icono del dominio.
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;
  } catch {
    return null;
  }
}

export function AppIcon({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  /** URL del logo (icon_display_url / icon_url). Si falta, iniciales. */
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const palette = appIconPalette(name);
  const primary = resolveMediaUrl(src) || (src || "").trim();
  const [phase, setPhase] = useState<"primary" | "fallback" | "done">("primary");

  useEffect(() => {
    setPhase("primary");
  }, [primary]);

  const fallback = primary ? faviconFallback(primary) : null;
  const resolved =
    phase === "fallback" ? fallback || "" : phase === "primary" ? primary : "";

  const sizeCls =
    size === "lg"
      ? "h-16 w-16 text-lg"
      : size === "sm"
        ? "h-9 w-9 text-[11px]"
        : "h-12 w-12 text-sm";

  if (resolved && phase !== "done") {
    return (
      <div
        className={cn(
          "rounded-2xl overflow-hidden shrink-0 ring-1 ring-border/60 bg-background shadow-sm",
          sizeCls,
          className,
        )}
        aria-hidden
      >
        <img
          src={resolved}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => {
            if (phase === "primary" && fallback) {
              setPhase("fallback");
              return;
            }
            setPhase("done");
          }}
        />
      </div>
    );
  }

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
