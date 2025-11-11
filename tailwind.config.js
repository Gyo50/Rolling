import scrollbarHide from 'tailwind-scrollbar-hide';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#F8F0FF",
          200: "#ECD9FF",
          300: "#DCB9FF",
          400: "#C894FD",
          500: "#AB57FF",
          600: "#9935FF",
          700: "#861DEE",
          800: "#6E0AD1",
          900: "#5603A7",
        },
        beige: {
          100: "#FFF0D6",
          200: "#FFE2AD",
          300: "#FFC583",
          400: "#FFAE65",
          500: "#FF8832",
        },
        blue: {
          100: "#E2F5FF",
          200: "#B1E4FF",
          300: "#7CD2FF",
          400: "#34B9FF",
          500: "#00A2FE",
        },
        green: {
          100: "#E4FBDC",
          200: "#D0F5C3",
          300: "#9BE282",
          400: "#60CF37",
          500: "#2BA600",
        },
        gray: {
          100: '#F6F6F6',
          200: '#EEEEEE',
          300: '#CCCCCC',
          400: '#999999',
          500: '#555555',
          600: '#4A4A4A',
          700: '#3A3A3A',
          800: '#2B2B2B',
          900: '#181818',
        },
        white:'#ffffff',
        black:'#000000',
        error: '#DC3A3A',
        surface: '#F6F8FF',
      },
      fontSize: {
        "28-bold": ["28px", { lineHeight: "36px", fontWeight: "700" }],

        "24-bold": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "24-regular": ["24px", { lineHeight: "32px", fontWeight: "400" }],

        "20-bold": ["20px", { lineHeight: "28px", fontWeight: "700" }],
        "20-regular": ["20px", { lineHeight: "28px", fontWeight: "400" }],

        "18-bold": ["18px", { lineHeight: "26px", fontWeight: "700" }],
        "18-regular": ["18px", { lineHeight: "26px", fontWeight: "400" }],

        "16-bold": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "16-regular": ["16px", { lineHeight: "24px", fontWeight: "400" }],

        "15-bold": ["15px", { lineHeight: "22px", fontWeight: "700" }],
        "15-regular": ["15px", { lineHeight: "22px", fontWeight: "400" }],

        "14-bold": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "14-regular": ["14px", { lineHeight: "20px", fontWeight: "400" }],

        "12-regular": ["12px", { lineHeight: "18px", fontWeight: "400" }],
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    scrollbarHide
  ],
};
