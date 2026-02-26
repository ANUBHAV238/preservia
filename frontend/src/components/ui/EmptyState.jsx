import { Sprout } from 'lucide-react'
export default function EmptyState({ icon: Icon=Sprout, title='No data yet', titleHi, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="bg-mint border border-border-strong rounded-2xl p-5">
        <Icon size={30} className="text-soil opacity-70"/>
      </div>
      <div>
        <p className="text-ink font-bold text-base">{title}</p>
        {titleHi && <p className="font-hindi text-ink-muted text-sm mt-0.5">{titleHi}</p>}
        {description && <p className="text-ink-soft text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
