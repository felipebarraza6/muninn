import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

/**
 * Registra el service worker y ofrece recargar cuando hay versión nueva.
 * Debe montarse bajo un árbol que ya tenga `<Toaster />`.
 */
export function PwaUpdatePrompt() {
  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        toast("Nueva versión disponible", {
          description: "Recarga para usar la última versión de la app.",
          duration: Infinity,
          action: {
            label: "Recargar",
            onClick: () => {
              void updateSW(true);
            },
          },
        });
      },
    });
  }, []);

  return null;
}
