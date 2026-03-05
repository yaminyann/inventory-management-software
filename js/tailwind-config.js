tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb', // target Deep Blue
                    700: '#1d4ed8', // slightly darker
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                success: {
                    DEFAULT: '#10b981', // Emerald
                    hover: '#059669',
                    bg: '#d1fae5',
                    text: '#047857',
                },
                alert: {
                    DEFAULT: '#ef4444', // Red Alert
                    hover: '#dc2626',
                    bg: '#fee2e2',
                    text: '#b91c1c',
                },
                surface: '#ffffff',
                background: '#f8fafc', // Soft Gray
                darkText: '#0f172a',
                lightText: '#64748b'
            },
            fontFamily: {
                sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1rem', // rounded-2xl
            },
            spacing: {
                '2': '0.5rem', // 8px spacing system basis
                '4': '1rem',
                '6': '1.5rem',
                '8': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
            }
        }
    }
}
