/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B2545',
          navyLight: '#133E6D',
          saffron: '#FF671F',
          saffronLight: '#FFF1E8',
          green: '#046A38',
          greenLight: '#E8F5EE',
          ash: '#4A5568',
          border: '#D2D6DC',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#1E293B',
          gold: '#C59B27'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        gov: '0 1px 3px 0 rgba(11, 37, 69, 0.08), 0 1px 2px 0 rgba(11, 37, 69, 0.04)',
        'gov-md': '0 4px 6px -1px rgba(11, 37, 69, 0.1), 0 2px 4px -1px rgba(11, 37, 69, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(11, 37, 69, 0.1), 0 4px 6px -2px rgba(11, 37, 69, 0.05)',
      }
    },
  },
  plugins: [],
}
