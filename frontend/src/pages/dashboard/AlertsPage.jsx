import { useEffect, useState } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { useSocket } from '@/context/SocketContext'
import api from '@/lib/api'

export default function AlertsPage() {
  const { alerts: socketAlerts } = useSocket()
  const [apiAlerts, setApiAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState('all')

  useEffect(() => {
    api.get('/silos')
      .then(({ data }) => {
        const s = data.silos || []
        setSilos(s)
        if (s.length > 0) loadAlerts(s[0]._id)
        else setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const loadAlerts = (siloId) => {
    setLoading(true)
    api.get(`/alerts/${siloId}`)
      .then(({ data }) => setApiAlerts(data.alerts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const combined = [...socketAlerts, ...apiAlerts].slice(0, 60)

  const iconFor = (type) => {
    if (!type) return <Info size={15} className="text-blue-400" />
    if (type.includes('critical') || type.includes('exceed') || type.includes('breach'))
      return <AlertTriangle size={15} className="text-red-400" />
    if (type.includes('warning') || type.includes('risk') || type.includes('low'))
      return <Info size={15} className="text-amber-400" />
    return <CheckCircle size={15} className="text-accent" />
  }

  const badgeColor = (type) => {
    if (!type) return 'blue'
    if (type.includes('critical') || type.includes('exceed')) return 'red'
    if (type.includes('warning') || type.includes('risk')) return 'amber'
    return 'accent'
  }

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setSelectedSilo('all')}
          className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer', selectedSilo === 'all' ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}
        >
          All
        </button>
        {silos.map((s) => (
          <button key={s._id} onClick={() => { setSelectedSilo(s._id); loadAlerts(s._id) }}
            className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer', selectedSilo === s._id ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}>
            {s.name}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-text-primary font-bold">Alert History</h3>
          <Badge color="amber">{combined.length} records</Badge>
        </div>
        {loading ? (
          <p className="text-text-muted text-sm py-8 text-center">Loading...</p>
        ) : combined.length === 0 ? (
          <EmptyState icon={Bell} title="No alerts" description="All systems operating within normal thresholds." />
        ) : (
          <div className="flex flex-col">
            {combined.map((alert, i) => (
              <div key={alert._id || i} className="flex items-start gap-4 py-4 border-b border-border last:border-b-0">
                <div className="shrink-0 mt-0.5 p-1.5 rounded-lg bg-surface-alt border border-border">
                  {iconFor(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                    <p className="text-text-primary text-sm font-semibold">{alert.message || alert.description || 'System alert'}</p>
                    <Badge color={badgeColor(alert.type)} className="shrink-0">{alert.type || 'info'}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-text-muted text-xs">
                      {new Date(alert.createdAt || alert.timestamp || Date.now()).toLocaleString('en-IN')}
                    </span>
                    {alert.siloName && <span className="text-text-muted text-xs">{alert.siloName}</span>}
                    <Badge color="gray">{alert.triggeredBy || 'system'}</Badge>
                    {alert.actionType && <Badge color="blue">{alert.actionType}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
