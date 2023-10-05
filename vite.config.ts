import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/comic_sans_ms_tribute/",
  plugins: [preact()],
})
