import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Fila con overflow horizontal y flechas en los extremos. */
export function HorizontalScrollStrip({
  children,
  className,
  contentClassName,
  step = 220,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  step?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update, children]);

  const scroll = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={cn("relative flex items-center gap-1 min-w-0", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 shrink-0 rounded-full border border-border/60 bg-background/80",
          !canLeft && "opacity-35 pointer-events-none",
        )}
        disabled={!canLeft}
        onClick={() => scroll(-1)}
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div
        ref={scrollerRef}
        className={cn(
          "flex-1 min-w-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          contentClassName,
        )}
      >
        <div className="flex w-max items-center gap-1.5 py-0.5">{children}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 shrink-0 rounded-full border border-border/60 bg-background/80",
          !canRight && "opacity-35 pointer-events-none",
        )}
        disabled={!canRight}
        onClick={() => scroll(1)}
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
