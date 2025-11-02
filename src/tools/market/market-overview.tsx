'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { MarketHeatmap } from "@/tools/market/market-heatmap"

interface MarketStat {
  label: string
  value: string
  change: string
  positive: boolean
}

export function MarketOverview() {
  const [marketStats, setMarketStats] = useState<MarketStat[]>([])
  const [loading, setLoading] = useState(true)

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const resGlobal = await fetch("https://api.coingecko.com/api/v3/global")
        const globalData = await resGlobal.json()

        const resRates = await fetch("https://api.coingecko.com/api/v3/exchange_rates")
        const ratesData = await resRates.json()
        const usdToIdr = ratesData.rates.idr.value

        const stats: MarketStat[] = [
          {
            label: "Market Cap",
            value: formatIDR(globalData.data.total_market_cap.usd * usdToIdr),
            change: `${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%`,
            positive: globalData.data.market_cap_change_percentage_24h_usd >= 0,
          },
          {
            label: "24h Volume",
            value: formatIDR(globalData.data.total_volume.usd * usdToIdr),
            change: `${((globalData.data.total_volume.usd / globalData.data.total_market_cap.usd) * 100).toFixed(2)}%`,
            positive: true,
          },
          {
            label: "BTC Dominance",
            value: `${globalData.data.market_cap_percentage.btc.toFixed(2)}%`,
            change: `${(globalData.data.market_cap_percentage.btc - 50).toFixed(2)}%`,
            positive: globalData.data.market_cap_percentage.btc >= 50,
          },
        ]

        setMarketStats(stats)
      } catch (err) {
        console.error("Failed to fetch market data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Market Overview</CardTitle>
          <CardDescription>Global crypto metrics (IDR)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketStats.map((stat, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-secondary rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 ${stat.positive ? "text-success" : "text-destructive"}`}>
                  {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-xs font-medium">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <MarketHeatmap />
    </div>
  )
}
