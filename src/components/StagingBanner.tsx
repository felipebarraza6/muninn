import { resolveAppEnv, type AppEnv } from "@/lib/appEnv";

export function StagingBanner({ env }: { env?: AppEnv }) {
  const resolved = env ?? resolveAppEnv();
  if (resolved !== "staging") return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed right-3 bottom-3 z-[200] rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold tracking-wide text-black shadow-lg"
    >
      Staging
    </div>
  );
}
