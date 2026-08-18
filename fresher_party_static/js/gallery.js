/* ==========================================================
   🎓 Gallery — categories, cards, lightbox
   ========================================================== */
(function () {
    'use strict';
    const grid = document.getElementById('galleryGrid');
    const bar = document.getElementById('categoryBar');
    const empty = document.getElementById('galEmpty');
    if (!grid) return;

    const params = new URLSearchParams(location.search);
    let current = params.get('category') || '';

    // Build category chips
    let chips = '<a href="gallery.html" class="chip ' + (!current ? 'chip-active' : '') + '">All</a>';
    SITE_CONFIG.galleryCategories.forEach(function (c) {
        chips += '<a href="gallery.html?category=' + encodeURIComponent(c) + '" class="chip ' + (c === current ? 'chip-active' : '') + '">' + c + '</a>';
    });
    bar.innerHTML = chips;

    function render() {
        let list = DB.gallery();
        if (current) list = list.filter(function (g) { return g.category === current; });
        if (list.length) {
            empty.style.display = 'none';
            grid.innerHTML = list.map(function (g) {
                const src = g.url || '';
                const title = g.title || g.category;
                const inner = src ? '<img src="' + src + '" alt="' + escapeHtml(title) + '" loading="lazy">' :
                    '<div class="gallery-placeholder">📷 ' + escapeHtml(title) + '</div>';
                return '<div class="gallery-item fade-up" onclick="openLightbox(\'' + src.replace(/'/g, "\\'") + '\',\'' + escapeHtml(title).replace(/'/g, "\\'") + '\')">' +
                    inner +
                    '<div class="gallery-overlay"><span>' + escapeHtml(title) + '</span><span class="gallery-cat">' + escapeHtml(g.category) + '</span></div></div>';
            }).join('');
        } else {
            grid.innerHTML = ''; empty.style.display = 'block';
        }
    }
    render();
})();
