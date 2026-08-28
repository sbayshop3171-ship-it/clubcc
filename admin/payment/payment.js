(function () {
    const SESSION_KEY = 'dashlite.admin.session';
    const sessionTimeout = window.AdminSessionTimeout;
    sessionTimeout?.startAutoTimeout();
    const methodsElement = document.getElementById('adminPaymentMethods');
    const settingsForm = document.getElementById('paymentSettingsForm');
    const minimumAmount = document.getElementById('minimumDepositInput');
    const paymentWindow = document.getElementById('paymentWindowInput');
    const settingsStatus = document.getElementById('paymentSettingsStatus');
    const requestBody = document.getElementById('adminDepositBody');
    const paymentMethodsView = document.getElementById('paymentMethodsView');
    const depositRequestsView = document.getElementById('depositRequestsView');
    const paymentViewLinks = document.querySelectorAll('[data-payment-view]');

    function session() {
        if (sessionTimeout) {
            return sessionTimeout.getSession();
        }

        try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (error) { return null; }
    }

    function redirectToLogin() {
        if (sessionTimeout) {
            sessionTimeout.redirectToLogin();
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/admin/login');
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    }

    async function api(path, options = {}) {
        const activeSession = session();
        const response = await fetch(`/api${path}`, { ...options, headers: { Accept: 'application/json', Authorization: `Bearer ${activeSession?.token || ''}`, ...(options.headers || {}) } });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401) {
            if (sessionTimeout) sessionTimeout.handleUnauthorized();
            else redirectToLogin();
            throw new Error('Admin authentication required');
        }
        if (!response.ok || data.ok === false) throw new Error(data.error || 'Request failed');
        return data;
    }

    function setStatus(message, type = '') {
        settingsStatus.textContent = message;
        settingsStatus.classList.toggle('is-success', type === 'success');
        settingsStatus.classList.toggle('is-error', type === 'error');
    }

    function renderMethods(methods) {
        methodsElement.innerHTML = methods.map((method, index) => `
            <fieldset class="admin-payment-method" data-index="${index}">
                <legend>Gateway ${index + 1}</legend>
                <div class="settings-grid settings-grid-wide">
                    <label>Coin name<input class="form-control" data-field="name" value="${escapeHtml(method.name)}" required></label>
                    <label>Symbol<input class="form-control" data-field="symbol" value="${escapeHtml(method.symbol)}" required></label>
                    <label>Network<input class="form-control" data-field="network" value="${escapeHtml(method.network || '')}" placeholder="TRC20 / ERC20"></label>
                    <label>Wallet address<input class="form-control" data-field="address" value="${escapeHtml(method.address)}" required></label>
                    <label>QR code image URL<input class="form-control" data-field="qrImage" value="${escapeHtml(method.qrImage)}"></label>
                    <label>Upload QR code<input class="form-control" type="file" accept="image/*" data-upload></label>
                    <label>Network note<input class="form-control" data-field="networkNote" value="${escapeHtml(method.networkNote)}"></label>
                    <label class="toggle-field"><input type="checkbox" data-field="active"${method.active !== false ? ' checked' : ''}><span>Active gateway</span></label>
                </div>
                <input type="hidden" data-field="id" value="${escapeHtml(method.id)}">
                <button class="admin-button btn remove-payment-method" type="button">Remove</button>
            </fieldset>`).join('');
    }

    function collectMethods() {
        return [...methodsElement.querySelectorAll('.admin-payment-method')].map((element) => {
            const method = {};
            element.querySelectorAll('[data-field]').forEach((input) => { method[input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value.trim(); });
            return method;
        });
    }

    async function loadSettings() {
        try {
            const data = await api('/admin/deposit-settings');
            minimumAmount.value = data.settings.minimumAmount;
            paymentWindow.value = data.settings.paymentWindowMinutes;
            renderMethods(data.settings.methods);
            setStatus('Synced', 'success');
        } catch (error) { setStatus(error.message, 'error'); }
    }

    async function saveSettings(event) {
        event.preventDefault();
        setStatus('Saving');
        try {
            await api('/admin/deposit-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ minimumAmount: Number(minimumAmount.value), paymentWindowMinutes: Number(paymentWindow.value), methods: collectMethods() }) });
            setStatus('Saved', 'success');
        } catch (error) { setStatus(error.message, 'error'); }
    }

    function renderRequests(deposits) {
        requestBody.innerHTML = deposits.length ? deposits.map((deposit) => `<tr><td>${escapeHtml(deposit.username)} <small>#${escapeHtml(deposit.id)}</small></td><td>$${Number(deposit.amount).toFixed(2)}</td><td>${escapeHtml(deposit.method)}</td><td title="${escapeHtml(deposit.txid)}">${deposit.txid ? escapeHtml(deposit.txid.slice(0, 18)) : (deposit.screenshot ? '<span title="Screenshot attached">Image attached</span>' : '-')}</td><td>${escapeHtml(new Date(deposit.date).toLocaleString())}</td><td><span class="deposit-status is-${escapeHtml(deposit.status.toLowerCase())}">${escapeHtml(deposit.status)}</span></td><td>${deposit.status === 'Pending' ? `<button class="admin-button admin-button-primary btn btn-primary" data-action="approve" data-deposit-id="${escapeHtml(deposit.id)}" type="button">Approve</button> <button class="admin-button btn" data-action="reject" data-deposit-id="${escapeHtml(deposit.id)}" type="button">Reject</button>` : escapeHtml(deposit.note || '-')}</td></tr>`).join('') : '<tr><td colspan="7" class="empty-history">No deposit requests yet.</td></tr>';
    }

    function showPaymentView(view) {
        const activeView = view === 'requests' ? 'requests' : 'methods';

        paymentMethodsView.hidden = activeView !== 'methods';
        depositRequestsView.hidden = activeView !== 'requests';
        paymentViewLinks.forEach((link) => {
            const isActive = link.dataset.paymentView === activeView;
            link.classList.toggle('is-active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    async function loadRequests() {
        try { renderRequests((await api('/admin/deposits')).deposits || []); } catch (error) { requestBody.innerHTML = `<tr><td colspan="7" class="empty-history">${escapeHtml(error.message)}</td></tr>`; }
    }

    if (!session()?.token) { redirectToLogin(); return; }
    showPaymentView(window.location.hash === '#requests' ? 'requests' : 'methods');
    window.addEventListener('hashchange', () => showPaymentView(window.location.hash === '#requests' ? 'requests' : 'methods'));
    settingsForm.addEventListener('submit', saveSettings);
    document.getElementById('refreshDeposits').addEventListener('click', loadRequests);
    document.getElementById('addPaymentMethod').addEventListener('click', () => { const methods = collectMethods(); methods.push({ id: `crypto-${methods.length + 1}`, name: 'New Crypto', symbol: 'CRYPTO', network: '', address: '', qrImage: '', networkNote: '', active: true }); renderMethods(methods); });
    methodsElement.addEventListener('click', (event) => { if (event.target.closest('.remove-payment-method')) event.target.closest('.admin-payment-method').remove(); });
    methodsElement.addEventListener('change', (event) => { const input = event.target.closest('[data-upload]'); if (!input?.files[0]) return; const reader = new FileReader(); reader.addEventListener('load', () => { input.closest('.admin-payment-method').querySelector('[data-field="qrImage"]').value = reader.result; }); reader.readAsDataURL(input.files[0]); });
    requestBody.addEventListener('click', async (event) => { const button = event.target.closest('[data-action]'); if (!button) return; const note = window.prompt(button.dataset.action === 'reject' ? 'Rejection note (optional)' : 'Approval note (optional)', '') ?? ''; button.disabled = true; try { await api(`/admin/deposits/${button.dataset.depositId}/${button.dataset.action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) }); await loadRequests(); } catch (error) { window.alert(error.message); button.disabled = false; } });
    document.getElementById('logoutButton').addEventListener('click', () => {
        if (sessionTimeout) {
            sessionTimeout.logout('/api/admin/logout');
            return;
        }

        redirectToLogin();
    });
    loadSettings();
    loadRequests();
}());
