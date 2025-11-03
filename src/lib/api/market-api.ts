import { MarketData, CryptoMarketData } from "@/tools/market/api/market"

export async function fetchMarketData(): Promise<MarketData> {
  const res = await fetch("/api/market/overview", {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed to fetch market data")
  }

  return res.json()
}

// Tambahan untuk heatmap
export async function fetchCryptoHeatmap(limit: number = 8): Promise<{
  coins: CryptoMarketData[]
  usdToIdr: number
}> {
  const res = await fetch(`/api/market/heatmap?limit=${limit}`, {
    cache: "no-store"
  })

  if (!res.ok) {
    throw new Error("Failed to fetch crypto heatmap data")
  }

  return res.json()
}