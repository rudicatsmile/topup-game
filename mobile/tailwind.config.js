/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(240, 12%, 8%)",
        foreground: "hsl(0, 0%, 96%)",
        card: "hsl(240, 10%, 12%)",
        primary: "hsl(258, 90%, 60%)",
        accent: "hsl(190, 95%, 50%)",
        border: "hsl(240, 8%, 20%)",
        muted: "hsl(240, 10%, 16%)",
      },
    },
  },
  plugins: [],
};
