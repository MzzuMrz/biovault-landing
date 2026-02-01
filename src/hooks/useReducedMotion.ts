import { useSyncExternalStore } from 'react'

const getSnapshot = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const getServerSnapshot = (): boolean => false

const subscribe = (callback: () => void): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => {
    mediaQuery.removeEventListener('change', callback)
  }
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
