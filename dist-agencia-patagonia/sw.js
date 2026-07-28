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
        { url: "index.html", revision: "62e3f437995c173716420fafc9ea15bc" },
        { url: "assets/conocimiento.datos-BumPYuQW.js", revision: null },
        { url: "assets/index-BvBbVnNp.js", revision: null },
        { url: "assets/workbox-window.prod.es5-BBnX5xw4.js", revision: null },
        { url: "assets/canales._id-iMhbIfh8.js", revision: null },
        { url: "assets/channel-config-fields-bCmhv8lU.js", revision: null },
        { url: "assets/canales-Dq01kPM4.js", revision: null },
        { url: "assets/vendor-charts-l0_txfiz.js", revision: null },
        { url: "assets/vendor-query-IAyuTf1L.js", revision: null },
        { url: "assets/forgot-password-1-ZnChaq.js", revision: null },
        { url: "assets/conocimiento.nuevo-CroG53E7.js", revision: null },
        { url: "assets/workflows-BLSUEtgC.js", revision: null },
        { url: "assets/apis._id-D123NPTq.js", revision: null },
        { url: "assets/conocimiento-80Cn2EGm.js", revision: null },
        { url: "assets/funciones-BtF-LVPF.js", revision: null },
        { url: "assets/funciones.nuevo-y8xdMU1k.js", revision: null },
        { url: "assets/index-CFDSRtYp.js", revision: null },
        { url: "assets/studio-chat-BnuhLJ6X.css", revision: null },
        { url: "assets/admin-CJj1SvsI.js", revision: null },
        { url: "assets/reset-password-BJucumyf.js", revision: null },
        { url: "assets/workflows._id-o6zQSVeV.js", revision: null },
        { url: "assets/funciones._id-B8IRQL6T.js", revision: null },
        { url: "assets/vendor-motion-BE8MBDzG.js", revision: null },
        { url: "assets/vendor-react-DUYfdZnL.js", revision: null },
        { url: "assets/workflowCatalog-GgI4Rjhb.js", revision: null },
        { url: "assets/AuthPixelBrand-CVHvLKKZ.js", revision: null },
        { url: "assets/embed.chat._id-BaIl_B2w.js", revision: null },
        { url: "assets/external-api-Dqhtjsyy.js", revision: null },
        { url: "assets/apis-CdXNIRrD.js", revision: null },
        { url: "assets/EmbedChatPanel-HU6TxDy5.js", revision: null },
        { url: "assets/useWorkflows-DImh_Y0C.js", revision: null },
        { url: "assets/context-menu-BI21iVdg.js", revision: null },
        { url: "assets/perfil-DsF6Edr6.js", revision: null },
        { url: "assets/index-DXSvrHjU.css", revision: null },
        { url: "assets/conversaciones-Dg12_eMb.js", revision: null },
        { url: "assets/planes-DhCdE9pD.js", revision: null },
        { url: "assets/useChannels-Cmbbb5sU.js", revision: null },
        { url: "assets/conocimiento._id-BX_I3Hn-.js", revision: null },
        { url: "assets/studio-chat-BBQUCckT.js", revision: null },
        { url: "assets/formula-expression-editor-D1EGb6DP.js", revision: null },
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
