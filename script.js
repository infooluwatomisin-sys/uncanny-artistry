(function () {
  'use strict';

  var body = document.body;
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  var toast = document.getElementById('toast');
  var toastTimer;

  /* Toast for placeholder controls */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3400);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-demo]');
    if (!el) return;
    e.preventDefault();
    showToast(el.getAttribute('data-demo'));
  });

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

  /* Join form (prototype only) */
  var form = document.querySelector('.join-form');
  if (form) {
    var input = form.querySelector('input');
    var msg = document.getElementById('form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) {
        msg.textContent = 'Enter a full email address, like name@example.com.';
        input.focus();
        return;
      }
      msg.textContent = 'Thanks. This is a prototype, so nothing was saved.';
      form.reset();
    });
    input.addEventListener('input', function () {
      input.setAttribute('aria-invalid', 'false');
    });
  }
})();
