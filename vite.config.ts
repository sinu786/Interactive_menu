import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Try to load HTTPS certs if available
let httpsConfig: { key: Buffer; cert: Buffer } | undefined = undefined
try {
  const certPath = path.resolve(__dirname, 'localhost.pem')
  const keyPath = path.resolve(__dirname, 'localhost-key.pem')
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }
  }
} catch {
  // Certs not available or not readable - use HTTP
  console.log('HTTPS certs not available, using HTTP')
}

// Plugin to set correct MIME types for 3D files
function usdzMimePlugin(): Plugin {
  return {
    name: 'usdz-mime-type',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.usdz')) {
          res.setHeader('Content-Type', 'model/vnd.usdz+zip')
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), usdzMimePlugin()],
  server: {
    https: httpsConfig,
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.usdz'],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
