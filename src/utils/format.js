export function formatCurrency(amount) {
  if (typeof amount !== 'number') return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
  }).format(amount)
}
