/* ==========================================================
   Live search page — results update as the user types,
   using the /search/live/ JSON endpoint.
   ========================================================== */
(function () {
    'use strict';

    const input = document.getElementById('bigSearch');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    function render(data) {
        let html = '';

        html += '<div class="result-group"><h3>🎓 Students (' + data.students.length + ')</h3>';
        if (data.students.length) {
            data.students.forEach(function (s) {
                html += '<div class="result-item"><div><div class="ri-name">' +
                    escapeHtml(s.name) + '</div><div class="ri-sub">' +
                    s.registration_number + ' · ' + escapeHtml(s.branch) + '</div></div></div>';
            });
        } else {
            html += '<p class="muted">No matching students found.</p>';
        }
        html += '</div>';

        html += '<div class="result-group"><h3>👨‍🏫 Faculty (' + data.faculty.length + ')</h3>';
        if (data.faculty.length) {
            data.faculty.forEach(function (f) {
                html += '<div class="result-item"><div><div class="ri-name">' +
                    escapeHtml(f.name) + '</div><div class="ri-sub">' +
                    f.faculty_number + ' · ' + escapeHtml(f.branch) + ' · ' +
                    escapeHtml(f.designation) + '</div></div></div>';
            });
        } else {
            html += '<p class="muted">No matching faculty found.</p>';
        }
        html += '</div>';

        if (!data.students.length && !data.faculty.length) {
            html = '<div class="empty-state"><div class="empty-icon">🔍</div>' +
                '<p>No results for "' + escapeHtml(data.query) + '".</p></div>';
        }

        results.innerHTML = html;
    }

    let debounce = null;
    function doSearch() {
        const q = input.value.trim();
        if (q.length < 1) {
            results.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div>' +
                '<p>Type to search students and faculty…</p></div>';
            return;
        }
        fetch('/search/live/?q=' + encodeURIComponent(q), {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(function (r) { return r.json(); })
            .then(render)
            .catch(function () {
                results.innerHTML = '<p class="muted center">Search failed. Please try again.</p>';
            });
    }

    input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(doSearch, 250);
    });

    // Run once on load if there is a query from ?q= (server-side fallback).
    if (input.value.trim()) doSearch();
})();
