/* ==========================================================
   Live countdown timer for the Fresher Party.
   Targets a configurable date set in the TARGET_DATE variable.
   ========================================================== */
(function () {
    'use strict';

    // 🎯 Set the Fresher Party date here (format: 'YYYY-MM-DDTHH:MM:SS').
    // Example: '2026-09-20T18:00:00' = 20 Sept 2026, 6:00 PM.
    const TARGET_DATE = new Date('2026-12-15T18:00:00');

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');
    const daysRemaining = document.getElementById('daysRemaining');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const now = new Date().getTime();
        let diff = TARGET_DATE.getTime() - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minsEl.textContent = '00';
            secsEl.textContent = '00';
            if (daysRemaining) daysRemaining.textContent = '0';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minsEl.textContent = pad(mins);
        secsEl.textContent = pad(secs);

        if (daysRemaining) daysRemaining.textContent = days;
    }

    tick();
    setInterval(tick, 1000);
})();
