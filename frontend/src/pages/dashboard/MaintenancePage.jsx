import { useState } from 'react'
import { Bell, Wrench, RefreshCw, CheckCircle, Calendar } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const REMINDERS = [
  { label: 'CO₂ Cylinder Refill', due: '2024-02-28', urgency: 'amber' },
  { label: 'Humidity Sensor Calibration', due: '2024-03-05', urgency: 'accent' },
  { label: 'Edge Node Battery Check', due: '2024-03-15', urgency: 'accent' },
  { label: 'Annual System Inspection', due: '2024-04-01', urgency: 'blue' },
]

const SENSORS = ['Temperature Probe', 'Humidity Sensor', 'CO₂ Sensor (MQ-135)', 'O₂ Sensor', 'Pressure Sensor']

const LOGS = [
  { date: '2024-01-28', action: 'CO₂ cylinder replaced — 20kg', by: 'Manual', status: 'done' },
  { date: '2024-01-15', action: 'Sensor Node C recalibrated', by: 'Manual', status: 'done' },
  { date: '2023-12-30', action: 'N₂ line pressure check passed', by: 'System', status: 'done' },
  { date: '2023-12-12', action: 'Firmware updated to v2.4.1', by: 'System', status: 'done' },
  { date: '2023-11-20', action: 'Ventilation motor lubricated', by: 'Manual', status: 'done' },
]

export default function MaintenancePage() {
  const [calibrating, setCalibrating] = useState({})

  const calibrate = (sensor) => {
    setCalibrating((p) => ({ ...p, [sensor]: true }))
    setTimeout(() => {
      setCalibrating((p) => ({ ...p, [sensor]: false }))
    }, 2500)
  }

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reminders */}
        <Card>
          <h3 className="text-text-primary font-bold mb-5 flex items-center gap-2">
            <Bell size={17} className="text-amber-400" /> Upcoming Reminders
          </h3>
          <div className="flex flex-col gap-3">
            {REMINDERS.map(({ label, due, urgency }) => (
              <div key={label} className="flex items-center justify-between bg-surface-alt border border-border rounded-xl p-3.5">
                <div>
                  <p className="text-text-primary text-sm font-semibold">{label}</p>
                  <p className="text-text-muted text-xs mt-0.5 flex items-center gap-1">
                    <Calendar size={11} /> Due: {new Date(due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Badge color={urgency}>{urgency === 'amber' ? 'Soon' : urgency === 'blue' ? 'Planned' : 'OK'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Calibration */}
        <Card>
          <h3 className="text-text-primary font-bold mb-5 flex items-center gap-2">
            <Wrench size={17} className="text-accent" /> Sensor Calibration
          </h3>
          <div className="flex flex-col gap-1">
            {SENSORS.map((sensor) => (
              <div
                key={sensor}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {calibrating[sensor]
                    ? <RefreshCw size={13} className="text-accent animate-spin" />
                    : <CheckCircle size={13} className="text-accent" />
                  }
                  <span className="text-text-secondary text-sm">{sensor}</span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={<RefreshCw size={12} />}
                  loading={calibrating[sensor]}
                  onClick={() => calibrate(sensor)}
                >
                  Calibrate
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Maintenance Log */}
      <Card>
        <h3 className="text-text-primary font-bold mb-5">Maintenance Log</h3>
        <div className="flex flex-col">
          {LOGS.map(({ date, action, by, status }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
            >
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" style={{ boxShadow: '0 0 6px #00c896' }} />
              <span className="text-text-muted text-xs font-semibold w-28 shrink-0 mt-0.5">{date}</span>
              <span className="text-text-secondary text-sm flex-1">{action}</span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge color={by === 'Manual' ? 'amber' : 'blue'}>{by}</Badge>
                <CheckCircle size={14} className="text-accent" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
