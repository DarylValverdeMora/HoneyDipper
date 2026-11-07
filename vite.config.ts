import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { honeyHead } from './scripts/vite-head'

// base './' permite servir la build desde cualquier ruta (para compartir el prototipo por link).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), honeyHead()],
  build: {
    rolldownOptions: {
      output: {
        // React y las librerías de movimiento en su propio archivo: cambian poco y quedan en caché.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](gsap|@gsap|lenis)[\\/]/ },
          ],
        },
      },
    },
  },
})
