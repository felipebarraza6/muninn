import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogin } from "@/api/hooks/useAuth";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { LoginSocialLinks } from "@/components/brand/LoginSocialLinks";
import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import { MuninnLoginLanding } from "@/components/brand/MuninnLoginLanding";
import { MUNINN_LIVE_DEMO_EVENT } from "@/lib/muninnLiveDemo";
import { OrgLoginLanding } from "@/components/brand/OrgLoginLanding";
import { LoginForm } from "@/components/auth/LoginForm";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { LOGIN_BRAND_SUBTITLE } from "@/lib/loginLanding";
import { motionTokens } from "@/lib/motion";
import type { PublicAvailableApp } from "@/lib/publicLoginTheme";

const GITHUB_CREDIT_URL = "https://github.com/felipebarraza6";
const GITHUB_CREDIT_LABEL = "felipebarraza6";
/** Debe coincidir con el boot del landing pixel. */
const PIXEL_BOOT_MS = 900;

export default function Login() {
  const navigate = useNavigate();
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const slug = slugParam || searchParams.get("slug") || undefined;
  const reduceMotion = useMotionPrefs();

  const { flat, scope, isAppDefault, isLoading: themeLoading } = useResolvePublicLoginTheme(slug);
  const [pixelReady, setPixelReady] = useState(() => Boolean(reduceMotion));
  const [liveNonce, setLiveNonce] = useState(0);

  useEffect(() => {
    if (!isAppDefault) {
      setPixelReady(true);
      return;
    }
    if (reduceMotion) {
      setPixelReady(true);
      return;
    }
    setPixelReady(false);
    const t = window.setTimeout(() => setPixelReady(true), PIXEL_BOOT_MS);
    return () => window.clearTimeout(t);
  }, [isAppDefault, reduceMotion]);

  useEffect(() => {
    if (!isAppDefault) return;
    const onEgg = () => setLiveNonce((n) => n + 1);
    window.addEventListener(MUNINN_LIVE_DEMO_EVENT, onEgg);
    return () => window.removeEventListener(MUNINN_LIVE_DEMO_EVENT, onEgg);
  }, [isAppDefault]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/app"),
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
    return orgName || undefined;
  }, [isAppDefault, scope, fantasyName, flat?.branch_name, orgName, appName]);

  const isOrgPortal = scope === "organization";
  const isBranchLogin = scope === "branch" && Boolean(flat?.branch_id);
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
      (isAppDefault ? LOGIN_BRAND_SUBTITLE : "Accede a tu espacio de trabajo");

  const organizationLogo = resolveMediaUrl(flat?.organization_logo_url) || null;
  const hasOrganizationLogo = Boolean(organizationLogo) && isBranchLogin;
  const showGithubCredit = !isBranchLogin;
  const socialLinks = !isAppDefault ? (flat?.social_links ?? []) : [];
  const availableApps = (flat?.available_apps ?? []) as PublicAvailableApp[];
  const orgSponsors = !isAppDefault ? (flat?.sponsors ?? []) : [];
  const showOrgSponsors = flat?.show_sponsor_logos !== false;

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
    forgotPasswordTo: slug ? `/forgot-password/${encodeURIComponent(slug)}` : "/forgot-password",
  };

  const formMotion = {
    initial: reduceMotion ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: motionTokens.slow,
      delay: reduceMotion ? 0 : 0.08,
      ease: motionTokens.easeOut,
    },
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
          welcomeMessage={flat?.login_welcome_message || flat?.welcome_message || null}
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

  if (showMuninnLanding) {
    return (
      <div className="login-pixel relative min-h-dvh overflow-x-hidden bg-background">
        <LoginAtmosphere
          intensity="full"
          variant="pixel"
          mood="gotham"
          parallax
          className="pointer-events-none fixed inset-0 z-0"
        />
        <div className="fixed top-3 right-3 z-30 sm:top-4 sm:right-4">
          <ThemeToggle className="login-pixel-theme-toggle border-2 border-border/60 bg-card text-foreground shadow-[2px_2px_0_0_color-mix(in_oklab,var(--foreground)_18%,transparent)] hover:bg-card" />
        </div>

        {/* Contenido centrado; ciudad full-bleed detrás. Desktop más ancho para no “flotar” en el vacío */}
        <div className="relative z-10 mx-auto w-full max-w-[56rem] xl:max-w-[68rem] [text-shadow:0_1px_0_color-mix(in_oklab,var(--gotham-sky-0,#010204)_60%,transparent)]">
          {pixelReady ? (
            <MuninnLoginLanding liveNonce={liveNonce} />
          ) : (
            <div className="flex min-h-dvh items-center justify-center px-8 py-16">
              <span className="sr-only">Cargando</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <LoginAtmosphere intensity="soft" variant="aurora" />
      <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>

      <div className="relative z-[1] flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          id="login"
          className="w-full max-w-sm space-y-5 scroll-mt-8"
          initial={formMotion.initial}
          animate={formMotion.animate}
          transition={formMotion.transition}
        >
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

          <LoginForm {...formProps} />

          {socialLinks.length > 0 && <LoginSocialLinks links={socialLinks} />}

          <div className="flex flex-col items-center gap-2 pt-0.5">
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
        </motion.div>
      </div>
    </div>
  );
}
