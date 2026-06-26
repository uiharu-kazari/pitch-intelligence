import { useState, useEffect, useCallback } from 'react'

// Minimal hash router — no dependency. Routes are the hash path, e.g. '#/soccer-vision'.
// Reading `window.location.hash` keeps URLs shareable and makes browser back/forward work.

export function currentPath() {
  const h = window.location.hash.replace(/^#/, '')
  return h === '' ? '/' : h
}

export function navigate(path) {
  const target = path.startsWith('#') ? path : `#${path}`
  if (window.location.hash !== target) window.location.hash = target
  else window.scrollTo({ top: 0 }) // re-click same route → scroll to top
}

export function useHashRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onChange = () => {
      setPath(currentPath())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const go = useCallback((p) => navigate(p), [])
  return [path, go]
}
