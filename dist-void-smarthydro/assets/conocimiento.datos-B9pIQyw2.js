import { af as Le, r as C, j as s } from "./vendor-react-DUYfdZnL.js";
import {
  fs as Ke,
  ft as Fe,
  B as L,
  M as _e,
  fi as ze,
  cN as Be,
  a5 as me,
  fu as Pe,
  a$ as Q,
  U as Ue,
  V as de,
  F as fe,
  a3 as X,
  c as he,
  am as qe,
  fv as Oe,
  fw as xe,
  fx as pe,
  a7 as j,
} from "./studio-chat-Bi-RYdat.js";
import {
  C as Ve,
  a as Ge,
  b as We,
  c as Y,
  e as M,
  f as He,
  d as ge,
} from "./context-menu-6H0gO2RR.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const we = ["A", "B", "C", "D", "E"],
  be = 20;
function Je(l, i) {
  return Array.from({ length: i }, () => {
    const c = {};
    for (const x of l) c[x] = "";
    return c;
  });
}
function Z(l, i) {
  const c = l.trim() || "columna";
  if (!i.includes(c)) return c;
  let x = 2;
  for (; i.includes(`${c}_${x}`); ) x += 1;
  return `${c}_${x}`;
}
function Qe(l) {
  const i = {};
  if (!l?.trim()) return i;
  for (const c of l.split(`
`)) {
    const x = c.trim();
    if (!x || x === "Campos adicionales:") continue;
    const f = x.indexOf(":");
    if (f > 0 && f < 80) {
      const g = x.slice(0, f).trim(),
        k = x.slice(f + 1).trim();
      g && (i[g] = k);
    }
  }
  return i;
}
function Xe(l) {
  const i = [],
    c = (f) => {
      i.includes(f) || i.push(f);
    },
    x = l.map((f) => {
      const g = {};
      f.title && (c("título"), (g.título = f.title));
      const k = Qe(f.content || "");
      if (Object.keys(k).length > 0) for (const [d, A] of Object.entries(k)) (c(d), (g[d] = A));
      else f.content && (c("contenido"), (g.contenido = f.content));
      return (f.tags?.length && (c("etiquetas"), (g.etiquetas = f.tags.join(", "))), g);
    });
  i.length === 0 && i.push("título", "contenido");
  for (const f of x) for (const g of i) g in f || (f[g] = "");
  return { columns: i, rows: x };
}
function Ye(l) {
  const i = l
    .replace(
      /\r\n/g,
      `
`,
    )
    .replace(
      /\r/g,
      `
`,
    )
    .trim();
  if (!i) return { columns: [], rows: [] };
  const c = i
    .split(
      `
`,
    )
    .filter((p) => p.trim().length > 0);
  if (c.length === 0) return { columns: [], rows: [] };
  const x = c[0].includes("	") ? "	" : c[0].includes(";") ? ";" : ",",
    f = (p) => p.split(x).map((N) => N.trim().replace(/^"|"$/g, "")),
    g = f(c[0]),
    k = g.map((p) => p.toLowerCase()),
    d = [
      "title",
      "titulo",
      "título",
      "content",
      "contenido",
      "question",
      "pregunta",
      "answer",
      "respuesta",
      "name",
      "nombre",
      "precio",
      "price",
      "sku",
      "id",
      "producto",
    ],
    A =
      k.some((p) => d.includes(p)) ||
      g.some((p) => p.length > 0 && p.length < 40 && !/^\d+([.,]\d+)?$/.test(p));
  let b, v;
  if (A) {
    const p = [];
    ((b = g.map((N, K) => {
      const D = Z(N || `columna_${K + 1}`, p);
      return (p.push(D), D);
    })),
      (v = c.slice(1)));
  } else ((b = g.map((p, N) => `columna_${N + 1}`)), (v = c));
  const y = v.map((p) => {
    const N = f(p),
      K = {};
    return (
      b.forEach((D, q) => {
        K[D] = N[q] ?? "";
      }),
      K
    );
  });
  return { columns: b, rows: y };
}
function U(l) {
  return {
    rMin: Math.min(l.r0, l.r1),
    rMax: Math.max(l.r0, l.r1),
    cMin: Math.min(l.c0, l.c1),
    cMax: Math.max(l.c0, l.c1),
  };
}
function B(l, i, c) {
  if (!c) return !1;
  const { rMin: x, rMax: f, cMin: g, cMax: k } = U(c);
  return l >= x && l <= f && i >= g && i <= k;
}
function _(l) {
  if (!l) return 0;
  const { rMin: i, rMax: c, cMin: x, cMax: f } = U(l);
  return (c - i + 1) * (f - x + 1);
}
function Ce(l, i) {
  return `sheet-cell-${l}-${i}`;
}
function P(l, i) {
  const c = document.getElementById(Ce(l, i));
  c && (c.focus(), c.select(), c.scrollIntoView({ block: "nearest", inline: "nearest" }));
}
function rt() {
  const l = Le(),
    i = Ke(),
    c = Fe(),
    x = C.useRef(null),
    f = C.useRef(null),
    [g, k] = C.useState(""),
    [d, A] = C.useState(() => [...we]),
    [b, v] = C.useState(() => Je(we, be)),
    [y, p] = C.useState(() => new Set(Array.from({ length: be }, (e, t) => t))),
    [N, K] = C.useState(!0),
    [D, q] = C.useState(!0),
    [O, V] = C.useState(""),
    [T, S] = C.useState({ r: 0, c: 0 }),
    [w, $] = C.useState({ r0: 0, c0: 0, r1: 0, c1: 0 }),
    [u, G] = C.useState(null),
    z = C.useRef(!1),
    W = C.useRef(!1),
    E = C.useRef({ r: 0, c: 0 });
  C.useEffect(() => {
    const e = () => {
      if (!z.current) return;
      const t = W.current;
      if (((z.current = !1), t)) document.activeElement?.blur?.();
      else {
        const n = E.current;
        requestAnimationFrame(() => P(n.r, n.c));
      }
    };
    return (window.addEventListener("mouseup", e), () => window.removeEventListener("mouseup", e));
  }, []);
  const I = (e, t, n) => {
      (A(e),
        v(t),
        p(new Set(t.map((r, a) => a))),
        V((r) => r || n),
        S({ r: 0, c: 0 }),
        $({ r0: 0, c0: 0, r1: 0, c1: 0 }),
        (E.current = { r: 0, c: 0 }),
        requestAnimationFrame(() => P(0, 0)),
        j.success(`${t.length} fila(s) listas · edita y guarda cuando quieras`));
    },
    je = (e) => {
      if (!e) return;
      const t = e.name.toLowerCase();
      if (!t.endsWith(".csv") && !t.endsWith(".xlsx") && !t.endsWith(".xls")) {
        j.error("Usa un archivo .csv, .xlsx o .xls");
        return;
      }
      k(e.name);
      const n = e.name.replace(/\.(csv|xlsx|xls)$/i, "");
      (V(n),
        i.mutate(e, {
          onSuccess: (r) => {
            if (r.error) {
              j.error(r.error);
              return;
            }
            const { columns: a, rows: m } = Xe(r.rows ?? []);
            I(a, m, n);
          },
          onError: (r) => {
            const a = r?.response?.data?.error || r.friendlyMessage || "No se pudo leer el archivo";
            j.error(a);
          },
        }));
    },
    ee = (e) => {
      const { columns: t, rows: n } = Ye(e);
      if (n.length === 0) {
        j.error("No se detectaron filas en el pegado");
        return;
      }
      (k(""), I(t, n, O || "Tabla pegada"));
    },
    ve = (e) => {
      const t = e.clipboardData?.getData("text/plain") ?? "";
      (t.includes("	") ||
        (t.includes(`
`) &&
          t.trim().split(`
`).length > 1)) &&
        (e.preventDefault(), ee(t));
    },
    ke = (e, t) => {
      const n = t.trim();
      if (!n || n === e) return;
      const r =
        d.includes(n) && n !== e
          ? Z(
              n,
              d.filter((a) => a !== e),
            )
          : n;
      (A((a) => a.map((m) => (m === e ? r : m))),
        v((a) =>
          a.map((m) => {
            const o = { ...m };
            return ((o[r] = o[e] ?? ""), delete o[e], o);
          }),
        ));
    },
    te = (e) => {
      const t = Z("nueva_columna", d),
        n = e ?? d.length;
      (A((r) => {
        const a = [...r];
        return (a.splice(n, 0, t), a);
      }),
        v((r) => r.map((a) => ({ ...a, [t]: "" }))));
    },
    ne = (e, t) => {
      te(t === "left" ? e : e + 1);
    },
    se = (e) => {
      if (d.length <= 1) {
        j.error("Debe quedar al menos una columna");
        return;
      }
      (A((t) => t.filter((n) => n !== e)),
        v((t) =>
          t.map((n) => {
            const r = { ...n };
            return (delete r[e], r);
          }),
        ));
    },
    ye = (e) => {
      const t = d[e];
      t && se(t);
    },
    re = (e, t, n) => {
      v((r) => r.map((a, m) => (m === e ? { ...a, [t]: n } : a)));
    },
    H = (e = w) => {
      if (!e) return;
      const { rMin: t, rMax: n, cMin: r, cMax: a } = U(e);
      v((m) =>
        m.map((o, h) => {
          if (h < t || h > n) return o;
          const R = { ...o };
          for (let F = r; F <= a; F++) {
            const ue = d[F];
            ue && (R[ue] = "");
          }
          return R;
        }),
      );
    },
    J = async (e = w) => {
      if (!e) return;
      const { rMin: t, rMax: n, cMin: r, cMax: a } = U(e),
        m = [];
      for (let o = t; o <= n; o++) {
        const h = [];
        for (let R = r; R <= a; R++) {
          const F = d[R];
          h.push(F ? (b[o]?.[F] ?? "") : "");
        }
        m.push(h.join("	"));
      }
      try {
        await navigator.clipboard.writeText(
          m.join(`
`),
        );
        const o = _(e);
        j.message(o > 1 ? `${o} celdas copiadas` : "Celda copiada");
      } catch {
        j.error("No se pudo copiar");
      }
    },
    Ne = () => {
      const e = {};
      for (const t of d) e[t] = "";
      return e;
    },
    ae = (e) => {
      const t = e ?? b.length;
      (v((n) => {
        const r = [...n];
        return (r.splice(t, 0, Ne()), r);
      }),
        p((n) => {
          const r = new Set();
          for (const a of n) r.add(a >= t ? a + 1 : a);
          return (r.add(t), r);
        }));
    },
    oe = (e, t) => {
      ae(t === "above" ? e : e + 1);
    },
    Me = (e) => {
      if (b.length <= 1) {
        j.error("Debe quedar al menos una fila");
        return;
      }
      (v((t) => t.filter((n, r) => r !== e)),
        p((t) => {
          const n = new Set();
          for (const r of t) r !== e && n.add(r > e ? r - 1 : r);
          return n;
        }),
        T?.r === e ? S(null) : T && T.r > e && S({ r: T.r - 1, c: T.c }));
    },
    Se = async (e, t) => {
      const n = d[t];
      if (n)
        try {
          const r = await navigator.clipboard.readText();
          if (
            r.includes("	") ||
            r.includes(`
`)
          ) {
            ee(r);
            return;
          }
          re(e, n, r);
        } catch {
          j.error("No se pudo pegar (permiso del navegador)");
        }
    },
    ce = (e, t, n) => {
      if (n && E.current) {
        const r = E.current;
        ($({ r0: r.r, c0: r.c, r1: e, c1: t }), S({ r: e, c: t }));
        return;
      }
      ((E.current = { r: e, c: t }), $({ r0: e, c0: t, r1: e, c1: t }), S({ r: e, c: t }));
    },
    Ee = (e, t, n) => {
      e.button === 0 &&
        (e.preventDefault(), (z.current = !0), (W.current = !1), ce(t, n, e.shiftKey));
    },
    Re = (e, t) => {
      if (!z.current) return;
      W.current = !0;
      const n = E.current;
      ($({ r0: n.r, c0: n.c, r1: e, c1: t }), S({ r: e, c: t }));
    },
    le = (e) => {
      p((t) => {
        const n = new Set(t);
        return (n.has(e) ? n.delete(e) : n.add(e), n);
      });
    },
    ie = C.useCallback(
      (e, t, n, r) => {
        const a = b.length - 1,
          m = d.length - 1;
        if (a < 0 || m < 0) return;
        let o = e,
          h = t;
        if (n === "ArrowUp") o = Math.max(0, e - 1);
        else if (n === "ArrowDown" || n === "Enter") o = Math.min(a, e + 1);
        else if (n === "ArrowLeft") h = Math.max(0, t - 1);
        else if (n === "ArrowRight") h = Math.min(m, t + 1);
        else if (n === "Tab") h = t + 1;
        else if (n === "ShiftTab") h = t - 1;
        else return;
        if (
          ((n === "Tab" || n === "ShiftTab") &&
            (h > m
              ? ((h = 0), (o = Math.min(a, e + 1)))
              : h < 0 && ((h = m), (o = Math.max(0, e - 1)))),
          r)
        ) {
          const R = E.current;
          ($({ r0: R.r, c0: R.c, r1: o, c1: h }), S({ r: o, c: h }));
        } else
          ((E.current = { r: o, c: h }),
            $({ r0: o, c0: h, r1: o, c1: h }),
            S({ r: o, c: h }),
            requestAnimationFrame(() => P(o, h)));
      },
      [b.length, d.length],
    ),
    Ae = (e, t, n) => {
      if ((e.key === "c" || e.key === "C") && (e.metaKey || e.ctrlKey)) {
        (e.preventDefault(), J(w ?? { r0: t, c0: n, r1: t, c1: n }));
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && _(w) > 1 && !e.metaKey && !e.ctrlKey) {
        (e.preventDefault(), H(w));
        return;
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        const a = e.currentTarget,
          m = a.selectionStart === 0 && a.selectionEnd === 0,
          o = a.selectionStart === a.value.length && a.selectionEnd === a.value.length,
          h = a.selectionStart === 0 && a.selectionEnd === a.value.length;
        if (
          (e.key === "ArrowLeft" && !m && !h && !e.shiftKey) ||
          (e.key === "ArrowRight" && !o && !h && !e.shiftKey)
        )
          return;
        (e.preventDefault(), ie(t, n, e.key, e.shiftKey));
        return;
      }
      e.key === "Tab" && (e.preventDefault(), ie(t, n, e.shiftKey ? "ShiftTab" : "Tab", !1));
    };
  C.useEffect(() => {
    const e = (t) => {
      const n = t.target?.tagName;
      if (!(n === "INPUT" || n === "TEXTAREA") && w) {
        if ((t.key === "c" || t.key === "C") && (t.metaKey || t.ctrlKey)) {
          (t.preventDefault(), J(w));
          return;
        }
        (t.key === "Delete" || t.key === "Backspace") && (t.preventDefault(), H(w));
      }
    };
    return (window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e));
  }, [w, d, b]);
  const De = () => {
      const e = b.filter((r, a) => y.has(a) && d.some((m) => (b[a][m] ?? "").trim().length > 0));
      if (e.length === 0) {
        j.error("Escribe o pega al menos una fila con datos");
        return;
      }
      if (d.length === 0) {
        j.error("Agrega al menos una columna");
        return;
      }
      const t = e.map((r) => {
        const a = {};
        for (const m of d) a[m] = r[m] ?? "";
        return a;
      });
      let n;
      (D
        ? (n = [
            {
              title: O.trim() || g || "Tabla importada",
              content: JSON.stringify(t),
              knowledge_type: "DATA",
              is_active: !0,
              tags: ["excel-import"],
            },
          ])
        : (n = t.map((r, a) => {
            const m = r.título || r.title || r.nombre || r[d[0]] || `Fila ${a + 1}`,
              o = d.map((h) => `${h}: ${r[h] ?? ""}`).join(`
`);
            return {
              title: String(m).slice(0, 200),
              content: o,
              knowledge_type: "DOCUMENT",
              is_active: !0,
            };
          })),
        c.mutate(
          { items: n, index: N },
          {
            onSuccess: (r) => {
              const a = r.count ?? r.created?.length ?? n.length;
              (j.success(`${a} documento(s) importado(s)`), l("/app/conocimiento"));
            },
            onError: (r) => {
              j.error(r.friendlyMessage || "Error al crear el conocimiento");
            },
          },
        ));
    },
    Te = C.useMemo(() => y.size, [y]),
    $e = b.some((e) => d.some((t) => (e[t] ?? "").trim()));
  return s.jsxs("div", {
    className: "px-4 md:px-6 lg:px-8 py-4 flex flex-col gap-3 h-[calc(100dvh-4rem)]",
    children: [
      s.jsxs("div", {
        className: "shrink-0 flex flex-col sm:flex-row sm:items-center gap-3",
        children: [
          s.jsxs(L, {
            variant: "outline",
            size: "sm",
            onClick: () => l("/app/conocimiento"),
            className: "self-start",
            children: [s.jsx(_e, { className: "h-4 w-4 mr-1.5" }), " Volver"],
          }),
          s.jsxs("div", {
            className: "flex-1 min-w-0",
            children: [
              s.jsxs("h1", {
                className: "text-lg font-semibold tracking-tight flex items-center gap-2",
                children: [s.jsx(ze, { className: "h-5 w-5 text-primary" }), "Datos"],
              }),
              s.jsxs("p", {
                className: "text-xs sm:text-sm text-muted-foreground",
                children: [
                  "Pega con Ctrl+V · arrastra para seleccionar · Shift+flechas · clic derecho",
                  g ? ` · ${g}` : "",
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            className: "flex items-center gap-2 self-start flex-wrap justify-end",
            children: [
              s.jsx(Be, {}),
              s.jsx("input", {
                ref: x,
                type: "file",
                accept: ".csv,.xlsx,.xls",
                className: "hidden",
                onChange: (e) => je(e.target.files?.[0] ?? null),
              }),
              s.jsxs(L, {
                type: "button",
                variant: "outline",
                size: "sm",
                disabled: i.isPending,
                onClick: () => x.current?.click(),
                children: [
                  i.isPending
                    ? s.jsx(me, { className: "h-4 w-4 mr-1.5 animate-spin" })
                    : s.jsx(Pe, { className: "h-4 w-4 mr-1.5" }),
                  "Archivo",
                ],
              }),
              s.jsxs(L, {
                type: "button",
                disabled: !$e || y.size === 0 || c.isPending,
                onClick: De,
                children: [
                  c.isPending && s.jsx(me, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Guardar e indexar",
                ],
              }),
            ],
          }),
        ],
      }),
      s.jsxs("div", {
        className: "flex flex-col flex-1 min-h-0 gap-2",
        children: [
          s.jsxs("div", {
            className: "shrink-0 flex flex-wrap items-center gap-x-4 gap-y-2",
            children: [
              s.jsxs("label", {
                className: "flex items-center gap-2 text-xs sm:text-sm",
                children: [
                  s.jsx(Q, { checked: N, onCheckedChange: (e) => K(!!e) }),
                  "Indexar al crear",
                ],
              }),
              s.jsxs("label", {
                className: "flex items-center gap-2 text-xs sm:text-sm",
                children: [
                  s.jsx(Q, { checked: D, onCheckedChange: (e) => q(!!e) }),
                  "Una sola tabla",
                ],
              }),
              D &&
                s.jsxs("div", {
                  className: "flex items-center gap-2 min-w-[140px] flex-1 max-w-xs",
                  children: [
                    s.jsx(Ue, { className: "text-xs shrink-0", children: "Título" }),
                    s.jsx(de, {
                      value: O,
                      onChange: (e) => V(e.target.value),
                      className: "h-8 text-xs",
                      placeholder: "Nombre de la tabla",
                    }),
                  ],
                }),
              s.jsxs("div", {
                className: "flex items-center gap-1 ml-auto",
                children: [
                  s.jsxs(L, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => te(),
                    children: [s.jsx(fe, { className: "h-3.5 w-3.5 mr-1" }), "Columna"],
                  }),
                  s.jsxs(L, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => ae(),
                    children: [s.jsx(fe, { className: "h-3.5 w-3.5 mr-1" }), "Fila"],
                  }),
                  s.jsx(L, {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => p(y.size === b.length ? new Set() : new Set(b.map((e, t) => t))),
                    children: y.size === b.length ? "Ninguna" : "Todas",
                  }),
                ],
              }),
            ],
          }),
          s.jsxs(Ve, {
            children: [
              s.jsx(Ge, {
                asChild: !0,
                children: s.jsx("div", {
                  ref: f,
                  onPaste: ve,
                  className:
                    "flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner",
                  children: s.jsxs("table", {
                    className: "border-collapse text-xs w-max min-w-full",
                    children: [
                      s.jsx("thead", {
                        className: "sticky top-0 z-20",
                        children: s.jsxs("tr", {
                          children: [
                            s.jsx("th", {
                              className:
                                "sticky left-0 z-30 w-12 min-w-12 bg-muted border-b border-r border-border px-1 py-1.5 font-medium text-muted-foreground",
                              children: "#",
                            }),
                            d.map((e, t) =>
                              s.jsx(
                                "th",
                                {
                                  className:
                                    "bg-muted border-b border-r border-border p-0 min-w-[140px] max-w-[240px]",
                                  onContextMenu: () => G({ kind: "header", c: t }),
                                  children: s.jsxs("div", {
                                    className: "flex items-center gap-0.5 px-1 py-1",
                                    children: [
                                      s.jsx(
                                        de,
                                        {
                                          defaultValue: e,
                                          className:
                                            "h-7 border-0 bg-transparent shadow-none focus-visible:ring-1 text-xs font-semibold px-1",
                                          title: "Renombrar columna",
                                          onBlur: (n) => {
                                            n.target.value.trim() !== e && ke(e, n.target.value);
                                          },
                                          onKeyDown: (n) => {
                                            n.key === "Enter" && n.target.blur();
                                          },
                                        },
                                        `hdr-${e}`,
                                      ),
                                      s.jsx(L, {
                                        type: "button",
                                        variant: "ghost",
                                        size: "icon",
                                        className:
                                          "h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive",
                                        title: "Eliminar columna",
                                        onClick: () => se(e),
                                        children: s.jsx(X, { className: "h-3 w-3" }),
                                      }),
                                    ],
                                  }),
                                },
                                e,
                              ),
                            ),
                          ],
                        }),
                      }),
                      s.jsx("tbody", {
                        children: b.map((e, t) =>
                          s.jsxs(
                            "tr",
                            {
                              className: "hover:bg-muted/30",
                              children: [
                                s.jsx("td", {
                                  className:
                                    "sticky left-0 z-10 w-12 min-w-12 bg-muted/80 border-b border-r border-border px-1 py-0 text-center align-middle",
                                  onContextMenu: () => G({ kind: "row", r: t }),
                                  children: s.jsxs("div", {
                                    className: "flex items-center justify-center gap-1 py-1",
                                    children: [
                                      s.jsx(Q, {
                                        checked: y.has(t),
                                        onCheckedChange: () => le(t),
                                        className: "h-3.5 w-3.5",
                                      }),
                                      s.jsx("span", {
                                        className: "text-[10px] text-muted-foreground tabular-nums",
                                        children: t + 1,
                                      }),
                                    ],
                                  }),
                                }),
                                d.map((n, r) => {
                                  const a = T?.r === t && T?.c === r,
                                    m = B(t, r, w);
                                  return s.jsx(
                                    "td",
                                    {
                                      className: he(
                                        "border-b border-r border-border p-0 min-w-[140px] max-w-[240px] select-none",
                                        m && "bg-primary/15",
                                        a && "ring-2 ring-inset ring-primary/70",
                                      ),
                                      onMouseDown: (o) => Ee(o, t, r),
                                      onMouseEnter: () => Re(t, r),
                                      onContextMenu: () => {
                                        (G({ kind: "cell", r: t, c: r }),
                                          B(t, r, w) || ce(t, r, !1));
                                      },
                                      onDoubleClick: () => P(t, r),
                                      children: s.jsx("input", {
                                        id: Ce(t, r),
                                        value: e[n] ?? "",
                                        onChange: (o) => re(t, n, o.target.value),
                                        onFocus: () => {
                                          (S({ r: t, c: r }),
                                            z.current ||
                                              ((E.current = { r: t, c: r }),
                                              $({ r0: t, c0: r, r1: t, c1: r })));
                                        },
                                        onKeyDown: (o) => Ae(o, t, r),
                                        className: he(
                                          "w-full h-8 bg-transparent px-2 text-xs outline-none caret-foreground",
                                          "focus:bg-primary/5",
                                        ),
                                      }),
                                    },
                                    n,
                                  );
                                }),
                              ],
                            },
                            t,
                          ),
                        ),
                      }),
                    ],
                  }),
                }),
              }),
              s.jsxs(We, {
                className: "w-56 z-[100]",
                children: [
                  u?.kind === "cell" &&
                    s.jsxs(s.Fragment, {
                      children: [
                        s.jsx(Y, {
                          className: "text-xs",
                          children:
                            _(w) > 1 ? `${_(w)} celdas` : `Celda ${u.r + 1}, ${d[u.c] || "…"}`,
                        }),
                        s.jsxs(M, {
                          onClick: () => {
                            J(w && B(u.r, u.c, w) ? w : { r0: u.r, c0: u.c, r1: u.r, c1: u.c });
                          },
                          children: [
                            s.jsx(qe, { className: "h-3.5 w-3.5 mr-2" }),
                            "Copiar",
                            s.jsx(He, { children: "⌘C" }),
                          ],
                        }),
                        s.jsxs(M, {
                          onClick: () => Se(u.r, u.c),
                          children: [s.jsx(Oe, { className: "h-3.5 w-3.5 mr-2" }), "Pegar"],
                        }),
                        s.jsx(M, {
                          onClick: () =>
                            H(w && B(u.r, u.c, w) ? w : { r0: u.r, c0: u.c, r1: u.r, c1: u.c }),
                          children: "Limpiar",
                        }),
                        s.jsx(ge, {}),
                      ],
                    }),
                  (u?.kind === "cell" || u?.kind === "row") &&
                    s.jsxs(s.Fragment, {
                      children: [
                        s.jsx(Y, { className: "text-xs", children: "Fila" }),
                        s.jsxs(M, {
                          onClick: () => oe(u.r, "above"),
                          children: [
                            s.jsx(xe, { className: "h-3.5 w-3.5 mr-2" }),
                            "Insertar fila arriba",
                          ],
                        }),
                        s.jsxs(M, {
                          onClick: () => oe(u.r, "below"),
                          children: [
                            s.jsx(xe, { className: "h-3.5 w-3.5 mr-2" }),
                            "Insertar fila abajo",
                          ],
                        }),
                        s.jsxs(M, {
                          className: "text-destructive focus:text-destructive",
                          onClick: () => Me(u.r),
                          children: [s.jsx(X, { className: "h-3.5 w-3.5 mr-2" }), "Eliminar fila"],
                        }),
                        s.jsx(ge, {}),
                      ],
                    }),
                  (u?.kind === "cell" || u?.kind === "header") &&
                    s.jsxs(s.Fragment, {
                      children: [
                        s.jsx(Y, { className: "text-xs", children: "Columna" }),
                        s.jsxs(M, {
                          onClick: () => ne(u.c, "left"),
                          children: [
                            s.jsx(pe, { className: "h-3.5 w-3.5 mr-2" }),
                            "Insertar columna a la izquierda",
                          ],
                        }),
                        s.jsxs(M, {
                          onClick: () => ne(u.c, "right"),
                          children: [
                            s.jsx(pe, { className: "h-3.5 w-3.5 mr-2" }),
                            "Insertar columna a la derecha",
                          ],
                        }),
                        s.jsxs(M, {
                          className: "text-destructive focus:text-destructive",
                          onClick: () => ye(u.c),
                          children: [
                            s.jsx(X, { className: "h-3.5 w-3.5 mr-2" }),
                            "Eliminar columna",
                          ],
                        }),
                      ],
                    }),
                  u?.kind === "row" &&
                    s.jsx(M, {
                      onClick: () => le(u.r),
                      children: y.has(u.r) ? "Quitar de selección" : "Incluir en selección",
                    }),
                ],
              }),
            ],
          }),
          s.jsxs("p", {
            className: "shrink-0 text-[11px] text-muted-foreground",
            children: [
              Te,
              "/",
              b.length,
              " filas · ",
              d.length,
              " columnas",
              _(w) > 1 ? ` · ${_(w)} celdas seleccionadas` : "",
              " · ",
              "arrastra o Shift+flechas · Ctrl+C / Supr",
            ],
          }),
        ],
      }),
    ],
  });
}
export { rt as default };
