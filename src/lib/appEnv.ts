export type AppEnv = "development" | "staging" | "production";

type AppEnvInput = {
  DEV?: boolean;
  VITE_APP_ENV?: string;
};

export function resolveAppEnv(input?: AppEnvInput): AppEnv {
  const env = input ?? import.meta.env;
  if (env.DEV) return "development";
  const raw = String(env.VITE_APP_ENV ?? "")
    .trim()
    .toLowerCase();
  if (raw === "staging") return "staging";
  return "production";
}

export function isStagingApp(input?: AppEnvInput): boolean {
  return resolveAppEnv(input) === "staging";
}
