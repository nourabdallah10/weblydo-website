// ============================================
// Animation Utilities
// ============================================

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Intersection Observer for scroll animations
const createIntersectionObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
            }
        });
    }, { ...defaultOptions, ...options });
};

// Animate element on scroll
const animateOnScroll = (element, delay = 0) => {
    if (prefersReducedMotion) {
        element.classList.add('animate');
        return;
    }
    
    setTimeout(() => {
        element.classList.add('animate');
    }, delay);
};

// ============================================
// Hero Section Animations
// ============================================

const initHeroAnimations = () => {
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    
    if (fadeInElements.length === 0) return;
    
    // Animate all fade-in-up elements with their data-delay
    fadeInElements.forEach((element) => {
        const delay = parseInt(element.dataset.delay) || 0;
        
        if (prefersReducedMotion) {
            element.classList.add('visible');
        } else {
            setTimeout(() => {
                element.classList.add('visible');
            }, delay);
        }
    });
};

// ============================================
// Scroll Animations for Sections
// ============================================

const initScrollAnimations = () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;
    
    // Special handling for solution cards to ensure smooth stagger
    const solutionCards = document.querySelectorAll('.solution-card[data-animate]');
    
    const observer = createIntersectionObserver((entry) => {
        const element = entry.target;
        const delay = parseInt(element.dataset.delay) || 0;
        
        if (!element.classList.contains('animate')) {
            animateOnScroll(element, delay);
        }
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Enhanced observer for solution cards with better timing
    if (solutionCards.length > 0) {
        const cardObserver = createIntersectionObserver((entry) => {
            const card = entry.target;
            const delay = parseInt(card.dataset.delay) || 0;
            
            if (!card.classList.contains('animate') && entry.isIntersecting) {
                if (prefersReducedMotion) {
                    card.classList.add('animate');
                } else {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, delay);
                }
            }
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        });
        
        solutionCards.forEach(card => {
            cardObserver.observe(card);
        });
    }
};

// ============================================
// Number Counter Animation
// ============================================

const animateCounter = (element, target, duration = 2000) => {
    if (prefersReducedMotion) {
        element.textContent = target + (element.dataset.suffix || '');
        return;
    }
    
    const suffix = element.dataset.suffix || '';
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    updateCounter();
};

const initCounterAnimations = () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target], .stat-number-methodology[data-target]');
    
    if (statNumbers.length === 0) return;
    
    const observer = createIntersectionObserver((entry) => {
        const element = entry.target;
        const target = parseInt(element.dataset.target);
        
        if (!element.classList.contains('counted')) {
            element.classList.add('counted');
            animateCounter(element, target);
        }
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
};

// ============================================
// Mobile Navigation Menu Toggle
// ============================================

const initMobileMenu = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const nav = document.querySelector('.nav');
    
    if (!navToggle || !navLinks || !nav) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Function to close menu
    const closeMenu = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('nav-links-open');
        navToggle.classList.remove('nav-toggle-active');
        document.body.classList.remove('nav-menu-open');
    };
    
    // Function to toggle menu
    const toggleMenu = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        navToggle.setAttribute('aria-expanded', newState);
        if (newState) {
            navLinks.classList.add('nav-links-open');
            navToggle.classList.add('nav-toggle-active');
            document.body.classList.add('nav-menu-open');
        } else {
            closeMenu();
        }
    };
    
    // Add click handler to toggle button
    navToggle.addEventListener('click', toggleMenu);
    navToggle.addEventListener('touchend', toggleMenu); // For touch devices
    
    // Close menu when clicking on a nav link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('nav-links-open')) {
            if (!nav.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('nav-links-open')) {
            closeMenu();
        }
    });
};

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

const initSmoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
};

// ============================================
// Navigation Scroll Effect
// ============================================

const initNavScrollEffect = () => {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 14, 39, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 14, 39, 0.8)';
        }
        
        // Hide/show nav on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    };
    
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
};

// ============================================
// Form Handling
// ============================================

const initFormHandling = () => {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.textContent;
        const originalBackground = submitButton.style.background;
        
        // Get form values
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const whatsapp = contactForm.querySelector('#whatsapp').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        
        // Validate required fields
        if (!name || !email || !message) {
            submitButton.textContent = 'Please fill required fields';
            submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = originalBackground;
            }, 3000);
            return;
        }
        
        // Update button state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Prepare form data for Web3Forms API
            const formData = new URLSearchParams();
            formData.append('access_key', 'd6b7dcb3-3de6-41de-99d9-2d7176f8c587');
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            
            // Add WhatsApp number if provided
            if (whatsapp) {
                formData.append('whatsapp number', whatsapp);
            }
            
            // Send to Web3Forms API
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                    submitButton.style.background = originalBackground;
            }, 3000);
            } else {
                // Error from API
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            // Handle errors
            console.error('Form submission error:', error);
            submitButton.textContent = 'Error sending message. Please try again.';
            submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = originalBackground;
            }, 3000);
        }
    });
};

// ============================================
// Card Hover Effects Enhancement
// ============================================

const initCardEffects = () => {
    const cards = document.querySelectorAll('.solution-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion) {
                card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    });
};

// ============================================
// Parallax Effect for Hero Background
// ============================================

