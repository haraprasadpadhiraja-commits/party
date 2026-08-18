/* ==========================================================
   🎓 Dashboard — charts computed from the local database
   ========================================================== */
(function () {
    'use strict';

    document.getElementById('dStudents').textContent = DB.totalStudents();
    document.getElementById('dFaculty').textContent = DB.totalFaculty();
    document.getElementById('dBranches').textContent = DB.totalBranches();

    // Recent table
    const recent = DB.allStudents().slice().sort(function (a, b) { return (a.createdAt < b.createdAt) ? 1 : -1; }).slice(0, 8);
    document.getElementById('recentTable').innerHTML = recent.length ? recent.map(function (s) {
        return '<tr><td>' + s.registrationNumber + '</td><td>' + escapeHtml(s.name) + '</td><td>' +
            escapeHtml(s.branch) + '</td><td>' + s.marks + '</td><td>' + new Date(s.createdAt).toLocaleDateString() + '</td></tr>';
    }).join('') : '<tr><td colspan="5" class="muted">No students yet.</td></tr>';

    // ---- Chart data from DB ----
    const students = DB.allStudents();
    const faculty = DB.allFaculty();

    // Students by branch
    const sb = {}; students.forEach(function (s) { sb[s.branch] = (sb[s.branch] || 0) + 1; });
    const sbLabels = Object.keys(sb), sbData = Object.values(sb);

    // Faculty by branch
    const fb = {}; faculty.forEach(function (f) { fb[f.branch] = (fb[f.branch] || 0) + 1; });
    const fbLabels = Object.keys(fb), fbData = Object.values(fb);

    // Registration growth (last 7 days)
    const gLabels = [], gData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const start = new Date(d); start.setHours(0, 0, 0, 0);
        const end = new Date(d); end.setHours(23, 59, 59, 999);
        let c = 0;
        students.forEach(function (s) { const t = new Date(s.createdAt).getTime(); if (t >= start.getTime() && t <= end.getTime()) c++; });
        gLabels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
        gData.push(c);
    }

    // Marks distribution
    const mBuckets = [[0, 40], [40, 60], [60, 75], [75, 90], [90, 101]];
    const mLabels = [], mData = [];
    mBuckets.forEach(function (b) {
        let c = 0;
        students.forEach(function (s) { if (s.marks >= b[0] && s.marks < b[1]) c++; });
        mLabels.push(b[1] <= 100 ? b[0] + '-' + (b[1] - 1) : b[0] + '-100');
        mData.push(c);
    });

    // ---- Render ----
    function isDark() { return document.body.getAttribute('data-theme') === 'dark'; }
    const gridColor = () => (isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');
    const labelColor = () => (isDark() ? '#c3c8e0' : '#6b7280');
    const palette = ['#4f46e5', '#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#16a34a', '#f43f5e'];

    function baseOptions() {
        return { responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: labelColor() } } },
            scales: { x: { ticks: { color: labelColor() }, grid: { color: gridColor() } },
                       y: { beginAtZero: true, ticks: { color: labelColor(), precision: 0 }, grid: { color: gridColor() } } } };
    }

    let charts = [];
    function renderAllCharts() {
        charts.forEach(function (c) { if (c) c.destroy(); }); charts = [];
        if (typeof Chart === 'undefined') return;
        if (document.getElementById('chartBranch'))
            charts.push(new Chart(document.getElementById('chartBranch'), { type: 'bar',
                data: { labels: sbLabels, datasets: [{ label: 'Students', data: sbData, backgroundColor: palette, borderRadius: 8 }] },
                options: baseOptions() }));
        if (document.getElementById('chartGrowth'))
            charts.push(new Chart(document.getElementById('chartGrowth'), { type: 'line',
                data: { labels: gLabels, datasets: [{ label: 'New registrations', data: gData, borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79,70,229,0.2)', fill: true, tension: 0.35, pointBackgroundColor: '#4f46e5' }] },
                options: baseOptions() }));
        if (document.getElementById('chartFaculty'))
            charts.push(new Chart(document.getElementById('chartFaculty'), { type: 'doughnut',
                data: { labels: fbLabels, datasets: [{ data: fbData, backgroundColor: palette, borderColor: 'transparent' }] },
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: labelColor() } } } } }));
        if (document.getElementById('chartMarks'))
            charts.push(new Chart(document.getElementById('chartMarks'), { type: 'bar',
                data: { labels: mLabels, datasets: [{ label: 'Students', data: mData, backgroundColor: 'rgba(16,163,74,0.7)', borderRadius: 8 }] },
                options: baseOptions() }));
    }
    window.renderAllCharts = renderAllCharts;
    setTimeout(renderAllCharts, 100);
})();
