import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "@/api/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";

function loginPath(slug?: string | null) {
  return slug ? `/login/${encodeURIComponent(slug)}` : "/login";
}

/** Solicitar email de recuperación (público). */
export default function ForgotPasswordPage() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const slug = slugParam || searchParams.get("slug") || undefined;
  const navigate = useNavigate();

  const { flat, isLoading: themeLoading } = useResolvePublicLoginTheme(slug);
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
        branch_id: flat?.branch_id ?? null,
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
            "No se pudo enviar el correo. Intentá de nuevo.";
          setErrorMessage(msg);
        },
      },
    );
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6">
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
            <p className="text-sm text-muted-foreground">
              Recuperá tu acceso. Te enviamos un enlace al correo.
            </p>
          </div>

          {doneMessage ? (
            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur sm:p-6">
              <Alert className="border-primary/25 bg-primary/10">
                <AlertDescription>{doneMessage}</AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate(loginPath(slug))}
              >
                Volver al login
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur sm:p-6 space-y-5 shadow-sm"
            >
              {errorMessage && (
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="forgot-email"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
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
                  className="bg-secondary border-border/50"
                />
              </div>
              <Button type="submit" className="w-full" disabled={forgot.isPending}>
                {forgot.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link to={loginPath(slug)} className="text-primary hover:underline">
                  Volver al login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
