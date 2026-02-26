import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const LINKS = [
  { en:'Technology', hi:'तकनीक' },
  { en:'Platform',   hi:'मंच'   },
  { en:'Business',   hi:'व्यापार'},
  { en:'Research',   hi:'शोध'   },
]

export default function WebsiteNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={['fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/97 backdrop-blur-xl shadow-leaf'
        : 'bg-white/90 backdrop-blur-md'
    ].join(' ')}
    style={{ borderBottom: scrolled ? '1.5px solid #d4e8cc' : '1.5px solid rgba(212,232,204,0.5)' }}>

      <div className="wrap flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-10 h-10 rounded-[13px] shadow-leaf flex items-center justify-center shrink-0"
               style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
            <svg width="20" height="22" viewBox="0 0 20 24" fill="none">
              <path d="M10 22 C3 15 2 8 7 1 C15 6 16 16 10 22Z" fill="white"/>
              <line x1="10" y1="22" x2="9" y2="2" stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <span className="font-display text-[22px] text-soil leading-none">Preservia</span>
            <p className="font-hindi text-ink-muted text-[10px] leading-none mt-0.5">किसान का स्मार्ट भंडार</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map(l => (
            <button key={l.en}
              className="flex flex-col items-center px-4 py-2 rounded-xl hover:bg-fog transition-all cursor-pointer border-none bg-transparent text-left group">
              <span className="text-ink-soft text-sm font-semibold group-hover:text-soil transition-colors">{l.en}</span>
              <span className="font-hindi text-ink-muted text-[10px] group-hover:text-soil-light transition-colors">{l.hi}</span>
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <Button size="sm" onClick={() => navigate('/dashboard/overview')} icon={<Leaf size={14}/>}>
              <span>Dashboard</span>
              <span className="font-hindi text-xs opacity-75 ml-1">डैशबोर्ड</span>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden md:flex">
                Login <span className="font-hindi ml-1 text-xs">/ लॉगिन</span>
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get Started <span className="font-hindi ml-1 text-xs">/ शुरू करें</span>
              </Button>
            </>
          )}
          <button className="md:hidden p-2 border-none bg-transparent cursor-pointer text-ink-soft hover:text-soil" onClick={() => setOpen(!open)}>
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-1 animate-fadein shadow-leaf">
          {LINKS.map(l => (
            <button key={l.en}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-fog transition-all cursor-pointer border-none bg-transparent text-left w-full"
              onClick={() => setOpen(false)}>
              <Leaf size={14} style={{ color: '#4a9040' }}/>
              <span className="text-ink-soft font-semibold">{l.en}</span>
              <span className="font-hindi text-ink-muted text-sm">— {l.hi}</span>
            </button>
          ))}
          <div className="flex gap-2 pt-2 mt-1 border-t border-border">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => { navigate('/login'); setOpen(false) }}>Login</Button>
            <Button size="sm" className="flex-1" onClick={() => { navigate('/register'); setOpen(false) }}>Register</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
