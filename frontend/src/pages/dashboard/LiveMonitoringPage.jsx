import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Wind, Activity, Wifi, Battery, RefreshCw } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useSocket } from '@/context/SocketContext'
import api from '@/lib/api'

function getStatus(key, val) {
  const thresholds = { temperature: [15, 22], humidity: [60, 72], co2: [3, 5.5], o2: [1, 3], battery: [20, 100] }
  const [min, max] = thresholds[key] || [0, 100]
  if (val < min || val > max) return 'critical'
  if (val > max * 0.9 || val < min * 1.1) return 'warning'
  return 'normal'
}

export default function LiveMonitoringPage() {
  const { sensorData, connected } = useSocket()
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      setSilos(data.silos || [])
      if (data.silos?.length > 0) setSelectedSilo(data.silos[0]._id)
    }).catch(() => {})
  }, [])

  const live = selectedSilo ? sensorData[selectedSilo] : null

  useEffect(() => {
    if (live) setLastUpdate(new Date())
  }, [live])

  // Demo fallback data when no backend
  const data = live || { temperature: 18.4, humidity: 65.2, co2: 4.8, o2: 2.1, battery: 87, healthScore: 94 }

  const cards = [
    { icon: Thermometer, key: 'temperature', label: 'Air Temperature', unit: '°C', iconColor: '#3b82f6' },
    { icon: Droplets, key: 'humidity', label: 'Relative Humidity', unit: '%', iconColor: '#00c896' },
    { icon: Wind, key: 'co2', label: 'CO₂ Concentration', unit: '%', iconColor: '#f59e0b' },
    { icon: Activity, key: 'o2', label: 'O₂ Concentration', unit: '%', iconColor: '#a78bfa' },
    { icon: Battery, key: 'battery', label: 'Battery Level', unit: '%', iconColor: '#00c896' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className={['w-2.5 h-2.5 rounded-full', connected ? 'bg-accent' : 'bg-red-400'].join(' ')} style={connected ? { boxShadow: '0 0 10px #00c896' } : {}} />
          <span className={`text-sm font-bold ${connected ? 'text-accent' : 'text-red-400'}`}>
            {connected ? 'LIVE — Streaming' : 'OFFLINE — Last data may be stale'}
          </span>
          {live && (
            <span className="text-text-muted text-xs ml-2">
              Updated {Math.round((Date.now() - lastUpdate.getTime()) / 1000)}s ago
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />}>Refresh</Button>
      </div>

      {/* Silo tabs */}
      {silos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {silos.map((s) => (
            <button
              key={s._id}
              onClick={() => setSelectedSilo(s._id)}
              className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer', selectedSilo === s._id ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Sensor cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, key, label, unit, iconColor }) => {
          const val = data[key]
          const status = getStatus(key, val)
          const color = status === 'normal' ? iconColor : status === 'warning' ? '#f59e0b' : '#ef4444'
          return (
            <Card key={key} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-40" style={{ background: `radial-gradient(circle, ${color}25, transparent)` }} />
              <div className="flex justify-between items-start mb-4">
                <div className="rounded-xl p-2.5 border" style={{ background: `${color}18`, borderColor: `${color}40` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <Badge color={status === 'normal' ? 'accent' : status === 'warning' ? 'amber' : 'red'}>{status}</Badge>
              </div>
              <div className="font-bold text-text-primary leading-none tabular-nums" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>
                {typeof val === 'number' ? val.toFixed(key === 'o2' ? 2 : 1) : '--'}
                <span className="text-base font-medium text-text-secondary ml-1">{unit}</span>
              </div>
              <p className="text-text-muted text-sm mt-2">{label}</p>

              {/* Mini progress */}
              <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((val / 100) * 100, 100)}%`, background: color }} />
              </div>
            </Card>
          )
        })}

        {/* Health score card */}
        <Card className="border border-accent/20" style={{ background: 'rgba(0,200,150,0.04)' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-accent/15 border border-accent/30 rounded-xl p-2.5">
              <Activity size={20} className="text-accent" />
            </div>
            <Badge color="accent">Composite</Badge>
          </div>
          <div className="font-serif font-black text-accent leading-none" style={{ fontSize: 48 }}>
            {data.healthScore ?? 94}
          </div>
          <p className="text-text-muted text-sm mt-2">Storage Health Score</p>
          <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-700" style={{ width: `${data.healthScore ?? 94}%` }} />
          </div>
        </Card>
      </div>

      {/* Node map */}
      <Card>
        <h3 className="text-text-primary font-bold mb-4">Sensor Node Network</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Node A — Front', 'Node B — Center', 'Node C — Rear', 'Node D — Top'].map((n, i) => (
            <div key={n} className="flex items-center gap-3 bg-accent/[0.06] border border-border rounded-xl p-3">
              <Wifi size={15} className="text-accent shrink-0" />
              <div>
                <p className="text-text-primary text-xs font-semibold">{n}</p>
                <p className="text-accent text-xs">-{60 + i * 2} dBm</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
