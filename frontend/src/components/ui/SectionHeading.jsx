export function SectionLabel({ children, hi }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <path d="M9 20 C4 15 3 9 7 3 C13 7 14 14 9 20Z" fill="#3d7a35"/>
        <line x1="9" y1="20" x2="8" y2="5" stroke="#2d5a27" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <div>
        <span className="text-soil-mid text-xs font-bold tracking-widest uppercase">{children}</span>
        {hi && <span className="font-hindi text-ink-muted text-[11px] ml-2">{hi}</span>}
      </div>
    </div>
  )
}

export function SectionTitle({ children, sub, subHi, className='' }) {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="font-display text-[clamp(28px,4vw,48px)] text-ink leading-[1.15] mb-3">{children}</h2>
      {sub && <p className="text-ink-soft text-lg leading-relaxed max-w-2xl">{sub}</p>}
      {subHi && <p className="font-hindi text-ink-muted text-base mt-1 leading-relaxed max-w-2xl">{subHi}</p>}
    </div>
  )
}
