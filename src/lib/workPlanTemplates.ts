import type { CreateWorkPlanPayload, WorkItemKind } from "@/api/hooks/useWorkPlans";

export type WorkPlanTemplateId = "availability" | "ops-checklist" | "daily-digest";

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
  /**
   * Slugs que habilitan la plantilla (cualquiera).
   * Vacío = cualquier agente de la sucursal.
   */
  agentSlugs: string[];
  /** Nombre (o substring) de workflow opcional. */
  workflowNameIncludes?: string;
  build: (ctx: {
    agentIdBySlug: Record<string, number | string>;
    workflowIdByName: (needle: string) => string | null;
  }) => CreateWorkPlanPayload | null;
};

function firstAgent(map: Record<string, number | string>): number | string | null {
  for (const value of Object.values(map)) {
    if (value != null && value !== "") return value;
  }
  return null;
}

function agentPk(map: Record<string, number | string>, slug: string): number | string | null {
  const value = map[slug];
  return value != null ? value : null;
}

function pickAgent(map: Record<string, number | string>, slugs: string[]): number | string | null {
  for (const slug of slugs) {
    const hit = agentPk(map, slug);
    if (hit != null) return hit;
  }
  return firstAgent(map);
}

/**
 * Plantillas genéricas. No dependen de un cliente ni de un slug de producción.
 * Sirven como punto de partida en cualquier sucursal que ya tenga un agente.
 */
export const WORK_PLAN_TEMPLATES: WorkPlanTemplate[] = [
  {
    id: "availability",
    label: "Consulta de disponibilidad",
    description: "Nota de seguridad y dos preguntas. No reserva ni escribe en sistemas externos.",
    requiresHint: "Necesitas al menos un agente en esta sucursal.",
    agentSlugs: [],
    build: ({ agentIdBySlug }) => {
      const agent = firstAgent(agentIdBySlug);
      if (agent == null) return null;
      return {
        name: "Consulta de disponibilidad",
        description:
          "Revisa horarios o capacidad con el agente. No crees reservas ni escrituras sin confirmación.",
        assigned_agent: agent,
        context: { example: true },
        items: [
          {
            title: "Aviso",
            kind: "note",
            sort_order: 0,
            payload: {
              text: "Ejemplo: solo informar disponibilidad. No reserves ni modifiques datos reales.",
            },
          },
          {
            title: "Ventanas libres",
            kind: "agent_turn",
            sort_order: 1,
            payload: {
              message:
                "Resume las próximas ventanas libres de hoy o mañana usando las herramientas de esta sucursal. No reserves nada.",
            },
          },
          {
            title: "Próxima opción",
            kind: "agent_turn",
            sort_order: 2,
            payload: {
              message:
                "Indica la próxima opción disponible. Solo informa. No crees la reserva ni confirmes una escritura.",
            },
          },
        ],
      };
    },
  },
  {
    id: "ops-checklist",
    label: "Checklist operativo",
    description: "Nota, un resumen del agente y, si existe, un workflow de checklist.",
    requiresHint: "Necesitas al menos un agente en esta sucursal.",
    agentSlugs: [],
    workflowNameIncludes: "checklist",
    build: ({ agentIdBySlug, workflowIdByName }) => {
      const primary = pickAgent(agentIdBySlug, []);
      if (primary == null) return null;
      const wfId = workflowIdByName("checklist");
      const items: NonNullable<CreateWorkPlanPayload["items"]> = [
        {
          title: "Aviso",
          kind: "note",
          sort_order: 0,
          payload: {
            text: "Ejemplo operativo: resume y clasifica. No abras tickets reales ni ejecutes escrituras.",
          },
        },
        {
          title: "Resumen de la semana",
          kind: "agent_turn",
          sort_order: 1,
          assigned_agent: primary,
          payload: {
            message:
              "Resume en 5 puntos lo que esta sucursal debería revisar esta semana, usando solo el conocimiento y las herramientas disponibles. No inventes normativa ni datos.",
          },
        },
      ];
      if (wfId) {
        items.push({
          title: "Workflow de checklist",
          kind: "workflow",
          sort_order: items.length,
          payload: {
            workflow_id: wfId,
            workflow_name: "Checklist operativo",
          },
        });
      }
      items.push({
        title: "Triage de ejemplo",
        kind: "agent_turn",
        sort_order: items.length,
        assigned_agent: primary,
        payload: {
          message:
            "Haz un triage de ejemplo: alguien reporta una alerta operativa. Clasifica prioridad y sugiere pasos. No crees un ticket real.",
        },
      });
      return {
        name: "Checklist operativo",
        description:
          "Plan de ejemplo: resumen, checklist si hay workflow, y un triage sin escrituras.",
        assigned_agent: primary,
        workflow: wfId,
        context: { example: true },
        items,
      };
    },
  },
  {
    id: "daily-digest",
    label: "Resumen del día",
    description:
      "Nota y un digest. Usa un workflow cuyo nombre incluya “digest”, o el agente de la sucursal.",
    requiresHint: "Necesitas un agente o un workflow de digest en esta sucursal.",
    agentSlugs: [],
    workflowNameIncludes: "digest",
    build: ({ agentIdBySlug, workflowIdByName }) => {
      const agent = firstAgent(agentIdBySlug);
      const wfId = workflowIdByName("digest");
      if (agent == null && !wfId) return null;
      const items: NonNullable<CreateWorkPlanPayload["items"]> = [
        {
          title: "Nota",
          kind: "note",
          sort_order: 0,
          payload: {
            text: "Ejemplo: resumen del día. Solo lectura, sin acciones destructivas.",
          },
        },
      ];
      if (wfId) {
        items.push({
          title: "Ejecutar resumen",
          kind: "workflow",
          sort_order: 1,
          payload: {
            workflow_id: wfId,
            workflow_name: "Resumen del día",
          },
        });
      } else if (agent != null) {
        items.push({
          title: "Resumen del día",
          kind: "agent_turn",
          sort_order: 1,
          assigned_agent: agent,
          payload: {
            message:
              "Genera un resumen corto del día: lo relevante, lo que se desvió y qué conviene mirar. No ejecutes cambios.",
          },
        });
      }
      return {
        name: "Resumen del día",
        description: "Ejecuta un resumen diario (workflow o turno de agente).",
        assigned_agent: agent,
        workflow: wfId,
        context: { example: true },
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
  const hasNamedAgent =
    template.agentSlugs.length > 0 &&
    template.agentSlugs.some((slug) => agentSlugsPresent.has(slug));
  const hasAnyAgent = agentSlugsPresent.size > 0;
  const hasAgent = template.agentSlugs.length === 0 ? hasAnyAgent : hasNamedAgent;
  const hasWf =
    !!template.workflowNameIncludes &&
    workflowNames.some((name) =>
      name.toLowerCase().includes(template.workflowNameIncludes!.toLowerCase()),
    );
  if (template.id === "daily-digest") {
    if (hasAgent || hasWf) return { available: true };
    return { available: false, reason: template.requiresHint };
  }
  if (!hasAgent) return { available: false, reason: template.requiresHint };
  return { available: true };
}
