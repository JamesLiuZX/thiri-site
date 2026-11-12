/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable (an "R G B" triplet in app/globals.css), so
// the palette lives in one place.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        script: ["var(--font-script)", "cursive"],
      },
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        oat: token("oat"),
        fg: token("fg"),
        muted: token("muted"),
        line: token("line"),
        accent: { DEFAULT: token("accent"), fg: token("accent-fg") },
        rose: token("rose"),
        blush: token("blush"),
        sage: token("sage"),
        fish: token("fish"),
        peach: token("peach"),
        night: token("night"),
        lamp: token("lamp"),
        berry: token("berry"),
        bubble: token("bubble"),
        sea: token("sea"),
        honey: token("honey"),
        rec: token("rec"),
        ink: token("ink"),
      },
      boxShadow: {
        print: "0 1px 1px rgba(43,33,28,0.06), 0 14px 30px -14px rgba(43,33,28,0.35)",
        lift: "0 2px 4px rgba(43,33,28,0.08), 0 30px 50px -24px rgba(43,33,28,0.45)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
      },
    },
  },
  plugins: [],
}
