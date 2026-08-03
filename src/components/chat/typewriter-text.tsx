import { useEffect, useReducer, useRef, useState } from "react";
import type { ReactNode } from "react";

const typedIds = new Set<string>();
const activeIds = new Set<string>();
const listeners = new Set<() => void>();

function notifyTyping() {
  listeners.forEach((l) => l());
}

export function TypewriterText({
  id,
  text,
  streaming = false,
  children,
}: {
  id?: string;
  text: string;
  streaming?: boolean;
  children?: ReactNode;
}) {
  const [done, setDone] = useState(() => (id ? typedIds.has(id) : false));
  const textRef = useRef(text);
  textRef.current = text;
  const spanRef = useRef<HTMLSpanElement>(null);
  const revealedRef = useRef(0);

  useEffect(() => {
    if (done) return;
    const el = spanRef.current;
    if (!el) return;

    if (id) {
      activeIds.add(id);
      notifyTyping();
    }

    const currentLen = el.textContent?.length ?? 0;
    if (currentLen > revealedRef.current) revealedRef.current = currentLen;

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = textRef.current;
      const r = revealedRef.current;
      if (r < full.length) {
        revealedRef.current = r + 1;
        el.textContent = full.slice(0, revealedRef.current);
        timer = setTimeout(tick, 28 + Math.random() * 42);
      } else if (streaming) {
        timer = setTimeout(tick, 120);
      } else {
        if (id) {
          typedIds.add(id);
          activeIds.delete(id);
        }
        notifyTyping();
        setDone(true);
      }
    };
    timer = setTimeout(tick, 60);

    return () => {
      clearTimeout(timer);
      if (id && activeIds.delete(id)) notifyTyping();
    };
  }, [done, streaming, id]);

  if (done) return <>{children}</>;

  return (
    <span className="text-foreground/90">
      <span ref={spanRef} />
      <span className="inline-block w-[3px] h-[1.1em] ml-1 align-[-0.1em] bg-primary rounded-sm animate-pulse" />
    </span>
  );
}

export function useTypingListener() {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => {
      listeners.delete(force);
    };
  }, []);
}

export function useAnyTyping() {
  useTypingListener();
  return activeIds.size > 0;
}

export function isTypingId(id: string) {
  return activeIds.has(id);
}

export function markAllTyped(ids: string[]) {
  for (const id of ids) typedIds.add(id);
}

export function clearTypingSeen() {
  if (typedIds.size > 2000) typedIds.clear();
}

export function hasActiveTyping() {
  return activeIds.size > 0;
}
