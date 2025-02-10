import { useCallback, useState } from 'react'

export function useCounter(): {
  count: number
  increment: () => void
} {
  const [count, setCount] = useState(0)

  const increment = useCallback(() => setCount(x => x + 1), [])

  return { count, increment }
}
