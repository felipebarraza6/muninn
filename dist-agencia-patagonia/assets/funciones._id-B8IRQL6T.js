import { r, j as e, aw as ps, af as hs, ag as gs, ah as Ye } from "./vendor-react-DUYfdZnL.js";
import {
  eD as fs,
  eE as Ze,
  eF as Ve,
  em as js,
  B as j,
  a5 as V,
  a6 as Qe,
  eG as ye,
  eH as _e,
  eI as Se,
  eJ as Xe,
  eK as Ns,
  eL as vs,
  U as v,
  eM as es,
  V as Y,
  eN as we,
  cZ as Z,
  c as ce,
  a7 as i,
  ew as bs,
  eO as ys,
  R as ss,
  b as as,
  eP as _s,
  eQ as ts,
  K as P,
  eR as rs,
  eS as ns,
  aa as Ss,
  ab as ws,
  ac as Cs,
  ad as Es,
  eT as Ps,
  cQ as $e,
  cR as As,
  d1 as ks,
  eU as Ds,
  eV as Ls,
  eW as Ms,
  eX as Ts,
  ed as Fs,
  eY as Is,
  eZ as Rs,
  eb as Os,
  ag as qs,
  M as Ke,
  bU as zs,
  ee as Ys,
  ec as Vs,
  e8 as ve,
  a9 as He,
  dh as Be,
  b1 as $s,
  dD as Ks,
  a3 as Je,
  b2 as Hs,
  b3 as Bs,
  b4 as Js,
  b5 as Us,
  b6 as Ws,
  b7 as Gs,
  b8 as Zs,
  T as Qs,
  N as Xs,
  O as re,
  e6 as ea,
  e_ as sa,
  eq as aa,
  Q as ne,
  a0 as ie,
  W as J,
  X as U,
  Y as W,
  Z as G,
  e$ as ta,
  $ as F,
  dt as Ue,
  F as ra,
  f0 as na,
  cY as We,
  f1 as ia,
} from "./studio-chat-BBQUCckT.js";
import { F as la } from "./formula-expression-editor-D1EGb6DP.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function is(t) {
  return `muninn:skill-test:${t}`;
}
function Ge(t) {
  try {
    const l = localStorage.getItem(is(t));
    if (!l) return {};
    const d = JSON.parse(l);
    return d && typeof d == "object" ? d : {};
  } catch {
    return {};
  }
}
function ca(t, l) {
  try {
    localStorage.setItem(is(t), JSON.stringify(l));
  } catch {}
}
function oa({ skill: t }) {
  const l = fs(),
    d = String(t.id),
    y = t.implementation_type === "formula",
    p = (t.config?.expression || "").trim(),
    a = r.useMemo(() => Ze(t.parameters_schema), [t.parameters_schema]),
    w = r.useMemo(() => t.parameters_schema?.required ?? [], [t.parameters_schema?.required]),
    [o, h] = r.useState(() => ({ ...Ve(t.parameters_schema), ...Ge(d) })),
    [m, x] = r.useState(null),
    [A, C] = r.useState(null);
  (r.useEffect(() => {
    (h({ ...Ve(t.parameters_schema), ...Ge(d) }), x(null), C(null));
  }, [d, t.parameters_schema]),
    r.useEffect(() => {
      ca(d, o);
    }, [d, o]));
  const $ = r.useMemo(() => (!y || !p || !A ? null : js(p, A)), [y, p, A]),
    Q = () => {
      const _ = w.filter((N) => !o[N]?.trim());
      if (_.length) {
        i.error(`Completa los parámetros requeridos: ${_.join(", ")}`);
        return;
      }
      const g = bs(o, t.parameters_schema);
      (C(g),
        l.mutate(
          { id: d, parameters: g },
          {
            onSuccess: (N) => {
              (x(N),
                N.success ? i.success("Skill ejecutada") : i.error(N.error || "La skill falló"));
            },
            onError: (N) => {
              const u = N?.friendlyMessage || "No se pudo ejecutar";
              (i.error(u), x({ success: !1, error: u }));
            },
          },
        ));
    };
  return e.jsxs("section", {
    className: "space-y-5",
    children: [
      e.jsxs("div", {
        className:
          "flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h2", { className: "text-sm font-medium", children: "Probar skill" }),
              e.jsxs("p", {
                className: "text-xs text-muted-foreground mt-0.5",
                children: [
                  y
                    ? "Ingresá valores de prueba para cada variable y ejecutá la fórmula."
                    : "Ingresá los valores a mano (como si los entregara el LLM). En el agente, las fuentes (documento DATA / estático) se configuran al asignar.",
                  t.uses_personal_connection
                    ? " En prueba se usa tu cuenta de prueba o la cuenta de la instalación; en el agente, solo la de la instalación."
                    : "",
                ],
              }),
            ],
          }),
          e.jsxs(j, {
            type: "button",
            size: "sm",
            disabled: l.isPending,
            onClick: Q,
            children: [
              l.isPending
                ? e.jsx(V, { className: "h-4 w-4 mr-1.5 animate-spin" })
                : e.jsx(Qe, { className: "h-4 w-4 mr-1.5" }),
              "Ejecutar",
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "grid gap-4 lg:grid-cols-2",
        children: [
          e.jsx("div", {
            className: "space-y-3 min-w-0",
            children:
              a.length === 0
                ? e.jsx("p", {
                    className:
                      "text-xs text-muted-foreground rounded-lg border border-dashed px-3 py-6 text-center",
                    children: t.uses_personal_connection
                      ? "Sin parámetros de negocio. Se autenticará con tu cuenta de la Aplicación."
                      : "Esta skill no define parámetros. Puedes ejecutarla directo.",
                  })
                : a.map(([_, g]) => {
                    const N = ye(t.parameters_schema, _),
                      u = _e(g),
                      E = Se(g),
                      oe = Xe.find((R) => R.value === E),
                      X =
                        g.format === "password" || _.toLowerCase().includes("password")
                          ? "password"
                          : u === "date"
                            ? "date"
                            : u === "datetime"
                              ? "datetime-local"
                              : "text",
                      k = u === "integer" ? "numeric" : u === "number" ? "decimal" : void 0,
                      S = o[_] ?? "",
                      ee =
                        u === "date" && E !== "YYYY-MM-DD"
                          ? Ns(S, E) || (/^\d{4}-\d{2}-\d{2}$/.test(S) ? S : "")
                          : S,
                      D = g.description || (u === "date" ? oe?.example : vs[u]) || _;
                    return e.jsxs(
                      "div",
                      {
                        className: "space-y-1.5",
                        children: [
                          e.jsxs(v, {
                            className: "text-xs font-mono flex flex-wrap items-center gap-1.5",
                            children: [
                              _,
                              N && e.jsx("span", { className: "text-destructive", children: "*" }),
                              e.jsx("span", {
                                className: "text-[10px] text-muted-foreground font-normal",
                                children: es(g.type, g.format, g),
                              }),
                            ],
                          }),
                          e.jsx(Y, {
                            type: X,
                            inputMode: k,
                            autoComplete: "off",
                            value: ee,
                            onChange: (R) => h((L) => ({ ...L, [_]: R.target.value })),
                            placeholder: D,
                            className: "h-9 text-sm",
                          }),
                          e.jsxs("p", {
                            className: "text-[11px] text-muted-foreground",
                            children: [
                              g.description || we[u],
                              u === "date" && E !== "YYYY-MM-DD" ? ` Se enviará como ${E}.` : "",
                            ],
                          }),
                        ],
                      },
                      _,
                    );
                  }),
          }),
          e.jsxs("div", {
            className: "min-w-0 space-y-2",
            children: [
              e.jsx("p", {
                className: "text-xs font-medium text-muted-foreground",
                children: "Resultado",
              }),
              m
                ? e.jsxs("div", {
                    className: ce(
                      "rounded-lg border p-3 space-y-3 text-xs",
                      m.success
                        ? "border-primary/30 bg-primary/5"
                        : "border-destructive/30 bg-destructive/5",
                    ),
                    children: [
                      e.jsx("p", {
                        className: "font-medium",
                        children: m.success ? "Éxito" : "Error",
                      }),
                      y &&
                        p &&
                        e.jsxs("div", {
                          className: "space-y-2 rounded-md border bg-background/60 p-2.5",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                e.jsx("p", {
                                  className:
                                    "text-[10px] uppercase tracking-wide text-muted-foreground",
                                  children: "Fórmula",
                                }),
                                e.jsx("p", {
                                  className: "font-mono text-[11px] break-all",
                                  children: p,
                                }),
                              ],
                            }),
                            $ &&
                              e.jsxs("div", {
                                className: "space-y-1 border-t border-border/50 pt-2",
                                children: [
                                  e.jsx("p", {
                                    className:
                                      "text-[10px] uppercase tracking-wide text-muted-foreground",
                                    children: "Con valores",
                                  }),
                                  e.jsx("p", {
                                    className: "font-mono text-[11px] break-all text-primary",
                                    children: $,
                                  }),
                                ],
                              }),
                          ],
                        }),
                      m.error &&
                        e.jsx("p", {
                          className: "text-destructive whitespace-pre-wrap",
                          children: m.error,
                        }),
                      m.result != null &&
                        e.jsxs("div", {
                          className: "space-y-1",
                          children: [
                            y &&
                              e.jsx("p", {
                                className:
                                  "text-[10px] uppercase tracking-wide text-muted-foreground",
                                children: "Resultado",
                              }),
                            e.jsx("pre", {
                              className:
                                "max-h-72 overflow-auto rounded bg-background/60 p-2 font-mono text-[11px] whitespace-pre-wrap break-all",
                              children: Z(m.result),
                            }),
                          ],
                        }),
                    ],
                  })
                : e.jsx("div", {
                    className:
                      "rounded-lg border border-dashed px-4 py-10 text-center text-xs text-muted-foreground",
                    children: "Ejecuta la skill para ver el resultado aquí.",
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
function da({ skillId: t }) {
  const { data: l = [], isLoading: d, isFetching: y, refetch: p } = ys({ agentFunctionId: t }),
    [a, w] = r.useState(null);
  return e.jsxs("section", {
    className: "space-y-4",
    children: [
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h2", {
                className: "text-sm font-medium",
                children: "Historial de ejecuciones",
              }),
              e.jsx("p", {
                className: "text-xs text-muted-foreground mt-0.5",
                children:
                  "Ejecuciones de esta skill en la sucursal activa (pruebas, chat y canales). No es un historial global.",
              }),
            ],
          }),
          e.jsxs(j, {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: y,
            onClick: () => {
              p();
            },
            children: [
              y
                ? e.jsx(V, { className: "h-4 w-4 mr-1.5 animate-spin" })
                : e.jsx(ss, { className: "h-4 w-4 mr-1.5" }),
              "Actualizar",
            ],
          }),
        ],
      }),
      d
        ? e.jsx(as, { variant: "list", padded: !1, rows: 4 })
        : l.length === 0
          ? e.jsx("div", {
              className:
                "rounded-lg border border-dashed px-4 py-12 text-center text-sm text-muted-foreground",
              children: "Aún no hay ejecuciones de esta skill.",
            })
          : e.jsx("div", {
              className: "overflow-x-auto rounded-lg border",
              children: e.jsxs("table", {
                className: "w-full text-xs",
                children: [
                  e.jsx("thead", {
                    className: "bg-muted/40 text-muted-foreground",
                    children: e.jsxs("tr", {
                      className: "text-left",
                      children: [
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Cuándo" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Estado" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "HTTP" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Latencia" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Agente" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Origen" }),
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Detalle" }),
                      ],
                    }),
                  }),
                  e.jsx("tbody", {
                    className: "divide-y divide-border/60",
                    children: l.map((o) => {
                      const h = _s(o);
                      return e.jsxs(
                        "tr",
                        {
                          className: "hover:bg-muted/30 cursor-pointer",
                          onClick: () => w(o),
                          children: [
                            e.jsx("td", {
                              className: "px-3 py-2 whitespace-nowrap text-muted-foreground",
                              children: ts(o.created),
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2",
                              children: e.jsx(P, {
                                variant: o.success ? "default" : "destructive",
                                className: "text-[10px] font-normal",
                                children: o.success ? "OK" : "Error",
                              }),
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 font-mono tabular-nums",
                              children: o.status_code ?? "—",
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 tabular-nums text-muted-foreground",
                              children: rs(o.latency_ms),
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 text-muted-foreground max-w-[140px] truncate",
                              children: o.agent_name || "—",
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 text-muted-foreground",
                              children: ns(o.source),
                            }),
                            e.jsx("td", {
                              className: ce(
                                "px-3 py-2 max-w-[280px] truncate",
                                h ? "text-destructive" : "text-muted-foreground",
                              ),
                              children: h || o.endpoint_type || "Ver detalle",
                            }),
                          ],
                        },
                        o.id,
                      );
                    }),
                  }),
                ],
              }),
            }),
      e.jsx(ma, { log: a, onOpenChange: (o) => !o && w(null) }),
    ],
  });
}
function ma({ log: t, onOpenChange: l }) {
  if (!t) return null;
  const d = (t.error || "").trim();
  return e.jsx(Ss, {
    open: !!t,
    onOpenChange: l,
    children: e.jsxs(ws, {
      className: "w-full max-w-xl gap-4 p-4 sm:p-6 max-h-[min(90vh,720px)] overflow-y-auto",
      children: [
        e.jsx(Cs, {
          children: e.jsxs(Es, {
            className: "flex flex-wrap items-center gap-2",
            children: [
              "Detalle de ejecución",
              e.jsx(P, {
                variant: t.success ? "default" : "destructive",
                className: "text-[10px] font-normal",
                children: t.success ? "OK" : "Error",
              }),
            ],
          }),
        }),
        e.jsxs("div", {
          className: "grid grid-cols-2 gap-3 text-xs",
          children: [
            e.jsx(I, { label: "Cuándo", value: ts(t.created) }),
            e.jsx(I, { label: "Origen", value: ns(t.source) }),
            e.jsx(I, { label: "Agente", value: t.agent_name || "—" }),
            e.jsx(I, { label: "HTTP", value: t.status_code != null ? String(t.status_code) : "—" }),
            e.jsx(I, { label: "Latencia", value: rs(t.latency_ms) }),
            e.jsx(I, { label: "Endpoint", value: t.endpoint_type || "—" }),
            t.conversation_title &&
              e.jsx(I, {
                label: "Conversación",
                value: t.conversation_title,
                className: "col-span-2",
              }),
          ],
        }),
        d &&
          e.jsxs("div", {
            className: "rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1",
            children: [
              e.jsx("p", { className: "text-xs font-medium text-destructive", children: "Error" }),
              e.jsx("p", { className: "text-xs whitespace-pre-wrap break-words", children: d }),
            ],
          }),
        t.parameters &&
          Object.keys(t.parameters).length > 0 &&
          e.jsx(be, { title: "Parámetros", value: t.parameters }),
        t.response_payload != null &&
          Object.keys(t.response_payload).length > 0 &&
          e.jsx(be, { title: "Respuesta", value: t.response_payload }),
        t.request_payload != null &&
          Object.keys(t.request_payload).length > 0 &&
          e.jsx(be, { title: "Request", value: t.request_payload }),
      ],
    }),
  });
}
function I({ label: t, value: l, className: d }) {
  return e.jsxs("div", {
    className: ce("space-y-0.5", d),
    children: [
      e.jsx("p", { className: "text-[10px] text-muted-foreground", children: t }),
      e.jsx("p", { className: "font-medium break-words", children: l }),
    ],
  });
}
function be({ title: t, value: l }) {
  return e.jsxs("details", {
    className: "rounded-lg border bg-muted/20 px-3 py-2 text-xs open:pb-3",
    children: [
      e.jsx("summary", {
        className: "cursor-pointer font-medium text-muted-foreground",
        children: t,
      }),
      e.jsx("pre", {
        className:
          "mt-2 max-h-48 overflow-auto font-mono text-[11px] whitespace-pre-wrap break-all",
        children: Z(l),
      }),
    ],
  });
}
function ua(t) {
  if (!t) return "—";
  try {
    return new Date(t).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return t;
  }
}
function xa(t) {
  return t.agent_name ? t.agent_name : t.agent ? "Agente" : "Pruebas (sin agente)";
}
function pa({ skillId: t }) {
  const { data: l, isLoading: d, error: y } = Ps(t);
  if (d)
    return e.jsxs("div", {
      className: "flex items-center gap-2 text-xs text-muted-foreground py-3",
      children: [e.jsx(V, { className: "h-3.5 w-3.5 animate-spin" }), " Cargando uso…"],
    });
  if (y || !l) return null;
  const p = l.by_agent.slice(0, 8);
  return e.jsxs("section", {
    className: "space-y-4",
    children: [
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2",
        children: [
          e.jsxs("div", {
            children: [
              e.jsxs("h2", {
                className: "text-sm font-medium flex items-center gap-2",
                children: [e.jsx($e, { className: "h-4 w-4 text-primary" }), "Uso"],
              }),
              e.jsx("p", {
                className: "text-xs text-muted-foreground mt-0.5",
                children: "Ejecuciones registradas de esta skill (sin secretos).",
              }),
            ],
          }),
          e.jsxs("p", {
            className: "text-[11px] text-muted-foreground shrink-0",
            children: ["Última vez: ", ua(l.last_used_at)],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
        children: [
          e.jsx(le, {
            label: "Total",
            value: String(l.total),
            icon: e.jsx($e, { className: "h-3.5 w-3.5" }),
          }),
          e.jsx(le, {
            label: "Éxito",
            value: `${l.success_rate}%`,
            icon: e.jsx(As, { className: "h-3.5 w-3.5 text-primary" }),
          }),
          e.jsx(le, {
            label: "Errores",
            value: String(l.error_count),
            icon: e.jsx(ks, { className: "h-3.5 w-3.5 text-destructive" }),
          }),
          e.jsx(le, {
            label: "Latencia avg",
            value: `${l.avg_latency_ms} ms`,
            icon: e.jsx(Ds, { className: "h-3.5 w-3.5" }),
          }),
        ],
      }),
      p.length > 0 &&
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx("p", { className: "text-xs font-medium", children: "Por agente" }),
            e.jsx("div", {
              className: "overflow-x-auto rounded-lg border",
              children: e.jsxs("table", {
                className: "w-full text-xs",
                children: [
                  e.jsx("thead", {
                    className: "bg-muted/40 text-muted-foreground",
                    children: e.jsxs("tr", {
                      className: "text-left",
                      children: [
                        e.jsx("th", { className: "px-3 py-2 font-medium", children: "Agente" }),
                        e.jsx("th", {
                          className: "px-3 py-2 font-medium text-right tabular-nums",
                          children: "Total",
                        }),
                        e.jsx("th", {
                          className: "px-3 py-2 font-medium text-right tabular-nums",
                          children: "OK",
                        }),
                        e.jsx("th", {
                          className: "px-3 py-2 font-medium text-right tabular-nums",
                          children: "Errores",
                        }),
                        e.jsx("th", {
                          className:
                            "px-3 py-2 font-medium text-right tabular-nums hidden sm:table-cell",
                          children: "% éxito",
                        }),
                      ],
                    }),
                  }),
                  e.jsx("tbody", {
                    className: "divide-y divide-border/60",
                    children: p.map((a) => {
                      const w =
                          a.total > 0 ? Math.round((a.success_count / a.total) * 1e3) / 10 : 0,
                        o = a.error_count ?? Math.max(0, a.total - a.success_count);
                      return e.jsxs(
                        "tr",
                        {
                          className: "hover:bg-muted/20",
                          children: [
                            e.jsx("td", {
                              className: "px-3 py-2 font-medium max-w-[220px] truncate",
                              children: xa(a),
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 text-right tabular-nums text-muted-foreground",
                              children: a.total,
                            }),
                            e.jsx("td", {
                              className: "px-3 py-2 text-right tabular-nums text-primary",
                              children: a.success_count,
                            }),
                            e.jsx("td", {
                              className: ce(
                                "px-3 py-2 text-right tabular-nums",
                                o > 0 ? "text-destructive" : "text-muted-foreground",
                              ),
                              children: o,
                            }),
                            e.jsxs("td", {
                              className:
                                "px-3 py-2 text-right tabular-nums text-muted-foreground hidden sm:table-cell",
                              children: [w, "%"],
                            }),
                          ],
                        },
                        a.agent ?? "none",
                      );
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
      l.by_source.length > 0 &&
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx("p", { className: "text-xs font-medium", children: "Por origen" }),
            e.jsx("div", {
              className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
              children: l.by_source.map((a) =>
                e.jsxs(
                  "div",
                  {
                    className:
                      "rounded-lg border bg-muted/20 px-2.5 py-2 flex items-center justify-between gap-2",
                    children: [
                      e.jsx("span", {
                        className: "text-[11px] text-muted-foreground truncate",
                        children: Ls[a.source] || a.source,
                      }),
                      e.jsx("span", {
                        className: "text-sm font-semibold tabular-nums shrink-0",
                        children: a.total,
                      }),
                    ],
                  },
                  a.source,
                ),
              ),
            }),
          ],
        }),
    ],
  });
}
function le({ label: t, value: l, icon: d }) {
  return e.jsxs("div", {
    className: "rounded-lg border bg-muted/20 px-2.5 py-2 space-y-0.5",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-1 text-[10px] text-muted-foreground",
        children: [d, t],
      }),
      e.jsx("p", { className: "text-sm font-semibold tabular-nums", children: l }),
    ],
  });
}
const ha = new Set([
  "email",
  "password",
  "passwd",
  "username",
  "user",
  "login",
  "clave",
  "usuario",
  "api_key",
  "client_id",
  "client_secret",
]);
function ya() {
  const { id: t } = ps(),
    l = hs(),
    [d, y] = gs(),
    p = Ms(),
    { data: a, isLoading: w, error: o, refetch: h } = Ts(t),
    m = !!(a && Fs(a)),
    x = Is(),
    A = Rs(),
    C = Os(),
    [$, Q] = r.useState(""),
    [_, g] = r.useState(!1),
    { data: N = [] } = qs({ includeInactive: !1 }),
    u = d.get("tab"),
    E = u === "parametros" || u === "probar" || u === "historial" ? u : "configuracion",
    oe = (s) => {
      y(
        (n) => {
          const c = new URLSearchParams(n);
          return (s === "configuracion" ? c.delete("tab") : c.set("tab", s), c);
        },
        { replace: !0 },
      );
    },
    [X, k] = r.useState(!1),
    [S, ee] = r.useState(""),
    [D, R] = r.useState(""),
    [L, Ce] = r.useState(""),
    [se, Ee] = r.useState(""),
    [ae, Pe] = r.useState(!0),
    [O, Ae] = r.useState("api"),
    [M, ke] = r.useState(""),
    [te, de] = r.useState(""),
    [De, Le] = r.useState("{}"),
    [Me, Te] = r.useState("{}"),
    [me, Fe] = r.useState(""),
    [Ie, q] = r.useState(!1),
    [f, Re] = r.useState(null),
    [ue, xe] = r.useState(""),
    [K, pe] = r.useState("string"),
    [he, ge] = r.useState("YYYY-MM-DD"),
    [Oe, fe] = r.useState(""),
    [qe, je] = r.useState(!0),
    H = () => {
      (Re(null), xe(""), pe("string"), ge("YYYY-MM-DD"), fe(""), je(!0));
    },
    ls = () => {
      (H(), q(!0));
    },
    cs = (s, n) => {
      const c = _e(n);
      (Re(s),
        xe(s),
        pe(c),
        ge(Se(n)),
        fe(typeof n.description == "string" ? n.description : ""),
        je(ye(a?.parameters_schema, s)),
        q(!0));
    };
  r.useEffect(() => {
    a &&
      (ee(a.name),
      R(a.slug || ""),
      Ce(a.description || ""),
      Ee(a.response_instructions || ""),
      Pe(a.is_active !== !1),
      Ae(a.implementation_type || "api"),
      ke(a.external_api ? String(a.external_api) : ""),
      de(a.config?.endpoint_type || ""),
      Fe(a.config?.expression || ""),
      Le(Z(a.config ?? {})),
      Te(Z(a.parameters_schema ?? { type: "object", properties: {} })),
      k(!1));
  }, [a]);
  const ze = r.useMemo(
      () =>
        N.find((s) => String(s.id) === M) ||
        N.find((s) => String(s.id) === String(a?.external_api)),
      [N, M, a?.external_api],
    ),
    os = r.useMemo(() => Object.keys(ze?.endpoints ?? {}), [ze]),
    T = r.useMemo(() => Ze(a?.parameters_schema), [a?.parameters_schema]),
    Ne = r.useMemo(() => T.map(([s]) => s).filter(Boolean), [T]);
  if (w) return e.jsx(as, { variant: "studio" });
  if (o || !a)
    return e.jsxs("div", {
      className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4",
      children: [
        e.jsxs(j, {
          variant: "outline",
          size: "sm",
          onClick: () => l(-1),
          children: [e.jsx(Ke, { className: "h-4 w-4 mr-1.5" }), " Volver"],
        }),
        e.jsx("div", {
          className:
            "rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive text-sm",
          children: "Error al cargar la skill. Verifica permisos y que la API esté disponible.",
        }),
      ],
    });
  const ds = () => {
      if (!t) return;
      if (!S.trim() || !D.trim() || !L.trim()) {
        i.error("Nombre, slug y descripción son obligatorios");
        return;
      }
      if (O === "api") {
        if (!M) {
          i.error("Selecciona una Aplicación");
          return;
        }
        if (!te) {
          i.error("Selecciona un endpoint");
          return;
        }
        const c = a.config && typeof a.config == "object" ? a.config : {};
        x.mutate(
          {
            id: t,
            data: {
              name: S.trim(),
              slug: D.trim(),
              description: L.trim(),
              response_instructions: se.trim(),
              is_active: ae,
              implementation_type: "api",
              external_api: M,
              config: { ...c, endpoint_type: te },
            },
          },
          {
            onSuccess: () => {
              (i.success("Skill actualizada"), k(!1), h());
            },
            onError: (b) => i.error(b?.friendlyMessage || "No se pudo guardar"),
          },
        );
        return;
      }
      if (O === "formula") {
        if (!me.trim()) {
          i.error("La expresión de la fórmula es obligatoria");
          return;
        }
        const c = a.config && typeof a.config == "object" ? a.config : {};
        x.mutate(
          {
            id: t,
            data: {
              name: S.trim(),
              slug: D.trim(),
              description: L.trim(),
              response_instructions: se.trim(),
              is_active: ae,
              implementation_type: "formula",
              external_api: null,
              config: { ...c, expression: me.trim() },
            },
          },
          {
            onSuccess: () => {
              (i.success("Skill actualizada"), k(!1), h());
            },
            onError: (b) => i.error(b?.friendlyMessage || "No se pudo guardar"),
          },
        );
        return;
      }
      const s = We(De, "config");
      if (!s.ok) {
        i.error(s.error);
        return;
      }
      const n = We(Me, "parameters_schema");
      if (!n.ok) {
        i.error(n.error);
        return;
      }
      x.mutate(
        {
          id: t,
          data: {
            name: S.trim(),
            slug: D.trim(),
            description: L.trim(),
            response_instructions: se.trim(),
            is_active: ae,
            implementation_type: O,
            external_api: null,
            config: s.value,
            parameters_schema: n.value,
          },
        },
        {
          onSuccess: () => {
            (i.success("Skill actualizada"), k(!1), h());
          },
          onError: (c) => i.error(c?.friendlyMessage || "No se pudo guardar"),
        },
      );
    },
    ms = () => {
      if (!t || a.implementation_type !== "api") return;
      const s = a.config && typeof a.config == "object" ? a.config : {};
      x.mutate(
        {
          id: t,
          data: {
            implementation_type: "api",
            external_api: a.external_api ?? (M || null),
            config: { ...s, endpoint_type: a.config?.endpoint_type || te, parameter_sources: {} },
            parameters_schema: { type: "object", properties: {} },
          },
        },
        {
          onSuccess: () => {
            (i.success("Parámetros regenerados desde el endpoint"), h());
          },
          onError: (n) => i.error(n?.friendlyMessage || "No se pudo regenerar el schema"),
        },
      );
    },
    us = () => {
      if (!t || !a) return;
      const s = ue.trim().replace(/\s+/g, "_");
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) {
        i.error("Nombre inválido. Usa letras, números y _ (sin empezar con número).");
        return;
      }
      if (a.uses_personal_connection && ha.has(s.toLowerCase())) {
        i.error(
          "Esta skill usa la cuenta de la instalación. No agregues usuario/clave como parámetros; configura la cuenta en Instalación de la Aplicación.",
        );
        return;
      }
      const n = a.parameters_schema ?? { type: "object", properties: {} },
        c = { ...(n.properties ?? {}) };
      if (!f && c[s]) {
        i.error(`Ya existe el parámetro «${s}»`);
        return;
      }
      if (f && f !== s && c[s]) {
        i.error(`Ya existe el parámetro «${s}»`);
        return;
      }
      (f && f !== s && delete c[f], (c[s] = ia({ kind: K, description: Oe, dateFormat: he })));
      let b = Array.isArray(n.required) ? [...n.required] : [];
      (f && f !== s && (b = b.map((z) => (z === f ? s : z))),
        qe ? b.includes(s) || b.push(s) : (b = b.filter((z) => z !== s)));
      const B = { ...n, type: "object", properties: c, required: b };
      x.mutate(
        { id: t, data: { parameters_schema: B } },
        {
          onSuccess: () => {
            (i.success(f ? `Parámetro «${s}» actualizado` : `Parámetro «${s}» agregado`),
              H(),
              q(!1),
              h());
          },
          onError: (z) => i.error(z?.friendlyMessage || "No se pudo guardar"),
        },
      );
    },
    xs = (s) => {
      if (!t || !a) return;
      const n = a.parameters_schema ?? { type: "object", properties: {} },
        c = { ...(n.properties ?? {}) };
      delete c[s];
      const b = (Array.isArray(n.required) ? n.required : []).filter((B) => B !== s);
      x.mutate(
        {
          id: t,
          data: { parameters_schema: { ...n, type: "object", properties: c, required: b } },
        },
        {
          onSuccess: () => {
            (i.success(`Parámetro «${s}» eliminado`), f === s && (H(), q(!1)), h());
          },
          onError: (B) => i.error(B?.friendlyMessage || "No se pudo eliminar"),
        },
      );
    };
  return e.jsxs("div", {
    className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6",
    children: [
      e.jsxs("header", {
        className: "flex flex-col sm:flex-row sm:items-start gap-3",
        children: [
          e.jsx(j, {
            variant: "outline",
            size: "sm",
            asChild: !0,
            className: "self-start",
            children: e.jsxs(Ye, {
              to: "/app/skills",
              children: [e.jsx(Ke, { className: "h-4 w-4 mr-1.5" }), " Skills"],
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 min-w-0 flex items-start gap-3",
            children: [
              e.jsx("div", {
                className:
                  "h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20",
                children: e.jsx(zs, { className: "h-6 w-6", strokeWidth: 1.75 }),
              }),
              e.jsxs("div", {
                className: "min-w-0 flex-1",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                      e.jsx("h1", {
                        className: "text-xl md:text-2xl font-semibold tracking-tight truncate",
                        children: a.name,
                      }),
                      e.jsx(P, {
                        variant: a.is_active ? "default" : "secondary",
                        className: "text-[10px]",
                        children: a.is_active ? "Activa" : "Inactiva",
                      }),
                      e.jsx(P, {
                        variant: "outline",
                        className: "text-[10px] font-normal",
                        children: Ys[Vs(a.scope)] || "—",
                      }),
                      a.implementation_type &&
                        e.jsx(P, {
                          variant: "outline",
                          className: "text-[10px] font-normal",
                          children: ve[a.implementation_type] || a.implementation_type,
                        }),
                    ],
                  }),
                  e.jsxs("p", {
                    className: "text-sm text-muted-foreground truncate mt-0.5",
                    children: [
                      a.slug ?? "Sin slug",
                      a.external_api_name ? ` · ${a.external_api_name}` : "",
                      a.config?.endpoint_type ? ` · ${a.config.endpoint_type}` : "",
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex flex-wrap gap-2 self-start",
            children: [
              m &&
                E === "configuracion" &&
                e.jsxs(j, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => k((s) => !s),
                  children: [e.jsx(He, { className: "h-4 w-4 mr-1.5" }), X ? "Cancelar" : "Editar"],
                }),
              m &&
                a.is_active === !1 &&
                e.jsxs(j, {
                  variant: "outline",
                  size: "sm",
                  disabled: C.isPending,
                  onClick: () => {
                    t &&
                      C.mutate(t, {
                        onSuccess: (s) => {
                          (i.success(s.message || "Skill reactivada"), h());
                        },
                        onError: (s) => i.error(s?.friendlyMessage || "No se pudo reactivar"),
                      });
                  },
                  children: [
                    C.isPending
                      ? e.jsx(V, { className: "h-4 w-4 mr-1.5 animate-spin" })
                      : e.jsx(Be, { className: "h-4 w-4 mr-1.5" }),
                    "Reactivar",
                  ],
                }),
              m &&
                (a.is_active !== !1 || p) &&
                e.jsxs($s, {
                  open: _,
                  onOpenChange: (s) => {
                    (g(s), s || Q(""));
                  },
                  children: [
                    e.jsx(Ks, {
                      asChild: !0,
                      children: e.jsxs(j, {
                        variant: "outline",
                        size: "sm",
                        className: "text-destructive hover:text-destructive",
                        disabled: A.isPending,
                        children: [
                          e.jsx(Je, { className: "h-4 w-4 mr-1.5" }),
                          a.is_active === !1 ? "Borrar definitivo" : "Desactivar",
                        ],
                      }),
                    }),
                    e.jsxs(Hs, {
                      children: [
                        e.jsxs(Bs, {
                          children: [
                            e.jsx(Js, {
                              children:
                                a.is_active === !1
                                  ? "Borrar skill definitivamente"
                                  : "Desactivar skill",
                            }),
                            e.jsx(Us, {
                              asChild: !0,
                              children: e.jsx("div", {
                                className: "space-y-2 text-sm text-muted-foreground",
                                children:
                                  a.is_active === !1
                                    ? e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsxs("p", {
                                            children: [
                                              "«",
                                              a.name,
                                              "» ya está desactivada. Esto la borra de forma permanente y no se puede deshacer. Los agentes perderán la asignación.",
                                            ],
                                          }),
                                          e.jsxs("p", {
                                            children: [
                                              "Escribe el nombre exacto de la skill para confirmar:",
                                              " ",
                                              e.jsx("span", {
                                                className: "font-medium text-foreground",
                                                children: a.name,
                                              }),
                                            ],
                                          }),
                                          e.jsx(Y, {
                                            value: $,
                                            onChange: (s) => Q(s.target.value),
                                            placeholder: a.name,
                                            autoComplete: "off",
                                            className: "mt-1",
                                          }),
                                        ],
                                      })
                                    : e.jsxs("p", {
                                        children: [
                                          "«",
                                          a.name,
                                          "» se desactivará y dejará de estar disponible para los agentes. Puedes reactivarla después",
                                          p
                                            ? ". Solo se borra del todo si confirmas una segunda vez."
                                            : ".",
                                        ],
                                      }),
                              }),
                            }),
                          ],
                        }),
                        e.jsxs(Ws, {
                          children: [
                            e.jsx(Gs, { children: "Cancelar" }),
                            e.jsx(Zs, {
                              className:
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                              disabled:
                                A.isPending || (a.is_active === !1 && $.trim() !== a.name.trim()),
                              onClick: (s) => {
                                if ((s.preventDefault(), !t)) return;
                                const n = a.is_active === !1;
                                if (n && !p) {
                                  i.error(
                                    "Solo un super administrador puede borrar definitivamente",
                                  );
                                  return;
                                }
                                A.mutate(
                                  { id: t, permanent: n },
                                  {
                                    onSuccess: (c) => {
                                      if (c.action === "deleted") {
                                        (i.success(c.message || "Skill eliminada definitivamente"),
                                          g(!1),
                                          l("/app/skills"));
                                        return;
                                      }
                                      (i.success(c.message || "Skill desactivada"), g(!1), h());
                                    },
                                    onError: (c) =>
                                      i.error(
                                        c?.friendlyMessage || "No se pudo completar la acción",
                                      ),
                                  },
                                );
                              },
                              children:
                                a.is_active === !1 ? "Borrar definitivamente" : "Desactivar",
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
      !m &&
        e.jsxs("div", {
          className:
            "rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground",
          children: [
            "Skill de plataforma / de otro autor:",
            " ",
            e.jsx("span", { className: "font-medium text-foreground", children: "solo lectura" }),
            ". Puedes usarla en agentes; para cambios pídele al superadministrador o crea una skill propia.",
          ],
        }),
      a.is_active === !1 &&
        e.jsxs("div", {
          className:
            "rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between",
          children: [
            e.jsxs("p", {
              children: [
                "Esta skill está ",
                e.jsx("span", {
                  className: "font-medium text-foreground",
                  children: "desactivada",
                }),
                ". Los agentes no la usan.",
                m
                  ? p
                    ? " Puedes reactivarla o borrarla definitivamente."
                    : " Puedes reactivarla si fue un error."
                  : "",
              ],
            }),
            m &&
              e.jsx("div", {
                className: "flex flex-wrap gap-2 shrink-0",
                children: e.jsxs(j, {
                  size: "sm",
                  variant: "outline",
                  className: "h-7 text-xs",
                  disabled: C.isPending,
                  onClick: () => {
                    t &&
                      C.mutate(t, {
                        onSuccess: (s) => {
                          (i.success(s.message || "Skill reactivada"), h());
                        },
                        onError: (s) => i.error(s?.friendlyMessage || "No se pudo reactivar"),
                      });
                  },
                  children: [e.jsx(Be, { className: "h-3.5 w-3.5 mr-1" }), " Reactivar"],
                }),
              }),
          ],
        }),
      e.jsxs(Qs, {
        value: E,
        onValueChange: (s) => oe(s),
        className: "space-y-4",
        children: [
          e.jsxs(Xs, {
            className: "w-full sm:w-auto justify-start flex-wrap h-auto gap-1",
            children: [
              e.jsxs(re, {
                value: "configuracion",
                className: "gap-1.5",
                children: [e.jsx(ea, { className: "h-3.5 w-3.5" }), "Configuración"],
              }),
              e.jsxs(re, {
                value: "parametros",
                className: "gap-1.5",
                children: [
                  e.jsx(sa, { className: "h-3.5 w-3.5" }),
                  "Parámetros",
                  T.length > 0 &&
                    e.jsxs("span", {
                      className: "text-[10px] text-muted-foreground tabular-nums",
                      children: ["(", T.length, ")"],
                    }),
                ],
              }),
              e.jsxs(re, {
                value: "probar",
                className: "gap-1.5",
                children: [e.jsx(Qe, { className: "h-3.5 w-3.5" }), "Probar"],
              }),
              e.jsxs(re, {
                value: "historial",
                className: "gap-1.5",
                children: [e.jsx(aa, { className: "h-3.5 w-3.5" }), "Historial"],
              }),
            ],
          }),
          e.jsx(ne, {
            value: "configuracion",
            className: "mt-0",
            children: e.jsxs("section", {
              className: "rounded-xl border bg-card/60 p-4 md:p-5 space-y-4",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "text-sm font-medium", children: "Configuración" }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground mt-0.5",
                      children:
                        "Cómo se implementa la skill y a qué Aplicación/endpoint se conecta.",
                    }),
                  ],
                }),
                a.uses_personal_connection &&
                  e.jsxs("div", {
                    className:
                      "rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground space-y-1",
                    children: [
                      e.jsxs("p", {
                        className: "font-medium text-foreground",
                        children: [
                          "Esta skill usa la cuenta del owner en ",
                          a.external_api_name || "la Aplicación",
                          ".",
                        ],
                      }),
                      e.jsxs("p", {
                        children: [
                          "No agregues usuario ni clave como parámetros. Configurá la cuenta de la instalación en",
                          " ",
                          a.external_api
                            ? e.jsx(Ye, {
                                to: `/app/aplicaciones/${a.external_api}?tab=instalacion`,
                                className: "text-primary underline-offset-2 hover:underline",
                                children: "Instalación",
                              })
                            : "Aplicaciones → Instalación",
                          ".",
                        ],
                      }),
                    ],
                  }),
                X
                  ? e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Nombre" }),
                            e.jsx(Y, { value: S, onChange: (s) => ee(s.target.value) }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Slug" }),
                            e.jsx(Y, {
                              value: D,
                              onChange: (s) => R(s.target.value),
                              className: "font-mono text-sm",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Descripción (LLM)" }),
                            e.jsx(ie, { value: L, onChange: (s) => Ce(s.target.value), rows: 2 }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Instrucciones de respuesta" }),
                            e.jsx(ie, { value: se, onChange: (s) => Ee(s.target.value), rows: 2 }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Tipo" }),
                            e.jsxs(J, {
                              value: O,
                              onValueChange: (s) => Ae(s),
                              children: [
                                e.jsx(U, { children: e.jsx(W, {}) }),
                                e.jsx(G, {
                                  children: ta.map((s) =>
                                    e.jsx(F, { value: s, children: ve[s] }, s),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("label", {
                          className: "flex items-center gap-2 text-sm self-end pb-2",
                          children: [e.jsx(Ue, { checked: ae, onCheckedChange: Pe }), "Activa"],
                        }),
                        O === "api"
                          ? e.jsxs(e.Fragment, {
                              children: [
                                e.jsxs("div", {
                                  className: "space-y-2",
                                  children: [
                                    e.jsx(v, { children: "Aplicación" }),
                                    e.jsxs(J, {
                                      value: M || "__none__",
                                      onValueChange: (s) => {
                                        (ke(s === "__none__" ? "" : s), de(""));
                                      },
                                      children: [
                                        e.jsx(U, {
                                          children: e.jsx(W, { placeholder: "Selecciona" }),
                                        }),
                                        e.jsxs(G, {
                                          children: [
                                            e.jsx(F, { value: "__none__", children: "—" }),
                                            N.map((s) =>
                                              e.jsx(
                                                F,
                                                { value: String(s.id), children: s.name },
                                                s.id,
                                              ),
                                            ),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-2",
                                  children: [
                                    e.jsx(v, { children: "Endpoint" }),
                                    e.jsxs(J, {
                                      value: te || "__none__",
                                      onValueChange: (s) => de(s === "__none__" ? "" : s),
                                      disabled: !M,
                                      children: [
                                        e.jsx(U, {
                                          children: e.jsx(W, { placeholder: "Selecciona" }),
                                        }),
                                        e.jsxs(G, {
                                          children: [
                                            e.jsx(F, { value: "__none__", children: "—" }),
                                            os.map((s) => e.jsx(F, { value: s, children: s }, s)),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : O === "formula"
                            ? e.jsx(la, {
                                className: "md:col-span-2",
                                value: me,
                                onChange: Fe,
                                variables: Ne,
                                label: "Expresión (fórmula)",
                                emptyVariablesHint:
                                  "Agrega variables en la pestaña Parámetros para usarlas acá.",
                              })
                            : e.jsxs(e.Fragment, {
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2 md:col-span-2",
                                    children: [
                                      e.jsx(v, { children: "config (JSON)" }),
                                      e.jsx(ie, {
                                        value: De,
                                        onChange: (s) => Le(s.target.value),
                                        rows: 5,
                                        className: "font-mono text-xs",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2 md:col-span-2",
                                    children: [
                                      e.jsx(v, { children: "parameters_schema (JSON)" }),
                                      e.jsx(ie, {
                                        value: Me,
                                        onChange: (s) => Te(s.target.value),
                                        rows: 6,
                                        className: "font-mono text-xs",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                        e.jsx("div", {
                          className: "md:col-span-2",
                          children: e.jsxs(j, {
                            onClick: ds,
                            disabled: x.isPending,
                            children: [
                              x.isPending && e.jsx(V, { className: "mr-2 h-4 w-4 animate-spin" }),
                              "Guardar cambios",
                            ],
                          }),
                        }),
                      ],
                    })
                  : e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Nombre",
                            }),
                            e.jsx("p", { className: "font-medium", children: a.name }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Slug",
                            }),
                            e.jsx("p", {
                              className: "font-medium font-mono text-xs",
                              children: a.slug ?? "—",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Implementación",
                            }),
                            e.jsx("p", {
                              className: "font-medium",
                              children: a.implementation_type
                                ? ve[a.implementation_type] || a.implementation_type
                                : "—",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Aplicación",
                            }),
                            e.jsx("p", {
                              className: "font-medium",
                              children: a.external_api_name ?? a.external_api ?? "—",
                            }),
                          ],
                        }),
                        a.config?.endpoint_type &&
                          e.jsxs("div", {
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Endpoint",
                              }),
                              e.jsx("p", {
                                className: "font-medium font-mono text-xs",
                                children: a.config.endpoint_type,
                              }),
                            ],
                          }),
                        a.implementation_type === "formula" &&
                          a.config?.expression &&
                          e.jsxs("div", {
                            className: "md:col-span-2 space-y-1.5",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Expresión",
                              }),
                              e.jsx("p", {
                                className: "font-medium font-mono text-xs break-all",
                                children: a.config.expression,
                              }),
                              Ne.length > 0 &&
                                e.jsxs("div", {
                                  className: "flex flex-wrap items-center gap-1.5",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-[10px] text-muted-foreground",
                                      children: "Variables:",
                                    }),
                                    Ne.map((s) =>
                                      e.jsx(
                                        P,
                                        {
                                          variant: "outline",
                                          className: "text-[10px] font-mono",
                                          children: s,
                                        },
                                        s,
                                      ),
                                    ),
                                  ],
                                }),
                            ],
                          }),
                        a.description &&
                          e.jsxs("div", {
                            className: "md:col-span-2",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Descripción",
                              }),
                              e.jsx("p", { className: "font-medium", children: a.description }),
                            ],
                          }),
                        a.response_instructions &&
                          e.jsxs("div", {
                            className: "md:col-span-2",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Instrucciones de respuesta",
                              }),
                              e.jsx("p", {
                                className: "font-medium whitespace-pre-wrap",
                                children: a.response_instructions,
                              }),
                            ],
                          }),
                      ],
                    }),
              ],
            }),
          }),
          e.jsxs(ne, {
            value: "parametros",
            className: "mt-0 space-y-4",
            children: [
              e.jsxs("section", {
                className: "rounded-xl border bg-card/60 p-4 md:p-5 space-y-4",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("h2", {
                            className: "text-sm font-medium",
                            children: [
                              a.implementation_type === "formula" ? "Variables" : "Parámetros",
                              " (",
                              T.length,
                              ")",
                            ],
                          }),
                          e.jsx("p", {
                            className: "text-xs text-muted-foreground mt-0.5",
                            children:
                              a.implementation_type === "formula"
                                ? "Estos nombres son los que puedes usar en la expresión. Las fuentes (estático / documento DATA) se configuran al asignar desde el agente."
                                : "Schema que ve el LLM. Las fuentes (estático / documento DATA) se configuran al asignar la skill desde el agente.",
                          }),
                        ],
                      }),
                      m &&
                        e.jsxs("div", {
                          className: "flex flex-wrap gap-2 shrink-0",
                          children: [
                            a.implementation_type === "api" &&
                              e.jsxs(j, {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                disabled: x.isPending,
                                onClick: ms,
                                children: [
                                  e.jsx(ss, { className: "h-3.5 w-3.5 mr-1.5" }),
                                  "Regenerar desde endpoint",
                                ],
                              }),
                            e.jsxs(j, {
                              type: "button",
                              variant: "outline",
                              size: "sm",
                              onClick: () => {
                                Ie && !f ? (q(!1), H()) : ls();
                              },
                              children: [
                                e.jsx(ra, { className: "h-3.5 w-3.5 mr-1.5" }),
                                "Agregar parámetro",
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
                  m &&
                    Ie &&
                    e.jsxs("div", {
                      className: "rounded-lg border border-dashed p-3 space-y-3",
                      children: [
                        e.jsx("p", {
                          className: "text-xs font-medium",
                          children: f ? `Editar «${f}»` : "Nuevo parámetro",
                        }),
                        e.jsx("p", {
                          className: "text-xs text-muted-foreground",
                          children:
                            "Fecha se guarda como texto con el formato que elijas (útil para apps como Dentidesk).",
                        }),
                        e.jsxs("div", {
                          className: "grid gap-2 sm:grid-cols-2",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                e.jsx(v, { className: "text-[11px]", children: "Nombre" }),
                                e.jsx(Y, {
                                  className: "h-8 font-mono text-xs",
                                  value: ue,
                                  onChange: (s) => xe(s.target.value),
                                  placeholder: "fecha_cita",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "space-y-1",
                              children: [
                                e.jsx(v, { className: "text-[11px]", children: "Tipo" }),
                                e.jsxs(J, {
                                  value: K,
                                  onValueChange: (s) => pe(s),
                                  children: [
                                    e.jsx(U, { className: "h-8", children: e.jsx(W, {}) }),
                                    e.jsx(G, {
                                      children: [
                                        "string",
                                        "number",
                                        "integer",
                                        "boolean",
                                        "date",
                                        "datetime",
                                        "email",
                                      ].map((s) => e.jsx(F, { value: s, children: na[s] }, s)),
                                    }),
                                  ],
                                }),
                                e.jsx("p", {
                                  className: "text-[10px] text-muted-foreground",
                                  children: we[K],
                                }),
                              ],
                            }),
                            K === "date" &&
                              e.jsxs("div", {
                                className: "space-y-1 sm:col-span-2",
                                children: [
                                  e.jsx(v, {
                                    className: "text-[11px]",
                                    children: "Formato de envío",
                                  }),
                                  e.jsxs(J, {
                                    value: he,
                                    onValueChange: (s) => ge(s),
                                    children: [
                                      e.jsx(U, { className: "h-8", children: e.jsx(W, {}) }),
                                      e.jsx(G, {
                                        children: Xe.map((s) =>
                                          e.jsxs(
                                            F,
                                            {
                                              value: s.value,
                                              children: [s.label, " · ej. ", s.example],
                                            },
                                            s.value,
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                                  e.jsx("p", {
                                    className: "text-[10px] text-muted-foreground",
                                    children:
                                      "Se envía como string con este formato (no como objeto fecha).",
                                  }),
                                ],
                              }),
                            e.jsxs("div", {
                              className: "space-y-1 sm:col-span-2",
                              children: [
                                e.jsx(v, { className: "text-[11px]", children: "Descripción" }),
                                e.jsx(Y, {
                                  className: "h-8",
                                  value: Oe,
                                  onChange: (s) => fe(s.target.value),
                                  placeholder:
                                    K === "date"
                                      ? `Fecha en formato ${he}`
                                      : "Cómo debe interpretar el LLM este valor",
                                }),
                              ],
                            }),
                            e.jsxs("label", {
                              className: "flex items-center gap-2 text-xs sm:col-span-2",
                              children: [
                                e.jsx(Ue, { checked: qe, onCheckedChange: je }),
                                "Requerido",
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex flex-wrap gap-2",
                          children: [
                            e.jsxs(j, {
                              type: "button",
                              size: "sm",
                              disabled: x.isPending || !ue.trim(),
                              onClick: us,
                              children: [
                                x.isPending && e.jsx(V, { className: "mr-2 h-4 w-4 animate-spin" }),
                                f ? "Guardar cambios" : "Guardar parámetro",
                              ],
                            }),
                            e.jsx(j, {
                              type: "button",
                              size: "sm",
                              variant: "outline",
                              onClick: () => {
                                (H(), q(!1));
                              },
                              children: "Cancelar",
                            }),
                          ],
                        }),
                      ],
                    }),
                  T.length === 0
                    ? e.jsxs("div", {
                        className:
                          "rounded-lg border border-dashed px-4 py-8 text-center space-y-2",
                        children: [
                          e.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: "No hay parámetros definidos.",
                          }),
                          e.jsx("p", {
                            className: "text-xs text-muted-foreground max-w-md mx-auto",
                            children:
                              a.implementation_type === "api"
                                ? "Si el endpoint usa placeholders {{key}}, regenera desde el endpoint. Si no, agrega parámetros a mano."
                                : "Agrega parámetros a mano (para fórmulas, serán las variables de la expresión).",
                          }),
                        ],
                      })
                    : e.jsx("div", {
                        className: "space-y-2",
                        children: T.map(([s, n]) => {
                          const c = _e(n);
                          return e.jsxs(
                            "div",
                            {
                              className: "rounded-lg border p-3 space-y-1",
                              children: [
                                e.jsxs("div", {
                                  className: "flex flex-wrap items-center gap-2",
                                  children: [
                                    e.jsx("span", {
                                      className:
                                        "font-medium text-sm font-mono flex-1 min-w-0 truncate",
                                      children: s,
                                    }),
                                    e.jsx(P, {
                                      variant: "outline",
                                      className: "text-[10px]",
                                      children: es(n.type, n.format, n),
                                    }),
                                    ye(a.parameters_schema, s) &&
                                      e.jsx(P, {
                                        variant: "default",
                                        className: "text-[10px]",
                                        children: "Requerido",
                                      }),
                                    m &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx(j, {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-7 px-2",
                                            onClick: () => cs(s, n),
                                            children: e.jsx(He, { className: "h-3.5 w-3.5" }),
                                          }),
                                          e.jsx(j, {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-7 px-2 text-destructive",
                                            disabled: x.isPending,
                                            onClick: () => xs(s),
                                            children: e.jsx(Je, { className: "h-3.5 w-3.5" }),
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                e.jsxs("p", {
                                  className: "text-[10px] text-muted-foreground",
                                  children: [we[c], c === "date" ? ` · envío ${Se(n)}` : ""],
                                }),
                                n.description &&
                                  e.jsx("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: n.description,
                                  }),
                              ],
                            },
                            s,
                          );
                        }),
                      }),
                ],
              }),
              a.parameters_schema &&
                e.jsxs("details", {
                  className: "rounded-xl border bg-card/40 px-4 py-3 text-xs",
                  children: [
                    e.jsx("summary", {
                      className: "cursor-pointer text-muted-foreground",
                      children: "Ver parameters_schema raw",
                    }),
                    e.jsx("pre", {
                      className:
                        "mt-2 max-h-56 overflow-auto font-mono text-[11px] whitespace-pre-wrap",
                      children: Z(a.parameters_schema),
                    }),
                  ],
                }),
            ],
          }),
          e.jsx(ne, { value: "probar", className: "mt-0", children: e.jsx(oa, { skill: a }) }),
          e.jsxs(ne, {
            value: "historial",
            className: "mt-0 space-y-4",
            children: [e.jsx(pa, { skillId: String(a.id) }), e.jsx(da, { skillId: String(a.id) })],
          }),
        ],
      }),
    ],
  });
}
export { ya as default };
