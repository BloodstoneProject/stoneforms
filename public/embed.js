/*!
 * Stoneforms embed loader
 * Paste once per page. Scans for [data-stoneform] elements and mounts the form
 * as an inline iframe, a popup modal, or a slide-over panel.
 *
 *   <div data-stoneform="FORM_ID_OR_SLUG" data-mode="inline"></div>
 *   <script src="https://stoneforms.vercel.app/embed.js" async></script>
 *
 * Modes: "inline" (default) | "popup" | "slider" / "drawer"
 * Self-contained, no globals leaked beyond a single guard flag, idempotent,
 * supports many embeds per page, and degrades to a plain link via <noscript>.
 */
(function () {
  'use strict';

  // Idempotency: never initialise twice (e.g. script included more than once).
  if (window.__stoneformsEmbedLoaded) return;
  window.__stoneformsEmbedLoaded = true;

  // Derive the canonical origin from this script's own src so the iframe and
  // loader always agree, regardless of which deploy served the script.
  var ORIGIN = (function () {
    try {
      var cur = document.currentScript;
      if (cur && cur.src) return new URL(cur.src).origin;
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i].src || '';
        if (s.indexOf('/embed.js') !== -1) return new URL(s).origin;
      }
    } catch (e) {}
    return window.location.origin;
  })();

  var INIT_ATTR = 'data-stoneform-init';

  function embedUrl(id) {
    return ORIGIN + '/embed/' + encodeURIComponent(id);
  }

  // Build a responsive iframe pointing at the chrome-less embed route.
  function makeIframe(id, opts) {
    opts = opts || {};
    var iframe = document.createElement('iframe');
    iframe.src = embedUrl(id);
    iframe.setAttribute('title', 'Stoneforms form');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'clipboard-write; fullscreen');
    iframe.setAttribute('data-stoneform-frame', id);
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.display = 'block';
    iframe.style.height = (opts.height || 600) + 'px';
    if (opts.fill) {
      iframe.style.height = '100%';
      iframe.style.flex = '1 1 auto';
    }
    return iframe;
  }

  // ---- inline ------------------------------------------------------------
  function mountInline(el, id) {
    var height = parseInt(el.getAttribute('data-height'), 10) || 600;
    var iframe = makeIframe(id, { height: height });
    iframe.style.borderRadius =
      el.getAttribute('data-radius') || '12px';
    // Clear any <noscript> fallback content, then mount.
    el.innerHTML = '';
    el.appendChild(iframe);
  }

  // ---- shared button -----------------------------------------------------
  function makeButton(label) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label || 'Open form';
    btn.style.cssText =
      'display:inline-block;cursor:pointer;font:inherit;font-weight:600;' +
      'padding:12px 24px;border-radius:10px;border:none;color:#fff;' +
      'background:#1c1917;line-height:1.2;';
    btn.addEventListener('mouseenter', function () {
      btn.style.background = '#292524';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.background = '#1c1917';
    });
    return btn;
  }

  // ---- popup -------------------------------------------------------------
  function mountPopup(el, id) {
    var label = el.getAttribute('data-button') || 'Open form';
    var btn = makeButton(label);
    el.innerHTML = '';
    el.appendChild(btn);

    btn.addEventListener('click', function () {
      var overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,0.55);' +
        'display:flex;align-items:center;justify-content:center;padding:16px;' +
        'opacity:0;transition:opacity .18s ease;';

      var panel = document.createElement('div');
      panel.style.cssText =
        'position:relative;width:100%;max-width:640px;height:80vh;max-height:760px;' +
        'background:#fff;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;' +
        'box-shadow:0 24px 60px rgba(0,0,0,0.35);transform:scale(.96);transition:transform .18s ease;';

      panel.appendChild(makeCloseButton(close));
      panel.appendChild(makeIframe(id, { fill: true }));
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      lockScroll(true);

      // animate in
      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        panel.style.transform = 'scale(1)';
      });

      function close() {
        overlay.style.opacity = '0';
        panel.style.transform = 'scale(.96)';
        window.setTimeout(function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          lockScroll(false);
          document.removeEventListener('keydown', onKey);
        }, 180);
      }
      function onKey(e) {
        if (e.key === 'Escape') close();
      }
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });
      document.addEventListener('keydown', onKey);
    });
  }

  // ---- slider / drawer ---------------------------------------------------
  function mountSlider(el, id) {
    var label = el.getAttribute('data-button') || 'Open form';
    var btn = makeButton(label);
    el.innerHTML = '';
    el.appendChild(btn);

    btn.addEventListener('click', function () {
      var overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,0.45);' +
        'opacity:0;transition:opacity .22s ease;';

      var panel = document.createElement('div');
      panel.style.cssText =
        'position:fixed;top:0;right:0;height:100%;width:100%;max-width:480px;' +
        'background:#fff;display:flex;flex-direction:column;overflow:hidden;' +
        'box-shadow:-12px 0 40px rgba(0,0,0,0.3);transform:translateX(100%);' +
        'transition:transform .26s cubic-bezier(.4,0,.2,1);z-index:2147483601;';

      panel.appendChild(makeCloseButton(close));
      panel.appendChild(makeIframe(id, { fill: true }));
      document.body.appendChild(overlay);
      document.body.appendChild(panel);
      lockScroll(true);

      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
      });

      function close() {
        overlay.style.opacity = '0';
        panel.style.transform = 'translateX(100%)';
        window.setTimeout(function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          if (panel.parentNode) panel.parentNode.removeChild(panel);
          lockScroll(false);
          document.removeEventListener('keydown', onKey);
        }, 260);
      }
      function onKey(e) {
        if (e.key === 'Escape') close();
      }
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', onKey);
    });
  }

  function makeCloseButton(onClose) {
    var x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.innerHTML = '&times;';
    x.style.cssText =
      'position:absolute;top:10px;right:12px;z-index:2;width:34px;height:34px;' +
      'border:none;border-radius:50%;background:rgba(0,0,0,0.06);color:#1c1917;' +
      'font-size:22px;line-height:1;cursor:pointer;';
    x.addEventListener('click', onClose);
    return x;
  }

  var _scrollLocked = 0;
  var _prevOverflow = '';
  function lockScroll(on) {
    if (on) {
      if (_scrollLocked === 0) {
        _prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      _scrollLocked++;
    } else {
      _scrollLocked = Math.max(0, _scrollLocked - 1);
      if (_scrollLocked === 0) document.body.style.overflow = _prevOverflow;
    }
  }

  // ---- auto-resize: listen for height reports from embed pages -----------
  window.addEventListener('message', function (e) {
    if (e.origin !== ORIGIN) return;
    var data = e.data;
    if (!data || data.type !== 'stoneforms:resize') return;
    var frames = document.querySelectorAll('iframe[data-stoneform-frame]');
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      // Only resize inline (non-fill) frames that match this form id.
      if (f.getAttribute('data-stoneform-frame') === String(data.formId) &&
          f.style.height.indexOf('%') === -1) {
        if (data.height && data.height > 0) {
          f.style.height = data.height + 'px';
        }
      }
    }
  });

  // ---- scan + mount ------------------------------------------------------
  function init() {
    var nodes = document.querySelectorAll('[data-stoneform]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute(INIT_ATTR) === '1') continue; // idempotent per-element
      var id = el.getAttribute('data-stoneform');
      if (!id) continue;
      el.setAttribute(INIT_ATTR, '1');
      var mode = (el.getAttribute('data-mode') || 'inline').toLowerCase();
      try {
        if (mode === 'popup' || mode === 'modal') mountPopup(el, id);
        else if (mode === 'slider' || mode === 'drawer' || mode === 'slideover') mountSlider(el, id);
        else mountInline(el, id);
      } catch (err) {
        // Defensive: leave the <noscript> fallback / existing content intact.
        el.removeAttribute(INIT_ATTR);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-scan for dynamically inserted embeds (SPA navigations, etc).
  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function () {
      init();
    });
    if (document.body) {
      mo.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        mo.observe(document.body, { childList: true, subtree: true });
      });
    }
  }
})();
