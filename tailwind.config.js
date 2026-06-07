export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        banking: {
          dark: '#0F172A',
          slate: '#152238',
          accent: '#38BDF8',
          surface: '#1E293B',
          soft: '#334155',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
