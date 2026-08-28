(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const API_BASE = '/api';
    const sessionTimeout = window.AdminSessionTimeout;
    sessionTimeout?.startAutoTimeout();

    const logoutButton = document.getElementById('logoutButton');
    const settingsStatus = document.getElementById('settingsStatus');
    const tickerSettingsForm = document.getElementById('tickerSettingsForm');
    const resetTickerSettings = document.getElementById('resetTickerSettings');
    const onlineBaseInput = document.getElementById('onlineBaseInput');
    const autoFluctuateToggle = document.getElementById('autoFluctuateToggle');
    const fluctuationRangeInput = document.getElementById('fluctuationRangeInput');
    const slideIntervalInput = document.getElementById('slideIntervalInput');
    const tickerUsersInput = document.getElementById('tickerUsersInput');
    const tickerActionsInput = document.getElementById('tickerActionsInput');
    const tickerAmountsInput = document.getElementById('tickerAmountsInput');
    const tickerOrdersInput = document.getElementById('tickerOrdersInput');
    const tickerTicketsInput = document.getElementById('tickerTicketsInput');
    const tickerLabelsInput = document.getElementById('tickerLabelsInput');
    const checkerSettingsForm = document.getElementById('checkerSettingsForm');
    const checkerPriceInput = document.getElementById('checkerPriceInput');
    const checkerSettingsStatus = document.getElementById('checkerSettingsStatus');
    const onlinePreview = document.getElementById('onlinePreview');
    const previewFeed = document.getElementById('previewFeed');
    const paymentSettingsForm = document.getElementById('paymentSettingsForm');
    const adminPaymentMethods = document.getElementById('adminPaymentMethods');
    const minimumDepositInput = document.getElementById('minimumDepositInput');
    const paymentWindowInput = document.getElementById('paymentWindowInput');
    const paymentSettingsStatus = document.getElementById('paymentSettingsStatus');
    const addPaymentMethod = document.getElementById('addPaymentMethod');
    const adminDepositBody = document.getElementById('adminDepositBody');
    const refreshDeposits = document.getElementById('refreshDeposits');
    const twoFactorSettingsForm = document.getElementById('twoFactorSettingsForm');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    const twoFactorSetup = document.getElementById('twoFactorSetup');
    const twoFactorQr = document.getElementById('twoFactorQr');
    const twoFactorSecret = document.getElementById('twoFactorSecret');
    const twoFactorCode = document.getElementById('twoFactorCode');
    const twoFactorStatus = document.getElementById('twoFactorStatus');
    let pendingTwoFactorSecret = '';

    function getStoredSession() {
        if (sessionTimeout) {
            return sessionTimeout.getSession();
        }

        const raw = sessionStorage.getItem(SESSION_KEY);

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
    }

    function redirectToLogin() {
        if (sessionTimeout) {
            sessionTimeout.redirectToLogin();
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/admin/login');
    }

    function authHeaders() {
        const session = getStoredSession();

        return session?.token ? {
            Authorization: `Bearer ${session.token}`,
            Accept: 'application/json'
        } : {
            Accept: 'application/json'
        };
    }

    async function apiRequest(path, options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                ...authHeaders(),
                ...(options.headers || {})
            }
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            if (sessionTimeout) {
                sessionTimeout.handleUnauthorized();
            } else {
                redirectToLogin();
            }
            throw new Error('Session expired');
        }

        if (!response.ok || data.ok === false) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character]));
    }

    function setPaymentStatus(message, type = '') {
        paymentSettingsStatus.textContent = message;
        paymentSettingsStatus.classList.toggle('is-success', type === 'success');
        paymentSettingsStatus.classList.toggle('is-error', type === 'error');
    }

    function renderPaymentMethods(methods) {
        adminPaymentMethods.innerHTML = methods.map((method, index) => `
            <fieldset class="admin-payment-method" data-method-index="${index}">
                <legend>Crypto method ${index + 1}</legend>
                <div class="settings-grid settings-grid-wide">
                    <label>Name<input data-method-field="name" value="${escapeHtml(method.name)}" required></label>
                    <label>Symbol<input data-method-field="symbol" value="${escapeHtml(method.symbol)}" required></label>
                    <label>Wallet address<input data-method-field="address" value="${escapeHtml(method.address)}" required></label>
                    <label>Network note<input data-method-field="networkNote" value="${escapeHtml(method.networkNote)}"></label>
                    <label>QR image URL<input data-method-field="qrImage" value="${escapeHtml(method.qrImage)}" placeholder="https://..."></label>
                    <label>Upload QR image<input type="file" accept="image/*" data-qr-upload></label>
                </div>
                <input type="hidden" data-method-field="id" value="${escapeHtml(method.id)}">
                <button class="admin-button remove-payment-method" type="button">Remove</button>
            </fieldset>
        `).join('');
    }

    function collectPaymentSettings() {
        const methods = [...adminPaymentMethods.querySelectorAll('.admin-payment-method')].map((methodElement) => {
            const method = {};

            methodElement.querySelectorAll('[data-method-field]').forEach((input) => {
                method[input.dataset.methodField] = input.value.trim();
            });

            return method;
        });

        return {
            minimumAmount: Number(minimumDepositInput.value),
            paymentWindowMinutes: Number(paymentWindowInput.value),
            methods
        };
    }

    async function loadPaymentSettings() {
        setPaymentStatus('Loading');

        try {
            const data = await apiRequest('/admin/deposit-settings');
            minimumDepositInput.value = data.settings.minimumAmount;
            paymentWindowInput.value = data.settings.paymentWindowMinutes;
            renderPaymentMethods(data.settings.methods);
            setPaymentStatus('Synced', 'success');
        } catch (error) {
            setPaymentStatus(error.message || 'Load failed', 'error');
        }
    }

    async function savePaymentSettings(event) {
        event.preventDefault();
        setPaymentStatus('Saving');

        try {
            await apiRequest('/admin/deposit-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(collectPaymentSettings())
            });
            setPaymentStatus('Saved', 'success');
        } catch (error) {
            setPaymentStatus(error.message || 'Save failed', 'error');
        }
    }

    function renderAdminDeposits(deposits) {
        if (!deposits.length) {
            adminDepositBody.innerHTML = '<tr><td colspan="8" class="empty-history">No deposit requests yet.</td></tr>';
            return;
        }

        adminDepositBody.innerHTML = deposits.map((deposit) => `
            <tr>
                <td>#${escapeHtml(deposit.id)}</td>
                <td>${escapeHtml(deposit.username)}</td>
                <td>${escapeHtml(new Date(deposit.date).toLocaleString())}</td>
                <td>${escapeHtml(deposit.method)}</td>
                <td>$${Number(deposit.amount).toFixed(2)}</td>
                <td title="${escapeHtml(deposit.txid)}">${escapeHtml((deposit.txid || '-').slice(0, 14))}</td>
                <td><span class="deposit-status is-${escapeHtml(deposit.status.toLowerCase())}">${escapeHtml(deposit.status)}</span></td>
                <td>${deposit.status === 'Pending' ? '<button class="admin-button admin-button-primary" type="button" data-deposit-action="approve">Approve</button> <button class="admin-button" type="button" data-deposit-action="reject">Reject</button>' : escapeHtml(deposit.note || '-')}</td>
            </tr>
        `).join('');
        adminDepositBody.querySelectorAll('tr').forEach((row, index) => {
            const deposit = deposits[index];
            row.querySelectorAll('[data-deposit-action]').forEach((button) => {
                button.dataset.depositId = deposit.id;
            });
        });
    }

    async function loadAdminDeposits() {
        try {
            const data = await apiRequest('/admin/deposits');
            renderAdminDeposits(data.deposits || []);
        } catch (error) {
            adminDepositBody.innerHTML = `<tr><td colspan="8" class="empty-history">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    async function reviewDeposit(button) {
        const action = button.dataset.depositAction;
        const note = window.prompt(action === 'reject' ? 'Rejection note (optional)' : 'Approval note (optional)', '') ?? '';

        button.disabled = true;
        try {
            await apiRequest(`/admin/deposits/${button.dataset.depositId}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ note })
            });
            await loadAdminDeposits();
        } catch (error) {
            window.alert(error.message || 'Unable to review deposit');
            button.disabled = false;
        }
    }

    function setStatus(message, type = '') {
        settingsStatus.textContent = message;
        settingsStatus.classList.toggle('is-success', type === 'success');
        settingsStatus.classList.toggle('is-error', type === 'error');
    }

    function setCheckerStatus(message, type = '') {
        checkerSettingsStatus.textContent = message;
        checkerSettingsStatus.classList.toggle('is-success', type === 'success');
        checkerSettingsStatus.classList.toggle('is-error', type === 'error');
    }

    async function loadCheckerSettings() {
        setCheckerStatus('Loading');

        try {
            const data = await apiRequest('/admin/checker-settings');
            checkerPriceInput.value = Number(data.settings.price || 0).toFixed(2);
            setCheckerStatus('Synced', 'success');
        } catch (error) {
            if (error.message !== 'Session expired') {
                setCheckerStatus(error.message || 'Load failed', 'error');
            }
        }
    }

    function setTwoFactorStatus(message, type = '') {
        twoFactorStatus.textContent = message;
        twoFactorStatus.classList.toggle('is-success', type === 'success');
        twoFactorStatus.classList.toggle('is-error', type === 'error');
    }

    async function loadTwoFactorSettings() {
        try {
            const data = await apiRequest('/admin/2fa');
            twoFactorToggle.checked = Boolean(data.is_2fa_enabled);
            twoFactorSetup.hidden = data.is_2fa_enabled;
            setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', data.is_2fa_enabled ? 'success' : '');
        } catch (error) {
            if (error.message !== 'Session expired') setTwoFactorStatus(error.message, 'error');
        }
    }

    async function prepareTwoFactorSetup() {
        const data = await apiRequest('/admin/2fa/setup', { method: 'POST' });
        pendingTwoFactorSecret = data.secret;
        twoFactorSecret.textContent = data.secret;
        twoFactorQr.src = data.qrUrl;
        twoFactorSetup.hidden = false;
        setTwoFactorStatus('Scan the QR code, then enter the 6-digit code.', '');
    }

    async function saveTwoFactorSettings(event) {
        event.preventDefault();
        try {
            if (twoFactorToggle.checked) {
                if (!pendingTwoFactorSecret) await prepareTwoFactorSetup();
                const data = await apiRequest('/admin/2fa/enable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({ secret: pendingTwoFactorSecret, code: twoFactorCode.value.trim() })
                });
                twoFactorSetup.hidden = true;
                twoFactorCode.value = '';
                setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', 'success');
            } else {
                const data = await apiRequest('/admin/2fa/disable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({ code: twoFactorCode.value.trim() })
                });
                twoFactorCode.value = '';
                setTwoFactorStatus(data.is_2fa_enabled ? 'Enabled' : 'Disabled', 'success');
            }
            pendingTwoFactorSecret = '';
        } catch (error) {
            setTwoFactorStatus(error.message || 'Unable to update 2FA', 'error');
        }
    }

    async function saveCheckerSettings(event) {
        event.preventDefault();
        setCheckerStatus('Saving');

        try {
            const data = await apiRequest('/admin/checker-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ price: Number(checkerPriceInput.value) })
            });
            checkerPriceInput.value = Number(data.settings.price || 0).toFixed(2);
            setCheckerStatus('Saved', 'success');
        } catch (error) {
            if (error.message !== 'Session expired') {
                setCheckerStatus(error.message || 'Save failed', 'error');
            }
        }
    }

    function listToTextarea(list) {
        return Array.isArray(list) ? list.join('\n') : '';
    }

    function textareaToList(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function templatesToTextarea(templates) {
        return Array.isArray(templates)
            ? templates.map((template) => `${template.message} | ${template.targetPool} | ${template.status}`).join('\n')
            : '';
    }

    function normalizeTargetPool(value) {
        const pool = String(value || '').trim().toLowerCase();
        return ['amounts', 'orders', 'tickets', 'labels'].includes(pool) ? pool : 'labels';
    }

    function textareaToTemplates(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const [message, targetPool = 'labels', status = 'Active'] = line.split('|').map((part) => part.trim());

                return {
                    message,
                    targetPool: normalizeTargetPool(targetPool),
                    status
                };
            })
            .filter((template) => template.message);
    }

    function randomFrom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function collectSettings() {
        return {
            onlineBase: Number(onlineBaseInput.value),
            autoFluctuate: Boolean(autoFluctuateToggle.checked),
            fluctuationRange: Number(fluctuationRangeInput.value),
            slideIntervalMs: Number(slideIntervalInput.value),
            usernames: textareaToList(tickerUsersInput),
            activityTemplates: textareaToTemplates(tickerActionsInput),
            amounts: textareaToList(tickerAmountsInput),
            orders: textareaToList(tickerOrdersInput),
            tickets: textareaToList(tickerTicketsInput),
            labels: textareaToList(tickerLabelsInput)
        };
    }

    function targetForTemplate(template, settings) {
        const pool = settings[template.targetPool];
        const list = Array.isArray(pool) && pool.length ? pool : settings.labels;

        return list.length ? randomFrom(list) : 'News feed';
    }

    function previewActor(index, settings, fallback) {
        if (index === 0) {
            return fallback;
        }

        return Array.isArray(settings.usernames) && settings.usernames.length
            ? randomFrom(settings.usernames)
            : fallback;
    }

    function renderPreview(settings) {
        const session = getStoredSession();
        const actor = session?.user?.username || 'user';
        const range = settings.autoFluctuate ? Number(settings.fluctuationRange) || 0 : 0;
        const variation = range ? Math.floor(Math.random() * (range * 2 + 1)) - range : 0;
        const users = Math.max(0, (Number(settings.onlineBase) || 0) + variation);
        const templates = Array.isArray(settings.activityTemplates) && settings.activityTemplates.length
            ? settings.activityTemplates.slice(0, 2)
            : [];

        onlinePreview.textContent = `${users} Users Online`;
        previewFeed.innerHTML = `
            <div class="ticker-list">
                ${templates.map((template, index) => `
                    <p class="ticker-item">
                        <strong>@${escapeHtml(previewActor(index, settings, actor))}</strong>
                        ${escapeHtml(template.message)}
                        <a href="#">${escapeHtml(targetForTemplate(template, settings))}</a>
                    </p>
                `).join('')}
            </div>
        `;
    }

    function populateSettings(settings) {
        onlineBaseInput.value = settings.onlineBase ?? 80;
        autoFluctuateToggle.checked = Boolean(settings.autoFluctuate);
        fluctuationRangeInput.value = settings.fluctuationRange ?? 5;
        slideIntervalInput.value = settings.slideIntervalMs ?? 5000;
        tickerUsersInput.value = listToTextarea(settings.usernames);
        tickerActionsInput.value = templatesToTextarea(settings.activityTemplates);
        tickerAmountsInput.value = listToTextarea(settings.amounts);
        tickerOrdersInput.value = listToTextarea(settings.orders);
        tickerTicketsInput.value = listToTextarea(settings.tickets);
        tickerLabelsInput.value = listToTextarea(settings.labels);
        renderPreview(settings);
    }

    async function loadSettings() {
        setStatus('Loading');

        try {
            const data = await apiRequest('/admin/ticker-settings');
            populateSettings(data.settings);
            setStatus('Synced', 'success');
        } catch (error) {
            if (error.message !== 'Session expired') {
                setStatus(error.message || 'Load failed', 'error');
            }
        }
    }

    async function saveSettings(event) {
        event.preventDefault();
        setStatus('Saving');

        try {
            const data = await apiRequest('/admin/ticker-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(collectSettings())
            });

            populateSettings(data.settings);
            setStatus('Saved', 'success');
        } catch (error) {
            if (error.message !== 'Session expired') {
                setStatus(error.message || 'Save failed', 'error');
            }
        }
    }

    const session = getStoredSession();

    if (!session?.token) {
        redirectToLogin();
        return;
    }

    tickerSettingsForm.addEventListener('input', () => {
        setStatus('Unsaved');
        renderPreview(collectSettings());
    });
    tickerSettingsForm.addEventListener('submit', saveSettings);
    checkerSettingsForm.addEventListener('submit', saveCheckerSettings);
    resetTickerSettings.addEventListener('click', loadSettings);
    paymentSettingsForm.addEventListener('submit', savePaymentSettings);
    twoFactorSettingsForm.addEventListener('submit', saveTwoFactorSettings);
    twoFactorToggle.addEventListener('change', () => {
        if (twoFactorToggle.checked && !pendingTwoFactorSecret) {
            prepareTwoFactorSetup().catch((error) => setTwoFactorStatus(error.message, 'error'));
        }
    });
    addPaymentMethod.addEventListener('click', () => {
        const methods = collectPaymentSettings().methods;
        methods.push({
            id: `crypto-${methods.length + 1}`,
            name: 'New Crypto',
            symbol: 'CRYPTO',
            address: '',
            qrImage: '',
            networkNote: 'Confirm the correct network before sending.'
        });
        renderPaymentMethods(methods);
    });
    adminPaymentMethods.addEventListener('click', (event) => {
        if (event.target.closest('.remove-payment-method')) {
            event.target.closest('.admin-payment-method').remove();
        }
    });
    adminPaymentMethods.addEventListener('change', (event) => {
        const upload = event.target.closest('[data-qr-upload]');

        if (!upload || !upload.files[0]) {
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            upload.closest('.admin-payment-method').querySelector('[data-method-field="qrImage"]').value = reader.result;
        });
        reader.readAsDataURL(upload.files[0]);
    });
    refreshDeposits.addEventListener('click', loadAdminDeposits);
    adminDepositBody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-deposit-action]');

        if (button) {
            reviewDeposit(button);
        }
    });
    logoutButton.addEventListener('click', () => {
        if (sessionTimeout) {
            sessionTimeout.logout('/api/admin/logout');
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/admin/login');
    });

    loadSettings();
    loadCheckerSettings();
    loadPaymentSettings();
    loadTwoFactorSettings();
    loadAdminDeposits();
}());
