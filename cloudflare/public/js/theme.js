/* aihoni — light/dark theme toggle.
   The effective theme is resolved before paint by a small inline script in
   <head>. This adds the toggle behaviour and keeps following the OS setting
   until the user makes an explicit choice (stored in localStorage). */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      btn.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  // Follow OS changes only while the user hasn't chosen a theme manually.
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  } catch (e) {}
})();
