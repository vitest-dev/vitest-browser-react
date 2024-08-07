# vitest-browser-react

Render React components in Vitest Browser Mode. This library follows `testing-library` principles and exposes only [locators](https://vitest.dev/guide/browser/locators) and utilities that encourage you to write tests that closely resemble how your React components are used.

Requires `vitest` and `@vitest/browser` 2.1.0 or higher.

```tsx
import { render } from 'vitest-browser-react'
import { expect, test } from 'vitest'

test('counter button increments the count', async () => {
  const screen = render(<Component count={1} />)

  await screen.getByRole('button', { name: 'Increment' }).click()

  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

> [!NOTE]
> This library doesn't expose or use React's `act`. Instead, you should use Vitest's locators and `expect.element` API that have [retry-ability mechanism](https://vitest.dev/guide/browser/assertion-api) baked in.

`vitest-browser-react` also automatically injects `render` and `cleanup` methods on the `page`. Example:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // if the types are not picked up, add `vitest-browser-react` to
    // "compilerOptions.types" in your tsconfig or
    // import `vitest-browser-react` manually so TypeScript can pick it up
    setupFiles: ['vitest-browser-react'],
  },
})
```

```tsx
import { page } from '@vitest/browser/context'

test('counter button increments the count', async () => {
  const screen = page.render(<Component count={1} />)

  screen.cleanup()
})
```

Unlike `@testing-library/react`, `vitest-browser-react` cleans up the component before the test starts instead of after, so you can see the rendered result in your UI. To avoid auto-cleanup, import the `render` function from `vitest-browser-vue/pure`.

## Special thanks

- Inspired by [`@testing-library/react`](https://github.com/testing-library/react-testing-library)
