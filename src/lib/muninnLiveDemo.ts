/** Evento: easter egg / CTA → foco en demo en vivo. */
export const MUNINN_LIVE_DEMO_EVENT = "muninn-live-demo";

export function dispatchMuninnLiveDemo() {
  window.dispatchEvent(new CustomEvent(MUNINN_LIVE_DEMO_EVENT));
}
