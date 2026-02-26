import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone } from 'lucide-react'

function TreeSmall() {
  return (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" style={{ opacity: 0.18 }}>
      <rect x="17" y="44" width="6" height="18" rx="3" fill="#8B6239"/>
      <ellipse cx="20" cy="36" rx="16" ry="20" fill="#2d5a27"/>
      <ellipse cx="20" cy="22" rx="12" ry="15" fill="#3d7a35"/>
      <ellipse cx="20" cy="11" rx="8" ry="10" fill="#5fb84a"/>
    </svg>
  )
}

export default function WebsiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4fbf0 40%, #edf6e8 100%)', borderTop: '1.5px solid #d4e8cc' }}>
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full">
          <path d="M0 20 C300 5 600 35 900 20 C1100 10 1300 30 1440 20 L1440 0 L0 0Z" fill="rgba(212,240,202,0.4)"/>
        </svg>
      </div>

      {/* Tree accents */}
      <div className="absolute bottom-0 left-0 pointer-events-none"><TreeSmall/></div>
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ transform: 'scaleX(-1)' }}><TreeSmall/></div>

      <div className="wrap py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-[13px] shadow-leaf flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
                <svg width="18" height="20" viewBox="0 0 18 22" fill="none">
                  <path d="M9 21 C3 15 2 8 6 2 C14 6 15 15 9 21Z" fill="white"/>
                  <line x1="9" y1="21" x2="8.2" y2="3" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-display text-2xl text-soil">Preservia</p>
                <p className="font-hindi text-ink-muted text-[10px]">किसान का स्मार्ट भंडार</p>
              </div>
            </div>
            <p className="text-ink-soft text-sm leading-relaxed max-w-xs mb-3">
              Precision atmosphere-controlled onion storage for Indian farmers. Reduce losses from 40% to under 15%.
            </p>
            <p className="font-hindi text-ink-muted text-sm leading-relaxed max-w-xs">
              भारतीय किसानों के लिए स्मार्ट प्याज भंडारण प्रणाली — नुकसान 40% से 15% से नीचे लाएं।
            </p>
            <div className="flex gap-3 mt-5">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-[12px] border border-border shadow-leaf">
                <Mail size={13} style={{ color: '#4a9040' }}/>
                <span className="text-xs text-ink-soft">info@preservia.io</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-[12px] border border-border shadow-leaf">
                <Phone size={13} style={{ color: '#4a9040' }}/>
                <span className="text-xs text-ink-soft">1800-XXX-XXXX</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="font-bold text-ink text-sm mb-4 flex items-center gap-1.5">
              <Leaf size={13} style={{ color: '#4a9040' }}/> Platform
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { en: 'Live Dashboard', hi: 'लाइव डैशबोर्ड', to: '/dashboard/overview' },
                { en: 'AI Predictions', hi: 'AI भविष्यवाणी', to: '/dashboard/predictions' },
                { en: 'Gas Control',   hi: 'गैस नियंत्रण',  to: '/dashboard/gas-control' },
                { en: 'Alerts',        hi: 'अलर्ट',         to: '/dashboard/alerts' },
              ].map(l => (
                <Link key={l.en} to={l.to} className="group no-underline">
                  <span className="text-ink-soft text-sm group-hover:text-soil transition-colors">{l.en}</span>
                  <span className="font-hindi text-ink-muted text-xs ml-1.5">/ {l.hi}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="font-bold text-ink text-sm mb-4 flex items-center gap-1.5">
              🌾 Company
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { en: 'About Us',   hi: 'हमारे बारे में' },
                { en: 'Research',   hi: 'शोध'            },
                { en: 'Privacy',    hi: 'गोपनीयता'       },
                { en: 'Contact',    hi: 'संपर्क'          },
              ].map(l => (
                <button key={l.en} className="text-left flex items-baseline gap-1.5 group cursor-pointer border-none bg-transparent p-0">
                  <span className="text-ink-soft text-sm group-hover:text-soil transition-colors">{l.en}</span>
                  <span className="font-hindi text-ink-muted text-xs">/ {l.hi}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-ink-muted text-xs">© {year} Preservia Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted font-hindi">किसान के लिए, किसान के साथ 🌱</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
