import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// En desarrollo el proxy /api apunta a la API local (por defecto localhost:8000).
// Override con VITE_DEV_API_PROXY en .env.local si el backend usa otro host/puerto.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devApiProxy = env.VITE_DEV_API_PROXY || "http://localhost:8000";

  return {
    plugins: [
      react({
        include: "**/*.{jsx,js,tsx,ts}",
      }),
      tailwindcss(),
      tsConfigPaths(),
    ],
    server: {
      port: 3001,
      host: "0.0.0.0",
      strictPort: true,
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api": {
          target: devApiProxy,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            // by-host lee HTTP_HOST: reinyecta el Host del SPA (custom domain local).
            proxy.on("proxyReq", (proxyReq, req) => {
              const url = req.url || "";
              if (!url.includes("public-login-theme/by-host")) return;
              const originalHost = req.headers.host;
              if (originalHost) {
                proxyReq.setHeader("Host", originalHost);
                proxyReq.setHeader("X-Forwarded-Host", originalHost);
              }
            });
          },
        },
      },
    },
    preview: {
      port: 3001,
      host: "0.0.0.0",
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
    },
  };
});
