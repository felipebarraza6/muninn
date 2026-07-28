import { j as s, ah as d, r as q } from "./vendor-react-DUYfdZnL.js";
import {
  c as P,
  cD as b,
  cE as v,
  cF as G,
  as as V,
  j as J,
  cG as M,
  ag as E,
  cH as W,
  aS as T,
  cI as S,
  bN as A,
  bQ as U,
  aM as D,
  aP as z,
  bU as X,
  b as $,
  A as R,
  z as o,
  J as as,
  B as p,
  cJ as C,
  cK as I,
  cL as B,
  cM as O,
  aq as ns,
  bf as is,
  ar as rs,
  cN as Y,
  cO as H,
  cq as ts,
  bK as cs,
  E as os,
  cP as ls,
  cQ as ds,
  K as ms,
  cR as us,
  cS as Z,
  bX as hs,
  bT as gs,
  cT as xs,
} from "./studio-chat-BBQUCckT.js";
import { u as ss } from "./admin-CJj1SvsI.js";
import { u as F } from "./useChannels-Cmbbb5sU.js";
import { u as ps } from "./vendor-query-IAyuTf1L.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-charts-l0_txfiz.js";
function Q({ title: e, description: n, actions: i, className: c }) {
  return s.jsxs("div", {
    className: P("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4", c),
    children: [
      e || n
        ? s.jsxs("div", {
            className: "min-w-0 space-y-1",
            children: [
              e
                ? s.jsx("h1", {
                    className: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
                    children: e,
                  })
                : null,
              n
                ? s.jsx("div", {
                    className: "max-w-2xl text-sm text-muted-foreground",
                    children: n,
                  })
                : null,
            ],
          })
        : null,
      i
        ? s.jsx("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: i })
        : null,
    ],
  });
}
const fs = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
};
function _({ items: e, columnsClass: n = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" }) {
  return s.jsx("section", {
    className: `grid gap-3 ${n}`,
    children: e.map((i) =>
      s.jsx(
        d,
        {
          to: i.href,
          className:
            "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl",
          children: s.jsx(b, {
            className:
              "border-border/60 bg-card shadow-xs overflow-hidden h-full transition group-hover:border-primary/40 group-hover:shadow-md group-hover:-translate-y-0.5",
            children: s.jsxs(v, {
              className: "p-4 space-y-3",
              children: [
                s.jsx("div", {
                  className: `h-9 w-9 rounded-lg flex items-center justify-center ${fs[i.tone]}`,
                  children: s.jsx(i.icon, { className: "h-5 w-5", strokeWidth: 1.75 }),
                }),
                s.jsxs("div", {
                  children: [
                    s.jsx("div", {
                      className: "text-2xl font-semibold tracking-tight tabular-nums",
                      children: G(i.count),
                    }),
                    s.jsx("div", {
                      className: "text-[11px] text-muted-foreground mt-0.5 leading-snug",
                      children: i.label,
                    }),
                  ],
                }),
              ],
            }),
          }),
        },
        i.key,
      ),
    ),
  });
}
const js = [
  { href: "/app/admin/organizaciones", label: "Organizaciones", icon: T },
  { href: "/app/admin/sucursales", label: "Sucursales", icon: S },
  { href: "/app/admin/usuarios", label: "Usuarios", icon: A },
  { href: "/app/admin/llm", label: "LLM", icon: as },
];
function bs() {
  const { data: e = [], isLoading: n } = V(),
    { data: i = [], isLoading: c } = J(),
    { data: m = [], isLoading: u } = ss(),
    { data: h = [], isLoading: l } = M(),
    { data: g = [], isLoading: f } = F(),
    { data: L = [], isLoading: k } = E({ scope: "store", includeInactive: !0 }),
    { data: N = [], isLoading: y } = W(),
    w = n || c || u || l || f || k || y,
    x = [
      {
        key: "orgs",
        label: "Organizaciones",
        count: e.filter((r) => r.is_active !== !1).length,
        icon: T,
        href: "/app/admin/organizaciones",
        tone: "primary",
      },
      {
        key: "branches",
        label: "Sucursales",
        count: i.filter((r) => r.is_active !== !1).length,
        icon: S,
        href: "/app/admin/sucursales",
        tone: "success",
      },
      {
        key: "users",
        label: "Usuarios",
        count: m.length,
        icon: A,
        href: "/app/admin/usuarios",
        tone: "info",
      },
    ],
    j = [
      {
        key: "agents",
        label: "Agentes activos",
        count: h.filter((r) => r.is_active).length,
        icon: U,
        href: "/app/agentes",
        tone: "primary",
      },
      {
        key: "channels",
        label: "Canales activos",
        count: g.filter((r) => r.is_active).length,
        icon: D,
        href: "/app/canales",
        tone: "success",
      },
      {
        key: "apis",
        label: "Aplicaciones",
        count: L.filter((r) => r.is_active).length,
        icon: z,
        href: "/app/aplicaciones",
        tone: "info",
      },
      {
        key: "skills",
        label: "Skills",
        count: N.filter((r) => r.is_active).length,
        icon: X,
        href: "/app/skills",
        tone: "warning",
      },
    ];
  return w
    ? s.jsx($, { variant: "dashboard" })
    : s.jsxs(R, {
        children: [
          s.jsx(o, {
            children: s.jsx(Q, {
              description:
                "Vista global de tenants, infraestructura y catálogo Studio. Sin operación de clientes.",
              className: "mb-3",
            }),
          }),
          s.jsx(o, {
            children: s.jsx(_, { items: x, columnsClass: "grid-cols-2 md:grid-cols-3" }),
          }),
          s.jsx(o, {
            children: s.jsxs("section", {
              className: "mt-6 space-y-3",
              children: [
                s.jsx("h2", {
                  className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
                  children: "Accesos de administración",
                }),
                s.jsx("div", {
                  className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                  children: js.map((r) =>
                    s.jsx(
                      p,
                      {
                        asChild: !0,
                        variant: "outline",
                        className: "h-auto py-3 justify-start gap-2",
                        children: s.jsxs(d, {
                          to: r.href,
                          children: [
                            s.jsx(r.icon, { className: "h-4 w-4 text-primary shrink-0" }),
                            s.jsx("span", { className: "truncate", children: r.label }),
                            s.jsx(C, { className: "h-3.5 w-3.5 ml-auto opacity-50" }),
                          ],
                        }),
                      },
                      r.href,
                    ),
                  ),
                }),
              ],
            }),
          }),
          s.jsx(o, {
            children: s.jsxs("section", {
              className: "mt-6 space-y-3",
              children: [
                s.jsx("div", {
                  className: "flex items-end justify-between gap-2",
                  children: s.jsx("h2", {
                    className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
                    children: "Studio (filtro de sucursal)",
                  }),
                }),
                s.jsx(_, { items: j }),
              ],
            }),
          }),
          s.jsx(o, {
            children: s.jsxs(b, {
              className: "mt-6 border-border/60",
              children: [
                s.jsxs(I, {
                  className: "pb-2",
                  children: [
                    s.jsx(B, { className: "text-base", children: "Conversaciones (análisis)" }),
                    s.jsx(O, {
                      children:
                        "Puedes inspeccionar la bandeja de cualquier sucursal en modo lectura. Filtra por store (con búsqueda) y usa el inspector de mensajes. La atención operativa queda en el negocio.",
                    }),
                  ],
                }),
                s.jsx(v, {
                  children: s.jsx(p, {
                    asChild: !0,
                    size: "sm",
                    variant: "outline",
                    children: s.jsxs(d, {
                      to: "/app/conversaciones",
                      children: [
                        "Abrir conversaciones ",
                        s.jsx(C, { className: "h-3.5 w-3.5 ml-1" }),
                      ],
                    }),
                  }),
                }),
              ],
            }),
          }),
        ],
      });
}
const vs = [
  { href: "/app/admin/organizaciones", labelKey: "org", icon: T },
  { href: "/app/admin/sucursales", label: "Sucursales", icon: S },
  { href: "/app/admin/usuarios", label: "Usuarios", icon: A },
  { href: "/app/aplicaciones", label: "Aplicaciones", icon: z },
  { href: "/app/conversaciones", label: "Conversaciones", icon: H },
];
function Ns() {
  const e = ns(),
    n = is(),
    i = q.useMemo(() => new Set(rs()), []),
    { data: c = [], isLoading: m } = V(),
    { data: u = [], isLoading: h } = J(),
    { data: l = [], isLoading: g } = ss(),
    { data: f = [], isLoading: L } = M(),
    { data: k = [], isLoading: N } = F(),
    { data: y = [], isLoading: w } = E({ scope: "store", includeInactive: !0 }),
    x = q.useMemo(() => c.filter((a) => i.has(String(a.id))), [c, i]),
    j = q.useMemo(
      () =>
        i.size === 0 ? u : u.filter((a) => a.organization != null && i.has(String(a.organization))),
      [u, i],
    ),
    r = m || h || g || L || N || w,
    t = [
      {
        key: "stores",
        label: "Sucursales del holding",
        count: j.filter((a) => a.is_active !== !1).length,
        icon: S,
        href: "/app/admin/sucursales",
        tone: "primary",
      },
      {
        key: "users",
        label: "Usuarios",
        count: l.length,
        icon: A,
        href: "/app/admin/usuarios",
        tone: "info",
      },
      {
        key: "apps",
        label: "Aplicaciones visibles",
        count: y.filter((a) => a.is_active).length,
        icon: z,
        href: "/app/aplicaciones",
        tone: "success",
      },
      {
        key: "agents",
        label: "Agentes activos",
        count: f.filter((a) => a.is_active).length,
        icon: U,
        href: "/app/agentes",
        tone: "warning",
      },
      {
        key: "channels",
        label: "Canales activos",
        count: k.filter((a) => a.is_active).length,
        icon: D,
        href: "/app/canales",
        tone: "info",
      },
    ];
  return r
    ? s.jsx($, { variant: "dashboard" })
    : s.jsxs(R, {
        children: [
          s.jsx(o, {
            children: s.jsx(Q, {
              description: n
                ? `Stores, equipo y Studio de ${n}. Conversaciones solo de tus sucursales (filtra con búsqueda).`
                : "Stores, equipo y Studio de tu organización. Conversaciones solo de tus sucursales (filtra con búsqueda).",
              actions: s.jsx(Y, {}),
              className: "mb-3",
            }),
          }),
          s.jsx(o, {
            children: s.jsx(_, {
              items: t,
              columnsClass: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
            }),
          }),
          s.jsx(o, {
            children: s.jsxs("section", {
              className: "mt-6 space-y-3",
              children: [
                s.jsx("h2", {
                  className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
                  children: "Accesos rápidos",
                }),
                s.jsx("div", {
                  className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3",
                  children: vs.map((a) =>
                    s.jsx(
                      p,
                      {
                        asChild: !0,
                        variant: "outline",
                        className: "h-auto py-3 justify-start gap-2",
                        children: s.jsxs(d, {
                          to: a.href,
                          children: [
                            s.jsx(a.icon, { className: "h-4 w-4 text-primary shrink-0" }),
                            s.jsx("span", {
                              className: "truncate",
                              children: "label" in a ? a.label : e,
                            }),
                            s.jsx(C, { className: "h-3.5 w-3.5 ml-auto opacity-50" }),
                          ],
                        }),
                      },
                      a.href,
                    ),
                  ),
                }),
              ],
            }),
          }),
          x.length > 0 &&
            s.jsx(o, {
              children: s.jsxs(b, {
                className: "mt-6 border-border/60",
                children: [
                  s.jsxs(I, {
                    className: "pb-2",
                    children: [
                      s.jsx(B, { className: "text-base", children: "Tu organización" }),
                      s.jsx(O, {
                        children:
                          x.length === 1
                            ? "Holding activo bajo tu cuenta."
                            : `${x.length} holdings asociados a tu cuenta.`,
                      }),
                    ],
                  }),
                  s.jsx(v, {
                    className: "space-y-2",
                    children: x.map((a) =>
                      s.jsxs(
                        "div",
                        {
                          className:
                            "flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 text-sm",
                          children: [
                            s.jsxs("div", {
                              className: "min-w-0",
                              children: [
                                s.jsx("p", { className: "font-medium truncate", children: a.name }),
                                s.jsxs("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children: [
                                    a.stores_count ?? "—",
                                    " sucursales ·",
                                    " ",
                                    a.is_active === !1 ? "Inactiva" : "Activa",
                                  ],
                                }),
                              ],
                            }),
                            s.jsx(p, {
                              asChild: !0,
                              size: "sm",
                              variant: "ghost",
                              children: s.jsx(d, {
                                to: "/app/admin/organizaciones",
                                children: "Abrir",
                              }),
                            }),
                          ],
                        },
                        String(a.id),
                      ),
                    ),
                  }),
                ],
              }),
            }),
        ],
      });
}
function ys(e) {
  const n = ts();
  return ps({
    queryKey: ["analytics", "clinic-dashboard", n],
    queryFn: () => cs(os.analytics.clinicDashboard),
    staleTime: 6e4,
    enabled: e?.enabled !== !1,
  });
}
function ws() {
  const { data: e, isLoading: n, isError: i } = ls();
  if (n)
    return s.jsx(b, {
      children: s.jsx(v, {
        className: "p-5 text-sm text-muted-foreground",
        children: "Cargando salud operativa…",
      }),
    });
  if (i || !e) return null;
  const c = !!e.ready_for_production,
    m = e.checklist ?? {},
    u = e.last_24h ?? {},
    h = e.onboarding?.next_steps ?? [],
    l = u.tool_calls_failed ?? m.tool_failures_24h ?? 0;
  return s.jsxs(b, {
    className: P(c ? "border-success/40" : "border-warning/40"),
    children: [
      s.jsxs(I, {
        className: "pb-2 flex flex-row items-start justify-between gap-3 space-y-0",
        children: [
          s.jsxs("div", {
            className: "min-w-0 space-y-1",
            children: [
              s.jsxs(B, {
                className: "text-base flex items-center gap-2",
                children: [s.jsx(ds, { className: "h-4 w-4 shrink-0" }), "Salud operativa"],
              }),
              s.jsx(O, { children: "Checklist go-live de la sucursal (últimas 24h)." }),
            ],
          }),
          s.jsx(ms, {
            variant: c ? "default" : "secondary",
            className: "shrink-0",
            children: c ? "Listo" : "Pendiente",
          }),
        ],
      }),
      s.jsxs(v, {
        className: "space-y-3",
        children: [
          s.jsxs("ul", {
            className: "space-y-1.5 text-sm",
            children: [
              s.jsx(K, { ok: !!m.ready_to_chat, label: "Listo para chatear (LLM + agente)" }),
              s.jsx(K, { ok: !!m.has_bidirectional_channel, label: "Canal bidireccional activo" }),
              s.jsx(K, {
                ok: l === 0,
                label:
                  l === 0
                    ? "Sin fallos de skills (24h)"
                    : `${l} fallo${l === 1 ? "" : "s"} de skills (24h)`,
              }),
            ],
          }),
          !c && h.length > 0
            ? s.jsxs("div", {
                className: "rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5",
                children: [
                  s.jsx("p", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Próximos pasos",
                  }),
                  h
                    .slice(0, 3)
                    .map((g, f) =>
                      s.jsx(
                        "p",
                        {
                          className: "text-xs text-foreground leading-relaxed",
                          children: g.message,
                        },
                        g.code || f,
                      ),
                    ),
                ],
              })
            : null,
          s.jsxs("div", {
            className: "flex flex-wrap gap-2 pt-1",
            children: [
              s.jsx(p, {
                asChild: !0,
                size: "sm",
                variant: "outline",
                className: "h-8",
                children: s.jsxs(d, {
                  to: "/app/agentes",
                  children: ["Agentes ", s.jsx(C, { className: "h-3.5 w-3.5 ml-1" })],
                }),
              }),
              s.jsx(p, {
                asChild: !0,
                size: "sm",
                variant: "ghost",
                className: "h-8",
                children: s.jsx(d, { to: "/app/canales", children: "Canales" }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function K({ ok: e, label: n }) {
  return s.jsxs("li", {
    className: "flex items-center gap-2",
    children: [
      e
        ? s.jsx(us, { className: "h-3.5 w-3.5 text-success shrink-0" })
        : s.jsx(Z, { className: "h-3.5 w-3.5 text-warning shrink-0" }),
      s.jsx("span", { className: P(e ? "text-foreground" : "text-muted-foreground"), children: n }),
    ],
  });
}
function Ls() {
  const e = hs(),
    n = gs(),
    { data: i = [], isLoading: c } = M(),
    { data: m = [], isLoading: u } = F(),
    { data: h = [], isLoading: l } = E(),
    { data: g = [], isLoading: f } = W(),
    { data: L, isLoading: k } = ys({ enabled: e }),
    N = L,
    y = N?.kpis?.active_conversations ?? 0,
    w = N?.human_conversations ?? [],
    x = c || u || l || (n && f) || (e && k),
    j = [
      {
        key: "agents",
        label: "Agentes",
        count: i.filter((t) => t.is_active).length,
        icon: U,
        href: "/agentes",
        tone: "primary",
      },
      {
        key: "channels",
        label: "Canales",
        count: m.filter((t) => t.is_active).length,
        icon: D,
        href: "/canales",
        tone: "success",
      },
      {
        key: "apis",
        label: "Aplicaciones",
        count: h.filter((t) => t.is_active).length,
        icon: z,
        href: "/aplicaciones",
        tone: "info",
      },
      ...(n
        ? [
            {
              key: "functions",
              label: "Skills",
              count: g.filter((t) => t.is_active).length,
              icon: X,
              href: "/skills",
              tone: "warning",
            },
          ]
        : []),
      ...(e
        ? [
            {
              key: "conversations",
              label: "Conversaciones activas",
              count: y,
              icon: H,
              href: "/conversaciones",
              tone: "primary",
            },
          ]
        : []),
    ],
    r =
      j.length >= 5
        ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
        : j.length === 4
          ? "grid-cols-2 md:grid-cols-4"
          : "grid-cols-2 md:grid-cols-3";
  return x
    ? s.jsx($, { variant: "dashboard" })
    : s.jsxs(R, {
        children: [
          s.jsx(o, {
            children: s.jsx(Q, {
              description: "Operación de tu sucursal: agentes, canales y cola humana.",
              actions: s.jsx(Y, {}),
              className: "mb-3",
            }),
          }),
          s.jsx(o, { children: s.jsx(_, { items: j, columnsClass: r }) }),
          s.jsx(o, { children: s.jsx("section", { className: "mt-4", children: s.jsx(ws, {}) }) }),
          e &&
            s.jsx(o, {
              children: s.jsxs("section", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4",
                children: [
                  s.jsxs(b, {
                    children: [
                      s.jsxs(I, {
                        className:
                          "pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 space-y-0",
                        children: [
                          s.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              s.jsx(B, {
                                className: "text-base",
                                children: "Contacto con clientes",
                              }),
                              s.jsx(O, {
                                children: "Últimas conversaciones que requieren atención.",
                              }),
                            ],
                          }),
                          s.jsx(p, {
                            asChild: !0,
                            variant: "ghost",
                            size: "sm",
                            className: "h-8 self-start",
                            children: s.jsxs(d, {
                              to: "/app/conversaciones",
                              children: ["Ver todas ", s.jsx(C, { className: "h-3.5 w-3.5 ml-1" })],
                            }),
                          }),
                        ],
                      }),
                      s.jsxs(v, {
                        className: "space-y-2",
                        children: [
                          w.length === 0 &&
                            s.jsx("div", {
                              className: "text-center py-8 text-muted-foreground text-sm",
                              children: "No hay conversaciones pendientes de atención humana.",
                            }),
                          w.slice(0, 5).map((t, a) => {
                            const es =
                              t.id != null && t.id !== ""
                                ? `/conversaciones?id=${encodeURIComponent(String(t.id))}`
                                : "/conversaciones";
                            return s.jsxs(
                              d,
                              {
                                to: es,
                                className:
                                  "flex items-center justify-between gap-3 rounded-lg border p-3 transition hover:border-primary/40 hover:bg-muted/30",
                                children: [
                                  s.jsxs("div", {
                                    className: "min-w-0",
                                    children: [
                                      s.jsx("div", {
                                        className: "font-medium text-sm truncate",
                                        children: t.external_user_name || "Cliente",
                                      }),
                                      s.jsxs("div", {
                                        className: "text-[11px] text-muted-foreground",
                                        children: [
                                          t.message_count ?? 0,
                                          " mensajes ·",
                                          " ",
                                          t.last_message_at
                                            ? new Date(t.last_message_at).toLocaleString("es-CL", {
                                                day: "2-digit",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })
                                            : "—",
                                        ],
                                      }),
                                    ],
                                  }),
                                  s.jsx(Z, { className: "h-4 w-4 text-warning shrink-0" }),
                                ],
                              },
                              t.id != null ? String(t.id) : `conv-${a}`,
                            );
                          }),
                        ],
                      }),
                    ],
                  }),
                  s.jsx(b, {
                    className: "border-primary/30 bg-primary-soft/40",
                    children: s.jsxs(v, {
                      className: "p-5 flex flex-col sm:flex-row gap-4",
                      children: [
                        s.jsx("div", {
                          className:
                            "h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0",
                          children: s.jsx(H, { className: "h-5 w-5" }),
                        }),
                        s.jsxs("div", {
                          className: "space-y-1 min-w-0",
                          children: [
                            s.jsx("div", {
                              className: "text-sm font-semibold text-primary",
                              children: "Revisa las conversaciones",
                            }),
                            s.jsxs("p", {
                              className: "text-sm text-foreground leading-relaxed",
                              children: [
                                "Tienes ",
                                G(y),
                                " conversaciones activas. Revisa la bandeja para ver mensajes recientes y tomar control cuando sea necesario.",
                              ],
                            }),
                            s.jsx("div", {
                              className: "pt-2",
                              children: s.jsx(p, {
                                asChild: !0,
                                size: "sm",
                                children: s.jsx(d, {
                                  to: "/app/conversaciones",
                                  children: "Ver conversaciones",
                                }),
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
        ],
      });
}
const ks = { platform: bs, organization: Ns, business: Ls };
function Os() {
  const e = xs(),
    n = ks[e];
  return s.jsx(n, {});
}
export { Os as default };
