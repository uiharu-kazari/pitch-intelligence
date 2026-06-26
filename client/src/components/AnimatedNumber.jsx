import { useEffect, useRef, useState } from 'react'
import { useScrollReveal, prefersReducedMotion } from '../motion'

// Counts up from 0 to `value` once it scrolls into view, using requestAnimationFrame.
// Formats every frame to match the final value exactly (decimals/prefix/suffix) and
// renders with tabular figures so width never shifts. Honors reduced motion.
export default function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1000,
  className = '',
}) {
  const [ref, visible] = useScrollReveal()
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!visible) return

    if (prefersReducedMotion()) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    const from = 0
    // Ease-out cubic for a natural, decelerating count.
    const ease = (t) => 1 - Math.pow(1 - t, 3)

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setDisplay(from + (value - from) * ease(t))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [visible, value, duration])

  const formatted = Number(display).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
