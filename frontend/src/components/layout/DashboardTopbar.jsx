import { useLocation, Link } from 'react-router-dom'
import { Bell, Sun, CloudSun, Moon, Leaf } from 'lucide-react'
import { useSocket } from '@/context/SocketContext'

const LABELS = {
  overview:     { en:'Overview',        hi:'सारांश',         emoji:'🌿' },
  live:         { en:'Live Monitoring', hi:'लाइव निगरानी',    emoji:'📡' },
  'gas-control':{ en:'Gas Control',     hi:'गैस नियंत्रण',    emoji:'💨' },
  history:      { en:'History',         hi:'इतिहास',          emoji:'📊' },
  predictions:  { en:'AI Predictions',  hi:'AI भविष्यवाणी',   emoji:'🤖' },
  maintenance:  { en:'Maintenance',     hi:'रखरखाव',          emoji:'🔧' },
  alerts:       { en:'Alerts',          hi:'अलर्ट',           emoji:'🔔' },
  silos:        { en:'My Silos',        hi:'मेरे साइलो',      emoji:'🏛️' },
  settings:     { en:'Settings',        hi:'सेटिंग्स',        emoji:'⚙️' },
}

export default function DashboardTopbar() {
  const loc = useLocation()
  const { connected, alerts } = useSocket()
  const seg = loc.pathname.split('/').pop()
  const label = LABELS[seg] || { en:'Dashboard', hi:'डैशबोर्ड', emoji:'🌾' }
  const unread = alerts.filter(a => !a.read).length
  const h = new Date().getHours()
  const { greeting, hi, Icon } = h < 12
    ? { greeting:'Good Morning', hi:'सुप्रभात 🌅', Icon:Sun }
    : h < 17
    ? { greeting:'Good Afternoon', hi:'नमस्ते ☀️', Icon:CloudSun }
    : { greeting:'Good Evening', hi:'शुभ संध्या 🌙', Icon:Moon }

  return (
    <header className="h-16 sticky top-0 z-50 flex items-center justify-between px-5 shrink-0"
      style={{
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1.5px solid #d4e8cc',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 2px 12px rgba(45,90,39,0.06)',
      }}>

      <div className="flex items-center gap-3">
        {/* Page icon blob */}
        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-lg shrink-0"
             style={{ background: 'linear-gradient(135deg, #d4f0ca, #a8d49a)', border: '1.5px solid #c6e0bc' }}>
          {label.emoji}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <Icon size={12} className="text-amber" style={{ color: '#c47d15' }}/>
            <p className="text-ink-muted text-[11px] font-semibold">
              {greeting} <span className="font-hindi">{hi}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-display text-[17px] text-ink leading-none">{label.en}</p>
            <span className="font-hindi text-ink-muted text-sm">— {label.hi}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Seasonal tip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-border bg-mist">
          <Leaf size={12} className="text-soil-light" style={{ color: '#4a9040' }}/>
          <p className="font-hindi text-ink-muted text-[10px]">सर्वोत्तम भंडारण: 18°C, 65% RH</p>
        </div>

        {/* Connection badge */}
        <div className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border',
          connected
            ? 'border-border-strong text-soil'
            : 'bg-danger-light border-red-300 text-danger'
        ].join(' ')}
          style={ connected ? { background: 'linear-gradient(135deg, #d4f0ca, #c0e8b4)' } : {} }>
          <div className={connected ? 'live-pip' : 'w-2 h-2 rounded-full bg-danger'}/>
          {connected
            ? <><span>LIVE</span><span className="font-hindi font-normal ml-1">चालू</span></>
            : 'OFFLINE'
          }
        </div>

        {/* Alerts bell */}
        <Link to="/dashboard/alerts"
          className="relative p-2 rounded-[12px] hover:bg-fog border border-transparent hover:border-border transition-all no-underline">
          <Bell size={18} style={{ color: '#4a6840' }}/>
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #236320, #4a9040)' }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
