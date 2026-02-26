const VARIANTS = {
  accent:  { bg: 'linear-gradient(135deg,#d4f0ca,#c0e8b4)', color: '#236320', border: '#a8d49a' },
  green:   { bg: 'linear-gradient(135deg,#d4f0ca,#c0e8b4)', color: '#236320', border: '#a8d49a' },
  amber:   { bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92400e', border: '#fbbf24' },
  red:     { bg: 'linear-gradient(135deg,#fee2e2,#fecaca)', color: '#991b1b', border: '#fca5a5' },
  blue:    { bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#1e40af', border: '#93c5fd' },
  purple:  { bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', color: '#5b21b6', border: '#c4b5fd' },
  gray:    { bg: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', color: '#374151', border: '#d1d5db' },
  wheat:   { bg: 'linear-gradient(135deg,#fef9e7,#fef3c7)', color: '#7c5c2a', border: '#ead9a0' },
}

export default function Badge({ children, variant = 'accent', className = '' }) {
  const v = VARIANTS[variant] || VARIANTS.accent
  return (
    <span
      className={['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border', className].join(' ')}
      style={{ background: v.bg, color: v.color, borderColor: v.border }}>
      {children}
    </span>
  )
}
