import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { API_BASE_URL } from '../api/http'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const hasLoggedUrl = useRef(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setToast(null)
    setErrorMessage('')

    if (!hasLoggedUrl.current) {
      console.log(`Admin login URL: ${API_BASE_URL}/api/auth/login`)
      hasLoggedUrl.current = true
    }

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
    <section className="page">
      <h1>Admin Login</h1>
      <section className="quote-form-wrapper card">
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
  )
}

export default Login
