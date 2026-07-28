import { r as o, j as e, ah as _ } from "./vendor-react-DUYfdZnL.js";
import {
  e9 as U,
  ea as X,
  cH as Y,
  eb as $,
  e8 as E,
  V as G,
  W as N,
  X as w,
  Y as k,
  Z as S,
  $ as l,
  cN as Z,
  A as D,
  b as J,
  bU as C,
  B as h,
  F as M,
  a7 as P,
  ec as Q,
  ed as ee,
  c as F,
  K as se,
  ee as ae,
  dz as te,
  a5 as re,
  dh as ie,
  ef as le,
  eg as ne,
  eh as oe,
} from "./studio-chat-Bi-RYdat.js";
import { u as ce, A as de, m as b } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function R(a) {
  return Q(a.scope);
}
function me({ type: a }) {
  const i = "h-5 w-5";
  switch (a) {
    case "formula":
      return e.jsx(oe, { className: i, strokeWidth: 1.75 });
    case "api":
      return e.jsx(ne, { className: i, strokeWidth: 1.75 });
    case "python_code":
      return e.jsx(le, { className: i, strokeWidth: 1.75 });
    default:
      return e.jsx(C, { className: i, strokeWidth: 1.75 });
  }
}
function xe(a, i) {
  if (!i) return "bg-muted text-muted-foreground ring-border/60";
  switch (a) {
    case "formula":
      return "bg-primary/15 text-primary ring-primary/25";
    case "api":
      return "bg-sky-500/15 text-sky-400 ring-sky-500/25";
    case "python_code":
      return "bg-amber-500/15 text-amber-400 ring-amber-500/25";
    default:
      return "bg-primary/15 text-primary ring-primary/25";
  }
}
function ue({ fn: a, onRestore: i, restoring: c }) {
  const g = R(a),
    n = a.is_active !== !1,
    d = ee(a);
  return e.jsxs("article", {
    className: F(
      "group relative flex flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
      "hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]",
      n ? "border-border/80" : "border-border/50 opacity-75",
    ),
    children: [
      e.jsxs("div", {
        className: "flex items-start gap-3.5",
        children: [
          e.jsx("div", {
            className: F(
              "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ring-1 shadow-sm",
              xe(a.implementation_type, n),
            ),
            children: e.jsx(me, { type: a.implementation_type }),
          }),
          e.jsxs("div", {
            className: "min-w-0 flex-1 space-y-1.5",
            children: [
              e.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  e.jsx("h3", {
                    className: "font-semibold text-sm leading-snug truncate tracking-tight",
                    children: a.name,
                  }),
                  e.jsx(se, {
                    variant: n ? "default" : "secondary",
                    className: "text-[10px] font-normal",
                    children: n ? "Activa" : "Inactiva",
                  }),
                ],
              }),
              e.jsx("p", {
                className: "text-[11px] text-muted-foreground truncate font-mono",
                children: a.slug ?? "sin-slug",
              }),
              e.jsxs("div", {
                className: "flex flex-wrap gap-1.5",
                children: [
                  e.jsx("span", {
                    className:
                      "inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground",
                    children: a.implementation_type
                      ? E[a.implementation_type] || a.implementation_type
                      : "—",
                  }),
                  e.jsx("span", {
                    className:
                      "inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground",
                    children: ae[g] || g,
                  }),
                  a.external_api_name &&
                    e.jsx("span", {
                      className:
                        "inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground truncate max-w-[10rem]",
                      children: a.external_api_name,
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      a.description
        ? e.jsx("p", {
            className: "mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed flex-1",
            children: a.description,
          })
        : e.jsx("p", {
            className: "mt-3 text-[12px] text-muted-foreground/60 flex-1",
            children: "Sin descripción",
          }),
      e.jsxs("div", {
        className:
          "mt-4 flex flex-wrap items-center justify-between gap-1.5 border-t border-border/50 pt-3",
        children: [
          e.jsx(h, {
            size: "sm",
            className: "h-8",
            asChild: !0,
            children: e.jsxs(_, {
              to: `/app/skills/${a.id}`,
              children: ["Abrir", e.jsx(te, { className: "h-3.5 w-3.5 ml-1" })],
            }),
          }),
          !n &&
            d &&
            e.jsxs(h, {
              size: "sm",
              variant: "outline",
              className: "h-8",
              disabled: c,
              onClick: () => i(a.id),
              children: [
                c
                  ? e.jsx(re, { className: "h-3.5 w-3.5 mr-1 animate-spin" })
                  : e.jsx(ie, { className: "h-3.5 w-3.5 mr-1" }),
                "Reactivar",
              ],
            }),
        ],
      }),
    ],
  });
}
function be() {
  const a = U(),
    i = X(),
    [c, g] = o.useState(a),
    { data: n = [], isLoading: d } = Y({ includeInactive: a && c }),
    T = $(),
    [B, f] = o.useState(null),
    [j, W] = o.useState(""),
    [m, z] = o.useState("all"),
    [x, V] = o.useState("all"),
    [u, O] = o.useState("all"),
    v = o.useMemo(
      () =>
        a && c
          ? [...n].sort((s, t) => {
              const r = s.is_active !== !1 ? 0 : 1,
                L = t.is_active !== !1 ? 0 : 1;
              return r !== L ? r - L : (s.name || "").localeCompare(t.name || "", "es");
            })
          : n.filter((s) => s.is_active !== !1),
      [n, a, c],
    ),
    A = o.useMemo(() => {
      const s = new Map();
      for (const t of v) {
        if (!t.external_api) continue;
        const r = String(t.external_api);
        s.has(r) || s.set(r, t.external_api_name || r);
      }
      return Array.from(s.entries())
        .map(([t, r]) => ({ id: t, name: r }))
        .sort((t, r) => t.name.localeCompare(r.name, "es"));
    }, [v]),
    I = o.useMemo(() => {
      const s = j.trim().toLowerCase();
      return v.filter((t) => {
        const r = R(t);
        return (m !== "all" && r !== m) ||
          (x !== "all" && t.implementation_type !== x) ||
          (u !== "all" && String(t.external_api ?? "") !== u)
          ? !1
          : s
            ? t.name.toLowerCase().includes(s) ||
              (t.slug ?? "").toLowerCase().includes(s) ||
              (t.description ?? "").toLowerCase().includes(s) ||
              (t.external_api_name ?? "").toLowerCase().includes(s) ||
              (t.implementation_type
                ? (E[t.implementation_type] || "").toLowerCase()
                : ""
              ).includes(s)
            : !0;
      });
    }, [v, j, m, x, u]),
    q = (s) => {
      (f(s),
        T.mutate(s, {
          onSuccess: (t) => {
            (P.success(t.message || "Skill reactivada"), f(null));
          },
          onError: (t) => {
            (P.error(t?.friendlyMessage || "No se pudo reactivar"), f(null));
          },
        }));
    },
    H = e.jsxs("div", {
      className:
        "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/80 to-card px-5 py-5 md:px-6 md:py-6",
      children: [
        e.jsx("div", {
          className:
            "pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl",
          "aria-hidden": !0,
        }),
        e.jsx("div", {
          className:
            "pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl",
          "aria-hidden": !0,
        }),
        e.jsxs("div", {
          className: "relative flex flex-col sm:flex-row sm:items-end justify-between gap-4",
          children: [
            e.jsxs("div", {
              className: "space-y-1.5 min-w-0",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-2 text-primary",
                  children: [
                    e.jsx(C, { className: "h-4 w-4", strokeWidth: 1.75 }),
                    e.jsx("span", {
                      className: "text-[11px] font-medium uppercase tracking-[0.14em]",
                      children: "Catálogo",
                    }),
                  ],
                }),
                e.jsx("h1", {
                  className: "text-2xl md:text-3xl font-semibold tracking-tight",
                  children: "Skills",
                }),
                e.jsx("p", {
                  className: "text-sm text-muted-foreground max-w-lg leading-relaxed",
                  children:
                    "Capacidades que los agentes ejecutan: API, Matemática y Python. Ámbito global, sucursal o agente.",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex flex-wrap items-center gap-2 shrink-0",
              children: [
                a &&
                  e.jsx(h, {
                    size: "sm",
                    variant: c ? "secondary" : "outline",
                    onClick: () => g((s) => !s),
                    children: c ? "Ocultar inactivos" : "Ver inactivos",
                  }),
                i &&
                  e.jsx(h, {
                    size: "sm",
                    asChild: !0,
                    children: e.jsxs(_, {
                      to: "/app/skills/nuevo",
                      children: [e.jsx(M, { className: "h-4 w-4 mr-1.5" }), "Nueva skill"],
                    }),
                  }),
              ],
            }),
          ],
        }),
      ],
    }),
    K = e.jsxs("div", {
      className: "flex flex-col lg:flex-row gap-2 lg:items-center",
      children: [
        e.jsx(G, {
          placeholder: "Buscar por nombre, slug, tipo o aplicación…",
          value: j,
          onChange: (s) => W(s.target.value),
          disabled: d,
          className: "h-9 flex-1 min-w-0 lg:max-w-sm",
        }),
        e.jsxs("div", {
          className: "flex flex-wrap items-center gap-2",
          children: [
            e.jsxs(N, {
              value: m,
              onValueChange: (s) => z(s),
              disabled: d,
              children: [
                e.jsx(w, {
                  className: "h-9 w-[140px]",
                  children: e.jsx(k, { placeholder: "Ámbito" }),
                }),
                e.jsxs(S, {
                  children: [
                    e.jsx(l, { value: "all", children: "Ámbito: todos" }),
                    e.jsx(l, { value: "global", children: "Global" }),
                    e.jsx(l, { value: "branch", children: "Sucursal" }),
                    e.jsx(l, { value: "agent", children: "Agente" }),
                  ],
                }),
              ],
            }),
            e.jsxs(N, {
              value: x,
              onValueChange: (s) => V(s),
              disabled: d,
              children: [
                e.jsx(w, {
                  className: "h-9 w-[150px]",
                  children: e.jsx(k, { placeholder: "Tipo" }),
                }),
                e.jsxs(S, {
                  children: [
                    e.jsx(l, { value: "all", children: "Tipo: todos" }),
                    e.jsx(l, { value: "api", children: "API" }),
                    e.jsx(l, { value: "formula", children: "Matemática" }),
                    e.jsx(l, { value: "python_code", children: "Python" }),
                  ],
                }),
              ],
            }),
            A.length > 0 &&
              e.jsxs(N, {
                value: u,
                onValueChange: O,
                disabled: d,
                children: [
                  e.jsx(w, {
                    className: "h-9 w-[160px]",
                    children: e.jsx(k, { placeholder: "App" }),
                  }),
                  e.jsxs(S, {
                    children: [
                      e.jsx(l, { value: "all", children: "App: todas" }),
                      A.map((s) => e.jsx(l, { value: s.id, children: s.name }, s.id)),
                    ],
                  }),
                ],
              }),
            e.jsx(Z, {}),
          ],
        }),
      ],
    }),
    p = ce(),
    y = !!j.trim() || m !== "all" || x !== "all" || u !== "all";
  return e.jsxs(D, {
    className: "space-y-5",
    children: [
      H,
      K,
      e.jsx(de, {
        mode: "wait",
        children: d
          ? e.jsx(
              b.div,
              {
                initial: p ? !1 : { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 },
                children: e.jsx(J, { variant: "cards", padded: !1 }),
              },
              "skeleton",
            )
          : I.length === 0
            ? e.jsxs(
                b.div,
                {
                  initial: p ? !1 : { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 },
                  className:
                    "rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30",
                  children: [
                    e.jsx("div", {
                      className:
                        "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20",
                      children: e.jsx(C, { className: "h-7 w-7", strokeWidth: 1.5 }),
                    }),
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("p", {
                          className: "text-sm font-medium",
                          children: y ? "Sin resultados" : "No hay skills",
                        }),
                        e.jsx("p", {
                          className: "text-sm text-muted-foreground max-w-sm mx-auto",
                          children: y
                            ? "Prueba otro filtro o búsqueda."
                            : "Crea la primera skill para que tus agentes puedan ejecutar acciones.",
                        }),
                      ],
                    }),
                    !y &&
                      i &&
                      e.jsx(h, {
                        size: "sm",
                        variant: "outline",
                        asChild: !0,
                        children: e.jsxs(_, {
                          to: "/app/skills/nuevo",
                          children: [e.jsx(M, { className: "h-4 w-4 mr-1.5" }), " Nueva skill"],
                        }),
                      }),
                  ],
                },
                "empty",
              )
            : e.jsx(
                b.div,
                {
                  variants: p
                    ? void 0
                    : { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
                  initial: p ? !1 : "hidden",
                  animate: "show",
                  className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5",
                  children: I.map((s) =>
                    e.jsx(
                      b.div,
                      {
                        variants: p
                          ? void 0
                          : {
                              hidden: { opacity: 0, y: 10 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
                            },
                        children: e.jsx(ue, { fn: s, onRestore: q, restoring: B === s.id }),
                      },
                      s.id,
                    ),
                  ),
                },
                "content",
              ),
      }),
    ],
  });
}
export { be as default };
