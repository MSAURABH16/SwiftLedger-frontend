import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', path: '/' },
  { label: 'Transfer Funds', path: '/transfer' },
  { label: 'Transactions', path: '/transactions' },
]

function Sidebar() {
  return (
    <aside className="hidden w-72 flex-shrink-0 border-r border-slate-700 bg-banking-slate px-4 py-6 lg:block">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Navigation</p>
          <div className="mt-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-accent text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-700 bg-banking-dark p-4">
          <h3 className="text-sm font-semibold text-slate-200">SwiftLedger</h3>
          <p className="mt-2 text-sm text-slate-400">Secure transfers, account health, and fast balance checks from one dashboard.</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
