const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');
const bcrypt = require('bcryptjs');

function loadEnvironmentFile() {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
        return;
    }

    fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);

        if (!match || process.env[match[1]]) {
            return;
        }

        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    });
}

loadEnvironmentFile();

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'users.json');
const TICKER_SETTINGS_PATH = path.join(DATA_DIR, 'ticker-settings.json');
const ANNOUNCEMENT_ALERT_PATH = path.join(DATA_DIR, 'announcement-alert.json');
const CHECKER_SETTINGS_PATH = path.join(DATA_DIR, 'checker-settings.json');
const SUB_SETTINGS_PATH = path.join(DATA_DIR, 'sub-settings.json');
const CARDS_PATH = path.join(DATA_DIR, 'cards.json');
const DEPOSIT_SETTINGS_PATH = path.join(DATA_DIR, 'deposit-settings.json');
const DEPOSITS_PATH = path.join(DATA_DIR, 'deposits.json');
const VIRTUAL_CARDS_PATH = path.join(DATA_DIR, 'virtual-cards.json');
const PURCHASES_PATH = path.join(DATA_DIR, 'purchases.json');
const CARTS_PATH = path.join(DATA_DIR, 'carts.json');
const SSNS_PATH = path.join(DATA_DIR, 'ssns.json');
const SUPPORT_TICKETS_PATH = path.join(DATA_DIR, 'support-tickets.json');
const STORAGE_DIR = path.join(ROOT, 'storage');
const LOG_DIR = path.join(STORAGE_DIR, 'logs');
const AUTH_AUDIT_LOG_PATH = path.join(LOG_DIR, 'auth-audit.log');
const DEFAULT_CHECKER_SETTINGS = { price: 0.30 };
const DEFAULT_SUB_SETTINGS = { price: 150 };
const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_MAX_CHALLENGES = 1000;
const CAPTCHA_SECRET = crypto.randomBytes(32);
const ADMIN_SESSION_TTL_MS = 4 * 60 * 1000;
const ADMIN_USERNAME = 'admin';
const ADMIN_ISSUER = 'clubcc. Market';
const MASTER_ADMIN_KEY = process.env.MASTER_ADMIN_KEY || '';
const adminTwoFactorChallenges = new Map();
const REDIRECT_ROUTES = new Map([
    ['/', '/login'],
    ['/index.html', '/login'],
    ['/admin/', '/admin'],
    ['/admin/dashboard/', '/admin/dashboard'],
    ['/admin/users/', '/admin/users'],
    ['/admin/cards/', '/admin/cards'],
    ['/admin/profile/', '/admin/profile'],
    ['/admin/settings/', '/admin/settings'],
    ['/admin/payment/', '/admin/payment'],
    ['/support/tickets/create', '/dashboard/#tickets/create'],
    ['/support/tickets/create/', '/dashboard/#tickets/create'],
    ['/admin/login/', '/admin/login'],
    ['/admin/verify-2fa/', '/admin/verify-2fa'],
    ['/admin/index.html', '/admin'],
    ['/admin/login.html', '/admin/login'],
    ['/cart', '/dashboard/#cart'],
    ['/cart/', '/dashboard/#cart'],
    ['/purchases/cvv', '/dashboard/#purchases'],
    ['/purchases/cvv/', '/dashboard/#purchases']
]);
const PUBLIC_ROUTES = new Map([
    ['/login', '/login/index.html'],
    ['/login/', '/login/index.html'],
    ['/register', '/register/index.html'],
    ['/register/', '/register/index.html'],
    ['/auth/register', '/register/index.html'],
    ['/auth/register/', '/register/index.html'],
    ['/admin', '/index.html'],
    ['/admin/', '/index.html'],
    ['/admin/dashboard', '/index.html'],
    ['/admin/dashboard/', '/index.html'],
    ['/admin/users', '/index.html'],
    ['/admin/users/', '/index.html'],
    ['/admin/cards', '/index.html'],
    ['/admin/cards/', '/index.html'],
    ['/admin/checker', '/index.html'],
    ['/admin/checker/', '/index.html'],
    ['/admin/tickets', '/index.html'],
    ['/admin/tickets/', '/index.html'],
    ['/admin/profile', '/index.html'],
    ['/admin/profile/', '/index.html'],
    ['/admin/settings', '/index.html'],
    ['/admin/settings/', '/index.html'],
    ['/admin/payment', '/index.html'],
    ['/admin/payment/', '/index.html'],
    ['/admin/login', '/admin/login/index.html'],
    ['/admin/login/', '/admin/login/index.html'],
    ['/admin/verify-2fa', '/admin/verify-2fa/index.html'],
    ['/admin/verify-2fa/', '/admin/verify-2fa/index.html'],
    ['/admin/login.html', '/admin/login'],
    ['/dashboard', '/dashboard/index.html'],
    ['/dashboard/', '/dashboard/index.html'],
    ['/settings', '/dashboard/index.html'],
    ['/settings/', '/dashboard/index.html'],
    ['/profile', '/dashboard/index.html'],
    ['/profile/', '/dashboard/index.html']
]);
const DEFAULT_TICKER_SETTINGS = {
    telegramUrl: 'https://t.me/clubcc_support',
    virtualCardNote: 'আপনার কার্ডের বিস্তারিত এই অ্যাকাউন্টের জন্য নিরাপদে তৈরি করা হয়েছে।',
    onlineBase: 78,
    autoFluctuate: false,
    fluctuationRange: 0,
    slideIntervalMs: 5000,
    usernames: [
        'titan_luna',
        'falcon',
        'nova_stack',
        'atlasblue',
        'mira_node',
        'luna177'
    ],
    activityTemplates: [
        {
            message: 'just deposited',
            targetPool: 'amounts',
            status: 'Completed'
        },
        {
            message: 'just received a bonus',
            targetPool: 'amounts',
            status: 'Completed'
        },
        {
            message: 'completed purchase',
            targetPool: 'orders',
            status: 'Completed'
        },
        {
            message: 'opened support ticket',
            targetPool: 'tickets',
            status: 'Active'
        },
        {
            message: 'updated billing wallet',
            targetPool: 'amounts',
            status: 'Verified'
        },
        {
            message: 'reviewed security notice',
            targetPool: 'labels',
            status: 'Read'
        },
        {
            message: 'created saved filter',
            targetPool: 'labels',
            status: 'Saved'
        }
    ],
    amounts: [
        '$311.14',
        '$97.71',
        '$122.50',
        '$2.00'
    ],
    orders: [
        'Order #DL-2048',
        'Order #DL-2186',
        'Order #DL-2219'
    ],
    tickets: [
        'Ticket #4182',
        'Ticket #4204',
        'Ticket #4315'
    ],
    labels: [
        'Policy Center',
        'News feed',
        'Dashboard access',
        'Saved filter'
    ],
    dashboardContent: {
        attentionTitle: 'Attention',
        attentionBody: 'Please bookmark the verified links below to keep access to your dashboard.',
        attentionLinks: [
            {
                label: 'WEB',
                text: 'https://example.com',
                href: 'https://example.com',
                tone: 'blue'
            },
            {
                label: 'STATUS',
                text: 'https://status.example.com',
                href: 'https://status.example.com',
                tone: 'blue'
            },
            {
                label: 'SUPPORT',
                text: 'Open a secure ticket',
                href: '/dashboard/#support',
                tone: 'red'
            }
        ],
        noticeTitle: 'Important Notice',
        noticeParagraphs: [
            'Our service never asks for passwords, captcha codes, or payment details outside this website. ONLY use the in-app support ticket system for account help.',
            'Keep two-factor recovery information private and report suspicious messages immediately.'
        ],
        virtualCardNote: 'Your card details are generated securely for this account.'
    }
};
const DEFAULT_ANNOUNCEMENT_ALERT = {
    is_enabled: false,
    title: 'Announcement',
    message: '',
    action_text: '',
    action_link: '#',
    secondary_text: 'Close'
};

const sessions = new Map();
const adminSessions = new Map();
const captchaChallenges = new Map();
const CARD_TYPES = new Set(['AMEX', 'DISCOVER', 'JCB', 'MAESTRO', 'MASTERCARD', 'UNIONPAY', 'VISA']);
const CARD_LEVELS = new Set(['BLACK', 'CENTURION', 'CLASSIC', 'GOLD', 'INFINITE', 'PLATINUM', 'PREMIER', 'SIGNATURE', 'STANDARD', 'WORLD', 'WORLD ELITE']);
const CARD_CLASSES = new Set(['CREDIT', 'DEBIT', 'PREPAID']);
const YES_NO = new Set(['Yes', 'No']);
const DEFAULT_DEPOSIT_SETTINGS = {
    methods: [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            address: 'bc1qexamplewalletaddress',
            qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=bc1qexamplewalletaddress',
            networkNote: 'Send BTC only to this Bitcoin address.'
        },
        {
            id: 'litecoin',
            name: 'Litecoin',
            symbol: 'LTC',
            address: 'ltc1examplewalletaddress',
            qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=ltc1examplewalletaddress',
            networkNote: 'Send LTC only to this Litecoin address.'
        },
        {
            id: 'usdt-trc20',
            name: 'USDT (TRC20)',
            symbol: 'USDT',
            address: 'TExampleTronWalletAddress',
            qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=TExampleTronWalletAddress',
            networkNote: 'Use the TRC20 network only.'
        }
    ],
    minimumAmount: 50,
    paymentWindowMinutes: 40,
    bonusTiers: [
        { threshold: 200, percent: 5 },
        { threshold: 500, percent: 10 },
        { threshold: 1500, percent: 15 }
    ]
};

function ensureDatabase() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
        writeDatabase({
            users: [],
            nextId: 1,
            adminAccount: {
                username: ADMIN_USERNAME,
                is_2fa_enabled: false,
                twoFactorSecret: null
            }
        });
    }
}

function readDatabase() {
    ensureDatabase();

    try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        const data = JSON.parse(raw);

        return {
            users: Array.isArray(data.users) ? data.users : [],
            nextId: Number(data.nextId) || 1,
            adminAccount: {
                username: ADMIN_USERNAME,
                is_2fa_enabled: Boolean(data.adminAccount?.is_2fa_enabled),
                twoFactorSecret: typeof data.adminAccount?.twoFactorSecret === 'string'
                    ? data.adminAccount.twoFactorSecret
                    : null
            }
        };
    } catch (error) {
        return {
            users: [],
            nextId: 1,
            adminAccount: {
                username: ADMIN_USERNAME,
                is_2fa_enabled: false,
                twoFactorSecret: null
            }
        };
    }
}

function writeDatabase(data) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tmpPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmpPath, DB_PATH);
}

function readJsonStore(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return fallback;
    }
}

function writeJsonStore(filePath, data) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmpPath, filePath);
}

function readSupportTickets() {
    const store = readJsonStore(SUPPORT_TICKETS_PATH, { tickets: [], nextId: 1 });

    return {
        tickets: Array.isArray(store.tickets) ? store.tickets : [],
        nextId: Number(store.nextId) || 1
    };
}

function writeSupportTickets(store) {
    writeJsonStore(SUPPORT_TICKETS_PATH, store);
}

function publicTicket(ticket) {
    return {
        id: ticket.id,
        ticketId: ticket.ticketId,
        userId: ticket.userId,
        username: ticket.username,
        reasonContact: ticket.reasonContact,
        subject: ticket.subject,
        description: ticket.description,
        paymentAddress: ticket.paymentAddress,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        messages: Array.isArray(ticket.messages) ? ticket.messages : []
    };
}

function sanitizeDepositSettings(settings = {}) {
    const methods = Array.isArray(settings.methods) ? settings.methods : DEFAULT_DEPOSIT_SETTINGS.methods;
    const safeMethods = methods.map((method, index) => {
        const name = sanitizeText(method.name, `Crypto ${index + 1}`, 40);
        const id = sanitizeText(method.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), `crypto-${index + 1}`, 40);

        return {
            id,
            name,
            symbol: sanitizeText(method.symbol, name.toUpperCase(), 12),
            network: sanitizeText(method.network, '', 24),
            address: sanitizeText(method.address, '', 180),
            qrImage: sanitizeText(method.qrImage, '', 500000),
            networkNote: sanitizeText(method.networkNote, 'Confirm the correct network before sending.', 180),
            active: method.active !== false
        };
    }).filter((method) => method.address);

    return {
        methods: safeMethods.length ? safeMethods : DEFAULT_DEPOSIT_SETTINGS.methods,
        minimumAmount: sanitizePrice(settings.minimumAmount || DEFAULT_DEPOSIT_SETTINGS.minimumAmount),
        paymentWindowMinutes: Math.min(180, Math.max(5, Number(settings.paymentWindowMinutes) || DEFAULT_DEPOSIT_SETTINGS.paymentWindowMinutes)),
        bonusTiers: DEFAULT_DEPOSIT_SETTINGS.bonusTiers
    };
}

function userBalance(user) {
    if (!user) {
        return 0;
    }

    if (user.balance !== undefined) {
        return sanitizePrice(user.balance);
    }

    return sanitizePrice(user.main_balance);
}

function readDepositSettings() {
    const settings = sanitizeDepositSettings(readJsonStore(DEPOSIT_SETTINGS_PATH, DEFAULT_DEPOSIT_SETTINGS));

    if (!fs.existsSync(DEPOSIT_SETTINGS_PATH)) {
        writeJsonStore(DEPOSIT_SETTINGS_PATH, settings);
    }

    return settings;
}

