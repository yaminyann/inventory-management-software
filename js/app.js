/**
 * General Utilities & Components
 */

const UI = {
    showToast: (msg, type) => {
        if (window.appLayout) window.appLayout.showToast(msg, type);
    },

    confirmModal: (title, message, onConfirm) => {
        const modalHtml = `
            <div id="confirm-modal" class="fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onclick="document.getElementById('confirm-modal').remove()"></div>
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative z-10 transform transition-all scale-100">
                    <div class="mb-4">
                        <div class="w-12 h-12 rounded-full bg-alert-bg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h3 class="text-lg font-bold text-slate-800">${title}</h3>
                        <p class="text-sm text-slate-500 mt-2">${message}</p>
                    </div>
                    <div class="flex items-center justify-end gap-3 mt-6">
                        <button class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none" onclick="document.getElementById('confirm-modal').remove()">Cancel</button>
                        <button id="confirm-action-btn" class="px-4 py-2 text-sm font-semibold text-white bg-alert hover:bg-alert-hover rounded-lg custom-shadow transition-colors focus:outline-none">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('confirm-action-btn').addEventListener('click', () => {
            onConfirm();
            document.getElementById('confirm-modal').remove();
        });
    }
};

window.UI = UI;
