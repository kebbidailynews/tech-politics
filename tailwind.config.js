/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "inherit",
            a: { color: "inherit", textDecoration: "underline" },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"), // 👈 enables text clamping (used on titles)
    require("@tailwindcss/aspect-ratio"), // 👈 helpful for responsive images
    require("@tailwindcss/typography"), // 👈 optional: for styling rich blog content
  ],
};
