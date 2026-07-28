import { af as K, ag as R, r as i, j as e, ah as b } from "./vendor-react-DUYfdZnL.js";
import {
  fz as W,
  i as P,
  d as A,
  j as Y,
  k as G,
  fj as L,
  A as V,
  B as x,
  M as U,
  U as c,
  H as $,
  a5 as H,
  V as y,
  W as X,
  X as Z,
  Y as J,
  Z as ee,
  $ as se,
  fA as T,
  fB as ae,
  fC as te,
  F as ne,
  a3 as re,
  a0 as p,
  fD as le,
  fE as k,
  a7 as h,
  dl as oe,
} from "./studio-chat-BBQUCckT.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function he() {
  const O = K(),
    [D] = R(),
    j = W(),
    _ = P(),
    F = A(),
    f = _ || F,
    { data: w = [], isLoading: ie } = Y({ enabled: f }),
    { data: E = [], isLoading: ce } = G(),
    o = i.useMemo(() => {
      const s = E.map((t) => ({ id: String(t.value), label: t.label }));
      if (f) {
        const t = w.map((a) => ({
          id: String(a.id),
          label: a.fantasy_name?.trim() || a.business_name?.trim() || `Sucursal ${a.id}`,
        }));
        return Array.from(new Map([...t, ...s].map((a) => [a.id, a])).values()).sort((a, l) =>
          a.label.localeCompare(l.label, "es", { sensitivity: "base" }),
        );
      }
      return s;
    }, [w, E, f]),
    [C, q] = i.useState(() => (o.length === 1 ? o[0].id : "")),
    [N, B] = i.useState(""),
    [d, m] = i.useState(""),
    [S, I] = i.useState(""),
    [n, z] = i.useState(() => {
      const s = D.get("type");
      return s && L.includes(s) ? s : "DOCUMENT";
    }),
    [g, u] = i.useState([{ question: "", answer: "" }]),
    M = (s) => {
      if (n === "FAQ" && s !== "FAQ") {
        const t = k(g);
        t && m(t);
      }
      (s === "FAQ" && n !== "FAQ" && u([{ question: "", answer: "" }]), z(s));
    },
    Q = (s) => {
      s.preventDefault();
      const t = n === "FAQ" ? k(g) : d.trim();
      if (!N.trim()) {
        h.error("El título es obligatorio");
        return;
      }
      if (!t.trim()) {
        h.error(
          n === "FAQ" ? "Agrega al menos una pregunta y respuesta" : "El contenido es obligatorio",
        );
        return;
      }
      const a = C || o[0]?.id || "",
        l = P() || A();
      if (!a && !l) {
        h.error("Selecciona una sucursal");
        return;
      }
      j.mutate(
        {
          title: N.trim(),
          content: t,
          knowledge_type: n,
          category: S.trim() || null,
          ...(a ? { branch: Number(a) } : {}),
          is_active: !0,
        },
        {
          onSuccess: (r) => {
            (h.success("Documento creado. Se indexará al asignarlo a un agente."),
              O(r?.id ? `/app/conocimiento/${r.id}` : "/app/conocimiento"));
          },
          onError: (r) => h.error(oe(r, "No se pudo crear el documento")),
        },
      );
    };
  return e.jsx(V, {
    className: "px-4 md:px-6 lg:px-8 py-4",
    children: e.jsxs("form", {
      onSubmit: Q,
      className: "flex flex-col gap-4",
      children: [
        e.jsxs("div", {
          className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          children: [
            e.jsxs("div", {
              className: "min-w-0 space-y-1.5",
              children: [
                e.jsx(x, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 -ml-2 text-muted-foreground",
                  asChild: !0,
                  children: e.jsxs(b, {
                    to: "/app/conocimiento",
                    children: [e.jsx(U, { className: "h-3.5 w-3.5 mr-1" }), " Conocimiento"],
                  }),
                }),
                e.jsx("h1", {
                  className: "text-xl font-semibold leading-tight",
                  children: "Nuevo conocimiento",
                }),
                e.jsxs("p", {
                  className: "text-sm text-muted-foreground max-w-2xl",
                  children: [
                    "Elige el tipo: el formulario se adapta. Las tablas de datos también se cargan desde",
                    " ",
                    e.jsx(b, {
                      to: "/app/conocimiento/datos",
                      className: "font-medium text-primary hover:underline",
                      children: "Datos",
                    }),
                    ".",
                    o.length === 1
                      ? e.jsxs(e.Fragment, {
                          children: [
                            " ",
                            "Se guarda en",
                            " ",
                            e.jsx("span", {
                              className: "font-medium text-foreground",
                              children: o[0].label,
                            }),
                            ".",
                          ],
                        })
                      : null,
                  ],
                }),
                o.length > 1 &&
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsx(c, { className: "text-xs shrink-0", children: "Sucursal" }),
                      e.jsx($, {
                        value: C,
                        onValueChange: q,
                        options: o,
                        includeAll: !0,
                        allValue: "",
                        allLabel: "Todas (organización)",
                        label: null,
                      }),
                    ],
                  }),
              ],
            }),
            e.jsxs("div", {
              className: "flex items-center gap-1.5 shrink-0",
              children: [
                e.jsx(x, {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  asChild: !0,
                  children: e.jsx(b, { to: "/app/conocimiento", children: "Cancelar" }),
                }),
                e.jsxs(x, {
                  type: "submit",
                  size: "sm",
                  disabled: j.isPending,
                  children: [
                    j.isPending && e.jsx(H, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }),
                    "Crear conocimiento",
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsx("div", {
          className: "flex flex-col gap-4",
          children: e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsx("div", {
                className: "rounded-xl border border-border/70 bg-card/60 p-4",
                children: e.jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(c, { htmlFor: "knowledge-title", children: "Título" }),
                        e.jsx(y, {
                          id: "knowledge-title",
                          value: N,
                          onChange: (s) => B(s.target.value),
                          placeholder: "Ej: Política de devoluciones",
                          required: !0,
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(c, {
                          htmlFor: "knowledge-category",
                          children: "Categoría (opcional)",
                        }),
                        e.jsx(y, {
                          id: "knowledge-category",
                          value: S,
                          onChange: (s) => I(s.target.value.slice(0, 80)),
                          placeholder: "Ej: Políticas, FAQ clínica…",
                          maxLength: 80,
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(c, { children: "Tipo" }),
                        e.jsxs(X, {
                          value: n,
                          onValueChange: (s) => M(s),
                          children: [
                            e.jsx(Z, { children: e.jsx(J, {}) }),
                            e.jsx(ee, {
                              children: L.map((s) => e.jsx(se, { value: s, children: T[s] }, s)),
                            }),
                          ],
                        }),
                        e.jsx("p", { className: "text-xs text-muted-foreground", children: ae[n] }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsxs("div", {
                className: "rounded-xl border border-border/70 bg-card/60 p-4 space-y-3",
                children: [
                  (() => {
                    const s = te[n];
                    return e.jsxs("div", {
                      className:
                        "flex items-center gap-2 text-sm font-medium text-foreground/90 border-b border-border/60 pb-3 mb-1",
                      children: [
                        s && e.jsx(s, { className: "h-4 w-4 text-primary" }),
                        e.jsx("span", { children: T[n] }),
                      ],
                    });
                  })(),
                  n === "FAQ"
                    ? e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground",
                                children: "Agrega pares de pregunta y respuesta",
                              }),
                              e.jsxs(x, {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                onClick: () => u((s) => [...s, { question: "", answer: "" }]),
                                children: [
                                  e.jsx(ne, { className: "h-3.5 w-3.5 mr-1" }),
                                  "Añadir par",
                                ],
                              }),
                            ],
                          }),
                          g.map((s, t) =>
                            e.jsxs(
                              "div",
                              {
                                className:
                                  "rounded-lg border border-border p-3 space-y-2 bg-muted/20",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center justify-between gap-2",
                                    children: [
                                      e.jsxs("span", {
                                        className: "text-xs font-medium text-muted-foreground",
                                        children: ["Par ", t + 1],
                                      }),
                                      g.length > 1 &&
                                        e.jsx(x, {
                                          type: "button",
                                          variant: "ghost",
                                          size: "icon",
                                          className: "h-7 w-7 text-destructive",
                                          onClick: () => u((a) => a.filter((l, r) => r !== t)),
                                          children: e.jsx(re, { className: "h-3.5 w-3.5" }),
                                        }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-1.5",
                                    children: [
                                      e.jsx(c, { className: "text-xs", children: "Pregunta" }),
                                      e.jsx(y, {
                                        value: s.question,
                                        onChange: (a) =>
                                          u((l) =>
                                            l.map((r, v) =>
                                              v === t ? { ...r, question: a.target.value } : r,
                                            ),
                                          ),
                                        placeholder: "¿Cuál es el horario de atención?",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-1.5",
                                    children: [
                                      e.jsx(c, { className: "text-xs", children: "Respuesta" }),
                                      e.jsx(p, {
                                        rows: 3,
                                        value: s.answer,
                                        onChange: (a) =>
                                          u((l) =>
                                            l.map((r, v) =>
                                              v === t ? { ...r, answer: a.target.value } : r,
                                            ),
                                          ),
                                        placeholder:
                                          "Atendemos de lunes a viernes de 9:00 a 18:00…",
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              t,
                            ),
                          ),
                        ],
                      })
                    : n === "POLICY"
                      ? e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(p, {
                              id: "knowledge-content",
                              rows: 12,
                              value: d,
                              onChange: (s) => m(s.target.value),
                              required: !0,
                              placeholder: "Describe la política: alcance, excepciones, vigencia…",
                              className: "font-mono text-sm min-h-[240px]",
                            }),
                            e.jsx("p", {
                              className: "text-[11px] text-muted-foreground",
                              children:
                                "Incluye el alcance, las excepciones y la vigencia. Se indexará al crear.",
                            }),
                          ],
                        })
                      : n === "PROCEDURE"
                        ? e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(p, {
                                id: "knowledge-content",
                                rows: 12,
                                value: d,
                                onChange: (s) => m(s.target.value),
                                required: !0,
                                placeholder: `Paso 1: …
Paso 2: …
Paso 3: …`,
                                className: "font-mono text-sm min-h-[240px]",
                              }),
                              e.jsx("p", {
                                className: "text-[11px] text-muted-foreground",
                                children:
                                  "Escribe los pasos en orden numerado. Se indexará al crear.",
                              }),
                            ],
                          })
                        : n === "API_DOC"
                          ? e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsx(p, {
                                  id: "knowledge-content",
                                  rows: 12,
                                  value: d,
                                  onChange: (s) => m(s.target.value),
                                  required: !0,
                                  placeholder:
                                    "Endpoint, método, parámetros y ejemplos de respuesta…",
                                  className: "font-mono text-sm min-h-[240px]",
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children:
                                    "Describe los endpoints, métodos y contratos de integración.",
                                }),
                              ],
                            })
                          : e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsx(p, {
                                  id: "knowledge-content",
                                  rows: 16,
                                  value: d,
                                  onChange: (s) => m(s.target.value),
                                  required: !0,
                                  placeholder: le[n] || "Escribe o pega el contenido…",
                                  className: "font-mono text-sm min-h-[320px]",
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children:
                                    "Puedes pegar texto largo desde Word o el navegador. Se indexará al crear.",
                                }),
                              ],
                            }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
export { he as default };
