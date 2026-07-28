import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogin } from "@/api/hooks/useAuth";
import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import { PitchSwap } from "@/components/brand/LoginLandingPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { PixelBoot } from "@/components/brand/LoginPixelBoot";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PIXEL_BOOT_MS = 900;

const GITHUB_CREDIT_URL = "https://github.com/felipebarraza6";
const GITHUB_CREDIT_LABEL = "felipebarraza6";

/**
 * Auth Muninn (app default): solo form + atmósfera.
 * La landing comercial vive en /.
 */
export default function EntrarPage() {
  const navigate = useNavigate();
  const reduceMotion = useMotionPrefs();
  const [pixelReady, setPixelReady] = useState(() => Boolean(reduceMotion));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  useEffect(() => {
    if (reduceMotion) {
      setPixelReady(true);
      return;
    }
    setPixelReady(false);
    const t = window.setTimeout(() => setPixelReady(true), PIXEL_BOOT_MS);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

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

  return (
    <div className="login-pixel relative min-h-dvh overflow-x-hidden bg-background">
      <LoginAtmosphere
        intensity="full"
        variant="pixel"
        mood="batcave"
        className="pointer-events-none fixed inset-0 z-0"
      />
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-14 sm:px-6">
        {pixelReady ? (
          <motion.div
            className="w-full max-w-md space-y-4"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.slow,
              ease: motionTokens.easeOut,
              delay: reduceMotion ? 0 : 0.05,
            }}
          >
            <div className="space-y-2 text-center">
              <p className="pixel-font text-[8px] uppercase tracking-[0.14em] text-primary/80"></p>
              <PitchSwap brand centered />
              <Link
                to="/"
                className="pixel-font inline-flex text-[8px] uppercase text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                ← Volver
              </Link>
            </div>

            <div
              id="login"
              className={cn(
                "login-pixel-auth__card scroll-mt-4 space-y-4 p-4 sm:p-5",
                "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_25%,transparent),0_0_40px_color-mix(in_oklab,var(--primary)_12%,transparent)]",
              )}
            >
              <h1 className="pixel-font text-[12px] uppercase tracking-wide text-foreground sm:text-[13px]">
                Iniciar sesión
              </h1>
              <LoginForm
                email={email}
                password={password}
                onEmail={setEmail}
                onPassword={setPassword}
                onSubmit={handleSubmit}
                errorMessage={errorMessage}
                pending={login.isPending}
                forgotPasswordTo="/forgot-password"
                pixel
              />
              <p className="pixel-footer">
                Powered by{" "}
                <a
                  href={GITHUB_CREDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-foreground hover:underline"
                >
                  {GITHUB_CREDIT_LABEL}
                </a>
              </p>
            </div>
          </motion.div>
        ) : (
          <PixelBoot centered />
        )}
      </div>
    </div>
  );
}
