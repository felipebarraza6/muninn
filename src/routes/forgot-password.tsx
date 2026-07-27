import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForgotPassword } from "@/api/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { AuthPixelBrand } from "@/components/auth/AuthPixelBrand";
import {
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
} from "@/components/auth/auth-form-styles";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

function loginPath(slug?: string | null, isAppDefault = false) {
  if (slug) return `/${encodeURIComponent(slug)}`;
  return isAppDefault ? "/entrar" : "/";
}

/** Solicitar email de recuperación (público). */
export default function ForgotPasswordPage() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const slug = slugParam || searchParams.get("slug") || undefined;
  const navigate = useNavigate();
  const reduceMotion = useMotionPrefs();

  const { flat, isAppDefault, isLoading: themeLoading } = useResolvePublicLoginTheme(slug);
  const pixel = isAppDefault;
  const brandTitle =
    flat?.app_name?.trim() ||
    flat?.fantasy_name?.trim() ||
    flat?.organization_name?.trim() ||
    "Muninn";
  const brandLogo =
    resolveThemeLogo(flat) ||
    resolveMediaUrl(flat?.organization_logo_url) ||
    resolveMediaUrl(flat?.logo_url) ||
    null;

  const [email, setEmail] = useState("");
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const forgot = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDoneMessage(null);
    forgot.mutate(
      {
        email,
        login_slug: flat?.login_slug || slug || null,
        branch_id: flat?.branch_id != null ? Number(flat.branch_id) : null,
      },
      {
        onSuccess: (data) => {
          setDoneMessage(
            data.message ||
              "Si el email existe, recibirás instrucciones para recuperar tu contraseña.",
          );
        },
        onError: (err) => {
          const msg =
            (err as { friendlyMessage?: string }).friendlyMessage ||
            (err as { message?: string }).message ||
            "No se pudo enviar el correo. Intenta de nuevo.";
          setErrorMessage(msg);
        },
      },
    );
  };

  return (
    <div
      className={cn("relative min-h-screen overflow-hidden bg-background", pixel && "login-pixel")}
    >
      <LoginAtmosphere intensity={pixel ? "full" : "soft"} variant={pixel ? "pixel" : "aurora"} />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-[1] flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          className={cn("w-full max-w-sm space-y-6", pixel && "pixel-enter")}
          style={
            pixel && !reduceMotion
              ? ({ "--pixel-delay": "80ms" } as React.CSSProperties)
              : undefined
          }
          initial={pixel || reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: motionTokens.slow,
            ease: motionTokens.easeOut,
          }}
        >
          {pixel ? (
            <AuthPixelBrand
              title="Recuperar contraseña"
              subtitle="Te enviamos un enlace al correo para recuperar tu acceso."
            />
          ) : (
            <div className="space-y-3 text-center">
              {themeLoading ? (
                <MuninnBrand pending layout="horizontal" className="justify-center scale-110" />
              ) : (
                <MuninnBrand
                  branchLabel={brandTitle}
                  branchLogoUrl={brandLogo}
                  layout="horizontal"
                  className="justify-center scale-110"
                />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">
                Recupera tu acceso. Te enviamos un enlace al correo.
              </p>
            </div>
          )}

          {doneMessage ? (
            <AuthFormShell className="space-y-4">
              <div aria-live="polite">
                <Alert className="border-primary/25 bg-primary/10">
                  <AlertDescription
                    className={pixel ? "pixel-display text-[13px] leading-relaxed" : undefined}
                  >
                    {doneMessage}
                  </AlertDescription>
                </Alert>
              </div>
              <Button
                type="button"
                variant={pixel ? "default" : "outline"}
                className={cn(pixel ? authPrimaryBtnClass : "h-11 w-full")}
                onClick={() => navigate(loginPath(slug, pixel))}
              >
                Volver al login
              </Button>
            </AuthFormShell>
          ) : (
            <AuthFormShell as="form" onSubmit={handleSubmit} className="space-y-5">
              <div aria-live="polite" aria-atomic="true">
                {errorMessage ? (
                  <Alert
                    variant="destructive"
                    className="mb-1 border-destructive/30 bg-destructive/10"
                  >
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className={authLabelClass}>
                  Correo electrónico
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  className={authInputClass}
                />
              </div>
              <Button type="submit" className={cn(authPrimaryBtnClass)} disabled={forgot.isPending}>
                {forgot.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Enviando…
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </Button>
              <p
                className={cn(
                  "text-center text-muted-foreground",
                  pixel ? "pixel-font text-[8px] uppercase" : "text-sm",
                )}
              >
                <Link
                  to={loginPath(slug, pixel)}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Volver al login
                </Link>
              </p>
            </AuthFormShell>
          )}
        </motion.div>
      </div>
    </div>
  );
}
