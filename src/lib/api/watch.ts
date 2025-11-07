// lib/api/market-api.ts
import type { CoinListItem, MarketData } from "@/tools/watch/interface/watch"

export class MarketAPI {
  static async getCoinsList(): Promise<CoinListItem[]> {
    try {
      const res = await fetch("/api/watch/coins")
      if (!res.ok) throw new Error("Failed to fetch coins")
      return await res.json()
    } catch (error) {
      console.error("Error fetching coins:", error)
      return []
    }
  }

  static async getMarketData(coinIds: string[]): Promise<MarketData[]> {
    if (coinIds.length === 0) return []

    try {
      const ids = coinIds.join(",")
      const res = await fetch(`/api/watch?ids=${ids}`)
      if (!res.ok) throw new Error("Failed to fetch market data")
      return await res.json()
    } catch (error) {
      console.error("Error fetching market data:", error)
      return []
    }
  }
}