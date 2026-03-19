/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
  // 🌤 Backgrounds
  primary: '#f5f5f4',
  secondary: '#e7e5e4',

  // 🧱 Surfaces
  surface: '#ffffff',
  'border-color': '#d6d3d1',

  // 🔥 Accent
  accent: '#ea580c',

  // 📝 Text
  'text-main': '#000000ff',   // Headings
  'text-body': '#292524',   // Paragraphs
  'text-muted': '#6b7280',  // Secondary text
  'text-light': '#9ca3af',  // Hints/placeholders

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
