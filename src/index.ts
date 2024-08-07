import { page } from '@vitest/browser/context'
import { beforeEach } from 'vitest'
import { cleanup, render } from './pure'

export { render, cleanup } from './pure'
export type { ComponentRenderOptions, RenderResult } from './pure'

page.extend({
  render,
  [Symbol.for('vitest:component-cleanup')]: cleanup,
})

beforeEach(() => {
  cleanup()
})

declare module '@vitest/browser/context' {
  interface BrowserPage {
    render: typeof render
  }
}
