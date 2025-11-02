'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoHeatmapItem {
  symbol: string
  name: string
  price: string
  change24h: number
  marketCap: string
}

const formatIDR = (value: number) => {
  return `IDR ${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(value)}`
}

function getHeatmapColor(change: number) {
  if (change > 5) return "bg-success/20"
  if (change > 0) return "bg-success/10"
  if (change > -2) return "bg-destructive/10"
  return "bg-destructive/20"
}

function getTextColor(change: number) {
  return change >= 0 ? "text-success" : "text-destructive"
}

export function MarketHeatmap() {
  const [cryptoData, setCryptoData] = useState<CryptoHeatmapItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCryptoData() {
      try {
        // Ambil 8 top coin sebagai contoh
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&price_change_percentage=24h"
        )
        const data = await res.json()

        // Ambil kurs USD → IDR
        const ratesRes = await fetch("https://api.coingecko.com/api/v3/exchange_rates")
        const ratesData = await ratesRes.json()
        const usdToIdr = ratesData.rates.idr.value

        const items: CryptoHeatmapItem[] = data.map((coin: any) => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: formatIDR(coin.current_price * usdToIdr),
          change24h: coin.price_change_percentage_24h,
          marketCap: formatIDR(coin.market_cap * usdToIdr),
        }))

        setCryptoData(items)
      } catch (err) {
        console.error("Failed to fetch crypto data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Market Heatmap</CardTitle>
        <CardDescription>Top cryptocurrencies by market cap - 24h performance (IDR)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className={`p-4 rounded-lg border border-border transition-all hover:border-primary cursor-pointer ${getHeatmapColor(
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
                  <p className="text-sm font-semibold text-foreground">{crypto.price}</p>
                  <p className={`text-xs font-medium ${getTextColor(crypto.change24h)}`}>
                    {crypto.change24h >= 0 ? "+" : ""}
                    {crypto.change24h.toFixed(2)}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground pt-1 border-t border-border">Cap: {crypto.marketCap}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
