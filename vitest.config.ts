import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'react',
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
  },
})
