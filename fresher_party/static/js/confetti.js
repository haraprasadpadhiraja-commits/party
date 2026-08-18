/* ==========================================================
   Confetti celebration effect (shown on the success page).
   ========================================================== */
(function () {
    'use strict';

    // Respect reduced motion.
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#4f46e5', '#7c3aed', '#ec4899', '#16a34a', '#f59e0b', '#06b6d4', '#ffffff'];
    const pieces = [];
    const PIECE_COUNT = 160;

    function random(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < PIECE_COUNT; i++) {
        pieces.push({
            x: random(0, W),
            y: random(-H, 0),
            w: random(6, 14),
            h: random(8, 16),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: random(-1.5, 1.5),
            vy: random(2, 5),
            rotation: random(0, Math.PI * 2),
            vRotation: random(-0.15, 0.15)
        });
    }

    let frame = 0;
    const durationFrames = 300; // ~5 seconds

    function draw() {
        ctx.clearRect(0, 0, W, H);
        pieces.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.rotation += p.vRotation;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            if (p.y > H + 20) { p.y = -20; p.x = random(0, W); }
        });
        frame++;
        if (frame < durationFrames) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, W, H);
        }
    }
    draw();
})();