function writeDepositSettings(settings) {
    const sanitizedSettings = sanitizeDepositSettings(settings);
    writeJsonStore(DEPOSIT_SETTINGS_PATH, sanitizedSettings);
    return sanitizedSettings;
}

function readDeposits() {
    const data = readJsonStore(DEPOSITS_PATH, { deposits: [], nextId: 1 });

    return {
        deposits: Array.isArray(data.deposits) ? data.deposits : [],
        nextId: Number(data.nextId) || 1
    };
}

function writeDeposits(data) {
    writeJsonStore(DEPOSITS_PATH, data);
}

function readVirtualCards() {
    const data = readJsonStore(VIRTUAL_CARDS_PATH, { cards: [], nextId: 1 });

    return {
        cards: Array.isArray(data.cards) ? data.cards : [],
        nextId: Number(data.nextId) || 1
    };
}

function writeVirtualCards(data) {
    writeJsonStore(VIRTUAL_CARDS_PATH, data);
}

function readPurchases() {
    const data = readJsonStore(PURCHASES_PATH, { purchases: [], nextId: 1 });

    return {
        purchases: Array.isArray(data.purchases) ? data.purchases : [],
        nextId: Number(data.nextId) || 1
    };
}

function writePurchases(data) {
    writeJsonStore(PURCHASES_PATH, data);
}

function readCarts() {
    const data = readJsonStore(CARTS_PATH, { carts: {}, nextId: 1 });

    return {
        carts: data.carts && typeof data.carts === 'object' ? data.carts : {},
        nextId: Number(data.nextId) || 1
    };
}

function writeCarts(data) {
    writeJsonStore(CARTS_PATH, data);
}

function cartForUser(store, userId) {
    const key = String(userId);
    const ids = Array.isArray(store.carts[key]) ? store.carts[key] : [];
    store.carts[key] = [...new Set(ids.map((id) => Number(id)).filter((id) => Number.isInteger(id)))];
    return store.carts[key];
}

function validCardNumber(number) {
    let total = 0;
    let doubleDigit = false;

    for (let index = number.length - 1; index >= 0; index -= 1) {
        let digit = Number(number[index]);

        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        total += digit;
        doubleDigit = !doubleDigit;
    }

    return total % 10 === 0;
}

function generateVirtualCardNumber(type) {
    const prefix = type === 'MASTERCARD' ? '52' : '4';
    let number;

    do {
        number = prefix;
        while (number.length < 15) number += crypto.randomInt(10);
        let checksum = 0;
        let doubleDigit = true;

        for (let index = number.length - 1; index >= 0; index -= 1) {
            let digit = Number(number[index]);
            if (doubleDigit) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            checksum += digit;
            doubleDigit = !doubleDigit;
        }
        number += String((10 - (checksum % 10)) % 10);
    } while (!validCardNumber(number));

    return number;
}

function publicVirtualCard(card) {
    const number = String(card.number || '');
    const cvv = String(card.cvv || '');
    const isApproved = card.status === 'Active';

    return {
        id: card.id,
        type: card.type,
        masked_number: isApproved && number ? `**** **** **** ${number.slice(-4)}` : '**** **** **** ****',
        expiry: isApproved && card.expiry ? '**/**' : 'MM/YY',
        masked_cvv: isApproved && cvv ? `${cvv.charAt(0)}**` : '***',
        name: card.name,
        amount: card.amount,
        status: card.status,
        createdAt: card.createdAt
    };
}

function privateVirtualCard(card) {
    return {
        id: card.id,
        type: card.type,
        number: card.number,
        expiry: card.expiry,
        cvv: card.cvv,
        name: card.name,
        amount: card.amount,
        status: card.status,
        createdAt: card.createdAt
    };
}

function adminVirtualCard(card, users) {
    const owner = users.find((user) => user.id === card.userId);

    return {
        ...privateVirtualCard(card),
        userId: card.userId,
        username: owner?.username || `User #${card.userId}`,
        email: owner?.email || owner?.username || `User #${card.userId}`
    };
}

function validateVirtualCardCredentials(number, expiry, cvv) {
    return /^\d{16}$/.test(number)
        && validCardNumber(number)
        && /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)
        && /^\d{3}$/.test(cvv);
}

async function handleAdminVirtualCards(req, res, url) {
    if (!requireAdminSession(req, res)) {
        return;
    }

    const store = readVirtualCards();
    const users = readDatabase().users;
    const cardMatch = url.pathname.match(/^\/api\/admin\/(?:virtual-cards|cards)\/(\d+)(\/approve)?$/);

    if (req.method === 'GET' && url.pathname === '/api/admin/virtual-cards') {
        jsonResponse(res, 200, {
            ok: true,
            cards: store.cards.map((card) => adminVirtualCard(card, users))
        });
        return;
    }

    if (!cardMatch) {
        sendError(res, 404, 'Virtual card route not found');
        return;
    }

    const card = store.cards.find((candidate) => candidate.id === Number(cardMatch[1]));
    if (!card) {
        sendError(res, 404, 'Virtual card not found');
        return;
    }

    if (req.method === 'DELETE') {
        store.cards = store.cards.filter((candidate) => candidate.id !== card.id);
        writeVirtualCards(store);
        jsonResponse(res, 200, { ok: true, cards: store.cards.map((item) => adminVirtualCard(item, users)) });
        return;
    }

    if (req.method === 'POST' && url.pathname.endsWith('/approve')) {
        const body = await parseBody(req);
        const number = sanitizeText(body.number, '', 16);
        const expiry = sanitizeText(body.expiry, '', 5);
        const cvv = sanitizeText(body.cvv, '', 3);

        if (card.status !== 'Pending') {
            sendError(res, 409, 'Only pending virtual cards can be approved');
            return;
        }

        if (!validateVirtualCardCredentials(number, expiry, cvv)) {
            sendError(res, 400, 'Enter a valid 16-digit card number, MM/YY expiry, and 3-digit CVV');
            return;
        }

        Object.assign(card, { number, expiry, cvv, status: 'Active', updatedAt: new Date().toISOString() });
        writeVirtualCards(store);
        jsonResponse(res, 200, { ok: true, card: adminVirtualCard(card, users) });
        return;
    }

    if (req.method !== 'PUT') {
        sendError(res, 405, 'Method not allowed');
        return;
    }

    const body = await parseBody(req);
    const name = sanitizeText(body.name, card.name, 60);
    const number = sanitizeText(body.number, card.number, 32);
    const expiry = sanitizeText(body.expiry, card.expiry, 12);
    const cvv = sanitizeText(body.cvv, card.cvv, 8);
    const status = sanitizeChoice(body.status, new Set(['ACTIVE', 'INACTIVE', 'BLOCKED']), card.status)
        .replace(/^ACTIVE$/, 'Active')
        .replace(/^INACTIVE$/, 'Inactive')
        .replace(/^BLOCKED$/, 'Blocked');

    if (!name || !number || !expiry || !cvv) {
        sendError(res, 400, 'Card name, number, expiry, and CVV are required');
        return;
    }

    if (status === 'Active' && !validateVirtualCardCredentials(number, expiry, cvv)) {
        sendError(res, 400, 'Active cards require a valid 16-digit card number, MM/YY expiry, and 3-digit CVV');
        return;
    }

    Object.assign(card, { name, number, expiry, cvv, status, updatedAt: new Date().toISOString() });
    writeVirtualCards(store);
    jsonResponse(res, 200, { ok: true, card: adminVirtualCard(card, users) });
}

function ensureCardRecords() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(CARDS_PATH)) {
        writeCardStore({
            cards: [],
            nextId: 1
        });
    }
}

function readCardStore() {
    ensureCardRecords();

    try {
        const raw = fs.readFileSync(CARDS_PATH, 'utf8');
        const data = JSON.parse(raw);

        return {
            cards: Array.isArray(data.cards) ? data.cards : [],
            nextId: Number(data.nextId) || 1
        };
    } catch (error) {
        return {
            cards: [],
            nextId: 1
        };
    }
}

function writeCardStore(data) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tmpPath = `${CARDS_PATH}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmpPath, CARDS_PATH);
}

function clampNumber(value, fallback, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.min(max, Math.max(min, Math.round(number)));
}

function sanitizeText(value, fallback = '', maxLength = 80) {
    const text = String(value || '').replace(/[\r\n\t]+/g, ' ').trim();

    return text ? text.slice(0, maxLength) : fallback;
}

function sanitizeChoice(value, allowed, fallback) {
    const text = sanitizeText(value, fallback, 32).toUpperCase();

    return allowed.has(text) ? text : fallback;
}

function sanitizeYesNo(value, fallback = 'No') {
    const text = sanitizeText(value, fallback, 8);

    return YES_NO.has(text) ? text : fallback;
}

function sanitizeCountryCode(value) {
    const code = sanitizeText(value, '', 2).toUpperCase();

    return /^[A-Z]{2}$/.test(code) ? code : '';
}

function sanitizeMaskedBin(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 6);
    const binDigits = digits.padEnd(6, '0');

    return {
        bin: `${binDigits}******`,
        binDigits
    };
}

function sanitizePrice(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(9999.99, Math.max(0, Math.round(number * 100) / 100));
}

function sanitizeDatabaseTag(value, binDigits) {
    const database = sanitizeText(value, '', 80);
    const normalized = database
        .replace(/^SANDBOX_/i, 'CARD_DB_')
        .replace(/^DB_/i, 'CARD_DB_');

    return normalized || `CARD_DB_${binDigits}_******`;
}

function sanitizeVendor(value) {
    const vendor = sanitizeText(value, 'Secure Checkout', 80);

    return vendor.replace(/^Demo Vendor(?:\s+\d+)?/i, 'Merchant Network');
}

function sanitizeCardRecord(record = {}, fallbackId = 0) {
    const bin = sanitizeMaskedBin(record.bin || record.binDigits);

    return {
        id: Number(record.id) || fallbackId,
        type: sanitizeChoice(record.type, CARD_TYPES, 'VISA'),
        ...bin,
        bank: sanitizeText(record.bank, 'Bank', 80),
        cardClass: sanitizeChoice(record.cardClass || record.class, CARD_CLASSES, 'CREDIT'),
        level: sanitizeChoice(record.level, CARD_LEVELS, 'CLASSIC'),
        expiry: sanitizeText(record.expiry, '**/30', 12),
        country: sanitizeText(record.country, 'United States of America', 90),
        countryCode: sanitizeCountryCode(record.countryCode),
        state: sanitizeText(record.state, 'All', 60),
        city: sanitizeText(record.city, 'All', 60),
        zip: sanitizeText(record.zip, '****', 16),
        database: sanitizeDatabaseTag(record.database, bin.binDigits),
        ssn: sanitizeYesNo(record.ssn),
        dob: sanitizeYesNo(record.dob),
        vendor: sanitizeVendor(record.vendor),
        price: sanitizePrice(record.price),
        createdAt: sanitizeText(record.createdAt, new Date().toISOString(), 32),
        updatedAt: new Date().toISOString()
    };
}

function readCardRecords() {
    const store = readCardStore();

    return store.cards
        .map((card, index) => sanitizeCardRecord(card, index + 1))
        .sort((a, b) => b.id - a.id);
}

const SSN_NAMES = [
    ['Patricia', 'Green'], ['Olivia', 'Flores'], ['Margaret', 'Lee'], ['Harper', 'Nguyen'],
    ['Audrey', 'Martinez'], ['Leah', 'Richardson'], ['Susan', 'Peterson'], ['Layla', 'Reed'],
    ['Mia', 'Brooks'], ['Nora', 'Bennett'], ['Evelyn', 'Cooper'], ['Chloe', 'Morgan']
];
const SSN_LOCATIONS = [
    { city: 'Phoenix', state: 'AZ', zip: '85001' }, { city: 'Madison', state: 'WI', zip: '53703' },
    { city: 'Lexington', state: 'KY', zip: '40507' }, { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Hartford', state: 'CT', zip: '06103' }, { city: 'Baltimore', state: 'MD', zip: '21201' },
    { city: 'Boise', state: 'ID', zip: '83702' }, { city: 'Indianapolis', state: 'IN', zip: '46204' }
];

function readSsnStore() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    try {
        const data = JSON.parse(fs.readFileSync(SSNS_PATH, 'utf8'));

        return {
            records: Array.isArray(data.records) ? data.records : [],
            nextId: Number(data.nextId) || 1
        };
    } catch (error) {
        return { records: [], nextId: 1 };
    }
}

function writeSsnStore(data) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tmpPath = `${SSNS_PATH}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmpPath, SSNS_PATH);
}

function sanitizeSsnRecord(record = {}, fallbackId = 0) {
    const location = SSN_LOCATIONS.find((item) => item.state === record.state) || SSN_LOCATIONS[0];

    return {
        id: Number(record.id) || fallbackId,
        firstName: sanitizeText(record.firstName, 'Alex', 40),
        lastName: sanitizeText(record.lastName, 'Morgan', 40),
        ssnNumber: String(record.ssnNumber || `${crypto.randomInt(100, 1000)}-${crypto.randomInt(10, 100)}-${crypto.randomInt(1000, 10000)}`).replace(/\D/g, '').slice(0, 9).padStart(9, '0'),
        dob: sanitizeText(record.dob, '01/01/1980', 10),
        city: sanitizeText(record.city, location.city, 60),
        state: sanitizeText(record.state, location.state, 2).toUpperCase(),
        zip: sanitizeText(record.zip, location.zip, 10),
        price: Math.min(100, Math.max(1, Math.round(Number(record.price) || 1))),
        active: record.active !== false,
        createdAt: sanitizeText(record.createdAt, new Date().toISOString(), 32)
    };
}

