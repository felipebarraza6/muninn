/**
 * Tipos del dominio Muninn alineados a Yggdra OpenAPI (ai-agents / branches / auth).
 * Fuentes: AgentConfig, BranchThemeConfig, PublicLoginTheme, etc.
 *
 * Regenerar el schema completo (opcional, CI/local):
 *   bun run generate:api-types
 */
export type AgentConfig = {
  id: number;
  name: string;
  slug?: string | null;
  agent_type?: string | null;
  description?: string | null;
  system_prompt?: string | null;
  welcome_message?: string | null;
  llm_provider?: number | string | null;
  llm_provider_name?: string | null;
  llm_model?: number | string | null;
  llm_model_name?: string | null;
  temperature?: number | null;
  max_tokens?: number | null;
  use_rag?: boolean;
  rag_top_k?: number | null;
  embedding_model?: string | null;
  semantic_weight?: number | null;
  use_semantic_search?: boolean;
  status?: string | null;
  is_active?: boolean;
  functions?: (number | string)[];
  knowledge_documents?: (number | string)[];
};

export type BranchThemeConfig = {
  id?: number;
  branch?: number;
  app_name?: string | null;
  logo?: string | null;
  favicon?: string | null;
  tagline?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  algorithm?: "light" | "dark" | string | null;
  branding?: Record<string, unknown>;
  ui_preferences?: Record<string, unknown>;
};

export type PublicLoginTheme = BranchThemeConfig & {
  branch_name?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  welcome_message?: string | null;
  subtitle?: string | null;
};

export type ExternalAPIConfig = {
  id: string | number;
  name: string;
  base_url?: string | null;
  auth_type?: string | null;
  is_active?: boolean;
};

export type AgentFunctionConfig = {
  id: string | number;
  name: string;
  slug?: string | null;
  description?: string | null;
  is_active?: boolean;
  parameters_schema?: Record<string, unknown>;
  return_schema?: Record<string, unknown>;
};
