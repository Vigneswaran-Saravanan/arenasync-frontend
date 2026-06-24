import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, role, allowedRoles }) {
  const token = localStorage.getItem('token')

  // If no token, send them to login
  if (!token) {
    return <Navigate to="/" replace />
  }

  // If this route has role restrictions, check the user's role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute