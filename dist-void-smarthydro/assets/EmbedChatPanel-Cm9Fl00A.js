import { r as o, j as e } from "./vendor-react-DUYfdZnL.js";
import {
  P as F,
  bK as K,
  b as V,
  c as b,
  dj as z,
  bQ as y,
  V as E,
  B,
  a7 as _,
  ch as G,
  dg as L,
  de as Q,
  dF as H,
  dl as O,
} from "./studio-chat-Bi-RYdat.js";
import { u as Y, b as J } from "./vendor-query-IAyuTf1L.js";
const W = ["ai-agents", "public-chat"];
function X(s) {
  return `yggdra_embed_uid_${s}`;
}
function Z(s) {
  try {
    const a = X(s),
      i = localStorage.getItem(a);
    if (i) return i;
    const r =
      typeof crypto < "u" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return (localStorage.setItem(a, r), r);
  } catch {
    return `guest_${Date.now()}`;
  }
}
function ee(s) {
  return Y({
    queryKey: [...W, "config", s],
    queryFn: () =>
      K(`/ai-agents/public/channels/${s}/config/`, { skipAuth: !0, skipBranchHeader: !0 }),
    enabled: !!s,
    staleTime: 300 * 1e3,
    retry: 1,
  });
}
function te(s) {
  return J({
    mutationFn: (a) => {
      const i = s ? Z(s) : "anonymous";
      return F(
        `/ai-agents/public/channels/${s}/message/`,
        {
          user_id: i,
          user_name: a.user_name || "Visitante",
          message: a.message,
          ...(a.email ? { email: a.email } : {}),
        },
        { skipAuth: !0, skipBranchHeader: !0 },
      );
    },
  });
}
function ne({ channelId: s, className: a, compact: i = !1 }) {
  const { data: r, isLoading: M, error: $ } = ee(s),
    x = te(s),
    [j, u] = o.useState([]),
    [f, g] = o.useState(""),
    [v, I] = o.useState(""),
    [w, U] = o.useState(""),
    [N, C] = o.useState(!1),
    q = o.useRef(null),
    h = !!r?.require_name,
    p = !!r?.require_email,
    n = r?.primary_color || "#2dd4bf",
    D = r?.title || r?.name || "Chat",
    P = r?.agent_name || r?.agent?.name;
  (o.useEffect(() => {
    !h && !p && C(!0);
  }, [h, p]),
    o.useEffect(() => {
      r?.welcome_message &&
        j.length === 0 &&
        N &&
        u([
          { id: "welcome", role: "assistant", content: r.welcome_message, timestamp: new Date() },
        ]);
    }, [r?.welcome_message, N]),
    o.useEffect(() => {
      q.current?.scrollIntoView({ behavior: "smooth" });
    }, [j]));
  const R = async (t) => {
      if ((t?.preventDefault(), !f.trim() || x.isPending || !s)) return;
      const l = f.trim(),
        c = `user-${Date.now()}`,
        T = { id: c, role: "user", content: l, timestamp: new Date(), deliveryStatus: "pending" };
      (u((d) => [...d, T]), g(""));
      try {
        const d = await x.mutateAsync({ message: l, user_name: v || void 0, email: w || void 0 }),
          k = d.reply ?? d.response ?? d.message ?? "Sin respuesta";
        u((m) => [
          ...m.map((S) => (S.id === c ? { ...S, deliveryStatus: "sent" } : S)),
          { id: `assistant-${Date.now()}`, role: "assistant", content: k, timestamp: new Date() },
        ]);
      } catch (d) {
        (u((k) => k.map((m) => (m.id === c ? { ...m, deliveryStatus: "failed" } : m))),
          g(l),
          _.error(O(d, "Error al enviar el mensaje")));
      }
    },
    A = (t) => {
      t.deliveryStatus === "failed" && (u((l) => l.filter((c) => c.id !== t.id)), g(t.content));
    };
  if (M)
    return e.jsx("div", {
      className: b("bg-background p-4", i ? "h-80" : "h-full min-h-[320px]", a),
      children: e.jsx(V, { variant: "chat", padded: !1, className: "h-full" }),
    });
  if ($) {
    const t = z($),
      l =
        t === 403
          ? "Este dominio no está autorizado para el widget. Pídele al administrador que agregue tu sitio en dominios permitidos del canal (o deje la lista vacía para público)."
          : t === 404
            ? "Canal no encontrado o inactivo."
            : "No se pudo cargar el widget. Verifica que el canal esté activo y que tu dominio esté permitido.";
    return e.jsx("div", {
      className: b(
        "flex items-center justify-center bg-background text-destructive p-6 text-sm text-center max-w-md mx-auto",
        i ? "h-80" : "h-full min-h-[320px]",
        a,
      ),
      children: l,
    });
  }
  return N
    ? e.jsxs("div", {
        className: b(
          "flex flex-col bg-background text-foreground overflow-hidden",
          i ? "h-[28rem] rounded-lg border border-border" : "h-full",
          a,
        ),
        children: [
          e.jsxs("header", {
            className: "border-b px-4 py-3 flex items-center gap-3 bg-card shrink-0",
            children: [
              e.jsx("div", {
                className: "h-8 w-8 rounded-full flex items-center justify-center overflow-hidden",
                style: { background: `${n}22`, color: n },
                children: r?.logo_url
                  ? e.jsx("img", {
                      src: r.logo_url,
                      alt: "",
                      className: "h-full w-full object-cover",
                    })
                  : e.jsx(y, { className: "h-4 w-4" }),
              }),
              e.jsxs("div", {
                className: "flex-1 min-w-0",
                children: [
                  e.jsx("div", { className: "font-medium text-sm truncate", children: D }),
                  e.jsx("div", {
                    className: "text-xs text-muted-foreground",
                    children: P ? `Agente · ${P}` : "Asistente virtual",
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-4 space-y-4 min-h-0",
            children: [
              j.map((t) =>
                e.jsxs(
                  "div",
                  {
                    className: `flex gap-2 ${t.role === "user" ? "flex-row-reverse" : ""}`,
                    children: [
                      e.jsx("div", {
                        className: `h-7 w-7 rounded-full shrink-0 flex items-center justify-center ${t.role === "user" ? "bg-muted" : ""}`,
                        style: t.role === "assistant" ? { background: `${n}22`, color: n } : void 0,
                        children:
                          t.role === "user"
                            ? e.jsx(G, { className: "h-3.5 w-3.5" })
                            : e.jsx(y, { className: "h-3.5 w-3.5" }),
                      }),
                      e.jsxs("div", {
                        className: `group max-w-[80%] space-y-1 ${t.role === "user" ? "items-end" : "items-start"}`,
                        children: [
                          e.jsx("div", {
                            className: `rounded-2xl px-3 py-2 text-sm break-words ${t.role === "user" ? "rounded-br-md text-primary-foreground" : "bg-muted rounded-bl-md"}`,
                            style: t.role === "user" ? { background: n } : void 0,
                            children: e.jsx(L, { content: t.content, inverted: t.role === "user" }),
                          }),
                          e.jsxs("div", {
                            className: `flex ${t.role === "user" ? "justify-end" : "justify-start"} gap-1`,
                            children: [
                              e.jsx(Q, { text: t.content }),
                              t.role === "user" && t.deliveryStatus === "failed"
                                ? e.jsx("button", {
                                    type: "button",
                                    className: "text-[10px] text-destructive underline",
                                    onClick: () => A(t),
                                    children: "Reintentar",
                                  })
                                : null,
                              t.role === "user" && t.deliveryStatus === "pending"
                                ? e.jsx("span", {
                                    className: "text-[10px] text-muted-foreground",
                                    children: "Enviando…",
                                  })
                                : null,
                            ],
                          }),
                        ],
                      }),
                    ],
                  },
                  t.id,
                ),
              ),
              x.isPending &&
                e.jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    e.jsx("div", {
                      className: "h-7 w-7 rounded-full flex items-center justify-center",
                      style: { background: `${n}22`, color: n },
                      children: e.jsx(y, { className: "h-3.5 w-3.5" }),
                    }),
                    e.jsx("div", {
                      className:
                        "bg-muted rounded-2xl rounded-bl-md px-3 py-2 text-xs text-muted-foreground",
                      children: "Pensando…",
                    }),
                  ],
                }),
              e.jsx("div", { ref: q }),
            ],
          }),
          e.jsxs("form", {
            onSubmit: R,
            className: "border-t p-3 flex gap-2 bg-card shrink-0",
            children: [
              e.jsx(E, {
                value: f,
                onChange: (t) => g(t.target.value),
                placeholder: "Escribe un mensaje...",
                className: "flex-1",
              }),
              e.jsx(B, {
                type: "submit",
                size: "icon",
                disabled: x.isPending || !f.trim(),
                style: { background: n, color: "#041016" },
                children: e.jsx(H, { className: "h-4 w-4" }),
              }),
            ],
          }),
        ],
      })
    : e.jsxs("div", {
        className: b(
          "flex flex-col bg-background text-foreground overflow-hidden",
          i ? "h-[28rem] rounded-lg border border-border" : "h-full",
          a,
        ),
        children: [
          e.jsxs("header", {
            className: "border-b px-4 py-3 flex items-center gap-3 shrink-0",
            style: { borderBottomColor: `${n}33` },
            children: [
              e.jsx("div", {
                className: "h-8 w-8 rounded-full flex items-center justify-center",
                style: { background: `${n}22`, color: n },
                children: e.jsx(y, { className: "h-4 w-4" }),
              }),
              e.jsx("div", { className: "font-medium text-sm truncate", children: D }),
            ],
          }),
          e.jsxs("form", {
            className: "flex-1 p-4 space-y-3 flex flex-col justify-center",
            onSubmit: (t) => {
              if ((t.preventDefault(), h && !v.trim())) {
                _.error("Ingresa tu nombre");
                return;
              }
              if (p && !w.trim()) {
                _.error("Ingresa tu email");
                return;
              }
              C(!0);
            },
            children: [
              e.jsx("p", {
                className: "text-sm text-muted-foreground",
                children: "Antes de chatear, cuéntanos quién eres.",
              }),
              h &&
                e.jsx(E, {
                  value: v,
                  onChange: (t) => I(t.target.value),
                  placeholder: "Tu nombre",
                  required: !0,
                }),
              p &&
                e.jsx(E, {
                  type: "email",
                  value: w,
                  onChange: (t) => U(t.target.value),
                  placeholder: "Tu email",
                  required: !0,
                }),
              e.jsx(B, {
                type: "submit",
                style: { background: n, color: "#041016" },
                children: "Empezar chat",
              }),
            ],
          }),
        ],
      });
}
export { ne as E };
