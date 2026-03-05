import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <section className="page">
      <h1>Admin Dashboard</h1>
      <p>You are authenticated. Admin-protected routes are active.</p>
      <button type="button" className="btn btn-muted" onClick={handleLogout}>
        Logout
      </button>
    </section>
  )
}

export default AdminDashboard
