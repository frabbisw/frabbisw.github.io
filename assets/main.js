(function () {
  'use strict';
  const doc = document.documentElement;
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const themeButton = document.getElementById('theme-toggle');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const publications = Array.from(document.querySelectorAll('.publication'));
  const searchBox = document.getElementById('pub-search');
  const counter = document.getElementById('pub-count');
  const empty = document.getElementById('empty-publications');
  let activeFilter = 'all';

  function applyTheme(theme) {
    if (theme === 'dark') doc.setAttribute('data-theme', 'dark');
    else doc.removeAttribute('data-theme');
    themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('title', theme === 'dark' ? 'Light theme' : 'Dark theme');
    themeButton.innerHTML = theme === 'dark' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.1A8.4 8.4 0 0 1 8.9 3.5 8.5 8.5 0 1 0 20.5 15.1Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>';
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('frabbisw-theme'); } catch (e) { /* private browsing */ }
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeButton.addEventListener('click', function () {
    const newTheme = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try { localStorage.setItem('frabbisw-theme', newTheme); } catch (e) { /* private browsing */ }
  });

  function closeMenu() {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
  menuButton.addEventListener('click', function () {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', function (event) {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  function updatePublications() {
    const query = searchBox.value.trim().toLocaleLowerCase();
    let count = 0;
    publications.forEach(function (pub) {
      const kindMatches = activeFilter === 'all' || pub.dataset.kind === activeFilter;
      const searchMatches = !query || pub.dataset.search.includes(query);
      const show = kindMatches && searchMatches;
      pub.hidden = !show;
      if (show) count += 1;
    });
    counter.textContent = 'Showing ' + count + ' of ' + publications.length + ' research works';
    empty.hidden = count > 0;
  }
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(function (b) {
        const current = b === button;
        b.classList.toggle('active', current);
        b.setAttribute('aria-pressed', String(current));
      });
      updatePublications();
    });
  });
  searchBox.addEventListener('input', updatePublications);
  updatePublications();

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 15);
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const anchors = Array.from(document.querySelectorAll('.main-nav a'));
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const observer = new IntersectionObserver(function (entries) {
      entries.filter(function (entry) { return entry.isIntersecting; }).forEach(function (entry) {
        anchors.forEach(function (a) { a.classList.toggle('active', a.hash === '#' + entry.target.id); });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }
  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
})();
