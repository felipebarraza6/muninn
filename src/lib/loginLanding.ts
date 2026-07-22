/**
 * Copy de la landing Muninn (solo login base / isAppDefault).
 * Explica colaboración del enjambre, conocimiento, aprendizaje y APIs.
 */

export const LOGIN_LANDING_TAGLINE = "Enjambres de IA para gestionar procesos";

export const LOGIN_LANDING_LEAD =
  "Los agentes colaboran en flujos continuos: se pasan el contexto, ejecutan en cadena y escalan al humano solo cuando hace falta. El proceso no se corta entre pasos; el enjambre lo sostiene de punta a punta.";

export const LOGIN_LANDING_FLOW_STEPS = [
  "Orquestar",
  "Especializar",
  "Coordinar",
  "Aprender",
  "Mejorar",
] as const;

export type LoginLandingModuleId = "swarm" | "knowledge" | "learning" | "apis";

export type LoginLandingModule = {
  id: LoginLandingModuleId;
  title: string;
  description: string;
};

export const LOGIN_LANDING_MODULES: LoginLandingModule[] = [
  {
    id: "swarm",
    title: "Colaboración en flujo",
    description:
      "Varios agentes con roles distintos trabajan el mismo proceso en continuo: entender, decidir, actuar y devolver control.",
  },
  {
    id: "knowledge",
    title: "Conocimiento",
    description:
      "El enjambre consulta y actualiza una base compartida para responder y operar con contexto real del negocio.",
  },
  {
    id: "learning",
    title: "Aprendizaje automatizado",
    description:
      "Cada ciclo deja señales: el sistema afina rutas, prioridades y handoffs sin rediseñar el proceso a mano.",
  },
  {
    id: "apis",
    title: "Conexión de APIs",
    description:
      "Los agentes se conectan a tus sistemas vía APIs para leer, escribir y cerrar pasos del proceso de punta a punta.",
  },
];
