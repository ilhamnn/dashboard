"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Trash2, Plus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { WatchlistItem, CoinListItem, TimeRange } from "@/tools/watch/api/watch"
import { MarketAPI } from "@/lib/api/watch"
import { MarketService } from "@/lib/services/watch-service"
import { formatPrice, formatPercentage } from "@/lib/utils/watch/watch"

export function Watch() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [coins, setCoins] = useState<CoinListItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const [isLoading, setIsLoading] = useState(false)
  const [emptyCardVisible, setEmptyCardVisible] = useState(true)
  
  useEffect(() => {
    const fetchCoins = async () => {
      const data = await MarketAPI.getCoinsList()
      setCoins(data)
    }
    fetchCoins()
  }, [])

  useEffect(() => {
    const fetchMarketData = async () => {
      if (watchlist.length === 0) return

      setIsLoading(true)
      try {
        const coinIds = watchlist.map((c) => c.id)
        const marketData = await MarketAPI.getMarketData(coinIds)
        const updated = MarketService.transformMarketData(watchlist, marketData, timeRange)
        setWatchlist(updated)
      } catch (error) {
        console.error("Error updating watchlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(interval)
  }, [watchlist.length, timeRange])

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter((w) => w.id !== id))
  }

  const addToWatchlist = (coin: CoinListItem) => {
    if (!watchlist.find((w) => w.id === coin.id)) {
      setWatchlist([
        ...watchlist,
        {
          ...coin,
          price: 0,
          change: 0,
          marketCap: "$0",
          volume: "$0",
          chart: [],
        },
      ])
      setShowAddModal(false)
    }
  }

  const availableToAdd = coins
    .filter((c) => !watchlist.find((w) => w.id === c.id))
    .slice(0, 50)

  return (
    <div className="w-full space-y-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Watchlist</h2>
          <p className="text-sm text-muted-foreground">
            {watchlist.length} cryptocurrency tracked
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-2">
          <Button
            variant={timeRange === "24h" ? "default" : "ghost"}
            onClick={() => setTimeRange("24h")}
            className="text-sm"
          >
            24h
          </Button>
          <Button
            variant={timeRange === "7d" ? "default" : "ghost"}
            onClick={() => setTimeRange("7d")}
            className="text-sm"
          >
            7d
          </Button>
          {availableToAdd.length > 0 && (
            <Button onClick={() => setShowAddModal(!showAddModal)} className="gap-2">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showAddModal && availableToAdd.length > 0 && (
        <Card className="bg-card border-border max-h-[400px]">
          <CardHeader>
            <CardTitle className="text-sm">Add to Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                {availableToAdd.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => addToWatchlist(coin)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-all text-left"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {coin.symbol.toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">{coin.name}</p>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="vertical" className="bg-black rounded-full w-1" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {watchlist.map((item) => (
            <Card
              key={item.id}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">
                      {item.symbol.toUpperCase()}
                    </CardTitle>
                    <CardDescription>{item.name}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWatchlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatPrice(item.price)}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        item.change >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {item.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {formatPercentage(item.change)} ({timeRange})
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={item.chart}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="var(--color-muted-foreground)"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      style={{ fontSize: "10px" }}
                      hide
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "var(--color-foreground)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={
                        item.change >= 0
                          ? "var(--color-success)"
                          : "var(--color-destructive)"
                      }
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.marketCap}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.volume}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) :   (
  emptyCardVisible && (
    <Card className="bg-card border-border">
      <CardContent className="pt-12 pb-12">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">
            No cryptocurrencies in your watchlist yet
          </p>
          <Button
            onClick={() => {
              setShowAddModal(true)
              setEmptyCardVisible(false)
            }}
            variant="default"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add your first crypto
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
    </div>
  )
}