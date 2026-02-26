import { TrendingDown, DollarSign, AlertTriangle, Clock, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import { SectionLabel, SectionTitle } from '@/components/ui/SectionHeading'

const STATS = [
  { icon: TrendingDown, value: '30–40%', label: 'Post-harvest loss in conventional storage', hindi: 'पारंपरिक भंडारण में फसल की बर्बादी', color: '#dc2626', bg: '#fee2e2' },
  { icon: DollarSign, value: '₹10–15L', label: 'Capital cost of cold storage per unit', hindi: 'कोल्ड स्टोरेज की लागत', color: '#d97706', bg: '#fef3c7' },
  { icon: AlertTriangle, value: '60%+', label: 'Farmers lack regulated storage access', hindi: 'किसानों को उचित भंडारण नहीं मिलता', color: '#d97706', bg: '#fef3c7' },
  { icon: Clock, value: '2–3 Mo', label: 'Typical shelf life without atmosphere control', hindi: 'बिना नियंत्रण के शेल्फ जीवन', color: '#dc2626', bg: '#fee2e2' },
]

export default function ProblemSection() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" fill="none" className="block w-full">
          <path d="M0 0 L0 30 Q360 60 720 30 Q1080 0 1440 30 L1440 0 Z" fill="#f7f9f4"/>
        </svg>
      </div>

      {/* Leaf decorations */}
      <div className="absolute top-10 right-10 opacity-10 animate-sway pointer-events-none">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path d="M30 75 C10 55, 5 30, 20 5 C45 25, 52 52, 30 75Z" fill="#dc2626"/>
          <line x1="30" y1="75" x2="28" y2="10" stroke="#dc2626" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto">
        <SectionLabel hindi="समस्या">The Problem</SectionLabel>
        <SectionTitle
          sub="Onion farmers across India face systemic post-harvest losses driven by inadequate storage infrastructure and prohibitively expensive cold storage."
          subHindi="भारत में प्याज किसानों को अपर्याप्त भंडारण और महंगे कोल्ड स्टोरेज के कारण भारी नुकसान होता है।"
        >
          Billions Lost Annually to<br />Unregulated Storage
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map(({ icon: Icon, value, label, hindi, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-border shadow-card p-6 border-l-[4px] hover:shadow-card-hover transition-all" style={{ borderLeftColor: color }}>
              <div className="rounded-xl p-3 inline-flex mb-4" style={{ background: bg }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div className="font-serif text-[38px] font-bold text-text-primary leading-none mb-2" style={{ color }}>{value}</div>
              <p className="text-text-secondary text-sm leading-relaxed mb-1">{label}</p>
              <p className="hindi-text text-text-muted text-xs leading-relaxed">{hindi}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-5 flex-wrap">
          <div className="bg-red-100 border border-red-200 rounded-xl p-3 shrink-0">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <p className="text-text-primary font-bold text-base mb-1">Uncontrolled sprouting is the primary cause of value destruction</p>
            <p className="hindi-text text-text-muted text-sm mb-2">अनियंत्रित अंकुरण ही प्याज के नुकसान का मुख्य कारण है।</p>
            <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
              When CO₂ and O₂ ratios are not managed precisely, onions sprout prematurely and decay within weeks. Traditional sacks and sheds offer zero atmospheric regulation, leaving farmers entirely exposed to preventable losses.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
