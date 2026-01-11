/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  ...sharedConfig,
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Royal Blue for academic feel
        "background-light": "#F9FAFB", // Light Gray
        "background-dark": "#111827", // Dark Gray/Black
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937",
        "border-light": "#E5E7EB",
        "border-dark": "#374151",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
