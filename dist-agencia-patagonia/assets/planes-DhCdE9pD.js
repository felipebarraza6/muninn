import {
  j as r,
  r as c,
  ah as rt,
  K as ue,
  aK as gt,
  af as ds,
  ag as us,
} from "./vendor-react-DUYfdZnL.js";
import {
  P as Ze,
  E as ie,
  a as Sn,
  D as xr,
  cV as br,
  cW as Bt,
  bK as Jt,
  cX as fs,
  c as X,
  bE as ms,
  ba as $t,
  af as ps,
  cj as hs,
  a7 as $,
  cY as Cn,
  cZ as fe,
  c_ as gs,
  bQ as vr,
  c$ as Ft,
  d0 as xs,
  a5 as it,
  cR as bs,
  d1 as vs,
  d2 as ws,
  d3 as wr,
  B as F,
  d4 as yr,
  bU as ys,
  a3 as Dn,
  U as Y,
  V as _e,
  a0 as st,
  d5 as jr,
  d6 as Nr,
  d7 as js,
  d8 as Ns,
  C as kr,
  d9 as ks,
  cz as Ss,
  da as rn,
  aa as En,
  ab as In,
  ac as _n,
  ad as Rn,
  I as pn,
  db as Cs,
  dc as Ds,
  dd as Es,
  de as Is,
  aV as _s,
  aW as Rs,
  df as As,
  aY as Ms,
  aZ as Tt,
  dg as sn,
  dh as Ts,
  T as Ps,
  N as Os,
  O as on,
  Q as an,
  bx as Yn,
  W as Le,
  X as We,
  Y as $e,
  Z as ze,
  $ as de,
  F as hn,
  di as Sr,
  i as Ls,
  an as Ws,
  cG as $s,
  b as zs,
  dj as Bs,
  dk as Fs,
  dl as ve,
  M as Qn,
  bV as Us,
  cN as Hs,
  ah as qs,
  dm as Vs,
  dn as Ks,
  by as Js,
  bz as Xs,
  bA as Gs,
  bB as Ys,
  dp as Zn,
} from "./studio-chat-BBQUCckT.js";
import { u as Qs, a as Zs } from "./useWorkflows-DImh_Y0C.js";
import { u as Cr, a as Ae, b as Me } from "./vendor-query-IAyuTf1L.js";
import "./vendor-motion-BE8MBDzG.js";
import "./vendor-charts-l0_txfiz.js";
const Qe = "work-plans";
function Be(e, t) {
  (e.invalidateQueries({ queryKey: [Qe] }), t && e.invalidateQueries({ queryKey: [Qe, t] }));
}
async function Dr(e, t) {
  const n = t?.plan?.id ? String(t.plan.id) : void 0;
  (Be(e, n), n && (await e.refetchQueries({ queryKey: [Qe, n] })));
}
function eo(e) {
  return Cr({
    queryKey: [Qe, e],
    queryFn: () => Jt(ie.workPlans.list, { params: e }).then((t) => fs(t)),
    refetchInterval: (t) => ((t.state.data ?? []).some((o) => br(o.status)) ? Bt.live : Bt.idle),
    refetchIntervalInBackground: !1,
  });
}
function to(e) {
  return Cr({
    queryKey: [Qe, e],
    queryFn: () => Jt(ie.workPlans.detail(e)),
    enabled: !!e,
    refetchInterval: (t) => (br(t.state.data?.status) ? Bt.detailLive : Bt.detailIdle),
    refetchIntervalInBackground: !1,
  });
}
function no() {
  const e = Ae();
  return Me({ mutationFn: (t) => Ze(ie.workPlans.createWithItems, t), onSuccess: () => Be(e) });
}
function ro() {
  const e = Ae();
  return Me({
    mutationFn: ({ id: t, ...n }) => Sn(ie.workPlans.detail(t), n),
    onSuccess: (t) => {
      (Be(e, t.id), t?.id && e.setQueryData([Qe, t.id], t));
    },
  });
}
function so() {
  const e = Ae();
  return Me({ mutationFn: (t) => Ze(ie.workItems.list, t), onSuccess: (t) => Be(e, t.plan) });
}
function oo() {
  const e = Ae();
  return Me({
    mutationFn: ({ id: t, ...n }) => Sn(ie.workItems.detail(t), n),
    onSuccess: (t) => Be(e, t.plan),
  });
}
function ao() {
  const e = Ae();
  return Me({
    mutationFn: ({ id: t }) => xr(ie.workItems.detail(t)),
    onSuccess: (t, n) => Be(e, n.planId),
  });
}
function io() {
  const e = Ae();
  return Me({
    mutationFn: (t) => Ze(ie.workPlans.runNext(t)),
    onSuccess: async (t) => {
      await Dr(e, t);
    },
  });
}
function lo() {
  const e = Ae();
  return Me({
    mutationFn: ({ id: t, stopOnError: n }) =>
      Ze(ie.workPlans.runAll(t), { max_steps: 50, stop_on_error: n ?? !1 }),
    onSuccess: async (t) => {
      await Dr(e, t);
    },
  });
}
function co() {
  const e = Ae();
  return Me({ mutationFn: (t) => xr(ie.workPlans.detail(t)), onSuccess: () => Be(e) });
}
function uo() {
  const e = Ae();
  return Me({
    mutationFn: (t) => Ze(ie.workItems.run(t)),
    onSuccess: async (t) => {
      const n = t.item?.plan ? String(t.item.plan) : void 0;
      (Be(e, n), n && (await e.refetchQueries({ queryKey: [Qe, n] })));
    },
  });
}
function fo() {
  const e = Ae();
  return Me({
    mutationFn: async (t) => {
      try {
        return await Ze(ie.workItems.retry(t));
      } catch {
        return (
          await Sn(ie.workItems.detail(t), { status: "pending", error_message: "" }),
          Ze(ie.workItems.run(t))
        );
      }
    },
    onSuccess: async (t) => {
      const n = t.item?.plan ? String(t.item.plan) : void 0;
      (Be(e, n), n && (await e.refetchQueries({ queryKey: [Qe, n] })));
    },
  });
}
const mo = ms(
  "inline-flex items-center rounded-full border font-medium whitespace-nowrap max-w-full truncate",
  {
    variants: {
      tone: {
        running: "bg-info-soft text-info border-transparent",
        pending: "bg-warning-soft text-warning border-transparent",
        success: "bg-success-soft text-success border-transparent",
        failed: "bg-destructive-soft text-destructive border-transparent",
        idle: "bg-muted text-muted-foreground border-transparent",
        skipped: "bg-muted text-muted-foreground border-transparent",
      },
      size: { xs: "px-1.5 py-0.5 text-[10px]", sm: "px-2 py-0.5 text-[11px]" },
    },
    defaultVariants: { tone: "idle", size: "xs" },
  },
);
function jt({ label: e, tone: t = "idle", size: n = "xs", className: s }) {
  return r.jsx("span", { className: X(mo({ tone: t, size: n }), s), title: e, children: e });
}
const po = {
    draft: "Borrador",
    scheduled: "Programado",
    ready: "Listo",
    queued: "En cola",
    running: "En curso",
    completed: "Completado",
    failed: "Fallido",
    cancelled: "Cancelado",
    paused: "Pausado",
  },
  ho = {
    pending: "Pendiente",
    queued: "En cola",
    running: "Ejecutando",
    done: "Hecha",
    completed: "Hecha",
    failed: "Fallida",
    skipped: "Omitida",
    cancelled: "Cancelada",
  };
