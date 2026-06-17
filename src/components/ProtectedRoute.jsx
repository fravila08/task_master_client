import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, sessionLoading } = useApp()
  if (sessionLoading) return null
  if (!currentUser) return <Navigate to="/" replace />
  return children
}
