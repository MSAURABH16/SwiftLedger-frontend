import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Alert from '../components/Alert.jsx'

function Register() {
  const { register, error, message, clearMessages, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    clearMessages()
  }, [clearMessages])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await register(form)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-slate-700 bg-banking-slate/95 px-8 py-10 shadow-xl shadow-slate-900/20 sm:px-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Start managing accounts and transferring funds securely.</p>
        </div>
        {error && <Alert type="error" message={error} onClose={clearMessages} />}
        {message && <Alert type="success" message={message} onClose={clearMessages} />}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Saurabh Kashyap"
            />
          </label>
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
              minLength={8}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="Create a secure password"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white hover:text-accent">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
