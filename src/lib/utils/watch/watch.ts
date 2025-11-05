// lib/utils/format.ts
export function formatCurrency(value: number): string {
  return `$${(value / 1e9).toFixed(2)}B`
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`
}

export function formatPercentage(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value >= 0 ? "+" : ""
  return `${sign}${value?.toFixed(2)}%`
}