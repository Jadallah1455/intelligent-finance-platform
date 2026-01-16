/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fdf2f4',
                    100: '#fce7ea',
                    200: '#f8d0d8',
                    300: '#f2aab8',
                    400: '#e9768c',
                    500: '#d84663',
                    600: '#b01e42',
                    700: '#8a1538',
                    800: '#75102e',
                    900: '#63112a',
                    950: '#2f0511',
                },
                slate: {
                    850: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
