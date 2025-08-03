/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        '3xl': '1600px',
      },
      colors: {
        'primary': '#ef8354',
        'primary-hover': '#d76c3c',
        'secondary': '#4f5d75',
        'text-primary': '#2d3142',
        'text-muted': '#bfc0c0',
        'border': '#bfc0c0',
        'card-bg': '#ffffff',
        'sidebar-bg': '#4f5d75',
        'header-bg': '#2d3142',
        'code-bg': '#f4f4f4',
        'input-border': '#bfc0c0',
        'input-focus': '#ef8354',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Menlo', 'monospace'],
      },
      fontSize: {
        'sm': '14px',
        'md': '16px',
        'lg': '20px',
        'xl': '28px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 6px rgba(239, 131, 84, 0.3)',
      },
    },
  },
  plugins: [],
}
