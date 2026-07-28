import { j as e, r, aw as qs, af as $s, ag as Ms, ah as Ue } from "./vendor-react-DUYfdZnL.js";
import {
  U as v,
  V as B,
  c as te,
  ai as Us,
  am as Hs,
  a7 as c,
  dQ as Ks,
  dR as gs,
  dS as Fs,
  dT as fs,
  dU as Js,
  dV as Vs,
  dW as ds,
  aS as Gs,
  cI as js,
  a5 as ae,
  B as A,
  K as F,
  bw as ke,
  aa as vs,
  ab as Ns,
  ac as ys,
  ad as bs,
  dX as Xs,
  di as _s,
  dY as ks,
  cq as Ys,
  dZ as Ws,
  d_ as Qs,
  d$ as Zs,
  e0 as ea,
  F as sa,
  a9 as Cs,
  a3 as Ss,
  W as re,
  X as oe,
  Y as le,
  Z as ie,
  $ as G,
  a0 as W,
  dt as Ve,
  ak as ws,
  d5 as aa,
  cY as X,
  cZ as J,
  e1 as ta,
  dN as na,
  M as Fe,
  a6 as Je,
  dJ as us,
  dK as ra,
  e2 as oa,
  dL as la,
  i as ia,
  d as ca,
  e3 as da,
  ag as ua,
  e4 as ma,
  e5 as xa,
  j as pa,
  k as ha,
  cH as ga,
  b as fa,
  cC as ms,
  cx as xs,
  dP as ja,
  b1 as va,
  dD as Na,
  b2 as ya,
  b3 as ba,
  b4 as _a,
  b5 as ka,
  b6 as Ca,
  b7 as Sa,
  b8 as wa,
  T as Ea,
  N as Aa,
  O as je,
  e6 as Pa,
  e7 as Ta,
  bU as Ia,
  Q as ve,
  R as La,
  dz as ps,
  ae as Da,
  e8 as za,
} from "./studio-chat-BBQUCckT.js";
import {
  r as Ge,
  A as Ie,
  a as Es,
  c as me,
  n as Ba,
  H as As,
  f as Oa,
  b as Ra,
} from "./external-api-Dqhtjsyy.js";
import { d as qa } from "./admin-CJj1SvsI.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./vendor-charts-l0_txfiz.js";
function $a({ value: a, label: n }) {
  const [u, m] = r.useState(!1);
  return (
    r.useEffect(() => {
      if (!u) return;
      const o = window.setTimeout(() => m(!1), 1400);
      return () => window.clearTimeout(o);
    }, [u]),
    e.jsx("button", {
      type: "button",
      className:
        "inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/60",
      title: `Copiar «${a}»`,
      onClick: async () => {
        (await qa(a))
          ? (m(!0), c.success(n ? `Copiado: ${n}` : "Copiado"))
          : c.error("No se pudo copiar");
      },
      children: u
        ? e.jsx(Us, { className: "h-3 w-3 text-primary" })
        : e.jsx(Hs, { className: "h-3 w-3" }),
    })
  );
}
function Ps({
  authType: a,
  fieldsFromApi: n,
  apiHints: u,
  values: m,
  onChange: o,
  connected: N,
  className: k,
}) {
  const h = Ge(a, n, u),
    y = Ie[a || ""] || a || "Auth",
    T = /nubox/i.test(`${u?.baseUrl || ""} ${u?.name || ""}`);
  return h.length === 0
    ? e.jsx("div", {
        className:
          "rounded-lg border border-dashed border-border/70 px-3 py-4 text-xs text-muted-foreground text-center",
        children: "Este tipo de auth no define campos de credenciales.",
      })
    : e.jsxs("div", {
        className: te("space-y-3", k),
        children: [
          e.jsxs("div", {
            className:
              "rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground space-y-0.5",
            children: [
              e.jsxs("p", {
                children: [
                  "Auth: ",
                  e.jsx("span", { className: "text-foreground font-medium", children: y }),
                ],
              }),
              e.jsx("p", { className: "leading-relaxed", children: Es[a || ""] || "" }),
              T &&
                e.jsxs("p", {
                  className: "leading-relaxed text-foreground/90",
                  children: [
                    "Nubox Pyme usa auth dual: ",
                    e.jsx("strong", { className: "font-medium", children: "Bearer del partner" }),
                    " +",
                    " ",
                    e.jsx("strong", { className: "font-medium", children: "X-Api-Key" }),
                    " de la empresa. Si solo pegas una, la API responde 401 Unauthorized.",
                  ],
                }),
              e.jsx("p", {
                className: "pt-0.5",
                children:
                  "Pega los valores del proveedor. Puedes copiar el nombre de cada campo con el ícono.",
              }),
            ],
          }),
          e.jsx("div", {
            className: "grid gap-3",
            children: h.map((t) => {
              const g =
                  t.format === "password" || /password|secret|token|key|api_key/i.test(t.name)
                    ? "password"
                    : t.format === "email" || /email/i.test(t.name)
                      ? "email"
                      : "text",
                _ = t.label || t.name.replace(/[_-]+/g, " ");
              return e.jsxs(
                "div",
                {
                  className: "space-y-1.5",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-1",
                      children: [
                        e.jsxs(v, {
                          className: "text-xs",
                          children: [
                            _,
                            t.required !== !1 &&
                              e.jsx("span", { className: "text-destructive", children: " *" }),
                          ],
                        }),
                        e.jsxs("span", {
                          className: "font-mono text-[10px] text-muted-foreground",
                          children: ["(", t.name, ")"],
                        }),
                        e.jsx($a, { value: t.name, label: _ }),
                      ],
                    }),
                    t.hint &&
                      e.jsx("p", {
                        className: "text-[10px] text-muted-foreground leading-snug",
                        children: t.hint,
                      }),
                    e.jsx(B, {
                      type: g,
                      autoComplete: "off",
                      className: "h-9 font-mono text-sm",
                      value: m[t.name] ?? "",
                      onChange: (f) => o(t.name, f.target.value),
                      placeholder:
                        N && g === "password"
                          ? "•••••••• (vacío = no cambiar)"
                          : `Pega ${_.toLowerCase()}…`,
                    }),
                  ],
                },
                t.name,
              );
            }),
          }),
        ],
      });
}
function Ma(a) {
  if (!a) return "—";
  try {
    return new Date(a).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return a;
  }
}
function Ua(a, n, u) {
  const m = new Set();
  for (const o of n) o.is_active !== !1 && m.add(String(o.branch));
  if (m.size === 0 && !u) for (const o of a.branches ?? []) m.add(String(o));
  return Array.from(m);
}
function Ha({ api: a, branchOptions: n, canManage: u, onSaved: m }) {
  const o = u ?? Ks(),
    N = gs(),
    {
      data: k = [],
      refetch: h,
      isLoading: y,
      isFetched: T,
      isError: t,
      error: g,
    } = Fs(String(a.id)),
    _ = me(a),
    { data: f } = fs(_ ? String(a.id) : void 0),
    I = Js(),
    D = Vs(),
    [M, L] = r.useState(""),
    [i, d] = r.useState(null),
    [P, R] = r.useState(null),
    [xe, ce] = r.useState({}),
    de = r.useMemo(() => Ua(a, k, T && !t), [a, k, T, t]),
    H = i ?? de;
  r.useEffect(() => {
    if (i == null) return;
    const x = [...i].sort().join(","),
      p = [...de].sort().join(",");
    x === p && d(null);
  }, [i, de]);
  const pe = r.useMemo(() => {
      const x = new Map();
      for (const p of k) x.set(String(p.branch), p);
      return x;
    }, [k]),
    K = r.useMemo(
      () => Ge(a.auth_type, f?.fields, { baseUrl: a.base_url, name: a.name }),
      [a.auth_type, a.base_url, a.name, f?.fields],
    );
  r.useEffect(() => {
    const x = {};
    for (const p of K) x[p.name] = "";
    ce(x);
  }, [K, P]);
  const Q = r.useMemo(() => {
      const x = M.trim().toLowerCase();
      return x ? n.filter((p) => p.label.toLowerCase().includes(x)) : n;
    }, [n, M]),
    Z = (x) => {
      (d(x),
        N.mutate(
          { id: a.id, data: { branches: x } },
          {
            onSuccess: () => {
              (c.success(
                x.length === 0
                  ? "App sin instalaciones"
                  : `Instalada en ${x.length} sucursal${x.length === 1 ? "" : "es"}`,
              ),
                h(),
                m?.());
            },
            onError: (p) => {
              (d(null),
                c.error(p?.friendlyMessage || "No se pudieron actualizar las instalaciones"));
            },
          },
        ));
    },
    U = (x) => {
      if (!o) return;
      const p = H.includes(x) ? H.filter((C) => C !== x) : [...H, x];
      Z(p);
    },
    E = n.find((x) => x.id === P) ?? null,
    O = P ? pe.get(P) : void 0,
    q = !!O?.has_credentials,
    ee = ds(P),
    Y = () => {
      if (!O?.id) {
        c.error("No hay instalación para esta sucursal");
        return;
      }
      const x = {};
      for (const p of K) {
        const C = (xe[p.name] ?? "").trim();
        if (!C && p.required !== !1) {
          c.error(`Completa «${p.label || p.name}»`);
          return;
        }
        C && (x[p.name] = C);
      }
      if (Object.keys(x).length === 0 && q) {
        c.error("Ingresa al menos un valor para actualizar");
        return;
      }
      I.mutate(
        { id: O.id, credentials: x },
        {
          onSuccess: (p) => {
            if (p.success === !1) {
              const j = p.error || "No se pudo conectar",
                se = /401|unauthorized/i.test(j);
              (c.error(
                se
                  ? "Nubox/API rechazó las credenciales (401). Revisa partner Bearer + company API key."
                  : j,
              ),
                h());
              return;
            }
            const C = p.installation?.last_error;
            if (C && /401|unauthorized/i.test(C)) {
              (c.error(
                "Credenciales guardadas pero la API respondió 401. Nubox exige Token partner (Bearer) y X-Api-Key de empresa.",
              ),
                h());
              return;
            }
            (c.success("Cuenta de servicio conectada"), R(null), h(), m?.());
          },
          onError: (p) => {
            const C = p?.friendlyMessage || p?.message || "No se pudo conectar la cuenta";
            (c.error(
              /401|unauthorized/i.test(C)
                ? "401 Unauthorized: token partner o company API key inválidos / incompletos."
                : C,
            ),
              h());
          },
        },
      );
    },
    ne = () => {
      O?.id &&
        D.mutate(O.id, {
          onSuccess: () => {
            (c.success("Cuenta desconectada"), R(null), h(), m?.());
          },
          onError: () => c.error("No se pudo desconectar"),
        });
    };
  if (n.length === 0)
    return e.jsxs("section", {
      className: "rounded-xl border border-dashed border-border/80 py-10 text-center space-y-2",
      children: [
        e.jsx(Gs, { className: "h-8 w-8 mx-auto text-muted-foreground/60" }),
        e.jsx("p", { className: "text-sm font-medium", children: "Sin sucursales disponibles" }),
        e.jsx("p", {
          className: "text-xs text-muted-foreground max-w-sm mx-auto",
          children: "No hay sucursales en tu alcance para instalar esta aplicación.",
        }),
      ],
    });
  const V = N.isPending;
  return e.jsxs("section", {
    className: "space-y-5",
    children: [
      e.jsxs("div", {
        className: "border-b border-border/60 pb-3 space-y-1",
        children: [
          e.jsxs("h2", {
            className: "text-sm font-medium flex items-center gap-2",
            children: [
              e.jsx(js, { className: "h-4 w-4 text-primary" }),
              "Instalaciones",
              V ? e.jsx(ae, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }) : null,
            ],
          }),
          e.jsxs("p", {
            className: "text-xs text-muted-foreground max-w-2xl leading-relaxed",
            children: [
              o
                ? "Toca una sucursal para instalar o desinstalar. "
                : "Solo puedes configurar la cuenta de servicio en tus sucursales. ",
              _
                ? e.jsxs(e.Fragment, {
                    children: [
                      "En cada instalación instalada usa",
                      " ",
                      e.jsx("strong", {
                        className: "text-foreground font-medium",
                        children: "Conectar cuenta de servicio",
                      }),
                      " ",
                      "para pegar API key, token o login (según el proveedor).",
                      !Ba(a.auth_type, { authEndpointKey: a.auth_endpoint_key }) &&
                        e.jsx("span", {
                          className: "block mt-1 text-warning",
                          children:
                            "El catálogo marca esta app como «abierta»; igual puedes cargar credenciales aquí. Ideal: en Configuración cambia Auth a API Key o Login y guarda.",
                        }),
                    ],
                  })
                : "Esta app no requiere credenciales por sucursal.",
            ],
          }),
        ],
      }),
      t &&
        e.jsxs("div", {
          className:
            "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive space-y-1",
          children: [
            e.jsx("p", {
              className: "font-medium",
              children: "No se pudieron cargar las instalaciones",
            }),
            e.jsx("p", {
              className: "text-destructive/90",
              children: g?.friendlyMessage || "El endpoint de instalaciones no respondió.",
            }),
            e.jsx(A, {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "mt-1",
              onClick: () => {
                h();
              },
              children: "Reintentar",
            }),
          ],
        }),
      e.jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-2",
        children: [
          e.jsxs(F, {
            variant: "outline",
            className: "text-[11px] font-normal",
            children: [H.length, " instalada", H.length === 1 ? "" : "s"],
          }),
          o &&
            e.jsxs("div", {
              className: "flex items-center gap-2 text-[11px]",
              children: [
                e.jsx("button", {
                  type: "button",
                  className: "text-primary hover:underline disabled:opacity-50",
                  disabled: V,
                  onClick: () => Z(n.map((x) => x.id)),
                  children: "Instalar en todas",
                }),
                e.jsx("span", { className: "text-muted-foreground", children: "·" }),
                e.jsx("button", {
                  type: "button",
                  className: "text-muted-foreground hover:underline disabled:opacity-50",
                  disabled: V || H.length === 0,
                  onClick: () => Z([]),
                  children: "Ninguna",
                }),
              ],
            }),
        ],
      }),
      n.length > 6 &&
        e.jsx(B, {
          value: M,
          onChange: (x) => L(x.target.value),
          placeholder: "Buscar sucursal…",
          className: "h-9 max-w-sm",
        }),
      e.jsx("div", {
        className: "grid gap-2 sm:grid-cols-2",
        children: Q.map((x) => {
          const p = H.includes(x.id),
            C = pe.get(x.id),
            j = !!(C?.needs_reconnect || C?.credentials_unreadable),
            se = !!C?.has_credentials && !j,
            l = ds(x.id);
          return e.jsxs(
            "div",
            {
              className: te(
                "flex flex-col gap-2 rounded-xl border px-3 py-3 transition-colors",
                p ? "border-primary/40 bg-primary/8" : "border-border/70 bg-card/40",
              ),
              children: [
                e.jsxs("button", {
                  type: "button",
                  disabled: !o || V,
                  onClick: () => U(x.id),
                  className: te(
                    "flex items-start gap-3 text-left w-full",
                    (!o || V) && "cursor-default",
                  ),
                  children: [
                    e.jsx("span", {
                      className: te(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                        p
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40",
                      ),
                      children: p ? "✓" : "",
                    }),
                    e.jsxs("span", {
                      className: "min-w-0 flex-1 space-y-0.5",
                      children: [
                        e.jsx("span", {
                          className: "block text-sm font-medium truncate",
                          children: x.label,
                        }),
                        e.jsx("span", {
                          className: "block text-[11px] text-muted-foreground",
                          children: p
                            ? o
                              ? "Instalada — toca para desinstalar"
                              : "Instalada en esta sucursal"
                            : o
                              ? "No instalada — toca para instalar"
                              : "No instalada",
                        }),
                      ],
                    }),
                  ],
                }),
                p &&
                  _ &&
                  e.jsxs("div", {
                    className: "flex flex-col gap-1.5 pl-7",
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                          e.jsx(F, {
                            variant: j ? "destructive" : se ? "default" : "secondary",
                            className: "text-[10px] font-normal",
                            children: j
                              ? "Credenciales inválidas — reconectar"
                              : se
                                ? `Con cuenta: ${C?.label || "servicio"}`
                                : "Sin cuenta",
                          }),
                          l &&
                            e.jsxs("button", {
                              type: "button",
                              className:
                                "inline-flex items-center gap-1 text-[11px] text-primary hover:underline disabled:opacity-50",
                              disabled: y || t,
                              onClick: () => {
                                if (!C?.id) {
                                  (c.error(
                                    "Todavía no hay fila de instalación. Reintenta cargar o reinstala.",
                                  ),
                                    h());
                                  return;
                                }
                                R(x.id);
                              },
                              children: [
                                e.jsx(ke, { className: "h-3 w-3" }),
                                j
                                  ? "Reconectar cuenta"
                                  : se
                                    ? "Gestionar cuenta"
                                    : "Conectar cuenta de servicio",
                              ],
                            }),
                        ],
                      }),
                      j &&
                        e.jsx("p", {
                          className: "text-[11px] text-destructive/90 leading-snug",
                          children:
                            C?.last_error ||
                            "Las credenciales no se pueden leer. Vuelve a conectar la cuenta.",
                        }),
                      !j &&
                        C?.last_error &&
                        e.jsx("p", {
                          className: "text-[11px] text-destructive/90 leading-snug",
                          children: C.last_error,
                        }),
                    ],
                  }),
              ],
            },
            x.id,
          );
        }),
      }),
      e.jsx(vs, {
        open: P != null,
        onOpenChange: (x) => {
          x || R(null);
        },
        children: e.jsxs(Ns, {
          className: "sm:max-w-md",
          children: [
            e.jsxs(ys, {
              children: [
                e.jsx(bs, { className: "text-base", children: "Cuenta de la instalación" }),
                e.jsxs(Xs, {
                  className: "text-xs",
                  children: [
                    "Credenciales de servicio para",
                    " ",
                    e.jsx("strong", {
                      className: "text-foreground font-medium",
                      children: E?.label ?? "esta sucursal",
                    }),
                    ". Las usan los agentes; no es tu cuenta personal de prueba.",
                  ],
                }),
              ],
            }),
            q &&
              e.jsxs("div", {
                className:
                  "rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs space-y-1",
                children: [
                  e.jsx("p", {
                    className: "font-medium",
                    children: O?.label || "Cuenta conectada",
                  }),
                  e.jsxs("p", {
                    className: "text-muted-foreground",
                    children: ["Última verificación: ", Ma(O?.last_verified_at)],
                  }),
                  O?.last_error
                    ? e.jsx("p", { className: "text-destructive", children: O.last_error })
                    : null,
                ],
              }),
            e.jsx(Ps, {
              authType: a.auth_type,
              fieldsFromApi: f?.fields,
              apiHints: { baseUrl: a.base_url, name: a.name },
              values: xe,
              connected: q,
              onChange: (x, p) => ce((C) => ({ ...C, [x]: p })),
            }),
            e.jsxs(_s, {
              className: "gap-2 sm:gap-0",
              children: [
                q &&
                  O?.id &&
                  ee &&
                  e.jsxs(A, {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "text-destructive hover:text-destructive sm:mr-auto",
                    disabled: D.isPending || I.isPending,
                    onClick: ne,
                    children: [
                      D.isPending
                        ? e.jsx(ae, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" })
                        : e.jsx(ks, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Quitar cuenta",
                    ],
                  }),
                ee &&
                  e.jsxs(A, {
                    type: "button",
                    size: "sm",
                    disabled: I.isPending || !O?.id,
                    onClick: Y,
                    children: [
                      I.isPending
                        ? e.jsx(ae, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" })
                        : e.jsx(ke, { className: "h-3.5 w-3.5 mr-1.5" }),
                      "Conectar y probar",
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function Ka(a) {
  if (!a) return "—";
  try {
    return new Date(a).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return a;
  }
}
function Fa({ api: a }) {
  const n = String(a.id),
    u = Ys(),
    m = me(a),
    { data: o, isLoading: N, refetch: k } = Ws(m ? n : void 0),
    { data: h, isLoading: y } = fs(m ? n : void 0),
    T = Qs(),
    t = Zs(),
    g = r.useMemo(
      () => Ge(a.auth_type, h?.fields, { baseUrl: a.base_url, name: a.name }),
      [a.auth_type, a.base_url, a.name, h?.fields],
    ),
    [_, f] = r.useState({});
  r.useEffect(() => {
    const L = {};
    for (const i of g) L[i.name] = "";
    f(L);
  }, [g, n]);
  const I = !!o?.is_connected,
    D = () => {
      const L = {};
      for (const i of g) {
        const d = (_[i.name] ?? "").trim();
        if (!d && i.required !== !1) {
          c.error(`Completa «${i.label || i.name}»`);
          return;
        }
        d && (L[i.name] = d);
      }
      T.mutate(
        { external_api: n, credentials: L, ...(u != null ? { branch: u } : {}) },
        {
          onSuccess: (i) => {
            i.success
              ? (c.success("Cuenta de prueba conectada"),
                f((d) => {
                  const P = { ...d };
                  for (const R of Object.keys(P))
                    /password|secret|token|key|api_key/i.test(R) && (P[R] = "");
                  return P;
                }),
                k())
              : (c.error(i.error || "No se pudo conectar"), k());
          },
          onError: (i) => {
            (c.error(i?.friendlyMessage || "No se pudo conectar la cuenta de prueba"), k());
          },
        },
      );
    },
    M = () => {
      o?.id &&
        t.mutate(o.id, {
          onSuccess: () => {
            (c.success("Cuenta de prueba desconectada"), k());
          },
          onError: () => c.error("No se pudo desconectar"),
        });
    };
  return m
    ? e.jsxs("section", {
        className: "space-y-5",
        children: [
          e.jsxs("div", {
            className:
              "flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsxs("h2", {
                    className: "text-sm font-medium flex items-center gap-2",
                    children: [
                      e.jsx(ke, { className: "h-4 w-4 text-primary" }),
                      "Cuenta de prueba · ",
                      a.name,
                    ],
                  }),
                  e.jsxs("p", {
                    className: "text-xs text-muted-foreground mt-0.5 max-w-xl",
                    children: [
                      "Credenciales ",
                      e.jsx("strong", {
                        className: "text-foreground font-medium",
                        children: "tuyas",
                      }),
                      " solo para Studio / Probar. Los agentes no las usan: ellos van con la",
                      " ",
                      e.jsx("strong", {
                        className: "text-foreground font-medium",
                        children: "cuenta de servicio",
                      }),
                      " de la pestaña Instalación.",
                    ],
                  }),
                ],
              }),
              e.jsx(F, {
                variant: I ? "default" : "secondary",
                className: "text-[10px] self-start",
                children: I ? "Conectada" : "Sin conectar",
              }),
            ],
          }),
          N || y
            ? e.jsxs("div", {
                className: "flex items-center gap-2 text-xs text-muted-foreground py-4",
                children: [e.jsx(ae, { className: "h-4 w-4 animate-spin" }), " Cargando…"],
              })
            : e.jsxs(e.Fragment, {
                children: [
                  I &&
                    e.jsxs("div", {
                      className:
                        "rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs space-y-1",
                      children: [
                        e.jsxs("p", {
                          className: "flex items-center gap-1.5 font-medium",
                          children: [
                            e.jsx(ea, { className: "h-3.5 w-3.5 text-primary" }),
                            o?.label || "Cuenta de prueba guardada",
                          ],
                        }),
                        e.jsxs("p", {
                          className: "text-muted-foreground",
                          children: ["Última verificación: ", Ka(o?.last_verified_at)],
                        }),
                        o?.last_error
                          ? e.jsx("p", { className: "text-destructive", children: o.last_error })
                          : null,
                      ],
                    }),
                  e.jsx(Ps, {
                    authType: a.auth_type,
                    fieldsFromApi: h?.fields,
                    apiHints: { baseUrl: a.base_url, name: a.name },
                    values: _,
                    connected: I,
                    className: "max-w-2xl",
                    onChange: (L, i) => f((d) => ({ ...d, [L]: i })),
                  }),
                  e.jsxs("div", {
                    className: "flex flex-wrap gap-2",
                    children: [
                      e.jsxs(A, {
                        type: "button",
                        size: "sm",
                        disabled: T.isPending,
                        onClick: D,
                        children: [
                          T.isPending
                            ? e.jsx(ae, { className: "h-4 w-4 mr-1.5 animate-spin" })
                            : e.jsx(ke, { className: "h-4 w-4 mr-1.5" }),
                          I ? "Actualizar y probar" : "Conectar y probar",
                        ],
                      }),
                      I &&
                        e.jsxs(A, {
                          type: "button",
                          size: "sm",
                          variant: "outline",
                          className: "text-destructive hover:text-destructive",
                          disabled: t.isPending,
                          onClick: M,
                          children: [
                            t.isPending
                              ? e.jsx(ae, { className: "h-4 w-4 mr-1.5 animate-spin" })
                              : e.jsx(ks, { className: "h-4 w-4 mr-1.5" }),
                            "Desconectar",
                          ],
                        }),
                    ],
                  }),
                ],
              }),
        ],
      })
    : null;
}
function Ja(a) {
  const n = X(a, "headers");
  return n.ok
    ? Object.entries(n.value).some(
        ([u, m]) => u.toLowerCase() === "authorization" && String(m).includes("{{auth_token}}"),
      )
    : !1;
}
function Va(a, n) {
  const u = X(a || "{}", "headers"),
    m = u.ok ? { ...u.value } : {},
    o = Object.keys(m).find((N) => N.toLowerCase() === "authorization") ?? "Authorization";
  return (n ? (m[o] = "Bearer {{auth_token}}") : delete m[o], J(m));
}
const Ga = {
    GET: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    POST: "border-primary/40 text-primary bg-primary/10",
    PUT: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    PATCH: "border-sky-500/40 text-sky-400 bg-sky-500/10",
    DELETE: "border-destructive/40 text-destructive bg-destructive/10",
  },
  hs = () => ({
    key: "",
    method: "GET",
    path: "/",
    queryParams: "{}",
    headers: "{}",
    body: "{}",
    responseMapping: "{}",
  });
function Xa(a, n) {
  return {
    key: a,
    method: (n.method || "GET").toUpperCase(),
    path: n.path || "/",
    queryParams: J(n.query_params ?? {}),
    headers: J(n.headers ?? {}),
    body: J(n.body ?? {}),
    responseMapping: J(n.response_mapping ?? {}),
  };
}
function Ya(a) {
  if (!a.key.trim()) return (c.error("La clave del endpoint es obligatoria"), null);
  if (!/^[a-zA-Z0-9_\- ]+$/.test(a.key.trim()))
    return (c.error("Clave inválida (letras, números, espacios, _ -)"), null);
  const n = a.path.trim();
  if (!n.startsWith("/")) return (c.error("El path debe empezar con /"), null);
  if (n.includes("://")) return (c.error("Usa path relativo, no URL absoluta"), null);
  const u = X(a.queryParams, "query_params");
  if (!u.ok) return (c.error(u.error), null);
  const m = X(a.headers, "headers");
  if (!m.ok) return (c.error(m.error), null);
  const o = ta(a.body, "body");
  if (!o.ok) return (c.error(o.error), null);
  const N = X(a.responseMapping, "response_mapping");
  return N.ok
    ? {
        method: a.method.toUpperCase(),
        path: n,
        query_params: u.value,
        headers: m.value,
        body: o.value,
        response_mapping: N.value,
      }
    : (c.error(N.error), null);
}
function Wa({
  endpoints: a,
  canManage: n,
  saving: u,
  onSave: m,
  embedded: o = !1,
  authEndpointKey: N = "",
}) {
  const k = r.useMemo(() => Object.entries(a), [a]),
    [h, y] = r.useState(!1),
    [T, t] = r.useState(null),
    [g, _] = r.useState(hs),
    f = !!N && g.key.trim() === N.trim(),
    I = () => {
      (t(null), _(hs()), y(!0));
    },
    D = (i) => {
      (t(i), _(Xa(i, a[i] ?? {})), y(!0));
    },
    M = () => {
      const i = Ya(g);
      if (!i) return;
      const d = g.key.trim(),
        P = { ...a };
      if (T && T !== d) {
        if (P[d]) {
          c.error(`Ya existe un endpoint «${d}»`);
          return;
        }
        delete P[T];
      } else if (!T && P[d]) {
        c.error(`Ya existe un endpoint «${d}»`);
        return;
      }
      ((P[d] = i), m(P), y(!1));
    },
    L = (i) => {
      const d = { ...a };
      (delete d[i], m(d));
    };
  return e.jsxs("section", {
    className: "space-y-3",
    children: [
      e.jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
        children: [
          e.jsxs("div", {
            children: [
              !o &&
                e.jsxs("h2", {
                  className: "text-sm font-medium",
                  children: ["Endpoints (", k.length, ")"],
                }),
              e.jsxs("p", {
                className: te("text-xs text-muted-foreground", !o && "mt-0.5"),
                children: [
                  "Rutas de la aplicación para skills. Placeholders",
                  " ",
                  e.jsx("code", { className: "text-[10px]", children: "{{nombre}}" }),
                  " se rellenan con args o credenciales de auth.",
                ],
              }),
            ],
          }),
          n &&
            e.jsxs(A, {
              size: "sm",
              onClick: I,
              children: [e.jsx(sa, { className: "h-4 w-4 mr-1.5" }), " Nuevo endpoint"],
            }),
        ],
      }),
      k.length === 0
        ? e.jsxs("p", {
            className: "text-sm text-muted-foreground py-6 text-center",
            children: [
              "No hay endpoints.",
              " ",
              n ? "Crea el primero para poder probarlo y usarlo en funciones." : "",
            ],
          })
        : e.jsx("div", {
            className: "divide-y divide-border/60",
            children: k.map(([i, d]) => {
              const P = (d.method || "GET").toUpperCase();
              return e.jsx(
                "div",
                {
                  className: "py-3 first:pt-0 last:pb-0",
                  children: e.jsxs("div", {
                    className: "flex flex-wrap items-start gap-2",
                    children: [
                      e.jsxs("div", {
                        className: "min-w-0 flex-1 space-y-1",
                        children: [
                          e.jsxs("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                              e.jsx(F, {
                                variant: "outline",
                                className: te(
                                  "text-[10px] font-mono font-medium",
                                  Ga[P] || "text-muted-foreground",
                                ),
                                children: P,
                              }),
                              e.jsx("span", { className: "font-medium text-sm", children: i }),
                            ],
                          }),
                          e.jsx("p", {
                            className: "text-xs font-mono text-muted-foreground break-all",
                            children: d.path ?? "—",
                          }),
                        ],
                      }),
                      n &&
                        e.jsxs("div", {
                          className: "flex gap-1 shrink-0",
                          children: [
                            e.jsx(A, {
                              variant: "ghost",
                              size: "icon",
                              className: "h-8 w-8",
                              onClick: () => D(i),
                              title: "Editar",
                              children: e.jsx(Cs, { className: "h-3.5 w-3.5" }),
                            }),
                            e.jsx(A, {
                              variant: "ghost",
                              size: "icon",
                              className: "h-8 w-8 text-destructive",
                              disabled: u,
                              onClick: () => L(i),
                              title: "Eliminar",
                              children: e.jsx(Ss, { className: "h-3.5 w-3.5" }),
                            }),
                          ],
                        }),
                    ],
                  }),
                },
                i,
              );
            }),
          }),
      e.jsx(vs, {
        open: h,
        onOpenChange: y,
        children: e.jsxs(Ns, {
          className: "max-w-lg max-h-[90vh] overflow-y-auto",
          children: [
            e.jsx(ys, {
              children: e.jsx(bs, { children: T ? "Editar endpoint" : "Nuevo endpoint" }),
            }),
            e.jsxs("div", {
              className: "space-y-3",
              children: [
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(v, { children: "Clave" }),
                    e.jsx(B, {
                      value: g.key,
                      onChange: (i) => _((d) => ({ ...d, key: i.target.value })),
                      placeholder: "ej: listar_items",
                      className: "font-mono text-sm",
                    }),
                    e.jsx("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: "Identificador usado por las skills (`config.endpoint_type`).",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "grid grid-cols-2 gap-3",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Método" }),
                        e.jsxs(re, {
                          value: g.method,
                          onValueChange: (i) => _((d) => ({ ...d, method: i })),
                          children: [
                            e.jsx(oe, { children: e.jsx(le, {}) }),
                            e.jsx(ie, {
                              children: As.map((i) => e.jsx(G, { value: i, children: i }, i)),
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Path" }),
                        e.jsx(B, {
                          value: g.path,
                          onChange: (i) => _((d) => ({ ...d, path: i.target.value })),
                          placeholder: "/v1/recursos/",
                          className: "font-mono text-sm",
                        }),
                        e.jsxs("p", {
                          className: "text-[11px] text-muted-foreground",
                          children: [
                            "Relativo a la Base URL. Variables:",
                            " ",
                            e.jsxs("code", {
                              className: "text-[10px]",
                              children: ["/v1/items/", "{{id}}", "/"],
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
                    e.jsx(v, { children: "Parámetros query (JSON)" }),
                    e.jsx(W, {
                      value: g.queryParams,
                      onChange: (i) => _((d) => ({ ...d, queryParams: i.target.value })),
                      rows: 3,
                      className: "font-mono text-xs",
                      placeholder: '{ "page": "{{page}}", "q": "{{q}}" }',
                    }),
                    e.jsxs("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: [
                        "Filtros en la URL (",
                        e.jsx("code", { className: "text-[10px]", children: "?clave=valor" }),
                        "). Placeholders",
                        " ",
                        e.jsx("code", { className: "text-[10px]", children: "{{nombre}}" }),
                        " los completa la skill o el test.",
                      ],
                    }),
                  ],
                }),
                f
                  ? e.jsxs("p", {
                      className:
                        "text-[11px] rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-muted-foreground",
                      children: [
                        "Endpoint de ",
                        e.jsx("strong", { className: "text-foreground", children: "login" }),
                        ": no pongas Authorization aquí. En el body usa placeholders (",
                        e.jsx("code", { className: "text-[10px]", children: "{{email}}" }),
                        ",",
                        " ",
                        e.jsx("code", { className: "text-[10px]", children: "{{password}}" }),
                        ", …). Se rellenan al",
                        " ",
                        e.jsx("strong", { className: "text-foreground", children: "probar" }),
                        " o desde los args de la",
                        " ",
                        e.jsx("strong", { className: "text-foreground", children: "skill" }),
                        " — no se guardan en la API.",
                      ],
                    })
                  : e.jsxs("label", {
                      className:
                        "flex items-center gap-2 text-sm rounded-md border border-border/80 px-3 py-2",
                      children: [
                        e.jsx(Ve, {
                          checked: Ja(g.headers),
                          onCheckedChange: (i) => _((d) => ({ ...d, headers: Va(d.headers, i) })),
                        }),
                        "Incluir Authorization del login",
                        e.jsx("span", {
                          className: "text-[11px] text-muted-foreground",
                          children: "(prefijo Bearer/Token según Configuración)",
                        }),
                      ],
                    }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(v, { children: "Headers (JSON)" }),
                    e.jsx(W, {
                      value: g.headers,
                      onChange: (i) => _((d) => ({ ...d, headers: i.target.value })),
                      rows: 3,
                      className: "font-mono text-xs",
                    }),
                    e.jsx("p", {
                      className: "text-[11px] text-muted-foreground",
                      children:
                        "Cabeceras HTTP (Accept, X-Custom, etc.). Con auth Login el Bearer se inyecta solo si falta (excepto en el endpoint de login).",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(v, { children: "Body (JSON)" }),
                    e.jsx(W, {
                      value: g.body,
                      onChange: (i) => _((d) => ({ ...d, body: i.target.value })),
                      rows: 4,
                      className: "font-mono text-xs",
                      placeholder: '{ "email": "{{email}}", "password": "{{password}}" }',
                    }),
                    e.jsx("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: f
                        ? e.jsxs(e.Fragment, {
                            children: [
                              "Login: usa placeholders que coincidan con Configuración, ej.",
                              " ",
                              e.jsx("code", {
                                className: "text-[10px]",
                                children: '{ "email": "{{email}}", "password": "{{password}}" }',
                              }),
                              ".",
                            ],
                          })
                        : e.jsx(e.Fragment, {
                            children: "Cuerpo JSON (POST/PUT/PATCH). En GET no se envía.",
                          }),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsx(v, { children: "Mapeo de respuesta (JSON)" }),
                    e.jsx(W, {
                      value: g.responseMapping,
                      onChange: (i) => _((d) => ({ ...d, responseMapping: i.target.value })),
                      rows: 3,
                      className: "font-mono text-xs",
                      placeholder: "{}",
                    }),
                    e.jsxs("p", {
                      className: "text-[11px] text-muted-foreground",
                      children: [
                        "Vacío = la skill recibe el JSON tal cual llega de la API. Con claves, solo extrae esos campos (ej. ",
                        e.jsx("code", {
                          className: "text-[10px]",
                          children: '{ "items": "results" }',
                        }),
                        ").",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(_s, {
              children: [
                e.jsxs(A, {
                  type: "button",
                  variant: "outline",
                  onClick: () => y(!1),
                  children: [e.jsx(ws, { className: "h-4 w-4 mr-1.5" }), " Cancelar"],
                }),
                e.jsxs(A, {
                  type: "button",
                  disabled: u,
                  onClick: M,
                  children: [
                    u
                      ? e.jsx(ae, { className: "h-4 w-4 mr-1.5 animate-spin" })
                      : e.jsx(aa, { className: "h-4 w-4 mr-1.5" }),
                    "Guardar",
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const Ts = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function Is(a) {
  return `muninn:external-api-test:${a}`;
}
function Qa(a) {
  try {
    const n = localStorage.getItem(Is(a));
    if (!n) return {};
    const u = JSON.parse(n);
    return u && typeof u == "object" ? u : {};
  } catch {
    return {};
  }
}
function Za(a, n) {
  try {
    localStorage.setItem(Is(a), JSON.stringify(n));
  } catch {}
}
function He(a) {
  if (!a) return [];
  const n = [a.path, J(a.query_params ?? {}), J(a.headers ?? {}), J(a.body ?? {})],
    u = new Set();
  for (const m of n)
    if (m) for (const o of String(m).matchAll(Ts)) o[1] && o[1] !== "auth_token" && u.add(o[1]);
  return [...u].sort();
}
function et(a) {
  if (!a.length) return "{}";
  const n = {};
  for (const u of a) n[u] = "";
  return J(n);
}
function st(a, n, u) {
  if (!n?.path) return null;
  const m = X(u, "params"),
    o = m.ok ? m.value : {},
    N = (t) =>
      t.replace(Ts, (g, _) => {
        const f = o[_];
        return f == null || f === "" ? `{{${_}}}` : String(f);
      }),
    k = N(n.path),
    h = n.query_params ?? {},
    y = [];
  if (h && typeof h == "object")
    for (const [t, g] of Object.entries(h)) y.push(`${t}=${N(String(g))}`);
  const T = y.length ? `?${y.join("&")}` : "";
  return `${(a || "").replace(/\/$/, "")}${k}${T}`;
}
function Ke({ title: a, value: n, tone: u = "muted" }) {
  return n == null || (typeof n == "object" && !Array.isArray(n) && Object.keys(n).length === 0)
    ? null
    : e.jsxs("div", {
        className: "space-y-1",
        children: [
          e.jsx("p", {
            className: te(
              "text-[11px] font-medium",
              u === "ok" && "text-primary",
              u === "err" && "text-destructive",
              u === "muted" && "text-muted-foreground",
            ),
            children: a,
          }),
          e.jsx("pre", {
            className:
              "max-h-56 overflow-auto rounded bg-background/60 p-2 font-mono text-[11px] whitespace-pre-wrap break-all",
            children: J(n),
          }),
        ],
      });
}
const at = new Set(["password", "pass", "passwd", "secret", "api_key", "apikey", "token"]);
function tt(a) {
  const n = a.toLowerCase();
  return at.has(n) || n.includes("password") || n.includes("secret");
}
function nt({ api: a, onExit: n }) {
  const u = na(),
    m = String(a.id),
    o = r.useMemo(() => Object.keys(a.endpoints ?? {}), [a.endpoints]),
    N = a.auth_type === "endpoint_auth" || !!a.auth_endpoint_key,
    k = a.auth_endpoint_key ? a.endpoints?.[a.auth_endpoint_key] : void 0,
    h = r.useMemo(() => (N ? He(k) : []), [N, k]),
    y = r.useMemo(() => Qa(m), [m]),
    T = a.auth_endpoint_key || "",
    t =
      y.endpointType && o.includes(y.endpointType)
        ? y.endpointType
        : o.find((l) => l !== T) || o[0] || "",
    [g, _] = r.useState(
      y.mode && (y.mode !== "endpoint" || o.length) ? y.mode : o.length ? "endpoint" : "base",
    ),
    [f, I] = r.useState(t),
    [D, M] = r.useState(() => (t && y.paramsByEndpoint?.[t] ? y.paramsByEndpoint[t] : "{}")),
    [L, i] = r.useState(() => y.paramsByEndpoint ?? {}),
    [d, P] = r.useState(y.authenticateFirst ?? N),
    [R, xe] = r.useState(() => y.credentials ?? {}),
    [ce, de] = r.useState("GET"),
    [H, pe] = r.useState("/"),
    [K, Q] = r.useState("{}"),
    [Z, U] = r.useState("{}"),
    [E, O] = r.useState(null),
    q = f ? a.endpoints?.[f] : void 0,
    ee = r.useMemo(() => He(q), [q]);
  (r.useEffect(() => {
    Za(m, { credentials: R, paramsByEndpoint: L, authenticateFirst: d, endpointType: f, mode: g });
  }, [m, R, L, d, f, g]),
    r.useEffect(() => {
      if (g !== "endpoint" || !f) return;
      const l = L[f];
      if (l != null) {
        M(l);
        return;
      }
      const S = a.endpoints?.[f],
        z = et(He(S));
      (M(z), i((he) => ({ ...he, [f]: z })));
    }, [g, f, a.endpoints]));
  const Y = r.useMemo(() => {
      if (!q) return null;
      const l = (q.method || "GET").toUpperCase(),
        S = q.path || "/",
        z = q.query_params ?? {},
        he =
          z && typeof z == "object" && Object.keys(z).length
            ? "?" +
              Object.entries(z)
                .map(([Ne, ye]) => `${Ne}=${String(ye)}`)
                .join("&")
            : "";
      return {
        method: l,
        url: `${a.base_url?.replace(/\/$/, "") ?? ""}${S}${he}`,
        isLogin: f === (a.auth_endpoint_key || ""),
      };
    }, [q, a.base_url, a.auth_endpoint_key, f]),
    ne = (l) => {
      O(l);
      const S = Oa(l);
      S.ok ? c.success(S.message) : c.error(S.message);
    },
    V = g === "endpoint" && f === (a.auth_endpoint_key || ""),
    x = () => {
      if (!d || !h.length) return;
      const l = {};
      for (const S of h) {
        const z = R[S]?.trim();
        z && (l[S] = z);
      }
      return Object.keys(l).length ? l : void 0;
    },
    p = () => {
      const l = d && !V,
        S = l ? x() : void 0;
      return { authenticate_first: l, force_auth: !0, ...(S ? { credentials: S } : {}) };
    },
    C = () => {
      if (V || !d || !h.length) return !0;
      const l = h.filter((S) => !R[S]?.trim());
      return l.length ? (c.error(`Completa las credenciales de login: ${l.join(", ")}`), !1) : !0;
    },
    j = (l) => {
      (M(l), g === "endpoint" && f && i((S) => ({ ...S, [f]: l })));
    },
    se = () => {
      if (C()) {
        if (g === "endpoint") {
          if (!f) {
            c.error("Selecciona un endpoint");
            return;
          }
          const l = X(D, "parámetros");
          if (!l.ok) {
            c.error(l.error);
            return;
          }
          u.mutate(
            { id: m, body: { endpoint_type: f, body: l.value, ...p() } },
            { onSuccess: ne, onError: () => c.error("Test falló") },
          );
          return;
        }
        if (g === "adhoc") {
          const l = X(K, "headers");
          if (!l.ok) {
            c.error(l.error);
            return;
          }
          const S = X(D, "query");
          if (!S.ok) {
            c.error(S.error);
            return;
          }
          const z = X(Z, "body");
          if (!z.ok) {
            c.error(z.error);
            return;
          }
          if (!H.startsWith("/")) {
            c.error("El path debe empezar con /");
            return;
          }
          u.mutate(
            {
              id: m,
              body: {
                method: ce,
                path: H,
                headers: l.value,
                params: S.value,
                body: z.value,
                ...p(),
              },
            },
            { onSuccess: ne, onError: () => c.error("Test falló") },
          );
          return;
        }
        u.mutate(
          { id: m, body: { ...p() } },
          { onSuccess: ne, onError: () => c.error("Test falló") },
        );
      }
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
              e.jsx("h2", { className: "text-sm font-medium", children: "Modo prueba" }),
              e.jsx("p", {
                className: "text-xs text-muted-foreground mt-0.5",
                children:
                  "Espacio completo para probar endpoints. Las credenciales de prueba se guardan en este navegador (por aplicación). En cada skill/agente irán las suyas — no se comparten.",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex flex-wrap gap-2 shrink-0",
            children: [
              n &&
                e.jsxs(A, {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: n,
                  children: [e.jsx(Fe, { className: "h-4 w-4 mr-1.5" }), "Volver"],
                }),
              e.jsxs(A, {
                type: "button",
                size: "sm",
                disabled: u.isPending,
                onClick: se,
                children: [
                  u.isPending
                    ? e.jsx(ae, { className: "h-4 w-4 mr-1.5 animate-spin" })
                    : e.jsx(Je, { className: "h-4 w-4 mr-1.5" }),
                  "Ejecutar test",
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "grid gap-4 lg:grid-cols-2",
        children: [
          e.jsxs("div", {
            className: "space-y-4 min-w-0",
            children: [
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(v, { children: "Modo" }),
                  e.jsxs(re, {
                    value: g,
                    onValueChange: (l) => _(l),
                    children: [
                      e.jsx(oe, { children: e.jsx(le, {}) }),
                      e.jsxs(ie, {
                        children: [
                          e.jsx(G, {
                            value: "endpoint",
                            disabled: o.length === 0,
                            children: "Endpoint configurado",
                          }),
                          e.jsx(G, { value: "adhoc", children: "Request ad-hoc" }),
                          e.jsx(G, { value: "base", children: "GET a base_url" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              g === "endpoint" &&
                e.jsxs(e.Fragment, {
                  children: [
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Endpoint" }),
                        e.jsxs(re, {
                          value: f,
                          onValueChange: I,
                          children: [
                            e.jsx(oe, { children: e.jsx(le, { placeholder: "Selecciona" }) }),
                            e.jsx(ie, {
                              children: o.map((l) => e.jsx(G, { value: l, children: l }, l)),
                            }),
                          ],
                        }),
                      ],
                    }),
                    Y &&
                      e.jsxs("div", {
                        className: "rounded-lg border bg-muted/30 px-3 py-2 space-y-1 text-[11px]",
                        children: [
                          e.jsx("p", {
                            className: "font-medium text-foreground",
                            children: "Request del endpoint",
                          }),
                          e.jsxs("p", {
                            className: "font-mono break-all",
                            children: [
                              e.jsx("span", { className: "text-primary", children: Y.method }),
                              " ",
                              Y.url,
                            ],
                          }),
                          Y.isLogin
                            ? e.jsx("p", {
                                className: "text-muted-foreground",
                                children:
                                  "Endpoint de login: usa las credenciales de prueba de abajo.",
                              })
                            : e.jsxs("p", {
                                className: "text-muted-foreground",
                                children: [
                                  "Los valores rellenan ",
                                  e.jsx("code", {
                                    className: "text-[10px]",
                                    children: "{{placeholders}}",
                                  }),
                                  " ",
                                  "del path, query y body.",
                                ],
                              }),
                        ],
                      }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsxs(v, {
                          children: [
                            "Valores de prueba",
                            ee.length > 0 ? ` (${ee.join(", ")})` : "",
                          ],
                        }),
                        e.jsx(W, {
                          value: D,
                          onChange: (l) => j(l.target.value),
                          rows: 6,
                          className: "font-mono text-xs",
                          disabled: ee.length === 0,
                        }),
                        ee.length === 0
                          ? e.jsx("p", {
                              className: "text-[11px] text-muted-foreground",
                              children: "Sin placeholders. Puedes probarlo directo.",
                            })
                          : e.jsxs("p", {
                              className: "text-[11px] text-muted-foreground break-all",
                              children: [
                                "Vista previa:",
                                " ",
                                e.jsx("code", {
                                  className: "text-[10px]",
                                  children: st(a.base_url, q, D) ?? "—",
                                }),
                              ],
                            }),
                      ],
                    }),
                  ],
                }),
              g === "adhoc" &&
                e.jsxs(e.Fragment, {
                  children: [
                    e.jsxs("div", {
                      className: "grid grid-cols-2 gap-3",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Método" }),
                            e.jsxs(re, {
                              value: ce,
                              onValueChange: de,
                              children: [
                                e.jsx(oe, { children: e.jsx(le, {}) }),
                                e.jsx(ie, {
                                  children: As.map((l) => e.jsx(G, { value: l, children: l }, l)),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Path" }),
                            e.jsx(B, {
                              value: H,
                              onChange: (l) => pe(l.target.value),
                              className: "font-mono text-sm",
                              placeholder: "/v1/recursos/",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Query (JSON)" }),
                        e.jsx(W, {
                          value: D,
                          onChange: (l) => M(l.target.value),
                          rows: 3,
                          className: "font-mono text-xs",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Headers (JSON)" }),
                        e.jsx(W, {
                          value: K,
                          onChange: (l) => Q(l.target.value),
                          rows: 3,
                          className: "font-mono text-xs",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(v, { children: "Body (JSON)" }),
                        e.jsx(W, {
                          value: Z,
                          onChange: (l) => U(l.target.value),
                          rows: 4,
                          className: "font-mono text-xs",
                        }),
                      ],
                    }),
                  ],
                }),
              g === "base" &&
                e.jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children:
                    "GET a la URL base. Preferí un endpoint configurado con «Autenticar primero».",
                }),
              N &&
                !V &&
                e.jsxs("div", {
                  className: "space-y-3 rounded-lg border bg-muted/20 px-3 py-3",
                  children: [
                    e.jsxs("label", {
                      className: "flex items-center gap-2 text-sm",
                      children: [
                        e.jsx(Ve, { checked: d, onCheckedChange: P }),
                        "Autenticar primero",
                        a.auth_endpoint_key ? ` (${a.auth_endpoint_key})` : "",
                      ],
                    }),
                    d &&
                      e.jsx(e.Fragment, {
                        children:
                          h.length > 0
                            ? e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children:
                                      "Credenciales del login (obligatorias para endpoints protegidos). Se recuerdan en este navegador. Dentidesk: el token es de un solo uso — cada test hace login fresco.",
                                  }),
                                  e.jsx("div", {
                                    className: "grid gap-2 sm:grid-cols-2",
                                    children: h.map((l) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className: "space-y-1",
                                          children: [
                                            e.jsx(v, {
                                              className: "text-xs font-mono",
                                              children: l,
                                            }),
                                            e.jsx(B, {
                                              type: tt(l) ? "password" : "text",
                                              autoComplete: "off",
                                              value: R[l] ?? "",
                                              onChange: (S) =>
                                                xe((z) => ({ ...z, [l]: S.target.value })),
                                              placeholder: `{{${l}}}`,
                                              className: "h-8 text-sm",
                                            }),
                                          ],
                                        },
                                        l,
                                      ),
                                    ),
                                  }),
                                ],
                              })
                            : e.jsxs("p", {
                                className: "text-[11px] text-muted-foreground",
                                children: [
                                  "El endpoint de login no define placeholders",
                                  " ",
                                  e.jsx("code", { className: "text-[10px]", children: "{{…}}" }),
                                  ".",
                                ],
                              }),
                      }),
                  ],
                }),
            ],
          }),
          e.jsxs("div", {
            className: "min-w-0 space-y-3",
            children: [
              e.jsx("p", {
                className: "text-xs font-medium text-muted-foreground",
                children: "Resultado",
              }),
              E
                ? e.jsxs("div", {
                    className: te(
                      "rounded-lg border p-3 space-y-3 text-xs",
                      E.success
                        ? "border-primary/30 bg-primary/5"
                        : "border-destructive/30 bg-destructive/5",
                    ),
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-2 font-medium",
                        children: [
                          e.jsx("span", { children: E.success ? "Éxito" : "Error" }),
                          E.status_code != null &&
                            e.jsxs("span", { children: ["HTTP ", E.status_code] }),
                          E.latency_ms != null &&
                            e.jsxs("span", { children: [E.latency_ms, " ms"] }),
                        ],
                      }),
                      E.auth &&
                        e.jsxs("p", {
                          className: te(
                            "font-mono text-[11px]",
                            E.auth.success ? "text-primary" : "text-destructive",
                          ),
                          children: [
                            "Login:",
                            " ",
                            E.auth.success
                              ? `OK${E.auth.token_preview ? ` · ${E.auth.token_preview}` : ""}`
                              : E.auth.error || "falló",
                            E.auth.success && !E.success
                              ? " · el error es del endpoint, no del login"
                              : "",
                          ],
                        }),
                      e.jsx(Ke, { title: "Request enviada", value: E.request }),
                      e.jsx(Ke, {
                        title: "Respuesta",
                        value: E.data ?? E.raw_response ?? E.error,
                        tone: E.success ? "ok" : "err",
                      }),
                      e.jsx(Ke, { title: "Respuesta mapeada", value: E.mapped_data, tone: "ok" }),
                    ],
                  })
                : e.jsx("div", {
                    className:
                      "rounded-lg border border-dashed px-4 py-10 text-center text-xs text-muted-foreground",
                    children: "Ejecuta un test para ver request, auth y respuesta aquí.",
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
function mt() {
  const { id: a } = qs(),
    n = $s(),
    [u, m] = Ms(),
    o = us(),
    N = ra(),
    k = oa(),
    h = la(),
    y = ia(),
    T = ca(),
    { data: t, isLoading: g, error: _, refetch: f } = da(a),
    { data: I = [] } = ua({ scope: "store", includeInactive: !0 }),
    D = gs(),
    M = ma(),
    L = xa(),
    { data: i = [] } = pa({ enabled: h && (y || T) }),
    { data: d = [] } = ha(),
    P = us(),
    {
      data: R = [],
      isLoading: xe,
      refetch: ce,
    } = ga({ externalApiId: k && a ? a : "", includeInactive: !0 }),
    de = r.useMemo(() => {
      const s = new Set();
      for (const b of I) {
        const w = (b.category || "").trim();
        w && s.add(w);
      }
      return Array.from(s).sort((b, w) => b.localeCompare(w, "es", { sensitivity: "base" }));
    }, [I]),
    H = r.useMemo(() => {
      const s = new Set();
      for (const b of I)
        for (const w of b.tags ?? []) {
          const $ = String(w || "").trim();
          $ && s.add($);
        }
      return Array.from(s).sort((b, w) => b.localeCompare(w, "es", { sensitivity: "base" }));
    }, [I]),
    pe = r.useMemo(() => {
      const s = d.map((b) => ({ id: String(b.value), label: b.label }));
      if (y || T) {
        const b = i.map(($) => ({
            id: String($.id),
            label: $.fantasy_name?.trim() || $.business_name || String($.id),
          })),
          w = new Map();
        for (const $ of [...b, ...s]) w.has($.id) || w.set($.id, $);
        return Array.from(w.values()).sort(($, Te) =>
          $.label.localeCompare(Te.label, "es", { sensitivity: "base" }),
        );
      }
      return s;
    }, [i, y, T, d]),
    K = u.get("tab"),
    Q =
      K === "endpoints" || K === "probar" || K === "cuenta" || K === "skills" || K === "instalacion"
        ? K
        : "configuracion",
    Z =
      (Q === "endpoints" && !N) ||
      (Q === "skills" && !k) ||
      (Q === "instalacion" && !h) ||
      (Q === "probar" && !o) ||
      (Q === "cuenta" && t && !me(t))
        ? "configuracion"
        : Q,
    U = (s) => {
      (s === "endpoints" && !N) ||
        (s === "skills" && !k) ||
        (s === "instalacion" && !h) ||
        (s === "probar" && !o) ||
        m(
          (b) => {
            const w = new URLSearchParams(b);
            return (s === "configuracion" ? w.delete("tab") : w.set("tab", s), w);
          },
          { replace: !0 },
        );
    },
    O = r.useMemo(() => {
      if (!t) return [];
      const s = (t.branches ?? []).map(String);
      return s.length ? s : t.branch != null ? [String(t.branch)] : [];
    }, [t]).length,
    [q, ee] = r.useState(!1),
    [Y, ne] = r.useState(""),
    [V, x] = r.useState(""),
    [p, C] = r.useState(""),
    [j, se] = r.useState("none"),
    [l, S] = r.useState("30"),
    [z, he] = r.useState(!0),
    [Ne, ye] = r.useState(""),
    [Le, Xe] = r.useState("X-API-Key"),
    [Ce, Ye] = r.useState(""),
    [Se, De] = r.useState(""),
    [we, We] = r.useState(""),
    [ge, Qe] = r.useState(""),
    [be, Ze] = r.useState(""),
    [ze, Be] = r.useState("access_token"),
    [Ee, Oe] = r.useState("0"),
    [Re, es] = r.useState("Bearer"),
    [Ls, qe] = r.useState(!1),
    [ss, as] = r.useState("{}"),
    [ts, ns] = r.useState(`{
  "max_retries": 3,
  "backoff": 2
}`),
    [rs, os] = r.useState(""),
    [_e, $e] = r.useState([]),
    [ls, Me] = r.useState(""),
    [Ae, is] = r.useState("");
  r.useEffect(() => {
    t &&
      (ne(t.name),
      x(t.description || ""),
      C(t.base_url || ""),
      se(t.auth_type || "none"),
      S(String(t.timeout_seconds ?? 30)),
      he(t.is_active !== !1),
      ye(""),
      Qe(t.auth_endpoint_key || ""),
      Ze(t.health_endpoint_key || ""),
      Be(t.auth_token_path || "access_token"),
      Oe(String(t.auth_token_ttl_seconds ?? 0)),
      as(J(t.default_headers ?? {})),
      ns(J(t.retry_policy ?? { max_retries: 3, backoff: 2 })),
      Xe("X-API-Key"),
      Ye(""),
      De(""),
      We(""),
      es(t.auth_header_prefix === "Token" ? "Token" : "Bearer"),
      qe(!1),
      os(t.category || ""),
      $e((t.tags ?? []).map(String).filter(Boolean)),
      Me(""),
      is(t.icon_url || ""));
  }, [t]);
  const Ds = (s) => {
      const b = s.trim().slice(0, 32);
      !b ||
        _e.length >= 8 ||
        _e.some((w) => w.toLowerCase() === b.toLowerCase()) ||
        ($e((w) => [...w, b]), Me(""));
    },
    zs = (s) => {
      (se(s),
        s === "endpoint_auth" &&
          (ze.trim() || Be("access_token"), (Ee === "" || Ee == null) && Oe("3500")));
    };
  if (g) return e.jsx(fa, { variant: "studio" });
  if (_ || !t)
    return e.jsxs("div", {
      className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4",
      children: [
        e.jsxs(A, {
          variant: "outline",
          size: "sm",
          onClick: () => n(-1),
          children: [e.jsx(Fe, { className: "h-4 w-4 mr-1.5" }), " Volver"],
        }),
        e.jsx("div", {
          className:
            "rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive text-sm",
          children:
            "Error al cargar la aplicación. Verifica permisos y que el servicio esté disponible.",
        }),
      ],
    });
  const fe = Object.keys(t.endpoints ?? {}),
    Bs = () => {
      const s = {};
      return (
        j === "api_key" && Le.trim() && (s.header_name = Le.trim()),
        j === "basic" &&
          (Ce.trim() && (s.username = Ce.trim()), Se.trim() && (s.password = Se.trim())),
        j === "oauth2" && we.trim() && (s.access_token = we.trim()),
        j === "endpoint_auth" && ((s.auth_header_prefix = Re), (s._clear_secrets = !0)),
        Object.keys(s).length ? s : void 0
      );
    },
    Os = () => {
      if (!a || !o) return;
      if (!Y.trim() || !p.trim()) {
        c.error("Nombre y URL base son obligatorios");
        return;
      }
      const s = X(ss, "default_headers");
      if (!s.ok) {
        c.error(s.error);
        return;
      }
      const b = X(ts, "retry_policy");
      if (!b.ok) {
        c.error(b.error);
        return;
      }
      if (j === "endpoint_auth" && ge.trim() && !fe.includes(ge.trim())) {
        (c.error(`El endpoint «${ge}» no existe. Créalo en la pestaña Endpoints.`), U("endpoints"));
        return;
      }
      if (be.trim() && !fe.includes(be.trim())) {
        (c.error(`El endpoint de prueba «${be}» no existe. Créalo en la pestaña Endpoints.`),
          U("endpoints"));
        return;
      }
      const w = Number(l),
        $ = Number(Ee),
        Te =
          Ls ||
          j === "api_key" ||
          j === "endpoint_auth" ||
          (j === "basic" && (Ce.trim() || Se.trim())) ||
          (j === "oauth2" && we.trim())
            ? Bs()
            : void 0;
      D.mutate(
        {
          id: a,
          data: {
            name: Y.trim(),
            description: V.trim(),
            base_url: p.trim(),
            auth_type: j,
            timeout_seconds: Number.isFinite(w) ? w : 30,
            is_active: z,
            default_headers: s.value,
            retry_policy: b.value,
            auth_endpoint_key: j === "endpoint_auth" ? ge.trim() : "",
            health_endpoint_key: be.trim(),
            auth_token_path: j === "endpoint_auth" ? ze.trim() || "access_token" : "",
            auth_token_ttl_seconds: j === "endpoint_auth" && Number.isFinite($) ? $ : 0,
            category: rs.trim() || null,
            tags: _e,
            icon_url: Ae.trim(),
            ...(Ne.trim() ? { api_key: Ne.trim() } : {}),
            ...(Te ? { auth_config: Te } : {}),
          },
        },
        {
          onSuccess: () => {
            (c.success("Aplicación actualizada"), ee(!1), ye(""), De(""), qe(!1), f());
          },
          onError: () => c.error("No se pudo guardar"),
        },
      );
    },
    Rs = (s) => {
      !a ||
        !o ||
        D.mutate(
          { id: a, data: { endpoints: s } },
          {
            onSuccess: () => {
              (c.success("Endpoints actualizados"), f());
            },
            onError: () => c.error("No se pudieron guardar los endpoints"),
          },
        );
    },
    ue = fe.length,
    Pe = R.length,
    cs = () => {
      !a ||
        !o ||
        L.mutate(
          { id: a, body: { update_existing: !0, skip_auth_endpoint: !0 } },
          {
            onSuccess: (s) => {
              (c.success(`Skills sincronizadas: ${s.created} nuevas, ${s.updated} actualizadas`),
                ce());
            },
            onError: () => c.error("No se pudieron sincronizar las skills"),
          },
        );
    };
  return e.jsxs("div", {
    className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6",
    children: [
      e.jsxs("header", {
        className: "flex flex-col sm:flex-row sm:items-start gap-3",
        children: [
          e.jsx(A, {
            variant: "outline",
            size: "sm",
            asChild: !0,
            className: "self-start",
            children: e.jsxs(Ue, {
              to: ms,
              children: [e.jsx(Fe, { className: "h-4 w-4 mr-1.5" }), " Store"],
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 min-w-0 flex items-start gap-3",
            children: [
              e.jsx(xs, {
                name: t.name,
                size: "lg",
                src: t.icon_display_url || t.icon_url || t.icon,
              }),
              e.jsxs("div", {
                className: "min-w-0 flex-1",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                      e.jsx("h1", {
                        className: "text-xl md:text-2xl font-semibold tracking-tight truncate",
                        children: t.name,
                      }),
                      e.jsx(F, {
                        variant: t.is_active ? "default" : "secondary",
                        className: "text-[10px]",
                        children: t.is_active ? "Activa" : "Inactiva",
                      }),
                      t.category
                        ? e.jsx(F, {
                            variant: "outline",
                            className: "text-[10px] font-normal border-primary/30 text-primary",
                            children: t.category,
                          })
                        : null,
                      N &&
                        e.jsxs(F, {
                          variant: "outline",
                          className: "text-[10px] font-normal",
                          children: [ue, " endpoint", ue === 1 ? "" : "s"],
                        }),
                      k &&
                        e.jsxs(F, {
                          variant: "outline",
                          className: "text-[10px] font-normal",
                          children: [Pe, " skill", Pe === 1 ? "" : "s"],
                        }),
                      !o &&
                        e.jsxs(F, {
                          variant: "outline",
                          className: "text-[10px] gap-1 font-normal",
                          children: [e.jsx(ja, { className: "h-3 w-3" }), " Solo lectura"],
                        }),
                    ],
                  }),
                  e.jsx("p", {
                    className: "text-sm text-muted-foreground font-mono truncate mt-0.5",
                    children: t.base_url ?? "Sin URL base",
                  }),
                ],
              }),
            ],
          }),
          o &&
            e.jsxs("div", {
              className: "flex flex-wrap gap-2 self-start",
              children: [
                Z !== "probar" &&
                  e.jsxs(A, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => U("probar"),
                    children: [e.jsx(Je, { className: "h-4 w-4 mr-1.5" }), "Probar"],
                  }),
                Z === "configuracion" &&
                  e.jsxs(A, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => ee((s) => !s),
                    children: [
                      e.jsx(Cs, { className: "h-4 w-4 mr-1.5" }),
                      q ? "Cancelar edición" : "Editar",
                    ],
                  }),
                e.jsxs(va, {
                  children: [
                    e.jsx(Na, {
                      asChild: !0,
                      children: e.jsxs(A, {
                        variant: "outline",
                        size: "sm",
                        className: "text-destructive hover:text-destructive",
                        disabled: M.isPending,
                        children: [
                          e.jsx(Ss, { className: "h-4 w-4 mr-1.5" }),
                          " ",
                          t.is_active === !1 ? "Eliminar" : "Desactivar",
                        ],
                      }),
                    }),
                    e.jsxs(ya, {
                      children: [
                        e.jsxs(ba, {
                          children: [
                            e.jsx(_a, {
                              children:
                                t.is_active === !1
                                  ? "Eliminar permanentemente"
                                  : "Desactivar aplicación",
                            }),
                            e.jsx(ka, {
                              children:
                                t.is_active === !1
                                  ? `¿Eliminar «${t.name}» de forma permanente? No se puede deshacer.`
                                  : `¿Desactivar «${t.name}»? Quedará marcada como inactiva en el store. Las skills vinculadas pueden dejar de usarse.`,
                            }),
                          ],
                        }),
                        e.jsxs(Ca, {
                          children: [
                            e.jsx(Sa, { children: "Cancelar" }),
                            e.jsx(wa, {
                              className:
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                              onClick: () => {
                                if (!a) return;
                                const s = t.is_active === !1;
                                M.mutate(
                                  { id: a, hard: s },
                                  {
                                    onSuccess: () => {
                                      (c.success(
                                        s ? "Aplicación eliminada" : "Aplicación desactivada",
                                      ),
                                        n(ms));
                                    },
                                    onError: () =>
                                      c.error(s ? "No se pudo eliminar" : "No se pudo desactivar"),
                                  },
                                );
                              },
                              children: t.is_active === !1 ? "Eliminar" : "Desactivar",
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
      e.jsxs(Ea, {
        value: Z,
        onValueChange: (s) => U(s),
        className: "space-y-4",
        children: [
          e.jsxs(Aa, {
            className: "w-full sm:w-auto justify-start",
            children: [
              e.jsxs(je, {
                value: "configuracion",
                className: "gap-1.5 flex-1 sm:flex-none",
                children: [e.jsx(Pa, { className: "h-3.5 w-3.5" }), "Configuración"],
              }),
              h &&
                e.jsxs(je, {
                  value: "instalacion",
                  className: "gap-1.5 flex-1 sm:flex-none",
                  children: [
                    e.jsx(js, { className: "h-3.5 w-3.5" }),
                    "Instalación",
                    O > 0
                      ? e.jsxs("span", {
                          className: "text-[10px] text-muted-foreground tabular-nums",
                          children: ["(", O, ")"],
                        })
                      : null,
                  ],
                }),
              N &&
                e.jsxs(je, {
                  value: "endpoints",
                  className: "gap-1.5 flex-1 sm:flex-none",
                  children: [
                    e.jsx(Ta, { className: "h-3.5 w-3.5" }),
                    "Endpoints",
                    ue > 0
                      ? e.jsxs("span", {
                          className: "text-[10px] text-muted-foreground tabular-nums",
                          children: ["(", ue, ")"],
                        })
                      : null,
                  ],
                }),
              k &&
                e.jsxs(je, {
                  value: "skills",
                  className: "gap-1.5 flex-1 sm:flex-none",
                  children: [
                    e.jsx(Ia, { className: "h-3.5 w-3.5" }),
                    "Skills",
                    Pe > 0
                      ? e.jsxs("span", {
                          className: "text-[10px] text-muted-foreground tabular-nums",
                          children: ["(", Pe, ")"],
                        })
                      : null,
                  ],
                }),
              me(t) &&
                e.jsxs(je, {
                  value: "cuenta",
                  className: "gap-1.5 flex-1 sm:flex-none",
                  children: [e.jsx(ke, { className: "h-3.5 w-3.5" }), "Cuenta de prueba"],
                }),
              o &&
                e.jsxs(je, {
                  value: "probar",
                  className: "gap-1.5 flex-1 sm:flex-none",
                  children: [e.jsx(Je, { className: "h-3.5 w-3.5" }), "Probar"],
                }),
            ],
          }),
          h &&
            e.jsx(ve, {
              value: "instalacion",
              className: "mt-0",
              children: e.jsx(Ha, {
                api: t,
                branchOptions: pe,
                canManage: P,
                onSaved: () => {
                  f();
                },
              }),
            }),
          e.jsx(ve, {
            value: "configuracion",
            className: "mt-0",
            children: e.jsxs("section", {
              className: "space-y-5",
              children: [
                e.jsxs("div", {
                  className: "border-b border-border/60 pb-3",
                  children: [
                    e.jsx("h2", {
                      className: "text-sm font-medium",
                      children: "Configuración general",
                    }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground mt-0.5",
                      children:
                        "Nombre, URL base y autenticación del catálogo. La instalación (cuenta de servicio) y la cuenta de prueba van en sus pestañas.",
                    }),
                  ],
                }),
                me(t) &&
                  h &&
                  e.jsxs("div", {
                    className:
                      "rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between",
                    children: [
                      e.jsxs("span", {
                        children: [
                          "Credenciales (API key, token o login): pégalas en",
                          " ",
                          e.jsx("strong", {
                            className: "text-foreground font-medium",
                            children: "Instalación → Conectar cuenta de servicio",
                          }),
                          " ",
                          "en la sucursal instalada (ej. Smart Hydro).",
                        ],
                      }),
                      e.jsx(A, {
                        size: "sm",
                        variant: "outline",
                        onClick: () => U("instalacion"),
                        children: "Ir a Instalación",
                      }),
                    ],
                  }),
                o &&
                  N &&
                  ue === 0 &&
                  e.jsxs("div", {
                    className:
                      "rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between",
                    children: [
                      e.jsx("span", {
                        children:
                          "Siguiente paso: crea al menos un endpoint (login, listados, etc.).",
                      }),
                      e.jsx(A, {
                        size: "sm",
                        variant: "outline",
                        onClick: () => U("endpoints"),
                        children: "Ir a Endpoints",
                      }),
                    ],
                  }),
                q && o
                  ? e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Nombre" }),
                            e.jsx(B, { value: Y, onChange: (s) => ne(s.target.value) }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Auth" }),
                            e.jsxs(re, {
                              value: j,
                              onValueChange: (s) => zs(s),
                              children: [
                                e.jsx(oe, { children: e.jsx(le, {}) }),
                                e.jsx(ie, {
                                  children: Object.entries(Ie).map(([s, b]) =>
                                    e.jsx(G, { value: s, children: b }, s),
                                  ),
                                }),
                              ],
                            }),
                            e.jsx("p", {
                              className: "text-[11px] text-muted-foreground",
                              children: Es[j] ?? "",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2 md:col-span-2",
                          children: [
                            e.jsx(v, { children: "Base URL" }),
                            e.jsx(B, {
                              value: p,
                              onChange: (s) => C(s.target.value),
                              className: "font-mono text-sm",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2 md:col-span-2",
                          children: [
                            e.jsx(v, { children: "Icono (URL)" }),
                            e.jsx(B, {
                              value: Ae,
                              onChange: (s) => is(s.target.value),
                              placeholder: "https://…/logo.png",
                              className: "font-mono text-sm",
                            }),
                            e.jsx("p", {
                              className: "text-[11px] text-muted-foreground",
                              children:
                                "URL pública del logo. Se muestra en el store; si está vacío, se usan iniciales.",
                            }),
                            (Ae.trim() || t.icon_display_url) &&
                              e.jsx("div", {
                                className: "pt-1",
                                children: e.jsx(xs, {
                                  name: Y || t.name,
                                  src: Ae.trim() || t.icon_display_url,
                                  size: "sm",
                                }),
                              }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2 md:col-span-2",
                          children: [
                            e.jsx(v, { children: "Descripción" }),
                            e.jsx(W, { value: V, onChange: (s) => x(s.target.value), rows: 2 }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Categoría" }),
                            e.jsx(B, {
                              value: rs,
                              onChange: (s) => os(s.target.value),
                              placeholder: "ej. Salud, ERP, Logística",
                              list: "api-detail-category-suggestions",
                            }),
                            e.jsx("datalist", {
                              id: "api-detail-category-suggestions",
                              children: de.map((s) => e.jsx("option", { value: s }, s)),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Tags" }),
                            e.jsx(B, {
                              value: ls,
                              onChange: (s) => Me(s.target.value),
                              onKeyDown: (s) => {
                                (s.key === "Enter" || s.key === ",") &&
                                  (s.preventDefault(), Ds(ls));
                              },
                              placeholder: "Enter para agregar (máx. 8)",
                              list: "api-detail-tag-suggestions",
                            }),
                            e.jsx("datalist", {
                              id: "api-detail-tag-suggestions",
                              children: H.map((s) => e.jsx("option", { value: s }, s)),
                            }),
                            _e.length > 0 &&
                              e.jsx("div", {
                                className: "flex flex-wrap gap-1.5",
                                children: _e.map((s) =>
                                  e.jsxs(
                                    "button",
                                    {
                                      type: "button",
                                      onClick: () => $e((b) => b.filter((w) => w !== s)),
                                      className:
                                        "inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 text-[11px]",
                                      children: [s, e.jsx(ws, { className: "h-3 w-3" })],
                                    },
                                    s,
                                  ),
                                ),
                              }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(v, { children: "Timeout (s)" }),
                            e.jsx(B, {
                              type: "number",
                              value: l,
                              onChange: (s) => S(s.target.value),
                            }),
                          ],
                        }),
                        (j === "api_key" || j === "bearer" || j === "oauth2") &&
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsxs(v, {
                                children: [
                                  j === "bearer" || j === "oauth2" ? "Token / API Key" : "API Key",
                                  " ",
                                  t.api_key_masked
                                    ? e.jsxs("span", {
                                        className: "text-muted-foreground font-normal",
                                        children: ["(actual ", t.api_key_masked, ")"],
                                      })
                                    : null,
                                ],
                              }),
                              e.jsx(B, {
                                type: "password",
                                value: Ne,
                                onChange: (s) => ye(s.target.value),
                                placeholder: "Dejar vacío para no cambiar",
                                autoComplete: "off",
                              }),
                            ],
                          }),
                        j === "api_key" &&
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(v, { children: "Header de API Key" }),
                              e.jsx(B, {
                                value: Le,
                                onChange: (s) => Xe(s.target.value),
                                placeholder: "X-API-Key",
                                className: "font-mono text-sm",
                              }),
                            ],
                          }),
                        j === "basic" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "Usuario" }),
                                  e.jsx(B, {
                                    value: Ce,
                                    onChange: (s) => Ye(s.target.value),
                                    autoComplete: "off",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "Contraseña" }),
                                  e.jsx(B, {
                                    type: "password",
                                    value: Se,
                                    onChange: (s) => De(s.target.value),
                                    autoComplete: "off",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        j === "oauth2" &&
                          e.jsxs("div", {
                            className: "space-y-2 md:col-span-2",
                            children: [
                              e.jsx(v, { children: "Access token (auth_config)" }),
                              e.jsx(B, {
                                type: "password",
                                value: we,
                                onChange: (s) => We(s.target.value),
                                placeholder: "Opcional si ya guardaste api_key",
                                autoComplete: "off",
                              }),
                            ],
                          }),
                        N &&
                          j === "endpoint_auth" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsx("div", {
                                className:
                                  "md:col-span-2 rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5",
                                children: e.jsxs("p", {
                                  className: "text-xs text-muted-foreground",
                                  children: [
                                    "Aquí solo defines el ",
                                    e.jsx("strong", {
                                      className: "text-foreground",
                                      children: "flujo",
                                    }),
                                    ": qué endpoint hace login, de dónde sale el token y el prefijo del header. En el endpoint de login usa placeholders (",
                                    e.jsx("code", {
                                      className: "text-[10px]",
                                      children: "{{email}}",
                                    }),
                                    ",",
                                    " ",
                                    e.jsx("code", {
                                      className: "text-[10px]",
                                      children: "{{password}}",
                                    }),
                                    ", etc.). La",
                                    " ",
                                    e.jsx("strong", {
                                      className: "text-foreground",
                                      children: "cuenta de la instalación",
                                    }),
                                    " ",
                                    "(pestaña Instalación) es la que usan los agentes;",
                                    " ",
                                    e.jsx("strong", {
                                      className: "text-foreground",
                                      children: "Cuenta de prueba",
                                    }),
                                    " solo sirve para Studio / Probar.",
                                  ],
                                }),
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "Endpoint de login" }),
                                  e.jsxs(re, {
                                    value: ge || "__none__",
                                    onValueChange: (s) => Qe(s === "__none__" ? "" : s),
                                    children: [
                                      e.jsx(oe, {
                                        children: e.jsx(le, { placeholder: "Selecciona endpoint" }),
                                      }),
                                      e.jsxs(ie, {
                                        children: [
                                          e.jsx(G, { value: "__none__", children: "—" }),
                                          fe.map((s) => e.jsx(G, { value: s, children: s }, s)),
                                        ],
                                      }),
                                    ],
                                  }),
                                  fe.length === 0 &&
                                    e.jsx("p", {
                                      className: "text-[11px] text-muted-foreground",
                                      children:
                                        "Crea primero el endpoint de login en la pestaña Endpoints.",
                                    }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "Campo del token en la respuesta" }),
                                  e.jsx(B, {
                                    value: ze,
                                    onChange: (s) => Be(s.target.value),
                                    placeholder: "access_token",
                                    className: "font-mono text-sm",
                                  }),
                                  e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children: "Dot-path JSON, ej. access_token o data.Token",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "Prefijo Authorization" }),
                                  e.jsxs(re, {
                                    value: Re,
                                    onValueChange: (s) => {
                                      (es(s), qe(!0));
                                    },
                                    children: [
                                      e.jsx(oe, { children: e.jsx(le, {}) }),
                                      e.jsx(ie, {
                                        children: Ra.map((s) =>
                                          e.jsx(G, { value: s.value, children: s.label }, s.value),
                                        ),
                                      }),
                                    ],
                                  }),
                                  e.jsxs("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children: [
                                      "Se envía como",
                                      " ",
                                      e.jsxs("code", {
                                        className: "text-[10px]",
                                        children: ["Authorization: ", Re, " <token>"],
                                      }),
                                      ". JWT → Bearer. Token DRF/hex (ej. SmartHydro) → Token.",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(v, { children: "TTL del token (segundos)" }),
                                  e.jsx(B, {
                                    type: "number",
                                    value: Ee,
                                    onChange: (s) => Oe(s.target.value),
                                  }),
                                  e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children:
                                      "0 = sin caché (login en cada llamada; obligatorio si el token es de un solo uso). >0 cachea el token (ej. 3500 ≈ 58 min para JWT reutilizable).",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        N &&
                          e.jsxs("div", {
                            className: "space-y-2 md:col-span-2",
                            children: [
                              e.jsx(v, { children: "Endpoint de prueba (store · Probar)" }),
                              e.jsxs(re, {
                                value: be || "__none__",
                                onValueChange: (s) => Ze(s === "__none__" ? "" : s),
                                children: [
                                  e.jsx(oe, {
                                    children: e.jsx(le, { placeholder: "Elige endpoint" }),
                                  }),
                                  e.jsxs(ie, {
                                    children: [
                                      e.jsx(G, {
                                        value: "__none__",
                                        children:
                                          "Automático (login si hay auth, si no GET base_url)",
                                      }),
                                      fe.map((s) => e.jsx(G, { value: s, children: s }, s)),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-[11px] text-muted-foreground",
                                children:
                                  "El botón Probar del store llama este endpoint para validar que el servicio está activo. Si requiere auth, usa la cuenta de la instalación.",
                              }),
                            ],
                          }),
                        e.jsxs("div", {
                          className: "space-y-2 md:col-span-2",
                          children: [
                            e.jsx(v, { children: "default_headers (JSON)" }),
                            e.jsx(W, {
                              value: ss,
                              onChange: (s) => as(s.target.value),
                              rows: 3,
                              className: "font-mono text-xs",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2 md:col-span-2",
                          children: [
                            e.jsx(v, { children: "retry_policy (JSON)" }),
                            e.jsx(W, {
                              value: ts,
                              onChange: (s) => ns(s.target.value),
                              rows: 3,
                              className: "font-mono text-xs",
                            }),
                          ],
                        }),
                        h &&
                          e.jsxs("div", {
                            className:
                              "md:col-span-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 justify-between",
                            children: [
                              e.jsxs("span", {
                                children: [
                                  "Las sucursales donde se instala la app se gestionan en la pestaña",
                                  " ",
                                  e.jsx("strong", {
                                    className: "text-foreground font-medium",
                                    children: "Instalación",
                                  }),
                                  " (",
                                  O,
                                  " actual",
                                  O === 1 ? "" : "es",
                                  ").",
                                ],
                              }),
                              e.jsx(A, {
                                size: "sm",
                                variant: "outline",
                                onClick: () => U("instalacion"),
                                children: "Ir a Instalación",
                              }),
                            ],
                          }),
                        e.jsxs("label", {
                          className: "flex items-center gap-2 text-sm md:col-span-2",
                          children: [e.jsx(Ve, { checked: z, onCheckedChange: he }), "Activa"],
                        }),
                        e.jsx("div", {
                          className: "md:col-span-2",
                          children: e.jsxs(A, {
                            onClick: Os,
                            disabled: D.isPending,
                            children: [
                              D.isPending && e.jsx(ae, { className: "mr-2 h-4 w-4 animate-spin" }),
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
                            e.jsx("p", { className: "font-medium", children: t.name }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Autenticación",
                            }),
                            e.jsx("p", {
                              className: "font-medium",
                              children: Ie[t.auth_type ?? "none"] ?? t.auth_type,
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "md:col-span-2",
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "URL base",
                            }),
                            e.jsx("p", {
                              className: "font-medium font-mono text-xs break-all",
                              children: t.base_url ?? "—",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "md:col-span-2 space-y-1.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between gap-2",
                              children: [
                                e.jsx("span", {
                                  className: "text-muted-foreground text-xs",
                                  children: "Instalada en",
                                }),
                                h &&
                                  e.jsx("button", {
                                    type: "button",
                                    className: "text-[11px] text-primary hover:underline",
                                    onClick: () => U("instalacion"),
                                    children: "Gestionar instalaciones",
                                  }),
                              ],
                            }),
                            h
                              ? (t.branch_names ?? []).length > 0
                                ? e.jsx("div", {
                                    className: "flex flex-wrap gap-1.5",
                                    children: t.branch_names.map((s) =>
                                      e.jsx(
                                        F,
                                        {
                                          variant: "outline",
                                          className: "font-normal text-[11px]",
                                          children: s,
                                        },
                                        s,
                                      ),
                                    ),
                                  })
                                : e.jsx("p", {
                                    className: "font-medium text-muted-foreground",
                                    children: "Sin sucursales",
                                  })
                              : e.jsx("p", {
                                  className: "font-medium text-muted-foreground",
                                  children: "Disponible según tu sucursal activa",
                                }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Categoría",
                            }),
                            t.category
                              ? e.jsx(F, {
                                  variant: "outline",
                                  className:
                                    "font-normal text-[11px] border-primary/30 text-primary",
                                  children: t.category,
                                })
                              : e.jsx("p", { className: "font-medium", children: "—" }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Tags",
                            }),
                            (t.tags ?? []).length > 0
                              ? e.jsx("div", {
                                  className: "flex flex-wrap gap-1.5",
                                  children: (t.tags ?? []).map((s) =>
                                    e.jsx(
                                      "span",
                                      {
                                        className:
                                          "inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[11px] text-muted-foreground",
                                        children: s,
                                      },
                                      s,
                                    ),
                                  ),
                                })
                              : e.jsx("p", { className: "font-medium", children: "—" }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground text-xs",
                              children: "Timeout",
                            }),
                            e.jsxs("p", {
                              className: "font-medium",
                              children: [t.timeout_seconds ?? "—", "s"],
                            }),
                          ],
                        }),
                        t.api_key_masked &&
                          e.jsxs("div", {
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "API Key",
                              }),
                              e.jsx("p", {
                                className: "font-medium font-mono text-xs",
                                children: t.api_key_masked,
                              }),
                            ],
                          }),
                        t.auth_type === "endpoint_auth" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx("span", {
                                    className: "text-muted-foreground text-xs",
                                    children: "Endpoint auth",
                                  }),
                                  e.jsx("p", {
                                    className: "font-medium font-mono text-xs",
                                    children: t.auth_endpoint_key || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("span", {
                                    className: "text-muted-foreground text-xs",
                                    children: "Token path",
                                  }),
                                  e.jsx("p", {
                                    className: "font-medium font-mono text-xs",
                                    children: t.auth_token_path || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("span", {
                                    className: "text-muted-foreground text-xs",
                                    children: "Prefijo Authorization",
                                  }),
                                  e.jsx("p", {
                                    className: "font-medium font-mono text-xs",
                                    children: t.auth_header_prefix || "Bearer",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        (N || t.health_endpoint_key) &&
                          e.jsxs("div", {
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Endpoint de prueba",
                              }),
                              e.jsx("p", {
                                className: "font-medium font-mono text-xs",
                                children: t.health_endpoint_key || "Automático",
                              }),
                            ],
                          }),
                        me(t) &&
                          e.jsxs("div", {
                            className:
                              "md:col-span-2 rounded-lg border border-border/60 bg-muted/15 px-3 py-2 text-xs text-muted-foreground",
                            children: [
                              "Auth",
                              " ",
                              e.jsx("span", {
                                className: "text-foreground font-medium",
                                children: Ie[t.auth_type || ""] || t.auth_type || "abierta",
                              }),
                              ": la cuenta usable por agentes se configura en",
                              " ",
                              e.jsx("button", {
                                type: "button",
                                className: "text-primary hover:underline font-medium",
                                onClick: () => U("instalacion"),
                                children: "Instalación → Conectar cuenta",
                              }),
                              ".",
                            ],
                          }),
                        t.description &&
                          e.jsxs("div", {
                            className: "md:col-span-2",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Descripción",
                              }),
                              e.jsx("p", { className: "font-medium", children: t.description }),
                            ],
                          }),
                        t.default_headers &&
                          Object.keys(t.default_headers).length > 0 &&
                          e.jsxs("div", {
                            className: "md:col-span-2",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground text-xs",
                                children: "Headers por defecto",
                              }),
                              e.jsx("pre", {
                                className:
                                  "mt-1 text-[11px] font-mono rounded-md border bg-muted/30 p-2 overflow-auto",
                                children: J(t.default_headers),
                              }),
                            ],
                          }),
                      ],
                    }),
              ],
            }),
          }),
          N &&
            e.jsx(ve, {
              value: "endpoints",
              className: "mt-0",
              children: e.jsxs("section", {
                className: "space-y-5",
                children: [
                  e.jsxs("div", {
                    className: "border-b border-border/60 pb-3",
                    children: [
                      e.jsx("h2", { className: "text-sm font-medium", children: "Endpoints" }),
                      e.jsx("p", {
                        className: "text-xs text-muted-foreground mt-0.5",
                        children:
                          "Rutas de la aplicación que usan las skills. Si usas auth Login, crea primero el endpoint de login y selecciónalo en Configuración.",
                      }),
                    ],
                  }),
                  e.jsx(Wa, {
                    endpoints: t.endpoints ?? {},
                    canManage: o,
                    saving: D.isPending,
                    onSave: Rs,
                    embedded: !0,
                    authEndpointKey:
                      (j === "endpoint_auth" && (ge.trim() || t.auth_endpoint_key)) || "",
                  }),
                ],
              }),
            }),
          k &&
            e.jsx(ve, {
              value: "skills",
              className: "mt-0",
              children: e.jsxs("section", {
                className: "space-y-5",
                children: [
                  e.jsxs("div", {
                    className:
                      "flex flex-col sm:flex-row sm:items-start gap-3 justify-between border-b border-border/60 pb-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("h2", {
                            className: "text-sm font-medium",
                            children: "Skills vinculadas",
                          }),
                          e.jsx("p", {
                            className: "text-xs text-muted-foreground mt-0.5",
                            children:
                              "Skills que usan esta aplicación. Puedes generar skills API automáticamente desde los endpoints (se omiten login/credenciales).",
                          }),
                        ],
                      }),
                      o &&
                        e.jsxs("div", {
                          className: "flex flex-wrap gap-2 shrink-0",
                          children: [
                            e.jsxs(A, {
                              size: "sm",
                              variant: "outline",
                              onClick: cs,
                              disabled: L.isPending || ue === 0,
                              children: [
                                L.isPending
                                  ? e.jsx(ae, { className: "h-4 w-4 mr-1.5 animate-spin" })
                                  : e.jsx(La, { className: "h-4 w-4 mr-1.5" }),
                                "Generar desde endpoints",
                              ],
                            }),
                            e.jsx(A, {
                              size: "sm",
                              variant: "outline",
                              asChild: !0,
                              children: e.jsxs(Ue, {
                                to: "/app/skills/nuevo",
                                children: [
                                  "Nueva skill",
                                  e.jsx(ps, { className: "h-3.5 w-3.5 ml-1" }),
                                ],
                              }),
                            }),
                          ],
                        }),
                    ],
                  }),
                  xe
                    ? e.jsx(Da, { lines: 4 })
                    : R.length === 0
                      ? e.jsxs("div", {
                          className: "py-10 text-center space-y-3",
                          children: [
                            e.jsx("p", {
                              className: "text-sm text-muted-foreground",
                              children: "Todavía no hay skills vinculadas a esta aplicación.",
                            }),
                            o &&
                              ue > 0 &&
                              e.jsx(A, {
                                size: "sm",
                                onClick: cs,
                                disabled: L.isPending,
                                children: "Generar skills desde endpoints",
                              }),
                          ],
                        })
                      : e.jsx("ul", {
                          className: "divide-y divide-border/60",
                          children: R.map((s) => {
                            const b =
                              s.implementation_type === "api" &&
                              s.config &&
                              typeof s.config == "object" &&
                              "endpoint_type" in s.config
                                ? String(s.config.endpoint_type || "")
                                : "";
                            return e.jsx(
                              "li",
                              {
                                children: e.jsxs(Ue, {
                                  to: `/app/skills/${s.id}`,
                                  className:
                                    "flex items-start gap-3 py-3 -mx-1 px-1 rounded-md hover:bg-muted/35 transition-colors group",
                                  children: [
                                    e.jsxs("div", {
                                      className: "min-w-0 flex-1 space-y-0.5",
                                      children: [
                                        e.jsxs("div", {
                                          className: "flex flex-wrap items-center gap-2",
                                          children: [
                                            e.jsx("span", {
                                              className:
                                                "text-sm font-medium truncate group-hover:text-primary transition-colors",
                                              children: s.name,
                                            }),
                                            e.jsx(F, {
                                              variant: "outline",
                                              className: "text-[10px] font-normal",
                                              children:
                                                za[s.implementation_type ?? "api"] ??
                                                s.implementation_type,
                                            }),
                                            s.is_active === !1 &&
                                              e.jsx(F, {
                                                variant: "secondary",
                                                className: "text-[10px]",
                                                children: "Inactiva",
                                              }),
                                          ],
                                        }),
                                        e.jsxs("p", {
                                          className:
                                            "text-[11px] text-muted-foreground font-mono truncate",
                                          children: [s.slug, b ? ` · ${b}` : ""],
                                        }),
                                        s.description
                                          ? e.jsx("p", {
                                              className:
                                                "text-xs text-muted-foreground line-clamp-1",
                                              children: s.description,
                                            })
                                          : null,
                                      ],
                                    }),
                                    e.jsx(ps, {
                                      className:
                                        "h-4 w-4 text-muted-foreground shrink-0 mt-0.5 opacity-50 group-hover:opacity-100",
                                    }),
                                  ],
                                }),
                              },
                              s.id,
                            );
                          }),
                        }),
                ],
              }),
            }),
          me(t) &&
            e.jsx(ve, { value: "cuenta", className: "mt-0", children: e.jsx(Fa, { api: t }) }),
          o &&
            e.jsx(ve, {
              value: "probar",
              className: "mt-0",
              children: e.jsx(nt, { api: t, onExit: () => U("configuracion") }),
            }),
        ],
      }),
    ],
  });
}
export { mt as default };
