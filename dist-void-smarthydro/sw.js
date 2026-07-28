if (!self.define) {
  let s,
    e = {};
  const n = (n, l) => (
    (n = new URL(n + ".js", l).href),
    e[n] ||
      new Promise((e) => {
        if ("document" in self) {
          const s = document.createElement("script");
          ((s.src = n), (s.onload = e), document.head.appendChild(s));
        } else ((s = n), importScripts(n), e());
      }).then(() => {
        let s = e[n];
        if (!s) throw new Error(`Module ${n} didn’t register its module`);
        return s;
      })
  );
  self.define = (l, i) => {
    const r = s || ("document" in self ? document.currentScript.src : "") || location.href;
    if (e[r]) return;
    let o = {};
    const u = (s) => n(s, r),
      t = { module: { uri: r }, exports: o, require: u };
    e[r] = Promise.all(l.map((s) => t[s] || u(s))).then((s) => (i(...s), o));
  };
}
define(["./workbox-493602a2"], function (s) {
  "use strict";
  (self.addEventListener("message", (s) => {
    s.data && "SKIP_WAITING" === s.data.type && self.skipWaiting();
  }),
    s.precacheAndRoute(
      [
        { url: "widget.js", revision: "db804aa09d655b330fa8df8c63a361ca" },
        { url: "index.html", revision: "22c79dde0604604b3dd8806a7dbd7aad" },
        { url: "assets/funciones._id-D5odz40O.js", revision: null },
        { url: "assets/workflows-C7mK2Wi9.js", revision: null },
        { url: "assets/planes-CIMkC8x3.js", revision: null },
        { url: "assets/workbox-window.prod.es5-BBnX5xw4.js", revision: null },
        { url: "assets/vendor-charts-l0_txfiz.js", revision: null },
        { url: "assets/funciones.nuevo-C3oE2wx7.js", revision: null },
        { url: "assets/vendor-query-IAyuTf1L.js", revision: null },
        { url: "assets/workflows._id-3qH3HccR.js", revision: null },
        { url: "assets/forgot-password-B_xmyVh5.js", revision: null },
        { url: "assets/apis._id-DKc-Xiup.js", revision: null },
        { url: "assets/EmbedChatPanel-Cm9Fl00A.js", revision: null },
        { url: "assets/studio-chat-Bi-RYdat.js", revision: null },
        { url: "assets/canales._id-BgsZtwa5.js", revision: null },
        { url: "assets/studio-chat-BnuhLJ6X.css", revision: null },
        { url: "assets/conocimiento.nuevo-De-j31hr.js", revision: null },
        { url: "assets/perfil-BK1WFsrp.js", revision: null },
        { url: "assets/conocimiento-DqXDAZ7-.js", revision: null },
        { url: "assets/vendor-motion-BE8MBDzG.js", revision: null },
        { url: "assets/useChannels-4JqEwRHd.js", revision: null },
        { url: "assets/AuthPixelBrand-DV52CHSR.js", revision: null },
        { url: "assets/vendor-react-DUYfdZnL.js", revision: null },
        { url: "assets/workflowCatalog-GgI4Rjhb.js", revision: null },
        { url: "assets/channel-config-fields-Bq6Jumyl.js", revision: null },
        { url: "assets/reset-password-WY9yfsLI.js", revision: null },
        { url: "assets/apis-XN_NQ6u0.js", revision: null },
        { url: "assets/funciones-B3yolDxo.js", revision: null },
        { url: "assets/external-api-Dqhtjsyy.js", revision: null },
        { url: "assets/conocimiento.datos-B9pIQyw2.js", revision: null },
        { url: "assets/index-DXSvrHjU.css", revision: null },
        { url: "assets/canales-CLQQaTt_.js", revision: null },
        { url: "assets/context-menu-6H0gO2RR.js", revision: null },
        { url: "assets/conversaciones-BKc6sG-6.js", revision: null },
        { url: "assets/useWorkflows-BDj5QeFI.js", revision: null },
        { url: "assets/admin-CEWZN_UE.js", revision: null },
        { url: "assets/embed.chat._id-CW7yxRQH.js", revision: null },
        { url: "assets/formula-expression-editor-BpTGI7wd.js", revision: null },
        { url: "assets/index-E7U1k6KS.js", revision: null },
        { url: "assets/index-B63CxC74.js", revision: null },
        { url: "assets/conocimiento._id-2Edo3WcO.js", revision: null },
        { url: "favicon.png", revision: "e2bbd0ca0de6b6eaf9cc966a06a09882" },
        { url: "manifest.webmanifest", revision: "ff2da5c72bcef38836e76d41764bbf57" },
      ],
      {},
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      new s.NavigationRoute(s.createHandlerBoundToURL("/index.html"), {
        denylist: [/^\/api\//, /^\/media\//],
      }),
    ),
    s.registerRoute(({ url: s }) => s.pathname.startsWith("/api/"), new s.NetworkOnly(), "GET"),
    s.registerRoute(
      ({ url: s }) => s.pathname.startsWith("/media/"),
      new s.NetworkFirst({
        cacheName: "media-cache",
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET",
    ));
});
