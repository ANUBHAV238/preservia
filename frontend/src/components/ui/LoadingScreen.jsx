export default function LoadingScreen({ message = 'Loading...', hiMessage = 'लोड हो रहा है...' }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
         style={{ background: 'linear-gradient(160deg, #eaf6e4 0%, #f6fbf3 40%, #ffffff 100%)' }}>

      {/* Background field dots */}
      <div className="absolute inset-0 bg-field-pattern opacity-40 pointer-events-none"/>

      {/* Floating leaves */}
      <div className="absolute top-[20%] left-[15%] pointer-events-none animate-drift" style={{ animationDelay: '0s', opacity: 0.14 }}>
        <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
          <path d="M14 37 C4 28 3 14 9 3 C21 11 22 27 14 37Z" fill="#3d7a35"/>
          <line x1="14" y1="37" x2="12.5" y2="5" stroke="#2d5a27" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="absolute top-[55%] right-[18%] pointer-events-none animate-drift" style={{ animationDelay: '1.5s', opacity: 0.12 }}>
        <svg width="22" height="32" viewBox="0 0 28 40" fill="none" style={{ transform: 'rotate(20deg)' }}>
          <path d="M14 37 C4 28 3 14 9 3 C21 11 22 27 14 37Z" fill="#5fb84a"/>
          <line x1="14" y1="37" x2="12.5" y2="5" stroke="#2d5a27" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Logo */}
      <div className="relative mb-8 animate-bloom">
        <div className="w-20 h-20 rounded-[22px] flex items-center justify-center shadow-leaf-xl"
             style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
          <svg width="34" height="40" viewBox="0 0 34 42" fill="none">
            <path d="M17 39 C5 29 4 15 11 3 C27 11 28 29 17 39Z" fill="white"/>
            <line x1="17" y1="39" x2="15.5" y2="4" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="22" x2="17" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="11" y1="32" x2="19" y2="25" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-[22px] animate-ping" style={{ background: 'rgba(95,184,74,0.2)', animationDuration: '2s' }}/>
      </div>

      <p className="font-display text-3xl text-soil mb-1">Preservia</p>
      <p className="font-hindi text-ink-muted text-sm mb-8">किसान का स्मार्ट भंडार</p>

      {/* Progress bar */}
      <div className="w-52 h-2 bg-meadow rounded-full overflow-hidden border border-border mb-4">
        <div className="animate-loadbar h-full rounded-full"
             style={{ background: 'linear-gradient(90deg, #4a9040, #89d46f, #4a9040)', backgroundSize: '200%' }}/>
      </div>

      <p className="text-ink-soft text-sm font-semibold">{message}</p>
      <p className="font-hindi text-ink-muted text-xs mt-0.5">{hiMessage}</p>

      {/* Leaf row */}
      <div className="flex gap-3 mt-8 opacity-25">
        {['🍃','🌿','🌱','🌿','🍃'].map((e, i) => (
          <span key={i} className="text-xl animate-float" style={{ animationDelay: `${i * 0.25}s` }}>{e}</span>
        ))}
      </div>
    </div>
  )
}
