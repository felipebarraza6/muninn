/** Defaults y normalización de `Workflow.trigger_config` por tipo de trigger. */

export type TriggerConfigDraft = {
  cron_expression: string;
  timezone: string;
  webhook_path: string;
  webhook_secret: string;
  event_name: string;
  event_source: string;
};

export function emptyTriggerConfigDraft(): TriggerConfigDraft {
  return {
    cron_expression: "0 9 * * 1-5",
    timezone: "America/Santiago",
    webhook_path: "",
    webhook_secret: "",
    event_name: "",
    event_source: "",
  };
}

export function draftFromTriggerConfig(
  triggerType: string,
  config: Record<string, unknown> | null | undefined,
): TriggerConfigDraft {
  const c = config ?? {};
  const base = emptyTriggerConfigDraft();
  return {
    cron_expression: String(c.cron_expression ?? c.cron ?? base.cron_expression),
    timezone: String(c.timezone ?? c.tz ?? base.timezone),
    webhook_path: String(c.path ?? c.webhook_path ?? c.url_path ?? ""),
    webhook_secret: String(c.secret ?? c.webhook_secret ?? ""),
    event_name: String(c.event_name ?? c.event ?? c.name ?? ""),
    event_source: String(c.event_source ?? c.source ?? c.app ?? ""),
  };
}

/** Payload listo para PATCH; `null` si el tipo no necesita config. */
export function triggerConfigPayload(
  triggerType: string,
  draft: TriggerConfigDraft,
): Record<string, unknown> | null {
  const t = (triggerType || "manual").toLowerCase();
  if (t === "manual") return {};
  if (t === "cron") {
    return {
      cron_expression: draft.cron_expression.trim() || "0 9 * * 1-5",
      timezone: draft.timezone.trim() || "America/Santiago",
    };
  }
  if (t === "webhook") {
    const out: Record<string, unknown> = {};
    if (draft.webhook_path.trim()) out.path = draft.webhook_path.trim();
    if (draft.webhook_secret.trim()) out.secret = draft.webhook_secret.trim();
    return out;
  }
  if (t === "event") {
    const out: Record<string, unknown> = {};
    if (draft.event_name.trim()) out.event_name = draft.event_name.trim();
    if (draft.event_source.trim()) out.event_source = draft.event_source.trim();
    return out;
  }
  // Campañas / tipos futuros: conservar lo que el usuario haya editado en campos genéricos.
  return {
    ...(draft.cron_expression.trim() ? { cron_expression: draft.cron_expression.trim() } : {}),
    ...(draft.event_name.trim() ? { event_name: draft.event_name.trim() } : {}),
  };
}

export function triggerConfigNeedsFields(triggerType: string): boolean {
  const t = (triggerType || "manual").toLowerCase();
  return t === "cron" || t === "webhook" || t === "event" || t.startsWith("campaign_");
}
