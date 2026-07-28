import {
  ax as Zr,
  ay as et,
  az as at,
  r as t,
  j as e,
  aA as st,
  aB as mr,
  ag as Ln,
} from "./vendor-react-DUYfdZnL.js";
import {
  c as K,
  P as Hs,
  E as ts,
  a as nt,
  D as rt,
  G as tt,
  b as it,
  B as N,
  i as sn,
  d as Mn,
  e as ot,
  f as lt,
  g as ct,
  s as pr,
  h as Rs,
  u as dt,
  j as nn,
  k as gr,
  l as Wn,
  m as ut,
  L as Yn,
  n as mt,
  o as pt,
  p as gt,
  q as xt,
  r as ht,
  t as ft,
  v as jt,
  w as bt,
  x as Xn,
  y as Zn,
  A as rn,
  z as Fe,
  C as tn,
  R as $a,
  F as De,
  H as xr,
  I as Cs,
  J as vt,
  K as da,
  S as yt,
  M as Nt,
  T as On,
  N as En,
  O as Bs,
  Q as fn,
  U as g,
  V as f,
  W as He,
  X as Qe,
  Y as Je,
  Z as Ke,
  _ as _t,
  $ as de,
  a0 as Ss,
  a1 as jn,
  a2 as Ys,
  a3 as Za,
  a4 as bn,
  a5 as fa,
  a6 as vn,
  a7 as m,
  a8 as yn,
  a9 as hr,
  aa as Fs,
  ab as Ds,
  ac as $s,
  ad as Us,
  ae as ps,
  af as wt,
  ag as St,
  ah as Ct,
  ai as fr,
  aj as jr,
  ak as kt,
  al as At,
  am as kn,
  an as Pt,
  ao as Lt,
  ap as Mt,
  aq as Ot,
  ar as br,
  as as zn,
  at as Et,
  au as zt,
  av as vr,
  aw as It,
  ax as Tt,
  ay as Rt,
  az as Bt,
  aA as Ft,
  aB as Dt,
  aC as $t,
  aD as Ut,
  aE as qt,
  aF as Vt,
  aG as Gt,
  aH as Ht,
  aI as Qt,
  aJ as Jt,
  aK as yr,
  aL as In,
  aM as Tn,
  aN as Rn,
  aO as Bn,
  aP as Kt,
  aQ as Wt,
  aR as er,
  aS as Yt,
  aT as ar,
  aU as Nr,
  aV as _r,
  aW as wr,
  aX as Sr,
  aY as Cr,
  aZ as rs,
  a_ as kr,
  a$ as _a,
  b0 as Xt,
  b1 as Fn,
  b2 as Dn,
  b3 as $n,
  b4 as Un,
  b5 as qn,
  b6 as Vn,
  b7 as Gn,
  b8 as Hn,
  b9 as Ar,
  ba as Pr,
  bb as Zt,
  bc as ei,
  bd as ai,
  be as si,
  bf as ni,
  bg as Lr,
  bh as ri,
  bi as ti,
  bj as ii,
  bk as oi,
  bl as Nn,
  bm as li,
  bn as ci,
  bo as di,
  bp as ui,
  bq as mi,
  br as pi,
  bs as gi,
  bt as sr,
  bu as _n,
  bv as ys,
  bw as xi,
  bx as hi,
} from "./studio-chat-Bi-RYdat.js";
import { u as As, A as ks, m as xs } from "./vendor-motion-BE8MBDzG.js";
import { u as fi, a as hs, b as fs } from "./vendor-query-IAyuTf1L.js";
const ji = Zr,
  bi = et,
  vi = at,
  Mr = t.forwardRef(({ className: s, sideOffset: i = 4, ...o }, p) =>
    e.jsx(st, {
      children: e.jsx(mr, {
        ref: p,
        sideOffset: i,
        className: K(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
          s,
        ),
        ...o,
      }),
    }),
  );
Mr.displayName = mr.displayName;
const yi = new Set(["#1890ff"].map((s) => s.toLowerCase())),
  zs = {
    app_name: "Muninn",
    primary_color: "#2dd4bf",
    secondary_color: "#0d9488",
    algorithm: "dark",
  };
function Ns(s) {
  if (!s || typeof s != "string") return !1;
  const i = s.trim();
  return i.length > 0 && i !== "null" && i !== "undefined";
}
function Ni(s) {
  if (!s) return !1;
  const i = s.branding;
  return (
    Ns(s.logo_url) ||
    Ns(s.logo) ||
    Ns(s.favicon_url) ||
    Ns(s.favicon) ||
    (typeof i?.logo_url == "string" && Ns(i.logo_url)) ||
    (typeof i?.logo == "string" && Ns(i.logo))
  );
}
function _i(s) {
  if (!s) return !1;
  if (Ni(s)) return !0;
  const i = s.primary_color?.trim().toLowerCase();
  return i ? !yi.has(i) : !1;
}
function wi(s, i) {
  return _i(s)
    ? {
        ...s,
        primary_color: s.primary_color?.trim() || zs.primary_color,
        secondary_color: s.secondary_color?.trim() || zs.secondary_color,
        algorithm: "dark",
      }
    : s
      ? {
          ...zs,
          app_name: s.app_name || zs.app_name,
          tagline: s.tagline || void 0,
          logo: s.logo ?? void 0,
          logo_url: s.logo_url ?? void 0,
          favicon: s.favicon ?? void 0,
          favicon_url: s.favicon_url ?? void 0,
          branding: s.branding ?? void 0,
          algorithm: "dark",
        }
      : { ...zs, algorithm: "dark" };
}
const js = ["accounts", "users"];
function Or() {
  return fi({ queryKey: js, queryFn: () => tt(ts.users.list), staleTime: 3e4 });
}
function Si() {
  const s = hs();
  return fs({
    mutationFn: (i) => Hs(ts.users.createAndAssign, i),
    onSuccess: () => {
      (s.invalidateQueries({ queryKey: js }),
        s.invalidateQueries({ queryKey: ["branches", "users"] }));
    },
  });
}
function Ci() {
  const s = hs();
  return fs({
    mutationFn: ({ id: i, data: o }) => nt(ts.users.detail(i), o),
    onSuccess: () => s.invalidateQueries({ queryKey: js }),
  });
}
function ki() {
  const s = hs();
  return fs({
    mutationFn: (i) => rt(ts.users.detail(i)),
    onSuccess: () => s.invalidateQueries({ queryKey: js }),
  });
}
function Ai() {
  const s = hs();
  return fs({
    mutationFn: (i) =>
      Hs(ts.users.assignToBranch, {
        user_id: i.user_id,
        branch_id: i.branch_id,
        role: i.role,
        is_active: i.is_active ?? !0,
      }),
    onSuccess: () => {
      (s.invalidateQueries({ queryKey: js }),
        s.invalidateQueries({ queryKey: ["branches", "users"] }));
    },
  });
}
function Pi() {
  const s = hs();
  return fs({
    mutationFn: (i) => Hs(ts.users.changeUserRole, i),
    onSuccess: () => {
      (s.invalidateQueries({ queryKey: js }),
        s.invalidateQueries({ queryKey: ["branches", "users"] }));
    },
  });
}
function Li() {
  const s = hs();
  return fs({
    mutationFn: (i) => Hs(ts.users.toggleGlobalStatus, { user_id: i }),
    onSuccess: () => s.invalidateQueries({ queryKey: js }),
  });
}
function Mi() {
  return fs({ mutationFn: (s) => Hs(ts.users.generatePassword(s)) });
}
const Er = "!@#$%&*+-=",
  zr = "abcdefghijklmnopqrstuvwxyz",
  Ir = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  Tr = "0123456789",
  Oi = zr + Ir + Tr + Er;
function Rr(s) {
  const i = new Uint32Array(1);
  return (crypto.getRandomValues(i), i[0] % s);
}
function Is(s) {
  return s[Rr(s.length)];
}
function nr(s = 14) {
  const i = Math.max(8, s),
    o = [Is(Ir), Is(zr), Is(Tr), Is(Er)];
  for (let p = o.length; p < i; p++) o.push(Is(Oi));
  for (let p = o.length - 1; p > 0; p--) {
    const _ = Rr(p + 1);
    [o[p], o[_]] = [o[_], o[p]];
  }
  return o.join("");
}
async function An(s) {
  const i = String(s ?? "");
  if (!i) return !1;
  if (typeof navigator < "u" && navigator.clipboard?.writeText)
    try {
      return (await navigator.clipboard.writeText(i), !0);
    } catch {}
  try {
    const o = document.createElement("textarea");
    ((o.value = i),
      o.setAttribute("readonly", ""),
      (o.style.position = "fixed"),
      (o.style.left = "-9999px"),
      (o.style.top = "0"),
      document.body.appendChild(o),
      o.focus(),
      o.select(),
      o.setSelectionRange(0, i.length));
    const p = document.execCommand("copy");
    return (document.body.removeChild(o), p);
  } catch {
    return !1;
  }
}
function on({ variant: s = "table", className: i }) {
  return e.jsx(it, { variant: s, className: K(i), padded: !0 });
}
function ln({ countLabel: s, actions: i = [], leading: o, className: p }) {
  return e.jsxs("div", {
    className: K("mb-3 flex flex-wrap items-center justify-between gap-3", p),
    children: [
      e.jsxs("div", {
        className: "flex min-w-0 flex-wrap items-center gap-3",
        children: [
          s != null
            ? e.jsx("span", {
                className: "text-xs tabular-nums text-muted-foreground",
                children: s,
              })
            : null,
          o,
        ],
      }),
      i.length > 0
        ? e.jsx("div", {
            className: "hidden flex-wrap items-center gap-2 md:flex",
            children: i.map((_) => {
              const S = _.icon;
              return e.jsxs(
                N,
                {
                  size: "sm",
                  variant: _.variant ?? "outline",
                  onClick: _.onClick,
                  disabled: _.disabled,
                  children: [
                    S
                      ? e.jsx(S, { className: K("mr-1.5 h-4 w-4", _.spinning && "animate-spin") })
                      : null,
                    _.label,
                  ],
                },
                _.label,
              );
            }),
          })
        : null,
    ],
  });
}
function Xs(s, i) {
  if (s && typeof s == "object") {
    const o = s;
    if (typeof o.success == "boolean" || o.error || o.message) return o;
    const p = s;
    if (p.detail) return { success: !1, error: String(p.detail) };
  }
  return { success: !1, error: i || "Error desconocido" };
}
function Ei(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("es-CL");
  } catch {
    return s;
  }
}
const us = 15,
  Ts = 20;
