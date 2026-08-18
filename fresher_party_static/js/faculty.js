/* ==========================================================
   🎓 Faculty directory — search, filter, cards
   ========================================================== */
(function () {
    'use strict';

    const grid = document.getElementById('facGrid');
    const empty = document.getElementById('facEmpty');
    const branchSel = document.getElementById('facBranch');
    const qInput = document.getElementById('facQ');
    if (!grid) return;

    // Populate branch filter
    const all = DB.allFaculty();
    const branches = [];
    all.forEach(function (f) { if (branches.indexOf(f.branch) === -1) branches.push(f.branch); });
    branches.sort().forEach(function (b) {
        const opt = document.createElement('option'); opt.value = b; opt.textContent = b; branchSel.appendChild(opt);
    });

    function render() {
        const q = (qInput ? qInput.value : '').trim().toLowerCase();
        const br = branchSel ? branchSel.value : '';
        const list = DB.allFaculty().filter(function (f) {
            const matchQ = !q || (f.name + ' ' + f.facultyNumber + ' ' + f.branch + ' ' + f.designation).toLowerCase().indexOf(q) !== -1;
            const matchBr = !br || f.branch === br;
            return matchQ && matchBr;
        });
        if (list.length) {
            empty.style.display = 'none';
            grid.innerHTML = list.map(function (f) {
                return '<div class="faculty-card fade-up"><div class="faculty-avatar">' + escapeHtml(f.name.charAt(0)) + '</div>' +
                    '<h3>' + escapeHtml(f.name) + '</h3><p class="faculty-no">' + f.facultyNumber + '</p>' +
                    '<span class="badge branch-badge">' + escapeHtml(f.branch) + '</span>' +
                    '<p class="faculty-designation">' + escapeHtml(f.designation || 'Faculty') + '</p>' +
                    (f.email ? '<p class="faculty-email"><i class="fas fa-envelope"></i> ' + escapeHtml(f.email) + '</p>' : '') +
                    '</div>';
            }).join('');
        } else {
            grid.innerHTML = ''; empty.style.display = 'block';
        }
    }

    // Support ?q= from live search
    const params = new URLSearchParams(location.search);
    if (params.get('q')) qInput.value = params.get('q');

    render();
    window.applyFilter = render;
    window.clearFilter = function () { if (qInput) qInput.value = ''; if (branchSel) branchSel.value = ''; render(); };
})();
