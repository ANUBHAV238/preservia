import Card from './Card'

const statusConfig = {
  normal: { dot: 'bg-accent', text: 'text-accent', ring: 'shadow-[0_0_0_3px_rgba(58,125,68,0.15)]' },
  warning: { dot: 'bg-amber-400', text: 'text-amber-600', ring: 'shadow-[0_0_0_3px_rgba(217,119,6,0.15)]' },
  critical: { dot: 'bg-red-500', text: 'text-red-600', ring: 'shadow-[0_0_0_3px_rgba(220,38,38,0.15)]' },
}

export default function MetricCard({ icon: Icon, label, labelHindi, value, unit, status = 'normal', iconColor }) {
  const s = statusConfig[status] || statusConfig.normal
  const color = iconColor || (status === 'normal' ? '#3a7d44' : status === 'warning' ? '#d97706' : '#dc2626')

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-30" style={{ background: `radial-gradient(circle at top right, ${color}22, transparent)` }} />
      <div className="flex justify-between items-start mb-4">
        <div className="rounded-xl p-2.5 border" style={{ background: `${color}12`, borderColor: `${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1.5`}>
          <div className={`w-2 h-2 rounded-full ${s.dot} ${s.ring}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text}`}>{status}</span>
        </div>
      </div>
      <div className="font-bold text-text-primary leading-none tabular-nums" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>
        {value}<span className="text-sm font-medium text-text-muted ml-1">{unit}</span>
      </div>
      <div className="mt-1">
        <p className="text-text-secondary text-xs font-medium">{label}</p>
        {labelHindi && <p className="text-text-muted text-[10px] hindi-text">{labelHindi}</p>}
      </div>
    </Card>
  )
}
