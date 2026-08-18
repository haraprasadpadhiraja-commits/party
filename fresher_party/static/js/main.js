/* ==========================================================
   Fresher Party Management System — Main JavaScript
   Theme toggle, mobile menu, live search, toasts, lightbox,
   delete confirmations, footer year.
   ========================================================== */

(function () {
    'use strict';

    /* ---------- Theme (Dark / Light) ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement; // use <html>? we set data-theme on <body>
    const body = document.body;

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        // Re-render charts if present (they need colors from CSS).
        if (window.renderAllCharts) window.renderAllCharts();
    }

    // Restore saved theme, otherwise follow system preference.
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('fresher-theme'); } catch (e) {}

    if (!savedTheme) {
        savedTheme = window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem('fresher-theme', next); } catch (e) {}
            applyTheme(next);
        });
    }

    /* ---------- Mobile hamburger menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
        // Close menu when a link is clicked.
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { navLinks.classList.remove('open'); });
        });
    }

    /* ---------- Sticky navbar shadow on scroll ---------- */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) navbar.style.boxShadow = '0 2px 24px rgba(0,0,0,.12)';
            else navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,.05)';
        });
    }

    /* ---------- Toast notifications ---------- */
    window.showToast = function (message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast-msg ' + (type || '');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity .4s';
            setTimeout(function () { toast.remove(); }, 400);
        }, 3200);
    };

    // Show any Django flash messages as toasts.
    document.querySelectorAll('.toast-msg.success, .toast-msg.error, .toast-msg.warning').forEach(function (el) {
        window.showToast(el.textContent.trim(), el.classList[1] || '');
        el.remove();
    });

    /* ---------- Global live search ---------- */
    const searchInput = document.getElementById('globalSearch');
    const resultsBox = document.getElementById('globalSearchResults');

    if (searchInput && resultsBox) {
        let debounceTimer = null;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const q = this.value.trim();
            if (q.length < 1) { resultsBox.classList.remove('show'); resultsBox.innerHTML = ''; return; }
            debounceTimer = setTimeout(function () { fetchSearch(q); }, 250);
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-search')) resultsBox.classList.remove('show');
        });

        function fetchSearch(q) {
            const url = '/search/live/?q=' + encodeURIComponent(q);
            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    let html = '';
                    html += '<div class="sr-head">🎓 Students (' + data.students.length + ')</div>';
                    if (data.students.length) {
                        data.students.forEach(function (s) {
                            html += '<a class="sr-item" href="/search/?q=' + encodeURIComponent(q) + '">' +
                                '<div><div class="sr-name">' + escapeHtml(s.name) + '</div>' +
                                '<div class="sr-sub">' + s.registration_number + ' · ' + escapeHtml(s.branch) + '</div></div></a>';
                        });
                    } else {
                        html += '<div class="sr-empty">No matching students found.</div>';
                    }
                    html += '<div class="sr-head">👨‍🏫 Faculty (' + data.faculty.length + ')</div>';
                    if (data.faculty.length) {
                        data.faculty.forEach(function (f) {
                            html += '<a class="sr-item" href="/faculty/?q=' + encodeURIComponent(q) + '">' +
                                '<div><div class="sr-name">' + escapeHtml(f.name) + '</div>' +
                                '<div class="sr-sub">' + f.faculty_number + ' · ' + escapeHtml(f.branch) + '</div></div></a>';
                        });
                    } else {
                        html += '<div class="sr-empty">No matching faculty found.</div>';
                    }
                    resultsBox.innerHTML = html;
                    resultsBox.classList.add('show');
                })
                .catch(function () { resultsBox.innerHTML = '<div class="sr-empty">Search unavailable.</div>'; resultsBox.classList.add('show'); });
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /* ---------- Delete confirmation ---------- */
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-confirm]');
        if (!btn) return;
        e.preventDefault();
        const formId = btn.getAttribute('data-form');
        const form = document.querySelector(formId);
        if (!form) return;
        if (window.confirm(btn.getAttribute('data-confirm'))) {
            form.submit();
        }
    });

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-item:not(.admin-gallery .gallery-item)').forEach(function (item) {
        item.addEventListener('click', function () {
            const src = item.getAttribute('data-src');
            if (!src) return;
            if (lightboxImg) lightboxImg.src = src;
            if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-title') || '';
            if (lightbox) lightbox.classList.add('show');
        });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', function () { lightbox.classList.remove('show'); });
    if (lightbox) lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) lightbox.classList.remove('show');
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox) lightbox.classList.remove('show');
    });

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
