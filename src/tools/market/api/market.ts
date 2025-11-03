//overview
export interface MarketStat {
  label: string
  value: string
  change: string
  positive: boolean
}

export interface MarketData {
  totalMarketCapUsd: number
  marketCapChange24h: number
  totalVolumeUsd: number
  btcDominance: number
  usdToIdr: number
}

//heatmap
export interface CryptoHeatmapItem {
  symbol: string
  name: string
  price: string
  change24h: number
  marketCap: string
}

export interface CryptoMarketData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}