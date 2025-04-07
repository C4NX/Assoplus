import daisyui from "daisyui"
import tailwindTypography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  content: [
    "./pages/**/*.{vue,js,jsx,mjs,ts,tsx}",
  ],
  daisyui: {
    themes: ["emerald"],
  },
  theme: {
    extend: {
      backgroundImage: {
        city: "url('/image/background/city.webp')",
        rainbow: "url('/image/background/rainbow.webp')",
        grid: "linear-gradient(90deg,#8080801a 1px,transparent 0),linear-gradient(180deg,#8080801a 1px,transparent 0)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      backgroundColor: {
        grid: "rgb(255 255 255 / var(--tw-bg-opacity))",
      },
    },
  },
  plugins: [daisyui, tailwindTypography],
}
