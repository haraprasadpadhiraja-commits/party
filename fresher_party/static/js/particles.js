/* ==========================================================
   Floating particles for the hero section.
   ========================================================== */
(function () {
    'use strict';

    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = document.getElementById('heroParticles');
    if (!container) return;

    const COUNT = 30;
    for (let i = 0; i < COUNT; i++) {
        const dot = document.createElement('span');
        const size = Math.random() * 8 + 4;
        dot.style.position = 'absolute';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(255,255,255,0.5)';
        dot.style.boxShadow = '0 0 10px rgba(255,255,255,0.4)';
        dot.style.opacity = Math.random() * 0.6 + 0.2;
        const anim = document.createElement('style');
        if (!document.getElementById('particleAnimStyle')) {
            anim.id = 'particleAnimStyle';
            anim.textContent = '@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}';
            document.head.appendChild(anim);
        }
        dot.style.animation = 'floaty ' + (Math.random() * 4 + 3) + 's ease-in-out ' + Math.random() * 2 + 's infinite';
        container.appendChild(dot);
    }
})();
