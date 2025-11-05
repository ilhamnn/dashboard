'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { fetchMarketData } from "@/lib/api/market-api"
import { MarketStat } from "@/tools/market/api/market"

export function MarketOverview() {
  const [marketStats, setMarketStats] = useState<MarketStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMarketData() {
      try {
        const data = await fetchMarketData()

        const stats: MarketStat[] = [
          {
            label: "Market Cap",
            value: data.totalMarketCapUsd.toLocaleString(),
            change: `${data.marketCapChange24h.toFixed(2)}%`,
            positive: data.marketCapChange24h >= 0,
          },
          {
            label: "24h Volume",
            value: data.totalVolumeUsd.toLocaleString(),
            change: `${((data.totalVolumeUsd / data.totalMarketCapUsd) * 100).toFixed(2)}%`,
            positive: true,
          },
          {
            label: "BTC Dominance",
            value: `${data.btcDominance.toFixed(2)}%`,
            change: `${(data.btcDominance - 50).toFixed(2)}%`,
            positive: data.btcDominance >= 50,
          },
        ]

        setMarketStats(stats)
      } catch (err) {
        setError("Failed to load market data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadMarketData()
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
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Market Overview</CardTitle>
          <CardDescription>Global crypto metrics (USD)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketStats.map((stat, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 bg-secondary rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">$ {stat.value}</p>
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
    </div>
  )
}
