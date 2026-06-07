import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { formatCurrency } from '../utils/format.js'

function AccountCard({ account }) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let canceled = false

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/accounts/balance/${account._id}`)
        if (!canceled) {
          setBalance(response.data.balance)
        }
      } catch (err) {
        if (!canceled) {
          setError('Unable to load balance')
        }
      } finally {
        if (!canceled) {
          setLoading(false)
        }
      }
    }

    fetchBalance()

    return () => {
      canceled = true
    }
  }, [account._id])

  return (
    <div className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account ID</p>
          <p className="mt-2 break-all text-sm text-slate-100">{account._id}</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {account.status}
        </span>
      </div>
      <div className="mt-6 border-t border-slate-700 pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Balance</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {loading ? 'Loading...' : error ? error : formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}

export default AccountCard
