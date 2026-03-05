import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          Naija Dispatch Co.
        </NavLink>
        <nav aria-label="Primary" className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>About</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Services</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Pricing</NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Contact</NavLink>
          <NavLink to="/quote" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Quote</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
