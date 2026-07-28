import {
  aL as b,
  aM as h,
  r as d,
  j as a,
  aN as N,
  aO as i,
  aP as l,
  aQ as c,
  aR as m,
  aS as f,
  aT as u,
  aU as p,
  aV as x,
  aW as g,
} from "./vendor-react-DUYfdZnL.js";
import { c as n, bx as y, ai as C, fy as j } from "./studio-chat-Bi-RYdat.js";
const P = b,
  O = h,
  w = d.forwardRef(({ className: e, inset: t, children: o, ...s }, r) =>
    a.jsxs(f, {
      ref: r,
      className: n(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        t && "pl-8",
        e,
      ),
      ...s,
      children: [o, a.jsx(y, { className: "ml-auto h-4 w-4" })],
    }),
  );
w.displayName = f.displayName;
const v = d.forwardRef(({ className: e, ...t }, o) =>
  a.jsx(u, {
    ref: o,
    className: n(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
      e,
    ),
    ...t,
  }),
);
v.displayName = u.displayName;
const R = d.forwardRef(({ className: e, ...t }, o) =>
  a.jsx(N, {
    children: a.jsx(i, {
      ref: o,
      className: n(
        "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
        e,
      ),
      ...t,
    }),
  }),
);
R.displayName = i.displayName;
const M = d.forwardRef(({ className: e, inset: t, ...o }, s) =>
  a.jsx(m, {
    ref: s,
    className: n(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      t && "pl-8",
      e,
    ),
    ...o,
  }),
);
M.displayName = m.displayName;
const S = d.forwardRef(({ className: e, children: t, checked: o, ...s }, r) =>
  a.jsxs(p, {
    ref: r,
    className: n(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    checked: o,
    ...s,
    children: [
      a.jsx("span", {
        className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: a.jsx(x, { children: a.jsx(C, { className: "h-4 w-4" }) }),
      }),
      t,
    ],
  }),
);
S.displayName = p.displayName;
const I = d.forwardRef(({ className: e, children: t, ...o }, s) =>
  a.jsxs(g, {
    ref: s,
    className: n(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    ...o,
    children: [
      a.jsx("span", {
        className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: a.jsx(x, { children: a.jsx(j, { className: "h-4 w-4 fill-current" }) }),
      }),
      t,
    ],
  }),
);
I.displayName = g.displayName;
const z = d.forwardRef(({ className: e, inset: t, ...o }, s) =>
  a.jsx(l, {
    ref: s,
    className: n("px-2 py-1.5 text-sm font-semibold text-foreground", t && "pl-8", e),
    ...o,
  }),
);
z.displayName = l.displayName;
const T = d.forwardRef(({ className: e, ...t }, o) =>
  a.jsx(c, { ref: o, className: n("-mx-1 my-1 h-px bg-border", e), ...t }),
);
T.displayName = c.displayName;
const k = ({ className: e, ...t }) =>
  a.jsx("span", { className: n("ml-auto text-xs tracking-widest text-muted-foreground", e), ...t });
k.displayName = "ContextMenuShortcut";
export { P as C, O as a, R as b, z as c, T as d, M as e, k as f };
