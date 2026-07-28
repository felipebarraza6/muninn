import { r as l, j as e, af as $O, aF as jO, ah as Ze } from "./vendor-react-DUYfdZnL.js";
import {
  ei as _O,
  ej as Ke,
  ek as Qe,
  el as We,
  em as kO,
  S as zO,
  B as b,
  F as eO,
  en as we,
  V as D,
  c as ze,
  W as Y,
  X as A,
  Y as F,
  Z as I,
  $ as x,
  eo as te,
  a$ as XO,
  a3 as OO,
  ep as aO,
  eq as RO,
  d5 as WO,
  eh as rO,
  er as wO,
  es as NO,
  a5 as me,
  d4 as sO,
  et as nO,
  eu as UO,
  cR as tO,
  cZ as iO,
  ev as oO,
  a7 as p,
  ew as lO,
  ex as EO,
  U as z,
  ef as dO,
  ea as VO,
  ag as GO,
  k as ZO,
  cG as CO,
  ey as YO,
  af as Ce,
  ez as AO,
  eA as Pe,
  ee as ve,
  eB as FO,
  A as IO,
  M as DO,
  eg as LO,
  eC as qe,
  a0 as Ye,
  T as JO,
  N as HO,
  O as Ae,
  e6 as MO,
  a6 as BO,
  cJ as KO,
  Q as Fe,
  c4 as ea,
} from "./studio-chat-Bi-RYdat.js";
import {
  F as Oa,
  L as aa,
  E as pe,
  C as ra,
  s as sa,
  t as d,
  a as na,
  b as ta,
  i as ia,
  d as ye,
  f as oa,
  c as la,
  e as da,
  g as ca,
  N as Qa,
  I as ma,
  h as pa,
  j as U,
  R as ha,
  o as ua,
} from "./formula-expression-editor-BpTGI7wd.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const ga = "muninn:skill-versions:math:";
function cO(O) {
  return `${ga}${O || "new"}`;
}
function Xe(O) {
  try {
    const r = localStorage.getItem(cO(O));
    if (!r) return [];
    const a = JSON.parse(r);
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function xa(O, r) {
  try {
    localStorage.setItem(cO(O), JSON.stringify(r.slice(0, 40)));
  } catch {}
}
function Sa(O, r) {
  const s = [
    {
      id: r.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: r.createdAt || new Date().toISOString(),
      note: r.note || "",
      expression: r.expression,
      formulaParams: r.formulaParams,
      testValues: r.testValues,
      lastResult: r.lastResult,
    },
    ...Xe(O),
  ];
  return (xa(O, s), s);
}
function Ta({
  expression: O,
  onExpressionChange: r,
  params: a,
  onParamsChange: s,
  testValues: t,
  onTestValuesChange: c,
  draftKey: i = "new",
}) {
  const u = _O(),
    [Q, L] = l.useState(null),
    [j, W] = l.useState(null),
    [y, P] = l.useState(() => Xe(i)),
    [g, v] = l.useState(""),
    [S, f] = l.useState([]),
    [T, B] = l.useState([]),
    _ = l.useMemo(() => Ke(a), [a]),
    K = l.useMemo(() => Qe(a), [a]),
    J = l.useMemo(() => We(a), [a]),
    ue = K.required ?? [];
  (l.useEffect(() => {
    P(Xe(i));
  }, [i]),
    l.useEffect(() => {
      const o = {};
      for (const m of _) o[m] = t[m] ?? "";
      (Object.keys(o).length === Object.keys(t).length && Object.keys(o).every((m) => m in t)) ||
        c(o);
    }, [_.join("|")]));
  const C = l.useMemo(() => (!O.trim() || !j ? null : kO(O, j)), [O, j]),
    ge = l.useCallback(
      (o) => {
        o !== O && (f((h) => [...h.slice(-49), O]), B([]), r(o));
      },
      [O, r],
    ),
    ee = () => {
      if (!S.length) return;
      const o = S[S.length - 1];
      (f((h) => h.slice(0, -1)), B((h) => [...h, O]), r(o));
    },
    xe = () => {
      if (!T.length) return;
      const o = T[T.length - 1];
      (B((h) => h.slice(0, -1)), f((h) => [...h, O]), r(o));
    },
    q = () => {
      if (J.size > 0) {
        p.error("Hay variables con nombres duplicados");
        return;
      }
      if (_.length === 0) {
        p.error("Definí al menos una variable");
        return;
      }
      if (!O.trim()) {
        p.error("Escribe la expresión matemática");
        return;
      }
      const o = ue.filter((m) => !t[m]?.trim());
      if (o.length) {
        p.error(`Completa el valor de prueba para: ${o.join(", ")}`);
        return;
      }
      const h = lO(t, K);
      (W(h),
        u.mutate(
          { expression: O.trim(), parameters: h, parameters_schema: K },
          {
            onSuccess: (m) => {
              (L(m),
                m.success
                  ? p.success("Función evaluada")
                  : p.error(m.error || "La evaluación falló"));
            },
            onError: (m) => {
              const X = m?.friendlyMessage || "No se pudo evaluar";
              (p.error(X), L({ success: !1, error: X }));
            },
          },
        ));
    },
    Se = () => {
      const o = Sa(i, {
        note: g.trim() || `Análisis ${new Date().toLocaleString()}`,
        expression: O,
        formulaParams: a,
        testValues: t,
        lastResult: Q?.success ? Q.result : Q?.error,
      });
      (P(o), v(""), p.success("Versión guardada en la biblioteca"));
    },
    w = (o) => {
      (f((h) => [...h, O]),
        B([]),
        r(o.expression),
        s(o.formulaParams),
        c(o.testValues),
        p.success("Versión restaurada"));
    },
    ie = () => {
      s([...a, { name: `var_${a.length + 1}`, type: "number", description: "", required: !0 }]);
    },
    H = (o) => {
      a.length <= 1 || s(a.filter((h, m) => m !== o));
    },
    Oe = (o, h) => {
      s(a.map((m, X) => (X === o ? { ...m, ...h } : m)));
    };
  return e.jsxs("div", {
    className: "grid gap-8 xl:grid-cols-12 items-start py-1",
    children: [
      e.jsxs("div", {
        className: "xl:col-span-4 space-y-8",
        children: [
          e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                className: "flex items-center justify-between gap-3 border-b border-border/60 pb-3",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("h2", {
                        className: "text-sm font-semibold tracking-tight flex items-center gap-1.5",
                        children: [
                          e.jsx(zO, { className: "h-4 w-4 text-primary" }),
                          "Variables (entradas)",
                        ],
                      }),
                      e.jsx("p", {
                        className: "text-[11px] text-muted-foreground mt-0.5",
                        children: "Parámetros de la función matemática y valores de prueba.",
                      }),
                    ],
                  }),
                  e.jsxs(b, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "h-8 text-xs",
                    onClick: ie,
                    children: [e.jsx(eO, { className: "h-3.5 w-3.5 mr-1" }), " Nueva"],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "divide-y divide-border/50 max-h-[420px] overflow-y-auto pr-1",
                children: a.map((o, h) => {
                  const m = we(o.name),
                    X = J.has(h),
                    ae = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(m);
                  return e.jsxs(
                    "div",
                    {
                      className: ze(
                        "py-3 first:pt-0 space-y-2.5 transition-colors",
                        X && "bg-destructive/5 -mx-1 px-1 rounded-md",
                      ),
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-wrap items-center gap-2",
                          children: [
                            e.jsx(D, {
                              value: o.name,
                              onChange: ($) => Oe(h, { name: $.target.value }),
                              placeholder: "nombre",
                              className: ze(
                                "h-8 font-mono text-xs font-semibold flex-1 min-w-[100px]",
                                X && "border-destructive",
                              ),
                            }),
                            e.jsxs(Y, {
                              value: o.type,
                              onValueChange: ($) => Oe(h, { type: $ }),
                              children: [
                                e.jsx(A, {
                                  className: "h-8 w-[6.5rem] text-[11px]",
                                  children: e.jsx(F, {}),
                                }),
                                e.jsxs(I, {
                                  children: [
                                    e.jsx(x, { value: "number", children: te.number }),
                                    e.jsx(x, { value: "integer", children: te.integer }),
                                    e.jsx(x, { value: "string", children: te.string }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("label", {
                              className:
                                "flex items-center gap-1 text-[10px] text-muted-foreground",
                              children: [
                                e.jsx(XO, {
                                  checked: o.required,
                                  onCheckedChange: ($) => Oe(h, { required: !!$ }),
                                  className: "h-3.5 w-3.5",
                                }),
                                "Req.",
                              ],
                            }),
                            e.jsx(b, {
                              type: "button",
                              variant: "ghost",
                              size: "sm",
                              className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive",
                              disabled: a.length <= 1,
                              onClick: () => H(h),
                              children: e.jsx(OO, { className: "h-3.5 w-3.5" }),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "grid gap-2 sm:grid-cols-2",
                          children: [
                            e.jsx(D, {
                              value: o.description,
                              onChange: ($) => Oe(h, { description: $.target.value }),
                              placeholder: "Desc. para el agente",
                              className: "h-7 text-[11px]",
                            }),
                            e.jsx(D, {
                              value: t[m] ?? "",
                              onChange: ($) => c({ ...t, [m]: $.target.value }),
                              placeholder: o.description || aO[o.type],
                              className: "h-7 text-xs font-mono",
                              disabled: !ae,
                            }),
                          ],
                        }),
                      ],
                    },
                    h,
                  );
                }),
              }),
            ],
          }),
          e.jsxs("div", {
            className: "space-y-3",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-1.5 border-b border-border/60 pb-2",
                children: [
                  e.jsx(RO, { className: "h-4 w-4 text-primary" }),
                  e.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: "Biblioteca de análisis",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-2",
                children: [
                  e.jsx(D, {
                    value: g,
                    onChange: (o) => v(o.target.value),
                    placeholder: "Nota (opcional)",
                    className: "h-8 text-xs",
                  }),
                  e.jsxs(b, {
                    type: "button",
                    size: "sm",
                    className: "h-8 shrink-0",
                    onClick: Se,
                    children: [e.jsx(WO, { className: "h-3.5 w-3.5 mr-1" }), " Guardar"],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "max-h-48 overflow-y-auto divide-y divide-border/50",
                children:
                  y.length === 0
                    ? e.jsx("p", {
                        className: "text-[11px] text-muted-foreground italic py-2",
                        children:
                          "Guardá versiones mientras explorás la función antes de la final.",
                      })
                    : y.map((o) =>
                        e.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => w(o),
                            className:
                              "w-full text-left py-2 hover:bg-muted/35 -mx-1 px-1 rounded-md transition-colors",
                            children: [
                              e.jsx("p", {
                                className: "text-xs font-medium truncate",
                                children: o.note || "Sin nota",
                              }),
                              e.jsx("p", {
                                className: "text-[10px] text-muted-foreground font-mono truncate",
                                children: o.expression || "(vacía)",
                              }),
                              e.jsx("p", {
                                className: "text-[9px] text-muted-foreground/70 mt-0.5",
                                children: new Date(o.createdAt).toLocaleString(),
                              }),
                            ],
                          },
                          o.id,
                        ),
                      ),
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "xl:col-span-8 space-y-6",
        children: [
          e.jsxs("div", {
            className: "space-y-4",
            children: [
              e.jsxs("div", {
                className:
                  "flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("h2", {
                        className: "text-sm font-semibold tracking-tight flex items-center gap-1.5",
                        children: [
                          e.jsx(rO, { className: "h-4 w-4 text-primary" }),
                          "Función matemática",
                        ],
                      }),
                      e.jsx("p", {
                        className: "text-[11px] text-muted-foreground mt-0.5",
                        children:
                          "Armá la expresión línea a línea. Insertá variables y operadores desde la barra.",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      e.jsx(b, {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "h-8 w-8 p-0",
                        disabled: !S.length,
                        onClick: ee,
                        title: "Deshacer",
                        children: e.jsx(wO, { className: "h-3.5 w-3.5" }),
                      }),
                      e.jsx(b, {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "h-8 w-8 p-0",
                        disabled: !T.length,
                        onClick: xe,
                        title: "Rehacer",
                        children: e.jsx(NO, { className: "h-3.5 w-3.5" }),
                      }),
                      e.jsxs(b, {
                        type: "button",
                        size: "sm",
                        className: "h-8 font-semibold gap-1.5",
                        disabled: u.isPending,
                        onClick: q,
                        children: [
                          u.isPending
                            ? e.jsx(me, { className: "h-3.5 w-3.5 animate-spin" })
                            : e.jsx(sO, { className: "h-3.5 w-3.5 fill-current" }),
                          "Probar",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(Oa, {
                value: O,
                onChange: ge,
                variables: _,
                emptyVariablesHint: "Definí variables a la izquierda.",
              }),
            ],
          }),
          e.jsxs("div", {
            className:
              "rounded-lg border border-border/70 bg-zinc-950/90 overflow-hidden font-mono text-xs text-zinc-300",
            children: [
              e.jsxs("div", {
                className:
                  "border-b border-border/50 px-3 py-2 flex items-center justify-between bg-zinc-900/80",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsx(nO, { className: "h-3.5 w-3.5 text-zinc-400" }),
                      e.jsx("span", {
                        className: "text-[10px] font-bold tracking-wider text-zinc-400 uppercase",
                        children: "Consola de salida",
                      }),
                    ],
                  }),
                  e.jsx("span", {
                    className: "text-[9px] font-bold uppercase tracking-wider text-zinc-500",
                    children: u.isPending
                      ? "Evaluating"
                      : Q?.success
                        ? "Success"
                        : Q?.success === !1
                          ? "Error"
                          : "Idle",
                  }),
                ],
              }),
              e.jsx("div", {
                className: "p-4 min-h-[140px] max-h-[280px] overflow-auto space-y-3",
                children:
                  !Q && !u.isPending
                    ? e.jsxs("div", {
                        className:
                          "text-zinc-500 italic py-6 text-center text-[11px] flex flex-col items-center gap-2",
                        children: [
                          e.jsx(UO, { className: "h-4 w-4 opacity-50" }),
                          "Presioná Probar para evaluar la función con los valores de prueba.",
                        ],
                      })
                    : u.isPending
                      ? e.jsxs("div", {
                          className: "text-sky-400 animate-pulse flex items-center gap-2",
                          children: [
                            e.jsx(me, { className: "h-4 w-4 animate-spin" }),
                            " Evaluando…",
                          ],
                        })
                      : e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1 text-zinc-400",
                              children: [
                                e.jsxs("div", {
                                  className: "flex gap-1 flex-wrap",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-zinc-500",
                                      children: "fórmula:",
                                    }),
                                    e.jsx("code", {
                                      className: "text-sky-300 break-all",
                                      children: O.trim(),
                                    }),
                                  ],
                                }),
                                C &&
                                  e.jsxs("div", {
                                    className: "flex gap-1 flex-wrap",
                                    children: [
                                      e.jsx("span", {
                                        className: "text-zinc-500",
                                        children: "con valores:",
                                      }),
                                      e.jsx("code", {
                                        className: "text-amber-300 break-all",
                                        children: C,
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                            Q?.success
                              ? e.jsxs("div", {
                                  className:
                                    "flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded border border-zinc-800",
                                  children: [
                                    e.jsx(tO, { className: "h-3.5 w-3.5 text-emerald-400 mt-0.5" }),
                                    e.jsx("pre", {
                                      className:
                                        "text-sm font-bold text-emerald-400 break-all whitespace-pre-wrap",
                                      children: iO(Q.result),
                                    }),
                                  ],
                                })
                              : e.jsxs("div", {
                                  className:
                                    "flex items-start gap-2 bg-rose-950/20 p-2.5 rounded border border-rose-900/40 text-rose-400",
                                  children: [
                                    e.jsx(oO, { className: "h-3.5 w-3.5 mt-0.5" }),
                                    e.jsx("span", {
                                      className: "break-all whitespace-pre-wrap",
                                      children: Q?.error || "Error desconocido",
                                    }),
                                  ],
                                }),
                          ],
                        }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const fa = 1,
  QO = 194,
  mO = 195,
  Pa = 196,
  Ie = 197,
  va = 198,
  qa = 199,
  ya = 200,
  ba = 2,
  pO = 3,
  De = 201,
  $a = 24,
  ja = 25,
  _a = 49,
  ka = 50,
  za = 55,
  Xa = 56,
  Ra = 57,
  Wa = 59,
  wa = 60,
  Na = 61,
  Ua = 62,
  Ea = 63,
  Va = 65,
  Ga = 238,
  Za = 71,
  Ca = 241,
  Ya = 242,
  Aa = 243,
  Fa = 244,
  Ia = 245,
  Da = 246,
  La = 247,
  Ja = 248,
  hO = 72,
  Ha = 249,
  Ma = 250,
  Ba = 251,
  Ka = 252,
  er = 253,
  Or = 254,
  ar = 255,
  rr = 256,
  sr = 73,
  nr = 77,
  tr = 263,
  ir = 112,
  or = 130,
  lr = 151,
  dr = 152,
  cr = 155,
  M = 10,
  oe = 13,
  Ne = 32,
  he = 9,
  Ue = 35,
  Qr = 40,
  mr = 46,
  Re = 123,
  Le = 125,
  uO = 39,
  gO = 34,
  Je = 92,
  pr = 111,
  hr = 120,
  ur = 78,
  gr = 117,
  xr = 85,
  Sr = new Set([ja, _a, ka, tr, Va, or, Xa, Ra, Ga, Ua, Ea, hO, sr, nr, wa, Na, lr, dr, cr, ir]);
function be(O) {
  return O == M || O == oe;
}
function $e(O) {
  return (O >= 48 && O <= 57) || (O >= 65 && O <= 70) || (O >= 97 && O <= 102);
}
const Tr = new pe(
    (O, r) => {
      let a;
      if (O.next < 0) O.acceptToken(qa);
      else if (r.context.flags & de) be(O.next) && O.acceptToken(va, 1);
      else if (((a = O.peek(-1)) < 0 || be(a)) && r.canShift(Ie)) {
        let s = 0;
        for (; O.next == Ne || O.next == he; ) (O.advance(), s++);
        (O.next == M || O.next == oe || O.next == Ue) && O.acceptToken(Ie, -s);
      } else be(O.next) && O.acceptToken(Pa, 1);
    },
    { contextual: !0 },
  ),
  fr = new pe((O, r) => {
    let a = r.context;
    if (a.flags) return;
    let s = O.peek(-1);
    if (s == M || s == oe) {
      let t = 0,
        c = 0;
      for (;;) {
        if (O.next == Ne) t++;
        else if (O.next == he) t += 8 - (t % 8);
        else break;
        (O.advance(), c++);
      }
      t != a.indent &&
        O.next != M &&
        O.next != oe &&
        O.next != Ue &&
        (t < a.indent ? O.acceptToken(mO, -c) : O.acceptToken(QO));
    }
  }),
  de = 1,
  xO = 2,
  E = 4,
  V = 8,
  G = 16,
  Z = 32;
function ce(O, r, a) {
  ((this.parent = O),
    (this.indent = r),
    (this.flags = a),
    (this.hash = (O ? (O.hash + O.hash) << 8 : 0) + r + (r << 4) + a + (a << 6)));
}
const Pr = new ce(null, 0, 0);
function vr(O) {
  let r = 0;
  for (let a = 0; a < O.length; a++) r += O.charCodeAt(a) == he ? 8 - (r % 8) : 1;
  return r;
}
const He = new Map(
    [
      [Ca, 0],
      [Ya, E],
      [Aa, V],
      [Fa, V | E],
      [Ia, G],
      [Da, G | E],
      [La, G | V],
      [Ja, G | V | E],
      [Ha, Z],
      [Ma, Z | E],
      [Ba, Z | V],
      [Ka, Z | V | E],
      [er, Z | G],
      [Or, Z | G | E],
      [ar, Z | G | V],
      [rr, Z | G | V | E],
    ].map(([O, r]) => [O, r | xO]),
  ),
  qr = new ra({
    start: Pr,
    reduce(O, r, a, s) {
      return (O.flags & de && Sr.has(r)) || ((r == Za || r == hO) && O.flags & xO) ? O.parent : O;
    },
    shift(O, r, a, s) {
      return r == QO
        ? new ce(O, vr(s.read(s.pos, a.pos)), 0)
        : r == mO
          ? O.parent
          : r == $a || r == za || r == Wa || r == pO
            ? new ce(O, 0, de)
            : He.has(r)
              ? new ce(O, 0, He.get(r) | (O.flags & de))
              : O;
    },
    hash(O) {
      return O.hash;
    },
  }),
  yr = new pe((O) => {
    for (let r = 0; r < 5; r++) {
      if (O.next != "print".charCodeAt(r)) return;
      O.advance();
    }
    if (!/\w/.test(String.fromCharCode(O.next)))
      for (let r = 0; ; r++) {
        let a = O.peek(r);
        if (!(a == Ne || a == he)) {
          a != Qr && a != mr && a != M && a != oe && a != Ue && O.acceptToken(fa);
          return;
        }
      }
  }),
  br = new pe((O, r) => {
    let { flags: a } = r.context,
      s = a & E ? gO : uO,
      t = (a & V) > 0,
      c = !(a & G),
      i = (a & Z) > 0,
      u = O.pos;
    for (; !(O.next < 0); )
      if (i && O.next == Re)
        if (O.peek(1) == Re) O.advance(2);
        else {
          if (O.pos == u) {
            O.acceptToken(pO, 1);
            return;
          }
          break;
        }
      else if (c && O.next == Je) {
        if (O.pos == u) {
          O.advance();
          let Q = O.next;
          (Q >= 0 && (O.advance(), $r(O, Q)), O.acceptToken(ba));
          return;
        }
        break;
      } else if (O.next == Je && !c && O.peek(1) > -1) O.advance(2);
      else if (O.next == s && (!t || (O.peek(1) == s && O.peek(2) == s))) {
        if (O.pos == u) {
          O.acceptToken(De, t ? 3 : 1);
          return;
        }
        break;
      } else if (O.next == M) {
        if (t) O.advance();
        else if (O.pos == u) {
          O.acceptToken(De);
          return;
        }
        break;
      } else O.advance();
    O.pos > u && O.acceptToken(ya);
  });
function $r(O, r) {
  if (r == pr) for (let a = 0; a < 2 && O.next >= 48 && O.next <= 55; a++) O.advance();
  else if (r == hr) for (let a = 0; a < 2 && $e(O.next); a++) O.advance();
  else if (r == gr) for (let a = 0; a < 4 && $e(O.next); a++) O.advance();
  else if (r == xr) for (let a = 0; a < 8 && $e(O.next); a++) O.advance();
  else if (r == ur && O.next == Re) {
    for (O.advance(); O.next >= 0 && O.next != Le && O.next != uO && O.next != gO && O.next != M; )
      O.advance();
    O.next == Le && O.advance();
  }
}
const jr = sa({
    'async "*" "**" FormatConversion FormatSpec': d.modifier,
    "for while if elif else try except finally return raise break continue with pass assert await yield match case":
      d.controlKeyword,
    "in not and or is del": d.operatorKeyword,
    "from def class global nonlocal lambda": d.definitionKeyword,
    import: d.moduleKeyword,
    "with as print": d.keyword,
    Boolean: d.bool,
    None: d.null,
    VariableName: d.variableName,
    "CallExpression/VariableName": d.function(d.variableName),
    "FunctionDefinition/VariableName": d.function(d.definition(d.variableName)),
    "ClassDefinition/VariableName": d.definition(d.className),
    PropertyName: d.propertyName,
    "CallExpression/MemberExpression/PropertyName": d.function(d.propertyName),
    Comment: d.lineComment,
    Number: d.number,
    String: d.string,
    FormatString: d.special(d.string),
    Escape: d.escape,
    UpdateOp: d.updateOperator,
    "ArithOp!": d.arithmeticOperator,
    BitOp: d.bitwiseOperator,
    CompareOp: d.compareOperator,
    AssignOp: d.definitionOperator,
    Ellipsis: d.punctuation,
    At: d.meta,
    "( )": d.paren,
    "[ ]": d.squareBracket,
    "{ }": d.brace,
    ".": d.derefOperator,
    ", ;": d.separator,
  }),
  _r = {
    __proto__: null,
    await: 44,
    or: 54,
    and: 56,
    in: 60,
    not: 62,
    is: 64,
    if: 70,
    else: 72,
    lambda: 76,
    yield: 94,
    from: 96,
    async: 102,
    for: 104,
    None: 162,
    True: 164,
    False: 164,
    del: 178,
    pass: 182,
    break: 186,
    continue: 190,
    return: 194,
    raise: 202,
    import: 206,
    as: 208,
    global: 212,
    nonlocal: 214,
    assert: 218,
    type: 223,
    elif: 236,
    while: 240,
    try: 246,
    except: 248,
    finally: 250,
    with: 254,
    def: 258,
    class: 268,
    match: 279,
    case: 285,
  },
  kr = aa.deserialize({
    version: 14,
    states:
      "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
    stateData:
      "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
    goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
    nodeNames:
      "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
    maxTerm: 277,
    context: qr,
    nodeProps: [
      ["isolate", -5, 4, 71, 72, 73, 77, ""],
      [
        "group",
        -15,
        6,
        85,
        87,
        88,
        90,
        92,
        94,
        96,
        98,
        99,
        100,
        102,
        105,
        108,
        110,
        "Statement Statement",
        -22,
        8,
        18,
        21,
        25,
        40,
        49,
        50,
        56,
        57,
        60,
        61,
        62,
        63,
        64,
        67,
        70,
        71,
        72,
        79,
        80,
        81,
        82,
        "Expression",
        -10,
        114,
        116,
        119,
        121,
        122,
        126,
        128,
        133,
        135,
        138,
        "Statement",
        -9,
        143,
        144,
        147,
        148,
        150,
        151,
        152,
        153,
        154,
        "Pattern",
      ],
      ["openedBy", 23, "(", 54, "[", 58, "{"],
      ["closedBy", 24, ")", 55, "]", 59, "}"],
    ],
    propSources: [jr],
    skippedNodes: [0, 4],
    repeatNodeCount: 34,
    tokenData:
      "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
    tokenizers: [yr, fr, Tr, br, 0, 1, 2, 3, 4],
    topRules: { Script: [0, 5] },
    specialized: [{ term: 221, get: (O) => _r[O] || -1 }],
    tokenPrec: 7668,
  }),
  Me = new Qa(),
  SO = new Set([
    "Script",
    "Body",
    "FunctionDefinition",
    "ClassDefinition",
    "LambdaExpression",
    "ForStatement",
    "MatchClause",
  ]);
function le(O) {
  return (r, a, s) => {
    if (s) return !1;
    let t = r.node.getChild("VariableName");
    return (t && a(t, O), !0);
  };
}
const zr = {
  FunctionDefinition: le("function"),
  ClassDefinition: le("class"),
  ForStatement(O, r, a) {
    if (a) {
      for (let s = O.node.firstChild; s; s = s.nextSibling)
        if (s.name == "VariableName") r(s, "variable");
        else if (s.name == "in") break;
    }
  },
  ImportStatement(O, r) {
    var a, s;
    let { node: t } = O,
      c = ((a = t.firstChild) === null || a === void 0 ? void 0 : a.name) == "from";
    for (let i = t.getChild("import"); i; i = i.nextSibling)
      i.name == "VariableName" &&
        ((s = i.nextSibling) === null || s === void 0 ? void 0 : s.name) != "as" &&
        r(i, c ? "variable" : "namespace");
  },
  AssignStatement(O, r) {
    for (let a = O.node.firstChild; a; a = a.nextSibling)
      if (a.name == "VariableName") r(a, "variable");
      else if (a.name == ":" || a.name == "AssignOp") break;
  },
  ParamList(O, r) {
    for (let a = null, s = O.node.firstChild; s; s = s.nextSibling)
      (s.name == "VariableName" && (!a || !/\*|AssignOp/.test(a.name)) && r(s, "variable"),
        (a = s));
  },
  CapturePattern: le("variable"),
  AsPattern: le("variable"),
  __proto__: null,
};
function TO(O, r) {
  let a = Me.get(r);
  if (a) return a;
  let s = [],
    t = !0;
  function c(i, u) {
    let Q = O.sliceString(i.from, i.to);
    s.push({ label: Q, type: u });
  }
  return (
    r.cursor(ma.IncludeAnonymous).iterate((i) => {
      if (i.name) {
        let u = zr[i.name];
        if ((u && u(i, c, t)) || (!t && SO.has(i.name))) return !1;
        t = !1;
      } else if (i.to - i.from > 8192) {
        for (let u of TO(O, i.node)) s.push(u);
        return !1;
      }
    }),
    Me.set(r, s),
    s
  );
}
const Be = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/,
  fO = ["String", "FormatString", "Comment", "PropertyName"];
function Xr(O) {
  let r = da(O.state).resolveInner(O.pos, -1);
  if (fO.indexOf(r.name) > -1) return null;
  let a =
    r.name == "VariableName" || (r.to - r.from < 20 && Be.test(O.state.sliceDoc(r.from, r.to)));
  if (!a && !O.explicit) return null;
  let s = [];
  for (let t = r; t; t = t.parent) SO.has(t.name) && (s = s.concat(TO(O.state.doc, t)));
  return { options: s, from: a ? r.from : O.pos, validFor: Be };
}
const Rr = [
    "__annotations__",
    "__builtins__",
    "__debug__",
    "__doc__",
    "__import__",
    "__name__",
    "__loader__",
    "__package__",
    "__spec__",
    "False",
    "None",
    "True",
  ]
    .map((O) => ({ label: O, type: "constant" }))
    .concat(
      [
        "ArithmeticError",
        "AssertionError",
        "AttributeError",
        "BaseException",
        "BlockingIOError",
        "BrokenPipeError",
        "BufferError",
        "BytesWarning",
        "ChildProcessError",
        "ConnectionAbortedError",
        "ConnectionError",
        "ConnectionRefusedError",
        "ConnectionResetError",
        "DeprecationWarning",
        "EOFError",
        "Ellipsis",
        "EncodingWarning",
        "EnvironmentError",
        "Exception",
        "FileExistsError",
        "FileNotFoundError",
        "FloatingPointError",
        "FutureWarning",
        "GeneratorExit",
        "IOError",
        "ImportError",
        "ImportWarning",
        "IndentationError",
        "IndexError",
        "InterruptedError",
        "IsADirectoryError",
        "KeyError",
        "KeyboardInterrupt",
        "LookupError",
        "MemoryError",
        "ModuleNotFoundError",
        "NameError",
        "NotADirectoryError",
        "NotImplemented",
        "NotImplementedError",
        "OSError",
        "OverflowError",
        "PendingDeprecationWarning",
        "PermissionError",
        "ProcessLookupError",
        "RecursionError",
        "ReferenceError",
        "ResourceWarning",
        "RuntimeError",
        "RuntimeWarning",
        "StopAsyncIteration",
        "StopIteration",
        "SyntaxError",
        "SyntaxWarning",
        "SystemError",
        "SystemExit",
        "TabError",
        "TimeoutError",
        "TypeError",
        "UnboundLocalError",
        "UnicodeDecodeError",
        "UnicodeEncodeError",
        "UnicodeError",
        "UnicodeTranslateError",
        "UnicodeWarning",
        "UserWarning",
        "ValueError",
        "Warning",
        "ZeroDivisionError",
      ].map((O) => ({ label: O, type: "type" })),
    )
    .concat(
      [
        "bool",
        "bytearray",
        "bytes",
        "classmethod",
        "complex",
        "float",
        "frozenset",
        "int",
        "list",
        "map",
        "memoryview",
        "object",
        "range",
        "set",
        "staticmethod",
        "str",
        "super",
        "tuple",
        "type",
      ].map((O) => ({ label: O, type: "class" })),
    )
    .concat(
      [
        "abs",
        "aiter",
        "all",
        "anext",
        "any",
        "ascii",
        "bin",
        "breakpoint",
        "callable",
        "chr",
        "compile",
        "delattr",
        "dict",
        "dir",
        "divmod",
        "enumerate",
        "eval",
        "exec",
        "exit",
        "filter",
        "format",
        "getattr",
        "globals",
        "hasattr",
        "hash",
        "help",
        "hex",
        "id",
        "input",
        "isinstance",
        "issubclass",
        "iter",
        "len",
        "license",
        "locals",
        "max",
        "min",
        "next",
        "oct",
        "open",
        "ord",
        "pow",
        "print",
        "property",
        "quit",
        "repr",
        "reversed",
        "round",
        "setattr",
        "slice",
        "sorted",
        "sum",
        "vars",
        "zip",
      ].map((O) => ({ label: O, type: "function" })),
    ),
  Wr = [
    U("def ${name}(${params}):\n	${}", { label: "def", detail: "function", type: "keyword" }),
    U("for ${name} in ${collection}:\n	${}", { label: "for", detail: "loop", type: "keyword" }),
    U("while ${}:\n	${}", { label: "while", detail: "loop", type: "keyword" }),
    U("try:\n	${}\nexcept ${error}:\n	${}", {
      label: "try",
      detail: "/ except block",
      type: "keyword",
    }),
    U(
      `if \${}:
	
`,
      { label: "if", detail: "block", type: "keyword" },
    ),
    U("if ${}:\n	${}\nelse:\n	${}", { label: "if", detail: "/ else block", type: "keyword" }),
    U("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
      label: "class",
      detail: "definition",
      type: "keyword",
    }),
    U("import ${module}", { label: "import", detail: "statement", type: "keyword" }),
    U("from ${module} import ${names}", { label: "from", detail: "import", type: "keyword" }),
  ],
  wr = ca(fO, pa(Rr.concat(Wr)));
function je(O) {
  let { node: r, pos: a } = O,
    s = O.lineIndent(a, -1),
    t = null;
  for (;;) {
    let c = r.childBefore(a);
    if (c)
      if (c.name == "Comment") a = c.from;
      else if (c.name == "Body" || c.name == "MatchBody")
        (O.baseIndentFor(c) + O.unit <= s && (t = c), (r = c));
      else if (c.name == "MatchClause") r = c;
      else if (c.type.is("Statement")) r = c;
      else break;
    else break;
  }
  return t;
}
function _e(O, r) {
  let a = O.baseIndentFor(r),
    s = O.lineAt(O.pos, -1),
    t = s.from + s.text.length;
  return (/^\s*($|#)/.test(s.text) &&
    O.node.to < t + 100 &&
    !/\S/.test(O.state.sliceDoc(t, O.node.to)) &&
    O.lineIndent(O.pos, -1) <= a) ||
    (/^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(O.textAfter) &&
      O.lineIndent(O.pos, -1) > a)
    ? null
    : a + O.unit;
}
const ke = ta.define({
  name: "python",
  parser: kr.configure({
    props: [
      ia.add({
        Body: (O) => {
          var r;
          let a = (/^\s*(#|$)/.test(O.textAfter) && je(O)) || O.node;
          return (r = _e(O, a)) !== null && r !== void 0 ? r : O.continue();
        },
        MatchBody: (O) => {
          var r;
          let a = je(O);
          return (r = _e(O, a || O.node)) !== null && r !== void 0 ? r : O.continue();
        },
        IfStatement: (O) => (/^\s*(else:|elif )/.test(O.textAfter) ? O.baseIndent : O.continue()),
        "ForStatement WhileStatement": (O) =>
          /^\s*else:/.test(O.textAfter) ? O.baseIndent : O.continue(),
        TryStatement: (O) =>
          /^\s*(except[ :]|finally:|else:)/.test(O.textAfter) ? O.baseIndent : O.continue(),
        MatchStatement: (O) =>
          /^\s*case /.test(O.textAfter) ? O.baseIndent + O.unit : O.continue(),
        "TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": ye({
          closing: ")",
        }),
        "DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression":
          ye({ closing: "}" }),
        "ArrayExpression ArrayComprehensionExpression": ye({ closing: "]" }),
        MemberExpression: (O) => O.baseIndent + O.unit,
        "String FormatString": () => null,
        Script: (O) => {
          var r;
          let a = je(O);
          return (r = a && _e(O, a)) !== null && r !== void 0 ? r : O.continue();
        },
      }),
      oa.add({
        "ArrayExpression DictionaryExpression SetExpression TupleExpression": la,
        Body: (O, r) => ({ from: O.from + 1, to: O.to - (O.to == r.doc.length ? 0 : 1) }),
        "String FormatString": (O, r) => ({ from: r.doc.lineAt(O.from).to, to: O.to }),
      }),
    ],
  }),
  languageData: {
    closeBrackets: {
      brackets: ["(", "[", "{", "'", '"', "'''", '"""'],
      stringPrefixes: [
        "f",
        "fr",
        "rf",
        "r",
        "u",
        "b",
        "br",
        "rb",
        "F",
        "FR",
        "RF",
        "R",
        "U",
        "B",
        "BR",
        "RB",
      ],
    },
    commentTokens: { line: "#" },
    indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:|case\s+[^:]*:?)$/,
  },
});
function Nr() {
  return new na(ke, [ke.data.of({ autocomplete: Xr }), ke.data.of({ autocomplete: wr })]);
}
const Ur = `def main(a=0, b=0):
    """Función de entrada: recibe los parámetros de la skill."""
    return a + b
`;
function Er({
  code: O,
  onCodeChange: r,
  params: a,
  onParamsChange: s,
  testValues: t,
  onTestValuesChange: c,
}) {
  const i = EO(),
    [u, Q] = l.useState(null),
    L = l.useMemo(() => Ke(a), [a]),
    j = l.useMemo(() => Qe(a), [a]),
    W = l.useMemo(() => We(a), [a]);
  (l.useEffect(() => {
    O.trim() || r(Ur);
  }, []),
    l.useEffect(() => {
      const P = {};
      for (const v of L) P[v] = t[v] ?? "";
      (Object.keys(P).length === Object.keys(t).length && Object.keys(P).every((v) => v in t)) ||
        c(P);
    }, [L.join("|")]));
  const y = () => {
    if (W.size > 0) {
      p.error("Hay variables con nombres duplicados");
      return;
    }
    if (!O.trim()) {
      p.error("Escribe el código Python");
      return;
    }
    const P = lO(t, j);
    i.mutate(
      { code: O.trim(), entry: "main", parameters: P, parameters_schema: j },
      {
        onSuccess: (g) => {
          (Q(g),
            g.success ? p.success("Código ejecutado") : p.error(g.error || "Falló la ejecución"));
        },
        onError: (g) => {
          const v = g?.friendlyMessage || "No se pudo ejecutar";
          (p.error(v), Q({ success: !1, error: v }));
        },
      },
    );
  };
  return e.jsxs("div", {
    className: "grid gap-8 lg:grid-cols-12 items-start",
    children: [
      e.jsx("div", {
        className: "lg:col-span-4 space-y-4",
        children: e.jsxs("div", {
          className: "space-y-3",
          children: [
            e.jsxs("div", {
              className: "flex items-center justify-between border-b border-border/60 pb-2",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "text-sm font-semibold", children: "Parámetros" }),
                    e.jsx("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: "Entradas de `main(...)`",
                    }),
                  ],
                }),
                e.jsxs(b, {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-8 text-xs",
                  onClick: () =>
                    s([
                      ...a,
                      {
                        name: `arg_${a.length + 1}`,
                        type: "number",
                        description: "",
                        required: !0,
                      },
                    ]),
                  children: [e.jsx(eO, { className: "h-3.5 w-3.5 mr-1" }), " Agregar"],
                }),
              ],
            }),
            e.jsx("div", {
              className: "divide-y divide-border/50 max-h-[360px] overflow-y-auto",
              children: a.map((P, g) => {
                const v = we(P.name);
                return e.jsxs(
                  "div",
                  {
                    className: "py-2.5 first:pt-0 space-y-2",
                    children: [
                      e.jsxs("div", {
                        className: "flex gap-1.5",
                        children: [
                          e.jsx(D, {
                            value: P.name,
                            onChange: (S) =>
                              s(a.map((f, T) => (T === g ? { ...f, name: S.target.value } : f))),
                            className: "h-8 font-mono text-xs",
                            placeholder: "nombre",
                          }),
                          e.jsxs(Y, {
                            value: P.type,
                            onValueChange: (S) =>
                              s(a.map((f, T) => (T === g ? { ...f, type: S } : f))),
                            children: [
                              e.jsx(A, {
                                className: "h-8 w-24 text-[11px]",
                                children: e.jsx(F, {}),
                              }),
                              e.jsxs(I, {
                                children: [
                                  e.jsx(x, { value: "number", children: te.number }),
                                  e.jsx(x, { value: "integer", children: te.integer }),
                                  e.jsx(x, { value: "string", children: te.string }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx(b, {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            className: "h-8 w-8 p-0",
                            disabled: a.length <= 1,
                            onClick: () => s(a.filter((S, f) => f !== g)),
                            children: e.jsx(OO, { className: "h-3.5 w-3.5" }),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx(z, {
                            className: "text-[10px] text-muted-foreground",
                            children: "Valor de prueba",
                          }),
                          e.jsx(D, {
                            value: t[v] ?? "",
                            onChange: (S) => c({ ...t, [v]: S.target.value }),
                            className: "h-7 font-mono text-xs",
                            placeholder: aO[P.type],
                          }),
                        ],
                      }),
                    ],
                  },
                  g,
                );
              }),
            }),
          ],
        }),
      }),
      e.jsxs("div", {
        className: "lg:col-span-8 space-y-6",
        children: [
          e.jsxs("div", {
            className: "space-y-3",
            children: [
              e.jsxs("div", {
                className: "flex items-center justify-between border-b border-border/60 pb-2",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("h2", {
                        className: "text-sm font-semibold flex items-center gap-1.5",
                        children: [
                          e.jsx(dO, { className: "h-4 w-4 text-primary" }),
                          "Editor Python",
                        ],
                      }),
                      e.jsxs("p", {
                        className: "text-[11px] text-muted-foreground",
                        children: [
                          "Definí ",
                          e.jsx("code", { className: "text-[10px]", children: "def main(...)" }),
                          " — se ejecuta de forma acotada.",
                        ],
                      }),
                    ],
                  }),
                  e.jsxs(b, {
                    type: "button",
                    size: "sm",
                    className: "h-8 gap-1.5",
                    disabled: i.isPending,
                    onClick: y,
                    children: [
                      i.isPending
                        ? e.jsx(me, { className: "h-3.5 w-3.5 animate-spin" })
                        : e.jsx(sO, { className: "h-3.5 w-3.5 fill-current" }),
                      "Probar código",
                    ],
                  }),
                ],
              }),
              e.jsx("div", {
                className: "rounded-md border border-border/70 overflow-hidden",
                children: e.jsx(ha, {
                  value: O,
                  height: "320px",
                  theme: ua,
                  extensions: [Nr()],
                  onChange: r,
                  basicSetup: {
                    lineNumbers: !0,
                    foldGutter: !0,
                    highlightActiveLine: !0,
                    bracketMatching: !0,
                  },
                }),
              }),
            ],
          }),
          e.jsxs("div", {
            className:
              "rounded-lg border border-border/70 bg-zinc-950/90 overflow-hidden font-mono text-xs text-zinc-300",
            children: [
              e.jsxs("div", {
                className:
                  "border-b border-border/50 px-3 py-2 flex items-center gap-2 bg-zinc-900/80",
                children: [
                  e.jsx(nO, { className: "h-3.5 w-3.5 text-zinc-400" }),
                  e.jsx("span", {
                    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-400",
                    children: "Output",
                  }),
                ],
              }),
              e.jsx("div", {
                className: "p-4 min-h-[100px]",
                children: u
                  ? u.success
                    ? e.jsxs("div", {
                        className: "flex gap-2 text-emerald-400",
                        children: [
                          e.jsx(tO, { className: "h-3.5 w-3.5 mt-0.5" }),
                          e.jsx("pre", {
                            className: "whitespace-pre-wrap break-all",
                            children: iO(u.result),
                          }),
                        ],
                      })
                    : e.jsxs("div", {
                        className: ze("flex gap-2 text-rose-400"),
                        children: [
                          e.jsx(oO, { className: "h-3.5 w-3.5 mt-0.5" }),
                          e.jsx("span", {
                            className: "whitespace-pre-wrap break-all",
                            children: u.error,
                          }),
                        ],
                      })
                  : e.jsx("p", {
                      className: "text-zinc-500 italic text-[11px]",
                      children: "Sin ejecución todavía.",
                    }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Ee = "muninn:skill-draft:formula",
  Vr = [
    { name: "a", type: "number", description: "", required: !0 },
    { name: "b", type: "number", description: "", required: !0 },
  ];
function Gr() {
  try {
    const O = localStorage.getItem(Ee);
    if (!O) return null;
    const r = JSON.parse(O);
    return r && typeof r == "object" ? r : null;
  } catch {
    return null;
  }
}
function Zr(O) {
  try {
    localStorage.setItem(Ee, JSON.stringify(O));
  } catch {}
}
function Cr() {
  try {
    localStorage.removeItem(Ee);
  } catch {}
}
function Jr() {
  const O = $O(),
    r = VO(),
    { data: a = [] } = GO({ includeInactive: !1 }),
    { data: s = [] } = ZO(),
    { data: t = [] } = CO({ is_active: !0 }),
    c = YO(),
    i = l.useMemo(() => Gr(), []),
    u = !!(
      i &&
      (i.name || i.expression || (Array.isArray(i.formulaParams) && i.formulaParams.length > 0))
    ),
    [Q, L] = l.useState(() => (u ? "formula" : "api")),
    [j, W] = l.useState(() => {
      const n = i?.formulaTab;
      return n === "parametros" || n === "trabajar" ? "trabajar" : "configuracion";
    }),
    [y, P] = l.useState(() => i?.skillScope || "branch"),
    [g, v] = l.useState(() => i?.agentId || ""),
    [S, f] = l.useState(() => i?.branchId || Ce() || ""),
    [T, B] = l.useState(() => i?.name || ""),
    [_, K] = l.useState(() => i?.slug || ""),
    [J, ue] = l.useState(() => !!i?.slugTouched),
    [C, ge] = l.useState(() => i?.description || ""),
    [ee, xe] = l.useState(() => i?.responseInstructions || ""),
    [q, Se] = l.useState(() => i?.appId || ""),
    [w, ie] = l.useState(""),
    [H, Oe] = l.useState(() => i?.expression || ""),
    [o, h] = l.useState(""),
    [m, X] = l.useState(() =>
      Array.isArray(i?.formulaParams) && i.formulaParams.length ? i.formulaParams : Vr,
    ),
    [ae, $] = l.useState(() => i?.testValues || {}),
    Ve = l.useMemo(() => We(m), [m]),
    re = l.useMemo(() => a.find((n) => String(n.id) === q), [a, q]),
    se = l.useMemo(() => Object.keys(re?.endpoints ?? {}), [re]),
    N = w ? re?.endpoints?.[w] : void 0,
    Ge = l.useMemo(
      () =>
        N
          ? AO({ path: N.path, query_params: N.query_params, headers: N.headers, body: N.body })
          : [],
      [N],
    );
  (l.useEffect(() => {
    J || K(Pe(T));
  }, [T, J]),
    l.useEffect(() => {
      if (q && se.length && !se.includes(w)) {
        const n = re?.auth_endpoint_key || "";
        ie(se.find((k) => k !== n) || se[0] || "");
      }
    }, [q, se, w, re?.auth_endpoint_key]),
    l.useEffect(() => {
      const n = Ce() ?? "";
      n && s.some((k) => String(k.value) === String(n))
        ? f((k) => k || String(n))
        : (s.length === 1 || (!S && s[0])) && f(String(s[0].value));
    }, [s]),
    l.useEffect(() => {
      Q === "formula" &&
        Zr({
          branchId: S,
          name: T,
          slug: _,
          slugTouched: J,
          description: C,
          responseInstructions: ee,
          expression: H,
          formulaParams: m,
          testValues: ae,
          formulaTab: j,
          skillScope: y,
          agentId: g,
          appId: q,
        });
    }, [Q, S, T, _, J, C, ee, H, m, ae, j, y, g, q]));
  const PO = () => {
      const n = S.trim();
      if (!n) return;
      const k = Number(n);
      return Number.isFinite(k) && String(k) === n ? k : n;
    },
    vO = () => {
      const n = _.trim() || Pe(T);
      return !T.trim() || !n
        ? (p.error("Nombre y slug son obligatorios"), !1)
        : C.trim()
          ? S.trim()
            ? y === "agent" && !g
              ? (p.error("Selecciona el agente para el ámbito Agente"), !1)
              : !0
            : (p.error("Selecciona una sucursal"), !1)
          : (p.error("La descripción es obligatoria"), !1);
    },
    qO = (n) => {
      if ((n.preventDefault(), !vO())) return;
      const k = _.trim() || Pe(T);
      ea(S.trim(), !0, !1);
      const bO = PO(),
        fe = {
          name: T.trim(),
          slug: k,
          description: C.trim(),
          response_instructions: ee.trim() || void 0,
          is_active: !0,
          branch: bO,
          scope: y,
          ...(y === "agent" && g ? { agent_id: g } : {}),
        };
      if (Q === "api") {
        if (!q) {
          p.error("Selecciona una Aplicación");
          return;
        }
        if (!w) {
          p.error("Selecciona un endpoint");
          return;
        }
        c.mutate(
          { ...fe, implementation_type: "api", external_api: q, config: { endpoint_type: w } },
          {
            onSuccess: (R) => {
              (p.success("Skill API creada"), R?.id ? O(`/app/skills/${R.id}`) : O("/app/skills"));
            },
            onError: (R) => {
              p.error(R?.friendlyMessage || "No se pudo crear");
            },
          },
        );
        return;
      }
      if (Q === "formula") {
        if (Ve.size > 0) {
          (p.error("Hay variables con nombres duplicados"), W("trabajar"));
          return;
        }
        if (!m.map((ne) => we(ne.name)).filter(Boolean).length) {
          (p.error("Definí al menos una variable en el workspace"), W("trabajar"));
          return;
        }
        if (!H.trim()) {
          (p.error("Escribe la expresión matemática"), W("trabajar"));
          return;
        }
        c.mutate(
          {
            ...fe,
            implementation_type: "formula",
            external_api: q || null,
            config: { expression: H.trim() },
            parameters_schema: Qe(m),
          },
          {
            onSuccess: (ne) => {
              (Cr(),
                p.success("Skill Matemática creada"),
                ne?.id ? O(`/app/skills/${ne.id}`) : O("/app/skills"));
            },
            onError: (ne) => {
              p.error(ne?.friendlyMessage || "No se pudo crear");
            },
          },
        );
        return;
      }
      if (!o.trim()) {
        p.error("Escribe el código Python");
        return;
      }
      if (Ve.size > 0) {
        p.error("Hay variables con nombres duplicados");
        return;
      }
      c.mutate(
        {
          ...fe,
          implementation_type: "python_code",
          external_api: q || null,
          config: { code: o.trim(), entry: "main" },
          parameters_schema: Qe(m),
        },
        {
          onSuccess: (R) => {
            (p.success("Skill Python creada"), R?.id ? O(`/app/skills/${R.id}`) : O("/app/skills"));
          },
          onError: (R) => {
            p.error(R?.friendlyMessage || "No se pudo crear");
          },
        },
      );
    },
    yO = e.jsxs(e.Fragment, {
      children: [
        e.jsxs("div", {
          className: "space-y-1.5",
          children: [
            e.jsx(z, {
              className: "text-xs font-semibold text-muted-foreground/80",
              children: "ÁMBITO",
            }),
            e.jsxs(Y, {
              value: y,
              onValueChange: (n) => P(n),
              children: [
                e.jsx(A, { className: "h-9", children: e.jsx(F, {}) }),
                e.jsxs(I, {
                  children: [
                    e.jsx(x, { value: "global", children: ve.global }),
                    e.jsx(x, { value: "branch", children: ve.branch }),
                    e.jsx(x, { value: "agent", children: ve.agent }),
                  ],
                }),
              ],
            }),
            e.jsx("p", { className: "text-[10px] text-muted-foreground", children: FO[y] }),
          ],
        }),
        y === "agent" &&
          e.jsxs("div", {
            className: "space-y-1.5",
            children: [
              e.jsx(z, {
                className: "text-xs font-semibold text-muted-foreground/80",
                children: "AGENTE",
              }),
              e.jsxs(Y, {
                value: g || "__none__",
                onValueChange: (n) => v(n === "__none__" ? "" : n),
                children: [
                  e.jsx(A, {
                    className: "h-9",
                    children: e.jsx(F, { placeholder: "Selecciona agente" }),
                  }),
                  e.jsxs(I, {
                    children: [
                      e.jsx(x, { value: "__none__", children: "—" }),
                      t.map((n) => e.jsx(x, { value: String(n.id), children: n.name }, n.id)),
                    ],
                  }),
                ],
              }),
            ],
          }),
        e.jsxs("div", {
          className: "space-y-1.5",
          children: [
            e.jsx(z, {
              className: "text-xs font-semibold text-muted-foreground/80",
              children: "SUCURSAL",
            }),
            e.jsxs(Y, {
              value: S || "__none__",
              onValueChange: (n) => f(n === "__none__" ? "" : n),
              children: [
                e.jsx(A, { className: "h-9", children: e.jsx(F, { placeholder: "Selecciona" }) }),
                e.jsxs(I, {
                  children: [
                    e.jsx(x, { value: "__none__", children: "—" }),
                    s.map((n) =>
                      e.jsx(x, { value: String(n.value), children: n.label }, String(n.value)),
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-1.5",
          children: [
            e.jsx(z, {
              className: "text-xs font-semibold text-muted-foreground/80",
              children: "NOMBRE",
            }),
            e.jsx(D, {
              value: T,
              onChange: (n) => B(n.target.value),
              required: !0,
              placeholder:
                Q === "formula"
                  ? "Calcular volumen extraído"
                  : Q === "python"
                    ? "Normalizar medición"
                    : "Horas disponibles",
              className: "h-9",
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-1.5",
          children: [
            e.jsx(z, {
              className: "text-xs font-semibold text-muted-foreground/80",
              children: "SLUG",
            }),
            e.jsx(D, {
              value: _,
              onChange: (n) => {
                (ue(!0), K(n.target.value));
              },
              required: !0,
              className: "font-mono text-sm h-9",
              placeholder: "mi-skill",
            }),
          ],
        }),
      ],
    }),
    Te = e.jsxs("div", {
      className: "space-y-1.5",
      children: [
        e.jsxs(z, {
          className: "text-xs font-semibold text-muted-foreground/80",
          children: ["APLICACIÓN ", Q === "api" ? "" : "(OPCIONAL)"],
        }),
        e.jsxs(Y, {
          value: q || "__none__",
          onValueChange: (n) => {
            (Se(n === "__none__" ? "" : n), ie(""));
          },
          children: [
            e.jsx(A, { className: "h-9", children: e.jsx(F, { placeholder: "Selecciona" }) }),
            e.jsxs(I, {
              children: [
                e.jsx(x, { value: "__none__", children: "—" }),
                a.map((n) => e.jsx(x, { value: String(n.id), children: n.name }, n.id)),
              ],
            }),
          ],
        }),
        Q !== "api" &&
          e.jsx("p", {
            className: "text-[10px] text-muted-foreground",
            children: "Asociá esta función auxiliar a una app si aplica.",
          }),
      ],
    });
  return r
    ? e.jsx(IO, {
        children: e.jsxs("div", {
          className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6",
          children: [
            e.jsx("div", {
              className:
                "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-card/80 to-card px-5 py-5 md:px-6 shadow-sm",
              children: e.jsxs("div", {
                className: "relative flex flex-col gap-2",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2 text-primary",
                    children: [
                      e.jsx(b, {
                        variant: "ghost",
                        size: "icon",
                        className: "h-6 w-6 rounded-md hover:bg-primary/10",
                        asChild: !0,
                        children: e.jsx(Ze, {
                          to: "/app/skills",
                          children: e.jsx(DO, { className: "h-4 w-4" }),
                        }),
                      }),
                      e.jsx("span", {
                        className: "text-[11px] font-semibold uppercase tracking-[0.14em]",
                        children: "Creación",
                      }),
                    ],
                  }),
                  e.jsx("h1", {
                    className: "text-2xl md:text-3xl font-semibold tracking-tight",
                    children: "Nueva skill",
                  }),
                  e.jsx("p", {
                    className: "text-sm text-muted-foreground max-w-xl",
                    children:
                      Q === "formula"
                        ? "Diseñá una función matemática: variables → expresión → resultado."
                        : Q === "python"
                          ? "Escribe código Python a medida y pruébalo antes de crear."
                          : "Conecta un endpoint de una Aplicación instalada.",
                  }),
                ],
              }),
            }),
            e.jsxs("form", {
              className:
                "rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md p-5 md:p-6 shadow-sm space-y-5",
              onSubmit: qO,
              children: [
                e.jsxs("div", {
                  className:
                    "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-muted/20 rounded-xl p-4 border border-border/40",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        e.jsx(z, {
                          className: "text-xs font-semibold text-muted-foreground/80",
                          children: "TIPO",
                        }),
                        e.jsxs(Y, {
                          value: Q,
                          onValueChange: (n) => L(n),
                          children: [
                            e.jsx(A, { className: "h-9", children: e.jsx(F, {}) }),
                            e.jsxs(I, {
                              children: [
                                e.jsx(x, {
                                  value: "api",
                                  children: e.jsxs("span", {
                                    className: "inline-flex items-center gap-1.5",
                                    children: [e.jsx(LO, { className: "h-3.5 w-3.5" }), " API"],
                                  }),
                                }),
                                e.jsx(x, {
                                  value: "formula",
                                  children: e.jsxs("span", {
                                    className: "inline-flex items-center gap-1.5",
                                    children: [
                                      e.jsx(rO, { className: "h-3.5 w-3.5" }),
                                      " Matemática",
                                    ],
                                  }),
                                }),
                                e.jsx(x, {
                                  value: "python",
                                  children: e.jsxs("span", {
                                    className: "inline-flex items-center gap-1.5",
                                    children: [e.jsx(dO, { className: "h-3.5 w-3.5" }), " Python"],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-[10px] text-muted-foreground",
                          children:
                            Q === "api" ? qe.api : Q === "formula" ? qe.formula : qe.python_code,
                        }),
                      ],
                    }),
                    yO,
                  ],
                }),
                e.jsxs("div", {
                  className: "grid gap-4 md:grid-cols-2",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1.5 bg-muted/10 rounded-xl p-4 border border-border/30",
                      children: [
                        e.jsx(z, {
                          className: "text-xs font-semibold text-muted-foreground/80",
                          children: "DESCRIPCIÓN (PARA EL AGENTE)",
                        }),
                        e.jsx(Ye, {
                          value: C,
                          onChange: (n) => ge(n.target.value),
                          rows: 3,
                          required: !0,
                          placeholder: "Cuándo debe el agente invocar esta skill…",
                          className: "resize-none min-h-[80px] text-sm",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-1.5 bg-muted/10 rounded-xl p-4 border border-border/30",
                      children: [
                        e.jsx(z, {
                          className: "text-xs font-semibold text-muted-foreground/80",
                          children: "INSTRUCCIONES DE RESPUESTA (OPCIONAL)",
                        }),
                        e.jsx(Ye, {
                          value: ee,
                          onChange: (n) => xe(n.target.value),
                          rows: 3,
                          placeholder: "Cómo presentar el resultado al usuario…",
                          className: "resize-none min-h-[80px] text-sm",
                        }),
                      ],
                    }),
                  ],
                }),
                Q === "api" &&
                  e.jsxs("div", {
                    className: "grid gap-4 md:grid-cols-2 border-t border-border/40 pt-5",
                    children: [
                      Te,
                      e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          e.jsx(z, {
                            className: "text-xs font-semibold text-muted-foreground/80",
                            children: "ENDPOINT",
                          }),
                          e.jsxs(Y, {
                            value: w || "__none__",
                            onValueChange: (n) => ie(n === "__none__" ? "" : n),
                            disabled: !q,
                            children: [
                              e.jsx(A, {
                                className: "h-9",
                                children: e.jsx(F, { placeholder: "Selecciona endpoint" }),
                              }),
                              e.jsxs(I, {
                                children: [
                                  e.jsx(x, { value: "__none__", children: "—" }),
                                  se.map((n) =>
                                    e.jsxs(
                                      x,
                                      {
                                        value: n,
                                        children: [
                                          n,
                                          n === re?.auth_endpoint_key ? " (login)" : "",
                                        ],
                                      },
                                      n,
                                    ),
                                  ),
                                ],
                              }),
                            ],
                          }),
                          N &&
                            e.jsxs("p", {
                              className:
                                "text-[11px] font-mono text-muted-foreground break-all bg-muted/30 p-2 rounded border",
                              children: [(N.method || "GET").toUpperCase(), " ", N.path],
                            }),
                          Ge.length > 0 &&
                            e.jsxs("p", {
                              className: "text-[11px] text-muted-foreground",
                              children: [
                                "Params: ",
                                e.jsx("code", {
                                  className: "text-[10px]",
                                  children: Ge.join(", "),
                                }),
                              ],
                            }),
                          a.length === 0 &&
                            e.jsxs("p", {
                              className: "text-[11px] text-muted-foreground",
                              children: [
                                "No hay aplicaciones.",
                                " ",
                                e.jsx(Ze, {
                                  to: "/app/aplicaciones",
                                  className: "text-primary underline-offset-2 hover:underline",
                                  children: "Instalá una primero",
                                }),
                                ".",
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                Q === "formula" &&
                  e.jsxs(JO, {
                    value: j,
                    onValueChange: (n) => W(n),
                    className: "space-y-4 border-t border-border/40 pt-5",
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-wrap items-center justify-between gap-3",
                        children: [
                          e.jsxs(HO, {
                            className: "bg-muted/40 border border-border/60 p-1 h-10 rounded-xl",
                            children: [
                              e.jsxs(Ae, {
                                value: "configuracion",
                                className: "gap-1.5 px-3 text-xs font-semibold rounded-lg",
                                children: [
                                  e.jsx(MO, { className: "h-3.5 w-3.5" }),
                                  "1. Asociación",
                                ],
                              }),
                              e.jsxs(Ae, {
                                value: "trabajar",
                                className: "gap-1.5 px-3 text-xs font-semibold rounded-lg",
                                children: [
                                  e.jsx(BO, { className: "h-3.5 w-3.5" }),
                                  "2. Workspace Matemática",
                                ],
                              }),
                            ],
                          }),
                          j === "configuracion" &&
                            e.jsxs(b, {
                              type: "button",
                              size: "sm",
                              className: "gap-1.5",
                              onClick: () => W("trabajar"),
                              children: [
                                "Ir al workspace",
                                e.jsx(KO, { className: "h-3.5 w-3.5" }),
                              ],
                            }),
                        ],
                      }),
                      e.jsxs(Fe, {
                        value: "configuracion",
                        className: "mt-0 space-y-3",
                        children: [
                          Te,
                          e.jsx("p", {
                            className: "text-xs text-muted-foreground",
                            children:
                              "En el workspace defines variables, armas la expresión y pruebas la función antes de crear.",
                          }),
                        ],
                      }),
                      e.jsx(Fe, {
                        value: "trabajar",
                        className: "mt-0",
                        children: e.jsx(Ta, {
                          expression: H,
                          onExpressionChange: Oe,
                          params: m,
                          onParamsChange: X,
                          testValues: ae,
                          onTestValuesChange: $,
                          draftKey: _ || "new",
                        }),
                      }),
                    ],
                  }),
                Q === "python" &&
                  e.jsxs("div", {
                    className: "border-t border-border/40 pt-5 space-y-4",
                    children: [
                      Te,
                      e.jsx(Er, {
                        code: o,
                        onCodeChange: h,
                        params: m,
                        onParamsChange: X,
                        testValues: ae,
                        onTestValuesChange: $,
                      }),
                    ],
                  }),
                e.jsxs("div", {
                  className: "flex flex-wrap justify-end gap-2 border-t border-border/50 pt-4",
                  children: [
                    e.jsx(b, {
                      type: "button",
                      variant: "outline",
                      onClick: () => O("/app/skills"),
                      children: "Cancelar",
                    }),
                    e.jsxs(b, {
                      type: "submit",
                      disabled: c.isPending,
                      className: "font-semibold px-5",
                      children: [
                        c.isPending && e.jsx(me, { className: "mr-2 h-4 w-4 animate-spin" }),
                        "Crear skill",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    : e.jsx(jO, { to: "/app/skills", replace: !0 });
}
export { Jr as default };
