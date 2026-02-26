import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [validationError, setValidationError] = useState('')
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    if (result.success) navigate('/dashboard/overview')
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,200,150,0.08) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-4">
            <div className="bg-accent rounded-lg p-2">
              <Leaf size={22} className="text-bg" />
            </div>
            <span className="font-serif text-2xl font-bold text-text-primary">Preservia</span>
          </Link>
          <p className="text-text-secondary text-sm">Create your farmer account</p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-serif text-2xl font-bold text-text-primary mb-6">Get started</h1>

          {displayError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="Your name" icon={User} value={form.name} onChange={update('name')} required />
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={update('email')} required />
            <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" icon={Phone} value={form.phone} onChange={update('phone')} />
            <Input label="Password" type="password" placeholder="Min. 8 characters" icon={Lock} value={form.password} onChange={update('password')} required />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" icon={Lock} value={form.confirmPassword} onChange={update('confirmPassword')} required />

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-text-muted text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-dim font-semibold no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
