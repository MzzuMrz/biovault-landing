import { useRef, useSyncExternalStore, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface UseCountUpOptions {
  duration?: number
  start?: boolean
}

interface CountUpStore {
  count: number
  listeners: Set<() => void>
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, start = false } = options
  const prefersReducedMotion = useReducedMotion()
  const storeRef = useRef<CountUpStore>({ count: 0, listeners: new Set() })
  const frameRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)
  const prevStartRef = useRef(false)

  const getSnapshot = useCallback((): number => {
    return storeRef.current.count
  }, [])

  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      storeRef.current.listeners.add(onStoreChange)

      // Handle start/stop changes
      if (start !== prevStartRef.current) {
        prevStartRef.current = start

        if (!start) {
          // Reset
          hasStartedRef.current = false
          if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current)
            frameRef.current = null
          }
          storeRef.current.count = 0
          storeRef.current.listeners.forEach((listener) => {
            listener()
          })
        } else if (!hasStartedRef.current) {
          // Start animation
          hasStartedRef.current = true

          if (prefersReducedMotion) {
            // Skip animation for reduced motion
            storeRef.current.count = end
            storeRef.current.listeners.forEach((listener) => {
              listener()
            })
          } else {
            const startTime = performance.now()

            const animateFrame = (currentTime: number): void => {
              const progress = Math.min((currentTime - startTime) / duration, 1)
              const easeOutQuad = 1 - (1 - progress) * (1 - progress)
              storeRef.current.count = Math.floor(easeOutQuad * end)
              storeRef.current.listeners.forEach((listener) => {
                listener()
              })

              if (progress < 1) {
                frameRef.current = requestAnimationFrame(animateFrame)
              }
            }

            frameRef.current = requestAnimationFrame(animateFrame)
          }
        }
      }

      return () => {
        storeRef.current.listeners.delete(onStoreChange)
        if (
          storeRef.current.listeners.size === 0 &&
          frameRef.current !== null
        ) {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = null
        }
      }
    },
    [start, end, duration, prefersReducedMotion]
  )

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
