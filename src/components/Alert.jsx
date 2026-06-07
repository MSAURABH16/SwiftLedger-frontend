import { useEffect } from 'react'

function Alert({ type = 'info', message, onClose, autoDismiss = true, timeout = 5000 }) {
  useEffect(() => {
    if (!autoDismiss) return
    const t = setTimeout(() => {
      onClose && onClose()
    }, timeout)
    return () => clearTimeout(t)
  }, [autoDismiss, timeout, onClose])

  const colors = {
    error: 'bg-rose-500/10 text-rose-200 border-rose-600',
    success: 'bg-emerald-500/10 text-emerald-200 border-emerald-600',
    info: 'bg-sky-500/10 text-sky-200 border-sky-600',
  }

  return (
    <div className={`mb-6 flex items-start justify-between rounded-2xl border px-4 py-3 text-sm ${colors[type]}`} role="alert">
      <div className="max-w-[84%] break-words">{message}</div>
      <button onClick={onClose} className="ml-4 rounded-full p-1 text-sm opacity-80 hover:opacity-100">
        ✕
      </button>
    </div>
  )
}

export default Alert