function readSsnRecords() {
    const store = readSsnStore();

    return store.records
        .map((record, index) => sanitizeSsnRecord(record, index + 1))
        .sort((left, right) => right.id - left.id);
}

function generateSsnRecord() {
    const name = randomFrom(SSN_NAMES);
    const location = randomFrom(SSN_LOCATIONS);
    const year = crypto.randomInt(1948, 2005);
    const month = String(crypto.randomInt(1, 13)).padStart(2, '0');
    const day = String(crypto.randomInt(1, 28)).padStart(2, '0');

    return sanitizeSsnRecord({
        firstName: name[0],
        lastName: name[1],
        dob: `${month}/${day}/${year}`,
        ...location,
        price: crypto.randomInt(1, 101),
        active: true
    });
}

function addBulkSsnRecords(quantity) {
    const store = readSsnStore();
    const now = new Date().toISOString();
    const records = Array.from({ length: quantity }, () => sanitizeSsnRecord({
        ...generateSsnRecord(),
        id: store.nextId++,
        createdAt: now
    }));

    store.records.push(...records);
    writeSsnStore(store);
    return records;
}

function querySsnRecords(url) {
    const firstName = queryText(url.searchParams.get('firstName'));
    const lastName = queryText(url.searchParams.get('lastName'));
    const type = String(url.searchParams.get('type') || '').toLowerCase();
    const value = queryText(url.searchParams.get('value'));
    const records = readSsnRecords().filter((record) => record.active);
    const filtered = records.filter((record) => {
        const typeValue = type === 'city' ? record.city : type === 'state' ? record.state : type === 'zip' ? record.zip : type === 'dob' ? record.dob : '';

        return (!firstName || queryText(record.firstName).includes(firstName))
            && (!lastName || queryText(record.lastName).includes(lastName))
            && (!value || queryText(typeValue).includes(value));
    });
    const isRandom = !firstName && !lastName && !value;
    const result = isRandom ? randomizeCards(records.slice()) : filtered;
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const perPage = 20;
    const pageCount = Math.max(1, Math.ceil(result.length / perPage));
    const safePage = Math.min(page, pageCount);
    const publicRecords = result
        .slice((safePage - 1) * perPage, safePage * perPage)
        .map(({ ssnNumber, ...record }) => record);

    return {
        records: publicRecords,
        total: result.length,
        page: safePage,
        perPage,
        pageCount,
        isRandom
    };
}

const CARD_QUERY_SORT_FIELDS = new Set(['id', 'type', 'binDigits', 'bank', 'country', 'state', 'city', 'price', 'expiry', 'createdAt']);
const CARD_QUERY_PER_PAGE = [20, 30, 50, 100];

function queryText(value) {
    return String(value || '').trim().toLowerCase();
}

function queryBins(value) {
    return String(value || '')
        .split(/[\s,]+/)
        .map((part) => part.replace(/\D/g, ''))
        .filter(Boolean);
}

function cardQueryFilters(url) {
    return {
        bins: queryBins(url.searchParams.get('bins')),
        bank: queryText(url.searchParams.get('bank')),
        country: queryText(url.searchParams.get('country')),
        state: queryText(url.searchParams.get('state')),
        city: queryText(url.searchParams.get('city')),
        zip: queryText(url.searchParams.get('zip')),
        dob: String(url.searchParams.get('dob') || ''),
        ssn: String(url.searchParams.get('ssn') || ''),
        type: String(url.searchParams.get('type') || ''),
        level: String(url.searchParams.get('level') || ''),
        cardClass: String(url.searchParams.get('cardClass') || ''),
        vendor: queryText(url.searchParams.get('vendor')),
        priceFrom: Number(url.searchParams.get('minPrice') ?? url.searchParams.get('priceFrom')) || 0,
        priceTo: Number(url.searchParams.get('maxPrice') ?? url.searchParams.get('priceTo')) || 0
    };
}

function cardMatchesQuery(card, filters, excluded = '') {
    const priceMin = Math.min(filters.priceFrom, filters.priceTo);
    const priceMax = Math.max(filters.priceFrom, filters.priceTo);
    const matchesText = (field, query) => !query || queryText(card[field]).includes(query);
    const matchesExact = (field, value) => !value || String(card[field] || '').toUpperCase() === value.toUpperCase();
    const matchesBins = !filters.bins.length || filters.bins.some((bin) => card.binDigits.startsWith(bin));
    const matchesCountry = !filters.country
        || queryText(card.country) === filters.country
        || queryText(card.countryCode) === filters.country;

    return (excluded === 'bins' || matchesBins)
        && (excluded === 'bank' || matchesText('bank', filters.bank))
        && (excluded === 'country' || matchesCountry)
        && (excluded === 'state' || matchesText('state', filters.state))
        && (excluded === 'city' || matchesText('city', filters.city))
        && (excluded === 'zip' || matchesText('zip', filters.zip))
        && (excluded === 'dob' || matchesExact('dob', filters.dob))
        && (excluded === 'ssn' || matchesExact('ssn', filters.ssn))
        && (excluded === 'type' || matchesExact('type', filters.type))
        && (excluded === 'level' || matchesExact('level', filters.level))
        && (excluded === 'cardClass' || matchesExact('cardClass', filters.cardClass))
        && (excluded === 'vendor' || matchesText('vendor', filters.vendor))
        && (excluded === 'price' || (card.price >= priceMin && card.price <= priceMax));
}

function cardQuerySort(cards, field, direction, relevanceFilters = null) {
    const multiplier = direction === 'asc' ? 1 : -1;

    return cards.sort((left, right) => {
        if (relevanceFilters) {
            const relevanceDifference = cardRelevanceScore(right, relevanceFilters) - cardRelevanceScore(left, relevanceFilters);

            if (relevanceDifference) {
                return relevanceDifference;
            }
        }

        const leftValue = field === 'price' || field === 'id' ? Number(left[field]) : String(left[field] || '').toLowerCase();
        const rightValue = field === 'price' || field === 'id' ? Number(right[field]) : String(right[field] || '').toLowerCase();

        if (leftValue < rightValue) {
            return -1 * multiplier;
        }

        if (leftValue > rightValue) {
            return 1 * multiplier;
        }

        return Number(right.id) - Number(left.id);
    });
}

function cardRelevanceScore(card, filters) {
    const textFields = ['bank', 'country', 'state', 'city', 'zip', 'vendor'];
    const exactFields = ['dob', 'ssn', 'type', 'level', 'cardClass'];
    let score = 0;

    if (filters.bins.some((bin) => card.binDigits === bin)) {
        score += 100;
    } else if (filters.bins.some((bin) => card.binDigits.startsWith(bin))) {
        score += 70;
    }

    exactFields.forEach((field) => {
        if (filters[field] && String(card[field] || '').toLowerCase() === filters[field].toLowerCase()) {
            score += field === 'type' || field === 'level' ? 40 : 20;
        }
    });

    textFields.forEach((field) => {
        const query = filters[field];

        if (query && queryText(card[field]) === query) {
            score += 30;
        } else if (query && queryText(card[field]).includes(query)) {
            score += 15;
        }
    });

    if (filters.country && queryText(card.countryCode) === filters.country) {
        score += 35;
    }

    if (filters.priceFrom > 0 || filters.priceTo > 0) {
        const min = Math.min(filters.priceFrom, filters.priceTo);
        const max = Math.max(filters.priceFrom, filters.priceTo);

        if (card.price >= min && card.price <= max) {
            score += 15;
        }
    }

    return score;
}

function randomizeCards(cards) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
        const swapIndex = crypto.randomInt(index + 1);
        [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
    }

    return cards;
}

function fallbackDashboardCards(records, filters) {
    const scored = records
        .map((card) => ({ card, score: cardRelevanceScore(card, filters) }))
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || Number(right.card.id) - Number(left.card.id))
        .map((entry) => entry.card);
    const seen = new Set(scored.map((card) => card.id));
    const randomInventory = randomizeCards(records.filter((card) => !seen.has(card.id)).slice());

    return [...scored, ...randomInventory];
}

function cardQueryFacets(cards, filters) {
    const values = (field, excluded) => [...new Set(cards
        .filter((card) => cardMatchesQuery(card, filters, excluded))
        .map((card) => card[field])
        .filter(Boolean))].sort((left, right) => String(left).localeCompare(String(right)));

    return {
        countries: values('country', 'country'),
        states: values('state', 'state'),
        cities: values('city', 'city'),
        banks: values('bank', 'bank')
    };
}

function queryDashboardCards(url) {
    const startedAt = process.hrtime.bigint();
    const filters = cardQueryFilters(url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const requestedPerPage = Number.parseInt(url.searchParams.get('perPage') || '20', 10);
    const perPage = CARD_QUERY_PER_PAGE.includes(requestedPerPage) ? requestedPerPage : 20;
    const requestedSort = url.searchParams.get('sort');
    const sort = CARD_QUERY_SORT_FIELDS.has(requestedSort) ? requestedSort : 'id';
    const direction = url.searchParams.get('direction') === 'asc' ? 'asc' : 'desc';
    const records = readCardRecords();
    const filtered = records.filter((card) => cardMatchesQuery(card, filters));
    const isFallback = filtered.length === 0 && records.length > 0 && filters.priceFrom !== filters.priceTo;
    const prioritized = isFallback ? fallbackDashboardCards(records, filters) : filtered;
    const sorted = cardQuerySort(prioritized, sort, direction, isFallback ? filters : null);
    const pageCount = Math.max(1, Math.ceil(sorted.length / perPage));
    const safePage = Math.min(page, pageCount);
    const cards = sorted.slice((safePage - 1) * perPage, safePage * perPage);
    const matchMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    return {
        cards,
        total: sorted.length,
        page: safePage,
        perPage,
        pageCount,
        sort,
        direction,
        matchMs: Number(matchMs.toFixed(2)),
        isFallback,
        fallbackMessage: isFallback ? 'No exact matches found for your filter. Showing available relevant inventory below.' : '',
        facets: cardQueryFacets(records, filters)
    };
}

function migrateCardRecords() {
    const store = readCardStore();
    const cards = store.cards.map((card, index) => sanitizeCardRecord(card, index + 1));

    if (JSON.stringify(cards) !== JSON.stringify(store.cards)) {
        writeCardStore({
            ...store,
            cards
        });
    }
}

function addCardRecord(record) {
    const store = readCardStore();
    const now = new Date().toISOString();
    const card = sanitizeCardRecord({
        ...record,
        id: store.nextId,
        createdAt: now
    }, store.nextId);

    store.nextId += 1;
    store.cards.push(card);
    writeCardStore(store);
    return card;
}

const BULK_CARD_TYPES = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'UNIONPAY'];
const BULK_CARD_CLASSES = ['CREDIT', 'DEBIT', 'PREPAID'];
const BULK_CARD_LEVELS = ['CLASSIC', 'GOLD', 'PLATINUM', 'SIGNATURE', 'STANDARD'];
const BULK_BANKS = ['Chase Bank', 'Bank of America', 'UOB', 'Wells Fargo', 'HSBC', 'Citi'];
const BULK_VENDORS = ['Secure Checkout', 'Global Merchant Network', 'Prime Commerce', 'Direct Pay Services', 'Verified Retail'];
const BULK_LOCATIONS = [
    { country: 'United States', countryCode: 'US', state: 'California', city: 'Los Angeles', zip: '90001' },
    { country: 'United Kingdom', countryCode: 'GB', state: 'England', city: 'London', zip: 'SW1A 1AA' },
    { country: 'Singapore', countryCode: 'SG', state: 'Singapore', city: 'Singapore', zip: '018956' },
    { country: 'Canada', countryCode: 'CA', state: 'Ontario', city: 'Toronto', zip: 'M5V 2T6' },
    { country: 'Australia', countryCode: 'AU', state: 'New South Wales', city: 'Sydney', zip: '2000' },
    { country: 'India', countryCode: 'IN', state: 'Maharashtra', city: 'Mumbai', zip: '400001' },
    { country: 'Japan', countryCode: 'JP', state: 'Tokyo', city: 'Tokyo', zip: '100-0001' },
    { country: 'Germany', countryCode: 'DE', state: 'Berlin', city: 'Berlin', zip: '10115' }
];

function randomBulkBin() {
    return String(crypto.randomInt(100000, 1000000));
}

function generateBulkCardRecord(price) {
    const bin = randomBulkBin();
    const location = randomFrom(BULK_LOCATIONS);

    return {
        type: randomFrom(BULK_CARD_TYPES),
        bin,
        bank: randomFrom(BULK_BANKS),
        cardClass: randomFrom(BULK_CARD_CLASSES),
        level: randomFrom(BULK_CARD_LEVELS),
        expiry: `**/${crypto.randomInt(28, 36)}`,
        ...location,
        database: `CARD_DB_${bin}_******`,
        ssn: randomFrom(['Yes', 'No']),
        dob: randomFrom(['Yes', 'No']),
        vendor: randomFrom(BULK_VENDORS),
        price
    };
}

