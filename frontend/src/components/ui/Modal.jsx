import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, titleHi, children, maxWidth='480px' }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    if (open) { document.addEventListener('keydown', h); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{background:'rgba(26,46,22,0.45)', backdropFilter:'blur(6px)'}} onClick={onClose}>
      <div className="bg-white rounded-[20px] border border-border shadow-leaf-lg w-full animate-bloom p-6" style={{maxWidth}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-ink font-bold text-lg leading-tight">{title}</h3>
            {titleHi && <p className="font-hindi text-ink-muted text-xs mt-0.5">{titleHi}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-fog transition-colors border-none bg-transparent cursor-pointer text-ink-muted hover:text-ink ml-3 shrink-0">
            <X size={18}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
