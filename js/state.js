/**
 * NextWeb Inventory - State Management
 * Simulates a backend session + user role/category tracking.
 */

const STATE_KEY = 'nextweb_app_state';

const defaultState = {
    isLoggedIn: false,
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    category: '', // Grocery, Fashion, Electronics, Cosmetics, Hardware
    branches: 1,
    role: 'Admin', // Admin, Manager, Cashier
    currentBranch: 'Main Branch'
};

const appState = {
    get: function () {
        const stored = localStorage.getItem(STATE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return { ...defaultState };
    },

    set: function (newData) {
        const current = this.get();
        const updated = { ...current, ...newData };
        localStorage.setItem(STATE_KEY, JSON.stringify(updated));
        // Dispatch an event so layout/UI can react
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: updated }));
        return updated;
    },

    clear: function () {
        localStorage.removeItem(STATE_KEY);
        // Dispatch an event
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: { ...defaultState } }));
    },

    requireAuth: function () {
        const state = this.get();
        if (!state.isLoggedIn) {
            // Redirect to register/login
            window.location.href = 'register.html';
        }
    }
};

// Available Categories structure for dynamic logic
const CATEGORY_LOGIC = {
    'Grocery': {
        enableExpiry: true,
        enableBatch: true,
        enableWeightUnit: true,
        showExpiryAlert: true,
        enableSizeColor: false,
        enableIMEI: false,
        enableWarranty: false,
        taxPercent: 5
    },
    'Fashion': {
        enableExpiry: false,
        enableBatch: false,
        enableWeightUnit: false,
        showExpiryAlert: false,
        enableSizeColor: true,
        enableIMEI: false,
        enableWarranty: false,
        taxPercent: 15
    },
    'Electronics': {
        enableExpiry: false,
        enableBatch: false,
        enableWeightUnit: false,
        showExpiryAlert: false,
        enableSizeColor: false,
        enableIMEI: true,
        enableWarranty: true,
        taxPercent: 10
    },
    'Cosmetics': {
        enableExpiry: true, // Optional
        enableBatch: true,
        enableWeightUnit: false,
        showExpiryAlert: true,
        enableSizeColor: true, // Optional variant
        enableIMEI: false,
        enableWarranty: false,
        taxPercent: 8
    },
    'Hardware': {
        enableExpiry: false,
        enableBatch: false,
        enableWeightUnit: false,
        showExpiryAlert: false,
        enableSizeColor: false,
        enableIMEI: true, // Optional Serial
        enableWarranty: true, // Optional
        taxPercent: 15
    }
};

window.appState = appState;
window.CATEGORY_LOGIC = CATEGORY_LOGIC;
