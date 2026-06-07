import { useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'
import { formatCurrency } from '../utils/format.js'

function Transactions() {
  const [txs, setTxs] = useState(null)

  useEffect(() => {
    const key = 'swiftledger_transactions'
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      setTxs(existing)
    } catch (e) {
      setTxs([])
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-700 bg-banking-slate p-6 shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Transaction history</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Recent activity</h1>
            <p className="mt-2 text-sm text-slate-400">Your recent transfers are stored locally for quick reference.</p>
          </div>
        </div>
      </div>

      {txs === null ? (
        <Loader message="Loading transactions..." />
      ) : txs.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-banking-dark p-6 text-slate-400">No transactions yet.</div>
      ) : (
        <div className="space-y-4">
          {txs.map((t) => (
            <div key={t.id} className="rounded-3xl border border-slate-700 bg-banking-dark p-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-slate-300">{t.fromAccount} → {t.toAccount}</div>
                <div className="mt-1 text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">{formatCurrency(Number(t.amount))}</div>
                <div className="mt-1 text-xs text-slate-500">{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Transactions
