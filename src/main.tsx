import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./styles.css";

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Prompt suave: el usuario puede recargar cuando quiera.
    console.info("[pwa] Hay una versión nueva. Recargá para actualizar.");
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
