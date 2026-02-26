import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const V = {
  primary:   'text-white font-bold shadow-leaf hover:shadow-leaf-lg active:scale-[0.97]',
  secondary: 'bg-white border-2 border-soil text-soil font-bold hover:bg-mist active:scale-[0.97]',
  ghost:     'bg-transparent border border-border text-ink-soft font-semibold hover:bg-fog active:scale-[0.97]',
  danger:    'bg-danger-light border border-red-300 text-danger font-semibold hover:bg-red-100 active:scale-[0.97]',
  wheat:     'bg-wheat border border-grain text-bark font-semibold hover:bg-grain active:scale-[0.97]',
  leaf:      'border border-border-strong text-soil font-bold active:scale-[0.97]',
}

const VSTYLE = {
  primary:   { background: 'linear-gradient(135deg, #236320 0%, #3d7a35 100%)' },
  leaf:      { background: 'linear-gradient(135deg, #d4f0ca, #c0e8b4)' },
}

const S = {
  xs: 'text-xs px-3 py-1.5 gap-1.5 rounded-xl',
  sm: 'text-sm px-4 py-2 gap-2 rounded-xl',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-[14px]',
  lg: 'text-base px-7 py-3.5 gap-2.5 rounded-[16px]',
}

const Button = forwardRef(function Button({ children, variant = 'primary', size = 'md', icon, iconRight, loading = false, disabled = false, className = '', style = {}, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      style={{ ...VSTYLE[variant], ...style }}
      className={[
        'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
        V[variant] ?? V.primary, S[size] ?? S.md,
        (disabled || loading) ? 'opacity-50 pointer-events-none' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin shrink-0"/> : icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
})
export default Button
