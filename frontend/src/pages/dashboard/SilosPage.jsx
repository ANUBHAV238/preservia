import { useEffect, useState } from 'react'
import { Package, Plus, Trash2, Edit2, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import api from '@/lib/api'

export default function SilosPage() {
  const [silos, setSilos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', capacity: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/silos')
      .then(({ data }) => setSilos(data.silos || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setSubmitting(true)
    try {
      await api.post('/silos', form)
      setFeedback({ type: 'success', msg: 'Silo created successfully.' })
      setShowCreate(false)
      setForm({ name: '', capacity: '', location: '' })
      load()
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.message || 'Failed to create silo.' })
    } finally {
      setSubmitting(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const deleteSilo = async (id) => {
    if (!window.confirm('Delete this silo? This cannot be undone.')) return
    try {
      await api.delete(`/silos/${id}`)
      setSilos((prev) => prev.filter((s) => s._id !== id))
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to delete silo.' })
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="flex flex-col gap-6 animate-slideup">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-text-primary font-bold text-xl">Silos</h2>
          <p className="text-text-muted text-sm mt-0.5">{silos.length} storage unit{silos.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowCreate(true)}>Add Silo</Button>
      </div>

      {feedback && (
        <div className={`flex items-center gap-3 rounded-xl p-4 border ${feedback.type === 'success' ? 'bg-accent/10 border-accent/30' : 'bg-red-500/10 border-red-500/30'}`}>
          {feedback.type === 'success' ? <CheckCircle size={16} className="text-accent" /> : <AlertCircle size={16} className="text-red-400" />}
          <p className={`text-sm ${feedback.type === 'success' ? 'text-accent' : 'text-red-400'}`}>{feedback.msg}</p>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-text-muted">Loading silos...</div>
      ) : silos.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No silos yet"
          description="Add your first storage silo to start monitoring."
          action={<Button icon={<Plus size={16} />} onClick={() => setShowCreate(true)}>Add Silo</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {silos.map((silo) => (
            <Card key={silo._id}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-accent/10 border border-accent/25 rounded-xl p-2.5">
                  <Package size={20} className="text-accent" />
                </div>
                <div className="flex gap-2">
                  <Badge color={silo.state?.mode === 'auto' ? 'accent' : 'amber'}>
                    {silo.state?.mode || 'auto'}
                  </Badge>
                </div>
              </div>
              <h3 className="text-text-primary font-bold text-lg mb-1">{silo.name}</h3>
              <p className="text-text-muted text-sm mb-3">{silo.location || 'Location not set'}</p>
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Capacity</span>
                  <span className="text-text-secondary font-semibold">{silo.capacity || '--'} MT</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Health Score</span>
                  <span className="text-accent font-bold">{silo.lastReading?.healthScore ?? '--'}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button variant="ghost" size="xs" icon={<Edit2 size={12} />}>Edit</Button>
                <Button variant="danger" size="xs" icon={<Trash2 size={12} />} onClick={() => deleteSilo(silo._id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New Silo">
        <div className="flex flex-col gap-4">
          <Input label="Silo Name" placeholder="e.g. Silo A, North Chamber" value={form.name} onChange={update('name')} required />
          <Input label="Location" placeholder="e.g. Main Farm, Block 2" value={form.location} onChange={update('location')} />
          <Input label="Capacity (MT)" type="number" placeholder="e.g. 25" value={form.capacity} onChange={update('capacity')} />
          <div className="flex gap-3 pt-2">
            <Button loading={submitting} icon={<Plus size={16} />} onClick={create}>Create Silo</Button>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
