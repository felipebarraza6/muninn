import { r as i, j as e, ah as O, af as ie, ag as ge } from "./vendor-react-DUYfdZnL.js";
import {
  cA as ae,
  I as se,
  B as v,
  bU as fe,
  bW as le,
  cJ as ve,
  cB as D,
  c as U,
  U as N,
  V as A,
  i as je,
  an as Ne,
  b as be,
  C as we,
  dl as S,
  M as ye,
  cN as ke,
  F as _e,
  ah as Se,
  dq as ce,
  a5 as q,
  d4 as de,
  a7 as g,
  aa as Ce,
  ab as Ee,
  ac as Ae,
  ad as We,
  a0 as me,
  W as H,
  X as G,
  Y as J,
  Z as K,
  $ as X,
  di as Pe,
  a3 as Te,
  b1 as De,
  b2 as ze,
  b3 as Me,
  b4 as Le,
  b5 as Oe,
  b6 as Fe,
  b7 as $e,
  b8 as Ie,
} from "./studio-chat-Bi-RYdat.js";
import {
  o as Re,
  r as ne,
  a as Be,
  b as Ve,
  c as qe,
  d as Ue,
  e as He,
  f as xe,
  g as Ge,
  h as Je,
  i as Ke,
  j as Xe,
  k as Ye,
} from "./useWorkflows-BDj5QeFI.js";
import { w as Ze, r as ue, a as Qe, b as es, W as pe } from "./workflowCatalog-GgI4Rjhb.js";
import { m as re, A as ss } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const $ = 168,
  L = 72,
  Z = 56,
  Q = "var(--primary)";
