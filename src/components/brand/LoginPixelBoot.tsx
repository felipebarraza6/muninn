import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import { PixelRaven } from "@/components/brand/PixelRaven";
import { cn } from "@/lib/utils";

type PixelBootProps = {
  centered?: boolean;
  className?: string;
  label?: string;
};

/** Cuervo + barra a pasos — boot compartido (Suspense + landing). */
export function PixelBoot({ centered, className, label = "Cargando harness…" }: PixelBootProps) {
  return (
    <div
      className={cn("pixel-boot", centered && "mx-auto items-center", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className={cn("flex items-end gap-3", centered && "justify-center")}>
        <PixelRaven featured className="h-12 w-14 sm:h-14 sm:w-16" />
        <p className="pixel-font text-[1.3rem] text-foreground sm:text-[1.55rem]">MUNINN</p>
      </div>
      <div className="pixel-boot__bar" aria-hidden>
        <span />
      </div>
      <p className="pixel-boot__label">{label}</p>
    </div>
  );
}

/** Fallback Suspense de /login: misma atmósfera pixel, sin skeleton-bone. */
export function LoginPixelBootScreen() {
  return (
    <div className="login-pixel relative min-h-dvh overflow-hidden bg-background">
      <LoginAtmosphere intensity="full" variant="pixel" />
      <div className="relative z-[1] flex min-h-dvh items-center justify-center px-6">
        <PixelBoot centered />
      </div>
    </div>
  );
}
