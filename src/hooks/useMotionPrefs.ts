import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

function subscribeMotionAttr(onStoreChange: () => void) {
  if (typeof document === "undefined") return () => {};
  const root = document.documentElement;
  const obs = new MutationObserver(onStoreChange);
  obs.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
  return () => obs.disconnect();
}

function getMotionAttrSnapshot() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-motion") === "off";
}

/**
 * Combina prefers-reduced-motion (Framer) con el flag de tema `data-motion="off"`.
 * Usar en lugar de `useReducedMotion()` solo en pantallas nuevas del studio.
 */
export function useMotionPrefs(): boolean {
  const osReduced = useReducedMotion();
  const themeOff = useSyncExternalStore(subscribeMotionAttr, getMotionAttrSnapshot, () => false);
  return Boolean(osReduced || themeOff);
}
