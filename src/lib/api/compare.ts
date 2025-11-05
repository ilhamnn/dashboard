import { CompareMarket } from "@/tools/compare/api/compare"

export async function fetchCoins(): Promise<CompareMarket[]> {
  const res = await fetch("/api/compare", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch coins from API")
  }
  return res.json()
}
