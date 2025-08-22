// ===== MAIN APPLICATION =====
class ThriftCountryApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.wishlist = [];
        this.currentFilter = 'all';
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.initializeComponents();
            this.setupIntersectionObserver();
            this.startCountdown();
            this.hidePreloader();
            this.isInitialized = true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
        }
    }
    
    async loadProducts() {
        try {
            const response = await fetch('/data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.renderProducts();
            this.renderLookbook(data.lookbook);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            // Fallback avec des données statiques
            this.products = this.getFallbackProducts();
            this.renderProducts();
        }
    }
    
    getFallbackProducts() {
        return [
            {
                id: "nike-air-max-90",
                title: "Nike Air Max 90",
                brand: "Nike",
                category: "90s-sports",
                price: 89.99,
                originalPrice: 120.00,
                condition: "Excellent",
                size: "UK 9",
                description: "Classic Nike Air Max 90 en excellent état.",
                images: ["/assets/products/nike-air-max-90-1.jpg"],
                tags: ["sneakers", "retro", "sport", "nike"],
                isNew: true,
                inStock: true,
                sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
                colors: ["White/Black"],
                year: 1990
            }
        ];
    }
    
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Cart
        this.setupCart();
        
        // Product interactions
        this.setupProductInteractions();
        
        // Forms
        this.setupForms();
        
        // FAQ
        this.setupFAQ();
        
        // Modal
        this.setupModal();
        
        // Scroll effects
        this.setupScrollEffects();
    }
    
    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.getElementById('navbar');
        
        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');
        });
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu
                    navToggle?.classList.remove('active');
                    navMenu?.classList.remove('active');
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });
    }
    
    setupCart() {
        const cartBtn = document.querySelector('.nav-cart');
        const cartSidebar = document.getElementById('cart-sidebar');
        const sidebarClose = document.querySelector('.sidebar-close');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        // Open cart
        cartBtn?.addEventListener('click', () => {
            cartSidebar?.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart
        sidebarClose?.addEventListener('click', () => {
            cartSidebar?.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close cart on overlay click
        document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
            cartSidebar?.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Checkout
        checkoutBtn?.addEventListener('click', () => {
            this.handleCheckout();
        });
        
        // Load cart from localStorage
        this.loadCartFromStorage();
    }
    
    setupProductInteractions() {
        // Collection filters
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProducts(filter);
                
                // Update active state
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    setupForms() {
        // Notify form
        const notifyForm = document.getElementById('notify-form');
        notifyForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNotifySubmit(e.target);
        });
        
        // Contact form
        const contactForm = document.getElementById('contact-form');
        contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(e.target);
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmit(e.target);
        });
    }
    
    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other answers
                document.querySelectorAll('.faq-question').forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('active');
                    }
                });
                
                // Toggle current answer
                question.setAttribute('aria-expanded', !isExpanded);
                answer?.classList.toggle('active');
            });
        });
    }
    
    setupModal() {
        const modal = document.getElementById('product-modal');
        const modalClose = document.querySelector('.modal-close');
        
        // Close modal
        modalClose?.addEventListener('click', () => {
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal on overlay click
        document.querySelector('.modal-overlay')?.addEventListener('click', () => {
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    setupScrollEffects() {
        // Parallax effect for hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-background');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Update active navigation
                    const id = entry.target.id;
                    if (id) {
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }
    
    renderProducts() {
        const newArrivalsGrid = document.getElementById('new-arrivals-grid');
        const collectionsGrid = document.getElementById('collections-grid');
        
        // Render new arrivals (first 4 products)
        const newArrivals = this.products.filter(p => p.isNew).slice(0, 4);
        if (newArrivalsGrid) {
            newArrivalsGrid.innerHTML = newArrivals.map(product => this.createProductCard(product)).join('');
        }
        
        // Render all products in collections
        if (collectionsGrid) {
            collectionsGrid.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        }
        
        // Add event listeners to product cards
        this.setupProductCardListeners();
    }
    
    createProductCard(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
                    <div class="product-overlay">
                        <div class="product-actions">
                            <button class="product-action-btn" data-action="wishlist" aria-label="Ajouter aux favoris">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                            <button class="product-action-btn" data-action="quick-add" aria-label="Ajouter au panier">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${product.isNew ? '<span class="product-badge new">Nouveau</span>' : ''}
                    ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="product-original-price">£${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="product-current-price">£${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupProductCardListeners() {
        document.querySelectorAll('.product-card').forEach(card => {
            // Product detail modal
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-action-btn')) {
                    const productId = card.dataset.productId;
                    this.openProductModal(productId);
                }
            });
            
            // Action buttons
            card.querySelectorAll('.product-action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const productId = card.dataset.productId;
                    
                    if (action === 'wishlist') {
                        this.toggleWishlist(productId);
                    } else if (action === 'quick-add') {
                        this.addToCart(productId);
                    }
                });
            });
        });
    }
    
    renderLookbook(lookbookData) {
        const lookbookGallery = document.getElementById('lookbook-gallery');
        if (!lookbookGallery) return;
        
        lookbookGallery.innerHTML = lookbookData.map(look => `
            <div class="lookbook-item" data-look-id="${look.id}">
                <img src="${look.image}" alt="${look.title}" loading="lazy">
                <div class="lookbook-overlay">
                    <h3>${look.title}</h3>
                    <p>${look.description}</p>
                    <button class="btn btn-primary" onclick="app.viewLookProducts('${look.id}')">
                        Voir les produits
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    filterProducts(category) {
        this.currentFilter = category;
        const collectionsGrid = document.getElementById('collections-grid');
        
        if (!collectionsGrid) return;
        
        const filteredProducts = category === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === category);
        
        collectionsGrid.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        this.setupProductCardListeners();
    }
    
    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = this.createProductModalContent(product);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Setup modal interactions
        this.setupModalInteractions(product);
    }
    
    createProductModalContent(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-modal-content">
                <div class="product-modal-gallery">
                    <div class="product-modal-main-image">
                        <img src="${product.images[0]}" alt="${product.title}" id="modal-main-image">
                    </div>
                    <div class="product-modal-thumbnails">
                        ${product.images.map((image, index) => `
                            <img src="${image}" alt="${product.title}" 
                                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                                 data-index="${index}">
                        `).join('')}
                    </div>
                </div>
                <div class="product-modal-details">
                    <h2>${product.title}</h2>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="product-original-price">£${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="product-current-price">£${product.price.toFixed(2)}</span>
                        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-details">
                        <div class="detail-item">
                            <span class="detail-label">Condition:</span>
                            <span class="detail-value">${product.condition}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Taille:</span>
                            <span class="detail-value">${product.size}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Année:</span>
                            <span class="detail-value">${product.year}</span>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary btn-large" onclick="app.addToCart('${product.id}')">
                            Ajouter au panier
                        </button>
                        <button class="btn btn-secondary" onclick="app.toggleWishlist('${product.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Favoris
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupModalInteractions(product) {
        // Image gallery
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('modal-main-image');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                // Update main image
                if (mainImage) {
                    mainImage.src = thumb.src;
                }
            });
        });
    }
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateCartUI();
        this.saveCartToStorage();
        this.showNotification('Produit ajouté au panier');
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartUI();
        this.saveCartToStorage();
    }
    
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.updateCartUI();
                this.saveCartToStorage();
            }
        }
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.images[0]}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${item.brand}</p>
                        <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="app.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="app.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="app.removeFromCart('${item.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
        
        // Update cart total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `£${total.toFixed(2)}`;
        }
    }
    
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
        } else {
            this.wishlist.push(productId);
        }
        
        this.updateWishlistUI();
        this.saveWishlistToStorage();
        this.showNotification(index > -1 ? 'Retiré des favoris' : 'Ajouté aux favoris');
    }
    
    updateWishlistUI() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'block' : 'none';
        }
    }
    
    saveCartToStorage() {
        localStorage.setItem('thriftCountryCart', JSON.stringify(this.cart));
    }
    
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('thriftCountryCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }
    
    saveWishlistToStorage() {
        localStorage.setItem('thriftCountryWishlist', JSON.stringify(this.wishlist));
    }
    
    loadWishlistFromStorage() {
        const savedWishlist = localStorage.getItem('thriftCountryWishlist');
        if (savedWishlist) {
            this.wishlist = JSON.parse(savedWishlist);
            this.updateWishlistUI();
        }
    }
    
    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Votre panier est vide', 'error');
            return;
        }
        
        // For demo purposes, show a success message
        this.showNotification('Redirection vers le checkout...', 'success');
        
        // In a real implementation, redirect to Shopify checkout
        // window.location.href = 'https://your-shopify-store.myshopify.com/cart';
    }
    
    async handleNotifySubmit(form) {
        const email = form.querySelector('#notify-email').value;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Vous serez notifié du prochain drop !', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erreur lors de l\'inscription', 'error');
        }
    }
    
    async handleContactSubmit(form) {
        const formData = new FormData(form);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Message envoyé avec succès !', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi', 'error');
        }
    }
    
    async handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification('Inscription à la newsletter réussie !', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erreur lors de l\'inscription', 'error');
        }
    }
    
    startCountdown() {
        // Set target date (next Friday at 10 AM)
        const now = new Date();
        const target = new Date();
        target.setDate(now.getDate() + (5 + 7 - now.getDay()) % 7);
        target.setHours(10, 0, 0, 0);
        
        const updateCountdown = () => {
            const now = new Date();
            const diff = target - now;
            
            if (diff <= 0) {
                // Reset countdown for next week
                target.setDate(target.getDate() + 7);
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('days')?.textContent = days.toString().padStart(2, '0');
            document.getElementById('hours')?.textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes')?.textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds')?.textContent = seconds.toString().padStart(2, '0');
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 2000);
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    viewLookProducts(lookId) {
        // Implementation for viewing look products
        console.log('Viewing look products for:', lookId);
    }
    
    initializeComponents() {
        // Load saved data
        this.loadWishlistFromStorage();
        
        // Initialize any other components
        this.updateWishlistUI();
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== INITIALIZATION =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new ThriftCountryApp();
});

// Make app globally available for inline event handlers
window.app = app;

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
