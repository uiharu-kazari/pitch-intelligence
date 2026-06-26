import { useState, useEffect, useCallback, useRef, useLayoutEffect, lazy, Suspense } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import AmbientBackground from './components/AmbientBackground'
import AnimatedNumber from './components/AnimatedNumber'
import SoccerVisionHero from './components/SoccerVisionHero'
import BrandLogo from './components/BrandLogo'
import { useTheme } from './useTheme'
import { useScrollReveal } from './motion'
import { useHashRoute } from './router'
import { useGlobalSpotlight, useScrollProgress } from './fx'
import {
  FootballIcon,
  CubeIcon,
  SunIcon,
  MoonIcon,
  TrophyIcon,
  FlameIcon,
  TargetIcon,
  AlertIcon,
  RefreshIcon,
} from './icons'
import './App.css'

const API = 'http://localhost:8000'

// Code-split the 3D module so the dashboard route isn't penalized by the three.js bundle.
const SoccerVision = lazy(() => import('./pages/SoccerVision/SoccerVision'))

const NAV = [
  { path: '/', label: 'Dashboard', icon: <TrophyIcon size={16} /> },
  { path: '/soccer-vision', label: 'Soccer Vision 3D', icon: <CubeIcon size={16} /> },
]

export default function App() {
  const { isDark, toggle } = useTheme()
  const [route, go] = useHashRoute()
  useGlobalSpotlight()
  const progressRef = useScrollProgress()
  const [teams, setTeams] = useState([])
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const [teamsRes, summaryRes] = await Promise.all([
        axios.get(`${API}/api/teams`),
        axios.get(`${API}/api/summary`),
      ])
      setTeams(teamsRes.data)
      setSummary(summaryRes.data)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Request failed')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const isSoccer = route.startsWith('/soccer-vision')

  return (
    <div className="app">
      <AmbientBackground />
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <header className="topbar glass">
        <div className="topbar__inner">
          <button className="brand" onClick={() => go('/')} aria-label="Pitch Intelligence home">
            <BrandLogo size={44} />
            <span className="brand__text">
              <span className="brand__title sheen">Pitch Intelligence</span>
              <span className="brand__sub">Soccer analytics in 3D</span>
            </span>
          </button>

          <MainNav route={route} go={go} />

          <button
            type="button"
            className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''}`}
            onClick={toggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle__icons" aria-hidden="true">
              <MoonIcon size={18} className="ti ti--moon" />
              <SunIcon size={18} className="ti ti--sun" />
            </span>
            <span className="theme-toggle__label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {isSoccer ? (
        <Suspense fallback={<ModuleLoading label="Loading Soccer Vision 3D…" />}>
          <SoccerVision />
        </Suspense>
      ) : (
        <main className="main">
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState message={error} onRetry={load} />}
          {status === 'ready' && (
            <>
              <SoccerVisionHero onLaunch={() => go('/soccer-vision')} />
              <SummaryStrip summary={summary} />
              <Dashboard teams={teams} />
            </>
          )}
        </main>
      )}

      <footer className="footer glass">
        <p>
          Pitch Intelligence · built for the AQX Sports Analytics Hackathon · xG is a simplified shot-quality
          proxy; Soccer Vision 3D blends simulated scenarios with real SkillCorner A-League tracking.
        </p>
      </footer>
    </div>
  )
}

// Primary nav with a single pill indicator that slides between items.
function MainNav({ route, go }) {
  const itemRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false })
  const activeIndex = NAV.findIndex((item) =>
    item.path === '/' ? route === '/' : route.startsWith(item.path)
  )

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
  }, [activeIndex, route])

  useEffect(() => {
    const onResize = () => {
      const el = itemRefs.current[activeIndex]
      if (el) setIndicator((s) => ({ ...s, left: el.offsetLeft, width: el.offsetWidth }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex])

  return (
    <nav className="mainnav" aria-label="Primary">
      <span
        className={`mainnav__indicator ${indicator.ready ? 'is-ready' : ''}`}
        style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
        aria-hidden="true"
      />
      {NAV.map((item, i) => {
        const active = i === activeIndex
        return (
          <button
            key={item.path}
            ref={(el) => (itemRefs.current[i] = el)}
            type="button"
            className={`mainnav__item ${active ? 'mainnav__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => go(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function ModuleLoading({ label }) {
  return (
    <main className="main">
      <div className="states" aria-busy="true" aria-live="polite">
        <div className="skeleton skeleton--panel" style={{ height: 420 }} />
        <p className="states__hint">{label}</p>
      </div>
    </main>
  )
}

function SummaryStrip({ summary }) {
  const [ref, visible] = useScrollReveal()
  if (!summary) return null

  const cards = [
    {
      icon: <TrophyIcon size={18} />,
      tone: 'primary',
      label: 'Best xG difference',
      value: summary.bestXGDiff.name,
      metaNum: summary.bestXGDiff.value,
      metaPrefix: '+',
      metaSuffix: ' net xG',
      metaDecimals: 1,
    },
    {
      icon: <FlameIcon size={18} />,
      tone: 'accent',
      label: 'Top scorer',
      value: summary.topScorer.name,
      metaNum: summary.topScorer.value,
      metaSuffix: ' goals',
      metaDecimals: 0,
    },
    {
      icon: <TargetIcon size={18} />,
      tone: 'success',
      label: 'Meanest defense',
      value: summary.meanestDefense.name,
      metaNum: summary.meanestDefense.value,
      metaSuffix: ' xG conceded',
      metaDecimals: 1,
    },
    {
      icon: <FootballIcon size={18} />,
      tone: 'neutral',
      label: 'Goals per match',
      valueNum: summary.goalsPerGame,
      valueDecimals: 2,
      meta: `${summary.teamCount} teams tracked`,
    },
  ]

  return (
    <section
      ref={ref}
      className={`summary summary--stagger ${visible ? 'is-visible' : ''}`}
      aria-label="League summary"
    >
      {cards.map((c, i) => (
        <article
          key={c.label}
          className={`summary__card glass spotlight summary__card--${c.tone}`}
          style={{ '--stagger': `${i * 80}ms` }}
        >
          <span className="summary__icon">{c.icon}</span>
          <div className="summary__body">
            <p className="summary__label">{c.label}</p>
            <p className="summary__value">
              {c.valueNum !== undefined ? (
                <AnimatedNumber value={c.valueNum} decimals={c.valueDecimals} />
              ) : (
                c.value
              )}
            </p>
            <p className="summary__meta">
              {c.metaNum !== undefined ? (
                <AnimatedNumber
                  value={c.metaNum}
                  decimals={c.metaDecimals}
                  prefix={c.metaPrefix}
                  suffix={c.metaSuffix}
                />
              ) : (
                c.meta
              )}
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}

function LoadingState() {
  return (
    <div className="states" aria-busy="true" aria-live="polite">
      <div className="skeleton-summary">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton--card" />
        ))}
      </div>
      <div className="skeleton-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton--panel" />
        ))}
      </div>
      <p className="states__hint">Loading match data…</p>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="states states--error glass" role="alert">
      <span className="states__icon">
        <AlertIcon size={32} />
      </span>
      <h2>Couldn't load the data</h2>
      <p className="states__detail">{message}</p>
      <p className="states__hint">
        Make sure the API server is running on <code className="mono">localhost:8000</code>.
      </p>
      <button type="button" className="btn btn--primary shine" onClick={onRetry}>
        <RefreshIcon size={16} />
        Try again
      </button>
    </div>
  )
}
