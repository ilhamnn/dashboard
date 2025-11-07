'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { fetchCryptoHeatmap } from "@/lib/api/market-api"
import { CryptoHeatmapItem } from "@/tools/market/interface/market"

// helper functions
function getHeatmapColor(change: number): string {
  if (change > 5) return "bg-success/20"
  if (change > 0) return "bg-success/10"
  if (change > -2) return "bg-destructive/10"
  return "bg-destructive/20"
}

function getTextColor(change: number): string {
  return change >= 0 ? "text-success" : "text-destructive"
}

export function MarketHeatmap() {
  const [cryptoData, setCryptoData] = useState<CryptoHeatmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCryptoData() {
      try {
        const { coins } = await fetchCryptoHeatmap(8)

        const items: CryptoHeatmapItem[] = coins.map((coin) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
        }))

        setCryptoData(items)
      } catch (err) {
        setError("Failed to load crypto data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCryptoData()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Market Heatmap</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Market Heatmap</CardTitle>
        <CardDescription>Top cryptocurrencies by market cap - 24h performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className={`p-4 rounded-lg border border-border transition-all hover:border-gray-700 cursor-pointer ${getHeatmapColor(
                crypto.change24h,
              )}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground">{crypto.name}</p>
                  </div>
                  <div className={`flex items-center gap-0.5 ${getTextColor(crypto.change24h)}`}>
                    {crypto.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    $ {crypto.price.toLocaleString()}
                  </p>
                  <p className={`text-xs font-medium ${getTextColor(crypto.change24h)}`}>
                    {crypto.change24h >= 0 ? "+" : ""}
                    {crypto.change24h.toFixed(2)}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground pt-1 border-t border-border">
                  Cap: $ {crypto.marketCap.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
