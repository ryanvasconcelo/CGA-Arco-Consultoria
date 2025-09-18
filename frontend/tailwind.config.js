// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'brand-gold': {
                    DEFAULT: '#FBBF24', // Amarelo/Âmbar 400
                    light: '#FCD34D',   // Amarelo/Âmbar 300
                    dark: '#F59E0B',    // Amarelo/Âmbar 500
                },
            },
        },
    },
    plugins: [],
}