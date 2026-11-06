import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' permite servir la build desde cualquier ruta (para compartir el prototipo por link).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
