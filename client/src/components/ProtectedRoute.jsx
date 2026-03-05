import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../api/auth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
