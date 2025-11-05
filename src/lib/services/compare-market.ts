import { CompareMarket } from "@/tools/compare/api/compare"

export async function getTopCoins(limit = 50): Promise<CompareMarket[]> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      { next: { revalidate: 60 } } // optional caching
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch top coins, status: ${res.status}`)
    }

    const data: CompareMarket[] = await res.json()
    return data
  } catch (error: unknown) {
    console.error("Error fetching top coins from CoinGecko:", error)
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch top coins from CoinGecko: ${message}`)
  }
}

