/* 
   ========================================
   PAULA CANTARINO - LUXURY E-LEARNING
   Supabase Authentication Logic
   ========================================
*/

// Initialize Supabase Client
const supabaseUrl = 'https://ipnooyvxrsdjxlsjqcgd.supabase.co';
const supabaseKey = 'sb_publishable_sMfbOOvidLUB8gGcdCUtVw_ijphwWzm'; // Reemplazar con la key real en producción o variables de entorno
let supabaseClient;
try {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    // Export globally for other scripts to use
    window.supabaseClient = supabaseClient;
} catch (error) {
    console.error("No se pudo cargar Supabase. Es posible que un bloqueador de anuncios lo impidiera o falte internet.", error);
}

// --- Helpers de UI para Contraseñas ---
window.togglePasswordVisibility = function(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('bx-hide');
        iconElement.classList.add('bx-show');
    } else {
        input.type = 'password';
        iconElement.classList.remove('bx-show');
        iconElement.classList.add('bx-hide');
    }
};

window.checkPasswordStrength = function(password) {
    const reqLength = document.getElementById('req-length');
    const reqUpper = document.getElementById('req-upper');
    const reqNumber = document.getElementById('req-number');

    if(!reqLength || !reqUpper || !reqNumber) return;

    // Longitud mínima
    if (password.length >= 8) {
        reqLength.innerHTML = `<i class='bx bx-check-circle' style="color: #34C759; margin-right: 4px; vertical-align: middle;"></i> Mínimo 8 caracteres`;
        reqLength.style.color = '#34C759';
    } else {
        reqLength.innerHTML = `<i class='bx bx-x-circle' style="color: #FF3B30; margin-right: 4px; vertical-align: middle;"></i> Mínimo 8 caracteres`;
        reqLength.style.color = 'var(--color-gray)';
    }

    // Mayúscula
    if (/[A-Z]/.test(password)) {
        reqUpper.innerHTML = `<i class='bx bx-check-circle' style="color: #34C759; margin-right: 4px; vertical-align: middle;"></i> Al menos 1 mayúscula`;
        reqUpper.style.color = '#34C759';
    } else {
        reqUpper.innerHTML = `<i class='bx bx-x-circle' style="color: #FF3B30; margin-right: 4px; vertical-align: middle;"></i> Al menos 1 mayúscula`;
        reqUpper.style.color = 'var(--color-gray)';
    }

    // Número
    if (/[0-9]/.test(password)) {
        reqNumber.innerHTML = `<i class='bx bx-check-circle' style="color: #34C759; margin-right: 4px; vertical-align: middle;"></i> Al menos 1 número`;
        reqNumber.style.color = '#34C759';
    } else {
        reqNumber.innerHTML = `<i class='bx bx-x-circle' style="color: #FF3B30; margin-right: 4px; vertical-align: middle;"></i> Al menos 1 número`;
        reqNumber.style.color = 'var(--color-gray)';
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias a Formularios UI ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    // --- Registro de Usuario ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Suponemos que tienes inputs con IDs específicos
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');
            const nameInput = document.getElementById('reg-name'); // Opcional
            const formMessage = document.getElementById('reg-message'); // Para errores/éxitos
            
            const email = emailInput?.value;
            const password = passwordInput?.value;
            const name = nameInput?.value || '';

            try {
                // UI Loading Feedback
                if (formMessage) {
                    formMessage.style.color = '#a48650'; // Gold color
                    formMessage.innerText = 'Creando cuenta, por favor espera...';
                }

                // Supabase SignUp
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) throw error;

                if (formMessage) {
                    formMessage.style.color = 'green';
                    formMessage.innerText = '¡Registro exitoso! Redirigiendo a Iniciar Sesión...';
                }
                
                // Redirect user to login automatically after success
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                console.error("Error en registro:", error.message);
                if (formMessage) {
                    formMessage.style.color = 'red';
                    formMessage.innerText = 'Error: ' + error.message;
                }
            }
        });
    }

    // --- Ingreso de Usuario (Login) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const formMessage = document.getElementById('login-message');
            
            const email = emailInput?.value;
            const password = passwordInput?.value;

            try {
                // Supabase SignIn
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                // Si es exitoso, redirigimos al área privada
                window.location.href = 'alumnos.html';

            } catch (error) {
                console.error("Error en login:", error.message);
                if (formMessage) {
                    formMessage.style.color = 'red';
                    formMessage.innerText = 'Credenciales incorrectas o error al ingresar.';
                }
            }
        });
    }

    // --- Restablecer Contraseña (Forgot Password) ---
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput?.value;
            const formMessage = document.getElementById('login-message');

            if (!email) {
                if (formMessage) {
                    formMessage.style.color = '#a48650'; // Gold color
                    formMessage.innerText = '⚠️ Por favor, ingresa tu correo en la casilla de arriba antes de solicitar una nueva contraseña.';
                }
                return;
            }

            if (formMessage) {
                formMessage.style.color = 'var(--color-gray)';
                formMessage.innerText = 'Enviando solicitud de restablecimiento...';
            }

            try {
                // Build robust redirect URL relative to current location
                let redirectUrl = window.location.origin;
                if (window.location.pathname.includes('/login.html')) {
                    redirectUrl = window.location.href.replace('login.html', 'perfil.html');
                } else {
                    redirectUrl += '/perfil.html';
                }

                const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: redirectUrl
                });

                if (error) throw error;

                if (formMessage) {
                    formMessage.style.color = '#34C759'; // Green success
                    formMessage.innerText = '¡Listo! Te hemos enviado un correo con el enlace para restablecer tu contraseña. (Revisa en Spam por si acaso).';
                }

            } catch (error) {
                console.error("Error al restablecer contraseña:", error.message);
                if (formMessage) {
                    formMessage.style.color = '#FF3B30'; // Red error
                    formMessage.innerText = 'Hubo un problema. Verifica que el correo ingresado sea válido.';
                }
            }
        });
    }

    // --- Cerrar Sesión (Logout) ---
    const logoutBtns = document.querySelectorAll('#logout-btn, .logout-action');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error("Error al cerrar sesión:", error.message);
            } else {
                window.location.href = 'login.html';
            }
        });
    });

    // --- Perfil de Usuario (Mi Perfil) ---
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        // Inicializar datos al cargar la página si hay sesión
        (async () => {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const user = session.user;
                const userDisplayName = user.user_metadata?.full_name || '';
                const userEmail = user.email;
                
                // Actualizar UI
                const profileNameInput = document.getElementById('profile-name');
                const profileEmailInput = document.getElementById('profile-email');
                const profileDisplayNameH3 = document.getElementById('profile-display-name');
                const profileDisplayEmailP = document.getElementById('profile-display-email');
                const avatarIcon = document.getElementById('profile-avatar-large');

                if (profileNameInput) profileNameInput.value = userDisplayName;
                if (profileEmailInput) profileEmailInput.value = userEmail;
                if (profileDisplayNameH3) profileDisplayNameH3.innerText = userDisplayName || 'Alumno';
                if (profileDisplayEmailP) profileDisplayEmailP.innerText = userEmail;
                if (avatarIcon) {
                    avatarIcon.innerText = (userDisplayName || userEmail)[0].toUpperCase();
                }
            }
        })();

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('save-profile-btn');
            const messageEl = document.getElementById('profile-message');
            const newName = document.getElementById('profile-name')?.value;
            const newPassword = document.getElementById('profile-new-password')?.value;

            btn.innerText = 'Guardando...';
            btn.disabled = true;
            if (messageEl) {
                messageEl.innerText = '';
                messageEl.className = 'auth-message';
            }

            try {
                let updates = { data: { full_name: newName } };
                // Si el usuario ingresó contraseña nueva, la agreamos al update
                if (newPassword && newPassword.trim() !== '') {
                    updates.password = newPassword;
                }

                const { data, error } = await supabaseClient.auth.updateUser(updates);

                if (error) throw error;

                if (messageEl) {
                    messageEl.innerText = '¡Perfil actualizado correctamente!';
                    messageEl.style.color = '#34C759'; // Verde
                    
                    // Actualizar UI dinámica
                    const profileDisplayNameH3 = document.getElementById('profile-display-name');
                    if (profileDisplayNameH3) profileDisplayNameH3.innerText = newName;
                    
                    // Actualizar navbar avatar
                    const navDisplayName = document.getElementById('user-display-name');
                    if(navDisplayName) navDisplayName.innerText = newName.split(' ')[0] || newName;
                }

            } catch (error) {
                console.error("Error al actualizar perfil:", error.message);
                if (messageEl) {
                    messageEl.innerText = 'Error: No se pudo actualizar. ' + error.message;
                    messageEl.style.color = '#FF3B30'; // Rojo
                }
            } finally {
                btn.innerText = 'Guardar Cambios';
                btn.disabled = false;
                // Limpiar input de contraseña por seguridad después de update
                const pwdInput = document.getElementById('profile-new-password');
                if(pwdInput) pwdInput.value = '';
            }
        });
    }

});

