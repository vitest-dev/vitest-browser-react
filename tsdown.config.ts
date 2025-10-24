import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/pure.tsx'],
  format: ['esm'],
  dts: true,
})
