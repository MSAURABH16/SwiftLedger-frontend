import { useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../hooks/useAuth.jsx'
import AccountCard from '../components/AccountCard.jsx'
import Loader from '../components/Loader.jsx'
import { formatCurrency } from '../utils/format.js'

function Dashboard() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [accountLoading, setAccountLoading] = useState(false)

  const totalBalance = useMemo(() => {
    return Object.values(balances).reduce((sum, value) => sum + (Number(value) || 0), 0)
  }, [balances])

  const fetchAccounts = async () => {
    setLoading(true)
    setError(null)
    setActionMessage(null)
    try {
      const response = await api.get('/accounts')
      const accountsData = response.data.accounts || []
      setAccounts(accountsData)
      const balanceResults = await Promise.all(
        accountsData.map(async (account) => {
          try {
            const balanceResponse = await api.get(`/accounts/balance/${account._id}`)
            return [account._id, balanceResponse.data.balance]
          } catch {
            return [account._id, 0]
          }
        })
      )
      setBalances(Object.fromEntries(balanceResults))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load accounts. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async () => {
    setAccountLoading(true)
    setError(null)
    setActionMessage(null)
    try {
      await api.post('/accounts')
      setActionMessage('Account created successfully.')
      await fetchAccounts()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.')
    } finally {
      setAccountLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{user?.name}</h1>
              <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
            </div>
            <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
              <button
                type="button"
                onClick={fetchAccounts}
                className="rounded-3xl border border-slate-700 bg-banking-dark px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-accent hover:text-accent"
              >
                Refresh Accounts
              </button>
              <button
                type="button"
                onClick={createAccount}
                disabled={accountLoading}
                className="rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accountLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-banking-dark p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Accounts</p>
              <p className="mt-3 text-3xl font-semibold text-white">{accounts.length}</p>
            </div>
            <div className="rounded-3xl bg-banking-dark p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Balance</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Overview</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-3xl bg-banking-dark p-5">
              <div>
                <p className="text-sm text-slate-400">Next release</p>
                <p className="mt-2 text-lg font-semibold text-white">Faster transfers</p>
              </div>
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">Live</span>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-banking-dark p-5">
              <div>
                <p className="text-sm text-slate-400">Protected routing</p>
                <p className="mt-2 text-lg font-semibold text-white">Secure session state</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">Stable</span>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your accounts</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Account details</h2>
          </div>
        </div>
        {loading ? (
          <Loader message="Fetching your accounts..." />
        ) : error ? (
          <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-rose-100">{error}</div>
        ) : accounts.length === 0 ? (
          <div className="rounded-3xl border border-slate-700 bg-banking-dark p-8 text-slate-300">
            You do not have any accounts yet. Use the create account button to start managing your funds.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard key={account._id} account={account} />
            ))}
          </div>
        )}
      </section>
      {actionMessage && (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">{actionMessage}</div>
      )}
    </div>
  )
}

export default Dashboard
