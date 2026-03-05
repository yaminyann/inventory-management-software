/**
 * NextWeb Inventory - POS Logic v3
 * Multi-payment, customer points, invoice redirect
 */

class POSApp {
    constructor() {
        this.cart = [];
        this.taxRate = 0;
        this.categoryLogic = {};
        this.demoProducts = [];
        this.currentTotal = 0;
        this.pointsDiscount = 0;
        this.manualDiscount = 0;
        this.selectedMethods = {}; // { cash: 500, bkash: 600 }
        this.customerPoints = 0;
        this.invoiceCounter = parseInt(localStorage.getItem('nw_inv_counter') || '100');
        this.init();
    }

    init() {
        if (!window.appState) return;

        setTimeout(() => {
            const pw = document.getElementById('page-content-wrapper');
            if (pw) pw.className = 'flex-grow relative lg:pb-0 h-[calc(100vh-64px)] overflow-hidden';
        }, 50);

        const state = window.appState.get();
        this.categoryLogic = window.CATEGORY_LOGIC[state.category] || {};
        this.taxRate = this.categoryLogic.taxPercent || 0;
        document.getElementById('pos-tax-rate').textContent = this.taxRate;

        this.generateDemoProducts(state.category);
        this.renderProducts();

        // EMI visibility
        const emiMethod = document.getElementById('method-emi');
        if (emiMethod && state.category !== 'Electronics' && state.category !== 'Hardware') {
            emiMethod.classList.add('hidden');
        }

        // Customer input change → simulate loading points
        const custInput = document.getElementById('pos-customer-input');
        if (custInput) {
            custInput.addEventListener('change', () => this.loadCustomerPoints(custInput.value));
        }

        // Search
        const searchInput = document.getElementById('pos-search');
        if (searchInput) searchInput.addEventListener('input', (e) => this.renderProducts(e.target.value));
    }

    loadCustomerPoints(name) {
        const settings = JSON.parse(localStorage.getItem('nw_points_settings') || '{}');
        if (!settings.enabled) return;

        // Demo: 1250 points if not walk-in
        if (!name || name.toLowerCase().includes('walk-in')) {
            this.customerPoints = 0;
            document.getElementById('points-banner').classList.add('hidden');
            return;
        }
        this.customerPoints = 1250; // demo value
        const pointsValue = (settings.pointsPerTaka || 1);
        const moneyVal = Math.floor(this.customerPoints / pointsValue);
        document.getElementById('points-text').textContent = `${this.customerPoints} Points = ৳${moneyVal} discount`;
        document.getElementById('points-banner').classList.remove('hidden');
    }

    redeemPoints() {
        if (this.customerPoints === 0) return;
        const settings = JSON.parse(localStorage.getItem('nw_points_settings') || '{}');
        const pointsValue = settings.pointsPerTaka || 1;
        const maxDiscount = Math.floor(this.customerPoints / pointsValue);

        document.getElementById('redeem-info').textContent = `Available: ${this.customerPoints} pts = ৳${maxDiscount} max discount`;
        document.getElementById('redeem-input').value = '';
        document.getElementById('redeem-value-preview').textContent = '= ৳ 0 discount';

        const input = document.getElementById('redeem-input');
        input.max = this.customerPoints;
        input.oninput = () => {
            const pts = parseInt(input.value) || 0;
            const val = Math.floor(pts / pointsValue);
            document.getElementById('redeem-value-preview').textContent = `= ৳ ${val} discount`;
        };

        document.getElementById('redeem-modal').classList.remove('hidden');
    }

