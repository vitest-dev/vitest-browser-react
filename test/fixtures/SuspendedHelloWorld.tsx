import { use } from 'react'

const fakeCacheLoadPromise = new Promise<void>((resolve) => {
  setTimeout(() => resolve(), 100)
})

export function SuspendedHelloWorld({
  name,
}: {
  name: string
}): React.ReactElement {
  use(fakeCacheLoadPromise)

  return <div>{`Hello ${name}`}</div>
}
