import { Suspense } from 'react'
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'
import { render } from '../src/index'
import { HelloWorld } from './fixtures/HelloWorld'
import { Counter } from './fixtures/Counter'
import { SuspendedHelloWorld } from './fixtures/SuspendedHelloWorld'

test('renders simple component', async () => {
  const screen = await render(<HelloWorld />)
  await expect.element(page.getByText('Hello World')).toBeVisible()
  expect(screen.container).toMatchSnapshot()
})

test('renders counter', async () => {
  const screen = await render(<Counter initialCount={1} />)

  await expect.element(screen.getByText('Count is 1')).toBeVisible()
  await screen.getByRole('button', { name: 'Increment' }).click()
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})

test('waits for suspended boundaries', async () => {
  const { getByText } = await render(<SuspendedHelloWorld name="Vitest" />, {
    wrapper: ({ children }) => (
      <Suspense fallback={<div>Suspended!</div>}>{children}</Suspense>
    ),
  })
  await expect.element(getByText('Suspended!')).toBeInTheDocument()
  await expect.element(getByText('Hello Vitest')).toBeInTheDocument()
})
