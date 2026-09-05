import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@app':      path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared':   path.resolve(__dirname, './src/shared'),
      '@layouts':  path.resolve(__dirname, './src/layouts'),
      '@lib':      path.resolve(__dirname, './src/lib'),
      '@store':    path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types':    path.resolve(__dirname, './src/types'),
      '@utils':    path.resolve(__dirname, './src/utils'),
      '@styles':   path.resolve(__dirname, './src/styles'),
      '@assets':   path.resolve(__dirname, './src/assets'),
    }
  }
})
