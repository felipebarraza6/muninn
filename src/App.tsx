import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import RootLayout from "./routes/__root";
import { APP_STORE_PATH } from "./lib/applications";
import { RequireAuth, RedirectIfAuthenticated } from "./components/auth/RequireAuth";
import { RequireUsersAdmin } from "./components/auth/RequireUsersAdmin";
import { RequireBranchesAdmin } from "./components/auth/RequireBranchesAdmin";
import { RequireOrganizationsAdmin } from "./components/auth/RequireOrganizationsAdmin";
import { RequireLlmAdmin } from "./components/auth/RequireLlmAdmin";
import { RequireKnowledgeCatalog } from "./components/auth/RequireKnowledgeCatalog";
import { RequireConversations } from "./components/auth/RequireConversations";
import { RequireSkills } from "./components/auth/RequireSkills";
import { RequireSuperAdmin } from "./components/auth/RequireSuperAdmin";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { PageLoader } from "./components/ui/page-loader";
import { LoginPixelBootScreen } from "./components/brand/LoginPixelBoot";
import { Button } from "./components/ui/button";
import { EmptyState } from "./components/ui/empty-state";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PwaUpdatePrompt } from "./components/PwaUpdatePrompt";
import { Toaster } from "./components/ui/sonner";
import { RealtimeProvider } from "./lib/realtime";
import Login from "./routes/login";
import Entrar from "./routes/entrar";

const Dashboard = lazy(() => import("./routes/index"));
const Conversaciones = lazy(() => import("./routes/conversaciones"));
const Agentes = lazy(() => import("./routes/agentes"));
const AgentesNuevo = lazy(() => import("./routes/agentes.nuevo"));
const AgentesDetail = lazy(() => import("./routes/agentes.$id"));
const AgentesChat = lazy(() => import("./routes/agentes.$id.chat"));
const ChatPage = lazy(() => import("./routes/chat"));
const PlanesPage = lazy(() => import("./routes/planes"));
const WorkflowsPage = lazy(() => import("./routes/workflows"));
const WorkflowCanvasPage = lazy(() => import("./routes/workflows.$id"));
const Canales = lazy(() => import("./routes/canales"));
const CanalesDetail = lazy(() => import("./routes/canales.$id"));
const APIs = lazy(() => import("./routes/apis"));
const APIDetail = lazy(() => import("./routes/apis.$id"));
const Funciones = lazy(() => import("./routes/funciones"));
const FuncionesNuevo = lazy(() => import("./routes/funciones.nuevo"));
const FunctionDetail = lazy(() => import("./routes/funciones.$id"));
const Conocimiento = lazy(() => import("./routes/conocimiento"));
const ConocimientoDatos = lazy(() => import("./routes/conocimiento.datos"));
const ConocimientoNuevo = lazy(() => import("./routes/conocimiento.nuevo"));
const ConocimientoDetail = lazy(() => import("./routes/conocimiento.$id"));
const EmbedChat = lazy(() => import("./routes/embed.chat.$id"));
const ForgotPassword = lazy(() => import("./routes/forgot-password"));
const ResetPassword = lazy(() => import("./routes/reset-password"));
const AdminLlmPage = lazy(() => import("./routes/admin.llm"));
const AdminOrganizacionesPage = lazy(() => import("./routes/admin.organizaciones"));
const AdminSucursalesPage = lazy(() => import("./routes/admin.sucursales"));
const AdminUsuariosPage = lazy(() => import("./routes/admin.usuarios"));
const PerfilPage = lazy(() => import("./routes/perfil"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function isAuthBootPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/entrar" ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/app/reset-password")
  );
}

function RouteFallback() {
  const { pathname } = useLocation();
  if (isAuthBootPath(pathname)) {
    return <LoginPixelBootScreen />;
  }
  return (
    <div className="h-dvh w-full bg-background">
      <PageLoader pathname={pathname} label="Cargando" />
    </div>
  );
}

function ApiDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`${APP_STORE_PATH}/${id}`} replace />;
}

function FunctionDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/skills/${id}` : "/skills"} replace />;
}

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <EmptyState
        title="Esta página no existe"
        description="El enlace puede estar roto o la sección se movió. Revisa la URL o vuelve al inicio."
        action={
          <Button asChild size="sm">
            <Link to="/app">Ir al inicio</Link>
          </Button>
        }
      />
    </div>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  // Chat / bandeja: sin fade de ruta (evita “doble animación” y se siente página propia).
  const skipRouteFade =
    location.pathname === "/app/chat" ||
    location.pathname.startsWith("/app/chat/") ||
    location.pathname.startsWith("/app/conversaciones") ||
    location.pathname.startsWith("/app/planes") ||
    location.pathname.startsWith("/app/workflows") ||
    /^\/app\/agentes\/[^/]+\/chat\/?$/.test(location.pathname);

  const routeTree = (
    <Suspense fallback={<RouteFallback />}>
      <ErrorBoundary title="Error en esta pantalla">
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agentes" element={<Agentes />} />
          <Route path="/agentes/nuevo" element={<AgentesNuevo />} />
          <Route path="/agentes/:id" element={<AgentesDetail />} />
          <Route path="/agentes/:id/chat" element={<AgentesChat />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route
            path="/planes"
            element={
              <RequireSuperAdmin>
                <PlanesPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/workflows"
            element={
              <RequireSuperAdmin>
                <WorkflowsPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="/workflows/:id"
            element={
              <RequireSuperAdmin>
                <WorkflowCanvasPage />
              </RequireSuperAdmin>
            }
          />
          <Route path="/canales" element={<Canales />} />
          <Route path="/canales/:id" element={<CanalesDetail />} />
          <Route
            path="/conocimiento"
            element={
              <RequireKnowledgeCatalog>
                <Conocimiento />
              </RequireKnowledgeCatalog>
            }
          />
          <Route
            path="/conocimiento/nuevo"
            element={
              <RequireKnowledgeCatalog>
                <ConocimientoNuevo />
              </RequireKnowledgeCatalog>
            }
          />
          <Route
            path="/conocimiento/datos"
            element={
              <RequireKnowledgeCatalog>
                <ConocimientoDatos />
              </RequireKnowledgeCatalog>
            }
          />
          <Route
            path="/conocimiento/:id"
            element={
              <RequireKnowledgeCatalog>
                <ConocimientoDetail />
              </RequireKnowledgeCatalog>
            }
          />
          <Route path="/aplicaciones" element={<APIs />} />
          <Route path="/aplicaciones/:id" element={<APIDetail />} />
          <Route path="/apis" element={<Navigate to={APP_STORE_PATH} replace />} />
          <Route path="/apis/:id" element={<ApiDetailRedirect />} />
          <Route
            path="/skills"
            element={
              <RequireSkills>
                <Funciones />
              </RequireSkills>
            }
          />
          <Route
            path="/skills/nuevo"
            element={
              <RequireSkills>
                <FuncionesNuevo />
              </RequireSkills>
            }
          />
          <Route
            path="/skills/:id"
            element={
              <RequireSkills>
                <FunctionDetail />
              </RequireSkills>
            }
          />
          <Route path="/funciones" element={<Navigate to="/app/skills" replace />} />
          <Route path="/funciones/nuevo" element={<Navigate to="/app/skills/nuevo" replace />} />
          <Route path="/funciones/:id" element={<FunctionDetailRedirect />} />
          <Route path="/configuracion" element={<Navigate to="/app/perfil" replace />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route
            path="/admin/organizaciones"
            element={
              <RequireOrganizationsAdmin>
                <AdminOrganizacionesPage />
              </RequireOrganizationsAdmin>
            }
          />
          <Route
            path="/admin/llm"
            element={
              <RequireLlmAdmin>
                <AdminLlmPage />
              </RequireLlmAdmin>
            }
          />
          <Route
            path="/admin/sucursales"
            element={
              <RequireBranchesAdmin>
                <AdminSucursalesPage />
              </RequireBranchesAdmin>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <RequireUsersAdmin>
                <AdminUsuariosPage />
              </RequireUsersAdmin>
            }
          />
          <Route
            path="/conversaciones"
            element={
              <RequireConversations>
                <Conversaciones />
              </RequireConversations>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );

  if (skipRouteFade) {
    return <div className="min-h-0 h-full">{routeTree}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
        className="min-h-0"
      >
        {routeTree}
      </motion.div>
    </AnimatePresence>
  );
}

/** Transición Jules: landing (/) ↔ auth (/entrar). */
function MuninnGateLayout() {
  const location = useLocation();
  return (
    <RedirectIfAuthenticated>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: location.pathname === "/entrar" ? 20 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: location.pathname === "/entrar" ? -14 : 20 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-dvh"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </RedirectIfAuthenticated>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MuninnGateLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/entrar" element={<Entrar />} />
        </Route>
        <Route
          path="/forgot-password"
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/forgot-password/:slug"
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          }
        />
        {/* Compat con emails viejos que usaban /app/reset-password/... */}
        <Route
          path="/app/reset-password/:token"
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/embed/chat/:id" element={<EmbedChat />} />
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            <Route path="/app/*" element={<AnimatedOutlet />} />
          </Route>
        </Route>
        {/* Org-specific landing: /:slug (must be after all explicit routes) */}
        <Route
          path="/:slug"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary title="Error en la aplicación">
            <BrowserRouter>
              <RealtimeProvider>
                <AppRoutes />
                <Toaster position="top-right" />
                <PwaUpdatePrompt />
              </RealtimeProvider>
            </BrowserRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
