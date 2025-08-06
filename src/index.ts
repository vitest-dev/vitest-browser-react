import { page } from '@vitest/browser/context'
import { beforeEach } from 'vitest'
import { cleanup, render } from './pure'

export { render, renderHook, cleanup } from './pure'
export type { ComponentRenderOptions, RenderHookOptions, RenderHookResult, RenderOptions, RenderResult } from './pure'

page.extend({
  render,
  [Symbol.for('vitest:component-cleanup')]: cleanup,
})

beforeEach(async () => {
  await cleanup()
})

declare module '@vitest/browser/context' {
  interface BrowserPage {
    render: typeof render
  }
}
