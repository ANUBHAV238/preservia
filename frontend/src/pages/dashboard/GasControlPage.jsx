import { useState, useEffect } from 'react'
import { Wind, FlaskConical, Activity, Cpu, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import api from '@/lib/api'

const CONTROLS = [
  { key: 'openVent', icon: Activity, label: 'Ventilation', description: 'Open vent to allow fresh air circulation and reduce gas concentrations.' },
  { key: 'closeVent', icon: Wind, label: 'Close Vent', description: 'Seal the vent to maintain controlled atmosphere and conserve gas levels.' },
  { key: 'activateCO2', icon: FlaskConical, label: 'Activate CO₂ Injection', description: 'Inject CO₂ to reach target concentration and inhibit sprouting.' },
  { key: 'switchMode', icon: Cpu, label: 'Toggle Control Mode', description: 'Switch between automated and manual control modes.' },
  { key: 'resetSystem', icon: CheckCircle, label: 'Reset System', description: 'Reset all actuators to safe defaults and restart automated control.' },
]

export default function GasControlPage() {
  const [modal, setModal] = useState(null)
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState(null)
  const [siloState, setSiloState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      setSilos(data.silos || [])
      if (data.silos?.length > 0) {
        setSelectedSilo(data.silos[0]._id)
        setSiloState(data.silos[0].state || { mode: 'auto', ventOpen: false, co2Active: false })
      }
    }).catch(() => {})
  }, [])

  const confirm = async () => {
    if (!modal || !selectedSilo) return
    setLoading(true)
    try {
      const { data } = await api.post(`/control/${selectedSilo}`, { action: modal.key })
      setSiloState(data.state)
      setFeedback({ type: 'success', msg: `${modal.label} command executed successfully.` })
    } catch {
      setFeedback({ type: 'error', msg: 'Command failed. Check connection and try again.' })
    } finally {
      setLoading(false)
      setModal(null)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      {/* Warning banner */}
      <Card className="border-l-[3px] border-l-amber-500">
        <div className="flex gap-3 items-start">
          <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-bold mb-1">Manual Override Warning</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Manual control overrides automated atmospheric management. Incorrect settings can accelerate spoilage.
              Proceed with caution. All actions are logged with timestamp and user identity.
            </p>
          </div>
        </div>
      </Card>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${feedback.type === 'success' ? 'bg-accent/10 border-accent/30' : 'bg-red-500/10 border-red-500/30'}`}>
          {feedback.type === 'success'
            ? <CheckCircle size={16} className="text-accent shrink-0" />
            : <AlertCircle size={16} className="text-red-400 shrink-0" />
          }
          <p className={`text-sm ${feedback.type === 'success' ? 'text-accent' : 'text-red-400'}`}>{feedback.msg}</p>
        </div>
      )}

      {/* Silo selector */}
      {silos.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-text-muted text-sm">Silo:</span>
          {silos.map((s) => (
            <button
              key={s._id}
              onClick={() => { setSelectedSilo(s._id); setSiloState(s.state) }}
              className={['px-4 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer', selectedSilo === s._id ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Current state */}
      {siloState && (
        <div className="flex flex-wrap gap-3">
          <Badge color={siloState.mode === 'auto' ? 'accent' : 'amber'}>Mode: {siloState.mode?.toUpperCase()}</Badge>
          <Badge color={siloState.ventOpen ? 'accent' : 'gray'}>Vent: {siloState.ventOpen ? 'Open' : 'Closed'}</Badge>
          <Badge color={siloState.co2Active ? 'amber' : 'gray'}>CO₂: {siloState.co2Active ? 'Active' : 'Standby'}</Badge>
        </div>
      )}

      {/* Control cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONTROLS.map(({ key, icon: Icon, label, description }) => (
          <Card key={key} className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-accent/10 border border-accent/25 rounded-xl p-3">
                <Icon size={20} className="text-accent" />
              </div>
            </div>
            <div>
              <h3 className="text-text-primary font-bold text-base mb-1.5">{label}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModal({ key, label })}
              className="self-start"
            >
              Execute
            </Button>
          </Card>
        ))}
      </div>

      {/* Confirmation modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title="Confirm Manual Override">
        <div className="flex items-start gap-3 mb-5">
          <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-text-secondary text-sm leading-relaxed">
            You are about to manually execute <strong className="text-text-primary">{modal?.label}</strong>.
            This action will be logged with your user ID and timestamp. It may temporarily override automated atmospheric management.
          </p>
        </div>
        <div className="flex gap-3">
          <Button icon={<CheckCircle size={16} />} onClick={confirm} loading={loading}>
            Confirm
          </Button>
          <Button variant="ghost" onClick={() => setModal(null)} disabled={loading}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
