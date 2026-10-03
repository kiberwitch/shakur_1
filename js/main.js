(function () {
  'use strict';

  var root = document.documentElement;
  function setZoom() {
    var w = root.clientWidth;
    if (w >= 1200) root.style.setProperty('--zoom', Math.min(w / 1200, 1.6).toFixed(4));
    else root.style.removeProperty('--zoom');
  }
  setZoom();
  window.addEventListener('resize', setZoom);

  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  function markMissing(img) {
    if (img.src === BLANK) return;
    img.setAttribute('data-missing', img.getAttribute('src'));
    img.title = 'Нет файла: ' + img.getAttribute('src');
    img.src = BLANK;
    img.classList.add('img-missing');
    var box = img.closest('.feature__img, .week__img, .channel, .who__art, .iv__cover, .case__proof');
    if (box) box.classList.add('img-missing');
  }
  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    img.addEventListener('error', function () { markMissing(img); });
  });

  var items = Array.prototype.slice.call(document.querySelectorAll('.qa'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el, from, to, done) {
    if (reduce) { done && done(); return; }
    el.style.overflow = 'hidden';
    var a = el.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    a.onfinish = function () { el.style.overflow = ''; done && done(); };
  }
  function closeItem(d) {
    if (!d.open) return;
    var start = d.offsetHeight;
    var summary = d.querySelector('summary');
    var end = summary.offsetHeight + parseFloat(getComputedStyle(d).paddingTop) * 2 + 2;
    animate(d, start, end, function () { d.open = false; });
  }
  function openItem(d) {
    var start = d.offsetHeight;
    d.open = true;
    var end = d.offsetHeight;
    animate(d, start, end);
  }
  items.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (e) {
      e.preventDefault();
      if (d.open) { closeItem(d); return; }
      items.forEach(function (o) { if (o !== d) closeItem(o); });
      openItem(d);
    });
  });
})();
