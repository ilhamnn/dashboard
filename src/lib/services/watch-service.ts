// lib/services/market-service.ts
import type { CoinListItem, MarketData, WatchlistItem, TimeRange } from "@/tools/watch/interface/watch"
import { formatCurrency } from "@/lib/utils/watch/watch"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

export class MarketService {
  static async fetchCoinsList(): Promise<CoinListItem[]> {
    try {
      const res = await fetch(`${COINGECKO_BASE_URL}/coins/list`, {
        next: { revalidate: 3600 } 
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch coins list')
      }
      
      return await res.json()
    } catch (error) {
      console.error("Error fetching coins list:", error)
      return []
    }
  }

  static async fetchMarketData(coinIds: string[]): Promise<MarketData[]> {
    if (coinIds.length === 0) return []

    try {
      const ids = coinIds.join(",")
      const res = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h,7d`,
        {
          next: { revalidate: 60 } 
        }
      )
      if (!res.ok) {
        throw new Error('Failed to fetch market data')
      }
      return await res.json()
    } catch (error) {
      console.error("Error fetching market data:", error)
      return []
    }
  }

  static transformMarketData(
    items: WatchlistItem[],
    marketData: MarketData[],
    timeRange: TimeRange
  ): WatchlistItem[] {
    return items.map((item) => {
      const coin = marketData.find((d) => d.id === item.id)
      if (!coin) return item

      const change = timeRange === "24h" 
        ? coin.price_change_percentage_24h 
        : coin.price_change_percentage_7d_in_currency

      const chart = [
        { time: "0", price: coin.current_price * (1 - change / 200) },
        { time: timeRange, price: coin.current_price },
      ]

      return {
        ...item,
        price: coin.current_price,
        change,
        marketCap: formatCurrency(coin.market_cap),
        volume: formatCurrency(coin.total_volume),
        chart,
      }
    })
  }
}