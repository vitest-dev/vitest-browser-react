import { use } from 'react'

export function SuspendedHelloWorld({ name, promise }: { name: string; promise: Promise<void> }): React.ReactElement {
  use(promise)

  return <div>{`Hello ${name}`}</div>
}
