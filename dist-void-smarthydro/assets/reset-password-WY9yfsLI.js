import { aw as P, af as A, r as a, j as e, ah as S } from "./vendor-react-DUYfdZnL.js";
import { f as L, L as E, A as u, b as m, c as p, g as x } from "./index-E7U1k6KS.js";
import { cA as M, B as h, c as o, a5 as k } from "./studio-chat-Bi-RYdat.js";
import { A as B, a as f } from "./AuthPixelBrand-DV52CHSR.js";
import "./vendor-query-IAyuTf1L.js";
import "./admin-CEWZN_UE.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-charts-l0_txfiz.js";
function Y() {
  const { token: r } = P(),
    g = A(),
    t = L(),
    l = M(),
    [n, v] = a.useState(""),
    [i, j] = a.useState(""),
    [c, s] = a.useState(null),
    [w, N] = a.useState(!1),
    b = (y) => {
      if ((y.preventDefault(), s(null), !r)) {
        s("Enlace inválido.");
        return;
      }
      if (n !== i) {
        s("Las contraseñas no coinciden.");
        return;
      }
      t.mutate(
        { token: r, new_password: n, confirm_password: i },
        {
          onSuccess: () => N(!0),
          onError: (d) => {
            const C = d.friendlyMessage || d.message || "No se pudo actualizar la contraseña.";
            s(C);
          },
        },
      );
    };
  return e.jsxs("div", {
    className: "login-pixel relative min-h-screen overflow-hidden bg-background",
    children: [
      e.jsx(E, { intensity: "full", variant: "pixel" }),
      e.jsx("div", {
        className: "relative z-[1] flex min-h-screen items-center justify-center px-4 py-10",
        children: e.jsxs("div", {
          className: o("w-full max-w-sm space-y-6", !l && "pixel-enter"),
          style: l ? void 0 : { "--pixel-delay": "80ms" },
          children: [
            e.jsx(B, {
              title: "Nueva contraseña",
              subtitle: "Elige una contraseña nueva para tu cuenta.",
            }),
            w
              ? e.jsxs(f, {
                  className: "space-y-4",
                  children: [
                    e.jsx("div", {
                      "aria-live": "polite",
                      children: e.jsx(u, {
                        className: "border-primary/25 bg-primary/10",
                        children: e.jsx(m, {
                          className: "pixel-display text-[13px] leading-relaxed",
                          children: "Contraseña actualizada. Ya puedes entrar.",
                        }),
                      }),
                    }),
                    e.jsx(h, {
                      type: "button",
                      className: o(p),
                      onClick: () => g("/entrar"),
                      children: "Ir al login",
                    }),
                  ],
                })
              : e.jsxs(f, {
                  as: "form",
                  onSubmit: b,
                  className: "space-y-5",
                  children: [
                    e.jsx("div", {
                      "aria-live": "polite",
                      "aria-atomic": "true",
                      children: c
                        ? e.jsx(u, {
                            variant: "destructive",
                            className: "mb-1 border-destructive/30 bg-destructive/10",
                            children: e.jsx(m, { children: c }),
                          })
                        : null,
                    }),
                    e.jsx(x, {
                      id: "new-password",
                      label: "Nueva contraseña",
                      value: n,
                      onChange: v,
                      autoComplete: "new-password",
                      minLength: 8,
                      autoFocus: !0,
                      pixel: !0,
                    }),
                    e.jsx(x, {
                      id: "confirm-password",
                      label: "Confirmar",
                      value: i,
                      onChange: j,
                      autoComplete: "new-password",
                      minLength: 8,
                      pixel: !0,
                    }),
                    e.jsx(h, {
                      type: "submit",
                      className: o(p),
                      disabled: t.isPending || !r,
                      children: t.isPending
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsx(k, {
                                className: "mr-2 h-4 w-4 animate-spin",
                                "aria-hidden": !0,
                              }),
                              "Guardando…",
                            ],
                          })
                        : "Guardar contraseña",
                    }),
                    e.jsx("p", {
                      className:
                        "pixel-font text-center text-[8px] uppercase text-muted-foreground",
                      children: e.jsx(S, {
                        to: "/entrar",
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
export { Y as default };
