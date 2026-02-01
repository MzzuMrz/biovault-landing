import { useCallback, useSyncExternalStore } from 'react'

interface ScrollPosition {
  x: number
  y: number
}

let scrollPosition: ScrollPosition = { x: 0, y: 0 }
let lastUpdate = 0

const getScrollSnapshot = (): ScrollPosition => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }
  return scrollPosition
}

const getServerSnapshot = (): ScrollPosition => ({ x: 0, y: 0 })

export function useScrollPosition(throttleMs = 100): ScrollPosition {
  const subscribe = useCallback(
    (callback: () => void): (() => void) => {
      const handleScroll = (): void => {
        const now = Date.now()
        if (now - lastUpdate >= throttleMs) {
          lastUpdate = now
          scrollPosition = { x: window.scrollX, y: window.scrollY }
          callback()
        }
      }

      // Set initial position
      scrollPosition = { x: window.scrollX, y: window.scrollY }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    },
    [throttleMs]
  )

  return useSyncExternalStore(subscribe, getScrollSnapshot, getServerSnapshot)
}

export function useIsScrolled(threshold = 10): boolean {
  const { y } = useScrollPosition()
  return y > threshold
}