function as({ workflowId: m, nodes: r, edges: n, isLoading: d }) {
  const s = ae(),
    c = i.useRef(!1),
    u = i.useMemo(() => {
      if (r.length <= 1) return r;
      const o = new Map(r.map((l) => [String(l.id), l])),
        f = Re(r, n)
          .map((l) => o.get(l))
          .filter((l) => !!l);
      return f.length === r.length
        ? f
        : [...r].sort(
            (l, x) => (l.position_x ?? 0) - (x.position_x ?? 0) || l.name.localeCompare(x.name),
          );
    }, [r, n]),
    W = !s && !c.current && u.length > 0;
  (i.useEffect(() => {
    c.current = !1;
  }, [m]),
    i.useEffect(() => {
      u.length > 0 && (c.current = !0);
    }, [u.length, m]));
  const p = i.useMemo(() => {
    const o = new Map();
    u.forEach((x, h) => {
      o.set(String(x.id), { x: h * ($ + Z), y: 24 });
    });
    const b = Math.max(u.length * ($ + Z) - Z + 48, 320),
      f = L + 64,
      l = [];
    for (const x of n) {
      const h = ne(x, "from", r),
        y = ne(x, "to", r);
      if (!h || !y) continue;
      const C = o.get(h),
        _ = o.get(y);
      !C ||
        !_ ||
        l.push({ key: String(x.id), x1: C.x + $, y1: C.y + L / 2, x2: _.x, y2: _.y + L / 2 });
    }
    if (l.length === 0 && u.length > 1)
      for (let x = 0; x < u.length - 1; x++) {
        const h = o.get(String(u[x].id)),
          y = o.get(String(u[x + 1].id));
        l.push({ key: `ghost-${x}`, x1: h.x + $, y1: h.y + L / 2, x2: y.x, y2: y.y + L / 2 });
      }
    return { positions: o, width: b, height: f, links: l, ghost: n.length === 0 && u.length > 1 };
  }, [u, n, r]);
  if (d && u.length === 0)
    return e.jsx("div", {
      className:
        "rounded-2xl border border-border/60 bg-card/40 px-4 py-10 text-center text-xs text-muted-foreground",
      children: "Armando el flujo…",
    });
  if (u.length === 0)
    return e.jsx(se, {
      className: "rounded-2xl py-12",
      icon: e.jsx(fe, { className: "h-5 w-5", "aria-hidden": !0 }),
      title: "Sin nodos aún",
      description: "Abrí el canvas para armar el grafo.",
      action: e.jsx(v, {
        size: "sm",
        asChild: !0,
        children: e.jsx(O, { to: `/app/workflows/${m}`, children: "Abrir canvas" }),
      }),
    });
  const w = `wf-preview-arrow-${m}`;
  return e.jsxs("div", {
    className:
      "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-background to-primary/[0.04]",
    children: [
      e.jsx("div", {
        className: "pointer-events-none absolute inset-0 opacity-[0.35]",
        style: {
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        },
        "aria-hidden": !0,
      }),
      e.jsxs("div", {
        className: "relative flex items-center justify-between gap-2 px-4 pt-3 pb-1",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-2 text-[11px] text-muted-foreground",
            children: [
              e.jsx(le, { className: "h-3.5 w-3.5 text-primary" }),
              e.jsxs("span", {
                children: [
                  r.length,
                  " nodos · ",
                  n.length,
                  " conexiones",
                  p.ghost ? " · vista en cadena" : "",
                ],
              }),
            ],
          }),
          e.jsx(v, {
            size: "sm",
            variant: "outline",
            className: "h-7 text-[11px] gap-1 relative z-[1]",
            asChild: !0,
            children: e.jsxs(O, {
              to: `/app/workflows/${m}`,
              children: ["Abrir canvas", e.jsx(ve, { className: "h-3 w-3" })],
            }),
          }),
        ],
      }),
      e.jsx("div", {
        className: "relative overflow-x-auto px-4 pb-5 pt-2",
        children: e.jsxs("div", {
          className: "relative mx-auto",
          style: { width: p.width, height: p.height, minWidth: "100%" },
          children: [
            e.jsxs("svg", {
              className: "absolute inset-0 pointer-events-none overflow-visible",
              width: p.width,
              height: p.height,
              "aria-hidden": !0,
              children: [
                e.jsx("defs", {
                  children: e.jsx("marker", {
                    id: w,
                    markerWidth: "7",
                    markerHeight: "7",
                    refX: "6",
                    refY: "3.5",
                    orient: "auto",
                    children: e.jsx("path", {
                      d: "M0,0 L7,3.5 L0,7 Z",
                      fill: Q,
                      fillOpacity: "0.85",
                    }),
                  }),
                }),
                p.links.map((o) => {
                  const b = (o.x1 + o.x2) / 2,
                    f = `M ${o.x1} ${o.y1} C ${b} ${o.y1}, ${b} ${o.y2}, ${o.x2} ${o.y2}`;
                  return e.jsxs(
                    "g",
                    {
                      children: [
                        e.jsx("path", {
                          d: f,
                          fill: "none",
                          stroke: Q,
                          strokeOpacity: p.ghost ? 0.25 : 0.45,
                          strokeWidth: 2,
                          strokeDasharray: p.ghost ? "5 5" : void 0,
                        }),
                        e.jsx("path", {
                          d: f,
                          fill: "none",
                          stroke: Q,
                          strokeOpacity: p.ghost ? 0.5 : 0.85,
                          strokeWidth: 2,
                          markerEnd: `url(#${w})`,
                        }),
                      ],
                    },
                    o.key,
                  );
                }),
              ],
            }),
            u.map((o, b) => {
              const f = p.positions.get(String(o.id)),
                l = Ze(o.node_type);
              return e.jsxs(
                re.div,
                {
                  initial: W ? { opacity: 0, y: 8 } : !1,
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: D.base, delay: W ? D.stagger * b : 0, ease: D.easeOut },
                  className: U(
                    "absolute rounded-xl border backdrop-blur-sm px-3 py-2.5",
                    "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_6%,transparent)]",
                    "hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--primary)_35%,transparent)] transition-shadow duration-motion-base",
                    l?.accentBg || "bg-card/90 border-border",
                  ),
                  style: { left: f.x, top: f.y, width: $, height: L },
                  children: [
                    e.jsx("p", {
                      className: U(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        l?.accent || "text-muted-foreground",
                      ),
                      children: l?.label || o.node_type,
                    }),
                    e.jsx("p", {
                      className: "text-sm font-medium truncate mt-0.5 text-foreground",
                      children: o.name,
                    }),
                    e.jsx("p", {
                      className: "text-[10px] text-muted-foreground truncate",
                      children: o.node_key,
                    }),
                  ],
                },
                o.id,
              );
            }),
          ],
        }),
      }),
    ],
  });
}
const rs = i.memo(as);
function he() {
  return {
    cron_expression: "0 9 * * 1-5",
    timezone: "America/Santiago",
    webhook_path: "",
    webhook_secret: "",
    event_name: "",
    event_source: "",
  };
}
function ee(m, r) {
  const n = r ?? {},
    d = he();
  return {
    cron_expression: String(n.cron_expression ?? n.cron ?? d.cron_expression),
    timezone: String(n.timezone ?? n.tz ?? d.timezone),
    webhook_path: String(n.path ?? n.webhook_path ?? n.url_path ?? ""),
    webhook_secret: String(n.secret ?? n.webhook_secret ?? ""),
    event_name: String(n.event_name ?? n.event ?? n.name ?? ""),
    event_source: String(n.event_source ?? n.source ?? n.app ?? ""),
  };
}
function oe(m, r) {
  const n = (m || "manual").toLowerCase();
  if (n === "manual") return {};
  if (n === "cron")
    return {
      cron_expression: r.cron_expression.trim() || "0 9 * * 1-5",
      timezone: r.timezone.trim() || "America/Santiago",
    };
  if (n === "webhook") {
    const d = {};
    return (
      r.webhook_path.trim() && (d.path = r.webhook_path.trim()),
      r.webhook_secret.trim() && (d.secret = r.webhook_secret.trim()),
      d
    );
  }
  if (n === "event") {
    const d = {};
    return (
      r.event_name.trim() && (d.event_name = r.event_name.trim()),
      r.event_source.trim() && (d.event_source = r.event_source.trim()),
      d
    );
  }
  return {
    ...(r.cron_expression.trim() ? { cron_expression: r.cron_expression.trim() } : {}),
    ...(r.event_name.trim() ? { event_name: r.event_name.trim() } : {}),
  };
}
function ts(m) {
  const r = (m || "manual").toLowerCase();
  return r === "cron" || r === "webhook" || r === "event" || r.startsWith("campaign_");
}
function ns({ triggerType: m, value: r, onChange: n }) {
  if (!ts(m)) return null;
  const d = m.toLowerCase(),
    s = (c) => n({ ...r, ...c });
  return e.jsxs("div", {
    className: "space-y-3 rounded-xl border border-border/50 bg-muted/15 p-3",
    children: [
      e.jsx("p", {
        className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
        children: "Configuración del trigger",
      }),
      d === "cron" || d.startsWith("campaign_")
        ? e.jsxs("div", {
            className: "grid gap-3 sm:grid-cols-2",
            children: [
              e.jsxs("div", {
                className: "space-y-1 sm:col-span-2",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Expresión cron",
                  }),
                  e.jsx(A, {
                    value: r.cron_expression,
                    onChange: (c) => s({ cron_expression: c.target.value }),
                    placeholder: "0 9 * * 1-5",
                    className: "h-9 font-mono text-xs",
                  }),
                  e.jsx("p", {
                    className: "text-[10px] text-muted-foreground",
                    children: "Minuto hora día-mes mes día-semana (ej. lun–vie 09:00).",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-1",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Zona horaria",
                  }),
                  e.jsx(A, {
                    value: r.timezone,
                    onChange: (c) => s({ timezone: c.target.value }),
                    placeholder: "America/Santiago",
                    className: "h-9 text-xs",
                  }),
                ],
              }),
            ],
          })
        : null,
      d === "webhook"
        ? e.jsxs("div", {
            className: "grid gap-3",
            children: [
              e.jsxs("div", {
                className: "space-y-1",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Path relativo (opcional)",
                  }),
                  e.jsx(A, {
                    value: r.webhook_path,
                    onChange: (c) => s({ webhook_path: c.target.value }),
                    placeholder: "/hooks/mi-flujo",
                    className: "h-9 font-mono text-xs",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-1",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Secret (opcional)",
                  }),
                  e.jsx(A, {
                    type: "password",
                    autoComplete: "off",
                    value: r.webhook_secret,
                    onChange: (c) => s({ webhook_secret: c.target.value }),
                    placeholder: "Token de verificación",
                    className: "h-9 font-mono text-xs",
                  }),
                ],
              }),
            ],
          })
        : null,
      d === "event"
        ? e.jsxs("div", {
            className: "grid gap-3 sm:grid-cols-2",
            children: [
              e.jsxs("div", {
                className: "space-y-1",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Nombre del evento",
                  }),
                  e.jsx(A, {
                    value: r.event_name,
                    onChange: (c) => s({ event_name: c.target.value }),
                    placeholder: "appointment.created",
                    className: "h-9 font-mono text-xs",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-1",
                children: [
                  e.jsx(N, {
                    className: "text-[10px] text-muted-foreground",
                    children: "Fuente / app",
                  }),
                  e.jsx(A, {
                    value: r.event_source,
                    onChange: (c) => s({ event_source: c.target.value }),
                    placeholder: "erp, channels, …",
                    className: "h-9 text-xs",
                  }),
                ],
              }),
            ],
          })
        : null,
    ],
  });
}
function ps() {
  const m = ie(),
    r = ae(),
    [n, d] = ge(),
    s = n.get("id"),
    { data: c = [], isLoading: u, error: W } = Be(),
    [p, w] = i.useState(s ?? ""),
    [o, b] = i.useState(""),
    [f, l] = i.useState(!1),
    [x, h] = i.useState(""),
    [y, C] = i.useState(""),
    [_, P] = i.useState("manual"),
    [z, I] = i.useState("draft"),
    M = Ve(),
    F = qe(),
    R = Ue(),
    T = He(),
    { data: B = [] } = xe(),
    Y = je() || Ne(),
    V = i.useMemo(() => ue(B), [B]);
  (i.useEffect(() => {
    s && w(s);
  }, [s]),
    i.useEffect(() => {
      const a = (j) => {
        if (j.key !== "Escape") return;
        const t = j.target;
        (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) ||
          m("/app");
      };
      return (
        window.addEventListener("keydown", a),
        () => window.removeEventListener("keydown", a)
      );
    }, [m]));
  const E = i.useMemo(() => {
      if (!o.trim()) return c;
      const a = o.toLowerCase();
      return c.filter(
        (j) =>
          j.name.toLowerCase().includes(a) ||
          (j.description || "").toLowerCase().includes(a) ||
          (j.trigger_type || "").toLowerCase().includes(a),
      );
    }, [c, o]),
    k = c.find((a) => a.id === p) ?? E[0];
  return (
    i.useEffect(() => {
      !p && E[0] && (w(E[0].id), d({ id: E[0].id }, { replace: !0 }));
    }, [E, p, d]),
    u
      ? e.jsx("div", {
          className: "h-dvh bg-background",
          children: e.jsx(be, { variant: "catalog", className: "h-full max-w-none", padded: !1 }),
        })
      : W
        ? e.jsxs("div", {
            className: "h-dvh flex flex-col items-center justify-center gap-3 px-6",
            children: [
              e.jsx(we, {
                className: "max-w-md w-full",
                message: S(W, "No se pudieron cargar los workflows"),
              }),
              e.jsx(v, {
                variant: "outline",
                asChild: !0,
                children: e.jsx(O, { to: "/app", children: "Volver" }),
              }),
            ],
          })
        : e.jsxs("div", {
            className: "h-dvh flex flex-col bg-background overflow-hidden",
            children: [
              e.jsxs("div", {
                className:
                  "shrink-0 border-b border-border/60 bg-card/80 backdrop-blur px-3 py-2 flex items-center gap-2",
                children: [
                  e.jsx(v, {
                    variant: "ghost",
                    size: "sm",
                    className:
                      "h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
                    asChild: !0,
                    children: e.jsxs(O, {
                      to: "/app",
                      title: "Volver (Esc)",
                      children: [
                        e.jsx(ye, { className: "h-4 w-4" }),
                        e.jsx("span", { className: "text-xs font-medium", children: "Volver" }),
                      ],
                    }),
                  }),
                  e.jsx(le, { className: "h-4 w-4 text-primary shrink-0" }),
                  e.jsxs("div", {
                    className: "min-w-0 flex flex-col leading-tight",
                    children: [
                      e.jsx("span", {
                        className: "text-sm font-semibold tracking-tight truncate",
                        children: "Workflows",
                      }),
                      e.jsx("span", {
                        className: "text-[10px] text-muted-foreground hidden sm:inline truncate",
                        children: "OPS-agents · orquestación",
                      }),
                    ],
                  }),
                  e.jsx("span", {
                    className:
                      "ml-1 hidden md:inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary",
                    children: "Preview",
                  }),
                  e.jsxs("div", {
                    className: "ml-auto flex items-center gap-2",
                    children: [
                      Y ? e.jsx(ke, {}) : null,
                      e.jsx(v, {
                        size: "sm",
                        variant: "ghost",
                        className: "h-8 hidden md:inline-flex",
                        asChild: !0,
                        children: e.jsx(O, { to: "/app/planes", children: "Planes" }),
                      }),
                      e.jsxs(v, {
                        size: "sm",
                        className: "h-8 gap-1.5 shadow-sm shadow-primary/20",
                        onClick: () => l(!0),
                        children: [e.jsx(_e, { className: "h-3.5 w-3.5" }), "Nuevo"],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex flex-1 min-h-0 overflow-hidden",
                children: [
                  e.jsxs("aside", {
                    className: "w-full md:w-[320px] border-r bg-card flex flex-col shrink-0",
                    children: [
                      e.jsx("div", {
                        className: "border-b px-3 py-2",
                        children: e.jsxs("div", {
                          className: "relative",
                          children: [
                            e.jsx(Se, {
                              className:
                                "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground",
                            }),
                            e.jsx(A, {
                              value: o,
                              onChange: (a) => b(a.target.value),
                              placeholder: "Buscar workflow…",
                              className: "h-8 pl-8 text-sm",
                            }),
                          ],
                        }),
                      }),
                      e.jsx(ce, {
                        className: "flex-1",
                        children: e.jsx("div", {
                          className: "p-2 space-y-1",
                          children:
                            E.length === 0
                              ? e.jsx(se, {
                                  className: "border-0 bg-transparent py-10 px-4",
                                  title: "No hay workflows",
                                  description: "Crea uno para orquestar nodos.",
                                })
                              : e.jsx(ss, {
                                  initial: !1,
                                  children: E.map((a, j) => {
                                    const t = k?.id === a.id,
                                      te = String(a.status || "").toLowerCase();
                                    return e.jsx(
                                      re.button,
                                      {
                                        type: "button",
                                        initial: r ? !1 : { opacity: 0, x: -4 },
                                        animate: { opacity: 1, x: 0 },
                                        transition: {
                                          duration: D.fast,
                                          delay: r ? 0 : Math.min(j, 8) * 0.015,
                                          ease: D.ease,
                                        },
                                        onClick: () => {
                                          (w(a.id), d({ id: a.id }, { replace: !0 }));
                                        },
                                        className: U(
                                          "w-full text-left rounded-xl border px-3 py-2.5 transition-colors",
                                          t
                                            ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_-12px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
                                            : "border-transparent hover:bg-muted/50 hover:border-border/50",
                                        ),
                                        children: e.jsxs("div", {
                                          className: "flex items-start gap-2.5",
                                          children: [
                                            e.jsx("span", {
                                              className: U(
                                                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                                te === "active"
                                                  ? "bg-success shadow-[0_0_8px_color-mix(in_oklab,var(--success)_70%,transparent)]"
                                                  : te === "paused"
                                                    ? "bg-warning"
                                                    : "bg-muted-foreground/40",
                                              ),
                                            }),
                                            e.jsxs("div", {
                                              className: "min-w-0 flex-1",
                                              children: [
                                                e.jsx("p", {
                                                  className: "text-sm font-medium truncate",
                                                  children: a.name,
                                                }),
                                                e.jsxs("p", {
                                                  className:
                                                    "text-[11px] text-muted-foreground mt-0.5 truncate",
                                                  children: [
                                                    Qe(a.trigger_type),
                                                    " ·",
                                                    " ",
                                                    es(a.status),
                                                    " · ",
                                                    a.execution_count ?? 0,
                                                    " runs",
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      },
                                      a.id,
                                    );
                                  }),
                                }),
                        }),
                      }),
                    ],
                  }),
                  e.jsx("section", {
                    className: "flex-1 min-w-0 flex flex-col",
                    children: k
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("div", {
                              className: "shrink-0 border-b px-4 py-3 flex items-start gap-3",
                              children: [
                                e.jsxs("div", {
                                  className: "min-w-0 flex-1",
                                  children: [
                                    e.jsx("h2", {
                                      className: "text-sm font-semibold truncate",
                                      children: k.name,
                                    }),
                                    e.jsxs("p", {
                                      className:
                                        "text-xs text-muted-foreground mt-0.5 line-clamp-2",
                                      children: [
                                        k.description || "Sin descripción",
                                        " · trigger",
                                        " ",
                                        k.trigger_type || "manual",
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "flex gap-1.5 shrink-0",
                                  children: [
                                    e.jsx(v, {
                                      size: "sm",
                                      variant: "outline",
                                      className: "h-8",
                                      asChild: !0,
                                      children: e.jsx(O, {
                                        to: `/app/workflows/${k.id}`,
                                        children: "Abrir canvas",
                                      }),
                                    }),
                                    e.jsxs(v, {
                                      size: "sm",
                                      className: "h-8 gap-1",
                                      disabled: T.isPending,
                                      onClick: () =>
                                        T.mutate(
                                          { id: k.id },
                                          {
                                            onSuccess: () => g.success("Workflow ejecutado"),
                                            onError: (a) =>
                                              g.error(S(a, "No se pudo ejecutar el workflow")),
                                          },
                                        ),
                                      children: [
                                        T.isPending
                                          ? e.jsx(q, { className: "h-3.5 w-3.5 animate-spin" })
                                          : e.jsx(de, { className: "h-3.5 w-3.5" }),
                                        "Ejecutar",
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsx(os, {
                              workflowId: k.id,
                              onExecute: () => {
                                T.mutate(
                                  { id: k.id },
                                  {
                                    onSuccess: () => g.success("Workflow ejecutado"),
                                    onError: (a) =>
                                      g.error(S(a, "No se pudo ejecutar el workflow")),
                                  },
                                );
                              },
                              executePending: T.isPending,
                            }),
                          ],
                        })
                      : e.jsx(se, {
                          className: "flex-1 border-0 bg-transparent rounded-none",
                          title: "Selecciona un workflow",
                          description: "Elige uno de la lista o crea uno nuevo.",
                        }),
                  }),
                ],
              }),
              e.jsx(Ce, {
                open: f,
                onOpenChange: l,
                children: e.jsxs(Ee, {
                  className: "sm:max-w-lg",
                  children: [
                    e.jsx(Ae, { children: e.jsx(We, { children: "Nuevo workflow" }) }),
                    e.jsxs("div", {
                      className: "space-y-3 py-1",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsx(N, { htmlFor: "wf-name", children: "Nombre" }),
                            e.jsx(A, {
                              id: "wf-name",
                              value: x,
                              onChange: (a) => h(a.target.value),
                              placeholder: "Ej. Orquestación agente ops",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsx(N, { htmlFor: "wf-desc", children: "Descripción" }),
                            e.jsx(me, {
                              id: "wf-desc",
                              value: y,
                              onChange: (a) => C(a.target.value),
                              rows: 2,
                              placeholder: "Qué hace este flujo (opcional)",
                              className: "text-sm",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "grid grid-cols-2 gap-3",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsx(N, { children: "Trigger" }),
                                e.jsxs(H, {
                                  value: _,
                                  onValueChange: P,
                                  children: [
                                    e.jsx(G, {
                                      className: "h-9",
                                      children: e.jsx(J, { placeholder: "Tipo" }),
                                    }),
                                    e.jsx(K, {
                                      children: V.map((a) =>
                                        e.jsxs(
                                          X,
                                          {
                                            value: a.value,
                                            disabled: !a.supported,
                                            children: [a.label, a.supported ? "" : " (próx.)"],
                                          },
                                          a.value,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsx(N, { children: "Estado" }),
                                e.jsxs(H, {
                                  value: z,
                                  onValueChange: I,
                                  children: [
                                    e.jsx(G, { className: "h-9", children: e.jsx(J, {}) }),
                                    e.jsx(K, {
                                      children: pe.map((a) =>
                                        e.jsx(X, { value: a.value, children: a.label }, a.value),
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-[11px] text-muted-foreground",
                          children:
                            "Se crea con nodos Inicio → Agente. En el canvas podés sumar LLM, función, condición, delay, API, etc.",
                        }),
                      ],
                    }),
                    e.jsxs(Pe, {
                      children: [
                        e.jsx(v, {
                          variant: "outline",
                          onClick: () => l(!1),
                          children: "Cancelar",
                        }),
                        e.jsx(v, {
                          disabled: !x.trim() || M.isPending || F.isPending || R.isPending,
                          onClick: () => {
                            M.mutate(
                              {
                                name: x.trim(),
                                description: y.trim() || void 0,
                                trigger_type: _,
                                status: z,
                                is_active: z === "active",
                              },
                              {
                                onSuccess: (a) => {
                                  F.mutate(
                                    {
                                      workflow: a.id,
                                      node_type: "trigger",
                                      node_key: "start",
                                      name: "Inicio",
                                      position_x: 80,
                                      position_y: 120,
                                      config: {},
                                    },
                                    {
                                      onSuccess: (j) => {
                                        F.mutate(
                                          {
                                            workflow: a.id,
                                            node_type: "agent",
                                            node_key: "agent-1",
                                            name: "Agente",
                                            position_x: 400,
                                            position_y: 120,
                                            config: {
                                              message: "Ejecuta la tarea del contexto del workflow",
                                              max_iterations: 4,
                                            },
                                          },
                                          {
                                            onSuccess: (t) => {
                                              R.mutate(
                                                { workflow: a.id, from_node: j.id, to_node: t.id },
                                                {
                                                  onSettled: () => {
                                                    (g.success("Workflow creado"),
                                                      l(!1),
                                                      h(""),
                                                      C(""),
                                                      P("manual"),
                                                      I("draft"),
                                                      w(a.id),
                                                      d({ id: a.id }, { replace: !0 }),
                                                      m(`/app/workflows/${a.id}`));
                                                  },
                                                },
                                              );
                                            },
                                            onError: (t) =>
                                              g.error(S(t, "No se pudo crear el nodo agente")),
                                          },
                                        );
                                      },
                                      onError: (j) =>
                                        g.error(S(j, "No se pudo crear el nodo trigger")),
                                    },
                                  );
                                },
                                onError: (a) => g.error(S(a, "No se pudo crear el workflow")),
                              },
                            );
                          },
                          children: "Crear y abrir",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          })
  );
}
function os({ workflowId: m, onExecute: r, executePending: n }) {
  const d = ae(),
    { data: s, isLoading: c } = Ge(m),
    u = Je(),
    W = Ke(),
    p = Xe(),
    w = Ye(),
    { data: o = [] } = xe(),
    [b, f] = i.useState(""),
    [l, x] = i.useState(""),
    [h, y] = i.useState("manual"),
    [C, _] = i.useState(he),
    [P, z] = i.useState("draft"),
    [I, M] = i.useState(!1),
    F = ie(),
    R = i.useMemo(() => ue(o), [o]);
  i.useEffect(() => {
    s &&
      (f(s.name || ""),
      x(s.description || ""),
      y(s.trigger_type || "manual"),
      _(ee(s.trigger_type || "manual", s.trigger_config)),
      z(s.status || "draft"));
  }, [s]);
  const T = i.useMemo(() => (s?.nodes ?? []).filter((t) => t.is_active !== !1), [s?.nodes]),
    B = i.useMemo(() => (s?.edges ?? []).filter((t) => t.is_active !== !1), [s?.edges]),
    Y = i.useMemo(
      () =>
        s ? oe(s.trigger_type || "manual", ee(s.trigger_type || "manual", s.trigger_config)) : null,
      [s],
    ),
    V = oe(h, C),
    E = JSON.stringify(V ?? {}) !== JSON.stringify(Y ?? {}),
    k =
      !!s &&
      (b !== (s.name || "") ||
        l !== (s.description || "") ||
        h !== (s.trigger_type || "manual") ||
        P !== (s.status || "draft") ||
        E),
    a = () => {
      s &&
        u.mutate(
          {
            id: s.id,
            name: b.trim() || s.name,
            description: l.trim(),
            trigger_type: h,
            trigger_config: V ?? {},
            status: P,
            is_active: P === "active",
          },
          {
            onSuccess: () => g.success("Workflow actualizado"),
            onError: (t) => g.error(S(t, "No se pudo guardar")),
          },
        );
    },
    j = () => {
      s &&
        w.mutate(s.id, {
          onSuccess: () => {
            (g.success("Workflow eliminado"), M(!1), F("/app/workflows", { replace: !0 }));
          },
          onError: (t) =>
            g.error(S(t, "No se pudo eliminar. Si el API aún no lo soporta, archivá el workflow.")),
        });
    };
  return e.jsx(ce, {
    className: "flex-1",
    children: e.jsxs(
      re.div,
      {
        initial: d ? !1 : { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: D.base, ease: D.easeOut },
        className: "p-4 md:p-6 space-y-5 max-w-6xl mx-auto w-full",
        children: [
          e.jsx(rs, { workflowId: m, nodes: T, edges: B, isLoading: c }),
          e.jsxs("section", {
            className:
              "rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden",
            children: [
              e.jsxs("div", {
                className:
                  "flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-4 py-2.5 bg-muted/20",
                children: [
                  e.jsx("p", {
                    className:
                      "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                    children: "Configuración",
                  }),
                  e.jsxs("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: [
                      s?.status === "active"
                        ? e.jsx(v, {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-[11px]",
                            disabled: p.isPending,
                            onClick: () =>
                              p.mutate(s.id, {
                                onSuccess: () => g.success("Workflow desactivado"),
                                onError: (t) => g.error(S(t, "No se pudo desactivar")),
                              }),
                            children: "Pausar",
                          })
                        : e.jsx(v, {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-[11px]",
                            disabled: W.isPending || !s,
                            onClick: () =>
                              s &&
                              W.mutate(s.id, {
                                onSuccess: () => g.success("Workflow activado"),
                                onError: (t) => g.error(S(t, "No se pudo activar")),
                              }),
                            children: "Activar",
                          }),
                      e.jsxs(v, {
                        size: "sm",
                        className: "h-7 text-[11px] gap-1",
                        disabled: n,
                        onClick: r,
                        children: [
                          n
                            ? e.jsx(q, { className: "h-3 w-3 animate-spin" })
                            : e.jsx(de, { className: "h-3 w-3" }),
                          "Ejecutar",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "p-4",
                children:
                  c || !s
                    ? e.jsx("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Cargando…",
                      })
                    : e.jsxs("div", {
                        className: "grid gap-4 lg:grid-cols-[1fr_220px]",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-3 min-w-0",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-1",
                                children: [
                                  e.jsx(N, {
                                    className: "text-[10px] text-muted-foreground",
                                    children: "Nombre",
                                  }),
                                  e.jsx(A, {
                                    value: b,
                                    onChange: (t) => f(t.target.value),
                                    className: "h-9",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-1",
                                children: [
                                  e.jsx(N, {
                                    className: "text-[10px] text-muted-foreground",
                                    children: "Descripción",
                                  }),
                                  e.jsx(me, {
                                    value: l,
                                    onChange: (t) => x(t.target.value),
                                    rows: 3,
                                    className: "text-sm resize-none",
                                  }),
                                ],
                              }),
                              e.jsx(ns, { triggerType: h, value: C, onChange: _ }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-3",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-1",
                                children: [
                                  e.jsx(N, {
                                    className: "text-[10px] text-muted-foreground",
                                    children: "Trigger",
                                  }),
                                  e.jsxs(H, {
                                    value: h,
                                    onValueChange: (t) => {
                                      (y(t), _(ee(t, s.trigger_config)));
                                    },
                                    children: [
                                      e.jsx(G, { className: "h-9", children: e.jsx(J, {}) }),
                                      e.jsx(K, {
                                        children: R.map((t) =>
                                          e.jsxs(
                                            X,
                                            {
                                              value: t.value,
                                              disabled: !t.supported,
                                              children: [t.label, t.supported ? "" : " (próx.)"],
                                            },
                                            t.value,
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-1",
                                children: [
                                  e.jsx(N, {
                                    className: "text-[10px] text-muted-foreground",
                                    children: "Estado",
                                  }),
                                  e.jsxs(H, {
                                    value: P,
                                    onValueChange: z,
                                    children: [
                                      e.jsx(G, { className: "h-9", children: e.jsx(J, {}) }),
                                      e.jsx(K, {
                                        children: pe.map((t) =>
                                          e.jsx(X, { value: t.value, children: t.label }, t.value),
                                        ),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs(v, {
                                size: "sm",
                                className: "w-full h-9",
                                disabled: !k || u.isPending,
                                onClick: a,
                                children: [
                                  u.isPending
                                    ? e.jsx(q, { className: "h-3.5 w-3.5 animate-spin mr-1.5" })
                                    : null,
                                  "Guardar",
                                ],
                              }),
                              e.jsxs(v, {
                                size: "sm",
                                variant: "ghost",
                                className:
                                  "w-full h-9 text-destructive hover:text-destructive hover:bg-destructive/10",
                                disabled: w.isPending,
                                onClick: () => M(!0),
                                children: [
                                  e.jsx(Te, { className: "h-3.5 w-3.5 mr-1.5" }),
                                  "Eliminar",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
              }),
            ],
          }),
          e.jsx(De, {
            open: I,
            onOpenChange: M,
            children: e.jsxs(ze, {
              children: [
                e.jsxs(Me, {
                  children: [
                    e.jsx(Le, { children: "¿Eliminar este workflow?" }),
                    e.jsxs(Oe, {
                      children: [
                        "Se borrará «",
                        s?.name,
                        "» y su grafo. Si el API aún no soporta DELETE, usa Archivar en estado.",
                      ],
                    }),
                  ],
                }),
                e.jsxs(Fe, {
                  children: [
                    e.jsx($e, { children: "Cancelar" }),
                    e.jsx(Ie, {
                      className:
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      disabled: w.isPending,
                      onClick: (t) => {
                        (t.preventDefault(), j());
                      },
                      children: w.isPending
                        ? e.jsx(q, { className: "h-4 w-4 animate-spin" })
                        : "Eliminar",
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      },
      m,
    ),
  });
}
export { ps as default };
