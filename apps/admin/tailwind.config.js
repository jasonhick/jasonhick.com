const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

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
          '@apply bg-gray-800 rounded-xl border-2 border-gray-700': {},
        },
        '.card-header': {
          '@apply px-4 py-3 border-b-2 border-gray-700 bg-gray-900 rounded-t-xl': {},
        },
        '.card-title': {
          '@apply text-sm font-semibold text-gray-200 uppercase tracking-wide flex items-center': {},
        },
        '.card-body': {
          '@apply p-4 text-gray-300': {},
        },
        '.required': {
          '@apply after:content-["*"] after:ml-0.5 after:text-red-500': {}
        },
        '.empty-state': {
          '@apply text-sm text-gray-500 p-4 text-center border-2 border-dashed border-gray-700 rounded-md': {},
        },
        '.list-item': {
          '@apply block px-4 py-2 rounded-md border border-transparent hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 ease-in-out text-gray-300': {},
        },
        '.list-container': {
          '@apply bg-gray-800 rounded-lg p-6 border border-gray-700': {},
        }
      })
    },
    function({ addBase }) {
      addBase({
        'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], input[type="url"], input[type="date"], select, textarea': {
          '@apply w-full rounded-lg border border-gray-300 px-4 py-3 bg-white': {},
          '@apply focus:ring-2 focus:ring-blue-500/50 focus:border-blue-600 focus:outline-none': {},
          '@apply disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-75': {},
        },
        'input[type="checkbox"], input[type="radio"]': {
          '@apply w-5 h-5 rounded border-gray-400 text-blue-600': {},
          '@apply focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2': {},
          '@apply disabled:opacity-75 disabled:cursor-not-allowed': {},
        },
        'input[type="submit"], button[type="submit"]': {
          '@apply bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg': {},
          '@apply hover:bg-blue-700 transition-colors': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2': {},
          '@apply disabled:opacity-75 disabled:cursor-not-allowed': {},
        },
        'label': {
          '@apply block text-sm font-semibold text-gray-200 mb-2': {},
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
      })
    },
  ]
};
