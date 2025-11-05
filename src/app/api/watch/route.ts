// app/api/market/route.ts
import { NextRequest, NextResponse } from "next/server"
import { MarketService } from "@/lib/services/watch-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ids = searchParams.get("ids")

  if (!ids) {
    return NextResponse.json(
      { error: "Missing coin IDs parameter" },
      { status: 400 }
    )
  }

  const coinIds = ids.split(",")
  const data = await MarketService.fetchMarketData(coinIds)

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  })
}