function addBulkCardRecords(quantity) {
    const store = readCardStore();
    const now = new Date().toISOString();
    const cardsPerTier = Math.floor(quantity / 100);
    const cards = Array.from({ length: quantity }, (_, index) => {
        const id = store.nextId++;
        const price = (index % 100) + 1;

        return sanitizeCardRecord({
            ...generateBulkCardRecord(price),
            id,
            createdAt: now
        }, id);
    });

    store.cards.push(...cards);
    writeCardStore(store);

    return cards;
}

function deleteCardRecord(id) {
    const store = readCardStore();
    const cardId = Number(id);
    const nextCards = store.cards.filter((card) => Number(card.id) !== cardId);
    const deleted = nextCards.length !== store.cards.length;

    if (deleted) {
        writeCardStore({
            ...store,
            cards: nextCards
        });
    }

    return deleted;
}

function sanitizeList(value, fallback, maxItems = 50, maxLength = 80) {
    const source = Array.isArray(value) ? value : fallback;
    const list = source
        .map((item) => sanitizeText(item, '', maxLength))
        .filter(Boolean);

    return list.length ? [...new Set(list)].slice(0, maxItems) : fallback;
}

function sanitizeTelegramUrl(value, fallback) {
    try {
        const url = new URL(String(value || fallback).trim());
        const hostname = url.hostname.toLowerCase();

        if (url.protocol !== 'https:' || !['t.me', 'telegram.me', 'www.t.me', 'www.telegram.me'].includes(hostname)) {
            return fallback;
        }

        return url.href;
    } catch (error) {
        return fallback;
    }
}

function sanitizeTargetPool(value) {
    const pool = sanitizeText(value, 'labels', 20).toLowerCase();

    return ['amounts', 'orders', 'tickets', 'labels'].includes(pool) ? pool : 'labels';
}

function sanitizeActivityTemplates(value, fallback) {
    const source = Array.isArray(value) ? value : fallback;
    const templates = source
        .map((template) => ({
            message: sanitizeText(template?.message, '', 64),
            targetPool: sanitizeTargetPool(template?.targetPool),
            status: sanitizeText(template?.status, 'Active', 28)
        }))
        .filter((template) => template.message);

    return templates.length ? templates.slice(0, 30) : fallback;
}

function sanitizeDashboardLinks(value, fallback) {
    const source = Array.isArray(value) ? value : fallback;
    const links = source
        .map((link) => {
            const label = sanitizeText(link?.label, '', 20);
            const text = sanitizeText(link?.text, sanitizeText(link?.href, '', 100), 100);
            const href = sanitizeText(link?.href, '#', 220);
            const tone = sanitizeText(link?.tone, 'blue', 12).toLowerCase() === 'red' ? 'red' : 'blue';

            if (!label || !text) {
                return null;
            }

            return {
                label,
                text,
                href,
                tone
            };
        })
        .filter(Boolean);

    return links.length ? links.slice(0, 8) : fallback;
}

function sanitizeParagraphs(value, fallback) {
    const source = Array.isArray(value) ? value : fallback;
    const paragraphs = source
        .map((paragraph) => sanitizeText(paragraph, '', 320))
        .filter(Boolean);

    return paragraphs.length ? paragraphs.slice(0, 6) : fallback;
}

function sanitizeDashboardContent(content = {}) {
    const fallback = DEFAULT_TICKER_SETTINGS.dashboardContent;

    return {
        attentionTitle: sanitizeText(content.attentionTitle, fallback.attentionTitle, 60),
        attentionBody: sanitizeText(content.attentionBody, fallback.attentionBody, 260),
        attentionLinks: sanitizeDashboardLinks(content.attentionLinks, fallback.attentionLinks),
        noticeTitle: sanitizeText(content.noticeTitle, fallback.noticeTitle, 60),
        noticeParagraphs: sanitizeParagraphs(content.noticeParagraphs, fallback.noticeParagraphs),
        virtualCardNote: sanitizeText(content.virtualCardNote, fallback.virtualCardNote, 240)
    };
}

function sanitizeTickerSettings(settings = {}) {
    return {
        telegramUrl: sanitizeTelegramUrl(settings.telegramUrl, DEFAULT_TICKER_SETTINGS.telegramUrl),
        virtualCardNote: sanitizeText(settings.virtualCardNote || settings.dashboardContent?.virtualCardNote, DEFAULT_TICKER_SETTINGS.virtualCardNote, 240),
        onlineBase: clampNumber(settings.onlineBase, DEFAULT_TICKER_SETTINGS.onlineBase, 0, 100000),
        autoFluctuate: Boolean(settings.autoFluctuate),
        fluctuationRange: clampNumber(settings.fluctuationRange, DEFAULT_TICKER_SETTINGS.fluctuationRange, 0, 500),
        slideIntervalMs: clampNumber(settings.slideIntervalMs, DEFAULT_TICKER_SETTINGS.slideIntervalMs, 1500, 60000),
        usernames: sanitizeList(settings.usernames, DEFAULT_TICKER_SETTINGS.usernames, 80, 40),
        activityTemplates: sanitizeActivityTemplates(settings.activityTemplates, DEFAULT_TICKER_SETTINGS.activityTemplates),
        amounts: sanitizeList(settings.amounts, DEFAULT_TICKER_SETTINGS.amounts, 80, 40),
        orders: sanitizeList(settings.orders, DEFAULT_TICKER_SETTINGS.orders, 80, 60),
        tickets: sanitizeList(settings.tickets, DEFAULT_TICKER_SETTINGS.tickets, 80, 60),
        labels: sanitizeList(settings.labels, DEFAULT_TICKER_SETTINGS.labels, 80, 60),
        dashboardContent: sanitizeDashboardContent(settings.dashboardContent)
    };
}

function ensureTickerSettings() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(TICKER_SETTINGS_PATH)) {
        writeTickerSettings(DEFAULT_TICKER_SETTINGS);
        return;
    }

    const currentSettings = readJsonStore(TICKER_SETTINGS_PATH, DEFAULT_TICKER_SETTINGS);
    if (!currentSettings.virtualCardNote && !currentSettings.dashboardContent?.virtualCardNote) {
        writeTickerSettings(currentSettings);
    }
}

function readTickerSettings() {
    ensureTickerSettings();

    try {
        const raw = fs.readFileSync(TICKER_SETTINGS_PATH, 'utf8');
        return sanitizeTickerSettings(JSON.parse(raw));
    } catch (error) {
        return sanitizeTickerSettings(DEFAULT_TICKER_SETTINGS);
    }
}

function writeTickerSettings(settings) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const sanitizedSettings = sanitizeTickerSettings(settings);
    const tmpPath = `${TICKER_SETTINGS_PATH}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(sanitizedSettings, null, 2)}\n`);
    fs.renameSync(tmpPath, TICKER_SETTINGS_PATH);
    return sanitizedSettings;
}

function sanitizeAnnouncementLink(value, fallback = '#') {
    const link = String(value || '').trim();

    if (!link) {
        return fallback;
    }

    if (link.startsWith('/') && !link.startsWith('//')) {
        return link;
    }

    try {
        const url = new URL(link);
        return ['http:', 'https:'].includes(url.protocol) ? url.toString() : fallback;
    } catch (error) {
        return fallback;
    }
}

function sanitizeAnnouncementAlert(settings = {}) {
    return {
        is_enabled: Boolean(settings.is_enabled),
        title: sanitizeText(settings.title, DEFAULT_ANNOUNCEMENT_ALERT.title, 120),
        message: sanitizeText(settings.message, DEFAULT_ANNOUNCEMENT_ALERT.message, 2000),
        action_text: sanitizeText(settings.action_text, DEFAULT_ANNOUNCEMENT_ALERT.action_text, 60),
        action_link: sanitizeAnnouncementLink(settings.action_link, DEFAULT_ANNOUNCEMENT_ALERT.action_link),
        secondary_text: sanitizeText(settings.secondary_text, DEFAULT_ANNOUNCEMENT_ALERT.secondary_text, 60)
    };
}

function readAnnouncementAlert() {
    return sanitizeAnnouncementAlert(readJsonStore(ANNOUNCEMENT_ALERT_PATH, DEFAULT_ANNOUNCEMENT_ALERT));
}

function writeAnnouncementAlert(settings) {
    const sanitizedSettings = sanitizeAnnouncementAlert(settings);
    writeJsonStore(ANNOUNCEMENT_ALERT_PATH, sanitizedSettings);
    return sanitizedSettings;
}

function sanitizeCheckerSettings(settings = {}) {
    return {
        price: Number(clampNumber(settings.price, DEFAULT_CHECKER_SETTINGS.price, 0, 100000).toFixed(2))
    };
}

function readCheckerSettings() {
    return sanitizeCheckerSettings(readJsonStore(CHECKER_SETTINGS_PATH, DEFAULT_CHECKER_SETTINGS));
}

function writeCheckerSettings(settings) {
    const sanitizedSettings = sanitizeCheckerSettings(settings);

    writeJsonStore(CHECKER_SETTINGS_PATH, sanitizedSettings);
    return sanitizedSettings;
}

function sanitizeSubSettings(settings = {}) {
    return {
        price: Number(clampNumber(settings.price, DEFAULT_SUB_SETTINGS.price, 0, 100000).toFixed(2))
    };
}

function readSubSettings() {
    return sanitizeSubSettings(readJsonStore(SUB_SETTINGS_PATH, DEFAULT_SUB_SETTINGS));
}

function writeSubSettings(settings) {
    const sanitizedSettings = sanitizeSubSettings(settings);

    writeJsonStore(SUB_SETTINGS_PATH, sanitizedSettings);
    return sanitizedSettings;
}

function jsonResponse(res, status, body) {
    const payload = JSON.stringify(body);

    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'Cache-Control': 'no-store'
    });
    res.end(payload);
}

function sendError(res, status, message) {
    jsonResponse(res, status, {
        ok: false,
        error: message
    });
}

function sendAuthError(res, status, message, reason, field) {
    jsonResponse(res, status, {
        ok: false,
        error: message,
        reason,
        field,
        captcha: createCaptchaChallenge()
    });
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;

            if (body.length > 1000000) {
                reject(new Error('Request body is too large'));
                req.destroy();
            }
        });

        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON payload'));
            }
        });

        req.on('error', reject);
    });
}

function normalizeUsername(username) {
    return String(username || '').trim();
}

function normalizeCaptcha(value) {
    return String(value || '').trim().toUpperCase();
}

function validateCredentials(username, password) {
    if (!username) {
        return 'Username is required';
    }

    if (username.length < 3 || username.length > 32) {
        return 'Username must be 3-32 characters';
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return 'Username can use letters, numbers, dot, dash, and underscore';
    }

    if (!password) {
        return 'Password is required';
    }

    if (String(password).length < 6) {
        return 'Password must be at least 6 characters';
    }

    return '';
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');

    return {
        salt,
        hash
    };
}

function verifyPassword(password, user) {
    if (!user || !user.passwordSalt || !user.passwordHash) {
        return false;
    }

    if (String(user.passwordHash).startsWith('$2')) {
        return bcrypt.compareSync(String(password), user.passwordHash);
    }

    const passwordHash = hashPassword(password, user.passwordSalt);
    const expectedHash = Buffer.from(user.passwordHash, 'hex');
    const actualHash = Buffer.from(passwordHash.hash, 'hex');

    return expectedHash.length === actualHash.length && crypto.timingSafeEqual(expectedHash, actualHash);
}

function invalidateUserSessions(userId) {
    for (const [token, session] of sessions.entries()) {
        if (session.user?.id === userId) {
            sessions.delete(token);
        }
    }
}

function makeCaptchaCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < 5; i += 1) {
        code += chars[crypto.randomInt(chars.length)];
    }

    return code;
}

function hashCaptcha(code) {
    return crypto
        .createHmac('sha256', CAPTCHA_SECRET)
        .update(normalizeCaptcha(code))
        .digest('hex');
}

