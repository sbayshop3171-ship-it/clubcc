const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const root = path.resolve(__dirname, '..');
const host = '127.0.0.1';
const adminSessionTtlMs = 4 * 60 * 1000;
const ciMasterAdminKey = 'ci-smoke-test-key';
const endpoints = [
    { path: '/api/health', type: 'json' },
    { path: '/api/captcha', type: 'json' },
    { path: '/login/', type: 'html' },
    { path: '/register/', type: 'html' },
    { path: '/dashboard/', type: 'html' },
    { path: '/admin/session-timeout.js', type: 'js' },
    { path: '/images/auth-background.jpeg', type: 'image' },
    { path: '/images/clubcc-logo.png', type: 'image' }
];

function getFreePort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', reject);
        server.listen(0, host, () => {
            const address = server.address();
            server.close(() => resolve(address.port));
        });
    });
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(port, child) {
    const url = `http://${host}:${port}/api/health`;

    for (let attempt = 0; attempt < 40; attempt += 1) {
        if (child.exitCode !== null) {
            throw new Error(`Server exited before becoming healthy with code ${child.exitCode}`);
        }

        try {
            const response = await fetch(url);
            if (response.ok) {
                return;
            }
        } catch (error) {
            // Server is still starting.
        }

        await delay(250);
    }

    throw new Error('Server did not become healthy in time');
}

async function assertEndpoint(baseUrl, endpoint) {
    const response = await fetch(`${baseUrl}${endpoint.path}`);

    if (!response.ok) {
        throw new Error(`${endpoint.path} returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (endpoint.type === 'json') {
        const data = await response.json();
        if (data.ok === false) {
            throw new Error(`${endpoint.path} returned ok=false`);
        }
        return;
    }

    if (endpoint.type === 'html' && !contentType.includes('text/html')) {
        throw new Error(`${endpoint.path} returned ${contentType}, expected HTML`);
    }

    if (endpoint.type === 'js' && !contentType.includes('javascript')) {
        throw new Error(`${endpoint.path} returned ${contentType}, expected JavaScript`);
    }

    if (endpoint.type === 'image' && !contentType.startsWith('image/')) {
        throw new Error(`${endpoint.path} returned ${contentType}, expected image`);
    }
}

async function assertAdminSession(baseUrl) {
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            username: 'admin',
            password: 'admin'
        })
    });
    const loginData = await loginResponse.json().catch(() => ({}));

    if (loginData.requiresTwoFactor) {
        console.log('SKIP admin session expiry check because 2FA is enabled.');
        return;
    }

    if (!loginResponse.ok || loginData.ok === false || !loginData.session?.token) {
        throw new Error('Admin login did not return a session token');
    }

    const issuedAt = Date.parse(loginData.session.issuedAt);
    const expiresAt = Date.parse(loginData.session.expiresAt);
    const ttl = expiresAt - issuedAt;

    if (!Number.isFinite(ttl) || Math.abs(ttl - adminSessionTtlMs) > 1000) {
        throw new Error(`Admin session TTL was ${ttl}ms, expected ${adminSessionTtlMs}ms`);
    }

    const sessionHeaders = {
        Accept: 'application/json',
        Authorization: `Bearer ${loginData.session.token}`
    };
    const sessionResponse = await fetch(`${baseUrl}/api/admin/session`, {
        headers: sessionHeaders
    });

    if (!sessionResponse.ok) {
        throw new Error('/api/admin/session rejected a fresh admin token');
    }

    const lockedSaveResponse = await fetch(`${baseUrl}/api/admin/deposit-settings`, {
        method: 'PUT',
        headers: {
            ...sessionHeaders,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            minimumAmount: 50,
            paymentWindowMinutes: 40,
            methods: []
        })
    });

    if (lockedSaveResponse.status !== 403) {
        throw new Error('/api/admin/deposit-settings accepted a save without Master Admin Key');
    }

    const invalidUnlockResponse = await fetch(`${baseUrl}/api/admin/payment/unlock`, {
        method: 'POST',
        headers: {
            ...sessionHeaders,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            masterAdminKey: 'wrong-key'
        })
    });

    if (invalidUnlockResponse.status !== 403) {
        throw new Error('/api/admin/payment/unlock accepted an incorrect Master Admin Key');
    }

    const validUnlockResponse = await fetch(`${baseUrl}/api/admin/payment/unlock`, {
        method: 'POST',
        headers: {
            ...sessionHeaders,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            masterAdminKey: ciMasterAdminKey
        })
    });

    if (!validUnlockResponse.ok) {
        throw new Error('/api/admin/payment/unlock rejected the configured Master Admin Key');
    }

    const saveResponse = await fetch(`${baseUrl}/api/admin/deposit-settings`, {
        method: 'PUT',
        headers: {
            ...sessionHeaders,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            minimumAmount: 50,
            paymentWindowMinutes: 40,
            methods: [{
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'BTC',
                address: 'bc1qexamplewalletaddress',
                qrImage: '',
                networkNote: 'Send BTC only to this Bitcoin address.',
                active: true
            }],
            masterAdminKey: ciMasterAdminKey
        })
    });

    if (!saveResponse.ok) {
        throw new Error('/api/admin/deposit-settings rejected a valid Master Admin Key');
    }

    const logoutResponse = await fetch(`${baseUrl}/api/admin/logout`, {
        method: 'POST',
        headers: sessionHeaders
    });

    if (!logoutResponse.ok) {
        throw new Error('/api/admin/logout failed');
    }

    const expiredResponse = await fetch(`${baseUrl}/api/admin/session`, {
        headers: sessionHeaders
    });

    if (expiredResponse.status !== 401) {
        throw new Error('/api/admin/session accepted a logged-out token');
    }

    console.log('OK admin session TTL, payment Master Key, and logout');
}

async function main() {
    const port = await getFreePort();
    const child = spawn(process.execPath, ['server.js'], {
        cwd: root,
        env: {
            ...process.env,
            HOST: host,
            PORT: String(port),
            MASTER_ADMIN_KEY: ciMasterAdminKey
        },
        stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
        output += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
        output += chunk.toString();
    });

    try {
        await waitForHealth(port, child);

        const baseUrl = `http://${host}:${port}`;
        for (const endpoint of endpoints) {
            await assertEndpoint(baseUrl, endpoint);
            console.log(`OK ${endpoint.path}`);
        }

        await assertAdminSession(baseUrl);
    } catch (error) {
        process.stderr.write(output);
        throw error;
    } finally {
        if (child.exitCode === null) {
            child.kill('SIGTERM');
        }
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
