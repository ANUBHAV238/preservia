import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Factory, Wind, BrainCircuit, CheckCircle, Wifi, Cpu, Cloud, Settings, TrendingDown, Clock, Zap, Package, DollarSign, Building2, Globe, Database, ArrowRight, LayoutDashboard } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { SectionLabel, SectionTitle } from '@/components/ui/SectionHeading'

// Shared leaf decoration
function CornerLeaf({ position = 'tr', color = '#3a7d44', opacity = 0.1 }) {
  const styles = {
    tr: 'absolute top-8 right-8',
    tl: 'absolute top-8 left-8',
    br: 'absolute bottom-8 right-8',
    bl: 'absolute bottom-8 left-8',
  }
  return (
    <div className={`${styles[position]} pointer-events-none`} style={{ opacity }}>
      <svg width="50" height="65" viewBox="0 0 50 65" fill="none">
        <path d="M25 62 C8 46, 5 26, 15 5 C36 20, 42 44, 25 62Z" fill={color}/>
        <line x1="25" y1="62" x2="22" y2="8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ── Technology ────────────────────────────────────────────────────────────────
const TECH_PILLARS = [
  {
    icon: Factory, title: 'Structural Engineering', hindi: 'संरचनात्मक इंजीनियरिंग',
    points: [
      { en: 'Modular corrugated iron chambers', hi: 'मॉड्यूलर चैंबर' },
      { en: 'Optimized airflow geometry', hi: 'हवा प्रवाह अनुकूलन' },
      { en: 'Thermal insulation layers', hi: 'थर्मल इन्सुलेशन' },
      { en: 'Stackable 5–50 MT configurations', hi: '5-50 टन क्षमता' },
    ],
  },
  {
    icon: Wind, title: 'Atmospheric Regulation', hindi: 'वायुमंडलीय नियंत्रण',
    points: [
      { en: 'Precision CO₂ injection (3–5%)', hi: 'CO₂ इंजेक्शन नियंत्रण' },
      { en: 'O₂ depletion via N₂ flushing', hi: 'नाइट्रोजन फ्लशिंग' },
      { en: 'Humidity control (60–70%)', hi: 'नमी नियंत्रण' },
      { en: 'Temperature band 15–22°C', hi: 'तापमान नियंत्रण' },
    ],
  },
  {
    icon: BrainCircuit, title: 'Intelligent Monitoring', hindi: 'बुद्धिमान निगरानी',
    points: [
      { en: 'Multi-sensor IoT nodes', hi: 'IoT सेंसर नेटवर्क' },
      { en: 'Raspberry Pi edge processing', hi: 'एज कंप्यूटिंग' },
      { en: 'GSM/WiFi dual connectivity', hi: 'दोहरी कनेक्टिविटी' },
      { en: 'Cloud dashboard + SMS alerts', hi: 'SMS अलर्ट सिस्टम' },
    ],
  },
]

export function TechnologySection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-surface-alt relative overflow-hidden">
      <CornerLeaf position="tr" opacity={0.12} />
      <CornerLeaf position="bl" color="#5a9e3f" opacity={0.08} />
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="मुख्य तकनीक">Core Technology</SectionLabel>
        <SectionTitle sub="Three integrated engineering domains work in concert to create a cost-effective alternative to conventional cold storage." subHindi="तीन इंजीनियरिंग क्षेत्र मिलकर सस्ता और प्रभावी भंडारण समाधान बनाते हैं।">
          The Preservia Technology Stack
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_PILLARS.map(({ icon: Icon, title, hindi, points }) => (
            <div key={title} className="bg-white rounded-2xl border border-border shadow-card p-6 border-t-[3px] border-t-accent hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
              <div className="bg-accent-light border border-accent-soft rounded-xl p-3 inline-flex mb-4">
                <Icon size={22} className="text-accent" />
              </div>
              <h3 className="text-text-primary text-lg font-bold mb-0.5">{title}</h3>
              <p className="hindi-text text-text-muted text-xs mb-4">{hindi}</p>
              <ul className="flex flex-col gap-2.5">
                {points.map(({ en, hi }) => (
                  <li key={en} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text-secondary text-sm">{en}</span>
                      <span className="hindi-text text-text-muted text-[10px] ml-1">— {hi}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Architecture ──────────────────────────────────────────────────────────────
const ARCH_STEPS = [
  { icon: Wifi, num: '01', title: 'Sensor Acquisition', hindi: 'सेंसर डेटा संग्रह', desc: 'DHT22, MQ-135, and custom gas sensors collect temperature, humidity, CO₂, and O₂ readings every 30 seconds.', descHindi: 'हर 30 सेकंड में सेंसर डेटा एकत्र होता है।' },
  { icon: Cpu, num: '02', title: 'Edge Processing', hindi: 'एज प्रोसेसिंग', desc: 'Raspberry Pi microcontrollers perform local anomaly detection with sub-100ms latency — even without internet.', descHindi: 'बिना इंटरनेट के भी काम करता है।' },
  { icon: Cloud, num: '03', title: 'Cloud Sync', hindi: 'क्लाउड सिंक', desc: 'Processed telemetry is pushed to cloud every 5 minutes. Historical data indexed for ML training.', descHindi: 'हर 5 मिनट में डेटा क्लाउड में जाता है।' },
  { icon: Settings, num: '04', title: 'Automated Control', hindi: 'स्वचालित नियंत्रण', desc: 'AI-driven logic triggers CO₂ injection, N₂ flushing, or ventilation based on threshold breaches.', descHindi: 'AI स्वचालित रूप से गैस और वेंटिलेशन नियंत्रित करता है।' },
]

export function ArchitectureSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-field relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #3a7d44 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="max-w-[1280px] mx-auto relative">
        <SectionLabel hindi="सिस्टम आर्किटेक्चर">System Architecture</SectionLabel>
        <SectionTitle sub="A four-layer architecture ensures reliable operation under real-world agricultural conditions — including intermittent power and connectivity." subHindi="चार-परत वाली प्रणाली बिजली-कटौती में भी काम करती है।">
          From Sensor to Action in Milliseconds
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ARCH_STEPS.map(({ icon: Icon, num, title, hindi, desc, descHindi }) => (
            <div key={num} className="bg-white rounded-2xl border border-border shadow-card p-6 relative overflow-hidden hover:shadow-card-hover transition-all">
              <div className="absolute top-4 right-4 font-serif text-6xl font-bold text-border leading-none select-none">{num}</div>
              <div className="bg-accent-light border border-accent-soft rounded-xl p-2.5 inline-flex mb-3">
                <Icon size={18} className="text-accent" />
              </div>
              <h3 className="text-text-primary text-base font-bold mb-0.5">{title}</h3>
              <p className="hindi-text text-text-muted text-xs mb-2">{hindi}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              <p className="hindi-text text-text-muted text-[11px] mt-1">{descHindi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Dashboard Preview ─────────────────────────────────────────────────────────
export function DashboardPreviewSection() {
  const navigate = useNavigate()
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      <CornerLeaf position="tl" opacity={0.1} />
      <CornerLeaf position="br" color="#8B6914" opacity={0.1} />
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="प्लेटफॉर्म झलक">Platform Preview</SectionLabel>
        <SectionTitle sub="The Preservia dashboard gives farmers complete visibility of storage conditions from any device, anywhere." subHindi="किसी भी मोबाइल या कंप्यूटर से अपने भंडार की निगरानी करें।">
          Intelligence at Your Fingertips
        </SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Temperature', hindi: 'तापमान', value: '18.4', unit: '°C', status: 'OK', color: '#2563eb' },
            { label: 'Humidity', hindi: 'नमी', value: '65.2', unit: '%', status: 'OK', color: '#3a7d44' },
            { label: 'CO₂', hindi: 'CO₂', value: '4.8', unit: '%', status: 'OK', color: '#d97706' },
            { label: 'O₂', hindi: 'O₂', value: '2.1', unit: '%', status: 'WATCH', color: '#d97706' },
            { label: 'Health Score', hindi: 'स्वास्थ्य', value: '94', unit: '/100', status: 'OK', color: '#3a7d44' },
          ].map(({ label, hindi, value, unit, status, color }) => (
            <div key={label} className="bg-white border border-border rounded-2xl shadow-card p-4 text-center hover:shadow-card-hover transition-all">
              <div className="font-bold text-text-primary text-2xl leading-none mb-0.5 tabular-nums" style={{ color }}>
                {value}<span className="text-sm text-text-muted font-medium">{unit}</span>
              </div>
              <p className="text-text-secondary text-xs font-medium">{label}</p>
              <p className="hindi-text text-text-muted text-[10px]">{hindi}</p>
              <div className="mt-2">
                <Badge color={status === 'OK' ? 'accent' : 'amber'}>{status}</Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center ">
          <Button size="lg" icon={<LayoutDashboard size={18} />} onClick={() => navigate('/dashboard/overview')}>
            Open Live Dashboard <span className="hindi-text text-xs font-normal opacity-80 ml-1">/ डैशबोर्ड खोलें</span>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ── Performance ───────────────────────────────────────────────────────────────
const PERF = [
  { icon: TrendingDown, value: '63%', label: 'Average loss reduction', hindi: 'औसत नुकसान में कमी', sub: 'From 40% to 15% post-harvest losses', subHindi: '40% से 15% तक नुकसान' },
  { icon: Clock, value: '6–8 Mo', label: 'Extended shelf life', hindi: 'विस्तारित शेल्फ जीवन', sub: 'vs 2–3 months conventional', subHindi: 'पारंपरिक की तुलना में 3x अधिक' },
  { icon: Zap, value: '40%', label: 'Energy savings', hindi: 'ऊर्जा बचत', sub: 'vs cold storage electricity use', subHindi: 'कोल्ड स्टोरेज से कम बिजली' },
  { icon: Package, value: '5–500 MT', label: 'Modular capacity', hindi: 'मॉड्यूलर क्षमता', sub: 'Scalable per farm need', subHindi: 'खेत की जरूरत के अनुसार' },
]

export function PerformanceSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-accent relative overflow-hidden">
      {/* Decorative leaf pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 70 C18 52 12 28 26 8 C48 22 56 48 40 70Z' fill='white' /%3E%3C/svg%3E\")", backgroundSize: '80px 80px' }} />
      <div className="max-w-[1280px] mx-auto relative">
        <div className="flex items-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18 C5 13, 3 8, 7 3 C13 8, 15 13, 10 18Z" fill="white" opacity="0.8"/>
          </svg>
          <span className="text-white/80 text-xs font-bold tracking-[0.15em] uppercase">Impact & Performance</span>
          <span className="hindi-text text-white/50 text-[10px] ml-1">प्रभाव और प्रदर्शन</span>
        </div>
        <div className="mb-10">
          <h2 className="font-serif text-[clamp(26px,3.5vw,44px)] font-bold text-white leading-[1.2] mb-3">Measurable Outcomes,<br />Validated in the Field</h2>
          <p className="text-white/60 text-sm hindi-text">वास्तविक खेत पर परीक्षित और सिद्ध परिणाम</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERF.map(({ icon: Icon, value, label, hindi, sub, subHindi }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
              <div className="bg-white/20 rounded-xl p-2.5 inline-flex mb-4">
                <Icon size={18} className="text-white" />
              </div>
              <div className="font-serif text-[38px] font-bold text-white leading-none mb-1">{value}</div>
              <p className="text-white font-semibold text-sm mb-0.5">{label}</p>
              <p className="hindi-text text-white/60 text-xs mb-2">{hindi}</p>
              <p className="text-white/60 text-xs">{sub}</p>
              <p className="hindi-text text-white/40 text-[10px] mt-0.5">{subHindi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Comparison Table ──────────────────────────────────────────────────────────
const CMP_ROWS = [
  { label: 'Initial Capital Cost', hindi: 'शुरुआती लागत', traditional: '₹20K–50K', cold: '₹10–15L', preservia: '₹1.5–4L' },
  { label: 'Operating Cost / Year', hindi: 'सालाना खर्च', traditional: 'Low', cold: '₹1.5–3L', preservia: '₹30–80K' },
  { label: 'Loss Reduction', hindi: 'नुकसान में कमी', traditional: 'None', cold: '60–70%', preservia: '60–75%' },
  { label: 'Shelf Life Extension', hindi: 'शेल्फ जीवन', traditional: 'None', cold: '8–12 months', preservia: '6–8 months' },
  { label: 'Remote Monitoring', hindi: 'रिमोट निगरानी', traditional: 'No', cold: 'Limited', preservia: 'Full Cloud' },
  { label: 'Rural Accessibility', hindi: 'ग्रामीण पहुँच', traditional: 'High', cold: 'Very Low', preservia: 'High' },
  { label: 'Electricity Required', hindi: 'बिजली की जरूरत', traditional: 'None', cold: '15–30 kW', preservia: '< 2 kW' },
]

export function ComparisonSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-surface-alt relative overflow-hidden">
      <CornerLeaf position="tr" opacity={0.1} />
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="तुलना">Competitive Comparison</SectionLabel>
        <SectionTitle sub="Preservia delivers near-cold-storage performance at a fraction of the cost — accessible to every farmer." subHindi="Preservia कम कीमत में कोल्ड स्टोरेज जैसा फायदा देता है।">
          How Preservia Compares
        </SectionTitle>
        <div className="overflow-x-auto rounded-2xl border border-border shadow-card">
          <table className="w-full min-w-[560px] bg-white" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Feature / विशेषता', 'Traditional', 'Cold Storage', 'Preservia'].map((h, i) => (
                  <th key={h} className={['px-5 py-4 text-xs font-bold tracking-wide uppercase border-b', i === 0 ? 'text-left text-text-secondary border-border' : 'text-center', i === 3 ? 'text-accent bg-accent-light border-b-2 border-accent' : 'text-text-muted border-border'].join(' ')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CMP_ROWS.map((row, ri) => (
                <tr key={row.label} className={ri % 2 === 1 ? 'bg-surface-alt' : 'bg-white'}>
                  <td className="px-5 py-4 border-b border-border">
                    <span className="text-text-secondary text-sm font-medium">{row.label}</span>
                    <span className="hindi-text text-text-muted text-[10px] block">{row.hindi}</span>
                  </td>
                  <td className="px-5 py-4 text-text-muted text-sm text-center border-b border-border">{row.traditional}</td>
                  <td className="px-5 py-4 text-text-muted text-sm text-center border-b border-border">{row.cold}</td>
                  <td className="px-5 py-4 text-accent text-sm font-bold text-center bg-accent-light/50 border-b border-accent-soft">{row.preservia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ── Business Model ────────────────────────────────────────────────────────────
const BIZ = [
  { icon: Package, title: 'Equipment Lease', hindi: 'उपकरण किराए पर', desc: 'Lease the complete Preservia unit at ₹8,000–12,000/month. No upfront capital. Includes sensor kit, edge node, and cloud subscription.', descHindi: 'मासिक किराए पर पूरा सेटअप — कोई बड़ी अग्रिम राशि नहीं।' },
  { icon: DollarSign, title: 'Revenue Share', hindi: 'राजस्व साझेदारी', desc: 'We deploy at zero cost and take 8–12% of incremental revenue from reduced losses. Aligned incentives.', descHindi: 'हम बिना लागत लगाएं — केवल फायदे में हिस्सेदारी।' },
  { icon: Building2, title: 'FPO / Cooperative', hindi: 'FPO / सहकारी', desc: 'Farmer Producer Organizations purchase units at ₹1.5–4L for shared deployment serving 10–40 farmers.', descHindi: 'किसान उत्पादक संगठनों के लिए साझा भंडारण।' },
  { icon: Globe, title: 'SaaS Subscription', hindi: 'SaaS सब्सक्रिप्शन', desc: 'Cloud platform subscription at ₹2,500–5,000/month includes ML predictions, analytics, and SMS alerts.', descHindi: 'मासिक सदस्यता में AI अनुमान और SMS अलर्ट।' },
]

export function BusinessSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      <CornerLeaf position="tl" color="#8B6914" opacity={0.08} />
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="व्यवसाय मॉडल">Business Model</SectionLabel>
        <SectionTitle sub="Multiple deployment and monetization pathways to serve individual farmers, cooperatives, and agribusiness enterprises." subHindi="व्यक्तिगत किसानों, सहकारी समितियों और कृषि व्यवसायों के लिए लचीले विकल्प।">
          Flexible. Scalable. Farmer-First.
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BIZ.map(({ icon: Icon, title, hindi, desc, descHindi }) => (
            <div key={title} className="bg-white border border-border rounded-2xl shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent-soft transition-all duration-200 cursor-pointer">
              <div className="bg-accent-light border border-accent-soft rounded-xl p-3 inline-flex mb-4">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="text-text-primary text-base font-bold mb-0.5">{title}</h3>
              <p className="hindi-text text-text-muted text-xs mb-3">{hindi}</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-1">{desc}</p>
              <p className="hindi-text text-text-muted text-[11px] leading-relaxed">{descHindi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Research ──────────────────────────────────────────────────────────────────
const REFS = [
  { title: 'Modified Atmosphere Storage of Onions', journal: 'Postharvest Biology & Technology', year: '2021', tags: ['Atmosphere Control', 'Onion'] },
  { title: 'IoT-Based Post-Harvest Monitoring Systems', journal: 'Computers and Electronics in Agriculture', year: '2022', tags: ['IoT', 'Edge AI'] },
  { title: 'Cost-Benefit Analysis of Rural Cold Chain Alternatives', journal: 'Journal of Agricultural Economics', year: '2020', tags: ['Economics'] },
  { title: 'Precision Controlled Atmosphere for Allium Crops', journal: 'Scientia Horticulturae', year: '2023', tags: ['CO₂ Regulation'] },
  { title: 'Low-Cost Sensor Networks for Storage Monitoring', journal: 'Smart Agricultural Technology', year: '2023', tags: ['Sensors'] },
  { title: 'Sprouting Inhibition via CO₂ Enrichment', journal: 'Food Control', year: '2019', tags: ['Quality Control'] },
]

export function ResearchSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-surface-alt">
      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="शोध आधार">Research Foundation</SectionLabel>
        <SectionTitle sub="Preservia's technology is grounded in peer-reviewed agricultural and engineering research." subHindi="Preservia की तकनीक वैज्ञानिक शोध पर आधारित है।">
          Built on Scientific Evidence
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REFS.map(({ title, journal, year, tags }) => (
            <div key={title} className="bg-white border border-border rounded-2xl shadow-card p-5 hover:shadow-card-hover hover:border-accent-soft transition-all duration-200 cursor-pointer">
              <div className="flex justify-between mb-3">
                <Database size={15} className="text-accent" />
                <span className="text-text-muted text-xs font-bold">{year}</span>
              </div>
              <h4 className="text-text-primary text-sm font-bold leading-snug mb-2">{title}</h4>
              <p className="text-text-muted text-xs italic mb-3">{journal}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => <Badge key={t} color="accent">{t}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Contact ───────────────────────────────────────────────────────────────────
export function ContactSection() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', farm: '', location: '', capacity: '' })
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const cls = 'w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all'

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      {/* Decorative field background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full h-full">
          <path d="M0 100 L0 60 Q180 20 360 60 Q540 100 720 60 Q900 20 1080 60 Q1260 100 1440 60 L1440 100 Z" fill="#3a7d44" opacity="0.06"/>
        </svg>
      </div>
      <div className="max-w-3xl mx-auto relative">
        <SectionLabel hindi="डेमो अनुरोध">Request a Demo</SectionLabel>
        <SectionTitle sub="Our agricultural engineers will assess your storage requirements and design a custom Preservia deployment." subHindi="हमारे कृषि इंजीनियर आपकी जरूरत के अनुसार समाधान तैयार करेंगे।">
          Get Started with Preservia
        </SectionTitle>
        {submitted ? (
          <div className="bg-accent-light border border-accent-soft rounded-2xl p-12 text-center">
            <div className="bg-accent rounded-2xl p-4 inline-flex mb-5">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-1">Request Received!</h3>
            <p className="hindi-text text-text-muted text-sm mb-3">आपका अनुरोध प्राप्त हो गया है</p>
            <p className="text-text-secondary mb-6">Our team will contact you within 48 hours to schedule a site assessment.</p>
            <Button onClick={() => navigate('/register')} icon={<ArrowRight size={16} />}>Create Your Account</Button>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl shadow-card p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { k: 'name', label: 'Full Name', hindi: 'पूरा नाम', ph: 'Your name' },
                { k: 'phone', label: 'Phone / WhatsApp', hindi: 'फोन / व्हाट्सएप', ph: '+91 98765 43210', type: 'tel' },
                { k: 'email', label: 'Email (optional)', hindi: 'ईमेल (वैकल्पिक)', ph: 'you@example.com', type: 'email' },
                { k: 'farm', label: 'Farm Size (Acres)', hindi: 'खेत का आकार (एकड़)', ph: 'e.g. 15 acres' },
                { k: 'location', label: 'Village / District', hindi: 'गांव / जिला', ph: 'e.g. Nashik, MH' },
              ].map(({ k, label, hindi, ph, type = 'text' }) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <label className="text-text-primary text-sm font-semibold">{label}</label>
                  <p className="hindi-text text-text-muted text-xs -mt-1">{hindi}</p>
                  <input type={type} className={cls} placeholder={ph} value={form[k]} onChange={update(k)} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary text-sm font-semibold">Storage Capacity Needed</label>
                <p className="hindi-text text-text-muted text-xs -mt-1">आवश्यक भंडारण क्षमता</p>
                <select className={cls} value={form.capacity} onChange={update('capacity')}>
                  <option value="">Select / चुनें</option>
                  {['5–20 MT', '20–50 MT', '50–150 MT', '150–500 MT', '500+ MT'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="col-span-full">
                <Button size="lg" icon={<ArrowRight size={18} />} onClick={() => setSubmitted(true)}>
                  Submit Request <span className="hindi-text text-xs font-normal opacity-80 ml-1">/ अनुरोध भेजें</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
