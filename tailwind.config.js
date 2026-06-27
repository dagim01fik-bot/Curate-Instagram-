/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        surfaceHigh: '#1C1C26',
        border: '#2A2A38',
        accent: '#6366F1',
        positive: '#22C55E',
        negative: '#EF4444',
        skip: '#F59E0B',
        textPrimary: '#F1F1F5',
        textSecondary: '#9898B0',
        textMuted: '#55556A',
      },
    },
  },
  plugins: [],
};
