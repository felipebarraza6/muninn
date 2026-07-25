import { PixelRaven } from "@/components/brand/PixelRaven";
import { cn } from "@/lib/utils";

/** Lockup Muninn pixel para forgot / reset (mismo lenguaje que login). */
export function AuthPixelBrand({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 text-center", className)}>
      <div className="inline-flex flex-col items-center gap-3">
        <div className="flex items-end justify-center gap-3">
          <PixelRaven featured className="h-11 w-12 sm:h-12 sm:w-14" />
          <p className="pixel-font text-[1.2rem] text-foreground sm:text-[1.4rem]">MUNINN</p>
        </div>
        <div className="space-y-2">
          <h1 className="pixel-font text-[12px] uppercase leading-relaxed text-foreground sm:text-[13px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="pixel-display mx-auto max-w-[18rem] text-[13px] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
