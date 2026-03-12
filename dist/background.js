"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/shared/util.ts
  function now() {
    return Date.now();
  }
  function uid(prefix = "run") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }
  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  function stripQuery(url) {
    try {
      const u = new URL(url);
      u.search = "";
      u.hash = "";
      return u.toString();
    } catch {
      return url;
    }
  }

  // src/vk/context.ts
  function toInt(s) {
    const n = Number(s);
    return Number.isFinite(n) ? Math.trunc(n) : void 0;
  }
  function detectTargetFromUrl(rawUrl) {
    const url = stripQuery(rawUrl);
    let u = null;
    try {
      u = new URL(url);
    } catch {
    }
    const path = (u ? u.pathname : url).replace(/^\/+/, "");
    const first = path.split("/")[0] || "";
    const target = { kind: "unknown", url };
    if (/^id\d+$/.test(first)) {
      target.kind = "user";
      target.id = toInt(first.slice(2));
      return target;
    }
    if (/^(club|public)\d+$/.test(first)) {
      target.kind = "group";
      target.id = toInt(first.replace(/^(club|public)/, ""));
      return target;
    }
    if (/^wall-?\d+_\d+$/.test(first)) {
      const m = first.match(/^wall(-?\d+)_/);
      const owner = m ? toInt(m[1]) : void 0;
      target.ownerId = owner;
      if (typeof owner === "number") {
        if (owner < 0) {
          target.kind = "group";
          target.id = Math.abs(owner);
        } else {
          target.kind = "user";
          target.id = owner;
        }
      }
      return target;
    }
    if (/^(video|photo|topic)-?\d+_\d+/.test(first)) {
      const m = first.match(/^(?:video|photo|topic)(-?\d+)_/);
      const owner = m ? toInt(m[1]) : void 0;
      target.ownerId = owner;
      if (typeof owner === "number") {
        if (owner < 0) {
          target.kind = "group";
          target.id = Math.abs(owner);
        } else {
          target.kind = "user";
          target.id = owner;
        }
      }
      return target;
    }
    if (first && /^[A-Za-z0-9_.]{3,}$/.test(first)) {
      target.kind = "unknown";
      target.screenName = first;
      return target;
    }
    return target;
  }

  // src/vk/api.ts
  var VkApiClient = class {
    constructor(opts) {
      __publicField(this, "token");
      __publicField(this, "v");
      this.token = opts.token;
      this.v = opts.apiVersion || "5.131";
    }
    setToken(token) {
      this.token = token;
    }
    async call(method, params) {
      if (!this.token) return { ok: false, error: { message: "missing_access_token" } };
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(params || {})) {
        if (v === void 0 || v === null) continue;
        sp.set(k, String(v));
      }
      sp.set("access_token", this.token);
      sp.set("v", this.v);
      const url = `https://api.vk.com/method/${encodeURIComponent(method)}?${sp.toString()}`;
      try {
        const r = await fetch(url, { method: "GET" });
        const j = await r.json();
        if (j && j.error) return { ok: false, error: j.error };
        return { ok: true, response: j.response };
      } catch (err) {
        return { ok: false, error: { message: String(err?.message || err) } };
      }
    }
    async resolveScreenName(screenName) {
      return await this.call("utils.resolveScreenName", { screen_name: screenName });
    }
    /** Normalises a TargetRef if it has only screenName by calling utils.resolveScreenName. */
    async resolveTarget(t) {
      if ((t.kind === "user" || t.kind === "group") && typeof t.id === "number") return t;
      if (!t.screenName) return t;
      const res = await this.resolveScreenName(t.screenName);
      if (!res.ok || !res.response) return t;
      const type = String(res.response.type || "");
      const objectId = Number(res.response.object_id);
      if (type === "user" && Number.isFinite(objectId)) return { ...t, kind: "user", id: objectId };
      if (type === "group" && Number.isFinite(objectId)) return { ...t, kind: "group", id: objectId };
      return t;
    }
  };

  // src/vk/store.ts
  var TOKEN_KEY = "vkx_token";
  var ACTIVE_CASE_KEY = "vkx_active_case";
  var DB_NAME = "vkxtract";
  var DB_VERSION = 1;
  var STORE_BUNDLES = "bundles";
  var dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_BUNDLES)) {
          db.createObjectStore(STORE_BUNDLES, { keyPath: "key" });
        }
      };
      req.onsuccess = () => resolve(req.result);
    });
    return dbPromise;
  }
  function idbGet(db, store, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const st = tx.objectStore(store);
      const req = st.get(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  function idbPut(db, store, value) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const st = tx.objectStore(store);
      const req = st.put(value);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  }
  function idbDelete(db, store, key) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const st = tx.objectStore(store);
      const req = st.delete(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  }
  function idbClear(db, store) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const st = tx.objectStore(store);
      const req = st.clear();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve();
    });
  }
  function emptyBundle(target) {
    return {
      schema: "vkxtract.capture.v1",
      createdAt: now(),
      lastUpdatedAt: now(),
      lastPageUrl: void 0,
      target: target || { kind: "unknown" },
      runs: []
    };
  }
  function caseKeyFromTarget(t) {
    if (!t) return "unknown";
    const owner = typeof t.ownerId === "number" ? t.ownerId : t.kind === "group" && typeof t.id === "number" ? -Math.abs(t.id) : t.kind === "user" && typeof t.id === "number" ? t.id : void 0;
    if (typeof owner === "number" && Number.isFinite(owner) && owner !== 0) return String(owner);
    const sn = t.screenName && String(t.screenName).trim() ? String(t.screenName).trim().toLowerCase() : "";
    if (sn) return `sn:${sn}`;
    return "unknown";
  }
  async function getActiveCaseKey() {
    const r = await chrome.storage.local.get({ [ACTIVE_CASE_KEY]: "unknown" });
    return String(r[ACTIVE_CASE_KEY] || "unknown");
  }
  async function setActiveCaseKey(key) {
    await chrome.storage.local.set({ [ACTIVE_CASE_KEY]: key || "unknown" });
  }
  async function loadBundleByKey(key) {
    const db = await openDb();
    const rec = await idbGet(db, STORE_BUNDLES, key);
    const b = rec?.bundle;
    if (b && b.schema === "vkxtract.capture.v1" && Array.isArray(b.runs)) return b;
    const fresh = emptyBundle();
    await idbPut(db, STORE_BUNDLES, { key, bundle: fresh });
    return fresh;
  }
  async function saveBundleByKey(key, bundle) {
    const db = await openDb();
    await idbPut(db, STORE_BUNDLES, { key, bundle });
  }
  var REPLACE_ACTIONS = /* @__PURE__ */ new Set([
    "users.get",
    "groups.getById",
    "friends.get",
    "groups.getMembers",
    "users.getSubscriptions",
    "groups.get",
    "photos.getAll",
    "photos.get",
    "photos.getAlbums",
    "video.get",
    "video.getAlbums",
    "stories.get",
    "database.getCitiesById",
    "users.get_related",
    "users.get_engagement_top_photos",
    "users.get_engagement_top_videos",
    "vkx.photos.enrich",
    "vkx.videos.enrich",
    "vkx.users.resolve",
    "gifts.get",
    "users.get_gifts_senders"
  ]);
  async function getToken() {
    const r = await chrome.storage.local.get({ [TOKEN_KEY]: "" });
    return String(r[TOKEN_KEY] || "");
  }
  async function setToken(token) {
    await chrome.storage.local.set({ [TOKEN_KEY]: token || "" });
  }
  async function clearToken() {
    await chrome.storage.local.set({ [TOKEN_KEY]: "" });
  }
  async function loadBundle() {
    const key = await getActiveCaseKey();
    return await loadBundleByKey(key);
  }
  async function saveBundle(bundle) {
    const key = caseKeyFromTarget(bundle?.target);
    await setActiveCaseKey(key);
    await saveBundleByKey(key, bundle);
  }
  async function resetBundle() {
    const key = await getActiveCaseKey();
    const fresh = emptyBundle();
    await saveBundleByKey(key, fresh);
    return fresh;
  }
  async function updateTarget(next, pageUrl) {
    const key = caseKeyFromTarget(next);
    await setActiveCaseKey(key);
    const b = await loadBundleByKey(key);
    b.target = next;
    if (pageUrl) b.lastPageUrl = pageUrl;
    b.lastUpdatedAt = now();
    await saveBundleByKey(key, b);
    return b;
  }
  async function addRun(run, pageUrl) {
    const key = caseKeyFromTarget(run?.target);
    await setActiveCaseKey(key);
    const b = await loadBundleByKey(key);
    if (REPLACE_ACTIONS.has(run.action)) {
      for (let i = b.runs.length - 1; i >= 0; i--) {
        if (b.runs[i]?.action === run.action) {
          b.runs[i] = run;
          b.lastUpdatedAt = now();
          if (pageUrl) b.lastPageUrl = pageUrl;
          b.target = run.target || b.target;
          await saveBundleByKey(key, b);
          return b;
        }
      }
    }
    b.runs.push(run);
    b.lastUpdatedAt = now();
    if (pageUrl) b.lastPageUrl = pageUrl;
    b.target = run.target || b.target;
    await saveBundleByKey(key, b);
    return b;
  }
  async function getStats() {
    const token = await getToken();
    const activeCaseKey = await getActiveCaseKey();
    let b;
    if (activeCaseKey && activeCaseKey !== "unknown") {
      b = await loadBundleByKey(activeCaseKey);
    } else {
      b = emptyBundle();
    }
    const last = b.runs.length ? b.runs[b.runs.length - 1] : void 0;
    const tokenTrimmed = String(token || "").trim();
    const tokenMask = tokenTrimmed ? `••••${tokenTrimmed.slice(-6)}` : void 0;
    return {
      tokenSet: !!tokenTrimmed,
      tokenMask,
      activeCaseKey,
      target: b.target,
      runs: b.runs.length,
      lastAction: last ? `${last.action} • ${new Date(last.ts).toLocaleTimeString()}` : void 0
    };
  }
  async function exportBundle() {
    return await loadBundle();
  }
  async function deleteActiveTargetData() {
    const key = await getActiveCaseKey();
    const db = await openDb();
    await idbDelete(db, STORE_BUNDLES, key);
    await setActiveCaseKey("unknown");
  }
  async function deleteTargetData(key) {
    const k = String(key || "").trim();
    if (!k) return;
    const db = await openDb();
    await idbDelete(db, STORE_BUNDLES, k);
    const active = await getActiveCaseKey();
    if (active === k) await setActiveCaseKey("unknown");
  }
  async function deleteAllData() {
    const db = await openDb();
    await idbClear(db, STORE_BUNDLES);
    await setActiveCaseKey("unknown");
  }
  function pickProfileLabel(b) {
    try {
      const t = b?.target;
      const run = (b?.runs || []).find((r) => r?.action === "users.get") || (b?.runs || []).find((r) => r?.action === "groups.getById");
      const resp = run?.response;
      if (t?.kind === "user" && Array.isArray(resp) && resp[0]) {
        const u = resp[0];
        const label = [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || String(u.domain || "") || (typeof t.id === "number" ? String(t.id) : void 0);
        const photo = String(u.photo_100 || u.photo_50 || u.photo_200 || "") || void 0;
        return { label: label || void 0, photo };
      }
      if (t?.kind === "group" && Array.isArray(resp) && resp[0]) {
        const g = resp[0];
        const label = String(g.name || g.screen_name || "") || (typeof t.id === "number" ? `-${t.id}` : void 0);
        const photo = String(g.photo_100 || g.photo_200 || "") || void 0;
        return { label: label || void 0, photo };
      }
    } catch {
    }
    return {};
  }
  function approxBytesOfBundle(b) {
    try {
      const str = JSON.stringify(b);
      return new TextEncoder().encode(str).length;
    } catch {
      return 0;
    }
  }
  async function listStoredTargets(limit = 50) {
    const db = await openDb();
    const items = [];
    let totalBytes = 0;
    let totalTargets = 0;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BUNDLES, "readonly");
      const st = tx.objectStore(STORE_BUNDLES);
      const req = st.openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cur = req.result;
        if (!cur) {
          resolve();
          return;
        }
        const rec = cur.value;
        const key = String(rec?.key ?? "");
        const b = rec?.bundle;
        if (key && b && b.schema === "vkxtract.capture.v1") {
          const runsCount = Array.isArray(b.runs) ? b.runs.length : 0;
          const isEmptyUnknown = key === "unknown" && (b.target?.kind || "unknown") === "unknown" && runsCount === 0;
          if (!isEmptyUnknown) {
            totalTargets += 1;
            const ab = approxBytesOfBundle(b);
            totalBytes += ab;
            const meta = pickProfileLabel(b);
            const label = meta.label || (b.target?.screenName ? String(b.target.screenName) : "") || key;
            items.push({
              key,
              kind: b.target?.kind || "unknown",
              label,
              photo: meta.photo,
              lastUpdatedAt: Number(b.lastUpdatedAt || b.createdAt || 0),
              runs: runsCount,
              approxBytes: ab
            });
          }
        }
        cur.continue();
      };
    });
    items.sort((a, b) => (b.lastUpdatedAt || 0) - (a.lastUpdatedAt || 0));
    const sliced = items.slice(0, Math.max(1, Math.min(200, Number(limit) || 50)));
    return { items: sliced, totalBytes, totalTargets };
  }
  async function findStoredTargetByScreenName(screenName) {
    const sn = String(screenName || "").trim().toLowerCase();
    if (!sn) return null;
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BUNDLES, "readonly");
      const st = tx.objectStore(STORE_BUNDLES);
      const req = st.openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const cur = req.result;
        if (!cur) {
          resolve(null);
          return;
        }
        const rec = cur.value;
        const key = String(rec?.key ?? "");
        const b = rec?.bundle;
        try {
          const t = b?.target;
          const tSn = t?.screenName && String(t.screenName).trim() ? String(t.screenName).trim().toLowerCase() : "";
          if (tSn && tSn === sn && t) {
            resolve({ key, target: t });
            return;
          }
          const runs = Array.isArray(b?.runs) ? b.runs : [];
          const prof = runs.find((r) => r?.action === "users.get") || runs.find((r) => r?.action === "groups.getById");
          const resp0 = Array.isArray(prof?.response) ? prof.response[0] : null;
          const cand = resp0 ? String(resp0.domain || resp0.screen_name || "").trim().toLowerCase() : "";
          if (cand && cand === sn && t) {
            resolve({ key, target: t });
            return;
          }
        } catch {
        }
        cur.continue();
      };
    });
  }

  // src/entrypoints/background.ts
  var client = null;
  var busyUntil = 0;
  var busyReason = "";
  function isBusy() {
    return Date.now() < busyUntil;
  }
  function setBusy(reason, ms) {
    busyReason = reason;
    busyUntil = Math.max(busyUntil, Date.now() + ms);
  }
  function clearBusy() {
    busyUntil = 0;
    busyReason = "";
  }
  var VK_MIN_CALL_INTERVAL_MS = 450;
  var VK_CALL_JITTER_MS = 120;
  var vkLastCallStart = 0;
  var vkCallLock = Promise.resolve();
  async function withVkCallLock(fn) {
    const prev = vkCallLock;
    let release;
    vkCallLock = new Promise((res) => {
      release = res;
    });
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }
  async function vkCallThrottled(method, doCall) {
    return await withVkCallLock(async () => {
      const nowMs = Date.now();
      const waitMs = vkLastCallStart + VK_MIN_CALL_INTERVAL_MS - nowMs;
      if (waitMs > 0) await sleep(waitMs + Math.floor(Math.random() * VK_CALL_JITTER_MS));
      vkLastCallStart = Date.now();
      return await doCall();
    });
  }
  var popupLiveSession = { active: false };
  function setPopupLiveSession(key, patch) {
    const state = String(patch?.state || "").trim();
    const isTerminal = state === "done" || state === "blocked" || state === "error";
    if (state === "running") {
      popupLiveSession = {
        active: true,
        key,
        state: "running",
        note: typeof patch?.note === "string" ? patch.note : "",
        processed: Number.isFinite(Number(patch?.processed)) ? Number(patch.processed) : void 0,
        total: Number.isFinite(Number(patch?.total)) ? Number(patch.total) : void 0,
        startedAt: popupLiveSession.active && popupLiveSession.key === key && Number.isFinite(Number(popupLiveSession.startedAt)) ? Number(popupLiveSession.startedAt) : Date.now(),
        updatedAt: Date.now()
      };
      return;
    }
    if (isTerminal && popupLiveSession.active && popupLiveSession.key === key) {
      popupLiveSession = {
        active: false,
        key,
        state,
        note: typeof patch?.note === "string" ? patch.note : "",
        processed: Number.isFinite(Number(patch?.processed)) ? Number(patch.processed) : void 0,
        total: Number.isFinite(Number(patch?.total)) ? Number(patch.total) : void 0,
        startedAt: popupLiveSession.startedAt,
        updatedAt: Date.now()
      };
    }
  }
  function popupUpdate(key, patch) {
    setPopupLiveSession(key, patch);
    try {
      chrome.runtime.sendMessage({
        type: "VKX_POPUP_TASK_UPDATE",
        key,
        ...patch,
        live: popupLiveSession
      }).catch(() => {
      });
    } catch {
    }
  }
  var OFFSCREEN_ZIP_PATH = "offscreen-zip.html";
  var zipOffscreenCreating = null;
  var zipBrokerState = {
    active: false,
    exportId: "",
    startedAt: 0,
    cancelled: false
  };
  function resetZipBrokerState() {
    zipBrokerState = {
      active: false,
      exportId: "",
      startedAt: 0,
      cancelled: false
    };
  }
  async function hasZipOffscreenDocument() {
    const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_ZIP_PATH);
    const runtimeAny = chrome.runtime;
    if (typeof runtimeAny.getContexts === "function") {
      const contexts = await runtimeAny.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [offscreenUrl]
      });
      return Array.isArray(contexts) && contexts.length > 0;
    }
    const clientsAny = globalThis.clients;
    const matchedClients = typeof clientsAny?.matchAll === "function" ? await clientsAny.matchAll() : [];
    return Array.isArray(matchedClients) && matchedClients.some((client2) => String(client2?.url || "") === offscreenUrl);
  }
  async function ensureZipOffscreenDocument() {
    if (await hasZipOffscreenDocument()) return;
    if (zipOffscreenCreating) {
      await zipOffscreenCreating;
      return;
    }
    zipOffscreenCreating = (async () => {
      const offscreenApi = chrome.offscreen;
      if (!offscreenApi?.createDocument) {
        throw new Error("zip_export_failed: offscreen API unavailable");
      }
      await offscreenApi.createDocument({
        url: OFFSCREEN_ZIP_PATH,
        reasons: ["BLOBS", "WORKERS"],
        justification: "Assemble vkXtract case package ZIP exports in a hidden document."
      });
    })();
    try {
      await zipOffscreenCreating;
    } finally {
      zipOffscreenCreating = null;
    }
  }
  async function sendToZipOffscreen(message) {
    await ensureZipOffscreenDocument();
    return await chrome.runtime.sendMessage({ ...message, target: "offscreen-zip" });
  }
  function relayZipBrokerMessage(message) {
    try {
      chrome.runtime.sendMessage(message).catch(() => {
      });
    } catch {
    }
  }
  async function downloadZipBrokerBlobUrl(blobUrl, filename) {
    const cleanUrl = String(blobUrl || "").trim();
    const cleanName = String(filename || "").trim();
    if (!cleanUrl) throw new Error("zip_export_failed: missing blob URL");
    if (!cleanName) throw new Error("zip_export_failed: missing ZIP filename");
    const downloadIdAny = await chrome.downloads.download({
      url: cleanUrl,
      filename: cleanName,
      saveAs: false
    });
    return Number.isFinite(Number(downloadIdAny)) ? Number(downloadIdAny) : null;
  }
  function validateZipBrokerPlan(plan) {
    if (!plan || typeof plan !== "object") {
      return { ok: false, error: "zip_export_missing_plan", entryCount: 0 };
    }
    const pkgBase = String(plan.pkgBase || "").trim();
    const entries = Array.isArray(plan.entries) ? plan.entries : [];
    if (!pkgBase) {
      return { ok: false, error: "zip_export_missing_pkgbase", entryCount: entries.length };
    }
    const seen = /* @__PURE__ */ new Set();
    const allowedKinds = /* @__PURE__ */ new Set(["text", "json", "blob", "remote-url"]);
    for (const rawEntry of entries) {
      const entry = rawEntry || {};
      const path = String(entry.path || "").trim();
      const sourceKind = String(entry.sourceKind || "").trim();
      if (!path) {
        return { ok: false, error: "zip_export_invalid_entry_path", entryCount: entries.length };
      }
      if (seen.has(path)) {
        return { ok: false, error: `zip_export_duplicate_entry:${path}`, entryCount: entries.length };
      }
      seen.add(path);
      if (!allowedKinds.has(sourceKind)) {
        return { ok: false, error: `zip_export_invalid_source_kind:${sourceKind || "unknown"}`, entryCount: entries.length };
      }
      if (sourceKind === "remote-url" && !String(entry.remoteUrl || "").trim()) {
        return { ok: false, error: `zip_export_missing_remote_url:${path}`, entryCount: entries.length };
      }
    }
    return { ok: true, entryCount: entries.length };
  }
  var ENRICH_MAX_LIKERS_PER_ITEM = 1e9;
  var ENRICH_MAX_COMMENTS_PER_ITEM = 1e9;
  var ENRICH_MAX_RESOLVE_USERS = 1e9;
  var USER_FIELDS_LIGHT = "photo_100,photo_200,domain,sex,is_closed,deactivated,city,country,verified";
  var USER_FIELDS_FULL = [
    "photo_50",
    "photo_100",
    "photo_200",
    "photo_200_orig",
    "photo_400_orig",
    "photo_max",
    "photo_max_orig",
    "crop_photo",
    "city",
    "country",
    "home_town",
    "domain",
    "screen_name",
    "sex",
    "bdate",
    "nickname",
    "maiden_name",
    "is_closed",
    "deactivated",
    "verified",
    "online",
    "last_seen",
    "status",
    "site",
    "timezone",
    "trending",
    "followers_count",
    "counters",
    "common_count",
    "friend_status",
    "has_mobile",
    "can_post",
    "can_see_all_posts",
    "can_see_audio",
    "can_write_private_message",
    "education",
    "universities",
    "schools",
    "occupation",
    "career",
    "military",
    "relation",
    "relation_partner",
    "relatives",
    "contacts",
    "connections",
    "exports",
    "personal",
    "activities",
    "interests",
    "music",
    "movies",
    "tv",
    "books",
    "games",
    "about",
    "quotes"
  ].join(",");
  var GROUP_FIELDS_LIGHT = "name,screen_name,is_closed,type,photo_100,photo_200,description,members_count,site,verified,status,contacts,links,city,country,addresses";
  var GROUP_FIELDS_FULL = [
    "name",
    "screen_name",
    "is_closed",
    "type",
    "photo_50",
    "photo_100",
    "photo_200",
    "photo_200_orig",
    "photo_400_orig",
    "photo_max",
    "photo_max_orig",
    "description",
    "members_count",
    "site",
    "verified",
    "status",
    "city",
    "country",
    "place",
    "activity",
    "age_limits",
    "wiki_page",
    "start_date",
    "finish_date",
    "public_date_label",
    "can_post",
    "can_suggest",
    "can_upload_doc",
    "can_upload_story",
    "can_upload_video",
    "can_see_all_posts",
    "can_message",
    "is_admin",
    "admin_level",
    "is_member",
    "member_status",
    "is_advertiser",
    "is_favorite",
    "contacts",
    "links",
    "addresses",
    "cover",
    "counters",
    "main_album_id",
    "main_section",
    "market",
    "ban_info"
  ].join(",");
  async function getClient() {
    if (client) return client;
    const token = await getToken();
    client = new VkApiClient({ token });
    return client;
  }
  async function setClientToken(token) {
    const c = await getClient();
    c.setToken(token);
  }
  async function detectTargetResolved(pageUrl, opts) {
    const c = await getClient();
    const raw = detectTargetFromUrl(pageUrl);
    let resolved = raw;
    try {
      resolved = await vkCallThrottled("resolveTarget", () => c.resolveTarget(raw));
    } catch {
      resolved = raw;
    }
    const owner = ownerIdForTarget(resolved);
    if (typeof owner === "number") resolved.ownerId = owner;
    if ((!owner || resolved.kind === "unknown") && raw.screenName) {
      const found = await findStoredTargetByScreenName(raw.screenName);
      if (found?.target && (found.target.kind === "user" || found.target.kind === "group")) {
        if (opts?.persist !== false) await updateTarget(found.target, pageUrl);
        return found.target;
      }
    }
    if (opts?.persist !== false) await updateTarget(resolved, pageUrl);
    return resolved;
  }
  async function detectAndPersistTarget(pageUrl) {
    return await detectTargetResolved(pageUrl, { persist: true });
  }
  function summarizeProfile(resp, kind) {
    try {
      if (kind === "user" && Array.isArray(resp) && resp[0]) {
        const u = resp[0];
        const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
        return name || (u.domain ? String(u.domain) : void 0);
      }
      if (kind === "group" && Array.isArray(resp) && resp[0]) {
        const g = resp[0];
        return String(g.name || g.screen_name || "");
      }
    } catch {
    }
    return void 0;
  }
  async function callWithRetry(method, params, maxAttempts = 4) {
    const c = await getClient();
    let delay = 350;
    for (let i = 0; i < maxAttempts; i++) {
      const res = await vkCallThrottled(method, () => c.call(method, params));
      if (res.ok) return res;
      const code = Number(res.error?.error_code);
      if (code === 6 && i < maxAttempts - 1) {
        await sleep(delay);
        delay = Math.min(3e3, delay * 2);
        continue;
      }
      return res;
    }
    return { ok: false, error: { message: "retry_exhausted" } };
  }
  var RateLimitError = class extends Error {
    constructor(retryAfterSec) {
      super("vk_rate_limited");
      __publicField(this, "retryAfterSec");
      this.retryAfterSec = retryAfterSec;
    }
  };
  function normalizeVkError(err) {
    const code = Number(err?.error_code);
    const msg = String(err?.error_msg || err?.message || "");
    return { code: Number.isFinite(code) ? code : void 0, msg };
  }
  function chunk(arr, size) {
    const out = [];
    const n = Math.max(1, Math.floor(size));
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  }
  async function usersGetChunked(userIds, fields, maxAttempts = 3) {
    const ids = Array.from(new Set((userIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0)));
    const chunks = chunk(ids, 900);
    const all = [];
    for (const part of chunks) {
      const params = { user_ids: part.join(","), fields };
      const res = await callWithRetry("users.get", params, maxAttempts);
      if (!res.ok) return { ok: false, users: all, error: res.error };
      if (Array.isArray(res.response)) all.push(...res.response);
    }
    return { ok: true, users: all };
  }
  function nextBackoffSec(prev) {
    const cur = Number(prev);
    if (!Number.isFinite(cur) || cur <= 0) return 3;
    return Math.min(60, Math.max(3, Math.round(cur * 1.8)));
  }
  async function callForEnrich(method, params) {
    const c = await getClient();
    const res = await vkCallThrottled(method, () => c.call(method, params));
    if (res.ok) return { ok: true, response: res.response };
    const { code } = normalizeVkError(res.error);
    if (code === 6) return { ok: false, error: res.error, rateLimited: true };
    return { ok: false, error: res.error };
  }
  function ensureToken(token) {
    if (!token) throw new Error("Missing access token. Paste it and click Save.");
  }
  function ownerIdForTarget(t) {
    if (t.kind === "user") return t.id;
    if (t.kind === "group" && typeof t.id === "number") return -Math.abs(t.id);
    return void 0;
  }
  async function extractProfile(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    let method = "";
    let params = {};
    if (target.kind === "user") {
      method = "users.get";
      params = {
        user_ids: target.id ?? target.screenName,
        fields: USER_FIELDS_FULL
      };
    } else if (target.kind === "group") {
      method = "groups.getById";
      params = {
        group_id: target.id ?? target.screenName,
        fields: GROUP_FIELDS_FULL
      };
    } else {
      throw new Error("Could not detect a VK user or community from this page.");
    }
    popupUpdate("profile", { state: "running", processed: 0, total: 1, note: `Calling ${method}…` });
    const res = await callWithRetry(method, params);
    const run = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: params,
      ok: res.ok,
      response: res.ok ? res.response : void 0,
      error: res.ok ? void 0 : res.error,
      summary: {
        count: res.ok ? 1 : 0,
        note: res.ok ? summarizeProfile(res.response, target.kind) || void 0 : void 0
      }
    };
    await addRun(run, pageUrl);
    if (run.ok) popupUpdate("profile", { state: "done", ok: true, processed: 1, total: 1, note: run.summary?.note || "Done" });
    else popupUpdate("profile", { state: "blocked", ok: false, processed: 0, total: 1, error: normalizeVkError(run.error), note: "Request failed" });
    if (run.ok && target.kind === "user") {
      try {
        const u = Array.isArray(run.response) ? run.response[0] : void 0;
        const cityIds = /* @__PURE__ */ new Set();
        const schools = Array.isArray(u?.schools) ? u.schools : [];
        const unis = Array.isArray(u?.universities) ? u.universities : [];
        for (const s of schools) {
          const cid = Number(typeof s?.city === "number" ? s.city : typeof s?.city?.id === "number" ? s.city.id : NaN);
          if (Number.isFinite(cid) && cid > 0) cityIds.add(cid);
        }
        for (const un of unis) {
          const cid = Number(typeof un?.city === "number" ? un.city : typeof un?.city?.id === "number" ? un.city.id : NaN);
          if (Number.isFinite(cid) && cid > 0) cityIds.add(cid);
        }
        if (cityIds.size) {
          const ids = Array.from(cityIds);
          const parts = chunk(ids, 900);
          let okAll = true;
          let lastErr = null;
          const out = [];
          for (const part of parts) {
            const paramsCity = { city_ids: part.join(",") };
            const resCity = await callWithRetry("database.getCitiesById", paramsCity, 2);
            if (!resCity.ok) {
              okAll = false;
              lastErr = resCity.error;
              break;
            }
            if (Array.isArray(resCity.response)) out.push(...resCity.response);
          }
          const runCity = {
            id: uid("run"),
            ts: now(),
            action: "database.getCitiesById",
            target,
            request: { city_ids_count: ids.length },
            ok: okAll,
            response: okAll ? out : void 0,
            error: okAll ? void 0 : lastErr,
            summary: { count: out.length, note: "Resolved city IDs (education)" }
          };
          await addRun(runCity, pageUrl);
        }
      } catch {
      }
    }
    if (run.ok && target.kind === "user") {
      try {
        const u = Array.isArray(run.response) ? run.response[0] : void 0;
        const ids = /* @__PURE__ */ new Set();
        const rp = u?.relation_partner;
        const rpId = Number(rp && typeof rp === "object" ? rp.id : rp);
        if (Number.isFinite(rpId) && rpId > 0) ids.add(rpId);
        const rels = Array.isArray(u?.relatives) ? u.relatives : [];
        for (const rel of rels) {
          const rid = Number(rel?.id);
          if (Number.isFinite(rid) && rid > 0) ids.add(rid);
        }
        if (ids.size) {
          const params2 = {
            fields: "photo_100,photo_200,domain,sex,is_closed,deactivated,city,country,verified"
          };
          const res2 = await usersGetChunked(Array.from(ids), params2.fields, 3);
          const runRel = {
            id: uid("run"),
            ts: now(),
            action: "users.get_related",
            target,
            request: params2,
            ok: res2.ok,
            response: res2.ok ? res2.users : void 0,
            error: res2.ok ? void 0 : res2.error,
            summary: { count: res2.ok ? res2.users.length : 0, note: "Resolved related profiles" }
          };
          await addRun(runRel, pageUrl);
        }
      } catch {
      }
    }
    if (run.ok && target.kind === "group") {
      try {
        const g = Array.isArray(run.response) ? run.response[0] : void 0;
        const contacts = Array.isArray(g?.contacts) ? g.contacts : [];
        const ids = /* @__PURE__ */ new Set();
        for (const c of contacts) {
          const uidNum = Number(c?.user_id ?? c?.id);
          if (Number.isFinite(uidNum) && uidNum > 0) ids.add(uidNum);
        }
        if (ids.size) {
          const paramsU = { fields: USER_FIELDS_LIGHT };
          const resU = await usersGetChunked(Array.from(ids), paramsU.fields, 3);
          const runU = {
            id: uid("run"),
            ts: now(),
            action: "users.get_group_contacts",
            target,
            request: paramsU,
            ok: resU.ok,
            response: resU.ok ? resU.users : void 0,
            error: resU.ok ? void 0 : resU.error,
            summary: { count: resU.ok ? resU.users.length : 0, note: "Resolved group contacts" }
          };
          await addRun(runU, pageUrl);
        }
        try {
          const gid = Number(target.id);
          if (Number.isFinite(gid) && gid > 0) {
            const methodAddr = "groups.getAddresses";
            const allAddr = [];
            let offsetAddr = 0;
            const pageSizeAddr = 100;
            let totalAddr = 0;
            let okAll = true;
            while (true) {
              const paramsAddr = { group_id: gid, offset: offsetAddr, count: pageSizeAddr };
              const resAddr = await callWithRetry(methodAddr, paramsAddr, 3);
              if (!resAddr.ok) {
                okAll = false;
                const runFail = {
                  id: uid("run"),
                  ts: now(),
                  action: methodAddr,
                  target,
                  request: paramsAddr,
                  ok: false,
                  error: resAddr.error
                };
                await addRun(runFail, pageUrl);
                break;
              }
              const respAddr = resAddr.response;
              totalAddr = Number(respAddr?.count ?? totalAddr);
              const itemsAddr = Array.isArray(respAddr?.items) ? respAddr.items : [];
              allAddr.push(...itemsAddr);
              if (!itemsAddr.length) break;
              offsetAddr += itemsAddr.length;
              if (totalAddr && offsetAddr >= totalAddr) break;
              await sleep(180);
            }
            if (okAll) {
              const runAddr = {
                id: uid("run"),
                ts: now(),
                action: methodAddr,
                target,
                request: { group_id: gid, mode: "all" },
                ok: true,
                response: { count: totalAddr, items: allAddr, capped: false },
                summary: { count: allAddr.length, note: totalAddr ? `total: ${totalAddr}` : "Group addresses" }
              };
              await addRun(runAddr, pageUrl);
            }
          }
        } catch {
        }
      } catch {
      }
    }
    return await getStats();
  }
  async function extractFriendsMembers(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    if (target.kind === "user") {
      const method = "friends.get";
      const all = [];
      let offset = 0;
      const pageSize = 5e3;
      let total = 0;
      popupUpdate("friends", { state: "running", processed: 0, total: void 0, note: "Starting friends.get…" });
      while (true) {
        const params = {
          user_id: target.id,
          fields: "id,domain,first_name,last_name,photo_100,city,country,sex,is_closed,deactivated",
          offset,
          count: pageSize
        };
        const res = await callWithRetry(method, params);
        if (!res.ok) {
          const runFail = {
            id: uid("run"),
            ts: now(),
            action: method,
            target,
            request: params,
            ok: false,
            error: res.error
          };
          await addRun(runFail, pageUrl);
          popupUpdate("friends", { state: "blocked", ok: false, processed: all.length, total: total || void 0, error: normalizeVkError(res.error), note: "Request failed" });
          return await getStats();
        }
        const resp = res.response;
        total = Number(resp?.count ?? total);
        const items = Array.isArray(resp?.items) ? resp.items : [];
        all.push(...items);
        popupUpdate("friends", { state: "running", processed: all.length, total: total || void 0, note: total ? `${all.length}/${total}` : `Processed: ${all.length}` });
        if (!items.length) break;
        offset += items.length;
        if (total && offset >= total) break;
        await sleep(200);
      }
      const note = total ? `total: ${total}` : void 0;
      const runOk = {
        id: uid("run"),
        ts: now(),
        action: method,
        target,
        request: { user_id: target.id, mode: "all" },
        ok: true,
        response: { count: total, items: all, capped: false },
        summary: { count: all.length, note }
      };
      await addRun(runOk, pageUrl);
      popupUpdate("friends", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
      return await getStats();
    }
    if (target.kind === "group") {
      const method = "groups.getMembers";
      const all = [];
      let offset = 0;
      const pageSize = 1e3;
      let total = 0;
      popupUpdate("friends", { state: "running", processed: 0, total: void 0, note: "Starting groups.getMembers…" });
      while (true) {
        const params = {
          group_id: target.id,
          fields: "id,domain,first_name,last_name,photo_100,city,country,sex,is_closed,deactivated",
          offset,
          count: pageSize
        };
        const res = await callWithRetry(method, params);
        if (!res.ok) {
          const runFail = {
            id: uid("run"),
            ts: now(),
            action: method,
            target,
            request: params,
            ok: false,
            error: res.error
          };
          await addRun(runFail, pageUrl);
          popupUpdate("friends", {
            state: "blocked",
            ok: false,
            processed: all.length,
            total: total || void 0,
            error: normalizeVkError(res.error),
            note: "Request failed"
          });
          return await getStats();
        }
        const resp = res.response;
        total = Number(resp?.count ?? total);
        const items = Array.isArray(resp?.items) ? resp.items : [];
        all.push(...items);
        popupUpdate("friends", {
          state: "running",
          processed: all.length,
          total: total || void 0,
          note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
        });
        if (!items.length) break;
        offset += items.length;
        if (total && offset >= total) break;
        await sleep(200);
      }
      const note = total ? `total: ${total}` : void 0;
      const runOk = {
        id: uid("run"),
        ts: now(),
        action: method,
        target,
        request: { group_id: target.id, mode: "all" },
        ok: true,
        response: { count: total, items: all, capped: false },
        summary: { count: all.length, note }
      };
      await addRun(runOk, pageUrl);
      popupUpdate("friends", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
      return await getStats();
    }
    throw new Error("Could not detect a VK user or community from this page.");
  }
  async function extractPhotos(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    try {
      const methodAlb = "photos.getAlbums";
      const allAlb = [];
      let offsetAlb = 0;
      const pageSizeAlb = 1e3;
      let totalAlb = 0;
      while (true) {
        const paramsAlb = { owner_id, need_system: 1, offset: offsetAlb, count: pageSizeAlb };
        const resAlb = await callWithRetry(methodAlb, paramsAlb, 3);
        if (!resAlb.ok) {
          const runFail = {
            id: uid("run"),
            ts: now(),
            action: methodAlb,
            target,
            request: paramsAlb,
            ok: false,
            error: resAlb.error
          };
          await addRun(runFail, pageUrl);
          break;
        }
        const respAlb = resAlb.response;
        totalAlb = Number(respAlb?.count ?? totalAlb);
        const itemsAlb = Array.isArray(respAlb?.items) ? respAlb.items : [];
        allAlb.push(...itemsAlb);
        if (!itemsAlb.length) break;
        offsetAlb += itemsAlb.length;
        if (totalAlb && offsetAlb >= totalAlb) break;
        await sleep(200);
      }
      const runAlb = {
        id: uid("run"),
        ts: now(),
        action: methodAlb,
        target,
        request: { owner_id, need_system: 1 },
        ok: true,
        response: { count: totalAlb, items: allAlb, capped: false },
        summary: { count: allAlb.length, note: totalAlb ? `total: ${totalAlb}` : void 0 }
      };
      await addRun(runAlb, pageUrl);
    } catch {
    }
    const method = "photos.getAll";
    const all = [];
    let offset = 0;
    const pageSize = 200;
    let total = 0;
    popupUpdate("photos", { state: "running", processed: 0, total: void 0, note: "Starting photos.getAll…" });
    while (true) {
      const params = { owner_id, extended: 1, offset, count: pageSize };
      const res = await callWithRetry(method, params);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("photos", {
          state: "blocked",
          ok: false,
          processed: all.length,
          total: total || void 0,
          error: normalizeVkError(res.error),
          note: "Request failed"
        });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      popupUpdate("photos", {
        state: "running",
        processed: all.length,
        total: total || void 0,
        note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
      });
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(200);
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { owner_id, mode: "all" },
      ok: true,
      response: { count: total, items: all, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("photos", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
    return await getStats();
  }
  async function extractClipsForOwner(pageUrl, target, owner_id) {
    const method = "shortVideo.getOwnerVideos";
    const all = [];
    let offset = 0;
    const pageSize = 50;
    let total = 0;
    while (true) {
      const params = { owner_id, offset, count: pageSize };
      const res = await callWithRetry(method, params, 3);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        return;
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(180);
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { owner_id, mode: "all" },
      ok: true,
      response: { count: total, items: all, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
  }
  async function extractVideos(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    try {
      const methodAlb = "video.getAlbums";
      const allAlb = [];
      let offsetAlb = 0;
      const pageSizeAlb = 200;
      let totalAlb = 0;
      while (true) {
        const paramsAlb = { owner_id, extended: 1, offset: offsetAlb, count: pageSizeAlb };
        const resAlb = await callWithRetry(methodAlb, paramsAlb, 3);
        if (!resAlb.ok) {
          const runFail = {
            id: uid("run"),
            ts: now(),
            action: methodAlb,
            target,
            request: paramsAlb,
            ok: false,
            error: resAlb.error
          };
          await addRun(runFail, pageUrl);
          break;
        }
        const respAlb = resAlb.response;
        totalAlb = Number(respAlb?.count ?? totalAlb);
        const itemsAlb = Array.isArray(respAlb?.items) ? respAlb.items : [];
        allAlb.push(...itemsAlb);
        if (!itemsAlb.length) break;
        offsetAlb += itemsAlb.length;
        if (totalAlb && offsetAlb >= totalAlb) break;
        await sleep(200);
      }
      const runAlb = {
        id: uid("run"),
        ts: now(),
        action: methodAlb,
        target,
        request: { owner_id, extended: 1 },
        ok: true,
        response: { count: totalAlb, items: allAlb, capped: false },
        summary: { count: allAlb.length, note: totalAlb ? `total: ${totalAlb}` : void 0 }
      };
      await addRun(runAlb, pageUrl);
    } catch {
    }
    const method = "video.get";
    const all = [];
    let offset = 0;
    const pageSize = 200;
    let total = 0;
    popupUpdate("videos", { state: "running", processed: 0, total: void 0, note: "Starting video.get…" });
    while (true) {
      const params = { owner_id, extended: 1, offset, count: pageSize };
      const res = await callWithRetry(method, params);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("videos", {
          state: "blocked",
          ok: false,
          processed: all.length,
          total: total || void 0,
          error: normalizeVkError(res.error),
          note: "Request failed"
        });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      popupUpdate("videos", {
        state: "running",
        processed: all.length,
        total: total || void 0,
        note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
      });
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(200);
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { owner_id, mode: "all" },
      ok: true,
      response: { count: total, items: all, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("videos", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
    try {
      await extractClipsForOwner(pageUrl, target, owner_id);
    } catch {
    }
    return await getStats();
  }
  async function extractWallSnapshot(pageUrl, opts) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    const maxPosts = Math.max(1, Math.min(5e3, Math.floor(Number(opts?.maxPosts ?? 200))));
    const includeComments = !!opts?.includeComments;
    const includeLikers = !!opts?.includeLikers;
    const maxCommentsPerPost = Math.max(0, Math.min(1e4, Math.floor(Number(opts?.maxCommentsPerPost ?? 1e3))));
    const maxLikersPerPost = Math.max(0, Math.min(1e5, Math.floor(Number(opts?.maxLikersPerPost ?? 5e3))));
    const rawFromTs = Math.floor(Number(opts?.fromTs ?? 0));
    const rawToTs = Math.floor(Number(opts?.toTs ?? 0));
    const fromTs = Number.isFinite(rawFromTs) && rawFromTs > 0 ? rawFromTs : 0;
    const toTs = Number.isFinite(rawToTs) && rawToTs > 0 ? rawToTs : 0;
    const requestMode = includeComments && includeLikers ? "posts_comments_likes" : includeComments ? "posts_comments" : includeLikers ? "posts_likes" : "posts_only";
    popupUpdate("wall", { state: "running", processed: 0, total: maxPosts, note: "Starting…" });
    const method = "wall.get";
    const all = [];
    let offset = 0;
    const pageSize = 100;
    let total = 0;
    while (all.length < maxPosts) {
      const params = { owner_id, filter: "all", offset, count: pageSize };
      const res = await callWithRetry(method, params, 4);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: "vkx.wall.snapshot",
          target,
          request: {
            owner_id,
            maxPosts,
            includeComments,
            includeLikers,
            maxCommentsPerPost: includeComments ? maxCommentsPerPost : 0,
            maxLikersPerPost: includeLikers ? maxLikersPerPost : 0,
            mode: requestMode
          },
          ok: false,
          error: res.error,
          summary: { note: "wall.get failed" }
        };
        await addRun(runFail, pageUrl);
        popupUpdate("wall", { state: "blocked", ok: false, processed: all.length, total: maxPosts, error: normalizeVkError(res.error), note: "Wall access denied / unavailable" });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      if (!items.length) break;
      let reachedOlderThanFrom = false;
      for (const item of items) {
        const ts = Number(item?.date ?? 0) || 0;
        if (toTs > 0 && ts > toTs) continue;
        if (fromTs > 0 && ts > 0 && ts < fromTs) {
          reachedOlderThanFrom = true;
          continue;
        }
        all.push(item);
        if (all.length >= maxPosts) break;
      }
      offset += items.length;
      popupUpdate("wall", {
        state: "running",
        processed: all.length,
        total: maxPosts,
        note: `Posts: ${all.length}/${maxPosts}${fromTs || toTs ? " in range" : ""}`
      });
      if (all.length >= maxPosts) break;
      if (reachedOlderThanFrom) break;
      if (total && offset >= total) break;
      await sleep(160);
    }
    const commentsByPost = {};
    const likesByPost = {};
    let deniedCommentsPosts = 0;
    let deniedLikesPosts = 0;
    let commentsCaptured = 0;
    let likeIdsCaptured = 0;
    const observed = /* @__PURE__ */ new Map();
    const observedKeys = /* @__PURE__ */ new Map();
    const toUnixOrNull = (value) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    const cleanExcerpt = (value, maxLen = 240) => {
      const s = String(value ?? "").replace(/\s+/g, " ").trim();
      if (!s) return "";
      return s.length > maxLen ? `${s.slice(0, Math.max(0, maxLen - 1)).trim()}…` : s;
    };
    const ensureObservedActor = (id) => {
      const existing = observed.get(id);
      if (existing) return existing;
      const created = {
        id,
        likes: 0,
        comments: 0,
        postsLiked: [],
        postsCommented: [],
        first_seen: null,
        last_seen: null,
        sources: ["wall"],
        per_source: {
          wall: {
            likes: 0,
            comments: 0,
            evidence_count: 0
          }
        },
        evidence: []
      };
      observed.set(id, created);
      return created;
    };
    const markObservedSeen = (actor, ts) => {
      const n = toUnixOrNull(ts);
      if (n == null) return;
      if (actor.first_seen == null || n < actor.first_seen) actor.first_seen = n;
      if (actor.last_seen == null || n > actor.last_seen) actor.last_seen = n;
    };
    const pushObservedEvidence = (id, ev) => {
      if (!Number.isFinite(id) || id === 0) return;
      const actor = ensureObservedActor(id);
      const dedupeKey = `${ev.action}:${ev.post_id}:${ev.comment_id ?? 0}`;
      let seen = observedKeys.get(id);
      if (!seen) {
        seen = /* @__PURE__ */ new Set();
        observedKeys.set(id, seen);
      }
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      actor.evidence.push(ev);
      actor.per_source.wall.evidence_count++;
      markObservedSeen(actor, ev.ts ?? ev.post_date);
      if (ev.action === "comment") {
        actor.comments++;
        actor.per_source.wall.comments++;
        if (!actor.postsCommented.includes(ev.post_id)) actor.postsCommented.push(ev.post_id);
      } else {
        actor.likes++;
        actor.per_source.wall.likes++;
        if (!actor.postsLiked.includes(ev.post_id)) actor.postsLiked.push(ev.post_id);
      }
    };
    const addObservedComment = (comment, post) => {
      const actorId = Number(comment?.from_id);
      if (!Number.isFinite(actorId) || actorId === 0) return;
      const postId = Number(post?.id);
      if (!Number.isFinite(postId) || postId === 0) return;
      const commentIdRaw = Number(comment?.id);
      const replyToRaw = Number(comment?.reply_to_comment);
      pushObservedEvidence(actorId, {
        source: "wall",
        action: "comment",
        owner_id,
        post_id: postId,
        post_date: toUnixOrNull(post?.date),
        comment_id: Number.isFinite(commentIdRaw) && commentIdRaw > 0 ? commentIdRaw : null,
        reply_to_comment_id: Number.isFinite(replyToRaw) && replyToRaw > 0 ? replyToRaw : null,
        ts: toUnixOrNull(comment?.date) ?? toUnixOrNull(post?.date),
        excerpt: cleanExcerpt(comment?.text)
      });
    };
    const addObservedLike = (actorId, post) => {
      if (!Number.isFinite(actorId) || actorId === 0) return;
      const postId = Number(post?.id);
      if (!Number.isFinite(postId) || postId === 0) return;
      pushObservedEvidence(actorId, {
        source: "wall",
        action: "like",
        owner_id,
        post_id: postId,
        post_date: toUnixOrNull(post?.date),
        comment_id: null,
        reply_to_comment_id: null,
        ts: toUnixOrNull(post?.date),
        excerpt: cleanExcerpt(post?.text)
      });
    };
    const fetchPostLikers = async (postId, cap) => {
      const ids = [];
      let offsetL = 0;
      let totalL = 0;
      while (ids.length < cap) {
        const paramsL = {
          type: "post",
          owner_id,
          item_id: postId,
          extended: 0,
          offset: offsetL,
          count: Math.min(1e3, cap - ids.length)
        };
        const resL = await callWithRetry("likes.getList", paramsL, 3);
        if (!resL.ok) {
          return {
            denied: true,
            deniedMsg: String(resL.error?.error_msg || resL.error?.message || "access denied"),
            total: 0,
            ids: [],
            capped: false
          };
        }
        const respL = resL.response;
        totalL = Number(respL?.count ?? totalL);
        const itemsL = Array.isArray(respL?.items) ? respL.items : [];
        if (!itemsL.length) break;
        for (const it of itemsL) {
          const id = Number(typeof it === "number" ? it : it?.id);
          if (Number.isFinite(id) && id !== 0) ids.push(id);
          if (ids.length >= cap) break;
        }
        offsetL += itemsL.length;
        if (totalL && offsetL >= totalL) break;
        await sleep(100);
      }
      return {
        denied: false,
        deniedMsg: "",
        total: totalL || ids.length,
        ids,
        capped: ids.length >= cap
      };
    };
    if (includeComments && maxCommentsPerPost > 0) {
      popupUpdate("wall", { state: "running", processed: all.length, total: maxPosts, note: `Posts: ${all.length}/${maxPosts} • fetching comments…` });
      for (let i = 0; i < all.length; i++) {
        const p = all[i];
        const postId = Number(p?.id);
        if (!Number.isFinite(postId) || postId === 0) continue;
        const key = String(postId);
        const shownCount = Number(p?.comments?.count ?? 0);
        if (Number.isFinite(shownCount) && shownCount <= 0) {
          commentsByPost[key] = { denied: false, denied_msg: "", count: 0, items: [], capped: false };
          continue;
        }
        const flat = [];
        let offsetC = 0;
        let totalC = 0;
        let denied = false;
        let deniedMsg = "";
        while (flat.length < maxCommentsPerPost) {
          const paramsC = {
            owner_id,
            post_id: postId,
            extended: 0,
            need_likes: 0,
            sort: "asc",
            offset: offsetC,
            count: Math.min(100, maxCommentsPerPost - flat.length),
            thread_items_count: 10
          };
          const resC = await callWithRetry("wall.getComments", paramsC, 3);
          if (!resC.ok) {
            denied = true;
            deniedMsg = String(resC.error?.error_msg || resC.error?.message || "access denied");
            break;
          }
          const respC = resC.response;
          totalC = Number(respC?.count ?? totalC);
          const itemsC = Array.isArray(respC?.items) ? respC.items : [];
          if (!itemsC.length) break;
          for (const c of itemsC) {
            flat.push(c);
            const threadItems = Array.isArray(c?.thread?.items) ? c.thread.items : [];
            for (const t of threadItems) {
              if (t && t.reply_to_comment == null) t.reply_to_comment = Number(c?.id);
              flat.push(t);
            }
          }
          offsetC += itemsC.length;
          if (totalC && offsetC >= totalC) break;
          await sleep(120);
        }
        if (denied) {
          deniedCommentsPosts++;
          commentsByPost[key] = { denied: true, denied_msg: deniedMsg, count: 0, items: [], capped: false };
        } else {
          const seen = /* @__PURE__ */ new Set();
          const uniq = flat.filter((c) => {
            const cid = Number(c?.id);
            if (!Number.isFinite(cid) || cid === 0) return false;
            if (seen.has(cid)) return false;
            seen.add(cid);
            return true;
          });
          commentsByPost[key] = { denied: false, count: totalC || uniq.length, items: uniq, capped: uniq.length >= maxCommentsPerPost };
          commentsCaptured += uniq.length;
          for (const c of uniq) {
            addObservedComment(c, p);
          }
        }
        if (i % 10 === 0) {
          popupUpdate("wall", { state: "running", processed: all.length, total: maxPosts, note: `Posts: ${all.length}/${maxPosts} • comments: ${i + 1}/${all.length}` });
        }
      }
    }
    if (includeLikers && maxLikersPerPost > 0) {
      popupUpdate("wall", { state: "running", processed: all.length, total: maxPosts, note: `Posts: ${all.length}/${maxPosts} • fetching likes…` });
      for (let i = 0; i < all.length; i++) {
        const p = all[i];
        const postId = Number(p?.id);
        if (!Number.isFinite(postId) || postId === 0) continue;
        const key = String(postId);
        const shownLikes = Number(p?.likes?.count ?? 0);
        if (Number.isFinite(shownLikes) && shownLikes <= 0) {
          likesByPost[key] = { denied: false, denied_msg: "", total: 0, ids: [], capped: false };
          continue;
        }
        const r = await fetchPostLikers(postId, maxLikersPerPost);
        if (r.denied) {
          deniedLikesPosts++;
          likesByPost[key] = { denied: true, denied_msg: r.deniedMsg || "access denied", total: 0, ids: [], capped: false };
        } else {
          likesByPost[key] = { denied: false, denied_msg: "", total: r.total || r.ids.length, ids: r.ids, capped: !!r.capped };
          likeIdsCaptured += r.ids.length;
          for (const uid2 of r.ids) {
            addObservedLike(uid2, p);
          }
        }
        if (i % 10 === 0) {
          popupUpdate("wall", { state: "running", processed: all.length, total: maxPosts, note: `Posts: ${all.length}/${maxPosts} • likes: ${i + 1}/${all.length}` });
        }
      }
    }
    const observedActors = Array.from(observed.values()).map((actor) => ({
      ...actor,
      evidence: actor.evidence.slice().sort((a, b) => Number(b.ts ?? b.post_date ?? 0) - Number(a.ts ?? a.post_date ?? 0))
    })).sort(
      (a, b) => b.comments + b.likes - (a.comments + a.likes) || b.comments - a.comments || b.likes - a.likes || a.id - b.id
    );
    const uniqueObserved = observedActors.length;
    const observedEvidenceTotal = observedActors.reduce((sum, actor) => sum + (Array.isArray(actor.evidence) ? actor.evidence.length : 0), 0);
    const observedFirstSeen = observedActors.reduce((minTs, actor) => {
      const ts = Number(actor?.first_seen);
      if (!Number.isFinite(ts) || ts <= 0) return minTs;
      return minTs == null || ts < minTs ? ts : minTs;
    }, null);
    const observedLastSeen = observedActors.reduce((maxTs, actor) => {
      const ts = Number(actor?.last_seen);
      if (!Number.isFinite(ts) || ts <= 0) return maxTs;
      return maxTs == null || ts > maxTs ? ts : maxTs;
    }, null);
    const response = {
      count: maxPosts,
      owner_id,
      config: {
        max_posts: maxPosts,
        include_comments: includeComments,
        include_likers: includeLikers,
        include_copies: false,
        max_comments_per_post: includeComments ? maxCommentsPerPost : 0,
        max_likers_per_post: includeLikers ? maxLikersPerPost : 0,
        date_from_ts: fromTs || 0,
        date_to_ts: toTs || 0,
        detail_level: requestMode
      },
      coverage: {
        posts_total: total || null,
        posts_captured: all.length,
        denied_comments_posts: deniedCommentsPosts,
        denied_likes_posts: deniedLikesPosts,
        comments_captured: commentsCaptured,
        like_ids_captured: likeIdsCaptured
      },
      posts: { count: total || all.length, items: all, capped: all.length >= maxPosts },
      comments_by_post: commentsByPost,
      likes_by_post: likesByPost,
      observed: {
        source: "wall",
        available_sources: ["wall"],
        totals: {
          unique_actors: uniqueObserved,
          likes_total: likeIdsCaptured,
          comments_total: commentsCaptured,
          evidence_total: observedEvidenceTotal
        },
        by_source: {
          wall: {
            unique_actors: uniqueObserved,
            likes_total: likeIdsCaptured,
            comments_total: commentsCaptured,
            evidence_total: observedEvidenceTotal
          }
        },
        window: {
          first_seen: observedFirstSeen,
          last_seen: observedLastSeen
        },
        actors: observedActors
      }
    };
    const note = `posts:${all.length}${total ? ` (total:${total})` : ""} • comments:${commentsCaptured} • likes:${likeIdsCaptured} • unique:${uniqueObserved}`;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: "vkx.wall.snapshot",
      target,
      request: {
        owner_id,
        maxPosts,
        includeComments,
        includeLikers,
        fromTs: fromTs || 0,
        toTs: toTs || 0,
        maxCommentsPerPost: includeComments ? maxCommentsPerPost : 0,
        maxLikersPerPost: includeLikers ? maxLikersPerPost : 0,
        mode: requestMode
      },
      ok: true,
      response,
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("wall", { state: "done", ok: true, processed: all.length, total: maxPosts, note });
    return await getStats();
  }
  function commentDigest(c) {
    const txt = String(c?.text || "");
    const likesCount = Number(c?.likes?.count ?? c?.likes_count ?? c?.likes ?? 0);
    return {
      id: Number(c?.id),
      from_id: Number(c?.from_id),
      date: Number(c?.date),
      text: txt.length > 500 ? txt.slice(0, 500) + "…" : txt,
      reply_to_comment: c?.reply_to_comment != null ? Number(c.reply_to_comment) : void 0,
      reply_to_user: c?.reply_to_user != null ? Number(c.reply_to_user) : void 0,
      parents_stack: Array.isArray(c?.parents_stack) ? c.parents_stack.slice(0, 12).map((x) => Number(x)).filter((n) => Number.isFinite(n)) : void 0,
      likes_count: Number.isFinite(likesCount) ? likesCount : 0
    };
  }
  function latestOkRunInBundle(bundle, pred) {
    const runs = Array.isArray(bundle?.runs) ? bundle.runs : [];
    for (let i = runs.length - 1; i >= 0; i--) {
      const r = runs[i];
      if (r?.ok && pred(r)) return r;
    }
    return void 0;
  }
  function isAccessDenied(code, msg) {
    const m = String(msg || "").toLowerCase();
    return code === 7 || code === 15 || m.includes("access denied") || m.includes("permission to perform this action is denied");
  }
  async function fetchLikesIdsEnrichSafe(paramsBase, cap, backoffSecRef) {
    const ids = [];
    let offset = 0;
    let total = 0;
    const pageSize = 1e3;
    const isUnknownParamAccessKey = (msg) => {
      const m = String(msg || "").toLowerCase();
      return m.includes("unknown parameter") && m.includes("access_key");
    };
    while (ids.length < cap) {
      const params = {
        type: paramsBase.type,
        owner_id: paramsBase.owner_id,
        item_id: paramsBase.item_id,
        extended: 0,
        offset,
        count: pageSize
      };
      if (paramsBase.access_key) params.access_key = paramsBase.access_key;
      let res = await callForEnrich("likes.getList", params);
      if (!res.ok) {
        const { msg } = normalizeVkError(res.error);
        if (params.access_key && isUnknownParamAccessKey(msg)) {
          delete params.access_key;
          res = await callForEnrich("likes.getList", params);
        }
      }
      if (!res.ok) {
        const { code, msg } = normalizeVkError(res.error);
        if (code === 6) {
          backoffSecRef.v = nextBackoffSec(backoffSecRef.v);
          throw new RateLimitError(backoffSecRef.v);
        }
        if (isAccessDenied(code, msg)) {
          return { total: 0, ids: [], capped: false, denied: true, denied_msg: msg || "access denied" };
        }
        throw new Error(msg || "likes.getList_failed");
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      for (const it of items) {
        const id = Number(typeof it === "number" ? it : it?.id);
        if (Number.isFinite(id) && id > 0) ids.push(id);
        if (ids.length >= cap) break;
      }
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(150);
    }
    return { total, ids, capped: total > ids.length };
  }
  async function fetchCopiesIdsEnrichSafe(paramsBase, cap, backoffSecRef) {
    const ids = [];
    let offset = 0;
    let total = 0;
    const pageSize = 1e3;
    const isUnknownParamAccessKey = (msg) => {
      const m = String(msg || "").toLowerCase();
      return m.includes("unknown parameter") && m.includes("access_key");
    };
    while (ids.length < cap) {
      const params = {
        type: paramsBase.type,
        owner_id: paramsBase.owner_id,
        item_id: paramsBase.item_id,
        filter: "copies",
        extended: 0,
        offset,
        count: pageSize
      };
      if (paramsBase.access_key) params.access_key = paramsBase.access_key;
      let res = await callForEnrich("likes.getList", params);
      if (!res.ok) {
        const { msg } = normalizeVkError(res.error);
        if (params.access_key && isUnknownParamAccessKey(msg)) {
          delete params.access_key;
          res = await callForEnrich("likes.getList", params);
        }
      }
      if (!res.ok) {
        const { code, msg } = normalizeVkError(res.error);
        if (code === 6) {
          backoffSecRef.v = nextBackoffSec(backoffSecRef.v);
          throw new RateLimitError(backoffSecRef.v);
        }
        if (isAccessDenied(code, msg)) {
          return { total: 0, ids: [], capped: false, denied: true, denied_msg: msg || "access denied" };
        }
        throw new Error(msg || "likes.getList_failed");
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      for (const it of items) {
        const id = Number(typeof it === "number" ? it : it?.id);
        if (Number.isFinite(id) && id > 0) ids.push(id);
        if (ids.length >= cap) break;
      }
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(150);
    }
    return { total, ids, capped: total > ids.length };
  }
  async function fetchCommenterIdsEnrichSafe(method, paramsBase, cap, backoffSecRef) {
    const ids = [];
    const comments = [];
    let offset = 0;
    let total = 0;
    const pageSize = 100;
    while (comments.length < cap) {
      const params = { ...paramsBase, extended: 0, need_likes: 1, offset, count: pageSize };
      const res = await callForEnrich(method, params);
      if (!res.ok) {
        const { code, msg } = normalizeVkError(res.error);
        if (code === 6) {
          backoffSecRef.v = nextBackoffSec(backoffSecRef.v);
          throw new RateLimitError(backoffSecRef.v);
        }
        if (isAccessDenied(code, msg)) {
          return { total: 0, ids: [], comments: [], capped: false, denied: true, denied_msg: msg || "access denied" };
        }
        throw new Error(msg || `${method}_failed`);
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      for (const c of items) {
        const from = Number(c?.from_id);
        if (Number.isFinite(from) && from > 0) ids.push(from);
        comments.push(commentDigest(c));
        if (comments.length >= cap) break;
      }
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(150);
    }
    return { total, ids, comments, capped: total > comments.length };
  }
  function recomputeEngagementSingle(response, which) {
    const obj = which === "photo" ? response?.media?.photos && typeof response.media.photos === "object" ? response.media.photos : {} : response?.media?.videos && typeof response.media.videos === "object" ? response.media.videos : {};
    const userStats = /* @__PURE__ */ new Map();
    const hotspots = [];
    const buckets = /* @__PURE__ */ new Map();
    const addStats = (uid2, type, inc = 1) => {
      const cur = userStats.get(uid2) || { likes: 0, comments: 0, copies: 0 };
      if (type === "like") cur.likes += inc;
      else if (type === "comment") cur.comments += inc;
      else cur.copies += inc;
      userStats.set(uid2, cur);
    };
    const bucketForDate = (unixSec) => {
      const n = Number(unixSec);
      if (!Number.isFinite(n) || n <= 0) return "unknown";
      const d = new Date(n * 1e3);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    };
    for (const key of Object.keys(obj)) {
      const m = obj[key];
      if (m?.denied) continue;
      const likers = Array.isArray(m?.likes_ids) ? m.likes_ids : [];
      const commenters = Array.isArray(m?.comment_ids) ? m.comment_ids : [];
      const copiers = Array.isArray(m?.copies_ids) ? m.copies_ids : [];
      const uniq = /* @__PURE__ */ new Set();
      for (const id of likers) {
        const uid2 = Number(id);
        if (Number.isFinite(uid2) && uid2 > 0) {
          uniq.add(uid2);
          addStats(uid2, "like", 1);
        }
      }
      for (const id of commenters) {
        const uid2 = Number(id);
        if (Number.isFinite(uid2) && uid2 > 0) {
          uniq.add(uid2);
          addStats(uid2, "comment", 1);
        }
      }
      for (const id of copiers) {
        const uid2 = Number(id);
        if (Number.isFinite(uid2) && uid2 > 0) {
          uniq.add(uid2);
          addStats(uid2, "copy", 1);
        }
      }
      hotspots.push({ key, owner_id: m?.owner_id, id: m?.id, date: m?.date, unique: uniq.size, likes: m?.likes_total ?? 0, comments: m?.comments_total ?? 0, copies: m?.copies_total ?? 0 });
      const b = bucketForDate(m?.date);
      const agg = buckets.get(b) || { likes: 0, comments: 0, copies: 0, unique: 0 };
      agg.likes += Number(m?.likes_total ?? 0);
      agg.comments += Number(m?.comments_total ?? 0);
      agg.copies += Number(m?.copies_total ?? 0);
      agg.unique += uniq.size;
      buckets.set(b, agg);
    }
    const statsArr = Array.from(userStats.entries()).map(([id, s]) => ({ id, likes: s.likes, comments: s.comments, copies: s.copies, total: s.likes + s.comments + s.copies }));
    statsArr.sort((a, b) => b.total - a.total);
    const topTotal = statsArr.slice(0, 50);
    const topLikes = statsArr.slice().sort((a, b) => b.likes - a.likes).slice(0, 50);
    const topComments = statsArr.slice().sort((a, b) => b.comments - a.comments).slice(0, 50);
    const topCopies = statsArr.slice().sort((a, b) => b.copies - a.copies).slice(0, 50);
    const overlap = statsArr.filter((s) => s.likes > 0 && s.comments > 0).slice(0, 200);
    hotspots.sort((a, b) => b.unique - a.unique);
    const topHotspots = hotspots.slice(0, 50);
    const recency = Array.from(buckets.entries()).map(([bucket, v]) => ({ bucket, likes: v.likes, comments: v.comments, copies: v.copies, unique: v.unique })).sort((a, b) => a.bucket.localeCompare(b.bucket));
    response.users = { stats: statsArr, top_total: topTotal, top_likes: topLikes, top_comments: topComments, top_copies: topCopies, overlap };
    response.hotspots = topHotspots;
    response.recency = recency;
  }
  async function enrichPhotosEngagementBatch(pageUrl, batchSize = 5, onlyKeys, opts) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    const bundle = await loadBundle();
    const photosRun = latestOkRunInBundle(bundle, (r) => r.action === "photos.getAll" || r.action === "photos.get");
    const photosAll = Array.isArray(photosRun?.response?.items) ? photosRun.response.items : [];
    if (!photosAll.length) throw new Error("No photos were found in the current session. Run “Extract Photos” first.");
    const itemCapEnabled = !!opts?.itemCapEnabled;
    const itemCapRaw = Number(opts?.itemCap ?? 0);
    const itemCap = itemCapEnabled && Number.isFinite(itemCapRaw) && itemCapRaw > 0 ? Math.round(itemCapRaw) : null;
    const items = [];
    const seen = /* @__PURE__ */ new Set();
    for (const p of photosAll) {
      if (itemCap != null && items.length >= itemCap) break;
      const pid = Number(p?.id);
      const po = Number(p?.owner_id ?? owner_id);
      if (!Number.isFinite(pid) || !Number.isFinite(po)) continue;
      const key = `${po}_${pid}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(p);
    }
    const total = items.length;
    const byKey = /* @__PURE__ */ new Map();
    for (const p of photosAll) {
      const pid = Number(p?.id);
      const po = Number(p?.owner_id ?? owner_id);
      if (!Number.isFinite(pid) || !Number.isFinite(po)) continue;
      const k = `${po}_${pid}`;
      if (!k.includes("NaN")) byKey.set(k, p);
    }
    const prev = latestOkRunInBundle(bundle, (r) => r.action === "vkx.photos.enrich");
    const prevResp = prev && prev.response && typeof prev.response === "object" ? prev.response : null;
    const response = prevResp || {
      caps: {
        max_items: null,
        max_likers_per_item: null,
        max_comments_per_item: null,
        resolved_users: 0
      },
      media: { photos: {} },
      users: { stats: [], top_total: [], top_likes: [], top_comments: [], top_copies: [], overlap: [] },
      hotspots: [],
      recency: [],
      resolved_users: [],
      progress: { total, cursor: 0, done_count: 0, denied_likes_count: 0, denied_copies_count: 0, denied_comments_count: 0, denied_any_count: 0, done: false, backoff_sec: 0 }
    };
    response.progress = response.progress || { total, cursor: 0, done_count: 0, denied_likes_count: 0, denied_copies_count: 0, denied_comments_count: 0, denied_any_count: 0, done: false, backoff_sec: 0 };
    response.progress.total = total;
    response.caps = response.caps || {};
    response.caps.item_cap_enabled = itemCap != null;
    response.caps.max_items = itemCap != null ? itemCap : null;
    response.media = response.media || { photos: {} };
    response.media.photos = response.media.photos || {};
    const per = response.media.photos;
    let processedThisBatch = 0;
    let rateLimitedAfterSec = null;
    const backoffSecRef = { v: Number(response.progress.backoff_sec || 0) };
    let cursor = Number(response.progress.cursor || 0);
    cursor = Math.max(0, Math.min(cursor, total));
    let deniedLikes = Number(response.progress.denied_likes_count || 0);
    let deniedCopies = Number(response.progress.denied_copies_count || 0);
    let deniedComments = Number(response.progress.denied_comments_count || 0);
    try {
      let forced = Array.isArray(onlyKeys) ? onlyKeys.slice() : [];
      forced = forced.map((k) => String(k || "")).filter(Boolean);
      let forcedIdx = 0;
      while (processedThisBatch < batchSize && forcedIdx < forced.length) {
        const key0 = forced[forcedIdx++];
        if (per[key0]) continue;
        const p0 = byKey.get(key0);
        if (!p0) continue;
        const pid0 = Number(p0?.id);
        const po0 = Number(p0?.owner_id ?? owner_id);
        if (!Number.isFinite(pid0) || !Number.isFinite(po0)) continue;
        const likes0 = await fetchLikesIdsEnrichSafe({ type: "photo", owner_id: po0, item_id: pid0 }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        if (likes0.denied) {
          per[key0] = { owner_id: po0, id: pid0, date: p0?.date, denied: true, likes_denied: true, denied_reason: likes0.denied_msg || "access denied" };
          per[key0].lat = p0?.lat;
          per[key0].long = p0?.long;
          deniedLikes++;
          processedThisBatch++;
          await sleep(120);
          continue;
        }
        const copies0 = await fetchCopiesIdsEnrichSafe({ type: "photo", owner_id: po0, item_id: pid0 }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        const copiesDenied0 = !!copies0.denied;
        if (copiesDenied0) deniedCopies++;
        const comm0 = await fetchCommenterIdsEnrichSafe("photos.getComments", { owner_id: po0, photo_id: pid0 }, ENRICH_MAX_COMMENTS_PER_ITEM, backoffSecRef);
        const commDenied0 = !!comm0.denied;
        if (commDenied0) deniedComments++;
        const uniq0 = /* @__PURE__ */ new Set();
        for (const id of likes0.ids) uniq0.add(Number(id));
        for (const id of copies0.ids) uniq0.add(Number(id));
        for (const id of comm0.ids) uniq0.add(Number(id));
        per[key0] = {
          owner_id: po0,
          id: pid0,
          date: p0?.date,
          lat: p0?.lat,
          long: p0?.long,
          likes_total: likes0.total,
          likes_ids: likes0.ids,
          likes_capped: likes0.capped,
          copies_total: copies0.total,
          copies_ids: copies0.ids,
          copies_capped: copies0.capped,
          copies_denied: copiesDenied0,
          comments_total: comm0.total,
          comment_ids: comm0.ids,
          comment_items: comm0.comments,
          comments_capped: comm0.capped,
          comments_denied: commDenied0,
          unique_engagers: uniq0.size
        };
        processedThisBatch++;
        await sleep(180);
      }
      while (processedThisBatch < batchSize && cursor < total) {
        const p = items[cursor];
        const pid = Number(p?.id);
        const po = Number(p?.owner_id ?? owner_id);
        if (!Number.isFinite(pid) || !Number.isFinite(po)) {
          cursor++;
          continue;
        }
        const key = `${po}_${pid}`;
        if (per[key]) {
          cursor++;
          continue;
        }
        const likes = await fetchLikesIdsEnrichSafe({ type: "photo", owner_id: po, item_id: pid }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        if (likes.denied) {
          per[key] = { owner_id: po, id: pid, date: p?.date, denied: true, likes_denied: true, denied_reason: likes.denied_msg || "access denied" };
          per[key].lat = p?.lat;
          per[key].long = p?.long;
          deniedLikes++;
          processedThisBatch++;
          cursor++;
          await sleep(120);
          continue;
        }
        const copies = await fetchCopiesIdsEnrichSafe({ type: "photo", owner_id: po, item_id: pid }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        const copiesDenied = !!copies.denied;
        if (copiesDenied) deniedCopies++;
        const comm = await fetchCommenterIdsEnrichSafe("photos.getComments", { owner_id: po, photo_id: pid }, ENRICH_MAX_COMMENTS_PER_ITEM, backoffSecRef);
        const commDenied = !!comm.denied;
        if (commDenied) deniedComments++;
        const uniq = /* @__PURE__ */ new Set();
        for (const id of likes.ids) uniq.add(Number(id));
        for (const id of comm.ids) uniq.add(Number(id));
        for (const id of copies.ids) uniq.add(Number(id));
        per[key] = {
          owner_id: po,
          id: pid,
          date: p?.date,
          lat: p?.lat,
          long: p?.long,
          likes_total: likes.total,
          likes_ids: likes.ids,
          likes_capped: likes.capped,
          copies_total: copies.total,
          copies_ids: copies.ids,
          copies_capped: copies.capped,
          copies_denied: copiesDenied,
          comments_total: comm.total,
          comment_ids: comm.ids,
          comment_items: comm.comments,
          comments_capped: comm.capped,
          comments_denied: commDenied,
          unique_engagers: uniq.size
        };
        processedThisBatch++;
        cursor++;
        await sleep(180);
      }
    } catch (e) {
      if (e instanceof RateLimitError) {
        rateLimitedAfterSec = e.retryAfterSec;
      } else {
        throw e;
      }
    }
    response.progress.cursor = cursor;
    response.progress.backoff_sec = backoffSecRef.v;
    response.progress.denied_likes_count = deniedLikes;
    response.progress.denied_copies_count = deniedCopies;
    response.progress.denied_comments_count = deniedComments;
    response.progress.denied_any_count = deniedLikes + deniedCopies + deniedComments;
    response.progress.denied_count = response.progress.denied_any_count;
    const itemKeys = items.map((p) => {
      const pid = Number(p?.id);
      const po = Number(p?.owner_id ?? owner_id);
      return `${po}_${pid}`;
    });
    const doneCount = itemKeys.reduce((acc, k) => acc + (per[k] ? 1 : 0), 0);
    response.progress.done_count = doneCount;
    response.progress.done = doneCount >= total;
    recomputeEngagementSingle(response, "photo");
    if (!rateLimitedAfterSec) {
      try {
        const topTotal = Array.isArray(response?.users?.top_total) ? response.users.top_total : [];
        const resolveIds = Array.from(new Set(topTotal.map((x) => Number(x?.id)).filter((n) => Number.isFinite(n) && n > 0))).slice(0, ENRICH_MAX_RESOLVE_USERS);
        if (resolveIds.length) {
          const paramsU = { user_ids: resolveIds.join(","), fields: "photo_100,photo_200,domain,sex,is_closed,deactivated,city,country,verified" };
          const resU = await callWithRetry("users.get", paramsU, 3);
          if (resU.ok && Array.isArray(resU.response)) {
            response.resolved_users = resU.response;
            response.caps.resolved_users = response.resolved_users.length;
          }
          const runU = {
            id: uid("run"),
            ts: now(),
            action: "users.get_engagement_top_photos",
            target,
            request: paramsU,
            ok: resU.ok,
            response: resU.ok ? resU.response : void 0,
            error: resU.ok ? void 0 : resU.error,
            summary: { count: resU.ok && Array.isArray(resU.response) ? resU.response.length : 0, note: "Resolved top engaged users (photos)" }
          };
          await addRun(runU, pageUrl);
        }
      } catch {
      }
    }
    if (rateLimitedAfterSec) {
      response.progress.rate_limited = { retryAfterSec: rateLimitedAfterSec };
    } else {
      response.progress.rate_limited = void 0;
    }
    const run = {
      id: uid("run"),
      ts: now(),
      action: "vkx.photos.enrich",
      target,
      request: {
        owner_id,
        batchSize,
        caps: { items: itemCap != null ? itemCap : null, item_cap_enabled: itemCap != null, likers_per_item: null, commenters_per_item: null }
      },
      ok: true,
      response,
      summary: {
        count: Array.isArray(response?.users?.stats) ? response.users.stats.length : 0,
        note: rateLimitedAfterSec ? `Rate limited (retry after ~${rateLimitedAfterSec}s). Cursor ${cursor}/${total}` : `Cursor ${cursor}/${total} • denied ${response.progress.denied_any_count}`
      }
    };
    await addRun(run, pageUrl);
    return {
      stats: await getStats(),
      progress: {
        total,
        done_count: response.progress.done_count,
        denied_count: response.progress.denied_any_count,
        done: response.progress.done,
        retryAfterSec: rateLimitedAfterSec || 0,
        processedThisBatch
      }
    };
  }
  async function enrichVideosEngagementBatch(pageUrl, batchSize = 5, onlyKeys, opts) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    const bundle = await loadBundle();
    const videosRun = latestOkRunInBundle(bundle, (r) => r.action === "video.get");
    const videosAll = Array.isArray(videosRun?.response?.items) ? videosRun.response.items : [];
    if (!videosAll.length) throw new Error("No videos were found in the current session. Run “Extract Videos” first.");
    const itemCapEnabled = !!opts?.itemCapEnabled;
    const itemCapRaw = Number(opts?.itemCap ?? 0);
    const itemCap = itemCapEnabled && Number.isFinite(itemCapRaw) && itemCapRaw > 0 ? Math.round(itemCapRaw) : null;
    const items = [];
    const seen = /* @__PURE__ */ new Set();
    for (const v of videosAll) {
      if (itemCap != null && items.length >= itemCap) break;
      const vid = Number(v?.id);
      const vo = Number(v?.owner_id ?? owner_id);
      if (!Number.isFinite(vid) || !Number.isFinite(vo)) continue;
      const key = `${vo}_${vid}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(v);
    }
    const total = items.length;
    const byKeyV = /* @__PURE__ */ new Map();
    for (const v of videosAll) {
      const vid = Number(v?.id);
      const vo = Number(v?.owner_id ?? owner_id);
      if (!Number.isFinite(vid) || !Number.isFinite(vo)) continue;
      const k = `${vo}_${vid}`;
      if (!k.includes("NaN")) byKeyV.set(k, v);
    }
    const prev = latestOkRunInBundle(bundle, (r) => r.action === "vkx.videos.enrich");
    const prevResp = prev && prev.response && typeof prev.response === "object" ? prev.response : null;
    const response = prevResp || {
      caps: {
        max_items: null,
        max_likers_per_item: null,
        max_comments_per_item: null,
        resolved_users: 0
      },
      media: { videos: {} },
      users: { stats: [], top_total: [], top_likes: [], top_comments: [], top_copies: [], overlap: [] },
      hotspots: [],
      recency: [],
      resolved_users: [],
      progress: { total, cursor: 0, done_count: 0, denied_likes_count: 0, denied_copies_count: 0, denied_comments_count: 0, denied_any_count: 0, done: false, backoff_sec: 0 }
    };
    response.progress = response.progress || { total, cursor: 0, done_count: 0, denied_likes_count: 0, denied_copies_count: 0, denied_comments_count: 0, denied_any_count: 0, done: false, backoff_sec: 0 };
    response.progress.total = total;
    response.caps = response.caps || {};
    response.caps.item_cap_enabled = itemCap != null;
    response.caps.max_items = itemCap != null ? itemCap : null;
    response.media = response.media || { videos: {} };
    response.media.videos = response.media.videos || {};
    const per = response.media.videos;
    let processedThisBatch = 0;
    let rateLimitedAfterSec = null;
    const backoffSecRef = { v: Number(response.progress.backoff_sec || 0) };
    let cursor = Number(response.progress.cursor || 0);
    cursor = Math.max(0, Math.min(cursor, total));
    let deniedLikes = Number(response.progress.denied_likes_count || 0);
    let deniedCopies = Number(response.progress.denied_copies_count || 0);
    let deniedComments = Number(response.progress.denied_comments_count || 0);
    try {
      let forced = Array.isArray(onlyKeys) ? onlyKeys.slice() : [];
      forced = forced.map((k) => String(k || "")).filter(Boolean);
      let forcedIdx = 0;
      while (processedThisBatch < batchSize && forcedIdx < forced.length) {
        const key0 = forced[forcedIdx++];
        if (per[key0]) continue;
        const v0 = byKeyV.get(key0);
        if (!v0) continue;
        const vid0 = Number(v0?.id);
        const vo0 = Number(v0?.owner_id ?? owner_id);
        if (!Number.isFinite(vid0) || !Number.isFinite(vo0)) continue;
        const likes0 = await fetchLikesIdsEnrichSafe({ type: "video", owner_id: vo0, item_id: vid0, access_key: v0?.access_key }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        if (likes0.denied) {
          per[key0] = { owner_id: vo0, id: vid0, date: v0?.date, access_key: v0?.access_key, denied: true, likes_denied: true, denied_reason: likes0.denied_msg || "access denied" };
          deniedLikes++;
          processedThisBatch++;
          await sleep(120);
          continue;
        }
        const copies0 = await fetchCopiesIdsEnrichSafe({ type: "video", owner_id: vo0, item_id: vid0, access_key: v0?.access_key ? String(v0.access_key) : void 0 }, ENRICH_MAX_LIKERS_PER_ITEM, backoffSecRef);
        const copiesDenied0 = !!copies0.denied;
        if (copiesDenied0) deniedCopies++;
        const comm0 = await fetchCommenterIdsEnrichSafe("video.getComments", { owner_id: vo0, video_id: vid0 }, ENRICH_MAX_COMMENTS_PER_ITEM, backoffSecRef);
        const commDenied0 = !!comm0.denied;
        if (commDenied0) deniedComments++;
        const uniq0 = /* @__PURE__ */ new Set();
        for (const id of likes0.ids) uniq0.add(Number(id));
        for (const id of copies0.ids) uniq0.add(Number(id));
        for (const id of comm0.ids) uniq0.add(Number(id));
        per[key0] = {
          owner_id: vo0,
          id: vid0,
          date: v0?.date,
          access_key: v0?.access_key,
          likes_total: likes0.total,
          likes_ids: likes0.ids,
          likes_capped: likes0.capped,
          copies_total: copies0.total,
          copies_ids: copies0.ids,
          copies_capped: copies0.capped,
          copies_denied: copiesDenied0,
          comments_total: comm0.total,
          comment_ids: comm0.ids,
          comment_items: comm0.comments,
          comments_capped: comm0.capped,
          comments_denied: commDenied0,
          unique_engagers: uniq0.size
        };
        processedThisBatch++;
        await sleep(180);
      }
      while (processedThisBatch < batchSize && cursor < total) {
        const v = items[cursor];
        const vid = Number(v?.id);
        const vo = Number(v?.owner_id ?? owner_id);
        if (!Number.isFinite(vid) || !Number.isFinite(vo)) {
          cursor++;
          continue;
        }
        const key = `${vo}_${vid}`;
        if (per[key]) {
          cursor++;
          continue;
        }
        const likes = await fetchLikesIdsEnrichSafe(
          { type: "video", owner_id: vo, item_id: vid, access_key: v?.access_key ? String(v.access_key) : void 0 },
          ENRICH_MAX_LIKERS_PER_ITEM,
          backoffSecRef
        );
        if (likes.denied) {
          per[key] = { owner_id: vo, id: vid, date: v?.date, access_key: v?.access_key, denied: true, likes_denied: true, denied_reason: likes.denied_msg || "access denied" };
          deniedLikes++;
          processedThisBatch++;
          cursor++;
          await sleep(120);
          continue;
        }
        const copies = await fetchCopiesIdsEnrichSafe(
          { type: "video", owner_id: vo, item_id: vid, access_key: v?.access_key ? String(v.access_key) : void 0 },
          ENRICH_MAX_LIKERS_PER_ITEM,
          backoffSecRef
        );
        const copiesDenied = !!copies.denied;
        if (copiesDenied) deniedCopies++;
        const commentParams = { owner_id: vo, video_id: vid };
        if (v?.access_key) commentParams.access_key = String(v.access_key);
        const comm = await fetchCommenterIdsEnrichSafe("video.getComments", commentParams, ENRICH_MAX_COMMENTS_PER_ITEM, backoffSecRef);
        const commDenied = !!comm.denied;
        if (commDenied) deniedComments++;
        const uniq = /* @__PURE__ */ new Set();
        for (const id of likes.ids) uniq.add(Number(id));
        for (const id of copies.ids) uniq.add(Number(id));
        for (const id of comm.ids) uniq.add(Number(id));
        per[key] = {
          owner_id: vo,
          id: vid,
          date: v?.date,
          access_key: v?.access_key,
          likes_total: likes.total,
          likes_ids: likes.ids,
          likes_capped: likes.capped,
          copies_total: copies.total,
          copies_ids: copies.ids,
          copies_capped: copies.capped,
          copies_denied: copiesDenied,
          comments_total: comm.total,
          comment_ids: comm.ids,
          comment_items: comm.comments,
          comments_capped: comm.capped,
          comments_denied: commDenied,
          unique_engagers: uniq.size
        };
        processedThisBatch++;
        cursor++;
        await sleep(180);
      }
    } catch (e) {
      if (e instanceof RateLimitError) {
        rateLimitedAfterSec = e.retryAfterSec;
      } else {
        throw e;
      }
    }
    response.progress.cursor = cursor;
    response.progress.backoff_sec = backoffSecRef.v;
    response.progress.denied_likes_count = deniedLikes;
    response.progress.denied_copies_count = deniedCopies;
    response.progress.denied_comments_count = deniedComments;
    response.progress.denied_any_count = deniedLikes + deniedCopies + deniedComments;
    response.progress.denied_count = response.progress.denied_any_count;
    const itemKeys = items.map((p) => {
      const pid = Number(p?.id);
      const po = Number(p?.owner_id ?? owner_id);
      return `${po}_${pid}`;
    });
    const doneCount = itemKeys.reduce((acc, k) => acc + (per[k] ? 1 : 0), 0);
    response.progress.done_count = doneCount;
    response.progress.done = doneCount >= total;
    recomputeEngagementSingle(response, "video");
    if (!rateLimitedAfterSec) {
      try {
        const topTotal = Array.isArray(response?.users?.top_total) ? response.users.top_total : [];
        const resolveIds = Array.from(new Set(topTotal.map((x) => Number(x?.id)).filter((n) => Number.isFinite(n) && n > 0))).slice(0, ENRICH_MAX_RESOLVE_USERS);
        if (resolveIds.length) {
          const paramsU = { user_ids: resolveIds.join(","), fields: "photo_100,photo_200,domain,sex,is_closed,deactivated,city,country,verified" };
          const resU = await callWithRetry("users.get", paramsU, 3);
          if (resU.ok && Array.isArray(resU.response)) {
            response.resolved_users = resU.response;
            response.caps.resolved_users = response.resolved_users.length;
          }
          const runU = {
            id: uid("run"),
            ts: now(),
            action: "users.get_engagement_top_videos",
            target,
            request: paramsU,
            ok: resU.ok,
            response: resU.ok ? resU.response : void 0,
            error: resU.ok ? void 0 : resU.error,
            summary: { count: resU.ok && Array.isArray(resU.response) ? resU.response.length : 0, note: "Resolved top engaged users (videos)" }
          };
          await addRun(runU, pageUrl);
        }
      } catch {
      }
    }
    if (rateLimitedAfterSec) {
      response.progress.rate_limited = { retryAfterSec: rateLimitedAfterSec };
    } else {
      response.progress.rate_limited = void 0;
    }
    const run = {
      id: uid("run"),
      ts: now(),
      action: "vkx.videos.enrich",
      target,
      request: {
        owner_id,
        batchSize,
        caps: { items: itemCap != null ? itemCap : null, item_cap_enabled: itemCap != null, likers_per_item: null, commenters_per_item: null }
      },
      ok: true,
      response,
      summary: {
        count: Array.isArray(response?.users?.stats) ? response.users.stats.length : 0,
        note: rateLimitedAfterSec ? `Rate limited (retry after ~${rateLimitedAfterSec}s). Cursor ${cursor}/${total}` : `Cursor ${cursor}/${total} • denied ${response.progress.denied_any_count}`
      }
    };
    await addRun(run, pageUrl);
    return {
      stats: await getStats(),
      progress: {
        total,
        done_count: response.progress.done_count,
        denied_count: response.progress.denied_any_count,
        done: response.progress.done,
        retryAfterSec: rateLimitedAfterSec || 0,
        processedThisBatch
      }
    };
  }
  async function extractStories(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const owner_id = ownerIdForTarget(target);
    if (typeof owner_id !== "number") throw new Error("Could not resolve owner_id for this page.");
    const method = "stories.get";
    const params = { owner_id };
    popupUpdate("stories", { state: "running", processed: 0, total: void 0, note: "Calling stories.get…" });
    const res = await callWithRetry(method, params, 2);
    const run = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: params,
      ok: res.ok,
      response: res.ok ? res.response : void 0,
      error: res.ok ? void 0 : res.error,
      summary: { count: res.ok ? Array.isArray(res.response?.items) ? res.response.items.length : void 0 : 0 }
    };
    await addRun(run, pageUrl);
    if (run.ok) {
      const count = Array.isArray(res.response?.items) ? res.response.items.length : 0;
      popupUpdate("stories", { state: "done", ok: true, processed: count, total: count || void 0, note: "Done" });
    } else {
      popupUpdate("stories", { state: "blocked", ok: false, processed: 0, total: void 0, error: normalizeVkError(run.error), note: "Unavailable / access denied" });
    }
    return await getStats();
  }
  async function extractGifts(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    if (target.kind !== "user" || typeof target.id !== "number") throw new Error("Gifts extraction is only available for user profiles.");
    const method = "gifts.get";
    popupUpdate("gifts", { state: "running", processed: 0, total: void 0, note: "Starting gifts.get…" });
    const all = [];
    let offset = 0;
    const pageSize = 100;
    let total = 0;
    while (true) {
      const params = { user_id: target.id, offset, count: pageSize };
      const res = await callWithRetry(method, params, 3);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("gifts", {
          state: "blocked",
          ok: false,
          processed: all.length,
          total: total || void 0,
          error: normalizeVkError(res.error),
          note: "Request failed"
        });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      popupUpdate("gifts", {
        state: "running",
        processed: all.length,
        total: total || void 0,
        note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
      });
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(200);
    }
    let senders = [];
    try {
      const fromIds = Array.from(new Set(all.map((g) => Number(g?.from_id)).filter((n) => Number.isFinite(n) && n > 0)));
      if (fromIds.length) {
        const paramsU = { fields: "photo_100,photo_200,domain,sex,is_closed,deactivated,city,country,verified" };
        const resU = await usersGetChunked(fromIds, paramsU.fields, 3);
        if (resU.ok) senders = resU.users;
        const runU = {
          id: uid("run"),
          ts: now(),
          action: "users.get_gifts_senders",
          target,
          request: paramsU,
          ok: resU.ok,
          response: resU.ok ? resU.users : void 0,
          error: resU.ok ? void 0 : resU.error,
          summary: { count: resU.ok ? resU.users.length : 0, note: "Resolved gift senders" }
        };
        await addRun(runU, pageUrl);
      }
    } catch {
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { user_id: target.id, mode: "all" },
      ok: true,
      response: { count: total, items: all, senders, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("gifts", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
    return await getStats();
  }
  async function extractFollowing(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    if (target.kind !== "user" || typeof target.id !== "number") throw new Error("Following extraction is only available for user profiles.");
    const method = "users.getSubscriptions";
    const users = [];
    const groups = [];
    let offset = 0;
    const pageSize = 200;
    let total = 0;
    popupUpdate("following", { state: "running", processed: 0, total: void 0, note: "Starting users.getSubscriptions…" });
    while (true) {
      const params = {
        user_id: target.id,
        extended: 1,
        fields: "id,domain,first_name,last_name,photo_100,city,country,sex,is_closed,deactivated",
        offset,
        count: pageSize
      };
      const res = await callWithRetry(method, params);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("following", { state: "blocked", ok: false, processed: users.length + groups.length, total: total || void 0, error: normalizeVkError(res.error), note: "Request failed" });
        return await getStats();
      }
      const resp = res.response;
      const uItems = Array.isArray(resp?.users?.items) ? resp.users.items : Array.isArray(resp?.users) ? resp.users : [];
      const gItems = Array.isArray(resp?.groups?.items) ? resp.groups.items : Array.isArray(resp?.groups) ? resp.groups : [];
      const before = users.length + groups.length;
      users.push(...uItems);
      groups.push(...gItems);
      total = Number(resp?.count ?? resp?.users?.count ?? resp?.groups?.count ?? total);
      const added = users.length + groups.length - before;
      if (added <= 0) break;
      popupUpdate("following", { state: "running", processed: users.length + groups.length, total: total || void 0, note: total ? `${users.length + groups.length}/${total}` : `Processed: ${users.length + groups.length}` });
      offset += added;
      if (total && offset >= total) break;
      await sleep(200);
    }
    const combined = users.length + groups.length;
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { user_id: target.id, mode: "all" },
      ok: true,
      response: { count: total, users, groups, capped: false },
      summary: { count: combined, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("following", { state: "done", ok: true, processed: combined, total: total || void 0, note });
    return await getStats();
  }
  async function extractFollowers(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    if (target.kind !== "user" || typeof target.id !== "number") throw new Error("Followers extraction is only available for user profiles.");
    const method = "users.getFollowers";
    const all = [];
    let offset = 0;
    const pageSize = 1e3;
    let total = 0;
    popupUpdate("followers", { state: "running", processed: 0, total: void 0, note: "Starting users.getFollowers…" });
    while (true) {
      const params = { user_id: target.id, fields: USER_FIELDS_LIGHT, offset, count: pageSize };
      const res = await callWithRetry(method, params);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("followers", {
          state: "blocked",
          ok: false,
          processed: all.length,
          total: total || void 0,
          error: normalizeVkError(res.error),
          note: "Request failed"
        });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      popupUpdate("followers", {
        state: "running",
        processed: all.length,
        total: total || void 0,
        note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
      });
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(200);
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { user_id: target.id, mode: "all" },
      ok: true,
      response: { count: total, items: all, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("followers", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
    return await getStats();
  }
  async function extractCommunities(pageUrl) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    if (target.kind !== "user" || typeof target.id !== "number") throw new Error("Communities extraction is only available for user profiles.");
    const method = "groups.get";
    const all = [];
    let offset = 0;
    const pageSize = 1e3;
    let total = 0;
    popupUpdate("communities", { state: "running", processed: 0, total: void 0, note: "Starting groups.get…" });
    while (true) {
      const params = {
        user_id: target.id,
        extended: 1,
        fields: "name,screen_name,is_closed,type,photo_100,photo_200,members_count,verified,city,country,site",
        offset,
        count: pageSize
      };
      const res = await callWithRetry(method, params);
      if (!res.ok) {
        const runFail = {
          id: uid("run"),
          ts: now(),
          action: method,
          target,
          request: params,
          ok: false,
          error: res.error
        };
        await addRun(runFail, pageUrl);
        popupUpdate("communities", {
          state: "blocked",
          ok: false,
          processed: all.length,
          total: total || void 0,
          error: normalizeVkError(res.error),
          note: "Request failed"
        });
        return await getStats();
      }
      const resp = res.response;
      total = Number(resp?.count ?? total);
      const items = Array.isArray(resp?.items) ? resp.items : [];
      all.push(...items);
      popupUpdate("communities", {
        state: "running",
        processed: all.length,
        total: total || void 0,
        note: total ? `${all.length}/${total}` : `Processed: ${all.length}`
      });
      if (!items.length) break;
      offset += items.length;
      if (total && offset >= total) break;
      await sleep(200);
    }
    const note = total ? `total: ${total}` : void 0;
    const runOk = {
      id: uid("run"),
      ts: now(),
      action: method,
      target,
      request: { user_id: target.id, mode: "all" },
      ok: true,
      response: { count: total, items: all, capped: false },
      summary: { count: all.length, note }
    };
    await addRun(runOk, pageUrl);
    popupUpdate("communities", { state: "done", ok: true, processed: all.length, total: total || void 0, note });
    return await getStats();
  }
  function isLikelyFullUser(u) {
    if (!u || typeof u !== "object") return false;
    const keys = ["counters", "bdate", "occupation", "schools", "universities", "career", "military", "personal", "activities", "interests", "music", "movies", "tv", "books", "games", "about", "quotes", "relation", "relatives", "exports", "followers_count", "last_seen", "status"];
    return keys.some((k) => u[k] != null);
  }
  async function resolveUsers(pageUrl, userIds, opts) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const full = !!opts?.full;
    const ids = Array.from(new Set((userIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0)));
    if (!ids.length) throw new Error("No user IDs provided.");
    const bundle = await loadBundle();
    const prev = latestOkRunInBundle(bundle, (r) => r.action === "vkx.users.resolve");
    const prevUsers = Array.isArray(prev?.response?.users) ? prev.response.users : [];
    const existing = /* @__PURE__ */ new Map();
    for (const u of prevUsers) {
      const id = Number(u?.id);
      if (Number.isFinite(id)) existing.set(id, u);
    }
    const need = ids.filter((id) => {
      if (!existing.has(id)) return true;
      if (full) {
        const u = existing.get(id);
        return !isLikelyFullUser(u);
      }
      return false;
    });
    let fetched = [];
    if (need.length) {
      const fields = full ? USER_FIELDS_FULL : USER_FIELDS_LIGHT;
      const res = await usersGetChunked(need, fields, 3);
      if (!res.ok) throw new Error(String(res.error?.error_msg || res.error?.message || "users.get failed"));
      fetched = res.users;
      for (const u of fetched) {
        const id = Number(u?.id);
        if (Number.isFinite(id)) existing.set(id, u);
      }
    }
    const merged = Array.from(existing.values());
    const run = {
      id: uid("run"),
      ts: now(),
      action: "vkx.users.resolve",
      target,
      request: { user_ids: ids, full },
      ok: true,
      response: { users: merged },
      summary: { count: merged.length, note: fetched.length ? `Resolved ${fetched.length} new user(s).` : "No new users resolved." }
    };
    await addRun(run, pageUrl);
    return await getStats();
  }
  async function resolveGroups(pageUrl, groupIds, opts) {
    const token = await getToken();
    ensureToken(token);
    await setClientToken(token);
    const target = await detectAndPersistTarget(pageUrl);
    const full = !!opts?.full;
    const ids = Array.from(new Set((groupIds || []).map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0)));
    if (!ids.length) throw new Error("No group IDs provided.");
    const bundle = await loadBundle();
    const prev = latestOkRunInBundle(bundle, (r) => r.action === "vkx.groups.resolve");
    const prevGroups = Array.isArray(prev?.response?.groups) ? prev.response.groups : [];
    const existing = /* @__PURE__ */ new Map();
    for (const g of prevGroups) {
      const id = Number(g?.id);
      if (Number.isFinite(id)) existing.set(id, g);
    }
    const need = ids.filter((id) => {
      if (!existing.has(id)) return true;
      if (full) {
        const u = existing.get(id);
        return !isLikelyFullUser(u);
      }
      return false;
    });
    let fetched = [];
    if (need.length) {
      const fields = full ? GROUP_FIELDS_FULL : GROUP_FIELDS_LIGHT;
      const parts = chunk(need, 450);
      const out = [];
      for (const part of parts) {
        const params = { group_ids: part.join(","), fields };
        const res = await callWithRetry("groups.getById", params, 3);
        if (!res.ok) throw new Error(String(res.error?.error_msg || res.error?.message || "groups.getById failed"));
        if (Array.isArray(res.response)) out.push(...res.response);
      }
      fetched = out;
      for (const g of fetched) {
        const id = Number(g?.id);
        if (Number.isFinite(id)) existing.set(id, g);
      }
    }
    const merged = Array.from(existing.values());
    const run = {
      id: uid("run"),
      ts: now(),
      action: "vkx.groups.resolve",
      target,
      request: { group_ids: ids, full },
      ok: true,
      response: { groups: merged },
      summary: { count: merged.length, note: fetched.length ? `Resolved ${fetched.length} new group(s).` : "No new groups resolved." }
    };
    await addRun(run, pageUrl);
    return await getStats();
  }
  function latestRunForActions(runs, actions) {
    const set = new Set(actions);
    let best;
    for (const r of runs) {
      if (!r || !set.has(String(r.action || ""))) continue;
      if (!best || Number(r.ts) > Number(best.ts)) best = r;
    }
    return best;
  }
  function runToPopupMeta(key, run) {
    if (!run) return { key };
    const err = run.ok ? void 0 : normalizeVkError(run.error);
    let processed = Number(run.summary?.count);
    if (!Number.isFinite(processed) || processed < 0) processed = 0;
    let total = Number(run.response?.count);
    if (!Number.isFinite(total) || total < 0) total = 0;
    const note = run.summary?.note ? String(run.summary.note) : void 0;
    return {
      key,
      ok: !!run.ok,
      processed,
      total: total || void 0,
      note,
      error: err,
      lastTs: Number(run.ts) || void 0,
      state: run.ok ? "done" : "blocked"
    };
  }
  function sanitizePathPart(v) {
    return String(v ?? "").replace(/[<>:]/g, "_").replace(/["'`]/g, "").replace(/[\/|?*]/g, "_").replace(/[\x00-\x1F]/g, "_").replace(/\s+/g, " ").trim().replace(/ /g, "_").slice(0, 96) || "item";
  }
  function mediaSlotKey(kind, key) {
    return `${kind}:${String(key || "").trim()}`;
  }
  function targetExportFolder(target) {
    const label = sanitizePathPart(target?.screenName || (target?.kind === "group" ? "group" : "user"));
    const id = Number(target?.id);
    return `vkXtract/${label} - ${Number.isFinite(id) && id > 0 ? id : "unknown"}`;
  }
  function inferExtFromUrl(url, fallback = ".bin") {
    const clean = String(url || "").split("#")[0].split("?")[0];
    const m = clean.match(/\.([a-zA-Z0-9]{2,5})$/);
    if (!m) return fallback;
    const ext = "." + String(m[1] || "").toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff", ".avif"].includes(ext)) return ext;
    return fallback;
  }
  function photoAlbumFolderName(albumKey, albumTitle) {
    const rawKey = String(albumKey || "").trim();
    if (rawKey === "-6") return "Profile photos";
    if (rawKey === "-7") return "Wall photos";
    if (rawKey === "-15") return "Saved photos";
    if (rawKey === "-8") return "Photos with you";
    const rawTitle = String(albumTitle || "").trim();
    return rawTitle || (rawKey ? `Album ${rawKey}` : "Unsorted");
  }
  function wantedPhotoCopyPaths(target, filenameHint, ext, albumKey, albumTitle) {
    const baseName = sanitizePathPart(filenameHint || "item");
    const mainPath = `${targetExportFolder(target)}/media/photos/${baseName}${ext}`;
    const rawAlbumKey = String(albumKey || "").trim();
    const rawAlbumTitle = String(albumTitle || "").trim();
    const paths = [mainPath];
    if (rawAlbumKey || rawAlbumTitle) {
      const albumFolder = sanitizePathPart(photoAlbumFolderName(rawAlbumKey, rawAlbumTitle));
      if (albumFolder) paths.push(`${targetExportFolder(target)}/media/photos/albums/${albumFolder}/${baseName}${ext}`);
    }
    return Array.from(new Set(paths));
  }
  async function requestOfflinePhotoCopy(pageUrl, key, remoteUrl, filenameHint, albumKey, albumTitle) {
    const bundle = await loadBundle();
    const target = bundle?.target || await detectAndPersistTarget(pageUrl);
    const cleanKey = String(key || "").trim();
    const cleanUrl = String(remoteUrl || "").trim();
    if (!cleanKey || !cleanUrl) throw new Error("Missing media key or remote URL.");
    const next = bundle && bundle.schema === "vkxtract.capture.v1" ? bundle : await loadBundle();
    next.offlineMedia || (next.offlineMedia = {});
    const slot = mediaSlotKey("photo", cleanKey);
    const existing = next.offlineMedia[slot];
    const ext = inferExtFromUrl(cleanUrl, ".jpg");
    const wantedPaths = wantedPhotoCopyPaths(target, filenameHint || "photo_" + cleanKey, ext, albumKey, albumTitle);
    const recordedPaths = Array.from(new Set([
      String(existing?.localPath || "").trim(),
      ...(Array.isArray(existing?.localPaths) ? existing.localPaths : []).map((x) => String(x || "").trim())
    ].filter(Boolean)));
    const missingPaths = wantedPaths.filter((p) => !recordedPaths.includes(p));
    if (existing && !missingPaths.length && String(existing.status || "") !== "failed") {
      return { ok: true, item: existing, downloadId: null, alreadyRecorded: true };
    }
    const downloadIds = [];
    for (const path of missingPaths) {
      const downloadId = await chrome.downloads.download({
        url: cleanUrl,
        filename: path,
        saveAs: false,
        conflictAction: "uniquify"
      });
      if (Number.isFinite(Number(downloadId))) downloadIds.push(Number(downloadId));
    }
    const allPaths = Array.from(/* @__PURE__ */ new Set([...recordedPaths.length ? recordedPaths : [], ...wantedPaths]));
    const rec = {
      key: cleanKey,
      kind: "photo",
      remoteUrl: cleanUrl,
      localPath: allPaths[0] || wantedPaths[0],
      localPaths: allPaths,
      downloadedAt: Date.now(),
      status: "requested",
      note: downloadIds.length ? `Download requests: ${downloadIds.join(", ")}` : existing?.note || "Download already recorded"
    };
    next.offlineMedia[slot] = rec;
    next.lastUpdatedAt = now();
    await saveBundle(next);
    return { ok: true, item: rec, downloadId: downloadIds[0] ?? null, alreadyRecorded: !missingPaths.length };
  }
  async function requestOfflinePhotoCopyBatch(pageUrl, items) {
    const bundle = await loadBundle();
    const target = bundle?.target || await detectAndPersistTarget(pageUrl);
    const next = bundle && bundle.schema === "vkxtract.capture.v1" ? bundle : await loadBundle();
    next.offlineMedia || (next.offlineMedia = {});
    let requested = 0;
    let skipped = 0;
    const out = [];
    for (const raw of Array.isArray(items) ? items : []) {
      const cleanKey = String(raw?.key || "").trim();
      const cleanUrl = String(raw?.remoteUrl || "").trim();
      if (!cleanKey || !cleanUrl) {
        skipped++;
        continue;
      }
      const slot = mediaSlotKey("photo", cleanKey);
      const existing = next.offlineMedia[slot];
      const ext = inferExtFromUrl(cleanUrl, ".jpg");
      const wantedPaths = wantedPhotoCopyPaths(target, raw?.filenameHint || "photo_" + cleanKey, ext, raw?.albumKey, raw?.albumTitle);
      const recordedPaths = Array.from(new Set([
        String(existing?.localPath || "").trim(),
        ...(Array.isArray(existing?.localPaths) ? existing.localPaths : []).map((x) => String(x || "").trim())
      ].filter(Boolean)));
      const missingPaths = wantedPaths.filter((p) => !recordedPaths.includes(p));
      if (existing && !missingPaths.length && String(existing.status || "") !== "failed") {
        skipped++;
        out.push(existing);
        continue;
      }
      const downloadIds = [];
      for (const path of missingPaths) {
        const downloadId = await chrome.downloads.download({
          url: cleanUrl,
          filename: path,
          saveAs: false,
          conflictAction: "uniquify"
        });
        if (Number.isFinite(Number(downloadId))) downloadIds.push(Number(downloadId));
      }
      const allPaths = Array.from(/* @__PURE__ */ new Set([...recordedPaths.length ? recordedPaths : [], ...wantedPaths]));
      const rec = {
        key: cleanKey,
        kind: "photo",
        remoteUrl: cleanUrl,
        localPath: allPaths[0] || wantedPaths[0],
        localPaths: allPaths,
        downloadedAt: Date.now(),
        status: "requested",
        note: downloadIds.length ? `Download requests: ${downloadIds.join(", ")}` : existing?.note || "Download already recorded"
      };
      next.offlineMedia[slot] = rec;
      out.push(rec);
      if (missingPaths.length) requested += 1;
      else skipped += 1;
    }
    next.lastUpdatedAt = now();
    await saveBundle(next);
    return { ok: true, requested, skipped, items: out };
  }
  async function buildPopupMeta() {
    const b = await loadBundle();
    const runs = Array.isArray(b?.runs) ? b.runs : [];
    const tasks = {
      profile: runToPopupMeta("profile", latestRunForActions(runs, ["users.get", "groups.getById"])),
      friends: runToPopupMeta("friends", latestRunForActions(runs, ["friends.get", "groups.getMembers"])),
      followers: runToPopupMeta("followers", latestRunForActions(runs, ["users.getFollowers"])),
      following: runToPopupMeta("following", latestRunForActions(runs, ["users.getSubscriptions"])),
      communities: runToPopupMeta("communities", latestRunForActions(runs, ["groups.get"])),
      wall: runToPopupMeta("wall", latestRunForActions(runs, ["vkx.wall.snapshot"])),
      photos: runToPopupMeta("photos", latestRunForActions(runs, ["photos.getAll", "photos.get"])),
      videos: runToPopupMeta("videos", latestRunForActions(runs, ["video.get"])),
      stories: runToPopupMeta("stories", latestRunForActions(runs, ["stories.get"])),
      gifts: runToPopupMeta("gifts", latestRunForActions(runs, ["gifts.get"]))
    };
    return {
      ok: true,
      busy: { active: isBusy(), reason: busyReason || void 0, until: busyUntil || void 0 },
      tasks,
      live: popupLiveSession
    };
  }
  chrome.runtime.onInstalled.addListener(() => {
  });
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    const m = msg || {};
    (async () => {
      if (isBusy()) {
        const allow = /* @__PURE__ */ new Set([
          "VKX_GET_STATS",
          "VKX_EXPORT_BUNDLE",
          "VKX_SET_TOKEN",
          "VKX_CLEAR_TOKEN",
          "VKX_DETECT_TARGET",
          "VKX_DETECT_TARGET_PREVIEW",
          "VKX_STORAGE_LIST",
          "VKX_CLEAR_BUSY",
          "VKX_POPUP_GET_META",
          "VKX_DOWNLOAD_MEDIA_COPY",
          "VKX_DOWNLOAD_MEDIA_COPY_BATCH",
          "VKX_ZIP_EXPORT_PING",
          "VKX_ZIP_EXPORT_START",
          "VKX_ZIP_EXPORT_CANCEL",
          "VKX_ZIP_EXPORT_PROGRESS",
          "VKX_ZIP_EXPORT_DONE",
          "VKX_ZIP_EXPORT_ERROR",
          // Allow cleanup while enrichment is active / busy lock is stuck
          "VKX_RESET",
          "VKX_DELETE_ACTIVE_TARGET",
          "VKX_DELETE_TARGET",
          "VKX_DELETE_ALL_DATA"
        ]);
        const isEnrich = m.type === "VKX_ENRICH_PHOTOS_BATCH" || m.type === "VKX_ENRICH_VIDEOS_BATCH";
        if (!allow.has(String(m.type)) && !isEnrich) {
          sendResponse({ ok: false, error: `Enrichment in progress (${busyReason || "busy"}). Stop enrichment or wait until it completes.` });
          return;
        }
      }
      switch (m.type) {
        case "VKX_GET_STATS": {
          sendResponse(await getStats());
          break;
        }
        case "VKX_POPUP_GET_META": {
          sendResponse(await buildPopupMeta());
          break;
        }
        case "VKX_ZIP_EXPORT_PING": {
          const offscreen = await sendToZipOffscreen({ type: "VKX_OFFSCREEN_ZIP_PING" });
          sendResponse({
            ok: !!offscreen?.ok,
            broker: "background",
            active: !!zipBrokerState.active,
            exportId: String(zipBrokerState.exportId || ""),
            offscreen
          });
          break;
        }
        case "VKX_ZIP_EXPORT_START": {
          if (zipBrokerState.active) {
            sendResponse({
              ok: false,
              error: "zip_export_busy",
              exportId: String(zipBrokerState.exportId || "")
            });
            break;
          }
          const exportId = String(m.exportId || uid()).trim();
          if (!exportId) {
            sendResponse({ ok: false, error: "zip_export_missing_id" });
            break;
          }
          const planCheck = validateZipBrokerPlan(m.plan ?? null);
          if (!planCheck.ok) {
            sendResponse({
              ok: false,
              exportId,
              error: String(planCheck.error || "zip_export_invalid_plan"),
              entryCount: Number(planCheck.entryCount || 0)
            });
            break;
          }
          zipBrokerState = {
            active: true,
            exportId,
            startedAt: Date.now(),
            cancelled: false
          };
          const offscreen = await sendToZipOffscreen({
            type: "VKX_OFFSCREEN_ZIP_START",
            exportId,
            plan: m.plan ?? null
          });
          if (!offscreen?.ok) {
            resetZipBrokerState();
            sendResponse({
              ok: false,
              exportId,
              error: String(offscreen?.error || "zip_export_start_failed")
            });
            break;
          }
          relayZipBrokerMessage({
            type: "VKX_ZIP_EXPORT_PROGRESS",
            exportId,
            text: `ZIP export broker ready… (${Number(planCheck.entryCount || 0)} file(s))`,
            pct: 2
          });
          sendResponse({
            ok: true,
            exportId,
            accepted: true,
            offscreen
          });
          break;
        }
        case "VKX_ZIP_EXPORT_CANCEL": {
          const exportId = String(m.exportId || zipBrokerState.exportId || "").trim();
          if (!exportId) {
            sendResponse({ ok: false, error: "zip_export_not_active" });
            break;
          }
          zipBrokerState.cancelled = true;
          relayZipBrokerMessage({
            type: "VKX_ZIP_EXPORT_PROGRESS",
            exportId,
            text: "Cancelling ZIP export…",
            pct: 1
          });
          const offscreen = await sendToZipOffscreen({
            type: "VKX_OFFSCREEN_ZIP_CANCEL",
            exportId
          });
          sendResponse({
            ok: !!offscreen?.ok,
            exportId,
            cancelled: !!offscreen?.cancelled
          });
          break;
        }
        case "VKX_ZIP_EXPORT_PROGRESS": {
          if (String(m.target || "") === "background") {
            relayZipBrokerMessage({
              type: "VKX_ZIP_EXPORT_PROGRESS",
              exportId: String(m.exportId || ""),
              text: String(m.text || ""),
              pct: Number(m.pct || 0)
            });
            sendResponse({ ok: true });
            break;
          }
          sendResponse({ ok: false, error: "zip_export_progress_target_invalid" });
          break;
        }
        case "VKX_ZIP_EXPORT_DONE": {
          if (String(m.target || "") === "background") {
            const exportId = String(m.exportId || "");
            const filename = String(m.filename || "");
            const blobUrl = String(m.blobUrl || "").trim();
            try {
              const downloadId = await downloadZipBrokerBlobUrl(blobUrl, filename);
              relayZipBrokerMessage({
                type: "VKX_ZIP_EXPORT_DONE",
                exportId,
                downloadId: Number(downloadId || 0) || 0,
                filename,
                text: String(m.text || `ZIP package saved to Downloads/${filename}.`)
              });
              resetZipBrokerState();
              sendResponse({
                ok: true,
                exportId,
                downloadId: Number(downloadId || 0) || 0,
                filename
              });
              break;
            } catch (e) {
              relayZipBrokerMessage({
                type: "VKX_ZIP_EXPORT_ERROR",
                exportId,
                error: String(e?.message || e || "zip_export_failed"),
                text: "ZIP export failed."
              });
              resetZipBrokerState();
              sendResponse({
                ok: false,
                exportId,
                error: String(e?.message || e || "zip_export_failed")
              });
              break;
            }
          }
          sendResponse({ ok: false, error: "zip_export_done_target_invalid" });
          break;
        }
        case "VKX_ZIP_EXPORT_ERROR": {
          if (String(m.target || "") === "background") {
            relayZipBrokerMessage({
              type: "VKX_ZIP_EXPORT_ERROR",
              exportId: String(m.exportId || ""),
              error: String(m.error || "zip_export_failed"),
              text: String(m.text || "")
            });
            resetZipBrokerState();
            sendResponse({ ok: true });
            break;
          }
          sendResponse({ ok: false, error: "zip_export_error_target_invalid" });
          break;
        }
        case "VKX_SET_TOKEN": {
          const token = String(m.token || "");
          await setToken(token);
          await setClientToken(token);
          sendResponse({ ok: true });
          break;
        }
        case "VKX_CLEAR_BUSY": {
          clearBusy();
          sendResponse({ ok: true });
          break;
        }
        case "VKX_CLEAR_TOKEN": {
          await clearToken();
          await setClientToken("");
          sendResponse({ ok: true });
          break;
        }
        case "VKX_DETECT_TARGET": {
          const pageUrl = String(m.pageUrl || "");
          const target = pageUrl ? await detectAndPersistTarget(pageUrl) : (await loadBundle()).target;
          sendResponse({ ok: true, target });
          break;
        }
        case "VKX_DETECT_TARGET_PREVIEW": {
          const pageUrl = String(m.pageUrl || "");
          const target = pageUrl ? await detectTargetResolved(pageUrl, { persist: false }) : (await loadBundle()).target;
          sendResponse({ ok: true, target });
          break;
        }
        case "VKX_EXTRACT_PROFILE": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractProfile(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_FRIENDS": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractFriendsMembers(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_FOLLOWING": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractFollowing(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_FOLLOWERS": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractFollowers(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_COMMUNITIES": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractCommunities(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_WALL_SNAPSHOT": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({
            ok: true,
            stats: await extractWallSnapshot(pageUrl, {
              maxPosts: m.maxPosts,
              includeComments: m.includeComments,
              includeLikers: m.includeLikers,
              fromTs: m.fromTs,
              toTs: m.toTs,
              maxCommentsPerPost: m.maxCommentsPerPost,
              maxLikersPerPost: m.maxLikersPerPost
            })
          });
          break;
        }
        case "VKX_EXTRACT_PHOTOS": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractPhotos(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_VIDEOS": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractVideos(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_STORIES": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractStories(pageUrl) });
          break;
        }
        case "VKX_EXTRACT_GIFTS": {
          const pageUrl = String(m.pageUrl || "");
          sendResponse({ ok: true, stats: await extractGifts(pageUrl) });
          break;
        }
        case "VKX_ENRICH_PHOTOS_BATCH": {
          const pageUrl = String(m.pageUrl || "");
          const batchSize = Number(m.batchSize ?? 5);
          setBusy("photos", 3e4);
          const onlyKeys = Array.isArray(m.onlyKeys) ? m.onlyKeys.map((x) => String(x)) : void 0;
          const r = await enrichPhotosEngagementBatch(
            pageUrl,
            Number.isFinite(batchSize) ? batchSize : 5,
            onlyKeys,
            { itemCapEnabled: !!m.itemCapEnabled, itemCap: m.itemCap ?? null }
          );
          if (r?.progress?.done) clearBusy();
          sendResponse({ ok: true, stats: r.stats, progress: r.progress });
          break;
        }
        case "VKX_RESOLVE_USERS": {
          const pageUrl = String(m.pageUrl || "");
          const ids = Array.isArray(m.userIds) ? m.userIds : Array.isArray(m.user_ids) ? m.user_ids : [];
          const full = !!m.full;
          sendResponse({ ok: true, stats: await resolveUsers(pageUrl, ids.map((x) => Number(x)), { full }) });
          break;
        }
        case "VKX_RESOLVE_GROUPS": {
          const pageUrl = String(m.pageUrl || "");
          const ids = Array.isArray(m.groupIds) ? m.groupIds : Array.isArray(m.group_ids) ? m.group_ids : [];
          const full = !!m.full;
          sendResponse({ ok: true, stats: await resolveGroups(pageUrl, ids.map((x) => Number(x)), { full }) });
          break;
        }
        case "VKX_ENRICH_VIDEOS_BATCH": {
          const pageUrl = String(m.pageUrl || "");
          const batchSize = Number(m.batchSize ?? 5);
          setBusy("videos", 3e4);
          const onlyKeys = Array.isArray(m.onlyKeys) ? m.onlyKeys.map((x) => String(x)) : void 0;
          const r = await enrichVideosEngagementBatch(
            pageUrl,
            Number.isFinite(batchSize) ? batchSize : 5,
            onlyKeys,
            { itemCapEnabled: !!m.itemCapEnabled, itemCap: m.itemCap ?? null }
          );
          if (r?.progress?.done) clearBusy();
          sendResponse({ ok: true, stats: r.stats, progress: r.progress });
          break;
        }
        case "VKX_DELETE_ACTIVE_TARGET": {
          await deleteActiveTargetData();
          sendResponse({ ok: true });
          break;
        }
        case "VKX_DELETE_TARGET": {
          const key = String(m.key || "").trim();
          await deleteTargetData(key);
          sendResponse({ ok: true });
          break;
        }
        case "VKX_DELETE_ALL_DATA": {
          await deleteAllData();
          sendResponse({ ok: true });
          break;
        }
        case "VKX_STORAGE_LIST": {
          const limit = Number(m.limit ?? 50);
          const r = await listStoredTargets(Number.isFinite(limit) ? limit : 50);
          sendResponse({ ok: true, ...r });
          break;
        }
        case "VKX_DOWNLOAD_MEDIA_COPY": {
          const pageUrl = String(m.pageUrl || "");
          const kind = String(m.kind || "");
          const key = String(m.key || "");
          const remoteUrl = String(m.remoteUrl || "");
          const filenameHint = String(m.filenameHint || "");
          const albumKey = String(m.albumKey || "");
          const albumTitle = String(m.albumTitle || "");
          if (kind !== "photo") {
            sendResponse({ ok: false, error: "Actual offline copy is currently available for photos only. Videos/clips need a direct media file URL, which is not yet captured in this bundle." });
            break;
          }
          sendResponse(await requestOfflinePhotoCopy(pageUrl, key, remoteUrl, filenameHint, albumKey, albumTitle));
          break;
        }
        case "VKX_DOWNLOAD_MEDIA_COPY_BATCH": {
          const pageUrl = String(m.pageUrl || "");
          const kind = String(m.kind || "");
          const items = Array.isArray(m.items) ? m.items : [];
          if (kind !== "photo") {
            sendResponse({ ok: false, error: "Actual offline copy is currently available for photos only. Videos/clips need a direct media file URL, which is not yet captured in this bundle." });
            break;
          }
          sendResponse(await requestOfflinePhotoCopyBatch(pageUrl, items));
          break;
        }
        case "VKX_EXPORT_BUNDLE": {
          const b = await exportBundle();
          sendResponse(b);
          break;
        }
        case "VKX_RESET": {
          await resetBundle();
          sendResponse({ ok: true, stats: await getStats() });
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
//# sourceMappingURL=background.js.map
