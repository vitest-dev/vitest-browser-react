import { expect, test, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { Button } from 'react-aria-components'
import { render } from '../src/index'
import { HelloWorld } from './fixtures/HelloWorld'
import { Counter } from './fixtures/Counter'

test('renders simple component', async () => {
  const screen = render(<HelloWorld />)
  await expect.element(page.getByText('Hello World')).toBeVisible()
  expect(screen.container).toMatchSnapshot()
})

test('renders counter', async () => {
  const screen = render(<Counter initialCount={1} />)

  await expect.element(screen.getByText('Count is 1')).toBeVisible()
  await screen.getByRole('button', { name: 'Increment' }).click()
  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})

test('should fire the onPress/onClick handler', async () => {
  const handler = vi.fn()
  const screen = page.render(<Button onPress={handler}>Button</Button>)
  await userEvent.click(screen.getByRole('button'))
  // await screen.getByRole('button').click()
  expect(handler).toHaveBeenCalled()
})
