import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useVerifySignupEmail } from "@/api/hooks/useCommercial";
import { CommercialAuthShell } from "@/components/auth/CommercialAuthShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/lib/apiError";
import { isCommercialUnavailable } from "@/lib/commercial";

export default function RegistroVerificarPage() {
  const [params] = useSearchParams();
  const token = params.get("token")?.trim() || "";
  const verify = useVerifySignupEmail();
  const started = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    verify.mutate(token, {
      onError: (error) => {
        if (isCommercialUnavailable(error)) {
          setErrorMessage(
            "La verificación por correo todavía no está activa en el servidor. Si ya creaste la cuenta, escríbenos.",
          );
          return;
        }
        setErrorMessage(apiErrorMessage(error, "No se pudo verificar el enlace."));
      },
    });
    // mutate es estable; el ref evita un segundo envío si el objeto de la mutación cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CommercialAuthShell
      title="Verificar correo"
      description="Este enlace activa la cuenta que pediste en el registro."
    >
      <div className="space-y-4 text-sm leading-relaxed">
        {!token ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>
              Falta el token del enlace. Ábrelo desde el correo o vuelve a{" "}
              <Link to="/registro" className="underline underline-offset-2">
                crear la cuenta
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : null}
        {token && verify.isPending ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Comprobando el enlace…
          </p>
        ) : null}
        {errorMessage ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {verify.data ? (
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5">
            <p>{verify.data.detail}</p>
            {verify.data.mock ? (
              <p className="text-warning">Ejemplo: no quedó una cuenta creada en el servidor.</p>
            ) : (
              <p className="text-muted-foreground">
                Ya puedes entrar con el correo y la contraseña que elegiste.
              </p>
            )}
            <Button asChild>
              <Link to="/entrar">Entrar</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </CommercialAuthShell>
  );
}
