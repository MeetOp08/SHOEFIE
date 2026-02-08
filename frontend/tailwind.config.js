/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
           colors: {
  // 🌤 Backgrounds (warmer & softer)
  primary: '#f5f5f4',        // Warm light gray (Stone-100)
  secondary: '#e7e5e4',      // Slightly deeper section bg (Stone-200)

  // 🧱 Surfaces
  surface: '#ffffff',        // Cards / navbar
  'border-color': '#d6d3d1', // Soft neutral border

  // 🔥 Accent
  accent: '#ea580c',         // Premium orange CTA

  // 📝 Text
  'text-main': '#1c1917',    // Dark warm gray (not harsh black)
  'text-muted': '#57534e',   // Medium warm gray

  // Status
  success: '#16a34a',
  danger: '#dc2626',
}
,
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'sans-serif'], // You might need to import Poppins in index.css
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [],
}
