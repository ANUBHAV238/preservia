import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'
import api from '@/lib/api'

const METRICS = [
  { key: 'temperature', label: 'Temperature (°C)', color: '#3b82f6' },
  { key: 'humidity', label: 'Humidity (%)', color: '#00c896' },
  { key: 'co2', label: 'CO₂ (%)', color: '#f59e0b' },
  { key: 'o2', label: 'O₂ (%)', color: '#a78bfa' },
]

const RANGES = [
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
]

// Generate demo data
function generateDemo(points = 48, hours = 24) {
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(Date.now() - (points - 1 - i) * (hours / points) * 3600 * 1000)
    return {
      time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      temperature: 16 + Math.random() * 6,
      humidity: 60 + Math.random() * 14,
      co2: 3.5 + Math.random() * 2.5,
      o2: 1.5 + Math.random() * 1.5,
    }
  })
}

export default function HistoricalDataPage() {
  const [range, setRange] = useState(RANGES[0])
  const [chartData, setChartData] = useState(generateDemo())
  const [activeMetrics, setActiveMetrics] = useState(['temperature', 'humidity'])
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState(null)

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      setSilos(data.silos || [])
      if (data.silos?.length > 0) setSelectedSilo(data.silos[0]._id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedSilo) { setChartData(generateDemo(48, range.hours)); return }
    api.get(`/sensor/history/${selectedSilo}?hours=${range.hours}`)
      .then(({ data }) => {
        if (data.readings?.length) {
          setChartData(data.readings.map((r) => ({
            time: new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            temperature: r.temperature,
            humidity: r.humidity,
            co2: r.co2,
            o2: r.o2,
          })))
        } else {
          setChartData(generateDemo(48, range.hours))
        }
      })
      .catch(() => setChartData(generateDemo(48, range.hours)))
  }, [selectedSilo, range])

  const toggleMetric = (key) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  // Stats
  const stats = METRICS.map(({ key, label, color }) => {
    const vals = chartData.map((d) => d[key]).filter(Boolean)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    const max = vals.length ? Math.max(...vals) : 0
    const min = vals.length ? Math.min(...vals) : 0
    return { key, label, color, avg, max, min }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-text-muted mb-2 font-semibold">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value?.toFixed(2)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r)}
              className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer', range.label === r.label ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}
            >
              {r.label}
            </button>
          ))}
        </div>
        {silos.length > 0 && (
          <div className="flex gap-2">
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
        <Button variant="ghost" size="sm" icon={<Download size={14} />}>Export CSV</Button>
      </div>

      {/* Metric toggles */}
      <div className="flex flex-wrap gap-2">
        {METRICS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={['px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer', activeMetrics.includes(key) ? 'opacity-100' : 'opacity-40'].join(' ')}
            style={activeMetrics.includes(key) ? { borderColor: color, color, background: `${color}15` } : { borderColor: '#1a2d45', color: '#7a9bb5', background: 'transparent' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main chart */}
      <Card>
        <h3 className="text-text-primary font-bold mb-5">Sensor Trend — {range.label}</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2d45" />
              <XAxis
                dataKey="time"
                stroke="#4a6480"
                tick={{ fill: '#4a6480', fontSize: 10 }}
                interval={Math.floor(chartData.length / 8)}
              />
              <YAxis stroke="#4a6480" tick={{ fill: '#4a6480', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              {METRICS.filter((m) => activeMetrics.includes(m.key)).map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ key, label, color, avg, max, min }) => (
          <Card key={key}>
            <div className="w-3 h-3 rounded-full mb-3" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            <p className="text-text-muted text-xs font-semibold mb-3 truncate">{label}</p>
            <div className="flex flex-col gap-1.5">
              {[['Avg', avg], ['Max', max], ['Min', min]].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-text-muted text-xs">{l}</span>
                  <span className="text-text-primary text-xs font-bold tabular-nums">{v.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
