# vitest-browser-react

Render React components in Vitest Browser Mode. This library follows `testing-library` principles and exposes only [locators](https://vitest.dev/guide/browser/locators) and utilities that encourage you to write tests that closely resemble how your React components are used.

`vitest-browser-react` aims to deliver a good developer experience in Vitest Browser Mode by incorporating the [locators API](https://vitest.dev/guide/browser/locators.html) and [retry-ability](https://vitest.dev/guide/browser/assertion-api.html) mechanism directly into the `render` result. This allows you to call user methods without needing to verify the element's existence or wait for external events (like API calls) to render the element.

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

> 💡 This library doesn't expose or use React's `act`. Instead, you should use Vitest's locators and `expect.element` API that have [retry-ability mechanism](https://vitest.dev/guide/browser/assertion-api) baked in.

`vitest-browser-react` also automatically injects `render` method on the `page`. Example:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./setup-file.ts'],
    browser: {
      name: 'chromium',
      enabled: true,
    },
  },
})

// ./setup-file.ts
// add an import at the top of your setup file so TypeScript can pick up types
import 'vitest-browser-react'
```

```tsx
import { page } from '@vitest/browser/context'

test('counter button increments the count', async () => {
  const screen = page.render(<Component count={1} />)

  screen.cleanup()
})
```

Unlike `@testing-library/react`, `vitest-browser-react` performs cleanup of the component before the test begins, allowing you to see the rendered result in your UI. If you prefer to disable auto-cleanup, you can import the `render` function from `vitest-browser-react/pure`.

## Configuration

You can configure if the component should be rendered in Strict Mode with `configure` method from `vitest-browser-react/pure`:

```ts
import { configure } from 'vitest-browser-react/pure'

configure({
  // disabled by default
  reactStrictMode: true,
})
```

## Special thanks

- Inspired by [`@testing-library/react`](https://github.com/testing-library/react-testing-library)
