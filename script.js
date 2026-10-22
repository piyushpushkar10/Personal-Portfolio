(function () {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar');
    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle');

    // sticky navbar
    const onScroll = () => navbar.classList.toggle('sticky', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // mobile menu
    menuToggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', open);
        menuToggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    }));

    // theme toggle
    const isDark = () => root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
    const syncThemeIcon = () => {
        themeToggle.querySelector('i').className = isDark() ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        // a saved choice overrides the system-based browser bar colour
        if (root.dataset.theme) themeMetas.forEach(m => { m.content = isDark() ? '#0b0d12' : '#f7f7fb'; });
    };
    themeToggle.addEventListener('click', () => {
        const next = isDark() ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncThemeIcon();
    });
    syncThemeIcon();

    // typing effect
    const words = ['full-stack internal tools', 'automation pipelines', 'AI agents', 'secure web apps', 'data dashboards'];
    const typing = document.querySelector('.typing');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        let w = 0, i = words[0].length, deleting = true;
        const tick = () => {
            const word = words[w];
            i += deleting ? -1 : 1;
            typing.textContent = word.slice(0, i);
            let delay = deleting ? 40 : 85;
            if (!deleting && i === word.length) { deleting = true; delay = 1800; }
            else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 2200);
    }

    // count-up stats
    const countUp = el => {
        const target = +el.dataset.count;
        const fmt = n => n.toLocaleString('en-IN') + (el.dataset.suffix || '');
        if (reduceMotion) { el.textContent = fmt(target); return; }
        const start = performance.now(), dur = 1400;
        const step = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // reveal on scroll
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('[data-count]').forEach(countUp);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // active nav link
    const links = [...menu.querySelectorAll('a')];
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

    // project filters
    const filters = document.querySelectorAll('.filter');
    const projects = document.querySelectorAll('.project[data-cat]');
    filters.forEach(btn => btn.addEventListener('click', () => {
        filters.forEach(b => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-pressed', b === btn);
        });
        const f = btn.dataset.filter;
        projects.forEach(p => {
            const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
            p.classList.toggle('hidden', !show);
            if (show) p.classList.add('visible');
        });
    }));

    // copy email
    const copyBtn = document.querySelector('.copy-email');
    copyBtn.addEventListener('click', async () => {
        const label = copyBtn.querySelector('span');
        try {
            await navigator.clipboard.writeText('piyushpushkar1001@gmail.com');
            label.textContent = 'Copied!';
        } catch (e) {
            label.textContent = 'piyushpushkar1001@gmail.com';
        }
        setTimeout(() => { label.textContent = 'Copy email'; }, 2000);
    });

    document.getElementById('year').textContent = new Date().getFullYear();
})();
