import { FootballIcon } from '../icons'
import './BrandLogo.css'

// Always-moving brand mark: a slowly spinning football inside a rotating conic-gradient
// ring with a breathing glow. All motion is paused under prefers-reduced-motion.
export default function BrandLogo({ size = 44 }) {
  return (
    <span className="logo" style={{ width: size, height: size }} aria-hidden="true">
      <span className="logo__ring" />
      <span className="logo__core">
        <span className="logo__ball">
          <FootballIcon size={size * 0.5} />
        </span>
      </span>
      <span className="logo__orbit">
        <span className="logo__dot" />
      </span>
    </span>
  )
}
