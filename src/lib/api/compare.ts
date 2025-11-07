import { CompareMarket } from "@/tools/compare/interface/compare"

export async function fetchCoins(): Promise<CompareMarket[]> {
  const res = await fetch("/api/compare", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch coins from API")
  }
  return res.json()
}
