function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-700 bg-banking-slate p-8 text-slate-300 shadow-sm shadow-slate-900/10">
      <div className="space-y-2 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-accent" />
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Loader