    applyPointsRedemption() {
        const pts = parseInt(document.getElementById('redeem-input').value) || 0;
        if (pts > this.customerPoints) { UI.showToast('Not enough points!', 'error'); return; }

        const settings = JSON.parse(localStorage.getItem('nw_points_settings') || '{}');
        const pointValue = settings.pointsPerTaka || 1;
        this.pointsDiscount = Math.floor(pts / pointValue);
        this.customerPoints -= pts;

        document.getElementById('redeem-modal').classList.add('hidden');
        document.getElementById('redeem-btn').textContent = `✓ ৳${this.pointsDiscount} redeemed`;
        document.getElementById('redeem-btn').disabled = true;

        this.calculateTotals();
        UI.showToast(`৳${this.pointsDiscount} discount applied from ${pts} points!`, 'success');
    }

    generateDemoProducts(cat) {
        const base = [
            { id: 1, name: 'Premium Item A', price: 1200, unit: 'Pc', img: '📦', hasVariants: false, stock: 30 },
            { id: 2, name: 'Standard Item B', price: 450, unit: 'Pc', img: '🏷️', hasVariants: false, stock: 15 },
            { id: 3, name: 'Basic Item C', price: 120, unit: 'Pc', img: '🛍️', hasVariants: false, stock: 50 },
        ];
        if (cat === 'Grocery') {
            this.demoProducts = [
                { id: 1, name: 'Miniket Rice', price: 75, unit: 'Kg', img: '🍚', stock: 50 },
                { id: 2, name: 'Fresh Soyabean Oil', price: 185, unit: 'Litre', img: '🛢️', stock: 20 },
                { id: 3, name: 'Radhuni Beef Masala', price: 55, unit: 'Pack', img: '🌶️', stock: 100 },
                { id: 4, name: 'Pran Mango Juice 1L', price: 140, unit: 'Bot', img: '🧃', stock: 12 },
                { id: 5, name: 'Loose Sugar', price: 130, unit: 'Kg', img: '🧊', stock: 80 },
                { id: 6, name: 'Farm Fresh Egg', price: 14, unit: 'Pc', img: '🥚', stock: 200 },
            ];
        } else if (cat === 'Fashion') {
            this.demoProducts = [
                { id: 1, name: 'Mens Casual Shirt', price: 1200, unit: 'Pc', img: '👕', hasVariants: true, variants: ['M', 'L', 'XL'], stock: 15 },
                { id: 2, name: 'Denim Jeans', price: 1850, unit: 'Pc', img: '👖', hasVariants: true, variants: ['30', '32', '34'], stock: 8 },
                { id: 3, name: 'Cotton T-Shirt', price: 450, unit: 'Pc', img: '🎽', hasVariants: true, variants: ['S', 'M', 'L'], stock: 30 },
            ];
        } else if (cat === 'Electronics') {
            this.demoProducts = [
                { id: 1, name: 'Samsung A54', price: 45000, unit: 'Pc', img: '📱', requiresIMEI: true, stock: 5 },
                { id: 2, name: 'Walton 32" TV', price: 18500, unit: 'Pc', img: '📺', requiresIMEI: true, stock: 3 },
                { id: 3, name: 'A4Tech Mouse', price: 450, unit: 'Pc', img: '🖱️', stock: 25 },
            ];
        } else {
            this.demoProducts = base;
        }
    }

