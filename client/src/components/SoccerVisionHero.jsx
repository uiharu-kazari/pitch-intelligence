import { useScrollReveal } from '../motion'
import { CubeIcon, PlayIcon, SparkIcon } from '../icons'
import '../styles/SoccerVisionHero.css'

// Homepage flagship promotion for the Soccer Vision 3D module.
export default function SoccerVisionHero({ onLaunch }) {
  const [ref, visible] = useScrollReveal()

  const points = [
    'Replay attacking sequences on a real 3D pitch',
    'See passing lanes graded green / yellow / red',
    'Read defensive pressure and open space at a glance',
    'A transparent attacking-threat score for every option',
  ]

  return (
    <section ref={ref} className={`sv-hero glass spotlight reveal ${visible ? 'is-visible' : ''}`}>
      <div className="sv-hero__body">
        <span className="sv-hero__badge">
          <SparkIcon size={14} /> New flagship feature
        </span>
        <h2 className="sv-hero__title">
          Soccer Vision <span className="sv-hero__3d">3D</span>
        </h2>
        <p className="sv-hero__subtitle">
          Interactive tactical analysis for passing lanes, pressure, and open space.
        </p>

        <p className="sv-hero__why">
          <strong>Why this matters:</strong> coaches and players think in movement and space, not
          spreadsheets. Soccer Vision 3D turns tracking data into an interactive film-room — replay
          a possession, and instantly see the best pass and why it&apos;s best.
        </p>

        <ul className="sv-hero__points">
          {points.map((p) => (
            <li key={p}>
              <span className="sv-hero__dot" />
              {p}
            </li>
          ))}
        </ul>

        <div className="sv-hero__actions">
          <button type="button" className="btn btn--primary shine sv-hero__cta" onClick={onLaunch}>
            <PlayIcon size={16} /> Try demo play
          </button>
          <span className="sv-hero__note">Simulated scenarios + real SkillCorner tracking</span>
        </div>
      </div>

      <button
        type="button"
        className="sv-hero__visual"
        onClick={onLaunch}
        aria-label="Open Soccer Vision 3D"
      >
        <MiniPitch />
        <span className="sv-hero__visual-tag">
          <CubeIcon size={15} /> 3D Tactical View
        </span>
      </button>
    </section>
  )
}

// A stylized top-down pitch with a graded passing-lane fan — a teaser of the real module.
function MiniPitch() {
  return (
    <svg className="sv-mini" viewBox="0 0 320 200" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="sv-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f3d2e" />
          <stop offset="100%" stopColor="#0a2c20" />
        </linearGradient>
        <radialGradient id="sv-space" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="308" height="188" rx="8" fill="url(#sv-grass)" stroke="rgba(255,255,255,0.18)" />
      {/* markings */}
      <line x1="160" y1="6" x2="160" y2="194" stroke="rgba(255,255,255,0.22)" />
      <circle cx="160" cy="100" r="26" fill="none" stroke="rgba(255,255,255,0.22)" />
      <rect x="6" y="60" width="44" height="80" fill="none" stroke="rgba(255,255,255,0.22)" />
      <rect x="270" y="60" width="44" height="80" fill="none" stroke="rgba(255,255,255,0.22)" />
      {/* open space glow near the right channel */}
      <circle className="sv-mini__space" cx="250" cy="60" r="40" fill="url(#sv-space)" />
      {/* passing lanes from carrier */}
      <g strokeWidth="3" fill="none" strokeLinecap="round">
        <line className="sv-mini__lane" x1="150" y1="120" x2="250" y2="60" stroke="#22c55e" />
        <line x1="150" y1="120" x2="220" y2="120" stroke="#f59e0b" opacity="0.9" />
        <line x1="150" y1="120" x2="190" y2="170" stroke="#ef4444" opacity="0.85" />
      </g>
      {/* recommended ring */}
      <circle className="sv-mini__ring" cx="250" cy="60" r="11" fill="none" stroke="#22c55e" strokeWidth="2.5" />
      {/* players */}
      <circle cx="150" cy="120" r="7" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="250" cy="60" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="220" cy="120" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="190" cy="170" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
      <circle cx="205" cy="85" r="6" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
      <circle cx="225" cy="150" r="6" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
      {/* a ball travelling the recommended lane */}
      <circle className="sv-mini__ball" r="3.5" fill="#fde047">
        <animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.55;1" calcMode="linear" path="M150,120 L250,60" />
      </circle>
    </svg>
  )
}
