import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // fixed port
    strictPort: true, // fails if 5173 is already in use, instead of switching to 5174
  },
})
