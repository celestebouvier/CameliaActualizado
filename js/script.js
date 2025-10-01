class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.startAutoPlay();
        
        const carouselContainer = document.querySelector('.hero-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        if (this.slides[index]) this.slides[index].classList.add('active');
        if (this.dots[index]) this.dots[index].classList.add('active');
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); 
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}
class Search {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBtn = document.querySelector('.search-btn');
        
        this.init();
    }
    
    init() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
            
            this.searchInput.addEventListener('input', () => this.showSuggestions());
        }
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            this.animateSearch();
            // Implementación de búsqueda simulada, similar a tu ejemplo
            console.log(`Buscando productos relacionados con: ${query}`);
            alert(`Buscando productos relacionados con: ${query}`);
        } else {
            alert("Por favor ingrese una palabra clave.");
        }
    }
    
    animateSearch() {
        if (this.searchBtn) {
            this.searchBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.searchBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    showSuggestions() {
        const query = this.searchInput.value.trim();
        if (query.length > 2) {
            console.log(`Showing suggestions for: ${query}`);
        }
    }
}
/*class ShoppingCart {
    constructor() {
        this.cartBtn = document.querySelector('.cart-btn');
        this.cartCount = document.querySelector('.cart-count');
        this.items = [];
        
        this.init();
    }
    
    init() {
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', () => this.toggleCart());
        }
        this.updateCartDisplay();
    }
    
    addItem(item) {
        this.items.push(item);
        this.updateCartDisplay();
        this.animateCartAdd();
    }
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateCartDisplay();
    }
    
    updateCartDisplay() {
        if (this.cartCount) {
            this.cartCount.textContent = this.items.length;
            
            if (this.items.length > 0) {
                this.cartCount.style.display = 'flex';
            } else {
                this.cartCount.style.display = 'none';
            }
        }
    }
    
    animateCartAdd() {
        if (this.cartBtn) {
            this.cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.cartBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    toggleCart() {
        console.log('Cart toggled');
    }
}*/

class Newsletter {
    constructor() {
        this.newsletterForm = document.querySelector('.newsletter-form');
        this.newsletterInput = document.querySelector('.newsletter-input');
        this.newsletterBtn = document.querySelector('.newsletter-btn');
        
        this.init();
    }
    
    init() {
        if (this.newsletterBtn) {
            this.newsletterBtn.addEventListener('click', () => this.subscribe());
        }
        
        if (this.newsletterInput) {
            this.newsletterInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.subscribe();
                }
            });
        }
    }
    
    subscribe() {
        const email = this.newsletterInput ? this.newsletterInput.value.trim() : '';
        
        if (this.validateEmail(email)) {
            // Guardar email en localStorage
            localStorage.setItem("newsletterEmail", email);
            this.animateSubscribe();
            this.showSuccessMessage();
            if (this.newsletterInput) this.newsletterInput.value = '';
        } else {
            this.showErrorMessage();
        }
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    animateSubscribe() {
        if (this.newsletterBtn) {
            this.newsletterBtn.style.transform = 'scale(0.95)';
            this.newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suscribiendo...';
            
            setTimeout(() => {
                this.newsletterBtn.style.transform = 'scale(1)';
                this.newsletterBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Suscribirse';
            }, 1500);
        }
    }
    
    showSuccessMessage() {
        alert("¡Gracias por suscribirte!");
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = '¡Gracias por suscribirte! 🌸';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff69b4, #87ceeb);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
    
    showErrorMessage() {
        alert("Por favor, ingresa un email válido.");
        if (this.newsletterInput) {
            this.newsletterInput.style.borderColor = '#ff4757';
            this.newsletterInput.placeholder = 'Por favor, ingresa un email válido';
            
            setTimeout(() => {
                this.newsletterInput.style.borderColor = '';
                this.newsletterInput.placeholder = 'Tu correo electrónico';
            }, 3000);
        }
    }
}

class Categories {
    constructor() {
        this.categoryCards = document.querySelectorAll('.category-card');
        this.init();
    }
    
    init() {
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => this.selectCategory(card));
            card.addEventListener('mouseenter', () => this.hoverCategory(card));
            card.addEventListener('mouseleave', () => this.unhoverCategory(card));
        });
    }
    
    selectCategory(card) {
        const categoryName = card.querySelector('h3').textContent;
        console.log(`Selected category: ${categoryName}`);
        
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
    }
    
    hoverCategory(card) {
        const icon = card.querySelector('.category-icon');
        if (icon) {
            icon.style.animation = 'bounce 0.6s ease-in-out';
        }
    }
    
    unhoverCategory(card) {
        const icon = card.querySelector('.category-icon');
        if (icon) {
            icon.style.animation = '';
        }
    }
}
class CharacterCarousel {
    constructor() {
        this.track = document.querySelector('.character-track');
        this.prevBtn = document.getElementById('characterPrevBtn');
        this.nextBtn = document.getElementById('characterNextBtn');
        this.cards = document.querySelectorAll('.character-card');
        this.currentIndex = 0;
        this.cardsToShow = 4;
        this.cardWidth = 200; 
        
        this.init();
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        

        this.cards.forEach(card => {
            card.addEventListener('click', () => this.selectCharacter(card));
        });
        
        this.adjustCardsToShow();
        window.addEventListener('resize', () => this.adjustCardsToShow());
    }
    
