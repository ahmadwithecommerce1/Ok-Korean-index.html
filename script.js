document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. PRE-LOADER (Loading Screen Fix)
       ========================================= */
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
            }
        }, 2000); 
    });

    /* =========================================
       2. MOBILE MENU TOGGLE
       ========================================= */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    /* =========================================
       3. LIVE CLOCKS (Korea -> Pakistan Fade)
       ========================================= */
    const timeDisplay = document.getElementById('time-display');
    let showKorea = true;

    function updateTimeWidget() {
        if (!timeDisplay) return;

        const now = new Date();
        const krTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: true });
        const pkTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true });

        const timeToShow = showKorea ? krTime : pkTime;
        const flagText = showKorea ? 'KR' : 'PK';
        const flagColor = showKorea ? '#0047A0' : '#01411C'; 

        timeDisplay.classList.remove('fade-in');
        timeDisplay.classList.add('fade-out');

        setTimeout(() => {
            timeDisplay.innerHTML = `
                <span class="time-flag" style="background: ${flagColor};">${flagText}</span> 
                <span>${timeToShow}</span>
            `;
            timeDisplay.classList.remove('fade-out');
            timeDisplay.classList.add('fade-in');
            
            showKorea = !showKorea; 
        }, 800); 
    }

    updateTimeWidget();
    setInterval(updateTimeWidget, 4000); 

    /* =========================================
       4. THEME TOGGLE (Dark/Light Mode)
       ========================================= */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* =========================================
       5. SCROLL SPY (Active Nav Menu)
       ========================================= */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* =========================================
       6. SCROLL PROGRESS BAR
       ========================================= */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    /* =========================================
       7. INTERSECTION OBSERVER (Scroll Animations)
       ========================================= */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-up').forEach(el => {
        observer.observe(el);
    });

    /* =========================================
       8. PARALLAX EFFECT (Hero Image)
       ========================================= */
    const heroParallax = document.getElementById('heroParallax');
    window.addEventListener('scroll', () => {
        if (heroParallax) {
            let scrollPosition = window.pageYOffset;
            heroParallax.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

    /* =========================================
       9. ANIMATED COUNTERS (Hero Stats)
       ========================================= */
    const counters = document.querySelectorAll('.hero-stat-num');
    const speed = 200;
    
    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const isDecimal = target % 1 !== 0;
                const inc = target / speed;
                
                if (count < target) {
                    if (isDecimal) {
                        counter.innerText = (count + inc).toFixed(1);
                    } else {
                        counter.innerText = Math.ceil(count + inc);
                    }
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    
    const heroObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            startCounters();
            heroObserver.disconnect();
        }
    });
    
    const heroSection = document.querySelector('.hero');
    if(heroSection) {
        heroObserver.observe(heroSection);
    }

    /* =========================================
       10. FORM VALIDATION & WEB3FORMS SUBMIT
       ========================================= */
    const form = document.getElementById('inquiryForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Pehle validation check karenge
            let isValid = true;
            
            const name = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            if (name.value.trim() === '') { nameError.textContent = 'Name is required.'; isValid = false; } else { nameError.textContent = ''; }
            
            const phone = document.getElementById('phone');
            const phoneError = document.getElementById('phoneError');
            if (phone.value.trim() === '') { phoneError.textContent = 'Phone number is required.'; isValid = false; } else { phoneError.textContent = ''; }
            
            const course = document.getElementById('course');
            const courseError = document.getElementById('courseError');
            if (course.value === '') { courseError.textContent = 'Please select a course.'; isValid = false; } else { courseError.textContent = ''; }
            
            const consent = document.getElementById('consent');
            const consentError = document.getElementById('consentError');
            if (!consent.checked) { consentError.textContent = 'You must agree to be contacted.'; isValid = false; } else { consentError.textContent = ''; }
            
            if (isValid) {
                // Agar validation pass ho jaye, toh form Web3Forms par submit karein
                form.submit(); 
                
                // Submit hone ke baad success message dikhayen
                setTimeout(() => {
                    form.style.display = 'none';
                    formSuccess.style.display = 'block';
                }, 500);
            }
        });
    }

    /* =========================================
       11. TYPEWRITER NOTICE ANIMATION (CURSOR SATH CHALEGA)
       ========================================= */
    const typewriterElement = document.getElementById('typewriter-text');
    
    const messages = [
        "Initializing secure connection to OK Korean Academy...",
        "OEC Balloting Status: Currently NON-ACTIVE. Standby for updates.",
        "Skill Test Preparation: ACTIVE. Batch 0150 registration is open.",
        "EPS TOPIK Language Course: ACTIVE. 450+ students enrolled.",
        "Visa Guidance Services: ACTIVE. Free consultation available.",
        "Latest Update: NUML University 18-Month Program admissions open.",
        "Stay tuned for live OEC and Academy information."
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 30;

    function typeWriter() {
        if (!typewriterElement) return;

        const currentMessage = messages[messageIndex];
        let displayText = "";

        if (isDeleting) {
            charIndex--;
            typeSpeed = 15; 
        } else {
            charIndex++;
            typeSpeed = 30; 
        }

        displayText = currentMessage.substring(0, charIndex);
        
        // Cursor (|) ko text ke sath sath daal diya
        typewriterElement.innerHTML = displayText + '<span class="cursor">|</span>';

        if (!isDeleting && charIndex === currentMessage.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex++;
            if (messageIndex >= messages.length) {
                messageIndex = 0; 
            }
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    setTimeout(typeWriter, 1000);

    /* =========================================
       12. GENERATE 12x12 LED MATRIX DOTS VIA JAVASCRIPT
       ========================================= */
    const matrixLEDs = document.querySelectorAll('.matrix-led');
    
    matrixLEDs.forEach(led => {
        for (let i = 0; i < 143; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            led.appendChild(dot);
        }
    });
});