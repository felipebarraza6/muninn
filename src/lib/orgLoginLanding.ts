/**
 * Capacidades del portal de organización (sin listar clientes/sucursales:
 * el login org cubre toda la organización).
 */

export type OrgLoginCapabilityId =
  | "agents"
  | "channels"
  | "apps"
  | "conversations"
  | "team";

export type OrgLoginCapability = {
  id: OrgLoginCapabilityId;
  title: string;
  description: string;
};

export const ORG_LOGIN_CAPABILITIES: OrgLoginCapability[] = [
  {
    id: "agents",
    title: "Agentes",
    description: "Configurá y desplegá agentes de IA para tu organización y clientes.",
  },
  {
    id: "channels",
    title: "Canales",
    description: "WhatsApp, web y más conectados a tus agentes.",
  },
  {
    id: "apps",
    title: "Aplicaciones",
    description: "Integraciones habilitadas para esta organización.",
  },
  {
    id: "conversations",
    title: "Conversaciones",
    description: "Bandeja operativa, filtrable por cliente o sucursal.",
  },
  {
    id: "team",
    title: "Equipo",
    description: "Usuarios y roles bajo el mismo portal.",
  },
];
