import { u as c, a as r, b as u, k as d } from "./vendor-query-IAyuTf1L.js";
import {
  cq as y,
  a as m,
  D as C,
  P as i,
  E as t,
  bK as l,
  cX as q,
} from "./studio-chat-Bi-RYdat.js";
const s = ["ai-agents", "channels"];
function p(e) {
  const n = y();
  return c({
    queryKey: [...s, n ?? "all", e],
    queryFn: () =>
      l(t.channels.list, {
        params: { ...e, include_inactive: "true", ...(n ? { branch: n } : {}) },
      }).then((a) => q(a)),
    staleTime: 120 * 1e3,
    placeholderData: d,
  });
}
function v(e) {
  const n = y();
  return c({
    queryKey: [...s, n, e],
    queryFn: () => l(t.channels.detail(e), { params: { include_inactive: "true" } }),
    enabled: !!e,
  });
}
function F(e = !1) {
  return c({
    queryKey: [...s, "catalog", e],
    queryFn: () => l(t.channels.catalog, { params: e ? { include_deprecated: "true" } : void 0 }),
    staleTime: 600 * 1e3,
  });
}
function K() {
  const e = r();
  return u({
    mutationFn: (n) => i(t.channels.list, n),
    onSuccess: () => e.invalidateQueries({ queryKey: s }),
  });
}
function b() {
  const e = r();
  return u({
    mutationFn: ({ id: n, data: a }) => m(t.channels.detail(String(n)), a),
    onSuccess: () => e.invalidateQueries({ queryKey: s }),
  });
}
function g() {
  const e = r();
  return u({
    mutationFn: (n) => {
      const a = typeof n == "object" ? n.id : n,
        o = typeof n == "object" ? !!n.hard : !1;
      return C(t.channels.detail(String(a)), {
        params: { include_inactive: "true", ...(o ? { hard: "true" } : {}) },
      });
    },
    onSuccess: () => e.invalidateQueries({ queryKey: s }),
  });
}
function T() {
  const e = r();
  return u({
    mutationFn: (n) => i(t.channels.regenerateSecret(String(n))),
    onSuccess: () => e.invalidateQueries({ queryKey: s }),
  });
}
function E() {
  const e = r();
  return u({
    mutationFn: ({ id: n, config: a }) =>
      i(t.channels.testConnection(String(n)), { ...(a ? { config: a } : {}) }),
    onSuccess: () => e.invalidateQueries({ queryKey: s }),
  });
}
function Q() {
  return u({
    mutationFn: ({ id: e, external_user_id: n, message: a, external_user_name: o, metadata: h }) =>
      i(t.channels.simulate(String(e)), {
        external_user_id: n,
        message: a,
        external_user_name: o ?? "",
        metadata: h ?? {},
      }),
  });
}
function _() {
  return u({
    mutationFn: ({ id: e, external_user_id: n, message: a }) =>
      i(t.channels.sendMessage(String(e)), { external_user_id: n, message: a }),
  });
}
function D(e) {
  return c({
    queryKey: [...s, e, "sessions"],
    queryFn: async () => {
      const n = await l(t.channels.sessions(e));
      return Array.isArray(n) ? n : (n.results ?? []);
    },
    enabled: !!e,
    staleTime: 3e4,
  });
}
export { K as a, b, F as c, E as d, v as e, g as f, T as g, Q as h, _ as i, D as j, p as u };
