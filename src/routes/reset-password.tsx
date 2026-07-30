import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useResetPasswordConfirm } from "@/api/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoginAtmosphere } from "@/components/brand/LoginAtmosphere";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { AuthPixelBrand } from "@/components/auth/AuthPixelBrand";
import { authPrimaryBtnClass } from "@/components/auth/auth-form-styles";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

/** Confirmar nueva contraseña con token del email. */
export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const reset = useResetPasswordConfirm();
  const reduceMotion = useMotionPrefs();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!token) {
      setErrorMessage("Enlace inválido.");
      return;
    }
    if (password !== confirm) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    reset.mutate(
      { token, new_password: password, confirm_password: confirm },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          const msg =
            (err as { friendlyMessage?: string }).friendlyMessage ||
            (err as { message?: string }).message ||
            "No se pudo actualizar la contraseña.";
          setErrorMessage(msg);
        },
      },
    );
  };

  return (
    <div className="login-pixel relative min-h-screen overflow-hidden bg-background">
      <LoginAtmosphere intensity="full" variant="pixel" />
      <div className="relative z-[1] flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className={cn("w-full max-w-sm space-y-6", !reduceMotion && "pixel-enter")}
          style={reduceMotion ? undefined : ({ "--pixel-delay": "80ms" } as React.CSSProperties)}
        >
          <AuthPixelBrand
            title="Nueva contraseña"
            subtitle="Elige una contraseña nueva para tu cuenta."
          />

          {done ? (
            <AuthFormShell className="space-y-4">
              <div aria-live="polite">
                <Alert className="border-primary/25 bg-primary/10">
                  <AlertDescription className="pixel-display text-[13px] leading-relaxed">
                    Contraseña actualizada. Ya puedes entrar.
                  </AlertDescription>
                </Alert>
              </div>
              <Button
                type="button"
                className={cn(authPrimaryBtnClass)}
                onClick={() => navigate("/entrar")}
              >
                Ir al login
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
              <AuthPasswordField
                id="new-password"
                label="Nueva contraseña"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
                minLength={8}
                autoFocus
                pixel
              />
              <AuthPasswordField
                id="confirm-password"
                label="Confirmar"
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
                minLength={8}
                pixel
              />
              <Button
                type="submit"
                className={cn(authPrimaryBtnClass)}
                disabled={reset.isPending || !token}
              >
                {reset.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Guardando…
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </Button>
              <p className="pixel-font text-center text-[8px] uppercase text-muted-foreground">
                <Link
                  to="/entrar"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Volver al login
                </Link>
              </p>
            </AuthFormShell>
          )}
        </div>
      </div>
    </div>
  );
}
