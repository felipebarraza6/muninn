import { r as c, j as e, ah as S } from "./vendor-react-DUYfdZnL.js";
import {
  f9 as pe,
  fa as he,
  fb as ge,
  cG as fe,
  fc as je,
  fd as ve,
  fe as we,
  ff as ye,
  fg as be,
  fh as Ne,
  A as Ce,
  bS as De,
  B as u,
  fi as Se,
  F as Q,
  fj as ke,
  c as y,
  ah as Ae,
  V as W,
  a5 as k,
  W as Re,
  X as Ee,
  Y as Pe,
  Z as Le,
  $ as q,
  fk as U,
  aV as _e,
  aW as Te,
  aX as Ie,
  aY as Me,
  aZ as X,
  a9 as Ke,
  a3 as re,
  cN as Fe,
  b as ze,
  I as Be,
  fl as Ge,
  a7 as x,
  dl as _,
  fm as He,
  fn as Ve,
  aa as $e,
  ab as Oe,
  ac as Qe,
  ad as We,
  dX as qe,
  U as Ue,
  di as Xe,
  b1 as Y,
  b2 as Z,
  b3 as J,
  b4 as ee,
  b5 as ae,
  b6 as se,
  b7 as te,
  b8 as ne,
  fo as ie,
  fp as Ye,
  K as A,
  bN as Ze,
  cR as Je,
  cz as ea,
  dh as aa,
  R as sa,
  fq as ta,
  fr as na,
} from "./studio-chat-Bi-RYdat.js";
import { T as ra, a as ia, b as oa, c as la } from "./admin-CEWZN_UE.js";
import { u as ca, A as da, m as T } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
const I = "__all__";
function ma({ doc: r }) {
  const n = r.api_refresh_config;
  return n
    ? e.jsx(ra, {
        delayDuration: 150,
        children: e.jsxs(ia, {
          children: [
            e.jsx(oa, {
              asChild: !0,
              children: e.jsxs(A, {
                variant: "outline",
                className: "text-[10px] gap-1 font-normal border-primary/35 text-primary",
                children: [e.jsx(sa, { className: "h-3 w-3" }), "Auto"],
              }),
            }),
            e.jsxs(la, {
              side: "top",
              className: "max-w-[260px]",
              children: [
                e.jsx("p", { className: "font-medium", children: "Auto-refresh desde API" }),
                e.jsxs("p", {
                  className: "text-[11px] opacity-90",
                  children: [n.endpoint || "—", " · ", ta(n.cron) || n.cron],
                }),
                n.content_mapping?.type
                  ? e.jsxs("p", {
                      className: "text-[11px] opacity-75",
                      children: ["Mapping: ", na(n.content_mapping.type)],
                    })
                  : null,
              ],
            }),
          ],
        }),
      })
    : null;
}
function ua({
  doc: r,
  agentCount: n,
  indexed: b,
  canManage: v,
  canRestore: N,
  canHardDelete: M,
  restoring: f,
  onDeactivate: K,
  onRestore: R,
  onHardDelete: w,
}) {
  const { label: F, Icon: j, style: d } = ie(r.knowledge_type),
    p = Ye(r),
    h = r.is_active === !1;
  return e.jsxs("article", {
    className: y(
      "group flex h-full flex-col rounded-2xl border bg-card/50 p-4 transition-all duration-200",
      "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg hover:shadow-primary/10",
      h ? "border-border/60 opacity-70 grayscale" : d.border,
    ),
    children: [
      e.jsxs("div", {
        className: "flex items-start gap-3",
        children: [
          e.jsx("div", {
            className: y(
              "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ring-1",
              h ? "bg-muted text-muted-foreground ring-border/60" : `${d.soft} ring-primary/25`,
            ),
            children: e.jsx(j, { className: y("h-5 w-5", h ? "text-muted-foreground" : d.icon) }),
          }),
          e.jsxs("div", {
            className: "min-w-0 flex-1 space-y-1.5",
            children: [
              e.jsx("h3", {
                className: "font-medium text-sm leading-snug line-clamp-2",
                children: r.title,
              }),
              e.jsxs("div", {
                className: "flex flex-wrap items-center gap-1.5",
                children: [
                  e.jsx("span", {
                    className: y(
                      "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                      d.chip,
                    ),
                    children: F,
                  }),
                  r.category?.trim()
                    ? e.jsx(A, {
                        variant: "outline",
                        className: "text-[10px] font-normal",
                        children: r.category.trim(),
                      })
                    : null,
                  h &&
                    e.jsx(A, {
                      variant: "secondary",
                      className: "text-[10px] font-normal",
                      children: "Inactivo",
                    }),
                  e.jsxs(A, {
                    variant: "outline",
                    className: y(
                      "text-[10px] gap-1 font-normal",
                      n > 0 ? "border-primary/30 text-primary" : "text-muted-foreground",
                    ),
                    children: [
                      e.jsx(Ze, { className: "h-3 w-3" }),
                      n > 0 ? `${n} agente${n === 1 ? "" : "s"}` : "Sin asignar",
                    ],
                  }),
                  b &&
                    e.jsxs(A, {
                      variant: "outline",
                      className: "text-[10px] gap-1 font-normal text-muted-foreground",
                      children: [e.jsx(Je, { className: "h-3 w-3" }), "Indexado"],
                    }),
                  e.jsx(ma, { doc: r }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsx("p", {
        className: "mt-3 text-[12px] text-muted-foreground line-clamp-3 leading-relaxed flex-1",
        children: p,
      }),
      e.jsxs("div", {
        className: "mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3",
        children: [
          e.jsx(u, {
            variant: "ghost",
            size: "sm",
            className: "h-8 gap-1.5",
            asChild: !0,
            children: e.jsxs(S, {
              to: `/app/conocimiento/${r.id}`,
              children: [e.jsx(ea, { className: "h-3.5 w-3.5" }), "Ver"],
            }),
          }),
          e.jsxs("div", {
            className: "ml-auto flex flex-wrap items-center justify-end gap-1",
            children: [
              h &&
                N &&
                e.jsxs(u, {
                  variant: "outline",
                  size: "sm",
                  className: "h-8",
                  disabled: f,
                  onClick: R,
                  title: "Reactivar",
                  children: [
                    f
                      ? e.jsx(k, { className: "h-3.5 w-3.5 mr-1 animate-spin" })
                      : e.jsx(aa, { className: "h-3.5 w-3.5 mr-1" }),
                    "Reactivar",
                  ],
                }),
              !h &&
                v &&
                e.jsx(u, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 text-muted-foreground",
                  onClick: K,
                  title: "Desactivar",
                  children: "Desactivar",
                }),
              M &&
                e.jsxs(u, {
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 text-destructive hover:text-destructive",
                  onClick: w,
                  title: "Eliminar permanentemente",
                  children: [e.jsx(re, { className: "h-3.5 w-3.5 mr-1" }), "Eliminar"],
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
function va() {
  const r = pe(),
    [n, b] = c.useState(I),
    v = n === I ? null : n,
    {
      data: N = [],
      isLoading: M,
      refetch: f,
    } = he({ ...(r ? { includeInactive: !0 } : {}), category: v }),
    { data: K = [] } = ge(),
    { data: R = [] } = fe(r ? { includeInactive: !0 } : { is_active: !0 }),
    w = je(),
    F = ve(),
    j = we(),
    d = ye(),
    [p, h] = c.useState(""),
    [E, oe] = c.useState(""),
    [o, P] = c.useState(null),
    [le, z] = c.useState(null),
    [m, g] = c.useState(null),
    [B, $] = c.useState(""),
    C = ca();
  c.useEffect(() => {
    const a = window.setTimeout(() => oe(p.trim()), 280);
    return () => window.clearTimeout(a);
  }, [p]);
  const { data: L, isFetching: ce } = be({ q: E, top_k: 40 }),
    D = c.useMemo(
      () =>
        r
          ? [...N].sort((a, s) => {
              const t = a.is_active !== !1 ? 0 : 1,
                i = s.is_active !== !1 ? 0 : 1;
              return t !== i ? t - i : (a.title || "").localeCompare(s.title || "", "es");
            })
          : N.filter((a) => a.is_active !== !1),
      [N, r],
    ),
    de = c.useMemo(() => {
      const a = new Map();
      for (const s of R)
        for (const t of s.knowledge_documents ?? []) {
          const i = String(t);
          a.set(i, (a.get(i) ?? 0) + 1);
        }
      return a;
    }, [R]),
    G = c.useMemo(() => {
      const a = E.toLowerCase(),
        s = L?.results ?? [];
      if (a.length >= 2 && s.length > 0) {
        const t = new Map(D.map((l) => [String(l.id), l])),
          i = [];
        for (const l of s) {
          const V = t.get(String(l.id));
          V && i.push(V);
        }
        const H = new Set(i.map((l) => String(l.id)));
        for (const l of D) {
          if (H.has(String(l.id))) continue;
          (l.title.toLowerCase().includes(a) ||
            (l.summary || "").toLowerCase().includes(a) ||
            (l.category || "").toLowerCase().includes(a)) &&
            i.push(l);
        }
        return i;
      }
      return a
        ? D.filter(
            (t) =>
              t.title.toLowerCase().includes(a) ||
              (t.summary || "").toLowerCase().includes(a) ||
              (t.category || "").toLowerCase().includes(a) ||
              Ne(t.knowledge_type).toLowerCase().includes(a) ||
              t.knowledge_type.toLowerCase().includes(a),
          )
        : D;
    }, [D, E, L?.results]),
    me = (a) => {
      ($(a), g({ type: "rename", name: a }));
    },
    ue = (a) => {
      g({ type: "delete", name: a });
    },
    O = () => {
      if (!m || m.type !== "rename") return;
      const a = m.name,
        s = B.trim();
      if (!s || s === a) {
        g(null);
        return;
      }
      if (s.length > 80) {
        x.error("La categoría admite máximo 80 caracteres");
        return;
      }
      j.mutate(
        { from: a, to: s },
        {
          onSuccess: (t) => {
            (x.success(`Categoría renombrada (${t.updated} docs)`), n === a && b(s), g(null), f());
          },
          onError: (t) => x.error(_(t, "No se pudo renombrar")),
        },
      );
    },
    xe = () => {
      if (!m || m.type !== "delete") return;
      const a = m.name;
      d.mutate(
        { name: a },
        {
          onSuccess: (s) => {
            (x.success(`Categoría eliminada (${s.cleared} docs)`), n === a && b(I), g(null), f());
          },
          onError: (s) => x.error(_(s, "No se pudo eliminar la categoría")),
        },
      );
    };
  return e.jsxs(Ce, {
    className: "space-y-4 px-4 md:px-6 lg:px-8 py-4",
    children: [
      e.jsxs("div", {
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
                      e.jsx(De, { className: "h-4 w-4", strokeWidth: 1.75 }),
                      e.jsx("span", {
                        className: "text-[11px] font-medium uppercase tracking-[0.14em]",
                        children: "Biblioteca",
                      }),
                    ],
                  }),
                  e.jsx("h1", {
                    className: "text-2xl md:text-3xl font-semibold tracking-tight",
                    children: "Conocimiento",
                  }),
                  e.jsx("p", {
                    className: "text-sm text-muted-foreground max-w-lg leading-relaxed",
                    children:
                      "Documentos preparados para RAG. Cada tipo tiene su propia experiencia de creación y vista previa.",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex flex-wrap items-center gap-2 shrink-0",
                children: [
                  e.jsx(u, {
                    variant: "outline",
                    size: "sm",
                    asChild: !0,
                    children: e.jsxs(S, {
                      to: "/app/conocimiento/datos",
                      children: [e.jsx(Se, { className: "h-4 w-4 mr-1.5" }), " Datos"],
                    }),
                  }),
                  e.jsx(u, {
                    size: "sm",
                    asChild: !0,
                    children: e.jsxs(S, {
                      to: "/app/conocimiento/nuevo",
                      children: [e.jsx(Q, { className: "h-4 w-4 mr-1.5" }), " Nuevo"],
                    }),
                  }),
                ],
              }),
            ],
          }),
          e.jsx("div", {
            className: "relative mt-4 flex flex-wrap gap-1.5",
            children: ke.map((a) => {
              const { label: s, Icon: t, style: i } = ie(a);
              return e.jsxs(
                S,
                {
                  to: `/app/conocimiento/nuevo?type=${a}`,
                  className: y(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:scale-105",
                    i.chip,
                  ),
                  children: [e.jsx(t, { className: "h-3.5 w-3.5" }), s],
                },
                a,
              );
            }),
          }),
        ],
      }),
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row gap-2 sm:items-center",
        children: [
          e.jsxs("div", {
            className: "relative flex-1 min-w-0 sm:max-w-md",
            children: [
              e.jsx(Ae, {
                className:
                  "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground",
              }),
              e.jsx(W, {
                placeholder: "Buscar en la biblioteca (título, RAG…)",
                value: p,
                onChange: (a) => h(a.target.value),
                className: "h-9 pl-8",
              }),
              ce
                ? e.jsx(k, {
                    className:
                      "absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground",
                  })
                : null,
            ],
          }),
          e.jsxs(Re, {
            value: n,
            onValueChange: b,
            children: [
              e.jsx(Ee, {
                className: "h-9 w-full sm:w-[200px]",
                children: e.jsx(Pe, { placeholder: "Categoría" }),
              }),
              e.jsxs(Le, {
                children: [
                  e.jsx(q, { value: I, children: "Todas las categorías" }),
                  K.map((a) =>
                    e.jsxs(q, { value: a.name, children: [a.name, " (", a.count, ")"] }, a.name),
                  ),
                ],
              }),
            ],
          }),
          v && U()
            ? e.jsxs(_e, {
                children: [
                  e.jsx(Te, {
                    asChild: !0,
                    children: e.jsx(u, {
                      variant: "outline",
                      size: "icon",
                      className: "h-9 w-9 shrink-0",
                      title: "Gestionar categoría",
                      disabled: j.isPending || d.isPending,
                      children: e.jsx(Ie, { className: "h-4 w-4" }),
                    }),
                  }),
                  e.jsxs(Me, {
                    align: "end",
                    children: [
                      e.jsxs(X, {
                        onClick: () => me(v),
                        children: [
                          e.jsx(Ke, { className: "h-3.5 w-3.5 mr-2" }),
                          "Renombrar categoría",
                        ],
                      }),
                      e.jsxs(X, {
                        className: "text-destructive focus:text-destructive",
                        onClick: () => ue(v),
                        children: [
                          e.jsx(re, { className: "h-3.5 w-3.5 mr-2" }),
                          "Quitar categoría",
                        ],
                      }),
                    ],
                  }),
                ],
              })
            : null,
          e.jsx(Fe, {}),
        ],
      }),
      E.length >= 2 && (L?.results?.length ?? 0) > 0
        ? e.jsxs("p", {
            className: "text-[11px] text-muted-foreground -mt-1",
            children: [
              "Ordenado por relevancia del índice (",
              L?.count ?? G.length,
              " ",
              "coincidencias).",
            ],
          })
        : null,
      e.jsx(da, {
        mode: "wait",
        children: M
          ? e.jsx(
              T.div,
              {
                initial: C ? !1 : { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2 },
                children: e.jsx(ze, { variant: "cards", padded: !1 }),
              },
              "skeleton",
            )
          : G.length === 0
            ? e.jsx(
                T.div,
                {
                  initial: C ? !1 : { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 },
                  children: e.jsx(Be, {
                    title: p.trim() ? "Sin resultados" : "Biblioteca vacía",
                    description: p.trim()
                      ? "Prueba otro término o limpia el filtro de categoría."
                      : "Crea el primer documento para usarlo en agentes con RAG.",
                    action: p.trim()
                      ? void 0
                      : e.jsx(u, {
                          size: "sm",
                          asChild: !0,
                          children: e.jsxs(S, {
                            to: "/app/conocimiento/nuevo",
                            children: [e.jsx(Q, { className: "h-4 w-4 mr-1.5" }), " Nuevo"],
                          }),
                        }),
                  }),
                },
                "empty",
              )
            : e.jsx(
                T.div,
                {
                  variants: C
                    ? void 0
                    : { hidden: {}, show: { transition: { staggerChildren: 0.04 } } },
                  initial: C ? !1 : "hidden",
                  animate: "show",
                  className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5",
                  children: G.map((a) => {
                    const s = U(a.branch),
                      t = Ge(a.branch);
                    return e.jsx(
                      T.div,
                      {
                        variants: C
                          ? void 0
                          : {
                              hidden: { opacity: 0, y: 10 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
                            },
                        children: e.jsx(ua, {
                          doc: a,
                          agentCount: de.get(String(a.id)) ?? 0,
                          indexed: Ve(a),
                          canManage: s,
                          canRestore: He(a.branch),
                          canHardDelete: t,
                          restoring: le === String(a.id),
                          onDeactivate: () => P({ type: "deactivate", doc: a }),
                          onHardDelete: () => P({ type: "hard", doc: a }),
                          onRestore: () => {
                            const i = String(a.id);
                            (z(i),
                              F.mutate(
                                { id: i, data: { is_active: !0 }, branch: a.branch },
                                {
                                  onSuccess: () => {
                                    (x.success("Conocimiento reactivado"), z(null), f());
                                  },
                                  onError: (H) => {
                                    (x.error(_(H, "No se pudo reactivar")), z(null));
                                  },
                                },
                              ));
                          },
                        }),
                      },
                      a.id,
                    );
                  }),
                },
                "content",
              ),
      }),
      e.jsx($e, {
        open: m?.type === "rename",
        onOpenChange: (a) => {
          a || g(null);
        },
        children: e.jsxs(Oe, {
          className: "sm:max-w-md",
          children: [
            e.jsxs(Qe, {
              children: [
                e.jsx(We, { children: "Renombrar categoría" }),
                e.jsxs(qe, {
                  children: ["Se actualiza en todos los documentos con «", m?.name, "»."],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "space-y-2",
              children: [
                e.jsx(Ue, { htmlFor: "rename-category", children: "Nuevo nombre" }),
                e.jsx(W, {
                  id: "rename-category",
                  value: B,
                  onChange: (a) => $(a.target.value.slice(0, 80)),
                  maxLength: 80,
                  autoFocus: !0,
                  onKeyDown: (a) => {
                    a.key === "Enter" && (a.preventDefault(), O());
                  },
                }),
              ],
            }),
            e.jsxs(Xe, {
              children: [
                e.jsx(u, {
                  type: "button",
                  variant: "outline",
                  onClick: () => g(null),
                  disabled: j.isPending,
                  children: "Cancelar",
                }),
                e.jsxs(u, {
                  type: "button",
                  onClick: O,
                  disabled: j.isPending || !B.trim(),
                  children: [
                    j.isPending && e.jsx(k, { className: "h-4 w-4 mr-1.5 animate-spin" }),
                    "Guardar",
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsx(Y, {
        open: m?.type === "delete",
        onOpenChange: (a) => {
          a || g(null);
        },
        children: e.jsxs(Z, {
          children: [
            e.jsxs(J, {
              children: [
                e.jsx(ee, { children: "¿Quitar categoría?" }),
                e.jsxs(ae, {
                  children: [
                    "«",
                    m?.name,
                    "» se eliminará de todos los documentos. Los docs se mantienen sin categoría.",
                  ],
                }),
              ],
            }),
            e.jsxs(se, {
              children: [
                e.jsx(te, { disabled: d.isPending, children: "Cancelar" }),
                e.jsx(ne, {
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  disabled: d.isPending,
                  onClick: (a) => {
                    (a.preventDefault(), xe());
                  },
                  children: d.isPending
                    ? e.jsxs(e.Fragment, {
                        children: [
                          e.jsx(k, { className: "h-4 w-4 mr-1.5 animate-spin" }),
                          "Quitando…",
                        ],
                      })
                    : "Quitar categoría",
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsx(Y, {
        open: !!o,
        onOpenChange: (a) => {
          a || P(null);
        },
        children: e.jsxs(Z, {
          children: [
            e.jsxs(J, {
              children: [
                e.jsx(ee, {
                  children:
                    o?.type === "hard" ? "¿Eliminar permanentemente?" : "¿Desactivar conocimiento?",
                }),
                e.jsx(ae, {
                  children:
                    o?.type === "hard"
                      ? e.jsxs(e.Fragment, {
                          children: [
                            "«",
                            o.doc.title,
                            "» se borrará de forma permanente de esta sucursal. Pueden hacerlo superadmin, organizador (sus stores) y owner (su sucursal). No se puede deshacer.",
                          ],
                        })
                      : e.jsxs(e.Fragment, {
                          children: [
                            "«",
                            o?.doc.title,
                            "» se desactivará y dejará de estar disponible para los agentes. Después puedes reactivarlo.",
                          ],
                        }),
                }),
              ],
            }),
            e.jsxs(se, {
              children: [
                e.jsx(te, { disabled: w.isPending, children: "Cancelar" }),
                e.jsx(ne, {
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  disabled: w.isPending || !o,
                  onClick: (a) => {
                    if ((a.preventDefault(), !o)) return;
                    const s = o.type === "hard";
                    w.mutate(
                      { id: String(o.doc.id), branch: o.doc.branch, hard: s },
                      {
                        onSuccess: () => {
                          (x.success(s ? "Conocimiento eliminado" : "Conocimiento desactivado"),
                            P(null),
                            f());
                        },
                        onError: (t) =>
                          x.error(_(t, s ? "No se pudo eliminar" : "No se pudo desactivar")),
                      },
                    );
                  },
                  children: w.isPending
                    ? e.jsxs(e.Fragment, {
                        children: [
                          e.jsx(k, { className: "h-4 w-4 mr-1.5 animate-spin" }),
                          o?.type === "hard" ? "Eliminando…" : "Desactivando…",
                        ],
                      })
                    : o?.type === "hard"
                      ? "Eliminar"
                      : "Desactivar",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { va as default };
