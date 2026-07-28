import { aw as qe, af as Ge, ag as Ke, r as i, j as e, ah as Xe } from "./vendor-react-DUYfdZnL.js";
import {
  cG as Je,
  b as Qe,
  B as l,
  M as ce,
  cD as Ye,
  cE as Ze,
  dx as es,
  dy as ss,
  du as as,
  dB as rs,
  dC as ns,
  c as Ce,
  K as E,
  dv as de,
  a5 as o,
  d4 as oe,
  dh as ts,
  a7 as n,
  b1 as me,
  dD as xe,
  a3 as ue,
  b2 as he,
  b3 as pe,
  b4 as ge,
  b5 as je,
  b6 as be,
  b7 as ve,
  b8 as fe,
  T as is,
  N as ls,
  O as f,
  Q as N,
  U as m,
  V as g,
  W as cs,
  X as ds,
  Y as os,
  Z as ms,
  $ as Ne,
  dt as xs,
  a9 as us,
  R as we,
  aU as hs,
  dE as ps,
  dF as gs,
  ae as js,
  dA as bs,
  ai as vs,
  am as fs,
} from "./studio-chat-Bi-RYdat.js";
import {
  e as Ns,
  c as ws,
  b as Cs,
  f as ys,
  g as _s,
  d as Ss,
  h as ks,
  i as Ps,
  j as Es,
} from "./useChannels-4JqEwRHd.js";
import { E as As } from "./EmbedChatPanel-Cm9Fl00A.js";
import { C as Ds, c as Ts } from "./channel-config-fields-Bq6Jumyl.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function ye(r) {
  return r.replace(/\/+$/, "");
}
function _e() {
  return typeof window > "u" ? "" : window.location.origin;
}
function Se() {
  return ye(_e());
}
function ke(r) {
  return `/embed/chat/${r}`;
}
function Pe(r) {
  return `${Se()}${ke(r)}`;
}
function Ms(r) {
  return `${ye(_e())}${ke(r)}`;
}
function Us(r) {
  return `<iframe
  src="${Pe(r)}"
  width="100%"
  height="600"
  style="border:none;border-radius:12px;"
  title="Chat"
  allow="clipboard-write">
</iframe>`;
}
function Is(r) {
  return `<script src="${Se()}/widget.js" data-channel-id="${r}" async><\/script>`;
}
const Ls = ["configuracion", "webhook", "probar", "sesiones", "instalacion"];
function w({ title: r, description: c, actions: d, children: j, className: s }) {
  return e.jsxs("section", {
    className: Ce("rounded-2xl border border-border/60 bg-card/40 overflow-hidden", s),
    children: [
      e.jsxs("div", {
        className:
          "flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-4 sm:px-5 py-4 border-b border-border/50",
        children: [
          e.jsxs("div", {
            className: "min-w-0 space-y-0.5",
            children: [
              e.jsx("h2", { className: "text-sm font-semibold tracking-tight", children: r }),
              c
                ? e.jsx("p", {
                    className: "text-xs text-muted-foreground leading-relaxed",
                    children: c,
                  })
                : null,
            ],
          }),
          d ? e.jsx("div", { className: "flex flex-wrap gap-2 shrink-0", children: d }) : null,
        ],
      }),
      e.jsx("div", { className: "px-4 sm:px-5 py-4 space-y-4", children: j }),
    ],
  });
}
function x({ title: r, description: c, children: d }) {
  return e.jsxs("div", {
    className: "space-y-3 pt-4 first:pt-0 border-t border-border/40 first:border-0",
    children: [
      e.jsxs("div", {
        className: "space-y-0.5",
        children: [
          e.jsx("h3", { className: "text-sm font-medium", children: r }),
          c
            ? e.jsx("p", {
                className: "text-xs text-muted-foreground leading-relaxed",
                children: c,
              })
            : null,
        ],
      }),
      d,
    ],
  });
}
function C({ text: r }) {
  const [c, d] = i.useState(!1),
    j = async () => {
      try {
        (await navigator.clipboard.writeText(r),
          d(!0),
          n.success("Copiado al portapapeles"),
          setTimeout(() => d(!1), 2e3));
      } catch {
        n.error("No se pudo copiar");
      }
    };
  return e.jsx(l, {
    variant: "ghost",
    size: "icon",
    className: "h-7 w-7 shrink-0",
    onClick: j,
    children: c ? e.jsx(vs, { className: "h-3.5 w-3.5" }) : e.jsx(fs, { className: "h-3.5 w-3.5" }),
  });
}
function Os() {
  const { id: r } = qe(),
    c = Ge(),
    [d, j] = Ke(),
    { data: s, isLoading: Ee, error: Ae, refetch: b } = Ns(r),
    { data: q } = ws(),
    { data: De = [] } = Je(),
    u = Cs(),
    h = ys(),
    A = _s(),
    v = Ss(),
    D = ks(),
    T = Ps(),
    { data: G = [], isLoading: Te, refetch: K } = Es(r),
    X = d.get("tab"),
    Me = Ls.includes(X) ? X : "configuracion",
    Ue = (a) => {
      j(
        (t) => {
          const P = new URLSearchParams(t);
          return (P.set("tab", a), P);
        },
        { replace: !0 },
      );
    },
    [p, M] = i.useState(!1),
    [J, U] = i.useState(""),
    [Q, I] = i.useState(""),
    [Y, L] = i.useState(!0),
    [Z, z] = i.useState(""),
    [ee, R] = i.useState({}),
    [y, se] = i.useState(null),
    [V, Ie] = i.useState("test-user"),
    [W, Le] = i.useState("Hola"),
    [$, ze] = i.useState(""),
    [B, Re] = i.useState("Mensaje de prueba desde Studio"),
    [ae, F] = i.useState(null);
  i.useEffect(() => {
    s &&
      (U(s.name ?? ""),
      I(s.assigned_agent ? String(s.assigned_agent) : ""),
      L(s.is_active ?? !0),
      z(s.welcome_message ?? ""),
      R(s.config_masked ?? {}),
      se(null));
  }, [s]);
  const _ = i.useMemo(
      () => q?.results.find((a) => a.channel_type === s?.channel_type),
      [q, s?.channel_type],
    ),
    S = i.useMemo(
      () =>
        !_ || !s ? [] : (_.config_fields_by_provider?.[s.provider ?? ""] ?? _.config_fields ?? []),
      [_, s],
    ),
    H = s?.channel_type === "web_socket" || s?.channel_type === "web_embed",
    Ve = !!s?.supports_inbound,
    We = s?.supports_outbound !== !1,
    $e = () => {
      if (!s) return;
      const a = {
        name: J.trim(),
        assigned_agent: Q || null,
        is_active: Y,
        welcome_message: Z,
        config: Ts(ee, S),
      };
      u.mutate(
        { id: s.id, data: a },
        {
          onSuccess: () => {
            (n.success("Canal guardado"), M(!1), b());
          },
          onError: (t) => n.error(t?.friendlyMessage || "No se pudo guardar"),
        },
      );
    },
    re = () => {
      s &&
        v.mutate(
          { id: s.id },
          {
            onSuccess: (a) => {
              const t = bs(a);
              (a.ok
                ? n.success(t.title, { description: t.description })
                : n.error(t.title, { description: t.description }),
                F(a),
                b());
            },
            onError: () => n.error("Error al probar conexión"),
          },
        );
    };
  if (Ee) return e.jsx(Qe, { variant: "studio" });
  if (Ae || !s)
    return e.jsxs("div", {
      className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4",
      children: [
        e.jsxs(l, {
          variant: "outline",
          size: "sm",
          onClick: () => c(-1),
          children: [e.jsx(ce, { className: "h-4 w-4 mr-1.5" }), " Volver"],
        }),
        e.jsx(Ye, {
          children: e.jsx(Ze, {
            className: "p-6 text-destructive",
            children:
              "Error al cargar el canal. Verifica que tengas permisos y que la API esté disponible.",
          }),
        }),
      ],
    });
  const ne = Pe(s.id),
    Be = Ms(s.id),
    te = Us(s.id),
    ie = Is(s.id),
    Fe = es(s.channel_type),
    le = ss(s.channel_type),
    k = as(s.branch),
    He = rs(s.branch),
    Oe = ns(s.branch),
    O = (a, t) => a?.friendlyMessage || t;
  return e.jsxs("div", {
    className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6",
    children: [
      e.jsxs("header", {
        className: "flex flex-wrap items-start gap-4",
        children: [
          e.jsx(l, {
            variant: "outline",
            size: "sm",
            asChild: !0,
            className: "mt-1",
            children: e.jsxs(Xe, {
              to: "/app/canales",
              children: [e.jsx(ce, { className: "h-4 w-4 mr-1.5" }), " Volver"],
            }),
          }),
          e.jsx("div", {
            className: Ce(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
              Fe.avatar,
            ),
            children: e.jsx(le, { className: "h-6 w-6", strokeWidth: 1.75 }),
          }),
          e.jsxs("div", {
            className: "flex-1 min-w-0 space-y-1",
            children: [
              e.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  e.jsx("h1", {
                    className: "text-2xl md:text-3xl font-semibold tracking-tight truncate",
                    children: s.name,
                  }),
                  e.jsx(E, {
                    variant: s.is_active ? "default" : "secondary",
                    className: "text-[10px]",
                    children: s.is_active ? "Activo" : "Inactivo",
                  }),
                  s.is_verified
                    ? e.jsx(E, {
                        className:
                          "text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                        children: "Verificado",
                      })
                    : e.jsx(E, {
                        variant: "outline",
                        className: "text-[10px]",
                        children: "Sin verificar",
                      }),
                ],
              }),
              e.jsxs("p", {
                className: "text-sm text-muted-foreground truncate",
                children: [
                  de(s.channel_type),
                  " · ",
                  s.provider ?? "Sin proveedor",
                  " ·",
                  " ",
                  s.assigned_agent_name ?? "Sin agente",
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex flex-wrap gap-2",
            children: [
              e.jsxs(l, {
                variant: "outline",
                size: "sm",
                onClick: re,
                disabled: v.isPending,
                children: [
                  v.isPending
                    ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                    : e.jsx(oe, { className: "h-4 w-4 mr-1.5" }),
                  "Probar",
                ],
              }),
              k &&
                s.is_active === !1 &&
                e.jsxs(l, {
                  variant: "outline",
                  size: "sm",
                  disabled: u.isPending,
                  onClick: () =>
                    u.mutate(
                      { id: s.id, data: { is_active: !0 } },
                      {
                        onSuccess: (a) => {
                          if (a?.is_active === !1) {
                            (n.error("El servidor no reactivó el canal. Intenta de nuevo."), b());
                            return;
                          }
                          (n.success("Canal reactivado"), b());
                        },
                        onError: (a) => n.error(O(a, "No se pudo reactivar el canal")),
                      },
                    ),
                  children: [
                    u.isPending
                      ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                      : e.jsx(ts, { className: "h-4 w-4 mr-1.5" }),
                    "Reactivar",
                  ],
                }),
              He &&
                s.is_active !== !1 &&
                e.jsxs(me, {
                  children: [
                    e.jsx(xe, {
                      asChild: !0,
                      children: e.jsxs(l, {
                        variant: "outline",
                        size: "sm",
                        className: "text-destructive hover:text-destructive",
                        disabled: h.isPending,
                        children: [
                          h.isPending
                            ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                            : e.jsx(ue, { className: "h-4 w-4 mr-1.5" }),
                          "Desactivar",
                        ],
                      }),
                    }),
                    e.jsxs(he, {
                      children: [
                        e.jsxs(pe, {
                          children: [
                            e.jsx(ge, { children: "Desactivar canal" }),
                            e.jsxs(je, {
                              children: [
                                "¿Desactivar «",
                                s.name,
                                "»? Dejará de recibir/enviar mensajes. Puedes reactivarlo después.",
                              ],
                            }),
                          ],
                        }),
                        e.jsxs(be, {
                          children: [
                            e.jsx(ve, { children: "Cancelar" }),
                            e.jsx(fe, {
                              className:
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                              onClick: () =>
                                h.mutate(
                                  { id: s.id, hard: !1 },
                                  {
                                    onSuccess: () => {
                                      (n.success("Canal desactivado"), c("/app/canales"));
                                    },
                                    onError: (a) => n.error(O(a, "No se pudo desactivar el canal")),
                                  },
                                ),
                              children: "Desactivar",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              Oe &&
                s.is_active === !1 &&
                e.jsxs(me, {
                  children: [
                    e.jsx(xe, {
                      asChild: !0,
                      children: e.jsxs(l, {
                        variant: "outline",
                        size: "sm",
                        className: "text-destructive hover:text-destructive",
                        disabled: h.isPending,
                        children: [
                          h.isPending
                            ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                            : e.jsx(ue, { className: "h-4 w-4 mr-1.5" }),
                          "Eliminar",
                        ],
                      }),
                    }),
                    e.jsxs(he, {
                      children: [
                        e.jsxs(pe, {
                          children: [
                            e.jsx(ge, { children: "Eliminar permanentemente" }),
                            e.jsxs(je, {
                              children: [
                                "¿Eliminar «",
                                s.name,
                                "» de forma permanente? No se puede deshacer.",
                              ],
                            }),
                          ],
                        }),
                        e.jsxs(be, {
                          children: [
                            e.jsx(ve, { children: "Cancelar" }),
                            e.jsx(fe, {
                              className:
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                              onClick: () =>
                                h.mutate(
                                  { id: s.id, hard: !0 },
                                  {
                                    onSuccess: () => {
                                      (n.success("Canal eliminado"), c("/app/canales"));
                                    },
                                    onError: (a) => n.error(O(a, "No se pudo eliminar el canal")),
                                  },
                                ),
                              children: "Eliminar",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      !k &&
        e.jsxs("p", {
          className:
            "text-xs text-muted-foreground rounded-xl border border-border/60 bg-muted/20 px-3 py-2",
          children: [
            "Vista de ",
            e.jsx("span", { className: "font-medium text-foreground", children: "solo lectura" }),
            ". Solo superadmin, organizador, owner o admin local pueden editar o desactivar canales.",
          ],
        }),
      e.jsxs(is, {
        value: Me,
        onValueChange: Ue,
        children: [
          e.jsxs(ls, {
            className: "w-full sm:w-auto justify-start flex-wrap h-auto",
            children: [
              e.jsx(f, { value: "configuracion", children: "Configuración" }),
              e.jsx(f, { value: "webhook", children: "Webhook" }),
              H && e.jsx(f, { value: "instalacion", children: "Instalación" }),
              e.jsx(f, { value: "probar", children: "Probar" }),
              e.jsx(f, { value: "sesiones", children: "Sesiones" }),
            ],
          }),
          e.jsx(N, {
            value: "configuracion",
            className: "mt-4",
            children: e.jsxs(w, {
              title: "Configuración",
              description: `Campos tipados del proveedor · ${de(s.channel_type)}`,
              actions: k
                ? p
                  ? e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(l, {
                          size: "sm",
                          variant: "outline",
                          onClick: () => {
                            (M(!1),
                              U(s.name ?? ""),
                              I(s.assigned_agent ? String(s.assigned_agent) : ""),
                              L(s.is_active ?? !0),
                              z(s.welcome_message ?? ""),
                              R(s.config_masked ?? {}));
                          },
                          children: "Cancelar",
                        }),
                        e.jsxs(l, {
                          size: "sm",
                          onClick: $e,
                          disabled: u.isPending,
                          children: [
                            u.isPending &&
                              e.jsx(o, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }),
                            "Guardar",
                          ],
                        }),
                      ],
                    })
                  : e.jsxs(l, {
                      size: "sm",
                      variant: "outline",
                      onClick: () => M(!0),
                      children: [e.jsx(us, { className: "h-3.5 w-3.5 mr-1.5" }), " Editar"],
                    })
                : void 0,
              children: [
                e.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(m, { children: "Nombre" }),
                        e.jsx(g, { value: J, onChange: (a) => U(a.target.value), disabled: !p }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(m, { children: "Agente asignado" }),
                        e.jsxs(cs, {
                          value: Q || "__none__",
                          onValueChange: (a) => I(a === "__none__" ? "" : a),
                          disabled: !p,
                          children: [
                            e.jsx(ds, {
                              children: e.jsx(os, { placeholder: "Selecciona un agente" }),
                            }),
                            e.jsxs(ms, {
                              children: [
                                e.jsx(Ne, { value: "__none__", children: "Ninguno" }),
                                De.map((a) =>
                                  e.jsx(Ne, { value: String(a.id), children: a.name }, a.id),
                                ),
                              ],
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
                    e.jsx(m, { children: "Mensaje de bienvenida" }),
                    e.jsx(g, { value: Z, onChange: (a) => z(a.target.value), disabled: !p }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-3",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx(m, { children: "Activo" }),
                        e.jsx("p", {
                          className: "text-xs text-muted-foreground",
                          children: "Puede recibir/enviar mensajes",
                        }),
                      ],
                    }),
                    e.jsx(xs, { checked: Y, onCheckedChange: L, disabled: !p }),
                  ],
                }),
                e.jsx(x, {
                  title: "Credenciales / configuración",
                  children: p
                    ? e.jsx(Ds, {
                        fields: S,
                        values: ee,
                        onChange: (a, t) => R((P) => ({ ...P, [a]: t })),
                      })
                    : e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-sm",
                        children: [
                          S.length === 0 &&
                            e.jsx("p", {
                              className: "text-muted-foreground col-span-full",
                              children: "Sin campos adicionales.",
                            }),
                          S.map((a) => {
                            const t = s.config_masked?.[a.key];
                            return e.jsxs(
                              "div",
                              {
                                className: "space-y-1",
                                children: [
                                  e.jsx("span", {
                                    className: "text-muted-foreground text-xs",
                                    children: a.label,
                                  }),
                                  e.jsx("div", {
                                    className:
                                      "rounded-lg border border-border/50 bg-muted/30 px-3 py-2 font-mono text-xs truncate",
                                    children: t == null || t === "" ? "—" : String(t),
                                  }),
                                ],
                              },
                              a.key,
                            );
                          }),
                        ],
                      }),
                }),
              ],
            }),
          }),
          e.jsx(N, {
            value: "webhook",
            className: "mt-4",
            children: e.jsxs(w, {
              title: "Webhook",
              description:
                "URL pública para mensajes entrantes. Configúrala en el proveedor externo.",
              children: [
                s.webhook_url
                  ? e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx("div", {
                          className: "text-xs text-muted-foreground",
                          children: "Webhook URL",
                        }),
                        e.jsxs("div", {
                          className:
                            "flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2",
                          children: [
                            e.jsx(le, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
                            e.jsx("span", {
                              className: "text-sm font-mono truncate flex-1",
                              children: s.webhook_url,
                            }),
                            e.jsx(C, { text: s.webhook_url }),
                          ],
                        }),
                      ],
                    })
                  : e.jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Sin webhook URL (se genera al guardar).",
                    }),
                e.jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    e.jsx("div", {
                      className: "text-xs text-muted-foreground",
                      children: "Webhook secret",
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("div", {
                          className:
                            "flex-1 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 font-mono text-sm truncate",
                          children: y || "•••••••• (solo se muestra al regenerar)",
                        }),
                        y && e.jsx(C, { text: y }),
                        e.jsxs(l, {
                          variant: "outline",
                          size: "sm",
                          disabled: !k || A.isPending,
                          onClick: () =>
                            A.mutate(s.id, {
                              onSuccess: (a) => {
                                (se(a.webhook_secret),
                                  n.success("Secret regenerado — cópialo ahora"),
                                  b());
                              },
                              onError: () => n.error("No se pudo regenerar"),
                            }),
                          children: [
                            A.isPending
                              ? e.jsx(o, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" })
                              : e.jsx(we, { className: "h-3.5 w-3.5 mr-1.5" }),
                            "Regenerar",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (s.channel_type === "whatsapp" ||
                  s.channel_type === "messenger" ||
                  s.channel_type === "instagram") &&
                  e.jsxs("div", {
                    className:
                      "rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm space-y-1",
                    children: [
                      e.jsx("p", {
                        className: "font-medium text-primary",
                        children: "Handshake Meta",
                      }),
                      e.jsxs("p", {
                        className: "text-muted-foreground text-xs leading-relaxed",
                        children: [
                          "En la consola de Meta usa esta URL de callback y el",
                          " ",
                          e.jsx("code", { className: "text-xs", children: "verify_token" }),
                          " que configuraste en Credenciales. Meta hará un GET con ",
                          e.jsx("code", { className: "text-xs", children: "hub.challenge" }),
                          ".",
                        ],
                      }),
                    ],
                  }),
                s.channel_type === "telegram" &&
                  e.jsxs("div", {
                    className:
                      "rounded-xl border border-border/60 p-3 text-sm text-muted-foreground",
                    children: [
                      "Telegram usa el header",
                      " ",
                      e.jsx("code", {
                        className: "text-xs",
                        children: "X-Telegram-Bot-Api-Secret-Token",
                      }),
                      " con el webhook secret. Configurá el webhook del bot apuntando a la URL de arriba.",
                    ],
                  }),
              ],
            }),
          }),
          H &&
            e.jsx(N, {
              value: "instalacion",
              className: "mt-4",
              children: e.jsxs(w, {
                title: "Instalar en tu web",
                description: "Burbuja flotante (recomendado) o iframe directo — tipo chat widget.",
                children: [
                  e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      e.jsx("div", {
                        className: "text-xs text-muted-foreground",
                        children: "URL pública",
                      }),
                      e.jsxs("div", {
                        className:
                          "flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2",
                        children: [
                          e.jsx("span", {
                            className: "text-sm font-mono truncate flex-1",
                            children: ne,
                          }),
                          e.jsx(C, { text: ne }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx(x, {
                    title: "Script flotante (recomendado)",
                    description: "Pegalo antes de </body>. Aparece una burbuja que abre el chat.",
                    children: e.jsxs("div", {
                      className: "relative rounded-lg border border-border/50 bg-muted/30 p-3",
                      children: [
                        e.jsx("pre", {
                          className: "text-xs font-mono whitespace-pre-wrap pr-8",
                          children: ie,
                        }),
                        e.jsx("div", {
                          className: "absolute top-2 right-2",
                          children: e.jsx(C, { text: ie }),
                        }),
                      ],
                    }),
                  }),
                  e.jsx(x, {
                    title: "Iframe directo",
                    children: e.jsxs("div", {
                      className: "relative rounded-lg border border-border/50 bg-muted/30 p-3",
                      children: [
                        e.jsx("pre", {
                          className: "text-xs font-mono whitespace-pre-wrap pr-8",
                          children: te,
                        }),
                        e.jsx("div", {
                          className: "absolute top-2 right-2",
                          children: e.jsx(C, { text: te }),
                        }),
                      ],
                    }),
                  }),
                  e.jsx(l, {
                    variant: "outline",
                    size: "sm",
                    asChild: !0,
                    children: e.jsxs("a", {
                      href: Be,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        e.jsx(hs, { className: "h-3.5 w-3.5 mr-1.5" }),
                        "Abrir a pantalla completa",
                      ],
                    }),
                  }),
                ],
              }),
            }),
          e.jsx(N, {
            value: "probar",
            className: "mt-4",
            children: e.jsxs(w, {
              title: "Probar canal",
              description: "Validá credenciales, simulá inbound o enviá un mensaje de prueba.",
              actions: e.jsxs(l, {
                size: "sm",
                onClick: re,
                disabled: v.isPending,
                children: [
                  v.isPending
                    ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                    : e.jsx(oe, { className: "h-4 w-4 mr-1.5" }),
                  "Probar conexión",
                ],
              }),
              children: [
                H &&
                  e.jsx(x, {
                    title: "Preview del chat",
                    description: "Widget embebido con el endpoint público.",
                    children: e.jsx("div", {
                      className:
                        "rounded-xl border border-border/50 overflow-hidden bg-background/50",
                      children: e.jsx(As, { channelId: String(s.id), compact: !0 }),
                    }),
                  }),
                Ve &&
                  e.jsxs(x, {
                    title: "Simular mensaje entrante",
                    description: "Dispara el router del agente sin pasar por el proveedor externo.",
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(m, { children: "Usuario externo" }),
                              e.jsx(g, { value: V, onChange: (a) => Ie(a.target.value) }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(m, { children: "Mensaje" }),
                              e.jsx(g, { value: W, onChange: (a) => Le(a.target.value) }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs(l, {
                        disabled: D.isPending || !V || !W,
                        onClick: () =>
                          D.mutate(
                            { id: s.id, external_user_id: V, message: W },
                            {
                              onSuccess: (a) => {
                                (n.success("Simulación OK"), F(a), K());
                              },
                              onError: () => n.error("Falló la simulación"),
                            },
                          ),
                        children: [
                          D.isPending
                            ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                            : e.jsx(ps, { className: "h-4 w-4 mr-1.5" }),
                          "Simular",
                        ],
                      }),
                    ],
                  }),
                We &&
                  e.jsxs(x, {
                    title: "Enviar mensaje de prueba",
                    description:
                      "Envía un mensaje real por el canal (WhatsApp, Telegram, email, etc.).",
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(m, { children: "Destinatario (external_user_id)" }),
                              e.jsx(g, {
                                value: $,
                                onChange: (a) => ze(a.target.value),
                                placeholder: "teléfono, chat_id, email…",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(m, { children: "Mensaje" }),
                              e.jsx(g, { value: B, onChange: (a) => Re(a.target.value) }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs(l, {
                        disabled: T.isPending || !$ || !B,
                        onClick: () =>
                          T.mutate(
                            { id: s.id, external_user_id: $, message: B },
                            {
                              onSuccess: (a) => {
                                (n.success("Mensaje enviado"), F(a));
                              },
                              onError: () => n.error("No se pudo enviar"),
                            },
                          ),
                        children: [
                          T.isPending
                            ? e.jsx(o, { className: "h-4 w-4 mr-1.5 animate-spin" })
                            : e.jsx(gs, { className: "h-4 w-4 mr-1.5" }),
                          "Enviar",
                        ],
                      }),
                    ],
                  }),
                ae != null &&
                  e.jsx(x, {
                    title: "Último resultado",
                    children: e.jsx("pre", {
                      className:
                        "text-xs font-mono whitespace-pre-wrap bg-muted/40 rounded-lg border border-border/40 p-3 max-h-80 overflow-auto",
                      children: JSON.stringify(ae, null, 2),
                    }),
                  }),
              ],
            }),
          }),
          e.jsx(N, {
            value: "sesiones",
            className: "mt-4",
            children: e.jsx(w, {
              title: "Sesiones",
              description: "Conversaciones activas en este canal.",
              actions: e.jsxs(l, {
                size: "sm",
                variant: "outline",
                onClick: () => K(),
                children: [e.jsx(we, { className: "h-3.5 w-3.5 mr-1.5" }), " Actualizar"],
              }),
              children: Te
                ? e.jsx(js, { lines: 4 })
                : G.length === 0
                  ? e.jsx("p", {
                      className: "text-sm text-muted-foreground py-6 text-center",
                      children: "Aún no hay sesiones. Usa «Simular» o el widget para generar una.",
                    })
                  : e.jsx("div", {
                      className: "overflow-x-auto -mx-1",
                      children: e.jsxs("table", {
                        className: "w-full text-sm",
                        children: [
                          e.jsx("thead", {
                            children: e.jsxs("tr", {
                              className:
                                "border-b border-border/60 text-left text-muted-foreground",
                              children: [
                                e.jsx("th", {
                                  className: "py-2 pr-3 font-medium",
                                  children: "Usuario",
                                }),
                                e.jsx("th", {
                                  className: "py-2 pr-3 font-medium",
                                  children: "Estado",
                                }),
                                e.jsx("th", {
                                  className: "py-2 pr-3 font-medium",
                                  children: "Msgs",
                                }),
                                e.jsx("th", { className: "py-2 font-medium", children: "Último" }),
                              ],
                            }),
                          }),
                          e.jsx("tbody", {
                            children: G.map((a) =>
                              e.jsxs(
                                "tr",
                                {
                                  className: "border-b border-border/40",
                                  children: [
                                    e.jsxs("td", {
                                      className: "py-2.5 pr-3",
                                      children: [
                                        e.jsx("div", {
                                          className: "font-medium",
                                          children: a.external_user_name || a.external_user_id,
                                        }),
                                        a.external_user_name
                                          ? e.jsx("div", {
                                              className: "text-xs text-muted-foreground font-mono",
                                              children: a.external_user_id,
                                            })
                                          : null,
                                      ],
                                    }),
                                    e.jsx("td", {
                                      className: "py-2.5 pr-3",
                                      children: e.jsx(E, {
                                        variant: "outline",
                                        className: "text-[10px]",
                                        children: a.status,
                                      }),
                                    }),
                                    e.jsx("td", {
                                      className: "py-2.5 pr-3 tabular-nums",
                                      children: a.message_count ?? 0,
                                    }),
                                    e.jsx("td", {
                                      className: "py-2.5 text-muted-foreground text-xs",
                                      children: a.last_message_at
                                        ? new Date(a.last_message_at).toLocaleString()
                                        : "—",
                                    }),
                                  ],
                                },
                                a.id,
                              ),
                            ),
                          }),
                        ],
                      }),
                    }),
            }),
          }),
        ],
      }),
    ],
  });
}
export { Os as default };
