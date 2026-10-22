import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PixelRaven } from "@/components/brand/PixelRaven";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { catalogUnavailable, usePublicAgentCatalog } from "@/api/hooks/usePublicAgentCatalog";
import { AgentCatalogCard } from "@/components/agent-store/AgentCatalogCard";
import {
  SALES_EXAMPLE,
  SALES_FAQ,
  SALES_INTEGRATIONS,
  SALES_NAV,
  SALES_PLANS,
  SALES_STEPS,
  SALES_USE_CASES,
  salesMail,
} from "@/lib/salesCopy";
import { pickFeaturedCatalogAgents } from "@/lib/agentCatalog";

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export function SalesLanding() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <Helmet>
        <title>Muninn — Agentes de IA con memoria de tu operación</title>
        <meta
          name="description"
          content="Cuenta gratis. Cada agente activo cuesta 0,5 UF al mes y el uso de IA se paga con runas prepagadas, el costo real más un 20 %."
        />
      </Helmet>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_62%)]"
      />
      <Header />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-12 sm:px-6 md:gap-28 md:py-16">
        <Hero />
        <Value />
        <UseCases />
        <How />
        <Example />
        <Integrations />
        <Catalog />
        <Plans />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight"
        >
          <PixelRaven featured={false} className="h-8 w-8" />
          Muninn
        </Link>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Secciones">
          {SALES_NAV.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} to={item.href} className={linkClass}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/registro">
              <span className="sm:hidden">Cuenta gratis</span>
              <span className="hidden sm:inline">Crear cuenta gratis</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          El cuervo de la memoria
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Agentes que recuerdan cómo trabaja tu equipo.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Muninn es la plataforma donde diseñas un agente de IA, le das reglas y documentos, y lo
          conectas a un canal. La cuenta es gratis. Cada agente activo cuesta 0,5 UF al mes, y el
          uso de IA se paga con runas prepagadas.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/registro">Crear cuenta gratis</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="#como">Cómo funciona</a>
          </Button>
        </div>
      </div>
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl border border-primary/30 bg-card shadow-[0_0_80px_-24px_var(--primary)] md:h-52 md:w-52">
        <PixelRaven className="h-28 w-28 md:h-36 md:w-36" />
      </div>
    </section>
  );
}

function Value() {
  return (
    <section id="propuesta" className="space-y-4">
      <SectionTitle kicker="Propuesta" title="Una operación visible, no un chat suelto." />
      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
        El nombre viene de Muninn, el cuervo que le traía memoria a Odín. Aquí la memoria es la
        tuya: documentos, reglas y el historial de cada conversación. El agente propone; las reglas
        dicen cuándo tiene que parar y preguntar.
      </p>
    </section>
  );
}

