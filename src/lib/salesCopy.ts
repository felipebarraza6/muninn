/** Copy de la landing comercial. Español de Chile, tuteo. Sin funciones que la plataforma no tiene. */

export const SALES_CONTACT_EMAIL = "felipe.barraza.vega@gmail.com";

export function salesMail(subject: string): string {
  return `mailto:${SALES_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const SALES_NAV = [
  { href: "#propuesta", label: "Propuesta" },
  { href: "#usos", label: "Usos" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#integraciones", label: "Integraciones" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "/agentes", label: "Tienda" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "Preguntas" },
] as const;

export const SALES_USE_CASES = [
  {
    title: "Responder con tus documentos",
    line: "El agente busca en el conocimiento que subes y cita esa fuente. Si no está ahí, no debería inventarlo.",
  },
  {
    title: "Atender donde ya te escriben",
    line: "WhatsApp, Telegram o un widget en tu sitio. Las conversaciones quedan en la bandeja de Muninn.",
  },
  {
    title: "Consultar un sistema conectado",
    line: "Si instalas una aplicación (agenda, facturación u otra API), el agente puede usarla con las reglas que definas.",
  },
  {
    title: "Supervisar lo que hizo",
    line: "El equipo ve la conversación y puede tomar el control. No es una caja negra de un solo mensaje.",
  },
] as const;

export const SALES_STEPS = [
  {
    n: "01",
    title: "Defines al agente",
    line: "Identidad, tono y reglas: qué puede hacer y qué debe confirmar antes de actuar.",
  },
  {
    n: "02",
    title: "Le das contexto",
    line: "Documentos de tu operación y, si aplica, una aplicación o un canal ya configurado.",
  },
  {
    n: "03",
    title: "Lo operas",
    line: "Las personas escriben por el canal. Tu equipo sigue la bandeja y corrige el rumbo.",
  },
] as const;

export const SALES_INTEGRATIONS = [
  {
    name: "WhatsApp",
    line: "Canal bidireccional con la API de Meta o Twilio. Hay que configurar credenciales y el webhook.",
  },
  {
    name: "Telegram",
    line: "Canal bidireccional con el bot de Telegram.",
  },
  {
    name: "Widget web",
    line: "Chat embebible en tu sitio. Puedes pedir nombre y correo, y limitar los dominios.",
  },
  {
    name: "Nubox",
    line: "Aplicación del catálogo para consultar ventas y compras. Se instala por sucursal; no viene activa sola.",
  },
  {
    name: "APIs del Estado de Chile",
    line: "Hay conectores para DGA MEE, ChileAtiende, datos.gob.cl, indicadores CMF y una validación local de RUT. Cada uno se instala y acredita aparte. La validación de RUT no consulta al SII.",
  },
] as const;

export const SALES_PLANS = [
  {
    name: "Cuenta",
    price: "Gratis",
    line: "Creas la organización y verificas el correo. No pedimos tarjeta para entrar.",
    cta: "Crear cuenta gratis",
    to: "/registro",
  },
  {
    name: "Agente activo",
    price: "0,5 UF / mes",
    line: "Cada agente que dejas encendido. Si lo pausas, ese mes no entra en la cuenta.",
    cta: "Crear cuenta gratis",
    to: "/registro",
  },
  {
    name: "Runas ᚱ",
    price: "Prepago",
    line: "El uso de IA se descuenta del saldo: el costo real de cada llamada más un 20 %. Los packs se pagan en Flow. En cero, la IA se detiene.",
    cta: "Cómo se cobran",
    to: "#runas",
  },
] as const;

export const SALES_FAQ = [
  {
    q: "¿Muninn es un chatbot genérico?",
    a: "No. Cada agente se configura para una operación: identidad, reglas, documentos y las herramientas que le conectes.",
  },
  {
    q: "¿Puedo probar un agente en esta página?",
    a: "No. El ejemplo de conversación es ilustrativo. Crea una cuenta para configurar el tuyo.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "La cuenta es gratis. Cada agente activo cuesta 0,5 UF al mes. El uso de IA se paga aparte, con runas prepagadas: el costo real de la llamada más un 20 %. No hay cobro automático de runas.",
  },
  {
    q: "¿Qué es una runa?",
    a: "Es el saldo con el que pagas el modelo de IA. Compras un pack por Flow y Muninn descuenta runas según el consumo. Si el saldo llega a cero, el agente deja de llamar al modelo hasta que compres otro pack.",
  },
  {
    q: "¿WhatsApp, Nubox o las APIs de gobierno vienen incluidas?",
    a: "La plataforma puede conectarlos. No quedan activos hasta configurarlos en tu cuenta, con sus credenciales.",
  },
  {
    q: "¿Dónde se tratan los datos?",
    a: "La cuenta y los mensajes viven en Muninn. Si el agente usa un modelo o una API externa, ese proveedor también procesa el contenido necesario. El detalle está en la política de privacidad, todavía en borrador legal.",
  },
] as const;

export const SALES_EXAMPLE = [
  { role: "persona" as const, text: "¿Qué documentos necesito para el trámite de esta semana?" },
  {
    role: "agente" as const,
    text: "Según el documento «Requisitos internos», faltan el RUT de la empresa y el comprobante del mes anterior. No agendo nada: solo te lo resumo.",
  },
] as const;
