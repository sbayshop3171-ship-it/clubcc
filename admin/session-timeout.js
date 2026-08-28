(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const CHALLENGE_KEY = 'dashlite.admin.2fa.challenge';
    const FLASH_KEY = 'dashlite.admin.flash';
    const TIMEOUT_MS = 4 * 60 * 1000;
    const TIMEOUT_MESSAGE = 'Session expired due to inactivity. Please log in again.';
    const ACTIVITY_EVENTS = ['mousemove', 'keypress', 'click', 'scroll'];

    let timeoutId = null;
    let watcherStarted = false;
    let redirecting = false;
    let lastActivityWrite = 0;

    function parseDate(value) {
        const time = Date.parse(value);
        return Number.isFinite(time) ? time : 0;
    }

    function readSession() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
        } catch (error) {
            clearSession();
            return null;
        }
    }

    function absoluteExpiry(session) {
        const expiresAt = parseDate(session?.expiresAt);

        if (expiresAt) {
            return expiresAt;
        }

        const issuedAt = parseDate(session?.issuedAt);
        return issuedAt ? issuedAt + TIMEOUT_MS : Date.now() + TIMEOUT_MS;
    }

    function idleExpiry(session) {
        const clientIdleExpiresAt = parseDate(session?.clientIdleExpiresAt);

        if (clientIdleExpiresAt) {
            return clientIdleExpiresAt;
        }

        const lastActivityAt = parseDate(session?.lastActivityAt || session?.issuedAt);
        return lastActivityAt ? lastActivityAt + TIMEOUT_MS : Date.now() + TIMEOUT_MS;
    }

    function nextExpiry(session) {
        return Math.min(absoluteExpiry(session), idleExpiry(session));
    }

    function isExpired(session) {
        return !session?.token || nextExpiry(session) <= Date.now();
    }

    function writeSession(session) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(SESSION_KEY);
    }

    function saveSession(session) {
        const now = Date.now();
        const expiresAt = absoluteExpiry(session);
        const nextIdleExpiry = Math.min(now + TIMEOUT_MS, expiresAt);

        writeSession({
            ...session,
            expiresAt: new Date(expiresAt).toISOString(),
            lastActivityAt: new Date(now).toISOString(),
            clientIdleExpiresAt: new Date(nextIdleExpiry).toISOString()
        });
    }

    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(CHALLENGE_KEY);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(CHALLENGE_KEY);
    }

    function setFlash(message) {
        if (message) {
            sessionStorage.setItem(FLASH_KEY, message);
        }
    }

    function consumeFlash() {
        const message = sessionStorage.getItem(FLASH_KEY) || '';
        sessionStorage.removeItem(FLASH_KEY);
        return message;
    }

    function redirectToLogin(message = '', options = {}) {
        if (redirecting) {
            return;
        }

        redirecting = true;
        clearTimeout(timeoutId);
        clearSession();

        if (message) {
            setFlash(message);
        }

        const suffix = options.expired ? '?reason=session-expired' : '';
        window.location.replace(`/admin/login${suffix}`);
    }

    function handleUnauthorized() {
        redirectToLogin(TIMEOUT_MESSAGE, { expired: true });
    }

    function getSession(options = {}) {
        const session = readSession();

        if (!session) {
            return null;
        }

        if (isExpired(session)) {
            if (options.redirect) {
                redirectToLogin(TIMEOUT_MESSAGE, { expired: true });
            } else {
                clearSession();
            }
            return null;
        }

        return session;
    }

    function scheduleTimeout() {
        clearTimeout(timeoutId);

        const session = readSession();

        if (!session) {
            redirectToLogin();
            return;
        }

        const expiresIn = Math.max(0, nextExpiry(session) - Date.now());

        timeoutId = window.setTimeout(() => {
            redirectToLogin(TIMEOUT_MESSAGE, { expired: true });
        }, expiresIn);
    }

    function recordActivity() {
        const now = Date.now();

        if (now - lastActivityWrite < 1000) {
            return;
        }

        lastActivityWrite = now;

        const session = getSession({ redirect: true });

        if (!session) {
            return;
        }

        const expiresAt = absoluteExpiry(session);

        writeSession({
            ...session,
            lastActivityAt: new Date(now).toISOString(),
            clientIdleExpiresAt: new Date(Math.min(now + TIMEOUT_MS, expiresAt)).toISOString()
        });
        scheduleTimeout();
    }

    function startAutoTimeout() {
        if (watcherStarted) {
            return;
        }

        watcherStarted = true;

        if (!getSession({ redirect: true })) {
            return;
        }

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, recordActivity, {
                capture: true,
                passive: true
            });
        });

        scheduleTimeout();
    }

    async function logout(apiPath = '/api/admin/logout') {
        const session = readSession();

        if (session?.token) {
            try {
                await fetch(apiPath, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${session.token}`
                    }
                });
            } catch (error) {
                // Local credentials still need to be cleared.
            }
        }

        redirectToLogin();
    }

    function showLoginToast() {
        const flashMessage = consumeFlash();
        const params = new URLSearchParams(window.location.search);
        const message = flashMessage || (params.get('reason') === 'session-expired' ? TIMEOUT_MESSAGE : '');

        if (!message) {
            return;
        }

        if (params.has('reason') && window.history?.replaceState) {
            window.history.replaceState({}, '', '/admin/login');
        }

        const toast = document.createElement('div');
        toast.className = 'admin-session-toast';
        toast.setAttribute('role', 'alert');
        toast.textContent = message;
        document.body.appendChild(toast);

        window.requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 5200);
    }

    window.AdminSessionTimeout = {
        SESSION_KEY,
        TIMEOUT_MS,
        TIMEOUT_MESSAGE,
        clearSession,
        getSession,
        handleUnauthorized,
        isExpired,
        logout,
        redirectToLogin,
        saveSession,
        showLoginToast,
        startAutoTimeout
    };
}());
