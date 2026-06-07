import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../hooks/useAuth.jsx'
import Loader from '../components/Loader.jsx'

function Transfer() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ fromAccount: '', toAccount: '', amount: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get('/accounts')
        setAccounts(response.data.accounts || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load accounts.')
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    if (!form.fromAccount || !form.toAccount || !form.amount) {
      setError('Fill all transfer fields before submitting.')
      return
    }
    if (form.fromAccount === form.toAccount) {
      setError('Source and destination accounts must be different.')
      return
    }

    setSubmitting(true)
    const idempotencyKey = crypto.randomUUID()
    try {
      const res = await api.post('/transactions', {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
        idempotencyKey,
      })

      // persist a lightweight transaction record in localStorage for history
      try {
        const key = 'swiftledger_transactions'
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        const tx = {
          id: res.data?.transaction?._id || idempotencyKey,
          fromAccount: form.fromAccount,
          toAccount: form.toAccount,
          amount: Number(form.amount),
          createdAt: new Date().toISOString(),
          user: user?.email || user?.name || null,
          status: res.data?.transaction?.status || 'completed',
        }
        existing.unshift(tx)
        // keep recent 200 transactions at most
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 200)))
      } catch (e) {
        // ignore localStorage failures
        // console.warn('Failed to save transaction locally', e)
      }

      setSuccess('Transfer completed successfully.')
      setForm((prev) => ({ ...prev, toAccount: '', amount: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Funds transfer</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Move money safely</h1>
            <p className="mt-2 text-sm text-slate-400">Choose a source account and send funds instantly with idempotent transactions.</p>
          </div>
          <span className="rounded-full bg-slate-700/60 px-4 py-2 text-sm text-slate-300">{user?.name}</span>
        </div>
      </div>
      {loading ? (
        <Loader message="Loading available accounts..." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10"
          >
            <div className="space-y-5">
              {error && <div className="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
              {success && <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

              <label className="block">
                <span className="text-sm font-medium text-slate-200">From Account</span>
                <select
                  name="fromAccount"
                  value={form.fromAccount}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="" disabled>
                    Select source account
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account._id} ({account.status})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-200">To Account</span>
                <input
                  type="text"
                  name="toAccount"
                  value={form.toAccount}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Enter destination account ID"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Amount</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-slate-100 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="1000"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending funds...' : 'Transfer Funds'}
              </button>
            </div>
          </form>
          <div className="rounded-3xl border border-slate-700 bg-banking-dark p-6 shadow-sm shadow-slate-900/10">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Transfer details</p>
                <p className="mt-3 text-sm text-slate-400">
                  Use a valid source account and enter the recipient account ID. Every transfer uses a unique idempotency key to prevent duplicate transactions.
                </p>
              </div>
              <div className="rounded-3xl bg-banking-slate p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Accounts available</p>
                <p className="mt-3 text-2xl font-semibold text-white">{accounts.length}</p>
              </div>
              <div className="rounded-3xl bg-banking-slate p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Logged in as</p>
                <p className="mt-3 text-base font-medium text-white">{user?.email}</p>
              </div>
              <div className="rounded-3xl bg-banking-slate p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Best practice</p>
                <p className="mt-3 text-sm text-slate-400">Validate account IDs before sending and review your transfer amount carefully.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transfer
