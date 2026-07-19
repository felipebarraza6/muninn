/**
 * Muninn / Yggdra chat widget loader.
 * Usage:
 *   <script src="https://YOUR_HOST/widget.js" data-channel-id="UUID" async></script>
 *
 * Optional data-* attributes:
 *   data-position="bottom-right|bottom-left"
 *   data-color="#2dd4bf"
 *   data-label="Chat"
 *   data-base-url="https://YOUR_HOST"  (defaults to script origin)
 */
(function () {
  "use strict";

  var SCRIPT =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  if (!SCRIPT) return;

  var channelId = SCRIPT.getAttribute("data-channel-id");
  if (!channelId) {
    console.error("[yggdra-widget] Missing data-channel-id");
    return;
  }

  var position = SCRIPT.getAttribute("data-position") || "bottom-right";
  var color = SCRIPT.getAttribute("data-color") || "#2dd4bf";
  var label = SCRIPT.getAttribute("data-label") || "Chat";
  var baseUrl =
    SCRIPT.getAttribute("data-base-url") ||
    (function () {
      try {
        return new URL(SCRIPT.src).origin;
      } catch (e) {
        return window.location.origin;
      }
    })();

  var ROOT_ID = "yggdra-chat-widget-root";
  if (document.getElementById(ROOT_ID)) return;

  var root = document.createElement("div");
  root.id = ROOT_ID;
  root.setAttribute("data-yggdra-widget", "1");
  Object.assign(root.style, {
    all: "initial",
    position: "fixed",
    zIndex: "2147483000",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  });

  var isLeft = position === "bottom-left";
  root.style.bottom = "20px";
  if (isLeft) root.style.left = "20px";
  else root.style.right = "20px";

  var open = false;

  var panel = document.createElement("div");
  Object.assign(panel.style, {
    display: "none",
    width: "min(380px, calc(100vw - 32px))",
    height: "min(560px, calc(100vh - 100px))",
    marginBottom: "12px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#0b1220",
  });

  var iframe = document.createElement("iframe");
  iframe.title = label;
  iframe.allow = "clipboard-write";
  iframe.src = baseUrl.replace(/\/+$/, "") + "/embed/chat/" + encodeURIComponent(channelId);
  Object.assign(iframe.style, {
    border: "0",
    width: "100%",
    height: "100%",
    display: "block",
    background: "transparent",
  });
  panel.appendChild(iframe);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  Object.assign(btn.style, {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "56px",
    height: "56px",
    padding: "0 18px",
    border: "0",
    borderRadius: "999px",
    cursor: "pointer",
    background: color,
    color: "#041016",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  });

  var icon = document.createElement("span");
  icon.innerHTML =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  icon.style.display = "inline-flex";

  var text = document.createElement("span");
  text.textContent = label;

  btn.appendChild(icon);
  btn.appendChild(text);

  function setOpen(next) {
    open = next;
    panel.style.display = open ? "block" : "none";
    text.textContent = open ? "Cerrar" : label;
  }

  btn.addEventListener("click", function () {
    setOpen(!open);
  });

  // Mobile: full-ish panel
  function layout() {
    if (window.innerWidth < 480) {
      panel.style.width = "calc(100vw - 24px)";
      panel.style.height = "min(70vh, 560px)";
      root.style.left = "12px";
      root.style.right = "12px";
      root.style.bottom = "12px";
      if (!isLeft) root.style.display = "flex";
      root.style.flexDirection = "column";
      root.style.alignItems = isLeft ? "flex-start" : "flex-end";
    } else {
      panel.style.width = "min(380px, calc(100vw - 32px))";
      panel.style.height = "min(560px, calc(100vh - 100px))";
      root.style.bottom = "20px";
      if (isLeft) {
        root.style.left = "20px";
        root.style.right = "auto";
      } else {
        root.style.right = "20px";
        root.style.left = "auto";
      }
    }
  }
  layout();
  window.addEventListener("resize", layout);

  root.appendChild(panel);
  root.appendChild(btn);
  document.body.appendChild(root);
})();
