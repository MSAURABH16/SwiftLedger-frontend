import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-3xl border border-slate-700 bg-banking-slate p-8 text-slate-300 shadow-sm shadow-slate-900/10">
          Loading secure session...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
