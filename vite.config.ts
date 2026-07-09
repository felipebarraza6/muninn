import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// En desarrollo local apuntamos a la API de producción. Ahora usamos token en
// header Authorization, así que no necesitamos HTTPS local ni reescribir cookies.
export default defineConfig({
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
        target: "https://api.agenciapatagoniachile.com",
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
    sourcemap: true,
  },
});
