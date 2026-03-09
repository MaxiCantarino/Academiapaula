/* 
   ========================================
   PAULA CANTARINO - LUXURY E-LEARNING
   Core Interactions
   ========================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar Effect on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Mobile Menu Toggle 
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    // Create a mobile menu container if it doesn't exist to handle the layout elegantly on click
    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isMenuOpen = navLinks.classList.contains('active');
            
            if (isMenuOpen) {
                // Close menu
                navLinks.classList.remove('active');
                mobileToggle.innerHTML = "<i class='bx bx-menu'></i>";
                
                // If not scrolled, remove the solid background
                if (window.scrollY <= 50) {
                    navbar.style.backgroundColor = ''; 
                }
            } else {
                // Open menu
                navLinks.classList.add('active');
                mobileToggle.innerHTML = "<i class='bx bx-x'></i>";
                
                // Ensure navbar is solid when menu is open so it's readable
                navbar.style.backgroundColor = 'rgba(30, 33, 37, 0.98)';
            }
        });
    }

    // 4. Smooth Scrolling for Anchor Links (Only if hash is present in same page)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if(window.innerWidth <= 900 && navLinks.style.display === 'flex') {
                mobileToggle.click();
            }

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Expandable Course Cards Logic
    window.toggleCardInfo = function(event) {
        // Prevent default anchor action if it's a link
        if(event) event.preventDefault();
        
        const btn = event.currentTarget.closest('.course-btn');
        if (!btn) return;

        const card = btn.closest('.course-card');
        if (!card) return;

        // Close all other expanded cards first (optional, but keeps it clean)
        const allCards = document.querySelectorAll('.course-card.expanded');
        allCards.forEach(c => {
            if (c !== card) {
                c.classList.remove('expanded');
                const info = c.querySelector('.card-detailed-info');
                if (info) info.classList.remove('active');
            }
        });

        // Toggle the clicked card
        card.classList.toggle('expanded');
        const detailedInfo = card.querySelector('.card-detailed-info');
        if (detailedInfo) {
            detailedInfo.classList.toggle('active');
            
            // If opening, ensure the first tab is active by default
            if (detailedInfo.classList.contains('active')) {
                const firstTabBtn = detailedInfo.querySelector('.mini-tab-btn');
                if(firstTabBtn && !detailedInfo.querySelector('.mini-tab-btn.active')) {
                    firstTabBtn.click();
                }
            }
        }
    };
    
    // Close Card Logic
    window.closeCardInfo = function(event) {
        if(event) event.preventDefault();
        const card = event.currentTarget.closest('.course-card');
        if(card) {
            card.classList.remove('expanded');
            const info = card.querySelector('.card-detailed-info');
            if(info) info.classList.remove('active');
        }
    };

    // 6. Mini Tab Toggling inside Course Cards
    window.openTab = function(event, tabId) {
        // Find the parent detailed info section to scope the tab switching
        const section = event.currentTarget.closest('.card-detailed-info');
        if (!section) return;
        
        // Hide all tab content within this section
        const tabs = section.querySelectorAll('.mini-tab-content');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Deactivate all tab buttons within this section
        const tabBtns = section.querySelectorAll('.mini-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show the current tab and activate the button
        const targetTab = section.querySelector('#' + tabId);
        if(targetTab) targetTab.classList.add('active');
        
        event.currentTarget.classList.add('active');
    };
});
