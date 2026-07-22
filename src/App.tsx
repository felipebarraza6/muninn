import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
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
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { PageLoader } from "./components/ui/page-loader";

const Dashboard = lazy(() => import("./routes/index"));
const Conversaciones = lazy(() => import("./routes/conversaciones"));
const Campanas = lazy(() => import("./routes/campanas"));
const CampanasDetail = lazy(() => import("./routes/campanas.$id"));
const Oportunidades = lazy(() => import("./routes/oportunidades"));
const Reportes = lazy(() => import("./routes/reportes"));
const Configuracion = lazy(() => import("./routes/configuracion"));
const MetricasDetail = lazy(() => import("./routes/metricas.$id"));
const Agentes = lazy(() => import("./routes/agentes"));
const AgentesNuevo = lazy(() => import("./routes/agentes.nuevo"));
const AgentesDetail = lazy(() => import("./routes/agentes.$id"));
const AgentesChat = lazy(() => import("./routes/agentes.$id.chat"));
const ChatPage = lazy(() => import("./routes/chat"));
const Canales = lazy(() => import("./routes/canales"));
const CanalesDetail = lazy(() => import("./routes/canales.$id"));
const APIs = lazy(() => import("./routes/apis"));
const APIDetail = lazy(() => import("./routes/apis.$id"));
const Funciones = lazy(() => import("./routes/funciones"));
const FuncionesNuevo = lazy(() => import("./routes/funciones.nuevo"));
const FunctionDetail = lazy(() => import("./routes/funciones.$id"));
const Conocimiento = lazy(() => import("./routes/conocimiento"));
const ConocimientoDatos = lazy(() => import("./routes/conocimiento.datos"));
const EmbedChat = lazy(() => import("./routes/embed.chat.$id"));
const Login = lazy(() => import("./routes/login"));
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

function RouteFallback() {
  return <PageLoader label="Cargando" />;
}

function ApiDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`${APP_STORE_PATH}/${id}`} replace />;
}

function FunctionDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/skills/${id}` : "/skills"} replace />;
}

function AnimatedOutlet() {
  const location = useLocation();
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
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agentes" element={<Agentes />} />
            <Route path="/agentes/nuevo" element={<AgentesNuevo />} />
            <Route path="/agentes/:id" element={<AgentesDetail />} />
            <Route path="/agentes/:id/chat" element={<AgentesChat />} />
            <Route path="/chat" element={<ChatPage />} />
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
              path="/conocimiento/datos"
              element={
                <RequireKnowledgeCatalog>
                  <ConocimientoDatos />
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
            <Route path="/funciones" element={<Navigate to="/skills" replace />} />
            <Route path="/funciones/nuevo" element={<Navigate to="/skills/nuevo" replace />} />
            <Route path="/funciones/:id" element={<FunctionDetailRedirect />} />
            <Route path="/configuracion" element={<Configuracion />} />
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
            {/* Rutas ERP ocultas del nav; se mantienen accesibles por URL temporalmente */}
            <Route
              path="/conversaciones"
              element={
                <RequireConversations>
                  <Conversaciones />
                </RequireConversations>
              }
            />
            <Route path="/campanas" element={<Campanas />} />
            <Route path="/campanas/:id" element={<CampanasDetail />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/metricas/:id" element={<MetricasDetail />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login/:slug"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
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
            <Route path="/*" element={<AnimatedOutlet />} />
          </Route>
        </Route>
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
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
