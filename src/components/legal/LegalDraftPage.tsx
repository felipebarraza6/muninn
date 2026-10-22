import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SALES_CONTACT_EMAIL, salesMail } from "@/lib/salesCopy";

export function LegalDraftPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Helmet>
        <title>{`${title} — Muninn`}</title>
        <meta name="description" content={description} />
      </Helmet>
      <header className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-sm font-semibold">
            Muninn
          </Link>
          <Link to="/entrar" className="text-sm text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          Borrador para revisión legal. No es asesoría ni una política vigente. Antes de publicarlo
          como definitivo tiene que revisarlo un abogado en Chile.
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <article className="space-y-4 text-sm leading-relaxed text-foreground/90">
          {children}
        </article>
        <p className="text-sm text-muted-foreground">
          Contacto:{" "}
          <a className="underline underline-offset-2" href={salesMail(title)}>
            {SALES_CONTACT_EMAIL}
          </a>
        </p>
        <p className="flex gap-4 text-sm">
          <Link to="/terminos" className="underline underline-offset-2">
            Términos
          </Link>
          <Link to="/privacidad" className="underline underline-offset-2">
            Privacidad
          </Link>
          <Link to="/" className="underline underline-offset-2">
            Inicio
          </Link>
        </p>
      </main>
    </div>
  );
}
