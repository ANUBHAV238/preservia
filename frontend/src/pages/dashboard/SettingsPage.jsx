import { useState, useEffect } from 'react'
import { ToggleLeft, ToggleRight, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/lib/api'

const DEFAULT_THRESHOLDS = {
  temperatureMin: 15, temperatureMax: 22,
  humidityMin: 60, humidityMax: 72,
  co2Min: 3, co2Max: 5.5,
  o2Min: 1, o2Max: 3,
  batteryMin: 20,
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({ alerts: true, sms: true, email: false, autoVent: true, nightMode: false })
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)
  const [silos, setSilos] = useState([])
  const [selectedSilo, setSelectedSilo] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [deviceToken, setDeviceToken] = useState('')

  useEffect(() => {
    api.get('/silos').then(({ data }) => {
      const s = data.silos || []
      setSilos(s)
      if (s.length > 0) {
        setSelectedSilo(s[0]._id)
        if (s[0].thresholds) setThresholds({ ...DEFAULT_THRESHOLDS, ...s[0].thresholds })
      }
    }).catch(() => {})
  }, [])

  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))
  const updateThreshold = (k) => (e) => setThresholds((t) => ({ ...t, [k]: parseFloat(e.target.value) || 0 }))

  const saveThresholds = async () => {
    if (!selectedSilo) return
    setSaving(true)
    try {
      await api.put(`/silos/${selectedSilo}`, { thresholds })
      setFeedback({ type: 'success', msg: 'Thresholds saved successfully.' })
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to save thresholds.' })
    } finally {
      setSaving(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const registerToken = async () => {
    if (!deviceToken) return
    try {
      await api.post('/auth/device-token', { token: deviceToken })
      setFeedback({ type: 'success', msg: 'Device token registered for push notifications.' })
      setDeviceToken('')
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to register device token.' })
    } finally {
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl animate-slideup">
      {feedback && (
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${feedback.type === 'success' ? 'bg-accent/10 border-accent/30' : 'bg-red-500/10 border-red-500/30'}`}>
          {feedback.type === 'success' ? <CheckCircle size={16} className="text-accent" /> : <AlertCircle size={16} className="text-red-400" />}
          <p className={`text-sm ${feedback.type === 'success' ? 'text-accent' : 'text-red-400'}`}>{feedback.msg}</p>
        </div>
      )}

      {/* Notification prefs */}
      <Card>
        <h3 className="text-text-primary font-bold mb-5">Alert Preferences</h3>
        {[
          { key: 'alerts', label: 'Push Notifications', desc: 'In-app alerts for threshold breaches' },
          { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS to registered number' },
          { key: 'email', label: 'Email Reports', desc: 'Weekly summary reports to email' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
            <div>
              <p className="text-text-primary text-sm font-semibold">{label}</p>
              <p className="text-text-muted text-xs mt-0.5">{desc}</p>
            </div>
            <button onClick={() => toggle(key)} className="bg-transparent border-none cursor-pointer p-0">
              {prefs[key]
                ? <ToggleRight size={34} className="text-accent" />
                : <ToggleLeft size={34} className="text-text-muted" />
              }
            </button>
          </div>
        ))}
      </Card>

      {/* Control prefs */}
      <Card>
        <h3 className="text-text-primary font-bold mb-5">Control Settings</h3>
        {[
          { key: 'autoVent', label: 'Automatic Ventilation', desc: 'Allow AI to trigger ventilation cycles automatically' },
          { key: 'nightMode', label: 'Night Mode Operation', desc: 'Reduce actuator activity between 10pm and 5am' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
            <div>
              <p className="text-text-primary text-sm font-semibold">{label}</p>
              <p className="text-text-muted text-xs mt-0.5">{desc}</p>
            </div>
            <button onClick={() => toggle(key)} className="bg-transparent border-none cursor-pointer p-0">
              {prefs[key]
                ? <ToggleRight size={34} className="text-accent" />
                : <ToggleLeft size={34} className="text-text-muted" />
              }
            </button>
          </div>
        ))}
      </Card>

      {/* Threshold config */}
      <Card>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="text-text-primary font-bold">Threshold Configuration</h3>
          {silos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {silos.map((s) => (
                <button
                  key={s._id}
                  onClick={() => { setSelectedSilo(s._id); if (s.thresholds) setThresholds({ ...DEFAULT_THRESHOLDS, ...s.thresholds }) }}
                  className={['px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all', selectedSilo === s._id ? 'bg-accent/15 border-accent text-accent' : 'bg-transparent border-border text-text-secondary'].join(' ')}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          {Object.entries(thresholds).map(([key, val]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                {key.replace(/([A-Z])/g, ' $1').replace(/Min|Max/, (m) => ` ${m}`).trim()}
              </label>
              <input
                type="number"
                step="0.1"
                value={val}
                onChange={updateThreshold(key)}
                className="bg-bg border border-border rounded-lg py-2 px-3 text-text-primary text-sm focus:outline-none focus:border-accent/60 transition-all"
              />
            </div>
          ))}
        </div>
        <Button icon={<CheckCircle size={16} />} loading={saving} onClick={saveThresholds}>
          Save Thresholds
        </Button>
      </Card>

      {/* Push notification token */}
      <Card>
        <h3 className="text-text-primary font-bold mb-4">Mobile Push Notifications</h3>
        <p className="text-text-secondary text-sm mb-4">Register your device Firebase Cloud Messaging token to receive push notifications.</p>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-bg border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/60 transition-all"
            placeholder="Paste FCM device token"
            value={deviceToken}
            onChange={(e) => setDeviceToken(e.target.value)}
          />
          <Button size="sm" onClick={registerToken}>Register</Button>
        </div>
      </Card>
    </div>
  )
}
