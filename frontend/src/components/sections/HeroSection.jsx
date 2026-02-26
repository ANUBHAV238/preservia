import { useNavigate } from 'react-router-dom'
import { Thermometer, Droplets, Wind, Activity, ChevronRight, Eye, Leaf } from 'lucide-react'
import Button from '@/components/ui/Button'

/* ── Decorative farm tree ────────────────────────────────────────────────── */
function FarmTree({ x, h = 180, delay = '0s', opacity = 0.22, flip = false, size = 1 }) {
  const W = 80 * size, H = h * size
  const trunk = { w: 9 * size, h: 55 * size, x: (W - 9 * size) / 2, y: H - 58 * size }
  return (
    <div className="absolute bottom-0 pointer-events-none animate-sway" style={{ left: x, animationDelay: delay, transformOrigin: 'bottom center', opacity, transform: flip ? 'scaleX(-1)' : '' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        {/* Trunk */}
        <rect x={trunk.x} y={trunk.y} width={trunk.w} height={trunk.h} rx={4} fill="#8B6239"/>
        <rect x={trunk.x + 2} y={trunk.y + 4} width={3} height={trunk.h - 10} rx={2} fill="rgba(255,255,255,0.18)"/>
        {/* 4-layer canopy */}
        <ellipse cx={W/2} cy={H - 70*size} rx={30*size} ry={38*size} fill="#2d5a27"/>
        <ellipse cx={W/2} cy={H - 95*size} rx={24*size} ry={30*size} fill="#3d7a35"/>
        <ellipse cx={W/2} cy={H - 118*size} rx={18*size} ry={24*size} fill="#4a9040"/>
        <ellipse cx={W/2} cy={H - 136*size} rx={12*size} ry={16*size} fill="#5fb84a"/>
        <ellipse cx={W/2} cy={H - 148*size} rx={7*size} ry={10*size} fill="#89d46f"/>
        {/* Highlight sparkles */}
        <circle cx={W/2 - 6*size} cy={H - 105*size} r={3*size} fill="rgba(255,255,255,0.18)"/>
        <circle cx={W/2 + 8*size} cy={H - 90*size} r={2*size} fill="rgba(255,255,255,0.14)"/>
      </svg>
    </div>
  )
}

/* ── Floating leaf ───────────────────────────────────────────────────────── */
function FloatLeaf({ style, rotate = 0, size = 28, color = '#3d7a35' }) {
  return (
    <div className="absolute pointer-events-none animate-drift" style={style}>
      <svg width={size} height={size * 1.4} viewBox="0 0 28 40" fill="none" style={{ transform: `rotate(${rotate}deg)`, opacity: 0.18 }}>
        <path d="M14 37 C4 28 3 14 9 3 C21 11 22 27 14 37Z" fill={color}/>
        <line x1="14" y1="37" x2="12.5" y2="5" stroke="rgba(45,90,39,0.7)" strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="9"  y1="22" x2="14" y2="17" stroke="rgba(45,90,39,0.5)" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="10" y1="30" x2="16" y2="24" stroke="rgba(45,90,39,0.5)" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="10" y1="13" x2="15" y2="9"  stroke="rgba(45,90,39,0.4)" strokeWidth="0.7" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

/* ── Wheat stalk ─────────────────────────────────────────────────────────── */
function WheatStalk({ x, h = 90, delay = '0s', opacity = 0.20 }) {
  return (
    <div className="absolute bottom-0 pointer-events-none animate-sway2" style={{ left: x, animationDelay: delay, transformOrigin: 'bottom center', opacity }}>
      <svg width="18" height={h} viewBox={`0 0 18 ${h}`} fill="none">
        <line x1="9" y1={h} x2="9" y2="0" stroke="#c47d15" strokeWidth="1.8" strokeLinecap="round"/>
        {[0.25, 0.4, 0.55, 0.68, 0.80].map((t, i) => (
          <g key={i}>
            <ellipse cx={9 + (i % 2 === 0 ? -5 : 5)} cy={h * (1 - t)} rx="4" ry="6" fill="#d4a84b" opacity="0.85"/>
            <ellipse cx={9 + (i % 2 === 0 ? -4 : 4)} cy={h * (1 - t) - 1} rx="2" ry="3" fill="#eacc7a" opacity="0.6"/>
          </g>
        ))}
        <ellipse cx="9" cy="6" rx="3" ry="7" fill="#d4a84b"/>
      </svg>
    </div>
  )
}

/* ── Ground bushes ───────────────────────────────────────────────────────── */
function Bush({ x, delay = '0s', opacity = 0.22, width = 70 }) {
  return (
    <div className="absolute bottom-0 pointer-events-none animate-sway" style={{ left: x, animationDelay: delay, transformOrigin: 'bottom center', opacity }}>
      <svg width={width} height={40} viewBox="0 0 70 40" fill="none">
        <ellipse cx="20" cy="30" rx="18" ry="14" fill="#4a9040"/>
        <ellipse cx="38" cy="26" rx="22" ry="18" fill="#3d7a35"/>
        <ellipse cx="55" cy="30" rx="16" ry="12" fill="#5fb84a"/>
        <ellipse cx="38" cy="22" rx="14" ry="10" fill="#89d46f"/>
      </svg>
    </div>
  )
}

/* ── Sensor tile in preview card ─────────────────────────────────────────── */
function SensorTile({ icon: Icon, label, hi, value, unit, status = 'normal' }) {
  const colors = {
    normal:   { bg: '#f4fbf0', border: '#c6e0bc', val: '#2d5a27', dot: '#4a9040' },
    warning:  { bg: '#fffbeb', border: '#fde68a', val: '#92400e', dot: '#d97706' },
    critical: { bg: '#fff1f0', border: '#f5c6c0', val: '#991b1b', dot: '#dc2626' },
  }
  const c = colors[status]
  return (
    <div className="rounded-[14px] p-3" style={{ background: c.bg, border: `1.5px solid ${c.border}` }}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="p-1.5 rounded-[8px] bg-white border border-border">
          <Icon size={13} color={c.dot}/>
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: c.dot, boxShadow: `0 0 0 3px ${c.border}` }}/>
      </div>
      <p className="text-[22px] font-bold leading-none" style={{ color: c.val }}>{value}<span className="text-[13px] font-semibold ml-0.5 opacity-70">{unit}</span></p>
      <p className="text-ink-soft text-[11px] font-bold mt-0.5">{label}</p>
      <p className="font-hindi text-ink-muted text-[9px]">{hi}</p>
    </div>
  )
}

/* ── Main hero ───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const nav = useNavigate()
  return (
    <section className="min-h-screen flex items-center pt-20 pb-0 px-4 md:px-8 lg:px-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #eaf6e4 0%, #f6fbf3 35%, #ffffff 70%, #fffef8 100%)' }}>

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft glow blobs */}
        <div className="absolute top-[-180px] right-[-80px] w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(95,184,74,0.10) 0%, transparent 70%)' }}/>
        <div className="absolute bottom-[80px] left-[-100px] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(45,90,39,0.07) 0%, transparent 70%)' }}/>
        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,125,21,0.05) 0%, transparent 70%)' }}/>

        {/* Field dot texture on upper portion */}
        <div className="absolute inset-0 bg-field-pattern opacity-40"/>

        {/* Horizon ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-[90px]" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(213,240,198,0.35) 100%)' }}/>

        {/* Trees — left cluster */}
        <FarmTree x="0px"   h={220} delay="0s"   opacity={0.22} size={1.2}/>
        <FarmTree x="90px"  h={160} delay="1.4s" opacity={0.14} size={0.85}/>
        <FarmTree x="150px" h={100} delay="2.2s" opacity={0.10} size={0.6}/>

        {/* Trees — right cluster */}
        <FarmTree x="calc(100% - 70px)"  h={200} delay="0.5s" opacity={0.22} flip size={1.1}/>
        <FarmTree x="calc(100% - 160px)" h={150} delay="1.8s" opacity={0.15} flip size={0.8}/>
        <FarmTree x="calc(100% - 220px)" h={110} delay="3.0s" opacity={0.09} flip size={0.6}/>

        {/* Wheat stalks */}
        <WheatStalk x="22%" h={80} delay="0.3s" opacity={0.22}/>
        <WheatStalk x="24%" h={65} delay="1.1s" opacity={0.16}/>
        <WheatStalk x="26%" h={90} delay="0.7s" opacity={0.19}/>
        <WheatStalk x="72%" h={75} delay="1.5s" opacity={0.20}/>
        <WheatStalk x="74%" h={55} delay="0.9s" opacity={0.15}/>
        <WheatStalk x="76%" h={85} delay="2.1s" opacity={0.18}/>

        {/* Ground bushes */}
        <Bush x="180px" delay="0.8s" opacity={0.18}/>
        <Bush x="calc(100% - 240px)" delay="1.6s" opacity={0.15} width={80}/>

        {/* Floating leaves */}
        <FloatLeaf style={{ top: '15%', left: '14%',  animationDelay: '0s' }}   rotate={-22} size={30} color="#3d7a35"/>
        <FloatLeaf style={{ top: '28%', left: '38%',  animationDelay: '1.6s' }} rotate={14}  size={22} color="#5fb84a"/>
        <FloatLeaf style={{ top: '10%', right: '18%', animationDelay: '0.8s' }} rotate={-10} size={38} color="#2d5a27"/>
        <FloatLeaf style={{ top: '42%', right: '32%', animationDelay: '2.4s' }} rotate={28}  size={20} color="#89d46f"/>
        <FloatLeaf style={{ top: '22%', right: '12%', animationDelay: '1.2s' }} rotate={-35} size={26} color="#4a9040"/>
        <FloatLeaf style={{ top: '60%', left: '22%',  animationDelay: '3.0s' }} rotate={18}  size={18} color="#5fb84a"/>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center relative z-10">

        {/* Left — copy */}
        <div className="animate-risein">
          {/* Ribbon tag */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="tag">
              <Leaf size={11}/>
              IoT + Edge AI Platform
            </span>
            <span className="font-hindi text-ink-muted text-sm">🌿 स्मार्ट किसान भंडार</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(32px,5vw,62px)] text-ink leading-[1.08] mb-4">
            प्याज का<br/>
            <span className="text-gradient-leaf">स्मार्ट भंडारण</span><br/>
            <span className="font-lora italic text-[0.72em] font-normal text-ink-muted">Smart Onion Storage</span>
          </h1>

          {/* Sub */}
          <p className="font-hindi text-ink-soft text-xl leading-relaxed mb-2">
            गांव के किसान के लिए — कम लागत में 40% नुकसान को 15% से नीचे लाएं
          </p>
          <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-lg">
            Preservia uses precision <strong className="text-soil">atmosphere control</strong>, edge AI, and real-time cloud monitoring to protect your onion harvest — no expensive cold storage needed.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Button size="lg" icon={<ChevronRight size={18}/>} onClick={() => nav('/register')}>
              डेमो बुक करें &nbsp;/&nbsp; Request Demo
            </Button>
            <Button variant="secondary" size="lg" icon={<Eye size={18}/>} onClick={() => nav('/dashboard/overview')}>
              Dashboard देखें
            </Button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: '🌱', en: 'Eco-Safe',    hi: 'पर्यावरण सुरक्षित' },
              { icon: '🤖', en: 'Edge AI',     hi: 'एज इंटेलिजेंस' },
              { icon: '📡', en: 'Live Data',   hi: 'लाइव डेटा' },
              { icon: '🔒', en: 'Secure',      hi: 'सुरक्षित' },
              { icon: '🌾', en: 'Farm-Ready',  hi: 'खेत के लिए बना' },
            ].map(t => (
              <div key={t.en} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border rounded-[14px] shadow-leaf hover:border-border-strong hover:shadow-leaf-lg transition-all">
                <span className="text-base">{t.icon}</span>
                <div>
                  <p className="text-ink text-xs font-bold leading-tight">{t.en}</p>
                  <p className="font-hindi text-ink-muted text-[10px] leading-tight">{t.hi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — live dashboard preview card */}
        <div className="hidden lg:block animate-fadein" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-[28px] blur-2xl opacity-30" style={{ background: 'linear-gradient(135deg, #89d46f, #4a9040)', transform: 'scale(0.92) translateY(12px)' }}/>

            <div className="relative bg-white rounded-[24px] border-2 border-border shadow-leaf-xl overflow-hidden">
              {/* Card header — green */}
              <div className="px-5 py-4 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' }}>
                <div>
                  <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase">साइलो A-01 — Nashik</p>
                  <p className="font-display text-white text-lg">Live Sensor Feed</p>
                  <p className="font-hindi text-white/55 text-[10px]">लाइव सेंसर फ़ीड</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1.5">
                    <div className="live-pip" style={{ background: '#89d46f' }}/>
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                  <p className="font-hindi text-white/40 text-[9px]">अभी चालू है</p>
                </div>
              </div>

              {/* Sensor grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <SensorTile icon={Thermometer} label="Temperature" hi="तापमान" value="18.4" unit="°C" status="normal"/>
                <SensorTile icon={Droplets}    label="Humidity"    hi="नमी"   value="76.2" unit="%"  status="warning"/>
                <SensorTile icon={Wind}        label="CO₂ Level"  hi="कार्बन डाइऑक्साइड"  value="4.31" unit="%"  status="normal"/>
                <SensorTile icon={Activity}    label="O₂ Level"   hi="ऑक्सीजन"   value="2.18" unit="%"  status="normal"/>
              </div>

              {/* Health bar */}
              <div className="px-4 pb-4">
                <div className="bg-mist border border-border rounded-[14px] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-soil text-xs font-bold">Health Score</p>
                      <p className="font-hindi text-ink-muted text-[9px]">स्वास्थ्य स्कोर</p>
                    </div>
                    <span className="text-soil font-bold text-lg">84<span className="text-xs opacity-60">/100</span></span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '84%', background: 'linear-gradient(90deg, #4a9040, #89d46f)' }}/>
                  </div>
                  <p className="font-hindi text-ink-muted text-[9px] mt-1.5 text-right">अनुमानित शेल्फ जीवन: 38 दिन</p>
                </div>
              </div>

              {/* Status footer */}
              <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-mist">
                <div className="flex items-center gap-2">
                  <div className="live-pip"/>
                  <span className="text-ink-soft text-xs font-semibold">Auto Mode</span>
                  <span className="font-hindi text-ink-muted text-[10px]">स्वचालित</span>
                </div>
                <span className="text-ink-muted text-[10px]">Updated 2s ago</span>
              </div>
            </div>

            {/* Floating mini leaf decoration */}
            <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-meadow border-2 border-white shadow-leaf flex items-center justify-center animate-float">
              <span className="text-xl">🌿</span>
            </div>
            <div className="absolute -bottom-3 -left-4 w-8 h-8 rounded-full bg-wheat border-2 border-white shadow-warm flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
              <span className="text-base">🌾</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ground wave ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40 C200 10 400 70 720 40 C1040 10 1240 60 1440 40 L1440 80 L0 80 Z" fill="rgba(212,240,202,0.3)"/>
          <path d="M0 55 C300 30 600 75 900 50 C1100 35 1300 65 1440 55 L1440 80 L0 80 Z" fill="rgba(196,232,180,0.25)"/>
        </svg>
      </div>
    </section>
  )
}