function createCaptchaImage(code) {
    const letters = [...String(code || '')];
    const noiseLines = Array.from({ length: 6 }, () => {
        const x1 = crypto.randomInt(0, 116);
        const y1 = crypto.randomInt(0, 42);
        const x2 = crypto.randomInt(0, 116);
        const y2 = crypto.randomInt(0, 42);
        const color = crypto.randomInt(0, 2) ? '#ef39dc' : '#36cb9a';

        return `<path d="M${x1} ${y1} C${crypto.randomInt(0, 116)} ${crypto.randomInt(0, 42)}, ${crypto.randomInt(0, 116)} ${crypto.randomInt(0, 42)}, ${x2} ${y2}" stroke="${color}" stroke-opacity=".78" stroke-width="1.4" fill="none"/>`;
    }).join('');
    const text = letters.map((letter, index) => {
        const x = 20 + index * 19;
        const y = 25 + crypto.randomInt(-4, 5);
        const rotation = crypto.randomInt(-19, 20);
        const color = index % 2 ? '#71c8ff' : '#b66bff';

        return `<tspan x="${x}" y="${y}" rotate="${rotation}" fill="${color}">${letter}</tspan>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="116" height="42" viewBox="0 0 116 42"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dff8ff"/></linearGradient></defs><rect width="116" height="42" rx="4" fill="url(#bg)"/>${noiseLines}<text font-family="Georgia,serif" font-size="24" font-style="italic" font-weight="700" text-anchor="middle">${text}</text></svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function cleanupCaptchaChallenges() {
    const now = Date.now();

    for (const [token, challenge] of captchaChallenges) {
        if (challenge.expiresAt <= now) {
            captchaChallenges.delete(token);
        }
    }

    while (captchaChallenges.size > CAPTCHA_MAX_CHALLENGES) {
        const oldestToken = captchaChallenges.keys().next().value;
        captchaChallenges.delete(oldestToken);
    }
}

function createCaptchaChallenge() {
    cleanupCaptchaChallenges();

    const code = makeCaptchaCode();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + CAPTCHA_TTL_MS;

    captchaChallenges.set(token, {
        hash: hashCaptcha(code),
        expiresAt
    });

    return {
        token,
        image: createCaptchaImage(code),
        length: code.length,
        expiresAt: new Date(expiresAt).toISOString()
    };
}

function verifyCaptcha(token, input) {
    cleanupCaptchaChallenges();

    const challenge = token ? captchaChallenges.get(String(token)) : null;

    if (!challenge) {
        return false;
    }

    captchaChallenges.delete(String(token));

    if (challenge.expiresAt <= Date.now()) {
        return false;
    }

    const normalizedInput = normalizeCaptcha(input);

    if (!normalizedInput) {
        return false;
    }

    const expectedHash = Buffer.from(challenge.hash, 'hex');
    const actualHash = Buffer.from(hashCaptcha(normalizedInput), 'hex');

    return expectedHash.length === actualHash.length && crypto.timingSafeEqual(expectedHash, actualHash);
}

function getClientIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
        return forwardedFor.split(',')[0].trim();
    }

    return req.socket?.remoteAddress || 'unknown';
}

function writeSecurityLog(entry) {
    try {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }

        fs.appendFileSync(AUTH_AUDIT_LOG_PATH, `${JSON.stringify(entry)}\n`);
    } catch (error) {
        console.error(`[auth-audit] unable to write security log: ${error.message}`);
    }
}

function logFailedLoginAttempt(req, username, reason) {
    const entry = {
        timestamp: new Date().toISOString(),
        ip: getClientIp(req),
        username: username || null,
        reason,
        userAgent: req.headers['user-agent'] || null
    };

    writeSecurityLog(entry);
    console.warn(`[auth-audit] failed login ip=${entry.ip} username=${entry.username || '-'} reason="${reason}"`);
}

function isLoginUsernameCandidate(username) {
    return Boolean(username) && username.length >= 3 && username.length <= 32 && /^[a-zA-Z0-9_.-]+$/.test(username);
}

function publicUser(user) {
    return {
        id: user.id,
        username: user.username,
        balance: userBalance(user),
        status: user.status || 'active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt || null
    };
}

function createSession(user) {
    const token = crypto.randomBytes(32).toString('hex');
    const session = {
        token,
        user: publicUser(user),
        issuedAt: new Date().toISOString()
    };

    sessions.set(token, session);
    return session;
}

function getSessionFromRequest(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    return token ? sessions.get(token) : null;
}

function createAdminSession() {
    const token = crypto.randomBytes(32).toString('hex');
    const issuedAtMs = Date.now();
    const session = {
        token,
        user: {
            username: 'admin',
            role: 'admin'
        },
        issuedAt: new Date(issuedAtMs).toISOString(),
        expiresAt: new Date(issuedAtMs + ADMIN_SESSION_TTL_MS).toISOString()
    };

    adminSessions.set(token, session);
    return session;
}

function createBase32Secret() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes = crypto.randomBytes(20);
    let bits = 0;
    let value = 0;
    let secret = '';

    bytes.forEach((byte) => {
        value = (value << 8) | byte;
        bits += 8;

        while (bits >= 5) {
            secret += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
            value &= bits ? (1 << bits) - 1 : 0;
        }
    });

    if (bits > 0) {
        secret += alphabet[(value << (5 - bits)) & 31];
    }

    return secret;
}

function base32ToBuffer(secret) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    const bytes = [];

    for (const character of String(secret || '').toUpperCase().replace(/=+$/, '')) {
        const index = alphabet.indexOf(character);

        if (index < 0) {
            throw new Error('Invalid base32 secret');
        }

        value = (value << 5) | index;
        bits += 5;

        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
            value &= bits ? (1 << bits) - 1 : 0;
        }
    }

    return Buffer.from(bytes);
}

function totpCode(secret, counter) {
    const key = base32ToBuffer(secret);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));
    const digest = crypto.createHmac('sha1', key).update(counterBuffer).digest();
    const offset = digest[digest.length - 1] & 15;
    const binary = ((digest[offset] & 127) << 24)
        | ((digest[offset + 1] & 255) << 16)
        | ((digest[offset + 2] & 255) << 8)
        | (digest[offset + 3] & 255);

    return String(binary % 1000000).padStart(6, '0');
}

function verifyTotp(secret, code) {
    if (!secret || !/^\d{6}$/.test(String(code || ''))) {
        return false;
    }

    const counter = Math.floor(Date.now() / 1000 / 30);
    return [-1, 0, 1].some((offset) => totpCode(secret, counter + offset) === String(code));
}

function twoFactorUri(secret) {
    return `otpauth://totp/${encodeURIComponent(`${ADMIN_ISSUER}:${ADMIN_USERNAME}`)}?secret=${secret}&issuer=${encodeURIComponent(ADMIN_ISSUER)}&algorithm=SHA1&digits=6&period=30`;
}

function hasValidMasterAdminKey(value) {
    const submitted = Buffer.from(String(value || ''));
    const expected = Buffer.from(MASTER_ADMIN_KEY);

    return Boolean(MASTER_ADMIN_KEY)
        && submitted.length === expected.length
        && crypto.timingSafeEqual(submitted, expected);
}

function requireMasterAdminKey(body, res) {
    if (hasValidMasterAdminKey(body.masterAdminKey)) {
        return true;
    }

    sendError(res, 403, 'Unauthorized. Invalid Admin Key.');
    return false;
}

function getAdminSessionFromRequest(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const session = token ? adminSessions.get(token) : null;

    if (!session) {
        return null;
    }

    const expiresAt = Date.parse(session.expiresAt);
    const issuedAt = Date.parse(session.issuedAt);
    const fallbackExpiresAt = Number.isFinite(issuedAt) ? issuedAt + ADMIN_SESSION_TTL_MS : 0;
    const sessionExpiresAt = Number.isFinite(expiresAt) ? expiresAt : fallbackExpiresAt;

    if (!sessionExpiresAt || sessionExpiresAt <= Date.now()) {
        adminSessions.delete(token);
        return null;
    }

    return session;
}

function destroyAdminSessionFromRequest(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    return token ? adminSessions.delete(token) : false;
}

function requireAdminSession(req, res) {
    const session = getAdminSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'Admin authentication required');
        return null;
    }

    return session;
}

function randomFrom(list) {
    return list[crypto.randomInt(list.length)];
}

function randomMoneyAmount() {
    const dollars = crypto.randomInt(24, 780);
    const cents = crypto.randomInt(0, 100);

    return `$${dollars}.${String(cents).padStart(2, '0')}`;
}

function tickerTargetForTemplate(template, settings) {
    if (template.targetPool === 'amounts') {
        return settings.amounts.length ? randomFrom(settings.amounts) : randomMoneyAmount();
    }

    const pool = settings[template.targetPool];
    return randomFrom(Array.isArray(pool) && pool.length ? pool : settings.labels);
}

function tickerUsernamesFromDatabase(currentUser, settings) {
    const sourceNames = [currentUser, ...settings.usernames];
    const seen = new Set();
    const names = sourceNames
        .filter((username) => {
            const key = username.toLowerCase();

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });

    return names.length ? names : settings.usernames;
}

function createDashboardNews(session) {
    const currentUser = session.user.username;
    const user = currentUserForSession(session);
    const cartStore = readCarts();
    const now = Date.now();
    const settings = readTickerSettings();
    const onlineUsers = Math.max(0, Number(settings.onlineBase) || 0);
    const names = tickerUsernamesFromDatabase(currentUser, settings);
    const templates = settings.activityTemplates;
    const itemCount = names.length;

    const items = Array.from({ length: itemCount }, (_, index) => {
        const template = templates[index % templates.length];

        return {
            id: `activity-${now}-${index + 1}`,
            actor: names[index],
            message: template.message,
            target: tickerTargetForTemplate(template, settings),
            status: template.status,
            createdAt: new Date(now - (index + 1) * 90000).toISOString()
        };
    });

    return {
        onlineUsers,
        walletBalance: `$${userBalance(user).toFixed(2)}`,
        cartCount: cartForUser(cartStore, user.id).length,
        checkerSettings: readCheckerSettings(),
        settings,
        dashboardContent: {
            ...settings.dashboardContent,
            virtualCardNote: settings.virtualCardNote
        },
        tickerTotal: itemCount,
        items
    };
}

async function handleTickerSettings(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, {
            ok: true,
            settings: readTickerSettings()
        });
        return;
    }

    const body = await parseBody(req);
    const settings = writeTickerSettings({
        ...readTickerSettings(),
        ...body,
        virtualCardNote: body.virtualCardNote || body.dashboardContent?.virtualCardNote
    });

    jsonResponse(res, 200, {
        ok: true,
        message: 'Ticker settings saved',
        settings
    });
}

async function handleAnnouncementAlertSettings(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, { ok: true, settings: readAnnouncementAlert() });
        return;
    }

    const body = await parseBody(req);
    const settings = writeAnnouncementAlert({ ...readAnnouncementAlert(), ...body });

    jsonResponse(res, 200, {
        ok: true,
        message: 'Announcement alert saved',
        settings
    });
}

function handleAnnouncementAlert(req, res) {
    if (!getSessionFromRequest(req)) {
        sendError(res, 401, 'No active session');
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        alert: readAnnouncementAlert()
    });
}

async function handleCheckerSettings(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, { ok: true, settings: readCheckerSettings() });
        return;
    }

    const body = await parseBody(req);
    const settings = writeCheckerSettings({ ...readCheckerSettings(), ...body });

    jsonResponse(res, 200, { ok: true, message: 'Checker settings saved', settings });
}

async function handleSubPriceSettings(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, { ok: true, price: readSubSettings().price });
        return;
    }

    if (!requireAdminSession(req, res)) {
        return;
    }

    const body = await parseBody(req);
    const settings = writeSubSettings({ ...readSubSettings(), price: body.price });

    jsonResponse(res, 200, { ok: true, message: 'SUB price saved', price: settings.price });
}

async function handleAdminCards(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, {
            ok: true,
            cards: readCardRecords()
        });
        return;
    }

    const body = await parseBody(req);
    const card = addCardRecord(body);

    jsonResponse(res, 201, {
        ok: true,
        message: 'Card record saved',
        card,
        cards: readCardRecords()
    });
}

async function handleBulkAdminCards(req, res) {
    const body = await parseBody(req);
    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
        sendError(res, 400, 'Bulk quantity must be a whole number from 1 to 100000');
        return;
    }

    const cards = addBulkCardRecords(quantity);

    jsonResponse(res, 201, {
        ok: true,
        message: `${cards.length} card records generated`,
        generated: cards.length,
        cards: readCardRecords()
    });
}

function handleDashboardSsn(req, res, url) {
    jsonResponse(res, 200, {
        ok: true,
        ...querySsnRecords(url)
    });
}

function handleAdminSsn(req, res, url) {
    const query = queryText(url.searchParams.get('q'));
    const status = String(url.searchParams.get('status') || '').toLowerCase();
    const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1);
    const perPage = 20;
    const allRecords = readSsnRecords();
    const filtered = allRecords.filter((record) => {
        const matchesText = !query || [record.firstName, record.lastName, record.city, record.state, record.zip]
            .some((value) => queryText(value).includes(query));
        const matchesStatus = !status || (status === 'available' ? record.active : status === 'sold' && !record.active);

        return matchesText && matchesStatus;
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(page, pageCount);

    jsonResponse(res, 200, {
        ok: true,
        records: filtered.slice((safePage - 1) * perPage, safePage * perPage),
        total: filtered.length,
        page: safePage,
        perPage,
        pageCount
    });
}

function deleteSsnRecord(recordId) {
    const store = readSsnStore();
    const originalLength = store.records.length;

    store.records = store.records.filter((record) => Number(record.id) !== Number(recordId));

    if (store.records.length === originalLength) {
        return false;
    }

    writeSsnStore(store);
    return true;
}

async function handleBulkAdminSsn(req, res) {
    const records = addBulkSsnRecords(1000);

    jsonResponse(res, 201, {
        ok: true,
        message: `${records.length} synthetic SSN records generated`,
        generated: records.length,
        total: readSsnRecords().length
    });
}

function handleDeleteSsn(req, res, recordId) {
    if (!deleteSsnRecord(recordId)) {
        sendError(res, 404, 'SSN record not found');
        return;
    }

    jsonResponse(res, 200, { ok: true, message: 'SSN record removed' });
}

function handleDeleteCard(req, res, cardId) {
    if (!deleteCardRecord(cardId)) {
        sendError(res, 404, 'Card record not found');
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        message: 'Card record deleted',
        cards: readCardRecords()
    });
}

