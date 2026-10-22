import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearSession, getStoredUser, isAuthenticated } from "@/lib/authSession";

export function RequireAuth() {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Modo token: user en localStorage sin credencial → UI a medias; limpiar.
    if (getStoredUser()) clearSession();
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}
