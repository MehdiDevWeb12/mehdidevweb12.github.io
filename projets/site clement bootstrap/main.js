// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation AOS si présent
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }

  // Gestion du carrousel (si présent sur la page)
  const carousel = document.getElementById('carouselExample');
  if (carousel) {
    const carouselImages = document.querySelectorAll('.carousel-item img');
    const zoomedImage = document.getElementById('zoomedImage');
    const zoomedBackground = document.querySelector('.zoomed-background');
    const carouselInstance = new bootstrap.Carousel(carousel);
    
    // Fonction pour zoomer l'image
    function zoomImage(imageSrc) {
      zoomedBackground.style.opacity = 1;
      zoomedImage.src = imageSrc;
      zoomedImage.style.opacity = 1;
      zoomedImage.style.pointerEvents = 'auto';
    }
  
    // Fonction pour fermer l'image zoomée
    function closeZoom() {
      zoomedImage.style.opacity = 0;
      zoomedBackground.style.opacity = 0;
      zoomedImage.style.pointerEvents = 'none';
    }
  
    // Ajouter un événement de clic sur chaque image du carrousel
    carouselImages.forEach(image => {
      image.addEventListener('click', function() {
        zoomImage(image.src);
      });
    });
  
    // Fermer l'image zoomée en cliquant sur l'image zoomée ou sur le fond
    if (zoomedImage) zoomedImage.addEventListener('click', closeZoom);
    if (zoomedBackground) zoomedBackground.addEventListener('click', closeZoom);
  
    // Mettre à jour l'image zoomée lorsqu'on change d'image dans le carrousel
    carousel.addEventListener('slide.bs.carousel', function() {
      const currentImage = document.querySelector('.carousel-item.active img');
      if (zoomedImage && currentImage) zoomedImage.src = currentImage.src;
    });
  }

  // Filtres de la galerie
  const filterButtons = document.querySelectorAll('#gallery-filters button');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Supprimer la classe active de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Afficher/masquer les éléments selon le filtre
        galleryItems.forEach(item => {
          // Réinitialiser les animations AOS si présent
          if (typeof AOS !== 'undefined' && item.getAttribute('data-aos')) {
            item.setAttribute('data-aos-delay', '0');
          }
          
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
        
        // Rafraîchir AOS après le filtrage si présent
        if (typeof AOS !== 'undefined') {
          setTimeout(() => {
            AOS.refresh();
          }, 50);
        }
      });
    });
  }
  
  // Gestion du modal pour les images
  const viewButtons = document.querySelectorAll('.view-image');
  const imageModal = document.getElementById('imageModal');
  
  if (imageModal && viewButtons.length > 0) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    const modalDescription = document.getElementById('modalDescription');
    const modalMaterials = document.getElementById('modalMaterials');
    const modalDimensions = document.getElementById('modalDimensions');
    
    // Créer une instance de modal Bootstrap - une seule instance réutilisable
    const modalInstance = new bootstrap.Modal(imageModal, {
      backdrop: true,
      keyboard: true
    });
    
    // S'assurer que le backdrop est retiré lors de la fermeture du modal
    imageModal.addEventListener('hidden.bs.modal', function () {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach(backdrop => {
        backdrop.parentNode.removeChild(backdrop);
      });
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    });
    
    // Ajouter un gestionnaire d'événement à chaque bouton "Voir l'œuvre"
    viewButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        // Empêcher la propagation de l'événement
        event.stopPropagation();
        
        // Récupérer les données de l'œuvre
        const title = this.getAttribute('data-title');
        const description = this.getAttribute('data-description');
        const materials = this.getAttribute('data-materials');
        const dimensions = this.getAttribute('data-dimensions');
        
        // Récupérer l'image source
        const imgContainer = this.closest('.img-container');
        const img = imgContainer.querySelector('.gallery-img');
        const imgSrc = img.getAttribute('src');
        
        // Mettre à jour le contenu du modal
        modalTitle.textContent = title;
        modalImage.setAttribute('src', imgSrc);
        modalImage.setAttribute('alt', title);
        if (modalDescription) modalDescription.textContent = description;
        if (modalMaterials) modalMaterials.textContent = materials;
        if (modalDimensions) modalDimensions.textContent = dimensions;
        
        // Afficher le modal
        modalInstance.show();
      });
    });
    
    // Permettre également de cliquer sur la carte entière pour voir l'image
    document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', function(e) {
        // S'assurer que ce n'est pas le bouton qui a été cliqué (pour éviter double clic)
        if (!e.target.closest('.view-image')) {
          // Simuler un clic sur le bouton view-image de cette carte
          const viewButton = this.querySelector('.view-image');
          if (viewButton) {
            viewButton.click();
          }
        }
      });
    });
  }
});

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Gestion du menu burger
  const menuToggle = document.getElementById('menuToggle');
  const menuCheckbox = document.getElementById('menuCheckbox');
  const menu = document.getElementById('menu');
  const menuItems = document.querySelectorAll('#menu li a');
  
  if (menuToggle && menuCheckbox && menu) {
    // S'assurer que le menu est initialement fermé
    menu.style.transform = 'translateX(100%)';
    menu.style.opacity = '0';
    
    // Fonction pour fermer le menu
    function closeMenu() {
      menuCheckbox.checked = false;
      menu.style.transform = 'translateX(100%)';
      menu.style.opacity = '0';
      
      // Réinitialiser les animations des éléments du menu
      document.querySelectorAll('#menu li').forEach(item => {
        item.style.opacity = '0';
      });
    }
    
    // Ajouter l'événement click à chaque élément du menu
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        // Ne pas empêcher la navigation
        closeMenu();
      });
    });
    
    // Animation d'ouverture/fermeture du menu
    menuCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Ouvrir le menu avec animation
        menu.style.transform = 'translateX(0)';
        menu.style.opacity = '1';
        
        // Animation des éléments du menu
        document.querySelectorAll('#menu li').forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, index * 100);
        });
      } else {
        // Fermer le menu avec animation
        closeMenu();
      }
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(event) {
      if (menuCheckbox.checked && !menuToggle.contains(event.target) && !menu.contains(event.target)) {
        closeMenu();
      }
    });
    
    // Empêcher la fermeture si on clique sur le menu lui-même
    menu.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }
});



