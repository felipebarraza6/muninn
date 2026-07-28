import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// En desarrollo el proxy /api apunta a la API local (por defecto localhost:8000).
// Override con VITE_DEV_API_PROXY en .env.local si el backend usa otro host/puerto.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devApiProxy = env.VITE_DEV_API_PROXY || "http://localhost:8000";
  const appName = env.VITE_PWA_NAME || "Muninn";
  const themeColor = env.VITE_PWA_THEME_COLOR || "#0b1210";

  // Builds de producción/preview deben declarar la API del tenant (void ≠ clinica).
  if (mode === "production" && !String(env.VITE_API_URL || "").trim()) {
    throw new Error(
      "VITE_API_URL es obligatoria en build production (ej. https://api.example.com/api).",
    );
  }

  // Base path para deploy en subdirectorio (ej. GitHub Pages → /muninn/).
  const basePath = env.VITE_BASE_PATH || "/";

  return { base: basePath,
    plugins: [
      react({
        include: "**/*.{jsx,js,tsx,ts}",
      }),
      tailwindcss(),
      tsConfigPaths(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["favicon.png"],
        manifest: {
          name: appName,
          short_name: appName,
          description: "Agentes especializados",
          theme_color: themeColor,
          background_color: themeColor,
          display: "standalone",
          orientation: "any",
          start_url: "/",
          scope: "/",
          lang: "es",
          icons: [
            {
              src: "/favicon.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/favicon.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/media\//],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
              handler: "NetworkOnly",
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/media/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "media-cache",
                expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
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
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              if (id.includes("/src/routes/admin.")) return "admin";
              if (
                id.includes("/src/routes/agentes") ||
                id.includes("/src/routes/chat") ||
                id.includes("/src/components/agent-chat") ||
                id.includes("/src/components/conversations/")
              ) {
                return "studio-chat";
              }
              return undefined;
            }
            if (
              /node_modules[/\\](react|react-dom|scheduler|react-router|react-router-dom)([/\\]|$)/.test(
                id,
              ) ||
              /node_modules[/\\]@radix-ui[/\\]/.test(id)
            ) {
              return "vendor-react";
            }
            if (id.includes("@tanstack")) return "vendor-query";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
            return undefined;
          },
        },
      },
    },
  };
});
