import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login', { replace: true })
  }

  return (
    <section className="page admin-layout">
      <aside className="admin-sidebar card">
        <h2>Admin</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/quotes" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
            Quotes
          </NavLink>
          <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
            Messages
          </NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
            Blog
          </NavLink>
        </nav>
        <button type="button" className="btn btn-muted" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </section>
  )
}

export default AdminLayout