function UseCases() {
  return (
    <section id="usos" className="space-y-6">
      <SectionTitle kicker="Casos de uso" title="Para lo que ya puedes operar hoy." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {SALES_USE_CASES.map((item) => (
          <li key={item.title} className="rounded-2xl border border-border/70 bg-card p-5">
            <h3 className="font-display text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function How() {
  return (
    <section id="como" className="space-y-6">
      <SectionTitle kicker="Cómo funciona" title="Tres pasos, sin caja negra." />
      <ol className="grid gap-4 md:grid-cols-3">
        {SALES_STEPS.map((step) => (
          <li key={step.n} className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="font-display text-xs tracking-[0.16em] text-primary">{step.n}</p>
            <h3 className="mt-3 font-display text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.line}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Example() {
  return (
    <section aria-labelledby="ejemplo-titulo" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="ejemplo-titulo" className="font-display text-2xl font-semibold tracking-tight">
          Ejemplo de conversación
        </h2>
        <p className="text-xs uppercase tracking-wide text-warning">
          Ilustración. No es un agente conectado.
        </p>
      </div>
      <div className="space-y-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4 sm:p-6">
        {SALES_EXAMPLE.map((turn) => (
          <p
            key={turn.text}
            className={
              turn.role === "persona"
                ? "ml-auto max-w-lg rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                : "max-w-lg rounded-2xl bg-card px-4 py-3 text-sm text-card-foreground"
            }
          >
            <span className="mb-1 block text-[10px] uppercase tracking-wide opacity-70">
              {turn.role === "persona" ? "Persona" : "Agente de ejemplo"}
            </span>
            {turn.text}
          </p>
        ))}
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section id="integraciones" className="space-y-6">
      <SectionTitle
        kicker="Integraciones"
        title="Canales y aplicaciones que la plataforma ya sabe conectar."
      />
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Conectarlas exige configuración en tu cuenta. Esta página no las activa solas. Una
        integración a medida se cotiza aparte:{" "}
        <a
          href={salesMail("Cotización de integración Muninn")}
          className="underline underline-offset-2"
        >
          escribir
        </a>
        .
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {SALES_INTEGRATIONS.map((item) => (
          <li key={item.name} className="rounded-2xl border border-border/70 bg-card p-5">
            <h3 className="font-display text-base font-semibold">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Catalog() {
  const catalog = usePublicAgentCatalog();
  const featured = pickFeaturedCatalogAgents(catalog.catalog ?? [], 6);
  const waiting = catalog.isPending;
  const missing = catalog.isError && catalogUnavailable(catalog.error);

  return (
    <section id="catalogo" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle kicker="Catálogo de agentes" title="Destacados reales de la tienda." />
        <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
          <Link to="/agentes">Ver tienda completa</Link>
        </Button>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Leemos <code className="text-foreground">GET /api/public/agent-catalog/</code>. Si el
        listado no existe o viene vacío, no inventamos agentes.
      </p>
      {waiting ? (
        <p className="text-sm text-muted-foreground">Buscando el catálogo…</p>
      ) : featured.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((agent) => (
            <li key={agent.id}>
              <AgentCatalogCard agent={agent} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-8">
          <p className="text-sm text-muted-foreground">
            {missing
              ? "El catálogo público todavía no responde. Cuando la API entregue agentes, aparecen en esta grilla."
              : "No hay agentes publicados en el catálogo."}
          </p>
          <Button asChild variant="link" className="mt-2 h-auto px-0">
            <Link to="/agentes">Abrir la tienda</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

function Plans() {
  return (
    <section id="planes" className="space-y-6">
      <SectionTitle kicker="Precios" title="Cuenta gratis. El agente y la IA se pagan aparte." />
      <p id="runas" className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        0,5 UF al mes por cada agente que dejas activo. El valor en pesos usa la UF del día y se ve
        en facturación, no lo inventamos aquí. Las runas (ᚱ) son un saldo prepago para el modelo:
        cada llamada descuenta el costo real más un 20 %. Los packs se compran en Flow. En cero, la
        IA se detiene. No hay cobro automático de runas ni suscripción escondida.
      </p>
      <ul className="grid gap-4 md:grid-cols-3">
        {SALES_PLANS.map((plan) => (
          <li
            key={plan.name}
            className="flex flex-col rounded-2xl border border-border/70 bg-card p-5"
          >
            <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 font-display text-sm text-primary">{plan.price}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{plan.line}</p>
            <Button asChild className="mt-5" variant={plan.to === "#runas" ? "outline" : "default"}>
              {plan.to.startsWith("/") ? (
                <Link to={plan.to}>{plan.cta}</Link>
              ) : (
                <a href={plan.to}>{plan.cta}</a>
              )}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="space-y-6">
      <SectionTitle kicker="Preguntas frecuentes" title="Lo que conviene dejar claro." />
      <Accordion
        type="single"
        collapsible
        className="rounded-2xl border border-border/70 bg-card px-4"
      >
        {SALES_FAQ.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Muninn. Memoria para agentes de IA.</p>
        <nav className="flex flex-wrap gap-4" aria-label="Legal">
          <Link to="/terminos" className={linkClass}>
            Términos
          </Link>
          <Link to="/privacidad" className={linkClass}>
            Privacidad
          </Link>
          <a href={salesMail("Contacto Muninn")} className={linkClass}>
            Contacto
          </a>
          <Link to="/registro" className={linkClass}>
            Crear cuenta
          </Link>
          <Link to="/entrar" className={linkClass}>
            Entrar
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{kicker}</p>
      <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}
