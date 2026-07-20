import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/api/hooks/useAuth";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { LoginSocialLinks } from "@/components/brand/LoginSocialLinks";

const GITHUB_CREDIT_URL = "https://github.com/felipebarraza6";
const GITHUB_CREDIT_LABEL = "felipebarraza6";

export default function Login() {
  const navigate = useNavigate();
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const slug = slugParam || searchParams.get("slug") || undefined;

  const { flat, scope, isAppDefault, isLoading: themeLoading } = useResolvePublicLoginTheme(slug);

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

  // Logo + colores vienen del flat (theme real de la sucursal/org)
  const branchLogo = resolveThemeLogo(flat);
  const fantasyName = flat?.fantasy_name?.trim() || null;
  const appName = flat?.app_name?.trim() || null;
  const brandTitle = useMemo(() => {
    if (isAppDefault) return undefined;
    if (scope === "branch") {
      return fantasyName || flat?.branch_name || appName || undefined;
    }
    // Portal organización
    return appName || flat?.organization_name || undefined;
  }, [isAppDefault, scope, fantasyName, flat?.branch_name, flat?.organization_name, appName]);

  // Portal organización: solo logo + nombre (sin tagline / subtítulos).
  const isOrgPortal = scope === "organization" && !flat?.branch_id;
  const isBranchLogin = scope === "branch" && Boolean(flat?.branch_id);

  const brandSubtitle = useMemo(() => {
    if (isAppDefault || isOrgPortal) return undefined;
    if (scope === "branch") {
      // Abajo del nombre fantasía: app_name (si es distinto)
      if (appName && appName !== brandTitle) return appName;
      return flat?.tagline || undefined;
    }
    return flat?.tagline || undefined;
  }, [isAppDefault, isOrgPortal, scope, appName, brandTitle, flat?.tagline]);

  const subtitle = isOrgPortal
    ? null
    : flat?.login_subtitle ||
      flat?.subtitle ||
      flat?.login_welcome_message ||
      flat?.welcome_message ||
      (isAppDefault ? "Accede a tu panel de agentes" : "Accede a tu panel");

  const organizationLogo = resolveMediaUrl(flat?.organization_logo_url) || null;
  // Crédito del holding solo en login de sucursal (en portal org el logo ya está arriba).
  const hasOrganizationLogo = Boolean(organizationLogo) && isBranchLogin;
  const orgName = flat?.organization_name?.trim() || null;

  // Sucursal → Powered by organización. Portal org / Muninn → GitHub.
  const showGithubCredit = !isBranchLogin;

  const socialLinks = !isAppDefault ? (flat?.social_links ?? []) : [];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm border border-border/50 bg-card/80 backdrop-blur">
        <CardHeader
          className={isOrgPortal ? "space-y-0 pb-2 text-center" : "space-y-5 text-center"}
        >
          <div className="flex justify-center">
            {themeLoading ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <MuninnBrand
                branchLabel={brandTitle}
                appName={brandSubtitle}
                branchLogoUrl={isAppDefault ? null : branchLogo}
                layout={isOrgPortal ? "stacked" : "horizontal"}
                className={isOrgPortal ? "justify-center" : "justify-center scale-110"}
              />
            )}
          </div>
          {!isOrgPortal && subtitle && (
            <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
          )}
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

      {socialLinks.length > 0 && <LoginSocialLinks links={socialLinks} className="mt-5" />}

      {!isOrgPortal && (
        <div className="mt-6 flex flex-col items-center gap-2">
          {hasOrganizationLogo && (
            <img
              src={organizationLogo!}
              alt={orgName || "Organización"}
              className="h-7 max-w-[140px] object-contain opacity-80"
            />
          )}
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Powered by{" "}
            {showGithubCredit ? (
              <a
                href={GITHUB_CREDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {GITHUB_CREDIT_LABEL}
              </a>
            ) : (
              orgName || "Muninn"
            )}
          </p>
        </div>
      )}
    </div>
  );
}
