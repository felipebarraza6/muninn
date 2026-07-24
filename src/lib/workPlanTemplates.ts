import type { CreateWorkPlanPayload, WorkItemKind } from "@/api/hooks/useWorkPlans";

export type WorkPlanTemplateId = "wm-dentidesk" | "sh-dga-soporte" | "sh-digest";

export type WorkPlanTemplateDraftItem = {
  title: string;
  kind: WorkItemKind;
  payload?: Record<string, unknown>;
  /** Slug del agente para este ítem (opcional; cae al agente del plan). */
  agent_slug?: string;
};

export type WorkPlanTemplate = {
  id: WorkPlanTemplateId;
  label: string;
  description: string;
  /** Hint cuando no aplica a la sucursal activa. */
  requiresHint: string;
  /** Slugs de agentes que habilitan la plantilla (cualquiera). */
  agentSlugs: string[];
  /** Nombre (o substring) de workflow opcional. */
  workflowNameIncludes?: string;
  build: (ctx: {
    agentIdBySlug: Record<string, number | string>;
    workflowIdByName: (needle: string) => string | null;
  }) => CreateWorkPlanPayload | null;
};

function agentPk(
  map: Record<string, number | string>,
  slug: string,
): number | string | null {
  const v = map[slug];
  return v != null ? v : null;
}

