import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getToken, login } from '../api/auth'

function Login() {
  const navigate = useNavigate()
  const token = getToken()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  if (token) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setToast(null)
    setErrorMessage('')

    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const message = err.message || 'Login failed'
      setErrorMessage(message)
      setToast({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-app-shell">
      <section className="card" style={{ maxWidth: '520px', width: '100%', margin: '0 auto', alignSelf: 'center' }}>
        <p className="admin-kicker">Secure Access</p>
        <h1>Admin Login</h1>
        <p className="admin-page-copy">Sign in to manage the dashboard, blog, and quotes.</p>

        <section className="quote-form-wrapper">
          {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field form-field-full">
                <label htmlFor="admin-email">Email</label>
                <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="quote-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}
          </form>
        </section>
      </section>
    </main>
  )
}

export default Login
