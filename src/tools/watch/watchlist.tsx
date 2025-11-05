"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Trash2, Plus, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: string
  volume: string
  chart: Array<{ time: string; price: number }>
}

interface CoinListItem {
  id: string
  symbol: string
  name: string
}

export function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [coins, setCoins] = useState<CoinListItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list")
        const data: CoinListItem[] = await res.json()
        setCoins(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCoins()
  }, [])

  const fetchMarketData = async (items: WatchlistItem[]) => {
    if (items.length === 0) return
    const ids = items.map((c) => c.id).join(",")
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h`
      )
      const data = await res.json()
      const updated = items.map((item) => {
        const coin = data.find((d: any) => d.id === item.id)
        if (!coin) return item
        const chart = coin.sparkline_in_7d?.price.map((p: number, i: number) => ({ time: `${i}`, price: p })) || item.chart
        return {
          ...item,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: `$${(coin.market_cap / 1e9).toFixed(2)}B`,
          volume: `$${(coin.total_volume / 1e9).toFixed(2)}B`,
          chart,
        }
      })
      setWatchlist(updated)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMarketData(watchlist)
  }, [watchlist.length])

  const removeFromWatchlist = (id: string) => setWatchlist(watchlist.filter((w) => w.id !== id))
  const addToWatchlist = (coin: CoinListItem) => {
    if (!watchlist.find((w) => w.id === coin.id)) {
      setWatchlist([...watchlist, { ...coin, price: 0, change24h: 0, marketCap: "$0", volume: "$0", chart: [] }])
      setShowAddModal(false)
    }
  }

  const availableToAdd = coins.filter((c) => !watchlist.find((w) => w.id === c.id)).slice(0, 50)

  return (
    <div className="w-full space-y-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Watchlist</h2>
          <p className="text-sm text-muted-foreground">{watchlist.length} cryptocurrency tracked</p>
        </div>
        {availableToAdd.length > 0 && (
          <Button onClick={() => setShowAddModal(!showAddModal)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Crypto
          </Button>
        )}
      </div>

      {/* Modal / List of coins */}
      {showAddModal && availableToAdd.length > 0 && (
        <Card className="bg-card border-border max-h-[400px] relative">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Add to Watchlist</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
              <X className="w-4 h-4" />
            </Button>
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
                      <p className="font-semibold text-foreground">{coin.symbol.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{coin.name}</p>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Empty watchlist card */}
      {watchlist.length === 0 && !showAddModal && (
        <Card className="bg-card border-border">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">No cryptocurrencies in your watchlist yet</p>
              <Button onClick={() => setShowAddModal(true)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Add your first crypto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Watchlist items */}
      {watchlist.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {watchlist.map((item) => (
            <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">{item.symbol.toUpperCase()}</CardTitle>
                    <CardDescription>{item.name}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromWatchlist(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">${item.price.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${item.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                      {item.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.change24h >= 0 ? "+" : ""}{item.change24h?.toFixed(2)}% (24h)
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={item.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: "10px" }} />
                    <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "10px" }} hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }}
                      labelStyle={{ color: "var(--color-foreground)" }}
                    />
                    <Line type="monotone" dataKey="price" stroke={item.change24h >= 0 ? "var(--color-success)" : "var(--color-destructive)"} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="text-sm font-semibold text-foreground">{item.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">24h Volume</p>
                    <p className="text-sm font-semibold text-foreground">{item.volume}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
