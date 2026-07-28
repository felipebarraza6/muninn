import { r as l, j as e, aw as de, af as ce, ah as me } from "./vendor-react-DUYfdZnL.js";
import {
  ag as xe,
  R as le,
  B as g,
  F as ue,
  cr as pe,
  f6 as he,
  et as ie,
  fF as ge,
  a6 as fe,
  ai as je,
  a5 as G,
  d4 as se,
  K as E,
  U as k,
  V as R,
  W as Y,
  X as Q,
  Y as $,
  Z as W,
  $ as X,
  aj as be,
  bx as Ne,
  a7 as h,
  P as ve,
  E as ye,
  fG as _e,
  fd as we,
  fn as Ce,
  fH as Ee,
  fI as Se,
  fJ as Pe,
  A as H,
  b as Ae,
  I as Te,
  M as ae,
  fA as ke,
  ak as Oe,
  d5 as De,
  a9 as Ie,
  fK as Re,
  fL as Fe,
  a0 as Me,
  T as ze,
  N as Le,
  O as J,
  dc as Ve,
  fM as Je,
  eU as Ue,
  bN as Ge,
  Q as U,
  fN as te,
  fO as Ke,
  fP as qe,
  fQ as Be,
  dl as ne,
  fR as Ye,
  fE as Qe,
} from "./studio-chat-BBQUCckT.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const re = [
    { value: "0 * * * *", label: "Cada 1 hora" },
    { value: "0 */6 * * *", label: "Cada 6 horas" },
    { value: "0 */12 * * *", label: "Cada 12 horas" },
    { value: "0 0 * * *", label: "Cada 24 horas" },
    { value: "custom", label: "Personalizado" },
  ],
  $e = [
    { value: "append", label: "Incremental" },
    { value: "replace", label: "Reemplazar" },
  ],
  Z = [
    { id: 1, icon: pe, label: "Endpoint", desc: "API y endpoint" },
    { id: 2, icon: he, label: "Variables", desc: "Asignar valores" },
    { id: 3, icon: ie, label: "Contenido", desc: "Campos disponibles" },
    { id: 4, icon: ge, label: "Integrar", desc: "Estrategia + template" },
    { id: 5, icon: fe, label: "Test", desc: "Probar y ver logs" },
  ],
  oe = [
    { value: "", label: "Valor fijo", desc: "Escribes el valor manualmente" },
    { value: "{{today}}", label: "Fecha del cron", desc: "Se asigna la fecha de ejecución" },
    { value: "{{now}}", label: "Fecha y hora", desc: "Se asigna fecha+hora de ejecución" },
    { value: "{{yesterday}}", label: "Día anterior", desc: "Se asigna el día anterior" },
  ];
