import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = (env.VITE_API_URL || 'https://truemarriage.in').replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_BUILD_VERSION__: JSON.stringify(mode === 'production' ? Date.now().toString() : 'dev'),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: true,
        },
        '/static': {
          target: apiUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
