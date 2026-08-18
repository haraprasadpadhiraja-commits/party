/* ==========================================================
   🎓 Fresher Party 2026 — Shared Navbar & Footer injector
   Injects the same navigation and footer into every page so
   you never repeat them. Placeholders:
     <div data-nav="home"></div>   and   <div data-footer></div>
   ========================================================== */
(function () {
    'use strict';

    function navHTML(active) {
        var links = [
            { href: 'index.html', key: 'home', icon: 'fa-home', label: 'Home' },
            { href: 'register.html', key: 'register', icon: 'fa-user-graduate', label: 'Student Registration' },
            { href: 'faculty.html', key: 'faculty', icon: 'fa-chalkboard-teacher', label: 'Faculty' },
            { href: 'dashboard.html', key: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { href: 'search.html', key: 'search', icon: 'fa-search', label: 'Search' },
            { href: 'gallery.html', key: 'gallery', icon: 'fa-images', label: 'Gallery' },
            { href: 'about.html', key: 'about', icon: 'fa-university', label: 'About' },
            { href: 'admin.html', key: 'admin', icon: 'fa-lock', label: 'Admin' }
        ];
        var html = '<nav class="navbar"><div class="nav-inner">' +
            '<a href="index.html" class="brand">' +
            '<img id="brandLogo" src="" alt="Logo" class="brand-logo" style="display:none">' +
            '<span class="brand-icon" id="brandIcon">🎓</span>' +
            '<span class="brand-text"><span class="brand-name" data-nav-name></span>' +
            '<span class="brand-sub">Fresher Party 2026</span></span></a>' +
            '<div class="nav-right"><ul class="nav-links" id="navLinks">';
        links.forEach(function (l) {
            html += '<li><a href="' + l.href + '" class="' + (active === l.key ? 'active' : '') + '"><i class="fas ' + l.icon + '"></i> ' + l.label + '</a></li>';
        });
        html += '</ul>' +
            '<button class="theme-toggle" id="themeToggle" title="Toggle theme"><i class="fas fa-moon"></i></button>' +
            '<button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>' +
            '</div></div>' +
            '<div class="nav-search"><div class="search-wrap"><i class="fas fa-search search-icon"></i>' +
            '<input type="text" id="globalSearch" class="search-input" placeholder="Search students, faculty, branches… (live)"></div>' +
            '<div class="search-results" id="globalSearchResults"></div></div></nav>';
        return html;
    }

    function footerHTML() {
        return '<footer class="footer"><div class="footer-inner">' +
            '<div class="footer-col"><h4 data-nav-name></h4><p id="footerTagline"></p>' +
            '<p class="footer-address" id="footerAddress"><i class="fas fa-map-marker-alt"></i></p></div>' +
            '<div class="footer-col"><h4>Quick Links</h4><ul>' +
            '<li><a href="index.html">Home</a></li><li><a href="register.html">Register</a></li>' +
            '<li><a href="faculty.html">Faculty</a></li><li><a href="gallery.html">Gallery</a></li></ul></div>' +
            '<div class="footer-col"><h4>Contact</h4><p id="footerPhone"><i class="fas fa-phone"></i></p>' +
            '<p id="footerEmail"><i class="fas fa-envelope"></i></p><p id="footerWebsite"><i class="fas fa-globe"></i></p></div>' +
            '</div><div class="footer-bottom">© <span id="footerYear"></span> <span data-nav-name></span> · Fresher Party 2026. All rights reserved.</div></footer>';
    }

    // Determine active page from the current filename.
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var activeMap = {
        'index.html': 'home', 'register.html': 'register', 'faculty.html': 'faculty',
        'dashboard.html': 'dashboard', 'search.html': 'search', 'gallery.html': 'gallery',
        'about.html': 'about', 'admin.html': 'admin'
    };
    var active = activeMap[file] || '';

    document.querySelectorAll('[data-nav]').forEach(function (el) {
        el.outerHTML = navHTML(el.getAttribute('data-nav') || active);
    });
    document.querySelectorAll('[data-footer]').forEach(function (el) {
        el.outerHTML = footerHTML();
    });

    // Inject common page chrome (toasts, confetti canvas) if not present.
    if (!document.getElementById('toastContainer')) {
        var t = document.createElement('div');
        t.id = 'toastContainer'; t.className = 'toast-container';
        document.body.insertBefore(t, document.body.firstChild);
    }
    if (!document.getElementById('confettiCanvas')) {
        var c = document.createElement('canvas');
        c.id = 'confettiCanvas';
        document.body.insertBefore(c, document.body.firstChild);
    }
    // Lightbox
    if (!document.getElementById('lightbox')) {
        var lb = document.createElement('div');
        lb.id = 'lightbox'; lb.className = 'lightbox';
        lb.innerHTML = '<button class="lightbox-close" id="lightboxClose" aria-label="Close">&times;</button>' +
            '<img src="" alt="" id="lightboxImg" class="lightbox-img"><div class="lightbox-caption" id="lightboxCaption"></div>';
        document.body.appendChild(lb);
    }

    // Fill footer from config after config.js loads.
    function fillFooter() {
        if (!window.SITE_CONFIG) return;
        var tag = document.getElementById('footerTagline'),
            addr = document.getElementById('footerAddress'),
            ph = document.getElementById('footerPhone'),
            em = document.getElementById('footerEmail'),
            ws = document.getElementById('footerWebsite');
        if (tag) tag.textContent = SITE_CONFIG.college.tagline;
        if (addr) addr.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + SITE_CONFIG.college.address;
        if (ph) ph.innerHTML = '<i class="fas fa-phone"></i> ' + SITE_CONFIG.college.phone;
        if (em) em.innerHTML = '<i class="fas fa-envelope"></i> ' + SITE_CONFIG.college.email;
        if (ws) ws.innerHTML = '<i class="fas fa-globe"></i> ' + SITE_CONFIG.college.website;
        var logo = document.getElementById('brandLogo'), icon = document.getElementById('brandIcon');
        if (logo && icon) {
            if (SITE_CONFIG.college.logo) { logo.style.display = 'block'; logo.src = SITE_CONFIG.college.logo; icon.style.display = 'none'; }
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillFooter);
    else fillFooter();
})();
