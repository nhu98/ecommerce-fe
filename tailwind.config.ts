import type {Config} from "tailwindcss";

export default {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    extend: {
      fontFamily: {
        // 👇 Add CSS variables
        mono: ["var(--font-roboto-mono)"],
      }, colors: {
        background: "var(--background)", foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
