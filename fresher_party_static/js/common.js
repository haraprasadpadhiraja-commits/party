/* ==========================================================
   🎓 Fresher Party 2026 — Common JS (all pages)
   Theme toggle, mobile menu, live search, toasts, lightbox,
   confetti, hero particles, countdown.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- Escape HTML ---------- */
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }
    window.escapeHtml = escapeHtml;

    /* ---------- Theme (Dark/Light) ---------- */
    const body = document.body;
    function applyTheme(t) {
        body.setAttribute('data-theme', t);
        const icon = document.querySelector('#themeToggle i');
        if (icon) icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (window.renderAllCharts) window.renderAllCharts();
    }
    let saved = null;
    try { saved = localStorage.getItem('fp-theme'); } catch (e) {}
    if (!saved) saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    applyTheme(saved);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem('fp-theme', next); } catch (e) {}
            applyTheme(next);
        });
    }

    /* ---------- Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { navLinks.classList.remove('open'); });
        });
    }

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Navbar college info ---------- */
    document.querySelectorAll('[data-nav-name]').forEach(function (el) {
        el.textContent = (SITE_CONFIG.college.name);
    });

    /* ---------- Toast notifications ---------- */
    window.showToast = function (msg, type) {
        const c = document.getElementById('toastContainer');
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast-msg ' + (type || '');
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .4s';
            setTimeout(function () { t.remove(); }, 400); }, 3200);
    };

    /* ---------- Live search (navbar) ---------- */
    const searchInput = document.getElementById('globalSearch');
    const resultsBox = document.getElementById('globalSearchResults');
    if (searchInput && resultsBox) {
        let debounce = null;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounce);
            const q = this.value.trim();
            if (q.length < 1) { resultsBox.classList.remove('show'); resultsBox.innerHTML = ''; return; }
            debounce = setTimeout(function () { renderNavSearch(q); }, 250);
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-search')) resultsBox.classList.remove('show');
        });
    }
    function renderNavSearch(q) {
        const box = document.getElementById('globalSearchResults');
        const students = DB.searchStudents(q);
        const faculty = DB.searchFaculty(q);
        let html = '<div class="sr-head">🎓 Students (' + students.length + ')</div>';
        if (students.length) {
            students.slice(0, 5).forEach(function (s) {
                html += '<a class="sr-item" href="search.html?q=' + encodeURIComponent(q) + '">' +
                    '<div><div class="sr-name">' + escapeHtml(s.name) + '</div>' +
                    '<div class="sr-sub">' + s.registrationNumber + ' · ' + escapeHtml(s.branch) + '</div></div></a>';
            });
        } else html += '<div class="sr-empty">No matching students found.</div>';
        html += '<div class="sr-head">👨‍🏫 Faculty (' + faculty.length + ')</div>';
        if (faculty.length) {
            faculty.slice(0, 5).forEach(function (f) {
                html += '<a class="sr-item" href="faculty.html?q=' + encodeURIComponent(q) + '">' +
                    '<div><div class="sr-name">' + escapeHtml(f.name) + '</div>' +
                    '<div class="sr-sub">' + f.facultyNumber + ' · ' + escapeHtml(f.branch) + '</div></div></a>';
            });
        } else html += '<div class="sr-empty">No matching faculty found.</div>';
        box.innerHTML = html;
        box.classList.add('show');
    }

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    function openLightbox(src, caption) {
        if (!lightbox) return;
        const img = document.getElementById('lightboxImg');
        const cap = document.getElementById('lightboxCaption');
        if (img) img.src = src;
        if (cap) cap.textContent = caption || '';
        lightbox.classList.add('show');
    }
    window.openLightbox = openLightbox;
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.classList.remove('show'); });
    if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('show'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox) lightbox.classList.remove('show'); });

    /* ---------- Delete confirmation ---------- */
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-confirm]');
        if (!btn) return;
        e.preventDefault();
        if (window.confirm(btn.getAttribute('data-confirm'))) {
            const cb = btn.getAttribute('data-cb');
            if (cb && window[cb]) window[cb](btn);
        }
    });

    /* ---------- Confetti (call window.launchConfetti()) ---------- */
    window.launchConfetti = function () {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const W = canvas.width, H = canvas.height;
        const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#16a34a', '#f59e0b', '#06b6d4', '#ffffff'];
        const pieces = [];
        for (let i = 0; i < 160; i++) {
            pieces.push({
                x: Math.random() * W, y: Math.random() * -H, w: 6 + Math.random() * 8,
                h: 8 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3,
                rot: Math.random() * 6.28, vr: (Math.random() - .5) * .3
            });
        }
        let frame = 0;
        (function draw() {
            ctx.clearRect(0, 0, W, H);
            pieces.forEach(function (p) {
                p.x += p.vx; p.y += p.vy; p.vy += .02; p.rot += p.vr;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
                ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
                if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
            });
            frame++;
            if (frame < 300) requestAnimationFrame(draw);
            else ctx.clearRect(0, 0, W, H);
        })();
    };

    /* ---------- Hero particles ---------- */
    const particles = document.getElementById('heroParticles');
    if (particles) {
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('span');
            const size = Math.random() * 8 + 4;
            dot.style.cssText = 'position:absolute;left:' + Math.random() * 100 + '%;top:' +
                Math.random() * 100 + '%;width:' + size + 'px;height:' + size + 'px;border-radius:50%;' +
                'background:rgba(255,255,255,.5);box-shadow:0 0 10px rgba(255,255,255,.4);opacity:' +
                (Math.random() * .6 + .2) + ';animation:floaty ' + (Math.random() * 4 + 3) +
                's ease-in-out ' + Math.random() * 2 + 's infinite';
            particles.appendChild(dot);
        }
    }

    /* ---------- Countdown ---------- */
    const target = new Date(SITE_CONFIG.partyDate);
    const daysEl = document.getElementById('cdDays'), hoursEl = document.getElementById('cdHours'),
          minsEl = document.getElementById('cdMins'), secsEl = document.getElementById('cdSecs'),
          daysRemaining = document.getElementById('daysRemaining');
    if (daysEl) {
        function pad(n) { return String(n).padStart(2, '0'); }
        function tick() {
            let diff = target.getTime() - new Date().getTime();
            if (diff <= 0) { daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00'; if (daysRemaining) daysRemaining.textContent = '0'; return; }
            const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
                  m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
            daysEl.textContent = pad(d); hoursEl.textContent = pad(h);
            minsEl.textContent = pad(m); secsEl.textContent = pad(s);
            if (daysRemaining) daysRemaining.textContent = d;
        }
        tick(); setInterval(tick, 1000);
    }

    /* ---------- Fill hero background if configured ---------- */
    const hero = document.getElementById('hero');
    if (hero && SITE_CONFIG.college.heroImage) { hero.setAttribute('data-bg', '1'); hero.style.backgroundImage = "linear-gradient(rgba(15,17,32,.55),rgba(79,70,229,.75)), url('" + SITE_CONFIG.college.heroImage + "')"; }
    const brandLogo = document.getElementById('brandLogo');
    if (brandLogo && SITE_CONFIG.college.logo) brandLogo.src = SITE_CONFIG.college.logo;
})();
