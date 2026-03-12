(function(){
    var OFFLINE_DATA = (window.__VKX_OFFLINE_DATA && typeof window.__VKX_OFFLINE_DATA === 'object') ? window.__VKX_OFFLINE_DATA : {};
    var OFFLINE_LOCALE = OFFLINE_DATA && OFFLINE_DATA.locale === 'uk' ? 'uk' : 'en';
    var OFFLINE_I18N = (OFFLINE_DATA && OFFLINE_DATA.i18n && typeof OFFLINE_DATA.i18n === 'object') ? OFFLINE_DATA.i18n : {};

    function offT(key, vars){
      var value = (typeof OFFLINE_I18N[key] === 'string') ? OFFLINE_I18N[key] : String(key || '');
      if (vars && typeof vars === 'object') {
        Object.keys(vars).forEach(function(k){
          value = value.split('{' + k + '}').join(String(vars[k]));
        });
      }
      return value;
    }

    try { document.documentElement.lang = OFFLINE_LOCALE; } catch(e) {}
    try {
      if (OFFLINE_I18N.snapshotTitle) document.title = String(OFFLINE_I18N.snapshotTitle);
    } catch(e) {}

    var OFFLINE_BY_ID = {
      vkxGeoPoints: Array.isArray(OFFLINE_DATA.geoPoints) ? OFFLINE_DATA.geoPoints : [],
      vkxLcDataPhoto: (typeof OFFLINE_DATA.lcDataPhoto === 'undefined') ? null : OFFLINE_DATA.lcDataPhoto,
      vkxLcDataVideo: (typeof OFFLINE_DATA.lcDataVideo === 'undefined') ? null : OFFLINE_DATA.lcDataVideo,
      vkxLcDataObserved: (typeof OFFLINE_DATA.lcDataObserved === 'undefined') ? null : OFFLINE_DATA.lcDataObserved,
      vkxWallSnapData: (typeof OFFLINE_DATA.wallSnapData === 'undefined') ? null : OFFLINE_DATA.wallSnapData,
      vkxRelationsMapData: (typeof OFFLINE_DATA.relationsMapData === 'undefined') ? null : OFFLINE_DATA.relationsMapData,
      vkxPeopleMapData: (typeof OFFLINE_DATA.peopleMapData === 'undefined') ? null : OFFLINE_DATA.peopleMapData,
      vkxGroupOverviewMapData: (typeof OFFLINE_DATA.groupOverviewMapData === 'undefined') ? null : OFFLINE_DATA.groupOverviewMapData,
      vkxFamilyTreeData: (typeof OFFLINE_DATA.familyTreeData === 'undefined') ? null : OFFLINE_DATA.familyTreeData,
      vkxWallMapData: (typeof OFFLINE_DATA.wallMapData === 'undefined') ? null : OFFLINE_DATA.wallMapData
    };

    var geoEl = document.getElementById('vkxPhotoMap');
    var geoPts = Array.isArray(OFFLINE_BY_ID.vkxGeoPoints) ? OFFLINE_BY_ID.vkxGeoPoints : [];
    var OFFLINE_MAPS = window.__vkxOfflineMaps || (window.__vkxOfflineMaps = {});
    var SNAPSHOT_MAP_DEFAULT_CENTER = [37.6, 14.15];
    var SNAPSHOT_MAP_DEFAULT_ZOOM = 2;

    function applySnapshotOpeningView(map){
      if (!map || !map.setView) return;
      try { map.setView(SNAPSHOT_MAP_DEFAULT_CENTER, SNAPSHOT_MAP_DEFAULT_ZOOM, { animate: false }); } catch(e) {}
    }

    function bindLocalFirstMedia(root){
      try {
        var imgs = (root || document).querySelectorAll('img[data-local-src][data-remote-src]');
        imgs.forEach(function(node){
          var img = node;
          if (img.getAttribute('data-local-first-bound') === '1') return;
          img.setAttribute('data-local-first-bound', '1');
          img.addEventListener('error', function(){
            var cur = img.getAttribute('src') || '';
            var remote = img.getAttribute('data-remote-src') || '';
            if (remote && cur !== remote) img.setAttribute('src', remote);
          });
          var local = img.getAttribute('data-local-src') || '';
          var remote = img.getAttribute('data-remote-src') || '';
          if (local) img.setAttribute('src', local);
          else if (remote && !img.getAttribute('src')) img.setAttribute('src', remote);
        });
      } catch(e) {}
    }

    function openLightbox(src, cap, fallback){
      try {
        var lb = document.createElement('div');
        lb.className = 'vkxSnapLightbox';
        lb.innerHTML = '<div class="vkxSnapLightboxInner">' +
          '<img src="' + String(src || '').replace(/"/g,'&quot;') + '" />' +
          (cap ? '<div class="vkxSnapLightboxCap">' + String(cap).replace(/</g,'&lt;') + '</div>' : '') +
        '</div>';
        lb.addEventListener('click', function(){ lb.remove(); });
        document.body.appendChild(lb);
        try {
          var img = lb.querySelector('img');
          if (img && fallback) {
            img.addEventListener('error', function(){ if (img.src !== String(fallback)) img.src = String(fallback); }, { once: true });
          }
        } catch(e) {}
      } catch(e) {}
    }

    function initPhotoSnapshotMap(){
      if (!geoEl || !Array.isArray(geoPts) || !geoPts.length || !window.L) return;

      geoEl.innerHTML = '';

      var L = window.L;
      var map = L.map(geoEl, { zoomControl: true, attributionControl: true });
      var detail = document.getElementById('vkxPhotoMapDetail');
      var panel = document.getElementById('panel-photos');
      var pointByKey = {};
      geoPts.forEach(function(p){
        var k = String((p && p.key) || '');
        if (k) pointByKey[k] = p;
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);

      var SC = window.Supercluster;
      var layer = L.layerGroup().addTo(map);

      function renderPhotoDetail(p){
        if (!detail) return;
        if (!p) {
          detail.innerHTML = '<div class="muted">' + offT('zoomInToFilterPhotoCards') + '</div>';
          return;
        }
        detail.innerHTML =
          '<div class="eventTitle">' + offT('photoLocation') + '</div>' +
          '<div class="eventMeta">' + String(p.text || '').replace(/</g,'&lt;') + '</div>' +
          (Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon))
            ? ('<div class="eventMeta">' + Number(p.lat).toFixed(5) + ', ' + Number(p.lon).toFixed(5) + '</div>')
            : '');
      }

      function applyViewportFilter(){
        var root = document.getElementById('panel-photos') || panel || document;
        var entries = [];

        Array.from(root.querySelectorAll('.gridCard')).forEach(function(card){
          var btn = card.querySelector('button[data-media-toggle="1"][data-media-kind="photo"][data-media-key]');
          if (!btn) return;

          var key = String(btn.getAttribute('data-media-key') || '').trim();
          if (!key) return;

          entries.push({ card: card, key: key });
        });

        Array.from(root.querySelectorAll('.hotspotCard[data-scope="photo"][data-hotspot-key]')).forEach(function(card){
          var key = String(card.getAttribute('data-hotspot-key') || '').trim();
          if (!key) return;

          entries.push({ card: card, key: key });
        });

        if (!entries.length) {
          if (detail) detail.innerHTML = '<div class="muted">' + offT('noPhotoCardsAvailableToFilter') + '</div>';
          return;
        }

        var z = Number(map.getZoom());
        var b = map.getBounds();
        var filterOn = z > Number(SNAPSHOT_MAP_DEFAULT_ZOOM || 2);
        var visibleKeys = new Set();
        var located = 0;

        if (filterOn) {
          geoPts.forEach(function(p){
            if (!p) return;
            var lat = Number(p.lat);
            var lon = Number(p.lon);
            var key = String(p.key || '');
            if (!key || !Number.isFinite(lat) || !Number.isFinite(lon)) return;
            if (b.contains(L.latLng(lat, lon))) visibleKeys.add(key);
          });
        }

        entries.forEach(function(entry){
          if (pointByKey[entry.key]) located++;
        });

        var shown = 0;

        entries.forEach(function(entry){
          var ok = !filterOn || visibleKeys.has(entry.key);

          entry.card.classList.toggle('vkxHiddenByMap', !ok);
          entry.card.style.display = ok ? '' : 'none';
          entry.card.setAttribute('data-map-visible', ok ? '1' : '0');

          if (ok) shown++;
        });

        if (detail) {
          detail.innerHTML = !filterOn
            ? ('<div class="muted">' + offT('showingPhotoCardsViewport', { shown: shown, total: entries.length }) + '</div>')
            : ('<div class="muted">' + offT('filteredPhotoCardsViewport', { shown: shown, total: entries.length, located: located }) + '</div>');
        }
      }

      function openPhotoPoint(p){
        renderPhotoDetail(p);
        if (p && (p.thumb || p.thumbRemote)) openLightbox(p.thumb || p.thumbRemote, p.text || '', p.thumbRemote || '');
      }

      if (!SC) {
        geoPts.forEach(function(p){
          var icon = L.divIcon({ className: '', html: '<div class="vkxMarkerDot"></div>', iconSize: [12,12], iconAnchor:[6,6] });
          var m = L.marker([p.lat, p.lon], { icon: icon }).addTo(layer);
          m.on('click', function(){ openPhotoPoint(p); });
        });
        map.on('moveend zoomend', applyViewportFilter);
        applySnapshotOpeningView(map);
        applyViewportFilter();
        renderPhotoDetail(null);
        OFFLINE_MAPS.photo = { host: geoEl, map: map, render: applyViewportFilter };
        return;
      }

      var features = geoPts.map(function(p){
        return { type:'Feature', geometry:{ type:'Point', coordinates:[p.lon, p.lat] }, properties:p };
      });
      var idx = new SC({ radius: 60, maxZoom: 19 });
      idx.load(features);

      function renderPhotoClusters(){
        layer.clearLayers();
        var b = map.getBounds();
        var bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
        var z = map.getZoom();
        var clusters = idx.getClusters(bbox, z);

        clusters.forEach(function(c){
          var lon = c.geometry.coordinates[0];
          var lat = c.geometry.coordinates[1];
          var isCluster = c.properties && c.properties.cluster;
          if (isCluster) {
            var count = c.properties.point_count;
            var icon = L.divIcon({ className: '', html: '<div class="vkxCluster">' + count + '</div>', iconSize: [36,36], iconAnchor:[18,18] });
            var m = L.marker([lat, lon], { icon: icon }).addTo(layer);
            m.on('click', function(){ map.setView([lat, lon], Math.min(z + 2, 19)); });
          } else {
            var p = c.properties || {};
            var icon2 = L.divIcon({ className: '', html: '<div class="vkxMarkerDot"></div>', iconSize: [12,12], iconAnchor:[6,6] });
            var m2 = L.marker([lat, lon], { icon: icon2 }).addTo(layer);
            m2.on('click', function(){ openPhotoPoint(p); });
          }
        });

        applyViewportFilter();
      }

      map.on('moveend zoomend', renderPhotoClusters);
      applySnapshotOpeningView(map);
      renderPhotoClusters();
      renderPhotoDetail(null);
      window.setTimeout(function(){
        try { renderPhotoClusters(); } catch(e) {}
      }, 180);
      OFFLINE_MAPS.photo = { host: geoEl, map: map, render: renderPhotoClusters };
    }

    bindLocalFirstMedia(document);

    // -------------------------
    // Link chart snapshot runtime
    // -------------------------
    function safeParse(id) {
      if (Object.prototype.hasOwnProperty.call(OFFLINE_BY_ID, id)) {
        return OFFLINE_BY_ID[id];
      }
      var el = document.getElementById(id);
      if (!el) return null;
      try { return JSON.parse(el.textContent || 'null'); } catch(e) { return null; }
    }

    function ensureSnapEmbedModal(){
      var m = document.getElementById('vkxSnapEmbedModal');
      if (m) return m;
      try {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="vkxSnapLightbox" id="vkxSnapEmbedModal" aria-hidden="true">' +
          '<div class="vkxSnapLightboxInner"><iframe class="vkxSnapEmbedFrame" allowfullscreen></iframe></div>' +
        '</div>';
        document.body.appendChild(wrap.firstChild);
      } catch(e) {}
      return document.getElementById('vkxSnapEmbedModal');
    }

    function openEmbedModal(src){
      try {
        var m = ensureSnapEmbedModal();
        if (!m) return;
        var ifr = m.querySelector('iframe');
        if (!ifr) return;
        ifr.setAttribute('src', String(src || ''));
        m.classList.add('open');
        m.setAttribute('aria-hidden', 'false');
      } catch(e) {}
    }

    function ensureOfflineLcBox(){
      var modal = document.getElementById('vkxLcBox');
      var body = document.getElementById('vkxLcBoxBody');
      return { modal: modal, body: body };
    }

    function getOfflineTemplateHtml(key){
      var want = String(key || '');
      var nodes = document.querySelectorAll('template[data-offline-template]');
      for (var i = 0; i < nodes.length; i++) {
        var tpl = nodes[i];
        if (String(tpl.getAttribute('data-offline-template') || '') === want) {
          return tpl.innerHTML || '';
        }
      }
      return '';
    }

    function openOfflineLcBoxTemplate(key){
      var html = getOfflineTemplateHtml(key);
      if (!html) return;
      var bx = ensureOfflineLcBox();
      if (!bx.modal || !bx.body) return;
      bx.body.innerHTML = html;
      bindLocalFirstMedia(bx.body);
      bx.modal.classList.add('open');
      bx.modal.setAttribute('aria-hidden', 'false');
    }

    function closeOfflineLcBox(){
      var bx = ensureOfflineLcBox();
      if (!bx.modal || !bx.body) return;
      bx.modal.classList.remove('open');
      bx.modal.setAttribute('aria-hidden', 'true');
      bx.body.innerHTML = '';
    }

    function openOfflineLcBoxHtml(html){
      var clean = String(html || '').trim();
      if (!clean) return;
      var bx = ensureOfflineLcBox();
      if (!bx.modal || !bx.body) return;
      bx.body.innerHTML = clean;
      bindLocalFirstMedia(bx.body);
      bx.modal.classList.add('open');
      bx.modal.setAttribute('aria-hidden', 'false');
    }

    function openOfflineObservedPostBox(postId){
      var data = wallSnapParse();
      if (!data) return;
      var pid = String(Number(postId || 0) || 0);
      if (!pid || pid === '0') return;

      var html =
        ((data.cardsCommentsById || {})[pid]) ||
        ((data.cardsClosedById || {})[pid]) ||
        ((data.cardsLikesById || {})[pid]) ||
        '';

      if (!String(html || '').trim()) return;
      openOfflineLcBoxHtml(html);
    }

    function offlineLcNodeTemplateKey(scope, nodeId){
      var sid = String(nodeId || '').trim();
      if (!sid) return '';

      if (sid.indexOf('m:') === 0) {
        return 'hotspot:' + (scope === 'video' ? 'video' : 'photo') + ':' + sid.slice(2);
      }

      if (sid.indexOf('u:') === 0) {
        var uid = Number(sid.slice(2));
        if (!Number.isFinite(uid) || uid === 0) return '';
        return uid < 0 ? ('group:' + String(Math.abs(uid))) : ('user:' + String(Math.abs(uid)));
      }

      if (sid.indexOf('g:') === 0) {
        var gid = Number(sid.slice(2));
        if (!Number.isFinite(gid) || gid <= 0) return '';
        return 'group:' + String(Math.abs(gid));
      }

      return '';
    }

    function offlineLcNodeHasDetail(scope, nodeId){
      var sid = String(nodeId || '').trim();
      if (!sid) return false;

      if (sid.indexOf('p:') === 0) {
        var parts = sid.slice(2).split('_');
        var postId = Number(parts[1] || 0);
        var snap = wallSnapParse();
        if (!snap || !Number.isFinite(postId) || postId <= 0) return false;
        var pid = String(postId);
        return !!(
          ((snap.cardsCommentsById || {})[pid]) ||
          ((snap.cardsClosedById || {})[pid]) ||
          ((snap.cardsLikesById || {})[pid])
        );
      }

      var key = offlineLcNodeTemplateKey(scope, sid);
      return !!String(getOfflineTemplateHtml(key) || '').trim();
    }

    function openOfflineLcNodeDetails(scope, nodeId){
      var sid = String(nodeId || '').trim();
      if (!sid) return;

      if (sid.indexOf('p:') === 0) {
        var parts = sid.slice(2).split('_');
        var postId = Number(parts[1] || 0);
        if (Number.isFinite(postId) && postId > 0) openOfflineObservedPostBox(postId);
        return;
      }

      var key = offlineLcNodeTemplateKey(scope, sid);
      if (!key) return;
      openOfflineLcBoxTemplate(key);
    }

    function openOfflineLcNodeExternal(scope, nodeId){
      var sid = String(nodeId || '').trim();
      if (!sid) return;

      if (sid.indexOf('m:') === 0) {
        var mk = sid.slice(2);
        var url = (scope === 'video')
          ? ('https://vk.com/video' + mk)
          : ('https://vk.com/photo' + mk);
        try { window.open(url, '_blank', 'noreferrer'); } catch(e) {}
        return;
      }

      if (sid.indexOf('u:') === 0) {
        var uid = Number(sid.slice(2));
        if (!Number.isFinite(uid) || uid === 0) return;
        try {
          window.open(
            uid < 0 ? ('https://vk.com/club' + String(Math.abs(uid))) : ('https://vk.com/id' + String(Math.abs(uid))),
            '_blank',
            'noreferrer'
          );
        } catch(e) {}
        return;
      }

      if (sid.indexOf('g:') === 0) {
        var gid = Number(sid.slice(2));
        if (!Number.isFinite(gid) || gid <= 0) return;
        try { window.open('https://vk.com/club' + String(Math.abs(gid)), '_blank', 'noreferrer'); } catch(e) {}
        return;
      }

      if (sid.indexOf('p:') === 0) {
        var parts2 = sid.slice(2).split('_');
        var ownerId = Number(parts2[0] || 0);
        var postId2 = Number(parts2[1] || 0);
        if (!Number.isFinite(ownerId) || !Number.isFinite(postId2) || postId2 <= 0) return;
        try { window.open('https://vk.com/wall' + String(ownerId) + '_' + String(postId2), '_blank', 'noreferrer'); } catch(e) {}
      }
    }

    function syncOfflineLcCtx(scope, nodeId){
      var ctx = document.getElementById('vkxLcCtx');
      if (!ctx) return;

      var openBtn = ctx.querySelector('[data-lcctx-open="1"]');
      var openVkBtn = ctx.querySelector('[data-lcctx-openvk="1"]');
      var enrichBtn = ctx.querySelector('[data-lcctx-enrich="1"]');
      var releaseBtn = ctx.querySelector('[data-lcctx-release="1"]');
      var releaseAllBtn = ctx.querySelector('[data-lcctx-release-all="1"]');

      if (openBtn) openBtn.style.display = offlineLcNodeHasDetail(scope, nodeId) ? '' : 'none';
      if (openVkBtn) openVkBtn.style.display = '' ;
      if (enrichBtn) enrichBtn.style.display = 'none';
      if (releaseBtn) releaseBtn.style.display = '';
      if (releaseAllBtn) releaseAllBtn.style.display = '';
    }

    function bindOfflineLcContextMenu(){
      if (window.__vkxOfflineLcCtxBound) return;
      window.__vkxOfflineLcCtxBound = true;

      document.addEventListener('click', function(ev){
        var t = ev.target;
        if (!t || !t.closest) return;

        var ctx = document.getElementById('vkxLcCtx');
        if (!ctx) return;

        var item = t.closest('.vkxCtxItem');
        if (item && t.closest('#vkxLcCtx')) {
          ev.preventDefault();
          ev.stopPropagation();
          if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

          var nodeId = String(ctx.getAttribute('data-lcctx-node') || '');
          var scope = String(ctx.getAttribute('data-lcctx-scope') || 'photo');
          ctx.style.display = 'none';
          if (!nodeId) return;

          if (item.hasAttribute('data-lcctx-open')) {
            openOfflineLcNodeDetails(scope, nodeId);
            return;
          }

          if (item.hasAttribute('data-lcctx-openvk')) {
            openOfflineLcNodeExternal(scope, nodeId);
            return;
          }

          if (item.hasAttribute('data-lcctx-release')) {
            var st = snapLc(scope);
            var nodes = st && st.nodesDs;
            var net = st && st.network;
            if (nodes && typeof nodes.update === 'function') {
              try { nodes.update({ id: nodeId, fixed: { x: false, y: false } }); } catch(e) {}
              try { if (net && net.stabilize) net.stabilize(30); } catch(e) {}
            }
            return;
          }

          if (item.hasAttribute('data-lcctx-release-all')) {
            var st2 = snapLc(scope);
            var nodes2 = st2 && st2.nodesDs;
            var net2 = st2 && st2.network;
            if (nodes2 && typeof nodes2.getIds === 'function' && typeof nodes2.update === 'function') {
              var upd = (nodes2.getIds() || []).map(function(id){ return { id: id, fixed: { x: false, y: false } }; });
              try { nodes2.update(upd); } catch(e) {}
              try { if (net2 && net2.stabilize) net2.stabilize(60); } catch(e) {}
            }
            return;
          }
        }

        if (ctx.style.display === 'block' && !t.closest('#vkxLcCtx')) {
          ctx.style.display = 'none';
        }
      });
    }

    function offlineCssEsc(v){
      var CSS_ = window.CSS;
      if (CSS_ && typeof CSS_.escape === 'function') return CSS_.escape(String(v == null ? '' : v));
      return String(v == null ? '' : v).replace(/["\\]/g, '\\$&');
    }

    function focusOfflineNode(node){
      if (!node) return;
      try { node.classList.add('vkxFlash'); } catch(e) {}
      try { if (node.scrollIntoView) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch(e) {}
      try {
        window.setTimeout(function(){
          try { node.classList.remove('vkxFlash'); } catch(e) {}
        }, 1600);
      } catch(e) {}
    }

    function activateOfflineTab(tabId){
      var id = String(tabId || '').trim();
      if (!id) return;
      try {
        var radio = document.getElementById('tab-' + id);
        if (radio && String(radio.type || '').toLowerCase() === 'radio') {
          radio.checked = true;
          if (radio.dispatchEvent) radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch(e) {}
      try {
        var panel = document.getElementById('panel-' + id);
        if (panel && panel.scrollIntoView) panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
      } catch(e) {}
      try { window.setTimeout(refreshOfflineView, 90); } catch(e) {}
    }

    function activateOfflineWallView(view){
      var mode = String(view || 'posts') === 'actors' ? 'actors' : (String(view || 'posts') === 'engagement' ? 'engagement' : 'posts');
      var postsEl = document.getElementById('vkxWallPostsView');
      var engagementEl = document.getElementById('vkxWallEngagementView');
      var actorsEl = document.getElementById('vkxWallActorsView');

      if (postsEl) postsEl.style.display = mode === 'posts' ? '' : 'none';
      if (engagementEl) engagementEl.style.display = mode === 'engagement' ? '' : 'none';
      if (actorsEl) actorsEl.style.display = mode === 'actors' ? '' : 'none';
    }

    function openOfflineWallPost(postId, opts){
      var pid = Number(postId || 0);
      if (!Number.isFinite(pid) || pid <= 0) return;

      var data = wallSnapParse();
      if (!data || !Array.isArray(data.posts)) return;

      var st = wallSnapState(data);
      var posts = data.posts.slice();
      var idx = posts.findIndex(function(p){ return Number(p && p.id || 0) === pid; });
      if (idx < 0) return;

      activateOfflineTab('wall');
      activateOfflineWallView('posts');

      st.view = 'posts';
      st.query = '';
      st.selectedTimeKeys = [];
      st.timeViewKeys = [];
      st.locationKey = '';
      st.locationKeys = [];
      st.locationLabel = '';
      st.visible = Math.max(24, Number(st.visible || 24), idx + 1);
      st.selectedPostId = pid;
      st.openPostId = pid;
      st.interactionTab = (opts && String(opts.interactionTab || '') === 'likes') ? 'likes' : 'comments';

      window.__vkxWallFocusCommentId = (opts && Number(opts.commentId || 0) > 0) ? Number(opts.commentId) : 0;

      try {
        if (typeof window.__vkxSnapWallRender === 'function') window.__vkxSnapWallRender();
      } catch(e) {}

      window.setTimeout(function(){
        try {
          var row = document.querySelector('.vkxWallRow[data-post-id="' + offlineCssEsc(String(pid)) + '"]');
          if (row) focusOfflineNode(row);
        } catch(e) {}
      }, 120);
    }

    function openOfflineObservedActor(actorId){
      var rawId = Number(actorId || 0);
      if (!Number.isFinite(rawId) || rawId === 0) return;

      activateOfflineTab('observed');

      var sel = '.gridCard[data-observed-actor="1"][data-actor-id="' + offlineCssEsc(String(rawId)) + '"]';
      var card = document.querySelector(sel);
      if (card) {
        var detailId = String(card.getAttribute('data-card-key') || '').trim() ||
          (rawId < 0 ? ('group:' + String(Math.abs(rawId))) : ('user:' + String(Math.abs(rawId))));
        var btn = card.querySelector('button[data-card-expand]');
        try { ensureOfflineWideCardDrop(card, detailId, btn || null); } catch(e) {}
        focusOfflineNode(card);
        return;
      }

      openOfflineLcBoxTemplate(rawId < 0 ? ('group:' + String(Math.abs(rawId))) : ('user:' + String(Math.abs(rawId))));
    }

    function openOfflineHotspotEvidence(scope, mediaKey){
      var kind = String(scope || 'photo') === 'video' ? 'video' : 'photo';
      var key = String(mediaKey || '').trim();
      if (!key) return;

      activateOfflineTab(kind === 'video' ? 'videos' : 'photos');

      var sel = '.hotspotCard[data-scope="' + kind + '"][data-hotspot-key="' + offlineCssEsc(key) + '"]';
      var card = document.querySelector(sel);
      if (card) {
        var btn = card.querySelector('[data-hotspot-open], button[data-hotspot-info]');
        try { ensureOfflineHotspotWideDrop(card, kind, key, btn || null); } catch(e) {}
        focusOfflineNode(card);
        return;
      }

      openOfflineLcBoxTemplate('hotspot:' + kind + ':' + key);
    }

    function openOfflineObservedEvidence(source, postId, commentId, mediaKey){
      var kind = String(source || 'wall').trim();
      if (kind === 'wall') {
        openOfflineWallPost(postId, { interactionTab: 'comments', commentId: commentId });
        return;
      }

      if ((kind === 'photo' || kind === 'video') && mediaKey) {
        openOfflineHotspotEvidence(kind, mediaKey);
      }
    }

    function openOfflineWallActor(actorId){
      var rawId = Number(actorId || 0);
      if (!Number.isFinite(rawId) || rawId === 0) return;

      activateOfflineTab('wall');
      activateOfflineWallView('actors');

      var row = document.querySelector('#vkxWallActorList .listRow[data-actor-id="' + offlineCssEsc(String(rawId)) + '"]');
      if (row) focusOfflineNode(row);

      openOfflineLcBoxTemplate(rawId < 0 ? ('group:' + String(Math.abs(rawId))) : ('user:' + String(Math.abs(rawId))));
    }

    function escSnap(s){
      return String(s == null ? '' : s).replace(/[&<>"]/g, function(ch){
        if (ch === '&') return '&amp;';
        if (ch === '<') return '&lt;';
        if (ch === '>') return '&gt;';
        return '&quot;';
      });
    }

    function ensureOfflineZoomState(wrap){
      var cur = Number(wrap.getAttribute('data-zoom-scale') || '1');
      if (!Number.isFinite(cur) || cur <= 0) wrap.setAttribute('data-zoom-scale', '1');

      var panX = Number(wrap.getAttribute('data-pan-x') || '0');
      var panY = Number(wrap.getAttribute('data-pan-y') || '0');
      if (!Number.isFinite(panX)) wrap.setAttribute('data-pan-x', '0');
      if (!Number.isFinite(panY)) wrap.setAttribute('data-pan-y', '0');
    }

    function applyOfflineZoomTransform(wrap){
      ensureOfflineZoomState(wrap);

      var s = Math.max(1, Math.min(6, Number(wrap.getAttribute('data-zoom-scale') || '1')));
      var panX = Number(wrap.getAttribute('data-pan-x') || '0') || 0;
      var panY = Number(wrap.getAttribute('data-pan-y') || '0') || 0;

      var img = wrap.querySelector('.mediaZoomImg');
      if (img) img.style.transform = 'translate(' + String(panX) + 'px, ' + String(panY) + 'px) scale(' + String(s) + ')';

      wrap.classList.toggle('is-pan-ready', s > 1.001);
      if (s <= 1.001) wrap.classList.remove('is-dragging');

      var host = wrap.closest('.mediaDrop') || wrap.closest('.vkxWideMedia') || wrap.parentElement;
      var lab = host ? host.querySelector('[data-media-zoom-val="1"]') : null;
      if (lab) lab.textContent = String(Math.round(s * 100)) + '%';
    }

    function setOfflineZoom(wrap, scale){
      var s = Math.max(1, Math.min(6, Number(scale || 1)));
      wrap.setAttribute('data-zoom-scale', String(s));
      if (s <= 1.001) {
        wrap.setAttribute('data-pan-x', '0');
        wrap.setAttribute('data-pan-y', '0');
      }
      applyOfflineZoomTransform(wrap);
    }

    function resetOfflineWideButtons(){
      document.querySelectorAll('button[data-card-expand].is-open, button.vkxDropBtn[data-media-toggle="1"].is-open, .hotspotInfoBtn.is-open').forEach(function(node){
        node.classList.remove('is-open');
        if (node.classList.contains('vkxDropBtn')) node.textContent = '▾';
      });
    }

    function closeOfflineWideRows(){
      document.querySelectorAll('.vkxWideDropRow, .vkxWideMedia').forEach(function(node){ node.remove(); });
      resetOfflineWideButtons();
    }

    function closeNearestOfflineDrop(from){
      var lc = from.closest ? from.closest('#vkxLcBox') : null;
      if (lc) { closeOfflineLcBox(); return; }

      var wideMedia = from.closest ? from.closest('.vkxWideMedia') : null;
      if (wideMedia) { wideMedia.remove(); resetOfflineWideButtons(); return; }

      var wideRow = from.closest ? from.closest('.vkxWideDropRow') : null;
      if (wideRow) { wideRow.remove(); resetOfflineWideButtons(); return; }

      var drop = from.closest ? from.closest('.mediaDrop') : null;
      if (drop) { drop.classList.remove('open'); return; }
    }

    function insertOfflineWideBlock(grid, card, row){
      row.style.gridColumn = '1 / -1';
      var kids = Array.from(grid.children).filter(function(n){
        return n && n.classList && (n.classList.contains('gridCard') || n.classList.contains('hotspotCard'));
      });
      var insertAfter = card;
      try {
        var y = card.getBoundingClientRect().top;
        var sameRow = kids.filter(function(c){ return Math.abs(c.getBoundingClientRect().top - y) < 6; });
        if (sameRow.length) insertAfter = sameRow[sameRow.length - 1];
      } catch(e) {}
      grid.insertBefore(row, insertAfter.nextSibling);
      try {
        var gridRect = grid.getBoundingClientRect();
        var cardRect = card.getBoundingClientRect();
        var cx = (cardRect.left + cardRect.width / 2) - gridRect.left;
        row.style.setProperty('--vkx-drop-pointer-left', String(cx) + 'px');
      } catch(e) {}
    }

    function findCardDetailSource(card, id){
      var drops = Array.from(card.querySelectorAll('.mediaDrop[data-card-detail]'));
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        if (String(d.getAttribute('data-card-detail') || '') === String(id || '')) return d;
      }
      return null;
    }

    function applyOfflineWideCardThumbFallback(card, row){
      if (!card || !row || !row.querySelector) return;

      var ov = row.querySelector('.ovCard');
      if (!ov) return;

      var placeholder = ov.querySelector('div[style*="width:52px"][style*="height:52px"]');
      if (!placeholder || !placeholder.parentNode) return;

      var thumb = card.querySelector('.gridThumb img') || card.querySelector('.thumbBtn img');
      if (!thumb) return;

      var local = String(thumb.getAttribute('data-local-src') || thumb.getAttribute('src') || '').trim();
      var remote = String(thumb.getAttribute('data-remote-src') || thumb.getAttribute('src') || '').trim();
      if (!local && !remote) return;

      var img = document.createElement('img');
      img.setAttribute('alt', '');
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.style.width = '52px';
      img.style.height = '52px';
      img.style.borderRadius = '12px';
      img.style.objectFit = 'cover';
      img.style.border = '1px solid rgba(255,255,255,0.12)';
      if (local) img.setAttribute('data-local-src', local);
      if (remote) img.setAttribute('data-remote-src', remote);
      img.setAttribute('src', local || remote);

      placeholder.parentNode.replaceChild(img, placeholder);
    }

    function ensureOfflineWideCardDrop(card, id, btn){
      var grid = card.closest ? card.closest('.grid') : null;
      if (!grid) return;

      var existing = null;
      Array.from(grid.querySelectorAll('.vkxWideDropRow[data-wide-drop-id]')).forEach(function(node){
        if (!existing && String(node.getAttribute('data-wide-drop-id') || '') === String(id || '')) existing = node;
      });
      if (existing) {
        existing.remove();
        resetOfflineWideButtons();
        return;
      }

      var src = findCardDetailSource(card, id);
      if (!src) return;

      closeOfflineWideRows();

      var row = document.createElement('div');
      row.className = 'vkxWideDrop vkxWideDropRow';
      row.setAttribute('data-wide-drop-id', String(id || ''));
      row.innerHTML = '<div class="vkxWideDropPointer" aria-hidden="true"><span></span></div><div class="vkxWideDropInner"></div>';
      var inner = row.querySelector('.vkxWideDropInner');
      if (inner) inner.innerHTML = src.innerHTML || '';

      applyOfflineWideCardThumbFallback(card, row);
      insertOfflineWideBlock(grid, card, row);
      if (btn) {
        btn.classList.add('is-open');
        if (btn.classList.contains('vkxDropBtn')) btn.textContent = '▴';
      }
      bindLocalFirstMedia(row);
      if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function ensureOfflineHotspotWideDrop(card, scope, key, btn){
      var grid = card.closest ? card.closest('.hotspotGrid') : null;
      if (!grid) return;

      var existing = null;
      Array.from(grid.querySelectorAll('.vkxHotspotDropRow[data-hotspot-detail][data-hotspot-key]')).forEach(function(node){
        if (!existing && String(node.getAttribute('data-hotspot-detail') || '') === String(scope || '') && String(node.getAttribute('data-hotspot-key') || '') === String(key || '')) existing = node;
      });
      if (existing) {
        existing.remove();
        resetOfflineWideButtons();
        return;
      }

      var html = getOfflineTemplateHtml('hotspot:' + String(scope || 'photo') + ':' + String(key || ''));
      if (!html) return;

      closeOfflineWideRows();

      var row = document.createElement('div');
      row.className = 'vkxWideDrop vkxWideDropRow vkxHotspotDropRow hotspotDetailWide open';
      row.setAttribute('data-hotspot-detail', String(scope || 'photo'));
      row.setAttribute('data-hotspot-key', String(key || ''));
      row.innerHTML = '<div class="vkxWideDropPointer" aria-hidden="true"><span></span></div><div class="vkxWideDropInner"></div>';
      var inner = row.querySelector('.vkxWideDropInner');
      if (inner) inner.innerHTML = html;

      insertOfflineWideBlock(grid, card, row);
      if (btn) btn.classList.add('is-open');
      bindLocalFirstMedia(row);
      if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function buildOfflineWideMediaHtml(btn){
      var kind = String(btn.getAttribute('data-media-kind') || '');
      var title = String(btn.getAttribute('data-media-title') || (kind === 'photo' ? offT('photoLabel') : offT('mediaGenericLabel'))).trim();
      var key = String(btn.getAttribute('data-media-key') || '').trim();
      var src = String(btn.getAttribute('data-media-hq') || btn.getAttribute('data-media-src') || btn.getAttribute('data-media-remote-hq') || btn.getAttribute('data-media-remote-src') || '').trim();
      var fallback = String(btn.getAttribute('data-media-remote-hq') || btn.getAttribute('data-media-remote-src') || src).trim();
      var iframe = String(btn.getAttribute('data-media-iframe') || '').trim();
      var external = kind === 'photo'
        ? (fallback || src || '')
        : (key ? ('https://vk.com/video' + key) : '');

      var leftTop = '<div class="mediaViewerTop" style="margin-bottom:10px;">' +
        '<div style="min-width:0;">' +
          '<div style="font-weight:900; font-size:13px;">' + escSnap(title) + '</div>' +
          '<div class="muted">' + escSnap((kind === 'photo' ? offT('photoShort') : offT('videoShort')) + key) + '</div>' +
        '</div>' +
        '<span style="flex:1"></span>' +
        (external ? '<a class="gridLinkBtn" href="' + escSnap(external) + '" target="_blank" rel="noreferrer">' + offT('openExternal') + '</a>' : '') +
        '<button class="gridLinkBtn" type="button" data-media-close="1">' + offT('close') + '</button>' +
      '</div>';

      if (kind === 'photo') {
        var rightPhoto = src
          ? '<div class="vkxMediaControls"><div class="hint">' + offT('zoom') + '</div><div style="display:flex; gap:8px; align-items:center;"><button class="vkxIconBtn" type="button" data-media-zoom-out="1">−</button><div class="vkxZoomVal" data-media-zoom-val="1">100%</div><button class="vkxIconBtn" type="button" data-media-zoom-in="1">+</button><button class="gridLinkBtn" type="button" data-media-zoom-reset="1">' + offT('reset') + '</button></div></div>' +
            '<div class="mediaZoomWrap" data-media-zoom="1"><img class="mediaZoomImg" src="' + escSnap(src) + '" alt="" referrerpolicy="no-referrer" loading="lazy" data-lightbox-src="' + escSnap(src) + '" data-lightbox-remote-src="' + escSnap(fallback) + '" /></div>'
          : '<div class="empty">' + offT('noImageUrlAvailable') + '</div>';
        return '<div class="vkxWideMediaGrid"><div class="vkxMediaSide">' + leftTop + '</div><div class="vkxMediaMain">' + rightPhoto + '</div></div>';
      }

      var ar = kind === 'clip' ? '9 / 16' : '16 / 9';
      var rightVideo = iframe
        ? '<div class="vkxMediaControls"><div class="hint">' + offT('player') + '</div><div style="display:flex; gap:8px; align-items:center;">' + (external ? '<a class="gridLinkBtn" href="' + escSnap(external) + '" target="_blank" rel="noreferrer">' + offT('openExternal') + '</a>' : '') + '</div></div>' +
          '<div class="mediaIframeWrap" style="aspect-ratio:' + ar + ';"><iframe src="' + escSnap(iframe) + '" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;border:0;border-radius:12px;"></iframe></div>'
        : (src
            ? '<div class="vkxMediaControls"><div class="hint">' + offT('poster') + '</div><div style="display:flex; gap:8px; align-items:center;">' + (external ? '<a class="gridLinkBtn" href="' + escSnap(external) + '" target="_blank" rel="noreferrer">' + offT('openExternal') + '</a>' : '') + '</div></div>' +
              '<div class="mediaZoomWrap" data-media-zoom="1"><img class="mediaZoomImg" src="' + escSnap(src) + '" alt="" referrerpolicy="no-referrer" loading="lazy" data-lightbox-src="' + escSnap(src) + '" data-lightbox-remote-src="' + escSnap(fallback) + '" /></div>'
            : '<div class="empty">' + offT('noEmbeddablePlayerOrPosterReturned') + '</div>');

      return '<div class="vkxWideMediaGrid"><div class="vkxMediaSide">' + leftTop + '</div><div class="vkxMediaMain">' + rightVideo + '</div></div>';
    }

    function ensureOfflineWideMediaDrop(btn, key){
      var card = btn.closest ? btn.closest('.gridCard') : null;
      if (!card) return;

      var grid = card.closest ? card.closest('.grid') : null;
      if (!grid) grid = card.parentElement;
      if (!grid) return;

      var dropKey = String(key || btn.getAttribute('data-media-drop') || btn.getAttribute('data-media-key') || '').trim();
      if (!dropKey) return;

      var existing = null;
      Array.from(grid.querySelectorAll('.vkxWideMedia[data-media-drop]')).forEach(function(node){
        if (!existing && String(node.getAttribute('data-media-drop') || '') === dropKey) existing = node;
      });
      if (existing) {
        existing.remove();
        resetOfflineWideButtons();
        return;
      }

      var html = buildOfflineWideMediaHtml(btn);
      if (!String(html || '').trim()) {
        var iframeFallback = String(btn.getAttribute('data-media-iframe') || '').trim();
        var srcFallback = String(btn.getAttribute('data-media-hq') || btn.getAttribute('data-media-src') || btn.getAttribute('data-media-remote-hq') || btn.getAttribute('data-media-remote-src') || '').trim();
        var titleFallback = String(btn.getAttribute('data-media-title') || '').trim();
        if (iframeFallback) {
          openEmbedModal(iframeFallback);
          return;
        }
        if (srcFallback) {
          openLightbox(srcFallback, titleFallback || '', String(btn.getAttribute('data-media-remote-src') || btn.getAttribute('data-media-remote-hq') || srcFallback));
        }
        return;
      }

      closeOfflineWideRows();

      var host = document.createElement('div');
      host.className = 'vkxWideMedia mediaDrop open';
      host.setAttribute('data-media-drop', dropKey);
      host.innerHTML = html;

      insertOfflineWideBlock(grid, card, host);

      Array.from(grid.querySelectorAll('button[data-media-toggle="1"][data-media-drop]')).forEach(function(node){
        if (String(node.getAttribute('data-media-drop') || '') !== dropKey) return;
        node.classList.add('is-open');
        if (node.classList.contains('vkxDropBtn')) node.textContent = '▴';
      });

      var wrap = host.querySelector('.mediaZoomWrap');
      if (wrap) {
        ensureOfflineZoomState(wrap);
        setOfflineZoom(wrap, 1);
      }

      bindLocalFirstMedia(host);
      if (host.scrollIntoView) host.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function bindOfflineCardsAndMedia(){
      document.addEventListener('click', function(ev){
        var t = ev.target;
        if (!t || !t.closest) return;

        if ((t.tagName && String(t.tagName).toLowerCase() === 'canvas') || t.closest('.vis-network')) {
          return;
        }

        var embedModal = document.getElementById('vkxSnapEmbedModal');
        if (embedModal && (t === embedModal || t.closest('#vkxSnapEmbedModal'))) {
          if (t === embedModal) {
            var ifr = embedModal.querySelector('iframe');
            if (ifr) ifr.setAttribute('src', '');
            embedModal.classList.remove('open');
            embedModal.setAttribute('aria-hidden', 'true');
            return;
          }
        }

        var lcBox = document.getElementById('vkxLcBox');
        if (lcBox && (t === lcBox || t.closest('[data-lcbox-close="1"]'))) {
          ev.preventDefault();
          ev.stopPropagation();
          closeOfflineLcBox();
          return;
        }

        var mediaClose = t.closest('[data-media-close="1"]');
        if (mediaClose) {
          ev.preventDefault();
          ev.stopPropagation();
          closeNearestOfflineDrop(mediaClose);
          return;
        }

        var openUserHit = t.closest('[data-open-userbox="1"]');
        if (openUserHit) {
          ev.preventDefault();
          ev.stopPropagation();
          var rawId = Number(openUserHit.getAttribute('data-open-user-id'));
          if (!Number.isFinite(rawId) || rawId === 0) return;
          openOfflineLcBoxTemplate(rawId < 0 ? ('group:' + String(Math.abs(rawId))) : ('user:' + String(Math.abs(rawId))));
          return;
        }

        var leaderRow = t.closest('.leaderRow[data-leader-row="1"]');
        if (leaderRow) {
          ev.preventDefault();
          ev.stopPropagation();
          var scopeL = String(leaderRow.getAttribute('data-scope') || 'photo');
          var userIdL = String(leaderRow.getAttribute('data-user-id') || '');
          var holder = leaderRow.parentElement;
          var detailL = holder ? holder.querySelector('.leaderDetail[data-leader-detail="1"][data-scope="' + scopeL + '"][data-user-id="' + userIdL + '"]') : null;
          if (!detailL) return;
          var openL = !detailL.classList.contains('open');
          if (holder) {
            holder.querySelectorAll('.leaderDetail.open').forEach(function(node){ node.classList.remove('open'); });
          }
          if (openL) {
            detailL.classList.add('open');
            bindLocalFirstMedia(detailL);
            if (detailL.scrollIntoView) detailL.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
          return;
        }

        var infoBtn = t.closest('button[data-hotspot-info]');
        if (infoBtn) {
          ev.preventDefault();
          ev.stopPropagation();
          var hsScope = String(infoBtn.getAttribute('data-hotspot-info') || 'photo');
          var hsKey = String(infoBtn.getAttribute('data-hotspot-key') || '');
          var hsCard = infoBtn.closest('.hotspotCard');
          if (hsCard && hsKey) ensureOfflineHotspotWideDrop(hsCard, hsScope === 'video' ? 'video' : 'photo', hsKey, infoBtn);
          return;
        }

        var hsOpen = t.closest('[data-hotspot-open]');
        if (hsOpen) {
          ev.preventDefault();
          ev.stopPropagation();
          var hsScope2 = String(hsOpen.getAttribute('data-hotspot-open') || 'photo');
          var hsKey2 = String(hsOpen.getAttribute('data-hotspot-key') || '');
          var hsCard2 = hsOpen.closest('.hotspotCard');
          if (hsCard2 && hsKey2) ensureOfflineHotspotWideDrop(hsCard2, hsScope2 === 'video' ? 'video' : 'photo', hsKey2, null);
          return;
        }

        var exp = t.closest('button[data-card-expand]');
        if (exp) {
          ev.preventDefault();
          ev.stopPropagation();

          var id = String(exp.getAttribute('data-card-expand') || '').trim();
          var card = exp.closest('.gridCard');
          if (!id || !card) return;

          ensureOfflineWideCardDrop(card, id, exp);
          return;
        }

        var detailBtn = t.closest('button[data-card-detail-toggle="1"]');
        if (detailBtn) {
          ev.preventDefault();
          ev.stopPropagation();
          var id2 = String(detailBtn.getAttribute('data-card-id') || '').trim();
          if (!id2) return;
          var allDrops = Array.from(document.querySelectorAll('.mediaDrop[data-card-detail]'));
          var drop2 = allDrops.find(function(node){ return String(node.getAttribute('data-card-detail') || '') === id2; }) || null;
          if (!drop2) return;
          drop2.classList.toggle('open');
          if (drop2.classList.contains('open') && drop2.scrollIntoView) drop2.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          return;
        }

        var zoomReset = t.closest('[data-media-zoom-reset="1"]');
        if (zoomReset) {
          ev.preventDefault();
          ev.stopPropagation();
          var wrap0 = zoomReset.closest('.vkxWideMedia, .mediaDrop');
          var z0 = wrap0 ? wrap0.querySelector('.mediaZoomWrap[data-media-zoom="1"]') : null;
          if (z0) setOfflineZoom(z0, 1);
          return;
        }

        var zoomIn = t.closest('[data-media-zoom-in="1"]');
        if (zoomIn) {
          ev.preventDefault();
          ev.stopPropagation();
          var wrap1 = zoomIn.closest('.vkxWideMedia, .mediaDrop');
          var z1 = wrap1 ? wrap1.querySelector('.mediaZoomWrap[data-media-zoom="1"]') : null;
          if (z1) {
            ensureOfflineZoomState(z1);
            setOfflineZoom(z1, Number(z1.getAttribute('data-zoom-scale') || '1') + 0.2);
          }
          return;
        }

        var zoomOut = t.closest('[data-media-zoom-out="1"]');
        if (zoomOut) {
          ev.preventDefault();
          ev.stopPropagation();
          var wrap2 = zoomOut.closest('.vkxWideMedia, .mediaDrop');
          var z2 = wrap2 ? wrap2.querySelector('.mediaZoomWrap[data-media-zoom="1"]') : null;
          if (z2) {
            ensureOfflineZoomState(z2);
            setOfflineZoom(z2, Number(z2.getAttribute('data-zoom-scale') || '1') - 0.2);
          }
          return;
        }

        var mediaBtn = t.closest('button[data-media-toggle="1"]');
        if (mediaBtn) {
          ev.preventDefault();
          ev.stopPropagation();

          var key = String(mediaBtn.getAttribute('data-media-drop') || mediaBtn.getAttribute('data-media-key') || '').trim();
          var kindRaw = String(mediaBtn.getAttribute('data-media-kind') || '').trim();
          var isWide = String(mediaBtn.getAttribute('data-media-wide') || '') === '1' || kindRaw === 'photo' || kindRaw === 'video' || kindRaw === 'clip';

          if (isWide && key) {
            ensureOfflineWideMediaDrop(mediaBtn, key);
            return;
          }

          var iframe = String(mediaBtn.getAttribute('data-media-iframe') || '').trim();
          var title = String(mediaBtn.getAttribute('data-media-title') || '').trim();
          var src = String(mediaBtn.getAttribute('data-media-hq') || mediaBtn.getAttribute('data-media-src') || '').trim();
          var fallback = String(mediaBtn.getAttribute('data-media-remote-hq') || mediaBtn.getAttribute('data-media-remote-src') || '').trim();
          if (iframe) {
            openEmbedModal(iframe);
            return;
          }
          if (src || fallback) {
            openLightbox(src || fallback, title || '', fallback || '');
          }
          return;
        }

        var obsVizHit = t.closest('[data-obs-viz]');
        if (obsVizHit) {
          ev.preventDefault();
          ev.stopPropagation();

          var mode = String(obsVizHit.getAttribute('data-obs-viz') || 'chart') === 'map' ? 'map' : 'chart';
          var chartWrap = document.getElementById('vkxObsChartWrap');
          var mapWrap = document.getElementById('vkxObsMapWrap');
          var vizWrap = document.getElementById('vkxObsVizPills');

          window.__vkxObsViz = mode;

          if (chartWrap) chartWrap.style.display = mode === 'chart' ? '' : 'none';
          if (mapWrap) mapWrap.style.display = mode === 'map' ? '' : 'none';

          if (vizWrap) {
            vizWrap.querySelectorAll('[data-obs-viz]').forEach(function(node){
              var active = String(node.getAttribute('data-obs-viz') || '') === mode;
              node.classList.toggle('is-active', active);
              if (active) node.setAttribute('aria-current', 'page');
              else node.removeAttribute('aria-current');
            });
          }

          try {
            if (mode === 'map' && OFFLINE_MAPS.observed && OFFLINE_MAPS.observed.map) {
              OFFLINE_MAPS.observed.map.invalidateSize(false);
              if (typeof OFFLINE_MAPS.observed.render === 'function') OFFLINE_MAPS.observed.render();
            }
          } catch(e) {}

          try { refreshOfflineView(); } catch(e) {}
          return;
        }

        var obsActorHit = t.closest('[data-observed-actor="1"]');
        if (obsActorHit) {
          ev.preventDefault();
          ev.stopPropagation();
          var obsActorId = Number(obsActorHit.getAttribute('data-actor-id'));
          if (Number.isFinite(obsActorId) && obsActorId !== 0) openOfflineObservedActor(obsActorId);
          return;
        }

        var obsEvidenceHit = t.closest('[data-observed-evidence="1"]');
        if (obsEvidenceHit) {
          ev.preventDefault();
          ev.stopPropagation();
          openOfflineObservedEvidence(
            String(obsEvidenceHit.getAttribute('data-source') || 'wall'),
            Number(obsEvidenceHit.getAttribute('data-post-id') || 0),
            Number(obsEvidenceHit.getAttribute('data-comment-id') || 0),
            String(obsEvidenceHit.getAttribute('data-media-key') || '')
          );
          return;
        }

        var wallPostHit = t.closest('[data-wall-post="1"], [data-wall-open-post="1"], [data-wall-actor-post="1"]');
        if (wallPostHit) {
          ev.preventDefault();
          ev.stopPropagation();
          var wallPostId = Number(wallPostHit.getAttribute('data-post-id') || 0);
          if (Number.isFinite(wallPostId) && wallPostId > 0) openOfflineWallPost(wallPostId);
          return;
        }

        var wallActorHit = t.closest('[data-wall-open-actor="1"], [data-wall-actor="1"]');
        if (wallActorHit) {
          ev.preventDefault();
          ev.stopPropagation();
          var wallActorId = Number(wallActorHit.getAttribute('data-actor-id') || 0);
          if (Number.isFinite(wallActorId) && wallActorId !== 0) openOfflineWallActor(wallActorId);
          return;
        }

        var img = t.closest('[data-lightbox-src]');
        if (img) {
          ev.preventDefault();
          ev.stopPropagation();
          var src2 = String(img.getAttribute('data-lightbox-src') || '').trim();
          var fb2 = String(img.getAttribute('data-lightbox-remote-src') || '').trim();
          if (src2 || fb2) openLightbox(src2 || fb2, '', fb2 || '');
          return;
        }
      });
    }

    function initGroupOverviewSnapshotMap(){
      var data = safeParse('vkxGroupOverviewMapData');
      var host = document.getElementById('vkxGroupOverviewMap');
      var status = document.getElementById('vkxGroupOverviewMapStatus');
      var detail = document.getElementById('vkxGroupOverviewMapDetail');
      var panel = document.getElementById('panel-overview');
      if (!host || !data || !Array.isArray(data.points) || !data.points.length || !window.L) return;

      try {
        var wrap = host.closest('.vkxMapWrap');
        if (wrap) wrap.style.display = '';
      } catch(e) {}

      host.innerHTML = '';
      var map = L.map(host, { zoomControl: true, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
      var layer = L.layerGroup().addTo(map);
      var SC = window.Supercluster;
      if (!SC) return;

      var features = data.points.map(function(p){
        return { type:'Feature', geometry:{ type:'Point', coordinates:[p.lon, p.lat] }, properties:p };
      });
      var idx = new SC({ radius: 60, maxZoom: 19 });
      idx.load(features);

      function focusTarget(p){
        if (!p) return;
        try {
          if (p.cardKey) {
            var card = (panel || document).querySelector('.gridCard[data-card-key="' + offlineCssEsc(String(p.cardKey)) + '"]');
            if (card) { focusOfflineNode(card); return; }
          }
          if (p.rowKey) {
            var row = (panel || document).querySelector('.listRow[data-group-addr-key="' + offlineCssEsc(String(p.rowKey)) + '"]');
            if (row) focusOfflineNode(row);
          }
        } catch(e) {}
      }

      function render(){
        layer.clearLayers();
        var b = map.getBounds();
        var clusters = idx.getClusters([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
        clusters.forEach(function(c){
          var lon = c.geometry.coordinates[0];
          var lat = c.geometry.coordinates[1];

          if (c.properties && c.properties.cluster) {
            var icon = L.divIcon({ className:'', html:'<div class="vkxCluster">' + String(c.properties.point_count || 0) + '</div>', iconSize:[34,34], iconAnchor:[17,17] });
            var m = L.marker([lat, lon], { icon: icon }).addTo(layer);
            m.on('click', function(){ map.setView([lat, lon], Math.min(map.getZoom() + 2, 19)); });
          } else {
            var p = c.properties || {};
            var kind = String(p.kind || '');
            var cls = kind === 'address' ? 'vkxPin vkxPin--address' : (kind === 'place' ? 'vkxPin vkxPin--place' : 'vkxPin');
            var icon2 = L.divIcon({ className:'', html:'<div class="' + cls + '"></div>', iconSize:[14,14], iconAnchor:[7,7] });
            var m2 = L.marker([lat, lon], { icon: icon2 }).addTo(layer);
            m2.on('click', function(){
              if (detail) {
                detail.innerHTML =
                  '<div class="eventTitle">' + String(p.name || '').replace(/</g,'&lt;') + '</div>' +
                  '<div class="eventMeta">' + String(p.q || '').replace(/</g,'&lt;') +
                  ((Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon))) ? (' • ' + Number(p.lat).toFixed(5) + ', ' + Number(p.lon).toFixed(5)) : '') +
                  '</div>';
              }
              focusTarget(p);
            });
          }
        });
      }

      map.on('moveend zoomend', render);
      applySnapshotOpeningView(map);
      render();
      OFFLINE_MAPS.groupOverview = { host: host, map: map, render: render };
      if (status) status.textContent = offT('mappedGroupOverviewPoints', { count: String(data.points.length || 0) });
    }

    function initRelationsSnapshotMap(){
      var data = safeParse('vkxRelationsMapData');
      initGenericOfflineMap('relations', data, 'vkxRelationsMap', 'vkxRelationsMapStatus', 'vkxRelationsMapDetail', offT('interactiveOfflineRelationsMap'), 'panel-relations');
    }


    
    function bindOfflineMediaZoomInteractions(){
      if (window.__vkxOfflineMediaZoomBound) return;
      window.__vkxOfflineMediaZoomBound = true;

      function getDragState(){
        if (!window.__vkxOfflineMediaDrag) {
          window.__vkxOfflineMediaDrag = {
            wrap: null,
            pointerId: null,
            startX: 0,
            startY: 0,
            baseX: 0,
            baseY: 0
          };
        }
        return window.__vkxOfflineMediaDrag;
      }

      document.addEventListener('wheel', function(ev){
        var t = ev.target;
        var wrap = t && t.closest ? t.closest('.mediaZoomWrap[data-media-zoom="1"]') : null;
        if (!wrap) return;
        ev.preventDefault();
        ensureOfflineZoomState(wrap);
        var cur = Number(wrap.getAttribute('data-zoom-scale') || '1');
        var delta = ev.deltaY;
        var next = cur + (delta > 0 ? -0.2 : 0.2);
        setOfflineZoom(wrap, next);
      }, { passive: false });

      document.addEventListener('pointerdown', function(ev){
        var wrap = ev.target && ev.target.closest ? ev.target.closest('.mediaZoomWrap[data-media-zoom="1"]') : null;
        if (!wrap) return;

        ensureOfflineZoomState(wrap);
        var scale = Number(wrap.getAttribute('data-zoom-scale') || '1');
        if (!(scale > 1.001)) return;

        var st = getDragState();
        st.wrap = wrap;
        st.pointerId = ev.pointerId;
        st.startX = ev.clientX;
        st.startY = ev.clientY;
        st.baseX = Number(wrap.getAttribute('data-pan-x') || '0') || 0;
        st.baseY = Number(wrap.getAttribute('data-pan-y') || '0') || 0;

        wrap.classList.add('is-dragging');
        try { wrap.setPointerCapture(ev.pointerId); } catch(e) {}
        ev.preventDefault();
      });

      document.addEventListener('pointermove', function(ev){
        var st = getDragState();
        if (!st.wrap || st.pointerId !== ev.pointerId) return;

        var nextX = st.baseX + (ev.clientX - st.startX);
        var nextY = st.baseY + (ev.clientY - st.startY);
        st.wrap.setAttribute('data-pan-x', String(nextX));
        st.wrap.setAttribute('data-pan-y', String(nextY));
        applyOfflineZoomTransform(st.wrap);
        ev.preventDefault();
      });

      function endDrag(ev){
        var st = getDragState();
        if (!st.wrap || st.pointerId !== ev.pointerId) return;
        var wrap = st.wrap;
        st.wrap = null;
        st.pointerId = null;
        wrap.classList.remove('is-dragging');
        try { wrap.releasePointerCapture(ev.pointerId); } catch(e) {}
      }

      document.addEventListener('pointerup', endDrag);
      document.addEventListener('pointercancel', endDrag);

      document.addEventListener('dblclick', function(ev){
        var wrap = ev.target && ev.target.closest ? ev.target.closest('.mediaZoomWrap[data-media-zoom="1"]') : null;
        if (!wrap) return;
        setOfflineZoom(wrap, 1);
      });
    }

    function initFamilyTreeSnapshot(){
      var data = safeParse('vkxFamilyTreeData');
      var host = document.getElementById('vkxFamilyTree');
      var detail = document.getElementById('vkxFamilyTreeDetail');
      if (!host || !data || !Array.isArray(data.nodes) || !data.nodes.length || !window.vis || !window.vis.Network || !window.vis.DataSet) return;

      host.innerHTML = '';
      var nodesDs = new vis.DataSet(data.nodes || []);
      var edgesDs = new vis.DataSet(data.edges || []);
      var network = new vis.Network(host, { nodes: nodesDs, edges: edgesDs }, {
        autoResize: true,
        physics: false,
        interaction: { hover: true, dragNodes: false, dragView: true, zoomView: true, navigationButtons: false },
        nodes: { shapeProperties: { useBorderWithImage: true }, margin: 10 },
        edges: { smooth: { enabled: true, type: 'cubicBezier', roundness: 0.2 }, width: 2, selectionWidth: 0 }
      });

      var baseNodes = {};
      nodesDs.getIds().forEach(function(id){
        var n = nodesDs.get(id);
        baseNodes[String(id)] = {
          color: n && n.color,
          font: n && n.font,
          borderWidth: n && n.borderWidth,
          size: n && n.size
        };
      });

      var baseEdges = {};
      edgesDs.getIds().forEach(function(id){
        var e = edgesDs.get(id);
        baseEdges[String(id)] = {
          color: e && e.color,
          width: e && e.width,
          font: e && e.font,
          label: e && e.label
        };
      });

      var adj = {};
      var edgeEnds = {};
      (data.edges || []).forEach(function(e){
        var id = String(e && e.id || '');
        var a = String(e && e.from || '');
        var b = String(e && e.to || '');
        if (!id || !a || !b) return;
        edgeEnds[id] = { a: a, b: b };
        if (!adj[a]) adj[a] = [];
        if (!adj[b]) adj[b] = [];
        if (adj[a].indexOf(b) < 0) adj[a].push(b);
        if (adj[b].indexOf(a) < 0) adj[b].push(a);
      });

      function renderDetail(nodeId){
        if (!detail) return;
        var info = nodeId ? (data.detail && data.detail[String(nodeId)]) : null;
        if (!info) {
          detail.innerHTML = '<div class="muted">' + offT('clickFamilyNodeToInspect') + '</div>';
          return;
        }
        detail.innerHTML =
          '<div class="eventTitle">' + String(info.name || '').replace(/</g,'&lt;') + '</div>' +
          '<div class="eventMeta">' + String(info.roleLabel || '').replace(/</g,'&lt;') + (info.inferred ? (' • ' + offT('familyInferred')) : (' • ' + offT('familyDirect'))) + '</div>' +
          (info.meta ? '<div class="eventMeta">' + String(info.meta).replace(/</g,'&lt;') + '</div>' : '') +
          (info.location ? '<div class="eventMeta">' + String(info.location).replace(/</g,'&lt;') + '</div>' : '') +
          (info.via ? '<div class="eventMeta">' + offT('familyInferred') + ' ' + String(info.via).replace(/</g,'&lt;') + '</div>' : '');
      }

      function applyFamilyFocus(nodeId){
        var sel = String(nodeId || '');
        if (!sel) {
          nodesDs.getIds().forEach(function(id){
            var b = baseNodes[String(id)] || {};
            nodesDs.update({ id: id, color: b.color, font: b.font, borderWidth: b.borderWidth, size: b.size });
          });
          edgesDs.getIds().forEach(function(id){
            var b = baseEdges[String(id)] || {};
            edgesDs.update({ id: id, color: b.color, width: b.width, font: b.font, label: b.label || '' });
          });
          return;
        }

        var n1 = new Set((adj[sel] || []).map(function(x){ return String(x); }));

        nodesDs.getIds().forEach(function(id){
          var sid = String(id);
          var b = baseNodes[sid] || {};
          var isActive = (sid === sel || n1.has(sid));
          var font = Object.assign({}, b.font || {}, {
            color: isActive ? 'rgba(231,238,252,0.96)' : 'rgba(231,238,252,0.34)'
          });

          var color = b.color;
          if (!isActive) {
            color = Object.assign({}, b.color || {}, {
              border: 'rgba(255,255,255,0.18)',
              background: (b.color && b.color.background) ? b.color.background : 'rgba(0,0,0,0)'
            });
          }

          nodesDs.update({
            id: sid,
            color: color,
            font: font,
            borderWidth: isActive ? Math.max(4, Number(b.borderWidth || 3)) : Math.max(1, Number(b.borderWidth || 2) - 1),
            size: b.size
          });
        });

        edgesDs.getIds().forEach(function(id){
          var eid = String(id);
          var b = baseEdges[eid] || {};
          var ends = edgeEnds[eid];
          if (!ends) {
            edgesDs.update({ id: eid, color: { color: 'rgba(231,238,252,0.10)' }, width: 1.2, font: b.font, label: '' });
            return;
          }

          var direct = (String(ends.a) === sel || String(ends.b) === sel);
          var near = (n1.has(String(ends.a)) || n1.has(String(ends.b)));

          if (direct) {
            var directColor = (b.color && b.color.color) ? b.color : { color: 'rgba(99,102,241,0.92)' };
            edgesDs.update({
              id: eid,
              color: directColor,
              width: Math.max(3.2, Number(b.width || 2) + 1.2),
              font: Object.assign({}, b.font || {}, { color: 'rgba(231,238,252,0.96)' }),
              label: b.label || ''
            });
            return;
          }

          if (near) {
            var nearColor = (b.color && b.color.color) ? b.color : { color: 'rgba(99,102,241,0.58)' };
            edgesDs.update({
              id: eid,
              color: nearColor,
              width: Math.max(2.2, Number(b.width || 2)),
              font: Object.assign({}, b.font || {}, { color: 'rgba(231,238,252,0.82)' }),
              label: b.label || ''
            });
            return;
          }

          edgesDs.update({
            id: eid,
            color: { color: 'rgba(231,238,252,0.10)' },
            width: 1.1,
            font: Object.assign({}, b.font || {}, { color: 'rgba(231,238,252,0.28)' }),
            label: ''
          });
        });
      }

      network.on('click', function(params){
        var nodeId = Array.isArray(params && params.nodes) && params.nodes.length ? String(params.nodes[0]) : '';
        renderDetail(nodeId || undefined);
        applyFamilyFocus(nodeId || '');
      });

      try { network.fit({ animation: false }); } catch(e) {}
      renderDetail();
      applyFamilyFocus('');
      window.__vkxSnapFamilyTree = { network: network, nodesDs: nodesDs, edgesDs: edgesDs };
    }

    function initWallMapSnapshot(){
      var data = safeParse('vkxWallMapData');
      var snap = wallSnapParse();
      var host = document.getElementById('vkxWallMap');
      var wrap = document.getElementById('vkxWallMapWrap');
      var detail = document.getElementById('vkxWallMapDetail');
      var status = document.getElementById('vkxWallMapStatus');
      var headTools = document.getElementById('vkxWallMapHeadTools');
      if (!host || !wrap || !data || !Array.isArray(data.points) || !data.points.length || !window.L) return;

      wrap.style.display = '';
      host.innerHTML = '';
      var map = L.map(host, { zoomControl: true, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
      var layer = L.layerGroup().addTo(map);
      var SC = window.Supercluster;
      if (!SC) return;

      var features = data.points.map(function(p){
        return { type:'Feature', geometry:{ type:'Point', coordinates:[p.lon, p.lat] }, properties:p };
      });
      var idx = new SC({ radius: 44, maxZoom: 18 });
      idx.load(features);

      function renderHeadTools(){
        var st = wallSnapState(snap || wallSnapParse());
        if (!headTools) return;
        headTools.innerHTML = String(st.locationKey || '').trim()
          ? '<button class="actionBtn" type="button" data-wall-location-clear="1">' + offT('clearLocationFilter') + '</button>'
          : '';
      }

      function renderStatus(){
        var st = wallSnapState(snap || wallSnapParse());
        var posts = snap && Array.isArray(snap.posts) ? snap.posts : [];
        var timeScoped = posts.filter(function(p){ return wallSnapMatchesTimeline(p, st); });
        var locationScoped = timeScoped.filter(function(p){ return wallSnapMatchesLocation(p, st); });
        var noLocation = String(st.locationKey || '').trim()
          ? timeScoped.filter(function(p){ return !String(p.locationKey || '').trim(); }).length
          : 0;

        if (status) {
          status.textContent = String(st.locationKey || '').trim()
            ? (offT('locationFilterActivePosts', { count: locationScoped.length }) + (noLocation ? offT('noLocationPostsExcluded', { count: noLocation }) : '') + '.')
            : offT('showingMappedWallPointsPackagedSnapshot', { count: data.points.length });
        }
      }

      function selectPoint(p){
        var st = wallSnapState(snap || wallSnapParse());
        st.locationKey = String(p.locationKey || '');
        st.locationKeys = st.locationKey ? [st.locationKey] : [];
        st.locationLabel = String(p.locationLabel || p.place || p.label || p.q || offT('locationLabel'));
        st.timeViewKeys = [];
        st.visible = 24;
        st.selectedPostId = Number(p.postId || 0) || 0;
        st.openPostId = Number(p.postId || 0) || 0;

        if (detail) {
          detail.innerHTML =
            '<div class="eventTitle">' + String(st.locationLabel || '').replace(/</g,'&lt;') + '</div>' +
            '<div class="eventMeta">Post #' + String(p.postId || '').replace(/</g,'&lt;') + (p.exact ? '' : (' • ' + offT('geocodedPlace'))) + '</div>' +
            (p.text ? '<div class="muted" style="margin-top:6px;">' + String(p.text).replace(/</g,'&lt;') + '</div>' : '');
        }

        renderHeadTools();
        renderStatus();
        try { if (typeof window.__vkxSnapWallRender === 'function') window.__vkxSnapWallRender(); } catch(e) {}
      }

      function render(){
        layer.clearLayers();
        var b = map.getBounds();
        var clusters = idx.getClusters([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
        clusters.forEach(function(c){
          var lon = c.geometry.coordinates[0];
          var lat = c.geometry.coordinates[1];
          if (c.properties && c.properties.cluster) {
            var icon = L.divIcon({ className:'', html:'<div class="vkxCluster">' + String(c.properties.point_count || 0) + '</div>', iconSize:[34,34], iconAnchor:[17,17] });
            var m = L.marker([lat, lon], { icon: icon }).addTo(layer);
            m.on('click', function(){ map.setView([lat, lon], Math.min(map.getZoom() + 2, 19)); });
          } else {
            var p = c.properties || {};
            var icon2 = L.divIcon({ className:'', html:'<div class="vkxMarkerDot"></div>', iconSize:[12,12], iconAnchor:[6,6] });
            var m2 = L.marker([lat, lon], { icon: icon2 }).addTo(layer);
            m2.on('click', function(){ selectPoint(p); });
          }
        });
      }

      map.on('moveend zoomend', function(){ render(); renderStatus(); });
      applySnapshotOpeningView(map);
      render();
      renderHeadTools();
      renderStatus();

      OFFLINE_MAPS.wall = {
        host: host,
        map: map,
        render: render,
        syncState: function(){ renderHeadTools(); renderStatus(); }
      };
    }

    function initGenericOfflineMap(slot, data, hostId, statusId, detailId, statusText, panelId){
      var host = document.getElementById(hostId);
      var status = document.getElementById(statusId);
      var detail = document.getElementById(detailId);
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!host || !data || !Array.isArray(data.points) || !data.points.length || !window.L) return;

      try {
        var wrap = host.closest('.vkxMapWrap');
        if (wrap) wrap.style.display = '';
      } catch(e) {}

      host.innerHTML = '';
      var map = L.map(host, { zoomControl: true, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
      var layer = L.layerGroup().addTo(map);
      var SC = window.Supercluster;
      if (!SC) return;

      var features = data.points.map(function(p){
        return { type:'Feature', geometry:{ type:'Point', coordinates:[p.lon, p.lat] }, properties:p };
      });
      var idx = new SC({ radius: 60, maxZoom: 19 });
      idx.load(features);

      function focusCardByKey(key){
        try {
          var card = (panel || document).querySelector('.gridCard[data-card-key="' + String(key || '').replace(/"/g,'&quot;') + '"]');
          if (!card) return;
          card.classList.add('vkxFlash');
          if (card.scrollIntoView) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          window.setTimeout(function(){ try { card.classList.remove('vkxFlash'); } catch(e) {} }, 1600);
        } catch(e) {}
      }

      function applyViewportFilter(){
        if (!panel || !panel.querySelectorAll) {
          if (status) status.textContent = statusText;
          return;
        }

        var cards = panel.querySelectorAll('.gridCard[data-card-key]');
        var z = map.getZoom();
        var b = map.getBounds();
        var shown = 0;
        var unknown = 0;

        cards.forEach(function(node){
          var q = String(node.getAttribute('data-geo-q') || '').trim();
          var isUnknown = String(node.getAttribute('data-geo-unknown') || '') === '1' || !q;
          if (isUnknown) unknown++;

          var lat = Number(node.getAttribute('data-geo-lat'));
          var lon = Number(node.getAttribute('data-geo-lon'));

          var ok = true;
          if (z > 2) {
            if (isUnknown) ok = false;
            else ok = Number.isFinite(lat) && Number.isFinite(lon) && b.contains(L.latLng(lat, lon));
          }

          node.classList.toggle('vkxHiddenByMap', !ok);
          if (ok) shown++;
        });

        if (status) {
          status.textContent = (z <= 2)
            ? offT('showingViewportUnknown', { shown: shown, total: cards.length, unknown: unknown })
            : offT('filteredViewportUnknown', { shown: shown, total: cards.length });
        }
      }

      function render(){
        layer.clearLayers();
        var b = map.getBounds();
        var clusters = idx.getClusters([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
        clusters.forEach(function(c){
          var lon = c.geometry.coordinates[0];
          var lat = c.geometry.coordinates[1];
          if (c.properties && c.properties.cluster) {
            var icon = L.divIcon({ className:'', html:'<div class="vkxCluster">' + String(c.properties.point_count || 0) + '</div>', iconSize:[34,34], iconAnchor:[17,17] });
            var m = L.marker([lat, lon], { icon: icon }).addTo(layer);
            m.on('click', function(){ map.setView([lat, lon], Math.min(map.getZoom() + 2, 19)); });
          } else {
            var p = c.properties || {};
            var icon2 = L.divIcon({ className:'', html:'<div class="vkxMarkerDot"></div>', iconSize:[12,12], iconAnchor:[6,6] });
            var m2 = L.marker([lat, lon], { icon: icon2 }).addTo(layer);
            m2.on('click', function(){
              if (detail) {
                detail.innerHTML =
                  '<div class="eventTitle">' + String(p.name || '').replace(/</g,'&lt;') + '</div>' +
                  '<div class="eventMeta">' + String(p.q || '').replace(/</g,'&lt;') +
                  (Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)) ? (' • ' + Number(p.lat).toFixed(5) + ', ' + Number(p.lon).toFixed(5)) : '') +
                  '</div>';
              }
              focusCardByKey(String(p.key || ''));
            });
          }
        });

        applyViewportFilter();
      }

      map.on('moveend zoomend', render);
      applySnapshotOpeningView(map);
      render();
      OFFLINE_MAPS[slot] = { host: host, map: map, render: render };
    }

    function initPeopleSnapshotMaps(){
      var all = safeParse('vkxPeopleMapData') || {};
      initGenericOfflineMap('friends', all.friends, 'vkxPeopleMap', 'vkxPeopleMapStatus', 'vkxPeopleMapDetail', offT('interactiveOfflineFriendsMap'), 'panel-friends');
      initGenericOfflineMap('following', all.following, 'vkxFollowingMap', 'vkxFollowingMapStatus', 'vkxFollowingMapDetail', offT('interactiveOfflineFollowingMap'), 'panel-following');
      initGenericOfflineMap('followers', all.followers, 'vkxFollowersMap', 'vkxFollowersMapStatus', 'vkxFollowersMapDetail', offT('interactiveOfflineFollowersMap'), 'panel-followers');
      initGenericOfflineMap('communities', all.communities, 'vkxCommunitiesMap', 'vkxCommunitiesMapStatus', 'vkxCommunitiesMapDetail', offT('interactiveOfflineCommunitiesMap'), 'panel-communities');
      initGenericOfflineMap('observed', all.observed, 'vkxObservedMap', 'vkxObservedMapStatus', 'vkxObservedMapDetail', offT('interactiveOfflineObservedMap'), 'panel-observed');
    }

    function refreshOfflineView(){
      try {
        Object.keys(OFFLINE_MAPS || {}).forEach(function(key){
          var rec = OFFLINE_MAPS[key];
          if (!rec || !rec.host || !rec.map) return;
          if (rec.host.clientWidth > 0 && rec.host.clientHeight > 0 && getComputedStyle(rec.host).display !== 'none') {
            try { rec.map.invalidateSize(false); } catch(e) {}
            try { if (typeof rec.render === 'function') rec.render(); } catch(e) {}
          }
        });
      } catch(e) {}

      try {
        ['photo','video','observed'].forEach(function(scope){
          var host = document.querySelector('[data-linkchart="' + scope + '"]');
          var stAll = window.__vkxSnapLc || {};
          var st = stAll[scope];
          if (!host || !st || !st.network) return;
          if (host.clientWidth > 0 && host.clientHeight > 0 && getComputedStyle(host).display !== 'none') {
            try { st.network.redraw(); } catch(e) {}
            try { st.network.fit({ animation: false }); } catch(e) {}
          }
        });
      } catch(e) {}
    }

    function ensureLcModal(){
      var m = document.getElementById('vkxLcModal');
      var b = document.getElementById('vkxLcModalBody');
      if (m && b) return { modal: m, body: b };
      try {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="lcModal" id="vkxLcModal" aria-hidden="true">' +
          '<button class="lcModalClose" type="button" data-lc-modal-close="1">×</button>' +
          '<div class="lcModalInner"><div id="vkxLcModalBody"></div></div>' +
        '</div>';
        document.body.appendChild(wrap.firstChild);
      } catch(e) {}
      m = document.getElementById('vkxLcModal');
      b = document.getElementById('vkxLcModalBody');
      return { modal: m, body: b };
    }

    function openEdgeEvidence(scope, edgeId){
      try {
        var st = snapLc(scope);
        if (!st || !st.edgeInfo) return;
        var info = st.edgeInfo[edgeId] || null;
        if (!info) return;

        var mm = ensureLcModal();
        if (!mm || !mm.modal || !mm.body) return;

        var pills = '';
        if (info.liked) pills += '<span class="pill tiny">' + offT('likedPill') + '</span> ';
        if (info.copied) pills += '<span class="pill tiny">' + offT('copiedPill') + '</span> ';
        if (Number(info.commentCount || 0) > 0) pills += '<span class="pill tiny">' + offT('comments') + ': ' + String(info.commentCount) + '</span> ';
        if (Number(info.replyCount || 0) > 0) pills += '<span class="pill tiny">' + offT('repliesLabel') + ': ' + String(info.replyCount) + '</span> ';

        var uUrl = Number(info.uId || 0) < 0
          ? ('https://vk.com/club' + String(Math.abs(Number(info.uId || 0))))
          : ('https://vk.com/id' + String(info.uId || ''));

        var mUrl = (scope === 'observed')
          ? ('https://vk.com/wall' + String(info.ownerId || '') + '_' + String(info.itemId || ''))
          : ('https://vk.com/' + String(info.scope || 'photo') + String(info.ownerId || '') + '_' + String(info.itemId || ''));

        var commentHtml = '';
        var arr = Array.isArray(info.comments) ? info.comments : [];
        if (arr.length) {
          commentHtml =
            '<div class="ovCard" style="margin-top:10px;">' +
              '<div class="muted" style="margin-bottom:8px;">' + offT('commentsCaptured') + '</div>' +
              arr.slice(0, 30).map(function(c){
                var txt = String((c && c.text) || '');
                var d = Number((c && c.date) || 0);
                var when = d ? (new Date(d*1000).toISOString().slice(0,10)) : '';
                return '<div class="listRow"><div class="listTitle">' + txt.replace(/</g,'&lt;') + '</div><div class="listMeta">' + when + '</div></div>';
              }).join('') +
            '</div>';
        }

        mm.body.innerHTML =
          '<div class="sec-title white" style="margin:4px 0 10px 0;">' +
            '<span class="sub-title">' + offT('linkEvidence') + '</span>' +
            '<h2 class="title" style="font-size:18px;">' + offT('user') + ' ' + String(info.uId || '').replace(/</g,'&lt;') +
            ' ↔ ' + String(info.mKey || '').replace(/</g,'&lt;') + '</h2>' +
          '</div>' +
          '<div class="ovCard">' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' + pills + '</div>' +
            '<div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap;">' +
              '<a class="gridLinkBtn" href="'+uUrl+'" target="_blank" rel="noreferrer">' + offT('openExternal') + '</a>' +
              '<a class="gridLinkBtn" href="'+mUrl+'" target="_blank" rel="noreferrer">' + offT('openExternal') + '</a>' +
            '</div>' +
            '<div class="muted" style="margin-top:10px;">' + (scope === 'observed' ? offT('capturedFromWallSnapshotEvidence') : offT('capturedFromApiEnrichment')) + '</div>' +
          '</div>' +
          commentHtml;

        mm.modal.classList.add('open');
        mm.modal.setAttribute('aria-hidden', 'false');
      } catch(e) {}
    }

    function dimFont(base){
      base = base || {};
      return {
        size: base.size || 11,
        face: base.face || 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: 'rgba(231,238,252,0.35)',
        background: 'rgba(0,0,0,0.22)',
        strokeWidth: 0
      };
    }
    function hiFont(base){
      base = base || {};
      return {
        size: base.size || 11,
        face: base.face || 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        color: 'rgba(231,238,252,0.92)',
        background: 'rgba(0,0,0,0.32)',
        strokeWidth: 0
      };
    }

    function snapHueFromKey(key){
      var s = String(key || '');
      var h = 0;
      for (var i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) % 360;
      return h;
    }

    function snapLcSolid(h){
      return 'hsla(' + String(h) + ', 92%, 62%, 0.98)';
    }

    function snapLcHi1(h){
      return 'hsla(' + String(h) + ', 92%, 62%, 0.70)';
    }

    function snapLcHi2(h){
      return 'hsla(' + String(h) + ', 88%, 68%, 0.42)';
    }

    function applyFocusVis(scope){
      var st = snapLc(scope);
      if (!st || !st.network || !st.nodesDs || !st.edgesDs) return;

      var sel = String(st.sel || '');
      var focusOn = !!st.focusOn;
      var selKeys = Array.isArray(st.selKeys) ? st.selKeys.map(function(x){ return String(x); }) : [];
      var seeds = selKeys.length ? selKeys : (sel ? [sel] : []);
      var hoverKey = String(st.hoverKey || '');
      var accentKey = hoverKey || sel || (scope + ':default');
      var h = snapHueFromKey(accentKey);
      var edgeHi1 = snapLcHi1(h);
      var edgeHi2 = snapLcHi2(h);
      var borderHi = { border: snapLcSolid(h), background: 'rgba(0,0,0,0)' };
      var borderSoft = { border: snapLcHi2(h), background: 'rgba(0,0,0,0)' };

      if (!focusOn || !seeds.length) {
        var nUpd0 = [];
        st.nodesDs.getIds().forEach(function(id){
          var b = (st.baseNodes && st.baseNodes[String(id)]) || {};
          nUpd0.push({ id: id, color: b.color, font: b.font, size: b.size, borderWidth: b.borderWidth });
        });
        st.nodesDs.update(nUpd0);

        var eUpd0 = [];
        st.edgesDs.getIds().forEach(function(id){
          var b = (st.baseEdges && st.baseEdges[String(id)]) || {};
          eUpd0.push({ id: id, color: b.color, width: b.width, font: b.font, label: '' });
        });
        st.edgesDs.update(eUpd0);
        return;
      }

      var adj = st.adj || {};
      var depth = (Number(st.focusDepth) === 1) ? 1 : 2;
      var n1 = new Set();
      var n2 = new Set();

      seeds.forEach(function(seed){
        (adj[seed] || []).forEach(function(x){ n1.add(String(x)); });
      });

      if (depth === 2) {
        n1.forEach(function(a){
          (adj[a] || []).forEach(function(b){
            var sb = String(b);
            if (seeds.indexOf(sb) < 0 && !n1.has(sb)) n2.add(sb);
          });
        });
      }

      var nUpd = [];
      st.nodesDs.getIds().forEach(function(id){
        var sid = String(id);
        var baseWrap = (st.baseNodes && st.baseNodes[sid]) || {};
        var baseFont = baseWrap.font || {};
        var isActive = (seeds.indexOf(sid) >= 0 || n1.has(sid) || n2.has(sid));
        var font = isActive ? hiFont(baseFont) : dimFont(baseFont);
        var color = baseWrap.color;

        if (sid.indexOf('m:') === 0 || sid.indexOf('p:') === 0) {
          if (sid === accentKey) color = Object.assign({}, baseWrap.color || {}, borderHi);
          else if (isActive && (n1.has(sid) || n2.has(sid))) color = Object.assign({}, baseWrap.color || {}, borderSoft);
        }

        nUpd.push({ id: sid, color: color, font: font, size: baseWrap.size, borderWidth: baseWrap.borderWidth });
      });
      st.nodesDs.update(nUpd);

      var edgeEnds = st.edgeEnds || {};
      var eUpd = [];
      st.edgesDs.getIds().forEach(function(id){
        var eid = String(id);
        var ends = edgeEnds[eid];
        var baseWrap = (st.baseEdges && st.baseEdges[eid]) || {};
        var baseFont = baseWrap.font || {};
        var edgeLabel = String(baseWrap.label || '');
        if (!ends) {
          eUpd.push({ id: eid, color: { color: 'rgba(231,238,252,0.10)' }, width: 1.0, font: dimFont(baseFont), label: '' });
          return;
        }

        var a = String(ends.a || '');
        var b = String(ends.b || '');
        var showLabel = seeds.indexOf(a) >= 0 || seeds.indexOf(b) >= 0;
        var label = showLabel ? edgeLabel : '';

        if (seeds.indexOf(a) >= 0 || seeds.indexOf(b) >= 0) {
          eUpd.push({ id: eid, color: { color: edgeHi1 }, width: 2.2, font: hiFont(baseFont), label: label });
          return;
        }

        if (depth === 2) {
          var inN1 = n1.has(a) || n1.has(b);
          var inN2 = n2.has(a) || n2.has(b);
          if (inN1 && inN2) {
            eUpd.push({ id: eid, color: { color: edgeHi2 }, width: 1.7, font: hiFont(baseFont), label: label });
            return;
          }
        }

        eUpd.push({ id: eid, color: { color: 'rgba(231,238,252,0.10)' }, width: 1.0, font: dimFont(baseFont), label: label });
      });
      st.edgesDs.update(eUpd);
    }

    function buildLcVis(scope, data){
      var container = document.querySelector('[data-linkchart="'+scope+'"]');
      if (!container || !data || !data.nodes || !data.edges) return;

      if (!window.vis || !window.vis.Network || !window.vis.DataSet) {
        container.innerHTML = '<div class="ovCard" style="background:rgba(239,68,68,0.14);border:1px solid rgba(255,255,255,0.12);">' + offT('visNetworkNotAvailableSnapshot') + '</div>';
        return;
      }

      var vis = window.vis;
      var stAll = window.__vkxSnapLc = window.__vkxSnapLc || {};
      var prev = stAll[scope] || null;
      try { if (prev && prev.network && prev.network.destroy) prev.network.destroy(); } catch(e) {}

      container.innerHTML = '<div data-snap-vis-host="'+scope+'" style="width:100%;height:100%;min-height:420px;"></div>';

      var host = container.querySelector('[data-snap-vis-host="'+scope+'"]');
      if (!host) return;

      function postNodeIconDataUri(){
        var svg =
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">' +
            '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
              '<stop offset="0%" stop-color="#f59e0b"/>' +
              '<stop offset="100%" stop-color="#fb7185"/>' +
            '</linearGradient></defs>' +
            '<rect x="4" y="4" width="56" height="56" rx="18" fill="url(#g)"/>' +
            '<rect x="18" y="18" width="28" height="4" rx="2" fill="white" opacity="0.95"/>' +
            '<rect x="18" y="28" width="20" height="4" rx="2" fill="white" opacity="0.90"/>' +
            '<rect x="18" y="38" width="24" height="4" rx="2" fill="white" opacity="0.85"/>' +
          '</svg>';
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      }

      var nodesArr = (data.nodes || []).map(function(n){
        var xy = {
          x: Number.isFinite(Number(n.x)) ? Number(n.x) : undefined,
          y: Number.isFinite(Number(n.y)) ? Number(n.y) : undefined
        };

        if (n.kind === 'media') {
          return {
            id: n.key,
            label: n.label,
            shape: 'circularImage',
            image: n.thumb || '',
            size: 28,
            borderWidth: 2,
            font: { size: 11, face: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: 'rgba(231,238,252,0.92)', background: 'rgba(0,0,0,0.32)' },
            x: xy.x,
            y: xy.y
          };
        }
        if (n.kind === 'post') {
          return {
            id: n.key,
            label: '',
            shape: 'circularImage',
            image: postNodeIconDataUri(),
            size: 24,
            borderWidth: 2,
            font: { size: 11, face: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: 'rgba(231,238,252,0.92)', background: 'rgba(0,0,0,0.32)' },
            x: xy.x,
            y: xy.y
          };
        }
        return {
          id: n.key,
          label: n.label,
          shape: 'dot',
          size: 9,
          color: { background: 'rgba(99,102,241,0.92)', border: 'rgba(0,0,0,0.35)' },
          font: { size: 11, face: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: 'rgba(231,238,252,0.92)', background: 'rgba(0,0,0,0.32)' },
          x: xy.x,
          y: xy.y
        };
      });

      function edgeLongLabel(e){
        var bits = [];
        if (e.liked) bits.push(offT('likedPill'));
        if (Number(e.commentCount || 0) > 0) bits.push(offT('commentedTimes', { count: String(e.commentCount) }));
        if (Number(e.replyCount || 0) > 0) bits.push(offT('replyTimes', { count: String(e.replyCount) }));
        if (e.copied) bits.push(offT('copiedPill'));
        return bits.join(' • ') || '';
      }

      var edgesArr = (data.edges || []).map(function(e){
        return {
          id: e.edgeId,
          from: e.a,
          to: e.b,
          label: '',
          labelFull: edgeLongLabel(e),
          width: 1.1,
          color: { color: 'rgba(231,238,252,0.18)' },
          font: { size: 11, face: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: 'rgba(231,238,252,0.80)', background: 'rgba(0,0,0,0.28)', align: 'middle' }
        };
      });

      var nodesDs = new vis.DataSet(nodesArr);
      var edgesDs = new vis.DataSet(edgesArr);

      var baseNodes = {};
      nodesDs.getIds().forEach(function(id){
        var n = nodesDs.get(id);
        baseNodes[String(id)] = { color: n && n.color, font: n && n.font, size: n && n.size, borderWidth: n && n.borderWidth };
      });
      var baseEdges = {};
      edgesDs.getIds().forEach(function(id){
        var e = edgesDs.get(id);
        baseEdges[String(id)] = { color: e && e.color, width: e && e.width, font: e && e.font, label: e && e.labelFull ? e.labelFull : '' };
      });

      var st = stAll[scope] = {
        scope: scope,
        movable: !!data.movable,
        focusOn: !!data.focusOn,
        focusDepth: (Number(data.focusDepth) === 1) ? 1 : 2,
        sel: String(data.sel || ''),
        selKeys: Array.isArray(data.selKeys) ? data.selKeys.slice() : [],
        hoverKey: '',
        adj: data.adj || {},
        edgeEnds: data.edgeEnds || {},
        edgeInfo: data.edgeInfo || {},
        data: data || {},
        nodesDs: nodesDs,
        edgesDs: edgesDs,
        baseNodes: baseNodes,
        baseEdges: baseEdges,
        network: null
      };

      var options = {
        autoResize: true,
        interaction: { hover: true, zoomView: true, dragView: true, dragNodes: !!st.movable },
        edges: { smooth: { enabled: false }, selectionWidth: 2.2 },
        physics: { enabled: true, stabilization: { iterations: 140, fit: true }, barnesHut: { gravitationalConstant: -4200, springLength: 240, springConstant: 0.03, damping: 0.55 } }
      };

      var network = st.network = new vis.Network(host, { nodes: nodesDs, edges: edgesDs }, options);

      network.on('selectNode', function(p){
        var ids = Array.isArray(p && p.nodes) ? p.nodes.map(function(x){ return String(x); }) : [];
        st.selKeys = ids.slice();
        st.sel = ids.length ? String(ids[0]) : '';
        applyFocusVis(scope);
      });

      network.on('deselectNode', function(){
        var ids = [];
        try { ids = (network.getSelectedNodes ? network.getSelectedNodes() : []).map(function(x){ return String(x); }); } catch(e) {}
        st.selKeys = ids.slice();
        st.sel = ids.length ? String(ids[0]) : '';
        applyFocusVis(scope);
      });

      network.on('hoverNode', function(p){
        var id = String((p && (p.node || (p.nodes && p.nodes[0]))) || '');
        st.hoverKey = id;
        applyFocusVis(scope);
      });

      network.on('blurNode', function(){
        st.hoverKey = '';
        applyFocusVis(scope);
      });

      network.on('doubleClick', function(p){
        var id = Array.isArray(p && p.nodes) && p.nodes.length ? String(p.nodes[0]) : '';
        if (!id) return;
        openOfflineLcNodeDetails(scope, id);
      });

      try {
        host.addEventListener('contextmenu', function(ev){
          var rect = host.getBoundingClientRect();
          var nodeId = '';
          try {
            nodeId = String((network.getNodeAt ? network.getNodeAt({ x: ev.clientX - rect.left, y: ev.clientY - rect.top }) : '') || '');
          } catch(e) {}

          if (!nodeId) return;
          ev.preventDefault();

          try { if (network.selectNodes) network.selectNodes([nodeId]); } catch(e) {}
          st.selKeys = [nodeId];
          st.sel = nodeId;
          applyFocusVis(scope);

          var ctx = document.getElementById('vkxLcCtx');
          if (!ctx) return;

          ctx.setAttribute('data-lcctx-node', nodeId);
          ctx.setAttribute('data-lcctx-scope', scope);
          syncOfflineLcCtx(scope, nodeId);

          ctx.style.left = Math.min(window.innerWidth - 210, ev.clientX) + 'px';
          ctx.style.top = Math.min(window.innerHeight - 160, ev.clientY) + 'px';
          ctx.style.display = 'block';
        });
      } catch(e) {}

      network.on('selectEdge', function(p){
        var id = p && p.edges && p.edges[0];
        if (id) openEdgeEvidence(scope, String(id));
      });

      network.on('click', function(p){
        if (!p || (!(p.nodes && p.nodes.length) && !(p.edges && p.edges.length))) {
          st.sel = '';
          st.selKeys = [];
          st.hoverKey = '';
          applyFocusVis(scope);
          var ctx = document.getElementById('vkxLcCtx');
          if (ctx) ctx.style.display = 'none';
        }
      });

      applyFocusVis(scope);
      try { network.fit({ animation: { duration: 220 } }); } catch(e) {}
    }

    function initLc(scope, id){
      var data = safeParse(id);
      if (!data) return;
      buildLcVis(scope, data);
    }

    initLc('photo', 'vkxLcDataPhoto');
    initLc('video', 'vkxLcDataVideo');
    initLc('observed', 'vkxLcDataObserved');
    try { bindOfflineLcContextMenu(); } catch(e) {}

    try { initPhotoSnapshotMap(); } catch(e) {}
    try { bindOfflineCardsAndMedia(); } catch(e) {}
    try { bindOfflineMediaZoomInteractions(); } catch(e) {}
    try { initGroupOverviewSnapshotMap(); } catch(e) {}
    try { initRelationsSnapshotMap(); } catch(e) {}
    try { initPeopleSnapshotMaps(); } catch(e) {}
    try { initFamilyTreeSnapshot(); } catch(e) {}
    try { initWallMapSnapshot(); } catch(e) {}

    try { window.setTimeout(refreshOfflineView, 80); } catch(e) {}
    try { window.setTimeout(refreshOfflineView, 260); } catch(e) {}
    try {
      document.addEventListener('change', function(ev){
        var tt = ev.target;
        if (tt && tt.id && /^tab-/.test(String(tt.id))) {
          window.setTimeout(refreshOfflineView, 90);
        }
      });
    } catch(e) {}
    try {
      document.addEventListener('click', function(ev){
        var tt = ev.target;
        var lab = tt && tt.closest ? tt.closest('label[for^="tab-"]') : null;
        if (lab) window.setTimeout(refreshOfflineView, 90);
      });
    } catch(e) {}
    try {
      window.addEventListener('resize', function(){
        window.setTimeout(refreshOfflineView, 80);
      });
    } catch(e) {}

        // Offline controls (data-lc2-*)
    function snapLc(scope){
      return (window.__vkxSnapLc && window.__vkxSnapLc[scope]) ? window.__vkxSnapLc[scope] : null;
    }

    function snapLcSyncButtons(scope){
      var st = snapLc(scope);
      if (!st) return;

      var btnFocus = document.querySelector('[data-lc2-focus="'+scope+'"]');
      if (btnFocus) btnFocus.textContent = st.focusOn ? offT('linkChartFocusOn') : offT('linkChartFocusOff');

      var btnDepth = document.querySelector('[data-lc2-depth="'+scope+'"]');
      if (btnDepth) btnDepth.textContent = Number(st.focusDepth) === 1 ? offT('linkChartDepth1') : offT('linkChartDepth2');

      var btnMove = document.querySelector('[data-lc2-move="'+scope+'"]');
      if (btnMove) btnMove.textContent = st.movable ? offT('linkChartMoveOn') : offT('linkChartMoveOff');
    }

    // Sync buttons after initial rehydrate
    try { snapLcSyncButtons('photo'); } catch(e) {}
    try { snapLcSyncButtons('video'); } catch(e) {}
    try { snapLcSyncButtons('observed'); } catch(e) {}

    document.addEventListener('click', function(ev){
      var t = ev.target;
      if (!t || !t.closest) return;

      // Modal close
      var mm = ensureLcModal();
      if (mm.modal && (t === mm.modal || t.closest('[data-lc-modal-close="1"]'))) {
        mm.modal.classList.remove('open');
        mm.modal.setAttribute('aria-hidden','true');
        if (mm.body) mm.body.innerHTML = '';
        return;
      }

      var b, scope, st, dataId, data;

      // Generate / rebuild
      b = t.closest('[data-lc2-generate]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-generate') || '');
        dataId = (scope === 'photo') ? 'vkxLcDataPhoto' : 'vkxLcDataVideo';
        data = safeParse(dataId);
        if (!data) return;

        // Preserve user toggles/selection (vis mode)
        st = snapLc(scope);
        if (st && typeof st.movable === 'boolean') data.movable = st.movable;
        if (st && typeof st.focusOn === 'boolean') data.focusOn = st.focusOn;
        if (st && st.focusDepth) data.focusDepth = st.focusDepth;
        if (st && st.sel != null) data.sel = st.sel;

        buildLcVis(scope, data);
        snapLcSyncButtons(scope);
        return;
      }

      // Focus toggle
      b = t.closest('[data-lc2-focus]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-focus') || '');
        st = snapLc(scope);
        if (!st) return;
        st.focusOn = !st.focusOn;
        applyFocusVis(scope);
        snapLcSyncButtons(scope);
        return;
      }

      // Depth toggle
      b = t.closest('[data-lc2-depth]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-depth') || '');
        st = snapLc(scope);
        if (!st) return;
        st.focusDepth = (Number(st.focusDepth) === 2) ? 1 : 2;
        applyFocusVis(scope);
        snapLcSyncButtons(scope);
        return;
      }

      // Move toggle
      b = t.closest('[data-lc2-move]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-move') || '');
        st = snapLc(scope);
        if (!st) return;
        st.movable = !st.movable;
        try { if (st.network && st.network.setOptions) st.network.setOptions({ interaction: { dragNodes: !!st.movable } }); } catch(e) {}
        snapLcSyncButtons(scope);
        return;
      }

      // Fit (reset scale + small settle)
      b = t.closest('[data-lc2-fit]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-fit') || '');
        st = snapLc(scope);
        if (!st) return;
        st.scale = 1;
        try { if (st.network && st.network.fit) st.network.fit({ animation: { duration: 220 } }); } catch(e) {}
        return;
      }

      // Zoom in/out
      b = t.closest('[data-lc2-zoom-in]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-zoom-in') || '');
        st = snapLc(scope);
        if (!st) return;
        try {
          var cur = (st.network && st.network.getScale) ? Number(st.network.getScale() || 1) : 1;
          var next = Math.max(0.2, Math.min(3.0, cur * 1.12));
          if (st.network && st.network.moveTo) st.network.moveTo({ scale: next, animation: { duration: 140 } });
        } catch(e) {}
        return;
      }
      b = t.closest('[data-lc2-zoom-out]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-zoom-out') || '');
        st = snapLc(scope);
        if (!st) return;
        try {
          var cur = (st.network && st.network.getScale) ? Number(st.network.getScale() || 1) : 1;
          var next = Math.max(0.2, Math.min(3.0, cur / 1.12));
          if (st.network && st.network.moveTo) st.network.moveTo({ scale: next, animation: { duration: 140 } });
        } catch(e) {}
        return;
      }

      // Clear selection
      b = t.closest('[data-lc2-clear]');
      if (b) {
        scope = String(b.getAttribute('data-lc2-clear') || '');
        st = snapLc(scope);
        if (!st) return;
        st.sel = '';
        try { if (st.network && st.network.unselectAll) st.network.unselectAll(); } catch(e) {}
        applyFocusVis(scope);
        return;
      }
    });

    // -------------------------
    // Wall timeline snapshot runtime
    // -------------------------
    // Legacy duplicate snapshot wall block removed. The parity/runtime implementation below is the single source of truth.
    function wallSnapEsc(v){
      return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){
        return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch] || ch;
      });
    }

    function wallSnapParse(){
      return safeParse('vkxWallSnapData');
    }

    function wallSnapState(data){
      var seed = (data && data.state) || {};
      if (!window.__vkxSnapWallState) {
        window.__vkxSnapWallState = {
          query: String(seed.query || ''),
          visible: Math.max(24, Number(seed.visible || 24)),
          timeZoom: (seed.timeZoom === 'day' || seed.timeZoom === 'year') ? seed.timeZoom : 'month',
          timeViewKeys: Array.isArray(seed.timeViewKeys) ? seed.timeViewKeys.slice() : [],
          selectedTimeKeys: Array.isArray(seed.selectedTimeKeys) ? seed.selectedTimeKeys.slice() : [],
          locationKey: String(seed.locationKey || ''),
          locationKeys: Array.isArray(seed.locationKeys) ? seed.locationKeys.slice() : [],
          locationLabel: String(seed.locationLabel || ''),
          selectedPostId: Number(seed.selectedPostId || 0) || 0,
          openPostId: Number(seed.openPostId || 0) || 0,
          interactionTab: String(seed.interactionTab || 'comments') === 'likes' ? 'likes' : 'comments'
        };
      }
      return window.__vkxSnapWallState;
    }

    function wallSnapNormalizeQuery(q){
      return String(q || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function wallSnapMonthShort(idx){
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx] || '';
    }

    function wallSnapStartOfDay(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0); }
    function wallSnapStartOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0); }
    function wallSnapStartOfYear(d){ return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0); }

    function wallSnapBucketStart(d, zoom){
      if (zoom === 'year') return wallSnapStartOfYear(d);
      if (zoom === 'month') return wallSnapStartOfMonth(d);
      return wallSnapStartOfDay(d);
    }

    function wallSnapStep(start, zoom){
      var next = new Date(start);
      if (zoom === 'year') next.setFullYear(start.getFullYear() + 1);
      else if (zoom === 'month') next.setMonth(start.getMonth() + 1);
      else next.setDate(start.getDate() + 1);
      return next;
    }

    function wallSnapBucketFromStart(start, zoom){
      var end = wallSnapStep(start, zoom);

      if (zoom === 'year') {
        return {
          key: String(start.getFullYear()),
          label: String(start.getFullYear()),
          shortLabel: String(start.getFullYear()),
          startTs: Math.floor(start.getTime() / 1000),
          endTs: Math.floor(end.getTime() / 1000),
          count: 0
        };
      }

      if (zoom === 'month') {
        return {
          key: start.getFullYear() + '-' + String(start.getMonth() + 1).padStart(2, '0'),
          label: wallSnapMonthShort(start.getMonth()) + ' ' + start.getFullYear(),
          shortLabel: wallSnapMonthShort(start.getMonth()),
          startTs: Math.floor(start.getTime() / 1000),
          endTs: Math.floor(end.getTime() / 1000),
          count: 0
        };
      }

      return {
        key: start.getFullYear() + '-' + String(start.getMonth() + 1).padStart(2, '0') + '-' + String(start.getDate()).padStart(2, '0'),
        label: String(start.getDate()).padStart(2, '0') + ' ' + wallSnapMonthShort(start.getMonth()) + ' ' + start.getFullYear(),
        shortLabel: String(start.getDate()).padStart(2, '0'),
        startTs: Math.floor(start.getTime() / 1000),
        endTs: Math.floor(end.getTime() / 1000),
        count: 0
      };
    }

    function wallSnapBucketForTs(ts, zoom){
      ts = Number(ts || 0);
      if (!Number.isFinite(ts) || ts <= 0) return null;
      return wallSnapBucketFromStart(wallSnapBucketStart(new Date(ts * 1000), zoom), zoom);
    }

    function wallSnapTimelineBuckets(posts, zoom, range){
      var dated = (Array.isArray(posts) ? posts : []).map(function(p){
        return Number(p && p.date || 0) || 0;
      }).filter(function(ts){
        return Number.isFinite(ts) && ts > 0;
      });
      if (!dated.length) return [];

      var rangeStartTs = Number(range && range.startTs || 0) || 0;
      var rangeEndTs = Number(range && range.endTs || 0) || 0;
      var hasRange = Number.isFinite(rangeStartTs) && Number.isFinite(rangeEndTs) && rangeStartTs > 0 && rangeEndTs > rangeStartTs;

      var minTs = Math.min.apply(Math, dated);
      var maxTs = Math.max.apply(Math, dated);

      if (hasRange) {
        minTs = Math.max(minTs, rangeStartTs);
        maxTs = Math.min(maxTs, Math.max(rangeStartTs, rangeEndTs - 1));
      }
      if (!Number.isFinite(minTs) || !Number.isFinite(maxTs) || maxTs < minTs) return [];

      var start = wallSnapBucketStart(new Date(minTs * 1000), zoom);
      var endSourceTs = hasRange ? Math.max(minTs, rangeEndTs - 1) : maxTs;
      var end = wallSnapBucketStart(new Date(endSourceTs * 1000), zoom);

      if (zoom === 'month') {
        var startYearTs = hasRange ? rangeStartTs : minTs;
        var endYearTs = hasRange ? Math.max(rangeStartTs, rangeEndTs - 1) : maxTs;
        start = wallSnapStartOfYear(new Date(startYearTs * 1000));
        end = wallSnapStartOfMonth(new Date(new Date(endYearTs * 1000).getFullYear(), 11, 1, 0, 0, 0, 0));
      }

      var rows = [];
      var byKey = {};
      var cursor = new Date(start);

      while (cursor.getTime() <= end.getTime()) {
        var bucket = wallSnapBucketFromStart(new Date(cursor), zoom);
        rows.push(bucket);
        byKey[bucket.key] = bucket;

        var next = wallSnapStep(cursor, zoom);
        if (next.getTime() <= cursor.getTime()) break;
        cursor.setTime(next.getTime());
      }

      dated.forEach(function(ts){
        if (hasRange && (ts < rangeStartTs || ts >= rangeEndTs)) return;
        var bucket = wallSnapBucketForTs(ts, zoom);
        if (bucket && byKey[bucket.key]) byKey[bucket.key].count++;
      });

      return rows;
    }

    function wallSnapRangeForKeys(posts, zoom, keys){
      if (!Array.isArray(keys) || !keys.length) return null;
      var rows = wallSnapTimelineBuckets(posts, zoom).filter(function(r){ return keys.indexOf(r.key) >= 0; });
      if (!rows.length) return null;
      return {
        startTs: Math.min.apply(Math, rows.map(function(r){ return r.startTs; })),
        endTs: Math.max.apply(Math, rows.map(function(r){ return r.endTs; }))
      };
    }

    function wallSnapRecommendedTimelineZoom(posts){
      var dated = (Array.isArray(posts) ? posts : []).map(function(p){
        return Number(p && p.date || 0) || 0;
      }).filter(function(ts){
        return Number.isFinite(ts) && ts > 0;
      });
      if (!dated.length) return 'month';
      var minD = new Date(Math.min.apply(Math, dated) * 1000);
      var maxD = new Date(Math.max.apply(Math, dated) * 1000);
      return maxD.getFullYear() > minD.getFullYear() ? 'year' : 'month';
    }

    function wallSnapTimelineZoomOrder(posts){
      return wallSnapRecommendedTimelineZoom(posts) === 'year' ? ['year', 'month', 'day'] : ['month', 'day'];
    }

    function wallSnapTranslateSelection(posts, fromZoom, keys, toZoom){
      if (!Array.isArray(keys) || !keys.length || fromZoom === toZoom) return Array.isArray(keys) ? keys.slice() : [];
      var oldRows = wallSnapTimelineBuckets(posts, fromZoom).filter(function(r){ return keys.indexOf(r.key) >= 0; });
      if (!oldRows.length) return [];
      return wallSnapTimelineBuckets(posts, toZoom).filter(function(n){
        return oldRows.some(function(o){ return n.startTs < o.endTs && n.endTs > o.startTs; });
      }).map(function(n){ return n.key; });
    }

    function wallSnapExpandViewport(posts, fromZoom, keys, toZoom){
      if (!Array.isArray(keys) || !keys.length) return [];

      if (fromZoom === 'day' && toZoom === 'month') {
        var oldRows = wallSnapTimelineBuckets(posts, 'day').filter(function(r){ return keys.indexOf(r.key) >= 0; });
        if (!oldRows.length) return [];
        var years = {};
        oldRows.forEach(function(r){ years[new Date(r.startTs * 1000).getFullYear()] = true; });
        return wallSnapTimelineBuckets(posts, 'month').filter(function(r){
          return years[new Date(r.startTs * 1000).getFullYear()];
        }).map(function(r){ return r.key; });
      }

      if (fromZoom === 'month' && toZoom === 'year') {
        return wallSnapTimelineBuckets(posts, 'year').map(function(r){ return r.key; });
      }

      return wallSnapTranslateSelection(posts, fromZoom, keys, toZoom);
    }

    function wallSnapRowsForState(posts, st){
      var rows = wallSnapTimelineBuckets(posts, st.timeZoom);
      var viewKeys = Array.isArray(st.timeViewKeys) ? st.timeViewKeys : [];
      if (!viewKeys.length) return rows;
      var range = wallSnapRangeForKeys(posts, st.timeZoom, viewKeys);
      if (!range) return [];
      return wallSnapTimelineBuckets(posts, st.timeZoom, range);
    }

    function wallSnapRangeKeys(posts, st, anchorKey, currentKey){
      var rows = wallSnapRowsForState(posts, st);
      var a = rows.findIndex(function(r){ return r.key === anchorKey; });
      var b = rows.findIndex(function(r){ return r.key === currentKey; });
      if (a < 0 || b < 0) return currentKey ? [currentKey] : [];
      var lo = Math.min(a, b);
      var hi = Math.max(a, b);
      return rows.slice(lo, hi + 1).map(function(r){ return r.key; });
    }

    function wallSnapMatchesTimeline(post, st){
      var keys = Array.isArray(st.selectedTimeKeys) ? st.selectedTimeKeys : [];
      if (!keys.length) return true;
      var bucket = wallSnapBucketForTs(Number(post && post.date || 0) || 0, st.timeZoom);
      return !!bucket && keys.indexOf(bucket.key) >= 0;
    }

    function wallSnapMatchesLocation(post, st){
      var wanted = Array.isArray(st.locationKeys)
        ? st.locationKeys.map(function(x){ return wallSnapNormalizeQuery(x); }).filter(Boolean)
        : [];
      if (!wanted.length) {
        var single = wallSnapNormalizeQuery(st.locationKey || '');
        if (!single) return true;
        wanted.push(single);
      }
      return wanted.indexOf(wallSnapNormalizeQuery(post && post.locationKey || '')) >= 0;
    }

    function wallSnapZoomLabel(zoom){
      if (zoom === 'day') return offT('timelineZoomDays');
      if (zoom === 'month') return offT('timelineZoomMonths');
      return offT('timelineZoomYears');
    }

    function wallSnapActiveFilterStripHtml(st, posts){
      var hasTime = Array.isArray(st.selectedTimeKeys) && st.selectedTimeKeys.length > 0;
      var hasLoc = !!wallSnapNormalizeQuery(st.locationKey || '');
      if (!hasTime && !hasLoc) return '';

      var timeScoped = posts.filter(function(p){ return wallSnapMatchesTimeline(p, st); });
      var locationScoped = posts.filter(function(p){ return wallSnapMatchesLocation(p, st); });
      var locationExcluded = hasLoc ? timeScoped.filter(function(p){ return !String(p.locationKey || '').trim(); }).length : 0;

      var pills = '';
      if (hasTime) pills += '<span class="pill">' + offT('timeLabel') + ': ' + st.selectedTimeKeys.length + ' ' + wallSnapZoomLabel(st.timeZoom).toLowerCase() + ' ' + (st.selectedTimeKeys.length === 1 ? offT('timeBucketSingular') : offT('timeBucketPlural')) + '</span>';
      if (hasLoc) pills += '<span class="pill muted">' + offT('locationLabel') + ': ' + wallSnapEsc(st.locationLabel || offT('selectedPlace')) + '</span>';

      var notes = hasLoc
        ? '<div class="muted" style="margin-top:8px;">' + offT('locationFilterActivePosts', { count: String(locationScoped.length) }) + (locationExcluded ? (' ' + offT('noLocationPostsExcluded', { count: String(locationExcluded) })) : '') + '</div>'
        : '';

      return '<div class="sectionCard" style="margin:0 0 12px 0;padding:10px 12px;">' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;">' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' + pills + '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
            (hasTime ? '<button class="actionBtn" type="button" data-wall-time-clear="1">' + offT('clearTimeFilter') + '</button>' : '') +
            (hasLoc ? '<button class="actionBtn" type="button" data-wall-location-clear="1">' + offT('clearLocationFilter') + '</button>' : '') +
          '</div>' +
        '</div>' +
        notes +
      '</div>';
    }

    function wallSnapTimelineHtml(posts, st){
      var rows = wallSnapRowsForState(posts, st);
      if (!rows.length) {
        return '<div class="sectionCard" style="margin:0 0 12px 0;padding:12px 14px;">' +
          '<div class="sectionTitle" style="margin:0 0 6px 0;">' + offT('timelineFilterTitle') + '</div>' +
          '<div class="sectionSub">' + offT('noDatedPostsTimeline') + '</div>' +
        '</div>';
      }

      var selected = new Set(Array.isArray(st.selectedTimeKeys) ? st.selectedTimeKeys : []);
      var max = Math.max.apply(Math, rows.map(function(r){ return r.count; }).concat([1]));
      var width = Math.max(720, rows.length * 18);
      var height = 150;
      var chartTop = 10;
      var chartHeight = 88;
      var baselineY = chartTop + chartHeight;
      var barSlot = width / rows.length;
      var barW = Math.max(8, barSlot - 3);
      var labelEvery = st.timeZoom === 'day'
        ? Math.max(1, Math.ceil(rows.length / 16))
        : (st.timeZoom === 'month' ? Math.max(1, Math.ceil(rows.length / 12)) : 1);

      var selectedPostCount = rows.filter(function(r){ return selected.has(r.key); }).reduce(function(sum, r){ return sum + r.count; }, 0);
      var summary = selected.size
        ? offT('selectedBucketsSummary', { count: String(selected.size), bucketLabel: wallSnapZoomLabel(st.timeZoom).toLowerCase(), suffix: (selected.size === 1 ? '' : 's'), posts: String(selectedPostCount) })
        : offT('noTimeFilterSelectedSummary');

      var gridLines = [0.25, 0.5, 0.75, 1].map(function(ratio){
        var y = chartTop + Math.round((1 - ratio) * chartHeight);
        return '<line x1="0" y1="' + y + '" x2="' + width + '" y2="' + y + '" stroke="rgba(255,255,255,0.08)" stroke-width="1" />';
      }).join('');

      var bars = rows.map(function(r, i){
        var x = Math.round(i * barSlot + ((barSlot - barW) / 2));
        var active = selected.has(r.key);
        var h = r.count > 0 ? Math.max(10, Math.round((r.count / max) * chartHeight)) : 0;
        var y = baselineY - h;
        var slotX = Math.round(i * barSlot);
        var slotW = Math.max(10, Math.round(barSlot));
        var visibleBar = h > 0
          ? '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" rx="4" fill="' + (active ? 'rgba(99,102,241,0.96)' : 'rgba(99,102,241,0.48)') + '" stroke="' + (active ? 'rgba(191,219,254,0.95)' : 'rgba(255,255,255,0.10)') + '" stroke-width="' + (active ? 2 : 1) + '" />'
          : '';

        return '<g data-wall-time-key="' + wallSnapEsc(r.key) + '" style="cursor:pointer">' +
          '<title>' + wallSnapEsc(offT('titlePostsCount', { label: r.label, count: String(r.count) })) + '</title>' +
          '<rect x="' + slotX + '" y="' + chartTop + '" width="' + slotW + '" height="' + chartHeight + '" fill="rgba(0,0,0,0)" />' +
          visibleBar +
        '</g>';
      }).join('');

      var labels = rows.map(function(r, i){
        if (i % labelEvery !== 0 && i !== rows.length - 1) return '';
        var x = Math.round(i * barSlot + (barSlot / 2));
        var labelText = st.timeZoom === 'month' ? r.label : r.shortLabel;
        return '<text x="' + x + '" y="' + (height - 16) + '" text-anchor="middle" font-size="10" fill="rgba(231,238,252,0.72)">' + wallSnapEsc(labelText) + '</text>';
      }).join('');

      return '<div class="sectionCard" style="margin:0 0 12px 0;padding:12px 14px;">' +
        '<div class="sectionHead" style="margin:0 0 8px 0;">' +
          '<div>' +
            '<div class="sectionTitle" style="margin:0;">' + offT('timelineFilterTitle') + '</div>' +
            '<div class="sectionSub">' + offT('timelineFilterHint') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
            '<span class="pill muted">' + wallSnapEsc(offT('zoomLabel', { value: wallSnapZoomLabel(st.timeZoom) })) + '</span>' +
            (selected.size ? '<button class="actionBtn" type="button" data-wall-time-clear="1">' + offT('clearTimeFilter') + '</button>' : '') +
          '</div>' +
        '</div>' +
        '<div id="vkxWallTimelineChart" data-wall-timeline="1" style="width:100%;overflow:hidden;user-select:none;">' +
          '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" height="' + height + '" preserveAspectRatio="none" style="display:block;">' +
            gridLines +
            '<line x1="0" y1="' + baselineY + '" x2="' + width + '" y2="' + baselineY + '" stroke="rgba(255,255,255,0.12)" stroke-width="1" />' +
            bars + labels +
          '</svg>' +
        '</div>' +
        '<div class="muted" style="margin-top:8px;">' + wallSnapEsc(summary) + '</div>' +
      '</div>';
    }

    function wallSnapCardHtml(data, postId, st){
      var pid = String(postId || '');
      if (Number(st.openPostId || 0) === Number(postId || 0)) {
        return (String(st.interactionTab || 'comments') === 'likes'
          ? ((data.cardsLikesById || {})[pid])
          : ((data.cardsCommentsById || {})[pid])) || ((data.cardsClosedById || {})[pid]) || '';
      }
      return ((data.cardsClosedById || {})[pid]) || '';
    }

    function initWallSnapshotRuntime(){
      if (window.__vkxSnapWallInitDone) return;
      window.__vkxSnapWallInitDone = true;

      var data = wallSnapParse();
      if (!data || !Array.isArray(data.posts)) return;

      var timelineHost = document.getElementById('vkxWallTimelineHost');
      var searchEl = document.getElementById('vkxWallSearch');
      var listEl = document.getElementById('vkxWallPostList');
      var metaEl = document.getElementById('vkxWallListMeta');
      var moreEl = document.getElementById('vkxWallListMore');
      if (!timelineHost || !searchEl || !listEl || !metaEl || !moreEl) return;

      var st = wallSnapState(data);
      var posts = data.posts.slice();

      function render(){
        var locationScoped = posts.filter(function(p){ return wallSnapMatchesLocation(p, st); });
        var order = wallSnapTimelineZoomOrder(locationScoped);
        if (!order.length) order = ['month', 'day'];
        if (order.indexOf(st.timeZoom) < 0) st.timeZoom = order[0];

        timelineHost.innerHTML = wallSnapActiveFilterStripHtml(st, posts) + wallSnapTimelineHtml(locationScoped, st);

        var timelineChartEl = document.getElementById('vkxWallTimelineChart');
        if (timelineChartEl) {
          timelineChartEl.onwheel = function(ev){
            ev.preventDefault();

            var curIdx = Math.max(0, order.indexOf(st.timeZoom || order[0] || 'month'));
            var nextIdx = ev.deltaY < 0 ? Math.min(order.length - 1, curIdx + 1) : Math.max(0, curIdx - 1);
            if (nextIdx === curIdx) return;

            var hoverBar = ev.target && ev.target.closest ? ev.target.closest('[data-wall-time-key]') : null;
            var hoverKey = hoverBar ? String(hoverBar.getAttribute('data-wall-time-key') || '') : '';
            var nextZoom = order[nextIdx];
            var zoomingIn = nextIdx > curIdx;

            var baseViewKeys = zoomingIn
              ? (hoverKey ? [hoverKey] : [])
              : ((Array.isArray(st.timeViewKeys) && st.timeViewKeys.length) ? st.timeViewKeys.slice() : (hoverKey ? [hoverKey] : []));

            var baseSelectedKeys = Array.isArray(st.selectedTimeKeys) && st.selectedTimeKeys.length
              ? st.selectedTimeKeys.slice()
              : [];

            st.timeViewKeys = zoomingIn
              ? wallSnapTranslateSelection(locationScoped, st.timeZoom, baseViewKeys, nextZoom)
              : wallSnapExpandViewport(locationScoped, st.timeZoom, baseViewKeys, nextZoom);

            st.selectedTimeKeys = baseSelectedKeys.length
              ? wallSnapTranslateSelection(locationScoped, st.timeZoom, baseSelectedKeys, nextZoom)
              : [];

            st.timeZoom = nextZoom;
            st.visible = 24;
            render();
          };

          timelineChartEl.onmousedown = function(ev){
            var rawTarget = ev.target || null;
            var bar = rawTarget && rawTarget.closest ? rawTarget.closest('[data-wall-time-key]') : null;
            if (!bar) return;

            ev.preventDefault();

            var anchorKey = String(bar.getAttribute('data-wall-time-key') || '');
            if (!anchorKey) return;

            var additive = !!(ev.ctrlKey || ev.metaKey);
            var baseKeys = additive ? (Array.isArray(st.selectedTimeKeys) ? st.selectedTimeKeys.slice() : []) : [];

            var applyRange = function(currentKey){
              var rangeKeys = wallSnapRangeKeys(locationScoped, st, anchorKey, currentKey);
              st.selectedTimeKeys = additive
                ? Array.from(new Set(baseKeys.concat(rangeKeys)))
                : rangeKeys.slice();
              st.visible = 24;
              render();
            };

            window.__vkxSnapWallTimeDragging = true;
            window.__vkxSnapWallTimeAnchorKey = anchorKey;
            window.__vkxSnapWallTimeDragLastKey = anchorKey;
            applyRange(anchorKey);

            var onMove = function(me){
              if (!window.__vkxSnapWallTimeDragging) return;
              var el = document.elementFromPoint(me.clientX, me.clientY);
              var hit = el && el.closest ? el.closest('[data-wall-time-key]') : null;
              if (!hit) return;
              var currentKey = String(hit.getAttribute('data-wall-time-key') || '');
              if (!currentKey || currentKey === window.__vkxSnapWallTimeDragLastKey) return;
              window.__vkxSnapWallTimeDragLastKey = currentKey;
              applyRange(currentKey);
            };

            var onUp = function(){
              document.removeEventListener('mousemove', onMove);
              document.removeEventListener('mouseup', onUp);
              window.__vkxSnapWallTimeDragging = false;
              window.__vkxSnapWallTimeSuppressClick = true;
              window.setTimeout(function(){ window.__vkxSnapWallTimeSuppressClick = false; }, 0);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
          };
        }

        searchEl.value = String(st.query || '');
        searchEl.oninput = function(){
          st.query = String(searchEl.value || '');
          st.visible = 24;
          render();
        };

        var timeFiltered = locationScoped.filter(function(p){ return wallSnapMatchesTimeline(p, st); });
        var q = wallSnapNormalizeQuery(st.query);
        var filtered = q
          ? timeFiltered.filter(function(p){ return String(p.search || '').indexOf(q) >= 0; })
          : timeFiltered;

        var visible = Math.min(Math.max(24, Number(st.visible || 24)), filtered.length);
        var visiblePosts = filtered.slice(0, visible);

        metaEl.innerHTML = '<span class="muted">' + offT(st.query ? 'showingMatchingPosts' : 'showingFilteredPosts', { shown: String(visiblePosts.length), total: String(filtered.length) }) +
          (st.locationKey ? (' • ' + offT('locationLabel') + ': ' + wallSnapEsc(st.locationLabel || offT('selectedPlace'))) : '') +
          (st.query ? (' • ' + offT('searchLabel') + ': "' + wallSnapEsc(st.query) + '"') : '') +
          '</span>';

        listEl.innerHTML = visiblePosts.length
          ? visiblePosts.map(function(p){ return wallSnapCardHtml(data, p.id, st); }).join('')
          : '<div class="empty">' + offT('noPostsMatchCurrentWallFilters') + '</div>';

        moreEl.innerHTML = visiblePosts.length < filtered.length
          ? ('<div class="muted" style="margin-bottom:8px;">' + offT('showingPostsProgress', { shown: String(visiblePosts.length), total: String(filtered.length) }) + '</div><button class="actionBtn" type="button" data-wall-load-more="1">' + offT('loadMorePosts') + '</button>')
          : (filtered.length ? ('<div class="muted">' + offT('showingAllPosts', { total: String(filtered.length) }) + '</div>') : '');

        try { bindLocalFirstMedia(listEl); } catch(e) {}
        try { if (OFFLINE_MAPS.wall && typeof OFFLINE_MAPS.wall.syncState === 'function') OFFLINE_MAPS.wall.syncState(); } catch(e) {}
      }

      window.__vkxSnapWallRender = render;

      document.addEventListener('click', function(ev){
        var t = ev.target;
        if (!t || !t.closest) return;

        var clearTimeBtn = t.closest('[data-wall-time-clear="1"]');
        if (clearTimeBtn) {
          ev.preventDefault();
          ev.stopPropagation();
          st.selectedTimeKeys = [];
          st.timeViewKeys = [];
          window.__vkxSnapWallTimeAnchorKey = '';
          st.visible = 24;
          render();
          return;
        }

        var clearLocBtn = t.closest('[data-wall-location-clear="1"]');
        if (clearLocBtn) {
          ev.preventDefault();
          ev.stopPropagation();
          st.locationKey = '';
          st.locationKeys = [];
          st.locationLabel = '';
          st.timeViewKeys = [];
          st.visible = 24;
          render();
          return;
        }

        var bar = t.closest('[data-wall-time-key]');
        if (bar) {
          ev.preventDefault();
          ev.stopPropagation();
          if (window.__vkxSnapWallTimeSuppressClick) return;

          var locationScoped = posts.filter(function(p){ return wallSnapMatchesLocation(p, st); });
          var key = String(bar.getAttribute('data-wall-time-key') || '');
          if (!key) return;

          var isShift = !!ev.shiftKey;
          var anchor = String(window.__vkxSnapWallTimeAnchorKey || '');

          if (isShift && anchor) {
            st.selectedTimeKeys = wallSnapRangeKeys(locationScoped, st, anchor, key);
          } else {
            var set = new Set(Array.isArray(st.selectedTimeKeys) ? st.selectedTimeKeys : []);
            if (set.has(key)) set.delete(key);
            else set.add(key);
            st.selectedTimeKeys = Array.from(set);
            window.__vkxSnapWallTimeAnchorKey = key;
          }

          st.visible = 24;
          render();
          return;
        }

        var moreBtn = t.closest('[data-wall-load-more="1"]');
        if (moreBtn) {
          ev.preventDefault();
          ev.stopPropagation();
          st.visible = Math.max(24, Number(st.visible || 24)) + 24;
          render();
          return;
        }

        var mediaBtn = t.closest('[data-wall-open-media="1"]');
        if (mediaBtn) {
          ev.preventDefault();
          ev.stopPropagation();

          var kind = String(mediaBtn.getAttribute('data-wall-media-kind') || '');
          var src = String(mediaBtn.getAttribute('data-wall-media-src') || '').trim();
          var href = String(mediaBtn.getAttribute('data-wall-media-href') || '').trim();

          if (kind === 'photo' && (src || href)) {
            openLightbox(src || href, '', href || '');
            return;
          }

          if (href) {
            try { window.open(href, '_blank', 'noreferrer'); } catch(e) {}
            return;
          }
        }

        var toggleBtn = t.closest('[data-wall-toggle-detail="1"]');
        if (toggleBtn) {
          ev.preventDefault();
          ev.stopPropagation();

          var pid = Number(toggleBtn.getAttribute('data-post-id'));
          if (!Number.isFinite(pid) || pid <= 0) return;

          st.selectedPostId = pid;
          st.openPostId = (Number(st.openPostId || 0) === pid) ? 0 : pid;
          if (!st.openPostId) st.interactionTab = 'comments';
          render();
          return;
        }

        var tabBtn = t.closest('[data-wall-inter-tab]');
        if (tabBtn) {
          ev.preventDefault();
          ev.stopPropagation();

          var pid2 = Number(tabBtn.getAttribute('data-post-id'));
          var tab = String(tabBtn.getAttribute('data-wall-inter-tab') || '') === 'likes' ? 'likes' : 'comments';
          if (!Number.isFinite(pid2) || pid2 <= 0) return;

          st.selectedPostId = pid2;
          st.openPostId = pid2;
          st.interactionTab = tab;
          render();
          return;
        }
      });

      render();
    }

    try { initWallSnapshotRuntime(); } catch(e) {}

    // ESC closes modal (snapshot)
    document.addEventListener('keydown', function(e){
      if (e && e.key === 'Escape') {
        try { closeOfflineLcBox(); } catch(e2) {}

        try {
          var embedModal2 = document.getElementById('vkxSnapEmbedModal');
          if (embedModal2) {
            var ifr2 = embedModal2.querySelector('iframe');
            if (ifr2) ifr2.setAttribute('src', '');
            embedModal2.classList.remove('open');
            embedModal2.setAttribute('aria-hidden', 'true');
          }
        } catch(e2) {}

        try { closeOfflineWideRows(); } catch(e2) {}

        var mm2 = ensureLcModal();
        if (mm2.modal) {
          mm2.modal.classList.remove('open');
          mm2.modal.setAttribute('aria-hidden','true');
        }
        if (mm2.body) mm2.body.innerHTML = '';
      }
    });

})();