const initParallaxEffect = () => {
    if (prefersReducedMotion) return;
    
    const heroBackground = document.querySelector('.hero-background');
    const shapes = document.querySelectorAll('.shape');
    
    if (!heroBackground) return;
    
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${rate}px)`;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                shape.style.transform = `translateY(${rate * speed}px)`;
            });
        }
    };
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
};

// ============================================
// Interactive Demo Tab Switching
// ============================================

const initDemoTabs = () => {
    const tabs = document.querySelectorAll('.demo-tab');
    const panels = document.querySelectorAll('.demo-panel');
    
    if (tabs.length === 0 || panels.length === 0) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    const switchTab = (targetIndex, direction = 'right') => {
        if (isTransitioning || targetIndex === currentIndex) return;
        
        isTransitioning = true;
        const currentPanel = panels[currentIndex];
        const targetPanel = panels[targetIndex];
        
        // Update tab states
        tabs[currentIndex].classList.remove('active');
        tabs[currentIndex].setAttribute('aria-selected', 'false');
        tabs[targetIndex].classList.add('active');
        tabs[targetIndex].setAttribute('aria-selected', 'true');
        
        // Hide current panel
        currentPanel.setAttribute('hidden', '');
        currentPanel.classList.remove('active');
        
        // Determine slide direction
        const slideOutClass = direction === 'right' ? 'slide-out-left' : 'slide-out-right';
        currentPanel.classList.add(slideOutClass);
        
        // Show target panel
        targetPanel.removeAttribute('hidden');
        
        // Small delay for crossfade effect
        setTimeout(() => {
            targetPanel.classList.add('active');
            
            // Reset current panel after animation
            setTimeout(() => {
                currentPanel.classList.remove('slide-out-left', 'slide-out-right');
                isTransitioning = false;
            }, 600);
        }, 50);
        
        currentIndex = targetIndex;
    };
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const direction = index > currentIndex ? 'right' : 'left';
            switchTab(index, direction);
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const direction = index > currentIndex ? 'right' : 'left';
                switchTab(index, direction);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % tabs.length;
                switchTab(nextIndex, 'right');
                tabs[nextIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (index - 1 + tabs.length) % tabs.length;
                switchTab(prevIndex, 'left');
                tabs[prevIndex].focus();
            }
        });
    });
};

// ============================================
// Testimonials Carousel
// ============================================

const initTestimonialsCarousel = () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carouselContainer || cards.length === 0) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    const updateCarousel = (newIndex) => {
        if (isTransitioning || newIndex === currentIndex) return;
        if (newIndex < 0 || newIndex >= cards.length) return;
        
        isTransitioning = true;
        
        // Remove active class from current card
        const currentCard = cards[currentIndex];
        const currentIndicator = indicators[currentIndex];
        
        if (currentCard) {
            currentCard.classList.remove('active');
        }
        if (currentIndicator) {
            currentIndicator.classList.remove('active');
            currentIndicator.setAttribute('aria-selected', 'false');
        }
        
        // Update index
        currentIndex = newIndex;
        
        // Update container transform with spring-like easing
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Add active class to new card
        const newCard = cards[currentIndex];
        const newIndicator = indicators[currentIndex];
        
        if (newCard) {
            // Small delay to ensure smooth transition
            requestAnimationFrame(() => {
                newCard.classList.add('active');
            });
        }
        
        if (newIndicator) {
            newIndicator.classList.add('active');
            newIndicator.setAttribute('aria-selected', 'true');
        }
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    };
    
    const goToNext = () => {
        const nextIndex = (currentIndex + 1) % cards.length;
        updateCarousel(nextIndex);
    };
    
    const goToPrev = () => {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel(prevIndex);
    };
    
    const goToIndex = (index) => {
        if (index >= 0 && index < cards.length) {
            updateCarousel(index);
        }
    };
    
    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNext();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToPrev();
        });
    }
    
    // Indicator event listeners
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            goToIndex(index);
        });
    });
    
    // Keyboard navigation
    const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            }
        });
        
        // Make carousel focusable for keyboard navigation
        carouselWrapper.setAttribute('tabindex', '0');
    }
    
    // Auto-play
    let autoPlayInterval = null;
    
    const startAutoPlay = () => {
        if (autoPlayInterval) return;
        autoPlayInterval = setInterval(() => {
            if (!isTransitioning) {
                goToNext();
            }
        }, 5000);
    };
    
    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };
    
    // Pause on hover
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        carouselWrapper.addEventListener('focusin', stopAutoPlay);
        carouselWrapper.addEventListener('focusout', startAutoPlay);
    }
    
    // Start auto-play after initial load
    setTimeout(startAutoPlay, 3000);
    
    // Ensure first card is active on load
    if (cards.length > 0 && !cards[0].classList.contains('active')) {
        cards[0].classList.add('active');
    }
    
    // Set initial transform to ensure first card is visible
    if (carouselContainer) {
        carouselContainer.style.transform = 'translateX(0%)';
    }
};

// ============================================
// Final CTA Particle Effects
// ============================================

const initCTAParticles = () => {
    const ctaButton = document.getElementById('main-cta-button');
    const canvas = ctaButton?.querySelector('.particle-canvas');
    
    if (!ctaButton || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;
    let isHovering = false;
    
    // Set canvas size
    const updateCanvasSize = () => {
        const rect = ctaButton.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.startX = x;
            this.startY = y;
            
            // Polar coordinates for natural spread
            const angle = Math.random() * Math.PI * 2; // Random angle (0 to 2π)
            const speed = 2 + Math.random() * 3; // Random speed
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.life = 1.0;
            this.decay = 0.02 + Math.random() * 0.02;
            this.size = 2 + Math.random() * 3;
            this.color = `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98; // Friction
            this.vy *= 0.98;
            this.life -= this.decay;
        }
        
        draw() {
            if (this.life <= 0) return;
            
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        isDead() {
            return this.life <= 0;
        }
    }
    
    // Create particles
    const createParticles = (event) => {
        const rect = ctaButton.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Create multiple particles
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(centerX, centerY));
        }
    };
    
    // Animation loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].isDead()) {
                particles.splice(i, 1);
            }
        }
        
        if (particles.length > 0 || isHovering) {
            animationFrameId = requestAnimationFrame(animate);
        }
    };
    
    // Mouse move handler for continuous particles
    let lastParticleTime = 0;
    const handleMouseMove = (event) => {
        if (!isHovering) return;
        
        const now = Date.now();
        if (now - lastParticleTime > 50) { // Create particles every 50ms
            createParticles(event);
            lastParticleTime = now;
        }
    };
    
    // Event listeners
    ctaButton.addEventListener('mouseenter', () => {
        isHovering = true;
        updateCanvasSize();
        createParticles();
        if (!animationFrameId) {
            animate();
        }
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        isHovering = false;
        // Let existing particles fade out naturally
    });
    
    ctaButton.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
};

// ============================================
// Cinematic Opening Animation
// ============================================
/*
 * HOW THE ANIMATION WORKS:
 * 
 * 1. WINDOW OPENING EFFECT:
 *    - Uses CSS clip-path property to create a "window" that opens from center
 *    - Initial state: clip-path polygon at 50% (centered, closed)
 *    - Opening state: clip-path expands to 0% and 100% (full width, open)
 *    - Smooth transition using cubic-bezier easing for cinematic feel
 * 
 * 2. LOGO SPLIT EFFECT:
 *    - Logo "Weblydo" is split into two parts: "Web" (left) and "lydo" (right)
 *    - Initially positioned together in center
 *    - As window opens, "Web" translates left (negative X), "lydo" translates right (positive X)
 *    - Both halves fade out (opacity 0) as they move to edges
 *    - Uses transform translateX for hardware-accelerated animation
 * 
 * 3. TIMING VALUES TO TWEAK:
 *    - OPENING_DURATION: How long the window takes to open (default: 1250ms / 1.25s)
 *      Increase for slower, more dramatic effect
 *      Decrease for snappier feel
 * 
 *    - LOGO_FADE_DELAY: When logo halves start fading out (default: 650ms)
 *      Increase to keep logo visible longer
 *      Decrease to fade out sooner
 *      Should be roughly half of OPENING_DURATION for best effect
 * 
 *    - FADE_OUT_DURATION: How long overlay takes to fade out (default: 500ms)
 *      Increase for slower fade
 *      Decrease for quicker transition to content
 * 
 *    - TOTAL_DURATION: Total animation time (OPENING_DURATION + buffer)
 *      Buffer ensures opening completes before fade starts
 * 
 * 4. EASING FUNCTIONS (in CSS):
 *    - Window opening: cubic-bezier(0.77, 0, 0.175, 1) - smooth, cinematic
 *      Change in styles.css .intro-overlay transition property
 *    - Logo movement: Same easing as window for synchronization
 *    - Fade out: cubic-bezier(0.4, 0, 0.2, 1) - standard material design easing
 */

const initIntroAnimation = () => {
    const overlay = document.getElementById('intro-overlay');
    const body = document.body;
    
    if (!overlay) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user prefers reduced motion, skip animation
    if (prefersReducedMotion) {
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        body.classList.add('intro-complete'); // Show content immediately
        // Still initialize other features
        initHeroAnimations();
        initScrollAnimations();
        initCounterAnimations();
        initSmoothScroll();
        initNavScrollEffect();
        initFormHandling();
        initCardEffects();
        initParallaxEffect();
        initDemoTabs();
        initTestimonialsCarousel();
        initCTAParticles();
        initMethodologyConnector();
        initSpiderNetworks();
        // Initialize mobile menu after everything is ready
        setTimeout(() => {
            initMobileMenu();
        }, 200);
        return;
    }
    
    // Prevent interaction with main content during animation
    body.classList.add('intro-active');
    
    // ⚙️ ANIMATION TIMING CONSTANTS - Tweak these values to customize timing
    const OPENING_DURATION = 1250;      // Duration of window opening (ms) - Default: 1250 (1.25s)
    const LOGO_FADE_DELAY = 650;        // When logo starts fading (ms) - Default: 650 (mid-animation)
    const FADE_OUT_DURATION = 500;      // Overlay fade out duration (ms) - Default: 500 (0.5s)
    const INITIAL_DELAY = 100;          // Initial delay before starting (ms) - Default: 100
    const TOTAL_DURATION = OPENING_DURATION + 200; // Total animation duration with buffer
    
    // Start opening animation after a tiny delay to ensure smooth start
    requestAnimationFrame(() => {
        setTimeout(() => {
            overlay.classList.add('opening');
            
            // After opening completes, fade out the overlay
            setTimeout(() => {
                overlay.classList.add('fade-out');
                
                // After fade out completes, hide overlay and enable interactions
                setTimeout(() => {
                    overlay.classList.add('open', 'hidden');
                    overlay.setAttribute('aria-hidden', 'true');
                    body.classList.remove('intro-active');
                    body.classList.add('intro-complete'); // Mark intro as complete to show content
                    
                    // Initialize rest of site animations after intro completes
                    initHeroAnimations();
                    initScrollAnimations();
                    initCounterAnimations();
                    initSmoothScroll();
                    initNavScrollEffect();
                    initFormHandling();
                    initCardEffects();
                    initParallaxEffect();
                    initDemoTabs();
                    initTestimonialsCarousel();
                    initCTAParticles();
                    initMethodologyConnector();
                    initSpiderNetworks();
                    // Initialize mobile menu after everything is ready
                    setTimeout(() => {
                        initMobileMenu();
                    }, 200);
                }, FADE_OUT_DURATION);
            }, TOTAL_DURATION);
        }, INITIAL_DELAY); // Small initial delay for smooth start
    });
};

