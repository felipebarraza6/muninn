import { j as t } from "./vendor-react-DUYfdZnL.js";
import {
  U as u,
  dt as h,
  W as m,
  X as x,
  Y as i,
  Z as y,
  $ as j,
  V as v,
} from "./studio-chat-BBQUCckT.js";
function k({ fields: l, values: o, onChange: c, disabled: a }) {
  return l.length
    ? t.jsx("div", {
        className: "space-y-4",
        children: l.map((e) => {
          const s = o[e.key],
            n = `cfg-${e.key}`;
          if (e.type === "switch")
            return t.jsxs(
              "div",
              {
                className: "flex items-center justify-between rounded-lg border p-3",
                children: [
                  t.jsxs("div", {
                    className: "space-y-0.5 pr-3",
                    children: [
                      t.jsx(u, { htmlFor: n, children: e.label }),
                      e.help
                        ? t.jsx("p", {
                            className: "text-xs text-muted-foreground",
                            children: e.help,
                          })
                        : null,
                    ],
                  }),
                  t.jsx(h, {
                    id: n,
                    checked: !!(s ?? e.default ?? !1),
                    onCheckedChange: (r) => c(e.key, r),
                    disabled: a,
                  }),
                ],
              },
              e.key,
            );
          if (e.type === "select" && e.options?.length)
            return t.jsxs(
              "div",
              {
                className: "space-y-2",
                children: [
                  t.jsxs(u, { htmlFor: n, children: [e.label, e.required ? " *" : ""] }),
                  t.jsxs(m, {
                    value: String(s ?? e.default ?? ""),
                    onValueChange: (r) => c(e.key, r),
                    disabled: a,
                    children: [
                      t.jsx(x, {
                        id: n,
                        children: t.jsx(i, { placeholder: `Selecciona ${e.label.toLowerCase()}` }),
                      }),
                      t.jsx(y, {
                        children: e.options.map((r) =>
                          t.jsx(j, { value: r.value, children: r.label }, r.value),
                        ),
                      }),
                    ],
                  }),
                  e.help
                    ? t.jsx("p", { className: "text-xs text-muted-foreground", children: e.help })
                    : null,
                ],
              },
              e.key,
            );
          const p =
            e.type === "password"
              ? "password"
              : e.type === "number"
                ? "number"
                : e.type === "url"
                  ? "url"
                  : e.type === "email"
                    ? "email"
                    : "text";
          return t.jsxs(
            "div",
            {
              className: "space-y-2",
              children: [
                t.jsxs(u, { htmlFor: n, children: [e.label, e.required ? " *" : ""] }),
                t.jsx(v, {
                  id: n,
                  type: p,
                  value: s == null ? "" : String(s),
                  onChange: (r) =>
                    c(
                      e.key,
                      e.type === "number"
                        ? r.target.value === ""
                          ? ""
                          : Number(r.target.value)
                        : r.target.value,
                    ),
                  placeholder:
                    e.secret && s ? "Dejar vacío para conservar el valor actual" : void 0,
                  autoComplete: e.secret ? "new-password" : void 0,
                  disabled: a,
                }),
                e.help
                  ? t.jsx("p", { className: "text-xs text-muted-foreground", children: e.help })
                  : null,
              ],
            },
            e.key,
          );
        }),
      })
    : t.jsx("p", {
        className: "text-sm text-muted-foreground",
        children: "Este canal no requiere campos de configuración adicionales.",
      });
}
function b(l, o) {
  const c = new Set(o.filter((e) => e.secret).map((e) => e.key)),
    a = {};
  for (const [e, s] of Object.entries(l))
    (c.has(e) &&
      (s == null || s === "" || (typeof s == "string" && (s === "****" || s.includes("..."))))) ||
      (a[e] = s);
  return a;
}
export { k as C, b as c };
