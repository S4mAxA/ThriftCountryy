// ===== GSAP ANIMATIONS =====
class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.scrollTriggers = [];
        
        this.init();
    }
    
    init() {
        // Wait for GSAP to be loaded
        if (typeof gsap !== 'undefined') {
            this.setupAnimations();
            this.isInitialized = true;
        } else {
            // Wait for GSAP to load
            const checkGSAP = setInterval(() => {
                if (typeof gsap !== 'undefined') {
                    clearInterval(checkGSAP);
                    this.setupAnimations();
                    this.isInitialized = true;
                }
            }, 100);
        }
    }
    
    setupAnimations() {
        // Register ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        this.setupHeroAnimations();
        this.setupScrollAnimations();
        this.setupProductAnimations();
        this.setupMicroInteractions();
        this.setupParallaxEffects();
    }
    
    setupHeroAnimations() {
        // Hero title animation
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            gsap.fromTo(heroTitle.children, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }
        
        // Hero subtitle animation
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            gsap.fromTo(heroSubtitle, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });
        }
        
        // Hero CTA animation
        const heroCTA = document.querySelector('.hero-cta');
        if (heroCTA) {
            gsap.fromTo(heroCTA, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.8,
                ease: "power3.out"
            });
        }
        
        // Hero stats animation
        const heroStats = document.querySelectorAll('.hero-stats .stat');
        if (heroStats.length > 0) {
            gsap.fromTo(heroStats, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 1,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
        
        // Scroll indicator animation
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            gsap.fromTo(scrollIndicator, {
                y: 20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 1.5,
                ease: "power3.out"
            });
        }
    }
    
    setupScrollAnimations() {
        // Section headers animation
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            gsap.fromTo(header, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Product cards animation
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            gsap.fromTo(card, {
                y: 50,
                opacity: 0,
                scale: 0.9
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // About section animation
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) {
            gsap.fromTo(aboutContent.children, {
                x: -50,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: aboutContent,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
        
        // FAQ animation
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            gsap.fromTo(item, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Contact section animation
        const contactContent = document.querySelector('.contact-content');
        if (contactContent) {
            gsap.fromTo(contactContent.children, {
                x: 50,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contactContent,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }
    
    setupProductAnimations() {
        // Product card hover effects
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const image = card.querySelector('.product-image img');
            const overlay = card.querySelector('.product-overlay');
            const actionButtons = card.querySelectorAll('.product-action-btn');
            
            // Image scale on hover
            gsap.set(image, { scale: 1 });
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });
            
            // Action buttons animation
            actionButtons.forEach((btn, index) => {
                gsap.set(btn, { y: 20, opacity: 0 });
                
                card.addEventListener('mouseenter', () => {
                    gsap.to(btn, {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(btn, {
                        y: 20,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    });
                });
            });
        });
    }
    
    setupMicroInteractions() {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    y: -2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Filter chips animation
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Animate all chips
                filterChips.forEach(c => {
                    gsap.to(c, {
                        scale: 0.95,
                        duration: 0.1,
                        ease: "power2.out",
                        yoyo: true,
                        repeat: 1
                    });
                });
            });
        });
        
        // Navigation link hover effects
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Social links animation
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -3,
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    setupParallaxEffects() {
        // Hero parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            gsap.to(heroBackground, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
        
        // Starfield parallax
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            gsap.to(starfield, {
                yPercent: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
        
        // Section parallax effects
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const content = section.querySelector('.container');
            if (content) {
                gsap.fromTo(content, {
                    y: 50,
                    opacity: 0.8
                }, {
                    y: 0,
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
        });
    }
    
    // Modal animations
    animateModalOpen(modal) {
        const content = modal.querySelector('.modal-content');
        const overlay = modal.querySelector('.modal-overlay');
        
        gsap.set(modal, { display: 'flex' });
        gsap.set(content, { scale: 0.8, opacity: 0 });
        gsap.set(overlay, { opacity: 0 });
        
        const tl = gsap.timeline();
        tl.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(content, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.7)"
        }, "-=0.1");
        
        return tl;
    }
    
    animateModalClose(modal) {
        const content = modal.querySelector('.modal-content');
        const overlay = modal.querySelector('.modal-overlay');
        
        const tl = gsap.timeline();
        tl.to(content, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        })
        .to(overlay, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.3")
        .set(modal, { display: 'none' });
        
        return tl;
    }
    
    // Sidebar animations
    animateSidebarOpen(sidebar) {
        const content = sidebar.querySelector('.sidebar-content');
        
        gsap.set(sidebar, { display: 'block' });
        gsap.set(content, { x: '100%' });
        
        return gsap.to(content, {
            x: '0%',
            duration: 0.4,
            ease: "power2.out"
        });
    }
    
    animateSidebarClose(sidebar) {
        const content = sidebar.querySelector('.sidebar-content');
        
        return gsap.to(content, {
            x: '100%',
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(sidebar, { display: 'none' });
            }
        });
    }
    
    // Notification animation
    animateNotification(notification) {
        gsap.set(notification, {
            x: '100%',
            opacity: 0
        });
        
        const tl = gsap.timeline();
        tl.to(notification, {
            x: '0%',
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.7)"
        })
        .to(notification, {
            x: '100%',
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            delay: 2.5
        });
        
        return tl;
    }
    
    // Countdown animation
    animateCountdownNumber(element, newValue) {
        const currentValue = parseInt(element.textContent);
        const diff = newValue - currentValue;
        
        gsap.fromTo(element, {
            y: -20,
            opacity: 0,
            scale: 1.2
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
            onComplete: () => {
                element.textContent = newValue.toString().padStart(2, '0');
            }
        });
    }
    
    // Product filter animation
    animateProductFilter(container, newContent) {
        const tl = gsap.timeline();
        
        tl.to(container.children, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in",
            onComplete: () => {
                container.innerHTML = newContent;
                gsap.set(container.children, { y: 20, opacity: 0 });
            }
        })
        .to(container.children, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out"
        });
        
        return tl;
    }
    
    // Cleanup animations
    cleanup() {
        // Kill all ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        // Kill all GSAP animations
        gsap.killTweensOf("*");
    }
}

// ===== ANIMATION CONTROLLER INITIALIZATION =====
let animationController;

// Initialize animation controller when GSAP is loaded
function initAnimations() {
    if (typeof gsap !== 'undefined') {
        animationController = new AnimationController();
    } else {
        // Wait for GSAP to load
        setTimeout(initAnimations, 100);
    }
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is already loaded
    if (typeof gsap !== 'undefined') {
        initAnimations();
    } else {
        // Wait for GSAP script to load
        const checkGSAP = setInterval(() => {
            if (typeof gsap !== 'undefined') {
                clearInterval(checkGSAP);
                initAnimations();
            }
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationController) {
        animationController.cleanup();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}

// Make animation controller globally available
window.animationController = animationController;