    renderProducts(searchTerm = '') {
        const grid = document.getElementById('pos-product-grid');
        grid.innerHTML = '';
        let filtered = this.demoProducts.filter(p =>
            !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-primary-500 hover:shadow-md transition-all flex flex-col justify-between';
            card.onclick = () => this.addToCart(p);
            card.innerHTML = `
                <div class="flex items-center justify-center h-14 w-14 mx-auto bg-slate-50 rounded-xl text-3xl mb-3">${p.img || '📦'}</div>
                <div class="text-center">
                    <h4 class="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">${p.name}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">${p.stock} in stock</p>
                    <p class="text-sm font-bold text-primary-600 font-bn mt-1">৳ ${p.price}</p>
                </div>`;
            grid.appendChild(card);
        });
    }

    addToCart(product) {
        const addedItem = { cartId: Date.now(), ...product, qty: 1, discountVal: 0, discountType: 'flat', variantSelected: '', imeiInput: '' };
        if (this.categoryLogic.enableSizeColor && product.hasVariants) {
            addedItem.variantSelected = product.variants[0];
        }
        const existing = this.cart.find(c => c.id === product.id && c.variantSelected === addedItem.variantSelected);
        if (existing && !this.categoryLogic.enableIMEI) {
            existing.qty += 1;
        } else {
            this.cart.push(addedItem);
        }
        this.updateCart();
    }

    removeFromCart(cartId) {
        this.cart = this.cart.filter(c => c.cartId !== cartId);
        this.updateCart();
    }

    updateQty(cartId, delta) {
        const item = this.cart.find(c => c.cartId === cartId);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) { this.removeFromCart(cartId); return; }
        this.updateCart();
    }

    updateItemDiscount(cartId, val) {
        const item = this.cart.find(c => c.cartId === cartId);
        if (!item) return;

        if (val.includes('%')) {
            item.discountType = 'percent';
            item.discountVal = parseFloat(val) || 0;
        } else {
            item.discountType = 'flat';
            item.discountVal = parseFloat(val) || 0;
        }
        this.updateCart();
    }

    updateCart() {
        const cartContainer = document.getElementById('pos-cart-items');
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-slate-400 opacity-50 select-none">
                    <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p class="font-medium text-sm">Cart is empty</p>
                </div>`;
            document.getElementById('btn-pay').disabled = true;
        } else {
            cartContainer.innerHTML = '';
            document.getElementById('btn-pay').disabled = false;
            this.cart.forEach(item => {
                const discAmount = item.discountType === 'percent'
                    ? (item.price * item.qty * (item.discountVal / 100))
                    : item.discountVal;
                const totalLine = (item.price * item.qty) - discAmount;

                let extraHtml = '';
                if (this.categoryLogic.enableSizeColor && item.variantSelected) {
                    extraHtml += `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded ml-2">Size: ${item.variantSelected}</span>`;
                }
                if (this.categoryLogic.enableIMEI && item.requiresIMEI) {
                    extraHtml += `<div class="mt-1"><input type="text" title="IMEI/Serial" class="w-full px-2 py-1 border border-alert/50 rounded text-xs" placeholder="IMEI / Serial *"></div>`;
                    extraHtml += `<div class="mt-1"><select title="Warranty" class="w-full px-2 py-1 border border-slate-200 rounded text-xs"><option>No Warranty</option><option>06 Months</option><option selected>01 Year</option><option>02 Years</option></select></div>`;
                }
                cartContainer.innerHTML += `
                    <div class="bg-white border border-slate-100 p-3 rounded-xl custom-shadow-sm flex items-start gap-3 relative group">
                        <button onclick="posApp.removeFromCart(${item.cartId})" title="Remove item" class="absolute -top-1.5 -left-1.5 w-5 h-5 bg-white border border-slate-200 text-alert rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:outline-none">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <div class="flex-grow min-w-0">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="text-sm font-semibold text-slate-800 truncate pr-2">${item.name}</h4>
                                <div class="text-right">
                                    <span class="font-bold text-slate-800 font-bn whitespace-nowrap">৳ ${totalLine.toFixed(0)}</span>
                                    ${item.discountVal > 0 ? `<p class="text-[10px] text-alert font-bold -mt-1">-${item.discountType === 'percent' ? item.discountVal + '%' : '৳' + item.discountVal}</p>` : ''}
                                </div>
                            </div>
                            <div class="flex items-center text-xs text-slate-500 mb-2">
                                <span>৳${item.price} / ${item.unit || 'Pc'}</span>${extraHtml}
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                    <button onclick="posApp.updateQty(${item.cartId}, -1)" title="Decrease qty" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-200 focus:outline-none">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                                    </button>
                                    <span class="w-8 text-center text-sm font-medium bg-white h-7 leading-7 border-x border-slate-200">${item.qty}</span>
                                    <button onclick="posApp.updateQty(${item.cartId}, 1)" title="Increase qty" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-200 focus:outline-none">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                </div>
                                <div class="flex items-center gap-1">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Disc</span>
                                    <input type="text" value="${item.discountType === 'percent' ? item.discountVal + '%' : item.discountVal}" 
                                        class="w-14 px-1.5 py-1 border border-slate-200 rounded text-[11px] font-bold text-slate-600 text-center"
                                        placeholder="0 / 5%"
                                        onchange="posApp.updateItemDiscount(${item.cartId}, this.value)">
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }
        this.calculateTotals();
    }

    calculateTotals() {
        let subtotal = 0;
        let itemDiscountsTotal = 0;

        this.cart.forEach(item => {
            const lineTotal = item.price * item.qty;
            const lineDisc = item.discountType === 'percent'
                ? (lineTotal * (item.discountVal / 100))
                : item.discountVal;
            subtotal += lineTotal;
            itemDiscountsTotal += lineDisc;
        });

        const taxVal = (subtotal - itemDiscountsTotal) * (this.taxRate / 100);
        const finalTotal = subtotal - itemDiscountsTotal - this.manualDiscount - this.pointsDiscount + taxVal;

        document.getElementById('pos-subtotal').textContent = `৳ ${subtotal.toFixed(2)}`;
        const totalDiscount = itemDiscountsTotal + this.manualDiscount;
        document.getElementById('pos-discount').textContent = `- ৳ ${totalDiscount.toFixed(2)}`;
        document.getElementById('pos-tax').textContent = `৳ ${taxVal.toFixed(2)}`;
        document.getElementById('pos-total').textContent = `৳ ${Math.round(finalTotal).toFixed(2)}`;

        const pdRow = document.getElementById('points-discount-row');
        if (this.pointsDiscount > 0) {
            pdRow.classList.remove('hidden');
            document.getElementById('pos-points-discount').textContent = `- ৳ ${this.pointsDiscount.toFixed(2)}`;
        } else {
            pdRow.classList.add('hidden');
        }

        this.currentTotal = Math.max(0, Math.round(finalTotal));
    }

    openDiscountModal() {
        const disc = prompt('Enter discount amount (৳):');
        if (disc !== null && !isNaN(disc)) {
            this.manualDiscount = Math.max(0, parseFloat(disc));
            this.calculateTotals();
            UI.showToast(`Discount ৳${this.manualDiscount} applied`, 'success');
        }
    }

    openPaymentModal() {
        if (this.cart.length === 0) return;
        this.selectedMethods = {};

        document.getElementById('modal-total').textContent = `৳ ${this.currentTotal.toFixed(2)}`;
        this.renderPaymentMethods();
        this.updateCollectedAmount();

        // Quick fill buttons
        const qf = document.getElementById('quick-fill-buttons');
        qf.innerHTML = `<button type="button" onclick="posApp.fillExact()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-200">Fill Exact</button>`;

        const modal = document.getElementById('payment-modal');
        const panel = document.getElementById('payment-modal-panel');
        modal.classList.remove('hidden');
        setTimeout(() => { modal.classList.remove('opacity-0'); panel.classList.remove('scale-95'); panel.classList.add('scale-100'); }, 10);
    }

    renderPaymentMethods() {
        const methods = [
            { key: 'cash', label: 'Cash', icon: '💵', color: 'text-green-600 bg-green-50' },
            { key: 'mobile', label: 'Mobile Payment (bKash/Nagad)', icon: '📲', color: 'text-pink-600 bg-pink-50' },
            { key: 'card', label: 'Card', icon: '💳', color: 'text-indigo-600 bg-indigo-50' },
            { key: 'emi', label: 'Installment (EMI)', icon: '📅', color: 'text-emerald-600 bg-emerald-50' },
        ];
        const state = window.appState ? window.appState.get() : {};
        const html = methods.map(m => {
            if (m.key === 'emi' && state.category !== 'Electronics' && state.category !== 'Hardware') return '';
            return `
            <div class="bg-white border-2 border-slate-100 rounded-xl p-3 flex items-center gap-3 method-chip" id="chip-${m.key}">
                <div class="w-9 h-9 rounded-lg ${m.color} flex items-center justify-center text-lg flex-shrink-0">${m.icon}</div>
                <div class="flex-grow">
                    <p class="text-sm font-bold text-slate-700">${m.label}</p>
                </div>
                <div class="flex items-center gap-2">
                    <input type="number" placeholder="0" title="${m.label} amount" id="amt-${m.key}"
                        class="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold font-bn text-right focus:border-primary-500 focus:outline-none"
                        oninput="posApp.onMethodAmountChange('${m.key}', this.value); posApp.activateChip('${m.key}')">
                </div>
            </div>
            ${m.key === 'emi' ? this._emiInlineForm() : ''}`;
        }).join('');
        document.getElementById('payment-methods-list').innerHTML = html;
    }

    _emiInlineForm() {
        return `
        <div id="emi-inline-form" class="hidden mt-2 px-1">
            <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <div class="flex-grow">
                    <p class="text-xs font-bold text-emerald-700" id="emi-inline-summary">Enter down payment & customer info</p>
                    <p class="text-[11px] text-emerald-500 mt-0.5" id="emi-inline-calc">Monthly EMI will be calculated</p>
                </div>
                <button onclick="openEMIModal()" class="flex-shrink-0 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Fill Details
                </button>
            </div>
        </div>`;
    }

    activateChip(key) {
        const chip = document.getElementById('chip-' + key);
        if (chip) chip.classList.add('active', 'border-primary-300');
    }

    onMethodAmountChange(key, val) {
        const amt = parseFloat(val) || 0;
        if (amt > 0) {
            this.selectedMethods[key] = amt;
        } else {
            delete this.selectedMethods[key];
        }
        // Show EMI inline form when EMI amount is entered
        if (key === 'emi') {
            const emiForm = document.getElementById('emi-inline-form');
            if (emiForm) {
                emiForm.classList.toggle('hidden', amt === 0);
                if (amt > 0) {
                    // Pre-fill total
                    const dowEl = document.getElementById('il-down');
                    if (dowEl && !dowEl.value) {
                        // suggest total as down if not set
                    }
                    this.calcInlineEMI();
                }
            }
        }
        this.updateCollectedAmount();
    }

    calcInlineEMI() {
        // Update the compact summary row shown in the payment modal
        const emiData = window._emiData || {};
        const down = emiData.down || 0;
        const months = emiData.months || 6;
        const total = this.currentTotal;
        const remaining = Math.max(0, total - down);
        const monthly = remaining > 0 ? Math.ceil(remaining / months) : 0;

        const summaryEl = document.getElementById('emi-inline-summary');
        const calcEl = document.getElementById('emi-inline-calc');
        if (summaryEl) {
            const name = emiData.name ? ` — ${emiData.name}` : '';
            summaryEl.textContent = down > 0
                ? `৳${down.toLocaleString()} down • ${months} months${name}`
                : 'Enter down payment & customer info';
        }
        if (calcEl) {
            calcEl.textContent = monthly > 0
                ? `Monthly EMI: ৳${monthly.toLocaleString()} × ${months} months`
                : 'Monthly EMI will be calculated';
        }
    }

    fillExact() {
        // Fill the first/only active method input with exact remaining amount
        const remaining = this.currentTotal - Object.values(this.selectedMethods).reduce((a, b) => a + b, 0);
        const cashInput = document.getElementById('amt-cash');
        if (cashInput) {
            const currentCash = parseFloat(cashInput.value) || 0;
            cashInput.value = (currentCash + remaining).toFixed(0);
            this.selectedMethods['cash'] = parseFloat(cashInput.value);
            this.activateChip('cash');
            this.updateCollectedAmount();
        }
    }

    updateCollectedAmount() {
        const collected = Object.values(this.selectedMethods).reduce((a, b) => a + b, 0);
        const remaining = this.currentTotal - collected;

        document.getElementById('collected-amount').textContent = `৳ ${collected.toFixed(2)}`;

        const remEl = document.getElementById('remaining-amount');
        const changeEl = document.getElementById('change-amount');
        const changeLabel = document.getElementById('change-label');
        const container = document.getElementById('change-container');

        if (remaining < 0) {
            remEl.textContent = `৳ 0.00`;
            changeEl.textContent = `৳ ${Math.abs(remaining).toFixed(2)}`;
            changeLabel.textContent = 'Return Change';
            changeEl.className = 'text-xl font-bold text-success font-bn';
            container.className = 'p-4 bg-success-bg border border-success-500 rounded-xl flex justify-between items-center mb-4';
        } else if (remaining > 0) {
            remEl.textContent = `৳ ${remaining.toFixed(2)}`;
            changeEl.textContent = `৳ ${remaining.toFixed(2)}`;
            changeLabel.textContent = 'Still Due';
            changeEl.className = 'text-xl font-bold text-alert font-bn';
            container.className = 'p-4 bg-alert-bg border border-alert rounded-xl flex justify-between items-center mb-4';
        } else {
            remEl.textContent = `৳ 0.00`;
            changeEl.textContent = `৳ 0.00`;
            changeLabel.textContent = 'Change';
            changeEl.className = 'text-xl font-bold text-slate-800 font-bn';
            container.className = 'p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center mb-4';
        }
    }

    closeModals() {
        const modal = document.getElementById('payment-modal');
        const panel = document.getElementById('payment-modal-panel');
        modal.classList.add('opacity-0');
        panel.classList.remove('scale-100');
        panel.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    clearCart() {
        UI.confirmModal('Clear Cart', 'Are you sure you want to remove all items?', () => {
            this.cart = [];
            this.manualDiscount = 0;
            this.pointsDiscount = 0;
            this.updateCart();
        });
    }

    completeSale() {
        const collected = Object.values(this.selectedMethods).reduce((a, b) => a + b, 0);
        const hasPayment = Object.keys(this.selectedMethods).length > 0;

        if (!hasPayment) {
            UI.showToast('Please enter at least one payment amount', 'error');
            return;
        }

        this.invoiceCounter++;
        localStorage.setItem('nw_inv_counter', this.invoiceCounter);

        const subtotal = this.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const taxVal = subtotal * (this.taxRate / 100);
        const customer = document.getElementById('pos-customer-input')?.value || 'Walk-in Customer';

        // Points earned calc
        const settings = JSON.parse(localStorage.getItem('nw_points_settings') || '{}');
        let pointsEarned = 0;
        if (settings.enabled && customer && !customer.toLowerCase().includes('walk-in')) {
            pointsEarned = Math.floor(subtotal / (settings.spendPerPoint || 100));
        }

        const invoiceData = {
            number: `#INV-2026-${String(this.invoiceCounter).padStart(3, '0')}`,
            date: Date.now(),
            customerName: customer,
            items: this.cart.map(item => ({
                name: item.name, qty: item.qty, price: item.price, unit: item.unit || 'Pc',
                variant: item.variantSelected
            })),
            payments: Object.entries(this.selectedMethods).map(([method, amount]) => ({
                method: method.charAt(0).toUpperCase() + method.slice(1),
                amount
            })),
            subtotal,
            discount: this.manualDiscount,
            pointsDiscount: this.pointsDiscount,
            tax: taxVal,
            total: this.currentTotal,
            pointsEarned,
            emiData: window._emiData || null
        };

        sessionStorage.setItem('lastInvoice', JSON.stringify(invoiceData));

        this.closeModals();
        setTimeout(() => {
            window.location.href = 'invoice.html';
        }, 400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.posApp = new POSApp();
});
