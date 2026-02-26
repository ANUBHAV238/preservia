export default function Card({ children, className = '', accent = false, hover = false, style = {}, ...props }) {
  return (
    <div
      className={['field-card p-5', hover ? 'field-card-hover cursor-pointer' : '', accent ? 'vine-top' : '', className].join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
