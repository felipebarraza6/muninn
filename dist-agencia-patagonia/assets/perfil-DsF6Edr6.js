import { r as t, j as e, ah as se } from "./vendor-react-DUYfdZnL.js";
import { i as ae, j as re, k as te, S as T } from "./index-BvBbVnNp.js";
import {
  c7 as ie,
  bJ as ne,
  i as ce,
  d as le,
  bd as oe,
  bf as de,
  bZ as q,
  aS as F,
  bN as me,
  e0 as ue,
  co as xe,
  aq as pe,
  bL as he,
  be as je,
  bM as ge,
  bO as Ne,
  b as fe,
  ck as be,
  cl as ve,
  K as w,
  cR as ye,
  cD as x,
  cK as p,
  cL as h,
  aK as we,
  cE as j,
  U as n,
  V as c,
  B as C,
  a5 as I,
  bw as Ce,
  bx as _e,
  a7 as l,
} from "./studio-chat-BBQUCckT.js";
import { u as Ae, A as Pe, m as G } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./admin-CJj1SvsI.js";
import "./vendor-charts-l0_txfiz.js";
function H(i) {
  const r = String(i.role_code || i.role || "").toUpperCase();
  return r === "ORG_OWNER"
    ? "Organizador"
    : r === "OWNER"
      ? "Propietario"
      : r === "ADMIN_LOCAL"
        ? "Administrador local"
        : i.role_name || i.role_display || r || "Miembro";
}
function Se(i) {
  if (!i) return "—";
  const r = new Date(i);
  return Number.isNaN(r.getTime())
    ? "—"
    : r.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}
