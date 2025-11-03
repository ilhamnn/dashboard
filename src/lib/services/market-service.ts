import { MarketData, CryptoMarketData } from "@/tools/market/api/market"

export async function getMarketData(): Promise<MarketData> {
  try {
    const [globalRes, ratesRes] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/global", {
        next: { revalidate: 60 } // Cache for 60 seconds
      }),
      fetch("https://api.coingecko.com/api/v3/exchange_rates", {
        next: { revalidate: 300 } // Cache for 5 minutes
      })
    ])

    if (!globalRes.ok || !ratesRes.ok) {
      throw new Error("Failed to fetch market data")
    }

    const [globalData, ratesData] = await Promise.all([
      globalRes.json(),
      ratesRes.json()
    ])

    return {
      totalMarketCapUsd: globalData.data.total_market_cap.usd,
      marketCapChange24h: globalData.data.market_cap_change_percentage_24h_usd,
      totalVolumeUsd: globalData.data.total_volume.usd,
      btcDominance: globalData.data.market_cap_percentage.btc,
      usdToIdr: ratesData.rates.idr.value
    }
  } catch (error: unknown) {
  console.error("Error fetching market data from CoinGecko:", error)
  const message =
    error instanceof Error ? error.message : String(error)
  throw new Error(`Failed to fetch market data from CoinGecko: ${message}`)
  }
}

//heatmap ini
export async function getCryptoHeatmapData(limit: number = 8): Promise<{
  coins: CryptoMarketData[]
  usdToIdr: number
}> {
  try {
    const [coinsRes, ratesRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&price_change_percentage=24h`,
        {
          next: { revalidate: 60 }
        }
      ),
      fetch("https://api.coingecko.com/api/v3/exchange_rates", {
        next: { revalidate: 300 }
      })
    ])

    if (!coinsRes.ok || !ratesRes.ok) {
      throw new Error("Failed to fetch crypto heatmap data")
    }

    const [coinsData, ratesData] = await Promise.all([
      coinsRes.json(),
      ratesRes.json()
    ])

    return {
      coins: coinsData,
      usdToIdr: ratesData.rates.idr.value
    }
  } catch (error) {
    console.error("Error fetching crypto heatmap data:", error)
    throw error
  }
}