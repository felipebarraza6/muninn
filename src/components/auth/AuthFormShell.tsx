import { authShellClass } from "@/components/auth/auth-form-styles";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div";
  children: React.ReactNode;
};

type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  as: "form";
  children: React.ReactNode;
};

/** Superficie integrada de formularios auth (login / forgot / reset). */
export function AuthFormShell(props: DivProps | FormProps) {
  const { children, className, as = "div", ...rest } = props;
  const shell = cn(authShellClass(), className);

  if (as === "form") {
    return (
      <form className={shell} {...(rest as React.FormHTMLAttributes<HTMLFormElement>)}>
        {children}
      </form>
    );
  }

  return (
    <div className={shell} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