function zi() {
  const s = sn(),
    i = Mn(),
    o = ot(),
    p = lt(),
    _ = ct(),
    S = pr(),
    [C, U] = t.useState(Rs),
    Z = C === Rs ? "all" : C,
    { data: W = [], isLoading: ee, isFetching: H, isError: F, refetch: B } = dt({ scope: Z }),
    { data: ae = [] } = nn({ enabled: o && s }),
    { data: D = [] } = gr(),
    z = t.useMemo(
      () =>
        s
          ? ae.map((a) => ({
              id: String(a.id),
              label:
                a.organization_name && a.organization_name !== a.fantasy_name
                  ? `${a.organization_name} · ${a.fantasy_name?.trim() || a.business_name || String(a.id)}`
                  : a.fantasy_name?.trim() || a.business_name || String(a.id),
            }))
          : D.map((a) => ({ id: String(a.value), label: a.label })),
      [s, ae, D],
    ),
    ce = t.useMemo(
      () => (!S || C === Rs ? W : W.filter((a) => (a.branches ?? []).some((d) => String(d) === C))),
      [W, S, C],
    ),
    [se, $e] = t.useState(null),
    [aa, We] = t.useState(!1),
    I = t.useMemo(() => ce.find((a) => String(a.id) === se) ?? null, [ce, se]),
    { data: wa, isLoading: ue } = Wn({ providerId: se, isActive: !0, enabled: !!se }),
    Me = wa?.results ?? [],
    [ja, sa] = t.useState(""),
    je = t.useDeferredValue(ja),
    [Ue, Q] = t.useState(1),
    me = t.useMemo(() => {
      const a = je.trim().toLowerCase();
      return a
        ? Me.filter((d) =>
            [d.name, d.model_id, d.description].filter(Boolean).join(" ").toLowerCase().includes(a),
          )
        : Me;
    }, [Me, je]),
    O = Math.max(1, Math.ceil(me.length / us)),
    be = Math.min(Ue, O),
    V = t.useMemo(() => {
      const a = (be - 1) * us;
      return me.slice(a, a + us);
    }, [me, be]);
  t.useEffect(() => {
    Q(1);
  }, [se, je]);
  const [ve, c] = t.useState(!1),
    [re, pe] = t.useState(""),
    Sa = t.useDeferredValue(re),
    [ge, na] = t.useState(1),
    [ye, ra] = t.useState([]),
    [Te, ia] = t.useState(!1),
    [Se, Ye] = t.useState(null);
  t.useEffect(() => {
    c(!1);
  }, [se, C]);
  const { data: Oe = [] } = ut(ve ? se : null),
    Ca = t.useMemo(() => {
      const a = new Set([...Yn, ...Oe]),
        d = Yn.filter((y) => a.has(y));
      for (const y of Oe) d.includes(y) || d.push(y);
      return d;
    }, [Oe]),
    {
      data: te,
      isLoading: za,
      isFetching: Xe,
    } = Wn({
      providerId: se,
      isActive: !1,
      isFree: Te || void 0,
      capabilities: ye.length ? ye : void 0,
      search: Sa,
      page: ge,
      pageSize: Ts,
      enabled: !!se && ve,
    }),
    Ze = te?.results ?? [],
    E = te?.count ?? 0,
    ka = Math.max(1, Math.ceil(E / Ts)),
    Ia = (a) => {
      (na(1), ra((d) => (d.includes(a) ? d.filter((y) => y !== a) : [...d, a])));
    };
  t.useEffect(() => {
    if (ce.length === 0) {
      !aa && se && $e(null);
      return;
    }
    (se && ce.some((a) => String(a.id) === se)) || aa || se || $e(String(ce[0].id));
  }, [ce, se, aa]);
  const qe = mt(),
    ua = pt(),
    Re = gt(),
    Ee = xt(),
    Ne = ht(),
    ba = ft(),
    Ce = jt(),
    ie = bt(),
    [ze, Aa] = t.useState("general"),
    [ne, ke] = t.useState(null),
    [ma, oe] = t.useState(""),
    [le, Pa] = t.useState("openai"),
    [Ua, va] = t.useState(""),
    [pa, Be] = t.useState(""),
    [ga, xa] = t.useState(""),
    [La, oa] = t.useState(!0),
    [ya, Ma] = t.useState(""),
    [n, j] = t.useState(""),
    [x, L] = t.useState([]),
    [J, R] = t.useState(""),
    [G, xe] = t.useState([]),
    [he, Oa] = t.useState({}),
    [qa, Ve] = t.useState(null),
    [Ie, Qa] = t.useState(""),
    [Y, Ja] = t.useState(""),
    [Ae, la] = t.useState("models"),
    [_e, ca] = t.useState("GET"),
    [Ta, Va] = t.useState(""),
    [ea, Ra] = t.useState("{}"),
    [$, Ba] = t.useState(null),
    Fa = t.useMemo(() => Xn[le] || {}, [le]),
    Ga = t.useMemo(() => {
      const a = {};
      for (const d of G) {
        const y = d.type.trim(),
          v = d.path.trim();
        y && v && (a[y] = v.startsWith("/") ? v : `/${v}`);
      }
      return Zn(le, a);
    }, [le, G]),
    ta = t.useMemo(
      () => (qa ? (G.find((a) => a.key === qa) ?? G[0] ?? null) : (G[0] ?? null)),
      [G, qa],
    ),
    Ka = (a, d) => {
      const y = Xn[d] || {},
        v = a?.endpoints && typeof a.endpoints == "object" ? a.endpoints : {},
        q = new Set([...Object.keys(y), ...Object.keys(v)]);
      return Array.from(q)
        .sort((ns, Ws) => ns.localeCompare(Ws))
        .map((ns) => ({ key: ns, type: ns, path: v[ns] || y[ns] || "" }));
    },
    is = (a) => {
      const d = a?.endpoints_payload_templates;
      if (!d || typeof d != "object") return {};
      const y = {};
      for (const [v, q] of Object.entries(d))
        try {
          y[v] = JSON.stringify(q ?? {}, null, 2);
        } catch {
          y[v] = "{}";
        }
      return y;
    },
    es = (a, d) => {
      const y = d?.[a]?.trim();
      if (y) {
        (Ra(y), ca(a === "models" || a === "embedding_models" ? "GET" : "POST"));
        return;
      }
      const v = bn(a);
      (ca(v.method), Ra(JSON.stringify(v.payload, null, 2)));
    },
    as = t.useMemo(() => {
      const a = J.trim().toLowerCase();
      return a ? z.filter((d) => d.label.toLowerCase().includes(a)) : z;
    }, [z, J]),
    [os, Wa] = t.useState(!1),
    [ls, cs] = t.useState(null),
    [l, u] = t.useState(""),
    [w, M] = t.useState(""),
    [h, k] = t.useState(""),
    [Ge, ha] = t.useState(""),
    [Ha, Da] = t.useState(""),
    [Ps, bs] = t.useState(!0),
    [fe, Na] = t.useState(!1),
    [pn, ss] = t.useState(!1),
    [X, vs] = t.useState(null),
    Qs = () => {
      I &&
        ba.mutate(I.id, {
          onSuccess: (a) => {
            const d = a,
              y = d.created ?? 0,
              v = d.updated ?? 0;
            (m.success(
              y || v
                ? `Catálogo sincronizado · ${y} nuevos, ${v} actualizados`
                : "Catálogo sincronizado",
            ),
              pe(""),
              na(1),
              ra([]),
              ia(!1),
              c(!0));
          },
          onError: (a) => m.error(a.friendlyMessage || "Falló sync"),
        });
    },
    gn = () => {
      (pe(""), na(1), ra([]), ia(!1), c(!0));
    },
    Js = (a) => {
      (Ye(String(a.id)),
        ie.mutate(
          { id: a.id, data: { is_active: !0 } },
          {
            onSuccess: () => {
              (m.success(`${a.name} activado`), Ye(null));
            },
            onError: (d) => {
              (Ye(null), m.error(d.friendlyMessage || "No se pudo activar"));
            },
          },
        ));
    },
    xn = () => {
      I &&
        Ee.mutate(I.id, {
          onSuccess: (a) => {
            (vs(Xs(a)), ss(!0));
          },
          onError: (a) => {
            const d = a,
              y = d.response?.data;
            (vs(Xs(y, a.friendlyMessage || d.message)), ss(!0));
          },
        });
    },
    Ls = () => {
      (oe(""), Pa("openai"), va(""), Be(""), xa(""), oa(!0), Ma(""), j(""), R(""), Aa("general"));
      const a = Ka(null, "openai");
      (xe(a),
        Oa({}),
        Ve(a[0]?.key ?? null),
        Qa(""),
        Ja(""),
        la("models"),
        es("models"),
        Va(""),
        Ba(null));
      const d = C !== Rs && z.some((q) => q.id === C) ? [C] : null,
        y = wt(),
        v =
          d ??
          (y && z.some((q) => q.id === y) ? [y] : i || s ? [] : z.length === 1 ? [z[0].id] : []);
      L(v);
    },
    Ms = () => {
      (ke(null), Ls(), We(!0));
    },
    Os = (a) => {
      ($e(String(a.id)),
        ke(a),
        oe(a.name),
        Pa(a.provider_type || "openai"),
        va(a.description || ""),
        Be(a.base_url || ""),
        xa(""),
        oa(a.is_active !== !1),
        Ma(a.test_system_prompt || ""),
        j(""),
        R(""),
        L((a.branches ?? []).map(String)));
      const d = Ka(a, a.provider_type || "openai");
      xe(d);
      const y = is(a);
      (Oa(y), Ve(d[0]?.key ?? null), Qa(""), Ja(""), Aa("general"));
      const v = d.find((q) => q.type === "models")?.type || d[0]?.type || "models";
      (la(v), es(v, y), Va(""), Ba(null), We(!0));
    },
    Es = () => {
      (We(!1), ke(null));
    },
    hn = (a) => {
      ($e(a), We(!1), ke(null));
    },
    r = (a) => {
      L((d) => (d.includes(a) ? d.filter((y) => y !== a) : [...d, a]));
    },
    b = () => L(z.map((a) => a.id)),
    A = () => L([]),
    T = (a, d) => {
      xe((y) => y.map((v) => (v.key === a ? { ...v, ...d } : v)));
    },
    P = (a) => {
      xe((d) => {
        const y = d.filter((v) => v.key !== a);
        return (Ve((v) => (v !== a ? v : (y[0]?.key ?? null))), y);
      });
    },
    Pe = () => {
      const a = Ie.trim().toLowerCase().replace(/\s+/g, "_"),
        d = Y.trim();
      if (!a || !d) {
        m.error("Tipo y ruta del endpoint requeridos");
        return;
      }
      if (G.some((v) => v.type === a)) {
        m.error(`Ya existe el endpoint «${a}»`);
        return;
      }
      const y = d.startsWith("/") ? d : `/${d}`;
      (xe((v) => [...v, { key: a, type: a, path: y }]), Ve(a), Qa(""), Ja(""));
    },
    ds = () => {
      const a = Ka(null, le);
      (xe(a), Ve(a[0]?.key ?? null));
    },
    Ks = () => {
      const a = (pa || "").replace(/\/+$/, ""),
        d = {};
      for (const y of G) {
        const v = y.type.trim();
        let q = y.path.trim();
        if (!(!v || !q)) {
          if (/^https?:\/\//i.test(q))
            if (a && q.toLowerCase().startsWith(a.toLowerCase())) q = q.slice(a.length) || "/";
            else
              try {
                q = new URL(q).pathname || q;
              } catch {}
          (q.startsWith("/") || (q = `/${q}`), (d[v] = q));
        }
      }
      return d;
    },
    Kn = () => {
      const a = {};
      for (const [d, y] of Object.entries(he)) {
        const v = y.trim();
        if (v)
          try {
            const q = JSON.parse(v);
            if (q && typeof q == "object" && !Array.isArray(q)) a[d] = q;
            else return (m.error(`Plantilla de «${d}» debe ser un objeto JSON`), null);
          } catch {
            return (m.error(`JSON inválido en plantilla de «${d}»`), null);
          }
      }
      return a;
    },
    Hr = (a) => {
      Pa(a);
      const d = Ka(null, a);
      (xe(d), Ve(d[0]?.key ?? null));
    },
    Qr = () => {
      if (!ma.trim()) {
        m.error("Nombre requerido");
        return;
      }
      if (!s && x.length === 0) {
        m.error("Selecciona al menos una sucursal");
        return;
      }
      if (!ne && !ga.trim() && le !== "ollama") {
        m.error("API key requerida");
        return;
      }
      if (ne && !ne.api_key_configured && !ga.trim() && le !== "ollama") {
        m.error("API key requerida");
        return;
      }
      const a = Kn();
      if (a === null) return;
      const d = {
        name: ma.trim(),
        provider_type: le,
        description: Ua.trim() || null,
        base_url: pa.trim() || null,
        is_active: La,
        auth_type: "api_key",
        test_system_prompt: ya.trim() || "",
        branches: x.map((v) => (Number.isNaN(Number(v)) ? v : Number(v))),
        endpoints: Ks(),
        endpoints_payload_templates: a,
      };
      ga.trim() && (d.api_key = ga.trim());
      const y = n.trim();
      if (y)
        try {
          const v = JSON.parse(y);
          if (!v || typeof v != "object" || Array.isArray(v)) {
            m.error("Headers extra deben ser un objeto JSON");
            return;
          }
          d.auth_config = { extra_headers: v };
        } catch {
          m.error("JSON inválido en headers extra");
          return;
        }
      ne
        ? ua.mutate(
            { id: ne.id, data: d },
            {
              onSuccess: (v) => {
                (m.success("LLM actualizado"), ke(v));
              },
              onError: (v) => m.error(v.friendlyMessage || "Error al guardar"),
            },
          )
        : qe.mutate(d, {
            onSuccess: (v) => {
              (m.success("LLM creado"), $e(String(v.id)), ke(v), We(!0), Aa("endpoints"));
            },
            onError: (v) => m.error(v.friendlyMessage || "Error al crear"),
          });
    },
    Jr = () => {
      if (!ne) {
        m.error("Guarda el LLM antes de probar endpoints");
        return;
      }
      let a = {};
      if (_e === "POST") {
        try {
          const d = JSON.parse(ea || "{}");
          if (d && typeof d == "object" && !Array.isArray(d)) a = d;
          else {
            m.error("El body debe ser un objeto JSON");
            return;
          }
        } catch {
          m.error("JSON inválido en el body");
          return;
        }
        Ta.trim() &&
          typeof a.model == "string" &&
          a.model.includes("{{model_id}}") &&
          (a = { ...a, model: Ta.trim() });
      }
      Ne.mutate(
        {
          id: ne.id,
          data: {
            endpoint_type: Ae,
            method: _e,
            model_id: Ta.trim() || void 0,
            payload: _e === "POST" ? a : {},
          },
        },
        {
          onSuccess: (d) => {
            const y = d.success !== !1 && !d.error;
            (Ba({ ...d, success: y }),
              y ? m.success("Endpoint OK") : m.error(d.error || "Falló la prueba"));
          },
          onError: (d) => {
            const y = d,
              v = y.response?.data;
            (Ba({
              success: !1,
              error: v?.error || d.friendlyMessage || y.message || "Error",
              ...(v && typeof v == "object" ? v : {}),
            }),
              m.error("Falló la prueba"));
          },
        },
      );
    },
    Kr = () => {
      se && (cs(null), u(""), M(""), k(""), ha(""), Da(""), bs(!0), Na(!1), Wa(!0));
    },
    Wr = (a) => {
      (cs(a),
        u(a.name),
        M(a.model_id || ""),
        k(a.description || ""),
        ha(a.max_tokens != null ? String(a.max_tokens) : ""),
        Da(a.context_window != null ? String(a.context_window) : ""),
        bs(a.is_active !== !1),
        Na(!!a.is_recommended),
        Wa(!0));
    },
    Yr = () => {
      if (!se || !l.trim() || !w.trim()) {
        m.error("Nombre y model_id requeridos");
        return;
      }
      const a = {
        name: l.trim(),
        model_id: w.trim(),
        provider: se,
        description: h.trim() || null,
        is_active: Ps,
        is_recommended: fe,
        max_tokens: Ge.trim() ? Number(Ge) : null,
        context_window: Ha.trim() ? Number(Ha) : null,
      };
      ls
        ? ie.mutate(
            { id: ls.id, data: a },
            {
              onSuccess: () => {
                (m.success("Modelo actualizado"), Wa(!1));
              },
              onError: (d) => m.error(d.friendlyMessage || "Error"),
            },
          )
        : Ce.mutate(a, {
            onSuccess: () => {
              (m.success("Modelo creado"), Wa(!1));
            },
            onError: (d) => m.error(d.friendlyMessage || "Error"),
          });
    },
    Xr = As();
  return e.jsx(ks, {
    mode: "wait",
    children: ee
      ? e.jsx(
          xs.div,
          {
            initial: Xr ? !1 : { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto",
            children: e.jsx(on, { variant: "split" }),
          },
          "skeleton",
        )
      : e.jsxs(
          rn,
          {
            children: [
              F &&
                e.jsx(Fe, {
                  children: e.jsx(tn, {
                    message: "No se pudieron cargar los LLMs.",
                    onRetry: () => {
                      B();
                    },
                  }),
                }),
              e.jsx(Fe, {
                children: e.jsx(ln, {
                  countLabel: `${ce.length} ${ce.length === 1 ? "LLM" : "LLMs"}${o ? "" : " · solo lectura"}`,
                  actions: [
                    {
                      label: "Actualizar",
                      icon: $a,
                      onClick: () => {
                        B();
                      },
                      disabled: H,
                      spinning: H,
                    },
                    ...(o ? [{ label: "Nuevo", icon: De, onClick: Ms, variant: "default" }] : []),
                  ],
                }),
              }),
              S &&
                e.jsx(Fe, {
                  children: e.jsx("div", {
                    className: "mb-2",
                    children: e.jsx(xr, {
                      value: C,
                      onValueChange: (a) => t.startTransition(() => U(a)),
                      options: z,
                      label: null,
                    }),
                  }),
                }),
              e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_1fr] gap-6 lg:gap-8",
                children: [
                  e.jsx(Fe, {
                    children: e.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        ce.length === 0 &&
                          e.jsx(Cs, {
                            title: "Sin LLMs",
                            description: "No hay proveedores configurados para este alcance.",
                            action: o
                              ? e.jsxs(N, {
                                  size: "sm",
                                  onClick: Ms,
                                  children: [e.jsx(De, { className: "h-4 w-4 mr-1.5" }), "Nuevo"],
                                })
                              : void 0,
                          }),
                        ce.map((a) =>
                          e.jsx(
                            Fe,
                            {
                              children: e.jsxs("button", {
                                type: "button",
                                onClick: () => hn(String(a.id)),
                                className: `w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${se === String(a.id) && !aa ? "bg-sidebar-accent text-primary" : se === String(a.id) && aa ? "bg-muted" : "hover:bg-muted"}`,
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-2.5 min-w-0",
                                    children: [
                                      e.jsx(vt, {
                                        className: `h-4 w-4 shrink-0 ${se === String(a.id) ? "text-primary" : "text-muted-foreground"}`,
                                      }),
                                      e.jsxs("div", {
                                        className: "min-w-0",
                                        children: [
                                          e.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              e.jsx("span", {
                                                className: "font-medium text-sm truncate",
                                                children: a.name,
                                              }),
                                              a.is_active === !1 &&
                                                e.jsx(da, {
                                                  variant: "secondary",
                                                  className: "text-[10px]",
                                                  children: "Off",
                                                }),
                                            ],
                                          }),
                                          o &&
                                            e.jsxs("div", {
                                              className:
                                                "text-[11px] text-muted-foreground truncate",
                                              children: [
                                                a.provider_type,
                                                " · ",
                                                a.api_key_configured ? "API key ok" : "Sin API key",
                                                a.branches?.length
                                                  ? ` · ${a.branches.length} suc.`
                                                  : "",
                                              ],
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  o &&
                                    e.jsx(N, {
                                      size: "icon",
                                      variant: "ghost",
                                      className: `h-7 w-7 shrink-0 ${aa && ne && String(ne.id) === String(a.id) ? "text-primary" : ""}`,
                                      onClick: (d) => {
                                        (d.stopPropagation(), Os(a));
                                      },
                                      children: e.jsx(yt, { className: "h-3.5 w-3.5" }),
                                    }),
                                ],
                              }),
                            },
                            String(a.id),
                          ),
                        ),
                      ],
                    }),
                  }),
                  e.jsx(Fe, {
                    children:
                      aa && o
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsx("div", {
                                className: "flex flex-wrap items-center justify-between gap-2 mb-4",
                                children: e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsxs(N, {
                                      size: "sm",
                                      variant: "ghost",
                                      className: "h-8 px-2",
                                      onClick: Es,
                                      children: [
                                        e.jsx(Nt, { className: "h-4 w-4 mr-1" }),
                                        "Modelos",
                                      ],
                                    }),
                                    e.jsx("h2", {
                                      className: "text-sm font-medium",
                                      children: ne ? "Configurar LLM" : "Nuevo LLM",
                                    }),
                                  ],
                                }),
                              }),
                              e.jsxs(On, {
                                value: ze,
                                onValueChange: Aa,
                                className: "max-w-3xl",
                                children: [
                                  e.jsxs(En, {
                                    className: "w-full justify-start overflow-x-auto",
                                    children: [
                                      e.jsx(Bs, { value: "general", children: "General" }),
                                      e.jsx(Bs, { value: "endpoints", children: "Endpoints" }),
                                      e.jsx(Bs, {
                                        value: "test",
                                        disabled: !ne,
                                        children: "Probar",
                                      }),
                                    ],
                                  }),
                                  e.jsxs(fn, {
                                    value: "general",
                                    className: "space-y-3 mt-4",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Nombre" }),
                                          e.jsx(f, {
                                            value: ma,
                                            onChange: (a) => oe(a.target.value),
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Tipo" }),
                                          e.jsxs(He, {
                                            value: le,
                                            onValueChange: Hr,
                                            children: [
                                              e.jsx(Qe, { children: e.jsx(Je, {}) }),
                                              e.jsx(Ke, {
                                                children: _t.map((a) =>
                                                  e.jsx(
                                                    de,
                                                    { value: a.value, children: a.label },
                                                    a.value,
                                                  ),
                                                ),
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Descripción" }),
                                          e.jsx(f, {
                                            value: Ua,
                                            onChange: (a) => va(a.target.value),
                                            placeholder: "Notas del LLM",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Base URL (opcional)" }),
                                          e.jsx(f, {
                                            value: pa,
                                            onChange: (a) => Be(a.target.value),
                                            placeholder: "https://...",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs(g, {
                                            children: [
                                              "API Key",
                                              " ",
                                              ne
                                                ? ne.api_key_configured
                                                  ? "(dejar vacío para no cambiar)"
                                                  : "(requerida)"
                                                : le === "ollama"
                                                  ? "(opcional)"
                                                  : "(requerida)",
                                            ],
                                          }),
                                          e.jsx(f, {
                                            type: "password",
                                            value: ga,
                                            onChange: (a) => xa(a.target.value),
                                            autoComplete: "off",
                                            placeholder: ne?.api_key_configured
                                              ? "••••••••"
                                              : "sk-...",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Headers extra (JSON, opcional)" }),
                                          e.jsx(Ss, {
                                            value: n,
                                            onChange: (a) => j(a.target.value),
                                            placeholder:
                                              '{"HTTP-Referer":"https://mi-app.com","X-Title":"Mi App"}',
                                            className: "font-mono text-xs min-h-[72px]",
                                          }),
                                          e.jsx("p", {
                                            className: "text-[11px] text-muted-foreground mt-1",
                                            children:
                                              "Se fusionan con Authorization / API key al llamar al LLM. Vacío = no modificar.",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "System prompt de prueba (chat)" }),
                                          e.jsx(Ss, {
                                            value: ya,
                                            onChange: (a) => Ma(a.target.value),
                                            placeholder:
                                              "Opcional · solo se usa al probar chat sin body custom",
                                            className: "min-h-[64px] text-sm",
                                          }),
                                        ],
                                      }),
                                      z.length > 0 &&
                                        e.jsxs("div", {
                                          children: [
                                            e.jsxs("div", {
                                              className:
                                                "mb-2 flex flex-wrap items-center justify-between gap-2",
                                              children: [
                                                e.jsxs(g, {
                                                  className: "mb-0",
                                                  children: [
                                                    "Sucursales",
                                                    s ? " (opcional)" : " *",
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  className: "flex items-center gap-2 text-[11px]",
                                                  children: [
                                                    e.jsxs("span", {
                                                      className: "text-muted-foreground",
                                                      children: [x.length, "/", z.length],
                                                    }),
                                                    e.jsx("button", {
                                                      type: "button",
                                                      className: "text-primary hover:underline",
                                                      onClick: b,
                                                      children: "Todas",
                                                    }),
                                                    e.jsx("span", {
                                                      className: "text-muted-foreground",
                                                      children: "·",
                                                    }),
                                                    e.jsx("button", {
                                                      type: "button",
                                                      className:
                                                        "text-muted-foreground hover:underline",
                                                      onClick: A,
                                                      children: "Ninguna",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            z.length > 6 &&
                                              e.jsx(f, {
                                                value: J,
                                                onChange: (a) => R(a.target.value),
                                                placeholder: "Buscar sucursal…",
                                                className: "mb-2 h-8 text-xs",
                                              }),
                                            e.jsxs("div", {
                                              className:
                                                "max-h-44 overflow-y-auto rounded-md border border-border p-2 space-y-1",
                                              children: [
                                                as.length === 0 &&
                                                  e.jsx("p", {
                                                    className:
                                                      "text-xs text-muted-foreground py-2 text-center",
                                                    children: "Sin resultados",
                                                  }),
                                                as.map((a) =>
                                                  e.jsxs(
                                                    "label",
                                                    {
                                                      className:
                                                        "flex items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-muted/60",
                                                      children: [
                                                        e.jsx("input", {
                                                          type: "checkbox",
                                                          checked: x.includes(a.id),
                                                          onChange: () => r(a.id),
                                                        }),
                                                        e.jsx("span", {
                                                          className: "truncate",
                                                          children: a.label,
                                                        }),
                                                      ],
                                                    },
                                                    a.id,
                                                  ),
                                                ),
                                              ],
                                            }),
                                            e.jsx("p", {
                                              className: "text-[11px] text-muted-foreground mt-1",
                                              children: s
                                                ? "Vacío = visible según reglas globales del API."
                                                : "El LLM quedará disponible solo en las sucursales marcadas.",
                                            }),
                                            x.length > 1 &&
                                              e.jsx("p", {
                                                className:
                                                  "text-[11px] text-amber-600 dark:text-amber-400 mt-1.5",
                                                children:
                                                  "Atención: una sola API key se comparte entre todas las sucursales marcadas. Si una se rompe (key inválida), fallan los agentes de todas. Preferí un proveedor LLM por sucursal.",
                                              }),
                                          ],
                                        }),
                                      e.jsxs("label", {
                                        className: "flex items-center gap-2 text-sm",
                                        children: [
                                          e.jsx("input", {
                                            type: "checkbox",
                                            checked: La,
                                            onChange: (a) => oa(a.target.checked),
                                          }),
                                          "Activo",
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs(fn, {
                                    value: "endpoints",
                                    className: "space-y-3 mt-4",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "flex flex-wrap items-center justify-between gap-2",
                                        children: [
                                          e.jsx("p", {
                                            className: "text-[11px] text-muted-foreground",
                                            children:
                                              "Rutas relativas a la Base URL. Elige un endpoint para editar su plantilla de body.",
                                          }),
                                          e.jsx("button", {
                                            type: "button",
                                            className:
                                              "text-[11px] text-muted-foreground hover:underline",
                                            onClick: ds,
                                            children: "Restaurar defaults",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
                                        children: [
                                          e.jsxs("div", {
                                            className:
                                              "rounded-md border border-border p-3 space-y-2",
                                            children: [
                                              e.jsx(g, { className: "mb-0", children: "Rutas" }),
                                              e.jsxs("div", {
                                                className: "space-y-2 max-h-64 overflow-y-auto",
                                                children: [
                                                  G.length === 0 &&
                                                    e.jsx("p", {
                                                      className:
                                                        "text-xs text-muted-foreground py-2 text-center",
                                                      children:
                                                        "Sin endpoints. Agrega al menos chat y models.",
                                                    }),
                                                  G.map((a) => {
                                                    const d =
                                                        Fa[a.type] !== void 0 &&
                                                        Fa[a.type] !== a.path.trim(),
                                                      y = Fa[a.type] === void 0,
                                                      v = ta?.key === a.key;
                                                    return e.jsx(
                                                      "button",
                                                      {
                                                        type: "button",
                                                        onClick: () => Ve(a.key),
                                                        className: `w-full text-left rounded-md border px-2 py-2 transition-colors ${v ? "border-primary/50 bg-primary/10" : "border-border hover:bg-muted/50"}`,
                                                        children: e.jsxs("div", {
                                                          className:
                                                            "flex items-start justify-between gap-2",
                                                          children: [
                                                            e.jsxs("div", {
                                                              className: "min-w-0 flex-1 space-y-1",
                                                              children: [
                                                                e.jsx(f, {
                                                                  value: a.type,
                                                                  onClick: (q) =>
                                                                    q.stopPropagation(),
                                                                  onChange: (q) =>
                                                                    T(a.key, {
                                                                      type: q.target.value
                                                                        .toLowerCase()
                                                                        .replace(/\s+/g, "_"),
                                                                    }),
                                                                  className:
                                                                    "h-7 font-mono text-xs",
                                                                  placeholder: "chat",
                                                                }),
                                                                e.jsx(f, {
                                                                  value: a.path,
                                                                  onClick: (q) =>
                                                                    q.stopPropagation(),
                                                                  onChange: (q) =>
                                                                    T(a.key, {
                                                                      path: q.target.value,
                                                                    }),
                                                                  className:
                                                                    "h-7 font-mono text-xs",
                                                                  placeholder: "/chat/completions",
                                                                }),
                                                                e.jsxs("p", {
                                                                  className:
                                                                    "text-[10px] text-muted-foreground font-mono truncate",
                                                                  children: [
                                                                    jn(a.type),
                                                                    d
                                                                      ? " · override"
                                                                      : y
                                                                        ? " · extra"
                                                                        : " · default",
                                                                    " · ",
                                                                    Ys(pa, a.path || "/"),
                                                                  ],
                                                                }),
                                                              ],
                                                            }),
                                                            e.jsx(N, {
                                                              type: "button",
                                                              size: "icon",
                                                              variant: "ghost",
                                                              className:
                                                                "h-7 w-7 text-destructive shrink-0",
                                                              onClick: (q) => {
                                                                (q.stopPropagation(),
                                                                  P(a.key),
                                                                  Oa((ns) => {
                                                                    const Ws = { ...ns };
                                                                    return (delete Ws[a.type], Ws);
                                                                  }));
                                                              },
                                                              children: e.jsx(Za, {
                                                                className: "h-3.5 w-3.5",
                                                              }),
                                                            }),
                                                          ],
                                                        }),
                                                      },
                                                      a.key,
                                                    );
                                                  }),
                                                ],
                                              }),
                                              e.jsxs("div", {
                                                className:
                                                  "grid grid-cols-1 sm:grid-cols-[7.5rem_1fr_auto] gap-1.5 pt-1 border-t border-border/60",
                                                children: [
                                                  e.jsx(f, {
                                                    value: Ie,
                                                    onChange: (a) => Qa(a.target.value),
                                                    className: "h-8 font-mono text-xs",
                                                    placeholder: "tipo",
                                                  }),
                                                  e.jsx(f, {
                                                    value: Y,
                                                    onChange: (a) => Ja(a.target.value),
                                                    className: "h-8 font-mono text-xs",
                                                    placeholder: "/ruta",
                                                  }),
                                                  e.jsxs(N, {
                                                    type: "button",
                                                    size: "sm",
                                                    variant: "outline",
                                                    className: "h-8",
                                                    onClick: Pe,
                                                    children: [
                                                      e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                                      " Add",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "rounded-md border border-border p-3 space-y-2",
                                            children: [
                                              e.jsxs("div", {
                                                children: [
                                                  e.jsxs(g, {
                                                    className: "mb-0",
                                                    children: [
                                                      "Plantilla de body",
                                                      ta ? ` · ${ta.type}` : "",
                                                    ],
                                                  }),
                                                  e.jsx("p", {
                                                    className:
                                                      "text-[11px] text-muted-foreground mt-0.5",
                                                    children:
                                                      "Se usa al probar / llamar si no envías un body distinto. Solo objetos JSON.",
                                                  }),
                                                ],
                                              }),
                                              ta
                                                ? e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(Ss, {
                                                        value: he[ta.type] ?? "",
                                                        onChange: (a) =>
                                                          Oa((d) => ({
                                                            ...d,
                                                            [ta.type]: a.target.value,
                                                          })),
                                                        placeholder: JSON.stringify(
                                                          bn(ta.type).payload,
                                                          null,
                                                          2,
                                                        ),
                                                        className:
                                                          "font-mono text-xs min-h-[220px]",
                                                      }),
                                                      e.jsxs("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: [
                                                          e.jsx(N, {
                                                            type: "button",
                                                            size: "sm",
                                                            variant: "outline",
                                                            onClick: () => {
                                                              const a = bn(ta.type);
                                                              Oa((d) => ({
                                                                ...d,
                                                                [ta.type]: JSON.stringify(
                                                                  a.payload,
                                                                  null,
                                                                  2,
                                                                ),
                                                              }));
                                                            },
                                                            children: "Sugerir body",
                                                          }),
                                                          e.jsx(N, {
                                                            type: "button",
                                                            size: "sm",
                                                            variant: "ghost",
                                                            onClick: () =>
                                                              Oa((a) => {
                                                                const d = { ...a };
                                                                return (delete d[ta.type], d);
                                                              }),
                                                            children: "Limpiar",
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  })
                                                : e.jsx("p", {
                                                    className:
                                                      "text-xs text-muted-foreground py-8 text-center",
                                                    children:
                                                      "Selecciona un endpoint a la izquierda.",
                                                  }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      Object.keys(Ga).length > 0 &&
                                        e.jsxs("details", {
                                          className: "text-[11px] text-muted-foreground",
                                          children: [
                                            e.jsxs("summary", {
                                              className: "cursor-pointer hover:text-foreground",
                                              children: [
                                                "Vista efectiva (",
                                                Object.keys(Ga).length,
                                                ")",
                                              ],
                                            }),
                                            e.jsx("ul", {
                                              className: "mt-1 space-y-0.5 font-mono",
                                              children: Object.entries(Ga)
                                                .sort(([a], [d]) => a.localeCompare(d))
                                                .map(([a, d]) =>
                                                  e.jsxs(
                                                    "li",
                                                    {
                                                      className: "truncate",
                                                      children: [
                                                        e.jsx("span", {
                                                          className: "text-foreground/80",
                                                          children: a,
                                                        }),
                                                        " →",
                                                        " ",
                                                        Ys(pa, d),
                                                      ],
                                                    },
                                                    a,
                                                  ),
                                                ),
                                            }),
                                          ],
                                        }),
                                    ],
                                  }),
                                  e.jsx(fn, {
                                    value: "test",
                                    className: "space-y-3 mt-4",
                                    children: ne
                                      ? e.jsxs(e.Fragment, {
                                          children: [
                                            e.jsx("p", {
                                              className: "text-[11px] text-muted-foreground",
                                              children:
                                                "Envía una petición real con el method, body y auth del LLM. La respuesta muestra headers, payload enviado y body crudo.",
                                            }),
                                            e.jsxs("div", {
                                              className: "grid gap-3 sm:grid-cols-2",
                                              children: [
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx(g, { children: "Endpoint" }),
                                                    e.jsxs(He, {
                                                      value: Ae,
                                                      onValueChange: (a) => {
                                                        (la(a), es(a, he), Ba(null));
                                                      },
                                                      children: [
                                                        e.jsx(Qe, { children: e.jsx(Je, {}) }),
                                                        e.jsx(Ke, {
                                                          children: Object.keys(Ga)
                                                            .sort((a, d) => a.localeCompare(d))
                                                            .map((a) =>
                                                              e.jsxs(
                                                                de,
                                                                {
                                                                  value: a,
                                                                  children: [jn(a), " (", a, ")"],
                                                                },
                                                                a,
                                                              ),
                                                            ),
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx(g, { children: "Method" }),
                                                    e.jsxs(He, {
                                                      value: _e,
                                                      onValueChange: (a) => ca(a),
                                                      children: [
                                                        e.jsx(Qe, { children: e.jsx(Je, {}) }),
                                                        e.jsxs(Ke, {
                                                          children: [
                                                            e.jsx(de, {
                                                              value: "GET",
                                                              children: "GET",
                                                            }),
                                                            e.jsx(de, {
                                                              value: "POST",
                                                              children: "POST",
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "model_id (opcional)" }),
                                                e.jsx(f, {
                                                  value: Ta,
                                                  onChange: (a) => Va(a.target.value),
                                                  placeholder: "openai/gpt-4o-mini",
                                                  className: "font-mono text-sm",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              className:
                                                "rounded-md border border-border/80 bg-muted/30 px-3 py-2 text-[11px] font-mono space-y-1",
                                              children: [
                                                e.jsxs("p", {
                                                  children: [
                                                    e.jsx("span", {
                                                      className: "text-muted-foreground",
                                                      children: "URL · ",
                                                    }),
                                                    Ys(pa || ne.base_url, Ga[Ae] || "/"),
                                                  ],
                                                }),
                                                e.jsxs("p", {
                                                  children: [
                                                    e.jsx("span", {
                                                      className: "text-muted-foreground",
                                                      children: "Auth · ",
                                                    }),
                                                    le === "anthropic"
                                                      ? "x-api-key"
                                                      : le === "google"
                                                        ? "x-goog-api-key"
                                                        : "Authorization: Bearer …",
                                                    n.trim() ? " + extra_headers" : "",
                                                  ],
                                                }),
                                              ],
                                            }),
                                            _e === "POST" &&
                                              e.jsxs("div", {
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "flex items-center justify-between gap-2 mb-1",
                                                    children: [
                                                      e.jsx(g, {
                                                        className: "mb-0",
                                                        children: "Body (JSON)",
                                                      }),
                                                      e.jsx("button", {
                                                        type: "button",
                                                        className:
                                                          "text-[11px] text-muted-foreground hover:underline",
                                                        onClick: () => es(Ae, he),
                                                        children: "Usar plantilla / sugerencia",
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsx(Ss, {
                                                    value: ea,
                                                    onChange: (a) => Ra(a.target.value),
                                                    className: "font-mono text-xs min-h-[180px]",
                                                  }),
                                                ],
                                              }),
                                            e.jsxs("div", {
                                              className: "flex flex-wrap gap-2",
                                              children: [
                                                e.jsxs(N, {
                                                  onClick: Jr,
                                                  disabled: Ne.isPending,
                                                  children: [
                                                    Ne.isPending
                                                      ? e.jsx(fa, {
                                                          className:
                                                            "h-3.5 w-3.5 mr-1 animate-spin",
                                                        })
                                                      : e.jsx(vn, {
                                                          className: "h-3.5 w-3.5 mr-1",
                                                        }),
                                                    "Ejecutar",
                                                  ],
                                                }),
                                                e.jsxs(N, {
                                                  variant: "outline",
                                                  disabled: Ee.isPending,
                                                  onClick: () => {
                                                    Ee.mutate(ne.id, {
                                                      onSuccess: (a) => {
                                                        (vs(Xs(a)), ss(!0));
                                                      },
                                                      onError: (a) => {
                                                        const d = a;
                                                        (vs(
                                                          Xs(
                                                            d.response?.data,
                                                            a.friendlyMessage || d.message,
                                                          ),
                                                        ),
                                                          ss(!0));
                                                      },
                                                    });
                                                  },
                                                  children: [
                                                    Ee.isPending
                                                      ? e.jsx(fa, {
                                                          className:
                                                            "h-3.5 w-3.5 mr-1 animate-spin",
                                                        })
                                                      : e.jsx(vn, {
                                                          className: "h-3.5 w-3.5 mr-1",
                                                        }),
                                                    "Test conexión (models)",
                                                  ],
                                                }),
                                              ],
                                            }),
                                            $ &&
                                              e.jsxs("div", {
                                                className:
                                                  "rounded-md border border-border space-y-3 p-3",
                                                children: [
                                                  e.jsxs("div", {
                                                    className: "flex flex-wrap items-center gap-2",
                                                    children: [
                                                      e.jsx(da, {
                                                        variant: $.success
                                                          ? "default"
                                                          : "destructive",
                                                        className: "text-[10px]",
                                                        children: $.success ? "OK" : "Falló",
                                                      }),
                                                      $.status_code != null &&
                                                        e.jsxs("span", {
                                                          className: "font-mono text-xs",
                                                          children: ["HTTP ", $.status_code],
                                                        }),
                                                      $.latency_ms != null &&
                                                        e.jsxs("span", {
                                                          className:
                                                            "text-xs text-muted-foreground",
                                                          children: [$.latency_ms, " ms"],
                                                        }),
                                                    ],
                                                  }),
                                                  ($.endpoint || $.method) &&
                                                    e.jsxs("p", {
                                                      className:
                                                        "font-mono text-[11px] break-all rounded-md bg-muted px-2 py-1.5",
                                                      children: [
                                                        $.method ? `${$.method} ` : "",
                                                        $.endpoint,
                                                      ],
                                                    }),
                                                  $.error &&
                                                    e.jsx("p", {
                                                      className:
                                                        "text-xs text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2",
                                                      children: $.error,
                                                    }),
                                                  e.jsxs("div", {
                                                    className: "grid gap-3 sm:grid-cols-2",
                                                    children: [
                                                      $.headers_sent &&
                                                        Object.keys($.headers_sent).length > 0 &&
                                                        e.jsxs("div", {
                                                          className: "min-w-0",
                                                          children: [
                                                            e.jsx("span", {
                                                              className:
                                                                "text-muted-foreground text-xs",
                                                              children: "Headers",
                                                            }),
                                                            e.jsx("pre", {
                                                              className:
                                                                "mt-1 max-h-40 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono",
                                                              children: JSON.stringify(
                                                                $.headers_sent,
                                                                null,
                                                                2,
                                                              ),
                                                            }),
                                                          ],
                                                        }),
                                                      $.payload_sent &&
                                                        Object.keys($.payload_sent).length > 0 &&
                                                        e.jsxs("div", {
                                                          className: "min-w-0",
                                                          children: [
                                                            e.jsx("span", {
                                                              className:
                                                                "text-muted-foreground text-xs",
                                                              children: "Body enviado",
                                                            }),
                                                            e.jsx("pre", {
                                                              className:
                                                                "mt-1 max-h-40 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono",
                                                              children: JSON.stringify(
                                                                $.payload_sent,
                                                                null,
                                                                2,
                                                              ),
                                                            }),
                                                          ],
                                                        }),
                                                    ],
                                                  }),
                                                  ($.raw_response != null || $.response) &&
                                                    e.jsxs("div", {
                                                      className: "min-w-0",
                                                      children: [
                                                        e.jsx("span", {
                                                          className:
                                                            "text-muted-foreground text-xs",
                                                          children: "Respuesta",
                                                        }),
                                                        e.jsx("pre", {
                                                          className:
                                                            "mt-1 max-h-56 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono whitespace-pre-wrap break-all",
                                                          children:
                                                            typeof $.raw_response == "string"
                                                              ? $.raw_response
                                                              : $.raw_response != null
                                                                ? JSON.stringify(
                                                                    $.raw_response,
                                                                    null,
                                                                    2,
                                                                  )
                                                                : $.response,
                                                        }),
                                                      ],
                                                    }),
                                                ],
                                              }),
                                          ],
                                        })
                                      : e.jsx("p", {
                                          className: "text-sm text-muted-foreground",
                                          children:
                                            "Guarda el LLM primero para poder probar endpoints.",
                                        }),
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex flex-wrap items-center gap-2 pt-4 max-w-3xl",
                                children: [
                                  e.jsx(N, {
                                    onClick: Qr,
                                    disabled: qe.isPending || ua.isPending,
                                    children: "Guardar",
                                  }),
                                  e.jsx(N, { variant: "ghost", onClick: Es, children: "Cancelar" }),
                                  ne &&
                                    e.jsxs(N, {
                                      variant: "ghost",
                                      className: "text-destructive hover:text-destructive ml-auto",
                                      disabled: Re.isPending,
                                      onClick: () => {
                                        confirm(`¿Eliminar LLM ${ne.name}?`) &&
                                          Re.mutate(ne.id, {
                                            onSuccess: () => {
                                              (m.success("Eliminado"), $e(null), Es());
                                            },
                                            onError: (a) =>
                                              m.error(a.friendlyMessage || "No se pudo eliminar"),
                                          });
                                      },
                                      children: [
                                        e.jsx(Za, { className: "h-3.5 w-3.5 mr-1.5" }),
                                        " Eliminar",
                                      ],
                                    }),
                                ],
                              }),
                            ],
                          })
                        : e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className: "flex flex-wrap items-center justify-between gap-2 mb-3",
                                children: [
                                  e.jsxs("div", {
                                    className: "min-w-0",
                                    children: [
                                      e.jsx("h2", {
                                        className: "text-sm font-medium",
                                        children: "Modelos activos",
                                      }),
                                      I &&
                                        e.jsxs("p", {
                                          className: "text-[11px] text-muted-foreground",
                                          children: [
                                            Me.length,
                                            " activo",
                                            Me.length === 1 ? "" : "s",
                                            me.length > us ? ` · pág. ${be}/${O}` : "",
                                          ],
                                        }),
                                    ],
                                  }),
                                  I &&
                                    e.jsxs("div", {
                                      className: "flex gap-1",
                                      children: [
                                        e.jsxs(N, {
                                          size: "sm",
                                          variant: "outline",
                                          disabled: Ee.isPending,
                                          onClick: xn,
                                          children: [
                                            Ee.isPending
                                              ? e.jsx(fa, {
                                                  className: "h-3.5 w-3.5 mr-1 animate-spin",
                                                })
                                              : e.jsx(vn, { className: "h-3.5 w-3.5 mr-1" }),
                                            "Test",
                                          ],
                                        }),
                                        _ &&
                                          e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsxs(N, {
                                                size: "sm",
                                                variant: "outline",
                                                disabled: ba.isPending,
                                                onClick: Qs,
                                                children: [
                                                  ba.isPending
                                                    ? e.jsx(fa, {
                                                        className: "h-3.5 w-3.5 mr-1 animate-spin",
                                                      })
                                                    : e.jsx($a, { className: "h-3.5 w-3.5 mr-1" }),
                                                  "Sync",
                                                ],
                                              }),
                                              e.jsx(N, {
                                                size: "sm",
                                                variant: "outline",
                                                onClick: gn,
                                                children: "Catálogo",
                                              }),
                                            ],
                                          }),
                                        p &&
                                          e.jsxs(N, {
                                            size: "sm",
                                            onClick: Kr,
                                            children: [
                                              e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                              " Modelo",
                                            ],
                                          }),
                                      ],
                                    }),
                                ],
                              }),
                              I &&
                                Me.length > 0 &&
                                e.jsx("div", {
                                  className: "mb-3",
                                  children: e.jsx(f, {
                                    value: ja,
                                    onChange: (a) => sa(a.target.value),
                                    placeholder: "Buscar modelo activo…",
                                    className: "h-8 text-xs",
                                  }),
                                }),
                              I &&
                                e.jsxs("details", {
                                  className:
                                    "mb-3 rounded-md border border-border/80 px-3 py-2 text-xs",
                                  children: [
                                    e.jsxs("summary", {
                                      className:
                                        "cursor-pointer text-muted-foreground hover:text-foreground",
                                      children: [
                                        "Endpoints del LLM",
                                        I.base_url
                                          ? e.jsxs("span", {
                                              className: "font-mono text-[10px] ml-1.5 opacity-80",
                                              children: ["· ", I.base_url],
                                            })
                                          : null,
                                      ],
                                    }),
                                    e.jsx("ul", {
                                      className: "mt-2 space-y-1 font-mono text-[11px]",
                                      children: Object.entries(Zn(I.provider_type, I.endpoints))
                                        .sort(([a], [d]) => a.localeCompare(d))
                                        .map(([a, d]) => {
                                          const y =
                                            I.endpoints &&
                                            typeof I.endpoints == "object" &&
                                            a in I.endpoints;
                                          return e.jsxs(
                                            "li",
                                            {
                                              className:
                                                "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
                                              children: [
                                                e.jsxs("span", {
                                                  className: "text-foreground/90 min-w-[7rem]",
                                                  children: [
                                                    jn(a),
                                                    e.jsxs("span", {
                                                      className: "text-muted-foreground",
                                                      children: [" (", a, ")"],
                                                    }),
                                                  ],
                                                }),
                                                e.jsx("span", {
                                                  className: "truncate text-muted-foreground",
                                                  children:
                                                    I.chat_url && a === "chat"
                                                      ? I.chat_url
                                                      : I.models_url && a === "models"
                                                        ? I.models_url
                                                        : Ys(I.base_url, d),
                                                }),
                                                y &&
                                                  e.jsx(da, {
                                                    variant: "outline",
                                                    className: "text-[9px] h-4 px-1",
                                                    children: "override",
                                                  }),
                                              ],
                                            },
                                            a,
                                          );
                                        }),
                                    }),
                                    o &&
                                      e.jsx("button", {
                                        type: "button",
                                        className: "mt-2 text-[11px] text-primary hover:underline",
                                        onClick: () => {
                                          (Os(I), Aa("endpoints"));
                                        },
                                        children: "Editar endpoints…",
                                      }),
                                  ],
                                }),
                              e.jsxs("div", {
                                className: "divide-y divide-border/60",
                                children: [
                                  !I &&
                                    e.jsx("p", {
                                      className: "text-sm text-muted-foreground py-8 text-center",
                                      children: "Elige un LLM a la izquierda.",
                                    }),
                                  I &&
                                    ue &&
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-2 px-1 py-4 text-sm text-muted-foreground",
                                      children: [
                                        e.jsx(fa, { className: "h-3.5 w-3.5 animate-spin" }),
                                        "Cargando modelos…",
                                      ],
                                    }),
                                  I &&
                                    !ue &&
                                    V.map((a) =>
                                      e.jsx(
                                        Fe,
                                        {
                                          children: e.jsxs("div", {
                                            className:
                                              "flex items-center justify-between gap-2 px-1 py-2.5",
                                            children: [
                                              e.jsxs("div", {
                                                className: "min-w-0",
                                                children: [
                                                  e.jsxs("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                      e.jsx("span", {
                                                        className: "font-medium text-sm truncate",
                                                        children: a.name,
                                                      }),
                                                      a.is_recommended &&
                                                        e.jsx(da, {
                                                          variant: "secondary",
                                                          className: "text-[10px]",
                                                          children: "Rec.",
                                                        }),
                                                    ],
                                                  }),
                                                  e.jsxs("div", {
                                                    className:
                                                      "text-[11px] text-muted-foreground font-mono truncate",
                                                    children: [
                                                      a.model_id,
                                                      a.context_window != null
                                                        ? ` · ctx ${a.context_window}`
                                                        : "",
                                                    ],
                                                  }),
                                                  (() => {
                                                    const d =
                                                      a.capabilities &&
                                                      typeof a.capabilities == "object" &&
                                                      !Array.isArray(a.capabilities)
                                                        ? Object.entries(a.capabilities)
                                                            .filter(([, y]) => y === !0)
                                                            .map(([y]) => y)
                                                        : [];
                                                    return d.length
                                                      ? e.jsx("div", {
                                                          className: "mt-1 flex flex-wrap gap-1",
                                                          children: d
                                                            .slice(0, 3)
                                                            .map((y) =>
                                                              e.jsx(
                                                                da,
                                                                {
                                                                  variant: "outline",
                                                                  className: "text-[10px]",
                                                                  children: yn(y),
                                                                },
                                                                y,
                                                              ),
                                                            ),
                                                        })
                                                      : null;
                                                  })(),
                                                ],
                                              }),
                                              e.jsxs("div", {
                                                className: "flex gap-0.5 shrink-0",
                                                children: [
                                                  p &&
                                                    e.jsx(N, {
                                                      size: "icon",
                                                      variant: "ghost",
                                                      className: "h-7 w-7",
                                                      onClick: () => Wr(a),
                                                      children: e.jsx(hr, {
                                                        className: "h-3.5 w-3.5",
                                                      }),
                                                    }),
                                                  o &&
                                                    e.jsx(N, {
                                                      size: "icon",
                                                      variant: "ghost",
                                                      className: "h-7 w-7 text-destructive",
                                                      onClick: () =>
                                                        ie.mutate(
                                                          { id: a.id, data: { is_active: !1 } },
                                                          {
                                                            onSuccess: () =>
                                                              m.success("Modelo desactivado"),
                                                            onError: (d) =>
                                                              m.error(d.friendlyMessage || "Error"),
                                                          },
                                                        ),
                                                      children: e.jsx(Za, {
                                                        className: "h-3.5 w-3.5",
                                                      }),
                                                    }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        },
                                        String(a.id),
                                      ),
                                    ),
                                  I &&
                                    !ue &&
                                    Me.length === 0 &&
                                    e.jsxs("div", {
                                      className: "py-6 text-center space-y-2",
                                      children: [
                                        e.jsx("p", {
                                          className: "text-sm text-muted-foreground",
                                          children: "Sin modelos activos.",
                                        }),
                                        _ &&
                                          e.jsxs(N, {
                                            size: "sm",
                                            variant: "outline",
                                            onClick: Qs,
                                            children: [
                                              e.jsx($a, { className: "h-3.5 w-3.5 mr-1" }),
                                              " Sincronizar catálogo",
                                            ],
                                          }),
                                      ],
                                    }),
                                  I &&
                                    !ue &&
                                    Me.length > 0 &&
                                    me.length === 0 &&
                                    e.jsx("p", {
                                      className: "text-sm text-muted-foreground py-6 text-center",
                                      children: "Sin resultados para esa búsqueda.",
                                    }),
                                  I &&
                                    !ue &&
                                    me.length > us &&
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center justify-between gap-2 py-3 text-xs text-muted-foreground",
                                      children: [
                                        e.jsxs("span", {
                                          children: [
                                            (be - 1) * us + 1,
                                            "–",
                                            Math.min(be * us, me.length),
                                            " ",
                                            "de ",
                                            me.length,
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className: "flex gap-1",
                                          children: [
                                            e.jsx(N, {
                                              size: "sm",
                                              variant: "outline",
                                              className: "h-7 px-2",
                                              disabled: be <= 1,
                                              onClick: () => Q((a) => Math.max(1, a - 1)),
                                              children: "Anterior",
                                            }),
                                            e.jsx(N, {
                                              size: "sm",
                                              variant: "outline",
                                              className: "h-7 px-2",
                                              disabled: be >= O,
                                              onClick: () => Q((a) => Math.min(O, a + 1)),
                                              children: "Siguiente",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                ],
                              }),
                            ],
                          }),
                  }),
                ],
              }),
              e.jsx(Fs, {
                open: pn,
                onOpenChange: ss,
                children: e.jsxs(Ds, {
                  className: "w-full max-w-2xl gap-4 p-4 sm:p-6",
                  children: [
                    e.jsx($s, {
                      children: e.jsxs(Us, {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                          "Prueba de conexión",
                          X &&
                            e.jsx(da, {
                              variant: X.success ? "default" : "destructive",
                              className: "text-[10px]",
                              children: X.success ? "OK" : "Falló",
                            }),
                        ],
                      }),
                    }),
                    X &&
                      e.jsxs("div", {
                        className: "space-y-3 text-sm",
                        children: [
                          e.jsxs("div", {
                            className: "grid gap-3 sm:grid-cols-2",
                            children: [
                              X.provider_name &&
                                e.jsxs("div", {
                                  className: "min-w-0",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "LLM",
                                    }),
                                    e.jsxs("p", {
                                      className: "font-medium truncate",
                                      children: [
                                        X.provider_name,
                                        X.provider
                                          ? e.jsxs("span", {
                                              className: "text-muted-foreground font-normal",
                                              children: [" ", "· ", X.provider],
                                            })
                                          : null,
                                      ],
                                    }),
                                  ],
                                }),
                              X.timestamp &&
                                e.jsxs("div", {
                                  className: "min-w-0 sm:text-right",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "Fecha",
                                    }),
                                    e.jsx("p", {
                                      className: "text-xs sm:text-sm",
                                      children: Ei(X.timestamp),
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          X.url_tested &&
                            e.jsxs("div", {
                              className: "min-w-0",
                              children: [
                                e.jsx("span", {
                                  className: "text-muted-foreground text-xs",
                                  children: "URL probada",
                                }),
                                e.jsxs("p", {
                                  className:
                                    "mt-0.5 font-mono text-[11px] break-all rounded-md bg-muted px-2 py-1.5 leading-snug",
                                  children: [X.method ? `${X.method} ` : "", X.url_tested],
                                }),
                              ],
                            }),
                          e.jsxs("div", {
                            className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
                            children: [
                              X.status_code != null &&
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "HTTP",
                                    }),
                                    e.jsx("p", {
                                      className: "font-mono font-medium",
                                      children: X.status_code,
                                    }),
                                  ],
                                }),
                              X.latency_ms != null &&
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "Latencia",
                                    }),
                                    e.jsxs("p", {
                                      className: "font-mono font-medium",
                                      children: [X.latency_ms, " ms"],
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          (X.message || X.error) &&
                            e.jsx("div", {
                              className: `rounded-md border px-3 py-2 text-xs ${X.success ? "border-primary/30 bg-primary/5 text-foreground" : "border-destructive/30 bg-destructive/5 text-destructive"}`,
                              children: X.success ? X.message : X.error,
                            }),
                          e.jsxs("div", {
                            className: "grid gap-3 sm:grid-cols-2",
                            children: [
                              X.headers_sent &&
                                Object.keys(X.headers_sent).length > 0 &&
                                e.jsxs("div", {
                                  className: "min-w-0",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "Headers enviados",
                                    }),
                                    e.jsx("pre", {
                                      className:
                                        "mt-1 max-h-24 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono leading-snug",
                                      children: JSON.stringify(X.headers_sent, null, 2),
                                    }),
                                  ],
                                }),
                              X.response_preview &&
                                e.jsxs("div", {
                                  className: "min-w-0",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground text-xs",
                                      children: "Vista previa de respuesta",
                                    }),
                                    e.jsx("pre", {
                                      className:
                                        "mt-1 max-h-24 overflow-auto rounded-md bg-muted p-2 text-[10px] font-mono whitespace-pre-wrap break-all leading-snug",
                                      children: X.response_preview,
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          e.jsx(N, {
                            className: "w-full sm:w-auto sm:min-w-[8rem]",
                            onClick: () => ss(!1),
                            children: "Cerrar",
                          }),
                        ],
                      }),
                  ],
                }),
              }),
              e.jsx(Fs, {
                open: ve,
                onOpenChange: (a) => {
                  (c(a), a || (pe(""), na(1), ra([]), ia(!1)));
                },
                children: e.jsxs(Ds, {
                  className: "w-full max-w-2xl gap-4 p-4 sm:p-6",
                  children: [
                    e.jsx($s, {
                      children: e.jsx(Us, {
                        children: "Catálogo sincronizado — modelos inactivos",
                      }),
                    }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground -mt-2",
                      children:
                        "Los modelos del LLM se importan como inactivos. Agrega los que quieras usar; pasan a la lista de activos.",
                    }),
                    e.jsx(f, {
                      value: re,
                      onChange: (a) => {
                        (pe(a.target.value), na(1));
                      },
                      placeholder: "Buscar por nombre o model_id…",
                      className: "h-8 text-xs",
                    }),
                    e.jsxs("div", {
                      className: "flex flex-wrap items-center gap-1.5",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => {
                            (ia((a) => !a), na(1));
                          },
                          className: `rounded-md border px-2 py-1 text-[11px] transition-colors ${Te ? "border-primary/50 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`,
                          children: "Gratis",
                        }),
                        Ca.map((a) => {
                          const d = ye.includes(a);
                          return e.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => Ia(a),
                              className: `rounded-md border px-2 py-1 text-[11px] transition-colors ${d ? "border-primary/50 bg-primary/15 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`,
                              children: yn(a),
                            },
                            a,
                          );
                        }),
                        (ye.length > 0 || Te) &&
                          e.jsx("button", {
                            type: "button",
                            className: "text-[11px] text-muted-foreground hover:underline px-1",
                            onClick: () => {
                              (ra([]), ia(!1), na(1));
                            },
                            children: "Limpiar",
                          }),
                      ],
                    }),
                    e.jsx("div", {
                      className:
                        "max-h-[min(52vh,420px)] overflow-y-auto rounded-md border border-border divide-y divide-border/60",
                      children:
                        za || (Xe && Ze.length === 0)
                          ? e.jsx(ps, { className: "px-3", lines: 5 })
                          : Ze.length === 0
                            ? e.jsx("p", {
                                className: "text-sm text-muted-foreground py-8 text-center",
                                children:
                                  Sa.trim() || ye.length || Te
                                    ? "Sin resultados para esos filtros."
                                    : "No hay modelos inactivos. Ejecuta Sync para importar el catálogo del LLM.",
                              })
                            : Ze.map((a) => {
                                const d =
                                    a.capabilities &&
                                    typeof a.capabilities == "object" &&
                                    !Array.isArray(a.capabilities)
                                      ? Object.entries(a.capabilities)
                                          .filter(([, v]) => v === !0)
                                          .map(([v]) => v)
                                      : Array.isArray(a.capabilities)
                                        ? a.capabilities
                                        : [],
                                  y =
                                    a.is_free === !0 ||
                                    (a.cost_per_1k_input != null &&
                                      a.cost_per_1k_output != null &&
                                      Number(a.cost_per_1k_input) === 0 &&
                                      Number(a.cost_per_1k_output) === 0);
                                return e.jsxs(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-between gap-3 px-3 py-2.5",
                                    children: [
                                      e.jsxs("div", {
                                        className: "min-w-0",
                                        children: [
                                          e.jsx("p", {
                                            className: "font-medium text-sm truncate",
                                            children: a.name,
                                          }),
                                          e.jsxs("p", {
                                            className:
                                              "text-[11px] text-muted-foreground font-mono truncate",
                                            children: [
                                              a.model_id,
                                              a.context_window != null
                                                ? ` · ctx ${a.context_window}`
                                                : "",
                                            ],
                                          }),
                                          (d.length > 0 || y) &&
                                            e.jsxs("div", {
                                              className: "mt-1 flex flex-wrap gap-1",
                                              children: [
                                                y &&
                                                  e.jsx(da, {
                                                    variant: "secondary",
                                                    className: "text-[10px]",
                                                    children: "Gratis",
                                                  }),
                                                d
                                                  .slice(0, 4)
                                                  .map((v) =>
                                                    e.jsx(
                                                      da,
                                                      {
                                                        variant: "outline",
                                                        className: "text-[10px]",
                                                        children: yn(v),
                                                      },
                                                      v,
                                                    ),
                                                  ),
                                              ],
                                            }),
                                        ],
                                      }),
                                      p &&
                                        e.jsx(N, {
                                          size: "sm",
                                          variant: "outline",
                                          className: "shrink-0 h-8",
                                          disabled: Se === String(a.id),
                                          onClick: () => Js(a),
                                          children:
                                            Se === String(a.id)
                                              ? e.jsx(fa, { className: "h-3.5 w-3.5 animate-spin" })
                                              : e.jsxs(e.Fragment, {
                                                  children: [
                                                    e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                                    " Agregar",
                                                  ],
                                                }),
                                        }),
                                    ],
                                  },
                                  String(a.id),
                                );
                              }),
                    }),
                    E > Ts &&
                      e.jsxs("div", {
                        className:
                          "flex items-center justify-between gap-2 text-xs text-muted-foreground",
                        children: [
                          e.jsxs("span", {
                            children: [(ge - 1) * Ts + 1, "–", Math.min(ge * Ts, E), " de ", E],
                          }),
                          e.jsxs("div", {
                            className: "flex gap-1",
                            children: [
                              e.jsx(N, {
                                size: "sm",
                                variant: "outline",
                                className: "h-7 px-2",
                                disabled: ge <= 1 || Xe,
                                onClick: () => na((a) => Math.max(1, a - 1)),
                                children: "Anterior",
                              }),
                              e.jsx(N, {
                                size: "sm",
                                variant: "outline",
                                className: "h-7 px-2",
                                disabled: ge >= ka || Xe,
                                onClick: () => na((a) => Math.min(ka, a + 1)),
                                children: "Siguiente",
                              }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
              }),
              e.jsx(Fs, {
                open: os,
                onOpenChange: Wa,
                children: e.jsxs(Ds, {
                  className: "max-h-[90vh] overflow-y-auto",
                  children: [
                    e.jsx($s, {
                      children: e.jsx(Us, { children: ls ? "Editar modelo" : "Nuevo modelo" }),
                    }),
                    e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx(g, { children: "Nombre visible" }),
                            e.jsx(f, { value: l, onChange: (a) => u(a.target.value) }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx(g, { children: "model_id" }),
                            e.jsx(f, {
                              value: w,
                              onChange: (a) => M(a.target.value),
                              placeholder: "gpt-4o-mini",
                              className: "font-mono text-sm",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx(g, { children: "Descripción" }),
                            e.jsx(f, {
                              value: h,
                              onChange: (a) => k(a.target.value),
                              placeholder: "Notas del modelo",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "grid grid-cols-2 gap-2",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx(g, { children: "max_tokens" }),
                                e.jsx(f, {
                                  type: "number",
                                  value: Ge,
                                  onChange: (a) => ha(a.target.value),
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx(g, { children: "context_window" }),
                                e.jsx(f, {
                                  type: "number",
                                  value: Ha,
                                  onChange: (a) => Da(a.target.value),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex flex-col gap-2 text-sm",
                          children: [
                            e.jsxs("label", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("input", {
                                  type: "checkbox",
                                  checked: Ps,
                                  onChange: (a) => bs(a.target.checked),
                                }),
                                "Activo",
                              ],
                            }),
                            e.jsxs("label", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("input", {
                                  type: "checkbox",
                                  checked: fe,
                                  onChange: (a) => Na(a.target.checked),
                                }),
                                "Recomendado",
                              ],
                            }),
                          ],
                        }),
                        e.jsx(N, {
                          className: "w-full",
                          onClick: Yr,
                          disabled: Ce.isPending || ie.isPending,
                          children: "Guardar",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          },
          "content",
        ),
  });
}
const co = Object.freeze(
    Object.defineProperty({ __proto__: null, default: zi }, Symbol.toStringTag, {
      value: "Module",
    }),
  ),
  cn = t.forwardRef(({ className: s, ...i }, o) =>
    e.jsx("div", {
      className: "relative w-full overflow-auto",
      children: e.jsx("table", { ref: o, className: K("w-full caption-bottom text-sm", s), ...i }),
    }),
  );
cn.displayName = "Table";
const dn = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("thead", { ref: o, className: K("[&_tr]:border-b", s), ...i }),
);
dn.displayName = "TableHeader";
const un = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("tbody", { ref: o, className: K("[&_tr:last-child]:border-0", s), ...i }),
);
un.displayName = "TableBody";
const Ii = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("tfoot", {
    ref: o,
    className: K("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", s),
    ...i,
  }),
);
Ii.displayName = "TableFooter";
const Ea = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("tr", {
    ref: o,
    className: K("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", s),
    ...i,
  }),
);
Ea.displayName = "TableRow";
const we = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("th", {
    ref: o,
    className: K(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      s,
    ),
    ...i,
  }),
);
we.displayName = "TableHead";
const Le = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("td", {
    ref: o,
    className: K(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      s,
    ),
    ...i,
  }),
);
Le.displayName = "TableCell";
const Ti = t.forwardRef(({ className: s, ...i }, o) =>
  e.jsx("caption", { ref: o, className: K("mt-4 text-sm text-muted-foreground", s), ...i }),
);
Ti.displayName = "TableCaption";
function rr({
  selectedIds: s,
  onChange: i,
  catalogIds: o,
  disabled: p = !1,
  emptyHint: _ = "No hay aplicaciones en el catálogo.",
}) {
  const { data: S = [], isLoading: C } = St({
      scope: "store",
      includeInactive: !0,
      forDesignation: !0,
    }),
    [U, Z] = t.useState(""),
    W = t.useMemo(() => new Set(s.map(String)), [s]),
    ee = t.useMemo(() => (o == null ? null : new Set(o.map(String))), [o]),
    H = t.useMemo(() => {
      let B = S;
      ee && (B = B.filter((D) => ee.has(String(D.id))));
      const ae = U.trim().toLowerCase();
      return ae
        ? B.filter(
            (D) =>
              D.name.toLowerCase().includes(ae) ||
              (D.description ?? "").toLowerCase().includes(ae) ||
              (D.category ?? "").toLowerCase().includes(ae),
          )
        : B;
    }, [S, ee, U]),
    F = (B) => {
      if (p) return;
      const ae = new Set(W);
      (ae.has(B) ? ae.delete(B) : ae.add(B), i(Array.from(ae)));
    };
  return C
    ? e.jsxs("div", {
        className: "flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center",
        children: [e.jsx(fa, { className: "h-4 w-4 animate-spin" }), "Cargando aplicaciones…"],
      })
    : ee && ee.size === 0
      ? e.jsx("p", {
          className: "text-sm text-muted-foreground py-4",
          children: "Primero el superadmin debe designar apps permitidas para esta organización.",
        })
      : e.jsxs("div", {
          className: "space-y-3",
          children: [
            e.jsxs("div", {
              className: "relative",
              children: [
                e.jsx(Ct, {
                  className:
                    "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground",
                }),
                e.jsx(f, {
                  value: U,
                  onChange: (B) => Z(B.target.value),
                  placeholder: "Buscar app…",
                  className: "pl-8 h-9",
                  disabled: p,
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex items-center justify-between gap-2",
              children: [
                e.jsxs(da, {
                  variant: "secondary",
                  className: "font-normal",
                  children: [W.size, " seleccionada", W.size === 1 ? "" : "s"],
                }),
                !p &&
                  W.size > 0 &&
                  e.jsx(N, {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    className: "h-7 text-xs",
                    onClick: () => i([]),
                    children: "Quitar todas",
                  }),
              ],
            }),
            H.length === 0
              ? e.jsx("p", { className: "text-sm text-muted-foreground py-3", children: _ })
              : e.jsx("ul", {
                  className: "space-y-1 max-h-72 overflow-y-auto pr-1",
                  children: H.map((B) => {
                    const ae = String(B.id),
                      D = W.has(ae);
                    return e.jsx(
                      "li",
                      {
                        children: e.jsxs("button", {
                          type: "button",
                          disabled: p,
                          onClick: () => F(ae),
                          className: K(
                            "w-full flex items-start gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors",
                            D
                              ? "border-teal-500/40 bg-teal-500/10"
                              : "border-border/60 hover:bg-muted/40",
                            p && "opacity-60 cursor-not-allowed",
                          ),
                          children: [
                            e.jsx("span", {
                              className: K(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                D
                                  ? "border-teal-500 bg-teal-500 text-black"
                                  : "border-muted-foreground/40",
                              ),
                              children: D ? e.jsx(fr, { className: "h-3 w-3" }) : null,
                            }),
                            e.jsxs("span", {
                              className: "min-w-0 flex-1",
                              children: [
                                e.jsx("span", {
                                  className: "block text-sm font-medium leading-tight",
                                  children: B.name,
                                }),
                                B.description
                                  ? e.jsx("span", {
                                      className:
                                        "block text-xs text-muted-foreground line-clamp-2 mt-0.5",
                                      children: B.description,
                                    })
                                  : null,
                              ],
                            }),
                          ],
                        }),
                      },
                      ae,
                    );
                  }),
                }),
          ],
        });
}
function Ri({
  title: s,
  logoUrl: i,
  accentColor: o,
  initial: p,
  active: _,
  tabs: S,
  tab: C,
  onTabChange: U,
  children: Z,
  footer: W,
  onRefresh: ee,
  refreshing: H,
  className: F,
}) {
  const B = (p || s || "?").trim().charAt(0).toUpperCase() || "?",
    ae = o?.trim() || "#2dd4bf";
  return e.jsxs("div", {
    className: K("w-full max-w-5xl mx-auto space-y-5", F),
    children: [
      e.jsxs("div", {
        className: "flex items-center justify-between gap-3",
        children: [
          e.jsxs("div", {
            className: "flex min-w-0 items-center gap-3",
            children: [
              e.jsx("div", {
                className:
                  "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40 text-sm font-semibold text-muted-foreground",
                style: { boxShadow: `inset 0 0 0 1.5px ${ae}66` },
                children: i
                  ? e.jsx("img", { src: i, alt: "", className: "h-full w-full object-contain p-1" })
                  : e.jsx("span", { "aria-hidden": !0, children: B }),
              }),
              e.jsxs("div", {
                className: "flex min-w-0 flex-wrap items-center gap-2",
                children: [
                  e.jsx("h1", {
                    className:
                      "truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl",
                    children: s,
                  }),
                  _ != null
                    ? e.jsx(da, {
                        variant: "secondary",
                        className: K(
                          "text-[10px]",
                          _
                            ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                            : "bg-muted text-muted-foreground",
                        ),
                        children: _ ? "Activa" : "Inactiva",
                      })
                    : null,
                ],
              }),
            ],
          }),
          ee
            ? e.jsx(N, {
                type: "button",
                size: "icon",
                variant: "ghost",
                className: "h-8 w-8 shrink-0",
                onClick: ee,
                disabled: H,
                title: "Actualizar",
                "aria-label": "Actualizar",
                children: e.jsx($a, { className: K("h-4 w-4", H && "animate-spin") }),
              })
            : null,
        ],
      }),
      e.jsxs(On, {
        value: C,
        onValueChange: U,
        className: "space-y-5",
        children: [
          e.jsx(En, {
            className: "flex h-auto w-full flex-wrap justify-start gap-1 p-1",
            children: S.map(({ id: D, label: z, icon: ce }) =>
              e.jsxs(
                Bs,
                {
                  value: D,
                  className: "gap-1.5 px-3 py-1.5",
                  children: [
                    ce
                      ? e.jsx(ce, {
                          className: "h-3.5 w-3.5 shrink-0 opacity-80",
                          "aria-hidden": !0,
                        })
                      : null,
                    z,
                  ],
                },
                D,
              ),
            ),
          }),
          e.jsx("div", {
            className: K(
              "min-w-0 space-y-6 pb-4",
              "[&_h3]:text-sm [&_h3]:font-medium [&_h3]:normal-case [&_h3]:tracking-normal [&_h3]:text-foreground",
              "[&_section]:space-y-3",
            ),
            children: Z,
          }),
        ],
      }),
      e.jsx("div", {
        className:
          "sticky bottom-0 z-10 border-t border-border/70 bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        children: e.jsx("div", {
          className: "flex flex-wrap items-center justify-end gap-2",
          children: W,
        }),
      }),
    ],
  });
}
function Bi({ tabs: s, value: i, onValueChange: o, className: p }) {
  return e.jsx(On, {
    value: i,
    onValueChange: o,
    className: p,
    children: e.jsx(En, {
      className: "flex h-auto w-full flex-wrap justify-start gap-0.5 bg-muted/40 p-1",
      children: s.map(({ id: _, label: S, icon: C }) =>
        e.jsxs(
          Bs,
          {
            value: _,
            className: "gap-1 px-2.5 py-1.5 text-xs",
            children: [
              C
                ? e.jsx(C, { className: "h-3.5 w-3.5 shrink-0 opacity-80", "aria-hidden": !0 })
                : null,
              S,
            ],
          },
          _,
        ),
      ),
    }),
  });
}
function Br({
  tabs: s,
  tab: i,
  onTabChange: o,
  children: p,
  footer: _,
  onBack: S,
  hint: C,
  className: U,
}) {
  const Z = As(),
    W = !!(s?.length && i != null && o);
  return e.jsxs(xs.div, {
    initial: Z ? !1 : { opacity: 0 },
    animate: { opacity: 1 },
    exit: Z ? void 0 : { opacity: 0 },
    transition: { duration: 0.18, ease: "easeOut" },
    className: K("mx-auto w-full max-w-4xl space-y-5", U),
    children: [
      e.jsxs("div", {
        className: "flex flex-wrap items-center gap-3",
        children: [
          e.jsxs(N, {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "-ml-2 h-8 gap-1 text-muted-foreground",
            onClick: S,
            children: [e.jsx(jr, { className: "h-4 w-4" }), "Volver"],
          }),
          C ? e.jsx("p", { className: "text-sm text-muted-foreground", children: C }) : null,
        ],
      }),
      W ? e.jsx(Bi, { tabs: s, value: i, onValueChange: o }) : null,
      e.jsx("div", { className: "space-y-5 min-w-0", children: p }),
      e.jsx("div", {
        className:
          "sticky bottom-0 z-10 -mx-1 flex flex-wrap gap-2 border-t border-border/70 bg-background/95 px-1 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        children: _,
      }),
    ],
  });
}
function Fr({
  mode: s,
  panelKey: i,
  title: o,
  subtitle: p,
  meta: _,
  tabs: S,
  tab: C,
  onTabChange: U,
  children: Z,
  footer: W,
  onClose: ee,
  logoUrl: H,
  bannerUrl: F,
  accentColor: B,
  initial: ae,
  active: D,
  onRefresh: z,
  refreshing: ce,
  formHint: se,
}) {
  return s === "owner"
    ? e.jsx(Ri, {
        title: o,
        subtitle: p,
        meta: _,
        tabs: S,
        tab: C,
        onTabChange: U,
        footer: W,
        logoUrl: H,
        bannerUrl: F,
        accentColor: B,
        initial: ae,
        active: D,
        onRefresh: z,
        refreshing: ce,
        children: Z,
      })
    : e.jsx(Br, {
        tabs: S,
        tab: C,
        onTabChange: U,
        footer: W,
        onBack: ee ?? (() => {}),
        hint: se ?? p,
        children: Z,
      });
}
function Qn({ open: s, onOpenChange: i, visible: o = !0, actions: p, className: _ }) {
  const S = As();
  return e.jsx(ji, {
    delayDuration: 200,
    children: e.jsx(ks, {
      children: o
        ? e.jsxs(xs.div, {
            className: K("fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 md:hidden", _),
            initial: S ? !1 : { opacity: 0 },
            animate: { opacity: 1 },
            exit: S ? void 0 : { opacity: 0 },
            transition: { duration: 0.15 },
            children: [
              e.jsx(ks, {
                children:
                  s &&
                  e.jsx(xs.div, {
                    initial: S ? !1 : { opacity: 0, scale: 0.96 },
                    animate: { opacity: 1, scale: 1 },
                    exit: S ? void 0 : { opacity: 0, scale: 0.96 },
                    transition: { duration: 0.15 },
                    className: "mb-1 flex flex-col items-end gap-2",
                    children: p.map((C) => {
                      const U = C.icon;
                      return e.jsxs(
                        bi,
                        {
                          children: [
                            e.jsx(vi, {
                              asChild: !0,
                              children: e.jsx(N, {
                                size: "icon",
                                variant: C.variant ?? "secondary",
                                className: K("h-10 w-10 rounded-full shadow-md", C.className),
                                onClick: C.onClick,
                                disabled: C.disabled,
                                "aria-label": C.label,
                                children: e.jsx(U, {
                                  className: K("h-4 w-4", C.spinning && "animate-spin"),
                                }),
                              }),
                            }),
                            e.jsx(Mr, { side: "left", children: C.label }),
                          ],
                        },
                        C.label,
                      );
                    }),
                  }),
              }),
              e.jsx(N, {
                size: "icon",
                className: "h-12 w-12 rounded-full shadow-lg",
                onClick: () => i(!s),
                "aria-label": s ? "Cerrar menú" : "Abrir menú",
                "aria-expanded": s,
                children: s
                  ? e.jsx(kt, { className: "h-5 w-5" })
                  : e.jsx(At, { className: "h-5 w-5" }),
              }),
            ],
          })
        : null,
    }),
  });
}
function qs(s) {
  if (!s?.trim()) return "";
  let i = s
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "")
    .toLowerCase();
  return (
    (i = i.replace(/^[^@]+@/, "")),
    /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(i) ? i : ""
  );
}
function Fi() {
  return typeof window > "u" ? "" : window.location.origin;
}
function Jn(s) {
  const i = qs(s.customDomain);
  if (i) return { url: `https://${i}/login`, source: "domain" };
  const o = qs(s.organizationDomain);
  if (o) return { url: `https://${o}/login`, source: "org-domain" };
  const p = Fi(),
    _ = s.loginSlug?.trim();
  return _
    ? { url: `${p}/login/${encodeURIComponent(_)}`, source: "slug" }
    : { url: `${p}/login`, source: "app" };
}
function Di(s) {
  switch (s) {
    case "domain":
      return "Entra por el dominio propio.";
    case "org-domain":
      return "Entra por el dominio de la organización.";
    case "slug":
      return "Entra con el nombre corto en esta app.";
    default:
      return "Ingreso general de la app (sin nombre corto ni dominio).";
  }
}
function Dr({ customDomain: s, organizationDomain: i, loginSlug: o, className: p }) {
  const { url: _, source: S } = Jn({ customDomain: s, organizationDomain: i, loginSlug: o }),
    [C, U] = t.useState(!1),
    Z = async () => {
      if (!(await An(_))) {
        m.error("No se pudo copiar");
        return;
      }
      (U(!0), m.success("Link copiado"), window.setTimeout(() => U(!1), 1600));
    };
  return e.jsxs("div", {
    className: K("space-y-1.5", p),
    children: [
      e.jsx(g, { children: "Mi link para acceder" }),
      e.jsxs("div", {
        className: "flex gap-2",
        children: [
          e.jsx(f, { readOnly: !0, value: _, className: "text-sm", title: _ }),
          e.jsx(N, {
            type: "button",
            variant: "outline",
            size: "icon",
            className: "shrink-0",
            onClick: () => {
              Z();
            },
            title: "Copiar link",
            "aria-label": "Copiar link",
            children: C
              ? e.jsx(fr, { className: "h-4 w-4 text-primary" })
              : e.jsx(kn, { className: "h-4 w-4" }),
          }),
        ],
      }),
      e.jsx("p", { className: "text-[11px] text-muted-foreground", children: Di(S) }),
      e.jsx($i, { source: S }),
    ],
  });
}
function $i({ source: s }) {
  return s === "domain"
    ? null
    : e.jsx("p", {
        className: "text-[11px] text-muted-foreground/90",
        children: "Orden: dominio propio → dominio de la organización → nombre corto en esta app.",
      });
}
function wn({ label: s, hint: i, previewUrl: o, file: p, onFile: _ }) {
  const [S, C] = t.useState(null),
    [U, Z] = t.useState(!1);
  (t.useEffect(() => {
    Z(!1);
  }, [o, p]),
    t.useEffect(() => {
      if (!p) {
        C(null);
        return;
      }
      const ee = URL.createObjectURL(p);
      return (C(ee), () => URL.revokeObjectURL(ee));
    }, [p]));
  const W = S || (U ? "" : o) || null;
  return e.jsxs("div", {
    className: "space-y-2",
    children: [
      e.jsx(g, { children: s }),
      e.jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          e.jsx("div", {
            className:
              "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40",
            children: W
              ? e.jsx("img", {
                  src: W,
                  alt: "",
                  className: "h-full w-full object-contain",
                  onError: () => Z(!0),
                })
              : e.jsx("span", {
                  className: "text-[10px] text-muted-foreground text-center px-1",
                  children: U ? "No carga" : "Sin imagen",
                }),
          }),
          e.jsxs("div", {
            className: "min-w-0 flex-1 space-y-1",
            children: [
              e.jsx(f, {
                type: "file",
                accept: "image/png,image/jpeg,image/gif,image/webp,image/x-icon,.ico",
                className: "cursor-pointer text-xs file:mr-2",
                onChange: (ee) => _(ee.target.files?.[0] ?? null),
              }),
              i && e.jsx("p", { className: "text-[11px] text-muted-foreground", children: i }),
              p &&
                e.jsxs("button", {
                  type: "button",
                  className: "text-[11px] text-muted-foreground underline-offset-2 hover:underline",
                  onClick: () => _(null),
                  children: ["Quitar selección (", p.name, ")"],
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
function gs(s, i = "#2dd4bf") {
  const o = (s ?? "").trim();
  return /^#[0-9a-f]{6}$/i.test(o)
    ? o.toLowerCase()
    : /^#[0-9a-f]{3}$/i.test(o)
      ? `#${o
          .slice(1)
          .split("")
          .map((_) => _ + _)
          .join("")}`.toLowerCase()
      : i.toLowerCase();
}
function Ui(s) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((s ?? "").trim());
}
const qi = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "web", label: "Web" },
  { value: "other", label: "Otro" },
];
function $r(s) {
  return {
    key: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    logo_url: "",
    website_url: "",
    enabled: !0,
    order: 1,
    ...s,
  };
}
function Ur(s) {
  return {
    key: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    url: "",
    icon: "web",
    enabled: !0,
    order: 1,
    ...s,
  };
}
function Vi(s) {
  return !Array.isArray(s) || s.length === 0
    ? []
    : [...s]
        .map((i, o) =>
          $r({
            name: i.name || "",
            logo_url: i.logo_url || "",
            website_url: i.website_url || "",
            enabled: i.enabled !== !1,
            order: typeof i.order == "number" ? i.order : o + 1,
          }),
        )
        .sort((i, o) => i.order - o.order);
}
function Gi(s) {
  return !Array.isArray(s) || s.length === 0
    ? []
    : [...s]
        .map((i, o) =>
          Ur({
            name: i.name || "",
            url: i.url || "",
            icon: (i.icon || "web").toLowerCase(),
            enabled: i.enabled !== !1,
            order: typeof i.order == "number" ? i.order : o + 1,
          }),
        )
        .sort((i, o) => i.order - o.order);
}
const Hi = [
    { id: "datos", label: "Datos", icon: yr },
    { id: "apariencia", label: "Apariencia", icon: In },
    { id: "redes", label: "Redes", icon: Tn },
    { id: "acceso", label: "Acceso", icon: Rn },
    { id: "patrocinadores", label: "Patrocinadores", icon: Bn },
    { id: "apps", label: "Apps", icon: Kt, editOnly: !0, superadminOnly: !0 },
    { id: "apps-roles", label: "Apps por rol", icon: Wt, editOnly: !0, roleApps: !0 },
  ],
  Zs = {
    datos: {
      edit: "Identidad, propietario y sucursales.",
      create: "Datos generales de la organización.",
    },
    apariencia: {
      edit: "Colores, marca e imágenes.",
      create: "Define la marca visual (opcional).",
    },
    redes: { edit: "Sitio web y redes sociales.", create: "Opcional: web y perfiles sociales." },
    acceso: {
      edit: "Cómo entran tus clientes al portal.",
      create: "Cómo entran tus clientes al portal.",
    },
    patrocinadores: {
      edit: "Partners que se muestran al ingresar.",
      create: "Partners opcionales al ingresar.",
    },
    apps: { edit: "Qué apps del store puede ver esta organización.", create: "" },
    "apps-roles": { edit: "Qué apps ve cada rol (OWNER → ADMIN_LOCAL → EMPLOYEE).", create: "" },
  };
function _s(...s) {
  for (const i of s) {
    const o = Pr(i);
    if (o) return o;
  }
  return "";
}
function Sn(s) {
  const i = s?.friendlyMessage || "";
  return i
    ? i
        .replace(/custom_domain:\s*/gi, "Dominio propio: ")
        .replace(/login_slug:\s*/gi, "Nombre corto del link: ")
        .replace(/dni:\s*/gi, "RUT: ")
        .replace(/name:\s*/gi, "Nombre: ")
    : "No se pudo guardar";
}
function Qi() {
  const s = sn(),
    i = Pt(),
    o = Lt(),
    p = Mt(),
    _ = Ot(),
    S = t.useMemo(() => {
      if (s) return null;
      if (!i) return new Set();
      const r = br();
      return r.length === 0 ? null : new Set(r);
    }, [s, i]),
    { data: C = [], isLoading: U, isFetching: Z, isError: W, error: ee } = zn(),
    H = t.useMemo(() => (S ? C.filter((r) => S.has(String(r.id))) : C), [C, S]),
    F = p && H.length === 1;
  Et(!0);
  const B = zt(),
    { data: ae = [] } = nn(),
    { data: D = [] } = Or(),
    { data: z = [] } = vr({ allBranches: !0 }),
    ce = t.useMemo(() => {
      const r = new Set();
      for (const b of z) b.is_active !== !1 && r.add(String(b.user));
      return r;
    }, [z]),
    se = It(),
    $e = Tt(),
    aa = Rt(),
    We = Bt(),
    I = Ft(),
    wa = Dt(),
    [ue, Me] = Ln(),
    [ja, sa] = t.useState(!1),
    [je, Ue] = t.useState(!1),
    [Q, me] = t.useState(!1),
    [O, be] = t.useState("datos"),
    [V, ve] = t.useState(null),
    [c, re] = t.useState(null),
    [pe, Sa] = t.useState({ name: "", dni: "", owner: "", domain: "", stores: "" }),
    [ge, na] = t.useState({}),
    ye = t.useDeferredValue(pe),
    [ra, Te] = t.useState(""),
    [ia, Se] = t.useState(""),
    [Ye, Oe] = t.useState(""),
    [Ca, te] = t.useState(""),
    [za, Xe] = t.useState("5"),
    [Ze, E] = t.useState(""),
    [ka, Ia] = t.useState(!0),
    [qe, ua] = t.useState(""),
    [Re, Ee] = t.useState(!1),
    [Ne, ba] = t.useState(null),
    [Ce, ie] = t.useState(null),
    [ze, Aa] = t.useState({}),
    [ne, ke] = t.useState([]),
    [ma, oe] = t.useState([]),
    [le, Pa] = t.useState(!0),
    [Ua, va] = t.useState(14),
    [pa, Be] = t.useState(6),
    [ga, xa] = t.useState(!1),
    [La, oa] = t.useState(!0),
    [ya, Ma] = t.useState(""),
    [n, j] = t.useState(""),
    [x, L] = t.useState(""),
    [J, R] = t.useState(null),
    [G, xe] = t.useState(null),
    [he, Oa] = t.useState(null),
    [qa, Ve] = t.useState(!1),
    Ie = c,
    Qa = Re && Ne ? String(Ne.id) : Q && Ie ? Ie : null,
    { data: Y, isLoading: Ja } = $t(Q && Ie ? Ie : null),
    { data: Ae = [], isLoading: la } = Ut(Qa),
    _e = qt(),
    ca = Vt(),
    Ta = Gt(),
    Va = Ht(),
    { data: ea, isLoading: Ra } = Qt(Q && Ie && (_e || ca) ? Ie : null),
    { data: $, isLoading: Ba } = Jt(Q && Ie && ca ? Ie : null),
    [Fa, Ga] = t.useState([]),
    [ta, Ka] = t.useState({ OWNER: [], ADMIN_LOCAL: [], EMPLOYEE: [] }),
    [is, es] = t.useState("OWNER"),
    as = t.useRef(null),
    os = t.useRef(null);
  t.useEffect(() => {
    if (!Q || !Ie) {
      as.current = null;
      return;
    }
    if (!ea && !$) return;
    const r = String(Ie);
    as.current !== r &&
      ((_e && !ea) ||
        (ca && !$) ||
        ((as.current = r),
        ea && Ga(ea.external_api_ids.map(String)),
        $ &&
          Ka({
            OWNER: ($.roles.OWNER ?? []).map(String),
            ADMIN_LOCAL: ($.roles.ADMIN_LOCAL ?? []).map(String),
            EMPLOYEE: ($.roles.EMPLOYEE ?? []).map(String),
          })));
  }, [Q, Ie, ea, $, _e, ca]);
  const Wa = t.useMemo(() => {
      const r = !!V;
      return Hi.filter(
        (b) => !((b.editOnly && !r) || (b.superadminOnly && !_e) || (b.roleApps && !ca)),
      );
    }, [V, _e, ca]),
    ls = (r) => Ar.find((b) => b.code === r)?.name ?? r;
  t.useEffect(() => {
    if (!Q || !Ie) {
      os.current = null;
      return;
    }
    if (!Y) return;
    const r = String(Ie);
    if (os.current === r) return;
    os.current = r;
    const b = Y.branding;
    (Ma(_s(b?.logo_url, Y.logo_url, Y.logo)),
      j(_s(b?.favicon_url, Y.favicon_url, Y.favicon)),
      L(_s(b?.banner_image_url, Y.banner_image_url, Y.banner_image)),
      ke(Gi(Y.social_links ?? b?.social_links ?? null)),
      oe(Vi(Y.sponsor_logos)),
      Pa(Y.show_sponsor_logos !== !1),
      va(typeof Y.font_size == "number" ? Y.font_size : 14),
      Be(typeof Y.borderRadius == "number" ? Y.borderRadius : 6),
      xa(!!Y.compact),
      oa(Y.motion !== !1));
  }, [Q, Ie, Y]);
  const cs = () => {
      (Aa({}),
        ke([]),
        oe([]),
        Pa(!0),
        va(14),
        Be(6),
        xa(!1),
        oa(!0),
        Ma(""),
        j(""),
        L(""),
        R(null),
        xe(null),
        Oa(null));
    },
    l = t.useMemo(() => ae.filter((r) => r.organization == null || r.organization === ""), [ae]),
    u = t.useMemo(() => {
      const r = ye.name.trim().toLowerCase(),
        b = ye.dni.trim().toLowerCase(),
        A = ye.owner.trim().toLowerCase(),
        T = ye.domain.trim().toLowerCase(),
        P = ye.stores.trim().toLowerCase();
      return H.filter((Pe) => {
        if (
          (r && !`${Pe.name || ""} ${Pe.business_name || ""}`.toLowerCase().includes(r)) ||
          (b && !(Pe.dni || "").toLowerCase().includes(b)) ||
          (A && !(Pe.owner_email || "").toLowerCase().includes(A)) ||
          (T && !`${Pe.custom_domain || ""} ${Pe.login_slug || ""}`.toLowerCase().includes(T))
        )
          return !1;
        if (P) {
          const ds = Pe.stores_count ?? 0,
            Ks = Pe.max_branches;
          if (
            !(Ks != null ? `${ds} / ${Ks}`.toLowerCase() : String(ds).toLowerCase()).includes(P) &&
            !String(ds).includes(P)
          )
            return !1;
        }
        return !0;
      });
    }, [H, ye]),
    w = (r, b) => Sa((A) => ({ ...A, [r]: b })),
    M = (r) => {
      const b = !ge[r];
      (na((A) => ({ ...A, [r]: b })), b || w(r, ""));
    },
    h = (r) => !!(ge[r] || pe[r].trim()),
    k = Object.keys(pe).some(h),
    Ge = async () => {
      (sa(!0), Ue(!1));
      try {
        (await B(), m.success("Lista actualizada"));
      } catch {
        m.error("No se pudo actualizar");
      } finally {
        sa(!1);
      }
    },
    ha = () => {
      if (F) {
        be("datos");
        return;
      }
      (me(!1), re(null), ve(null), be("datos"), ue.get("view") && Me({}, { replace: !0 }));
    },
    Ha = () => {
      if (!o) {
        m.error("No puedes crear organizaciones");
        return;
      }
      (Ue(!1),
        be("datos"),
        ve(null),
        re(null),
        Te(""),
        Se(""),
        Oe(""),
        te(""),
        Xe("5"),
        E(""),
        Ia(!0),
        cs(),
        me(!0),
        Me({ view: "nuevo" }, { replace: !0 }));
    },
    Da = (r, b = "datos") => {
      (Ue(!1),
        be(b),
        ve(r),
        re(String(r.id)),
        Te(r.name || ""),
        Se(r.business_name || ""),
        Oe(r.dni || ""),
        te(r.owner != null ? String(r.owner) : ""),
        Xe(String(r.max_branches ?? 5)),
        E(r.custom_domain || ""),
        Ia(r.is_active !== !1),
        cs(),
        me(!0),
        F || Me({ view: "editar", id: String(r.id) }, { replace: !0 }));
    };
  (t.useEffect(() => {
    !F || U || (H.length === 1 && (!Q || !V || String(V.id) !== String(H[0].id)) && Da(H[0]));
  }, [F, H, U, Q, V?.id]),
    t.useEffect(() => {
      F || (!ue.get("view") && Q && (me(!1), re(null), ve(null), Ue(!1)));
    }, [ue, Q, F]),
    t.useEffect(() => {
      if (F || U || Q) return;
      const r = ue.get("view");
      if (r) {
        if (r === "nuevo") {
          if (!o) return;
          Ha();
          return;
        }
        if (r === "editar") {
          const b = ue.get("id");
          if (!b) return;
          const A = H.find((T) => String(T.id) === b);
          A && Da(A);
        }
      }
    }, [ue, U, H, Q, F, o]));
  const Ps = (r) => {
      if (!o) {
        m.error("Solo un administrador global puede vincular sucursales");
        return;
      }
      (Ue(!1), ba(r), ua(""), Ee(!0));
    },
    bs = () => {
      (Ee(!1), ba(null), ua(""));
    },
    fe = {
      app_name: ze.app_name ?? Y?.app_name ?? "",
      primary_color: ze.primary_color ?? Y?.primary_color ?? "",
      secondary_color: ze.secondary_color ?? Y?.secondary_color ?? "",
      tagline: ze.tagline ?? Y?.tagline ?? "",
      brand_description: ze.brand_description ?? Y?.brand_description ?? "",
      login_slug: ze.login_slug ?? Y?.login_slug ?? "",
      login_welcome_message: ze.login_welcome_message ?? Y?.login_welcome_message ?? "",
      login_subtitle: ze.login_subtitle ?? Y?.login_subtitle ?? "",
      website_url: ze.website_url ?? Y?.website_url ?? "",
    },
    Na = (r, b) => {
      Aa((A) => ({ ...A, [r]: b }));
    },
    pn = () => {
      const r = qs(Ze) || null,
        b = {
          name: ra.trim(),
          business_name: ia.trim() || null,
          dni: Ye.trim(),
          custom_domain: r,
          is_active: ka,
        };
      return (o && ((b.owner = Ca ? Number(Ca) : null), (b.max_branches = Number(za) || 5)), b);
    },
    ss = () => ({
      app_name: String(fe.app_name ?? "").trim() || null,
      primary_color: String(fe.primary_color ?? "").trim() ? gs(String(fe.primary_color)) : null,
      secondary_color: String(fe.secondary_color ?? "").trim()
        ? gs(String(fe.secondary_color))
        : null,
      tagline: String(fe.tagline ?? "").trim() || "",
      brand_description: String(fe.brand_description ?? "").trim() || "",
      website_url: String(fe.website_url ?? "").trim() || "",
      login_slug: String(fe.login_slug ?? "").trim() || null,
      login_welcome_message: String(fe.login_welcome_message ?? "").trim() || "",
      login_subtitle: String(fe.login_subtitle ?? "").trim() || "",
      font_size: Ua,
      borderRadius: pa,
      compact: ga,
      motion: La,
      show_sponsor_logos: le,
      social_links: ne
        .filter((r) => r.name.trim() && r.url.trim())
        .map((r, b) => ({
          name: r.name.trim(),
          url: r.url.trim(),
          icon: r.icon.trim() || "web",
          enabled: r.enabled,
          order: b + 1,
        })),
      sponsor_logos: ma
        .filter((r) => r.name.trim())
        .map((r, b) => ({
          name: r.name.trim(),
          logo_url: r.logo_url.trim() || "",
          website_url: r.website_url.trim() || "",
          enabled: r.enabled,
          order: b + 1,
        })),
    }),
    X = async (r) => {
      const b = ss(),
        A = !!(J || G || he);
      if ((await wa.mutateAsync({ id: r, data: b }), !A)) return;
      const T = new FormData(),
        P = String(b.app_name ?? "").trim();
      (P && T.append("app_name", P),
        J && T.append("logo", J),
        G && T.append("favicon", G),
        he && T.append("banner_image", he));
      const Pe = await wa.mutateAsync({ id: r, data: T });
      (Ma(_s(Pe?.branding?.logo_url, Pe?.logo_url, Pe?.logo, ya)),
        j(_s(Pe?.branding?.favicon_url, Pe?.favicon_url, Pe?.favicon, n)),
        L(_s(Pe?.branding?.banner_image_url, Pe?.banner_image_url, Pe?.banner_image, x)),
        R(null),
        xe(null),
        Oa(null));
    },
    vs = async () => {
      if (O === "apps") {
        if (!V || !_e) {
          m.error("No puedes designar apps de la organización");
          return;
        }
        Ve(!0);
        try {
          (await Ta.mutateAsync({ orgId: V.id, external_api_ids: Fa }),
            m.success(
              Fa.length > 0
                ? "Apps de la organización actualizadas"
                : "Sin restricción: la org vuelve al filtro por sucursal",
            ));
        } catch (b) {
          m.error(Sn(b));
        } finally {
          Ve(!1);
        }
        return;
      }
      if (O === "apps-roles") {
        if (!V || !ca) {
          m.error("No puedes designar apps por rol");
          return;
        }
        Ve(!0);
        try {
          (await Va.mutateAsync({ orgId: V.id, roles: ta }),
            m.success("Apps por rol actualizadas"));
        } catch (b) {
          m.error(Sn(b));
        } finally {
          Ve(!1);
        }
        return;
      }
      if (!ra.trim() || !Ye.trim()) {
        (m.error("Nombre y RUT son requeridos"), be("datos"));
        return;
      }
      const r = qs(Ze);
      if (Ze.trim() && !r) {
        (m.error("Dominio propio inválido. Usa solo el host, ej. portal.cliente.com"),
          be("acceso"));
        return;
      }
      if ((r !== Ze.trim().toLowerCase() && E(r), !V && !o)) {
        m.error("No puedes crear organizaciones");
        return;
      }
      Ve(!0);
      try {
        const b = pn();
        if (V)
          (await $e.mutateAsync({ id: V.id, data: b }),
            await X(V.id),
            m.success("Organización actualizada"),
            F ? B() : ha());
        else {
          const A = await se.mutateAsync(b);
          (await X(A.id), m.success("Organización creada"), ha());
        }
      } catch (b) {
        m.error(Sn(b));
      } finally {
        Ve(!1);
      }
    },
    Qs = (r) => {
      ie({ type: "delete-org", org: r });
    },
    gn = () => {
      if (!Ne || !qe) {
        m.error("Elige una sucursal");
        return;
      }
      We.mutate(
        { orgId: Ne.id, branchId: qe },
        {
          onSuccess: () => {
            (m.success("Sucursal vinculada"), ua(""));
          },
          onError: (r) => m.error(r.friendlyMessage || "No se pudo vincular"),
        },
      );
    },
    Js = (r, b, A) => {
      if (!o) {
        m.error("Solo un administrador global puede desvincular sucursales");
        return;
      }
      const T = A ?? Ne?.id ?? V?.id;
      T && ie({ type: "detach-store", orgId: T, branchId: r, label: b });
    },
    xn = () => {
      if (Ce) {
        if (Ce.type === "delete-org") {
          const r = Ce.org;
          aa.mutate(r.id, {
            onSuccess: () => {
              (m.success("Organización eliminada"), c === String(r.id) && ha());
            },
            onError: (b) => m.error(b.friendlyMessage || "No se pudo eliminar"),
          });
        } else
          I.mutate(
            { orgId: Ce.orgId, branchId: Ce.branchId },
            {
              onSuccess: () => m.success("Sucursal desvinculada"),
              onError: (r) => m.error(r.friendlyMessage || "No se pudo desvincular"),
            },
          );
        ie(null);
      }
    },
    Ls =
      Ce?.type === "delete-org"
        ? {
            title: "Eliminar organización",
            description: `¿Eliminar «${Ce.org.name}»? Esta acción no se puede deshacer fácilmente.`,
            action: "Eliminar",
          }
        : Ce?.type === "detach-store"
          ? {
              title: "Desvincular sucursal",
              description: `¿Desvincular «${Ce.label}» de la organización? Seguirá existiendo como sucursal independiente.`,
              action: "Desvincular",
            }
          : null,
    Ms = V ? (F ? _ : V.name || _) : "Nueva organización",
    Os = V ? (F && V.name) || Zs[O].edit : Zs[O].create,
    Es = e.jsxs("div", {
      className: "space-y-2",
      children: [
        e.jsxs("div", {
          className: "flex items-center justify-between gap-2",
          children: [
            e.jsx(g, { className: "mb-0", children: "Sucursales vinculadas" }),
            V &&
              o &&
              e.jsxs(N, {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "h-7 text-xs",
                onClick: () => Ps(V),
                children: [e.jsx(er, { className: "h-3 w-3 mr-1" }), " Vincular"],
              }),
          ],
        }),
        la
          ? e.jsx(ps, { lines: 3 })
          : Ae.length === 0
            ? e.jsx("p", {
                className:
                  "text-xs text-muted-foreground rounded-md border border-dashed border-border px-3 py-4 text-center",
                children: o
                  ? "Sin sucursales vinculadas."
                  : "Sin sucursales. Créalas en Sucursales; quedan bajo tu organización.",
              })
            : e.jsx("ul", {
                className: "rounded-md border border-border divide-y divide-border overflow-hidden",
                children: Ae.map((r) => {
                  const b = r.business_name || `Sucursal ${r.id}`;
                  return e.jsxs(
                    "li",
                    {
                      className: "flex items-start gap-2 px-3 py-2.5 text-sm",
                      children: [
                        e.jsx(Yt, {
                          className: "h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0",
                        }),
                        e.jsxs("div", {
                          className: "min-w-0 flex-1",
                          children: [
                            e.jsx("div", { className: "font-medium truncate", children: b }),
                            e.jsx("div", {
                              className: "text-[11px] text-muted-foreground truncate",
                              children:
                                [r.dni, r.commune || r.region, r.email]
                                  .filter(Boolean)
                                  .join(" · ") || "—",
                            }),
                          ],
                        }),
                        e.jsx("span", {
                          className: K(
                            "h-2 w-2 rounded-full shrink-0 mt-1.5",
                            r.is_active !== !1 ? "bg-emerald-500" : "bg-muted-foreground/40",
                          ),
                          title: r.is_active !== !1 ? "Activa" : "Inactiva",
                        }),
                        o &&
                          e.jsx(N, {
                            type: "button",
                            size: "icon",
                            variant: "ghost",
                            className: "h-7 w-7 shrink-0 text-destructive hover:text-destructive",
                            title: "Desvincular",
                            disabled: I.isPending,
                            onClick: () => Js(r.id, b, V?.id),
                            children: e.jsx(ar, { className: "h-3.5 w-3.5" }),
                          }),
                      ],
                    },
                    String(r.id),
                  );
                }),
              }),
      ],
    }),
    hn = As();
  return e.jsx(ks, {
    mode: "wait",
    children: U
      ? e.jsx(
          xs.div,
          {
            initial: hn ? !1 : { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto",
            children: e.jsx(on, { variant: "table" }),
          },
          "skeleton",
        )
      : e.jsxs(
          rn,
          {
            className: Q || F ? "pt-3 pb-6 space-y-4" : void 0,
            children: [
              W &&
                e.jsx(Fe, {
                  children: e.jsx(tn, {
                    message:
                      `No se pudieron cargar las organizaciones. ${ee?.friendlyMessage || ""}`.trim(),
                    onRetry: Ge,
                  }),
                }),
              p &&
                H.length === 0 &&
                e.jsx(Fe, {
                  children: e.jsx(Cs, {
                    title: "Sin organización",
                    description: "No tienes una organización asignada como propietario.",
                  }),
                }),
              !F &&
                !Q &&
                e.jsxs(Fe, {
                  children: [
                    e.jsx(ln, {
                      countLabel: `${u.length} organizaci${u.length === 1 ? "ón" : "ones"}`,
                      actions: [
                        {
                          label: "Actualizar",
                          icon: $a,
                          onClick: Ge,
                          disabled: ja || Z,
                          spinning: ja || Z,
                        },
                        ...(o
                          ? [{ label: "Nueva", icon: De, onClick: Ha, variant: "default" }]
                          : []),
                      ],
                    }),
                    e.jsx("div", {
                      className: "min-w-0 overflow-x-auto",
                      children: e.jsxs(cn, {
                        children: [
                          e.jsxs(dn, {
                            children: [
                              e.jsxs(Ea, {
                                className: "hover:bg-transparent border-border/50",
                                children: [
                                  [
                                    { key: "name", label: "Organización", className: void 0 },
                                    { key: "dni", label: "RUT", className: "hidden sm:table-cell" },
                                    {
                                      key: "owner",
                                      label: "Propietario",
                                      className: "hidden md:table-cell",
                                    },
                                    {
                                      key: "domain",
                                      label: "Acceso",
                                      className: "hidden lg:table-cell",
                                    },
                                    {
                                      key: "stores",
                                      label: "Sucursales",
                                      className: "hidden xl:table-cell",
                                    },
                                  ].map((r) =>
                                    e.jsx(
                                      we,
                                      {
                                        className: r.className,
                                        children: e.jsx("button", {
                                          type: "button",
                                          onClick: (b) => {
                                            (b.stopPropagation(), M(r.key));
                                          },
                                          className: K(
                                            "inline-flex max-w-full items-center truncate rounded-sm text-left transition-colors cursor-pointer hover:underline underline-offset-4 hover:text-foreground",
                                            h(r.key)
                                              ? "text-primary hover:text-primary"
                                              : "text-muted-foreground",
                                          ),
                                          title: h(r.key)
                                            ? "Cerrar filtro"
                                            : `Filtrar por ${r.label}`,
                                          "aria-label": `Filtrar por ${r.label}`,
                                          "aria-pressed": h(r.key),
                                          children: r.label,
                                        }),
                                      },
                                      r.key,
                                    ),
                                  ),
                                  e.jsx(we, {
                                    className: "text-right w-[72px]",
                                    children: e.jsx("span", {
                                      className: "sr-only",
                                      children: "Acciones",
                                    }),
                                  }),
                                ],
                              }),
                              k &&
                                e.jsxs(Ea, {
                                  className: "hover:bg-transparent border-border/40",
                                  children: [
                                    e.jsx(we, {
                                      className: "pt-0 pb-3 font-normal align-top",
                                      children: h("name")
                                        ? e.jsx(f, {
                                            autoFocus: !!ge.name,
                                            value: pe.name,
                                            onChange: (r) => w("name", r.target.value),
                                            placeholder: "Buscar por nombre…",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "hidden sm:table-cell pt-0 pb-3 font-normal align-top",
                                      children: h("dni")
                                        ? e.jsx(f, {
                                            autoFocus: !!ge.dni,
                                            value: pe.dni,
                                            onChange: (r) => w("dni", r.target.value),
                                            placeholder: "12.345.678-9",
                                            className:
                                              "h-8 text-xs font-normal font-mono bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "pt-0 pb-3 font-normal align-top hidden md:table-cell",
                                      children: h("owner")
                                        ? e.jsx(f, {
                                            autoFocus: !!ge.owner,
                                            value: pe.owner,
                                            onChange: (r) => w("owner", r.target.value),
                                            placeholder: "correo@empresa.com",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "pt-0 pb-3 font-normal align-top hidden lg:table-cell",
                                      children: h("domain")
                                        ? e.jsx(f, {
                                            autoFocus: !!ge.domain,
                                            value: pe.domain,
                                            onChange: (r) => w("domain", r.target.value),
                                            placeholder: "dominio o nombre corto",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "pt-0 pb-3 font-normal align-top hidden xl:table-cell",
                                      children: h("stores")
                                        ? e.jsx(f, {
                                            autoFocus: !!ge.stores,
                                            value: pe.stores,
                                            onChange: (r) => w("stores", r.target.value),
                                            placeholder: "2 / 5",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, { className: "pt-0 pb-3" }),
                                  ],
                                }),
                            ],
                          }),
                          e.jsxs(un, {
                            children: [
                              u.length === 0 &&
                                e.jsx(Ea, {
                                  className: "hover:bg-transparent",
                                  children: e.jsx(Le, {
                                    colSpan: 6,
                                    className: "p-4",
                                    children: e.jsx(Cs, {
                                      title:
                                        H.length === 0 ? "Sin organizaciones" : "Sin coincidencias",
                                      description:
                                        H.length === 0
                                          ? o
                                            ? "Crea la primera organización para empezar."
                                            : "Sin organizaciones asignadas."
                                          : "Ninguna organización coincide con los filtros.",
                                      action:
                                        H.length === 0 && o
                                          ? e.jsxs(N, {
                                              size: "sm",
                                              onClick: Ha,
                                              children: [
                                                e.jsx(De, { className: "h-4 w-4 mr-1.5" }),
                                                "Nueva",
                                              ],
                                            })
                                          : void 0,
                                    }),
                                  }),
                                }),
                              u.map((r) => {
                                const b = c === String(r.id),
                                  A = r.stores_count ?? 0,
                                  T = r.max_branches;
                                return e.jsxs(
                                  Ea,
                                  {
                                    className: K(
                                      "cursor-pointer transition-colors",
                                      b && "bg-sidebar-accent/60",
                                    ),
                                    onClick: () => Da(r),
                                    children: [
                                      e.jsx(Le, {
                                        className: "min-w-0",
                                        children: e.jsxs("div", {
                                          className: "flex items-center gap-2 min-w-0",
                                          children: [
                                            e.jsx("span", {
                                              className: K(
                                                "h-2 w-2 rounded-full shrink-0",
                                                r.is_active !== !1
                                                  ? "bg-emerald-500"
                                                  : "bg-muted-foreground/40",
                                              ),
                                              title: r.is_active !== !1 ? "Activa" : "Inactiva",
                                            }),
                                            e.jsxs("div", {
                                              className: "min-w-0",
                                              children: [
                                                e.jsx("div", {
                                                  className: "font-medium text-sm truncate",
                                                  children: r.name,
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "text-xs text-muted-foreground truncate",
                                                  children: [
                                                    T != null
                                                      ? `${A} / ${T} sucursales`
                                                      : `${A} sucursales`,
                                                    e.jsx("span", {
                                                      className: "sm:hidden font-mono",
                                                      children: r.dni ? ` · ${r.dni}` : "",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      e.jsx(Le, {
                                        className:
                                          "hidden sm:table-cell font-mono text-xs whitespace-nowrap",
                                        children: r.dni || "—",
                                      }),
                                      e.jsx(Le, {
                                        className:
                                          "text-xs text-muted-foreground truncate max-w-[10rem] hidden md:table-cell",
                                        children: r.owner_email || "—",
                                      }),
                                      e.jsx(Le, {
                                        className:
                                          "text-xs truncate max-w-[12rem] hidden lg:table-cell",
                                        onClick: (P) => P.stopPropagation(),
                                        children: (() => {
                                          const P = Jn({
                                            customDomain: r.custom_domain,
                                            loginSlug: r.login_slug,
                                          });
                                          return !!r.custom_domain?.trim() || !!r.login_slug?.trim()
                                            ? e.jsxs("a", {
                                                href: P.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className:
                                                  "inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 max-w-full",
                                                title: P.url,
                                                children: [
                                                  e.jsx("span", {
                                                    className: "truncate",
                                                    children:
                                                      r.custom_domain?.trim() ||
                                                      r.login_slug ||
                                                      "Abrir",
                                                  }),
                                                  e.jsx(Nr, {
                                                    className: "h-3 w-3 shrink-0 opacity-80",
                                                  }),
                                                ],
                                              })
                                            : e.jsx("span", {
                                                className: "text-muted-foreground",
                                                children: "—",
                                              });
                                        })(),
                                      }),
                                      e.jsx(Le, {
                                        className: "text-xs tabular-nums hidden xl:table-cell",
                                        children: T != null ? `${A} / ${T}` : A,
                                      }),
                                      e.jsx(Le, {
                                        className: "text-right",
                                        onClick: (P) => P.stopPropagation(),
                                        children: e.jsxs(_r, {
                                          children: [
                                            e.jsx(wr, {
                                              asChild: !0,
                                              children: e.jsx(N, {
                                                size: "icon",
                                                variant: "ghost",
                                                className: "h-8 w-8",
                                                title: "Más opciones",
                                                children: e.jsx(Sr, { className: "h-4 w-4" }),
                                              }),
                                            }),
                                            e.jsxs(Cr, {
                                              align: "end",
                                              className: "min-w-[11rem]",
                                              children: [
                                                o &&
                                                  e.jsxs(rs, {
                                                    onClick: () => Ps(r),
                                                    children: [
                                                      e.jsx(er, { className: "h-3.5 w-3.5 mr-2" }),
                                                      "Vincular sucursal",
                                                    ],
                                                  }),
                                                e.jsxs(rs, {
                                                  onClick: () => Da(r, "apariencia"),
                                                  children: [
                                                    e.jsx(In, { className: "h-3.5 w-3.5 mr-2" }),
                                                    "Apariencia",
                                                  ],
                                                }),
                                                e.jsxs(rs, {
                                                  onClick: () => Da(r, "redes"),
                                                  children: [
                                                    e.jsx(Tn, { className: "h-3.5 w-3.5 mr-2" }),
                                                    "Redes",
                                                  ],
                                                }),
                                                e.jsxs(rs, {
                                                  onClick: () => Da(r, "acceso"),
                                                  children: [
                                                    e.jsx(Rn, { className: "h-3.5 w-3.5 mr-2" }),
                                                    "Acceso",
                                                  ],
                                                }),
                                                e.jsxs(rs, {
                                                  onClick: () => Da(r, "patrocinadores"),
                                                  children: [
                                                    e.jsx(Bn, { className: "h-3.5 w-3.5 mr-2" }),
                                                    "Patrocinadores",
                                                  ],
                                                }),
                                                o &&
                                                  e.jsxs(e.Fragment, {
                                                    children: [
                                                      e.jsx(kr, {}),
                                                      e.jsxs(rs, {
                                                        className:
                                                          "text-destructive focus:text-destructive",
                                                        onClick: () => Qs(r),
                                                        children: [
                                                          e.jsx(Za, {
                                                            className: "h-3.5 w-3.5 mr-2",
                                                          }),
                                                          "Eliminar",
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  String(r.id),
                                );
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              Q &&
                e.jsx(Fe, {
                  children: e.jsxs(Fr, {
                    mode: F ? "owner" : "form",
                    panelKey: c ?? "new",
                    title: (F && (ra.trim() || V?.name)) || Ms,
                    meta: (F && (ia.trim() || String(fe.tagline ?? "").trim())) || void 0,
                    subtitle: F ? Zs[O].edit : Os,
                    formHint: F ? void 0 : Os,
                    tabs: Wa,
                    tab: O,
                    onTabChange: (r) => be(r),
                    onClose: F ? void 0 : ha,
                    logoUrl: ya || null,
                    bannerUrl: x || null,
                    accentColor: String(fe.primary_color ?? "").trim() || null,
                    initial: (ra || V?.name || "O").charAt(0),
                    active: ka,
                    onRefresh: F ? Ge : void 0,
                    refreshing: ja || Z,
                    footer: e.jsxs(e.Fragment, {
                      children: [
                        e.jsxs(N, {
                          className: F ? void 0 : "min-w-[8rem]",
                          onClick: () => {
                            vs();
                          },
                          disabled:
                            qa ||
                            se.isPending ||
                            $e.isPending ||
                            wa.isPending ||
                            Ta.isPending ||
                            Va.isPending,
                          children: [
                            (qa ||
                              se.isPending ||
                              $e.isPending ||
                              wa.isPending ||
                              Ta.isPending ||
                              Va.isPending) &&
                              e.jsx(fa, { className: "h-4 w-4 animate-spin mr-2" }),
                            "Guardar",
                          ],
                        }),
                        !F && e.jsx(N, { variant: "outline", onClick: ha, children: "Cancelar" }),
                      ],
                    }),
                    children: [
                      O === "datos" &&
                        e.jsxs("div", {
                          className: "space-y-3.5",
                          children: [
                            e.jsxs("section", {
                              className: "space-y-3",
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Identidad",
                                }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Nombre *" }),
                                        e.jsx(f, {
                                          value: ra,
                                          onChange: (r) => Te(r.target.value),
                                          placeholder: "ej. Grupo Patagon",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Razón social" }),
                                        e.jsx(f, {
                                          value: ia,
                                          onChange: (r) => Se(r.target.value),
                                          placeholder: "ej. Patagon SpA",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx(g, { children: "RUT *" }),
                                    e.jsx(f, {
                                      value: Ye,
                                      onChange: (r) => Oe(r.target.value),
                                      className: "font-mono max-w-xs",
                                      placeholder: "76.111.222-3",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("section", {
                              className: "space-y-3",
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Operación",
                                }),
                                o &&
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Propietario" }),
                                          e.jsxs(He, {
                                            value: Ca || "none",
                                            onValueChange: (r) => te(r === "none" ? "" : r),
                                            children: [
                                              e.jsx(Qe, {
                                                children: e.jsx(Je, { placeholder: "Opcional" }),
                                              }),
                                              e.jsxs(Ke, {
                                                children: [
                                                  e.jsx(de, {
                                                    value: "none",
                                                    children: "Sin propietario",
                                                  }),
                                                  D.filter((r) => !ce.has(String(r.id))).map((r) =>
                                                    e.jsx(
                                                      de,
                                                      { value: String(r.id), children: r.email },
                                                      String(r.id),
                                                    ),
                                                  ),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Máximo de sucursales" }),
                                          e.jsx(f, {
                                            type: "number",
                                            min: 1,
                                            value: za,
                                            onChange: (r) => Xe(r.target.value),
                                            placeholder: "5",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                e.jsxs("label", {
                                  className: "flex items-center gap-2 text-sm cursor-pointer",
                                  children: [
                                    e.jsx(_a, {
                                      checked: ka,
                                      onCheckedChange: (r) => Ia(r === !0),
                                    }),
                                    "Organización activa",
                                  ],
                                }),
                              ],
                            }),
                            V &&
                              e.jsx("section", {
                                className: "pt-1 border-t border-border/60",
                                children: Es,
                              }),
                          ],
                        }),
                      O === "apariencia" &&
                        e.jsx("div", {
                          className: "space-y-3.5",
                          children:
                            Ja && V
                              ? e.jsx(ps, { lines: 5 })
                              : e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsxs("section", {
                                      className: "space-y-3",
                                      children: [
                                        e.jsx("h3", {
                                          className:
                                            "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                          children: "Marca",
                                        }),
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx(g, { children: "Nombre en el menú" }),
                                            e.jsx(f, {
                                              value: String(fe.app_name ?? ""),
                                              onChange: (r) => Na("app_name", r.target.value),
                                              placeholder: "Ej. Grupo Patagon",
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx(g, { children: "Eslogan" }),
                                            e.jsx(f, {
                                              value: String(fe.tagline ?? ""),
                                              onChange: (r) => Na("tagline", r.target.value),
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx(g, { children: "Descripción de marca" }),
                                            e.jsx(Ss, {
                                              value: String(fe.brand_description ?? ""),
                                              onChange: (r) =>
                                                Na("brand_description", r.target.value),
                                              rows: 3,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("section", {
                                      className: "space-y-3",
                                      children: [
                                        e.jsx("h3", {
                                          className:
                                            "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                          children: "Colores",
                                        }),
                                        [
                                          ["primary_color", "Color principal"],
                                          ["secondary_color", "Color secundario"],
                                        ].map(([r, b]) => {
                                          const A = String(fe[r] ?? "").trim(),
                                            T = gs(A, "#808080");
                                          return e.jsxs(
                                            "div",
                                            {
                                              children: [
                                                e.jsx(g, { children: b }),
                                                e.jsxs("div", {
                                                  className: "flex items-center gap-2",
                                                  children: [
                                                    e.jsx("input", {
                                                      type: "color",
                                                      value: T,
                                                      onChange: (P) =>
                                                        Na(r, P.target.value.toLowerCase()),
                                                      className:
                                                        "h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5",
                                                      title: b,
                                                      "aria-label": b,
                                                    }),
                                                    e.jsx(f, {
                                                      value: A,
                                                      onChange: (P) => Na(r, P.target.value),
                                                      placeholder: "#0284c7",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            },
                                            r,
                                          );
                                        }),
                                      ],
                                    }),
                                    e.jsxs("section", {
                                      className: "space-y-3",
                                      children: [
                                        e.jsx("h3", {
                                          className:
                                            "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                          children: "Imágenes",
                                        }),
                                        e.jsx(wn, {
                                          label: "Logo",
                                          hint: "PNG, JPG, WebP o GIF. Máximo 2 MB.",
                                          previewUrl: ya,
                                          file: J,
                                          onFile: R,
                                        }),
                                        e.jsx(wn, {
                                          label: "Ícono de pestaña",
                                          hint: "Ícono chico del navegador. PNG, ICO o WebP. Máximo 2 MB.",
                                          previewUrl: n,
                                          file: G,
                                          onFile: xe,
                                        }),
                                        e.jsx(wn, {
                                          label: "Imagen de portada",
                                          hint: "Pantalla de ingreso. PNG, JPG o WebP. Máximo 2 MB.",
                                          previewUrl: x,
                                          file: he,
                                          onFile: Oa,
                                        }),
                                      ],
                                    }),
                                    e.jsxs("section", {
                                      className: "space-y-3",
                                      children: [
                                        e.jsx("h3", {
                                          className:
                                            "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                          children: "Estilo",
                                        }),
                                        e.jsxs("div", {
                                          className: "grid grid-cols-2 gap-2",
                                          children: [
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Tamaño de texto" }),
                                                e.jsx(f, {
                                                  type: "number",
                                                  min: 12,
                                                  max: 20,
                                                  value: Ua,
                                                  onChange: (r) => va(Number(r.target.value) || 14),
                                                }),
                                                e.jsx("p", {
                                                  className:
                                                    "mt-1 text-[11px] text-muted-foreground",
                                                  children: "12–20 px",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Redondeo de bordes" }),
                                                e.jsx(f, {
                                                  type: "number",
                                                  min: 0,
                                                  max: 24,
                                                  value: pa,
                                                  onChange: (r) => Be(Number(r.target.value) || 0),
                                                }),
                                                e.jsx("p", {
                                                  className:
                                                    "mt-1 text-[11px] text-muted-foreground",
                                                  children: "0–24 px",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        e.jsxs("label", {
                                          className:
                                            "flex items-center gap-2 text-sm cursor-pointer",
                                          children: [
                                            e.jsx(_a, {
                                              checked: ga,
                                              onCheckedChange: (r) => xa(r === !0),
                                            }),
                                            "Interfaz compacta",
                                          ],
                                        }),
                                        e.jsxs("label", {
                                          className:
                                            "flex items-center gap-2 text-sm cursor-pointer",
                                          children: [
                                            e.jsx(_a, {
                                              checked: La,
                                              onCheckedChange: (r) => oa(r === !0),
                                            }),
                                            "Animaciones",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                        }),
                      O === "redes" &&
                        e.jsxs("section", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx(g, { children: "Sitio web" }),
                                e.jsx(f, {
                                  value: String(fe.website_url ?? ""),
                                  onChange: (r) => Na("website_url", r.target.value),
                                  placeholder: "https://…",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex items-center justify-between gap-2 pt-1",
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Redes sociales",
                                }),
                                e.jsxs(N, {
                                  type: "button",
                                  size: "sm",
                                  variant: "outline",
                                  onClick: () => ke((r) => [...r, Ur({ order: r.length + 1 })]),
                                  children: [
                                    e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                    "Agregar",
                                  ],
                                }),
                              ],
                            }),
                            ne.length === 0
                              ? e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children: "Sin links. Agrega las redes que quieras mostrar.",
                                })
                              : e.jsx("div", {
                                  className: "space-y-3",
                                  children: ne.map((r, b) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-md border border-border/70 p-3 space-y-2 bg-muted/10",
                                        children: [
                                          e.jsxs("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                              e.jsxs("span", {
                                                className:
                                                  "text-[11px] font-medium text-muted-foreground",
                                                children: ["Link ", b + 1],
                                              }),
                                              e.jsx(N, {
                                                type: "button",
                                                size: "icon",
                                                variant: "ghost",
                                                className: "h-7 w-7",
                                                onClick: () =>
                                                  ke((A) => A.filter((T) => T.key !== r.key)),
                                                title: "Eliminar",
                                                children: e.jsx(Za, { className: "h-3.5 w-3.5" }),
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: [
                                              e.jsxs("div", {
                                                children: [
                                                  e.jsx(g, { children: "Nombre *" }),
                                                  e.jsx(f, {
                                                    value: r.name,
                                                    onChange: (A) =>
                                                      ke((T) =>
                                                        T.map((P) =>
                                                          P.key === r.key
                                                            ? { ...P, name: A.target.value }
                                                            : P,
                                                        ),
                                                      ),
                                                    placeholder: "Instagram",
                                                  }),
                                                ],
                                              }),
                                              e.jsxs("div", {
                                                children: [
                                                  e.jsx(g, { children: "Ícono" }),
                                                  e.jsxs(He, {
                                                    value: r.icon,
                                                    onValueChange: (A) =>
                                                      ke((T) =>
                                                        T.map((P) =>
                                                          P.key === r.key ? { ...P, icon: A } : P,
                                                        ),
                                                      ),
                                                    children: [
                                                      e.jsx(Qe, {
                                                        children: e.jsx(Je, {
                                                          placeholder: "Ícono",
                                                        }),
                                                      }),
                                                      e.jsx(Ke, {
                                                        children: qi.map((A) =>
                                                          e.jsx(
                                                            de,
                                                            { value: A.value, children: A.label },
                                                            A.value,
                                                          ),
                                                        ),
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx(g, { children: "Enlace *" }),
                                              e.jsx(f, {
                                                value: r.url,
                                                onChange: (A) =>
                                                  ke((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, url: A.target.value }
                                                        : P,
                                                    ),
                                                  ),
                                                placeholder: "https://instagram.com/…",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("label", {
                                            className:
                                              "flex items-center gap-2 text-sm cursor-pointer",
                                            children: [
                                              e.jsx(_a, {
                                                checked: r.enabled,
                                                onCheckedChange: (A) =>
                                                  ke((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, enabled: A === !0 }
                                                        : P,
                                                    ),
                                                  ),
                                              }),
                                              "Visible",
                                            ],
                                          }),
                                        ],
                                      },
                                      r.key,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                      O === "acceso" &&
                        e.jsx("div", {
                          className: "space-y-3.5",
                          children:
                            Ja && V
                              ? e.jsx(ps, { lines: 4 })
                              : e.jsxs("section", {
                                  className: "space-y-3",
                                  children: [
                                    e.jsx("h3", {
                                      className:
                                        "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                      children: "Ingreso al portal",
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Dominio propio" }),
                                        e.jsx(f, {
                                          value: Ze,
                                          onChange: (r) => E(r.target.value),
                                          onBlur: () => {
                                            const r = qs(Ze);
                                            r && E(r);
                                          },
                                          placeholder: "portal.cliente.com",
                                        }),
                                        e.jsx("p", {
                                          className: "mt-1 text-[11px] text-muted-foreground",
                                          children: "Opcional. Solo el dominio, sin https://",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Nombre corto del link" }),
                                        e.jsx(f, {
                                          value: String(fe.login_slug ?? ""),
                                          onChange: (r) => Na("login_slug", r.target.value),
                                          placeholder: "mi-grupo",
                                        }),
                                        e.jsx("p", {
                                          className: "mt-1 text-[11px] text-muted-foreground",
                                          children: "Se usa cuando no hay dominio propio.",
                                        }),
                                      ],
                                    }),
                                    e.jsx(Dr, {
                                      customDomain: Ze,
                                      loginSlug: String(fe.login_slug ?? ""),
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Mensaje de bienvenida" }),
                                        e.jsx(f, {
                                          value: String(fe.login_welcome_message ?? ""),
                                          onChange: (r) =>
                                            Na("login_welcome_message", r.target.value),
                                          placeholder: "¡Bienvenido!",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Texto de apoyo" }),
                                        e.jsx(f, {
                                          value: String(fe.login_subtitle ?? ""),
                                          onChange: (r) => Na("login_subtitle", r.target.value),
                                          placeholder: "Ingresá con tu cuenta",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                        }),
                      O === "patrocinadores" &&
                        e.jsxs("section", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center justify-between gap-2",
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Patrocinadores",
                                }),
                                e.jsxs(N, {
                                  type: "button",
                                  size: "sm",
                                  variant: "outline",
                                  onClick: () => oe((r) => [...r, $r({ order: r.length + 1 })]),
                                  children: [
                                    e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                    "Agregar",
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("label", {
                              className: "flex items-center gap-2 text-sm cursor-pointer",
                              children: [
                                e.jsx(_a, { checked: le, onCheckedChange: (r) => Pa(r === !0) }),
                                "Mostrar patrocinadores al ingresar",
                              ],
                            }),
                            ma.length === 0
                              ? e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children:
                                    "Sin patrocinadores. Agrega partners con nombre, imagen y sitio web.",
                                })
                              : e.jsx("div", {
                                  className: "space-y-3",
                                  children: ma.map((r, b) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-md border border-border/70 p-3 space-y-2 bg-muted/10",
                                        children: [
                                          e.jsxs("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                              e.jsxs("span", {
                                                className:
                                                  "text-[11px] font-medium text-muted-foreground",
                                                children: ["Patrocinador ", b + 1],
                                              }),
                                              e.jsx(N, {
                                                type: "button",
                                                size: "icon",
                                                variant: "ghost",
                                                className: "h-7 w-7",
                                                onClick: () =>
                                                  oe((A) => A.filter((T) => T.key !== r.key)),
                                                title: "Eliminar",
                                                children: e.jsx(Za, { className: "h-3.5 w-3.5" }),
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx(g, { children: "Nombre *" }),
                                              e.jsx(f, {
                                                value: r.name,
                                                onChange: (A) =>
                                                  oe((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, name: A.target.value }
                                                        : P,
                                                    ),
                                                  ),
                                                placeholder: "Sercotec",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx(g, { children: "Imagen" }),
                                              e.jsx(f, {
                                                value: r.logo_url,
                                                onChange: (A) =>
                                                  oe((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, logo_url: A.target.value }
                                                        : P,
                                                    ),
                                                  ),
                                                placeholder: "https://…/imagen.png",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx(g, { children: "Sitio web" }),
                                              e.jsx(f, {
                                                value: r.website_url,
                                                onChange: (A) =>
                                                  oe((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, website_url: A.target.value }
                                                        : P,
                                                    ),
                                                  ),
                                                placeholder: "https://…",
                                              }),
                                            ],
                                          }),
                                          e.jsxs("label", {
                                            className:
                                              "flex items-center gap-2 text-sm cursor-pointer",
                                            children: [
                                              e.jsx(_a, {
                                                checked: r.enabled,
                                                onCheckedChange: (A) =>
                                                  oe((T) =>
                                                    T.map((P) =>
                                                      P.key === r.key
                                                        ? { ...P, enabled: A === !0 }
                                                        : P,
                                                    ),
                                                  ),
                                              }),
                                              "Habilitado",
                                            ],
                                          }),
                                        ],
                                      },
                                      r.key,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                      O === "apps" &&
                        V &&
                        e.jsxs("section", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Apps permitidas",
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground mt-1",
                                  children:
                                    "Elige qué apps del store puede ver esta organización. Vacío = sin restricción (sigue el filtro por sucursal).",
                                }),
                              ],
                            }),
                            Ra
                              ? e.jsx(ps, { lines: 4 })
                              : e.jsx(rr, {
                                  selectedIds: Fa,
                                  onChange: Ga,
                                  disabled: !_e || Ta.isPending,
                                }),
                          ],
                        }),
                      O === "apps-roles" &&
                        V &&
                        e.jsxs("section", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className:
                                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                  children: "Apps por rol",
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground mt-1",
                                  children:
                                    "Solo dentro de las apps permitidas de la org. Lista vacía en un rol = hereda todas las de la organización.",
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "flex flex-wrap gap-1",
                              children: Xt.map((r) =>
                                e.jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => es(r),
                                    className: K(
                                      "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                      is === r
                                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                                        : "text-muted-foreground hover:text-foreground border border-transparent",
                                    ),
                                    children: [
                                      ls(r),
                                      e.jsxs("span", {
                                        className: "ml-1 opacity-70",
                                        children: ["(", ta[r]?.length ?? 0, ")"],
                                      }),
                                    ],
                                  },
                                  r,
                                ),
                              ),
                            }),
                            Ba || Ra
                              ? e.jsx(ps, { lines: 4 })
                              : e.jsx(rr, {
                                  selectedIds: ta[is] ?? [],
                                  onChange: (r) => Ka((b) => ({ ...b, [is]: r })),
                                  catalogIds: ea?.is_restricted ? Fa : null,
                                  disabled: !ca || Va.isPending,
                                  emptyHint: "No hay apps disponibles para este rol.",
                                }),
                          ],
                        }),
                    ],
                  }),
                }),
              e.jsx(Fs, {
                open: Re,
                onOpenChange: (r) => {
                  r ? Ee(!0) : bs();
                },
                children: e.jsxs(Ds, {
                  className: "max-w-md max-h-[85vh] overflow-y-auto",
                  children: [
                    e.jsx($s, {
                      children: e.jsxs(Us, {
                        children: ["Vincular sucursal", Ne?.name ? ` · ${Ne.name}` : ""],
                      }),
                    }),
                    e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        la
                          ? e.jsx(ps, { lines: 4 })
                          : e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsxs(g, {
                                  className: "mb-0",
                                  children: ["Ya vinculadas (", Ae.length, ")"],
                                }),
                                Ae.length === 0
                                  ? e.jsx("p", {
                                      className:
                                        "text-xs text-muted-foreground rounded-md border border-dashed border-border px-3 py-3 text-center",
                                      children: "Sin sucursales aún.",
                                    })
                                  : e.jsx("ul", {
                                      className:
                                        "rounded-md border border-border divide-y divide-border max-h-40 overflow-y-auto",
                                      children: Ae.map((r) => {
                                        const b = r.business_name || `Sucursal ${r.id}`;
                                        return e.jsxs(
                                          "li",
                                          {
                                            className: "flex items-center gap-2 px-3 py-2 text-sm",
                                            children: [
                                              e.jsx("span", {
                                                className: "truncate flex-1 min-w-0",
                                                children: b,
                                              }),
                                              e.jsx(N, {
                                                type: "button",
                                                size: "icon",
                                                variant: "ghost",
                                                className:
                                                  "h-7 w-7 shrink-0 text-destructive hover:text-destructive",
                                                title: "Desvincular",
                                                disabled: I.isPending,
                                                onClick: () => Js(r.id, b, Ne?.id),
                                                children: e.jsx(ar, { className: "h-3.5 w-3.5" }),
                                              }),
                                            ],
                                          },
                                          String(r.id),
                                        );
                                      }),
                                    }),
                              ],
                            }),
                        e.jsxs("div", {
                          children: [
                            e.jsx(g, { children: "Agregar sucursal" }),
                            e.jsxs(He, {
                              value: qe,
                              onValueChange: ua,
                              children: [
                                e.jsx(Qe, {
                                  children: e.jsx(Je, { placeholder: "Selecciona sucursal" }),
                                }),
                                e.jsx(Ke, {
                                  children: l.map((r) =>
                                    e.jsx(
                                      de,
                                      { value: String(r.id), children: r.business_name },
                                      String(r.id),
                                    ),
                                  ),
                                }),
                              ],
                            }),
                            l.length === 0 &&
                              e.jsx("p", {
                                className: "text-[11px] text-muted-foreground mt-1",
                                children: "No hay sucursales sin organización.",
                              }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex gap-2 pt-1",
                          children: [
                            e.jsxs(N, {
                              className: "flex-1",
                              onClick: gn,
                              disabled: We.isPending || !qe,
                              children: [
                                We.isPending &&
                                  e.jsx(fa, { className: "h-4 w-4 animate-spin mr-2" }),
                                "Vincular",
                              ],
                            }),
                            e.jsx(N, { variant: "outline", onClick: bs, children: "Cerrar" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsx(Fn, {
                open: Ce != null,
                onOpenChange: (r) => {
                  r || ie(null);
                },
                children: e.jsxs(Dn, {
                  children: [
                    e.jsxs($n, {
                      children: [
                        e.jsx(Un, { children: Ls?.title }),
                        e.jsx(qn, { children: Ls?.description }),
                      ],
                    }),
                    e.jsxs(Vn, {
                      children: [
                        e.jsx(Gn, { children: "Cancelar" }),
                        e.jsx(Hn, {
                          className:
                            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                          onClick: xn,
                          children: Ls?.action,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsx(Qn, {
                open: je,
                onOpenChange: Ue,
                visible: !Q && !F,
                actions: [
                  {
                    label: "Actualizar",
                    icon: $a,
                    onClick: Ge,
                    disabled: ja || Z,
                    spinning: ja || Z,
                  },
                  ...(o ? [{ label: "Nueva", icon: De, onClick: Ha }] : []),
                ],
              }),
            ],
          },
          "content",
        ),
  });
}
const uo = Object.freeze(
    Object.defineProperty({ __proto__: null, default: Qi }, Symbol.toStringTag, {
      value: "Module",
    }),
  ),
  Ji = [
    {
      region: "Arica y Parinacota",
      provincias: [
        { provincia: "Parinacota", comunas: ["General Lagos", "Putre"] },
        { provincia: "Arica", comunas: ["Arica", "Camarones"] },
      ],
    },
    {
      region: "Tarapacá",
      provincias: [
        { provincia: "Iquique", comunas: ["Iquique", "Alto Hospicio"] },
        {
          provincia: "Tamarugal",
          comunas: ["Colchane", "Camiña", "Huara", "Pozo Almonte", "Pica"],
        },
      ],
    },
    {
      region: "Antofagasta",
      provincias: [
        { provincia: "Tocopilla", comunas: ["Tocopilla", "María Elena"] },
        { provincia: "El Loa", comunas: ["Ollagüe", "Calama", "San Pedro de Atacama"] },
        {
          provincia: "Antofagasta",
          comunas: ["Sierra Gorda", "Mejillones", "Antofagasta", "Taltal"],
        },
      ],
    },
    {
      region: "Atacama",
      provincias: [
        { provincia: "Chañaral", comunas: ["Chañaral", "Diego de Almagro"] },
        { provincia: "Copiapó", comunas: ["Caldera", "Copiapó", "Tierra Amarilla"] },
        { provincia: "Huasco", comunas: ["Huasco", "Freirina", "Vallenar", "Alto del Carmen"] },
      ],
    },
    {
      region: "Coquimbo",
      provincias: [
        {
          provincia: "Elqui",
          comunas: ["La Higuera", "La Serena", "Coquimbo", "Vicuña", "Andacollo", "Paiguano"],
        },
        {
          provincia: "Limarí",
          comunas: ["Río Hurtado", "Ovalle", "Punitaqui", "Monte Patria", "Combarbalá"],
        },
        { provincia: "Choapa", comunas: ["Canela", "Illapel", "Salamanca", "Los Vilos"] },
      ],
    },
    {
      region: "Valparaíso",
      provincias: [
        { provincia: "Isla de Pascua", comunas: ["Isla de Pascua"] },
        { provincia: "Petorca", comunas: ["Petorca", "Cabildo", "La Ligua", "Papudo", "Zapallar"] },
        {
          provincia: "San Felipe de Aconcagua",
          comunas: ["Putaendo", "Catemu", "Santa María", "San Felipe", "Panquehue", "Llaillay"],
        },
        {
          provincia: "Quillota",
          comunas: ["Nogales", "Calera", "La Cruz", "Hijuelas", "Quillota"],
        },
        {
          provincia: "Los Andes",
          comunas: ["San Esteban", "Los Andes", "Rinconada", "Calle Larga"],
        },
        { provincia: "Marga Marga", comunas: ["Limache", "Olmué", "Villa Alemana", "Quilpué"] },
        {
          provincia: "Valparaíso",
          comunas: [
            "Puchuncaví",
            "Quintero",
            "Concón",
            "Valparaíso",
            "Viña del Mar",
            "Casablanca",
            "Juan Fernández",
          ],
        },
        {
          provincia: "San Antonio",
          comunas: [
            "Algarrobo",
            "El Quisco",
            "El Tabo",
            "Cartagena",
            "San Antonio",
            "Santo Domingo",
          ],
        },
      ],
    },
    {
      region: "Metropolitana de Santiago",
      provincias: [
        { provincia: "Chacabuco", comunas: ["Tiltil", "Colina", "Lampa"] },
        {
          provincia: "Santiago",
          comunas: [
            "Lo Barnechea",
            "Quilicura",
            "Huechuraba",
            "Conchalí",
            "Vitacura",
            "Renca",
            "Las Condes",
            "Recoleta",
            "Pudahuel",
            "Independencia",
            "Providencia",
            "Cerro Navia",
            "Quinta Normal",
            "Santiago Centro",
            "Lo Prado",
            "Estación Central",
            "La Reina",
            "Ñuñoa",
            "Pedro Aguirre Cerda",
            "Peñalolén",
            "Macul",
            "San Joaquín",
            "Cerrillos",
            "San Miguel",
            "Maipú",
            "La Florida",
            "Lo Espejo",
            "San Ramón",
            "La Granja",
            "La Cisterna",
            "El Bosque",
            "La Pintana",
          ],
        },
        {
          provincia: "Talagante",
          comunas: ["Padre Hurtado", "Peñaflor", "Talagante", "El Monte", "Isla de Maipo"],
        },
        { provincia: "Cordillera", comunas: ["Puente Alto", "San José de Maipo", "Pirque"] },
        {
          provincia: "Melipilla",
          comunas: ["Curacaví", "María Pinto", "Melipilla", "San Pedro", "Alhué"],
        },
        { provincia: "Maipo", comunas: ["San Bernardo", "Calera de Tango", "Buin", "Paine"] },
      ],
    },
    {
      region: "Del Libertador Gral. Bernardo O’Higgins",
      provincias: [
        {
          provincia: "Cardenal Caro",
          comunas: ["Navidad", "Litueche", "La Estrella", "Pichilemu", "Marchihue", "Paredones"],
        },
        {
          provincia: "Colchagua",
          comunas: [
            "Peralillo",
            "San Fernando",
            "Palmilla",
            "Pumanque",
            "Placilla",
            "Santa Cruz",
            "Nancagua",
            "Chépica",
            "Chimbarongo",
            "Lolol",
          ],
        },
        {
          provincia: "Cachapoal",
          comunas: [
            "Mostazal",
            "Codegua",
            "Graneros",
            "Rancagua",
            "Doñihue",
            "Olivar",
            "Coltauco",
            "Coinco",
            "Machalí",
            "Las Cabras",
            "Requínoa",
            "Quinta de Tilcoco",
            "Pichidegua",
            "Peumo",
            "Rengo",
            "San Vicente",
            "Malloa",
          ],
        },
      ],
    },
    {
      region: "Del Maule",
      provincias: [
        {
          provincia: "Curicó",
          comunas: [
            "Vichuquén",
            "Teno",
            "Rauco",
            "Licantén",
            "Romeral",
            "Curicó",
            "Hualañé",
            "Sagrada Familia",
            "Molina",
          ],
        },
        {
          provincia: "Talca",
          comunas: [
            "Curepto",
            "Río Claro",
            "San Rafael",
            "Pencahue",
            "Constitución",
            "Pelarco",
            "Talca",
            "Maule",
            "San Clemente",
            "Empedrado",
          ],
        },
        {
          provincia: "Linares",
          comunas: [
            "San Javier",
            "Villa Alegre",
            "Yerbas Buenas",
            "Colbún",
            "Linares",
            "Longaví",
            "Retiro",
            "Parral",
          ],
        },
        { provincia: "Cauquenes", comunas: ["Chanco", "Pelluhue", "Cauquenes"] },
      ],
    },
    {
      region: "Ñuble",
      provincias: [
        {
          provincia: "Punilla",
          comunas: ["Ñiquén", "San Carlos", "San Nicolás", "San Fabián", "Coihueco"],
        },
        {
          provincia: "Diguillín",
          comunas: [
            "Chillán",
            "Chillán Viejo",
            "Pinto",
            "Quillón",
            "Bulnes",
            "San Ignacio",
            "El Carmen",
            "Pemuco",
            "Yungay",
          ],
        },
        {
          provincia: "Itata",
          comunas: [
            "Cobquecura",
            "Quirihue",
            "Ninhue",
            "Treguaco",
            "Coelemu",
            "Portezuelo",
            "Ránquil",
          ],
        },
      ],
    },
    {
      region: "Del Biobío",
      provincias: [
        {
          provincia: "Concepción",
          comunas: [
            "Tomé",
            "Talcahuano",
            "Penco",
            "Hualpén",
            "Concepción",
            "Florida",
            "San Pedro de la Paz",
            "Chiguayante",
            "Hualqui",
            "Coronel",
            "Lota",
            "Santa Juana",
          ],
        },
        {
          provincia: "Biobío",
          comunas: [
            "Cabrero",
            "Yumbel",
            "San Rosendo",
            "Laja",
            "Tucapel",
            "Antuco",
            "Quilleco",
            "Los Ángeles",
            "Nacimiento",
            "Negrete",
            "Santa Bárbara",
            "Quilaco",
            "Mulchén",
            "Alto Biobío",
          ],
        },
        {
          provincia: "Arauco",
          comunas: ["Arauco", "Curanilahue", "Lebu", "Los Álamos", "Cañete", "Contulmo", "Tirúa"],
        },
      ],
    },
    {
      region: "De la Araucanía",
      provincias: [
        {
          provincia: "Malleco",
          comunas: [
            "Renaico",
            "Angol",
            "Collipulli",
            "Los Sauces",
            "Purén",
            "Ercilla",
            "Lumaco",
            "Victoria",
            "Traiguén",
            "Curacautín",
            "Lonquimay",
          ],
        },
        {
          provincia: "Cautín",
          comunas: [
            "Galvarino",
            "Perquenco",
            "Lautaro",
            "Cholchol",
            "Vilcún",
            "Carahue",
            "Temuco",
            "Nueva Imperial",
            "Padre las Casas",
            "Saavedra",
            "Melipeuco",
            "Cunco",
            "Freire",
            "Pitrufquén",
            "Teodoro Schmidt",
            "Gorbea",
            "Toltén",
            "Villarrica",
            "Pucón",
            "Curarrehue",
            "Loncoche",
          ],
        },
      ],
    },
    {
      region: "De los Ríos",
      provincias: [
        {
          provincia: "Valdivia",
          comunas: [
            "Lanco",
            "Mariquina",
            "Panguipulli",
            "Máfil",
            "Valdivia",
            "Los Lagos",
            "Corral",
            "Paillaco",
          ],
        },
        { provincia: "Ranco", comunas: ["Futrono", "La Unión", "Lago Ranco", "Río Bueno"] },
      ],
    },
    {
      region: "De los Lagos",
      provincias: [
        {
          provincia: "Osorno",
          comunas: [
            "San Pablo",
            "San Juan de la Costa",
            "Osorno",
            "Puyehue",
            "Río Negro",
            "Purranque",
            "Puerto Octay",
          ],
        },
        {
          provincia: "Llanquihue",
          comunas: [
            "Frutillar",
            "Fresia",
            "Llanquihue",
            "Puerto Varas",
            "Los Muermos",
            "Puerto Montt",
            "Cochamó",
            "Maullín",
            "Calbuco",
          ],
        },
        {
          provincia: "Chiloé",
          comunas: [
            "Ancud",
            "Quemchi",
            "Dalcahue",
            "Curaco de Vélez",
            "Quinchao",
            "Castro",
            "Puqueldón",
            "Chonchi",
            "Queilén",
            "Quellón",
          ],
        },
        { provincia: "Palena", comunas: ["Hualaihué", "Chaitén", "Futaleufú", "Palena"] },
      ],
    },
    {
      region: "Aysén del Gral. Carlos Ibáñez del Campo",
      provincias: [
        { provincia: "Coihaique", comunas: ["Lago Verde", "Coihaique"] },
        { provincia: "Aysén", comunas: ["Guaitecas", "Cisnes", "Aysén"] },
        { provincia: "General Carrera", comunas: ["Río Ibáñez", "Chile Chico"] },
        { provincia: "Capitán Prat", comunas: ["Cochrane", "Tortel", "O’Higgins"] },
      ],
    },
    {
      region: "Magallanes y de la Antártica Chilena",
      provincias: [
        { provincia: "Última Esperanza", comunas: ["Torres del Paine", "Natales"] },
        {
          provincia: "Magallanes",
          comunas: ["Laguna Blanca", "San Gregorio", "Río Verde", "Punta Arenas"],
        },
        { provincia: "Tierra del Fuego", comunas: ["Primavera", "Porvenir", "Timaukel"] },
        { provincia: "Antártica Chilena", comunas: ["Cabo de Hornos", "Antártica"] },
      ],
    },
  ],
  Ki = { regiones: Ji },
  Wi = Ki,
  Pn = Wi.regiones.map((s) => ({
    name: s.region,
    provinces: s.provincias.map((i) => ({
      name: i.provincia,
      communes: [...i.comunas].sort((o, p) => o.localeCompare(p, "es")),
    })),
  }));
function Vs(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
const Yi = {
  arica: "Arica y Parinacota",
  "arica y parinacota": "Arica y Parinacota",
  tarapaca: "Tarapacá",
  antofagasta: "Antofagasta",
  atacama: "Atacama",
  coquimbo: "Coquimbo",
  valparaiso: "Valparaíso",
  v: "Valparaíso",
  rm: "Metropolitana de Santiago",
  metropolitana: "Metropolitana de Santiago",
  "metropolitana de santiago": "Metropolitana de Santiago",
  "region metropolitana": "Metropolitana de Santiago",
  "region metropolitana de santiago": "Metropolitana de Santiago",
  santiago: "Metropolitana de Santiago",
  ohiggins: "Del Libertador Gral. Bernardo O’Higgins",
  "o higgins": "Del Libertador Gral. Bernardo O’Higgins",
  "libertador bernardo ohiggins": "Del Libertador Gral. Bernardo O’Higgins",
  "del libertador gral. bernardo ohiggins": "Del Libertador Gral. Bernardo O’Higgins",
  maule: "Del Maule",
  "del maule": "Del Maule",
  nuble: "Ñuble",
  biobio: "Del Biobío",
  "del biobio": "Del Biobío",
  bio: "Del Biobío",
  araucania: "De la Araucanía",
  "de la araucania": "De la Araucanía",
  "los rios": "De los Ríos",
  "de los rios": "De los Ríos",
  "los lagos": "De los Lagos",
  "de los lagos": "De los Lagos",
  aysen: "Aysén del Gral. Carlos Ibáñez del Campo",
  aisen: "Aysén del Gral. Carlos Ibáñez del Campo",
  "aysen del gral. carlos ibanez del campo": "Aysén del Gral. Carlos Ibáñez del Campo",
  magallanes: "Magallanes y de la Antártica Chilena",
  "magallanes y de la antartica chilena": "Magallanes y de la Antártica Chilena",
};
function Gs(s, i) {
  const o = Vs(i);
  if (o) return s.find((p) => Vs(p.name) === o);
}
function mn(s) {
  const i = s.trim();
  if (!i) return;
  const o = Gs(Pn, i);
  if (o) return o;
  const p = Yi[Vs(i)];
  if (p) return Gs(Pn, p);
}
function Xi(s) {
  return mn(s)?.provinces ?? [];
}
function Zi(s, i) {
  const o = mn(s);
  return o ? (Gs(o.provinces, i)?.communes ?? []) : [];
}
function qr(s) {
  const i = mn(s.region);
  if (!i) return { region: s.region, province: s.province, commune: s.commune };
  const o =
      Gs(i.provinces, s.province) ??
      i.provinces.find((_) => _.communes.some((S) => Vs(S) === Vs(s.commune))),
    p = o
      ? Gs(
          o.communes.map((_) => ({ name: _ })),
          s.commune,
        )?.name
      : void 0;
  return { region: i.name, province: o?.name ?? s.province, commune: p ?? s.commune };
}
const tr = [
    { id: "datos", label: "Datos", icon: yr },
    { id: "apariencia", label: "Apariencia", icon: In },
    { id: "redes", label: "Redes", icon: Tn },
    { id: "acceso", label: "Acceso", icon: Rn },
    { id: "patrocinadores", label: "Patrocinadores", icon: Bn },
  ],
  en = {
    datos: {
      edit: "Identidad, contacto y operación.",
      create: "Completa los datos generales de la sucursal.",
    },
    apariencia: {
      edit: "Colores, marca e imágenes.",
      create: "Define la marca visual de la sucursal.",
    },
    redes: { edit: "Sitio web y redes sociales.", create: "Opcional: web y perfiles sociales." },
    acceso: {
      edit: "Cómo entran tus clientes al portal.",
      create: "Cómo entran tus clientes al portal.",
    },
    patrocinadores: {
      edit: "Partners que se muestran al ingresar.",
      create: "Partners opcionales al ingresar.",
    },
  },
  ir = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "X / Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "web", label: "Web" },
    { value: "other", label: "Otro" },
  ];
function Vr(s) {
  return {
    key: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    logo_url: "",
    website_url: "",
    enabled: !0,
    order: 1,
    ...s,
  };
}
function Gr(s) {
  return {
    key: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    url: "",
    icon: "web",
    enabled: !0,
    order: 1,
    ...s,
  };
}
function eo(s) {
  return !Array.isArray(s) || s.length === 0
    ? []
    : [...s]
        .map((i, o) =>
          Vr({
            name: i.name || "",
            logo_url: i.logo_url || "",
            website_url: i.website_url || "",
            enabled: i.enabled !== !1,
            order: typeof i.order == "number" ? i.order : o + 1,
          }),
        )
        .sort((i, o) => i.order - o.order);
}
function ao(s) {
  return !Array.isArray(s) || s.length === 0
    ? []
    : [...s]
        .map((i, o) =>
          Gr({
            name: i.name || "",
            url: i.url || "",
            icon: (i.icon || "web").toLowerCase(),
            enabled: i.enabled !== !1,
            order: typeof i.order == "number" ? i.order : o + 1,
          }),
        )
        .sort((i, o) => i.order - o.order);
}
const or = {
    business_name: "Nombre comercial",
    commercial_business: "Giro",
    phone: "Teléfono",
    email: "Email",
    region: "Región",
    province: "Provincia",
    commune: "Comuna",
    address: "Dirección",
  },
  lr = () => ({
    business_name: "",
    fantasy_name: "",
    commercial_business: "",
    dni: "",
    phone: "",
    email: "",
    region: "",
    province: "",
    commune: "",
    address: "",
    custom_domain: "",
    from_email: "",
    organization: "",
    is_active: !0,
    allow_multi_branch_access: !1,
    app_name: "",
    primary_color: "#2dd4bf",
    secondary_color: "#0d9488",
    tagline: "",
    brand_description: "",
    website_url: "",
    social_links: [],
    font_size: 14,
    border_radius: 6,
    compact: !1,
    motion: !0,
    login_slug: "",
    login_welcome_message: "",
    login_subtitle: "",
    show_sponsor_logos: !0,
    sponsors: [],
    logo_url: "",
    favicon_url: "",
    banner_url: "",
    logo_file: null,
    favicon_file: null,
    banner_file: null,
  });
function Xa(...s) {
  for (const i of s) {
    const o = Pr(i);
    if (o) return o;
  }
  return "";
}
function so(s) {
  const i = qr({ region: s.region || "", province: s.province || "", commune: s.commune || "" }),
    o = s.theme_config,
    p = s.login_config,
    _ = o?.branding;
  s.fantasy_name || s.business_name;
  const S = wi({
    primary_color: s.primary_color ?? o?.primary_color ?? null,
    secondary_color: s.secondary_color ?? o?.secondary_color ?? null,
    logo: s.logo ?? o?.logo ?? _?.logo_url ?? null,
    favicon: s.favicon ?? o?.favicon ?? _?.favicon_url ?? null,
    tagline: s.tagline ?? o?.tagline ?? null,
    algorithm: s.algorithm ?? o?.algorithm ?? null,
    app_name: o?.app_name || null,
  });
  return {
    business_name: s.business_name || "",
    fantasy_name: s.fantasy_name || "",
    commercial_business: s.commercial_business || "",
    dni: s.dni || "",
    phone: s.phone || "",
    email: s.email || "",
    region: i.region,
    province: i.province,
    commune: i.commune,
    address: s.address || "",
    custom_domain: s.custom_domain || "",
    from_email: s.from_email || "",
    organization: s.organization != null ? String(s.organization) : "",
    is_active: s.is_active !== !1,
    allow_multi_branch_access: !!s.allow_multi_branch_access,
    app_name: o?.app_name || "",
    primary_color: S.primary_color || "#2dd4bf",
    secondary_color: S.secondary_color || "#0d9488",
    tagline: s.tagline || o?.tagline || "",
    brand_description: o?.brand_description || s.brand_description || "",
    website_url: s.website_url || o?.website_url || "",
    social_links: ao(o?.social_links ?? _?.social_links ?? s.social_links),
    font_size: typeof o?.font_size == "number" ? o.font_size : 14,
    border_radius: typeof o?.borderRadius == "number" ? o.borderRadius : 6,
    compact: !!o?.compact,
    motion: o?.motion !== !1,
    login_slug: s.login_slug || p?.login_slug || o?.login_slug || "",
    login_welcome_message:
      s.login_welcome_message || p?.login_welcome_message || o?.login_welcome_message || "",
    login_subtitle: s.login_subtitle || p?.login_subtitle || o?.login_subtitle || "",
    show_sponsor_logos: !!(p?.show_sponsor_logos ?? o?.show_sponsor_logos ?? !0),
    sponsors: eo(p?.sponsor_logos ?? o?.sponsor_logos),
    logo_url: Xa(_?.logo_url, o?.logo, s.logo),
    favicon_url: Xa(_?.favicon_url, o?.favicon, s.favicon),
    banner_url: Xa(_?.banner_image_url, o?.banner_image, s.banner_image),
    logo_file: null,
    favicon_file: null,
    banner_file: null,
  };
}
function cr({ label: s, value: i, onChange: o }) {
  const p = i.trim(),
    _ = gs(p, "#808080");
  return e.jsxs("div", {
    children: [
      e.jsx(g, { children: s }),
      e.jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          e.jsx("input", {
            type: "color",
            value: _,
            onChange: (S) => o(S.target.value.toLowerCase()),
            className:
              "h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5",
            title: s,
            "aria-label": s,
          }),
          e.jsx(f, {
            value: i,
            onChange: (S) => o(S.target.value),
            onBlur: () => {
              Ui(p) && o(gs(p));
            },
            placeholder: "#0284c7",
            className: "font-mono text-sm",
          }),
        ],
      }),
    ],
  });
}
function Cn({ label: s, hint: i, previewUrl: o, file: p, onFile: _ }) {
  const [S, C] = t.useState(null),
    [U, Z] = t.useState(!1);
  (t.useEffect(() => {
    Z(!1);
  }, [o, p]),
    t.useEffect(() => {
      if (!p) {
        C(null);
        return;
      }
      const ee = URL.createObjectURL(p);
      return (C(ee), () => URL.revokeObjectURL(ee));
    }, [p]));
  const W = S || (U ? "" : o) || null;
  return e.jsxs("div", {
    className: "space-y-2",
    children: [
      e.jsx(g, { children: s }),
      e.jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          e.jsx("div", {
            className:
              "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40",
            children: W
              ? e.jsx("img", {
                  src: W,
                  alt: "",
                  className: "h-full w-full object-contain",
                  onError: () => Z(!0),
                })
              : e.jsx("span", {
                  className: "text-[10px] text-muted-foreground text-center px-1",
                  children: U ? "No carga" : "Sin imagen",
                }),
          }),
          e.jsxs("div", {
            className: "min-w-0 flex-1 space-y-1",
            children: [
              e.jsx(f, {
                type: "file",
                accept: "image/png,image/jpeg,image/gif,image/webp,image/x-icon,.ico",
                className: "cursor-pointer text-xs file:mr-2",
                onChange: (ee) => _(ee.target.files?.[0] ?? null),
              }),
              i && e.jsx("p", { className: "text-[11px] text-muted-foreground", children: i }),
              p &&
                e.jsxs("button", {
                  type: "button",
                  className: "text-[11px] text-muted-foreground underline-offset-2 hover:underline",
                  onClick: () => _(null),
                  children: ["Quitar selección (", p.name, ")"],
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
function no() {
  const s = sn(),
    i = Mn(),
    o = Zt(),
    p = ei(),
    _ = o && !ai(),
    S = si(),
    C = t.useMemo(() => (i && !s ? br() : []), [i, s]),
    U = C.length === 1 ? C[0] : null,
    Z = i && !s ? ni() : null,
    W = t.useMemo(() => {
      if (s) return null;
      const n = Lr();
      return i && n.length === 0 ? null : new Set(n);
    }, [s, i]),
    {
      data: ee = [],
      isLoading: H,
      isFetching: F,
      isError: B,
      error: ae,
    } = nn({ enabled: !0, refetchOnMount: "always" }),
    D = t.useMemo(() => (W ? ee.filter((n) => W.has(String(n.id))) : ee), [ee, W]),
    z = _ && D.length === 1,
    { data: ce = [] } = zn({ enabled: s || i, refetchOnMount: s || i ? "always" : !1 }),
    se = ri(),
    $e = ti(),
    aa = ii(),
    We = oi(),
    [I, wa] = Ln(),
    [ue, Me] = t.useState(!1),
    [ja, sa] = t.useState(!1),
    [je, Ue] = t.useState(!1),
    [Q, me] = t.useState("datos"),
    [O, be] = t.useState(null),
    [V, ve] = t.useState(null),
    [c, re] = t.useState(lr),
    [pe, Sa] = t.useState(null),
    [ge, na] = t.useState({ name: "", dni: "", org: "", domain: "", email: "" }),
    [ye, ra] = t.useState({}),
    Te = O?.id ?? null,
    ia = Te != null ? Nn(Te) : p,
    Se = li(je && Te != null ? Te : null),
    Ye = t.useRef(null);
  t.useEffect(() => {
    if (!je || Te == null) {
      Ye.current = null;
      return;
    }
    if (!Se.data) return;
    const n = String(Te);
    if (Ye.current === n) return;
    Ye.current = n;
    const j = Se.data,
      x = j.branding;
    re((L) => ({
      ...L,
      app_name: j.app_name || L.app_name,
      logo_url: Xa(x?.logo_url, j.logo, L.logo_url),
      favicon_url: Xa(x?.favicon_url, j.favicon, L.favicon_url),
      banner_url: Xa(x?.banner_image_url, j.banner_image, L.banner_url),
      font_size: typeof j.font_size == "number" ? j.font_size : L.font_size,
      border_radius: typeof j.borderRadius == "number" ? j.borderRadius : L.border_radius,
      compact: typeof j.compact == "boolean" ? j.compact : L.compact,
      motion: typeof j.motion == "boolean" ? j.motion : L.motion,
    }));
  }, [je, Te, Se.data]);
  const Oe = t.useDeferredValue(ge),
    Ca = t.useMemo(() => Xi(c.region), [c.region]),
    te = t.useMemo(() => Zi(c.region, c.province), [c.region, c.province]),
    za = !!mn(c.region),
    Xe = Ca.some((n) => n.name === c.province),
    Ze = te.includes(c.commune),
    E = (n, j) => re((x) => ({ ...x, [n]: j })),
    ka = (n) => {
      re((j) => ({ ...j, region: n, province: "", commune: "" }));
    },
    Ia = (n) => {
      re((j) => ({ ...j, province: n, commune: "" }));
    },
    qe = (n, j) => na((x) => ({ ...x, [n]: j })),
    ua = (n) => {
      const j = !ye[n];
      (ra((x) => ({ ...x, [n]: j })), j || qe(n, ""));
    },
    Re = (n) => !!(ye[n] || ge[n].trim()),
    Ee = Object.keys(ge).some(Re),
    Ne = t.useMemo(() => {
      const n = Oe.name.trim().toLowerCase(),
        j = Oe.dni.trim().toLowerCase(),
        x = Oe.org.trim().toLowerCase(),
        L = Oe.domain.trim().toLowerCase(),
        J = Oe.email.trim().toLowerCase();
      return D.filter(
        (R) =>
          !(
            (n && !`${R.business_name || ""} ${R.fantasy_name || ""}`.toLowerCase().includes(n)) ||
            (j && !(R.dni || "").toLowerCase().includes(j)) ||
            (x && String(R.organization ?? "") !== x) ||
            (L && !`${R.custom_domain || ""} ${R.login_slug || ""}`.toLowerCase().includes(L)) ||
            (J && !(R.email || "").toLowerCase().includes(J))
          ),
      );
    }, [D, Oe]),
    ba = async () => {
      (Me(!0), sa(!1));
      try {
        (await se(), m.success("Lista actualizada"));
      } catch {
        m.error("No se pudo actualizar");
      } finally {
        Me(!1);
      }
    },
    Ce = () => {
      if (z) {
        me("datos");
        return;
      }
      (Ue(!1), be(null), ve(null), me("datos"), I.get("view") && wa({}, { replace: !0 }));
    },
    ie = () => {
      if (!p) {
        m.error("No puedes crear sucursales");
        return;
      }
      (sa(!1), be(null), ve(null));
      const n = lr();
      (U && (n.organization = U),
        re(n),
        me("datos"),
        Ue(!0),
        wa({ view: "nuevo" }, { replace: !0 }));
    },
    ze = (n, j = "datos") => {
      (sa(!1),
        be(n),
        ve(String(n.id)),
        re(so(n)),
        me(j),
        Ue(!0),
        z || wa({ view: "editar", id: String(n.id) }, { replace: !0 }));
    };
  (t.useEffect(() => {
    !z || H || (D.length === 1 && (!je || !O || String(O.id) !== String(D[0].id)) && ze(D[0]));
  }, [z, D, H, je, O?.id]),
    t.useEffect(() => {
      z || (!I.get("view") && je && (Ue(!1), be(null), ve(null), sa(!1)));
    }, [I, je, z]),
    t.useEffect(() => {
      if (z || H || je) return;
      const n = I.get("view");
      if (n) {
        if (n === "nuevo") {
          if (!p) return;
          ie();
          return;
        }
        if (n === "editar") {
          const j = I.get("id");
          if (!j) return;
          const x = D.find((L) => String(L.id) === j);
          x && ze(x);
        }
      }
    }, [I, H, D, je, z, p]));
  const Aa = () => {
      const n = qr({ region: c.region, province: c.province, commune: c.commune });
      return {
        business_name: c.business_name.trim(),
        fantasy_name: c.fantasy_name.trim() || null,
        commercial_business: c.commercial_business.trim(),
        dni: c.dni.trim() || null,
        phone: c.phone.trim(),
        email: c.email.trim(),
        region: n.region.trim(),
        province: n.province.trim(),
        commune: n.commune.trim(),
        address: c.address.trim(),
        custom_domain: c.custom_domain.trim() || null,
        from_email: c.from_email.trim() || null,
        organization: o
          ? O?.organization != null
            ? Number(O.organization)
            : null
          : i && !s
            ? Number(U || c.organization) || null
            : c.organization
              ? Number(c.organization)
              : null,
        is_active: c.is_active,
        allow_multi_branch_access: c.allow_multi_branch_access,
      };
    },
    ne = () => ({
      primary_color: c.primary_color.trim() ? gs(c.primary_color) : null,
      secondary_color: c.secondary_color.trim() ? gs(c.secondary_color) : null,
      tagline: c.tagline.trim() || "",
      brand_description: c.brand_description.trim() || "",
      website_url: c.website_url.trim() || "",
      social_links: c.social_links
        .filter((n) => n.name.trim() && n.url.trim())
        .map((n, j) => ({
          name: n.name.trim(),
          url: n.url.trim(),
          icon: n.icon.trim() || "web",
          enabled: n.enabled,
          order: j + 1,
        })),
      login_slug: c.login_slug.trim() || null,
      login_welcome_message: c.login_welcome_message.trim() || "",
      login_subtitle: c.login_subtitle.trim() || "",
      show_sponsor_logos: c.show_sponsor_logos,
      sponsor_logos: c.sponsors
        .filter((n) => n.name.trim())
        .map((n, j) => ({
          name: n.name.trim(),
          logo_url: n.logo_url.trim() || "",
          website_url: n.website_url.trim() || "",
          enabled: n.enabled,
          order: j + 1,
        })),
      app_name: c.app_name.trim() || "",
      font_size: c.font_size,
      borderRadius: c.border_radius,
      compact: c.compact,
      motion: c.motion,
    }),
    ke = (n, j) => {
      re((x) => ({ ...x, sponsors: x.sponsors.map((L) => (L.key === n ? { ...L, ...j } : L)) }));
    },
    ma = () => {
      re((n) => ({ ...n, sponsors: [...n.sponsors, Vr({ order: n.sponsors.length + 1 })] }));
    },
    oe = (n) => {
      re((j) => ({ ...j, sponsors: j.sponsors.filter((x) => x.key !== n) }));
    },
    le = (n, j) => {
      re((x) => ({
        ...x,
        social_links: x.social_links.map((L) => (L.key === n ? { ...L, ...j } : L)),
      }));
    },
    Pa = () => {
      re((n) => ({
        ...n,
        social_links: [...n.social_links, Gr({ order: n.social_links.length + 1 })],
      }));
    },
    Ua = (n) => {
      re((j) => ({ ...j, social_links: j.social_links.filter((x) => x.key !== n) }));
    },
    va = async () => {
      if (O && !Nn(O.id)) {
        m.error("Solo lectura — no puedes editar esta sucursal");
        return;
      }
      if (!O && !p) {
        m.error("No puedes crear sucursales");
        return;
      }
      for (const R of Object.keys(or))
        if (!String(c[R]).trim()) {
          (m.error(`Campo requerido: ${or[R]}`), me("datos"));
          return;
        }
      const n = Aa(),
        { app_name: j, ...x } = ne(),
        L = typeof j == "string" ? j.trim() : "";
      for (const R of c.social_links) {
        if (!R.name.trim() && !R.url.trim()) continue;
        if (!R.name.trim() || !R.url.trim()) {
          (m.error("Cada red necesita nombre y URL"), me("redes"));
          return;
        }
        const G = R.url.trim();
        if (
          !G.startsWith("http://") &&
          !G.startsWith("https://") &&
          !G.startsWith("mailto:") &&
          !G.startsWith("tel:")
        ) {
          (m.error(`URL inválida en «${R.name || "red"}» (http(s)://, mailto: o tel:)`),
            me("redes"));
          return;
        }
      }
      const J = !!(c.logo_file || c.favicon_file || c.banner_file);
      try {
        let R = O?.id ?? null;
        if (
          (O
            ? await aa.mutateAsync({ id: O.id, data: { ...n, ...x } })
            : (R = (await $e.mutateAsync({ ...n, ...x })).id),
          R == null)
        )
          throw new Error("Sin id de sucursal");
        if (J) {
          if (c.logo_file) {
            const he = new FormData();
            (he.append("logo", c.logo_file), await aa.mutateAsync({ id: R, data: he }));
          }
          const G = new FormData();
          (L && G.append("app_name", L),
            c.logo_file && G.append("logo", c.logo_file),
            c.favicon_file && G.append("favicon", c.favicon_file),
            c.banner_file && G.append("banner_image", c.banner_file));
          const xe = await We.mutateAsync({ id: R, data: G });
          re((he) => ({
            ...he,
            logo_url: Xa(xe?.branding?.logo_url, xe?.logo, he.logo_url),
            favicon_url: Xa(xe?.branding?.favicon_url, xe?.favicon, he.favicon_url),
            banner_url: Xa(xe?.branding?.banner_image_url, xe?.banner_image, he.banner_url),
            logo_file: null,
            favicon_file: null,
            banner_file: null,
          }));
        } else L && (await We.mutateAsync({ id: R, data: { app_name: L } }));
        (m.success(O ? "Sucursal actualizada" : "Sucursal creada"), O ? se() : Ce());
      } catch (R) {
        m.error(R.friendlyMessage || "Error al guardar");
      }
    },
    pa = (n) => {
      Sa({ branch: n, nextActive: n.is_active === !1 });
    },
    Be = () => {
      if (!pe) return;
      const { branch: n, nextActive: j } = pe;
      (aa.mutate(
        { id: n.id, data: { is_active: j } },
        {
          onSuccess: () => {
            (m.success(j ? "Sucursal activada" : "Sucursal desactivada"),
              V === String(n.id) &&
                (re((x) => ({ ...x, is_active: j })), be((x) => x && { ...x, is_active: j })));
          },
          onError: (x) => m.error(x.friendlyMessage || "No se pudo cambiar el estado"),
        },
      ),
        Sa(null));
    },
    ga = O ? (z ? S : O.business_name || S) : "Nueva sucursal",
    xa = O ? (z && O.business_name) || en[Q].edit : en[Q].create,
    La = $e.isPending || aa.isPending || We.isPending,
    oa = s || i,
    ya = !!O && !ia,
    Ma = As();
  return e.jsx(ks, {
    mode: "wait",
    children: H
      ? e.jsx(
          xs.div,
          {
            initial: Ma ? !1 : { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto",
            children: e.jsx(on, { variant: "table" }),
          },
          "skeleton",
        )
      : e.jsxs(
          rn,
          {
            className: je || z ? "pt-3 pb-6 space-y-4" : void 0,
            children: [
              B &&
                e.jsx(Fe, {
                  children: e.jsx(tn, {
                    message:
                      `No se pudieron cargar las sucursales. ${ae?.friendlyMessage || ""}`.trim(),
                    onRetry: ba,
                  }),
                }),
              _ &&
                D.length === 0 &&
                e.jsx(Fe, {
                  children: e.jsx(Cs, {
                    title: "Sin sucursal",
                    description: "No tienes una sucursal asignada como propietario.",
                  }),
                }),
              !z &&
                !je &&
                e.jsxs(Fe, {
                  children: [
                    e.jsx(ln, {
                      countLabel: `${Ne.length} sucursal${Ne.length === 1 ? "" : "es"}`,
                      actions: [
                        {
                          label: "Actualizar",
                          icon: $a,
                          onClick: ba,
                          disabled: ue || F,
                          spinning: ue || F,
                        },
                        ...(p
                          ? [{ label: "Nueva", icon: De, onClick: ie, variant: "default" }]
                          : []),
                      ],
                    }),
                    e.jsx("div", {
                      className: "min-w-0 overflow-x-auto",
                      children: e.jsxs(cn, {
                        children: [
                          e.jsxs(dn, {
                            children: [
                              e.jsxs(Ea, {
                                className: "hover:bg-transparent border-border/50",
                                children: [
                                  [
                                    { key: "name", label: "Sucursal", className: void 0 },
                                    { key: "dni", label: "RUT", className: "hidden sm:table-cell" },
                                    ...(oa
                                      ? [
                                          {
                                            key: "org",
                                            label: "Organización",
                                            className: "hidden md:table-cell",
                                          },
                                        ]
                                      : []),
                                    {
                                      key: "domain",
                                      label: "Acceso",
                                      className: "hidden lg:table-cell",
                                    },
                                    {
                                      key: "email",
                                      label: "Email",
                                      className: "hidden xl:table-cell",
                                    },
                                  ].map((n) =>
                                    e.jsx(
                                      we,
                                      {
                                        className: n.className,
                                        children: e.jsx("button", {
                                          type: "button",
                                          onClick: (j) => {
                                            (j.stopPropagation(), ua(n.key));
                                          },
                                          className: K(
                                            "inline-flex max-w-full items-center truncate rounded-sm text-left transition-colors cursor-pointer hover:underline underline-offset-4 hover:text-foreground",
                                            Re(n.key)
                                              ? "text-primary hover:text-primary"
                                              : "text-muted-foreground",
                                          ),
                                          title: Re(n.key)
                                            ? "Cerrar filtro"
                                            : `Filtrar por ${n.label}`,
                                          "aria-pressed": Re(n.key),
                                          children: n.label,
                                        }),
                                      },
                                      n.key,
                                    ),
                                  ),
                                  e.jsx(we, {
                                    className: "text-right w-[72px]",
                                    children: e.jsx("span", {
                                      className: "sr-only",
                                      children: "Acciones",
                                    }),
                                  }),
                                ],
                              }),
                              Ee &&
                                e.jsxs(Ea, {
                                  className: "hover:bg-transparent border-border/40",
                                  children: [
                                    e.jsx(we, {
                                      className: "pt-0 pb-3 font-normal align-top",
                                      children: Re("name")
                                        ? e.jsx(f, {
                                            autoFocus: !!ye.name,
                                            value: ge.name,
                                            onChange: (n) => qe("name", n.target.value),
                                            placeholder: "Buscar por nombre…",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "hidden sm:table-cell pt-0 pb-3 font-normal align-top",
                                      children: Re("dni")
                                        ? e.jsx(f, {
                                            autoFocus: !!ye.dni,
                                            value: ge.dni,
                                            onChange: (n) => qe("dni", n.target.value),
                                            placeholder: "12.345.678-9",
                                            className:
                                              "h-8 text-xs font-normal font-mono bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    oa &&
                                      e.jsx(we, {
                                        className:
                                          "pt-0 pb-3 font-normal align-top hidden md:table-cell",
                                        children: Re("org")
                                          ? e.jsxs(He, {
                                              value: ge.org || "all",
                                              onValueChange: (n) => qe("org", n === "all" ? "" : n),
                                              children: [
                                                e.jsx(Qe, {
                                                  className:
                                                    "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                                  autoFocus: !!ye.org,
                                                  children: e.jsx(Je, {
                                                    placeholder: "Todas las orgs",
                                                  }),
                                                }),
                                                e.jsxs(Ke, {
                                                  children: [
                                                    e.jsx(de, {
                                                      value: "all",
                                                      children: "Todas las organizaciones",
                                                    }),
                                                    ce.map((n) =>
                                                      e.jsx(
                                                        de,
                                                        { value: String(n.id), children: n.name },
                                                        String(n.id),
                                                      ),
                                                    ),
                                                  ],
                                                }),
                                              ],
                                            })
                                          : null,
                                      }),
                                    e.jsx(we, {
                                      className:
                                        "pt-0 pb-3 font-normal align-top hidden lg:table-cell",
                                      children: Re("domain")
                                        ? e.jsx(f, {
                                            autoFocus: !!ye.domain,
                                            value: ge.domain,
                                            onChange: (n) => qe("domain", n.target.value),
                                            placeholder: "dominio o nombre corto",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, {
                                      className:
                                        "pt-0 pb-3 font-normal align-top hidden xl:table-cell",
                                      children: Re("email")
                                        ? e.jsx(f, {
                                            autoFocus: !!ye.email,
                                            value: ge.email,
                                            onChange: (n) => qe("email", n.target.value),
                                            placeholder: "correo@empresa.com",
                                            className:
                                              "h-8 text-xs font-normal bg-muted/30 border-border/60",
                                          })
                                        : null,
                                    }),
                                    e.jsx(we, { className: "pt-0 pb-3" }),
                                  ],
                                }),
                            ],
                          }),
                          e.jsxs(un, {
                            children: [
                              Ne.length === 0 &&
                                e.jsx(Ea, {
                                  className: "hover:bg-transparent",
                                  children: e.jsx(Le, {
                                    colSpan: oa ? 6 : 5,
                                    className: "p-4",
                                    children: e.jsx(Cs, {
                                      title:
                                        D.length === 0 ? "Sin sucursales" : "Sin coincidencias",
                                      description:
                                        D.length === 0
                                          ? p
                                            ? "Crea la primera sucursal para empezar."
                                            : "No tienes sucursales asignadas como propietario."
                                          : "Ninguna sucursal coincide con los filtros.",
                                      action:
                                        D.length === 0 && p
                                          ? e.jsxs(N, {
                                              size: "sm",
                                              onClick: ie,
                                              children: [
                                                e.jsx(De, { className: "h-4 w-4 mr-1.5" }),
                                                "Nueva",
                                              ],
                                            })
                                          : void 0,
                                    }),
                                  }),
                                }),
                              Ne.map((n) => {
                                const j = V === String(n.id);
                                return e.jsxs(
                                  Ea,
                                  {
                                    className: K(
                                      "cursor-pointer transition-colors",
                                      j && "bg-sidebar-accent/60",
                                    ),
                                    onClick: () => ze(n),
                                    children: [
                                      e.jsx(Le, {
                                        className: "min-w-0",
                                        children: e.jsxs("div", {
                                          className: "flex items-center gap-2 min-w-0",
                                          children: [
                                            e.jsx("span", {
                                              className: K(
                                                "h-2 w-2 rounded-full shrink-0",
                                                n.is_active !== !1
                                                  ? "bg-emerald-500"
                                                  : "bg-muted-foreground/40",
                                              ),
                                              title: n.is_active !== !1 ? "Activa" : "Inactiva",
                                            }),
                                            e.jsxs("div", {
                                              className: "min-w-0",
                                              children: [
                                                e.jsx("div", {
                                                  className: "font-medium text-sm truncate",
                                                  children: n.business_name,
                                                }),
                                                e.jsxs("div", {
                                                  className:
                                                    "text-xs text-muted-foreground truncate",
                                                  children: [
                                                    n.commune || n.email || "—",
                                                    e.jsx("span", {
                                                      className: "sm:hidden font-mono",
                                                      children: n.dni ? ` · ${n.dni}` : "",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      e.jsx(Le, {
                                        className:
                                          "hidden sm:table-cell font-mono text-xs whitespace-nowrap",
                                        children: n.dni || "—",
                                      }),
                                      oa &&
                                        e.jsx(Le, {
                                          className:
                                            "text-xs text-muted-foreground truncate max-w-[10rem] hidden md:table-cell",
                                          children:
                                            n.organization_name ||
                                            (n.organization != null ? `#${n.organization}` : "—"),
                                        }),
                                      e.jsx(Le, {
                                        className:
                                          "text-xs truncate max-w-[12rem] hidden lg:table-cell",
                                        onClick: (x) => x.stopPropagation(),
                                        children: (() => {
                                          const x = ce.find(
                                              (R) => String(R.id) === String(n.organization),
                                            )?.custom_domain,
                                            L = Jn({
                                              customDomain: n.custom_domain,
                                              organizationDomain: x,
                                              loginSlug: n.login_slug,
                                            });
                                          return !(
                                            !!n.custom_domain?.trim() ||
                                            !!x?.trim() ||
                                            !!n.login_slug?.trim()
                                          ) && L.source === "app"
                                            ? e.jsx("span", {
                                                className: "text-muted-foreground",
                                                children: "—",
                                              })
                                            : e.jsxs("a", {
                                                href: L.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className:
                                                  "inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 max-w-full",
                                                title: L.url,
                                                children: [
                                                  e.jsx("span", {
                                                    className: "truncate",
                                                    children:
                                                      n.custom_domain?.trim() ||
                                                      x?.trim() ||
                                                      n.login_slug ||
                                                      "Abrir",
                                                  }),
                                                  e.jsx(Nr, {
                                                    className: "h-3 w-3 shrink-0 opacity-80",
                                                  }),
                                                ],
                                              });
                                        })(),
                                      }),
                                      e.jsx(Le, {
                                        className:
                                          "text-xs text-muted-foreground truncate max-w-[12rem] hidden xl:table-cell",
                                        children: n.email || "—",
                                      }),
                                      e.jsx(Le, {
                                        className: "text-right",
                                        onClick: (x) => x.stopPropagation(),
                                        children: e.jsxs(_r, {
                                          children: [
                                            e.jsx(wr, {
                                              asChild: !0,
                                              children: e.jsx(N, {
                                                size: "icon",
                                                variant: "ghost",
                                                className: "h-8 w-8",
                                                title: "Más opciones",
                                                children: e.jsx(Sr, { className: "h-4 w-4" }),
                                              }),
                                            }),
                                            e.jsxs(Cr, {
                                              align: "end",
                                              className: "min-w-[12rem]",
                                              children: [
                                                tr.map(({ id: x, label: L, icon: J }) =>
                                                  e.jsxs(
                                                    rs,
                                                    {
                                                      onClick: () => ze(n, x),
                                                      children: [
                                                        e.jsx(J, {
                                                          className: "h-3.5 w-3.5 mr-2 opacity-80",
                                                        }),
                                                        L,
                                                      ],
                                                    },
                                                    x,
                                                  ),
                                                ),
                                                e.jsx(kr, {}),
                                                Nn(n.id) &&
                                                  e.jsx(rs, {
                                                    onClick: () => pa(n),
                                                    children:
                                                      n.is_active === !1
                                                        ? e.jsxs(e.Fragment, {
                                                            children: [
                                                              e.jsx(ci, {
                                                                className: "h-3.5 w-3.5 mr-2",
                                                              }),
                                                              " Activar",
                                                            ],
                                                          })
                                                        : e.jsxs(e.Fragment, {
                                                            children: [
                                                              e.jsx(di, {
                                                                className: "h-3.5 w-3.5 mr-2",
                                                              }),
                                                              " Desactivar",
                                                            ],
                                                          }),
                                                  }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  String(n.id),
                                );
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              je &&
                e.jsx(Fe, {
                  children: e.jsx(Fr, {
                    mode: z ? "owner" : "form",
                    panelKey: V ?? "new",
                    title: (z && (c.fantasy_name.trim() || c.business_name)) || ga,
                    meta: (z && (c.commercial_business.trim() || c.email.trim())) || void 0,
                    subtitle: z ? en[Q].edit : xa,
                    formHint: z ? void 0 : xa,
                    tabs: tr,
                    tab: Q,
                    onTabChange: (n) => me(n),
                    onClose: z ? void 0 : Ce,
                    logoUrl: c.logo_url || null,
                    bannerUrl: c.banner_url || null,
                    accentColor: c.primary_color || null,
                    initial: (c.fantasy_name || c.business_name || "S").charAt(0),
                    active: c.is_active,
                    onRefresh: z ? ba : void 0,
                    refreshing: ue || F,
                    footer: e.jsxs(e.Fragment, {
                      children: [
                        ia
                          ? e.jsxs(N, {
                              className: z ? void 0 : "min-w-[8rem]",
                              onClick: () => {
                                va();
                              },
                              disabled: La,
                              children: [
                                La && e.jsx(fa, { className: "h-4 w-4 animate-spin mr-2" }),
                                "Guardar",
                              ],
                            })
                          : e.jsx("p", {
                              className: "self-center text-xs text-muted-foreground",
                              children: "Solo lectura",
                            }),
                        !z && e.jsx(N, { variant: "outline", onClick: Ce, children: "Cancelar" }),
                      ],
                    }),
                    children: e.jsxs("fieldset", {
                      disabled: ya,
                      className: "space-y-5 min-w-0 border-0 p-0 m-0 disabled:opacity-80",
                      children: [
                        ya &&
                          e.jsx("p", {
                            className:
                              "text-xs text-muted-foreground rounded-md border border-border/70 bg-muted/40 px-3 py-2",
                            children: "Solo lectura — no eres propietario de esta sucursal.",
                          }),
                        Q === "datos" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Identidad",
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Nombre comercial *" }),
                                      e.jsx(f, {
                                        value: c.business_name,
                                        onChange: (n) => E("business_name", n.target.value),
                                        placeholder: "ej. Café del Sur SpA",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Giro *" }),
                                      e.jsx(f, {
                                        value: c.commercial_business,
                                        onChange: (n) => E("commercial_business", n.target.value),
                                        placeholder: "ej. Cafetería y pastelería",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Nombre fantasía" }),
                                          e.jsx(f, {
                                            value: c.fantasy_name,
                                            onChange: (n) => E("fantasy_name", n.target.value),
                                            placeholder: "ej. Café del Sur",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "RUT" }),
                                          e.jsx(f, {
                                            value: c.dni,
                                            onChange: (n) => E("dni", n.target.value),
                                            className: "font-mono",
                                            placeholder: "76.111.222-3",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Contacto / geo *",
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Email *" }),
                                          e.jsx(f, {
                                            type: "email",
                                            value: c.email,
                                            onChange: (n) => E("email", n.target.value),
                                            placeholder: "contacto@empresa.cl",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Teléfono *" }),
                                          e.jsx(f, {
                                            value: c.phone,
                                            onChange: (n) => E("phone", n.target.value),
                                            placeholder: "+56 9 1234 5678",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-1 gap-2 sm:grid-cols-3",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Región *" }),
                                          e.jsxs(He, {
                                            value: c.region || void 0,
                                            onValueChange: ka,
                                            children: [
                                              e.jsx(Qe, {
                                                children: e.jsx(Je, { placeholder: "Selecciona" }),
                                              }),
                                              e.jsxs(Ke, {
                                                children: [
                                                  c.region &&
                                                    !za &&
                                                    e.jsxs(de, {
                                                      value: c.region,
                                                      children: [c.region, " (actual)"],
                                                    }),
                                                  Pn.map((n) =>
                                                    e.jsx(
                                                      de,
                                                      { value: n.name, children: n.name },
                                                      n.name,
                                                    ),
                                                  ),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Provincia *" }),
                                          e.jsxs(He, {
                                            value: c.province || void 0,
                                            onValueChange: Ia,
                                            disabled: !c.region,
                                            children: [
                                              e.jsx(Qe, {
                                                children: e.jsx(Je, {
                                                  placeholder: c.region
                                                    ? "Selecciona"
                                                    : "Región primero",
                                                }),
                                              }),
                                              e.jsxs(Ke, {
                                                children: [
                                                  c.province &&
                                                    !Xe &&
                                                    e.jsxs(de, {
                                                      value: c.province,
                                                      children: [c.province, " (actual)"],
                                                    }),
                                                  Ca.map((n) =>
                                                    e.jsx(
                                                      de,
                                                      { value: n.name, children: n.name },
                                                      n.name,
                                                    ),
                                                  ),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Comuna *" }),
                                          e.jsxs(He, {
                                            value: c.commune || void 0,
                                            onValueChange: (n) => E("commune", n),
                                            disabled: !c.province,
                                            children: [
                                              e.jsx(Qe, {
                                                children: e.jsx(Je, {
                                                  placeholder: c.province
                                                    ? "Selecciona"
                                                    : "Provincia primero",
                                                }),
                                              }),
                                              e.jsxs(Ke, {
                                                children: [
                                                  c.commune &&
                                                    !Ze &&
                                                    e.jsxs(de, {
                                                      value: c.commune,
                                                      children: [c.commune, " (actual)"],
                                                    }),
                                                  te.map((n) =>
                                                    e.jsx(de, { value: n, children: n }, n),
                                                  ),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Dirección *" }),
                                      e.jsx(f, {
                                        value: c.address,
                                        onChange: (n) => E("address", n.target.value),
                                        placeholder: "ej. Av. Providencia 1234, local 5",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Operación",
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Organización" }),
                                      s
                                        ? e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsxs(He, {
                                                value: c.organization || "none",
                                                onValueChange: (n) =>
                                                  E("organization", n === "none" ? "" : n),
                                                disabled: ya,
                                                children: [
                                                  e.jsx(Qe, {
                                                    children: e.jsx(Je, { placeholder: "Ninguna" }),
                                                  }),
                                                  e.jsxs(Ke, {
                                                    children: [
                                                      e.jsx(de, {
                                                        value: "none",
                                                        children: "Ninguna",
                                                      }),
                                                      ce.map((n) =>
                                                        e.jsx(
                                                          de,
                                                          { value: String(n.id), children: n.name },
                                                          String(n.id),
                                                        ),
                                                      ),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              e.jsx("p", {
                                                className: "mt-1 text-[11px] text-muted-foreground",
                                                children:
                                                  "Solo super admin vincula o desvincula sucursales a una organización.",
                                              }),
                                            ],
                                          })
                                        : i
                                          ? e.jsx("p", {
                                              className: "mt-1 text-sm text-muted-foreground",
                                              children:
                                                Z ||
                                                ce.find(
                                                  (n) => String(n.id) === String(c.organization),
                                                )?.name ||
                                                O?.organization_name ||
                                                "Tu organización",
                                            })
                                          : e.jsx("p", {
                                              className: "mt-1 text-sm text-muted-foreground",
                                              children:
                                                O?.organization_name ||
                                                (c.organization ? `#${c.organization}` : "—"),
                                            }),
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
                                    children: e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Email de envío" }),
                                        e.jsx(f, {
                                          value: c.from_email,
                                          onChange: (n) => E("from_email", n.target.value),
                                          placeholder: "noreply@empresa.cl",
                                        }),
                                      ],
                                    }),
                                  }),
                                  e.jsxs("div", {
                                    className: "flex flex-col gap-2.5 text-sm",
                                    children: [
                                      e.jsxs("label", {
                                        className: "flex items-center gap-2 cursor-pointer",
                                        children: [
                                          e.jsx(_a, {
                                            checked: c.is_active,
                                            onCheckedChange: (n) => E("is_active", n === !0),
                                          }),
                                          "Sucursal activa",
                                        ],
                                      }),
                                      e.jsxs("label", {
                                        className: "flex items-center gap-2 cursor-pointer",
                                        children: [
                                          e.jsx(_a, {
                                            checked: c.allow_multi_branch_access,
                                            onCheckedChange: (n) =>
                                              E("allow_multi_branch_access", n === !0),
                                          }),
                                          "Permitir multi-sucursal",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        Q === "apariencia" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Marca",
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Nombre en el menú" }),
                                      e.jsx(f, {
                                        value: c.app_name,
                                        onChange: (n) => E("app_name", n.target.value),
                                        placeholder: "Ej. Smart Hydro",
                                      }),
                                      e.jsx("p", {
                                        className: "mt-1 text-[11px] text-muted-foreground",
                                        children:
                                          "Aparece debajo del nombre de fantasía en el menú.",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: [
                                      e.jsx(cr, {
                                        label: "Color principal",
                                        value: c.primary_color,
                                        onChange: (n) => E("primary_color", n),
                                      }),
                                      e.jsx(cr, {
                                        label: "Color secundario",
                                        value: c.secondary_color,
                                        onChange: (n) => E("secondary_color", n),
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Eslogan" }),
                                      e.jsx(f, {
                                        value: c.tagline,
                                        onChange: (n) => E("tagline", n.target.value),
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx(g, { children: "Descripción de marca" }),
                                      e.jsx(Ss, {
                                        value: c.brand_description,
                                        onChange: (n) => E("brand_description", n.target.value),
                                        rows: 3,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Imágenes",
                                  }),
                                  e.jsx(Cn, {
                                    label: "Logo",
                                    hint: "PNG, JPG, WebP o GIF. Máximo 2 MB.",
                                    previewUrl: c.logo_url,
                                    file: c.logo_file,
                                    onFile: (n) => E("logo_file", n),
                                  }),
                                  e.jsx(Cn, {
                                    label: "Ícono de pestaña",
                                    hint: "El ícono chico del navegador. PNG, ICO o WebP. Máximo 2 MB.",
                                    previewUrl: c.favicon_url,
                                    file: c.favicon_file,
                                    onFile: (n) => E("favicon_file", n),
                                  }),
                                  e.jsx(Cn, {
                                    label: "Imagen de portada",
                                    hint: "Se muestra en la pantalla de ingreso. PNG, JPG o WebP. Máximo 2 MB.",
                                    previewUrl: c.banner_url,
                                    file: c.banner_file,
                                    onFile: (n) => E("banner_file", n),
                                  }),
                                ],
                              }),
                              e.jsxs("section", {
                                className: "space-y-3",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Estilo",
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-2 gap-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Tamaño de texto" }),
                                          e.jsx(f, {
                                            type: "number",
                                            min: 12,
                                            max: 20,
                                            value: c.font_size,
                                            onChange: (n) =>
                                              E("font_size", Number(n.target.value) || 14),
                                          }),
                                          e.jsx("p", {
                                            className: "mt-1 text-[11px] text-muted-foreground",
                                            children: "12–20 px",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Redondeo de bordes" }),
                                          e.jsx(f, {
                                            type: "number",
                                            min: 0,
                                            max: 24,
                                            value: c.border_radius,
                                            onChange: (n) =>
                                              E("border_radius", Number(n.target.value) || 0),
                                          }),
                                          e.jsx("p", {
                                            className: "mt-1 text-[11px] text-muted-foreground",
                                            children: "0–24 px",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("label", {
                                    className: "flex items-center gap-2 text-sm cursor-pointer",
                                    children: [
                                      e.jsx(_a, {
                                        checked: c.compact,
                                        onCheckedChange: (n) => E("compact", n === !0),
                                      }),
                                      "Interfaz compacta",
                                    ],
                                  }),
                                  e.jsxs("label", {
                                    className: "flex items-center gap-2 text-sm cursor-pointer",
                                    children: [
                                      e.jsx(_a, {
                                        checked: c.motion,
                                        onCheckedChange: (n) => E("motion", n === !0),
                                      }),
                                      "Animaciones",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        Q === "redes" &&
                          e.jsxs("section", {
                            className: "space-y-3",
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx(g, { children: "Sitio web" }),
                                  e.jsx(f, {
                                    value: c.website_url,
                                    onChange: (n) => E("website_url", n.target.value),
                                    placeholder: "https://…",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex items-center justify-between gap-2 pt-1",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Redes sociales",
                                  }),
                                  e.jsxs(N, {
                                    type: "button",
                                    size: "sm",
                                    variant: "outline",
                                    onClick: Pa,
                                    children: [
                                      e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                      "Agregar",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-[11px] text-muted-foreground",
                                children:
                                  "Instagram, WhatsApp, TikTok u otras redes de la sucursal.",
                              }),
                              c.social_links.length === 0
                                ? e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children: "Sin links. Agrega las redes que quieras mostrar.",
                                  })
                                : e.jsx("div", {
                                    className: "space-y-3",
                                    children: c.social_links.map((n, j) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className:
                                            "rounded-md border border-border/70 p-3 space-y-2 bg-muted/10",
                                          children: [
                                            e.jsxs("div", {
                                              className: "flex items-center justify-between gap-2",
                                              children: [
                                                e.jsxs("span", {
                                                  className:
                                                    "text-[11px] font-medium text-muted-foreground",
                                                  children: ["Link ", j + 1],
                                                }),
                                                e.jsx(N, {
                                                  type: "button",
                                                  size: "icon",
                                                  variant: "ghost",
                                                  className: "h-7 w-7",
                                                  onClick: () => Ua(n.key),
                                                  title: "Eliminar",
                                                  children: e.jsx(Za, { className: "h-3.5 w-3.5" }),
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              className: "grid grid-cols-2 gap-2",
                                              children: [
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx(g, { children: "Nombre *" }),
                                                    e.jsx(f, {
                                                      value: n.name,
                                                      onChange: (x) =>
                                                        le(n.key, { name: x.target.value }),
                                                      placeholder: "Instagram",
                                                    }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx(g, { children: "Ícono" }),
                                                    e.jsxs(He, {
                                                      value: n.icon || "web",
                                                      onValueChange: (x) => le(n.key, { icon: x }),
                                                      children: [
                                                        e.jsx(Qe, {
                                                          children: e.jsx(Je, {
                                                            placeholder: "Ícono",
                                                          }),
                                                        }),
                                                        e.jsxs(Ke, {
                                                          children: [
                                                            ir.map((x) =>
                                                              e.jsx(
                                                                de,
                                                                {
                                                                  value: x.value,
                                                                  children: x.label,
                                                                },
                                                                x.value,
                                                              ),
                                                            ),
                                                            !ir.some((x) => x.value === n.icon) &&
                                                              n.icon &&
                                                              e.jsx(de, {
                                                                value: n.icon,
                                                                children: n.icon,
                                                              }),
                                                          ],
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Enlace *" }),
                                                e.jsx(f, {
                                                  value: n.url,
                                                  onChange: (x) =>
                                                    le(n.key, { url: x.target.value }),
                                                  placeholder: "https://instagram.com/…",
                                                  className: "font-mono text-sm",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("label", {
                                              className:
                                                "flex items-center gap-2 text-sm cursor-pointer",
                                              children: [
                                                e.jsx(_a, {
                                                  checked: n.enabled,
                                                  onCheckedChange: (x) =>
                                                    le(n.key, { enabled: x === !0 }),
                                                }),
                                                "Habilitado",
                                              ],
                                            }),
                                          ],
                                        },
                                        n.key,
                                      ),
                                    ),
                                  }),
                            ],
                          }),
                        Q === "acceso" &&
                          e.jsxs("section", {
                            className: "space-y-3",
                            children: [
                              e.jsx("h3", {
                                className:
                                  "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                children: "Ingreso al portal",
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx(g, { children: "Dominio propio" }),
                                  e.jsx(f, {
                                    value: c.custom_domain,
                                    onChange: (n) => E("custom_domain", n.target.value),
                                    placeholder: "portal.cliente.com",
                                  }),
                                  e.jsx("p", {
                                    className: "mt-1 text-[11px] text-muted-foreground",
                                    children:
                                      "Opcional. Si lo tienes, tus clientes entran por ese dominio.",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx(g, { children: "Nombre corto del link" }),
                                  e.jsx(f, {
                                    value: c.login_slug,
                                    onChange: (n) => E("login_slug", n.target.value),
                                    placeholder: "mi-tienda",
                                  }),
                                  e.jsx("p", {
                                    className: "mt-1 text-[11px] text-muted-foreground",
                                    children:
                                      "Se usa cuando no hay dominio propio (ni de la organización).",
                                  }),
                                ],
                              }),
                              e.jsx(Dr, {
                                customDomain: c.custom_domain,
                                organizationDomain: ce.find(
                                  (n) => String(n.id) === String(c.organization),
                                )?.custom_domain,
                                loginSlug: c.login_slug,
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx(g, { children: "Mensaje de bienvenida" }),
                                  e.jsx(f, {
                                    value: c.login_welcome_message,
                                    onChange: (n) => E("login_welcome_message", n.target.value),
                                    placeholder: "¡Bienvenido!",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx(g, { children: "Texto de apoyo" }),
                                  e.jsx(f, {
                                    value: c.login_subtitle,
                                    onChange: (n) => E("login_subtitle", n.target.value),
                                    placeholder: "Ingresá con tu cuenta",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        Q === "patrocinadores" &&
                          e.jsxs("section", {
                            className: "space-y-3",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                  e.jsx("h3", {
                                    className:
                                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                                    children: "Patrocinadores",
                                  }),
                                  e.jsxs(N, {
                                    type: "button",
                                    size: "sm",
                                    variant: "outline",
                                    onClick: ma,
                                    children: [
                                      e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                      "Agregar",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("label", {
                                className: "flex items-center gap-2 text-sm cursor-pointer",
                                children: [
                                  e.jsx(_a, {
                                    checked: c.show_sponsor_logos,
                                    onCheckedChange: (n) => E("show_sponsor_logos", n === !0),
                                  }),
                                  "Mostrar patrocinadores al ingresar",
                                ],
                              }),
                              c.sponsors.length === 0
                                ? e.jsx("p", {
                                    className: "text-[11px] text-muted-foreground",
                                    children:
                                      "Sin patrocinadores. Agrega partners con nombre, imagen y sitio web.",
                                  })
                                : e.jsx("div", {
                                    className: "space-y-3",
                                    children: c.sponsors.map((n, j) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className:
                                            "rounded-md border border-border/70 p-3 space-y-2 bg-muted/10",
                                          children: [
                                            e.jsxs("div", {
                                              className: "flex items-center justify-between gap-2",
                                              children: [
                                                e.jsxs("span", {
                                                  className:
                                                    "text-[11px] font-medium text-muted-foreground",
                                                  children: ["Patrocinador ", j + 1],
                                                }),
                                                e.jsx(N, {
                                                  type: "button",
                                                  size: "icon",
                                                  variant: "ghost",
                                                  className: "h-7 w-7",
                                                  onClick: () => oe(n.key),
                                                  title: "Eliminar",
                                                  children: e.jsx(Za, { className: "h-3.5 w-3.5" }),
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Nombre *" }),
                                                e.jsx(f, {
                                                  value: n.name,
                                                  onChange: (x) =>
                                                    ke(n.key, { name: x.target.value }),
                                                  placeholder: "Sercotec",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Imagen" }),
                                                e.jsx(f, {
                                                  value: n.logo_url,
                                                  onChange: (x) =>
                                                    ke(n.key, { logo_url: x.target.value }),
                                                  placeholder: "https://…/imagen.png",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("div", {
                                              children: [
                                                e.jsx(g, { children: "Sitio web" }),
                                                e.jsx(f, {
                                                  value: n.website_url,
                                                  onChange: (x) =>
                                                    ke(n.key, { website_url: x.target.value }),
                                                  placeholder: "https://…",
                                                }),
                                              ],
                                            }),
                                            e.jsxs("label", {
                                              className:
                                                "flex items-center gap-2 text-sm cursor-pointer",
                                              children: [
                                                e.jsx(_a, {
                                                  checked: n.enabled,
                                                  onCheckedChange: (x) =>
                                                    ke(n.key, { enabled: x === !0 }),
                                                }),
                                                "Habilitado",
                                              ],
                                            }),
                                          ],
                                        },
                                        n.key,
                                      ),
                                    ),
                                  }),
                            ],
                          }),
                      ],
                    }),
                  }),
                }),
              e.jsx(Fn, {
                open: pe != null,
                onOpenChange: (n) => {
                  n || Sa(null);
                },
                children: e.jsxs(Dn, {
                  children: [
                    e.jsxs($n, {
                      children: [
                        e.jsx(Un, {
                          children: pe?.nextActive ? "Activar sucursal" : "Desactivar sucursal",
                        }),
                        e.jsx(qn, {
                          children: pe?.nextActive
                            ? `¿Activar «${pe.branch.business_name}»? Volverá a estar disponible en el sistema.`
                            : `¿Desactivar «${pe?.branch.business_name}»? Soft delete: no se borra, solo queda inactiva.`,
                        }),
                      ],
                    }),
                    e.jsxs(Vn, {
                      children: [
                        e.jsx(Gn, { children: "Cancelar" }),
                        e.jsx(Hn, {
                          className: pe?.nextActive
                            ? void 0
                            : "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                          onClick: Be,
                          children: pe?.nextActive ? "Activar" : "Desactivar",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsx(Qn, {
                open: ja,
                onOpenChange: sa,
                visible: !je && !z,
                actions: [
                  {
                    label: "Actualizar",
                    icon: $a,
                    onClick: ba,
                    disabled: ue || F,
                    spinning: ue || F,
                  },
                  ...(p ? [{ label: "Nueva", icon: De, onClick: ie }] : []),
                ],
              }),
            ],
          },
          "content",
        ),
  });
}
const mo = Object.freeze(
    Object.defineProperty({ __proto__: null, default: no }, Symbol.toStringTag, {
      value: "Module",
    }),
  ),
  Ya = Rs,
  ws = 10;
let dr = 0;
function ms() {
  return ((dr += 1), `draft-${dr}`);
}
function an(s) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ").trim() || s.username || s.email;
}
function ur(s) {
  return (s.trim().split("@")[0] || "").toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
}
function ro() {
  const s = hs(),
    [i, o] = Ln(),
    p = sn(),
    _ = Mn(),
    S = ui(),
    C = t.useMemo(() => {
      if (p) return null;
      const l = mi();
      return _ && l.length === 0 ? null : new Set(l);
    }, [p, _]),
    U = t.useMemo(() => {
      if (p) return null;
      const l = Lr();
      return _ && l.length === 0 ? null : new Set(l);
    }, [p, _]),
    Z = pr(),
    { data: W = [] } = gr(),
    { data: ee = [] } = nn({ enabled: p, refetchOnMount: p ? "always" : !1 }),
    { data: H = [] } = zn({ enabled: p, refetchOnMount: p ? "always" : !1 }),
    { data: F = [] } = vr({ allBranches: !0 }),
    [B, ae] = t.useState(Ya),
    [D, z] = t.useState(Ya),
    [ce, se] = t.useState(""),
    $e = t.useDeferredValue(ce),
    aa = ce !== $e,
    [We, I] = t.useState(1),
    [wa, ue] = t.useState(!1),
    [Me, ja] = t.useState(!1);
  t.useEffect(() => {
    if (Z) return;
    if (!C || C.size === 0) {
      ae(Ya);
      return;
    }
    const l = Array.from(C)[0];
    ae(l);
  }, [Z, C]);
  const { data: sa = [], isLoading: je, isFetching: Ue, isError: Q } = Or(),
    me = Si(),
    O = Ci(),
    be = ki(),
    V = Li(),
    ve = Ai(),
    c = Pi(),
    re = pi(),
    pe = Mi(),
    Sa = async () => {
      ja(!0);
      try {
        await Promise.all([
          s.invalidateQueries({ queryKey: ["accounts", "users"] }),
          s.invalidateQueries({ queryKey: ["branches", "users"] }),
          s.invalidateQueries({ queryKey: ["branches", "roles"] }),
          s.invalidateQueries({ queryKey: ["branches", "organizations"] }),
        ]);
      } finally {
        (ja(!1), ue(!1));
      }
    },
    [ge, na] = t.useState(null),
    [ye, ra] = t.useState(null),
    [Te, ia] = t.useState(null),
    [Se, Ye] = t.useState(!1),
    [Oe, Ca] = t.useState("edit"),
    [te, za] = t.useState(null),
    [Xe, Ze] = t.useState(""),
    [E, ka] = t.useState(""),
    [Ia, qe] = t.useState(""),
    [ua, Re] = t.useState(""),
    [Ee, Ne] = t.useState(""),
    [ba, Ce] = t.useState(!0),
    [ie, ze] = t.useState(!1),
    [Aa, ne] = t.useState(""),
    [ke, ma] = t.useState(""),
    [oe, le] = t.useState([]),
    [Pa, Ua] = t.useState([]),
    [va, pa] = t.useState(""),
    [Be, ga] = t.useState(""),
    [xa, La] = t.useState(""),
    oa = Se && Oe === "edit" ? oe[0]?.branchId || Aa : Se && Oe === "assign" ? Be : "",
    { isFetching: ya } = gi(oa || null),
    Ma = Ar,
    [n, j] = t.useState(!1),
    [x, L] = t.useState(null),
    [J, R] = t.useState(null),
    G = t.useMemo(() => {
      const l = new Map();
      for (const u of F) {
        if (u.is_active === !1 || (C && !C.has(String(u.branch)))) continue;
        const w = String(u.user),
          M = l.get(w) ?? [];
        (M.push(u), l.set(w, M));
      }
      return l;
    }, [F, C]),
    xe = t.useMemo(() => {
      const l = new Map();
      for (const u of W) l.set(String(u.value), { id: String(u.value), label: u.label });
      for (const u of ee) {
        const w = String(u.id),
          M = l.get(w);
        l.set(w, {
          id: w,
          label: M?.label || u.business_name || u.fantasy_name || `Sucursal ${w}`,
          orgId: u.organization != null ? String(u.organization) : M?.orgId,
          orgName: u.organization_name || M?.orgName,
        });
      }
      if (te)
        for (const u of oe) {
          if (!u.branchId || l.has(u.branchId)) continue;
          const w = (G.get(String(te.id)) ?? []).find((M) => String(M.branch) === u.branchId);
          l.set(u.branchId, { id: u.branchId, label: w?.branch_name || `Sucursal ${u.branchId}` });
        }
      return Array.from(l.values())
        .filter((u) => !C || C.has(u.id))
        .sort((u, w) => u.label.localeCompare(w.label));
    }, [W, ee, te, oe, G, C]),
    he = t.useMemo(() => (U ? xe.filter((l) => U.has(l.id)) : xe), [xe, U]),
    Oa = oe[0],
    qa = t.useMemo(() => new Map(xe.map((u) => [u.id, u])), [xe]),
    Ve = t.useMemo(() => {
      const l = new Map(),
        u = new Map();
      for (const w of H) {
        if (w.owner != null && w.owner !== "") {
          const h = String(w.owner),
            k = l.get(h) ?? [];
          (k.push(w), l.set(h, k));
        }
        const M = w.owner_email?.trim().toLowerCase();
        if (M) {
          const h = u.get(M) ?? [];
          (h.push(w), u.set(M, h));
        }
      }
      return { byId: l, byEmail: u };
    }, [H]),
    Ie = (l) => {
      const u = Ve.byId.get(String(l.id));
      if (u?.length) return u;
      const w = l.email?.trim().toLowerCase();
      return w ? (Ve.byEmail.get(w) ?? []) : [];
    },
    Qa = (l, u) => {
      le((w) => w.map((M) => (M.key === l ? { ...M, ...u } : M)));
    },
    Y = () => {
      le((l) => [...l, { key: ms(), assignmentId: null, branchId: "", roleCode: "" }]);
    },
    Ja = (l) => {
      le((u) => (u.length <= 1 ? u : u.filter((w) => w.key !== l)));
    },
    Ae = t.useMemo(() => {
      const l = $e.trim().toLowerCase();
      return sa.filter((u) => {
        if (
          l &&
          ![u.email, u.username, u.first_name, u.last_name, u.dni]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(l)
        )
          return !1;
        const w = G.get(String(u.id)) ?? [];
        if ((C && w.length === 0) || (B !== Ya && !w.some((h) => String(h.branch) === B)))
          return !1;
        if (p && D !== Ya) {
          const M = w.some((k) => qa.get(String(k.branch))?.orgId === D),
            h = Ie(u).some((k) => String(k.id) === D);
          if (!M && !h) return !1;
        }
        return !0;
      });
    }, [sa, $e, B, D, G, qa, C, p, Ve]),
    la = Math.max(1, Math.ceil(Ae.length / ws)),
    _e = Math.min(We, la),
    ca = t.useMemo(() => {
      const l = (_e - 1) * ws;
      return Ae.slice(l, l + ws);
    }, [Ae, _e]);
  (t.useEffect(() => {
    I(1);
  }, [B, D, $e]),
    t.useEffect(() => {
      We > la && I(la);
    }, [We, la]));
  const Ta = Ae.length === 0 ? 0 : (_e - 1) * ws + 1,
    Va = Math.min(_e * ws, Ae.length),
    ea = () => {
      (Ye(!1), za(null), ue(!1), i.get("view") && o({}, { replace: !0 }));
    },
    Ra = () => {
      if (!S) {
        m.error("Solo el propietario puede crear usuarios");
        return;
      }
      (Ca("edit"), za(null), Ze(""), ka(""), qe(""), Re(""), Ne(nr()), Ce(!0), ze(!1));
      const l = B !== Ya && ys(B) ? B : he[0]?.id || "",
        u = { key: ms(), assignmentId: null, branchId: l, roleCode: "" };
      (le([u]), Ua([]), ne(l), ma(""), Ye(!0), ue(!1), o({ view: "nuevo" }, { replace: !0 }));
    },
    $ = (l) => {
      if (!S) {
        m.error("Solo el propietario puede editar usuarios");
        return;
      }
      (Ca("edit"),
        za(l),
        Ze(l.email || ""),
        ka(l.first_name || ""),
        qe(l.last_name || ""),
        Re(l.dni || ""),
        Ne(""),
        Ce(!1));
      const u = !!l.is_multi_branch;
      ze(u);
      const w = G.get(String(l.id)) ?? [],
        M =
          w.length > 0
            ? w.map((k) => ({
                key: ms(),
                assignmentId: String(k.id),
                branchId: String(k.branch),
                roleCode: (k.role_code || "").trim(),
              }))
            : [{ key: ms(), assignmentId: null, branchId: "", roleCode: "" }],
        h = u ? M : [B !== Ya ? (M.find((k) => k.branchId === B) ?? M[0]) : M[0]];
      (le(h),
        Ua(
          w.map((k) => ({
            key: String(k.id),
            assignmentId: String(k.id),
            branchId: String(k.branch),
            roleCode: (k.role_code || "").trim(),
          })),
        ),
        ne(h[0]?.branchId || ""),
        ma(h[0]?.roleCode || ""),
        Ye(!0),
        ue(!1),
        o({ view: "editar", id: String(l.id) }, { replace: !0 }));
    },
    Ba = () => {
      if (!S) {
        m.error("Solo el propietario puede asignar usuarios");
        return;
      }
      (Ca("assign"),
        pa(""),
        ga(B !== Ya && ys(B) ? B : he[0]?.id || ""),
        La(""),
        Ye(!0),
        ue(!1),
        o({ view: "asignar" }, { replace: !0 }));
    },
    Fa = async (l) => {
      (await An(l)) ? m.success("Contraseña copiada") : m.error("No se pudo copiar");
    },
    Ga = async (l) => {
      const u = l.trim();
      if (!u) return;
      (await An(u)) ? m.success("Correo copiado") : m.error("No se pudo copiar");
    },
    ta = (l) => R({ type: "regenPassword", user: l }),
    Ka = (l) => R({ type: "delete", user: l }),
    is = (l) => R({ type: "toggle", user: l }),
    es = (l, u) => R({ type: "unassign", assignmentId: l, label: u }),
    as = () => {
      if (!J) return;
      const l = J;
      if ((R(null), l.type === "regenPassword")) {
        (na(String(l.user.id)),
          pe.mutate(l.user.id, {
            onSuccess: (u) => {
              (L(u), j(!0), m.success(u.message || "Contraseña generada y asignada"));
            },
            onError: (u) => m.error(u.friendlyMessage || "No se pudo generar la contraseña"),
            onSettled: () => na(null),
          }));
        return;
      }
      if (l.type === "delete") {
        (ra(String(l.user.id)),
          be.mutate(l.user.id, {
            onSuccess: () => m.success("Usuario desactivado"),
            onError: (u) => m.error(u.friendlyMessage || "No se pudo desactivar"),
            onSettled: () => ra(null),
          }));
        return;
      }
      if (l.type === "toggle") {
        (ia(String(l.user.id)),
          V.mutate(l.user.id, {
            onSuccess: (u) =>
              m.success(
                u.message || (u.is_active !== !1 ? "Usuario activado" : "Usuario desactivado"),
              ),
            onError: (u) => m.error(u.friendlyMessage || "No se pudo cambiar el estado"),
            onSettled: () => ia(null),
          }));
        return;
      }
      re.mutate(l.assignmentId, {
        onSuccess: () => m.success("Acceso removido"),
        onError: (u) => m.error(u.friendlyMessage || "No se pudo remover"),
      });
    },
    os = async () => {
      if (!Xe.trim()) {
        m.error("Email requerido");
        return;
      }
      if (!ua.trim()) {
        m.error("RUT / DNI requerido (formato 12.345.678-9)");
        return;
      }
      if (te) {
        if (!S) {
          m.error("Solo el propietario puede editar usuarios");
          return;
        }
        const w = ie ? oe : oe.slice(0, 1);
        if (w.some((h) => !h.branchId || !h.roleCode)) {
          m.error("Elige sucursal y rol en cada fila");
          return;
        }
        const M = w.map((h) => h.branchId);
        if (new Set(M).size !== M.length) {
          m.error("No puedes repetir la misma sucursal");
          return;
        }
        for (const h of w)
          if (!ys(h.branchId)) {
            m.error("Solo puedes gestionar usuarios en sucursales donde eres propietario");
            return;
          }
        try {
          await O.mutateAsync({
            id: te.id,
            data: {
              email: Xe.trim(),
              first_name: E.trim(),
              last_name: Ia.trim(),
              dni: ua.trim(),
              is_multi_branch: ie,
              ...(Ee.trim() ? { password: Ee.trim() } : {}),
            },
          });
          const h = new Set(w.map((k) => k.assignmentId).filter((k) => !!k));
          for (const k of Pa)
            k.assignmentId && !h.has(k.assignmentId) && (await re.mutateAsync(k.assignmentId));
          for (const k of w)
            if (k.assignmentId) {
              const Ge = Pa.find((ha) => ha.assignmentId === k.assignmentId);
              Ge && Ge.branchId === k.branchId && Ge.roleCode !== k.roleCode
                ? await c.mutateAsync({ user_id: te.id, branch_id: k.branchId, role: k.roleCode })
                : Ge &&
                  Ge.branchId !== k.branchId &&
                  (await re.mutateAsync(k.assignmentId),
                  await ve.mutateAsync({
                    user_id: te.id,
                    branch_id: k.branchId,
                    role: k.roleCode,
                    is_active: !0,
                  }));
            } else
              await ve.mutateAsync({
                user_id: te.id,
                branch_id: k.branchId,
                role: k.roleCode,
                is_active: !0,
              });
          (m.success("Usuario actualizado"), ea());
        } catch (h) {
          m.error(h.friendlyMessage || "Error");
        }
        return;
      }
      if (!Ee.trim()) {
        m.error("Contraseña requerida");
        return;
      }
      if (!S) {
        m.error("Solo el propietario puede crear usuarios");
        return;
      }
      const l = ie ? oe : oe.slice(0, 1),
        u = l[0];
      if (!p && (!u?.branchId || !u?.roleCode)) {
        m.error("Elige sucursal y rol");
        return;
      }
      if (u.branchId && !ys(u.branchId)) {
        m.error("Solo puedes crear usuarios en sucursales donde eres propietario");
        return;
      }
      me.mutate(
        {
          user_data: {
            email: Xe.trim(),
            password: Ee.trim(),
            first_name: E.trim() || void 0,
            last_name: Ia.trim() || void 0,
            dni: ua.trim(),
            is_multi_branch: ie,
          },
          ...(u?.branchId && u?.roleCode
            ? { branch_assignment: { branch_id: u.branchId, role: u.roleCode, is_active: !0 } }
            : {}),
        },
        {
          onSuccess: async (w) => {
            const M = w.user?.id;
            if (M && u.branchId && u.roleCode && !w.branch_assignment)
              try {
                await ve.mutateAsync({
                  user_id: M,
                  branch_id: u.branchId,
                  role: u.roleCode,
                  is_active: !0,
                });
              } catch (h) {
                (m.error(
                  h.friendlyMessage || "Usuario creado, pero no se pudo asignar la sucursal",
                ),
                  ea());
                return;
              }
            if (M && ie && l.length > 1)
              try {
                for (const h of l.slice(1))
                  !h.branchId ||
                    !h.roleCode ||
                    (await ve.mutateAsync({
                      user_id: M,
                      branch_id: h.branchId,
                      role: h.roleCode,
                      is_active: !0,
                    }));
              } catch (h) {
                (m.error(h.friendlyMessage || "Usuario creado, pero falló una asignación extra"),
                  ea());
                return;
              }
            (m.success(w.message || "Usuario creado — guarda la contraseña"),
              ea(),
              u.branchId && ae(String(u.branchId)));
          },
          onError: (w) => m.error(w.friendlyMessage || "Error al crear"),
        },
      );
    },
    Wa = () => {
      if (!S) {
        m.error("Solo el propietario puede asignar usuarios");
        return;
      }
      if (!va || !Be || !xa) {
        m.error("Usuario, sucursal y rol son requeridos");
        return;
      }
      if (!ys(Be)) {
        m.error("Solo puedes asignar en sucursales donde eres propietario");
        return;
      }
      ve.mutate(
        { user_id: va, branch_id: Be, role: xa, is_active: !0 },
        {
          onSuccess: () => {
            (m.success("Usuario asignado a la sucursal"), ea(), ae(String(Be)));
          },
          onError: (l) =>
            m.error(l.friendlyMessage || "No se pudo asignar (revisa permisos / rol)"),
        },
      );
    },
    ls =
      Oe === "assign"
        ? "Definí sucursal y rol del usuario."
        : te
          ? "Datos de la cuenta y asignaciones."
          : "Crea la cuenta y asígnala a una sucursal.";
  (t.useEffect(() => {
    !i.get("view") && Se && (Ye(!1), za(null), ue(!1));
  }, [i, Se]),
    t.useEffect(() => {
      if (je || Se) return;
      const l = i.get("view");
      if (l) {
        if (l === "nuevo") {
          if (!S) return;
          Ra();
          return;
        }
        if (l === "asignar") {
          if (!S) return;
          Ba();
          return;
        }
        if (l === "editar") {
          const u = i.get("id");
          if (!u) return;
          const w = sa.find((M) => String(M.id) === u);
          w && $(w);
        }
      }
    }, [i, je, sa, Se, S]));
  const cs = As();
  return e.jsx(ks, {
    mode: "wait",
    children: je
      ? e.jsx(
          xs.div,
          {
            initial: cs ? !1 : { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
            className: "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto",
            children: e.jsx(on, { variant: "tableFilters" }),
          },
          "skeleton",
        )
      : e.jsxs(
          rn,
          {
            className: Se ? "pt-3 pb-6 space-y-4" : void 0,
            children: [
              Q &&
                e.jsx(Fe, {
                  children: e.jsx(tn, {
                    message: "No se pudieron cargar los usuarios.",
                    onRetry: Sa,
                  }),
                }),
              !Se &&
                e.jsxs(e.Fragment, {
                  children: [
                    e.jsxs(Fe, {
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-wrap items-end gap-3",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1.5",
                              children: [
                                e.jsx(g, {
                                  className: "text-xs text-muted-foreground",
                                  children: "Buscar",
                                }),
                                e.jsx(f, {
                                  value: ce,
                                  onChange: (l) => se(l.target.value),
                                  placeholder: "Email, nombre…",
                                  className: "w-[200px]",
                                }),
                              ],
                            }),
                            Z &&
                              e.jsxs("div", {
                                className: "space-y-1.5",
                                children: [
                                  e.jsx(g, {
                                    className: "text-xs text-muted-foreground",
                                    children: "Sucursal",
                                  }),
                                  e.jsx(xr, {
                                    value: B,
                                    onValueChange: (l) => t.startTransition(() => ae(l)),
                                    options: xe.map((l) => ({ id: l.id, label: l.label })),
                                    label: null,
                                  }),
                                ],
                              }),
                            p &&
                              H.length > 0 &&
                              e.jsxs("div", {
                                className: "space-y-1.5",
                                children: [
                                  e.jsx(g, {
                                    className: "text-xs text-muted-foreground",
                                    children: "Organización",
                                  }),
                                  e.jsxs(He, {
                                    value: D,
                                    onValueChange: (l) => t.startTransition(() => z(l)),
                                    children: [
                                      e.jsx(Qe, {
                                        className: "w-[200px]",
                                        children: e.jsx(Je, { placeholder: "Todas" }),
                                      }),
                                      e.jsxs(Ke, {
                                        children: [
                                          e.jsx(de, { value: Ya, children: "Todas" }),
                                          H.map((l) =>
                                            e.jsx(
                                              de,
                                              {
                                                value: String(l.id),
                                                children: l.name || l.business_name,
                                              },
                                              String(l.id),
                                            ),
                                          ),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            !S &&
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground pb-2 self-end",
                                children: "Solo lectura — el propietario puede crear y editar.",
                              }),
                          ],
                        }),
                        e.jsx(ln, {
                          className: "mb-0 mt-3",
                          countLabel: `${Ae.length} usuario${Ae.length === 1 ? "" : "s"}${Ae.length > ws ? ` · pág. ${_e}/${la}` : ""}`,
                          actions: [
                            {
                              label: "Actualizar",
                              icon: $a,
                              onClick: Sa,
                              disabled: Me || Ue,
                              spinning: Me || Ue,
                            },
                            ...(S
                              ? [
                                  { label: "Asignar a sucursal", icon: sr, onClick: Ba },
                                  { label: "Nuevo", icon: De, onClick: Ra, variant: "default" },
                                ]
                              : []),
                          ],
                        }),
                      ],
                    }),
                    e.jsx(Fe, {
                      children: e.jsxs("div", {
                        className: "min-w-0 space-y-3",
                        children: [
                          e.jsx("div", {
                            className: K(
                              "rounded-lg border border-border overflow-hidden transition-opacity duration-150",
                              aa && "opacity-70",
                            ),
                            children: e.jsxs(cn, {
                              children: [
                                e.jsx(dn, {
                                  children: e.jsxs(Ea, {
                                    children: [
                                      e.jsx(we, { children: "Usuario" }),
                                      e.jsx(we, {
                                        className: "hidden md:table-cell",
                                        children: "RUT",
                                      }),
                                      e.jsx(we, { children: "Sucursales" }),
                                      e.jsx(we, { children: "Estado" }),
                                      e.jsx(we, {
                                        className: "text-right w-[140px]",
                                        children: "Acciones",
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx(un, {
                                  className: "[&_tr:last-child]:border-0",
                                  children:
                                    ca.length === 0
                                      ? e.jsx(Ea, {
                                          className: "border-b transition-colors",
                                          children: e.jsx(Le, {
                                            colSpan: 5,
                                            className: "p-4",
                                            children: e.jsx(Cs, {
                                              title: "Sin usuarios",
                                              description: "No hay usuarios con esos filtros.",
                                              action: S
                                                ? e.jsxs(N, {
                                                    size: "sm",
                                                    onClick: Ra,
                                                    children: [
                                                      e.jsx(De, { className: "h-4 w-4 mr-1.5" }),
                                                      "Nuevo",
                                                    ],
                                                  })
                                                : void 0,
                                            }),
                                          }),
                                        })
                                      : ca.map((l) => {
                                          const u = G.get(String(l.id)) ?? [],
                                            w = Ie(l),
                                            M = w.length > 0;
                                          return e.jsxs(
                                            Ea,
                                            {
                                              className:
                                                "border-b transition-colors hover:bg-muted/50",
                                              children: [
                                                e.jsx(Le, {
                                                  children: e.jsxs("div", {
                                                    className: "min-w-0 space-y-0.5",
                                                    children: [
                                                      e.jsxs("div", {
                                                        className:
                                                          "flex items-center gap-1.5 flex-wrap",
                                                        children: [
                                                          e.jsx("span", {
                                                            className: "font-medium truncate",
                                                            children: an(l),
                                                          }),
                                                          l.is_superuser &&
                                                            e.jsx(da, {
                                                              variant: "secondary",
                                                              className: "text-[10px]",
                                                              children: "Root",
                                                            }),
                                                          M &&
                                                            e.jsx(da, {
                                                              variant: "secondary",
                                                              className:
                                                                "text-[10px] bg-teal-500/15 text-teal-400 border-teal-500/30",
                                                              title: w
                                                                .map((h) => h.name)
                                                                .join(", "),
                                                              children: "Organizador",
                                                            }),
                                                          l.is_multi_branch &&
                                                            e.jsx(da, {
                                                              variant: "outline",
                                                              className: "text-[10px]",
                                                              children: "Multi",
                                                            }),
                                                        ],
                                                      }),
                                                      e.jsx("button", {
                                                        type: "button",
                                                        className:
                                                          "block max-w-full text-left text-xs text-muted-foreground truncate hover:text-primary hover:underline underline-offset-2",
                                                        title: "Clic para copiar",
                                                        onClick: () => Ga(l.email || ""),
                                                        children: l.email,
                                                      }),
                                                    ],
                                                  }),
                                                }),
                                                e.jsx(Le, {
                                                  className:
                                                    "hidden md:table-cell text-xs text-muted-foreground font-mono",
                                                  children: l.dni || "—",
                                                }),
                                                e.jsx(Le, {
                                                  children:
                                                    u.length === 0
                                                      ? e.jsx("span", {
                                                          className:
                                                            "text-xs text-muted-foreground",
                                                          children: l.is_superuser
                                                            ? "Global"
                                                            : M
                                                              ? w.map((h) => h.name).join(", ") ||
                                                                "Organizador"
                                                              : "Sin asignación",
                                                        })
                                                      : e.jsx("div", {
                                                          className:
                                                            "flex flex-wrap gap-1 max-w-[280px]",
                                                          children: u.map((h) => {
                                                            const k = `${h.branch_name || qa.get(String(h.branch))?.label || h.branch}${h.role_code ? ` · ${_n(h.role_code)}` : h.role_name ? ` · ${h.role_name}` : ""}`;
                                                            return S && ys(h.branch)
                                                              ? e.jsx(
                                                                  "button",
                                                                  {
                                                                    type: "button",
                                                                    title: "Quitar acceso",
                                                                    onClick: () => es(h.id, k),
                                                                    className:
                                                                      "text-[11px] text-muted-foreground border border-border/80 rounded px-1.5 py-0.5 hover:border-destructive/50 hover:text-destructive transition-colors",
                                                                    children: k,
                                                                  },
                                                                  String(h.id),
                                                                )
                                                              : e.jsx(
                                                                  "span",
                                                                  {
                                                                    className:
                                                                      "text-[11px] text-muted-foreground border border-border/80 rounded px-1.5 py-0.5",
                                                                    children: k,
                                                                  },
                                                                  String(h.id),
                                                                );
                                                          }),
                                                        }),
                                                }),
                                                e.jsx(Le, {
                                                  children: S
                                                    ? e.jsx("button", {
                                                        type: "button",
                                                        title: "Cambiar estado (toggle API)",
                                                        disabled: Te === String(l.id),
                                                        onClick: () => is(l),
                                                        className: "disabled:opacity-50",
                                                        children: e.jsx(da, {
                                                          variant:
                                                            l.is_active !== !1
                                                              ? "default"
                                                              : "outline",
                                                          className: "text-[10px] cursor-pointer",
                                                          children:
                                                            Te === String(l.id)
                                                              ? "…"
                                                              : l.is_active !== !1
                                                                ? "Activo"
                                                                : "Inactivo",
                                                        }),
                                                      })
                                                    : e.jsx(da, {
                                                        variant:
                                                          l.is_active !== !1
                                                            ? "default"
                                                            : "outline",
                                                        className: "text-[10px]",
                                                        children:
                                                          l.is_active !== !1
                                                            ? "Activo"
                                                            : "Inactivo",
                                                      }),
                                                }),
                                                e.jsx(Le, {
                                                  className: "text-right",
                                                  children: S
                                                    ? e.jsxs("div", {
                                                        className: "inline-flex gap-0.5",
                                                        children: [
                                                          e.jsx(N, {
                                                            size: "icon",
                                                            variant: "ghost",
                                                            className: "h-8 w-8",
                                                            title: "Reiniciar contraseña",
                                                            disabled: ge === String(l.id),
                                                            onClick: () => ta(l),
                                                            children:
                                                              ge === String(l.id)
                                                                ? e.jsx(fa, {
                                                                    className:
                                                                      "h-3.5 w-3.5 animate-spin",
                                                                  })
                                                                : e.jsx(xi, {
                                                                    className: "h-3.5 w-3.5",
                                                                  }),
                                                          }),
                                                          e.jsx(N, {
                                                            size: "icon",
                                                            variant: "ghost",
                                                            className: "h-8 w-8",
                                                            title: "Editar",
                                                            onClick: () => $(l),
                                                            children: e.jsx(hr, {
                                                              className: "h-3.5 w-3.5",
                                                            }),
                                                          }),
                                                          e.jsx(N, {
                                                            size: "icon",
                                                            variant: "ghost",
                                                            className: "h-8 w-8 text-destructive",
                                                            title: "Desactivar",
                                                            disabled: ye === String(l.id),
                                                            onClick: () => Ka(l),
                                                            children:
                                                              ye === String(l.id)
                                                                ? e.jsx(fa, {
                                                                    className:
                                                                      "h-3.5 w-3.5 animate-spin",
                                                                  })
                                                                : e.jsx(Za, {
                                                                    className: "h-3.5 w-3.5",
                                                                  }),
                                                          }),
                                                        ],
                                                      })
                                                    : e.jsx("span", {
                                                        className:
                                                          "text-[11px] text-muted-foreground",
                                                        children: "—",
                                                      }),
                                                }),
                                              ],
                                            },
                                            String(l.id),
                                          );
                                        }),
                                }),
                              ],
                            }),
                          }),
                          Ae.length > 0 &&
                            e.jsxs("div", {
                              className: "mt-3 flex flex-wrap items-center justify-between gap-3",
                              children: [
                                e.jsxs("p", {
                                  className: "text-xs text-muted-foreground tabular-nums",
                                  children: [Ta, "–", Va, " de ", Ae.length],
                                }),
                                e.jsxs("div", {
                                  className: "flex items-center gap-1",
                                  children: [
                                    e.jsxs(N, {
                                      type: "button",
                                      variant: "outline",
                                      size: "sm",
                                      className: "h-8 gap-1",
                                      disabled: _e <= 1,
                                      onClick: () => I((l) => Math.max(1, l - 1)),
                                      children: [e.jsx(jr, { className: "h-4 w-4" }), "Anterior"],
                                    }),
                                    e.jsxs("span", {
                                      className: "px-2 text-xs text-muted-foreground tabular-nums",
                                      children: [_e, " / ", la],
                                    }),
                                    e.jsxs(N, {
                                      type: "button",
                                      variant: "outline",
                                      size: "sm",
                                      className: "h-8 gap-1",
                                      disabled: _e >= la,
                                      onClick: () => I((l) => Math.min(la, l + 1)),
                                      children: ["Siguiente", e.jsx(hi, { className: "h-4 w-4" })],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                    }),
                  ],
                }),
              Se &&
                e.jsx(Fe, {
                  children: e.jsx(Br, {
                    onBack: ea,
                    hint: ls,
                    footer: e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(N, {
                          type: "button",
                          variant: "outline",
                          onClick: ea,
                          children: "Cancelar",
                        }),
                        Oe === "assign"
                          ? e.jsx(N, {
                              onClick: Wa,
                              disabled: ve.isPending,
                              children: ve.isPending
                                ? e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(fa, { className: "h-4 w-4 animate-spin mr-2" }),
                                      " Asignando…",
                                    ],
                                  })
                                : "Asignar",
                            })
                          : e.jsxs(N, {
                              onClick: os,
                              disabled:
                                me.isPending ||
                                O.isPending ||
                                c.isPending ||
                                ve.isPending ||
                                re.isPending,
                              children: [
                                me.isPending ||
                                O.isPending ||
                                c.isPending ||
                                ve.isPending ||
                                re.isPending
                                  ? e.jsx(fa, { className: "h-4 w-4 animate-spin mr-2" })
                                  : null,
                                "Guardar",
                              ],
                            }),
                      ],
                    }),
                    className: "max-w-2xl",
                    children: e.jsx("div", {
                      className: "space-y-4",
                      children:
                        Oe === "assign"
                          ? e.jsxs(e.Fragment, {
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx(g, { children: "Usuario" }),
                                    e.jsxs(He, {
                                      value: va,
                                      onValueChange: pa,
                                      children: [
                                        e.jsx(Qe, {
                                          children: e.jsx(Je, {
                                            placeholder: "ej. juan.perez@empresa.cl",
                                          }),
                                        }),
                                        e.jsx(Ke, {
                                          children: sa.map((l) =>
                                            e.jsx(
                                              de,
                                              { value: String(l.id), children: l.email },
                                              String(l.id),
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx(g, { children: "Sucursal" }),
                                    e.jsxs(He, {
                                      value: Be,
                                      onValueChange: (l) => {
                                        (ga(l), La(""));
                                      },
                                      children: [
                                        e.jsx(Qe, {
                                          children: e.jsx(Je, { placeholder: "Selecciona" }),
                                        }),
                                        e.jsx(Ke, {
                                          children: he.map((l) =>
                                            e.jsxs(
                                              de,
                                              {
                                                value: l.id,
                                                children: [
                                                  l.label,
                                                  l.orgName ? ` · ${l.orgName}` : "",
                                                ],
                                              },
                                              l.id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx(g, { children: "Rol" }),
                                    e.jsxs(He, {
                                      value: xa,
                                      onValueChange: La,
                                      disabled: !Be,
                                      children: [
                                        e.jsx(Qe, {
                                          children: e.jsx(Je, {
                                            placeholder: Be ? "Selecciona rol" : "Primero sucursal",
                                          }),
                                        }),
                                        e.jsx(Ke, {
                                          children:
                                            ya && Be
                                              ? e.jsx("div", {
                                                  className:
                                                    "px-2 py-1.5 text-xs text-muted-foreground",
                                                  children: "Cargando roles…",
                                                })
                                              : Ma.map((l) => {
                                                  const u = l.code || l.value || String(l.id);
                                                  return e.jsx(
                                                    de,
                                                    { value: u, children: _n(u) },
                                                    u,
                                                  );
                                                }),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : e.jsxs(e.Fragment, {
                              children: [
                                e.jsxs("div", {
                                  className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Email" }),
                                        e.jsx(f, {
                                          value: Xe,
                                          onChange: (l) => Ze(l.target.value),
                                          type: "email",
                                          placeholder: "juan.perez@empresa.cl",
                                          autoComplete: "email",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Username" }),
                                        e.jsx(f, {
                                          value: te
                                            ? te.username || `${ur(te.email || Xe)}${te.id}`
                                            : Xe.trim()
                                              ? `${ur(Xe)}…`
                                              : "",
                                          readOnly: !0,
                                          disabled: !0,
                                          className: "font-mono text-sm bg-muted/40",
                                          placeholder: "ej. juanperez42 (auto)",
                                        }),
                                        e.jsx("p", {
                                          className: "text-[11px] text-muted-foreground mt-1",
                                          children: "Automático: parte del correo limpia + ID.",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Nombre" }),
                                        e.jsx(f, {
                                          value: E,
                                          onChange: (l) => ka(l.target.value),
                                          placeholder: "Juan",
                                          autoComplete: "given-name",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "Apellido" }),
                                        e.jsx(f, {
                                          value: Ia,
                                          onChange: (l) => qe(l.target.value),
                                          placeholder: "Pérez",
                                          autoComplete: "family-name",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: K(
                                    "grid grid-cols-1 items-start gap-4",
                                    te ? void 0 : "sm:grid-cols-2",
                                  ),
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx(g, { children: "RUT / DNI" }),
                                        e.jsx(f, {
                                          value: ua,
                                          onChange: (l) => Re(l.target.value),
                                          placeholder: "12.345.678-9",
                                          className: "mt-1 font-mono",
                                        }),
                                        te
                                          ? null
                                          : e.jsx("p", {
                                              className:
                                                "mt-1 text-[11px] text-transparent select-none",
                                              "aria-hidden": !0,
                                              children: "—",
                                            }),
                                      ],
                                    }),
                                    !te &&
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx(g, { children: "Password" }),
                                          e.jsxs("div", {
                                            className: "mt-1 flex gap-2",
                                            children: [
                                              e.jsx(f, {
                                                type: ba ? "text" : "password",
                                                value: Ee,
                                                onChange: (l) => Ne(l.target.value),
                                                autoComplete: "new-password",
                                                className: "font-mono text-sm",
                                                placeholder: "Ej. K9m!pQ2xYz4nRw",
                                              }),
                                              e.jsx(N, {
                                                type: "button",
                                                size: "icon",
                                                variant: "outline",
                                                title: "Generar",
                                                onClick: () => {
                                                  (Ne(nr()), Ce(!0));
                                                },
                                                children: e.jsx($a, { className: "h-4 w-4" }),
                                              }),
                                              e.jsx(N, {
                                                type: "button",
                                                size: "icon",
                                                variant: "outline",
                                                title: "Copiar",
                                                disabled: !Ee,
                                                onClick: () => Fa(Ee),
                                                children: e.jsx(kn, { className: "h-4 w-4" }),
                                              }),
                                            ],
                                          }),
                                          e.jsx("p", {
                                            className: "mt-1 text-[11px] text-muted-foreground",
                                            children:
                                              "14 caracteres: mayúsculas, minúsculas, números y símbolo.",
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                e.jsx("p", {
                                  className: "text-[11px] text-muted-foreground mb-1",
                                  children:
                                    "Opcional para superadmin — dejar vacío crea un usuario organizador sin sucursal.",
                                }),
                                e.jsxs("div", {
                                  className: "space-y-3",
                                  children: [
                                    ie &&
                                      e.jsx("div", {
                                        className: "flex justify-end",
                                        children: e.jsxs(N, {
                                          type: "button",
                                          variant: "outline",
                                          size: "sm",
                                          className: "h-7 text-xs",
                                          onClick: Y,
                                          disabled: he.length === 0,
                                          children: [
                                            e.jsx(De, { className: "h-3.5 w-3.5 mr-1" }),
                                            "Agregar sucursal",
                                          ],
                                        }),
                                      }),
                                    (ie ? oe : oe.slice(0, 1)).map((l, u) => {
                                      const w = new Set(
                                          oe
                                            .filter((h) => h.key !== l.key && h.branchId)
                                            .map((h) => h.branchId),
                                        ),
                                        M = he.filter((h) => !w.has(h.id) || h.id === l.branchId);
                                      return e.jsxs(
                                        "div",
                                        {
                                          className: "space-y-2",
                                          children: [
                                            e.jsxs("div", {
                                              className:
                                                "grid grid-cols-1 items-start gap-4 sm:grid-cols-2",
                                              children: [
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsx(g, {
                                                      className: "inline-flex h-5 items-center",
                                                      children: "Sucursal",
                                                    }),
                                                    e.jsxs(He, {
                                                      value: l.branchId || void 0,
                                                      onValueChange: (h) => {
                                                        (Qa(l.key, { branchId: h, roleCode: "" }),
                                                          ie || (ne(h), ma("")));
                                                      },
                                                      children: [
                                                        e.jsx(Qe, {
                                                          className: "mt-1",
                                                          children: e.jsx(Je, {
                                                            placeholder:
                                                              he.length === 0
                                                                ? "Sin sucursales disponibles"
                                                                : "ej. Smart Hydro",
                                                          }),
                                                        }),
                                                        e.jsx(Ke, {
                                                          children: M.map((h) =>
                                                            e.jsxs(
                                                              de,
                                                              {
                                                                value: h.id,
                                                                children: [
                                                                  h.label,
                                                                  h.orgName
                                                                    ? ` · ${h.orgName}`
                                                                    : "",
                                                                ],
                                                              },
                                                              h.id,
                                                            ),
                                                          ),
                                                        }),
                                                      ],
                                                    }),
                                                    !!te &&
                                                      !ie &&
                                                      !!l.assignmentId &&
                                                      e.jsx("p", {
                                                        className:
                                                          "mt-1 text-[10px] text-muted-foreground",
                                                        children:
                                                          "Si cambiás de sucursal, se mueve la asignación actual.",
                                                      }),
                                                  ],
                                                }),
                                                e.jsxs("div", {
                                                  children: [
                                                    e.jsxs("div", {
                                                      className:
                                                        "flex h-5 items-center justify-between gap-2",
                                                      children: [
                                                        e.jsx(g, { children: "Rol" }),
                                                        ie && oe.length > 1
                                                          ? e.jsx(N, {
                                                              type: "button",
                                                              variant: "ghost",
                                                              size: "sm",
                                                              className:
                                                                "h-5 px-1.5 text-[11px] text-destructive hover:text-destructive",
                                                              onClick: () => Ja(l.key),
                                                              children: "Quitar",
                                                            })
                                                          : null,
                                                      ],
                                                    }),
                                                    e.jsxs(He, {
                                                      value: l.roleCode || void 0,
                                                      onValueChange: (h) => {
                                                        (Qa(l.key, { roleCode: h }), ie || ma(h));
                                                      },
                                                      disabled: !l.branchId,
                                                      children: [
                                                        e.jsx(Qe, {
                                                          className: "mt-1",
                                                          children: e.jsx(Je, {
                                                            placeholder: l.branchId
                                                              ? "ej. Empleado"
                                                              : "Primero sucursal",
                                                          }),
                                                        }),
                                                        e.jsx(Ke, {
                                                          children:
                                                            ya && l.branchId === oa
                                                              ? e.jsx("div", {
                                                                  className:
                                                                    "px-2 py-1.5 text-xs text-muted-foreground",
                                                                  children: "Cargando roles…",
                                                                })
                                                              : Ma.map((h) => {
                                                                  const k =
                                                                    h.code ||
                                                                    h.value ||
                                                                    String(h.id);
                                                                  return e.jsx(
                                                                    de,
                                                                    { value: k, children: _n(k) },
                                                                    k,
                                                                  );
                                                                }),
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            u === 0 &&
                                              e.jsxs("label", {
                                                className:
                                                  "inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none sm:max-w-[calc(50%-0.5rem)]",
                                                children: [
                                                  e.jsx("input", {
                                                    type: "checkbox",
                                                    className: "rounded border-border",
                                                    checked: ie,
                                                    onChange: (h) => {
                                                      const k = h.target.checked;
                                                      (ze(k),
                                                        k
                                                          ? oe.length === 0 &&
                                                            le([
                                                              {
                                                                key: ms(),
                                                                assignmentId: null,
                                                                branchId: "",
                                                                roleCode: "",
                                                              },
                                                            ])
                                                          : le((Ge) => {
                                                              const ha = Ge.find(
                                                                (Ha) => Ha.assignmentId,
                                                              ) ??
                                                                Ge[0] ?? {
                                                                  key: ms(),
                                                                  assignmentId: null,
                                                                  branchId: "",
                                                                  roleCode: "",
                                                                };
                                                              return [
                                                                { ...ha, key: ha.key || ms() },
                                                              ];
                                                            }));
                                                    },
                                                  }),
                                                  "Multi sucursal",
                                                ],
                                              }),
                                          ],
                                        },
                                        l.key,
                                      );
                                    }),
                                    he.length === 0 &&
                                      e.jsx("p", {
                                        className: "text-[11px] text-destructive",
                                        children:
                                          "No hay sucursales disponibles para asignar. Si sos organizador, verificá que el holding tenga stores activas.",
                                      }),
                                    !ie &&
                                      te &&
                                      !Oa?.assignmentId &&
                                      e.jsx("p", {
                                        className: "text-[11px] text-muted-foreground",
                                        children:
                                          "Este usuario no tiene sucursal: elige una y un rol para asignarlo.",
                                      }),
                                  ],
                                }),
                              ],
                            }),
                    }),
                  }),
                }),
              e.jsx(Fs, {
                open: n,
                onOpenChange: (l) => {
                  (j(l), l || L(null));
                },
                children: e.jsxs(Ds, {
                  children: [
                    e.jsx($s, { children: e.jsx(Us, { children: "Contraseña generada" }) }),
                    e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsxs("p", {
                          className: "text-sm text-muted-foreground",
                          children: [
                            x?.message || "Contraseña generada y asignada exitosamente",
                            ". Solo se muestra una vez — guárdala ahora.",
                          ],
                        }),
                        x?.username &&
                          e.jsxs("div", {
                            children: [
                              e.jsx(g, {
                                className: "text-xs text-muted-foreground",
                                children: "Usuario",
                              }),
                              e.jsx("p", {
                                className: "text-sm font-medium",
                                children: x.username,
                              }),
                            ],
                          }),
                        e.jsxs("div", {
                          children: [
                            e.jsx(g, {
                              className: "text-xs text-muted-foreground",
                              children: "Nueva contraseña",
                            }),
                            e.jsxs("div", {
                              className: "flex gap-2 mt-1",
                              children: [
                                e.jsx(f, {
                                  value: x?.new_password || "",
                                  readOnly: !0,
                                  className: "font-mono text-sm",
                                }),
                                e.jsx(N, {
                                  type: "button",
                                  size: "icon",
                                  variant: "outline",
                                  disabled: !x?.new_password,
                                  onClick: () => Fa(x?.new_password || ""),
                                  children: e.jsx(kn, { className: "h-4 w-4" }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        x?.password_info &&
                          e.jsx("p", {
                            className: "text-[11px] text-muted-foreground",
                            children: x.password_info,
                          }),
                        x?.generated_at &&
                          e.jsxs("p", {
                            className: "text-[11px] text-muted-foreground tabular-nums",
                            children: ["Generada: ", x.generated_at],
                          }),
                        e.jsx(N, {
                          className: "w-full",
                          onClick: () => j(!1),
                          children: "Entendido",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsx(Fn, {
                open: !!J,
                onOpenChange: (l) => !l && R(null),
                children: e.jsxs(Dn, {
                  children: [
                    e.jsxs($n, {
                      children: [
                        e.jsx(Un, {
                          children:
                            J?.type === "delete"
                              ? "Desactivar usuario"
                              : J?.type === "toggle"
                                ? J.user.is_active === !1
                                  ? "Activar usuario"
                                  : "Desactivar usuario"
                                : J?.type === "regenPassword"
                                  ? "Regenerar contraseña"
                                  : "Quitar acceso",
                        }),
                        e.jsx(qn, {
                          children:
                            J?.type === "delete"
                              ? `¿Desactivar a ${an(J.user)}? Quedará inactivo; no se borra de la base.`
                              : J?.type === "toggle"
                                ? `¿${J.user.is_active === !1 ? "Activar" : "Desactivar"} a ${an(J.user)}?`
                                : J?.type === "regenPassword"
                                  ? `Se generará una contraseña segura de 14 caracteres para ${an(J.user)} y se asignará de inmediato. La anterior dejará de funcionar.`
                                  : J?.type === "unassign"
                                    ? `¿Quitar acceso a ${J.label}?`
                                    : null,
                        }),
                      ],
                    }),
                    e.jsxs(Vn, {
                      children: [
                        e.jsx(Gn, { children: "Cancelar" }),
                        e.jsx(Hn, { onClick: as, children: "Confirmar" }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsx(Qn, {
                open: wa,
                onOpenChange: ue,
                visible: !Se,
                actions: [
                  {
                    label: "Actualizar",
                    icon: $a,
                    onClick: Sa,
                    disabled: Me || Ue,
                    spinning: Me || Ue,
                  },
                  ...(S
                    ? [
                        { label: "Asignar a sucursal", icon: sr, onClick: Ba },
                        { label: "Nuevo", icon: De, onClick: Ra },
                      ]
                    : []),
                ],
              }),
            ],
          },
          "content",
        ),
  });
}
const po = Object.freeze(
  Object.defineProperty({ __proto__: null, default: ro }, Symbol.toStringTag, { value: "Module" }),
);
export {
  zs as M,
  ji as T,
  bi as a,
  vi as b,
  Mr as c,
  An as d,
  co as e,
  uo as f,
  mo as g,
  po as h,
  wi as r,
  Or as u,
};
