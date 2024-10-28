const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const svgToDataUri = require("mini-svg-data-uri");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "rgb(230, 55, 24)",
          200: "rgb(232, 75, 47)",
          300: "rgb(235, 94, 70)",
          400: "rgb(240, 135, 116)",
          500: "rgb(250, 215, 208)",
          600: "rgb(252, 235, 231)",
          700: "rgb(253, 242, 240)",
          800: "rgb(254, 250, 250)",
        },
        secondary: {
          100: "rgb(15, 15, 15)",
          200: "rgb(20, 20, 20)",
          300: "rgb(25, 25, 25)",
          400: "rgb(30, 30, 30)",
          500: "rgb(38, 38, 38)",
          600: "rgb(45, 45, 45)",
          700: "rgb(56, 56, 56)",
          800: "rgb(64, 64, 64)",
        },
        teritiary: {
          100: "rgb(102, 102, 102)",
          200: "rgb(117, 117, 117)",
          300: "rgb(153, 153, 153)",
          400: "rgb(204, 204, 204)",
          500: "rgb(217, 217, 217)",
          600: "rgb(230, 230, 230)",
          700: "rgb(242, 242, 242)",
          800: "rgb(252, 252, 252)",
        },
      },
    },
  },
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({
    ":root": newVars,
  });
}
