module.exports = {
  content:["./src/**/*.{js,jsx}"],
  theme: {
    colors: {
      
        crail1: '#fcf5f4',
        crail2: '#f9eae7',
        crail3: '#f5d8d3',
        crail4: '#edbcb4',
        crail5: '#e19588',
        crail6: '#d27161',
        caril7: '#bf5b4a',
        crail8: '#9e4637',
        crail9: '#843c30',
        crail10: '#6e372e',
    },
    
    
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
    ('@tailwindcss/aspect-ratio'),('@tailwindcss/typography')
  ],
}