export const WORK_PLAN_TEMPLATES: WorkPlanTemplate[] = [
  {
    id: "wm-dentidesk",
    label: "Agenda Clínica WM (Dentidesk)",
    description:
      "Demo segura: nota + horas disponibles + próxima hora. No crea citas reales.",
    requiresHint: "Necesitas el agente agendamiento-clinica-wm en esta sucursal.",
    agentSlugs: ["agendamiento-clinica-wm"],
    build: ({ agentIdBySlug }) => {
      const agent = agentPk(agentIdBySlug, "agendamiento-clinica-wm");
      if (agent == null) return null;
      return {
        name: "Demo Agenda Clínica WM",
        description:
          "Consulta de disponibilidad Dentidesk. No agendar sin consentimiento del paciente.",
        assigned_agent: agent,
        context: { demo: true, branch_label: "Clinica WM" },
        items: [
          {
            title: "Aviso demo",
            kind: "note",
            sort_order: 0,
            payload: {
              text: "Demo: no crear cita real sin consentimiento explícito del paciente.",
            },
          },
          {
            title: "Horas disponibles",
            kind: "agent_turn",
            sort_order: 1,
            payload: {
              message:
                "Usa la skill dentidesk-horas-disponibles y resume las próximas horas libres de hoy o mañana. No reserves nada.",
            },
          },
          {
            title: "Próxima hora",
            kind: "agent_turn",
            sort_order: 2,
            payload: {
              message:
                "Usa dentidesk-buscar-proxima-hora y dime la próxima hora disponible. Solo informa, no crees la cita.",
            },
          },
        ],
      };
    },
  },
  {
    id: "sh-dga-soporte",
    label: "Ops SmartHydro: DGA + soporte",
    description:
      "Checklist normativa DGA + triage de soporte. Evita Nubox e IoT ensure.",
    requiresHint:
      "Necesitas experto-dga-smarthydro y/o soporte-smarthydro en esta sucursal.",
    agentSlugs: ["experto-dga-smarthydro", "soporte-smarthydro"],
    workflowNameIncludes: "Checklist normativa DGA",
    build: ({ agentIdBySlug, workflowIdByName }) => {
      const dga = agentPk(agentIdBySlug, "experto-dga-smarthydro");
      const soporte = agentPk(agentIdBySlug, "soporte-smarthydro");
      const primary = dga ?? soporte;
      if (primary == null) return null;
      const wfId = workflowIdByName("Checklist normativa DGA");
      const items: NonNullable<CreateWorkPlanPayload["items"]> = [
        {
          title: "Checklist demo",
          kind: "note",
          sort_order: 0,
          payload: {
            text: "Demo SH: revisar normativa DGA y triage de soporte. No abrir tickets reales ni tocar Nubox.",
          },
        },
      ];
      if (dga != null) {
        items.push({
          title: "Consulta normativa DGA",
          kind: "agent_turn",
          sort_order: 1,
          assigned_agent: dga,
          payload: {
            message:
              "Resume en 5 bullets los puntos clave de cumplimiento DGA para un cliente SmartHydro esta semana. Sin inventar normativa.",
          },
        });
      }
      if (wfId) {
        items.push({
          title: "Workflow checklist DGA",
          kind: "workflow",
          sort_order: items.length,
          payload: {
            workflow_id: wfId,
            workflow_name: "[DEMO SH] Checklist normativa DGA",
          },
        });
      }
      if (soporte != null) {
        items.push({
          title: "Triage soporte",
          kind: "agent_turn",
          sort_order: items.length,
          assigned_agent: soporte,
          payload: {
            message:
              "Haz un triage de soporte de ejemplo: cliente reporta alerta de caudal. Clasifica prioridad y sugiere pasos. No crees ticket real.",
          },
        });
      }
      return {
        name: "[DEMO SH] Semana DGA + soporte",
        description: "Plan demo: normativa DGA + workflow checklist + triage soporte.",
        assigned_agent: primary,
        workflow: wfId,
        context: { demo: true, branch_label: "SmartHydro", avoid: ["nubox", "iot_ensure"] },
        items,
      };
    },
  },
  {
    id: "sh-digest",
    label: "Digest telemetría diario",
    description: "Atajo al workflow de digest con telemetria-smarthydro.",
    requiresHint: "Necesitas telemetria-smarthydro o el workflow Digest telemetría.",
    agentSlugs: ["telemetria-smarthydro"],
    workflowNameIncludes: "Digest telemetría",
    build: ({ agentIdBySlug, workflowIdByName }) => {
      const agent = agentPk(agentIdBySlug, "telemetria-smarthydro");
      const wfId = workflowIdByName("Digest telemetría");
      if (agent == null && !wfId) return null;
      const items: NonNullable<CreateWorkPlanPayload["items"]> = [
        {
          title: "Nota digest",
          kind: "note",
          sort_order: 0,
          payload: {
            text: "Demo: digest diario de telemetría. Solo resumen, sin acciones destructivas.",
          },
        },
      ];
      if (wfId) {
        items.push({
          title: "Ejecutar digest telemetría",
          kind: "workflow",
          sort_order: 1,
          payload: {
            workflow_id: wfId,
            workflow_name: "[DEMO SH] Digest telemetría diario",
          },
        });
      } else if (agent != null) {
        items.push({
          title: "Resumen telemetría",
          kind: "agent_turn",
          sort_order: 1,
          assigned_agent: agent,
          payload: {
            message:
              "Genera un digest corto de telemetría del día: anomalías, caudales relevantes y recomendaciones.",
          },
        });
      }
      return {
        name: "[DEMO SH] Digest telemetría diario",
        description: "Ejecuta el digest de telemetría (workflow o turno de agente).",
        assigned_agent: agent,
        workflow: wfId,
        context: { demo: true, branch_label: "SmartHydro" },
        items,
      };
    },
  },
];

export function templateAvailability(
  template: WorkPlanTemplate,
  agentSlugsPresent: Set<string>,
  workflowNames: string[],
): { available: boolean; reason?: string } {
  const hasAgent = template.agentSlugs.some((s) => agentSlugsPresent.has(s));
  const hasWf =
    !!template.workflowNameIncludes &&
    workflowNames.some((n) =>
      n.toLowerCase().includes(template.workflowNameIncludes!.toLowerCase()),
    );
  if (template.id === "sh-digest") {
    if (hasAgent || hasWf) return { available: true };
    return { available: false, reason: template.requiresHint };
  }
  if (!hasAgent) return { available: false, reason: template.requiresHint };
  return { available: true };
}
