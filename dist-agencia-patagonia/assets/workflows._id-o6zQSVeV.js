import { r as u, j as e, aw as ut, af as xt, ah as $e } from "./vendor-react-DUYfdZnL.js";
import {
  B as X,
  bD as mt,
  dr as pt,
  ah as ht,
  V as A,
  dq as et,
  c as k,
  cG as gt,
  cH as ft,
  l as jt,
  ag as yt,
  W as F,
  X as V,
  Y as q,
  Z as H,
  $ as W,
  a0 as R,
  U as Pe,
  b as Nt,
  C as bt,
  dl as z,
  M as vt,
  ds as wt,
  aR as Fe,
  a5 as Me,
  d4 as _t,
  a7 as b,
  ai as St,
  ak as Ct,
  a9 as kt,
  am as Ve,
  a3 as qe,
  d5 as Mt,
  cZ as He,
  dp as Xe,
} from "./studio-chat-BBQUCckT.js";
import {
  C as Et,
  a as Ot,
  b as Pt,
  c as Lt,
  d as Ue,
  e as be,
  f as Dt,
} from "./context-menu-BI21iVdg.js";
import { c as Le, w as Rt, d as At, s as Ge } from "./workflowCatalog-GgI4Rjhb.js";
import {
  l as Tt,
  n as tt,
  g as It,
  m as Wt,
  p as zt,
  c as Jt,
  d as $t,
  q as Ft,
  s as Vt,
  e as qt,
  u as Ht,
  t as Xt,
  r as ue,
} from "./useWorkflows-DImh_Y0C.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const De = "application/x-muninn-wf-node";
function Ut({ onAdd: x, disabled: r, collapsed: l = !1, onCollapsedChange: w }) {
  const [h, y] = u.useState(""),
    i = u.useMemo(() => {
      const c = h.trim().toLowerCase();
      return c
        ? Le.filter(
            (o) =>
              o.label.toLowerCase().includes(c) ||
              o.type.toLowerCase().includes(c) ||
              o.hint.toLowerCase().includes(c),
          )
        : Le;
    }, [h]);
  return l
    ? e.jsx("div", {
        className: "w-10 shrink-0 border-r bg-card/80 flex flex-col items-center py-2 gap-1",
        children: e.jsx(X, {
          type: "button",
          size: "icon",
          variant: "ghost",
          className: "h-8 w-8",
          title: "Mostrar nodos",
          onClick: () => w?.(!1),
          children: e.jsx(mt, { className: "h-4 w-4" }),
        }),
      })
    : e.jsxs("aside", {
        className:
          "w-[200px] xl:w-[220px] shrink-0 border-r bg-card/90 backdrop-blur flex flex-col min-h-0",
        children: [
          e.jsxs("div", {
            className: "shrink-0 flex items-center gap-1 border-b px-2 py-1.5",
            children: [
              e.jsx("p", {
                className:
                  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex-1",
                children: "Nodos",
              }),
              e.jsx(X, {
                type: "button",
                size: "icon",
                variant: "ghost",
                className: "h-7 w-7",
                title: "Ocultar",
                onClick: () => w?.(!0),
                children: e.jsx(pt, { className: "h-3.5 w-3.5" }),
              }),
            ],
          }),
          e.jsx("div", {
            className: "shrink-0 px-2 py-1.5 border-b",
            children: e.jsxs("div", {
              className: "relative",
              children: [
                e.jsx(ht, {
                  className:
                    "absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground",
                }),
                e.jsx(A, {
                  value: h,
                  onChange: (c) => y(c.target.value),
                  placeholder: "Buscar…",
                  className: "h-7 pl-7 text-[11px]",
                }),
              ],
            }),
          }),
          e.jsx(et, {
            className: "flex-1 min-h-0",
            children: e.jsxs("ul", {
              className: "p-1.5 space-y-0.5",
              children: [
                i.map((c) =>
                  e.jsx(
                    "li",
                    {
                      children: e.jsxs("button", {
                        type: "button",
                        disabled: r,
                        draggable: !r,
                        onDragStart: (o) => {
                          (o.dataTransfer.setData(De, c.type),
                            (o.dataTransfer.effectAllowed = "copy"));
                        },
                        onClick: () => x(c.type),
                        className: k(
                          "w-full text-left rounded-lg border border-transparent px-2 py-1.5 transition-colors",
                          "hover:bg-muted/60 hover:border-border/60",
                          "active:scale-[0.98] disabled:opacity-50",
                          "cursor-grab active:cursor-grabbing",
                        ),
                        children: [
                          e.jsx("p", {
                            className: k("text-[11px] font-semibold", c.accent),
                            children: c.label,
                          }),
                          e.jsx("p", {
                            className:
                              "text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-0.5",
                            children: c.hint,
                          }),
                        ],
                      }),
                    },
                    c.type,
                  ),
                ),
                i.length === 0
                  ? e.jsx("li", {
                      className: "px-2 py-6 text-center text-[11px] text-muted-foreground",
                      children: "Sin resultados",
                    })
                  : null,
              ],
            }),
          }),
          e.jsx("p", {
            className:
              "shrink-0 border-t px-2 py-1.5 text-[10px] text-muted-foreground leading-snug",
            children: "Clic o arrastra al canvas",
          }),
        ],
      });
}
function v(x, r = "") {
  return x == null ? r : String(x);
}
function he(x, r) {
  const l = typeof x == "number" ? x : Number(x);
  return Number.isFinite(l) ? l : r;
}
function p({ label: x, hint: r, children: l }) {
  return e.jsxs("div", {
    className: "space-y-1",
    children: [
      e.jsx(Pe, { className: "text-[10px] text-muted-foreground", children: x }),
      l,
      r
        ? e.jsx("p", { className: "text-[10px] text-muted-foreground leading-snug", children: r })
        : null,
    ],
  });
}
const Gt = [
    { value: "noop", label: "Noop (no hace nada)" },
    { value: "log", label: "Log (mensaje de depuración)" },
    { value: "set_context", label: "Set context (mergear valores)" },
    { value: "fail", label: "Fail (forzar error)" },
  ],
  Ee = ["GET", "POST", "PUT", "PATCH", "DELETE"];
