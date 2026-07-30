import type { AgentFunction, JsonSchemaProperty } from "@/api/hooks/useAgentFunctions";

/** Parámetros required que el usuario debe completar (source free o sin source). */
export function getSkillRequiredFreeParams(fn: AgentFunction | undefined): Array<{
  key: string;
  label: string;
  description?: string;
  type?: string;
}> {
  if (!fn?.parameters_schema?.properties) return [];
  const props = fn.parameters_schema.properties as Record<string, JsonSchemaProperty>;
  const required = Array.isArray(fn.parameters_schema.required)
    ? fn.parameters_schema.required.map(String)
    : Object.keys(props);
  const sources = fn.config?.parameter_sources ?? {};

  return required
    .filter((key) => {
      if (!props[key]) return false;
      const src = sources[key];
      if (!src || src.source === "free") return true;
      return false;
    })
    .map((key) => ({
      key,
      label: key.replace(/[_-]+/g, " "),
      description: props[key]?.description,
      type: props[key]?.type,
    }));
}

export function formatSkillInvocation(slug: string, params: Record<string, string>): string {
  const entries = Object.entries(params).filter(([, v]) => v.trim());
  if (!entries.length) return `/${slug}`;
  const body = entries.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ");
  return `/${slug}(${body})`;
}
