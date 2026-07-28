import { aw as T, ag as z, af as R, r as u, j as e, ah as k } from "./vendor-react-DUYfdZnL.js";
import {
  u as D,
  r as I,
  a as U,
  L as V,
  M as f,
  A as v,
  b as j,
  c as b,
  d as q,
  e as O,
} from "./index-BvBbVnNp.js";
import {
  cA as $,
  ba as y,
  cB as N,
  B as P,
  c as r,
  U as G,
  V as H,
  a5 as J,
} from "./studio-chat-BBQUCckT.js";
import { A as K, a as L } from "./AuthPixelBrand-CVHvLKKZ.js";
import { m as Q } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-query-IAyuTf1L.js";
import "./admin-CJj1SvsI.js";
import "./vendor-charts-l0_txfiz.js";
function M(t, l = !1) {
  return t ? `/${encodeURIComponent(t)}` : l ? "/entrar" : "/";
}
function te() {
  const { slug: t } = T(),
    [l] = z(),
    n = t || l.get("slug") || void 0,
    _ = R(),
    m = $(),
    { flat: s, isAppDefault: w, isLoading: A } = D(n),
    a = w,
    C = s?.app_name?.trim() || s?.fantasy_name?.trim() || s?.organization_name?.trim() || "Muninn",
    S = I(s) || y(s?.organization_logo_url) || y(s?.logo_url) || null,
    [d, E] = u.useState(""),
    [p, x] = u.useState(null),
    [g, h] = u.useState(null),
    o = U(),
    B = (c) => {
      (c.preventDefault(),
        h(null),
        x(null),
        o.mutate(
          {
            email: d,
            login_slug: s?.login_slug || n || null,
            branch_id: s?.branch_id != null ? Number(s.branch_id) : null,
          },
          {
            onSuccess: (i) => {
              x(
                i.message ||
                  "Si el email existe, recibirás instrucciones para recuperar tu contraseña.",
              );
            },
            onError: (i) => {
              const F =
                i.friendlyMessage || i.message || "No se pudo enviar el correo. Intenta de nuevo.";
              h(F);
            },
          },
        ));
    };
  return e.jsxs("div", {
    className: r("relative min-h-screen overflow-hidden bg-background", a && "login-pixel"),
    children: [
      e.jsx(V, { intensity: a ? "full" : "soft", variant: a ? "pixel" : "aurora" }),
      e.jsx("div", {
        className: "relative z-[1] flex min-h-screen items-center justify-center px-4 py-10",
        children: e.jsxs(Q.div, {
          className: r("w-full max-w-sm space-y-6", a && "pixel-enter"),
          style: a && !m ? { "--pixel-delay": "80ms" } : void 0,
          initial: a || m ? !1 : { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: N.slow, ease: N.easeOut },
          children: [
            a
              ? e.jsx(K, {
                  title: "Recuperar contraseña",
                  subtitle: "Te enviamos un enlace al correo para recuperar tu acceso.",
                })
              : e.jsxs("div", {
                  className: "space-y-3 text-center",
                  children: [
                    A
                      ? e.jsx(f, {
                          pending: !0,
                          layout: "horizontal",
                          className: "justify-center scale-110",
                        })
                      : e.jsx(f, {
                          branchLabel: C,
                          branchLogoUrl: S,
                          layout: "horizontal",
                          className: "justify-center scale-110",
                        }),
                    e.jsx("p", {
                      className: "text-sm leading-relaxed text-muted-foreground",
                      children: "Recupera tu acceso. Te enviamos un enlace al correo.",
                    }),
                  ],
                }),
            p
              ? e.jsxs(L, {
                  className: "space-y-4",
                  children: [
                    e.jsx("div", {
                      "aria-live": "polite",
                      children: e.jsx(v, {
                        className: "border-primary/25 bg-primary/10",
                        children: e.jsx(j, {
                          className: a ? "pixel-display text-[13px] leading-relaxed" : void 0,
                          children: p,
                        }),
                      }),
                    }),
                    e.jsx(P, {
                      type: "button",
                      variant: a ? "default" : "outline",
                      className: r(a ? b : "h-11 w-full"),
                      onClick: () => _(M(n, a)),
                      children: "Volver al login",
                    }),
                  ],
                })
              : e.jsxs(L, {
                  as: "form",
                  onSubmit: B,
                  className: "space-y-5",
                  children: [
                    e.jsx("div", {
                      "aria-live": "polite",
                      "aria-atomic": "true",
                      children: g
                        ? e.jsx(v, {
                            variant: "destructive",
                            className: "mb-1 border-destructive/30 bg-destructive/10",
                            children: e.jsx(j, { children: g }),
                          })
                        : null,
                    }),
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx(G, {
                          htmlFor: "forgot-email",
                          className: q,
                          children: "Correo electrónico",
                        }),
                        e.jsx(H, {
                          id: "forgot-email",
                          type: "email",
                          placeholder: "tu@correo.com",
                          value: d,
                          onChange: (c) => E(c.target.value),
                          required: !0,
                          autoComplete: "email",
                          autoFocus: !0,
                          className: O,
                        }),
                      ],
                    }),
                    e.jsx(P, {
                      type: "submit",
                      className: r(b),
                      disabled: o.isPending,
                      children: o.isPending
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsx(J, {
                                className: "mr-2 h-4 w-4 animate-spin",
                                "aria-hidden": !0,
                              }),
                              "Enviando…",
                            ],
                          })
                        : "Enviar enlace",
                    }),
                    e.jsx("p", {
                      className: r(
                        "text-center text-muted-foreground",
                        a ? "pixel-font text-[8px] uppercase" : "text-sm",
                      ),
                      children: e.jsx(k, {
                        to: M(n, a),
                        className: "font-medium text-primary underline-offset-2 hover:underline",
                        children: "Volver al login",
                      }),
                    }),
                  ],
                }),
          ],
        }),
      }),
    ],
  });
}
export { te as default };