async function handleRegister(req, res) {
    const body = await parseBody(req);
    const username = normalizeUsername(body.username);
    const password = String(body.password || '');

    if (!verifyCaptcha(body.captchaToken, body.captcha)) {
        sendAuthError(res, 400, 'Captcha is wrong', 'Captcha Mismatch', 'captcha');
        return;
    }

    const validationError = validateCredentials(username, password);

    if (validationError) {
        sendAuthError(res, 400, validationError, 'Validation Failed', validationError.toLowerCase().includes('password') ? 'password' : 'username');
        return;
    }

    const db = readDatabase();
    const usernameKey = username.toLowerCase();

    if (db.users.some((user) => user.usernameKey === usernameKey)) {
        sendAuthError(res, 409, 'Username already exists', 'Duplicate Username', 'username');
        return;
    }

    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();
    const user = {
        id: db.nextId,
        username,
        usernameKey,
        passwordSalt: passwordHash.salt,
        passwordHash: passwordHash.hash,
        status: 'active',
        balance: 0.00,
        main_balance: 0.00,
        reward_credit: 0.00,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null
    };

    db.nextId += 1;
    db.users.push(user);
    writeDatabase(db);

    jsonResponse(res, 201, {
        ok: true,
        message: 'Account created successfully',
        user: publicUser(user)
    });
}

async function handleLogin(req, res) {
    const body = await parseBody(req);
    const username = normalizeUsername(body.username);
    const password = String(body.password || '');

    if (!verifyCaptcha(body.captchaToken, body.captcha)) {
        logFailedLoginAttempt(req, username, 'Captcha Mismatch');
        sendAuthError(res, 400, 'Captcha is wrong', 'Captcha Mismatch', 'captcha');
        return;
    }

    if (!isLoginUsernameCandidate(username)) {
        logFailedLoginAttempt(req, username, 'User Not Found');
        sendAuthError(res, 401, 'Invalid Username or Account does not exist', 'User Not Found', 'username');
        return;
    }

    if (!password) {
        logFailedLoginAttempt(req, username, 'Invalid Password');
        sendAuthError(res, 401, 'Password does not match', 'Invalid Password', 'password');
        return;
    }

    const db = readDatabase();
    const usernameKey = username.toLowerCase();
    const user = db.users.find((entry) => entry.usernameKey === usernameKey);

    if (!user) {
        logFailedLoginAttempt(req, username, 'User Not Found');
        sendAuthError(res, 401, 'Invalid Username or Account does not exist', 'User Not Found', 'username');
        return;
    }

    if (!verifyPassword(password, user)) {
        logFailedLoginAttempt(req, username, 'Invalid Password');
        sendAuthError(res, 401, 'Password does not match', 'Invalid Password', 'password');
        return;
    }

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = user.lastLoginAt;
    writeDatabase(db);

    jsonResponse(res, 200, {
        ok: true,
        message: 'Login successful',
        session: createSession(user)
    });
}

function handleCaptcha(req, res) {
    jsonResponse(res, 200, {
        ok: true,
        captcha: createCaptchaChallenge()
    });
}

async function handleAdminLogin(req, res) {
    const body = await parseBody(req);

    if (String(body.username || '') !== ADMIN_USERNAME || String(body.password || '') !== 'admin') {
        logFailedLoginAttempt(req, String(body.username || ''), 'Invalid Admin Credentials');
        sendError(res, 401, 'Invalid admin credentials');
        return;
    }

    const db = readDatabase();

    if (db.adminAccount.is_2fa_enabled) {
        const challenge = crypto.randomBytes(32).toString('hex');
        adminTwoFactorChallenges.set(challenge, Date.now() + 5 * 60 * 1000);
        jsonResponse(res, 200, {
            ok: true,
            requiresTwoFactor: true,
            challenge
        });
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        message: 'Admin login successful',
        session: createAdminSession()
    });
}

function handleAdminTwoFactorSettings(req, res) {
    const db = readDatabase();
    jsonResponse(res, 200, {
        ok: true,
        is_2fa_enabled: db.adminAccount.is_2fa_enabled
    });
}

async function handleAdminTwoFactorSetup(req, res) {
    const body = await parseBody(req);

    if (!requireMasterAdminKey(body, res)) {
        return;
    }

    const secret = createBase32Secret();
    adminTwoFactorChallenges.set(`setup:${secret}`, Date.now() + 10 * 60 * 1000);
    jsonResponse(res, 200, {
        ok: true,
        secret,
        otpauthUrl: twoFactorUri(secret),
        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(twoFactorUri(secret))}`
    });
}

async function handleAdminTwoFactorEnable(req, res) {
    const body = await parseBody(req);

    if (!requireMasterAdminKey(body, res)) {
        return;
    }

    const secret = String(body.secret || '').toUpperCase();
    const setupKey = `setup:${secret}`;

    if (!adminTwoFactorChallenges.has(setupKey) || adminTwoFactorChallenges.get(setupKey) < Date.now() || !verifyTotp(secret, body.code)) {
        sendError(res, 400, 'Invalid authenticator code. Please try again.');
        return;
    }

    const db = readDatabase();
    db.adminAccount.is_2fa_enabled = true;
    db.adminAccount.twoFactorSecret = secret;
    writeDatabase(db);
    adminTwoFactorChallenges.delete(setupKey);
    jsonResponse(res, 200, { ok: true, is_2fa_enabled: true });
}

async function handleAdminTwoFactorDisable(req, res) {
    const body = await parseBody(req);

    if (!requireMasterAdminKey(body, res)) {
        return;
    }

    const db = readDatabase();

    if (!verifyTotp(db.adminAccount.twoFactorSecret, body.code)) {
        sendError(res, 400, 'Invalid authenticator code. Please try again.');
        return;
    }

    db.adminAccount.is_2fa_enabled = false;
    db.adminAccount.twoFactorSecret = null;
    writeDatabase(db);
    jsonResponse(res, 200, { ok: true, is_2fa_enabled: false });
}

async function handleAdminTwoFactorVerification(req, res) {
    const body = await parseBody(req);
    const challenge = String(body.challenge || '');
    const expiresAt = adminTwoFactorChallenges.get(challenge);
    const db = readDatabase();

    if (!expiresAt || expiresAt < Date.now() || !verifyTotp(db.adminAccount.twoFactorSecret, body.code)) {
        sendError(res, 401, 'Invalid authenticator code. Please try again.');
        return;
    }

    adminTwoFactorChallenges.delete(challenge);
    jsonResponse(res, 200, {
        ok: true,
        message: 'Admin login successful',
        session: createAdminSession()
    });
}

function handleAdminSession(req, res) {
    const session = requireAdminSession(req, res);

    if (!session) {
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        session
    });
}

function handleAdminLogout(req, res) {
    const destroyed = destroyAdminSessionFromRequest(req);

    jsonResponse(res, 200, {
        ok: true,
        message: destroyed ? 'Admin session destroyed' : 'No active admin session'
    });
}

function handleUsers(req, res) {
    const db = readDatabase();
    const users = db.users
        .map(publicUser)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    jsonResponse(res, 200, {
        ok: true,
        users
    });
}

function handleSession(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        session
    });
}
async function handleUpdateProfile(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const body = await parseBody(req);
    const currentPassword = String(body.current_password || '');
    const newPassword = String(body.new_password || '');
    const confirmPassword = String(body.confirm_new_password || '');
    const db = readDatabase();
    const user = db.users.find((entry) => entry.id === session.user.id);

    if (!user || !verifyPassword(currentPassword, user)) {
        sendError(res, 400, 'Current password is incorrect');
        return;
    }

    if (newPassword.length < 8) {
        sendError(res, 400, 'New password must be at least 8 characters');
        return;
    }

    if (newPassword !== confirmPassword) {
        sendError(res, 400, 'New passwords do not match');
        return;
    }

    user.passwordSalt = '';
    user.passwordHash = bcrypt.hashSync(newPassword, 12);
    user.updatedAt = new Date().toISOString();
    writeDatabase(db);
    invalidateUserSessions(user.id);

    jsonResponse(res, 200, {
        ok: true,
        message: 'Password updated successfully. Please sign in again.'
    });
}

function handleDashboardNews(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        session,
        ...createDashboardNews(session)
    });
}

function ticketForUser(store, session, ticketId) {
    return store.tickets.find((ticket) => ticket.id === ticketId && ticket.userId === session.user.id);
}

async function handleUserTickets(req, res, url) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const store = readSupportTickets();

    if (req.method === 'GET' && url.pathname === '/api/tickets') {
        const tickets = store.tickets
            .filter((ticket) => ticket.userId === session.user.id)
            .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));

        jsonResponse(res, 200, { ok: true, tickets: tickets.map(publicTicket) });
        return;
    }

    if (req.method === 'POST' && url.pathname === '/api/tickets/create') {
        const body = await parseBody(req);
        const reasonContact = sanitizeText(body.reasonContact, '', 80);
        const subject = sanitizeText(body.subject, '', 160);
        const description = sanitizeText(body.description, '', 5000);
        const paymentAddress = sanitizeText(body.paymentAddress, '', 220);

        if (!reasonContact || !subject || !description || !paymentAddress) {
            sendError(res, 400, 'Reason contact, subject, description, and payment address are required');
            return;
        }

        const now = new Date().toISOString();
        const ticket = {
            id: store.nextId,
            ticketId: `TKT-${String(store.nextId).padStart(6, '0')}`,
            userId: session.user.id,
            username: session.user.username,
            reasonContact,
            subject,
            description,
            paymentAddress,
            status: 'Open',
            createdAt: now,
            updatedAt: now,
            messages: [{
                id: 1,
                sender: 'user',
                author: session.user.username,
                text: description,
                createdAt: now
            }]
        };

        store.nextId += 1;
        store.tickets.push(ticket);
        writeSupportTickets(store);
        jsonResponse(res, 201, { ok: true, ticket: publicTicket(ticket) });
        return;
    }

    const ticketMatch = url.pathname.match(/^\/api\/tickets\/(\d+)(?:\/reply)?$/);
    if (!ticketMatch) {
        sendError(res, 404, 'Ticket route not found');
        return;
    }

    const ticketId = Number(ticketMatch[1]);
    const ticket = ticketForUser(store, session, ticketId);
    if (!ticket) {
        sendError(res, 404, 'Ticket not found');
        return;
    }

    if (req.method === 'GET') {
        jsonResponse(res, 200, { ok: true, ticket: publicTicket(ticket) });
        return;
    }

    if (req.method === 'POST' && url.pathname.endsWith('/reply')) {
        const body = await parseBody(req);
        const text = sanitizeText(body.text, '', 5000);
        if (!text) {
            sendError(res, 400, 'Reply is required');
            return;
        }
        if (ticket.status === 'Closed') {
            sendError(res, 400, 'Closed tickets cannot receive replies');
            return;
        }

        ticket.messages = Array.isArray(ticket.messages) ? ticket.messages : [];
        ticket.messages.push({
            id: ticket.messages.length + 1,
            sender: 'user',
            author: session.user.username,
            text,
            createdAt: new Date().toISOString()
        });
        ticket.status = 'Open';
        ticket.updatedAt = new Date().toISOString();
        writeSupportTickets(store);
        jsonResponse(res, 200, { ok: true, ticket: publicTicket(ticket) });
        return;
    }

    sendError(res, 405, 'Method not allowed');
}

async function handleAdminTickets(req, res, url) {
    if (!requireAdminSession(req, res)) {
        return;
    }

    const store = readSupportTickets();
    const ticketMatch = url.pathname.match(/^\/api\/admin\/tickets\/(\d+)(?:\/(reply|status))?$/);

    if (req.method === 'GET' && url.pathname === '/api/admin/tickets') {
        const status = sanitizeText(url.searchParams.get('status'), 'All', 20);
        const tickets = store.tickets
            .filter((ticket) => status === 'All' || ticket.status === status)
            .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
        jsonResponse(res, 200, { ok: true, tickets: tickets.map(publicTicket) });
        return;
    }

    if (!ticketMatch) {
        sendError(res, 404, 'Ticket route not found');
        return;
    }

    const ticket = store.tickets.find((candidate) => candidate.id === Number(ticketMatch[1]));
    if (!ticket) {
        sendError(res, 404, 'Ticket not found');
        return;
    }

    if (req.method === 'GET' && !ticketMatch[2]) {
        jsonResponse(res, 200, { ok: true, ticket: publicTicket(ticket) });
        return;
    }

    const body = await parseBody(req);
    if (req.method === 'POST' && ticketMatch[2] === 'reply') {
        const text = sanitizeText(body.text, '', 5000);
        if (!text) {
            sendError(res, 400, 'Reply is required');
            return;
        }
        ticket.messages = Array.isArray(ticket.messages) ? ticket.messages : [];
        ticket.messages.push({
            id: ticket.messages.length + 1,
            sender: 'admin',
            author: 'admin',
            text,
            createdAt: new Date().toISOString()
        });
        ticket.status = 'Replied';
        ticket.updatedAt = new Date().toISOString();
    } else if (req.method === 'PATCH' && ticketMatch[2] === 'status') {
        const status = sanitizeChoice(body.status, new Set(['Open', 'Replied', 'Closed']), ticket.status);
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
    } else {
        sendError(res, 405, 'Method not allowed');
        return;
    }

    writeSupportTickets(store);
    jsonResponse(res, 200, { ok: true, ticket: publicTicket(ticket) });
}

async function handleDashboardChecker(req, res, price = readCheckerSettings().price) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const db = readDatabase();
    const storedUser = db.users.find((user) => user.id === session.user.id);

    if (!storedUser) {
        sendError(res, 401, 'No active user');
        return;
    }

    const balance = userBalance(storedUser);
    if (balance < price) {
        sendError(res, 400, 'Insufficient wallet balance. Please add funds.');
        return;
    }

    storedUser.balance = Number((balance - price).toFixed(2));
    storedUser.updatedAt = new Date().toISOString();
    writeDatabase(db);
    session.user = publicUser(storedUser);

    jsonResponse(res, 200, {
        ok: true,
        walletBalance: userBalance(storedUser)
    });
}

function currentUserForSession(session) {
    const db = readDatabase();

    return db.users.find((user) => user.id === session.user.id);
}

function bonusForAmount(amount) {
    const tier = readDepositSettings().bonusTiers
        .filter((candidate) => amount > candidate.threshold)
        .sort((left, right) => right.threshold - left.threshold)[0];

    return tier ? amount * tier.percent / 100 : 0;
}

function publicDeposit(deposit) {
    return {
        id: deposit.id,
        username: deposit.username,
        status: deposit.status,
        date: deposit.createdAt,
        method: deposit.method,
        amount: deposit.amount,
        bonus: deposit.bonus,
        value: deposit.value,
        wallet: deposit.wallet,
        txid: deposit.txid || '',
        screenshot: deposit.screenshot || '',
        note: deposit.note || ''
    };
}

function publicPurchase(purchase) {
    const result = {
        id: purchase.id,
        userId: purchase.userId,
        itemId: purchase.itemId,
        itemName: purchase.itemName,
        reference: purchase.reference,
        category: purchase.category,
        status: purchase.status,
        amount: purchase.amount,
        date: purchase.createdAt,
        note: purchase.note || '',
        details: purchase.details || '',
        adminNote: purchase.adminNote || ''
    };

    if (purchase.ssnDetails) {
        result.ssnDetails = purchase.ssnDetails;
    }

    return result;
}

function adminPurchase(purchase) {
    return {
        ...publicPurchase(purchase),
        username: purchase.username || `User #${purchase.userId}`
    };
}

