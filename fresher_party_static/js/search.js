/* ==========================================================
   🎓 Search page — live results as you type
   ========================================================== */
(function () {
    'use strict';
    const input = document.getElementById('bigSearch');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    function render(q) {
        const students = DB.searchStudents(q);
        const faculty = DB.searchFaculty(q);
        let html = '';
        html += '<div class="result-group"><h3>🎓 Students (' + students.length + ')</h3>';
        if (students.length) {
            students.forEach(function (s) {
                html += '<div class="result-item"><div><div class="ri-name">' + escapeHtml(s.name) + '</div>' +
                    '<div class="ri-sub">' + s.registrationNumber + ' · ' + escapeHtml(s.branch) + '</div></div></div>';
            });
        } else html += '<p class="muted">No matching students found.</p>';
        html += '</div>';

        html += '<div class="result-group"><h3>👨‍🏫 Faculty (' + faculty.length + ')</h3>';
        if (faculty.length) {
            faculty.forEach(function (f) {
                html += '<div class="result-item"><div><div class="ri-name">' + escapeHtml(f.name) + '</div>' +
                    '<div class="ri-sub">' + f.facultyNumber + ' · ' + escapeHtml(f.branch) + ' · ' + escapeHtml(f.designation) + '</div></div></div>';
            });
        } else html += '<p class="muted">No matching faculty found.</p>';
        html += '</div>';

        if (!students.length && !faculty.length) {
            html = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No results for "' + escapeHtml(q) + '".</p></div>';
        }
        results.innerHTML = html;
    }

    let debounce = null;
    input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () {
            const q = input.value.trim();
            if (q.length < 1) results.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>Type to search students and faculty…</p></div>';
            else render(q);
        }, 250);
    });

    // Support ?q= from live search
    const params = new URLSearchParams(location.search);
    if (params.get('q')) { input.value = params.get('q'); render(params.get('q')); }
    else results.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>Type to search students and faculty…</p></div>';
})();
