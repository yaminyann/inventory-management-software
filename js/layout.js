/**
 * Application Layout Manager
 * Injects Navbar and Sidebar dynamically to all pages.
 */

class AppLayout {
    constructor() {
        this.init();
    }

    init() {
        const layoutContainer = document.getElementById('app-layout');
        if (!layoutContainer) return; // Usually happens on login/register pages

        const state = window.appState ? window.appState.get() : {};

        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        const groups = [
            {
                name: 'Main',
                items: [
                    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', url: 'dashboard.html' },
                    { name: 'POS', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', url: 'pos.html' },
                ]
            },
            {
                name: 'Inventory',
                items: [
                    { name: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', url: 'products.html' },
                    { name: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', url: 'categories.html' },
                    { name: 'Brands', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', url: 'brands.html' },
                    { name: 'Stock', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', url: 'stock.html' },
                    { name: 'Returns', icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3', urls: ['purchase-return.html', 'sales-return.html'] },
                    { name: 'Wastage / Damage', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7', url: 'damage.html' },
                ]
            },
            {
                name: 'HR & People',
                items: [
                    { name: 'Employees', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', url: 'employees.html' },
                    { name: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857', url: 'customers.html' },
                    { name: 'Suppliers', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', url: 'suppliers.html' },
                ]
            },
            {
                name: 'Accounting',
                items: [
                    { name: 'Purchase', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', url: 'purchase.html' },
                    { name: 'Transactions', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5', url: 'accounting.html' },
                    { name: 'Dues & Receivables', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', url: 'dues.html' },
                    { name: 'Cashflow', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4', url: 'cashflow.html' },
                    { name: 'Installments', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2', url: 'installments.html' },
                ]
            },
            {
                name: 'System',
                items: [
                    { name: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2', url: 'reports.html' },
                    { name: 'Marketing', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15', url: 'marketing.html' },
                    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066', url: 'settings.html' }
                ]
            }
        ];

        let navHtml = '';
        groups.forEach(group => {
            navHtml += `<div class="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">${group.name}</div>`;
            group.items.forEach(item => {
                const isActive = item.url === currentPath || (item.urls && item.urls.includes(currentPath));
                if (item.urls) {
                    // Logic for dropdown if needed, but for now we'll just link to first or use a custom badge
                    navHtml += `
                        <div class="group relative">
                            <button onclick="this.nextElementSibling.classList.toggle('hidden')" class="w-full flex items-center justify-between px-4 py-2.5 mb-1 rounded-xl transition-colors font-medium text-sm ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}">
                                <div class="flex items-center gap-3">
                                    <svg class="w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                                    ${item.name}
                                </div>
                                <svg class="w-4 h-4 text-slate-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div class="${isActive ? '' : 'hidden'} pl-11 pr-4 space-y-1 mb-2">
                                ${item.urls.map(url => `
                                    <a href="${url}" class="block py-1 text-xs font-medium ${currentPath === url ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800'} transition-colors">${url.replace('.html', '').replace('-', ' ').toUpperCase()}</a>
                                `).join('')}
                            </div>
                        </div>
                    `;
                } else {
                    navHtml += `
                        <a href="${item.url}" class="flex items-center gap-3 px-4 py-2.5 mb-1 rounded-xl transition-colors font-medium text-sm ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}">
                            <svg class="w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path></svg>
                            ${item.name}
                        </a>
                    `;
                }
            });
        });

        const layoutHtml = `
            <div class="app-container">
                <!-- Sidebar Overlay -->
                <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden hidden transition-opacity opacity-0 cursor-pointer"></div>
                
                <!-- Sidebar -->
                <aside id="sidebar" class="sidebar fixed lg:static top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col custom-shadow shrink-0 transition-transform lg:translate-x-0 -translate-x-full">
                    <!-- Logo / Brand -->
                    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg custom-shadow">
                                N
                            </div>
                            <span class="font-bold text-slate-800 text-lg tracking-tight">NextWeb<span class="text-primary-600">POS</span></span>
                        </div>
                        <button id="close-sidebar" class="lg:hidden text-slate-400 hover:text-slate-600 focus:outline-none">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <!-- Navigation -->
                    <nav class="flex-1 overflow-y-auto w-full px-3 py-2 custom-scrollbar">
                        ${navHtml}
                    </nav>

                    <!-- User / Logout -->
                    <div class="p-4 border-t border-slate-100 flex-shrink-0">
                        <button onclick="appLayout.logout()" class="flex items-center gap-3 px-4 py-2 w-full rounded-xl text-alert hover:bg-alert-bg transition-colors font-medium text-sm">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Logout
                        </button>
                    </div>
                </aside>

                <!-- Main Content wrapper -->
                <div class="main-content flex-grow relative pb-20 lg:pb-0" id="main-scroll-area">
                    <!-- Navbar -->
                    <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
                        <div class="flex items-center gap-4">
                            <button id="mobile-menu-btn" class="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <h1 class="text-xl font-bold text-slate-800 tracking-tight" id="page-title">${currentPath.replace('.html', '').charAt(0).toUpperCase() + currentPath.replace('.html', '').slice(1)}</h1>
                        </div>

                        <!-- Right Actions -->
                        <div class="flex items-center gap-2 sm:gap-4">
                            
                            <!-- Branch Selector (if multiple branches exist) -->
                            <div class="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 mr-2" id="branch-selector-container">
                                <select class="bg-transparent text-sm font-medium text-slate-700 border-none focus:ring-0 py-1 pl-3 pr-8 cursor-pointer" id="branch-selector">
                                    <option>${state.currentBranch || 'Main Branch'}</option>
                                    ${state.branches > 1 ? '<option>Branch 2</option>' : ''}
                                </select>
                            </div>

                            <!-- Notification -->
                            <button class="p-2 relative text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-alert rounded-full border-2 border-white"></span>
                            </button>

                            <!-- Profile -->
                            <div class="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(state.ownerName || 'Admin')}&background=eff6ff&color=2563eb" class="w-9 h-9 rounded-full custom-shadow border border-slate-100" alt="Avatar">
                                <div class="hidden md:flex flex-col">
                                    <span class="text-sm font-semibold text-slate-800 leading-tight">${state.ownerName || 'Admin User'}</span>
                                    <span class="text-xs text-slate-500 font-medium">${state.role || 'System Admin'}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <!-- The Content goes here. We will move the existing content into this container -->
                    <main class="flex-grow p-4 sm:p-6 lg:p-8 relative" id="page-content-wrapper">
                        <!-- Content will be moved here via JS -->
                    </main>
                </div>
            </div>
            
            <!-- Toast Container -->
            <div id="toast-container" class="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>
        `;

        // Create a wrapper, move all current innerHTML of layoutContainer to 'page-content-wrapper'
        const rawContent = layoutContainer.innerHTML;
        layoutContainer.innerHTML = layoutHtml;
        document.getElementById('page-content-wrapper').innerHTML = rawContent;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-sidebar');

        const toggleSidebar = () => {
            const isOpen = sidebar.style.transform === 'translateX(0px)' || sidebar.classList.contains('translate-x-0');
            if (isOpen) {
                sidebar.style.transform = 'translateX(-100%)';
                overlay.classList.add('opacity-0', 'hidden');
                document.body.style.overflow = '';
            } else {
                sidebar.style.transform = 'translateX(0)';
                overlay.classList.remove('hidden');
                // Give it a tiny tick to execute transition
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
                document.body.style.overflow = 'hidden';
            }
        };

        if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
        if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
        if (overlay) overlay.addEventListener('click', toggleSidebar);

        // Listen for branch changes
        const branchSelector = document.getElementById('branch-selector');
        if (branchSelector) {
            branchSelector.addEventListener('change', (e) => {
                if (window.appState) {
                    window.appState.set({ currentBranch: e.target.value });
                    this.showToast('Branch switched to ' + e.target.value, 'success');
                    setTimeout(() => window.location.reload(), 1000); // Reload to reflect changes globally
                }
            });
        }
    }

    logout() {
        if (window.appState) {
            window.appState.clear();
        }
        window.location.href = 'index.html';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-enter p-4 rounded-xl shadow-lg border-l-4 pr-12 relative flex items-start gap-3 bg-white pointer-events-auto max-w-sm w-full`;

        let iconHtml = '';
        if (type === 'success') {
            toast.classList.add('border-success-500');
            iconHtml = `<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else if (type === 'error') {
            toast.classList.add('border-alert');
            iconHtml = `<svg class="w-6 h-6 text-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        } else {
            toast.classList.add('border-primary-500');
            iconHtml = `<svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
        }

        toast.innerHTML = `
            <div class="flex-shrink-0 pt-0.5">${iconHtml}</div>
            <div class="flex-grow">
                <p class="text-sm font-medium text-slate-800">${message}</p>
            </div>
            <button class="absolute top-4 right-3 text-slate-400 hover:text-slate-600 border-none bg-transparent" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 5000);
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.appLayout = new AppLayout();
});
