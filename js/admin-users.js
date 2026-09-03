(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const sessionTimeout = window.AdminSessionTimeout;
    sessionTimeout?.startAutoTimeout();
    const ADMIN_ROUTE_PATHS = {
        dashboard: '/admin',
        users: '/admin/users',
        cards: '/admin/cards',
        purchases: '/admin/purchases',
        checker: '/admin/checker',
        tickets: '/admin/tickets',
        ssn: '/admin',
        payment: '/admin/payment',
        requests: '/admin/payment',
        profile: '/admin/profile',
        settings: '/admin/settings'
    };
    const dashboardSection = document.getElementById('dashboardSection');
    const section = document.getElementById('usersSection');
    const tableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('usersEmptyState');
    const usersCount = document.getElementById('usersCount');
    const refreshButton = document.getElementById('refreshUsers');
    const refreshDashboardSettings = document.getElementById('refreshDashboardSettings');
    const usersNavLink = document.getElementById('usersNavLink');
    const cardsNavLink = document.getElementById('cardsNavLink');
    const purchasesNavLink = document.getElementById('purchasesNavLink');
    const checkerNavLink = document.getElementById('checkerNavLink');
    const ssnNavLink = document.getElementById('ssnNavLink');
    const dashboardNavLink = document.getElementById('dashboardNavLink');
    const cardsSection = document.getElementById('cardsSection');
    const checkerSection = document.getElementById('checkerSection');
    const profileSection = document.getElementById('profileSection');
    const settingsSection = document.getElementById('settingsSection');
    const paymentSection = document.getElementById('paymentSection');
    const requestsSection = document.getElementById('requestsSection');
    const paymentNavLink = document.getElementById('paymentNavLink');
    const depositRequestsNavLink = document.getElementById('depositRequestsNavLink');
    const paymentSettingsForm = document.getElementById('paymentSettingsForm');
    const adminPaymentMethods = document.getElementById('adminPaymentMethods');
    const minimumDepositInput = document.getElementById('minimumDepositInput');
    const paymentWindowInput = document.getElementById('paymentWindowInput');
    const paymentSettingsStatus = document.getElementById('paymentSettingsStatus');
    const addPaymentMethod = document.getElementById('addPaymentMethod');
    const paymentMasterAdminKey = document.getElementById('paymentMasterAdminKey');
    const unlockPaymentSettings = document.getElementById('unlockPaymentSettings');
    let paymentSettingsUnlocked = false;
    const adminDepositBody = document.getElementById('adminDepositBody');
    const refreshDeposits = document.getElementById('refreshDeposits');
    const adminTopbarName = document.getElementById('adminTopbarName');
    const adminProfileUsername = document.getElementById('adminProfileUsername');
    const adminProfileRole = document.getElementById('adminProfileRole');
    const adminProfileIssuedAt = document.getElementById('adminProfileIssuedAt');
    const adminSettingsRoute = document.getElementById('adminSettingsRoute');
    const adminSettingsSession = document.getElementById('adminSettingsSession');
    const twoFactorSettingsForm = document.getElementById('twoFactorSettingsForm');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    const twoFactorSetup = document.getElementById('twoFactorSetup');
    const twoFactorQr = document.getElementById('twoFactorQr');
    const twoFactorSecret = document.getElementById('twoFactorSecret');
    const twoFactorCode = document.getElementById('twoFactorCode');
    const twoFactorMasterAdminKey = document.getElementById('twoFactorMasterAdminKey');
    const twoFactorStatus = document.getElementById('twoFactorStatus');
    let pendingTwoFactorSecret = '';
    let currentTwoFactorEnabled = false;
    const onlineUsersForm = document.getElementById('onlineUsersForm');
    const onlineCountInput = document.getElementById('adminOnlineCountInput');
    const onlinePreview = document.getElementById('adminOnlinePreview');
    const onlineStatus = document.getElementById('adminOnlineStatus');
    const saveOnlineButton = document.getElementById('saveOnlineUsers');
    const dashboardContentForm = document.getElementById('dashboardContentForm');
    const dashboardContentStatus = document.getElementById('dashboardContentStatus');
    const attentionTitleInput = document.getElementById('attentionTitleInput');
    const attentionBodyInput = document.getElementById('attentionBodyInput');
    const attentionLinksInput = document.getElementById('attentionLinksInput');
    const noticeTitleInput = document.getElementById('noticeTitleInput');
    const noticeParagraphsInput = document.getElementById('noticeParagraphsInput');
    const virtualCardNoteInput = document.getElementById('virtualCardNoteInput');
    const telegramUrlInput = document.getElementById('telegramUrlInput');
    const reloadDashboardContent = document.getElementById('reloadDashboardContent');
    const saveDashboardContent = document.getElementById('saveDashboardContent');
    const announcementSettingsForm = document.getElementById('announcementSettingsForm');
    const announcementEnabledInput = document.getElementById('announcementEnabledInput');
    const announcementTitleInput = document.getElementById('announcementTitleInput');
    const announcementMessageInput = document.getElementById('announcementMessageInput');
    const announcementActionTextInput = document.getElementById('announcementActionTextInput');
    const announcementActionLinkInput = document.getElementById('announcementActionLinkInput');
    const announcementSecondaryTextInput = document.getElementById('announcementSecondaryTextInput');
    const announcementSettingsStatus = document.getElementById('announcementSettingsStatus');
    const adminCardForm = document.getElementById('adminCardForm');
    const adminCardsStatus = document.getElementById('adminCardsStatus');
    const adminCardsCount = document.getElementById('adminCardsCount');
    const adminCardsTableBody = document.getElementById('adminCardsTableBody');
    const adminCardsEmptyState = document.getElementById('adminCardsEmptyState');
    const bulkCardQuantity = document.getElementById('bulkCardQuantity');
    const generateBulkCardsButton = document.getElementById('generateBulkCards');
    const adminCardType = document.getElementById('adminCardType');
    const adminCardCountry = document.getElementById('adminCardCountry');
    const adminCardLogoPreview = document.getElementById('adminCardLogoPreview');
    const clearAdminCardForm = document.getElementById('clearAdminCardForm');
    const purchasesSection = document.getElementById('purchasesSection');
    const adminPurchasesTableBody = document.getElementById('adminPurchasesTableBody');
    const refreshAdminPurchases = document.getElementById('refreshAdminPurchases');
    const purchaseEditModal = document.getElementById('purchaseEditModal');
    const purchaseEditForm = document.getElementById('purchaseEditForm');
    const purchaseEditStatus = document.getElementById('purchaseEditStatus');
    let selectedAdminPurchase = null;
    const adminVirtualCardsCount = document.getElementById('adminVirtualCardsCount');
    const adminVirtualCardsTableBody = document.getElementById('adminVirtualCardsTableBody');
    const virtualCardEditModal = document.getElementById('virtualCardEditModal');
    const virtualCardEditForm = document.getElementById('virtualCardEditForm');
    const virtualCardEditStatus = document.getElementById('virtualCardEditStatus');
    const virtualCardEditTitle = document.getElementById('virtualCardEditTitle');
    const virtualCardApprovalSummary = document.getElementById('virtualCardApprovalSummary');
    const editVirtualCardStatusField = document.getElementById('editVirtualCardStatusField');
    const virtualCardEditSubmit = document.getElementById('virtualCardEditSubmit');
    const editVirtualCardName = document.getElementById('editVirtualCardName');
    const editVirtualCardNumber = document.getElementById('editVirtualCardNumber');
    const editVirtualCardExpiry = document.getElementById('editVirtualCardExpiry');
    const editVirtualCardCvv = document.getElementById('editVirtualCardCvv');
    const editVirtualCardStatus = document.getElementById('editVirtualCardStatus');
    let selectedVirtualCardId = null;
    let virtualCardApprovalMode = false;
    const ssnSection = document.getElementById('ssnSection');
    const generateBulkSsn = document.getElementById('generateBulkSsn');
    const adminSsnStatus = document.getElementById('adminSsnStatus');
    const adminSsnCount = document.getElementById('adminSsnCount');
    const adminSsnFilterForm = document.getElementById('adminSsnFilterForm');
    const adminSsnTableBody = document.getElementById('adminSsnTableBody');
    const adminSsnPagination = document.getElementById('adminSsnPagination');
    const checkerSettingsForm = document.getElementById('checkerSettingsForm');
    const checkerPriceInput = document.getElementById('checkerPriceInput');
    const checkerSettingsStatus = document.getElementById('checkerSettingsStatus');
    const ticketsSection = document.getElementById('ticketsSection');
    const ticketsNavLink = document.getElementById('ticketsNavLink');
    const adminTicketsStatus = document.getElementById('adminTicketsStatus');
    const adminTicketsTableBody = document.getElementById('adminTicketsTableBody');
    const adminTicketDetail = document.getElementById('adminTicketDetail');
    const adminTicketDetailTitle = document.getElementById('adminTicketDetailTitle');
    const adminTicketDetailMeta = document.getElementById('adminTicketDetailMeta');
    const adminTicketThread = document.getElementById('adminTicketThread');
    const adminTicketStatusInput = document.getElementById('adminTicketStatusInput');
    const adminTicketSaveStatus = document.getElementById('adminTicketSaveStatus');
    const adminTicketReplyForm = document.getElementById('adminTicketReplyForm');
    const adminTicketReplyInput = document.getElementById('adminTicketReplyInput');
    let selectedAdminTicketId = null;
    let selectedAdminTicketStatus = 'All';
    const subPriceSettingsForm = document.getElementById('subPriceSettingsForm');
    const subPriceInput = document.getElementById('subPriceInput');
    const subPriceSettingsStatus = document.getElementById('subPriceSettingsStatus');
    let adminSsnPage = 1;

    function getAdminSession() {
        if (sessionTimeout) {
            return sessionTimeout.getSession();
        }

        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
        } catch (error) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
    }

    function authHeaders() {
        const session = getAdminSession();

        return session?.token
            ? { Accept: 'application/json', Authorization: `Bearer ${session.token}` }
            : { Accept: 'application/json' };
    }

    function redirectToAdminLogin() {
        if (sessionTimeout) {
            sessionTimeout.redirectToLogin();
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/admin/login');
    }

    function adminSessionOrRedirect() {
        const session = getAdminSession();

        if (!session?.token) {
            redirectToAdminLogin();
            return null;
        }

        return session;
    }

    async function adminJson(response, fallbackMessage) {
        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (response.status === 401) {
            if (sessionTimeout) {
                sessionTimeout.handleUnauthorized();
            } else {
                redirectToAdminLogin();
            }
            throw new Error('Admin authentication required');
        }

        if (!response.ok || data?.ok === false) {
            throw new Error(data?.error || fallbackMessage);
        }

        return data;
    }

    async function destroyAdminSession() {
        if (sessionTimeout) {
            await sessionTimeout.logout('/api/admin/logout');
            return;
        }

        const session = getAdminSession();

        if (session?.token) {
            try {
                await fetch('/api/admin/logout', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${session.token}`
                    }
                });
            } catch (error) {
                // The browser will still clear local state below.
            }
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/admin/login');
    }

    function normalizeAdminPath(pathname = window.location.pathname) {
        return pathname.replace(/\/+$/, '') || '/admin';
    }

    function viewFromPath() {
        const legacyHash = window.location.hash.replace('#', '').toLowerCase();

        if (legacyHash === 'requests') {
            return 'requests';
        }

        if (legacyHash === 'users' || legacyHash === 'cards') {
            window.history.replaceState({}, '', ADMIN_ROUTE_PATHS[legacyHash]);
            return legacyHash;
        }

        if (legacyHash === 'ssn') {
            return 'ssn';
        }

        const pathname = normalizeAdminPath();

        if (pathname === '/admin/dashboard') {
            return 'dashboard';
        }

        return Object.entries(ADMIN_ROUTE_PATHS).find(([, routePath]) => routePath === pathname)?.[0] || 'dashboard';
    }

    function routeToView(view, replace = false) {
        const routePath = ADMIN_ROUTE_PATHS[view] || ADMIN_ROUTE_PATHS.dashboard;
        const hash = ['requests', 'ssn'].includes(view) ? `#${view}` : '';

        if (normalizeAdminPath() !== routePath || window.location.hash !== hash) {
            window.history[replace ? 'replaceState' : 'pushState']({}, '', `${routePath}${hash}`);
        }
    }

    if (!dashboardSection || !section || !tableBody || !usersCount || !refreshButton || !usersNavLink || !cardsNavLink || !cardsSection || !profileSection || !settingsSection || !ssnSection) {
        return;
    }

    const adminSession = adminSessionOrRedirect();

    if (!adminSession) {
        return;
    }

    const REGION_CODES = 'AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UM US UY UZ VU VE VN VG VI WF EH YE ZM ZW'.split(' ');

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function normalizeType(value) {
        return String(value || 'VISA').trim().toUpperCase();
    }

    function networkClass(type) {
        return `admin-card-network-badge is-${normalizeType(type).toLowerCase().replace(/\s+/g, '-')}`;
    }

    function renderNetworkBadge(type) {
        const normalizedType = normalizeType(type);
        const logoFiles = {
            AMEX: 'amex.svg',
            DISCOVER: 'discover.svg',
            JCB: 'jcb.svg',
            MAESTRO: 'maestro.svg',
            MASTERCARD: 'mastercard.svg',
            UNIONPAY: 'unionpay.svg',
            VISA: 'visa.svg'
        };
        const logoFile = logoFiles[normalizedType];
        const label = normalizedType === 'MASTERCARD' ? 'Mastercard' : normalizedType;
        const content = logoFile
            ? `<img src="/images/card-brands/${logoFile}" alt="${escapeHtml(label)}" width="74" height="22" loading="lazy">`
            : escapeHtml(label);

        return `<span class="${networkClass(type)}">${content}</span>`;
    }

    function renderCountryBadge(countryCode) {
        const code = String(countryCode || '').toUpperCase();
        const flag = code
            ? `<img src="https://flagcdn.com/w40/${escapeHtml(code.toLowerCase())}.png" alt="" width="20" height="15" loading="lazy">`
            : '<span class="admin-card-country-fallback" aria-hidden="true"></span>';

        return `<span class="admin-card-country-badge">${flag}<span>${escapeHtml(code || '--')}</span></span>`;
    }

    function populateAdminCountries() {
        if (!adminCardCountry) {
            return;
        }

        const displayNames = typeof Intl.DisplayNames === 'function'
            ? new Intl.DisplayNames(['en'], { type: 'region' })
            : null;
        const countries = REGION_CODES
            .map((code) => ({
                code,
                name: displayNames?.of(code) || code
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        adminCardCountry.innerHTML = countries.map((country) => (
            `<option value="${escapeHtml(country.name)}" data-country-code="${escapeHtml(country.code)}">${escapeHtml(country.name)}</option>`
        )).join('');

        const defaultOption = [...adminCardCountry.options].find((option) => option.dataset.countryCode === 'US');
        adminCardCountry.value = defaultOption?.value || adminCardCountry.options[0]?.value || '';
    }

    function updateLogoPreview() {
        if (!adminCardLogoPreview || !adminCardType) {
            return;
        }

        const type = normalizeType(adminCardType.value);
        const logoFiles = {
            AMEX: 'amex.svg',
            DISCOVER: 'discover.svg',
            JCB: 'jcb.svg',
            MAESTRO: 'maestro.svg',
            MASTERCARD: 'mastercard.svg',
            UNIONPAY: 'unionpay.svg',
            VISA: 'visa.svg'
        };
        const logoFile = logoFiles[type];

        adminCardLogoPreview.className = `admin-card-logo-preview is-${type.toLowerCase().replace(/\s+/g, '-')}`;
        adminCardLogoPreview.innerHTML = logoFile
            ? `<img src="/images/card-brands/${logoFile}" alt="${escapeHtml(type)}" width="74" height="22">`
            : escapeHtml(type);
    }

    function cardFormPayload() {
        const selectedCountry = adminCardCountry?.selectedOptions?.[0];
        const formData = new FormData(adminCardForm);

        return {
            type: formData.get('type'),
            bin: formData.get('bin'),
            bank: formData.get('bank'),
            cardClass: formData.get('cardClass'),
            level: formData.get('level'),
            expiry: formData.get('expiry'),
            country: formData.get('country'),
            countryCode: selectedCountry?.dataset.countryCode || '',
            state: formData.get('state'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            database: formData.get('database'),
            ssn: formData.get('ssn'),
            dob: formData.get('dob'),
            vendor: formData.get('vendor'),
            price: formData.get('price')
        };
    }

    function formatDate(value) {
        if (!value) {
            return 'Never';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return 'Invalid date';
        }

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    }

    function setLoading() {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-5">Loading users...</td></tr>';
        emptyState.hidden = true;
    }

    function setError(message) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-5">${escapeHtml(message)}</td></tr>`;
        usersCount.textContent = '0 users';
        emptyState.hidden = true;
    }

    function setOnlineStatus(message, type = '') {
        if (!onlineStatus) {
            return;
        }

        onlineStatus.textContent = message;
        onlineStatus.classList.toggle('is-success', type === 'success');
        onlineStatus.classList.toggle('is-error', type === 'error');
    }

    function setContentStatus(message, type = '') {
        if (!dashboardContentStatus) {
            return;
        }

        dashboardContentStatus.textContent = message;
        dashboardContentStatus.classList.toggle('is-success', type === 'success');
        dashboardContentStatus.classList.toggle('is-error', type === 'error');
    }

    function setTwoFactorStatus(message, type = '') {
        if (!twoFactorStatus) return;
        twoFactorStatus.textContent = message;
        twoFactorStatus.classList.toggle('text-success', type === 'success');
        twoFactorStatus.classList.toggle('text-danger', type === 'error');
    }

    async function loadTwoFactorSettings() {
        try {
            const data = await adminJson(await fetch('/api/admin/2fa', { headers: authHeaders() }), 'Unable to load 2FA settings');
            currentTwoFactorEnabled = Boolean(data.is_2fa_enabled);
            twoFactorToggle.checked = currentTwoFactorEnabled;
            twoFactorSetup.hidden = data.is_2fa_enabled;
            setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', data.is_2fa_enabled ? 'success' : '');
        } catch (error) {
            if (error.message !== 'Admin authentication required') setTwoFactorStatus(error.message, 'error');
        }
    }

    async function prepareTwoFactorSetup() {
        if (!twoFactorMasterAdminKey.value.trim()) {
            throw new Error('Master Admin Key is required.');
        }
        const data = await adminJson(await fetch('/api/admin/2fa/setup', {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ masterAdminKey: twoFactorMasterAdminKey.value.trim() })
        }), 'Unable to prepare 2FA');
        pendingTwoFactorSecret = data.secret;
        twoFactorSecret.textContent = data.secret;
        twoFactorQr.src = data.qrUrl;
        twoFactorSetup.hidden = false;
        setTwoFactorStatus('Scan the QR code, then enter the 6-digit code.');
    }

    async function saveTwoFactorSettings(event) {
        event.preventDefault();
        try {
            if (twoFactorToggle.checked) {
                if (!pendingTwoFactorSecret) await prepareTwoFactorSetup();
                const response = await fetch('/api/admin/2fa/enable', {
                    method: 'POST',
                    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ secret: pendingTwoFactorSecret, code: twoFactorCode.value.trim(), masterAdminKey: twoFactorMasterAdminKey.value.trim() })
                });
                const data = await adminJson(response, 'Unable to enable 2FA');
                twoFactorSetup.hidden = true;
                twoFactorCode.value = '';
                pendingTwoFactorSecret = '';
                setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', 'success');
            } else {
                const response = await fetch('/api/admin/2fa/disable', {
                    method: 'POST',
                    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: twoFactorCode.value.trim(), masterAdminKey: twoFactorMasterAdminKey.value.trim() })
                });
                const data = await adminJson(response, 'Unable to disable 2FA');
                twoFactorCode.value = '';
                setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', 'success');
            }
        } catch (error) {
            setTwoFactorStatus(error.message || 'Unable to update 2FA', 'error');
        }
    }

    function setCardsStatus(message, type = '') {
        if (!adminCardsStatus) {
            return;
        }

        adminCardsStatus.textContent = message;
        adminCardsStatus.classList.toggle('is-success', type === 'success');
        adminCardsStatus.classList.toggle('is-error', type === 'error');
    }

    function normalizeOnlineCount(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return null;
        }

        return Math.min(100000, Math.max(0, Math.round(number)));
    }

    function renderOnlinePreview(value) {
        const count = normalizeOnlineCount(value) ?? 0;

        if (onlinePreview) {
            onlinePreview.textContent = `${count} Users Online`;
        }
    }

    function linksToTextarea(links) {
        return Array.isArray(links)
            ? links.map((link) => `${link.label || ''} | ${link.text || ''} | ${link.href || '#'} | ${link.tone || 'blue'}`).join('\n')
            : '';
    }

    function paragraphsToTextarea(paragraphs) {
        return Array.isArray(paragraphs) ? paragraphs.join('\n') : '';
    }

    function textareaToParagraphs(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
    }

    function textareaToLinks(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const [label, text = '', href = '', tone = 'blue'] = line.split('|').map((part) => part.trim());

                return {
                    label,
                    text: text || href || label,
                    href: href || text || '#',
                    tone: tone.toLowerCase() === 'red' ? 'red' : 'blue'
                };
            })
            .filter((link) => link.label && link.text);
    }

    function populateDashboardContent(content = {}, telegramUrl = '', virtualCardNote = '') {
        if (attentionTitleInput) {
            attentionTitleInput.value = content.attentionTitle || 'Attention';
        }

        if (attentionBodyInput) {
            attentionBodyInput.value = content.attentionBody || '';
        }

        if (attentionLinksInput) {
            attentionLinksInput.value = linksToTextarea(content.attentionLinks);
        }

        if (noticeTitleInput) {
            noticeTitleInput.value = content.noticeTitle || 'Important Notice';
        }

        if (noticeParagraphsInput) {
            noticeParagraphsInput.value = paragraphsToTextarea(content.noticeParagraphs);
        }
        if (virtualCardNoteInput) {
            virtualCardNoteInput.value = virtualCardNote || content.virtualCardNote || 'Your card details are generated securely for this account.';
        }
        if (telegramUrlInput) {
            telegramUrlInput.value = telegramUrl;
        }

        setContentStatus('Synced', 'success');
    }

    function collectDashboardContent() {
        return {
            attentionTitle: attentionTitleInput?.value.trim() || 'Attention',
            attentionBody: attentionBodyInput?.value.trim() || '',
            attentionLinks: textareaToLinks(attentionLinksInput),
            noticeTitle: noticeTitleInput?.value.trim() || 'Important Notice',
            noticeParagraphs: textareaToParagraphs(noticeParagraphsInput),
            virtualCardNote: virtualCardNoteInput?.value.trim() || 'Your card details are generated securely for this account.',
            telegramUrl: telegramUrlInput?.value.trim() || ''
        };
    }

    function renderCards(cards) {
        const records = Array.isArray(cards) ? cards : [];

        if (adminCardsCount) {
            adminCardsCount.textContent = `${records.length} ${records.length === 1 ? 'card' : 'cards'}`;
        }

        if (!adminCardsTableBody || !adminCardsEmptyState) {
            return;
        }

        if (!records.length) {
            adminCardsTableBody.innerHTML = '';
            adminCardsEmptyState.hidden = false;
            return;
        }

        adminCardsEmptyState.hidden = true;
        adminCardsTableBody.innerHTML = records.map((card) => `
            <tr>
                <td>${renderNetworkBadge(card.type)}</td>
                <td class="fw-semibold">${escapeHtml(card.bin)}</td>
                <td>${escapeHtml(card.bank)}</td>
                <td>${escapeHtml(card.cardClass)}</td>
                <td>${escapeHtml(card.level)}</td>
                <td>${escapeHtml(card.expiry)}</td>
                <td>${renderCountryBadge(card.countryCode)}</td>
                <td>${escapeHtml(card.state)}</td>
                <td>${escapeHtml(card.city)}</td>
                <td>${escapeHtml(card.zip)}</td>
                <td>${escapeHtml(card.database)}</td>
                <td>${escapeHtml(card.ssn)}</td>
                <td>${escapeHtml(card.dob)}</td>
                <td>${escapeHtml(card.vendor)}</td>
                <td>$${Number(card.price || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" type="button" data-delete-card="${escapeHtml(card.id)}">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async function loadCards() {
        if (!adminCardsTableBody) {
            return;
        }

        adminCardsTableBody.innerHTML = '<tr><td colspan="16" class="text-center text-muted py-5">Loading cards...</td></tr>';
        adminCardsEmptyState.hidden = true;
        setCardsStatus('Loading');

        try {
            const response = await fetch('/api/admin/cards', {
                headers: {
                    ...authHeaders()
                }
            });
            const data = await adminJson(response, 'Unable to load cards');

            renderCards(data.cards);
            setCardsStatus('Synced', 'success');
        } catch (error) {
            adminCardsTableBody.innerHTML = `<tr><td colspan="16" class="text-center text-danger py-5">${escapeHtml(error.message || 'Unable to load cards')}</td></tr>`;
            setCardsStatus(error.message || 'Offline', 'error');
        }
    }

    function setVirtualCardEditStatus(message, type = '') {
        if (!virtualCardEditStatus) {
            return;
        }

        virtualCardEditStatus.textContent = message;
        virtualCardEditStatus.className = `text-${type === 'error' ? 'danger' : 'muted'} small mt-3 mb-0`;
    }

    function renderVirtualCards(cards) {
        const records = Array.isArray(cards) ? cards : [];

        if (adminVirtualCardsCount) {
            adminVirtualCardsCount.textContent = `${records.length} ${records.length === 1 ? 'card' : 'cards'}`;
        }
        if (!adminVirtualCardsTableBody) {
            return;
        }
        if (!records.length) {
            adminVirtualCardsTableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-5">No virtual cards yet.</td></tr>';
            return;
        }

        adminVirtualCardsTableBody.innerHTML = records.map((card) => `
            <tr>
                <td>${escapeHtml(card.userId)} / ${escapeHtml(card.email || card.username)}</td>
                <td>${escapeHtml(card.type)}</td>
                <td>${escapeHtml(card.name)}</td>
                <td>${escapeHtml(card.number || '**** **** **** ****')}</td>
                <td>${escapeHtml(card.expiry || 'MM/YY')}</td>
                <td>${escapeHtml(card.cvv || '***')}</td>
                <td>$${Number(card.amount || 0).toFixed(2)}</td>
                <td><span class="badge bg-${card.status === 'Active' ? 'success' : card.status === 'Pending' ? 'warning text-dark' : 'secondary'}">${escapeHtml(card.status)}</span></td>
                <td class="d-flex gap-2">
                    ${card.status === 'Pending' ? `<button class="btn btn-sm btn-primary" type="button" data-approve-virtual-card="${escapeHtml(card.id)}">Approve Request</button>` : ''}
                    <button class="btn btn-sm btn-outline-primary" type="button" data-edit-virtual-card="${escapeHtml(card.id)}">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" type="button" data-delete-virtual-card="${escapeHtml(card.id)}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function openVirtualCardEditor(card) {
        virtualCardApprovalMode = false;
        selectedVirtualCardId = card.id;
        virtualCardEditTitle.textContent = 'Edit Virtual Card';
        virtualCardApprovalSummary.hidden = true;
        editVirtualCardStatusField.hidden = false;
        virtualCardEditSubmit.textContent = 'Save Changes';
        editVirtualCardName.value = card.name || '';
        editVirtualCardNumber.value = card.number || '';
        editVirtualCardExpiry.value = card.expiry || '';
        editVirtualCardCvv.value = card.cvv || '';
        editVirtualCardStatus.value = card.status || 'Active';
        setVirtualCardEditStatus('');
        bootstrap.Modal.getOrCreateInstance(virtualCardEditModal).show();
    }

    function openVirtualCardApproval(card) {
        virtualCardApprovalMode = true;
        selectedVirtualCardId = card.id;
        virtualCardEditTitle.textContent = 'Approve Virtual Card Request';
        virtualCardApprovalSummary.textContent = `${card.username || card.userId} requested a $${Number(card.amount || 0).toFixed(2)} virtual card.`;
        virtualCardApprovalSummary.hidden = false;
        editVirtualCardStatusField.hidden = true;
        virtualCardEditSubmit.textContent = 'Approve Request';
        editVirtualCardName.value = card.name || '';
        editVirtualCardNumber.value = '';
        editVirtualCardExpiry.value = '';
        editVirtualCardCvv.value = '';
        setVirtualCardEditStatus('');
        bootstrap.Modal.getOrCreateInstance(virtualCardEditModal).show();
    }

    async function loadVirtualCards() {
        if (!adminVirtualCardsTableBody) {
            return;
        }

        adminVirtualCardsTableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted py-5">Loading virtual cards...</td></tr>';

        try {
            const response = await fetch('/api/admin/virtual-cards', { headers: authHeaders() });
            const data = await adminJson(response, 'Unable to load virtual cards');
            renderVirtualCards(data.cards);
        } catch (error) {
            adminVirtualCardsTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-5">${escapeHtml(error.message || 'Unable to load virtual cards')}</td></tr>`;
        }
    }

    async function saveVirtualCard(event) {
        event.preventDefault();
        setVirtualCardEditStatus('Saving...');

        try {
            const response = await fetch(`/api/admin/${virtualCardApprovalMode ? 'virtual-cards' : 'cards'}/${selectedVirtualCardId}${virtualCardApprovalMode ? '/approve' : ''}`, {
                method: virtualCardApprovalMode ? 'POST' : 'PUT',
                headers: { ...authHeaders(), 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(Object.fromEntries(new FormData(virtualCardEditForm)))
            });
            const data = await adminJson(response, 'Unable to update virtual card');
            bootstrap.Modal.getOrCreateInstance(virtualCardEditModal).hide();
            setVirtualCardEditStatus('');
            await loadVirtualCards();
            return data.card;
        } catch (error) {
            setVirtualCardEditStatus(error.message || 'Unable to update virtual card', 'error');
            return null;
        }
    }

    async function deleteVirtualCard(cardId) {
        if (!window.confirm('Delete this virtual card?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/virtual-cards/${cardId}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            const data = await adminJson(response, 'Unable to delete virtual card');
            renderVirtualCards(data.cards);
        } catch (error) {
            setCardsStatus(error.message || 'Unable to delete virtual card', 'error');
        }
    }

    function renderAdminPurchases(purchases) {
        const records = Array.isArray(purchases) ? purchases : [];

        if (!adminPurchasesTableBody) {
            return;
        }
        if (!records.length) {
            adminPurchasesTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-5">No purchases found.</td></tr>';
            return;
        }

        adminPurchasesTableBody.innerHTML = records.map((purchase) => `
            <tr>
                <td>#${escapeHtml(purchase.id)}</td>
                <td>${escapeHtml(purchase.username || purchase.userId)}</td>
                <td>${escapeHtml(purchase.itemName)}</td>
                <td>${escapeHtml(purchase.category)}</td>
                <td>${escapeHtml(purchase.status)}</td>
                <td>$${Number(purchase.amount || 0).toFixed(2)}</td>
                <td>${escapeHtml(purchase.reference)}</td>
                <td><button class="btn btn-sm btn-outline-primary" type="button" data-edit-purchase="${escapeHtml(purchase.id)}">Edit</button></td>
            </tr>
        `).join('');
    }

    async function loadAdminPurchases() {
        if (!adminPurchasesTableBody) {
            return;
        }

        adminPurchasesTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-5">Loading purchases...</td></tr>';

        try {
            const data = await adminJson(await fetch('/api/admin/purchases', { headers: authHeaders() }), 'Unable to load purchases');
            renderAdminPurchases(data.purchases);
        } catch (error) {
            adminPurchasesTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger py-5">${escapeHtml(error.message || 'Unable to load purchases')}</td></tr>`;
        }
    }

    function openPurchaseEditor(purchase) {
        if (!purchase || !purchaseEditForm) {
            return;
        }

        selectedAdminPurchase = purchase;
        purchaseEditForm.elements.itemName.value = purchase.itemName || '';
        purchaseEditForm.elements.reference.value = purchase.reference || '';
        purchaseEditForm.elements.category.value = purchase.category || '';
        purchaseEditForm.elements.status.value = purchase.status || 'Completed';
        purchaseEditForm.elements.amount.value = purchase.amount ?? 0;
        purchaseEditForm.elements.note.value = purchase.note || '';
        purchaseEditForm.elements.details.value = purchase.details || '';
        purchaseEditForm.elements.adminNote.value = purchase.adminNote || '';
        const ssnDetails = purchase.ssnDetails || {};
        purchaseEditForm.elements.ssnFirstName.value = ssnDetails.firstName || '';
        purchaseEditForm.elements.ssnLastName.value = ssnDetails.lastName || '';
        purchaseEditForm.elements.ssnDob.value = ssnDetails.dob || '';
        purchaseEditForm.elements.ssnNumber.value = ssnDetails.ssnNumber || '';
        purchaseEditForm.elements.ssnCity.value = ssnDetails.city || '';
        purchaseEditForm.elements.ssnState.value = ssnDetails.state || '';
        purchaseEditForm.elements.ssnZip.value = ssnDetails.zip || '';
        document.getElementById('purchaseSsnDetailsFields').hidden = !purchase.ssnDetails;
        purchaseEditStatus.textContent = '';
        bootstrap.Modal.getOrCreateInstance(purchaseEditModal).show();
    }

    async function saveAdminPurchase(event) {
        event.preventDefault();
        if (!selectedAdminPurchase) {
            return;
        }

        purchaseEditStatus.textContent = 'Saving...';
        const values = Object.fromEntries(new FormData(purchaseEditForm));
        const ssnDetails = selectedAdminPurchase.ssnDetails ? {
            firstName: values.ssnFirstName,
            lastName: values.ssnLastName,
            dob: values.ssnDob,
            ssnNumber: values.ssnNumber,
            city: values.ssnCity,
            state: values.ssnState,
            zip: values.ssnZip
        } : null;
        delete values.ssnFirstName;
        delete values.ssnLastName;
        delete values.ssnDob;
        delete values.ssnNumber;
        delete values.ssnCity;
        delete values.ssnState;
        delete values.ssnZip;
        values.ssnDetails = ssnDetails;

        try {
            await adminJson(await fetch(`/api/admin/purchases/${selectedAdminPurchase.id}`, {
                method: 'PUT',
                headers: { ...authHeaders(), 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(values)
            }), 'Unable to update purchase');
            bootstrap.Modal.getOrCreateInstance(purchaseEditModal).hide();
            await loadAdminPurchases();
        } catch (error) {
            purchaseEditStatus.textContent = error.message || 'Unable to update purchase';
        }
    }

    async function saveCard(event) {
        event.preventDefault();
        setCardsStatus('Saving');

        try {
            const response = await fetch('/api/admin/cards', {
                method: 'POST',
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(cardFormPayload())
            });
            const data = await adminJson(response, 'Unable to save card');

            renderCards(data.cards);
            adminCardForm.reset();
            populateAdminCountries();
            updateLogoPreview();
            setCardsStatus('Saved', 'success');
        } catch (error) {
            setCardsStatus(error.message || 'Save failed', 'error');
        }
    }

    async function generateBulkCards() {
        const quantity = Number(bulkCardQuantity?.value);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
            setCardsStatus('Quantity must be 1-100000', 'error');
            bulkCardQuantity?.focus();
            return;
        }

        generateBulkCardsButton.disabled = true;
        setCardsStatus(`Generating ${quantity} records`);

        try {
            const response = await fetch('/api/admin/cards/bulk', {
                method: 'POST',
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ quantity })
            });
            const data = await adminJson(response, 'Unable to generate bulk cards');

            renderCards(data.cards);
            setCardsStatus(`${data.generated} records generated`, 'success');
        } catch (error) {
            setCardsStatus(error.message || 'Bulk generation failed', 'error');
        } finally {
            generateBulkCardsButton.disabled = false;
        }
    }

    function renderAdminSsnPagination(pageCount) {
        if (!adminSsnPagination) {
            return;
        }

        if (pageCount <= 1) {
            adminSsnPagination.innerHTML = '';
            return;
        }

        const pages = new Set([1, pageCount, adminSsnPage - 1, adminSsnPage, adminSsnPage + 1]);
        const orderedPages = [...pages].filter((page) => page > 0 && page <= pageCount).sort((left, right) => left - right);
        let previousPage = 0;
        const pageItems = orderedPages.map((page) => {
            const gap = page - previousPage > 1 ? '<span class="px-2 text-muted">...</span>' : '';
            previousPage = page;
            return `${gap}<button class="btn btn-sm ${page === adminSsnPage ? 'btn-dark' : 'btn-outline-secondary'}" type="button" data-admin-ssn-page="${page}">${page}</button>`;
        });

        adminSsnPagination.innerHTML = `<div class="d-flex justify-content-center align-items-center gap-1"><button class="btn btn-sm btn-outline-secondary" type="button" data-admin-ssn-page="${Math.max(1, adminSsnPage - 1)}"${adminSsnPage === 1 ? ' disabled' : ''}>Previous</button>${pageItems.join('')}<button class="btn btn-sm btn-outline-secondary" type="button" data-admin-ssn-page="${Math.min(pageCount, adminSsnPage + 1)}"${adminSsnPage === pageCount ? ' disabled' : ''}>Next</button></div>`;
    }

    function renderAdminSsn(records, total, pageCount) {
        if (adminSsnCount) {
            adminSsnCount.textContent = `${Number(total || 0).toLocaleString()} records`;
        }

        if (!adminSsnTableBody) {
            return;
        }

        if (!records.length) {
            adminSsnTableBody.innerHTML = '<tr><td colspan="11" class="text-center text-muted py-5">No SSN records found.</td></tr>';
            renderAdminSsnPagination(1);
            return;
        }

        adminSsnTableBody.innerHTML = records.map((record) => `
            <tr>
                <td>#${escapeHtml(record.id)}</td>
                <td>${escapeHtml(record.firstName)}</td>
                <td>${escapeHtml(record.lastName)}</td>
                <td><span class="admin-ssn-sensitive" data-ssn-value="${escapeHtml(record.ssnNumber)}">***-**-****</span><button class="btn btn-link btn-sm p-0 ms-1" type="button" data-toggle-admin-ssn="${escapeHtml(record.id)}">View</button></td>
                <td>${escapeHtml(record.dob)}</td>
                <td>${escapeHtml(record.city)}</td>
                <td>${escapeHtml(record.state)}</td>
                <td>${escapeHtml(record.zip)}</td>
                <td>$${Number(record.price || 0).toFixed(2)}</td>
                <td><span class="badge ${record.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">${record.active ? 'Available' : 'Sold'}</span></td>
                <td><button class="btn btn-sm btn-outline-danger" type="button" data-delete-ssn="${escapeHtml(record.id)}">Remove</button></td>
            </tr>
        `).join('');
        renderAdminSsnPagination(pageCount);
    }

    async function loadAdminSsn() {
        if (!adminSsnTableBody) {
            return;
        }

        const formData = new FormData(adminSsnFilterForm);
        const params = new URLSearchParams({ page: String(adminSsnPage), q: String(formData.get('q') || ''), status: String(formData.get('status') || '') });
        adminSsnTableBody.innerHTML = '<tr><td colspan="11" class="text-center text-muted py-5">Loading SSN inventory...</td></tr>';

        try {
            const data = await adminJson(await fetch(`/api/admin/ssn?${params.toString()}`, { headers: authHeaders() }), 'Unable to load SSN inventory');
            adminSsnPage = data.page || adminSsnPage;
            renderAdminSsn(data.records || [], data.total, data.pageCount);
        } catch (error) {
            adminSsnTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger py-5">${escapeHtml(error.message || 'Unable to load SSN inventory')}</td></tr>`;
        }
    }

    async function deleteAdminSsn(recordId) {
        try {
            await adminJson(await fetch(`/api/admin/ssn/${encodeURIComponent(recordId)}`, { method: 'DELETE', headers: authHeaders() }), 'Unable to remove SSN record');
            await loadAdminSsn();
        } catch (error) {
            adminSsnStatus.textContent = error.message || 'Unable to remove SSN record';
        }
    }

    async function deleteCard(cardId) {
        setCardsStatus('Deleting');

        try {
            const response = await fetch(`/api/admin/cards/${encodeURIComponent(cardId)}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            const data = await adminJson(response, 'Unable to delete card');

            renderCards(data.cards);
            setCardsStatus('Deleted', 'success');
        } catch (error) {
            setCardsStatus(error.message || 'Delete failed', 'error');
        }
    }

    function renderUsers(users) {
        usersCount.textContent = `${users.length} ${users.length === 1 ? 'user' : 'users'}`;

        if (!users.length) {
            tableBody.innerHTML = '';
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;
        tableBody.innerHTML = users.map((user) => `
            <tr>
                <td class="text-muted">#${escapeHtml(user.id)}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <span class="admin-user-avatar">${escapeHtml(user.username.charAt(0).toUpperCase())}</span>
                        <span class="fw-semibold">${escapeHtml(user.username)}</span>
                    </div>
                </td>
                <td><span class="badge bg-success-subtle text-success">${escapeHtml(user.status || 'active')}</span></td>
                <td>${escapeHtml(formatDate(user.createdAt))}</td>
                <td>${escapeHtml(formatDate(user.lastLoginAt))}</td>
            </tr>
        `).join('');
    }

    async function loadUsers() {
        setLoading();
        refreshButton.disabled = true;

        try {
            const response = await fetch('/api/users', {
                headers: authHeaders()
            });
            const data = await adminJson(response, 'Unable to load users');

            renderUsers(Array.isArray(data.users) ? data.users : []);
        } catch (error) {
            setError(error.message || 'Unable to load users');
        } finally {
            refreshButton.disabled = false;
        }
    }

    async function loadDashboardSettings() {
        if (!onlineCountInput) {
            return;
        }

        try {
            const response = await fetch('/api/admin/ticker-settings', {
                headers: authHeaders()
            });
            const data = await adminJson(response, 'Unable to load online count');

            const value = normalizeOnlineCount(data.settings?.onlineBase);
            onlineCountInput.value = value ?? 0;
            renderOnlinePreview(value);
            setOnlineStatus('Synced', 'success');
            populateDashboardContent(data.settings?.dashboardContent, data.settings?.telegramUrl, data.settings?.virtualCardNote);
        } catch (error) {
            setOnlineStatus(error.message || 'Offline', 'error');
            setContentStatus(error.message || 'Offline', 'error');
        }
    }

    async function saveOnlineSettings(event) {
        event.preventDefault();

        const value = normalizeOnlineCount(onlineCountInput?.value);

        if (value === null) {
            setOnlineStatus('Invalid number', 'error');
            onlineCountInput?.focus();
            return;
        }

        if (saveOnlineButton) {
            saveOnlineButton.disabled = true;
        }

        setOnlineStatus('Saving');

        try {
            const response = await fetch('/api/admin/ticker-settings', {
                method: 'PUT',
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    onlineBase: value,
                    autoFluctuate: false,
                    fluctuationRange: 0
                })
            });
            const data = await adminJson(response, 'Unable to save online count');

            const savedValue = normalizeOnlineCount(data.settings?.onlineBase) ?? value;
            onlineCountInput.value = savedValue;
            renderOnlinePreview(savedValue);
            setOnlineStatus('Saved', 'success');
        } catch (error) {
            setOnlineStatus(error.message || 'Save failed', 'error');
        } finally {
            if (saveOnlineButton) {
                saveOnlineButton.disabled = false;
            }
        }
    }

    async function saveDashboardContentSettings(event) {
        event.preventDefault();
        const dashboardContent = collectDashboardContent();

        if (saveDashboardContent) {
            saveDashboardContent.disabled = true;
        }

        setContentStatus('Saving');

        try {
            const response = await fetch('/api/admin/ticker-settings', {
                method: 'PUT',
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    dashboardContent,
                    telegramUrl: dashboardContent.telegramUrl,
                    virtualCardNote: dashboardContent.virtualCardNote
                })
            });
            const data = await adminJson(response, 'Unable to save notices');

            populateDashboardContent(data.settings?.dashboardContent, data.settings?.telegramUrl, data.settings?.virtualCardNote);
            setContentStatus('Saved', 'success');
        } catch (error) {
            setContentStatus(error.message || 'Save failed', 'error');
        } finally {
            if (saveDashboardContent) {
                saveDashboardContent.disabled = false;
            }
        }
    }

    function setAnnouncementStatus(message, type = '') {
        if (!announcementSettingsStatus) {
            return;
        }
        announcementSettingsStatus.textContent = message;
        announcementSettingsStatus.classList.toggle('text-success', type === 'success');
        announcementSettingsStatus.classList.toggle('text-danger', type === 'error');
    }

    function populateAnnouncementSettings(settings = {}) {
        announcementEnabledInput.checked = Boolean(settings.is_enabled);
        announcementTitleInput.value = settings.title || '';
        announcementMessageInput.value = settings.message || '';
        announcementActionTextInput.value = settings.action_text || '';
        announcementActionLinkInput.value = settings.action_link || '#';
        announcementSecondaryTextInput.value = settings.secondary_text || 'Close';
    }

    async function loadAnnouncementSettings() {
        try {
            const response = await fetch('/api/admin/announcement-alert', { headers: authHeaders() });
            const data = await adminJson(response, 'Unable to load announcement settings');
            populateAnnouncementSettings(data.settings);
            setAnnouncementStatus('Synced', 'success');
        } catch (error) {
            setAnnouncementStatus(error.message || 'Load failed', 'error');
        }
    }

    async function saveAnnouncementSettings(event) {
        event.preventDefault();
        setAnnouncementStatus('Saving');

        try {
            const response = await fetch('/api/admin/announcement-alert', {
                method: 'PUT',
                headers: {
                    ...authHeaders(),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    is_enabled: announcementEnabledInput.checked,
                    title: announcementTitleInput.value,
                    message: announcementMessageInput.value,
                    action_text: announcementActionTextInput.value,
                    action_link: announcementActionLinkInput.value,
                    secondary_text: announcementSecondaryTextInput.value
                })
            });
            const data = await adminJson(response, 'Unable to save announcement settings');
            populateAnnouncementSettings(data.settings);
            setAnnouncementStatus('Saved', 'success');
        } catch (error) {
            setAnnouncementStatus(error.message || 'Save failed', 'error');
        }
    }

    function renderAdminIdentity(session) {
        const username = session?.user?.username || 'admin';
        const issuedAt = session?.issuedAt ? formatDate(session.issuedAt) : 'Active';

        if (adminTopbarName) {
            adminTopbarName.textContent = username;
        }

        if (adminProfileUsername) {
            adminProfileUsername.textContent = username;
        }

        if (adminProfileRole) {
            adminProfileRole.textContent = session?.user?.role || 'admin';
        }

        if (adminProfileIssuedAt) {
            adminProfileIssuedAt.textContent = issuedAt;
        }

        if (adminSettingsSession) {
            adminSettingsSession.textContent = session?.token ? 'Authenticated' : 'Logged out';
        }
    }

    function setPaymentStatus(message, type = '') {
        paymentSettingsStatus.textContent = message;
        paymentSettingsStatus.className = `text-muted${type === 'error' ? ' text-danger' : type === 'success' ? ' text-success' : ''}`;
    }

    function paymentLockAttribute() {
        return paymentSettingsUnlocked ? 'data-payment-lock' : 'data-payment-lock disabled';
    }

    function setPaymentLocked(locked) {
        paymentSettingsUnlocked = !locked;

        paymentSection?.querySelectorAll('[data-payment-lock]').forEach((element) => {
            element.disabled = locked;
        });
    }

    function requirePaymentMasterKey() {
        const key = paymentMasterAdminKey?.value.trim() || '';

        if (!key) {
            setPaymentStatus('Enter the Master Admin Key.', 'error');
            return '';
        }

        return key;
    }

    function setCheckerStatus(message, type = '') {
        checkerSettingsStatus.textContent = message;
        checkerSettingsStatus.className = `admin-content-status${type === 'error' ? ' text-danger' : type === 'success' ? ' text-success' : ''}`;
    }

    async function loadCheckerSettings() {
        setCheckerStatus('Loading');

        try {
            const data = await adminJson(await fetch('/api/admin/checker-settings', { headers: authHeaders() }), 'Unable to load checker price');
            checkerPriceInput.value = Number(data.settings?.price || 0).toFixed(2);
            setCheckerStatus('Synced', 'success');
        } catch (error) {
            setCheckerStatus(error.message || 'Load failed', 'error');
        }
    }

    async function saveCheckerSettings(event) {
        event.preventDefault();
        setCheckerStatus('Saving');

        try {
            const response = await fetch('/api/admin/checker-settings', {
                method: 'PUT',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: Number(checkerPriceInput.value) })
            });
            const data = await adminJson(response, 'Unable to save checker price');
            checkerPriceInput.value = Number(data.settings?.price || 0).toFixed(2);
            setCheckerStatus('Saved', 'success');
        } catch (error) {
            setCheckerStatus(error.message || 'Save failed', 'error');
        }
    }

    function setSubPriceStatus(message, type = '') {
        subPriceSettingsStatus.textContent = message;
        subPriceSettingsStatus.className = `settings-status${type === 'error' ? ' text-danger' : type === 'success' ? ' text-success' : ''}`;
    }

    async function loadSubPriceSettings() {
        setSubPriceStatus('Loading');

        try {
            const data = await adminJson(await fetch('/api/settings/sub-price', { headers: authHeaders() }), 'Unable to load SUB price');
            subPriceInput.value = Number(data.price || 0).toFixed(2);
            setSubPriceStatus('Synced', 'success');
        } catch (error) {
            setSubPriceStatus(error.message || 'Load failed', 'error');
        }
    }

    async function saveSubPriceSettings(event) {
        event.preventDefault();
        setSubPriceStatus('Saving');

        try {
            const response = await fetch('/api/settings/sub-price', {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: Number(subPriceInput.value) })
            });
            const data = await adminJson(response, 'Unable to save SUB price');
            subPriceInput.value = Number(data.price || 0).toFixed(2);
            setSubPriceStatus('Saved', 'success');
        } catch (error) {
            setSubPriceStatus(error.message || 'Save failed', 'error');
        }
    }

    function setAdminTicketsStatus(message, type = '') {
        adminTicketsStatus.textContent = message;
        adminTicketsStatus.className = `admin-content-status${type === 'error' ? ' text-danger' : type === 'success' ? ' text-success' : ''}`;
    }

    function renderAdminTickets(tickets) {
        if (!tickets.length) {
            adminTicketsTableBody.innerHTML = '<tr><td colspan="6" class="text-muted">No tickets found.</td></tr>';
            return;
        }

        adminTicketsTableBody.innerHTML = tickets.map((ticket) => `
            <tr>
                <td><strong>${escapeHtml(ticket.ticketId)}</strong></td>
                <td>${escapeHtml(ticket.username)}</td>
                <td>${escapeHtml(ticket.subject)}</td>
                <td><span class="badge text-bg-${ticket.status === 'Closed' ? 'secondary' : ticket.status === 'Replied' ? 'primary' : 'success'}">${escapeHtml(ticket.status)}</span></td>
                <td>${escapeHtml(new Date(ticket.updatedAt).toLocaleString())}</td>
                <td><button class="btn btn-sm btn-outline-dark" type="button" data-admin-ticket="${ticket.id}">View</button></td>
            </tr>
        `).join('');
    }

    async function loadAdminTickets(status = selectedAdminTicketStatus) {
        selectedAdminTicketStatus = status;
        setAdminTicketsStatus('Loading');

        try {
            const data = await adminJson(await fetch(`/api/admin/tickets?status=${encodeURIComponent(status)}`, { headers: authHeaders() }), 'Unable to load tickets');
            renderAdminTickets(data.tickets || []);
            setAdminTicketsStatus('Synced', 'success');
        } catch (error) {
            setAdminTicketsStatus(error.message || 'Load failed', 'error');
        }
    }

    function renderAdminTicketDetail(ticket) {
        selectedAdminTicketId = ticket.id;
        adminTicketDetail.hidden = false;
        adminTicketDetailTitle.textContent = `${ticket.ticketId} · ${ticket.subject}`;
        adminTicketDetailMeta.textContent = `${ticket.username} · ${ticket.reasonContact} · Payment: ${ticket.paymentAddress}`;
        adminTicketStatusInput.value = ticket.status;
        adminTicketThread.innerHTML = (ticket.messages || []).map((message) => `
            <article class="admin-ticket-message ${message.sender === 'admin' ? 'is-admin' : ''}">
                <div><strong>${escapeHtml(message.author)}</strong><small>${escapeHtml(new Date(message.createdAt).toLocaleString())}</small></div>
                <p>${escapeHtml(message.text)}</p>
            </article>
        `).join('');
        adminTicketThread.scrollTop = adminTicketThread.scrollHeight;
    }

    async function loadAdminTicketDetail(id) {
        try {
            const data = await adminJson(await fetch(`/api/admin/tickets/${id}`, { headers: authHeaders() }), 'Unable to load ticket');
            renderAdminTicketDetail(data.ticket);
        } catch (error) {
            setAdminTicketsStatus(error.message || 'Unable to load ticket', 'error');
        }
    }

    async function saveAdminTicketReply(event) {
        event.preventDefault();
        if (!selectedAdminTicketId) return;

        try {
            const response = await fetch(`/api/admin/tickets/${selectedAdminTicketId}/reply`, {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: adminTicketReplyInput.value })
            });
            const data = await adminJson(response, 'Unable to send reply');
            adminTicketReplyForm.reset();
            renderAdminTicketDetail(data.ticket);
            await loadAdminTickets();
        } catch (error) {
            setAdminTicketsStatus(error.message || 'Reply failed', 'error');
        }
    }

    async function saveAdminTicketStatus() {
        if (!selectedAdminTicketId) return;

        try {
            const response = await fetch(`/api/admin/tickets/${selectedAdminTicketId}/status`, {
                method: 'PATCH',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: adminTicketStatusInput.value })
            });
            const data = await adminJson(response, 'Unable to update status');
            renderAdminTicketDetail(data.ticket);
            await loadAdminTickets();
        } catch (error) {
            setAdminTicketsStatus(error.message || 'Status update failed', 'error');
        }
    }

    function renderPaymentMethods(methods) {
        adminPaymentMethods.innerHTML = methods.map((method, index) => `
            <fieldset class="admin-payment-method border rounded p-3">
                <legend class="float-none w-auto px-2 fs-6">Gateway ${index + 1}</legend>
                <div class="row g-3">
                    <div class="col-md-3"><label class="form-label">Coin name</label><input class="form-control" data-field="name" value="${escapeHtml(method.name)}" required ${paymentLockAttribute()}></div>
                    <div class="col-md-2"><label class="form-label">Symbol</label><input class="form-control" data-field="symbol" value="${escapeHtml(method.symbol)}" required ${paymentLockAttribute()}></div>
                    <div class="col-md-3"><label class="form-label">Network</label><input class="form-control" data-field="network" value="${escapeHtml(method.network || '')}" ${paymentLockAttribute()}></div>
                    <div class="col-md-4"><label class="form-label">Wallet address</label><input class="form-control" data-field="address" value="${escapeHtml(method.address)}" required ${paymentLockAttribute()}></div>
                    <div class="col-md-5"><label class="form-label">QR code image URL</label><input class="form-control" data-field="qrImage" value="${escapeHtml(method.qrImage)}" ${paymentLockAttribute()}></div>
                    <div class="col-md-4"><label class="form-label">Network note</label><input class="form-control" data-field="networkNote" value="${escapeHtml(method.networkNote)}" ${paymentLockAttribute()}></div>
                    <div class="col-md-3"><label class="form-label">Upload QR code</label><input class="form-control" type="file" accept="image/*" data-upload ${paymentLockAttribute()}></div>
                </div>
                <input type="hidden" data-field="id" value="${escapeHtml(method.id)}">
                <input type="hidden" data-field="active" value="${method.active !== false ? 'true' : 'false'}">
                <button class="btn btn-danger mt-3 remove-payment-method" type="button" ${paymentLockAttribute()}>Remove</button>
            </fieldset>`).join('');
    }

    function collectPaymentMethods() {
        return [...adminPaymentMethods.querySelectorAll('.admin-payment-method')].map((element) => {
            const method = {};
            element.querySelectorAll('[data-field]').forEach((input) => { method[input.dataset.field] = input.value.trim(); });
            method.active = method.active !== 'false';
            return method;
        });
    }

    async function loadPaymentSettings() {
        setPaymentStatus('Loading');
        try {
            const data = await adminJson(await fetch('/api/admin/deposit-settings', { headers: authHeaders() }), 'Unable to load payment settings');
            minimumDepositInput.value = data.settings.minimumAmount;
            paymentWindowInput.value = data.settings.paymentWindowMinutes;
            setPaymentLocked(true);
            renderPaymentMethods(data.settings.methods || []);
            setPaymentStatus('Locked');
        } catch (error) {
            setPaymentStatus(error.message, 'error');
        }
    }

    async function savePaymentSettings(event) {
        event.preventDefault();
        if (!paymentSettingsUnlocked) {
            setPaymentStatus('Unlock with Master Key before editing.', 'error');
            return;
        }

        const masterAdminKey = requirePaymentMasterKey();
        if (!masterAdminKey) {
            return;
        }

        setPaymentStatus('Saving');
        try {
            const response = await fetch('/api/admin/deposit-settings', {
                method: 'PUT',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minimumAmount: Number(minimumDepositInput.value),
                    paymentWindowMinutes: Number(paymentWindowInput.value),
                    methods: collectPaymentMethods(),
                    masterAdminKey
                })
            });
            await adminJson(response, 'Unable to save payment settings');
            setPaymentStatus('Saved', 'success');
            paymentMasterAdminKey.value = '';
            setPaymentLocked(true);
        } catch (error) {
            setPaymentLocked(true);
            setPaymentStatus(error.message === 'Unauthorized. Invalid Admin Key.' ? 'Incorrect Master Key. Form remains locked.' : error.message, 'error');
        }
    }

    async function unlockPaymentSettingsWithMasterKey() {
        const masterAdminKey = requirePaymentMasterKey();

        if (!masterAdminKey) {
            setPaymentLocked(true);
            return;
        }

        setPaymentStatus('Checking Master Key');

        try {
            const response = await fetch('/api/admin/payment/unlock', {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ masterAdminKey })
            });
            await adminJson(response, 'Unable to unlock payment settings');
            setPaymentLocked(false);
            setPaymentStatus('Unlocked', 'success');
        } catch (error) {
            setPaymentLocked(true);
            setPaymentStatus('Incorrect Master Key. Form remains locked.', 'error');
        }
    }

    function renderAdminDeposits(deposits) {
        adminDepositBody.innerHTML = deposits.length ? deposits.map((deposit) => `
            <tr><td>${escapeHtml(deposit.username)} <small>#${escapeHtml(deposit.id)}</small></td><td>$${Number(deposit.amount).toFixed(2)}</td><td>${escapeHtml(deposit.method)}</td>
            <td>${deposit.txid ? escapeHtml(deposit.txid.slice(0, 18)) : (deposit.screenshot ? 'Image attached' : '-')}</td><td>${escapeHtml(new Date(deposit.date).toLocaleString())}</td>
            <td><span class="badge badge-${deposit.status === 'Pending' ? 'warning' : deposit.status === 'Approved' ? 'success' : 'danger'}">${escapeHtml(deposit.status)}</span></td>
            <td>${deposit.status === 'Pending' ? `<button class="btn btn-primary btn-sm" data-deposit-action="approve" data-deposit-id="${escapeHtml(deposit.id)}" type="button">Approve</button> <button class="btn btn-danger btn-sm" data-deposit-action="reject" data-deposit-id="${escapeHtml(deposit.id)}" type="button">Reject</button>` : escapeHtml(deposit.note || '-')}</td></tr>`).join('') : '<tr><td colspan="7" class="text-center text-muted py-5">No deposit requests yet.</td></tr>';
    }

    async function loadAdminDeposits() {
        try {
            const data = await adminJson(await fetch('/api/admin/deposits', { headers: authHeaders() }), 'Unable to load deposit requests');
            renderAdminDeposits(data.deposits || []);
        } catch (error) {
            adminDepositBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-5">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    async function reviewDeposit(button) {
        const action = button.dataset.depositAction;
        const note = window.prompt(action === 'reject' ? 'Rejection note (optional)' : 'Approval note (optional)', '') ?? '';
        button.disabled = true;
        try {
            await adminJson(await fetch(`/api/admin/deposits/${button.dataset.depositId}/${action}`, { method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) }), 'Unable to review deposit');
            await loadAdminDeposits();
        } catch (error) {
            window.alert(error.message);
            button.disabled = false;
        }
    }

    function renderView() {
        const activeView = viewFromPath();
        const activeRoute = ADMIN_ROUTE_PATHS[activeView] || ADMIN_ROUTE_PATHS.dashboard;

        dashboardSection.hidden = activeView !== 'dashboard';
        section.hidden = activeView !== 'users';
        cardsSection.hidden = activeView !== 'cards';
        purchasesSection.hidden = activeView !== 'purchases';
        checkerSection.hidden = activeView !== 'checker';
        ticketsSection.hidden = activeView !== 'tickets';
        ssnSection.hidden = activeView !== 'ssn';
        profileSection.hidden = activeView !== 'profile';
        settingsSection.hidden = activeView !== 'settings';
        paymentSection.hidden = activeView !== 'payment';
        requestsSection.hidden = activeView !== 'requests';
        if (adminSettingsRoute) {
            adminSettingsRoute.textContent = activeRoute;
        }

        dashboardNavLink?.classList.toggle('active', activeView === 'dashboard');
        usersNavLink?.classList.toggle('active', activeView === 'users');
        cardsNavLink?.classList.toggle('active', activeView === 'cards');
        purchasesNavLink?.classList.toggle('active', activeView === 'purchases');
        checkerNavLink?.classList.toggle('active', activeView === 'checker');
        ticketsNavLink?.classList.toggle('active', activeView === 'tickets');
        ssnNavLink?.classList.toggle('active', activeView === 'ssn');
        paymentNavLink?.classList.toggle('active', activeView === 'payment');
        depositRequestsNavLink?.classList.toggle('active', activeView === 'requests');

        if (refreshDashboardSettings) {
            refreshDashboardSettings.hidden = activeView !== 'dashboard';
        }

        if (activeView === 'dashboard') {
            loadDashboardSettings();
            loadAnnouncementSettings();
            loadVirtualCards();
        } else if (activeView === 'users') {
            loadUsers();
        } else if (activeView === 'checker') {
            loadCheckerSettings();
            loadSubPriceSettings();
        } else if (activeView === 'tickets') {
            loadAdminTickets();
        } else if (activeView === 'cards') {
            loadCards();
            loadVirtualCards();
        } else if (activeView === 'purchases') {
            loadAdminPurchases();
        } else if (activeView === 'payment') {
            loadPaymentSettings();
        } else if (activeView === 'requests') {
            loadAdminDeposits();
        } else if (activeView === 'ssn') {
            loadAdminSsn();
        } else if (activeView === 'settings') {
            loadTwoFactorSettings();
        } else {
            renderAdminIdentity(adminSessionOrRedirect());
        }
    }

    renderAdminIdentity(adminSession);

    refreshButton.addEventListener('click', loadUsers);
    refreshDashboardSettings?.addEventListener('click', loadDashboardSettings);
    onlineCountInput?.addEventListener('input', () => {
        renderOnlinePreview(onlineCountInput.value);
        setOnlineStatus('Unsaved');
    });
    onlineUsersForm?.addEventListener('submit', saveOnlineSettings);
    dashboardContentForm?.addEventListener('input', () => {
        setContentStatus('Unsaved');
    });
    dashboardContentForm?.addEventListener('submit', saveDashboardContentSettings);
    announcementSettingsForm?.addEventListener('submit', saveAnnouncementSettings);
    reloadDashboardContent?.addEventListener('click', loadDashboardSettings);
    adminCardType?.addEventListener('change', () => {
        updateLogoPreview();
        setCardsStatus('Unsaved');
    });
    adminCardForm?.addEventListener('input', () => {
        setCardsStatus('Unsaved');
    });
    adminCardForm?.addEventListener('submit', saveCard);
    paymentSettingsForm?.addEventListener('submit', savePaymentSettings);
    unlockPaymentSettings?.addEventListener('click', unlockPaymentSettingsWithMasterKey);
    twoFactorSettingsForm?.addEventListener('submit', saveTwoFactorSettings);
    twoFactorToggle?.addEventListener('change', () => {
        if (!twoFactorMasterAdminKey.value.trim()) {
            twoFactorToggle.checked = currentTwoFactorEnabled;
            setTwoFactorStatus('Master Admin Key is required.', 'error');
            return;
        }
        if (twoFactorToggle.checked && !pendingTwoFactorSecret) {
            prepareTwoFactorSetup().catch((error) => setTwoFactorStatus(error.message, 'error'));
        }
    });
    checkerSettingsForm?.addEventListener('submit', saveCheckerSettings);
    subPriceSettingsForm?.addEventListener('submit', saveSubPriceSettings);
    document.querySelectorAll('.admin-ticket-filter').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.admin-ticket-filter').forEach((candidate) => candidate.classList.toggle('btn-dark', candidate === button));
            document.querySelectorAll('.admin-ticket-filter').forEach((candidate) => candidate.classList.toggle('btn-outline-dark', candidate !== button));
            loadAdminTickets(button.dataset.ticketStatus);
        });
    });
    adminTicketsTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-admin-ticket]');
        if (button) loadAdminTicketDetail(button.dataset.adminTicket);
    });
    adminTicketReplyForm?.addEventListener('submit', saveAdminTicketReply);
    adminTicketSaveStatus?.addEventListener('click', saveAdminTicketStatus);
    addPaymentMethod?.addEventListener('click', () => {
        if (!paymentSettingsUnlocked) {
            setPaymentStatus('Unlock with Master Key before editing.', 'error');
            return;
        }

        const methods = collectPaymentMethods();
        methods.push({ id: `crypto-${methods.length + 1}`, name: 'New Crypto', symbol: 'CRYPTO', network: '', address: '', qrImage: '', networkNote: '', active: true });
        renderPaymentMethods(methods);
    });
    adminPaymentMethods?.addEventListener('click', (event) => {
        if (event.target.closest('.remove-payment-method')) {
            event.target.closest('.admin-payment-method').remove();
        }
    });
    adminPaymentMethods?.addEventListener('change', (event) => {
        const upload = event.target.closest('[data-upload]');
        if (!upload?.files[0]) return;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            upload.closest('.admin-payment-method').querySelector('[data-field="qrImage"]').value = reader.result;
        });
        reader.readAsDataURL(upload.files[0]);
    });
    refreshDeposits?.addEventListener('click', loadAdminDeposits);
    adminDepositBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-deposit-action]');
        if (button) reviewDeposit(button);
    });
    generateBulkCardsButton?.addEventListener('click', generateBulkCards);
    refreshAdminPurchases?.addEventListener('click', loadAdminPurchases);
    purchaseEditForm?.addEventListener('submit', saveAdminPurchase);
    adminPurchasesTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-edit-purchase]');
        if (!button) {
            return;
        }

        fetch('/api/admin/purchases', { headers: authHeaders() })
            .then((response) => adminJson(response, 'Unable to load purchases'))
            .then((data) => openPurchaseEditor(data.purchases.find((purchase) => String(purchase.id) === button.dataset.editPurchase)))
            .catch((error) => setCardsStatus(error.message || 'Unable to load purchase', 'error'));
    });
    virtualCardEditForm?.addEventListener('submit', saveVirtualCard);
    adminVirtualCardsTableBody?.addEventListener('click', (event) => {
        const editButton = event.target.closest('[data-edit-virtual-card]');
        const approveButton = event.target.closest('[data-approve-virtual-card]');
        const deleteButton = event.target.closest('[data-delete-virtual-card]');

        if (approveButton) {
            const cardId = Number(approveButton.dataset.approveVirtualCard);
            fetch('/api/admin/virtual-cards', { headers: authHeaders() })
                .then((response) => adminJson(response, 'Unable to load virtual cards'))
                .then((data) => openVirtualCardApproval(data.cards.find((card) => card.id === cardId)))
                .catch((error) => setCardsStatus(error.message || 'Unable to load virtual card', 'error'));
        } else if (editButton) {
            const cardId = Number(editButton.dataset.editVirtualCard);
            fetch('/api/admin/virtual-cards', { headers: authHeaders() })
                .then((response) => adminJson(response, 'Unable to load virtual cards'))
                .then((data) => openVirtualCardEditor(data.cards.find((card) => card.id === cardId)))
                .catch((error) => setCardsStatus(error.message || 'Unable to load virtual card', 'error'));
        } else if (deleteButton) {
            deleteVirtualCard(deleteButton.dataset.deleteVirtualCard);
        }
    });
    generateBulkSsn?.addEventListener('click', async () => {
        generateBulkSsn.disabled = true;
        adminSsnStatus.textContent = 'Generating 1000 records';

        try {
            const response = await fetch('/api/admin/ssn/bulk', {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: '{}'
            });
            const data = await adminJson(response, 'Unable to generate SSN records');
            adminSsnStatus.textContent = `${data.generated} records generated (${data.total} total)`;
            adminSsnPage = 1;
            await loadAdminSsn();
        } catch (error) {
            adminSsnStatus.textContent = error.message || 'Generation failed';
        } finally {
            generateBulkSsn.disabled = false;
        }
    });
    adminSsnFilterForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        adminSsnPage = 1;
        loadAdminSsn();
    });
    adminSsnPagination?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-admin-ssn-page]');
        if (!button || button.disabled) {
            return;
        }
        adminSsnPage = Number(button.dataset.adminSsnPage) || 1;
        loadAdminSsn();
    });
    adminSsnTableBody?.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-toggle-admin-ssn]');
        const remove = event.target.closest('[data-delete-ssn]');

        if (toggle) {
            const value = toggle.previousElementSibling;
            const visible = value.dataset.visible === 'true';
            value.textContent = visible ? '***-**-****' : value.dataset.ssnValue;
            value.dataset.visible = String(!visible);
            toggle.textContent = visible ? 'View' : 'Hide';
        }
        if (remove) {
            deleteAdminSsn(remove.dataset.deleteSsn);
        }
    });
    clearAdminCardForm?.addEventListener('click', () => {
        adminCardForm.reset();
        populateAdminCountries();
        updateLogoPreview();
        setCardsStatus('Ready');
    });
    adminCardsTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-delete-card]');

        if (button) {
            deleteCard(button.dataset.deleteCard);
        }
    });
    document.querySelectorAll('[data-admin-view]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const view = link.dataset.adminView;

            if (!view || !ADMIN_ROUTE_PATHS[view]) {
                return;
            }

            event.preventDefault();
            routeToView(view);
            renderView();
        });
    });
    document.querySelectorAll('.admin-logout-button').forEach((button) => {
        button.addEventListener('click', destroyAdminSession);
    });
    window.addEventListener('popstate', renderView);
    window.setInterval(() => {
        const activeView = viewFromPath();

        if (activeView === 'ssn') {
            loadAdminSsn();
        } else if (activeView === 'cards') {
            loadVirtualCards();
        }
    }, 10000);
    populateAdminCountries();
    updateLogoPreview();
    renderView();
}());
