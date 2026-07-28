const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/index-B63CxC74.js",
      "assets/vendor-react-DUYfdZnL.js",
      "assets/studio-chat-Bi-RYdat.js",
      "assets/vendor-motion-BE8MBDzG.js",
      "assets/vendor-query-IAyuTf1L.js",
      "assets/vendor-charts-l0_txfiz.js",
      "assets/studio-chat-BnuhLJ6X.css",
      "assets/admin-CEWZN_UE.js",
      "assets/useChannels-4JqEwRHd.js",
      "assets/conversaciones-BKc6sG-6.js",
      "assets/planes-CIMkC8x3.js",
      "assets/useWorkflows-BDj5QeFI.js",
      "assets/workflows-C7mK2Wi9.js",
      "assets/workflowCatalog-GgI4Rjhb.js",
      "assets/workflows._id-3qH3HccR.js",
      "assets/context-menu-6H0gO2RR.js",
      "assets/canales-CLQQaTt_.js",
      "assets/channel-config-fields-Bq6Jumyl.js",
      "assets/canales._id-BgsZtwa5.js",
      "assets/EmbedChatPanel-Cm9Fl00A.js",
      "assets/apis-XN_NQ6u0.js",
      "assets/external-api-Dqhtjsyy.js",
      "assets/apis._id-DKc-Xiup.js",
      "assets/funciones-B3yolDxo.js",
      "assets/funciones.nuevo-C3oE2wx7.js",
      "assets/formula-expression-editor-BpTGI7wd.js",
      "assets/funciones._id-D5odz40O.js",
      "assets/conocimiento-DqXDAZ7-.js",
      "assets/conocimiento.datos-B9pIQyw2.js",
      "assets/conocimiento.nuevo-De-j31hr.js",
      "assets/conocimiento._id-2Edo3WcO.js",
      "assets/embed.chat._id-CW7yxRQH.js",
      "assets/forgot-password-B_xmyVh5.js",
      "assets/AuthPixelBrand-DV52CHSR.js",
      "assets/reset-password-WY9yfsLI.js",
      "assets/perfil-BK1WFsrp.js",
    ]),
) => i.map((i) => d[i]);
import {
  r as l,
  K as te,
  j as e,
  aC as Xt,
  S as Se,
  ah as X,
  aD as pe,
  af as yt,
  aE as ze,
  aF as Z,
  aw as jt,
  ag as Jr,
  aG as Xr,
  aH as er,
  aI as w,
  aJ as ea,
} from "./vendor-react-DUYfdZnL.js";
import { u as Oe, b as Le, a as vt, Q as ta, c as ra } from "./vendor-query-IAyuTf1L.js";
import {
  c as m,
  by as aa,
  bz as sa,
  bA as na,
  bB as ia,
  bC as oa,
  B as ce,
  bD as la,
  bE as tr,
  V as wt,
  bF as Dt,
  ba as oe,
  d as be,
  bG as ca,
  bH as rr,
  as as da,
  bf as ut,
  i as Y,
  af as Nt,
  bI as ar,
  bJ as sr,
  bK as fe,
  E as q,
  b as ua,
  bd as xa,
  bL as _t,
  aS as J,
  be as we,
  bM as kt,
  bN as le,
  bO as St,
  J as Te,
  bP as nr,
  bQ as Lt,
  aP as Ue,
  bR as Et,
  bS as ir,
  bT as At,
  bU as or,
  bV as lr,
  bW as cr,
  bX as Rt,
  bY as pa,
  bZ as $e,
  aq as Pt,
  b_ as Ge,
  aM as Ne,
  b$ as dr,
  P as Ve,
  c0 as ma,
  c1 as ur,
  c2 as ha,
  a as fa,
  c3 as ga,
  c4 as de,
  c5 as ba,
  c6 as xr,
  c7 as xt,
  k as ya,
  c8 as ja,
  W as va,
  X as wa,
  Y as Na,
  Z as _a,
  $ as ka,
  a5 as pr,
  c9 as Sa,
  ca as La,
  cb as Ea,
  cc as Aa,
  cd as Ra,
  ce as Pa,
  cf as Ma,
  cg as Ca,
  ch as pt,
  ci as mr,
  cj as Ia,
  bx as za,
  aV as Oa,
  aW as Ta,
  ck as $a,
  cl as Da,
  aY as Ba,
  aZ as Bt,
  cm as hr,
  I as fr,
  cn as Fa,
  co as Ha,
  a7 as Wa,
  cp as qa,
  cq as Ua,
  cr as mt,
  cs as Ga,
  ct as Ft,
  cu as Va,
  cv as Ka,
  cw as Ya,
  aU as Qa,
  cx as Za,
  U as gr,
  cy as Ja,
  cz as Xa,
  cA as br,
  cB as De,
  cC as yr,
} from "./studio-chat-Bi-RYdat.js";
import { T as es, a as ts, b as rs, c as as, r as ge, M as ye } from "./admin-CEWZN_UE.js";
import { u as G, m as I, A as ue } from "./vendor-motion-BE8MBDzG.js";
import "./vendor-charts-l0_txfiz.js";
(function () {
  const r = document.createElement("link").relList;
  if (r && r.supports && r.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === "childList")
        for (const c of i.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && s(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const i = {};
    return (
      n.integrity && (i.integrity = n.integrity),
      n.referrerPolicy && (i.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (i.credentials = "omit")
          : (i.credentials = "same-origin"),
      i
    );
  }
  function s(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = a(n);
    fetch(n.href, i);
  }
})();
const ss = "modulepreload",
  ns = function (t) {
    return "/" + t;
  },
  Ht = {},
  A = function (r, a, s) {
    let n = Promise.resolve();
    if (a && a.length > 0) {
      let c = function (d) {
        return Promise.all(
          d.map((u) =>
            Promise.resolve(u).then(
              (f) => ({ status: "fulfilled", value: f }),
              (f) => ({ status: "rejected", reason: f }),
            ),
          ),
        );
      };
      document.getElementsByTagName("link");
      const o = document.querySelector("meta[property=csp-nonce]"),
        x = o?.nonce || o?.getAttribute("nonce");
      n = c(
        a.map((d) => {
          if (((d = ns(d)), d in Ht)) return;
          Ht[d] = !0;
          const u = d.endsWith(".css"),
            f = u ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${d}"]${f}`)) return;
          const h = document.createElement("link");
          if (
            ((h.rel = u ? "stylesheet" : ss),
            u || (h.as = "script"),
            (h.crossOrigin = ""),
            (h.href = d),
            x && h.setAttribute("nonce", x),
            document.head.appendChild(h),
            u)
          )
            return new Promise((g, y) => {
              (h.addEventListener("load", g),
                h.addEventListener("error", () => y(Error(`Unable to preload CSS for ${d}`))));
            });
        }),
      );
    }
    function i(c) {
      const o = new Event("vite:preloadError", { cancelable: !0 });
      if (((o.payload = c), window.dispatchEvent(o), !o.defaultPrevented)) throw c;
    }
    return n.then((c) => {
      for (const o of c || []) o.status === "rejected" && i(o.reason);
      return r().catch(i);
    });
  };
var jr = ((t) => (
    (t.BASE = "base"),
    (t.BODY = "body"),
    (t.HEAD = "head"),
    (t.HTML = "html"),
    (t.LINK = "link"),
    (t.META = "meta"),
    (t.NOSCRIPT = "noscript"),
    (t.SCRIPT = "script"),
    (t.STYLE = "style"),
    (t.TITLE = "title"),
    (t.FRAGMENT = "Symbol(react.fragment)"),
    t
  ))(jr || {}),
  Xe = {
    link: { rel: ["amphtml", "canonical", "alternate"] },
    script: { type: ["application/ld+json"] },
    meta: {
      charset: "",
      name: ["generator", "robots", "description"],
      property: [
        "og:type",
        "og:title",
        "og:url",
        "og:image",
        "og:image:alt",
        "og:description",
        "twitter:url",
        "twitter:title",
        "twitter:description",
        "twitter:image",
        "twitter:image:alt",
        "twitter:card",
        "twitter:site",
      ],
    },
  };
Object.values(jr);
var Mt = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex",
};
Object.entries(Mt).reduce((t, [r, a]) => ((t[a] = r), t), {});
var _e = "data-rh",
  is = (t) => (Array.isArray(t) ? t.join("") : t),
  os = (t, r) => {
    const a = Object.keys(t);
    for (let s = 0; s < a.length; s += 1) if (r[a[s]] && r[a[s]].includes(t[a[s]])) return !0;
    return !1;
  },
  et = (t, r) =>
    Array.isArray(t)
      ? t.reduce((a, s) => (os(s, r) ? a.priority.push(s) : a.default.push(s), a), {
          priority: [],
          default: [],
        })
      : { default: t, priority: [] },
  ls = ["noscript", "script", "style"],
  ht = (t, r = !0) =>
    r === !1
      ? String(t)
      : String(t)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;"),
  vr = (t) =>
    Object.keys(t).reduce((r, a) => {
      const s = typeof t[a] < "u" ? `${a}="${t[a]}"` : `${a}`;
      return r ? `${r} ${s}` : s;
    }, ""),
  cs = (t, r, a, s) => {
    const n = vr(a),
      i = is(r);
    return n
      ? `<${t} ${_e}="true" ${n}>${ht(i, s)}</${t}>`
      : `<${t} ${_e}="true">${ht(i, s)}</${t}>`;
  },
  ds = (t, r, a = !0) =>
    r.reduce((s, n) => {
      const i = n,
        c = Object.keys(i)
          .filter((d) => !(d === "innerHTML" || d === "cssText"))
          .reduce((d, u) => {
            const f = typeof i[u] > "u" ? u : `${u}="${ht(i[u], a)}"`;
            return d ? `${d} ${f}` : f;
          }, ""),
        o = i.innerHTML || i.cssText || "",
        x = ls.indexOf(t) === -1;
      return `${s}<${t} ${_e}="true" ${c}${x ? "/>" : `>${o}</${t}>`}`;
    }, ""),
  wr = (t, r = {}) =>
    Object.keys(t).reduce((a, s) => {
      const n = Mt[s];
      return ((a[n || s] = t[s]), a);
    }, r),
  us = (t, r, a) => {
    const s = { key: r, [_e]: !0 },
      n = wr(a, s);
    return [te.createElement("title", n, r)];
  },
  Ie = (t, r) =>
    r.map((a, s) => {
      const n = { key: s, [_e]: !0 };
      return (
        Object.keys(a).forEach((i) => {
          const o = Mt[i] || i;
          if (o === "innerHTML" || o === "cssText") {
            const x = a.innerHTML || a.cssText;
            n.dangerouslySetInnerHTML = { __html: x };
          } else n[o] = a[i];
        }),
        te.createElement(t, n)
      );
    }),
  W = (t, r, a = !0) => {
    switch (t) {
      case "title":
        return {
          toComponent: () => us(t, r.title, r.titleAttributes),
          toString: () => cs(t, r.title, r.titleAttributes, a),
        };
      case "bodyAttributes":
      case "htmlAttributes":
        return { toComponent: () => wr(r), toString: () => vr(r) };
      default:
        return { toComponent: () => Ie(t, r), toString: () => ds(t, r, a) };
    }
  },
  xs = ({ metaTags: t, linkTags: r, scriptTags: a, encode: s }) => {
    const n = et(t, Xe.meta),
      i = et(r, Xe.link),
      c = et(a, Xe.script);
    return {
      priorityMethods: {
        toComponent: () => [
          ...Ie("meta", n.priority),
          ...Ie("link", i.priority),
          ...Ie("script", c.priority),
        ],
        toString: () =>
          `${W("meta", n.priority, s)} ${W("link", i.priority, s)} ${W("script", c.priority, s)}`,
      },
      metaTags: n.default,
      linkTags: i.default,
      scriptTags: c.default,
    };
  },
  ps = (t) => {
    const {
      baseTag: r,
      bodyAttributes: a,
      encode: s = !0,
      htmlAttributes: n,
      noscriptTags: i,
      styleTags: c,
      title: o = "",
      titleAttributes: x,
      prioritizeSeoTags: d,
    } = t;
    let { linkTags: u, metaTags: f, scriptTags: h } = t,
      g = { toComponent: () => [], toString: () => "" };
    return (
      d && ({ priorityMethods: g, linkTags: u, metaTags: f, scriptTags: h } = xs(t)),
      {
        priority: g,
        base: W("base", r, s),
        bodyAttributes: W("bodyAttributes", a, s),
        htmlAttributes: W("htmlAttributes", n, s),
        link: W("link", u, s),
        meta: W("meta", f, s),
        noscript: W("noscript", i, s),
        script: W("script", h, s),
        style: W("style", c, s),
        title: W("title", { title: o, titleAttributes: x }, s),
      }
    );
  },
  ms = ps,
  Re = [],
  Nr = !!(typeof window < "u" && window.document && window.document.createElement),
  hs = class {
    instances = [];
    canUseDOM = Nr;
    context;
    value = {
      setHelmet: (t) => {
        this.context.helmet = t;
      },
      helmetInstances: {
        get: () => (this.canUseDOM ? Re : this.instances),
        add: (t) => {
          (this.canUseDOM ? Re : this.instances).push(t);
        },
        remove: (t) => {
          const r = (this.canUseDOM ? Re : this.instances).indexOf(t);
          (this.canUseDOM ? Re : this.instances).splice(r, 1);
        },
      },
    };
    constructor(t, r) {
      ((this.context = t),
        (this.canUseDOM = r || !1),
        r ||
          (t.helmet = ms({
            baseTag: [],
            bodyAttributes: {},
            htmlAttributes: {},
            linkTags: [],
            metaTags: [],
            noscriptTags: [],
            scriptTags: [],
            styleTags: [],
            title: "",
            titleAttributes: {},
          })));
    }
  },
  fs = parseInt(te.version.split(".")[0], 10),
  Wt = fs >= 19,
  gs = {},
  bs = te.createContext(gs),
  ys = class _r extends l.Component {
    static canUseDOM = Nr;
    helmetData;
    constructor(r) {
      (super(r),
        Wt
          ? (this.helmetData = null)
          : (this.helmetData = new hs(this.props.context || {}, _r.canUseDOM)));
    }
    render() {
      return Wt
        ? te.createElement(te.Fragment, null, this.props.children)
        : te.createElement(bs.Provider, { value: this.helmetData.value }, this.props.children);
    }
  };
const tt = 768;
function js() {
  const [t, r] = l.useState(void 0);
  return (
    l.useEffect(() => {
      const a = window.matchMedia(`(max-width: ${tt - 1}px)`),
        s = () => {
          r(window.innerWidth < tt);
        };
      return (
        a.addEventListener("change", s),
        r(window.innerWidth < tt),
        () => a.removeEventListener("change", s)
      );
    }, []),
    !!t
  );
}
const kr = l.forwardRef(
  ({ className: t, orientation: r = "horizontal", decorative: a = !0, ...s }, n) =>
    e.jsx(Xt, {
      ref: n,
      decorative: a,
      orientation: r,
      className: m(
        "shrink-0 bg-border",
        r === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        t,
      ),
      ...s,
    }),
);
kr.displayName = Xt.displayName;
const vs = "sidebar_state",
  ws = 3600 * 24 * 7,
  Ns = "16rem",
  _s = "18rem",
  ks = "3rem",
  Ss = "b",
  Sr = l.createContext(null);
function Ee() {
  const t = l.useContext(Sr);
  if (!t) throw new Error("useSidebar must be used within a SidebarProvider.");
  return t;
}
const Lr = l.forwardRef(
  (
    { defaultOpen: t = !0, open: r, onOpenChange: a, className: s, style: n, children: i, ...c },
    o,
  ) => {
    const x = js(),
      [d, u] = l.useState(!1),
      [f, h] = l.useState(t),
      g = r ?? f,
      y = l.useCallback(
        (_) => {
          const N = typeof _ == "function" ? _(g) : _;
          (a ? a(N) : h(N), (document.cookie = `${vs}=${N}; path=/; max-age=${ws}`));
        },
        [a, g],
      ),
      j = l.useCallback(() => (x ? u((_) => !_) : y((_) => !_)), [x, y, u]);
    l.useEffect(() => {
      const _ = (N) => {
        N.key === Ss && (N.metaKey || N.ctrlKey) && (N.preventDefault(), j());
      };
      return (
        window.addEventListener("keydown", _),
        () => window.removeEventListener("keydown", _)
      );
    }, [j]);
    const k = g ? "expanded" : "collapsed",
      L = l.useMemo(
        () => ({
          state: k,
          open: g,
          setOpen: y,
          isMobile: x,
          openMobile: d,
          setOpenMobile: u,
          toggleSidebar: j,
        }),
        [k, g, y, x, d, u, j],
      );
    return e.jsx(Sr.Provider, {
      value: L,
      children: e.jsx(es, {
        delayDuration: 0,
        children: e.jsx("div", {
          style: { "--sidebar-width": Ns, "--sidebar-width-icon": ks, ...n },
          className: m(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            s,
          ),
          ref: o,
          ...c,
          children: i,
        }),
      }),
    });
  },
);
Lr.displayName = "SidebarProvider";
const Er = l.forwardRef(
  (
    {
      side: t = "left",
      variant: r = "sidebar",
      collapsible: a = "offcanvas",
      className: s,
      children: n,
      ...i
    },
    c,
  ) => {
    const { isMobile: o, state: x, openMobile: d, setOpenMobile: u } = Ee();
    return a === "none"
      ? e.jsx("div", {
          className: m(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            s,
          ),
          ref: c,
          ...i,
          children: n,
        })
      : o
        ? e.jsx(aa, {
            open: d,
            onOpenChange: u,
            ...i,
            children: e.jsxs(sa, {
              "data-sidebar": "sidebar",
              "data-mobile": "true",
              className:
                "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
              style: { "--sidebar-width": _s },
              side: t,
              children: [
                e.jsxs(na, {
                  className: "sr-only",
                  children: [
                    e.jsx(ia, { children: "Barra lateral" }),
                    e.jsx(oa, { children: "Muestra la barra lateral en móvil." }),
                  ],
                }),
                e.jsx("div", { className: "flex h-full w-full flex-col", children: n }),
              ],
            }),
          })
        : e.jsxs("div", {
            ref: c,
            className: "group peer hidden text-sidebar-foreground md:block",
            "data-state": x,
            "data-collapsible": x === "collapsed" ? a : "",
            "data-variant": r,
            "data-side": t,
            children: [
              e.jsx("div", {
                className: m(
                  "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
                  "group-data-[collapsible=offcanvas]:w-0",
                  "group-data-[side=right]:rotate-180",
                  r === "floating" || r === "inset"
                    ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                    : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
                ),
              }),
              e.jsx("div", {
                className: m(
                  "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
                  t === "left"
                    ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                    : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                  r === "floating" || r === "inset"
                    ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
                    : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
                  s,
                ),
                ...i,
                children: e.jsx("div", {
                  "data-sidebar": "sidebar",
                  className:
                    "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children: n,
                }),
              }),
            ],
          });
  },
);
Er.displayName = "Sidebar";
const Ar = l.forwardRef(({ className: t, onClick: r, ...a }, s) => {
  const { toggleSidebar: n } = Ee();
  return e.jsxs(ce, {
    ref: s,
    "data-sidebar": "trigger",
    variant: "ghost",
    size: "icon",
    className: m("h-7 w-7", t),
    onClick: (i) => {
      (r?.(i), n());
    },
    ...a,
    children: [
      e.jsx(la, {}),
      e.jsx("span", { className: "sr-only", children: "Alternar barra lateral" }),
    ],
  });
});
Ar.displayName = "SidebarTrigger";
const Ls = l.forwardRef(({ className: t, ...r }, a) => {
  const { toggleSidebar: s } = Ee();
  return e.jsx("button", {
    ref: a,
    "data-sidebar": "rail",
    "aria-label": "Alternar barra lateral",
    tabIndex: -1,
    onClick: s,
    title: "Alternar barra lateral",
    className: m(
      "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
      "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
      "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
      "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
      "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
      "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
      t,
    ),
    ...r,
  });
});
Ls.displayName = "SidebarRail";
const Rr = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("main", {
    ref: a,
    className: m(
      "relative flex w-full flex-1 flex-col bg-background",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
      t,
    ),
    ...r,
  }),
);
Rr.displayName = "SidebarInset";
const Es = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx(wt, {
    ref: a,
    "data-sidebar": "input",
    className: m(
      "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
      t,
    ),
    ...r,
  }),
);
Es.displayName = "SidebarInput";
const Pr = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "header",
    className: m("flex flex-col gap-2 p-2", t),
    ...r,
  }),
);
Pr.displayName = "SidebarHeader";
const Mr = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "footer",
    className: m("flex flex-col gap-2 p-2", t),
    ...r,
  }),
);
Mr.displayName = "SidebarFooter";
const As = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx(kr, {
    ref: a,
    "data-sidebar": "separator",
    className: m("mx-2 w-auto bg-sidebar-border", t),
    ...r,
  }),
);
As.displayName = "SidebarSeparator";
const Cr = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "content",
    className: m(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      t,
    ),
    ...r,
  }),
);
Cr.displayName = "SidebarContent";
const se = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "group",
    className: m("relative flex w-full min-w-0 flex-col p-2", t),
    ...r,
  }),
);
se.displayName = "SidebarGroup";
const me = l.forwardRef(({ className: t, asChild: r = !1, ...a }, s) => {
  const n = r ? Se : "div";
  return e.jsx(n, {
    ref: s,
    "data-sidebar": "group-label",
    className: m(
      "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
      t,
    ),
    ...a,
  });
});
me.displayName = "SidebarGroupLabel";
const Rs = l.forwardRef(({ className: t, asChild: r = !1, ...a }, s) => {
  const n = r ? Se : "button";
  return e.jsx(n, {
    ref: s,
    "data-sidebar": "group-action",
    className: m(
      "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      "after:absolute after:-inset-2 after:md:hidden",
      "group-data-[collapsible=icon]:hidden",
      t,
    ),
    ...a,
  });
});
Rs.displayName = "SidebarGroupAction";
const ne = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "group-content",
    className: m("w-full text-sm", t),
    ...r,
  }),
);
ne.displayName = "SidebarGroupContent";
const ie = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("ul", {
    ref: a,
    "data-sidebar": "menu",
    className: m("flex w-full min-w-0 flex-col gap-1", t),
    ...r,
  }),
);
ie.displayName = "SidebarMenu";
const Ir = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("li", {
    ref: a,
    "data-sidebar": "menu-item",
    className: m("group/menu-item relative", t),
    ...r,
  }),
);
Ir.displayName = "SidebarMenuItem";
const Ps = tr(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          outline:
            "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
        },
        size: {
          default: "h-8 text-sm",
          sm: "h-7 text-xs",
          lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    },
  ),
  zr = l.forwardRef(
    (
      {
        asChild: t = !1,
        isActive: r = !1,
        variant: a = "default",
        size: s = "default",
        tooltip: n,
        className: i,
        ...c
      },
      o,
    ) => {
      const x = t ? Se : "button",
        { isMobile: d, state: u } = Ee(),
        f = e.jsx(x, {
          ref: o,
          "data-sidebar": "menu-button",
          "data-size": s,
          "data-active": r,
          className: m(Ps({ variant: a, size: s }), i),
          ...c,
        });
      return n
        ? (typeof n == "string" && (n = { children: n }),
          e.jsxs(ts, {
            children: [
              e.jsx(rs, { asChild: !0, children: f }),
              e.jsx(as, { side: "right", align: "center", hidden: u !== "collapsed" || d, ...n }),
            ],
          }))
        : f;
    },
  );
zr.displayName = "SidebarMenuButton";
const Ms = l.forwardRef(({ className: t, asChild: r = !1, showOnHover: a = !1, ...s }, n) => {
  const i = r ? Se : "button";
  return e.jsx(i, {
    ref: n,
    "data-sidebar": "menu-action",
    className: m(
      "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
      "after:absolute after:-inset-2 after:md:hidden",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      a &&
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
      t,
    ),
    ...s,
  });
});
Ms.displayName = "SidebarMenuAction";
const Cs = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", {
    ref: a,
    "data-sidebar": "menu-badge",
    className: m(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      t,
    ),
    ...r,
  }),
);
Cs.displayName = "SidebarMenuBadge";
const Is = l.forwardRef(({ className: t, showIcon: r = !1, ...a }, s) => {
  const n = l.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return e.jsxs("div", {
    ref: s,
    "data-sidebar": "menu-skeleton",
    className: m("flex h-8 items-center gap-2 rounded-md px-2", t),
    ...a,
    children: [
      r && e.jsx(Dt, { className: "size-4 rounded-md", "data-sidebar": "menu-skeleton-icon" }),
      e.jsx(Dt, {
        className: "h-4 max-w-(--skeleton-width) flex-1",
        "data-sidebar": "menu-skeleton-text",
        style: { "--skeleton-width": n },
      }),
    ],
  });
});
Is.displayName = "SidebarMenuSkeleton";
const zs = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("ul", {
    ref: a,
    "data-sidebar": "menu-sub",
    className: m(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      t,
    ),
    ...r,
  }),
);
zs.displayName = "SidebarMenuSub";
const Os = l.forwardRef(({ ...t }, r) => e.jsx("li", { ref: r, ...t }));
Os.displayName = "SidebarMenuSubItem";
const Ts = l.forwardRef(
  ({ asChild: t = !1, size: r = "md", isActive: a, className: s, ...n }, i) => {
    const c = t ? Se : "a";
    return e.jsx(c, {
      ref: i,
      "data-sidebar": "menu-sub-button",
      "data-size": r,
      "data-active": a,
      className: m(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        r === "sm" && "text-xs",
        r === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        s,
      ),
      ...n,
    });
  },
);
Ts.displayName = "SidebarMenuSubButton";
const $s = "muninn-theme",
  Ds = "huginn-theme",
  Bs = "(prefers-color-scheme: dark)";
function Fs() {
  return "dark";
}
function Hs(t) {
  return "dark";
}
function Ws(t) {
  const r = document.documentElement;
  return (
    r.classList.add("dark"),
    r.classList.remove("light"),
    (r.dataset.theme = "dark"),
    (r.style.colorScheme = "dark"),
    "dark"
  );
}
function qt(t) {
  try {
    (localStorage.setItem($s, t), localStorage.removeItem(Ds));
  } catch {}
}
function qs() {
  return typeof document > "u" || document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}
