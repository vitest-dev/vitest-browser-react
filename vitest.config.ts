import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ['vitest-browser-react'] },
  resolve: {
    conditions: process.env.TEST_PROD ? [] : ['vdev'],
  },
  test: {
    printConsoleTrace: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
