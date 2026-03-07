import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

const baseClasses =
  'inline-flex items-center justify-center text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-white text-blue-700 shadow-lg hover:bg-slate-50 focus-visible:ring-white/70',
  secondary: 'border border-white/70 bg-transparent text-white hover:bg-white hover:text-blue-700 focus-visible:ring-white/70',
  solid: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500/60',
  muted: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400/60',
}

const sizes = {
  md: 'rounded-lg px-4 py-2',
  hero: 'rounded-xl px-6 py-3',
}

function Button({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  to,
  type = 'button',
  ...props
}) {
  const classes = cn(baseClasses, variants[variant] || variants.solid, sizes[size] || sizes.md, className)

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
