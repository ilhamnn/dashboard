import { MarketData, CryptoMarketData } from "@/tools/market/interface/market"

export async function getMarketData(): Promise<MarketData> {
  try {
    const globalRes = await fetch("https://api.coingecko.com/api/v3/global", {
      next: { revalidate: 60 } 
    })

    if (!globalRes.ok) {
      throw new Error("Failed to fetch market data")
    }

    const globalData = await globalRes.json()

    return {
      totalMarketCapUsd: globalData.data.total_market_cap.usd,
      marketCapChange24h: globalData.data.market_cap_change_percentage_24h_usd,
      totalVolumeUsd: globalData.data.total_volume.usd,
      btcDominance: globalData.data.market_cap_percentage.btc
    }
  } catch (error: unknown) {
    console.error("Error fetching market data from CoinGecko:", error)
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch market data from CoinGecko: ${message}`)
  }
}

// Heatmap tanpa exchange rates
export async function getCryptoHeatmapData(limit: number = 8): Promise<{
  coins: CryptoMarketData[]
}> {
  try {
    const coinsRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&price_change_percentage=24h`,
      {
        next: { revalidate: 60 }
      }
    )

    if (!coinsRes.ok) {
      throw new Error("Failed to fetch crypto heatmap data")
    }

    const coinsData = await coinsRes.json()

    return {
      coins: coinsData
    }
  } catch (error) {
    console.error("Error fetching crypto heatmap data:", error)
    throw error
  }
}
