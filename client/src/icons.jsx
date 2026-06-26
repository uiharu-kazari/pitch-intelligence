// Inline SVG icons (Lucide-style, 1.75px stroke, currentColor).
// Using SVG rather than emoji per design-system rule `no-emoji-icons`.

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const Icon = ({ path, size, children, ...rest }) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...rest}>
    {children || (Array.isArray(path) ? path.map((d, i) => <path key={i} d={d} />) : <path d={path} />)}
  </svg>
);

export const FootballIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7l4.7 3.4-1.8 5.5H9.1L7.3 10.4 12 7z" />
    <path d="M12 3v4M5.3 9.4l3.8 1M18.7 9.4l-3.8 1M8.9 16.9l-1.6 3.3M15.1 16.9l1.6 3.3" />
  </Icon>
);

export const TrophyIcon = (p) => (
  <Icon {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" />
  </Icon>
);

export const TargetIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </Icon>
);

export const TrendUpIcon = (p) => (
  <Icon {...p}>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M17 8h4v4" />
  </Icon>
);

export const TrendDownIcon = (p) => (
  <Icon {...p}>
    <path d="M3 7l6 6 4-4 7 7" />
    <path d="M17 16h4v-4" />
  </Icon>
);

export const FlameIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-.8-.3-1.5-.6-2 2 1.2 3.6 3.3 3.6 6a5 5 0 0 1-10 0c0-4 3-6 5-11z" />
  </Icon>
);

export const GaugeIcon = (p) => (
  <Icon {...p}>
    <path d="M12 14l4-4" />
    <path d="M4 18a8 8 0 1 1 16 0" />
    <circle cx="12" cy="14" r="1" />
  </Icon>
);

export const ScaleIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v16M6 8h12" />
    <path d="M6 8l-3 6a3 3 0 0 0 6 0L6 8zM18 8l-3 6a3 3 0 0 0 6 0l-3-6z" />
  </Icon>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p) => (
  <Icon {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Icon>
);

export const ArrowUpIcon = (p) => (
  <Icon {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Icon>
);

export const ArrowDownIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </Icon>
);

export const RefreshIcon = (p) => (
  <Icon {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </Icon>
);

export const SparkIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </Icon>
)

export const CubeIcon = (p) => (
  <Icon {...p}>
    <path d="M12 2.5l8 4.5v9l-8 4.5-8-4.5v-9l8-4.5z" />
    <path d="M12 2.5v19M4 7l8 4.5L20 7" />
  </Icon>
)

export const PlayIcon = (p) => (
  <Icon {...p}>
    <path d="M7 5l11 7-11 7V5z" />
  </Icon>
)

export const PauseIcon = (p) => (
  <Icon {...p}>
    <path d="M8 5v14M16 5v14" />
  </Icon>
)

export const CameraIcon = (p) => (
  <Icon {...p}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V8.5z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
)

export const TopDownIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M12 8v8M8 12h8" />
  </Icon>
);
