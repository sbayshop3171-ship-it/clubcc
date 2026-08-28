(function () {
    const SESSION_KEY = 'dashlite.auth.session';
    const API_BASE = '/api';
    const ROUTES = {
        login: '/login/',
        register: '/register/',
        dashboard: '/dashboard/'
    };

    const app = document.querySelector('[data-auth-app]');
    const card = document.getElementById('authCard');
    const worldCanvas = document.getElementById('worldCanvas');
    const ctx = worldCanvas.getContext('2d');

    const state = {
        view: getInitialView(),
        captchaToken: '',
        prefillUsername: '',
        submitting: false
    };

    function getInitialView() {
        const declared = app.dataset.authInitial;
        const path = window.location.pathname.toLowerCase();

        if (declared === 'register' || declared === 'login') {
            return declared;
        }

        if (path.includes('signup') || path.includes('register')) {
            return 'register';
        }

        return 'login';
    }

    function seededRandom(seed) {
        let value = seed;
        return () => {
            value = (value * 9301 + 49297) % 233280;
            return value / 233280;
        };
    }

    function drawWorld() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const width = window.innerWidth;
        const height = window.innerHeight;

        worldCanvas.width = Math.floor(width * ratio);
        worldCanvas.height = Math.floor(height * ratio);
        worldCanvas.style.width = `${width}px`;
        worldCanvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const random = seededRandom(42);
        const globeRadius = Math.max(330, Math.min(width * 0.28, height * 0.55, 560));
        const globeX = width / 2;
        const globeY = height * 0.58;

        const backdrop = ctx.createRadialGradient(globeX, globeY, globeRadius * 0.2, globeX, globeY, globeRadius * 1.8);
        backdrop.addColorStop(0, 'rgba(22, 116, 153, 0.42)');
        backdrop.addColorStop(0.48, 'rgba(10, 31, 54, 0.26)');
        backdrop.addColorStop(1, 'rgba(1, 3, 8, 0)');
        ctx.fillStyle = backdrop;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 95; i++) {
            ctx.beginPath();
            ctx.arc(random() * width, random() * height, 0.7 + random() * 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(174, 222, 247, ${0.16 + random() * 0.58})`;
            ctx.fill();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(globeX, globeY, globeRadius, 0, Math.PI * 2);
        ctx.clip();

        const ocean = ctx.createRadialGradient(
            globeX - globeRadius * 0.12,
            globeY - globeRadius * 0.18,
            globeRadius * 0.05,
            globeX,
            globeY,
            globeRadius
        );
        ocean.addColorStop(0, 'rgba(30, 152, 183, 0.96)');
        ocean.addColorStop(0.45, 'rgba(8, 75, 103, 0.98)');
        ocean.addColorStop(1, 'rgba(1, 15, 30, 1)');
        ctx.fillStyle = ocean;
        ctx.fillRect(globeX - globeRadius, globeY - globeRadius, globeRadius * 2, globeRadius * 2);

        const landGradient = ctx.createLinearGradient(globeX - globeRadius, globeY - globeRadius, globeX + globeRadius, globeY + globeRadius);
        landGradient.addColorStop(0, 'rgba(187, 53, 18, 0.93)');
        landGradient.addColorStop(0.45, 'rgba(233, 127, 21, 0.92)');
        landGradient.addColorStop(0.75, 'rgba(178, 55, 20, 0.86)');
        landGradient.addColorStop(1, 'rgba(83, 19, 12, 0.92)');
        ctx.fillStyle = landGradient;

        [
            [-0.54, -0.52, 0.48, 0.22, -0.15],
            [-0.46, -0.14, 0.32, 0.48, 0.1],
            [-0.25, -0.53, 0.46, 0.18, 0.18],
            [0.06, -0.44, 0.42, 0.22, -0.08],
            [0.36, -0.27, 0.42, 0.3, 0.08],
            [0.52, 0.06, 0.23, 0.36, 0.32],
            [-0.14, 0.3, 0.22, 0.46, -0.05],
            [-0.55, 0.34, 0.18, 0.25, 0.38]
        ].forEach((land) => {
            ctx.save();
            ctx.translate(globeX + land[0] * globeRadius, globeY + land[1] * globeRadius);
            ctx.rotate(land[4]);
            ctx.beginPath();
            ctx.ellipse(0, 0, land[2] * globeRadius, land[3] * globeRadius, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 34; i++) {
            const angle = random() * Math.PI * 2;
            const radius = globeRadius * Math.sqrt(random()) * 0.95;
            ctx.beginPath();
            ctx.arc(globeX + Math.cos(angle) * radius, globeY + Math.sin(angle) * radius, 1.2 + random() * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 194, 62, 0.78)';
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < 32; i++) {
            const y = globeY - globeRadius + (i / 31) * globeRadius * 2;
            const half = Math.sqrt(Math.max(globeRadius * globeRadius - Math.pow(y - globeY, 2), 0));
            ctx.beginPath();
            ctx.moveTo(globeX - half, y);
            ctx.quadraticCurveTo(globeX, y + (random() - 0.5) * 18, globeX + half, y);
            ctx.strokeStyle = 'rgba(115, 215, 250, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for (let i = 0; i < 22; i++) {
            const x = globeX - globeRadius + (i / 21) * globeRadius * 2;
            const half = Math.sqrt(Math.max(globeRadius * globeRadius - Math.pow(x - globeX, 2), 0));
            ctx.beginPath();
            ctx.moveTo(x, globeY - half);
            ctx.quadraticCurveTo(x + (random() - 0.5) * 24, globeY, x, globeY + half);
            ctx.strokeStyle = 'rgba(115, 215, 250, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        const points = [];
        for (let i = 0; i < 68; i++) {
            const angle = random() * Math.PI * 2;
            const radius = globeRadius * (0.16 + random() * 0.9);
            points.push({
                x: globeX + Math.cos(angle) * radius,
                y: globeY + Math.sin(angle) * radius,
                size: 10 + random() * 13
            });
        }

        for (let i = 0; i < 80; i++) {
            const a = points[Math.floor(random() * points.length)];
            const b = points[Math.floor(random() * points.length)];
            if (a === b || Math.hypot(a.x - b.x, a.y - b.y) > globeRadius * 0.65) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - random() * 72, b.x, b.y);
            ctx.strokeStyle = 'rgba(249, 183, 54, 0.3)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
        }

        ctx.restore();

        ctx.beginPath();
        ctx.arc(globeX, globeY, globeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(40, 217, 255, 0.76)';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = 'rgba(13, 191, 255, 0.8)';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        for (let i = 0; i < 26; i++) {
            ctx.beginPath();
            const tilt = (random() - 0.5) * 1.4;
            const orbitR = globeRadius * (0.55 + random() * 0.52);
            ctx.ellipse(globeX, globeY, orbitR, orbitR * (0.25 + random() * 0.25), tilt, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(80, 207, 244, 0.15)';
            ctx.lineWidth = 0.9;
            ctx.stroke();
        }

        points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(224, 204, 174, 0.92)';
            ctx.fill();
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = 'rgba(104, 73, 49, 0.82)';
            ctx.stroke();

            const laptopW = point.size * 0.9;
            const laptopH = point.size * 0.48;
            ctx.strokeStyle = 'rgba(91, 45, 34, 0.9)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(point.x - laptopW / 2, point.y - laptopH / 2, laptopW, laptopH);
            ctx.beginPath();
            ctx.moveTo(point.x - laptopW * 0.62, point.y + laptopH * 0.62);
            ctx.lineTo(point.x + laptopW * 0.62, point.y + laptopH * 0.62);
            ctx.stroke();
        });

        const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.2, width / 2, height / 2, Math.max(width, height) * 0.62);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.62, 'rgba(0, 0, 0, 0.08)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.86)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
    }

    async function requestCaptcha() {
        const response = await fetch(`${API_BASE}/captcha`, {
            headers: {
                Accept: 'application/json'
            }
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false || !data.captcha) {
            throw new Error(data.error || 'Unable to load captcha');
        }

        return data.captcha;
    }

    function applyCaptchaChallenge(captcha) {
        if (!captcha || !captcha.token || !captcha.image) {
            return false;
        }

        state.captchaToken = captcha.token;
        const captchaImage = document.getElementById('captchaImage');

        if (captchaImage) {
            captchaImage.src = captcha.image;
        }

        return true;
    }

    async function refreshCaptcha(options = {}) {
        const captchaButton = document.getElementById('captchaButton');
        const captchaInput = document.getElementById('authCaptcha');

        if (captchaButton) {
            captchaButton.disabled = true;
        }

        try {
            const captcha = await requestCaptcha();
            applyCaptchaChallenge(captcha);

            if (captchaInput && options.clearInput !== false) {
                captchaInput.value = '';
            }

            if (captchaInput && options.focus) {
                captchaInput.focus();
            }
        } catch (error) {
            setMessage(error.message || 'Unable to load captcha', 'error');
        } finally {
            if (captchaButton) {
                captchaButton.disabled = false;
            }
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    function saveSession(session) {
        clearSession();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    async function apiRequest(path, payload) {
        const response = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
            const error = new Error(data.error || 'Request failed');
            error.status = response.status;
            error.field = data.field || '';
            error.reason = data.reason || '';
            error.captcha = data.captcha || null;
            throw error;
        }

        return data;
    }

    const AuthApi = {
        async login(payload) {
            const data = await apiRequest('/login', payload);
            saveSession(data.session);
            return data;
        },

        async register(payload) {
            return apiRequest('/register', payload);
        }
    };

    function render() {
        const isRegister = state.view === 'register';
        card.className = `login-card auth-card${isRegister ? ' signup-card register-card' : ''}`;
        card.setAttribute('aria-label', isRegister ? 'Create account' : 'Login');
        document.title = isRegister ? 'Create Account | clubcc. Market' : 'Login | clubcc. Market';

        const header = isRegister
            ? '<div class="profile-icon" aria-hidden="true"></div><h1>Create an account</h1>'
            : '<h1>Welcome back</h1><a class="login-logo" href="/dashboard/" aria-label="CLUBCC home"><img src="/images/clubcc-logo.png" alt="CLUBCC"></a><div class="alert-banner" data-status role="alert">Secure access only</div>';
        const usernameValue = isRegister ? '' : escapeHtml(state.prefillUsername);

        card.innerHTML = `
            <div class="auth-panel" data-auth-panel>
                ${header}
                <form class="login-form" data-auth-form autocomplete="off" novalidate>
                    <label class="sr-only" for="authUsername">Username</label>
                    <input class="form-field is-active" id="authUsername" name="username" type="text" placeholder="Username" autocomplete="username" value="${usernameValue}">

                    <label class="sr-only" for="authPassword">Password</label>
                    <div class="field-with-icon">
                        <input class="form-field" id="authPassword" name="password" type="password" placeholder="Password" autocomplete="${isRegister ? 'new-password' : 'current-password'}">
                        <span class="lock-icon" aria-hidden="true"></span>
                    </div>

                    <div class="captcha-row">
                        <label class="sr-only" for="authCaptcha">Captcha</label>
                        <input class="form-field captcha-field" id="authCaptcha" name="captcha" type="text" placeholder="Captcha" maxlength="6" autocomplete="off">
                        <button class="captcha-image" id="captchaButton" type="button" aria-label="Refresh captcha">
                            <img id="captchaImage" src="" alt="" aria-hidden="true">
                        </button>
                    </div>

                    <p class="form-message" data-form-message role="alert" aria-live="polite"></p>

                    <button class="submit-button" data-submit-button type="submit" aria-label="Submit">
                        <span class="check-icon" aria-hidden="true"></span>
                    </button>
                </form>
                <a class="create-account" href="${isRegister ? ROUTES.login : ROUTES.register}" data-auth-toggle="${isRegister ? 'login' : 'register'}">
                    ${isRegister ? 'Already have an account?' : 'Create an account'}
                </a>
            </div>
        `;

        requestAnimationFrame(() => {
            card.querySelector('[data-auth-panel]').classList.add('is-ready');
        });

        bindAuthEvents();
        refreshCaptcha();
    }

    function bindAuthEvents() {
        const form = card.querySelector('[data-auth-form]');
        const toggle = card.querySelector('[data-auth-toggle]');
        const captchaButton = card.querySelector('#captchaButton');

        form.addEventListener('submit', handleSubmit);
        captchaButton.addEventListener('click', () => {
            clearFieldError('captcha');
            refreshCaptcha({
                focus: true
            });
        });

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            switchView(toggle.dataset.authToggle);
        });
    }

    function getFormValues() {
        return {
            username: card.querySelector('#authUsername').value.trim(),
            password: card.querySelector('#authPassword').value,
            captcha: card.querySelector('#authCaptcha').value.trim(),
            captchaToken: state.captchaToken
        };
    }

    function markField(name, hasError) {
        const input = card.querySelector(`[name="${name}"]`);
        if (!input) return;
        input.classList.toggle('has-error', hasError);
    }

    function clearFieldError(name) {
        markField(name, false);
        const message = card.querySelector('[data-form-message]');

        if (message) {
            message.textContent = '';
            message.classList.remove('is-visible');
        }
    }

    function setMessage(message, type) {
        const status = card.querySelector('[data-status]');
        const formMessage = card.querySelector('[data-form-message]');
        const target = status || formMessage;

        if (!target) return;

        target.textContent = message;
        target.classList.add(status ? 'is-shown' : 'is-visible');
        target.classList.toggle('is-success', type === 'success');
    }

    function showToast(message, type) {
        let toast = document.querySelector('[data-toast]');

        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'auth-toast';
            toast.dataset.toast = '';
            toast.innerHTML = '<span data-toast-message></span><button type="button" aria-label="Close notification">&times;</button>';
            document.body.appendChild(toast);
            toast.querySelector('button').addEventListener('click', () => {
                toast.classList.remove('is-visible');
            });
        }

        toast.querySelector('[data-toast-message]').textContent = message;
        toast.classList.toggle('is-success', type === 'success');
        toast.classList.toggle('is-error', type === 'error');
        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 3600);
    }

    function validate(values) {
        const errors = [];

        ['username', 'password', 'captcha'].forEach((name) => markField(name, false));

        if (!values.captchaToken) {
            errors.push('Captcha is loading. Please try again.');
            markField('captcha', true);
            return errors;
        }

        if (state.view === 'login') {
            return errors;
        }

        if (!values.username) {
            errors.push('Username is required');
            markField('username', true);
        } else if (values.username.length < 3 || values.username.length > 32) {
            errors.push('Username must be 3-32 characters');
            markField('username', true);
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(values.username)) {
            errors.push('Username can use letters, numbers, dot, dash, and underscore');
            markField('username', true);
        }

        if (!values.password) {
            errors.push('Password is required');
            markField('password', true);
        } else if (values.password.length < 6) {
            errors.push('Password must be at least 6 characters');
            markField('password', true);
        }

        if (!values.captcha) {
            errors.push('Captcha is required');
            markField('captcha', true);
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (state.submitting) return;

        const values = getFormValues();
        const errors = validate(values);

        if (errors.length) {
            setMessage(errors[0], 'error');
            return;
        }

        setSubmitting(true);
        setMessage(state.view === 'register' ? 'Creating account...' : 'Checking account...', 'success');

        let willRedirect = false;

        try {
            if (state.view === 'register') {
                await AuthApi.register(values);
                state.prefillUsername = values.username;
                setMessage('Account created. You can now log in.', 'success');
                showToast('Account created successfully. Please log in.', 'success');
                refreshCaptcha();
                card.querySelector('#authPassword').value = '';
                card.querySelector('#authCaptcha').value = '';
                window.setTimeout(() => {
                    switchView('login');
                }, 700);
            } else {
                await AuthApi.login(values);
                setMessage('Access verified. Opening dashboard...', 'success');
                app.classList.add('is-leaving');
                willRedirect = true;
                window.setTimeout(() => {
                    window.location.href = ROUTES.dashboard;
                }, 420);
            }
        } catch (error) {
            ['username', 'password', 'captcha'].forEach((name) => markField(name, false));

            if (error.field) {
                markField(error.field, true);
            }

            setMessage(error.message || 'Authentication failed', 'error');
            showToast(error.message || 'Authentication failed', 'error');
            if (!applyCaptchaChallenge(error.captcha)) {
                refreshCaptcha();
            }

            const captchaInput = card.querySelector('#authCaptcha');

            if (captchaInput) {
                captchaInput.value = '';

                if (error.field === 'captcha') {
                    captchaInput.focus();
                }
            }
        } finally {
            if (!willRedirect) {
                setSubmitting(false);
            }
        }
    }

    function setSubmitting(isSubmitting) {
        state.submitting = isSubmitting;
        const button = card.querySelector('[data-submit-button]');
        const fields = card.querySelectorAll('input, button, a');

        fields.forEach((field) => {
            if (field === button) return;
            field.toggleAttribute('aria-disabled', isSubmitting);
        });

        if (button) {
            button.disabled = isSubmitting;
            button.classList.toggle('is-loading', isSubmitting);
        }
    }

    function syncRoute(method) {
        if (!window.history || window.location.protocol === 'file:') return;

        const route = state.view === 'register' ? ROUTES.register : ROUTES.login;
        const current = window.location.pathname;

        if (current === route) return;

        window.history[method === 'replace' ? 'replaceState' : 'pushState']({ view: state.view }, '', route);
    }

    function switchView(nextView) {
        if (nextView !== 'login' && nextView !== 'register') return;
        if (state.view === nextView || state.submitting) return;

        app.classList.add('is-switching');

        window.setTimeout(() => {
            state.view = nextView;
            syncRoute('push');
            render();
            app.classList.remove('is-switching');
            card.querySelector('#authUsername').focus();
        }, 170);
    }

    window.addEventListener('popstate', () => {
        state.view = window.location.pathname.toLowerCase().includes('register') ? 'register' : 'login';
        render();
    });

    window.addEventListener('resize', drawWorld);

    drawWorld();
    render();
    syncRoute('replace');
}());
