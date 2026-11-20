(function () {
  'use strict';

  var body = document.body;
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');

  /* Mobile menu */
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    body.classList.toggle('menu-open', open);
    if (open) {
      menu.style.paddingTop = (document.querySelector('.site-header').getBoundingClientRect().bottom + 28) + 'px';
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') {
        setMenu(false);
        menuBtn.focus();
        return;
      }
      if (e.key === 'Tab') {
        /* keep focus inside the open menu and its toggle */
        var items = [].slice.call(menu.querySelectorAll('a')).concat(menuBtn);
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* close the overlay if the window grows to desktop width */
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }


  /* Header: compact on scroll, highlight the section in view */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-compact', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = [].slice.call(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = map[en.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* Pause moving text and badge */
  var pause = document.querySelector('.pause');
  if (pause) {
    pause.addEventListener('click', function () {
      var on = pause.getAttribute('aria-pressed') !== 'true';
      pause.setAttribute('aria-pressed', String(on));
      pause.setAttribute('aria-label', on ? 'Play moving text and badge' : 'Pause moving text and badge');
      body.classList.toggle('motion-off', on);
    });
  }

  /* Concept preview dialog */
  var dlg = document.getElementById('concept');
  var lastOpener = null;
  function fill(btn) {
    document.getElementById('concept-title').textContent = btn.dataset.title;
    document.getElementById('concept-tag').textContent = btn.dataset.tag;
    document.getElementById('concept-text').textContent = btn.dataset.copy;
    var art = document.getElementById('concept-art');
    art.style.background = btn.dataset.bg;
    art.innerHTML = '<svg viewBox="0 0 200 320" role="img" aria-label="' + btn.dataset.title + ' illustration" style="' + btn.dataset.style + '"><use href="#' + btn.dataset.piece + '"/></svg>';
  }
  if (dlg && typeof dlg.showModal === 'function') {
    document.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lastOpener = btn;
        fill(btn);
        dlg.showModal();
        body.classList.add('dialog-open');
      });
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]') || e.target.closest('a[href^="#"]')) dlg.close();
    });
    dlg.addEventListener('close', function () {
      body.classList.remove('dialog-open');
      if (lastOpener) lastOpener.focus({ preventScroll: true });
    });
  } else {
    /* no dialog support: hide the buttons rather than leave them dead */
    document.querySelectorAll('[data-open]').forEach(function (b) { b.hidden = true; });
  }
})();
