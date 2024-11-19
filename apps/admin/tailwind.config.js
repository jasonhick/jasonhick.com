const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      // ... other extensions
    }
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.card': {
          '@apply bg-gray-900 rounded-xl border-2 border-gray-700/50': {},
        },
        '.card-header': {
          '@apply px-4 py-3 bg-gray-800 rounded-t-xl': {},
        },
        '.card-title': {
          '@apply mb-0 text-sm font-semibold text-gray-200 uppercase tracking-wide flex items-center': {},
        },
        '.card-body': {
          '@apply p-4 text-gray-300': {},
        },
        '.empty-state': {
          '@apply text-sm text-gray-400 p-4 text-center border-2 border-dashed border-gray-700/50 rounded-md': {},
        },
        '.list-item': {
          '@apply block px-4 py-2 rounded-md border border-transparent hover:bg-gray-800 hover:border-gray-700/50 transition-all duration-200 ease-in-out text-gray-300': {},
        },
      })
    },
    function({ addBase }) {
      addBase({
        'body': {
          '@apply bg-gray-900 text-gray-300 text-base leading-relaxed': {},
        },
        'p': {
          '@apply mb-4': {},
        },
        'a': {
          '@apply text-green-500 hover:text-green-400 transition-colors duration-200': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-green-500/50': {},
        },
        'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], input[type="url"], input[type="date"], select, textarea': {
          '@apply w-full rounded-lg border border-gray-700/50 px-4 py-3 bg-gray-50 text-gray-900': {},
          '@apply focus:ring-2 focus:ring-green-500/50 focus:border-green-600 focus:outline-none': {},
          '@apply disabled:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-75': {},
          '@apply placeholder-gray-500': {},
        },
        'input[type="checkbox"], input[type="radio"]': {
          '@apply w-5 h-5 rounded border-gray-700/50 bg-gray-50 text-green-600': {},
          '@apply focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900': {},
          '@apply disabled:opacity-75 disabled:cursor-not-allowed': {},
        },
        '[type="submit"], [type="button"]': {
          '@apply bg-green-600 text-white font-semibold py-3 px-6 rounded-lg': {},
          '@apply hover:bg-green-700 transition-colors': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2': {},
          '@apply disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:hover:bg-gray-600': {},
        },
        'label': {
          '@apply block text-sm font-semibold text-violet-100 mb-2': {},
        },
        'label.required::after': {
          content: '"*"',
          '@apply text-red-500 ml-1': {},
        },
        '.form-helper': {
          '@apply mt-2 text-sm text-gray-400': {},
        },
        '.error input, .error select, .error textarea': {
          '@apply border-red-500 border-2 focus:ring-red-500 focus:border-red-500': {},
        },
        '.error-message': {
          '@apply text-sm font-medium text-red-400 mt-2': {},
        },
        'h1': {
          '@apply text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-4': {},
        },
        'h2': {
          '@apply text-xl md:text-2xl lg:text-3xl font-semibold text-gray-200 mb-3': {},
        },
        'h3': {
          '@apply text-lg md:text-xl lg:text-2xl font-medium text-gray-200 mb-3': {},
        },
        'h4': {
          '@apply text-base md:text-lg lg:text-xl font-medium text-gray-300 mb-2': {},
        },
        'h5': {
          '@apply text-sm md:text-base lg:text-lg font-medium text-gray-300 mb-2': {},
        },
      })
    },
  ]
};
