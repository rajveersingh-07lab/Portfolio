document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const intro = document.getElementById('intro-screen');
    const loading = document.getElementById('loading-screen');
    const app = document.getElementById('app');

    // ======= INTRO PARTICLES (Purple/Pink) =======
    const introCanvas = document.getElementById('intro-particles');
    const ictx = introCanvas.getContext('2d');
    introCanvas.width = window.innerWidth;
    introCanvas.height = window.innerHeight;

    const introParticles = [];
    for (let i = 0; i < 60; i++) {
        introParticles.push({
            x: Math.random() * introCanvas.width,
            y: Math.random() * introCanvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.8,
            dy: (Math.random() - 0.5) * 0.8,
            o: Math.random() * 0.5 + 0.2
        });
    }

    let introRunning = true;
    function drawIntroParticles() {
        if (!introRunning) return;
        ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
        introParticles.forEach(p => {
            ictx.globalAlpha = p.o;
            ictx.fillStyle = '#c084fc';
            ictx.beginPath();
            ictx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ictx.fill();
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > introCanvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > introCanvas.height) p.dy *= -1;
        });
        // Draw connections
        ictx.globalAlpha = 0.06;
        ictx.strokeStyle = '#a78bfa';
        for (let i = 0; i < introParticles.length; i++) {
            for (let j = i + 1; j < introParticles.length; j++) {
                const dx = introParticles[i].x - introParticles[j].x;
                const dy = introParticles[i].y - introParticles[j].y;
                if (dx * dx + dy * dy < 15000) {
                    ictx.beginPath();
                    ictx.moveTo(introParticles[i].x, introParticles[i].y);
                    ictx.lineTo(introParticles[j].x, introParticles[j].y);
                    ictx.stroke();
                }
            }
        }
        ictx.globalAlpha = 1;
        requestAnimationFrame(drawIntroParticles);
    }
    drawIntroParticles();

    // ======= BUTTONS =======
    document.getElementById('btn-no').addEventListener('click', () => {
        intro.style.transition = 'opacity 0.5s';
        intro.style.opacity = '0';
        setTimeout(() => {
            document.body.innerHTML = `<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;background:#1e1b4b;color:white;flex-direction:column;"><h2 style="font-size:3rem;">Okay, bye! 👋</h2><p style="color:#c4b5fd;margin-top:1rem;">You're missing out though...</p></div>`;
        }, 500);
    });

    document.getElementById('btn-yes').addEventListener('click', () => {
        introRunning = false;
        intro.style.transition = 'opacity 0.5s';
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.classList.add('hidden');
            loading.classList.remove('hidden');
            loading.style.opacity = '1';
            startLoading();
        }, 500);
    });

    // ======= MONEY LOADING =======
    function startLoading() {
        // Money rain
        const rain = document.getElementById('money-rain');
        const symbols = ['₹', '$', '€', '£', '¥', '💰', '📈'];
        for (let i = 0; i < 30; i++) {
            const span = document.createElement('span');
            span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            span.style.cssText = `
                position:absolute; font-size:${Math.random()*1.5+0.8}rem;
                left:${Math.random()*100}%; top:-20px;
                animation: fall ${Math.random()*2+2}s linear infinite;
                animation-delay:${Math.random()*2}s; opacity:0.3; color:#fbbf24;
            `;
            rain.appendChild(span);
        }

        // Inject fall animation
        if (!document.getElementById('fall-anim')) {
            const style = document.createElement('style');
            style.id = 'fall-anim';
            style.textContent = `@keyframes fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:0;} 10%{opacity:0.4;} 100%{transform:translateY(100vh) rotate(360deg);opacity:0;} }`;
            document.head.appendChild(style);
        }

        // Progress bar
        const fill = document.getElementById('progress-fill');
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 8 + 2;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loading.style.transition = 'opacity 0.5s';
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.classList.add('hidden');
                        app.classList.remove('hidden');
                        app.style.opacity = '0';
                        app.style.transition = 'opacity 0.8s';
                        requestAnimationFrame(() => { app.style.opacity = '1'; });
                        initDesktop();
                    }, 500);
                }, 400);
            }
            fill.style.width = width + '%';
        }, 120);
    }

    // ======= DESKTOP INIT =======
    function initDesktop() {
        lucide.createIcons();
        initBgGradient();
        initMainParticles();
        initStars();
        initClock();
        initParallax();
        initWindows();
        initClipboard();

        // Animate folders in
        document.querySelectorAll('.folder-icon').forEach((f, i) => {
            f.style.opacity = '0';
            f.style.transform = 'translateY(30px) scale(0.8)';
            setTimeout(() => {
                f.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                f.style.opacity = '1';
                f.style.transform = 'translateY(0) scale(1)';
            }, 150 * i);
        });
    }

    // ======= WINDOW & CLICK LOGIC =======
    function initWindows() {
        const folders = document.querySelectorAll('.folder-icon');
        const overlay = document.getElementById('window-overlay');
        const closes = document.querySelectorAll('.win-close');
        let highestZ = 1000;

        // Move windows out of transformed parents to fix position: fixed bugs
        document.querySelectorAll('.hover-window').forEach(win => {
            document.body.appendChild(win);
        });

        function closeAllWindows() {
            document.querySelectorAll('.hover-window.open').forEach(win => {
                win.classList.remove('open');
            });
            overlay.classList.remove('open');
        }

        folders.forEach(folder => {
            folder.addEventListener('click', (e) => {
                // Prevent click on the hover-window inside from triggering again
                if (e.target.closest('.hover-window')) return;
                
                const winId = folder.getAttribute('data-window');
                const win = document.getElementById(winId);
                if (win) {
                    closeAllWindows();
                    highestZ++;
                    win.style.zIndex = highestZ;
                    win.classList.add('open');
                    overlay.style.zIndex = highestZ - 1;
                    overlay.classList.add('open');
                }
            });
        });

        closes.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllWindows();
            });
        });

        overlay.addEventListener('click', closeAllWindows);
    }

    // ======= ANIMATED GRADIENT BACKGROUND =======
    function initBgGradient() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;
        function draw() {
            time += 0.003;
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            
            const r1 = Math.sin(time) * 20 + 15;
            const g1 = Math.sin(time + 1) * 15 + 20;
            const b1 = Math.sin(time + 2) * 20 + 50;
            
            const r2 = Math.sin(time + 3) * 15 + 20;
            const g2 = Math.sin(time + 4) * 20 + 30;
            const b2 = Math.sin(time + 5) * 20 + 60;

            grad.addColorStop(0, `rgb(${r1},${g1},${b1})`);
            grad.addColorStop(0.5, `rgb(${r2},${g2},${b2})`);
            grad.addColorStop(1, `rgb(${r1+10},${g1},${b1+15})`);
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
        }
        draw();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ======= MAIN PARTICLE ENGINE (Cursor-Reactive) =======
    function initMainParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouseX = canvas.width / 2, mouseY = canvas.height / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const particles = [];
        const count = window.innerWidth < 768 ? 30 : 70;
        const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 1.2,
                dy: (Math.random() - 0.5) * 1.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                baseR: Math.random() * 3 + 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // Cursor attraction
                const ddx = mouseX - p.x;
                const ddy = mouseY - p.y;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                
                if (dist < 200) {
                    p.x += ddx * 0.008;
                    p.y += ddy * 0.008;
                    p.r = p.baseR * (1 + (200 - dist) / 200);
                } else {
                    p.r = p.baseR;
                }

                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                ctx.globalAlpha = 0.6;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Connection lines
            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    if (dx * dx + dy * dy < 12000) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ======= STARS (Twinkling) =======
    function initStars() {
        const container = document.getElementById('stars-container');
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(star);
        }
    }

    // ======= WORLD CLOCK =======
    function initClock() {
        let tz = 'Asia/Kolkata';
        let label = '🇮🇳 India';
        const clockEl = document.getElementById('live-clock');
        const labelEl = document.getElementById('clock-label');
        const taskbarClock = document.getElementById('taskbar-clock');

        function update() {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            taskbarClock.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
        }
        setInterval(update, 1000);
        update();

        document.querySelectorAll('.clock-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.clock-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                tz = tab.dataset.tz;
                
                if (tz === 'Asia/Kolkata') label = '🇮🇳 India';
                else if (tz === 'Asia/Dubai') label = '🇦🇪 UAE';
                else if (tz === 'America/New_York') label = '🇺🇸 USA';
                else label = '🇫🇷 France';
                
                labelEl.textContent = label;
                update();
            });
        });
    }

    // ======= PARALLAX ON MOUSE MOVE =======
    function initParallax() {
        const layers = document.querySelectorAll('.mountain-layer');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            layers.forEach((layer, i) => {
                const depth = (i + 1) * 8;
                layer.style.transform = `translateX(${x * depth}px) translateY(${y * (depth * 0.3)}px)`;
            });
        });
    }

    // ======= CLIPBOARD LOGIC =======
    function initClipboard() {
        const chatBtn = document.getElementById('lets-chat-btn');
        const toast = document.getElementById('clipboard-toast');

        if (chatBtn && toast) {
            chatBtn.addEventListener('click', () => {
                navigator.clipboard.writeText('rajveer.2421030329@muj.manipal.edu').then(() => {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                });
            });
        }
    }
});
