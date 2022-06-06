module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /accent-[0-4]/
    }
  ],
  theme: {
    extend: {
      colors: {
        "accent-1": "rgb(245, 69, 0)",
        "accent-2": "rgb(0, 220, 245)",
        "accent-3": "rgb(245, 175, 0)",
        "accent-4": "rgb(27, 197, 55)",
      }
    },
  },
  plugins: [],
}
