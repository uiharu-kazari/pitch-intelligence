import { useEffect, useRef, useState } from 'react'

// True when the user prefers reduced motion (re-evaluated per call; cheap).
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Reveal a node once it scrolls into view. Returns a ref to attach and a boolean.
// Under reduced motion (or no IntersectionObserver) it reports visible immediately.
export function useScrollReveal({ threshold = 0.05, rootMargin = '0px 0px 0px 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (visible || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target) // reveal once, then stop watching
          }
        })
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, threshold, rootMargin])

  return [ref, visible]
}
