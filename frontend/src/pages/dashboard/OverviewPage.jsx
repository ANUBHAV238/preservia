import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Wind, Activity, Heart, Clock, AlertTriangle, Settings2, Leaf, Package, Wifi, WifiOff, HeartPulse, CalendarDays, ShieldCheck, ShieldAlert, Bot } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'
import api from '@/lib/api'

function KpiCard({icon ,emoji, label, hiLabel, value, sub, color = '#2d5a27', bg = 'linear-gradient(145deg,#f4fbf0,#edf6e8)', border = '#c6e0bc' }) {
  return (
    <div className="rounded-[20px] p-5 flex flex-col gap-3 border-2 transition-all hover:shadow-leaf-lg"
         style={{ background: bg, borderColor: border }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-[13px] flex items-center justify-center text-xl"
             style={{ background: 'white', border: `1.5px solid ${border}`, boxShadow: '0 2px 8px rgba(45,90,39,0.08)' }}>
          {icon}
        </div>
        <p className="font-hindi text-[10px]" style={{ color: `${color}99` }}>{hiLabel}</p>
      </div>
      <div>
        <p className="font-display text-[2.8rem] leading-none" style={{ color }}>{value}</p>
        <p className="text-ink-soft text-xs mt-1 font-semibold">{label}</p>
        <p className="font-hindi text-ink-muted text-[10px]">{sub}</p>
      </div>
    </div>
  )
}

function MetricRow({ icon: Icon, label, hi, value, unit, min, max, status = 'normal', optMin, optMax }) {
  const colors = {
    normal:   { text: '#236320', bg: '#f4fbf0', border: '#c6e0bc', fill: 'linear-gradient(90deg,#4a9040,#89d46f)', dot: '#4a9040' },
    warning:  { text: '#92400e', bg: '#fffbeb', border: '#fde68a', fill: 'linear-gradient(90deg,#d97706,#fbbf24)', dot: '#d97706' },
    critical: { text: '#991b1b', bg: '#fff1f0', border: '#f5c6c0', fill: 'linear-gradient(90deg,#dc2626,#ef4444)', dot: '#dc2626' },
  }
  const c = colors[status] || colors.normal
  const pct = max ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 50
  const optMinPct = optMin ? ((optMin - min) / (max - min)) * 100 : 30
  const optMaxPct = optMax ? ((optMax - min) / (max - min)) * 100 : 70

  return (
    <div className="rounded-[16px] p-4 border-2 transition-all hover:shadow-leaf" style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-white border border-border flex items-center justify-center">
            <Icon size={15} style={{ color: c.dot }}/>
          </div>
          <div>
            <p className="text-ink font-bold text-sm leading-tight">{label}</p>
            <p className="font-hindi text-ink-muted text-[10px]">{hi}</p>
          </div>
        </div>
        <p className="font-display text-2xl leading-none" style={{ color: c.text }}>
          {value}<span className="text-sm font-normal ml-0.5 opacity-70">{unit}</span>
        </p>
      </div>
      {/* Progress track with optimal zone */}
      <div className="relative h-2.5 bg-white rounded-full border border-border overflow-hidden">
        {/* Optimal zone highlight */}
        <div className="absolute top-0 bottom-0 rounded-full opacity-20"
             style={{ left: `${optMinPct}%`, width: `${optMaxPct - optMinPct}%`, background: '#4a9040' }}/>
        {/* Fill */}
        <div className="absolute top-0 left-0 bottom-0 rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, background: c.fill }}/>
        {/* Cursor */}
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
             style={{ left: `calc(${pct}% - 6px)`, background: c.dot }}/>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-ink-faint">{min}{unit}</span>
        <span className="text-[9px] text-ink-faint">{max}{unit}</span>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { sensorData, connected } = useSocket()
  const [silos, setSilos] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      const s = data.silos || []
      setSilos(s)
      if (s.length > 0) setSelected(s[0]._id)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const live = selected ? sensorData[selected] : null
  const health = live?.healthScore ?? 84
  const shelf = live?.estimatedDaysRemaining ?? 38

  const risk = health > 75 ? 'Low' : health > 50 ? 'Medium' : 'High'
  const riskHi = health > 75 ? 'कम' : health > 50 ? 'मध्यम' : 'अधिक'
  const riskColor = health > 75 ? '#236320' : health > 50 ? '#c47d15' : '#dc2626'
  const riskBg = health > 75 ? 'linear-gradient(145deg,#f4fbf0,#edf6e8)' : health > 50 ? 'linear-gradient(145deg,#fffbeb,#fef3c7)' : 'linear-gradient(145deg,#fff1f0,#ffe4e1)'
  const riskBorder = health > 75 ? '#c6e0bc' : health > 50 ? '#fde68a' : '#f5c6c0'

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-meadow border-t-soil animate-spin"/>
      <p className="font-hindi text-ink-muted">लोड हो रहा है...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Dashboard Overview</h1>
          <p className="font-hindi text-ink-muted text-sm">🌾 आपके साइलो की स्थिति</p>
        </div>
        <div className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border',
          connected ? '' : 'bg-danger-light border-red-300 text-danger'
        ].join(' ')}
          style={ connected ? { background: 'linear-gradient(135deg,#d4f0ca,#c0e8b4)', borderColor: '#a8d49a', color: '#236320' } : {} }>
          {connected ? <Wifi size={12}/> : <WifiOff size={12}/>}
          {connected ? 'Live / लाइव' : 'Offline'}
        </div>
      </div>

      {/* Silo selector */}
      {silos.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 mr-2">
            <Package size={14} style={{ color: '#4a9040' }}/>
            <p className="font-hindi text-ink-muted text-sm">साइलो:</p>
          </div>
          {silos.map(s => (
            <button key={s._id} onClick={() => setSelected(s._id)}
              className="px-4 py-2 rounded-[12px] text-sm font-bold border-2 transition-all cursor-pointer"
              style={selected === s._id
                ? { background: 'linear-gradient(135deg,#d4f0ca,#c0e8b4)', borderColor: '#a8d49a', color: '#236320' }
                : { background: '#ffffff', borderColor: '#d4e8cc', color: '#4a6840' }}>
              🏛️ {s.name}
            </button>
          ))}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon = {<HeartPulse size={22}/>} label="Health Score" hiLabel="स्वास्थ्य" value={health} sub={`${health > 75 ? 'Excellent' : health > 50 ? 'Good' : 'At Risk'} condition`}/>
        <KpiCard icon={<CalendarDays size={22}/>} label="Shelf Life" hiLabel="शेल्फ जीवन" value={shelf} sub="Estimated days left"
          color="#2563eb" bg="linear-gradient(145deg,#eff6ff,#dbeafe)" border="#bfdbfe"/>
        <KpiCard  icon={health > 75 
      ? <ShieldCheck size={22} /> 
      : <ShieldAlert size={22} />
    } label="Risk Level" hiLabel="जोखिम स्तर" value={risk} sub={`${riskHi} — ${health > 75 ? 'No alerts' : 'Monitor closely'}`}
          color={riskColor} bg={riskBg} border={riskBorder}/>
        <KpiCard icon={<Bot size={22}/>} label="Control Mode" hiLabel="नियंत्रण मोड" value="Auto" sub="Automated management active"
          color="#c47d15" bg="linear-gradient(145deg,#fffbeb,#fef3c7)" border="#fde68a"/>
      </div>

      {/* Live sensor metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="live-pip"/>
          <h2 className="font-bold text-ink text-base">Live Sensors</h2>
          <span className="font-hindi text-ink-muted text-sm">— लाइव सेंसर</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricRow icon={Thermometer} label="Temperature" hi="तापमान" value={live?.temperature?.toFixed(1) ?? '18.4'} unit="°C"
            min={14} max={26} optMin={15} optMax={22}
            status={live?.temperature > 22 ? 'warning' : live?.temperature > 24 ? 'critical' : 'normal'}/>
          <MetricRow icon={Droplets} label="Humidity" hi="नमी" value={live?.humidity?.toFixed(1) ?? '65.2'} unit="%"
            min={50} max={85} optMin={60} optMax={72}
            status={live?.humidity > 72 ? 'warning' : live?.humidity > 80 ? 'critical' : 'normal'}/>
          <MetricRow icon={Wind} label="CO₂ Level" hi="कार्बन डाइऑक्साइड" value={live?.co2?.toFixed(2) ?? '4.31'} unit="%"
            min={2} max={7} optMin={3} optMax={5.5}
            status={live?.co2 > 5.5 ? 'warning' : live?.co2 > 6.5 ? 'critical' : 'normal'}/>
          <MetricRow icon={Activity} label="O₂ Level" hi="ऑक्सीजन" value={live?.o2?.toFixed(2) ?? '2.10'} unit="%"
            min={0.5} max={4} optMin={1} optMax={3}
            status={live?.o2 < 1 ? 'critical' : live?.o2 > 3 ? 'warning' : 'normal'}/>
        </div>
      </div>

      {/* Quick tips */}
      <div className="rounded-[20px] p-5 border-2 border-border"
           style={{ background: 'linear-gradient(135deg, #f4fbf0 0%, #edf6e8 60%, #fffef8 100%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Leaf size={16} style={{ color: '#3d7a35' }}/>
          <h3 className="font-bold text-soil text-sm">किसान की सलाह / Farmer Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { hi: 'तापमान 15-22°C के बीच रखें', en: 'Maintain 15–22°C for best shelf life', icon: '🌡️' },
            { hi: 'नमी 60-72% के बीच रखें', en: 'Keep humidity at 60–72% to prevent rot', icon: '💧' },
            { hi: 'CO₂ 3-5.5% पर रखें अंकुरण रोकने के लिए', en: 'CO₂ at 3–5.5% prevents sprouting', icon: '🌬️' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-white rounded-[14px] border border-border">
              <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
              <div>
                <p className="font-hindi text-soil text-xs font-bold leading-snug">{t.hi}</p>
                <p className="text-ink-muted text-[11px] mt-0.5">{t.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
