import { useAuth } from '../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-700 bg-banking-slate/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/" className="text-xl font-semibold text-white">
            SwiftLedger
          </Link>
          <p className="text-sm text-slate-400">Modern banking dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm text-slate-300">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