// ============================================
// Initialize Everything
// ============================================

const init = () => {
    // Initialize intro animation first - it will control when other features start
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initIntroAnimation();
        });
    } else {
        // DOM is already loaded
        initIntroAnimation();
    }
};

// Start initialization
init();

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any size-dependent animations if needed
    }, 250);
});

// ============================================
// Cursor Effects
// ============================================

const initCursorEffects = () => {
    // Only run on desktop/tablet (not mobile)
    if (window.innerWidth <= 768) {
        return;
    }

    // Get cursor elements
    const cursorCircle = document.getElementById('cursor-circle');
    const cursorCircleSecondary = document.getElementById('cursor-circle-secondary');
    const trailContainer = document.getElementById('cursor-trail');
    const particlesContainer = document.getElementById('cursor-particles');

    // Check if elements exist
    if (!cursorCircle || !cursorCircleSecondary || !trailContainer || !particlesContainer) {
        return;
    }

    // Settings state - same for all languages
    const settings = {
        particlesEnabled: true,
        trailEnabled: true,
        circleSize: 20, // Same size for all languages
        animationSpeed: 5,
        showSettings: false
    };

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;
    let circleSecondaryX = 0;
    let circleSecondaryY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;

    // Animation frame ID for smooth updates
    let animationFrameId = null;



    // Calculate mouse speed for dynamic effects
    const calculateMouseSpeed = (x, y) => {
        const deltaX = x - lastMouseX;
        const deltaY = y - lastMouseY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseSpeed = calculateMouseSpeed(mouseX, mouseY);
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        // Create trail circles
        if (settings.trailEnabled && mouseSpeed > 2) {
            createTrailCircle(mouseX, mouseY);
        }

        // Create particles at regular intervals
        if (settings.particlesEnabled) {
            createParticle(mouseX, mouseY);
        }
    });

    // Create trail circle
    const createTrailCircle = (x, y) => {
        const trailCircle = document.createElement('div');
        trailCircle.className = 'trail-circle';
        trailCircle.style.left = x + 'px';
        trailCircle.style.top = y + 'px';
        trailContainer.appendChild(trailCircle);

        // Remove after animation
        setTimeout(() => {
            trailCircle.remove();
        }, 600);
    };

    // Create particle effect
    let lastParticleTime = 0;
    const createParticle = (x, y) => {
        const now = Date.now();
        if (now - lastParticleTime < 50) return; // Limit particle creation rate
        lastParticleTime = now;

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Randomize particle appearance
        const size = 3 + Math.random() * 3;
        const colorVariation = Math.random();
        const hue = 200 + colorVariation * 60; // Blue to cyan range
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = `hsl(${hue}, 70%, 60%)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 70%, 60%)`;

        particlesContainer.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 1000);
    };

    // Smooth animation loop using requestAnimationFrame
    const animate = () => {
        // Calculate easing for smooth following
        const speedFactor = settings.animationSpeed / 5;
        const ease1 = 0.15 * speedFactor; // Main circle ease
        const ease2 = 0.08 * speedFactor; // Secondary circle ease (more lag)

        // Update main circle position with easing
        circleX += (mouseX - circleX) * ease1;
        circleY += (mouseY - circleY) * ease1;

        // Update secondary circle position with more lag
        circleSecondaryX += (mouseX - circleSecondaryX) * ease2;
        circleSecondaryY += (mouseY - circleSecondaryY) * ease2;

        // Apply transforms - ensure consistent behavior in all languages
        // Use left/top positioning with centering transform for proper display
        cursorCircle.style.left = circleX + 'px';
        cursorCircle.style.top = circleY + 'px';
        cursorCircle.style.transform = 'translate(-50%, -50%)';
        
        cursorCircleSecondary.style.left = circleSecondaryX + 'px';
        cursorCircleSecondary.style.top = circleSecondaryY + 'px';
        cursorCircleSecondary.style.transform = 'translate(-50%, -50%)';
        
        // Ensure both circles are visible and properly styled
        cursorCircle.style.opacity = '1';
        cursorCircleSecondary.style.opacity = '1';
        cursorCircle.style.display = 'block';
        cursorCircleSecondary.style.display = 'block';
        cursorCircle.style.visibility = 'visible';
        cursorCircleSecondary.style.visibility = 'visible';

        // Dynamic size based on mouse speed - same for all languages
        const minSize = 20;
        const maxSize = 30;
        const speedBasedSize = Math.max(minSize, Math.min(maxSize, settings.circleSize + mouseSpeed * 0.3));
        cursorCircle.style.width = speedBasedSize + 'px';
        cursorCircle.style.height = speedBasedSize + 'px';

        animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .btn-contact-green, .btn-hero, .solution-card, .stat-card');
    
    interactiveElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            cursorCircle.classList.add('hover');
            cursorCircleSecondary.classList.add('hover');
            
            // Create burst of particles on hover
            if (settings.particlesEnabled) {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const rect = element.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        createParticle(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50);
                    }, i * 50);
                }
            }
        });

        element.addEventListener('mouseleave', () => {
            cursorCircle.classList.remove('hover');
            cursorCircleSecondary.classList.remove('hover');
        });
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorCircle.style.opacity = '0';
        cursorCircleSecondary.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorCircle.style.opacity = '1';
        cursorCircleSecondary.style.opacity = '1';
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
};

// Initialize cursor effects after page loads
const initAll = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for intro animation to complete
            setTimeout(() => {
                initCursorEffects();
            }, 2000);
        });
    } else {
        setTimeout(() => {
            initCursorEffects();
        }, 2000);
    }
};

// ============================================
// Methodology Connector Path Animation
// ============================================

