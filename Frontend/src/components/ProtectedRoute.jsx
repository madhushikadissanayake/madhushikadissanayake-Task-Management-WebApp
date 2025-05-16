import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
  }, [])

  if (isAuthenticated === null) return <div className="p-4">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
