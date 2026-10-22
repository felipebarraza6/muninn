import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PixelRaven } from "@/components/brand/PixelRaven";

export function CommercialAuthShell({
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
      <header className="border-b border-border/60">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-sm font-semibold">
            <PixelRaven featured={false} className="h-8 w-8" />
            Muninn
          </Link>
          <Link to="/entrar" className="text-sm text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
