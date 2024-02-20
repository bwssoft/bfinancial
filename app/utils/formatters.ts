function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    weekday: "long",
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

type FormatPriceOptions = {
  from: "cents"
}
function formatPrice(price: number, options?: FormatPriceOptions) {
  const divider = options?.from === "cents" ? 100 : 1
  return (price / divider).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export {
  formatDate, formatTime, formatShortDate, formatPrice
}