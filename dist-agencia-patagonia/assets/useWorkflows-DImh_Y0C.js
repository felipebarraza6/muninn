import { u as v, a as f, b as d } from "./vendor-query-IAyuTf1L.js";
import { P as h, E as i, a as F, D as Q, bK as S, cX as E } from "./studio-chat-BBQUCckT.js";
function _(e) {
  const t = String(e || "").toLowerCase();
  return (
    t.includes("run") ||
    t.includes("pend") ||
    t === "started" ||
    t === "queued" ||
    t === "in_progress" ||
    t === "processing"
  );
}
function T(e) {
  const t = String(e || "").toLowerCase();
  return t
    ? t.includes("fail") || t.includes("error")
      ? "failed"
      : t.includes("skip")
        ? "skipped"
        : t.includes("run") || t.includes("progress") || t === "started" || t === "active"
          ? "running"
          : t.includes("success") ||
              t.includes("complet") ||
              t === "done" ||
              t === "ok" ||
              t === "finished"
            ? "success"
            : t.includes("pend") || t.includes("wait") || t.includes("queued")
              ? "pending"
              : "idle"
    : "idle";
}
function K(e, t, o, q) {
  const k = t === "from" ? e.from_node : e.to_node;
  if (k != null && String(k).trim() !== "") return String(k);
  const w = t === "from" ? e.from_node_key : e.to_node_key;
  if (!w) return "";
  if (q) return q.get(w) || "";
  const a = o.find((y) => y.node_key === w);
  return a ? String(a.id) : "";
}
function M(e, t) {
  const o = e.map((s) => String(s.id)),
    q = new Set(o),
    k = new Map(e.map((s) => [s.node_key, String(s.id)])),
    w = new Map(),
    a = new Map();
  for (const s of o) (w.set(s, []), a.set(s, 0));
  for (const s of t) {
    const c = K(s, "from", e, k),
      n = K(s, "to", e, k);
    !c ||
      !n ||
      !q.has(c) ||
      !q.has(n) ||
      c === n ||
      (w.get(c).push(n), a.set(n, (a.get(n) || 0) + 1));
  }
  const y = [],
    p = o.filter((s) => (a.get(s) || 0) === 0);
  let m = 0;
  const l = new Set();
  for (; m < p.length; ) {
    const s = p[m++];
    if (!l.has(s)) {
      (l.add(s), y.push(s));
      for (const c of w.get(s) || [])
        (a.set(c, (a.get(c) || 0) - 1), (a.get(c) || 0) <= 0 && !l.has(c) && p.push(c));
    }
  }
  for (const s of o) l.has(s) || y.push(s);
  return y;
}
function b(e, t) {
  const o = e.map((n) => String(n.id)),
    q = new Set(o),
    k = new Map(e.map((n) => [n.node_key, String(n.id)])),
    w = new Map(e.map((n) => [String(n.id), n.node_type])),
    a = new Map(),
    y = new Map();
  for (const n of o) (a.set(n, []), y.set(n, 0));
  for (const n of t) {
    const g = K(n, "from", e, k),
      u = K(n, "to", e, k);
    !g ||
      !u ||
      !q.has(g) ||
      !q.has(u) ||
      g === u ||
      (a.get(g).push(u), y.set(u, (y.get(u) || 0) + 1));
  }
  const p = [],
    m = new Map(y);
  let l = o.filter((n) => (m.get(n) || 0) === 0);
  l.sort((n, g) => {
    const u = w.get(n) === "trigger" ? 0 : 1,
      W = w.get(g) === "trigger" ? 0 : 1;
    return u - W;
  });
  const s = new Set();
  for (; l.length > 0; ) {
    p.push([...l]);
    for (const g of l) s.add(g);
    const n = [];
    for (const g of l)
      for (const u of a.get(g) || [])
        s.has(u) ||
          (m.set(u, (m.get(u) || 0) - 1), (m.get(u) || 0) <= 0 && !n.includes(u) && n.push(u));
    l = n;
  }
  const c = o.filter((n) => !s.has(n));
  return (c.length && p.push(c), p.length ? p : [o]);
}
const r = "workflows";
function C() {
  return v({ queryKey: [r], queryFn: () => S(i.workflows.list).then((e) => E(e)) });
}
function D(e) {
  return v({
    queryKey: [r, e],
    queryFn: () => S(i.workflows.detail(e)),
    enabled: !!e,
    staleTime: 3e4,
  });
}
function L() {
  const e = f();
  return d({
    mutationFn: (t) => h(i.workflows.list, t),
    onSuccess: () => e.invalidateQueries({ queryKey: [r] }),
  });
}
function I() {
  const e = f();
  return d({
    mutationFn: ({ id: t, ...o }) => F(i.workflows.detail(t), o),
    onSuccess: (t) => {
      (e.invalidateQueries({ queryKey: [r, t.id] }), e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function P() {
  const e = f();
  return d({
    mutationFn: (t) => Q(i.workflows.detail(t)),
    onSuccess: () => e.invalidateQueries({ queryKey: [r] }),
  });
}
function O() {
  return v({
    queryKey: [r, "trigger-types"],
    queryFn: () => S(i.workflows.triggerTypes).then((e) => E(e)),
    staleTime: 600 * 1e3,
  });
}
function z() {
  const e = f();
  return d({
    mutationFn: ({ id: t, context: o }) => h(i.workflows.execute(t), { context: o ?? {} }),
    onSuccess: () => {
      (e.invalidateQueries({ queryKey: [r] }),
        e.invalidateQueries({ queryKey: ["workflow-executions"] }));
    },
  });
}
function A() {
  const e = f();
  return d({
    mutationFn: (t) => h(i.workflows.activate(t)),
    onSuccess: () => e.invalidateQueries({ queryKey: [r] }),
  });
}
function B() {
  const e = f();
  return d({
    mutationFn: (t) => h(i.workflows.deactivate(t)),
    onSuccess: () => e.invalidateQueries({ queryKey: [r] }),
  });
}
function R() {
  const e = f();
  return d({
    mutationFn: (t) => h(i.workflowNodes.list, t),
    onSuccess: (t, o) => {
      (e.invalidateQueries({ queryKey: [r, o.workflow] }), e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function U() {
  const e = f();
  return d({
    mutationFn: ({ id: t, ...o }) => F(i.workflowNodes.detail(t), o),
    onSuccess: (t) => {
      (t.workflow && e.invalidateQueries({ queryKey: [r, t.workflow] }),
        e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function j() {
  const e = f();
  return d({
    mutationFn: ({ id: t }) => Q(i.workflowNodes.detail(t)),
    onSuccess: (t, o) => {
      (e.invalidateQueries({ queryKey: [r, o.workflow] }), e.invalidateQueries({ queryKey: [r] }));
    },
    onError: (t, o) => {
      (e.invalidateQueries({ queryKey: [r, o.workflow] }), e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function G() {
  const e = f();
  return d({
    mutationFn: (t) => h(i.workflowEdges.list, t),
    onSuccess: (t, o) => {
      (e.invalidateQueries({ queryKey: [r, o.workflow] }), e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function H() {
  const e = f();
  return d({
    mutationFn: ({ id: t }) => Q(i.workflowEdges.detail(t)),
    onSuccess: (t, o) => {
      (e.invalidateQueries({ queryKey: [r, o.workflow] }), e.invalidateQueries({ queryKey: [r] }));
    },
  });
}
function X(e) {
  return v({
    queryKey: ["workflow-executions", e],
    queryFn: () =>
      S(i.workflowExecutions.list, { params: e ? { workflow: e } : void 0 }).then((t) => E(t)),
    enabled: !!e,
  });
}
function Y(e) {
  return v({
    queryKey: ["workflow-executions", "detail", e],
    queryFn: () => S(i.workflowExecutions.detail(e)),
    enabled: !!e,
    refetchInterval: (t) => (_(t.state.data?.status) ? 2500 : !1),
    refetchIntervalInBackground: !1,
  });
}
export {
  C as a,
  L as b,
  R as c,
  G as d,
  z as e,
  O as f,
  D as g,
  I as h,
  A as i,
  B as j,
  P as k,
  b as l,
  X as m,
  T as n,
  M as o,
  U as p,
  H as q,
  K as r,
  j as s,
  _ as t,
  Y as u,
};
