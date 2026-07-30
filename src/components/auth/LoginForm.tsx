import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import {
  authInputClass,
  authLabelClass,
  authPrimaryBtnClass,
  authShellClass,
} from "@/components/auth/auth-form-styles";
import { cn } from "@/lib/utils";

export type LoginFormProps = {
  email: string;
  password: string;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage: string | null;
  pending: boolean;
  forgotPasswordTo?: string;
  className?: string;
  autoFocusEmail?: boolean;
  /** Estilo pixel (login Muninn retro). */
  pixel?: boolean;
};

export function LoginForm({
  email,
  password,
  onEmail,
  onPassword,
  onSubmit,
  errorMessage,
  pending,
  forgotPasswordTo,
  className,
  autoFocusEmail = true,
  pixel = false,
}: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={
        pixel
          ? cn("space-y-4 bg-transparent p-0 shadow-none", className)
          : authShellClass(className)
      }
      noValidate
      aria-busy={pending}
    >
      {errorMessage ? (
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/10"
          role="alert"
          aria-live="assertive"
        >
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email" className={authLabelClass}>
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
          autoFocus={autoFocusEmail}
          className={authInputClass}
        />
      </div>

      <AuthPasswordField
        id="password"
        value={password}
        onChange={onPassword}
        autoComplete="current-password"
        pixel={pixel}
        labelAside={
          forgotPasswordTo ? (
            <Link
              to={forgotPasswordTo}
              className="text-[11px] font-medium text-primary underline-offset-2 transition-colors hover:underline"
            >
              Recuperar contraseña
            </Link>
          ) : null
        }
      />

      <Button type="submit" className={cn(authPrimaryBtnClass)} disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
