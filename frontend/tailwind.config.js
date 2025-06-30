/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#170E3D",
        secondary: "#F3AB14",
        dark: "#1A2E62",
        light: "#3DD98D",
        info: "#2F80ED",
        success: "#27AE60",
        warning: "#E2B93B",
        error: "#EB5757",
        black: "#030712",
        white: "#FFFFFF",
        gray1: "#282424",
        gray2: "#6D6464",
        gray3: "#D4D4D4",
        gray4: "#BDBDBD",
        'ribbon-cream': '#FEF9ED',
        'ribbon-cream-dark': '#F9F1E7',
        'ribbon-blue': '#F0F8FF',
        'ribbon-blue-dark': '#E6F3FF',
        'ribbon-text': '#170E3D',
        'ribbon-text-hover': '#2D1B69',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'slide-in-left': 'slideInLeft 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-right': 'slideInRight 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
      },
      keyframes: {
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-100%) rotate(0deg) scale(0.8)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateX(0%) rotate(15deg) scale(1.05)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0%) rotate(8deg) scale(1)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%) rotate(0deg) scale(0.8)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateX(0%) rotate(-15deg) scale(1.05)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0%) rotate(-8deg) scale(1)',
          },
        },
        floatGentle: {
          '0%, 100%': { transform: 'rotate(8deg) translateY(0px)' },
          '50%': { transform: 'rotate(10deg) translateY(-4px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'rotate(-8deg) translateY(0px)' },
          '50%': { transform: 'rotate(-10deg) translateY(4px)' },
        },
      },
    },
  },
};

