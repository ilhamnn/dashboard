import { NextResponse } from "next/server"
import { getMarketData } from "@/lib/services/market-service"

export async function GET() {
  try {
    const data = await getMarketData()
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error in /api/market route:", error)

    const message = error instanceof Error ? error.message : String(error)

    return NextResponse.json(
      { error: "Failed to fetch market data", details: message },
      { status: 500 }
    )
  }
}
