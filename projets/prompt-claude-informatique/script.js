// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleIcon = themeToggleBtn.querySelector('i');
    const burgerIcon = document.querySelector('.burger-icon');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const closeBtn = document.querySelector('.close-btn');
    const backToTopBtn = document.querySelector('.back-to-top');
    const devisForm = document.getElementById('devis-form');
    const sections = document.querySelectorAll('section');
    
    // État initial
    let isDarkTheme = false;
    let isMenuOpen = false;

    // Système de détection de thème basé sur les préférences système
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        toggleTheme(true);
    }

    // Animation d'écriture pour le titre principal
    function typeWriter(element, text, speed = 80) {
        if (!element) return;
        
        // Vider le contenu actuel
        element.innerHTML = '';
        
        // Ajouter chaque caractère un par un avec une vitesse légèrement aléatoire
        let i = 0;
        const baseSpeed = speed;
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                
                // Ajouter une variation de vitesse pour un effet plus naturel
                // Les espaces sont plus rapides, la ponctuation plus lente
                let charSpeed = baseSpeed;
                
                // Ralentir légèrement pour les ponctuations
                if ('.,:;!?'.includes(text.charAt(i))) {
                    charSpeed = baseSpeed * 3;
                } 
                // Accélérer pour les espaces
                else if (text.charAt(i) === ' ') {
                    charSpeed = baseSpeed * 0.5;
                } 
                // Variation légère pour les autres caractères
                else {
                    charSpeed = baseSpeed + (Math.random() * 20 - 10);
                }
                
                setTimeout(type, charSpeed);
            }
        };
        
        // Commencer avec un court délai
        setTimeout(type, 200);
    }
    
    // Lancer l'animation d'écriture sur le titre du hero et vérifier la taille de l'écran
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        
        // Ajuster la vitesse d'animation en fonction de la largeur d'écran
        let typingSpeed = 40;
        if (window.innerWidth <= 768) {
            typingSpeed = 30; // Plus rapide sur mobile/tablette
        }
        
        // Lancer l'animation après le chargement complet de la page
        setTimeout(() => {
            typeWriter(heroTitle, originalText, typingSpeed);
        }, 300);
    }

    // Fonction pour changer de thème
    function toggleTheme(setDark = null) {
        if (setDark !== null) {
            isDarkTheme = setDark;
        } else {
            isDarkTheme = !isDarkTheme;
        }

        if (isDarkTheme) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
    }

    // Gestion du bouton de changement de thème
    themeToggleBtn.addEventListener('click', () => {
        toggleTheme();
    });

    // Gestionnaire du menu burger
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            burgerIcon.classList.add('burger-active');
            navLinks.classList.add('active');
            body.classList.add('menu-open');
            
            // S'assurer que la croix reste visible quand le menu est ouvert
            document.querySelectorAll('.burger-icon span').forEach(span => {
                span.style.backgroundColor = '#e74c3c';
            });
            
            // Animation des éléments du menu avec un délai
            const menuItems = document.querySelectorAll('.nav-links li');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.animation = `fadeInDown 0.4s ease-out ${index * 0.1}s forwards`;
                }, 100);
            });
        } else {
            burgerIcon.classList.remove('burger-active');
            body.classList.remove('menu-open');
            
            // Réinitialiser les couleurs des spans quand le menu se ferme
            document.querySelectorAll('.burger-icon span').forEach(span => {
                span.style.backgroundColor = '';
            });
            
            // Réinitialiser les animations des éléments du menu
            const menuItems = document.querySelectorAll('.nav-links li');
            menuItems.forEach(item => {
                item.style.animation = '';
                item.style.opacity = '1';
            });
            
            // Ajouter un délai avant de fermer le menu pour permettre l'animation de sortie
            setTimeout(() => {
                navLinks.classList.remove('active');
            }, 50);
        }
    }
    
    burgerIcon.addEventListener('click', toggleMenu);
    
    // Ajout d'un gestionnaire d'événements pour le bouton de fermeture
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    // Fermer le menu quand on clique sur un lien
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.burger-menu')) {
            toggleMenu();
        }
    });
    
    // Fermer le menu si la fenêtre est redimensionnée à plus de 992px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && isMenuOpen) {
            toggleMenu();
        }
        
        // Réajuster l'animation du titre si nécessaire
        if (heroTitle && window.innerWidth <= 768) {
            // Adapter le positionnement du curseur si nécessaire
        }
    });
    
    // Gestion du bouton "Retour en haut"
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Mettre à jour la navbar active en fonction de la section visible
        updateActiveNavOnScroll();
    });
    
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mettre à jour la navbar active en fonction de la section visible
    function updateActiveNavOnScroll() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    // Validation du formulaire de contact
    if (devisForm) {
        devisForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Réinitialiser les messages d'erreur
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.textContent = '');
            
            // Récupérer les champs
            const nom = document.getElementById('nom');
            const email = document.getElementById('email');
            const telephone = document.getElementById('telephone');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Validation du nom
            if (nom.value.trim() === '') {
                showError(nom, 'Veuillez entrer votre nom complet');
                isValid = false;
            } else if (nom.value.trim().length < 3) {
                showError(nom, 'Le nom doit contenir au moins 3 caractères');
                isValid = false;
            }
            
            // Validation de l'email
            if (email.value.trim() === '') {
                showError(email, 'Veuillez entrer votre adresse email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Veuillez entrer une adresse email valide');
                isValid = false;
            }
            
            // Validation du téléphone (si renseigné)
            if (telephone.value.trim() !== '' && !isValidPhone(telephone.value)) {
                showError(telephone, 'Veuillez entrer un numéro de téléphone valide');
                isValid = false;
            }
            
            // Validation du service
            if (service.value === '') {
                showError(service, 'Veuillez sélectionner un service');
                isValid = false;
            }
            
            // Validation du message
            if (message.value.trim() === '') {
                showError(message, 'Veuillez décrire votre projet');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Veuillez fournir plus de détails (minimum 10 caractères)');
                isValid = false;
            }
            
            // Si le formulaire est valide, simuler l'envoi
            if (isValid) {
                // Afficher un message de confirmation
                const formElement = devisForm;
                const submitBtn = formElement.querySelector('.submit-btn');
                
                // Désactiver le bouton pendant la simulation d'envoi
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
                
                // Simuler un délai d'envoi
                setTimeout(() => {
                    formElement.innerHTML = `
                        <div class="success-message fadeIn">
                            <i class="fas fa-check-circle"></i>
                            <h3>Demande envoyée avec succès !</h3>
                            <p>Nous vous contacterons dans les plus brefs délais.</p>
                        </div>
                    `;
                }, 1500);
            }
        });
        
        // Fonction pour afficher une erreur sous un champ
        function showError(input, message) {
            const formGroup = input.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            
            errorElement.textContent = message;
            input.classList.add('error');
            
            // Supprimer la classe d'erreur après correction
            input.addEventListener('input', function() {
                this.classList.remove('error');
                errorElement.textContent = '';
            });
        }
        
        // Fonction de validation d'email
        function isValidEmail(email) {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(email);
        }
        
        // Fonction de validation de téléphone
        function isValidPhone(phone) {
            // Format français ou international
            const regex = /^(\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- .]?\d{3,4}[- .]?\d{4}$/;
            return regex.test(phone);
        }
    }
    
    // Effet de défilement doux pour les ancres internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Offset pour la navbar fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Ajouter des animations au défilement pour les sections
    const animateOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.classList.add('fadeIn');
            }
        });
    };
    
    // Déclencher l'animation au chargement initial et au défilement
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Observer les changements de préférence système pour le thème
    prefersDarkScheme.addEventListener('change', e => {
        toggleTheme(e.matches);
    });
    
    // Gestion des modales pour les services
    const serviceCards = document.querySelectorAll('.service-card');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Ouvrir la modale lors du clic sur une carte de service
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceType = card.getAttribute('data-service');
            const modal = document.getElementById(`modal-${serviceType}`);
            
            if (modal) {
                // Bloquer le défilement de la page
                body.style.overflow = 'hidden';
                
                // Afficher la modale avec animation
                modal.classList.add('active');
                
                // Mettre le focus sur la modale pour l'accessibilité
                setTimeout(() => {
                    modal.querySelector('.modal-content').focus();
                }, 100);
            }
        });
    });
    
    // Fermer la modale au clic sur le bouton de fermeture
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-container');
            closeModal(modal);
        });
    });
    
    // Fermer la modale au clic en dehors du contenu
    modalContainers.forEach(container => {
        container.addEventListener('click', (e) => {
            // Si on clique sur le container (pas sur son contenu)
            if (e.target === container) {
                closeModal(container);
            }
        });
    });
    
    // Fermer la modale avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-container.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Fonction pour fermer une modale
    function closeModal(modal) {
        modal.classList.remove('active');
        
        // Réactiver le défilement
        body.style.overflow = '';
    }
    
    // Fermer la modale quand on clique sur un lien interne (comme "Demander un devis")
    document.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-container');
            closeModal(modal);
        });
    });
}); 