// app/api/market/coins/route.ts
import { NextResponse } from "next/server"
import { MarketService } from "@/lib/services/watch-service"

export async function GET() {
  const data = await MarketService.fetchCoinsList()

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  })
}