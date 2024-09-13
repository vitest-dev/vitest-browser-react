import type { Locator, LocatorSelectors } from '@vitest/browser/context'
import { type PrettyDOMOptions, debug, getElementLocatorSelectors } from '@vitest/browser/utils'
import React from 'react'
import type { Container } from 'react-dom/client'
import ReactDOMClient from 'react-dom/client'

export interface RenderResult extends LocatorSelectors {
  container: HTMLElement
  baseElement: HTMLElement
  debug: (
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions
  ) => void
  unmount: () => void
  rerender: (ui: React.ReactNode) => void
  asFragment: () => DocumentFragment
}

export interface ComponentRenderOptions {
  container?: HTMLElement
  baseElement?: HTMLElement
  wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>
}

// Ideally we'd just use a WeakMap where containers are keys and roots are values.
// We use two variables so that we can bail out in constant time when we render with a new container (most common use case)
const mountedContainers = new Set<Container>()
const mountedRootEntries: {
  container: Container
  root: ReturnType<typeof createConcurrentRoot>
}[] = []

export function render(
  ui: React.ReactNode,
  { container, baseElement, wrapper: WrapperComponent }: ComponentRenderOptions = {},
): RenderResult {
  if (!baseElement) {
    // default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output
    baseElement = document.body
  }

  if (!container) {
    container = baseElement.appendChild(document.createElement('div'))
  }

  let root: ReactRoot

  if (!mountedContainers.has(container)) {
    root = createConcurrentRoot(container)

    mountedRootEntries.push({ container, root })
    // we'll add it to the mounted containers regardless of whether it's actually
    // added to document.body so the cleanup method works regardless of whether
    // they're passing us a custom container or not.
    mountedContainers.add(container)
  }
  else {
    mountedRootEntries.forEach((rootEntry) => {
      // Else is unreachable since `mountedContainers` has the `container`.
      // Only reachable if one would accidentally add the container to `mountedContainers` but not the root to `mountedRootEntries`
      /* istanbul ignore else */
      if (rootEntry.container === container) {
        root = rootEntry.root
      }
    })
  }

  root!.render(
    strictModeIfNeeded(wrapUiIfNeeded(ui, WrapperComponent)),
  )

  return {
    container,
    baseElement,
    debug: (el, maxLength, options) => debug(el, maxLength, options),
    unmount: () => {
      root.unmount()
    },
    rerender: (newUi: React.ReactNode) => {
      root.render(
        strictModeIfNeeded(wrapUiIfNeeded(newUi, WrapperComponent)),
      )
    },
    asFragment: () => {
      return document.createRange().createContextualFragment(container.innerHTML)
    },
    ...getElementLocatorSelectors(baseElement),
  }
}

export function cleanup(): void {
  mountedRootEntries.forEach(({ root, container }) => {
    root.unmount()
    if (container.parentNode === document.body) {
      document.body.removeChild(container)
    }
  })
  mountedRootEntries.length = 0
  mountedContainers.clear()
}

interface ReactRoot {
  render: (element: React.ReactNode) => void
  unmount: () => void
}

function createConcurrentRoot(container: HTMLElement): ReactRoot {
  const root = ReactDOMClient.createRoot(container)

  return {
    render(element: React.ReactNode) {
      root.render(element)
    },
    unmount() {
      root.unmount()
    },
  }
}

export interface RenderConfiguration {
  reactStrictMode: boolean
}

const config: RenderConfiguration = {
  reactStrictMode: false,
}

function strictModeIfNeeded(innerElement: React.ReactNode) {
  return config.reactStrictMode
    ? React.createElement(React.StrictMode, null, innerElement)
    : innerElement
}

function wrapUiIfNeeded(innerElement: React.ReactNode, wrapperComponent?: React.JSXElementConstructor<{ children: React.ReactNode }>) {
  return wrapperComponent
    ? React.createElement(wrapperComponent, null, innerElement)
    : innerElement
}

export function configure(customConfig: Partial<RenderConfiguration>): void {
  Object.assign(config, customConfig)
}
