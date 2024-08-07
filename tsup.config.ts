import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts', './src/pure.ts'],
  format: ['esm'],
  dts: true,
})
