import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_PX = 96;

type Options = {
  /** Durante streaming preferir scroll instantáneo (evita pelear con smooth). */
  behavior?: ScrollBehavior;
};

/** Auto-scroll solo si el usuario ya está cerca del fondo; expone botón “bajar”. */
export function useStickyChatScroll(deps: unknown[], options?: Options) {
  const viewportRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const behavior = options?.behavior ?? "smooth";
  const measureRaf = useRef<number | null>(null);

  const bindViewport = useCallback((node: HTMLElement | null) => {
    viewportRef.current = node;
  }, []);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = dist <= NEAR_BOTTOM_PX;
    stickToBottomRef.current = near;
    setShowJump(!near);
  }, []);

  const scheduleMeasure = useCallback(() => {
    if (measureRaf.current != null) return;
    measureRaf.current = requestAnimationFrame(() => {
      measureRaf.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => scheduleMeasure();
    el.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (measureRaf.current != null) cancelAnimationFrame(measureRaf.current);
    };
  }, [measure, scheduleMeasure]);

  useEffect(() => {
    if (!stickToBottomRef.current) {
      scheduleMeasure();
      return;
    }
    endRef.current?.scrollIntoView({ behavior, block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are the scroll triggers
  }, deps);

  const scrollToBottom = useCallback((behaviorOverride?: ScrollBehavior) => {
    stickToBottomRef.current = true;
    setShowJump(false);
    endRef.current?.scrollIntoView({
      behavior: behaviorOverride ?? "smooth",
      block: "end",
    });
  }, []);

  return { endRef, bindViewport, showJump, scrollToBottom, measure };
}
