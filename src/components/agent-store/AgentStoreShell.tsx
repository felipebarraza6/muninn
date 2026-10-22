import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PixelRaven } from "@/components/brand/PixelRaven";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/authSession";

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export function AgentStoreShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const signedIn = isAuthenticated();

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <Helmet>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Helmet>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_62%)]"
      />
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight"
          >
            <PixelRaven featured={false} className="h-8 w-8" />
            Muninn
          </Link>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Tienda">
            <Link to="/agentes" className={linkClass}>
              Tienda de agentes
            </Link>
            <a href="/#planes" className={linkClass}>
              Planes
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {signedIn ? (
              <Button asChild size="sm">
                <Link to="/app/agentes">Ir a mis agentes</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/entrar">Entrar</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/registro">Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        {children}
      </main>
      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Muninn · Tienda pública de agentes</p>
          <nav className="flex flex-wrap gap-4" aria-label="Legal">
            <Link to="/terminos" className={linkClass}>
              Términos
            </Link>
            <Link to="/privacidad" className={linkClass}>
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
