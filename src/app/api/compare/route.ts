import { NextResponse } from "next/server"
import { getTopCoins } from "@/lib/services/compare-market"

export async function GET() {
  try {
    const coins = await getTopCoins()
    return NextResponse.json(coins)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