function Re() {
  const i = ie(),
    r = ne().filter((s) => s.is_active !== !1),
    { data: g, isLoading: W } = ae(),
    a = g ?? i,
    N = re(),
    f = te(),
    [_, A] = t.useState(""),
    [P, S] = t.useState(""),
    [b, L] = t.useState(""),
    [v, U] = t.useState(""),
    [k, M] = t.useState(""),
    [y, O] = t.useState(""),
    [o, z] = t.useState(""),
    [d, B] = t.useState("");
  t.useEffect(() => {
    a &&
      (A(a.first_name || ""),
      S(a.last_name || ""),
      L(a.email || ""),
      U(a.username || ""),
      M(a.dni || ""));
  }, [a]);
  const m = t.useMemo(() => {
      const s = g?.branch_assignments ?? [];
      return s.length > 0 ? s : r;
    }, [g?.branch_assignments, r]),
    u = ce(),
    J = le(),
    R = oe(),
    E = de(),
    V =
      [a?.first_name, a?.last_name].filter(Boolean).join(" ").trim() ||
      a?.username ||
      a?.email ||
      "Usuario",
    Z =
      `${a?.first_name?.[0] || ""}${a?.last_name?.[0] || ""}`.toUpperCase() ||
      a?.username?.[0]?.toUpperCase() ||
      "U",
    D = u ? "Administrador global" : J ? "Organizador" : m.length > 0 ? H(m[0]) : "Usuario",
    $ = [
      xe() ? { to: "/app/admin/organizaciones", label: pe(), icon: q } : null,
      he() ? { to: "/app/admin/sucursales", label: je(), icon: F } : null,
      ge() ? { to: "/app/admin/usuarios", label: "Usuarios", icon: me } : null,
      Ne() ? { to: "/app/admin/llm", label: "LLM", icon: ue } : null,
    ].filter(Boolean),
    Q = () => {
      if (!b.trim() || !v.trim()) {
        l.error("Correo y usuario son requeridos");
        return;
      }
      N.mutate(
        {
          first_name: _.trim(),
          last_name: P.trim(),
          email: b.trim(),
          username: v.trim(),
          dni: k.trim(),
        },
        {
          onSuccess: () => l.success("Perfil actualizado"),
          onError: (s) => l.error(s.friendlyMessage || "No se pudo actualizar el perfil"),
        },
      );
    },
    X = () => {
      if (!y || !o || !d) {
        l.error("Completa los tres campos");
        return;
      }
      if (o !== d) {
        l.error("Las contraseñas nuevas no coinciden");
        return;
      }
      f.mutate(
        { current_password: y, new_password: o, confirm_password: d },
        {
          onSuccess: (s) => {
            (O(""), z(""), B(""), l.success(s.message || "Contraseña actualizada"));
          },
          onError: (s) => l.error(s.friendlyMessage || "No se pudo cambiar la contraseña"),
        },
      );
    },
    K = Ae();
  return e.jsx(Pe, {
    mode: "wait",
    children:
      W && !a
        ? e.jsx(
            G.div,
            {
              initial: K ? !1 : { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.2 },
              children: e.jsx(fe, { variant: "profile" }),
            },
            "skeleton",
          )
        : e.jsxs(
            G.div,
            {
              initial: K ? !1 : { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              className: "mx-auto w-full max-w-6xl space-y-5 px-4 py-5 md:px-6 lg:px-8",
              children: [
                e.jsxs("section", {
                  className:
                    "flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
                  children: [
                    e.jsxs("div", {
                      className: "flex min-w-0 items-center gap-3",
                      children: [
                        e.jsx(be, {
                          className: "h-14 w-14 border border-border",
                          children: e.jsx(ve, {
                            className: "bg-primary/15 text-lg font-semibold text-primary",
                            children: Z,
                          }),
                        }),
                        e.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            e.jsx("h1", {
                              className: "truncate text-xl font-semibold tracking-tight",
                              children: V,
                            }),
                            e.jsx("p", {
                              className: "truncate text-sm text-muted-foreground",
                              children: a?.email,
                            }),
                            e.jsxs("div", {
                              className: "mt-1.5 flex flex-wrap gap-1.5",
                              children: [
                                e.jsx(w, { variant: "secondary", children: D }),
                                R &&
                                  !u &&
                                  e.jsx(w, { variant: "outline", children: "Multi-sucursal" }),
                                a?.is_active !== !1 &&
                                  e.jsxs(w, {
                                    variant: "outline",
                                    className: "gap-1 text-emerald-500",
                                    children: [e.jsx(ye, { className: "h-3 w-3" }), " Activo"],
                                  }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    E &&
                      !u &&
                      e.jsxs("div", {
                        className:
                          "flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm",
                        children: [
                          e.jsx(q, { className: "h-4 w-4 text-primary" }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("p", {
                                className:
                                  "text-[10px] uppercase tracking-wider text-muted-foreground",
                                children: "Holding",
                              }),
                              e.jsx("p", { className: "font-medium", children: E }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
                e.jsxs("div", {
                  className: "grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-5",
                      children: [
                        e.jsxs(x, {
                          children: [
                            e.jsx(p, {
                              className: "pb-3",
                              children: e.jsxs(h, {
                                className: "flex items-center gap-2 text-base",
                                children: [
                                  e.jsx(we, { className: "h-4 w-4 text-primary" }),
                                  " Datos personales",
                                ],
                              }),
                            }),
                            e.jsxs(j, {
                              className: "grid gap-4 sm:grid-cols-2",
                              children: [
                                e.jsxs("div", {
                                  className: "space-y-1.5",
                                  children: [
                                    e.jsx(n, { children: "Nombre" }),
                                    e.jsx(c, { value: _, onChange: (s) => A(s.target.value) }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-1.5",
                                  children: [
                                    e.jsx(n, { children: "Apellido" }),
                                    e.jsx(c, { value: P, onChange: (s) => S(s.target.value) }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-1.5",
                                  children: [
                                    e.jsx(n, { children: "Correo" }),
                                    e.jsx(c, {
                                      type: "email",
                                      value: b,
                                      onChange: (s) => L(s.target.value),
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-1.5",
                                  children: [
                                    e.jsx(n, { children: "Usuario" }),
                                    e.jsx(c, { value: v, onChange: (s) => U(s.target.value) }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-1.5 sm:col-span-2",
                                  children: [
                                    e.jsx(n, { children: "RUT / DNI" }),
                                    e.jsx(c, { value: k, onChange: (s) => M(s.target.value) }),
                                  ],
                                }),
                                e.jsx("div", {
                                  className: "sm:col-span-2",
                                  children: e.jsxs(C, {
                                    onClick: Q,
                                    disabled: N.isPending,
                                    children: [
                                      N.isPending &&
                                        e.jsx(I, { className: "mr-2 h-4 w-4 animate-spin" }),
                                      "Guardar cambios",
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs(x, {
                          children: [
                            e.jsx(p, {
                              className: "pb-3",
                              children: e.jsxs(h, {
                                className: "flex items-center gap-2 text-base",
                                children: [
                                  e.jsx(Ce, { className: "h-4 w-4 text-primary" }),
                                  " Seguridad",
                                ],
                              }),
                            }),
                            e.jsxs(j, {
                              className: "space-y-4",
                              children: [
                                e.jsx("p", {
                                  className: "text-sm text-muted-foreground",
                                  children:
                                    "Cambia tu contraseña ingresando primero la contraseña actual.",
                                }),
                                e.jsxs("div", {
                                  className: "grid gap-4 sm:grid-cols-3",
                                  children: [
                                    e.jsxs("div", {
                                      className: "space-y-1.5",
                                      children: [
                                        e.jsx(n, { children: "Contraseña actual" }),
                                        e.jsx(c, {
                                          type: "password",
                                          value: y,
                                          onChange: (s) => O(s.target.value),
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "space-y-1.5",
                                      children: [
                                        e.jsx(n, { children: "Nueva contraseña" }),
                                        e.jsx(c, {
                                          type: "password",
                                          value: o,
                                          onChange: (s) => z(s.target.value),
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "space-y-1.5",
                                      children: [
                                        e.jsx(n, { children: "Confirmar" }),
                                        e.jsx(c, {
                                          type: "password",
                                          value: d,
                                          onChange: (s) => B(s.target.value),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs(C, {
                                  variant: "outline",
                                  onClick: X,
                                  disabled: f.isPending,
                                  children: [
                                    f.isPending &&
                                      e.jsx(I, { className: "mr-2 h-4 w-4 animate-spin" }),
                                    "Actualizar contraseña",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-5",
                      children: [
                        e.jsxs(x, {
                          children: [
                            e.jsx(p, {
                              className: "pb-3",
                              children: e.jsx(h, {
                                className: "text-base",
                                children: "Acceso y rol",
                              }),
                            }),
                            e.jsxs(j, {
                              className: "space-y-3",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("p", {
                                      className: "text-xs text-muted-foreground",
                                      children: "Tipo de cuenta",
                                    }),
                                    e.jsx("p", { className: "text-sm font-medium", children: D }),
                                  ],
                                }),
                                e.jsx(T, {}),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("p", {
                                      className: "text-xs text-muted-foreground",
                                      children: "Último acceso",
                                    }),
                                    e.jsx("p", {
                                      className: "text-sm",
                                      children: Se(a?.last_login),
                                    }),
                                  ],
                                }),
                                $.length > 0 &&
                                  e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(T, {}),
                                      e.jsx("div", {
                                        className: "space-y-1",
                                        children: $.map(({ to: s, label: Y, icon: ee }) =>
                                          e.jsx(
                                            C,
                                            {
                                              variant: "ghost",
                                              className: "w-full justify-start",
                                              asChild: !0,
                                              children: e.jsxs(se, {
                                                to: s,
                                                children: [
                                                  e.jsx(ee, {
                                                    className: "mr-2 h-4 w-4 text-muted-foreground",
                                                  }),
                                                  Y,
                                                  e.jsx(_e, {
                                                    className:
                                                      "ml-auto h-4 w-4 text-muted-foreground",
                                                  }),
                                                ],
                                              }),
                                            },
                                            s,
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                        !u &&
                          m.length > 0 &&
                          e.jsxs(x, {
                            children: [
                              e.jsx(p, {
                                className: "pb-3",
                                children: e.jsx(h, {
                                  className: "text-base",
                                  children: R ? "Mis sucursales" : "Mi sucursal",
                                }),
                              }),
                              e.jsx(j, {
                                className: "space-y-2",
                                children: m.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5",
                                      children: [
                                        e.jsxs("div", {
                                          className: "min-w-0",
                                          children: [
                                            e.jsx("p", {
                                              className: "truncate text-sm font-medium",
                                              children:
                                                s.branch_name ||
                                                s.business_name ||
                                                `Sucursal ${s.branch_id}`,
                                            }),
                                            e.jsx("p", {
                                              className: "text-xs text-muted-foreground",
                                              children: H(s),
                                            }),
                                          ],
                                        }),
                                        e.jsx(F, {
                                          className: "h-4 w-4 shrink-0 text-muted-foreground",
                                        }),
                                      ],
                                    },
                                    `${s.branch_id}-${s.role_code || s.role}`,
                                  ),
                                ),
                              }),
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            "content",
          ),
  });
}
export { Re as default };
