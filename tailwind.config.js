/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#FFFDF5',
        foreground: '#1E293B',
        muted: '#F1F5F9',
        'muted-fg': '#64748B',
        accent: '#8B5CF6',
        secondary: '#F472B6',
        tertiary: '#FBBF24',
        quaternary: '#34D399',
        border: '#1E293B',
        card: '#FFFFFF',
      },
      boxShadow: {
        pop: '4px 4px 0px 0px #1E293B',
        'pop-lg': '8px 8px 0px 0px #1E293B',
        'pop-hover': '6px 6px 0px 0px #1E293B',
        'pop-active': '2px 2px 0px 0px #1E293B',
        'pop-violet': '8px 8px 0px 0px #8B5CF6',
        'pop-pink': '8px 8px 0px 0px #F472B6',
        'pop-yellow': '8px 8px 0px 0px #FBBF24',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite 0.5s',
        blink: 'blink 2s ease-in-out infinite',
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(8deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
