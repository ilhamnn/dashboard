import { NextResponse } from "next/server"
import { getCryptoHeatmapData } from "@/lib/services/market-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "8")

    const data = await getCryptoHeatmapData(limit)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch crypto heatmap data" },
      { status: 500 }
    )
  }
}