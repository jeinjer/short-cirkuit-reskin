import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const vendorChunkGroups = {
  react: ['react', 'react-dom', 'react-router-dom'],
  motion: ['framer-motion'],
  forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
  auth: ['@react-oauth/google', 'js-cookie', 'jwt-decode'],
  icons: ['lucide-react', 'react-icons'],
  ui: ['sweetalert2', 'sonner'],
  charting: ['chart.js', 'react-chartjs-2'],
}

function getManualChunk(id) {
  if (!id.includes('node_modules')) {
    return undefined
  }

  const normalizedId = id.replace(/\\/g, '/')

  for (const [chunkName, packages] of Object.entries(vendorChunkGroups)) {
    const matchesChunk = packages.some(
      (pkg) =>
        normalizedId.includes(`/node_modules/${pkg}/`) || normalizedId.includes(`/node_modules/.pnpm/${pkg}@`)
    )

    if (matchesChunk) {
      return `vendor-${chunkName}`
    }
  }

  return 'vendor-misc'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
})