async function handleAdminPurchases(req, res, url) {
    if (!requireAdminSession(req, res)) {
        return;
    }

    const store = readPurchases();
    const purchaseMatch = url.pathname.match(/^\/api\/admin\/purchases\/(\d+)$/);

    if (req.method === 'GET' && url.pathname === '/api/admin/purchases') {
        jsonResponse(res, 200, {
            ok: true,
            purchases: store.purchases
                .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
                .map(adminPurchase)
        });
        return;
    }

    if (req.method !== 'PUT' || !purchaseMatch) {
        sendError(res, 405, 'Method not allowed');
        return;
    }

    const purchase = store.purchases.find((item) => item.id === Number(purchaseMatch[1]));
    if (!purchase) {
        sendError(res, 404, 'Purchase not found');
        return;
    }

    const body = await parseBody(req);
    const status = sanitizeChoice(body.status, new Set(['COMPLETED', 'PENDING', 'REFUNDED', 'CANCELLED']), purchase.status)
        .replace(/^COMPLETED$/, 'Completed')
        .replace(/^PENDING$/, 'Pending')
        .replace(/^REFUNDED$/, 'Refunded')
        .replace(/^CANCELLED$/, 'Cancelled');
    const updatedPurchase = {
        ...purchase,
        itemName: sanitizeText(body.itemName, purchase.itemName, 180),
        reference: sanitizeText(body.reference, purchase.reference, 120),
        category: sanitizeText(body.category, purchase.category, 60),
        status,
        amount: sanitizePrice(body.amount),
        note: sanitizeText(body.note, '', 320),
        details: sanitizeText(body.details, '', 2000),
        adminNote: sanitizeText(body.adminNote, '', 2000),
        updatedAt: new Date().toISOString()
    };

    if (body.ssnDetails && typeof body.ssnDetails === 'object') {
        updatedPurchase.ssnDetails = {
            firstName: sanitizeText(body.ssnDetails.firstName, '', 60),
            lastName: sanitizeText(body.ssnDetails.lastName, '', 60),
            dob: sanitizeText(body.ssnDetails.dob, '', 20),
            ssnNumber: sanitizeText(body.ssnDetails.ssnNumber, '', 20),
            city: sanitizeText(body.ssnDetails.city, '', 80),
            state: sanitizeText(body.ssnDetails.state, '', 20),
            zip: sanitizeText(body.ssnDetails.zip, '', 20)
        };
    } else if (body.ssnDetails === null) {
        delete updatedPurchase.ssnDetails;
    }

    Object.assign(purchase, updatedPurchase);
    writePurchases(store);
    jsonResponse(res, 200, { ok: true, purchase: adminPurchase(purchase) });
}

function publicCartItem(card) {
    return {
        id: card.id,
        type: card.type,
        bin: card.bin,
        bank: card.bank,
        cardClass: card.cardClass,
        level: card.level,
        expiry: card.expiry,
        country: card.country,
        countryCode: card.countryCode,
        state: card.state,
        price: sanitizePrice(card.price)
    };
}

function cartResponseItems(store, userId) {
    const cardsById = new Map(readCardRecords().map((card) => [Number(card.id), card]));
    const ids = cartForUser(store, userId);
    const items = ids.map((id) => cardsById.get(id)).filter(Boolean);
    const subtotal = Number(items.reduce((sum, card) => sum + sanitizePrice(card.price), 0).toFixed(2));
    const discount = Number((subtotal * 0.03).toFixed(2));

    return {
        items: items.map(publicCartItem),
        subtotal,
        discount,
        total: Number((subtotal - discount).toFixed(2))
    };
}

async function handleDashboardCart(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);
    const store = readCarts();
    const ids = cartForUser(store, user.id);

    if (req.method === 'GET') {
        const summary = cartResponseItems(store, user.id);
        jsonResponse(res, 200, { ok: true, ...summary, walletBalance: userBalance(user) });
        return;
    }

    const body = await parseBody(req);
    const requestedIds = Array.isArray(body.cardIds) ? body.cardIds : [body.cardId];
    const cardIds = requestedIds.map((id) => Number(id)).filter((id) => Number.isInteger(id));
    const knownIds = new Set(readCardRecords().map((card) => Number(card.id)));

    if (req.method === 'POST') {
        if (!cardIds.length || cardIds.some((id) => !knownIds.has(id))) {
            sendError(res, 400, 'Invalid card selection');
            return;
        }

        store.carts[String(user.id)] = [...new Set([...ids, ...cardIds])];
        writeCarts(store);
        jsonResponse(res, 201, { ok: true, ...cartResponseItems(store, user.id), cartCount: store.carts[String(user.id)].length });
        return;
    }

    if (req.method === 'DELETE') {
        store.carts[String(user.id)] = ids.filter((id) => !cardIds.includes(id));
        writeCarts(store);
        jsonResponse(res, 200, { ok: true, ...cartResponseItems(store, user.id), cartCount: store.carts[String(user.id)].length });
    }
}

async function handleDashboardCheckout(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);
    const store = readCarts();
    const summary = cartResponseItems(store, user.id);
    const body = await parseBody(req);
    const requestedIds = Array.isArray(body.cardIds) ? body.cardIds : summary.items.map((item) => item.id);
    const selectedIds = [...new Set(requestedIds.map((id) => Number(id)).filter((id) => Number.isInteger(id)))];
    const cardsById = new Map(summary.items.map((item) => [item.id, item]));
    const selectedItems = selectedIds.map((id) => cardsById.get(id)).filter(Boolean);
    const subtotal = Number(selectedItems.reduce((sum, card) => sum + card.price, 0).toFixed(2));
    const discount = Number((subtotal * 0.03).toFixed(2));
    const total = Number((subtotal - discount).toFixed(2));

    if (!selectedItems.length) {
        sendError(res, 400, 'Select at least one item');
        return;
    }

    if (total > userBalance(user)) {
        sendError(res, 400, 'Order Failed: Insufficient wallet balance.');
        return;
    }

    const purchases = readPurchases();
    const now = new Date().toISOString();
    const orderReference = `ORDER-${Date.now()}`;
    selectedItems.forEach((item) => {
        purchases.purchases.push({
            id: purchases.nextId++,
            userId: user.id,
            username: user.username,
            itemId: item.id,
            itemName: `${item.type} listing from ${item.bank}`,
            reference: orderReference,
            category: 'Card Marketplace',
            status: 'Completed',
            amount: Number((item.price * (1 - 0.03)).toFixed(2)),
            createdAt: now,
            note: `${item.country}${item.state ? ` · ${item.state}` : ''}`
        });
    });
    writePurchases(purchases);

    const db = readDatabase();
    const storedUser = db.users.find((candidate) => candidate.id === user.id);
    storedUser.balance = Number((userBalance(storedUser) - total).toFixed(2));
    storedUser.purchaseHistory = Array.isArray(storedUser.purchaseHistory) ? storedUser.purchaseHistory : [];
    storedUser.purchaseHistory.push(...purchases.purchases.slice(-selectedItems.length).map((purchase) => purchase.id));
    storedUser.updatedAt = now;
    writeDatabase(db);

    store.carts[String(user.id)] = cartForUser(store, user.id).filter((id) => !selectedIds.includes(id));
    writeCarts(store);
    session.user = publicUser(storedUser);

    jsonResponse(res, 201, {
        ok: true,
        orderReference,
        purchases: purchases.purchases.slice(-selectedItems.length).map(publicPurchase),
        walletBalance: userBalance(storedUser),
        ...cartResponseItems(store, user.id)
    });
}

function handleDashboardDeposit(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);
    const deposits = readDeposits().deposits
        .filter((deposit) => deposit.userId === user.id)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

    jsonResponse(res, 200, {
        ok: true,
        settings: readDepositSettings(),
        deposits: deposits.map(publicDeposit),
        walletBalance: userBalance(user)
    });
}

async function handleDashboardVirtualCards(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);
    const store = readVirtualCards();

    if (req.method === 'GET') {
        const cards = store.cards
            .filter((card) => card.userId === user.id)
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

        jsonResponse(res, 200, {
            ok: true,
            cards: cards.map(publicVirtualCard),
            walletBalance: userBalance(user)
        });
        return;
    }

    const body = await parseBody(req);
    const type = sanitizeChoice(body.type, new Set(['VISA', 'MASTERCARD']), 'VISA');
    const name = sanitizeText(body.name, '', 60);
    const amount = Number(Number(body.amount).toFixed(2));

    if (!name) {
        sendError(res, 400, 'Card name is required');
        return;
    }

    if (!Number.isFinite(amount) || amount < 5 || amount > 1000) {
        sendError(res, 400, 'Amount must be between $5.00 and $1,000.00');
        return;
    }

    if (amount > userBalance(user)) {
        sendError(res, 400, 'Insufficient wallet balance');
        return;
    }

    const card = {
        id: store.nextId,
        userId: user.id,
        type,
        number: '',
        expiry: '',
        cvv: '',
        name,
        amount,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    store.nextId += 1;
    store.cards.push(card);
    writeVirtualCards(store);

    const db = readDatabase();
    const storedUser = db.users.find((candidate) => candidate.id === user.id);
    storedUser.balance = Number((userBalance(storedUser) - amount).toFixed(2));
    storedUser.updatedAt = new Date().toISOString();
    writeDatabase(db);

    jsonResponse(res, 201, {
        ok: true,
        card: privateVirtualCard(card),
        walletBalance: userBalance(storedUser)
    });
}

function handleRevealVirtualCard(req, res, cardId) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const card = readVirtualCards().cards.find((entry) => entry.id === Number(cardId) && entry.userId === session.user.id);

    if (!card) {
        sendError(res, 404, 'Virtual card not found');
        return;
    }

    if (card.status !== 'Active') {
        jsonResponse(res, 200, { ok: true, card: publicVirtualCard(card) });
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        card: privateVirtualCard(card)
    });
}

async function handleDashboardPurchases(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);

    if (!user) {
        sendError(res, 401, 'No active user');
        return;
    }

    const store = readPurchases();

    if (req.method === 'GET') {
        const purchases = store.purchases
            .filter((purchase) => purchase.userId === user.id)
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

        jsonResponse(res, 200, {
            ok: true,
            purchases: purchases.map(publicPurchase),
            walletBalance: userBalance(user)
        });
        return;
    }

    const body = await parseBody(req);
    const listingId = Number(body.cardId || body.itemId);
    const listing = readCardRecords().find((card) => Number(card.id) === listingId);

    if (!listing) {
        sendError(res, 404, 'Listing not found');
        return;
    }

    const amount = sanitizePrice(listing.price);

    if (amount <= 0) {
        sendError(res, 400, 'Listing is not available for purchase');
        return;
    }

    if (amount > userBalance(user)) {
        sendError(res, 400, 'Insufficient wallet balance');
        return;
    }

    const now = new Date().toISOString();
    const purchase = {
        id: store.nextId,
        userId: user.id,
        username: user.username,
        itemId: listing.id,
        itemName: `${listing.type} listing from ${listing.bank}`,
        reference: `DEMO-${String(listing.id).padStart(5, '0')}`,
        category: 'Card Listing',
        status: 'Completed',
        amount,
        createdAt: now,
        note: `${listing.country}${listing.state ? ` · ${listing.state}` : ''}`
    };

    store.nextId += 1;
    store.purchases.push(purchase);
    writePurchases(store);

    const db = readDatabase();
    const storedUser = db.users.find((candidate) => candidate.id === user.id);

    if (storedUser) {
        storedUser.balance = Number((userBalance(storedUser) - amount).toFixed(2));
        storedUser.purchaseHistory = Array.isArray(storedUser.purchaseHistory) ? storedUser.purchaseHistory : [];
        storedUser.purchaseHistory.push(purchase.id);
        storedUser.updatedAt = now;
        writeDatabase(db);
        session.user = publicUser(storedUser);
    }

    jsonResponse(res, 201, {
        ok: true,
        purchase: publicPurchase(purchase),
        walletBalance: userBalance(storedUser || user)
    });
}

