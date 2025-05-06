
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/jdgenerator/',
  plugins: [react()],
  base: '/jd-generator/', 
  // base: '/jdgenerator/',
  // base: '/jdgenerator/',
  // base: '/',
  // base: '/jdgenerator/',
})