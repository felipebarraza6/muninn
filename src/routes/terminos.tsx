import { LegalDraftPage } from "@/components/legal/LegalDraftPage";

export default function TerminosPage() {
  return (
    <LegalDraftPage
      title="Términos de uso"
      description="Borrador de condiciones para usar Muninn en Chile. Pendiente de revisión legal."
    >
      <p>
        Muninn es una plataforma para diseñar y operar agentes de inteligencia artificial: reglas,
        documentos, canales (por ejemplo WhatsApp, Telegram o un widget web) y aplicaciones que el
        cliente configura. Estos términos describen el uso del sitio y de la cuenta. El texto está
        en borrador.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Quién puede usarlo</h2>
      <p>
        El servicio está pensado para empresas y sus equipos. No está dirigido a menores de edad.
        Quien crea una cuenta declara que tiene facultad para obligar a la organización que
        representa.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">La cuenta</h2>
      <p>
        El acceso es personal. Hoy la sesión no se guarda como token en el navegador de forma
        permanente: o vive en memoria durante la visita, o —cuando el servidor lo active— en una
        cookie HttpOnly. El cliente cuida sus credenciales y lo que sus agentes responden.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Qué no prometemos</h2>
      <p>
        Un agente puede equivocarse. Las reglas y los documentos reducen ese riesgo; no lo eliminan.
        Integraciones como Nubox o APIs de organismos del Estado solo funcionan si están instaladas
        y con credenciales válidas. No hay checkout ni precios publicados en el sitio: el alcance se
        cotiza aparte.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Uso aceptable</h2>
      <p>
        No uses Muninn para suplantar personas, vulnerar sistemas, tratar datos de salud o de
        menores sin una base legal, ni para saltarte las reglas de un canal (WhatsApp, Telegram u
        otro). Podemos suspender una cuenta que ponga en riesgo a otras personas o al servicio.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Propiedad</h2>
      <p>
        La plataforma, la marca Muninn y el software siguen siendo de su titular. Los documentos y
        mensajes que carga el cliente siguen siendo del cliente. El detalle de datos personales está
        en la política de privacidad, también en borrador.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Ley aplicable</h2>
      <p>
        Este borrador se escribe para Chile. La relación, cuando el texto definitivo exista, se
        regiría por la ley chilena. Los tribunales ordinarios de Chile serían el foro, salvo norma
        imperativa distinta.
      </p>
    </LegalDraftPage>
  );
}
