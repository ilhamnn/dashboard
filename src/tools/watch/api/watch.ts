// types/market.ts
export interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  marketCap: string
  volume: string
  chart: Array<{ time: string; price: number }>
}

export interface CoinListItem {
  id: string
  symbol: string
  name: string
}

export interface MarketData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  market_cap: number
  total_volume: number
  sparkline_in_7d?: {
    price: number[]
  }
}

export type TimeRange = "24h" | "7d"