function Yt({ nodeType: x, config: r, onChange: l }) {
  const { data: w = [] } = gt({ is_active: !0 }),
    { data: h = [] } = ft(),
    { data: y } = jt({ isActive: !0, pageSize: 100 }),
    { data: i = [] } = yt({ scope: "store" }),
    c = u.useMemo(() => (y ? (Array.isArray(y) ? y : (y.results ?? [])) : []), [y]),
    o = (s) => l({ ...r, ...s }),
    Z = v(r.action_name || r.action, "noop"),
    G = he(r.delay_seconds ?? r.seconds, 60),
    T = v(r.external_api_id || r.api_id),
    E = i.find((s) => String(s.id) === T),
    I = u.useMemo(() => {
      const s = E?.endpoints;
      return !s || typeof s != "object" ? [] : Object.keys(s);
    }, [E]);
  return x === "trigger"
    ? e.jsxs("p", {
        className:
          "text-[11px] text-muted-foreground rounded-md border border-dashed px-2.5 py-2 leading-relaxed",
        children: [
          "Punto de entrada del flujo. No necesita configuración extra: recibe el",
          " ",
          e.jsx("code", { className: "text-[10px]", children: "trigger_data" }),
          " al ejecutar.",
        ],
      })
    : x === "agent"
      ? e.jsxs("div", {
          className: "space-y-2.5",
          children: [
            e.jsx(p, {
              label: "Agente",
              hint: "Slug del agente de Studio",
              children: e.jsxs(F, {
                value: v(r.agent_slug) || void 0,
                onValueChange: (s) => o({ agent_slug: s }),
                children: [
                  e.jsx(V, {
                    className: "h-8 text-xs",
                    children: e.jsx(q, { placeholder: "Elige un agente" }),
                  }),
                  e.jsx(H, {
                    children: w
                      .filter((s) => s.slug)
                      .map((s) => e.jsx(W, { value: s.slug, children: s.name || s.slug }, s.id)),
                  }),
                ],
              }),
            }),
            e.jsx(p, {
              label: "Mensaje / tarea",
              children: e.jsx(R, {
                value: v(r.message),
                onChange: (s) => o({ message: s.target.value }),
                rows: 3,
                className: "text-xs min-h-[72px]",
                placeholder: "Qué debe hacer el agente…",
              }),
            }),
            e.jsx(p, {
              label: "Max iteraciones",
              children: e.jsx(A, {
                type: "number",
                min: 1,
                max: 20,
                value: he(r.max_iterations, 4),
                onChange: (s) => o({ max_iterations: Number(s.target.value) || 4 }),
                className: "h-8 text-xs",
              }),
            }),
          ],
        })
      : x === "llm"
        ? e.jsxs("div", {
            className: "space-y-2.5",
            children: [
              e.jsx(p, {
                label: "Modelo",
                children: e.jsxs(F, {
                  value: r.model_id != null ? String(r.model_id) : void 0,
                  onValueChange: (s) => o({ model_id: s }),
                  children: [
                    e.jsx(V, {
                      className: "h-8 text-xs",
                      children: e.jsx(q, { placeholder: "Elige un modelo" }),
                    }),
                    e.jsx(H, {
                      children: c.map((s) =>
                        e.jsxs(
                          W,
                          {
                            value: String(s.id),
                            children: [s.name, s.provider_name ? ` · ${s.provider_name}` : ""],
                          },
                          String(s.id),
                        ),
                      ),
                    }),
                  ],
                }),
              }),
              e.jsx(p, {
                label: "System prompt",
                children: e.jsx(R, {
                  value: v(r.system_prompt),
                  onChange: (s) => o({ system_prompt: s.target.value }),
                  rows: 2,
                  className: "text-xs",
                  placeholder: "Instrucciones del sistema…",
                }),
              }),
              e.jsx(p, {
                label: "User message",
                hint: "Podés usar {{variables}} del contexto",
                children: e.jsx(R, {
                  value: v(r.user_message || r.prompt),
                  onChange: (s) => o({ user_message: s.target.value, prompt: s.target.value }),
                  rows: 3,
                  className: "text-xs min-h-[72px]",
                  placeholder: "Prompt del usuario…",
                }),
              }),
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                  e.jsx(p, {
                    label: "Temperature",
                    children: e.jsx(A, {
                      type: "number",
                      step: "0.1",
                      min: 0,
                      max: 2,
                      value: he(r.temperature, 0.7),
                      onChange: (s) => o({ temperature: Number(s.target.value) }),
                      className: "h-8 text-xs",
                    }),
                  }),
                  e.jsx(p, {
                    label: "Max tokens",
                    children: e.jsx(A, {
                      type: "number",
                      min: 1,
                      value: he(r.max_tokens, 2e3),
                      onChange: (s) => o({ max_tokens: Number(s.target.value) || 2e3 }),
                      className: "h-8 text-xs",
                    }),
                  }),
                ],
              }),
            ],
          })
        : x === "function"
          ? e.jsxs("div", {
              className: "space-y-2.5",
              children: [
                e.jsx(p, {
                  label: "Skill / función",
                  children: e.jsxs(F, {
                    value: v(r.function_id) || void 0,
                    onValueChange: (s) => {
                      const Y = h.find((ae) => String(ae.id) === s);
                      o({ function_id: s, function_slug: Y?.slug || void 0 });
                    },
                    children: [
                      e.jsx(V, {
                        className: "h-8 text-xs",
                        children: e.jsx(q, { placeholder: "Elige una skill" }),
                      }),
                      e.jsx(H, {
                        children: h.map((s) =>
                          e.jsxs(
                            W,
                            {
                              value: String(s.id),
                              children: [s.name, s.slug ? ` · ${s.slug}` : ""],
                            },
                            s.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                }),
                e.jsx(p, {
                  label: "Parámetros (JSON)",
                  hint: "Se renderizan con el contexto del workflow",
                  children: e.jsx(R, {
                    value:
                      typeof r.parameters == "string"
                        ? r.parameters
                        : JSON.stringify(r.parameters ?? {}, null, 2),
                    onChange: (s) => {
                      try {
                        o({ parameters: JSON.parse(s.target.value || "{}") });
                      } catch {
                        o({ parameters: s.target.value });
                      }
                    },
                    rows: 4,
                    className: "font-mono text-[11px]",
                  }),
                }),
              ],
            })
          : x === "action"
            ? e.jsxs("div", {
                className: "space-y-2.5",
                children: [
                  e.jsx(p, {
                    label: "Acción",
                    children: e.jsxs(F, {
                      value: Z,
                      onValueChange: (s) => o({ action_name: s, action: s }),
                      children: [
                        e.jsx(V, { className: "h-8 text-xs", children: e.jsx(q, {}) }),
                        e.jsx(H, {
                          children: Gt.map((s) =>
                            e.jsx(W, { value: s.value, children: s.label }, s.value),
                          ),
                        }),
                      ],
                    }),
                  }),
                  (Z === "log" || Z === "fail") &&
                    e.jsx(p, {
                      label: "Mensaje",
                      children: e.jsx(R, {
                        value: v(r.message),
                        onChange: (s) => o({ message: s.target.value }),
                        rows: 2,
                        className: "text-xs",
                      }),
                    }),
                  Z === "set_context" &&
                    e.jsx(p, {
                      label: "Values (JSON)",
                      hint: "Objeto a mergear en el contexto",
                      children: e.jsx(R, {
                        value:
                          typeof r.values == "string"
                            ? r.values
                            : JSON.stringify(r.values ?? {}, null, 2),
                        onChange: (s) => {
                          try {
                            o({ values: JSON.parse(s.target.value || "{}") });
                          } catch {
                            o({ values: s.target.value });
                          }
                        },
                        rows: 4,
                        className: "font-mono text-[11px]",
                      }),
                    }),
                ],
              })
            : x === "condition"
              ? e.jsx(p, {
                  label: "Expresión",
                  hint: "Ej: context.score > 0.5  ·  True",
                  children: e.jsx(R, {
                    value: v(r.expression, "True"),
                    onChange: (s) => o({ expression: s.target.value }),
                    rows: 3,
                    className: "font-mono text-xs",
                    placeholder: "True",
                  }),
                })
              : x === "delay"
                ? e.jsx(p, {
                    label: "Segundos de espera",
                    children: e.jsx(A, {
                      type: "number",
                      min: 0,
                      value: G,
                      onChange: (s) => {
                        const Y = Number(s.target.value) || 0;
                        o({ delay_seconds: Y, seconds: Y });
                      },
                      className: "h-8 text-xs",
                    }),
                  })
                : x === "api_call"
                  ? e.jsxs("div", {
                      className: "space-y-2.5",
                      children: [
                        e.jsxs("div", {
                          className: "grid grid-cols-[88px_1fr] gap-2",
                          children: [
                            e.jsx(p, {
                              label: "Método",
                              children: e.jsxs(F, {
                                value: v(r.method, "GET"),
                                onValueChange: (s) => o({ method: s }),
                                children: [
                                  e.jsx(V, { className: "h-8 text-xs", children: e.jsx(q, {}) }),
                                  e.jsx(H, {
                                    children: Ee.map((s) => e.jsx(W, { value: s, children: s }, s)),
                                  }),
                                ],
                              }),
                            }),
                            e.jsx(p, {
                              label: "URL / path",
                              children: e.jsx(A, {
                                value: v(r.url || r.path),
                                onChange: (s) => o({ url: s.target.value, path: s.target.value }),
                                className: "h-8 text-xs",
                                placeholder: "https://…",
                              }),
                            }),
                          ],
                        }),
                        e.jsx(p, {
                          label: "Body (JSON opcional)",
                          children: e.jsx(R, {
                            value:
                              typeof r.body == "string"
                                ? r.body
                                : JSON.stringify(r.body ?? {}, null, 2),
                            onChange: (s) => {
                              try {
                                o({ body: JSON.parse(s.target.value || "{}") });
                              } catch {
                                o({ body: s.target.value });
                              }
                            },
                            rows: 3,
                            className: "font-mono text-[11px]",
                          }),
                        }),
                      ],
                    })
                  : x === "external_api"
                    ? e.jsxs("div", {
                        className: "space-y-2.5",
                        children: [
                          e.jsx(p, {
                            label: "App externa",
                            children: e.jsxs(F, {
                              value: T || void 0,
                              onValueChange: (s) =>
                                o({ external_api_id: s, api_id: s, endpoint_key: "" }),
                              children: [
                                e.jsx(V, {
                                  className: "h-8 text-xs",
                                  children: e.jsx(q, { placeholder: "Elige una app" }),
                                }),
                                e.jsx(H, {
                                  children: i.map((s) =>
                                    e.jsx(
                                      W,
                                      { value: String(s.id), children: s.name || s.id },
                                      s.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          }),
                          e.jsx(p, {
                            label: "Endpoint",
                            children: e.jsxs(F, {
                              value: v(r.endpoint_key || r.path) || void 0,
                              onValueChange: (s) => o({ endpoint_key: s, path: s }),
                              disabled: !T,
                              children: [
                                e.jsx(V, {
                                  className: "h-8 text-xs",
                                  children: e.jsx(q, {
                                    placeholder: T ? "Endpoint" : "Elige la app primero",
                                  }),
                                }),
                                e.jsx(H, {
                                  children: I.map((s) => e.jsx(W, { value: s, children: s }, s)),
                                }),
                              ],
                            }),
                          }),
                          e.jsx(p, {
                            label: "Método",
                            children: e.jsxs(F, {
                              value: v(r.method, "GET"),
                              onValueChange: (s) => o({ method: s }),
                              children: [
                                e.jsx(V, { className: "h-8 text-xs", children: e.jsx(q, {}) }),
                                e.jsx(H, {
                                  children: Ee.map((s) => e.jsx(W, { value: s, children: s }, s)),
                                }),
                              ],
                            }),
                          }),
                        ],
                      })
                    : x === "webhook"
                      ? e.jsxs("div", {
                          className: "space-y-2.5",
                          children: [
                            e.jsxs("div", {
                              className: "grid grid-cols-[88px_1fr] gap-2",
                              children: [
                                e.jsx(p, {
                                  label: "Método",
                                  children: e.jsxs(F, {
                                    value: v(r.method, "POST"),
                                    onValueChange: (s) => o({ method: s }),
                                    children: [
                                      e.jsx(V, {
                                        className: "h-8 text-xs",
                                        children: e.jsx(q, {}),
                                      }),
                                      e.jsx(H, {
                                        children: Ee.map((s) =>
                                          e.jsx(W, { value: s, children: s }, s),
                                        ),
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx(p, {
                                  label: "URL",
                                  children: e.jsx(A, {
                                    value: v(r.url),
                                    onChange: (s) => o({ url: s.target.value }),
                                    className: "h-8 text-xs",
                                    placeholder: "https://…",
                                  }),
                                }),
                              ],
                            }),
                            e.jsx(p, {
                              label: "Payload (JSON)",
                              children: e.jsx(R, {
                                value:
                                  typeof r.payload == "string"
                                    ? r.payload
                                    : JSON.stringify(r.payload ?? {}, null, 2),
                                onChange: (s) => {
                                  try {
                                    o({ payload: JSON.parse(s.target.value || "{}") });
                                  } catch {
                                    o({ payload: s.target.value });
                                  }
                                },
                                rows: 3,
                                className: "font-mono text-[11px]",
                              }),
                            }),
                          ],
                        })
                      : x === "message"
                        ? e.jsxs("div", {
                            className: "space-y-2.5",
                            children: [
                              e.jsx(p, {
                                label: "Mensaje",
                                hint: "Soporta {{variables}} del contexto",
                                children: e.jsx(R, {
                                  value: v(r.message || r.text),
                                  onChange: (s) =>
                                    o({ message: s.target.value, text: s.target.value }),
                                  rows: 3,
                                  className: "text-xs min-h-[72px]",
                                }),
                              }),
                              e.jsx(p, {
                                label: "Channel ID (opcional)",
                                children: e.jsx(A, {
                                  value: v(r.channel_id),
                                  onChange: (s) => o({ channel_id: s.target.value }),
                                  className: "h-8 text-xs",
                                }),
                              }),
                              e.jsx(p, {
                                label: "External user ID (opcional)",
                                children: e.jsx(A, {
                                  value: v(r.external_user_id),
                                  onChange: (s) => o({ external_user_id: s.target.value }),
                                  className: "h-8 text-xs",
                                }),
                              }),
                            ],
                          })
                        : x === "database"
                          ? e.jsxs("div", {
                              className: "space-y-2.5",
                              children: [
                                e.jsx(p, {
                                  label: "Query type",
                                  children: e.jsxs(F, {
                                    value: v(r.query_type, "orm"),
                                    onValueChange: (s) => o({ query_type: s }),
                                    children: [
                                      e.jsx(V, {
                                        className: "h-8 text-xs",
                                        children: e.jsx(q, {}),
                                      }),
                                      e.jsxs(H, {
                                        children: [
                                          e.jsx(W, { value: "orm", children: "ORM" }),
                                          e.jsx(W, { value: "raw", children: "Raw SQL" }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx(p, {
                                  label: "Model / query",
                                  children: e.jsx(R, {
                                    value: v(r.model || r.query),
                                    onChange: (s) =>
                                      o({ model: s.target.value, query: s.target.value }),
                                    rows: 3,
                                    className: "font-mono text-xs",
                                    placeholder: "app.Model o SELECT…",
                                  }),
                                }),
                                e.jsx(p, {
                                  label: "Limit",
                                  children: e.jsx(A, {
                                    type: "number",
                                    min: 1,
                                    value: he(r.limit, 100),
                                    onChange: (s) => o({ limit: Number(s.target.value) || 100 }),
                                    className: "h-8 text-xs",
                                  }),
                                }),
                              ],
                            })
                          : e.jsxs("p", {
                              className: k("text-[11px] text-muted-foreground"),
                              children: [
                                "Sin formulario tipado para «",
                                x,
                                "». Usa JSON avanzado abajo.",
                              ],
                            });
}
const U = 180,
  J = 56,
  st = 320,
  Ye = 140,
  Be = 48,
  Ke = 56,
  Oe = "var(--primary)",
  Bt = "var(--success)",
  Kt = "var(--destructive)";
function Qt(x, r = U) {
  const l = Object.values(x);
  if (l.length < 2) return !1;
  const w = [...l].sort((c, o) => c.x - o.x || c.y - o.y);
  let h = 1 / 0;
  for (let c = 1; c < w.length; c++) {
    const o = w[c].x - (w[c - 1].x + r);
    h = Math.min(h, o);
  }
  const y = Math.min(...l.map((c) => c.x)),
    i = Math.min(...l.map((c) => c.y));
  return h < 72 || (y < 60 && i < 60 && l.length >= 2);
}
function Qe(x, r, l, w = !1) {
  if (x.length === 0) return {};
  const h = {};
  for (const C of x)
    h[String(C.id)] = { x: Number(C.position_x ?? 40), y: Number(C.position_y ?? 40) };
  const y = w || Qt(h);
  let i;
  y
    ? ((i = {}),
      Tt(x, r).forEach((ee, fe) => {
        const te = -(Math.max(0, ee.length - 1) * Ye + J) / 2;
        ee.forEach((re, me) => {
          i[re] = { x: fe * st, y: te + me * Ye };
        });
      }))
    : (i = { ...h });
  const c = Object.values(i),
    o = Math.min(...c.map((C) => C.x)),
    Z = Math.max(...c.map((C) => C.x)) + U,
    G = Math.min(...c.map((C) => C.y)),
    T = Math.max(...c.map((C) => C.y)) + J,
    E = Math.max(1, Z - o),
    I = Math.max(1, T - G),
    s = Math.max(l.w || 800, E + Be * 2),
    Y = Math.max(l.h || 560, I + Ke * 2),
    ae = Math.round((s - E) / 2 - o),
    ge = Math.round((Y - I) / 2 - G),
    ne = {};
  for (const [C, ee] of Object.entries(i))
    ne[C] = { x: Math.max(Be, ee.x + ae), y: Math.max(Ke, ee.y + ge) };
  return ne;
}
function Zt(x, r) {
  const l = new Map();
  if (!x?.length) return l;
  const w = new Map(r.map((i) => [String(i.id), String(i.id)])),
    h = new Map(r.map((i) => [i.node_key, String(i.id)])),
    y = new Map(r.map((i) => [i.name.toLowerCase(), String(i.id)]));
  for (const i of x) {
    let c = "";
    (i.node != null && w.has(String(i.node))
      ? (c = String(i.node))
      : i.node_name && h.has(i.node_name)
        ? (c = h.get(i.node_name))
        : i.node_name && y.has(i.node_name.toLowerCase()) && (c = y.get(i.node_name.toLowerCase())),
      c && l.set(c, tt(i.status ?? void 0)));
  }
  return l;
}
function Ze(x, r = 160) {
  const l = x.trim(),
    w = l.indexOf(`
`),
    h = (w >= 0 ? l.slice(0, w) : l).trim();
  return h.length <= r && w < 0
    ? { head: h, rest: "" }
    : h.length <= r
      ? { head: h, rest: l.slice(w + 1).trim() }
      : { head: `${h.slice(0, r)}…`, rest: l };
}
function is() {
  const { id: x } = ut(),
    r = xt(),
    { data: l, isLoading: w, error: h, refetch: y } = It(x),
    { data: i = [] } = Wt(x),
    c = zt(),
    o = Jt(),
    Z = $t(),
    G = Ft(),
    T = Vt(),
    E = qt(),
    [I, s] = u.useState(null),
    [Y, ae] = u.useState(""),
    [ge, ne] = u.useState({}),
    [C, ee] = u.useState(!1),
    [fe, xe] = u.useState("{}"),
    [te, re] = u.useState(null),
    [me, pe] = u.useState(null),
    [Re, je] = u.useState(null),
    [ve, se] = u.useState("console"),
    [D, le] = u.useState(!1),
    [N, B] = u.useState(null),
    [oe, $] = u.useState(null),
    [at, nt] = u.useState(!1),
    { data: S, isLoading: rt } = Ht(te || void 0),
    ie = u.useRef(null),
    we = u.useRef(null),
    de = u.useRef(null),
    _e = u.useRef(null),
    Ae = u.useRef(null),
    ye = u.useRef(null),
    [O, K] = u.useState({}),
    [Q, Te] = u.useState({ w: 960, h: 640 }),
    Ne = u.useRef(null),
    f = u.useMemo(() => (l?.nodes ?? []).filter((t) => t.is_active !== !1), [l?.nodes]),
    L = u.useMemo(() => (l?.edges ?? []).filter((t) => t.is_active !== !1), [l?.edges]),
    ot = async (t) => {
      if (!l) return;
      const a = L.filter((n) => {
        const d = ue(n, "from", f),
          m = ue(n, "to", f);
        return d === t || m === t;
      });
      try {
        for (const n of a)
          try {
            await G.mutateAsync({ id: String(n.id), workflow: l.id });
          } catch {}
        try {
          await T.mutateAsync({ id: t, workflow: l.id });
        } catch (n) {
          const d = z(n, "");
          if (!/does not exist|matches the given query|404|not found/i.test(d)) throw n;
        }
        (s((n) => (n === t ? null : n)),
          K((n) => {
            const d = { ...n };
            return (delete d[t], d);
          }),
          b.success("Nodo eliminado"),
          await y());
      } catch (n) {
        (b.error(z(n, "No se pudo eliminar el nodo")), y());
      }
    },
    Ie = (t) => {
      if (!l) return;
      const a = O[String(t.id)] ?? { x: Number(t.position_x ?? 40), y: Number(t.position_y ?? 40) },
        n = a.x + 36,
        d = a.y + 36,
        m = `${t.name} (copia)`;
      o.mutate(
        {
          workflow: l.id,
          node_type: t.node_type,
          node_key: Ge(m, t.node_type),
          name: m,
          position_x: Math.round(n),
          position_y: Math.round(d),
          config: t.config ?? {},
        },
        {
          onSuccess: (_) => {
            (b.success("Nodo clonado"),
              s(String(_.id)),
              se("node"),
              K((g) => ({ ...g, [String(_.id)]: { x: Math.round(n), y: Math.round(d) } })),
              y());
          },
          onError: (_) => b.error(z(_, "No se pudo clonar")),
        },
      );
    };
  (u.useEffect(() => {
    const t = (a) => {
      if (a.key === "Escape") {
        if (N || D) {
          (B(null), le(!1), $(null));
          return;
        }
        const n = a.target;
        if (n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) return;
        r("/app/workflows");
        return;
      }
      if (a.key === "Delete" || a.key === "Backspace") {
        const n = a.target;
        if ((n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable)) || !I)
          return;
        (a.preventDefault(), pe(I));
      }
    };
    return (window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t));
  }, [r, N, D, I, l, L, f]),
    u.useEffect(() => {
      te || i.length === 0 || re(String(i[0].id));
    }, [i, te]));
  const We = u.useRef(!1);
  (u.useEffect(() => {
    (We.current && !E.isPending && E.isSuccess && i[0] && re(String(i[0].id)),
      (We.current = E.isPending));
  }, [E.isPending, E.isSuccess, i]),
    u.useEffect(() => {
      const t = ye.current;
      if (!t) return;
      const a = () => {
        Te({ w: Math.max(320, t.clientWidth), h: Math.max(240, t.clientHeight) });
      };
      a();
      const n = new ResizeObserver(a);
      return (n.observe(t), () => n.disconnect());
    }, [l?.id]),
    u.useEffect(() => {
      if (!l?.id || f.length === 0) {
        (K({}), (Ne.current = null));
        return;
      }
      const t = `${l.id}|${f.map((a) => a.id).join(",")}|${L.map((a) => a.id).join(",")}`;
      Ne.current !== t &&
        ((Ne.current = t),
        requestAnimationFrame(() => {
          const a = ye.current,
            n = {
              w: Math.max(320, a?.clientWidth || Q.w),
              h: Math.max(240, a?.clientHeight || Q.h),
            };
          (Te(n), K(Qe(f, L, n, !0)));
        }));
    }, [l?.id, f, L]));
  const lt = () => {
      const t = Qe(f, L, Q, !0);
      (K(t),
        (Ne.current = `${l?.id}|${f.map((a) => a.id).join(",")}|${L.map((a) => a.id).join(",")}`));
      for (const [a, n] of Object.entries(t))
        c.mutate({ id: a, position_x: Math.round(n.x), position_y: Math.round(n.y) });
      b.success("Flujo centrado y separado");
    },
    ze = (t, a) => {
      if (!l) return;
      const n = Le.find((M) => M.type === t),
        d = n?.defaultName || t,
        m = Object.values(O).map((M) => M.x),
        _ = Object.values(O).map((M) => M.y),
        g = a?.x ?? (m.length ? Math.max(...m) + st : Math.round(Q.w / 2 - U / 2)),
        j =
          a?.y ??
          (_.length
            ? Math.round(_.reduce((M, ce) => M + ce, 0) / _.length)
            : Math.round(Q.h / 2 - J / 2));
      o.mutate(
        {
          workflow: l.id,
          node_type: t,
          node_key: Ge(d, t),
          name: d,
          position_x: Math.round(g),
          position_y: Math.round(j),
          config: n?.defaultConfig ?? {},
        },
        {
          onSuccess: (M) => {
            (b.success(`Nodo «${d}» agregado`),
              s(String(M.id)),
              se("node"),
              K((ce) => ({ ...ce, [String(M.id)]: { x: Math.round(g), y: Math.round(j) } })),
              y());
          },
          onError: (M) => b.error(z(M, "No se pudo agregar el nodo")),
        },
      );
    },
    Se = u.useMemo(() => Zt(S?.logs, f), [S?.logs, f]),
    it = u.useMemo(() => Xt(S?.status), [S?.status]),
    P = u.useMemo(() => f.find((t) => String(t.id) === I) ?? null, [f, I]);
  u.useEffect(() => {
    if (!P) {
      (ae(""), ne({}), xe("{}"));
      return;
    }
    ae(P.name || "");
    const t = P.config && typeof P.config == "object" ? { ...P.config } : {};
    (ne(t), xe(JSON.stringify(t, null, 2)), ee(!1));
  }, [P]);
  const Ce = (t, a) => {
      const n = ye.current;
      if (!n) return { x: t, y: a };
      const d = n.getBoundingClientRect();
      return { x: t - d.left + n.scrollLeft, y: a - d.top + n.scrollTop };
    },
    dt = (t, a) => {
      const n = String(t),
        d = String(a);
      return L.some((m) => {
        const _ = ue(m, "from", f),
          g = ue(m, "to", f);
        return _ === n && g === d;
      });
    },
    ke = (t, a) => {
      if (l) {
        if (t === a) {
          b.message("Elige un nodo distinto como destino");
          return;
        }
        if (dt(t, a)) {
          (b.message("Esos nodos ya están conectados"), B(null), $(null));
          return;
        }
        Z.mutate(
          { workflow: l.id, from_node: t, to_node: a },
          {
            onSuccess: () => {
              (b.success("Conexión creada"), B(null), $(null), y());
            },
            onError: (n) => b.error(z(n, "No se pudo conectar")),
          },
        );
      }
    },
    ct = u.useMemo(
      () =>
        L.map((t) => {
          const a = ue(t, "from", f),
            n = ue(t, "to", f);
          if (!a || !n) return null;
          const d = O[a],
            m = O[n];
          if (!d || !m) return null;
          const _ = d.x + U,
            g = d.y + J / 2,
            j = m.x,
            M = m.y + J / 2,
            ce = (_ + j) / 2;
          return {
            id: String(t.id),
            fromId: a,
            toId: n,
            d: `M ${_} ${g} C ${ce} ${g}, ${ce} ${M}, ${j} ${M}`,
          };
        }).filter((t) => t != null),
      [L, f, O],
    ),
    Je = u.useMemo(() => {
      let t = Q.w,
        a = Q.h;
      for (const n of Object.values(O))
        ((t = Math.max(t, n.x + U + 120)), (a = Math.max(a, n.y + J + 120)));
      return (oe && ((t = Math.max(t, oe.x + 40)), (a = Math.max(a, oe.y + 40))), { w: t, h: a });
    }, [O, oe, Q.w, Q.h]);
  return w
    ? e.jsx("div", {
        className: "h-dvh bg-background",
        children: e.jsx(Nt, { variant: "canvas", className: "h-full max-w-none", padded: !1 }),
      })
    : h || !l
      ? e.jsxs("div", {
          className: "h-dvh flex flex-col items-center justify-center gap-3 px-6",
          children: [
            e.jsx(bt, {
              className: "max-w-md w-full",
              message: z(h, "No se pudo cargar el workflow"),
            }),
            e.jsx(X, {
              asChild: !0,
              variant: "outline",
              children: e.jsx($e, { to: "/app/workflows", children: "Volver" }),
            }),
          ],
        })
      : e.jsxs("div", {
          className: "h-dvh flex flex-col bg-background overflow-hidden",
          children: [
            e.jsxs("div", {
              className:
                "shrink-0 border-b bg-card/80 backdrop-blur px-3 py-2 flex items-center gap-2",
              children: [
                e.jsx(X, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 gap-1.5 px-2",
                  asChild: !0,
                  children: e.jsxs($e, {
                    to: "/app/workflows",
                    children: [
                      e.jsx(vt, { className: "h-4 w-4" }),
                      e.jsx("span", { className: "text-xs font-medium", children: "OPS-agents" }),
                    ],
                  }),
                }),
                e.jsx("span", { className: "text-sm font-medium truncate", children: l.name }),
                e.jsxs("div", {
                  className: "ml-auto flex gap-1.5",
                  children: [
                    e.jsxs(X, {
                      size: "sm",
                      variant: "outline",
                      className: "h-8 gap-1",
                      onClick: lt,
                      title: "Centrar y separar nodos",
                      children: [e.jsx(wt, { className: "h-3.5 w-3.5" }), "Organizar"],
                    }),
                    e.jsxs(X, {
                      size: "sm",
                      variant: D ? "default" : "outline",
                      className: "h-8 gap-1",
                      onClick: () => {
                        (le((t) => !t), B(null), $(null));
                      },
                      children: [
                        e.jsx(Fe, { className: "h-3.5 w-3.5" }),
                        D ? "Conectando…" : "Conectar",
                      ],
                    }),
                    e.jsxs(X, {
                      size: "sm",
                      className: "h-8 gap-1",
                      disabled: E.isPending,
                      onClick: () =>
                        E.mutate(
                          { id: l.id },
                          {
                            onSuccess: (t) => {
                              (b.success("Ejecución disparada"), se("console"));
                              const a =
                                t && typeof t == "object" && "id" in t ? String(t.id) : null;
                              (a && re(a), y());
                            },
                            onError: (t) => b.error(z(t, "No se pudo ejecutar")),
                          },
                        ),
                      children: [
                        E.isPending
                          ? e.jsx(Me, { className: "h-3.5 w-3.5 animate-spin" })
                          : e.jsx(_t, { className: "h-3.5 w-3.5" }),
                        "Ejecutar",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            D
              ? e.jsx("div", {
                  className: "shrink-0 border-b bg-primary/10 px-3 py-1.5 text-[11px] text-primary",
                  children: N
                    ? "Clic en el nodo destino (o en su asa izquierda). Esc cancela."
                    : "Clic en el nodo origen (o arrastra desde el asa derecha).",
                })
              : null,
            e.jsxs("div", {
              className: "flex flex-1 min-h-0",
              children: [
                e.jsx(Ut, {
                  onAdd: ze,
                  disabled: o.isPending,
                  collapsed: at,
                  onCollapsedChange: nt,
                }),
                e.jsxs("div", {
                  ref: ye,
                  className:
                    "relative flex-1 min-w-0 overflow-auto bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] [background-size:24px_24px]",
                  onDragOver: (t) => {
                    t.dataTransfer.types.includes(De) &&
                      (t.preventDefault(), (t.dataTransfer.dropEffect = "copy"));
                  },
                  onDrop: (t) => {
                    const a = t.dataTransfer.getData(De);
                    if (!a) return;
                    t.preventDefault();
                    const n = Ce(t.clientX, t.clientY);
                    ze(a, { x: Math.max(16, n.x - U / 2), y: Math.max(16, n.y - J / 2) });
                  },
                  onMouseMove: (t) => {
                    const a = ie.current;
                    if (a) {
                      const n = Math.max(0, a.sx + (t.clientX - a.ox)),
                        d = Math.max(0, a.sy + (t.clientY - a.oy));
                      ((de.current = { id: a.id, x: n, y: d }),
                        we.current == null &&
                          (we.current = requestAnimationFrame(() => {
                            we.current = null;
                            const m = de.current;
                            m && K((_) => ({ ..._, [m.id]: { x: m.x, y: m.y } }));
                          })));
                      return;
                    }
                    if (N) {
                      const n = Ce(t.clientX, t.clientY);
                      ((Ae.current = n),
                        _e.current == null &&
                          (_e.current = requestAnimationFrame(() => {
                            _e.current = null;
                            const d = Ae.current;
                            d && $(d);
                          })));
                    }
                  },
                  onMouseUp: () => {
                    const t = ie.current;
                    if (!t) return;
                    ie.current = null;
                    const a = de.current,
                      n = a && a.id === t.id ? { x: a.x, y: a.y } : O[t.id];
                    ((de.current = null),
                      n &&
                        (K((d) => ({ ...d, [t.id]: n })),
                        c.mutate(
                          { id: t.id, position_x: Math.round(n.x), position_y: Math.round(n.y) },
                          { onError: (d) => b.error(z(d, "No se pudo guardar la posición")) },
                        )));
                  },
                  onMouseLeave: () => {
                    const t = ie.current;
                    if (!t) return;
                    ie.current = null;
                    const a = de.current,
                      n = a && a.id === t.id ? { x: a.x, y: a.y } : O[t.id];
                    ((de.current = null),
                      n &&
                        (K((d) => ({ ...d, [t.id]: n })),
                        c.mutate(
                          { id: t.id, position_x: Math.round(n.x), position_y: Math.round(n.y) },
                          { onError: (d) => b.error(z(d, "No se pudo guardar la posición")) },
                        )));
                  },
                  onClick: () => {
                    D && N && (B(null), $(null));
                  },
                  children: [
                    e.jsxs("svg", {
                      width: Je.w,
                      height: Je.h,
                      className: "absolute left-0 top-0 z-0 pointer-events-none overflow-visible",
                      "aria-hidden": !0,
                      children: [
                        e.jsx("defs", {
                          children: e.jsx("marker", {
                            id: "wf-arrow",
                            markerWidth: "8",
                            markerHeight: "8",
                            refX: "6",
                            refY: "3",
                            orient: "auto",
                            children: e.jsx("path", {
                              d: "M0,0 L6,3 L0,6 Z",
                              fill: Oe,
                              fillOpacity: 0.85,
                            }),
                          }),
                        }),
                        ct.map((t) => {
                          const a = Se.get(t.fromId),
                            n = Se.get(t.toId),
                            d =
                              n === "failed" || a === "failed"
                                ? Kt
                                : n === "success" && (a === "success" || a === "running")
                                  ? Bt
                                  : Oe,
                            m = it && (a === "running" || n === "running" || n === "pending");
                          return e.jsxs(
                            "g",
                            {
                              className: "pointer-events-auto",
                              children: [
                                e.jsx("path", {
                                  d: t.d,
                                  fill: "none",
                                  stroke: "transparent",
                                  strokeWidth: "14",
                                  className: "cursor-pointer",
                                  onClick: (_) => {
                                    (_.stopPropagation(), je(t.id));
                                  },
                                }),
                                e.jsx("path", {
                                  d: t.d,
                                  fill: "none",
                                  stroke: d,
                                  strokeOpacity: 0.35,
                                  strokeWidth: "2.5",
                                  className: "pointer-events-none",
                                  style: { stroke: d },
                                }),
                                e.jsx("path", {
                                  d: t.d,
                                  fill: "none",
                                  stroke: d,
                                  strokeOpacity: 0.95,
                                  strokeWidth: "2.5",
                                  strokeDasharray: m ? "8 10" : void 0,
                                  markerEnd: "url(#wf-arrow)",
                                  className: k("pointer-events-none", m && "wf-edge-flow"),
                                  style: { stroke: d },
                                }),
                              ],
                            },
                            t.id,
                          );
                        }),
                        N && oe && O[N]
                          ? e.jsx("line", {
                              x1: O[N].x + U,
                              y1: O[N].y + J / 2,
                              x2: oe.x,
                              y2: oe.y,
                              stroke: Oe,
                              strokeOpacity: 0.85,
                              strokeWidth: "2",
                              strokeDasharray: "6 4",
                            })
                          : null,
                      ],
                    }),
                    f.map((t) => {
                      const a = String(t.id),
                        n = O[a] ?? { x: 40, y: 40 },
                        d = N === a,
                        m = Rt(t.node_type),
                        _ = I === a,
                        g = Se.get(a) || "idle";
                      return e.jsxs(
                        Et,
                        {
                          children: [
                            e.jsx(Ot, {
                              asChild: !0,
                              children: e.jsxs("div", {
                                className: k(
                                  "absolute z-10 w-[180px] rounded-xl border backdrop-blur-md px-3 py-2.5 text-left",
                                  "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_6%,transparent)] transition-[box-shadow,transform] duration-motion-base",
                                  "hover:shadow-[0_0_28px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)] hover:-translate-y-0.5 motion-safe:hover:-translate-y-0.5",
                                  m?.accentBg || "bg-card/95 border-border",
                                  _ &&
                                    "ring-2 ring-primary/45 shadow-[0_0_32px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
                                  d && "ring-2 ring-primary/60",
                                  g === "running" && "wf-node-running ring-2 ring-primary/70",
                                  g === "success" && "ring-2 ring-success/50",
                                  g === "failed" && "ring-2 ring-destructive/60",
                                  g === "pending" && "opacity-80",
                                  D && "cursor-crosshair",
                                ),
                                style: { left: n.x, top: n.y },
                                onContextMenu: () => {
                                  s(a);
                                },
                                children: [
                                  g !== "idle"
                                    ? e.jsx("span", {
                                        className: k(
                                          "absolute -top-1.5 -right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border bg-background shadow-sm",
                                          g === "running" && "border-primary text-primary",
                                          g === "success" && "border-success text-success",
                                          g === "failed" && "border-destructive text-destructive",
                                          g === "pending" && "border-warning text-warning",
                                          g === "skipped" &&
                                            "border-muted-foreground text-muted-foreground",
                                        ),
                                        title: g,
                                        children:
                                          g === "running" || g === "pending"
                                            ? e.jsx(Me, { className: "h-3 w-3 animate-spin" })
                                            : g === "success"
                                              ? e.jsx(St, { className: "h-3 w-3" })
                                              : g === "failed"
                                                ? e.jsx(Ct, { className: "h-3 w-3" })
                                                : e.jsx("span", {
                                                    className: "text-[8px] font-bold",
                                                    children: "–",
                                                  }),
                                      })
                                    : null,
                                  e.jsxs("button", {
                                    type: "button",
                                    className: k(
                                      "w-full text-left",
                                      !D && "cursor-grab active:cursor-grabbing",
                                    ),
                                    onClick: (j) => {
                                      if ((j.stopPropagation(), D)) {
                                        N ? ke(N, a) : (B(a), $({ x: n.x + U, y: n.y + J / 2 }));
                                        return;
                                      }
                                      (s(a), se("node"));
                                    },
                                    onMouseDown: (j) => {
                                      D ||
                                        (j.button === 0 &&
                                          (j.stopPropagation(),
                                          (ie.current = {
                                            id: a,
                                            ox: j.clientX,
                                            oy: j.clientY,
                                            sx: n.x,
                                            sy: n.y,
                                          })));
                                    },
                                    children: [
                                      e.jsx("p", {
                                        className: k(
                                          "text-[10px] font-semibold uppercase tracking-wider",
                                          m?.accent || "text-muted-foreground",
                                        ),
                                        children: m?.label || t.node_type,
                                      }),
                                      e.jsx("p", {
                                        className: "text-sm font-medium truncate mt-0.5",
                                        children: t.name,
                                      }),
                                    ],
                                  }),
                                  e.jsx("button", {
                                    type: "button",
                                    title: "Entrada",
                                    "aria-label": "Handle de entrada",
                                    className: k(
                                      "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background",
                                      D && N && N !== a && "ring-2 ring-primary/50 scale-125",
                                    ),
                                    onClick: (j) => {
                                      (j.stopPropagation(), D || le(!0), N && N !== a && ke(N, a));
                                    },
                                    onMouseUp: (j) => {
                                      (j.stopPropagation(), N && N !== a && ke(N, a));
                                    },
                                  }),
                                  e.jsx("button", {
                                    type: "button",
                                    title: "Salida — arrastra o clic para conectar",
                                    "aria-label": "Handle de salida",
                                    className: k(
                                      "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-primary",
                                      "hover:scale-125 transition-transform",
                                    ),
                                    onClick: (j) => {
                                      (j.stopPropagation(),
                                        le(!0),
                                        B(a),
                                        $({ x: n.x + U, y: n.y + J / 2 }));
                                    },
                                    onMouseDown: (j) => {
                                      (j.stopPropagation(),
                                        j.preventDefault(),
                                        le(!0),
                                        B(a),
                                        $(Ce(j.clientX, j.clientY)));
                                    },
                                  }),
                                ],
                              }),
                            }),
                            e.jsxs(Pt, {
                              className: "w-52",
                              children: [
                                e.jsx(Lt, { className: "text-[11px] truncate", children: t.name }),
                                e.jsx(Ue, {}),
                                e.jsxs(be, {
                                  className: "gap-2 text-xs",
                                  onSelect: () => {
                                    (s(a), se("node"));
                                  },
                                  children: [e.jsx(kt, { className: "h-3.5 w-3.5" }), "Editar"],
                                }),
                                e.jsxs(be, {
                                  className: "gap-2 text-xs",
                                  onSelect: () => {
                                    (le(!0), B(a), $({ x: n.x + U, y: n.y + J / 2 }));
                                  },
                                  children: [
                                    e.jsx(Fe, { className: "h-3.5 w-3.5" }),
                                    "Conectar desde aquí",
                                  ],
                                }),
                                e.jsxs(be, {
                                  className: "gap-2 text-xs",
                                  onSelect: () => Ie(t),
                                  children: [e.jsx(Ve, { className: "h-3.5 w-3.5" }), "Clonar"],
                                }),
                                e.jsx(Ue, {}),
                                e.jsxs(be, {
                                  className:
                                    "gap-2 text-xs text-destructive focus:text-destructive",
                                  disabled: T.isPending,
                                  onSelect: () => pe(a),
                                  children: [
                                    e.jsx(qe, { className: "h-3.5 w-3.5" }),
                                    "Eliminar",
                                    e.jsx(Dt, { children: "Del" }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        a,
                      );
                    }),
                  ],
                }),
                e.jsxs("aside", {
                  className:
                    "w-[300px] xl:w-[340px] border-l bg-card flex flex-col shrink-0 min-h-0",
                  children: [
                    e.jsxs("div", {
                      className: "shrink-0 border-b px-2.5 py-1.5 flex items-center gap-1.5",
                      children: [
                        e.jsxs("div", {
                          className: "flex rounded-md border border-border/70 p-0.5 bg-muted/30",
                          children: [
                            e.jsx("button", {
                              type: "button",
                              onClick: () => se("node"),
                              className: k(
                                "h-7 px-2.5 rounded text-[11px] font-medium transition-colors",
                                ve === "node"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground",
                              ),
                              children: "Nodo",
                            }),
                            e.jsxs("button", {
                              type: "button",
                              onClick: () => {
                                (se("console"), !te && i[0] && re(String(i[0].id)));
                              },
                              className: k(
                                "h-7 px-2.5 rounded text-[11px] font-medium transition-colors",
                                ve === "console"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground",
                              ),
                              children: [
                                "Consola",
                                i.length > 0
                                  ? e.jsx("span", {
                                      className: "ml-1 text-[10px] text-muted-foreground",
                                      children: i.length,
                                    })
                                  : null,
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("span", {
                          className: k(
                            "ml-auto text-[10px] tabular-nums",
                            L.length > 0 ? "text-muted-foreground" : "text-amber-500/90",
                          ),
                          title: "Conexiones del grafo",
                          children: [L.length, " link", L.length === 1 ? "" : "s"],
                        }),
                      ],
                    }),
                    ve === "node"
                      ? e.jsx(et, {
                          className: "flex-1 min-h-0",
                          children: e.jsx("div", {
                            className: "p-3 space-y-2.5",
                            children: P
                              ? e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsxs("div", {
                                      className: "space-y-2",
                                      children: [
                                        e.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            e.jsx(Pe, {
                                              className: "text-[10px] text-muted-foreground",
                                              children: "Nombre",
                                            }),
                                            e.jsx(A, {
                                              value: Y,
                                              onChange: (t) => ae(t.target.value),
                                              className: "h-8 text-xs",
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            e.jsx(Pe, {
                                              className: "text-[10px] text-muted-foreground",
                                              children: "Tipo",
                                            }),
                                            e.jsx(A, {
                                              value: At(P.node_type),
                                              readOnly: !0,
                                              className: "h-8 text-xs",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className:
                                        "rounded-lg border border-border/60 bg-muted/20 p-2.5 space-y-2",
                                      children: [
                                        e.jsx("p", {
                                          className:
                                            "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                                          children: "Configuración",
                                        }),
                                        e.jsx(Yt, {
                                          nodeType: P.node_type,
                                          config: ge,
                                          onChange: (t) => {
                                            (ne(t), xe(JSON.stringify(t, null, 2)));
                                          },
                                        }),
                                      ],
                                    }),
                                    e.jsxs("details", {
                                      className: "rounded-md border border-dashed px-2.5 py-2",
                                      open: C,
                                      onToggle: (t) => ee(t.target.open),
                                      children: [
                                        e.jsx("summary", {
                                          className:
                                            "cursor-pointer text-[10px] text-muted-foreground",
                                          children: "JSON avanzado",
                                        }),
                                        e.jsx(R, {
                                          value: fe,
                                          onChange: (t) => {
                                            xe(t.target.value);
                                            try {
                                              ne(JSON.parse(t.target.value || "{}"));
                                            } catch {}
                                          },
                                          rows: 6,
                                          className: "mt-2 font-mono text-[11px] min-h-[100px]",
                                        }),
                                      ],
                                    }),
                                    e.jsxs(X, {
                                      size: "sm",
                                      className: "w-full h-8 gap-1.5",
                                      disabled: c.isPending,
                                      onClick: () => {
                                        let t = ge;
                                        if (C)
                                          try {
                                            t = JSON.parse(fe || "{}");
                                          } catch {
                                            b.error("JSON inválido");
                                            return;
                                          }
                                        (t &&
                                          typeof t == "object" &&
                                          P.node_type === "delay" &&
                                          t.seconds != null &&
                                          t.delay_seconds == null &&
                                          (t = { ...t, delay_seconds: t.seconds }),
                                          c.mutate(
                                            { id: P.id, name: Y.trim() || P.name, config: t },
                                            {
                                              onSuccess: () => b.success("Nodo guardado"),
                                              onError: (a) =>
                                                b.error(z(a, "No se pudo guardar el nodo")),
                                            },
                                          ));
                                      },
                                      children: [
                                        e.jsx(Mt, { className: "h-3.5 w-3.5" }),
                                        "Guardar",
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "flex gap-1.5",
                                      children: [
                                        e.jsxs(X, {
                                          size: "sm",
                                          variant: "outline",
                                          className: "flex-1 h-8 gap-1.5 text-[11px]",
                                          disabled: o.isPending,
                                          onClick: () => Ie(P),
                                          children: [
                                            e.jsx(Ve, { className: "h-3.5 w-3.5" }),
                                            "Clonar",
                                          ],
                                        }),
                                        e.jsxs(X, {
                                          size: "sm",
                                          variant: "outline",
                                          className:
                                            "flex-1 h-8 gap-1.5 text-[11px] text-destructive hover:text-destructive",
                                          disabled: T.isPending,
                                          onClick: () => pe(String(P.id)),
                                          children: [
                                            e.jsx(qe, { className: "h-3.5 w-3.5" }),
                                            "Borrar",
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsx("p", {
                                      className: "text-[10px] text-muted-foreground leading-snug",
                                      children: "Tip: clic derecho en un nodo · Delete para borrar",
                                    }),
                                  ],
                                })
                              : e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground leading-relaxed",
                                  children:
                                    "Toca un nodo o agrega desde la palette. Clic derecho para editar / clonar / borrar.",
                                }),
                          }),
                        })
                      : e.jsxs("div", {
                          className: "flex-1 min-h-0 flex flex-col",
                          children: [
                            e.jsx("div", {
                              className: "shrink-0 border-b max-h-[34%] overflow-y-auto",
                              children:
                                i.length === 0
                                  ? e.jsx("p", {
                                      className: "px-3 py-4 text-[11px] text-muted-foreground",
                                      children: "Sin corridas. Usa Ejecutar para probar el flujo.",
                                    })
                                  : e.jsx("ul", {
                                      className: "p-1.5 space-y-0.5",
                                      children: i.slice(0, 12).map((t) => {
                                        const a = te === String(t.id),
                                          n = String(t.status || "")
                                            .toLowerCase()
                                            .includes("fail");
                                        return e.jsx(
                                          "li",
                                          {
                                            children: e.jsx("button", {
                                              type: "button",
                                              onClick: () => re(String(t.id)),
                                              className: k(
                                                "w-full text-left rounded-md px-2 py-1.5 text-[11px] transition-colors",
                                                a
                                                  ? "bg-primary/12 border border-primary/30"
                                                  : "hover:bg-muted/50 border border-transparent",
                                              ),
                                              children: e.jsxs("div", {
                                                className: "flex items-center gap-2 min-w-0",
                                                children: [
                                                  e.jsx("span", {
                                                    className: k(
                                                      "shrink-0 font-medium capitalize",
                                                      n ? "text-destructive" : "text-foreground",
                                                    ),
                                                    children: t.status || "—",
                                                  }),
                                                  e.jsx("span", {
                                                    className:
                                                      "truncate text-muted-foreground tabular-nums",
                                                    children: (t.started_at || t.created || "")
                                                      .replace("T", " ")
                                                      .slice(0, 19),
                                                  }),
                                                ],
                                              }),
                                            }),
                                          },
                                          t.id,
                                        );
                                      }),
                                    }),
                            }),
                            e.jsx("div", {
                              className: "flex-1 min-h-0 overflow-y-auto p-2.5",
                              children: te
                                ? rt || !S
                                  ? e.jsxs("div", {
                                      className:
                                        "flex items-center gap-2 text-[11px] text-muted-foreground py-6 justify-center",
                                      children: [
                                        e.jsx(Me, { className: "h-3.5 w-3.5 animate-spin" }),
                                        "Cargando…",
                                      ],
                                    })
                                  : e.jsxs("div", {
                                      className: "space-y-2",
                                      children: [
                                        e.jsxs("div", {
                                          className:
                                            "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]",
                                          children: [
                                            e.jsx("span", {
                                              className: k(
                                                "font-semibold capitalize",
                                                String(S.status || "")
                                                  .toLowerCase()
                                                  .includes("fail")
                                                  ? "text-destructive"
                                                  : "text-foreground",
                                              ),
                                              children: S.status,
                                            }),
                                            e.jsxs("span", {
                                              className: "text-muted-foreground",
                                              children: [
                                                S.completed_nodes ?? 0,
                                                "/",
                                                S.total_nodes ?? 0,
                                                " ",
                                                "nodos",
                                                S.duration_ms != null
                                                  ? ` · ${S.duration_ms} ms`
                                                  : "",
                                              ],
                                            }),
                                          ],
                                        }),
                                        S.error_message
                                          ? (() => {
                                              const { head: t, rest: a } = Ze(S.error_message);
                                              return e.jsxs("div", {
                                                className:
                                                  "rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5",
                                                children: [
                                                  e.jsx("p", {
                                                    className:
                                                      "text-[11px] text-destructive font-medium leading-snug",
                                                    children: t,
                                                  }),
                                                  a
                                                    ? e.jsxs("details", {
                                                        className: "mt-1",
                                                        children: [
                                                          e.jsx("summary", {
                                                            className:
                                                              "cursor-pointer text-[10px] text-muted-foreground",
                                                            children: "Ver stack / detalle",
                                                          }),
                                                          e.jsx("pre", {
                                                            className:
                                                              "mt-1 max-h-[40vh] overflow-auto text-[10px] leading-snug whitespace-pre-wrap break-words text-destructive/90 font-mono",
                                                            children: a,
                                                          }),
                                                        ],
                                                      })
                                                    : null,
                                                ],
                                              });
                                            })()
                                          : null,
                                        (S.logs || []).length === 0
                                          ? e.jsx("p", {
                                              className: "text-[11px] text-muted-foreground",
                                              children: "Sin logs de nodos.",
                                            })
                                          : e.jsx("ul", {
                                              className: "space-y-1.5",
                                              children: (S.logs || []).map((t) => {
                                                const a = t.error_message
                                                    ? Ze(t.error_message, 120)
                                                    : null,
                                                  n = tt(t.status),
                                                  d =
                                                    (t.node != null &&
                                                      f.some(
                                                        (m) => String(m.id) === String(t.node),
                                                      ) &&
                                                      String(t.node)) ||
                                                    f.find((m) => m.node_key === t.node_name)?.id ||
                                                    f.find(
                                                      (m) =>
                                                        t.node_name &&
                                                        m.name.toLowerCase() ===
                                                          t.node_name.toLowerCase(),
                                                    )?.id ||
                                                    null;
                                                return e.jsx(
                                                  "li",
                                                  {
                                                    children: e.jsxs("button", {
                                                      type: "button",
                                                      className: k(
                                                        "w-full text-left rounded-md border bg-background/70 px-2 py-1.5 transition-colors",
                                                        d &&
                                                          "hover:border-primary/40 hover:bg-primary/5",
                                                        n === "failed" && "border-destructive/30",
                                                        n === "success" && "border-emerald-500/25",
                                                        n === "running" && "border-primary/40",
                                                      ),
                                                      onClick: () => {
                                                        d && (s(String(d)), se("node"));
                                                      },
                                                      children: [
                                                        e.jsxs("p", {
                                                          className:
                                                            "text-[11px] font-medium leading-tight",
                                                          children: [
                                                            t.node_name || "Nodo",
                                                            e.jsxs("span", {
                                                              className:
                                                                "text-muted-foreground font-normal",
                                                              children: [" ", "· ", t.status],
                                                            }),
                                                          ],
                                                        }),
                                                        a
                                                          ? e.jsxs("div", {
                                                              className: "mt-1",
                                                              children: [
                                                                e.jsx("p", {
                                                                  className:
                                                                    "text-[10px] text-destructive leading-snug",
                                                                  children: a.head,
                                                                }),
                                                                a.rest
                                                                  ? e.jsxs("details", {
                                                                      className: "mt-0.5",
                                                                      onClick: (m) =>
                                                                        m.stopPropagation(),
                                                                      children: [
                                                                        e.jsx("summary", {
                                                                          className:
                                                                            "cursor-pointer text-[10px] text-muted-foreground",
                                                                          children: "Más detalle",
                                                                        }),
                                                                        e.jsx("pre", {
                                                                          className:
                                                                            "mt-1 max-h-40 overflow-auto text-[10px] whitespace-pre-wrap break-words text-destructive/90 font-mono",
                                                                          children: a.rest,
                                                                        }),
                                                                      ],
                                                                    })
                                                                  : null,
                                                              ],
                                                            })
                                                          : null,
                                                        t.output_data &&
                                                        Object.keys(t.output_data).length > 0
                                                          ? e.jsxs("details", {
                                                              className: "mt-1",
                                                              onClick: (m) => m.stopPropagation(),
                                                              children: [
                                                                e.jsx("summary", {
                                                                  className:
                                                                    "cursor-pointer text-[10px] text-muted-foreground",
                                                                  children: "Output",
                                                                }),
                                                                e.jsx("pre", {
                                                                  className:
                                                                    "mt-0.5 text-[10px] whitespace-pre-wrap break-words font-mono text-muted-foreground max-h-32 overflow-auto",
                                                                  children: He(t.output_data),
                                                                }),
                                                              ],
                                                            })
                                                          : null,
                                                      ],
                                                    }),
                                                  },
                                                  t.id,
                                                );
                                              }),
                                            }),
                                        S.context && Object.keys(S.context).length > 0
                                          ? e.jsxs("details", {
                                              className: "text-[11px]",
                                              children: [
                                                e.jsx("summary", {
                                                  className: "cursor-pointer text-muted-foreground",
                                                  children: "Contexto final",
                                                }),
                                                e.jsx("pre", {
                                                  className:
                                                    "mt-1 whitespace-pre-wrap break-words font-mono text-[10px] text-muted-foreground max-h-28 overflow-auto",
                                                  children: He(S.context),
                                                }),
                                              ],
                                            })
                                          : null,
                                      ],
                                    })
                                : e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground px-0.5",
                                    children: "Elige una corrida para ver el detalle.",
                                  }),
                            }),
                          ],
                        }),
                  ],
                }),
              ],
            }),
            e.jsx(Xe, {
              open: me != null,
              onOpenChange: (t) => {
                t || pe(null);
              },
              title: "¿Eliminar este nodo?",
              description: (() => {
                const t = f.find((n) => String(n.id) === me);
                return `Se eliminará ${t?.name ? `«${t.name}»` : "el nodo"} junto con sus conexiones. Esta acción no se puede deshacer.`;
              })(),
              confirmLabel: "Eliminar nodo",
              destructive: !0,
              busy: T.isPending || G.isPending,
              onConfirm: () => {
                const t = me;
                t && (pe(null), ot(t));
              },
            }),
            e.jsx(Xe, {
              open: Re != null,
              onOpenChange: (t) => {
                t || je(null);
              },
              title: "¿Eliminar esta conexión?",
              description:
                "Se quitará la conexión entre los dos nodos. Esta acción no se puede deshacer.",
              confirmLabel: "Eliminar conexión",
              destructive: !0,
              busy: G.isPending,
              onConfirm: () => {
                const t = Re;
                !t ||
                  !l ||
                  G.mutate(
                    { id: t, workflow: l.id },
                    {
                      onSuccess: () => {
                        (b.success("Conexión eliminada"), je(null), y());
                      },
                      onError: (a) => {
                        (b.error(z(a, "No se pudo eliminar")), je(null));
                      },
                    },
                  );
              },
            }),
          ],
        });
}
export { is as default };
