import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PixelIcon } from "@/components/brand/pixel-icons";
import { authInputClass, authLabelClass } from "@/components/auth/auth-form-styles";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoFocus?: boolean;
  className?: string;
  /** Contenido a la derecha del label (p. ej. enlace recuperar). */
  labelAside?: React.ReactNode;
  /** Iconos / chrome pixel (login Muninn retro). */
  pixel?: boolean;
};

export function AuthPasswordField({
  id,
  label = "Contraseña",
  value,
  onChange,
  autoComplete = "current-password",
  placeholder = "••••••••",
  required = true,
  minLength,
  autoFocus,
  className,
  labelAside,
  pixel = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const showLabelRow = Boolean(label) || Boolean(labelAside);

  return (
    <div className={cn("space-y-2", className)}>
      {showLabelRow ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <Label htmlFor={id} className={authLabelClass}>
              {label}
            </Label>
          ) : (
            <span />
          )}
          {labelAside}
        </div>
      ) : null}
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={cn(authInputClass, "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={cn(
            "absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
            pixel ? "border-0 bg-transparent hover:bg-primary/10" : "rounded-md hover:bg-muted/60",
          )}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {pixel ? (
            <PixelIcon icon={visible ? "eyeOff" : "eye"} className="h-4 w-4" />
          ) : visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
