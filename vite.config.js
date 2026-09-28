import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// el front de las instituciones usa el 5173, este va en el 5174
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
})
