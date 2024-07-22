module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'grass-500': '#78c850',
        'grass-300': '#a8e050',
        'fire-500': '#f08030',
        'fire-300': '#f0a880',
        'water-500': '#6890f0',
        'water-300': '#a8c0f0',
        // Add more types as needed
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
