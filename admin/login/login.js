(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const TWO_FACTOR_CHALLENGE_KEY = 'dashlite.admin.2fa.challenge';
    const form = document.getElementById('adminLoginForm');
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    const submitButton = document.getElementById('adminLoginButton');
    const statusEl = document.getElementById('adminLoginStatus');

    function setStatus(message, type = '') {
        if (!statusEl) {
            return;
        }

        statusEl.textContent = message;
        statusEl.classList.toggle('is-error', type === 'error');
        statusEl.classList.toggle('is-success', type === 'success');
    }

    function saveSession(session) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    async function submitLogin(event) {
        event.preventDefault();

        const username = String(usernameInput?.value || '').trim();
        const password = String(passwordInput?.value || '');

        if (!username || !password) {
            setStatus('Enter your admin credentials.', 'error');
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        setStatus('Signing in...');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (!response.ok || data.ok === false) {
                throw new Error(data.error || 'Unable to sign in');
            }

            if (data.requiresTwoFactor) {
                sessionStorage.setItem(TWO_FACTOR_CHALLENGE_KEY, data.challenge);
                window.location.replace('/admin/verify-2fa');
                return;
            }

            saveSession(data.session);
            setStatus('Signed in', 'success');
            window.location.replace('/admin');
        } catch (error) {
            setStatus(error.message || 'Login failed', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    }

    const existingSession = sessionStorage.getItem(SESSION_KEY);

    if (existingSession) {
        window.location.replace('/admin');
        return;
    }

    form?.addEventListener('submit', submitLogin);
    usernameInput?.focus();
}());
