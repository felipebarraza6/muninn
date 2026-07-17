import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import RootLayout from "./routes/__root";
import Dashboard from "./routes/index";
import Conversaciones from "./routes/conversaciones";
import Campanas from "./routes/campanas";
import CampanasDetail from "./routes/campanas.$id";
import Oportunidades from "./routes/oportunidades";
import Reportes from "./routes/reportes";
import Configuracion from "./routes/configuracion";
import MetricasDetail from "./routes/metricas.$id";
import Agentes from "./routes/agentes";
import AgentesNuevo from "./routes/agentes.nuevo";
import AgentesDetail from "./routes/agentes.$id";
import AgentesChat from "./routes/agentes.$id.chat";
import ChatPage from "./routes/chat";
import Canales from "./routes/canales";
import CanalesDetail from "./routes/canales.$id";
import APIs from "./routes/apis";
import APIDetail from "./routes/apis.$id";
import Funciones from "./routes/funciones";
import FunctionDetail from "./routes/funciones.$id";
import Conocimiento from "./routes/conocimiento";
import ConocimientoDatos from "./routes/conocimiento.datos";
import EmbedChat from "./routes/embed.chat.$id";
import Login from "./routes/login";
import AdminLlmPage from "./routes/admin.llm";
import AdminOrganizacionesPage from "./routes/admin.organizaciones";
import AdminSucursalesPage from "./routes/admin.sucursales";
import AdminUsuariosPage from "./routes/admin.usuarios";
import PerfilPage from "./routes/perfil";
import { RequireAuth, RedirectIfAuthenticated } from "./components/auth/RequireAuth";
import { RequireSuperAdmin } from "./components/auth/RequireSuperAdmin";
import { RequireUsersAdmin } from "./components/auth/RequireUsersAdmin";
import { RequireBranchesAdmin } from "./components/auth/RequireBranchesAdmin";
import { RequireOrganizationsAdmin } from "./components/auth/RequireOrganizationsAdmin";
import { RequireLlmAdmin } from "./components/auth/RequireLlmAdmin";
import { RequireKnowledgeCatalog } from "./components/auth/RequireKnowledgeCatalog";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
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
          <Route path="/apis" element={<APIs />} />
          <Route path="/apis/:id" element={<APIDetail />} />
          <Route path="/funciones" element={<Funciones />} />
          <Route path="/funciones/:id" element={<FunctionDetail />} />
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
          <Route path="/conversaciones" element={<Conversaciones />} />
          <Route path="/campanas" element={<Campanas />} />
          <Route path="/campanas/:id" element={<CampanasDetail />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/metricas/:id" element={<MetricasDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
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
      <Route path="/embed/chat/:id" element={<EmbedChat />} />
      <Route element={<RequireAuth />}>
        <Route element={<RootLayout />}>
          <Route path="/*" element={<AnimatedOutlet />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