// --- Dynamic Navbar Update ---
// Actualiza los botones del menú de navegación (Login vs Área Alumnos) dependiendo del estado de la sesión
window.updateNavbarState = async function() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    if (!authButtonsContainer) return; // Si no estamos en una página con este contenedor, ignoramos

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        // Usuario logueado, mostrar botón al Área de Alumnos
        authButtonsContainer.innerHTML = `<a href="alumnos.html" class="btn btn-outline" style="padding: 0.6rem 1.5rem; font-size: 0.75rem; border-color: #a48650; color: #a48650;">Portal Alumno</a>`;
    } else {
        // Usuario visitante, mostrar botón de Login
        authButtonsContainer.innerHTML = `<a href="login.html" class="btn btn-outline" style="padding: 0.6rem 1.5rem; font-size: 0.75rem;">Portal Alumnos</a>`;
    }
};

// Llamar a la actualización del navbar al cargar cualquier script que incluya auth.js
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarState();
});

// --- Protección de Rutas (Middleware Cliente) ---
// Función global para verificar que el usuario esté autenticado en páginas protegidas
window.checkAuth = async function(redirectIfNotAuthenticated = true) {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (redirectIfNotAuthenticated && !session) {
        // Redirige al login si no hay sesión y está intentando acceder a una ruta protegida
        window.location.href = 'login.html';
        return null;
    }
    
    return session;
};