    adjustCardsToShow() {
        const containerWidth = document.querySelector('.character-carousel').offsetWidth;
        this.cardsToShow = Math.floor(containerWidth / 200);
        if (this.cardsToShow < 1) this.cardsToShow = 1;
        if (this.cardsToShow > this.cards.length) this.cardsToShow = this.cards.length;
    }
    
    updateCarousel() {
        if (this.track) {
            const translateX = -this.currentIndex * this.cardWidth;
            this.track.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    nextSlide() {
        const maxIndex = this.cards.length - this.cardsToShow;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    selectCharacter(card) {
        const characterName = card.querySelector('h3').textContent;
        console.log(`Selected character: ${characterName}`);
        
        
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
   
    }
}


class Authentication {
    constructor() {
        this.authBtn = document.querySelector('.auth-btn');
        this.profileBtn = document.querySelector('.profile-btn');
        this.isLoggedIn = false;
        
        this.init();
    }
    
    init() {
        if (this.authBtn) {
            this.authBtn.addEventListener('click', () => this.handleAuth());
        }
        
        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', () => this.handleProfile());
        }
    }
    
    handleAuth() {
        if (!this.isLoggedIn) {
            // Simulate login
            this.showLoginForm();
        } else {
            // Logout
            this.logout();
        }
    }
    
    showLoginForm() {
        console.log('Showing login form');
        
        setTimeout(() => {
            this.login();
        }, 2000);
    }
    
    login() {
        this.isLoggedIn = true;
        if (this.authBtn) {
            this.authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
        }
        
        this.showSuccessMessage('¡Bienvenido a Camelia!');
    }
    
    logout() {
        this.isLoggedIn = false;
        if (this.authBtn) {
            this.authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        }
        
        this.showSuccessMessage('Sesión cerrada correctamente');
    }
    
    handleProfile() {
        if (this.isLoggedIn) {
            console.log('Opening user profile');
            this.showSuccessMessage('Abriendo perfil de usuario');
        } else {
            this.showErrorMessage('Debes iniciar sesión primero');
        }
    }
    
    showSuccessMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'auth-message success';
        messageEl.innerHTML = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff69b4, #87ceeb);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
    
    showErrorMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'auth-message error';
        messageEl.innerHTML = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}


class EnvironmentalCommitment {
    constructor() {
        this.ecoBtn = document.querySelector('.eco-btn');
        this.commitmentCards = document.querySelectorAll('.commitment-card');
        this.init();
    }
    
    init() {
        if (this.ecoBtn) {
            this.ecoBtn.addEventListener('click', () => this.showMoreInfo());
        }
        
        this.commitmentCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateCard(card));
        });
    }

    
    animateCard(card) {
        const icon = card.querySelector('.commitment-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }
}

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1 }
        );
        
        this.init();
    }
    
    init() {
        const animatedElements = document.querySelectorAll('.category-card, .newsletter, .commitment-card, .character-card');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new Search();
    new ShoppingCart();
    new Newsletter();
    new Categories();
    new CharacterCarousel();
    new Authentication();
    new EnvironmentalCommitment();
    new SmoothScroll();
    new ScrollAnimations();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
    
    addInteractiveEffects();
});

function addInteractiveEffects() {
    document.addEventListener('click', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            heroCarousel.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}


function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 10000;
        animation: sparkleAnimation 1s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}


const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnimation {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(sparkleStyle);