import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_PX = 96;

/** Auto-scroll solo si el usuario ya está cerca del fondo; expone botón “bajar”. */
export function useStickyChatScroll(deps: unknown[]) {
  const viewportRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

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

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => el.removeEventListener("scroll", onScroll);
  }, [measure]);

  useEffect(() => {
    if (!stickToBottomRef.current) {
      measure();
      return;
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are the scroll triggers
  }, deps);

  const scrollToBottom = useCallback(() => {
    stickToBottomRef.current = true;
    setShowJump(false);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return { endRef, bindViewport, showJump, scrollToBottom, measure };
}
