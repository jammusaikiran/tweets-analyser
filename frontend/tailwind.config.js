module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // replaces purge (for Tailwind v3+)
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fade: "fade 1s ease-in-out",
        "slide-up": "slideUp 0.7s ease-in-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
