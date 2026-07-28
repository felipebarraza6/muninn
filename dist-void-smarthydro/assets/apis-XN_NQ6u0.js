import { r as n, j as e, af as De, ah as Fe } from "./vendor-react-DUYfdZnL.js";
import {
  B as w,
  aj as He,
  c as T,
  bx as We,
  i as Ae,
  d as Ee,
  ar as Ue,
  as as Ge,
  aJ as Ve,
  dG as F,
  bJ as Ke,
  dH as Ye,
  dI as $e,
  dJ as qe,
  dK as Je,
  dL as Xe,
  s as Qe,
  h as M,
  ag as Ze,
  j as es,
  k as ss,
  dM as ts,
  dN as as,
  dO as Le,
  V as k,
  H as rs,
  W as fe,
  X as be,
  Y as ye,
  Z as je,
  $ as J,
  ak as ve,
  A as ns,
  b as os,
  aP as Ne,
  F as we,
  a7 as B,
  aa as is,
  ab as ls,
  ac as cs,
  ad as ds,
  U as _,
  a0 as us,
  a5 as ke,
  af as ms,
  cC as Te,
  dP as hs,
  cx as xs,
  K as Se,
  dz as ps,
  a6 as gs,
} from "./studio-chat-Bi-RYdat.js";
import { A as X, f as fs, a as bs } from "./external-api-Dqhtjsyy.js";
import { u as ys, A as Ce, m as z } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function js({ children: a, className: d, contentClassName: u, step: v = 220 }) {
  const g = n.useRef(null),
    [x, p] = n.useState(!1),
    [f, m] = n.useState(!1),
    h = n.useCallback(() => {
      const c = g.current;
      if (!c) return;
      const { scrollLeft: o, clientWidth: y, scrollWidth: j } = c;
      (p(o > 4), m(o + y < j - 4));
    }, []);
  n.useEffect(() => {
    const c = g.current;
    if (!c) return;
    (h(), c.addEventListener("scroll", h, { passive: !0 }));
    const o = new ResizeObserver(h);
    return (
      o.observe(c),
      window.addEventListener("resize", h),
      () => {
        (c.removeEventListener("scroll", h),
          o.disconnect(),
          window.removeEventListener("resize", h));
      }
    );
  }, [h, a]);
  const i = (c) => {
    g.current?.scrollBy({ left: c * v, behavior: "smooth" });
  };
  return e.jsxs("div", {
    className: T("relative flex items-center gap-1 min-w-0", d),
    children: [
      e.jsx(w, {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: T(
          "h-8 w-8 shrink-0 rounded-full border border-border/60 bg-background/80",
          !x && "opacity-35 pointer-events-none",
        ),
        disabled: !x,
        onClick: () => i(-1),
        "aria-label": "Desplazar a la izquierda",
        children: e.jsx(He, { className: "h-4 w-4" }),
      }),
      e.jsx("div", {
        ref: g,
        className: T(
          "flex-1 min-w-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          u,
        ),
        children: e.jsx("div", {
          className: "flex w-max items-center gap-1.5 py-0.5",
          children: a,
        }),
      }),
      e.jsx(w, {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: T(
          "h-8 w-8 shrink-0 rounded-full border border-border/60 bg-background/80",
          !f && "opacity-35 pointer-events-none",
        ),
        disabled: !f,
        onClick: () => i(1),
        "aria-label": "Desplazar a la derecha",
        children: e.jsx(We, { className: "h-4 w-4" }),
      }),
    ],
  });
}
const vs = "EMPLOYEE",
  _e = [F, $e, vs];
