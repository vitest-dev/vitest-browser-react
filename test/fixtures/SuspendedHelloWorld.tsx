import { use } from 'react'

let fakeCacheLoaded = false
const fakeCacheLoadPromise = new Promise<void>((resolve) => {
  setTimeout(() => {
    fakeCacheLoaded = true
    resolve()
  }, 100)
})

export function SuspendedHelloWorld({ name }: { name: string }): React.ReactElement {
  if (!fakeCacheLoaded) {
    use(fakeCacheLoadPromise)
  }

  return (
    <div>{`Hello ${name}`}</div>
  )
}
