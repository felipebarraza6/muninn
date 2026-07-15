import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/api/hooks/useAuth";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";

export default function Login() {
  const navigate = useNavigate();
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const slug = slugParam || searchParams.get("slug") || undefined;

  const {
    data: publicTheme,
    flat,
    scope,
    isAppDefault,
    stores,
    isLoading: themeLoading,
  } = useResolvePublicLoginTheme(slug);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  const errorMessage = login.error
    ? (login.error as { friendlyMessage?: string }).friendlyMessage || "Error al iniciar sesión"
    : null;

  const branchLogo = resolveThemeLogo(publicTheme);
  const brandLabel = useMemo(() => {
    if (isAppDefault) return undefined;
    return (
      flat?.app_name ||
      flat?.organization_name ||
      flat?.branch_name ||
      publicTheme?.app_name ||
      undefined
    );
  }, [isAppDefault, flat, publicTheme?.app_name]);

  const subtitle =
    flat?.login_subtitle ||
    flat?.subtitle ||
    flat?.login_welcome_message ||
    flat?.welcome_message ||
    publicTheme?.login_subtitle ||
    publicTheme?.subtitle ||
    publicTheme?.login_welcome_message ||
    publicTheme?.welcome_message ||
    (isAppDefault
      ? "Accede a tu panel de agentes"
      : scope === "organization"
        ? "Portal de organización — elige tu sucursal tras entrar"
        : "Accede a tu panel");

  const showPortalHint = !isAppDefault && (scope === "organization" || scope === "branch");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm border border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-5 text-center">
          <div className="flex justify-center">
            {themeLoading ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <MuninnBrand
                branchLabel={brandLabel}
                tagline={flat?.tagline || publicTheme?.tagline || undefined}
                branchLogoUrl={isAppDefault ? null : branchLogo}
                className="justify-center scale-110"
              />
            )}
          </div>
          <div className="space-y-2">
            <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
            {showPortalHint && (
              <div className="flex justify-center gap-1.5 flex-wrap">
                {scope === "organization" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Organización
                  </Badge>
                )}
                {scope === "branch" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Sucursal
                  </Badge>
                )}
                {flat?.fallback_from_branch_slug && (
                  <Badge variant="outline" className="text-[10px]">
                    Branding org
                  </Badge>
                )}
              </div>
            )}
            {scope === "organization" && stores.length > 0 && (
              <p className="text-[11px] text-muted-foreground">
                {stores.length} sucursal{stores.length === 1 ? "" : "es"} en este portal
              </p>
            )}
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary-deep transition-colors"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando…
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-6 text-[10px] uppercase tracking-wider text-muted-foreground/70">
        Powered by felipebarraza6
      </p>
    </div>
  );
}
