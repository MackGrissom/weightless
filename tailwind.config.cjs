module.exports = {
  content:["./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      
      'koromiko': {
        '50': '#fff9ed',
        '100': '#fff1d4',
        '200': '#ffdfa9',
        '300': '#ffbd59',
        '400': '#fea439',
        '500': '#fc8713',
        '600': '#ed6c09',
        '700': '#c55109',
        '800': '#9c4010',
        '900': '#7e3610',
        'main': '#fea439'
    },
  
    
    
    },
    
    
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
    ('@tailwindcss/aspect-ratio'),('@tailwindcss/typography')
  ],
}
