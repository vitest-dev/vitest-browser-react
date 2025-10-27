import { expect, test, vi } from 'vitest'
import * as vbr from 'vitest-browser-react'
import { useEffect } from 'react'
import { useCounter } from './fixtures/useCounter'

test('vbr exposes correct methods', () => {
  expect(vbr).toMatchInlineSnapshot(`
    {
      "cleanup": [Function],
      "render": [Function],
      "renderHook": [Function],
    }
  `)
})

test('vbr renders a component', async () => {
  const cleanup = vi.fn()
  function Example() {
    useEffect(() => {
      return () => {
        cleanup()
      }
    })
    return <div>Hello World</div>
  }

  const { getByText } = await vbr.render(<Example />)
  expect(getByText('Hello World')).toBeInTheDocument()
  expect(cleanup).not.toHaveBeenCalled()

  await vbr.cleanup()

  expect(cleanup).toHaveBeenCalled()
})

test('should increment counter', async () => {
  const { result, act } = await vbr.renderHook(() => useCounter())

  await act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
