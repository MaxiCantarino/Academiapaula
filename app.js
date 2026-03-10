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

    // --- DYNAMIC COURSE RENDERER ---
    const coursesConfig = [
        { title: 'Delineado de Ojos', imgPath: 'delineadodeojos.jpeg', category: 'micropigmentacion', briefDesc: 'Precio a consultar', fullDesc: 'Descubre todo sobre Delineado de Ojos y conviértete en una profesional altamente capacitada.' },
        { title: 'Diseño de Cejas', imgPath: 'diseniodecejas.jpeg', category: 'diseno-cejas', briefDesc: 'Precio a consultar', fullDesc: 'Descubre todo sobre Diseño de Cejas...' },
        { title: 'Fibras Tecnológicas', imgPath: 'FibrasTecnologicas.jpeg', category: 'pestanas', briefDesc: 'Precio a consultar', fullDesc: 'Descubre todo sobre Fibras Tecnológicas...' },
        { title: 'Fusion Browns', imgPath: 'FusionBrowns.jpeg', category: 'cejas', briefDesc: 'Precio a consultar', fullDesc: 'Aprende la técnica Fusion Browns para resultados impactantes.' },
        { title: 'Henna Labial', imgPath: 'HENNA LABIAL.jpeg', category: 'micropigmentacion', briefDesc: 'Precio a consultar', fullDesc: 'Técnica de hidratación y color sutil en labios.' },
        { title: 'Henna Cejas', imgPath: 'HENNA.jpeg', category: 'cejas', briefDesc: 'Precio a consultar', fullDesc: 'Pigmentación natural con Henna para un diseño definido.' },
        { title: 'Hidragloss / BB Lips', imgPath: 'hidraglossbblips.jpeg', category: 'micropigmentacion', briefDesc: 'Precio a consultar', fullDesc: 'Tratamiento de ultra hidratación labial con BB Lips.' },
        { title: 'Laminado', imgPath: 'LAMINADO.jpeg', category: 'cejas', briefDesc: 'Precio a consultar', fullDesc: 'Técnica de laminado para cejas perfiladas y abundantes.' },
        { title: 'Lifting Coreano', imgPath: 'LIFTINGCOREANO.jpeg', category: 'pestanas', briefDesc: 'Precio a consultar', fullDesc: 'Técnica avanzada de lifting de origen coreano.' },
        { title: 'Lifting Tradicional', imgPath: 'LIFTINGTRADICIONAL.jpeg', category: 'pestanas', briefDesc: 'Precio a consultar', fullDesc: 'Arqueado de pestañas naturales para una mirada abierta.' },
        { title: 'Microblading', imgPath: 'MICROBLADING.jpeg', category: 'micropigmentacion', briefDesc: 'Precio a consultar', fullDesc: 'Curso base de Microblading.' },
        { title: 'Perfilado', imgPath: 'PERFILADO.jpeg', category: 'diseno-cejas', briefDesc: 'Precio a consultar', fullDesc: 'Diseño experto y retiro de vello con alta definición.' },
        { title: 'Pestañas PxP', imgPath: 'pestanaspxp.jpeg', category: 'pestanas', briefDesc: 'Precio a consultar', fullDesc: 'Técnica clásica de pelo por pelo.' },
        { title: 'PMU Labios', imgPath: 'pmulabios.jpeg', category: 'micropigmentacion', briefDesc: 'Precio a consultar', fullDesc: 'Maquillaje permanente de labios.' },
        { title: 'Tinte', imgPath: 'TINTE.jpeg', category: 'cejas', briefDesc: 'Precio a consultar', fullDesc: 'Tinte para cejas para resaltar la mirada.' }
    ];

    function renderCourses() {
        const grid = document.querySelector('.courses-grid');
        if (!grid) return;

        grid.innerHTML = '';

        coursesConfig.forEach((course, index) => {
            let delayClass = '';
            if (index % 3 === 1) delayClass = 'delay-1';
            if (index % 3 === 2) delayClass = 'delay-2';

            const cardHtml = `
                <article class="course-card reveal ${delayClass}" data-category="${course.category}" data-image-name="${course.imgPath}">
                    <div class="card-image-wrapper">
                        <img src="assets/images/placeholder.jpg" alt="${course.title}" class="course-img" loading="lazy">
                        <img src="assets/images/logo-paula.png" alt="Watermark" class="watermark-logo">
                        <div class="card-overlay"></div>
                    </div>
                    <div class="card-content">
                        <h3>${course.title}</h3>
                        <p class="course-price">${course.briefDesc}</p>
                        <a href="#" class="btn btn-outline course-btn" onclick="window.toggleCardInfo(event)">Más Info</a>
                        
                        <div class="card-detailed-info">
                            <button class="close-btn" aria-label="Cerrar" onclick="window.closeCardInfo(event)"><i class='bx bx-x'></i></button>
                            
                            <div class="mini-banner">
                                <div class="info">
                                    <div class="status"><i class='bx bxs-star'></i> Inscripción Abierta</div>
                                    <div class="price"><h4>Reserva tu lugar</h4></div>
                                </div>
                                <div class="cta-area" style="text-align: right;">
                                    <a href="https://app3.doyturnos.com/paulacantarino/" class="btn-gold" target="_blank">Inscribirme</a>
                                </div>
                            </div>

                            <div class="expanded-content-grid">
                                <div class="course-mini-tabs-col">
                                    <div class="mini-tabs">
                                        <div class="mini-tab-headers">
                                            <button class="mini-tab-btn active" onclick="window.openTab(event, 'general-${index}')">Información</button>
                                            <button class="mini-tab-btn" onclick="window.openTab(event, 'dirigido-${index}')">Dirigido A</button>
                                            <button class="mini-tab-btn" onclick="window.openTab(event, 'temario-${index}')">Temario</button>
                                        </div>
                                        
                                        <div id="general-${index}" class="mini-tab-content active">
                                            <p>${course.fullDesc}</p>
                                        </div>

                                        <div id="dirigido-${index}" class="mini-tab-content">
                                            <p>Diseñado tanto para principiantes como para profesionales de la belleza.</p>
                                        </div>

                                        <div id="temario-${index}" class="mini-tab-content">
                                            <ul>
                                                <li>Introducción y conceptos teóricos.</li>
                                                <li>Visagismo y diseño.</li>
                                                <li>Práctica.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="course-mini-form-col">
                                    <div class="mini-form-container">
                                        <h4>Quiero comunicarme</h4>
                                        <p>Envíanos un mensaje por WhatsApp pidiendo el de ${course.title}.</p>
                                        <a href="https://wa.me/5493512560617" target="_blank" class="btn-gold" style="display: block; width: 100%; text-align: center;">Contactar por WhatsApp</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            grid.innerHTML += cardHtml;
        });

        // 7b. Re-observe new elements for scroll animation
        const newReveals = grid.querySelectorAll('.reveal');
        if (typeof revealObserver !== 'undefined') {
            newReveals.forEach(el => revealObserver.observe(el));
        }

        // Initialize Filter Buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        const courseCards = document.querySelectorAll('.course-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                courseCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide-course');
                    } else {
                        card.classList.add('hide-course');
                    }
                });
            });
        });
    }

    // 8. Supabase Storage Integration for Course Cards
    async function loadCourseImages() {
        if (typeof window.supabaseClient === 'undefined') return;

        const bucketName = 'Cursos';
        const cards = document.querySelectorAll('.course-card');
        
        cards.forEach((card) => {
            const imageName = card.getAttribute('data-image-name');
            if (!imageName) return;
            
            const { data: publicUrlData } = window.supabaseClient.storage.from(bucketName).getPublicUrl(imageName);

            if (publicUrlData && publicUrlData.publicUrl) {
                const imgEl = card.querySelector('.course-img');
                if (imgEl) {
                    const cacheBuster = `?t=${Date.now()}`;
                    imgEl.src = publicUrlData.publicUrl + cacheBuster;
                }
            }
        });
    }

    // Call the function if we are on the courses page
    if (document.querySelector('.courses-grid')) {
        // Render the HTML courses first
        renderCourses();

        // We use a small recursive check because auth.js might initialize it slightly after app.js runs 
        // since they are both deferred or at the bottom of the body.
        const checkAndLoad = () => {
            if (typeof window.supabaseClient !== 'undefined') {
                loadCourseImages();
            } else {
                setTimeout(checkAndLoad, 100);
            }
        };
        checkAndLoad();
    }

    // 8. Auto-playing Carousel for Home Page
    const carouselImages = document.querySelectorAll('.carousel-img');
    if (carouselImages.length > 0) {
        let currentImgIndex = 0;
        setInterval(() => {
            carouselImages[currentImgIndex].classList.remove('active');
            carouselImages[currentImgIndex].style.opacity = '0';
            
            currentImgIndex = (currentImgIndex + 1) % carouselImages.length;
            
            carouselImages[currentImgIndex].classList.add('active');
            carouselImages[currentImgIndex].style.opacity = '1';
        }, 3500); // Change image every 3.5 seconds
    }
});
