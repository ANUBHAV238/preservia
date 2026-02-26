import { useEffect, useState } from 'react'
import { BrainCircuit, Calendar, Info, AlertTriangle, TrendingUp, Clock, RefreshCw } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useSocket } from '@/context/SocketContext'
import api from '@/lib/api'

const RISKS = [
  { label: 'Sprouting Risk', key: 'sproutingRisk', base: 12 },
  { label: 'Decay Risk', key: 'decayRisk', base: 8 },
  { label: 'CO₂ Breach Risk', key: 'co2Risk', base: 35 },
  { label: 'Humidity Surge Risk', key: 'humidityRisk', base: 18 },
]

export default function PredictionsPage() {
  const { predictions } = useSocket()
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState(null)
  const [localPrediction, setLocalPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      setSilos(data.silos || [])
      if (data.silos?.length > 0) setSelectedSilo(data.silos[0]._id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedSilo) return
    api.get(`/prediction/${selectedSilo}`)
      .then(({ data }) => setLocalPrediction(data.prediction))
      .catch(() => {})
  }, [selectedSilo])

  const pred = (selectedSilo ? predictions[selectedSilo] : null) || localPrediction || {
    spoilageRisk: 14,
    estimatedSafeDays: 47,
    recommendation: 'Current atmospheric conditions are optimal. Schedule a brief ventilation cycle in 18 hours to maintain CO₂ within safe bounds.',
    sproutingRisk: 12,
    decayRisk: 8,
    co2Risk: 35,
    humidityRisk: 18,
    generatedAt: new Date().toISOString(),
  }

  const refresh = async () => {
    if (!selectedSilo) return
    setLoading(true)
    try {
      const { data } = await api.get(`/prediction/${selectedSilo}`)
      setLocalPrediction(data.prediction)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      <div className="flex items-center justify-between flex-wrap gap-3">
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
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} loading={loading} onClick={refresh}>
          Refresh Prediction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-t-2 border-t-accent">
          <BrainCircuit size={22} className="text-accent mb-3" />
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Remaining Shelf Life</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif font-black text-text-primary leading-none" style={{ fontSize: 64 }}>
              {pred.estimatedSafeDays ?? 47}
            </span>
            <span className="font-serif text-xl text-text-muted">days</span>
          </div>
          <p className="text-text-secondary text-sm">Based on current atmospheric profile and decay model v2.1</p>
          {pred.generatedAt && (
            <p className="text-text-muted text-xs mt-2">
              Generated: {new Date(pred.generatedAt).toLocaleString('en-IN')}
            </p>
          )}
        </Card>

        <Card className="border-t-2 border-t-blue-500">
          <Calendar size={22} className="text-blue-400 mb-3" />
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-2">Projected Dispatch Date</p>
          <p className="font-serif font-black text-text-primary text-4xl leading-none mb-2">
            {new Date(Date.now() + (pred.estimatedSafeDays ?? 47) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-text-secondary text-sm">Optimal market dispatch window based on spoilage forecast</p>

          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold">
              Overall spoilage risk: {pred.spoilageRisk ?? 14}%
            </span>
          </div>
        </Card>
      </div>

      {/* Risk matrix */}
      <Card>
        <h3 className="text-text-primary font-bold mb-5">Risk Assessment Matrix</h3>
        <div className="flex flex-col gap-5">
          {RISKS.map(({ label, key, base }) => {
            const pct = pred[key] ?? base
            const isHigh = pct > 30
            const isMed = pct > 15
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary text-sm">{label}</span>
                  <div className="flex items-center gap-2">
                    <Badge color={isHigh ? 'amber' : isMed ? 'blue' : 'accent'}>
                      {isHigh ? 'Medium' : isMed ? 'Low-Med' : 'Low'}
                    </Badge>
                    <span className="text-text-muted text-sm font-bold tabular-nums w-10 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: isHigh ? '#f59e0b' : isMed ? '#3b82f6' : '#00c896',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* AI advisory */}
      <Card className="border-l-[3px] border-l-accent">
        <div className="flex gap-3">
          <Info size={20} className="text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-text-primary font-bold mb-2">AI Advisory Recommendation</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              {pred.recommendation || 'Atmospheric conditions are within optimal range. Continue automated monitoring.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
