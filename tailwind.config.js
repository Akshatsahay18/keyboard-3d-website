/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        fog: {
          top: "#d8dee3",
          base: "#c8d0d7",
          edge: "#a8b1bb",
          shadow: "#8f99a4"
        }
      },
      boxShadow: {
        mist: "0 24px 80px rgba(83, 94, 108, 0.12)"
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
