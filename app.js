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
            // Move actions to inside links for mobile when menu is clicked (ensures it's there)
            if (window.innerWidth <= 900 && navActions.parentNode !== navLinks) {
                navLinks.appendChild(navActions);
            }
            
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
                
                // Scroll to the card so it's fully visible
                setTimeout(() => {
                    const headerOffset = 120; // Accounts for sticky navbar
                    const elementPosition = card.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }, 300);
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
        { 
            title: 'Delineado de Ojos', 
            imgPath: 'delineadodeojos.jpeg', 
            category: 'micropigmentacion', 
            briefDesc: '$60.000 ARS',
            modalidadDesc: 'Clases guiadas por video y prácticas a corregir por la profesional. Al finalizar se emite un certificado.', 
            fullDesc: 'Aprendé desde cero una de las técnicas más solicitadas en micropigmentación. Descubrí cómo realizar un delineado profesional con seguridad, entendiendo la piel, los materiales y cada etapa del procedimiento. <br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Ideal para quienes quieren iniciar en la micropigmentación o sumar un nuevo servicio altamente rentable. Este curso está diseñado para que puedas aprender la técnica paso a paso, incluso sin experiencia previa.',
            temarioList: [
                'Clase teórica completa.',
                'Materiales y listado de productos.',
                'Higiene, bioseguridad y consentimiento.',
                'Pre y post tratamiento, práctica en látex.',
                'Arquitectura del punteo de pestaña.',
                'Demostración en modelo real paso a paso.',
                'Trabajo práctico y certificación.'
            ]
        },
        { 
            title: 'Diseño de Cejas', 
            imgPath: 'diseniodecejas.jpeg', 
            category: 'diseno-cejas', 
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Clases guiadas por video y prácticas a corregir por la profesional. Al finalizar se emite un certificado.', 
            fullDesc: 'Aprendé a diseñar cejas perfectas desde cero y sumá uno de los servicios más solicitados en el mundo de la belleza. Esta formación online está pensada para que puedas aprender de manera simple, profesional y segura la estructura del rostro y un método claro paso a paso. <br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Querés aprender a diseñar cejas de forma profesional</li><li>Buscás una formación clara y fácil de aplicar, incluso sin experiencia previa</li></ul>',
            temarioList: [
                'Estructura del rostro y análisis facial: Identificar la forma ideal de cejas.',
                'Visagismo aplicado a cejas: Cómo diseñar cejas equilibradas y armónicas.',
                'Medición y mapeo de cejas: La técnica para lograr simetría y precisión.',
                'Herramientas y materiales: Qué productos usar para trabajar correctamente.',
                'Higiene y protocolos de trabajo.',
                'Demostración paso a paso y Práctica guiada.',
                'Certificación al finalizar.'
            ]
        },
        {
            title: 'Extensiones de Pestañas con Fibras Tecnológicas',
            imgPath: 'FibrasTecnologicas.jpeg',
            category: 'pestanas',
            briefDesc: '$50.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos detallados, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé desde cero una de las técnicas más rentables y solicitadas en el mundo de la belleza. Este curso online está diseñado para enseñarte paso a paso, para que puedas comenzar a trabajar con seguridad y confianza.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés iniciar en el mundo de la belleza</li><li>Buscás una técnica rentable y muy solicitada</li><li>Querés aprender extensiones de pestañas desde cero</li><li>Querés sumar un nuevo servicio a tu gabinete</li></ul>',
            temarioList: [
                'Anatomía de la pestaña natural',
                'Materiales y productos',
                'Higiene y bioseguridad',
                'Aislamiento correcto de pestañas',
                'Técnica de colocación pelo a pelo',
                'Uso de fibras tecnológicas',
                'Diseño de mirada según el ojo de la clienta',
                'Demostración paso a paso',
                'Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Cejas Fusión – Efecto Polvo',
            imgPath: 'FusionBrowns.jpeg',
            category: 'cejas',
            briefDesc: '$80.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y pigmentos, y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más elegidas en micropigmentación para lograr cejas definidas, suaves y naturales. Este curso online está diseñado para enseñarte cómo realizar una micropigmentación suave, degradada y natural, logrando un resultado elegante y profesional.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la micropigmentación</li><li>Trabajás en estética y querés sumar un servicio premium</li><li>Querés aprender una técnica moderna y muy solicitada</li><li>Buscás diferenciarte como profesional</li></ul>',
            temarioList: [
                'Estructura de la piel',
                'Diseño y visagismo de cejas',
                'Mapeo y medición de cejas',
                'Materiales y productos necesarios',
                'Elección y manejo de pigmentos',
                'Técnica de sombreado efecto polvo',
                'Higiene y bioseguridad',
                'Consentimiento informado',
                'Pre y post tratamiento',
                'Demostración paso a paso en modelo',
                'Trabajo práctico y certificación'
            ]
        },
        {
            title: 'Henna Labial',
            imgPath: 'HENNA LABIAL.jpeg',
            category: 'micropigmentacion',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una técnica innovadora para realzar el color natural de los labios y ofrecer un servicio en tendencia. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar el tratamiento de forma profesional y segura.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás una técnica moderna y en tendencia</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Anatomía y estructura de los labios',
                'Materiales y productos necesarios',
                'Preparación de los labios antes del tratamiento',
                'Técnica de aplicación de Henna Labial',
                'Elección del color adecuado según cada cliente',
                'Higiene y protocolos de trabajo',
                'Cuidados posteriores al tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Henna Cejas',
            imgPath: 'HENNA.jpeg',
            category: 'cejas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una técnica innovadora para lograr cejas definidas, con efecto maquillaje natural. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar el tratamiento de forma profesional y segura.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás una técnica rápida, rentable y en tendencia</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura del rostro y diseño de cejas',
                'Visagismo aplicado a cejas',
                'Medición y mapeo de cejas',
                'Materiales y productos necesarios',
                'Elección del color adecuado según cada cliente',
                'Técnica de aplicación de henna en cejas',
                'Higiene y protocolos de trabajo',
                'Pre y post tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Hidragloss',
            imgPath: 'hidraglossbblips.jpeg',
            category: 'micropigmentacion',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos detallados, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más innovadoras y solicitadas para el tratamiento y embellecimiento de labios. Este curso online está diseñado para enseñarte paso a paso cómo realizar el tratamiento y lograr labios hidratados, con más volumen visual y un color atractivo.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la estética</li><li>Trabajás en belleza y querés sumar un nuevo servicio</li><li>Querés aprender una técnica moderna y muy solicitada</li><li>Buscás generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Anatomía y estructura de los labios',
                'Materiales y productos necesarios',
                'Uso del ácido hialurónico en Hidragloss',
                'Técnica de hidratación profunda de labios',
                'Hidragloss con color',
                'Cómo aportar volumen visual en los códigos de barra',
                'Higiene y protocolos de trabajo',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Laminación de Cejas',
            imgPath: 'LAMINADO.jpeg',
            category: 'cejas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más solicitadas para lograr cejas más definidas, ordenadas y con efecto lifting. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar el tratamiento de forma profesional y segura.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás una técnica moderna y muy solicitada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura del vello de la ceja',
                'Diseño y visagismo de cejas',
                'Preparación de la ceja antes del procedimiento',
                'Materiales y productos necesarios',
                'Técnica de laminación paso a paso',
                'Cómo lograr efecto volumen y cejas más ordenadas',
                'Higiene y protocolos de trabajo',
                'Cuidados posteriores al tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Lifting Técnica Coreana',
            imgPath: 'LIFTINGCOREANO.jpeg',
            category: 'pestanas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una técnica innovadora para lograr pestañas más curvas, elevadas y naturales. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar el tratamiento de forma profesional y segura.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás una técnica moderna y muy solicitada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Anatomía de la pestaña natural',
                'Materiales y productos necesarios',
                'Preparación correcta de las pestañas',
                'Técnica de lifting coreano paso a paso',
                'Elección de moldes según el tipo de ojo',
                'Cómo lograr mayor curvatura y efecto lifting',
                'Higiene y protocolos de trabajo',
                'Cuidados posteriores al tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Lifting de Pestañas',
            imgPath: 'LIFTINGTRADICIONAL.jpeg',
            category: 'pestanas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más solicitadas para lograr pestañas más curvas, elevadas y naturales. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar el tratamiento de forma profesional y segura.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás una técnica rápida y muy solicitada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Anatomía de la pestaña natural',
                'Materiales y productos necesarios',
                'Preparación correcta de las pestañas',
                'Técnica de lifting paso a paso',
                'Elección de moldes según el tipo de ojo',
                'Cómo lograr mayor curvatura y efecto lifting',
                'Higiene y protocolos de trabajo',
                'Cuidados posteriores al tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Microblading',
            imgPath: 'MICROBLADING.jpeg',
            category: 'micropigmentacion',
            briefDesc: '$60.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y pigmentos, y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más solicitadas en micropigmentación para lograr cejas hiperrealistas y naturales. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar cejas pelo a pelo con resultados naturales y profesionales.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la micropigmentación</li><li>Trabajás en estética y querés sumar un servicio premium</li><li>Buscás aprender una técnica altamente demandada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura de la piel',
                'Diseño y visagismo de cejas',
                'Medición y mapeo de cejas',
                'Materiales y herramientas necesarias',
                'Elección y manejo de pigmentos',
                'Técnica de Microblading pelo a pelo',
                'Higiene y bioseguridad',
                'Consentimiento informado',
                'Pre y post tratamiento',
                'Demostración paso a paso en modelo',
                'Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Perfilado de Cejas',
            imgPath: 'PERFILADO.jpeg',
            category: 'diseno-cejas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una técnica fundamental para lograr cejas más armónicas, definidas y adaptadas a cada rostro. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar diseños armónicos y profesionales.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un nuevo servicio</li><li>Buscás aprender una técnica esencial y muy solicitada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura del rostro',
                'Visagismo aplicado a cejas',
                'Medición y mapeo de cejas',
                'Diseño de cejas según cada rostro',
                'Materiales y herramientas necesarias',
                'Técnica de perfilado paso a paso',
                'Higiene y protocolos de trabajo',
                'Pre y post tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Extensiones de Pestañas Pelo por Pelo',
            imgPath: 'pestanaspxp.jpeg',
            category: 'pestanas',
            briefDesc: '$50.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más solicitadas para lograr una mirada más intensa, elegante y natural. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar aplicaciones profesionales y seguras.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de las extensiones de pestañas</li><li>Trabajás en estética y querés sumar un servicio muy solicitado</li><li>Buscás aprender una técnica rentable</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Anatomía de la pestaña natural',
                'Materiales y productos necesarios',
                'Preparación correcta de las pestañas',
                'Técnica de extensiones pelo por pelo',
                'Dirección, aislamiento y colocación correcta',
                'Diseño de mirada según el tipo de ojo',
                'Higiene y protocolos de trabajo',
                'Pre y post tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Micropigmentación Labial',
            imgPath: 'pmulabios.jpeg',
            category: 'micropigmentacion',
            briefDesc: '$60.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y pigmentos, y certificado de finalización.',
            fullDesc: 'Aprendé una de las técnicas más demandadas para lograr labios más definidos, armónicos y con un color natural. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas realizar tratamientos profesionales y seguros.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la micropigmentación</li><li>Trabajás en estética y querés sumar un servicio premium</li><li>Buscás aprender una técnica muy solicitada</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura de la piel en labios',
                'Anatomía y diseño de labios',
                'Mapeo y diseño previo al procedimiento',
                'Elección y manejo de pigmentos',
                'Materiales y herramientas necesarias',
                'Técnica de micropigmentación labial paso a paso',
                'Higiene y bioseguridad',
                'Consentimiento informado',
                'Pre y post tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        },
        {
            title: 'Tinte de Cejas',
            imgPath: 'TINTE.jpeg',
            category: 'cejas',
            briefDesc: '$20.000 ARS',
            modalidadDesc: 'Curso 100% online. Clase teórica completa, demostrativa paso a paso, videos explicativos, listado de materiales y certificado de finalización.',
            fullDesc: 'Aprendé a lograr cejas más definidas, uniformes y con efecto maquillaje natural en pocos minutos. Este curso online está diseñado para enseñarte todo el procedimiento, para que puedas trabajar con seguridad y lograr resultados profesionales.<br><br><span style="color:var(--color-gold); font-weight:500;"><i class="bx bx-video"></i> Incluye demostración paso a paso en alta definición.</span>',
            dirigidoDesc: 'Esta formación es ideal para vos si:<br><ul style="font-size:0.85rem; padding-left:15px; margin-top:5px;"><li>Querés comenzar en el mundo de la belleza</li><li>Trabajás en estética y querés sumar un servicio rápido y rentable</li><li>Buscás una técnica simple, de alta demanda</li><li>Querés generar nuevos ingresos en tu gabinete</li></ul>',
            temarioList: [
                'Estructura del vello y la piel',
                'Colorimetría aplicada a cejas',
                'Diseño y preparación previa',
                'Materiales y productos necesarios',
                'Técnica correcta de aplicación del tinte',
                'Tiempos de exposición y control del resultado',
                'Higiene y protocolos de trabajo',
                'Pre y post tratamiento',
                'Demostración paso a paso y Práctica guiada',
                'Certificación al finalizar'
            ]
        }
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
                        <p class="course-price" style="font-family: var(--font-body); font-variant-numeric: lining-nums; font-size: 1.3rem; font-weight: 500; color: var(--color-gold); margin-bottom: 1.2rem;">${course.briefDesc}</p>
                        <a href="#" class="btn btn-outline course-btn" onclick="window.toggleCardInfo(event)">Más Info</a>
                        
                        <div class="card-detailed-info">
                            <button class="close-btn" aria-label="Cerrar" onclick="window.closeCardInfo(event)"><i class='bx bx-x'></i></button>
                            
                            <div class="mini-banner">
                                <div class="info">
                                    <div class="status"><i class='bx bxs-star'></i> Inscripción Abierta</div>
                                    <div class="price">
                                        <h4>Reserva tu lugar</h4>
                                        <p style="font-size:0.85rem; margin-top:2px; color:var(--color-gold); font-weight:500;"><i class='bx bxs-badge-check'></i> Certificación Profesional</p>
                                    </div>
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
                                            <button class="mini-tab-btn" onclick="window.openTab(event, 'modalidad-${index}')">Modalidad</button>
                                        </div>
                                        
                                        <div id="general-${index}" class="mini-tab-content active">
                                            <p>${course.fullDesc || ''}</p>
                                        </div>

                                        <div id="dirigido-${index}" class="mini-tab-content">
                                            <p>${course.dirigidoDesc || 'Diseñado tanto para principiantes como para profesionales de la belleza.'}</p>
                                        </div>

                                        <div id="temario-${index}" class="mini-tab-content">
                                            <ul>
                                                ${course.temarioList ? course.temarioList.map(item => `<li>${item}</li>`).join('') : `
                                                <li>Introducción y conceptos teóricos.</li>
                                                <li>Visagismo y diseño.</li>
                                                <li>Práctica.</li>
                                                `}
                                            </ul>
                                        </div>

                                        <div id="modalidad-${index}" class="mini-tab-content">
                                            <p>${course.modalidadDesc || 'Clases guiadas por video y prácticas a corregir por la profesional. Luego de eso se emite un certificado.'}</p>
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
