import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, labelHi, error, icon: Icon, className='', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-ink text-sm font-bold">
          {label} {labelHi && <span className="font-hindi text-ink-muted font-normal text-xs">— {labelHi}</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"><Icon size={15}/></span>}
        <input
          ref={ref}
          className={['field-input', Icon ? 'pl-10' : '', error ? '!border-danger' : '', className].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-danger text-xs font-semibold">{error}</p>}
    </div>
  )
})
export default Input
