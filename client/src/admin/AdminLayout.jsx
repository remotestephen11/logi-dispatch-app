import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

const navigationItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/quotes', label: 'Quotes' },
]

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-app-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-card">
          <p className="admin-sidebar-eyebrow">Admin Panel</p>
          <h1 className="admin-sidebar-title">Logi Dispatch</h1>
          <p className="admin-sidebar-copy">Manage content, quotes, and daily admin activity from one place.</p>
        </div>

        <nav className="admin-nav card" aria-label="Admin navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="btn btn-muted admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
