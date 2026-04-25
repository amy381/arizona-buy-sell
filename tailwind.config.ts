// NOTE: This project uses Tailwind CSS v4, which is configured via CSS (@theme in globals.css)
// rather than tailwind.config.ts. This file is kept for reference and documentation purposes.
// All theme tokens (colors, fonts) are defined in app/globals.css under @theme inline.
//
// Design tokens (defined in globals.css @theme):
//   colors:
//     brand-slate: #212529
//     linen:       #F0EBE3
//     brand-stone: #B8A898
//     steel:       #2E3338
//   fontFamily:
//     alex-brush:  var(--font-alex-brush)  → Alex Brush (Google Fonts)
//     montserrat:  var(--font-montserrat)   → Montserrat (Google Fonts)
//
// Content paths scanned by Tailwind v4 (auto-detected):
//   ./app/**/*.{ts,tsx}
//   ./components/**/*.{ts,tsx}

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-slate": "#212529",
        linen: "#F0EBE3",
        "brand-stone": "#B8A898",
        steel: "#2E3338",
      },
      fontFamily: {
        "alex-brush": ["var(--font-alex-brush)", "cursive"],
        montserrat: ["var(--font-montserrat)", "'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