function We(a) {
  if (!a) return [];
  const u = new Set(),
    t = /\{\{(\w+)\}\}/g,
    O = (d) => {
      if (typeof d == "string") {
        let f;
        for (; (f = t.exec(d)) !== null; ) u.add(f[1]);
      } else if (typeof d == "object" && d !== null) for (const f of Object.values(d)) O(f);
    };
  return (O(a), Array.from(u).sort());
}
const Xe = {
  DATA: "json_to_table",
  FAQ: "raw_string",
  DOCUMENT: "raw_string",
  POLICY: "raw_string",
  PROCEDURE: "raw_string",
  API_DOC: "json_path",
  CODE: "raw_string",
  CUSTOM: "raw_string",
};
function He({ value: a, onChange: u, disabled: t = !1, branch: O, knowledgeType: d = "DOCUMENT" }) {
  const f = a != null,
    [i, S] = l.useState(1),
    [j, y] = l.useState(!1),
    [b, _] = l.useState(null),
    { data: D = [], isLoading: I } = xe({ branch: O }),
    c = l.useMemo(
      () => D.find((s) => String(s.id) === String(a?.external_api_id)),
      [D, a?.external_api_id],
    ),
    L = l.useMemo(() => Object.keys(c?.endpoints ?? {}), [c]),
    V = f && !re.some((s) => s.value === a.cron),
    x = l.useMemo(() => (c?.endpoints ?? {})[a?.endpoint ?? ""], [c, a?.endpoint]),
    p = l.useMemo(() => We(x), [x]),
    w = l.useMemo(() => x?.response_mapping, [x]),
    C = l.useMemo(() => {
      const s = c?.endpoints_response_mapping ?? {};
      return a?.endpoint ? s[a.endpoint] : void 0;
    }, [c, a?.endpoint]);
  l.useEffect(() => {
    if (!a?.endpoint || !x) return;
    const s = a.payload_variables || {},
      n = p.some((v) => !(v in s)),
      r = n ? { ...s } : void 0;
    if (n) for (const v of p) v in r || (r[v] = "");
    const o = w || C;
    let m;
    if (o && typeof o == "object") {
      const v = Object.entries(o);
      if (v.length > 0 && !a.content_mapping.path) {
        const z = v[0][1];
        if (typeof z == "string" && z.includes(".")) {
          const ee = z.split(".").slice(0, -1).join(".");
          ee && (m = { path: ee });
        } else typeof z == "string" && (m = { path: z });
      }
    }
    (r || m) &&
      u({
        ...a,
        ...(r ? { payload_variables: r } : {}),
        ...(m ? { content_mapping: { ...a.content_mapping, ...m } } : {}),
      });
  }, [a?.endpoint]);
  const N = (s) => {
      a && u({ ...a, ...s });
    },
    P = (s) => {
      a &&
        u({
          ...a,
          integration_strategy: { ...(a.integration_strategy || { mode: "replace" }), ...s },
        });
    },
    F = (s) => {
      a && u({ ...a, payload_variables: s });
    };
  a?.content_mapping.type;
  const A = a?.integration_strategy?.mode ?? "replace";
  a?.content_mapping.columns;
  const T = a?.external_api_id && a?.endpoint,
    M = async () => {
      if (!a || !T) {
        h.error("Completa los pasos 1-4 primero");
        return;
      }
      (y(!0), _(null));
      try {
        const s = a._id || "current",
          n = await ve(ye.knowledge.refresh(s), {});
        _(n);
        const r = n?.success ?? !1;
        h.success(r ? "CronJob ejecutado correctamente" : "El test reporto errores");
      } catch (s) {
        (_({ success: !1, error: String(s) }), h.error("Error al ejecutar test"));
      } finally {
        y(!1);
      }
    };
  if (!f)
    return e.jsxs("div", {
      className:
        "flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8",
      children: [
        e.jsx("div", {
          className: "rounded-full bg-muted p-3",
          children: e.jsx(le, { className: "h-8 w-8 text-muted-foreground" }),
        }),
        e.jsxs("div", {
          className: "text-center max-w-sm space-y-1",
          children: [
            e.jsx("h3", { className: "text-sm font-medium", children: "Sin CronJob" }),
            e.jsx("p", {
              className: "text-xs text-muted-foreground",
              children:
                "Un CronJob actualiza este conocimiento automaticamente consultando un endpoint externo.",
            }),
          ],
        }),
        e.jsxs(g, {
          onClick: () =>
            u({
              external_api_id: "",
              endpoint: "",
              cron: "0 */6 * * *",
              content_mapping: { type: Xe[d] || "raw_string", path: "", columns: [] },
            }),
          children: [e.jsx(ue, { className: "h-4 w-4 mr-1.5" }), " Configurar CronJob"],
        }),
      ],
    });
  const K = () =>
      e.jsx("div", {
        className: "flex items-center justify-between gap-0 px-1 sm:px-2",
        children: Z.map((s, n) =>
          e.jsxs(
            "div",
            {
              className: "flex items-center gap-0 flex-1 min-w-0",
              children: [
                e.jsxs("button", {
                  type: "button",
                  onClick: () => {
                    s.id <= i + 1 && S(s.id);
                  },
                  className: [
                    "flex items-center gap-1.5 sm:gap-2 py-2 px-1.5 sm:px-3 rounded-lg transition-all duration-150",
                    "text-left min-w-0 w-full",
                    i === s.id ? "bg-primary/10 text-primary shadow-sm" : "",
                    i > s.id ? "text-emerald-600 hover:bg-muted/50" : "",
                    i < s.id ? "text-muted-foreground/40 cursor-not-allowed" : "hover:bg-muted/30",
                  ].join(" "),
                  children: [
                    e.jsx("div", {
                      className: [
                        "flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                        i === s.id ? "bg-primary text-primary-foreground" : "",
                        i > s.id ? "bg-emerald-500 text-white" : "",
                        i < s.id ? "bg-muted text-muted-foreground/40" : "",
                      ].join(" "),
                      children:
                        i > s.id ? e.jsx(je, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }) : s.id,
                    }),
                    e.jsxs("div", {
                      className: "min-w-0 hidden sm:block",
                      children: [
                        e.jsx("p", {
                          className: ["text-xs font-medium leading-tight", (i < s.id, "")].join(
                            " ",
                          ),
                          children: s.label,
                        }),
                        e.jsx("p", {
                          className: "text-[10px] text-muted-foreground leading-tight truncate",
                          children: s.desc,
                        }),
                      ],
                    }),
                  ],
                }),
                n < Z.length - 1 &&
                  e.jsx("div", {
                    className: [
                      "h-px flex-1 mx-1 hidden sm:block",
                      i > s.id ? "bg-emerald-300" : "bg-border",
                    ].join(" "),
                  }),
              ],
            },
            s.id,
          ),
        ),
      }),
    q = () =>
      e.jsxs("div", {
        className: "flex items-center justify-between pt-4 border-t",
        children: [
          e.jsxs(g, {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: i <= 1,
            onClick: () => S((s) => s - 1),
            children: [e.jsx(be, { className: "h-4 w-4 mr-1" }), " Anterior"],
          }),
          e.jsx("div", {
            className: "flex items-center gap-2",
            children:
              i < Z.length
                ? e.jsxs(g, {
                    type: "button",
                    size: "sm",
                    onClick: () => S((s) => s + 1),
                    children: ["Siguiente ", e.jsx(Ne, { className: "h-4 w-4 ml-1" })],
                  })
                : e.jsxs(g, {
                    type: "button",
                    size: "sm",
                    disabled: j || !T,
                    onClick: M,
                    children: [
                      j
                        ? e.jsx(G, { className: "h-4 w-4 mr-1.5 animate-spin" })
                        : e.jsx(se, { className: "h-4 w-4 mr-1.5" }),
                      "Ejecutar test",
                    ],
                  }),
          }),
        ],
      }),
    B = () => {
      switch (i) {
        case 1:
          return e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium mb-1",
                    children: "Selecciona API y endpoint",
                  }),
                  e.jsx("p", {
                    className: "text-xs text-muted-foreground mb-4",
                    children:
                      "El CronJob consultara este endpoint periodicamente para obtener datos actualizados.",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "grid gap-4 sm:grid-cols-2",
                children: [
                  e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      e.jsx(k, { className: "text-xs", children: "External API" }),
                      e.jsxs(Y, {
                        value: a.external_api_id || void 0,
                        onValueChange: (s) => N({ external_api_id: s, endpoint: "" }),
                        disabled: t || I,
                        children: [
                          e.jsx(Q, {
                            className: "h-9",
                            children: e.jsx($, {
                              placeholder: I ? "Cargando..." : "Selecciona API",
                            }),
                          }),
                          e.jsx(W, {
                            children: D.map((s) =>
                              e.jsx(X, { value: String(s.id), children: s.name }, s.id),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      e.jsx(k, { className: "text-xs", children: "Endpoint" }),
                      e.jsxs(Y, {
                        value: a.endpoint || void 0,
                        onValueChange: (s) => N({ endpoint: s }),
                        disabled: t || !c,
                        children: [
                          e.jsx(Q, {
                            className: "h-9",
                            children: e.jsx($, {
                              placeholder: c ? "Selecciona" : "Elige API primero",
                            }),
                          }),
                          e.jsx(W, {
                            children: L.map((s) => {
                              const n = c?.endpoints?.[s];
                              return e.jsxs(
                                X,
                                {
                                  value: s,
                                  children: [
                                    s,
                                    n?.method || n?.path
                                      ? e.jsx("span", {
                                          className: "ml-1.5 text-muted-foreground",
                                          children: [n?.method, n?.path].filter(Boolean).join(" "),
                                        })
                                      : null,
                                  ],
                                },
                                s,
                              );
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              c &&
                a?.endpoint &&
                x &&
                e.jsxs("div", {
                  className: "rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5",
                  children: [
                    e.jsx("p", {
                      className:
                        "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      children: "Vista previa",
                    }),
                    e.jsxs("div", {
                      className: "flex items-center gap-2 text-sm",
                      children: [
                        e.jsx("code", {
                          className: "rounded bg-muted px-2 py-0.5 text-xs font-mono",
                          children: x?.method ?? "GET",
                        }),
                        e.jsx("code", {
                          className: "text-xs font-mono text-foreground",
                          children: x?.path ?? "—",
                        }),
                      ],
                    }),
                    p.length > 0 &&
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-1",
                        children: [
                          e.jsx("span", {
                            className: "text-[10px] text-muted-foreground",
                            children: "Placeholders:",
                          }),
                          p.map((s) =>
                            e.jsx(
                              "code",
                              {
                                className: "text-[10px] bg-muted px-1 rounded",
                                children: `{{${s}}}`,
                              },
                              s,
                            ),
                          ),
                        ],
                      }),
                    e.jsxs("div", {
                      className: "flex flex-wrap gap-1",
                      children: [
                        e.jsx("span", {
                          className: "text-[10px] text-muted-foreground",
                          children: "Responde con:",
                        }),
                        w || C
                          ? Object.keys(w || C || {}).map((s) =>
                              e.jsx(
                                "code",
                                { className: "text-[10px] bg-muted px-1 rounded", children: s },
                                s,
                              ),
                            )
                          : a?.content_mapping?.custom_fields
                            ? (a?.content_mapping?.custom_fields)
                                .split(",")
                                .map((s) =>
                                  e.jsx(
                                    "code",
                                    {
                                      className: "text-[10px] bg-muted px-1 rounded",
                                      children: s.trim(),
                                    },
                                    s.trim(),
                                  ),
                                )
                            : e.jsx("span", {
                                className: "text-[10px] text-muted-foreground italic",
                                children: "No definido — definelo en el paso 3",
                              }),
                      ],
                    }),
                  ],
                }),
            ],
          });
        case 2:
          return e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium mb-1",
                    children: "Asignar variables",
                  }),
                  e.jsx("p", {
                    className: "text-xs text-muted-foreground mb-4",
                    children:
                      p.length > 0
                        ? `El endpoint necesita ${p.length} valor(es). Click en cada uno para elegir cómo se asigna:`
                        : "Este endpoint no necesita variables. Puedes continuar.",
                  }),
                ],
              }),
              p.length === 0
                ? e.jsx("div", {
                    className: "rounded-lg border border-dashed p-6 text-center",
                    children: e.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "No se detectaron placeholders.",
                    }),
                  })
                : e.jsx("div", {
                    className: "space-y-2 max-w-lg",
                    children: p.map((s) => {
                      const n = a?.payload_variables?.[s] ?? "",
                        r = oe.find((o) => o.value === n && o.value !== "");
                      return e.jsxs(
                        "div",
                        {
                          className: "flex flex-col gap-1.5 rounded-lg border p-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("code", {
                                  className: "text-xs font-mono font-semibold",
                                  children: `{{${s}}}`,
                                }),
                                e.jsx("span", {
                                  className: "text-[10px] text-muted-foreground",
                                  children: "=",
                                }),
                                e.jsx("div", {
                                  className: "flex gap-1 flex-wrap",
                                  children: oe.map((o) =>
                                    e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: t,
                                        onClick: () => {
                                          const m = { ...a?.payload_variables };
                                          ((m[s] = o.value), F(m));
                                        },
                                        className: [
                                          "px-2 py-1 rounded text-[10px] font-medium transition-all",
                                          n === o.value && o.value !== ""
                                            ? "bg-primary/10 text-primary border border-primary/30"
                                            : n === o.value
                                              ? "bg-muted text-foreground border border-border"
                                              : "bg-muted/50 text-muted-foreground border border-transparent hover:border-border",
                                        ].join(" "),
                                        children: o.label,
                                      },
                                      o.value,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                            (!r || n === "") &&
                              e.jsx(R, {
                                value: n,
                                onChange: (o) => {
                                  const m = { ...a?.payload_variables };
                                  ((m[s] = o.target.value), F(m));
                                },
                                placeholder: "Escribe el valor...",
                                disabled: t,
                                className: "h-8 font-mono text-xs",
                              }),
                            r &&
                              e.jsxs("p", {
                                className: "text-[10px] text-muted-foreground",
                                children: [
                                  "Se asignará automáticamente:",
                                  " ",
                                  e.jsx("code", {
                                    className: "text-[10px] bg-muted px-1 rounded",
                                    children: r.value,
                                  }),
                                ],
                              }),
                          ],
                        },
                        s,
                      );
                    }),
                  }),
            ],
          });
        case 3:
          return e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium mb-1",
                    children: "Contenido disponible",
                  }),
                  e.jsxs("p", {
                    className: "text-xs text-muted-foreground mb-4",
                    children: [
                      "El endpoint ",
                      e.jsx("strong", { children: a?.endpoint }),
                      " devuelve estos campos.",
                      " ",
                      d === "DATA"
                        ? "Se guardaran como columnas en tu tabla de datos."
                        : "Estan disponibles como variables para usar en tu contenido.",
                    ],
                  }),
                ],
              }),
              w || C
                ? e.jsxs("div", {
                    className: "rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3",
                    children: [
                      e.jsx("p", {
                        className: "text-xs font-medium text-primary",
                        children: "Campos de la respuesta",
                      }),
                      e.jsx("div", {
                        className: "flex flex-wrap gap-2",
                        children: Object.entries(w || C || {}).map(([s, n]) =>
                          e.jsxs(
                            E,
                            {
                              variant: "outline",
                              className: "text-[10px] font-mono gap-1.5 px-2.5 py-1",
                              children: [
                                s,
                                e.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "→",
                                }),
                                e.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: String(n),
                                }),
                              ],
                            },
                            s,
                          ),
                        ),
                      }),
                      d === "DATA"
                        ? e.jsx("p", {
                            className: "text-[11px] text-muted-foreground",
                            children:
                              "Estos campos seran las columnas de tu tabla. Se auto-detectan en cada ejecucion.",
                          })
                        : e.jsxs("p", {
                            className: "text-[11px] text-muted-foreground",
                            children: [
                              "Puedes usar",
                              " ",
                              e.jsx("code", {
                                className: "text-[10px] bg-muted px-1 rounded",
                                children: "{{data_table}}",
                              }),
                              " en tu template para insertar estos datos, o",
                              " ",
                              e.jsx("code", {
                                className: "text-[10px] bg-muted px-1 rounded",
                                children: "{{raw_json}}",
                              }),
                              " para el JSON completo.",
                            ],
                          }),
                    ],
                  })
                : e.jsxs("div", {
                    className: "rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3",
                    children: [
                      e.jsx("p", {
                        className: "text-xs font-medium text-amber-600",
                        children: "Campos de respuesta no definidos",
                      }),
                      e.jsx("p", {
                        className: "text-[11px] text-muted-foreground",
                        children:
                          "Para usar los datos en tu documento, define qué campos devuelve el endpoint. Separalos con coma:",
                      }),
                      e.jsx(R, {
                        value: a?.content_mapping?.custom_fields ?? "",
                        onChange: (s) => {
                          a &&
                            u({
                              ...a,
                              content_mapping: {
                                ...a.content_mapping,
                                custom_fields: s.target.value,
                              },
                            });
                        },
                        placeholder: "Ej: readings, total, status",
                        disabled: t,
                        className: "h-8 font-mono text-xs max-w-md",
                      }),
                      e.jsx("p", {
                        className: "text-[11px] text-muted-foreground",
                        children: "Estos campos los podras usar como variables en tu contenido.",
                      }),
                    ],
                  }),
              e.jsx("div", {
                className: "rounded-lg bg-muted/30 p-3 border",
                children: e.jsxs("p", {
                  className: "text-[11px] text-muted-foreground",
                  children: [
                    e.jsx("strong", { children: "Formato:" }),
                    " ",
                    d === "DATA" ? "Tabla de datos" : "Documento de texto",
                    a.content_mapping.path
                      ? e.jsxs(e.Fragment, {
                          children: [
                            " · ",
                            e.jsx("strong", { children: "Ruta:" }),
                            " ",
                            a.content_mapping.path,
                          ],
                        })
                      : null,
                  ],
                }),
              }),
            ],
          });
        case 4:
          return e.jsxs("div", {
            className: "space-y-5",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium mb-1",
                    children: "Estrategia y template",
                  }),
                  e.jsx("p", {
                    className: "text-xs text-muted-foreground mb-4",
                    children:
                      "Como se combina el nuevo contenido con el existente y cada cuanto se ejecuta.",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-1.5 max-w-xs",
                children: [
                  e.jsx(k, { className: "text-xs", children: "Frecuencia (cron)" }),
                  V
                    ? e.jsx(R, {
                        value: a.cron,
                        onChange: (s) => N({ cron: s.target.value }),
                        placeholder: "0 */6 * * *",
                        disabled: t,
                        className: "h-9 font-mono text-xs",
                      })
                    : e.jsxs(Y, {
                        value: a.cron,
                        onValueChange: (s) => {
                          N(s === "custom" ? { cron: "*/15 * * * *" } : { cron: s });
                        },
                        disabled: t,
                        children: [
                          e.jsx(Q, { className: "h-9", children: e.jsx($, {}) }),
                          e.jsx(W, {
                            children: re.map((s) =>
                              e.jsx(X, { value: s.value, children: s.label }, s.value),
                            ),
                          }),
                        ],
                      }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(k, { className: "text-xs", children: "Estrategia de integracion" }),
                  e.jsx("div", {
                    className: "grid gap-2 sm:grid-cols-2",
                    children: $e.map((s) =>
                      e.jsxs(
                        "label",
                        {
                          className: [
                            "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                            A === s.value
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/60 hover:border-border",
                          ].join(" "),
                          children: [
                            e.jsx("input", {
                              type: "radio",
                              name: "strategy",
                              value: s.value,
                              checked: A === s.value,
                              onChange: () => P({ mode: s.value }),
                              className: "mt-0.5",
                              disabled: t,
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("span", {
                                  className: "text-xs font-medium",
                                  children: s.label,
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children:
                                    s.value === "append"
                                      ? d === "DATA"
                                        ? "Agrega nuevas filas a la tabla."
                                        : "Agrega el nuevo contenido al final del existente."
                                      : d === "DATA"
                                        ? "Reemplaza todas las filas de la tabla."
                                        : "Sobrescribe todo el contenido.",
                                }),
                              ],
                            }),
                          ],
                        },
                        s.value,
                      ),
                    ),
                  }),
                ],
              }),
              A === "append" &&
                e.jsxs("div", {
                  className: "grid gap-3 sm:grid-cols-2 max-w-md",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx(k, { className: "text-xs", children: "Separador" }),
                        e.jsx(R, {
                          value:
                            a?.integration_strategy?.separator ??
                            `
---
`,
                          onChange: (s) => P({ separator: s.target.value }),
                          disabled: t,
                          className: "h-8 font-mono text-xs",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx(k, { className: "text-xs", children: "Max. entradas" }),
                        e.jsx(R, {
                          value: a?.integration_strategy?.max_history ?? "",
                          onChange: (s) =>
                            P({ max_history: s.target.value ? Number(s.target.value) : void 0 }),
                          placeholder: "Sin limite",
                          disabled: t,
                          type: "number",
                          min: 1,
                          className: "h-8 font-mono text-xs",
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          });
        case 5:
          return e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h3", {
                    className: "text-sm font-medium mb-1",
                    children: "Probar el CronJob",
                  }),
                  e.jsx("p", {
                    className: "text-xs text-muted-foreground mb-4",
                    children:
                      "Ejecuta el pipeline ahora mismo para ver el resultado. Asegurate de haber guardado antes.",
                  }),
                ],
              }),
              T
                ? e.jsxs(e.Fragment, {
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                          e.jsxs(g, {
                            size: "sm",
                            disabled: j,
                            onClick: M,
                            children: [
                              j
                                ? e.jsx(G, { className: "h-4 w-4 mr-1.5 animate-spin" })
                                : e.jsx(se, { className: "h-4 w-4 mr-1.5" }),
                              "Ejecutar ahora",
                            ],
                          }),
                          e.jsx(g, {
                            size: "sm",
                            variant: "outline",
                            disabled: !b,
                            onClick: () => _(null),
                            children: "Limpiar",
                          }),
                        ],
                      }),
                      j &&
                        e.jsxs("div", {
                          className:
                            "flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4",
                          children: [
                            e.jsx(G, { className: "h-4 w-4 animate-spin text-primary" }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("p", {
                                  className: "text-xs font-medium",
                                  children: "Ejecutando...",
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children: "Consultando endpoint y procesando respuesta",
                                }),
                              ],
                            }),
                          ],
                        }),
                      b &&
                        !j &&
                        e.jsxs("div", {
                          className: "rounded-lg border overflow-hidden",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2 px-3 py-2 bg-muted/50 border-b",
                              children: [
                                e.jsx(ie, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                                e.jsx("span", {
                                  className: "text-xs font-medium",
                                  children: "Resultado",
                                }),
                                b?.success
                                  ? e.jsx(E, {
                                      variant: "outline",
                                      className:
                                        "ml-auto text-[10px] text-emerald-600 border-emerald-500/30",
                                      children: "OK",
                                    })
                                  : e.jsx(E, {
                                      variant: "outline",
                                      className:
                                        "ml-auto text-[10px] text-red-600 border-red-500/30",
                                      children: "Error",
                                    }),
                              ],
                            }),
                            e.jsx("pre", {
                              className:
                                "p-3 text-[11px] font-mono overflow-x-auto max-h-[300px] overflow-y-auto bg-card/30",
                              children: JSON.stringify(b, null, 2),
                            }),
                          ],
                        }),
                      !b &&
                        !j &&
                        e.jsx("div", {
                          className:
                            "rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground",
                          children: 'Presiona "Ejecutar ahora" para probar el pipeline completo.',
                        }),
                    ],
                  })
                : e.jsx("div", {
                    className: "rounded-lg border border-dashed p-6 text-center",
                    children: e.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Completa los pasos 1-4 primero.",
                    }),
                  }),
            ],
          });
        default:
          return null;
      }
    };
  return e.jsxs("div", {
    className: "flex flex-col gap-4 min-h-[60vh]",
    children: [
      e.jsx("div", { className: "rounded-xl border bg-card/60 p-3", children: K() }),
      e.jsx("div", { className: "flex-1 rounded-xl border bg-card/60 p-5", children: B() }),
      e.jsx("div", { className: "rounded-xl border bg-card/60 px-5 py-3", children: q() }),
    ],
  });
}
function rs() {
  const { id: a } = de(),
    u = ce(),
    { data: t, isLoading: O, error: d, refetch: f } = _e(a, { branch: void 0 }),
    i = we(),
    [S, j] = l.useState("documento"),
    [y, b] = l.useState(!1),
    [_, D] = l.useState(""),
    [I, c] = l.useState(""),
    [L, V] = l.useState([{ question: "", answer: "" }]),
    [x, p] = l.useState([]),
    [w, C] = l.useState([]),
    N = t?.knowledge_type ?? "DOCUMENT",
    P = N === "DATA",
    F = N === "FAQ",
    A = i.isPending,
    T = t ? Ce(t) : !1,
    M = l.useCallback((s) => {
      const n = s.knowledge_type ?? "DOCUMENT";
      if ((D(s.title || ""), c(s.content || ""), n === "FAQ" && V(Ee(s.content)), n === "DATA")) {
        const r = Se(Pe(s.content));
        (p(r.columns.length ? r.columns : ["columna_1"]),
          C(r.rows.length ? r.rows : [{ columna_1: "" }]));
      }
    }, []);
  l.useEffect(() => {
    t && y && M(t);
  }, [t]);
  const K = () => {
      t && (M(t), b(!0));
    },
    q = () => {
      if (F) {
        const s = Qe(L);
        return s.trim() ? s : (h.error("Agrega al menos una pregunta y respuesta"), null);
      }
      if (P) {
        const s = w.filter((n) => x.some((r) => (n[r] ?? "").trim()));
        return s.length === 0
          ? (h.error("La tabla no tiene filas con datos"), null)
          : JSON.stringify(
              s.map((n) => {
                const r = {};
                for (const o of x) r[o] = n[o] ?? "";
                return r;
              }),
            );
      }
      return I.trim() ? I : (h.error("El contenido es obligatorio"), null);
    },
    B = () => {
      if (!t) return;
      if (!_.trim()) {
        h.error("El título es obligatorio");
        return;
      }
      const s = q();
      s != null &&
        i.mutate(
          { id: String(t.id), data: { title: _.trim(), content: s }, branch: t.branch },
          {
            onSuccess: () => {
              (h.success(
                T
                  ? "Guardado. Reindexa desde el agente para actualizar los vectores."
                  : "Guardado. Se indexará al asignarlo a un agente.",
              ),
                b(!1),
                f());
            },
            onError: (n) => h.error(ne(n, "No se pudo guardar")),
          },
        );
    };
  return O
    ? e.jsx(H, {
        className: "px-4 md:px-6 lg:px-8 py-4",
        children: e.jsx(Ae, { variant: "detail", padded: !1 }),
      })
    : d || !t
      ? e.jsx(H, {
          className: "px-4 md:px-6 lg:px-8 py-4",
          children: e.jsx(Te, {
            title: "No se pudo cargar el conocimiento",
            description: "Puede haberse eliminado o no tienes acceso desde esta sucursal.",
            action: e.jsxs(g, {
              size: "sm",
              variant: "outline",
              onClick: () => u("/app/conocimiento"),
              children: [e.jsx(ae, { className: "h-4 w-4 mr-1.5" }), " Volver al catálogo"],
            }),
          }),
        })
      : e.jsxs(H, {
          className: "flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-4",
          children: [
            e.jsxs("div", {
              className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
              children: [
                e.jsxs("div", {
                  className: "min-w-0 space-y-1.5",
                  children: [
                    e.jsx(g, {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 -ml-2 text-muted-foreground",
                      asChild: !0,
                      children: e.jsxs(me, {
                        to: "/app/conocimiento",
                        children: [e.jsx(ae, { className: "h-3.5 w-3.5 mr-1" }), " Conocimiento"],
                      }),
                    }),
                    y
                      ? e.jsx(R, {
                          value: _,
                          onChange: (s) => D(s.target.value),
                          className: "text-lg font-semibold h-10 max-w-xl",
                          placeholder: "Título del documento",
                        })
                      : e.jsx("h1", {
                          className: "text-xl font-semibold leading-tight truncate",
                          children: t.title,
                        }),
                    e.jsxs("div", {
                      className: "flex flex-wrap items-center gap-1.5",
                      children: [
                        e.jsx(E, { variant: "outline", className: "text-[10px]", children: ke[N] }),
                        t.category?.trim()
                          ? e.jsx(E, {
                              variant: "outline",
                              className: "text-[10px] font-normal",
                              children: t.category.trim(),
                            })
                          : null,
                        T &&
                          e.jsxs(E, {
                            variant: "outline",
                            className: "text-[10px] font-normal text-muted-foreground",
                            children: [
                              "Indexado",
                              t.chunks_count ? ` · ${t.chunks_count} fragmentos` : "",
                            ],
                          }),
                        t.api_refresh_config && !y
                          ? e.jsxs(E, {
                              variant: "outline",
                              className: "text-[10px] gap-1 border-primary/40 text-primary",
                              children: [e.jsx(le, { className: "h-3 w-3" }), "Auto-refresh"],
                            })
                          : null,
                      ],
                    }),
                  ],
                }),
                e.jsx("div", {
                  className: "flex items-center gap-1.5 shrink-0",
                  children: y
                    ? e.jsxs(e.Fragment, {
                        children: [
                          e.jsxs(g, {
                            type: "button",
                            variant: "outline",
                            size: "sm",
                            disabled: A,
                            onClick: () => b(!1),
                            children: [e.jsx(Oe, { className: "h-3.5 w-3.5 mr-1" }), " Cancelar"],
                          }),
                          e.jsxs(g, {
                            type: "button",
                            size: "sm",
                            disabled: A,
                            onClick: B,
                            children: [
                              A
                                ? e.jsx(G, { className: "h-3.5 w-3.5 mr-1 animate-spin" })
                                : e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                              "Guardar",
                            ],
                          }),
                        ],
                      })
                    : e.jsxs(g, {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        onClick: K,
                        children: [e.jsx(Ie, { className: "h-3.5 w-3.5 mr-1" }), " Editar"],
                      }),
                }),
              ],
            }),
            y
              ? e.jsxs("div", {
                  className:
                    "grid flex-1 min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]",
                  children: [
                    e.jsxs("div", {
                      className:
                        "flex min-h-[60vh] flex-col gap-2 rounded-xl border border-border/70 bg-card/60 p-4",
                      children: [
                        e.jsx(k, {
                          className: "text-xs text-muted-foreground",
                          children: "Contenido",
                        }),
                        F
                          ? e.jsx("div", {
                              className: "flex-1 min-h-0 overflow-y-auto pr-1",
                              children: e.jsx(Re, { pairs: L, onChange: V }),
                            })
                          : P
                            ? e.jsx(Fe, {
                                columns: x,
                                rows: w,
                                onColumnsChange: p,
                                onRowsChange: C,
                              })
                            : e.jsx(Me, {
                                value: I,
                                onChange: (s) => c(s.target.value),
                                className: "flex-1 min-h-[320px] font-mono text-sm resize-none",
                                placeholder: "Escribe o pega el contenido…",
                              }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "lg:w-[320px]",
                      children: e.jsx("p", {
                        className: "text-[11px] text-muted-foreground",
                        children:
                          "Para configurar actualización automática, usa la pestaña CronJob.",
                      }),
                    }),
                  ],
                })
              : e.jsxs(ze, {
                  value: S,
                  onValueChange: (s) => j(s),
                  className: "flex-1 min-h-0 flex flex-col",
                  children: [
                    e.jsxs(Le, {
                      className: "w-full sm:w-auto shrink-0",
                      children: [
                        e.jsxs(J, {
                          value: "documento",
                          className: "gap-1.5 flex-1 sm:flex-none",
                          children: [e.jsx(Ve, { className: "h-3.5 w-3.5" }), "Documento"],
                        }),
                        e.jsxs(J, {
                          value: "vectores",
                          className: "gap-1.5 flex-1 sm:flex-none",
                          children: [
                            e.jsx(Je, { className: "h-3.5 w-3.5" }),
                            "Vectores",
                            T &&
                              t.chunks_count != null &&
                              t.chunks_count > 0 &&
                              e.jsx(E, {
                                variant: "secondary",
                                className: "ml-0.5 h-5 px-1.5 text-[10px] tabular-nums",
                                children: t.chunks_count,
                              }),
                          ],
                        }),
                        e.jsxs(J, {
                          value: "cronjob",
                          className: "gap-1.5 flex-1 sm:flex-none",
                          children: [
                            e.jsx(Ue, { className: "h-3.5 w-3.5" }),
                            "CronJob",
                            t.api_refresh_config
                              ? e.jsx("span", {
                                  className: "h-1.5 w-1.5 rounded-full bg-emerald-500",
                                })
                              : null,
                          ],
                        }),
                        e.jsxs(J, {
                          value: "uso",
                          className: "gap-1.5 flex-1 sm:flex-none",
                          children: [e.jsx(Ge, { className: "h-3.5 w-3.5" }), "Uso"],
                        }),
                      ],
                    }),
                    e.jsx(U, {
                      value: "documento",
                      className: "flex-1 min-h-0 mt-3",
                      children: P
                        ? e.jsxs("div", {
                            className:
                              "flex h-full min-h-[60vh] flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4",
                            children: [
                              t.api_refresh_config ? e.jsx(te, { doc: t }) : null,
                              e.jsx(Ke, { content: t.content }),
                            ],
                          })
                        : e.jsx("div", {
                            className:
                              "h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-5",
                            children: e.jsxs("div", {
                              className: "mx-auto max-w-3xl space-y-4",
                              children: [
                                t.api_refresh_config ? e.jsx(te, { doc: t }) : null,
                                e.jsx(qe, { doc: t }),
                              ],
                            }),
                          }),
                    }),
                    e.jsx(U, {
                      value: "vectores",
                      className: "flex-1 min-h-0 mt-3",
                      children: e.jsx("div", {
                        className:
                          "h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-4",
                        children: e.jsx(Be, {
                          knowledgeId: String(t.id),
                          enabled: S === "vectores",
                          branchId: t.branch,
                        }),
                      }),
                    }),
                    e.jsx(U, {
                      value: "cronjob",
                      className: "flex-1 min-h-0 mt-3",
                      children: e.jsx("div", {
                        className: "h-full min-h-[60vh] overflow-y-auto rounded-xl",
                        children: e.jsx(He, {
                          value: t.api_refresh_config ?? null,
                          onChange: (s) => {
                            if (!t) return;
                            const n = !t.api_refresh_config,
                              r = !s,
                              o = {};
                            s ? (o.api_refresh_config = s) : (o.api_refresh_config = null);
                            const m = n || r;
                            i.mutate(
                              { id: String(t.id), data: o, branch: t.branch },
                              {
                                onSuccess: () => {
                                  (m &&
                                    h.success(
                                      r
                                        ? "CronJob desactivado."
                                        : "CronJob activado — se actualizará automáticamente.",
                                    ),
                                    f());
                                },
                                onError: (v) => h.error(ne(v, "Error al guardar CronJob")),
                              },
                            );
                          },
                          disabled: i.isPending,
                          branch: t.branch,
                          knowledgeType: t.knowledge_type,
                        }),
                      }),
                    }),
                    e.jsx(U, {
                      value: "uso",
                      className: "flex-1 min-h-0 mt-3",
                      children: e.jsx("div", {
                        className:
                          "h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-4",
                        children: e.jsx(Ye, {
                          knowledgeId: String(t.id),
                          enabled: S === "uso",
                          usageCount: t.usage_count,
                          lastUsedAt: t.last_used_at,
                        }),
                      }),
                    }),
                  ],
                }),
          ],
        });
}
export { rs as default };
