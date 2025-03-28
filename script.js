// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize AOS
AOS.init({
    duration: 1000,
    offset: 100,
    once: false,
    mirror: true
});

// Reset AOS animations when scrolling back to top
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset;
    
    // If scrolling up and past 100px
    if (currentScrollTop < lastScrollTop && currentScrollTop < 100) {
        AOS.refresh();
    }
    
    lastScrollTop = currentScrollTop;
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation du header au scroll (plus rapide)
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Technology Dropdown
document.querySelectorAll('.tech-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = button.nextElementSibling;
        const allDropdowns = document.querySelectorAll('.tech-dropdown');
        
        // Close other dropdowns
        allDropdowns.forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.tech-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Curseur personnalisé
document.addEventListener('DOMContentLoaded', () => {
    // Le curseur personnalisé a été désactivé
    // Vous pouvez réactiver ce code plus tard si vous le souhaitez
    /*
    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Créer une version plus simple du curseur pour les utilisateurs qui préfèrent réduire les animations
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--cursor-trail-size', '0px');
        document.documentElement.classList.add('reduced-motion');
    }
    
    if (window.matchMedia('(hover: hover)').matches) {
        const cursorInner = document.querySelector('.cursor-inner');
        const cursorOuter = document.querySelector('.cursor-outer');
        const customCursor = document.querySelector('.custom-cursor');
        
        // Position initiale des curseurs
        let cursorX = -100;
        let cursorY = -100;
        
        // Positions cibles (position actuelle de la souris)
        let targetX = -100;
        let targetY = -100;
        
        // Vitesse d'interpolation (pour effet de traînée)
        const innerSpeed = prefersReducedMotion ? 1 : 1; // Aucun retard pour le curseur interne
        const outerSpeed = prefersReducedMotion ? 0.5 : 0.15; // Effet de traînée réduit pour le curseur externe
        
        // Ajuster les tailles en fonction de la densité de pixels
        const pixelRatio = window.devicePixelRatio || 1;
        
        if (pixelRatio > 1.5) {
            // Ajuster les tailles pour les écrans haute résolution
            document.documentElement.style.setProperty('--cursor-inner-size', '6px');
            document.documentElement.style.setProperty('--cursor-outer-size', '30px');
        } else {
            // Tailles par défaut pour les écrans standards
            document.documentElement.style.setProperty('--cursor-inner-size', '8px');
            document.documentElement.style.setProperty('--cursor-outer-size', '40px');
        }
        
        // Masquer le curseur natif
        document.body.style.cursor = 'none';
        
        // Variables pour la gestion des performances
        let lastTimestamp = 0;
        const fpsInterval = 1000 / 60; // Limite à 60 FPS
        let isPageVisible = true;
        
        // Vérifier si la page est visible
        document.addEventListener('visibilitychange', () => {
            isPageVisible = document.visibilityState === 'visible';
        });
        
        // Fonction de mise à jour de la position du curseur avec interpolation et optimisation
        function updateCursorPosition(timestamp) {
            // Ne mettre à jour que si la page est visible
            if (!isPageVisible) {
                requestAnimationFrame(updateCursorPosition);
                return;
            }
            
            // Limiter le frame rate
            if (!timestamp || timestamp - lastTimestamp >= fpsInterval) {
                // Mise à jour du timestamp
                lastTimestamp = timestamp;
                
                // Interpolation pour effet de traînée
                cursorX += (targetX - cursorX) * innerSpeed;
                cursorY += (targetY - cursorY) * innerSpeed;
                
                // Arrondir les valeurs pour éviter les sous-pixels qui peuvent causer du flou
                const roundedX = Math.round(cursorX);
                const roundedY = Math.round(cursorY);
                
                // Appliquer la position au curseur interne avec transformation GPU
                cursorInner.style.transform = `translate3d(${roundedX}px, ${roundedY}px, 0)`;
                
                // Calculer la position du curseur externe avec retard
                const outerX = cursorX + (targetX - cursorX) * outerSpeed;
                const outerY = cursorY + (targetY - cursorY) * outerSpeed;
                
                // Arrondir les valeurs
                const roundedOuterX = Math.round(outerX);
                const roundedOuterY = Math.round(outerY);
                
                // Appliquer la position au curseur externe avec transformation GPU
                cursorOuter.style.transform = `translate3d(${roundedOuterX}px, ${roundedOuterY}px, 0)`;
            }
            
            // Continuer l'animation
            requestAnimationFrame(updateCursorPosition);
        }
        
        // Démarrer l'animation
        requestAnimationFrame(updateCursorPosition);
        
        // Variables pour gérer la fréquence des particules
        let lastTrailTime = 0;
        const trailInterval = 100; // Intervalle minimum entre les particules (ms)
        
        // Suivre le mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            
            // Créer des particules de traînée à intervalles réguliers
            // (uniquement si l'utilisateur n'a pas demandé de réduire les animations)
            if (!prefersReducedMotion) {
                const now = performance.now();
                if (now - lastTrailTime > trailInterval && Math.random() > 0.5) {
                    createCursorTrail(e.clientX, e.clientY);
                    lastTrailTime = now;
                }
            }
        });
        
        // Gérer les différents types d'éléments interactifs
        
        // Liens et boutons
        const linkElements = document.querySelectorAll('a, button, [role="button"], .clickable');
        linkElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-hover');
                customCursor.classList.add('cursor-link');
            });
            
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-hover');
                customCursor.classList.remove('cursor-link');
            });
        });
        
        // Images et médias
        const mediaElements = document.querySelectorAll('img, video, canvas, svg, .media');
        mediaElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-media');
            });
            
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-media');
            });
        });
        
        // Formulaires
        const inputElements = document.querySelectorAll('input, select');
        inputElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-input');
            });
            
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-input');
            });
        });
        
        // Textareas
        const textElements = document.querySelectorAll('textarea');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-text');
            });
            
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-text');
            });
        });
        
        // Effet magnétique pour certains éléments
        const magneticElements = document.querySelectorAll('.magneto-cursor');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                // Récupérer la position et les dimensions de l'élément
                const rect = el.getBoundingClientRect();
                
                // Calculer la position du centre de l'élément
                const elCenterX = rect.left + rect.width / 2;
                const elCenterY = rect.top + rect.height / 2;
                
                // Calculer la distance par rapport au centre de l'élément
                const deltaX = e.clientX - elCenterX;
                const deltaY = e.clientY - elCenterY;
                
                // Calculer la force de l'attraction (inversement proportionnelle à la distance)
                const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDist = Math.max(rect.width, rect.height) / 2;
                const force = Math.max(0, 1 - dist / maxDist);
                
                // Calculer le déplacement de l'élément (plus proche = plus fort)
                const moveX = deltaX * force * 0.2;
                const moveY = deltaY * force * 0.2;
                
                // Appliquer le déplacement
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                // Remettre l'élément à sa position initiale avec une transition douce
                el.style.transition = 'transform 0.5s ease-out';
                el.style.transform = 'translate(0, 0)';
                
                setTimeout(() => {
                    el.style.transition = '';
                }, 500);
            });
        });
        
        // Effet au clic
        document.addEventListener('mousedown', () => {
            customCursor.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            customCursor.classList.remove('cursor-click');
        });
        
        // Effet de déformation au mouvement rapide
        let lastX = 0;
        let lastY = 0;
        let moveTimer;
        
        document.addEventListener('mousemove', (e) => {
            clearTimeout(moveTimer);
            
            // Calculer la vitesse du mouvement
            const deltaX = Math.abs(e.clientX - lastX);
            const deltaY = Math.abs(e.clientY - lastY);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Appliquer une déformation en fonction de la vitesse
            if (distance > 10) {
                const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX);
                const stretch = Math.min(distance / 5, 2);
                
                cursorOuter.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(${1 + stretch * 0.1}, ${1 - stretch * 0.05}) rotate(${angle}rad)`;
                
                moveTimer = setTimeout(() => {
                    cursorOuter.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                }, 100);
            }
            
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        // Créer des particules de traînée
        function createCursorTrail(x, y) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            
            document.body.appendChild(trail);
            
            // Supprimer l'élément après l'animation
            setTimeout(() => {
                trail.remove();
            }, 500);
        }
        
        // Cacher le curseur quand il sort de la fenêtre
        document.addEventListener('mouseleave', () => {
            cursorInner.style.opacity = '0';
            cursorOuter.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursorInner.style.opacity = '1';
            cursorOuter.style.opacity = '0.5';
        });
        
        // Option pour désactiver/réactiver le curseur personnalisé
        const toggleCursorButton = document.createElement('button');
        toggleCursorButton.classList.add('toggle-cursor-button');
        toggleCursorButton.innerHTML = '<i class="fas fa-mouse-pointer"></i>';
        toggleCursorButton.title = 'Activer/désactiver le curseur personnalisé';
        
        document.body.appendChild(toggleCursorButton);
        
        let customCursorEnabled = true;
        
        toggleCursorButton.addEventListener('click', () => {
            customCursorEnabled = !customCursorEnabled;
            
            if (customCursorEnabled) {
                // Activer le curseur personnalisé
                document.body.style.cursor = 'none';
                customCursor.style.display = 'block';
            } else {
                // Désactiver le curseur personnalisé
                document.body.style.cursor = 'auto';
                customCursor.style.display = 'none';
            }
        });
    }
    */
}); 