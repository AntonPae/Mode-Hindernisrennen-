import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Mode-Hindernisrennen-/' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
})