// --- DATA FETCHING (Fase 2) ---

// Obtener los cursos comprados por el usuario activo
window.fetchEnrolledCourses = async function() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return [];

    const { data: userCourses, error } = await window.supabaseClient
        .from('user_courses')
        .select(`
            course_id,
            courses (
                id,
                title,
                cover_image_url
            )
        `)
        .eq('user_id', session.user.id);
        
    if (error) {
        console.error("Error al obtener cursos del alumno:", error);
        return [];
    }
    
    // Mapear los resultados para unificar el objeto a un formato más fácil
    return userCourses.map(uc => uc.courses);
};

// Obtener el temario (módulos y videos) de un curso en particular
window.fetchCourseSyllabus = async function(courseId) {
    const { data: lessons, error } = await window.supabaseClient
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });
        
    if (error) {
        console.error("Error al obtener el temario:", error);
        return [];
    }
    return lessons;
};

// Generador de URls públicas de imágenes de Supabase (bucket Cursos)
window.getSupabaseImageUrl = function(imageName) {
    if (!imageName) return 'assets/images/placeholder.jpg';
    // Si la imagen ya es una URL completa o una ruta local a assets, devolverla como está
    if (imageName.startsWith('http') || imageName.startsWith('assets/')) return imageName;
    
    const bucketName = 'Cursos';
    const { data } = window.supabaseClient.storage.from(bucketName).getPublicUrl(imageName);
    return data.publicUrl;
};