const initMethodologyConnector = () => {
    const gridWrapper = document.querySelector('.methodology-grid-wrapper');
    const grid = document.querySelector('.methodology-grid');
    const svg = document.querySelector('.methodology-connector-svg');
    const path = document.querySelector('.connector-path');
    
    if (!gridWrapper || !grid || !svg || !path) return;
    
    const updatePath = () => {
        const cards = grid.querySelectorAll('.methodology-card');
        if (cards.length < 6) return;
        
        const gridRect = grid.getBoundingClientRect();
        const wrapperRect = gridWrapper.getBoundingClientRect();
        
        // Calculate card center positions
        const getCardCenter = (card, index) => {
            const cardRect = card.getBoundingClientRect();
            const relativeX = cardRect.left - wrapperRect.left + cardRect.width / 2;
            const relativeY = cardRect.top - wrapperRect.top + cardRect.height / 2;
            return { x: relativeX, y: relativeY };
        };
        
        const card1 = getCardCenter(cards[0], 0);
        const card2 = getCardCenter(cards[1], 1);
        const card3 = getCardCenter(cards[2], 2);
        const card4 = getCardCenter(cards[3], 3);
        const card5 = getCardCenter(cards[4], 4);
        const card6 = getCardCenter(cards[5], 5);
        
        // Calculate vertical spacing for turns (between rows)
        const verticalSpacing = 195; // Increased for more downward movement
        const horizontalSpacing = 30;
        const extraDownMovement = 80; // Additional downward movement before turning left
        
        // Calculate midpoints for smooth transitions
        // After card 3, go down more before turning left
        const midY1 = card3.y + verticalSpacing;
        const midY1Extended = midY1 + extraDownMovement; // Move down more before turning left
        const midX = card4.x - horizontalSpacing;
        const midY2 = card4.y;
        
        // Create path following the sequence:
        // Card 1 → Card 2 → Card 3 → down (more) → left → down → Card 4 → Card 5 → Card 6
        const pathData = `
            M ${card1.x} ${card1.y}
            L ${card2.x} ${card2.y}
            L ${card3.x} ${card3.y}
            L ${card3.x} ${midY1Extended}
            L ${midX} ${midY1Extended}
            L ${midX} ${midY2}
            L ${card4.x} ${midY2}
            L ${card4.x} ${card4.y}
            L ${card5.x} ${card5.y}
            L ${card6.x} ${card6.y}
        `.replace(/\s+/g, ' ').trim();
        
        // Update SVG viewBox to match wrapper size
        svg.setAttribute('viewBox', `0 0 ${wrapperRect.width} ${wrapperRect.height}`);
        svg.setAttribute('width', wrapperRect.width);
        svg.setAttribute('height', wrapperRect.height);
        
        // Update path
        path.setAttribute('d', pathData);
        path.setAttribute('id', 'connector-path'); // Ensure ID is set for ball animation
        
        // Calculate total path length for animation
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        
        // Update ball animation
        const ball = svg.querySelector('.path-ball');
        if (ball) {
            const animateMotion = ball.querySelector('animateMotion');
            if (animateMotion) {
                // Restart ball animation
                animateMotion.setAttribute('begin', '1s');
                animateMotion.beginElement();
            } else {
                // Create animateMotion if it doesn't exist
                const newAnimateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
                newAnimateMotion.setAttribute('dur', '6s');
                newAnimateMotion.setAttribute('repeatCount', 'indefinite');
                newAnimateMotion.setAttribute('begin', '1s');
                const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
                mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#connector-path');
                newAnimateMotion.appendChild(mpath);
                ball.appendChild(newAnimateMotion);
            }
        }
        
        // Trigger path drawing animation
        requestAnimationFrame(() => {
            path.style.animation = 'none';
            setTimeout(() => {
                path.style.animation = `drawPath 4s ease-in-out forwards`;
            }, 10);
        });
    };
    
    // Initial calculation
    const initPath = () => {
        // Wait for cards to be positioned
        setTimeout(() => {
            updatePath();
        }, 500);
    };
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updatePath();
        }, 250);
    });
    
    // Update when cards animate in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    updatePath();
                }, 300);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(grid);
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPath);
    } else {
        initPath();
    }
};

// ============================================
// Spider Network Effect - Background Animation
// ============================================
//
// INTEGRATION NOTES:
// - Creates animated particle networks on left and right edges
// - Networks fade toward center, keeping center area clean
// - Positioned behind all content (z-index: 1)
// - Does not interfere with existing JavaScript functionality
// - Initialized after intro animation completes
//
// CONFIGURATION:
// - Adjust nodeCount, connectionDistance, nodeSpeed below
// - Colors match existing theme (accent-primary, accent-tertiary)
// - Performance optimized with dynamic node count based on screen size

