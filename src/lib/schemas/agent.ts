import { z } from "zod";

export const agentFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  agent_type: z.string().min(1),
  system_prompt: z.string().optional().default(""),
  welcome_message: z.string().optional().default(""),
  llm_provider: z.string().optional().nullable(),
  llm_model: z.string().optional().nullable(),
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().int().min(1).max(8192),
  use_rag: z.boolean(),
  rag_top_k: z.number().int().min(1).max(50),
  embedding_model: z.string().optional().default(""),
  semantic_weight: z.number().min(0).max(1),
  use_semantic_search: z.boolean(),
  is_active: z.boolean(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;
