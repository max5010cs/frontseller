/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFBFB',
        surface: '#FFFFFF',
        primary: '#E91E63', // A vibrant pink
        'primary-focus': '#D81B60',
        'primary-content': '#FFFFFF',
        secondary: '#4CAF50', // A complementary green
        'secondary-focus': '#43A047',
        'secondary-content': '#FFFFFF',
        accent: '#FFC107', // A bright yellow accent
        'accent-focus': '#FFB300',
        'accent-content': '#333333',
        neutral: '#F5F5F5',
        'neutral-focus': '#E0E0E0',
        'base-100': '#FFFFFF',
        'base-content': '#333333',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
      },
      keyframes: {
        'gradient-flow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        'gradient-flow': 'gradient-flow 15s ease infinite',
        'slide-in': 'slide-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
    },
  },
  plugins: [],
};
