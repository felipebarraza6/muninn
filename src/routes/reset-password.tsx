import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useResetPasswordConfirm } from "@/api/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MuninnBrand } from "@/components/brand/MuninnBrand";

/** Confirmar nueva contraseña con token del email. */
export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const reset = useResetPasswordConfirm();

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
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-3 text-center">
            <MuninnBrand layout="horizontal" className="justify-center scale-110" />
            <p className="text-sm text-muted-foreground">Elegí una contraseña nueva.</p>
          </div>

          {done ? (
            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur sm:p-6">
              <Alert className="border-primary/25 bg-primary/10">
                <AlertDescription>Contraseña actualizada. Ya podés entrar.</AlertDescription>
              </Alert>
              <Button type="button" className="w-full" onClick={() => navigate("/login")}>
                Ir al login
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
                  htmlFor="new-password"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Nueva contraseña
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-secondary border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Confirmar
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="bg-secondary border-border/50"
                />
              </div>
              <Button type="submit" className="w-full" disabled={reset.isPending || !token}>
                {reset.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando…
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
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
