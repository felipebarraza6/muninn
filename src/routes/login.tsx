import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogin } from "@/api/hooks/useAuth";
import { useResolvePublicLoginTheme } from "@/api/hooks/useBranchTheme";
import { resolveThemeLogo } from "@/lib/applyBranchTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { LoginSocialLinks } from "@/components/brand/LoginSocialLinks";
import { cn } from "@/lib/utils";
import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import type { NordicZone } from "@/components/brand/PixelNordicScene";
import { MuninnLoginLanding } from "@/components/brand/MuninnLoginLanding";
import { PixelBoot } from "@/components/brand/LoginPixelBoot";
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
  const [nordicZone, setNordicZone] = useState<NordicZone>("fjord");

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

  useEffect(() => {
    if (!isAppDefault) return;
    const onZoneChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.zone) setNordicZone(detail.zone);
    };
    window.addEventListener("muninn-zone-change", onZoneChange);
    return () => window.removeEventListener("muninn-zone-change", onZoneChange);
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

  // Loading: nunca mostrar Muninn ni flash mientras se resuelve el tema.
  if (themeLoading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
      </div>
    );
  }

  if (isOrgPortal) {
    return (
      <div className="relative min-h-screen bg-background">
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
          mood="nordic"
          zone={nordicZone}
          parallax
          className="pointer-events-none fixed inset-0 z-0"
        />
        <div className="fixed top-3 right-3 z-30 flex items-center gap-2 sm:top-4 sm:right-4">
          <a
            href="mailto:felipe.barraza.vega@gmail.com"
            className="pixel-font pixel-jules-sm inline-flex items-center gap-1 border-2 border-primary/50 bg-card px-2.5 py-1 text-[8px] uppercase text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-[9px]"
          >
            Cotizar
          </a>
          <Link
            to="/entrar"
            className="pixel-font pixel-jules-sm inline-flex items-center gap-1 border-2 border-primary bg-primary px-2.5 py-1 text-[8px] uppercase text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-[9px]"
          >
            Ingresar
          </Link>
        </div>

        {/* Contenido centrado; ciudad full-bleed detrás. Desktop más ancho para no “flotar” en el vacío */}
        <div
          className={cn(
            "relative z-10 mx-auto w-full",
            pixelReady
              ? "max-w-[56rem] xl:max-w-[68rem]"
              : "flex min-h-dvh items-center justify-center",
          )}
        >
          {pixelReady ? <MuninnLoginLanding liveNonce={liveNonce} /> : <PixelBoot centered />}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <LoginAtmosphere intensity="soft" variant="aurora" />
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
