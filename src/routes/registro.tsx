import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSignupAccount } from "@/api/hooks/useCommercial";
import { CommercialAuthShell } from "@/components/auth/CommercialAuthShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorMessage, apiErrorStatus } from "@/lib/apiError";
import { isCommercialUnavailable } from "@/lib/commercial";

export default function RegistroPage() {
  const signup = useSignupAccount();
  const [organizationName, setOrganizationName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!accepted) {
      setErrorMessage("Lee el borrador de términos y privacidad antes de crear la cuenta.");
      return;
    }
    if (password.trim().length < 8) {
      setErrorMessage("La contraseña necesita al menos 8 caracteres.");
      return;
    }
    signup.mutate(
      {
        organization_name: organizationName.trim(),
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
      {
        onError: (error) => {
          if (isCommercialUnavailable(error) || apiErrorStatus(error) === 404) {
            setErrorMessage(
              "El registro en línea todavía no está activo en el servidor. Escríbenos y te abrimos la cuenta.",
            );
            return;
          }
          setErrorMessage(apiErrorMessage(error, "No se pudo crear la cuenta."));
        },
      },
    );
  };

  if (signup.data) {
    const result = signup.data;
    return (
      <CommercialAuthShell
        title="Revisa tu correo"
        description="La cuenta queda pendiente hasta que abras el enlace de verificación."
      >
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 text-sm leading-relaxed">
          <p>{result.detail}</p>
          {result.email ? (
            <p>
              Correo: <span className="text-foreground">{result.email}</span>
            </p>
          ) : null}
          {result.mock ? (
            <Alert>
              <AlertDescription>
                Modo de ejemplo. No salió ningún correo y no se creó una organización. Token de
                prueba: <span className="font-medium">{result.mockToken}</span>.{" "}
                <Link
                  to={`/registro/verificar?token=${encodeURIComponent(result.mockToken || "")}`}
                  className="underline underline-offset-2"
                >
                  Abrir la verificación de ejemplo
                </Link>
                .
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-muted-foreground">
              Si no llega en unos minutos, revisa el spam. El enlace abre esta misma web en
              /registro/verificar.
            </p>
          )}
          <Button asChild variant="outline">
            <Link to="/entrar">Ir a entrar</Link>
          </Button>
        </div>
      </CommercialAuthShell>
    );
  }

  return (
    <CommercialAuthShell
      title="Crear cuenta gratis"
      description="Abres tu organización sin tarjeta. Cada agente que dejes activo cuesta 0,5 UF al mes, y el uso de IA se paga aparte con runas."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errorMessage ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="organization_name">Organización</Label>
          <Input
            id="organization_name"
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            required
            autoComplete="organization"
            placeholder="Nombre de tu equipo o empresa"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nombre</Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              autoComplete="given-name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Apellido</Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              autoComplete="family-name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        <label className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>
            Leí el borrador de{" "}
            <Link to="/terminos" className="underline underline-offset-2">
              términos
            </Link>{" "}
            y{" "}
            <Link to="/privacidad" className="underline underline-offset-2">
              privacidad
            </Link>
            . Sé que todavía está en revisión legal.
          </span>
        </label>
        <Button type="submit" disabled={signup.isPending}>
          {signup.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Creando…
            </>
          ) : (
            "Crear cuenta gratis"
          )}
        </Button>
      </form>
    </CommercialAuthShell>
  );
}
