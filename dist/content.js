"use strict";
(() => {
  // src/entrypoints/content.ts
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    const m = msg || {};
    (async () => {
      switch (m.type) {
        case "VKX_GET_PAGE": {
          sendResponse({ ok: true, url: location.href, title: document.title });
          break;
        }
        default:
          sendResponse({ ok: false, error: "unknown_message" });
      }
    })().catch((err) => {
      sendResponse({ ok: false, error: String(err?.message || err) });
    });
    return true;
  });
})();
//# sourceMappingURL=content.js.map
