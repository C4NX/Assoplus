import daisyui from "daisyui"
import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  content: [
    "./pages/**/*.{vue,js,jsx,mjs,ts,tsx}",
  ],
  daisyui: {
    themes: ["emerald"],
  },
  plugins: [daisyui],
}
