import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/api/hooks/useAuth";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { LoginSocialLinks } from "@/components/brand/LoginSocialLinks";
import { LoginLandingPanel } from "@/components/brand/LoginLandingPanel";
import { OrgLoginLanding } from "@/components/brand/OrgLoginLanding";
import { LOGIN_LANDING_TAGLINE } from "@/lib/loginLanding";
import type { PublicAvailableApp } from "@/lib/publicLoginTheme";
import { cn } from "@/lib/utils";

const GITHUB_CREDIT_URL = "https://github.com/felipebarraza6";
const GITHUB_CREDIT_LABEL = "felipebarraza6";

function LoginForm({
  email,
  password,
  onEmail,
  onPassword,
  onSubmit,
  errorMessage,
  pending,
  forgotPasswordTo,
}: {
  email: string;
  password: string;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage: string | null;
  pending: boolean;
  forgotPasswordTo?: string;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-card/80 p-5 backdrop-blur sm:p-6 space-y-5 shadow-sm"
    >
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
          onChange={(e) => onEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label
            htmlFor="password"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Contraseña
          </Label>
          {forgotPasswordTo ? (
            <Link
              to={forgotPasswordTo}
              className="text-[11px] font-medium text-primary hover:underline underline-offset-2"
            >
              Recuperar contraseña
            </Link>
          ) : null}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary-deep transition-colors"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}

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

  const branchLogo = resolveThemeLogo(flat);
  const fantasyName = flat?.fantasy_name?.trim() || null;
  const appName = flat?.app_name?.trim() || null;
  const orgName = flat?.organization_name?.trim() || null;
  const brandTitle = useMemo(() => {
    if (isAppDefault) return undefined;
    if (scope === "branch") {
      return fantasyName || flat?.branch_name || appName || undefined;
    }
    // Login org: nombre de la organización (no app_name / nombre de menú).
    return orgName || undefined;
  }, [isAppDefault, scope, fantasyName, flat?.branch_name, orgName, appName]);

  // Org portal: branding de organización (con o sin branch_id heredado).
  // p.ej. /login/smart-hydro puede resolver org + branch_id de una store.
  const isOrgPortal = scope === "organization";
  const isBranchLogin = scope === "branch" && Boolean(flat?.branch_id);
  /** Pitch de producto Muninn: solo login base, nunca org/sucursal. */
  const showMuninnLanding = isAppDefault;

  const brandSubtitle = useMemo(() => {
    if (isAppDefault || isOrgPortal) return undefined;
    if (scope === "branch") {
      if (appName && appName !== brandTitle) return appName;
      return flat?.tagline || undefined;
    }
    return flat?.tagline || undefined;
  }, [isAppDefault, isOrgPortal, scope, appName, brandTitle, flat?.tagline]);

  const formHint = isOrgPortal
    ? null
    : flat?.login_subtitle ||
      flat?.subtitle ||
      flat?.login_welcome_message ||
      flat?.welcome_message ||
      (isAppDefault ? LOGIN_LANDING_TAGLINE : "Accede a tu espacio de trabajo");

  const organizationLogo = resolveMediaUrl(flat?.organization_logo_url) || null;
  const hasOrganizationLogo = Boolean(organizationLogo) && isBranchLogin;
  const showGithubCredit = !isBranchLogin;
  const socialLinks = !isAppDefault ? (flat?.social_links ?? []) : [];
  const availableApps = (flat?.available_apps ?? []) as PublicAvailableApp[];
  const orgSponsors = !isAppDefault ? (flat?.sponsors ?? []) : [];
  const showOrgSponsors = flat?.show_sponsor_logos !== false;

  // Logo de la org: theme logo → organization_logo_url (nunca crow mientras hay tenant).
  const orgBrandLogo =
    resolveThemeLogo(flat) ||
    resolveMediaUrl(flat?.organization_logo_url) ||
    resolveMediaUrl(flat?.logo_url) ||
    null;

  const formProps = {
    email,
    password,
    onEmail: setEmail,
    onPassword: setPassword,
    onSubmit: handleSubmit,
    errorMessage,
    pending: login.isPending,
    forgotPasswordTo: slug
      ? `/forgot-password/${encodeURIComponent(slug)}`
      : "/forgot-password",
  };

  if (isOrgPortal) {
    return (
      <div className="relative min-h-screen bg-background">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <OrgLoginLanding
          loading={themeLoading}
          orgName={orgName}
          brandTitle={orgName}
          brandLogoUrl={orgBrandLogo}
          tagline={flat?.tagline || null}
          description={flat?.brand_description || null}
          websiteUrl={flat?.website_url || null}
          welcomeMessage={
            flat?.login_welcome_message || flat?.welcome_message || null
          }
          socialLinks={socialLinks}
          sponsors={orgSponsors}
          showSponsors={showOrgSponsors}
          apps={availableApps}
        >
          <LoginForm {...formProps} />
        </OrgLoginLanding>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div
        className={cn(
          "min-h-screen",
          showMuninnLanding ? "grid lg:grid-cols-2" : "flex items-center justify-center",
        )}
      >
        {showMuninnLanding && (
          <aside className="relative hidden border-r border-border/40 lg:block">
            <LoginLandingPanel loading={themeLoading} />
          </aside>
        )}

        <div
          className={cn(
            "flex flex-col items-center justify-center px-4 py-10 sm:px-8",
            showMuninnLanding ? "" : "w-full",
          )}
        >
          {showMuninnLanding && (
            <div className="mb-8 w-full max-w-sm lg:hidden">
              <LoginLandingPanel loading={themeLoading} compact />
            </div>
          )}

          <div className="w-full max-w-sm space-y-6">
            {!showMuninnLanding && (
              <div className="space-y-4 text-center">
                {themeLoading ? (
                  <MuninnBrand pending layout="horizontal" className="justify-center scale-110" />
                ) : (
                  <MuninnBrand
                    branchLabel={brandTitle}
                    appName={brandSubtitle}
                    branchLogoUrl={branchLogo}
                    layout="horizontal"
                    className="justify-center scale-110"
                  />
                )}
                {formHint && <p className="text-sm text-muted-foreground">{formHint}</p>}
              </div>
            )}

            {showMuninnLanding && (
              <div className="hidden lg:block space-y-1.5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Iniciar sesión
                </h2>
                {formHint && <p className="text-sm text-muted-foreground">{formHint}</p>}
              </div>
            )}

            <LoginForm {...formProps} />

            {socialLinks.length > 0 && <LoginSocialLinks links={socialLinks} />}

            <div className="flex flex-col items-center gap-2 pt-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}
