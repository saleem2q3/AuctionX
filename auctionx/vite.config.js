// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/AuctionX/',  // ✅ match your GitHub repo name
  plugins: [react()],
})