async function handleDashboardSsnPurchase(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const user = currentUserForSession(session);
    const body = await parseBody(req);
    const listingId = Number(body.ssnId || body.itemId);
    const store = readSsnStore();
    const listingIndex = store.records.findIndex((record) => Number(record.id) === listingId && record.active !== false);

    if (listingIndex < 0) {
        sendError(res, 404, 'SSN listing is no longer available');
        return;
    }

    const listing = sanitizeSsnRecord(store.records[listingIndex], listingId);
    const amount = listing.price;

    if (amount > userBalance(user)) {
        sendError(res, 400, 'Order Failed: Insufficient wallet balance. Please add funds.');
        return;
    }

    const now = new Date().toISOString();
    const purchase = {
        id: readPurchases().nextId,
        userId: user.id,
        username: user.username,
        itemId: listing.id,
        itemName: `${listing.firstName} ${listing.lastName} SSN record`,
        reference: `SSN-${String(listing.id).padStart(6, '0')}`,
        category: 'SSN',
        status: 'Completed',
        amount,
        createdAt: now,
        note: `${listing.city}, ${listing.state}`,
        ssnDetails: {
            firstName: listing.firstName,
            lastName: listing.lastName,
            ssnNumber: listing.ssnNumber,
            dob: listing.dob,
            city: listing.city,
            state: listing.state,
            zip: listing.zip
        }
    };
    const purchases = readPurchases();
    purchase.id = purchases.nextId++;
    purchases.purchases.push(purchase);
    store.records[listingIndex] = { ...listing, active: false };

    const db = readDatabase();
    const storedUser = db.users.find((candidate) => candidate.id === user.id);
    storedUser.balance = Number((userBalance(storedUser) - amount).toFixed(2));
    storedUser.purchaseHistory = Array.isArray(storedUser.purchaseHistory) ? storedUser.purchaseHistory : [];
    storedUser.purchaseHistory.push(purchase.id);
    storedUser.updatedAt = now;
    writeSsnStore(store);
    writePurchases(purchases);
    writeDatabase(db);
    session.user = publicUser(storedUser);

    jsonResponse(res, 201, {
        ok: true,
        purchase: publicPurchase(purchase),
        walletBalance: userBalance(storedUser)
    });
}

async function handleCreateDeposit(req, res) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    const body = await parseBody(req);
    const settings = readDepositSettings();
    const method = settings.methods.find((candidate) => candidate.id === body.methodId);
    const amount = sanitizePrice(body.amount);

    if (!method) {
        sendError(res, 400, 'Select a valid payment method');
        return;
    }

    if (amount < settings.minimumAmount) {
        sendError(res, 400, `Minimum deposit is $${settings.minimumAmount.toFixed(2)}`);
        return;
    }

    const user = currentUserForSession(session);
    const store = readDeposits();
    const deposit = {
        id: store.nextId,
        userId: user.id,
        username: user.username,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        method: method.name,
        amount,
        bonus: 0,
        value: amount,
        wallet: method.address,
        txid: sanitizeText(body.txid, '', 180),
        screenshot: sanitizeText(body.screenshot, '', 500000),
        note: ''
    };

    store.nextId += 1;
    store.deposits.push(deposit);
    writeDeposits(store);
    jsonResponse(res, 201, { ok: true, deposit: publicDeposit(deposit) });
}

function handleAdminDepositSettings(req, res) {
    if (req.method === 'GET') {
        jsonResponse(res, 200, { ok: true, settings: readDepositSettings() });
        return;
    }

    parseBody(req).then((body) => {
        if (!requireMasterAdminKey(body, res)) {
            return;
        }
        jsonResponse(res, 200, { ok: true, settings: writeDepositSettings(body) });
    }).catch(() => sendError(res, 400, 'Invalid settings payload'));
}

async function handleAdminPaymentUnlock(req, res) {
    const body = await parseBody(req);

    if (!requireMasterAdminKey(body, res)) {
        return;
    }

    jsonResponse(res, 200, { ok: true, message: 'Payment settings unlocked' });
}

function handleAdminDeposits(req, res) {
    const store = readDeposits();

    if (req.method === 'GET') {
        jsonResponse(res, 200, {
            ok: true,
            deposits: store.deposits.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).map(publicDeposit)
        });
        return;
    }

    const match = req.url.match(/^\/api\/admin\/deposits\/(\d+)\/(approve|reject)$/);

    if (!match) {
        sendError(res, 404, 'Deposit action not found');
        return;
    }

    parseBody(req).then((body) => {
        const deposit = store.deposits.find((candidate) => candidate.id === Number(match[1]));

        if (!deposit) {
            sendError(res, 404, 'Deposit not found');
            return;
        }

        if (deposit.status !== 'Pending') {
            sendError(res, 409, 'Deposit has already been reviewed');
            return;
        }

        deposit.status = match[2] === 'approve' ? 'Approved' : 'Rejected';
        deposit.note = sanitizeText(body.note, '', 240);

        if (deposit.status === 'Approved') {
            deposit.bonus = Number(bonusForAmount(deposit.amount).toFixed(2));
            deposit.value = Number((deposit.amount + deposit.bonus).toFixed(2));
            const db = readDatabase();
            const user = db.users.find((candidate) => candidate.id === deposit.userId);

            if (user) {
                user.balance = Number((userBalance(user) + deposit.value).toFixed(2));
                user.depositHistory = Array.isArray(user.depositHistory) ? user.depositHistory : [];
                user.depositHistory.push(deposit.id);
                user.updatedAt = new Date().toISOString();
                writeDatabase(db);
            }
        }

        writeDeposits(store);
        jsonResponse(res, 200, { ok: true, deposit: publicDeposit(deposit) });
    }).catch(() => sendError(res, 400, 'Invalid deposit action payload'));
}

function handleDashboardCards(req, res, url) {
    const session = getSessionFromRequest(req);

    if (!session) {
        sendError(res, 401, 'No active session');
        return;
    }

    jsonResponse(res, 200, {
        ok: true,
        session,
        ...queryDashboardCards(url)
    });
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    return {
        '.css': 'text/css; charset=utf-8',
        '.gif': 'image/gif',
        '.html': 'text/html; charset=utf-8',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.js': 'text/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
    }[ext] || 'application/octet-stream';
}

function serveStatic(req, res, pathname) {
    if (REDIRECT_ROUTES.has(pathname)) {
        res.writeHead(302, {
            Location: REDIRECT_ROUTES.get(pathname),
            'Cache-Control': 'no-store'
        });
        res.end();
        return;
    }

    let routePath = PUBLIC_ROUTES.get(pathname) || pathname;

    if (routePath === '/') {
        routePath = '/index.html';
    }

    const decodedPath = decodeURIComponent(routePath);
    const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(ROOT, safePath);

    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8'
            });
            res.end('Not found');
            return;
        }

        res.writeHead(200, {
            'Content-Type': getContentType(filePath),
            'Cache-Control': 'no-store, no-cache, must-revalidate'
        });
        res.end(data);
    });
}

async function handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const deleteCardMatch = url.pathname.match(/^\/api\/admin\/cards\/(\d+)$/);
    const deleteSsnMatch = url.pathname.match(/^\/api\/admin\/ssn\/(\d+)$/);

    try {
        if (req.method === 'GET' && url.pathname === '/api/health') {
            jsonResponse(res, 200, {
                ok: true
            });
            return;
        }

        const supportTicketPageMatch = url.pathname.match(/^\/support\/tickets\/(\d+)$/);
        if (req.method === 'GET' && supportTicketPageMatch) {
            res.writeHead(302, { Location: `/dashboard/#tickets/${supportTicketPageMatch[1]}` });
            res.end();
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/captcha') {
            handleCaptcha(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/login') {
            await handleAdminLogin(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/verify-2fa') {
            await handleAdminTwoFactorVerification(req, res);
            return;
        }

        if (url.pathname.startsWith('/api/admin/2fa') && !requireAdminSession(req, res)) {
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/admin/2fa') {
            handleAdminTwoFactorSettings(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/2fa/setup') {
            await handleAdminTwoFactorSetup(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/2fa/enable') {
            await handleAdminTwoFactorEnable(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/2fa/disable') {
            await handleAdminTwoFactorDisable(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/admin/session') {
            handleAdminSession(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT') && url.pathname === '/api/admin/announcement-alert') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleAnnouncementAlertSettings(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
            handleAdminLogout(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/users') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleUsers(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/session') {
            handleSession(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/announcement-alert') {
            handleAnnouncementAlert(req, res);
            return;
        }
        if (req.method === 'POST' && url.pathname === '/api/user/update-profile') {
            await handleUpdateProfile(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/dashboard/news') {
            handleDashboardNews(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && (url.pathname === '/api/tickets' || url.pathname === '/api/tickets/create' || /^\/api\/tickets\/\d+(?:\/reply)?$/.test(url.pathname))) {
            await handleUserTickets(req, res, url);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST' || req.method === 'PATCH') && (url.pathname === '/api/admin/tickets' || /^\/api\/admin\/tickets\/\d+(?:\/(?:reply|status))?$/.test(url.pathname))) {
            await handleAdminTickets(req, res, url);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') && (url.pathname === '/api/admin/virtual-cards' || /^\/api\/admin\/virtual-cards\/\d+(?:\/approve)?$/.test(url.pathname))) {
            await handleAdminVirtualCards(req, res, url);
            return;
        }

        if (req.method === 'PUT' && /^\/api\/admin\/cards\/\d+$/.test(url.pathname)) {
            await handleAdminVirtualCards(req, res, url);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && url.pathname === '/api/settings/sub-price') {
            await handleSubPriceSettings(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/dashboard/sub-charge') {
            await handleDashboardChecker(req, res, readSubSettings().price);
            return;
        }

        if (req.method === 'POST' && (url.pathname === '/api/dashboard/checker' || url.pathname === '/api/checker/charge')) {
            await handleDashboardChecker(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/dashboard/cards') {
            handleDashboardCards(req, res, url);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/dashboard/ssn') {
            handleDashboardSsn(req, res, url);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/dashboard/ssn/purchase') {
            await handleDashboardSsnPurchase(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') && url.pathname === '/api/dashboard/cart') {
            await handleDashboardCart(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/dashboard/cart/checkout') {
            await handleDashboardCheckout(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && url.pathname === '/api/dashboard/purchases') {
            await handleDashboardPurchases(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/dashboard/deposit') {
            handleDashboardDeposit(req, res);
            return;
        }

        const revealVirtualCardMatch = url.pathname.match(/^\/api\/(?:dashboard\/)?virtual-cards\/(\d+)\/reveal$/);
        if (req.method === 'GET' && revealVirtualCardMatch) {
            handleRevealVirtualCard(req, res, revealVirtualCardMatch[1]);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && (url.pathname === '/api/dashboard/virtual-cards' || url.pathname === '/api/virtual-cards')) {
            await handleDashboardVirtualCards(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/dashboard/deposits') {
            await handleCreateDeposit(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT') && url.pathname === '/api/admin/ticker-settings') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleTickerSettings(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT') && url.pathname === '/api/admin/checker-settings') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleCheckerSettings(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT') && url.pathname === '/api/admin/deposit-settings') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleAdminDepositSettings(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/payment/unlock') {
            if (!requireAdminSession(req, res)) return;
            await handleAdminPaymentUnlock(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && (url.pathname === '/api/admin/deposits' || /^\/api\/admin\/deposits\/\d+\/(approve|reject)$/.test(url.pathname))) {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleAdminDeposits(req, res);
            return;
        }

        if ((req.method === 'GET' || req.method === 'PUT') && (url.pathname === '/api/admin/purchases' || /^\/api\/admin\/purchases\/\d+$/.test(url.pathname))) {
            await handleAdminPurchases(req, res, url);
            return;
        }

        if ((req.method === 'GET' || req.method === 'POST') && url.pathname === '/api/admin/cards') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleAdminCards(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/cards/bulk') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleBulkAdminCards(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/admin/ssn/bulk') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            await handleBulkAdminSsn(req, res);
            return;
        }

        if (req.method === 'GET' && url.pathname === '/api/admin/ssn') {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleAdminSsn(req, res, url);
            return;
        }

        if (req.method === 'DELETE' && deleteSsnMatch) {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleDeleteSsn(req, res, deleteSsnMatch[1]);
            return;
        }

        if (req.method === 'DELETE' && deleteCardMatch) {
            if (!requireAdminSession(req, res)) {
                return;
            }
            handleDeleteCard(req, res, deleteCardMatch[1]);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/register') {
            await handleRegister(req, res);
            return;
        }

        if (req.method === 'POST' && url.pathname === '/api/login') {
            await handleLogin(req, res);
            return;
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            sendError(res, 405, 'Method not allowed');
            return;
        }

        serveStatic(req, res, url.pathname);
    } catch (error) {
        sendError(res, 500, error.message || 'Server error');
    }
}

ensureDatabase();
ensureTickerSettings();
ensureCardRecords();
migrateCardRecords();

http.createServer(handleRequest).listen(PORT, HOST, () => {
    console.log(`DashLite server running at http://${HOST}:${PORT}/`);
});