function gn(e) {
  return e ? po[e] || e : "—";
}
function bt(e) {
  return e ? ho[e] || e : "—";
}
function lt(e) {
  const t = String(e || "").toLowerCase();
  return t === "failed" || t === "cancelled" || t.includes("error")
    ? "failed"
    : t === "running" || t === "processing" || t === "in_progress"
      ? "running"
      : t === "completed" || t === "done" || t === "ready" || t === "ok"
        ? "success"
        : t === "pending" || t === "queued" || t === "scheduled" || t === "draft"
          ? "pending"
          : t === "skipped" || t === "paused"
            ? "skipped"
            : "idle";
}
function ke(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function _(e) {
  return typeof e == "string" && e.trim() ? e.trim() : void 0;
}
function ot(e) {
  if (e != null && typeof e == "object") return e;
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!(t.startsWith("{") || t.startsWith("["))) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}
function Xt(e, t = "") {
  const n = e.toLowerCase(),
    s = t.toLowerCase();
  return n.endsWith(".pdf") || s.includes("pdf")
    ? "PDF"
    : n.endsWith(".xlsx") ||
        s.includes("spreadsheet") ||
        n.endsWith(".xls") ||
        s.includes("ms-excel")
      ? "Excel"
      : n.endsWith(".csv") || s.includes("csv")
        ? "CSV"
        : n.endsWith(".json") || s.includes("json")
          ? "JSON"
          : n.endsWith(".md") || s.includes("markdown")
            ? "Markdown"
            : n.endsWith(".html") || s.includes("html")
              ? "HTML"
              : n.endsWith(".zip") || s.includes("zip")
                ? "ZIP"
                : s.startsWith("image/")
                  ? "Imagen"
                  : s.startsWith("text/")
                    ? "Texto"
                    : "Archivo";
}
function ln(e) {
  return e == null
    ? "—"
    : typeof e == "boolean"
      ? e
        ? "Sí"
        : "No"
      : typeof e == "number"
        ? Number.isFinite(e)
          ? String(e)
          : "—"
        : typeof e == "string"
          ? e
          : Er(e);
}
function Er(e) {
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function Ir(e, t = "") {
  const n = [ke(e) ? e.content : null, ke(e) ? e.result : null, t, e];
  for (const o of n) {
    const a = ot(o);
    if (
      ke(a) &&
      (a.metrics ||
        a.xlsx ||
        a.report ||
        a.period ||
        a.document_id ||
        typeof a.tickets_count == "number")
    )
      return a;
  }
  const s = ot(t) ?? ot(e);
  return ke(s) ? s : null;
}
function go(e, t = "") {
  const s = Mn(e, t)
      .filter((d) => d.kind === "document" || d.kind === "url" || d.kind === "base64")
      .map((d) => Xt(d.name, d.mime)),
    o = [...new Set(s)],
    a = Ir(e, t),
    l = [];
  if ((o.length && l.push(o.join(" + ")), a)) {
    const d = ke(a.period)
        ? _(a.period.label) || _(a.period.period) || _(a.period.month)
        : _(a.period),
      f =
        typeof a.tickets_count == "number"
          ? a.tickets_count
          : ke(a.metrics) && typeof a.metrics.total == "number"
            ? a.metrics.total
            : void 0;
    if (
      (typeof f == "number" && l.push(`${f} tickets`),
      d && l.push(d),
      a.success === !1 && _(a.error))
    )
      return _(a.error) || "Error";
    !l.length && a.success === !0 && l.push("OK");
  }
  if (l.length) return l.join(" · ");
  const i = t.trim();
  return i ? (ot(i) ? "Resultado JSON" : i.length > 140 ? `${i.slice(0, 140)}…` : i) : "";
}
function xo(e, t = "") {
  const n = new Set([
      "content",
      "ok",
      "tool_calls",
      "nodes",
      "files",
      "attachments",
      "artifacts",
      "downloads",
      "xlsx",
      "report",
      "pdf",
      "document",
      "documents",
      "file",
      "result",
      "output",
    ]),
    s = Ir(e, t);
  if (!s) return [];
  const o = [];
  (typeof s.success == "boolean" && o.push({ label: "Estado", value: s.success ? "OK" : "Error" }),
    _(s.error) && o.push({ label: "Error", value: _(s.error) }));
  const a = s.period;
  if (ke(a)) {
    const i = _(a.label) || _(a.period) || _(a.month) || Er(a);
    o.push({ label: "Periodo", value: i });
  } else _(a) && o.push({ label: "Periodo", value: _(a) });
  (typeof s.tickets_count == "number" &&
    o.push({ label: "Tickets", value: String(s.tickets_count) }),
    _(s.source) && o.push({ label: "Fuente", value: _(s.source) }));
  const l = s.metrics;
  if (ke(l))
    for (const [i, d] of Object.entries(l))
      d == null ||
        typeof d == "object" ||
        o.push({ label: i === "total" ? "Total" : i.replace(/_/g, " "), value: ln(d) });
  for (const [i, d] of Object.entries(s))
    if (!(n.has(i) || i === "success" || i === "error" || i === "period" || i === "metrics")) {
      if (i === "tickets_count" || i === "source" || i === "api_error") {
        i === "api_error" && d && o.push({ label: "API", value: ln(d) });
        continue;
      }
      (typeof d == "string" || typeof d == "number" || typeof d == "boolean") &&
        o.push({ label: i.replace(/_/g, " "), value: ln(d) });
    }
  return o;
}
function An(e) {
  const t = e.split("?")[0] || e,
    n = t.split(/[/\\]/).filter(Boolean);
  return n[n.length - 1] || t;
}
function Nt(e) {
  const t = (e || "").trim();
  if (!(!t || t.startsWith("data:") || /^https?:\/\//i.test(t))) {
    if (t.startsWith("/media/")) return $t(t) || t;
    if (t.startsWith("media/")) {
      const n = `/${t}`;
      return $t(n) || n;
    }
    if (t.includes("/")) {
      const n = `/media/${t.replace(/^\/+/, "")}`;
      return $t(n) || n;
    }
  }
}
function xn(e, t) {
  if (!e || typeof e != "object") return t;
  const n = e;
  if (n.friendlyMessage) return n.friendlyMessage;
  const s = n.response?.status;
  if (s === 403) return "Sin permiso para leer Documents (módulo config).";
  if (s === 404) return "Documento no encontrado en esta sucursal.";
  const o = n.response?.data?.detail;
  return typeof o == "string" && o.trim()
    ? o
    : typeof n.message == "string" && n.message.trim() && n.message !== "Error"
      ? n.message
      : t;
}
function _r(e, t) {
  if (t && t.includes("/")) return t;
  const n = e.toLowerCase(),
    s = (t || "").toLowerCase();
  return s === "pdf" || n.endsWith(".pdf")
    ? "application/pdf"
    : s === "xlsx" || n.endsWith(".xlsx")
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : s === "xls" || n.endsWith(".xls")
        ? "application/vnd.ms-excel"
        : n.endsWith(".json")
          ? "application/json"
          : n.endsWith(".md") || n.endsWith(".markdown")
            ? "text/markdown"
            : n.endsWith(".csv")
              ? "text/csv"
              : n.endsWith(".html") || n.endsWith(".htm")
                ? "text/html"
                : n.endsWith(".txt")
                  ? "text/plain"
                  : n.endsWith(".png")
                    ? "image/png"
                    : n.endsWith(".jpg") || n.endsWith(".jpeg")
                      ? "image/jpeg"
                      : n.endsWith(".webp")
                        ? "image/webp"
                        : n.endsWith(".zip")
                          ? "application/zip"
                          : t || "application/octet-stream";
}
function bo(e) {
  const t = e.trim().slice(0, 800);
  if (
    !t.includes(`
`) &&
    !t.includes(",")
  )
    return !1;
  const n = t
    .split(
      `
`,
    )
    .filter(Boolean);
  if (n.length < 2) return !1;
  const s = n.slice(0, 5).map((o) => (o.match(/,/g) || []).length);
  return s.every((o) => o >= 1) && Math.max(...s) - Math.min(...s) <= 2;
}
function vo(e) {
  const t = e.trim().slice(0, 200).toLowerCase();
  return t.startsWith("<!doctype html") || t.startsWith("<html") || /^<[a-z]+[\s>]/.test(t);
}
function Rr(e, t) {
  if (/\.[a-z0-9]{2,5}$/i.test(e)) return e;
  const n = t.toLowerCase();
  return n.includes("pdf") || n === "pdf"
    ? `${e}.pdf`
    : n.includes("spreadsheet") || n.includes("xlsx") || n === "xlsx"
      ? `${e}.xlsx`
      : n.includes("ms-excel") || n === "xls"
        ? `${e}.xls`
        : n.includes("csv") || n === "csv"
          ? `${e}.csv`
          : e;
}
function Ut(e, t) {
  e.some(
    (n) =>
      n.id === t.id ||
      (t.documentId && n.documentId === t.documentId) ||
      (n.name === t.name && n.href === t.href && n.kind === t.kind),
  ) || e.push(t);
}
function et(e) {
  return $t(e) || e;
}
function wo(e, t, n = "") {
  const s =
      _(e.format) ||
      _(e.ext) ||
      _(e.extension) ||
      (n === "xlsx" || n === "excel" || n === "spreadsheet"
        ? "xlsx"
        : n === "report" || n === "pdf"
          ? "pdf"
          : void 0),
    o = _(e.filename) || _(e.file_name) || _(e.file) || _(e.path),
    a = o || _(e.name) || _(e.title) || (n ? `${n}-${t + 1}` : `archivo-${t + 1}`),
    l = An(a),
    i = _r(l, _(e.mime) || _(e.mime_type) || _(e.content_type) || _(e.mimetype) || s),
    d = Rr(l, s || i),
    f = Nt(o),
    u = _(e.document_id) || _(e.documentId);
  if (u && /^[0-9a-f-]{16,}$/i.test(u))
    return {
      id: `doc-${u}`,
      name: d,
      kind: "document",
      documentId: u,
      href: f,
      mime: i,
      sizeHint: typeof e.bytes == "number" ? `${Math.round(e.bytes / 1024)} KB` : void 0,
    };
  const p =
      f ||
      _(e.url) ||
      _(e.href) ||
      _(e.download_url) ||
      _(e.file_url) ||
      _(e.media_url) ||
      _(e.path),
    g =
      _(e.base64) ||
      _(e.content_base64) ||
      _(e.data_base64) ||
      (_(e.data)?.startsWith("data:") ? _(e.data) : void 0);
  if (p && (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("/")))
    return { id: `url-${t}-${d}`, name: d, kind: "url", href: et(p), mime: i };
  if (g) {
    const x = g.startsWith("data:") ? g : `data:${i};base64,${g.replace(/^base64,/, "")}`;
    return { id: `b64-${t}-${d}`, name: d, kind: "base64", href: x, mime: i };
  }
  return null;
}
const yo = new Set([
  "files",
  "attachments",
  "artifacts",
  "downloads",
  "outputs",
  "documents",
  "xlsx",
  "xls",
  "excel",
  "spreadsheet",
  "report",
  "pdf",
  "document",
  "file",
  "output",
  "result",
  "nodes",
]);
function Xe(e, t, n, s = "") {
  if (e == null || n > 8) return;
  if (typeof e == "string") {
    const a = e.trim();
    if (
      (a.startsWith("{") || a.startsWith("[")) &&
      a.length < 2e5 &&
      (a.includes("document_id") || a.includes(".pdf") || a.includes(".xlsx"))
    )
      try {
        Xe(JSON.parse(a), t, n + 1, s);
      } catch {}
    return;
  }
  if (Array.isArray(e)) {
    e.forEach((a, l) => {
      if (typeof a == "string" && /^https?:\/\//i.test(a)) {
        const i = An(a);
        Ut(t, { id: `url-str-${n}-${l}-${i}`, name: i, kind: "url", href: et(a), mime: _r(i) });
        return;
      }
      Xe(a, t, n + 1, s);
    });
    return;
  }
  if (!ke(e)) return;
  const o = wo(e, n, s);
  o && Ut(t, o);
  for (const [a, l] of Object.entries(e)) {
    const i = a.toLowerCase();
    if (i === "tool_calls" || i === "rag_context" || i === "parameters" || i === "payload") {
      (ke(l) || Array.isArray(l)) && Xe(l, t, n + 1, i);
      continue;
    }
    (yo.has(i) ||
      i === "content" ||
      i === "context" ||
      i.includes("document") ||
      i.includes("file") ||
      i.includes("xlsx") ||
      i.includes("pdf") ||
      i.includes("report") ||
      i === "output" ||
      i === "result" ||
      i === "nodes" ||
      (ke(l) && (l.document_id || l.documentId || l.file_url)) ||
      (typeof l == "string" &&
        (l.includes("document_id") || l.includes(".pdf") || l.includes(".xlsx")))) &&
      Xe(l, t, n + 1, i);
  }
}
function Mn(e, t = "") {
  const n = [];
  return (
    Xe(e, n, 0),
    !n.length &&
      t.trim().length > 40 &&
      (bo(t)
        ? Ut(n, {
            id: "inferred-csv",
            name: "resultado.csv",
            kind: "text",
            content: t,
            mime: "text/csv",
          })
        : vo(t)
          ? Ut(n, {
              id: "inferred-html",
              name: "resultado.html",
              kind: "text",
              content: t,
              mime: "text/html",
            })
          : Xe(t, n, 0)),
    n
  );
}
function xt(e, t, n) {
  const s = new Blob([t], { type: `${n};charset=utf-8` }),
    o = URL.createObjectURL(s),
    a = document.createElement("a");
  ((a.href = o),
    (a.download = e),
    (a.rel = "noopener"),
    document.body.appendChild(a),
    a.click(),
    a.remove(),
    URL.revokeObjectURL(o));
}
function jo(e, t) {
  const n = URL.createObjectURL(e),
    s = document.createElement("a");
  ((s.href = n),
    (s.download = t),
    (s.rel = "noopener"),
    document.body.appendChild(s),
    s.click(),
    s.remove(),
    URL.revokeObjectURL(n));
}
async function No(e) {
  const t = et(e),
    n = { Accept: "*/*" },
    s = localStorage.getItem("token");
  s && (n.Authorization = `Token ${s}`);
  const o = ps();
  o && hs() === "branch" && (n["x-branch-id"] = o);
  const a = await fetch(t, { credentials: "include", headers: n });
  if (!a.ok) throw new Error(`No se pudo leer el archivo (HTTP ${a.status})`);
  return a.blob();
}
function Ar(e, t) {
  const n = document.createElement("a");
  ((n.href = et(e)),
    (n.download = t),
    (n.rel = "noopener"),
    (n.target = "_blank"),
    document.body.appendChild(n),
    n.click(),
    n.remove());
}
async function bn(e, t) {
  const n = await No(e);
  if (n.type.includes("text/html") && n.size < 4096)
    throw new Error("El archivo no está disponible en media");
  jo(n, t);
}
async function ko(e) {
  const t = await Jt(ie.documents.detail(e)),
    n = _(t.file_url) || Nt(_(t.file_name)),
    s = t.file,
    o = Nt(_(s)),
    a = n ? et(n) : o;
  if (!a) throw new Error("Documento sin archivo");
  return {
    href: a,
    name: _(t.file_name) || _(t.title),
    mime: _(t.mime_type) || _(t.file_extension),
  };
}
async function So(e) {
  const t = e.name || "documento",
    n = [];
  if (e.href)
    try {
      await bn(e.href, t);
      return;
    } catch (s) {
      n.push(xn(s, "media"));
      try {
        Ar(e.href, t);
        return;
      } catch {}
    }
  if (e.documentId)
    try {
      const s = await ko(e.documentId),
        o = Rr(An(s.name || t), s.mime || e.mime);
      await bn(s.href, o);
      return;
    } catch (s) {
      n.push(xn(s, "documents"));
    }
  throw new Error(n.filter(Boolean).join(" · ") || "No se pudo descargar el archivo");
}
async function Co(e) {
  if (e.href) return et(e.href);
  if (e.kind === "text" && e.content != null) {
    const t = new Blob([e.content], { type: `${e.mime};charset=utf-8` });
    return URL.createObjectURL(t);
  }
  if (e.documentId) {
    const t = await Jt(ie.documents.detail(e.documentId)),
      n = _(t.file_url) || Nt(_(t.file_name)) || Nt(_(t.file));
    if (!n) throw new Error("Documento sin archivo");
    return et(n);
  }
  throw new Error("Sin enlace de archivo");
}
function Pt(e) {
  const t = Xt(e.name, e.mime).toLowerCase();
  return t === "pdf" || e.mime.includes("pdf")
    ? "pdf"
    : t === "imagen" || e.mime.startsWith("image/")
      ? "image"
      : t === "csv" ||
          t === "texto" ||
          t === "markdown" ||
          t === "json" ||
          t === "html" ||
          e.mime.startsWith("text/") ||
          e.kind === "text"
        ? "text"
        : t === "excel" || e.mime.includes("spreadsheet") || e.mime.includes("excel")
          ? "office"
          : "other";
}
async function Do(e) {
  if (e.kind === "text" && e.content != null) {
    xt(e.name, e.content, e.mime);
    return;
  }
  if (e.kind === "document" || e.documentId) {
    await So(e);
    return;
  }
  if (!e.href) throw new Error("Sin enlace");
  if (e.href.startsWith("data:")) {
    Ar(e.href, e.name);
    return;
  }
  try {
    await bn(e.href, e.name);
  } catch (t) {
    throw new Error(xn(t, "No se pudo descargar el archivo"));
  }
}
const Ye = { agent_turn: "Agente", workflow: "Workflow", function: "Skill", note: "Nota" },
  Tn = {
    agent_turn: "El agente recibe un mensaje y puede usar sus skills.",
    workflow: "Dispara un workflow de la sucursal (por id o nombre).",
    function: "Ejecuta una skill/función por slug con parámetros JSON.",
    note: "Solo deja una nota en el plan; no llama al modelo.",
  },
  cn = {
    function: {
      label: "Skill",
      shortLabel: "Skill",
      Icon: xs,
      chip: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/35",
      node: "bg-[#f59e0b]/20 text-[#fbbf24] ring-1 ring-[#f59e0b]/45",
      rail: "bg-[#f59e0b]/55",
      selectedBg: "bg-[#f59e0b]/10 border-[#f59e0b]/40 shadow-[0_0_0_1px_rgba(245,158,11,0.12)]",
      iconWrap: "bg-[#f59e0b]/15 text-[#fbbf24]",
    },
    workflow: {
      label: "Workflow",
      shortLabel: "Flow",
      Icon: Ft,
      chip: "bg-sky-500/15 text-sky-300 border-sky-400/35",
      node: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/45",
      rail: "bg-sky-400/55",
      selectedBg: "bg-sky-500/10 border-sky-400/40 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]",
      iconWrap: "bg-sky-500/15 text-sky-300",
    },
    agent_turn: {
      label: "Agente",
      shortLabel: "Agente",
      Icon: vr,
      chip: "bg-primary/15 text-primary border-primary/35",
      node: "bg-primary/20 text-primary ring-1 ring-primary/50",
      rail: "bg-primary/60",
      selectedBg: "bg-primary/10 border-primary/45 shadow-[0_0_24px_-12px_rgba(45,212,191,0.55)]",
      iconWrap: "bg-primary/15 text-primary",
    },
    note: {
      label: "Nota",
      shortLabel: "Nota",
      Icon: gs,
      chip: "bg-stone-500/15 text-stone-300 border-stone-400/30",
      node: "bg-stone-500/20 text-stone-300 ring-1 ring-stone-400/35",
      rail: "bg-stone-400/40",
      selectedBg: "bg-stone-500/10 border-stone-400/35",
      iconWrap: "bg-stone-500/15 text-stone-300",
    },
  };
function Pn(e) {
  return e && e in cn ? cn[e] : cn.note;
}
function Mr({ kind: e, className: t }) {
  const n = Pn(e),
    s = n.Icon;
  return r.jsxs("span", {
    className: X(
      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium shrink-0",
      n.chip,
      t,
    ),
    children: [r.jsx(s, { className: "h-3 w-3" }), n.shortLabel],
  });
}
const er = [
  {
    id: "inbox",
    label: "Pendientes",
    match: (e) => e === "draft" || e === "scheduled" || e === "running",
  },
  { id: "done", label: "Hechos", match: (e) => e === "completed" },
  { id: "failed", label: "Con error", match: (e) => e === "failed" || e === "cancelled" },
];
function Eo({ status: e }) {
  return e === "running"
    ? r.jsx(it, { className: "h-3.5 w-3.5 animate-spin text-info" })
    : e === "done" || e === "completed"
      ? r.jsx(bs, { className: "h-3.5 w-3.5 text-success" })
      : e === "failed"
        ? r.jsx(vs, { className: "h-3.5 w-3.5 text-destructive" })
        : r.jsx(ws, { className: "h-3.5 w-3.5 text-muted-foreground" });
}
function On(e) {
  if (e.kind === "agent_turn") return { message: e.message.trim() || e.title };
  if (e.kind === "note") return { text: e.noteText.trim() || e.title };
  if (e.kind === "function") {
    if (!e.functionSlug.trim()) return ($.error("La skill necesita un function_slug"), null);
    const t = Cn(e.parametersJson || "{}", "Parámetros");
    return t.ok
      ? { function_slug: e.functionSlug.trim(), parameters: t.value }
      : ($.error(t.error), null);
  }
  if (e.kind === "workflow") {
    if (!e.workflowId.trim() && !e.workflowName.trim())
      return ($.error("El ítem workflow necesita workflow_id o nombre"), null);
    const t = {};
    return (
      e.workflowId.trim() && (t.workflow_id = e.workflowId.trim()),
      e.workflowName.trim() && (t.workflow_name = e.workflowName.trim()),
      t
    );
  }
  return {};
}
function vn(e, t) {
  const n = t && typeof t == "object" ? t : {};
  return {
    message: typeof n.message == "string" ? n.message : "",
    functionSlug: typeof n.function_slug == "string" ? n.function_slug : "",
    parametersJson: fe(n.parameters ?? {}) || "{}",
    workflowId: typeof n.workflow_id == "string" ? n.workflow_id : "",
    workflowName: typeof n.workflow_name == "string" ? n.workflow_name : "",
    noteText: typeof n.text == "string" ? n.text : "",
  };
}
function Io(e) {
  if (!e) return [];
  const t = e.tool_calls;
  return Array.isArray(t)
    ? t.map((n, s) => {
        if (n && typeof n == "object") {
          const o = n,
            a = o.function && typeof o.function == "object" ? o.function : null,
            l =
              (typeof o.name == "string" && o.name) ||
              (typeof o.tool == "string" && o.tool) ||
              (typeof a?.name == "string" && a.name) ||
              (typeof o.function == "string" && o.function) ||
              `tool_${s + 1}`;
          let i = o.arguments ?? o.args ?? o.input ?? o.result ?? o.output;
          if ((i == null && a && (i = a.arguments ?? a.args ?? a), typeof i == "string"))
            try {
              i = JSON.parse(i);
            } catch {}
          return { name: l, detail: fe(i ?? o) };
        }
        return { name: `tool_${s + 1}`, detail: fe(n) };
      })
    : [];
}
function Gt(e) {
  const t = e.result && typeof e.result == "object" ? e.result : null;
  let n = "";
  if (t) {
    for (const f of [
      "content",
      "response_text",
      "response",
      "note",
      "summary",
      "message",
      "text",
    ]) {
      const u = t[f];
      if (typeof u == "string" && u.trim()) {
        n = u;
        break;
      }
    }
    (!n && t.result != null && (n = typeof t.result == "string" ? t.result : fe(t.result)),
      !n && t.value != null && (n = typeof t.value == "string" ? t.value : fe(t.value)));
  }
  const o = (Array.isArray(t?.nodes) ? t.nodes : [])
      .filter((f) => !!f && typeof f == "object")
      .map((f) => ({
        node: typeof f.node == "string" ? f.node : "Nodo",
        node_type: typeof f.node_type == "string" ? f.node_type : void 0,
        status: typeof f.status == "string" ? f.status : void 0,
        output: f.output,
        error: typeof f.error == "string" ? f.error : void 0,
      })),
    a = new Set([
      "content",
      "note",
      "response",
      "response_text",
      "summary",
      "message",
      "text",
      "tool_calls",
      "nodes",
      "ok",
    ]),
    l = t && Object.fromEntries(Object.entries(t).filter(([f]) => !a.has(f))),
    i = l && Object.keys(l).length ? fe(l) : "",
    d =
      (typeof t?.execution_id == "string" && t.execution_id) ||
      (typeof e.workflow_execution == "string" ? e.workflow_execution : void 0);
  return {
    replyText: n,
    hasResult:
      e.status === "done" ||
      e.status === "failed" ||
      !!e.error_message?.trim() ||
      !!e.workflow_execution ||
      (t != null && Object.keys(t).length > 0),
    nodes: o,
    metaJson: i,
    executionId: d,
    workflowStatus: typeof t?.status == "string" ? t.status : void 0,
  };
}
function Tr(e) {
  if (e.error_message) return e.error_message;
  const t = Gt(e),
    n = go(e.result, t.replyText);
  return (
    n ||
    (t.workflowStatus
      ? `Workflow: ${t.workflowStatus}`
      : e.status === "done"
        ? "Completado (sin texto de respuesta)"
        : "")
  );
}
function _o(e) {
  const t = Gt(e),
    s = Mn(e.result, t.replyText)
      .filter((o) => o.kind === "document" || o.kind === "url" || o.kind === "base64")
      .map((o) => Xt(o.name, o.mime));
  return [...new Set(s)].slice(0, 4);
}
function Ro(e) {
  const t = e.payload && typeof e.payload == "object" ? e.payload : {};
  if (e.kind === "agent_turn") return (typeof t.message == "string" ? t.message : e.title).trim();
  if (e.kind === "note") return (typeof t.text == "string" ? t.text : e.title).trim();
  if (e.kind === "function") {
    const n = typeof t.function_slug == "string" ? t.function_slug : "";
    return n ? `skill · ${n}` : "Skill sin slug";
  }
  if (e.kind === "workflow") {
    const n =
      (typeof t.workflow_name == "string" && t.workflow_name) ||
      (typeof t.workflow_id == "string" && t.workflow_id.slice(0, 8)) ||
      "";
    return n ? `workflow · ${n}` : "Workflow";
  }
  return "";
}
function nt(e) {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    kind: "agent_turn",
    message: "",
    functionSlug: "",
    parametersJson: "{}",
    workflowId: "",
    workflowName: "",
    noteText: "",
    ...e,
  };
}
function Ao({
  plan: e,
  agentLabel: t,
  busy: n,
  itemCount: s = 0,
  doneCount: o = 0,
  onRunNext: a,
  onRunAll: l,
  onCancel: i,
  onDelete: d,
  onSaveMeta: f,
}) {
  const [u, p] = c.useState("{}"),
    [g, x] = c.useState(""),
    [C, y] = c.useState(() => s === 0 && (e?.status === "draft" || !e?.status));
  if (
    (c.useEffect(() => {
      e && (p(fe(e.context ?? {}) || "{}"), x(wr(e.scheduled_for)));
    }, [e?.id, e?.context, e?.scheduled_for]),
    c.useEffect(() => {
      y(s === 0 && (e?.status === "draft" || !e?.status));
    }, [e?.id, e?.status, s]),
    !e)
  )
    return null;
  const j = s > 0 ? Math.min(100, Math.round((o / s) * 100)) : 0;
  return r.jsxs("div", {
    className: "shrink-0 border-b border-border/40 bg-background/50 backdrop-blur-sm",
    children: [
      r.jsxs("div", {
        className: "px-4 py-2.5 flex items-start gap-3",
        children: [
          r.jsxs("div", {
            className: "min-w-0 flex-1",
            children: [
              r.jsxs("div", {
                className: "flex items-center gap-2 flex-wrap",
                children: [
                  r.jsx("h2", { className: "text-sm font-semibold truncate", children: e.name }),
                  r.jsx(jt, { label: gn(e.status), tone: lt(e.status) }),
                  s > 0
                    ? r.jsxs("span", {
                        className: "text-[10px] tabular-nums text-muted-foreground",
                        children: [o, "/", s, " pasos"],
                      })
                    : null,
                ],
              }),
              r.jsxs("p", {
                className: "text-xs text-muted-foreground mt-0.5 line-clamp-2",
                children: [
                  e.description || "Sin descripción",
                  " · Agente: ",
                  t,
                  e.workflow
                    ? r.jsxs(r.Fragment, {
                        children: [
                          " · ",
                          r.jsxs(rt, {
                            to: `/app/workflows/${e.workflow}`,
                            className:
                              "text-primary hover:underline inline-flex items-center gap-1",
                            children: [r.jsx(Ft, { className: "h-3 w-3" }), "Abrir workflow"],
                          }),
                        ],
                      })
                    : null,
                ],
              }),
              s > 0
                ? r.jsx("div", {
                    className: "mt-2 h-1 w-full max-w-md rounded-full bg-muted/60 overflow-hidden",
                    title: `${j}% completado`,
                    children: r.jsx("div", {
                      className: "h-full rounded-full bg-primary transition-[width] duration-300",
                      style: { width: `${j}%` },
                    }),
                  })
                : null,
            ],
          }),
          r.jsxs("div", {
            className: "flex items-center gap-1 shrink-0",
            children: [
              r.jsxs(F, {
                size: "sm",
                variant: "outline",
                disabled: n || e.status === "cancelled",
                onClick: a,
                className: "h-8 gap-1",
                children: [
                  n
                    ? r.jsx(it, { className: "h-3.5 w-3.5 animate-spin" })
                    : r.jsx(yr, { className: "h-3.5 w-3.5" }),
                  r.jsx("span", { className: "hidden lg:inline", children: "Siguiente" }),
                ],
              }),
              r.jsxs(F, {
                size: "sm",
                disabled: n,
                onClick: l,
                className: "h-8 gap-1",
                children: [
                  r.jsx(ys, { className: "h-3.5 w-3.5" }),
                  r.jsx("span", { className: "hidden sm:inline", children: "Ejecutar todo" }),
                ],
              }),
              r.jsx(F, {
                size: "sm",
                variant: "ghost",
                disabled: n || e.status === "cancelled",
                onClick: i,
                className: "h-8 px-2",
                children: "Cancelar",
              }),
              r.jsx(F, {
                size: "icon",
                variant: "ghost",
                disabled: n,
                onClick: d,
                className: "h-8 w-8 text-destructive hover:text-destructive",
                title: "Eliminar plan",
                children: r.jsx(Dn, { className: "h-3.5 w-3.5" }),
              }),
            ],
          }),
        ],
      }),
      r.jsxs("div", {
        className: "border-t border-border/50",
        children: [
          r.jsxs("button", {
            type: "button",
            className:
              "w-full px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 text-left",
            onClick: () => y((v) => !v),
            children: [
              r.jsx("span", {
                className: X("text-primary/80 transition-transform inline-block", C && "rotate-90"),
                children: "▸",
              }),
              "Contexto y programación",
              r.jsx("span", {
                className: "font-normal opacity-70",
                children: e.scheduled_for
                  ? `· ${new Date(e.scheduled_for).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}`
                  : "· sin horario",
              }),
            ],
          }),
          C
            ? r.jsxs("div", {
                className: "px-4 pb-3 grid gap-2 sm:grid-cols-2",
                children: [
                  r.jsxs("div", {
                    className: "space-y-1",
                    children: [
                      r.jsx(Y, { className: "text-[11px]", children: "Programar para" }),
                      r.jsx(_e, {
                        type: "datetime-local",
                        value: g,
                        onChange: (v) => x(v.target.value),
                        className: "h-8 text-xs",
                      }),
                    ],
                  }),
                  r.jsxs("div", {
                    className: "space-y-1 sm:col-span-2",
                    children: [
                      r.jsx(Y, { className: "text-[11px]", children: "Contexto (JSON)" }),
                      r.jsx(st, {
                        value: u,
                        onChange: (v) => p(v.target.value),
                        rows: 2,
                        className: "text-[11px] font-mono min-h-[52px]",
                        placeholder: '{"demo": true}',
                      }),
                    ],
                  }),
                  r.jsx("div", {
                    className: "sm:col-span-2",
                    children: r.jsxs(F, {
                      size: "sm",
                      variant: "secondary",
                      className: "h-7 gap-1",
                      disabled: n,
                      onClick: () => {
                        const v = Cn(u, "Contexto");
                        if (!v.ok) {
                          $.error(v.error);
                          return;
                        }
                        f({ context: v.value, scheduled_for: Nr(g) });
                      },
                      children: [
                        r.jsx(jr, { className: "h-3.5 w-3.5" }),
                        "Guardar contexto / programación",
                      ],
                    }),
                  }),
                ],
              })
            : null,
        ],
      }),
    ],
  });
}
function Mo() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
  return c.useMemo(
    () => (s) => {
      t.forEach((o) => o(s));
    },
    t,
  );
}
const Yt =
  typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function ct(e) {
  const t = Object.prototype.toString.call(e);
  return t === "[object Window]" || t === "[object global]";
}
function Ln(e) {
  return "nodeType" in e;
}
function me(e) {
  var t, n;
  return e
    ? ct(e)
      ? e
      : Ln(e) && (t = (n = e.ownerDocument) == null ? void 0 : n.defaultView) != null
        ? t
        : window
    : window;
}
function Wn(e) {
  const { Document: t } = me(e);
  return e instanceof t;
}
function Et(e) {
  return ct(e) ? !1 : e instanceof me(e).HTMLElement;
}
function Pr(e) {
  return e instanceof me(e).SVGElement;
}
function dt(e) {
  return e
    ? ct(e)
      ? e.document
      : Ln(e)
        ? Wn(e)
          ? e
          : Et(e) || Pr(e)
            ? e.ownerDocument
            : document
        : document
    : document;
}
const Re = Yt ? c.useLayoutEffect : c.useEffect;
function $n(e) {
  const t = c.useRef(e);
  return (
    Re(() => {
      t.current = e;
    }),
    c.useCallback(function () {
      for (var n = arguments.length, s = new Array(n), o = 0; o < n; o++) s[o] = arguments[o];
      return t.current == null ? void 0 : t.current(...s);
    }, [])
  );
}
function To() {
  const e = c.useRef(null),
    t = c.useCallback((s, o) => {
      e.current = setInterval(s, o);
    }, []),
    n = c.useCallback(() => {
      e.current !== null && (clearInterval(e.current), (e.current = null));
    }, []);
  return [t, n];
}
function kt(e, t) {
  t === void 0 && (t = [e]);
  const n = c.useRef(e);
  return (
    Re(() => {
      n.current !== e && (n.current = e);
    }, t),
    n
  );
}
function It(e, t) {
  const n = c.useRef();
  return c.useMemo(() => {
    const s = e(n.current);
    return ((n.current = s), s);
  }, [...t]);
}
function Ht(e) {
  const t = $n(e),
    n = c.useRef(null),
    s = c.useCallback((o) => {
      (o !== n.current && t?.(o, n.current), (n.current = o));
    }, []);
  return [n, s];
}
function wn(e) {
  const t = c.useRef();
  return (
    c.useEffect(() => {
      t.current = e;
    }, [e]),
    t.current
  );
}
let dn = {};
function _t(e, t) {
  return c.useMemo(() => {
    if (t) return t;
    const n = dn[e] == null ? 0 : dn[e] + 1;
    return ((dn[e] = n), e + "-" + n);
  }, [e, t]);
}
function Or(e) {
  return function (t) {
    for (var n = arguments.length, s = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
      s[o - 1] = arguments[o];
    return s.reduce(
      (a, l) => {
        const i = Object.entries(l);
        for (const [d, f] of i) {
          const u = a[d];
          u != null && (a[d] = u + e * f);
        }
        return a;
      },
      { ...t },
    );
  };
}
const at = Or(1),
  St = Or(-1);
function Po(e) {
  return "clientX" in e && "clientY" in e;
}
function zn(e) {
  if (!e) return !1;
  const { KeyboardEvent: t } = me(e.target);
  return t && e instanceof t;
}
function Oo(e) {
  if (!e) return !1;
  const { TouchEvent: t } = me(e.target);
  return t && e instanceof t;
}
function yn(e) {
  if (Oo(e)) {
    if (e.touches && e.touches.length) {
      const { clientX: t, clientY: n } = e.touches[0];
      return { x: t, y: n };
    } else if (e.changedTouches && e.changedTouches.length) {
      const { clientX: t, clientY: n } = e.changedTouches[0];
      return { x: t, y: n };
    }
  }
  return Po(e) ? { x: e.clientX, y: e.clientY } : null;
}
const Ct = Object.freeze({
    Translate: {
      toString(e) {
        if (!e) return;
        const { x: t, y: n } = e;
        return (
          "translate3d(" + (t ? Math.round(t) : 0) + "px, " + (n ? Math.round(n) : 0) + "px, 0)"
        );
      },
    },
    Scale: {
      toString(e) {
        if (!e) return;
        const { scaleX: t, scaleY: n } = e;
        return "scaleX(" + t + ") scaleY(" + n + ")";
      },
    },
    Transform: {
      toString(e) {
        if (e) return [Ct.Translate.toString(e), Ct.Scale.toString(e)].join(" ");
      },
    },
    Transition: {
      toString(e) {
        let { property: t, duration: n, easing: s } = e;
        return t + " " + n + "ms " + s;
      },
    },
  }),
  tr =
    "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
function Lo(e) {
  return e.matches(tr) ? e : e.querySelector(tr);
}
const Wo = { display: "none" };
function $o(e) {
  let { id: t, value: n } = e;
  return ue.createElement("div", { id: t, style: Wo }, n);
}
function zo(e) {
  let { id: t, announcement: n, ariaLiveType: s = "assertive" } = e;
  const o = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(100%)",
    whiteSpace: "nowrap",
  };
  return ue.createElement(
    "div",
    { id: t, style: o, role: "status", "aria-live": s, "aria-atomic": !0 },
    n,
  );
}
function Bo() {
  const [e, t] = c.useState("");
  return {
    announce: c.useCallback((s) => {
      s != null && t(s);
    }, []),
    announcement: e,
  };
}
const Lr = c.createContext(null);
function Fo(e) {
  const t = c.useContext(Lr);
  c.useEffect(() => {
    if (!t) throw new Error("useDndMonitor must be used within a children of <DndContext>");
    return t(e);
  }, [e, t]);
}
function Uo() {
  const [e] = c.useState(() => new Set()),
    t = c.useCallback((s) => (e.add(s), () => e.delete(s)), [e]);
  return [
    c.useCallback(
      (s) => {
        let { type: o, event: a } = s;
        e.forEach((l) => {
          var i;
          return (i = l[o]) == null ? void 0 : i.call(l, a);
        });
      },
      [e],
    ),
    t,
  ];
}
const Ho = {
    draggable: `
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
  },
  qo = {
    onDragStart(e) {
      let { active: t } = e;
      return "Picked up draggable item " + t.id + ".";
    },
    onDragOver(e) {
      let { active: t, over: n } = e;
      return n
        ? "Draggable item " + t.id + " was moved over droppable area " + n.id + "."
        : "Draggable item " + t.id + " is no longer over a droppable area.";
    },
    onDragEnd(e) {
      let { active: t, over: n } = e;
      return n
        ? "Draggable item " + t.id + " was dropped over droppable area " + n.id
        : "Draggable item " + t.id + " was dropped.";
    },
    onDragCancel(e) {
      let { active: t } = e;
      return "Dragging was cancelled. Draggable item " + t.id + " was dropped.";
    },
  };
function Vo(e) {
  let {
    announcements: t = qo,
    container: n,
    hiddenTextDescribedById: s,
    screenReaderInstructions: o = Ho,
  } = e;
  const { announce: a, announcement: l } = Bo(),
    i = _t("DndLiveRegion"),
    [d, f] = c.useState(!1);
  if (
    (c.useEffect(() => {
      f(!0);
    }, []),
    Fo(
      c.useMemo(
        () => ({
          onDragStart(p) {
            let { active: g } = p;
            a(t.onDragStart({ active: g }));
          },
          onDragMove(p) {
            let { active: g, over: x } = p;
            t.onDragMove && a(t.onDragMove({ active: g, over: x }));
          },
          onDragOver(p) {
            let { active: g, over: x } = p;
            a(t.onDragOver({ active: g, over: x }));
          },
          onDragEnd(p) {
            let { active: g, over: x } = p;
            a(t.onDragEnd({ active: g, over: x }));
          },
          onDragCancel(p) {
            let { active: g, over: x } = p;
            a(t.onDragCancel({ active: g, over: x }));
          },
        }),
        [a, t],
      ),
    ),
    !d)
  )
    return null;
  const u = ue.createElement(
    ue.Fragment,
    null,
    ue.createElement($o, { id: s, value: o.draggable }),
    ue.createElement(zo, { id: i, announcement: l }),
  );
  return n ? gt.createPortal(u, n) : u;
}
var Z;
(function (e) {
  ((e.DragStart = "dragStart"),
    (e.DragMove = "dragMove"),
    (e.DragEnd = "dragEnd"),
    (e.DragCancel = "dragCancel"),
    (e.DragOver = "dragOver"),
    (e.RegisterDroppable = "registerDroppable"),
    (e.SetDroppableDisabled = "setDroppableDisabled"),
    (e.UnregisterDroppable = "unregisterDroppable"));
})(Z || (Z = {}));
function qt() {}
function nr(e, t) {
  return c.useMemo(() => ({ sensor: e, options: t ?? {} }), [e, t]);
}
function Ko() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
  return c.useMemo(() => [...t].filter((s) => s != null), [...t]);
}
const Se = Object.freeze({ x: 0, y: 0 });
function Wr(e, t) {
  return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
}
function $r(e, t) {
  let {
      data: { value: n },
    } = e,
    {
      data: { value: s },
    } = t;
  return n - s;
}
function Jo(e, t) {
  let {
      data: { value: n },
    } = e,
    {
      data: { value: s },
    } = t;
  return s - n;
}
function rr(e) {
  let { left: t, top: n, height: s, width: o } = e;
  return [
    { x: t, y: n },
    { x: t + o, y: n },
    { x: t, y: n + s },
    { x: t + o, y: n + s },
  ];
}
function zr(e, t) {
  if (!e || e.length === 0) return null;
  const [n] = e;
  return n[t];
}
function sr(e, t, n) {
  return (
    t === void 0 && (t = e.left),
    n === void 0 && (n = e.top),
    { x: t + e.width * 0.5, y: n + e.height * 0.5 }
  );
}
const Xo = (e) => {
    let { collisionRect: t, droppableRects: n, droppableContainers: s } = e;
    const o = sr(t, t.left, t.top),
      a = [];
    for (const l of s) {
      const { id: i } = l,
        d = n.get(i);
      if (d) {
        const f = Wr(sr(d), o);
        a.push({ id: i, data: { droppableContainer: l, value: f } });
      }
    }
    return a.sort($r);
  },
  Go = (e) => {
    let { collisionRect: t, droppableRects: n, droppableContainers: s } = e;
    const o = rr(t),
      a = [];
    for (const l of s) {
      const { id: i } = l,
        d = n.get(i);
      if (d) {
        const f = rr(d),
          u = o.reduce((g, x, C) => g + Wr(f[C], x), 0),
          p = Number((u / 4).toFixed(4));
        a.push({ id: i, data: { droppableContainer: l, value: p } });
      }
    }
    return a.sort($r);
  };
function Yo(e, t) {
  const n = Math.max(t.top, e.top),
    s = Math.max(t.left, e.left),
    o = Math.min(t.left + t.width, e.left + e.width),
    a = Math.min(t.top + t.height, e.top + e.height),
    l = o - s,
    i = a - n;
  if (s < o && n < a) {
    const d = t.width * t.height,
      f = e.width * e.height,
      u = l * i,
      p = u / (d + f - u);
    return Number(p.toFixed(4));
  }
  return 0;
}
const Qo = (e) => {
  let { collisionRect: t, droppableRects: n, droppableContainers: s } = e;
  const o = [];
  for (const a of s) {
    const { id: l } = a,
      i = n.get(l);
    if (i) {
      const d = Yo(i, t);
      d > 0 && o.push({ id: l, data: { droppableContainer: a, value: d } });
    }
  }
  return o.sort(Jo);
};
function Zo(e, t, n) {
  return { ...e, scaleX: t && n ? t.width / n.width : 1, scaleY: t && n ? t.height / n.height : 1 };
}
function Br(e, t) {
  return e && t ? { x: e.left - t.left, y: e.top - t.top } : Se;
}
function ea(e) {
  return function (n) {
    for (var s = arguments.length, o = new Array(s > 1 ? s - 1 : 0), a = 1; a < s; a++)
      o[a - 1] = arguments[a];
    return o.reduce(
      (l, i) => ({
        ...l,
        top: l.top + e * i.y,
        bottom: l.bottom + e * i.y,
        left: l.left + e * i.x,
        right: l.right + e * i.x,
      }),
      { ...n },
    );
  };
}
const ta = ea(1);
function na(e) {
  if (e.startsWith("matrix3d(")) {
    const t = e.slice(9, -1).split(/, /);
    return { x: +t[12], y: +t[13], scaleX: +t[0], scaleY: +t[5] };
  } else if (e.startsWith("matrix(")) {
    const t = e.slice(7, -1).split(/, /);
    return { x: +t[4], y: +t[5], scaleX: +t[0], scaleY: +t[3] };
  }
  return null;
}
function ra(e, t, n) {
  const s = na(t);
  if (!s) return e;
  const { scaleX: o, scaleY: a, x: l, y: i } = s,
    d = e.left - l - (1 - o) * parseFloat(n),
    f = e.top - i - (1 - a) * parseFloat(n.slice(n.indexOf(" ") + 1)),
    u = o ? e.width / o : e.width,
    p = a ? e.height / a : e.height;
  return { width: u, height: p, top: f, right: d + u, bottom: f + p, left: d };
}
const sa = { ignoreTransform: !1 };
function ut(e, t) {
  t === void 0 && (t = sa);
  let n = e.getBoundingClientRect();
  if (t.ignoreTransform) {
    const { transform: f, transformOrigin: u } = me(e).getComputedStyle(e);
    f && (n = ra(n, f, u));
  }
  const { top: s, left: o, width: a, height: l, bottom: i, right: d } = n;
  return { top: s, left: o, width: a, height: l, bottom: i, right: d };
}
function or(e) {
  return ut(e, { ignoreTransform: !0 });
}
function oa(e) {
  const t = e.innerWidth,
    n = e.innerHeight;
  return { top: 0, left: 0, right: t, bottom: n, width: t, height: n };
}
function aa(e, t) {
  return (t === void 0 && (t = me(e).getComputedStyle(e)), t.position === "fixed");
}
function ia(e, t) {
  t === void 0 && (t = me(e).getComputedStyle(e));
  const n = /(auto|scroll|overlay)/;
  return ["overflow", "overflowX", "overflowY"].some((o) => {
    const a = t[o];
    return typeof a == "string" ? n.test(a) : !1;
  });
}
function Qt(e, t) {
  const n = [];
  function s(o) {
    if ((t != null && n.length >= t) || !o) return n;
    if (Wn(o) && o.scrollingElement != null && !n.includes(o.scrollingElement))
      return (n.push(o.scrollingElement), n);
    if (!Et(o) || Pr(o) || n.includes(o)) return n;
    const a = me(e).getComputedStyle(o);
    return (o !== e && ia(o, a) && n.push(o), aa(o, a) ? n : s(o.parentNode));
  }
  return e ? s(e) : n;
}
function Fr(e) {
  const [t] = Qt(e, 1);
  return t ?? null;
}
function un(e) {
  return !Yt || !e
    ? null
    : ct(e)
      ? e
      : Ln(e)
        ? Wn(e) || e === dt(e).scrollingElement
          ? window
          : Et(e)
            ? e
            : null
        : null;
}
function Ur(e) {
  return ct(e) ? e.scrollX : e.scrollLeft;
}
function Hr(e) {
  return ct(e) ? e.scrollY : e.scrollTop;
}
function jn(e) {
  return { x: Ur(e), y: Hr(e) };
}
var ee;
(function (e) {
  ((e[(e.Forward = 1)] = "Forward"), (e[(e.Backward = -1)] = "Backward"));
})(ee || (ee = {}));
function qr(e) {
  return !Yt || !e ? !1 : e === document.scrollingElement;
}
function Vr(e) {
  const t = { x: 0, y: 0 },
    n = qr(e)
      ? { height: window.innerHeight, width: window.innerWidth }
      : { height: e.clientHeight, width: e.clientWidth },
    s = { x: e.scrollWidth - n.width, y: e.scrollHeight - n.height },
    o = e.scrollTop <= t.y,
    a = e.scrollLeft <= t.x,
    l = e.scrollTop >= s.y,
    i = e.scrollLeft >= s.x;
  return { isTop: o, isLeft: a, isBottom: l, isRight: i, maxScroll: s, minScroll: t };
}
const la = { x: 0.2, y: 0.2 };
function ca(e, t, n, s, o) {
  let { top: a, left: l, right: i, bottom: d } = n;
  (s === void 0 && (s = 10), o === void 0 && (o = la));
  const { isTop: f, isBottom: u, isLeft: p, isRight: g } = Vr(e),
    x = { x: 0, y: 0 },
    C = { x: 0, y: 0 },
    y = { height: t.height * o.y, width: t.width * o.x };
  return (
    !f && a <= t.top + y.height
      ? ((x.y = ee.Backward), (C.y = s * Math.abs((t.top + y.height - a) / y.height)))
      : !u &&
        d >= t.bottom - y.height &&
        ((x.y = ee.Forward), (C.y = s * Math.abs((t.bottom - y.height - d) / y.height))),
    !g && i >= t.right - y.width
      ? ((x.x = ee.Forward), (C.x = s * Math.abs((t.right - y.width - i) / y.width)))
      : !p &&
        l <= t.left + y.width &&
        ((x.x = ee.Backward), (C.x = s * Math.abs((t.left + y.width - l) / y.width))),
    { direction: x, speed: C }
  );
}
function da(e) {
  if (e === document.scrollingElement) {
    const { innerWidth: a, innerHeight: l } = window;
    return { top: 0, left: 0, right: a, bottom: l, width: a, height: l };
  }
  const { top: t, left: n, right: s, bottom: o } = e.getBoundingClientRect();
  return { top: t, left: n, right: s, bottom: o, width: e.clientWidth, height: e.clientHeight };
}
function Kr(e) {
  return e.reduce((t, n) => at(t, jn(n)), Se);
}
function ua(e) {
  return e.reduce((t, n) => t + Ur(n), 0);
}
function fa(e) {
  return e.reduce((t, n) => t + Hr(n), 0);
}
function ma(e, t) {
  if ((t === void 0 && (t = ut), !e)) return;
  const { top: n, left: s, bottom: o, right: a } = t(e);
  Fr(e) &&
    (o <= 0 || a <= 0 || n >= window.innerHeight || s >= window.innerWidth) &&
    e.scrollIntoView({ block: "center", inline: "center" });
}
const pa = [
  ["x", ["left", "right"], ua],
  ["y", ["top", "bottom"], fa],
];
class Bn {
  constructor(t, n) {
    ((this.rect = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.top = void 0),
      (this.bottom = void 0),
      (this.right = void 0),
      (this.left = void 0));
    const s = Qt(n),
      o = Kr(s);
    ((this.rect = { ...t }), (this.width = t.width), (this.height = t.height));
    for (const [a, l, i] of pa)
      for (const d of l)
        Object.defineProperty(this, d, {
          get: () => {
            const f = i(s),
              u = o[a] - f;
            return this.rect[d] + u;
          },
          enumerable: !0,
        });
    Object.defineProperty(this, "rect", { enumerable: !1 });
  }
}
class vt {
  constructor(t) {
    ((this.target = void 0),
      (this.listeners = []),
      (this.removeAll = () => {
        this.listeners.forEach((n) => {
          var s;
          return (s = this.target) == null ? void 0 : s.removeEventListener(...n);
        });
      }),
      (this.target = t));
  }
  add(t, n, s) {
    var o;
    ((o = this.target) == null || o.addEventListener(t, n, s), this.listeners.push([t, n, s]));
  }
}
function ha(e) {
  const { EventTarget: t } = me(e);
  return e instanceof t ? e : dt(e);
}
function fn(e, t) {
  const n = Math.abs(e.x),
    s = Math.abs(e.y);
  return typeof t == "number"
    ? Math.sqrt(n ** 2 + s ** 2) > t
    : "x" in t && "y" in t
      ? n > t.x && s > t.y
      : "x" in t
        ? n > t.x
        : "y" in t
          ? s > t.y
          : !1;
}
var Ne;
(function (e) {
  ((e.Click = "click"),
    (e.DragStart = "dragstart"),
    (e.Keydown = "keydown"),
    (e.ContextMenu = "contextmenu"),
    (e.Resize = "resize"),
    (e.SelectionChange = "selectionchange"),
    (e.VisibilityChange = "visibilitychange"));
})(Ne || (Ne = {}));
function ar(e) {
  e.preventDefault();
}
function ga(e) {
  e.stopPropagation();
}
var B;
(function (e) {
  ((e.Space = "Space"),
    (e.Down = "ArrowDown"),
    (e.Right = "ArrowRight"),
    (e.Left = "ArrowLeft"),
    (e.Up = "ArrowUp"),
    (e.Esc = "Escape"),
    (e.Enter = "Enter"),
    (e.Tab = "Tab"));
})(B || (B = {}));
const Jr = { start: [B.Space, B.Enter], cancel: [B.Esc], end: [B.Space, B.Enter, B.Tab] },
  xa = (e, t) => {
    let { currentCoordinates: n } = t;
    switch (e.code) {
      case B.Right:
        return { ...n, x: n.x + 25 };
      case B.Left:
        return { ...n, x: n.x - 25 };
      case B.Down:
        return { ...n, y: n.y + 25 };
      case B.Up:
        return { ...n, y: n.y - 25 };
    }
  };
class Fn {
  constructor(t) {
    ((this.props = void 0),
      (this.autoScrollEnabled = !1),
      (this.referenceCoordinates = void 0),
      (this.listeners = void 0),
      (this.windowListeners = void 0),
      (this.props = t));
    const {
      event: { target: n },
    } = t;
    ((this.props = t),
      (this.listeners = new vt(dt(n))),
      (this.windowListeners = new vt(me(n))),
      (this.handleKeyDown = this.handleKeyDown.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      this.attach());
  }
  attach() {
    (this.handleStart(),
      this.windowListeners.add(Ne.Resize, this.handleCancel),
      this.windowListeners.add(Ne.VisibilityChange, this.handleCancel),
      setTimeout(() => this.listeners.add(Ne.Keydown, this.handleKeyDown)));
  }
  handleStart() {
    const { activeNode: t, onStart: n } = this.props,
      s = t.node.current;
    (s && ma(s), n(Se));
  }
  handleKeyDown(t) {
    if (zn(t)) {
      const { active: n, context: s, options: o } = this.props,
        { keyboardCodes: a = Jr, coordinateGetter: l = xa, scrollBehavior: i = "smooth" } = o,
        { code: d } = t;
      if (a.end.includes(d)) {
        this.handleEnd(t);
        return;
      }
      if (a.cancel.includes(d)) {
        this.handleCancel(t);
        return;
      }
      const { collisionRect: f } = s.current,
        u = f ? { x: f.left, y: f.top } : Se;
      this.referenceCoordinates || (this.referenceCoordinates = u);
      const p = l(t, { active: n, context: s.current, currentCoordinates: u });
      if (p) {
        const g = St(p, u),
          x = { x: 0, y: 0 },
          { scrollableAncestors: C } = s.current;
        for (const y of C) {
          const j = t.code,
            { isTop: v, isRight: A, isLeft: D, isBottom: E, maxScroll: N, minScroll: P } = Vr(y),
            R = da(y),
            k = {
              x: Math.min(
                j === B.Right ? R.right - R.width / 2 : R.right,
                Math.max(j === B.Right ? R.left : R.left + R.width / 2, p.x),
              ),
              y: Math.min(
                j === B.Down ? R.bottom - R.height / 2 : R.bottom,
                Math.max(j === B.Down ? R.top : R.top + R.height / 2, p.y),
              ),
            },
            U = (j === B.Right && !A) || (j === B.Left && !D),
            H = (j === B.Down && !E) || (j === B.Up && !v);
          if (U && k.x !== p.x) {
            const h = y.scrollLeft + g.x,
              z = (j === B.Right && h <= N.x) || (j === B.Left && h >= P.x);
            if (z && !g.y) {
              y.scrollTo({ left: h, behavior: i });
              return;
            }
            (z
              ? (x.x = y.scrollLeft - h)
              : (x.x = j === B.Right ? y.scrollLeft - N.x : y.scrollLeft - P.x),
              x.x && y.scrollBy({ left: -x.x, behavior: i }));
            break;
          } else if (H && k.y !== p.y) {
            const h = y.scrollTop + g.y,
              z = (j === B.Down && h <= N.y) || (j === B.Up && h >= P.y);
            if (z && !g.x) {
              y.scrollTo({ top: h, behavior: i });
              return;
            }
            (z
              ? (x.y = y.scrollTop - h)
              : (x.y = j === B.Down ? y.scrollTop - N.y : y.scrollTop - P.y),
              x.y && y.scrollBy({ top: -x.y, behavior: i }));
            break;
          }
        }
        this.handleMove(t, at(St(p, this.referenceCoordinates), x));
      }
    }
  }
  handleMove(t, n) {
    const { onMove: s } = this.props;
    (t.preventDefault(), s(n));
  }
  handleEnd(t) {
    const { onEnd: n } = this.props;
    (t.preventDefault(), this.detach(), n());
  }
  handleCancel(t) {
    const { onCancel: n } = this.props;
    (t.preventDefault(), this.detach(), n());
  }
  detach() {
    (this.listeners.removeAll(), this.windowListeners.removeAll());
  }
}
Fn.activators = [
  {
    eventName: "onKeyDown",
    handler: (e, t, n) => {
      let { keyboardCodes: s = Jr, onActivation: o } = t,
        { active: a } = n;
      const { code: l } = e.nativeEvent;
      if (s.start.includes(l)) {
        const i = a.activatorNode.current;
        return i && e.target !== i ? !1 : (e.preventDefault(), o?.({ event: e.nativeEvent }), !0);
      }
      return !1;
    },
  },
];
function ir(e) {
  return !!(e && "distance" in e);
}
function lr(e) {
  return !!(e && "delay" in e);
}
class Un {
  constructor(t, n, s) {
    var o;
    (s === void 0 && (s = ha(t.event.target)),
      (this.props = void 0),
      (this.events = void 0),
      (this.autoScrollEnabled = !0),
      (this.document = void 0),
      (this.activated = !1),
      (this.initialCoordinates = void 0),
      (this.timeoutId = null),
      (this.listeners = void 0),
      (this.documentListeners = void 0),
      (this.windowListeners = void 0),
      (this.props = t),
      (this.events = n));
    const { event: a } = t,
      { target: l } = a;
    ((this.props = t),
      (this.events = n),
      (this.document = dt(l)),
      (this.documentListeners = new vt(this.document)),
      (this.listeners = new vt(s)),
      (this.windowListeners = new vt(me(l))),
      (this.initialCoordinates = (o = yn(a)) != null ? o : Se),
      (this.handleStart = this.handleStart.bind(this)),
      (this.handleMove = this.handleMove.bind(this)),
      (this.handleEnd = this.handleEnd.bind(this)),
      (this.handleCancel = this.handleCancel.bind(this)),
      (this.handleKeydown = this.handleKeydown.bind(this)),
      (this.removeTextSelection = this.removeTextSelection.bind(this)),
      this.attach());
  }
  attach() {
    const {
      events: t,
      props: {
        options: { activationConstraint: n, bypassActivationConstraint: s },
      },
    } = this;
    if (
      (this.listeners.add(t.move.name, this.handleMove, { passive: !1 }),
      this.listeners.add(t.end.name, this.handleEnd),
      t.cancel && this.listeners.add(t.cancel.name, this.handleCancel),
      this.windowListeners.add(Ne.Resize, this.handleCancel),
      this.windowListeners.add(Ne.DragStart, ar),
      this.windowListeners.add(Ne.VisibilityChange, this.handleCancel),
      this.windowListeners.add(Ne.ContextMenu, ar),
      this.documentListeners.add(Ne.Keydown, this.handleKeydown),
      n)
    ) {
      if (
        s != null &&
        s({
          event: this.props.event,
          activeNode: this.props.activeNode,
          options: this.props.options,
        })
      )
        return this.handleStart();
      if (lr(n)) {
        ((this.timeoutId = setTimeout(this.handleStart, n.delay)), this.handlePending(n));
        return;
      }
      if (ir(n)) {
        this.handlePending(n);
        return;
      }
    }
    this.handleStart();
  }
  detach() {
    (this.listeners.removeAll(),
      this.windowListeners.removeAll(),
      setTimeout(this.documentListeners.removeAll, 50),
      this.timeoutId !== null && (clearTimeout(this.timeoutId), (this.timeoutId = null)));
  }
  handlePending(t, n) {
    const { active: s, onPending: o } = this.props;
    o(s, t, this.initialCoordinates, n);
  }
  handleStart() {
    const { initialCoordinates: t } = this,
      { onStart: n } = this.props;
    t &&
      ((this.activated = !0),
      this.documentListeners.add(Ne.Click, ga, { capture: !0 }),
      this.removeTextSelection(),
      this.documentListeners.add(Ne.SelectionChange, this.removeTextSelection),
      n(t));
  }
  handleMove(t) {
    var n;
    const { activated: s, initialCoordinates: o, props: a } = this,
      {
        onMove: l,
        options: { activationConstraint: i },
      } = a;
    if (!o) return;
    const d = (n = yn(t)) != null ? n : Se,
      f = St(o, d);
    if (!s && i) {
      if (ir(i)) {
        if (i.tolerance != null && fn(f, i.tolerance)) return this.handleCancel();
        if (fn(f, i.distance)) return this.handleStart();
      }
      if (lr(i) && fn(f, i.tolerance)) return this.handleCancel();
      this.handlePending(i, f);
      return;
    }
    (t.cancelable && t.preventDefault(), l(d));
  }
  handleEnd() {
    const { onAbort: t, onEnd: n } = this.props;
    (this.detach(), this.activated || t(this.props.active), n());
  }
  handleCancel() {
    const { onAbort: t, onCancel: n } = this.props;
    (this.detach(), this.activated || t(this.props.active), n());
  }
  handleKeydown(t) {
    t.code === B.Esc && this.handleCancel();
  }
  removeTextSelection() {
    var t;
    (t = this.document.getSelection()) == null || t.removeAllRanges();
  }
}
const ba = {
  cancel: { name: "pointercancel" },
  move: { name: "pointermove" },
  end: { name: "pointerup" },
};
class Hn extends Un {
  constructor(t) {
    const { event: n } = t,
      s = dt(n.target);
    super(t, ba, s);
  }
}
Hn.activators = [
  {
    eventName: "onPointerDown",
    handler: (e, t) => {
      let { nativeEvent: n } = e,
        { onActivation: s } = t;
      return !n.isPrimary || n.button !== 0 ? !1 : (s?.({ event: n }), !0);
    },
  },
];
const va = { move: { name: "mousemove" }, end: { name: "mouseup" } };
var Nn;
(function (e) {
  e[(e.RightClick = 2)] = "RightClick";
})(Nn || (Nn = {}));
class wa extends Un {
  constructor(t) {
    super(t, va, dt(t.event.target));
  }
}
wa.activators = [
  {
    eventName: "onMouseDown",
    handler: (e, t) => {
      let { nativeEvent: n } = e,
        { onActivation: s } = t;
      return n.button === Nn.RightClick ? !1 : (s?.({ event: n }), !0);
    },
  },
];
const mn = {
  cancel: { name: "touchcancel" },
  move: { name: "touchmove" },
  end: { name: "touchend" },
};
class ya extends Un {
  constructor(t) {
    super(t, mn);
  }
  static setup() {
    return (
      window.addEventListener(mn.move.name, t, { capture: !1, passive: !1 }),
      function () {
        window.removeEventListener(mn.move.name, t);
      }
    );
    function t() {}
  }
}
ya.activators = [
  {
    eventName: "onTouchStart",
    handler: (e, t) => {
      let { nativeEvent: n } = e,
        { onActivation: s } = t;
      const { touches: o } = n;
      return o.length > 1 ? !1 : (s?.({ event: n }), !0);
    },
  },
];
var wt;
(function (e) {
  ((e[(e.Pointer = 0)] = "Pointer"), (e[(e.DraggableRect = 1)] = "DraggableRect"));
})(wt || (wt = {}));
var Vt;
(function (e) {
  ((e[(e.TreeOrder = 0)] = "TreeOrder"), (e[(e.ReversedTreeOrder = 1)] = "ReversedTreeOrder"));
})(Vt || (Vt = {}));
function ja(e) {
  let {
    acceleration: t,
    activator: n = wt.Pointer,
    canScroll: s,
    draggingRect: o,
    enabled: a,
    interval: l = 5,
    order: i = Vt.TreeOrder,
    pointerCoordinates: d,
    scrollableAncestors: f,
    scrollableAncestorRects: u,
    delta: p,
    threshold: g,
  } = e;
  const x = ka({ delta: p, disabled: !a }),
    [C, y] = To(),
    j = c.useRef({ x: 0, y: 0 }),
    v = c.useRef({ x: 0, y: 0 }),
    A = c.useMemo(() => {
      switch (n) {
        case wt.Pointer:
          return d ? { top: d.y, bottom: d.y, left: d.x, right: d.x } : null;
        case wt.DraggableRect:
          return o;
      }
    }, [n, o, d]),
    D = c.useRef(null),
    E = c.useCallback(() => {
      const P = D.current;
      if (!P) return;
      const R = j.current.x * v.current.x,
        k = j.current.y * v.current.y;
      P.scrollBy(R, k);
    }, []),
    N = c.useMemo(() => (i === Vt.TreeOrder ? [...f].reverse() : f), [i, f]);
  c.useEffect(() => {
    if (!a || !f.length || !A) {
      y();
      return;
    }
    for (const P of N) {
      if (s?.(P) === !1) continue;
      const R = f.indexOf(P),
        k = u[R];
      if (!k) continue;
      const { direction: U, speed: H } = ca(P, k, A, t, g);
      for (const h of ["x", "y"]) x[h][U[h]] || ((H[h] = 0), (U[h] = 0));
      if (H.x > 0 || H.y > 0) {
        (y(), (D.current = P), C(E, l), (j.current = H), (v.current = U));
        return;
      }
    }
    ((j.current = { x: 0, y: 0 }), (v.current = { x: 0, y: 0 }), y());
  }, [t, E, s, y, a, l, JSON.stringify(A), JSON.stringify(x), C, f, N, u, JSON.stringify(g)]);
}
const Na = {
  x: { [ee.Backward]: !1, [ee.Forward]: !1 },
  y: { [ee.Backward]: !1, [ee.Forward]: !1 },
};
function ka(e) {
  let { delta: t, disabled: n } = e;
  const s = wn(t);
  return It(
    (o) => {
      if (n || !s || !o) return Na;
      const a = { x: Math.sign(t.x - s.x), y: Math.sign(t.y - s.y) };
      return {
        x: {
          [ee.Backward]: o.x[ee.Backward] || a.x === -1,
          [ee.Forward]: o.x[ee.Forward] || a.x === 1,
        },
        y: {
          [ee.Backward]: o.y[ee.Backward] || a.y === -1,
          [ee.Forward]: o.y[ee.Forward] || a.y === 1,
        },
      };
    },
    [n, t, s],
  );
}
function Sa(e, t) {
  const n = t != null ? e.get(t) : void 0,
    s = n ? n.node.current : null;
  return It(
    (o) => {
      var a;
      return t == null ? null : (a = s ?? o) != null ? a : null;
    },
    [s, t],
  );
}
function Ca(e, t) {
  return c.useMemo(
    () =>
      e.reduce((n, s) => {
        const { sensor: o } = s,
          a = o.activators.map((l) => ({ eventName: l.eventName, handler: t(l.handler, s) }));
        return [...n, ...a];
      }, []),
    [e, t],
  );
}
var Dt;
(function (e) {
  ((e[(e.Always = 0)] = "Always"),
    (e[(e.BeforeDragging = 1)] = "BeforeDragging"),
    (e[(e.WhileDragging = 2)] = "WhileDragging"));
})(Dt || (Dt = {}));
var kn;
(function (e) {
  e.Optimized = "optimized";
})(kn || (kn = {}));
const cr = new Map();
function Da(e, t) {
  let { dragging: n, dependencies: s, config: o } = t;
  const [a, l] = c.useState(null),
    { frequency: i, measure: d, strategy: f } = o,
    u = c.useRef(e),
    p = j(),
    g = kt(p),
    x = c.useCallback(
      function (v) {
        (v === void 0 && (v = []),
          !g.current && l((A) => (A === null ? v : A.concat(v.filter((D) => !A.includes(D))))));
      },
      [g],
    ),
    C = c.useRef(null),
    y = It(
      (v) => {
        if (p && !n) return cr;
        if (!v || v === cr || u.current !== e || a != null) {
          const A = new Map();
          for (let D of e) {
            if (!D) continue;
            if (a && a.length > 0 && !a.includes(D.id) && D.rect.current) {
              A.set(D.id, D.rect.current);
              continue;
            }
            const E = D.node.current,
              N = E ? new Bn(d(E), E) : null;
            ((D.rect.current = N), N && A.set(D.id, N));
          }
          return A;
        }
        return v;
      },
      [e, a, n, p, d],
    );
  return (
    c.useEffect(() => {
      u.current = e;
    }, [e]),
    c.useEffect(() => {
      p || x();
    }, [n, p]),
    c.useEffect(() => {
      a && a.length > 0 && l(null);
    }, [JSON.stringify(a)]),
    c.useEffect(() => {
      p ||
        typeof i != "number" ||
        C.current !== null ||
        (C.current = setTimeout(() => {
          (x(), (C.current = null));
        }, i));
    }, [i, p, x, ...s]),
    { droppableRects: y, measureDroppableContainers: x, measuringScheduled: a != null }
  );
  function j() {
    switch (f) {
      case Dt.Always:
        return !1;
      case Dt.BeforeDragging:
        return n;
      default:
        return !n;
    }
  }
}
function Xr(e, t) {
  return It((n) => (e ? n || (typeof t == "function" ? t(e) : e) : null), [t, e]);
}
function Ea(e, t) {
  return Xr(e, t);
}
function Ia(e) {
  let { callback: t, disabled: n } = e;
  const s = $n(t),
    o = c.useMemo(() => {
      if (n || typeof window > "u" || typeof window.MutationObserver > "u") return;
      const { MutationObserver: a } = window;
      return new a(s);
    }, [s, n]);
  return (c.useEffect(() => () => o?.disconnect(), [o]), o);
}
function Zt(e) {
  let { callback: t, disabled: n } = e;
  const s = $n(t),
    o = c.useMemo(() => {
      if (n || typeof window > "u" || typeof window.ResizeObserver > "u") return;
      const { ResizeObserver: a } = window;
      return new a(s);
    }, [n]);
  return (c.useEffect(() => () => o?.disconnect(), [o]), o);
}
function _a(e) {
  return new Bn(ut(e), e);
}
function dr(e, t, n) {
  t === void 0 && (t = _a);
  const [s, o] = c.useState(null);
  function a() {
    o((d) => {
      if (!e) return null;
      if (e.isConnected === !1) {
        var f;
        return (f = d ?? n) != null ? f : null;
      }
      const u = t(e);
      return JSON.stringify(d) === JSON.stringify(u) ? d : u;
    });
  }
  const l = Ia({
      callback(d) {
        if (e)
          for (const f of d) {
            const { type: u, target: p } = f;
            if (u === "childList" && p instanceof HTMLElement && p.contains(e)) {
              a();
              break;
            }
          }
      },
    }),
    i = Zt({ callback: a });
  return (
    Re(() => {
      (a(),
        e
          ? (i?.observe(e), l?.observe(document.body, { childList: !0, subtree: !0 }))
          : (i?.disconnect(), l?.disconnect()));
    }, [e]),
    s
  );
}
function Ra(e) {
  const t = Xr(e);
  return Br(e, t);
}
const ur = [];
function Aa(e) {
  const t = c.useRef(e),
    n = It(
      (s) =>
        e
          ? s && s !== ur && e && t.current && e.parentNode === t.current.parentNode
            ? s
            : Qt(e)
          : ur,
      [e],
    );
  return (
    c.useEffect(() => {
      t.current = e;
    }, [e]),
    n
  );
}
function Ma(e) {
  const [t, n] = c.useState(null),
    s = c.useRef(e),
    o = c.useCallback((a) => {
      const l = un(a.target);
      l && n((i) => (i ? (i.set(l, jn(l)), new Map(i)) : null));
    }, []);
  return (
    c.useEffect(() => {
      const a = s.current;
      if (e !== a) {
        l(a);
        const i = e
          .map((d) => {
            const f = un(d);
            return f ? (f.addEventListener("scroll", o, { passive: !0 }), [f, jn(f)]) : null;
          })
          .filter((d) => d != null);
        (n(i.length ? new Map(i) : null), (s.current = e));
      }
      return () => {
        (l(e), l(a));
      };
      function l(i) {
        i.forEach((d) => {
          const f = un(d);
          f?.removeEventListener("scroll", o);
        });
      }
    }, [o, e]),
    c.useMemo(
      () => (e.length ? (t ? Array.from(t.values()).reduce((a, l) => at(a, l), Se) : Kr(e)) : Se),
      [e, t],
    )
  );
}
function fr(e, t) {
  t === void 0 && (t = []);
  const n = c.useRef(null);
  return (
    c.useEffect(() => {
      n.current = null;
    }, t),
    c.useEffect(() => {
      const s = e !== Se;
      (s && !n.current && (n.current = e), !s && n.current && (n.current = null));
    }, [e]),
    n.current ? St(e, n.current) : Se
  );
}
function Ta(e) {
  c.useEffect(
    () => {
      if (!Yt) return;
      const t = e.map((n) => {
        let { sensor: s } = n;
        return s.setup == null ? void 0 : s.setup();
      });
      return () => {
        for (const n of t) n?.();
      };
    },
    e.map((t) => {
      let { sensor: n } = t;
      return n;
    }),
  );
}
function Pa(e, t) {
  return c.useMemo(
    () =>
      e.reduce((n, s) => {
        let { eventName: o, handler: a } = s;
        return (
          (n[o] = (l) => {
            a(l, t);
          }),
          n
        );
      }, {}),
    [e, t],
  );
}
function Gr(e) {
  return c.useMemo(() => (e ? oa(e) : null), [e]);
}
const mr = [];
function Oa(e, t) {
  t === void 0 && (t = ut);
  const [n] = e,
    s = Gr(n ? me(n) : null),
    [o, a] = c.useState(mr);
  function l() {
    a(() => (e.length ? e.map((d) => (qr(d) ? s : new Bn(t(d), d))) : mr));
  }
  const i = Zt({ callback: l });
  return (
    Re(() => {
      (i?.disconnect(), l(), e.forEach((d) => i?.observe(d)));
    }, [e]),
    o
  );
}
function La(e) {
  if (!e) return null;
  if (e.children.length > 1) return e;
  const t = e.children[0];
  return Et(t) ? t : e;
}
function Wa(e) {
  let { measure: t } = e;
  const [n, s] = c.useState(null),
    o = c.useCallback(
      (f) => {
        for (const { target: u } of f)
          if (Et(u)) {
            s((p) => {
              const g = t(u);
              return p ? { ...p, width: g.width, height: g.height } : g;
            });
            break;
          }
      },
      [t],
    ),
    a = Zt({ callback: o }),
    l = c.useCallback(
      (f) => {
        const u = La(f);
        (a?.disconnect(), u && a?.observe(u), s(u ? t(u) : null));
      },
      [t, a],
    ),
    [i, d] = Ht(l);
  return c.useMemo(() => ({ nodeRef: i, rect: n, setRef: d }), [n, i, d]);
}
const $a = [
    { sensor: Hn, options: {} },
    { sensor: Fn, options: {} },
  ],
  za = { current: {} },
  zt = {
    draggable: { measure: or },
    droppable: { measure: or, strategy: Dt.WhileDragging, frequency: kn.Optimized },
    dragOverlay: { measure: ut },
  };
class yt extends Map {
  get(t) {
    var n;
    return t != null && (n = super.get(t)) != null ? n : void 0;
  }
  toArray() {
    return Array.from(this.values());
  }
  getEnabled() {
    return this.toArray().filter((t) => {
      let { disabled: n } = t;
      return !n;
    });
  }
  getNodeFor(t) {
    var n, s;
    return (n = (s = this.get(t)) == null ? void 0 : s.node.current) != null ? n : void 0;
  }
}
const Ba = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: new Map(),
    droppableRects: new Map(),
    droppableContainers: new yt(),
    over: null,
    dragOverlay: { nodeRef: { current: null }, rect: null, setRef: qt },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measuringConfiguration: zt,
    measureDroppableContainers: qt,
    windowRect: null,
    measuringScheduled: !1,
  },
  Fa = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: { draggable: "" },
    dispatch: qt,
    draggableNodes: new Map(),
    over: null,
    measureDroppableContainers: qt,
  },
  en = c.createContext(Fa),
  Yr = c.createContext(Ba);
function Ua() {
  return {
    draggable: {
      active: null,
      initialCoordinates: { x: 0, y: 0 },
      nodes: new Map(),
      translate: { x: 0, y: 0 },
    },
    droppable: { containers: new yt() },
  };
}
function Ha(e, t) {
  switch (t.type) {
    case Z.DragStart:
      return {
        ...e,
        draggable: { ...e.draggable, initialCoordinates: t.initialCoordinates, active: t.active },
      };
    case Z.DragMove:
      return e.draggable.active == null
        ? e
        : {
            ...e,
            draggable: {
              ...e.draggable,
              translate: {
                x: t.coordinates.x - e.draggable.initialCoordinates.x,
                y: t.coordinates.y - e.draggable.initialCoordinates.y,
              },
            },
          };
    case Z.DragEnd:
    case Z.DragCancel:
      return {
        ...e,
        draggable: {
          ...e.draggable,
          active: null,
          initialCoordinates: { x: 0, y: 0 },
          translate: { x: 0, y: 0 },
        },
      };
    case Z.RegisterDroppable: {
      const { element: n } = t,
        { id: s } = n,
        o = new yt(e.droppable.containers);
      return (o.set(s, n), { ...e, droppable: { ...e.droppable, containers: o } });
    }
    case Z.SetDroppableDisabled: {
      const { id: n, key: s, disabled: o } = t,
        a = e.droppable.containers.get(n);
      if (!a || s !== a.key) return e;
      const l = new yt(e.droppable.containers);
      return (
        l.set(n, { ...a, disabled: o }),
        { ...e, droppable: { ...e.droppable, containers: l } }
      );
    }
    case Z.UnregisterDroppable: {
      const { id: n, key: s } = t,
        o = e.droppable.containers.get(n);
      if (!o || s !== o.key) return e;
      const a = new yt(e.droppable.containers);
      return (a.delete(n), { ...e, droppable: { ...e.droppable, containers: a } });
    }
    default:
      return e;
  }
}
function qa(e) {
  let { disabled: t } = e;
  const { active: n, activatorEvent: s, draggableNodes: o } = c.useContext(en),
    a = wn(s),
    l = wn(n?.id);
  return (
    c.useEffect(() => {
      if (!t && !s && a && l != null) {
        if (!zn(a) || document.activeElement === a.target) return;
        const i = o.get(l);
        if (!i) return;
        const { activatorNode: d, node: f } = i;
        if (!d.current && !f.current) return;
        requestAnimationFrame(() => {
          for (const u of [d.current, f.current]) {
            if (!u) continue;
            const p = Lo(u);
            if (p) {
              p.focus();
              break;
            }
          }
        });
      }
    }, [s, t, o, l, a]),
    null
  );
}
function Va(e, t) {
  let { transform: n, ...s } = t;
  return e != null && e.length ? e.reduce((o, a) => a({ transform: o, ...s }), n) : n;
}
function Ka(e) {
  return c.useMemo(
    () => ({
      draggable: { ...zt.draggable, ...e?.draggable },
      droppable: { ...zt.droppable, ...e?.droppable },
      dragOverlay: { ...zt.dragOverlay, ...e?.dragOverlay },
    }),
    [e?.draggable, e?.droppable, e?.dragOverlay],
  );
}
function Ja(e) {
  let { activeNode: t, measure: n, initialRect: s, config: o = !0 } = e;
  const a = c.useRef(!1),
    { x: l, y: i } = typeof o == "boolean" ? { x: o, y: o } : o;
  Re(() => {
    if ((!l && !i) || !t) {
      a.current = !1;
      return;
    }
    if (a.current || !s) return;
    const f = t?.node.current;
    if (!f || f.isConnected === !1) return;
    const u = n(f),
      p = Br(u, s);
    if (
      (l || (p.x = 0), i || (p.y = 0), (a.current = !0), Math.abs(p.x) > 0 || Math.abs(p.y) > 0)
    ) {
      const g = Fr(f);
      g && g.scrollBy({ top: p.y, left: p.x });
    }
  }, [t, l, i, s, n]);
}
const Qr = c.createContext({ ...Se, scaleX: 1, scaleY: 1 });
var Ge;
(function (e) {
  ((e[(e.Uninitialized = 0)] = "Uninitialized"),
    (e[(e.Initializing = 1)] = "Initializing"),
    (e[(e.Initialized = 2)] = "Initialized"));
})(Ge || (Ge = {}));
const Xa = c.memo(function (t) {
    var n, s, o, a;
    let {
      id: l,
      accessibility: i,
      autoScroll: d = !0,
      children: f,
      sensors: u = $a,
      collisionDetection: p = Qo,
      measuring: g,
      modifiers: x,
      ...C
    } = t;
    const y = c.useReducer(Ha, void 0, Ua),
      [j, v] = y,
      [A, D] = Uo(),
      [E, N] = c.useState(Ge.Uninitialized),
      P = E === Ge.Initialized,
      {
        draggable: { active: R, nodes: k, translate: U },
        droppable: { containers: H },
      } = j,
      h = R != null ? k.get(R) : null,
      z = c.useRef({ initial: null, translated: null }),
      S = c.useMemo(() => {
        var ae;
        return R != null ? { id: R, data: (ae = h?.data) != null ? ae : za, rect: z } : null;
      }, [R, h]),
      M = c.useRef(null),
      [b, V] = c.useState(null),
      [T, pe] = c.useState(null),
      te = kt(C, Object.values(C)),
      we = _t("DndDescribedBy", l),
      Ce = c.useMemo(() => H.getEnabled(), [H]),
      Q = Ka(g),
      {
        droppableRects: ce,
        measureDroppableContainers: w,
        measuringScheduled: q,
      } = Da(Ce, { dragging: P, dependencies: [U.x, U.y], config: Q.droppable }),
      L = Sa(k, R),
      ne = c.useMemo(() => (T ? yn(T) : null), [T]),
      he = cs(),
      oe = Ea(L, Q.draggable.measure);
    Ja({
      activeNode: R != null ? k.get(R) : null,
      config: he.layoutShiftCompensation,
      initialRect: oe,
      measure: Q.draggable.measure,
    });
    const W = dr(L, Q.draggable.measure, oe),
      re = dr(L ? L.parentElement : null),
      G = c.useRef({
        activatorEvent: null,
        active: null,
        activeNode: L,
        collisionRect: null,
        collisions: null,
        droppableRects: ce,
        draggableNodes: k,
        draggingNode: null,
        draggingNodeRect: null,
        droppableContainers: H,
        over: null,
        scrollableAncestors: [],
        scrollAdjustedTranslate: null,
      }),
      De = H.getNodeFor((n = G.current.over) == null ? void 0 : n.id),
      ye = Wa({ measure: Q.dragOverlay.measure }),
      Te = (s = ye.nodeRef.current) != null ? s : L,
      Pe = P ? ((o = ye.rect) != null ? o : W) : null,
      Rt = !!(ye.nodeRef.current && ye.rect),
      Fe = Ra(Rt ? null : W),
      m = Gr(Te ? me(Te) : null),
      I = Aa(P ? (De ?? L) : null),
      O = Oa(I),
      K = Va(x, {
        transform: { x: U.x - Fe.x, y: U.y - Fe.y, scaleX: 1, scaleY: 1 },
        activatorEvent: T,
        active: S,
        activeNodeRect: W,
        containerNodeRect: re,
        draggingNodeRect: Pe,
        over: G.current.over,
        overlayNodeRect: ye.rect,
        scrollableAncestors: I,
        scrollableAncestorRects: O,
        windowRect: m,
      }),
      le = ne ? at(ne, U) : null,
      Ue = Ma(I),
      At = fr(Ue),
      Mt = fr(Ue, [W]),
      J = at(K, At),
      He = Pe ? ta(Pe, K) : null,
      ft =
        S && He
          ? p({
              active: S,
              collisionRect: He,
              droppableRects: ce,
              droppableContainers: Ce,
              pointerCoordinates: le,
            })
          : null,
      Kn = zr(ft, "id"),
      [qe, Jn] = c.useState(null),
      ss = Rt ? K : at(K, Mt),
      os = Zo(ss, (a = qe?.rect) != null ? a : null, W),
      tn = c.useRef(null),
      Xn = c.useCallback(
        (ae, ge) => {
          let { sensor: xe, options: Ve } = ge;
          if (M.current == null) return;
          const je = k.get(M.current);
          if (!je) return;
          const be = ae.nativeEvent,
            Ee = new xe({
              active: M.current,
              activeNode: je,
              event: be,
              options: Ve,
              context: G,
              onAbort(se) {
                if (!k.get(se)) return;
                const { onDragAbort: Ie } = te.current,
                  Oe = { id: se };
                (Ie?.(Oe), A({ type: "onDragAbort", event: Oe }));
              },
              onPending(se, Ke, Ie, Oe) {
                if (!k.get(se)) return;
                const { onDragPending: pt } = te.current,
                  Je = { id: se, constraint: Ke, initialCoordinates: Ie, offset: Oe };
                (pt?.(Je), A({ type: "onDragPending", event: Je }));
              },
              onStart(se) {
                const Ke = M.current;
                if (Ke == null) return;
                const Ie = k.get(Ke);
                if (!Ie) return;
                const { onDragStart: Oe } = te.current,
                  mt = { activatorEvent: be, active: { id: Ke, data: Ie.data, rect: z } };
                gt.unstable_batchedUpdates(() => {
                  (Oe?.(mt),
                    N(Ge.Initializing),
                    v({ type: Z.DragStart, initialCoordinates: se, active: Ke }),
                    A({ type: "onDragStart", event: mt }),
                    V(tn.current),
                    pe(be));
                });
              },
              onMove(se) {
                v({ type: Z.DragMove, coordinates: se });
              },
              onEnd: tt(Z.DragEnd),
              onCancel: tt(Z.DragCancel),
            });
          tn.current = Ee;
          function tt(se) {
            return async function () {
              const {
                active: Ie,
                collisions: Oe,
                over: mt,
                scrollAdjustedTranslate: pt,
              } = G.current;
              let Je = null;
              if (Ie && pt) {
                const { cancelDrop: ht } = te.current;
                ((Je = { activatorEvent: be, active: Ie, collisions: Oe, delta: pt, over: mt }),
                  se === Z.DragEnd &&
                    typeof ht == "function" &&
                    (await Promise.resolve(ht(Je))) &&
                    (se = Z.DragCancel));
              }
              ((M.current = null),
                gt.unstable_batchedUpdates(() => {
                  (v({ type: se }),
                    N(Ge.Uninitialized),
                    Jn(null),
                    V(null),
                    pe(null),
                    (tn.current = null));
                  const ht = se === Z.DragEnd ? "onDragEnd" : "onDragCancel";
                  if (Je) {
                    const nn = te.current[ht];
                    (nn?.(Je), A({ type: ht, event: Je }));
                  }
                }));
            };
          }
        },
        [k],
      ),
      as = c.useCallback(
        (ae, ge) => (xe, Ve) => {
          const je = xe.nativeEvent,
            be = k.get(Ve);
          if (M.current !== null || !be || je.dndKit || je.defaultPrevented) return;
          const Ee = { active: be };
          ae(xe, ge.options, Ee) === !0 &&
            ((je.dndKit = { capturedBy: ge.sensor }), (M.current = Ve), Xn(xe, ge));
        },
        [k, Xn],
      ),
      Gn = Ca(u, as);
    (Ta(u),
      Re(() => {
        W && E === Ge.Initializing && N(Ge.Initialized);
      }, [W, E]),
      c.useEffect(() => {
        const { onDragMove: ae } = te.current,
          { active: ge, activatorEvent: xe, collisions: Ve, over: je } = G.current;
        if (!ge || !xe) return;
        const be = {
          active: ge,
          activatorEvent: xe,
          collisions: Ve,
          delta: { x: J.x, y: J.y },
          over: je,
        };
        gt.unstable_batchedUpdates(() => {
          (ae?.(be), A({ type: "onDragMove", event: be }));
        });
      }, [J.x, J.y]),
      c.useEffect(() => {
        const {
          active: ae,
          activatorEvent: ge,
          collisions: xe,
          droppableContainers: Ve,
          scrollAdjustedTranslate: je,
        } = G.current;
        if (!ae || M.current == null || !ge || !je) return;
        const { onDragOver: be } = te.current,
          Ee = Ve.get(Kn),
          tt =
            Ee && Ee.rect.current
              ? { id: Ee.id, rect: Ee.rect.current, data: Ee.data, disabled: Ee.disabled }
              : null,
          se = {
            active: ae,
            activatorEvent: ge,
            collisions: xe,
            delta: { x: je.x, y: je.y },
            over: tt,
          };
        gt.unstable_batchedUpdates(() => {
          (Jn(tt), be?.(se), A({ type: "onDragOver", event: se }));
        });
      }, [Kn]),
      Re(() => {
        ((G.current = {
          activatorEvent: T,
          active: S,
          activeNode: L,
          collisionRect: He,
          collisions: ft,
          droppableRects: ce,
          draggableNodes: k,
          draggingNode: Te,
          draggingNodeRect: Pe,
          droppableContainers: H,
          over: qe,
          scrollableAncestors: I,
          scrollAdjustedTranslate: J,
        }),
          (z.current = { initial: Pe, translated: He }));
      }, [S, L, ft, He, k, Te, Pe, ce, H, qe, I, J]),
      ja({
        ...he,
        delta: U,
        draggingRect: He,
        pointerCoordinates: le,
        scrollableAncestors: I,
        scrollableAncestorRects: O,
      }));
    const is = c.useMemo(
        () => ({
          active: S,
          activeNode: L,
          activeNodeRect: W,
          activatorEvent: T,
          collisions: ft,
          containerNodeRect: re,
          dragOverlay: ye,
          draggableNodes: k,
          droppableContainers: H,
          droppableRects: ce,
          over: qe,
          measureDroppableContainers: w,
          scrollableAncestors: I,
          scrollableAncestorRects: O,
          measuringConfiguration: Q,
          measuringScheduled: q,
          windowRect: m,
        }),
        [S, L, W, T, ft, re, ye, k, H, ce, qe, w, I, O, Q, q, m],
      ),
      ls = c.useMemo(
        () => ({
          activatorEvent: T,
          activators: Gn,
          active: S,
          activeNodeRect: W,
          ariaDescribedById: { draggable: we },
          dispatch: v,
          draggableNodes: k,
          over: qe,
          measureDroppableContainers: w,
        }),
        [T, Gn, S, W, v, we, k, qe, w],
      );
    return ue.createElement(
      Lr.Provider,
      { value: D },
      ue.createElement(
        en.Provider,
        { value: ls },
        ue.createElement(
          Yr.Provider,
          { value: is },
          ue.createElement(Qr.Provider, { value: os }, f),
        ),
        ue.createElement(qa, { disabled: i?.restoreFocus === !1 }),
      ),
      ue.createElement(Vo, { ...i, hiddenTextDescribedById: we }),
    );
    function cs() {
      const ae = b?.autoScrollEnabled === !1,
        ge = typeof d == "object" ? d.enabled === !1 : d === !1,
        xe = P && !ae && !ge;
      return typeof d == "object" ? { ...d, enabled: xe } : { enabled: xe };
    }
  }),
  Ga = c.createContext(null),
  pr = "button",
  Ya = "Draggable";
function Qa(e) {
  let { id: t, data: n, disabled: s = !1, attributes: o } = e;
  const a = _t(Ya),
    {
      activators: l,
      activatorEvent: i,
      active: d,
      activeNodeRect: f,
      ariaDescribedById: u,
      draggableNodes: p,
      over: g,
    } = c.useContext(en),
    { role: x = pr, roleDescription: C = "draggable", tabIndex: y = 0 } = o ?? {},
    j = d?.id === t,
    v = c.useContext(j ? Qr : Ga),
    [A, D] = Ht(),
    [E, N] = Ht(),
    P = Pa(l, t),
    R = kt(n);
  Re(
    () => (
      p.set(t, { id: t, key: a, node: A, activatorNode: E, data: R }),
      () => {
        const U = p.get(t);
        U && U.key === a && p.delete(t);
      }
    ),
    [p, t],
  );
  const k = c.useMemo(
    () => ({
      role: x,
      tabIndex: y,
      "aria-disabled": s,
      "aria-pressed": j && x === pr ? !0 : void 0,
      "aria-roledescription": C,
      "aria-describedby": u.draggable,
    }),
    [s, x, y, j, C, u.draggable],
  );
  return {
    active: d,
    activatorEvent: i,
    activeNodeRect: f,
    attributes: k,
    isDragging: j,
    listeners: s ? void 0 : P,
    node: A,
    over: g,
    setNodeRef: D,
    setActivatorNodeRef: N,
    transform: v,
  };
}
function Za() {
  return c.useContext(Yr);
}
const ei = "Droppable",
  ti = { timeout: 25 };
function ni(e) {
  let { data: t, disabled: n = !1, id: s, resizeObserverConfig: o } = e;
  const a = _t(ei),
    { active: l, dispatch: i, over: d, measureDroppableContainers: f } = c.useContext(en),
    u = c.useRef({ disabled: n }),
    p = c.useRef(!1),
    g = c.useRef(null),
    x = c.useRef(null),
    { disabled: C, updateMeasurementsFor: y, timeout: j } = { ...ti, ...o },
    v = kt(y ?? s),
    A = c.useCallback(() => {
      if (!p.current) {
        p.current = !0;
        return;
      }
      (x.current != null && clearTimeout(x.current),
        (x.current = setTimeout(() => {
          (f(Array.isArray(v.current) ? v.current : [v.current]), (x.current = null));
        }, j)));
    }, [j]),
    D = Zt({ callback: A, disabled: C || !l }),
    E = c.useCallback(
      (k, U) => {
        D && (U && (D.unobserve(U), (p.current = !1)), k && D.observe(k));
      },
      [D],
    ),
    [N, P] = Ht(E),
    R = kt(t);
  return (
    c.useEffect(() => {
      !D || !N.current || (D.disconnect(), (p.current = !1), D.observe(N.current));
    }, [N, D]),
    c.useEffect(
      () => (
        i({
          type: Z.RegisterDroppable,
          element: { id: s, key: a, disabled: n, node: N, rect: g, data: R },
        }),
        () => i({ type: Z.UnregisterDroppable, key: a, id: s })
      ),
      [s],
    ),
    c.useEffect(() => {
      n !== u.current.disabled &&
        (i({ type: Z.SetDroppableDisabled, id: s, key: a, disabled: n }), (u.current.disabled = n));
    }, [s, a, n, i]),
    { active: l, rect: g, isOver: d?.id === s, node: N, over: d, setNodeRef: P }
  );
}
function qn(e, t, n) {
  const s = e.slice();
  return (s.splice(n < 0 ? s.length + n : n, 0, s.splice(t, 1)[0]), s);
}
function ri(e, t) {
  return e.reduce((n, s, o) => {
    const a = t.get(s);
    return (a && (n[o] = a), n);
  }, Array(e.length));
}
function Ot(e) {
  return e !== null && e >= 0;
}
function si(e, t) {
  if (e === t) return !0;
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function oi(e) {
  return typeof e == "boolean" ? { draggable: e, droppable: e } : e;
}
const Zr = (e) => {
    let { rects: t, activeIndex: n, overIndex: s, index: o } = e;
    const a = qn(t, s, n),
      l = t[o],
      i = a[o];
    return !i || !l
      ? null
      : {
          x: i.left - l.left,
          y: i.top - l.top,
          scaleX: i.width / l.width,
          scaleY: i.height / l.height,
        };
  },
  Lt = { scaleX: 1, scaleY: 1 },
  ai = (e) => {
    var t;
    let { activeIndex: n, activeNodeRect: s, index: o, rects: a, overIndex: l } = e;
    const i = (t = a[n]) != null ? t : s;
    if (!i) return null;
    if (o === n) {
      const f = a[l];
      return f
        ? { x: 0, y: n < l ? f.top + f.height - (i.top + i.height) : f.top - i.top, ...Lt }
        : null;
    }
    const d = ii(a, o, n);
    return o > n && o <= l
      ? { x: 0, y: -i.height - d, ...Lt }
      : o < n && o >= l
        ? { x: 0, y: i.height + d, ...Lt }
        : { x: 0, y: 0, ...Lt };
  };
function ii(e, t, n) {
  const s = e[t],
    o = e[t - 1],
    a = e[t + 1];
  return s
    ? n < t
      ? o
        ? s.top - (o.top + o.height)
        : a
          ? a.top - (s.top + s.height)
          : 0
      : a
        ? a.top - (s.top + s.height)
        : o
          ? s.top - (o.top + o.height)
          : 0
    : 0;
}
const es = "Sortable",
  ts = ue.createContext({
    activeIndex: -1,
    containerId: es,
    disableTransforms: !1,
    items: [],
    overIndex: -1,
    useDragOverlay: !1,
    sortedRects: [],
    strategy: Zr,
    disabled: { draggable: !1, droppable: !1 },
  });
function li(e) {
  let { children: t, id: n, items: s, strategy: o = Zr, disabled: a = !1 } = e;
  const {
      active: l,
      dragOverlay: i,
      droppableRects: d,
      over: f,
      measureDroppableContainers: u,
    } = Za(),
    p = _t(es, n),
    g = i.rect !== null,
    x = c.useMemo(() => s.map((P) => (typeof P == "object" && "id" in P ? P.id : P)), [s]),
    C = l != null,
    y = l ? x.indexOf(l.id) : -1,
    j = f ? x.indexOf(f.id) : -1,
    v = c.useRef(x),
    A = !si(x, v.current),
    D = (j !== -1 && y === -1) || A,
    E = oi(a);
  (Re(() => {
    A && C && u(x);
  }, [A, x, C, u]),
    c.useEffect(() => {
      v.current = x;
    }, [x]));
  const N = c.useMemo(
    () => ({
      activeIndex: y,
      containerId: p,
      disabled: E,
      disableTransforms: D,
      items: x,
      overIndex: j,
      useDragOverlay: g,
      sortedRects: ri(x, d),
      strategy: o,
    }),
    [y, p, E.draggable, E.droppable, D, x, j, d, g, o],
  );
  return ue.createElement(ts.Provider, { value: N }, t);
}
const ci = (e) => {
    let { id: t, items: n, activeIndex: s, overIndex: o } = e;
    return qn(n, s, o).indexOf(t);
  },
  di = (e) => {
    let {
      containerId: t,
      isSorting: n,
      wasDragging: s,
      index: o,
      items: a,
      newIndex: l,
      previousItems: i,
      previousContainerId: d,
      transition: f,
    } = e;
    return !f || !s || (i !== a && o === l) ? !1 : n ? !0 : l !== o && t === d;
  },
  ui = { duration: 200, easing: "ease" },
  ns = "transform",
  fi = Ct.Transition.toString({ property: ns, duration: 0, easing: "linear" }),
  mi = { roleDescription: "sortable" };
function pi(e) {
  let { disabled: t, index: n, node: s, rect: o } = e;
  const [a, l] = c.useState(null),
    i = c.useRef(n);
  return (
    Re(() => {
      if (!t && n !== i.current && s.current) {
        const d = o.current;
        if (d) {
          const f = ut(s.current, { ignoreTransform: !0 }),
            u = {
              x: d.left - f.left,
              y: d.top - f.top,
              scaleX: d.width / f.width,
              scaleY: d.height / f.height,
            };
          (u.x || u.y) && l(u);
        }
      }
      n !== i.current && (i.current = n);
    }, [t, n, s, o]),
    c.useEffect(() => {
      a && l(null);
    }, [a]),
    a
  );
}
function hi(e) {
  let {
    animateLayoutChanges: t = di,
    attributes: n,
    disabled: s,
    data: o,
    getNewIndex: a = ci,
    id: l,
    strategy: i,
    resizeObserverConfig: d,
    transition: f = ui,
  } = e;
  const {
      items: u,
      containerId: p,
      activeIndex: g,
      disabled: x,
      disableTransforms: C,
      sortedRects: y,
      overIndex: j,
      useDragOverlay: v,
      strategy: A,
    } = c.useContext(ts),
    D = gi(s, x),
    E = u.indexOf(l),
    N = c.useMemo(() => ({ sortable: { containerId: p, index: E, items: u }, ...o }), [p, o, E, u]),
    P = c.useMemo(() => u.slice(u.indexOf(l)), [u, l]),
    {
      rect: R,
      node: k,
      isOver: U,
      setNodeRef: H,
    } = ni({
      id: l,
      data: N,
      disabled: D.droppable,
      resizeObserverConfig: { updateMeasurementsFor: P, ...d },
    }),
    {
      active: h,
      activatorEvent: z,
      activeNodeRect: S,
      attributes: M,
      setNodeRef: b,
      listeners: V,
      isDragging: T,
      over: pe,
      setActivatorNodeRef: te,
      transform: we,
    } = Qa({ id: l, data: N, attributes: { ...mi, ...n }, disabled: D.draggable }),
    Ce = Mo(H, b),
    Q = !!h,
    ce = Q && !C && Ot(g) && Ot(j),
    w = !v && T,
    q = w && ce ? we : null,
    ne = ce
      ? (q ?? (i ?? A)({ rects: y, activeNodeRect: S, activeIndex: g, overIndex: j, index: E }))
      : null,
    he = Ot(g) && Ot(j) ? a({ id: l, items: u, activeIndex: g, overIndex: j }) : E,
    oe = h?.id,
    W = c.useRef({ activeId: oe, items: u, newIndex: he, containerId: p }),
    re = u !== W.current.items,
    G = t({
      active: h,
      containerId: p,
      isDragging: T,
      isSorting: Q,
      id: l,
      index: E,
      items: u,
      newIndex: W.current.newIndex,
      previousItems: W.current.items,
      previousContainerId: W.current.containerId,
      transition: f,
      wasDragging: W.current.activeId != null,
    }),
    De = pi({ disabled: !G, index: E, node: k, rect: R });
  return (
    c.useEffect(() => {
      (Q && W.current.newIndex !== he && (W.current.newIndex = he),
        p !== W.current.containerId && (W.current.containerId = p),
        u !== W.current.items && (W.current.items = u));
    }, [Q, he, p, u]),
    c.useEffect(() => {
      if (oe === W.current.activeId) return;
      if (oe != null && W.current.activeId == null) {
        W.current.activeId = oe;
        return;
      }
      const Te = setTimeout(() => {
        W.current.activeId = oe;
      }, 50);
      return () => clearTimeout(Te);
    }, [oe]),
    {
      active: h,
      activeIndex: g,
      attributes: M,
      data: N,
      rect: R,
      index: E,
      newIndex: he,
      items: u,
      isOver: U,
      isSorting: Q,
      isDragging: T,
      listeners: V,
      node: k,
      overIndex: j,
      over: pe,
      setNodeRef: Ce,
      setActivatorNodeRef: te,
      setDroppableNodeRef: H,
      setDraggableNodeRef: b,
      transform: De ?? ne,
      transition: ye(),
    }
  );
  function ye() {
    if (De || (re && W.current.newIndex === E)) return fi;
    if (!((w && !zn(z)) || !f) && (Q || G)) return Ct.Transition.toString({ ...f, property: ns });
  }
}
function gi(e, t) {
  var n, s;
  return typeof e == "boolean"
    ? { draggable: e, droppable: !1 }
    : {
        draggable: (n = e?.draggable) != null ? n : t.draggable,
        droppable: (s = e?.droppable) != null ? s : t.droppable,
      };
}
function Kt(e) {
  if (!e) return !1;
  const t = e.data.current;
  return !!(
    t &&
    "sortable" in t &&
    typeof t.sortable == "object" &&
    "containerId" in t.sortable &&
    "items" in t.sortable &&
    "index" in t.sortable
  );
}
const xi = [B.Down, B.Right, B.Up, B.Left],
  bi = (e, t) => {
    let {
      context: {
        active: n,
        collisionRect: s,
        droppableRects: o,
        droppableContainers: a,
        over: l,
        scrollableAncestors: i,
      },
    } = t;
    if (xi.includes(e.code)) {
      if ((e.preventDefault(), !n || !s)) return;
      const d = [];
      a.getEnabled().forEach((p) => {
        if (!p || (p != null && p.disabled)) return;
        const g = o.get(p.id);
        if (g)
          switch (e.code) {
            case B.Down:
              s.top < g.top && d.push(p);
              break;
            case B.Up:
              s.top > g.top && d.push(p);
              break;
            case B.Left:
              s.left > g.left && d.push(p);
              break;
            case B.Right:
              s.left < g.left && d.push(p);
              break;
          }
      });
      const f = Go({ collisionRect: s, droppableRects: o, droppableContainers: d });
      let u = zr(f, "id");
      if ((u === l?.id && f.length > 1 && (u = f[1].id), u != null)) {
        const p = a.get(n.id),
          g = a.get(u),
          x = g ? o.get(g.id) : null,
          C = g?.node.current;
        if (C && x && p && g) {
          const j = Qt(C).some((P, R) => i[R] !== P),
            v = rs(p, g),
            A = vi(p, g),
            D =
              j || !v
                ? { x: 0, y: 0 }
                : { x: A ? s.width - x.width : 0, y: A ? s.height - x.height : 0 },
            E = { x: x.left, y: x.top };
          return D.x && D.y ? E : St(E, D);
        }
      }
    }
  };
function rs(e, t) {
  return !Kt(e) || !Kt(t)
    ? !1
    : e.data.current.sortable.containerId === t.data.current.sortable.containerId;
}
function vi(e, t) {
  return !Kt(e) || !Kt(t) || !rs(e, t)
    ? !1
    : e.data.current.sortable.index < t.data.current.sortable.index;
}
function wi({
  item: e,
  idx: t,
  total: n,
  selected: s,
  isNext: o,
  isLast: a,
  disabled: l,
  onSelect: i,
}) {
  const {
      attributes: d,
      listeners: f,
      setNodeRef: u,
      transform: p,
      transition: g,
      isDragging: x,
    } = hi({ id: e.id, disabled: l }),
    C = { transform: Ct.Transform.toString(p), transition: g },
    y = Ro(e),
    j = Tr(e),
    v = Pn(e.kind),
    A = v.Icon,
    D = _o(e),
    E = e.status === "done";
  return r.jsxs("li", {
    ref: u,
    style: C,
    className: X("relative flex gap-3", x && "z-20 opacity-90"),
    children: [
      r.jsxs("div", {
        className: "relative flex w-10 shrink-0 flex-col items-center self-stretch",
        children: [
          a
            ? null
            : r.jsx("span", {
                "aria-hidden": !0,
                className: X(
                  "absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2",
                  E ? v.rail : "bg-border/60",
                ),
              }),
          r.jsxs("button", {
            type: "button",
            title: o ? `Siguiente a ejecutar · paso ${t + 1}` : `Abrir paso ${t + 1}`,
            onClick: i,
            className: X(
              "relative z-[1] mt-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110",
              v.node,
              s && "scale-110",
              o &&
                !s &&
                "ring-2 ring-primary/70 ring-offset-2 ring-offset-background animate-pulse",
            ),
            children: [
              r.jsx(A, { className: "h-4 w-4" }),
              r.jsx("span", {
                className:
                  "absolute -bottom-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-background px-0.5 text-[9px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60",
                children: t + 1,
              }),
            ],
          }),
        ],
      }),
      r.jsx("div", {
        role: "button",
        tabIndex: 0,
        title: "Clic para ver detalle del paso",
        onClick: i,
        onKeyDown: (N) => {
          (N.key === "Enter" || N.key === " ") && (N.preventDefault(), i());
        },
        className: X(
          "group min-w-0 flex-1 mb-4 rounded-2xl border px-3.5 py-3 transition-all cursor-pointer",
          "bg-background/55 backdrop-blur-sm",
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          s ? X(v.selectedBg) : "border-border/40 hover:border-border/80 hover:bg-background/80",
          x && "shadow-lg shadow-black/30 border-primary/40",
        ),
        children: r.jsxs("div", {
          className: "flex items-start gap-2",
          children: [
            r.jsx("button", {
              type: "button",
              className: X(
                "mt-0.5 inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground",
                "hover:bg-muted/60 hover:text-foreground active:cursor-grabbing",
                l && "opacity-40 cursor-not-allowed",
              ),
              title: "Arrastrar para reordenar",
              disabled: l,
              onClick: (N) => N.stopPropagation(),
              ...d,
              ...f,
              children: r.jsx(js, { className: "h-4 w-4" }),
            }),
            r.jsxs("div", {
              className: "min-w-0 flex-1 space-y-1.5 text-left",
              children: [
                r.jsxs("div", {
                  className: "flex items-center gap-2 min-w-0 flex-wrap",
                  children: [
                    r.jsx("span", {
                      className: "text-sm font-semibold truncate max-w-[min(100%,18rem)]",
                      children: e.title,
                    }),
                    o
                      ? r.jsx("span", {
                          className:
                            "inline-flex items-center rounded-md border border-primary/35 bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary",
                          children: "Siguiente",
                        })
                      : null,
                    r.jsx(Mr, { kind: e.kind }),
                    r.jsx(Eo, { status: e.status }),
                    r.jsx(jt, { label: bt(e.status), tone: lt(e.status) }),
                  ],
                }),
                y
                  ? r.jsxs("p", {
                      className: "text-[11px] leading-snug",
                      children: [
                        r.jsx("span", {
                          className: "text-muted-foreground",
                          children: "Insumo · ",
                        }),
                        r.jsx("span", { className: "text-foreground/85", children: y }),
                      ],
                    })
                  : null,
                j
                  ? r.jsxs("p", {
                      className: X(
                        "text-[11px] leading-snug line-clamp-2",
                        e.status === "failed" ? "text-destructive" : "text-muted-foreground",
                      ),
                      children: [
                        r.jsx("span", {
                          className: "text-muted-foreground/80",
                          children: "Resultado · ",
                        }),
                        j,
                      ],
                    })
                  : null,
                D.length > 0
                  ? r.jsx("div", {
                      className: "flex flex-wrap gap-1 pt-0.5",
                      children: D.map((N) =>
                        r.jsx(
                          "span",
                          {
                            className: X(
                              "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                              v.chip,
                            ),
                            children: N,
                          },
                          N,
                        ),
                      ),
                    })
                  : null,
                r.jsxs("p", {
                  className:
                    "flex items-center gap-1 text-[10px] text-primary/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                  children: [
                    r.jsx(Ns, { className: "h-3 w-3" }),
                    "Clic para ver · arrastra el asa para reordenar",
                  ],
                }),
              ],
            }),
            r.jsxs("span", {
              className: "text-[10px] tabular-nums text-muted-foreground/50 shrink-0 pt-1",
              children: [t + 1, "/", n],
            }),
          ],
        }),
      }),
    ],
  });
}
function yi({ items: e, selectedItemId: t, disabled: n, onSelect: s, onReorder: o }) {
  const a = Ko(nr(Hn, { activationConstraint: { distance: 6 } }), nr(Fn, { coordinateGetter: bi })),
    l = e.findIndex(
      (d) =>
        d.status === "pending" ||
        d.status === "queued" ||
        d.status === "running" ||
        d.status === "failed",
    ),
    i = (d) => {
      const { active: f, over: u } = d;
      if (!u || f.id === u.id) return;
      const p = e.findIndex((C) => C.id === f.id),
        g = e.findIndex((C) => C.id === u.id);
      if (p < 0 || g < 0) return;
      const x = qn(e, p, g);
      o(x.map((C) => C.id));
    };
  return r.jsx(Xa, {
    sensors: a,
    collisionDetection: Xo,
    onDragEnd: i,
    children: r.jsx(li, {
      items: e.map((d) => d.id),
      strategy: ai,
      children: r.jsx("ol", {
        className: "relative m-0 list-none p-0",
        children: e.map((d, f) =>
          r.jsx(
            wi,
            {
              item: d,
              idx: f,
              total: e.length,
              selected: t === d.id,
              isNext: f === l,
              isLast: f === e.length - 1,
              disabled: n,
              onSelect: () => s(d.id),
            },
            d.id,
          ),
        ),
      }),
    }),
  });
}
function ji(e) {
  const t = e
    .replace(
      /\r\n/g,
      `
`,
    )
    .split(
      `
`,
    )
    .map((n) => n.trim())
    .filter(Boolean);
  return t.length
    ? t.map((n) =>
        /^[-*+]\s+/.test(n) || /^\d+\.\s+/.test(n)
          ? n
          : `- ${n.replace(/^\*\*(.+)\*\*:?\s*/, "$1: ")}`,
      ).join(`
`)
    : "";
}
function Ni(e) {
  return e.replace(/[^\w.-]+/g, "-").slice(0, 60) || "resultado";
}
function ki(e) {
  const t = e.trim();
  return !(!t || ot(t));
}
function Si({
  text: e,
  rawResult: t,
  error: n,
  emptyHint: s = "Este ítem aún no generó nada. Ejecútalo o revisa Insumos.",
  className: o,
  filenameBase: a = "resultado-trabajador",
}) {
  const [l, i] = c.useState("format"),
    [d, f] = c.useState(null),
    [u, p] = c.useState(null),
    [g, x] = c.useState(null),
    [C, y] = c.useState(!1),
    [j, v] = c.useState(null),
    A = c.useMemo(() => Mn(t, e), [t, e]),
    D = c.useMemo(() => xo(t, e), [t, e]),
    E = !!ot(e),
    N = ki(e) && !D.length,
    P = D.length > 0,
    R = c.useMemo(() => ji(e), [e]),
    k = l === "list" ? R : e,
    U = c.useMemo(() => (t != null ? fe(t) : E ? fe(e) : e), [t, e, E]),
    H = Ni(a),
    h = (b) => {
      try {
        if (b === "json") {
          const V = t ?? { content: e };
          xt(`${H}.json`, fe(V), "application/json");
        } else
          b === "md"
            ? xt(`${H}.md`, e || R, "text/markdown")
            : b === "csv"
              ? xt(`${H}.csv`, e || R, "text/csv")
              : xt(`${H}.txt`, e || R, "text/plain");
        $.success("Descarga lista");
      } catch {
        $.error("No se pudo descargar");
      }
    },
    z = async (b) => {
      const V = A.find((T) => T.id === b);
      if (V) {
        f(b);
        try {
          (await Do(V), $.success(`Descargado: ${V.name}`));
        } catch (T) {
          const pe = T && typeof T == "object" && "message" in T ? String(T.message) : "";
          $.error(pe || "No se pudo descargar el archivo");
        } finally {
          f(null);
        }
      }
    },
    S = async (b) => {
      const V = A.find((T) => T.id === b);
      if (V) {
        (p(V), x(null), v(null), y(!0));
        try {
          if (V.kind === "text" && V.content != null) {
            x(null);
            return;
          }
          const T = await Co(V);
          x(T);
        } catch (T) {
          v(
            T && typeof T == "object" && "message" in T
              ? String(T.message)
              : "No se pudo abrir la vista previa",
          );
        } finally {
          y(!1);
        }
      }
    };
  c.useEffect(
    () => () => {
      g?.startsWith("blob:") && URL.revokeObjectURL(g);
    },
    [g],
  );
  const M = !N && !P && A.length === 0 && !e.trim();
  return r.jsxs("div", {
    className: X("space-y-2.5", o),
    children: [
      n ? r.jsx(kr, { variant: "inline", message: n }) : null,
      A.length > 0
        ? r.jsxs("div", {
            className:
              "rounded-xl border border-primary/30 bg-primary/8 p-2.5 space-y-2 shadow-sm shadow-primary/5",
            children: [
              r.jsx("p", {
                className:
                  "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5",
                children: "Archivos del resultado",
              }),
              r.jsx("ul", {
                className: "space-y-1.5",
                children: A.map((b) => {
                  const V = Xt(b.name, b.mime),
                    T = d === b.id;
                  return r.jsxs(
                    "li",
                    {
                      className:
                        "flex items-start gap-2 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2",
                      children: [
                        r.jsx(ks, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
                        r.jsxs("div", {
                          className: "min-w-0 flex-1 space-y-0.5",
                          children: [
                            r.jsx("p", {
                              className: "text-xs font-medium break-all leading-snug",
                              children: b.name,
                            }),
                            r.jsxs("p", {
                              className: "text-[10px] text-muted-foreground",
                              children: [
                                r.jsx("span", {
                                  className:
                                    "inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-medium text-primary",
                                  children: V,
                                }),
                                b.sizeHint
                                  ? r.jsx("span", { className: "ml-1.5", children: b.sizeHint })
                                  : null,
                              ],
                            }),
                          ],
                        }),
                        r.jsxs("div", {
                          className: "flex shrink-0 items-center gap-1 self-center",
                          children: [
                            r.jsxs(F, {
                              type: "button",
                              size: "sm",
                              variant: "outline",
                              className: "h-7 gap-1 cursor-pointer",
                              onClick: () => {
                                S(b.id);
                              },
                              title: "Vista previa",
                              children: [r.jsx(Ss, { className: "h-3.5 w-3.5" }), "Ver"],
                            }),
                            r.jsxs(F, {
                              type: "button",
                              size: "sm",
                              className: "h-7 gap-1 cursor-pointer",
                              disabled: T,
                              onClick: () => {
                                z(b.id);
                              },
                              title: "Descargar",
                              children: [
                                r.jsx(rn, { className: "h-3.5 w-3.5" }),
                                T ? "…" : "Bajar",
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    b.id,
                  );
                }),
              }),
            ],
          })
        : null,
      r.jsx(En, {
        open: !!u,
        onOpenChange: (b) => {
          b || (p(null), x(null), v(null));
        },
        children: r.jsxs(In, {
          className: "max-w-3xl w-[min(96vw,48rem)] h-[min(85vh,40rem)] flex flex-col gap-3",
          children: [
            r.jsx(_n, {
              children: r.jsx(Rn, {
                className: "text-sm truncate pr-6",
                children: u?.name || "Vista previa",
              }),
            }),
            r.jsx("div", {
              className:
                "flex-1 min-h-0 rounded-lg border bg-muted/20 overflow-hidden flex flex-col",
              children: C
                ? r.jsx("p", {
                    className: "p-4 text-xs text-muted-foreground",
                    children: "Cargando vista previa…",
                  })
                : j
                  ? r.jsx("p", { className: "p-4 text-xs text-destructive", children: j })
                  : u && Pt(u) === "pdf" && g
                    ? r.jsx("iframe", {
                        title: u.name,
                        src: g,
                        className: "flex-1 w-full h-full min-h-[20rem] bg-background",
                      })
                    : u && Pt(u) === "image" && g
                      ? r.jsx("div", {
                          className: "flex-1 overflow-auto p-3 flex items-center justify-center",
                          children: r.jsx("img", {
                            src: g,
                            alt: u.name,
                            className: "max-w-full max-h-full object-contain",
                          }),
                        })
                      : u && (Pt(u) === "text" || u.kind === "text")
                        ? r.jsx("pre", {
                            className:
                              "flex-1 overflow-auto p-3 text-xs whitespace-pre-wrap break-words font-mono",
                            children: u.content || "Sin contenido de texto",
                          })
                        : u && Pt(u) === "office"
                          ? r.jsxs("div", {
                              className: "p-4 space-y-3 text-sm",
                              children: [
                                r.jsx("p", {
                                  className: "text-muted-foreground text-xs",
                                  children:
                                    "Excel no se previsualiza en el navegador. Podés bajarlo o abrirlo en otra pestaña.",
                                }),
                                r.jsxs("div", {
                                  className: "flex gap-2",
                                  children: [
                                    r.jsxs(F, {
                                      size: "sm",
                                      className: "gap-1",
                                      onClick: () => u && void z(u.id),
                                      children: [r.jsx(rn, { className: "h-3.5 w-3.5" }), "Bajar"],
                                    }),
                                    g
                                      ? r.jsx(F, {
                                          size: "sm",
                                          variant: "outline",
                                          asChild: !0,
                                          children: r.jsx("a", {
                                            href: g,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            children: "Abrir",
                                          }),
                                        })
                                      : null,
                                  ],
                                }),
                              ],
                            })
                          : g
                            ? r.jsxs("div", {
                                className: "p-4 space-y-3",
                                children: [
                                  r.jsx("p", {
                                    className: "text-xs text-muted-foreground",
                                    children:
                                      "Este tipo de archivo no tiene vista previa embebida.",
                                  }),
                                  r.jsx(F, {
                                    size: "sm",
                                    variant: "outline",
                                    asChild: !0,
                                    children: r.jsx("a", {
                                      href: g,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                      children: "Abrir en pestaña",
                                    }),
                                  }),
                                ],
                              })
                            : r.jsx("p", {
                                className: "p-4 text-xs text-muted-foreground",
                                children: "Sin vista previa",
                              }),
            }),
          ],
        }),
      }),
      M
        ? r.jsx(pn, { className: "py-6 px-3", title: s })
        : N || P || e.trim()
          ? r.jsxs("div", {
              className:
                "rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 to-muted/20 overflow-hidden flex flex-col min-h-0",
              children: [
                r.jsxs("div", {
                  className:
                    "shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border/50 bg-card/40",
                  children: [
                    r.jsx("div", {
                      className: "flex rounded-md border border-border/60 p-0.5 gap-0.5 min-w-0",
                      children: [
                        { id: "format", label: "Resumen", icon: Cs },
                        { id: "raw", label: "JSON", icon: Ds },
                        { id: "list", label: "Lista", icon: Es },
                      ].map((b) =>
                        r.jsxs(
                          "button",
                          {
                            type: "button",
                            title: b.label,
                            onClick: () => i(b.id),
                            className: X(
                              "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium transition-colors",
                              l === b.id
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            ),
                            children: [
                              r.jsx(b.icon, { className: "h-3 w-3 shrink-0" }),
                              r.jsx("span", { className: "hidden sm:inline", children: b.label }),
                            ],
                          },
                          b.id,
                        ),
                      ),
                    }),
                    r.jsxs("div", {
                      className: "ml-auto flex items-center gap-0.5 shrink-0",
                      children: [
                        r.jsx(Is, { text: U || k, alwaysVisible: !0 }),
                        r.jsxs(F, {
                          type: "button",
                          variant: "outline",
                          size: "sm",
                          className: "h-7 gap-1 text-[11px] px-2",
                          onClick: () => h(P || E ? "json" : "md"),
                          title: "Descargar resultado",
                          children: [
                            r.jsx(rn, { className: "h-3.5 w-3.5" }),
                            r.jsx("span", { className: "hidden sm:inline", children: "Descargar" }),
                          ],
                        }),
                        r.jsxs(_s, {
                          children: [
                            r.jsx(Rs, {
                              asChild: !0,
                              children: r.jsx(F, {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                className: "h-7 w-7",
                                title: "Más formatos",
                                children: r.jsx(As, { className: "h-3.5 w-3.5" }),
                              }),
                            }),
                            r.jsxs(Ms, {
                              align: "end",
                              className: "min-w-[11rem]",
                              children: [
                                r.jsx(Tt, { onClick: () => h("md"), children: "Markdown (.md)" }),
                                r.jsx(Tt, { onClick: () => h("txt"), children: "Texto (.txt)" }),
                                r.jsx(Tt, { onClick: () => h("csv"), children: "CSV (.csv)" }),
                                r.jsx(Tt, { onClick: () => h("json"), children: "JSON (.json)" }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                r.jsx("div", {
                  className: "flex-1 min-h-0 overflow-auto px-3 py-3 max-h-[min(52vh,520px)]",
                  children:
                    l === "raw"
                      ? r.jsx("pre", {
                          className:
                            "text-[11px] whitespace-pre-wrap break-words font-mono text-foreground/90 leading-relaxed",
                          children: U,
                        })
                      : l === "list" && N
                        ? r.jsx(sn, { content: R, className: "text-[13px] sm:text-sm" })
                        : P
                          ? r.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                r.jsx("p", {
                                  className: "text-[11px] text-muted-foreground",
                                  children: "Resumen del resultado",
                                }),
                                r.jsx("div", {
                                  className: "grid grid-cols-2 gap-1.5",
                                  children: D.map((b) =>
                                    r.jsxs(
                                      "div",
                                      {
                                        className:
                                          "rounded-lg border border-border/50 bg-background/60 px-2.5 py-2 min-w-0",
                                        children: [
                                          r.jsx("p", {
                                            className:
                                              "text-[10px] font-medium uppercase tracking-wide text-muted-foreground truncate",
                                            children: b.label,
                                          }),
                                          r.jsx("p", {
                                            className:
                                              "mt-0.5 text-sm font-semibold tabular-nums text-foreground break-words leading-snug",
                                            children: b.value,
                                          }),
                                        ],
                                      },
                                      `${b.label}-${b.value}`,
                                    ),
                                  ),
                                }),
                                N
                                  ? r.jsx("div", {
                                      className: "pt-2 border-t border-border/40",
                                      children: r.jsx(sn, {
                                        content: e,
                                        className: "text-[13px] sm:text-sm",
                                      }),
                                    })
                                  : null,
                              ],
                            })
                          : N
                            ? r.jsx(sn, { content: e, className: "text-[13px] sm:text-sm" })
                            : e.trim()
                              ? r.jsx("pre", {
                                  className:
                                    "text-[11px] whitespace-pre-wrap break-words font-mono text-foreground/90 leading-relaxed",
                                  children: fe(e),
                                })
                              : null,
                }),
              ],
            })
          : null,
    ],
  });
}
function hr({
  item: e,
  planWorkflowId: t,
  planAgentId: n,
  agentLabel: s,
  agents: o = [],
  busy: a,
  onRun: l,
  onRetry: i,
  onSave: d,
  onDelete: f,
}) {
  const u = (w) => (typeof w == "string" && w in Ye ? w : "note"),
    [p, g] = c.useState(e.title || ""),
    [x, C] = c.useState(() => u(e.kind)),
    [y, j] = c.useState(() => vn(u(e.kind), e.payload)),
    [v, A] = c.useState(() => (e.assigned_agent != null ? String(e.assigned_agent) : "") || ""),
    [D, E] = c.useState(!1),
    N = e.status === "pending" || e.status === "queued" ? "insumos" : "resultado",
    [P, R] = c.useState(N);
  c.useEffect(() => {
    const w = u(e.kind);
    (g(e.title || ""),
      C(w),
      j(vn(w, e.payload)),
      A(e.assigned_agent != null ? String(e.assigned_agent) : ""));
    const q = e.status === "pending" || e.status === "queued" ? "insumos" : "resultado";
    (R(q), E(e.status === "pending" || e.status === "queued"));
  }, [e.id, e.title, e.kind, e.payload, e.modified, e.status, e.assigned_agent]);
  const k = Gt(e),
    U = e.result && typeof e.result == "object" ? e.result : null,
    H = Io(U),
    h = e.attempts ?? 0,
    z = e.max_attempts ?? 3,
    S = e.status === "done" || e.status === "failed" || !!e.result,
    M = !!k.executionId && (k.nodes.length === 0 || !k.replyText.trim()),
    { data: b, isLoading: V } = Qs(M ? k.executionId : void 0),
    T = c.useMemo(() => {
      if (k.replyText.trim()) return k.replyText;
      if (!b) return "";
      const w = b.context || {};
      for (const L of ["response", "response_text", "content", "summary", "digest", "message"]) {
        const ne = w[L];
        if (typeof ne == "string" && ne.trim()) return ne;
      }
      const q = [];
      for (const L of b.logs || []) {
        const ne = L.output_data || {};
        for (const he of ["response", "response_text", "content", "message", "text"]) {
          const oe = ne[he];
          if (typeof oe == "string" && oe.trim()) {
            q.push(oe.trim());
            break;
          }
        }
      }
      return q.length
        ? q.join(`

`)
        : b.status
          ? `${b.workflow_name || "Workflow"}: ${b.status} · ${b.completed_nodes ?? 0}/${b.total_nodes ?? 0} nodos`
          : "";
    }, [k.replyText, b]),
    pe = c.useMemo(
      () =>
        k.nodes.length
          ? k.nodes
          : (b?.logs || []).map((w) => ({
              node: w.node_name || "Nodo",
              node_type: w.node_type,
              status: w.status,
              output: w.output_data,
              error: w.error_message,
            })),
      [k.nodes, b],
    ),
    te =
      (typeof e.payload?.workflow_id == "string" && e.payload.workflow_id) ||
      (typeof U?.workflow_id == "string" && U.workflow_id) ||
      t ||
      b?.workflow,
    we = () => {
      const w = { key: e.id, title: p, kind: x, ...y },
        q = On(w);
      if (q) {
        if (!p.trim()) {
          $.error("El ítem necesita un título");
          return;
        }
        (d({ title: p.trim(), kind: x, payload: q, assigned_agent: v.trim() ? v.trim() : null }),
          E(!1));
      }
    },
    Ce = c.useMemo(() => {
      const w =
          e.assigned_agent != null
            ? o.find((ne) => ne.id === String(e.assigned_agent))?.name || String(e.assigned_agent)
            : null,
        q = [
          { label: "Tipo", value: Ye[e.kind] ?? e.kind },
          { label: "Título", value: e.title },
          { label: "Agente", value: w ? `${w} (este paso)` : n ? `${s} (plan)` : "Sin agente" },
        ],
        L = e.payload && typeof e.payload == "object" ? e.payload : {};
      return (
        e.kind === "agent_turn"
          ? q.push({ label: "Mensaje", value: typeof L.message == "string" ? L.message : "" })
          : e.kind === "note"
            ? q.push({ label: "Texto", value: typeof L.text == "string" ? L.text : "" })
            : e.kind === "function"
              ? (q.push({
                  label: "Slug",
                  value: typeof L.function_slug == "string" ? L.function_slug : "",
                }),
                q.push({ label: "Parámetros", value: fe(L.parameters ?? {}) }))
              : e.kind === "workflow" &&
                (typeof L.workflow_name == "string" &&
                  L.workflow_name &&
                  q.push({ label: "Workflow", value: L.workflow_name }),
                typeof L.workflow_id == "string" &&
                  L.workflow_id &&
                  q.push({ label: "ID", value: L.workflow_id })),
        q.filter((ne) => ne.value.trim())
      );
    }, [e, o, s, n]),
    Q = Pn(e.kind),
    ce = Q.Icon;
  return r.jsxs("div", {
    className: "flex flex-col h-full min-h-0 bg-transparent",
    children: [
      r.jsxs("div", {
        className: "shrink-0 border-b border-border/40 px-4 py-3 space-y-2.5",
        children: [
          r.jsxs("div", {
            className: "flex items-start justify-between gap-2",
            children: [
              r.jsxs("div", {
                className: "flex items-start gap-2.5 min-w-0",
                children: [
                  r.jsx("span", {
                    className: X(
                      "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                      Q.iconWrap,
                    ),
                    children: r.jsx(ce, { className: "h-4 w-4" }),
                  }),
                  r.jsxs("div", {
                    className: "min-w-0",
                    children: [
                      r.jsx("p", {
                        className: "text-sm font-semibold leading-snug",
                        children: e.title,
                      }),
                      r.jsxs("div", {
                        className: "mt-1 flex flex-wrap items-center gap-1.5",
                        children: [
                          r.jsx(Mr, { kind: e.kind }),
                          r.jsxs("span", {
                            className: "text-[11px] text-muted-foreground truncate",
                            children: [s, " · ", h, "/", z],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              r.jsx(jt, { label: bt(e.status), tone: lt(e.status) }),
            ],
          }),
          r.jsxs("div", {
            className: "flex gap-1.5",
            children: [
              r.jsxs(F, {
                size: "sm",
                className: "flex-1 h-9 gap-1.5 shadow-sm shadow-primary/15",
                disabled: a,
                onClick: l,
                children: [
                  a
                    ? r.jsx(it, { className: "h-3.5 w-3.5 animate-spin" })
                    : r.jsx(yr, { className: "h-3.5 w-3.5" }),
                  "Ejecutar",
                ],
              }),
              e.status === "failed"
                ? r.jsxs(F, {
                    size: "sm",
                    variant: "outline",
                    className: "flex-1 h-9 gap-1.5",
                    disabled: a,
                    onClick: i,
                    children: [r.jsx(Ts, { className: "h-3.5 w-3.5" }), "Reintentar"],
                  })
                : null,
            ],
          }),
        ],
      }),
      r.jsxs(Ps, {
        value: P,
        onValueChange: R,
        className: "flex-1 min-h-0 flex flex-col overflow-hidden",
        children: [
          r.jsx("div", {
            className: "shrink-0 px-3 pt-2",
            children: r.jsxs(Os, {
              className: "w-full grid grid-cols-3 h-8",
              children: [
                r.jsx(on, {
                  value: "resultado",
                  className: "text-[11px] h-7",
                  children: "Resultado",
                }),
                r.jsx(on, { value: "insumos", className: "text-[11px] h-7", children: "Insumos" }),
                r.jsx(on, { value: "tecnico", className: "text-[11px] h-7", children: "Técnico" }),
              ],
            }),
          }),
          r.jsx(an, {
            value: "resultado",
            className: "flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden",
            children: r.jsx("div", {
              className: "h-full min-h-0 overflow-y-auto overscroll-contain",
              children: r.jsxs("div", {
                className: "p-3 space-y-3",
                children: [
                  V && !T && !e.error_message
                    ? r.jsxs("div", {
                        className: "flex items-center gap-2 text-xs text-muted-foreground py-3",
                        children: [
                          r.jsx(it, { className: "h-3.5 w-3.5 animate-spin" }),
                          "Cargando detalle de la ejecución…",
                        ],
                      })
                    : r.jsx(Si, {
                        text: T,
                        rawResult: e.result,
                        error: e.error_message,
                        filenameBase: e.title || "resultado-item",
                        emptyHint: k.hasResult
                          ? "La corrida terminó sin texto legible. Mira Técnico o los nodos abajo."
                          : "Este ítem aún no generó nada. Ejecútalo o revisa Insumos.",
                      }),
                  H.length > 0
                    ? r.jsx("section", {
                        className: "space-y-1.5",
                        children: r.jsxs("details", {
                          className: "group rounded-xl border border-border/50 bg-background/50",
                          children: [
                            r.jsxs("summary", {
                              className:
                                "cursor-pointer list-none flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/30 rounded-xl",
                              children: [
                                r.jsx(Yn, {
                                  className:
                                    "h-3.5 w-3.5 transition-transform group-open:rotate-90",
                                }),
                                "Tools (",
                                H.length,
                                ")",
                              ],
                            }),
                            r.jsx("div", {
                              className: "px-2.5 pb-2.5 flex flex-wrap gap-1.5",
                              children: H.map((w, q) =>
                                r.jsxs(
                                  "details",
                                  {
                                    className:
                                      "rounded-lg border bg-muted/30 px-2.5 py-1.5 text-xs open:w-full",
                                    children: [
                                      r.jsx("summary", {
                                        className:
                                          "cursor-pointer font-medium text-primary list-none flex items-center gap-1",
                                        children: r.jsx("span", {
                                          className: "truncate",
                                          children: w.name,
                                        }),
                                      }),
                                      r.jsx("pre", {
                                        className:
                                          "mt-1.5 text-[11px] whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-36 overflow-auto",
                                        children: w.detail,
                                      }),
                                    ],
                                  },
                                  `${w.name}-${q}`,
                                ),
                              ),
                            }),
                          ],
                        }),
                      })
                    : null,
                  pe.length > 0
                    ? r.jsxs("section", {
                        className: "space-y-1.5",
                        children: [
                          r.jsx("h3", {
                            className:
                              "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5",
                            children: "Nodos del flujo",
                          }),
                          r.jsx("ul", {
                            className: "space-y-1.5",
                            children: pe.map((w, q) => {
                              const L =
                                !!w.output &&
                                typeof w.output == "object" &&
                                Object.keys(w.output).length > 0;
                              return r.jsx(
                                "li",
                                {
                                  children: r.jsxs("details", {
                                    className:
                                      "group rounded-lg border border-border/50 bg-background/50 open:bg-muted/20",
                                    children: [
                                      r.jsxs("summary", {
                                        className:
                                          "cursor-pointer list-none flex items-center gap-2 px-2.5 py-2 hover:bg-muted/25 rounded-lg",
                                        children: [
                                          r.jsx(Yn, {
                                            className:
                                              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90",
                                          }),
                                          r.jsx("p", {
                                            className: "text-xs font-medium flex-1 truncate",
                                            children: w.node,
                                          }),
                                          w.node_type
                                            ? r.jsx("span", {
                                                className:
                                                  "text-[10px] text-muted-foreground shrink-0",
                                                children: w.node_type,
                                              })
                                            : null,
                                          w.status
                                            ? r.jsx(jt, { label: bt(w.status), tone: lt(w.status) })
                                            : null,
                                        ],
                                      }),
                                      r.jsxs("div", {
                                        className: "px-2.5 pb-2.5 space-y-1.5",
                                        children: [
                                          w.error
                                            ? r.jsx("p", {
                                                className:
                                                  "text-[11px] text-destructive whitespace-pre-wrap",
                                                children: w.error,
                                              })
                                            : null,
                                          L
                                            ? r.jsx("pre", {
                                                className:
                                                  "text-[11px] whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-36 overflow-auto rounded-md border border-border/40 bg-muted/20 px-2 py-1.5",
                                                children: fe(w.output),
                                              })
                                            : w.error
                                              ? null
                                              : r.jsx("p", {
                                                  className: "text-[11px] text-muted-foreground",
                                                  children: "Sin output",
                                                }),
                                        ],
                                      }),
                                    ],
                                  }),
                                },
                                `${w.node}-${q}`,
                              );
                            }),
                          }),
                        ],
                      })
                    : null,
                  te
                    ? r.jsxs(rt, {
                        to: `/app/workflows/${String(te)}`,
                        className:
                          "inline-flex items-center gap-1.5 text-xs text-primary hover:underline",
                        children: [
                          r.jsx(Ft, { className: "h-3.5 w-3.5" }),
                          "Abrir canvas del workflow",
                        ],
                      })
                    : null,
                ],
              }),
            }),
          }),
          r.jsx(an, {
            value: "insumos",
            className: "flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden",
            children: r.jsx("div", {
              className: "h-full min-h-0 overflow-y-auto overscroll-contain",
              children: r.jsxs("div", {
                className: "p-3 space-y-3",
                children: [
                  r.jsx("p", { className: "text-[11px] text-muted-foreground", children: Tn[x] }),
                  S && !D
                    ? r.jsxs(r.Fragment, {
                        children: [
                          r.jsx("div", {
                            className: "rounded-xl border bg-muted/20 divide-y divide-border/50",
                            children: Ce.map((w) =>
                              r.jsxs(
                                "div",
                                {
                                  className: "px-3 py-2",
                                  children: [
                                    r.jsx("p", {
                                      className:
                                        "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
                                      children: w.label,
                                    }),
                                    r.jsx("pre", {
                                      className:
                                        "mt-0.5 text-xs whitespace-pre-wrap break-words font-sans text-foreground/90",
                                      children: w.value,
                                    }),
                                  ],
                                },
                                w.label,
                              ),
                            ),
                          }),
                          r.jsx("p", {
                            className: "text-[11px] text-muted-foreground",
                            children:
                              "Así se ejecutó este paso. Puedes editar los insumos y volver a correrlo.",
                          }),
                          r.jsx(F, {
                            size: "sm",
                            variant: "secondary",
                            className: "w-full h-8",
                            onClick: () => E(!0),
                            children: "Editar insumos",
                          }),
                        ],
                      })
                    : r.jsxs("div", {
                        className: "space-y-2.5",
                        children: [
                          r.jsxs("div", {
                            className: "rounded-lg border bg-card/50 px-3 py-2 space-y-1.5",
                            children: [
                              r.jsx(Y, { className: "text-[11px]", children: "Título" }),
                              r.jsx(_e, {
                                value: p,
                                onChange: (w) => g(w.target.value),
                                className: "h-8",
                              }),
                            ],
                          }),
                          r.jsxs("div", {
                            className: "rounded-lg border bg-card/50 px-3 py-2 space-y-1.5",
                            children: [
                              r.jsx(Y, { className: "text-[11px]", children: "Tipo de ítem" }),
                              r.jsxs(Le, {
                                value: x,
                                onValueChange: (w) => C(w),
                                children: [
                                  r.jsx(We, { className: "h-8", children: r.jsx($e, {}) }),
                                  r.jsx(ze, {
                                    children: Object.keys(Ye).map((w) =>
                                      r.jsx(de, { value: w, children: Ye[w] }, w),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          r.jsxs("div", {
                            className: "rounded-lg border bg-card/50 px-3 py-2 space-y-1.5",
                            children: [
                              r.jsx(Y, {
                                className: "text-[11px]",
                                children: "Agente de este paso",
                              }),
                              r.jsxs(Le, {
                                value: v || "__plan__",
                                onValueChange: (w) => A(w === "__plan__" ? "" : w),
                                children: [
                                  r.jsx(We, {
                                    className: "h-8",
                                    children: r.jsx($e, { placeholder: "Usar agente del plan" }),
                                  }),
                                  r.jsxs(ze, {
                                    children: [
                                      r.jsxs(de, {
                                        value: "__plan__",
                                        children: ["Usar agente del plan", n ? ` (${s})` : ""],
                                      }),
                                      o.map((w) =>
                                        r.jsx(de, { value: w.id, children: w.name }, w.id),
                                      ),
                                    ],
                                  }),
                                ],
                              }),
                              r.jsx("p", {
                                className: "text-[10px] text-muted-foreground",
                                children:
                                  "Solo afecta turnos de agente; skills/workflows no lo usan.",
                              }),
                            ],
                          }),
                          r.jsxs("div", {
                            className:
                              "rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 space-y-2",
                            children: [
                              r.jsx("p", {
                                className:
                                  "text-[10px] font-semibold uppercase tracking-wide text-primary/90",
                                children: "Insumo",
                              }),
                              r.jsx(Vn, {
                                kind: x,
                                fields: y,
                                onChange: (w) => j((q) => ({ ...q, ...w })),
                              }),
                            ],
                          }),
                          r.jsxs("div", {
                            className: "flex gap-1.5",
                            children: [
                              S
                                ? r.jsx(F, {
                                    size: "sm",
                                    variant: "ghost",
                                    className: "h-8",
                                    onClick: () => E(!1),
                                    children: "Cancelar",
                                  })
                                : null,
                              r.jsxs(F, {
                                size: "sm",
                                variant: "secondary",
                                className: "flex-1 h-8 gap-1",
                                disabled: a,
                                onClick: we,
                                children: [
                                  r.jsx(jr, { className: "h-3.5 w-3.5" }),
                                  "Guardar insumos",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                  r.jsxs(F, {
                    size: "sm",
                    variant: "ghost",
                    className: "w-full h-8 text-destructive hover:text-destructive",
                    disabled: a,
                    onClick: f,
                    children: [r.jsx(Dn, { className: "h-3.5 w-3.5 mr-1" }), "Quitar ítem"],
                  }),
                ],
              }),
            }),
          }),
          r.jsx(an, {
            value: "tecnico",
            className: "flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden",
            children: r.jsx("div", {
              className: "h-full min-h-0 overflow-y-auto overscroll-contain",
              children: r.jsxs("div", {
                className: "p-3 space-y-3",
                children: [
                  r.jsxs("div", {
                    className: "rounded-lg border px-3 py-2 text-xs space-y-1",
                    children: [
                      r.jsxs("p", {
                        children: [
                          r.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Intentos · ",
                          }),
                          h,
                          "/",
                          z,
                        ],
                      }),
                      r.jsxs("p", {
                        children: [
                          r.jsx("span", {
                            className: "text-muted-foreground",
                            children: "Estado · ",
                          }),
                          bt(e.status),
                        ],
                      }),
                      k.executionId
                        ? r.jsxs("p", {
                            className: "break-all",
                            children: [
                              r.jsx("span", {
                                className: "text-muted-foreground",
                                children: "execution_id · ",
                              }),
                              k.executionId,
                            ],
                          })
                        : null,
                    ],
                  }),
                  k.metaJson && k.metaJson !== "{}"
                    ? r.jsx("pre", {
                        className:
                          "rounded-lg border bg-muted/30 px-3 py-2 text-[11px] whitespace-pre-wrap break-words font-mono text-muted-foreground max-h-64 overflow-auto",
                        children: k.metaJson,
                      })
                    : r.jsx("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Sin metadata extra.",
                      }),
                  te
                    ? r.jsxs(rt, {
                        to: `/app/workflows/${String(te)}`,
                        className:
                          "inline-flex items-center gap-1.5 text-xs text-primary hover:underline",
                        children: [
                          r.jsx(Ft, { className: "h-3.5 w-3.5" }),
                          "Abrir canvas del workflow",
                        ],
                      })
                    : null,
                ],
              }),
            }),
          }),
        ],
      }),
    ],
  });
}
function Vn({ kind: e, fields: t, onChange: n }) {
  return e === "agent_turn"
    ? r.jsxs("div", {
        className: "space-y-1",
        children: [
          r.jsx(Y, { className: "text-[11px]", children: "Mensaje al agente" }),
          r.jsx(st, {
            value: t.message,
            onChange: (s) => n({ message: s.target.value }),
            rows: 3,
            placeholder: "Qué debe hacer el agente en este turno",
          }),
        ],
      })
    : e === "note"
      ? r.jsxs("div", {
          className: "space-y-1",
          children: [
            r.jsx(Y, { className: "text-[11px]", children: "Texto de la nota" }),
            r.jsx(st, {
              value: t.noteText,
              onChange: (s) => n({ noteText: s.target.value }),
              rows: 3,
              placeholder: "Aviso o checklist para quien revise el plan",
            }),
          ],
        })
      : e === "function"
        ? r.jsxs("div", {
            className: "space-y-2",
            children: [
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { className: "text-[11px]", children: "function_slug" }),
                  r.jsx(_e, {
                    value: t.functionSlug,
                    onChange: (s) => n({ functionSlug: s.target.value }),
                    placeholder: "ej. dentidesk-horas-disponibles",
                    className: "h-8",
                  }),
                ],
              }),
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { className: "text-[11px]", children: "parameters (JSON)" }),
                  r.jsx(st, {
                    value: t.parametersJson,
                    onChange: (s) => n({ parametersJson: s.target.value }),
                    rows: 3,
                    className: "font-mono text-xs",
                    placeholder: "{}",
                  }),
                ],
              }),
            ],
          })
        : r.jsxs("div", {
            className: "space-y-2",
            children: [
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { className: "text-[11px]", children: "workflow_id" }),
                  r.jsx(_e, {
                    value: t.workflowId,
                    onChange: (s) => n({ workflowId: s.target.value }),
                    placeholder: "UUID del workflow",
                    className: "h-8",
                  }),
                ],
              }),
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { className: "text-[11px]", children: "Nombre (alternativa)" }),
                  r.jsx(_e, {
                    value: t.workflowName,
                    onChange: (s) => n({ workflowName: s.target.value }),
                    placeholder: "[DEMO SH] Checklist…",
                    className: "h-8",
                  }),
                ],
              }),
            ],
          });
}
function Wt(e, t) {
  const n = e[t];
  return n ?? null;
}
const gr = [
  {
    id: "wm-dentidesk",
    label: "Agenda Clínica WM (Dentidesk)",
    description: "Demo segura: nota + horas disponibles + próxima hora. No crea citas reales.",
    requiresHint: "Necesitas el agente agendamiento-clinica-wm en esta sucursal.",
    agentSlugs: ["agendamiento-clinica-wm"],
    build: ({ agentIdBySlug: e }) => {
      const t = Wt(e, "agendamiento-clinica-wm");
      return t == null
        ? null
        : {
            name: "Demo Agenda Clínica WM",
            description:
              "Consulta de disponibilidad Dentidesk. No agendar sin consentimiento del paciente.",
            assigned_agent: t,
            context: { demo: !0, branch_label: "Clinica WM" },
            items: [
              {
                title: "Aviso demo",
                kind: "note",
                sort_order: 0,
                payload: {
                  text: "Demo: no crear cita real sin consentimiento explícito del paciente.",
                },
              },
              {
                title: "Horas disponibles",
                kind: "agent_turn",
                sort_order: 1,
                payload: {
                  message:
                    "Usa la skill dentidesk-horas-disponibles y resume las próximas horas libres de hoy o mañana. No reserves nada.",
                },
              },
              {
                title: "Próxima hora",
                kind: "agent_turn",
                sort_order: 2,
                payload: {
                  message:
                    "Usa dentidesk-buscar-proxima-hora y dime la próxima hora disponible. Solo informa, no crees la cita.",
                },
              },
            ],
          };
    },
  },
  {
    id: "sh-dga-soporte",
    label: "Ops SmartHydro: DGA + soporte",
    description: "Checklist normativa DGA + triage de soporte. Evita Nubox e IoT ensure.",
    requiresHint: "Necesitas experto-dga-smarthydro y/o soporte-smarthydro en esta sucursal.",
    agentSlugs: ["experto-dga-smarthydro", "soporte-smarthydro"],
    workflowNameIncludes: "Checklist normativa DGA",
    build: ({ agentIdBySlug: e, workflowIdByName: t }) => {
      const n = Wt(e, "experto-dga-smarthydro"),
        s = Wt(e, "soporte-smarthydro"),
        o = n ?? s;
      if (o == null) return null;
      const a = t("Checklist normativa DGA"),
        l = [
          {
            title: "Checklist demo",
            kind: "note",
            sort_order: 0,
            payload: {
              text: "Demo SH: revisar normativa DGA y triage de soporte. No abrir tickets reales ni tocar Nubox.",
            },
          },
        ];
      return (
        n != null &&
          l.push({
            title: "Consulta normativa DGA",
            kind: "agent_turn",
            sort_order: 1,
            assigned_agent: n,
            payload: {
              message:
                "Resume en 5 bullets los puntos clave de cumplimiento DGA para un cliente SmartHydro esta semana. Sin inventar normativa.",
            },
          }),
        a &&
          l.push({
            title: "Workflow checklist DGA",
            kind: "workflow",
            sort_order: l.length,
            payload: { workflow_id: a, workflow_name: "[DEMO SH] Checklist normativa DGA" },
          }),
        s != null &&
          l.push({
            title: "Triage soporte",
            kind: "agent_turn",
            sort_order: l.length,
            assigned_agent: s,
            payload: {
              message:
                "Haz un triage de soporte de ejemplo: cliente reporta alerta de caudal. Clasifica prioridad y sugiere pasos. No crees ticket real.",
            },
          }),
        {
          name: "[DEMO SH] Semana DGA + soporte",
          description: "Plan demo: normativa DGA + workflow checklist + triage soporte.",
          assigned_agent: o,
          workflow: a,
          context: { demo: !0, branch_label: "SmartHydro", avoid: ["nubox", "iot_ensure"] },
          items: l,
        }
      );
    },
  },
  {
    id: "sh-digest",
    label: "Digest telemetría diario",
    description: "Atajo al workflow de digest con telemetria-smarthydro.",
    requiresHint: "Necesitas telemetria-smarthydro o el workflow Digest telemetría.",
    agentSlugs: ["telemetria-smarthydro"],
    workflowNameIncludes: "Digest telemetría",
    build: ({ agentIdBySlug: e, workflowIdByName: t }) => {
      const n = Wt(e, "telemetria-smarthydro"),
        s = t("Digest telemetría");
      if (n == null && !s) return null;
      const o = [
        {
          title: "Nota digest",
          kind: "note",
          sort_order: 0,
          payload: {
            text: "Demo: digest diario de telemetría. Solo resumen, sin acciones destructivas.",
          },
        },
      ];
      return (
        s
          ? o.push({
              title: "Ejecutar digest telemetría",
              kind: "workflow",
              sort_order: 1,
              payload: { workflow_id: s, workflow_name: "[DEMO SH] Digest telemetría diario" },
            })
          : n != null &&
            o.push({
              title: "Resumen telemetría",
              kind: "agent_turn",
              sort_order: 1,
              assigned_agent: n,
              payload: {
                message:
                  "Genera un digest corto de telemetría del día: anomalías, caudales relevantes y recomendaciones.",
              },
            }),
        {
          name: "[DEMO SH] Digest telemetría diario",
          description: "Ejecuta el digest de telemetría (workflow o turno de agente).",
          assigned_agent: n,
          workflow: s,
          context: { demo: !0, branch_label: "SmartHydro" },
          items: o,
        }
      );
    },
  },
];
function Ci(e, t, n) {
  const s = e.agentSlugs.some((a) => t.has(a)),
    o =
      !!e.workflowNameIncludes &&
      n.some((a) => a.toLowerCase().includes(e.workflowNameIncludes.toLowerCase()));
  return e.id === "sh-digest"
    ? s || o
      ? { available: !0 }
      : { available: !1, reason: e.requiresHint }
    : s
      ? { available: !0 }
      : { available: !1, reason: e.requiresHint };
}
function Di({ open: e, onOpenChange: t, agents: n, workflows: s, pending: o, onSubmit: a }) {
  const [l, i] = c.useState(""),
    [d, f] = c.useState(""),
    [u, p] = c.useState(""),
    [g, x] = c.useState("none"),
    [C, y] = c.useState(""),
    [j, v] = c.useState("{}"),
    [A, D] = c.useState("blank"),
    [E, N] = c.useState([
      nt({ title: "Primera tarea", kind: "agent_turn", message: "Revisar pendientes del día" }),
    ]),
    P = c.useMemo(() => {
      const h = {};
      for (const z of n) z.slug && (h[z.slug] = z.id);
      return h;
    }, [n]),
    R = c.useMemo(() => new Set(n.map((h) => h.slug).filter(Boolean)), [n]),
    k = c.useMemo(() => s.map((h) => h.name), [s]),
    U = (h) => s.find((S) => (S.name || "").toLowerCase().includes(h.toLowerCase()))?.id ?? null;
  c.useEffect(() => {
    e &&
      (i(""),
      f(""),
      p(n[0]?.id ? String(n[0].id) : ""),
      x("none"),
      y(""),
      v("{}"),
      D("blank"),
      N([
        nt({ title: "Primera tarea", kind: "agent_turn", message: "Revisar pendientes del día" }),
      ]));
  }, [e, n]);
  const H = (h) => {
    if ((D(h), h === "blank")) return;
    const z = gr.find((M) => M.id === h);
    if (!z) return;
    const S = z.build({ agentIdBySlug: P, workflowIdByName: U });
    if (!S) {
      $.error(z.requiresHint);
      return;
    }
    (i(S.name),
      f(S.description || ""),
      p(S.assigned_agent != null ? String(S.assigned_agent) : ""),
      x(S.workflow ? String(S.workflow) : "none"),
      v(fe(S.context ?? {}) || "{}"),
      y(wr(S.scheduled_for)),
      N(
        (S.items || []).map((M) => {
          const b = vn(M.kind || "agent_turn", M.payload);
          return nt({
            title: M.title,
            kind: M.kind || "agent_turn",
            ...b,
            message:
              b.message || (typeof M.payload?.message == "string" ? M.payload.message : M.title),
          });
        }),
      ));
  };
  return r.jsx(En, {
    open: e,
    onOpenChange: t,
    children: r.jsxs(In, {
      className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
      children: [
        r.jsx(_n, { children: r.jsx(Rn, { children: "Nuevo plan de trabajo" }) }),
        r.jsxs("div", {
          className: "space-y-3 py-1",
          children: [
            r.jsxs("div", {
              className: "space-y-1.5",
              children: [
                r.jsx(Y, { children: "Plantilla" }),
                r.jsxs(Le, {
                  value: A,
                  onValueChange: (h) => H(h),
                  children: [
                    r.jsx(We, { children: r.jsx($e, { placeholder: "En blanco o ejemplo real" }) }),
                    r.jsxs(ze, {
                      children: [
                        r.jsx(de, { value: "blank", children: "En blanco" }),
                        gr.map((h) => {
                          const z = Ci(h, R, k);
                          return r.jsxs(
                            de,
                            {
                              value: h.id,
                              disabled: !z.available,
                              children: [h.label, z.available ? "" : " (no disponible aquí)"],
                            },
                            h.id,
                          );
                        }),
                      ],
                    }),
                  ],
                }),
                r.jsx("p", {
                  className: "text-[11px] text-muted-foreground",
                  children:
                    "Ejemplos reales: Agenda Clínica WM (Dentidesk) o Ops SmartHydro. Si no ves el tuyo, cambia de sucursal.",
                }),
              ],
            }),
            r.jsxs("div", {
              className: "space-y-1.5",
              children: [
                r.jsx(Y, { htmlFor: "plan-name", children: "Nombre" }),
                r.jsx(_e, {
                  id: "plan-name",
                  value: l,
                  onChange: (h) => i(h.target.value),
                  placeholder: "Ej. Viernes ops",
                }),
              ],
            }),
            r.jsxs("div", {
              className: "space-y-1.5",
              children: [
                r.jsx(Y, { htmlFor: "plan-desc", children: "Descripción" }),
                r.jsx(st, {
                  id: "plan-desc",
                  value: d,
                  onChange: (h) => f(h.target.value),
                  rows: 2,
                  placeholder: "Qué debe lograr este plan",
                }),
              ],
            }),
            r.jsxs("div", {
              className: "grid gap-2 sm:grid-cols-2",
              children: [
                r.jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    r.jsx(Y, { children: "Agente asignado" }),
                    r.jsxs(Le, {
                      value: u || void 0,
                      onValueChange: p,
                      children: [
                        r.jsx(We, { children: r.jsx($e, { placeholder: "Elige un agente" }) }),
                        r.jsx(ze, {
                          children: n
                            .filter((h) => h.id)
                            .map((h) => r.jsx(de, { value: h.id, children: h.name || h.id }, h.id)),
                        }),
                      ],
                    }),
                  ],
                }),
                r.jsxs("div", {
                  className: "space-y-1.5",
                  children: [
                    r.jsx(Y, { children: "Workflow (opcional)" }),
                    r.jsxs(Le, {
                      value: g || "none",
                      onValueChange: x,
                      children: [
                        r.jsx(We, { children: r.jsx($e, { placeholder: "Ninguno" }) }),
                        r.jsxs(ze, {
                          children: [
                            r.jsx(de, { value: "none", children: "Ninguno" }),
                            s
                              .filter((h) => h.id)
                              .map((h) =>
                                r.jsx(de, { value: h.id, children: h.name || h.id }, h.id),
                              ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            r.jsxs("div", {
              className: "space-y-1.5",
              children: [
                r.jsx(Y, { children: "Programar para (opcional)" }),
                r.jsx(_e, { type: "datetime-local", value: C, onChange: (h) => y(h.target.value) }),
              ],
            }),
            r.jsxs("div", {
              className: "space-y-1.5",
              children: [
                r.jsx(Y, { children: "Contexto (JSON)" }),
                r.jsx(st, {
                  value: j,
                  onChange: (h) => v(h.target.value),
                  rows: 2,
                  className: "font-mono text-xs",
                  placeholder: '{"demo": true}',
                }),
              ],
            }),
            r.jsxs("div", {
              className: "space-y-2",
              children: [
                r.jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    r.jsx(Y, { children: "Ítems" }),
                    r.jsxs(F, {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "h-7",
                      onClick: () =>
                        N((h) => [
                          ...h,
                          nt({ title: `Tarea ${h.length + 1}`, kind: "agent_turn" }),
                        ]),
                      children: [r.jsx(hn, { className: "h-3.5 w-3.5 mr-1" }), "Ítem"],
                    }),
                  ],
                }),
                r.jsx("div", {
                  className: "space-y-3",
                  children: E.map((h, z) =>
                    r.jsxs(
                      "div",
                      {
                        className: "rounded-lg border p-3 space-y-2",
                        children: [
                          r.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              r.jsxs("span", {
                                className: "text-[10px] text-muted-foreground tabular-nums",
                                children: ["#", z + 1],
                              }),
                              r.jsx(_e, {
                                value: h.title,
                                onChange: (S) =>
                                  N((M) =>
                                    M.map((b) =>
                                      b.key === h.key ? { ...b, title: S.target.value } : b,
                                    ),
                                  ),
                                placeholder: "Título",
                                className: "h-8",
                              }),
                              r.jsxs(Le, {
                                value: h.kind,
                                onValueChange: (S) =>
                                  N((M) => M.map((b) => (b.key === h.key ? { ...b, kind: S } : b))),
                                children: [
                                  r.jsx(We, {
                                    className: "h-8 w-[140px] shrink-0",
                                    children: r.jsx($e, {}),
                                  }),
                                  r.jsx(ze, {
                                    children: Object.keys(Ye).map((S) =>
                                      r.jsx(de, { value: S, children: Ye[S] }, S),
                                    ),
                                  }),
                                ],
                              }),
                              r.jsx(F, {
                                type: "button",
                                size: "icon",
                                variant: "ghost",
                                className: "h-8 w-8 shrink-0",
                                disabled: E.length <= 1,
                                onClick: () => N((S) => S.filter((M) => M.key !== h.key)),
                                children: r.jsx(Dn, { className: "h-3.5 w-3.5" }),
                              }),
                            ],
                          }),
                          r.jsx("p", {
                            className: "text-[11px] text-muted-foreground",
                            children: Tn[h.kind],
                          }),
                          r.jsx(Vn, {
                            kind: h.kind,
                            fields: h,
                            onChange: (S) =>
                              N((M) => M.map((b) => (b.key === h.key ? { ...b, ...S } : b))),
                          }),
                          h.kind === "workflow" && s.length > 0
                            ? r.jsxs(Le, {
                                value: h.workflowId || "none",
                                onValueChange: (S) =>
                                  N((M) =>
                                    M.map((b) =>
                                      b.key === h.key
                                        ? {
                                            ...b,
                                            workflowId: S === "none" ? "" : S,
                                            workflowName:
                                              S === "none"
                                                ? ""
                                                : s.find((V) => V.id === S)?.name || "",
                                          }
                                        : b,
                                    ),
                                  ),
                                children: [
                                  r.jsx(We, {
                                    className: "h-8",
                                    children: r.jsx($e, { placeholder: "Elegir workflow" }),
                                  }),
                                  r.jsxs(ze, {
                                    children: [
                                      r.jsx(de, { value: "none", children: "Elegir…" }),
                                      s.map((S) =>
                                        r.jsx(de, { value: S.id, children: S.name }, S.id),
                                      ),
                                    ],
                                  }),
                                ],
                              })
                            : null,
                        ],
                      },
                      h.key,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
        r.jsxs(Sr, {
          children: [
            r.jsx(F, { variant: "outline", onClick: () => t(!1), children: "Cancelar" }),
            r.jsxs(F, {
              disabled: o || !l.trim() || !u,
              onClick: () => {
                const h = Cn(j, "Contexto");
                if (!h.ok) {
                  $.error(h.error);
                  return;
                }
                const z = h.value,
                  S = [];
                for (let b = 0; b < E.length; b++) {
                  const V = E[b];
                  if (!V.title.trim()) {
                    $.error(`El ítem #${b + 1} necesita título`);
                    return;
                  }
                  const T = On(V);
                  if (!T) return;
                  S.push({ title: V.title.trim(), kind: V.kind, sort_order: b, payload: T });
                }
                const M = Number(u);
                a({
                  name: l.trim(),
                  description: d.trim() || void 0,
                  assigned_agent: Number.isFinite(M) ? M : u,
                  workflow: g === "none" ? null : g,
                  scheduled_for: Nr(C),
                  context: z,
                  items: S,
                });
              },
              children: [
                o ? r.jsx(it, { className: "h-4 w-4 animate-spin mr-1" }) : null,
                "Crear plan",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function Ei({ open: e, onOpenChange: t, workflows: n, pending: s, onSubmit: o }) {
  const [a, l] = c.useState(nt());
  return (
    c.useEffect(() => {
      e && l(nt({ title: "Nuevo ítem", kind: "agent_turn" }));
    }, [e]),
    r.jsx(En, {
      open: e,
      onOpenChange: t,
      children: r.jsxs(In, {
        className: "sm:max-w-md",
        children: [
          r.jsx(_n, { children: r.jsx(Rn, { children: "Añadir ítem al plan" }) }),
          r.jsxs("div", {
            className: "space-y-3",
            children: [
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { children: "Título" }),
                  r.jsx(_e, {
                    value: a.title,
                    onChange: (i) => l((d) => ({ ...d, title: i.target.value })),
                  }),
                ],
              }),
              r.jsxs("div", {
                className: "space-y-1",
                children: [
                  r.jsx(Y, { children: "Tipo" }),
                  r.jsxs(Le, {
                    value: a.kind,
                    onValueChange: (i) => l((d) => ({ ...d, kind: i })),
                    children: [
                      r.jsx(We, { children: r.jsx($e, {}) }),
                      r.jsx(ze, {
                        children: Object.keys(Ye).map((i) =>
                          r.jsx(de, { value: i, children: Ye[i] }, i),
                        ),
                      }),
                    ],
                  }),
                  r.jsx("p", {
                    className: "text-[11px] text-muted-foreground",
                    children: Tn[a.kind],
                  }),
                ],
              }),
              r.jsx(Vn, { kind: a.kind, fields: a, onChange: (i) => l((d) => ({ ...d, ...i })) }),
              a.kind === "workflow" && n.length > 0
                ? r.jsxs(Le, {
                    value: a.workflowId || "none",
                    onValueChange: (i) =>
                      l((d) => ({
                        ...d,
                        workflowId: i === "none" ? "" : i,
                        workflowName: i === "none" ? "" : n.find((f) => f.id === i)?.name || "",
                      })),
                    children: [
                      r.jsx(We, { children: r.jsx($e, { placeholder: "Elegir workflow" }) }),
                      r.jsxs(ze, {
                        children: [
                          r.jsx(de, { value: "none", children: "Elegir…" }),
                          n.map((i) => r.jsx(de, { value: i.id, children: i.name }, i.id)),
                        ],
                      }),
                    ],
                  })
                : null,
            ],
          }),
          r.jsxs(Sr, {
            children: [
              r.jsx(F, { variant: "outline", onClick: () => t(!1), children: "Cancelar" }),
              r.jsxs(F, {
                disabled: s,
                onClick: () => o(a),
                children: [
                  s ? r.jsx(it, { className: "h-4 w-4 animate-spin mr-1" }) : null,
                  "Añadir",
                ],
              }),
            ],
          }),
        ],
      }),
    })
  );
}
function Ii() {
  const e = ds(),
    [t, n] = us(),
    s = t.get("id"),
    o = Ls() || Ws(),
    { data: a = [], isLoading: l, error: i, refetch: d, isFetching: f } = eo(),
    [u, p] = c.useState(s ?? ""),
    [g, x] = c.useState("inbox"),
    [C, y] = c.useState(""),
    [j, v] = c.useState(null),
    [A, D] = c.useState(!1),
    [E, N] = c.useState(!1),
    [P, R] = c.useState(!1),
    [k, U] = c.useState(null),
    [H, h] = c.useState(!1),
    [z, S] = c.useState(!1),
    { data: M, isLoading: b } = to(u || void 0),
    V = no(),
    T = ro(),
    pe = co(),
    te = so(),
    we = oo(),
    Ce = ao(),
    Q = io(),
    ce = lo(),
    w = uo(),
    q = fo(),
    { data: L = [] } = $s({ is_active: !0 }),
    { data: ne = [] } = Zs(),
    [he, oe] = c.useState(!1);
  (c.useEffect(() => {
    s && s !== u && p(s);
  }, [s, u]),
    c.useEffect(() => {
      const m = (I) => {
        if (I.key !== "Escape") return;
        const O = I.target;
        if (!(O && (O.tagName === "INPUT" || O.tagName === "TEXTAREA" || O.isContentEditable))) {
          if (E) {
            N(!1);
            return;
          }
          e("/app");
        }
      };
      return (
        window.addEventListener("keydown", m),
        () => window.removeEventListener("keydown", m)
      );
    }, [e, E]));
  const W = c.useMemo(() => {
    const m = er.find((I) => I.id === g);
    return m
      ? a.filter((I) => {
          if (!m.match(I.status)) return !1;
          if (!C.trim()) return !0;
          const O = C.toLowerCase(),
            K = (I.name || "").toLowerCase(),
            le = (I.description || "").toLowerCase();
          return K.includes(O) || le.includes(O);
        })
      : a;
  }, [a, g, C]);
  c.useEffect(() => {
    if (!u && W[0]) {
      const m = W[0].id;
      (p(m), n({ id: m }, { replace: !0 }));
    }
  }, [W, u, n]);
  const re = c.useMemo(
    () => [...(M?.items ?? [])].sort((I, O) => (I.sort_order ?? 0) - (O.sort_order ?? 0)),
    [M?.items],
  );
  c.useEffect(() => {
    if (!re.length) {
      v(null);
      return;
    }
    (!j || !re.some((m) => m.id === j)) && v(re[0].id);
  }, [re, j]);
  const G = re.find((m) => m.id === j) ?? null,
    De = (m) =>
      L.find((I) => String(I.id) === String(m))?.name || (m != null ? String(m).slice(0, 8) : "—"),
    ye = (m) => {
      (p(m), v(null), U(null), n({ id: m }, { replace: !0 }), oe(!0));
    },
    Te = (m) => {
      v(m);
      const I = typeof window < "u" && window.matchMedia("(max-width: 767px)").matches;
      N(!!I);
    },
    Pe = (m, I) => {
      const O = I?.plan_status || m?.status || "";
      O === "completed" ? x("done") : (O === "failed" || O === "cancelled") && x("failed");
      const K = (m?.items ?? []).slice().sort((J, He) => J.sort_order - He.sort_order),
        le =
          K.find((J) => J.status === "done" || J.status === "failed") ||
          K.find((J) => Gt(J).hasResult) ||
          K[0];
      (le &&
        (v(le.id), typeof window < "u" && window.matchMedia("(max-width: 767px)").matches && N(!0)),
        U({ planStatus: O || void 0, steps: I?.steps, ok: I?.ok, items: K }));
      const Ue = K.filter((J) => J.status === "done").length,
        At = K.filter((J) => J.status === "failed").length,
        Mt = K.filter(
          (J) => J.status === "pending" || J.status === "queued" || J.status === "running",
        ).length;
      $.success(
        `Corrida lista · ${Ue} ok${At ? ` · ${At} error` : ""}${Mt ? ` · ${Mt} pendientes` : ""}`,
      );
    },
    Rt = (m) => {
      const I = m
        .map((O, K) => {
          const le = re.find((Ue) => Ue.id === O);
          return !le || (le.sort_order ?? 0) === K ? null : { id: O, sort_order: K };
        })
        .filter((O) => !!O);
      I.length &&
        Promise.all(
          I.map(
            (O) =>
              new Promise((K, le) => {
                we.mutate(O, { onSuccess: () => K(), onError: (Ue) => le(Ue) });
              }),
          ),
        )
          .then(() => $.success("Orden actualizado"))
          .catch((O) => $.error(ve(O, "No se pudo reordenar")));
    };
  if (l)
    return r.jsx("div", {
      className: "h-dvh bg-background",
      children: r.jsx(zs, { variant: "workspace", className: "h-full max-w-none", padded: !1 }),
    });
  if (i) {
    const m = Bs(i),
      I = Fs(i),
      O =
        m === 404
          ? "El API no tiene la ruta work-plans. Reinicia el API y vuelve a intentar."
          : m === 403
            ? "Sin permiso o suscripción activa para ai_agents en esta sucursal."
            : m === 401
              ? "Sesión inválida — vuelve a iniciar sesión."
              : m == null
                ? "No hay respuesta del API. Revisá que el servidor y el proxy estén activos."
                : null;
    return r.jsxs("div", {
      className: "h-dvh flex flex-col items-center justify-center gap-3 px-6",
      children: [
        r.jsx(kr, {
          className: "max-w-md w-full",
          message: ve(i, "No se pudieron cargar los planes de trabajo"),
          status: m,
          detail: [I, O].filter(Boolean).join(" · ") || void 0,
          onRetry: () => {
            d();
          },
        }),
        r.jsx(F, {
          variant: "outline",
          size: "sm",
          asChild: !0,
          children: r.jsx(rt, { to: "/app", children: "Volver" }),
        }),
      ],
    });
  }
  const Fe = G
    ? {
        item: G,
        planWorkflowId: M?.workflow ?? null,
        planAgentId: M?.assigned_agent != null ? String(M.assigned_agent) : null,
        agentLabel: De(G.assigned_agent || M?.assigned_agent),
        agents: L.map((m) => ({ id: String(m.id), name: m.name || m.slug || String(m.id) })),
        busy: w.isPending || q.isPending || we.isPending || Ce.isPending,
        onRun: () => {
          w.mutate(G.id, {
            onSuccess: (m) => {
              (m.item?.id && v(String(m.item.id)),
                typeof window < "u" && window.matchMedia("(max-width: 767px)").matches && N(!0),
                $.success("Ítem ejecutado — revisa el resultado a la derecha"));
            },
            onError: (m) => $.error(ve(m, "No se pudo ejecutar el ítem")),
          });
        },
        onRetry: () => {
          q.mutate(G.id, {
            onSuccess: () => $.success("Reintento lanzado — revisa el resultado"),
            onError: (m) => $.error(ve(m, "No se pudo reintentar")),
          });
        },
        onSave: (m) => {
          we.mutate(
            { id: G.id, ...m },
            {
              onSuccess: () => $.success("Ítem guardado"),
              onError: (I) => $.error(ve(I, "No se pudo guardar el ítem")),
            },
          );
        },
        onDelete: () => S(!0),
      }
    : null;
  return r.jsxs("div", {
    className: "h-dvh flex flex-col bg-background overflow-hidden",
    children: [
      r.jsxs("div", {
        className:
          "shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-md px-3 py-2 flex items-center gap-2",
        children: [
          r.jsx(F, {
            variant: "ghost",
            size: "sm",
            className: "h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
            asChild: !0,
            children: r.jsxs(rt, {
              to: "/app",
              title: "Volver (Esc)",
              children: [
                r.jsx(Qn, { className: "h-4 w-4" }),
                r.jsx("span", { className: "text-xs font-medium", children: "Volver" }),
              ],
            }),
          }),
          r.jsx(Us, { className: "h-4 w-4 text-primary shrink-0" }),
          r.jsxs("div", {
            className: "min-w-0 flex flex-col leading-tight",
            children: [
              r.jsx("span", {
                className: "text-sm font-semibold tracking-tight truncate",
                children: "Planes",
              }),
              r.jsx("span", {
                className: "text-[10px] text-muted-foreground hidden sm:inline truncate",
                children: "Planifica pasos y ejecútalos con tus agentes",
              }),
            ],
          }),
          r.jsx("span", {
            className:
              "ml-1 hidden md:inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary",
            children: "Preview",
          }),
          r.jsxs("div", {
            className: "ml-auto flex items-center gap-2",
            children: [
              o ? r.jsx(Hs, {}) : null,
              r.jsx(F, {
                size: "sm",
                variant: "ghost",
                className: "h-8 hidden md:inline-flex",
                asChild: !0,
                children: r.jsx(rt, { to: "/app/workflows", children: "Workflows" }),
              }),
              r.jsxs(F, {
                size: "sm",
                className: "h-8 gap-1.5 shadow-sm shadow-primary/20",
                onClick: () => D(!0),
                children: [r.jsx(hn, { className: "h-3.5 w-3.5" }), "Nuevo plan"],
              }),
            ],
          }),
        ],
      }),
      r.jsxs("div", {
        className: "flex flex-1 min-h-0 overflow-hidden",
        children: [
          r.jsxs("aside", {
            className: X(
              "w-full md:w-[320px] lg:w-[360px] border-r border-border/40 bg-muted/15 flex-col shrink-0 min-h-0",
              he && u ? "hidden md:flex" : "flex",
            ),
            children: [
              r.jsxs("div", {
                className: "border-b border-border/40 px-3 pt-3 pb-2.5 space-y-2.5 shrink-0",
                children: [
                  r.jsxs("div", {
                    className: "flex items-baseline justify-between gap-2 px-0.5",
                    children: [
                      r.jsx("p", {
                        className: "text-xs font-semibold tracking-tight text-foreground",
                        children: "Bandeja",
                      }),
                      r.jsxs("p", {
                        className: "text-[10px] text-muted-foreground tabular-nums",
                        children: [W.length, " plan", W.length === 1 ? "" : "es"],
                      }),
                    ],
                  }),
                  r.jsx("div", {
                    className: "flex gap-0.5 rounded-lg bg-muted/30 p-0.5",
                    children: er.map((m) => {
                      const I = a.filter((O) => m.match(O.status)).length;
                      return r.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => x(m.id),
                          className: X(
                            "flex-1 rounded-md px-1.5 py-1.5 text-[10px] font-medium transition-colors",
                            g === m.id
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          ),
                          children: [
                            m.label,
                            r.jsx("span", {
                              className: "ml-0.5 tabular-nums opacity-60",
                              children: I,
                            }),
                          ],
                        },
                        m.id,
                      );
                    }),
                  }),
                  r.jsxs("div", {
                    className: "relative",
                    children: [
                      r.jsx(qs, {
                        className:
                          "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground",
                      }),
                      r.jsx(_e, {
                        value: C,
                        onChange: (m) => y(m.target.value),
                        placeholder: "Buscar en la bandeja…",
                        className: "h-8 pl-8 text-sm bg-background/50",
                      }),
                    ],
                  }),
                ],
              }),
              r.jsx("div", {
                className: "flex-1 min-h-0 overflow-y-auto overscroll-contain",
                children: r.jsx("div", {
                  className: "divide-y divide-border/40",
                  children:
                    W.length === 0
                      ? r.jsxs("div", {
                          className: "text-center py-10 px-4 space-y-3",
                          children: [
                            r.jsx("p", {
                              className: "text-xs text-muted-foreground",
                              children:
                                "Bandeja vacía. Usa una plantilla de tu sucursal o crea un plan nuevo.",
                            }),
                            r.jsx(F, {
                              size: "sm",
                              variant: "outline",
                              onClick: () => D(!0),
                              children: "Usar plantilla",
                            }),
                          ],
                        })
                      : W.map((m) => {
                          const I = u === m.id,
                            O = De(m.assigned_agent),
                            K = lt(m.status),
                            le = m.items?.length ?? 0;
                          return r.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => ye(m.id),
                              className: X(
                                "w-full text-left px-3 py-3 transition-colors relative cursor-pointer",
                                I ? "bg-primary/10" : "hover:bg-muted/35",
                              ),
                              children: [
                                I
                                  ? r.jsx("span", {
                                      "aria-hidden": !0,
                                      className:
                                        "absolute left-0 top-0 bottom-0 w-[3px] bg-primary",
                                    })
                                  : null,
                                r.jsxs("div", {
                                  className: "flex gap-2.5 min-w-0",
                                  children: [
                                    r.jsxs("div", {
                                      className: "relative shrink-0 mt-0.5",
                                      children: [
                                        r.jsx("span", {
                                          className: X(
                                            "inline-flex h-9 w-9 items-center justify-center rounded-full ring-1",
                                            m.assigned_agent
                                              ? "bg-primary/15 text-primary ring-primary/30"
                                              : "bg-muted/80 text-muted-foreground ring-border/50",
                                          ),
                                          title: m.assigned_agent
                                            ? `Agente: ${O}`
                                            : "Sin agente asignado",
                                          children: r.jsx(vr, { className: "h-4 w-4" }),
                                        }),
                                        r.jsx("span", {
                                          "aria-hidden": !0,
                                          className: X(
                                            "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                                            K === "success" && "bg-success",
                                            K === "failed" && "bg-destructive",
                                            K === "running" && "bg-info",
                                            K === "pending" && "bg-warning",
                                            (K === "idle" || K === "skipped" || !K) &&
                                              "bg-muted-foreground/50",
                                          ),
                                        }),
                                      ],
                                    }),
                                    r.jsxs("div", {
                                      className: "min-w-0 flex-1",
                                      children: [
                                        r.jsxs("div", {
                                          className: "flex items-baseline gap-2",
                                          children: [
                                            r.jsx("p", {
                                              className: X(
                                                "text-[13px] truncate flex-1 leading-snug",
                                                I ? "font-semibold text-foreground" : "font-medium",
                                              ),
                                              children: m.name,
                                            }),
                                            r.jsx("span", {
                                              className:
                                                "text-[10px] text-muted-foreground tabular-nums shrink-0",
                                              children: Vs(m.modified || m.created),
                                            }),
                                          ],
                                        }),
                                        r.jsxs("p", {
                                          className:
                                            "mt-0.5 text-[11px] text-muted-foreground truncate",
                                          children: [
                                            r.jsx("span", {
                                              className: "text-foreground/70",
                                              children: O,
                                            }),
                                            r.jsx("span", {
                                              className: "mx-1 opacity-40",
                                              children: "·",
                                            }),
                                            r.jsx("span", { children: gn(m.status) }),
                                            r.jsx("span", {
                                              className: "mx-1 opacity-40",
                                              children: "·",
                                            }),
                                            r.jsxs("span", {
                                              className: "tabular-nums",
                                              children: [le, " paso", le === 1 ? "" : "s"],
                                            }),
                                          ],
                                        }),
                                        r.jsx("p", {
                                          className:
                                            "mt-1 text-[11px] text-muted-foreground/90 line-clamp-2 leading-snug",
                                          children:
                                            m.description?.trim() ||
                                            "Plan de agentes y flujos · sin descripción",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            },
                            m.id,
                          );
                        }),
                }),
              }),
            ],
          }),
          r.jsx("section", {
            className: X(
              "flex-1 min-h-0 min-w-0 flex-col border-r border-border/40 relative overflow-hidden",
              "bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(45,212,191,0.08),transparent_55%),linear-gradient(to_bottom,transparent,var(--background))]",
              he && u ? "flex" : "hidden md:flex",
            ),
            children: u
              ? b && !M
                ? r.jsx(Ks, {})
                : r.jsxs(r.Fragment, {
                    children: [
                      r.jsx("div", {
                        className: "md:hidden shrink-0 border-b px-3 py-2",
                        children: r.jsxs(F, {
                          size: "sm",
                          variant: "ghost",
                          className: "h-8 gap-1",
                          onClick: () => oe(!1),
                          children: [r.jsx(Qn, { className: "h-3.5 w-3.5" }), "Planes"],
                        }),
                      }),
                      r.jsx(Ao, {
                        plan: M,
                        agentLabel: De(M?.assigned_agent),
                        itemCount: re.length,
                        doneCount: re.filter((m) => m.status === "done").length,
                        busy: Q.isPending || ce.isPending || T.isPending || pe.isPending,
                        onRunNext: () => {
                          u &&
                            Q.mutate(u, {
                              onSuccess: (m) => {
                                Pe(m.plan, m.result);
                              },
                              onError: (m) =>
                                $.error(ve(m, "No se pudo ejecutar el siguiente ítem")),
                            });
                        },
                        onRunAll: () => {
                          u &&
                            ce.mutate(
                              { id: u, stopOnError: !1 },
                              {
                                onSuccess: (m) => {
                                  Pe(m.plan, m.result);
                                },
                                onError: (m) =>
                                  $.error(ve(m, "No se pudo ejecutar el plan completo")),
                              },
                            );
                        },
                        onCancel: () => {
                          u &&
                            T.mutate(
                              { id: u, status: "cancelled" },
                              {
                                onSuccess: () => $.success("Plan cancelado"),
                                onError: (m) => $.error(ve(m, "No se pudo cancelar")),
                              },
                            );
                        },
                        onDelete: () => h(!0),
                        onSaveMeta: (m) => {
                          u &&
                            T.mutate(
                              { id: u, ...m },
                              {
                                onSuccess: () => $.success("Plan actualizado"),
                                onError: (I) => $.error(ve(I, "No se pudo guardar")),
                              },
                            );
                        },
                      }),
                      k
                        ? r.jsxs("div", {
                            className:
                              "shrink-0 mx-3 mt-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 space-y-2",
                            children: [
                              r.jsxs("div", {
                                className: "flex items-start justify-between gap-2",
                                children: [
                                  r.jsxs("div", {
                                    className: "min-w-0",
                                    children: [
                                      r.jsxs("p", {
                                        className: "text-xs font-medium text-foreground",
                                        children: [
                                          "Resultados de la corrida",
                                          k.planStatus
                                            ? r.jsxs("span", {
                                                className: "text-muted-foreground font-normal",
                                                children: [" ", "· ", gn(k.planStatus)],
                                              })
                                            : null,
                                        ],
                                      }),
                                      r.jsxs("p", {
                                        className: "text-[11px] text-muted-foreground mt-0.5",
                                        children: [
                                          k.steps != null ? `${k.steps} paso(s) · ` : "",
                                          "Toca un ítem para ver el detalle a la derecha.",
                                        ],
                                      }),
                                    ],
                                  }),
                                  r.jsx(F, {
                                    type: "button",
                                    size: "sm",
                                    variant: "ghost",
                                    className: "h-7 px-2 text-[11px] shrink-0",
                                    onClick: () => U(null),
                                    children: "Cerrar",
                                  }),
                                ],
                              }),
                              r.jsx("ul", {
                                className: "space-y-1 max-h-40 overflow-y-auto",
                                children: k.items.map((m, I) => {
                                  const O =
                                    Tr(m) || (m.status === "pending" ? "Sin ejecutar" : "—");
                                  return r.jsx(
                                    "li",
                                    {
                                      children: r.jsxs("button", {
                                        type: "button",
                                        className: X(
                                          "w-full text-left rounded-lg px-2 py-1.5 text-[11px] transition-colors cursor-pointer",
                                          j === m.id
                                            ? "bg-primary/15 text-foreground"
                                            : "hover:bg-muted/60 text-muted-foreground",
                                        ),
                                        onClick: () => Te(m.id),
                                        children: [
                                          r.jsxs("span", {
                                            className: "font-medium text-foreground/90",
                                            children: ["#", I + 1, " ", m.title],
                                          }),
                                          r.jsx(jt, { label: bt(m.status), tone: lt(m.status) }),
                                          r.jsx("span", {
                                            className: "block mt-0.5 line-clamp-2 opacity-80",
                                            children: O,
                                          }),
                                        ],
                                      }),
                                    },
                                    m.id,
                                  );
                                }),
                              }),
                            ],
                          })
                        : null,
                      r.jsxs("div", {
                        className:
                          "shrink-0 px-4 py-2.5 border-b border-border/40 flex items-center gap-2 bg-background/40 backdrop-blur-sm",
                        children: [
                          r.jsx("p", {
                            className: "text-[11px] text-muted-foreground flex-1",
                            children:
                              "Flujo · arrastra el asa ⋮⋮ para reordenar · clic para ver detalle",
                          }),
                          r.jsxs(F, {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 gap-1",
                            onClick: () => R(!0),
                            children: [r.jsx(hn, { className: "h-3.5 w-3.5" }), "Añadir paso"],
                          }),
                        ],
                      }),
                      r.jsx("div", {
                        className: "flex-1 min-h-0 overflow-y-auto overscroll-contain",
                        children: r.jsx("div", {
                          className: "p-5 max-w-2xl mx-auto w-full",
                          children:
                            re.length === 0
                              ? r.jsxs("div", {
                                  className:
                                    "text-center py-14 space-y-3 rounded-2xl border border-dashed border-border/50 bg-background/40",
                                  children: [
                                    r.jsx("p", {
                                      className: "text-sm text-muted-foreground",
                                      children:
                                        "Este plan aún no tiene pasos. Añade un agente, skill, workflow o nota.",
                                    }),
                                    r.jsx(F, {
                                      size: "sm",
                                      onClick: () => R(!0),
                                      children: "Añadir paso",
                                    }),
                                  ],
                                })
                              : r.jsx(yi, {
                                  items: re,
                                  selectedItemId: j,
                                  disabled: we.isPending,
                                  onSelect: Te,
                                  onReorder: Rt,
                                }),
                        }),
                      }),
                    ],
                  })
              : r.jsx(pn, {
                  className: "flex-1 border-0 bg-transparent rounded-none",
                  title: "Elige un plan a la izquierda o crea uno para abrir el lienzo de trabajo.",
                  action: r.jsx(F, {
                    size: "sm",
                    variant: "outline",
                    onClick: () => D(!0),
                    children: "Nuevo plan",
                  }),
                }),
          }),
          r.jsx("aside", {
            className:
              "hidden md:flex w-[400px] lg:w-[440px] bg-muted/10 flex-col shrink-0 min-h-0 overflow-hidden border-l border-border/40",
            children: Fe
              ? r.jsx(hr, { ...Fe })
              : r.jsx(pn, {
                  className: "flex-1 border-0 bg-transparent rounded-none",
                  title: "Elige un paso del flujo para ver archivos, métricas e insumos.",
                }),
          }),
        ],
      }),
      r.jsx(Js, {
        open: E && !!Fe,
        onOpenChange: (m) => {
          N(m);
        },
        children: r.jsxs(Xs, {
          side: "right",
          className: "w-full sm:max-w-md p-0 flex flex-col gap-0 h-dvh",
          children: [
            r.jsx(Gs, {
              className: "px-4 py-3 border-b text-left shrink-0 pr-12",
              children: r.jsx(Ys, { className: "text-sm", children: "Paso del flujo" }),
            }),
            r.jsx("div", {
              className: "flex-1 min-h-0 flex flex-col overflow-hidden",
              children: Fe ? r.jsx(hr, { ...Fe }) : null,
            }),
          ],
        }),
      }),
      r.jsx(Di, {
        open: A,
        onOpenChange: D,
        agents: L.map((m) => ({ id: String(m.id), name: m.name, slug: m.slug || "" })),
        workflows: ne.map((m) => ({ id: m.id, name: m.name })),
        pending: V.isPending,
        onSubmit: (m) => {
          V.mutate(m, {
            onSuccess: (I) => {
              ($.success("Plan creado"), D(!1), ye(I.id), x("inbox"));
            },
            onError: (I) => $.error(ve(I, "No se pudo crear el plan")),
          });
        },
      }),
      r.jsx(Ei, {
        open: P,
        onOpenChange: R,
        workflows: ne.map((m) => ({ id: m.id, name: m.name })),
        pending: te.isPending,
        onSubmit: (m) => {
          if (!u) return;
          const I = On(m);
          if (I) {
            if (!m.title.trim()) {
              $.error("El ítem necesita un título");
              return;
            }
            te.mutate(
              { plan: u, title: m.title.trim(), kind: m.kind, sort_order: re.length, payload: I },
              {
                onSuccess: () => {
                  ($.success("Ítem añadido"), R(!1));
                },
                onError: (O) => $.error(ve(O, "No se pudo añadir el ítem")),
              },
            );
          }
        },
      }),
      r.jsx(Zn, {
        open: H,
        onOpenChange: h,
        title: "¿Eliminar este plan?",
        description: M?.name
          ? `Se eliminará «${M.name}» con todos sus pasos y resultados. Esta acción no se puede deshacer.`
          : "Se eliminará el plan con todos sus pasos y resultados. Esta acción no se puede deshacer.",
        confirmLabel: "Eliminar plan",
        destructive: !0,
        busy: pe.isPending,
        onConfirm: () => {
          u &&
            pe.mutate(u, {
              onSuccess: () => {
                ($.success("Plan eliminado"), h(!1), p(""), n({}, { replace: !0 }));
              },
              onError: (m) => $.error(ve(m, "No se pudo eliminar")),
            });
        },
      }),
      r.jsx(Zn, {
        open: z,
        onOpenChange: S,
        title: "¿Quitar este paso del plan?",
        description: G?.title
          ? `Se quitará «${G.title}» del flujo. Esta acción no se puede deshacer.`
          : "Se quitará el paso del flujo. Esta acción no se puede deshacer.",
        confirmLabel: "Quitar paso",
        destructive: !0,
        busy: Ce.isPending,
        onConfirm: () => {
          G &&
            Ce.mutate(
              { id: G.id, planId: u },
              {
                onSuccess: () => {
                  ($.success("Ítem eliminado"), S(!1), N(!1), v(null));
                },
                onError: (m) => $.error(ve(m, "No se pudo eliminar el ítem")),
              },
            );
        },
      }),
    ],
  });
}
function Oi() {
  return r.jsx(Ii, {});
}
export { Oi as default };
