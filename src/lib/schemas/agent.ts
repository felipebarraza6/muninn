import { z } from "zod";

export const agentFormSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(120, "Máximo 120 caracteres"),
  slug: z
    .string()
    .trim()
    .min(1, "Identificador requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones (ej: mi-agente)"),
  agent_type: z.string().min(1),
  system_prompt: z
    .string()
    .trim()
    .min(20, "Describe al menos personalidad y reglas del agente (SOUL.md)"),
  welcome_message: z.string(),
  llm_provider: z
    .string({ required_error: "Selecciona un proveedor" })
    .min(1, "Selecciona un proveedor"),
  llm_model: z.string({ required_error: "Selecciona un modelo" }).min(1, "Selecciona un modelo"),
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().int().min(1).max(8192),
  max_tool_iterations: z.number().int().min(1).max(8),
  icon: z.string().max(64),
  color: z.string().max(32),
  /** Vacío = visible para todos los roles con acceso. */
  allowed_roles: z.array(z.string()),
  use_rag: z.boolean(),
  rag_top_k: z.number().int().min(1).max(50),
  embedding_model: z.string(),
  semantic_weight: z.number().min(0).max(1),
  use_semantic_search: z.boolean(),
  is_active: z.boolean(),
  requests_per_minute: z.number().int().min(1).optional().nullable(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;
