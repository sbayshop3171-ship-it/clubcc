const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const root = path.resolve(__dirname, '..');
const host = '127.0.0.1';
const endpoints = [
    { path: '/api/health', type: 'json' },
    { path: '/api/captcha', type: 'json' },
    { path: '/login/', type: 'html' },
    { path: '/register/', type: 'html' },
    { path: '/dashboard/', type: 'html' },
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

    if (endpoint.type === 'image' && !contentType.startsWith('image/')) {
        throw new Error(`${endpoint.path} returned ${contentType}, expected image`);
    }
}

async function main() {
    const port = await getFreePort();
    const child = spawn(process.execPath, ['server.js'], {
        cwd: root,
        env: {
            ...process.env,
            HOST: host,
            PORT: String(port),
            MASTER_ADMIN_KEY: process.env.MASTER_ADMIN_KEY || 'ci-smoke-test-key'
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
