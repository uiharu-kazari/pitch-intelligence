import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './motion'

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches

// Global cursor spotlight: writes --mx/--my onto the `.spotlight` element under the pointer.
// rAF-throttled, pointer-capable devices only, skipped under reduced motion.
export function useGlobalSpotlight() {
  useEffect(() => {
    if (!canHover() || prefersReducedMotion()) return
    let raf = 0
    let last = null
    const apply = () => {
      raf = 0
      if (!last) return
      const el = last.target.closest && last.target.closest('.spotlight')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${last.x - r.left}px`)
      el.style.setProperty('--my', `${last.y - r.top}px`)
    }
    const onMove = (e) => {
      last = { target: e.target, x: e.clientX, y: e.clientY }
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}

// Scroll-progress: sets --progress (0→1) on the returned element ref as the page scrolls.
export function useScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (ref.current) ref.current.style.setProperty('--progress', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}
