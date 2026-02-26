import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Leaf, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'

function FarmLeaf({ style, rotate = 0, size = 30 }) {
  return (
    <div className="absolute pointer-events-none animate-drift" style={style}>
      <svg width={size} height={size * 1.4} viewBox="0 0 30 42" fill="none" style={{ transform: `rotate(${rotate}deg)`, opacity: 0.14 }}>
        <path d="M15 39 C5 29 4 16 10 3 C22 12 23 28 15 39Z" fill="#3d7a35"/>
        <line x1="15" y1="39" x2="13.5" y2="5" stroke="#2d5a27" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="9" y1="22" x2="15" y2="16" stroke="#2d5a27" strokeWidth="0.9" strokeLinecap="round"/>
        <line x1="10" y1="31" x2="17" y2="25" stroke="#2d5a27" strokeWidth="0.9" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function TreeSilhouette({ side = 'left' }) {
  return (
    <div className={`absolute bottom-0 pointer-events-none animate-sway ${side === 'right' ? 'right-0' : 'left-0'}`}
         style={{ opacity: 0.13, transformOrigin: 'bottom center', animationDelay: side === 'right' ? '1.2s' : '0s', transform: side === 'right' ? 'scaleX(-1)' : '' }}>
      <svg width="120" height="280" viewBox="0 0 120 280" fill="none">
        <rect x="53" y="222" width="14" height="60" rx="7" fill="#8B6239"/>
        <ellipse cx="60" cy="190" rx="48" ry="64" fill="#2d5a27"/>
        <ellipse cx="60" cy="148" rx="38" ry="50" fill="#3d7a35"/>
        <ellipse cx="60" cy="110" rx="28" ry="38" fill="#4a9040"/>
        <ellipse cx="60" cy="78"  rx="20" ry="28" fill="#5fb84a"/>
        <ellipse cx="60" cy="52"  rx="13" ry="18" fill="#89d46f"/>
      </svg>
    </div>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit() {
    setError('')
    if (!form.email || !form.password) { setError('सभी जानकारी भरें / Please fill all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      nav('/dashboard/overview')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please check credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden"
         style={{ background: 'linear-gradient(160deg, #eaf6e4 0%, #f6fbf3 40%, #ffffff 100%)' }}>

      {/* Decorations */}
      <div className="absolute inset-0 bg-field-pattern opacity-40 pointer-events-none"/>
      <div className="absolute top-[-120px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(95,184,74,0.10) 0%, transparent 70%)' }}/>
      <TreeSilhouette side="left"/>
      <TreeSilhouette side="right"/>
      <FarmLeaf style={{ top: '12%', left: '15%', animationDelay: '0s' }} rotate={-20} size={32}/>
      <FarmLeaf style={{ top: '25%', right: '18%', animationDelay: '1.4s' }} rotate={15} size={24}/>
      <FarmLeaf style={{ bottom: '20%', left: '22%', animationDelay: '0.7s' }} rotate={35} size={20}/>
      <FarmLeaf style={{ top: '60%', right: '14%', animationDelay: '2.0s' }} rotate={-30} size={28}/>

      {/* Card */}
      <div className="m-auto w-full max-w-[420px] px-4 relative z-10 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-risein">
          <Link to="/" className="flex items-center gap-2.5 no-underline mb-1">
            <div className="w-12 h-12 rounded-[16px] shadow-leaf-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                <path d="M11 24 C3 17 2 9 7 2 C17 7 18 18 11 24Z" fill="white"/>
                <line x1="11" y1="24" x2="10" y2="3" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
          <p className="font-display text-[28px] text-soil">Preservia</p>
          <p className="font-hindi text-ink-muted text-sm">किसान का स्मार्ट भंडार</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-[24px] border-2 border-border shadow-leaf-xl p-7 animate-risein" style={{ animationDelay: '0.15s' }}>
          <div className="mb-6">
            <h2 className="font-display text-2xl text-ink">लॉगिन करें</h2>
            <p className="text-ink-muted text-sm mt-0.5 font-hindi">Welcome back — आपका स्वागत है 🌿</p>
          </div>

          {/* Demo hint */}
          <div className="mb-5 px-4 py-3 rounded-[14px] flex items-start gap-2.5"
               style={{ background: 'linear-gradient(135deg, #f4fbf0, #edf6e8)', border: '1.5px solid #c6e0bc' }}>
            <span className="text-lg mt-0.5">🌾</span>
            <div>
              <p className="text-soil text-xs font-bold">Demo Login</p>
              <p className="text-ink-soft text-xs">Email: <code className="font-mono bg-white px-1 rounded text-soil">demo@preservia.io</code></p>
              <p className="text-ink-soft text-xs">Password: <code className="font-mono bg-white px-1 rounded text-soil">Demo@1234</code></p>
            </div>
          </div>

          {error && (
            <div className="alert-banner-critical mb-4">
              <p className="text-danger text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-ink text-sm font-bold mb-1.5">
              Email <span className="font-hindi font-normal text-ink-muted">/ ईमेल</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a8bca0' }}/>
              <input className="field-input pl-10" type="email" placeholder="your@email.com"
                     value={form.email} onChange={set('email')}
                     onKeyDown={e => e.key === 'Enter' && submit()}/>
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-ink text-sm font-bold mb-1.5">
              Password <span className="font-hindi font-normal text-ink-muted">/ पासवर्ड</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a8bca0' }}/>
              <input className="field-input pl-10 pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                     value={form.password} onChange={set('password')}
                     onKeyDown={e => e.key === 'Enter' && submit()}/>
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 border-none bg-transparent cursor-pointer text-ink-muted hover:text-soil transition-colors">
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <Button size="lg" className="w-full" loading={loading} icon={<ArrowRight size={17}/>} onClick={submit}>
            लॉगिन करें / Sign In
          </Button>

          <p className="text-center text-ink-muted text-sm mt-5">
            New farmer? <span className="font-hindi">नए किसान?</span>{' '}
            <Link to="/register" className="text-soil font-bold hover:text-soil-mid no-underline">
              Register / पंजीकरण
            </Link>
          </p>
        </div>

        {/* Bottom leaf row */}
        <div className="flex justify-center gap-3 mt-6 opacity-30">
          {['🍃','🌿','🍃','🌱','🍃'].map((e, i) => (
            <span key={i} className="text-lg animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