function Ns() {
  const a = Ae(),
    d = Ee(),
    u = Ue(),
    { data: v = [], isLoading: g } = Ge({ enabled: !a && u.length === 0 }),
    x = n.useMemo(() => (u.length > 0 ? u[0] : v[0]?.id != null ? String(v[0].id) : null), [u, v]),
    { data: p, isLoading: f, isError: m } = Ve(a ? null : x),
    h = n.useMemo(() => {
      const i = new Set();
      d && i.add(F);
      for (const c of Ke().filter((o) => o.is_active !== !1)) {
        const o = Ye(c);
        o === "ORG_OWNER" ? i.add(F) : _e.includes(o) && i.add(o);
      }
      return i;
    }, [d]);
  return n.useMemo(() => {
    if (a) return { ready: !0, allowedIds: null };
    if (!x) return { ready: !g, allowedIds: null };
    if (f) return { ready: !1, allowedIds: null };
    if (m || !p) return { ready: !0, allowedIds: null };
    const i = (p.org_allowed_external_api_ids ?? []).map(String),
      c = i.length > 0,
      o = p.roles ?? { OWNER: [], ADMIN_LOCAL: [], EMPLOYEE: [] },
      y = new Set();
    let j = !1;
    if (d) {
      if (c) {
        j = !0;
        for (const b of i) y.add(b);
      } else if ((o.OWNER ?? []).length > 0) {
        j = !0;
        for (const b of o.OWNER) y.add(String(b));
      }
    }
    for (const b of _e) {
      if (!h.has(b) || (d && b === F && (c || (o.OWNER ?? []).length > 0))) continue;
      const A = (o[b] ?? []).map(String);
      if (c)
        if (((j = !0), A.length > 0)) {
          const S = new Set(i);
          for (const E of A) S.has(E) && y.add(E);
        } else for (const S of i) y.add(S);
      else if (A.length > 0) {
        j = !0;
        for (const S of A) y.add(S);
      }
    }
    return { ready: !0, allowedIds: j ? y : null };
  }, [a, x, g, f, m, p, d, h]);
}
const D = "__all__";
function ws(a) {
  return a.endpoints ? Object.keys(a.endpoints).length : 0;
}
function Ss(a, d) {
  return new Set([
    ...(a.branches ?? []).map(String),
    ...(a.branch != null ? [String(a.branch)] : []),
  ]).has(d);
}
function Cs({
  api: a,
  canManage: d,
  showEndpointCount: u,
  showBranchCount: v,
  testPending: g,
  onTest: x,
}) {
  const p = ws(a),
    f = a.branch_names ?? [],
    m = Math.max(f.length, a.branches?.length ?? 0, a.branch ? 1 : 0),
    h = (a.tags ?? []).filter(Boolean),
    i = h.slice(0, 3),
    c = h.length - i.length;
  return e.jsxs("article", {
    className: T(
      "group relative flex h-full flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
      "hover:border-primary/40 hover:bg-card hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.12)]",
      a.is_active ? "border-border/80" : "border-border/50 opacity-75",
    ),
    children: [
      e.jsxs("div", {
        className: "flex items-start gap-3.5",
        children: [
          e.jsx(xs, { name: a.name, src: a.icon_display_url || a.icon_url || a.icon }),
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
                  e.jsx(Se, {
                    variant: a.is_active ? "default" : "secondary",
                    className: "text-[10px] font-normal",
                    children: a.is_active ? "Activa" : "Inactiva",
                  }),
                  a.category
                    ? e.jsx(Se, {
                        variant: "outline",
                        className: "text-[10px] font-normal border-primary/30 text-primary",
                        children: a.category,
                      })
                    : null,
                ],
              }),
              e.jsx("p", {
                className: "text-[11px] text-muted-foreground truncate",
                children: Le(a.base_url),
              }),
              e.jsxs("div", {
                className: "flex flex-wrap gap-1.5",
                children: [
                  e.jsx("span", {
                    className:
                      "inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground",
                    children: X[a.auth_type ?? "none"] ?? a.auth_type,
                  }),
                  u &&
                    e.jsxs("span", {
                      className:
                        "inline-flex items-center rounded-md border border-border/70 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground",
                      children: [p, " endpoint", p === 1 ? "" : "s"],
                    }),
                  v &&
                    e.jsxs("span", {
                      className:
                        "inline-flex items-center rounded-md border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[10px] text-primary",
                      title: f.join(", ") || void 0,
                      children: [m, " sucursal", m === 1 ? "" : "es"],
                    }),
                ],
              }),
              i.length > 0 &&
                e.jsxs("div", {
                  className: "flex flex-wrap gap-1 pt-0.5",
                  children: [
                    i.map((o) =>
                      e.jsx(
                        "span",
                        {
                          className:
                            "inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[10px] text-muted-foreground",
                          children: o,
                        },
                        o,
                      ),
                    ),
                    c > 0 &&
                      e.jsxs("span", {
                        className:
                          "inline-flex items-center rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground",
                        children: ["+", c],
                      }),
                  ],
                }),
            ],
          }),
        ],
      }),
      a.description
        ? e.jsx("p", {
            className: "mt-3 text-[12px] text-muted-foreground line-clamp-2 leading-relaxed",
            children: a.description,
          })
        : e.jsx("p", {
            className: "mt-3 text-[12px] text-muted-foreground/60",
            children: "Sin descripción",
          }),
      e.jsxs("div", {
        className:
          "mt-auto flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-3 mt-4",
        children: [
          e.jsx(w, {
            size: "sm",
            className: "h-8",
            asChild: !0,
            children: e.jsxs(Fe, {
              to: `${Te}/${a.id}`,
              children: ["Abrir", e.jsx(ps, { className: "h-3.5 w-3.5 ml-1" })],
            }),
          }),
          d &&
            e.jsxs(w, {
              variant: "ghost",
              size: "sm",
              className: "h-8",
              disabled: g,
              onClick: x,
              title: a.health_endpoint_key
                ? `Prueba el endpoint «${a.health_endpoint_key}»`
                : a.auth_type === "endpoint_auth"
                  ? "Prueba el login (o configurá un endpoint de prueba en la app)"
                  : "GET a la URL base (o configurá un endpoint de prueba en la app)",
              children: [
                g
                  ? e.jsx(ke, { className: "h-3.5 w-3.5 mr-1 animate-spin" })
                  : e.jsx(gs, { className: "h-3.5 w-3.5 mr-1" }),
                "Probar",
              ],
            }),
        ],
      }),
    ],
  });
}
function Os() {
  const a = De(),
    d = ys(),
    u = qe(),
    v = Je(),
    g = Xe(),
    x = Qe(),
    p = Ae(),
    f = Ee(),
    [m, h] = n.useState(M),
    [i, c] = n.useState(D),
    [o, y] = n.useState([]),
    { data: j = [], isLoading: b, refetch: A } = Ze({ scope: "store", includeInactive: !0 }),
    { ready: S, allowedIds: E } = Ns(),
    { data: Q = [] } = es({ enabled: x && (p || f) }),
    { data: Z = [] } = ss(),
    H = ts(),
    ee = as(),
    [Oe, O] = n.useState(!1),
    [P, Ie] = n.useState(""),
    [se, te] = n.useState(""),
    [ae, re] = n.useState(""),
    [ne, oe] = n.useState(""),
    [C, ie] = n.useState("none"),
    [W, le] = n.useState(""),
    [ce, de] = n.useState(""),
    [ue, U] = n.useState(""),
    [I, G] = n.useState([]),
    [Re, V] = n.useState(null),
    L = n.useMemo(() => (E ? j.filter((s) => E.has(String(s.id))) : j), [j, E]),
    me = n.useMemo(() => {
      const s = Z.map((r) => ({ id: String(r.value), label: r.label }));
      if (p || f) {
        const r = Q.map((l) => ({
            id: String(l.id),
            label: l.fantasy_name?.trim() || l.business_name || String(l.id),
          })),
          t = new Map();
        for (const l of [...r, ...s]) t.has(l.id) || t.set(l.id, l);
        return Array.from(t.values()).sort((l, R) =>
          l.label.localeCompare(R.label, "es", { sensitivity: "base" }),
        );
      }
      return s;
    }, [Q, p, f, Z]),
    K = n.useMemo(() => {
      const s = new Set();
      for (const r of L) {
        const t = (r.category || "").trim();
        t && s.add(t);
      }
      return Array.from(s).sort((r, t) => r.localeCompare(t, "es", { sensitivity: "base" }));
    }, [L]),
    Y = n.useMemo(() => {
      const s = new Set();
      for (const r of L)
        for (const t of r.tags ?? []) {
          const l = String(t || "").trim();
          l && s.add(l);
        }
      return Array.from(s).sort((r, t) => r.localeCompare(t, "es", { sensitivity: "base" }));
    }, [L]),
    he = n.useMemo(() => {
      const s = P.trim().toLowerCase(),
        r = x && m !== M;
      return L.filter((t) => {
        if (
          (r && (t.is_active === !1 || !Ss(t, m))) ||
          (i !== D && (t.category || "").trim() !== i)
        )
          return !1;
        if (o.length > 0) {
          const N = new Set((t.tags ?? []).map((q) => String(q).toLowerCase()));
          if (!o.every((q) => N.has(q.toLowerCase()))) return !1;
        }
        if (!s) return !0;
        const l = Le(t.base_url || "") || "";
        return [
          t.name,
          t.base_url,
          l,
          t.description,
          t.category,
          t.auth_type,
          X[t.auth_type ?? "none"],
          ...(t.branch_names ?? []),
          ...(t.tags ?? []).map((N) => String(N)),
        ]
          .filter((N) => N != null && String(N).trim() !== "")
          .join(
            `
`,
          )
          .toLowerCase()
          .includes(s);
      }).sort((t, l) => {
        const R = t.is_active !== !1 ? 0 : 1,
          N = l.is_active !== !1 ? 0 : 1;
        return R !== N ? R - N : String(t.name || "").localeCompare(String(l.name || ""), "es");
      });
    }, [L, P, x, m, i, o]),
    xe = () => {
      (te(""), re(""), oe(""), ie("none"), le(""), de(""), U(""), G([]));
    },
    Be = (s) => {
      const r = s.trim();
      !r ||
        I.length >= 8 ||
        I.some((t) => t.toLowerCase() === r.toLowerCase()) ||
        (G((t) => [...t, r.slice(0, 32)]), U(""));
    },
    Pe = (s) => {
      y((r) => (r.includes(s) ? r.filter((t) => t !== s) : [...r, s]));
    },
    Me = e.jsxs("div", {
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
                    e.jsx(Ne, { className: "h-4 w-4", strokeWidth: 1.75 }),
                    e.jsx("span", {
                      className: "text-[11px] font-medium uppercase tracking-[0.14em]",
                      children: "Store",
                    }),
                  ],
                }),
                e.jsx("h1", {
                  className: "text-2xl md:text-3xl font-semibold tracking-tight",
                  children: "Store de apps",
                }),
                e.jsxs("p", {
                  className: "text-sm text-muted-foreground max-w-lg leading-relaxed",
                  children: [
                    "Catálogo de aplicaciones. Filtra por sucursal, categoría o tags; en el detalle ves dónde está disponible.",
                    !u &&
                      e.jsxs("span", {
                        className: "inline-flex items-center gap-1 ml-1.5",
                        children: [e.jsx(hs, { className: "h-3 w-3" }), " Solo lectura"],
                      }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex flex-wrap items-center gap-2 shrink-0",
              children:
                u &&
                e.jsxs(w, {
                  size: "sm",
                  onClick: () => O(!0),
                  children: [e.jsx(we, { className: "h-4 w-4 mr-1.5" }), "Añadir aplicación"],
                }),
            }),
          ],
        }),
      ],
    }),
    pe = x && m !== M,
    $ = !!P.trim() || pe || i !== D || o.length > 0,
    ze = e.jsxs("div", {
      className: "space-y-2.5",
      children: [
        e.jsxs("div", {
          className: "flex flex-col lg:flex-row lg:items-center gap-2",
          children: [
            e.jsx(k, {
              placeholder: "Buscar por nombre, host, categoría o tag…",
              value: P,
              onChange: (s) => Ie(s.target.value),
              className: "h-9 flex-1 min-w-0",
              disabled: b,
            }),
            x &&
              me.length > 0 &&
              e.jsx(rs, {
                className: "space-y-0 shrink-0",
                label: "",
                value: m,
                onValueChange: (s) => n.startTransition(() => h(s)),
                options: me,
                allLabel: "Todas las sucursales",
                triggerClassName: "h-9 w-full lg:w-[220px]",
                disabled: b,
              }),
            K.length > 0 &&
              e.jsxs(fe, {
                value: i,
                onValueChange: (s) => n.startTransition(() => c(s)),
                disabled: b,
                children: [
                  e.jsx(be, {
                    className: "h-9 w-full lg:w-[180px]",
                    children: e.jsx(ye, { placeholder: "Categoría" }),
                  }),
                  e.jsxs(je, {
                    children: [
                      e.jsx(J, { value: D, children: "Todas las categorías" }),
                      K.map((s) => e.jsx(J, { value: s, children: s }, s)),
                    ],
                  }),
                ],
              }),
          ],
        }),
        Y.length > 0 &&
          e.jsxs("div", {
            className: "space-y-1.5",
            children: [
              e.jsxs(js, {
                children: [
                  Y.map((s) => {
                    const r = o.includes(s);
                    return e.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => n.startTransition(() => Pe(s)),
                        className: T(
                          "inline-flex items-center shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors whitespace-nowrap",
                          r
                            ? "border-primary/40 bg-primary/15 text-primary"
                            : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/30",
                        ),
                        children: s,
                      },
                      s,
                    );
                  }),
                  o.length > 0 &&
                    e.jsxs("button", {
                      type: "button",
                      onClick: () => n.startTransition(() => y([])),
                      className:
                        "inline-flex items-center gap-1 shrink-0 rounded-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap",
                      children: [e.jsx(ve, { className: "h-3 w-3" }), " Limpiar tags"],
                    }),
                ],
              }),
              o.length > 0 &&
                e.jsxs("p", {
                  className: "text-[11px] text-muted-foreground px-0.5",
                  children: [
                    o.length,
                    " tag",
                    o.length === 1 ? "" : "s",
                    " activo",
                    o.length === 1 ? "" : "s",
                  ],
                }),
            ],
          }),
      ],
    }),
    ge = d;
  return e.jsxs(ns, {
    className: "space-y-5",
    children: [
      Me,
      ze,
      e.jsx(Ce, {
        mode: "wait",
        children:
          b || !S
            ? e.jsx(
                z.div,
                {
                  initial: ge ? !1 : { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 },
                  children: e.jsx(os, { variant: "cards", padded: !1 }),
                },
                "skeleton",
              )
            : he.length === 0
              ? e.jsxs(
                  z.div,
                  {
                    initial: ge ? !1 : { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.2 },
                    className:
                      "rounded-2xl border border-dashed border-border/80 py-16 text-center space-y-3 bg-card/30",
                    children: [
                      e.jsx("div", {
                        className:
                          "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20",
                        children: e.jsx(Ne, { className: "h-7 w-7", strokeWidth: 1.5 }),
                      }),
                      e.jsxs("div", {
                        className: "space-y-1",
                        children: [
                          e.jsx("p", {
                            className: "text-sm font-medium",
                            children: $ ? "Sin resultados" : "Tu store está vacío",
                          }),
                          e.jsx("p", {
                            className: "text-sm text-muted-foreground max-w-sm mx-auto",
                            children: pe
                              ? "No hay apps activas en esta sucursal."
                              : $
                                ? "Prueba otra búsqueda o limpia los filtros."
                                : u
                                  ? "Añade la primera aplicación al catálogo y habilítala en las sucursales que correspondan."
                                  : "No hay aplicaciones en el store.",
                          }),
                        ],
                      }),
                      u &&
                        !$ &&
                        e.jsxs(w, {
                          size: "sm",
                          variant: "outline",
                          onClick: () => O(!0),
                          children: [
                            e.jsx(we, { className: "h-4 w-4 mr-1.5" }),
                            " Añadir aplicación",
                          ],
                        }),
                    ],
                  },
                  "empty",
                )
              : e.jsx(
                  z.div,
                  {
                    layout: !0,
                    variants: d
                      ? void 0
                      : { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
                    initial: d ? !1 : "hidden",
                    animate: "show",
                    className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5",
                    children: e.jsx(Ce, {
                      mode: "popLayout",
                      children: he.map((s) =>
                        e.jsx(
                          z.div,
                          {
                            layout: !d,
                            variants: d
                              ? void 0
                              : {
                                  hidden: { opacity: 0, y: 10 },
                                  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
                                },
                            exit: d ? void 0 : { opacity: 0, scale: 0.98 },
                            children: e.jsx(Cs, {
                              api: s,
                              canManage: u,
                              showEndpointCount: v,
                              showBranchCount: g,
                              testPending: Re === String(s.id) && ee.isPending,
                              onTest: () => {
                                (V(String(s.id)),
                                  ee.mutate(
                                    { id: String(s.id), body: {} },
                                    {
                                      onSuccess: (r) => {
                                        const t = fs(r);
                                        (t.ok ? B.success(t.message) : B.error(t.message), V(null));
                                      },
                                      onError: (r) => {
                                        (B.error(r?.friendlyMessage || "Prueba falló"), V(null));
                                      },
                                    },
                                  ));
                              },
                            }),
                          },
                          s.id,
                        ),
                      ),
                    }),
                  },
                  "content",
                ),
      }),
      e.jsx(is, {
        open: Oe,
        onOpenChange: (s) => {
          (O(s), s || xe());
        },
        children: e.jsxs(ls, {
          className: "max-w-md max-h-[90vh] overflow-y-auto",
          children: [
            e.jsx(cs, { children: e.jsx(ds, { children: "Añadir aplicación" }) }),
            e.jsxs("form", {
              className: "space-y-3",
              onSubmit: (s) => {
                if ((s.preventDefault(), !u)) return;
                const r = (m !== M ? m : null) || ms(),
                  t = r ? { branches: [Number.isNaN(Number(r)) ? r : Number(r)] } : {};
                H.mutate(
                  {
                    name: se.trim(),
                    description: ae.trim() || void 0,
                    base_url: ne.trim(),
                    auth_type: C,
                    is_active: !0,
                    category: ce.trim() || null,
                    tags: I,
                    ...(W.trim() ? { api_key: W.trim() } : {}),
                    ...t,
                  },
                  {
                    onSuccess: (l) => {
                      (B.success("Aplicación añadida. Completá la configuración y los endpoints."),
                        O(!1),
                        xe(),
                        A(),
                        l?.id && a(`${Te}/${l.id}`));
                    },
                    onError: () => B.error("No se pudo añadir"),
                  },
                );
              },
              children: [
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "Nombre" }),
                    e.jsx(k, {
                      value: se,
                      onChange: (s) => te(s.target.value),
                      required: !0,
                      placeholder: "ej. Dentidesk, SmartHydro",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "URL base" }),
                    e.jsx(k, {
                      value: ne,
                      onChange: (s) => oe(s.target.value),
                      placeholder: "https://api.example.com",
                      required: !0,
                      className: "font-mono text-sm",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "Descripción" }),
                    e.jsx(us, {
                      value: ae,
                      onChange: (s) => re(s.target.value),
                      rows: 2,
                      placeholder: "Qué hace esta app en tu operación",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "Categoría" }),
                    e.jsx(k, {
                      value: ce,
                      onChange: (s) => de(s.target.value),
                      placeholder: "ej. Salud, ERP, Logística",
                      list: "store-category-suggestions",
                    }),
                    e.jsx("datalist", {
                      id: "store-category-suggestions",
                      children: K.map((s) => e.jsx("option", { value: s }, s)),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "Tags" }),
                    e.jsx(k, {
                      value: ue,
                      onChange: (s) => U(s.target.value),
                      onKeyDown: (s) => {
                        (s.key === "Enter" || s.key === ",") && (s.preventDefault(), Be(ue));
                      },
                      placeholder: "Enter para agregar (máx. 8)",
                      list: "store-tag-suggestions",
                    }),
                    e.jsx("datalist", {
                      id: "store-tag-suggestions",
                      children: Y.map((s) => e.jsx("option", { value: s }, s)),
                    }),
                    I.length > 0 &&
                      e.jsx("div", {
                        className: "flex flex-wrap gap-1.5",
                        children: I.map((s) =>
                          e.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => G((r) => r.filter((t) => t !== s)),
                              className:
                                "inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px]",
                              children: [s, e.jsx(ve, { className: "h-3 w-3" })],
                            },
                            s,
                          ),
                        ),
                      }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(_, { children: "Autenticación" }),
                    e.jsxs(fe, {
                      value: C,
                      onValueChange: (s) => ie(s),
                      children: [
                        e.jsx(be, { children: e.jsx(ye, {}) }),
                        e.jsx(je, {
                          children: Object.entries(X).map(([s, r]) =>
                            e.jsx(J, { value: s, children: r }, s),
                          ),
                        }),
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: bs[C] ?? "",
                    }),
                  ],
                }),
                (C === "api_key" || C === "bearer" || C === "oauth2") &&
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(_, { children: C === "api_key" ? "API Key" : "Token" }),
                      e.jsx(k, {
                        type: "password",
                        value: W,
                        onChange: (s) => le(s.target.value),
                        autoComplete: "off",
                      }),
                    ],
                  }),
                e.jsx("p", {
                  className: "text-[11px] text-muted-foreground",
                  children:
                    "Solo info general. Los endpoints y sucursales se configuran después en el detalle.",
                }),
                e.jsxs("div", {
                  className: "flex justify-end gap-2",
                  children: [
                    e.jsx(w, {
                      type: "button",
                      variant: "outline",
                      onClick: () => O(!1),
                      children: "Cancelar",
                    }),
                    e.jsxs(w, {
                      type: "submit",
                      disabled: H.isPending,
                      children: [
                        H.isPending && e.jsx(ke, { className: "mr-2 h-4 w-4 animate-spin" }),
                        "Añadir",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { Os as default };
