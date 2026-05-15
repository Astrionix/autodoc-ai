/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Deep Blue
        secondary: "#4F46E5", // Indigo
        background: "#F9FAFB", // Light gray
        textDark: "#111827", // Dark gray
        accent: "#10B981", // Green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headings: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
