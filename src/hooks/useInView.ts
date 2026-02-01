import { useState, useEffect, useRef, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.3, triggerOnce = true, rootMargin = '0px' } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (element === null) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [threshold, triggerOnce, rootMargin])

  return [ref, isInView]
}
