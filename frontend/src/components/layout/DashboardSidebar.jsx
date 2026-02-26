import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Radio, Wind, History, BrainCircuit,
  Wrench, Bell, Settings, ChevronLeft, ChevronRight, Package, LogOut, Leaf
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { to: '/dashboard/overview',    icon: LayoutDashboard, en: 'Overview',        hi: 'सारांश'          },
  { to: '/dashboard/live',        icon: Radio,           en: 'Live Monitoring',  hi: 'लाइव निगरानी'     },
  { to: '/dashboard/gas-control', icon: Wind,            en: 'Gas Control',      hi: 'गैस नियंत्रण'     },
  { to: '/dashboard/history',     icon: History,         en: 'History',          hi: 'इतिहास'           },
  { to: '/dashboard/predictions', icon: BrainCircuit,    en: 'AI Predictions',   hi: 'AI भविष्यवाणी'    },
  { to: '/dashboard/maintenance', icon: Wrench,          en: 'Maintenance',      hi: 'रखरखाव'           },
  { to: '/dashboard/alerts',      icon: Bell,            en: 'Alerts',           hi: 'अलर्ट'            },
  { to: '/dashboard/silos',       icon: Package,         en: 'My Silos',         hi: 'मेरे साइलो'       },
  { to: '/dashboard/settings',    icon: Settings,        en: 'Settings',         hi: 'सेटिंग्स'         },
]

function SideLeaf({ top, right, delay = '0s', opacity = 0.12 }) {
  return (
    <div className="absolute pointer-events-none animate-drift" style={{ top, right, animationDelay: delay, opacity }}>
      <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
        <path d="M11 28 C3 20 2 10 6 2 C16 8 17 20 11 28Z" fill="#3d7a35"/>
        <line x1="11" y1="28" x2="10" y2="3" stroke="#2d5a27" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function DashboardSidebar({ collapsed, setCollapsed }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const W = collapsed ? 70 : 254

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-[100] flex flex-col transition-all duration-250 overflow-hidden"
      style={{
        width: W,
        background: '#ffffff',
        borderRight: '1.5px solid #d4e8cc',
        boxShadow: '2px 0 20px rgba(45,90,39,0.07)',
      }}
    >
      {/* ── Logo ── */}
      <div className="relative flex items-center gap-3 px-4 h-16 border-b border-border shrink-0 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #f4fbf0 0%, #edf6e8 100%)' }}>
        {/* decorative leaves */}
        <SideLeaf top="4px" right="8px" delay="0s" opacity={0.18}/>
        <SideLeaf top="20px" right="24px" delay="1.5s" opacity={0.10}/>

        {/* Logo mark */}
        <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-[12px] shadow-leaf"
             style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
          <svg width="18" height="20" viewBox="0 0 18 22" fill="none">
            <path d="M9 21 C3 15 2 8 6 2 C14 6 15 15 9 21Z" fill="white"/>
            <line x1="9" y1="21" x2="8.2" y2="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>

        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display text-soil text-[20px] leading-none whitespace-nowrap">Preservia</p>
            <p className="font-hindi text-ink-muted text-[10px] leading-none mt-0.5">किसान का स्मार्ट भंडार</p>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {/* Section label */}
        {!collapsed && (
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase text-ink-faint">
            🌾 मुख्य मेनू
          </p>
        )}

        {NAV.map(({ to, icon: Icon, en, hi }) => (
          <NavLink key={to} to={to} title={collapsed ? en : undefined}
            className={({ isActive }) => ['nav-link', isActive ? 'active' : ''].join(' ')}>
            <Icon size={18} className="shrink-0"/>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-[13.5px] leading-tight">{en}</p>
                <p className="font-hindi text-ink-muted text-[10px] leading-tight font-normal">{hi}</p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-border p-2 flex flex-col gap-1 shrink-0"
           style={{ background: 'linear-gradient(135deg, #f4fbf0 0%, #edf6e8 100%)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 bg-white rounded-[14px] border border-border shadow-leaf">
            {/* Avatar with leaf crown */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                   style={{ background: 'linear-gradient(135deg, #d4f0ca 0%, #a8d49a 100%)', color: '#236320' }}>
                {user?.name?.[0]?.toUpperCase() || 'K'}
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-soil flex items-center justify-center">
                <Leaf size={7} color="white"/>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-ink text-xs font-bold truncate">{user?.name || 'Farmer'}</p>
              <p className="font-hindi text-ink-muted text-[10px] truncate">🌾 किसान</p>
            </div>
          </div>
        )}

        <button
          onClick={() => { logout(); navigate('/login') }}
          title={collapsed ? 'Logout' : undefined}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-sm font-semibold text-ink-soft hover:text-danger hover:bg-danger-light transition-all border-none bg-transparent cursor-pointer w-full">
          <LogOut size={17} className="shrink-0"/>
          {!collapsed && <span>Logout <span className="font-hindi text-xs font-normal text-ink-muted">/ लॉगआउट</span></span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-xs text-ink-muted hover:text-soil hover:bg-white transition-all border-none bg-transparent cursor-pointer w-full">
          {collapsed
            ? <ChevronRight size={16} className="shrink-0"/>
            : <><ChevronLeft size={16} className="shrink-0"/><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
