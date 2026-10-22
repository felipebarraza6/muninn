import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { clearSession, getStoredUser, isAuthenticated } from "@/lib/authSession";
import { resolveSafeNextPath, withNextParam } from "@/lib/safeNextPath";

export function RequireAuth() {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Modo token: user en localStorage sin credencial → UI a medias; limpiar.
    if (getStoredUser()) clearSession();
    const from = `${location.pathname}${location.search || ""}`;
    return (
      <Navigate
        to={withNextParam("/entrar", from.startsWith("/app") ? from : null) || "/entrar"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  return <Outlet />;
}

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const [params] = useSearchParams();
  if (isAuthenticated()) {
    const next = resolveSafeNextPath(params.get("next"));
    return <Navigate to={next || "/app"} replace />;
  }
  return <>{children}</>;
}
