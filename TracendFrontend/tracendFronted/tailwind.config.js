module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust to your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        'tracend': ['Poppins', 'sans-serif'], // Tracend specific font
      },
    },
  },
  plugins: [
    'tailwindcss',
    'autoprefixer',
  ],  darkMode: 'class', // or 'media' based on how you want dark mode to trigger

};