class SpiderNetwork {
    constructor(canvasId, side) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.side = side; // 'left' or 'right'
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: -1000, y: -1000 }; // Start off-screen
        this.animationFrame = null;
        
        // Dynamic configuration based on screen size
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        // Configuration - Active Spider Web with Continuous Random Movement
        this.config = {
            anchorPoints: isMobile ? 3 : isTablet ? 4 : 5, // Number of anchor points on edge
            linesPerAnchor: isMobile ? 4 : isTablet ? 5 : 6, // Straight lines from each anchor
            nodesPerLine: isMobile ? 5 : isTablet ? 6 : 7, // Nodes along each line
            nodeRadius: 2,
            lineWidth: 0.5,
            lineLength: 0.6, // How far lines extend (60% of canvas width)
            nodeSpeed: 0.8, // Faster continuous movement
            randomMovement: 0.6, // Random movement strength
            repulsionRadius: 80,
            repulsionStrength: 0.4,
            // Colors match existing theme variables
            colors: {
                node: 'rgba(79, 156, 249, 0.7)',      // accent-primary
                lineStart: 'rgba(79, 156, 249, 0.3)',
                lineEnd: 'rgba(0, 212, 255, 0.15)'     // accent-tertiary
            }
        };
        
        this.init();
    }
    
    init() {
        // Ensure canvas exists and is visible
        if (!this.canvas) return;
        
        this.canvas.style.opacity = '1';
        this.canvas.style.display = 'block';
        this.canvas.style.visibility = 'visible';
        
        this.resize();
        this.createNodes();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        // Use viewport height to keep canvas fixed in viewport
        const viewportHeight = window.innerHeight;
        
        // Ensure we have valid dimensions
        const canvasWidth = rect.width > 0 ? rect.width : (this.side === 'left' ? window.innerWidth * 0.25 : window.innerWidth * 0.25);
        const canvasHeight = viewportHeight > 0 ? viewportHeight : window.innerHeight;
        
        this.canvas.width = canvasWidth * dpr;
        this.canvas.height = canvasHeight * dpr;
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.width = canvasWidth;
        this.height = canvasHeight; // Always use viewport height, not document height
        
        // Ensure canvas is visible
        this.canvas.style.opacity = '1';
        this.canvas.style.display = 'block';
        this.canvas.style.visibility = 'visible';
    }
    
    createNodes() {
        this.nodes = [];
        this.anchors = [];
        this.webStructure = [];
        
        // Create anchor points along the edge (left or right)
        const edgeX = this.side === 'left' ? 0 : this.width;
        const anchorSpacing = this.height / (this.config.anchorPoints + 1);
        
        // Generate anchor points with straight lines extending from them
        for (let a = 0; a < this.config.anchorPoints; a++) {
            const anchorY = anchorSpacing * (a + 1) + (Math.random() - 0.5) * anchorSpacing * 0.2; // Slight random offset
            const anchor = {
                x: edgeX,
                y: anchorY,
                id: a,
                nodes: [],
                baseY: anchorY // Store base Y position
            };
            this.anchors.push(anchor);
            
            // Create straight lines extending from anchor (not curved)
            // Lines extend in different directions but are straight
            const angleStep = (Math.PI * 0.7) / (this.config.linesPerAnchor - 1); // 70% of semicircle
            const startAngle = this.side === 'left' 
                ? -Math.PI * 0.35  // Left: angles from -63° to +63°
                : Math.PI * 1.35;   // Right: angles from 117° to 243°
            
            for (let l = 0; l < this.config.linesPerAnchor; l++) {
                const angle = startAngle + (angleStep * l);
                const lineNodes = [];
                
                // Create nodes along this straight line
                for (let n = 0; n < this.config.nodesPerLine; n++) {
                    const distance = (n + 1) * (this.width * this.config.lineLength) / this.config.nodesPerLine;
                    const x = anchor.x + Math.cos(angle) * distance;
                    const y = anchor.y + Math.sin(angle) * distance;
                    
                    // Ensure nodes stay within canvas bounds
                    if (x >= -10 && x <= this.width + 10 && y >= -10 && y <= this.height + 10) {
                        const node = {
                            x: x,
                            y: y,
                            baseX: x, // Base position for random movement
                            baseY: y,
                            anchorId: a,
                            lineId: l,
                            nodeId: n,
                            vx: (Math.random() - 0.5) * this.config.nodeSpeed, // Random initial velocity
                            vy: (Math.random() - 0.5) * this.config.nodeSpeed,
                            radius: this.config.nodeRadius + Math.random() * 0.5,
                            edgeDistance: this.side === 'left' ? x : this.width - x,
                            isAnchor: n === 0 && l === 0, // First node of first line is at anchor
                            distanceFromAnchor: distance,
                            angle: angle, // Store line angle
                            randomOffsetX: (Math.random() - 0.5) * 20, // Random offset for movement
                            randomOffsetY: (Math.random() - 0.5) * 20,
                            randomPhase: Math.random() * Math.PI * 2 // Random phase for smooth movement
                        };
                        this.nodes.push(node);
                        anchor.nodes.push(node);
                        lineNodes.push(node);
                    }
                }
                
                this.webStructure.push({
                    anchorId: a,
                    lineId: l,
                    nodes: lineNodes,
                    angle: angle
                });
            }
        }
    }
    
    setupEventListeners() {
        // Throttled resize handler for performance
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                // Recalculate config based on new screen size
                const isMobile = window.innerWidth < 768;
                const isTablet = window.innerWidth < 1024;
                this.config.anchorPoints = isMobile ? 3 : isTablet ? 4 : 5;
                this.config.linesPerAnchor = isMobile ? 4 : isTablet ? 5 : 6;
                this.config.nodesPerLine = isMobile ? 5 : isTablet ? 6 : 7;
                this.createNodes(); // Recreate web structure
            }, 250);
        };
        window.addEventListener('resize', handleResize);
        
        // Mouse tracking (only within canvas bounds for performance)
        const handleMouseMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            } else {
                // Move mouse off-screen when outside canvas
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        // No scroll tracking needed - networks are fixed in viewport
        // Removed parallax effect to keep networks always visible
    }
    
    updateNodes() {
        // Update anchors (keep them fixed at edge)
        this.anchors.forEach(anchor => {
            anchor.y = anchor.baseY; // Keep anchors fixed
        });
        
        // Update all nodes with continuous random movement
        this.nodes.forEach(node => {
            // Continuous random movement using sine waves for smooth motion
            const time = Date.now() * 0.001; // Convert to seconds
            const randomX = Math.sin(time * 0.5 + node.randomPhase) * this.config.randomMovement * 15;
            const randomY = Math.cos(time * 0.7 + node.randomPhase * 1.3) * this.config.randomMovement * 15;
            
            // Add additional random velocity
            node.vx += (Math.random() - 0.5) * this.config.nodeSpeed * 0.4;
            node.vy += (Math.random() - 0.5) * this.config.nodeSpeed * 0.4;
            
            // Mouse interaction (gentle repulsion)
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const mouseDistance = Math.sqrt(dx * dx + dy * dy);
            
            if (mouseDistance < this.config.repulsionRadius && mouseDistance > 0) {
                const force = (this.config.repulsionRadius - mouseDistance) / this.config.repulsionRadius;
                const angle = Math.atan2(dy, dx);
                node.vx -= Math.cos(angle) * force * this.config.repulsionStrength * 0.01;
                node.vy -= Math.sin(angle) * force * this.config.repulsionStrength * 0.01;
            }
            
            // Spring back toward base position along the line (maintains straight line structure)
            const baseX = node.baseX + randomX;
            const baseY = node.baseY + randomY;
            
            const springX = (baseX - node.x) * 0.06;
            const springY = (baseY - node.y) * 0.06;
            node.vx += springX;
            node.vy += springY;
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Keep nodes within viewport bounds (allow slight overflow for natural look)
            if (this.side === 'left') {
                if (node.x < -15) {
                    node.x = -15;
                    node.vx *= -0.5; // Bounce back
                }
                if (node.x > this.width * this.config.lineLength + 15) {
                    node.x = this.width * this.config.lineLength + 15;
                    node.vx *= -0.5;
                }
            } else {
                if (node.x > this.width + 15) {
                    node.x = this.width + 15;
                    node.vx *= -0.5;
                }
                if (node.x < this.width * (1 - this.config.lineLength) - 15) {
                    node.x = this.width * (1 - this.config.lineLength) - 15;
                    node.vx *= -0.5;
                }
            }
            
            // Keep Y within reasonable bounds
            if (node.y < -20) {
                node.y = -20;
                node.vy *= -0.5;
            }
            if (node.y > this.height + 20) {
                node.y = this.height + 20;
                node.vy *= -0.5;
            }
            
            // Update edge distance for fade calculation
            node.edgeDistance = this.side === 'left' ? node.x : this.width - node.x;
            
            // Damping (less damping = more continuous movement)
            node.vx *= 0.96;
            node.vy *= 0.96;
        });
    }
    
    findConnections() {
        this.connections = [];
        
        // Connect nodes along straight lines (main structure)
        this.webStructure.forEach(line => {
            for (let i = 0; i < line.nodes.length - 1; i++) {
                const from = line.nodes[i];
                const to = line.nodes[i + 1];
                if (from && to) {
                    const distance = Math.sqrt(
                        Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
                    );
                    this.connections.push({
                        from: from,
                        to: to,
                        distance: distance,
                        opacity: 0.7, // Strong connection along lines
                        type: 'line'
                    });
                }
            }
        });
        
        // Connect nearby nodes from different lines (cross-connections)
        this.anchors.forEach(anchor => {
            for (let i = 0; i < anchor.nodes.length; i++) {
                for (let j = i + 1; j < anchor.nodes.length; j++) {
                    const from = anchor.nodes[i];
                    const to = anchor.nodes[j];
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Connect if nodes are close and from different lines
                    if (distance < this.width * 0.2 && from.lineId !== to.lineId) {
                        this.connections.push({
                            from: from,
                            to: to,
                            distance: distance,
                            opacity: 0.3 * (1 - distance / (this.width * 0.2)), // Fade with distance
                            type: 'cross'
                        });
                    }
                }
            }
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connections (straight lines)
        this.connections.forEach(conn => {
            // Calculate opacity based on distance from edge (fade toward center)
            const fromEdgeDist = Math.min(conn.from.edgeDistance, conn.to.edgeDistance);
            const maxEdgeDist = this.width * this.config.lineLength;
            const edgeFade = Math.max(0, 1 - (fromEdgeDist / maxEdgeDist) * 1.2);
            
            // Different line styles
            let lineWidth = this.config.lineWidth;
            if (conn.type === 'line') {
                lineWidth = this.config.lineWidth * 1.1; // Thicker for main lines
            } else if (conn.type === 'cross') {
                lineWidth = this.config.lineWidth * 0.7; // Thinner for cross-connections
            }
            
            const gradient = this.ctx.createLinearGradient(
                conn.from.x, conn.from.y,
                conn.to.x, conn.to.y
            );
            gradient.addColorStop(0, this.config.colors.lineStart);
            gradient.addColorStop(1, this.config.colors.lineEnd);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = lineWidth;
            this.ctx.globalAlpha = conn.opacity * edgeFade;
            
            // Draw straight line
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
        });
        
        // Draw anchor points (slightly larger and brighter)
        this.anchors.forEach(anchor => {
            const edgeFade = 1; // Anchors always visible
            this.ctx.globalAlpha = edgeFade;
            this.ctx.fillStyle = this.config.colors.node;
            this.ctx.beginPath();
            this.ctx.arc(anchor.x, anchor.y, this.config.nodeRadius * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow for anchors
            const glowGradient = this.ctx.createRadialGradient(
                anchor.x, anchor.y, 0,
                anchor.x, anchor.y, this.config.nodeRadius * 4
            );
            glowGradient.addColorStop(0, this.config.colors.node);
            glowGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(anchor.x, anchor.y, this.config.nodeRadius * 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw nodes with fade toward center
        this.nodes.forEach(node => {
            // Calculate opacity based on distance from edge
            const maxEdgeDist = this.width * this.config.lineLength;
            const edgeFade = Math.max(0, 1 - (node.edgeDistance / maxEdgeDist) * 1.2);
            
            this.ctx.globalAlpha = edgeFade * 0.8; // Slightly dimmer than anchors
            this.ctx.fillStyle = this.config.colors.node;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Subtle glow effect
            const glowGradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2.5
            );
            glowGradient.addColorStop(0, this.config.colors.node);
            glowGradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1; // Reset
    }
    
    animate() {
        this.updateNodes();
        this.findConnections();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    // Cleanup method (for potential future use)
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize spider networks
// INTEGRATION POINT: Called after intro animation completes
// Does not interfere with existing initialization flow
const initSpiderNetworks = () => {
    // Wait for DOM to be ready and intro to complete
    const init = () => {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            const leftCanvas = document.getElementById('spider-network-left');
            const rightCanvas = document.getElementById('spider-network-right');
            
            // Ensure canvases are visible
            if (leftCanvas) {
                leftCanvas.style.opacity = '1';
                leftCanvas.style.display = 'block';
                leftCanvas.style.visibility = 'visible';
            }
            if (rightCanvas) {
                rightCanvas.style.opacity = '1';
                rightCanvas.style.display = 'block';
                rightCanvas.style.visibility = 'visible';
            }
            
            const leftNetwork = new SpiderNetwork('spider-network-left', 'left');
            const rightNetwork = new SpiderNetwork('spider-network-right', 'right');
            
            // Store references for potential cleanup (optional)
            window.spiderNetworks = {
                left: leftNetwork,
                right: rightNetwork
            };
            
            // Force a resize after a short delay to ensure proper initialization
            setTimeout(() => {
                if (leftNetwork && leftNetwork.resize) leftNetwork.resize();
                if (rightNetwork && rightNetwork.resize) rightNetwork.resize();
            }, 200);
        }, 100);
    };
    
    // Wait for intro to complete if it's still active
    if (document.body.classList.contains('intro-active')) {
        // Wait for intro-complete class
        const checkIntro = setInterval(() => {
            if (document.body.classList.contains('intro-complete')) {
                clearInterval(checkIntro);
                init();
            }
        }, 100);
    } else {
        init();
    }
};

// ============================================
// Internationalization (i18n) - Arabic RTL Support
// ============================================

// Translations object - All text content in English and Arabic
const translations = {
    en: {
        // Navigation
        nav: {
            home: "Home",
            about: "About Us",
            services: "Our Services",
            work: "Our Work",
            contact: "Contact Us"
        },
        // Hero Section
        hero: {
            headline: {
                prefix: "We design",
                highlight: "innovative",
                suffix: "digital solutions"
            },
            subheadline: "Elevate your business level",
            services: "We develop websites and applications with efficiency and attention to detail, from design to programming. We provide digital solutions tailored to your needs.",
            btn: {
                start: "Start Your Project Now",
                explore: "Explore Our Services"
            },
            stat: {
                experience: "years of local experience",
                clients: "clients from business leaders",
                projects: "successful projects in the Gulf"
            }
        },
        // About Section
        about: {
            subheadline: "Who We Are",
            title: "About WeblyDo",
            description: "We are a passionate team of developers, designers, and innovators dedicated to crafting exceptional digital experiences. With years of expertise in web development and cutting-edge technologies, we transform ideas into powerful, scalable solutions that drive business growth and exceed expectations.",
            story: {
                title: "Our Journey"
            },
            milestone: {
                founded: {
                    title: "2022 - Founded",
                    desc: "Started with a vision to revolutionize digital experiences in the Gulf region."
                },
                clients: {
                    title: "2023 - First 20 Clients",
                    desc: "Reached a milestone of 20 satisfied clients across various industries."
                },
                expansion: {
                    title: "2025 - Team Expansion",
                    desc: "Expanded our team to 8+ talented professionals specializing in modern technologies."
                },
                leader: {
                    title: "2026 - Innovation Leader",
                    desc: "Recognized as a leading digital solutions provider with 150+ successful projects."
                }
            },
            tagline: "Empowering Digital Experiences",
            values: {
                title: "Our Core Values",
                innovation: "Innovation",
                quality: "Quality",
                collaboration: "Collaboration",
                commitment: "Commitment"
            }
        },
        // Solutions Section
        solutions: {
            title: {
                prefix: "Our",
                highlight: "Solutions",
                suffix: ""
            },
            subtitle: "Comprehensive IT services tailored to your business needs",
            website: {
                title: "Website Development",
                desc: "High-performance, responsive websites built with modern technologies to deliver seamless user experiences and represent your brand with clarity and impact.",
                link: "Learn More"
            },
            landing: {
                title: "Animated Landing Pages",
                desc: "High-impact landing pages with smooth animations designed to engage users and drive conversions.",
                link: "Learn More"
            },
            cloud: {
                title: "Cloud Infrastructure & QA Automation",
                desc: "Scalable cloud solutions with automated testing to ensure performance, security, and reliability.",
                link: "Learn More"
            },
            app: {
                title: "Application Development",
                desc: "Scalable web and mobile applications engineered to solve real business problems, optimize workflows, and grow alongside your organization.",
                link: "Learn More"
            },
            cta: "Request Free Technical Consultation"
        },
        // Methodology Section
        methodology: {
            stats: {
                experience: "Years Experience",
                projects: "Completed Projects",
                clients: "Happy Clients",
                team: "Team Members"
            },
            title: "Work Methodology",
            subtitle: "We follow a studied and systematic methodology to ensure the best results and meet our clients' expectations.",
            phase: {
                discovery: {
                    title: "Discovery Phase",
                    desc: "We start by understanding your goals, target audience, and project requirements through in-depth consultations.",
                    link: "Details"
                },
                planning: {
                    title: "Planning Phase",
                    desc: "Our team creates a detailed roadmap including timelines, milestones, and resource allocation.",
                    link: "Details"
                },
                design: {
                    title: "Design Phase",
                    desc: "We design user-friendly interfaces (UI/UX) that align with your brand identity and user needs.",
                    link: "Details"
                },
                development: {
                    title: "Development Phase",
                    desc: "Our developers build your solution using clean, scalable, and modern code standards.",
                    link: "Details"
                },
                testing: {
                    title: "Testing Phase",
                    desc: "We ensure product quality through comprehensive testing to eliminate bugs and ensure security/performance.",
                    link: "Details"
                },
                launch: {
                    title: "Launch Phase",
                    desc: "We deploy your product smoothly, ensuring everything runs perfectly in the live environment.",
                    link: "Details"
                }
            },
            cta: {
                title: "Ready to start your project with us?",
                subtitle: "Our team is excited to work with you and turn your ideas into reality.",
                button: "Start Now"
            }
        },
        // Demo Section
        demo: {
            title: "Explore Our Platform",
            subtitle: "Discover the powerful features that drive your business forward",
            dashboard: {
                label: "Dashboard",
                title: "Real-Time Dashboard",
                desc: "Monitor your business metrics in real-time with our intuitive dashboard. Get instant insights into performance, revenue, and key indicators all in one place."
            },
            analytics: {
                label: "Analytics",
                title: "Advanced Analytics",
                desc: "Dive deep into your data with powerful analytics tools. Track trends, identify patterns, and make data-driven decisions with comprehensive reporting."
            },
            reports: {
                label: "Reports",
                title: "Custom Reports",
                desc: "Generate detailed reports tailored to your needs. Export data in multiple formats and schedule automated reports to keep stakeholders informed."
            },
            integrations: {
                label: "Integrations",
                title: "Seamless Integrations",
                desc: "Connect with your favorite tools and services. Our platform integrates with hundreds of popular apps to streamline your workflow."
            }
        },
        // Testimonials Section
        testimonials: {
            title: "What Our Clients Say",
            subtitle: "Trusted by businesses worldwide to deliver exceptional results",
            items: [
                {
                    text: "Weblydo Solutions transformed our entire digital infrastructure. Their team's expertise and attention to detail exceeded our expectations. We've seen a 40% increase in operational efficiency since implementing their solutions.",
                    author: "Sarah Al-Dosari",
                    role: "Jewelry Designer"
                },
                {
                    text: "The custom development work from Weblydo has been outstanding. They understood our unique requirements and delivered a solution that perfectly fits our business model. Their support throughout the project was exceptional.",
                    author: "Mahmoud Amr",
                    role: "Business Owner"
                },
                {
                    text: "Working with Weblydo has been a game-changer for our company. Their cloud infrastructure solutions have improved our scalability and reduced costs significantly. Highly professional team with deep technical knowledge.",
                    author: "Raed Hijawi",
                    role: "Operations Director, Jawwal Solutions"
                },
                {
                    text: "The mobile application developed by Weblydo has received excellent feedback from our users. The user experience is smooth, intuitive, and the performance is outstanding. They truly understand modern app development.",
                    author: "Burhan Azem",
                    role: "Product Manager, Foothills Technology"
                },
                {
                    text: "Weblydo's consulting services helped us make critical technology decisions. Their strategic guidance and technical expertise enabled us to modernize our infrastructure while minimizing disruption to our operations.",
                    author: "Alexandra Martinez",
                    role: "VP of Technology, Enterprise Systems"
                }
            ]
        },
        // Contact Section
        contact: {
            title: "Let's Build Something Great",
            subtitle: "Ready to transform your business with innovative software solutions? Get in touch with our team.",
            form: {
                name: "Name",
                email: "Email",
                whatsapp: "WhatsApp Number",
                message: "Message",
                submit: "Send Message"
            }
        },
        // Final CTA
        finalCta: {
            title: "Ready to Transform Your Business?",
            subtitle: "Join hundreds of companies that trust Weblydo Solutions to power their digital transformation",
            primary: "Get Started Today",
            secondary: "Learn More"
        },
        // Footer
        footer: {
            tagline: "Innovative Software Solutions",
            solutions: "Solutions",
            about: "About",
            contact: "Contact",
            copyright: "© 2026 eblydo Solutions. All rights reserved."
        }
    },
    ar: {
        // Navigation
        nav: {
            home: "الرئيسية",
            about: "من نحن",
            services: "خدماتنا",
            work: "أعمالنا",
            contact: "اتصل بنا"
        },
        // Hero Section
        hero: {
            headline: {
                prefix: "نصمم",
                highlight: "حلولاً رقمية",
                suffix: "مبتكرة"
            },
            subheadline: "ارتق بمستوى أعمالك",
            services: "نطور المواقع والتطبيقات بكفاءة واهتمام بالتفاصيل، من التصميم إلى البرمجة. نقدم حلولاً رقمية مصممة خصيصاً لاحتياجاتك.",
            btn: {
                start: "ابدأ مشروعك الآن",
                explore: "استكشف خدماتنا"
            },
            stat: {
                experience: "سنوات من الخبرة المحلية",
                clients: "عميل من قادة الأعمال",
                projects: "مشروع ناجح في الخليج"
            }
        },
        // About Section
        about: {
            subheadline: "من نحن",
            title: "عن WeblyDo",
            description: "نحن فريق متحمس من المطورين والمصممين والمبدعين المكرسين لصنع تجارب رقمية استثنائية. مع سنوات من الخبرة في تطوير الويب والتقنيات الحديثة، نحول الأفكار إلى حلول قوية وقابلة للتطوير تدفع نمو الأعمال وتتجاوز التوقعات.",
            story: {
                title: "رحلتنا"
            },
            milestone: {
                founded: {
                    title: "2022 - التأسيس",
                    desc: "بدأنا برؤية لإحداث ثورة في التجارب الرقمية في منطقة الخليج."
                },
                clients: {
                    title: "2023 - أول 20 عميل",
                    desc: "وصلنا إلى معلم 20 عميلاً راضياً عبر مختلف الصناعات."
                },
                expansion: {
                    title: "2025 - توسيع الفريق",
                    desc: "وسعنا فريقنا إلى أكثر من 8 محترفين موهوبين متخصصين في التقنيات الحديثة."
                },
                leader: {
                    title: "2026 - رائد الابتكار",
                    desc: "معترف بنا كمزود رائد للحلول الرقمية مع أكثر من 150 مشروعاً ناجحاً."
                }
            },
            tagline: "تمكين التجارب الرقمية",
            values: {
                title: "قيمنا الأساسية",
                innovation: "الابتكار",
                quality: "الجودة",
                collaboration: "التعاون",
                commitment: "الالتزام"
            }
        },
        // Solutions Section
        solutions: {
            title: {
                prefix: "حلولنا",
                highlight: "التقنية",
                suffix: ""
            },
            subtitle: "خدمات تقنية شاملة مصممة خصيصاً لاحتياجات أعمالك",
            website: {
                title: "تطوير المواقع",
                desc: "مواقع عالية الأداء ومتجاوبة مبنية بتقنيات حديثة لتقديم تجارب مستخدم سلسة وتمثيل علامتك التجارية بوضوح وتأثير.",
                link: "اعرف المزيد"
            },
            landing: {
                title: "صفحات هبوط متحركة",
                desc: "صفحات هبوط عالية التأثير مع رسوم متحركة سلسة مصممة لإشراك المستخدمين ودفع التحويلات.",
                link: "اعرف المزيد"
            },
            cloud: {
                title: "البنية التحتية السحابية وأتمتة ضمان الجودة",
                desc: "حلول سحابية قابلة للتطوير مع اختبار آلي لضمان الأداء والأمان والموثوقية.",
                link: "اعرف المزيد"
            },
            app: {
                title: "تطوير التطبيقات",
                desc: "تطبيقات ويب وجوال قابلة للتطوير مصممة لحل مشاكل الأعمال الحقيقية وتحسين سير العمل والنمو جنباً إلى جنب مع مؤسستك.",
                link: "اعرف المزيد"
            },
            cta: "اطلب استشارة تقنية مجانية"
        },
        // Methodology Section
        methodology: {
            stats: {
                experience: "سنوات خبرة",
                projects: "مشروع مكتمل",
                clients: "عميل سعيد",
                team: "عضو فريق"
            },
            title: "منهجية العمل",
            subtitle: "نتبع منهجية مدروسة ومنهجية لضمان أفضل النتائج وتلبية توقعات عملائنا.",
            phase: {
                discovery: {
                    title: "مرحلة الاكتشاف",
                    desc: "نبدأ بفهم أهدافك وجمهورك المستهدف ومتطلبات المشروع من خلال استشارات متعمقة.",
                    link: "التفاصيل"
                },
                planning: {
                    title: "مرحلة التخطيط",
                    desc: "ينشئ فريقنا خارطة طريق مفصلة تشمل الجداول الزمنية والمعالم وتخصيص الموارد.",
                    link: "التفاصيل"
                },
                design: {
                    title: "مرحلة التصميم",
                    desc: "نصمم واجهات سهلة الاستخدام (UI/UX) تتماشى مع هوية علامتك التجارية واحتياجات المستخدم.",
                    link: "التفاصيل"
                },
                development: {
                    title: "مرحلة التطوير",
                    desc: "يبني مطورونا حلولك باستخدام معايير كود نظيفة وقابلة للتطوير وحديثة.",
                    link: "التفاصيل"
                },
                testing: {
                    title: "مرحلة الاختبار",
                    desc: "نضمن جودة المنتج من خلال اختبار شامل للقضاء على الأخطاء وضمان الأمان/الأداء.",
                    link: "التفاصيل"
                },
                launch: {
                    title: "مرحلة الإطلاق",
                    desc: "ننشر منتجك بسلاسة، مع ضمان أن كل شيء يعمل بشكل مثالي في البيئة الحية.",
                    link: "التفاصيل"
                }
            },
            cta: {
                title: "هل أنت مستعد لبدء مشروعك معنا؟",
                subtitle: "فريقنا متحمس للعمل معك وتحويل أفكارك إلى واقع.",
                button: "ابدأ الآن"
            }
        },
        // Demo Section
        demo: {
            title: "استكشف منصتنا",
            subtitle: "اكتشف الميزات القوية التي تدفع أعمالك إلى الأمام",
            dashboard: {
                label: "لوحة التحكم",
                title: "لوحة تحكم فورية",
                desc: "راقب مقاييس أعمالك في الوقت الفعلي مع لوحة التحكم البديهية لدينا. احصل على رؤى فورية حول الأداء والإيرادات والمؤشرات الرئيسية في مكان واحد."
            },
            analytics: {
                label: "التحليلات",
                title: "تحليلات متقدمة",
                desc: "اغوص عميقاً في بياناتك باستخدام أدوات تحليل قوية. تتبع الاتجاهات وحدد الأنماط واتخذ قرارات مدفوعة بالبيانات مع تقارير شاملة."
            },
            reports: {
                label: "التقارير",
                title: "تقارير مخصصة",
                desc: "أنشئ تقارير مفصلة مصممة خصيصاً لاحتياجاتك. قم بتصدير البيانات بتنسيقات متعددة وحدد مواعيد التقارير التلقائية لإبقاء أصحاب المصلحة على اطلاع."
            },
            integrations: {
                label: "التكاملات",
                title: "تكاملات سلسة",
                desc: "اتصل بأدواتك وخدماتك المفضلة. تدمج منصتنا مع مئات التطبيقات الشائعة لتبسيط سير عملك."
            }
        },
        // Testimonials Section
        testimonials: {
            title: "ماذا يقول عملاؤنا",
            subtitle: "موثوق به من قبل الشركات في جميع أنحاء العالم لتقديم نتائج استثنائية",
            items: [
                {
                    text: "حولت Weblydo Solutions بنيتنا التحتية الرقمية بالكامل. تجاوزت خبرة فريقهم واهتمامهم بالتفاصيل توقعاتنا. لقد شهدنا زيادة بنسبة 40% في الكفاءة التشغيلية منذ تطبيق حلولهم.",
                    author: "سارة الدوسري",
                    role: "مصممة مجوهرات"
                },
                {
                    text: "كان عمل التطوير المخصص من Weblydo استثنائياً. فهموا متطلباتنا الفريدة وقدموا حلاً يناسب نموذج أعمالنا بشكل مثالي. كان دعمهم طوال المشروع استثنائياً.",
                    author: "محمود عمرو",
                    role: "صاحب أعمال"
                },
                {
                    text: "كان العمل مع Weblydo نقطة تحول لشركتنا. حسنت حلول البنية التحتية السحابية لديهم قابلية التوسع لدينا وخفضت التكاليف بشكل كبير. فريق محترف للغاية مع معرفة تقنية عميقة.",
                    author: "رائد حجاوي",
                    role: "مدير العمليات، حلول جوال"
                },
                {
                    text: "تلقى التطبيق المحمول الذي طورته Weblydo ردود فعل ممتازة من مستخدمينا. تجربة المستخدم سلسة وبديهية، والأداء استثنائي. إنهم يفهمون حقاً تطوير التطبيقات الحديثة.",
                    author: "برهان عازم",
                    role: "مدير المنتج، تكنولوجيا فوثيلز"
                },
                {
                    text: "ساعدت خدمات الاستشارات من Weblydo في اتخاذ قرارات تقنية حرجة. مكنتنا إرشاداتهم الاستراتيجية وخبرتهم التقنية من تحديث بنيتنا التحتية مع تقليل الاضطراب في عملياتنا إلى الحد الأدنى.",
                    author: "ألكسندرا مارتينيز",
                    role: "نائب رئيس التكنولوجيا، أنظمة المؤسسات"
                }
            ]
        },
        // Contact Section
        contact: {
            title: "لنبني شيئاً رائعاً",
            subtitle: "هل أنت مستعد لتحويل أعمالك بحلول برمجية مبتكرة؟ تواصل مع فريقنا.",
            form: {
                name: "الاسم",
                email: "البريد الإلكتروني",
                whatsapp: "رقم الواتساب",
                message: "الرسالة",
                submit: "إرسال الرسالة"
            }
        },
        // Final CTA
        finalCta: {
            title: "هل أنت مستعد لتحويل أعمالك؟",
            subtitle: "انضم إلى مئات الشركات التي تثق في Weblydo Solutions لتمكين تحولها الرقمي",
            primary: "ابدأ اليوم",
            secondary: "اعرف المزيد"
        },
        // Footer
        footer: {
            tagline: "حلول برمجية مبتكرة",
            solutions: "الحلول",
            about: "من نحن",
            contact: "اتصل بنا",
            copyright: "© 2026 eblydo Solutions. جميع الحقوق محفوظة."
        }
    }
};

// Current language state
let currentLang = 'en';

// Language switching function
const switchLanguage = (lang) => {
    currentLang = lang;
    const html = document.documentElement;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update body class for font switching
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('ltr', lang !== 'ar');
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }
        
        if (value !== null && value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Check if element has data-i18n-placeholder attribute
                if (element.hasAttribute('data-i18n-placeholder')) {
                    const placeholderKey = element.getAttribute('data-i18n-placeholder');
                    const placeholderKeys = placeholderKey.split('.');
                    let placeholderValue = translations[lang];
                    
                    for (const k of placeholderKeys) {
                        if (placeholderValue && placeholderValue[k]) {
                            placeholderValue = placeholderValue[k];
                        } else {
                            placeholderValue = null;
                            break;
                        }
                    }
                    
                    if (placeholderValue !== null && placeholderValue !== undefined) {
                        element.placeholder = placeholderValue;
                    }
                } else {
                    // For inputs without placeholder attribute, update value if empty
                    if (!element.value) {
                        element.value = value;
                    }
                }
            } else if (element.tagName === 'LABEL') {
                element.textContent = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update language switcher display
    const langCurrent = document.getElementById('lang-current');
    const langOther = document.getElementById('lang-other');
    if (langCurrent && langOther) {
        langCurrent.textContent = lang.toUpperCase();
        langOther.textContent = lang === 'en' ? 'AR' : 'EN';
    }
    
    // Update testimonials
    updateTestimonials(lang);
    
    // Save preference to localStorage
    localStorage.setItem('preferred-language', lang);
    
    // Trigger resize event to fix any layout issues
    window.dispatchEvent(new Event('resize'));
};

// Function to update testimonials based on language
const updateTestimonials = (lang) => {
    const testimonialItems = translations[lang]?.testimonials?.items;
    if (!testimonialItems) return;
    
    // Update each testimonial element
    document.querySelectorAll('[data-i18n-testimonial]').forEach(element => {
        const attr = element.getAttribute('data-i18n-testimonial');
        const [index, property] = attr.split('.');
        const testimonial = testimonialItems[parseInt(index)];
        
        if (testimonial && testimonial[property]) {
            element.textContent = testimonial[property];
        }
    });
};

// Initialize language on page load
const initLanguage = () => {
    // Check for saved preference or browser language
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = navigator.language.split('-')[0];
    
    // Determine initial language
    let initialLang = 'en';
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        initialLang = savedLang;
    } else if (browserLang === 'ar') {
        initialLang = 'ar';
    }
    
    // Apply initial language
    switchLanguage(initialLang);
    
    // Setup language switcher button
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            switchLanguage(newLang);
        });
    }
};

// Start initialization
initAll();

// Initialize language support after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}

