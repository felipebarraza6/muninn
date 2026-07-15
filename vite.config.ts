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
