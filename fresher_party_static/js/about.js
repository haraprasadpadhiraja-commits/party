/* ==========================================================
   🎓 About page — renders editable college info from config
   ========================================================== */
(function () {
    'use strict';
    const info = DB.collegeInfo();

    document.getElementById('aboutSub').textContent = info.name + ' · Estd. ' + (info.establishedYear || '—');

    // Hero
    let heroHTML = '';
    if (info.heroImage) heroHTML += '<img src="' + info.heroImage + '" alt="' + escapeHtml(info.name) + '" class="about-hero-img">';
    heroHTML += '<div class="about-hero-text"><h2>' + escapeHtml(info.name) + '</h2>' +
        '<p class="tagline-text">' + escapeHtml(info.tagline) + '</p><p>' + escapeHtml(info.history) + '</p></div>';
    document.getElementById('aboutHero').innerHTML = heroHTML;
    document.getElementById('aboutHero').style.gridTemplateColumns = info.heroImage ? '1fr 1fr' : '1fr';

    document.getElementById('vision').textContent = info.vision || '—';
    document.getElementById('mission').textContent = info.mission || '—';

    function fillList(id, items) {
        const el = document.getElementById(id);
        el.innerHTML = (items && items.length) ? items.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') : '<li>—</li>';
    }
    fillList('courses', info.courses);
    fillList('branches', info.branches);
    fillList('facilities', info.facilities);

    document.getElementById('principalMsg').textContent = '“' + (info.principalMessage || 'Welcome to our college!') + '”';
    document.getElementById('principalName').textContent = '— ' + (info.principalName || 'Principal');

    document.getElementById('contactGrid').innerHTML =
        '<p><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(info.address || '—') + '</p>' +
        '<p><i class="fas fa-phone"></i> ' + escapeHtml(info.phone || '—') + '</p>' +
        '<p><i class="fas fa-envelope"></i> ' + escapeHtml(info.email || '—') + '</p>' +
        '<p><i class="fas fa-globe"></i> ' + escapeHtml(info.website || '—') + '</p>';
})();
