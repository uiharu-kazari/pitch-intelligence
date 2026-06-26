import '../styles/AmbientBackground.css'

// Fixed, decorative layer of softly drifting gradient blobs behind all content.
// Pure CSS animation (transform/opacity only); frozen under reduced motion via the
// global guard in design-system.css. aria-hidden — purely visual.
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="ambient__blob ambient__blob--1" />
      <span className="ambient__blob ambient__blob--2" />
      <span className="ambient__blob ambient__blob--3" />
      <div className="ambient__grain" />
    </div>
  )
}
