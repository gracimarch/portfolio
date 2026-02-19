document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const mobileLinks = document.querySelectorAll('a, button');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Delay follower slightly for smooth effect
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effect for links
    mobileLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.border = '1px solid var(--text-main)';
            follower.style.transform = 'translate(-50%, -50%) scale(0)';
        });

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'var(--text-main)';
            cursor.style.border = 'none';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Hero Entry Animation
    const heroElements = [
        document.querySelector('.hero-title'),
        document.querySelector('.hero-subtitle'),
        document.querySelector('.hero-description'),
        document.querySelector('.hero .btn')
    ];

    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'all 0.8s ease-out';
        }, 300 + (index * 200));
    });

    // Parallax Effect
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        document.querySelectorAll('.glow-orb').forEach(orb => {
            const speed = orb.classList.contains('orb-1') ? 2 : 4;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');

        // Animate Links
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeUp 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Scroll Observer for Sections
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // Project Card Glow Effect
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Hero Organic Gradient Animation (Aurora Effect)
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Mouse tracking for interaction
    let mouse = { x: undefined, y: undefined };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Aurora Configuration
    const config = {
        particleCount: 20, // Reduced from 60
        baseSize: 400, // Increased from 200 for a wash/mesh effect
        colors: [
            { h: 230, s: 60, l: 30 }, // Deep Blue
            { h: 260, s: 60, l: 40 }, // Purple
            { h: 300, s: 70, l: 45 }, // Magenta
            { h: 190, s: 80, l: 40 }  // Cyan/Teal
        ],
        speed: 0.001 // Slowed down significantly
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
            // Start at random positions to avoid "bunched" start
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.angle = Math.random() * Math.PI * 2;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * config.baseSize + 200; // Larger range
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.001; // Slower spin

            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.hsla = `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.2)`; // Lower opacity
        }

        update(time) {
            // Organic movement using sine waves
            this.angle += this.spin;
            this.x += Math.cos(this.angle + time * config.speed) * 1.5;
            this.y += Math.sin(this.angle + time * config.speed) * 1.5;

            // Wrap around screen for continuous flow
            if (this.x < -this.size) this.x = width + this.size;
            if (this.x > width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = height + this.size;
            if (this.y > height + this.size) this.y = -this.size;

            // Gentle mouse interaction repulse
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 400) {
                    const force = (400 - dist) / 400;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            // Create a soft, glowing gradient for each particle
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            g.addColorStop(0, this.hsla);
            g.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = g;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time++;

        // Clear with a very slight fade for trailing effect (optional, here we just clear)
        ctx.clearRect(0, 0, width, height);

        // Blending mode for "glow" effect
        ctx.globalCompositeOperation = 'hard-light'; // or 'screen', 'overlay'

        // Draw background base color if needed (optional)
        // ctx.fillStyle = '#050505';
        // ctx.fillRect(0,0,width,height);

        particles.forEach(p => {
            p.update(time);
            p.draw();
        });

        ctx.globalCompositeOperation = 'source-over';
    }

    initParticles();
    animate();

    // Magnetic Buttons Effect (Desktop Only)
    if (window.matchMedia("(hover: hover)").matches) {
        const magneticBtns = document.querySelectorAll('[data-magnetic]');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseenter', () => {
                btn.classList.add('magnetic-active');
            });

            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('magnetic-active');
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Staggered Text Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-text');

    const revealObserverGeneric = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 150); // 150ms delay between elements in the same batch
                revealObserverGeneric.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserverGeneric.observe(el));

    // Language Switcher
    const translations = {
        en: {
            "nav.about": "About",
            "nav.projects": "Projects",
            "nav.skills": "Skills",
            "nav.contact": "Contact",
            "hero.subtitle": "Web Developer & Designer",
            "hero.description": "Designing elegant, interactive, and minimalist digital experiences.",
            "hero.cta": "View Work",
            "about.title": "About Me",
            "about.text": "I am a passionate developer focused on creating smooth, user-centric web experiences. My work blends technical expertise with a keen eye for modern design aesthetics.",
            "projects.title": "Selected Projects",
            "project1.title": "Project One",
            "project1.desc": "A minimalist e-commerce platform.",
            "project2.title": "Project Two",
            "project2.desc": "Interactive portfolio dashboard.",
            "project3.title": "Project Three",
            "project3.desc": "Real-time data visualization app.",
            "projects.view": "View Project",
            "skills.title": "Technical Skills",
            "contact.title": "Get in Touch",
            "contact.name": "Name",
            "contact.email": "Email",
            "contact.message": "Message",
            "contact.send": "Send Message",
            "footer.text": "&copy; 2024 Graciana March. Built with minimalist precision."
        },
        es: {
            "nav.about": "Sobre Mí",
            "nav.projects": "Proyectos",
            "nav.skills": "Habilidades",
            "nav.contact": "Contacto",
            "hero.subtitle": "Desarrolladora Web y Diseñadora",
            "hero.description": "Diseñando experiencias digitales elegantes, interactivas y minimalistas.",
            "hero.cta": "Ver Trabajo",
            "about.title": "Sobre Mí",
            "about.text": "Soy una desarrolladora apasionada enfocada en crear experiencias web fluidas y centradas en el usuario. Mi trabajo combina experiencia técnica con un ojo agudo para la estética del diseño moderno.",
            "projects.title": "Proyectos Seleccionados",
            "project1.title": "Proyecto Uno",
            "project1.desc": "Una plataforma de comercio electrónico minimalista.",
            "project2.title": "Proyecto Dos",
            "project2.desc": "Panel de portafolio interactivo.",
            "project3.title": "Proyecto Tres",
            "project3.desc": "Aplicación de visualización de datos en tiempo real.",
            "projects.view": "Ver Proyecto",
            "skills.title": "Habilidades Técnicas",
            "contact.title": "Contáctame",
            "contact.name": "Nombre",
            "contact.email": "Correo",
            "contact.message": "Mensaje",
            "contact.send": "Enviar Mensaje",
            "footer.text": "&copy; 2024 Graciana March. Construido con precisión minimalista."
        }
    };

    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    function updateLanguage(lang) {
        // Update all text with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update Button Text to show the *other* language option or current?
        // Let's show current state but toggle on click. 
        // If current is EN, button says ES (switch to ES).
        // If current is ES, button says EN (switch to EN).
        langToggle.innerText = lang === 'en' ? 'ES' : 'EN';

        // Save preference
        localStorage.setItem('lang', lang);
        currentLang = lang;
    }

    // Initialize
    updateLanguage(currentLang);

    // Event Listener
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        updateLanguage(newLang);
    });
});
