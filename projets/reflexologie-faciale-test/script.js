// === VARIABLES ===
const burgerMenu = document.querySelector('.burger-menu');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const faqItems = document.querySelectorAll('.faq-item');
const serviceCards = document.querySelectorAll('.service-card');
const testimonialSlider = document.querySelector('.testimonial-slider');
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const contactForm = document.getElementById('contact-form');

// === FUNCTIONS ===

// Toggle mobile navigation
function toggleMobileNav() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Empêcher le défilement de la page quand le menu est ouvert
    if (mobileNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    
    // Animate burger menu
    const bars = burgerMenu.querySelectorAll('.bar');
    if (burgerMenu.classList.contains('active')) {
        bars[0].style.transform = 'translateY(9px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
    } else {
        // Attendre que l'animation du menu soit terminée avant de restaurer le burger
        setTimeout(() => {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }, 300);
    }
}

// Change header style on scroll
function handleScroll() {
    if (window.scrollY > 100) {
        header.style.height = '70px';
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.height = 'var(--header-height)';
        header.style.boxShadow = 'var(--shadow-sm)';
    }
}

// Handle FAQ item click
function toggleFAQ() {
    // Close all other FAQ items
    faqItems.forEach(item => {
        if (item !== this && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current FAQ item
    this.classList.toggle('active');
}

// Handle service card click
function toggleServiceDetails() {
    // Toggle active class on clicked card
    this.classList.toggle('active');
}

// Handle testimonial slider
let currentSlide = 0;

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.style.display = 'none';
    });
    
    // Deactivate all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial and activate corresponding dot
    testimonials[index].style.display = 'block';
    dots[index].classList.add('active');
    
    // Set current slide
    currentSlide = index;
}

function nextTestimonial() {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showTestimonial(currentSlide);
}

// Autoslide testimonials
let testimonialInterval;

function startTestimonialInterval() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialInterval() {
    clearInterval(testimonialInterval);
}

// Handle contact form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form data
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        if (!formObject[field]) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formObject.email && !emailRegex.test(formObject.email)) {
        isValid = false;
        contactForm.querySelector('[name="email"]').style.borderColor = 'red';
    }
    
    // If form is valid, show success message
    if (isValid) {
        // In a real application, you would send the form data to a server here
        // For this demo, we'll just show a success message
        contactForm.innerHTML = `
            <div class="success-message">
                <h3>Merci pour votre message!</h3>
                <p>Nous vous contacterons dans les plus brefs délais.</p>
            </div>
        `;
    }
}

// Handle animation on scroll
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animated');
        }
    });
}

// === EVENT LISTENERS ===

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial slider
    showTestimonial(0);
    startTestimonialInterval();
    
    // Add animate-on-scroll class to elements
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .team-member, .service-card, .package-card'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Initial scroll animation check
    handleScrollAnimation();
    
    // Initial check for URL hash to open FAQ items
    if (window.location.hash) {
        const targetFAQ = document.querySelector(window.location.hash);
        if (targetFAQ && targetFAQ.classList.contains('faq-item')) {
            targetFAQ.classList.add('active');
            setTimeout(() => {
                window.scrollTo({
                    top: targetFAQ.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// Burger menu click event
if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMobileNav);
}

// Mobile nav link click event
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
if (mobileNavLinks) {
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMobileNav);
    });
}

// Window scroll event
window.addEventListener('scroll', handleScroll);
window.addEventListener('scroll', handleScrollAnimation);

// FAQ item click events
if (faqItems) {
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', toggleFAQ.bind(item));
    });
}

// Service card click events
if (serviceCards) {
    serviceCards.forEach(card => {
        card.addEventListener('click', toggleServiceDetails.bind(card));
    });
}

// Testimonial dot click events
if (dots) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            stopTestimonialInterval();
            startTestimonialInterval();
        });
    });
}

// Testimonial slider hover events
if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', stopTestimonialInterval);
    testimonialSlider.addEventListener('mouseleave', startTestimonialInterval);
}

// Contact form submit event
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Add smooth scrolling to all links with hash
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (targetId === '#' || targetId === '') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // If it's a FAQ item, open it
            if (targetElement.classList.contains('faq-item')) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                }, 500);
            }
        }
    });
}); 