// eslint-disable-next-line no-undef
module.exports = {
  purge: ['./pages/**/*.tsx', './src/components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        almost_white: '#f8f8f8',
        salmon_fish: '#ffc3a0',
        newspaper_like: '#ededed',
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
