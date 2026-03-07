import { NavLink } from 'react-router-dom'
import Container from './Container'
import Button from './ui/Button'

function Navbar() {
  const linkClass = ({ isActive }) =>
    `rounded-md px-2 py-2 text-sm font-medium transition ${
      isActive
        ? 'text-blue-700 underline decoration-blue-400 decoration-2 underline-offset-8'
        : 'text-slate-700 hover:text-slate-900 hover:underline hover:decoration-slate-300 hover:underline-offset-8'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/70 backdrop-blur-lg">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <NavLink to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">⚡</span>
          <span>LogiDispatch</span>
        </NavLink>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-0.5">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
          <NavLink to="/blog" className={linkClass}>Blog</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <Button to="/quote" className="ml-2">Request Quote</Button>
        </nav>
      </Container>
    </header>
  )
}

export default Navbar
