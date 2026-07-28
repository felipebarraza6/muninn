import { j as e } from "./vendor-react-DUYfdZnL.js";
import { h as i, P as m } from "./index-BvBbVnNp.js";
import { c as x } from "./studio-chat-BBQUCckT.js";
function p(a) {
  const { children: s, className: t, as: n = "div", ...r } = a,
    l = x(i(), t);
  return n === "form"
    ? e.jsx("form", { className: l, ...r, children: s })
    : e.jsx("div", { className: l, ...r, children: s });
}
function f({ title: a, subtitle: s, className: t }) {
  return e.jsx("div", {
    className: x("space-y-4 text-center", t),
    children: e.jsxs("div", {
      className: "inline-flex flex-col items-center gap-3",
      children: [
        e.jsxs("div", {
          className: "flex items-end justify-center gap-3",
          children: [
            e.jsx(m, { featured: !0, className: "h-11 w-12 sm:h-12 sm:w-14" }),
            e.jsx("p", {
              className: "pixel-font text-[1.2rem] text-foreground sm:text-[1.4rem]",
              children: "MUNINN",
            }),
          ],
        }),
        e.jsxs("div", {
          className: "space-y-2",
          children: [
            e.jsx("h1", {
              className:
                "pixel-font text-[12px] uppercase leading-relaxed text-foreground sm:text-[13px]",
              children: a,
            }),
            s
              ? e.jsx("p", {
                  className:
                    "pixel-display mx-auto max-w-[18rem] text-[13px] leading-relaxed text-muted-foreground",
                  children: s,
                })
              : null,
          ],
        }),
      ],
    }),
  });
}
export { f as A, p as a };
