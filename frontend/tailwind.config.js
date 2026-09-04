/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ghoogle: {
          bg: '#0a0c10',
          panel: '#101319',
          line: '#1e2430',
          blue: '#4f8cff',
          text: '#e8ecf3',
          dim: '#8892a3',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%,-3%)' },
          '30%': { transform: 'translate(3%,2%)' },
          '50%': { transform: 'translate(-3%,1%)' },
          '70%': { transform: 'translate(2%,-2%)' },
          '90%': { transform: 'translate(-1%,3%)' },
        },
        driftglow: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-14px) scale(1.04)', opacity: '0.85' },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-6px,3px)' },
          '40%': { transform: 'translate(5px,-4px)' },
          '60%': { transform: 'translate(-4px,-3px)' },
          '80%': { transform: 'translate(6px,2px)' },
        },
      },
      animation: {
        flicker: 'flicker 6s infinite',
        grain: 'grain 0.4s steps(2) infinite',
        driftglow: 'driftglow 7s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}

