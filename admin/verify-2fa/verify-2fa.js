(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const CHALLENGE_KEY = 'dashlite.admin.2fa.challenge';
    const form = document.getElementById('twoFactorForm');
    const codeInput = document.getElementById('twoFactorCode');
    const submitButton = document.getElementById('twoFactorButton');
    const statusEl = document.getElementById('twoFactorStatus');

    function setStatus(message, type = '') {
        statusEl.textContent = message;
        statusEl.classList.toggle('is-error', type === 'error');
        statusEl.classList.toggle('is-success', type === 'success');
    }

    async function verify(event) {
        event.preventDefault();
        const challenge = sessionStorage.getItem(CHALLENGE_KEY);
        const code = codeInput.value.trim();

        if (!challenge) {
            window.location.replace('/admin/login');
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            setStatus('Enter the 6-digit authenticator code.', 'error');
            return;
        }

        submitButton.disabled = true;
        setStatus('Verifying...');

        try {
            const response = await fetch('/api/admin/verify-2fa', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ challenge, code })
            });
            const data = await response.json();

            if (!response.ok || data.ok === false) {
                throw new Error(data.error || 'Invalid authenticator code. Please try again.');
            }

            sessionStorage.removeItem(CHALLENGE_KEY);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
            setStatus('Verified', 'success');
            window.location.replace('/admin');
        } catch (error) {
            setStatus(error.message || 'Invalid authenticator code. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
        }
    }

    if (sessionStorage.getItem(SESSION_KEY)) {
        window.location.replace('/admin');
        return;
    }

    form.addEventListener('submit', verify);
}());
