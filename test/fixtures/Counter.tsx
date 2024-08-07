import { useState } from 'react'

export function Counter({ initialCount = 0 }: { initialCount: number }): React.ReactElement {
  const [count, setCount] = useState(initialCount)
  return (
    <>
      <div>
        Count is
        {' '}
        {count}
      </div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