// Animation fluide pour le menu burger
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const menuCheckbox = document.getElementById('menuCheckbox');
  const menu = document.getElementById('menu');
  const menuItems = document.querySelectorAll('#menu li');
  
  if (menuToggle && menuCheckbox && menu) {
    // S'assurer que le menu est initialement fermé
    menu.style.transform = 'translateX(100%)';
    menu.style.opacity = '0';
    
    // Animation d'ouverture/fermeture du menu
    menuCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Ouvrir le menu avec animation fluide
        menu.style.transform = 'translateX(0)';
        menu.style.opacity = '1';
        
        // Animation en cascade des éléments du menu
        menuItems.forEach((item, index) => {
          item.style.transform = 'translateX(30px)';
          item.style.opacity = '0';
          
          setTimeout(() => {
            item.style.transition = 'all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) ' + (index * 0.07) + 's';
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
          }, 100);
        });
      } else {
        // Animation de fermeture fluide
        menu.style.transform = 'translateX(100%)';
        menu.style.opacity = '0';
        
        // Animation de sortie des éléments
        menuItems.forEach((item, index) => {
          const reverseIndex = menuItems.length - index - 1;
          setTimeout(() => {
            item.style.transform = 'translateX(30px)';
            item.style.opacity = '0';
          }, reverseIndex * 50);
        });
      }
    });
    
    // Effet de survol fluide pour les éléments du menu
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('mouseenter', function() {
          this.style.transition = 'all 0.3s ease';
          this.style.color = '#ffc107';
          this.style.paddingLeft = '10px';
          
          // Effet de brillance
          const glow = document.createElement('div');
          glow.classList.add('menu-link-glow');
          this.appendChild(glow);
          
          setTimeout(() => {
            if (glow.parentNode === this) {
              glow.style.opacity = '1';
              glow.style.width = '100%';
            }
          }, 10);
        });
        
        link.addEventListener('mouseleave', function() {
          this.style.color = '';
          this.style.paddingLeft = '';
          
          const glow = this.querySelector('.menu-link-glow');
          if (glow) {
            glow.style.opacity = '0';
            setTimeout(() => {
              if (glow.parentNode === this) {
                this.removeChild(glow);
              }
            }, 300);
          }
        });
      }
    });
    
    // Fermer le menu si on clique sur un lien
    menuItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('click', function() {
          // Effet de clic fluide
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
          
          setTimeout(() => {
            menuCheckbox.checked = false;
            menu.style.transform = 'translateX(100%)';
            menu.style.opacity = '0';
            
            // Réinitialiser les éléments
            menuItems.forEach(menuItem => {
              menuItem.style.transform = '';
              menuItem.style.opacity = '0';
            });
          }, 200);
        });
      }
    });
  }
});


// Ajouter à la fin du fichier main.js
document.addEventListener('DOMContentLoaded', function() {
  // Fonctionnalité de mode sombre/clair
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  
  // Vérifier si le mode sombre est déjà activé dans le localStorage
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    updateThemeIcons(true);
  }
  
  // Fonction pour mettre à jour les icônes
  function updateThemeIcons(isDark) {
    // Mettre à jour l'icône du bouton desktop
    if (themeToggle) {
      const desktopIcon = themeToggle.querySelector('i');
      if (desktopIcon) {
        if (isDark) {
          desktopIcon.classList.remove('fa-moon');
          desktopIcon.classList.add('fa-sun');
        } else {
          desktopIcon.classList.remove('fa-sun');
          desktopIcon.classList.add('fa-moon');
        }
      }
    }
    
    // Mettre à jour l'icône et le texte du menu mobile
    if (themeToggleMobile) {
      const mobileIcon = themeToggleMobile.querySelector('i');
      if (mobileIcon) {
        if (isDark) {
          mobileIcon.classList.remove('fa-moon');
          mobileIcon.classList.add('fa-sun');
          themeToggleMobile.textContent = '';
          themeToggleMobile.appendChild(mobileIcon);
          themeToggleMobile.appendChild(document.createTextNode(' Mode clair'));
        } else {
          mobileIcon.classList.remove('fa-sun');
          mobileIcon.classList.add('fa-moon');
          themeToggleMobile.textContent = '';
          themeToggleMobile.appendChild(mobileIcon);
          themeToggleMobile.appendChild(document.createTextNode(' Mode sombre'));
        }
      }
    }
  }
  
  // Fonction pour basculer le mode sombre
  function toggleDarkMode(e) {
    if (e) {
      e.preventDefault();
    }
    
    // Ajouter l'animation de rotation à l'icône
    if (this.querySelector('i')) {
      this.querySelector('i').classList.add('rotating');
    }
    
    // Basculer le mode sombre
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Mettre à jour le localStorage
    if (isDarkMode) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
    
    // Mettre à jour les icônes
    updateThemeIcons(isDarkMode);
    
    // Supprimer l'animation après 500ms
    setTimeout(() => {
      document.querySelectorAll('.rotating').forEach(icon => {
        icon.classList.remove('rotating');
      });
    }, 500);
  }
  
  // Ajouter les écouteurs d'événements
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }
  
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleDarkMode);
  }
});