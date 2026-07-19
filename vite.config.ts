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
          // SSE (chat stream): no bufferizar la respuesta.
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
            proxy.on("proxyRes", (proxyRes, _req, res) => {
              const ct = String(proxyRes.headers["content-type"] || "");
              if (ct.includes("text/event-stream")) {
                res.setHeader("Cache-Control", "no-cache");
                res.setHeader("X-Accel-Buffering", "no");
              }
            });
          },
        },
        // Logos / favicons / banners (ImageField → /media/...)
        "/media": {
          target: devApiProxy,
          changeOrigin: true,
          secure: false,
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
