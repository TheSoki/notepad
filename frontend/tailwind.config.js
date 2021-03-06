// eslint-disable-next-line no-undef
module.exports = {
  purge: ['./pages/**/*.tsx', './src/components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        almost_white: '#F8F8F8',
        salmon_fish: '#ffc3a0',
      },
    },
    screens: {
      phone: '300px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1440px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