function Us(t) {
  if (typeof window > "u") return () => {};
  const r = window.matchMedia(Bs),
    a = () => t();
  return (r.addEventListener("change", a), () => r.removeEventListener("change", a));
}
let Be = null;
function Ae(t) {
  const r = t.replace("#", "").trim(),
    a =
      r.length === 3
        ? r
            .split("")
            .map((s) => s + s)
            .join("")
        : r;
  return /^[0-9a-fA-F]{6}$/.test(a)
    ? {
        r: parseInt(a.slice(0, 2), 16),
        g: parseInt(a.slice(2, 4), 16),
        b: parseInt(a.slice(4, 6), 16),
      }
    : null;
}
function Ke({ r: t, g: r, b: a }) {
  const s = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return "#" + [s(t), s(r), s(a)].map((n) => n.toString(16).padStart(2, "0")).join("");
}
function Ye(t, r, a) {
  return { r: t.r * (1 - a) + r.r * a, g: t.g * (1 - a) + r.g * a, b: t.b * (1 - a) + r.b * a };
}
function Or(t, r) {
  const a = Ae(t);
  return a ? Ke(Ye(a, { r: 0, g: 0, b: 0 }, r)) : t;
}
function rt(t, r) {
  const a = Ae(t);
  return a ? Ke(Ye({ r: 0, g: 0, b: 0 }, a, r)) : "#141414";
}
function at(t, r) {
  const a = Ae(t);
  return a ? Ke(Ye({ r: 255, g: 255, b: 255 }, a, r)) : "#f4f4f5";
}
function Tr(t) {
  const r = Ae(t);
  if (!r) return 0;
  const a = [r.r, r.g, r.b].map((s) => {
    const n = s / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function Gs(t, r) {
  const a = t.trim() || ye.primary_color;
  if (r !== "dark" || Tr(a) >= 0.12) return a;
  const n = Ae(a);
  return n ? Ke(Ye(n, { r: 255, g: 255, b: 255 }, 0.55)) : a;
}
function Vs(t) {
  return Tr(t) > 0.4 ? "#000000" : "#ffffff";
}
const Ks = new Set(["#ffffff", "#fff", "#000000", "#000"].map((t) => t.toLowerCase()));
function Ys(t, r) {
  const a = r?.trim();
  return a && !Ks.has(a.toLowerCase()) ? a : Or(t, 0.22);
}
function Qs(t) {
  if (!t) return;
  const r = oe(t) || t;
  let a = document.querySelector("link[rel='icon']");
  (a || ((a = document.createElement("link")), (a.rel = "icon"), document.head.appendChild(a)),
    (a.href = r));
}
function Zs(t) {
  const r = t?.app_name?.trim(),
    a = typeof t?.branding?.app_name == "string" ? t.branding.app_name.trim() : "",
    s = r || a;
  if (s && s.toLowerCase() !== "muninn" && s.toLowerCase() !== "erp system") {
    document.title = `${s} — Agentes`;
    return;
  }
  document.title = "Muninn — Agentes Especializados";
}
function Js(t) {
  const r = [
    "--primary",
    "--primary-deep",
    "--primary-foreground",
    "--primary-soft",
    "--primary-glow",
    "--accent",
    "--ring",
    "--sidebar-primary",
    "--sidebar-primary-foreground",
    "--sidebar-accent",
    "--sidebar-ring",
    "--chart-1",
    "--success",
    "--success-foreground",
    "--success-soft",
    "--bubble-ai",
    "--bubble-ai-foreground",
    "--radius",
  ];
  for (const a of r) t.style.removeProperty(a);
  (t.style.removeProperty("font-size"),
    t.removeAttribute("data-compact"),
    t.removeAttribute("data-motion"));
}
function Xs(t, r) {
  const a = r?.ui_preferences,
    s = r?.borderRadius ?? a?.border_radius_px ?? null,
    n = r?.font_size ?? a?.font_size_px ?? null,
    i = r?.compact ?? (a?.density === "compact" ? !0 : a?.density ? !1 : null),
    c = r?.motion ?? (typeof a?.motion_enabled == "boolean" ? a.motion_enabled : null);
  (typeof s == "number" && s >= 0
    ? t.style.setProperty("--radius", `${s / 16}rem`)
    : t.style.removeProperty("--radius"),
    typeof n == "number" && n >= 10 && n <= 22
      ? (t.style.fontSize = `${n}px`)
      : t.style.removeProperty("font-size"),
    i === !0 ? t.setAttribute("data-compact", "true") : t.removeAttribute("data-compact"),
    c === !1 ? t.setAttribute("data-motion", "off") : t.removeAttribute("data-motion"));
}
function en() {
  ((Be = null), Js(document.documentElement), Ct({ ...ye }));
}
function Ct(t) {
  const r = document.documentElement;
  Be = t ? { ...t } : null;
  const a = qs(),
    s = Gs(t?.primary_color?.trim() || ye.primary_color, a),
    n = Ys(s, t?.secondary_color),
    i = Vs(s),
    c = a === "dark" ? rt(s, 0.14) : at(s, 0.12),
    o = Or(s, a === "dark" ? 0.12 : 0.08),
    x = a === "dark" ? rt(s, 0.16) : at(s, 0.1),
    d = a === "dark" ? rt(s, 0.45) : at(s, 0.35),
    u = a === "dark" ? "#f0f0f0" : "#134e4a";
  (r.style.setProperty("--primary", s),
    r.style.setProperty("--primary-deep", n),
    r.style.setProperty("--primary-foreground", i),
    r.style.setProperty("--primary-soft", c),
    r.style.setProperty("--primary-glow", o),
    r.style.setProperty("--accent", x),
    r.style.setProperty("--ring", d),
    r.style.setProperty("--sidebar-primary", s),
    r.style.setProperty("--sidebar-primary-foreground", i),
    r.style.setProperty("--sidebar-accent", x),
    r.style.setProperty("--sidebar-ring", d),
    r.style.setProperty("--chart-1", s),
    r.style.setProperty("--success", s),
    r.style.setProperty("--success-foreground", i),
    r.style.setProperty("--success-soft", c),
    r.style.setProperty("--bubble-ai", c),
    r.style.setProperty("--bubble-ai-foreground", u),
    Xs(r, t),
    Qs(t?.favicon_url || t?.favicon || null),
    Zs(t));
}
function tn() {
  Be && Ct(Be);
}
function Fe(t, r) {
  const a = ge(t);
  return (Ct(a), a);
}
function ft(t) {
  if (!t) return null;
  const r = t.branding,
    a =
      t.logo_url ||
      t.logo ||
      (typeof r?.logo_url == "string" ? r.logo_url : null) ||
      (typeof r?.logo == "string" ? r.logo : null) ||
      null;
  return !a || typeof a != "string" ? null : oe(a) || null;
}
function rn(t) {
  return t
    ? t.branding && (t.branding.colors?.primary || t.branding.logo_url || t.branding.app_name)
      ? !0
      : !!(
          t.primary_color ||
          t.logo_url ||
          t.logo ||
          t.app_name ||
          t.fantasy_name ||
          t.organization_name
        )
    : !1;
}
function an(t) {
  const r = t.branding,
    a = t.ui_preferences,
    s = sn(t.social_links ?? r?.social_links ?? null),
    n = t.show_sponsor_logos !== !1 && r?.login?.show_sponsor_logos !== !1,
    i = nn(t.enabled_sponsors ?? t.sponsors ?? r?.login?.sponsors ?? null);
  return {
    scope: t.scope,
    branch_id: t.branch_id,
    organization_id: t.organization_id ?? null,
    organization_name: t.organization_name ?? null,
    organization_logo_url: t.organization_logo_url || null,
    fantasy_name: t.fantasy_name ?? null,
    app_name: t.app_name || r?.app_name || null,
    branch_name: t.branch_name ?? null,
    tagline: t.tagline || r?.tagline || null,
    primary_color: t.primary_color || r?.colors?.primary || null,
    secondary_color: t.secondary_color || r?.colors?.secondary || null,
    algorithm: t.algorithm || t.color_mode || r?.color_mode || null,
    logo: t.logo || null,
    logo_url: t.logo_url || r?.logo_url || null,
    favicon: t.favicon || null,
    favicon_url: t.favicon_url || r?.favicon_url || null,
    login_welcome_message:
      t.login_welcome_message || t.welcome_message || r?.login?.welcome_message || null,
    login_subtitle: t.login_subtitle || t.subtitle || r?.login?.subtitle || null,
    welcome_message: t.welcome_message || r?.login?.welcome_message || null,
    subtitle: t.subtitle || r?.login?.subtitle || null,
    brand_description: t.brand_description || r?.brand_description || null,
    website_url: t.website_url || r?.website_url || null,
    social_links: s,
    show_sponsor_logos: n,
    sponsors: i,
    branding: t.branding ?? void 0,
    stores: t.stores ?? null,
    available_apps: Array.isArray(t.available_apps) ? t.available_apps : [],
    fallback_from_branch_slug: t.fallback_from_branch_slug ?? null,
    custom_domain: t.custom_domain ?? null,
    login_slug: t.login_slug || r?.login?.slug || null,
    font_size: a?.font_size_px ?? null,
    borderRadius: a?.border_radius_px ?? null,
    compact: a?.density === "compact" ? !0 : a?.density ? !1 : null,
    motion: typeof a?.motion_enabled == "boolean" ? a.motion_enabled : null,
    ui_preferences: a ?? null,
  };
}
function sn(t) {
  return !Array.isArray(t) || t.length === 0
    ? []
    : [...t]
        .filter((r) => r && typeof r.url == "string" && r.url.trim())
        .map((r, a) => ({
          url: r.url.trim(),
          icon: r.icon ?? "web",
          name: r.name ?? null,
          enabled: r.enabled !== !1,
          order: typeof r.order == "number" ? r.order : a + 1,
        }))
        .filter((r) => r.enabled !== !1)
        .sort((r, a) => (r.order ?? 999) - (a.order ?? 999));
}
function nn(t) {
  return !Array.isArray(t) || t.length === 0
    ? []
    : [...t]
        .filter((r) => r && (r.logo_url?.trim() || r.name?.trim()))
        .map((r, a) => ({
          name: r.name?.trim() || null,
          logo_url: r.logo_url?.trim() || null,
          website_url: r.website_url?.trim() || null,
          enabled: r.enabled !== !1,
          order: typeof r.order == "number" ? r.order : a + 1,
        }))
        .filter((r) => r.enabled !== !1)
        .sort((r, a) => (r.order ?? 999) - (a.order ?? 999));
}
const It = "muninn-login-context";
function ve() {
  try {
    sessionStorage.removeItem(It);
  } catch {}
}
function on(t) {
  try {
    sessionStorage.setItem(It, JSON.stringify(t));
  } catch {}
}
function ln() {
  try {
    const t = sessionStorage.getItem(It);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function cn(t, r) {
  return t
    ? {
        scope: t.scope,
        branchId: t.branch_id != null ? String(t.branch_id) : null,
        organizationId: t.organization_id != null ? String(t.organization_id) : null,
        organizationName: t.organization_name ?? null,
        stores: t.stores ?? [],
        fallbackFromBranchSlug: t.fallback_from_branch_slug ?? null,
        host: r?.host,
        slug: r?.slug ?? t.login_slug ?? null,
      }
    : {
        scope: "app",
        branchId: null,
        organizationId: null,
        stores: [],
        host: r?.host,
        slug: r?.slug ?? null,
      };
}
function st(...t) {
  for (const r of t) if (typeof r == "string" && r.trim()) return r.trim();
  return null;
}
function dn(t, r, a) {
  const s = st(r?.logo_url, r?.logo, r?.branding?.logo_url ?? void 0),
    n = st(r?.favicon_url, r?.favicon, r?.branding?.favicon_url ?? void 0),
    i = st(a);
  if (!s && !n && !i) return t;
  const c = { ...(t ?? {}) },
    o = s || i;
  return (
    o && ((c.logo_url = o), (c.logo = o), (c.branding = { ...(c.branding ?? {}), logo_url: o })),
    n &&
      ((c.favicon_url = n),
      (c.favicon = n),
      (c.branding = { ...(c.branding ?? {}), favicon_url: n })),
    c
  );
}
function un() {
  const [t, r] = l.useState(() => Nt());
  return (l.useEffect(() => ar((a) => r(a)), []), t);
}
function xn(t) {
  return !t?.trim() || t.trim().toLowerCase() === "muninn";
}
function pn(t, r) {
  const a =
    r?.app_name?.trim() ||
    (typeof r?.branding?.app_name == "string" ? r.branding.app_name.trim() : "") ||
    null;
  if (a && !xn(a)) return a;
  if (t) {
    const s = sr().find((n) => String(n.branch_id) === String(t));
    return s?.business_name?.trim() || s?.branch_name?.trim() || null;
  }
  return a;
}
async function mn(t) {
  if (t) {
    try {
      return await fe(q.branches.publicLoginTheme(t));
    } catch {}
    return null;
  }
  try {
    return await fe(q.branches.publicLoginThemeByHost);
  } catch {}
  return null;
}
function $r(t) {
  const a = un(),
    s = be(),
    n = s ? ca() : null,
    { data: i } = rr(a),
    c = s && i?.organization != null ? String(i.organization) : null,
    { data: o = [] } = da({ enabled: s && !n && !c }),
    x = s && o.length > 0 ? String(o[0].id) : null,
    d = n || c || x,
    u = Oe({
      queryKey: ["branches", "theme", a],
      queryFn: async () => (a ? fe(q.branches.themeConfig(a)) : fe(q.branches.myDefaultTheme)),
      enabled: typeof window < "u",
      staleTime: 300 * 1e3,
      retry: 1,
    }),
    f = Oe({
      queryKey: ["branches", "organizations", d, "theme"],
      queryFn: () => fe(q.branches.organizationTheme(d)),
      enabled: !!d && typeof window < "u",
      staleTime: 6e4,
      retry: 1,
    }),
    h = l.useMemo(() => dn(u.data, f.data, i?.logo ?? null), [u.data, f.data, i?.logo]),
    g = l.useMemo(
      () => pn(a, h ?? { app_name: ut() || i?.fantasy_name || i?.business_name || null }),
      [a, h, i?.fantasy_name, i?.business_name],
    ),
    y = l.useMemo(() => {
      if (u.isError && !f.data && !i?.logo) return ge(null);
      if (h) return ge(h);
    }, [h, u.isError, f.data, i?.logo, g]);
  l.useEffect(() => {
    if (Y()) {
      (en(), (document.title = "Muninn — Agentes"));
      return;
    }
    if ((u.isError && !f.data && !i?.logo ? Fe(null) : h && Fe(h), be())) {
      const L = ut() || i?.organization_name?.trim() || o[0]?.name?.trim() || null;
      L && (document.title = `${L} — Agentes`);
    }
  }, [h, u.isError, f.data, i?.logo, i?.organization_name, o, g]);
  const j = !Y() && (u.isLoading || (!!d && f.isLoading && !f.data && !u.data));
  l.useEffect(() => {
    const L = document.documentElement;
    if (Y() || !j) {
      ((L.dataset.brandReady = "true"), delete L.dataset.brandPending);
      return;
    }
    ((L.dataset.brandPending = "true"), delete L.dataset.brandReady);
  }, [j]);
  const k = l.useMemo(() => (Y() ? ge({ ...ye }) : void 0), []);
  return {
    ...u,
    data: k ?? y ?? h ?? u.data,
    rawTheme: Y() ? { ...ye } : (h ?? u.data),
    branchLabel: Y() ? "Muninn" : g,
    isFetching: u.isFetching || f.isFetching,
    brandPending: j,
  };
}
function hn(t) {
  const r = typeof window < "u" ? window.location.host : "",
    a = Oe({
      queryKey: ["branches", "public-login-theme", "resolve", r, t ?? ""],
      queryFn: () => mn(t),
      enabled: typeof window < "u",
      staleTime: 600 * 1e3,
      retry: !1,
    }),
    s = a.data ?? null,
    n = l.useMemo(() => (s ? an(s) : null), [s]),
    i = a.isLoading ? !t : !s || !rn(s),
    c = l.useMemo(() => (i ? ge(null) : ge(n, n?.app_name || t)), [n, i, t]);
  return (
    l.useEffect(() => {
      if (a.isLoading) {
        ((document.documentElement.dataset.brandPending = "true"),
          delete document.documentElement.dataset.brandReady);
        return;
      }
      const o = cn(s, { host: r, slug: t });
      (on(o),
        i ? Fe({ ...ye }) : n && Fe(n, n.app_name || t),
        (document.documentElement.dataset.brandReady = "true"),
        delete document.documentElement.dataset.brandPending);
    }, [a.isLoading, s, n, i, r, t]),
    {
      ...a,
      raw: s,
      flat: n,
      scope: s?.scope ?? (i ? "app" : void 0),
      isAppDefault: i,
      data: c,
      stores: s?.stores ?? [],
      branchId: s?.branch_id != null ? String(s.branch_id) : null,
      organizationId: s?.organization_id != null ? String(s.organization_id) : null,
      brandPending: a.isLoading,
    }
  );
}
const fn = "/assets/muninn-mark-De9pjt0S.png";
function gn(t) {
  const r = t.replace(/^\/app(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  return r === "/chat" || /^\/agentes\/[^/]+\/chat$/.test(r) || /^\/embed\/chat\//.test(r)
    ? "chat"
    : r.startsWith("/conversaciones")
      ? "inbox"
      : r.startsWith("/planes")
        ? "workspace"
        : /^\/workflows\/[^/]+$/.test(r)
          ? "canvas"
          : r.startsWith("/workflows")
            ? "catalog"
            : /^\/agentes\/[^/]+$/.test(r) || /^\/skills\/[^/]+$/.test(r)
              ? "studio"
              : r === "/agentes" ||
                  r === "/skills" ||
                  r === "/canales" ||
                  r.startsWith("/apps") ||
                  r.startsWith("/apis") ||
                  r.startsWith("/conocimiento")
                ? "cards"
                : r === "/perfil"
                  ? "profile"
                  : r.startsWith("/admin/llm")
                    ? "split"
                    : r.startsWith("/admin/usuarios")
                      ? "tableFilters"
                      : r.startsWith("/admin")
                        ? "table"
                        : r === "/"
                          ? "dashboard"
                          : "neutral";
}
function bn({ className: t, fullScreen: r = !1, variant: a, pathname: s }) {
  const n = a ?? (s ? gn(s) : "neutral"),
    i = n === "chat" || n === "inbox" || n === "workspace" || n === "catalog" || n === "canvas";
  return e.jsx(ua, {
    variant: n,
    padded: !r && !i,
    className: m(i && "h-full max-w-none", r && "min-h-[100dvh]", t),
  });
}
function yn({ className: t, size: r = "md" }) {
  const a =
    r === "lg" ? "h-16 w-16 rounded-2xl" : r === "sm" ? "h-8 w-8 rounded-lg" : "h-9 w-9 rounded-lg";
  return e.jsx("span", {
    "aria-hidden": !0,
    className: m(
      "skeleton-bone relative flex shrink-0 overflow-hidden border border-border/60",
      a,
      t,
    ),
  });
}
const gt = "Tu agente de IA, operable y transparente",
  jn = "Diseña, opera y supervisa tu agente — con claridad total",
  vn =
    "Muninn es la plataforma donde creas y controlas tu agente de IA. Sin cajas negras: ves su alma, sus reglas, sus herramientas y cada decisión que toma.",
  wn =
    "Un harness es la infraestructura alrededor del modelo: tools, memoria, políticas y ejecución. El LLM decide; el harness hace que eso ocurra de forma operable.",
  Nn =
    "La plataforma donde diseñas tu agente: su personalidad, reglas, herramientas, conocimiento y automatizaciones. Todo versionado, todo visible.",
  He = {
    label: "Databricks · What is an AI Agent Harness?",
    href: "https://www.databricks.com/blog/ai-harness",
  },
  _n = [
    {
      id: "what",
      title: "Una plataforma, no un chatbot",
      line: "Muninn no es un chat más. Es un entorno donde diseñas, operas y supervisas un agente de IA con personalidad, reglas, herramientas y memoria propias.",
    },
    {
      id: "problem",
      title: "El problema que resuelve",
      line: "Hoy los agentes son cajas negras: no sabes por qué responden lo que responden. Muninn te da visibilidad total de cada decisión, cada fuente y cada acción.",
    },
    {
      id: "resolve",
      title: "Lo que puedes hacer hoy",
      line: "Crea un agente que entienda tu negocio, actúe con criterio y deje traza de todo lo que hace. Todo desde una interfaz operable, sin misterios.",
    },
  ],
  kn = [
    { id: "soul", title: "Soul", line: "Quién es tu agente: tono, personalidad y límites." },
    { id: "rules", title: "Reglas", line: "Qué puede hacer, qué te pide antes y en qué orden." },
    {
      id: "helpers",
      title: "Helpers",
      line: "Sus herramientas: buscar, crear tickets, llamar APIs…",
    },
    { id: "rag", title: "RAG", line: "Lee tus documentos y responde con lo que encuentre ahí." },
    { id: "model", title: "Modelo", line: "El cerebro de IA que razona y escribe las respuestas." },
    { id: "cron", title: "Cron", line: "Lo programa para que corra solo, sin que nadie chatee." },
  ],
  ae = [
    {
      id: "soul",
      title: "Soul",
      line: "Quién es tu agente: tono, personalidad y límites.",
      role: "Identidad",
      why: "Sin soul, el agente suena genérico. Con soul, habla como tu marca y respeta fronteras.",
      example: "«Eres claro, breve y en español de Chile. No inventes políticas.»",
      tech: "System prompt versionado (SOUL.md). Define voz y frontera ética.",
    },
    {
      id: "rules",
      title: "Reglas",
      line: "Qué puede hacer, qué te pide antes y en qué orden.",
      role: "Gobierno",
      why: "Las reglas evitan sorpresas: confirman antes de actuar y ordenan el flujo.",
      example: "Antes de crear un ticket → pedir confirmación. Si falta el tema → preguntar.",
      tech: "Flow policy / guardrails. Orden de skills y puntos de intervención humana.",
    },
    {
      id: "helpers",
      title: "Helpers",
      line: "Sus herramientas: buscar, crear tickets, llamar APIs…",
      role: "Acción",
      why: "El modelo propone; los helpers ejecutan en sistemas reales (tickets, APIs, búsqueda).",
      example: "rag.buscar · ticket.crear · calendario.consultar",
      tech: "Skills conectadas a APIs reales. El modelo elige; el harness ejecuta.",
    },
    {
      id: "rag",
      title: "RAG",
      line: "Lee tus documentos y responde con lo que encuentre ahí.",
      role: "Fundamento",
      why: "Respuestas con tu conocimiento, no con inventos. Cita fuente cuando importa.",
      example: "«Según Políticas RR.HH.: 15 días hábiles al año.»",
      tech: "Chunks indexados + recuperación por similitud. Cita fuente, no inventa.",
    },
    {
      id: "model",
      title: "Modelo",
      line: "El cerebro de IA que razona y escribe las respuestas.",
      role: "Razonamiento",
      why: "Eliges costo, latencia y proveedor; el harness lo rodea con contexto operable.",
      example: "Elige LLM por costo/latencia; el harness lo rodea con contexto.",
      tech: "Proveedor intercambiable. Observabilidad de tokens y traza.",
    },
    {
      id: "cron",
      title: "Cron",
      line: "Lo programa para que corra solo, sin que nadie chatee.",
      role: "Automatización",
      why: "El mismo agente trabaja de noche: resúmenes, chequeos y tareas recurrentes.",
      example: "lun–vie 09:00 → resumen diario RR.HH.",
      tech: "Triggers programados. Mismo harness, sin mensaje de usuario.",
    },
  ],
  Sn = "Probar en vivo",
  Ln = [
    {
      id: "clarity",
      title: "Claridad total",
      line: "Ves el alma, las reglas, las herramientas y cada decisión del agente. Cero caja negra.",
    },
    {
      id: "control",
      title: "Control real",
      line: "El agente propone; tú apruebas. Políticas, confirmaciones y límites a tu medida.",
    },
    {
      id: "knowledge",
      title: "Tu conocimiento, automatizado",
      line: "Conecta tus documentos y activa tareas recurrentes. El agente trabaja con tu información, no con inventos.",
    },
    {
      id: "api",
      title: "API — Próximamente",
      line: "Pronto podrás gestionar tu agente vía API: crear, configurar y monitorear el servicio desde tu propio código.",
    },
  ],
  En = 9e3,
  nt = ["Soul", "Rules", "Helpers", "RAG", "Cron", "Impacto"],
  An = [
    {
      match: /pol[ií]tica|vacacion|rr\.?\s*hh|permiso/i,
      stageHint: "RAG",
      think: "Pregunta de política interna → RAG sobre documentos, no inventar.",
      system: "RAG · 2 chunks · Políticas RR.HH.",
      agent:
        "Según la política indexada: 15 días hábiles al año. Si quieres, abro un ticket formal.",
    },
    {
      match: /ticket|abrir|crear\s*caso|incidente/i,
      stageHint: "Helpers",
      think: "Skill de escritura → pedir confirmación (rules).",
      system: "ticket.crear · pendiente de confirmación",
      agent: "Puedo crear el ticket ahora. ¿Confirmas? (En producción pediría un sí explícito.)",
    },
    {
      match: /cron|program|agenda|diario|automati/i,
      stageHint: "Cron",
      think: "Quiere automatización → cronjobs / workflows programados.",
      system: "Cron · lun–vie 09:00",
      agent:
        "Puedo dejar un resumen diario a las 09:00. El harness dispara el flujo sin que nadie chatee.",
    },
    {
      match: /soul|personalidad|tono|qui[eé]n eres/i,
      stageHint: "Soul",
      think: "Pregunta de identidad → SOUL.md.",
      agent:
        "Soy el asistente interno: claro, breve, en español de Chile. No invento políticas; busco o pregunto.",
    },
    {
      match: /regla|rule|l[ií]mite|confirm/i,
      stageHint: "Rules",
      think: "Flow policy / guardrails.",
      agent:
        "Antes de skills de escritura pido confirmación. Si falta contexto, pregunto. Eso son las rules.",
    },
  ],
  Rn = {
    think: "Intención general → explicar el harness con claridad.",
    agent:
      "En Muninn diseñas el agente (soul + rules), le das helpers y RAG, y lo operas en chat o por cron. Prueba preguntar por “vacaciones”, “ticket” o “cron”.",
  };
function Pn(t) {
  const r = An.find((a) => a.match.test(t));
  return r ? { think: r.think, agent: r.agent, system: r.system, stageHint: r.stageHint } : Rn;
}
const je = [
  {
    stage: "Soul",
    title: "① Soul — entiende el contexto",
    detail:
      "El agente lee su SOUL.md para saber quién es, cómo tratar al usuario y qué límites tiene.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
    ],
    messages: [
      { role: "system", text: "SOUL.md cargado · «asistente amable, eficiente, español de Chile»" },
      { role: "user", text: "Revisa mis pendientes de hoy" },
      {
        role: "think",
        text: "Soul: usuario pide pendientes → tono cordial pero directo. No inventar tareas si no hay datos.",
      },
      {
        role: "agent",
        text: "¡Hola! Voy a revisar tus pendientes del día. Dame un momento mientras consulto tus sistemas.",
      },
    ],
  },
  {
    stage: "Rules",
    title: "② Rules — ordena el flujo",
    detail:
      "Las reglas definen qué skills puede usar, en qué orden, y cuándo pedir confirmación al usuario.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
    ],
    messages: [
      {
        role: "system",
        text: "Rules · flow policy: consultar tickets → agrupar por vencimiento → presentar sin ejecutar cambios",
      },
      { role: "user", text: "Revisa mis pendientes de hoy" },
      {
        role: "think",
        text: "Rules: no puede cerrar tickets sin confirmación. Flujo aprobado: solo lectura y resumen.",
      },
      {
        role: "agent",
        text: "Voy a revisar tus tickets activos. Solo lectura, sin hacer cambios.",
      },
    ],
  },
  {
    stage: "Helpers",
    title: "③ Helpers — ejecuta las herramientas",
    detail:
      "Helpers son habilidades conectadas a APIs reales: consultar tickets, buscar documentos, etc.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "ticket.listar", kind: "skill" },
    ],
    messages: [
      { role: "system", text: "Helper · ticket.listar · consultando API de tickets…" },
      {
        role: "think",
        text: "Helpers: llamando a ticket.listar con filtro «hoy». El modelo espera la respuesta de la API.",
      },
      {
        role: "agent",
        text: "Encontré tus tickets abiertos. Ahora los reviso uno por uno para darte un resumen.",
      },
    ],
  },
  {
    stage: "RAG",
    title: "④ RAG — responde con conocimiento",
    detail:
      "RAG busca en documentos indexados para responder con datos reales, no con inventos del modelo.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "ticket.listar", kind: "skill" },
      { id: "knowledge", label: "RAG", kind: "knowledge" },
    ],
    messages: [
      { role: "system", text: "RAG · 2 tickets vencen hoy · fuente: API tickets" },
      {
        role: "think",
        text: "RAG: datos recuperados del sistema de tickets. 4 pendientes total, 2 urgentes.",
      },
      {
        role: "agent",
        text: "Tienes 4 pendientes. 2 vencen hoy: ticket #1342 (soporte RR.HH.) y #1345 (revisión contrato). ¿Quieres que priorice alguno?",
      },
    ],
  },
  {
    stage: "Cron",
    title: "⑤ Cron — opera sin ti",
    detail:
      "El mismo agente se programa para ejecutarse en cron: resúmenes diarios, chequeos automáticos, sin esperar a que alguien chatee.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "cron", label: "Cron 09:00", kind: "cron" },
      { id: "result", label: "Resumen diario", kind: "result" },
    ],
    messages: [
      { role: "system", text: "Cron · disparo lun–vie 09:00 · mismo harness, sin chat" },
      {
        role: "think",
        text: "Cron: al llegar las 09:00 el agente ejecuta el mismo flujo sin intervención humana.",
      },
      {
        role: "agent",
        text: "Resumen diario: 4 tickets pendientes, 2 vencen hoy. Sin acción urgente. Puedo dejar esto programado para cada mañana.",
      },
    ],
  },
  {
    stage: "Impacto",
    title: "⑥ Flujo completo — todos los componentes",
    detail:
      "Soul da identidad, rules ordenan, helpers ejecutan, RAG fundamenta, cron automatiza. Juntos resuelven sin que tú hagas nada.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "Helpers", kind: "skill" },
      { id: "knowledge", label: "RAG", kind: "knowledge" },
      { id: "cron", label: "Cron", kind: "cron" },
      { id: "result", label: "Resuelto", kind: "result" },
    ],
    messages: [
      {
        role: "system",
        text: "Muninn opera igual en chat que por cron — mismo harness, mismo agente.",
      },
      {
        role: "agent",
        text: "Todo esto pasó por detrás: el alma definió mi tono, las reglas ordenaron el flujo, los helpers consultaron la API de tickets, RAG trajo los datos y cron lo programa para cada mañana. Ves cada paso, sin cajas negras.",
      },
    ],
  },
];
function Mn(t) {
  const r = t.split("?")[0].toLowerCase();
  return (
    r.endsWith(".png") ||
    r.endsWith(".webp") ||
    r.includes(".png") ||
    r.includes(".webp") ||
    r.startsWith("data:image/png") ||
    r.startsWith("data:image/webp")
  );
}
function Cn(t, r, a) {
  if (r <= 0 || a <= 0) return !1;
  try {
    const { data: s } = t.getImageData(0, 0, r, a),
      n = Math.max(1, Math.floor(s.length / 4 / 4e3));
    for (let i = 3; i < s.length; i += 4 * n) if (s[i] < 250) return !0;
  } catch {
    return !1;
  }
  return !1;
}
function In(t) {
  const r = (t || "").trim();
  return !r || !Mn(r)
    ? Promise.resolve(!1)
    : new Promise((a) => {
        const s = new Image();
        if (((s.decoding = "async"), /^https?:\/\//i.test(r) && typeof window < "u"))
          try {
            new URL(r, window.location.href).origin !== window.location.origin &&
              (s.crossOrigin = "anonymous");
          } catch {}
        ((s.onload = () => {
          const n = Math.min(s.naturalWidth || 0, 256),
            i = Math.min(s.naturalHeight || 0, 256);
          if (!n || !i) {
            a(!1);
            return;
          }
          const c = document.createElement("canvas");
          ((c.width = n), (c.height = i));
          const o = c.getContext("2d", { willReadFrequently: !0 });
          if (!o) {
            a(!1);
            return;
          }
          (o.clearRect(0, 0, n, i), o.drawImage(s, 0, 0, n, i), a(Cn(o, n, i)));
        }),
          (s.onerror = () => a(!1)),
          (s.src = r));
      });
}
function ke({
  branchLabel: t,
  appName: r,
  tagline: a,
  branchLogoUrl: s,
  pending: n = !1,
  to: i,
  onClick: c,
  compact: o = !1,
  layout: x = "horizontal",
  hero: d = !1,
  className: u,
}) {
  const f = x === "stacked",
    h = t?.trim() || "",
    g = !s && (!h || h.toLowerCase() === "muninn"),
    y = !!h && !g,
    j = n && !y && !g ? "" : y ? h : "MUNINN",
    k = n
      ? null
      : f
        ? r?.trim() || null
        : y
          ? r?.trim() || a?.trim() || null
          : a?.trim() || r?.trim() || gt,
    [L, _] = l.useState(!1),
    [N, S] = l.useState(!1);
  l.useEffect(() => {
    (_(!1), S(!1));
    const E = s?.trim();
    if (!E) return;
    let $ = !1;
    return (
      In(E).then((v) => {
        $ || S(v);
      }),
      () => {
        $ = !0;
      }
    );
  }, [s]);
  const P = !!s && !L && !n,
    M = P,
    H = n && !g,
    O = y && !P && !n ? h.charAt(0).toUpperCase() || "·" : null,
    C = f || d ? "lg" : o ? "sm" : "md",
    b = g && (d || f),
    R = e.jsxs(e.Fragment, {
      children: [
        H
          ? e.jsx(yn, { size: C })
          : e.jsx("span", {
              className: m(
                "relative z-[2] flex shrink-0 items-center justify-center overflow-hidden transition-opacity duration-300",
                P
                  ? "border-0 bg-transparent p-0"
                  : O
                    ? "rounded-lg border border-primary/30 bg-primary/15 text-primary p-0"
                    : b
                      ? "rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-1 ring-primary/40"
                      : "rounded-lg border border-primary/40 bg-primary/20 dark:bg-primary/15",
                P && d
                  ? "h-14 w-auto max-w-[13rem] sm:h-16 sm:max-w-[16rem]"
                  : P && f
                    ? "h-16 w-auto max-w-[12rem] rounded-2xl"
                    : P
                      ? o
                        ? "h-8 w-auto max-w-[7rem]"
                        : "h-10 w-auto max-w-[9rem]"
                      : b
                        ? "h-14 w-14 sm:h-16 sm:w-16"
                        : f
                          ? "h-16 w-16 rounded-2xl"
                          : o
                            ? "h-8 w-8"
                            : "h-9 w-9",
                !f &&
                  !P &&
                  !b &&
                  "group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8",
              ),
              children: P
                ? e.jsx("img", {
                    src: s,
                    alt: j || "Logo",
                    className: m(
                      "h-full w-auto max-w-full object-contain object-left animate-in fade-in duration-300",
                      N && "dark:brightness-0 dark:invert",
                    ),
                    onError: () => _(!0),
                  })
                : O
                  ? e.jsx("span", {
                      className: m(
                        "font-semibold leading-none",
                        f || d ? "text-xl" : o ? "text-xs" : "text-sm",
                      ),
                      children: O,
                    })
                  : e.jsx("img", {
                      src: fn,
                      alt: "",
                      "aria-hidden": !0,
                      className: m(
                        "object-contain",
                        b
                          ? "h-8 w-8 sm:h-9 sm:w-9 brightness-0 invert dark:invert-0"
                          : m(
                              "opacity-95 brightness-0 dark:invert",
                              f ? "h-9 w-9" : o ? "h-5 w-5" : "h-6 w-6",
                              !f &&
                                "group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5",
                            ),
                      ),
                    }),
            }),
        !o &&
          !M &&
          e.jsxs("div", {
            className: m(
              "relative z-[2] flex min-w-0 flex-col leading-tight",
              f ? "items-center text-center" : "group-data-[collapsible=icon]:hidden",
              d && "lg:items-start lg:text-left",
            ),
            children: [
              n && !j
                ? e.jsx("span", {
                    className: m(
                      "block animate-pulse rounded bg-muted",
                      f || d ? "h-5 w-36" : "h-4 w-24",
                    ),
                  })
                : e.jsx("span", {
                    className: m(
                      "font-semibold text-foreground transition-opacity duration-300",
                      b
                        ? "font-display text-2xl tracking-[-0.03em] sm:text-[1.75rem]"
                        : f || d
                          ? "text-xl tracking-tight sm:text-2xl"
                          : y
                            ? "truncate text-sm tracking-tight"
                            : "truncate text-[15px] tracking-[0.04em]",
                    ),
                    children: j || " ",
                  }),
              n && !k
                ? e.jsx("span", {
                    className: "mt-1.5 block h-2.5 w-16 animate-pulse rounded bg-muted/80",
                  })
                : k
                  ? e.jsx("span", {
                      className: m(
                        "mt-1 transition-opacity duration-300",
                        b
                          ? "text-[12px] font-medium tracking-[0.04em] text-muted-foreground"
                          : f || d
                            ? "text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                            : y
                              ? "truncate text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground"
                              : "truncate text-[9.5px] uppercase tracking-[0.14em] text-primary/90",
                      ),
                      children: k,
                    })
                  : null,
            ],
          }),
      ],
    }),
    T = n ? "Cargando marca" : y ? (k ? `${j} — ${k}` : j) : `Muninn — ${k || gt}`,
    F = m(
      "flex min-w-0 transition-opacity duration-300",
      f
        ? "flex-col items-center gap-3"
        : "items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
      b && "gap-3.5 sm:gap-4",
      d && !b && "gap-3 sm:gap-4",
      u,
    );
  return i
    ? e.jsx(X, { to: i, onClick: c, className: F, "aria-label": T, children: R })
    : e.jsx("div", { className: F, "aria-label": T, children: R });
}
const z = "/app",
  zn = { title: "Resumen", url: z, icon: dr, exact: !0 },
  On = { title: "Canales", url: `${z}/canales`, icon: Ne },
  Tn = { title: "Conversaciones", url: `${z}/conversaciones`, icon: Ge, newTab: !0 };
function $n() {
  const t = [];
  return (Rt() && t.push(Tn), t.push(On), t);
}
const Dn = [
  { title: "Chat", url: `${z}/chat`, icon: nr, newTab: !0 },
  { title: "Agentes", url: `${z}/agentes`, icon: Lt },
  { title: "Aplicaciones", url: `${z}/aplicaciones`, icon: Ue },
];
function Bn() {
  const t = [...Dn],
    r = t.findIndex((a) => a.url === `${z}/agentes`);
  if (
    (Et() && t.splice(r + 1, 0, { title: "Conocimiento", url: `${z}/conocimiento`, icon: ir }),
    At())
  ) {
    const a = t.findIndex((s) => s.url === `${z}/aplicaciones`);
    t.splice(a >= 0 ? a : t.length, 0, { title: "Skills", url: `${z}/skills`, icon: or });
  }
  return t;
}
function Fn() {
  return Y()
    ? [
        { title: "Planes", url: `${z}/planes`, icon: lr, newTab: !0, badge: "Beta" },
        { title: "Workflows", url: `${z}/workflows`, icon: cr, newTab: !0, badge: "Beta" },
      ]
    : [];
}
const Hn = [
    { title: "Organizaciones", url: `${z}/admin/organizaciones`, icon: $e },
    { title: "Sucursales", url: `${z}/admin/sucursales`, icon: J },
    { title: "Usuarios", url: `${z}/admin/usuarios`, icon: le },
    { title: "LLM", url: `${z}/admin/llm`, icon: Te },
  ],
  Wn = [{ title: "Usuarios", url: `${z}/admin/usuarios`, icon: le }],
  qn = [{ title: "LLM", url: `${z}/admin/llm`, icon: Te }];
function Un() {
  return [
    { title: Pt(), url: `${z}/admin/organizaciones`, icon: $e },
    { title: we(), url: `${z}/admin/sucursales`, icon: J },
    { title: "Usuarios", url: `${z}/admin/usuarios`, icon: le },
  ];
}
function Gn() {
  const t = [];
  return (
    _t() && t.push({ title: we(), url: `${z}/admin/sucursales`, icon: J }),
    kt() && t.push(...Wn),
    St() && t.push(...qn),
    t
  );
}
function Vn() {
  const { pathname: t } = pe(),
    { isMobile: r, setOpenMobile: a } = Ee(),
    { data: s, rawTheme: n, brandPending: i } = $r(),
    { data: c } = rr(),
    o = Y(),
    x = !o && be(),
    d = o ? null : ft(n ?? s),
    u = (x && (ut() || c?.organization_name?.trim())) || null,
    f = c?.fantasy_name?.trim() || c?.business_name?.trim() || null,
    h = o ? "Muninn" : x ? u || "Organización" : f,
    g = (n?.app_name || s?.app_name || "").trim(),
    y = g && g.toLowerCase() !== "muninn" && g.toLowerCase() !== "erp system" ? g : null,
    j = o ? "Agentes" : x ? null : xa() ? y : null,
    k = !o && be(),
    L = !o && !k ? Gn() : [],
    _ = L.length > 0,
    N = Bn(),
    S = Fn(),
    P = $n(),
    M = G(),
    H = (T, F) => (F ? t === T : t === T || t.startsWith(T + "/")),
    O = () => {
      r && a(!1);
    },
    C = M
      ? void 0
      : { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } } },
    b = M
      ? void 0
      : {
          hidden: { opacity: 0, x: -6 },
          show: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
        },
    R = (T, F) =>
      T.map((E) => {
        const $ = H(E.url, E.exact);
        return e.jsx(
          Ir,
          {
            children: e.jsxs(I.div, {
              className: "relative w-full",
              variants: b,
              children: [
                $ &&
                  !M &&
                  e.jsx(I.span, {
                    layoutId: `nav-active-${F}`,
                    className: "absolute inset-0 rounded-md bg-sidebar-accent",
                    transition: { type: "spring", stiffness: 380, damping: 32 },
                  }),
                $ &&
                  M &&
                  e.jsx("span", { className: "absolute inset-0 rounded-md bg-sidebar-accent" }),
                e.jsx(zr, {
                  asChild: !0,
                  isActive: $,
                  tooltip: E.title,
                  className:
                    "relative z-[1] data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:font-medium hover:bg-muted rounded-md",
                  children: E.newTab
                    ? e.jsxs("a", {
                        href: E.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "flex items-center gap-2.5",
                        title: `Abrir ${E.title} en nueva pestaña`,
                        children: [
                          e.jsx(E.icon, {
                            className: `h-4 w-4 ${$ ? "text-primary" : ""}`,
                            strokeWidth: 1.75,
                          }),
                          e.jsx("span", { className: "flex-1", children: E.title }),
                          E.badge &&
                            e.jsx("span", {
                              className:
                                "rounded bg-muted-foreground/15 px-1.5 py-0.5 text-[9px] font-medium uppercase leading-none tracking-wider text-muted-foreground/80",
                              children: E.badge,
                            }),
                          e.jsx(pa, {
                            className: "h-3.5 w-3.5 text-muted-foreground/70",
                            strokeWidth: 1.75,
                            "aria-label": `Abrir ${E.title} en nueva pestaña`,
                          }),
                        ],
                      })
                    : e.jsxs(X, {
                        to: E.url,
                        className: "flex items-center gap-2.5",
                        onClick: O,
                        children: [
                          e.jsx(E.icon, {
                            className: `h-4 w-4 ${$ ? "text-primary" : ""}`,
                            strokeWidth: 1.75,
                          }),
                          e.jsx("span", { className: "flex-1", children: E.title }),
                          E.badge &&
                            e.jsx("span", {
                              className:
                                "rounded bg-muted-foreground/15 px-1.5 py-0.5 text-[9px] font-medium uppercase leading-none tracking-wider text-muted-foreground/80",
                              children: E.badge,
                            }),
                        ],
                      }),
                }),
              ],
            }),
          },
          E.url,
        );
      });
  return e.jsxs(Er, {
    collapsible: "icon",
    className: "border-r border-sidebar-border",
    children: [
      e.jsx(Pr, {
        className:
          "border-b border-sidebar-border group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-2",
        children: e.jsx(ke, {
          to: "/app",
          onClick: O,
          branchLabel: o ? null : h,
          appName: o ? "Agentes" : j,
          branchLogoUrl: o ? null : d,
          pending: !o && i,
          className:
            "px-2 py-2.5 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-2",
        }),
      }),
      e.jsxs(Cr, {
        className: "pt-2",
        children: [
          e.jsx(se, {
            children: e.jsx(ne, {
              children: e.jsx(ie, {
                children: e.jsx(I.div, {
                  className: "flex w-full min-w-0 flex-col gap-1",
                  variants: C,
                  initial: M ? !1 : "hidden",
                  animate: "show",
                  children: R([zn], "resumen"),
                }),
              }),
            }),
          }),
          e.jsxs(se, {
            children: [
              e.jsx(me, {
                className:
                  "text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80",
                children: "Comunicación",
              }),
              e.jsx(ne, {
                children: e.jsx(ie, {
                  children: e.jsx(I.div, {
                    className: "flex w-full min-w-0 flex-col gap-1",
                    variants: C,
                    initial: M ? !1 : "hidden",
                    animate: "show",
                    children: R(P, "comunicacion"),
                  }),
                }),
              }),
            ],
          }),
          e.jsxs(se, {
            children: [
              e.jsx(me, {
                className:
                  "text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80",
                children: "Studio",
              }),
              e.jsx(ne, {
                children: e.jsx(ie, {
                  children: e.jsx(I.div, {
                    className: "flex w-full min-w-0 flex-col gap-1",
                    variants: C,
                    initial: M ? !1 : "hidden",
                    animate: "show",
                    children: R(N, "studio"),
                  }),
                }),
              }),
            ],
          }),
          S.length > 0 &&
            e.jsxs(se, {
              children: [
                e.jsx(me, {
                  className:
                    "text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80",
                  children: "OPS-agents",
                }),
                e.jsx(ne, {
                  children: e.jsx(ie, {
                    children: e.jsx(I.div, {
                      className: "flex w-full min-w-0 flex-col gap-1",
                      variants: C,
                      initial: M ? !1 : "hidden",
                      animate: "show",
                      children: R(S, "ops"),
                    }),
                  }),
                }),
              ],
            }),
          o &&
            e.jsxs(se, {
              children: [
                e.jsx(me, {
                  className:
                    "text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80",
                  children: "Admin",
                }),
                e.jsx(ne, {
                  children: e.jsx(ie, {
                    children: e.jsx(I.div, {
                      className: "flex w-full min-w-0 flex-col gap-1",
                      variants: C,
                      initial: M ? !1 : "hidden",
                      animate: "show",
                      children: R(Hn, "admin"),
                    }),
                  }),
                }),
              ],
            }),
          (k || _) &&
            e.jsxs(se, {
              children: [
                e.jsx(me, {
                  className:
                    "text-[10.5px] font-semibold tracking-wider uppercase text-muted-foreground/80",
                  children: "Gestión",
                }),
                e.jsx(ne, {
                  children: e.jsx(ie, {
                    children: e.jsx(I.div, {
                      className: "flex w-full min-w-0 flex-col gap-1",
                      variants: C,
                      initial: M ? !1 : "hidden",
                      animate: "show",
                      children: R(k ? Un() : L, "gestion"),
                    }),
                  }),
                }),
              ],
            }),
        ],
      }),
      e.jsx(Mr, {}),
    ],
  });
}
function Kn(t, r, a) {
  if (!r || r.scope === "app") return !1;
  const s = (n) => t.some((i) => String(i.branch_id) === String(n) && i.is_active !== !1);
  if (r.branchId && (a || s(r.branchId))) return (de(r.branchId, !0, a), !0);
  if (r.scope === "organization" && r.stores.length > 0) {
    const n = r.stores.map((i) => String(i.id)).filter((i) => a || s(i));
    if (n.length >= 1) return (de(n[0], !0, a), !0);
  }
  return !1;
}
function Yn(t, r) {
  const a = ln();
  if (Kn(r, a, t.is_superuser)) {
    ve();
    return;
  }
  if (r.length === 1) {
    (de(r[0].branch_id, !0, t.is_superuser), ve());
    return;
  }
  const s = ba();
  if (
    !!s &&
    (t.is_superuser || r.some((c) => String(c.branch_id) === String(s) && c.is_active !== !1))
  ) {
    ve();
    return;
  }
  const i = r.find((c) => c.is_active !== !1);
  (i && de(i.branch_id, !0, t.is_superuser), ve());
}
function Dr() {
  return Le({
    mutationFn: (t) => (ur(), Ve(q.auth.login, t)),
    onSuccess: (t) => {
      const a = (t.branches ?? t.user.branch_assignments ?? []).map((s) => {
        const n = s;
        return {
          ...s,
          role: n.role_code || s.role || "",
          role_display: n.role_name || s.role_display || "",
          role_code: n.role_code || s.role,
          role_name: n.role_name || s.role_display,
        };
      });
      (ga({
        token: t.token,
        user: {
          ...t.user,
          branch_assignments: a,
          owned_organizations: t.owned_organizations ?? t.user.owned_organizations ?? [],
          is_organization_owner: !!(
            (t.owned_organizations ?? t.user.owned_organizations ?? []).length > 0 ||
            t.user.is_organization_owner
          ),
        },
        branches: a,
        permissions: t.permissions,
      }),
        Yn(t.user, a));
    },
  });
}
function sl() {
  return Oe({
    queryKey: ["auth", "profile"],
    queryFn: () => fe(q.auth.myProfile),
    enabled: typeof window < "u",
    retry: !1,
  });
}
function nl() {
  const t = vt();
  return Le({
    mutationFn: (r) => fa(q.auth.myProfile, r, { skipBranchHeader: !0 }),
    onSuccess: (r) => {
      (ha({
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        username: r.username,
        dni: r.dni,
        full_name:
          [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || r.username || r.email,
      }),
        t.setQueryData(["auth", "profile"], r));
    },
  });
}
function il() {
  return Le({ mutationFn: (t) => Ve(q.auth.changePassword, t, { skipBranchHeader: !0 }) });
}
function ol() {
  return Le({
    mutationFn: (t) =>
      Ve(
        q.auth.forgotPassword,
        {
          email: t.email,
          ...(t.login_slug ? { login_slug: t.login_slug } : {}),
          ...(t.branch_id != null ? { branch_id: t.branch_id } : {}),
        },
        { skipBranchHeader: !0 },
      ),
  });
}
function ll() {
  return Le({ mutationFn: (t) => Ve(q.auth.resetPasswordConfirm, t, { skipBranchHeader: !0 }) });
}
async function Br() {
  try {
    await ma.post(q.auth.logout);
  } catch {}
  (ur(),
    ve(),
    localStorage.removeItem("activeBranchId"),
    sessionStorage.removeItem("activeBranchId"),
    (window.location.href = "/login"));
}
function Qn({ compact: t, label: r, loading: a }) {
  return e.jsxs("div", {
    className: m(
      "flex h-9 items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 text-xs text-foreground",
      t ? "max-w-[180px] w-full min-w-0" : "max-w-[220px]",
    ),
    title: r,
    children: [
      a
        ? e.jsx(pr, { className: "h-3.5 w-3.5 animate-spin shrink-0 text-muted-foreground" })
        : e.jsx(J, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground", "aria-hidden": !0 }),
      e.jsx("span", { className: "truncate", children: r }),
    ],
  });
}
function Ut({ compact: t = !1 }) {
  return xr() ? e.jsx(Zn, { compact: t }) : null;
}
function Zn({ compact: t = !1 }) {
  const r = xt(),
    a = vt(),
    { data: s = [], isLoading: n, isError: i } = ya(),
    [c, o] = l.useState(() => Nt() ?? "");
  return (
    l.useEffect(() => ar((d) => o(d ?? "")), []),
    l.useEffect(() => {
      if (s.length === 0) return;
      const d = new Set(s.map((u) => String(u.value)));
      if (!c || !d.has(c)) {
        const u = String(s[0].value);
        (o(u), de(u, !0, !!r?.is_superuser));
      }
    }, [s, c, r?.is_superuser]),
    n
      ? e.jsx(Qn, { compact: t, label: t ? "…" : "Sucursales…", loading: !0 })
      : s.length === 0
        ? e.jsxs("div", {
            className: m(
              "flex h-9 max-w-[160px] items-center gap-1.5 rounded-md border border-warning/40 bg-muted px-2.5 text-[11px] text-warning-foreground",
            ),
            title: i
              ? "No se pudieron cargar sucursales"
              : "Sin sucursales. Corre seed_test_data en la API.",
            children: [
              e.jsx(J, { className: "h-3.5 w-3.5 shrink-0" }),
              e.jsx("span", { className: "truncate", children: "Sin sucursal" }),
            ],
          })
        : ja(s.length)
          ? e.jsx("div", {
              className: m("min-w-0", t && "w-full max-w-[180px]"),
              children: e.jsxs(va, {
                value: c,
                onValueChange: (d) => {
                  (o(d), de(d, !0, !!r?.is_superuser), a.invalidateQueries());
                },
                children: [
                  e.jsxs(wa, {
                    className: m(
                      "h-9 gap-2 border-border bg-muted text-xs shadow-none focus:ring-1 focus:ring-ring",
                      t ? "w-full min-w-0 px-2.5" : "w-[160px] sm:w-[220px]",
                    ),
                    children: [
                      e.jsx(J, {
                        className: "h-3.5 w-3.5 text-muted-foreground shrink-0",
                        "aria-hidden": !0,
                      }),
                      e.jsx(Na, { placeholder: "Sucursal" }),
                    ],
                  }),
                  e.jsx(_a, {
                    className: "min-w-[var(--radix-select-trigger-width)] p-1.5",
                    children: s.map((d, u) =>
                      e.jsx(
                        ka,
                        {
                          value: String(d.value),
                          className: m(u === 0 && "mt-0"),
                          children: d.label,
                        },
                        String(d.value),
                      ),
                    ),
                  }),
                ],
              }),
            })
          : null
  );
}
const Fr = l.createContext(null);
function Jn() {
  const t = Y(),
    r = !t && be(),
    a = [
      { id: "home", label: "Resumen", to: "/app", icon: dr, keywords: "home inicio dashboard" },
      { id: "chat", label: "Chat Studio", to: "/app/chat", icon: nr, keywords: "probar agente" },
      { id: "agentes", label: "Agentes", to: "/app/agentes", icon: Lt, keywords: "ai bots" },
    ];
  (Et() &&
    a.push({
      id: "conocimiento",
      label: "Conocimiento",
      to: "/app/conocimiento",
      icon: ir,
      keywords: "rag docs biblioteca",
    }),
    At() &&
      a.push({
        id: "skills",
        label: "Skills",
        to: "/app/skills",
        icon: or,
        keywords: "funciones tools",
      }),
    a.push({
      id: "apps",
      label: "Aplicaciones",
      to: "/app/aplicaciones",
      icon: Ue,
      keywords: "apis integraciones",
    }));
  const s = [];
  (Rt() &&
    s.push({
      id: "conversaciones",
      label: "Conversaciones",
      to: "/app/conversaciones",
      icon: Ge,
      keywords: "inbox bandeja",
    }),
    s.push({
      id: "canales",
      label: "Canales",
      to: "/app/canales",
      icon: Ne,
      keywords: "whatsapp telegram",
    }));
  const n = [
    { heading: "Studio", items: a },
    { heading: "Comunicación", items: s },
  ];
  if (t)
    (n.push({
      heading: "OPS-agents",
      items: [
        {
          id: "planes",
          label: "Planes",
          to: "/app/planes",
          icon: lr,
          keywords: "ops work plans beta",
        },
        {
          id: "workflows",
          label: "Workflows",
          to: "/app/workflows",
          icon: cr,
          keywords: "flujos canvas beta",
        },
      ],
    }),
      n.push({
        heading: "Admin",
        items: [
          { id: "admin-orgs", label: "Organizaciones", to: "/app/admin/organizaciones", icon: $e },
          { id: "admin-branches", label: "Sucursales", to: "/app/admin/sucursales", icon: J },
          { id: "admin-users", label: "Usuarios", to: "/app/admin/usuarios", icon: le },
          { id: "admin-llm", label: "LLM", to: "/app/admin/llm", icon: Te, keywords: "modelos" },
        ],
      }));
  else if (r)
    n.push({
      heading: "Gestión",
      items: [
        { id: "org-orgs", label: Pt(), to: "/app/admin/organizaciones", icon: $e },
        { id: "org-branches", label: we(), to: "/app/admin/sucursales", icon: J },
        { id: "org-users", label: "Usuarios", to: "/app/admin/usuarios", icon: le },
      ],
    });
  else {
    const i = [];
    (_t() && i.push({ id: "role-branches", label: we(), to: "/app/admin/sucursales", icon: J }),
      kt() && i.push({ id: "role-users", label: "Usuarios", to: "/app/admin/usuarios", icon: le }),
      St() && i.push({ id: "role-llm", label: "LLM", to: "/app/admin/llm", icon: Te }),
      i.length && n.push({ heading: "Gestión", items: i }));
  }
  return (
    n.push({
      heading: "Cuenta",
      items: [
        { id: "perfil", label: "Mi perfil", to: "/app/perfil", icon: pt },
        {
          id: "logout",
          label: "Cerrar sesión",
          icon: mr,
          keywords: "salir logout",
          run: () => Br(),
        },
      ],
    }),
    n
  );
}
function Xn({ open: t, onOpenChange: r }) {
  const a = yt(),
    s = l.useMemo(() => Jn(), [t]),
    n = l.useCallback(
      (i) => {
        if ((r(!1), i.run)) {
          i.run();
          return;
        }
        i.to && a(i.to);
      },
      [a, r],
    );
  return e.jsxs(Sa, {
    open: t,
    onOpenChange: r,
    children: [
      e.jsx(La, { placeholder: "Ir a… agentes, planes, conocimiento" }),
      e.jsxs(Ea, {
        children: [
          e.jsx(Aa, { children: "Sin resultados." }),
          s.map((i, c) =>
            e.jsxs(
              "div",
              {
                children: [
                  c > 0 ? e.jsx(Ra, {}) : null,
                  e.jsx(Pa, {
                    heading: i.heading,
                    children: i.items.map((o) => {
                      const x = o.icon;
                      return e.jsxs(
                        Ma,
                        {
                          value: `${o.label} ${o.keywords ?? ""} ${i.heading}`,
                          onSelect: () => n(o),
                          children: [
                            e.jsx(x, { className: "text-muted-foreground" }),
                            e.jsx("span", { children: o.label }),
                          ],
                        },
                        o.id,
                      );
                    }),
                  }),
                ],
              },
              i.heading,
            ),
          ),
        ],
      }),
    ],
  });
}
function Gt({ children: t }) {
  const [r, a] = l.useState(!1);
  l.useEffect(() => {
    const n = (i) => {
      i.key.toLowerCase() === "k" && (i.metaKey || i.ctrlKey) && (i.preventDefault(), a((c) => !c));
    };
    return (window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n));
  }, []);
  const s = l.useMemo(() => ({ open: r, setOpen: a }), [r]);
  return e.jsxs(Fr.Provider, { value: s, children: [t, e.jsx(Xn, { open: r, onOpenChange: a })] });
}
function ei() {
  const t = l.useContext(Fr);
  return t || { open: !1, setOpen: (r) => {} };
}
function ti() {
  const { setOpen: t } = ei(),
    r = typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform || "");
  return e.jsxs("button", {
    type: "button",
    onClick: () => t(!0),
    className:
      "hidden md:inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
    title: "Buscar (⌘K)",
    children: [
      e.jsx("span", { children: "Buscar" }),
      e.jsx(Ca, {
        className: "ml-0 tracking-normal text-[10px] opacity-80",
        children: r ? "⌘K" : "Ctrl+K",
      }),
    ],
  });
}
function ri(t) {
  const r = t.replace(/^\/app\/?/, "/") || "/";
  return !!(
    r === "/chat" ||
    r.startsWith("/chat/") ||
    r === "/conversaciones" ||
    r.startsWith("/conversaciones/") ||
    r === "/planes" ||
    r.startsWith("/planes/") ||
    r === "/workflows" ||
    r.startsWith("/workflows/") ||
    /^\/agentes\/[^/]+\/chat\/?$/.test(r)
  );
}
function ai(t, r = "") {
  const a = t.replace(/^\/app\/?/, "/") || "/";
  if (a === "/") return { breadcrumb: [{ label: "Resumen" }] };
  if (a.startsWith("/agentes"))
    return a === "/agentes/nuevo"
      ? {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "Agentes", to: "/app/agentes" },
            { label: "Nuevo" },
          ],
        }
      : a !== "/agentes"
        ? {
            breadcrumb: [
              { label: "Resumen", to: "/app" },
              { label: "Agentes", to: "/app/agentes" },
            ],
          }
        : { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Agentes" }] };
  if (a.startsWith("/conversaciones"))
    return { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Conversaciones" }] };
  if (a.startsWith("/canales"))
    return { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Canales" }] };
  if (a.startsWith("/conocimiento"))
    return a === "/conocimiento/datos"
      ? {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "Conocimiento", to: "/app/conocimiento" },
            { label: "Datos" },
          ],
        }
      : a === "/conocimiento/nuevo"
        ? {
            breadcrumb: [
              { label: "Resumen", to: "/app" },
              { label: "Conocimiento", to: "/app/conocimiento" },
              { label: "Nuevo" },
            ],
          }
        : a !== "/conocimiento"
          ? {
              breadcrumb: [
                { label: "Resumen", to: "/app" },
                { label: "Conocimiento", to: "/app/conocimiento" },
                { label: "Detalle" },
              ],
            }
          : { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Conocimiento" }] };
  if (a.startsWith("/aplicaciones") || a.startsWith("/apis"))
    return a !== "/aplicaciones" && a !== "/apis"
      ? {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "Aplicaciones", to: "/app/aplicaciones" },
          ],
        }
      : { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Aplicaciones" }] };
  if (a.startsWith("/skills") || a.startsWith("/funciones"))
    return a === "/skills/nuevo" || a === "/funciones/nuevo"
      ? {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "Skills", to: "/app/skills" },
            { label: "Nueva" },
          ],
        }
      : a !== "/skills" && a !== "/funciones"
        ? {
            breadcrumb: [
              { label: "Resumen", to: "/app" },
              { label: "Skills", to: "/app/skills" },
            ],
          }
        : { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Skills" }] };
  if (a.startsWith("/chat"))
    return {
      breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Studio" }, { label: "Chat" }],
    };
  if (a.startsWith("/planes"))
    return {
      breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "OPS-agents" }, { label: "Planes" }],
    };
  if (a.startsWith("/workflows"))
    return a !== "/workflows"
      ? {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "OPS-agents", to: "/app/planes" },
            { label: "Workflows", to: "/app/workflows" },
            { label: "Canvas" },
          ],
        }
      : {
          breadcrumb: [
            { label: "Resumen", to: "/app" },
            { label: "OPS-agents", to: "/app/planes" },
            { label: "Workflows" },
          ],
        };
  if (a.startsWith("/admin/organizaciones")) {
    const s = new URLSearchParams(r).get("view"),
      n = Pt(),
      i = [
        { label: "Resumen", to: "/app" },
        { label: "Admin" },
        { label: n, to: s ? "/app/admin/organizaciones" : void 0 },
      ];
    return (
      s === "nuevo"
        ? i.push({ label: "Nueva organización" })
        : s === "editar" && i.push({ label: "Editar organización" }),
      { breadcrumb: i }
    );
  }
  if (a.startsWith("/admin/llm"))
    return { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Admin" }, { label: "LLM" }] };
  if (a.startsWith("/admin/sucursales")) {
    const s = new URLSearchParams(r).get("view"),
      n = we(),
      i = [
        { label: "Resumen", to: "/app" },
        { label: "Admin" },
        { label: n, to: s ? "/app/admin/sucursales" : void 0 },
      ];
    return (
      s === "nuevo"
        ? i.push({ label: "Nueva sucursal" })
        : s === "editar" && i.push({ label: "Editar sucursal" }),
      { breadcrumb: i }
    );
  }
  if (a.startsWith("/admin/usuarios")) {
    const s = new URLSearchParams(r).get("view"),
      n = [
        { label: "Resumen", to: "/app" },
        { label: "Admin" },
        { label: "Usuarios", to: s ? "/app/admin/usuarios" : void 0 },
      ];
    return (
      s === "nuevo"
        ? n.push({ label: "Nuevo usuario" })
        : s === "asignar"
          ? n.push({ label: "Asignar a sucursal" })
          : s === "editar" && n.push({ label: "Editar usuario" }),
      { breadcrumb: n }
    );
  }
  return a.startsWith("/configuracion")
    ? { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Configuración" }] }
    : a.startsWith("/perfil")
      ? { breadcrumb: [{ label: "Resumen", to: "/app" }, { label: "Mi perfil" }] }
      : { breadcrumb: [] };
}
function si() {
  const { pathname: t, search: r } = pe(),
    a = ai(t, r),
    [s, n] = l.useState(() => xt()),
    i = xr();
  return (
    l.useEffect(() => {
      const c = () => n(xt());
      return (
        window.addEventListener("authUserChanged", c),
        () => window.removeEventListener("authUserChanged", c)
      );
    }, []),
    l.useEffect(() => {
      if (!be()) return;
      const c = sr().filter((u) => u.is_active !== !1),
        o = Nt();
      if (!!o && Ia() === "branch" && c.some((u) => String(u.branch_id) === String(o))) return;
      const d = c[0];
      d?.branch_id != null && de(d.branch_id, !0, !1);
    }, []),
    e.jsxs("header", {
      className:
        "sticky top-0 z-30 flex min-h-14 shrink-0 items-center gap-2 border-b bg-card px-3 py-2 sm:gap-3 md:px-5 supports-[padding:max(0px)]:pt-[max(0.5rem,env(safe-area-inset-top))]",
      children: [
        e.jsx(Ar, { className: "h-9 w-9 shrink-0" }),
        a.breadcrumb.length > 0 &&
          e.jsx("nav", {
            className: m(
              "flex items-center gap-1.5 text-sm text-muted-foreground min-w-0",
              i ? "hidden sm:flex flex-1" : "flex-1",
            ),
            "aria-label": "Miga de pan",
            children: a.breadcrumb.map((c, o) => {
              const x = o === a.breadcrumb.length - 1;
              return e.jsxs(
                "span",
                {
                  className: "flex items-center gap-1.5 min-w-0",
                  children: [
                    o > 0 &&
                      e.jsx(za, {
                        className: "h-3.5 w-3.5 shrink-0 opacity-60",
                        strokeWidth: 1.75,
                      }),
                    c.to && !x
                      ? e.jsx(X, {
                          to: c.to,
                          className: "hover:text-primary transition-colors truncate",
                          children: c.label,
                        })
                      : e.jsx("span", {
                          className: x ? "text-foreground font-medium truncate" : "truncate",
                          children: c.label,
                        }),
                  ],
                },
                o,
              );
            }),
          }),
        i
          ? e.jsx("div", {
              className: "flex flex-1 min-w-0 items-center justify-center sm:hidden",
              children: e.jsx(Ut, { compact: !0 }),
            })
          : a.breadcrumb.length > 0
            ? e.jsx("div", {
                className: "flex flex-1 min-w-0 sm:hidden",
                children: e.jsx("span", {
                  className: "truncate text-sm font-medium text-foreground",
                  children: a.breadcrumb[a.breadcrumb.length - 1]?.label,
                }),
              })
            : e.jsx("div", { className: "flex-1 min-w-0 sm:hidden" }),
        e.jsxs("div", {
          className: "ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0",
          children: [
            i && e.jsx("div", { className: "hidden sm:block", children: e.jsx(Ut, {}) }),
            e.jsx(ti, {}),
            e.jsxs(Oa, {
              children: [
                e.jsx(Ta, {
                  asChild: !0,
                  children: e.jsx(ce, {
                    variant: "ghost",
                    size: "icon",
                    className: "h-9 w-9 rounded-full shrink-0",
                    children: e.jsx($a, {
                      className: "h-8 w-8",
                      children: e.jsx(Da, {
                        className:
                          "bg-primary-deep text-primary-foreground text-[11px] font-semibold",
                        children:
                          s?.first_name?.[0] ||
                          s?.username?.[0] ||
                          e.jsx(pt, { className: "h-4 w-4" }),
                      }),
                    }),
                  }),
                }),
                e.jsxs(Ba, {
                  align: "end",
                  className: "w-48",
                  children: [
                    s &&
                      e.jsx("div", {
                        className: "px-2 py-1.5 text-xs text-muted-foreground truncate",
                        children: s.full_name || s.email,
                      }),
                    e.jsx(Bt, {
                      asChild: !0,
                      children: e.jsxs(X, {
                        to: "/app/perfil",
                        children: [e.jsx(pt, { className: "h-3.5 w-3.5 mr-2" }), " Mi perfil"],
                      }),
                    }),
                    e.jsxs(Bt, {
                      onClick: Br,
                      children: [e.jsx(mr, { className: "h-3.5 w-3.5 mr-2" }), " Cerrar sesión"],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
function ni() {
  const { brandPending: t } = $r(),
    { pathname: r } = pe();
  return ri(r)
    ? e.jsx(Gt, {
        children: e.jsx("div", {
          className: m(
            "relative flex h-dvh w-full overflow-hidden bg-background transition-opacity duration-300",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]",
            t && "opacity-[0.97]",
          ),
          children: e.jsx("main", {
            className: "relative flex-1 min-w-0 min-h-0 overflow-hidden",
            children: e.jsx(ze, {}),
          }),
        }),
      })
    : e.jsx(Gt, {
        children: e.jsx(Lr, {
          children: e.jsxs("div", {
            className: m(
              "relative flex min-h-screen w-full bg-background transition-opacity duration-300",
              "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_90%_55%_at_12%_-10%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]",
              t && "opacity-[0.97]",
            ),
            children: [
              e.jsx(Vn, {}),
              e.jsxs(Rr, {
                className: "relative flex flex-1 flex-col min-w-0",
                children: [
                  e.jsx(si, {}),
                  e.jsx("main", { className: "flex-1 min-w-0", children: e.jsx(ze, {}) }),
                ],
              }),
            ],
          }),
        }),
      });
}
function ii() {
  const t = pe();
  return hr()
    ? e.jsx(ze, {})
    : e.jsx(Z, { to: "/entrar", replace: !0, state: { from: t.pathname } });
}
function he({ children: t }) {
  return hr() ? e.jsx(Z, { to: "/app", replace: !0 }) : e.jsx(e.Fragment, { children: t });
}
function re({ section: t }) {
  return e.jsx("div", {
    className: "flex min-h-[60vh] flex-col items-center justify-center px-6",
    children: e.jsx(fr, {
      icon: e.jsx(Fa, { className: "h-5 w-5" }),
      title: "No tienes acceso a esta sección",
      description: t
        ? `Tu cuenta no tiene permisos para ${t}. Si crees que es un error, contacta a un administrador de tu organización.`
        : "Tu cuenta no tiene permisos para ver esta pantalla. Si crees que es un error, contacta a un administrador de tu organización.",
      action: e.jsx(ce, {
        asChild: !0,
        size: "sm",
        children: e.jsx(X, { to: "/app", children: "Ir al inicio" }),
      }),
    }),
  });
}
function oi({ children: t }) {
  return kt()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "la administración de usuarios" });
}
function li({ children: t }) {
  return _t()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "la administración de sucursales" });
}
function ci({ children: t }) {
  return Ha()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "la administración de organizaciones" });
}
function di({ children: t }) {
  return St()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "la administración de modelos LLM" });
}
function Pe({ children: t }) {
  return Et()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "el catálogo de conocimiento" });
}
function ui({ children: t }) {
  return Rt()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "la bandeja de conversaciones" });
}
function it({ children: t }) {
  return At()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "el catálogo de skills" });
}
function ot({ children: t }) {
  return Y()
    ? e.jsx(e.Fragment, { children: t })
    : e.jsx(re, { section: "esta sección (preview interno)" });
}
const Hr = l.createContext(null),
  lt = ["light", "dark", "system"];
function xi({ children: t }) {
  const [r, a] = l.useState(() => Fs()),
    [s, n] = l.useState(() => Hs()),
    i = l.useCallback((d) => {
      const u = Ws();
      return (n(u), tn(), u);
    }, []),
    c = l.useCallback(
      (d) => {
        (a(d), qt(d), i(d));
      },
      [i],
    ),
    o = l.useCallback(() => {
      a((d) => {
        const u = lt.indexOf(d),
          f = lt[(u + 1) % lt.length];
        return (qt(f), i(f), f);
      });
    }, [i]);
  (l.useEffect(() => {
    i(r);
  }, []),
    l.useEffect(() => {
      if (r === "system")
        return Us(() => {
          i("system");
        });
    }, [r, i]));
  const x = l.useMemo(
    () => ({ preference: r, resolved: s, setPreference: c, cyclePreference: o }),
    [r, s, c, o],
  );
  return e.jsx(Hr.Provider, { value: x, children: t });
}
function pi() {
  const t = l.useContext(Hr);
  if (!t) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return t;
}
function mi({ className: t }) {
  const r = l.useRef(null),
    a = G();
  return (
    l.useEffect(() => {
      if (a) return;
      const s = r.current;
      if (!s) return;
      const n = s.getContext("2d");
      if (!n) return;
      let i = 0,
        c = !0,
        o = [],
        x = 0,
        d = 0,
        u = 0;
      const f = window.matchMedia("(max-width: 1023px)").matches,
        h = f ? 1 : 0,
        g = (_ = !1) => ({
          x: Math.random() * (x + 40) - 20,
          y: _ ? Math.random() * d : -8 - Math.random() * 40,
          size: Math.random() < 0.72 ? 1 : 2,
          speed: 0.35 + Math.random() * 0.75,
          drift: 0.25 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.3 + Math.random() * 0.5,
        });
      let y = 0;
      const j = () => {
          (cancelAnimationFrame(y),
            (y = requestAnimationFrame(() => {
              const _ = s.getBoundingClientRect();
              ((x = Math.max(1, Math.floor(_.width))),
                (d = Math.max(1, Math.floor(_.height))),
                (s.width = x),
                (s.height = d),
                n.setTransform(1, 0, 0, 1, 0, 0),
                (o = Array.from({ length: f ? 45 : 90 }, () => g(!0))));
            })));
        },
        k = () => {
          if (!c) return;
          if (h && u++ % (h + 1) !== 0) {
            i = requestAnimationFrame(k);
            return;
          }
          n.clearRect(0, 0, x, d);
          const _ = d * 0.3;
          for (const N of o) {
            ((N.phase += 0.012),
              (N.x += Math.sin(N.phase) * N.drift * 0.35),
              (N.y += N.speed),
              N.y > d + 6 && Object.assign(N, g(!1)),
              N.x > x + 10 && (N.x = -8),
              N.x < -10 && (N.x = x + 8));
            const S = N.y < _ ? 0.4 + (N.y / _) * 0.6 : 1;
            ((n.globalAlpha = N.opacity * S),
              n.fillRect(Math.round(N.x), Math.round(N.y), N.size, N.size));
          }
          ((n.globalAlpha = 1), (i = window.requestAnimationFrame(k)));
        },
        L = () => {
          document.hidden
            ? ((c = !1), window.cancelAnimationFrame(i))
            : ((c = !0), (i = window.requestAnimationFrame(k)));
        };
      return (
        j(),
        (i = window.requestAnimationFrame(k)),
        window.addEventListener("resize", j, { passive: !0 }),
        document.addEventListener("visibilitychange", L),
        () => {
          ((c = !1),
            cancelAnimationFrame(i),
            cancelAnimationFrame(y),
            window.removeEventListener("resize", j),
            document.removeEventListener("visibilitychange", L));
        }
      );
    }, [a]),
    a
      ? null
      : e.jsx("canvas", {
          ref: r,
          "aria-hidden": !0,
          className: m("pointer-events-none absolute inset-0 h-full w-full", t),
          style: { filter: "brightness(1.1)" },
        })
  );
}
function hi({ className: t, density: r = 140 }) {
  const a = l.useRef(null),
    s = G();
  return (
    l.useEffect(() => {
      if (s) return;
      const n = a.current;
      if (!n) return;
      const i = n.getContext("2d");
      if (!i) return;
      let c = 0,
        o = !0,
        x = [],
        d = 0,
        u = 0,
        f = 0;
      const h = window.matchMedia("(max-width: 1023px)").matches,
        g = h ? 1 : 0,
        y = h ? Math.min(r, 200) : r,
        j = (S = !1) => ({
          x: Math.random() * (d + 60) - 30,
          y: S ? Math.random() * u : -10 - Math.random() * 60,
          len: 5 + Math.floor(Math.random() * 9),
          speed: 5 + Math.random() * 6,
          opacity: 0.25 + Math.random() * 0.25,
          wind: -0.6 + Math.random() * 1,
        });
      let k = 0;
      const L = () => {
          (cancelAnimationFrame(k),
            (k = requestAnimationFrame(() => {
              const S = n.getBoundingClientRect();
              ((d = Math.max(1, Math.floor(S.width))),
                (u = Math.max(1, Math.floor(S.height))),
                (n.width = d),
                (n.height = u),
                (x = Array.from({ length: y }, () => j(!0))));
            })));
        },
        _ = () => {
          if (o) {
            if (g && f++ % (g + 1) !== 0) {
              c = requestAnimationFrame(_);
              return;
            }
            (i.clearRect(0, 0, d, u),
              (i.strokeStyle = "rgba(190, 210, 225, 0.95)"),
              (i.lineWidth = 1));
            for (const S of x)
              ((S.x += S.wind),
                (S.y += S.speed),
                S.y > u + 10 && Object.assign(S, j(!1)),
                S.x > d + 20 && (S.x = -10),
                S.x < -20 && (S.x = d + 10),
                (i.globalAlpha = S.opacity),
                i.beginPath(),
                i.moveTo(Math.round(S.x), Math.round(S.y)),
                i.lineTo(Math.round(S.x), Math.round(S.y - S.len)),
                i.stroke());
            ((i.globalAlpha = 1), (c = window.requestAnimationFrame(_)));
          }
        },
        N = () => {
          document.hidden
            ? ((o = !1), window.cancelAnimationFrame(c))
            : ((o = !0), (c = window.requestAnimationFrame(_)));
        };
      return (
        L(),
        (c = window.requestAnimationFrame(_)),
        window.addEventListener("resize", L, { passive: !0 }),
        document.addEventListener("visibilitychange", N),
        () => {
          ((o = !1),
            window.cancelAnimationFrame(c),
            window.removeEventListener("resize", L),
            document.removeEventListener("visibilitychange", N));
        }
      );
    }, [s, r]),
    s
      ? null
      : e.jsx("canvas", {
          ref: a,
          "aria-hidden": !0,
          className: m("pointer-events-none absolute inset-0 h-full w-full", t),
        })
  );
}
function Vt({ className: t }) {
  return e.jsx("svg", {
    viewBox: "0 0 16 10",
    shapeRendering: "crispEdges",
    className: m("h-full w-full", t),
    "aria-hidden": !0,
    children: e.jsxs("g", {
      fill: "currentColor",
      children: [
        e.jsx("rect", { x: "7", y: "4", width: "4", height: "2" }),
        e.jsx("rect", { x: "10", y: "3", width: "2", height: "2" }),
        e.jsx("rect", { x: "12", y: "4", width: "2", height: "1" }),
        e.jsx("rect", { x: "5", y: "5", width: "2", height: "1" }),
        e.jsx("rect", { x: "4", y: "6", width: "2", height: "1" }),
        e.jsx("rect", { x: "7", y: "1", width: "3", height: "1" }),
        e.jsx("rect", { x: "6", y: "2", width: "5", height: "1" }),
        e.jsx("rect", { x: "6", y: "3", width: "4", height: "1" }),
        e.jsx("rect", { x: "8", y: "7", width: "3", height: "1" }),
        e.jsx("rect", { x: "8", y: "8", width: "2", height: "1" }),
      ],
    }),
  });
}
function fi({ className: t }) {
  return e.jsx("svg", {
    viewBox: "0 0 24 6",
    shapeRendering: "crispEdges",
    className: m("h-full w-full", t),
    "aria-hidden": !0,
    children: e.jsxs("g", {
      fill: "currentColor",
      opacity: "0.6",
      children: [
        e.jsx("rect", { x: "2", y: "2", width: "2", height: "1" }),
        e.jsx("rect", { x: "4", y: "1", width: "1", height: "1" }),
        e.jsx("rect", { x: "2", y: "3", width: "1", height: "1" }),
        e.jsx("rect", { x: "10", y: "2", width: "2", height: "1" }),
        e.jsx("rect", { x: "12", y: "1", width: "1", height: "1" }),
        e.jsx("rect", { x: "10", y: "3", width: "1", height: "1" }),
        e.jsx("rect", { x: "18", y: "2", width: "2", height: "1" }),
        e.jsx("rect", { x: "20", y: "1", width: "1", height: "1" }),
        e.jsx("rect", { x: "18", y: "3", width: "1", height: "1" }),
      ],
    }),
  });
}
function p({ x: t, base: r, h: a, tone: s = "mid" }) {
  const n = Math.round(a * 0.62),
    i = Math.round(a * 0.46),
    c = Math.round(a * 0.3),
    o = Math.max(1, Math.round(a * 0.08)),
    x = Math.round(a / 3);
  return e.jsxs("g", {
    className: `pixel-nordic-pine pixel-nordic-pine--${s}`,
    children: [
      e.jsx("rect", { x: t - o / 2, y: r - 2, width: o, height: 2 }),
      e.jsx("path", { d: `M${t - n / 2} ${r - 2} H${t + n / 2} L${t} ${r - 2 - x} Z` }),
      e.jsx("path", { d: `M${t - i / 2} ${r - 2 - x + 1} H${t + i / 2} L${t} ${r - 2 - x * 2} Z` }),
      e.jsx("path", { d: `M${t - c / 2} ${r - 2 - x * 2 + 1} H${t + c / 2} L${t} ${r - a} Z` }),
      e.jsx("rect", {
        className: "pixel-nordic-pine-snow",
        x: t - 1,
        y: r - a,
        width: 2,
        height: 1,
      }),
      e.jsx("rect", {
        className: "pixel-nordic-pine-snow",
        x: t - c / 2,
        y: r - 2 - x * 2 + 1,
        width: 2,
        height: 1,
      }),
    ],
  });
}
function xe({ points: t, tone: r, snowTone: a, base: s }) {
  const n = t.map(([o, x]) => `L${o} ${x}`).join(" "),
    i = `M${t[0][0]} ${s} ${n} L${t[t.length - 1][0]} ${s} Z`,
    c = [];
  for (let o = 1; o < t.length - 1; o++) {
    const [x, d] = t[o],
      [, u] = t[o - 1],
      [, f] = t[o + 1];
    d <= u && d <= f && c.push([x, d]);
  }
  return e.jsxs("g", {
    children: [
      e.jsx("path", { className: r, d: i }),
      c.map(([o, x], d) => {
        const u = 6 + ((d * 5) % 7),
          f = 3 + ((d * 3) % 4);
        return e.jsx(
          "path",
          {
            className: a,
            d: `M${o} ${x} L${o - u} ${x + f} L${o - u / 2} ${x + f - 1} L${o} ${x + f + 1} L${o + u / 2} ${x + f - 1} L${o + u} ${x + f} Z`,
          },
          d,
        );
      }),
    ],
  });
}
function gi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs("g", {
        className: "pixel-nordic-far",
        children: [
          e.jsx(xe, {
            base: 122,
            tone: "pixel-nordic-peak-far",
            snowTone: "pixel-nordic-snow-far",
            points: [
              [-8, 108],
              [18, 86],
              [34, 100],
              [56, 72],
              [76, 98],
              [96, 82],
              [118, 102],
              [140, 78],
              [160, 96],
              [180, 84],
              [202, 104],
              [224, 80],
              [246, 100],
              [268, 88],
              [290, 106],
              [310, 92],
              [328, 110],
            ],
          }),
          e.jsx(p, { x: 10, base: 116, h: 8, tone: "far" }),
          e.jsx(p, { x: 28, base: 114, h: 7, tone: "far" }),
          e.jsx(p, { x: 46, base: 116, h: 9, tone: "far" }),
          e.jsx(p, { x: 64, base: 114, h: 6, tone: "far" }),
          e.jsx(p, { x: 82, base: 116, h: 8, tone: "far" }),
          e.jsx(p, { x: 100, base: 114, h: 7, tone: "far" }),
          e.jsx(p, { x: 118, base: 116, h: 9, tone: "far" }),
          e.jsx(p, { x: 136, base: 114, h: 6, tone: "far" }),
          e.jsx(p, { x: 154, base: 116, h: 8, tone: "far" }),
          e.jsx(p, { x: 172, base: 114, h: 7, tone: "far" }),
          e.jsx(p, { x: 190, base: 116, h: 9, tone: "far" }),
          e.jsx(p, { x: 208, base: 114, h: 6, tone: "far" }),
          e.jsx(p, { x: 226, base: 116, h: 8, tone: "far" }),
          e.jsx(p, { x: 244, base: 114, h: 7, tone: "far" }),
          e.jsx(p, { x: 262, base: 116, h: 9, tone: "far" }),
          e.jsx(p, { x: 280, base: 114, h: 6, tone: "far" }),
          e.jsx(p, { x: 298, base: 116, h: 8, tone: "far" }),
          e.jsx(p, { x: 316, base: 114, h: 7, tone: "far" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-fog",
        children: [
          e.jsx("ellipse", { cx: "40", cy: "108", rx: "45", ry: "5" }),
          e.jsx("ellipse", { cx: "90", cy: "112", rx: "55", ry: "4" }),
          e.jsx("ellipse", { cx: "150", cy: "110", rx: "65", ry: "5" }),
          e.jsx("ellipse", { cx: "210", cy: "114", rx: "50", ry: "4" }),
          e.jsx("ellipse", { cx: "270", cy: "108", rx: "60", ry: "4" }),
          e.jsx("ellipse", { cx: "310", cy: "116", rx: "35", ry: "3" }),
          e.jsx("ellipse", { cx: "50", cy: "120", rx: "30", ry: "3", opacity: "0.5" }),
          e.jsx("ellipse", { cx: "130", cy: "118", rx: "25", ry: "3", opacity: "0.4" }),
          e.jsx("ellipse", { cx: "250", cy: "120", rx: "35", ry: "3", opacity: "0.5" }),
          e.jsx("ellipse", { cx: "180", cy: "122", rx: "40", ry: "3", opacity: "0.35" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-mid",
        children: [
          e.jsx(xe, {
            base: 138,
            tone: "pixel-nordic-peak-mid",
            snowTone: "pixel-nordic-snow-mid",
            points: [
              [-10, 126],
              [24, 108],
              [52, 122],
              [86, 104],
              [120, 124],
              [154, 110],
              [188, 126],
              [222, 106],
              [256, 124],
              [292, 112],
              [330, 128],
            ],
          }),
          e.jsx(p, { x: 16, base: 132, h: 16, tone: "mid" }),
          e.jsx(p, { x: 30, base: 134, h: 20, tone: "mid" }),
          e.jsx(p, { x: 44, base: 133, h: 14, tone: "mid" }),
          e.jsx(p, { x: 70, base: 136, h: 18, tone: "mid" }),
          e.jsx(p, { x: 84, base: 137, h: 13, tone: "mid" }),
          e.jsx(p, { x: 104, base: 135, h: 17, tone: "mid" }),
          e.jsx(p, { x: 138, base: 136, h: 15, tone: "mid" }),
          e.jsx(p, { x: 164, base: 134, h: 19, tone: "mid" }),
          e.jsx(p, { x: 182, base: 136, h: 13, tone: "mid" }),
          e.jsx(p, { x: 206, base: 135, h: 16, tone: "mid" }),
          e.jsx(p, { x: 236, base: 134, h: 18, tone: "mid" }),
          e.jsx(p, { x: 258, base: 136, h: 14, tone: "mid" }),
          e.jsx(p, { x: 282, base: 135, h: 17, tone: "mid" }),
          e.jsx(p, { x: 302, base: 136, h: 15, tone: "mid" }),
        ],
      }),
      e.jsx("rect", {
        className: "pixel-nordic-water",
        x: "0",
        y: "138",
        width: "320",
        height: "40",
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-moon",
        children: [
          e.jsx("rect", { x: "236", y: "142", width: "10", height: "1" }),
          e.jsx("rect", { x: "238", y: "146", width: "14", height: "1" }),
          e.jsx("rect", { x: "234", y: "151", width: "8", height: "1" }),
          e.jsx("rect", { x: "240", y: "156", width: "12", height: "1" }),
          e.jsx("rect", { x: "236", y: "162", width: "7", height: "1" }),
          e.jsx("rect", { x: "242", y: "168", width: "9", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-aurora",
        children: [
          e.jsx("rect", { x: "60", y: "141", width: "60", height: "1" }),
          e.jsx("rect", { x: "100", y: "146", width: "50", height: "1" }),
          e.jsx("rect", { x: "50", y: "152", width: "40", height: "1" }),
          e.jsx("rect", { x: "130", y: "158", width: "35", height: "1" }),
          e.jsx("rect", { x: "80", y: "164", width: "45", height: "1" }),
          e.jsx("rect", { x: "40", y: "170", width: "30", height: "1" }),
        ],
      }),
      e.jsx("g", {
        className: "pixel-nordic-ripples",
        children: [
          [10, 142, 24],
          [80, 144, 30],
          [180, 140, 20],
          [260, 146, 28],
          [40, 150, 34],
          [140, 152, 26],
          [230, 148, 30],
          [300, 154, 20],
          [10, 160, 28],
          [110, 158, 36],
          [200, 162, 24],
          [280, 160, 30],
          [60, 168, 22],
          [170, 170, 30],
          [250, 172, 26],
          [30, 176, 30],
          [140, 174, 28],
          [290, 178, 24],
        ].map(([t, r, a], s) => e.jsx("rect", { x: t, y: r, width: a, height: 1 }, s)),
      }),
      e.jsxs("g", {
        className: "pixel-nordic-near",
        children: [
          e.jsx("path", {
            className: "pixel-nordic-shore",
            d: "M0 200 V178 H40 L58 170 H96 L112 176 H148 L160 200 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore",
            d: "M320 200 V176 H284 L268 170 H232 L214 178 H184 L176 200 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore-snow",
            d: "M0 182 H38 L56 174 H94 L110 180 H146 L154 188 H0 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore-snow",
            d: "M320 180 H286 L270 174 H234 L218 182 H186 L182 188 H320 Z",
          }),
          e.jsx(p, { x: 12, base: 182, h: 30, tone: "near" }),
          e.jsx(p, { x: 28, base: 178, h: 40, tone: "near" }),
          e.jsx(p, { x: 46, base: 176, h: 28, tone: "near" }),
          e.jsx(p, { x: 66, base: 174, h: 36, tone: "near" }),
          e.jsx(p, { x: 88, base: 175, h: 26, tone: "near" }),
          e.jsx(p, { x: 306, base: 180, h: 32, tone: "near" }),
          e.jsx(p, { x: 290, base: 177, h: 42, tone: "near" }),
          e.jsx(p, { x: 272, base: 175, h: 28, tone: "near" }),
          e.jsx(p, { x: 252, base: 176, h: 36, tone: "near" }),
          e.jsx(p, { x: 232, base: 178, h: 26, tone: "near" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-rock",
        children: [
          e.jsx("rect", { x: "150", y: "166", width: "14", height: "5" }),
          e.jsx("rect", { x: "152", y: "164", width: "10", height: "2" }),
          e.jsx("rect", {
            className: "pixel-nordic-rock-snow",
            x: "152",
            y: "163",
            width: "9",
            height: "1",
          }),
          e.jsx("rect", { x: "120", y: "176", width: "10", height: "4" }),
          e.jsx("rect", { x: "122", y: "174", width: "6", height: "2" }),
        ],
      }),
    ],
  });
}
function bi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs("g", {
        className: "pixel-nordic-far",
        children: [
          e.jsx(xe, {
            base: 104,
            tone: "pixel-nordic-peak-far",
            snowTone: "pixel-nordic-snow-far",
            points: [
              [-8, 96],
              [24, 84],
              [54, 94],
              [86, 82],
              [120, 92],
              [154, 84],
              [188, 96],
              [222, 82],
              [256, 94],
              [290, 86],
              [328, 98],
            ],
          }),
          e.jsx(p, { x: 8, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 22, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 34, base: 98, h: 10, tone: "far" }),
          e.jsx(p, { x: 48, base: 96, h: 7, tone: "far" }),
          e.jsx(p, { x: 62, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 76, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 90, base: 98, h: 10, tone: "far" }),
          e.jsx(p, { x: 104, base: 96, h: 7, tone: "far" }),
          e.jsx(p, { x: 118, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 134, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 150, base: 98, h: 10, tone: "far" }),
          e.jsx(p, { x: 166, base: 96, h: 7, tone: "far" }),
          e.jsx(p, { x: 182, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 198, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 214, base: 98, h: 10, tone: "far" }),
          e.jsx(p, { x: 230, base: 96, h: 7, tone: "far" }),
          e.jsx(p, { x: 246, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 262, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 278, base: 98, h: 10, tone: "far" }),
          e.jsx(p, { x: 294, base: 96, h: 7, tone: "far" }),
          e.jsx(p, { x: 310, base: 98, h: 9, tone: "far" }),
          e.jsx(p, { x: 324, base: 96, h: 8, tone: "far" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-fog",
        children: [
          e.jsx("ellipse", { cx: "30", cy: "100", rx: "40", ry: "4" }),
          e.jsx("ellipse", { cx: "80", cy: "104", rx: "50", ry: "4" }),
          e.jsx("ellipse", { cx: "150", cy: "102", rx: "60", ry: "5" }),
          e.jsx("ellipse", { cx: "220", cy: "106", rx: "45", ry: "4" }),
          e.jsx("ellipse", { cx: "290", cy: "100", rx: "55", ry: "4" }),
          e.jsx("ellipse", { cx: "60", cy: "110", rx: "25", ry: "3", opacity: "0.4" }),
          e.jsx("ellipse", { cx: "200", cy: "112", rx: "30", ry: "3", opacity: "0.35" }),
          e.jsx("ellipse", { cx: "280", cy: "108", rx: "20", ry: "2", opacity: "0.45" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-mid",
        children: [
          e.jsx(p, { x: 6, base: 132, h: 20, tone: "mid" }),
          e.jsx(p, { x: 20, base: 134, h: 24, tone: "mid" }),
          e.jsx(p, { x: 34, base: 131, h: 18, tone: "mid" }),
          e.jsx(p, { x: 48, base: 135, h: 22, tone: "mid" }),
          e.jsx(p, { x: 62, base: 132, h: 26, tone: "mid" }),
          e.jsx(p, { x: 76, base: 134, h: 19, tone: "mid" }),
          e.jsx(p, { x: 90, base: 131, h: 23, tone: "mid" }),
          e.jsx(p, { x: 104, base: 135, h: 20, tone: "mid" }),
          e.jsx(p, { x: 118, base: 132, h: 25, tone: "mid" }),
          e.jsx(p, { x: 132, base: 134, h: 18, tone: "mid" }),
          e.jsx(p, { x: 146, base: 131, h: 22, tone: "mid" }),
          e.jsx(p, { x: 160, base: 135, h: 24, tone: "mid" }),
          e.jsx(p, { x: 174, base: 132, h: 19, tone: "mid" }),
          e.jsx(p, { x: 188, base: 134, h: 23, tone: "mid" }),
          e.jsx(p, { x: 202, base: 131, h: 20, tone: "mid" }),
          e.jsx(p, { x: 216, base: 135, h: 25, tone: "mid" }),
          e.jsx(p, { x: 230, base: 132, h: 18, tone: "mid" }),
          e.jsx(p, { x: 244, base: 134, h: 22, tone: "mid" }),
          e.jsx(p, { x: 258, base: 131, h: 24, tone: "mid" }),
          e.jsx(p, { x: 272, base: 135, h: 19, tone: "mid" }),
          e.jsx(p, { x: 286, base: 132, h: 23, tone: "mid" }),
          e.jsx(p, { x: 300, base: 134, h: 20, tone: "mid" }),
          e.jsx(p, { x: 314, base: 131, h: 22, tone: "mid" }),
        ],
      }),
      e.jsx("rect", {
        className: "pixel-nordic-shore-snow",
        x: "0",
        y: "158",
        width: "320",
        height: "42",
      }),
      e.jsx("rect", {
        className: "pixel-nordic-shore",
        x: "0",
        y: "186",
        width: "320",
        height: "14",
      }),
      e.jsxs("g", {
        className: "pixel-nordic-near",
        children: [
          e.jsx(p, { x: 10, base: 176, h: 42, tone: "near" }),
          e.jsx(p, { x: 26, base: 172, h: 50, tone: "near" }),
          e.jsx(p, { x: 42, base: 178, h: 36, tone: "near" }),
          e.jsx(p, { x: 58, base: 170, h: 48, tone: "near" }),
          e.jsx(p, { x: 74, base: 176, h: 40, tone: "near" }),
          e.jsx(p, { x: 90, base: 172, h: 46, tone: "near" }),
          e.jsx(p, { x: 106, base: 178, h: 34, tone: "near" }),
          e.jsx(p, { x: 122, base: 170, h: 50, tone: "near" }),
          e.jsx(p, { x: 138, base: 176, h: 38, tone: "near" }),
          e.jsx(p, { x: 154, base: 172, h: 44, tone: "near" }),
          e.jsx(p, { x: 170, base: 178, h: 36, tone: "near" }),
          e.jsx(p, { x: 186, base: 170, h: 48, tone: "near" }),
          e.jsx(p, { x: 202, base: 176, h: 40, tone: "near" }),
          e.jsx(p, { x: 218, base: 172, h: 46, tone: "near" }),
          e.jsx(p, { x: 234, base: 178, h: 34, tone: "near" }),
          e.jsx(p, { x: 250, base: 170, h: 50, tone: "near" }),
          e.jsx(p, { x: 266, base: 176, h: 38, tone: "near" }),
          e.jsx(p, { x: 282, base: 172, h: 44, tone: "near" }),
          e.jsx(p, { x: 298, base: 178, h: 36, tone: "near" }),
          e.jsx(p, { x: 314, base: 170, h: 48, tone: "near" }),
        ],
      }),
    ],
  });
}
function yi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx("g", {
        className: "pixel-nordic-far",
        children: e.jsx(xe, {
          base: 132,
          tone: "pixel-nordic-peak-far",
          snowTone: "pixel-nordic-snow-far",
          points: [
            [-8, 60],
            [22, 36],
            [44, 58],
            [70, 30],
            [96, 54],
            [122, 40],
            [148, 62],
            [176, 34],
            [204, 58],
            [232, 38],
            [260, 60],
            [288, 42],
            [312, 58],
            [328, 40],
          ],
        }),
      }),
      e.jsxs("g", {
        className: "pixel-nordic-fog",
        children: [
          e.jsx("ellipse", { cx: "20", cy: "116", rx: "35", ry: "4" }),
          e.jsx("ellipse", { cx: "60", cy: "120", rx: "45", ry: "5" }),
          e.jsx("ellipse", { cx: "130", cy: "118", rx: "55", ry: "5" }),
          e.jsx("ellipse", { cx: "200", cy: "122", rx: "50", ry: "4" }),
          e.jsx("ellipse", { cx: "270", cy: "120", rx: "50", ry: "4" }),
          e.jsx("ellipse", { cx: "310", cy: "124", rx: "30", ry: "3" }),
          e.jsx("ellipse", { cx: "100", cy: "126", rx: "25", ry: "3", opacity: "0.4" }),
          e.jsx("ellipse", { cx: "230", cy: "126", rx: "20", ry: "2", opacity: "0.35" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-mid",
        children: [
          e.jsx(xe, {
            base: 168,
            tone: "pixel-nordic-peak-mid",
            snowTone: "pixel-nordic-snow-mid",
            points: [
              [-10, 110],
              [30, 86],
              [64, 108],
              [104, 80],
              [144, 106],
              [184, 84],
              [224, 110],
              [264, 88],
              [304, 108],
              [330, 96],
            ],
          }),
          e.jsx(p, { x: 20, base: 166, h: 14, tone: "mid" }),
          e.jsx(p, { x: 36, base: 168, h: 11, tone: "mid" }),
          e.jsx(p, { x: 150, base: 167, h: 13, tone: "mid" }),
          e.jsx(p, { x: 284, base: 168, h: 12, tone: "mid" }),
          e.jsx(p, { x: 302, base: 166, h: 14, tone: "mid" }),
        ],
      }),
      e.jsx("rect", {
        className: "pixel-nordic-water",
        x: "0",
        y: "180",
        width: "320",
        height: "20",
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-aurora",
        children: [
          e.jsx("rect", { x: "40", y: "183", width: "80", height: "1" }),
          e.jsx("rect", { x: "120", y: "187", width: "90", height: "1" }),
          e.jsx("rect", { x: "60", y: "192", width: "70", height: "1" }),
          e.jsx("rect", { x: "180", y: "196", width: "60", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-ripples",
        children: [
          e.jsx("rect", { x: "20", y: "186", width: "30", height: "1" }),
          e.jsx("rect", { x: "200", y: "190", width: "40", height: "1" }),
          e.jsx("rect", { x: "120", y: "195", width: "34", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-near",
        children: [
          e.jsx("path", { className: "pixel-nordic-shore-snow", d: "M0 200 V188 H320 V200 Z" }),
          e.jsx(p, { x: 14, base: 188, h: 22, tone: "near" }),
          e.jsx(p, { x: 306, base: 188, h: 24, tone: "near" }),
        ],
      }),
    ],
  });
}
function ji() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx("g", {
        className: "pixel-nordic-far",
        children: e.jsx(xe, {
          base: 92,
          tone: "pixel-nordic-peak-far",
          snowTone: "pixel-nordic-snow-far",
          points: [
            [-8, 84],
            [30, 76],
            [62, 86],
            [96, 74],
            [130, 84],
            [166, 76],
            [202, 86],
            [238, 74],
            [274, 84],
            [310, 78],
            [328, 86],
          ],
        }),
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-moon",
        "aria-hidden": !0,
        children: [
          e.jsx("rect", { x: "232", y: "80", width: "10", height: "2" }),
          e.jsx("rect", { x: "230", y: "82", width: "14", height: "6" }),
          e.jsx("rect", { x: "232", y: "88", width: "10", height: "2" }),
          e.jsx("rect", {
            x: "234",
            y: "84",
            width: "2",
            height: "2",
            fill: "#0a121c",
            opacity: "0.5",
          }),
          e.jsx("rect", {
            x: "238",
            y: "86",
            width: "2",
            height: "2",
            fill: "#0a121c",
            opacity: "0.4",
          }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-fog",
        children: [
          e.jsx("ellipse", { cx: "160", cy: "92", rx: "130", ry: "4" }),
          e.jsx("ellipse", { cx: "90", cy: "96", rx: "70", ry: "3" }),
          e.jsx("ellipse", { cx: "240", cy: "94", rx: "60", ry: "3" }),
        ],
      }),
      e.jsx("rect", {
        className: "pixel-nordic-water",
        x: "0",
        y: "92",
        width: "320",
        height: "108",
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-moon",
        children: [
          e.jsx("rect", { x: "232", y: "98", width: "10", height: "1" }),
          e.jsx("rect", { x: "230", y: "104", width: "14", height: "1" }),
          e.jsx("rect", { x: "234", y: "112", width: "8", height: "1" }),
          e.jsx("rect", { x: "230", y: "122", width: "12", height: "1" }),
          e.jsx("rect", { x: "236", y: "134", width: "7", height: "1" }),
          e.jsx("rect", { x: "232", y: "148", width: "9", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-reflect-aurora",
        children: [
          e.jsx("rect", { x: "40", y: "100", width: "70", height: "1" }),
          e.jsx("rect", { x: "80", y: "108", width: "100", height: "1" }),
          e.jsx("rect", { x: "30", y: "118", width: "80", height: "1" }),
          e.jsx("rect", { x: "110", y: "128", width: "70", height: "1" }),
          e.jsx("rect", { x: "50", y: "140", width: "90", height: "1" }),
          e.jsx("rect", { x: "140", y: "152", width: "60", height: "1" }),
          e.jsx("rect", { x: "20", y: "166", width: "70", height: "1" }),
          e.jsx("rect", { x: "160", y: "178", width: "50", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-ripples",
        children: [
          e.jsx("rect", { x: "10", y: "106", width: "34", height: "1" }),
          e.jsx("rect", { x: "180", y: "116", width: "44", height: "1" }),
          e.jsx("rect", { x: "60", y: "126", width: "38", height: "1" }),
          e.jsx("rect", { x: "250", y: "138", width: "40", height: "1" }),
          e.jsx("rect", { x: "120", y: "150", width: "36", height: "1" }),
          e.jsx("rect", { x: "200", y: "162", width: "44", height: "1" }),
          e.jsx("rect", { x: "40", y: "174", width: "30", height: "1" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-near",
        children: [
          e.jsx("path", {
            className: "pixel-nordic-shore",
            d: "M0 200 V150 H36 L54 142 H88 L104 200 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore-snow",
            d: "M0 154 H34 L52 146 H86 L98 200 H0 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore",
            d: "M320 200 V130 H286 L268 144 H236 L224 200 Z",
          }),
          e.jsx("path", {
            className: "pixel-nordic-shore-snow",
            d: "M320 134 H288 L270 148 H238 L228 200 H320 Z",
          }),
          e.jsx(p, { x: 296, base: 150, h: 42, tone: "near" }),
          e.jsx(p, { x: 278, base: 152, h: 32, tone: "near" }),
          e.jsxs("g", {
            className: "pixel-nordic-rock",
            children: [
              e.jsx("rect", { x: "140", y: "170", width: "16", height: "6" }),
              e.jsx("rect", { x: "142", y: "167", width: "12", height: "3" }),
              e.jsx("rect", {
                className: "pixel-nordic-rock-snow",
                x: "142",
                y: "166",
                width: "11",
                height: "1",
              }),
              e.jsx("rect", { x: "180", y: "178", width: "12", height: "5" }),
              e.jsx("rect", { x: "182", y: "176", width: "8", height: "2" }),
              e.jsx("rect", {
                className: "pixel-nordic-rock-snow",
                x: "182",
                y: "175",
                width: "7",
                height: "1",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function vi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs("g", {
        className: "pixel-nordic-cave-view",
        "aria-hidden": !0,
        children: [
          e.jsx(xe, {
            base: 96,
            tone: "pixel-nordic-peak-far",
            snowTone: "pixel-nordic-snow-far",
            points: [
              [114, 78],
              [130, 64],
              [144, 76],
              [160, 60],
              [176, 74],
              [190, 66],
              [206, 80],
            ],
          }),
          e.jsx("rect", { className: "pixel-nordic-water", x: 116, y: 96, width: 88, height: 84 }),
          e.jsxs("g", {
            className: "pixel-nordic-reflect-aurora",
            children: [
              e.jsx("rect", { x: 122, y: 104, width: 76, height: 1 }),
              e.jsx("rect", { x: 126, y: 116, width: 68, height: 1 }),
              e.jsx("rect", { x: 120, y: 128, width: 80, height: 1 }),
              e.jsx("rect", { x: 130, y: 142, width: 60, height: 1 }),
              e.jsx("rect", { x: 124, y: 158, width: 72, height: 1 }),
            ],
          }),
          e.jsxs("g", {
            className: "pixel-nordic-reflect-moon",
            children: [
              e.jsx("rect", { x: 146, y: 108, width: 14, height: 1 }),
              e.jsx("rect", { x: 148, y: 122, width: 10, height: 1 }),
              e.jsx("rect", { x: 144, y: 138, width: 16, height: 1 }),
            ],
          }),
          e.jsx(p, { x: 126, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 140, base: 95, h: 7, tone: "far" }),
          e.jsx(p, { x: 176, base: 96, h: 8, tone: "far" }),
          e.jsx(p, { x: 192, base: 95, h: 7, tone: "far" }),
        ],
      }),
      e.jsxs("g", {
        className: "pixel-nordic-cave-arch",
        "aria-hidden": !0,
        children: [
          e.jsx("rect", { x: "0", y: "0", width: "320", height: "14", fill: "#030507" }),
          e.jsx("rect", { x: "0", y: "14", width: "320", height: "2", fill: "#060a10" }),
          e.jsx("rect", { x: "0", y: "16", width: "44", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "0", y: "24", width: "24", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "0", y: "30", width: "12", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "44", y: "16", width: "30", height: "10", fill: "#030507" }),
          e.jsx("rect", { x: "50", y: "26", width: "16", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "54", y: "34", width: "8", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "74", y: "16", width: "24", height: "14", fill: "#030507" }),
          e.jsx("rect", { x: "80", y: "30", width: "12", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "82", y: "38", width: "6", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "98", y: "16", width: "18", height: "10", fill: "#030507" }),
          e.jsx("rect", { x: "102", y: "26", width: "10", height: "6", fill: "#060a10" }),
          e.jsx("rect", { x: "204", y: "16", width: "18", height: "10", fill: "#030507" }),
          e.jsx("rect", { x: "208", y: "26", width: "10", height: "6", fill: "#060a10" }),
          e.jsx("rect", { x: "222", y: "16", width: "24", height: "14", fill: "#030507" }),
          e.jsx("rect", { x: "228", y: "30", width: "12", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "232", y: "38", width: "6", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "246", y: "16", width: "30", height: "10", fill: "#030507" }),
          e.jsx("rect", { x: "254", y: "26", width: "16", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "258", y: "34", width: "8", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "276", y: "16", width: "44", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "296", y: "24", width: "24", height: "6", fill: "#030507" }),
          e.jsx("rect", { x: "308", y: "30", width: "12", height: "8", fill: "#030507" }),
          e.jsx("rect", { x: "0", y: "44", width: 116, height: "156", fill: "#060a10" }),
          e.jsx("rect", {
            x: "0",
            y: "44",
            width: 116,
            height: "156",
            fill: "#030507",
            opacity: "0.55",
          }),
          e.jsx("rect", { x: 204, y: "44", width: 116, height: "156", fill: "#060a10" }),
          e.jsx("rect", {
            x: 204,
            y: "44",
            width: 116,
            height: "156",
            fill: "#030507",
            opacity: "0.55",
          }),
          e.jsx("rect", { x: 116, y: "180", width: 88, height: "20", fill: "#030507" }),
          e.jsx("rect", { x: "0", y: "14", width: "320", height: "1", fill: "#0a121c" }),
          e.jsx("rect", { x: 115, y: "44", width: "1", height: "136", fill: "#0a121c" }),
          e.jsx("rect", { x: 204, y: "44", width: "1", height: "136", fill: "#0a121c" }),
          e.jsx("rect", {
            x: "20",
            y: "80",
            width: "14",
            height: "3",
            fill: "#0a121c",
            opacity: "0.6",
          }),
          e.jsx("rect", {
            x: "40",
            y: "120",
            width: "20",
            height: "3",
            fill: "#0a121c",
            opacity: "0.5",
          }),
          e.jsx("rect", {
            x: "10",
            y: "160",
            width: "16",
            height: "3",
            fill: "#0a121c",
            opacity: "0.5",
          }),
          e.jsx("rect", {
            x: "260",
            y: "90",
            width: "18",
            height: "3",
            fill: "#0a121c",
            opacity: "0.6",
          }),
          e.jsx("rect", {
            x: "240",
            y: "130",
            width: "22",
            height: "3",
            fill: "#0a121c",
            opacity: "0.5",
          }),
          e.jsx("rect", {
            x: "280",
            y: "165",
            width: "14",
            height: "3",
            fill: "#0a121c",
            opacity: "0.5",
          }),
        ],
      }),
    ],
  });
}
function wi() {
  return e.jsx("g", {});
}
function Ni({ className: t, parallax: r = !1, mood: a = "gotham", zone: s = "fjord" }) {
  const n = G(),
    i = l.useRef(null),
    c = l.useRef(null),
    o = l.useRef(0),
    x = a === "batcave";
  return (
    l.useEffect(() => {
      const d = c.current;
      if (!d) return;
      const u = window.matchMedia("(min-width: 1024px)"),
        f = () => {
          d.setAttribute("preserveAspectRatio", u.matches ? "xMidYMax slice" : "xMidYMax meet");
        };
      return (f(), u.addEventListener("change", f), () => u.removeEventListener("change", f));
    }, []),
    l.useEffect(() => {
      if (!r || n || x) return;
      const d = i.current;
      if (!d) return;
      let u = 0;
      const f = () => {
          u = 0;
          const g = window.scrollY,
            y = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
            j = Math.min(Math.max(g / Math.min(y * 0.55, 900), 0), 1),
            k = j * j * (3 - 2 * j);
          (d.style.setProperty("--nordic-enter", k.toFixed(4)),
            d.style.setProperty("--nordic-par-sky", `${Math.min(g * 0.02 + k * 4, 18)}px`),
            d.style.setProperty("--nordic-par-far", `${Math.min(g * 0.05 + k * 8, 32)}px`),
            d.style.setProperty("--nordic-par-mid", `${Math.min(g * 0.11 + k * 16, 60)}px`),
            d.style.setProperty("--nordic-par-near", `${Math.min(g * 0.2 + k * 32, 100)}px`));
          const L = Math.min(Math.max(g / y, 0), 1),
            _ = Math.min(4, Math.floor(L * 5));
          o.current !== _ && ((o.current = _), d.setAttribute("data-nordic-section", String(_)));
        },
        h = () => {
          (u && window.cancelAnimationFrame(u), (u = window.requestAnimationFrame(f)));
        };
      return (
        f(),
        window.addEventListener("scroll", h, { passive: !0 }),
        () => {
          (window.removeEventListener("scroll", h), u && window.cancelAnimationFrame(u));
        }
      );
    }, [r, n, x]),
    e.jsxs("div", {
      ref: i,
      className: m(
        "pointer-events-none inset-0 overflow-hidden pixel-nordic-root",
        x ? "pixel-nordic--batcave" : "pixel-nordic--landing",
        r && !n && !x && "pixel-nordic--parallax",
        t ?? "absolute",
      ),
      style: { "--nordic-enter": "0" },
      children: [
        e.jsx("div", { className: "pixel-nordic-sky absolute inset-0" }),
        e.jsx("div", { className: "pixel-nordic-stars absolute inset-0", "aria-hidden": !0 }),
        e.jsxs("div", {
          className: "pointer-events-none absolute inset-0 z-[1]",
          "aria-hidden": !0,
          children: [
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--1" }),
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--2" }),
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--3" }),
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--4" }),
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--5" }),
            e.jsx("span", { className: "pixel-nordic-sparkle pixel-nordic-sparkle--6" }),
          ],
        }),
        e.jsx("div", { className: "pixel-nordic-dither absolute inset-0", "aria-hidden": !0 }),
        e.jsxs("div", {
          className: "pixel-nordic-aurora absolute inset-x-0 top-0 h-[46%]",
          "aria-hidden": !0,
          children: [
            e.jsx("span", { className: "pixel-nordic-aurora__band pixel-nordic-aurora__band--a" }),
            e.jsx("span", { className: "pixel-nordic-aurora__band pixel-nordic-aurora__band--b" }),
            e.jsx("span", { className: "pixel-nordic-aurora__band pixel-nordic-aurora__band--c" }),
          ],
        }),
        e.jsxs("div", {
          className: m(
            "pixel-nordic-moon absolute right-[10%] top-[7%] h-12 w-12 sm:right-[12%] sm:h-14 sm:w-14 lg:h-16 lg:w-16",
            x && "pixel-nordic-moon--veiled",
          ),
          "aria-hidden": !0,
          children: [
            e.jsx("div", {
              className:
                "pixel-nordic-moon-crater absolute left-[20%] top-[22%] h-[18%] w-[18%] rounded-full",
            }),
            e.jsx("div", {
              className:
                "pixel-nordic-moon-crater absolute left-[52%] top-[35%] h-[12%] w-[12%] rounded-full",
            }),
            e.jsx("div", {
              className:
                "pixel-nordic-moon-crater absolute left-[35%] top-[55%] h-[15%] w-[15%] rounded-full",
            }),
            e.jsx("div", {
              className:
                "pixel-nordic-moon-crater absolute left-[60%] top-[60%] h-[10%] w-[10%] rounded-full",
            }),
            e.jsx("div", {
              className:
                "pixel-nordic-moon-crater absolute left-[25%] top-[70%] h-[8%] w-[8%] rounded-full",
            }),
          ],
        }),
        !n &&
          !x &&
          e.jsx("div", {
            className:
              "pixel-nordic-raven-flight absolute left-0 top-[16%] z-[1] h-4 w-6 text-[#05080a] sm:h-5 sm:w-8",
            "aria-hidden": !0,
            children: e.jsx(Vt, {}),
          }),
        !n &&
          !x &&
          e.jsx("div", {
            className:
              "pixel-nordic-raven-flight pixel-nordic-raven-flight--small absolute left-0 top-[8%] z-[1] h-3 w-4 text-[#05080a] opacity-70 sm:h-3.5 sm:w-5",
            "aria-hidden": !0,
            children: e.jsx(Vt, {}),
          }),
        !n &&
          !x &&
          e.jsx("div", {
            className:
              "pixel-nordic-bird-flock absolute left-0 top-[12%] z-[1] h-2 w-6 text-[#05080a] opacity-60 sm:h-2.5 sm:w-8",
            "aria-hidden": !0,
            children: e.jsx(fi, {}),
          }),
        e.jsxs("svg", {
          ref: c,
          className: m(
            "pixel-nordic-scene absolute inset-x-0 bottom-0 w-full",
            x ? "h-[60%] sm:h-[64%] lg:h-[72%]" : "h-[74%] sm:h-[80%] lg:h-[94%] xl:h-full",
          ),
          viewBox: "0 0 320 200",
          preserveAspectRatio: "xMidYMax meet",
          shapeRendering: "crispEdges",
          children: [
            x &&
              e.jsxs("g", {
                className: "pixel-nordic-cave-arch",
                "aria-hidden": !0,
                children: [
                  e.jsx("rect", { x: "0", y: "0", width: "320", height: "14", fill: "#030507" }),
                  e.jsx("rect", { x: "0", y: "14", width: "320", height: "2", fill: "#060a10" }),
                  e.jsx("rect", { x: "0", y: "16", width: "44", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "0", y: "24", width: "24", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "0", y: "30", width: "12", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "44", y: "16", width: "30", height: "10", fill: "#030507" }),
                  e.jsx("rect", { x: "50", y: "26", width: "16", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "54", y: "34", width: "8", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "74", y: "16", width: "24", height: "14", fill: "#030507" }),
                  e.jsx("rect", { x: "80", y: "30", width: "12", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "82", y: "38", width: "6", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "98", y: "16", width: "18", height: "10", fill: "#030507" }),
                  e.jsx("rect", { x: "102", y: "26", width: "10", height: "6", fill: "#060a10" }),
                  e.jsx("rect", { x: "204", y: "16", width: "18", height: "10", fill: "#030507" }),
                  e.jsx("rect", { x: "208", y: "26", width: "10", height: "6", fill: "#060a10" }),
                  e.jsx("rect", { x: "222", y: "16", width: "24", height: "14", fill: "#030507" }),
                  e.jsx("rect", { x: "228", y: "30", width: "12", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "232", y: "38", width: "6", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "246", y: "16", width: "30", height: "10", fill: "#030507" }),
                  e.jsx("rect", { x: "254", y: "26", width: "16", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "258", y: "34", width: "8", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "276", y: "16", width: "44", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "296", y: "24", width: "24", height: "6", fill: "#030507" }),
                  e.jsx("rect", { x: "308", y: "30", width: "12", height: "8", fill: "#030507" }),
                  e.jsx("rect", { x: "0", y: "14", width: "320", height: "1", fill: "#0a121c" }),
                ],
              }),
            e.jsx("g", {
              opacity: s === "fjord" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: gi(),
            }),
            e.jsx("g", {
              opacity: s === "forest" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: bi(),
            }),
            e.jsx("g", {
              opacity: s === "mountains" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: yi(),
            }),
            e.jsx("g", {
              opacity: s === "shore" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: ji(),
            }),
            e.jsx("g", {
              opacity: s === "cave" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: vi(),
            }),
            e.jsx("g", {
              opacity: s === "moon" ? 1 : 0,
              style: { transition: n ? "none" : "opacity 0.6s ease" },
              children: wi(),
            }),
          ],
        }),
        e.jsx("div", {
          className: "pixel-nordic-mist absolute inset-x-0 bottom-0 h-[30%]",
          "aria-hidden": !0,
        }),
        e.jsx("div", { className: "pixel-nordic-scanlines absolute inset-0", "aria-hidden": !0 }),
        e.jsx(mi, { className: "z-[2]" }),
        e.jsx(hi, { className: "z-[3]", density: 800 }),
        e.jsx("div", {
          className: "pixel-nordic-content-veil absolute inset-0 z-[3]",
          "aria-hidden": !0,
        }),
        (x || s === "cave") &&
          e.jsx("div", {
            className: "pixel-nordic-torch-glow absolute inset-x-0 bottom-0 z-[3]",
            "aria-hidden": !0,
          }),
        x &&
          e.jsx("div", {
            className: "pixel-nordic-batcave-focus absolute inset-0 z-[3]",
            "aria-hidden": !0,
          }),
        e.jsx("div", { className: "pixel-nordic-vignette absolute inset-0 z-[3]" }),
      ],
    })
  );
}
const Kt = [
  { x: 4, y: 10, size: "h-3 w-3", float: "login-float-a", glow: !0 },
  { x: 11, y: 22, size: "h-2 w-2", float: "login-float-c" },
  { x: 7, y: 38, size: "h-3.5 w-3.5", float: "login-float-b", glow: !0 },
  { x: 16, y: 52, size: "h-2 w-2", float: "login-float-e" },
  { x: 5, y: 68, size: "h-2.5 w-2.5", float: "login-float-d" },
  { x: 20, y: 82, size: "h-2 w-2", float: "login-float-a" },
  { x: 28, y: 14, size: "h-1.5 w-1.5", float: "login-float-b" },
  { x: 34, y: 30, size: "h-3 w-3", float: "login-float-c", glow: !0 },
  { x: 30, y: 58, size: "h-2 w-2", float: "login-float-d" },
  { x: 38, y: 74, size: "h-1.5 w-1.5", float: "login-float-e" },
  { x: 44, y: 20, size: "h-3.5 w-3.5", float: "login-float-a", glow: !0 },
  { x: 48, y: 46, size: "h-2 w-2", float: "login-float-b" },
  { x: 42, y: 88, size: "h-2.5 w-2.5", float: "login-float-c" },
  { x: 55, y: 12, size: "h-2.5 w-2.5", float: "login-float-e", glow: !0 },
  { x: 62, y: 28, size: "h-2 w-2", float: "login-float-d" },
  { x: 58, y: 44, size: "h-4 w-4", float: "login-float-a", glow: !0 },
  { x: 68, y: 18, size: "h-1.5 w-1.5", float: "login-float-c" },
  { x: 72, y: 36, size: "h-3 w-3", float: "login-float-b", glow: !0 },
  { x: 64, y: 56, size: "h-2 w-2", float: "login-float-e" },
  { x: 76, y: 48, size: "h-3.5 w-3.5", float: "login-float-d", glow: !0 },
  { x: 70, y: 70, size: "h-1.5 w-1.5", float: "login-float-a" },
  { x: 82, y: 22, size: "h-2.5 w-2.5", float: "login-float-c" },
  { x: 88, y: 40, size: "h-2 w-2", float: "login-float-b", glow: !0 },
  { x: 84, y: 62, size: "h-2.5 w-2.5", float: "login-float-e" },
  { x: 92, y: 16, size: "h-1.5 w-1.5", float: "login-float-d" },
  { x: 90, y: 78, size: "h-3.5 w-3.5", float: "login-float-a", glow: !0 },
  { x: 78, y: 86, size: "h-2 w-2", float: "login-float-c" },
  { x: 52, y: 78, size: "h-2.5 w-2.5", float: "login-float-b" },
];
function _i(t, r) {
  return Math.hypot(t.x - r.x, t.y - r.y);
}
function Yt(t, r, a = 0.22) {
  const s = (t.x + r.x) / 2,
    n = (t.y + r.y) / 2,
    i = r.x - t.x,
    c = r.y - t.y,
    o = Math.hypot(i, c) || 1,
    x = s - (c / o) * o * a,
    d = n + (i / o) * o * a;
  return `M ${t.x} ${t.y} Q ${x.toFixed(2)} ${d.toFixed(2)} ${r.x} ${r.y}`;
}
function ki(t, r, a) {
  const s = [],
    n = new Set();
  let i = 0;
  for (let o = 0; o < t.length; o++) {
    const x = t
      .map((d, u) => ({ j: u, d: _i(t[o], d) }))
      .filter((d) => d.j !== o && d.d > 3 && d.d <= r)
      .sort((d, u) => d.d - u.d)
      .slice(0, a);
    for (const d of x) {
      const u = Math.min(o, d.j),
        f = Math.max(o, d.j),
        h = `${u}-${f}`;
      n.has(h) ||
        (n.add(h),
        s.push({
          key: h,
          d: Yt(t[o], t[d.j], 0.18 + (i % 3) * 0.06),
          delay: (i % 8) * 0.9,
          duration: 8 + (i % 5) * 1.2,
          weight: i % 3 === 0 ? "mid" : "soft",
        }),
        i++);
    }
  }
  const c = [
    [0, 15],
    [7, 22],
    [2, 19],
    [11, 25],
    [14, 27],
    [4, 17],
  ];
  for (const [o, x] of c) {
    if (!t[o] || !t[x]) continue;
    const d = `long-${o}-${x}`;
    n.has(d) ||
      (n.add(d),
      s.push({
        key: d,
        d: Yt(t[o], t[x], 0.32),
        delay: 1.8 + i * 0.55,
        duration: 11 + (i % 3),
        weight: "soft",
      }),
      i++);
  }
  return s;
}
function We({
  className: t,
  intensity: r = "full",
  variant: a = "aurora",
  parallax: s = !1,
  mood: n = "nordic",
  zone: i = "fjord",
}) {
  const c = G(),
    o = r === "soft",
    x = l.useMemo(() => ki(Kt, o ? 17 : 20, o ? 1 : 2), [o]),
    d = n === "nordic" ? "gotham" : n;
  return a === "pixel"
    ? e.jsx(Ni, { className: t ?? "absolute inset-0", parallax: s, mood: d, zone: i })
    : e.jsxs("div", {
        "aria-hidden": !0,
        className: m("pointer-events-none absolute inset-0 overflow-hidden", t),
        children: [
          e.jsx("div", {
            className: m(
              "absolute inset-0",
              o
                ? "bg-[radial-gradient(ellipse_120%_90%_at_10%_0%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_55%),radial-gradient(ellipse_90%_80%_at_90%_100%,color-mix(in_oklab,var(--primary-soft)_70%,transparent),transparent_50%),linear-gradient(165deg,color-mix(in_oklab,var(--background)_92%,var(--primary)_8%),var(--background)_45%,color-mix(in_oklab,var(--background)_88%,var(--muted)_12%))]"
                : "bg-[radial-gradient(ellipse_110%_85%_at_8%_-5%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_52%),radial-gradient(ellipse_95%_75%_at_95%_105%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_48%),radial-gradient(ellipse_70%_55%_at_55%_40%,color-mix(in_oklab,var(--muted)_55%,transparent),transparent_65%),linear-gradient(160deg,color-mix(in_oklab,var(--background)_90%,var(--primary)_10%),var(--background)_42%,color-mix(in_oklab,var(--background)_86%,var(--secondary)_14%))]",
            ),
          }),
          e.jsx("div", {
            className: m(
              "absolute -left-[14%] top-[-10%] h-[32rem] w-[32rem] rounded-full blur-3xl",
              o ? "bg-primary/16" : "bg-primary/22 dark:bg-primary/14",
              !c && "login-drift",
            ),
          }),
          e.jsx("div", {
            className: m(
              "absolute -right-[12%] bottom-[-8%] h-[30rem] w-[30rem] rounded-full blur-3xl",
              o ? "bg-primary/10" : "bg-primary/14 dark:bg-primary/10",
              !c && "login-drift-slow",
            ),
          }),
          e.jsx("div", {
            className: m(
              "absolute left-[35%] top-[42%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
              "bg-[color-mix(in_oklab,var(--muted)_70%,var(--primary)_12%)] opacity-60 dark:opacity-40",
              !c && "login-float-d",
            ),
          }),
          e.jsx("div", {
            className: m(
              "absolute right-[18%] top-[18%] h-[16rem] w-[16rem] rounded-full blur-3xl",
              "bg-[color-mix(in_oklab,var(--secondary)_80%,var(--primary)_8%)] opacity-50 dark:bg-primary/8 dark:opacity-50",
              !c && "login-float-b",
            ),
          }),
          e.jsxs("svg", {
            className: m(
              "absolute inset-0 h-full w-full",
              o ? "opacity-[0.22] dark:opacity-[0.26]" : "opacity-[0.28] dark:opacity-[0.32]",
            ),
            viewBox: "0 0 100 100",
            preserveAspectRatio: "none",
            children: [
              e.jsxs("defs", {
                children: [
                  e.jsxs("linearGradient", {
                    id: "login-streak-grad",
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "0%",
                    children: [
                      e.jsx("stop", {
                        offset: "0%",
                        stopColor: "var(--primary)",
                        stopOpacity: "0",
                      }),
                      e.jsx("stop", {
                        offset: "45%",
                        stopColor: "var(--primary)",
                        stopOpacity: "0.35",
                      }),
                      e.jsx("stop", {
                        offset: "55%",
                        stopColor: "var(--primary)",
                        stopOpacity: "0.45",
                      }),
                      e.jsx("stop", {
                        offset: "100%",
                        stopColor: "var(--primary)",
                        stopOpacity: "0",
                      }),
                    ],
                  }),
                  e.jsx("filter", {
                    id: "login-streak-blur-soft",
                    x: "-40%",
                    y: "-40%",
                    width: "180%",
                    height: "180%",
                    children: e.jsx("feGaussianBlur", {
                      in: "SourceGraphic",
                      stdDeviation: "1.15",
                    }),
                  }),
                  e.jsx("filter", {
                    id: "login-streak-blur-heavy",
                    x: "-50%",
                    y: "-50%",
                    width: "200%",
                    height: "200%",
                    children: e.jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "2.1" }),
                  }),
                ],
              }),
              e.jsx("g", {
                filter: "url(#login-streak-blur-heavy)",
                opacity: "0.55",
                children: x.map((u) =>
                  e.jsx(
                    "path",
                    {
                      d: u.d,
                      fill: "none",
                      stroke: "url(#login-streak-grad)",
                      strokeWidth: u.weight === "mid" ? 2.4 : 1.8,
                      strokeLinecap: "round",
                      vectorEffect: "non-scaling-stroke",
                      className: m(!c && "login-atmosphere-streak"),
                      style: c
                        ? void 0
                        : { animationDelay: `${u.delay}s`, animationDuration: `${u.duration}s` },
                    },
                    `haze-${u.key}`,
                  ),
                ),
              }),
              e.jsx("g", {
                filter: "url(#login-streak-blur-soft)",
                opacity: "0.4",
                children: x.map((u) =>
                  e.jsx(
                    "path",
                    {
                      d: u.d,
                      fill: "none",
                      stroke: "url(#login-streak-grad)",
                      strokeWidth: u.weight === "mid" ? 1.1 : 0.75,
                      strokeLinecap: "round",
                      vectorEffect: "non-scaling-stroke",
                      className: m(!c && "login-atmosphere-streak"),
                      style: c
                        ? void 0
                        : {
                            animationDelay: `${u.delay + 0.4}s`,
                            animationDuration: `${u.duration * 1.1}s`,
                          },
                    },
                    u.key,
                  ),
                ),
              }),
            ],
          }),
          e.jsx("div", {
            className: "absolute inset-0",
            children: Kt.map((u, f) =>
              e.jsx(
                "span",
                {
                  className: m(
                    "login-atmosphere-dot absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                    u.size,
                    !c && u.float,
                    u.glow && "login-atmosphere-dot-glow",
                    o && "opacity-60",
                  ),
                  style: { left: `${u.x}%`, top: `${u.y}%` },
                },
                f,
              ),
            ),
          }),
          e.jsx("div", { className: "login-atmosphere-grain absolute inset-0" }),
          e.jsx("div", {
            className: m(
              "absolute inset-0",
              o
                ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_oklab,var(--background)_62%,transparent)_100%)]"
                : "bg-[radial-gradient(ellipse_65%_60%_at_72%_45%,transparent_16%,color-mix(in_oklab,var(--background)_52%,transparent)_92%)]",
            ),
          }),
        ],
      });
}
const ct = ["center", "left", "center", "right", "center", "left", "right"];
function Si({ look: t }) {
  const r = t === "left" ? 4 : t === "right" ? 6 : 5,
    a = t === "left" ? 1 : t === "right" ? 3 : 2;
  return e.jsxs("svg", {
    viewBox: "0 0 16 14",
    shapeRendering: "crispEdges",
    className: "h-full w-full",
    "aria-hidden": !0,
    children: [
      e.jsxs("g", {
        fill: "currentColor",
        children: [
          e.jsx("rect", { x: "5", y: "1", width: "3", height: "1" }),
          e.jsx("rect", { x: "4", y: "2", width: "5", height: "1" }),
          e.jsx("rect", { x: "2", y: "3", width: "7", height: "1" }),
          e.jsx("rect", { x: "4", y: "4", width: "6", height: "1" }),
          e.jsx("rect", { x: "5", y: "5", width: "6", height: "1" }),
          e.jsx("rect", { x: "5", y: "6", width: "8", height: "1" }),
          e.jsx("rect", { x: "4", y: "7", width: "10", height: "1" }),
          e.jsx("rect", { x: "3", y: "8", width: "11", height: "1" }),
          e.jsx("rect", { x: "3", y: "9", width: "9", height: "1" }),
          e.jsx("rect", { x: "4", y: "10", width: "6", height: "1" }),
          e.jsx("rect", { x: "5", y: "11", width: "4", height: "1" }),
          e.jsx("rect", { x: "6", y: "12", width: "1", height: "1" }),
          e.jsx("rect", { x: "8", y: "12", width: "1", height: "1" }),
          e.jsx("rect", { x: "5", y: "13", width: "2", height: "1" }),
          e.jsx("rect", { x: "8", y: "13", width: "2", height: "1" }),
        ],
      }),
      e.jsx("rect", {
        x: a,
        y: "4",
        width: "2",
        height: "1",
        fill: "color-mix(in oklab, var(--primary) 75%, #fbbf24)",
      }),
      e.jsx("rect", { x: r, y: "3", width: "1", height: "1", fill: "var(--primary)" }),
    ],
  });
}
function zt({ className: t, featured: r = !0 }) {
  const a = G(),
    [s, n] = l.useState(0),
    i = a ? "center" : ct[s % ct.length];
  return (
    l.useEffect(() => {
      if (a) return;
      const c = window.setInterval(() => {
        n((o) => (o + 1) % ct.length);
      }, 900);
      return () => window.clearInterval(c);
    }, [a]),
    e.jsxs("div", {
      className: m("pixel-raven relative shrink-0", r && "pixel-raven--featured", t),
      "aria-hidden": !0,
      children: [
        e.jsx("div", {
          className: "pixel-raven__sprite text-foreground",
          children: e.jsx(Si, { look: i }),
        }),
        r && e.jsx("span", { className: "pixel-raven__pedestal" }),
      ],
    })
  );
}
function Ot({ centered: t, className: r, label: a = "Cargando harness…" }) {
  return e.jsxs("div", {
    className: m("pixel-boot", t && "mx-auto items-center", r),
    role: "status",
    "aria-live": "polite",
    "aria-busy": "true",
    "aria-label": a,
    children: [
      e.jsxs("div", {
        className: m("flex items-end gap-3", t && "justify-center"),
        children: [
          e.jsx(zt, { featured: !0, className: "h-12 w-14 sm:h-14 sm:w-16" }),
          e.jsx("p", {
            className: "pixel-font text-[1.3rem] text-foreground sm:text-[1.55rem]",
            children: "MUNINN",
          }),
        ],
      }),
      e.jsx("div", {
        className: "pixel-boot__bar",
        "aria-hidden": !0,
        children: e.jsx("span", {}),
      }),
      e.jsx("p", { className: "pixel-boot__label", children: a }),
    ],
  });
}
function Li() {
  return e.jsxs("div", {
    className: "login-pixel relative min-h-dvh overflow-hidden bg-background",
    children: [
      e.jsx(We, { intensity: "full", variant: "pixel" }),
      e.jsx("div", {
        className: "relative z-[1] flex min-h-dvh items-center justify-center px-6",
        children: e.jsx(Ot, { centered: !0 }),
      }),
    ],
  });
}
class Wr extends l.Component {
  state = { error: null };
  static getDerivedStateFromError(r) {
    return { error: r };
  }
  componentDidCatch(r, a) {
    console.error("[ErrorBoundary]", r, a.componentStack);
  }
  handleReload = () => {
    window.location.reload();
  };
  handleReset = () => {
    this.setState({ error: null });
  };
  render() {
    return this.state.error
      ? e.jsxs("div", {
          className:
            "flex min-h-[50dvh] flex-col items-center justify-center gap-4 px-6 py-12 text-center",
          children: [
            e.jsxs("div", {
              className: "space-y-2 max-w-md",
              children: [
                e.jsx("h2", {
                  className: "text-lg font-semibold tracking-tight",
                  children: this.props.title ?? "Algo salió mal",
                }),
                e.jsx("p", {
                  className: "text-sm text-muted-foreground",
                  children:
                    "La interfaz encontró un error inesperado. Puedes reintentar o recargar la página.",
                }),
                null,
              ],
            }),
            e.jsxs("div", {
              className: "flex flex-wrap items-center justify-center gap-2",
              children: [
                e.jsx(ce, {
                  type: "button",
                  variant: "outline",
                  onClick: this.handleReset,
                  children: "Reintentar",
                }),
                e.jsx(ce, { type: "button", onClick: this.handleReload, children: "Recargar" }),
              ],
            }),
          ],
        })
      : this.props.children;
  }
}
function Ei(t = {}) {
  const {
    immediate: r = !1,
    onNeedReload: a,
    onNeedRefresh: s,
    onOfflineReady: n,
    onRegistered: i,
    onRegisteredSW: c,
    onRegisterError: o,
  } = t;
  let x, d, u;
  const f = async (g = !0) => {
    (await d, u?.());
  };
  async function h() {
    if ("serviceWorker" in navigator) {
      if (
        ((x = await A(async () => {
          const { Workbox: g } = await import("./workbox-window.prod.es5-BBnX5xw4.js");
          return { Workbox: g };
        }, [])
          .then(({ Workbox: g }) => new g("/sw.js", { scope: "/", type: "classic" }))
          .catch((g) => {
            o?.(g);
          })),
        !x)
      )
        return;
      u = () => {
        x?.messageSkipWaiting();
      };
      {
        let g = !1;
        const y = () => {
          ((g = !0),
            x?.addEventListener("controlling", (j) => {
              j.isUpdate && (a ? a() : window.location.reload());
            }),
            s?.());
        };
        (x.addEventListener("installed", (j) => {
          typeof j.isUpdate > "u"
            ? typeof j.isExternal < "u" && j.isExternal
              ? y()
              : !g && n?.()
            : j.isUpdate || n?.();
        }),
          x.addEventListener("waiting", y));
      }
      x.register({ immediate: r })
        .then((g) => {
          c ? c("/sw.js", g) : i?.(g);
        })
        .catch((g) => {
          o?.(g);
        });
    }
  }
  return ((d = h()), f);
}
function Ai() {
  return (
    l.useEffect(() => {
      const t = Ei({
        immediate: !0,
        onNeedRefresh() {
          Wa("Nueva versión disponible", {
            description: "Recarga para usar la última versión de la app.",
            duration: 1 / 0,
            action: {
              label: "Recargar",
              onClick: () => {
                t(!0);
              },
            },
          });
        },
      });
    }, []),
    null
  );
}
const Ri = ({ ...t }) => {
    const { resolved: r } = pi();
    return e.jsx(qa, {
      theme: r,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      },
      ...t,
    });
  },
  Me = {
    unifiedConversations: ["unified-conversations"],
    conversations: ["conversations"],
    workPlans: ["work-plans"],
    workflowExecutions: ["workflow-executions"],
  };
function Pi(t) {
  return null;
}
function Mi(t, r) {
  switch (r.type) {
    case "conversation.updated":
    case "conversation.message":
      (t.invalidateQueries({ queryKey: [...Me.unifiedConversations] }),
        t.invalidateQueries({ queryKey: [...Me.conversations] }));
      break;
    case "work_plan.status":
    case "work_item.status":
      t.invalidateQueries({ queryKey: [...Me.workPlans] });
      break;
    case "workflow_execution.progress":
      t.invalidateQueries({ queryKey: [...Me.workflowExecutions] });
      break;
  }
}
const Ci = l.createContext({ enabled: !1, status: "off", lastEventAt: null });
function Ii({ children: t }) {
  const r = vt(),
    a = Ua(),
    s = l.useMemo(() => Pi(), [a]),
    [n, i] = l.useState(s ? "connecting" : "off"),
    [c, o] = l.useState(null),
    x = l.useRef(null),
    d = l.useCallback(
      (f) => {
        (o(f.ts || new Date().toISOString()), Mi(r, f));
      },
      [r],
    );
  l.useEffect(() => {
    if (!s) {
      i("off");
      return;
    }
    let f = !1;
    i("connecting");
    try {
      const h = new WebSocket(s);
      return (
        (x.current = h),
        (h.onopen = () => {
          f || i("open");
        }),
        (h.onclose = () => {
          f || i("closed");
        }),
        (h.onerror = () => {
          f || i("error");
        }),
        (h.onmessage = (g) => {
          try {
            const y = JSON.parse(String(g.data));
            y && typeof y.type == "string" && d(y);
          } catch {}
        }),
        () => {
          ((f = !0), h.close(), (x.current = null));
        }
      );
    } catch {
      i("error");
      return;
    }
  }, [s, d]);
  const u = l.useMemo(() => ({ enabled: !!s, status: n, lastEventAt: c }), [s, n, c]);
  return e.jsx(Ci.Provider, { value: u, children: t });
}
const zi = {
  instagram: Ya,
  facebook: Ka,
  whatsapp: Ge,
  youtube: Va,
  twitter: Ft,
  x: Ft,
  linkedin: Ga,
  web: mt,
  website: mt,
  tiktok: Ne,
  other: Ne,
};
function qr({ links: t, className: r }) {
  const a = t.filter((s) => s.enabled !== !1 && !!s.url?.trim());
  return a.length === 0
    ? null
    : e.jsx("nav", {
        "aria-label": "Redes sociales",
        className: m("flex flex-wrap items-center justify-center gap-2", r),
        children: a.map((s, n) => {
          const i = (s.icon || "web").toLowerCase().trim(),
            c = zi[i] || mt,
            o = s.name?.trim() || i;
          return e.jsx(
            "a",
            {
              href: s.url,
              target: "_blank",
              rel: "noopener noreferrer",
              title: o,
              "aria-label": o,
              className: m(
                "inline-flex h-9 w-9 items-center justify-center rounded-full",
                "border border-border/60 bg-card/60 text-muted-foreground",
                "transition-colors hover:border-primary/40 hover:text-primary",
              ),
              children: e.jsx(c, { className: "h-4 w-4", "aria-hidden": !0 }),
            },
            `${s.url}-${n}`,
          );
        }),
      });
}
const qe = "muninn-live-demo",
  Oi = {
    bot: [
      "....##....",
      "....##....",
      ".########.",
      ".########.",
      ".##.##.##.",
      ".########.",
      ".##....##.",
      ".########.",
      "..........",
      "..##..##..",
    ],
    soul: [
      "..#####...",
      "..######..",
      "..######..",
      "..#....#..",
      "..######..",
      "..#....#..",
      "..######..",
      "..######..",
      "..######..",
      "..........",
    ],
    rules: [
      "##..######",
      "##..######",
      "..........",
      "##..######",
      "##..######",
      "..........",
      "##..######",
      "##..######",
      "..........",
      "..........",
    ],
    hammer: [
      "..######..",
      "..######..",
      "..######..",
      "....##....",
      "....##....",
      "....##....",
      "....##....",
      "....##....",
      "..........",
      "..........",
    ],
    book: [
      ".#####.##.",
      ".#####.##.",
      ".#####.##.",
      ".########.",
      ".########.",
      ".########.",
      ".########.",
      ".########.",
      ".########.",
      "..........",
    ],
    clock: [
      "..######..",
      ".########.",
      ".####.###.",
      ".####.###.",
      ".####.###.",
      ".####...#.",
      ".########.",
      ".########.",
      "..######..",
      "..........",
    ],
    spark: [
      "..........",
      "....##....",
      "....##....",
      ".########.",
      ".########.",
      "....##....",
      "....##....",
      "..........",
      "..........",
      "..........",
    ],
    chat: [
      ".########.",
      ".########.",
      ".########.",
      ".##.#.#.#.",
      ".########.",
      ".########.",
      "..###.....",
      "..##......",
      "..........",
      "..........",
    ],
    flow: [
      "...####...",
      "...####...",
      "....##....",
      ".########.",
      "..#....#..",
      ".###..###.",
      ".###..###.",
      ".###..###.",
      "..........",
      "..........",
    ],
    gear: [
      "....##....",
      ".#..##..#.",
      "..######..",
      "..##..##..",
      "####..####",
      "..##..##..",
      "..######..",
      ".#..##..#.",
      "....##....",
      "..........",
    ],
    play: [
      "..........",
      "..##......",
      "..####....",
      "..######..",
      "..#######.",
      "..######..",
      "..####....",
      "..##......",
      "..........",
      "..........",
    ],
    pause: [
      "..........",
      "..##..##..",
      "..##..##..",
      "..##..##..",
      "..##..##..",
      "..##..##..",
      "..##..##..",
      "..##..##..",
      "..........",
      "..........",
    ],
    chevronLeft: [
      "..........",
      ".....##...",
      "....##....",
      "...##.....",
      "..##......",
      "...##.....",
      "....##....",
      ".....##...",
      "..........",
      "..........",
    ],
    chevronRight: [
      "..........",
      "...##.....",
      "....##....",
      ".....##...",
      "......##..",
      ".....##...",
      "....##....",
      "...##.....",
      "..........",
      "..........",
    ],
    eye: [
      "..........",
      "..######..",
      ".##....##.",
      ".##.##.##.",
      ".##.##.##.",
      ".##....##.",
      "..######..",
      "..........",
      "..........",
      "..........",
    ],
    eyeOff: [
      "##........",
      ".##.#####.",
      "..####.##.",
      ".##.##.##.",
      ".##.##.##.",
      ".##.####..",
      ".#####.##.",
      "........##",
      "..........",
      "..........",
    ],
    hand: [
      "....##....",
      "...####...",
      "...####...",
      "...####.#.",
      ".#.#######",
      ".#########",
      "..########",
      "...#######",
      "....#####.",
      "..........",
    ],
  };
function B({ icon: t, className: r }) {
  const a = Oi[t];
  return e.jsx("svg", {
    viewBox: `0 0 ${a[0].length} ${a.length}`,
    shapeRendering: "crispEdges",
    className: m("shrink-0", r),
    "aria-hidden": !0,
    children: a.flatMap((s, n) =>
      [...s].map((i, c) =>
        i === "#"
          ? e.jsx("rect", { x: c, y: n, width: 1, height: 1, fill: "currentColor" }, `${c}-${n}`)
          : null,
      ),
    ),
  });
}
const Ti = {
    agent: "bot",
    soul: "soul",
    rules: "rules",
    skill: "hammer",
    knowledge: "book",
    cron: "clock",
    result: "spark",
  },
  $i = {
    agent: "border-primary/50 bg-primary/15 text-foreground",
    soul: "border-border/60 bg-secondary/80 text-foreground",
    rules: "border-border/60 bg-background text-muted-foreground",
    skill: "border-border/60 bg-secondary/70 text-foreground",
    knowledge: "border-primary/40 bg-primary/10 text-foreground",
    cron: "border-primary/45 bg-primary/12 text-primary",
    result: "border-primary/50 bg-primary/18 text-primary",
  },
  Di = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.28, ease: "linear" },
  };
function Bi({ className: t, liveFocusToken: r = 0, demoOnly: a = !1 }) {
  const s = G(),
    n = l.useId(),
    i = l.useRef(null),
    c = l.useRef(null),
    [o, x] = l.useState(0),
    [d, u] = l.useState(!1),
    [f, h] = l.useState(!1),
    [g, y] = l.useState(!1),
    [j, k] = l.useState(""),
    [L, _] = l.useState(!1),
    [N, S] = l.useState([
      { id: "welcome", role: "system", text: "Sandbox local · escribe vacaciones, ticket o cron" },
    ]),
    P = d || f || g,
    M = je[o] ?? je[0],
    H = nt.indexOf(M.stage),
    O = je.length - 1;
  l.useEffect(() => {
    if (s) {
      (x(O), u(!0));
      return;
    }
    if (P) return;
    const v = window.setInterval(() => {
      x((D) => (D + 1) % je.length);
    }, En);
    return () => window.clearInterval(v);
  }, [s, P, O]);
  const C = () => {
    (y(!0),
      u(!0),
      window.setTimeout(() => i.current?.focus(), 80),
      document.getElementById("live")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  (l.useEffect(() => {
    r > 0 && C();
  }, [r]),
    l.useEffect(() => {
      const v = () => C();
      return (window.addEventListener(qe, v), () => window.removeEventListener(qe, v));
    }, []),
    l.useEffect(() => {
      c.current?.scrollIntoView({ block: "nearest" });
    }, [N, L]));
  const b = () => {
      (y(!1), u(!0), x((v) => (v <= 0 ? O : v - 1)));
    },
    R = () => {
      (y(!1), u(!0), x((v) => (v >= O ? 0 : v + 1)));
    },
    T = (v) => {
      (y(!1), u(!0), x(v));
    },
    F = (v) => {
      if (!v) return;
      const D = nt.indexOf(v);
      D >= 0 && x(D);
    },
    E = () => {
      const v = j.trim();
      if (!v || L) return;
      k("");
      const D = `u-${Date.now()}`;
      (S((ee) => [...ee, { id: D, role: "user", text: v }]), _(!0));
      const U = Pn(v);
      F(U.stageHint);
      const V = () => {
        const ee = [];
        (U.think && ee.push({ id: `t-${Date.now()}`, role: "think", text: U.think }),
          U.system && ee.push({ id: `s-${Date.now()}`, role: "system", text: U.system }),
          ee.push({ id: `a-${Date.now()}`, role: "agent", text: U.agent }),
          S((Qe) => [...Qe, ...ee]),
          _(!1));
      };
      s ? V() : window.setTimeout(V, 480);
    },
    $ = g ? N : M.messages.map((v, D) => ({ ...v, id: `demo-${o}-${D}` }));
  return e.jsxs(e.Fragment, {
    children: [
      !a &&
        e.jsxs("div", {
          className: "mb-2 flex flex-wrap items-center justify-between gap-2",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                e.jsx("span", {
                  className:
                    "pixel-font border-2 border-primary/50 bg-primary/15 px-2 py-0.5 text-[8px] uppercase text-primary",
                  children: "Simulación",
                }),
                !g &&
                  e.jsxs("button", {
                    type: "button",
                    onClick: C,
                    className:
                      "pixel-font inline-flex items-center gap-1.5 border-2 border-border/60 bg-card px-2 py-1 text-[8px] uppercase text-foreground hover:border-primary/55 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    children: [e.jsx(B, { icon: "play", className: "h-3 w-3" }), Sn],
                  }),
                g &&
                  e.jsx("button", {
                    type: "button",
                    onClick: () => y(!1),
                    className:
                      "pixel-font text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    children: "← Tour guiado",
                  }),
              ],
            }),
            !s &&
              !g &&
              e.jsxs("div", {
                className: "flex items-center gap-1",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: b,
                    className:
                      "inline-flex h-9 w-9 items-center justify-center border-2 border-border/55 bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-7 sm:w-7",
                    "aria-label": "Paso anterior",
                    children: e.jsx(B, { icon: "chevronLeft", className: "h-3.5 w-3.5" }),
                  }),
                  e.jsxs("button", {
                    type: "button",
                    onClick: () => u((v) => !v),
                    className:
                      "pixel-font inline-flex h-9 items-center gap-1.5 border-2 border-border/55 bg-background px-2.5 text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-7 sm:px-2",
                    "aria-label": P ? "Reanudar" : "Pausar",
                    children: [
                      e.jsx(B, { icon: P ? "play" : "pause", className: "h-3 w-3" }),
                      P ? "Reanudar" : "Pausar",
                    ],
                  }),
                ],
              }),
          ],
        }),
      !s &&
        !g &&
        e.jsxs("div", {
          className: "flex items-center justify-center gap-1 py-2",
          children: [
            e.jsx("button", {
              type: "button",
              onClick: b,
              className:
                "inline-flex h-8 w-8 items-center justify-center border border-border/55 bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "aria-label": "Paso anterior",
              children: e.jsx(B, { icon: "chevronLeft", className: "h-3 w-3" }),
            }),
            e.jsxs("button", {
              type: "button",
              onClick: () => u((v) => !v),
              className:
                "pixel-font inline-flex h-8 items-center gap-1 border border-border/55 bg-background px-2 text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "aria-label": d ? "Reanudar" : "Pausar",
              children: [
                e.jsx(B, { icon: d ? "play" : "pause", className: "h-3 w-3" }),
                d ? "Play" : "Pausa",
              ],
            }),
            e.jsx("button", {
              type: "button",
              onClick: R,
              className:
                "inline-flex h-8 w-8 items-center justify-center border border-border/55 bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "aria-label": "Paso siguiente",
              children: e.jsx(B, { icon: "chevronRight", className: "h-3 w-3" }),
            }),
          ],
        }),
      e.jsxs("div", {
        className: "pixel-panel overflow-hidden border-2 border-border/55 bg-card",
        children: [
          e.jsxs("div", {
            className:
              "space-y-2 border-b-2 border-border/60 px-3 py-2 sm:space-y-2.5 sm:px-3.5 sm:py-2.5",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  e.jsx("span", { className: "h-2 w-2 bg-muted-foreground/40" }),
                  e.jsx("span", { className: "h-2 w-2 bg-muted-foreground/30" }),
                  e.jsx("span", { className: "h-2 w-2 bg-muted-foreground/30" }),
                  g
                    ? e.jsx("span", {
                        className: "pixel-font ml-auto text-[8px] uppercase text-primary",
                        children: "En vivo",
                      })
                    : P &&
                      !s &&
                      e.jsx("span", {
                        className: "pixel-font ml-auto text-[7px] uppercase text-primary/80",
                        children: "Pausado",
                      }),
                ],
              }),
              e.jsx("div", {
                className: "flex flex-wrap items-center gap-1",
                children: nt.map((v, D) => {
                  const U = D < H,
                    V = D === H;
                  return e.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1",
                      children: [
                        D > 0 &&
                          e.jsx("span", {
                            className: m(
                              "mx-0.5 text-[9px]",
                              D <= H ? "text-primary/70" : "text-muted-foreground/35",
                            ),
                            children: "→",
                          }),
                        e.jsxs("button", {
                          type: "button",
                          onClick: () => T(D),
                          className: m(
                            "pixel-font border-2 px-1.5 py-0.5 text-[8px] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            U &&
                              !V &&
                              "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15",
                            V && "border-primary/55 bg-primary/20 text-primary",
                            !U &&
                              !V &&
                              "border-transparent text-muted-foreground/45 hover:text-muted-foreground",
                          ),
                          children: [
                            e.jsx("span", { className: "sm:hidden", children: v.charAt(0) }),
                            e.jsx("span", { className: "hidden sm:inline", children: v }),
                          ],
                        }),
                      ],
                    },
                    v,
                  );
                }),
              }),
            ],
          }),
          e.jsxs("div", {
            className:
              "grid grid-cols-1 gap-0 sm:h-[22rem] sm:grid-cols-[1.05fr_0.95fr] max-sm:max-h-[70vh] max-sm:overflow-y-auto",
            children: [
              e.jsx(ue, {
                mode: "wait",
                initial: !1,
                children: e.jsxs(
                  I.div,
                  {
                    className:
                      "flex min-h-[8rem] flex-col gap-2 overflow-hidden border-b-2 border-border/60 p-3 sm:border-b-0 sm:border-r-2",
                    ...(s ? {} : Di),
                    children: [
                      e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          e.jsx("p", {
                            className: "pixel-display text-[15px] font-semibold text-foreground",
                            children: g ? "Sandbox · pregunta al agente" : M.title,
                          }),
                          e.jsx("p", {
                            className:
                              "pixel-display text-[13px] leading-relaxed text-muted-foreground",
                            children: g
                              ? "Respuestas preescritas según la intención. Muestra cómo el harness elige RAG, helpers o cron."
                              : M.detail,
                          }),
                        ],
                      }),
                      !g &&
                        e.jsx("ul", {
                          className: "mt-1 flex flex-wrap gap-1.5",
                          children: M.nodes.map((v) =>
                            e.jsxs(
                              "li",
                              {
                                className: m(
                                  "pixel-display inline-flex items-center gap-1.5 border-2 px-2 py-1 text-[12px]",
                                  $i[v.kind],
                                ),
                                children: [
                                  e.jsx(B, {
                                    icon: Ti[v.kind],
                                    className: "h-3.5 w-3.5 shrink-0 opacity-90",
                                  }),
                                  e.jsx("span", { children: v.label }),
                                ],
                              },
                              v.id,
                            ),
                          ),
                        }),
                      g &&
                        e.jsxs("form", {
                          className: "mt-auto flex gap-2 pt-2",
                          onSubmit: (v) => {
                            (v.preventDefault(), E());
                          },
                          children: [
                            e.jsx("label", {
                              htmlFor: n,
                              className: "sr-only",
                              children: "Mensaje al agente (simulación)",
                            }),
                            e.jsx("input", {
                              ref: i,
                              id: n,
                              value: j,
                              onChange: (v) => k(v.target.value),
                              placeholder: "Ej: ¿cuántos días de vacaciones?",
                              disabled: L,
                              className:
                                "pixel-display min-w-0 flex-1 border-2 border-border/60 bg-background px-2.5 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            }),
                            e.jsx("button", {
                              type: "submit",
                              disabled: L || !j.trim(),
                              className:
                                "pixel-font shrink-0 border-2 border-primary bg-primary px-3 py-2 text-[9px] uppercase text-primary-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              children: "Enviar",
                            }),
                          ],
                        }),
                      !g &&
                        e.jsxs("p", {
                          className:
                            "pixel-font mt-auto pt-2 text-[8px] uppercase text-muted-foreground",
                          children: [
                            "Paso ",
                            o + 1,
                            "/",
                            je.length,
                            !P &&
                              !s &&
                              e.jsx("span", {
                                className: "ml-1.5 inline-block animate-pulse text-primary",
                                children: "■",
                              }),
                          ],
                        }),
                    ],
                  },
                  `left-${o}-${g ? "live" : "tour"}`,
                ),
              }),
              e.jsxs("div", {
                className: "flex min-h-[8rem] flex-col gap-2 overflow-hidden p-3 sm:min-h-[12rem]",
                children: [
                  e.jsx("p", {
                    className: "pixel-font text-[8px] uppercase text-muted-foreground",
                    children: "Conversación",
                  }),
                  e.jsxs("div", {
                    className: "flex flex-1 flex-col gap-2 overflow-y-auto",
                    children: [
                      e.jsx(ue, {
                        mode: "popLayout",
                        initial: !1,
                        children: $.map((v) =>
                          e.jsxs(
                            I.div,
                            {
                              layout: !s,
                              initial: s ? !1 : { opacity: 0, y: 8, filter: "blur(2px)" },
                              animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                              exit: { opacity: 0, y: -6, filter: "blur(2px)" },
                              transition: { duration: 0.35, ease: [0.45, 0, 0.2, 1] },
                              className: m(
                                "pixel-display max-w-[98%] border-2 px-2.5 py-1.5 text-[13px] leading-snug",
                                v.role === "user" &&
                                  "self-end border-border/50 bg-secondary/80 text-foreground",
                                v.role === "agent" &&
                                  "self-start border-primary/35 bg-primary/15 text-foreground",
                                v.role === "system" &&
                                  "self-start border-border/50 bg-transparent text-[12px] text-muted-foreground",
                                v.role === "think" &&
                                  "self-start border-dashed border-primary/40 bg-primary/5 text-[12px] text-muted-foreground",
                              ),
                              children: [
                                v.role === "think" &&
                                  e.jsx("span", {
                                    className:
                                      "pixel-font mb-0.5 block text-[7px] uppercase text-primary/80",
                                    children: "Razona",
                                  }),
                                v.text,
                              ],
                            },
                            v.id,
                          ),
                        ),
                      }),
                      L &&
                        e.jsx("p", {
                          className: "pixel-font text-[8px] uppercase text-primary",
                          children: "Pensando…",
                        }),
                      e.jsx("div", { ref: c }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Fi({ onClick: t, className: r }) {
  return e.jsx("button", {
    type: "button",
    onClick: t,
    className: m(
      "pixel-harness-hand ml-1.5 inline-flex h-6 w-6 cursor-pointer items-center justify-center align-middle",
      "border-2 border-primary/55 bg-primary/15 text-primary",
      "hover:bg-primary/25 hover:border-primary",
      "active:translate-x-px active:translate-y-px",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      r,
    ),
    "aria-label": "¿Qué es un harness?",
    title: "¿Qué es un harness?",
    children: e.jsx(B, { icon: "hand", className: "h-4 w-4" }),
  });
}
const Hi = {
    soul: "soul",
    rules: "rules",
    helpers: "hammer",
    rag: "book",
    model: "bot",
    cron: "clock",
  },
  Wi = {
    soul: "text-primary border-primary/45",
    rules: "text-foreground border-border/70",
    helpers: "text-foreground border-border/70",
    rag: "text-primary border-primary/55",
    model: "text-primary border-primary/40",
    cron: "text-foreground border-border/70",
  };
function qi({ children: t, delayMs: r = 0, pop: a = !1, className: s, as: n = "div" }) {
  const i = G();
  return e.jsx(n, {
    className: m(i ? void 0 : a ? "pixel-enter-pop" : "pixel-enter", s),
    style: i ? void 0 : { "--pixel-delay": `${r}ms` },
    children: t,
  });
}
function Ui({ centered: t, brand: r }) {
  const a = G(),
    [s, n] = l.useState(!1);
  return e.jsx("div", {
    className: m("w-full max-w-lg", t && "mx-auto"),
    children: e.jsx(ue, {
      mode: "wait",
      initial: !1,
      children: s
        ? e.jsx(
            I.div,
            {
              className: m(t && "text-center"),
              initial: a ? !1 : { opacity: 0 },
              animate: { opacity: 1 },
              exit: a ? void 0 : { opacity: 0 },
              transition: { duration: 0.15, ease: "linear" },
              children: e.jsxs("div", {
                className: "pixel-harness-box space-y-2.5 text-left",
                children: [
                  e.jsxs("div", {
                    className: "flex items-start justify-between gap-2",
                    children: [
                      e.jsx("p", {
                        className: "pixel-font text-[9px] uppercase text-primary",
                        children: "¿Qué es un harness?",
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => n(!1),
                        className:
                          "pixel-font shrink-0 text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        children: "← Volver",
                      }),
                    ],
                  }),
                  e.jsx("p", {
                    className: "pixel-display text-[13px] leading-relaxed text-foreground",
                    children: wn,
                  }),
                  e.jsxs("a", {
                    href: He.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className:
                      "pixel-font inline-block text-[8px] uppercase text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    children: ["Ref · ", He.label],
                  }),
                ],
              }),
            },
            "harness",
          )
        : e.jsxs(
            I.div,
            {
              className: m("login-pixel-readout space-y-2.5", t && "text-center"),
              initial: a ? !1 : { opacity: 0 },
              animate: { opacity: 1 },
              exit: a ? void 0 : { opacity: 0 },
              transition: { duration: 0.15, ease: "linear" },
              children: [
                r &&
                  e.jsxs("div", {
                    className: m(
                      "flex items-end gap-2 border-b-2 border-border/40 pb-1.5",
                      t && "justify-center",
                    ),
                    children: [
                      e.jsx(zt, { featured: !0, className: "h-7 w-8 sm:h-8 sm:w-9" }),
                      e.jsx("p", {
                        className:
                          "pixel-font text-[0.95rem] leading-none text-foreground sm:text-[1.05rem]",
                        children: "MUNINN",
                      }),
                    ],
                  }),
                e.jsxs("h1", {
                  className: m(
                    "pixel-display text-[1.2rem] font-semibold leading-[1.25] text-foreground sm:text-[1.35rem]",
                    t && "px-1",
                  ),
                  children: [jn, e.jsx(Fi, { onClick: () => n(!0) })],
                }),
                e.jsx("p", {
                  className: m(
                    "pixel-display text-[13px] leading-relaxed text-muted-foreground",
                    t && "px-2",
                  ),
                  children: vn,
                }),
              ],
            },
            "pitch",
          ),
    }),
  });
}
function Gi({ className: t }) {
  return e.jsx("ul", {
    className: m("grid grid-cols-2 gap-2", t),
    children: kn.map((r, a) =>
      e.jsx(
        qi,
        {
          as: "li",
          delayMs: 60 + 50 * a,
          pop: !0,
          children: e.jsxs("div", {
            className: m(
              "flex h-full min-h-[3rem] items-start gap-2 border-2 bg-card px-2.5 py-2",
              Wi[r.id],
            ),
            children: [
              e.jsx(B, { icon: Hi[r.id], className: "mt-0.5 h-4 w-4 shrink-0" }),
              e.jsxs("div", {
                className: "min-w-0 space-y-0.5",
                children: [
                  e.jsx("p", {
                    className:
                      "pixel-display text-[12px] font-semibold leading-tight text-foreground",
                    children: r.title,
                  }),
                  e.jsx("p", {
                    className:
                      "pixel-display text-[10px] leading-snug text-muted-foreground sm:text-[11px]",
                    children: r.line,
                  }),
                ],
              }),
            ],
          }),
        },
        r.id,
      ),
    ),
  });
}
function Vi({ className: t }) {
  return e.jsx("div", { className: m("", t), children: e.jsx(Gi, {}) });
}
const Ki = ["hero", "agente", "tecnico", "live", "docs"],
  Yi = { hero: "fjord", agente: "forest", tecnico: "mountains", live: "shore", docs: "moon" },
  dt = { hero: "Muninn", agente: "Qué es", tecnico: "Agente", live: "Flujo", docs: "Docs" },
  Qi = { hero: "soul", agente: "hand", tecnico: "hammer", live: "play", docs: "book" },
  Ce = {
    soul: "soul",
    rules: "rules",
    helpers: "hammer",
    rag: "book",
    model: "bot",
    cron: "clock",
  };
function K({ children: t, className: r, delayMs: a = 0, tone: s = "fade" }) {
  const n = G(),
    i = !n && s !== "none" ? (s === "pop" ? "pixel-enter-pop" : "pixel-enter-fade") : void 0;
  return e.jsx("div", {
    className: m(i, r),
    style: !n && s !== "none" ? { "--pixel-delay": `${a}ms` } : void 0,
    children: t,
  });
}
function Zi({ active: t, onSelect: r }) {
  return e.jsx("nav", {
    "aria-label": "Secciones Muninn",
    className: "fixed left-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3",
    children: Ki.map((a) => {
      const s = t === a;
      return e.jsxs(
        "div",
        {
          className: "group flex items-center gap-2",
          children: [
            e.jsx("button", {
              type: "button",
              onClick: () => r(a),
              "aria-label": dt[a],
              "aria-pressed": s,
              title: dt[a],
              className: m(
                "pixel-jules-sm flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                s
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border/50 bg-card/80 text-muted-foreground hover:border-primary/50 hover:text-primary",
              ),
              children: e.jsx(B, { icon: Qi[a], className: "h-5 w-5" }),
            }),
            e.jsx("span", {
              className: m(
                "pixel-font whitespace-nowrap text-[10px] uppercase tracking-[0.12em] transition-all duration-200 max-sm:hidden",
                s
                  ? "translate-x-0 text-primary/90 opacity-100"
                  : "-translate-x-1 text-transparent opacity-0 group-hover:translate-x-0 group-hover:text-muted-foreground/60 group-hover:opacity-100",
              ),
              children: dt[a],
            }),
          ],
        },
        a,
      );
    }),
  });
}
function Ji({ className: t, liveNonce: r = 0 }) {
  const [a, s] = l.useState(0),
    [n, i] = l.useState(() => {
      const h = window.location.hash.replace("#", "");
      return h === "hero" || h === "agente" || h === "tecnico" || h === "live" || h === "docs"
        ? h
        : "hero";
    }),
    [c, o] = l.useState("soul"),
    [x, d] = l.useState(null),
    u = l.useRef(null),
    f = l.useRef(null);
  return (
    l.useEffect(() => {
      r > 0 && s(r);
    }, [r]),
    l.useEffect(() => {
      const h = Yi[n];
      window.dispatchEvent(
        new CustomEvent("muninn-zone-change", { detail: { zone: h, section: n } }),
      );
      const g = n === "hero" ? "" : n;
      (history.replaceState(null, "", g ? `/#${g}` : "/"),
        f.current?.scrollTo({ top: 0, behavior: "instant" }));
    }, [n]),
    e.jsxs("div", {
      ref: u,
      className: m("relative z-[2] flex h-dvh overflow-hidden", t),
      children: [
        e.jsx(Zi, { active: n, onSelect: i }),
        e.jsxs("div", {
          ref: f,
          className: "ml-12 flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-16 sm:ml-16 sm:p-8",
          children: [
            e.jsx("div", {
              className: "flex min-h-0 flex-1 items-center justify-center",
              children: e.jsx(ue, {
                mode: "popLayout",
                children: e.jsxs(
                  I.div,
                  {
                    initial: { opacity: 0, filter: "blur(8px)", y: 14 },
                    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                    exit: { opacity: 0, filter: "blur(6px)", y: -14 },
                    transition: { duration: 0.35, ease: [0.45, 0, 0.2, 1] },
                    className: "flex w-full max-w-3xl flex-col",
                    children: [
                      n === "hero" &&
                        e.jsxs("section", {
                          id: "hero",
                          className:
                            "relative flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-4 text-center sm:min-h-0",
                          "aria-label": "Muninn",
                          children: [
                            e.jsx(K, {
                              tone: "pop",
                              children: e.jsxs("div", {
                                className: "flex flex-col items-center gap-4",
                                children: [
                                  e.jsx(zt, {
                                    featured: !0,
                                    className: "h-20 w-20 sm:h-28 sm:w-28",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "pixel-font text-2xl uppercase tracking-[0.2em] text-foreground [text-shadow:0_2px_10px_var(--nordic-sky-0,#010204)] sm:text-3xl",
                                    children: "MUNINN",
                                  }),
                                ],
                              }),
                            }),
                            e.jsx(K, {
                              tone: "fade",
                              delayMs: 60,
                              children: e.jsx("div", {
                                className:
                                  "mx-auto max-w-xl space-y-3 rounded-sm bg-background/25 px-4 py-3 backdrop-blur-md sm:bg-background/15 sm:px-6 sm:py-4 sm:backdrop-blur-sm",
                                children: e.jsxs("p", {
                                  className:
                                    "pixel-display text-[16px] leading-relaxed text-foreground/95 [text-shadow:0_2px_12px_var(--nordic-sky-0,#010204)] sm:text-[18px]",
                                  children: [
                                    "Crea, opera y supervisa tu agente de IA",
                                    e.jsx("br", {}),
                                    "con claridad total.",
                                    " ",
                                    e.jsx("span", {
                                      className:
                                        "text-primary [text-shadow:0_1px_8px_color-mix(in_oklab,var(--primary)_30%,transparent)]",
                                      children: "Sin cajas negras.",
                                    }),
                                  ],
                                }),
                              }),
                            }),
                          ],
                        }),
                      n === "agente" &&
                        e.jsxs("section", {
                          id: "agente",
                          className:
                            "flex w-full flex-col items-center justify-center gap-6 text-center",
                          "aria-labelledby": "muninn-with-you",
                          children: [
                            e.jsx(K, {
                              tone: "pop",
                              children: e.jsx("div", {
                                className: "flex flex-col items-center gap-3",
                                children: e.jsxs("div", {
                                  className: "space-y-1",
                                  children: [
                                    e.jsx("p", {
                                      className:
                                        "pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[15px]",
                                      children: "¿Qué es Muninn?",
                                    }),
                                    e.jsx("p", {
                                      className:
                                        "pixel-display text-[18px] font-semibold leading-snug text-foreground sm:text-[22px]",
                                      children: "El agente que ves funcionar",
                                    }),
                                    e.jsx("p", {
                                      className:
                                        "pixel-display mx-auto max-w-lg text-[13px] text-muted-foreground sm:text-[14px]",
                                      children:
                                        "Una plataforma completa para crear, operar y supervisar agentes de IA con total transparencia.",
                                    }),
                                  ],
                                }),
                              }),
                            }),
                            e.jsx("ul", {
                              className: "grid w-full max-w-2xl gap-2 sm:grid-cols-3",
                              children: _n.map((h, g) =>
                                e.jsx(
                                  "li",
                                  {
                                    children: e.jsx(K, {
                                      delayMs: g * 70,
                                      children: e.jsxs("div", {
                                        className:
                                          "border border-primary/20 bg-card/60 pixel-jules-sm p-3 text-left sm:p-4",
                                        children: [
                                          e.jsxs("p", {
                                            className:
                                              "pixel-font mb-1 text-[11px] uppercase text-primary/80",
                                            children: ["0", g + 1],
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "pixel-display mb-1 text-[14px] font-semibold text-foreground",
                                            children: h.title,
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "pixel-display text-[12px] leading-relaxed text-muted-foreground",
                                            children: h.line,
                                          }),
                                        ],
                                      }),
                                    }),
                                  },
                                  h.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      n === "tecnico" &&
                        e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("section", {
                              id: "tecnico",
                              className:
                                "hidden w-full max-w-3xl flex-row items-center justify-center gap-8 px-4 sm:flex",
                              "aria-labelledby": "muninn-flow",
                              children: [
                                e.jsx(K, {
                                  tone: "pop",
                                  className: "flex-1",
                                  children: e.jsxs("div", {
                                    className:
                                      "border border-primary/25 bg-card/80 pixel-jules-sm space-y-3 p-4",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("p", {
                                            className:
                                              "pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[16px]",
                                            children: "Componentes del agente",
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "pixel-display mt-1 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]",
                                            children:
                                              "Muninn no es magia: son piezas operables que trabajan juntas para darle vida a tu agente.",
                                          }),
                                        ],
                                      }),
                                      e.jsx("ul", {
                                        className: "space-y-1.5",
                                        children: ae.map((h) =>
                                          e.jsxs(
                                            "li",
                                            {
                                              className: "flex items-start gap-2",
                                              children: [
                                                e.jsx("span", {
                                                  className:
                                                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-primary/40 bg-primary/10",
                                                  children: e.jsx(B, {
                                                    icon: Ce[h.id],
                                                    className: "h-3 w-3 text-primary",
                                                  }),
                                                }),
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx("span", {
                                                      className:
                                                        "pixel-font text-[10px] uppercase text-foreground sm:text-[11px]",
                                                      children: h.title,
                                                    }),
                                                    e.jsx("p", {
                                                      className:
                                                        "pixel-display text-[11px] leading-snug text-muted-foreground sm:text-[12px]",
                                                      children: h.line,
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            },
                                            h.id,
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx(K, {
                                  delayMs: 30,
                                  tone: "none",
                                  className: "flex items-center justify-center",
                                  children: e.jsxs("div", {
                                    className: "relative h-[360px] w-[380px]",
                                    children: [
                                      e.jsxs("svg", {
                                        className:
                                          "pointer-events-none absolute inset-0 z-0 h-full w-full",
                                        viewBox: "0 0 380 360",
                                        "aria-hidden": !0,
                                        children: [
                                          e.jsx("line", {
                                            x1: "114",
                                            y1: "52",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.2",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line",
                                          }),
                                          e.jsx("line", {
                                            x1: "266",
                                            y1: "52",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.2",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line",
                                          }),
                                          e.jsx("line", {
                                            x1: "78",
                                            y1: "170",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.15",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line pixel-energy-line--slow",
                                          }),
                                          e.jsx("line", {
                                            x1: "302",
                                            y1: "170",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.15",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line pixel-energy-line--slow",
                                          }),
                                          e.jsx("line", {
                                            x1: "114",
                                            y1: "308",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.2",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line",
                                          }),
                                          e.jsx("line", {
                                            x1: "266",
                                            y1: "308",
                                            x2: "190",
                                            y2: "180",
                                            stroke: "var(--primary)",
                                            strokeOpacity: "0.2",
                                            strokeWidth: "1.5",
                                            strokeDasharray: "3 3",
                                            className: "pixel-energy-line",
                                          }),
                                        ],
                                      }),
                                      [
                                        { pos: "left-[36px] top-[8px]", i: 0 },
                                        { pos: "right-[36px] top-[8px]", i: 1 },
                                        { pos: "left-0 top-[148px]", i: 2 },
                                        { pos: "right-0 top-[148px]", i: 3 },
                                        { pos: "bottom-[8px] left-[36px]", i: 4 },
                                        { pos: "bottom-[8px] right-[36px]", i: 5 },
                                      ].map(({ pos: h, i: g }) =>
                                        e.jsxs(
                                          "button",
                                          {
                                            type: "button",
                                            onClick: () => d(ae[g].id),
                                            className: `absolute ${h} z-[2] flex w-[78px] cursor-pointer flex-col items-center gap-1 border border-primary/30 bg-card pixel-jules-sm px-1.5 py-2.5 transition-colors hover:border-primary/70 hover:bg-primary/10`,
                                            children: [
                                              e.jsx("div", {
                                                className: "pixel-node-pulse",
                                                style: { animationDelay: `${g * 0.3}s` },
                                                children: e.jsx(B, {
                                                  icon: Ce[ae[g].id],
                                                  className: "h-5 w-5 text-primary/80",
                                                }),
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "pixel-font text-[8px] uppercase text-primary/70",
                                                children: ae[g].title,
                                              }),
                                            ],
                                          },
                                          ae[g].id,
                                        ),
                                      ),
                                      e.jsxs("div", {
                                        className:
                                          "absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 border-2 border-primary/60 bg-card px-4 py-3 pixel-agent-core",
                                        children: [
                                          e.jsxs("svg", {
                                            viewBox: "0 0 52 28",
                                            className: "h-[32px] w-[60px]",
                                            shapeRendering: "crispEdges",
                                            "aria-hidden": !0,
                                            children: [
                                              e.jsx("rect", {
                                                x: "20",
                                                y: "8",
                                                width: "12",
                                                height: "12",
                                                fill: "color-mix(in oklab,var(--primary) 40%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "22",
                                                y: "10",
                                                width: "8",
                                                height: "8",
                                                fill: "var(--primary)",
                                              }),
                                              e.jsx("rect", {
                                                x: "10",
                                                y: "4",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 25%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "36",
                                                y: "4",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 25%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "2",
                                                y: "16",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 20%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "44",
                                                y: "16",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 20%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "10",
                                                y: "22",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 25%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "36",
                                                y: "22",
                                                width: "6",
                                                height: "3",
                                                fill: "color-mix(in oklab,var(--primary) 25%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "16",
                                                y: "10",
                                                width: "4",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 15%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "32",
                                                y: "10",
                                                width: "4",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 15%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "12",
                                                y: "16",
                                                width: "8",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 12%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "32",
                                                y: "16",
                                                width: "8",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 12%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "16",
                                                y: "20",
                                                width: "4",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 15%,transparent)",
                                              }),
                                              e.jsx("rect", {
                                                x: "32",
                                                y: "20",
                                                width: "4",
                                                height: "1",
                                                fill: "color-mix(in oklab,var(--primary) 15%,transparent)",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("span", {
                                            className:
                                              "pixel-font text-[8px] uppercase text-foreground/80 leading-tight",
                                            children: ["Agente", e.jsx("br", {}), "Muninn"],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            }),
                            e.jsxs("section", {
                              id: "tecnico-mobile",
                              className:
                                "flex w-full max-w-xs flex-col items-center gap-3 px-4 sm:hidden",
                              "aria-labelledby": "muninn-flow-mobile",
                              children: [
                                e.jsx("p", {
                                  className:
                                    "pixel-font text-[13px] uppercase tracking-[0.15em] text-primary",
                                  children: "Componentes del agente",
                                }),
                                e.jsx("p", {
                                  className:
                                    "pixel-display text-[12px] leading-relaxed text-muted-foreground",
                                  children:
                                    "Muninn no es magia: son piezas operables que trabajan juntas.",
                                }),
                                e.jsx("div", {
                                  className: "flex flex-col gap-2",
                                  children: ae.map((h, g) =>
                                    e.jsxs(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => d(h.id),
                                        className:
                                          "flex w-full items-center gap-2.5 border border-primary/25 bg-card/80 pixel-jules-sm px-3 py-2.5 text-left transition-colors hover:border-primary/60 hover:bg-primary/5",
                                        children: [
                                          e.jsx("span", {
                                            className:
                                              "flex h-8 w-8 shrink-0 items-center justify-center border border-primary/40 bg-primary/10",
                                            children: e.jsx(B, {
                                              icon: Ce[h.id],
                                              className: "h-4 w-4 text-primary",
                                            }),
                                          }),
                                          e.jsxs("div", {
                                            className: "min-w-0 flex-1",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "pixel-font block text-[10px] uppercase text-foreground",
                                                children: h.title,
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "pixel-display block text-[11px] leading-snug text-muted-foreground",
                                                children: h.line,
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      h.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                      n === "live" &&
                        e.jsx("section", {
                          id: "live",
                          className:
                            "flex w-full flex-col justify-center px-1 pb-20 pt-2 max-sm:self-start",
                          children: e.jsx(K, {
                            tone: "none",
                            className: "w-full",
                            children: e.jsx(Bi, { liveFocusToken: a, demoOnly: !0 }),
                          }),
                        }),
                      n === "docs" &&
                        e.jsxs("section", {
                          id: "docs",
                          className:
                            "flex w-full max-w-3xl flex-col items-center gap-3 px-2 py-4 sm:justify-center sm:gap-4 sm:px-4 sm:py-6",
                          "aria-labelledby": "muninn-docs",
                          children: [
                            e.jsx(K, {
                              tone: "pop",
                              className: "w-full",
                              children: e.jsxs("div", {
                                className: "text-center",
                                children: [
                                  e.jsx("p", {
                                    className:
                                      "pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[15px]",
                                    children: "MUNINN PLATFORM REST",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "pixel-display mt-1 text-[13px] leading-relaxed text-muted-foreground max-w-lg mx-auto",
                                    children: Nn,
                                  }),
                                ],
                              }),
                            }),
                            e.jsx(K, {
                              delayMs: 30,
                              tone: "fade",
                              className: "w-full",
                              children: e.jsx("ul", {
                                className: "grid grid-cols-2 gap-2",
                                children: Ln.map((h) =>
                                  e.jsxs(
                                    "li",
                                    {
                                      className:
                                        "pixel-jules-sm border border-border/40 bg-card/80 p-3",
                                      children: [
                                        e.jsx("p", {
                                          className:
                                            "pixel-jules-badge border-primary bg-primary/15 text-primary w-fit",
                                          children: h.title,
                                        }),
                                        e.jsx("p", {
                                          className:
                                            "pixel-display mt-1 text-[13px] leading-relaxed text-muted-foreground",
                                          children: h.line,
                                        }),
                                      ],
                                    },
                                    h.id,
                                  ),
                                ),
                              }),
                            }),
                            e.jsxs(K, {
                              delayMs: 50,
                              tone: "fade",
                              className: "w-full space-y-3",
                              children: [
                                e.jsxs("div", {
                                  className: "space-y-1",
                                  children: [
                                    e.jsx("p", {
                                      className:
                                        "pixel-font text-[11px] uppercase text-muted-foreground sm:text-[12px]",
                                      children: "Harness",
                                    }),
                                    e.jsx("p", {
                                      className:
                                        "pixel-display text-[13px] leading-relaxed text-foreground/90",
                                      children:
                                        "El harness es el motor que orquesta alma, reglas, herramientas, conocimiento, modelo y automatización. Todo lo que define a tu agente vive aquí, versionado y visible.",
                                    }),
                                    e.jsxs("a", {
                                      href: He.href,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                      className:
                                        "pixel-font inline-flex items-center gap-1 text-[9px] uppercase text-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                      children: [
                                        e.jsx(B, { icon: "book", className: "h-3 w-3" }),
                                        He.label,
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsx(Vi, {}),
                              ],
                            }),
                          ],
                        }),
                    ],
                  },
                  n,
                ),
              }),
            }),
            e.jsx(ue, {
              children:
                x &&
                (() => {
                  const h = ae.find((g) => g.id === x);
                  return e.jsx(
                    I.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: { duration: 0.2 },
                      className:
                        "fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm",
                      onClick: () => d(null),
                      children: e.jsxs(I.div, {
                        initial: { opacity: 0, scale: 0.95, y: 10 },
                        animate: { opacity: 1, scale: 1, y: 0 },
                        exit: { opacity: 0, scale: 0.95, y: 10 },
                        transition: { duration: 0.25, ease: "easeOut" },
                        className:
                          "relative w-full max-w-md border-2 border-primary/40 bg-card pixel-jules-sm p-5 shadow-[6px_6px_0_0_color-mix(in_oklab,var(--primary)_25%,transparent)]",
                        onClick: (g) => g.stopPropagation(),
                        children: [
                          e.jsx("button", {
                            type: "button",
                            onClick: () => d(null),
                            className:
                              "pixel-font absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-border/50 text-[11px] uppercase text-muted-foreground hover:border-primary/50 hover:text-primary",
                            "aria-label": "Cerrar",
                            children: "✕",
                          }),
                          e.jsxs("div", {
                            className:
                              "mb-3 flex items-center gap-2.5 border-b border-border/30 pb-3",
                            children: [
                              e.jsx("div", {
                                className:
                                  "flex h-9 w-9 items-center justify-center border-2 border-primary/40 bg-primary/10",
                                children: e.jsx(B, {
                                  icon: Ce[h.id],
                                  className: "h-5 w-5 text-primary",
                                }),
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("p", {
                                    className:
                                      "pixel-jules-badge border-primary/40 bg-primary/15 text-primary text-[9px]",
                                    children: h.role,
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "pixel-display text-[18px] font-semibold text-foreground",
                                    children: h.title,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx("p", {
                            className:
                              "pixel-display mb-3 text-[14px] leading-relaxed text-foreground/90",
                            children: h.why,
                          }),
                          e.jsxs("div", {
                            className: "mb-2 border-l-2 border-primary/30 bg-primary/5 px-3 py-2",
                            children: [
                              e.jsx("p", {
                                className: "pixel-font mb-0.5 text-[9px] uppercase text-primary/70",
                                children: "Ejemplo",
                              }),
                              e.jsx("p", {
                                className:
                                  "pixel-display text-[13px] leading-relaxed text-foreground/85",
                                children: h.example,
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "border-t border-border/20 pt-2",
                            children: e.jsx("p", {
                              className: "pixel-font text-[8px] uppercase text-muted-foreground",
                              children: h.tech,
                            }),
                          }),
                        ],
                      }),
                    },
                    "atom-modal",
                  );
                })(),
            }),
          ],
        }),
      ],
    })
  );
}
const Xi = [
    {
      id: "agents",
      title: "Agentes",
      description: "Configurá y desplegá agentes de IA para tu organización y clientes.",
    },
    {
      id: "channels",
      title: "Canales",
      description: "WhatsApp, web y más conectados a tus agentes.",
    },
    {
      id: "apps",
      title: "Aplicaciones",
      description: "Integraciones habilitadas para esta organización.",
    },
    {
      id: "conversations",
      title: "Conversaciones",
      description: "Bandeja operativa, filtrable por cliente o sucursal.",
    },
    { id: "team", title: "Equipo", description: "Usuarios y roles bajo el mismo portal." },
  ],
  eo = { agents: Lt, channels: Ne, apps: Ue, conversations: Ge, team: le };
function to(t) {
  const r = (t.icon_url || t.logo_url || "").trim();
  return r ? oe(r) || r : null;
}
function ro({
  loading: t = !1,
  orgName: r,
  brandTitle: a,
  brandLogoUrl: s,
  tagline: n,
  description: i,
  websiteUrl: c,
  welcomeMessage: o,
  socialLinks: x = [],
  sponsors: d = [],
  showSponsors: u = !0,
  apps: f = [],
  children: h,
  className: g,
}) {
  const y = G(),
    j = f ?? [],
    k = x ?? [],
    L = u ? (d ?? []) : [],
    _ = (c || "").trim(),
    N = (o || "").trim() || "Bienvenido",
    S = n?.trim() || null,
    P = i?.trim() || `Portal de ${r || "la organización"}. Inicia sesión para continuar.`,
    M = Xi.map((b) => ({
      kind: "capability",
      id: b.id,
      title: b.title,
      description: b.description,
      icon: eo[b.id],
    })),
    H = j.map((b) => ({
      kind: "app",
      id: `app-${b.id}`,
      title: b.name,
      description: b.description,
      category: b.category,
      logoUrl: to(b),
    })),
    O = (b, R) => {
      const T = b.kind === "capability" ? b.icon : Ue;
      return e.jsxs(
        I.article,
        {
          initial: y ? !1 : { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.35,
            delay: y ? 0 : Math.min(0.04 + R * 0.03, 0.45),
            ease: [0.22, 1, 0.36, 1],
          },
          className: m(
            "group flex h-full flex-col rounded-2xl bg-card/50 p-4 backdrop-blur-sm",
            "transition-colors hover:bg-card/80",
            b.kind === "app" && "bg-primary/[0.07] hover:bg-primary/[0.12]",
          ),
          children: [
            e.jsxs("div", {
              className: "flex items-start gap-3",
              children: [
                b.kind === "app"
                  ? e.jsx(Za, {
                      name: b.title,
                      src: b.logoUrl,
                      size: "sm",
                      className: "rounded-xl",
                    })
                  : e.jsx("span", {
                      className:
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
                      children: e.jsx(T, { className: "h-4 w-4", "aria-hidden": !0 }),
                    }),
                e.jsxs("div", {
                  className: "min-w-0 flex-1 space-y-1",
                  children: [
                    e.jsx("p", {
                      className:
                        "text-[15px] font-semibold tracking-tight text-foreground leading-snug",
                      children: b.title,
                    }),
                    b.kind === "app" && b.category
                      ? e.jsx("p", {
                          className: "text-[10px] uppercase tracking-wider text-muted-foreground",
                          children: b.category,
                        })
                      : null,
                  ],
                }),
              ],
            }),
            b.description
              ? e.jsx("p", {
                  className:
                    "mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-4",
                  children: b.description,
                })
              : e.jsx("div", { className: "flex-1" }),
            b.kind === "app"
              ? e.jsx("p", {
                  className: "mt-3 text-[11px] font-medium text-primary/90",
                  children: "Aplicación disponible",
                })
              : null,
          ],
        },
        b.id,
      );
    },
    C = m(
      "grid gap-3 sm:gap-4",
      "grid-cols-1",
      "min-[480px]:grid-cols-2",
      "md:grid-cols-3",
      "xl:grid-cols-4",
      "2xl:grid-cols-5",
    );
  return e.jsxs("div", {
    className: m("relative min-h-dvh overflow-x-hidden", g),
    children: [
      e.jsx("div", {
        "aria-hidden": !0,
        className:
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary-soft/30",
      }),
      e.jsx("div", {
        "aria-hidden": !0,
        className: m(
          "pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl",
          !y && "login-drift",
        ),
      }),
      e.jsx("div", {
        "aria-hidden": !0,
        className: m(
          "pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl",
          !y && "login-drift-slow",
        ),
      }),
      e.jsx("div", {
        className: "relative z-[1] flex min-h-dvh flex-col justify-center",
        children: e.jsxs("div", {
          className:
            "mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-10 lg:px-8 lg:py-12 xl:px-10",
          children: [
            e.jsxs("header", {
              className:
                "grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,28rem)] lg:gap-12 xl:gap-16",
              children: [
                e.jsxs(I.div, {
                  initial: y ? !1 : { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  className:
                    "flex flex-col items-center gap-5 text-center lg:items-start lg:text-left",
                  children: [
                    t
                      ? e.jsx(ke, {
                          pending: !0,
                          hero: !0,
                          layout: "horizontal",
                          className: "justify-center lg:justify-start",
                        })
                      : e.jsx(ke, {
                          branchLabel: r || a,
                          branchLogoUrl: s,
                          hero: !0,
                          layout: "horizontal",
                          className: "justify-center lg:justify-start",
                        }),
                    e.jsxs("div", {
                      className: "max-w-xl space-y-2 lg:max-w-2xl",
                      children: [
                        e.jsx("p", {
                          className: "text-base font-medium text-foreground/90 sm:text-lg",
                          children: N,
                        }),
                        S
                          ? e.jsx("p", {
                              className: "text-sm font-medium text-primary/90",
                              children: S,
                            })
                          : null,
                        e.jsx("p", {
                          className: "text-sm leading-relaxed text-muted-foreground sm:text-[15px]",
                          children: P,
                        }),
                      ],
                    }),
                    (_ || k.length > 0 || j.length > 0) &&
                      e.jsxs("div", {
                        className:
                          "flex w-full max-w-xl flex-col items-center gap-3 lg:max-w-2xl lg:items-start",
                        children: [
                          j.length > 0
                            ? e.jsxs("p", {
                                className: "text-[11px] tabular-nums text-muted-foreground/80",
                                children: [
                                  j.length,
                                  " aplicación",
                                  j.length === 1 ? "" : "es",
                                  " habilitada",
                                  j.length === 1 ? "" : "s",
                                ],
                              })
                            : null,
                          _
                            ? e.jsxs("a", {
                                href: _.startsWith("http") ? _ : `https://${_}`,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className:
                                  "inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-2",
                                children: [
                                  e.jsx(Qa, { className: "h-3.5 w-3.5", "aria-hidden": !0 }),
                                  _.replace(/^https?:\/\//i, ""),
                                ],
                              })
                            : null,
                          k.length > 0
                            ? e.jsx(qr, { links: k, className: "justify-center lg:justify-start" })
                            : null,
                        ],
                      }),
                  ],
                }),
                e.jsx(I.div, {
                  initial: y ? !1 : { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, delay: y ? 0 : 0.06 },
                  className: "mx-auto w-full max-w-md lg:mx-0 lg:max-w-none",
                  children: h,
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex flex-col gap-8 pb-2",
              children: [
                (t || H.length > 0) &&
                  e.jsxs("section", {
                    "aria-label": "Aplicaciones disponibles",
                    className: "space-y-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-end justify-between gap-3",
                        children: [
                          e.jsx("h2", {
                            className: "text-sm font-semibold tracking-tight text-foreground",
                            children: "Aplicaciones disponibles",
                          }),
                          t
                            ? null
                            : e.jsx("p", {
                                className: "text-[11px] text-muted-foreground",
                                children: "Desde el perfil de la organización",
                              }),
                        ],
                      }),
                      e.jsx("div", {
                        className: C,
                        children: t
                          ? Array.from({ length: 5 }, (b, R) =>
                              e.jsx(
                                "div",
                                { className: "h-36 animate-pulse rounded-2xl bg-muted/45" },
                                R,
                              ),
                            )
                          : H.map((b, R) => O(b, R)),
                      }),
                    ],
                  }),
                e.jsxs("section", {
                  "aria-label": "Capacidades del portal",
                  className: "space-y-3",
                  children: [
                    e.jsx("h2", {
                      className: "text-sm font-semibold tracking-tight text-foreground",
                      children: "En este portal",
                    }),
                    e.jsx("div", {
                      className: C,
                      children: t
                        ? Array.from({ length: 5 }, (b, R) =>
                            e.jsx(
                              "div",
                              { className: "h-28 animate-pulse rounded-2xl bg-muted/40" },
                              R,
                            ),
                          )
                        : M.map((b, R) => O(b, R)),
                    }),
                  ],
                }),
                !t && L.length > 0
                  ? e.jsxs("section", {
                      "aria-label": "Patrocinadores",
                      className: "space-y-3 border-t border-border/40 pt-6",
                      children: [
                        e.jsx("h2", {
                          className:
                            "text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
                          children: "Patrocinadores",
                        }),
                        e.jsx("div", {
                          className: "flex flex-wrap items-center justify-center gap-6 sm:gap-8",
                          children: L.map((b, R) => {
                            const T = oe(b.logo_url) || b.logo_url || "",
                              F = (b.website_url || "").trim(),
                              E = b.name?.trim() || "Patrocinador",
                              $ = T
                                ? e.jsx("img", {
                                    src: T,
                                    alt: E,
                                    className:
                                      "h-8 w-auto max-w-[7rem] object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-[9rem]",
                                  })
                                : e.jsx("span", {
                                    className: "text-xs font-medium text-muted-foreground",
                                    children: E,
                                  });
                            return F
                              ? e.jsx(
                                  "a",
                                  {
                                    href: F.startsWith("http") ? F : `https://${F}`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    title: E,
                                    className: "inline-flex items-center",
                                    children: $,
                                  },
                                  `${E}-${R}`,
                                )
                              : e.jsx(
                                  "span",
                                  { className: "inline-flex items-center", children: $ },
                                  `${E}-${R}`,
                                );
                          }),
                        }),
                      ],
                    })
                  : null,
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const ao = tr(
    "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    {
      variants: {
        variant: {
          default: "bg-background text-foreground",
          destructive:
            "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  Ur = l.forwardRef(({ className: t, variant: r, ...a }, s) =>
    e.jsx("div", { ref: s, role: "alert", className: m(ao({ variant: r }), t), ...a }),
  );
Ur.displayName = "Alert";
const so = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("h5", { ref: a, className: m("mb-1 font-medium leading-none tracking-tight", t), ...r }),
);
so.displayName = "AlertTitle";
const Gr = l.forwardRef(({ className: t, ...r }, a) =>
  e.jsx("div", { ref: a, className: m("text-sm [&_p]:leading-relaxed", t), ...r }),
);
Gr.displayName = "AlertDescription";
const Vr = "text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground",
  Kr =
    "h-11 bg-secondary/80 border-border/40 text-foreground placeholder:text-muted-foreground/45 focus-visible:border-primary/40 focus-visible:ring-primary/35",
  no =
    "h-11 w-full bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-deep hover:shadow-md hover:shadow-primary/25 active:scale-[0.99] disabled:active:scale-100";
function io(t) {
  return m(
    "space-y-5 rounded-2xl border border-border/50 bg-card/75 p-5 shadow-lg shadow-primary/5 backdrop-blur-xl sm:p-6 dark:bg-card/65 dark:border-border/45",
    t,
  );
}
function oo({
  id: t,
  label: r = "Contraseña",
  value: a,
  onChange: s,
  autoComplete: n = "current-password",
  placeholder: i = "••••••••",
  required: c = !0,
  minLength: o,
  autoFocus: x,
  className: d,
  labelAside: u,
  pixel: f = !1,
}) {
  const [h, g] = l.useState(!1),
    y = !!r || !!u;
  return e.jsxs("div", {
    className: m("space-y-2", d),
    children: [
      y
        ? e.jsxs("div", {
            className: "flex items-center justify-between gap-2",
            children: [
              r ? e.jsx(gr, { htmlFor: t, className: Vr, children: r }) : e.jsx("span", {}),
              u,
            ],
          })
        : null,
      e.jsxs("div", {
        className: "relative",
        children: [
          e.jsx(wt, {
            id: t,
            type: h ? "text" : "password",
            placeholder: i,
            value: a,
            onChange: (j) => s(j.target.value),
            required: c,
            minLength: o,
            autoComplete: n,
            autoFocus: x,
            className: m(Kr, "pr-11"),
          }),
          e.jsx("button", {
            type: "button",
            onClick: () => g((j) => !j),
            className: m(
              "absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
              f ? "border-0 bg-transparent hover:bg-primary/10" : "rounded-md hover:bg-muted/60",
            ),
            "aria-label": h ? "Ocultar contraseña" : "Mostrar contraseña",
            children: f
              ? e.jsx(B, { icon: h ? "eyeOff" : "eye", className: "h-4 w-4" })
              : h
                ? e.jsx(Ja, { className: "h-4 w-4", "aria-hidden": !0 })
                : e.jsx(Xa, { className: "h-4 w-4", "aria-hidden": !0 }),
          }),
        ],
      }),
    ],
  });
}
function bt({
  email: t,
  password: r,
  onEmail: a,
  onPassword: s,
  onSubmit: n,
  errorMessage: i,
  pending: c,
  forgotPasswordTo: o,
  className: x,
  autoFocusEmail: d = !0,
  pixel: u = !1,
}) {
  return e.jsxs("form", {
    onSubmit: n,
    className: u ? m("space-y-4 bg-transparent p-0 shadow-none", x) : io(x),
    noValidate: !0,
    "aria-busy": c,
    children: [
      i
        ? e.jsx(Ur, {
            variant: "destructive",
            className: "border-destructive/30 bg-destructive/10",
            role: "alert",
            "aria-live": "assertive",
            children: e.jsx(Gr, { children: i }),
          })
        : null,
      e.jsxs("div", {
        className: "space-y-2",
        children: [
          e.jsx(gr, { htmlFor: "email", className: Vr, children: "Correo electrónico" }),
          e.jsx(wt, {
            id: "email",
            type: "email",
            placeholder: "tu@correo.com",
            value: t,
            onChange: (f) => a(f.target.value),
            required: !0,
            autoComplete: "email",
            autoFocus: d,
            className: Kr,
          }),
        ],
      }),
      e.jsx(oo, {
        id: "password",
        value: r,
        onChange: s,
        autoComplete: "current-password",
        pixel: u,
        labelAside: o
          ? e.jsx(X, {
              to: o,
              className:
                "text-[11px] font-medium text-primary underline-offset-2 transition-colors hover:underline",
              children: "Recuperar contraseña",
            })
          : null,
      }),
      e.jsx(ce, {
        type: "submit",
        className: m(no),
        disabled: c,
        children: c
          ? e.jsxs(e.Fragment, {
              children: [
                e.jsx(pr, { className: "mr-2 h-4 w-4 animate-spin", "aria-hidden": !0 }),
                "Entrando…",
              ],
            })
          : "Entrar",
      }),
    ],
  });
}
const lo = "https://github.com/felipebarraza6",
  co = "felipebarraza6",
  uo = 900;
function Qt() {
  const t = yt(),
    { slug: r } = jt(),
    [a] = Jr(),
    s = r || a.get("slug") || void 0,
    n = br(),
    { flat: i, scope: c, isAppDefault: o, isLoading: x } = hn(s),
    [d, u] = l.useState(() => !!n),
    [f, h] = l.useState(0),
    [g, y] = l.useState("fjord");
  (l.useEffect(() => {
    if (!o) {
      u(!0);
      return;
    }
    if (n) {
      u(!0);
      return;
    }
    u(!1);
    const Q = window.setTimeout(() => u(!0), uo);
    return () => window.clearTimeout(Q);
  }, [o, n]),
    l.useEffect(() => {
      if (!o) return;
      const Q = () => h((Je) => Je + 1);
      return (window.addEventListener(qe, Q), () => window.removeEventListener(qe, Q));
    }, [o]),
    l.useEffect(() => {
      if (!o) return;
      const Q = (Je) => {
        const $t = Je.detail;
        $t?.zone && y($t.zone);
      };
      return (
        window.addEventListener("muninn-zone-change", Q),
        () => window.removeEventListener("muninn-zone-change", Q)
      );
    }, [o]));
  const [j, k] = l.useState(""),
    [L, _] = l.useState(""),
    N = Dr(),
    S = (Q) => {
      (Q.preventDefault(), N.mutate({ email: j, password: L }, { onSuccess: () => t("/app") }));
    },
    P = N.error ? N.error.friendlyMessage || "Error al iniciar sesión" : null,
    M = ft(i),
    H = i?.fantasy_name?.trim() || null,
    O = i?.app_name?.trim() || null,
    C = i?.organization_name?.trim() || null,
    b = l.useMemo(() => {
      if (!o) return c === "branch" ? H || i?.branch_name || O || void 0 : C || void 0;
    }, [o, c, H, i?.branch_name, C, O]),
    R = c === "organization",
    T = c === "branch" && !!i?.branch_id,
    F = o,
    E = l.useMemo(() => {
      if (!(o || R)) return c === "branch" && O && O !== b ? O : i?.tagline || void 0;
    }, [o, R, c, O, b, i?.tagline]),
    $ = R
      ? null
      : i?.login_subtitle ||
        i?.subtitle ||
        i?.login_welcome_message ||
        i?.welcome_message ||
        (o ? gt : "Accede a tu espacio de trabajo"),
    v = oe(i?.organization_logo_url) || null,
    D = !!v && T,
    U = !T,
    V = o ? [] : (i?.social_links ?? []),
    ee = i?.available_apps ?? [],
    Qe = o ? [] : (i?.sponsors ?? []),
    Qr = i?.show_sponsor_logos !== !1,
    Zr = ft(i) || oe(i?.organization_logo_url) || oe(i?.logo_url) || null,
    Tt = {
      email: j,
      password: L,
      onEmail: k,
      onPassword: _,
      onSubmit: S,
      errorMessage: P,
      pending: N.isPending,
      forgotPasswordTo: s ? `/forgot-password/${encodeURIComponent(s)}` : "/forgot-password",
    },
    Ze = {
      initial: n ? !1 : { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: De.slow, delay: n ? 0 : 0.08, ease: De.easeOut },
    };
  return R
    ? e.jsx("div", {
        className: "relative min-h-screen bg-background",
        children: e.jsx(ro, {
          loading: x,
          orgName: C,
          brandTitle: C,
          brandLogoUrl: Zr,
          tagline: i?.tagline || null,
          description: i?.brand_description || null,
          websiteUrl: i?.website_url || null,
          welcomeMessage: i?.login_welcome_message || i?.welcome_message || null,
          socialLinks: V,
          sponsors: Qe,
          showSponsors: Qr,
          apps: ee,
          children: e.jsx(bt, { ...Tt }),
        }),
      })
    : F
      ? e.jsxs("div", {
          className: "login-pixel relative min-h-dvh overflow-x-hidden bg-background",
          children: [
            e.jsx(We, {
              intensity: "full",
              variant: "pixel",
              mood: "nordic",
              zone: g,
              parallax: !0,
              className: "pointer-events-none fixed inset-0 z-0",
            }),
            e.jsxs("div", {
              className: "fixed top-3 right-3 z-30 flex items-center gap-2 sm:top-4 sm:right-4",
              children: [
                e.jsx("a", {
                  href: "mailto:felipe.barraza.vega@gmail.com",
                  className:
                    "pixel-font pixel-jules-sm inline-flex items-center gap-1 border-2 border-primary/50 bg-card px-2.5 py-1 text-[8px] uppercase text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-[9px]",
                  children: "Cotizar",
                }),
                e.jsx(X, {
                  to: "/entrar",
                  className:
                    "pixel-font pixel-jules-sm inline-flex items-center gap-1 border-2 border-primary bg-primary px-2.5 py-1 text-[8px] uppercase text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-3 sm:text-[9px]",
                  children: "Ingresar",
                }),
              ],
            }),
            e.jsx("div", {
              className: m(
                "relative z-10 mx-auto w-full",
                d ? "max-w-[56rem] xl:max-w-[68rem]" : "flex min-h-dvh items-center justify-center",
              ),
              children: d ? e.jsx(Ji, { liveNonce: f }) : e.jsx(Ot, { centered: !0 }),
            }),
          ],
        })
      : e.jsxs("div", {
          className: "relative min-h-dvh overflow-hidden bg-background",
          children: [
            e.jsx(We, { intensity: "soft", variant: "aurora" }),
            e.jsx("div", {
              className:
                "relative z-[1] flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8",
              children: e.jsxs(I.div, {
                id: "login",
                className: "w-full max-w-sm space-y-5 scroll-mt-8",
                initial: Ze.initial,
                animate: Ze.animate,
                transition: Ze.transition,
                children: [
                  e.jsxs("div", {
                    className: "space-y-4 text-center",
                    children: [
                      x
                        ? e.jsx(ke, {
                            pending: !0,
                            layout: "horizontal",
                            className: "justify-center scale-110",
                          })
                        : e.jsx(ke, {
                            branchLabel: b,
                            appName: E,
                            branchLogoUrl: M,
                            layout: "horizontal",
                            className: "justify-center scale-110",
                          }),
                      $ && e.jsx("p", { className: "text-sm text-muted-foreground", children: $ }),
                    ],
                  }),
                  e.jsx(bt, { ...Tt }),
                  V.length > 0 && e.jsx(qr, { links: V }),
                  e.jsxs("div", {
                    className: "flex flex-col items-center gap-2 pt-0.5",
                    children: [
                      D &&
                        e.jsx("img", {
                          src: v,
                          alt: C || "Organización",
                          className: "h-7 max-w-[140px] object-contain opacity-80",
                        }),
                      e.jsxs("p", {
                        className: "text-[10px] uppercase tracking-wider text-muted-foreground/70",
                        children: [
                          "Powered by",
                          " ",
                          U
                            ? e.jsx("a", {
                                href: lo,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className:
                                  "underline-offset-2 hover:text-foreground hover:underline",
                                children: co,
                              })
                            : C || "Muninn",
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
const xo = 900,
  po = "https://github.com/felipebarraza6",
  mo = "felipebarraza6";
function ho() {
  const t = yt(),
    r = br(),
    [a, s] = l.useState(() => !!r),
    [n, i] = l.useState(""),
    [c, o] = l.useState(""),
    x = Dr();
  l.useEffect(() => {
    if (r) {
      s(!0);
      return;
    }
    s(!1);
    const f = window.setTimeout(() => s(!0), xo);
    return () => window.clearTimeout(f);
  }, [r]);
  const d = (f) => {
      (f.preventDefault(), x.mutate({ email: n, password: c }, { onSuccess: () => t("/app") }));
    },
    u = x.error ? x.error.friendlyMessage || "Error al iniciar sesión" : null;
  return e.jsxs("div", {
    className: "login-pixel relative min-h-dvh overflow-x-hidden bg-background",
    children: [
      e.jsx(We, {
        intensity: "full",
        variant: "pixel",
        mood: "batcave",
        className: "pointer-events-none fixed inset-0 z-0",
      }),
      e.jsx("div", {
        className: "relative z-10 flex min-h-dvh items-center justify-center px-4 py-14 sm:px-6",
        children: a
          ? e.jsxs(I.div, {
              className: "w-full max-w-md space-y-4",
              initial: r ? !1 : { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: De.slow, ease: De.easeOut, delay: r ? 0 : 0.05 },
              children: [
                e.jsxs("div", {
                  className: "space-y-2 text-center",
                  children: [
                    e.jsx("p", {
                      className:
                        "pixel-font text-[8px] uppercase tracking-[0.14em] text-primary/80",
                    }),
                    e.jsx(Ui, { brand: !0, centered: !0 }),
                    e.jsx(X, {
                      to: "/",
                      className:
                        "pixel-font inline-flex text-[8px] uppercase text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      children: "← Volver",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  id: "login",
                  className: m(
                    "login-pixel-auth__card scroll-mt-4 space-y-4 p-4 sm:p-5",
                    "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_25%,transparent),0_0_40px_color-mix(in_oklab,var(--primary)_12%,transparent)]",
                  ),
                  children: [
                    e.jsx("h1", {
                      className:
                        "pixel-font text-[12px] uppercase tracking-wide text-foreground sm:text-[13px]",
                      children: "Iniciar sesión",
                    }),
                    e.jsx(bt, {
                      email: n,
                      password: c,
                      onEmail: i,
                      onPassword: o,
                      onSubmit: d,
                      errorMessage: u,
                      pending: x.isPending,
                      forgotPasswordTo: "/forgot-password",
                      pixel: !0,
                    }),
                    e.jsxs("p", {
                      className: "pixel-footer",
                      children: [
                        "Powered by",
                        " ",
                        e.jsx("a", {
                          href: po,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "underline-offset-2 hover:text-foreground hover:underline",
                          children: mo,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : e.jsx(Ot, { centered: !0 }),
      }),
    ],
  });
}
const fo = l.lazy(() =>
    A(() => import("./index-B63CxC74.js"), __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8])),
  ),
  go = l.lazy(() =>
    A(() => import("./conversaciones-BKc6sG-6.js"), __vite__mapDeps([9, 1, 2, 3, 4, 5, 6])),
  ),
  bo = l.lazy(() =>
    A(
      () => import("./studio-chat-Bi-RYdat.js").then((t) => t.fS),
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
    ),
  ),
  yo = l.lazy(() =>
    A(
      () => import("./studio-chat-Bi-RYdat.js").then((t) => t.fT),
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
    ),
  ),
  jo = l.lazy(() =>
    A(
      () => import("./studio-chat-Bi-RYdat.js").then((t) => t.fU),
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
    ),
  ),
  vo = l.lazy(() =>
    A(
      () => import("./studio-chat-Bi-RYdat.js").then((t) => t.fV),
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
    ),
  ),
  wo = l.lazy(() =>
    A(
      () => import("./studio-chat-Bi-RYdat.js").then((t) => t.fW),
      __vite__mapDeps([2, 1, 3, 4, 5, 6]),
    ),
  ),
  No = l.lazy(() =>
    A(() => import("./planes-CIMkC8x3.js"), __vite__mapDeps([10, 1, 2, 3, 4, 5, 6, 11])),
  ),
  _o = l.lazy(() =>
    A(() => import("./workflows-C7mK2Wi9.js"), __vite__mapDeps([12, 1, 2, 3, 4, 5, 6, 11, 13])),
  ),
  ko = l.lazy(() =>
    A(
      () => import("./workflows._id-3qH3HccR.js"),
      __vite__mapDeps([14, 1, 2, 3, 4, 5, 6, 15, 13, 11]),
    ),
  ),
  So = l.lazy(() =>
    A(() => import("./canales-CLQQaTt_.js"), __vite__mapDeps([16, 1, 2, 3, 4, 5, 6, 8, 17])),
  ),
  Lo = l.lazy(() =>
    A(
      () => import("./canales._id-BgsZtwa5.js"),
      __vite__mapDeps([18, 1, 2, 3, 4, 5, 6, 8, 19, 17]),
    ),
  ),
  Eo = l.lazy(() =>
    A(() => import("./apis-XN_NQ6u0.js"), __vite__mapDeps([20, 1, 2, 3, 4, 5, 6, 21])),
  ),
  Ao = l.lazy(() =>
    A(() => import("./apis._id-DKc-Xiup.js"), __vite__mapDeps([22, 1, 2, 3, 4, 5, 6, 21, 7])),
  ),
  Ro = l.lazy(() =>
    A(() => import("./funciones-B3yolDxo.js"), __vite__mapDeps([23, 1, 2, 3, 4, 5, 6])),
  ),
  Po = l.lazy(() =>
    A(() => import("./funciones.nuevo-C3oE2wx7.js"), __vite__mapDeps([24, 1, 2, 3, 4, 5, 6, 25])),
  ),
  Mo = l.lazy(() =>
    A(() => import("./funciones._id-D5odz40O.js"), __vite__mapDeps([26, 1, 2, 3, 4, 5, 6, 25])),
  ),
  Co = l.lazy(() =>
    A(() => import("./conocimiento-DqXDAZ7-.js"), __vite__mapDeps([27, 1, 2, 3, 4, 5, 6, 7])),
  ),
  Io = l.lazy(() =>
    A(
      () => import("./conocimiento.datos-B9pIQyw2.js"),
      __vite__mapDeps([28, 1, 2, 3, 4, 5, 6, 15]),
    ),
  ),
  zo = l.lazy(() =>
    A(() => import("./conocimiento.nuevo-De-j31hr.js"), __vite__mapDeps([29, 1, 2, 3, 4, 5, 6])),
  ),
  Oo = l.lazy(() =>
    A(() => import("./conocimiento._id-2Edo3WcO.js"), __vite__mapDeps([30, 1, 2, 3, 4, 5, 6])),
  ),
  To = l.lazy(() =>
    A(() => import("./embed.chat._id-CW7yxRQH.js"), __vite__mapDeps([31, 1, 19, 2, 3, 4, 5, 6])),
  ),
  Zt = l.lazy(() =>
    A(
      () => import("./forgot-password-B_xmyVh5.js"),
      __vite__mapDeps([32, 1, 2, 3, 4, 5, 6, 33, 7]),
    ),
  ),
  Jt = l.lazy(() =>
    A(() => import("./reset-password-WY9yfsLI.js"), __vite__mapDeps([34, 1, 2, 3, 4, 5, 6, 33, 7])),
  ),
  $o = l.lazy(() =>
    A(() => import("./admin-CEWZN_UE.js").then((t) => t.e), __vite__mapDeps([7, 1, 2, 3, 4, 5, 6])),
  ),
  Do = l.lazy(() =>
    A(() => import("./admin-CEWZN_UE.js").then((t) => t.f), __vite__mapDeps([7, 1, 2, 3, 4, 5, 6])),
  ),
  Bo = l.lazy(() =>
    A(() => import("./admin-CEWZN_UE.js").then((t) => t.g), __vite__mapDeps([7, 1, 2, 3, 4, 5, 6])),
  ),
  Fo = l.lazy(() =>
    A(() => import("./admin-CEWZN_UE.js").then((t) => t.h), __vite__mapDeps([7, 1, 2, 3, 4, 5, 6])),
  ),
  Ho = l.lazy(() =>
    A(() => import("./perfil-BK1WFsrp.js"), __vite__mapDeps([35, 1, 2, 3, 4, 5, 6, 7])),
  ),
  Wo = new ra({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: !1 } } });
function qo(t) {
  return (
    t === "/" ||
    t === "/entrar" ||
    t.startsWith("/forgot-password") ||
    t.startsWith("/reset-password") ||
    t.startsWith("/app/reset-password")
  );
}
function Yr() {
  const { pathname: t } = pe();
  return qo(t)
    ? e.jsx(Li, {})
    : e.jsx("div", {
        className: "h-dvh w-full bg-background",
        children: e.jsx(bn, { pathname: t, label: "Cargando" }),
      });
}
function Uo() {
  const { id: t } = jt();
  return e.jsx(Z, { to: `${yr}/${t}`, replace: !0 });
}
function Go() {
  const { id: t } = jt();
  return e.jsx(Z, { to: t ? `/skills/${t}` : "/skills", replace: !0 });
}
function Vo() {
  return e.jsx("div", {
    className: "flex min-h-[60vh] flex-col items-center justify-center px-6",
    children: e.jsx(fr, {
      title: "Esta página no existe",
      description:
        "El enlace puede estar roto o la sección se movió. Revisa la URL o vuelve al inicio.",
      action: e.jsx(ce, {
        asChild: !0,
        size: "sm",
        children: e.jsx(X, { to: "/app", children: "Ir al inicio" }),
      }),
    }),
  });
}
function Ko() {
  const t = pe(),
    r =
      t.pathname === "/app/chat" ||
      t.pathname.startsWith("/app/chat/") ||
      t.pathname.startsWith("/app/conversaciones") ||
      t.pathname.startsWith("/app/planes") ||
      t.pathname.startsWith("/app/workflows") ||
      /^\/app\/agentes\/[^/]+\/chat\/?$/.test(t.pathname),
    a = e.jsx(l.Suspense, {
      fallback: e.jsx(Yr, {}),
      children: e.jsx(Wr, {
        title: "Error en esta pantalla",
        children: e.jsxs(er, {
          location: t,
          children: [
            e.jsx(w, { path: "/", element: e.jsx(fo, {}) }),
            e.jsx(w, { path: "/agentes", element: e.jsx(bo, {}) }),
            e.jsx(w, { path: "/agentes/nuevo", element: e.jsx(yo, {}) }),
            e.jsx(w, { path: "/agentes/:id", element: e.jsx(jo, {}) }),
            e.jsx(w, { path: "/agentes/:id/chat", element: e.jsx(vo, {}) }),
            e.jsx(w, { path: "/chat", element: e.jsx(wo, {}) }),
            e.jsx(w, { path: "/planes", element: e.jsx(ot, { children: e.jsx(No, {}) }) }),
            e.jsx(w, { path: "/workflows", element: e.jsx(ot, { children: e.jsx(_o, {}) }) }),
            e.jsx(w, { path: "/workflows/:id", element: e.jsx(ot, { children: e.jsx(ko, {}) }) }),
            e.jsx(w, { path: "/canales", element: e.jsx(So, {}) }),
            e.jsx(w, { path: "/canales/:id", element: e.jsx(Lo, {}) }),
            e.jsx(w, { path: "/conocimiento", element: e.jsx(Pe, { children: e.jsx(Co, {}) }) }),
            e.jsx(w, {
              path: "/conocimiento/nuevo",
              element: e.jsx(Pe, { children: e.jsx(zo, {}) }),
            }),
            e.jsx(w, {
              path: "/conocimiento/datos",
              element: e.jsx(Pe, { children: e.jsx(Io, {}) }),
            }),
            e.jsx(w, {
              path: "/conocimiento/:id",
              element: e.jsx(Pe, { children: e.jsx(Oo, {}) }),
            }),
            e.jsx(w, { path: "/aplicaciones", element: e.jsx(Eo, {}) }),
            e.jsx(w, { path: "/aplicaciones/:id", element: e.jsx(Ao, {}) }),
            e.jsx(w, { path: "/apis", element: e.jsx(Z, { to: yr, replace: !0 }) }),
            e.jsx(w, { path: "/apis/:id", element: e.jsx(Uo, {}) }),
            e.jsx(w, { path: "/skills", element: e.jsx(it, { children: e.jsx(Ro, {}) }) }),
            e.jsx(w, { path: "/skills/nuevo", element: e.jsx(it, { children: e.jsx(Po, {}) }) }),
            e.jsx(w, { path: "/skills/:id", element: e.jsx(it, { children: e.jsx(Mo, {}) }) }),
            e.jsx(w, { path: "/funciones", element: e.jsx(Z, { to: "/app/skills", replace: !0 }) }),
            e.jsx(w, {
              path: "/funciones/nuevo",
              element: e.jsx(Z, { to: "/app/skills/nuevo", replace: !0 }),
            }),
            e.jsx(w, { path: "/funciones/:id", element: e.jsx(Go, {}) }),
            e.jsx(w, {
              path: "/configuracion",
              element: e.jsx(Z, { to: "/app/perfil", replace: !0 }),
            }),
            e.jsx(w, { path: "/perfil", element: e.jsx(Ho, {}) }),
            e.jsx(w, {
              path: "/admin/organizaciones",
              element: e.jsx(ci, { children: e.jsx(Do, {}) }),
            }),
            e.jsx(w, { path: "/admin/llm", element: e.jsx(di, { children: e.jsx($o, {}) }) }),
            e.jsx(w, {
              path: "/admin/sucursales",
              element: e.jsx(li, { children: e.jsx(Bo, {}) }),
            }),
            e.jsx(w, { path: "/admin/usuarios", element: e.jsx(oi, { children: e.jsx(Fo, {}) }) }),
            e.jsx(w, { path: "/conversaciones", element: e.jsx(ui, { children: e.jsx(go, {}) }) }),
            e.jsx(w, { path: "*", element: e.jsx(Vo, {}) }),
          ],
        }),
      }),
    });
  return r
    ? e.jsx("div", { className: "min-h-0 h-full", children: a })
    : e.jsx(ue, {
        mode: "wait",
        children: e.jsx(
          I.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: 0.03 },
            className: "min-h-0",
            children: a,
          },
          t.pathname,
        ),
      });
}
function Yo() {
  const t = pe();
  return e.jsx(he, {
    children: e.jsx(ue, {
      mode: "wait",
      children: e.jsx(
        I.div,
        {
          initial: { opacity: 0, x: t.pathname === "/entrar" ? 20 : -14 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: t.pathname === "/entrar" ? -14 : 20 },
          transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
          className: "min-h-dvh",
          children: e.jsx(ze, {}),
        },
        t.pathname,
      ),
    }),
  });
}
function Qo() {
  return e.jsx(l.Suspense, {
    fallback: e.jsx(Yr, {}),
    children: e.jsxs(er, {
      children: [
        e.jsxs(w, {
          element: e.jsx(Yo, {}),
          children: [
            e.jsx(w, { path: "/", element: e.jsx(Qt, {}) }),
            e.jsx(w, { path: "/entrar", element: e.jsx(ho, {}) }),
          ],
        }),
        e.jsx(w, { path: "/forgot-password", element: e.jsx(he, { children: e.jsx(Zt, {}) }) }),
        e.jsx(w, {
          path: "/forgot-password/:slug",
          element: e.jsx(he, { children: e.jsx(Zt, {}) }),
        }),
        e.jsx(w, {
          path: "/reset-password/:token",
          element: e.jsx(he, { children: e.jsx(Jt, {}) }),
        }),
        e.jsx(w, {
          path: "/app/reset-password/:token",
          element: e.jsx(he, { children: e.jsx(Jt, {}) }),
        }),
        e.jsx(w, { path: "/embed/chat/:id", element: e.jsx(To, {}) }),
        e.jsx(w, {
          element: e.jsx(ii, {}),
          children: e.jsx(w, {
            element: e.jsx(ni, {}),
            children: e.jsx(w, { path: "/app/*", element: e.jsx(Ko, {}) }),
          }),
        }),
        e.jsx(w, { path: "/:slug", element: e.jsx(he, { children: e.jsx(Qt, {}) }) }),
        e.jsx(w, { path: "*", element: e.jsx(Z, { to: "/", replace: !0 }) }),
      ],
    }),
  });
}
function Zo() {
  return e.jsx(ys, {
    children: e.jsx(ta, {
      client: Wo,
      children: e.jsx(xi, {
        children: e.jsx(Wr, {
          title: "Error en la aplicación",
          children: e.jsx(Xr, {
            children: e.jsxs(Ii, {
              children: [e.jsx(Qo, {}), e.jsx(Ri, { position: "top-right" }), e.jsx(Ai, {})],
            }),
          }),
        }),
      }),
    }),
  });
}
ea.createRoot(document.getElementById("root")).render(
  e.jsx(te.StrictMode, { children: e.jsx(Zo, {}) }),
);
export {
  Ur as A,
  We as L,
  ke as M,
  zt as P,
  kr as S,
  ol as a,
  Gr as b,
  no as c,
  Vr as d,
  Kr as e,
  ll as f,
  oo as g,
  io as h,
  sl as i,
  nl as j,
  il as k,
  ft as r,
  hn as u,
};
