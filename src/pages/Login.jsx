import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Alert from '../components/Alert.jsx'

function Login() {
  const { login, error, message, clearMessages, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    clearMessages()
  }, [clearMessages])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(form)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-slate-700 bg-banking-slate/95 px-8 py-10 shadow-xl shadow-slate-900/20 sm:px-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Login to access your SwiftLedger account dashboard.</p>
        </div>
        {error && <Alert type="error" message={error} onClose={clearMessages} />}
        {message && <Alert type="success" message={message} onClose={clearMessages} />}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New to SwiftLedger?{' '}
          <Link to="/register" className="font-semibold text-white hover:text-accent">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
