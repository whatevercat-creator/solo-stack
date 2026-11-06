/* Fresh loads of a #product link (e.g. from a pin): the browser scrolls to the
   card before the web fonts swap in, the text above it reflows, and the card
   ends up roughly 25px off (cut off at the top on phones, under the sticky
   header on desktop). Once fonts and the page have loaded, line the card up
   again using its scroll-margin-top, unless the reader has started scrolling. */
(function () {
  var id = location.hash.slice(1);
  if (!id) return;
  try { id = decodeURIComponent(id); } catch (e) {}
  var el, moved = false, root = document.documentElement;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    addEventListener(t, function () { moved = true; }, { once: true, passive: true, capture: true });
  });
  function align() {
    el = el || document.getElementById(id);
    if (!el || moved) return;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    el.scrollIntoView(true);
    root.style.scrollBehavior = prev;
  }
  function settle() { align(); setTimeout(align, 300); }
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var loaded = new Promise(function (r) {
    if (document.readyState === 'complete') r(); else addEventListener('load', r, { once: true });
  });
  Promise.all([fonts, loaded]).then(function () { setTimeout(settle, 0); });
})();
