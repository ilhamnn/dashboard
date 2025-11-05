"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, X, Plus } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { fetchCoins } from "@/lib/api/compare"
import { CompareMarket } from "@/tools/compare/api/compare"
import { formatCurrency, formatPercent } from "@/lib/utils/compare/format-compare"

export function Compare() {
  const [coins, setCoins] = useState<CompareMarket[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [metric, setMetric] = useState<"price" | "marketCap" | "volume24h">("price")
  const [showAddModal, setShowAddModal] = useState(false)

 useEffect(() => {
  async function loadCoins() {
    try {
      const coinsData = await fetchCoins()
      setCoins(coinsData)
    } catch (err) {
      console.error("Failed to fetch coins:", err)
    }
  }

  loadCoins()
}, [])


  const selectedCoins = coins.filter(c => selected.includes(c.id))
  const availableCoins = coins.filter(c => !selected.includes(c.id))

  const removeSelection = (id: string) => setSelected(selected.filter(s => s !== id))
  const addSelection = (id: string) => {
    if (!selected.includes(id) && selected.length < 4) {
      setSelected([...selected, id])
      setShowAddModal(false)
    }
  }

  const getMetricValue = (c: CompareMarket) =>
    metric === "price" ? c.current_price : metric === "marketCap" ? c.market_cap : c.total_volume

  const chartData = selectedCoins.map(c => ({
    symbol: c.symbol.toUpperCase(),
    value: getMetricValue(c),
    name: c.name
  }))

  return (
    <div className="w-full space-y-4 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Compare Cryptocurrencies</h2>
        <p className="text-sm text-muted-foreground">Compare up to 4 cryptocurrencies side by side</p>
      </div>

      <div className="flex gap-2">
        {(["price", "marketCap", "volume24h"] as const).map(m => (
          <Button
            key={m}
            onClick={() => setMetric(m)}
            variant={metric === m ? "default" : "ghost"}
            size="sm"
          >
            {m === "price" ? "Price" : m === "marketCap" ? "Market Cap" : "24h Volume"}
          </Button>
        ))}
        {selected.length < 4 && availableCoins.length > 0 && (
          <Button variant="ghost" size="sm" className="ml-auto flex gap-2" onClick={() => setShowAddModal(!showAddModal)}>
            <Plus className="w-4 h-4" /> Add Crypto
          </Button>
        )}
      </div>

      {showAddModal && (
        <div className="relative max-h-96 overflow-y-auto border border-border rounded-md p-2 mt-2">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {availableCoins.map(c => (
            <Button key={c.id} onClick={() => addSelection(c.id)} variant="outline" className="w-full justify-between mb-2">
              <span>{c.symbol.toUpperCase()}</span>
              <span className="text-muted-foreground">{c.name}</span>
            </Button>
          ))}
        </div>
      )}

      {selectedCoins.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedCoins.map(c => (
              <Card key={c.id} className="bg-card border-border flex-1 min-w-40">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg uppercase">{c.symbol}</CardTitle>
                      <CardDescription>{c.name}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSelection(c.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(c.current_price)}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${c.price_change_percentage_24h >= 0 ? "text-success" : "text-destructive"}`}>
                    {c.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-medium">{formatPercent(c.price_change_percentage_24h)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm capitalize">{metric} Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="symbol" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px" }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Bar dataKey="value" fill="var(--sidebar-primary)" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
