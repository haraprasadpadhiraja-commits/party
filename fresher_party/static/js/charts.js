/* ==========================================================
   Dashboard charts (Chart.js). Data is injected from the
   template into the branchData / growthData / facultyData /
   marksData globals.
   ========================================================== */
(function () {
    'use strict';

    if (typeof Chart === 'undefined') return; // Chart.js not loaded (offline)

    const isDark = () => document.body.getAttribute('data-theme') === 'dark';
    const gridColor = () => (isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');
    const labelColor = () => (isDark() ? '#c3c8e0' : '#6b7280');

    let charts = [];

    function baseOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: labelColor() } },
                tooltip: { enabled: true }
            },
            scales: {
                x: { ticks: { color: labelColor() }, grid: { color: gridColor() } },
                y: { beginAtZero: true, ticks: { color: labelColor(), precision: 0 }, grid: { color: gridColor() } }
            }
        };
    }

    function destroyAll() {
        charts.forEach(function (c) { if (c) c.destroy(); });
        charts = [];
    }

    window.renderAllCharts = function () {
        destroyAll();

        const palette = ['#4f46e5', '#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#16a34a', '#f43f5e'];

        if (typeof branchData !== 'undefined' && document.getElementById('chartBranch')) {
            charts.push(new Chart(document.getElementById('chartBranch'), {
                type: 'bar',
                data: {
                    labels: branchData.labels,
                    datasets: [{ label: 'Students', data: branchData.data,
                        backgroundColor: palette, borderRadius: 8 }]
                },
                options: baseOptions()
            }));
        }

        if (typeof growthData !== 'undefined' && document.getElementById('chartGrowth')) {
            charts.push(new Chart(document.getElementById('chartGrowth'), {
                type: 'line',
                data: {
                    labels: growthData.labels,
                    datasets: [{ label: 'New registrations', data: growthData.data,
                        borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.2)',
                        fill: true, tension: 0.35, pointBackgroundColor: '#4f46e5' }]
                },
                options: baseOptions()
            }));
        }

        if (typeof facultyData !== 'undefined' && document.getElementById('chartFaculty')) {
            charts.push(new Chart(document.getElementById('chartFaculty'), {
                type: 'doughnut',
                data: {
                    labels: facultyData.labels,
                    datasets: [{ data: facultyData.data, backgroundColor: palette, borderColor: 'transparent' }]
                },
                options: { responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: labelColor() } } } }
            }));
        }

        if (typeof marksData !== 'undefined' && document.getElementById('chartMarks')) {
            charts.push(new Chart(document.getElementById('chartMarks'), {
                type: 'bar',
                data: {
                    labels: marksData.labels,
                    datasets: [{ label: 'Students', data: marksData.data,
                        backgroundColor: 'rgba(16,163,74,0.7)', borderRadius: 8 }]
                },
                options: baseOptions()
            }));
        }
    };

    // Render initially after a tiny delay so Chart.js is ready.
    setTimeout(window.renderAllCharts, 100);
})();
