import { r as i, j as e, af as te, ah as Y } from "./vendor-react-DUYfdZnL.js";
import {
  cG as re,
  a5 as H,
  U as w,
  V as G,
  W as q,
  X as R,
  Y as $,
  Z as U,
  $ as V,
  dt as ne,
  B as E,
  cD as ie,
  cK as oe,
  cL as le,
  cM as ce,
  cE as de,
  a7 as f,
  dl as K,
  du as me,
  dv as J,
  F as Z,
  cN as ue,
  b as xe,
  dw as ee,
  c as S,
  aa as ge,
  ab as he,
  ac as pe,
  ad as fe,
  dx as ve,
  dy as je,
  dz as ye,
  K as W,
  cR as be,
  bQ as Ne,
  d4 as Ce,
  dA as _e,
  A as we,
} from "./studio-chat-BBQUCckT.js";
import { a as Se, b as ke, c as Ae, u as Ee, d as Me } from "./useChannels-Cmbbb5sU.js";
import { C as Pe, c as Te } from "./channel-config-fields-bCmhv8lU.js";
import { u as Fe, A as Ie, m as z } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function Le({ channel: s, onCancel: d, onSaved: v, bare: N }) {
  const k = Se(),
    l = ke(),
    { data: M = [] } = re(),
    { data: F, isLoading: y } = Ae(),
    b = !!s,
    x = i.useMemo(() => F?.results ?? [], [F?.results]),
    [j, I] = i.useState(s?.name ?? ""),
    [g, P] = i.useState(s?.channel_type ?? ""),
    [c, h] = i.useState(s?.provider ?? ""),
    [T, A] = i.useState(s?.assigned_agent ? String(s.assigned_agent) : ""),
    [L, r] = i.useState(s?.is_active ?? !0),
    [p, n] = i.useState(s?.welcome_message ?? ""),
    [o, C] = i.useState(() => s?.config_masked ?? s?.config ?? {}),
    m = i.useMemo(() => x.find((a) => a.channel_type === g), [x, g]),
    Q = m?.providers ?? [],
    D = i.useMemo(
      () =>
        m
          ? c && m.config_fields_by_provider?.[c]
            ? m.config_fields_by_provider[c]
            : (m.config_fields ?? [])
          : [],
      [m, c],
    );
  (i.useEffect(() => {
    s &&
      (I(s.name ?? ""),
      P(s.channel_type ?? ""),
      h(s.provider ?? ""),
      A(s.assigned_agent ? String(s.assigned_agent) : ""),
      r(s.is_active ?? !0),
      n(s.welcome_message ?? ""),
      C(s.config_masked ?? s.config ?? {}));
  }, [s]),
    i.useEffect(() => {
      if (!x.length) return;
      if (!g) {
        const u = x[0];
        (P(u.channel_type), h(u.default_provider));
        return;
      }
      const a = x.find((u) => u.channel_type === g);
      if (!a) return;
      const _ = a.providers.map((u) => u.value);
      (!c || !_.includes(c)) && h(a.default_provider || _[0] || "custom");
    }, [x, g, c]));
  const se = (a, _) => {
      C((u) => ({ ...u, [a]: _ }));
    },
    ae = (a) => {
      if ((a.preventDefault(), !j.trim())) {
        f.error("El nombre es obligatorio");
        return;
      }
      if (!g || !c) {
        f.error("Selecciona tipo y proveedor");
        return;
      }
      const _ = D.filter(
          (t) =>
            t.required &&
            !t.secret &&
            (o[t.key] === void 0 || o[t.key] === null || o[t.key] === ""),
        ),
        u = b
          ? []
          : D.filter(
              (t) =>
                t.required &&
                t.secret &&
                (o[t.key] === void 0 || o[t.key] === null || o[t.key] === ""),
            );
      if (_.length || u.length) {
        f.error(`Completa: ${[..._, ...u].map((t) => t.label).join(", ")}`);
        return;
      }
      const X = {
        name: j.trim(),
        channel_type: g,
        provider: c,
        assigned_agent: T || null,
        is_active: L,
        welcome_message: p,
        config: Te(o, D),
      };
      b && s
        ? l.mutate(
            { id: s.id, data: X },
            {
              onSuccess: (t) => {
                (f.success("Canal actualizado"), v(t));
              },
              onError: (t) => f.error(K(t, "Error al actualizar el canal")),
            },
          )
        : k.mutate(X, {
            onSuccess: (t) => {
              (f.success("Canal creado"), v(t));
            },
            onError: (t) => f.error(K(t, "Error al crear el canal")),
          });
    },
    B = k.isPending || l.isPending,
    O = e.jsxs("form", {
      onSubmit: ae,
      className: "space-y-4",
      children: [
        y &&
          e.jsxs("div", {
            className: "flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              e.jsx(H, { className: "h-4 w-4 animate-spin" }),
              " Cargando tipos de canal…",
            ],
          }),
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx(w, { htmlFor: "name", children: "Nombre" }),
            e.jsx(G, { id: "name", value: j, onChange: (a) => I(a.target.value), required: !0 }),
          ],
        }),
        e.jsxs("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
          children: [
            e.jsxs("div", {
              className: "space-y-2",
              children: [
                e.jsx(w, { htmlFor: "channelType", children: "Tipo de canal" }),
                e.jsxs(q, {
                  value: g,
                  onValueChange: (a) => {
                    (P(a), C({}));
                  },
                  disabled: b,
                  children: [
                    e.jsx(R, {
                      id: "channelType",
                      children: e.jsx($, { placeholder: "Selecciona un tipo" }),
                    }),
                    e.jsx(U, {
                      children: x.map((a) =>
                        e.jsxs(
                          V,
                          {
                            value: a.channel_type,
                            children: [a.display_name, a.production_ready ? "" : " (beta)"],
                          },
                          a.channel_type,
                        ),
                      ),
                    }),
                  ],
                }),
                m?.notes
                  ? e.jsx("p", { className: "text-xs text-muted-foreground", children: m.notes })
                  : null,
              ],
            }),
            e.jsxs("div", {
              className: "space-y-2",
              children: [
                e.jsx(w, { htmlFor: "provider", children: "Proveedor" }),
                e.jsxs(q, {
                  value: c,
                  onValueChange: (a) => {
                    (h(a), C({}));
                  },
                  disabled: b && Q.length <= 1,
                  children: [
                    e.jsx(R, {
                      id: "provider",
                      children: e.jsx($, { placeholder: "Selecciona un proveedor" }),
                    }),
                    e.jsx(U, {
                      children: Q.map((a) =>
                        e.jsx(V, { value: a.value, children: a.label }, a.value),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx(w, { htmlFor: "agent", children: "Agente asignado" }),
            e.jsxs(q, {
              value: T || "__none__",
              onValueChange: (a) => A(a === "__none__" ? "" : a),
              children: [
                e.jsx(R, {
                  id: "agent",
                  children: e.jsx($, { placeholder: "Selecciona un agente" }),
                }),
                e.jsxs(U, {
                  children: [
                    e.jsx(V, { value: "__none__", children: "Ninguno" }),
                    M.map((a) => e.jsx(V, { value: String(a.id), children: a.name }, a.id)),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx(w, { htmlFor: "welcome", children: "Mensaje de bienvenida" }),
            e.jsx(G, {
              id: "welcome",
              value: p,
              onChange: (a) => n(a.target.value),
              placeholder: "Hola, ¿en qué puedo ayudarte?",
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx(w, { children: "Credenciales / configuración" }),
            e.jsx(Pe, { fields: D, values: o, onChange: se, disabled: B }),
          ],
        }),
        e.jsxs("div", {
          className: "flex items-center justify-between rounded-lg border p-3",
          children: [
            e.jsxs("div", {
              className: "space-y-0.5",
              children: [
                e.jsx(w, { htmlFor: "isActiveChannel", children: "Activo" }),
                e.jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Determina si el canal puede recibir/enviar mensajes.",
                }),
              ],
            }),
            e.jsx(ne, { id: "isActiveChannel", checked: L, onCheckedChange: r }),
          ],
        }),
        e.jsxs("div", {
          className: "flex items-center justify-end gap-2 pt-2",
          children: [
            e.jsx(E, { type: "button", variant: "outline", onClick: d, children: "Cancelar" }),
            e.jsxs(E, {
              type: "submit",
              disabled: B || y,
              children: [
                B && e.jsx(H, { className: "mr-2 h-4 w-4 animate-spin" }),
                b ? "Guardar cambios" : "Crear canal",
              ],
            }),
          ],
        }),
      ],
    });
  return N
    ? O
    : e.jsxs(ie, {
        children: [
          e.jsxs(oe, {
            children: [
              e.jsx(le, { className: "text-base", children: b ? "Editar canal" : "Nuevo canal" }),
              e.jsx(ce, { children: "Configura un punto de contacto para tus agentes." }),
            ],
          }),
          e.jsx(de, { children: O }),
        ],
      });
}
function De() {
  const s = te(),
    { data: d = [], isPending: v, isFetching: N, isPlaceholderData: k, refetch: l } = Ee(),
    M = Me(),
    [F, y] = i.useState(!1),
    [b, x] = i.useState(null),
    [j, I] = i.useState(""),
    [g, P] = i.useState(!1),
    c = me(),
    h = Fe();
  i.useEffect(() => {
    v || P(!0);
  }, [v]);
  const T = i.useMemo(() => {
      const r = j.trim().toLowerCase();
      return [
        ...(r
          ? d.filter((n) =>
              [n.name, n.channel_type, n.provider, n.assigned_agent_name, J(n.channel_type)]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(r),
            )
          : d),
      ].sort((n, o) => {
        const C = n.is_active !== !1 ? 0 : 1,
          m = o.is_active !== !1 ? 0 : 1;
        return C !== m ? C - m : (n.name || "").localeCompare(o.name || "", "es");
      });
    }, [d, j]),
    A = i.useMemo(() => {
      const r = d.filter((n) => n.is_active).length,
        p = d.filter((n) => n.is_verified).length;
      return { total: d.length, active: r, verified: p };
    }, [d]),
    L = (r, p) => {
      (r.preventDefault(),
        r.stopPropagation(),
        x(p.id),
        M.mutate(
          { id: p.id },
          {
            onSuccess: (n) => {
              const o = _e(n);
              (n.ok
                ? f.success(o.title, { description: o.description })
                : f.error(o.title, { description: o.description }),
                l());
            },
            onError: (n) => f.error(K(n, "Error al probar conexión")),
            onSettled: () => x(null),
          },
        ));
    };
  return e.jsxs("div", {
    className: "space-y-5",
    children: [
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3",
        children: [
          e.jsxs("div", {
            className: "space-y-1 min-w-0",
            children: [
              e.jsx("p", {
                className: "text-sm text-muted-foreground",
                children:
                  "Conecta WhatsApp, Telegram, web y más a tus agentes. Un canal = un puente con clientes.",
              }),
              !v &&
                d.length > 0 &&
                e.jsxs("p", {
                  className: "text-[11px] text-muted-foreground/80 tabular-nums",
                  children: [
                    A.active,
                    " activos · ",
                    A.verified,
                    " verificados · ",
                    A.total,
                    " en total",
                  ],
                }),
            ],
          }),
          c &&
            e.jsxs(E, {
              size: "sm",
              onClick: () => y(!0),
              className: "self-start sm:self-auto shrink-0",
              children: [e.jsx(Z, { className: "h-4 w-4 mr-1.5" }), " Nuevo canal"],
            }),
        ],
      }),
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row gap-2 sm:max-w-xl",
        children: [
          e.jsx(G, {
            placeholder: "Buscar por nombre, tipo, proveedor o agente…",
            value: j,
            onChange: (r) => I(r.target.value),
            className: "h-9 flex-1 min-w-0",
          }),
          e.jsx(ue, {}),
        ],
      }),
      e.jsx(Ie, {
        mode: "wait",
        children:
          v && !g
            ? e.jsx(
                z.div,
                {
                  initial: h ? !1 : { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 },
                  children: e.jsx(xe, { variant: "cards", padded: !1 }),
                },
                "skeleton",
              )
            : T.length === 0
              ? e.jsxs(
                  z.div,
                  {
                    initial: h ? !1 : { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.2 },
                    className:
                      "rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center",
                    children: [
                      e.jsx("div", {
                        className:
                          "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary",
                        children: e.jsx(ee, { className: "h-6 w-6" }),
                      }),
                      e.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: j.trim()
                          ? "Sin canales para esa búsqueda."
                          : "No hay canales aún. Crea el primero para conectar un agente.",
                      }),
                      !j.trim() &&
                        c &&
                        e.jsxs(E, {
                          size: "sm",
                          className: "mt-4",
                          onClick: () => y(!0),
                          children: [e.jsx(Z, { className: "h-4 w-4 mr-1.5" }), " Crear canal"],
                        }),
                    ],
                  },
                  "empty",
                )
              : e.jsx(
                  z.div,
                  {
                    variants: h
                      ? void 0
                      : { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
                    initial: h ? !1 : "hidden",
                    animate: "show",
                    className: S(
                      "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",
                      (N || k) && "opacity-70",
                    ),
                    children: T.map((r) =>
                      e.jsx(
                        z.div,
                        {
                          variants: h
                            ? void 0
                            : {
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
                              },
                          children: e.jsx(Ve, {
                            channel: r,
                            testing: b === r.id,
                            onTest: (p) => L(p, r),
                          }),
                        },
                        r.id,
                      ),
                    ),
                  },
                  "content",
                ),
      }),
      c &&
        e.jsx(ge, {
          open: F,
          onOpenChange: y,
          children: e.jsxs(he, {
            className: "max-w-lg max-h-[90vh] overflow-y-auto",
            children: [
              e.jsx(pe, { children: e.jsx(fe, { children: "Nuevo canal" }) }),
              e.jsx(Le, {
                bare: !0,
                onCancel: () => y(!1),
                onSaved: (r) => {
                  (y(!1), l(), r?.id && s(`/app/canales/${r.id}`));
                },
              }),
            ],
          }),
        }),
    ],
  });
}
function Ve({ channel: s, testing: d, onTest: v }) {
  const N = ve(s.channel_type),
    k = je(s.channel_type),
    l = s.is_active === !1,
    M = J(s.channel_type);
  return e.jsxs("div", {
    className: S(
      "group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
      l
        ? "border-border/40 bg-muted/40 text-muted-foreground grayscale-[0.35] opacity-80 hover:opacity-95 hover:bg-muted/50"
        : S(
            "border-border/60 bg-card/50",
            "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg",
            N.glow,
          ),
    ),
    children: [
      !l && e.jsx("div", { className: S("h-1 w-full bg-gradient-to-r", N.bar) }),
      e.jsxs(Y, {
        to: `/app/canales/${s.id}`,
        className:
          "flex flex-1 flex-col gap-4 p-4 sm:p-5 pb-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer",
        children: [
          e.jsxs("div", {
            className: "flex items-start gap-3",
            children: [
              e.jsxs("div", {
                className: S(
                  "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
                  l ? "bg-muted text-muted-foreground ring-border/60" : N.avatar,
                ),
                children: [
                  e.jsx(k, { className: "h-6 w-6", strokeWidth: 1.75 }),
                  l
                    ? e.jsx("span", {
                        className:
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/45 ring-2 ring-muted",
                      })
                    : s.is_verified
                      ? e.jsx("span", {
                          className:
                            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card",
                        })
                      : e.jsx("span", {
                          className:
                            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-warning ring-2 ring-card",
                        }),
                ],
              }),
              e.jsxs("div", {
                className: "min-w-0 flex-1",
                children: [
                  e.jsxs("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [
                      e.jsx("h3", {
                        className: S(
                          "font-semibold text-[15px] leading-snug truncate transition-colors",
                          l ? "text-muted-foreground" : "group-hover:text-primary",
                        ),
                        children: s.name,
                      }),
                      e.jsx(ye, {
                        className: S(
                          "h-4 w-4 shrink-0 transition-all",
                          l
                            ? "text-muted-foreground/40"
                            : "text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        ),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-1.5 flex flex-wrap items-center gap-1.5",
                    children: [
                      e.jsx(W, {
                        variant: "outline",
                        className: "text-[10px] h-5 font-normal",
                        children: M,
                      }),
                      l &&
                        e.jsx(W, {
                          variant: "secondary",
                          className: "text-[10px] h-5",
                          children: "Inactivo",
                        }),
                      !l &&
                        s.is_verified &&
                        e.jsxs(W, {
                          className:
                            "text-[10px] h-5 gap-0.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15",
                          children: [e.jsx(be, { className: "h-3 w-3" }), "Verificado"],
                        }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("dl", {
            className: "mt-auto grid grid-cols-1 gap-2 text-[12px]",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-2 min-w-0 text-muted-foreground",
                children: [
                  e.jsx(ee, { className: "h-3.5 w-3.5 shrink-0 opacity-70" }),
                  e.jsx("span", {
                    className: "truncate",
                    children: s.provider?.trim() || "Sin proveedor",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex items-center gap-2 min-w-0 text-muted-foreground",
                children: [
                  e.jsx(Ne, { className: "h-3.5 w-3.5 shrink-0 opacity-70" }),
                  e.jsx("span", {
                    className: "truncate",
                    children: s.assigned_agent_name?.trim() || "Sin agente asignado",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "flex items-center justify-end gap-1 border-t border-border/50 px-3 py-2",
        children: [
          e.jsxs(E, {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground",
            disabled: d,
            onClick: v,
            children: [
              d
                ? e.jsx(H, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" })
                : e.jsx(Ce, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Probar",
            ],
          }),
          e.jsx(E, {
            variant: "ghost",
            size: "sm",
            className: "h-8 px-2.5 text-xs",
            asChild: !0,
            children: e.jsx(Y, { to: `/app/canales/${s.id}`, children: "Abrir" }),
          }),
        ],
      }),
    ],
  });
}
function He() {
  return e.jsx(we, { children: e.jsx(De, {}) });
}
export { He as default };
