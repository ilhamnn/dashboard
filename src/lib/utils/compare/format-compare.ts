export const formatCurrency = (val: number) =>
  `$${val.toLocaleString()}`

export const formatPercent = (val: number) =>
  `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`
