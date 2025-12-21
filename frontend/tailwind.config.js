/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // "Modern Luxury" Palette
                primary: '#1A1A1A',     // Deepest Black (Backgrounds)
                secondary: '#FFFFFF',   // Stark White (Text)
                accent: '#D4AF37',      // Metallic Gold (Buttons/Highlights)
                'gray-dark': '#2C2C2C', // Charcoal (Cards)
                'gray-light': '#F5F5F5',// Off-white (Secondary BG)
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Body text
                display: ['Poppins', 'sans-serif'], // Headings
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'neon': '0 0 10px #D4AF37, 0 0 20px #D4AF37',
            }
        },
    },
    plugins: [],
}
