import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  base: "/Daily-Flow/",
  plugins: [react()],
  server: {
    port: 8080,
  },
})
