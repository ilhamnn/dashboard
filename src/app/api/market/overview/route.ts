import { NextResponse } from "next/server"
import { getMarketData } from "@/lib/services/market-service"

export async function GET() {
  try {
    const data = await getMarketData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in /api/market route:", error)
    return NextResponse.json(
      { error: "Failed to fetch market data", details: error.message },
      { status: 500 }
    )
  }
}
